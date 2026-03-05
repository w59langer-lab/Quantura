const DATA_URL = "/assets/data/portal_registry.json";

const searchInput = document.getElementById("topicSearch");
const selectEl = document.getElementById("topicSelect");

let topics = [];

init();

async function init() {
  await loadTopics();
  renderOptions();

  if (searchInput) {
    searchInput.addEventListener("input", renderOptions);
  }

  if (selectEl) {
    selectEl.addEventListener("change", onSelect);
  }
}

async function loadTopics() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const rawTopics = Array.isArray(data.topics) ? data.topics : [];

    topics = rawTopics
      .map((t) => ({
        title: String(t.title || "").trim(),
        url: String(t.url || t.href || "").trim(),
      }))
      .filter((t) => t.title && t.url);
  } catch (e) {
    console.error("Portal Registry laden fehlgeschlagen", e);
    topics = [];
  }
}

function renderOptions() {
  if (!selectEl) return;
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtered = topics
    .filter((t) => !query || t.title.toLowerCase().includes(query))
    .sort((a, b) =>
      a.title.localeCompare(b.title, "de", { sensitivity: "base" })
    );

  selectEl.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.selected = true;
  if (!filtered.length) {
    placeholder.textContent = "Keine Treffer";
    placeholder.disabled = true;
    selectEl.appendChild(placeholder);
    return;
  }

  placeholder.textContent = "Thema wählen …";
  selectEl.appendChild(placeholder);

  const groups = new Map();
  filtered.forEach((topic) => {
    const key = groupKey(topic.title);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(topic);
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  alphabet.forEach((letter) => appendGroup(letter, groups));
  if (groups.has("#")) appendGroup("#", groups);
}

function appendGroup(letter, groups) {
  const items = groups.get(letter);
  if (!items || !items.length) return;
  const group = document.createElement("optgroup");
  group.label = letter;
  items.forEach((topic) => {
    const opt = document.createElement("option");
    opt.value = topic.url;
    opt.textContent = topic.title;
    group.appendChild(opt);
  });
  selectEl.appendChild(group);
}

function groupKey(title) {
  if (!title) return "#";
  const first = title.trim()[0]?.toUpperCase() || "";
  const normalized = first.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normalized >= "A" && normalized <= "Z") return normalized;
  return "#";
}

function onSelect() {
  if (!selectEl) return;
  const url = selectEl.value;
  if (!url) return;
  navigateTo(url);
}

function navigateTo(url) {
  const isPortal = url.startsWith("/pages/portal_v2/");
  if (typeof window.LL_NAVIGATE === "function" && isPortal) {
    window.LL_NAVIGATE(url);
  } else {
    window.location.href = url;
  }
}
