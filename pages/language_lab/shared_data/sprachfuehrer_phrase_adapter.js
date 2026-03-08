(function(){
  const SHARED_URL = "/pages/language_lab/shared_data/sprachfuehrer_phrases.json";
  const cache = { data: null, promise: null, lastFetch: null };

  async function loadSharedData() {
    if (cache.data) return cache.data;
    if (!cache.promise) {
      cache.lastFetch = { url: SHARED_URL, status: "pending" };
      cache.promise = fetch(SHARED_URL, { cache: "no-store" })
        .then((res) => {
          cache.lastFetch = { url: res.url || SHARED_URL, status: res.status };
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json) => {
          cache.data = Array.isArray(json?.items) ? json.items : [];
          return cache.data;
        })
        .catch((err) => {
          cache.promise = null;
          cache.lastFetch = {
            url: SHARED_URL,
            status: "error",
            error: err?.message || String(err),
          };
          throw err;
        });
    }
    return cache.promise;
  }

  function pickLang(rec, langCode) {
    if (!rec) return "";
    const key = String(langCode || "").toUpperCase();
    return rec[key] || rec[key.toLowerCase()] || "";
  }

  function makeId(rec) {
    if (rec?.id) return rec.id;
    const topic = rec?.topic || "all";
    const level = rec?.level ?? "";
    const de = rec?.DE || "";
    const en = rec?.EN || "";
    return `${topic}|${level}|${de}|${en}`;
  }

  async function loadPairDeck(sourceLang = "DE", targetLang = "EN") {
    const data = await loadSharedData();
    const cards = [];
    for (const rec of data) {
      const srcText = pickLang(rec, sourceLang);
      const dstText = pickLang(rec, targetLang);
      if (!srcText || !dstText) continue;
      const id = makeId(rec);
      const lvl = rec.level ?? rec.stufe ?? "";
      cards.push({
        id,
        de: srcText,
        en: dstText,
        topic: rec.topic || "all",
        stufe: String(lvl ?? ""),
        level: String(lvl ?? ""),
        mnemo: rec.mnemoHint || rec.mnemoKey || "",
      });
    }
    return { cards, url: cache.lastFetch?.url || SHARED_URL, status: cache.lastFetch?.status };
  }

  window.SprachfuehrerSharedAdapter = {
    loadSharedData,
    loadPairDeck,
    getLastFetch: () => cache.lastFetch,
    getSharedUrl: () => SHARED_URL,
  };
})();
