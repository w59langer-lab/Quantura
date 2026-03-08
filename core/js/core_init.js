// ============================================================
// DE: Master-Skript für LG_MASTER_FULL_v3
// EN: Master script for LG_MASTER_FULL_v3
// RU: Ð“Ð»Ð°Ð²Ð½Ñ‹Ð¹ ÑÐºÑ€Ð¸Ð¿Ñ‚ Ð¿Ñ€Ð¾ÐµÐºÑ‚Ð° LG_MASTER_FULL_v3
// ============================================================

// ------------------------------------------------------------
// 1) THEMA (HELL/DUNKEL) – Standard: DUNKEL
// ------------------------------------------------------------
(function setupTheme() {
  const html = document.documentElement;
  const STORAGE_KEY = "lg_theme";

  function setTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  // DE: Standard-Theme jetzt "light"; Benutzerwahl wird in localStorage gemerkt.
  // RU: Ð¢ÐµÐ¿ÐµÑ€ÑŒ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ ÑÐ²ÐµÑ‚Ð»Ð°Ñ Ñ‚ÐµÐ¼Ð°, Ð²Ñ‹Ð±Ð¾Ñ€ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ ÑÐ¾Ñ…Ñ€Ð°Ð½ÑÐµÑ‚ÑÑ Ð² localStorage.
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialTheme = saved === "dark" || saved === "light" ? saved : "light";
  setTheme(initialTheme);

  // DE: Klick auf Theme-Taste auswerten
  // EN: Handle clicks on theme toggle button
  // RU: ÐžÐ±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÐµÐ¼ ÐºÐ»Ð¸ÐºÐ¸ Ð¿Ð¾ ÐºÐ½Ð¾Ð¿ÐºÐµ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ Ñ‚ÐµÐ¼Ñ‹
  document.addEventListener("click", (evt) => {
    const target =
      evt.target instanceof Element ? evt.target : evt.target?.parentElement;
    const btn = target?.closest?.("#themeToggle, [data-theme-toggle]");
    if (!btn) return;

    const current =
      html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";

    setTheme(next);
  });
})();

// ------------------------------------------------------------
// 2) HEADER/FOOTER als Partials laden
// ------------------------------------------------------------
// DE: Lädt HTML-Fragmente (header.html, footer.html) in Container
// EN: Loads HTML fragments (header.html, footer.html) into containers
// RU: Ð—Ð°Ð³Ñ€ÑƒÐ¶Ð°ÐµÑ‚ Ñ„Ñ€Ð°Ð³Ð¼ÐµÐ½Ñ‚Ñ‹ (header.html, footer.html) Ð² ÐºÐ¾Ð½Ñ‚ÐµÐ¹Ð½ÐµÑ€Ñ‹
(function loadPartials() {
  const hosts = document.querySelectorAll("[data-partial]");

  function navigateSmart(url, evt) {
    if (!url) return;
    const isExternal = /^https?:\/\//.test(url);
    const isPortal = url === "/" || url.startsWith("/index.html");
    if (typeof window.LL_NAVIGATE === "function" && !isExternal && isPortal) {
      evt?.preventDefault();
      window.LL_NAVIGATE("/index.html");
    } else if (!isExternal) {
      evt?.preventDefault();
      window.location.href = url;
    }
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    const portal = "/index.html";
    if (typeof window.LL_NAVIGATE === "function") {
      window.LL_NAVIGATE(portal);
    } else {
      window.location.href = portal;
    }
  }

  (function ensureFabNavAssets() {
    const cssHref = "/assets/css/ll_fab_nav.css";
    const jsSrc = "/assets/js/ll_fab_nav.js";

    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      document.head.appendChild(link);
    }

    if (!document.querySelector(`script[src="${jsSrc}"]`)) {
      const script = document.createElement("script");
      script.src = jsSrc;
      script.defer = true;
      document.head.appendChild(script);
    }
  })();

  function normalizePartialPath(rawPath) {
    if (!rawPath) return rawPath;
    if (/^[a-z]+:\/\//i.test(rawPath)) return rawPath;
    const trimmed = rawPath.trim();
    const hasCoreSegment = /(^|\/)core\//.test(trimmed);
    if (trimmed.startsWith("/") || trimmed.startsWith("core/") || hasCoreSegment) {
      return trimmed.replace(/core\/core\//g, "core/");
    }
    return `core/${trimmed.replace(/^\/+/, "")}`;
  }

  hosts.forEach((host) => {
    const type = host.getAttribute("data-partial"); // "header" oder "footer"
    const path = host.getAttribute("data-partial-path");
    if (!path) return;
    const normalizedPath = normalizePartialPath(path);

    fetch(normalizedPath)
      .then((r) => r.text())
      .then((html) => {
        host.innerHTML = html;

        // DE: Keine automatische Umschreibung von Menü-Links; direkte hrefs bleiben.
        host.querySelectorAll("[data-nav]").forEach((el) => {
          const url = el.getAttribute("data-nav");
          if (!url) return;
          el.addEventListener("click", (evt) => navigateSmart(url, evt));
        });

        host.querySelectorAll("[data-back]").forEach((el) => {
          el.addEventListener("click", (evt) => {
            evt.preventDefault();
            goBack();
          });
        });

        // DE: Im Footer Jahr aktualisieren
        // EN: Update year in footer
        // RU: ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ð³Ð¾Ð´ Ð² Ñ„ÑƒÑ‚ÐµÑ€Ðµ
        if (type === "footer") {
          const yearSpan = host.querySelector("#footerYear");
          if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
          }
        }
      })
      .catch((err) => console.error("Partial load error:", type, path, err));
  });
})();

// ------------------------------------------------------------
// 3) UHR, DATUM, KALENDERWOCHE (KW)
// ------------------------------------------------------------
// DE: Datum + Uhrzeit + Kalenderwoche berechnen und anzeigen
// EN: Calculate and display date + time + calendar week
// RU: Ð’Ñ‹Ñ‡Ð¸ÑÐ»ÑÐµÐ¼ Ð¸ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ð´Ð°Ñ‚Ñƒ + Ð²Ñ€ÐµÐ¼Ñ + ÐºÐ°Ð»ÐµÐ½Ð´Ð°Ñ€Ð½ÑƒÑŽ Ð½ÐµÐ´ÐµÐ»ÑŽ
function updateClock() {
  const d = new Date();

  const dateStr = d.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const oneJan = new Date(d.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((d - oneJan) / 86400000);
  const kw = Math.ceil((d.getDay() + 1 + numberOfDays) / 7);

  const dateTimeEl = document.getElementById("headerDateTime");
  const kwEl = document.getElementById("headerKW");
  const calendarBtn = document.getElementById("headerCalendarBtn");

  if (dateTimeEl) dateTimeEl.textContent = `${dateStr} · ${timeStr}`;
  if (kwEl) kwEl.textContent = "KW " + kw;
  if (calendarBtn) calendarBtn.title = `Kalender · KW ${kw}`;
}

// DE: Alle Sekunde Uhr aktualisieren
// EN: Update clock every second
// RU: ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ñ‡Ð°ÑÑ‹ ÐºÐ°Ð¶Ð´ÑƒÑŽ ÑÐµÐºÑƒÐ½Ð´Ñƒ
setInterval(updateClock, 1000);
// DE: Einmal sofort aufrufen, damit etwas steht
// EN: Call once immediately
// RU: Ð’Ñ‹Ð·Ñ‹Ð²Ð°ÐµÐ¼ ÑÑ€Ð°Ð·Ñƒ Ð¾Ð´Ð¸Ð½ Ñ€Ð°Ð· Ð¿Ñ€Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐµ
updateClock();

// ------------------------------------------------------------
// 4) TTS-Manager global laden
// ------------------------------------------------------------
(function loadTtsManager() {
  const SRC = "/core/js/tts_manager.js";
  if (window.TTSManager || document.querySelector(`script[data-tts-manager="1"]`)) {
    return;
  }
  const script = document.createElement("script");
  script.src = SRC;
  script.defer = true;
  script.dataset.ttsManager = "1";
  document.head.appendChild(script);
})();

