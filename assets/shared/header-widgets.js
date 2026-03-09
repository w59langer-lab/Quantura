(() => {
  const ROOT_ATTR = "data-header-widgets-root";
  const PLACEHOLDER_SEL = "[data-header-widgets-placeholder]";
  const THEME_KEY = "lg_theme";
  let mounted = false;
  let clockTimer = null;
  let calendarCursor = new Date();

  const pad = (n) => String(n).padStart(2, "0");

  function findPlaceholder() {
    const el = document.querySelector(PLACEHOLDER_SEL);
    if (!el) console.warn("[header-widgets] placeholder not found");
    return el;
  }

  function removeStrayRoots(slot) {
    document.querySelectorAll("[" + ROOT_ATTR + '="1"]').forEach((el) => {
      if (!slot.contains(el)) el.remove();
    });
  }

  function buildWidgets() {
    const wrap = document.createElement("div");
    wrap.className = "header-widgets hdr-bar";
    wrap.setAttribute(ROOT_ATTR, "1");
    wrap.innerHTML = `
      <button id="hwTheme" class="btn-theme" type="button" aria-label="Theme umschalten"><span id="hwThemeIcon">🌙</span></button>
      <div class="hdr-clock" title="Datum & Uhrzeit">
        <div class="hdr-row">
          <svg class="hdr-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>
          <span class="hdr-time" id="hwTime">--:--:--</span>
          <span class="hdr-week" id="hwWeek">KW --</span>
        </div>
        <div class="hdr-row">
          <button id="hwCalBtn" class="btn-cal" type="button" aria-label="Kalender öffnen">
            <svg class="hdr-ico" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="16" rx="2"></rect>
              <path d="M7 3.5v3M17 3.5v3M3 9h18"></path>
            </svg>
          </button>
          <span class="hdr-date" id="hwDate">--.--.----</span>
        </div>
        <div class="hdr-cal" id="hwCal" hidden>
          <div class="cal-head">
            <button class="cal-nav" id="hwCalPrev" type="button" aria-label="Vorheriger Monat">‹</button>
            <div class="cal-month" id="hwCalMonth">—</div>
            <button class="cal-nav" id="hwCalNext" type="button" aria-label="Nächster Monat">›</button>
          </div>
          <table class="cal-table" aria-label="Kalender">
            <thead>
              <tr><th class="cal-kw">KW</th><th>Mo</th><th>Di</th><th>Mi</th><th>Do</th><th>Fr</th><th>Sa</th><th>So</th></tr>
            </thead>
            <tbody id="hwCalBody"></tbody>
          </table>
        </div>
      </div>
    `;
    return wrap;
  }

  function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function formatTime(d) {
    return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  function formatDateLong(d) {
    return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric", weekday: "long" }).format(d);
  }

  function updateClock() {
    if (!mounted) return;
    const now = new Date();
    const t = document.getElementById("hwTime");
    const d = document.getElementById("hwDate");
    const kw = document.getElementById("hwWeek");
    if (t) t.textContent = formatTime(now);
    if (d) d.textContent = formatDateLong(now);
    if (kw) kw.textContent = "KW " + pad(getISOWeek(now));
  }

  function buildCalendar(date) {
    const body = document.getElementById("hwCalBody");
    const monthLbl = document.getElementById("hwCalMonth");
    if (!body || !monthLbl) return;
    body.innerHTML = "";
    const y = date.getFullYear();
    const m = date.getMonth();
    const first = new Date(y, m, 1);
    const start = new Date(first);
    const day = (first.getDay() + 6) % 7; // Mo=0
    start.setDate(first.getDate() - day);
    monthLbl.textContent = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(date);

    for (let week = 0; week < 6; week++) {
      const tr = document.createElement("tr");
      const monday = new Date(start);
      monday.setDate(start.getDate() + week * 7);
      const kw = getISOWeek(monday);
      const th = document.createElement("th");
      th.className = "cal-kw";
      th.textContent = kw;
      tr.appendChild(th);

      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + i);
        const td = document.createElement("td");
        td.textContent = dayDate.getDate();
        if (dayDate.getMonth() !== m) td.classList.add("cal-out");
        const today = new Date();
        if (dayDate.toDateString() === today.toDateString()) td.classList.add("cal-today");
        td.classList.add("cal-day");
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
  }

  function initCalendarControls() {
    const cal = document.getElementById("hwCal");
    const btn = document.getElementById("hwCalBtn");
    if (!cal || !btn) return;

    const toggle = () => cal.toggleAttribute("hidden");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });
    document.addEventListener("click", (e) => {
      if (!cal.contains(e.target) && !btn.contains(e.target)) cal.hidden = true;
    });
    const prev = document.getElementById("hwCalPrev");
    const next = document.getElementById("hwCalNext");
    if (prev) prev.onclick = () => { calendarCursor.setMonth(calendarCursor.getMonth() - 1); buildCalendar(calendarCursor); };
    if (next) next.onclick = () => { calendarCursor.setMonth(calendarCursor.getMonth() + 1); buildCalendar(calendarCursor); };
    buildCalendar(calendarCursor);
  }

  let hasUserThemePref = false;
  function applyTheme(mode, { emit = true } = {}) {
    const m = mode === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = m;
    document.body.dataset.theme = m;
    document.body.dataset.bgMode = m;
    const icon = document.getElementById("hwThemeIcon");
    if (icon) icon.textContent = m === "dark" ? "🌙" : "☀️";
    if (emit && hasUserThemePref) {
      document.dispatchEvent(new CustomEvent("quantura:theme-changed", { detail: { theme: m } }));
    }
  }

  function initThemeToggle() {
    const btn = document.getElementById("hwTheme");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      hasUserThemePref = true;
      applyTheme(next, { emit: true });
      try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    });

    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
    if (saved === "light" || saved === "dark") {
      hasUserThemePref = true;
      applyTheme(saved, { emit: true });
    } else {
      hasUserThemePref = false;
      applyTheme(document.documentElement.dataset.theme || "dark", { emit: false });
    }
  }

  function mountWidgets() {
    if (mounted) return true;
    const slot = findPlaceholder();
    if (!slot) return false;

    removeStrayRoots(slot);
    let root = slot.querySelector("[" + ROOT_ATTR + '="1"]');
    if (!root) {
      root = buildWidgets();
      slot.appendChild(root);
    }

    mounted = true;
    if (clockTimer) clearInterval(clockTimer);
    updateClock();
    clockTimer = setInterval(updateClock, 1000);
    initCalendarControls();
    initThemeToggle();
    return true;
  }

  function tryMount() {
    if (mounted) return;
    mountWidgets();
  }

  tryMount();
  document.addEventListener("DOMContentLoaded", tryMount);
  window.addEventListener("load", tryMount);
  document.addEventListener("quantura:partial-loaded", (e) => {
    if (e && e.detail && e.detail.type === "header") tryMount();
  });

  const observer = new MutationObserver(() => {
    if (mounted) { observer.disconnect(); return; }
    if (mountWidgets()) observer.disconnect();
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();
