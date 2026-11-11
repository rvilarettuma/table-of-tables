function syncMobileSidebarState() {
  const layout = document.getElementById('layout');
  if (!layout) return;

  const isMobile = window.innerWidth <= 960;
  state.sidebarCollapsed = isMobile;
  layout.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);

  const button = document.querySelector('[data-action="toggle-sidebar"]');
  if (!button) return;
  const path = button.querySelector('path');
  if (path) {
    path.setAttribute('d', isMobile ? 'M4 7h16M4 12h16M4 17h16' : 'M4 7h16M4 12h16M4 17h16');
  }
  button.setAttribute('aria-label', isMobile ? 'Expand tables sidebar' : 'Collapse tables sidebar');
}

window.addEventListener('resize', syncMobileSidebarState);
syncMobileSidebarState();
renderTableList();
