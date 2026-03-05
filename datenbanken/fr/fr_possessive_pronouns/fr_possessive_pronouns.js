// ============================================================
// FR: Pronoms possessifs – Kurzliste
// EN: French possessive pronouns – short list
// ============================================================

const FR_POSSESSIVE_PRONOUNS = [
  { id: "mon", form: "mon", person: 1, number: "sg", gender: "m", translation_en: "my (m.)", translation_de: "mein" },
  { id: "ma", form: "ma", person: 1, number: "sg", gender: "f", translation_en: "my (f.)", translation_de: "meine" },
  { id: "ton", form: "ton", person: 2, number: "sg", gender: "m", translation_en: "your (m.)", translation_de: "dein" },
  { id: "ta", form: "ta", person: 2, number: "sg", gender: "f", translation_en: "your (f.)", translation_de: "deine" },
  { id: "son", form: "son", person: 3, number: "sg", gender: "m", translation_en: "his/its", translation_de: "sein" },
  { id: "sa", form: "sa", person: 3, number: "sg", gender: "f", translation_en: "her/its", translation_de: "ihr" },
  { id: "notre", form: "notre", person: 1, number: "pl1", translation_en: "our (sg noun)", translation_de: "unser" },
  { id: "votre", form: "votre", person: 2, number: "pl2", translation_en: "your (sg noun)", translation_de: "euer/Ihr" },
  { id: "leur", form: "leur", person: 3, number: "pl3", translation_en: "their (sg noun)", translation_de: "ihr" },
  { id: "nos", form: "nos", person: 1, number: "pl1", translation_en: "our (pl noun)", translation_de: "unsere" },
  { id: "vos", form: "vos", person: 2, number: "pl2", translation_en: "your (pl noun)", translation_de: "eure/Ihre" },
  { id: "leurs", form: "leurs", person: 3, number: "pl3", translation_en: "their (pl noun)", translation_de: "ihre" },
];

if (typeof module !== "undefined") {
  module.exports = { FR_POSSESSIVE_PRONOUNS };
}
