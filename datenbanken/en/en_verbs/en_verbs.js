// ============================================================
// DE: Englisch – Verben (Beispiel-Datenbank)
// EN: English – verbs (example database)
// RU: Английский – глаголы (пример базы данных)
// ------------------------------------------------------------
// DE: Struktur jedes Eintrags:
// EN: Structure of each entry:
// RU: Структура каждой записи:
//
// const EN_VERBS = [
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

const EN_VERBS = [
  {
    id: "go",
    infinitive: "go",
    level: "A1",
    translation_de: "gehen",
    translation_ru: "идти",
    forms: {
      i: "go",
      you: "go",
      he: "goes",
      she: "goes",
      it: "goes",
      we: "go",
      you_pl: "go",
      they: "go"
    },
    past: {
      i: "went",
      you: "went",
      he: "went",
      she: "went",
      it: "went",
      we: "went",
      you_pl: "went",
      they: "went"
    },
    participle: "gone",
    tags: ["movement"]
  },
  {
    id: "come",
    infinitive: "come",
    level: "A1",
    translation_de: "kommen",
    translation_ru: "приходить",
    forms: {
      i: "come",
      you: "come",
      he: "comes",
      she: "comes",
      it: "comes",
      we: "come",
      you_pl: "come",
      they: "come"
    },
    past: {
      i: "came",
      you: "came",
      he: "came",
      she: "came",
      it: "came",
      we: "came",
      you_pl: "came",
      they: "came"
    },
    participle: "come",
    tags: ["movement"]
  },
  {
    id: "make",
    infinitive: "make",
    level: "A1",
    translation_de: "machen",
    translation_ru: "делать",
    forms: {
      i: "make",
      you: "make",
      he: "makes",
      she: "makes",
      it: "makes",
      we: "make",
      you_pl: "make",
      they: "make"
    },
    past: {
      i: "made",
      you: "made",
      he: "made",
      she: "made",
      it: "made",
      we: "made",
      you_pl: "made",
      they: "made"
    },
    participle: "made",
    tags: ["basic"]
  },
  {
    id: "learn",
    infinitive: "learn",
    level: "A1",
    translation_de: "lernen",
    translation_ru: "учить",
    forms: {
      i: "learn",
      you: "learn",
      he: "learns",
      she: "learns",
      it: "learns",
      we: "learn",
      you_pl: "learn",
      they: "learn"
    },
    past: {
      i: "learned",
      you: "learned",
      he: "learned",
      she: "learned",
      it: "learned",
      we: "learned",
      you_pl: "learned",
      they: "learned"
    },
    participle: "learned",
    tags: ["school"]
  },
  {
    id: "play",
    infinitive: "play",
    level: "A1",
    translation_de: "spielen",
    translation_ru: "играть",
    forms: {
      i: "play",
      you: "play",
      he: "plays",
      she: "plays",
      it: "plays",
      we: "play",
      you_pl: "play",
      they: "play"
    },
    past: {
      i: "played",
      you: "played",
      he: "played",
      she: "played",
      it: "played",
      we: "played",
      you_pl: "played",
      they: "played"
    },
    participle: "played",
    tags: ["leisure"]
  },
  {
    id: "eat",
    infinitive: "eat",
    level: "A1",
    translation_de: "essen",
    translation_ru: "есть",
    forms: {
      i: "eat",
      you: "eat",
      he: "eats",
      she: "eats",
      it: "eats",
      we: "eat",
      you_pl: "eat",
      they: "eat"
    },
    past: {
      i: "ate",
      you: "ate",
      he: "ate",
      she: "ate",
      it: "ate",
      we: "ate",
      you_pl: "ate",
      they: "ate"
    },
    participle: "eaten",
    tags: ["basic", "food"]
  }
];

// DE: Export für Module (optional)
// EN: Optional export for modules
// RU: Необязательный экспорт для модулей
if (typeof module !== "undefined") {
  module.exports = { EN_VERBS };
}
