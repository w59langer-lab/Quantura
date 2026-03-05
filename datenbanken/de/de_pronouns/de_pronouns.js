// ============================================================
// DE: Deutsche Pronomen – Kernsatz
// EN: German pronouns – core set
// RU: Немецкие местоимения – основной набор
// ============================================================

const DE_PRONOUNS = [
  { id: "ich", form: "ich", person: 1, number: "sg" },
  { id: "du", form: "du", person: 2, number: "sg" },
  { id: "er", form: "er", person: 3, number: "sg" },
  { id: "sie", form: "sie", person: 3, number: "sg" },
  { id: "es", form: "es", person: 3, number: "sg" },
  { id: "wir", form: "wir", person: 1, number: "pl" },
  { id: "ihr", form: "ihr", person: 2, number: "pl" },
  { id: "sie_pl", form: "sie", person: 3, number: "pl" },
  { id: "Sie_formal", form: "Sie", person: 2, number: "formal" }
];

if (typeof window !== "undefined") {
  window.DE_PRONOUNS = DE_PRONOUNS;
  // alias for legacy code
  window.DE_PRONOUNS_PERSONAL = DE_PRONOUNS;
}
