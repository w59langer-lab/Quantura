// ============================================================
// DE: Muster für Präposition + Ort (Präpositionalgruppen)
// EN: Patterns for "preposition + place" phrases
// RU: Шаблоны «предлог + место» для генератора
// ============================================================
const DE_PREP_PATTERNS = [
  // Richtung / wohin?
  {
    id: "nach_hause",
    prep: "nach",
    phrase: "nach Hause",
    case: "dat",
    question: "Wohin?",
    typicalVerbs: ["gehen", "fahren", "kommen"],
    note: "Richtung, nach Hause",
  },
  {
    id: "ins_haus",
    prep: "in",
    phrase: "ins Haus",
    case: "akk",
    question: "Wohin?",
    typicalVerbs: ["gehen", "laufen", "rennen", "fahren"],
    note: "Richtung in ein Gebäude",
  },
  {
    id: "in_die_stadt",
    prep: "in",
    phrase: "in die Stadt",
    case: "akk",
    question: "Wohin?",
    typicalVerbs: ["gehen", "fahren", "kommen"],
    note: "Richtung in die Stadt",
  },
  {
    id: "zur_schule",
    prep: "zu",
    phrase: "zur Schule",
    case: "dat",
    question: "Wohin?",
    typicalVerbs: ["gehen", "fahren", "kommen"],
    note: "Richtung zur Institution 'Schule'",
  },
  {
    id: "zum_arzt",
    prep: "zu",
    phrase: "zum Arzt",
    case: "dat",
    question: "Wohin?",
    typicalVerbs: ["gehen", "fahren", "kommen"],
    note: "Richtung zu einer Person",
  },
  {
    id: "in_den_garten",
    prep: "in",
    phrase: "in den Garten",
    case: "akk",
    question: "Wohin?",
    typicalVerbs: ["gehen", "laufen", "rennen"],
    note: "Richtung in den Garten",
  },

  // Ort / wo?
  {
    id: "zu_hause",
    prep: "zu",
    phrase: "zu Hause",
    case: "dat",
    question: "Wo?",
    typicalVerbs: ["sein", "bleiben", "wohnen"],
    note: "Ort: zu Hause",
  },
  {
    id: "im_haus",
    prep: "in",
    phrase: "im Haus",
    case: "dat",
    question: "Wo?",
    typicalVerbs: ["sein", "bleiben", "spielen", "arbeiten"],
    note: "Ort: im Haus",
  },
  {
    id: "in_der_stadt",
    prep: "in",
    phrase: "in der Stadt",
    case: "dat",
    question: "Wo?",
    typicalVerbs: ["sein", "wohnen", "arbeiten"],
    note: "Ort: in der Stadt",
  },
  {
    id: "in_der_schule",
    prep: "in",
    phrase: "in der Schule",
    case: "dat",
    question: "Wo?",
    typicalVerbs: ["sein", "lernen", "arbeiten"],
    note: "Ort: in der Schule",
  },
  {
    id: "im_garten",
    prep: "in",
    phrase: "im Garten",
    case: "dat",
    question: "Wo?",
    typicalVerbs: ["sein", "arbeiten", "spielen"],
    note: "Ort: im Garten",
  },

  // Herkunft / woher?
  {
    id: "aus_dem_haus",
    prep: "aus",
    phrase: "aus dem Haus",
    case: "dat",
    question: "Woher?",
    typicalVerbs: ["kommen", "laufen", "rennen"],
    note: "Herkunft: aus dem Haus",
  },
];
