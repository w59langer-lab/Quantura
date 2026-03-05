// =============================================================
// ru_script.js – Генератор предложений (данные /datenbanken/ru)
// DE: Russischer Satzgenerator
// EN: Russian sentence generator
// =============================================================

(() => {
  "use strict";

  const BYT_FUTURE = {
    я: "буду",
    ты: "будешь",
    он: "будет",
    она: "будет",
    оно: "будет",
    мы: "будем",
    вы: "будете",
    они: "будут",
  };

  const PERFECT_PARTICLE = "уже";
  const PERFECT_NOT_YET = "ещё не";

  const NEG_WORD = "не";

  function safeStr(x) {
    return typeof x === "string" ? x : "";
  }

  function capFirst(str) {
    if (!str || !str.length) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function joinParts(...parts) {
    return parts
      .filter((p) => typeof p === "string" ? p.trim() !== "" : !!p)
      .map((p) => (typeof p === "string" ? p.trim() : String(p).trim()))
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  function getLabelFromObject(obj) {
    if (!obj || typeof obj !== "object") return "";
    const primary =
      obj.base || obj.word || obj.form || obj.id || obj.inf || obj.infinitive;
    if (typeof primary === "string" && primary.trim() !== "") {
      return primary.trim();
    }
    const secondary = obj.value || obj.ru || obj.label || obj.text;
    if (typeof secondary === "string" && secondary.trim() !== "") {
      return secondary.trim();
    }
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "string" && obj[key].trim() !== "") {
        return obj[key].trim();
      }
    }
    return "";
  }

  function getVerbInf(v) {
    return (
      safeStr(v?.infinitive) ||
      safeStr(v?.inf) ||
      safeStr(v?.word) ||
      safeStr(v?.base) ||
      safeStr(v?.id)
    );
  }

  function pronounLabel(pron) {
    return safeStr(pron?.form) || safeStr(pron?.base) || safeStr(pron?.id);
  }

  function normalizePersonKey(value) {
    const raw = safeStr(value).trim();
    const lower = raw.toLowerCase();
    switch (lower) {
      case "ich":
      case "ya":
      case "я":
        return "я";
      case "du":
      case "ty":
      case "ты":
        return "ты";
      case "er":
      case "on":
      case "он":
        return "он";
      case "sie":
      case "ona":
      case "она":
        return "она";
      case "es":
      case "ono":
      case "оно":
        return "оно";
      case "wir":
      case "my":
      case "мы":
        return "мы";
      case "ihr":
      case "vy":
      case "вы":
      case "sie_pl":
      case "sie_sie":
      case "sie sie":
        return "вы";
      case "sie":
      case "oni":
      case "они":
        return "они";
      default:
        return raw || "я";
    }
  }

  function pronounToPersonKey(pron) {
    const id = safeStr(pron?.id);
    const form = safeStr(pron?.form);
    return normalizePersonKey(form || id);
  }

  function conjugatePresent(verbObj, personKey) {
    if (!verbObj) return null;
    const forms = verbObj.forms || verbObj.presens || verbObj.praesens;
    const key = normalizePersonKey(personKey || "я");
    if (forms) {
      const variants =
        key === "он" || key === "она" || key === "оно"
          ? ["он", "она", "оно"]
          : [key];
      for (const k of variants) {
        if (safeStr(forms[k])) return forms[k];
      }
      if (safeStr(forms.default)) return forms.default;
    }
    return getVerbInf(verbObj) || null;
  }

  function conjugatePast(verbObj, personKey) {
    const key = normalizePersonKey(personKey || "я");
    if (verbObj?.past) {
      const variants =
        key === "он" || key === "она" || key === "оно"
          ? ["он", "она", "оно"]
          : [key];
      for (const k of variants) {
        if (safeStr(verbObj.past[k])) return verbObj.past[k];
      }
    }
    const inf = getVerbInf(verbObj);
    return inf || "";
  }

  function buildFutureParts(personKey, verbObj) {
    const key = normalizePersonKey(personKey || "я");
    const inf = getVerbInf(verbObj);
    if (!inf) return null;
    const auxForm = BYT_FUTURE[key] || BYT_FUTURE["я"];
    return { auxForm, infinitive: inf };
  }

  function buildSentence({
    type,
    tense,
    pronounLabel: pron,
    personKey,
    verbObj,
    adjLabel,
    advLabel,
    prepLabel,
  }) {
    if (!pron || !verbObj) return "";
    const rest = joinParts(advLabel, adjLabel, prepLabel);
    const key = normalizePersonKey(personKey || "я");
    let sentence = "";

    if (tense === "praeteritum") {
      const past = conjugatePast(verbObj, key);
      if (type === "frage") {
        sentence = joinParts(pron, past, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, NEG_WORD, past, rest) + ".";
      } else {
        sentence = joinParts(pron, past, rest) + ".";
      }
    } else if (tense === "perfekt") {
      const past = conjugatePast(verbObj, key);
      if (!past) return "";
      if (type === "frage") {
        sentence = joinParts(pron, PERFECT_PARTICLE, past, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, PERFECT_NOT_YET, past, rest) + ".";
      } else {
        sentence = joinParts(pron, PERFECT_PARTICLE, past, rest) + ".";
      }
    } else if (tense === "futur1") {
      const fut = buildFutureParts(key, verbObj);
      if (!fut) return "";
      if (type === "frage") {
        sentence = joinParts(pron, fut.auxForm, fut.infinitive, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, NEG_WORD, fut.auxForm, fut.infinitive, rest) + ".";
      } else {
        sentence = joinParts(pron, fut.auxForm, fut.infinitive, rest) + ".";
      }
    } else {
      const pres = conjugatePresent(verbObj, key);
      if (type === "frage") {
        sentence = joinParts(pron, pres, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, NEG_WORD, pres, rest) + ".";
      } else {
        sentence = joinParts(pron, pres, rest) + ".";
      }
    }

    return capFirst(sentence.trim());
  }

  function fillSelect(selectElement, items, getLabelFn, emptyLabel) {
    if (!selectElement) return;
    selectElement.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = emptyLabel || "— выбери —";
    selectElement.appendChild(placeholder);

    const list = Array.isArray(items) ? items : [];
    list.forEach((item, idx) => {
      let label = getLabelFn ? getLabelFn(item) : getLabelFromObject(item);
      if (!label || typeof label !== "string" || label.trim() === "") {
        label =
          item?.base ||
          item?.word ||
          item?.form ||
          item?.id ||
          item?.infinitive ||
          "Элемент " + (idx + 1);
      }
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = String(label).trim();
      selectElement.appendChild(opt);
    });
  }

  // =====================================================
  // DE: Aktuellen Satz aus dem DOM lesen
  // EN: Get current sentence from DOM
  // RU: Получить текущее предложение из DOM
  // =====================================================
  function getCurrentSentenceText() {
    const el =
      document.getElementById("ruSentenceOutput") ||
      document.getElementById("generatedSentence") ||
      document.getElementById("outputSentence") ||
      document.getElementById("sentenceBox");
    return el ? el.textContent || "" : "";
  }

  // =====================================================
  // DE: Übersetzung auf Deutsch aktualisieren
  // EN: Update translation into German
  // RU: Обновить перевод на немецкий
  // =====================================================
  function updateGermanTranslation(sentenceText) {
    const box = document.getElementById("translationDeBox");
    if (!box || typeof LG_TRANSLATE === "undefined") return;
    const result = LG_TRANSLATE.translateToGerman({
      sourceLang: "ru",
      sourceSentence: sentenceText || "",
    });
    const germanText =
      result && typeof result.text === "string" ? result.text.trim() : "";
    box.textContent = germanText || "—";
  }

  // =====================================================
  // DE: TTS-Events initialisieren
  // EN: Initialize TTS events
  // RU: Инициализировать обработчики TTS
  // =====================================================
  function initTtsControls() {
    const slider = document.getElementById("ttsRateSlider");
    const btnSlow = document.getElementById("ttsSlowBtn");
    const btnNormal = document.getElementById("ttsNormalBtn");
    const btnFast = document.getElementById("ttsFastBtn");
    const btnSpeak = document.getElementById("ttsSpeakBtn");
    const btnStop = document.getElementById("ttsStopBtn");

    if (slider) {
      const initial = parseFloat(slider.value);
      if (!Number.isNaN(initial)) {
        LG_TTS.setRate(initial);
      }
      slider.addEventListener("input", function () {
        const rate = parseFloat(slider.value);
        LG_TTS.setRate(rate);
      });
    }

    if (btnSlow) {
      btnSlow.addEventListener("click", function () {
        LG_TTS.setRate(0.7);
        if (slider) slider.value = "0.7";
        LG_TTS.speak(getCurrentSentenceText());
      });
    }

    if (btnNormal) {
      btnNormal.addEventListener("click", function () {
        LG_TTS.setRate(1.0);
        if (slider) slider.value = "1.0";
        LG_TTS.speak(getCurrentSentenceText());
      });
    }

    if (btnFast) {
      btnFast.addEventListener("click", function () {
        LG_TTS.setRate(1.3);
        if (slider) slider.value = "1.3";
        LG_TTS.speak(getCurrentSentenceText());
      });
    }

    if (btnSpeak) {
      btnSpeak.addEventListener("click", function () {
        LG_TTS.speak(getCurrentSentenceText());
      });
    }

    if (btnStop) {
      btnStop.addEventListener("click", function () {
        LG_TTS.stop();
      });
    }
  }

  // =====================================================
  // DE: Event für deutsche Übersetzung (vorlesen)
  // EN: Event for German translation (speak)
  // RU: Обработчик озвучки немецкого перевода
  // =====================================================
  function initGermanTranslationTts() {
    const btn = document.getElementById("translationSpeakDeBtn");
    const box = document.getElementById("translationDeBox");
    if (!btn || !box) return;
    btn.addEventListener("click", function () {
      const text = box.textContent || "";
      if (!text.trim()) return;
      LG_TTS.speakInLang(text, "de-DE");
    });
  }

  function initRuGenerator() {
    const selType = document.getElementById("ruSentenceType");
    const selTense = document.getElementById("ruTense");
    const selPron = document.getElementById("pronounSelect");
    const selVerb = document.getElementById("verbSelect");
    const selAdj = document.getElementById("adjSelect");
    const selAdv = document.getElementById("advSelect");
    const selPrep = document.getElementById("prepSelect");
    const out = document.getElementById("ruSentenceOutput");
    const hint = document.getElementById("ruHintLine");
    const btnGen = document.getElementById("ruGenerateBtn");
    const btnClear = document.getElementById("ruClearBtn");

    // =====================================================
    // DE: Sprache + TTS-Controls setzen
    // EN: Set language + init TTS controls
    // RU: Задать язык и инициализировать TTS-контролы
    // =====================================================
    LG_TTS.setLanguage("ru-RU");
    initTtsControls();
    initGermanTranslationTts();

    const pronouns =
      typeof RU_PRONOUNS !== "undefined" && Array.isArray(RU_PRONOUNS)
        ? RU_PRONOUNS
        : [];
    const verbs =
      typeof RU_VERBS !== "undefined" && Array.isArray(RU_VERBS)
        ? RU_VERBS
        : [];
    const adjectives =
      typeof RU_ADJECTIVES !== "undefined" && Array.isArray(RU_ADJECTIVES)
        ? RU_ADJECTIVES
        : [];
    const adverbs =
      typeof RU_ADVERBS !== "undefined" && Array.isArray(RU_ADVERBS)
        ? RU_ADVERBS
        : [];
    const preps =
      typeof RU_PREPS !== "undefined" && Array.isArray(RU_PREPS)
        ? RU_PREPS
        : [];

    fillSelect(selPron, pronouns, (p) => pronounLabel(p), "— выбери —");
    fillSelect(selVerb, verbs, (v) => getLabelFromObject(v), "— выбери —");
    fillSelect(selAdj, adjectives, (a) => getLabelFromObject(a), "— опционально —");
    fillSelect(selAdv, adverbs, (a) => getLabelFromObject(a), "— опционально —");
    fillSelect(selPrep, preps, (p) => getLabelFromObject(p), "— опционально —");

    if (hint) {
      hint.textContent =
        "Русский генератор: центральные базы (/datenbanken/ru), спряжение и порядок слов – по-русски.";
    }

    if (btnGen) {
      btnGen.addEventListener("click", () => {
        const type = selType?.value || "aussage";
        const tense = selTense?.value || "praesens";
        const pronIndex = selPron && selPron.value ? Number(selPron.value) : -1;
        const verbIndex = selVerb && selVerb.value ? Number(selVerb.value) : -1;

        if (pronIndex < 0 || verbIndex < 0) {
          if (out) out.textContent = "Выбери местоимение и глагол.";
          return;
        }

        const pronObj = pronouns[pronIndex];
        const verbObj = verbs[verbIndex];
        const personKey = pronounToPersonKey(pronObj);
        const pronLabel = pronounLabel(pronObj);

        const adjLabel =
          selAdj && selAdj.value
            ? getLabelFromObject(adjectives[Number(selAdj.value)])
            : "";
        const advLabel =
          selAdv && selAdv.value
            ? getLabelFromObject(adverbs[Number(selAdv.value)])
            : "";
        const prepLabel =
          selPrep && selPrep.value
            ? getLabelFromObject(preps[Number(selPrep.value)])
            : "";

        const sentence = buildSentence({
          type,
          tense,
          pronounLabel: pronLabel,
          personKey,
          verbObj,
          adjLabel,
          advLabel,
          prepLabel,
        });

        if (out) {
          out.textContent =
            sentence || "Предложение не создано – проверь выбор.";
        }
        updateGermanTranslation(sentence);

        if (sentence) {
          LG_TTS.speak(sentence);
        }
      });
    }

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        [selPron, selVerb, selAdj, selAdv, selPrep].forEach((s) => {
          if (s) s.selectedIndex = 0;
        });
        if (out) out.textContent = "Предложение пока не создано.";
        LG_TTS.stop();
        updateGermanTranslation("");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initRuGenerator);
})();
