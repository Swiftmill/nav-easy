const addressBar = document.querySelector('#address-bar');
const startScreen = document.querySelector('#start-screen');
const browserView = document.querySelector('#browser-view');
const startSearchForm = document.querySelector('#start-search-form');
const startSearchInput = document.querySelector('#start-search-input');
const goButton = document.querySelector('#btn-go');
const btnBack = document.querySelector('#btn-back');
const btnForward = document.querySelector('#btn-forward');
const btnRefresh = document.querySelector('#btn-refresh');
const btnHome = document.querySelector('#btn-home');
const btnNewTab = document.querySelector('#btn-newtab');
const toggleTheme = document.querySelector('#toggle-theme');

const HOME_URL = 'about:blank';
const SEARCH_ENGINE = 'https://duckduckgo.com/?q=';

let navigationStack = [];
let stackIndex = -1;

function normaliseUrl(value) {
  if (!value) return '';
  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed) || /^about:blank$/i.test(trimmed)) {
    return trimmed;
  }

  if (/\./.test(trimmed)) {
    return `https://${trimmed}`;
  }

  const encoded = encodeURIComponent(trimmed);
  return `${SEARCH_ENGINE}${encoded}`;
}

function navigateTo(value, pushToHistory = true) {
  const url = normaliseUrl(value);
  if (!url) return;

  browserView.src = url;
  addressBar.value = url;

  if (pushToHistory) {
    navigationStack = navigationStack.slice(0, stackIndex + 1);
    navigationStack.push(url);
    stackIndex = navigationStack.length - 1;
  }

  hideStartScreen();
  updateNavButtons();
}

function hideStartScreen() {
  startScreen.classList.add('hidden');
}

function showStartScreen() {
  startScreen.classList.remove('hidden');
  browserView.src = HOME_URL;
  addressBar.value = '';
}

function updateNavButtons() {
  btnBack.disabled = stackIndex <= 0;
  btnForward.disabled = stackIndex >= navigationStack.length - 1;
}

addressBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    navigateTo(addressBar.value);
  }
});

goButton.addEventListener('click', () => {
  navigateTo(addressBar.value);
});

startSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  navigateTo(startSearchInput.value);
});

btnBack.addEventListener('click', () => {
  if (stackIndex > 0) {
    stackIndex -= 1;
    const url = navigationStack[stackIndex];
    navigateTo(url, false);
  }
});

btnForward.addEventListener('click', () => {
  if (stackIndex < navigationStack.length - 1) {
    stackIndex += 1;
    const url = navigationStack[stackIndex];
    navigateTo(url, false);
  }
});

btnRefresh.addEventListener('click', () => {
  if (browserView.src) {
    browserView.src = browserView.src;
  }
});

btnHome.addEventListener('click', () => {
  showStartScreen();
});

btnNewTab.addEventListener('click', () => {
  navigationStack = [];
  stackIndex = -1;
  showStartScreen();
  updateNavButtons();
});

browserView.addEventListener('load', () => {
  const url = browserView.contentWindow?.location?.href;
  if (url && url !== 'about:blank') {
    addressBar.value = url;
  }
});

browserView.addEventListener('error', () => {
  addressBar.value = 'Impossible de charger cette page';
});

document.querySelectorAll('[data-url]').forEach((item) => {
  item.addEventListener('click', () => {
    const url = item.getAttribute('data-url');
    navigateTo(url);
  });
});

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  toggleTheme.querySelector('.icon').textContent =
    document.body.classList.contains('light-theme') ? '☀️' : '🌙';
});

updateNavButtons();
