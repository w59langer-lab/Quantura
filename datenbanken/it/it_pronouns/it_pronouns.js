// ============================================================
// DE: Italienisch – Pronomen (Beispiel-Datenbank)
// EN: Italian – pronouns (example database)
// RU: Итальянский – местоимения (пример базы данных)
// ============================================================

const IT_PRONOUNS = [
  { id: "io", form: "io", person: 1, number: "sg", translation_de: "ich", translation_ru: "я" },
  { id: "tu", form: "tu", person: 2, number: "sg", translation_de: "du", translation_ru: "ты" },
  { id: "lui", form: "lui", person: 3, number: "sg", translation_de: "er", translation_ru: "он" },
  { id: "lei", form: "lei", person: 3, number: "sg", translation_de: "sie", translation_ru: "она" },
  { id: "noi", form: "noi", person: 1, number: "pl1", translation_de: "wir", translation_ru: "мы" },
  { id: "voi", form: "voi", person: 2, number: "pl2", translation_de: "ihr/voi", translation_ru: "вы" },
  { id: "loro", form: "loro", person: 3, number: "pl3", translation_de: "sie", translation_ru: "они" }
];

if (typeof module !== "undefined") {
  module.exports = { IT_PRONOUNS };
}
