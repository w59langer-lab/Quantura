// ============================================================
// IT: Verbi ausiliari – Kurzliste
// EN: Italian auxiliary verbs – short list
// ============================================================

const IT_VERBS_AUX = [
  {
    id: "essere",
    infinitive: "essere",
    level: "A1",
    translation_en: "to be",
    translation_de: "sein",
    forms: { io: "sono", tu: "sei", lui: "è", lei: "è", noi: "siamo", voi: "siete", loro: "sono" },
    past: { io: "ero", noi: "eravamo", loro: "erano" },
    participle: "stato",
    tags: ["aux"],
  },
  {
    id: "avere",
    infinitive: "avere",
    level: "A1",
    translation_en: "to have",
    translation_de: "haben",
    forms: { io: "ho", tu: "hai", lui: "ha", lei: "ha", noi: "abbiamo", voi: "avete", loro: "hanno" },
    past: { io: "avevo", noi: "avevamo", loro: "avevano" },
    participle: "avuto",
    tags: ["aux"],
  },
  {
    id: "stare",
    infinitive: "stare",
    level: "A2",
    translation_en: "to stay/be (progressive)",
    translation_de: "bleiben/gerade sein",
    forms: { io: "sto", tu: "stai", lui: "sta", lei: "sta", noi: "stiamo", voi: "state", loro: "stanno" },
    past: { io: "stavo", noi: "stavamo", loro: "stavano" },
    participle: "stato",
    tags: ["aux", "progressive"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { IT_VERBS_AUX };
}
