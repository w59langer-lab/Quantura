// ============================================================
// DE: Italienisch – Adjektive (Beispiel-Datenbank)
// EN: Italian – adjectives (example database)
// RU: Итальянский – прилагательные (пример базы данных)
// ============================================================

const IT_ADJECTIVES = [
  { id: "piccolo", base: "piccolo", level: "A1", translation_de: "klein", translation_ru: "маленький", tags: ["base"] },
  { id: "grande", base: "grande", level: "A1", translation_de: "groß", translation_ru: "большой", tags: ["base"] },
  { id: "nuovo", base: "nuovo", level: "A1", translation_de: "neu", translation_ru: "новый", tags: ["base"] },
  { id: "veloce", base: "veloce", level: "A1", translation_de: "schnell", translation_ru: "быстрый", tags: ["velocita"] },
  { id: "lento", base: "lento", level: "A1", translation_de: "langsam", translation_ru: "медленный", tags: ["velocita"] }
];

if (typeof module !== "undefined") {
  module.exports = { IT_ADJECTIVES };
}
