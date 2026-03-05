// ============================================================
// DE: Englisch – Pronomen (Beispiel-Datenbank)
// EN: English – pronouns (example database)
// RU: Английский – местоимения (пример базы данных)
// ============================================================

const EN_PRONOUNS = [
  { id: "i", form: "I", person: 1, number: "sg", translation_de: "ich", translation_ru: "я" },
  { id: "you", form: "you", person: 2, number: "sg", translation_de: "du", translation_ru: "ты" },
  { id: "he", form: "he", person: 3, number: "sg", translation_de: "er", translation_ru: "он" },
  { id: "she", form: "she", person: 3, number: "sg", translation_de: "sie", translation_ru: "она" },
  { id: "it", form: "it", person: 3, number: "sg", translation_de: "es", translation_ru: "оно" },
  { id: "we", form: "we", person: 1, number: "pl1", translation_de: "wir", translation_ru: "мы" },
  { id: "you_pl", form: "you", person: 2, number: "pl2", translation_de: "ihr/Sie", translation_ru: "вы" },
  { id: "they", form: "they", person: 3, number: "pl3", translation_de: "sie (Plural)", translation_ru: "они" }
];

if (typeof module !== "undefined") {
  module.exports = { EN_PRONOUNS };
}
