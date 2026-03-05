// ============================================================
// DE: Französisch – Adjektive (Beispiel-Datenbank)
// EN: French – adjectives (example database)
// RU: Французский – прилагательные (пример базы данных)
// ============================================================

const FR_ADJECTIVES = [
  { id: "petit", base: "petit", level: "A1", translation_de: "klein", translation_ru: "маленький", tags: ["base"] },
  { id: "grand", base: "grand", level: "A1", translation_de: "groß", translation_ru: "большой", tags: ["base"] },
  { id: "nouveau", base: "nouveau", level: "A1", translation_de: "neu", translation_ru: "новый", tags: ["base"] },
  { id: "rapide", base: "rapide", level: "A1", translation_de: "schnell", translation_ru: "быстрый", tags: ["vitesse"] },
  { id: "lent", base: "lent", level: "A1", translation_de: "langsam", translation_ru: "медленный", tags: ["vitesse"] }
];

if (typeof module !== "undefined") {
  module.exports = { FR_ADJECTIVES };
}
