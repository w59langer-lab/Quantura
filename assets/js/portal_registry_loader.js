(async function () {
  const selectEl = document.getElementById('topicSelect');
  const searchEl = document.getElementById('topicSearch');
  const filterBtns = Array.from(document.querySelectorAll('.topicFilter'));
  if (!selectEl) return;

  const REGISTRY_URL = 'assets/data/portal_registry.json';
  const norm = (s) => (s || '').toString().toLowerCase().trim();

  let currentType = 'all';
  let allItems = [];

  async function loadRegistry() {
    const res = await fetch(REGISTRY_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Registry load failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  function getFilteredList() {
    const t = currentType;
    if (t === 'all') return allItems;
    return allItems.filter(it => (it.type || 'page') === t);
  }

  function buildOptions(list) {
    selectEl.innerHTML = '';

    const opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = 'Thema wählen …';
    selectEl.appendChild(opt0);

    const groups = new Map();
    for (const it of list) {
      if (!it || !it.title || !it.url) continue;
      const g = (it.group || 'Sonstiges').toString();
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(it);
    }

    const order = ['Fächer', 'Apps', 'Tools', 'Bibliothek', 'Sonstiges'];
    const groupNames = Array.from(groups.keys()).sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    for (const name of groupNames) {
      const og = document.createElement('optgroup');
      og.label = name;

      const items = groups.get(name).slice().sort((x, y) => (x.title || '').localeCompare(y.title || ''));
      for (const it of items) {
        const opt = document.createElement('option');
        opt.value = it.url;
        opt.textContent = it.title;
        opt.dataset.type = (it.type || 'page');
        og.appendChild(opt);
      }

      selectEl.appendChild(og);
    }
  }

  function filterOptions(query) {
    const q = norm(query);

    for (const opt of Array.from(selectEl.options)) {
      if (!opt.value) { opt.hidden = false; continue; }
      const matchText = !q || norm(opt.textContent).includes(q);
      opt.hidden = !matchText;
    }

    for (const og of Array.from(selectEl.querySelectorAll('optgroup'))) {
      const visible = Array.from(og.querySelectorAll('option')).some(o => !o.hidden);
      og.hidden = !visible;
    }
  }

  function applyAllFilters() {
    buildOptions(getFilteredList());
    filterOptions(searchEl ? searchEl.value : '');
  }

  function setActive(btn) {
    filterBtns.forEach(b => b.style.opacity = (b === btn ? '1' : '.65'));
    filterBtns.forEach(b => b.style.fontWeight = (b === btn ? '700' : '400'));
  }

  try {
    const reg = await loadRegistry();
    allItems = Array.isArray(reg.topics) ? reg.topics
            : Array.isArray(reg.items)  ? reg.items
            : [];

    applyAllFilters();

    if (searchEl) {
      searchEl.addEventListener('input', () => filterOptions(searchEl.value));
    }

    if (filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          currentType = btn.dataset.type || 'all';
          setActive(btn);
          applyAllFilters();
        });
      });
      setActive(filterBtns[0]);
    }

    selectEl.addEventListener('change', () => {
      const href = selectEl.value;
      if (href) window.location.href = href;
    });

  } catch (e) {
    console.error(e);
  }
})();
