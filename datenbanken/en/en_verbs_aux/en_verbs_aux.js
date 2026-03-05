// ============================================================
// EN: English – auxiliary verbs (example database)
// DE: Englisch – Hilfsverben (Beispiel)
// ============================================================

const EN_VERBS_AUX = [
  {
    id: "be",
    infinitive: "be",
    level: "A1",
    translation_de: "sein",
    translation_ru: "быть",
    forms: { i: "am", you: "are", he: "is", she: "is", it: "is", we: "are", you_pl: "are", they: "are" },
    past: { i: "was", you: "were", he: "was", she: "was", it: "was", we: "were", you_pl: "were", they: "were" },
    participle: "been",
    tags: ["aux"],
  },
  {
    id: "have",
    infinitive: "have",
    level: "A1",
    translation_de: "haben",
    translation_ru: "иметь",
    forms: { i: "have", you: "have", he: "has", she: "has", it: "has", we: "have", you_pl: "have", they: "have" },
    past: { all: "had" },
    participle: "had",
    tags: ["aux"],
  },
  {
    id: "do",
    infinitive: "do",
    level: "A1",
    translation_de: "tun",
    translation_ru: "делать",
    forms: { i: "do", you: "do", he: "does", she: "does", it: "does", we: "do", you_pl: "do", they: "do" },
    past: { all: "did" },
    participle: "done",
    tags: ["aux", "support"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { EN_VERBS_AUX };
}
