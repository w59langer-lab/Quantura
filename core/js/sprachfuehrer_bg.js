(() => {
  if (document.body?.dataset?.app !== "sprachfuehrer") return;
  const BG_DIR = "/core/assets/backgrounds/sprachfuehrer/";
  const JSON_URL = BG_DIR + "backgrounds.json";
  const LS_BG_ID = "sf_bg_id";
  const LS_BG_ON = "sf_bg_on";

  function $(sel, root=document){ return root.querySelector(sel); }
  function el(tag, attrs={}, children=[]) {
    const e = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "style") e.setAttribute("style", v);
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const c of children) e.append(c);
    return e;
  }

  function injectStyle() {
    const css = `
#sfBgWrap{position:relative;display:inline-flex;gap:.5rem;align-items:center}
#sfBgBtn{cursor:pointer;padding:.35rem .6rem;border:1px solid rgba(255,255,255,.35);border-radius:.5rem;background:rgba(0,0,0,.25);color:inherit}
#sfBgMenu{position:absolute;right:0;top:calc(100% + .4rem);min-width:320px;max-width:420px;
  border:1px solid rgba(255,255,255,.2);border-radius:.75rem;padding:.6rem;background:rgba(0,0,0,.72);
  backdrop-filter: blur(6px);display:none;z-index:9999}
#sfBgWrap.open #sfBgMenu{display:block}
#sfBgMenu .row{display:flex;gap:.6rem;align-items:center;margin:.35rem 0}
#sfBgMenu label{cursor:pointer}
#sfBgMenu select{flex:1;padding:.35rem .5rem;border-radius:.5rem;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:inherit}
#sfBgMenu .hint{opacity:.85;font-size:.85em;line-height:1.2}
.sf-bg-on{background-size:cover;background-position:center;background-repeat:no-repeat;background-attachment:fixed}
`;
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }

  async function loadList() {
    const r = await fetch(JSON_URL, {cache:"no-store"});
    if (!r.ok) throw new Error("backgrounds.json not found: " + r.status);
    return await r.json();
  }

  function chooseBestExt(files) {
    if (files?.webp) return "webp";
    if (files?.jpg)  return "jpg";
    if (files?.png)  return "png";
    return null;
  }

  function getTargetNode() {
    return document.querySelector("#app") || document.querySelector("main") || document.body;
  }

  function applyBackground(bgId, files, enabled) {
    const target = getTargetNode();
    if (!enabled || !bgId) {
      target.classList.remove("sf-bg-on");
      target.style.backgroundImage = "";
      localStorage.setItem(LS_BG_ON, "0");
      return;
    }
    const ext = chooseBestExt(files || {}) || "webp";
    const url = `${BG_DIR}${bgId}.${ext}`;
    target.classList.add("sf-bg-on");
    target.style.backgroundImage = `url("${url}")`;
    localStorage.setItem(LS_BG_ID, bgId);
    localStorage.setItem(LS_BG_ON, "1");
  }

  function mountUI(list) {
    const actions = document.querySelector("#sfHeaderActions");
    const header =
      actions ||
      document.querySelector("header") ||
      document.querySelector(".header") ||
      document.querySelector(".topbar") ||
      document.body;

    const btn = el("button", {id:"sfBgBtn", type:"button"}, [
      document.createTextNode("Hintergrund wählen/ändern · Choose/change background")
    ]);

    const cb = el("input", {type:"checkbox", id:"sfBgShow"});
    const cbLabel = el("label", {for:"sfBgShow"}, [
      document.createTextNode("Hintergrund anzeigen · Show background")
    ]);

    const sel = el("select", {id:"sfBgSelect"});
    if (list.items && list.items.length) {
      for (const it of list.items) {
        sel.append(el("option", {value: it.id}, [document.createTextNode(it.id)]));
      }
    } else {
      sel.append(el("option", {value:""}, [document.createTextNode("Keine Hintergründe gefunden / none found")]));
    }

    const hint = el("div", {class:"hint"}, [
      document.createTextNode("Quelle: " + BG_DIR + " (core/assets)")
    ]);

    const menu = el("div", {id:"sfBgMenu"}, [
      el("div", {class:"row"}, [cb, cbLabel]),
      el("div", {class:"row"}, [sel]),
      hint
    ]);

    const wrap = el("div", {id:"sfBgWrap"}, [btn, menu]);

    // toggle dropdown
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      wrap.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) wrap.classList.remove("open");
    });

    // load saved state
    const savedId = localStorage.getItem(LS_BG_ID) || (list.items?.[0]?.id ?? "");
    const savedOn = (localStorage.getItem(LS_BG_ON) || "1") === "1";
    cb.checked = savedOn;
    if (savedId) sel.value = savedId;

    // events
    cb.addEventListener("change", () => {
      const id = sel.value;
      const it = (list.items || []).find(x => x.id === id);
      applyBackground(id, it?.files, cb.checked);
    });
    sel.addEventListener("change", () => {
      const id = sel.value;
      const it = (list.items || []).find(x => x.id === id);
      applyBackground(id, it?.files, cb.checked);
    });

    // mount right side if possible
    if (actions) {
      actions.appendChild(wrap);
    } else if (header && header !== document.body) {
      header.appendChild(wrap);
    } else {
      document.body.appendChild(wrap);
      wrap.style.position = "fixed";
      wrap.style.top = "10px";
      wrap.style.right = "10px";
      wrap.style.zIndex = "10000";
    }

    // apply initial background
    const it0 = (list.items || []).find(x => x.id === sel.value);
    applyBackground(sel.value, it0?.files, cb.checked);
  }

  function boot() {
    injectStyle();
    loadList()
      .then(mountUI)
      .catch(err => {
        console.warn(err);
        mountUI({items: []});
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
