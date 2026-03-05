// =============================================================
// fr_script.js – Générateur de phrases (données /datenbanken/fr)
// DE: Französischer Satzgenerator
// EN: French sentence generator
// RU: Французский генератор предложений
// =============================================================

(() => {
  "use strict";

  const AVOIR_FORMS = {
    ich: "ai",
    du: "as",
    er: "a",
    sie: "a",
    es: "a",
    wir: "avons",
    ihr: "avez",
    sie_pl: "ont",
    sie: "ont",
    Sie: "avez",
    sie_Sie: "ont",
  };

  const ETRE_FORMS = {
    ich: "suis",
    du: "es",
    er: "est",
    sie: "est",
    es: "est",
    wir: "sommes",
    ihr: "êtes",
    sie_pl: "sont",
    sie: "sont",
    Sie: "êtes",
    sie_Sie: "sont",
  };

  const ALLER_FORMS = {
    ich: "vais",
    du: "vas",
    er: "va",
    sie: "va",
    es: "va",
    wir: "allons",
    ihr: "allez",
    sie_pl: "vont",
    sie: "vont",
    Sie: "allez",
    sie_Sie: "vont",
  };

  const NEG_MAIN = "ne";
  const NEG_TAIL = "pas";

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
    const secondary = obj.value || obj.fr || obj.label || obj.text;
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

  function pronounToPersonKey(pron) {
    const id = safeStr(pron?.id);
    const form = safeStr(pron?.form);
    const number = safeStr(pron?.number);
    const value = id || form;

    if (number === "pl" || id === "sie_pl") return "sie";
    if (id === "Sie_formal" || form === "Sie") return "sie";
    if (value === "er" || value === "sie" || value === "es") return "er";
    if (value === "er_sie_es") return "er";
    return value || "ich";
  }

  function conjugatePresent(verbObj, personKey) {
    if (!verbObj) return null;
    const forms = verbObj.forms || verbObj.presens || verbObj.praesens;
    const key = personKey || "ich";
    if (forms) {
      const f =
        forms[key] || forms[key.replace(/_[^_]+$/, "")] || forms.default || "";
      if (safeStr(f)) return f;
    }
    return getVerbInf(verbObj) || null;
  }

  function conjugatePast(verbObj, personKey) {
    const key = personKey || "ich";
    if (verbObj?.past && safeStr(verbObj.past[key])) return verbObj.past[key];
    const inf = getVerbInf(verbObj);
    return inf || "";
  }

  function buildPerfectParts(personKey, verbObj) {
    if (!verbObj) return null;
    const key = personKey || "ich";
    const useEtre = !!verbObj.usesEtre || verbObj.perfektAux === "etre";
    const auxForm = useEtre ? ETRE_FORMS[key] || "suis" : AVOIR_FORMS[key] || "ai";
    const part =
      safeStr(verbObj.participle) ||
      safeStr(verbObj.partizip) ||
      safeStr(verbObj.partizip2) ||
      getVerbInf(verbObj);
    if (!part) return null;
    return { auxForm, participle: part };
  }

  function buildFutureParts(personKey, verbObj) {
    const key = personKey || "ich";
    const inf = getVerbInf(verbObj);
    if (!inf) return null;
    const auxForm = ALLER_FORMS[key] || "vais";
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
    const key = personKey || "ich";
    let sentence = "";

    if (tense === "praeteritum") {
      const past = conjugatePast(verbObj, key);
      if (type === "frage") {
        sentence = joinParts(past, pron, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, NEG_MAIN, past, NEG_TAIL, rest) + ".";
      } else {
        sentence = joinParts(pron, past, rest) + ".";
      }
    } else if (tense === "perfekt") {
      const perf = buildPerfectParts(key, verbObj);
      if (!perf) return "";
      if (type === "frage") {
        sentence = joinParts(perf.auxForm, pron, rest, perf.participle) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, NEG_MAIN, perf.auxForm, NEG_TAIL, rest, perf.participle) + ".";
      } else {
        sentence = joinParts(pron, perf.auxForm, rest, perf.participle) + ".";
      }
    } else if (tense === "futur1") {
      const fut = buildFutureParts(key, verbObj);
      if (!fut) return "";
      if (type === "frage") {
        sentence = joinParts(fut.auxForm, pron, rest, fut.infinitive) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, NEG_MAIN, fut.auxForm, NEG_TAIL, rest, fut.infinitive) + ".";
      } else {
        sentence = joinParts(pron, fut.auxForm, rest, fut.infinitive) + ".";
      }
    } else {
      const pres = conjugatePresent(verbObj, key);
      if (type === "frage") {
        sentence = joinParts(pres, pron, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pron, NEG_MAIN, pres, NEG_TAIL, rest) + ".";
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
    placeholder.textContent = emptyLabel || "— choisir —";
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
          "Entrée " + (idx + 1);
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
      document.getElementById("frSentenceOutput") ||
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
      sourceLang: "fr",
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

  function initFrGenerator() {
    const selType = document.getElementById("frSentenceType");
    const selTense = document.getElementById("frTense");
    const selPron = document.getElementById("pronounSelect");
    const selVerb = document.getElementById("verbSelect");
    const selAdj = document.getElementById("adjSelect");
    const selAdv = document.getElementById("advSelect");
    const selPrep = document.getElementById("prepSelect");
    const out = document.getElementById("frSentenceOutput");
    const hint = document.getElementById("frHintLine");
    const btnGen = document.getElementById("frGenerateBtn");
    const btnClear = document.getElementById("frClearBtn");

    // =====================================================
    // DE: Sprache + TTS-Controls setzen
    // EN: Set language + init TTS controls
    // RU: Задать язык и инициализировать TTS-контролы
    // =====================================================
    LG_TTS.setLanguage("fr-FR");
    initTtsControls();
    initGermanTranslationTts();

    const pronouns =
      typeof FR_PRONOUNS !== "undefined" && Array.isArray(FR_PRONOUNS)
        ? FR_PRONOUNS
        : [];
    const verbs =
      typeof FR_VERBS !== "undefined" && Array.isArray(FR_VERBS)
        ? FR_VERBS
        : [];
    const adjectives =
      typeof FR_ADJECTIVES !== "undefined" && Array.isArray(FR_ADJECTIVES)
        ? FR_ADJECTIVES
        : [];
    const adverbs =
      typeof FR_ADVERBS !== "undefined" && Array.isArray(FR_ADVERBS)
        ? FR_ADVERBS
        : [];
    const preps =
      typeof FR_PREPS !== "undefined" && Array.isArray(FR_PREPS)
        ? FR_PREPS
        : [];

    fillSelect(selPron, pronouns, (p) => pronounLabel(p), "— choisir —");
    fillSelect(selVerb, verbs, (v) => getLabelFromObject(v), "— choisir —");
    fillSelect(selAdj, adjectives, (a) => getLabelFromObject(a), "— option —");
    fillSelect(selAdv, adverbs, (a) => getLabelFromObject(a), "— option —");
    fillSelect(selPrep, preps, (p) => getLabelFromObject(p), "— option —");

    if (hint) {
      hint.textContent =
        "Générateur FR avec bases centrales (/datenbanken/fr).";
    }

    if (btnGen) {
      btnGen.addEventListener("click", () => {
        const type = selType?.value || "aussage";
        const tense = selTense?.value || "praesens";
        const pronIndex = selPron && selPron.value ? Number(selPron.value) : -1;
        const verbIndex = selVerb && selVerb.value ? Number(selVerb.value) : -1;

        if (pronIndex < 0 || verbIndex < 0) {
          if (out) out.textContent = "Choisis pronom et verbe.";
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
            sentence || "Aucune phrase générée – vérifie les choix.";
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
        if (out) out.textContent = "Aucune phrase générée.";
        LG_TTS.stop();
        updateGermanTranslation("");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initFrGenerator);
})();
