// ============================================================
// DE: Italienisch – Präpositionen (Beispiel-Datenbank)
// EN: Italian – prepositions (example database)
// RU: Итальянский – предлоги (пример базы данных)
// ============================================================

const IT_PREPS = [
  { id: "in", base: "in", level: "A1", translation_de: "in", translation_ru: "в", tags: ["luogo"] },
  { id: "su", base: "su", level: "A1", translation_de: "auf", translation_ru: "на", tags: ["luogo"] },
  { id: "con", base: "con", level: "A1", translation_de: "mit", translation_ru: "с", tags: ["strumento"] },
  { id: "a", base: "a", level: "A1", translation_de: "zu", translation_ru: "к/в", tags: ["direzione"] },
  { id: "da", base: "da", level: "A1", translation_de: "von/bei", translation_ru: "от/у", tags: ["origine"] }
];

if (typeof module !== "undefined") {
  module.exports = { IT_PREPS };
}
