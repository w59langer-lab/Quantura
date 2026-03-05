// ============================================================
// EN: English – modal verbs (example database)
// DE: Englisch – Modalverben (Beispiel)
// ============================================================

const EN_VERBS_MODALS = [
  {
    id: "can",
    infinitive: "can",
    level: "A1",
    translation_de: "können",
    translation_ru: "мочь",
    forms: { i: "can", you: "can", he: "can", she: "can", it: "can", we: "can", you_pl: "can", they: "can" },
    past: { all: "could" },
    tags: ["modal"],
  },
  {
    id: "must",
    infinitive: "must",
    level: "A1",
    translation_de: "müssen",
    translation_ru: "должен",
    forms: { i: "must", you: "must", he: "must", she: "must", it: "must", we: "must", you_pl: "must", they: "must" },
    past: { all: "had to" },
    tags: ["modal", "obligation"],
  },
  {
    id: "may",
    infinitive: "may",
    level: "A2",
    translation_de: "dürfen",
    translation_ru: "может быть",
    forms: { i: "may", you: "may", he: "may", she: "may", it: "may", we: "may", you_pl: "may", they: "may" },
    past: { all: "might" },
    tags: ["modal", "permission"],
  },
  {
    id: "should",
    infinitive: "should",
    level: "A2",
    translation_de: "sollen",
    translation_ru: "следует",
    forms: { i: "should", you: "should", he: "should", she: "should", it: "should", we: "should", you_pl: "should", they: "should" },
    past: { all: "should have" },
    tags: ["modal", "advice"],
  },
  {
    id: "would",
    infinitive: "would",
    level: "B1",
    translation_de: "würde",
    translation_ru: "бы",
    forms: { i: "would", you: "would", he: "would", she: "would", it: "would", we: "would", you_pl: "would", they: "would" },
    past: { all: "would" },
    tags: ["modal", "conditional"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { EN_VERBS_MODALS };
}
