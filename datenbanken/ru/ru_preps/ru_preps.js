// ============================================================
// DE: Russisch – Präpositionen (Beispiel-Datenbank)
// EN: Russian – prepositions (example database)
// RU: Русский – предлоги (пример базы данных)
// ============================================================

const RU_PREPS = [
  { id: "v", base: "в", level: "A1", translation_de: "in", translation_en: "in", tags: ["место"] },
  { id: "na", base: "на", level: "A1", translation_de: "auf", translation_en: "on", tags: ["место"] },
  { id: "s", base: "с", level: "A1", translation_de: "mit", translation_en: "with", tags: ["инструмент"] },
  { id: "k", base: "к", level: "A1", translation_de: "zu", translation_en: "to/toward", tags: ["направление"] },
  { id: "u", base: "у", level: "A1", translation_de: "bei", translation_en: "by/at", tags: ["место"] }
];

if (typeof module !== "undefined") {
  module.exports = { RU_PREPS };
}
