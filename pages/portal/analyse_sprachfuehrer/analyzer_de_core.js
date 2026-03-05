// Kernanalyse Deutsch – ausgelagert aus analyse/de/za_script.js (nicht verändern)
(() => {
  "use strict";

  // Datenbanken aus /datenbanken/de/… (über Script-Tags geladen)
  const PRONOUNS = Array.isArray(window.DE_PRONOUNS) ? window.DE_PRONOUNS : [];
  const VERBS_MAIN = Array.isArray(window.DE_VERBS_MAIN) ? window.DE_VERBS_MAIN : [];
  const VERBS_AUX = Array.isArray(window.DE_VERBS_AUX) ? window.DE_VERBS_AUX : [];
  const VERBS_MODALS = Array.isArray(window.DE_VERBS_MODALS) ? window.DE_VERBS_MODALS : [];
  const ADVERBS = Array.isArray(window.DE_ADVERBS) ? window.DE_ADVERBS : [];
  const PREPS = Array.isArray(window.DE_PREPS) ? window.DE_PREPS : [];

  const NOM_PRONOUNS = new Set(PRONOUNS.map((p) => p.form.toLowerCase()));
  const QUESTION_WORDS = new Set(["wer", "was", "wann", "warum", "wie", "wo", "woher", "wohin", "womit", "wodurch", "welche", "welcher", "welches"]);
  const SUBORDINATE_MARKERS = {
    weil: "Kausalsatz",
    da: "Kausalsatz",
    dass: null,
    wenn: "Konditionalsatz",
    falls: "Konditionalsatz",
    obwohl: null,
    ob: null,
    als: "Temporalsatz",
    bevor: "Temporalsatz",
    nachdem: "Temporalsatz",
    sobald: "Temporalsatz",
    während: "Temporalsatz",
    damit: null,
  };
  const COORDINATORS = new Set(["sonst", "aber", "und"]);
  const SIMPLE_PAST_FORMS = new Set(["ging", "kam", "war", "hatte", "wurde", "sagte", "nahm"]);

  const AKK_PRON = new Set(["mich", "dich", "ihn", "sie", "es", "uns", "euch", "sie"]);
  const DAT_PRON = new Set(["mir", "dir", "ihm", "ihr", "ihm", "uns", "euch", "ihnen"]);

  const { verbIndex, participleSet, infinitiveSet, infinitiveList: VERB_INF_LIST } = buildVerbIndex([...VERBS_MAIN, ...VERBS_AUX, ...VERBS_MODALS]);

  function buildVerbIndex(list) {
    const index = new Map();
    const participles = new Set();
    const infinitives = new Set();
    const infinitiveList = [];

    const personInfo = {
      ich: { person: 1, number: "Singular" },
      du: { person: 2, number: "Singular" },
      er: { person: 3, number: "Singular" },
      sie: { person: 3, number: "Singular/Plural" },
      wir: { person: 1, number: "Plural" },
      ihr: { person: 2, number: "Plural" },
    };

    list.forEach((verb) => {
      if (!verb || !verb.inf) return;
      const inf = verb.inf.toLowerCase();
      infinitives.add(inf);
      infinitiveList.push(inf);
      index.set(inf, { type: "infinitive", inf, category: verb.modal ? "modal" : verb.voll ? "main" : "aux", source: verb });

      if (verb.presens) {
        Object.entries(verb.presens).forEach(([slot, form]) => {
          const lower = String(form || "").toLowerCase();
          index.set(lower, {
            type: "finite",
            form: lower,
            inf,
            category: verb.modal ? "modal" : verb.voll ? "main" : "aux",
            ...personInfo[slot],
          });
        });
      }

      if (verb.partizip) {
        const p = verb.partizip.toLowerCase();
        participles.add(p);
        index.set(p, { type: "participle", inf, category: verb.modal ? "modal" : "main" });
      }
    });

    return { verbIndex: index, participleSet: participles, infinitiveSet: infinitives, infinitiveList };
  }

  function lookupNounInfo(rawToken) {
    const w = String(rawToken || "").trim();
    if (!w) return null;
    const lower = w.toLowerCase();
    if (typeof window !== "undefined" && window.nounMap instanceof Map) {
      const hit = window.nounMap.get(lower);
      if (hit) return hit;
    }
    if (typeof window !== "undefined" && Array.isArray(window.DE_NOUNS)) {
      const hit = window.DE_NOUNS.find((n) => n && String(n.lemma).toLowerCase() === lower);
      if (hit) return hit;
    }
    return null;
  }

  // --- Zusätzliche Lexika für Wort-für-Wort-Analyse ---
  const PERSONAL_PRONOUNS = {
    ich: { person: 1, number: "Singular", kasus: "Nominativ" },
    mich: { person: 1, number: "Singular", kasus: "Akkusativ" },
    mir: { person: 1, number: "Singular", kasus: "Dativ" },
    du: { person: 2, number: "Singular", kasus: "Nominativ" },
    dich: { person: 2, number: "Singular", kasus: "Akkusativ" },
    dir: { person: 2, number: "Singular", kasus: "Dativ" },
    er: { person: 3, number: "Singular", kasus: "Nominativ", genus: "Maskulinum" },
    ihn: { person: 3, number: "Singular", kasus: "Akkusativ", genus: "Maskulinum" },
    ihm: { person: 3, number: "Singular", kasus: "Dativ", genus: "Maskulinum/Neutrum" },
    sie: { person: 3, number: "Singular/Plural", kasus: "Nominativ/Akkusativ", genus: "Femininum/Plural" },
    ihr: { person: 3, number: "Singular/Plural", kasus: "Dativ/Nominativ Pl.", genus: "Femininum/Plural" },
    es: { person: 3, number: "Singular", kasus: "Nominativ/Akkusativ", genus: "Neutrum" },
    wir: { person: 1, number: "Plural", kasus: "Nominativ" },
    uns: { person: 1, number: "Plural", kasus: "Akkusativ/Dativ" },
    ihr_: { person: 2, number: "Plural", kasus: "Nominativ" }, // using ihr_ to separate from ihr dative
    euch: { person: 2, number: "Plural", kasus: "Akkusativ/Dativ" },
    sie_pl: { person: 3, number: "Plural", kasus: "Nominativ/Akkusativ" },
    ihnen: { person: 3, number: "Plural", kasus: "Dativ" },
    "sie.": { person: 3, number: "Singular", kasus: "Nominativ/Akkusativ", genus: "Femininum" },
  };

  const POSSESSIVE_BASE = {
    mein: { person: 1, number: "Singular" },
    dein: { person: 2, number: "Singular" },
    sein: { person: 3, number: "Singular", genus: "Maskulinum/Neutrum" },
    ihr: { person: 3, number: "Singular/Plural", genus: "Femininum/Plural" },
    unser: { person: 1, number: "Plural" },
    euer: { person: 2, number: "Plural" },
    ihr_höflich: { person: 3, number: "Singular/Plural", polite: true },
  };

  const DEFINITE_ARTICLES = {
    der: [{ kasus: "Nominativ", genus: "Maskulinum", numerus: "Singular" }, { kasus: "Genitiv/Dativ", genus: "Femininum", numerus: "Singular" }, { kasus: "Genitiv", genus: "Plural", numerus: "Plural" }],
    die: [{ kasus: "Nominativ/Akkusativ", genus: "Femininum", numerus: "Singular" }, { kasus: "Nominativ/Akkusativ", genus: "—", numerus: "Plural" }],
    das: [{ kasus: "Nominativ/Akkusativ", genus: "Neutrum", numerus: "Singular" }],
    den: [{ kasus: "Akkusativ", genus: "Maskulinum", numerus: "Singular" }, { kasus: "Dativ", genus: "—", numerus: "Plural" }],
    dem: [{ kasus: "Dativ", genus: "Maskulinum/Neutrum", numerus: "Singular" }],
    des: [{ kasus: "Genitiv", genus: "Maskulinum/Neutrum", numerus: "Singular" }],
  };

  const INDEFINITE_ARTICLES = {
    ein: [{ kasus: "Nominativ", genus: "Maskulinum/Neutrum", numerus: "Singular" }],
    eine: [{ kasus: "Nominativ/Akkusativ", genus: "Femininum", numerus: "Singular" }],
    einer: [{ kasus: "Genitiv/Dativ", genus: "Femininum", numerus: "Singular" }],
    einen: [{ kasus: "Akkusativ", genus: "Maskulinum", numerus: "Singular" }],
    einem: [{ kasus: "Dativ", genus: "Maskulinum/Neutrum", numerus: "Singular" }],
    eines: [{ kasus: "Genitiv", genus: "Maskulinum/Neutrum", numerus: "Singular" }],
  };

  const SIMPLE_NOUN_GENUS = {
    hotel: "Neutrum",
    zimmer: "Neutrum",
    restaurant: "Neutrum",
    arzt: "Maskulinum",
    apotheke: "Femininum",
    bahnhof: "Maskulinum",
    zug: "Maskulinum",
    bus: "Maskulinum",
    taxi: "Neutrum",
    ticket: "Neutrum",
    mapa: "Femininum",
    karte: "Femininum",
    preis: "Maskulinum",
    rechnung: "Femininum",
    internet: "Neutrum",
  };

  const SIMPLE_PAST_MARKERS = SIMPLE_PAST_FORMS;
  const SEIN_BEWEGUNG = new Set(["gehen", "kommen", "fahren", "rennen", "fliegen", "laufen", "reisen", "springen", "zurückkehren", "ankommen", "abreisen", "weggehen", "nachhausegehen"]);
  const SEIN_ZUSTAND = new Set(["werden", "sterben", "einschlafen", "aufwachen", "bleiben", "sein", "passieren"]);

  function deriveArticleInfo(form) {
    const lower = form.toLowerCase();
    const def = DEFINITE_ARTICLES[lower];
    const indef = INDEFINITE_ARTICLES[lower];
    let artikeltyp = null;
    let optionen = [];
    if (def) {
      artikeltyp = "bestimmt";
      optionen = def;
    } else if (indef) {
      artikeltyp = "unbestimmt";
      optionen = indef;
    }
    if (!optionen.length) return null;
    const first = optionen[0];
    const gender =
      first.genus && first.genus !== "—"
        ? first.genus
        : optionen.length === 1
        ? first.genus || "unbekannt"
        : "unbekannt";
    const label = optionen
      .map((o) => {
        const kas = o.kasus || "?";
        const gen = o.genus || "?";
        const num = o.numerus || "?";
        return `${kas} ${gen} ${num}`.replace(/\s+/g, " ").trim();
      })
      .join(" / ");
    const kurzregel = `${artikeltyp === "bestimmt" ? "Bestimmter" : "Unbestimmter"} Artikel`;
    const tooltip = [`Form: "${form}"`, `Typ: ${artikeltyp}`, `Kasus/Genus/Numerus: ${label}`].join(" · ");
    return {
      artikeltyp,
      gender: gender,
      info: `${kurzregel} · ${label}`,
      tooltip,
    };
  }

  const NON_VERB_TOKENS = new Set([
    "gut",
    "schlecht",
    "gern",
    "sehr",
    "nicht",
    "heute",
    "hier",
    "dort",
    "immer",
    "oft",
    "wenig",
    "viel",
    "schon",
    "noch",
    ".",
    ",",
    "!",
    "?",
  ]);

  const COMMON_VERBS = {
    sein: { klasse: "stark", reflexiv: false, trennbar: false, hilfsverb: "sein", kopula: true },
    werden: { klasse: "stark", reflexiv: false, trennbar: false, hilfsverb: "sein", kopula: true },
    bleiben: { klasse: "stark", reflexiv: false, trennbar: false, hilfsverb: "sein", kopula: true },
    heißen: { klasse: "schwach", reflexiv: false, trennbar: false, hilfsverb: "haben", kopula: true },
    gehen: { klasse: "stark", reflexiv: false, trennbar: false, hilfsverb: "sein" },
    sprechen: { klasse: "stark", reflexiv: false, trennbar: false, hilfsverb: "haben" },
    kommen: { klasse: "stark", reflexiv: false, trennbar: false, hilfsverb: "sein" },
    lernen: { klasse: "schwach", reflexiv: false, trennbar: false, hilfsverb: "haben" },
    arbeiten: { klasse: "schwach", reflexiv: false, trennbar: false, hilfsverb: "haben" },
    brauchen: { klasse: "schwach", reflexiv: false, trennbar: false, hilfsverb: "haben" },
    haben: { klasse: "unregelmäßig", reflexiv: false, trennbar: false, hilfsverb: "haben" },
  };

  const COMMON_VERB_FORMS = {
    bin: "sein",
    bist: "sein",
    ist: "sein",
    sind: "sein",
    seid: "sein",
    war: "sein",
    warst: "sein",
    waren: "sein",
    wart: "sein",
    werde: "werden",
    wirst: "werden",
    wird: "werden",
    werden: "werden",
    werdet: "werden",
    blieb: "bleiben",
    bleibe: "bleiben",
    bleibst: "bleiben",
    bleibt: "bleiben",
    heiße: "heißen",
    heißt: "heißen",
    heisst: "heißen",
    heißen: "heißen",
    sprechen: "sprechen",
    spreche: "sprechen",
    sprichst: "sprechen",
    spricht: "sprechen",
    spracht: "sprechen",
    sprach: "sprechen",
    sprachst: "sprechen",
    sprechen: "sprechen",
    arbeitet: "arbeiten",
    arbeite: "arbeiten",
    arbeitest: "arbeiten",
    arbeiten: "arbeiten",
    lerne: "lernen",
    lernst: "lernen",
    lernt: "lernen",
    lernen: "lernen",
    komme: "kommen",
    kommst: "kommen",
    kommt: "kommen",
    brauchen: "brauchen",
    brauche: "brauchen",
    brauchst: "brauchen",
    braucht: "brauchen",
    habe: "haben",
    hast: "haben",
    hat: "haben",
    habt: "haben",
    hatten: "haben",
    hatte: "haben",
    hattest: "haben",
    gelernt: "lernen",
    gehe: "gehen",
    gehst: "gehen",
    geht: "gehen",
    gehen: "gehen",
    ging: "gehen",
    gingen: "gehen",
    gegangen: "gehen",
  };

  function normalizeSentence(sentence) {
    return sentence.replace(/\s+/g, " ").trim();
  }

  function tokenize(text) {
    return normalizeSentence(text)
      .replace(/([,;:.!?])/g, " $1 ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function splitClauses(tokens) {
    const clauses = [];
    let current = [];
    tokens.forEach((t) => {
      if (t === ",") {
        if (current.length) clauses.push(current);
        current = [];
        return;
      }
      current.push(t);
    });
    if (current.length) clauses.push(current);
    return clauses;
  }

  function isPunctuation(token) {
    return /^[,;:.!?]$/.test(token);
  }

  function firstWord(tokens) {
    return (tokens.find((t) => !isPunctuation(t)) || "").toLowerCase();
  }

  function isSonstish(word) {
    const lower = word.toLowerCase();
    return lower === "sonst" || lower === "sons";
  }

  function classifyClause(tokens, idx) {
    const first = firstWord(tokens);
    let role = "Hauptsatz";
    let funktion = null;
    if (SUBORDINATE_MARKERS[first] !== undefined) {
      role = "Nebensatz";
      funktion = SUBORDINATE_MARKERS[first];
    } else if (idx > 0 && (COORDINATORS.has(first) || isSonstish(first))) {
      role = "Hauptsatz";
      funktion = isSonstish(first) ? "Folge/Alternative" : first === "sonst" ? "Folge/Alternative" : "Koordination";
    }
    return { role, funktion };
  }

  function lookupVerb(token) {
    const info = verbIndex.get(token.toLowerCase());
    return info ? { ...info, form: token } : null;
  }

  function isImperativeCandidate(token) {
    const lower = token.toLowerCase();
    return VERB_INF_LIST.some((inf) => inf === `${lower}en` || inf === `${lower}n` || inf === lower);
  }

  function buildImperativeFinite(token) {
    const lower = token.toLowerCase();
    const match = VERB_INF_LIST.find((inf) => inf === `${lower}en` || inf === `${lower}n` || inf === lower);
    if (!match) return null;
    return {
      index: 0,
      token,
      info: { type: "finite", form: lower, inf: match, category: "main", person: 2, number: "Singular" },
      imperative: true,
    };
  }

  function detectFiniteVerb(tokens) {
    for (let i = 0; i < tokens.length; i += 1) {
      const info = lookupVerb(tokens[i]);
      if (info && info.type === "finite") return { index: i, token: tokens[i], info };
    }
    if (tokens[0] && isImperativeCandidate(tokens[0])) {
      return buildImperativeFinite(tokens[0]);
    }
    return null;
  }

  function detectParticiple(tokens) {
    for (let i = 0; i < tokens.length; i += 1) {
      const lower = tokens[i].toLowerCase();
      if (participleSet.has(lower) || (lower.startsWith("ge") && lower.length > 4 && /en|t$/.test(lower))) {
        return { index: i, token: tokens[i], lemma: lower.replace(/^ge/, "").replace(/(en|t)$/i, "") };
      }
    }
    return null;
  }

  function detectInfinitive(tokens) {
    for (let i = 0; i < tokens.length; i += 1) {
      const lower = tokens[i].toLowerCase();
      if (infinitiveSet.has(lower) || lower.endsWith("en")) return { index: i, token: tokens[i], lemma: lower };
    }
    return null;
  }

  function detectSentenceType(tokens, originalText, finiteVerb, imperativeHint) {
    const clauseText = tokens.join(" ");
    const first = firstWord(tokens);
    if (clauseText.trim().endsWith("?") || originalText.trim().endsWith("?") || QUESTION_WORDS.has(first)) return "Fragesatz";
    if (imperativeHint) return "Imperativsatz";
    if (finiteVerb && finiteVerb.index === 0 && !tokens.some((t) => NOM_PRONOUNS.has(t.toLowerCase()))) {
      return "Imperativsatz";
    }
    return "Aussagesatz";
  }

  function detectTense(tokens, finiteVerb, participle, infinitive) {
    const lowerTokens = tokens.map((t) => t.toLowerCase());
    const finiteLemma = finiteVerb?.info?.inf;
    const hadAuxPast = lowerTokens.some((t) => ["hatte", "hattest", "hattet", "hatten"].includes(t));
    const wasAuxPast = lowerTokens.some((t) => ["war", "warst", "wart", "waren"].includes(t));

    if (finiteLemma === "werden" && infinitive) return "Futur I";
    if ((finiteLemma === "haben" || finiteLemma === "sein") && participle) return "Perfekt";
    if ((hadAuxPast || wasAuxPast) && participle) return "Plusquamperfekt";
    if (finiteLemma && SIMPLE_PAST_FORMS.has(finiteVerb.token.toLowerCase())) return "Präteritum";
    if (!finiteLemma && lowerTokens.some((t) => SIMPLE_PAST_FORMS.has(t))) return "Präteritum";
    return finiteLemma ? "Präsens" : "unbestimmt";
  }

  function detectSubject(tokens, finiteVerb) {
    const finiteIndex = finiteVerb?.index ?? -1;
    const limit = finiteIndex >= 0 ? finiteIndex : tokens.length;
    for (let i = 0; i < limit; i += 1) {
      const lower = tokens[i].toLowerCase();
      if (QUESTION_WORDS.has(lower)) continue;
      if (NOM_PRONOUNS.has(lower)) return tokens[i];
      if (/^[A-ZÄÖÜ]/.test(tokens[i])) return tokens[i];
    }
    if (finiteIndex === 0 && finiteVerb?.info?.person === 2) {
      return finiteVerb.info.number === "Plural" ? "(ihr)" : "(du)";
    }
    if (finiteIndex === 0 && finiteVerb?.imperative) return "(du)";
    const esIdx = tokens.findIndex((t, i) => i <= finiteIndex + 1 && t.toLowerCase() === "es");
    if (esIdx !== -1) return tokens[esIdx];
    return null;
  }

  function detectObjects(tokens, finiteIndex, usedIndices = new Set(), subjekt = null) {
    const objects = [];
    const used = new Set();
    for (let i = finiteIndex + 1; i < tokens.length; i += 1) {
      if (usedIndices.has(i)) continue;
      if (isPunctuation(tokens[i])) continue;
      const lower = tokens[i].toLowerCase();
      if (!subjekt && lower === "es") continue;
      if (subjekt && subjekt.toLowerCase() === lower) continue;
      if (AKK_PRON.has(lower)) {
        objects.push({ text: tokens[i], typ: "Akkusativobjekt" });
        used.add(i);
      } else if (DAT_PRON.has(lower)) {
        objects.push({ text: tokens[i], typ: "Dativobjekt" });
        used.add(i);
      } else if (/^[A-ZÄÖÜ]/.test(tokens[i])) {
        objects.push({ text: tokens[i], typ: "unbestimmt" });
        used.add(i);
      }
    }
    return { objects, used };
  }

  function mapAdvGroupToType(group) {
    if (group === "time" || group === "frequency") return "Temporal";
    if (group === "place") return "Lokal";
    if (group === "manner") return "Modal";
    return "unbestimmt";
  }

  function derivePrepType(base) {
    if (["nach", "in", "auf", "vor", "hinter", "neben", "zu", "bei"].includes(base)) return "Lokal";
    if (["mit", "ohne"].includes(base)) return "Modal";
    return "unbestimmt";
  }

  function detectAdverbials(tokens, finiteVerb) {
    const adverbiale = [];
    const used = new Set();

    tokens.forEach((tok, idx) => {
      const lower = tok.toLowerCase();
      if (lower === "hier") {
        adverbiale.push({ text: tok, typ: "Lokal", question: "Wo?", indices: [idx] });
        used.add(idx);
        return;
      }
      if ((lower === "sonst" || (idx === 0 && lower === "sons")) && idx === 0) {
        adverbiale.push({ text: tok, typ: "Folge/Alternative", question: "Und sonst?", indices: [idx] });
        used.add(idx);
        return;
      }
      const advEntry = ADVERBS.find((a) => a.base === lower);
      if (advEntry) {
        const typ = mapAdvGroupToType(advEntry.group);
        const question = typ === "Temporal" ? "Wann?" : typ === "Lokal" ? "Wo?" : typ === "Modal" ? "Wie?" : null;
        adverbiale.push({ text: tok, typ, question, indices: [idx] });
        used.add(idx);
      }
    });

    for (let i = 0; i < tokens.length; i += 1) {
      const lower = tokens[i].toLowerCase();
      if (lower === "sonst" || (i === 0 && lower === "sons")) continue;
      if (lower === "nach" && tokens[i + 1] && tokens[i + 1].toLowerCase() === "hause") {
        const text = `${tokens[i]} ${tokens[i + 1]}`;
        adverbiale.push({ text, typ: "Richtung", question: "Wohin?", indices: [i, i + 1] });
        used.add(i);
        used.add(i + 1);
        continue;
      }
      if (lower === "aus") {
        const next = tokens[i + 1] && !isPunctuation(tokens[i + 1]) ? tokens[i + 1] : "";
        const text = [tokens[i], next].filter(Boolean).join(" ");
        const indices = [i];
        if (next) indices.push(i + 1);
        adverbiale.push({ text, typ: "Herkunft", question: "Woher?", indices });
        indices.forEach((id) => used.add(id));
        continue;
      }
      if (lower === "von" || lower === "vom") {
        const next = tokens[i + 1] && !isPunctuation(tokens[i + 1]) ? tokens[i + 1] : "";
        const text = [tokens[i], next].filter(Boolean).join(" ");
        const indices = [i];
        if (next) indices.push(i + 1);
        adverbiale.push({ text, typ: "Herkunft", question: "Woher?", indices });
        indices.forEach((id) => used.add(id));
        continue;
      }
      if (lower === "zu" && finiteVerb?.info?.inf === "werden") {
        continue;
      }
      const prep = PREPS.find((p) => p.base === lower);
      if (prep) {
        const next = tokens[i + 1] && !isPunctuation(tokens[i + 1]) ? tokens[i + 1] : "";
        const text = [tokens[i], next].filter(Boolean).join(" ");
        const indices = [i];
        if (next) indices.push(i + 1);
        const typ = derivePrepType(prep.base);
        let question = null;
        if (typ === "Lokal") question = "Wo?";
        if (typ === "Modal") question = "Wie?";
        adverbiale.push({ text, typ, question, indices });
        indices.forEach((id) => used.add(id));
      }
    }

    return { adverbiale, used };
  }

  function detectPraedikativ(tokens, finiteIndex, usedIndices) {
    if (finiteIndex < 0) return null;
    const remaining = [];
    for (let i = finiteIndex + 1; i < tokens.length; i += 1) {
      if (usedIndices.has(i)) continue;
      if (isPunctuation(tokens[i])) continue;
      remaining.push(tokens[i]);
    }
    return remaining.length ? remaining.join(" ") : null;
  }

  function hasReflexivePronoun(tokens, finiteIndex) {
    const reflexiv = new Set(["mich", "dich", "sich", "uns", "euch"]);
    const limit = finiteIndex >= 0 ? finiteIndex + 1 : tokens.length;
    return tokens.slice(0, limit + 1).some((t) => reflexiv.has(t.toLowerCase()));
  }

  function deriveAuxForPerfekt(mainLemma, objects, reflexivePresent) {
    const hasAkk = (objects || []).some((o) => (o.typ || "").toLowerCase().includes("akk"));
    if (hasAkk) {
      const objText = objects.filter((o) => (o.typ || "").toLowerCase().includes("akk")).map((o) => o.text).join(", ");
      return { aux: "haben", reason: `HABEN, weil transitives Verb mit Akkusativobjekt${objText ? ": " + objText : ""}.` };
    }
    if (reflexivePresent) {
      return { aux: "haben", reason: "HABEN, weil reflexives Verb." };
    }
    if (mainLemma && (SEIN_BEWEGUNG.has(mainLemma) || SEIN_ZUSTAND.has(mainLemma))) {
      const typ = SEIN_BEWEGUNG.has(mainLemma) ? "Ortswechsel/Bewegung" : "Zustandsänderung/Verbleib";
      return { aux: "sein", reason: `SEIN, weil ${typ} (${mainLemma}).` };
    }
    return { aux: "haben", reason: "HABEN, Standardregel (kein Akkusativobjekt/keine Bewegung erkannt)." };
  }

  function buildPraedikat(zeitform, finiteVerb, participle, infinitive) {
    if (!finiteVerb) return null;
    if (zeitform === "Perfekt" || zeitform === "Plusquamperfekt") {
      return [finiteVerb.token, participle?.token].filter(Boolean).join(" ").trim();
    }
    if (zeitform === "Futur I") {
      return [finiteVerb.token, infinitive?.token].filter(Boolean).join(" ").trim();
    }
    return finiteVerb.token;
  }

  function analyzeClause(tokens, clauseIdx, totalClauses, fullSentence) {
    const { role, funktion } = classifyClause(tokens, clauseIdx);
    const finiteVerb = detectFiniteVerb(tokens);
    const participle = detectParticiple(tokens);
    const infinitive = detectInfinitive(tokens);
    const zeitform = detectTense(tokens, finiteVerb, participle, infinitive);
    const imperativeHint = finiteVerb?.index === 0 && finiteVerb?.info?.person === 2;
    const satztyp = detectSentenceType(tokens, fullSentence, finiteVerb, imperativeHint);
    const subjekt = detectSubject(tokens, finiteVerb);
    const { adverbiale, used: usedAdverbials } = detectAdverbials(tokens, finiteVerb);
    const { objects, used: usedObjects } = detectObjects(tokens, finiteVerb?.index ?? -1, usedAdverbials, subjekt || null);
    const used = new Set([...usedObjects, ...usedAdverbials]);
    if (subjekt) {
      const subjIdx = tokens.findIndex((t) => t === subjekt);
      if (subjIdx !== -1) used.add(subjIdx);
    }
    const praedikativ = detectPraedikativ(tokens, finiteVerb?.index ?? -1, used);
    const praedikat = buildPraedikat(zeitform, finiteVerb, participle, infinitive);
    let hilfsverb = null;
    let hilfsverbBegruendung = null;
    const isComposite = zeitform === "Perfekt" || zeitform === "Plusquamperfekt" || zeitform === "Futur II";
    if (isComposite) {
      const mainLemma = participle?.lemma || infinitive?.lemma || finiteVerb?.info?.inf || finiteVerb?.token?.toLowerCase();
      const reflexive = hasReflexivePronoun(tokens, finiteVerb?.index ?? -1);
      const derived = deriveAuxForPerfekt(mainLemma, objects, reflexive);
      hilfsverb = finiteVerb?.info?.inf === "sein" ? "sein" : "haben";
      if (!hilfsverb) hilfsverb = derived.aux;
      hilfsverbBegruendung = derived.reason;
    }

    return {
      text: tokens.join(" ").replace(/\s+([,;:.!?])/g, "$1"),
      role,
      funktion,
      satztyp,
      zeitform,
      subjekt: subjekt || null,
      praedikat: praedikat || null,
      praedikativ: praedikativ || null,
      objekte: objects,
      adverbiale: adverbiale.map((a) => ({ text: a.text, typ: a.typ, question: a.question })),
      hilfsverb,
      hilfsverbBegruendung,
      rohdaten: { tokens: tokens.slice() },
    };
  }

  function analyzeGermanSentence(sentence) {
    const normalized = normalizeSentence(sentence || "");
    const tokens = tokenize(normalized);
    if (!tokens.length) {
      return { original: normalized, status: "elliptisch", clauses: [] };
    }

    const clauseTokens = splitClauses(tokens);
    const clauses = clauseTokens.map((c, idx) => analyzeClause(c, idx, clauseTokens.length, normalized));

    const hasFinite = clauses.some((c) => c.praedikat);
    const hasSubject = clauses.some((c) => c.subjekt);
    let status = "ok";
    if (!hasFinite) status = "elliptisch";
    else if (!hasSubject) status = "unsicher";

    return { original: normalized, status, clauses };
  }

  function guessVerbFeatures(token) {
    const lower = token.toLowerCase();
    const entry = verbIndex.get(lower);
    const morph = {};
    if (lower === "geht") {
      morph.person = 3;
      morph.numerus = "Singular";
      morph.tempus = "Präsens";
    }
    if (entry?.type === "finite") {
      morph.person = entry.person || "—";
      morph.numerus = entry.number || "—";
      if (SIMPLE_PAST_MARKERS.has(lower)) {
        morph.tempus = "Präteritum";
      } else {
        morph.tempus = "Präsens";
      }
    } else if (entry?.type === "participle" || (lower.startsWith("ge") && /en|t$/.test(lower))) {
      morph.tempus = "Partizip II";
    } else if (lower.endsWith("en") || lower.endsWith("n")) {
      morph.tempus = "Infinitiv";
    } else if (SIMPLE_PAST_MARKERS.has(lower)) {
      morph.tempus = "Präteritum";
    } else {
      morph.tempus = "unbekannt";
    }
    morph.modus = "Indikativ";
    return { lemma: entry?.inf || lower, morph };
  }

  function analyzePronoun(token) {
    const lower = token.toLowerCase();
    if (PERSONAL_PRONOUNS[lower]) {
      return {
        pos: "Personalpronomen",
        lemma: lower,
        morph: { ...PERSONAL_PRONOUNS[lower] },
        role_de:
          PERSONAL_PRONOUNS[lower].kasus?.includes("Nominativ") ? "Subjekt (wahrscheinlich)" : PERSONAL_PRONOUNS[lower].kasus?.includes("Akkusativ")
          ? "Akkusativobjekt (wahrscheinlich)"
          : PERSONAL_PRONOUNS[lower].kasus?.includes("Dativ")
          ? "Dativobjekt (wahrscheinlich)"
          : undefined,
        explain_de: "Personalpronomen.",
      };
    }
    return null;
  }

  function analyzePossessive(token) {
    const lower = token.toLowerCase();
    const base =
      lower.startsWith("mein") ? "mein" :
      lower.startsWith("dein") ? "dein" :
      lower.startsWith("sein") ? "sein" :
      lower.startsWith("ihr") ? "ihr" :
      lower.startsWith("unser") ? "unser" :
      lower.startsWith("euer") ? "euer" :
      lower === "ihr" || lower.startsWith("ihr") ? "ihr_höflich" :
      null;

    if (!base) return null;
    const info = POSSESSIVE_BASE[base];
    if (!info) return null;

    const ending = lower.slice(base.replace("_höflich", "").length);
    let kasus = null;
    let genus = null;
    let numerus = null;
    if (ending === "e") {
      kasus = "Nominativ/Akkusativ";
      genus = "Femininum";
      numerus = "Singular";
    } else if (ending === "er") {
      kasus = "Genitiv/Dativ";
      genus = "Femininum";
      numerus = "Singular";
    } else if (ending === "es") {
      kasus = "Genitiv";
      genus = "Maskulinum/Neutrum";
      numerus = "Singular";
    } else if (ending === "en") {
      kasus = "Akkusativ/Dativ";
      numerus = "Singular";
    } else if (ending === "em") {
      kasus = "Dativ";
      numerus = "Singular";
    }

    return {
      pos: "Possessivartikel",
      lemma: base.replace("_höflich", "Ihr"),
      morph: {
        besitzer: `${info.person}. Person ${info.number}`,
        kasus: kasus || "unklar",
        genus: genus || info.genus || "unklar",
        numerus: numerus || info.number || "unklar",
      },
      explain_de: "Possessivbegleiter.",
    };
  }

  function analyzeArticle(token) {
    const lower = token.toLowerCase();
    const def = DEFINITE_ARTICLES[lower];
    const indef = INDEFINITE_ARTICLES[lower];
    const info = deriveArticleInfo(lower);
    if (def) {
      return {
        pos: "Artikel (bestimmt)",
        lemma: lower,
        morph: def.length === 1 ? def[0] : { möglich: def.map((d) => `${d.kasus} ${d.genus || ""} ${d.numerus || ""}`).join("; ") },
        explain_de: "Bestimmter Artikel.",
        gender: info?.gender || "unbekannt",
        articleInfo: info?.info || "",
        tooltip: info?.tooltip || "",
      };
    }
    if (indef) {
      return {
        pos: "Artikel (unbestimmt)",
        lemma: lower,
        morph: indef.length === 1 ? indef[0] : { möglich: indef.map((d) => `${d.kasus} ${d.genus || ""} ${d.numerus || ""}`).join("; ") },
        explain_de: "Unbestimmter Artikel.",
        gender: info?.gender || "unbekannt",
        articleInfo: info?.info || "",
        tooltip: info?.tooltip || "",
      };
    }
    return null;
  }

  function analyzeAdjAdv(token) {
    const lower = token.toLowerCase();
    if (!NON_VERB_TOKENS.has(lower)) return null;
    return {
      pos: "Adjektiv/Adverb",
      lemma: lower,
      morph: {},
      explain_de: "Nicht-Verb (festgelegt), typischerweise Adjektiv/Adverb.",
    };
  }

  function analyzePreposition(token) {
    const lower = token.toLowerCase();
    const prep = PREPS.find((p) => p.base === lower);
    if (!prep) return null;
    const question =
      lower === "aus" || lower === "von" || lower === "vom"
        ? "Woher?"
        : lower === "nach"
        ? "Wohin?"
        : lower === "mit"
        ? "Womit?"
        : null;
    const kasus = lower === "aus" || lower === "von" || lower === "vom" ? "Dativ" : undefined;
    return {
      pos: "Präposition",
      lemma: lower,
      morph: { kasus: kasus || prep.kasus || "Regierung unklar" },
      explain_de: "Präposition.",
      role_de: prep.group === "place" ? "Adverbiale (Ort/Richtung)" : "Adverbiale (Präposition)",
      question_de: question,
    };
  }

  function analyzeNoun(token) {
    const lower = token.toLowerCase();
    const genus = SIMPLE_NOUN_GENUS[lower];
    const isPlural = lower.endsWith("en") || lower.endsWith("e") || lower.endsWith("er") || lower.endsWith("s");
    return {
      pos: "Nomen",
      lemma: lower,
      morph: { genus: genus || "unbekannt", numerus: isPlural ? "Plural (Heuristik)" : "Singular/unklar" },
      explain_de: "Nomen (Heuristik).",
    };
  }

  function analyzeVerb(token) {
    const { lemma, morph } = guessVerbFeatures(token);
    const meta = COMMON_VERBS[lemma];
    if (meta) {
      morph.klasse = meta.klasse;
      morph.reflexiv = meta.reflexiv ? "ja" : "nein";
      morph.trennbar = meta.trennbar ? "ja" : "nein";
      if (meta.hilfsverb) morph.hilfsverb = meta.hilfsverb;
    }
    return {
      pos: "Verb",
      lemma,
      morph,
      explain_de: "Verbform.",
      role_de: "Prädikat (wahrscheinlich)",
    };
  }

  function analyzeGermanTokensDetailed(sentence) {
    const tokens = tokenize(sentence);
    if (!tokens.length) return [];

    const rows = tokens.map((tok, idx) => {
      const lower = tok.toLowerCase();
      if (lower === "wie") {
        return {
          token: tok,
          pos: "Adverb (Fragewort)",
          lemma: "wie",
          morph: { typ: "Fragewort", gruppe: "Art und Weise" },
          explain_de: "Frageadverb (Art und Weise).",
          role_de: "Adverbiale (Frage/Art und Weise)",
        };
      }
      if (isPunctuation(tok)) {
        return {
          token: tok,
          pos: "Satzzeichen",
          lemma: tok,
          morph: {},
          explain_de: "Satzzeichen.",
        };
      }
      const pron = analyzePronoun(lower);
      if (pron) return { token: tok, ...pron };

      const poss = analyzePossessive(lower);
      if (poss) return { token: tok, ...poss };

      const art = analyzeArticle(lower);
      if (art) return { token: tok, ...art };

      const adj = analyzeAdjAdv(lower);
      if (adj) return { token: tok, ...adj };

      const prepInfo = analyzePreposition(lower);
      if (prepInfo) return { token: tok, ...prepInfo };

      // Selbsttest: "Ich brauche einen Arzt." -> "Arzt" bleibt Nomen (kein Verb).
      const shouldCheckNoun = idx > 0 || /^[A-ZÄÖÜ]/.test(tok);
      if (shouldCheckNoun) {
        const nounHit = lookupNounInfo(tok);
        if (nounHit) {
          const morph = { genus: nounHit.gender || nounHit.genus || "unbekannt" };
          if (nounHit.numerus) morph.numerus = nounHit.numerus;
          else if (nounHit.plural) morph.numerus = "Plural";
          const articleInfo = nounHit.article ? `Artikel: ${nounHit.article}` : null;
          return {
            token: tok,
            pos: "Nomen",
            lemma: nounHit.lemma || lower,
            morph,
            gender: nounHit.gender || nounHit.genus,
            articleInfo: articleInfo || undefined,
            tooltip: articleInfo || undefined,
            explain_de: "Nomen (Datenbanktreffer).",
          };
        }
      }

      const verb = verbIndex.get(lower);
      if (verb || COMMON_VERB_FORMS[lower] || lower.startsWith("ge") || lower.endsWith("en") || lower.endsWith("st") || lower.endsWith("t")) {
        return { token: tok, ...analyzeVerb(COMMON_VERB_FORMS[lower] || lower) };
      }

      const advEntry = ADVERBS.find((a) => a.base === lower);
      if (advEntry) {
        return {
          token: tok,
          pos: "Adverb",
          lemma: advEntry.base,
          morph: { gruppe: advEntry.group || "unbekannt" },
          explain_de: "Adverb (Umstandsangabe).",
          role_de: "Adverbiale (Heuristik)",
        };
      }

      return { token: tok, ...analyzeNoun(lower) };
    });

    annotateNominalGroups(rows);

    // Satztyp/Subjekt-Objekt Heuristik
    tokens.forEach((tok, idx) => {
      const lower = tok.toLowerCase();
      if (PERSONAL_PRONOUNS[lower]?.kasus?.includes("Nominativ") && !rows[idx].role_de) {
        rows[idx].role_de = "Subjekt (Heuristik)";
      } else if (PERSONAL_PRONOUNS[lower]?.kasus?.includes("Akkusativ") && !rows[idx].role_de) {
        rows[idx].role_de = "Akkusativobjekt (Heuristik)";
      } else if (PERSONAL_PRONOUNS[lower]?.kasus?.includes("Dativ") && !rows[idx].role_de) {
        rows[idx].role_de = "Dativ-Ergänzung";
      }
    });

    // Kopula-Prädikativ-Heuristik
    rows.forEach((row, idx) => {
      if (row.pos === "Verb" && COMMON_VERBS[row.lemma]?.kopula) {
        const next = rows[idx + 1];
        if (next && !next.role_de && (next.pos === "Nomen" || next.pos === "Eigenname/Nomen")) {
          next.role_de = "Prädikativ (Kopula)";
        }
      }
    });

    // Einfache Objekt-Heuristik: erstes Nomen nach Verb ohne Rolle -> Akkusativobjekt
    rows.forEach((row, idx) => {
      if (row.pos === "Verb") {
        for (let j = idx + 1; j < rows.length; j += 1) {
          if (rows[j].pos === "Nomen" && !rows[j].role_de) {
            rows[j].role_de = "Akkusativobjekt (Heuristik)";
            break;
          }
        }
      }
    });

    // Adverbiale für typische Phrasen
    rows.forEach((row, idx) => {
      const lower = row.token?.toLowerCase() || "";
      if ((lower === "ein" || lower === "eine") && rows[idx + 1]?.token?.toLowerCase() === "wenig") {
        rows[idx].role_de = "Adverbiale (Grad)";
        rows[idx + 1].role_de = "Adverbiale (Grad)";
      }
    });

    // Muster: DAT + geht + es + X -> Prädikativ (Zustand)
    for (let i = 0; i < rows.length - 3; i += 1) {
      const a = rows[i];
      const b = rows[i + 1];
      const c = rows[i + 2];
      const d = rows[i + 3];
      const aLower = (a.token || "").toLowerCase();
      const bLower = (b.token || "").toLowerCase();
      const cLower = (c.token || "").toLowerCase();
      if (
        PERSONAL_PRONOUNS[aLower]?.kasus?.includes("Dativ") &&
        bLower === "geht" &&
        cLower === "es" &&
        d
      ) {
        a.role_de = a.role_de || "Dativ-Ergänzung";
        c.role_de = c.role_de || "Subjekt (formell)";
        d.role_de = "Prädikativ (Zustand)";
        if (d.pos === "Verb") {
          d.pos = "Adjektiv/Adverb";
          d.explain_de = (d.explain_de || "").trim() || "Zustandsangabe.";
          if (d.morph) {
            delete d.morph.tempus;
            delete d.morph.person;
            delete d.morph.numerus;
          }
        }
      }
    }

    // Muster: W-Wort (wie) + geht + es + DAT -> Frage nach Zustand
    for (let i = 0; i < rows.length - 3; i += 1) {
      const a = rows[i];
      const b = rows[i + 1];
      const c = rows[i + 2];
      const d = rows[i + 3];
      const aLower = (a.token || "").toLowerCase();
      const bLower = (b.token || "").toLowerCase();
      const cLower = (c.token || "").toLowerCase();
      const dLower = (d.token || "").toLowerCase();
      if (aLower === "wie" && bLower === "geht" && cLower === "es" && PERSONAL_PRONOUNS[dLower]?.kasus?.includes("Dativ")) {
        a.role_de = "Adverbiale (Frage/Art und Weise)";
        b.role_de = "Prädikat (wahrscheinlich)";
        c.role_de = "Subjekt (formell)";
        d.role_de = "Dativ-Ergänzung";
      }
    }

    return rows;
  }

  function annotateNominalGroups(rows) {
    let currentGender = null;
    let currentInfo = null;
    const genderMap = { Maskulinum: "gender-m", Femininum: "gender-f", Neutrum: "gender-n", unbekannt: "gender-u" };
    const normalizeGender = (gender) => {
      const g = String(gender || "");
      if (!g) return "unbekannt";
      if (g.includes("Maskulin")) return "Maskulinum";
      if (g.includes("Feminin")) return "Femininum";
      if (g.includes("Neutrum")) return "Neutrum";
      return genderMap[g] ? g : "unbekannt";
    };
    const setGenderClass = (row, gender) => {
      const norm = normalizeGender(gender);
      const g = genderMap[norm] || "gender-u";
      row.genderClass = g;
      row.gender = row.gender || norm;
    };

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const lowerPos = (row.pos || "").toLowerCase();
      if (row.pos === "Satzzeichen" || lowerPos.includes("verb") || lowerPos.includes("pronomen")) {
        currentGender = null;
        currentInfo = null;
      }
      if (lowerPos.includes("artikel")) {
        currentGender = normalizeGender(row.gender) || "unbekannt";
        currentInfo = row.articleInfo || "";
        if (!row.gender) row.gender = currentGender;
        setGenderClass(row, currentGender);
        if (currentInfo && !row.explain_de?.includes(currentInfo)) {
          row.explain_de = row.explain_de ? `${row.explain_de} (${currentInfo})` : currentInfo;
        }
        continue;
      }
      if (lowerPos.includes("adjektiv") || row.pos === "Adverb" || lowerPos.includes("nomen")) {
        if (currentGender) {
          row.gender = row.gender || currentGender;
          row.genderClass = row.genderClass || genderMap[currentGender] || "gender-u";
        } else if (row.morph?.genus) {
          const norm = normalizeGender(row.morph.genus);
          row.gender = norm;
          row.genderClass = genderMap[norm] || "gender-u";
        }
      }
    }
  }

  function normalizeTempusLabel(t) {
    const map = {
      Präsens: "Präsens (Gegenwart)",
      Präteritum: "Präteritum (Vergangenheit)",
      Perfekt: "Perfekt (Vergangenheit)",
      Plusquamperfekt: "Plusquamperfekt",
      "Futur I": "Futur I (Zukunft)",
      "Futur II": "Futur II (vollendete Zukunft)",
      "Partizip II": "Partizip II",
      Infinitiv: "Infinitiv",
      unbestimmt: "unbestimmt",
    };
    return map[t] || t || "unbestimmt";
  }

  window.analyzeGermanTokensDetailed = analyzeGermanTokensDetailed;
  function summarizeGermanForUi(result, tokens) {
    if (!result) return null;
    const firstClause = result.clauses?.[0];
    const satzart = firstClause?.satztyp || (result.status === "elliptisch" ? "Ellipse" : "unsicher");
    const verbToken = tokens?.find((t) => t.pos === "Verb");
    const verb = verbToken
      ? `${verbToken.lemma || verbToken.token || ""} (${[
          verbToken.morph?.person ? `Person ${verbToken.morph.person}` : null,
          verbToken.morph?.numerus,
          normalizeTempusLabel(verbToken.morph?.tempus),
        ]
          .filter(Boolean)
          .join(", ")})`
      : "–";
    const subjekt =
      tokens?.find((t) => t.role_de?.toLowerCase().includes("subjekt"))?.token || firstClause?.subjekt || "–";
    const ergaenzungen = [];
    tokens?.forEach((t) => {
      if (t.role_de?.toLowerCase().includes("akkusativobjekt")) ergaenzungen.push(`${t.token} (Akk.)`);
      if (t.role_de?.toLowerCase().includes("dativobjekt")) ergaenzungen.push(`${t.token} (Dat.)`);
      if (t.role_de?.toLowerCase().includes("prädikativ")) ergaenzungen.push(`${t.token} (Prädikativ)`);
    });
    const adverbiale =
      tokens
        ?.filter((t) => t.role_de?.toLowerCase().includes("adverbiale"))
        .map((t) => t.token)
        .join(", ") || (firstClause?.adverbiale?.map((a) => a.text).join(", ") || "–");

    const isComposite = ["Perfekt", "Plusquamperfekt", "Futur II"].includes(firstClause?.zeitform);
    const aux = isComposite ? firstClause?.hilfsverb : null;
    const auxWhy = isComposite ? firstClause?.hilfsverbBegruendung : null;

    const fragen = buildQuestions(tokens || [], firstClause);

    return {
      satzart,
      verb,
      subjekt,
      ergaenzungen: ergaenzungen.length ? ergaenzungen.join("; ") : "–",
      adverbiale,
      hilfsverb: aux || null,
      hilfsverbWarum: auxWhy || null,
      fragen,
    };
  }

  function questionFromTyp(typ) {
    if (!typ) return null;
    const t = typ.toLowerCase();
    if (t.includes("herkunft")) return "Woher?";
    if (t.includes("richtung")) return "Wohin?";
    if (t.includes("lokal") || t.includes("ort")) return "Wo?";
    if (t.includes("modal") || t.includes("weise")) return "Wie?";
    if (t.includes("temp")) return "Wann?";
    return null;
  }

  function buildQuestions(tokens, clause) {
    const qs = [];
    const add = (label, question) => {
      if (!label || !question) return;
      qs.push(`${label} → Frage: ${question}`);
    };
    const subj = tokens.find((t) => t.role_de?.toLowerCase().includes("subjekt"));
    if (subj) add(`Subjekt: ${subj.token}`, "Wer/Was?");
    tokens.forEach((t) => {
      const role = (t.role_de || "").toLowerCase();
      if (role.includes("akkusativobjekt")) add(`Akkusativ: ${t.token}`, "Wen/Was?");
      else if (role.includes("dativ")) add(`Dativ: ${t.token}`, "Wem?");
      else if (role.includes("prädikativ")) add(`Prädikativ: ${t.token}`, "Was?");
      else if (role.includes("adverbiale") || t.pos === "Präposition") {
        let q = null;
        const lowerTok = (t.token || "").toLowerCase();
        if (lowerTok === "wie" || role.includes("art")) q = "Wie?";
        if (lowerTok === "aus" || lowerTok === "von" || lowerTok === "vom") q = "Woher?";
        if (lowerTok === "nach") q = "Wohin?";
        if (lowerTok === "mit") q = "Womit?";
        add(`Adverbiale: ${t.token}`, q || "Wie?");
      }
    });
    if (clause?.adverbiale) {
      clause.adverbiale.forEach((a) => {
        const q = a.question || questionFromTyp(a.typ);
        add(`${a.typ || "Adverbiale"}: ${a.text}`, q || "Wie?");
      });
    }
    return qs;
  }

  window.summarizeGermanForUi = summarizeGermanForUi;
  function explainGermanAnalysis(result) {
    if (!result || !result.clauses) return "Keine Analyse möglich.";
    const lines = [];
    lines.push(`Original: ${result.original || "-"}`);
    lines.push(`Status: ${result.status || "unsicher"}`);
    result.clauses.forEach((clause, idx) => {
      const headerParts = [`Teilsatz ${idx + 1}`, `(${clause.role}`];
      if (clause.funktion) headerParts.push(clause.funktion);
      headerParts.push(clause.satztyp, normalizeTempusLabel(clause.zeitform));
      lines.push(`${headerParts.filter(Boolean).join(", ").replace("(,", "(").replace(/,\s*\)/, ")")}:`);
      lines.push(`  Text: ${clause.text}`);
      lines.push(`  Subjekt: ${clause.subjekt || "—"}`);
      lines.push(`  Prädikat: ${clause.praedikat || "—"}`);
      if (clause.praedikativ) lines.push(`  Prädikativ: ${clause.praedikativ}`);
      if (clause.objekte?.length) {
        lines.push(`  Objekte: ${clause.objekte.map((o) => `${o.text} (${o.typ})`).join("; ")}`);
      } else {
        lines.push("  Objekte: —");
      }
      if (clause.adverbiale?.length) {
        lines.push(`  Adverbiale: ${clause.adverbiale.map((a) => `${a.text} (${a.typ})`).join("; ")}`);
      } else {
        lines.push("  Adverbiale: —");
      }
    });
    return lines.join("\n");
  }

  window.analyzeGermanSentence = analyzeGermanSentence;
  window.explainGermanAnalysis = explainGermanAnalysis;
  window.tokenizeGermanSentence = tokenize;
})();
