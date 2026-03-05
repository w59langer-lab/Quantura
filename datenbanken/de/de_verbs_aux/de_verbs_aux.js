// ============================================================
// DE: Hilfsverben – Flag-Format
// EN: Auxiliaries – flag format
// ============================================================

const DE_VERBS_AUX = [
  {
    inf: "sein",
    voll: true,
    presens: {
      ich: "bin",
      du: "bist",
      er: "ist",
      wir: "sind",
      ihr: "seid",
      sie: "sind",
    },
    perfektAux: "haben",
    partizip: "gewesen",
    trennbar: false,
    modal: false,
  },
  {
    inf: "haben",
    voll: true,
    presens: {
      ich: "habe",
      du: "hast",
      er: "hat",
      wir: "haben",
      ihr: "habt",
      sie: "haben",
    },
    perfektAux: "haben",
    partizip: "gehabt",
    trennbar: false,
    modal: false,
  },
  {
    inf: "werden",
    voll: true,
    presens: {
      ich: "werde",
      du: "wirst",
      er: "wird",
      wir: "werden",
      ihr: "werdet",
      sie: "werden",
    },
    perfektAux: "sein",
    partizip: "geworden",
    trennbar: false,
    modal: false,
  },
];

if (typeof window !== "undefined") {
  window.DE_VERBS_AUX = DE_VERBS_AUX;
}
