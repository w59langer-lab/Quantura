// Adapter-Preview: Talk-Levels-Master -> altes Sprachführer-Format (ohne UI-Änderung)
// Lädt topics/*.json, erzeugt zwei Preview-Dateien:
//   1) karten_level_data_from_talklevels.js         (Basis: de/en/it/fr/ru/es)
//   2) karten_level_data_from_talklevels_with_tr.js (Basis + tr + tr_pron)
// sowie einen Report adapter_report.md.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOPICS_DIR = path.join(ROOT, "data", "topics");
const OUT_DIR = path.resolve(ROOT, "..", "karten", "_preview_from_talklevels");

const BASE_LANGS = ["de", "en", "it", "fr", "ru", "es"];
const EXT_LANGS = [...BASE_LANGS, "tr"];

function safeReadJSON(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function slugify(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapLevel(raw, stats) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 1;
  if (n <= 0) {
    stats.level0 += 1;
    stats.level0Remapped += 1;
    return 1; // Alt-UI kennt Level 0 nicht; wir mappen auf 1.
  }
  return Math.min(10, Math.max(1, Math.round(n)));
}

function collectTopics() {
  const files = fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith(".json") && f !== "index.json");
  return files.map((f) => ({
    file: f,
    data: safeReadJSON(path.join(TOPICS_DIR, f)),
  }));
}

function buildCards(topics, includeTr, stats) {
  const langs = includeTr ? EXT_LANGS : BASE_LANGS;
  const cards = [];

  topics.forEach(({ data }) => {
    const topicId = data.id || path.basename("topic");
    const topicTitle = data.title || topicId;
    (data.items || []).forEach((item, idx) => {
      const level = mapLevel(item.level, stats);
      const baseId = `tl_${slugify(topicId)}_${slugify(item.mnemoKey || `idx${idx}`)}`;

      const card = {
        id: baseId,
        level,
        topic: topicTitle,
      };

      langs.forEach((lang) => {
        const val = item[lang] || "";
        card[lang] = val;
        if (!val) {
          stats.missingByLang[lang] = stats.missingByLang[lang] || [];
          stats.missingByLang[lang].push(baseId);
        }
      });

      if (includeTr) {
        const pron = (item.pronIpa && item.pronIpa.tr) || (item.pronRu && item.pronRu.tr);
        if (pron) card.tr_pron = pron;
        else stats.missingPronTr.push(baseId);
      }

      cards.push(card);
      stats.totalCards += 1;
      stats.perLevel[level] = (stats.perLevel[level] || 0) + 1;
      stats.topics.add(topicId);
    });
  });

  return cards;
}

function writeJs(outfile, cards) {
  const content = `// Auto-generated preview from Talk Levels master. Do not edit by hand.\n` +
    `// Source: pages/language_lab/apps/talk_levels/data/topics/*.json\n` +
    `const LG_KARTEN_LEVEL_DB = ${JSON.stringify(cards, null, 2)};\n` +
    `if (typeof window !== "undefined") { window.LG_KARTEN_LEVEL_DB = LG_KARTEN_LEVEL_DB; }\n`;
  fs.writeFileSync(outfile, content, "utf8");
}

function writeReport(outfile, baseStats, trStats) {
  const lines = [];
  lines.push("# Adapter-Report (Talk Levels → Sprachführer-Preview)");
  lines.push("");
  lines.push(`Erzeugt am: ${new Date().toISOString()}`);
  lines.push("");

  function section(title) {
    lines.push("");
    lines.push(`## ${title}`);
  }

  function statsBlock(label, s, includeTrExtras) {
    lines.push(`- Karten gesamt: ${s.totalCards}`);
    lines.push(`- Topics abgedeckt: ${s.topics.size}`);
    lines.push(`- Level-Verteilung: ${Object.keys(s.perLevel).sort((a,b)=>a-b).map((lvl)=>`L${lvl}:${s.perLevel[lvl]}`).join(" | ") || "—"}`);
    lines.push(`- Level 0 remapped → 1: ${s.level0Remapped}`);
    lines.push(`- Fehlende Übersetzungen:`);
    Object.keys(s.missingByLang).sort().forEach((lang) => {
      lines.push(`  - ${lang}: ${s.missingByLang[lang].length}`);
    });
    if (includeTrExtras) {
      lines.push(`- Fehlende tr_pron: ${s.missingPronTr.length}`);
    }
  }

  section("Basis (de/en/it/fr/ru/es)");
  statsBlock("Basis", baseStats, false);

  section("Erweitert (inkl. tr)");
  statsBlock("TR", trStats, true);

  section("Hinweise");
  lines.push("- Level 0 wurde auf Level 1 gemappt, weil die Legacy-UI Level 0 nicht kennt.");
  lines.push("- Felder verworfen: mnemoKey, mnemoHint, pronIpa/pronRu (außer tr_pron im erweiterten Datensatz).");
  lines.push("- Karten mit fehlenden Sprachwerten bleiben enthalten; die Legacy-UI blendet sie aus, wenn eine gewählte Sprache leer ist.");

  fs.writeFileSync(outfile, lines.join("\n"), "utf8");
}

function emptyStats() {
  return {
    totalCards: 0,
    perLevel: {},
    missingByLang: {},
    missingPronTr: [],
    level0: 0,
    level0Remapped: 0,
    topics: new Set(),
  };
}

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const topics = collectTopics();

  const baseStats = emptyStats();
  const baseCards = buildCards(topics, false, baseStats);
  writeJs(path.join(OUT_DIR, "karten_level_data_from_talklevels.js"), baseCards);

  const trStats = emptyStats();
  const trCards = buildCards(topics, true, trStats);
  writeJs(path.join(OUT_DIR, "karten_level_data_from_talklevels_with_tr.js"), trCards);

  writeReport(path.join(OUT_DIR, "adapter_report.md"), baseStats, trStats);
}

main();

