// =============================================================
// de_script.js – Deutscher Satzgenerator (zentral /datenbanken/de)
// EN: German sentence generator using central databases.
// RU: Немецкий генератор предложений с центральными базами.
// =============================================================

(() => {
  "use strict";

  // ------------------------------------------------------------
  // Konstante Hilfsverb-Tabellen (Präsens)
  // EN: Aux tables for present tense
  // RU: Таблицы вспомогательных глаголов (Präsens)
  // ------------------------------------------------------------
  const HABEN_FORMS = {
    ich: "habe",
    du: "hast",
    er: "hat",
    sie: "hat",
    es: "hat",
    wir: "haben",
    ihr: "habt",
    sie_pl: "haben",
    sie: "haben",
    Sie: "haben",
    sie_Sie: "haben",
  };

  const SEIN_FORMS = {
    ich: "bin",
    du: "bist",
    er: "ist",
    sie: "ist",
    es: "ist",
    wir: "sind",
    ihr: "seid",
    sie_pl: "sind",
    sie: "sind",
    Sie: "sind",
    sie_Sie: "sind",
  };

  const WERDEN_FORMS = {
    ich: "werde",
    du: "wirst",
    er: "wird",
    sie: "wird",
    es: "wird",
    wir: "werden",
    ihr: "werdet",
    sie_pl: "werden",
    sie: "werden",
    Sie: "werden",
    sie_Sie: "werden",
  };

  // ------------------------------------------------------------
  // DE: Bewegungsverben (Basisform)
  // EN: Movement verbs (base form)
  // RU: Глаголы движения (базовая форма)
  // ------------------------------------------------------------
  const DE_MOVEMENT_VERBS = ["gehen", "fahren", "kommen", "laufen", "rennen"];

  // ------------------------------------------------------------
  // Helpers / Hilfsfunktionen / Вспомогательные функции
  // ------------------------------------------------------------
  function safeStr(x) {
    return typeof x === "string" ? x : "";
  }

  // DE/EN/RU: Sicheres Array
  function safeArray(value) {
    return Array.isArray(value) ? value : [];
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

  // EN: Label prioritizes base -> word -> form -> id -> inf/infinitiv
  // DE: Label priorisiert base -> word -> form -> id -> inf/infinitiv
  // RU: Метка с приоритетом base -> word -> form -> id -> inf/infinitiv
  function getLabelFromObject(obj) {
    if (!obj || typeof obj !== "object") return "";
    const primary =
      obj.base || obj.word || obj.form || obj.id || obj.inf || obj.infinitiv;
    if (typeof primary === "string" && primary.trim() !== "") {
      return primary.trim();
    }
    const secondary = obj.value || obj.de || obj.label || obj.text;
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
      safeStr(v?.inf) ||
      safeStr(v?.infinitiv) ||
      safeStr(v?.word) ||
      safeStr(v?.base) ||
      safeStr(v?.id)
    );
  }

  function pronounLabel(pron) {
    return safeStr(pron?.form) || safeStr(pron?.base) || safeStr(pron?.id);
  }

  // EN: Map pronoun to person key used in verb tables.
  // DE: Pronomen auf Personen-Key der Verbtabellen mappen.
  // RU: Соответствие местоимений ключам форм глагола.
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

  // ------------------------------------------------------------
  // Konjugation Präsens
  // ------------------------------------------------------------
  function conjugatePraesens(verbObj, personKey) {
    if (!verbObj) return null;
    const key = personKey || "ich";
    const forms =
      verbObj.presens || verbObj.praesens || verbObj.forms || verbObj.forms_present;
    if (forms) {
      const direct =
        forms[key] ||
        forms[key.replace(/_[^_]+$/, "")] || // er_sie_es -> er
        null;
      if (typeof direct === "string" && direct.trim() !== "") return direct;
    }
    return getVerbInf(verbObj) || null;
  }

  // ------------------------------------------------------------
  // Präteritum: erst Datenbank, dann schwaches Verb als Fallback
  // ------------------------------------------------------------
  function buildWeakPraeteritumFromInf(inf, personKey) {
    inf = safeStr(inf).trim();
    if (!inf) return null;

    let stem = inf;
    if (stem.endsWith("en")) stem = stem.slice(0, -2);
    else if (stem.endsWith("n")) stem = stem.slice(0, -1);

    const needsE = /[dt]$/.test(stem) || /(chn|ffn|gn|tm|dm)$/.test(stem);
    const base = stem + (needsE ? "ete" : "te");

    switch (personKey) {
      case "ich":
        return base;
      case "du":
        return base + "st";
      case "er":
        return base;
      case "wir":
        return base + "n";
      case "ihr":
        return base + "t";
      case "sie":
        return base + "n";
      default:
        return base;
    }
  }

  function conjugatePraeteritum(verbObj, personKey) {
    if (!verbObj) return null;
    const key = personKey || "ich";
    const f =
      verbObj.praeteritum || verbObj.preteritum || verbObj.forms_past || null;
    if (f && safeStr(f?.[key])) return f[key];
    const inf = getVerbInf(verbObj);
    return buildWeakPraeteritumFromInf(inf, key);
  }

  // ------------------------------------------------------------
  // Perfekt-Parts: Hilfsverb (konjugiert) + Partizip II
  // ------------------------------------------------------------
  function buildPerfektParts(personKey, verbObj, auxOverride, auxList) {
    if (!verbObj) return null;
    const part =
      safeStr(verbObj?.partizip2) || safeStr(verbObj?.partizip) || "";
    if (!part) return null;

    let auxInf = "";
    if (auxOverride) {
      auxInf = getVerbInf(auxOverride);
    } else {
      auxInf =
        safeStr(verbObj?.perfektAux) ||
        (verbObj?.usesSein ? "sein" : "") ||
        "haben";
    }
    if (!auxInf && safeStr(verbObj?.perfektAux) === "sein") auxInf = "sein";

    const auxObj =
      auxOverride ||
      auxList.find((a) => getVerbInf(a) === auxInf) ||
      null;

    const key = personKey || "ich";
    const auxForm =
      auxInf === "sein"
        ? SEIN_FORMS[key] || conjugatePraesens(auxObj, key) || "bin"
        : HABEN_FORMS[key] || conjugatePraesens(auxObj, key) || "habe";

    if (!auxForm) return null;
    return { auxForm, partizip: part };
  }

  // ------------------------------------------------------------
  // Futur I: werden (Präsens) + Infinitiv
  // ------------------------------------------------------------
  function buildFuturParts(personKey, verbObj, auxList) {
    if (!verbObj) return null;
    const inf = getVerbInf(verbObj);
    if (!inf) return null;

    const key = personKey || "ich";
    const werdenObj =
      auxList.find((a) => getVerbInf(a) === "werden") || null;

    const werdenForm =
      WERDEN_FORMS[key] ||
      conjugatePraesens(werdenObj, key) ||
      "werde";

    return { werdenForm, infinitiv: inf };
  }

  // ------------------------------------------------------------
  // Satz bauen (Aussage / Frage / Verneinung) für alle Zeitformen
  // ------------------------------------------------------------
  function buildSentence({
    type,
    tense,
    pronounLabel,
    personKey,
    verbObj,
    auxOverride,
    adjLabel,
    advLabel,
    prepLabel,
    prepPhraseLabel,
    auxList,
  }) {
    if (!pronounLabel || !verbObj) return "";

    const rest = joinParts(advLabel, adjLabel, prepLabel, prepPhraseLabel);
    const key = personKey || "ich";
    let sentence = "";

    if (tense === "praeteritum") {
      const pastForm = conjugatePraeteritum(verbObj, key);
      if (!pastForm) return "";
      if (type === "frage") {
        sentence = joinParts(pastForm, pronounLabel, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pronounLabel, pastForm, "nicht", rest) + ".";
      } else {
        sentence = joinParts(pronounLabel, pastForm, rest) + ".";
      }
    } else if (tense === "perfekt") {
      const perfektParts = buildPerfektParts(key, verbObj, auxOverride, auxList);
      if (!perfektParts) return "";
      if (type === "frage") {
        sentence = joinParts(
          perfektParts.auxForm,
          pronounLabel,
          rest,
          perfektParts.partizip
        ) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(
          pronounLabel,
          perfektParts.auxForm,
          "nicht",
          rest,
          perfektParts.partizip
        ) + ".";
      } else {
        sentence = joinParts(
          pronounLabel,
          perfektParts.auxForm,
          rest,
          perfektParts.partizip
        ) + ".";
      }
    } else if (tense === "futur1") {
      const futurParts = buildFuturParts(key, verbObj, auxList);
      if (!futurParts) return "";
      if (type === "frage") {
        sentence = joinParts(
          futurParts.werdenForm,
          pronounLabel,
          rest,
          futurParts.infinitiv
        ) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(
          pronounLabel,
          futurParts.werdenForm,
          "nicht",
          rest,
          futurParts.infinitiv
        ) + ".";
      } else {
        sentence = joinParts(
          pronounLabel,
          futurParts.werdenForm,
          rest,
          futurParts.infinitiv
        ) + ".";
      }
    } else {
      // Präsens (Default)
      const presentForm = conjugatePraesens(verbObj, key);
      if (!presentForm) return "";
      if (type === "frage") {
        sentence = joinParts(presentForm, pronounLabel, rest) + "?";
      } else if (type === "verneinung") {
        sentence = joinParts(pronounLabel, presentForm, "nicht", rest) + ".";
      } else {
        sentence = joinParts(pronounLabel, presentForm, rest) + ".";
      }
    }

    return capFirst(sentence.trim());
  }

  // =====================================================
  // DE: Präposition + Ort aus Auswahl lesen
  // EN: Read preposition + place selection
  // RU: Считать выбор «предлог + место»
  // =====================================================
  function getSelectedPrepPhrase() {
    const prepSelect = document.getElementById("de_prep_select");
    const phraseSelect = document.getElementById("de_prep_phrase_select");
    const patterns = safeArray(window.DE_PREP_PATTERNS);

    if (!prepSelect || !phraseSelect || !patterns.length) return null;

    const prep = prepSelect.value;
    const id = phraseSelect.value;
    if (!prep || !id) return null;

    const pattern = patterns.find((p) => p.id === id);
    return pattern || null;
  }

  // =====================================================
  // DE: Hinweis anzeigen
  // EN: Show generator hint
  // RU: Показать подсказку генератора
  // =====================================================
  function showGeneratorMessage(msg) {
    const box = document.getElementById("de_generator_message");
    if (box) {
      box.textContent = msg || "";
    } else if (msg) {
      console.warn("Generator-Hinweis:", msg);
    }
  }

  // =====================================================
  // DE: Präposition-Select initialisieren
  // EN: Init preposition select
  // RU: Инициализировать селект предлогов
  // =====================================================
  function initPrepSelect() {
    const prepSelect = document.getElementById("de_prep_select");
    const phraseSelect = document.getElementById("de_prep_phrase_select");
    const infoBox = document.getElementById("de_prep_info");
    const patterns = safeArray(window.DE_PREP_PATTERNS);

    if (!prepSelect || !phraseSelect || !patterns.length) return;

    const preps = Array.from(new Set(patterns.map((p) => p.prep))).sort();

    prepSelect.innerHTML = "";
    const optEmpty = document.createElement("option");
    optEmpty.value = "";
    optEmpty.textContent = "— (keine Präposition) —";
    prepSelect.appendChild(optEmpty);

    preps.forEach((pr) => {
      const opt = document.createElement("option");
      opt.value = pr;
      opt.textContent = pr;
      prepSelect.appendChild(opt);
    });

    prepSelect.addEventListener("change", () => {
      const prep = prepSelect.value;
      fillPrepPhraseSelect(prep, patterns, phraseSelect, infoBox);
    });

    fillPrepPhraseSelect("", patterns, phraseSelect, infoBox);
  }

  // =====================================================
  // DE: Präpositionalgruppen nach Präposition filtern/füllen
  // EN: Fill prep phrases based on prep selection
  // RU: Заполнить группы по предлогу
  // =====================================================
  function fillPrepPhraseSelect(prep, patterns, phraseSelect, infoBox) {
    phraseSelect.innerHTML = "";
    if (infoBox) infoBox.textContent = "";

    const filtered = prep ? patterns.filter((p) => p.prep === prep) : [];

    if (!filtered.length) {
      const optEmpty = document.createElement("option");
      optEmpty.value = "";
      optEmpty.textContent = "— (kein Ort ausgewählt) —";
      phraseSelect.appendChild(optEmpty);
      phraseSelect.onchange = null;
      return;
    }

    const optPlaceholder = document.createElement("option");
    optPlaceholder.value = "";
    optPlaceholder.textContent = "— bitte wählen —";
    phraseSelect.appendChild(optPlaceholder);

    filtered.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.phrase} (${p.question}, Kasus: ${p.case})`;
      opt.dataset.case = p.case;
      opt.dataset.question = p.question;
      phraseSelect.appendChild(opt);
    });

    phraseSelect.onchange = function () {
      const id = phraseSelect.value;
      const selected = filtered.find((p) => p.id === id);
      if (selected && infoBox) {
        infoBox.textContent = `Präposition: ${selected.prep} · Kasus: ${selected.case} · Frage: ${selected.question}`;
      } else if (infoBox) {
        infoBox.textContent = "";
      }
    };
  }

  // ------------------------------------------------------------
  // Selects befüllen (Dropdowns)
  // ------------------------------------------------------------
  function fillSelect(selectElement, items, getLabelFn, emptyLabel) {
    if (!selectElement) {
      console.warn("fillSelect: no selectElement");
      return;
    }
    selectElement.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = emptyLabel || "— bitte wählen —";
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
          item?.inf ||
          item?.infinitiv ||
          item?.value ||
          "Eintrag " + (idx + 1);
      }
      label = String(label).trim();
      const opt = document.createElement("option");
      opt.value = String(idx); // Index im Array als value
      opt.textContent = label;
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
      document.getElementById("deSentenceOutput") ||
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
      sourceLang: "de",
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

  // ------------------------------------------------------------
  // Init
  // ------------------------------------------------------------
  function initDeGenerator() {
    const selType = document.getElementById("deSentenceType");
    const selTense = document.getElementById("deTense");
    const selPron = document.getElementById("pronomenSelect");
    const selVerb = document.getElementById("verbSelect");
    const selHilf = document.getElementById("hilfsverbSelect");
    const selAdj = document.getElementById("adjektivSelect");
    const selAdv = document.getElementById("adverbSelect");
    const selPrep = document.getElementById("praepSelect");
    const out = document.getElementById("deSentenceOutput");
    const hint = document.getElementById("deHintLine");
    const btnGen = document.getElementById("deGenerateBtn");
    const btnClear = document.getElementById("deClearBtn");

    // =====================================================
    // DE: Präp-UI aufbauen
    // EN: Build prep UI
    // RU: Построить UI предлогов
    // =====================================================
    initPrepSelect();

    // =====================================================
    // DE: Sprache + TTS-Controls setzen
    // EN: Set language + init TTS controls
    // RU: Задать язык и инициализировать TTS-контролы
    // =====================================================
    LG_TTS.setLanguage("de-DE");
    initTtsControls();
    initGermanTranslationTts();

    // Daten aus zentralen Konstanten
    const pronouns =
      typeof DE_PRONOUNS !== "undefined" && Array.isArray(DE_PRONOUNS)
        ? DE_PRONOUNS
        : [];
    const verbsMain =
      typeof DE_VERBS_MAIN !== "undefined" && Array.isArray(DE_VERBS_MAIN)
        ? DE_VERBS_MAIN
        : [];
    const verbsAux =
      typeof DE_VERBS_AUX !== "undefined" && Array.isArray(DE_VERBS_AUX)
        ? DE_VERBS_AUX
        : [];

    const adjectives =
      typeof DE_ADJECTIVES !== "undefined" && Array.isArray(DE_ADJECTIVES)
        ? DE_ADJECTIVES
        : [];
    const adverbs =
      typeof DE_ADVERBS !== "undefined" && Array.isArray(DE_ADVERBS)
        ? DE_ADVERBS
        : [];
    const preps =
      typeof DE_PREPS !== "undefined" && Array.isArray(DE_PREPS)
        ? DE_PREPS
        : [];

    // Selects füllen
    fillSelect(selPron, pronouns, (p) => pronounLabel(p), "— bitte wählen —");
    fillSelect(
      selVerb,
      verbsMain,
      (v) => getLabelFromObject(v),
      "— bitte wählen —"
    );
    fillSelect(
      selHilf,
      verbsAux,
      (v) => getLabelFromObject(v),
      "— automatisch —"
    );
    fillSelect(
      selAdj,
      adjectives,
      (a) => getLabelFromObject(a),
      "— (optional) —"
    );
    fillSelect(
      selAdv,
      adverbs,
      (a) => getLabelFromObject(a),
      "— (optional) —"
    );
    fillSelect(
      selPrep,
      preps,
      (p) => getLabelFromObject(p),
      "— (optional) —"
    );

    if (hint) {
      hint.textContent =
        "DE-Generator: zentrale Datenbanken (/datenbanken/de) – alle Zeiten aktiv.";
    }

    showGeneratorMessage("");

    if (btnGen) {
      btnGen.addEventListener("click", () => {
        showGeneratorMessage("");

        const type = selType?.value || "aussage";
        const tense = selTense?.value || "praesens";

        const pronIndex = selPron && selPron.value ? Number(selPron.value) : -1;
        const verbIndex = selVerb && selVerb.value ? Number(selVerb.value) : -1;
        const auxIndex = selHilf && selHilf.value ? Number(selHilf.value) : -1;

        if (pronIndex < 0 || verbIndex < 0) {
          if (out) out.textContent = "Bitte Pronomen und Verb wählen.";
          return;
        }

        const pronObj = pronouns[pronIndex];
        const verbObj = verbsMain[verbIndex];
        const auxObj = auxIndex >= 0 ? verbsAux[auxIndex] : null;

        const personKey = pronounToPersonKey(pronObj);
        const pronLabel = pronounLabel(pronObj);

        const adjObj =
          selAdj && selAdj.value ? adjectives[Number(selAdj.value)] : null;
        const advObj =
          selAdv && selAdv.value ? adverbs[Number(selAdv.value)] : null;
        const prepObj =
          selPrep && selPrep.value ? preps[Number(selPrep.value)] : null;

        const adjLabel = getLabelFromObject(adjObj);
        const advLabel = getLabelFromObject(advObj);
        const prepLabel = getLabelFromObject(prepObj);
        const prepPattern = getSelectedPrepPhrase();
        const prepPhraseLabel = prepPattern ? prepPattern.phrase : "";

        const sentence = buildSentence({
          type,
          tense,
          pronounLabel: pronLabel,
          personKey,
          verbObj,
          auxOverride: auxObj,
          adjLabel,
          advLabel,
          prepLabel,
          prepPhraseLabel,
          auxList: verbsAux,
        });

        const isMovementVerb = DE_MOVEMENT_VERBS.includes(getVerbInf(verbObj));
        const hasPrepGroup = !!prepPattern;

        if (out) {
          out.textContent =
            sentence || "Kein Satz erzeugt – bitte Auswahl prüfen.";
        }
        updateGermanTranslation(sentence);

        if (isMovementVerb && !hasPrepGroup) {
          showGeneratorMessage(
            "Satz ist unvollständig: Bewegungsverb ohne Ziel/Ort. Bitte wähle eine Präposition + Ort (z.B. nach Hause, in die Stadt)."
          );
        } else {
          showGeneratorMessage("");
        }

        if (sentence && !(isMovementVerb && !hasPrepGroup)) {
          LG_TTS.speak(sentence);
        }
      });
    }

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        [selPron, selVerb, selHilf, selAdj, selAdv, selPrep].forEach((s) => {
          if (s) s.selectedIndex = 0;
        });
        if (out) out.textContent = "Noch kein Satz erzeugt …";
        LG_TTS.stop();
        showGeneratorMessage("");
        updateGermanTranslation("");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initDeGenerator);
})();
