// ============================================================
// FR: Verbes modaux – base
// EN: French modal verbs – base list (semi-modals included)
// ============================================================

const FR_VERBS_MODALS = [
  {
    id: "pouvoir",
    infinitive: "pouvoir",
    level: "A1",
    translation_en: "can",
    translation_de: "können",
    forms: { je: "peux", tu: "peux", il: "peut", elle: "peut", nous: "pouvons", vous: "pouvez", ils: "peuvent", elles: "peuvent" },
    past: { je: "pouvais", nous: "pouvions", ils: "pouvaient" },
    tags: ["modal", "permission"],
  },
  {
    id: "devoir",
    infinitive: "devoir",
    level: "A1",
    translation_en: "must",
    translation_de: "müssen",
    forms: { je: "dois", tu: "dois", il: "doit", elle: "doit", nous: "devons", vous: "devez", ils: "doivent", elles: "doivent" },
    past: { je: "devais", nous: "devions", ils: "devaient" },
    tags: ["modal", "obligation"],
  },
  {
    id: "vouloir",
    infinitive: "vouloir",
    level: "A1",
    translation_en: "want to",
    translation_de: "wollen",
    forms: { je: "veux", tu: "veux", il: "veut", elle: "veut", nous: "voulons", vous: "voulez", ils: "veulent", elles: "veulent" },
    past: { je: "voulais", nous: "voulions", ils: "voulaient" },
    tags: ["modal", "wish"],
  },
  {
    id: "falloir",
    infinitive: "falloir",
    level: "A2",
    translation_en: "to be necessary",
    translation_de: "nötig sein",
    forms: { il: "faut" },
    past: { il: "fallait" },
    tags: ["impersonal", "modal"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { FR_VERBS_MODALS };
}
