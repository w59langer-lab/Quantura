// ============================================================
// DE: Italienisch – Adverbien (Beispiel-Datenbank)
// EN: Italian – adverbs (example database)
// RU: Итальянский – наречия (пример базы данных)
// ============================================================

const IT_ADVERBS = [
  { id: "oggi", base: "oggi", level: "A1", translation_de: "heute", translation_ru: "сегодня", group: "tempo" },
  { id: "adesso", base: "adesso", level: "A1", translation_de: "jetzt", translation_ru: "сейчас", group: "tempo" },
  { id: "sempre", base: "sempre", level: "A1", translation_de: "immer", translation_ru: "всегда", group: "frequenza" },
  { id: "velocemente", base: "velocemente", level: "A1", translation_de: "schnell", translation_ru: "быстро", group: "modo" },
  { id: "lentamente", base: "lentamente", level: "A1", translation_de: "langsam", translation_ru: "медленно", group: "modo" }
];

if (typeof module !== "undefined") {
  module.exports = { IT_ADVERBS };
}
