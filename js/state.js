// Session state
const state = {
  tables: [],
  currentTableId: null,
  statusTimers: {},
  settingsOpen: false,
};

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
  el.textContent = msg;
  state.statusTimers[elId] = setTimeout(() => {
    el.className = 'status';
    delete state.statusTimers[elId];
  }, 4000);
}
