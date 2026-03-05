// ============================================================
// ES: Verbos modales – base
// EN: Spanish modal verbs – base list
// ============================================================

const ES_VERBS_MODALS = [
  {
    id: "poder",
    infinitive: "poder",
    level: "A1",
    translation_en: "can",
    translation_de: "können",
    forms: { yo: "puedo", tu: "puedes", el: "puede", ella: "puede", nosotros: "podemos", vosotros: "podéis", ellos: "pueden", ellas: "pueden" },
    past: { yo: "pude", tu: "pudiste", el: "pudo", nosotros: "pudimos", vosotros: "pudisteis", ellos: "pudieron" },
    tags: ["modal", "ability"],
  },
  {
    id: "deber",
    infinitive: "deber",
    level: "A1",
    translation_en: "must/should",
    translation_de: "müssen/sollen",
    forms: { yo: "debo", tu: "debes", el: "debe", ella: "debe", nosotros: "debemos", vosotros: "debéis", ellos: "deben", ellas: "deben" },
    past: { yo: "debí", tu: "debiste", el: "debió", nosotros: "debimos", vosotros: "debisteis", ellos: "debieron" },
    tags: ["modal", "obligation"],
  },
  {
    id: "querer",
    infinitive: "querer",
    level: "A1",
    translation_en: "want to",
    translation_de: "wollen",
    forms: { yo: "quiero", tu: "quieres", el: "quiere", ella: "quiere", nosotros: "queremos", vosotros: "queréis", ellos: "quieren", ellas: "quieren" },
    past: { yo: "quise", tu: "quisiste", el: "quiso", nosotros: "quisimos", vosotros: "quisisteis", ellos: "quisieron" },
    tags: ["modal", "desire"],
  },
  {
    id: "tener_que",
    infinitive: "tener que",
    level: "A2",
    translation_en: "have to",
    translation_de: "müssen",
    forms: { yo: "tengo que", tu: "tienes que", el: "tiene que", ella: "tiene que", nosotros: "tenemos que", vosotros: "tenéis que", ellos: "tienen que", ellas: "tienen que" },
    past: { yo: "tuve que", tu: "tuviste que", el: "tuvo que", nosotros: "tuvimos que", vosotros: "tuvisteis que", ellos: "tuvieron que" },
    tags: ["modal", "obligation"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { ES_VERBS_MODALS };
}
