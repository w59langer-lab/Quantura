(function () {
  const PORTAL_URL = "/index.html";

  function gotoPortal() {
    if (typeof window.LL_NAVIGATE === "function") {
      window.LL_NAVIGATE(PORTAL_URL);
    } else {
      window.location.href = PORTAL_URL;
    }
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      gotoPortal();
    }
  }

  function ensureFab() {
    if (document.getElementById("ll-fab-nav")) return;

    const wrap = document.createElement("div");
    wrap.id = "ll-fab-nav";

    const backBtn = document.createElement("button");
    backBtn.id = "llBackBtn";
    backBtn.className = "ll-fab-btn";
    backBtn.type = "button";
    backBtn.textContent = "← Zurück";
    backBtn.addEventListener("click", goBack);

    const portalBtn = document.createElement("button");
    portalBtn.id = "llPortalBtn";
    portalBtn.className = "ll-fab-btn";
    portalBtn.type = "button";
    portalBtn.textContent = "🏠 Portal";
    portalBtn.addEventListener("click", gotoPortal);

    wrap.append(backBtn, portalBtn);
    document.body.appendChild(wrap);

    updateFooterOffset();
  }

  function updateFooterOffset() {
    const footer =
      document.querySelector(".site-footer") ||
      document.querySelector("footer");
    const offset = footer ? footer.offsetHeight + 12 : 0;
    document.documentElement.style.setProperty(
      "--fab-footer-offset",
      `${offset}px`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureFab);
  } else {
    ensureFab();
  }

  window.addEventListener("resize", updateFooterOffset);
})();
