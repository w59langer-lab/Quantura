// ==========================================================
// DE: Level-Logik für Karten 1–10 (ohne Leitner/Boxen)
// EN: Level logic for cards 1–10 (no Leitner boxes)
// RU: Логика уровней 1–10 (без Лейтнера)
// ==========================================================
(function () {
  const inputButtons = Array.from(document.querySelectorAll("[data-input-lang]"));
  const outputButtons = Array.from(document.querySelectorAll("[data-output-lang]"));
  const levelSelect = document.getElementById("levelDifficulty");

  const cardFrontEl = document.getElementById("levelCardFront");
  const cardBackEl = document.getElementById("levelCardBack");
  const cardBackSideEl = document.getElementById("levelCardBackSide");

  const newCardBtn = document.getElementById("levelNewCardBtn");
  const toggleBtn = document.getElementById("levelToggleBtn");
  const infoEl = document.getElementById("levelInfo");
  const statusEl = document.getElementById("levelStatus");

  const inputSpeakBtn = document.getElementById("levelInputSpeakBtn");
  const inputStopBtn = document.getElementById("levelInputStopBtn");
  const inputRateSelect = document.getElementById("levelInputRate");
  const inputRateSlider = document.getElementById("levelInputRateSlider");
  const inputRateValue = document.getElementById("levelInputRateValue");

  const outputSpeakBtn = document.getElementById("levelOutputSpeakBtn");
  const outputStopBtn = document.getElementById("levelOutputStopBtn");
  const outputRateSelect = document.getElementById("levelOutputRate");
  const outputRateSlider = document.getElementById("levelOutputRateSlider");
  const outputRateValue = document.getElementById("levelOutputRateValue");

  const LANG_TO_VOICE = {
    de: "de-DE",
    en: "en-US",
    it: "it-IT",
    fr: "fr-FR",
    ru: "ru-RU",
    es: "es-ES",
  };

  let sourceLang = "de";
  let targetLang = "en";
  let currentCard = null;
  let frontVisible = true;
  let currentUtterance = null;

  function setActiveButton(buttons, langKey) {
    buttons.forEach((btn) => {
      const key = btn.dataset.inputLang || btn.dataset.outputLang;
      btn.classList.toggle("is-active", key === langKey);
    });
  }

  function readInitialLangs() {
    const inputActive = inputButtons.find((b) => b.classList.contains("is-active"));
    const outputActive = outputButtons.find((b) => b.classList.contains("is-active"));
    sourceLang = inputActive?.dataset.inputLang || "de";
    targetLang = outputActive?.dataset.outputLang || "en";
  }

  function filterCandidates() {
    const lvlVal = levelSelect ? levelSelect.value : "all";
    const levelNumber = lvlVal === "all" ? null : parseInt(lvlVal, 10);
    return (window.LG_KARTEN_LEVEL_DB || []).filter((entry) => {
      if (!entry) return false;
      if (sourceLang === targetLang) return false;
      if (!entry[sourceLang] || !entry[targetLang]) return false;
      if (levelNumber !== null && parseInt(entry.level, 10) !== levelNumber) return false;
      return true;
    });
  }

  function pickRandomCard() {
    const candidates = filterCandidates();
    if (!candidates.length) return null;
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  }

  function setFrontVisible(showFront) {
    frontVisible = showFront;
    cardBackSideEl?.classList.toggle("hidden", showFront);
    if (toggleBtn) {
      toggleBtn.textContent = showFront ? "Antwort anzeigen" : "Frage anzeigen";
    }
    if (window.LevelCurrentCardForTTS) {
      window.LevelCurrentCardForTTS.frontVisible = frontVisible;
    }
  }

  function renderCard(card) {
    currentCard = card;
    if (!card || sourceLang === targetLang) {
      const noCardText =
        "DE: Keine Karten für diese Auswahl.\n" +
        "EN: No cards for this selection.\n" +
        "RU: Нет карточек для этого набора.";
      cardFrontEl && (cardFrontEl.textContent = noCardText);
      cardBackEl && (cardBackEl.textContent = "");
      setFrontVisible(true);
      updateInfo(0);
      window.LevelCurrentCardForTTS = null;
      return;
    }

    cardFrontEl && (cardFrontEl.textContent = card[sourceLang] || "");
    cardBackEl && (cardBackEl.textContent = card[targetLang] || "");
    setFrontVisible(true);
    updateInfo();

    window.LevelCurrentCardForTTS = {
      base: card,
      sourceLang,
      targetLang,
      frontVisible,
    };
  }

  function updateInfo(candidateCount) {
    const levelLabel = levelSelect ? levelSelect.value : "all";
    const levelText = levelLabel === "all" ? "Alle" : levelLabel;
    const baseInfo = `Level: ${levelText} | Sprachpaar: ${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()}`;
    const extra = candidateCount ? ` | Karten im Filter: ${candidateCount}` : "";
    infoEl && (infoEl.textContent = baseInfo + extra);
    statusEl && (statusEl.textContent = baseInfo + extra);
  }

  function loadNewCard() {
    const candidates = filterCandidates();
    const card = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
    renderCard(card);
  }

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

  function findVoice(langCode) {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    const target = (LANG_TO_VOICE[langCode] || langCode || "en").toLowerCase();
    return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(target)) || voices[0] || null;
  }

  function getRate(selectEl, sliderEl) {
    const sliderVal = sliderEl ? parseFloat(sliderEl.value) : NaN;
    if (!Number.isNaN(sliderVal)) return sliderVal;
    const selectVal = selectEl ? parseFloat(selectEl.value) : NaN;
    if (!Number.isNaN(selectVal)) return selectVal;
    return 1;
  }

  function speakText(text, langCode, rate) {
    if (!text) return;
    const locale = LANG_TO_VOICE[langCode] || langCode || "en-US";
    if (window.TTSManager) {
      window.TTSManager.speak(text, locale, { rate });
      return;
    }
    if (!window.speechSynthesis) return;
    stopSpeech();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale;
    const voice = findVoice(langCode);
    if (voice) utter.voice = voice;
    utter.rate = rate;
    currentUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  function speakInput() {
    if (!currentCard) return;
    speakText(currentCard[sourceLang], sourceLang, getRate(inputRateSelect, inputRateSlider));
  }

  function speakOutput() {
    if (!currentCard) return;
    speakText(currentCard[targetLang], targetLang, getRate(outputRateSelect, outputRateSlider));
  }

  function updateRateLabel(sliderEl, valueEl) {
    if (!sliderEl || !valueEl) return;
    const val = parseFloat(sliderEl.value || "1");
    valueEl.textContent = `${val.toFixed(2)}×`;
  }

  function bindLangButtons() {
    inputButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.inputLang;
        if (!lang) return;
        sourceLang = lang;
        setActiveButton(inputButtons, lang);
        loadNewCard();
      });
    });
    outputButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.outputLang;
        if (!lang) return;
        targetLang = lang;
        setActiveButton(outputButtons, lang);
        loadNewCard();
      });
    });
  }

  function bindEvents() {
    newCardBtn?.addEventListener("click", loadNewCard);
    toggleBtn?.addEventListener("click", () => {
      if (!currentCard) return;
      setFrontVisible(!frontVisible);
      stopSpeech();
    });
    levelSelect?.addEventListener("change", loadNewCard);

    inputSpeakBtn?.addEventListener("click", speakInput);
    inputStopBtn?.addEventListener("click", stopSpeech);
    outputSpeakBtn?.addEventListener("click", speakOutput);
    outputStopBtn?.addEventListener("click", stopSpeech);

    inputRateSlider?.addEventListener("input", () => updateRateLabel(inputRateSlider, inputRateValue));
    inputRateSlider?.addEventListener("change", () => updateRateLabel(inputRateSlider, inputRateValue));
    outputRateSlider?.addEventListener("input", () => updateRateLabel(outputRateSlider, outputRateValue));
    outputRateSlider?.addEventListener("change", () => updateRateLabel(outputRateSlider, outputRateValue));
    inputRateSelect?.addEventListener("change", () => {
      if (inputRateSlider) inputRateSlider.value = inputRateSelect.value;
      updateRateLabel(inputRateSlider, inputRateValue);
    });
    outputRateSelect?.addEventListener("change", () => {
      if (outputRateSlider) outputRateSlider.value = outputRateSelect.value;
      updateRateLabel(outputRateSlider, outputRateValue);
    });
  }

  function init() {
    if (!cardFrontEl || !cardBackEl) return;
    readInitialLangs();
    setActiveButton(inputButtons, sourceLang);
    setActiveButton(outputButtons, targetLang);
    bindLangButtons();
    bindEvents();
    updateRateLabel(inputRateSlider, inputRateValue);
    updateRateLabel(outputRateSlider, outputRateValue);
    loadNewCard();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
