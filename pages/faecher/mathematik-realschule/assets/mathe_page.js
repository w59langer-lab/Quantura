document.addEventListener("DOMContentLoaded", () => {
  const scriptUrl = document.currentScript
    ? new URL(document.currentScript.src, window.location.href)
    : new URL("assets/mathe/mathe_page.js", window.location.href);
  const projectRoot = scriptUrl.href.replace(/assets\/mathe\/mathe_page\.js$/, "");
  const linkTo = (relativePath) => new URL(relativePath, projectRoot).href;

  // Breadcrumb
  const bc = document.querySelector(".mathe-breadcrumb");
  if (bc) {
    const raw = bc.dataset.breadcrumb || "";
    const parts = raw.split("|").map((p) => p.trim()).filter(Boolean);
    const map = {
      Fächer: linkTo("pages/faecher/index.html"),
      "Mathematik – Realschule": linkTo(
        "pages/faecher/mathematik-realschule/index.html"
      ),
    };
    const frag = document.createDocumentFragment();
    parts.forEach((label, idx) => {
      if (idx > 0) frag.append(" › ");
      const href = map[label];
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        frag.append(a);
      } else {
        frag.append(label);
      }
    });
    bc.innerHTML = "";
    bc.append(frag);
  }

  // Tabs
  const tabs = Array.from(document.querySelectorAll(".mathe-tab"));
  const panels = Array.from(document.querySelectorAll(".mathe-tabpanel"));

  function activateTab(tabName) {
    tabs.forEach((t) =>
      t.classList.toggle("is-active", t.dataset.tab === tabName)
    );
    panels.forEach((p) =>
      p.classList.toggle("is-active", p.dataset.panel === tabName)
    );
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  // Default first tab active
  if (tabs.length && !tabs.some((t) => t.classList.contains("is-active"))) {
    activateTab(tabs[0].dataset.tab);
  }

  // Zur Übersicht Hook
  const homeBtn = document.getElementById("btnMatheHome");
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = linkTo(
        "pages/faecher/mathematik-realschule/index.html"
      );
    });
  }
});
