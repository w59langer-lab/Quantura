// Quick test: Load any level -> Start/answer -> timer counts down 05:00 total; wrong answer increments attempts (max 2); correct or max attempts enables Next; progress shows Done X/Y increments once per task; timer expiry locks inputs until reload/start.
(() => {
  const CFG = { totalSeconds: 300, maxAttempts: 2, tickMs: 250 };

  const KEY = (() => {
    const p = location.pathname || "";
    const name = (p.split("/" ).pop() || "level").replace(/\W+/g, "_");
    return "GS_FIX_V3_" + name;
  })();

  const rxCorrect = /(richtig|korrekt|super|gut gemacht|prima|toll|✅|correct|great|right|правил|верно|молодец)/i;

  const state = {
    startedAtMs: null,
    finalized: new Set(),
    currentTask: 0,
    attemptsUsed: 0,
    solved: 0,
    total: 0,
    canNext: false,
    testOver: false,
    intervalId: null,
  };

  const pad2 = n => String(n).padStart(2, "0");
  const fmtMMSS = sec => {
    sec = Math.max(0, Math.floor(sec));
    return pad2(Math.floor(sec / 60)) + ":" + pad2(sec % 60);
  };

  function loadPersisted() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || typeof s !== "object") return;
      state.startedAtMs = typeof s.startedAtMs === "number" ? s.startedAtMs : null;
      state.solved = s.solved || 0;
      state.total = s.total || 0;
      state.currentTask = s.currentTask || 0;
      state.finalized = new Set(s.finalized || []);
      state.testOver = !!s.testOver;
    } catch {}
  }

  function persist() {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        startedAtMs: state.startedAtMs,
        solved: state.solved,
        total: state.total,
        currentTask: state.currentTask,
        finalized: Array.from(state.finalized),
        testOver: state.testOver,
      }));
    } catch {}
  }

  function findClockEl() {
    const ids = ["clock","timer","hdrTime","uhr","time","zeit","timerText"];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return document.querySelector("[data-gs-clock]");
  }

  function ensureOverlay() {
    let box = document.getElementById("gsOverlay");
    if (box) return box;
    box = document.createElement("div");
    box.id = "gsOverlay";
    Object.assign(box.style, {
      position: "fixed", top: "10px", right: "10px", zIndex: "99999",
      padding: "10px 12px", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,.12)",
      background: "rgba(255,255,255,.92)", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      fontSize: "14px", lineHeight: "1.25", userSelect: "none", backdropFilter: "blur(6px)"
    });
    box.innerHTML = "" +
      "      <div id="gsOverlayTimer" style="font-weight:700;font-size:18px;">05:00</div>
" +
      "      <div id="gsOverlayAttempts" style="margin-top:6px;"></div>
" +
      "      <div id="gsOverlayProgress" style="margin-top:6px;"></div>
" +
      "      <div id="gsOverlayMsg" style="margin-top:6px;color:#b91c1c;font-weight:600;"></div>
";
    document.body.appendChild(box);
    return box;
  }

  function setTimerText(text) {
    const el = findClockEl();
    if (el) el.textContent = text;
    const ov = document.getElementById("gsOverlayTimer");
    if (ov) ov.textContent = text;
  }

  function setAttemptsText(text) {
    const ov = document.getElementById("gsOverlayAttempts");
    if (ov) ov.textContent = text;
    const candidates = [
      "#attemptInfo","#attemptsInfo","#tryInfo","#triesInfo",
      "#versuchInfo","#versucheInfo","#attempt","#attempts",
      "#lifeInfo","#livesInfo"
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) { el.textContent = text; break; }
    }
  }

  function setProgressText(text) {
    const ov = document.getElementById("gsOverlayProgress");
    if (ov) ov.textContent = text;
    const el = document.querySelector("#progressInfo, #doneInfo, [data-gs-progress]");
    if (el) el.textContent = text;
  }

  function setNextEnabled(on) {
    const n = findBtn(/(next|weiter|далее|след)/i, ["btnNext","nextBtn","btnWeiter"]);
    if (!n) return;
    if ("disabled" in n) n.disabled = !on;
    n.classList?.toggle?.("gs-next-disabled", !on);
    n.setAttribute?.("aria-disabled", on ? "false" : "true");
  }

  function findBtn(rx, fallbackIds=[]) {
    for (const id of fallbackIds) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    const btns = Array.from(document.querySelectorAll("button,input[type=button],a"));
    return btns.find(b => rx.test((b.id||"") + " " + (b.className||"") + " " + (b.textContent||b.value||"")));
  }

  function findCheckBtn() { return findBtn(/(check|prüf|pruef|контрол|verify|провер)/i, ["btnCheck","checkBtn","btnPruefen","btnPruef"]); }
  function findStartBtn() { return findBtn(/(start|los|begin|нача|enter)/i, ["btnStart","startBtn","btnLos"]); }

  function isCorrectShown() {
    const sels = ["#msg","#message","#feedback","#result","#status",".msg",".message",".feedback",".result",".status","[data-msg]","[data-feedback]","[data-result]"];
    for (const sel of sels) {
      const el = document.querySelector(sel);
      if (el && rxCorrect.test(el.textContent || "")) return true;
    }
    const small = Array.from(document.querySelectorAll("p,div,span")).slice(0, 80);
    return small.some(el => {
      const t = (el.textContent || "").trim();
      return t.length >= 3 && t.length <= 80 && rxCorrect.test(t);
    });
  }

  function updateAttemptsUI() {
    const used = Math.max(0, state.attemptsUsed);
    const max = CFG.maxAttempts;
    const left = Math.max(0, max - used);
    const current = used === 0 ? 1 : used;
    setAttemptsText("Попытка " + current + "/" + max + " (осталось " + left + ")");
  }

  function updateProgressUI() {
    const total = Math.max(state.total || 0, state.finalized.size || 0);
    const text = total > 0 ? ("Done " + state.solved + "/" + total) : ("Done " + state.solved);
    setProgressText(text);
  }

  function startTimerIfNeeded() {
    if (state.startedAtMs || state.testOver) return;
    state.startedAtMs = Date.now();
  }

  function updateTimerUI() {
    if (!state.startedAtMs) {
      setTimerText(fmtMMSS(CFG.totalSeconds));
      return;
    }
    const elapsed = Math.floor((Date.now() - state.startedAtMs) / 1000);
    const left = Math.max(0, CFG.totalSeconds - elapsed);
    setTimerText(fmtMMSS(left));
    if (left <= 0 && !state.testOver) endTest();
  }

  function endTest() {
    state.testOver = true;
    setTimerText("00:00");
    const msg = document.getElementById("gsOverlayMsg");
    if (msg) msg.textContent = "Zeit abgelaufen – bitte Test neu starten";
    const check = findCheckBtn();
    if (check) check.disabled = true;
    const inputs = document.querySelectorAll("input,select,button,textarea");
    inputs.forEach(el => {
      if (el.type === "button" || el.tagName === "BUTTON") el.disabled = true;
    });
    setNextEnabled(true);
    persist();
  }

  function finalizeCurrent(reason="done") {
    const key = "task_" + state.currentTask;
    if (!state.finalized.has(key)) {
      state.finalized.add(key);
      state.solved += 1;
      state.total = Math.max(state.total, state.currentTask + 1);
    }
    state.canNext = true;
    setNextEnabled(true);
    updateProgressUI();
    persist();
  }

  function resetForNextTask() {
    state.attemptsUsed = 0;
    state.canNext = false;
    setNextEnabled(false);
    updateAttemptsUI();
    const msg = document.getElementById("gsOverlayMsg");
    if (msg) msg.textContent = "";
  }

  function onCheckClick(ev) {
    if (state.testOver) return;
    startTimerIfNeeded();
    setNextEnabled(false);
    setTimeout(() => {
      const correct = isCorrectShown();
      if (correct) {
        finalizeCurrent("correct");
      } else {
        state.attemptsUsed = Math.min(CFG.maxAttempts, state.attemptsUsed + 1);
        if (state.attemptsUsed >= CFG.maxAttempts) {
          finalizeCurrent("attempts");
        } else {
          state.canNext = false;
          setNextEnabled(false);
        }
        updateAttemptsUI();
        persist();
      }
    }, 50);
    updateAttemptsUI();
  }

  function onNextCapture(ev) {
    if (!state.canNext && !state.testOver) {
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    }
    setTimeout(() => {
      state.currentTask += 1;
      state.total = Math.max(state.total, state.currentTask + 1);
      resetForNextTask();
      persist();
    }, 40);
    return true;
  }

  function onStart(ev) {
    state.startedAtMs = Date.now();
    state.testOver = false;
    state.finalized.clear();
    state.solved = 0;
    state.total = 0;
    state.currentTask = 0;
    resetForNextTask();
    persist();
  }

  function hookTaskFunctions() {
    const names = ["loadTask","showTask","renderTask","setTask","nextTask","newTask","generateTask","goNext","taskNext"];
    for (const name of names) {
      const fn = window[name];
      if (typeof fn !== "function") continue;
      if (fn.__gsFixWrapped) continue;
      const wrapped = function(...args) {
        try {
          const idx = args.find(a => Number.isFinite(a));
          if (Number.isFinite(idx) && idx !== state.currentTask) {
            state.currentTask = idx;
            state.total = Math.max(state.total, idx + 1);
            resetForNextTask();
            persist();
          }
        } catch {}
        return fn.apply(this, args);
      };
      wrapped.__gsFixWrapped = true;
      window[name] = wrapped;
    }
  }

  function boot() {
    ensureOverlay();
    loadPersisted();
    hookTaskFunctions();
    updateAttemptsUI();
    updateProgressUI();
    setNextEnabled(false);
    updateTimerUI();

    const checkBtn = findCheckBtn();
    if (checkBtn) checkBtn.addEventListener("click", onCheckClick, true);
    const nextBtn = findBtn(/(next|weiter|далее|след)/i, ["btnNext","nextBtn","btnWeiter"]);
    if (nextBtn) nextBtn.addEventListener("click", onNextCapture, true);
    const startBtn = findStartBtn();
    if (startBtn) startBtn.addEventListener("click", onStart, true);

    state.intervalId = setInterval(() => {
      hookTaskFunctions();
      updateTimerUI();
      updateAttemptsUI();
      updateProgressUI();
    }, CFG.tickMs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
