// ============================================================
// FR: Verbes auxiliaires – Kurzliste
// EN: French auxiliary verbs – short list
// ============================================================

const FR_VERBS_AUX = [
  {
    id: "etre",
    infinitive: "être",
    level: "A1",
    translation_en: "to be",
    translation_de: "sein",
    forms: { je: "suis", tu: "es", il: "est", elle: "est", nous: "sommes", vous: "êtes", ils: "sont", elles: "sont" },
    past: { je: "étais", nous: "étions", ils: "étaient" },
    participle: "été",
    tags: ["aux"],
  },
  {
    id: "avoir",
    infinitive: "avoir",
    level: "A1",
    translation_en: "to have",
    translation_de: "haben",
    forms: { j: "ai", tu: "as", il: "a", elle: "a", nous: "avons", vous: "avez", ils: "ont", elles: "ont" },
    past: { j: "avais", nous: "avions", ils: "avaient" },
    participle: "eu",
    tags: ["aux"],
  },
  {
    id: "aller",
    infinitive: "aller",
    level: "A1",
    translation_en: "to go",
    translation_de: "gehen",
    forms: { je: "vais", tu: "vas", il: "va", elle: "va", nous: "allons", vous: "allez", ils: "vont", elles: "vont" },
    past: { je: "allais", nous: "allions", ils: "allaient" },
    participle: "allé",
    tags: ["aux", "futur_proche"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { FR_VERBS_AUX };
}
