// ============================================================
// ES: Español – verbos (base)
// EN: Spanish – verbs (base list)
// ============================================================

const ES_VERBS = [
  {
    id: "ir",
    infinitive: "ir",
    level: "A1",
    translation_en: "to go",
    translation_de: "gehen",
    forms: { yo: "voy", tu: "vas", el: "va", ella: "va", nosotros: "vamos", vosotros: "vais", ellos: "van", ellas: "van" },
    past: { yo: "fui", tu: "fuiste", el: "fue", nosotros: "fuimos", vosotros: "fuisteis", ellos: "fueron" },
    participle: "ido",
    tags: ["movimiento"],
  },
  {
    id: "venir",
    infinitive: "venir",
    level: "A1",
    translation_en: "to come",
    translation_de: "kommen",
    forms: { yo: "vengo", tu: "vienes", el: "viene", ella: "viene", nosotros: "venimos", vosotros: "venís", ellos: "vienen", ellas: "vienen" },
    past: { yo: "vine", tu: "viniste", el: "vino", nosotros: "vinimos", vosotros: "vinisteis", ellos: "vinieron" },
    participle: "venido",
    tags: ["movimiento"],
  },
  {
    id: "hacer",
    infinitive: "hacer",
    level: "A1",
    translation_en: "to do/make",
    translation_de: "machen",
    forms: { yo: "hago", tu: "haces", el: "hace", ella: "hace", nosotros: "hacemos", vosotros: "hacéis", ellos: "hacen", ellas: "hacen" },
    past: { yo: "hice", tu: "hiciste", el: "hizo", nosotros: "hicimos", vosotros: "hicisteis", ellos: "hicieron" },
    participle: "hecho",
    tags: ["basico"],
  },
  {
    id: "aprender",
    infinitive: "aprender",
    level: "A1",
    translation_en: "to learn",
    translation_de: "lernen",
    forms: { yo: "aprendo", tu: "aprendes", el: "aprende", ella: "aprende", nosotros: "aprendemos", vosotros: "aprendéis", ellos: "aprenden", ellas: "aprenden" },
    past: { yo: "aprendí", tu: "aprendiste", el: "aprendió", nosotros: "aprendimos", vosotros: "aprendisteis", ellos: "aprendieron" },
    participle: "aprendido",
    tags: ["escuela"],
  },
  {
    id: "jugar",
    infinitive: "jugar",
    level: "A1",
    translation_en: "to play",
    translation_de: "spielen",
    forms: { yo: "juego", tu: "juegas", el: "juega", ella: "juega", nosotros: "jugamos", vosotros: "jugáis", ellos: "juegan", ellas: "juegan" },
    past: { yo: "jugué", tu: "jugaste", el: "jugó", nosotros: "jugamos", vosotros: "jugasteis", ellos: "jugaron" },
    participle: "jugado",
    tags: ["ocio"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { ES_VERBS };
}
