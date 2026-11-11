function roll() {
  const entry = getCurrentTable();
  if (!entry) return;
  const results = entry.data.items.map(item => {
    const opt = item.options[Math.floor(Math.random() * item.options.length)];
    const sub = opt.suboptions?.length
      ? opt.suboptions[Math.floor(Math.random() * opt.suboptions.length)]
      : null;
    return { subject: item.subject, value: opt.text, sub };
  });
  document.getElementById('roll-results').innerHTML = results.map(r => `
    <div class="roll-result-item">
      <div class="roll-subject">${esc(r.subject)}</div>
      <div class="roll-value">${esc(r.value)}</div>
      ${r.sub ? `<div class="roll-sub">${esc(r.sub)}</div>` : ''}
    </div>`).join('');
}

function selectTable(id) {
  setCurrentTable(id);
  renderTableList();
  const entry = state.tables.find(t => t.id === id);
  document.getElementById('roll-title').textContent = entry.data.title;
  document.getElementById('roll-desc').textContent  = entry.data.description || '';
  document.getElementById('roll-tags').innerHTML    = (entry.data.tags || [])
    .map(t => `<span class="entry-tag">${esc(t)}</span>`).join('');
  document.getElementById('roll-prompt').style.display = 'none';
  document.getElementById('roll-area').style.display   = '';
  document.getElementById('roll-results').innerHTML    = '';
  roll();
  panelLoad(id);
  switchTab('roll');
}

function switchTab(name) {
  document.getElementById('tab-roll').classList.toggle('active', name === 'roll');
  document.getElementById('tab-edit').classList.toggle('active', name === 'edit');
  document.getElementById('tab-btn-roll').classList.toggle('active', name === 'roll');
  document.getElementById('tab-btn-edit').classList.toggle('active', name === 'edit');
}
