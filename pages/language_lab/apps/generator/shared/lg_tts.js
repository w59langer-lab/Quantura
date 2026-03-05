// =========================================================
// DE: LG TTS – Text-to-Speech Modul, Sprache wird automatisch
//     aus dem <html lang="...">-Attribut gewählt.
// EN: LG TTS – text-to-speech module, language is chosen
//     automatically from the <html lang="..."> attribute.
// RU: LG TTS – модуль озвучки, язык автоматически выбирается
//     по атрибуту <html lang="...">.
// =========================================================

const LG_TTS = (function () {
  // -----------------------------------------------------
  // DE: Interne Konfiguration
  // EN: Internal configuration
  // RU: Внутренняя конфигурация
  // -----------------------------------------------------
  let currentRate = 1.0;
  let currentLang = "en-US";
  let voices = [];
  let initialized = false;
  let voiceListenerAttached = false;

  // =========================================================
  // DE: Aktuelle Sprache aus dem <html>-Tag ermitteln
  // EN: Detect current language from the <html> tag
  // RU: Определить текущий язык из тега <html>
  // =========================================================
  function detectLangFromHtml() {
    const html = document.documentElement;
    if (!html) return "en-US";

    const raw = (html.lang || "en").toLowerCase();

    // DE: Nur Hauptcode nehmen (de/en/it/fr/ru/es)
    // EN: Use only base code (de/en/it/fr/ru/es)
    // RU: Берём только базовый код (de/en/it/fr/ru/es)
    switch (raw) {
      case "de":
        return "de-DE";
      case "en":
        return "en-US";
      case "it":
        return "it-IT";
      case "fr":
        return "fr-FR";
      case "ru":
        return "ru-RU";
      case "es":
        return "es-ES";
      default:
        return "en-US";
    }
  }

  // -----------------------------------------------------
  // DE: Stimmen neu laden
  // EN: Refresh available voices
  // RU: Перезагрузить доступные голоса
  // -----------------------------------------------------
  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    const list = window.speechSynthesis.getVoices() || [];
    if (Array.isArray(list) && list.length) {
      voices = list;
    }
  }

  // -----------------------------------------------------
  // DE: Stimmen initialisieren (inkl. voiceschanged)
  // EN: Initialize voices (incl. voiceschanged listener)
  // RU: Инициализировать голоса (включая слушатель voiceschanged)
  // -----------------------------------------------------
  function initVoices() {
    if (initialized) {
      refreshVoices();
      return;
    }
    initialized = true;

    if (!("speechSynthesis" in window)) {
      console.warn("[LG_TTS] speechSynthesis nicht verfügbar / not available");
      return;
    }

    currentLang = detectLangFromHtml();
    refreshVoices();
    const synth = window.speechSynthesis;

    const onVoices = () => {
      refreshVoices();
      currentLang = detectLangFromHtml();
    };

    if (synth && typeof synth.addEventListener === "function" && !voiceListenerAttached) {
      synth.addEventListener("voiceschanged", onVoices);
      voiceListenerAttached = true;
    } else if (synth && !voiceListenerAttached) {
      synth.onvoiceschanged = onVoices;
      voiceListenerAttached = true;
    }
  }

  // -----------------------------------------------------
  // DE: Passende Stimme anhand Sprachcode finden
  // EN: Find suitable voice by language code
  // RU: Найти подходящий голос по коду языка
  // -----------------------------------------------------
  function findVoiceForLang(langCode) {
    if (!voices.length) refreshVoices();
    const target = (langCode || "en-US").toLowerCase();
    const base = target.split("-")[0];

    // 1. Exakte Übereinstimmung z.B. "de-DE"
    // 1. Exact match e.g. "de-DE"
    // 1. Точное совпадение, например "de-DE"
    const exact = voices.find((v) => v.lang && v.lang.toLowerCase() === target);
    if (exact) return exact;

    // 2. Nur Sprach-Basis, z.B. "de", "en"
    // 2. Base language only, e.g. "de", "en"
    // 2. Только базовый код языка, напр. "de", "en"
    const byBase = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(base));
    if (byBase) return byBase;

    const fallbackDefault = voices.find((v) => v.default);
    return fallbackDefault || voices[0] || null;
  }

  // -----------------------------------------------------
  // DE: Sprache setzen
  // EN: Set language
  // RU: Установить язык
  // -----------------------------------------------------
  function setLanguage(langCode) {
    if (typeof langCode === "string" && langCode.trim()) {
      currentLang = langCode;
    }
  }

  // -----------------------------------------------------
  // DE: Sprechgeschwindigkeit setzen
  // EN: Set speaking rate
  // RU: Установить скорость речи
  // -----------------------------------------------------
  function setRate(rate) {
    const numeric = Number(rate);
    if (!Number.isNaN(numeric)) {
      currentRate = Math.min(Math.max(numeric, 0.5), 2.5);
    }
  }

  // -----------------------------------------------------
  // DE: Text sprechen
  // EN: Speak text
  // RU: Озвучить текст
  // -----------------------------------------------------
  function speak(text) {
    const cleanText = typeof text === "string" ? text.trim() : "";
    if (!cleanText) return;
    if (window.TTSManager) {
      window.TTSManager.speak(cleanText, currentLang, { rate: currentRate });
      return;
    }

    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      console.warn("[LG_TTS] speechSynthesis/SpeechSynthesisUtterance fehlt");
      return;
    }

    initVoices();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang;
    utterance.rate = currentRate;

    const voice = findVoiceForLang(currentLang);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }

  // =========================================================
  // DE: Satz in einer anderen Sprache vorlesen
  // EN: Speak sentence in a different language
  // RU: Озвучить предложение на другом языке
  // =========================================================
  function speakInLang(text, langCode) {
    const cleanText = typeof text === "string" ? text.trim() : "";
    if (!cleanText) return;
    const targetLang = typeof langCode === "string" && langCode.trim() ? langCode : currentLang;

    if (window.TTSManager) {
      window.TTSManager.speak(cleanText, targetLang, { rate: currentRate });
      return;
    }

    initVoices();
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = targetLang;

    const voice = findVoiceForLang(targetLang);
    if (voice) {
      utter.voice = voice;
    }

    utter.rate = currentRate;
    window.speechSynthesis.speak(utter);
  }

  // -----------------------------------------------------
  // DE: Ausgabe stoppen
  // EN: Stop speech
  // RU: Остановить озвучку
  // -----------------------------------------------------
  function stop() {
    if (window.TTSManager) {
      window.TTSManager.stop();
      return;
    }
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  }

  // -----------------------------------------------------
  // DE/EN/RU: Rückgabe der öffentlichen Funktionen / return public API
  // -----------------------------------------------------
  return {
    init: initVoices,
    setLanguage,
    setRate,
    speak,
    speakInLang,
    stop,
  };
})();

// -----------------------------------------------------
// DE/EN/RU: Beim Laden der Seite Stimmen initialisieren
// -----------------------------------------------------
window.addEventListener("load", function () {
  LG_TTS.init();
});


/* LL_EXPORT_LG_TTS */
(function(){
  try {
    if (typeof LG_TTS !== "undefined") window.LG_TTS = LG_TTS;
    if (typeof window.LG_TTS === "undefined") {
      console.warn("[LL] LG_TTS still undefined after lg_tts.js load");
    }
  } catch (e) {
    console.error("[LL] LG_TTS export failed:", e);
  }
})();
