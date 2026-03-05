// ============================================================
// ES: Adverbios básicos – ejemplo
// EN: Spanish adverbs – example list
// ============================================================

const ES_ADVERBS = [
  { id: "rapidamente", base: "rápidamente", level: "A2", translation_en: "quickly", translation_de: "schnell", tags: ["modo"] },
  { id: "despacio", base: "despacio", level: "A1", translation_en: "slowly", translation_de: "langsam", tags: ["modo"] },
  { id: "aqui", base: "aquí", level: "A1", translation_en: "here", translation_de: "hier", tags: ["lugar"] },
  { id: "alli", base: "allí", level: "A1", translation_en: "there", translation_de: "dort", tags: ["lugar"] },
  { id: "siempre", base: "siempre", level: "A1", translation_en: "always", translation_de: "immer", tags: ["frecuencia"] },
  { id: "nunca", base: "nunca", level: "A1", translation_en: "never", translation_de: "nie", tags: ["frecuencia"] },
];

if (typeof module !== "undefined") {
  module.exports = { ES_ADVERBS };
}
