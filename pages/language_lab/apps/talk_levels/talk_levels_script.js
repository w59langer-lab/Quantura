(() => {
  const DB_URL = "./data/topics_bundle.json";
  const INDEX_URL = "./data/topics/index.json";

  const topicSelect = document.getElementById("tlTopicSelect");
  const levelButtonsWrap = document.getElementById("tlLevelButtons");
  const searchInput = document.getElementById("tlSearch");
  const ttsLangSelect = document.getElementById("tlTtsLang");
  const speedSlider = document.getElementById("tlSpeed");
  const speedValue = document.getElementById("tlSpeedValue");
  const playBtn = document.getElementById("tlPlay");
  const playSlowBtn = document.getElementById("tlPlaySlow");
  const playNormalBtn = document.getElementById("tlPlayNormal");
  const playFastBtn = document.getElementById("tlPlayFast");
  const activeLabel = document.getElementById("tlActiveLabel");
  const resultCountEl = document.getElementById("tlResultCount");
  const statusTextEl = document.getElementById("tlStatusText");
  const listEl = document.getElementById("tlList");
  const pronToggle = null;
  const pronMode = null;
  const stopBtn = document.getElementById("tlStopSpeech");

  const LANG_CODES = ["de", "en", "it", "fr", "es", "ru", "tr"];
  const LANG_NAMES = {
    de: "Deutsch",
    en: "English",
    it: "Italiano",
    fr: "Français",
    es: "Español",
    ru: "Русский",
    tr: "Türkisch (TR)",
  };

  const VOICE_PREFS = {
    de: ["de-DE", "de-AT"],
    en: ["en-GB", "en-US"],
    it: ["it-IT"],
    fr: ["fr-FR", "fr-CA"],
    es: ["es-ES", "es-MX"],
    ru: ["ru-RU"],
    tr: ["tr-TR"],
  };

  const KEYWORD_EMOJIS = [
    { keys: ["hotel"], emoji: "🏨" },
    { keys: ["room", "zimmer"], emoji: "🛏️" },
    { keys: ["key", "schluessel", "schlüssel"], emoji: "🔑" },
    { keys: ["wifi", "wlan"], emoji: "📶" },
    { keys: ["breakfast", "fruehstueck", "fruhstuck"], emoji: "🥐☕" },
    { keys: ["menu", "speisekarte"], emoji: "🍽️📖" },
    { keys: ["water", "wasser"], emoji: "💧" },
    { keys: ["coffee", "kaffee"], emoji: "☕" },
    { keys: ["beer", "bier"], emoji: "🍺" },
    { keys: ["bill", "rechnung"], emoji: "🧾" },
    { keys: ["veg", "vegetar"], emoji: "🥦" },
    { keys: ["station", "bahnhof"], emoji: "🚉" },
    { keys: ["train", "zug"], emoji: "🚆" },
    { keys: ["bus"], emoji: "🚌" },
    { keys: ["taxi"], emoji: "🚕📍" },
    { keys: ["ticket", "fahrkarte", "tix"], emoji: "🎫" },
    { keys: ["map", "karte"], emoji: "🗺️" },
    { keys: ["left", "links"], emoji: "⬅️" },
    { keys: ["right", "rechts"], emoji: "➡️" },
    { keys: ["shop", "kaufen"], emoji: "🛍️" },
    { keys: ["price", "preis"], emoji: "🏷️" },
    { keys: ["cash", "bar"], emoji: "💶" },
    { keys: ["card", "karte"], emoji: "💳" },
    { keys: ["receipt", "quittung"], emoji: "🧾" },
    { keys: ["size", "groesse", "größe"], emoji: "📏" },
    { keys: ["sos", "help", "hilfe"], emoji: "🆘" },
    { keys: ["police", "polizei"], emoji: "🚓" },
    { keys: ["doctor", "arzt"], emoji: "🩺" },
    { keys: ["hospital", "krankenhaus"], emoji: "🏥" },
    { keys: ["pharmacy", "apotheke"], emoji: "💊" },
    { keys: ["passport", "pass"], emoji: "🛂" },
    { keys: ["hello", "hallo"], emoji: "👋" },
    { keys: ["danke", "thanks"], emoji: "💛" },
    { keys: ["sorry", "entschuld"], emoji: "🙇" },
  ];

  const TOPIC_EMOJIS = {
    hotel: "🏨🔑📶",
    restaurant: "🍽️📖",
    unterwegs: "🚉🚌",
    einkaufen: "🛍️🏷️",
    notfall: "🆘💊",
    allgemein: "👋",
  };

  const mnemoCache = new Map();
  let dataset = null;
  let ready = false;

  const RATE_MIN = 0.2;
  const RATE_MAX = 1.2;
  const RATE_STEP = 0.05;
  const RATE_STORAGE_KEY = "ttsRate";
  const LEVEL_MIN = 0;
  const LEVEL_MAX = 10;
  const LEVELS = Array.from({ length: LEVEL_MAX - LEVEL_MIN + 1 }, (_, idx) => idx + LEVEL_MIN);
  const CARDS_KEY = "LL_CARDS_V1";

  const state = {
    topic: "all",
    level: "all",
    query: "",
    tts: "de",
    speed: 1,
    showPron: false,
    pronMode: "ipa",
  };

  // DE: Sprecherwahl – Anna/Peter -> weiblicher/männlicher Voice je Sprache, mit moderatem Pitch-Unterschied.
  // RU: Выбор голоса: Анна/Петер -> женский/мужской голос по каждому языку, без сильных искажений.
  // DE: Sprachcodes, die im Sprachführer verwendet werden.
  // RU: Коды языков, которые используются в Sprachführer.
  const LG_LANG_CODES = ["de", "en", "it", "fr", "es", "ru", "tr"];

  // Einheitlicher Stimmenmodus: weiblich automatisch pro Sprache.
  const LG_PERSONA_DEFS = [{ id: "female_auto", label: "Auto (♀)", icon: "♀" }];
  let LG_ACTIVE_PERSONA_ID = "female_auto";
  window.LG_ACTIVE_PERSONA_ID = LG_ACTIVE_PERSONA_ID;

  // Globale Rate vom Tempo-Slider (falls nicht vorhanden, initialisieren):
  if (typeof window.LG_TTS_RATE !== "number") {
    window.LG_TTS_RATE = 1.0; // Standard
  }

  const staticRateControls = [];
  const cardMap = new Map();
  let activeEntry = null;
  let availableLevels = new Set();

  const savedRate = parseFloat(localStorage.getItem(RATE_STORAGE_KEY));
  if (!Number.isNaN(savedRate) && savedRate >= RATE_MIN && savedRate <= RATE_MAX) {
    state.speed = savedRate;
  }
  window.LG_TTS_RATE = state.speed;

  function initPersonaState() {
    const stored = localStorage.getItem("lg-active-persona");
    if (stored !== "female_auto") {
      localStorage.setItem("lg-active-persona", "female_auto");
    }
    LG_ACTIVE_PERSONA_ID = "female_auto";
    window.LG_ACTIVE_PERSONA_ID = LG_ACTIVE_PERSONA_ID;
  }

  function applyFiltersAndRender() {
    syncHash();
    renderList();
  }

  const controlsBar = document.getElementById("controlsBar");
  const voiceDialog = document.getElementById("tlVoiceDialog");
  const voiceDialogLang = document.getElementById("tlVoiceLang");
  const voiceDialogList = document.getElementById("tlVoiceList");
  const voiceDialogClose = document.getElementById("tlVoiceClose");
  const voiceDialogBtn = document.getElementById("tlVoiceTest");

  function updateFixedHeights() {
    const header = document.querySelector("header, .site-header, #header, .header");
    const headerH = header ? Math.round(header.getBoundingClientRect().height) : 64;
    document.documentElement.style.setProperty("--siteHeaderH", `${headerH}px`);
    document.documentElement.style.setProperty("--ll-header-h", `${headerH}px`);
  }

  window.addEventListener("resize", updateFixedHeights);
  document.addEventListener("DOMContentLoaded", updateFixedHeights);
  setTimeout(updateFixedHeights, 50);
  if (window.speechSynthesis && "onvoiceschanged" in window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => {
      if (voiceDialog?.open) {
        renderVoiceList(voiceDialogLang?.value || "de");
      }
    };
  }

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function makeRng(seed) {
    let x = seed % 2147483647;
    if (x <= 0) x += 2147483646;
    return () => (x = (x * 16807) % 2147483647) / 2147483647;
  }

  function generateDoodle(key) {
    const seed = hashString(key || "mnemo");
    const rand = makeRng(seed);
    const colors = ["#9CA3AF", "#6B7280", "#FBBF24", "#34D399", "#60A5FA"];
    const strokes = Array.from({ length: 5 }, () => {
      const x1 = Math.round(rand() * 120 + 10);
      const y1 = Math.round(rand() * 60 + 10);
      const x2 = Math.round(rand() * 120 + 10);
      const y2 = Math.round(rand() * 60 + 10);
      const color = colors[Math.floor(rand() * colors.length)];
      const width = (rand() * 2 + 1).toFixed(1);
      return { x1, y1, x2, y2, color, width };
    });

    const circles = Array.from({ length: 3 }, () => {
      const cx = Math.round(rand() * 120 + 20);
      const cy = Math.round(rand() * 60 + 20);
      const r = Math.round(rand() * 12 + 6);
      const color = colors[Math.floor(rand() * colors.length)];
      return { cx, cy, r, color };
    });

    const pathPoints = Array.from({ length: 6 }, () => {
      const x = Math.round(rand() * 140 + 10);
      const y = Math.round(rand() * 80 + 10);
      return `${x},${y}`;
    }).join(" ");

    return `<svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mnemo">
      <rect x="2" y="2" width="176" height="116" rx="10" ry="10" fill="none" stroke="#E5E7EB" stroke-width="2" />
      ${strokes
        .map(
          (s) =>
            `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" />`
        )
        .join("")}
      ${circles
        .map(
          (c) =>
            `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="none" stroke="${c.color}" stroke-width="2" />`
        )
        .join("")}
      <polyline points="${pathPoints}" fill="none" stroke="#F472B6" stroke-width="2" stroke-linecap="round" />
    </svg>`;
  }

  function mapLangCodeToLocale(code) {
    const lc = (code || "").toLowerCase();
    const pref = VOICE_PREFS[lc]?.[0];
    if (pref) return pref;
    if (!lc) return "en-US";
    if (lc === "es") return "es-ES";
    return `${lc}-${lc.toUpperCase()}`;
  }

  function resolvePronunciation(item, lang, mode) {
    const source = mode === "ru" ? item?.pronRu : item?.pronIpa;
    if (!source || typeof source !== "object" || Array.isArray(source)) return "";
    const raw = typeof source[lang] === "string" ? source[lang] : "";
    return raw.trim();
  }

  function getTextForLang(item, langKey) {
    const raw = typeof item?.[langKey] === "string" ? item[langKey] : "";
    if (raw && raw.trim()) return raw;
    const fallback = typeof item?.en === "string" && item.en.trim() ? item.en : item?.de;
    return typeof fallback === "string" ? fallback || "" : "";
  }

  function loadCards() {
    try {
      return JSON.parse(localStorage.getItem(CARDS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveCards(cards) {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  }

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString(36);
  }

  function makeCardId(meta) {
    const base = `${meta.topicId || "talk"}|${meta.itemIndex ?? ""}|${meta.front || ""}|${meta.back || ""}`;
    return `tl_${hashStr(base)}`;
  }

  function addToCards({ type, lang_front, front, lang_back, back, note, topicId, itemIndex }) {
    const cards = loadCards();
    const id = makeCardId({ topicId, itemIndex, front, back });
    const exists = cards.some((c) => c.id === id);
    if (exists) return { ok: false, reason: "exists" };

    const now = new Date().toISOString();
    const card = {
      id,
      type: type || "sentence",
      lang_front: lang_front || "en",
      front: (front || "").trim(),
      lang_back: lang_back || "de",
      back: (back || "").trim(),
      note: note || "",
      pron_front: "",
      created_at: now,
      updated_at: now,
    };

    if (!card.front || (!card.back && !card.front)) return { ok: false, reason: "empty" };

    cards.unshift(card);
    saveCards(cards);
    return { ok: true, id };
  }

  function isProbablyFemaleVoice(name) {
    if (!name) return false;
    const n = name.toLowerCase();
    return (
      n.includes("female") ||
      n.includes("frau") ||
      n.includes("woman") ||
      n.includes("girl") ||
      n.includes("mujer") ||
      n.includes("chica") ||
      n.includes("anna") ||
      n.includes("hanna") ||
      n.includes("maria") ||
      n.includes("sofia")
    );
  }

  function isProbablyMaleVoice(name) {
    if (!name) return false;
    const n = name.toLowerCase();
    return (
      n.includes("male") ||
      n.includes("mann") ||
      n.includes("man ") ||
      n.includes("hombre") ||
      n.includes("boy") ||
      n.includes("bruno") ||
      n.includes("peter") ||
      n.includes("paul") ||
      n.includes("hans") ||
      n.includes("juan") ||
      n.includes("carlos") ||
      n.includes("miguel")
    );
  }

  const FEMALE_MARKERS = [
    "female",
    "woman",
    "mujer",
    "fem",
    "monica",
    "paulina",
    "helena",
    "carmen",
    "lucia",
    "sofia",
    "isabella",
    "sabina",
  ];
  const MALE_MARKERS = ["male", "man", "jorge", "juan", "miguel", "diego", "carlos", "pedro"];

  function femaleScore(voice) {
    const src = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();
    let score = 0;
    FEMALE_MARKERS.forEach((m) => {
      if (src.includes(m)) score += 2;
    });
    MALE_MARKERS.forEach((m) => {
      if (src.includes(m)) score -= 2;
    });
    return score;
  }

  function selectVoice(lang, preferFemale = true) {
    const voices = speechSynthesis.getVoices() || [];
    const lc = (lang || "").toLowerCase();
    const prefix = lc.split("-")[0] || lc;

    const byLocale = voices.filter((v) => {
      const l = (v.lang || "").toLowerCase();
      return l === lc || l.startsWith(lc);
    });
    const byPrefix = voices.filter((v) => {
      const l = (v.lang || "").toLowerCase();
      return l.startsWith(prefix);
    });
    const candidates = byLocale.length ? byLocale : byPrefix;
    if (!candidates.length) return { voice: null, pitchBoost: 1 };

    // Spanish special: try es-ES then es-MX for best female score
    let pool = candidates;
    if (prefix === "es") {
      const esES = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("es-es"));
      const esMX = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("es-mx"));
      if (esES.length || esMX.length) {
        pool = esES.length ? esES : esMX;
        if (esES.length && esMX.length) pool = [...esES, ...esMX];
      }
    }

    let chosen = null;
    let bestScore = -Infinity;
    pool.forEach((v) => {
      const score = preferFemale ? femaleScore(v) : 0;
      if (score > bestScore) {
        chosen = v;
        bestScore = score;
      } else if (score === bestScore && chosen) {
        // tie-breaker local > default > existing
        if (v.localService && !chosen.localService) {
          chosen = v;
        } else if (!chosen.localService && v.default && !chosen.default) {
          chosen = v;
        }
      }
    });

    let pitchBoost = 1;
    if (prefix === "es" && bestScore < 1) {
      pitchBoost = 1.15; // soften male-ish Spanish voices
    }

    return { voice: chosen, pitchBoost };
  }
  // DE: Wählt eine Stimme je Sprache – bevorzugt lokale oder Default-Stimme.
  // RU: Подбор голоса по языку с приоритетом localService -> default.

  function updatePersonaPanelUI() {
    const panel = document.getElementById("lg-persona-panel");
    if (panel) panel.innerHTML = "";
  }

  function clampRate(val) {
    if (Number.isNaN(val)) return state.speed || 1;
    return Math.min(Math.max(val, RATE_MIN), RATE_MAX);
  }

  function clampLevel(val) {
    if (Number.isNaN(val)) return LEVEL_MIN;
    return Math.min(Math.max(val, LEVEL_MIN), LEVEL_MAX);
  }

  function normalizeLevels(raw) {
    if (raw === null || raw === undefined) return [];
    const values = [];

    const addVal = (v) => {
      const num = clampLevel(parseInt(v, 10));
      if (!Number.isNaN(num)) values.push(num);
    };

    if (typeof raw === "number") {
      addVal(raw);
    } else if (typeof raw === "string") {
      let s = raw.toLowerCase().trim();
      s = s.replace(/[–—]/g, "-");
      s = s.replace(/level/g, "");
      s = s.replace(/\s+/g, "");
      if (s.startsWith("l")) s = s.replace(/^l+/, "");
      if (!s) return [];
      const rangeMatch = s.match(/^(-?\\d+)\\s*-\\s*(-?\\d+)/);
      if (rangeMatch) {
        const a = parseInt(rangeMatch[1], 10);
        const b = parseInt(rangeMatch[2], 10);
        if (!Number.isNaN(a) && !Number.isNaN(b)) {
          const [start, end] = a <= b ? [a, b] : [b, a];
          for (let i = start; i <= end; i++) addVal(i);
        }
      } else {
        const single = parseInt(s, 10);
        if (!Number.isNaN(single)) addVal(single);
      }
    }

    const uniq = Array.from(new Set(values.filter((v) => !Number.isNaN(v))));
    uniq.sort((a, b) => a - b);
    return uniq;
  }

  function prepareEntryLevels(data) {
    availableLevels = new Set(LEVELS);
    (data.topics || []).forEach((topic) => {
      (topic.items || []).forEach((item) => {
        const lvl = clampLevel(
          typeof item.level === "number" ? item.level : parseInt(item.level ?? LEVEL_MIN, 10)
        );
        item.level = Number.isNaN(lvl) ? LEVEL_MIN : lvl;
        item.levels = [item.level];
        item.minLevel = item.level;
        item.maxLevel = item.level;
        item.levelLabel = `L${item.level}`;
        availableLevels.add(item.level);
      });
    });
    if (availableLevels.size === 0) LEVELS.forEach((lvl) => availableLevels.add(lvl));
  }

  function updateRateDisplays() {
    const rateText = `Tempo: ${state.speed.toFixed(2)}×`;
    staticRateControls.forEach(({ input, valueEl }) => {
      if (input) input.value = state.speed;
      if (valueEl) valueEl.textContent = rateText;
    });
  }

  function setSpeed(nextRate, { skipRender = false } = {}) {
    const clamped = clampRate(nextRate);
    state.speed = clamped;
    window.LG_TTS_RATE = clamped;
    localStorage.setItem(RATE_STORAGE_KEY, clamped.toString());
    updateRateDisplays();
    syncHash();
    if (!skipRender) renderList();
  }

  function registerStaticRateControl(inputEl, valueEl) {
    if (!inputEl) return;
    inputEl.min = RATE_MIN;
    inputEl.max = RATE_MAX;
    inputEl.step = RATE_STEP;
    inputEl.addEventListener("input", () => {
      const next = parseFloat(inputEl.value);
      if (Number.isNaN(next)) return;
      setSpeed(next);
    });
    staticRateControls.push({ input: inputEl, valueEl });
  }

  function describeEntry(entry) {
    if (!entry?.item) return "Aktiv: –";
    const topicTitle = entry.topic?.title || "Thema";
    const text = getTextForLang(entry.item, state.tts);
    const short = text && text.length > 80 ? `${text.slice(0, 77)}…` : text;
    return `Aktiv: ${topicTitle}${short ? " · " + short : ""}`;
  }

  function updateActiveDisplay() {
    if (activeLabel) {
      activeLabel.textContent = describeEntry(activeEntry);
    }
    document.querySelectorAll(".tl-item.is-active").forEach((el) => {
      el.classList.remove("is-active");
    });
    if (activeEntry?.item && cardMap.has(activeEntry.item)) {
      const cardEl = cardMap.get(activeEntry.item);
      if (cardEl) cardEl.classList.add("is-active");
    }
  }

  function setActiveEntry(entry) {
    activeEntry = entry;
    updateActiveDisplay();
  }

  const LG_DEFAULT_PERSONA_ID = "female_auto";
  const VOICE_PREF_KEY = "lg-preferred-voice-uri";
  let preferredVoiceURIs = {};
  try {
    const rawPref = localStorage.getItem(VOICE_PREF_KEY);
    if (rawPref) preferredVoiceURIs = JSON.parse(rawPref);
  } catch (e) {
    preferredVoiceURIs = {};
  }

  function speakText(text, langCode) {
    if (!text) return;

    const lang = (langCode || "de").toLowerCase();
    const locale = mapLangCodeToLocale(lang);

    let baseRate = 1.0;
    if (typeof window.LG_TTS_RATE === "number") {
      baseRate = window.LG_TTS_RATE;
    }

    if (window.TTSManager) {
      window.TTSManager.speak(text, locale, { rate: baseRate });
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale;
    utter.rate = baseRate;

    const storedUri = preferredVoiceURIs[lang] || preferredVoiceURIs[locale];
    const available = speechSynthesis.getVoices() || [];
    let voice = null;
    if (storedUri) {
      voice = available.find((v) => v.voiceURI === storedUri);
    }
    if (!voice) {
      const result = selectVoice(locale, true);
      voice = result.voice;
      utter.pitch = result.pitchBoost || 1;
    }
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang || locale;
    }

    try {
      speechSynthesis.cancel();
    } catch (e) {
      // ignorieren
    }
    speechSynthesis.speak(utter);
  }

  function stopSpeech() {
    if (window.TTSManager) {
      window.TTSManager.stop();
      return;
    }
    try {
      speechSynthesis.cancel();
    } catch (e) {
      // ignorieren
    }
  }

  function speakPhraseForLanguage(langCode, text) {
    const normalizedLang = LANG_NAMES[langCode] ? langCode : state.tts;
    state.tts = normalizedLang;
    if (ttsLangSelect) {
      ttsLangSelect.value = normalizedLang;
    }
    speakText(text, normalizedLang);
  }

  function playActive(rateOverride) {
    if (!activeEntry?.item) return;
    if (typeof rateOverride === "number") {
      setSpeed(rateOverride, { skipRender: true });
    }
    speakText(getTextForLang(activeEntry.item, state.tts), state.tts);
  }

  function topicLevelRange(topic) {
    const levels = (topic.items || []).flatMap((it) => it.levels || []);
    if (!levels.length) return { min: LEVEL_MIN, max: LEVEL_MAX };
    return { min: Math.min(...levels), max: Math.max(...levels) };
  }

  function getSelectedTopics() {
    if (!dataset) return [];
    const topics = dataset.topics || [];
    return state.topic === "all" ? topics : topics.filter((t) => t.id === state.topic);
  }

  function countLevelsForTopics(topics) {
    const counts = new Map(LEVELS.map((lvl) => [lvl, 0]));
    (topics || []).forEach((topic) => {
      (topic.items || []).forEach((item) => {
        const levels = item.levels && item.levels.length ? item.levels : [item.level];
        levels.forEach((lvl) => {
          if (counts.has(lvl)) counts.set(lvl, counts.get(lvl) + 1);
        });
      });
    });
    return counts;
  }

  function renderLevelButtons(levelCounts = new Map()) {
    if (!levelButtonsWrap) return;
    levelButtonsWrap.innerHTML = "";

    const makeBtn = (label, value, { isEmpty = false } = {}) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.dataset.level = value;
      btn.className = "level-btn";
      if (state.level === value) btn.classList.add("active");
      if (isEmpty) btn.classList.add("is-empty");
      btn.addEventListener("click", () => {
        state.level = value;
        syncHash();
        renderList();
      });
      return btn;
    };

    levelButtonsWrap.appendChild(
      makeBtn("Alle", "all", { isEmpty: levelCounts.size === 0 || Array.from(levelCounts.values()).every((v) => v === 0) })
    );

    LEVELS.forEach((lvl) => {
      const count = levelCounts.get(lvl) || 0;
      levelButtonsWrap.appendChild(makeBtn(`L${lvl}`, lvl, { isEmpty: count === 0 }));
    });
  }

  function renderTopics(topics) {
    topicSelect.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "Alle Themen";
    topicSelect.appendChild(allOption);
    topics.forEach((topic, idx) => {
      const opt = document.createElement("option");
      opt.value = topic.id;
      const range = topicLevelRange(topic);
      const hasFullRange = range && range.min === LEVEL_MIN && range.max === LEVEL_MAX;
      const rangeText = hasFullRange
        ? " (L0–L10)"
        : range
        ? ` (L${range.min}${range.max !== range.min ? "–" + range.max : ""})`
        : "";
      opt.textContent = `${idx + 1} – ${topic.title}${rangeText}`;
      topicSelect.appendChild(opt);
    });
    topicSelect.value = state.topic;
    if (topicSelect.value !== state.topic) {
      state.topic = topicSelect.value;
    }
  }

  function filterItems() {
    if (!dataset) return [];
    const topics = dataset.topics || [];
    const query = state.query.trim().toLowerCase();
    const levelFilter = state.level;
    const selectedTopics =
      state.topic === "all" ? topics : topics.filter((t) => t.id === state.topic);

    const result = [];
    selectedTopics.forEach((topic) => {
      (topic.items || []).forEach((item) => {
        const levels = item.levels && item.levels.length ? item.levels : [item.level];
        if (levelFilter !== "all" && !levels.includes(levelFilter)) return;
        if (query) {
          const textMatch = LANG_CODES.some((lang) =>
            (item[lang] || "").toLowerCase().includes(query)
          );
          if (!textMatch) return;
        }
        result.push({ topic, item });
      });
    });
    return result;
  }

  function clampMnemoWord(str) {
    if (!str) return "";
    const clean = str.toString().trim().toUpperCase();
    if (!clean) return "";
    return clean.length > 8 ? clean.slice(0, 8) : clean;
  }

  function createLevelBadge(item) {
    const lvl = clampLevel(
      Array.isArray(item.levels)
        ? item.levels[0]
        : typeof item.level === "number"
        ? item.level
        : parseInt(item.level, 10) || LEVEL_MIN
    );
    const span = document.createElement("span");
    span.className = "levelBadge";
    span.textContent = `L${lvl}`;
    return span;
  }

  function getLevelLabel(lvl) {
    const meta = dataset?.meta?.levels;
    if (Array.isArray(meta)) {
      const found = meta.find((entry) => entry.id === lvl || entry.order === lvl);
      if (found?.label) return found.label;
      if (found?.title) return found.title;
    }
    return `L${lvl}`;
  }

  function deriveMnemoWord(item) {
    const existing = clampMnemoWord(item?.mnemoWord);
    if (existing.trim()) return existing.trim();
    const hint = clampMnemoWord(item?.mnemoHint || "");
    if (hint.trim()) return hint.trim();
    const key = clampMnemoWord(item?.mnemoKey || "");
    return key.trim() || "MNEMO";
  }

  function ensureMnemoDefaults(data) {
    (data.topics || []).forEach((topic) => {
      (topic.items || []).forEach((item) => {
        item.mnemoWord = deriveMnemoWord(item);
        if (!item.icon) item.icon = item.icon || "";
      });
    });
  }

  function getMnemoEmoji(item, topicId) {
    const manual = (item.mnemoEmoji || item.icon || "").toString().trim();
    if (manual) return manual;

    const haystack = `${item.mnemoKey || ""} ${item.mnemoHint || ""} ${
      item.mnemoWord || ""
    } ${item.mnemoNote || ""}`.toLowerCase();

    const keywordMatch = KEYWORD_EMOJIS.find((entry) =>
      entry.keys.some((k) => haystack.includes(k))
    );
    if (keywordMatch) return keywordMatch.emoji;

    if (topicId && TOPIC_EMOJIS[topicId]) return TOPIC_EMOJIS[topicId];

    return "💡";
  }

  function createMnemoCard(item, topicId) {
    const card = document.createElement("div");
    card.className = "mnemoCard";

    const emojiEl = document.createElement("div");
    emojiEl.className = "mnemoEmoji";
    emojiEl.textContent = getMnemoEmoji(item, topicId);
    card.appendChild(emojiEl);

    const wordEl = document.createElement("div");
    wordEl.className = "mnemoWord";
    wordEl.textContent = deriveMnemoWord(item);
    card.appendChild(wordEl);

    const hintText = (item.mnemoHint || item.mnemoNote || "").toString().trim();
    if (hintText) {
      const hintEl = document.createElement("div");
      hintEl.className = "mnemoHint";
      hintEl.textContent = hintText;
      card.appendChild(hintEl);
    }

    return card;
  }

  function buildDoodleMnemo(item) {
    const wrapper = document.createElement("div");
    wrapper.className = "tl-mnemo";

    const svgBox = document.createElement("div");
    svgBox.className = "tl-mnemo__svg";
    svgBox.innerHTML = generateDoodle(item.mnemoKey || "mnemo");
    wrapper.appendChild(svgBox);

    const hintText = deriveMnemoWord(item);
    if (hintText) {
      const hintEl = document.createElement("div");
      hintEl.className = "mnemoNote";
      hintEl.textContent = hintText;
      wrapper.appendChild(hintEl);
    }

    const cacheKey = item.mnemoKey || "_fallback";
    if (mnemoCache.has(cacheKey)) {
      const cached = mnemoCache.get(cacheKey);
      if (cached && cached.startsWith("<svg")) {
        svgBox.innerHTML = cached;
      }
      return wrapper;
    }

    const svgUrl = `mnemo/${encodeURIComponent(cacheKey)}.svg`;
    fetch(svgUrl)
      .then((res) => (res.ok ? res.text() : null))
      .then((svg) => {
        if (svg) {
          mnemoCache.set(cacheKey, svg);
          svgBox.innerHTML = svg;
        } else {
          mnemoCache.set(cacheKey, null);
        }
      })
      .catch(() => mnemoCache.set(cacheKey, null));

    return wrapper;
  }

  function buildMnemo(item, topicId) {
    const wrapper = document.createElement("div");
    wrapper.className = "tl-mnemo";
    const preferDoodle = item.mnemoStyle === "doodle";
    const imgFile = (item.mnemoImg || "").toString().trim();

    if (imgFile && !preferDoodle) {
      const img = document.createElement("img");
      img.className = "tl-mnemo__img";
      img.alt = deriveMnemoTitle(item);
      img.loading = "lazy";
      img.src = `mnemo/${imgFile}`;
      const fallbackToCard = () => {
        wrapper.innerHTML = "";
        wrapper.appendChild(createMnemoCard(item, topicId));
      };
      img.addEventListener("error", fallbackToCard, { once: true });
      wrapper.appendChild(img);
      return wrapper;
    }

    if (preferDoodle) {
      return buildDoodleMnemo(item);
    }

    wrapper.appendChild(createMnemoCard(item, topicId));
    return wrapper;
  }

  function renderList() {
    renderLevelButtons(countLevelsForTopics(getSelectedTopics()));
    if (!dataset) {
      listEl.innerHTML = '<div class="tl-empty">Daten werden geladen …</div>';
      resultCountEl.textContent = "0 Einträge";
      return;
    }

    cardMap.clear();
    const items = filterItems();
    resultCountEl.textContent = `${items.length} Einträge`;
    const showPron = false;
    const pronMode = "ipa";

    if (!items.length) {
      const topicTitle =
        state.topic !== "all"
          ? (dataset.topics || []).find((t) => t.id === state.topic)?.title
          : null;
      const topicText = topicTitle ? ` im Thema „${topicTitle}“` : "";
      listEl.innerHTML = `<div class="tl-empty">0 Einträge${topicText ? topicText : ""}.</div>`;
      return;
    }

    listEl.innerHTML = "";
    const existingCards = loadCards();
    items.forEach(({ topic, item }, idx) => {
      const card = document.createElement("article");
      card.className = "tl-item";
      const itemIndex = idx;
      const frontText = getTextForLang(item, "en").trim();
      const backText = (typeof item.de === "string" ? item.de : "").trim();
      const cardId = makeCardId({
        topicId: topic.id,
        itemIndex,
        front: frontText,
        back: backText,
      });
      const alreadySaved = existingCards.some((c) => c.id === cardId);

      const header = document.createElement("div");
      header.className = "phraseHeader";
      header.appendChild(createLevelBadge(item));
      const topicLabel = document.createElement("span");
      topicLabel.className = "phraseTopic";
      topicLabel.textContent = topic.title;
      header.appendChild(topicLabel);
      const levelLabel = document.createElement("span");
      levelLabel.className = "levelLabel";
      levelLabel.textContent = getLevelLabel(
        typeof item.level === "number" ? item.level : parseInt(item.level, 10) || 0
      );
      header.appendChild(levelLabel);
      card.appendChild(header);

      const mnemo = buildMnemo(item, topic.id);
      card.appendChild(mnemo);

      const textGrid = document.createElement("div");
      textGrid.className = "tl-texts";
      LANG_CODES.forEach((lang) => {
        const box = document.createElement("div");
        box.className = "tl-lang";
        const label = document.createElement("strong");
        label.textContent = LANG_NAMES[lang] || lang.toUpperCase();
        const body = document.createElement("p");
        // DE: Jeder Sprachtext bekommt ein klickbares Span mit data-lang, damit wir daran TTS koppeln können.
        // RU: Каждый текст оборачиваем в span с data-lang, чтобы по клику запускать TTS для этого языка.
        const phraseText = getTextForLang(item, lang);
        const phraseSpan = document.createElement("span");
        phraseSpan.className = "lg-tts-phrase";
        phraseSpan.dataset.lang = lang;
        phraseSpan.textContent = phraseText;
        body.appendChild(phraseSpan);
        box.append(label, body);
        textGrid.appendChild(box);
      });
      card.appendChild(textGrid);

      const actions = document.createElement("div");
      actions.className = "tl-actions";

      const saveStar = document.createElement("span");
      saveStar.className = "tl-save-star";
      saveStar.textContent = "⭐";
      saveStar.title = alreadySaved ? "Schon in Karten" : "In Karten speichern";
      if (alreadySaved) saveStar.classList.add("saved");
      saveStar.addEventListener("click", (evt) => {
        evt.stopPropagation();
        const res = addToCards({
          type: "sentence",
          lang_front: "en",
          front: frontText,
          lang_back: "de",
          back: backText,
          note: topic?.title ? `Talk Levels: ${topic.title}` : "",
          topicId: topic.id,
          itemIndex,
        });
        if (res.ok || res.reason === "exists") {
          saveStar.classList.add("saved");
          saveStar.title = res.ok ? "In Karten gespeichert" : "Schon in Karten";
        }
      });
      actions.appendChild(saveStar);

      const meta = document.createElement("div");
      const levelLabelText = getLevelLabel(
        typeof item.level === "number" ? item.level : parseInt(item.level, 10) || LEVEL_MIN
      );
      meta.textContent = `${topic.title} · Level ${levelLabelText}`;
      meta.className = "hint-text";
      actions.appendChild(meta);

      cardMap.set(item, card);
      card.addEventListener("click", () => {
        setActiveEntry({ topic, item });
      });

      card.appendChild(actions);
      listEl.appendChild(card);
    });

    if (!activeEntry || !cardMap.has(activeEntry.item)) {
      const first = items[0];
      if (first) {
        setActiveEntry(first);
      } else {
        setActiveEntry(null);
      }
    } else {
      updateActiveDisplay();
    }

    updateRateDisplays();
  }

  function syncHash() {
    if (!ready) return;
    const params = new URLSearchParams();
    params.set("topic", state.topic);
    params.set("level", state.level);
    params.set("tts", state.tts);
    params.set("speed", state.speed);
    if (state.query.trim()) params.set("query", state.query.trim());
    const hash = params.toString();
    if (hash !== window.location.hash.replace(/^#/, "")) {
      window.location.hash = hash;
    }
  }

  function populateVoiceDialogLangs() {
    if (!voiceDialogLang) return;
    voiceDialogLang.innerHTML = "";
    LANG_CODES.forEach((lang) => {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = `${lang.toUpperCase()}`;
      voiceDialogLang.appendChild(opt);
    });
    voiceDialogLang.value = voiceDialogLang.value || "de";
  }

  function sampleTextForLang(lang) {
    switch (lang) {
      case "de":
        return "Dies ist eine Teststimme.";
      case "en":
        return "This is a voice test.";
      case "es":
        return "Esta es una prueba de voz.";
      case "fr":
        return "Ceci est un test de voix.";
      case "it":
        return "Questo è un test di voce.";
      case "ru":
        return "Это проверка голоса.";
      case "tr":
        return "Bu bir ses testidir.";
      default:
        return "Test.";
    }
  }

  function renderVoiceList(lang) {
    if (!voiceDialogList) return;
    voiceDialogList.innerHTML = "";
    const voices = speechSynthesis.getVoices() || [];
    const lc = (lang || "").toLowerCase();
    const prefix = lc.split("-")[0];
    const matches = voices.filter((v) => {
      const l = (v.lang || "").toLowerCase();
      return l === lc || l.startsWith(prefix);
    });
    if (!matches.length) {
      voiceDialogList.innerHTML = "<div>Keine Stimmen gefunden.</div>";
      return;
    }
    matches.forEach((voice) => {
      const row = document.createElement("div");
      row.className = "voice-row";
      const meta = document.createElement("div");
      meta.className = "voice-row__meta";
      const name = document.createElement("div");
      name.className = "voice-row__name";
      name.textContent = voice.name || voice.voiceURI;
      const langSpan = document.createElement("div");
      langSpan.className = "voice-row__lang";
      langSpan.textContent = voice.lang || "";
      const badges = document.createElement("div");
      badges.className = "voice-row__badges";
      if (voice.localService) {
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = "local";
        badges.appendChild(b);
      }
      if (voice.default) {
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = "default";
        badges.appendChild(b);
      }
      meta.append(name, langSpan, badges);

      const actions = document.createElement("div");
      actions.className = "voice-row__actions";
      const testBtn = document.createElement("button");
      testBtn.type = "button";
      testBtn.textContent = "Test";
      testBtn.addEventListener("click", () => {
        const sample = sampleTextForLang(prefix);
        const lang = voice.lang || mapLangCodeToLocale(prefix);
        if (window.TTSManager) {
          window.TTSManager.speak(sample, lang, { voice });
          return;
        }
        const utter = new SpeechSynthesisUtterance(sample);
        utter.voice = voice;
        utter.lang = lang;
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      });
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.textContent = "Als Standard";
      saveBtn.addEventListener("click", () => {
        preferredVoiceURIs[prefix] = voice.voiceURI;
        localStorage.setItem(VOICE_PREF_KEY, JSON.stringify(preferredVoiceURIs));
        saveBtn.textContent = "Gespeichert";
        setTimeout(() => (saveBtn.textContent = "Als Standard"), 1200);
      });
      actions.append(testBtn, saveBtn);

      row.append(meta, actions);
      voiceDialogList.appendChild(row);
    });
  }

  function applyHash() {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw) return;
    const params = new URLSearchParams(raw);
    const topic = params.get("topic");
    const level = params.get("level");
    const tts = params.get("tts");
    const speed = Number(params.get("speed"));
    const query = params.get("query") || "";

    if (topic) state.topic = topic;
    if (level === "all") {
      state.level = "all";
    } else if (level !== null) {
      const parsed = clampLevel(parseInt(level, 10));
      if (!Number.isNaN(parsed)) state.level = parsed;
    }
    if (tts && LANG_NAMES[tts]) state.tts = tts;
    if (!Number.isNaN(speed) && speed > 0) state.speed = clampRate(speed);
    state.query = query;
  }

  function initEvents() {
    topicSelect.addEventListener("change", () => {
      state.topic = topicSelect.value;
      syncHash();
      renderList();
    });

    searchInput.addEventListener("input", () => {
      state.query = searchInput.value || "";
      syncHash();
      renderList();
    });

    ttsLangSelect.addEventListener("change", () => {
      state.tts = ttsLangSelect.value;
      syncHash();
      renderList();
    });
    registerStaticRateControl(speedSlider, speedValue);

    if (playBtn) {
      playBtn.addEventListener("click", () => playActive());
    }
    if (playSlowBtn) {
      playSlowBtn.addEventListener("click", () => playActive(0.85));
    }
    if (playNormalBtn) {
      playNormalBtn.addEventListener("click", () => playActive(1));
    }
    if (playFastBtn) {
      playFastBtn.addEventListener("click", () => playActive(1.2));
    }
    if (stopBtn) {
      stopBtn.addEventListener("click", stopSpeech);
    }
    if (voiceDialogBtn && voiceDialog) {
      voiceDialogBtn.addEventListener("click", () => {
        if (!voiceDialog.open) {
          populateVoiceDialogLangs();
          voiceDialog.showModal();
          renderVoiceList(voiceDialogLang.value);
        }
      });
    }
    voiceDialogClose?.addEventListener("click", () => voiceDialog.close());
    voiceDialog?.addEventListener("close", () => {
      voiceDialogList.innerHTML = "";
    });
    voiceDialogLang?.addEventListener("change", () => renderVoiceList(voiceDialogLang.value));

    if (listEl) {
      // DE: Direktklick auf Text (Span) startet TTS für genau diese Sprache.
      // RU: Прямой клик по тексту запускает озвучку именно на этом языке.
      listEl.addEventListener("click", (event) => {
        const span = event.target.closest(".lg-tts-phrase");
        if (!span) return;
        const langCode = span.dataset.lang;
        const text = span.textContent.trim();
        if (!langCode || !text) return;
        speakPhraseForLanguage(langCode, text);
      });
    }
  }

  function populateControls() {
    if (!dataset) return;
    renderTopics(dataset.topics || []);
    searchInput.value = state.query;
    ttsLangSelect.value = state.tts;
    updateRateDisplays();
  }

  function setStatus(msg) {
    statusTextEl.textContent = msg;
  }

  function loadFromIndex() {
    return fetch(INDEX_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Index nicht gefunden");
        return res.json();
      })
      .then((idx) => {
        const files = Array.isArray(idx?.files) ? idx.files : [];
        if (!files.length) throw new Error("Index ohne Dateien");
        const promises = files.map((file) =>
          fetch(`./data/topics/${file}`).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
        );
        return Promise.all(promises).then((topics) => ({
          topics,
          meta: { languages: LANG_CODES, source: "index" },
        }));
      });
  }

  function loadDataset() {
    return loadFromIndex().catch(() =>
      fetch(DB_URL).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
    );
  }

  function loadData() {
    setStatus("Lade Daten …");
    loadDataset()
      .then((data) => {
        dataset = data;
        prepareEntryLevels(dataset);
        ensureMnemoDefaults(dataset);
        setStatus("Daten geladen");
        applyHash();
        populateControls();
        ready = true;
        syncHash();
        renderList();
        updateFixedHeights();
      })
      .catch((err) => {
        console.error("talk_levels: Daten konnten nicht geladen werden", err);
        setStatus("Fehler beim Laden der Daten.");
        listEl.innerHTML =
          '<div class="tl-empty">Die Daten-Datei konnte nicht geladen werden. Pfad und JSON prüfen.</div>';
      });
  }

  function init() {
    initPersonaState();
    updatePersonaPanelUI();
    initEvents();
    applyHash();
    populateControls();
    updateRateDisplays();
    renderList();
    updateFixedHeights();
    loadData();
    window.addEventListener("hashchange", () => {
      applyHash();
      populateControls();
      renderList();
    });
  }

  init();
})();
