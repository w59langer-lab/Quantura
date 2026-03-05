// Leveltrainer – eigene Logik ohne Leitner-Boxen, nutzt LG_KARTEN_LEVEL_DB
// DE/EN/RU Kommentare beibehalten

(function () {
  const inputChips = Array.from(document.querySelectorAll("[data-input-lang]"));
  const outputChips = Array.from(document.querySelectorAll("[data-output-lang]"));
  const levelButtons = Array.from(document.querySelectorAll("[data-level]"));

  const levelCardFrontEl = document.getElementById("levelCardFront");
  const levelCardBackEl = document.getElementById("levelCardBack");
  const levelCardBackSideEl = document.getElementById("levelCardBackSide");

  const levelToggleBtn = document.getElementById("levelToggleBtn");
  const levelNextCardBtn = document.getElementById("levelNextCardBtn");
  const levelPrevCardBtn = document.getElementById("levelPrevCardBtn");
  const levelInfoEl = document.getElementById("levelInfo");
  const levelStatusEl = document.getElementById("levelStatus");
  const levelHeadingEl = document.getElementById("levelHeading");

  // TTS pro Spalte
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

  let currentInputLang = "de";
  let currentOutputLang = "en";
  let currentLevel = 1;
  let currentCard = null;
  let frontVisible = true;
  let currentCandidates = [];
  let history = [];
  let historyIndex = -1;
  let lastContext = null;

  function normalizeLevel(value) {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 10) return parsed;
    return 1;
  }

  function getLevelFromUrl() {
    const params = new URLSearchParams(window.location.search || "");
    let raw = params.get("level");
    if (!raw && window.location.hash && window.location.hash.includes("level=")) {
      const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
      raw = hashParams.get("level");
    }
    return normalizeLevel(raw);
  }

  function setActiveChip(chips, lang) {
    chips.forEach((chip) => chip.classList.toggle("is-active", chip.dataset.inputLang === lang || chip.dataset.outputLang === lang));
  }

  function setFrontVisible(showFront) {
    frontVisible = showFront;
    levelCardBackSideEl?.classList.toggle("hidden", showFront);
    if (levelToggleBtn) {
      levelToggleBtn.textContent = showFront ? "Antwort anzeigen" : "Antwort verbergen";
    }
  }

  function syncLevelButtons(levelVal) {
    const val = String(levelVal || "");
    levelButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.level === val));
  }

  function setCurrentLevel(levelVal) {
    currentLevel = normalizeLevel(levelVal);
    syncLevelButtons(currentLevel);
  }

  function getLevelCandidates() {
    const db = Array.isArray(window.LG_KARTEN_LEVEL_DB) ? window.LG_KARTEN_LEVEL_DB : [];
    return db.filter((card) => {
      if (!card) return false;
      if (currentInputLang === currentOutputLang) return false;
      if (!card[currentInputLang] || !card[currentOutputLang]) return false;
      if (parseInt(card.level, 10) !== currentLevel) return false;
      return true;
    });
  }

  function getContextKey() {
    return `${currentLevel}-${currentInputLang}-${currentOutputLang}`;
  }

  function ensureContext() {
    const key = getContextKey();
    if (key !== lastContext) {
      lastContext = key;
      history = [];
      historyIndex = -1;
    }
  }

  function updateInfo(card, count) {
    const lvlLabel = currentLevel;
    const topicLabel = card?.topic || "—";
    const langPair = `${currentInputLang.toUpperCase()} → ${currentOutputLang.toUpperCase()}`;
    const text = `Sprachpaar: ${langPair} · Karten: ${count}`;
    if (levelHeadingEl) {
      levelHeadingEl.textContent = `Level ${lvlLabel} – Thema: ${topicLabel}`;
    }
    if (levelInfoEl) levelInfoEl.textContent = text;
    if (levelStatusEl) {
      levelStatusEl.textContent =
        card && count
          ? `Karten im Filter: ${count} · Level ${lvlLabel} · Thema ${topicLabel} · ${langPair}`
          : "Keine Karten in der Level-Datenbank für dieses Level und Sprachpaar.";
    }
  }

  function handleLevelChange(value) {
    setCurrentLevel(value);
    loadNewCard();
  }

  function renderCard(card, count) {
    currentCard = card;
    setFrontVisible(true);

    if (!card) {
      if (levelCardFrontEl) {
        levelCardFrontEl.textContent =
          "Keine Karten in der Level-Datenbank für dieses Level und Sprachpaar.";
      }
      if (levelCardBackEl) {
        levelCardBackEl.textContent = "";
      }
      updateInfo(card, count || 0);
      return;
    }

    const frontText = card[currentInputLang] || "";
    const backText = card[currentOutputLang] || "";
    if (levelCardFrontEl) levelCardFrontEl.textContent = frontText;
    if (levelCardBackEl) levelCardBackEl.textContent = backText;
    updateInfo(card, count || 0);
  }

  function loadNewCard() {
    ensureContext();
    currentCandidates = getLevelCandidates();
    if (!currentCandidates.length) {
      renderCard(null, 0);
      return;
    }
    const idx = Math.floor(Math.random() * currentCandidates.length);
    const card = currentCandidates[idx];
    history.push(card);
    historyIndex = history.length - 1;
    renderCard(card, currentCandidates.length);
    stopSpeech();
  }

  function showPreviousCard() {
    ensureContext();
    if (historyIndex <= 0 || !history.length) return;
    historyIndex -= 1;
    const card = history[historyIndex];
    renderCard(card, currentCandidates.length || 0);
    stopSpeech();
  }

  function getRate(side) {
    const slider = side === "input" ? inputRateSlider : outputRateSlider;
    const select = side === "input" ? inputRateSelect : outputRateSelect;
    const sliderVal = slider ? parseFloat(slider.value) : NaN;
    if (!Number.isNaN(sliderVal)) return sliderVal;
    const selectVal = select ? parseFloat(select.value) : NaN;
    if (!Number.isNaN(selectVal)) return selectVal;
    return 1;
  }

  function updateRateDisplay(side) {
    const slider = side === "input" ? inputRateSlider : outputRateSlider;
    const span = side === "input" ? inputRateValue : outputRateValue;
    if (slider && span) {
      const val = parseFloat(slider.value || "1");
      span.textContent = `${val.toFixed(2)}×`;
    }
  }

  function speak(text, lang, rate) {
    const langCode = LANG_TO_VOICE[lang] || lang || "en-US";
    if (window.TTSManager) {
      window.TTSManager.speak(text, langCode, { rate });
      return;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  }

  function stopSpeech() {
    if (window.TTSManager) {
      window.TTSManager.stop();
      return;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

  function speakInput() {
    if (!currentCard) return;
    const text = currentCard[currentInputLang] || "";
    if (!text) return;
    speak(text, currentInputLang, getRate("input"));
  }

  function speakOutput() {
    if (!currentCard) return;
    const text = currentCard[currentOutputLang] || "";
    if (!text) return;
    speak(text, currentOutputLang, getRate("output"));
  }

  function renderCurrentCardWithoutSwitch() {
    if (!currentCard) return;
    renderCard(currentCard, currentCandidates.length || 0);
  }

  function bindLangChips() {
    inputChips.forEach((chip) =>
      chip.addEventListener("click", () => {
        currentInputLang = chip.dataset.inputLang;
        setActiveChip(inputChips, currentInputLang);
        renderCurrentCardWithoutSwitch();
      })
    );
    outputChips.forEach((chip) =>
      chip.addEventListener("click", () => {
        currentOutputLang = chip.dataset.outputLang;
        setActiveChip(outputChips, currentOutputLang);
        renderCurrentCardWithoutSwitch();
      })
    );
  }

  function bindControls() {
    levelToggleBtn?.addEventListener("click", () => {
      setFrontVisible(!frontVisible);
      stopSpeech();
    });
    levelNextCardBtn?.addEventListener("click", loadNewCard);
    levelPrevCardBtn?.addEventListener("click", showPreviousCard);
    levelButtons.forEach((btn) =>
      btn.addEventListener("click", () => handleLevelChange(btn.dataset.level))
    );

    if (inputRateSelect) inputRateSelect.addEventListener("change", () => updateRateDisplay("input"));
    if (inputRateSlider) {
      inputRateSlider.addEventListener("input", () => updateRateDisplay("input"));
      inputRateSlider.addEventListener("change", () => updateRateDisplay("input"));
    }
    if (outputRateSelect) outputRateSelect.addEventListener("change", () => updateRateDisplay("output"));
    if (outputRateSlider) {
      outputRateSlider.addEventListener("input", () => updateRateDisplay("output"));
      outputRateSlider.addEventListener("change", () => updateRateDisplay("output"));
    }

    inputSpeakBtn?.addEventListener("click", speakInput);
    inputStopBtn?.addEventListener("click", stopSpeech);
    outputSpeakBtn?.addEventListener("click", speakOutput);
    outputStopBtn?.addEventListener("click", stopSpeech);
  }

  function initDefaults() {
    setActiveChip(inputChips, currentInputLang);
    setActiveChip(outputChips, currentOutputLang);
    updateRateDisplay("input");
    updateRateDisplay("output");
    setCurrentLevel(getLevelFromUrl());
  }

  function init() {
    initDefaults();
    bindLangChips();
    bindControls();
    loadNewCard();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
