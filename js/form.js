// Shared form components used by both the creator (#cr-items) and editor (#ed-items).

function addItemCard(containerId, item = null) {
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <div class="item-card-header">
      <strong>Item</strong>
      <button type="button" class="danger" data-action="remove-item-card">Remove</button>
    </div>
    <label>Subject</label>
    <input type="text" class="item-subject" placeholder="e.g. The artifact is made of…">
    <label>Options — <span style="font-weight:400">one option per row; sub-options one per line</span></label>
    <div class="options-list"></div>
    <button type="button" data-action="add-option">+ Add option</button>`;
  document.getElementById(containerId).appendChild(card);
  if (item) {
    card.querySelector('.item-subject').value = item.subject || '';
    (item.options || []).forEach(opt => addOptionRow(card.querySelector('button:last-child'), opt));
  } else {
    addOptionRow(card.querySelector('button:last-child'));
  }
}

document.addEventListener('click', e => {
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  switch (actionEl.dataset.action) {
    case 'remove-item-card':
      actionEl.closest('.item-card')?.remove();
      break;
    case 'add-option':
      addOptionRow(actionEl);
      break;
    case 'remove-option-row':
      actionEl.closest('.option-row')?.remove();
      break;
  }
});

function addOptionRow(btn, opt = null) {
  const row = document.createElement('div');
  row.className = 'option-row';
  row.innerHTML = `
    <div class="option-row-fields">
      <input type="text" class="opt-text" placeholder="Option text">
      <textarea class="opt-subs mono" rows="2"
                placeholder="Sub-options, one per line"></textarea>
    </div>
    <button type="button" data-action="remove-option-row">✕</button>`;
  btn.closest('.item-card').querySelector('.options-list').appendChild(row);
  if (opt) {
    row.querySelector('.opt-text').value = opt.text || '';
    row.querySelector('.opt-subs').value = (opt.suboptions || []).join('\n');
  }
}

function readItems(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} .item-card`)).flatMap(card => {
    const subject = card.querySelector('.item-subject').value.trim();
    const options = Array.from(card.querySelectorAll('.option-row')).flatMap(row => {
      const text = row.querySelector('.opt-text').value.trim();
      if (!text) return [];
      const suboptions = row.querySelector('.opt-subs').value
        .split('\n').map(s => s.trim()).filter(Boolean);
      return [suboptions.length ? { text, suboptions } : { text }];
    });
    return subject && options.length ? [{ subject, options }] : [];
  });
}
