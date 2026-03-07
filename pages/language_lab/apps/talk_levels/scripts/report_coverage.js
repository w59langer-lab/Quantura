#!/usr/bin/env node
/**
 * Coverage report for Sprachführer Master topics and generated Leitner previews.
 * Reads master topics/*.json and preview outputs in data/_generated_preview/leitner.
 * Writes machine-readable reports and prints a human-readable summary.
 *
 * Safe: read-only; does not touch live site/core/assets/registries.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MASTER_DIR = path.join(ROOT, "data", "topics");
const PREVIEW_DIR = path.join(ROOT, "data", "_generated_preview");
const PREVIEW_LEITNER = path.join(PREVIEW_DIR, "leitner");
const REPORT_DIR = path.join(PREVIEW_DIR, "reports");
const LANGS = ["en", "es", "fr", "it", "ru", "tr"];
const ALLOWED_LANGS = ["de", ...LANGS];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadTopics() {
  const files = fs.readdirSync(MASTER_DIR).filter((f) => f.endsWith(".json"));
  const topics = [];
  files.forEach((file) => {
    const full = path.join(MASTER_DIR, file);
    const data = readJson(full);
    if (!data.id || !data.title || !Array.isArray(data.items)) return; // skip non-topic (e.g., index.json)
    topics.push({ ...data, _file: file });
  });
  return topics;
}

function languageCoverage(topics) {
  const totals = {};
  LANGS.forEach((l) => (totals[l] = { total: 0, filled: 0, missing: 0, percent: 0 }));

  topics.forEach((t) => {
    t.items.forEach((it) => {
      LANGS.forEach((l) => {
        totals[l].total += 1;
        if (it[l] && it[l].trim()) totals[l].filled += 1;
        else totals[l].missing += 1;
      });
    });
  });
  LANGS.forEach((l) => {
    totals[l].percent = totals[l].total ? Math.round((totals[l].filled / totals[l].total) * 1000) / 10 : 0;
  });
  return totals;
}

function topicCoverage(topics) {
  return topics.map((t) => {
    const langStats = {};
    LANGS.forEach((l) => (langStats[l] = { total: t.items.length, filled: 0, missing: 0, percent: 0 }));
    t.items.forEach((it) => {
      LANGS.forEach((l) => {
        if (it[l] && it[l].trim()) langStats[l].filled += 1;
        else langStats[l].missing += 1;
      });
    });
    LANGS.forEach((l) => {
      const s = langStats[l];
      s.percent = s.total ? Math.round((s.filled / s.total) * 1000) / 10 : 0;
    });
    return {
      id: t.id,
      title: t.title,
      total: t.items.length,
      languages: langStats,
    };
  });
}

function missingTranslations(topics) {
  const missing = [];
  topics.forEach((t) => {
    t.items.forEach((it) => {
      LANGS.forEach((l) => {
        if (!it[l] || !it[l].trim()) {
          missing.push({
            topic: t.id,
            title: t.title,
            mnemoKey: it.mnemoKey,
            level: it.level,
            lang: l,
          });
        }
      });
    });
  });
  return missing;
}

function leitnerCounts() {
  const counts = {};
  LANGS.forEach((l) => {
    const file = path.join(PREVIEW_LEITNER, `de-${l}.json`);
    if (fs.existsSync(file)) {
      const data = readJson(file);
      counts[l] = data.length;
    } else {
      counts[l] = 0;
    }
  });
  return counts;
}

function classifyTopics(topicStats) {
  const ready = [];
  const almost = [];
  const low = [];
  const onlyEn = [];
  const hasTr = [];

  topicStats.forEach((t) => {
    const perc = (lang) => t.languages[lang]?.percent || 0;
    const minAll = Math.min(...LANGS.map(perc));
    const hasTrData = perc("tr") > 0;
    if (LANGS.every((l) => perc(l) >= 90)) ready.push(t);
    else if (LANGS.every((l) => perc(l) >= 60)) almost.push(t);
    else if (perc("en") >= 80 && LANGS.filter((l) => l !== "en").every((l) => perc(l) < 40)) onlyEn.push(t);
    else if (minAll < 40) low.push(t);
    if (hasTrData) hasTr.push(t);
  });
  return { ready, almost, low, onlyEn, hasTr };
}

function printSummary(langTotals, topicStats, missingList, leitner) {
  const totalItems = topicStats.reduce((s, t) => s + t.total, 0);
  console.log("=== COVERAGE SUMMARY ===");
  console.log(`Topics: ${topicStats.length}, Items: ${totalItems}`);
  console.log("Languages:");
  LANGS.forEach((l) => {
    const t = langTotals[l];
    console.log(
      `  ${l}: ${t.filled}/${t.total} filled, missing ${t.missing}, ${t.percent}% (Leitner cards: ${leitner[l] ?? 0})`
    );
  });
  console.log("========================");
}

function main() {
  const topics = loadTopics();
  ensureDir(REPORT_DIR);

  const langTotals = languageCoverage(topics);
  const topicStats = topicCoverage(topics);
  const missing = missingTranslations(topics);
  const leitner = leitnerCounts();
  const classes = classifyTopics(topicStats);

  // write reports
  fs.writeFileSync(path.join(REPORT_DIR, "language_coverage.json"), JSON.stringify(langTotals, null, 2));
  fs.writeFileSync(path.join(REPORT_DIR, "topic_coverage.json"), JSON.stringify(topicStats, null, 2));
  fs.writeFileSync(path.join(REPORT_DIR, "missing_translations.json"), JSON.stringify(missing, null, 2));

  // human-readable summary
  printSummary(langTotals, topicStats, missing, leitner);

  console.log("Topic readiness:");
  console.log(`  ready (>=90% all langs): ${classes.ready.length}`);
  console.log(`  almost (>=60% all langs): ${classes.almost.length}`);
  console.log(`  only-en dominant: ${classes.onlyEn.length}`);
  console.log(`  low (<40% some lang): ${classes.low.length}`);
  console.log(`  has tr data: ${classes.hasTr.length}`);

  // Quick list of topics with TR coverage >0
  const trList = classes.hasTr.map((t) => `${t.id} (${t.languages.tr.percent}%)`).join(", ");
  console.log(`Topics with TR present: ${trList || "none"}`);

  // suggest initial safe pairs
  const safePairs = [];
  if (langTotals.en.percent >= 90) safePairs.push("DE–EN");
  if (langTotals.tr.percent >= 50) safePairs.push("DE–TR (pilot, partial)");
  if (langTotals.es.percent >= 60) safePairs.push("DE–ES (partial)");
  console.log(`Suggested first pairs (data-only, not switched): ${safePairs.join(", ") || "none yet"}`);
}

main();
