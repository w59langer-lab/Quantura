// ============================================================
// IT: Verbi modali – base
// EN: Italian modal verbs – base list
// ============================================================

const IT_VERBS_MODALS = [
  {
    id: "potere",
    infinitive: "potere",
    level: "A1",
    translation_en: "can",
    translation_de: "können",
    forms: { io: "posso", tu: "puoi", lui: "può", lei: "può", noi: "possiamo", voi: "potete", loro: "possono" },
    past: { io: "potevo", noi: "potevamo", loro: "potevano" },
    tags: ["modal", "permission"],
  },
  {
    id: "dovere",
    infinitive: "dovere",
    level: "A1",
    translation_en: "must",
    translation_de: "müssen",
    forms: { io: "devo", tu: "devi", lui: "deve", lei: "deve", noi: "dobbiamo", voi: "dovete", loro: "devono" },
    past: { io: "dovevo", noi: "dovevamo", loro: "dovevano" },
    tags: ["modal", "obligation"],
  },
  {
    id: "volere",
    infinitive: "volere",
    level: "A1",
    translation_en: "want to",
    translation_de: "wollen",
    forms: { io: "voglio", tu: "vuoi", lui: "vuole", lei: "vuole", noi: "vogliamo", voi: "volete", loro: "vogliono" },
    past: { io: "volevo", noi: "volevamo", loro: "volevano" },
    tags: ["modal", "desire"],
  },
  {
    id: "sapere",
    infinitive: "sapere",
    level: "A2",
    translation_en: "to know how",
    translation_de: "können (Fähigkeit)",
    forms: { io: "so", tu: "sai", lui: "sa", lei: "sa", noi: "sappiamo", voi: "sapete", loro: "sanno" },
    past: { io: "sapevo", noi: "sapevamo", loro: "sapevano" },
    tags: ["modal", "ability"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { IT_VERBS_MODALS };
}
