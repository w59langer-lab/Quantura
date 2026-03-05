// ============================================================
// DE: Englisch – Adverbien (Beispiel-Datenbank)
// EN: English – adverbs (example database)
// RU: Английский – наречия (пример базы данных)
// ============================================================

const EN_ADVERBS = [
  { id: "today", base: "today", level: "A1", translation_de: "heute", translation_ru: "сегодня", group: "time" },
  { id: "now", base: "now", level: "A1", translation_de: "jetzt", translation_ru: "сейчас", group: "time" },
  { id: "always", base: "always", level: "A1", translation_de: "immer", translation_ru: "всегда", group: "frequency" },
  { id: "quickly", base: "quickly", level: "A1", translation_de: "schnell", translation_ru: "быстро", group: "manner" },
  { id: "slowly", base: "slowly", level: "A1", translation_de: "langsam", translation_ru: "медленно", group: "manner" }
];

if (typeof module !== "undefined") {
  module.exports = { EN_ADVERBS };
}
