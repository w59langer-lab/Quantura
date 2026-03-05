// ============================================================
// DE: Französisch – Verben (Beispiel-Datenbank)
// EN: French – verbs (example database)
// RU: Французский – глаголы (пример базы данных)
// ------------------------------------------------------------
// DE: Struktur jedes Eintrags:
// EN: Structure of each entry:
// RU: Структура каждой записи:
//
// const FR_VERBS = [
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

const FR_VERBS = [
  {
    id: "aller",
    infinitive: "aller",
    level: "A1",
    translation_de: "gehen",
    translation_en: "to go",
    translation_ru: "идти",
    usesEtre: true,
    forms: {
      je: "vais",
      tu: "vas",
      il: "va",
      elle: "va",
      nous: "allons",
      vous: "allez",
      ils: "vont",
      elles: "vont"
    },
    past: {
      je: "allais",
      tu: "allais",
      il: "allait",
      elle: "allait",
      nous: "allions",
      vous: "alliez",
      ils: "allaient",
      elles: "allaient"
    },
    participle: "allé",
    tags: ["mouvement"]
  },
  {
    id: "etre",
    infinitive: "être",
    level: "A1",
    translation_de: "sein",
    translation_en: "to be",
    translation_ru: "быть",
    usesEtre: true,
    forms: {
      je: "suis",
      tu: "es",
      il: "est",
      elle: "est",
      nous: "sommes",
      vous: "êtes",
      ils: "sont",
      elles: "sont"
    },
    past: {
      je: "étais",
      tu: "étais",
      il: "était",
      elle: "était",
      nous: "étions",
      vous: "étiez",
      ils: "étaient",
      elles: "étaient"
    },
    participle: "été",
    tags: ["base"]
  },
  {
    id: "avoir",
    infinitive: "avoir",
    level: "A1",
    translation_de: "haben",
    translation_en: "to have",
    translation_ru: "иметь",
    forms: {
      je: "ai",
      tu: "as",
      il: "a",
      elle: "a",
      nous: "avons",
      vous: "avez",
      ils: "ont",
      elles: "ont"
    },
    past: {
      je: "avais",
      tu: "avais",
      il: "avait",
      elle: "avait",
      nous: "avions",
      vous: "aviez",
      ils: "avaient",
      elles: "avaient"
    },
    participle: "eu",
    tags: ["base"]
  },
  {
    id: "parler",
    infinitive: "parler",
    level: "A1",
    translation_de: "sprechen",
    translation_en: "to speak",
    translation_ru: "говорить",
    forms: {
      je: "parle",
      tu: "parles",
      il: "parle",
      elle: "parle",
      nous: "parlons",
      vous: "parlez",
      ils: "parlent",
      elles: "parlent"
    },
    past: {
      je: "parlais",
      tu: "parlais",
      il: "parlait",
      elle: "parlait",
      nous: "parlions",
      vous: "parliez",
      ils: "parlaient",
      elles: "parlaient"
    },
    participle: "parlé",
    tags: ["communication"]
  },
  {
    id: "finir",
    infinitive: "finir",
    level: "A1",
    translation_de: "beenden",
    translation_en: "to finish",
    translation_ru: "заканчивать",
    forms: {
      je: "finis",
      tu: "finis",
      il: "finit",
      elle: "finit",
      nous: "finissons",
      vous: "finissez",
      ils: "finissent",
      elles: "finissent"
    },
    past: {
      je: "finissais",
      tu: "finissais",
      il: "finissait",
      elle: "finissait",
      nous: "finissions",
      vous: "finissiez",
      ils: "finissaient",
      elles: "finissaient"
    },
    participle: "fini",
    tags: ["base"]
  },
  {
    id: "prendre",
    infinitive: "prendre",
    level: "A2",
    translation_de: "nehmen",
    translation_en: "to take",
    translation_ru: "брать",
    forms: {
      je: "prends",
      tu: "prends",
      il: "prend",
      elle: "prend",
      nous: "prenons",
      vous: "prenez",
      ils: "prennent",
      elles: "prennent"
    },
    past: {
      je: "prenais",
      tu: "prenais",
      il: "prenait",
      elle: "prenait",
      nous: "prenions",
      vous: "preniez",
      ils: "prenaient",
      elles: "prenaient"
    },
    participle: "pris",
    tags: ["base"]
  }
];

// DE: Export für Module (optional)
// EN: Optional export for modules
// RU: Необязательный экспорт для модулей
if (typeof module !== "undefined") {
  module.exports = { FR_VERBS };
}
