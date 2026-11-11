// panel.js — unified create/edit form. currentTable=null means create, set means edit.

// ── Tag chip helpers ──────────────────────────────────────────────────────

function _getTags() {
  return Array.from(document.querySelectorAll('#tag-chips .tag-chip'))
    .map(c => c.dataset.tag);
}

function _setTags(tags) {
  document.getElementById('tag-chips').innerHTML = '';
  (tags || []).forEach(_addTagChip);
}

function _addTagChip(tag) {
  tag = tag.trim();
  if (!tag || _getTags().includes(tag)) return;
  const chip = document.createElement('span');
  chip.className = 'tag-chip';
  chip.dataset.tag = tag;
  chip.innerHTML = `${esc(tag)}<button type="button" data-action="remove-tag" title="Remove">&times;</button>`;
  document.getElementById('tag-chips').appendChild(chip);
}

function _commitTagInput() {
  const input = document.getElementById('tag-input');
  input.value.split(',').forEach(t => _addTagChip(t));
  input.value = '';
}

// Commit on Enter or comma keydown
document.addEventListener('keydown', e => {
  if (e.target.id !== 'tag-input') return;
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    _commitTagInput();
  }
});

// Filename auto-sync: follow the title unless the user has manually edited it
let filenameManuallyEdited = false;

document.addEventListener('input', e => {
  if (e.target.id === 'p-title' && !filenameManuallyEdited) {
    document.getElementById('p-filename').value = slugify(e.target.value.trim());
  }
});

document.addEventListener('click', e => {
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;

  switch (action) {
    case 'select-table':
      selectTable(id);
      break;
    case 'export-table':
      exportTable(id);
      break;
    case 'confirm-remove':
      confirmRemove(id);
      break;
    case 'remove-table':
      doRemove(id);
      break;
    case 'cancel-remove':
      renderTableList();
      break;
    case 'remove-tag':
      actionEl.closest('.tag-chip')?.remove();
      break;
    case 'toggle-sort':
      sidebarState.sortDirection = sidebarState.sortDirection === 'asc' ? 'desc' : 'asc';
      renderTableList();
      break;
    case 'toggle-category': {
      const category = decodeURIComponent(actionEl.dataset.category || '');
      const key = category || 'Uncategorized';
      sidebarState.collapsedCategories[key] = !sidebarState.collapsedCategories[key];
      renderTableList();
      break;
    }
  }
});

// ── Form read/write ───────────────────────────────────────────────────────

function _readPanel(commit = true) {
  if (commit) _commitTagInput();
  return {
    title:       document.getElementById('p-title').value.trim() || 'Untitled',
    description: document.getElementById('p-desc').value.trim(),
    category:    document.getElementById('p-category').value.trim(),
    tags:        _getTags(),
    items:       readItems('p-items'),
  };
}

function _readFilename() {
  const raw = document.getElementById('p-filename').value.trim();
  // Ensure it always ends with .json
  if (!raw) return slugify(document.getElementById('p-title').value.trim() || 'untitled');
  return raw.endsWith('.json') ? raw : raw + '.json';
}

function _clearPanel() {
  document.getElementById('p-title').value    = '';
  document.getElementById('p-desc').value     = '';
  document.getElementById('p-category').value = '';
  document.getElementById('p-filename').value = '';
  filenameManuallyEdited = false;
  _setTags([]);
  document.getElementById('tag-input').value = '';
  document.getElementById('p-items').innerHTML = '';
  document.getElementById('panel-status').className = 'status';
}

// ── Panel actions ─────────────────────────────────────────────────────────

function panelNew() {
  setCurrentTable(null);
  renderTableList();
  document.getElementById('panel-heading').textContent = 'New Table';
  _clearPanel();
  _refreshPreview();
  switchTab('edit');
}

function panelLoad(id) {
  const entry = state.tables.find(t => t.id === id);
  if (!entry) return;
  document.getElementById('panel-heading').textContent = 'Edit table';
  document.getElementById('p-title').value    = entry.data.title;
  document.getElementById('p-desc').value     = entry.data.description || '';
  document.getElementById('p-category').value = entry.data.category || '';
  document.getElementById('p-filename').value = entry.filename;
  filenameManuallyEdited = true; // treat loaded filename as intentional
  _setTags(entry.data.tags || []);
  document.getElementById('tag-input').value = '';
  const container = document.getElementById('p-items');
  container.innerHTML = '';
  entry.data.items.forEach(item => addItemCard('p-items', item));
  document.getElementById('panel-status').className = 'status';
  _refreshPreview();
}

function panelSave() {
  const data = _readPanel();
  const err  = validateSchema(data);
  if (err) { showStatus('panel-status', 'err', err); return; }

  const currentId = state.currentTableId;
  if (currentId) {
    updateTable(currentId, data, _readFilename());
    showStatus('panel-status', 'ok', 'Saved.');
  } else {
    const table = addTable(data, _readFilename());
    document.getElementById('panel-heading').textContent = 'Edit table';
    showStatus('panel-status', 'ok', `"${data.title}" added.`);
    // Populate roll header and auto-roll
    document.getElementById('roll-title').textContent = data.title;
    document.getElementById('roll-desc').textContent  = data.description || '';
    document.getElementById('roll-prompt').style.display = 'none';
    document.getElementById('roll-area').style.display   = '';
    setCurrentTable(table.id);
    roll();
  }
  renderTableList();
  _refreshPreview();
}

function panelExport() {
  const data = _readPanel();
  const err  = validateSchema(data);
  if (err) { showStatus('panel-status', 'err', err); return; }
  downloadJSON(data, _readFilename());
}

// ── Table list (left sidebar) ─────────────────────────────────────────────

const sidebarState = {
  sortDirection: 'asc',
  collapsedCategories: {},
};

function _tableCategoryName(table) {
  const name = (table?.data?.category || '').trim();
  return name || 'Uncategorized';
}

function _tableSortValue(table) {
  return (table?.data?.title || '').trim().toLowerCase();
}

function renderTableList() {
  const list  = document.getElementById('table-list');
  const empty = document.getElementById('table-list-empty');
  const sortBtn = document.getElementById('table-sort-toggle');
  const query = (document.getElementById('table-search')?.value || '').trim().toLowerCase();

  if (sortBtn) {
    sortBtn.textContent = sidebarState.sortDirection === 'asc' ? 'Sort: A→Z' : 'Sort: Z→A';
  }

  const visible = query
    ? state.tables.filter(t => {
        const inTitle = t.data.title.toLowerCase().includes(query);
        const inCategory = (t.data.category || '').toLowerCase().includes(query);
        const inTags  = (t.data.tags || []).some(tag => tag.toLowerCase().includes(query));
        return inTitle || inCategory || inTags;
      })
    : state.tables;

  if (!state.tables.length) {
    list.innerHTML = '';
    empty.textContent = 'No tables loaded.';
    empty.style.display = '';
    return;
  }
  if (!visible.length) {
    list.innerHTML = '';
    empty.textContent = 'No tables match your search.';
    empty.style.display = '';
    return;
  }

  const grouped = new Map();
  visible.forEach(table => {
    const category = _tableCategoryName(table);
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category).push(table);
  });

  const categories = [...grouped.keys()].sort((a, b) => a.localeCompare(b));
  if (sidebarState.sortDirection === 'desc') categories.reverse();

  empty.style.display = 'none';
  list.innerHTML = categories.map(category => {
    const tables = [...grouped.get(category)].sort((a, b) => _tableSortValue(a).localeCompare(_tableSortValue(b)));
    if (sidebarState.sortDirection === 'desc') tables.reverse();
    const isCollapsed = Boolean(sidebarState.collapsedCategories[category]);
    const rows = tables.map(t => `
      <div class="table-entry" id="te-${t.id}" data-action="select-table" data-id="${t.id}">
        <div class="entry-title${state.currentTableId === t.id ? ' active' : ''}">${esc(t.data.title)}</div>
        <div class="entry-filename">${esc(t.filename)}</div>
        ${(t.data.tags||[]).length
          ? `<div class="entry-tags">${t.data.tags.map(tag => `<span class="entry-tag">${esc(tag)}</span>`).join('')}</div>`
          : ''}
        <div class="entry-actions">
          <button type="button" data-action="export-table" data-id="${t.id}">Export</button>
          <button type="button" class="danger" data-action="confirm-remove" data-id="${t.id}">Remove</button>
        </div>
      </div>`).join('');

    return `
      <div class="category-group${isCollapsed ? ' collapsed' : ''}">
        <button type="button" class="category-header" data-action="toggle-category" data-category="${encodeURIComponent(category)}">
          <span>${esc(category)}</span>
          <span class="category-chevron">${isCollapsed ? '▸' : '▾'}</span>
        </button>
        <div class="category-body" ${isCollapsed ? 'hidden' : ''}>${rows}</div>
      </div>`;
  }).join('');
}

function exportTable(id) {
  const t = state.tables.find(t => t.id === id);
  if (t) downloadJSON(t.data, t.filename);
}

function exportAll() {
  state.tables.forEach(t => downloadJSON(t.data, t.filename));
}

function confirmRemove(id) {
  const row = document.getElementById('te-' + id);
  row.querySelectorAll('button').forEach(b => b.style.display = 'none');
  const span = document.createElement('span');
  span.className = 'muted';
  span.style.cssText = 'display:flex;gap:4px;align-items:center;flex-wrap:wrap;';
  span.innerHTML = `Remove?
    <button type="button" data-action="remove-table" data-id="${id}">Yes</button>
    <button type="button" data-action="cancel-remove">No</button>`;
  row.appendChild(span);
}

function doRemove(id) {
  removeTable(id);
  if (state.currentTableId === null && document.getElementById('roll-area')) {
    document.getElementById('roll-prompt').style.display = '';
    document.getElementById('roll-area').style.display   = 'none';
    panelNew();
  }
  renderTableList();
}

// ── JSON import into edit form ────────────────────────────────────────────

function importFromEditPane() {
  const raw = document.getElementById('json-import-text').value.trim();
  const st  = 'json-import-status';
  if (!raw) { showStatus(st, 'err', 'Nothing to import.'); return; }
  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) {
    showStatus(st, 'err', 'JSON parse error: ' + e.message); return;
  }
  const err = validateSchema(parsed);
  if (err) { showStatus(st, 'err', err); return; }

  // Populate form fields without touching session state
  document.getElementById('p-title').value = parsed.title || '';
  document.getElementById('p-desc').value  = parsed.description || '';
  document.getElementById('p-category').value = parsed.category || '';
  _setTags(parsed.tags || []);
  document.getElementById('tag-input').value = '';
  const container = document.getElementById('p-items');
  container.innerHTML = '';
  parsed.items.forEach(item => addItemCard('p-items', item));

  // Auto-fill filename from parsed title (user can override)
  document.getElementById('p-filename').value = slugify(parsed.title || 'untitled');
  filenameManuallyEdited = false;
  showStatus(st, 'ok', 'Loaded. Review and hit Save to keep it.');
  document.getElementById('json-import-text').value = '';
  document.getElementById('json-import').open = false;
  _refreshPreview();
}
