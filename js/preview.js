// preview.js — right-hand JSON preview: live view of the form, copy, collapse.

function _highlightJSON(json) {
  return esc(json).replace(/("(?:\\.|[^"\\])*")(\s*:)?/g,
    (_, str, colon) => `<span class="${colon ? 'j-key' : 'j-str'}">${str}</span>${colon || ''}`);
}

function _refreshPreview() {
  document.getElementById('preview-code').innerHTML =
    _highlightJSON(JSON.stringify(_readPanel(false), null, 2));
}

function togglePreview() {
  const panel = document.getElementById('json-preview-panel');
  if (!panel) return;
  panel.open = !panel.open;
}

function copyPreview(btn) {
  navigator.clipboard.writeText(JSON.stringify(_readPanel(false), null, 2)).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 1200);
  });
}

document.addEventListener('click', e => {
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  switch (actionEl.dataset.action) {
    case 'copy-preview':
      copyPreview(actionEl);
      break;
    case 'toggle-preview':
      togglePreview();
      break;
    case 'export-preview':
      panelExport();
      break;
  }
});

// Form changes: typing, and add/remove clicks (removal happens in the click handler, so defer a tick).
document.addEventListener('input', e => { if (e.target.closest('#tab-edit')) _refreshPreview(); });
document.addEventListener('click', e => { if (e.target.closest('#tab-edit')) setTimeout(_refreshPreview); });
_refreshPreview();
