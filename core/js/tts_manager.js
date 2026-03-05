// ============================================================
// LL TTS Manager – zentrale Steuerung für Sprachausgabe
// ------------------------------------------------------------
// - Einheitliches Profil (Auto/iOS/Android/Desktop) über localStorage
// - Gemeinsame speak/stop-API für alle Apps
// - Korrekte Sprache setzen und Übersprechen vermeiden
// ============================================================

(function () {
  const STORAGE_KEY = "LL_TTS_PROFILE";
  const DEFAULT_PROFILE = "auto";
  const PROFILE_NOTES = {
    auto: "Gerät wird automatisch erkannt.",
    ios: "Für iPhone/iPad: etwas langsamer, stabiler.",
    android: "Für Android/TV: normale Geschwindigkeit, korrekte Sprache.",
    desktop: "Für PC/Laptop: Standardausgabe (meist am besten).",
  };

  const PROFILE_RATES = {
    auto: 1.0,
    ios: 0.92,
    android: 1.0,
    desktop: 1.0,
  };

  const LANG_MAP = {
    de: "de-DE",
    en: "en-US",
    enus: "en-US",
    engb: "en-GB",
    ru: "ru-RU",
    it: "it-IT",
    fr: "fr-FR",
    es: "es-ES",
    tr: "tr-TR",
  };

  let voicesCache = [];
  let voicesReady = false;
  let voicesWaiters = [];
  let profile = loadProfile();

  function loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "ios" || raw === "android" || raw === "desktop") return raw;
    return DEFAULT_PROFILE;
  }

  function saveProfile(value) {
    profile = value;
    localStorage.setItem(STORAGE_KEY, value);
    renderProfileNote();
  }

  function getProfile() {
    return profile;
  }

  function normalizeLang(langCode) {
    if (!langCode) return "en-US";
    const key = langCode.toLowerCase().replace(/[^a-z]/g, "");
    return LANG_MAP[key] || LANG_MAP[langCode] || `${langCode}` || "en-US";
  }

  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    const list = speechSynthesis.getVoices() || [];
    if (Array.isArray(list) && list.length) {
      voicesCache = list;
      voicesReady = true;
      voicesWaiters.forEach((res) => res(list));
      voicesWaiters = [];
    }
  }

  function waitForVoices() {
    if (voicesReady && voicesCache.length) return Promise.resolve(voicesCache);
    return new Promise((resolve) => {
      voicesWaiters.push(resolve);
      setTimeout(() => {
        refreshVoices();
        if (voicesReady && voicesCache.length) resolve(voicesCache);
      }, 150);
      setTimeout(() => {
        if (!voicesReady) {
          voicesReady = true;
          resolve(voicesCache);
        }
      }, 1500);
    });
  }

  function findVoice(locale) {
    if (!voicesCache.length) refreshVoices();
    if (!voicesCache.length) return null;
    const target = (locale || "en-US").toLowerCase();
    const base = target.split("-")[0];

    const exact = voicesCache.find((v) => v.lang && v.lang.toLowerCase() === target);
    if (exact) return exact;
    const byBase = voicesCache.find(
      (v) => v.lang && v.lang.toLowerCase().startsWith(base)
    );
    if (byBase) return byBase;
    return voicesCache.find((v) => v.default) || voicesCache[0] || null;
  }

  async function speak(text, langCode, opts = {}) {
    if (!text || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      return;
    }

    const clean = typeof text === "string" ? text.trim() : "";
    if (!clean) return;

    const locale = normalizeLang(langCode || "en");
    await waitForVoices();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = locale;

    const profileRate = PROFILE_RATES[profile] ?? 1.0;
    const rate = typeof opts.rate === "number" ? opts.rate : 1.0;
    u.rate = rate * profileRate;
    if (typeof opts.pitch === "number") u.pitch = opts.pitch;

    const voice = opts.voice || findVoice(locale);
    if (voice) u.voice = voice;

    try {
      speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    speechSynthesis.speak(u);
  }

  function stop() {
    if (!("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }

  function bindProfileUI() {
    const select = document.getElementById("ttsProfileSelect");
    const note = document.getElementById("ttsProfileNote");
    const info = document.getElementById("ttsProfileInfo");
    if (!select) return;

    select.value = profile;
    renderProfileNote();

    select.addEventListener("change", (e) => {
      const value = e.target.value;
      saveProfile(value);
    });

    const tipText =
      'Optimiert die Sprachausgabe für dein Gerät. Wenn die Stimme komisch klingt: System manuell wählen.';

    if (info) {
      info.setAttribute("title", tipText);
      info.addEventListener("click", () => toggleInfo(note, tipText));
      info.addEventListener("keypress", (evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          toggleInfo(note, tipText);
        }
      });
    }

    function toggleInfo(target, text) {
      if (!target) return;
      const current = target.dataset.tipShown === "1";
      if (current) {
        target.dataset.tipShown = "0";
        target.textContent = PROFILE_NOTES[profile] || "";
      } else {
        target.dataset.tipShown = "1";
        target.textContent = text;
      }
    }

    function renderNote(value) {
      if (!note) return;
      note.dataset.tipShown = "0";
      note.textContent = PROFILE_NOTES[value] || "";
    }

    renderNote(profile);
  }

  function renderProfileNote() {
    const note = document.getElementById("ttsProfileNote");
    if (note) note.textContent = PROFILE_NOTES[profile] || "";
  }

  function init() {
    refreshVoices();
    if (window.speechSynthesis && "onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }
    bindProfileUI();
    renderProfileNote();
  }

  const TTSManager = {
    speak,
    stop,
    getProfile,
    setProfile: saveProfile,
    renderProfileNote,
    normalizeLang,
    waitForVoices,
  };

  window.TTSManager = TTSManager;
  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
