// Mehrsprachige Mausgeschichte – robustes Rendering (kein Absturz, Text erscheint immer)
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".story-lang-tab");
  const texts = document.querySelectorAll(".story-text");

  // Optional TTS UI (kann fehlen)
  const btnSpeak  = document.getElementById("storySpeakBtn");
  const btnPause  = document.getElementById("storyPauseBtn");
  const btnResume = document.getElementById("storyResumeBtn");
  const btnStop   = document.getElementById("storyStopBtn");
  const rateSlider = document.getElementById("storyRate");
  const voiceSelect = document.getElementById("voiceSelect");

  let currentLang = "de";
  let currentUtter = null;

  const storyData = {
    de: {
      title: "Die Geschichte einer kleinen Maus (Portfolio-Version)",
      paragraphs: [
        "Eines Nachts bemerkte eine kleine Maus, dass der Bauer im Stall eine Mausefalle aufgestellt hatte. Sie roch den Käse und sah den gespannten Bügel – die Gefahr war nicht „irgendwo", sondern ganz nah.",
        "Sie rannte los, um die Tiere zu warnen.",
        "Zuerst das Huhn:<br>„Im Stall steht eine Mausefalle!“<br>Das Huhn antwortete gleichgültig: „Das ist dein Problem. Das geht mich nichts an.“",
        "Dann das Schaf:<br>„Da ist eine Falle – es kann etwas passieren!“<br>Das Schaf sagte ruhig: „Ich gehe nicht an Käse. Das betrifft mich nicht.“",
        "Schließlich die Kuh:<br>„Auf dem Hof ist Gefahr – wir müssen etwas tun!“<br>Die Kuh meinte sicher: „Damit habe ich nichts zu tun.“",
        "In der Nacht kroch eine Schlange in den Stall. Der Käse lockte sie an, die Falle schnappte zu, und die Schlange zischte vor Schmerz. Die Bäuerin kam mit einer Lampe – und wurde im Schreck gebissen.",
        "Dann kamen die drei Stufen, mit denen niemand gerechnet hatte:"
      ],
      steps: [
        "Huhn: Um die Bäuerin zu stärken, kochte der Bauer Hühnerbrühe – dafür schlachtete er das Huhn.",
        "Schaf: Am nächsten Tag kamen Nachbarn und Verwandte zu Besuch – alle mussten versorgt werden. Der Bauer schlachtete das Schaf.",
        "Kuh: Doch das Gift war stärker: Die Bäuerin starb. Zur Beerdigung und den Trauergästen brauchte es Essen – der Bauer schlachtete die Kuh."
      ],
      moral: "Gleichgültigkeit schützt niemanden."
    },
    en: {
      title: "The Story of a Little Mouse (Portfolio Version)",
      paragraphs: [
        "One night a little mouse noticed that the farmer had set a mousetrap in the barn. She smelled the cheese and saw the tensioned bar — the danger was not “somewhere out there” but right nearby.",
        "She ran to warn the other animals.",
        "First, the chicken:<br>“There’s a mousetrap in the barn!”<br>The chicken replied indifferently: “That’s your problem. It doesn’t concern me.”",
        "Then, the sheep:<br>“It’s a trap — something could happen!”<br>The sheep said calmly: “I don’t go for cheese. That’s not about me.”",
        "Finally, the cow:<br>“There’s danger on the farm — we must do something!”<br>The cow answered confidently: “It has nothing to do with me.”",
        "At night a snake crawled into the barn. The cheese lured it in; the trap snapped shut and the snake hissed in pain. The farmer’s wife came with a lamp — and, startled, was bitten.",
        "Then came the three steps nobody expected:"
      ],
      steps: [
        "Chicken: To strengthen the wife, the farmer cooked chicken broth — and slaughtered the chicken.",
        "Sheep: The next day neighbors and relatives came to visit — everyone had to be fed. The farmer slaughtered the sheep.",
        "Cow: But the venom was stronger: the wife died. For the funeral and mourners, food was needed — the farmer slaughtered the cow."
      ],
      moral: "Indifference protects no one."
    },
    ru: {
      title: "История одной маленькой мышки (версия для портфолио)",
      paragraphs: [
        "Однажды Bauer поставил в сарае мышеловку. Маленькая мышка узнала об этом просто: ночью она шла к мешкам с зерном, почувствовала запах сыра — и увидела на полу новую деревянную дощечку с натянутой пружиной. Мышке стало холодно: ловушка была не «где-то», а рядом.",
        "Она побежала предупредить других животных фермы.",
        "Сначала — курицу:<br>— В сарае мышеловка! Это опасно!<br>Курица только фыркнула:<br>— Это твоя проблема, мышка. Меня это не касается.",
        "Потом — овцу:<br>— Там ловушка. Беда может случиться!<br>Овца спокойно ответила:<br>— Я к сыру не подхожу. Это не про меня.",
        "Наконец — корову:<br>— На ферме опасность! Надо что-то делать!<br>Корова уверенно сказала:<br>— Я тут ни при чём. Это твои дела.",
        "Ночью в сарай заползла змея. Её привлёк запах сыра — она потянулась к приманке, и мышеловка хлопнула, зажав её. От боли змея стала метаться и шипеть. На шум прибежала жена Bauera — наклонилась ближе, и змея в панике укусила её.",
        "А дальше случилось самое важное — три ступени, которые никто не ожидал:"
      ],
      steps: [
        "Курица: Женщине стало плохо, её нужно было согреть и поддержать. Bauer решил, что лучший способ — сварить куриный бульон. Он зарезал курицу.",
        "Овца: На следующий день пришли соседи и родственники — проведать больную. Дом наполнился людьми, всех нужно было накормить. Bauer зарезал овцу.",
        "Корова: Но яд оказался сильнее: жена Bauera умерла. Пришли люди — проститься, помочь, поддержать. Нужно было накормить всех на похоронах и поминках. Bauer зарезал корову."
      ],
      moral: "Равнодушие никого не защищает."
    },
    fr: { title: "L’histoire d’une petite souris (version portfolio)", paragraphs: ["(FR texte ici)"], steps: ["(FR 1)", "(FR 2)", "(FR 3)"], moral: "L’indifférence ne protège personne." },
    it: { title: "La storia di un piccolo topo (versione portfolio)", paragraphs: ["(IT testo qui)"], steps: ["(IT 1)", "(IT 2)", "(IT 3)"], moral: "L’indifferenza non protegge nessuno." }
  };

  function buildHTML(lang) {
    const d = storyData[lang];
    if (!d) return "";
    const parts = [];
    parts.push(`<h2>${d.title}</h2>`);
    (d.paragraphs || []).forEach(p => parts.push(`<p>${p}</p>`));
    if (Array.isArray(d.steps) && d.steps.length) {
      parts.push("<ol>");
      d.steps.forEach(s => parts.push(`<li>${s}</li>`));
      parts.push("</ol>");
    }
    const moralLabel = (lang === "ru") ? "Мораль:" : "Moral:";
    parts.push(`<p><strong>${moralLabel}</strong> ${d.moral || ""}</p>`);
    return parts.join("\n");
  }

  function renderAll() {
    texts.forEach((el) => {
      const lang = el.getAttribute("data-lang") || "de";
      el.innerHTML = buildHTML(lang);
      el.hidden = lang !== currentLang;
    });
  }

  function switchLang(lang) {
    currentLang = lang;
    renderAll();
    tabs.forEach((t) => {
      const tLang = t.getAttribute("data-lang") || t.dataset.lang;
      if (tLang) t.classList.toggle("active", tLang === currentLang);
    });
  }

  // 1) ALWAYS render (even if TTS UI missing)
  renderAll();

  // 2) Tabs (optional)
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const lang = tab.getAttribute("data-lang") || tab.dataset.lang;
        if (!lang) return;
        switchLang(lang);
      });
    });
  }

  // 3) Optional TTS – only if available
  if (!("speechSynthesis" in window) || !btnSpeak || !voiceSelect) return;

  function getTextForLang(lang) {
    const d = storyData[lang];
    if (!d) return "";
    return [...(d.paragraphs||[]), ...(d.steps||[]), (d.moral||"")].join(" ");
  }

  function speak(lang) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(getTextForLang(lang));
    const rate = rateSlider ? Number(rateSlider.value) : 1;
    utter.rate = isFinite(rate) ? rate : 1;

    const voices = window.speechSynthesis.getVoices();
    const selected = voiceSelect.value;
    const v = voices.find(x => x.name === selected);
    if (v) utter.voice = v;

    currentUtter = utter;
    window.speechSynthesis.speak(utter);
  }

  function refreshVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    if (!voiceSelect) return;
    voiceSelect.innerHTML = voices.map(v => `<option value="${v.name}">${v.name}</option>`).join("");
  }

  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;

  btnSpeak.addEventListener("click", () => speak(currentLang));
  if (btnPause)  btnPause.addEventListener("click", () => window.speechSynthesis.pause());
  if (btnResume) btnResume.addEventListener("click", () => window.speechSynthesis.resume());
  if (btnStop)   btnStop.addEventListener("click", () => window.speechSynthesis.cancel());
});
