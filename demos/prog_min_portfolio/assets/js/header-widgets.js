(() => {
  const KEY = "preferred-theme";
  const STYLE_ID = "hdr-widget-style";
  const pad = (n) => String(n).padStart(2, "0");

  const STYLE = `
  :root{
    --hdr-bg: var(--panelbg, rgba(15,23,42,.88));
    --hdr-bg-soft: rgba(15,23,42,.72);
    --hdr-border: var(--panelbd, rgba(255,255,255,.16));
    --hdr-shadow: var(--shadow, 0 16px 46px rgba(0,0,0,0.45));
    --hdr-text: var(--text, #e5e7eb);
  }

  .hdr-right{
    position:static;
    display:flex;
    align-items:center;
    gap:14px;
    padding:6px 8px;
    border-radius:12px;
    background:transparent;
    border:0;
    box-shadow:none;
    color:inherit;
    min-width:0;
  }
  .hdr-right, .hdr-right *{font-family:inherit;}
  /* no floating header widgets */

  .hdr-clock{line-height:1.2; font-variant-numeric: tabular-nums; display:flex; flex-direction:column; gap:4px;}
  .hdr-row{display:flex;align-items:center;gap:10px;}
  .hdr-time{font-weight:800;font-size:20px;letter-spacing:0.02em;}
  .hdr-date{font-size:14px;opacity:.95;}
  .hdr-week{margin-left:auto;padding:4px 10px;border-radius:999px;border:1px solid var(--hdr-border);background:var(--hdr-bg-soft);font-size:13px;opacity:.98;}

  .hdr-ico{width:18px;height:18px;flex:0 0 18px;opacity:.95;}
  .hdr-ico, .hdr-ico *{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}

  .btn-theme{
    border:1px solid var(--hdr-border);
    background:linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
    color:inherit;
    border-radius:14px;
    width:46px;
    height:46px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    font-size:20px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 28px rgba(0,0,0,0.32);
    transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  }
  .btn-theme:hover{transform:translateY(-1px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.18), 0 14px 36px rgba(0,0,0,0.34);border-color:rgba(34,211,238,0.45);}
  .btn-theme:active{transform:translateY(0);}
  .btn-theme span{line-height:1;}

  .btn-cal{appearance:none;border:1px solid var(--hdr-border);background:var(--hdr-bg-soft);padding:6px;margin:0;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;transition:background .12s ease,border-color .12s ease, color .12s ease; color:var(--hdr-text);}
  .btn-cal:hover{background:rgba(34,211,238,0.10);border-color:rgba(34,211,238,0.45);color:#e8f5ff;}

  .hdr-cal{position:absolute;top:100%;right:0;margin-top:10px;width: 300px;border-radius:16px;padding:14px;background:var(--hdr-bg);color:var(--hdr-text);border:1px solid var(--hdr-border);box-shadow: var(--hdr-shadow);} 
  .cal-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}
  .cal-month{font-weight:800;font-size:15px;letter-spacing:0.01em;}
  .cal-nav{border:1px solid var(--hdr-border);background:var(--hdr-bg-soft);color:inherit;border-radius:10px;padding:6px 12px;cursor:pointer;transition:background .12s ease,border-color .12s ease,color .12s ease;}
  .cal-nav:hover{background:rgba(34,211,238,0.12);border-color:rgba(34,211,238,0.38);color:#e8f5ff;}
  .cal-table{width:100%;border-collapse:collapse;font-size:13.5px;}
  .cal-table th, .cal-table td{text-align:center;padding:7px 4px;border-bottom:1px solid rgba(255,255,255,0.06);} 
  .cal-table thead th{font-weight:800;}
  .cal-kw{width:36px;font-weight:700;}
  .cal-out{opacity:.32;}
  .cal-today{background:rgba(34,211,238,.16);outline:2px solid rgba(34,211,238,.55);outline-offset:-2px;border-radius:8px;box-shadow:0 0 0 1px rgba(34,211,238,.15);}
  .cal-day{border-radius:8px;}

  @media (max-width:760px){
    .hdr-right{flex-wrap:wrap;justify-content:flex-start;}
    .hdr-date{display:none;}
    .hdr-cal{width:260px;}
  }

  /* Back/Home Toolbar */
  .nav-back{
    position:static;
    display:flex;
    gap:10px;
    align-items:center;
    padding:6px 8px;
    border-radius:12px;
    background:var(--hdr-bg);
    border:1px solid var(--hdr-border);
    box-shadow:var(--hdr-shadow);
    color:var(--hdr-text);
    flex-wrap:wrap;
    margin-left:auto;
  }
  .nav-back.floating{
    position:fixed;
    right:16px;
    bottom:16px;
    padding:10px 12px;
    border-radius:14px;
    background:var(--hdr-bg);
    border:1px solid var(--hdr-border);
    box-shadow:0 18px 42px rgba(0,0,0,0.42);
    color:var(--hdr-text);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    flex-wrap:wrap;
    z-index:9998;
  }

  .nav-btn{
    appearance:none;
    border:1px solid var(--hdr-border);
    background:linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.04));
    color:var(--hdr-text);
    border-radius:12px;
    padding:9px 14px;
    cursor:pointer;
    font-weight:800;
    font-family:inherit;
    box-shadow:0 10px 24px rgba(13,47,91,0.18);
    transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease, color .12s ease;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    gap:6px;
    white-space:nowrap;
  }

  .nav-btn:hover{transform:translateY(-1px);box-shadow:0 14px 32px rgba(13,47,91,0.22);border-color:rgba(34,211,238,0.45);color:#e8f5ff;} 
  .nav-btn:active{transform:translateY(0);} 

  .nav-btn.ghost{
    background:var(--hdr-bg-soft);
    border-color:var(--hdr-border);
    box-shadow:none;
  }

  @media (max-width:640px){
    .nav-back{justify-content:flex-start;}
  }
  `;

  const isPortfolioHome = false;

  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  function placeWidgetIntoHeader(wrap){
    if (!wrap) return;
    const headerRow = document.querySelector(".site-header .header-row");
    if (headerRow && wrap.parentElement !== headerRow){
      headerRow.appendChild(wrap);
      headerRow.style.alignItems = "center";
    }
  }

  function ensureWidget(){
    let wrap = document.querySelector(".hdr-right");
    if (wrap) return wrap;

    const tpl = `
      <button id="btnTheme" class="btn-theme" type="button" aria-label="Theme umschalten">
        <span id="themeIcon">🌙</span>
      </button>

      <div class="hdr-clock" title="Datum &amp; Uhrzeit">
        <div class="hdr-row">
          <svg class="hdr-ico" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v6l4 2"></path>
          </svg>
          <span class="hdr-time" id="hdrTime">--:--:--</span>
        </div>
        <div class="hdr-row">
          <button id="btnCal" class="btn-cal" type="button" aria-label="Kalender öffnen">
            <svg class="hdr-ico" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="16" rx="2"></rect>
              <path d="M7 3.5v3M17 3.5v3M3 9h18"></path>
            </svg>
          </button>
          <span class="hdr-date" id="hdrDate">--.--.----</span>
          <span class="hdr-week" id="hdrWeek">KW --</span>
        </div>

        <div class="hdr-cal" id="hdrCal" hidden>
          <div class="cal-head">
            <button class="cal-nav" id="calPrev" type="button" aria-label="Vorheriger Monat">‹</button>
            <div class="cal-month" id="calMonth">—</div>
            <button class="cal-nav" id="calNext" type="button" aria-label="Nächster Monat">›</button>
          </div>

          <table class="cal-table" aria-label="Kalender">
            <thead>
              <tr>
                <th class="cal-kw">KW</th>
                <th>Mo</th><th>Di</th><th>Mi</th><th>Do</th><th>Fr</th><th>Sa</th><th>So</th>
              </tr>
            </thead>
            <tbody id="calBody"></tbody>
          </table>
        </div>
      </div>`;

    wrap = document.createElement("div");
    wrap.className = "hdr-right";
    wrap.innerHTML = tpl;
    document.body.appendChild(wrap);
    placeWidgetIntoHeader(wrap);
    return wrap;
  }

  function formatTime(d){
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function formatDateLong(d){
    const date = new Intl.DateTimeFormat("de-DE", { day:"2-digit", month:"long", year:"numeric" }).format(d);
    const weekday = new Intl.DateTimeFormat("de-DE", { weekday:"long" }).format(d);
    return `${weekday}, ${date}`;
  }

  function getISOWeek(date){
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;            // So=7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);    // auf Donnerstag
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  }

  function startOfISOWeek(date){
    const d = new Date(date);
    const day = d.getDay() || 7; // So=7
    d.setDate(d.getDate() - (day - 1)); // zurück bis Montag
    d.setHours(0,0,0,0);
    return d;
  }

  function applyTheme(theme){
    const root = document.documentElement;
    const body = document.body;

    root.dataset.theme = theme;
    body.dataset.theme = theme;

    root.classList.toggle("theme-dark", theme === "dark");
    root.classList.toggle("theme-light", theme === "light");
    body.classList.toggle("theme-dark", theme === "dark");
    body.classList.toggle("theme-light", theme === "light");

    try { localStorage.setItem(KEY, theme); } catch (_) { /* ignore quota */ }
    const icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = (theme === "dark") ? "☀️" : "🌙";
    const btn = document.getElementById("btnTheme");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark");
  }

  function initTheme(){
    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
      if (!saved) {
        const legacy = localStorage.getItem("ll_theme");
        if (legacy === "light" || legacy === "dark") {
          saved = legacy;
          localStorage.setItem(KEY, legacy);
        }
      }
    } catch (_) { /* ignore */ }
    if (saved === "dark" || saved === "light") return applyTheme(saved);

    const preset = document.documentElement.dataset.theme;
    if (preset === "dark" || preset === "light") return applyTheme(preset);

    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) return applyTheme("light");

    applyTheme("dark");
  }

  function renderMonth(viewDate){
    const calBody = document.getElementById("calBody");
    const calMonth = document.getElementById("calMonth");
    if (!calBody || !calMonth) return;

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    calMonth.textContent = new Intl.DateTimeFormat("de-DE", { month:"long", year:"numeric" }).format(viewDate);

    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);

    // Kalender: von Montag der Woche mit dem 1. bis Sonntag der Woche mit dem letzten Tag
    let cur = startOfISOWeek(first);
    const end = new Date(startOfISOWeek(last));
    end.setDate(end.getDate() + 6); // Sonntag

    const today = new Date();
    today.setHours(0,0,0,0);

    let html = "";
    while (cur <= end){
      const weekNo = getISOWeek(cur);
      html += `<tr>`;
      html += `<td class="cal-kw">${String(weekNo).padStart(2,"0")}</td>`;

      for (let i=0;i<7;i++){
        const d = new Date(cur);
        d.setDate(cur.getDate() + i);
        d.setHours(0,0,0,0);

        const inMonth = (d.getMonth() === month);
        const isToday = (d.getTime() === today.getTime());

        const cls = [
          "cal-day",
          inMonth ? "" : "cal-out",
          isToday ? "cal-today" : ""
        ].filter(Boolean).join(" ");

        html += `<td class="${cls}">${d.getDate()}</td>`;
      }

      html += `</tr>`;
      cur.setDate(cur.getDate() + 7);
    }

    calBody.innerHTML = html;
  }

  function initClockAndKW(){
    const elT = document.getElementById("hdrTime");
    const elD = document.getElementById("hdrDate");
    const elW = document.getElementById("hdrWeek");

    if (!elT || !elD) return;

    const tick = () => {
      const now = new Date();
      elT.textContent = formatTime(now);
      elD.textContent = formatDateLong(now);
      if (elW) elW.textContent = `KW ${String(getISOWeek(now)).padStart(2,"0")}`;
    };

    tick();
    setInterval(tick, 1000);
  }

  function initCalendarPopup(){
    const btn = document.getElementById("btnCal");
    const pop = document.getElementById("hdrCal");
    const prev = document.getElementById("calPrev");
    const next = document.getElementById("calNext");
    if (!btn || !pop || !prev || !next) return;

    let view = new Date();
    view.setDate(1);
    view.setHours(0,0,0,0);

    const open = () => {
      pop.hidden = false;
      renderMonth(view);
    };
    const close = () => { pop.hidden = true; };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (pop.hidden) open(); else close();
    });

    prev.addEventListener("click", (e) => {
      e.stopPropagation();
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      renderMonth(view);
    });

    next.addEventListener("click", (e) => {
      e.stopPropagation();
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      renderMonth(view);
    });

    document.addEventListener("click", (e) => {
      if (!pop.hidden){
        const clock = document.querySelector(".hdr-clock");
        if (clock && !clock.contains(e.target)) close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !pop.hidden) close();
    });
  }

  function initToggle(){
    const btn = document.getElementById("btnTheme");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  function buildHomeHref(){
    const path = window.location.pathname;
    const rootMatch = path.match(/(.*?Prog_Min)/);
    if (rootMatch){
      return `${location.protocol}//${location.host}${rootMatch[1]}/index.html`;
    }

    if (location.origin && location.origin !== "null"){
      return `${location.origin}/index.html`;
    }

    const parts = path.split("/");
    while (parts.length > 1){
      parts.pop();
      const candidate = parts.join("/") + "/index.html";
      if (candidate.startsWith("/")){
        return `${location.protocol}//${location.host}${candidate}`;
      }
    }

    return "index.html";
  }

  function initBackNav(){
    if (document.querySelector(".nav-back")) return;

    const homeHref = buildHomeHref();
    const wrap = document.createElement("div");
    wrap.className = "nav-back floating";
    wrap.setAttribute("role", "navigation");

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "nav-btn";
    backBtn.setAttribute("aria-label", "Eine Seite zurück");
    backBtn.textContent = "← Zurück";
    backBtn.addEventListener("click", () => {
      if (history.length > 1) history.back();
      else window.location.href = homeHref;
    });

    const homeBtn = document.createElement("a");
    homeBtn.href = homeHref;
    homeBtn.className = "nav-btn ghost";
    homeBtn.setAttribute("aria-label", "Zum Portal");
    homeBtn.textContent = "⟲ Portal";

    wrap.append(backBtn, homeBtn);

    document.body.appendChild(wrap);
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectStyle();
    const wrap = ensureWidget();
    initTheme();
    initClockAndKW();
    initToggle();
    initCalendarPopup();
    initBackNav();
    if (!isPortfolioHome){
      // Re-attach to header once it exists (header is fetched async)
      setTimeout(() => placeWidgetIntoHeader(wrap), 80);
      document.addEventListener("ll-header-ready", () => placeWidgetIntoHeader(wrap), { once:true });
    }
  });
})();
