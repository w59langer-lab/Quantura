// ============================================================
// IT: Pronomi possessivi – Kurzliste
// EN: Italian possessive pronouns – short list
// ============================================================

const IT_POSSESSIVE_PRONOUNS = [
  { id: "mio", form: "mio", person: 1, number: "sg", gender: "m", translation_en: "my (m.)", translation_de: "mein" },
  { id: "mia", form: "mia", person: 1, number: "sg", gender: "f", translation_en: "my (f.)", translation_de: "meine" },
  { id: "tuo", form: "tuo", person: 2, number: "sg", gender: "m", translation_en: "your (m.)", translation_de: "dein" },
  { id: "tua", form: "tua", person: 2, number: "sg", gender: "f", translation_en: "your (f.)", translation_de: "deine" },
  { id: "suo_m", form: "suo", person: 3, number: "sg", gender: "m", translation_en: "his/its", translation_de: "sein" },
  { id: "sua_f", form: "sua", person: 3, number: "sg", gender: "f", translation_en: "her/its", translation_de: "ihr" },
  { id: "nostro", form: "nostro", person: 1, number: "pl1", translation_en: "our (m.)", translation_de: "unser" },
  { id: "nostra", form: "nostra", person: 1, number: "pl1", translation_en: "our (f.)", translation_de: "unsere" },
  { id: "vostro", form: "vostro", person: 2, number: "pl2", translation_en: "your (m., pl)", translation_de: "euer/Ihr" },
  { id: "vostra", form: "vostra", person: 2, number: "pl2", translation_en: "your (f., pl)", translation_de: "eure/Ihre" },
  { id: "loro", form: "loro", person: 3, number: "pl3", translation_en: "their", translation_de: "ihr" },
];

if (typeof module !== "undefined") {
  module.exports = { IT_POSSESSIVE_PRONOUNS };
}
