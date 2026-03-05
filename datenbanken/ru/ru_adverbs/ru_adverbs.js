// ============================================================
// DE: Russisch – Adverbien (Beispiel-Datenbank)
// EN: Russian – adverbs (example database)
// RU: Русский – наречия (пример базы данных)
// ============================================================

const RU_ADVERBS = [
  { id: "segodnya", base: "сегодня", level: "A1", translation_de: "heute", translation_en: "today", group: "время" },
  { id: "seychas", base: "сейчас", level: "A1", translation_de: "jetzt", translation_en: "now", group: "время" },
  { id: "vsegda", base: "всегда", level: "A1", translation_de: "immer", translation_en: "always", group: "частота" },
  { id: "bystro", base: "быстро", level: "A1", translation_de: "schnell", translation_en: "quickly", group: "образ" },
  { id: "medlenno", base: "медленно", level: "A1", translation_de: "langsam", translation_en: "slowly", group: "образ" }
];

if (typeof module !== "undefined") {
  module.exports = { RU_ADVERBS };
}
