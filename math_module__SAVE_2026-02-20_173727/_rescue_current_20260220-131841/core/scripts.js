// ===========================
// DE: Gemeinsames Verhalten für Level-System
// EN: Shared behavior for the level system
// RU: Общая логика для системы уровней
// ===========================
function getModuleRoot() {
  const p = window.location.pathname;
  const idx = p.indexOf('/math_module/');
  if (idx === -1) return '';
  return p.slice(0, idx) + '/math_module';
}
const MODULE_ROOT = getModuleRoot();

const basePath = window.location.pathname.includes('/levels/') ? '..' : '.';
const PROGRESS_KEY = 'math_module_progress_v1';
const ATTEMPTS_KEY = 'math_module_attempts_v1';
const USER_SESSION_KEY = 'll_user_name_session';
const SLIDE_KEY = 'math_module_slide_v1';
const GENERATED_KEY = 'math_module_generated_tasks_v1';
const TIMER_KEY = 'math_module_timer_v1';
let timerInterval = null;

// ===========================
// DE: Benutzername via Session + Modal
// EN: Username via session + modal
// RU: Имя через сессию и модал
// ===========================
function purgeOldNameStorage() {
  localStorage.removeItem('ll_user_name');
  localStorage.removeItem('ll_user_name_session');
}

function getUserName() {
  return (sessionStorage.getItem(USER_SESSION_KEY) || '').trim();
}

function setUserName(name) {
  sessionStorage.setItem(USER_SESSION_KEY, name.trim());
  renderWelcome();
}

function clearUserName() {
  sessionStorage.removeItem(USER_SESSION_KEY);
}

function ensureUserName() {
  purgeOldNameStorage();
  const name = getUserName();
  if (!name) {
    openNameModal();
  } else {
    renderWelcome();
  }
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
  const name = getUserName() || 'Schülerin/Schüler';
  target.innerHTML = `
    <div class=\"welcome-row\">
      <span class=\"welcome-text\">Welcome, ${name}!</span>
      <div class=\"welcome-actions\">
        <button class=\"linklike\" id=\"change-name\">Name ändern</button>
        <button class=\"linklike\" id=\"reset-player\">Neuer Spieler</button>
      </div>
    </div>
  `;
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
      clearUserName();
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(TIMER_KEY);
      localStorage.removeItem(SLIDE_KEY);
      localStorage.removeItem(GENERATED_KEY);
      sessionStorage.removeItem(USER_SESSION_KEY);
      location.reload();
    };
  }
}

function openNameModal() {
  let overlay = document.getElementById('name-modal-backdrop');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'name-modal-backdrop';
    overlay.innerHTML = `
      <div class=\"name-modal\">
        <h3>Hello! Wie heißt du?</h3>
        <p class=\"name-sub\">Gib deinen Namen ein, dann geht’s los.</p>
        <input type=\"text\" id=\"name-input\" placeholder=\"Dein Name…\" autocomplete=\"off\" />
        <button id=\"name-submit\">Start</button>
      </div>
    `;
    document.body.appendChild(overlay);
    const input = overlay.querySelector('#name-input');
    const btn = overlay.querySelector('#name-submit');
    const commit = () => {
      const val = (input.value || '').trim();
      if (!val) return;
      setUserName(val);
      overlay.classList.remove('is-visible');
    };
    btn.addEventListener('click', commit);
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') commit();
    });
  }
  overlay.classList.add('is-visible');
  const input = overlay.querySelector('#name-input');
  if (input) input.focus();
}

// DE: Progress aus localStorage laden
// EN: Load progress from localStorage
// RU: Загрузка прогресса из localStorage
function loadProgressStore() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Progress für Level speichern
// EN: Save progress for a level
// RU: Сохранить прогресс уровня
function saveProgress(levelId, data) {
  const store = loadProgressStore();
  store[levelId] = data;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
}

// DE: Versuche-Store laden
// EN: Load attempts store
// RU: Загрузить хранилище попыток
function loadAttemptsStore() {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Versuche-Store speichern
// EN: Save attempts store
// RU: Сохранить хранилище попыток
function saveAttemptsStore(store) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(store));
}

// DE: Generierte Aufgaben laden
// EN: Load generated tasks
// RU: Загрузить сгенерированные задания
function loadGeneratedStore() {
  try {
    return JSON.parse(localStorage.getItem(GENERATED_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Generierte Aufgaben speichern
// EN: Save generated tasks
// RU: Сохранить сгенерированные задания
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
// RU: Загрузить хранилище текущих слайдов
function loadSlideStore() {
  try {
    return JSON.parse(localStorage.getItem(SLIDE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// DE: Slide-Index-Store speichern
// EN: Save slide index store
// RU: Сохранить хранилище слайдов
function saveSlideStore(store) {
  localStorage.setItem(SLIDE_KEY, JSON.stringify(store));
}

// DE: Toast-Anzeige
// EN: Toast display
// RU: Показ тоста
function showToast(message, type = 'info') {
  let box = document.getElementById('toast');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast';
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.className = `toast ${type}`;
  box.style.opacity = '1';
  setTimeout(() => { box.style.opacity = '0'; }, 1600);
}

// ===========================
// DE: Zufallsaufgaben je Level generieren
// EN: Generate random tasks per level
// RU: Генерация случайных заданий по уровням
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
// RU: Получить процент для уровня
function percentForLevel(levelId) {
  const store = loadProgressStore();
  return (store[levelId] && store[levelId].percent) || 0;
}

// DE: Aktuelles Level aus URL bestimmen
// EN: Detect current level from URL
// RU: Определить текущий уровень из URL
function parseCurrentLevel() {
  const match = window.location.pathname.match(/level(\d+)\.html$/);
  return match ? match[1] : null;
}

// DE: Layout laden (Header/Footer)
// EN: Load layout (header/footer)
// RU: Загрузка макета (хедер/футер)
function loadLayout() {
  const header = document.getElementById('header-placeholder');
  const footer = document.getElementById('footer-placeholder');

  if (header) {
    fetch(`${MODULE_ROOT}/core/header.html`)
      .then(res => res.text())
      .then(html => { header.innerHTML = html; });
  }

  if (footer) {
    fetch(`${MODULE_ROOT}/core/footer.html`)
      .then(res => res.text())
      .then(html => { footer.innerHTML = html; });
  }
}

// DE: Level-Karte rendern, falls Container existiert
// EN: Render level map when container exists
// RU: Отрисовать карту уровней, если есть контейнер
function renderLevelMapIfPresent() {
  const container = document.querySelector('.levels');
  if (!container) return;

  fetch(`${MODULE_ROOT}/data/levels.json`)
    .then(response => response.json())
    .then(levels => {
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
        div.innerHTML = `
          <h3>${level.title}</h3>
          <p>${level.description}</p>
          <progress value="${percent}" max="100"></progress>
          <a href="${MODULE_ROOT}/levels/level${id}.html">Starten</a>
        `;
        container.appendChild(div);
      });
    })
    .catch(() => {
      container.innerHTML = '<p>Levels konnten nicht geladen werden.</p>';
    });
}

// ===========================
// DE: Aufgaben für aktuelles Level laden und rendern
// EN: Load and render tasks for current level
// RU: Загрузить и отрисовать задания для текущего уровня
// ===========================
function renderTasksForCurrentLevel() {
  const tasksHost = document.getElementById('tasks');
  const levelId = parseCurrentLevel();
  if (!tasksHost || levelId === null) return Promise.resolve();

  const results = {
    totalEl: document.getElementById('total-points'),
    earnedEl: document.getElementById('earned-points'),
    percentEl: document.getElementById('percent'),
    gradeEl: document.getElementById('grade'),
  };

  const taskScores = new Map();
  const solved = new Set();
  let totalMax = 0;
  let hasActivity = false;

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
    const earned = Array.from(taskScores.values()).reduce((a, b) => a + b, 0);
    const percent = totalMax > 0 ? Math.round((earned / totalMax) * 100) : 0;
    const grade = gradeFromPercent(percent);

    if (results.totalEl) results.totalEl.textContent = totalMax.toString();
    if (results.earnedEl) results.earnedEl.textContent = earned.toString();
    if (results.percentEl) results.percentEl.textContent = `${percent}%`;
    if (results.gradeEl) results.gradeEl.textContent = grade.toString();

    if (hasActivity) {
      saveProgress(levelId, { earned, max: totalMax, percent, bonusStars: timerState.bonusStars || 0, finishedInSec: timerState.finishedInSec || null, finishedByTime: timerState.finishedByTime || false });
    }
  };

  const slideStore = loadSlideStore();
  const generatedStore = loadGeneratedStore();
  const timerStore = loadTimerStore();
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
        if (tasksHost) tasksHost.innerHTML = `Fehler: tasks.json konnte nicht geladen werden (HTTP ${res.status}). URL: ${MODULE_ROOT}/data/tasks.json`;
        return [];
      }
      return res.json();
    })
      .then(allTasks => allTasks[String(levelId)] || [])
      .catch(() => {
        if (tasksHost) tasksHost.innerHTML = `Fehler: tasks.json konnte nicht geladen werden. URL: ${MODULE_ROOT}/data/tasks.json`;
        return [];
      });
  };

  const resetLevelState = () => {
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
  };

  return getTasks().then(tasks => {
      tasksHost.innerHTML = '';
      totalMax = tasks.reduce((sum, t) => sum + (t.points || 0), 0);

      activeSlide = Math.min(
        tasks.length - 1,
        Math.max(0, slideStore[levelId] ?? 0)
      );

      const slides = [];
      const nav = document.createElement('div');
      nav.className = 'slide-nav';

      const pager = document.createElement('div');
      pager.className = 'slide-pager';

      // Level-Metadaten (Zeitmodus)
      const levelMeta = Array.isArray(levels)
        ? levels.find(l => String(l.level ?? l.id ?? l.levelId) === String(levelId)) || {}
        : {};
      const timeMode = levelMeta.time_mode || 'bonus';
      const recommendedMinutes = levelMeta.recommended_minutes || 5;
      const recommendedSec = recommendedMinutes * 60;

      const timerPanel = document.createElement('div');
      timerPanel.className = 'timer-panel';
      timerPanel.innerHTML = `
        <div class="timer-modes toggle-group">
          <label class="toggle-option active"><input type="radio" name="mode" value="practice" checked> Üben</label>
          <label class="toggle-option" id="timer-mode-label-wrap"><input type="radio" name="mode" value="challenge"> <span id="timer-mode-label">Mit Zeit</span></label>
        </div>
        <div class="timer-info">Empfohlene Zeit: <span id="rec-time">--</span></div>
        <div class="timer-controls">
          <select id="timer-duration">
            <option value="120">2 Min</option>
            <option value="300">5 Min</option>
            <option value="600">10 Min</option>
            <option value="900">15 Min</option>
          </select>
          <button type="button" class="btn-primary pill" id="timer-start">Start Timer</button>
          <span class="timer-display">--:--</span>
        </div>
        <div class="timer-banner" id="timer-banner" hidden>Zeit vorbei – Wertung bis 0:00</div>
      `;

      const newBtn = document.createElement('button');
      newBtn.type = 'button';
      newBtn.textContent = 'Neue Aufgaben';
      newBtn.className = 'btn-secondary pill';
      newBtn.addEventListener('click', () => {
        const generated = loadGeneratedStore();
        generated[levelId] = generateTasksForLevel(levelId);
        saveGeneratedStore(generated);
        resetLevelState();
        location.reload();
      });

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.textContent = '← Zurück';
      prevBtn.className = 'btn-ghost pill';

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.textContent = 'Weiter →';
      nextBtn.className = 'btn-ghost pill';

      let setActiveSlide;
      let updateVisibleSlides;

      pager.append(prevBtn, nextBtn);
      tasksHost.appendChild(nav);
      tasksHost.appendChild(timerPanel);
      tasksHost.appendChild(newBtn);

      // Timer wiring
      const timerState = timerStore[levelId] || {
        mode: 'practice',
        timeMode,
        durationSec: recommendedSec,
        startTs: null,
        endTs: null,
        running: false,
        finished: false,
        finishedByTime: false,
        bonusStars: 0,
        finishedInSec: null,
      };
      timerState.timeMode = timeMode; // ensure sync with latest meta
      const durationSel = timerPanel.querySelector('#timer-duration');
      const startBtn = timerPanel.querySelector('#timer-start');
      const displayEl = timerPanel.querySelector('.timer-display');
      const bannerEl = timerPanel.querySelector('#timer-banner');
      const recEl = timerPanel.querySelector('#rec-time');
      const modeLabel = timerPanel.querySelector('#timer-mode-label');
      const modeWrap = timerPanel.querySelector('#timer-mode-label-wrap');
      const modeInputs = timerPanel.querySelectorAll('input[name="mode"]');
      const modeLabels = timerPanel.querySelectorAll('.toggle-option');

      const saveTimerState = () => {
        timerStore[levelId] = timerState;
        saveTimerStore(timerStore);
      };

      const stopTimer = (reset = false) => {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        timerState.running = false;
        if (reset) {
          timerState.endTs = null;
          timerState.finished = false;
        }
        saveTimerState();
        renderTimer();
      };

      const remainingSec = () => {
        if (timerState.timeMode === 'bonus') {
          if (!timerState.startTs) return 0;
          return Math.max(0, Math.ceil((Date.now() - timerState.startTs) / 1000));
        }
        if (!timerState.endTs) return timerState.durationSec || 0;
        return Math.max(0, Math.ceil((timerState.endTs - Date.now()) / 1000));
      };

      const formatTime = sec => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      const renderToggle = () => {
        modeLabels.forEach(label => {
          const input = label.querySelector('input');
          label.classList.toggle('active', input.value === timerState.mode);
        });
        if (modeLabel) {
          modeLabel.textContent = timerState.timeMode === 'blitz' ? 'Blitz (Countdown)' : 'Mit Zeit (Bonus)';
        }
        if (recEl) recEl.textContent = `${recommendedMinutes} Min`;
      };

      const renderTimer = () => {
        renderToggle();
        if (durationSel) durationSel.value = String(timerState.durationSec || 300);
        if (bannerEl) bannerEl.hidden = !timerState.finished;
        if (!displayEl) return;
        if (timerState.mode === 'practice') {
          displayEl.textContent = '--:--';
          return;
        }
        const val = remainingSec();
        if (timerState.timeMode === 'bonus') {
          displayEl.textContent = formatTime(val);
        } else {
          const rem = timerState.running ? Math.max(0, (timerState.endTs ? Math.ceil((timerState.endTs - Date.now()) / 1000) : timerState.durationSec || 0)) : (timerState.finished ? 0 : (timerState.durationSec || 0));
          displayEl.textContent = formatTime(rem);
        }
      };

      const tick = () => {
        if (timerState.timeMode === 'bonus') {
          const elapsed = remainingSec();
          if (displayEl) displayEl.textContent = formatTime(elapsed);
          return;
        }
        const rem = timerState.endTs ? Math.max(0, Math.ceil((timerState.endTs - Date.now()) / 1000)) : 0;
        if (displayEl) displayEl.textContent = formatTime(rem);
        if (rem <= 0) {
          timerState.running = false;
          timerState.finished = true;
          timerState.finishedByTime = true;
          timerState.endTs = null;
          saveTimerState();
          renderTimer();
          if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        }
      };

      const startTimer = () => {
        const dur = parseInt(durationSel.value, 10) || recommendedSec;
        timerState.durationSec = dur;
        timerState.mode = 'challenge';
        timerState.finished = false;
        timerState.finishedByTime = false;
        timerState.bonusStars = 0;
        timerState.finishedInSec = null;
        if (timerState.timeMode === 'bonus') {
          timerState.startTs = Date.now();
          timerState.endTs = null;
        } else {
          timerState.startTs = Date.now();
          timerState.endTs = Date.now() + dur * 1000;
        }
        timerState.running = true;
        saveTimerState();
        if (timerInterval) clearInterval(timerInterval);
        tick();
        timerInterval = setInterval(tick, 1000);
        renderTimer();
      };

      // Restore previous state
      if (timerState.mode === 'challenge') {
        if (timerState.timeMode === 'bonus') {
          if (timerState.running && timerState.startTs) {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(tick, 1000);
            tick();
          }
        } else {
          const inFuture = timerState.endTs && timerState.endTs > Date.now();
          if (timerState.running && inFuture) {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(tick, 1000);
            tick();
          } else if (timerState.endTs && timerState.endTs <= Date.now()) {
            timerState.running = false;
            timerState.finished = true;
            timerState.finishedByTime = true;
            timerState.endTs = null;
            saveTimerState();
          }
        }
      } else {
        timerState.running = false;
        timerState.endTs = null;
      }

      renderTimer();

      // Event wires
      modeInputs.forEach(input => {
        input.addEventListener('change', () => {
          timerState.mode = input.value === 'challenge' ? 'challenge' : 'practice';
          if (timerState.mode === 'practice') {
            stopTimer(true);
          } else {
            timerState.finished = false;
            timerState.finishedByTime = false;
            timerState.bonusStars = 0;
            timerState.finishedInSec = null;
            saveTimerState();
            renderTimer();
          }
        });
      });

      if (durationSel) {
        durationSel.addEventListener('change', () => {
          const dur = parseInt(durationSel.value, 10) || 300;
          timerState.durationSec = dur;
          if (!timerState.running) {
            renderTimer();
            saveTimerState();
          }
        });
      }

      if (startBtn) {
        startBtn.addEventListener('click', () => {
          if (timerState.mode !== 'challenge') {
            timerState.mode = 'challenge';
          }
          startTimer();
        });
      }

      tasks.forEach(task => {
        const ex = document.createElement('div');
        ex.className = 'exercise';
        ex.dataset.answer = (task.answer || '').toString();
        ex.dataset.points = (task.points || 0).toString();
        ex.dataset.taskId = task.id;

        const attempts = levelAttempts[task.id] || 0;
        const maxPts = task.points || 0;

        ex.innerHTML = `
          <p><strong>Slide ${task.slide}:</strong> ${task.text}</p>
          <p class="meta">Max: ${maxPts} Punkte · Versuche: <span class="attempts">${attempts}</span> · <span class="status-badge status-pending">⏳</span></p>
          <div class=\"row\">
            <label for=\"answer-${task.id}\">Antwort:</label>
            <input id=\"answer-${task.id}\" type=\"text\" autocomplete=\"off\">
          </div>
          <div class=\"actions\">
            <button type=\"button\" data-action=\"check-answer\" class=\"pill btn-primary\">Prüfen</button>
            <button type=\"button\" data-action=\"show-solution\" class=\"pill btn-secondary\">zeige Lösung / show solution / показать решение</button>
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

        if (checkBtn && input) {
          checkBtn.addEventListener('click', () => {
            const attemptsNow = incAttempts(task.id);
            const val = (input.value || '').trim().toLowerCase();
            const expected = (task.answer || '').toString().trim().toLowerCase();
            const correct = val && val === expected;
            const pts = correct ? (task.points || 0) : 0;
            const timeExpired = timerState.timeMode === 'blitz' && timerState.finished && timerState.finishedByTime;
            if (timeExpired) {
              if (feedback) {
                feedback.textContent = `Nach Zeit: keine Wertung (0:00 erreicht)`;
                feedback.className = 'feedback warn';
              }
            } else if (correct) {
              solved.add(task.id);
              taskScores.set(task.id, Math.max(taskScores.get(task.id) || 0, pts));
              if (statusBadge) {
                statusBadge.textContent = '✅';
                statusBadge.className = 'status-badge status-ok';
              }
              showToast(`Super! +${pts} Punkte`, 'ok');
            } else if (!solved.has(task.id)) {
              taskScores.set(task.id, 0);
              if (statusBadge) {
                statusBadge.textContent = '❌';
                statusBadge.className = 'status-badge status-warn';
              }
              showToast(`Versuch ${attemptsNow}: Nicht ganz.`, 'warn');
            }

            if (attemptsEl) attemptsEl.textContent = attemptsNow.toString();

            if (feedback) {
              feedback.textContent = correct
                ? `Richtig! / Correct! / Верно! (+${pts} Punkte)`
                : `Versuch ${attemptsNow}: Nicht ganz. / Not quite. / Не совсем.`;
              feedback.className = 'feedback ' + (correct ? 'ok' : 'warn');
            }

            hasActivity = true;
            updateResults();

            if (timerState.timeMode === 'bonus' && timerState.running && solved.size === tasks.length) {
              const elapsed = remainingSec();
              timerState.running = false;
              timerState.finished = true;
              timerState.finishedByTime = false;
              timerState.finishedInSec = elapsed;
              const t60 = recommendedSec * 0.6;
              const t80 = recommendedSec * 0.8;
              timerState.bonusStars = elapsed <= t60 ? 2 : (elapsed <= t80 ? 1 : 0);
              saveTimerState();
              updateResults();
              renderTimer();
            }
          });

          // =========================================================
          // DE: Enter im Eingabefeld = \"Prüfen\" ausführen
          // EN: Press Enter in input = run \"Check\"
          // RU: Нажатие Enter в поле ввода = выполнить \"Проверить\"
          // =========================================================
          input.addEventListener('keydown', ev => {
            if (ev.key !== 'Enter') return;
            ev.preventDefault();
            checkBtn.click();
          });
        }

        if (showSolutionBtn && solution) {
          showSolutionBtn.addEventListener('click', () => {
            solution.classList.add('is-visible');
          });
        }

        ex.dataset.wired = '1';
        tasksHost.appendChild(ex);
        slides.push(ex);

        const navBtn = document.createElement('button');
        navBtn.type = 'button';
        navBtn.textContent = task.slide;
        navBtn.className = 'ghost pill';
        navBtn.addEventListener('click', () => setActiveSlide(task.slide - 1));
        nav.appendChild(navBtn);
      });

      tasksHost.appendChild(pager);

      setActiveSlide = (idx) => {
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
      };

      prevBtn.addEventListener('click', () => setActiveSlide(activeSlide - 1));
      nextBtn.addEventListener('click', () => setActiveSlide(activeSlide + 1));

      updateVisibleSlides();

      updateResults();
    }).catch(() => {
      tasksHost.innerHTML = '<p>Aufgaben konnten nicht geladen werden.</p>';
    });
}

// DE: Note aus Prozent berechnen
// EN: Compute grade from percent
// RU: Вычислить оценку по проценту
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
// RU: Связать упражнения (для статических блоков)
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
        if (ev.key !== 'Enter') return;
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
// RU: Привязать кнопку сброса уровня
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
// RU: Инициализация после загрузки DOM
window.addEventListener('DOMContentLoaded', () => {
  loadLayout();
  renderLevelMapIfPresent();
  renderTasksForCurrentLevel().then(() => {
    wireExercises();
    wireResetButton();
    ensureUserName();
  }).catch(() => {
    wireExercises();
    wireResetButton();
    ensureUserName();
  });
});
