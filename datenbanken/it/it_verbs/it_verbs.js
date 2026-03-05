// ============================================================
// DE: Italienisch – Verben (Beispiel-Datenbank)
// EN: Italian – verbs (example database)
// RU: Итальянский – глаголы (пример базы данных)
// ------------------------------------------------------------
// DE: Struktur jedes Eintrags:
// EN: Structure of each entry:
// RU: Структура каждой записи:
//
// const IT_VERBS = [
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

const IT_VERBS = [
  {
    id: "andare",
    infinitive: "andare",
    level: "A1",
    translation_de: "gehen",
    translation_en: "to go",
    translation_ru: "идти",
    usesEssere: true,
    forms: {
      io: "vado",
      tu: "vai",
      lui: "va",
      lei: "va",
      noi: "andiamo",
      voi: "andate",
      loro: "vanno"
    },
    past: {
      io: "andavo",
      tu: "andavi",
      lui: "andava",
      lei: "andava",
      noi: "andavamo",
      voi: "andavate",
      loro: "andavano"
    },
    participle: "andato",
    tags: ["movimento"]
  },
  {
    id: "essere",
    infinitive: "essere",
    level: "A1",
    translation_de: "sein",
    translation_en: "to be",
    translation_ru: "быть",
    usesEssere: true,
    forms: {
      io: "sono",
      tu: "sei",
      lui: "è",
      lei: "è",
      noi: "siamo",
      voi: "siete",
      loro: "sono"
    },
    past: {
      io: "ero",
      tu: "eri",
      lui: "era",
      lei: "era",
      noi: "eravamo",
      voi: "eravate",
      loro: "erano"
    },
    participle: "stato",
    tags: ["base"]
  },
  {
    id: "avere",
    infinitive: "avere",
    level: "A1",
    translation_de: "haben",
    translation_en: "to have",
    translation_ru: "иметь",
    forms: {
      io: "ho",
      tu: "hai",
      lui: "ha",
      lei: "ha",
      noi: "abbiamo",
      voi: "avete",
      loro: "hanno"
    },
    past: {
      io: "avevo",
      tu: "avevi",
      lui: "aveva",
      lei: "aveva",
      noi: "avevamo",
      voi: "avevate",
      loro: "avevano"
    },
    participle: "avuto",
    tags: ["base"]
  },
  {
    id: "parlare",
    infinitive: "parlare",
    level: "A1",
    translation_de: "sprechen",
    translation_en: "to speak",
    translation_ru: "говорить",
    forms: {
      io: "parlo",
      tu: "parli",
      lui: "parla",
      lei: "parla",
      noi: "parliamo",
      voi: "parlate",
      loro: "parlano"
    },
    past: {
      io: "parlavo",
      tu: "parlavi",
      lui: "parlava",
      lei: "parlava",
      noi: "parlavamo",
      voi: "parlavate",
      loro: "parlavano"
    },
    participle: "parlato",
    tags: ["comunicazione"]
  },
  {
    id: "finire",
    infinitive: "finire",
    level: "A1",
    translation_de: "beenden",
    translation_en: "to finish",
    translation_ru: "заканчивать",
    forms: {
      io: "finisco",
      tu: "finisci",
      lui: "finisce",
      lei: "finisce",
      noi: "finiamo",
      voi: "finite",
      loro: "finiscono"
    },
    past: {
      io: "finivo",
      tu: "finivi",
      lui: "finiva",
      lei: "finiva",
      noi: "finivamo",
      voi: "finivate",
      loro: "finivano"
    },
    participle: "finito",
    tags: ["base"]
  },
  {
    id: "prendere",
    infinitive: "prendere",
    level: "A2",
    translation_de: "nehmen",
    translation_en: "to take",
    translation_ru: "брать",
    forms: {
      io: "prendo",
      tu: "prendi",
      lui: "prende",
      lei: "prende",
      noi: "prendiamo",
      voi: "prendete",
      loro: "prendono"
    },
    past: {
      io: "prendevo",
      tu: "prendevi",
      lui: "prendeva",
      lei: "prendeva",
      noi: "prendevamo",
      voi: "prendevate",
      loro: "prendevano"
    },
    participle: "preso",
    tags: ["base"]
  }
];

// DE: Export für Module (optional)
// EN: Optional export for modules
// RU: Необязательный экспорт для модулей
if (typeof module !== "undefined") {
  module.exports = { IT_VERBS };
}
