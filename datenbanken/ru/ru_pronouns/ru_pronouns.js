// ============================================================
// DE: Russisch – Pronomen (Beispiel-Datenbank)
// EN: Russian – pronouns (example database)
// RU: Русский – местоимения (пример базы данных)
// ============================================================

const RU_PRONOUNS = [
  { id: "я", form: "я", person: 1, number: "sg", translation_de: "ich", translation_en: "I" },
  { id: "ты", form: "ты", person: 2, number: "sg", translation_de: "du", translation_en: "you" },
  { id: "он", form: "он", person: 3, number: "sg", translation_de: "er", translation_en: "he" },
  { id: "она", form: "она", person: 3, number: "sg", translation_de: "sie", translation_en: "she" },
  { id: "оно", form: "оно", person: 3, number: "sg", translation_de: "es", translation_en: "it" },
  { id: "мы", form: "мы", person: 1, number: "pl1", translation_de: "wir", translation_en: "we" },
  { id: "вы", form: "вы", person: 2, number: "pl2", translation_de: "ihr/Sie", translation_en: "you" },
  { id: "они", form: "они", person: 3, number: "pl3", translation_de: "sie", translation_en: "they" }
];

if (typeof module !== "undefined") {
  module.exports = { RU_PRONOUNS };
}
