// ============================================================
// ES: Sustantivos básicos – ejemplos
// EN: Spanish nouns – sample list
// RU: Испанские существительные – пример списка
// ============================================================

const ES_NOUNS = [
  { id: "manzana", base: "manzana", gender: "f", number: "sg", plural: "manzanas", translation_en: "apple", translation_de: "Apfel" },
  { id: "ciudad", base: "ciudad", gender: "f", number: "sg", plural: "ciudades", translation_en: "city", translation_de: "Stadt" },
  { id: "libro", base: "libro", gender: "m", number: "sg", plural: "libros", translation_en: "book", translation_de: "Buch" },
  { id: "coche", base: "coche", gender: "m", number: "sg", plural: "coches", translation_en: "car", translation_de: "Auto" },
  { id: "amigo", base: "amigo", gender: "m", number: "sg", plural: "amigos", translation_en: "friend", translation_de: "Freund" },
  { id: "casa", base: "casa", gender: "f", number: "sg", plural: "casas", translation_en: "house", translation_de: "Haus" },
];

if (typeof module !== "undefined") {
  module.exports = { ES_NOUNS };
}
