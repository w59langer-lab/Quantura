// js/maus_tts.js
// Sprachausgabe nur für DE, EN, RU, FR, IT
// RU-Kommentar: здесь мы жёстко ограничиваем голосами только пять языков,
// а активная вкладка (DE/EN/RU/FR/IT) определяет, какой голос по умолчанию брать.

const allowedLanguages = [
  { code: "de", prefix: "de" }, // Deutsch
  { code: "en", prefix: "en" }, // Englisch
  { code: "ru", prefix: "ru" }, // Russisch
  { code: "fr", prefix: "fr" }, // Französisch
  { code: "it", prefix: "it" }, // Italienisch
];

let currentLang = "de";
let voices = [];
let currentUtterance = null;

const voiceSelect = document.getElementById("voice-select");
const speedRange = document.getElementById("speed-range");

const btnPlay = document.getElementById("btn-play");
const btnPause = document.getElementById("btn-pause");
const btnResume = document.getElementById("btn-resume");
const btnStop = document.getElementById("btn-stop");

const storyTextEl = document.getElementById("story-text");
const storyArticles = document.querySelectorAll(".story-text");

// Sicherheit: wenn etwas fehlt, nicht abstürzen
if (!voiceSelect || !speedRange || !btnPlay || !btnPause || !btnResume || !btnStop || !storyTextEl) {
  console.warn("maus_tts.js: benötigte DOM-Elemente wurden nicht gefunden.");
}

// ---------- Hilfsfunktionen ----------

function getAllowedVoiceList() {
  const allVoices = window.speechSynthesis.getVoices();

  // Nur Stimmen behalten, deren Sprachcode zu unseren 5 Sprachen gehört
  return allVoices.filter((v) => {
    const prefix = (v.lang || "").split("-")[0].toLowerCase();
    return allowedLanguages.some((lang) => prefix === lang.prefix);
  });
}

function populateVoiceSelect() {
  voices = getAllowedVoiceList();
  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  // Standardstimme nach aktueller Sprache wählen
  selectDefaultVoiceForCurrentLang();
}

function selectDefaultVoiceForCurrentLang() {
  if (!voices.length) return;

  const langConfig = allowedLanguages.find((l) => l.code === currentLang);
  if (!langConfig) return;

  const wantedPrefix = langConfig.prefix.toLowerCase();

  let indexToSelect = 0;

  const foundIndex = voices.findIndex((v) =>
    v.lang && v.lang.toLowerCase().startsWith(wantedPrefix)
  );

  if (foundIndex >= 0) {
    indexToSelect = foundIndex;
  }

  voiceSelect.selectedIndex = indexToSelect;
}

function getSelectedVoice() {
  const idx = parseInt(voiceSelect.value, 10);
  if (isNaN(idx) || !voices[idx]) return null;
  return voices[idx];
}

function updateVisibleStory(lang) {
  if (!storyArticles?.length) return;
  storyArticles.forEach((article) => {
    article.hidden = article.dataset.lang !== lang;
  });
}

updateVisibleStory(currentLang);

function speakStory() {
  if (!storyTextEl) return;

  const text = storyTextEl.innerText.trim();
  if (!text) return;

  const rate = parseFloat(speedRange.value) || 1;

  if (window.TTSManager) {
    const langConfig = allowedLanguages.find((l) => l.code === currentLang);
    const locale = langConfig ? langConfig.prefix : "de-DE";
    window.TTSManager.speak(text, locale, { rate });
  } else {
    // Vorherige Ausgabe abbrechen
    window.speechSynthesis.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);

    const voice = getSelectedVoice();
    if (voice) {
      currentUtterance.voice = voice;
      currentUtterance.lang = voice.lang;
    } else {
      // Fallback: Sprache aus currentLang
      const langConfig = allowedLanguages.find((l) => l.code === currentLang);
      if (langConfig) {
        currentUtterance.lang = langConfig.prefix;
      }
    }

    currentUtterance.rate = rate;
    window.speechSynthesis.speak(currentUtterance);
  }
}

// ---------- Event-Handler ----------

// Stimmen laden (Browser lädt sie oft asynchron)
window.speechSynthesis.onvoiceschanged = () => {
  populateVoiceSelect();
};

// initial füllen, falls Stimmen schon da sind
populateVoiceSelect();

// Sprach-Tabs ankoppeln
document.querySelectorAll(".lang-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const lang = tab.dataset.lang;
    if (!lang) return;

    currentLang = lang;

    // aktive Tab-Klasse aktualisieren
    document.querySelectorAll(".lang-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // passenden Text anzeigen
    updateVisibleStory(lang);

    // passende Stimme auswählen
    populateVoiceSelect();
  });
});

// Buttons
if (btnPlay) {
  btnPlay.addEventListener("click", () => {
    speakStory();
  });
}

if (btnPause) {
  btnPause.addEventListener("click", () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  });
}

if (btnResume) {
  btnResume.addEventListener("click", () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  });
}

if (btnStop) {
  btnStop.addEventListener("click", () => {
    if (window.TTSManager) {
      window.TTSManager.stop();
    } else {
      window.speechSynthesis.cancel();
    }
  });
}
