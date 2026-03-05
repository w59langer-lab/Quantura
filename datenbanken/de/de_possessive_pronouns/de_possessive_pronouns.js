// ============================================================
// DE: Deutsche Possessivpronomen – Kurzliste
// EN: German possessive pronouns – short list
// ============================================================

const DE_POSSESSIVE_PRONOUNS = [
  { id: "mein", form: "mein", person: 1, number: "sg", translation_en: "my", translation_ru: "мой" },
  { id: "dein", form: "dein", person: 2, number: "sg", translation_en: "your (sg)", translation_ru: "твой" },
  { id: "sein", form: "sein", person: 3, number: "sg", translation_en: "his/its", translation_ru: "его" },
  { id: "ihr", form: "ihr", person: 3, number: "sg", translation_en: "her", translation_ru: "её" },
  { id: "unser", form: "unser", person: 1, number: "pl1", translation_en: "our", translation_ru: "наш" },
  { id: "euer", form: "euer", person: 2, number: "pl2", translation_en: "your (pl)", translation_ru: "ваш" },
  { id: "Ihr", form: "Ihr", person: 2, number: "formal", translation_en: "your (formal)", translation_ru: "Ваш" },
  { id: "ihr_plural", form: "ihr", person: 3, number: "pl3", translation_en: "their", translation_ru: "их" },
];

if (typeof window !== "undefined") {
  window.DE_POSSESSIVE_PRONOUNS = DE_POSSESSIVE_PRONOUNS;
}

if (typeof module !== "undefined") {
  module.exports = { DE_POSSESSIVE_PRONOUNS };
}
