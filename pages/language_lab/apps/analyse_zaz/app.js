(() => {
  "use strict";

  const DATA_ROOT = "../talk_levels/data/";
  const MANIFEST_URL = `${DATA_ROOT}manifest.json`;
  const SKIPLIST_URL = "./skiplist_de.txt";

  const fileSelect = document.getElementById("sfFileFilter");
  const searchInput = document.getElementById("sfSearch");
  const minWordsCheckbox = document.getElementById("sfMinWords");
  const langSelect = document.getElementById("sfLang");
  const listEl = document.getElementById("sfList");
  const detailEl = document.getElementById("sfDetail");
  const detailMetaEl = document.getElementById("sfDetailMeta");
  const statusEl = document.getElementById("sfStatus");
  const analyzeAllBtn = document.getElementById("sfAnalyzeAll");
  const exportBtn = document.getElementById("sfExportJson");
  const stopBtn = document.getElementById("sfStop");
  const ownInput = document.getElementById("sfOwnInput");
  const ownAnalyzeBtn = document.getElementById("sfOwnAnalyze");
  const ownResetBtn = document.getElementById("sfOwnReset");
  const wordChipsEl = document.getElementById("sfWordChips");
  const wordCardEl = document.getElementById("sfWordCard");
  const auxInfoEl = document.getElementById("sfAuxInfo");

  const state = {
    file: "all",
    query: "",
    minWords: true,
    lang: "de",
  };

  let skiplist = new Set();
  let entries = [];
  let filtered = [];
  let lastAnalyses = [];

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function speakText(text, lang) {
    if (!text) return;
    const map = { de: "de-DE", en: "en-US", it: "it-IT", fr: "fr-FR", es: "es-ES", ru: "ru-RU", tr: "tr-TR" };
    const langCode = map[lang] || "de-DE";
    if (window.TTSManager) {
      window.TTSManager.speak(text, langCode);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode;
    const voices = window.speechSynthesis.getVoices() || [];
    const base = (u.lang.split("-")[0] || "").toLowerCase();
    const v = voices.find((x) => x.lang && x.lang.toLowerCase().startsWith(base));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  function stopSpeech() {
    if (window.TTSManager) {
      window.TTSManager.stop();
    } else {
      window.speechSynthesis.cancel();
    }
  }

  function tokenizeText(text) {
    if (typeof window.tokenizeGermanSentence === "function") {
      return window.tokenizeGermanSentence(text);
    }
    return (text || "").replace(/([,;:.!?])/g, " ").split(/\s+/).filter(Boolean);
  }

  function loadSkiplist() {
    return fetch(SKIPLIST_URL)
      .then((res) => (res.ok ? res.text() : ""))
      .then((txt) => {
        const lines = (txt || "")
          .split(/\r?\n/)
          .map((l) => l.trim().toLowerCase())
          .filter(Boolean);
        skiplist = new Set(lines);
      })
      .catch(() => {
        skiplist = new Set();
      });
  }

  function fetchJson(path) {
    return fetch(path).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
  }

  function chooseFiles(files) {
    const preferTopicFiles = files.includes("topics_bundle.json") && files.some((f) => f.startsWith("topics/"));
    return preferTopicFiles ? files.filter((f) => f !== "topics_bundle.json") : files;
  }

  function loadManifest() {
    return fetchJson(MANIFEST_URL).then((data) => {
      const files = Array.isArray(data?.files) ? data.files : [];
      return files;
    });
  }

  function normalizeFileLabel(path) {
    if (!path) return "Unbekannt";
    const parts = path.split("/");
    const file = parts[parts.length - 1] || path;
    return file.replace(".json", "");
  }

  function extractEntriesFromData(data, source) {
    const items = [];

    // talk_levels topics schema
    if (Array.isArray(data?.items)) {
      data.items.forEach((item) => {
        const texts = collectLangTexts(item);
        if (Object.keys(texts).length) {
          items.push({
            texts,
            source,
            topic: data.title || data.id || normalizeFileLabel(source),
            meta: { level: item.level, levels: item.levels },
          });
        }
      });
    }

    // bundle schema: { topics: [...] }
    if (Array.isArray(data?.topics)) {
      data.topics.forEach((topic) => {
        (topic.items || []).forEach((item) => {
          const texts = collectLangTexts(item);
          if (Object.keys(texts).length) {
            items.push({
              texts,
              source,
              topic: topic.title || topic.id || normalizeFileLabel(source),
              meta: { level: item.level, levels: item.levels },
            });
          }
        });
      });
    }

    // generic languages.*.phrases schema
    if (data?.languages) {
      Object.entries(data.languages).forEach(([lang, block]) => {
        if (!block?.phrases || !Array.isArray(block.phrases)) return;
        block.phrases.forEach((ph, idx) => {
          const text = typeof ph === "string" ? ph : ph?.text;
          if (typeof text === "string") {
            const texts = {};
            texts[lang] = text.trim();
            items.push({
              texts,
              source,
              topic: data.topic || normalizeFileLabel(source),
              meta: { label: ph?.label || `Zeile ${idx + 1}` },
            });
          }
        });
      });
    }

    // flat array of phrases with language keys
    if (Array.isArray(data)) {
      data.forEach((entry, idx) => {
        if (entry && typeof entry === "object") {
          const texts = collectLangTexts(entry);
          if (Object.keys(texts).length) {
            items.push({
              texts,
              source,
              topic: entry.topic || normalizeFileLabel(source),
              meta: { idx },
            });
          }
        }
      });
    }

    return items;
  }

  function collectLangTexts(item) {
    const texts = {};
    ["de", "en", "it", "fr", "es", "ru", "tr"].forEach((lang) => {
      const val = item?.[lang];
      if (typeof val === "string" && val.trim()) {
        texts[lang] = val.trim();
      }
    });
    return texts;
  }

  function loadData(files) {
    const filesToLoad = chooseFiles(files);
    const promises = filesToLoad.map((file) =>
      fetchJson(`${DATA_ROOT}${file}`)
        .then((json) => extractEntriesFromData(json, file))
        .catch((err) => {
          console.error("Konnte Datei nicht laden:", file, err);
          return [];
        })
    );
    return Promise.all(promises).then((chunks) => chunks.flat());
  }

  function passesFilters(entry) {
    if (!entry?.texts) return false;
    const text = entry.texts[state.lang];
    if (typeof text !== "string" || !text.trim()) return false;
    const normalized = text.trim();
    const lower = normalized.toLowerCase();
    const tokens = tokenizeText(normalized);

    if (state.minWords && tokens.length < 2) return false;
    if (state.lang === "de" && skiplist.has(lower)) return false;
    if (state.query && !lower.includes(state.query)) return false;
    if (state.file !== "all" && entry.source !== state.file) return false;
    return true;
  }

  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = "";
    if (!filtered.length) {
      const p = document.createElement("p");
      p.className = "sf-empty";
      p.textContent = "Keine Ergebnisse. Filter anpassen?";
      listEl.appendChild(p);
      return;
    }

    filtered.forEach((entry, idx) => {
      const item = document.createElement("article");
      item.className = "sf-item";
      item.dataset.idx = String(idx);

      const header = document.createElement("div");
      header.className = "sf-item__header";
      const text = document.createElement("div");
      text.textContent = entry.texts[state.lang] || "";
      header.appendChild(text);
      const play = document.createElement("button");
      play.type = "button";
      play.className = "sf-play";
      play.textContent = "▶";
      play.addEventListener("click", (ev) => {
        ev.stopPropagation();
        speakText(entry.texts[state.lang], state.lang);
      });
      header.appendChild(play);
      item.appendChild(header);

      const meta = document.createElement("div");
      meta.className = "sf-item__meta";
      const fileSpan = document.createElement("span");
      fileSpan.textContent = normalizeFileLabel(entry.source);
      meta.appendChild(fileSpan);
      if (entry.topic) {
        const topicSpan = document.createElement("span");
        topicSpan.textContent = entry.topic;
        meta.appendChild(topicSpan);
      }
      if (entry.meta?.level !== undefined) {
        const levelSpan = document.createElement("span");
        levelSpan.textContent = `Level ${entry.meta.level}`;
        meta.appendChild(levelSpan);
      }
      item.appendChild(meta);

      item.addEventListener("click", () => {
        showAnalysis(entry);
        speakText(entry.texts[state.lang], state.lang);
      });
      listEl.appendChild(item);
    });
  }

  function renderDetail(analysis, entry, summary, tokens) {
    if (!detailEl || !detailMetaEl) return;
    detailMetaEl.innerHTML = "";

    const chipSource = document.createElement("span");
    chipSource.className = "sf-chip";
    chipSource.textContent = normalizeFileLabel(entry?.source || "");
    detailMetaEl.appendChild(chipSource);

    if (entry?.topic) {
      const chipTopic = document.createElement("span");
      chipTopic.className = "sf-chip";
      chipTopic.textContent = entry.topic;
      detailMetaEl.appendChild(chipTopic);
    }
    if (entry?.meta?.level !== undefined) {
      const chipLvl = document.createElement("span");
      chipLvl.className = "sf-chip";
      chipLvl.textContent = `Level ${entry.meta.level}`;
      detailMetaEl.appendChild(chipLvl);
    }
    const chipLang = document.createElement("span");
    chipLang.className = "sf-chip";
    chipLang.textContent = state.lang.toUpperCase();
    detailMetaEl.appendChild(chipLang);

    renderSummary(summary);

    detailEl.textContent = analysis;

    const wordDetails = tokens ? tokens : analyzeWords(entry.texts[state.lang] || "", state.lang);
    renderWordDetails(wordDetails);
  }

  function showAnalysis(entry) {
    const text = entry.texts[state.lang] || "";
    if (state.lang === "de" && typeof window.analyzeGermanSentence === "function") {
      const analysis = window.analyzeGermanSentence(text);
      const tokens = typeof window.analyzeGermanTokensDetailed === "function" ? window.analyzeGermanTokensDetailed(text) : [];
      const pretty =
        typeof window.explainGermanAnalysis === "function"
          ? window.explainGermanAnalysis(analysis)
          : JSON.stringify(analysis, null, 2);
      const summary =
        typeof window.summarizeGermanForUi === "function"
          ? window.summarizeGermanForUi(analysis, tokens)
          : null;
      renderDetail(pretty, entry, summary, tokens);
    } else {
      const tokens = tokenizeText(text);
      const summary = [`Sprache: ${state.lang.toUpperCase()}`, `Satz: ${text}`, `Tokens: ${tokens.join(" ")}`].join("\n");
      renderDetail(summary, entry, null, tokens.map((t) => ({ token: t })));
    }
    setStatus(`Satz analysiert (${text.slice(0, 40)}${text.length > 40 ? "…" : ""})`);
  }

  function analyzeOwnText() {
    if (!ownInput) return;
    const text = (ownInput.value || "").trim();
    if (!text) {
      setStatus("Bitte einen Satz eingeben.");
      return;
    }
    const entry = {
      texts: { [state.lang]: text },
      source: "Eigener Satz",
      topic: "Eigener Satz",
      meta: { label: "Eigener Satz" },
    };
    showAnalysis(entry);
    speakText(text, state.lang);
  }

  function resetOwnText() {
    if (ownInput) ownInput.value = "";
    if (detailEl) detailEl.textContent = "";
    if (detailMetaEl) detailMetaEl.innerHTML = "";
    const summaryEl = document.getElementById("sfSummary");
    if (summaryEl) summaryEl.innerHTML = "";
    if (wordChipsEl) wordChipsEl.innerHTML = "";
    if (wordCardEl) {
      wordCardEl.innerHTML = "";
      wordCardEl.className = "sf-word-card";
    }
    if (auxInfoEl) {
      auxInfoEl.innerHTML = "";
      auxInfoEl.style.display = "none";
    }
    setStatus("Zurückgesetzt.");
  }

  function renderSummary(summary) {
    const wrap = document.getElementById("sfSummary");
    if (!wrap) return;
    wrap.innerHTML = "";
    if (!summary) return;
    const rows = [
      { label: "Satzart", value: summary.satzart || "–" },
      { label: "Verb", value: summary.verb || "–" },
      { label: "Subjekt", value: summary.subjekt || "–" },
      { label: "Ergänzungen", value: summary.ergaenzungen || "–" },
      { label: "Adverbiale", value: summary.adverbiale || "–" },
    ];
    rows.forEach((r) => {
      const row = document.createElement("div");
      row.className = "sf-summary-row";
      const label = document.createElement("div");
      label.className = "sf-summary-label";
      label.textContent = r.label;
      const val = document.createElement("div");
      val.textContent = r.value;
      row.append(label, val);
      wrap.appendChild(row);
    });
    if (summary.fragen?.length) {
      const row = document.createElement("div");
      row.className = "sf-summary-row";
      const label = document.createElement("div");
      label.className = "sf-summary-label";
      label.textContent = "Beantwortet die Frage(n)";
      const val = document.createElement("div");
      val.textContent = summary.fragen.join(" · ");
      row.append(label, val);
      wrap.appendChild(row);
    }
    renderAuxInfo(summary);
  }

  function renderAuxInfo(summary) {
    if (!auxInfoEl) return;
    auxInfoEl.innerHTML = "";
    if (!summary?.hilfsverb) {
      auxInfoEl.style.display = "none";
      return;
    }
    auxInfoEl.style.display = "grid";
    const title = document.createElement("div");
    title.className = "sf-auxinfo-title";
    title.textContent = "Hilfsverb im Perfekt";

    const hv = document.createElement("div");
    hv.className = "sf-auxinfo-list";
    const hvItem = document.createElement("span");
    hvItem.textContent = `Hilfsverb: ${summary.hilfsverb}`;
    hv.appendChild(hvItem);
    if (summary.hilfsverbWarum) {
      const why = document.createElement("span");
      why.textContent = summary.hilfsverbWarum;
      hv.appendChild(why);
    }

    auxInfoEl.append(title, hv);

    if (summary.hilfsverb === "haben") {
      const note = document.createElement("div");
      note.className = "sf-auxinfo-note";
      note.textContent = "Präsens von „haben“:";
      const conj = document.createElement("div");
      conj.className = "sf-auxinfo-list";
      ["ich habe", "du hast", "er/sie/es hat", "wir haben", "ihr habt", "sie/Sie haben"].forEach((form) => {
        const chip = document.createElement("span");
        chip.textContent = form;
        conj.appendChild(chip);
      });
      auxInfoEl.append(note, conj);
    }
  }

  function applyFilters() {
    filtered = entries.filter((e) => passesFilters(e));
    renderList();
    setStatus(`${filtered.length} Sätze (von ${entries.length}) geladen`);
  }

  function renderWordDetails(rows) {
    if (!wordChipsEl || !wordCardEl) return;
    wordChipsEl.innerHTML = "";
    wordCardEl.innerHTML = "";
    wordCardEl.className = "sf-word-card";
    if (!rows || !rows.length) {
      const empty = document.createElement("div");
      empty.className = "sf-empty";
      empty.textContent = "Keine Token-Details verfügbar.";
      wordCardEl.appendChild(empty);
      return;
    }

    let activeIndex = 0;

    function renderCard(idx) {
      const row = rows[idx] || rows[0];
      if (!row) return;
      wordCardEl.innerHTML = "";
      const genderClass = row.genderClass || "gender-u";
      wordCardEl.className = `sf-word-card ${genderClass}`;
      const title = document.createElement("div");
      title.className = "sf-word-card__title";
      const word = document.createElement("span");
      word.textContent = row.token || "";
      const pos = document.createElement("span");
      pos.className = "pos";
      pos.textContent = row.pos || "–";
      title.append(word, pos);

      if (row.articleInfo) {
        const badge = document.createElement("div");
        badge.className = "sf-article-hint";
        badge.textContent = row.articleInfo;
        badge.title = row.tooltip || row.articleInfo;
        title.appendChild(badge);
      }

      const kvs = [
        { label: "Grundform", value: row.lemma || "–" },
        {
          label: "Merkmale",
          value: row.morph ? Object.entries(row.morph).map(([k, v]) => `${k}: ${v}`).join(", ") : "–",
        },
        { label: "Satzglied", value: row.role_de || "–" },
        { label: "Erklärung", value: row.explain_de || "–" },
      ];

      wordCardEl.appendChild(title);
      kvs.forEach((kv) => {
        const line = document.createElement("div");
        line.className = "sf-kv";
        const l = document.createElement("div");
        l.className = "sf-kv-label";
        l.textContent = kv.label;
        const v = document.createElement("div");
        v.textContent = kv.value;
        line.append(l, v);
        wordCardEl.appendChild(line);
      });
    }

    rows.forEach((row, idx) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `sf-chip-btn ${row.genderClass || "gender-u"}`;
      chip.textContent = row.token || "";
      if (row.tooltip || row.articleInfo) {
        chip.title = row.tooltip || row.articleInfo;
      }
      if (idx === activeIndex) chip.classList.add("active");
      chip.addEventListener("click", () => {
        activeIndex = idx;
        wordChipsEl.querySelectorAll(".sf-chip-btn").forEach((btn, i) => {
          btn.classList.toggle("active", i === idx);
        });
        renderCard(idx);
      });
      wordChipsEl.appendChild(chip);
    });

    renderCard(activeIndex);
  }

  function analyzeWords(text, lang) {
    const tokens = tokenizeText(text);
    if (!tokens.length) return [];
    if (lang === "en") return analyzeEnglish(tokens);
    if (lang === "de" && typeof window.analyzeGermanTokensDetailed === "function") {
      return window.analyzeGermanTokensDetailed(text);
    }
    return tokens.map((t) => ({ token: t, lemma: t.toLowerCase(), pos: "unbekannt", morph: {}, explain_de: "Basis-Analyse (nur Tokenisierung)." }));
  }

  function analyzeEnglish(tokens) {
    const possessives = {
      my: { person: "1", number: "Sg", base: "I→my" },
      your: { person: "2", number: "Sg/Pl", base: "you→your" },
      his: { person: "3", number: "Sg", base: "he→his" },
      her: { person: "3", number: "Sg", base: "she→her" },
      its: { person: "3", number: "Sg", base: "it→its" },
      our: { person: "1", number: "Pl", base: "we→our" },
      their: { person: "3", number: "Pl", base: "they→their" },
    };

    const beForms = {
      am: { tense: "Präsens", person: "1", number: "Sg" },
      are: { tense: "Präsens", person: "2/Pl", number: "Sg/Pl" },
      is: { tense: "Präsens", person: "3", number: "Sg" },
      was: { tense: "Präteritum", person: "1/3", number: "Sg" },
      were: { tense: "Präteritum", person: "2/Pl", number: "Sg/Pl" },
      been: { tense: "Partizip II" },
      being: { tense: "Gerund/Partizip I" },
    };

    const articles = new Set(["a", "an", "the"]);
    const simpleVerbs = new Set(["go", "come", "eat", "drink", "call", "need", "want", "like", "love", "code", "open", "close", "take", "give", "make"]);

    const rows = tokens.map((tok) => {
      const lower = tok.toLowerCase();
      if (possessives[lower]) {
        const { person, number, base } = possessives[lower];
        return {
          token: tok,
          lemma: lower,
          pos: "Possessivdeterminativ",
          morph: { person, number },
          explain_de: `Possessivbegleiter; gehört zur Reihe ${base}; ${person}. Person ${number}.`,
        };
      }

      if (beForms[lower]) {
        const meta = beForms[lower];
        return {
          token: tok,
          lemma: "be",
          pos: "Verb",
          morph: { zeit: meta.tense || "–", person: meta.person || "–", zahl: meta.number || "–" },
          explain_de: "Form von \"be\"; Kopulaverb.",
        };
      }

      if (articles.has(lower)) {
        return {
          token: tok,
          lemma: lower === "an" ? "an" : "a/the",
          pos: "Determinativ",
          morph: {},
          explain_de: "Artikel/Determiner.",
        };
      }

      if (simpleVerbs.has(lower)) {
        return {
          token: tok,
          lemma: lower,
          pos: "Verb",
          morph: {},
          explain_de: "Basis-Verb (Heuristik).",
        };
      }

      const capitalized = /^[A-Z]/.test(tok);
      return {
        token: tok,
        lemma: lower,
        pos: capitalized ? "Eigenname/Nomen" : "unbekannt",
        morph: {},
        explain_de: capitalized ? "Wahrscheinlich Name oder Substantiv." : "Keine Regel erkannt.",
      };
    });

    // Rollen-Heuristik: DET NOUN be NOUN/ADJ
    if (tokens.length >= 4) {
      const lowerTokens = tokens.map((t) => t.toLowerCase());
      const isDet = (w) => articles.has(w) || possessives[w];
      const isBe = (w) => Boolean(beForms[w]);
      const nounish = rows[1] && (rows[1].pos === "Eigenname/Nomen" || rows[1].pos?.includes("Nomen"));
      if (isDet(lowerTokens[0]) && nounish && isBe(lowerTokens[2])) {
        rows[1].role_de = "Subjekt (Heuristik)";
        rows[2].role_de = "Prädikat (be)";
        rows[3].role_de = "Prädikativ (Heuristik)";
      }
    }

    return rows;
  }

  function populateFileSelect(files) {
    if (!fileSelect) return;
    const filesToShow = chooseFiles(files);
    fileSelect.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "Alle Dateien";
    fileSelect.appendChild(allOpt);
    filesToShow.forEach((file) => {
      const opt = document.createElement("option");
      opt.value = file;
      opt.textContent = normalizeFileLabel(file);
      fileSelect.appendChild(opt);
    });
    fileSelect.value = "all";
  }

  function analyzeAll() {
    lastAnalyses = filtered.map((entry) => {
      const text = entry.texts[state.lang] || "";
      const analysis =
        state.lang === "de" && typeof window.analyzeGermanSentence === "function"
          ? window.analyzeGermanSentence(text)
          : { text, tokens: tokenizeText(text), lang: state.lang, note: "Basis-Analyse (nur Token)" };
      return { entry, analysis };
    });
    setStatus(`Analysiert ${lastAnalyses.length} Sätze`);
  }

  function exportJson() {
    const payload = (lastAnalyses.length ? lastAnalyses : filtered.map((entry) => ({ entry, analysis: null }))).map((row) => ({
      source: row.entry.source,
      topic: row.entry.topic,
      text: row.entry.texts[state.lang] || "",
      lang: state.lang,
      analysis: row.analysis || null,
    }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zaz_analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function applyPermalink(files) {
    const params = new URLSearchParams(window.location.search);
    const file = params.get("file");
    const idx = parseInt(params.get("idx"), 10);
    const lang = params.get("lang");
    if (file && files.includes(file)) state.file = file;
    if (!Number.isNaN(idx)) state.permalinkIdx = idx;
    if (lang && ["de", "en", "it", "fr", "es", "ru", "tr"].includes(lang)) state.lang = lang;
  }

  function initEvents() {
    fileSelect?.addEventListener("change", () => {
      state.file = fileSelect.value;
      applyFilters();
    });
    searchInput?.addEventListener("input", () => {
      state.query = (searchInput.value || "").trim().toLowerCase();
      applyFilters();
    });
    minWordsCheckbox?.addEventListener("change", () => {
      state.minWords = minWordsCheckbox.checked;
      applyFilters();
    });
    langSelect?.addEventListener("change", () => {
      state.lang = langSelect.value;
      applyFilters();
    });
    analyzeAllBtn?.addEventListener("click", analyzeAll);
    exportBtn?.addEventListener("click", exportJson);
    stopBtn?.addEventListener("click", stopSpeech);
    ownAnalyzeBtn?.addEventListener("click", analyzeOwnText);
    ownResetBtn?.addEventListener("click", resetOwnText);
    ownInput?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      analyzeOwnText();
    });
  }

  function init() {
    if (minWordsCheckbox) state.minWords = minWordsCheckbox.checked;
    if (langSelect) state.lang = langSelect.value;

    Promise.all([loadSkiplist(), loadManifest()])
      .then(([, files]) => {
        applyPermalink(files);
        populateFileSelect(files);
        if (fileSelect) fileSelect.value = state.file;
        if (langSelect) langSelect.value = state.lang;
        return loadData(files);
      })
      .then((allEntries) => {
        entries = allEntries;
        applyFilters();
        if (typeof state.permalinkIdx === "number" && filtered[state.permalinkIdx]) {
          showAnalysis(filtered[state.permalinkIdx]);
        } else {
          setStatus(`${filtered.length} Sätze bereit`);
        }
      })
      .catch((err) => {
        console.error("Fehler beim Laden:", err);
        setStatus("Fehler beim Laden der Daten.");
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    init();
  });
})();
