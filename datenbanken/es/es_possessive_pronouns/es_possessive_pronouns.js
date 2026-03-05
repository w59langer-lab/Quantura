// ============================================================
// ES: Pronombres posesivos – base
// EN: Spanish possessive pronouns – base list
// ============================================================

const ES_POSSESSIVE_PRONOUNS = [
  { id: "mi", form: "mi", person: 1, number: "sg", translation_en: "my (sg noun)", translation_de: "mein/e" },
  { id: "mis", form: "mis", person: 1, number: "pl", translation_en: "my (pl noun)", translation_de: "meine" },
  { id: "tu", form: "tu", person: 2, number: "sg", translation_en: "your (sg noun)", translation_de: "dein/e" },
  { id: "tus", form: "tus", person: 2, number: "pl", translation_en: "your (pl noun)", translation_de: "deine" },
  { id: "su", form: "su", person: 3, number: "sg", translation_en: "his/her/its/your (formal)", translation_de: "sein/ihr/Ihr" },
  { id: "sus", form: "sus", person: 3, number: "pl", translation_en: "their/your (formal, pl noun)", translation_de: "ihre/Ihre" },
  { id: "nuestro", form: "nuestro", person: 1, number: "pl1", gender: "m", translation_en: "our (m., sg noun)", translation_de: "unser" },
  { id: "nuestra", form: "nuestra", person: 1, number: "pl1", gender: "f", translation_en: "our (f., sg noun)", translation_de: "unsere" },
  { id: "nuestros", form: "nuestros", person: 1, number: "pl1", gender: "m", translation_en: "our (m., pl noun)", translation_de: "unsere (m.)" },
  { id: "nuestras", form: "nuestras", person: 1, number: "pl1", gender: "f", translation_en: "our (f., pl noun)", translation_de: "unsere (f.)" },
  { id: "vuestro", form: "vuestro", person: 2, number: "pl2", gender: "m", translation_en: "your (m., sg noun, pl)", translation_de: "euer" },
  { id: "vuestra", form: "vuestra", person: 2, number: "pl2", gender: "f", translation_en: "your (f., sg noun, pl)", translation_de: "eure" },
  { id: "vuestros", form: "vuestros", person: 2, number: "pl2", gender: "m", translation_en: "your (m., pl noun, pl)", translation_de: "eure (m.)" },
  { id: "vuestras", form: "vuestras", person: 2, number: "pl2", gender: "f", translation_en: "your (f., pl noun, pl)", translation_de: "eure (f.)" },
];

if (typeof module !== "undefined") {
  module.exports = { ES_POSSESSIVE_PRONOUNS };
}
