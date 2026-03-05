// ============================================================
// EN: English – possessive pronouns (example database)
// DE: Englisch – Possessivpronomen (Beispiel)
// ============================================================

const EN_POSSESSIVE_PRONOUNS = [
  { id: "my", form: "my", person: 1, number: "sg", translation_de: "mein", translation_ru: "мой" },
  { id: "your_sg", form: "your", person: 2, number: "sg", translation_de: "dein", translation_ru: "твой" },
  { id: "his", form: "his", person: 3, number: "sg", translation_de: "sein", translation_ru: "его" },
  { id: "her", form: "her", person: 3, number: "sg", translation_de: "ihr", translation_ru: "её" },
  { id: "its", form: "its", person: 3, number: "sg", translation_de: "sein (Sache)", translation_ru: "его (для вещей)" },
  { id: "our", form: "our", person: 1, number: "pl1", translation_de: "unser", translation_ru: "наш" },
  { id: "your_pl", form: "your", person: 2, number: "pl2", translation_de: "euer/Ihr", translation_ru: "ваш" },
  { id: "their", form: "their", person: 3, number: "pl3", translation_de: "ihr (Plural)", translation_ru: "их" },
];

if (typeof module !== "undefined") {
  module.exports = { EN_POSSESSIVE_PRONOUNS };
}
