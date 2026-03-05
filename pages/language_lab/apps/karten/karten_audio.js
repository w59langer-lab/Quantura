const LG_KARTEN_LANG_TO_VOICE = {
  de: "de-DE",
  en: "en-US",
  fr: "fr-FR",
  it: "it-IT",
  ru: "ru-RU",
};

// TTS für Karten – nutzt Web Speech API, liest jeweils die aktuell sichtbare Seite vor
(function () {
  const audioPlayBtn = document.getElementById("cardAudioPlayBtn");
  const audioStopBtn = document.getElementById("cardAudioStopBtn");
  const audioRateSelect = document.getElementById("cardAudioRate");

  const cardFront = document.getElementById("cardFront");
  const cardBack = document.getElementById("cardBack");
  const cardBackSide = document.getElementById("cardBackSide");

  let currentUtterance = null;

  function stopSpeech() {
    if (window.TTSManager) {
      window.TTSManager.stop();
      currentUtterance = null;
      return;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }

  function getCurrentCard() {
    return typeof window.KartenCurrentCard === "function"
      ? window.KartenCurrentCard()
      : null;
  }

  function getVisibleSideText() {
    const frontVisible = typeof window.KartenIsFrontVisible === "function"
      ? window.KartenIsFrontVisible()
      : cardBackSide?.classList.contains("hidden");
    const text = frontVisible ? cardFront?.innerText : cardBack?.innerText;
    return (text || "").trim();
  }

  function speakCurrentCard() {
    const card = getCurrentCard();
    if (!card) return;

    const text = getVisibleSideText();
    if (!text) return;

    stopSpeech();

    const langCode = LG_KARTEN_LANG_TO_VOICE[card.lang] || "en-US";

    let rate = 1;
    if (audioRateSelect) {
      const parsed = parseFloat(audioRateSelect.value);
      if (!Number.isNaN(parsed)) rate = parsed;
    }
    if (window.TTSManager) {
      window.TTSManager.speak(text, langCode, { rate });
      return;
    }
    if (!window.speechSynthesis) {
      console.warn("SpeechSynthesis nicht verfügbar");
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = rate;

    currentUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  if (audioPlayBtn) {
    audioPlayBtn.addEventListener("click", speakCurrentCard);
  }
  if (audioStopBtn) {
    audioStopBtn.addEventListener("click", stopSpeech);
  }

  document.addEventListener("karten:card-changed", stopSpeech);
})();

// ----------------------------------------------------------
// TTS für Level-Modus (nutzt LG_KARTEN_LEVEL_DB, dynamische Sprachpaare)
// ----------------------------------------------------------
(function () {
  const levelSpeakBtn = document.getElementById("levelSpeakBtn");
  const levelStopBtn = document.getElementById("levelStopBtn");
  const levelRateSelect = document.getElementById("levelAudioRate");
  const levelRateSlider = document.getElementById("levelAudioRateSlider");
  const levelRateValue = document.getElementById("levelAudioRateValue");

  let currentUtterance = null;

  function stopLevelSpeech() {
    if (window.TTSManager) {
      window.TTSManager.stop();
      currentUtterance = null;
      return;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }

  function getLevelLangKeyForCurrentSide() {
    const obj = window.LevelCurrentCardForTTS;
    if (!obj) return "en";

    const frontVisible = obj.frontVisible !== false;
    if (frontVisible) {
      return obj.sourceLang || "en";
    } else {
      return obj.targetLang || "en";
    }
  }

  function getLevelVoiceForCurrentSide() {
    const key = getLevelLangKeyForCurrentSide();
    return LG_KARTEN_LANG_TO_VOICE[key] || "en-US";
  }

  function getLevelRate() {
    const sliderVal = levelRateSlider ? parseFloat(levelRateSlider.value) : NaN;
    if (!Number.isNaN(sliderVal)) return sliderVal;
    const selectVal = levelRateSelect ? parseFloat(levelRateSelect.value) : NaN;
    if (!Number.isNaN(selectVal)) return selectVal;
    return 1;
  }

  function updateLevelRateDisplay() {
    if (!levelRateValue || !levelRateSlider) return;
    const val = parseFloat(levelRateSlider.value || "1");
    levelRateValue.textContent = `${val.toFixed(2)}×`;
  }

  function speakLevelCard() {
    const obj = window.LevelCurrentCardForTTS;
    if (!obj || !obj.base) return;

    const frontVisible = obj.frontVisible !== false;
    const langKey = frontVisible ? obj.sourceLang : obj.targetLang;
    const text = obj.base[langKey] || "";
    if (!text) return;

    stopLevelSpeech();

    const langCode = getLevelVoiceForCurrentSide();
    const rate = getLevelRate();

    if (window.TTSManager) {
      window.TTSManager.speak(text, langCode, { rate });
      return;
    }
    if (!window.speechSynthesis) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = rate;
    currentUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  function bindLevelEvents() {
    if (levelRateSelect) {
      levelRateSelect.addEventListener("change", () => {
        if (levelRateSlider) levelRateSlider.value = levelRateSelect.value;
        updateLevelRateDisplay();
      });
    }
    if (levelRateSlider) {
      levelRateSlider.addEventListener("input", updateLevelRateDisplay);
      levelRateSlider.addEventListener("change", updateLevelRateDisplay);
    }
    if (levelSpeakBtn) {
      levelSpeakBtn.addEventListener("click", speakLevelCard);
    }
    if (levelStopBtn) {
      levelStopBtn.addEventListener("click", stopLevelSpeech);
    }

    updateLevelRateDisplay();
  }

  bindLevelEvents();
})();
