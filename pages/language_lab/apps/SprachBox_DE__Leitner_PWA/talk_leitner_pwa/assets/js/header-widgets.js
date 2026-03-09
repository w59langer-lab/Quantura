(() => {
  const STYLE_ID = "sb-hdr-style";
  const pad = n => String(n).padStart(2, "0");

  const STYLE = `
  :root{
    --hdr-bg: var(--panelbg, rgba(15,23,42,.88));
    --hdr-bg-soft: rgba(15,23,42,.72);
    --hdr-border: var(--panelbd, rgba(255,255,255,.16));
    --hdr-shadow: var(--shadow, 0 16px 46px rgba(0,0,0,0.45));
    --hdr-text: var(--text, #e5e7eb);
  }

  .hdr-bar{
    display:flex;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;
    color:inherit;
    font-family:inherit;
    padding:6px 8px;
  }
  .hdr-clock{line-height:1.2; font-variant-numeric: tabular-nums; display:flex; flex-direction:column; gap:2px;}
  .hdr-row{display:flex;align-items:center;gap:8px;}
  .hdr-time{font-weight:800;font-size:18px;letter-spacing:0.02em;}
  .hdr-date{font-size:13px;opacity:.9;}
  .hdr-week{padding:4px 10px;border-radius:999px;border:1px solid var(--hdr-border);background:var(--hdr-bg-soft);font-size:12px;opacity:.95;}

  .hdr-ico{width:18px;height:18px;flex:0 0 18px;opacity:.95;}
  .hdr-ico, .hdr-ico *{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}

  .btn-theme{
    border:1px solid var(--hdr-border);
    background:linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
    color:inherit;
    border-radius:12px;
    width:44px;
    height:44px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    font-size:20px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 28px rgba(0,0,0,0.32);
    transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  }
  .btn-theme:hover{transform:translateY(-1px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.18), 0 14px 36px rgba(0,0,0,0.34);border-color:rgba(122,167,255,0.45);}
  .btn-theme:active{transform:translateY(0);}
  .btn-theme span{line-height:1;}

  .btn-cal{appearance:none;border:1px solid var(--hdr-border);background:var(--hdr-bg-soft);padding:6px;margin:0;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;transition:background .12s ease,border-color .12s ease, color .12s ease; color:var(--hdr-text);}
  .btn-cal:hover{background:rgba(34,211,238,0.10);border-color:rgba(34,211,238,0.45);color:#e8f5ff;}

  .hdr-cal{position:absolute;top:100%;right:0;margin-top:10px;width: 300px;border-radius:16px;padding:14px;background:var(--hdr-bg);color:var(--hdr-text);border:1px solid var(--hdr-border);box-shadow:var(--hdr-shadow);} 
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

  `;

  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  function ensureWidget(){
    let wrap = document.querySelector(".hdr-bar");
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
          <span class="hdr-week" id="hdrWeek">KW --</span>
        </div>
        <div class="hdr-row">
          <button id="btnCal" class="btn-cal" type="button" aria-label="Kalender öffnen">
            <svg class="hdr-ico" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="16" rx="2"></rect>
              <path d="M7 3.5v3M17 3.5v3M3 9h18"></path>
            </svg>
          </button>
          <span class="hdr-date" id="hdrDate">--.--.----</span>
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
      </div>
    `;

    wrap = document.createElement("div");
    wrap.className = "hdr-bar";
    wrap.innerHTML = tpl;
    document.body.appendChild(wrap);
    return wrap;
  }

  function attachToTopbar(wrap){
    const bar = document.querySelector(".topbar .top-actions") || document.querySelector(".topbar");
    if (bar && wrap && wrap.parentElement !== bar){
      bar.appendChild(wrap);
    }
  }

  const THEME_KEY = "quantura.sprachbox.theme";
  function applyTheme(mode){
    const root = document.documentElement;
    const body = document.body;
    const m = mode === "light" ? "light" : "dark";
    root.dataset.theme = m;
    body.dataset.theme = m;
    const icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = m === "dark" ? "🌙" : "☀️";
  }

  function toggleTheme(){
    const current = document.documentElement.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_){}
  }

  function initTheme(){
    const btn = document.getElementById("btnTheme");
    if (!btn) return;
    btn.addEventListener("click", toggleTheme);
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch(_){}
    if (saved === "light" || saved === "dark") applyTheme(saved);
    else applyTheme(document.documentElement.dataset.theme || "dark");
  }

  function formatTime(d){
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  function formatDateLong(d){
    return new Intl.DateTimeFormat("de-DE", { day:"2-digit", month:"long", year:"numeric", weekday:"long" }).format(d);
  }
  function getISOWeek(date){
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }

  function updateClock(){
    const now = new Date();
    const t = document.getElementById("hdrTime");
    const d = document.getElementById("hdrDate");
    const kw = document.getElementById("hdrWeek");
    if (t) t.textContent = formatTime(now);
    if (d) d.textContent = formatDateLong(now);
    if (kw) kw.textContent = `KW ${pad(getISOWeek(now))}`;
  }

  function buildCalendar(date){
    const body = document.getElementById("calBody");
    const monthLbl = document.getElementById("calMonth");
    if (!body || !monthLbl) return;
    body.innerHTML = "";
    const y = date.getFullYear();
    const m = date.getMonth();
    const first = new Date(y, m, 1);
    const start = new Date(first);
    const day = (first.getDay() + 6) % 7; // Mo=0
    start.setDate(first.getDate() - day);
    monthLbl.textContent = new Intl.DateTimeFormat("de-DE", { month:"long", year:"numeric" }).format(date);

    for (let week = 0; week < 6; week++){
      const tr = document.createElement("tr");
      const monday = new Date(start);
      monday.setDate(start.getDate() + week * 7);
      const kw = getISOWeek(monday);
      const th = document.createElement("th");
      th.className = "cal-kw";
      th.textContent = kw;
      tr.appendChild(th);

      for (let i=0;i<7;i++){
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + i);
        const td = document.createElement("td");
        td.textContent = dayDate.getDate();
        const isOut = dayDate.getMonth() !== m;
        if (isOut) td.classList.add("cal-out");
        const today = new Date();
        if (dayDate.toDateString() === today.toDateString()) td.classList.add("cal-today");
        td.classList.add("cal-day");
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
  }

  function initCalendar(){
    const cal = document.getElementById("hdrCal");
    const btn = document.getElementById("btnCal");
    if (!cal || !btn) return;
    let cursor = new Date();
    buildCalendar(cursor);

    const toggle = () => cal.toggleAttribute("hidden");
    btn.addEventListener("click", toggle);
    document.addEventListener("click", e => {
      if (!cal.contains(e.target) && !btn.contains(e.target)){
        cal.hidden = true;
      }
    });
    document.getElementById("calPrev").onclick = () => { cursor.setMonth(cursor.getMonth()-1); buildCalendar(cursor); };
    document.getElementById("calNext").onclick = () => { cursor.setMonth(cursor.getMonth()+1); buildCalendar(cursor); };
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectStyle();
    const wrap = ensureWidget();
    attachToTopbar(wrap);
    initTheme();
    updateClock();
    setInterval(updateClock, 1000);
    initCalendar();
  });
})();
