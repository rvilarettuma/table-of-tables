// Session state
const STATUS_TIMEOUT_MS = 4000;

const state = {
  tables: [],
  currentTableId: null,
  statusTimers: {},
  settingsOpen: false,
  sidebarCollapsed: false,
};

function getUiRef(id) {
  return document.getElementById(id);
}

function isMobileViewport() {
  return window.innerWidth <= 960;
}

function readFormState(commit = true) {
  const refs = {
    title: getUiRef('p-title'),
    desc: getUiRef('p-desc'),
    category: getUiRef('p-category'),
    filename: getUiRef('p-filename'),
    tags: getUiRef('tag-chips'),
    tagInput: getUiRef('tag-input'),
    items: getUiRef('p-items'),
  };

  if (commit && typeof _commitTagInput === 'function') _commitTagInput();

  return {
    title: (refs.title?.value || '').trim() || 'Untitled',
    description: (refs.desc?.value || '').trim(),
    category: (refs.category?.value || '').trim(),
    tags: Array.from(refs.tags?.querySelectorAll('.tag-chip') || []).map(el => el.dataset.tag).filter(Boolean),
    items: typeof readItems === 'function' ? readItems('p-items') : [],
  };
}

function hydrateFormState(data = {}) {
  const refs = {
    title: getUiRef('p-title'),
    desc: getUiRef('p-desc'),
    category: getUiRef('p-category'),
    filename: getUiRef('p-filename'),
    tags: getUiRef('tag-chips'),
    tagInput: getUiRef('tag-input'),
    items: getUiRef('p-items'),
    heading: getUiRef('panel-heading'),
  };

  if (refs.heading) refs.heading.textContent = 'Edit table';
  if (refs.title) refs.title.value = data.title || '';
  if (refs.desc) refs.desc.value = data.description || '';
  if (refs.category) refs.category.value = data.category || '';
  if (refs.filename) refs.filename.value = data.filename || '';
  if (refs.tagInput) refs.tagInput.value = '';

  if (refs.tags) {
    refs.tags.innerHTML = '';
    if (typeof _setTags === 'function') _setTags(data.tags || []);
  }

  if (refs.items) {
    refs.items.innerHTML = '';
    (data.items || []).forEach(item => {
      if (typeof addItemCard === 'function') addItemCard('p-items', item);
    });
  }

  if (typeof filenameManuallyEdited !== 'undefined') {
    filenameManuallyEdited = !!filenameManuallyEdited;
  } else {
    filenameManuallyEdited = false;
  }
}

function clearFormState() {
  const refs = {
    title: getUiRef('p-title'),
    desc: getUiRef('p-desc'),
    category: getUiRef('p-category'),
    filename: getUiRef('p-filename'),
    tags: getUiRef('tag-chips'),
    tagInput: getUiRef('tag-input'),
    items: getUiRef('p-items'),
    status: getUiRef('panel-status'),
  };

  if (refs.title) refs.title.value = '';
  if (refs.desc) refs.desc.value = '';
  if (refs.category) refs.category.value = '';
  if (refs.filename) refs.filename.value = '';
  if (refs.tags) refs.tags.innerHTML = '';
  if (refs.tagInput) refs.tagInput.value = '';
  if (refs.items) refs.items.innerHTML = '';
  if (refs.status) refs.status.className = 'status';
  filenameManuallyEdited = false;
}

function renderSettingsPage() {
  const settingsPage = document.getElementById('settings-page');
  const layout = document.getElementById('layout');
  if (!settingsPage || !layout) return;

  const isOpen = !!state.settingsOpen;
  settingsPage.hidden = !isOpen;
  layout.hidden = isOpen;
  document.body.classList.toggle('settings-open', isOpen);
  if (isOpen && typeof syncThemeControls === 'function') syncThemeControls();
}

function openSettings() {
  state.settingsOpen = true;
  renderSettingsPage();
}

function closeSettings() {
  state.settingsOpen = false;
  renderSettingsPage();
}

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getCurrentTable() {
  return state.tables.find(t => t.id === state.currentTableId) || null;
}

function setCurrentTable(id) {
  state.currentTableId = id;
}

function addTable(data, filename) {
  const table = { id: uid(), filename, data };
  state.tables.push(table);
  state.currentTableId = table.id;
  return table;
}

function updateTable(id, data, filename) {
  const table = state.tables.find(t => t.id === id);
  if (!table) return null;
  table.data = data;
  table.filename = filename;
  return table;
}

function removeTable(id) {
  state.tables = state.tables.filter(t => t.id !== id);
  if (state.currentTableId === id) state.currentTableId = null;
}

function validateSchema(obj) {
  if (!obj?.title?.trim())                       return '"title" is required.';
  if (!Array.isArray(obj.items) || !obj.items.length) return '"items" must be a non-empty array.';
  if (obj.category !== undefined && typeof obj.category !== 'string') return '"category" must be a string if present.';
  for (let i = 0; i < obj.items.length; i++) {
    const item = obj.items[i];
    if (typeof item.subject !== 'string')        return `items[${i}].subject must be a string.`;
    if (!Array.isArray(item.options) || !item.options.length)
                                                 return `items[${i}].options must be non-empty.`;
    for (let j = 0; j < item.options.length; j++) {
      if (typeof item.options[j].text !== 'string')
                                                 return `items[${i}].options[${j}].text must be a string.`;
    }
  }
  if (obj.tags !== undefined && !Array.isArray(obj.tags)) return '"tags" must be an array if present.';
  if (obj.description !== undefined && typeof obj.description !== 'string') return '"description" must be a string if present.';
  return null;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function slugify(title) {
  return (title || 'table').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.json';
}

function downloadJSON(data, filename) {
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })),
    download: filename,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

function showStatus(elId, type, msg) {
  const el = document.getElementById(elId);
  if (!el) return;

  if (state.statusTimers[elId]) clearTimeout(state.statusTimers[elId]);

  el.className = 'status ' + type;
  el.classList.remove('status-animating');
  el.style.setProperty('--status-duration', `${STATUS_TIMEOUT_MS}ms`);
  void el.offsetWidth;
  el.classList.add('status-animating');
  el.textContent = msg;

  state.statusTimers[elId] = setTimeout(() => {
    el.className = 'status';
    el.classList.remove('status-animating');
    delete state.statusTimers[elId];
  }, STATUS_TIMEOUT_MS);
}
