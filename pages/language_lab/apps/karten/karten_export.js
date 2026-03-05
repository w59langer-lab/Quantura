// Exportiert Karten (Basis + Custom) als TSV für Excel/LibreOffice
(function () {
  const EXPORT_BTN_ID = "kartenExportBtn";
  const CUSTOM_KEY = "LG_KARTEN_CUSTOM_V1";
  const btn = document.getElementById(EXPORT_BTN_ID);

  if (!btn) return;

  function loadCustomCards() {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((c) => ({
        id: c.id || `custom_${Date.now()}`,
        lang: c.lang || c.frontLang || "en",
        front: c.front || "",
        back: c.back || "",
        frontLang: c.frontLang || c.lang || "en",
        backLang: c.backLang || c.lang || c.frontLang || "en",
        isUserCard: 1,
      }));
    } catch (e) {
      console.warn("Custom cards load failed", e);
      return [];
    }
  }

  function normalizeBaseCards() {
    if (!Array.isArray(window.LG_KARTEN_DB)) return [];
    return window.LG_KARTEN_DB.map((c) => ({
      id: c.id || "",
      lang: c.lang || c.frontLang || "en",
      front: c.front || "",
      back: c.back || "",
      frontLang: c.frontLang || c.lang || "en",
      backLang: c.backLang || c.lang || c.frontLang || "en",
      isUserCard: 0,
    }));
  }

  function sanitize(value) {
    return String(value ?? "")
      .replace(/\t/g, " ")
      .replace(/\r?\n/g, " ");
  }

  function toTsv(rows) {
    const header = [
      "id",
      "lang",
      "frontLang",
      "front",
      "backLang",
      "back",
      "isUserCard",
    ];
    const lines = [
      header.join("\t"),
      ...rows.map((r) =>
        [
          r.id,
          r.lang,
          r.frontLang,
          r.front,
          r.backLang,
          r.back,
          r.isUserCard ? 1 : 0,
        ]
          .map(sanitize)
          .join("\t")
      ),
    ];
    return lines.join("\n");
  }

  function triggerDownload(content, filename) {
    const blob = new Blob([content], { type: "text/tab-separated-values;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleExport() {
    const baseCards = normalizeBaseCards();
    const customCards = loadCustomCards();
    const allRows = [...baseCards, ...customCards];
    const tsv = toTsv(allRows);
    triggerDownload(tsv, "lg_karten_export.tsv");
  }

  btn.addEventListener("click", handleExport);
})();
