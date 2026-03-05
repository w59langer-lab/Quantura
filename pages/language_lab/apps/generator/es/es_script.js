// =============================================================
// es_script.js – Generador de oraciones en español
// DE: Spanischer Satzgenerator
// EN: Spanish sentence generator
// RU: Испанский генератор предложений
// =============================================================

(() => {
  "use strict";

  // ------------------------------------------------------------
  // Helpers / Hilfsfunktionen / Вспомогательные функции
  // ------------------------------------------------------------
  function safeStr(x) {
    return typeof x === "string" ? x : "";
  }

  function capFirst(str) {
    if (!str || !str.length) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function joinParts(...parts) {
    return parts
      .filter((p) => (typeof p === "string" ? p.trim() !== "" : !!p))
      .map((p) => (typeof p === "string" ? p.trim() : String(p).trim()))
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getLabelFromObject(obj) {
    if (!obj || typeof obj !== "object") return "";
    const primary =
      obj.base || obj.word || obj.form || obj.id || obj.inf || obj.infinitive;
    if (typeof primary === "string" && primary.trim() !== "") {
      return primary.trim();
    }
    const secondary = obj.value || obj.es || obj.label || obj.text;
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

  // ------------------------------------------------------------
  // Pronomen / Pronouns / Местоимения
  // ------------------------------------------------------------
  function pronounLabel(pron) {
    return safeStr(pron?.form) || safeStr(pron?.base) || safeStr(pron?.id);
  }

  function pronounToKey(pron) {
    const id = safeStr(pron?.id).toLowerCase();
    const form = safeStr(pron?.form).toLowerCase();
    const value = id || form;
    if (!value) return "yo";

    if (value === "yo") return "yo";
    if (value === "tú" || value === "tu") return "tu";
    if (value === "usted") return "usted";
    if (value === "él" || value === "el") return "el";
    if (value === "ella") return "ella";
    if (value === "nosotros" || value === "nosotras") return "nosotros";
    if (value === "vosotros" || value === "vosotras") return "vosotros";
    if (value === "ellos" || value === "ellas" || value === "ustedes")
      return "ellos";

    return value;
  }

  // ------------------------------------------------------------
  // Verbkonjugation Präsens
  // ------------------------------------------------------------
  function regularPresent(inf, pronKey) {
    const word = safeStr(inf);
    if (!word.endsWith("ar") && !word.endsWith("er") && !word.endsWith("ir")) {
      return word;
    }
    const stem = word.slice(0, -2);
    const ending = word.slice(-2);
    const endings =
      ending === "ar"
        ? {
            yo: "o",
            tu: "as",
            el: "a",
            ella: "a",
            usted: "a",
            nosotros: "amos",
            vosotros: "áis",
            ellos: "an",
          }
        : ending === "er"
        ? {
            yo: "o",
            tu: "es",
            el: "e",
            ella: "e",
            usted: "e",
            nosotros: "emos",
            vosotros: "éis",
            ellos: "en",
          }
        : {
            yo: "o",
            tu: "es",
            el: "e",
            ella: "e",
            usted: "e",
            nosotros: "imos",
            vosotros: "ís",
            ellos: "en",
          };
    const key = pronKey || "yo";
    const part =
      endings[key] ||
      endings[key.replace(/s$/, "")] ||
      endings.el ||
      "";
    return stem + part;
  }

  function conjugatePresent(verbObj, pronKey) {
    if (!verbObj) return "";
    const forms = verbObj.forms || verbObj.presens || verbObj.praesens;
    const key = pronKey || "yo";
    if (forms && typeof forms === "object") {
      const direct =
        forms[key] ||
        forms[key.replace(/s$/, "")] ||
        forms[key === "ellos" ? "ellas" : ""] ||
        null;
      if (safeStr(direct)) return safeStr(direct);
    }
    const inf = getVerbInf(verbObj);
    return regularPresent(inf, key);
  }

  // ------------------------------------------------------------
  // Nomen / Sustantivos / Существительные
  // ------------------------------------------------------------
  function pluralizeEs(word) {
    const w = safeStr(word);
    if (!w) return "";
    if (/[aeiouáéíóú]$/i.test(w)) return w + "s";
    if (/z$/i.test(w)) return w.replace(/z$/i, "ces");
    return w + "es";
  }

  function buildNounForm(nounObj, number) {
    if (!nounObj) return "";
    const base = safeStr(nounObj.base) || safeStr(nounObj.word) || safeStr(nounObj.id);
    const num = number || safeStr(nounObj.number) || "sg";
    if (num === "pl") {
      return safeStr(nounObj.plural) || pluralizeEs(base);
    }
    return base;
  }

  function buildDeterminer(type, gender, number) {
    const gen = gender === "f" ? "f" : "m";
    const num = number === "pl" ? "pl" : "sg";
    if (type === "def") {
      if (num === "sg") return gen === "f" ? "la" : "el";
      return gen === "f" ? "las" : "los";
    }
    if (type === "indef") {
      if (num === "sg") return gen === "f" ? "una" : "un";
      return gen === "f" ? "unas" : "unos";
    }
    return "";
  }

  function inflectAdjective(base, gender, number) {
    const raw = safeStr(base);
    if (!raw) return "";
    const gen = gender === "f" ? "f" : "m";
    let form = raw;

    if (raw.endsWith("o")) {
      form = gen === "f" ? raw.slice(0, -1) + "a" : raw;
    }

    const num = number === "pl" ? "pl" : "sg";
    if (num === "pl") {
      if (/[aeiouáéíóú]$/.test(form)) {
        form = form + "s";
      } else if (/z$/.test(form)) {
        form = form.replace(/z$/, "ces");
      } else {
        form = form + "es";
      }
    }

    return form;
  }

  function buildNounPhrase(detType, nounObj, adjObj, prepObj) {
    if (!nounObj) return "";
    const gender = safeStr(nounObj.gender) || "m";
    const number = safeStr(nounObj.number) || "sg";
    const nounForm = buildNounForm(nounObj, number);
    const det = buildDeterminer(detType, gender, number);
    const adjForm = adjObj
      ? inflectAdjective(
          safeStr(adjObj.base) || safeStr(adjObj.word) || safeStr(adjObj.id),
          gender,
          number
        )
      : "";
    const preposition = prepObj
      ? safeStr(prepObj.base) || safeStr(prepObj.word) || safeStr(prepObj.id)
      : "";

    const phrase = joinParts(det, nounForm, adjForm);
    return preposition ? joinParts(preposition, phrase) : phrase;
  }

  // ------------------------------------------------------------
  // Satz bauen
  // ------------------------------------------------------------
  function buildSentence({
    type,
    pronounLabel,
    pronounKey,
    verbObj,
    detType,
    nounObj,
    adjObj,
    advLabel,
    prepObj,
  }) {
    if (!verbObj) return "";
    const verbForm = conjugatePresent(verbObj, pronounKey);
    if (!verbForm) return "";

    const negWord = type === "verneinung" ? "no" : "";
    const nounPhrase = buildNounPhrase(detType, nounObj, adjObj, prepObj);
    const body = joinParts(pronounLabel, negWord, verbForm, nounPhrase, advLabel);
    if (!body) return "";

    if (type === "frage") {
      return "¿" + capFirst(body) + "?";
    }
    return capFirst(body) + ".";
  }

  // ------------------------------------------------------------
  // UI Hilfen / UI helpers
  // ------------------------------------------------------------
  function fillSelect(selectElement, items, getLabelFn, emptyLabel) {
    if (!selectElement) return;
    selectElement.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = emptyLabel || "— (vacío) —";
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
          "Elemento " + (idx + 1);
      }
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = String(label).trim();
      selectElement.appendChild(opt);
    });
  }

  function showMessage(msg) {
    const box = document.getElementById("esGeneratorMessage");
    if (box) box.textContent = msg || "";
  }

  function getCurrentSentenceText() {
    const el =
      document.getElementById("esSentenceOutput") ||
      document.getElementById("generatedSentence") ||
      document.getElementById("outputSentence") ||
      document.getElementById("sentenceBox");
    return el ? el.textContent || "" : "";
  }

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

  // ------------------------------------------------------------
  // Init
  // ------------------------------------------------------------
  function initEsGenerator() {
    const selType = document.getElementById("esSentenceType");
    const selTense = document.getElementById("esTense");
    const selPron = document.getElementById("pronounSelect");
    const selVerb = document.getElementById("verbSelect");
    const selDet = document.getElementById("esDetSelect");
    const selNoun = document.getElementById("nounSelect");
    const selAdj = document.getElementById("adjSelect");
    const selAdv = document.getElementById("advSelect");
    const selPrep = document.getElementById("prepSelect");
    const out = document.getElementById("esSentenceOutput");
    const hint = document.getElementById("esHintLine");
    const btnGen = document.getElementById("esGenerateBtn");
    const btnClear = document.getElementById("esClearBtn");

    LG_TTS.setLanguage("es-ES");
    initTtsControls();

    const pronouns =
      typeof ES_PRONOUNS !== "undefined" && Array.isArray(ES_PRONOUNS)
        ? ES_PRONOUNS
        : [];
    const verbs =
      typeof ES_VERBS !== "undefined" && Array.isArray(ES_VERBS)
        ? ES_VERBS
        : [];
    const adjectives =
      typeof ES_ADJECTIVES !== "undefined" && Array.isArray(ES_ADJECTIVES)
        ? ES_ADJECTIVES
        : [];
    const adverbs =
      typeof ES_ADVERBS !== "undefined" && Array.isArray(ES_ADVERBS)
        ? ES_ADVERBS
        : [];
    const preps =
      typeof ES_PREPS !== "undefined" && Array.isArray(ES_PREPS)
        ? ES_PREPS
        : [];
    const nouns =
      typeof ES_NOUNS !== "undefined" && Array.isArray(ES_NOUNS)
        ? ES_NOUNS
        : [];

    fillSelect(selPron, pronouns, (p) => pronounLabel(p), "— (vacío) —");
    fillSelect(selVerb, verbs, (v) => getLabelFromObject(v), "— selecciona —");
    fillSelect(selNoun, nouns, (n) => getLabelFromObject(n), "— (opcional) —");
    fillSelect(selAdj, adjectives, (a) => getLabelFromObject(a), "— (opcional) —");
    fillSelect(selAdv, adverbs, (a) => getLabelFromObject(a), "— (opcional) —");
    fillSelect(selPrep, preps, (p) => getLabelFromObject(p), "— (opcional) —");

    if (hint) {
      hint.textContent =
        "Generador ES: usa Presente, negación con «no», artículos según género/número.";
    }

    showMessage("");

    if (btnGen) {
      btnGen.addEventListener("click", () => {
        showMessage("");

        const type = selType?.value || "aussage";
        const tense = selTense?.value || "presente";

        const pronIndex = selPron && selPron.value ? Number(selPron.value) : -1;
        const verbIndex = selVerb && selVerb.value ? Number(selVerb.value) : -1;
        const nounIndex = selNoun && selNoun.value ? Number(selNoun.value) : -1;
        const adjIndex = selAdj && selAdj.value ? Number(selAdj.value) : -1;
        const advIndex = selAdv && selAdv.value ? Number(selAdv.value) : -1;
        const prepIndex = selPrep && selPrep.value ? Number(selPrep.value) : -1;

        if (verbIndex < 0) {
          if (out) out.textContent = "Elige un verbo.";
          showMessage("Para generar la oración se necesita un verbo.");
          return;
        }

        const pronObj = pronIndex >= 0 ? pronouns[pronIndex] : null;
        const verbObj = verbs[verbIndex];
        const nounObj = nounIndex >= 0 ? nouns[nounIndex] : null;
        const adjObj = adjIndex >= 0 ? adjectives[adjIndex] : null;
        const advObj = advIndex >= 0 ? adverbs[advIndex] : null;
        const prepObj = prepIndex >= 0 ? preps[prepIndex] : null;

        const pronLabel = pronounLabel(pronObj);
        const pronKey = pronounToKey(pronObj);
        const detType = selDet?.value || "";
        const advLabel = getLabelFromObject(advObj);

        const sentence = buildSentence({
          type,
          tense,
          pronounLabel: pronLabel,
          pronounKey: pronKey,
          verbObj,
          detType,
          nounObj,
          adjObj,
          advLabel,
          prepObj,
        });

        if (out) {
          out.textContent =
            sentence || "No se pudo generar la oración. Revisa la selección.";
        }

        if (sentence) {
          LG_TTS.speak(sentence);
        }
      });
    }

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        [selPron, selVerb, selDet, selNoun, selAdj, selAdv, selPrep].forEach(
          (s) => {
            if (s) s.selectedIndex = 0;
          }
        );
        if (out) out.textContent = "No hay oración generada todavía.";
        showMessage("");
        LG_TTS.stop();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initEsGenerator);
})();
