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
  if (e.target.id === 'table-search') {
    renderTableList();
  }
  if (e.target.id === 'p-filename') {
    filenameManuallyEdited = true;
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'table-import') {
    onFilesPicked(e.target);
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
    case 'toggle-sidebar':
      toggleSidebar();
      break;
    case 'toggle-category': {
      const category = decodeURIComponent(actionEl.dataset.category || '');
      const key = category || 'Uncategorized';
      sidebarState.collapsedCategories[key] = !sidebarState.collapsedCategories[key];
      renderTableList();
      break;
    }
    case 'new-table':
      panelNew();
      break;
    case 'switch-tab':
      switchTab(actionEl.dataset.tab || 'roll');
      break;
    case 'roll-table':
      roll();
      break;
    case 'focus-tag-input':
      document.getElementById('tag-input')?.focus();
      break;
    case 'add-item-card':
      addItemCard('p-items');
      break;
    case 'save-panel':
      panelSave();
      break;
    case 'export-panel':
      panelExport();
      break;
    case 'import-from-edit':
      importFromEditPane();
      break;
    case 'clear-import-text':
      document.getElementById('json-import-text').value = '';
      break;
    case 'toggle-theme':
      toggleTheme();
      break;
    case 'open-settings':
      openSettings();
      break;
    case 'close-settings':
      closeSettings();
      break;
  }
});

// ── Form read/write ───────────────────────────────────────────────────────

function _readPanel(commit = true) {
  return readFormState(commit);
}

function _readFilename() {
  const raw = (getUiRef('p-filename')?.value || '').trim();
  if (!raw) return slugify((getUiRef('p-title')?.value || '').trim() || 'untitled');
  return raw.endsWith('.json') ? raw : raw + '.json';
}

function _clearPanel() {
  clearFormState();
}

// ── Panel actions ─────────────────────────────────────────────────────────

function panelNew() {
  setCurrentTable(null);
  renderTableList();
  const heading = getUiRef('panel-heading');
  if (heading) heading.textContent = 'New Table';
  _clearPanel();
  _refreshPreview();
  switchTab('edit');
}

function panelLoad(id) {
  const entry = state.tables.find(t => t.id === id);
  if (!entry) return;

  const heading = getUiRef('panel-heading');
  if (heading) heading.textContent = 'Edit table';

  hydrateFormState({
    title: entry.data.title,
    description: entry.data.description || '',
    category: entry.data.category || '',
    filename: entry.filename,
    tags: entry.data.tags || [],
    items: entry.data.items || [],
  });

  filenameManuallyEdited = true;
  const status = getUiRef('panel-status');
  if (status) status.className = 'status';
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

function toggleSidebar() {
  if (window.innerWidth > 960) return;
  const layout = document.getElementById('layout');
  if (!layout) return;

  state.sidebarCollapsed = !state.sidebarCollapsed;
  layout.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);

  const button = document.querySelector('[data-action="toggle-sidebar"]');
  if (!button) return;
  const path = button.querySelector('path');
  if (path) {
    path.setAttribute('d', 'M4 7h16M4 12h16M4 17h16');
  }
  button.setAttribute('aria-label', state.sidebarCollapsed ? 'Expand tables sidebar' : 'Collapse tables sidebar');
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

  hydrateFormState({
    title: parsed.title || '',
    description: parsed.description || '',
    category: parsed.category || '',
    filename: slugify(parsed.title || 'untitled'),
    tags: parsed.tags || [],
    items: parsed.items || [],
  });

  filenameManuallyEdited = false;
  showStatus(st, 'ok', 'Loaded. Review and hit Save to keep it.');
  document.getElementById('json-import-text').value = '';
  document.getElementById('json-import').open = false;
  _refreshPreview();
}
