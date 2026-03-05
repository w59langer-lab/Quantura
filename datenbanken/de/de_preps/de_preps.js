// ============================================================
// DE: Deutsche Präpositionen – Kernliste
// EN: German prepositions – core list
// RU: Немецкие предлоги – основной список
// ============================================================

const DE_PREPS = [
  { id: "in", base: "in", case_de: "Dativ/Akkusativ" },
  { id: "auf", base: "auf", case_de: "Dativ/Akkusativ" },
  { id: "mit", base: "mit", case_de: "Dativ" },
  { id: "ohne", base: "ohne", case_de: "Akkusativ" },
  { id: "zu", base: "zu", case_de: "Dativ" },
  { id: "nach", base: "nach", case_de: "Dativ" },
  { id: "vor", base: "vor", case_de: "Dativ/Akkusativ" },
  { id: "hinter", base: "hinter", case_de: "Dativ/Akkusativ" },
  { id: "neben", base: "neben", case_de: "Dativ/Akkusativ" }
];

if (typeof window !== "undefined") {
  window.DE_PREPS = DE_PREPS;
}
