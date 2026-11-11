function onFilesPicked(input) {
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => _importRaw(e.target.result, file.name);
    reader.readAsText(file);
  });
  input.value = '';
}

function _importRaw(raw, filename) {
  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) {
    showStatus('import-status', 'err', 'Parse error: ' + e.message); return;
  }
  const err = validateSchema(parsed);
  if (err) { showStatus('import-status', 'err', err); return; }
  const table = addTable(_clean(parsed), filename);
  showStatus('import-status', 'ok', `Imported "${parsed.title}".`);
  // Auto-select if nothing is active
  if (!state.currentTableId) setCurrentTable(table.id);
  if (state.currentTableId === table.id) selectTable(table.id);
  else renderTableList();
}

function _clean(obj) {
  const out = {
    title: obj.title.trim(),
    description: (obj.description || '').trim(),
    category: typeof obj.category === 'string' ? obj.category.trim() : '',
    tags: Array.isArray(obj.tags) ? obj.tags.map(t => String(t).trim()).filter(Boolean) : [],
    items: obj.items.map(item => ({
      subject: item.subject,
      options: item.options.map(o => {
        const opt = { text: o.text };
        if (Array.isArray(o.suboptions) && o.suboptions.length) opt.suboptions = o.suboptions;
        return opt;
      }),
    })),
  };
  return out;
}
