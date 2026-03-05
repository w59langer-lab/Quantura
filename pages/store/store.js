const DATA_URL = '/core/data/apps_store.json';
const DEFAULT_ICON = '/core/assets/favicon.ico';
let apps = [];

const listEl = document.getElementById('app-grid');
const detailEl = document.getElementById('app-detail');

if (listEl) initList();
if (detailEl) initDetail();

async function loadApps() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    apps = Array.isArray(data) ? data : [];
    localStorage.setItem('store-cache', JSON.stringify(apps));
  } catch (err) {
    console.error('Store Daten laden fehlgeschlagen', err);
    const cached = localStorage.getItem('store-cache');
    if (cached) {
      try { apps = JSON.parse(cached); } catch (_) { apps = []; }
    } else {
      apps = [];
    }
  }
  return apps;
}

function initList() {
  const search = document.getElementById('search');
  const category = document.getElementById('category');
  const status = document.getElementById('status');
  const offline = document.getElementById('offline');
  const sort = document.getElementById('sort');
  const filterRessourcen = document.getElementById('filter-ressourcen');
  loadApps().then(() => {
    fillCategories(category);
    applyQueryParams(category, status, offline, sort, search);
    renderList();
  });
  [search, category, status, offline, sort].forEach(el => el && el.addEventListener('input', renderList));
  if (filterRessourcen) {
    filterRessourcen.addEventListener('click', () => {
      if (category) category.value = 'ressourcen';
      renderList();
    });
  }
}

function fillCategories(select) {
  if (!select) return;
  const cats = Array.from(new Set(apps.map(a => a.category).filter(Boolean))).sort();
  select.innerHTML = '<option value="all">Alle Kategorien</option>' + cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(cap(c))}</option>`).join('');
}

function applyQueryParams(category, status, offline, sort, search) {
  const params = new URLSearchParams(window.location.search);
  if (category && params.get('cat')) category.value = params.get('cat');
  if (status && params.get('status')) status.value = params.get('status');
  if (sort && params.get('sort')) sort.value = params.get('sort');
  if (offline) offline.checked = params.get('offline') === '1';
  if (search && params.get('q')) search.value = params.get('q');
}

function renderList() {
  if (!listEl) return;
  const search = document.getElementById('search').value.trim().toLowerCase();
  const category = document.getElementById('category').value;
  const statusFilter = document.getElementById('status').value;
  const offlineFilter = document.getElementById('offline').checked;
  const sort = document.getElementById('sort').value;

  let filtered = apps.filter(app => {
    const text = [app.title, app.description, (app.tags || []).join(' ')].join(' ').toLowerCase();
    const matchesText = !search || text.includes(search);
    const matchesCategory = category === 'all' || app.category === category;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesOffline = !offlineFilter || app.offline === true;
    return matchesText && matchesCategory && matchesStatus && matchesOffline;
  });

  if (sort === 'az') {
    filtered.sort((a,b) => (a.title||'').localeCompare(b.title||''));
  } else {
    filtered.sort((a,b) => new Date(b.updated || 0) - new Date(a.updated || 0));
  }

  listEl.innerHTML = '';
  if (!filtered.length) {
    listEl.innerHTML = '<div class="empty">Keine Apps gefunden.</div>';
    return;
  }

  filtered.forEach(app => {
    const card = document.createElement('article');
    card.className = 'app-card';
    const title = document.createElement('h3');
    const icon = document.createElement('span');
    icon.className = 'icon';
    const img = document.createElement('img');
    img.src = app.icon || DEFAULT_ICON;
    img.alt = '';
    icon.appendChild(img);
    title.append(icon, document.createTextNode(app.title));

    const desc = document.createElement('p');
    desc.textContent = app.description || '';

    const badges = document.createElement('div');
    badges.className = 'badges';
    const statusBadge = document.createElement('span');
    statusBadge.className = `badge status-${app.status || 'stable'}`;
    statusBadge.textContent = app.status || 'stable';
    const offlineBadge = document.createElement('span');
    offlineBadge.className = 'badge' + (app.offline ? ' offline' : '');
    offlineBadge.textContent = app.offline ? 'Offline' : 'Online';
    if (app.status === 'external') {
      const ext = document.createElement('span');
      ext.className = 'badge';
      ext.textContent = 'Extern';
      badges.append(ext);
    }
    badges.append(statusBadge, offlineBadge);
    if (Array.isArray(app.lang)) {
      const lang = document.createElement('span');
      lang.className = 'badge';
      lang.textContent = 'Sprache: ' + app.lang.join(', ');
      badges.append(lang);
    }

    const tags = document.createElement('div');
    tags.className = 'tags';
    (app.tags || []).forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const open = document.createElement('a');
    open.className = 'btn primary';
    open.href = app.href || '#';
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = 'Öffnen';
    const details = document.createElement('a');
    details.className = 'btn';
    details.href = `/pages/store/app.html?id=${encodeURIComponent(app.id)}`;
    details.textContent = 'Details';
    buttons.append(open, details);

    card.append(title, desc, badges, tags, buttons);
    listEl.appendChild(card);
  });
}

function initDetail() {
  loadApps().then(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const app = apps.find(a => a.id === id);
    if (!app) {
      detailEl.innerHTML = '<div class="empty">App nicht gefunden. <a href="/pages/store/index.html">Zurück zum Store</a></div>';
      return;
    }
    renderDetail(app);
  });
}

function renderDetail(app) {
  detailEl.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'detail-header';
  const icon = document.createElement('span');
  icon.className = 'icon';
  const img = document.createElement('img');
  img.src = app.icon || DEFAULT_ICON;
  img.alt = '';
  icon.appendChild(img);
  const titleWrap = document.createElement('div');
  titleWrap.innerHTML = `<h1 style="margin:0;">${escapeHtml(app.title)}</h1><div class="empty">${escapeHtml(app.category || '')}</div>`;
  header.append(icon, titleWrap);

  const desc = document.createElement('p');
  desc.textContent = app.description || '';

  const note = document.createElement('p');
  note.className = 'empty';
  note.textContent = app.note || '';

  const tags = document.createElement('div');
  tags.className = 'tags';
  (app.tags || []).forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    tags.appendChild(span);
  });

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `
    <div>Status: <strong>${escapeHtml(app.status || '')}</strong></div>
    <div>Offline: <strong>${app.offline ? 'Ja' : 'Nein'}</strong></div>
    <div>Version: <strong>${escapeHtml(app.version || '')}</strong></div>
    <div>Aktualisiert: <strong>${escapeHtml(app.updated || '')}</strong></div>
    <div>Sprache: <strong>${Array.isArray(app.lang) ? escapeHtml(app.lang.join(', ')) : ''}</strong></div>
  `;

  const buttons = document.createElement('div');
  buttons.className = 'buttons';
  const open = document.createElement('a');
  open.className = 'btn primary';
  open.href = app.href || '#';
  open.target = '_blank';
  open.rel = 'noopener';
  open.textContent = 'Öffnen';
  const back = document.createElement('a');
  back.className = 'btn';
  back.href = '/pages/store/index.html';
  back.textContent = 'Zurück zum Store';
  buttons.append(open, back);

  detailEl.append(header, desc, note, tags, meta, buttons);
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}

function cap(str) { return String(str || '').charAt(0).toUpperCase() + String(str || '').slice(1); }
