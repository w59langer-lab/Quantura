// ============================================================
// DE: Russisch – Adjektive (Beispiel-Datenbank)
// EN: Russian – adjectives (example database)
// RU: Русский – прилагательные (пример базы данных)
// ============================================================

const RU_ADJECTIVES = [
  { id: "malenkiy", base: "маленький", level: "A1", translation_de: "klein", translation_en: "small", tags: ["база"] },
  { id: "bolshoy", base: "большой", level: "A1", translation_de: "groß", translation_en: "big", tags: ["база"] },
  { id: "novyy", base: "новый", level: "A1", translation_de: "neu", translation_en: "new", tags: ["база"] },
  { id: "bistryy", base: "быстрый", level: "A1", translation_de: "schnell", translation_en: "fast", tags: ["скорость"] },
  { id: "medlennyy", base: "медленный", level: "A1", translation_de: "langsam", translation_en: "slow", tags: ["скорость"] }
];

if (typeof module !== "undefined") {
  module.exports = { RU_ADJECTIVES };
}
