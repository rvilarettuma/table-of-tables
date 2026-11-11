// theme.js — theme preference: 'system' (default) | 'light' | 'dark'. Loaded in <head> so the theme applies before first paint.

const THEME_KEY = 'theme-pref';
const _darkMq = matchMedia('(prefers-color-scheme: dark)');
const THEME_OPTIONS = [
  'system',
  'tabularium-light',
  'tabularium-dark',
  'solarized-light',
  'solarized-dark',
  'verdant-light',
  'verdant-dark'
];

const THEMES = {
  'tabularium-light': {
    background: '#fff9eb',
    panel: '#fffdf8',
    'panel-alt': '#faf4e4',
    field: '#ffffff',
    text: '#292524',
    'text-soft': '#78716c',
    primary: '#991b1b',
    secondary: '#7f1d1d',
    accent: '#991b1b',
    border: '#dfdacc',
    danger: '#991b1b',
    'focus-ring': 'rgba(153, 27, 27, 0.12)',
  },
  'tabularium-dark': {
    background: '#0e1117',
    panel: '#161b22',
    'panel-alt': '#1b232d',
    field: '#0e1117',
    text: '#e6edf3',
    'text-soft': '#8b949e',
    primary: '#d4a359',
    secondary: '#e5b774',
    accent: '#d4a359',
    border: '#30363d',
    danger: '#b91c1c',
    'focus-ring': 'rgba(212, 163, 89, 0.12)',
  },
  'solarized-light': {
    background: '#fdf6e3',
    panel: '#fefbf5',
    'panel-alt': '#f2ebdc',
    field: '#fffdf9',
    text: '#002b36',
    'text-soft': '#657b83',
    primary: '#b58900',
    secondary: '#a66900',
    accent: '#b58900',
    border: '#d6d2c4',
    danger: '#dc322f',
    'focus-ring': 'rgba(181, 137, 0, 0.18)',
  },
  'solarized-dark': {
    background: '#002b36',
    panel: '#073642',
    'panel-alt': '#0e4450',
    field: '#042b33',
    text: '#fdf6e3',
    'text-soft': '#93a1a1',
    primary: '#859900',
    secondary: '#9db000',
    accent: '#859900',
    border: '#325b63',
    danger: '#dc322f',
    'focus-ring': 'rgba(133, 153, 0, 0.2)',
  },
  'verdant-light': {
    background: '#f8f9f6',
    panel: '#fdfefc',
    'panel-alt': '#edf3ea',
    field: '#ffffff',
    text: '#161810',
    'text-soft': '#5f655f',
    primary: '#8d9c63',
    secondary: '#aac7a9',
    accent: '#8fb79a',
    border: '#d7dfd1',
    danger: '#7a8c52',
    'focus-ring': 'rgba(141, 156, 99, 0.18)',
  },
  'verdant-dark': {
    background: '#080906',
    panel: '#101510',
    'panel-alt': '#1d281e',
    field: '#0d120d',
    text: '#edefe7',
    'text-soft': '#9ea89d',
    primary: '#8d9c63',
    secondary: '#395638',
    accent: '#487053',
    border: '#2d3a2f',
    danger: '#9db57d',
    'focus-ring': 'rgba(72, 112, 83, 0.22)',
  },
};

function _themePref() {
  try {
    const pref = localStorage.getItem(THEME_KEY) || 'system';
    return THEME_OPTIONS.includes(pref) ? pref : 'system';
  } catch (e) {
    return 'system';
  }
}

function _themeResolved() {
  const p = _themePref();
  if (p === 'system') return _darkMq.matches ? 'tabularium-dark' : 'tabularium-light';
  return p;
}

function _themeFamily(theme) {
  if (!theme || theme === 'system') return null;
  if (theme.startsWith('tabularium-')) return 'tabularium';
  if (theme.startsWith('solarized-')) return 'solarized';
  if (theme.startsWith('verdant-')) return 'verdant';
  return null;
}

function syncThemeControls() {
  const select = document.getElementById('theme-select');
  if (select) select.value = _themePref();
}

function applyTheme() {
  const t = _themeResolved();
  const themeColors = THEMES[t] || THEMES['tabularium-light'];

  Object.entries(themeColors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });

  document.documentElement.dataset.theme = t;
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = t.includes('dark') ? '☀' : '☾';
  syncThemeControls();
}

function setTheme(pref) {
  const next = THEME_OPTIONS.includes(pref) ? pref : 'system';
  try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage blocked: applies for this page only */ }
  applyTheme();
}

function toggleTheme() {
  const current = _themeResolved();
  const family = _themeFamily(current);

  if (!family) {
    setTheme(_darkMq.matches ? 'tabularium-dark' : 'tabularium-light');
    return;
  }

  const mode = current.endsWith('-dark') ? 'light' : 'dark';
  setTheme(`${family}-${mode}`);
}

document.addEventListener('change', e => {
  if (e.target && e.target.id === 'theme-select') setTheme(e.target.value);
});

_darkMq.addEventListener('change', applyTheme);
document.addEventListener('DOMContentLoaded', applyTheme);
applyTheme();
