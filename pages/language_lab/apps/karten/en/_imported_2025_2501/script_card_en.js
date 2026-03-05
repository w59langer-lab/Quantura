// =============================================================
// EN: English Cards Trainer – EN/DE (+optional RU) with 7-box Leitner system.
// DE: English Cards Trainer – EN/DE (+optional RU) mit 7-Fächer-Leitner-System.
// RU: Тренажёр карточек EN/DE (+необязательный RU) с 7 коробками Лейтнера.
// =============================================================

// -------------------------------------------------------------
// DOM references / DOM-Referenzen / Ссылки на DOM
// -------------------------------------------------------------
const cardListEl = document.getElementById("cardList");
const cardCountEl = document.getElementById("cardCount");
const searchInputEl = document.getElementById("searchInput");

const formEl = document.getElementById("cardForm");
const enInputEl = document.getElementById("enInput");
const deInputEl = document.getElementById("deInput");
const ruInputEl = document.getElementById("ruInput");
const clearAllBtn = document.getElementById("clearAllBtn");

const exportAreaEl = document.getElementById("exportArea");
const exportJsonBtnEl = document.getElementById("exportJsonBtn");
const exportTsvBtnEl = document.getElementById("exportTsvBtn");
const importBtnEl = document.getElementById("importBtn");

const modeEnDeEl = document.getElementById("modeEnDe");
const modeDeEnEl = document.getElementById("modeDeEn");

const openTrainerBtnEl = document.getElementById("openTrainerBtn");
const trainerOverlayEl = document.getElementById("trainerOverlay");
const trainerInfoEl = document.getElementById("trainerInfo");
const trainerFrontTextEl = document.getElementById("trainerFrontText");
const trainerFrontAudioEl = document.getElementById("trainerFrontAudio");
const trainerToggleAnswerBtnEl = document.getElementById(
  "trainerToggleAnswerBtn"
);
const trainerBackAreaEl = document.getElementById("trainerBackArea");
const trainerBackTextEl = document.getElementById("trainerBackText");
const trainerBackAudioEl = document.getElementById("trainerBackAudio");
const trainerRuAreaEl = document.getElementById("trainerRuArea");
const trainerPrevBtnEl = document.getElementById("trainerPrevBtn");
const trainerNextBtnEl = document.getElementById("trainerNextBtn");
const trainerSkipBtnEl = document.getElementById("trainerSkipBtn");
const trainerIKnewBtnEl = document.getElementById("trainerIKnewBtn");
const trainerIDidntKnowBtnEl = document.getElementById("trainerIDidntKnowBtn");
const trainerCloseBtnEl = document.getElementById("trainerCloseBtn");

const themeToggleBtnEl = document.getElementById("themeToggleBtn");

// -------------------------------------------------------------
// Storage keys / Speicher-Schlüssel / Ключи хранения
// -------------------------------------------------------------
const STORAGE_KEY_ARCHIVE = "en_card_archive_v1"; // all cards ever
const STORAGE_KEY_THEME = "en_card_theme_v1";

// -------------------------------------------------------------
// In-memory state / Zustand / Состояние
// -------------------------------------------------------------
/**
 * EN: Archive of all cards (active + finished).
 * DE: Archiv aller Karten (aktiv + fertig).
 * RU: Архив всех карточек (активные и завершённые).
 *
 * {
 *   id: number,
 *   en: string,
 *   de: string,
 *   ru: string,
 *   box: number,      // 1–7
 *   active: boolean,  // true = in trainer, false = finished
 *   createdAt: number
 * }
 */
let archiveCards = [];

// trainer queue (linear order 7→1)
let trainerQueue = []; // array of IDs
let trainerIndex = -1;

// current mode: "en-de" or "de-en"
let currentMode = "en-de";

// last spoken text for "repeat"
let lastSpeechText = "";
let lastSpeechRate = 1;

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------
function normalizeBox(box) {
  const n = Number(box);
  if (!Number.isFinite(n)) return 1;
  if (n < 1) return 1;
  if (n > 7) return 7;
  return Math.round(n);
}

function loadArchive() {
  const raw = localStorage.getItem(STORAGE_KEY_ARCHIVE);
  if (!raw) {
    // Small default examples
    archiveCards = [
      {
        id: 1,
        en: "I am learning English.",
        de: "Ich lerne Englisch.",
        ru: "",
        box: 1,
        active: true,
        createdAt: Date.now(),
      },
      {
        id: 2,
        en: "Please speak more slowly.",
        de: "Bitte sprich langsamer.",
        ru: "",
        box: 1,
        active: true,
        createdAt: Date.now(),
      },
    ];
    saveArchive();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      archiveCards = parsed.map((it, idx) => ({
        id: typeof it.id === "number" ? it.id : Date.now() + idx,
        en: String(it.en || ""),
        de: String(it.de || ""),
        ru: it.ru ? String(it.ru) : "",
        box: normalizeBox(it.box ?? 1),
        active: it.active === false ? false : true,
        createdAt: it.createdAt || Date.now(),
      }));
    } else {
      archiveCards = [];
    }
  } catch (e) {
    console.error("Load error:", e);
    archiveCards = [];
  }
}

function saveArchive() {
  try {
    localStorage.setItem(STORAGE_KEY_ARCHIVE, JSON.stringify(archiveCards));
  } catch (e) {
    console.error("Save error:", e);
  }
}

// -------------------------------------------------------------
// Theme handling / Theme-Verwaltung / Темы
// -------------------------------------------------------------
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
    themeToggleBtnEl.textContent = "🌙 Dark";
  } else {
    document.body.classList.remove("theme-dark");
    themeToggleBtnEl.textContent = "🌞 Light";
  }
}

function loadTheme() {
  const t = localStorage.getItem(STORAGE_KEY_THEME) || "light";
  applyTheme(t);
}

themeToggleBtnEl.addEventListener("click", () => {
  const isDark = document.body.classList.contains("theme-dark");
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY_THEME, next);
});

// -------------------------------------------------------------
// TTS (Text to Speech) / Sprachausgabe / Озвучка
// -------------------------------------------------------------
let ttsSupported =
  "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

/**
 * EN: Speak English text with given rate.
 * DE: Liest englischen Text mit gegebener Geschwindigkeit.
 * RU: Озвучивает английский текст с заданной скоростью.
 */
function speakText(text, rate) {
  if (!ttsSupported) {
    alert(
      "SpeechSynthesis is not supported in this browser. / " +
        "Sprachausgabe wird in diesem Browser nicht unterstützt. / " +
        "Синтез речи в этом браузере не поддерживается."
    );
    return;
  }
  if (!text) return;

  if (window.TTSManager) {
    window.TTSManager.speak(text, "en-US", { rate });
    lastSpeechText = text;
    lastSpeechRate = rate;
    return;
  }

  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;

  lastSpeechText = text;
  lastSpeechRate = rate;

  window.speechSynthesis.speak(u);
}

/**
 * EN: Speak sentence by ID and mode (slow/normal/fast).
 * DE: Liest Satz nach ID und Modus (slow/normal/fast).
 * RU: Озвучивает предложение по ID и скорости.
 */
function speakSentenceById(id, mode) {
  const s = archiveCards.find((c) => c.id === id);
  if (!s) return;
  let rate = 1;
  if (mode === "slow") rate = 0.6;
  else if (mode === "fast") rate = 1.4;
  speakText(s.en, rate);
}

// Expose to HTML
window.speakSentenceById = speakSentenceById;

/**
 * EN/DE/RU: Repeat last spoken text.
 */
function repeatSpeech() {
  if (!lastSpeechText) return;
  speakText(lastSpeechText, lastSpeechRate || 1);
}
window.repeatSpeech = repeatSpeech;

// -------------------------------------------------------------
// Rendering of list view / Listenansicht / Список карточек
// -------------------------------------------------------------
function buildTtsButtonsHtml(id) {
  return `
    <div class="tts-buttons">
      <button type="button" onclick="speakSentenceById(${id}, 'slow')">
        <span class="tts-icon">🐢</span>
        <span>Slow / Langsam / Медленно</span>
      </button>
      <button type="button" onclick="speakSentenceById(${id}, 'normal')">
        <span class="tts-icon">▶</span>
        <span>Normal / Normal / Нормально</span>
      </button>
      <button type="button" onclick="speakSentenceById(${id}, 'fast')">
        <span class="tts-icon">🚀</span>
        <span>Fast / Schnell / Быстро</span>
      </button>
      <button type="button" onclick="repeatSpeech()">
        <span class="tts-icon">🔁</span>
        <span>Repeat / Wiederholen / Повторить</span>
      </button>
    </div>
  `;
}

/**
 * EN: Render archive list (active + finished).
 * DE: Rendert Archivliste (aktiv + fertig).
 * RU: Рисует список архива (активные и завершённые).
 */
function renderCards() {
  const search = (searchInputEl.value || "").trim().toLowerCase();

  const filtered = archiveCards.filter((s) => {
    if (!search) return true;
    const text = `${s.en} ${s.de} ${s.ru || ""}`.toLowerCase();
    return text.includes(search);
  });

  cardCountEl.textContent = filtered.length;
  cardListEl.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML =
      "<p class='line-text'>No cards found. / Keine Karten gefunden. / Ничего не найдено.</p>";
    cardListEl.appendChild(empty);
    return;
  }

  filtered
    .slice()
    .sort((a, b) => a.id - b.id)
    .forEach((s) => {
      const card = document.createElement("article");
      card.className = "card";

      const ruBlock = s.ru
        ? `
          <div class="line-label">RU:</div>
          <p class="line-text">${s.ru}</p>
        `
        : "";

      const boxLabel = s.active
        ? `Box ${s.box}`
        : `<span class="box-label finished">Finished (Box 7)</span>`;

      card.innerHTML = `
        <div class="card-header">
          <span>#${s.id}</span>
          <span class="box-label">${boxLabel}</span>
        </div>

        <div class="line-label">EN:</div>
        <p class="line-text">${s.en}</p>
        ${buildTtsButtonsHtml(s.id)}

        <div class="line-label">DE:</div>
        <p class="line-text">${s.de}</p>

        ${ruBlock}
      `;

      cardListEl.appendChild(card);
    });
}

// -------------------------------------------------------------
// Form handling / Formular / Форма
// -------------------------------------------------------------
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const en = enInputEl.value.trim();
  const de = deInputEl.value.trim();
  const ru = ruInputEl.value.trim();

  if (!en || !de) {
    alert(
      "Please fill EN and DE fields. / Bitte EN- und DE-Felder ausfüllen. / Пожалуйста, заполните поля EN и DE."
    );
    return;
  }

  const now = Date.now();
  const newCard = {
    id: now,
    en,
    de,
    ru,
    box: 1,
    active: true,
    createdAt: now,
  };

  archiveCards.push(newCard);
  saveArchive();
  renderCards();

  enInputEl.value = "";
  deInputEl.value = "";
  ruInputEl.value = "";
  enInputEl.focus();
});

clearAllBtn.addEventListener("click", () => {
  const ok = confirm(
    "Delete ALL cards from archive and trainer? / Alle Karten aus Archiv und Trainer löschen? / Удалить ВСЕ карточки из архива и тренажёра?"
  );
  if (!ok) return;
  archiveCards = [];
  saveArchive();
  renderCards();
});

searchInputEl.addEventListener("input", renderCards);

// mode switch
function updateModeFromUI() {
  currentMode = modeDeEnEl.checked ? "de-en" : "en-de";
}
modeEnDeEl.addEventListener("change", updateModeFromUI);
modeDeEnEl.addEventListener("change", updateModeFromUI);

// -------------------------------------------------------------
// Export / Import
// -------------------------------------------------------------
exportJsonBtnEl.addEventListener("click", () => {
  exportAreaEl.value = JSON.stringify(archiveCards, null, 2);
});

exportTsvBtnEl.addEventListener("click", () => {
  const header = ["ID", "Box", "Active", "EN", "DE", "RU", "CreatedAt"].join(
    "\t"
  );
  const lines = archiveCards
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((s) =>
      [
        s.id,
        s.box,
        s.active ? "1" : "0",
        s.en.replace(/\t/g, " "),
        s.de.replace(/\t/g, " "),
        (s.ru || "").replace(/\t/g, " "),
        new Date(s.createdAt).toISOString(),
      ].join("\t")
    );
  exportAreaEl.value = [header, ...lines].join("\n");
});

importBtnEl.addEventListener("click", () => {
  const text = exportAreaEl.value.trim();
  if (!text) {
    alert(
      "No text to import. / Kein Text zum Importieren. / Нет текста для импорта."
    );
    return;
  }
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("JSON is not an array.");
    archiveCards = data.map((it, idx) => ({
      id: typeof it.id === "number" ? it.id : Date.now() + idx,
      en: String(it.en || ""),
      de: String(it.de || ""),
      ru: it.ru ? String(it.ru) : "",
      box: normalizeBox(it.box ?? 1),
      active: it.active === false ? false : true,
      createdAt: it.createdAt || Date.now(),
    }));
    saveArchive();
    renderCards();
    alert(
      "Import successful. / Import erfolgreich. / Импорт успешно выполнен."
    );
  } catch (e) {
    console.error("Import error:", e);
    alert(
      "Import error – please provide valid JSON. / " +
        "Fehler beim Import – bitte gültiges JSON angeben. / " +
        "Ошибка импорта – пожалуйста, вставьте корректный JSON."
    );
  }
});

// -------------------------------------------------------------
// Trainer – queue 7→1 / Тренажёр – очередь 7→1
// -------------------------------------------------------------

/**
 * EN: Build linear queue of active card IDs in order boxes 7→1.
 * DE: Baut lineare Warteschlange aktiver Karten in Reihenfolge 7→1.
 * RU: Строит линейную очередь активных карточек по боксам 7→1.
 */
function buildTrainerQueue() {
  const activeCards = archiveCards.filter((c) => c.active);
  const order = [7, 6, 5, 4, 3, 2, 1];
  const ids = [];

  order.forEach((box) => {
    activeCards
      .filter((c) => c.box === box)
      .sort((a, b) => a.id - b.id)
      .forEach((c) => ids.push(c.id));
  });

  trainerQueue = ids;
  trainerIndex = trainerQueue.length > 0 ? 0 : -1;
}

/**
 * EN: Get current card from queue (skipping inactive or missing).
 * DE: Holt aktuelle Karte aus der Queue (überspringt inaktive/fehlende).
 * RU: Возвращает текущую карточку из очереди (пропуская неактивные).
 */
function getCurrentTrainerCard() {
  if (trainerIndex < 0 || trainerIndex >= trainerQueue.length) return null;
  const id = trainerQueue[trainerIndex];
  const card = archiveCards.find((c) => c.id === id && c.active);
  return card || null;
}

/**
 * EN/DE/RU: Move index with given delta and show next valid card.
 */
function moveTrainerIndex(delta) {
  if (trainerQueue.length === 0) {
    showCardInTrainer(null);
    return;
  }

  let newIndex = trainerIndex + delta;

  if (newIndex < 0) newIndex = 0;
  if (newIndex >= trainerQueue.length) newIndex = trainerQueue.length - 1;

  trainerIndex = newIndex;

  // Skip inactive cards
  let safety = trainerQueue.length + 2;
  while (safety-- > 0) {
    const card = getCurrentTrainerCard();
    if (card) {
      showCardInTrainer(card);
      return;
    }
    trainerIndex += delta >= 0 ? 1 : -1;
    if (trainerIndex < 0 || trainerIndex >= trainerQueue.length) break;
  }

  // Nothing found
  showCardInTrainer(null);
}

/**
 * EN: Show card in trainer window.
 * DE: Zeigt Karte im Trainerfenster.
 * RU: Показывает карточку в окне тренажёра.
 */
function showCardInTrainer(card) {
  if (!card) {
    trainerInfoEl.textContent =
      "No active cards in queue. / Keine aktiven Karten in der Queue. / Нет активных карточек для тренировки.";
    trainerFrontTextEl.textContent = "";
    trainerFrontAudioEl.innerHTML = "";
    trainerBackAreaEl.classList.add("hidden");
    trainerBackTextEl.textContent = "";
    trainerBackAudioEl.innerHTML = "";
    trainerRuAreaEl.textContent = "";
    trainerToggleAnswerBtnEl.disabled = true;
    trainerPrevBtnEl.disabled = true;
    trainerNextBtnEl.disabled = true;
    trainerSkipBtnEl.disabled = true;
    trainerIKnewBtnEl.disabled = true;
    trainerIDidntKnowBtnEl.disabled = true;
    return;
  }

  trainerToggleAnswerBtnEl.disabled = false;
  trainerPrevBtnEl.disabled = false;
  trainerNextBtnEl.disabled = false;
  trainerSkipBtnEl.disabled = false;
  trainerIKnewBtnEl.disabled = false;
  trainerIDidntKnowBtnEl.disabled = false;

  const posInfo = `${trainerIndex + 1} / ${trainerQueue.length}`;
  trainerInfoEl.textContent = `ID ${card.id} · Box ${card.box} · ${posInfo}`;

  // hide back initially
  trainerBackAreaEl.classList.add("hidden");
  trainerToggleAnswerBtnEl.textContent =
    "Show answer / Antwort anzeigen / Показать ответ";

  let frontText,
    backText,
    frontAudioHtml = "",
    backAudioHtml = "";

  if (currentMode === "en-de") {
    frontText = card.en;
    backText = card.de;
    frontAudioHtml = buildTtsButtonsHtml(card.id);
  } else {
    frontText = card.de;
    backText = card.en;
    backAudioHtml = buildTtsButtonsHtml(card.id);
  }

  trainerFrontTextEl.textContent = frontText;
  trainerFrontAudioEl.innerHTML = frontAudioHtml;
  trainerBackTextEl.textContent = backText;
  trainerBackAudioEl.innerHTML = backAudioHtml;

  if (card.ru && card.ru.trim().length > 0) {
    trainerRuAreaEl.textContent = `RU: ${card.ru}`;
  } else {
    trainerRuAreaEl.textContent = "";
  }
}

/**
 * EN: Open trainer (rebuild queue and show first card).
 * DE: Öffnet Trainer (Queue aufbauen, erste Karte zeigen).
 * RU: Открывает тренажёр (строит очередь, показывает первую карточку).
 */
function openTrainer() {
  buildTrainerQueue();
  trainerOverlayEl.classList.remove("hidden");
  const card = getCurrentTrainerCard();
  showCardInTrainer(card);
}

/**
 * EN: Close trainer.
 * DE: Schließt Trainer.
 * RU: Закрывает тренажёр.
 */
function closeTrainer() {
  trainerOverlayEl.classList.add("hidden");
}

// Open/close
openTrainerBtnEl.addEventListener("click", openTrainer);
trainerCloseBtnEl.addEventListener("click", closeTrainer);

// Toggle answer
trainerToggleAnswerBtnEl.addEventListener("click", () => {
  const isHidden = trainerBackAreaEl.classList.toggle("hidden");
  trainerToggleAnswerBtnEl.textContent = isHidden
    ? "Show answer / Antwort anzeigen / Показать ответ"
    : "Hide answer / Antwort verbergen / Скрыть ответ";
});

// Navigation
trainerPrevBtnEl.addEventListener("click", () => moveTrainerIndex(-1));
trainerNextBtnEl.addEventListener("click", () => moveTrainerIndex(1));
trainerSkipBtnEl.addEventListener("click", () => moveTrainerIndex(1));

// Know / don't know
trainerIKnewBtnEl.addEventListener("click", () => {
  const card = getCurrentTrainerCard();
  if (!card) return;

  const idx = archiveCards.findIndex((c) => c.id === card.id);
  if (idx === -1) return;

  if (archiveCards[idx].box >= 7) {
    // finished: remove from active, keep in archive
    archiveCards[idx].active = false;
  } else {
    archiveCards[idx].box = normalizeBox(archiveCards[idx].box + 1);
  }

  saveArchive();
  renderCards();

  moveTrainerIndex(1);
});

trainerIDidntKnowBtnEl.addEventListener("click", () => {
  // stays in same box, just move on
  moveTrainerIndex(1);
});

// -------------------------------------------------------------
// Init
// -------------------------------------------------------------
loadArchive();
loadTheme();
renderCards();
updateModeFromUI();
