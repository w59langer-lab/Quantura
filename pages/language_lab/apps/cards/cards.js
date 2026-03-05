const STORAGE_KEY = "LL_CARDS_V1";
let cards = [];

document.addEventListener("DOMContentLoaded", () => {
  cards = loadCards();
  renderList(cards);

  const form = document.getElementById("cardForm");
  const importInput = document.getElementById("importInput");
  const cardsList = document.getElementById("cardsList");

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    addCardFromForm();
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    exportJSON(cards);
  });

  document.getElementById("clearAllBtn").addEventListener("click", clearAll);

  importInput.addEventListener("change", (evt) => {
    const [file] = evt.target.files || [];
    importJSON(file);
    importInput.value = "";
  });

  cardsList.addEventListener("click", (evt) => {
    const actionBtn = evt.target.closest("[data-action]");
    if (!actionBtn) return;
    const item = actionBtn.closest("[data-id]");
    if (!item) return;
    const id = item.dataset.id;

    if (actionBtn.dataset.action === "delete") {
      deleteCard(id);
    } else if (actionBtn.dataset.action === "copy") {
      copyCard(id);
    }
  });
});

function speakText(text, lang) {
  if (!text || !text.trim()) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (lang === "en") u.lang = "en-US";
  else if (lang === "de") u.lang = "de-DE";
  else if (lang === "ru") u.lang = "ru-RU";
  window.speechSynthesis.speak(u);
}

function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed
      .map(normalizeCard)
      .filter(Boolean)
      .sort(sortByCreatedAtDesc);

    // Persist normalized structure (adds missing pron_front, ids, etc.)
    saveCards(normalized);
    return normalized;
  } catch (err) {
    console.error("Failed to parse stored cards:", err);
    return [];
  }
}

function saveCards(nextCards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCards));
}

function addCardFromForm() {
  const typeInput = document.getElementById("cardType");
  const langFrontInput = document.getElementById("langFront");
  const langBackInput = document.getElementById("langBack");
  const frontInput = document.getElementById("frontText");
  const backInput = document.getElementById("backText");
  const noteInput = document.getElementById("noteText");
  const pronFrontInput = document.getElementById("pron_front");
  const status = document.getElementById("formStatus");

  const front = frontInput.value.trim();
  const back = backInput.value.trim();
  const note = noteInput.value.trim();
  const pronFront = pronFrontInput.value.trim();

  if (!front || !back) {
    if (status) status.textContent = "Bitte Front- und Back-Text ausfüllen.";
    return;
  }

  const now = new Date();
  const timestamp = formatTimestamp(now);

  const newCard = {
    id: generateId(now),
    type: typeInput.value === "sentence" ? "sentence" : "word",
    lang_front: ["en", "de", "ru"].includes(langFrontInput.value)
      ? langFrontInput.value
      : "en",
    front,
    lang_back: ["de", "ru", "en"].includes(langBackInput.value)
      ? langBackInput.value
      : "de",
    back,
    note,
    pron_front: pronFront,
    created_at: timestamp,
    updated_at: timestamp,
  };

  cards = [newCard, ...cards];
  saveCards(cards);
  renderList(cards);

  if (status) {
    status.textContent = "Hinzugefügt.";
    setTimeout(() => (status.textContent = ""), 1500);
  }

  typeInput.value = "word";
  langFrontInput.value = "en";
  langBackInput.value = "de";
  frontInput.value = "";
  backInput.value = "";
  noteInput.value = "";
  pronFrontInput.value = "";
  frontInput.focus();
}

function renderList(currentCards) {
  const list = document.getElementById("cardsList");
  const count = document.getElementById("cardsCount");

  if (!currentCards.length) {
    list.innerHTML = '<p class="empty-state">Noch keine Karten. Lege die erste an.</p>';
    count.textContent = "0 Karten";
    return;
  }

  const sorted = [...currentCards].sort(sortByCreatedAtDesc);
  const items = sorted
    .map(
      (card) => `
        <article class="card-row" data-id="${card.id}">
          <div class="card-row__top">
            <span class="pill pill-type-${card.type}">${card.type}</span>
            <span class="pill pill-lang">${card.lang_front.toUpperCase()} → ${card.lang_back.toUpperCase()}</span>
            <span class="card-row__meta">${formatReadableDate(card.created_at)}</span>
          </div>
          <div class="card-row__texts">
            <div class="card-text">
              <div class="card-text__header">
                <span class="card-text__label">Front</span>
              </div>
              <div class="card-text__body">
                <span class="tts tts-front" data-lang="${card.lang_front}">${escapeHtml(card.front)}</span>
              </div>
            </div>
            <div class="card-text">
              <div class="card-text__header">
                <span class="card-text__label">Back</span>
              </div>
              <div class="card-text__body">
                <span class="tts tts-back" data-lang="${card.lang_back}">${escapeHtml(card.back)}</span>
              </div>
            </div>
            <div class="card-text card-text--pron">
              <div class="card-text__header">
                <span class="card-text__label">Transkription</span>
              </div>
              <div class="card-text__body">${escapeHtml(card.pron_front || "") || "—"}</div>
            </div>
          </div>
          ${
            card.note
              ? `<div class="card-row__note">📝 ${escapeHtml(card.note)}</div>`
              : ""
          }
          <div class="card-row__actions">
            <button type="button" class="btn btn-ghost btn-xs" data-action="copy">Kopieren</button>
            <button type="button" class="btn btn-ghost btn-xs btn-danger" data-action="delete">Löschen</button>
          </div>
        </article>
      `
    )
    .join("");

  list.innerHTML = items;
  count.textContent = `${sorted.length} Karten`;

  list.querySelectorAll(".card-row").forEach((row) => {
    const cardId = row.dataset.id;
    const card = currentCards.find((c) => c.id === cardId);
    if (!card) return;

    const frontEl = row.querySelector(".tts-front");
    const backEl = row.querySelector(".tts-back");

    if (frontEl) {
      frontEl.addEventListener("click", () =>
        speakText(card.front, frontEl.dataset.lang || card.lang_front)
      );
    }
    if (backEl) {
      backEl.addEventListener("click", () =>
        speakText(card.back, backEl.dataset.lang || card.lang_back)
      );
    }
  });
}

function deleteCard(id) {
  const nextCards = cards.filter((card) => card.id !== id);
  if (nextCards.length === cards.length) return;
  cards = nextCards;
  saveCards(cards);
  renderList(cards);
}

function copyCard(id) {
  const card = cards.find((c) => c.id === id);
  if (!card) return;
  const copyText = `${card.lang_front.toUpperCase()}: ${card.front}\n${card.lang_back.toUpperCase()}: ${card.back}${
    card.note ? `\nNotiz: ${card.note}` : ""
  }`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(copyText).catch(() => fallbackCopy(copyText));
  } else {
    fallbackCopy(copyText);
  }
}

function exportJSON(currentCards) {
  const data = JSON.stringify(currentCards, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cards_export.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const parsed = JSON.parse(evt.target.result);
      const rawItems = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.cards)
          ? parsed.cards
          : [];

      if (!rawItems.length) {
        alert("Datei leer oder Format passt nicht.");
        return;
      }

      const knownIds = new Set(cards.map((c) => c.id));
      const nextCards = [...cards];
      let added = 0;

      rawItems.forEach((raw) => {
        const normalized = normalizeCard(raw);
        if (!normalized) return;
        if (knownIds.has(normalized.id)) return;

        knownIds.add(normalized.id);
        nextCards.push(normalized);
        added += 1;
      });

      if (!added) {
        alert("Keine neuen Karten – eventuell alles schon importiert.");
        return;
      }

      cards = nextCards.sort(sortByCreatedAtDesc);
      saveCards(cards);
      renderList(cards);
    } catch (err) {
      alert("JSON konnte nicht gelesen werden: " + err.message);
    }
  };

  reader.readAsText(file);
}

function clearAll() {
  if (!cards.length) return;
  const ok = confirm("Alle Karten wirklich löschen?");
  if (!ok) return;
  cards = [];
  localStorage.removeItem(STORAGE_KEY);
  renderList(cards);
}

function normalizeCard(raw) {
  if (!raw || typeof raw !== "object") return null;

  const front = `${raw.front ?? ""}`.trim();
  const back = `${raw.back ?? ""}`.trim();
  if (!front || !back) return null;

  const nowStamp = formatTimestamp(new Date());
  const created =
    typeof raw.created_at === "string" && raw.created_at ? raw.created_at : nowStamp;
  const updated =
    typeof raw.updated_at === "string" && raw.updated_at
      ? raw.updated_at
      : created;

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : generateId(),
    type: raw.type === "sentence" ? "sentence" : "word",
    lang_front: ["en", "de", "ru"].includes(raw.lang_front) ? raw.lang_front : "en",
    front,
    lang_back: ["de", "ru", "en"].includes(raw.lang_back) ? raw.lang_back : "de",
    back,
    note: `${raw.note ?? ""}`.trim(),
    pron_front: `${raw.pron_front ?? ""}`.trim(),
    created_at: created,
    updated_at: updated,
  };
}

function generateId(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(
    date.getSeconds()
  )}`;
  const rand = Math.random().toString(36).slice(2, 6);
  return `c_${stamp}_${rand}`;
}

function formatTimestamp(date) {
  return date.toISOString().slice(0, 19);
}

function formatReadableDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function sortByCreatedAtDesc(a, b) {
  return new Date(b.created_at) - new Date(a.created_at);
}
