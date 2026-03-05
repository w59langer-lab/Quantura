// ============================================================
// DE: Englisch – Adjektive (Beispiel-Datenbank)
// EN: English – adjectives (example database)
// RU: Английский – прилагательные (пример базы данных)
// ============================================================

const EN_ADJECTIVES = [
  { id: "small", base: "small", level: "A1", translation_de: "klein", translation_ru: "маленький", tags: ["basic"] },
  { id: "big", base: "big", level: "A1", translation_de: "groß", translation_ru: "большой", tags: ["basic"] },
  { id: "new", base: "new", level: "A1", translation_de: "neu", translation_ru: "новый", tags: ["basic"] },
  { id: "fast", base: "fast", level: "A1", translation_de: "schnell", translation_ru: "быстрый", tags: ["speed"] },
  { id: "happy", base: "happy", level: "A1", translation_de: "glücklich", translation_ru: "счастливый", tags: ["mood"] }
];

if (typeof module !== "undefined") {
  module.exports = { EN_ADJECTIVES };
}
