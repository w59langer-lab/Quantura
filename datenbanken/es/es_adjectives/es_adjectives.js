// ============================================================
// ES: Adjetivos básicos – ejemplo
// EN: Spanish adjectives – example list
// ============================================================

const ES_ADJECTIVES = [
  { id: "pequeno", base: "pequeño", level: "A1", translation_en: "small", translation_de: "klein", tags: ["basico"] },
  { id: "grande", base: "grande", level: "A1", translation_en: "big", translation_de: "groß", tags: ["basico"] },
  { id: "nuevo", base: "nuevo", level: "A1", translation_en: "new", translation_de: "neu", tags: ["basico"] },
  { id: "rapido", base: "rápido", level: "A1", translation_en: "fast", translation_de: "schnell", tags: ["velocidad"] },
  { id: "feliz", base: "feliz", level: "A1", translation_en: "happy", translation_de: "glücklich", tags: ["emocion"] },
  { id: "interesante", base: "interesante", level: "A2", translation_en: "interesting", translation_de: "interessant", tags: ["descripcion"] },
];

if (typeof module !== "undefined") {
  module.exports = { ES_ADJECTIVES };
}
