// TTS-Helfer für Karten (Sprache, Stimme, Rate) – lokal im Ordner karten/
(function () {
  const hasTTS =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  let currentUtter = null;
  let voiceSelectEl = null;
  let preferredLang = "de";
  let voicesCache = [];

  const langMap = {
    de: "de-DE",
    en: "en-US",
    it: "it-IT",
    fr: "fr-FR",
    ru: "ru-RU",
  };

  function refreshVoices() {
    if (!hasTTS) return;
    voicesCache = speechSynthesis.getVoices() || [];
    if (voiceSelectEl) {
      populateVoiceSelect();
    }
  }

  function populateVoiceSelect() {
    if (!voiceSelectEl) return;
    voiceSelectEl.innerHTML = "";
    voicesCache.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      voiceSelectEl.appendChild(opt);
    });
    // Versuche, passende Stimme für bevorzugte Sprache zu setzen
    const match = findVoice(preferredLang);
    if (match) {
      voiceSelectEl.value = match.voiceURI;
    }
  }

  function findVoice(lang, voiceURI) {
    if (!hasTTS) return null;
    const voices = voicesCache.length ? voicesCache : speechSynthesis.getVoices();
    if (voiceURI) {
      const byUri = voices.find((v) => v.voiceURI === voiceURI);
      if (byUri) return byUri;
    }
    const target = (langMap[lang] || lang || "en").toLowerCase();
    const byLang = voices.find(
      (v) => typeof v.lang === "string" && v.lang.toLowerCase().startsWith(target)
    );
    if (byLang) return byLang;
    return voices[0] || null;
  }

  function speakCardText(lang, text, rate = 1, voiceURI) {
    if (!text) return;
    const langCode = langMap[lang] || lang || "en-US";
    if (window.TTSManager) {
      window.TTSManager.speak(text, langCode, { rate });
      return;
    }
    if (!hasTTS) return;
    stopCard();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = rate;

    const voice = findVoice(lang, voiceURI);
    if (voice) utter.voice = voice;

    currentUtter = utter;
    speechSynthesis.speak(utter);
  }

  function pauseCard() {
    if (!hasTTS) return;
    speechSynthesis.pause();
  }

  function resumeCard() {
    if (!hasTTS) return;
    speechSynthesis.resume();
  }

  function stopCard() {
    if (!hasTTS) return;
    speechSynthesis.cancel();
    currentUtter = null;
  }

  function bindVoiceSelect(selectEl) {
    voiceSelectEl = selectEl;
    refreshVoices();
  }

  function setPreferredLang(lang) {
    preferredLang = lang || preferredLang;
    if (voiceSelectEl && voicesCache.length) {
      const match = findVoice(preferredLang);
      if (match) {
        voiceSelectEl.value = match.voiceURI;
      }
    }
  }

  function getSelectedVoice() {
    return voiceSelectEl ? voiceSelectEl.value : undefined;
  }

  if (hasTTS) {
    speechSynthesis.onvoiceschanged = refreshVoices;
    document.addEventListener("DOMContentLoaded", refreshVoices);
  }

  window.KartenTTS = {
    speakCardText,
    pauseCard,
    resumeCard,
    stopCard,
    bindVoiceSelect,
    setPreferredLang,
    getSelectedVoice,
  };
})();
