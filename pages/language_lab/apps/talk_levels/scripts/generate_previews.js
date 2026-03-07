#!/usr/bin/env node
/**
 * Non-destructive preview generator for Sprachführer/Talk Levels.
 * - Master source: data/topics/*.json
 * - Outputs: data/_generated_preview/...
 * - No changes to core/assets/registries; safe to run repeatedly.
 *
 * Usage:
 *   node generate_previews.js        # build previews
 *   node generate_previews.js --report-only   # only validate & report
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const MASTER_DIR = path.join(ROOT, "data", "topics");
const OUT_DIR = path.join(ROOT, "data", "_generated_preview");
const OUT_LEITNER = path.join(OUT_DIR, "leitner");
const ALLOWED_LANGS = ["de", "en", "fr", "it", "es", "ru", "tr"];
const LEVELS = Array.from({ length: 11 }, (_, i) => ({ id: i, label: `L${i}` }));
const TARGET_LANGS = ["en", "es", "fr", "it", "ru", "tr"];

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report-only") || args.includes("--dry-run");

function stableId(topicId, mnemoKey, level, de, targetText, targetLang) {
  const raw = [topicId || "", mnemoKey || "", level ?? "", de || "", targetText || "", targetLang || ""].join("|");
  return "tl_" + crypto.createHash("sha1").update(raw).digest("hex").slice(0, 10);
}

function readJson(file) {
  const txt = fs.readFileSync(file, "utf8");
  return JSON.parse(txt);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function validateItem(item, topicId, warnings, errors) {
  const ctx = `${topicId || "?"}::${item.mnemoKey || "?"}`;
  if (typeof item.level !== "number" || item.level < 0 || item.level > 10) {
    errors.push(`Level fehlt/ungültig bei ${ctx}`);
  }
  if (!item.mnemoKey || typeof item.mnemoKey !== "string") {
    errors.push(`mnemoKey fehlt bei ${ctx}`);
  }
  if (!item.de || typeof item.de !== "string" || !item.de.trim()) {
    errors.push(`de fehlt bei ${ctx}`);
  }
  ALLOWED_LANGS.forEach((lang) => {
    if (!item[lang] || typeof item[lang] !== "string" || !item[lang].trim()) {
      warnings.missing.push({ lang, ctx });
    }
  });
}

function loadTopics() {
  const files = fs.readdirSync(MASTER_DIR).filter((f) => f.endsWith(".json"));
  const topics = [];
  const warnings = { missing: [] };
  const errors = [];
  const skipped = [];

  files.forEach((file) => {
    const full = path.join(MASTER_DIR, file);
    let data;
    try {
      data = readJson(full);
    } catch (e) {
      errors.push(`JSON-Fehler in ${file}: ${e.message}`);
      return;
    }
    if (!data || typeof data !== "object") {
      errors.push(`Leerer/ungültiger Inhalt in ${file}`);
      return;
    }
    if (!data.id || !data.title || !Array.isArray(data.items)) {
      skipped.push(file);
      return; // e.g. index.json (listing) – skip silently
    }
    data.items.forEach((item) => validateItem(item, data.id, warnings, errors));
    topics.push({ ...data, _source: file });
  });

  return { topics, warnings, errors, fileCount: files.length, skipped };
}

function buildBundle(topics) {
  return {
    meta: { languages: ALLOWED_LANGS, levels: LEVELS },
    topics: topics.map((t) => {
      const items = t.items.map((it) => {
        const out = { ...it };
        return out;
      });
      return { id: t.id, title: t.title, items };
    }),
  };
}

function buildLeitner(topics) {
  const byLang = {};
  TARGET_LANGS.forEach((lang) => (byLang[lang] = []));

  topics.forEach((t) => {
    t.items.forEach((it) => {
      TARGET_LANGS.forEach((lang) => {
        const src = (it.de || "").trim();
        const tgt = (it[lang] || "").trim();
        if (!src || !tgt) return;
        const card = {
          id: stableId(t.id, it.mnemoKey, it.level, src, tgt, lang),
          level: it.level,
          topic: t.title || t.id,
          mnemoKey: it.mnemoKey,
          mnemoHint: it.mnemoHint || "",
          de: src,
          [lang]: tgt,
        };
        const pronIpa = it.pronIpa?.[lang];
        const pronRu = it.pronRu?.[lang];
        if (pronIpa) card.pron = pronIpa;
        else if (pronRu) card.pron = pronRu;
        byLang[lang].push(card);
      });
    });
  });
  return byLang;
}

function buildPhrasebook(topics) {
  return {
    meta: { languages: ALLOWED_LANGS, levels: LEVELS.map((l) => ({ id: l.id, label: `Level ${l.id}` })) },
    topics: topics.map((t) => ({
      id: t.id,
      title: t.title,
      items: t.items.map((it) => {
        const out = {
          level: it.level,
          mnemoKey: it.mnemoKey,
          mnemoHint: it.mnemoHint || "",
        };
        ALLOWED_LANGS.forEach((lang) => {
          if (it[lang]) out[lang] = it[lang];
        });
        return out;
      }),
    })),
  };
}

function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function reportSummary({ topics, warnings, errors, fileCount, skipped }, leitnerSets) {
  const itemCount = topics.reduce((sum, t) => sum + (t.items?.length || 0), 0);
  const langsPresent = new Set();
  topics.forEach((t) =>
    t.items.forEach((it) => {
      ALLOWED_LANGS.forEach((l) => {
        if (it[l] && it[l].trim()) langsPresent.add(l);
      });
    })
  );

  console.log("=== REPORT ===");
  console.log(`Topics files: ${fileCount}, topics loaded: ${topics.length}, items: ${itemCount}`);
  if (skipped?.length) console.log(`Skipped files (not topic schema): ${skipped.join(", ")}`);
  console.log(`Languages present: ${Array.from(langsPresent).sort().join(", ") || "none"}`);
  console.log(`Warnings (missing translations): ${warnings.missing.length}`);
  console.log(`Errors: ${errors.length}`);
  if (warnings.missing.length) {
    const sample = warnings.missing.slice(0, 8);
    sample.forEach((w) => console.log(`  missing ${w.lang} in ${w.ctx}`));
    if (warnings.missing.length > sample.length) console.log(`  ... +${warnings.missing.length - sample.length} more`);
  }
  if (errors.length) {
    errors.forEach((e) => console.log("  ERROR:", e));
  }
  if (leitnerSets) {
    TARGET_LANGS.forEach((lang) => {
      console.log(`Leitner ${lang}: ${leitnerSets[lang]?.length || 0} cards`);
    });
  }
  console.log("=============");
}

function main() {
  const { topics, warnings, errors, fileCount } = loadTopics();
  if (errors.length) {
    reportSummary({ topics, warnings, errors, fileCount });
    if (!REPORT_ONLY) console.error("Abbruch wegen Fehlern.");
    process.exit(errors.length ? 1 : 0);
  }

  const bundle = buildBundle(topics);
  const leitner = buildLeitner(topics);
  const phrasebook = buildPhrasebook(topics);

  if (!REPORT_ONLY) {
    writeJson(path.join(OUT_DIR, "topics_bundle.json"), bundle);
    Object.entries(leitner).forEach(([lang, cards]) => {
      writeJson(path.join(OUT_LEITNER, `de-${lang}.json`), cards);
    });
    writeJson(path.join(OUT_DIR, "phrasebook_levels.json"), phrasebook);
  }

  reportSummary({ topics, warnings, errors, fileCount }, leitner);
  if (!REPORT_ONLY) {
    console.log("Outputs (preview only):");
    console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, "topics_bundle.json"))}`);
    TARGET_LANGS.forEach((lang) =>
      console.log(`  ${path.relative(ROOT, path.join(OUT_LEITNER, `de-${lang}.json`))}`)
    );
    console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, "phrasebook_levels.json"))}`);
  } else {
    console.log("Report-only: nichts geschrieben.");
  }
}

main();
