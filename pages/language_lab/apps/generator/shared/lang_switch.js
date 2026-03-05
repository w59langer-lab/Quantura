// =========================================================
// DE: Sprachumschalter – Logik
// EN: Language switcher – logic
// RU: Переключатель языков – логика
// =========================================================

(function () {
  const LANG_ROUTES = {
    de: "../de/index_de.html",
    en: "../en/index_en.html",
    fr: "../fr/index_fr.html",
    it: "../it/index_it.html",
    ru: "../ru/index_ru.html",
    es: "../es/index_es.html",
  };

  function getCurrentLang(container) {
    if (container && container.dataset.activeLang) {
      return container.dataset.activeLang;
    }
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    return htmlLang.slice(0, 2);
  }

  function initLangSwitch() {
    const container = document.querySelector(".lang-switch");
    if (!container) return;

    const currentLang = getCurrentLang(container);
    const buttons = Array.from(container.querySelectorAll("[data-lang]"));

    buttons.forEach((btn) => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) {
        btn.classList.add("is-active");
      }
      btn.addEventListener("click", () => {
        const target = LANG_ROUTES[lang];
        if (!target) return;
        window.location.href = target;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLangSwitch);
  } else {
    initLangSwitch();
  }
})();
