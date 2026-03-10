// 2026-02-23 | RU: Pochtinka stabilnosti + 3 rezhima (Daily/Level/Review).
// 2026-02-23 | DE: Stabilisierung + 3 Modi (Daily/Level/Review), minimal-invasiv.
// 2026-02-23 | EN: Stability fixes + 3 modes (Daily/Level/Review), minimal changes.

"use strict";

// ---------- DOM helpers ----------
const $ = (id) => document.getElementById(id);
const on = (el, ev, fn) => {
  if (el) el.addEventListener(ev, fn);
};
const setTxt = (id, txt, titleTxt) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = txt;
  if (titleTxt) el.title = titleTxt;
};
const setBtnLabels = (id, de, en) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<span class="lbl lbl-de">${de}</span><span class="lbl lbl-en">${en}</span>`;
};

const els = {
  modeDaily: $("tabModeDaily"),
  modeLevel: $("tabModeLevel"),
  modeReview: $("tabModeReview"),
  modeHelp: $("modeHelp"),
  levelPanel: $("levelPanel"),
  dailyPanel: $("dailyPanel"),
  reviewPanel: $("reviewPanel"),
  errBanner: $("errBanner"),
  debugBtn: $("btnDebug"),
  debugPanel: $("debugPanel"),
  debugText: $("debugText"),
  pronCheckTool: $("pronomenCheckTool"),
  pronCheckLoadDeck: $("btnPronCheckLoadDeck"),
  pronCheckRun: $("btnPronCheckRun"),
  pronCheckFix: $("btnPronCheckFix"),
  pronCheckInput: $("txtPronCheckInput"),
  pronCheckOutput: $("txtPronCheckOutput"),
  deNormTool: $("deNormTool"),
  deNormPreview: $("btnDeNormPreview"),
  deNormApply: $("btnDeNormApply"),
  deNormBackup: $("btnDeNormBackup"),
  deNormOutput: $("txtDeNormOutput"),

  topic: $("selTopic"),
  level: $("selLevel"),
  tts: $("selTts"),
  starFilter: $("selStarFilter"),
  speed: $("rngSpeed"),
  speedLbl: $("lblSpeed"),
  tempoNormal: $("btnTempoNormal"),
  tempoSlow: $("btnTempoSlow"),
  tempoFast: $("btnTempoFast"),
  deck: $("lblDeck"),
  due: $("lblDue"),
  neu: $("lblNew"),
  today: $("lblToday"),
  week: $("lblWeek"),
  streak: $("lblStreak"),
  starred: $("lblStarred"),
  reviewDue: $("lblReviewDue"),
  msg: $("msg"),

  start: $("btnStart"),
  reviewStart: $("btnReviewStart"),
  boxes: $("btnBoxes"),
  reset: $("btnReset"),
  install: $("btnInstall"),
  bgThumb: $("bgPreviewThumb"),
  bgSelect: $("bgSelect"),
  bgToggle: $("bgToggle"),
  dailyTemplates: $("dailyTemplates"),
  dailySpeak: $("btnDailySpeak"),
  dailyDone: $("btnDailyDone"),
  dailyStatus: $("dailyStatus"),
  reviewSummary: $("reviewSummary"),

  boxPanel: $("boxPanel"),
  boxesGrid: $("boxesGrid"),
  closeBoxes: $("btnCloseBoxes"),
  boxFocusMain: $("lblBoxFocusMain"),
  boxFocusPanel: $("lblBoxFocusPanel"),
  boxFocusReset: $("btnBoxFocusReset"),
  glossaryBtn: $("btnGlossary"),
  glossaryPanel: $("glossaryPanel"),
  closeGlossary: $("btnCloseGlossary"),
  glossarySearch: $("inpGlossarySearch"),
  glossaryType: $("selGlossaryType"),
  glossaryLang: $("selGlossaryLang"),
  glossaryGenus: $("selGlossaryGenus"),
  glossarySort: $("selGlossarySort"),
  glossaryCount: $("lblGlossaryCount"),
  glossaryList: $("glossaryList"),
  glossaryEmpty: $("glossaryEmpty"),
  glossaryPracticeStart: $("btnGlossaryPracticeStart"),
  glossaryPracticeStop: $("btnGlossaryPracticeStop"),
  glossaryPracticeBox: $("glossaryPracticeBox"),
  glossaryPracticeProgress: $("lblGlossaryPracticeProgress"),
  glossaryPracticeFrontLang: $("lblGlossaryPracticeFrontLang"),
  glossaryPracticeBackLang: $("lblGlossaryPracticeBackLang"),
  glossaryPracticeFront: $("txtGlossaryPracticeFront"),
  glossaryPracticeBack: $("txtGlossaryPracticeBack"),
  glossaryPracticeBackWrap: $("glossaryPracticeBack"),
  glossaryPracticeStats: $("lblGlossaryPracticeStats"),
  glossaryPracticeShow: $("btnGlossaryPracticeShow"),
  glossaryPracticeGood: $("btnGlossaryPracticeGood"),
  glossaryPracticeBad: $("btnGlossaryPracticeBad"),
  glossaryPracticeNext: $("btnGlossaryPracticeNext"),
  glossaryPracticeSpeak: $("btnGlossaryPracticeSpeak"),
  glossaryImportWrap: $("glossaryImportWrap"),
  glossaryImportText: $("txtGlossaryImport"),
  glossaryImportBtn: $("btnGlossaryImport"),
  glossaryExportBtn: $("btnGlossaryExport"),
  glossaryImportClearBtn: $("btnGlossaryImportClear"),
  glossaryImportStatus: $("lblGlossaryImportStatus"),

  modal: $("studyOverlay"),
  close: $("btnClose"),
  card: $("card"),
  pillMeta: $("pillMeta"),
  pillBox: $("pillBox"),
  front: $("txtFront"),
  back: $("txtBack"),
  mnemo: $("txtMnemo"),
  flip: $("btnFlip"),
  star: $("btnStar"),
  yes: $("btnYes"),
  no: $("btnNo"),
  forgot: $("btnForgot"),
  next: $("btnNext"),
  speak: $("btnSpeak"),
  mnemoBtn: $("btnMnemo"),
  wordPopup: $("wordPopup"),
  wordPopupClose: $("btnWordPopupClose"),
  wordPopupMeta: $("wordPopupMeta"),
  wordPopupWord: $("wordPopupWord"),
  wordPopupPosTag: $("wordPopupPosTag"),
  wordPopupGenusTag: $("wordPopupGenusTag"),
  wordPopupBestLabel: $("wordPopupBestLabel"),
  wordPopupTranslation: $("wordPopupTranslation"),
  wordPopupContext: $("wordPopupContext"),
  wordPopupAltWrap: $("wordPopupAltWrap"),
  wordPopupAltList: $("wordPopupAltList"),
  wordPopupHint: $("wordPopupHint"),
  wordPopupGenusEditor: $("wordPopupGenusEditor"),
  wordGenusSelect: $("selWordGenus"),
  wordGenusSave: $("btnWordGenusSave"),
  wordQuickSaveWrap: $("wordPopupQuickSave"),
  wordQuickSaveTitle: $("wordPopupQuickSaveTitle"),
  wordQuickTranslation: $("inpWordQuickTranslation"),
  wordQuickMore: $("inpWordQuickMore"),
  wordQuickPos: $("selWordQuickPos"),
  wordQuickGenusField: $("wordPopupQuickGenusField"),
  wordQuickGenus: $("selWordQuickGenus"),
  wordQuickSaveBtn: $("btnWordQuickSave"),
  wordQuickCancelBtn: $("btnWordQuickCancel"),
  wordSpeak: $("btnWordSpeak"),
  wordCorrect: $("btnWordCorrect"),
  wordSavePhrase: $("btnWordSavePhrase"),
  wordAdd: $("btnWordAdd"),
  navBack: $("btnNavBack"),
  navHome: $("btnNavHome"),
  bgPreviewExit: $("bgPreviewExit"),
};

// Basis-Labels DE/EN (robust: nur setzen, wenn Element existiert)
setBtnLabels("btnInstall", "App installieren", "Install app");
setBtnLabels("btnDebug", "Debug", "Debug");
setBtnLabels("btnReset", "Zurücksetzen", "Reset");
setBtnLabels("btnNavBack", "Zurück", "Back");
setBtnLabels("btnNavHome", "Portal", "Portal");
setTxt("tabModeDaily", "Daily 10 / Täglich 10");
setTxt("tabModeLevel", "Level / Stufe");
setTxt("tabModeReview", "Review / Wiederholen");
setTxt("btnStart", "Start / Start");
setTxt("btnBoxes", "Boxen / Boxes");
setTxt("btnBoxFocusReset", "Fokus zurücksetzen / Reset focus");
setTxt("btnGlossary", "Wörterbuch / Glossary");
setTxt("btnReviewStart", "Review starten / Start review");
setTxt("btnCloseBoxes", "Schließen / Close");
setTxt("btnFlip", "Zeigen / Show");
setTxt("btnStar", "⭐ Merken / Star");
setTxt("btnForgot", "Vergessen / Forgotten");
setTxt("btnMnemo", "Memo / Mnemo");
setTxt("btnNo", "Nicht gewusst / Not known");
setTxt("btnYes", "Gewusst / Known");
setTxt("btnNext", "Weiter / Next");
setTxt("btnTempoNormal", "Normal / Normal");
setTxt("btnTempoSlow", "Langsam / Slow");
setTxt("btnTempoFast", "Schnell / Fast");
setTxt("btnDailySpeak", "Sätze vorlesen / Speak lines");
setTxt("btnDailyDone", "Daily fertig / Daily done");
setTxt("btnWordSpeak", "🔊 Wort / Word");
setTxt("btnWordCorrect", "Korrigieren / Correct");
setTxt("btnWordSavePhrase", "Als Phrase speichern / Save phrase");
setTxt("btnWordAdd", "Zum Wörterbuch hinzufügen / Add to dictionary");
setTxt("btnWordGenusSave", "Artikel speichern / Save article");
setTxt("btnCloseGlossary", "Schließen / Close");
setTxt("btnGlossaryPracticeStart", "Üben / Practice");
setTxt("btnGlossaryPracticeStop", "Üben beenden / Stop");
setTxt("btnGlossaryPracticeSpeak", "🔊 Wort / Word");
setTxt("btnGlossaryPracticeShow", "Zeigen / Show");
setTxt("btnGlossaryPracticeBad", "Nicht gewusst / Not known");
setTxt("btnGlossaryPracticeGood", "Gewusst / Known");
setTxt("btnGlossaryPracticeNext", "Weiter / Next");
setTxt("btnPronCheckLoadDeck", "Aus Deck laden / Load deck");
setTxt("btnPronCheckRun", "Prüfen / Check");
setTxt("btnPronCheckFix", "Auto-Korrektur / Auto-fix");
setTxt("btnDeNormPreview", "Preview Normalisierung / Preview");
setTxt("btnDeNormApply", "Normalisierung anwenden / Apply");
setTxt("btnDeNormBackup", "Backup / Export");
{
  const el = document.getElementById("btnClose");
  if (el) el.title = "Schließen / Close";
}
{
  const el = document.getElementById("btnWordPopupClose");
  if (el) el.title = "Schließen / Close";
}

// ---------- config ----------
const STORAGE_KEY = "sprachbox_leitner_v1"; // progress
const MNEMO_KEY = "sprachbox_mnemo_v1"; // mnemo overrides
const TIME_KEY = "sprachbox_time_v1"; // time stats
const SETTINGS_KEY = "sprachbox_settings_v1"; // optional settings persistence
const DAILY_KEY = "sprachbox_daily10_v1"; // daily quick session marker
const BOX_FOCUS_KEY = "SB_BOX_FOCUS_V1"; // selected box focus for level sessions
const DE_TEXT_OVERRIDES_KEY = "SB_DE_TEXT_OVERRIDES_V1"; // id -> normalized de text overrides
const DE_NORM_BACKUP_PREFIX = "SB_BACKUP_DECK_";
const GLOSSARY_KEY = "sprachbox_glossary_v1"; // popup dictionary / glossary
const GLOSSARY_MIN_KEY = "sprachbox_glossary_min_v1"; // mini lexicon (small)
const PHRASE_MAP_KEY = "sprachbox_phrase_map_v1"; // small phrase-first overrides
const BG_LS_ID = "sb_bg_id";
const SOURCE_LANG = "DE";
const TARGET_LANG = "ES";
const SHARED_PAIR_LABEL = `${SOURCE_LANG}->${TARGET_LANG}`;
const SOURCE_TTS_LANG = "de-DE";
const TARGET_TTS_LANG = "es-ES";
const TARGET_TTS_CODE = (TARGET_TTS_LANG || TARGET_LANG || "").toLowerCase().slice(0, 2);

const BOX_COUNT = 8;

// Leitner intervals (days) for Box 1..8
// Box1=0 means: due immediately (but we do NOT re-add to same session queue).
const BOX_DAYS = [0, 1, 3, 7, 14, 30, 60, 120];

// Session new cards limits
const NEW_PER_SESSION = 20; // when you start normal session and nothing due
const NEW_FOR_BOX1 = 20; // when you click Box 1 and nothing due
const REVIEW_LIMIT = 10;
const FETCH_TIMEOUT_MS = 4500;

// Try these paths first (adjust if you like)
const DATA_URLS = [
  "./data/talk_levels_de_en.json",
  "./data/de_en_sample.json",
  "./data/talk_levels.json",
  "../talk_levels/data.json",
  "../talk_levels/talk_levels.json",
  "../talk_levels/assets/data/talk_levels.json",
  "../../data/talk_levels.json",
];
const EXTRA_DATA_URLS = [
  "./data/sentences_a1.json",
];

const PAIR_CODE = "DE_ES";
const BUILD_TAG = "autotts_runtime_20260309_03";
console.log(`[AUTOTTS_RUNTIME_CHECK] PAIR=${PAIR_CODE} FILE=${location.pathname} BUILD=${BUILD_TAG}`);
const LOCAL_BG_BASE = `/pages/language_lab/assets/backgrounds/sprachfuehrer/${PAIR_CODE}`;
const LEGACY_BG_BASE = "/core/assets/backgrounds/sprachfuehrer";
const FALLBACK_WEBP = [
  "bg_00_en-de.webp",
  "bg_01_en-de.webp",
  "bg_02_en-de.webp",
  "bg_03_en-de.webp",
];

const BG_MODE_KEY = "quantura.sprachbox.backgroundMode"; // light | dark | image

let BG_FALLBACK_LEGACY = false;
let BG_OPTIONS = buildBgOptions(LOCAL_BG_BASE);
let BG_DEFAULT_URL = BG_OPTIONS[0]?.url || "";

function buildBgOptions(base) {
  return FALLBACK_WEBP.map((file, idx) => ({
    id: `bg${String(idx + 1).padStart(2, "0")}`,
    label: `BG ${String(idx + 1).padStart(2, "0")}`,
    url: `${base}/${file}`,
  }));
}

function pickUniqueBackgrounds(files) {
  const chosen = new Map();
  for (const f of files || []) {
    const name = String(f || "").trim();
    if (!name) continue;
    const base = name.replace(/\.(webp|png|jpg)$/i, "");
    const preferWebp = /\.webp$/i.test(name);
    if (!chosen.has(base) || preferWebp) chosen.set(base, name);
  }
  return Array.from(chosen.values());
}

async function ensureBgRegistry() {
  try {
    const res = await fetch("/pages/language_lab/shared_data/background_registry.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const entry = Array.isArray(data) ? data.find((x) => x.pairCode === PAIR_CODE) : null;
    if (entry && Array.isArray(entry.backgrounds) && entry.backgrounds.length) {
      const unique = pickUniqueBackgrounds(entry.backgrounds);
      BG_OPTIONS = unique.map((file, idx) => ({
        id: `bg${String(idx + 1).padStart(2, "0")}`,
        label: `BG ${String(idx + 1).padStart(2, "0")}`,
        url: `${entry.backgroundDir}/${file}`,
      }));
      BG_DEFAULT_URL = entry.defaultBackground ? `${entry.backgroundDir}/${entry.defaultBackground}` : BG_OPTIONS[0].url;
      return;
    }
  } catch (e) {
    console.warn("BG registry fallback", e);
  }
  BG_OPTIONS = buildBgOptions(LEGACY_BG_BASE);
  BG_DEFAULT_URL = BG_OPTIONS[0]?.url || "";
  BG_FALLBACK_LEGACY = true;
}

const DAILY_TEMPLATES = [
  { de: "Guten Morgen! Ich lerne heute zehn Minuten Deutsch.", en: "Good morning! I am learning German for ten minutes today." },
  { de: "Ich lese den Satz laut und deutlich.", en: "I read the sentence aloud and clearly." },
  { de: "Heute wiederhole ich nur ein paar wichtige Karten.", en: "Today I review only a few important cards." },
  { de: "Ich verstehe nicht alles, aber ich mache weiter.", en: "I do not understand everything, but I keep going." },
  { de: "Am Ende drücke ich auf Fertig.", en: "At the end I press Done." },
];

function buildDummyDeck() {
  return [
    ["Guten Morgen!", "Good morning!"],
    ["Wie geht es dir?", "How are you?"],
    ["Ich heiße Anna.", "My name is Anna."],
    ["Wo ist der Bahnhof?", "Where is the train station?"],
    ["Ich brauche Hilfe.", "I need help."],
    ["Kannst du das wiederholen?", "Can you repeat that?"],
    ["Ich lerne jeden Tag ein bisschen.", "I study a little every day."],
    ["Was bedeutet dieses Wort?", "What does this word mean?"],
    ["Bitte sprich langsamer.", "Please speak more slowly."],
    ["Danke, bis morgen!", "Thanks, see you tomorrow!"],
  ].map(([de, en], idx) => ({
    id: `dummy-${idx + 1}`,
    de,
    en,
    topic: "Notfall",
    level: "A1",
    stufe: "A1",
    mnemo: "",
  }));
}

// ---------- state ----------
const state = {
  all: [],
  filtered: [],
  topics: [],
  levels: [],
  prog: { meta: {}, stars: {} }, // meta: id -> {box,due}; stars: id -> true
  session: {
    currentId: null,
    queue: [],
    timerStart: 0,
    timerRunning: false,
    kind: "level", // level | review
    stats: null,
    awaitingNext: false,
    gradedCurrent: false,
    side: "front", // front | back (mirrors DOM)
  },
  mnemoMap: {},
  time: {
    byDay: {},
    lastDay: "",
    streak: 0,
  },
  settings: {
    topic: "all",
    level: "all",
    starFilter: "all", // all | starred
    tts: "off", // off | de | en | both
    speed: 0.9,
  },
  ui: {
    mode: "level", // daily | level | review
    uiMode: "normal", // normal | background
    deckReady: false,
    deckSource: "",
    debugOpen: false,
    errorText: "",
    swState: "unbekannt",
    loaderStatus: "idle",
    loaderTried: [],
  },
  daily: {
    lastDoneDay: "",
    count: 0,
  },
  boxFocus: [], // [] => all, otherwise [1..BOX_COUNT]
  deckOverrides: {
    deById: {},
  },
  debug: {
    lines: [],
  },
  glossary: {
    items: {},
    ui: {
      search: "",
      type: "all", // all | noun
      lang: "all", // all | de | en
      genus: "all", // all | m | f | n | unknown
      sort: "newest", // newest | oldest | alpha
    },
    practice: {
      active: false,
      queue: [],
      idx: 0,
      reveal: false,
      awaitingNext: false,
      stats: { right: 0, wrong: 0 },
    },
  },
  lookup: {
    mini: {}, // `${lang}:${term}` -> {term, lang, best_guess, alts, pos, seenCount}
    phraseMap: {}, // `${lang}:${phrase}` -> translation
  },
};

const wordIndex = {
  deToEn: new Map(),
  enToDe: new Map(),
};
const wordMetaIndex = {
  de: new Map(), // key -> { pos, genus, article, lemma }
};
let wordLookupTimer = 0;
let lastWordPopupSig = "";
let lastWordPopupAt = 0;
let lastWordPopupAnchor = null;
let currentWordPopupResult = null;
let wordQuickFormForced = false;

const PRONOMEN_PARADIGMS = {
  sein: { ich: "bin", du: "bist", er: "ist", es: "ist", man: "ist", wir: "sind", ihr: "seid", Sie: "sind" },
  haben: { ich: "habe", du: "hast", er: "hat", es: "hat", man: "hat", wir: "haben", ihr: "habt", Sie: "haben" },
  werden: { ich: "werde", du: "wirst", er: "wird", es: "wird", man: "wird", wir: "werden", ihr: "werdet", Sie: "werden" },
  koennen: { ich: "kann", du: "kannst", er: "kann", es: "kann", man: "kann", wir: "können", ihr: "könnt", Sie: "können" },
  muessen: { ich: "muss", du: "musst", er: "muss", es: "muss", man: "muss", wir: "müssen", ihr: "müsst", Sie: "müssen" },
  wollen: { ich: "will", du: "willst", er: "will", es: "will", man: "will", wir: "wollen", ihr: "wollt", Sie: "wollen" },
  sollen: { ich: "soll", du: "sollst", er: "soll", es: "soll", man: "soll", wir: "sollen", ihr: "sollt", Sie: "sollen" },
  duerfen: { ich: "darf", du: "darfst", er: "darf", es: "darf", man: "darf", wir: "dürfen", ihr: "dürft", Sie: "dürfen" },
  moegen: { ich: "mag", du: "magst", er: "mag", es: "mag", man: "mag", wir: "mögen", ihr: "mögt", Sie: "mögen" },
};

// ---------- utils ----------
function now() {
  return Date.now();
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function uniq(arr) {
  return Array.from(new Set(arr));
}
function fmt(n) {
  return (n ?? 0).toString();
}
function isStarredCard(id) {
  const k = String(id || "").trim();
  return !!(k && state.prog?.stars && state.prog.stars[k]);
}
function starredCount(items) {
  let c = 0;
  for (const it of items || []) {
    if (it?.id && isStarredCard(it.id)) c += 1;
  }
  return c;
}
function toggleStarForCard(id) {
  const k = String(id || "").trim();
  if (!k) return false;
  if (!state.prog.stars || typeof state.prog.stars !== "object") state.prog.stars = {};
  if (state.prog.stars[k]) delete state.prog.stars[k];
  else state.prog.stars[k] = true;
  saveProgress();
  updateStarButton();
  applyFilter();
  return !!state.prog.stars[k];
}
function updateStarButton() {
  if (!els.star) return;
  const id = state.session.currentId;
  const onStar = !!(id && isStarredCard(id));
  els.star.classList.toggle("isActive", onStar);
  els.star.textContent = onStar ? "⭐ Gemerkt / Starred" : "⭐ Merken / Star";
}
function setBackgroundFocusMode(on) {
  const next = !!on;
  state.ui.uiMode = next ? "background" : "normal";
  document.body.classList.toggle("mode-bg", next);
  if (els.bgThumb) els.bgThumb.classList.toggle("show", next);
  if (els.bgThumb) els.bgThumb.setAttribute("aria-hidden", next ? "false" : "true");
  if (next) hideWordPopup();
}
function toggleBackgroundFocusMode() {
  setBackgroundFocusMode(state.ui.uiMode !== "background");
}

function setBgMode(mode, { persist = true } = {}) {
  const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  const m = mode === "light" ? "light" : mode === "image" ? "image" : "dark";
  document.body.dataset.bgMode = m;
  if (m === "light" || m === "dark") {
    document.documentElement.dataset.theme = m;
  } else {
    document.documentElement.dataset.theme = currentTheme;
  }
  if (m !== "image") {
    document.body.classList.remove("is-bg-preview");
    document.body.classList.remove("is-bg-hidden");
  }
  if (persist) {
    try { localStorage.setItem(BG_MODE_KEY, m); } catch (_) {}
  }
}

function initBgMode() {
  let saved = null;
  try { saved = localStorage.getItem(BG_MODE_KEY); } catch (_) { /* ignore */ }
  if (saved !== "light" && saved !== "dark" && saved !== "image") saved = "dark";
  setBgMode(saved, { persist: false });

  // Wenn Theme über den globalen Header umgeschaltet wird, Hintergrundbild-Modus
  // automatisch auf klaren Light/Dark setzen (kein Bild).
  document.addEventListener("quantura:theme-changed", (evt) => {
    const mode = evt?.detail?.theme === "light" ? "light" : "dark";
    setBgMode(mode);
  });
}

function getBgChoice(id) {
  return BG_OPTIONS.find((x) => x.id === id) || BG_OPTIONS[0];
}

function applyBgChoice(id) {
  const choice = getBgChoice(id);
  const url = choice?.url || BG_DEFAULT_URL;
  if (!url) return;
  document.documentElement.style.setProperty("--sb-bg", `url("${url}")`);
  localStorage.setItem(BG_LS_ID, choice.id);
  if (els.bgSelect) els.bgSelect.value = choice.id;
  setBgMode("image");
}

function updateBgToggleLabel(previewOn) {
  if (!els.bgToggle) return;
  if (previewOn) setBtnLabels("bgToggle", "UI einblenden", "Show UI");
  else setBtnLabels("bgToggle", "Hintergrund anzeigen", "Show background");
}

function loadBgPrefs() {
  const savedId = localStorage.getItem(BG_LS_ID) || (BG_OPTIONS[0]?.id || "bg01");
  applyBgChoice(savedId);
  document.body.classList.remove("is-bg-preview", "is-bg-hidden");
  updateBgToggleLabel(false);
}
function normalizeBoxFocusList(input) {
  const arr = Array.isArray(input) ? input : (input == null ? [] : [input]);
  const out = [];
  for (const v of arr) {
    const raw = Number(v);
    if (!Number.isFinite(raw)) continue;
    const floored = Math.floor(raw);
    if (floored < 1 || floored > BOX_COUNT) continue;
    const n = clamp(floored, 1, BOX_COUNT);
    if (!out.includes(n)) out.push(n);
  }
  out.sort((a, b) => a - b);
  return out;
}
function hasBoxFocus() {
  return Array.isArray(state.boxFocus) && state.boxFocus.length > 0;
}
function boxFocusLabelCompact() {
  const list = normalizeBoxFocusList(state.boxFocus);
  if (!list.length) return "Alle";
  if (list.length === 1) return `Box ${list[0]}`;
  return `Box ${list.join(",")}`;
}
function boxFocusLabelDetailed() {
  const list = normalizeBoxFocusList(state.boxFocus);
  if (!list.length) return "Alle";
  return list.join(", ");
}
function saveBoxFocus() {
  try {
    const norm = normalizeBoxFocusList(state.boxFocus);
    if (!norm.length) {
      localStorage.removeItem(BOX_FOCUS_KEY);
      return;
    }
    localStorage.setItem(BOX_FOCUS_KEY, JSON.stringify(norm));
  } catch (_) {}
}
function loadBoxFocus() {
  try {
    const raw = localStorage.getItem(BOX_FOCUS_KEY);
    if (!raw) return;
    const val = JSON.parse(raw);
    state.boxFocus = normalizeBoxFocusList(val);
  } catch (_) {}
}
function updateStartButtonLabel() {
  if (!els.start) return;
  const compact = boxFocusLabelCompact();
  els.start.textContent = `Start (${compact})`;
  els.start.title = hasBoxFocus()
    ? `Session nur aus Fokus-Box(en): ${boxFocusLabelDetailed()}`
    : "Session aus allen Boxen";
  if (els.boxFocusMain) {
    els.boxFocusMain.textContent = `Start-Fokus: ${hasBoxFocus() ? boxFocusLabelDetailed() : "Alle"}`;
  }
}
function updateBoxFocusUi() {
  const txt = `Box-Fokus: ${hasBoxFocus() ? boxFocusLabelDetailed() : "Alle"}`;
  if (els.boxFocusPanel) els.boxFocusPanel.textContent = txt;
  if (els.boxFocusReset) els.boxFocusReset.disabled = !hasBoxFocus();
  updateStartButtonLabel();
}
function setBoxFocus(boxes) {
  state.boxFocus = normalizeBoxFocusList(boxes);
  saveBoxFocus();
  updateBoxFocusUi();
  renderBoxes();
  updateButtonsEnabled();
}
function toggleBoxFocus(box) {
  const n = clamp(Number(box) || 1, 1, BOX_COUNT);
  const cur = normalizeBoxFocusList(state.boxFocus);
  const idx = cur.indexOf(n);
  if (idx >= 0) cur.splice(idx, 1);
  else cur.push(n);
  setBoxFocus(cur);
}
function pad2(n) {
  return String(n).padStart(2, "0");
}

function dayKey(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function dayKeyOffset(days, ts = Date.now()) {
  const d = new Date(ts);
  d.setDate(d.getDate() + days);
  return dayKey(d.getTime());
}

function showStatus(text, sticky = false) {
  const el =
    document.getElementById("msg") ||
    document.getElementById("lblData") ||
    document.querySelector(".status") ||
    document.querySelector("[data-role='status']");
  if (!el) return;
  el.textContent = String(text || "");
  el.hidden = false;
  el.classList.remove("statusFade");
  clearTimeout(showStatus._t);
  clearTimeout(showStatus._t2);
  if (sticky) return;
  showStatus._t = setTimeout(() => {
    el.classList.add("statusFade");
    showStatus._t2 = setTimeout(() => {
      el.hidden = true;
      el.classList.remove("statusFade");
    }, 400);
  }, 1800);
}

function info(text) {
  showStatus(text, !!state?.ui?.debugOpen);
}

function setError(text) {
  state.ui.errorText = String(text || "").trim();
  if (!els.errBanner) return;
  els.errBanner.hidden = !state.ui.errorText;
  els.errBanner.textContent = state.ui.errorText;
  updateDebugPanel();
}

function clearError() {
  setError("");
}

function debugLog(text) {
  const line = `${new Date().toLocaleTimeString("de-DE")} | ${text}`;
  state.debug.lines.push(line);
  if (state.debug.lines.length > 12) state.debug.lines.shift();
  updateDebugPanel();
}

function updateButtonsEnabled() {
  const ready = !!state.ui.deckReady;
  if (els.start) els.start.disabled = !ready;
  if (els.boxes) els.boxes.disabled = !ready;
  if (els.reviewStart) els.reviewStart.disabled = !ready;
  updateStartButtonLabel();
}

function updateModeHelp() {
  if (!els.modeHelp) return;
  const textByMode = {
    daily:
      "Daily 10 / Täglich 10: 5 Minuten laut sprechen, 5 Minuten lesen/hören.",
    level:
      "Level / Stufe: Filter wählen und Leitner-Session starten.",
    review:
      "Review / Wiederholen: nur fällige Karten (bis zu 10).",
  };
  els.modeHelp.textContent = textByMode[state.ui.mode] || textByMode.level;
}

function setMode(nextMode) {
  const mode = ["daily", "level", "review"].includes(nextMode)
    ? nextMode
    : "level";
  state.ui.mode = mode;

  if (els.dailyPanel) els.dailyPanel.hidden = mode !== "daily";
  if (els.levelPanel) els.levelPanel.hidden = mode !== "level";
  if (els.reviewPanel) els.reviewPanel.hidden = mode !== "review";

  const tabs = [els.modeDaily, els.modeLevel, els.modeReview];
  for (const tab of tabs) {
    if (!tab) continue;
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  }

  updateStartButtonLabel();
  updateModeHelp();
  updateDebugPanel();
}

function updateReviewSummary(text) {
  if (els.reviewSummary) {
    els.reviewSummary.textContent =
      text || "Noch keine Review-Session in dieser Sitzung.";
  }
}

function renderDailyTemplates() {
  if (!els.dailyTemplates) return;
  els.dailyTemplates.innerHTML = "";
  for (const t of DAILY_TEMPLATES) {
    const li = document.createElement("li");
    li.innerHTML = `<b>${t.de}</b><br><span class="mini">${t.en}</span>`;
    els.dailyTemplates.appendChild(li);
  }
}

function loadDailyStatus() {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return;
    state.daily.lastDoneDay =
      typeof obj.lastDoneDay === "string" ? obj.lastDoneDay : "";
    state.daily.count = Number.isFinite(obj.count) ? Math.max(0, obj.count) : 0;
  } catch (_) {}
}

function saveDailyStatus() {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(state.daily));
  } catch (_) {}
}

function updateDailyStatus() {
  if (!els.dailyStatus) return;
  const today = dayKey();
  const doneToday = state.daily.lastDoneDay === today;
  els.dailyStatus.textContent = doneToday
    ? `Heute erledigt (${today}). Gesamt: ${fmt(state.daily.count)}`
    : "Noch nicht erledigt heute.";
}

function markDailyDone() {
  const today = dayKey();
  const alreadyDone = state.daily.lastDoneDay === today;
  if (state.daily.lastDoneDay !== today) {
    state.daily.lastDoneDay = today;
    state.daily.count = (Number(state.daily.count) || 0) + 1;
    saveDailyStatus();
  }
  if (!alreadyDone) {
    recordLearningSeconds(10 * 60);
  }
  updateDailyStatus();
  info(alreadyDone ? "Daily 10 war heute schon erledigt." : "Daily 10 erledigt ✅");
  debugLog(alreadyDone ? "daily.done duplicate" : "daily.done");
}

function speakDailyTemplates() {
  if (!DAILY_TEMPLATES.length) return;
  const text = DAILY_TEMPLATES.map((t) => t.de).join(" ");
  speak(text, SOURCE_TTS_LANG);
}

function updateDebugPanel() {
  if (!els.debugPanel || !els.debugText) return;
  els.debugPanel.hidden = !state.ui.debugOpen;
  if (!state.ui.debugOpen) return;

  const due = dueNowCount(state.filtered || []);
  const neu = newCount(state.filtered || []);
  const payload = [
    `mode=${state.ui.mode}`,
    `deckLoaded=${state.ui.deckReady}`,
    `deckSource=${state.ui.deckSource || "-"}`,
    `deckAll=${state.all.length}`,
    `filtered=${state.filtered.length}`,
    `due=${due} new=${neu}`,
    `loader=${state.ui.loaderStatus}`,
    `loaderTried=${(state.ui.loaderTried || []).join(" | ") || "-"}`,
    `swState=${state.ui.swState}`,
    `error=${state.ui.errorText || "-"}`,
    "",
    ...state.debug.lines,
  ];
  els.debugText.textContent = payload.join("\n");
}

function buildPronomenFormIndex() {
  const idx = new Map(); // normalized form -> [{lemma, pron, expected}]
  for (const [lemma, table] of Object.entries(PRONOMEN_PARADIGMS)) {
    for (const [pron, form] of Object.entries(table)) {
      const key = lookupKey(form);
      if (!key) continue;
      const arr = idx.get(key) || [];
      arr.push({ lemma, pron, expected: form });
      idx.set(key, arr);
    }
  }
  return idx;
}
const PRONOMEN_FORM_INDEX = buildPronomenFormIndex();
const PRONOMEN_TARGETS = new Set(["ich", "du", "er", "es", "wir", "ihr", "man", "sie"]);

function pronomenExpectedFormsFor(pronRaw, observedRaw) {
  const pron = String(pronRaw || "").trim();
  const observedNorm = lookupKey(observedRaw);
  if (!pron || !observedNorm) return [];
  const pronKey = pron === "Sie" ? "Sie" : pron.toLowerCase();
  const observedEntries = PRONOMEN_FORM_INDEX.get(observedNorm) || [];
  const out = [];
  for (const entry of observedEntries) {
    const table = PRONOMEN_PARADIGMS[entry.lemma];
    if (!table) continue;
    const expected = table[pronKey];
    if (!expected) continue;
    if (lookupKey(expected) === observedNorm) continue; // already correct for this pronoun
    out.push({ lemma: entry.lemma, expected });
  }
  const seen = new Set();
  return out.filter((x) => {
    const k = `${x.lemma}:${lookupKey(x.expected)}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function analyzePronomenText(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const findings = [];
  const lineOut = [];
  for (let li = 0; li < lines.length; li += 1) {
    const line = lines[li];
    let m;
    const re = /\b(Ich|ich|Du|du|Er|er|Es|es|Wir|wir|Ihr|ihr|Man|man|Sie|sie)\s+([A-Za-zÄÖÜäöüß]+)\b/g;
    while ((m = re.exec(line))) {
      const pron = m[1];
      const pronLower = pron.toLowerCase();
      if (pron !== "Sie" && !PRONOMEN_TARGETS.has(pronLower)) continue;
      if (pronLower === "sie" && pron !== "Sie") continue; // ambiguous singular/plural, skip for conservative mode
      const verb = m[2];
      const suggestions = pronomenExpectedFormsFor(pron, verb);
      if (!suggestions.length) continue;
      findings.push({
        lineNo: li + 1,
        line,
        pron,
        verb,
        suggestions,
        start: m.index + line.slice(m.index).indexOf(verb),
      });
    }
  }
  if (!findings.length) {
    return { findings: [], report: "Keine auffälligen Pronomen-Verbformen gefunden (konservativer Check)." };
  }
  for (const f of findings.slice(0, 200)) {
    const sug = uniq(f.suggestions.map((s) => `${s.expected} (${s.lemma})`)).join(" | ");
    lineOut.push(`Zeile ${f.lineNo}: "${f.pron} ${f.verb}" -> Vorschlag: ${sug}`);
    lineOut.push(`  ${f.line}`);
  }
  return { findings, report: lineOut.join("\n") };
}

function autoFixPronomenText(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  let changes = 0;
  const out = lines.map((line) => line.replace(
    /\b(Ich|ich|Du|du|Er|er|Es|es|Wir|wir|Ihr|ihr|Man|man|Sie)\s+([A-Za-zÄÖÜäöüß]+)\b/g,
    (full, pron, verb) => {
      const suggestions = pronomenExpectedFormsFor(pron, verb);
      const unique = uniq(suggestions.map((s) => s.expected));
      if (unique.length !== 1) return full;
      changes += 1;
      return `${pron} ${unique[0]}`;
    },
  ));
  return { text: out.join("\n"), changes };
}

function setPronCheckOutput(text) {
  if (!els.pronCheckOutput) return;
  els.pronCheckOutput.textContent = String(text || "").trim() || "—";
}

function loadPronCheckFromFilteredDeck() {
  const rows = (state.filtered || [])
    .filter((it) => isUsableCard(it))
    .map((it) => String(it.de || "").trim())
    .filter(Boolean);
  if (els.pronCheckInput) els.pronCheckInput.value = rows.join("\n");
  setPronCheckOutput(`Deck geladen: ${rows.length} DE-Zeilen. Jetzt "Prüfen" klicken.`);
}

function runPronomenCheck() {
  const text = els.pronCheckInput ? els.pronCheckInput.value : "";
  const result = analyzePronomenText(text);
  setPronCheckOutput(result.report);
  info(result.findings.length ? `Pronomen-Check: ${result.findings.length} Treffer` : "Pronomen-Check: keine Treffer");
}

function runPronomenAutoFix() {
  const text = els.pronCheckInput ? els.pronCheckInput.value : "";
  const result = autoFixPronomenText(text);
  if (els.pronCheckInput) els.pronCheckInput.value = result.text;
  setPronCheckOutput(`Auto-Korrektur abgeschlossen: ${result.changes} Änderung(en). Danach bitte erneut prüfen.`);
  info(`Pronomen-Auto-Korrektur: ${result.changes} Änderung(en).`);
}

function loadDeckTextOverrides() {
  try {
    const raw = localStorage.getItem(DE_TEXT_OVERRIDES_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    const deById = obj && typeof obj === "object" && obj.deById && typeof obj.deById === "object"
      ? obj.deById
      : (obj && typeof obj === "object" ? obj : {});
    state.deckOverrides.deById = {};
    for (const [id, text] of Object.entries(deById || {})) {
      const k = String(id || "").trim();
      const v = String(text || "").trim();
      if (!k || !v) continue;
      state.deckOverrides.deById[k] = v;
    }
  } catch (_) {}
}

function saveDeckTextOverrides() {
  try {
    localStorage.setItem(DE_TEXT_OVERRIDES_KEY, JSON.stringify({ deById: state.deckOverrides.deById || {} }));
  } catch (_) {}
}

function applyDeckTextOverrides(items) {
  const map = state.deckOverrides?.deById || {};
  if (!items || !Array.isArray(items)) return items || [];
  if (!map || typeof map !== "object") return items;
  return items.map((it) => {
    if (!it || !it.id) return it;
    const over = String(map[it.id] || "").trim();
    if (!over) return it;
    return { ...it, de: over };
  });
}

function setDeNormOutput(text) {
  if (!els.deNormOutput) return;
  els.deNormOutput.textContent = String(text || "").trim() || "—";
}

function fixMojibakeGerman(text) {
  let s = String(text || "");
  if (!s) return s;
  const pairs = [
    ["Ã¤", "ä"], ["Ã¶", "ö"], ["Ã¼", "ü"], ["Ã„", "Ä"], ["Ã–", "Ö"], ["Ãœ", "Ü"], ["ÃŸ", "ß"],
    ["â", "–"], ["â", "—"], ["â", "’"], ["â", "„"], ["â", "“"], ["â¦", "…"],
    ["Â ", " "], ["Â", ""],
  ];
  let prev = "";
  let guard = 0;
  while (s !== prev && guard < 4) {
    prev = s;
    for (const [a, b] of pairs) s = s.split(a).join(b);
    guard += 1;
  }
  return s;
}

function fixGermanTransliteration(text) {
  let s = String(text || "");
  if (!s) return s;
  const prevIsVowel = (p) => /[aeiouyäöüAEIOUYÄÖÜ]/.test(p || "");
  const prevIsQ = (p) => /[qQ]/.test(p || "");
  s = s.replace(/ae|Ae|oe|Oe|ue|Ue/g, (seq, offset, whole) => {
    const prev = offset > 0 ? whole[offset - 1] : "";
    if (prev && prevIsVowel(prev)) return seq;
    if ((seq === "ue" || seq === "Ue") && prev && prevIsQ(prev)) return seq;
    if (seq === "ae") return "ä";
    if (seq === "Ae") return "Ä";
    if (seq === "oe") return "ö";
    if (seq === "Oe") return "Ö";
    if (seq === "ue") return "ü";
    if (seq === "Ue") return "Ü";
    return seq;
  });
  return s;
}

function fixGermanSharpSWhitelist(text) {
  let s = String(text || "");
  if (!s) return s;
  // conservative replacements for common Swiss-style spellings / compounds
  const reps = [
    [/\bStrasse/gu, "Straße"],
    [/\bstrasse/gu, "straße"],
    [/\bStrassen/gu, "Straßen"],
    [/\bstrassen/gu, "straßen"],
    [/\bFuss/gu, "Fuß"],
    [/\bfuss/gu, "fuß"],
    [/\bGross/gu, "Groß"],
    [/\bgross/gu, "groß"],
    [/\bHeiss/gu, "Heiß"],
    [/\bheiss/gu, "heiß"],
    [/\bWeiss/gu, "Weiß"],
    [/\bweiss/gu, "weiß"],
    [/\bGruss/gu, "Gruß"],
    [/\bgruss/gu, "gruß"],
    [/\bGruesse/gu, "Grüße"],
    [/\bgruesse/gu, "grüße"],
    [/\bGrusse/gu, "Grüße"],
    [/\bgrusse/gu, "grüße"],
  ];
  for (const [re, repl] of reps) s = s.replace(re, repl);
  return s;
}

function normalizeGermanText(text) {
  const input = String(text || "");
  if (!input) return input;
  let s = input;
  s = fixMojibakeGerman(s);
  s = fixGermanTransliteration(s);
  s = fixGermanSharpSWhitelist(s);
  return s;
}

function previewGermanNormalizationChanges() {
  const examples = [];
  let deckChanges = 0;
  let glossaryChanges = 0;
  for (const it of state.all || []) {
    if (!it || !it.id) continue;
    const before = String(it.de || "");
    const after = normalizeGermanText(before);
    if (after !== before) {
      deckChanges += 1;
      if (examples.length < 20) examples.push(`Deck ${it.id}\n- ${before}\n+ ${after}`);
    }
  }
  for (const entry of getGlossaryEntries()) {
    if (!entry) continue;
    const patches = [];
    if (entry.detectedLang === "de") {
      const termAfter = normalizeGermanText(entry.termOriginal || "");
      if (termAfter && termAfter !== String(entry.termOriginal || "")) patches.push(`term: ${entry.termOriginal} -> ${termAfter}`);
      const lemmaAfter = normalizeGermanText(entry.lemma || "");
      if (lemmaAfter && lemmaAfter !== String(entry.lemma || "")) patches.push(`lemma: ${entry.lemma} -> ${lemmaAfter}`);
    } else {
      const transAfter = normalizeGermanText(entry.translation || "");
      if (transAfter && transAfter !== String(entry.translation || "")) patches.push(`translation: ${entry.translation} -> ${transAfter}`);
      const moreAfter = normalizeGermanText(entry.more || "");
      if (moreAfter && moreAfter !== String(entry.more || "")) patches.push(`more: ${entry.more} -> ${moreAfter}`);
    }
    if (patches.length) {
      glossaryChanges += patches.length;
      if (examples.length < 20) examples.push(`Glossar ${entry.key}\n- ${patches.join("\n- ")}`);
    }
  }
  return { deckChanges, glossaryChanges, examples };
}

function createGermanNormalizationBackup() {
  const ts = Date.now();
  const key = `${DE_NORM_BACKUP_PREFIX}${ts}`;
  const deckDeById = {};
  for (const it of state.all || []) {
    if (!it?.id) continue;
    deckDeById[it.id] = String(it.de || "");
  }
  const payload = {
    ts,
    deckDeById,
    deckOverrides: { ...(state.deckOverrides?.deById || {}) },
    glossaryItems: state.glossary?.items || {},
  };
  try {
    localStorage.setItem(key, JSON.stringify(payload));
    return key;
  } catch (e) {
    return `Fehler: ${e?.message || e}`;
  }
}

function previewGermanNormalization() {
  const p = previewGermanNormalizationChanges();
  const header = [
    `Preview DE-Normalisierung`,
    `Deck-Felder (DE): ${p.deckChanges}`,
    `Glossar-Felder (DE-relevant): ${p.glossaryChanges}`,
    "",
  ];
  if (!p.deckChanges && !p.glossaryChanges) {
    setDeNormOutput(`${header.join("\n")}Keine Änderungen nötig.`);
    info("DE-Normalisierung: keine Änderungen nötig.");
    return;
  }
  setDeNormOutput(`${header.join("\n")}${p.examples.join("\n\n")}`);
  info(`DE-Normalisierung Preview: ${p.deckChanges + p.glossaryChanges} Änderung(en) gefunden.`);
}

function applyGermanNormalization() {
  const preview = previewGermanNormalizationChanges();
  if (!preview.deckChanges && !preview.glossaryChanges) {
    setDeNormOutput("Keine Änderungen nötig.");
    info("DE-Normalisierung: keine Änderungen nötig.");
    return;
  }
  const backupKey = createGermanNormalizationBackup();

  let deckUpdated = 0;
  for (const it of state.all || []) {
    if (!it?.id) continue;
    const after = normalizeGermanText(it.de || "");
    if (after !== String(it.de || "")) {
      it.de = after;
      state.deckOverrides.deById[it.id] = after;
      deckUpdated += 1;
    }
  }
  saveDeckTextOverrides();

  let glossaryUpdated = 0;
  const nextGlossaryItems = {};
  for (const entry of getGlossaryEntries()) {
    if (!entry) continue;
    const work = { ...entry };
    if (work.detectedLang === "de") {
      const nextTerm = normalizeGermanText(work.termOriginal || "");
      const nextLemma = normalizeGermanText(work.lemma || work.termOriginal || "");
      if (nextTerm && nextTerm !== String(work.termOriginal || "")) {
        work.termOriginal = nextTerm;
        work.termNormalized = lookupKey(nextTerm);
        glossaryUpdated += 1;
      }
      if (nextLemma && nextLemma !== String(work.lemma || "")) {
        work.lemma = sanitizeLookupWord(nextLemma) || nextLemma;
        glossaryUpdated += 1;
      }
    } else {
      const nextTrans = normalizeGermanText(work.translation || "");
      const nextMore = normalizeGermanText(work.more || "");
      if (nextTrans !== String(work.translation || "")) {
        work.translation = nextTrans;
        glossaryUpdated += 1;
      }
      if (nextMore !== String(work.more || "")) {
        work.more = normalizeGlossaryMore(nextMore);
        glossaryUpdated += 1;
      }
    }
    const normalized = normalizeGlossaryEntry(work);
    if (normalized) nextGlossaryItems[normalized.key] = normalized;
  }
  state.glossary.items = nextGlossaryItems;
  saveGlossary();

  rebuildWordIndex(state.all);
  applyFilter();
  if (currentWordPopupResult) {
    const refreshed = lookupWordTranslation(
      currentWordPopupResult.original,
      currentWordPopupResult.sourceLang,
      currentWordPopupResult.context || null,
    );
    if (refreshed) showWordPopup(refreshed, lastWordPopupAnchor);
  }
  renderGlossaryPanel();

  setDeNormOutput(
    `Normalisierung angewendet.\nBackup: ${backupKey}\nDeck-Felder aktualisiert: ${deckUpdated}\nGlossar-Felder aktualisiert: ${glossaryUpdated}`,
  );
  info(`DE-Normalisierung angewendet: ${deckUpdated + glossaryUpdated} Felder aktualisiert.`);
}

function createGermanNormalizationBackupOnly() {
  const key = createGermanNormalizationBackup();
  setDeNormOutput(`Backup erstellt: ${key}`);
  info(`Backup erstellt: ${key}`);
}

function isJunkText(s) {
  const t = (s || "").trim();
  if (t.length < 2) return true;
  return /^[\s•\.\-–—_…·,;:!?\(\)\[\]"']+$/.test(t);
}
function isUsableCard(it) {
  if (!it || typeof it !== "object") return false;
  if (!it.id) return false;
  if (isJunkText(it.de) || isJunkText(it.en)) return false;
  return true;
}

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v != null && String(v).trim() !== "") return v;
    }
  }
  return "";
}

// Small deterministic hash (for shorter IDs if you want later)
function strHash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function normalizeItem(raw, idx) {
  // Accept many possible key names (so you can reuse old JSON)
  const de = String(
    pick(raw, [
      "de",
      "DE",
      "deu",
      "Deutsch",
      "german",
      "de_text",
      "text_de",
      "src",
      "front",
    ]) || "",
  ).trim();
  const en = String(
    pick(raw, [
      "en",
      "EN",
      "eng",
      "English",
      "english",
      "en_text",
      "text_en",
      "dst",
      "back",
    ]) || "",
  ).trim();
  if (isJunkText(de) || isJunkText(en))
    return { id: "", de: "", en: "", topic: "", level: "", stufe: "", mnemo: "" };

  const topic =
    String(
      pick(raw, ["topic", "thema", "Theme", "Kategorie", "category"]) || "all",
    ).trim() || "all";
  const stufeRaw = pick(raw, ["stufe", "Stufe", "level", "Level", "lvl", "cefr", "CEFR"]);
  const stufe =
    String(stufeRaw || "A1").trim() || "A1";
  const mnemo = String(
    pick(raw, [
      "mnemo",
      "mnemonic",
      "hint",
      "note",
      "merk",
      "merksatz",
      "memo",
      "mnemoHint",
      "mnemoKey",
    ]) || "",
  ).trim();

  // Stable ID: prefer provided id/key, else derive
  const givenId = String(pick(raw, ["id", "ID", "key"]) || "").trim();
  const derived = `${topic}::${stufe}::${de}::${en}`;
  const id = givenId || `${strHash(derived)}::${idx}`;

  // keep `level` as alias for backward-compatible code paths / old decks
  return { id, de, en, topic, stufe, level: stufe, mnemo };
}

// Better shuffle than sort(Math.random()-0.5)
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- word lookup / popup ----------
function sanitizeLookupWord(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  s = s.replace(/[\u2018\u2019]/g, "'");
  s = s.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  if (!s) return "";
  if (/\s/u.test(s)) return "";
  return s;
}

function lookupKey(raw) {
  const clean = sanitizeLookupWord(raw);
  return clean ? clean.toLowerCase() : "";
}

function splitWords(text) {
  return String(text || "")
    .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
}

function genusToArticle(genus) {
  if (genus === "m") return "der";
  if (genus === "f") return "die";
  if (genus === "n") return "das";
  return "";
}

function articleToGenus(article) {
  const a = String(article || "").trim().toLowerCase();
  if (a === "der") return "m";
  if (a === "die") return "f";
  if (a === "das") return "n";
  return "";
}

function genusClass(genus) {
  if (genus === "m") return "genusM";
  if (genus === "f") return "genusF";
  if (genus === "n") return "genusN";
  return "";
}

function parseGermanNounWithArticle(text) {
  const s = String(text || "").trim();
  const m = s.match(/^(der|die|das)\s+([\p{L}\p{N}][\p{L}\p{N}'’-]*)$/iu);
  if (!m) return null;
  const article = m[1].toLowerCase();
  const word = sanitizeLookupWord(m[2]);
  if (!word) return null;
  const genus = articleToGenus(article);
  if (!genus) return null;
  return { article, genus, word, pos: "noun", lemma: word };
}

function getGlossaryEntries() {
  return Object.values(state.glossary?.items || {}).filter(Boolean);
}

function glossaryEntryKey(termOriginal, detectedLang) {
  const lang = detectedLang === "en" ? "en" : "de";
  return `${lang}:${lookupKey(termOriginal)}`;
}

function glossaryFindEntry(termOriginal, detectedLang) {
  const key = glossaryEntryKey(termOriginal, detectedLang);
  return state.glossary?.items?.[key] || null;
}

function glossaryFindMetaForWord(word, sourceLang) {
  const key = lookupKey(word);
  if (!key) return null;
  const lang = sourceLang === "en" ? "en" : "de";
  const exact = state.glossary?.items?.[`${lang}:${key}`];
  if (exact?.pos || exact?.genus || exact?.article) return exact;
  if (lang === "de") {
    const deEntries = getGlossaryEntries().filter((x) => x.detectedLang === "de");
    const found = deEntries.find((x) => lookupKey(x.termOriginal || x.termNormalized) === key);
    if (found) return found;
  }
  return null;
}

function formatDisplayTerm(term, detectedLang, meta = null) {
  const clean = sanitizeLookupWord(term) || String(term || "").trim();
  if (detectedLang !== "de") return clean;
  const genus = meta?.genus || "";
  const article = meta?.article || genusToArticle(genus);
  const pos = meta?.pos || "";
  if (pos === "noun" && article) {
    const bare = sanitizeLookupWord(meta?.lemma || clean) || clean;
    return `${article} ${bare}`;
  }
  return clean;
}

function escapeHtml(raw) {
  return String(raw ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseGlossaryMoreList(raw) {
  return compactAltList(
    String(raw || "")
      .split(/[;,]/)
      .map((x) => x.trim()),
    [],
  ).slice(0, 2);
}

function normalizeGlossaryMore(raw) {
  return parseGlossaryMoreList(raw).join("; ");
}

function setGlossaryImportStatus(text, isError = false) {
  if (!els.glossaryImportStatus) return;
  const msg = String(text || "").trim();
  els.glossaryImportStatus.hidden = !msg;
  els.glossaryImportStatus.textContent = msg;
  els.glossaryImportStatus.classList.toggle("error", !!isError);
}

function isLikelyAsciiWord(text) {
  return /^[A-Za-z][A-Za-z'’-]*$/.test(String(text || "").trim());
}

function inferImportSourceLang(leftRaw, rightRaw, leftNoun, rightNoun) {
  if (leftNoun) return "de";
  if (rightNoun) return "en";
  const left = String(leftRaw || "").trim();
  const right = String(rightRaw || "").trim();
  if (/[äöüß]/i.test(left) && !/[äöüß]/i.test(right)) return "de";
  if (/[äöüß]/i.test(right) && !/[äöüß]/i.test(left)) return "en";
  if (/^[a-z]/.test(left) && /^[A-ZÄÖÜ]/.test(right)) return "en";
  if (/^[A-ZÄÖÜ]/.test(left) && /^[a-z]/.test(right)) return "de";
  if (isLikelyAsciiWord(left) && /\s/.test(right)) return "en";
  return "de";
}

function parseGlossaryImportLine(line) {
  const raw = String(line || "");
  const trimmed = raw.trim();
  if (!trimmed || /^#/.test(trimmed) || /^\/\//.test(trimmed)) return { skip: true };
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx < 0) return { error: "Kein '=' gefunden" };
  const leftRaw = trimmed.slice(0, eqIdx).trim();
  const rightRaw = trimmed.slice(eqIdx + 1).trim();
  if (!leftRaw || !rightRaw) return { error: "Linke oder rechte Seite leer" };

  const leftNoun = parseGermanNounWithArticle(leftRaw);
  const rightNoun = parseGermanNounWithArticle(rightRaw);
  const detectedLang = inferImportSourceLang(leftRaw, rightRaw, leftNoun, rightNoun);
  const sourceText = detectedLang === "de" ? leftRaw : leftRaw;
  const sourceNoun = detectedLang === "de" ? leftNoun : null;
  const termOriginal = sourceNoun?.word || sanitizeLookupWord(sourceText);
  if (!termOriginal) return { error: "Quellwort ungültig" };

  const patch = {
    termOriginal,
    detectedLang,
    translation: rightRaw,
    pos: sourceNoun?.pos || "",
    genus: sourceNoun?.genus || "",
    article: sourceNoun?.article || "",
    lemma: sourceNoun?.lemma || termOriginal,
  };
  return { patch };
}

function exportGlossaryText() {
  const items = getGlossaryEntries().slice();
  items.sort((a, b) => glossaryDisplayTerm(a).localeCompare(glossaryDisplayTerm(b), "de"));
  return items
    .map((entry) => `${glossaryDisplayTerm(entry)} = ${String(entry.translation || "").trim()}`)
    .join("\n");
}

function importGlossaryFromText(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  let created = 0;
  let merged = 0;
  let skipped = 0;
  let failed = 0;
  const errors = [];
  for (let i = 0; i < lines.length; i += 1) {
    const parsed = parseGlossaryImportLine(lines[i]);
    if (parsed.skip) {
      skipped += 1;
      continue;
    }
    if (parsed.error || !parsed.patch) {
      failed += 1;
      if (errors.length < 3) errors.push(`Zeile ${i + 1}: ${parsed.error || "Ungültig"}`);
      continue;
    }
    const key = glossaryEntryKey(parsed.patch.termOriginal, parsed.patch.detectedLang);
    const existed = !!state.glossary.items[key];
    const saved = upsertGlossaryEntry(parsed.patch);
    if (!saved) {
      failed += 1;
      if (errors.length < 3) errors.push(`Zeile ${i + 1}: konnte nicht gespeichert werden`);
      continue;
    }
    if (existed) merged += 1;
    else created += 1;
  }
  renderGlossaryPanel();
  const summary = `Import: ${created} neu, ${merged} zusammengeführt, ${failed} Fehler`;
  setGlossaryImportStatus(errors.length ? `${summary} · ${errors.join(" | ")}` : summary, failed > 0);
  info(summary);
}

function getWordQuickSelectedPos(result) {
  const sel = els.wordQuickPos ? String(els.wordQuickPos.value || "auto") : "auto";
  if (sel === "noun") return "noun";
  if (["verb", "adj", "other"].includes(sel)) return sel;
  return result?.pos === "noun" ? "noun" : (result?.pos || "");
}

function syncWordQuickGenusField() {
  if (!els.wordQuickGenusField) return;
  const result = currentWordPopupResult;
  const sourceLang = result?.sourceLang === "en" ? "en" : "de";
  const needsGenus = sourceLang === "de" && getWordQuickSelectedPos(result) === "noun";
  els.wordQuickGenusField.hidden = !needsGenus;
}

function fillWordQuickSaveForm(result, glossaryEntry) {
  if (!result) return;
  const found = !!(result.found && String(result.bestTranslation || "").trim());
  const shouldShow = wordQuickFormForced || !glossaryEntry || !found;
  if (els.wordQuickSaveWrap) els.wordQuickSaveWrap.hidden = !shouldShow;
  if (!shouldShow) return;
  if (els.wordQuickSaveTitle) {
    els.wordQuickSaveTitle.textContent = wordQuickFormForced
      ? "Wort bearbeiten / Edit word"
      : !found
      ? "Übersetzung fehlt / Translation missing"
      : glossaryEntry
        ? "Eintrag aktualisieren / Update glossary entry"
        : "Ins Wörterbuch speichern / Save to glossary";
  }
  if (els.wordQuickTranslation) {
    els.wordQuickTranslation.value = String(glossaryEntry?.translation || result.bestTranslation || "").trim();
  }
  if (els.wordQuickMore) {
    const morePrefill = normalizeGlossaryMore(
      glossaryEntry?.more || (result.altTranslations || []).slice(0, 2).join("; "),
    );
    els.wordQuickMore.value = morePrefill;
  }
  if (els.wordQuickPos) {
    const posValue = glossaryEntry?.pos === "noun"
      ? "noun"
      : ["verb", "adj", "other"].includes(glossaryEntry?.pos || "")
        ? glossaryEntry.pos
        : (["verb", "adj", "other"].includes(result.pos || "") ? result.pos : (result.pos === "noun" ? "noun" : "auto"));
    els.wordQuickPos.value = posValue;
  }
  if (els.wordQuickGenus) {
    els.wordQuickGenus.value = glossaryEntry?.genus || result.genus || "";
  }
  syncWordQuickGenusField();
}

function openWordQuickForm(mode = "edit") {
  if (!currentWordPopupResult) return;
  wordQuickFormForced = mode === "edit";
  showWordPopup(currentWordPopupResult, lastWordPopupAnchor);
  if (els.wordQuickSaveWrap && !els.wordQuickSaveWrap.hidden && els.wordQuickTranslation) {
    els.wordQuickTranslation.focus();
    els.wordQuickTranslation.select();
  }
}

function cancelWordQuickForm() {
  if (!wordQuickFormForced) {
    if (els.wordQuickSaveWrap) els.wordQuickSaveWrap.hidden = true;
    return;
  }
  wordQuickFormForced = false;
  if (currentWordPopupResult) showWordPopup(currentWordPopupResult, lastWordPopupAnchor);
}

function saveCurrentPopupQuickEntry() {
  if (!currentWordPopupResult) return;
  const result = currentWordPopupResult;
  const detectedLang = result.sourceLang === "en" ? "en" : "de";
  const translation = String(
    (els.wordQuickTranslation && els.wordQuickTranslation.value) || result.bestTranslation || "",
  ).trim();
  const more = normalizeGlossaryMore((els.wordQuickMore && els.wordQuickMore.value) || "");
  if (!translation) {
    info("Bitte Hauptübersetzung eingeben.");
    if (els.wordQuickTranslation) els.wordQuickTranslation.focus();
    return;
  }
  const pos = getWordQuickSelectedPos(result);
  const genus = detectedLang === "de" && pos === "noun"
    ? String((els.wordQuickGenus && els.wordQuickGenus.value) || "").trim()
    : "";
  if (detectedLang === "de" && pos === "noun" && !["m", "f", "n"].includes(genus)) {
    info("Bitte Artikel wählen: der / die / das");
    if (els.wordQuickGenus) els.wordQuickGenus.focus();
    return;
  }

  const saved = upsertGlossaryEntry({
    ...(currentPopupGlossaryEntry() || {}),
    termOriginal: result.original,
    detectedLang,
    translation,
    more,
    pos,
    genus,
    article: genusToArticle(genus),
    lemma: sanitizeLookupWord(result.lemma || result.original) || result.original,
  });
  if (!saved) {
    info("Wort konnte nicht gespeichert werden.");
    return;
  }
  setMiniLexEntry(detectedLang, result.original, {
    best_guess: translation,
    alts: parseGlossaryMoreList(more),
    pos,
    seenCount: Number(getMiniLexEntry(detectedLang, result.original)?.seenCount || 0),
  });

  const refreshed = lookupWordTranslation(result.original, detectedLang, result.context || null);
  wordQuickFormForced = false;
  currentWordPopupResult = { ...(refreshed || result), ...saved };
  showWordPopup(currentWordPopupResult, lastWordPopupAnchor);
  renderGlossaryPanel();
  info(`Wörterbuch gespeichert: ${glossaryDisplayTerm(saved)} → ${saved.translation || "—"}`);
}

function editGlossaryEntryByKey(key) {
  const entry = state.glossary.items[key];
  if (!entry) return;
  const nextTranslation = prompt(
    "Übersetzung bearbeiten / Edit translation:",
    String(entry.translation || ""),
  );
  if (nextTranslation === null) return;
  const translation = String(nextTranslation || "").trim();
  if (!translation) {
    info("Übersetzung darf nicht leer sein.");
    return;
  }

  let genus = entry.genus || "";
  let pos = entry.pos || "";
  const moreInput = prompt(
    "Weitere Bedeutungen (optional, max. 2) / More meanings (optional, max. 2):",
    String(entry.more || ""),
  );
  if (moreInput === null) return;
  const more = normalizeGlossaryMore(moreInput);
  if (entry.detectedLang === "de") {
    const nounDefault = ["noun", "verb", "adj", "other"].includes(entry.pos || "") ? entry.pos : "other";
    const typeInput = prompt(
      "Typ (noun|verb|adj|other) / Type (noun|verb|adj|other):",
      nounDefault,
    );
    if (typeInput === null) return;
    const typeNorm = String(typeInput || "").trim().toLowerCase();
    pos = ["noun", "verb", "adj", "other"].includes(typeNorm) ? typeNorm : "other";
    if (pos === "noun") {
      const articleInput = prompt(
        "Artikel (der/die/das):",
        entry.article || genusToArticle(entry.genus),
      );
      if (articleInput === null) return;
      genus = articleToGenus(articleInput);
      if (!genus) {
        info("Ungültiger Artikel. Erlaubt: der / die / das");
        return;
      }
    } else {
      genus = "";
    }
  } else {
    const typeDefault = ["noun", "verb", "adj", "other"].includes(entry.pos || "") ? entry.pos : "other";
    const typeInput = prompt(
      "Typ (noun|verb|adj|other) / Type (noun|verb|adj|other):",
      typeDefault,
    );
    if (typeInput === null) return;
    const typeNorm = String(typeInput || "").trim().toLowerCase();
    pos = ["noun", "verb", "adj", "other"].includes(typeNorm) ? typeNorm : "other";
  }

  const saved = upsertGlossaryEntry({
    ...entry,
    translation,
    more,
    pos,
    genus,
    article: genusToArticle(genus),
    lemma: sanitizeLookupWord(entry.lemma || entry.termOriginal) || entry.termOriginal,
  });
  if (!saved) return;
  renderGlossaryPanel();
  if (
    currentWordPopupResult &&
    glossaryEntryKey(currentWordPopupResult.original, currentWordPopupResult.sourceLang) === key
  ) {
    const refreshed = lookupWordTranslation(
      currentWordPopupResult.original,
      currentWordPopupResult.sourceLang,
      currentWordPopupResult.context || null,
    );
    if (refreshed) showWordPopup(refreshed, lastWordPopupAnchor);
  }
  info(`Glossar-Eintrag aktualisiert: ${glossaryDisplayTerm(saved)}`);
}

function displayLangLabel(lang) {
  return lang === "de" ? "DE" : lang === "en" ? "EN" : "?";
}

function normalizePhraseText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^\p{L}\p{N}\s'’-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function phraseMapKey(lang, phrase) {
  return `${lang === "de" ? "de" : "en"}:${normalizePhraseText(phrase)}`;
}

function getMiniLexKey(lang, term) {
  return `${lang === "de" ? "de" : "en"}:${lookupKey(term)}`;
}

function compactAltList(arr, exclude = []) {
  const ex = new Set((exclude || []).map((x) => String(x || "").trim()).filter(Boolean));
  const out = [];
  for (const v of arr || []) {
    const s = String(v || "").trim();
    if (!s || ex.has(s)) continue;
    if (out.includes(s)) continue;
    out.push(s);
    if (out.length >= 2) break;
  }
  return out;
}

function loadMiniLex() {
  try {
    const raw = localStorage.getItem(GLOSSARY_MIN_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return;
    state.lookup.mini = obj.entries && typeof obj.entries === "object" ? obj.entries : obj;
  } catch (_) {}
}

function saveMiniLex() {
  try {
    localStorage.setItem(GLOSSARY_MIN_KEY, JSON.stringify({ entries: state.lookup.mini }));
  } catch (_) {}
}

function loadPhraseMap() {
  try {
    const raw = localStorage.getItem(PHRASE_MAP_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return;
    state.lookup.phraseMap = obj.entries && typeof obj.entries === "object" ? obj.entries : obj;
  } catch (_) {}
}

function savePhraseMap() {
  try {
    localStorage.setItem(PHRASE_MAP_KEY, JSON.stringify({ entries: state.lookup.phraseMap }));
  } catch (_) {}
}

function ensureDefaultPhraseMapSeeds() {
  const seeds = {
    "en:broken glass": "zerbrochenes Glas",
    "en:broken leg": "gebrochenes Bein",
    "en:broken cable": "gerissenes Kabel",
    "en:broken device": "kaputtes Gerät",
    "en:broken promise": "gebrochenes Versprechen",
  };
  let changed = false;
  for (const [k, v] of Object.entries(seeds)) {
    if (!state.lookup.phraseMap[k]) {
      state.lookup.phraseMap[k] = v;
      changed = true;
    }
  }
  if (changed) savePhraseMap();
}

function setMiniLexEntry(lang, term, patch) {
  const key = getMiniLexKey(lang, term);
  const termClean = sanitizeLookupWord(term);
  if (!key || !termClean) return null;
  const prev = state.lookup.mini[key] || {};
  const best = String(patch?.best_guess || prev.best_guess || "").trim();
  const alts = compactAltList(
    Array.isArray(patch?.alts) ? patch.alts : (prev.alts || []),
    best ? [best] : [],
  );
  const next = {
    term: termClean,
    lang: lang === "de" ? "de" : "en",
    best_guess: best,
    alts,
    pos: patch?.pos || prev.pos || "",
    seenCount: Math.max(0, Number(patch?.seenCount ?? prev.seenCount ?? 0)),
    updatedAt: Date.now(),
  };
  state.lookup.mini[key] = next;
  saveMiniLex();
  return next;
}

function getMiniLexEntry(lang, term) {
  return state.lookup.mini[getMiniLexKey(lang, term)] || null;
}

function bumpMiniLexSeen(lang, term) {
  const e = getMiniLexEntry(lang, term);
  if (!e) return;
  e.seenCount = Math.max(0, Number(e.seenCount || 0)) + 1;
  e.updatedAt = Date.now();
  saveMiniLex();
}

function setPhraseMapEntry(lang, phrase, translation) {
  const key = phraseMapKey(lang, phrase);
  const trans = String(translation || "").trim();
  if (!key || !trans) return false;
  state.lookup.phraseMap[key] = trans;
  savePhraseMap();
  return true;
}

function getPhraseMapTranslation(lang, phrase) {
  return state.lookup.phraseMap[phraseMapKey(lang, phrase)] || "";
}

function tokenizeWithSpans(text) {
  const out = [];
  const re = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
  let m;
  while ((m = re.exec(String(text || "")))) {
    out.push({
      raw: m[0],
      norm: lookupKey(m[0]),
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return out;
}

function extractSentenceBounds(text, start, end) {
  const s = String(text || "");
  let a = clamp(Number(start) || 0, 0, s.length);
  let b = clamp(Number(end) || a, a, s.length);
  while (a > 0 && !/[.!?]/.test(s[a - 1])) a--;
  while (a < s.length && /\s/.test(s[a])) a++;
  while (b < s.length && !/[.!?]/.test(s[b])) b++;
  if (b < s.length) b += 1;
  return { start: a, end: b };
}

function buildContextFromRootText(rootText, wordStart, wordEnd, wordNorm) {
  const text = String(rootText || "");
  if (!text) return null;
  const bounds = extractSentenceBounds(text, wordStart, wordEnd);
  const sentence = text.slice(bounds.start, bounds.end).trim();
  const tokens = tokenizeWithSpans(sentence);
  const localStart = Math.max(0, wordStart - bounds.start);
  const localEnd = Math.max(localStart, wordEnd - bounds.start);
  let idx = tokens.findIndex((t) => t.start <= localStart && t.end >= localEnd);
  if (idx < 0 && wordNorm) idx = tokens.findIndex((t) => t.norm === wordNorm);
  if (idx < 0) return { sentence, windowText: "", phraseCandidates: [] };

  const left = Math.max(0, idx - 3);
  const right = Math.min(tokens.length - 1, idx + 3);
  const windowText = tokens.slice(left, right + 1).map((t) => t.raw).join(" ");

  const candidateSet = new Set();
  for (let span = 2; span <= 4; span++) {
    for (let s = Math.max(0, idx - (span - 1)); s <= idx && s + span - 1 < tokens.length; s++) {
      const e = s + span - 1;
      if (idx < s || idx > e) continue;
      const phrase = tokens.slice(s, e + 1).map((t) => t.raw).join(" ");
      const norm = normalizePhraseText(phrase);
      if (norm && norm.includes(wordNorm || "")) candidateSet.add(phrase);
    }
  }
  return {
    sentence,
    windowText,
    phraseCandidates: Array.from(candidateSet).sort((a, b) => normalizePhraseText(b).length - normalizePhraseText(a).length),
  };
}

function rootOffsetFromNodeOffset(rootEl, node, offset) {
  if (!rootEl || !node) return 0;
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
  let total = 0;
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (t === node) return total + clamp(Number(offset) || 0, 0, (t.textContent || "").length);
    total += (t.textContent || "").length;
  }
  return total;
}

function pickPhraseHit(sourceLang, context) {
  if (!context || !Array.isArray(context.phraseCandidates)) return null;
  for (const phrase of context.phraseCandidates) {
    const translation = getPhraseMapTranslation(sourceLang, phrase);
    if (translation) {
      return { sourcePhrase: phrase, translation };
    }
  }
  return null;
}

function addWordIndexPair(map, src, dst) {
  const k = lookupKey(src);
  const val = String(dst || "").trim();
  if (!k || !val) return;
  let set = map.get(k);
  if (!set) {
    set = new Set();
    map.set(k, set);
  }
  set.add(val);
}

function rebuildWordIndex(items) {
  wordIndex.deToEn.clear();
  wordIndex.enToDe.clear();
  wordMetaIndex.de.clear();
  for (const it of items || []) {
    if (!it) continue;
    const de = String(it.de || "").trim();
    const en = String(it.en || "").trim();
    if (!de || !en) continue;

    const deWords = splitWords(de);
    const enWords = splitWords(en);

    // Strong mapping: full side is a single word.
    if (deWords.length === 1) addWordIndexPair(wordIndex.deToEn, deWords[0], en);
    if (enWords.length === 1) addWordIndexPair(wordIndex.enToDe, enWords[0], de);

    // Strongest mapping: both sides are single words.
    if (deWords.length === 1 && enWords.length === 1) {
      addWordIndexPair(wordIndex.deToEn, deWords[0], enWords[0]);
      addWordIndexPair(wordIndex.enToDe, enWords[0], deWords[0]);
    }

    const nounInfo = parseGermanNounWithArticle(de);
    if (nounInfo) {
      const k = lookupKey(nounInfo.word);
      if (k && !wordMetaIndex.de.has(k)) {
        wordMetaIndex.de.set(k, {
          pos: "noun",
          genus: nounInfo.genus,
          article: nounInfo.article,
          lemma: nounInfo.word,
        });
      }
      addWordIndexPair(wordIndex.deToEn, nounInfo.word, enWords.length === 1 ? enWords[0] : en);
    }
  }
}

function getPreferredWordSourceLang(sourceHint, key) {
  if (sourceHint === "de" || sourceHint === "en") return sourceHint;
  const hasDe = wordIndex.deToEn.has(key);
  const hasEn = wordIndex.enToDe.has(key);
  if (hasDe && !hasEn) return "de";
  if (hasEn && !hasDe) return "en";
  return null;
}

function lookupWordTranslation(rawWord, sourceHint = null, context = null) {
  const original = sanitizeLookupWord(rawWord);
  const key = lookupKey(original);
  if (!original || !key) return null;

  const srcLang = getPreferredWordSourceLang(sourceHint, key);
  const map = srcLang === "de" ? wordIndex.deToEn : srcLang === "en" ? wordIndex.enToDe : null;
  const baseList = map ? Array.from(map.get(key) || []) : [];
  const deckMeta = (srcLang === "de" ? wordMetaIndex.de.get(key) : null) || null;
  const userMeta = glossaryFindMetaForWord(original, srcLang || sourceHint || "de");
  const mini = getMiniLexEntry(srcLang || sourceHint || "de", original);
  const list = [...baseList];
  if (!list.length && userMeta?.translation) list.push(userMeta.translation);
  const userMore = parseGlossaryMoreList(userMeta?.more || "");
  const phraseHit = pickPhraseHit(srcLang || sourceHint || "de", context);
  const baseBest = String(mini?.best_guess || list[0] || "").trim();
  const bestTranslation = String(phraseHit?.translation || baseBest || "").trim();
  const altTranslations = compactAltList(
    [...userMore, ...(mini?.alts || []), ...list.slice(1), ...list],
    bestTranslation ? [bestTranslation] : [],
  );
  const hit = !!bestTranslation;
  const genus = userMeta?.genus || deckMeta?.genus || "";
  const article = userMeta?.article || deckMeta?.article || genusToArticle(genus);
  const pos = userMeta?.pos || mini?.pos || deckMeta?.pos || "";
  const lemma = userMeta?.lemma || deckMeta?.lemma || original;
  if (!mini && (baseBest || altTranslations.length)) {
    setMiniLexEntry(srcLang || sourceHint || "de", original, {
      best_guess: baseBest || bestTranslation,
      alts: altTranslations,
      pos,
      seenCount: 0,
    });
  }
  return {
    original,
    sourceLang: srcLang || sourceHint || "auto",
    targetLang: srcLang === "de" ? "en" : srcLang === "en" ? "de" : "auto",
    translations: [bestTranslation, ...altTranslations].filter(Boolean),
    bestTranslation,
    altTranslations,
    phraseHit,
    context,
    found: hit,
    pos,
    genus,
    article,
    lemma,
  };
}

function hideWordPopup() {
  if (!els.wordPopup || els.wordPopup.hidden) return false;
  els.wordPopup.hidden = true;
  wordQuickFormForced = false;
  if (els.wordQuickSaveWrap) els.wordQuickSaveWrap.hidden = true;
  els.wordPopup.classList.remove("isMiss");
  els.wordPopup.classList.remove("genusM", "genusF", "genusN");
  lastWordPopupAnchor = null;
  currentWordPopupResult = null;
  return true;
}

function placeWordPopup(anchorRect) {
  if (!els.wordPopup) return;
  const vpW = window.innerWidth || document.documentElement.clientWidth || 360;
  const vpH = window.innerHeight || document.documentElement.clientHeight || 640;
  const popupRect = els.wordPopup.getBoundingClientRect();
  const gap = 10;
  const width = popupRect.width || 320;
  const height = popupRect.height || 140;
  const rect = anchorRect || { left: vpW / 2, right: vpW / 2, top: vpH / 2, bottom: vpH / 2 };

  let left = rect.left + (rect.width || (rect.right - rect.left) || 0) / 2 - width / 2;
  left = clamp(left, 8, Math.max(8, vpW - width - 8));

  let top = rect.bottom + gap;
  if (top + height > vpH - 8) {
    top = rect.top - height - gap;
  }
  top = clamp(top, 8, Math.max(8, vpH - height - 8));

  els.wordPopup.style.left = `${Math.round(left)}px`;
  els.wordPopup.style.top = `${Math.round(top)}px`;
}

function showWordPopup(result, anchorRect) {
  if (!els.wordPopup || !result) return;
  const bestTranslation = String(result.bestTranslation || (result.translations || [])[0] || "").trim();
  const altTranslations = compactAltList(result.altTranslations || (result.translations || []).slice(1), bestTranslation ? [bestTranslation] : []);
  const found = !!result.found && !!bestTranslation;
  const src = displayLangLabel(result.sourceLang);
  const dst = displayLangLabel(result.targetLang);
  const glossaryEntry = glossaryFindEntry(result.original, result.sourceLang);
  const isNoun = result.sourceLang === "de" && result.pos === "noun";
  const hasKnownGenus = isNoun && !!result.genus;
  const wordDisplay = formatDisplayTerm(result.original, result.sourceLang, result);
  const gClass = genusClass(result.genus);

  if (els.wordPopupMeta) {
    els.wordPopupMeta.textContent = found
      ? `Wort / Word (${src} → ${dst})${result.phraseHit ? " · Phrase" : ""}`
      : "Wort / Word";
  }
  if (els.wordPopupWord) els.wordPopupWord.textContent = wordDisplay;
  if (els.wordPopupPosTag) {
    els.wordPopupPosTag.hidden = !isNoun;
    els.wordPopupPosTag.textContent = "Nomen / Noun";
  }
  if (els.wordPopupGenusTag) {
    els.wordPopupGenusTag.hidden = !hasKnownGenus;
    els.wordPopupGenusTag.textContent = result.article || genusToArticle(result.genus);
  }
  if (els.wordPopupBestLabel) {
    els.wordPopupBestLabel.textContent = result.phraseHit
      ? "Beste Übersetzung (Kontext/Phrase) / Best translation (context/phrase)"
      : "Beste Übersetzung / Best translation";
  }
  if (els.wordPopupTranslation) {
    els.wordPopupTranslation.textContent = found
      ? bestTranslation
      : "Übersetzung fehlt / Translation missing";
  }
  if (els.wordPopupContext) {
    const parts = [];
    if (result.context?.windowText) parts.push(`Kontext: ${result.context.windowText}`);
    if (result.phraseHit?.sourcePhrase) parts.push(`Phrase: ${result.phraseHit.sourcePhrase}`);
    if (result.context?.sentence) parts.push(`Satz: ${result.context.sentence}`);
    els.wordPopupContext.hidden = parts.length === 0;
    els.wordPopupContext.textContent = parts.join(" · ");
  }
  if (els.wordPopupAltWrap) {
    els.wordPopupAltWrap.hidden = !(altTranslations.length > 0);
    els.wordPopupAltWrap.open = false;
  }
  if (els.wordPopupAltList) {
    els.wordPopupAltList.innerHTML = "";
    for (const alt of altTranslations.slice(0, 2)) {
      const div = document.createElement("div");
      div.textContent = alt;
      els.wordPopupAltList.appendChild(div);
    }
  }
  if (els.wordPopupHint) {
    els.wordPopupHint.hidden = !(isNoun && !hasKnownGenus);
    els.wordPopupHint.textContent = "Genus unbekannt / Gender unknown";
  }
  if (els.wordPopupGenusEditor) {
    const canEditGenus = result.sourceLang === "de";
    els.wordPopupGenusEditor.hidden = !canEditGenus;
  }
  if (els.wordGenusSelect) {
    els.wordGenusSelect.value = result.genus || "";
  }
  fillWordQuickSaveForm(result, glossaryEntry);
  if (els.wordAdd) {
    els.wordAdd.hidden = false;
    els.wordAdd.textContent = glossaryEntry
      ? "Aus Wörterbuch entfernen / Remove from glossary"
      : (found ? "Zum Wörterbuch hinzufügen / Add to glossary" : "Fehlt: speichern / Missing: save");
    els.wordAdd.classList.toggle("danger", !!glossaryEntry);
  }
  if (els.wordQuickCancelBtn) {
    els.wordQuickCancelBtn.hidden = !(wordQuickFormForced || !found || !glossaryEntry);
  }
  if (els.wordSpeak) els.wordSpeak.hidden = false;
  if (els.wordCorrect) els.wordCorrect.hidden = false;
  if (els.wordSavePhrase) {
    const hasPhraseCandidate = !!(result.context?.phraseCandidates && result.context.phraseCandidates.length);
    els.wordSavePhrase.hidden = !hasPhraseCandidate;
  }

  els.wordPopup.dataset.word = result.original;
  els.wordPopup.dataset.lang = result.sourceLang === "en" ? "en" : "de";
  els.wordPopup.dataset.targetLang = result.targetLang || "";
  els.wordPopup.dataset.pos = result.pos || "";
  els.wordPopup.dataset.genus = result.genus || "";
  els.wordPopup.dataset.best = bestTranslation;
  els.wordPopup.hidden = false;
  els.wordPopup.classList.toggle("isMiss", !found);
  els.wordPopup.classList.remove("genusM", "genusF", "genusN");
  if (gClass) els.wordPopup.classList.add(gClass);
  lastWordPopupAnchor = anchorRect || null;
  currentWordPopupResult = {
    ...result,
    bestTranslation,
    altTranslations: altTranslations.slice(0, 2),
    glossaryExists: !!glossaryEntry,
  };
  placeWordPopup(anchorRect);
}

function rangeRect(range) {
  if (!range) return null;
  const rects = range.getClientRects ? Array.from(range.getClientRects()) : [];
  const r = rects.find((x) => x && x.width >= 0 && x.height >= 0) || range.getBoundingClientRect?.();
  return r || null;
}

function nodeInElement(node, rootEl) {
  if (!node || !rootEl) return false;
  const n = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
  return !!(n && rootEl.contains(n));
}

function getSelectionWordFromElement(rootEl) {
  if (!rootEl || !window.getSelection) return null;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount < 1 || sel.isCollapsed) return null;
  const raw = String(sel.toString() || "");
  const word = sanitizeLookupWord(raw);
  if (!word) return null;
  if (!nodeInElement(sel.anchorNode, rootEl) || !nodeInElement(sel.focusNode, rootEl)) return null;
  const range = sel.getRangeAt(0);
  const rect = rangeRect(range);
  let context = null;
  try {
    const rootText = rootEl.textContent || "";
    const a = rootOffsetFromNodeOffset(rootEl, range.startContainer, range.startOffset);
    const b = rootOffsetFromNodeOffset(rootEl, range.endContainer, range.endOffset);
    context = buildContextFromRootText(rootText, Math.min(a, b), Math.max(a, b), lookupKey(word));
  } catch (_) {}
  return { word, rect, context };
}

function resolveTextNodeFromPoint(container, x, y) {
  if (!container) return null;
  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    if (range) return { node: range.startContainer, offset: range.startOffset };
  }
  if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    if (pos) return { node: pos.offsetNode, offset: pos.offset };
  }
  return null;
}

function getWordAtPoint(rootEl, x, y) {
  if (!rootEl || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  const hit = resolveTextNodeFromPoint(rootEl, x, y);
  if (!hit || !nodeInElement(hit.node, rootEl)) return null;

  let node = hit.node;
  let offset = Math.max(0, Number(hit.offset) || 0);

  if (node.nodeType !== Node.TEXT_NODE) {
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
    let textNode = null;
    while (walker.nextNode()) {
      textNode = walker.currentNode;
      break;
    }
    if (!textNode) return null;
    node = textNode;
    offset = 0;
  }

  const text = node.textContent || "";
  if (!text) return null;

  let i = clamp(offset, 0, Math.max(0, text.length - 1));
  if (!/[\p{L}\p{N}'’-]/u.test(text[i] || "") && i > 0 && /[\p{L}\p{N}'’-]/u.test(text[i - 1] || "")) {
    i -= 1;
  }
  if (!/[\p{L}\p{N}'’-]/u.test(text[i] || "")) return null;

  let a = i;
  let b = i + 1;
  while (a > 0 && /[\p{L}\p{N}'’-]/u.test(text[a - 1])) a--;
  while (b < text.length && /[\p{L}\p{N}'’-]/u.test(text[b])) b++;

  const word = sanitizeLookupWord(text.slice(a, b));
  if (!word) return null;

  const r = document.createRange();
  r.setStart(node, a);
  r.setEnd(node, b);
  const rootText = rootEl.textContent || "";
  const start = rootOffsetFromNodeOffset(rootEl, node, a);
  const end = rootOffsetFromNodeOffset(rootEl, node, b);
  const context = buildContextFromRootText(rootText, start, end, lookupKey(word));
  return { word, rect: rangeRect(r), context };
}

function eventPoint(e) {
  if (!e) return null;
  const t = e.changedTouches && e.changedTouches[0];
  if (t) return { x: t.clientX, y: t.clientY };
  if (Number.isFinite(e.clientX) && Number.isFinite(e.clientY)) {
    return { x: e.clientX, y: e.clientY };
  }
  return null;
}

function queueWordLookup(rootEl, sourceLang, e) {
  clearTimeout(wordLookupTimer);
  wordLookupTimer = setTimeout(() => {
    if (!els.modal || els.modal.hidden || !rootEl) return;
    const fromSelection = getSelectionWordFromElement(rootEl);
    const p = eventPoint(e);
    const fromPoint = !fromSelection && p ? getWordAtPoint(rootEl, p.x, p.y) : null;
    const picked = fromSelection || fromPoint;
    if (!picked) return;

    const result = lookupWordTranslation(picked.word, sourceLang, picked.context || null);
    if (!result) return;
    bumpMiniLexSeen(sourceLang, picked.word);

    const sig = `${result.original.toLowerCase()}|${sourceLang}|${Math.round((picked.rect?.left || 0))}|${Math.round((picked.rect?.top || 0))}`;
    const t = now();
    if (sig === lastWordPopupSig && t - lastWordPopupAt < 180) return;
    lastWordPopupSig = sig;
    lastWordPopupAt = t;

    showWordPopup(result, picked.rect);
  }, 0);
}

// ---------- storage ----------
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (obj && obj.meta && typeof obj.meta === "object") {
      state.prog = obj;
      if (!state.prog.stars || typeof state.prog.stars !== "object") state.prog.stars = {};
      // Backward-compatible migration: old progress may have `level` where we now store Leitner `box`.
      let changed = false;
      for (const m of Object.values(state.prog.meta || {})) {
        if (!m || typeof m !== "object") continue;
        if (!("box" in m) && ("level" in m)) {
          const legacy = clamp(Number(m.level) || 1, 1, BOX_COUNT);
          m.box = legacy;
          changed = true;
        }
        if ("box" in m) {
          const clamped = clamp(Number(m.box) || 1, 1, BOX_COUNT);
          if (m.box !== clamped) {
            m.box = clamped;
            changed = true;
          }
        }
      }
      if (changed) saveProgress();
    }
  } catch (_) {}
}
function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prog));
  } catch (_) {}
}

function loadMnemo() {
  try {
    const raw = localStorage.getItem(MNEMO_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object") state.mnemoMap = obj;
  } catch (_) {}
}
function saveMnemo() {
  try {
    localStorage.setItem(MNEMO_KEY, JSON.stringify(state.mnemoMap));
  } catch (_) {}
}

function loadTimeStats() {
  try {
    const raw = localStorage.getItem(TIME_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return;
    state.time.byDay =
      obj.byDay && typeof obj.byDay === "object" ? obj.byDay : {};
    state.time.lastDay = typeof obj.lastDay === "string" ? obj.lastDay : "";
    state.time.streak = Number.isFinite(obj.streak)
      ? Math.max(0, Math.floor(obj.streak))
      : 0;
  } catch (_) {}
}
function saveTimeStats() {
  try {
    localStorage.setItem(TIME_KEY, JSON.stringify(state.time));
  } catch (_) {}
}

// Optional: persist settings (hash still supported)
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return;
    state.settings = { ...state.settings, ...obj };
  } catch (_) {}
}
function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  } catch (_) {}
}

function normalizeGlossaryEntry(raw) {
  if (!raw || typeof raw !== "object") return null;
  const termOriginal = sanitizeLookupWord(raw.termOriginal || raw.termNormalized || "");
  const detectedLang = raw.detectedLang === "en" ? "en" : "de";
  const key = glossaryEntryKey(termOriginal, detectedLang);
  if (!termOriginal || !key) return null;
  const genus = ["m", "f", "n"].includes(raw.genus) ? raw.genus : "";
  const article = raw.article || genusToArticle(genus);
  const pos = raw.pos === "noun" ? "noun" : (raw.pos ? String(raw.pos) : "");
  return {
    key,
    termOriginal,
    termNormalized: lookupKey(termOriginal),
    detectedLang,
    translation: String(raw.translation || "").trim(),
    more: normalizeGlossaryMore(raw.more || raw.alt || raw.alts || ""),
    pos,
    genus,
    article: article || "",
    lemma: sanitizeLookupWord(raw.lemma || termOriginal) || termOriginal,
    addedAt: Number(raw.addedAt) || Date.now(),
    updatedAt: Number(raw.updatedAt) || Number(raw.addedAt) || Date.now(),
    seenCount: Math.max(0, Number(raw.seenCount) || 0),
  };
}

function loadGlossary() {
  try {
    const raw = localStorage.getItem(GLOSSARY_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    const input = obj && typeof obj === "object" ? (obj.items || obj) : {};
    const out = {};
    for (const [k, v] of Object.entries(input || {})) {
      const norm = normalizeGlossaryEntry({ ...v, key: k });
      if (!norm) continue;
      out[norm.key] = norm;
    }
    state.glossary.items = out;
  } catch (_) {}
}

function saveGlossary() {
  try {
    localStorage.setItem(GLOSSARY_KEY, JSON.stringify({ items: state.glossary.items }));
  } catch (_) {}
}

function upsertGlossaryEntry(entryPatch) {
  const norm = normalizeGlossaryEntry(entryPatch);
  if (!norm) return null;
  const existing = state.glossary.items[norm.key];
  const merged = {
    ...(existing || {}),
    ...norm,
    addedAt: existing?.addedAt || norm.addedAt || Date.now(),
    updatedAt: Date.now(),
    seenCount: Math.max(0, Number(existing?.seenCount || 0)),
  };
  state.glossary.items[norm.key] = merged;
  saveGlossary();
  return merged;
}

function removeGlossaryEntry(termOriginal, detectedLang) {
  const key = glossaryEntryKey(termOriginal, detectedLang);
  if (!state.glossary.items[key]) return false;
  delete state.glossary.items[key];
  saveGlossary();
  return true;
}

function markGlossarySeen(termOriginal, detectedLang) {
  const entry = glossaryFindEntry(termOriginal, detectedLang);
  if (!entry) return;
  entry.seenCount = Math.max(0, Number(entry.seenCount || 0)) + 1;
  entry.updatedAt = Date.now();
  saveGlossary();
}

function currentPopupGlossaryEntry() {
  if (!currentWordPopupResult) return null;
  return glossaryFindEntry(currentWordPopupResult.original, currentWordPopupResult.sourceLang);
}

function applyManualGenusToCurrentPopup(genus) {
  if (!currentWordPopupResult) return null;
  const g = ["m", "f", "n"].includes(genus) ? genus : "";
  const next = {
    ...currentWordPopupResult,
    sourceLang: currentWordPopupResult.sourceLang === "en" ? "en" : "de",
    pos: currentWordPopupResult.sourceLang === "de" ? "noun" : currentWordPopupResult.pos,
    genus: g,
    article: genusToArticle(g),
    lemma: sanitizeLookupWord(currentWordPopupResult.lemma || currentWordPopupResult.original) || currentWordPopupResult.original,
  };
  currentWordPopupResult = next;
  showWordPopup(next, lastWordPopupAnchor);
  return next;
}

function saveCurrentPopupGenus() {
  if (!currentWordPopupResult) return;
  if (currentWordPopupResult.sourceLang !== "de") return;
  const genus = els.wordGenusSelect ? els.wordGenusSelect.value : "";
  if (!["m", "f", "n"].includes(genus)) {
    info("Bitte Artikel wählen: der / die / das");
    return;
  }
  const next = applyManualGenusToCurrentPopup(genus);
  if (!next) return;
  upsertGlossaryEntry({
    ...(currentPopupGlossaryEntry() || {}),
    termOriginal: next.original,
    detectedLang: "de",
    translation: String(next.bestTranslation || (next.translations || [])[0] || "").trim(),
    pos: "noun",
    genus,
    article: genusToArticle(genus),
    lemma: next.lemma || next.original,
  });
  showWordPopup(next, lastWordPopupAnchor);
  renderGlossaryPanel();
  info(`Artikel gespeichert: ${genusToArticle(genus)} ${sanitizeLookupWord(next.lemma || next.original) || next.original}`);
}

function correctCurrentPopupTranslation() {
  if (!currentWordPopupResult) return;
  openWordQuickForm("edit");
}

function saveCurrentPopupPhrase() {
  if (!currentWordPopupResult) return;
  const srcLang = currentWordPopupResult.sourceLang === "en" ? "en" : "de";
  const candidates = currentWordPopupResult.context?.phraseCandidates || [];
  const suggestedPhrase = String(
    currentWordPopupResult.phraseHit?.sourcePhrase || candidates[0] || currentWordPopupResult.context?.windowText || currentWordPopupResult.original,
  ).trim();
  const phrase = prompt(
    "Phrase (Quelle) speichern / Save source phrase:",
    suggestedPhrase,
  );
  if (phrase === null) return;
  const phraseNorm = normalizePhraseText(phrase);
  if (!phraseNorm || !phraseNorm.includes(lookupKey(currentWordPopupResult.original) || "")) {
    info("Phrase ungültig (muss das Wort enthalten).");
    return;
  }
  const translation = prompt(
    "Phrasen-Übersetzung speichern / Save phrase translation:",
    String(currentWordPopupResult.bestTranslation || "").trim(),
  );
  if (translation === null) return;
  const trans = String(translation || "").trim();
  if (!trans) {
    info("Keine Übersetzung eingegeben.");
    return;
  }
  if (!setPhraseMapEntry(srcLang, phraseNorm, trans)) {
    info("Phrase konnte nicht gespeichert werden.");
    return;
  }
  const refreshed = lookupWordTranslation(
    currentWordPopupResult.original,
    srcLang,
    currentWordPopupResult.context || null,
  );
  if (refreshed) showWordPopup(refreshed, lastWordPopupAnchor);
  info(`Phrase gespeichert: ${phraseNorm} → ${trans}`);
}

function toggleCurrentPopupGlossary() {
  if (!currentWordPopupResult) return;
  const detectedLang = currentWordPopupResult.sourceLang === "en" ? "en" : "de";
  const existing = glossaryFindEntry(currentWordPopupResult.original, detectedLang);
  if (existing) {
    removeGlossaryEntry(existing.termOriginal, existing.detectedLang);
    currentWordPopupResult.glossaryExists = false;
    showWordPopup(currentWordPopupResult, lastWordPopupAnchor);
    renderGlossaryPanel();
    info(`Aus Wörterbuch entfernt: ${existing.termOriginal}`);
    return;
  }

  const hasFoundTranslation = !!String(
    currentWordPopupResult.bestTranslation || (currentWordPopupResult.translations || [])[0] || "",
  ).trim();
  if (!hasFoundTranslation) {
    saveCurrentPopupQuickEntry();
    return;
  }

  if (detectedLang === "de" && currentWordPopupResult.pos === "noun" && !currentWordPopupResult.genus) {
    const quickGenus = String((els.wordQuickGenus && els.wordQuickGenus.value) || (els.wordGenusSelect && els.wordGenusSelect.value) || "").trim();
    if (["m", "f", "n"].includes(quickGenus)) {
      applyManualGenusToCurrentPopup(quickGenus);
    } else {
      info("Bitte Artikel wählen (der / die / das), bevor du das Nomen speicherst.");
      return;
    }
  }

  const translation = String(
    currentWordPopupResult.bestTranslation || (currentWordPopupResult.translations || [])[0] || "",
  ).trim();
  const added = upsertGlossaryEntry({
    termOriginal: currentWordPopupResult.original,
    detectedLang,
    translation: translation || "",
    pos: currentWordPopupResult.pos || "",
    genus: currentWordPopupResult.genus || "",
    article: currentWordPopupResult.article || "",
    lemma: currentWordPopupResult.lemma || currentWordPopupResult.original,
    addedAt: Date.now(),
    updatedAt: Date.now(),
    seenCount: 0,
  });
  if (!added) return;
  currentWordPopupResult.glossaryExists = true;
  showWordPopup({ ...currentWordPopupResult, ...added }, lastWordPopupAnchor);
  renderGlossaryPanel();
  info(`Zum Wörterbuch hinzugefügt: ${added.termOriginal}`);
}

function glossaryDisplayTerm(entry) {
  return formatDisplayTerm(entry.termOriginal, entry.detectedLang, entry);
}

function glossaryTargetLang(entry) {
  return entry.detectedLang === "de" ? "en" : "de";
}

function glossaryMatchesFilters(entry) {
  const q = String(state.glossary.ui.search || "").trim().toLowerCase();
  const type = state.glossary.ui.type || "all";
  const lang = state.glossary.ui.lang || "all";
  const genus = state.glossary.ui.genus || "all";

  if (lang !== "all" && entry.detectedLang !== lang) return false;
  if (type === "noun" && entry.pos !== "noun") return false;
  if (genus !== "all") {
    if (genus === "unknown") {
      if (entry.pos !== "noun" || entry.genus) return false;
    } else if (entry.genus !== genus) {
      return false;
    }
  }
  if (!q) return true;
  const hay = [
    glossaryDisplayTerm(entry),
    entry.termOriginal,
    entry.translation,
    entry.more,
    entry.article,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function getGlossaryFilteredEntries() {
  const arr = getGlossaryEntries().filter(glossaryMatchesFilters);
  const sort = state.glossary.ui.sort || "newest";
  arr.sort((a, b) => {
    if (sort === "oldest") return (a.addedAt || 0) - (b.addedAt || 0);
    if (sort === "alpha") return glossaryDisplayTerm(a).localeCompare(glossaryDisplayTerm(b), "de");
    return (b.addedAt || 0) - (a.addedAt || 0);
  });
  return arr;
}

function renderGlossaryList() {
  if (!els.glossaryList) return;
  const items = getGlossaryFilteredEntries();
  if (els.glossaryCount) {
    els.glossaryCount.textContent = `${items.length} Einträge / entries`;
  }
  if (els.glossaryEmpty) els.glossaryEmpty.hidden = items.length > 0;
  els.glossaryList.innerHTML = "";

  for (const entry of items) {
    const row = document.createElement("div");
    row.className = `glossaryItem ${genusClass(entry.genus)}`.trim();
    row.dataset.key = entry.key;
    const src = displayLangLabel(entry.detectedLang);
    const dst = displayLangLabel(glossaryTargetLang(entry));
    const dt = new Date(entry.addedAt || Date.now()).toLocaleDateString("de-DE");
    const posLabel = entry.pos === "noun" ? "Nomen / Noun" : (entry.pos || "Wort / Word");
    const genusLabel = entry.genus ? `${entry.article || genusToArticle(entry.genus)} · ${entry.genus}` : "Genus ?";
    const termText = escapeHtml(glossaryDisplayTerm(entry));
    const translationText = escapeHtml(entry.translation || "—");
    const moreText = escapeHtml(entry.more || "");
    const metaLine = escapeHtml(`${posLabel}${entry.detectedLang === "de" ? ` · ${genusLabel}` : ""} · ${dt}`);
    row.innerHTML = `
      <div class="glossaryItemRow">
        <div>
          <div class="glossaryTerm">${termText}</div>
          <div class="glossarySub">${escapeHtml(src)} → ${escapeHtml(dst)} · ${translationText}${moreText ? ` · + ${moreText}` : ""}</div>
          <div class="glossarySub">${metaLine}</div>
        </div>
        <div class="glossaryActions">
          <button class="btn ghost" type="button" data-action="speak" data-key="${entry.key}">🔊</button>
          <button class="btn ghost" type="button" data-action="edit" data-key="${entry.key}">Bearbeiten / Edit</button>
          <button class="btn ghost" type="button" data-action="remove" data-key="${entry.key}">Entfernen / Remove</button>
        </div>
      </div>
    `;
    els.glossaryList.appendChild(row);
  }
}

function renderGlossaryPractice() {
  const p = state.glossary.practice;
  if (els.glossaryPracticeBox) els.glossaryPracticeBox.hidden = !p.active;
  if (els.glossaryPracticeStart) els.glossaryPracticeStart.hidden = !!p.active;
  if (els.glossaryPracticeStop) els.glossaryPracticeStop.hidden = !p.active;
  if (!p.active) return;

  const total = p.queue.length;
  const idx = clamp(p.idx, 0, Math.max(0, total - 1));
  const entry = p.queue[idx];
  if (!entry) {
    p.active = false;
    renderGlossaryPractice();
    return;
  }
  const frontLang = displayLangLabel(entry.detectedLang);
  const backLang = displayLangLabel(glossaryTargetLang(entry));
  if (els.glossaryPracticeProgress) els.glossaryPracticeProgress.textContent = `${idx + 1} / ${total}`;
  if (els.glossaryPracticeFrontLang) els.glossaryPracticeFrontLang.textContent = frontLang;
  if (els.glossaryPracticeBackLang) els.glossaryPracticeBackLang.textContent = backLang;
  if (els.glossaryPracticeFront) {
    els.glossaryPracticeFront.textContent = glossaryDisplayTerm(entry);
    els.glossaryPracticeFront.classList.remove("genusM", "genusF", "genusN");
    const cls = genusClass(entry.genus);
    if (cls) els.glossaryPracticeFront.classList.add(cls);
  }
  if (els.glossaryPracticeBack) {
    els.glossaryPracticeBack.textContent = entry.translation || "—";
  }
  if (els.glossaryPracticeBackWrap) els.glossaryPracticeBackWrap.hidden = !p.reveal;
  if (els.glossaryPracticeStats) {
    els.glossaryPracticeStats.textContent = `Richtig: ${p.stats.right} · Falsch: ${p.stats.wrong}`;
  }
  if (els.glossaryPracticeShow) els.glossaryPracticeShow.disabled = p.reveal;
  if (els.glossaryPracticeGood) els.glossaryPracticeGood.disabled = !p.reveal || p.awaitingNext;
  if (els.glossaryPracticeBad) els.glossaryPracticeBad.disabled = !p.reveal || p.awaitingNext;
  if (els.glossaryPracticeNext) els.glossaryPracticeNext.hidden = !p.awaitingNext;
}

function renderGlossaryPanel() {
  renderGlossaryList();
  renderGlossaryPractice();
}

function startGlossaryPractice() {
  const queue = getGlossaryFilteredEntries();
  if (!queue.length) {
    info("Glossar ist leer (oder Filter liefern nichts).");
    return;
  }
  state.glossary.practice = {
    active: true,
    queue: shuffleInPlace(queue.slice()),
    idx: 0,
    reveal: false,
    awaitingNext: false,
    stats: { right: 0, wrong: 0 },
  };
  renderGlossaryPractice();
}

function stopGlossaryPractice() {
  state.glossary.practice = {
    active: false,
    queue: [],
    idx: 0,
    reveal: false,
    awaitingNext: false,
    stats: { right: 0, wrong: 0 },
  };
  renderGlossaryPractice();
}

function glossaryPracticeShow() {
  const p = state.glossary.practice;
  if (!p.active) return;
  p.reveal = true;
  p.awaitingNext = false;
  const entry = p.queue[p.idx];
  if (entry) markGlossarySeen(entry.termOriginal, entry.detectedLang);
  renderGlossaryPractice();
}

function glossaryPracticeGrade(known) {
  const p = state.glossary.practice;
  if (!p.active || !p.reveal || p.awaitingNext) return;
  if (known) p.stats.right += 1;
  else p.stats.wrong += 1;
  p.awaitingNext = true;
  renderGlossaryPractice();
}

function glossaryPracticeNext() {
  const p = state.glossary.practice;
  if (!p.active || !p.awaitingNext) return;
  p.idx += 1;
  if (p.idx >= p.queue.length) {
    info(`Glossar-Üben fertig: richtig ${p.stats.right}, falsch ${p.stats.wrong}`);
    stopGlossaryPractice();
    return;
  }
  p.reveal = false;
  p.awaitingNext = false;
  renderGlossaryPractice();
}

function glossaryPracticeSpeak() {
  const p = state.glossary.practice;
  if (!p.active) return;
  const entry = p.queue[p.idx];
  if (!entry) return;
  if (p.reveal) {
    speak(entry.translation, entry.detectedLang === "de" ? TARGET_TTS_LANG : SOURCE_TTS_LANG);
  } else {
    speak(glossaryDisplayTerm(entry), entry.detectedLang === "de" ? SOURCE_TTS_LANG : TARGET_TTS_LANG);
  }
}

// ---------- time tracking ----------
function getLiveSessionSeconds() {
  if (!state.session.timerRunning || !state.session.timerStart) return 0;
  return Math.max(
    0,
    Math.round((Date.now() - state.session.timerStart) / 1000),
  );
}

function updateTimeStats() {
  const today = dayKey();
  const byDay = state.time.byDay || {};
  const liveSec = getLiveSessionSeconds();
  const todaySec = (Number(byDay[today]) || 0) + liveSec;

  let weekSec = 0;
  for (let i = 0; i < 7; i++) {
    const k = dayKeyOffset(-i);
    weekSec += Number(byDay[k]) || 0;
  }
  weekSec += liveSec;

  if (els.today) els.today.textContent = `${Math.floor(todaySec / 60)} min`;
  if (els.week) els.week.textContent = `${Math.floor(weekSec / 60)} min`;
  if (els.streak) els.streak.textContent = fmt(state.time.streak || 0);
}

function recordLearningSeconds(seconds) {
  const sec = Math.max(0, Math.round(seconds || 0));
  if (sec <= 0) return;

  const today = dayKey();
  state.time.byDay[today] = (Number(state.time.byDay[today]) || 0) + sec;

  if (state.time.lastDay !== today) {
    if (!state.time.lastDay) {
      state.time.streak = 1;
    } else if (state.time.lastDay === dayKeyOffset(-1)) {
      state.time.streak = (Number(state.time.streak) || 0) + 1;
    } else {
      state.time.streak = 1;
    }
    state.time.lastDay = today;
  } else if (!state.time.streak) {
    state.time.streak = 1;
  }

  saveTimeStats();
  updateTimeStats();
}

function startLearningTimer() {
  if (state.session.timerRunning) return;
  state.session.timerStart = Date.now();
  state.session.timerRunning = true;
}
function stopLearningTimer() {
  if (!state.session.timerRunning) return;
  const started = state.session.timerStart || Date.now();
  state.session.timerRunning = false;
  state.session.timerStart = 0;
  recordLearningSeconds((Date.now() - started) / 1000);
}

// ---------- mnemo ----------
function effectiveMnemo(it) {
  const local = state.mnemoMap?.[it.id];
  if (typeof local === "string") return local;
  return it.mnemo || "";
}
function renderMnemo(it) {
  if (!els.mnemo) return;
  const text = (effectiveMnemo(it) || "").trim();
  if (!text) {
    els.mnemo.hidden = true;
    els.mnemo.textContent = "";
    return;
  }
  els.mnemo.textContent = text;
  els.mnemo.hidden = false;
}
function editCurrentMnemo() {
  const id = state.session.currentId;
  const it = state.all.find((x) => x.id === id);
  if (!it) return;

  const current = effectiveMnemo(it);
  const next = prompt("Mnemo / Merksatz für diese Karte:", current);
  if (next === null) return;

  const clean = String(next).trim();
  if (clean) {
    state.mnemoMap[it.id] = clean;
  } else {
    delete state.mnemoMap[it.id];
  }
  saveMnemo();
  renderMnemo(it);
}

// ---------- counts ----------
function dueNowCount(items) {
  const t = now();
  let c = 0;
  for (const it of items) {
    const m = state.prog.meta[it.id];
    if (!m) continue; // NEW cards are NOT "due" here
    if ((m.due ?? 0) <= t) c++;
  }
  return c;
}
function newCount(items) {
  let c = 0;
  for (const it of items) {
    if (!state.prog.meta[it.id]) c++;
  }
  return c;
}

// ---------- filters ----------
function fillSelect(sel, values, current) {
  if (!sel) return;
  sel.innerHTML = "";
  for (const v of values) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v === "all" ? "Alle" : v;
    sel.appendChild(opt);
  }
  sel.value = values.includes(current) ? current : "all";
}

function buildFilters() {
  state.topics = uniq(state.all.map((x) => x.topic)).sort((a, b) =>
    a.localeCompare(b),
  );
  state.levels = uniq(state.all.map((x) => x.stufe || x.level || "A1")).sort((a, b) =>
    a.localeCompare(b),
  );

  fillSelect(els.topic, ["all", ...state.topics], state.settings.topic);
  fillSelect(els.level, ["all", ...state.levels], state.settings.level);
}

function applyFilter() {
  const topic = state.settings.topic;
  const level = state.settings.level;
  const starFilter = state.settings.starFilter || "all";

  state.filtered = state.all.filter((it) => {
    const okT = topic === "all" || it.topic === topic;
    const itemStufe = it.stufe || it.level || "A1";
    const okL = level === "all" || itemStufe === level;
    const okStar = starFilter !== "starred" || isStarredCard(it.id);
    return okT && okL && okStar;
  });

  if (els.deck) els.deck.textContent = `${state.filtered.length} Karten`;
  const due = dueNowCount(state.filtered);
  const neu = newCount(state.filtered);
  if (els.due) els.due.textContent = fmt(due);
  if (els.neu) els.neu.textContent = fmt(neu);
  if (els.reviewDue) els.reviewDue.textContent = fmt(due);
  if (els.starred) els.starred.textContent = fmt(starredCount(state.filtered));
  renderBoxes();
  updateButtonsEnabled();
  updateDebugPanel();
}

function renderBoxes() {
  if (!els.boxesGrid) return;
  updateBoxFocusUi();

  const counts = Array.from({ length: BOX_COUNT }, () => 0);
  const dueCounts = Array.from({ length: BOX_COUNT }, () => 0);
  const t = now();
  const focusSet = new Set(normalizeBoxFocusList(state.boxFocus));

  for (const it of state.filtered) {
    if (!isUsableCard(it)) continue;

    const m = state.prog.meta[it.id];
    const box = clamp(m?.box ?? 1, 1, BOX_COUNT);

    // total cards "in that box" (NEW treated as Box 1 visually)
    counts[box - 1] += 1;

    // due now: only for cards with progress entry
    if (m && (m.due ?? 0) <= t) dueCounts[box - 1] += 1;
  }

  els.boxesGrid.innerHTML = "";
  for (let i = 1; i <= BOX_COUNT; i++) {
    const div = document.createElement("div");
    const active = focusSet.has(i);
    div.className = `box${active ? " is-active" : ""}`;
    div.setAttribute("role", "button");
    div.setAttribute("tabindex", "0");
    div.setAttribute("aria-pressed", active ? "true" : "false");
    div.innerHTML = `
      <div class="title">Box ${i}</div>
      <div class="sub">Fällig jetzt: <b>${dueCounts[i - 1]}</b></div>
      <div class="count">${counts[i - 1]}</div>
    `;
    const onToggle = () => {
      if (!state.ui.deckReady) {
        info("Deck noch nicht bereit.");
        return;
      }
      toggleBoxFocus(i);
    };
    div.addEventListener("click", onToggle);
    div.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onToggle();
    });
    els.boxesGrid.appendChild(div);
  }
}

// ---------- Leitner queue ----------
function scheduleDue(box) {
  const days = BOX_DAYS[clamp(box, 1, BOX_COUNT) - 1] ?? 0;
  const ms = days * 24 * 60 * 60 * 1000;
  return now() + ms;
}

function buildQueue({ onlyBox = null, focusBoxes = null, dueOnly = false, limit = null, allowTrainingFallback = false } = {}) {
  const t = now();
  const explicitFocus = normalizeBoxFocusList(focusBoxes);
  const boxFilter = onlyBox ? [onlyBox] : explicitFocus;
  const boxFilterSet = boxFilter.length ? new Set(boxFilter) : null;

  const due = [];
  const fresh = [];
  const trainingPool = [];

  for (const it of state.filtered) {
    if (!isUsableCard(it)) continue;

    const m = state.prog.meta[it.id];

    if (!m) {
      if (!boxFilterSet || boxFilterSet.has(1)) fresh.push(it);
      continue;
    }

    const box = clamp(m.box ?? 1, 1, BOX_COUNT);
    if (boxFilterSet && !boxFilterSet.has(box)) continue;

    if ((m.due ?? 0) <= t) {
      due.push({ it, box });
    } else if (allowTrainingFallback) {
      trainingPool.push({ it, box, due: Number(m.due) || 0 });
    }
  }

  // Sort: lowest boxes first (Box 1 before Box 5)
  due.sort((a, b) => a.box - b.box);

  const queue = due.map((x) => x.it);

  // If nothing due:
  // - normal session: add NEW cards
  // - Box 1 session: also add NEW cards (because NEW logically belongs to Box 1)
  const allowNew = !dueOnly && (!boxFilterSet || boxFilterSet.has(1));

  if (queue.length === 0 && allowNew) {
    const limit = boxFilterSet && boxFilterSet.size === 1 && boxFilterSet.has(1) ? NEW_FOR_BOX1 : NEW_PER_SESSION;
    shuffleInPlace(fresh);
    const take = fresh.slice(0, limit);

    for (const it of take) {
      state.prog.meta[it.id] = { box: 1, due: t };
      queue.push(it);
    }
    saveProgress();
  }

  let trainingFallbackUsed = false;
  if (queue.length === 0 && allowTrainingFallback && trainingPool.length > 0) {
    trainingPool.sort((a, b) => {
      if (a.box !== b.box) return a.box - b.box;
      return a.due - b.due;
    });
    queue.push(...trainingPool.map((x) => x.it));
    trainingFallbackUsed = true;
  }

  if (Number.isFinite(limit) && limit > 0 && queue.length > limit) {
    return { queue: queue.slice(0, limit), trainingFallbackUsed };
  }

  return { queue, trainingFallbackUsed };
}

// ---------- modal / session flow ----------
function isAnswerVisible() {
  return !!(els.card && els.card.classList.contains("isFlipped"));
}

function flipToAnswer() {
  if (!els.card) return false;
  if (isAnswerVisible()) return false;
  els.card.classList.add("isFlipped");
  if (els.flip) els.flip.textContent = "Zurück / Back";
  state.session.side = "back";
  return true;
}

function resetCardFlip() {
  if (!els.card) return;
  els.card.classList.remove("isFlipped");
  if (els.flip) els.flip.textContent = "Zeigen / Show";
  state.session.side = "front";
}

function setRatingEnabled(on) {
  const ids = ["btnYes", "btnNo", "btnMnemo", "btnFlip", "btnForgot"];
  for (const id of ids) {
    const b = document.getElementById(id);
    if (b) b.disabled = !on;
  }
}

function setNextVisible(on) {
  if (els.next) els.next.hidden = !on;
}

function openModal() {
  if (!els.modal) return;
  if (state.ui.uiMode === "background") setBackgroundFocusMode(false);
  els.modal.hidden = false;
  hideWordPopup();
  startLearningTimer();
}
function closeModal() {
  stopLearningTimer();
  if (els.modal) els.modal.hidden = true;
  hideWordPopup();
  state.session.awaitingNext = false;
  state.session.gradedCurrent = false;
  setNextVisible(false);
  setRatingEnabled(true);
}

function finishSessionSummary() {
  const s = state.session.stats;
  if (!s) return;
  if (state.session.kind === "review") {
    const summary = `Review fertig: richtig ${s.right}, falsch ${s.wrong}, verschoben ${s.moved}.`;
    updateReviewSummary(summary);
    info(summary);
    debugLog(`review.done right=${s.right} wrong=${s.wrong} moved=${s.moved}`);
  }
}

function nextCard() {
  const q = state.session.queue;
  if (!q || q.length === 0) {
    closeModal();
    finishSessionSummary();
    applyFilter();
    if (state.session.kind !== "review") {
      info("Fertig ✅ (für dieses Deck ist jetzt nichts mehr fällig).");
    }
    return;
  }

  let attempts = 0;
  let it = null;

  while (attempts < 80 && q.length > 0) {
    const candidate = q.shift();
    attempts++;
    if (!candidate) continue;
    if (!isUsableCard(candidate)) continue;
    it = candidate;
    break;
  }

  if (!it) {
    closeModal();
    finishSessionSummary();
    applyFilter();
    info("Keine gültigen Karten");
    return;
  }

  state.session.currentId = it.id;
  state.session.awaitingNext = false;
  state.session.gradedCurrent = false;
  hideWordPopup();

  const m = state.prog.meta[it.id] || { box: 1, due: now() };
  state.prog.meta[it.id] = m;

  if (els.pillMeta) {
    const stufe = it.stufe || it.level || "A1";
    els.pillMeta.textContent = `${it.topic} · Stufe ${stufe}`;
  }
  if (els.pillBox) els.pillBox.textContent = `Box ${m.box}`;

  if (els.front) els.front.textContent = it.de;
  if (els.back) els.back.textContent = it.en;

  renderMnemo(it);
  updateStarButton();
  console.log(`[CARD_NEXT] pair=${PAIR_CODE} id=${it.id} mode=${state.settings.tts || "unset"}`);

  // start with front visible
  resetCardFlip();
  setNextVisible(false);
  setRatingEnabled(true);

  openModal();

  // Optional auto TTS on open (after render)
  triggerAutoSpeak(it);
}

function startSession({ onlyBox = null, focusBoxes = null, kind = "level", dueOnly = false, limit = null } = {}) {
  if (!state.ui.deckReady) {
    info("Deck lädt noch oder ist nicht bereit.");
    return;
  }

  const effectiveFocus = kind === "level"
    ? (onlyBox ? [onlyBox] : normalizeBoxFocusList(focusBoxes || state.boxFocus))
    : normalizeBoxFocusList(focusBoxes);
  const useTrainingFallback = kind === "level" && effectiveFocus.length > 0;
  const built = buildQueue({
    onlyBox,
    focusBoxes: effectiveFocus,
    dueOnly,
    limit,
    allowTrainingFallback: useTrainingFallback,
  });
  const queue = Array.isArray(built) ? built : (built.queue || []);
  const trainingFallbackUsed = !!built?.trainingFallbackUsed;
  state.session.queue = queue;
  state.session.kind = kind;
  state.session.stats = { right: 0, wrong: 0, moved: 0 };

  if (queue.length === 0) {
    if (kind === "review") {
      updateReviewSummary("Keine fälligen Karten für Review.");
      info("Review: keine fälligen Karten.");
    } else {
      if (effectiveFocus.length) {
        info(`In Box ${effectiveFocus.join(", ")} sind keine passenden Karten. Fokus zurücksetzen?`);
      } else {
        info("Keine Karten fällig. (Oder Box ist leer.)");
      }
    }
    return;
  }

  if (kind === "review") {
    updateReviewSummary(`Review läuft: ${queue.length} Karte(n)`);
  }
  if (trainingFallbackUsed) {
    info(`Fokus-Training: ${queue.length} Karte(n) aus Box ${effectiveFocus.join(", ")} (nicht fällige Karten eingeschlossen).`);
  }
  nextCard();
}

function startReviewSession() {
  startSession({ kind: "review", dueOnly: true, limit: REVIEW_LIMIT });
}

function grade(known) {
  if (state.session.awaitingNext || state.session.gradedCurrent) return;
  const id = state.session.currentId;
  const it = state.all.find((x) => x.id === id);
  if (!it) return;

  const m = state.prog.meta[id] || { box: 1, due: now() };
  const currentBox = clamp(m.box ?? 1, 1, BOX_COUNT);

  // Reveal answer first if hidden
  const revealedNow = flipToAnswer();
  if (revealedNow || isAnswerVisible()) speakBothSides(it);

  const newBox = known ? clamp(currentBox + 1, 1, BOX_COUNT) : 1;
  if (state.session.stats) {
    if (known) state.session.stats.right += 1;
    else state.session.stats.wrong += 1;
    if (newBox !== currentBox) state.session.stats.moved += 1;
  }
  m.box = newBox;
  m.due = scheduleDue(newBox);
  state.prog.meta[id] = m;
  saveProgress();

  if (els.pillBox) els.pillBox.textContent = `Box ${newBox}`;
  state.session.gradedCurrent = true;
  state.session.awaitingNext = true;
  setRatingEnabled(false);
  setNextVisible(true);
}

function gradeForgotten() {
  if (state.session.awaitingNext || state.session.gradedCurrent) return;
  const id = state.session.currentId;
  const it = state.all.find((x) => x.id === id);
  if (!it) return;

  const m = state.prog.meta[id] || { box: 1, due: now() };
  const currentBox = clamp(m.box ?? 1, 1, BOX_COUNT);

  const revealedNow = flipToAnswer();
  if (revealedNow || isAnswerVisible()) speakBothSides(it);

  const newBox = clamp(currentBox - 1, 1, BOX_COUNT);
  if (state.session.stats) {
    state.session.stats.wrong += 1;
    if (newBox !== currentBox) state.session.stats.moved += 1;
  }

  m.box = newBox;
  m.due = Math.min(scheduleDue(newBox), now() + 5 * 60 * 1000);
  state.prog.meta[id] = m;
  saveProgress();

  if (els.pillBox) els.pillBox.textContent = `Box ${newBox}`;
  state.session.gradedCurrent = true;
  state.session.awaitingNext = true;
  setRatingEnabled(false);
  setNextVisible(true);
}

function onFlip() {
  if (!els.card) return;
  hideWordPopup();
  const flipped = els.card.classList.toggle("isFlipped");
  if (els.flip) els.flip.textContent = flipped ? "Zurück / Back" : "Zeigen / Show";
  state.session.side = flipped ? "back" : "front";

  const id = state.session.currentId;
  const it = state.all.find((x) => x.id === id);
  if (!it) return;

  const mode = state.settings.tts || "off";
  if (mode !== "off") {
    speakVisibleCard(it, { allowOpposite: mode === "both" });
  }
}

function resetAll() {
  if (!confirm("Lerndaten wirklich löschen? / Really reset learning data?")) return;
  state.prog = { meta: {}, stars: {} };
  saveProgress();
  applyFilter();
  info("Lerndaten zurückgesetzt / Learning data reset.");
}

function onNextCard() {
  if (!state.session.awaitingNext) return;
  state.session.awaitingNext = false;
  state.session.gradedCurrent = false;
  setNextVisible(false);
  setRatingEnabled(true);
  nextCard();
}

// ---------- settings: hash + localStorage ----------
function parseHashSettings() {
  const h = (location.hash || "").replace(/^#/, "");
  if (!h) return;
  const p = new URLSearchParams(h);

  const topic = p.get("topic");
  const level = p.get("level");
  const tts = p.get("tts");
  const speed = p.get("speed");

  if (topic) state.settings.topic = topic;
  if (level) state.settings.level = level;
  if (tts) state.settings.tts = tts;
  if (speed) state.settings.speed = Number(speed);
}

function syncControls() {
  if (els.topic) els.topic.value = state.settings.topic;
  if (els.level) els.level.value = state.settings.level;
  if (els.starFilter) els.starFilter.value = state.settings.starFilter || "all";
  if (els.tts) els.tts.value = state.settings.tts;

  if (els.speed) els.speed.value = String(state.settings.speed);
  if (els.speedLbl)
    els.speedLbl.textContent = `${Number(state.settings.speed).toFixed(2)}×`;
}

function applySpeedPreset(value) {
  const v = clamp(Number(value) || 1, 0.5, 1.5);
  state.settings.speed = v;
  if (els.speed) els.speed.value = String(v);
  if (els.speedLbl) els.speedLbl.textContent = `${v.toFixed(2)}×`;
  saveSettings();
  writeHash();
}

function writeHash() {
  const p = new URLSearchParams();
  p.set("topic", state.settings.topic);
  p.set("level", state.settings.level);
  p.set("tts", state.settings.tts);
  p.set("speed", String(state.settings.speed));
  location.hash = p.toString();
}

function clampSettingsToData() {
  const okTopics = new Set(["all", ...state.topics]);
  const okLevels = new Set(["all", ...state.levels]);

  if (!okTopics.has(state.settings.topic)) state.settings.topic = "all";
  if (!okLevels.has(state.settings.level)) state.settings.level = "all";
  if (!["all", "starred"].includes(state.settings.starFilter)) state.settings.starFilter = "all";

  if (state.settings.tts === "en" && TARGET_TTS_CODE !== "en") {
    state.settings.tts = TARGET_TTS_CODE;
  }
  const okTts = new Set(["off", "de", TARGET_TTS_CODE, "both"]);
  if (!okTts.has(state.settings.tts)) state.settings.tts = "off";

  const sp = Number(state.settings.speed);
  state.settings.speed = Number.isFinite(sp) ? clamp(sp, 0.5, 1.5) : 0.9;
}

// ---------- TTS ----------
let speechUnlocked = false;
function unlockSpeech(reason = "") {
  if (!("speechSynthesis" in window)) return false;
  try {
    if (typeof speechSynthesis.resume === "function") speechSynthesis.resume();
    speechSynthesis.cancel();
  } catch (_) {}

  const voices = (speechSynthesis.getVoices && speechSynthesis.getVoices()) || [];
  if (voices.length) speechUnlocked = true;

  if (!speechUnlocked && "onvoiceschanged" in speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => {
      speechUnlocked = true;
      try {
        if (typeof speechSynthesis.resume === "function") speechSynthesis.resume();
      } catch (_) {}
    };
  }

  return speechUnlocked;
}

function pickVoice(lang) {
  const voices = (speechSynthesis.getVoices && speechSynthesis.getVoices()) || [];
  const lc = String(lang || "").toLowerCase();
  const exact = voices.find((v) => (v.lang || "").toLowerCase() === lc);
  if (exact) return exact;
  const prefix = lc.slice(0, 2);
  return voices.find((v) => (v.lang || "").toLowerCase().startsWith(prefix));
}

function speak(text, lang) {
  if (!("speechSynthesis" in window)) return;
  const clean = String(text || "").trim();
  if (!clean) return;

  unlockSpeech("speak");

  const u = new SpeechSynthesisUtterance(clean);
  u.lang = lang;
  u.rate = clamp(Number(state.settings.speed) || 0.9, 0.5, 1.5);

  const v = pickVoice(lang);
  if (v) u.voice = v;

  try {
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    if (typeof speechSynthesis.resume === "function") setTimeout(() => speechSynthesis.resume(), 0);
  } catch (_) {}
}

function getVisibleSide() {
  return isAnswerVisible() ? "back" : "front";
}

function getVisibleLangCode() {
  return getVisibleSide() === "back" ? TARGET_TTS_LANG : SOURCE_TTS_LANG;
}

function getVisibleText(it) {
  if (!it) return "";
  return getVisibleSide() === "back" ? it.en : it.de;
}

function autoSpeakCurrentCard(it) {
  const mode = state.settings.tts || "off";
  if (mode === "off") return;
  speakVisibleCard(it, { allowOpposite: mode === "both" });
}

function triggerAutoSpeak(it) {
  autoSpeakCurrentCard(it);
}

function speakBack(it) {
  if (!it) return;
  const txt = it.en || "";
  speak(txt, TARGET_TTS_LANG);
}

function speakBothSides(it, delayMs = 220) {
  speakVisibleCard(it, { allowOpposite: true, delayMs });
}

function speakVisibleCard(it, { allowOpposite = false, delayMs = 220, force = false } = {}) {
  if (!it) return;
  const mode = state.settings.tts || "off";
  if (!force && mode === "off") return;

  const side = getVisibleSide();
  const lang = side === "back" ? TARGET_TTS_LANG : SOURCE_TTS_LANG;
  const text = side === "back" ? it.en : it.de;
  const spokenText = String(text || "").trim();
  if (!spokenText) return;

  console.log(`[TTS] side=${side} visibleLang=${lang} mode=${mode} spokenText=${spokenText}`);
  speak(spokenText, lang);

  if (allowOpposite && mode === "both" && side === "back") {
    const otherSide = "front";
    const otherLang = SOURCE_TTS_LANG;
    const otherText = String(it.de || "").trim();
    if (otherText) {
      setTimeout(() => {
        console.log(`[TTS] side=${otherSide} visibleLang=${otherLang} mode=${mode} spokenText=${otherText}`);
        speak(otherText, otherLang);
      }, delayMs);
    }
  }
}

// ---------- data loading ----------
async function fetchJson(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  let res;
  console.log(`[SprachBox] fetch start url=${url}`);
  try {
    res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
  } catch (e) {
    fetchJson.last = { url, status: "error", error: e?.message || String(e) };
    console.error(`[SprachBox] fetch error url=${url} err=${e?.message || e}`);
    if (e?.name === "AbortError") {
      throw new Error(`Timeout nach ${timeoutMs}ms`);
    }
    throw e;
  } finally {
    clearTimeout(t);
  }
  const statusTxt = `${res.status} ${res.statusText}`;
  fetchJson.last = { url: res.url || url, status: res.status, statusText: res.statusText };
  console.log(`[SprachBox] fetch status url=${res.url || url} status=${statusTxt}`);
  if (!res.ok) throw new Error(statusTxt);
  return await res.json();
}
fetchJson.last = null;

function extractArray(data) {
  // allow either:
  // - [...]
  // - {items:[...]} / {data:[...]} / {cards:[...]}
  // - {levels:{...}} with arrays nested (best-effort)
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const direct = data.items || data.data || data.cards;
    if (Array.isArray(direct)) return direct;

    // If there are nested objects with arrays, flatten best-effort
    const out = [];
    for (const k of Object.keys(data)) {
      const v = data[k];
      if (Array.isArray(v)) out.push(...v);
      else if (v && typeof v === "object") {
        const vv = v.items || v.data || v.cards;
        if (Array.isArray(vv)) out.push(...vv);
      }
    }
    if (out.length) return out;
  }

  return [];
}

async function loadOptionalDecks(urls) {
  const merged = [];
  const used = [];
  for (const url of urls || []) {
    try {
      const data = await fetchJson(url);
      const arr = extractArray(data);
      const norm = arr.map(normalizeItem).filter(isUsableCard);
      if (norm.length) {
        merged.push(...norm);
        used.push(url);
        const meta = fetchJson.last || {};
        console.log(`[SprachBox] fetch extra url=${meta.url || url} status=${meta.status ?? "?"} items=${norm.length}`);
        debugLog(`loader.extra.ok ${url} (${norm.length})`);
      } else {
        debugLog(`loader.extra.empty ${url}`);
      }
    } catch (e) {
      const meta = fetchJson.last || {};
      console.error(`[SprachBox] fetch extra failed url=${meta.url || url} status=${meta.status ?? "?"} err=${e?.message || e}`);
      debugLog(`loader.extra.fail ${url} ${e?.message || e}`);
    }
  }
  return { merged, used };
}

async function tryLoadSharedDeck() {
  if (!window.SprachfuehrerSharedAdapter?.loadPairDeck) {
    console.warn(`[SprachBox] shared adapter missing for ${SHARED_PAIR_LABEL}`);
    return null;
  }
  try {
    const { cards, url, status } =
      (await window.SprachfuehrerSharedAdapter.loadPairDeck(SOURCE_LANG, TARGET_LANG)) || {};
    const normalized = (cards || []).map(normalizeItem).filter(isUsableCard);
    const meta = window.SprachfuehrerSharedAdapter.getLastFetch?.() || {};
    const fetchUrl = url || meta.url || window.SprachfuehrerSharedAdapter.getSharedUrl?.() || "unknown";
    const fetchStatus = status ?? meta.status ?? "unknown";
    console.log(
      `[SprachBox] shared fetch url=${fetchUrl} status=${fetchStatus} cards=${normalized.length}`,
    );
    if (!normalized.length) return null;
    state.ui.loaderStatus = "shared";
    state.ui.loaderTried = [`shared ✓ ${SHARED_PAIR_LABEL} (${normalized.length})`];
    const first3 = normalized.slice(0, 3).map((it) => ({
      id: it.id,
      de: it.de,
      en: it.en,
      topic: it.topic,
      level: it.level,
    }));
    console.log(
      `[SprachBox] source=shared pair=${SHARED_PAIR_LABEL} cards=${normalized.length} tts=${TARGET_TTS_LANG}`,
      first3,
    );
    return {
      normalized,
      used: `shared:${SHARED_PAIR_LABEL}`,
      warning: "",
      tried: state.ui.loaderTried,
    };
  } catch (e) {
    const meta = window.SprachfuehrerSharedAdapter.getLastFetch?.() || {};
    console.error(
      `[SprachBox] shared load failed pair=${SHARED_PAIR_LABEL} url=${meta.url || "unknown"} status=${meta.status ?? "?"} err=${e?.message || e}`,
      e,
    );
    return null;
  }
}

async function loadDeck() {
  const tried = [];
  state.ui.loaderTried = tried;

  // 1) try shared deck
  const shared = await tryLoadSharedDeck();
  if (shared) return shared;
  tried.push("shared ✗");

  // 2) fall back to pair-specific JSON
  let used = null;
  state.ui.loaderStatus = "loading";
  updateDebugPanel();

  for (const url of DATA_URLS) {
    try {
      const data = await fetchJson(url);
      const arr = extractArray(data);
      let normalized = arr.map(normalizeItem).filter(isUsableCard);
      const meta = fetchJson.last || {};
      const logUrl = meta.url || url;
      const status = meta.status ?? "?";
      console.log(`[SprachBox] pair fetch url=${logUrl} status=${status} items=${normalized.length}`);

      if (!normalized.length) {
        const why = `${logUrl} ✗ empty`;
        tried.push(why);
        state.ui.loaderTried = [...tried];
        debugLog(`loader.empty ${why}`);
        continue;
      }

      used = logUrl;
      tried.push(`${logUrl} ✓ (${normalized.length})`);
      state.ui.loaderTried = [...tried];
      debugLog(`loader.ok ${logUrl}`);

      // Optional additive decks (non-fatal)
      if (EXTRA_DATA_URLS.length) {
        const extra = await loadOptionalDecks(EXTRA_DATA_URLS);
        if (extra.merged.length) {
          const byId = new Map();
          for (const it of [...normalized, ...extra.merged]) {
            if (!it || !it.id) continue;
            if (!byId.has(it.id)) byId.set(it.id, it);
          }
          normalized = Array.from(byId.values());
          if (extra.used.length) {
            used = `${used} + ${extra.used.join(" + ")}`;
          }
        }
      }

      normalized = applyDeckTextOverrides(normalized);
      state.ui.loaderStatus = "ok";
      return { normalized, used, warning: "", tried };
    } catch (e) {
      const meta = fetchJson.last || {};
      const why = `${meta.url || url} ✗ ${e?.message || e}`;
      tried.push(why);
      state.ui.loaderTried = [...tried];
      console.error(`[SprachBox] pair fetch failed url=${meta.url || url} status=${meta.status ?? "?"} err=${e?.message || e}`);
      debugLog(`loader.fail ${why}`);
    }
  }

  // 3) final safety: dummy deck
  const fallback = buildDummyDeck();
  const withOverrides = applyDeckTextOverrides(fallback);
  state.ui.loaderStatus = "dummy";
  return {
    normalized: withOverrides,
    used: "Dummy-Deck (Notfall)",
    warning:
      "Kein externes Deck geladen. Notfall-Dummy-Deck (10 Karten) aktiv.",
    tried,
  };
}

// ---------- PWA install ----------
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn =
    document.getElementById("btnInstall") ||
    (typeof els !== "undefined" ? els.install : null);
  if (btn) btn.hidden = false;
});
on(els.install, "click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  try {
    await deferredPrompt.userChoice;
  } catch (_) {}
  deferredPrompt = null;
  if (els.install) els.install.hidden = true;
});
window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  const btn =
    document.getElementById("btnInstall") ||
    (typeof els !== "undefined" ? els.install : null);
  if (btn) btn.hidden = true;
});

async function registerSW() {
  const DEV =
    location.hostname === "127.0.0.1" || location.hostname === "localhost";

  if (DEV && "serviceWorker" in navigator) {
    state.ui.swState = "dev:no-sw";
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      debugLog(`sw.dev.unregistered ${regs.length}`);
    } catch (_) {
      debugLog("sw.dev.unreg.failed");
    }
    updateDebugPanel();
    return;
  }

  if (!("serviceWorker" in navigator)) {
    state.ui.swState = "nicht unterstützt";
    updateDebugPanel();
    return;
  }
  try {
    const reg = await navigator.serviceWorker.register("./sw.js", {
      scope: "./",
    });
    state.ui.swState = reg.active ? "aktiv" : "registriert";
    debugLog("sw.registered");
    updateDebugPanel();

    if (reg.waiting) {
      state.ui.swState = "waiting";
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    reg.addEventListener("updatefound", () => {
      state.ui.swState = "updatefound";
      debugLog("sw.updatefound");
      updateDebugPanel();
      const worker = reg.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        state.ui.swState = `worker:${worker.state}`;
        updateDebugPanel();
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          reg.waiting?.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      state.ui.swState = "controllerchange";
      updateDebugPanel();
    });

    try {
      await reg.update();
      debugLog("sw.update() checked");
    } catch (_) {}
  } catch (e) {
    state.ui.swState = `Fehler: ${e?.message || e}`;
    debugLog(`sw.error ${e?.message || e}`);
    updateDebugPanel();
  }
}

// ---------- init ----------
async function init() {
  await ensureBgRegistry();
  loadSettings();
  loadBgPrefs();
  initBgMode();
  loadBoxFocus();
  loadDeckTextOverrides();
  parseHashSettings();

  loadProgress();
  loadTimeStats();
  loadMnemo();
  loadDailyStatus();
  loadGlossary();
  loadMiniLex();
  loadPhraseMap();
  ensureDefaultPhraseMapSeeds();

  renderDailyTemplates();
  updateDailyStatus();
  setMode("level");
  state.ui.deckReady = false;
  state.ui.deckSource = "";
  updateButtonsEnabled();
  updateReviewSummary("");
  updateDebugPanel();
  if (els.glossarySearch) els.glossarySearch.value = state.glossary.ui.search || "";
  if (els.glossaryType) els.glossaryType.value = state.glossary.ui.type || "all";
  if (els.glossaryLang) els.glossaryLang.value = state.glossary.ui.lang || "all";
  if (els.glossaryGenus) els.glossaryGenus.value = state.glossary.ui.genus || "all";
  if (els.glossarySort) els.glossarySort.value = state.glossary.ui.sort || "newest";
  updateBoxFocusUi();
  renderGlossaryPanel();

  syncControls();
  updateTimeStats();

  info("Lade Daten…");
  clearError();
  debugLog("init.start");

  try {
    const { normalized, used, warning } = await loadDeck();
    state.all = normalized.filter(
      (x) => !isJunkText(x?.de) && !isJunkText(x?.en),
    );
    rebuildWordIndex(state.all);
    state.ui.deckReady = state.all.length > 0;
    state.ui.deckSource = used || "";

    if (els.deck) els.deck.textContent = `${state.all.length} Karten`;
    if (warning) {
      setError(warning);
      info(`App läuft mit Fallback: ${used}`);
    } else {
      clearError();
      showStatus(`Daten ok: ${used}`, !!state.ui.debugOpen);
    }

    buildFilters();
    clampSettingsToData();
    syncControls();
    applyFilter();
    debugLog(`deck.ready ${state.all.length} (${used})`);
  } catch (e) {
    state.all = buildDummyDeck();
    rebuildWordIndex(state.all);
    state.ui.deckReady = true;
    state.ui.deckSource = "Dummy-Deck (Init-Fallback)";
    setError(
      `Datenfehler: ${e?.message || e}. Notfall-Dummy-Deck wurde geladen.`,
    );
    info("Datenfehler abgefangen. Dummy-Deck aktiv.");
    buildFilters();
    clampSettingsToData();
    syncControls();
    applyFilter();
    debugLog(`init.catch fallback ${e?.message || e}`);
  }
  updateButtonsEnabled();
  updateDebugPanel();

  // events: filters
  on(els.topic, "change", () => {
    state.settings.topic = els.topic.value;
    saveSettings();
    writeHash();
    applyFilter();
  });
  on(els.level, "change", () => {
    state.settings.level = els.level.value;
    saveSettings();
    writeHash();
    applyFilter();
  });
  on(els.starFilter, "change", () => {
    state.settings.starFilter = els.starFilter.value;
    saveSettings();
    applyFilter();
  });
  on(els.tts, "change", () => {
    state.settings.tts = els.tts.value;
    saveSettings();
    writeHash();
  });
  on(els.speed, "input", () => {
    state.settings.speed = Number(els.speed.value);
    if (els.speedLbl)
      els.speedLbl.textContent = `${Number(state.settings.speed).toFixed(2)}×`;
    saveSettings();
    writeHash();
  });
  on(els.tempoNormal, "click", () => applySpeedPreset(1.0));
  on(els.tempoSlow, "click", () => applySpeedPreset(0.85));
  on(els.tempoFast, "click", () => applySpeedPreset(1.15));

  // session controls
  on(els.start, "click", () => startSession({ kind: "level" }));
  on(els.reviewStart, "click", startReviewSession);
  on(els.next, "click", onNextCard);
  on(els.boxes, "click", () => {
    if (!state.ui.deckReady) {
      info("Deck noch nicht bereit.");
      return;
    }
    if (els.boxPanel) els.boxPanel.hidden = false;
    renderBoxes();
  });
  on(els.boxFocusReset, "click", () => {
    setBoxFocus([]);
    info("Box-Fokus zurückgesetzt: Alle / Box focus reset: All.");
  });
  on(els.glossaryBtn, "click", () => {
    if (els.glossaryPanel) els.glossaryPanel.hidden = false;
    renderGlossaryPanel();
  });
  on(els.closeBoxes, "click", () => {
    if (els.boxPanel) els.boxPanel.hidden = true;
  });
  on(els.closeGlossary, "click", () => {
    if (els.glossaryPanel) els.glossaryPanel.hidden = true;
    stopGlossaryPractice();
  });

  on(els.reset, "click", (e) => {
    if (e && (e.shiftKey || e.altKey)) {
      resetAll();
      return;
    }
    location.reload();
  });
  on(els.debugBtn, "click", () => {
    state.ui.debugOpen = !state.ui.debugOpen;
    updateDebugPanel();
    if (!state.ui.debugOpen && els.msg && /^Daten ok:/i.test(els.msg.textContent || "")) {
      showStatus(els.msg.textContent, false);
    }
  });
  on(els.pronCheckLoadDeck, "click", loadPronCheckFromFilteredDeck);
  on(els.pronCheckRun, "click", runPronomenCheck);
  on(els.pronCheckFix, "click", runPronomenAutoFix);
  on(els.deNormPreview, "click", previewGermanNormalization);
  on(els.deNormApply, "click", applyGermanNormalization);
  on(els.deNormBackup, "click", createGermanNormalizationBackupOnly);

  // mode tabs
  on(els.modeDaily, "click", () => setMode("daily"));
  on(els.modeLevel, "click", () => setMode("level"));
  on(els.modeReview, "click", () => setMode("review"));

  // daily
  on(els.dailySpeak, "click", speakDailyTemplates);
  on(els.dailyDone, "click", markDailyDone);

  // background thumb
  on(els.bgSelect, "change", (e) => applyBgChoice(e.target.value));
  on(els.bgToggle, "click", () => {
    const preview = !document.body.classList.contains("is-bg-preview");
    document.body.classList.toggle("is-bg-preview", preview);
    updateBgToggleLabel(preview);
  });
  on(els.bgPreviewExit, "click", () => {
    document.body.classList.remove("is-bg-preview");
    updateBgToggleLabel(false);
  });

  on(els.navBack, "click", () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "../../index.html";
  });

  // modal controls
  on(els.close, "click", closeModal);
  if (els.modal) {
    const backdrop = els.modal.querySelector(".studyOverlay-backdrop");
    on(backdrop, "click", closeModal);
  }

  // word lookup popup on card text (selection or click word)
  on(els.front, "mouseup", (e) => queueWordLookup(els.front, "de", e));
  on(els.back, "mouseup", (e) => queueWordLookup(els.back, TARGET_TTS_CODE, e));
  on(els.front, "touchend", (e) => queueWordLookup(els.front, "de", e));
  on(els.back, "touchend", (e) => queueWordLookup(els.back, TARGET_TTS_CODE, e));
  on(els.wordPopupClose, "click", hideWordPopup);
  on(els.wordSpeak, "click", () => {
    if (!els.wordPopup || els.wordPopup.hidden) return;
    const word = String(els.wordPopup.dataset.word || "").trim();
    if (!word) return;
    const lang = els.wordPopup.dataset.lang === TARGET_TTS_CODE ? TARGET_TTS_LANG : SOURCE_TTS_LANG;
    speak(word, lang);
  });
  on(els.wordCorrect, "click", correctCurrentPopupTranslation);
  on(els.wordSavePhrase, "click", saveCurrentPopupPhrase);
  on(els.wordGenusSave, "click", saveCurrentPopupGenus);
  on(els.wordQuickPos, "change", syncWordQuickGenusField);
  on(els.wordQuickSaveBtn, "click", saveCurrentPopupQuickEntry);
  on(els.wordQuickCancelBtn, "click", cancelWordQuickForm);
  on(els.wordQuickTranslation, "keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCurrentPopupQuickEntry();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancelWordQuickForm();
    }
  });
  on(els.wordQuickMore, "keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCurrentPopupQuickEntry();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancelWordQuickForm();
    }
  });
  on(els.wordAdd, "click", () => {
    if (!els.wordPopup || els.wordPopup.hidden) return;
    toggleCurrentPopupGlossary();
  });
  document.addEventListener("pointerdown", (e) => {
    if (!els.wordPopup || els.wordPopup.hidden) return;
    if (els.wordPopup.contains(e.target)) return;
    hideWordPopup();
  });
  window.addEventListener("resize", () => {
    if (!els.wordPopup || els.wordPopup.hidden) return;
    placeWordPopup(lastWordPopupAnchor);
  });

  // glossary controls
  on(els.glossarySearch, "input", () => {
    state.glossary.ui.search = els.glossarySearch.value || "";
    renderGlossaryPanel();
  });
  on(els.glossaryType, "change", () => {
    state.glossary.ui.type = els.glossaryType.value || "all";
    renderGlossaryPanel();
  });
  on(els.glossaryLang, "change", () => {
    state.glossary.ui.lang = els.glossaryLang.value || "all";
    renderGlossaryPanel();
  });
  on(els.glossaryGenus, "change", () => {
    state.glossary.ui.genus = els.glossaryGenus.value || "all";
    renderGlossaryPanel();
  });
  on(els.glossarySort, "change", () => {
    state.glossary.ui.sort = els.glossarySort.value || "newest";
    renderGlossaryPanel();
  });
  on(els.glossaryImportBtn, "click", () => {
    const text = els.glossaryImportText ? els.glossaryImportText.value : "";
    importGlossaryFromText(text);
  });
  on(els.glossaryExportBtn, "click", () => {
    const text = exportGlossaryText();
    if (els.glossaryImportText) {
      els.glossaryImportText.value = text;
      els.glossaryImportText.focus();
      els.glossaryImportText.select();
    }
    setGlossaryImportStatus(`Export: ${getGlossaryEntries().length} Einträge im Feld bereit.`);
    info("Glossar exportiert (Text im Feld aktualisiert).");
  });
  on(els.glossaryImportClearBtn, "click", () => {
    if (els.glossaryImportText) els.glossaryImportText.value = "";
    setGlossaryImportStatus("");
  });
  on(els.glossaryPracticeStart, "click", startGlossaryPractice);
  on(els.glossaryPracticeStop, "click", stopGlossaryPractice);
  on(els.glossaryPracticeShow, "click", glossaryPracticeShow);
  on(els.glossaryPracticeGood, "click", () => glossaryPracticeGrade(true));
  on(els.glossaryPracticeBad, "click", () => glossaryPracticeGrade(false));
  on(els.glossaryPracticeNext, "click", glossaryPracticeNext);
  on(els.glossaryPracticeSpeak, "click", glossaryPracticeSpeak);
  on(els.glossaryList, "click", (e) => {
    const btn = e.target && e.target.closest ? e.target.closest("[data-action][data-key]") : null;
    if (!btn) return;
    const key = btn.dataset.key;
    const entry = state.glossary.items[key];
    if (!entry) return;
    const action = btn.dataset.action;
    if (action === "remove") {
      removeGlossaryEntry(entry.termOriginal, entry.detectedLang);
      renderGlossaryPanel();
      return;
    }
    if (action === "edit") {
      editGlossaryEntryByKey(key);
      return;
    }
    if (action === "speak") {
      speak(glossaryDisplayTerm(entry), entry.detectedLang === "de" ? SOURCE_TTS_LANG : TARGET_TTS_LANG);
    }
  });

  on(els.flip, "click", onFlip);
  on(els.star, "click", () => {
    const id = state.session.currentId;
    if (!id) return;
    const it = state.all.find((x) => x.id === id);
    toggleStarForCard(id);
    const mode = state.settings.tts || "off";
    if (mode !== "off") speakVisibleCard(it, { allowOpposite: mode === "both" });
  });
  on(els.forgot, "click", gradeForgotten);
  on(els.mnemoBtn, "click", editCurrentMnemo);

  on(els.speak, "click", () => {
    const id = state.session.currentId;
    const it = state.all.find((x) => x.id === id);
    if (!it) return;
    speakVisibleCard(it, { allowOpposite: state.settings.tts === "both", force: true });
  });

  on(els.yes, "click", () => grade(true));
  on(els.no, "click", () => grade(false));

  // keyboard
  window.addEventListener("keydown", (e) => {
    if (!els.modal || els.modal.hidden) return;
    if (e.key === "Escape") {
      if (els.wordQuickSaveWrap && !els.wordQuickSaveWrap.hidden) {
        cancelWordQuickForm();
        return;
      }
      if (hideWordPopup()) return;
      closeModal();
      return;
    }
    if (e.key === " ") {
      e.preventDefault();
      onFlip();
    }
    if (e.key === "ArrowLeft") grade(false);
    if (e.key === "ArrowRight") grade(true);
    if (e.key === "Enter") onNextCard();
  });

  // pause timer if tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopLearningTimer();
    } else {
      if (els.modal && !els.modal.hidden) startLearningTimer();
    }
  });

  registerSW();

  setInterval(() => {
    if (state.session.timerRunning && els.modal && !els.modal.hidden) {
      updateTimeStats();
    }
  }, 10000);

  // ensure voices load + unlock TTS after first user gesture
  document.addEventListener("pointerdown", () => unlockSpeech("first-pointer"), { once: true });
  if ("speechSynthesis" in window && !speechUnlocked) {
    unlockSpeech("init");
  }

  debugLog("init.done");
  updateDebugPanel();
}

window.addEventListener("error", (e) => {
  try {
    const msg = "JS Fehler: " + (e.message || e);
    info(msg);
    setError(msg);
    debugLog(msg);
  } catch (_) {}
});
window.addEventListener("unhandledrejection", (e) => {
  try {
    const msg = "JS Promise-Fehler: " + (e.reason?.message || e.reason);
    info(msg);
    setError(msg);
    debugLog(msg);
  } catch (_) {}
});

init().catch((e) => {
  try {
    const msg = `Init-Fehler: ${e?.message || e}`;
    info(msg);
    setError(msg);
    debugLog(msg);
  } catch (_) {}
});
