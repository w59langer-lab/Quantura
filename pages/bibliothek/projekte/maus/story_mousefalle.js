// Mehrsprachige Mausgeschichte mit TTS + Pause/Fortsetzen + Stimmenwahl + Speed-Regler

(function () {
  const tabs = document.querySelectorAll(".story-lang-tab");
  const texts = document.querySelectorAll(".story-text");

  const btnSpeak = document.getElementById("storySpeakBtn");
  const btnPause = document.getElementById("storyPauseBtn");
  const btnResume = document.getElementById("storyResumeBtn");
  const btnStop = document.getElementById("storyStopBtn");

  const rateSlider = document.getElementById("storyRate");
  const voiceSelect = document.getElementById("voiceSelect");

  let currentLang = "de";
  let currentUtter = null;

  const langCodes = {
    de: "de-DE",
    en: "en-US",
    ru: "ru-RU",
    fr: "fr-FR",
    it: "it-IT",
    es: "es-ES", // ES kann später einfach ergänzt werden (Button + Textblock)
  };

  // ---------- Sprachwechsel ----------
  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      currentLang = t.dataset.lang;
      tabs.forEach((a) =>
        a.classList.toggle("active", a.dataset.lang === currentLang)
      );

      texts.forEach((a) => (a.hidden = a.dataset.lang !== currentLang));

      stopSpeech();
    });
  });

  // ---------- Stimmen laden ----------
  function loadVoices() {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";

    voices.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      voiceSelect.appendChild(opt);
    });
  }

  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  // ---------- Hilfsfunktionen ----------
  function stopSpeech() {
    speechSynthesis.cancel();
    currentUtter = null;

    btnPause.disabled = true;
    btnResume.disabled = true;
    btnStop.disabled = true;
  }

  function speak() {
    stopSpeech();

    const textElement = [...texts].find((t) => t.dataset.lang === currentLang);
    const text = textElement.innerText.trim();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCodes[currentLang];
    utter.rate = parseFloat(rateSlider.value);

    const selectedVoice = speechSynthesis
      .getVoices()
      .find((v) => v.voiceURI === voiceSelect.value);
    if (selectedVoice) utter.voice = selectedVoice;

    currentUtter = utter;

    speechSynthesis.speak(utter);

    btnPause.disabled = false;
    btnStop.disabled = false;
  }

  function pauseSpeech() {
    speechSynthesis.pause();
    btnPause.disabled = true;
    btnResume.disabled = false;
  }

  function resumeSpeech() {
    speechSynthesis.resume();
    btnResume.disabled = true;
    btnPause.disabled = false;
  }

  // ---------- Buttons ----------
  btnSpeak.addEventListener("click", speak);
  btnPause.addEventListener("click", pauseSpeech);
  btnResume.addEventListener("click", resumeSpeech);
  btnStop.addEventListener("click", stopSpeech);
})();
