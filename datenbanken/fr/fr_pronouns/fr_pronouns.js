// ============================================================
// DE: Französisch – Pronomen (Beispiel-Datenbank)
// EN: French – pronouns (example database)
// RU: Французский – местоимения (пример базы данных)
// ============================================================

const FR_PRONOUNS = [
  { id: "je", form: "je", person: 1, number: "sg", translation_de: "ich", translation_ru: "я" },
  { id: "tu", form: "tu", person: 2, number: "sg", translation_de: "du", translation_ru: "ты" },
  { id: "il", form: "il", person: 3, number: "sg", translation_de: "er", translation_ru: "он" },
  { id: "elle", form: "elle", person: 3, number: "sg", translation_de: "sie", translation_ru: "она" },
  { id: "nous", form: "nous", person: 1, number: "pl1", translation_de: "wir", translation_ru: "мы" },
  { id: "vous", form: "vous", person: 2, number: "pl2", translation_de: "ihr/vous", translation_ru: "вы" },
  { id: "ils", form: "ils", person: 3, number: "pl3", translation_de: "sie (m.)", translation_ru: "они" },
  { id: "elles", form: "elles", person: 3, number: "pl3", translation_de: "sie (f.)", translation_ru: "они" }
];

if (typeof module !== "undefined") {
  module.exports = { FR_PRONOUNS };
}
