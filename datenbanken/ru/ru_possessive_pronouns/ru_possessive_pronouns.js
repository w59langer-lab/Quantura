// ============================================================
// RU: Притяжательные местоимения – краткий список
// EN: Russian possessive pronouns – short list
// ============================================================

const RU_POSSESSIVE_PRONOUNS = [
  { id: "moj", form: "мой", person: 1, number: "sg", translation_en: "my (m.)", translation_de: "mein" },
  { id: "moja", form: "моя", person: 1, number: "sg", translation_en: "my (f.)", translation_de: "meine" },
  { id: "moe", form: "моё", person: 1, number: "sg", translation_en: "my (n.)", translation_de: "mein (sachlich)" },
  { id: "nash", form: "наш", person: 1, number: "pl1", translation_en: "our (m.)", translation_de: "unser" },
  { id: "nasha", form: "наша", person: 1, number: "pl1", translation_en: "our (f.)", translation_de: "unsere" },
  { id: "nasho", form: "наше", person: 1, number: "pl1", translation_en: "our (n.)", translation_de: "unser (sachlich)" },
  { id: "tvoj", form: "твой", person: 2, number: "sg", translation_en: "your (m., sg)", translation_de: "dein" },
  { id: "tvaja", form: "твоя", person: 2, number: "sg", translation_en: "your (f., sg)", translation_de: "deine" },
  { id: "tvoe", form: "твоё", person: 2, number: "sg", translation_en: "your (n., sg)", translation_de: "dein (sachlich)" },
  { id: "vash", form: "ваш", person: 2, number: "pl2", translation_en: "your (m., pl/formal)", translation_de: "euer/Ihr" },
  { id: "vasha", form: "ваша", person: 2, number: "pl2", translation_en: "your (f., pl/formal)", translation_de: "eure/Ihre" },
  { id: "vashe", form: "ваше", person: 2, number: "pl2", translation_en: "your (n., pl/formal)", translation_de: "Ihr (sachlich)" },
  { id: "ih", form: "их", person: 3, number: "pl3", translation_en: "their", translation_de: "ihr" },
  { id: "ego", form: "его", person: 3, number: "sg", translation_en: "his/its", translation_de: "sein" },
  { id: "ee", form: "её", person: 3, number: "sg", translation_en: "her/its", translation_de: "ihr" },
];

if (typeof module !== "undefined") {
  module.exports = { RU_POSSESSIVE_PRONOUNS };
}
