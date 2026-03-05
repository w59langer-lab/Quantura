// ============================================================
// ES: Preposiciones – ejemplo
// EN: Spanish prepositions – example list
// ============================================================

const ES_PREPS = [
  { id: "en", base: "en", level: "A1", translation_en: "in/on", translation_de: "in/auf", tags: ["lugar"] },
  { id: "a", base: "a", level: "A1", translation_en: "to/at", translation_de: "zu/an", tags: ["direccion"] },
  { id: "con", base: "con", level: "A1", translation_en: "with", translation_de: "mit", tags: ["instrumento"] },
  { id: "de", base: "de", level: "A1", translation_en: "of/from", translation_de: "von/aus", tags: ["origen"] },
  { id: "para", base: "para", level: "A1", translation_en: "for", translation_de: "für", tags: ["proposito"] },
];

if (typeof module !== "undefined") {
  module.exports = { ES_PREPS };
}
