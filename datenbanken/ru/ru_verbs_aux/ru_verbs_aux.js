// ============================================================
// RU: Вспомогательные глаголы – пример
// EN: Russian auxiliary verbs – sample list
// ============================================================

const RU_VERBS_AUX = [
  {
    id: "byt",
    infinitive: "быть",
    level: "A1",
    translation_en: "to be",
    translation_de: "sein",
    forms: { я: "есть / —", ты: "есть / —", он: "есть / —", она: "есть / —", мы: "есть / —", вы: "есть / —", они: "есть / —" },
    past: { masc: "был", fem: "была", neut: "было", plur: "были" },
    participle: "будучи",
    tags: ["aux"],
  },
  {
    id: "imet",
    infinitive: "иметь",
    level: "A2",
    translation_en: "to have",
    translation_de: "haben",
    forms: { я: "имею", ты: "имеешь", он: "имеет", она: "имеет", мы: "имеем", вы: "имеете", они: "имеют" },
    past: { masc: "имел", fem: "имела", neut: "имело", plur: "имели" },
    participle: "имевший",
    tags: ["aux", "possession"],
  },
  {
    id: "stanovit",
    infinitive: "становиться",
    level: "B1",
    translation_en: "to become",
    translation_de: "werden",
    forms: { я: "становлюсь", ты: "становишься", он: "становится", она: "становится", мы: "становимся", вы: "становитесь", они: "становятся" },
    past: { masc: "становился", fem: "становилась", neut: "становилось", plur: "становились" },
    participle: "становившийся",
    tags: ["aux", "resultative"],
  },
];

if (typeof module !== "undefined") {
  module.exports = { RU_VERBS_AUX };
}
