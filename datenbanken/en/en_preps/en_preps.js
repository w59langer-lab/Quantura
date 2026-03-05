// ============================================================
// DE: Englisch – Präpositionen (Beispiel-Datenbank)
// EN: English – prepositions (example database)
// RU: Английский – предлоги (пример базы данных)
// ============================================================

const EN_PREPS = [
  { id: "in", base: "in", level: "A1", translation_de: "in", translation_ru: "в", tags: ["place"] },
  { id: "on", base: "on", level: "A1", translation_de: "auf", translation_ru: "на", tags: ["place"] },
  { id: "with", base: "with", level: "A1", translation_de: "mit", translation_ru: "с", tags: ["instrument"] },
  { id: "to", base: "to", level: "A1", translation_de: "zu/nach", translation_ru: "к/в", tags: ["direction"] },
  { id: "at", base: "at", level: "A1", translation_de: "an/bei", translation_ru: "у/в", tags: ["place"] }
];

if (typeof module !== "undefined") {
  module.exports = { EN_PREPS };
}
