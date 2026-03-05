// ============================================================
// DE: Russisch – Verben (Beispiel-Datenbank)
// EN: Russian – verbs (example database)
// RU: Русский – глаголы (пример базы данных)
// ------------------------------------------------------------
// DE: Struktur jedes Eintrags:
// EN: Structure of each entry:
// RU: Структура каждой записи:
//
// const RU_VERBS = [
//   {
//     id: "essen",              // eindeutiger Schlüssel / unique id / уникальный id
//     infinitive: "essen",      // Grundform / base form / инфинитив
//     level: "A1",              // Sprachniveau (A1–C2)
//     translation_de: "essen",
//     translation_en: "to eat",
//     translation_ru: "есть",
//     forms: {                  // einfache Präsens‑Formen (Beispiel)
//       ich: "...",
//       du:  "...",
//       er_sie_es: "...",
//       wir: "...",
//       ihr: "...",
//       sie_Sie: "...",
//     },
//     notes_de: "Optionaler Kommentar auf Deutsch",
//     notes_en: "Optional comment in English",
//     notes_ru: "Необязательный комментарий на русском",
//     tags: ["regelmäßig", "Alltag"]
//   },
//   ...
// ];
// ============================================================

const RU_VERBS = [
  {
    id: "идти",
    infinitive: "идти",
    level: "A1",
    translation_de: "gehen",
    translation_en: "to go",
    forms: {
      я: "иду",
      ты: "идёшь",
      он: "идёт",
      она: "идёт",
      мы: "идём",
      вы: "идёте",
      они: "идут"
    },
    past: {
      я: "шёл",
      ты: "шёл",
      он: "шёл",
      она: "шла",
      мы: "шли",
      вы: "шли",
      они: "шли"
    },
    participle: "шёл",
    tags: ["движение"]
  },
  {
    id: "говорить",
    infinitive: "говорить",
    level: "A1",
    translation_de: "sprechen",
    translation_en: "to speak",
    forms: {
      я: "говорю",
      ты: "говоришь",
      он: "говорит",
      она: "говорит",
      мы: "говорим",
      вы: "говорите",
      они: "говорят"
    },
    past: {
      я: "говорил",
      ты: "говорил",
      он: "говорил",
      она: "говорила",
      мы: "говорили",
      вы: "говорили",
      они: "говорили"
    },
    participle: "говорил",
    tags: ["общение"]
  },
  {
    id: "делать",
    infinitive: "делать",
    level: "A1",
    translation_de: "machen",
    translation_en: "to do",
    forms: {
      я: "делаю",
      ты: "делаешь",
      он: "делает",
      она: "делает",
      мы: "делаем",
      вы: "делаете",
      они: "делают"
    },
    past: {
      я: "делал",
      ты: "делал",
      он: "делал",
      она: "делала",
      мы: "делали",
      вы: "делали",
      они: "делали"
    },
    participle: "делал",
    tags: ["база"]
  },
  {
    id: "читать",
    infinitive: "читать",
    level: "A1",
    translation_de: "lesen",
    translation_en: "to read",
    forms: {
      я: "читаю",
      ты: "читаешь",
      он: "читает",
      она: "читает",
      мы: "читаем",
      вы: "читаете",
      они: "читают"
    },
    past: {
      я: "читал",
      ты: "читал",
      он: "читал",
      она: "читала",
      мы: "читали",
      вы: "читали",
      они: "читали"
    },
    participle: "читал",
    tags: ["база"]
  },
  {
    id: "писать",
    infinitive: "писать",
    level: "A1",
    translation_de: "schreiben",
    translation_en: "to write",
    forms: {
      я: "пишу",
      ты: "пишешь",
      он: "пишет",
      она: "пишет",
      мы: "пишем",
      вы: "пишете",
      они: "пишут"
    },
    past: {
      я: "писал",
      ты: "писал",
      он: "писал",
      она: "писала",
      мы: "писали",
      вы: "писали",
      они: "писали"
    },
    participle: "писал",
    tags: ["база"]
  },
  {
    id: "rabotat",
    infinitive: "работать",
    level: "A1",
    translation_de: "arbeiten",
    translation_en: "to work",
    forms: {
      я: "работаю",
      ты: "работаешь",
      он: "работает",
      она: "работает",
      мы: "работаем",
      вы: "работаете",
      они: "работают"
    },
    past: {
      я: "работал",
      ты: "работал",
      он: "работал",
      она: "работала",
      мы: "работали",
      вы: "работали",
      они: "работали"
    },
    participle: "работал",
    tags: ["база"]
  },
  {
    id: "zhit",
    infinitive: "жить",
    level: "A1",
    translation_de: "wohnen/leben",
    translation_en: "to live",
    forms: {
      я: "живу",
      ты: "живёшь",
      он: "живёт",
      она: "живёт",
      мы: "живём",
      вы: "живёте",
      они: "живут"
    },
    past: {
      я: "жил",
      ты: "жил",
      он: "жил",
      она: "жила",
      мы: "жили",
      вы: "жили",
      они: "жили"
    },
    participle: "жил",
    tags: ["база", "дом"]
  },
  {
    id: "smotret",
    infinitive: "смотреть",
    level: "A1",
    translation_de: "schauen",
    translation_en: "to watch",
    forms: {
      я: "смотрю",
      ты: "смотришь",
      он: "смотрит",
      она: "смотрит",
      мы: "смотрим",
      вы: "смотрите",
      они: "смотрят"
    },
    past: {
      я: "смотрел",
      ты: "смотрел",
      он: "смотрел",
      она: "смотрела",
      мы: "смотрели",
      вы: "смотрели",
      они: "смотрели"
    },
    participle: "смотрел",
    tags: ["база", "медиа"]
  },
  {
    id: "lyubit",
    infinitive: "любить",
    level: "A1",
    translation_de: "lieben/mögen",
    translation_en: "to love/like",
    forms: {
      я: "люблю",
      ты: "любишь",
      он: "любит",
      она: "любит",
      мы: "любим",
      вы: "любите",
      они: "любят"
    },
    past: {
      я: "любил",
      ты: "любил",
      он: "любил",
      она: "любила",
      мы: "любили",
      вы: "любили",
      они: "любили"
    },
    participle: "любил",
    tags: ["эмоции"]
  },
  {
    id: "spat",
    infinitive: "спать",
    level: "A1",
    translation_de: "schlafen",
    translation_en: "to sleep",
    forms: {
      я: "сплю",
      ты: "спишь",
      он: "спит",
      она: "спит",
      мы: "спим",
      вы: "спите",
      они: "спят"
    },
    past: {
      я: "спал",
      ты: "спал",
      он: "спал",
      она: "спала",
      мы: "спали",
      вы: "спали",
      они: "спали"
    },
    participle: "спал",
    tags: ["быт"]
  },
  {
    id: "est",
    infinitive: "есть",
    level: "A1",
    translation_de: "essen",
    translation_en: "to eat",
    forms: {
      я: "ем",
      ты: "ешь",
      он: "ест",
      она: "ест",
      мы: "едим",
      вы: "едите",
      они: "едят"
    },
    past: {
      я: "ел",
      ты: "ел",
      он: "ел",
      она: "ела",
      мы: "ели",
      вы: "ели",
      они: "ели"
    },
    participle: "ел",
    tags: ["еда"]
  },
  {
    id: "pokupat",
    infinitive: "покупать",
    level: "A1",
    translation_de: "kaufen",
    translation_en: "to buy",
    forms: {
      я: "покупаю",
      ты: "покупаешь",
      он: "покупает",
      она: "покупает",
      мы: "покупаем",
      вы: "покупаете",
      они: "покупают"
    },
    past: {
      я: "покупал",
      ты: "покупал",
      он: "покупал",
      она: "покупала",
      мы: "покупали",
      вы: "покупали",
      они: "покупали"
    },
    participle: "покупал",
    tags: ["покупки"]
  }
];

// DE: Export für Module (optional)
// EN: Optional export for modules
// RU: Необязательный экспорт для модулей
if (typeof module !== "undefined") {
  module.exports = { RU_VERBS };
}
