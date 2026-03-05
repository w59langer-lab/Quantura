// RU: Дата: 21.02.2026 — Логика P02: таймер, жизни, банка очков, таблица прогресса
// DE: Datum: 21.02.2026 — Logik P02: Timer, Leben, Punkteglas, Fortschrittstabelle
// EN: Date: 2026-02-21 — Logic P02: timer, lives, points jar, progress table

const CONFIG = {
  tasksCount: 5,
  livesStart: 3,
  perCorrect: 3,
  perLife: 1,
  perSavedMin: 1,
  capTimeBonusToCorrect: true,
};

const state = {
  running: false,
  finished: false,
  startTs: 0,
  elapsedSec: 0,
  correct: 0,
  wrong: 0,
  lives: CONFIG.livesStart,
  step: 0,
  rows: [],
  autoTimer: null,
  clockTimer: null,
};

const timeLimitSec = CONFIG.tasksCount * 60;
const maxPossible =
  CONFIG.tasksCount * CONFIG.perCorrect +
  CONFIG.livesStart * CONFIG.perLife +
  CONFIG.tasksCount * CONFIG.perSavedMin;

const timerText = document.getElementById("timerText");
const livesText = document.getElementById("livesText");
const scoreText = document.getElementById("scoreText");
const jarFill = document.getElementById("jarFill");
const progressBody = document.getElementById("progressBody");

const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const btnCorrect = document.getElementById("btnCorrect");
const btnWrong = document.getElementById("btnWrong");
const btnReset = document.getElementById("btnReset");
const btnAuto = document.getElementById("btnAuto");

function formatClock(sec) {
  const safe = Math.max(0, sec | 0);
  const mm = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
}

function getSavedMin() {
  const savedSec = Math.max(0, timeLimitSec - state.elapsedSec);
  return Math.floor(savedSec / 60);
}

function getTimeBonusPoints() {
  const savedMin = getSavedMin();
  const cappedMin = CONFIG.capTimeBonusToCorrect
    ? Math.min(savedMin, state.correct)
    : savedMin;
  return cappedMin * CONFIG.perSavedMin;
}

function computeScore() {
  const taskPoints = state.correct * CONFIG.perCorrect;
  const lifePoints = Math.max(0, state.lives) * CONFIG.perLife;
  const timeBonus = getTimeBonusPoints();
  return taskPoints + lifePoints + timeBonus;
}

function getRemainingSec() {
  return Math.max(0, timeLimitSec - state.elapsedSec);
}

function getStatus() {
  if (state.finished) return "Beendet";
  if (state.running) return "Läuft";
  return "Pausiert";
}

function renderLives() {
  const full = "❤️".repeat(Math.max(0, state.lives));
  const empty = "🖤".repeat(Math.max(0, CONFIG.livesStart - state.lives));
  livesText.textContent = full + empty;
}

function renderTimer() {
  timerText.textContent = formatClock(getRemainingSec());
}

function popScore() {
  scoreText.classList.add("pop");
  jarFill.closest(".jar")?.classList.add("pop");
  window.setTimeout(() => {
    scoreText.classList.remove("pop");
    jarFill.closest(".jar")?.classList.remove("pop");
  }, 220);
}

function renderScore(pop = false) {
  const score = computeScore();
  scoreText.textContent = String(score);
  const percent = Math.max(0, Math.min(100, (score / maxPossible) * 100));
  jarFill.style.height = `${percent}%`;
  if (pop) popScore();
}

function renderTable() {
  progressBody.innerHTML = state.rows
    .map((r) => {
      const cls = r.delta >= 0 ? "delta-plus" : "delta-minus";
      const sign = r.delta > 0 ? "+" : "";
      return `<tr>
        <td>${r.idx}</td>
        <td>${r.status}</td>
        <td class="${cls}">${sign}${r.delta}</td>
        <td>${r.total}</td>
      </tr>`;
    })
    .join("");
}

function renderAll(pop = false) {
  renderTimer();
  renderLives();
  renderScore(pop);
  renderTable();
}

function stopClock() {
  if (state.clockTimer) {
    clearInterval(state.clockTimer);
    state.clockTimer = null;
  }
  state.running = false;
}

function finishDemo(reason) {
  stopClock();
  state.finished = true;
  logStep(reason, 0);
}

function tick() {
  if (!state.running || state.finished) return;
  state.elapsedSec = Math.max(
    0,
    Math.floor((Date.now() - state.startTs) / 1000)
  );
  if (state.elapsedSec >= timeLimitSec) {
    state.elapsedSec = timeLimitSec;
    renderAll();
    finishDemo("Zeit abgelaufen");
    return;
  }
  renderAll();
}

function startTimer() {
  if (state.finished || state.running) return;
  state.running = true;
  state.startTs = Date.now() - state.elapsedSec * 1000;
  state.clockTimer = setInterval(tick, 1000);
  logStep("Timer Start", 0);
}

function stopTimer() {
  if (!state.running) return;
  tick();
  stopClock();
  logStep("Timer Stop", 0);
}

function logStep(status, delta) {
  state.step += 1;
  const total = computeScore();
  state.rows.unshift({
    idx: state.step,
    status: `${status} (${getStatus()})`,
    delta,
    total,
  });
  renderAll(delta !== 0);
}

function applyCorrect() {
  if (!state.running || state.finished) return;
  if (state.correct >= CONFIG.tasksCount) return;
  state.correct += 1;
  const delta = CONFIG.perCorrect;
  logStep("Richtig ✅", delta);
  if (state.correct >= CONFIG.tasksCount) {
    finishDemo("Alle Aufgaben erledigt");
  }
}

function applyWrong() {
  if (!state.running || state.finished) return;
  state.wrong += 1;
  const lifeBefore = state.lives;
  state.lives = Math.max(0, state.lives - 1);
  const lifeDelta = (state.lives - lifeBefore) * CONFIG.perLife;
  logStep("Falsch ❌", lifeDelta);
  if (state.lives <= 0) {
    finishDemo("Keine Leben mehr");
  }
}

function stopAutoDemo() {
  if (state.autoTimer) {
    clearInterval(state.autoTimer);
    state.autoTimer = null;
  }
  btnAuto.textContent = "Auto-Demo ▶";
}

function startAutoDemo() {
  if (state.autoTimer || state.finished) return;
  if (!state.running) startTimer();
  btnAuto.textContent = "Auto-Demo ■";
  state.autoTimer = setInterval(() => {
    if (state.finished) {
      stopAutoDemo();
      return;
    }
    const isCorrect = Math.random() > 0.35;
    if (isCorrect) applyCorrect();
    else applyWrong();
  }, 1100);
}

function toggleAutoDemo() {
  if (state.autoTimer) stopAutoDemo();
  else startAutoDemo();
}

function resetDemo() {
  stopClock();
  stopAutoDemo();
  state.running = false;
  state.finished = false;
  state.startTs = 0;
  state.elapsedSec = 0;
  state.correct = 0;
  state.wrong = 0;
  state.lives = CONFIG.livesStart;
  state.step = 0;
  state.rows = [];
  renderAll();
  logStep("Reset", 0);
}

btnStart?.addEventListener("click", startTimer);
btnStop?.addEventListener("click", stopTimer);
btnCorrect?.addEventListener("click", applyCorrect);
btnWrong?.addEventListener("click", applyWrong);
btnReset?.addEventListener("click", resetDemo);
btnAuto?.addEventListener("click", toggleAutoDemo);

renderAll();
