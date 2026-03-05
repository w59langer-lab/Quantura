// ============================================================
// RU: Модальные глаголы – пример
// EN: Russian modal verbs – sample list
// ============================================================

const RU_VERBS_MODALS = [
  {
    id: "moch",
    infinitive: "мочь",
    level: "A1",
    translation_en: "can",
    translation_de: "können",
    forms: { я: "могу", ты: "можешь", он: "может", она: "может", мы: "можем", вы: "можете", они: "могут" },
    past: { masc: "мог", fem: "могла", neut: "могло", plur: "могли" },
    tags: ["modal", "ability"],
  },
  {
    id: "dolzhen",
    infinitive: "должен",
    level: "A1",
    translation_en: "must",
    translation_de: "müssen/sollen",
    forms: { masc: "должен", fem: "должна", neut: "должно", plur: "должны" },
    past: { masc: "должен был", fem: "должна была", neut: "должно было", plur: "должны были" },
    tags: ["modal", "obligation"],
  },
  {
    id: "hotet",
    infinitive: "хотеть",
    level: "A1",
    translation_en: "want to",
    translation_de: "wollen",
    forms: { я: "хочу", ты: "хочешь", он: "хочет", она: "хочет", мы: "хотим", вы: "хотите", они: "хотят" },
    past: { masc: "хотел", fem: "хотела", neut: "хотело", plur: "хотели" },
    tags: ["modal", "desire"],
  },
  {
    id: "sleduet",
    infinitive: "следует",
    level: "A2",
    translation_en: "should",
    translation_de: "sollte",
    forms: { impersonal: "следует" },
    past: { impersonal: "следовало" },
    tags: ["modal", "advice", "impersonal"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { RU_VERBS_MODALS };
}
