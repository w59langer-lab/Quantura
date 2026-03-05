// =========================================================
// DE: Deutsche Personalpronomen – Datenbank
// EN: German personal pronouns – database
// RU: Немецкие личные местоимения – база данных
// =========================================================

const DE_PRONOUNS_PERSONAL = [
  { id: "ich", type: "personal", person: 1, number: "sg", case: "nominative", form: "ich", formCap: "Ich" },
  { id: "du", type: "personal", person: 2, number: "sg", case: "nominative", form: "du", formCap: "Du" },
  { id: "er", type: "personal", person: 3, number: "sg", case: "nominative", form: "er", formCap: "Er" },
  { id: "sie", type: "personal", person: 3, number: "sg", case: "nominative", form: "sie", formCap: "Sie" },
  { id: "es", type: "personal", person: 3, number: "sg", case: "nominative", form: "es", formCap: "Es" },
  { id: "wir", type: "personal", person: 1, number: "pl", case: "nominative", form: "wir", formCap: "Wir" },
  { id: "ihr", type: "personal", person: 2, number: "pl", case: "nominative", form: "ihr", formCap: "Ihr" },
  { id: "sie_pl", type: "personal", person: 3, number: "pl", case: "nominative", form: "sie", formCap: "Sie" },
  { id: "Sie_formal", type: "personal", person: 2, number: "formal", case: "nominative", form: "Sie", formCap: "Sie" },
];

if (typeof window !== "undefined") {
  window.DE_PRONOUNS_PERSONAL = DE_PRONOUNS_PERSONAL;
}

if (typeof module !== "undefined") {
  module.exports = { DE_PRONOUNS_PERSONAL };
}
