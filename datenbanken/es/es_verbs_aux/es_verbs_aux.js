// ============================================================
// ES: Verbos auxiliares – base
// EN: Spanish auxiliary verbs – base list
// ============================================================

const ES_VERBS_AUX = [
  {
    id: "haber",
    infinitive: "haber",
    level: "A1",
    translation_en: "to have (aux)",
    translation_de: "haben (Hilfsverb)",
    forms: { yo: "he", tu: "has", el: "ha", ella: "ha", nosotros: "hemos", vosotros: "habéis", ellos: "han", ellas: "han" },
    past: { yo: "había", tu: "habías", el: "había", nosotros: "habíamos", vosotros: "habíais", ellos: "habían" },
    participle: "habido",
    tags: ["aux", "perfecto"],
  },
  {
    id: "ser",
    infinitive: "ser",
    level: "A1",
    translation_en: "to be (essential)",
    translation_de: "sein (dauerhaft)",
    forms: { yo: "soy", tu: "eres", el: "es", ella: "es", nosotros: "somos", vosotros: "sois", ellos: "son", ellas: "son" },
    past: { yo: "fui", tu: "fuiste", el: "fue", nosotros: "fuimos", vosotros: "fuisteis", ellos: "fueron" },
    participle: "sido",
    tags: ["aux", "estado"],
  },
  {
    id: "estar",
    infinitive: "estar",
    level: "A1",
    translation_en: "to be (state)",
    translation_de: "sein/befinden",
    forms: { yo: "estoy", tu: "estás", el: "está", ella: "está", nosotros: "estamos", vosotros: "estáis", ellos: "están", ellas: "están" },
    past: { yo: "estuve", tu: "estuviste", el: "estuvo", nosotros: "estuvimos", vosotros: "estuvisteis", ellos: "estuvieron" },
    participle: "estado",
    tags: ["aux", "estado", "progresivo"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { ES_VERBS_AUX };
}
