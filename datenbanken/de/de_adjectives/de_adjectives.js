// ============================================================
// DE: Deutsche Adjektive – Kernliste
// EN: German adjectives – core list
// RU: Немецкие прилагательные – основной список
// ============================================================

const DE_ADJECTIVES = [
  { id: "klein", base: "klein", level: "A1" },
  { id: "gross", base: "groß", level: "A1" },
  { id: "neu", base: "neu", level: "A1" },
  { id: "alt", base: "alt", level: "A1" },
  { id: "schoen", base: "schön", level: "A1" },
  { id: "schnell", base: "schnell", level: "A1" },
  { id: "langsam", base: "langsam", level: "A1" },
  { id: "laut", base: "laut", level: "A1" },
  { id: "leise", base: "leise", level: "A1" },
  { id: "schwer", base: "schwer", level: "A2" },
  { id: "leicht", base: "leicht", level: "A2" },
  { id: "interessant", base: "interessant", level: "A2" },
  { id: "wichtig", base: "wichtig", level: "A2" },
  { id: "müde", base: "müde", level: "A2" },
  { id: "hungrig", base: "hungrig", level: "A2" },
  { id: "durstig", base: "durstig", level: "A2" },
  { id: "freundlich", base: "freundlich", level: "B1" },
  { id: "geduldig", base: "geduldig", level: "B1" },
  { id: "kreativ", base: "kreativ", level: "B1" }
];

if (typeof window !== "undefined") {
  window.DE_ADJECTIVES = DE_ADJECTIVES;
}
