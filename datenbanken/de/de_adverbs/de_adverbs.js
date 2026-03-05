// ============================================================
// DE: Deutsche Adverbien – Kernliste
// EN: German adverbs – core list
// RU: Немецкие наречия – основной список
// ============================================================

const DE_ADVERBS = [
  { id: "heute", base: "heute", group: "time" },
  { id: "gestern", base: "gestern", group: "time" },
  { id: "jetzt", base: "jetzt", group: "time" },
  { id: "bald", base: "bald", group: "time" },
  { id: "immer", base: "immer", group: "frequency" },
  { id: "manchmal", base: "manchmal", group: "frequency" },
  { id: "oft", base: "oft", group: "frequency" },
  { id: "selten", base: "selten", group: "frequency" },
  { id: "gern", base: "gern", group: "manner" },
  { id: "schnell", base: "schnell", group: "manner" },
  { id: "langsam", base: "langsam", group: "manner" },
  { id: "draußen", base: "draußen", group: "place" },
  { id: "drinnen", base: "drinnen", group: "place" },
  { id: "oben", base: "oben", group: "place" },
  { id: "unten", base: "unten", group: "place" }
];

if (typeof window !== "undefined") {
  window.DE_ADVERBS = DE_ADVERBS;
}
