// ============================================================
// DE: Französisch – Präpositionen (Beispiel-Datenbank)
// EN: French – prepositions (example database)
// RU: Французский – предлоги (пример базы данных)
// ============================================================

const FR_PREPS = [
  { id: "a", base: "à", level: "A1", translation_de: "zu/in", translation_ru: "к/в", tags: ["lieu"] },
  { id: "dans", base: "dans", level: "A1", translation_de: "in", translation_ru: "внутри", tags: ["lieu"] },
  { id: "sur", base: "sur", level: "A1", translation_de: "auf", translation_ru: "на", tags: ["lieu"] },
  { id: "avec", base: "avec", level: "A1", translation_de: "mit", translation_ru: "с", tags: ["instrument"] },
  { id: "chez", base: "chez", level: "A1", translation_de: "bei", translation_ru: "у (дома)", tags: ["lieu"] }
];

if (typeof module !== "undefined") {
  module.exports = { FR_PREPS };
}
