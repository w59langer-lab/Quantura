// ===========================
// DE: Gemeinsames Verhalten für Level-System
// EN: Shared behavior for the level system
// RU: ÐžÐ±Ñ‰Ð°Ñ Ð»Ð¾Ð³Ð¸ÐºÐ° Ð´Ð»Ñ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹ ÑƒÑ€Ð¾Ð²Ð½ÐµÐ¹
// ===========================
function getModuleRoot() {
  // Prefer the script URL so it works whether the app is hosted at /
  // or under a sub-path (e.g. /math_module).
  const script = document.currentScript;
  if (script && script.src) {
    try {
      const url = new URL(script.src, window.location.origin);
      return url.pathname.replace(/\/core\/scripts\.js(?:\\?.*)?$/, '');
    } catch (_) { /* fall through */ }
  }
  const p = window.location.pathname;
  const idx = p.indexOf('/math_module/');
  if (idx !== -1) return p.slice(0, idx) + '/math_module';
  const parts = p.split('/');
  parts.pop(); // drop file
  const root = parts.join('/') || '.';
  return root;
}
const MODULE_ROOT = getModuleRoot();

const basePath = window.location.pathname.includes('/levels/') ? '..' : '.';
const PROGRESS_KEY = 'math_module_progress_v1';
const ATTEMPTS_KEY = 'math_module_attempts_v1';
const STATE_VERSION = 2;
const USER_SESSION_KEY = 'll_user_name_session';
const PLAYER_NAME_KEY = 'll_playerName';
const TEAM_ID_KEY = 'll_teamId';
const WELCOME_SHOWN_KEY = 'll_welcome_shown';
const GAME_ACTIVE_KEY = 'll_game_active';
const SLIDE_KEY = 'math_module_slide_v1';
const GENERATED_KEY = 'math_module_generated_tasks_v1';
const TIMER_KEY = 'math_module_timer_v1';
const AVATAR_KEY = 'math_module_avatar_v1';
const THEME_KEY = 'math_module_theme_v1';
const BG_MODE_KEY = 'math_module_bg_mode_v1';
const BONUS_STORE_KEY = 'math_module_bonus_store_v1';
const BONUS_STEP_SECONDS = 60; // Bonus-Berechnung pro Minute Restzeit
const BONUS_POINTS_PER_STEP = 2;
const BONUS_JAR_CAP = 120;
let timerInterval = null;
let toastHideTimeout = null;

// Asset root (funktioniert mit file:// und Server)
// Zeigt auf das Modul selbst, damit assets unter /math_module/assets/ gefunden werden
const SITE_ROOT = MODULE_ROOT || '.';

function normalizeAsset(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith('/assets/')) return `${SITE_ROOT}${path}`;
  if (path.startsWith('/')) return path; // already root-absolute (outside assets)
  return `${SITE_ROOT}/${path.replace(/^\/+/, '')}`;
}

function canonicalTheme(path) {
  if (!path) return '';
  const name = path.split('/').pop();
  const match = THEMES.find(t => t.endsWith(name));
  return match || '';
}

// Asset catalogs (absolute URLs from site root)
const AVATARS = [
  `${SITE_ROOT}/assets/avatars/pinguin.jpg`,
  `${SITE_ROOT}/assets/avatars/panda.jpg`,
  `${SITE_ROOT}/assets/avatars/frosch.jpg`,
  `${SITE_ROOT}/assets/avatars/eichhoernchen.jpg`,
  `${SITE_ROOT}/assets/avatars/tigr.jpg`,
];

const THEMES = [
  `${SITE_ROOT}/assets/themes/penguin.jpg`,
  `${SITE_ROOT}/assets/themes/panda.jpg`,
  `${SITE_ROOT}/assets/themes/frog.jpg`,
  `${SITE_ROOT}/assets/themes/squirrel.jpg`,
  `${SITE_ROOT}/assets/themes/tigr.jpg`,
];
const TEAM_NAMES = ['Pinguin', 'Panda', 'Frosch', 'Eichhoernchen', 'Tiger'];
const TEAM_TONES = [
  { accent: '#3b82f6', accentStrong: '#1d4ed8', onAccent: '#ffffff', accentSoft: '#e0ecff', accentBorder: '#b6ccff' },
  { accent: '#f59e0b', accentStrong: '#b45309', onAccent: '#ffffff', accentSoft: '#fff2d8', accentBorder: '#f5d39a' },
  { accent: '#22c55e', accentStrong: '#15803d', onAccent: '#ffffff', accentSoft: '#defbe8', accentBorder: '#b6edc8' },
  { accent: '#06b6d4', accentStrong: '#0e7490', onAccent: '#ffffff', accentSoft: '#ddf7fd', accentBorder: '#a7e9f6' },
  { accent: '#ef4444', accentStrong: '#b91c1c', onAccent: '#ffffff', accentSoft: '#ffe1e1', accentBorder: '#f8b5b5' },
];

// Keep theme in sync with avatar by index (fallback: random theme)
function themeForAvatar(avatarPath) {
  const idx = AVATARS.indexOf(avatarPath);
  if (idx >= 0 && THEMES[idx]) return THEMES[idx];
  return pickRandom(THEMES);
}

function setAvatarAndThemeByIndex(idx) {
  const avatar = AVATARS[idx % AVATARS.length];
  setAvatar(avatar); // setAvatar handles paired theme
}

function teamNameForAvatar(avatarPath) {
  const idx = AVATARS.indexOf(normalizeAsset(avatarPath));
  return TEAM_NAMES[idx] || 'Avatar';
}

function applyTeamToneByAvatar(avatarPath) {
  const idx = AVATARS.indexOf(normalizeAsset(avatarPath));
  const tone = TEAM_TONES[idx] || TEAM_TONES[0];
  const root = document.documentElement;
  if (!root || !tone) return;
  root.style.setProperty('--team-accent', tone.accent);
  root.style.setProperty('--team-accent-strong', tone.accentStrong);
  root.style.setProperty('--team-on-accent', tone.onAccent);
  root.style.setProperty('--team-accent-soft', tone.accentSoft);
  root.style.setProperty('--team-accent-border', tone.accentBorder);
}


// DE: Kurze Hinweise pro Level (UI nur DE/EN)
// EN: Short hints per level (UI DE/EN only)
// RU: ÐŸÐ¾Ð´ÑÐºÐ°Ð·ÐºÐ¸ ÑƒÑ€Ð¾Ð²Ð½Ñ (Ð´Ð»Ñ UI Ð±ÐµÐ· Ñ€ÑƒÑÑÐºÐ¾Ð³Ð¾ Ñ‚ÐµÐºÑÑ‚Ð°)
const LEVEL_HINTS = {
  '0': 'Rechne sauber: plus und minus bis 10. Nutze Finger oder Skizze.',
  '1': 'Addieren bis 20: zuerst auf 10 auffüllen, dann den Rest addieren.',
  '2': 'Subtraktion: Zahlengerade denken. Von groß nach klein rückwärts zählen.',
  '3': 'Multiplikation bis 100: Nutze Päckchen (5er, 10er) und Zerlegen.',
  '4': 'Division ohne Rest: Prüfe, ob die Zahl im Multiplikationsfeld liegt.',
  '5': 'Zwei Schritte: erst Plus, dann Minus (oder umgekehrt). Klammern helfen.',
  '6': 'Gemischt: Reihenfolge beachten. Multiplizieren/Dividieren vor Addieren.',
};

// DE: Laufende Level-Stats für Pop-ups
// EN: Current level stats for popups
// RU: Ð¢ÐµÐºÑƒÑ‰Ð°Ñ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÑƒÑ€Ð¾Ð²Ð½Ñ Ð´Ð»Ñ Ð¼Ð¾Ð´Ð°Ð»Ð¾Ðº
let currentLevelStats = null;
let bonusJarFlashTimeout = null;
let lastBonusEarned = 0;

// DE: Einfacher Drag-Support für Modalfenster
// EN: Simple drag support for modal windows
// RU: ÐŸÑ€Ð¾ÑÑ‚Ð¾Ðµ Ð¿ÐµÑ€ÐµÑ‚Ð°ÑÐºÐ¸Ð²Ð°Ð½Ð¸Ðµ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð¾ÐºÐ¾Ð½
function makeDraggable(box, handle) {
  if (!box || !handle) return;
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  const start = ev => {
    dragging = true;
    const rect = box.getBoundingClientRect();
    offsetX = ev.clientX - rect.left;
    offsetY = ev.clientY - rect.top;
    box.style.transform = 'none';
    box.style.left = `${rect.left}px`;
    box.style.top = `${rect.top}px`;
  };
  const move = ev => {
    if (!dragging) return;
    box.style.left = `${ev.clientX - offsetX}px`;
    box.style.top = `${ev.clientY - offsetY}px`;
  };
  const stop = () => { dragging = false; };
  handle.addEventListener('mousedown', start);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stop);
}

function ensureModal(id, titleText = 'Info') {
  let overlay = document.getElementById(id);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-window" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <div class="modal-header">
          <h3 id="${id}-title"></h3>
          <button type="button" class="modal-close" aria-label="Schließen" data-de="Schließen" data-en="Close">×</button>
        </div>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', ev => {
      if (ev.target === overlay) overlay.classList.remove('is-visible');
    });
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('is-visible'));
    const box = overlay.querySelector('.modal-window');
    const header = overlay.querySelector('.modal-header');
    makeDraggable(box, header);
  }
  const h3 = overlay.querySelector('h3');
  if (h3) h3.textContent = titleText;
  const body = overlay.querySelector('.modal-body');
  return { overlay, body };
}

function openModal(id, titleText, html) {
  const { overlay, body } = ensureModal(id, titleText);
  if (body) body.innerHTML = html;
  applyBilingualLabels(overlay);
  overlay.classList.add('is-visible');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('is-visible');
}

const BG_ONLY_CLASS = 'background-only';
const BG_ONLY_LAYER_ID = 'bgOnlyExitLayer';
let bgOnlyBound = false;
let bgOnlyActive = false;
let bgOnlyRestores = [];

function detectBackgroundHost() {
  const bodyBg = window.getComputedStyle(document.body).backgroundImage;
  if (bodyBg && bodyBg !== 'none') return document.body;
  const nodes = Array.from(document.body.querySelectorAll('*'));
  for (const el of nodes) {
    const bg = window.getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none') return el;
  }
  return document.body;
}

function ensureBgOnlyExitLayer() {
  let layer = document.getElementById(BG_ONLY_LAYER_ID);
  if (!layer) {
    layer = document.createElement('div');
    layer.id = BG_ONLY_LAYER_ID;
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    layer.addEventListener('click', () => disableBackgroundOnly());
    layer.addEventListener('touchstart', () => disableBackgroundOnly(), { passive: true });
  }
  return layer;
}

function collectBgOnlyTargets(layer, backgroundHost) {
  const set = new Set();
  const children = Array.from(document.body.children);
  children.forEach(el => {
    if (el === layer) return;
    if (backgroundHost !== document.body && el === backgroundHost) return;
    set.add(el);
  });
  if (backgroundHost && backgroundHost !== document.body) {
    Array.from(backgroundHost.querySelectorAll('*')).forEach(el => set.add(el));
  }
  return Array.from(set);
}

function disableBackgroundOnly() {
  if (!bgOnlyActive) return;
  bgOnlyRestores.forEach(({ el, visibility, pointerEvents }) => {
    el.style.visibility = visibility;
    el.style.pointerEvents = pointerEvents;
  });
  bgOnlyRestores = [];
  bgOnlyActive = false;
  document.body.classList.remove(BG_ONLY_CLASS);
}

function enableBackgroundOnly() {
  if (bgOnlyActive) return;
  const layer = ensureBgOnlyExitLayer();
  document.body.appendChild(layer);
  const backgroundHost = detectBackgroundHost();
  bgOnlyRestores = [];
  collectBgOnlyTargets(layer, backgroundHost).forEach(el => {
    bgOnlyRestores.push({
      el,
      visibility: el.style.visibility || '',
      pointerEvents: el.style.pointerEvents || '',
    });
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
  });
  bgOnlyActive = true;
  document.body.classList.add(BG_ONLY_CLASS);
}

function initBackgroundOnly() {
  if (bgOnlyBound) return;
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape') return;
    if (!bgOnlyActive) return;
    ev.preventDefault();
    disableBackgroundOnly();
  });
  bgOnlyBound = true;
}

function setBgMode(mode, { persist = true } = {}) {
  const m = mode === 'light' ? 'light' : mode === 'dark' ? 'dark' : 'image';
  document.body.dataset.bgMode = m;
  if (m === 'light' || m === 'dark') {
    document.documentElement.dataset.theme = m;
    document.body.dataset.theme = m;
    window.__force_plain_theme = true;
  } else {
    window.__force_plain_theme = false;
  }
  if (persist) {
    try { localStorage.setItem(BG_MODE_KEY, m); } catch (_) { /* ignore */ }
  }
}

function initBgMode() {
  let saved = null;
  try { saved = localStorage.getItem(BG_MODE_KEY); } catch (_) { /* ignore */ }
  if (saved !== 'light' && saved !== 'dark' && saved !== 'image') {
    let hdrTheme = null;
    try { hdrTheme = localStorage.getItem('lg_theme'); } catch (_) { /* ignore */ }
    if (hdrTheme === 'light' || hdrTheme === 'dark') saved = hdrTheme;
    else saved = 'image';
  }
  setBgMode(saved, { persist: false });
}

function isVisible(el) {
  if (!el) return false;
  if (el.hidden) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  if (el.offsetParent !== null) return true;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function findVisible(selectorList, root = document) {
  const selectors = Array.isArray(selectorList) ? selectorList : [selectorList];
  for (const sel of selectors) {
    const nodes = root.querySelectorAll(sel);
    for (const node of nodes) {
      if (isVisible(node)) return node;
    }
  }
  return null;
}

function findVisibleConfirmButton(root) {
  const byId = findVisible(
    ['#name-submit', '#name-confirm', '#start', '#ok', '#confirm', '[data-action="confirm"]'],
    root
  );
  if (byId) return byId;
  const candidates = Array.from(root.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"]'));
  return candidates.find(el => {
    if (!isVisible(el)) return false;
    const txt = ((el.textContent || el.value || '').trim()).toLowerCase();
    return /weiter|ok|start|bestätigen|bestaetigen|continue|confirm|los/.test(txt);
  }) || null;
}

function getActiveWelcomePopup() {
  const byId = document.getElementById('name-modal-backdrop');
  if (byId && byId.classList.contains('is-visible') && isVisible(byId)) return byId;
  const modalCandidates = Array.from(document.querySelectorAll('[role="dialog"], .modal, .popup, .dialog, .name-modal, [id*="welcome" i], [id*="modal" i]'));
  return modalCandidates.find(el => {
    if (!isVisible(el)) return false;
    return !!findVisible(
      ['#name-input', '#playerName', '#name', 'input[name="name"]', '.team-picker', '#team-picker'],
      el
    );
  }) || null;
}

function initWelcomeEnterHandler() {
  if (window.__LL_ENTER_HANDLER_INSTALLED) return;
  window.__LL_ENTER_HANDLER_INSTALLED = true;
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return;
    const popup = getActiveWelcomePopup();
    if (!popup) return;
    const active = document.activeElement;
    if (active && (active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

    const nameInput = findVisible(
      ['#name-input', '#playerName', '#name', 'input[name="name"]', 'input[type="text"]', 'input[type="search"]', 'input[placeholder*="Name" i]', 'input[aria-label*="Name" i]'],
      popup
    );
    const confirmBtn = findVisibleConfirmButton(popup);
    if (!confirmBtn) return;

    const hasTeamPicker = !!findVisible(['#team-picker', '.team-picker'], popup);
    const hasTeamSelected = !!findVisible(['#team-picker input[type="radio"]:checked', '.team-picker input[type="radio"]:checked'], popup);
    const focusInsidePopup = !active || popup.contains(active) || active === document.body;
    if (!focusInsidePopup) return;

    const isNameContext = !!nameInput;
    const shouldConfirmTeam = !hasTeamPicker || hasTeamSelected;
    if (!isNameContext && !shouldConfirmTeam) return;

    ev.preventDefault();
    confirmBtn.click();
  }, true);
}

function escapeHtml(text) {
  return (text || '')
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function applyBilingualLabels(root = document) {
  const host = root && root.querySelectorAll ? root : document;
  const nodes = [];
  if (host !== document && host.matches && host.matches('[data-de][data-en]')) nodes.push(host);
  host.querySelectorAll('[data-de][data-en]').forEach(el => nodes.push(el));
  nodes.forEach(el => {
    const de = (el.getAttribute('data-de') || '').trim();
    const en = (el.getAttribute('data-en') || '').trim();
    if (!de || !en) return;
    const sig = `${de}||${en}`;
    if (el.dataset.biApplied === sig) return;
    el.innerHTML = `<span class="btn-label"><span class="btn-de">${escapeHtml(de)}</span><span class="btn-en">${escapeHtml(en)}</span></span>`;
    el.setAttribute('aria-label', `${de} (${en})`);
    el.dataset.biApplied = sig;
  });
}

function resolveTheme(themeUrl) {
  const resolved = canonicalTheme(themeUrl);
  if (resolved) return resolved;
  const paired = canonicalTheme(themeForAvatar(getAvatar() || AVATARS[0]));
  return paired || THEMES[0];
}

function applyTheme(themeUrl) {
  const raw = (themeUrl || '').trim().toLowerCase();
  const currentBgMode = (document.body.dataset.bgMode || '').toLowerCase();
  const isPlain = raw === 'light' || raw === 'dark';

  // Wenn globaler Theme-Schalter aktiv war oder BG-Mode auf hell/dunkel steht → kein Bild
  if (window.__force_plain_theme || isPlain || currentBgMode === 'light' || currentBgMode === 'dark') {
    const mode = isPlain
      ? raw
      : (currentBgMode === 'light' ? 'light' : currentBgMode === 'dark' ? 'dark' : (document.documentElement.dataset.theme || 'dark'));
    setBgMode(mode || 'dark');
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = 'var(--bg-page)';
    document.body.style.backgroundAttachment = 'initial';
    return;
  }

  const resolved = resolveTheme(themeUrl);
  setBgMode('image'); // Hintergrundbild aktiv
  document.documentElement.dataset.theme = 'dark';
  document.body.dataset.theme = 'dark';
  document.body.style.backgroundImage = `linear-gradient(rgba(12,16,27,0.18), rgba(12,16,27,0.18)), url(${resolved})`;
  document.body.style.backgroundSize = 'contain'; // kompletter Inhalt sichtbar
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center top';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundColor = '#0b1224';
  applyTeamToneByAvatar(getAvatar() || AVATARS[0]);
}

// ===========================
// DE: Benutzername via Session + Modal
// EN: Username via session + modal
// RU: Ð˜Ð¼Ñ Ñ‡ÐµÑ€ÐµÐ· ÑÐµÑÑÐ¸ÑŽ Ð¸ Ð¼Ð¾Ð´Ð°Ð»
// ===========================
function purgeOldNameStorage() {
  localStorage.removeItem('ll_user_name');
  localStorage.removeItem('ll_user_name_session');
}

function normalizePlayerName(name) {
  const raw = (name || '').toString().trim();
  if (!raw) return '';
  const lower = raw.toLocaleLowerCase('de-DE');
  return lower.charAt(0).toLocaleUpperCase('de-DE') + lower.slice(1);
}

function getUserName() {
  const stored = sessionStorage.getItem(USER_SESSION_KEY) || '';
  const normalized = normalizePlayerName(stored);
  if (stored !== normalized) {
    if (normalized) {
      sessionStorage.setItem(USER_SESSION_KEY, normalized);
    } else {
      sessionStorage.removeItem(USER_SESSION_KEY);
    }
  }
  return normalized;
}

function setUserName(name) {
  const normalized = normalizePlayerName(name);
  if (!normalized) return;
  localStorage.setItem(PLAYER_NAME_KEY, normalized);
  sessionStorage.setItem(USER_SESSION_KEY, normalized);
  renderWelcome();
}

function clearUserName() {
  localStorage.removeItem(PLAYER_NAME_KEY);
  sessionStorage.removeItem(USER_SESSION_KEY);
}

function isGameActive() {
  return sessionStorage.getItem(GAME_ACTIVE_KEY) === '1';
}

function markGameActive(active) {
  if (active) {
    sessionStorage.setItem(GAME_ACTIVE_KEY, '1');
  } else {
    sessionStorage.removeItem(GAME_ACTIVE_KEY);
  }
}

function markWelcomeShown() {
  sessionStorage.setItem(WELCOME_SHOWN_KEY, '1');
}

function clearWelcomeShown() {
  sessionStorage.removeItem(WELCOME_SHOWN_KEY);
}

function resetGameState() {
  resetCurrentProfileBonus();
  clearUserName();
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(TIMER_KEY);
  localStorage.removeItem(SLIDE_KEY);
  localStorage.removeItem(GENERATED_KEY);
  localStorage.removeItem(AVATAR_KEY);
  localStorage.removeItem(THEME_KEY);
  localStorage.removeItem(TEAM_ID_KEY);
  localStorage.removeItem(PLAYER_NAME_KEY);
  localStorage.removeItem('math_module_levels_cache');
  sessionStorage.removeItem(USER_SESSION_KEY);
  markGameActive(false);
  clearWelcomeShown();
  renderBonusJar(false);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getAvatar() {
  const val = localStorage.getItem(AVATAR_KEY) || '';
  return normalizeAsset(val);
}

function setAvatar(path) {
  const abs = normalizeAsset(path);
  localStorage.setItem(AVATAR_KEY, abs);
  const idx = AVATARS.indexOf(abs);
  if (idx >= 0) localStorage.setItem(TEAM_ID_KEY, String(idx));
  applyTeamToneByAvatar(abs);
  const paired = themeForAvatar(abs);
  setTheme(paired);
  document.dispatchEvent(new Event('avatar-theme-updated'));
}

function getTheme() {
  return canonicalTheme(localStorage.getItem(THEME_KEY) || '');
}

function setTheme(path) {
  const resolved = canonicalTheme(path);
  if (!resolved) return;
  localStorage.setItem(THEME_KEY, resolved);
}

function hasValidTeamId(value) {
  const idx = Number.parseInt(String(value ?? ''), 10);
  return Number.isInteger(idx) && idx >= 0 && idx < AVATARS.length;
}

function hasProfile() {
  const storedTeamId = localStorage.getItem(TEAM_ID_KEY);
  if (hasValidTeamId(storedTeamId)) return true;
  const storedAvatar = normalizeAsset(localStorage.getItem(AVATAR_KEY) || '');
  return AVATARS.includes(storedAvatar);
}

function loadBonusStore() {
  try {
    return JSON.parse(localStorage.getItem(BONUS_STORE_KEY) || '{}');
  } catch (_) {
    return {};
  }
}

function saveBonusStore(store) {
  localStorage.setItem(BONUS_STORE_KEY, JSON.stringify(store || {}));
}

function getBonusProfileId() {
  const name = normalizePlayerName(getUserName() || localStorage.getItem(PLAYER_NAME_KEY) || 'gast').toLowerCase();
  const teamIdRaw = localStorage.getItem(TEAM_ID_KEY);
  let teamId = hasValidTeamId(teamIdRaw) ? Number.parseInt(teamIdRaw, 10) : -1;
  if (teamId < 0) {
    const idx = AVATARS.indexOf(normalizeAsset(localStorage.getItem(AVATAR_KEY) || ''));
    teamId = idx >= 0 ? idx : 0;
  }
  return `${teamId}:${name || 'gast'}`;
}

function getProfileBonusPoints() {
  const store = loadBonusStore();
  const key = getBonusProfileId();
  return Math.max(0, Number(store[key] || 0) || 0);
}

function setProfileBonusPoints(points) {
  const store = loadBonusStore();
  const key = getBonusProfileId();
  store[key] = Math.max(0, Math.round(points || 0));
  saveBonusStore(store);
  renderBonusJar(false);
}

function addProfileBonusPoints(delta) {
  const add = Math.max(0, Math.round(delta || 0));
  if (!add) return 0;
  const next = getProfileBonusPoints() + add;
  lastBonusEarned = add;
  setProfileBonusPoints(next);
  showToast(`Bonus +${add} in die Spardose gelegt`, 'ok');
  renderBonusJar(true);
  return add;
}

function addBonusPoints(delta) {
  return addProfileBonusPoints(delta);
}

function resetCurrentProfileBonus() {
  const store = loadBonusStore();
  const key = getBonusProfileId();
  if (key in store) {
    delete store[key];
    saveBonusStore(store);
  }
  lastBonusEarned = 0;
  renderBonusJar(false);
}

function renderBonusJar(pop = false, overridePoints = null) {
  const pointsEl = document.getElementById('bonus-points');
  const fillEl = document.getElementById('bonus-jar-fill');
  const wrapEl = document.getElementById('bonus-widget');
  const points = overridePoints !== null ? Math.max(0, Math.round(overridePoints || 0)) : getProfileBonusPoints();
  if (pointsEl) pointsEl.textContent = String(points);
  if (fillEl) {
    const pct = Math.max(0, Math.min(100, (points / BONUS_JAR_CAP) * 100));
    fillEl.style.height = `${pct}%`;
  }
  if (!pop || !wrapEl) return;
  wrapEl.classList.add('pop');
  if (bonusJarFlashTimeout) clearTimeout(bonusJarFlashTimeout);
  bonusJarFlashTimeout = setTimeout(() => wrapEl.classList.remove('pop'), 260);
}

function openBonusInfoModal() {
  const balance = getProfileBonusPoints();
  const last = lastBonusEarned;
  const recent = currentLevelStats ? ((currentLevelStats.timeBonusPoints || 0) + (currentLevelStats.lifeBonusPoints || 0)) : last;
  const timePart = currentLevelStats ? `${currentLevelStats.timeBonusPoints || 0} Zeit` : '–';
  const lifePart = currentLevelStats ? `${currentLevelStats.lifeBonusPoints || 0} Leben` : '–';
  const html = `
    <div class="bonus-modal-body">
      <p>Dein Punkteglas enthält aktuell <strong>${balance}</strong> Bonuspunkte.</p>
      <ul class="bonus-breakdown">
        <li>Letzte Gutschrift: <strong>${recent || 0}</strong> (Zeit: ${timePart}, Leben: ${lifePart})</li>
        <li>So sammelst du Punkte: Zeitmodus aktiv lassen und Aufgaben mit möglichst wenigen Versuchen lösen.</li>
        <li>Die Punkte bleiben pro Spielerprofil gespeichert.</li>
      </ul>
      <button type="button" class="pill btn-secondary" id="bonus-reset-btn">Punkteglas leeren</button>
    </div>`;
  const { overlay } = ensureModal('bonus-modal', 'Punkteglas / Spardose');
  if (overlay) {
    const body = overlay.querySelector('.modal-body');
    if (body) body.innerHTML = html;
    const resetBtn = overlay.querySelector('#bonus-reset-btn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        resetCurrentProfileBonus();
        showToast('Punkteglas geleert', 'warn');
        closeModal('bonus-modal');
      };
    }
    overlay.classList.add('is-visible');
  }
}

function getNavigationType() {
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  if (nav && nav.type) return nav.type;
  if (performance.navigation && performance.navigation.type === 1) return 'reload';
  return 'navigate';
}

function autoOpenWelcomeOnce() {
  purgeOldNameStorage();
  renderWelcome();
  const navType = getNavigationType();
  if (navType === 'reload') {
    clearWelcomeShown();
  }
  if (!sessionStorage.getItem(WELCOME_SHOWN_KEY)) {
    openNameModal();
    return;
  }
  markGameActive(hasProfile());
}

function ensureUserName() {
  autoOpenWelcomeOnce();
}

function renderWelcome() {
  let target = document.getElementById('welcome');
  const header = document.getElementById('header-placeholder');
  const main = document.querySelector('main');
  if (!target) {
    target = document.createElement('div');
    target.id = 'welcome';
    if (main) {
      main.prepend(target);
    } else if (header) {
      header.insertAdjacentElement('afterend', target);
    } else {
      document.body.prepend(target);
    }
  }
  const name = getUserName() || 'Gast';
  let avatar = getAvatar();
  if (!AVATARS.includes(avatar)) avatar = pickRandom(AVATARS);
  let theme = getTheme();
  if (!theme) theme = themeForAvatar(avatar);
  setAvatar(avatar);
  setTheme(theme);
  applyTheme(theme);
  const teamName = teamNameForAvatar(avatar);
  target.innerHTML = `
    <div class=\"welcome-row player-bar\">
      <button type=\"button\" class=\"avatar-chip\" id=\"avatar-open\">
        <img class=\"avatar-img\" src=\"${avatar}\" alt=\"Avatar\" width=\"48\" height=\"48\" />
        <div class=\"welcome-copy\">
          <span class=\"welcome-text\">Das Spiel fuer Team ${teamName}</span>
          <div class=\"welcome-meta\"><small>Spieler: ${name}</small></div>
        </div>
      </button>
      <div class=\"welcome-actions\">
        <button class=\"linklike\" id=\"change-name\" data-de=\"Name ändern\" data-en=\"Change name\">Name ändern</button>
        <button class=\"linklike\" id=\"hint-open\" data-de=\"Hinweis\" data-en=\"Hint\">Hinweis</button>
        <button class=\"linklike\" id=\"bg-open\" data-de=\"Bild wechseln\" data-en=\"Change image\">Bild wechseln</button>
        <button class=\"linklike\" id=\"btnBackgroundOnly\" data-de=\"Nur Hintergrund\" data-en=\"Background only\">Nur Hintergrund</button>
        <button class=\"linklike\" id=\"open-level-results\" data-de=\"Auswertung\" data-en=\"Evaluation\">Auswertung</button>
        <button class=\"linklike\" id=\"reset-player\" data-de=\"Neuer Spieler\" data-en=\"New player\">Neuer Spieler</button>
      </div>
      <div class=\"bonus-widget\" id=\"bonus-widget\" aria-live=\"polite\">
        <div class=\"bonus-kicker\">Spardose / Punkteglas</div>
        <div class=\"bonus-jar\"><div id=\"bonus-jar-fill\" class=\"bonus-jar-fill\"></div></div>
        <div class=\"bonus-points\">Bonus: <strong id=\"bonus-points\">0</strong></div>
      </div>
    </div>
  `;
  applyBilingualLabels(target);
  renderBonusJar(false);
  const bonusWrap = document.getElementById('bonus-widget');
  if (bonusWrap) {
    bonusWrap.setAttribute('role', 'button');
    bonusWrap.setAttribute('tabindex', '0');
    bonusWrap.setAttribute('aria-label', 'Punkteglas öffnen');
    const openBonus = () => openBonusInfoModal();
    bonusWrap.onclick = openBonus;
    bonusWrap.onkeydown = ev => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openBonus();
      }
    };
  }
  const changeBtn = document.getElementById('change-name');
  if (changeBtn) {
    changeBtn.onclick = () => {
      clearUserName();
      openNameModal();
    };
  }
  const resetBtn = document.getElementById('reset-player');
  if (resetBtn) {
    resetBtn.onclick = () => {
      resetGameState();
      location.reload();
    };
  }

  const avatarBtn = document.getElementById('avatar-open');
  if (avatarBtn) avatarBtn.onclick = () => openAvatarModal();

  const bgBtn = document.getElementById('bg-open');
  if (bgBtn) bgBtn.onclick = () => openBackgroundModal();
  const bgOnlyBtn = document.getElementById('btnBackgroundOnly');
  if (bgOnlyBtn) bgOnlyBtn.onclick = () => enableBackgroundOnly();

  const hintBtn = document.getElementById('hint-open');
  if (hintBtn) hintBtn.onclick = () => openHintModal();

  const resultsBtn = document.getElementById('open-level-results');
  if (resultsBtn) resultsBtn.onclick = () => {
    if (!currentLevelStats) { openHintModal(); return; }
    const rows = [
      ['Gesamtpunkte', `${currentLevelStats.earned}/${currentLevelStats.max}`],
      ['Prozent', `${currentLevelStats.percent}%`],
      ['Note', currentLevelStats.grade],
      ['Zeitmodus', currentLevelStats.timeModeEnabled ? 'An' : 'Aus'],
      ['Zeitbonus', currentLevelStats.timeModeEnabled ? `${currentLevelStats.timeBonusPoints}/${currentLevelStats.timeBonusMax}` : '–'],
      ['Versuche gesamt', currentLevelStats.attemptsTotal ?? 0],
    ];
    openModal('results-modal', 'Auswertung', renderResultTable(rows));
  };
}

function openNameModal() {
  let overlay = document.getElementById('name-modal-backdrop');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'name-modal-backdrop';
    overlay.innerHTML = `
      <div class="name-modal">
        <p class="name-kicker">Hallo! Schön, dass du da bist!</p>
        <h3>Willkommen bei Mathe-Spaß!</h3>
        <p class="name-sub">Name eingeben und Team wählen.</p>
        <input type="text" id="name-input" placeholder="Dein Name..." autocomplete="off" />
        <div class="team-picker" id="team-picker" aria-label="Team auswaehlen">
          ${AVATARS.map((src, idx) => {
            const label = TEAM_NAMES[idx] || 'Avatar';
            const theme = THEMES[idx] || THEMES[0];
            return `
              <label class="team-option">
                <input type="radio" name="team" value="${src}" data-theme="${theme}">
                <img src="${src}" alt="${label}" width="52" height="52" />
                <span>${label}</span>
              </label>`;
          }).join('')}
        </div>
        <p class="team-choice" id="team-choice">Du hast noch kein Team gewaehlt.</p>
        <div class="name-actions">
          <button id="name-submit" data-de="Los geht's!" data-en="Let's go!">Los geht's!</button>
          <button type="button" id="name-later" class="name-later" data-de="Spaeter" data-en="Later">Spaeter</button>
          <button type="button" id="profile-reset" class="name-later" data-de="Profil zurücksetzen" data-en="Reset profile">Profil zurücksetzen</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const findNameInput = (root) => {
    if (!root || !root.querySelector) return null;
    return root.querySelector(
      '#name-input, #playerName, #name, input[name="name"], input[type="text"], input[type="search"], input[placeholder*="Name" i], input[aria-label*="Name" i]'
    );
  };
  const findConfirmButton = (root) => {
    if (!root || !root.querySelectorAll) return null;
    const byId = root.querySelector('#name-submit, #name-confirm, #start, #ok, #confirm');
    if (byId) return byId;
    const candidates = Array.from(root.querySelectorAll('button, [role="button"]'));
    return candidates.find(el => {
      const txt = ((el.textContent || '').trim()).toLowerCase();
      return /weiter|ok|start|bestätigen|bestaetigen|los/.test(txt);
    }) || null;
  };

  const input = findNameInput(overlay);
  const btn = findConfirmButton(overlay);
  const laterBtn = overlay.querySelector('#name-later');
  const resetProfileBtn = overlay.querySelector('#profile-reset');
  const picker = overlay.querySelector('#team-picker');
  const choice = overlay.querySelector('#team-choice');

  if (!overlay.dataset.bound) {
    picker.querySelectorAll('input[type="radio"]').forEach(r => {
      r.addEventListener('change', () => {
        if (choice) choice.textContent = `Du hast Team ${r.nextElementSibling?.alt || 'Avatar'} gewaehlt.`;
      });
    });

    const commit = () => {
      if (!input) return;
      const val = normalizePlayerName((input.value || '').trim() || 'Gast');
      if (!val) return;
      const selected = overlay.querySelector('#team-picker input[type="radio"]:checked');
      if (!selected || !selected.value) {
        if (choice) choice.textContent = 'Bitte waehle zuerst ein Team aus.';
        return;
      }
      setAvatar(selected.value);
      setTheme(selected.dataset.theme || themeForAvatar(selected.value));
      setUserName(val);
      markGameActive(true);
      markWelcomeShown();
      overlay.classList.remove('is-visible');
      document.dispatchEvent(new Event('ll-game-activated'));
    };

    if (btn) {
      btn.addEventListener('click', commit);
    }
    if (laterBtn) {
      laterBtn.addEventListener('click', () => {
        markWelcomeShown();
        markGameActive(hasProfile());
        overlay.classList.remove('is-visible');
      });
    }
    if (resetProfileBtn) {
      resetProfileBtn.addEventListener('click', () => {
        resetCurrentProfileBonus();
        clearUserName();
        localStorage.removeItem(TEAM_ID_KEY);
        localStorage.removeItem(AVATAR_KEY);
        localStorage.removeItem(THEME_KEY);
        markGameActive(false);
        clearWelcomeShown();
        if (choice) choice.textContent = 'Du hast noch kein Team gewaehlt.';
        picker.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
        if (input) input.value = 'Gast';
        openNameModal();
      });
    }
    overlay.dataset.bound = '1';
  }

  const storedAvatar = getAvatar();
  const currentAvatar = AVATARS.includes(storedAvatar) ? storedAvatar : AVATARS[0];
  picker.querySelectorAll('input[type="radio"]').forEach(r => {
    r.checked = r.value === currentAvatar;
  });
  if (choice) choice.textContent = `Du hast Team ${teamNameForAvatar(currentAvatar)} gewaehlt.`;
  if (input) input.value = 'Gast';

  overlay.classList.add('is-visible');
  applyBilingualLabels(overlay);
  if (input) {
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }
  // Test guide:
  // 1) Seite laden -> Name eingeben -> Enter: gleicher Ablauf wie Klick auf "Los geht's!".
  // 2) Team wechseln (z. B. Pinguin/Frosch/Panda) -> Enter funktioniert weiterhin.
  // 3) Klick auf "Los geht's!" funktioniert unverändert.
}
// DE: Progress aus localStorage laden
// EN: Load progress from localStorage
// RU: Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑÐ° Ð¸Ð· localStorage
function loadProgressStore() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Progress für Level speichern
// EN: Save progress for a level
// RU: Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑ ÑƒÑ€Ð¾Ð²Ð½Ñ
function saveProgress(levelId, data) {
  const store = loadProgressStore();
  store[levelId] = data;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
}

// DE: Versuche-Store laden
// EN: Load attempts store
// RU: Ð—Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ Ð¿Ð¾Ð¿Ñ‹Ñ‚Ð¾Ðº
function loadAttemptsStore() {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Versuche-Store speichern
// EN: Save attempts store
// RU: Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ Ð¿Ð¾Ð¿Ñ‹Ñ‚Ð¾Ðº
function saveAttemptsStore(store) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(store));
}

// DE: Generierte Aufgaben laden
// EN: Load generated tasks
// RU: Ð—Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ ÑÐ³ÐµÐ½ÐµÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð·Ð°Ð´Ð°Ð½Ð¸Ñ
function loadGeneratedStore() {
  try {
    return JSON.parse(localStorage.getItem(GENERATED_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Generierte Aufgaben speichern
// EN: Save generated tasks
// RU: Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ ÑÐ³ÐµÐ½ÐµÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð·Ð°Ð´Ð°Ð½Ð¸Ñ
function saveGeneratedStore(store) {
  localStorage.setItem(GENERATED_KEY, JSON.stringify(store));
}

// Timer store
function loadTimerStore() {
  try {
    return JSON.parse(localStorage.getItem(TIMER_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveTimerStore(store) {
  localStorage.setItem(TIMER_KEY, JSON.stringify(store));
}

// DE: Slide-Index-Store laden
// EN: Load slide index store
// RU: Ð—Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ñ… ÑÐ»Ð°Ð¹Ð´Ð¾Ð²
function loadSlideStore() {
  try {
    return JSON.parse(localStorage.getItem(SLIDE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Slide-Index-Store speichern
// EN: Save slide index store
// RU: Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ ÑÐ»Ð°Ð¹Ð´Ð¾Ð²
function saveSlideStore(store) {
  localStorage.setItem(SLIDE_KEY, JSON.stringify(store));
}

// DE: Toast-Anzeige
// EN: Toast display
// RU: ÐŸÐ¾ÐºÐ°Ð· Ñ‚Ð¾ÑÑ‚Ð°
function showToast(message, type = 'info') {
  let box = document.getElementById('toast');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast';
    document.body.appendChild(box);
  }
  if (toastHideTimeout) {
    clearTimeout(toastHideTimeout);
    toastHideTimeout = null;
  }
  box.textContent = message;
  box.className = `toast ${type}`;
  box.style.opacity = '0';
  requestAnimationFrame(() => { box.style.opacity = '1'; });
  toastHideTimeout = setTimeout(() => { box.style.opacity = '0'; }, 2100);
}

// DE: Ergebnis-Tabelle als HTML
// EN: Result table as HTML
// RU: Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² (UI Ð±ÐµÐ· Ñ€ÑƒÑÑÐºÐ¾Ð³Ð¾ Ñ‚ÐµÐºÑÑ‚Ð°)
function renderResultTable(rows) {
  const safe = rows.map(([label, value]) => {
    const cleanLabel = (label || '').toString();
    const cleanValue = (value == null ? '–' : value).toString();
    return `<tr><th>${cleanLabel}</th><td>${cleanValue}</td></tr>`;
  }).join('');
  return `<table class="result-table">${safe}</table>`;
}

// DE: Avatar/Theme Modal anzeigen
// EN: Show avatar/theme modal
// RU: ÐžÐºÐ½Ð¾ Ð²Ñ‹Ð±Ð¾Ñ€Ð° Ð°Ð²Ð°Ñ‚Ð°Ñ€Ð°/Ñ„Ð¾Ð½Ð°
function openAvatarModal() {
  const avatar = getAvatar() || pickRandom(AVATARS);
  const theme = getTheme() || pickRandom(THEMES);
  const { overlay, body } = ensureModal('avatar-modal', 'Avatar & Agent');
  if (!body) return;
  body.innerHTML = `
    <div class="modal-grid">
      <div class="modal-block">
        <p class="eyebrow">Avatar</p>
        <img class="modal-hero" id="avatar-hero" src="${avatar}" alt="Avatar groß">
        <div class="modal-actions">
          <button class="pill btn-secondary" id="swap-avatar" data-de="Avatar" data-en="Avatar">Avatar</button>
        </div>
      </div>
      <div class="modal-block">
        <p class="eyebrow">Hintergrund</p>
        <img class="modal-hero" id="theme-hero" src="${theme}" alt="Hintergrund groß">
        <div class="modal-actions">
          <button class="pill btn-secondary" id="swap-theme" data-de="Bild wechseln" data-en="Change image">Bild wechseln</button>
        </div>
      </div>
    </div>
    <p class="hint-note">Tipp: Avatar anklicken öffnet dieses Fenster immer.</p>
  `;
  applyBilingualLabels(overlay);
  overlay.classList.add('is-visible');

  const avatarImg = body.querySelector('#avatar-hero');
  const themeImg = body.querySelector('#theme-hero');

  const refresh = () => {
    const a = getAvatar() || avatar;
    const t = getTheme() || themeForAvatar(a);
    if (avatarImg) avatarImg.src = a;
    if (themeImg) themeImg.src = t;
    applyTheme(t);
    renderWelcome();
  };

  const swapAvatar = body.querySelector('#swap-avatar');
  if (swapAvatar) {
    swapAvatar.onclick = () => {
      const nextAvatar = pickRandom(AVATARS);
      setAvatar(nextAvatar); // setAvatar sets theme pair
      refresh();
    };
  }
  const swapTheme = body.querySelector('#swap-theme');
  if (swapTheme) {
    swapTheme.onclick = () => {
      const current = getAvatar() || avatar;
      const idx = AVATARS.indexOf(current);
      const nextIdx = idx >= 0 ? idx : 0;
      setAvatarAndThemeByIndex(nextIdx);
      refresh();
      document.dispatchEvent(new Event('avatar-theme-updated'));
    };
  }
}

function openBackgroundModal() {
  const theme = getTheme() || pickRandom(THEMES);
  const { overlay, body } = ensureModal('background-modal', 'Hintergrund wechseln');
  if (!body) return;
  body.innerHTML = `
    <div class="modal-block full">
      <img class="modal-hero wide" src="${theme}" alt="Hintergrund groß">
      <div class="modal-actions space-between">
        <div><strong>Aktives Bild</strong></div>
        <div class="action-row">
          <button class="pill btn-secondary" id="shuffle-bg" data-de="Bild wechseln" data-en="Change image">Bild wechseln</button>
          <button class="pill btn-ghost" id="close-bg" data-de="Schließen" data-en="Close">Schließen</button>
        </div>
      </div>
    </div>
  `;
  applyBilingualLabels(overlay);
  overlay.classList.add('is-visible');
  const shuffle = body.querySelector('#shuffle-bg');
  if (shuffle) shuffle.onclick = () => {
    // Wähle neuen Avatar/Theme als Paar
    const nextIdx = Math.floor(Math.random() * AVATARS.length);
    setAvatarAndThemeByIndex(nextIdx);
    const hero = body.querySelector('.modal-hero');
    const theme = THEMES[nextIdx];
    if (hero) hero.src = theme;
    applyTheme(theme);
    renderWelcome();
    document.dispatchEvent(new Event('avatar-theme-updated'));
  };
  const closeBtn = body.querySelector('#close-bg');
  if (closeBtn) closeBtn.onclick = () => closeModal('background-modal');
}

function openHintModal() {
  const lvl = parseCurrentLevel() || '0';
  const hint = LEVEL_HINTS[String(lvl)] || 'Kleiner Tipp: erst lesen, dann rechnen.';
  const { overlay, body } = ensureModal('hint-modal', 'Hinweis');
  if (!body) return;
  body.innerHTML = `
    <p class="eyebrow">Level ${lvl}</p>
    <p class="hint-body">${hint}</p>
    <p class="hint-sub">Wenn du festhängst: Schritt für Schritt notieren und Zwischenergebnisse prüfen.</p>
  `;
  applyBilingualLabels(overlay);
  overlay.classList.add('is-visible');
}

// ===========================
// DE: Zufallsaufgaben je Level generieren
// EN: Generate random tasks per level
// RU: Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ ÑÐ»ÑƒÑ‡Ð°Ð¹Ð½Ñ‹Ñ… Ð·Ð°Ð´Ð°Ð½Ð¸Ð¹ Ð¿Ð¾ ÑƒÑ€Ð¾Ð²Ð½ÑÐ¼
// ===========================
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTasksForLevel(levelId) {
  const tasks = [];
  const seen = new Set();

  const addTask = (text, answer, points, solution) => {
    if (seen.has(text)) return false;
    seen.add(text);
    const slide = tasks.length + 1;
    tasks.push({
      id: `gen-${levelId}-${Date.now()}-${slide}`,
      slide,
      text,
      answer: String(answer),
      points,
      solution,
    });
    return true;
  };

  const need = 5;
  while (tasks.length < need) {
    switch (String(levelId)) {
      case '0': {
        const a = randInt(0, 10);
        const b = randInt(0, 10);
        const op = Math.random() < 0.5 ? '+' : '-';
        const res = op === '+' ? a + b : a - b;
        if (op === '-' && res < 0) continue;
        const text = `Rechne: ${a} ${op} ${b} =`;
        const pts = res <= 10 ? 1 : 2;
        addTask(text, res, pts, `${a} ${op} ${b} = ${res}.`);
        break;
      }
      case '1': {
        const a = randInt(5, 15);
        const b = randInt(1, 10);
        const res = a + b;
        if (res > 20) continue;
        const text = `Addiere: ${a} + ${b} =`;
        const pts = res > 15 ? 2 : 1;
        addTask(text, res, pts, `${a} + ${b} = ${res}.`);
        break;
      }
      case '2': {
        const a = randInt(8, 20);
        const b = randInt(1, a);
        const res = a - b;
        const text = `Subtrahiere: ${a} - ${b} =`;
        const pts = res < 8 ? 1 : 2;
        addTask(text, res, pts, `${a} - ${b} = ${res}.`);
        break;
      }
      case '3': {
        const a = randInt(2, 10);
        const b = randInt(2, 10);
        const res = a * b;
        const text = `Multipliziere: ${a} · ${b} =`;
        const pts = res > 50 ? 3 : 2;
        addTask(text, res, pts, `${a}·${b}=${res}.`);
        break;
      }
      case '4': {
        const a = randInt(2, 10);
        const b = randInt(2, 10);
        const res = b;
        const dividend = a * b;
        const text = `Dividiere: ${dividend} ÷ ${a} =`;
        const pts = dividend > 50 ? 3 : 2;
        addTask(text, res, pts, `${dividend}÷${a}=${res}.`);
        break;
      }
      case '5': {
        const a = randInt(5, 20);
        const b = randInt(1, 10);
        const c = randInt(1, 10);
        const res = a + b - c;
        const text = `Kombiniert: ${a} + ${b} - ${c} =`;
        const pts = Math.abs(res - a) > 5 ? 3 : 2;
        addTask(text, res, pts, `${a}+${b}-${c}=${res}.`);
        break;
      }
      case '6': {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        const c = randInt(2, 6);
        const res = (a * b) / c;
        if (!Number.isInteger(res)) continue;
        const text = `Gemischt: ${a} · ${b} ÷ ${c} =`;
        const pts = res >= 15 ? 3 : 2;
        addTask(text, res, pts, `${a}·${b}=${a * b}, ÷${c}=${res}.`);
        break;
      }
      default:
        addTask('Placeholder', '0', 1, '—');
    }
  }
  return tasks;
}

// DE: Prozentwert für Level holen
// EN: Get percent value for level
// RU: ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚ Ð´Ð»Ñ ÑƒÑ€Ð¾Ð²Ð½Ñ
function percentForLevel(levelId) {
  const store = loadProgressStore();
  return (store[levelId] && store[levelId].percent) || 0;
}

// DE: Aktuelles Level aus URL bestimmen
// EN: Detect current level from URL
// RU: ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»Ð¸Ñ‚ÑŒ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ ÑƒÑ€Ð¾Ð²ÐµÐ½ÑŒ Ð¸Ð· URL
function parseCurrentLevel() {
  const match = window.location.pathname.match(/level(\d+)\.html$/);
  return match ? match[1] : null;
}

function storageKey(levelId) {
  return `ll_math_state_v${STATE_VERSION}_${levelId}`;
}

function initialState(levelId) {
  return {
    version: STATE_VERSION,
    levelId: String(levelId),
    running: false,
    finished: false,
    timeModeEnabled: false,
    updatedAt: Date.now(),
  };
}

function loadState(levelId) {
  const fallback = initialState(levelId);
  const raw = localStorage.getItem(storageKey(levelId));
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STATE_VERSION) return fallback;
    if (String(parsed.levelId) !== String(levelId)) return fallback;
    return { ...fallback, ...parsed, version: STATE_VERSION, levelId: String(levelId) };
  } catch (_) {
    return fallback;
  }
}

function saveState(levelId, state) {
  const payload = {
    ...initialState(levelId),
    ...(state || {}),
    version: STATE_VERSION,
    levelId: String(levelId),
    updatedAt: Date.now(),
  };
  localStorage.setItem(storageKey(levelId), JSON.stringify(payload));
  return payload;
}

function resetRun(levelId) {
  if (levelId == null) return;
  const attempts = loadAttemptsStore();
  delete attempts[levelId];
  saveAttemptsStore(attempts);

  const progress = loadProgressStore();
  delete progress[levelId];
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));

  const slides = loadSlideStore();
  delete slides[levelId];
  saveSlideStore(slides);

  const timers = loadTimerStore();
  delete timers[levelId];
  saveTimerStore(timers);

  localStorage.removeItem(storageKey(levelId));
  saveState(levelId, initialState(levelId));
}

function wireLevelToolbar(levels, container) {
  const select = document.getElementById('level-jump-select');
  const detailTitle = document.getElementById('levelDetailTitle');
  const detailDesc = document.getElementById('levelDetailDesc');
  const startBtn = document.getElementById('levelStartBtn');
  if (!select || !detailTitle || !detailDesc || !startBtn || !Array.isArray(levels)) return;

  // Leveldaten aus den bereits gerenderten Karten lesen (keine doppelte Pflege).
  const cards = container ? Array.from(container.querySelectorAll('.level[data-level]')) : [];
  const levelData = cards.map(card => {
    const id = String(card.dataset.level || '').trim();
    const title = (card.querySelector('h3')?.textContent || `Level ${id}`).trim();
    const desc = (card.querySelector('p')?.textContent || '').trim();
    const href = card.querySelector('a')?.getAttribute('href') || `${MODULE_ROOT}/levels/level${id}.html`;
    return { id, title, desc, href };
  }).filter(item => item.id !== '');

  if (!levelData.length) return;

  select.innerHTML = '';
  levelData.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.title;
    select.appendChild(option);
  });

  const byId = new Map(levelData.map(item => [item.id, item]));
  const renderSelected = levelId => {
    const item = byId.get(String(levelId)) || levelData[0];
    if (!item) return;
    select.value = item.id;
    detailTitle.textContent = item.title;
    detailDesc.textContent = item.desc;
    startBtn.dataset.href = item.href;
  };

  const initialFromUrl = new URLSearchParams(window.location.search).get('level');
  renderSelected(initialFromUrl || select.value);

  if (!select.dataset.bound) {
    select.addEventListener('change', () => renderSelected(select.value));
    startBtn.addEventListener('click', () => {
      const href = startBtn.dataset.href || byId.get(select.value)?.href;
      const targetLevelId = String(select.value || '').trim();
      if (targetLevelId) resetRun(targetLevelId);
      if (href) window.location.href = href;
    });
    select.dataset.bound = '1';
  }
}

// DE: Layout laden (Header/Footer)
// EN: Load layout (header/footer)
// RU: Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¼Ð°ÐºÐµÑ‚Ð° (Ñ…ÐµÐ´ÐµÑ€/Ñ„ÑƒÑ‚ÐµÑ€)
function loadLayout() {
  const header = document.getElementById('header-placeholder');
  const footer = document.getElementById('footer-placeholder');

  if (header) {
    fetch(`${MODULE_ROOT}/core/header.html`)
      .then(res => res.text())
      .then(html => {
        header.innerHTML = html;
        document.dispatchEvent(new Event('ll-header-ready'));
        const homeLink = header.querySelector('[data-nav="home"]');
        if (homeLink) homeLink.href = `${MODULE_ROOT}/index.html`;
        const level0Link = header.querySelector('[data-nav="level0"]');
        if (level0Link) {
          const currentLevel = getCurrentLevel();
          level0Link.href = `${MODULE_ROOT}/levels/level0.html`;
          level0Link.textContent = currentLevel != null ? `Level ${currentLevel}` : 'Aufgaben';
        }
        const profileBtn = header.querySelector('#header-profile-btn');
        if (profileBtn) profileBtn.onclick = () => openNameModal();
        const startGameBtn = header.querySelector('#btnStartGame');
        if (startGameBtn) {
          const currentLevelId = parseCurrentLevel();
          if (currentLevelId !== null) {
            startGameBtn.textContent = 'Neustart';
            startGameBtn.setAttribute('data-de', 'Neustart');
            startGameBtn.setAttribute('data-en', 'Restart');
            startGameBtn.onclick = () => {
              resetRun(currentLevelId);
              window.location.reload();
            };
          } else {
            startGameBtn.onclick = () => {
              if (!hasProfile()) {
                openNameModal();
                return;
              }
              if (!window.location.pathname.endsWith('/index.html')) {
                window.location.href = `${MODULE_ROOT}/index.html#levels`;
              }
            };
          }
        }
        const endGameBtn = header.querySelector('#btnEndGame');
        if (endGameBtn) {
          endGameBtn.onclick = () => {
            const ok = window.confirm('Spiel wirklich beenden?');
            if (!ok) return;
            resetGameState();
            window.location.href = `${MODULE_ROOT}/index.html`;
          };
        }
        applyBilingualLabels(header);
      });
  }

  if (footer) {
    fetch(`${MODULE_ROOT}/core/footer.html`)
      .then(res => res.text())
      .then(html => { footer.innerHTML = html; });
  }
}

// DE: Level-Karte rendern, falls Container existiert
// EN: Render level map when container exists
// RU: ÐžÑ‚Ñ€Ð¸ÑÐ¾Ð²Ð°Ñ‚ÑŒ ÐºÐ°Ñ€Ñ‚Ñƒ ÑƒÑ€Ð¾Ð²Ð½ÐµÐ¹, ÐµÑÐ»Ð¸ ÐµÑÑ‚ÑŒ ÐºÐ¾Ð½Ñ‚ÐµÐ¹Ð½ÐµÑ€
function renderLevelMapIfPresent() {
  const container = document.querySelector('.levels');
  if (!container) return;
  const levelsUrl = `${MODULE_ROOT}/data/levels.json`;

  fetch(levelsUrl)
    .then(response => response.json())
    .then(levels => {
      try { localStorage.setItem('math_module_levels_cache', JSON.stringify(levels)); } catch (_) {}
      container.innerHTML = '';
      levels.forEach(level => {
        const id = (level.level ?? level.id ?? level.levelId);
        if (id == null) {
          console.error('Invalid level entry', level);
          return;
        }

        const percent = percentForLevel(id) || 0;
        const div = document.createElement('div');
        div.className = 'level';
        div.dataset.level = id;
        div.id = `level-${id}`;
        div.innerHTML = `
          <h3>${level.title}</h3>
          <p>${level.description}</p>
          <progress value="${percent}" max="100"></progress>
          <a href="${MODULE_ROOT}/levels/level${id}.html" data-de="Starten" data-en="Start">Starten</a>
        `;
        const startLink = div.querySelector('a');
        if (startLink) {
          startLink.addEventListener('click', () => {
            resetRun(String(id));
          });
        }
        container.appendChild(div);
      });
      wireLevelToolbar(levels, container);
      applyBilingualLabels(container);
    })
    .catch(() => {
      container.innerHTML = '<p>Levels konnten nicht geladen werden.</p>';
    });
}

// ===========================
// DE: Aufgaben für aktuelles Level laden und rendern
// EN: Load and render tasks for current level
// RU: Ð—Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ð¸ Ð¾Ñ‚Ñ€Ð¸ÑÐ¾Ð²Ð°Ñ‚ÑŒ Ð·Ð°Ð´Ð°Ð½Ð¸Ñ Ð´Ð»Ñ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ³Ð¾ ÑƒÑ€Ð¾Ð²Ð½Ñ
// ===========================
function renderTasksForCurrentLevel() {
  const tasksHost = document.getElementById('tasks');
  const loadErrorEl = document.getElementById('loadError');
  const timeModeToggle = document.getElementById('timeModeToggle');
  const timerBox = document.getElementById('timerBox');
  const timerText = document.getElementById('timerText');
  const levelId = parseCurrentLevel();
  if (!tasksHost || levelId === null) return Promise.resolve();
  resetRun(levelId);
  let runState = loadState(levelId);
  const MAX_LIVES = 3;
  const TEST_TOTAL_SECONDS = 300; // 5 Minuten Gesamtzeit pro Test

  const taskScores = new Map();
  const taskAttemptMarks = new Map();
  const taskAttemptLog = new Map();
  const taskUiRefs = new Map();
  let currentTasks = [];
  const solved = new Set();
  let finalModalShown = false;
  let totalMax = 0; // Gesamt-Maximum inkl. Zeitbonus
  let hasActivity = false;
  let timeModeEnabled = true;
  let testRunning = false;
  let timerStartMs = 0;
  let timerEndMs = 0;
  let taskTimerInterval = null;
  let remainingSeconds = TEST_TOTAL_SECONDS;
  let testTaskCount = 0;
  let timeLimitSec = TEST_TOTAL_SECONDS;
  const POINTS_PER_CORRECT = 3;
  const BONUS_PER_SAVED_MIN = BONUS_POINTS_PER_STEP;
  const persistRunState = (patch = {}) => {
    runState = saveState(levelId, { ...runState, ...patch });
  };

  const hideLoadError = () => {
    if (loadErrorEl) loadErrorEl.hidden = true;
  };
  const showLoadError = () => {
    if (loadErrorEl) loadErrorEl.hidden = false;
  };
  // DE: Pro-Aufgabe-Timer im Zeitmodus.
  const formatClock = sec => {
    const safe = Math.max(0, sec | 0);
    const mm = Math.floor(safe / 60).toString().padStart(2, '0');
    const ss = Math.floor(safe % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };
  const updateTimerUi = () => {
    if (!timerBox || !timerText) return;
    timerBox.hidden = !timeModeEnabled;
    if (timeModeEnabled) timerText.textContent = formatClock(remainingSeconds);
  };
  const updateHourglass = () => {
    const el = document.querySelector('.hourglass, #hourglass, [data-hourglass]');
    if (!el) return;
    const shouldSpin = !!(timeModeEnabled && testRunning);
    el.classList.toggle('running', shouldSpin);
    el.classList.toggle('spinning', shouldSpin);
    el.style.display = timeModeEnabled ? '' : 'none';
  };
  const markTestRunning = on => {
    testRunning = !!on;
    if (testRunning && !timerStartMs) timerStartMs = Date.now();
    if (!testRunning && timerStartMs && !timerEndMs) timerEndMs = Date.now();
    persistRunState({ running: !!(timeModeEnabled && testRunning) });
    updateHourglass();
  };
  const setTimeMode = on => {
    timeModeEnabled = !!on;
    if (!timeModeEnabled) {
      stopTaskTimer();
      markTestRunning(false);
      timerStartMs = 0;
      timerEndMs = 0;
      remainingSeconds = TEST_TOTAL_SECONDS;
    }
    persistRunState({ timeModeEnabled: !!timeModeEnabled });
    updateTimerUi();
    updateHourglass();
  };
  const getConsumedSec = () => {
    if (!timerStartMs) return 0;
    const endMs = testRunning ? Date.now() : (timerEndMs || Date.now());
    return Math.max(0, Math.round((endMs - timerStartMs) / 1000));
  };
  const getTimeLimitSec = () => TEST_TOTAL_SECONDS;
  const getTimeMetrics = (taskCount) => {
    if (!timeModeEnabled) return { consumedSec: 0, savedSec: 0, savedMin: 0, bonusPoints: 0, bonusMax: 0, limitSec: 0 };
    const limitSec = getTimeLimitSec();
    const consumedSec = Math.max(0, getConsumedSec());
    const savedSec = Math.max(0, limitSec - consumedSec);
    const savedMin = Math.floor(savedSec / 60);
    const bonusMax = Math.floor(limitSec / 60) * BONUS_PER_SAVED_MIN;
    const bonusPoints = savedMin * BONUS_PER_SAVED_MIN;
    return { consumedSec, savedSec, savedMin, bonusPoints, bonusMax, limitSec };
  };
  const stopTaskTimer = () => {
    if (taskTimerInterval) {
      clearInterval(taskTimerInterval);
      taskTimerInterval = null;
    }
    persistRunState({ running: false });
    updateHourglass();
  };
  const canStartTestTimer = () => timeModeEnabled && isGameActive() && hasProfile() && !finalModalShown && !runState.finished;
  const awardTaskBonus = () => 0; // Bonus wird über die Gesamtzeit ermittelt
  const startTaskTimer = () => {
    if (!timeLimitSec || !canStartTestTimer()) return;
    if (taskTimerInterval) return;
    if (!timerStartMs) {
      timerStartMs = Date.now();
      timerEndMs = 0;
    }
    markTestRunning(true);
    updateTimerUi();
    taskTimerInterval = setInterval(() => {
      const elapsed = getConsumedSec();
      remainingSeconds = Math.max(0, timeLimitSec - elapsed);
      updateTimerUi();
      if (remainingSeconds > 0) return;
      stopTaskTimer();
      markTestRunning(false);
      showToast('Zeit abgelaufen: kein Bonus', 'warn');
    }, 1000);
  };

  const attemptsStore = loadAttemptsStore();
  const levelAttempts = attemptsStore[levelId] || {};

  const setAttempts = (taskId, value) => {
    levelAttempts[taskId] = value;
    attemptsStore[levelId] = levelAttempts;
    saveAttemptsStore(attemptsStore);
  };

  const incAttempts = taskId => {
    const next = (levelAttempts[taskId] || 0) + 1;
    setAttempts(taskId, next);
    return next;
  };

  const updateResults = () => {
    const correctCount = solved.size;
    const pointsTasks = correctCount * POINTS_PER_CORRECT;
    const timeMetrics = getTimeMetrics(testTaskCount);
    const timeBonusMax = timeModeEnabled ? timeMetrics.bonusMax : 0;
    const timeBonusEarned = timeModeEnabled ? timeMetrics.bonusPoints : 0;

    // Lebensbonus: jede gesparte Leben = 1 Punkt (verbleibende Leben pro Aufgabe)
    const savedLives = currentTasks.reduce((sum, task) => {
      const wrongAttempts = levelAttempts[task.id] || 0;
      const attemptsTotal = wrongAttempts + (solved.has(task.id) ? 1 : 0);
      const remaining = Math.max(0, MAX_LIVES - Math.min(MAX_LIVES, attemptsTotal));
      return sum + remaining;
    }, 0);
    const lifeBonusMax = testTaskCount * Math.max(0, MAX_LIVES - 1); // bei Lösung im 1. Versuch bleiben 2 Leben

    const maxTaskPoints = testTaskCount * POINTS_PER_CORRECT;
    const maxAll = maxTaskPoints + timeBonusMax + lifeBonusMax;
    const earned = pointsTasks + timeBonusEarned + savedLives;
    const percent = maxAll > 0 ? Math.round((earned / maxAll) * 100) : 0;
    const grade = gradeFromPercent(percent);
    const attemptsTotal = Object.values(levelAttempts).reduce((a, b) => a + (b || 0), 0);

    currentLevelStats = {
      levelId,
      earned,
      max: maxAll,
      baseMax: maxTaskPoints,
      basePoints: pointsTasks,
      percent,
      grade,
      attemptsTotal,
      timeModeEnabled,
      tasksTotal: testTaskCount,
      correctCount,
      pointsTasks,
      pointsTime: timeBonusEarned,
      pointsLives: savedLives,
      pointsTotal: earned,
      timeBonusPoints: timeBonusEarned,
      timeBonusMax: timeBonusMax,
      lifeBonusPoints: savedLives,
      lifeBonusMax,
      timeConsumedSec: timeMetrics.consumedSec,
      timeSavedSec: timeMetrics.savedSec,
      timeSavedMin: timeMetrics.savedMin,
      timeLimitSec: timeMetrics.limitSec,
    };

    // Bonus-Anzeige im Punkteglas mit aktuellen Level-Boni füllen (Zeit + Leben)
    const bonusDisplay = timeBonusEarned + savedLives;
    renderBonusJar(false, bonusDisplay);

    if (hasActivity) {
      saveProgress(levelId, { earned, max: maxAll, percent, timeModeEnabled, timeBonusPoints: timeBonusEarned, timeBonusMax: timeBonusMax, lifeBonusPoints: savedLives, lifeBonusMax });
    }
  };

  const slideStore = loadSlideStore();
  const generatedStore = loadGeneratedStore();
  let activeSlide = 0;
  const updateSlide = () => {};
  // Stop any running interval from previous render
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const getTasks = () => {
    if (generatedStore[levelId]) {
      return Promise.resolve(generatedStore[levelId]);
    }
    return fetch(`${MODULE_ROOT}/data/tasks.json`).then(res => {
      if (!res.ok) {
        throw new Error(`tasks.json HTTP ${res.status}`);
      }
      return res.json();
    })
      .then(allTasks => {
        const fromNumeric = allTasks[String(levelId)] || [];
        const fromNamed = allTasks[`level${levelId}`] || [];
        return fromNumeric.length ? fromNumeric : fromNamed;
      });
  };

  const resetLevelState = () => {
    resetRun(levelId);
  };

  return getTasks().then(tasks => {
      currentTasks = tasks;
      hideLoadError();
      tasksHost.innerHTML = '';
      testTaskCount = tasks.length;
      timeLimitSec = getTimeLimitSec();
      remainingSeconds = TEST_TOTAL_SECONDS;
      const timeBonusMax = Math.floor(TEST_TOTAL_SECONDS / BONUS_STEP_SECONDS) * BONUS_POINTS_PER_STEP;
      const lifeBonusMax = testTaskCount * Math.max(0, MAX_LIVES - 1);
      totalMax = (testTaskCount * POINTS_PER_CORRECT) + timeBonusMax + lifeBonusMax;
      if (!tasks.length) {
        tasksHost.innerHTML = '<p>Für dieses Level sind aktuell keine Aufgaben hinterlegt.</p>';
        return;
      }

      activeSlide = Math.min(
        tasks.length - 1,
        Math.max(0, slideStore[levelId] ?? 0)
      );

      const slides = [];
      const nav = document.createElement('div');
      nav.className = 'slide-nav';

      const pager = document.createElement('div');
      pager.className = 'slide-pager';

      const newBtn = document.createElement('button');
      newBtn.type = 'button';
      newBtn.textContent = 'Aufgaben';
      newBtn.className = 'btn-secondary pill';
      newBtn.setAttribute('data-de', 'Aufgaben');
      newBtn.setAttribute('data-en', 'Tasks');
      newBtn.addEventListener('click', () => {
        const generated = loadGeneratedStore();
        generated[levelId] = generateTasksForLevel(levelId);
        saveGeneratedStore(generated);
        resetLevelState();
        location.reload();
      });

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.textContent = 'Zurück';
      prevBtn.className = 'btn-ghost pill';
      prevBtn.setAttribute('data-de', 'Zurück');
      prevBtn.setAttribute('data-en', 'Back');

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.textContent = 'Weiter';
      nextBtn.className = 'btn-ghost pill';
      nextBtn.setAttribute('data-de', 'Weiter');
      nextBtn.setAttribute('data-en', 'Next');

      let setActiveSlide;
      let updateVisibleSlides;

      pager.append(prevBtn, nextBtn);
      tasksHost.appendChild(nav);
      tasksHost.appendChild(newBtn);
      if (timeModeToggle && !timeModeToggle.dataset.bound) {
        const initialOn = runState.timeModeEnabled !== false;
        timeModeToggle.checked = initialOn;
        timeModeToggle.addEventListener('change', () => {
          setTimeMode(!!timeModeToggle.checked);
          updateResults();
          updateVisibleSlides?.();
        });
        timeModeToggle.dataset.bound = '1';
      }
        const timeModeNote = document.querySelector('.time-mode-note');
      if (timeModeNote) {
        timeModeNote.textContent = `Bonus: +${BONUS_POINTS_PER_STEP} Punkt(e) pro gesparter Minute.`;
      }
      setTimeMode(timeModeToggle ? !!timeModeToggle.checked : true);
      console.log(`[Timer] Zeitmodus aktiv: ${timeModeEnabled}, Sanduhr: ${!!document.querySelector('.hourglass, #hourglass, [data-hourglass]')}, Toast: ${!!document.getElementById('toast')}, Dateien: math_module/core/scripts.js + math_module/core/styles.css + math_module/levels/level*.html`);

      const openSolutionPopup = (task, solutionText) => {
        updateResults();
        const stats = currentLevelStats || {
          levelId,
          earned: solved.size * POINTS_PER_CORRECT,
          max: totalMax,
          percent: totalMax ? Math.round(((solved.size * POINTS_PER_CORRECT) / totalMax) * 100) : 0,
          grade: gradeFromPercent(totalMax ? Math.round(((solved.size * POINTS_PER_CORRECT) / totalMax) * 100) : 0),
          attemptsTotal: Object.values(levelAttempts).reduce((a, b) => a + (b || 0), 0),
          timeModeEnabled,
          timeBonusPoints: 0,
          timeBonusMax: 0,
          tasksTotal: tasks.length,
          correctCount: solved.size,
          pointsTasks: solved.size * POINTS_PER_CORRECT,
          pointsTime: 0,
          pointsTotal: solved.size * POINTS_PER_CORRECT,
          timeConsumedSec: 0,
          timeSavedSec: 0,
          timeSavedMin: 0,
          timeLimitSec: getTimeLimitSec(),
        };
        const safeSolution = (solutionText || '–').toString().replace(/</g, '&lt;');
        const rows = [
          ['Aufgabe', task.text],
          ['Lösung', safeSolution],
          ['Punkte', `${taskScores.get(task.id) || 0} / ${MAX_LIVES}`],
          ['Versuche (Aufgabe)', levelAttempts[task.id] || 0],
          ['Zeitmodus', stats.timeModeEnabled ? 'An' : 'Aus'],
          ['Zeitbonus', stats.timeModeEnabled ? `${stats.timeBonusPoints}/${stats.timeBonusMax}` : '–'],
          ['Gesamt', `${stats.earned}/${stats.max} (${stats.percent}%)`],
          ['Note', stats.grade],
        ];
        const html = `<div class=\"solution-text\">${safeSolution}</div>${renderResultTable(rows)}`;
        openModal('solution-modal', 'Lösung', html);
      };

      // Tabelle für Versuche/Leben (unter den Aufgaben)
      const ensureAttemptTable = () => {
        let wrap = document.getElementById('attemptTableWrap');
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.id = 'attemptTableWrap';
          wrap.className = 'attempt-table-wrap';
          const hostParent = tasksHost.parentElement;
          if (hostParent) {
            tasksHost.insertAdjacentElement('afterend', wrap);
          }
        }
        if (!wrap.innerHTML) {
          wrap.innerHTML = `
            <h3 class="attempt-table-title">Aufgaben-Übersicht</h3>
            <table class="attempt-log-table live">
              <thead>
                <tr>
                  <th>Nr.</th>
                  <th>Aufgabe</th>
                  <th>Leben 1</th>
                  <th>Leben 2</th>
                  <th>Leben 3</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          `;
        }
        return wrap.querySelector('tbody');
      };

      const renderLifeDots = (marks) => marks.map((m, i) => `
        <span class="life-dot ${m}" data-life="${i + 1}" aria-hidden="true"></span>
      `).join('');

      const renderAttemptTable = () => {
        const tbody = ensureAttemptTable();
        if (!tbody) return;
        tbody.innerHTML = tasks.map((task, idx) => {
          const marks = taskAttemptMarks.get(task.id) || ['empty', 'empty', 'empty'];
          const log = taskAttemptLog.get(task.id) || [];
          const cell = (i) => {
            const mark = marks[i] || 'empty';
            const entry = log[i];
            const text = entry ? escapeHtml(entry.input || '–') : '–';
            return `
              <td>
                <div class="life-cell">
                  <span class="life-dot ${mark}" aria-hidden="true"></span>
                  <span class="life-answer">${text}</span>
                </div>
              </td>
            `;
          };
          return `
            <tr>
              <td>${idx + 1}</td>
              <td>${task.text}</td>
              ${cell(0)}
              ${cell(1)}
              ${cell(2)}
            </tr>
          `;
        }).join('');
      };

      const updateTaskVisuals = (taskId, points) => {
        const refs = taskUiRefs.get(taskId);
        if (!refs) return;
        const marks = taskAttemptMarks.get(taskId) || ['empty', 'empty', 'empty'];
        if (refs.livesEl) refs.livesEl.innerHTML = renderLifeDots(marks);
        renderAttemptTable();
      };

      const formatAttempt = (entry) => {
        if (!entry) return '–';
        return entry.ok ? `✓ ${entry.input}` : `✗ ${entry.input}`;
      };

      const taskDone = taskId => solved.has(taskId) || (levelAttempts[taskId] || 0) >= MAX_LIVES;

      const openLevelEndModal = () => {
        stopTaskTimer();
        markTestRunning(false);
        persistRunState({ finished: true, running: false });
        updateResults();
        const stats = currentLevelStats || {
          levelId,
          earned: solved.size * POINTS_PER_CORRECT,
          max: totalMax,
          percent: totalMax ? Math.round(((solved.size * POINTS_PER_CORRECT) / totalMax) * 100) : 0,
          grade: gradeFromPercent(totalMax ? Math.round(((solved.size * POINTS_PER_CORRECT) / totalMax) * 100) : 0),
          attemptsTotal: Object.values(levelAttempts).reduce((a, b) => a + (b || 0), 0),
          timeModeEnabled,
          timeBonusPoints: 0,
          timeBonusMax: 0,
          tasksTotal: tasks.length,
          correctCount: solved.size,
          pointsTasks: solved.size * POINTS_PER_CORRECT,
          pointsTime: 0,
          pointsTotal: solved.size * POINTS_PER_CORRECT,
          timeConsumedSec: 0,
          timeSavedSec: 0,
          timeSavedMin: 0,
          timeLimitSec: getTimeLimitSec(),
        };
        const rows = tasks.map((task, idx) => {
          const log = taskAttemptLog.get(task.id) || [];
          return `
            <tr>
              <td>${idx + 1}</td>
              <td>${task.text}</td>
              <td>${formatAttempt(log[0])}</td>
              <td>${formatAttempt(log[1])}</td>
              <td>${formatAttempt(log[2])}</td>
              <td>${taskScores.get(task.id) || 0}</td>
            </tr>
          `;
        }).join('');
        const html = `
          <div class="summary">
            <h3>Auswertung</h3>
            <p>Aufgaben gesamt / Total tasks: ${stats.tasksTotal || 0}</p>
            <p>Richtig / Correct: ${stats.correctCount || 0}</p>
            <p>Zeitlimit / Time limit: ${formatClock(stats.timeLimitSec || 0)}</p>
            <p>Zeit gebraucht / Time used: ${formatClock(stats.timeConsumedSec || 0)}</p>
            <p>Zeit gespart / Time saved: ${formatClock((stats.timeSavedMin || 0) * 60)}</p>
            <p>Punkte (Aufgaben) / Task points: ${stats.pointsTasks || 0}</p>
            <p>Zeitbonus / Time bonus: ${stats.pointsTime || 0}</p>
            <p>Gesamtpunkte / Total points: ${stats.pointsTotal || 0}</p>
            <p>Prozent: ${stats.percent}%</p>
            <p>Note (1–6): ${stats.grade}</p>
            <p>Versuche gesamt: ${stats.attemptsTotal}</p>
          </div>
          <table class="attempt-log-table">
            <thead>
              <tr>
                <th>Nr</th>
                <th>Aufgabe</th>
                <th>Versuch 1</th>
                <th>Versuch 2</th>
                <th>Versuch 3</th>
                <th>Punkte</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="modal-actions">
            <button type="button" class="pill btn-primary" id="restart-level-end">Nochmal spielen</button>
            <button type="button" class="pill btn-secondary" id="back-to-levels-end">Zur Level-Auswahl</button>
          </div>
        `;
        openModal('level-end-modal', 'Level beendet', html);
        const body = document.querySelector('#level-end-modal .modal-body');
        const restartBtn = body?.querySelector('#restart-level-end');
        const backBtn = body?.querySelector('#back-to-levels-end');
        if (restartBtn) restartBtn.onclick = () => { resetRun(levelId); location.reload(); };
        if (backBtn) backBtn.onclick = () => {
          stopTaskTimer();
          markTestRunning(false);
          resetRun(levelId);
          window.location.href = `${MODULE_ROOT}/index.html#levels`;
        };
      };

      const maybeOpenLevelEndModal = () => {
        if (finalModalShown) return;
        const allDone = tasks.every(task => taskDone(task.id));
        if (!allDone) return;
        // Bonus in die Spardose buchen: gesparte Zeit + gesparte Leben
        updateResults();
        const bonusToAdd = (currentLevelStats?.timeBonusPoints || 0) + (currentLevelStats?.lifeBonusPoints || 0);
        if (bonusToAdd > 0) addProfileBonusPoints(bonusToAdd);
        finalModalShown = true;
        openLevelEndModal();
      };

      const lockTask = (taskId, reason, ok = false) => {
        const refs = taskUiRefs.get(taskId);
        if (!refs) return;
        if (refs.input) refs.input.disabled = true;
        if (refs.checkBtn) refs.checkBtn.disabled = true;
        if (refs.statusBadge) {
          refs.statusBadge.textContent = ok ? '✅' : '⛔';
          refs.statusBadge.className = `status-badge ${ok ? 'status-ok' : 'status-warn'}`;
        }
        if (refs.feedback && reason) {
          refs.feedback.textContent = reason;
          refs.feedback.className = `feedback ${ok ? 'ok' : 'warn'}`;
        }
      };

      tasks.forEach((task, idx) => {
        const ex = document.createElement('div');
        ex.className = 'exercise';
        ex.dataset.answer = (task.answer || '').toString();
        ex.dataset.points = POINTS_PER_CORRECT.toString();
        ex.dataset.taskId = task.id;

        // Reset attempts per task on render so counters don't leak across tasks
        setAttempts(task.id, 0);
        const attempts = 0;
        const maxPts = POINTS_PER_CORRECT;
        const marks = ['empty', 'empty', 'empty'];
        for (let i = 0; i < attempts; i += 1) marks[i] = 'bad';
        taskAttemptMarks.set(task.id, marks);
        taskAttemptLog.set(task.id, []);

        ex.innerHTML = `
          <p><strong>Slide ${task.slide}:</strong> ${task.text}</p>
          <p class="meta">Max: ${maxPts} Punkte · Versuche: <span class="attempts">${attempts}</span> · <span class="status-badge status-pending">⏳</span></p>
          <div class="lives-row">Leben: <span class="life-dots">${renderLifeDots(marks)}</span></div>
          <div class=\"row\">
            <label for=\"answer-${task.id}\">Antwort:</label>
            <input id=\"answer-${task.id}\" type=\"text\" autocomplete=\"off\">
          </div>
          <div class=\"actions\">
          <button type=\"button\" data-action=\"check-answer\" class=\"pill btn-primary\" data-de=\"Prüfen\" data-en=\"Check\">Prüfen</button>
          <button type=\"button\" data-action=\"show-solution\" class=\"pill btn-secondary\" data-de=\"Lösung\" data-en=\"Solution\">Lösung</button>
            <div class=\"nav-inline\"></div>
          </div>
          <div class=\"feedback\"></div>
          <div class=\"solution\">${task.solution || ''}</div>
        `;

          const checkBtn = ex.querySelector('[data-action=\"check-answer\"]');
          const showSolutionBtn = ex.querySelector('[data-action=\"show-solution\"]');
          const input = ex.querySelector('input');
          const feedback = ex.querySelector('.feedback');
          const solution = ex.querySelector('.solution');
          const attemptsEl = ex.querySelector('.attempts');
        const statusBadge = ex.querySelector('.status-badge');
        const livesEl = ex.querySelector('.life-dots');
        taskUiRefs.set(task.id, {
          task,
          ex,
          input,
          checkBtn,
          attemptsEl,
          statusBadge,
          feedback,
          livesEl,
        });
        updateTaskVisuals(task.id, taskScores.get(task.id) || 0);

        const focusInput = (el, select = true) => {
          if (!el) return;
          requestAnimationFrame(() => {
            el.focus();
            if (select && typeof el.select === 'function') el.select();
          });
        };

        if (attemptsEl) attemptsEl.textContent = '1';

        if (checkBtn && input) {
          const handleCheck = () => {
            if (solved.has(task.id)) return;
            const attemptsUsed = levelAttempts[task.id] || 0; // wrong attempts so far
            if (attemptsUsed >= MAX_LIVES) return;

            const attemptNumber = attemptsUsed + 1; // 1..3 human-readable
            const attemptIndex = attemptNumber - 1;
            const rawVal = (input.value || '').trim();
            const val = rawVal.toLowerCase();
            const expected = (task.answer || '').toString().trim().toLowerCase();
            const correct = val && val === expected;
            const pts = correct ? POINTS_PER_CORRECT : 0;
            const marksNow = taskAttemptMarks.get(task.id) || ['empty', 'empty', 'empty'];
            const log = taskAttemptLog.get(task.id) || [];
            log.push({ input: rawVal || '∅', ok: !!correct, ts: Date.now() });
            taskAttemptLog.set(task.id, log.slice(0, MAX_LIVES));
            if (correct) {
              marksNow[attemptIndex] = 'ok';
              for (let i = attemptIndex + 1; i < MAX_LIVES; i += 1) {
                marksNow[i] = 'gray';
              }
              taskAttemptMarks.set(task.id, marksNow);
              solved.add(task.id);
              taskScores.set(task.id, pts);
              if (statusBadge) {
                statusBadge.textContent = '✅';
                statusBadge.className = 'status-badge status-ok';
              }
              const bonus = awardTaskBonus(task.id, 'Aufgabe gelöst');
              showToast(`Super! +${pts} Punkte`, 'ok');
              if (bonus > 0 && feedback) {
                feedback.textContent = `Richtig! (+${pts} Punkte, Zeitbonus +${bonus})`;
              }
              lockTask(task.id, `Richtig! (+${pts} Punkte)`, true);
            } else if (!solved.has(task.id)) {
              marksNow[attemptIndex] = 'bad';
              taskAttemptMarks.set(task.id, marksNow);
              // only increment attempts on wrong answers
              const attemptsNow = attemptsUsed + 1;
              setAttempts(task.id, attemptsNow);
              taskScores.set(task.id, 0);
              if (statusBadge) {
                statusBadge.textContent = '❌';
                statusBadge.className = 'status-badge status-warn';
              }
              showToast(`Versuch ${attemptNumber} nicht ganz richtig.`, 'warn');
              if (attemptsEl) attemptsEl.textContent = attemptsNow.toString();
              const lifeIdx = attemptNumber - 1;
              marksNow[lifeIdx] = 'bad';
              taskAttemptMarks.set(task.id, marksNow);
              if (attemptsNow >= MAX_LIVES) {
                lockTask(task.id, `Versuch ${attemptNumber} nicht ganz richtig. Keine Versuche mehr.`, false);
                if (statusBadge) statusBadge.textContent = '⛔';
              } else {
                // still lives left; prepare for next try
                updateTaskVisuals(task.id, taskScores.get(task.id) || 0);
                setNextEnabled(false);
              }
            }

            if (attemptsEl) attemptsEl.textContent = attemptNumber.toString();

            if (feedback) {
              feedback.textContent = correct
                ? `Richtig! (+${pts} Punkte)`
                : `Versuch ${attemptNumber} nicht ganz richtig.`;
              feedback.className = 'feedback ' + (correct ? 'ok' : 'warn');
            }

            updateTaskVisuals(task.id, taskScores.get(task.id) || 0);
            hasActivity = true;
            updateResults();
            maybeOpenLevelEndModal();
            focusInput(input, true);
          };

          checkBtn.addEventListener('click', handleCheck);

          // =========================================================
          // DE: Enter im Eingabefeld = "Prüfen" ausführen
          // EN: Press Enter in input = run "Check"
          // RU: Нажатие Enter в поле ввода = выполнить "Проверить"
          // =========================================================
          input.addEventListener('keydown', ev => {
            const isEnter = ev.key === 'Enter' || ev.code === 'NumpadEnter' || ev.keyCode === 13;
            if (!isEnter) return;
            ev.preventDefault();
            ev.stopPropagation(); // verhindert doppeltes Auslösen über den globalen Listener
            handleCheck();
          });
        }

        if (attempts >= MAX_LIVES) {
          updateTaskVisuals(task.id, taskScores.get(task.id) || 0);
          lockTask(task.id, 'Alle 3 Versuche verbraucht.', false);
        }

        // focus first task's input on load
        if (idx === 0) {
          requestAnimationFrame(() => focusInput(input, true));
        }

        if (showSolutionBtn && solution) {
          showSolutionBtn.addEventListener('click', () => {
            solution.classList.add('is-visible');
          });
        }

        ex.dataset.wired = '1';
        tasksHost.appendChild(ex);
        applyBilingualLabels(ex);
        slides.push(ex);

        const navBtn = document.createElement('button');
        navBtn.type = 'button';
        navBtn.textContent = task.slide;
        navBtn.className = 'ghost pill';
        navBtn.addEventListener('click', () => setActiveSlide(task.slide - 1));
        nav.appendChild(navBtn);
      });

      tasksHost.appendChild(pager);

      // DE: Robuster Fallback - Enter im Antwortfeld entspricht Klick auf "Prüfen".
      if (!tasksHost.dataset.enterBound) {
        tasksHost.addEventListener('keydown', ev => {
          const isEnter = ev.key === 'Enter' || ev.code === 'NumpadEnter' || ev.keyCode === 13;
          if (!isEnter) return;
          const target = ev.target;
          if (!target || target.tagName !== 'INPUT') return;
          const exercise = target.closest('.exercise');
          const checkBtn = exercise?.querySelector('[data-action="check-answer"]');
          if (!checkBtn) return;
          ev.preventDefault();
          checkBtn.click();
        });
        tasksHost.dataset.enterBound = '1';
      }

      setActiveSlide = (idx) => {
        const previousTaskId = slides[activeSlide]?.dataset.taskId;
        if (typeof idx === 'number' && idx !== activeSlide && previousTaskId) {
          awardTaskBonus(previousTaskId, 'Slide-Wechsel');
        }
        activeSlide = Math.max(0, Math.min(slides.length - 1, idx));
        slideStore[levelId] = activeSlide;
        saveSlideStore(slideStore);
        updateVisibleSlides();
      };

      updateVisibleSlides = () => {
        if (!slides.length) return;
        slides.forEach((el, i) => {
          const isActive = i === activeSlide;
          el.style.display = isActive ? '' : 'none';
          el.classList.toggle('is-active', isActive);
          if (nav.children[i]) {
            nav.children[i].classList.toggle('active', isActive);
          }
        });
        prevBtn.disabled = activeSlide === 0;
        nextBtn.disabled = activeSlide === slides.length - 1;

        const navInline = slides[activeSlide]?.querySelector('.nav-inline');
        if (navInline) {
          navInline.innerHTML = '';
          navInline.append(prevBtn, nextBtn);
        }
        const activeTaskId = slides[activeSlide]?.dataset.taskId;
        const activeInput = slides[activeSlide]?.querySelector('input');
        if (activeInput) {
          requestAnimationFrame(() => { activeInput.focus(); activeInput.select?.(); });
        }
        if (!canStartTestTimer()) {
          if (testRunning || taskTimerInterval) {
            stopTaskTimer();
            markTestRunning(false);
          }
        } else if (remainingSeconds > 0) {
          startTaskTimer();
        } else {
          stopTaskTimer();
          markTestRunning(false);
        }
        updateTimerUi();
      };

      prevBtn.addEventListener('click', () => setActiveSlide(activeSlide - 1));
      nextBtn.addEventListener('click', () => setActiveSlide(activeSlide + 1));

      updateVisibleSlides();
      applyBilingualLabels(tasksHost);
      if (!tasksHost.dataset.gameActivatedBound) {
        document.addEventListener('ll-game-activated', () => {
          updateVisibleSlides?.();
        });
        tasksHost.dataset.gameActivatedBound = '1';
      }

      updateResults();
      maybeOpenLevelEndModal();
    }).catch((err) => {
      console.error(err);
      showLoadError();
      tasksHost.innerHTML = '';
    });
}

// DE: Note aus Prozent berechnen
// EN: Compute grade from percent
// RU: Ð’Ñ‹Ñ‡Ð¸ÑÐ»Ð¸Ñ‚ÑŒ Ð¾Ñ†ÐµÐ½ÐºÑƒ Ð¿Ð¾ Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚Ñƒ
function gradeFromPercent(percent) {
  if (percent >= 92) return 1;
  if (percent >= 81) return 2;
  if (percent >= 67) return 3;
  if (percent >= 50) return 4;
  if (percent >= 30) return 5;
  return 6;
}

// DE: Übungen verdrahten (Fallback für statische Blöcke)
// EN: Wire exercises (fallback for static blocks)
// RU: Ð¡Ð²ÑÐ·Ð°Ñ‚ÑŒ ÑƒÐ¿Ñ€Ð°Ð¶Ð½ÐµÐ½Ð¸Ñ (Ð´Ð»Ñ ÑÑ‚Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð±Ð»Ð¾ÐºÐ¾Ð²)
function wireExercises() {
  document.querySelectorAll('.exercise').forEach(ex => {
    if (ex.dataset.wired === '1') return;
    ex.dataset.wired = '1';

    const input = ex.querySelector('input');
    const solution = ex.querySelector('.solution');
    const showSolutionBtn = ex.querySelector('[data-role=\"show-solution\"], [data-action=\"show-solution\"]');
    const checkBtn = ex.querySelector('[data-role=\"check\"], [data-action=\"check-answer\"]');

    if (input && checkBtn) {
      input.addEventListener('keydown', ev => {
        const isEnter = ev.key === 'Enter' || ev.code === 'NumpadEnter' || ev.keyCode === 13;
        if (!isEnter) return;
        ev.preventDefault();
        checkBtn.click();
      });
    }

    if (showSolutionBtn && solution) {
      showSolutionBtn.addEventListener('click', () => {
        solution.classList.add('is-visible');
      });
    }
  });
}

// DE: Reset-Button verdrahten
// EN: Wire reset button
// RU: ÐŸÑ€Ð¸Ð²ÑÐ·Ð°Ñ‚ÑŒ ÐºÐ½Ð¾Ð¿ÐºÑƒ ÑÐ±Ñ€Ð¾ÑÐ° ÑƒÑ€Ð¾Ð²Ð½Ñ
function wireResetButton() {
  const btn = document.getElementById('reset-level');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const levelId = parseCurrentLevel();
    if (levelId === null) return;

    // Versuche zurücksetzen
    const attempts = loadAttemptsStore();
    delete attempts[levelId];
    saveAttemptsStore(attempts);

    // Progress zurücksetzen
    const progress = loadProgressStore();
    delete progress[levelId];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));

    // Slide-Position zurücksetzen
    const slides = loadSlideStore();
    delete slides[levelId];
    saveSlideStore(slides);

    // Seite neu laden, um Felder/Feedback zu leeren
    location.reload();
  });
}

// DE: Alles initialisieren nach DOM-Load
// EN: Initialize everything after DOM load
// RU: Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ð¾ÑÐ»Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ DOM
window.addEventListener('DOMContentLoaded', () => {
  initBackgroundOnly();
  initBgMode();
  initWelcomeEnterHandler();
  applyBilingualLabels(document);
  loadLayout();
  renderLevelMapIfPresent();
  renderTasksForCurrentLevel().then(() => {
    wireExercises();
    wireResetButton();
    ensureUserName();
    applyBilingualLabels(document);
  }).catch(() => {
    wireExercises();
    wireResetButton();
    ensureUserName();
    applyBilingualLabels(document);
  });
});

// Globaler Theme-Switch aus Header (hell/dunkel ohne Hintergrundbild)
if (!window.__math_module_theme_listener) {
  window.__math_module_theme_listener = true;
  document.addEventListener('quantura:theme-changed', (ev) => {
    const mode = (ev && ev.detail && ev.detail.theme) || '';
    if (!mode) return;
    setBgMode(mode);
    applyTheme(mode);
  });
}

// Dev test:
// 1) Klicke "Nur Hintergrund / Background only" -> nur Theme-Hintergrund bleibt sichtbar.
// 2) Drücke ESC oder klicke/tippe irgendwo -> UI erscheint wieder ohne Reload.
