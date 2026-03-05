const tabs = Array.from(document.querySelectorAll(".tab-btn"));
const sections = Array.from(document.querySelectorAll(".section"));

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("active"));
    sections.forEach((s) => s.classList.remove("active"));

    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    const section = document.getElementById(target);
    if (section) section.classList.add("active");
  });
});

function runDemoClock() {
  const timeEl = document.getElementById("demoTime");
  const dateEl = document.getElementById("demoDate");
  if (!timeEl || !dateEl) return;

  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  dateEl.textContent = now.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
runDemoClock();
setInterval(runDemoClock, 1000);

const htmlInput = document.getElementById("htmlInput");
const cssInput = document.getElementById("cssInput");
const jsInput = document.getElementById("jsInput");
const previewFrame = document.getElementById("previewFrame");
const runBtn = document.getElementById("runBtn");

function escapeScriptTags(str) {
  return (str || "").replace(/<\/script/gi, "<\\/script");
}

function buildDocument() {
  const safeJs = escapeScriptTags(jsInput.value);
  const doc = `<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${cssInput.value}</style>
</head>
<body>
${htmlInput.value}
<script>
${safeJs}
</script>
</body>
</html>`;

  // RU: srcdoc избегает внешних файлов — все в одном документе
  // DE: srcdoc vermeidet externe Dateien – alles in einem Dokument
  // EN: srcdoc keeps everything inline, no external files needed
  previewFrame.srcdoc = doc;
}

if (runBtn) {
  runBtn.addEventListener("click", buildDocument);
}

// RU: Первая сборка сразу после загрузки
// DE: Erste Ausführung direkt nach dem Laden
// EN: Initial render right after load
buildDocument();
