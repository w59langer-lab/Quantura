// ============================================================
// DE: Französisch – Adverbien (Beispiel-Datenbank)
// EN: French – adverbs (example database)
// RU: Французский – наречия (пример базы данных)
// ============================================================

const FR_ADVERBS = [
  { id: "aujourdhui", base: "aujourd'hui", level: "A1", translation_de: "heute", translation_ru: "сегодня", group: "temps" },
  { id: "maintenant", base: "maintenant", level: "A1", translation_de: "jetzt", translation_ru: "сейчас", group: "temps" },
  { id: "toujours", base: "toujours", level: "A1", translation_de: "immer", translation_ru: "всегда", group: "frequence" },
  { id: "vite", base: "vite", level: "A1", translation_de: "schnell", translation_ru: "быстро", group: "maniere" },
  { id: "lentement", base: "lentement", level: "A1", translation_de: "langsam", translation_ru: "медленно", group: "maniere" }
];

if (typeof module !== "undefined") {
  module.exports = { FR_ADVERBS };
}
