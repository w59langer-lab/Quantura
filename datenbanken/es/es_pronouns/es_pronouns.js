// ============================================================
// ES: Pronombres personales – base
// EN: Spanish personal pronouns – base list
// ============================================================

const ES_PRONOUNS = [
  { id: "yo", form: "yo", person: 1, number: "sg", translation_en: "I", translation_de: "ich" },
  { id: "tu", form: "tú", person: 2, number: "sg", translation_en: "you", translation_de: "du" },
  { id: "el", form: "él", person: 3, number: "sg", gender: "m", translation_en: "he", translation_de: "er" },
  { id: "ella", form: "ella", person: 3, number: "sg", gender: "f", translation_en: "she", translation_de: "sie" },
  { id: "usted", form: "usted", person: 3, number: "sg", translation_en: "you (formal)", translation_de: "Sie" },
  { id: "nosotros", form: "nosotros", person: 1, number: "pl1", gender: "m", translation_en: "we", translation_de: "wir" },
  { id: "nosotras", form: "nosotras", person: 1, number: "pl1", gender: "f", translation_en: "we (f.)", translation_de: "wir (f.)" },
  { id: "vosotros", form: "vosotros", person: 2, number: "pl2", gender: "m", translation_en: "you (pl)", translation_de: "ihr" },
  { id: "vosotras", form: "vosotras", person: 2, number: "pl2", gender: "f", translation_en: "you (pl, f.)", translation_de: "ihr (f.)" },
  { id: "ellos", form: "ellos", person: 3, number: "pl3", gender: "m", translation_en: "they", translation_de: "sie (m.)" },
  { id: "ellas", form: "ellas", person: 3, number: "pl3", gender: "f", translation_en: "they (f.)", translation_de: "sie (f.)" },
  { id: "ustedes", form: "ustedes", person: 3, number: "pl3", translation_en: "you (formal pl)", translation_de: "Sie (Plural)" },
];

if (typeof module !== "undefined") {
  module.exports = { ES_PRONOUNS };
}
