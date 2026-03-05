#!/usr/bin/env node
/**
 * Anleitung:
 * 1) cd in den Projektordner
 * 2) node talk_levels/scripts/migrate_level4_add_tr_and_pron.js
 *
 * Macht Backup von talk_levels/data in talk_levels/data_backup_YYYY-MM-DD_HH-mm-ss/
 * und ergänzt in allen JSONs: tr, pronIpa, pronRu pro Phrase/Objekt.
 */

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

function timestampDirName() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const date = [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join("-");
  const time = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join("-");
  return `data_backup_${date}_${time}`;
}

function isPlainObject(val) {
  return Boolean(val) && typeof val === "object" && !Array.isArray(val);
}

async function copyRecursive(src, dest) {
  await fs.promises.cp(src, dest, { recursive: true });
}

function ensureFields(obj) {
  let changed = false;

  if (!Object.prototype.hasOwnProperty.call(obj, "tr")) {
    obj.tr = "";
    changed = true;
  }

  if (!Object.prototype.hasOwnProperty.call(obj, "pronIpa") || !isPlainObject(obj.pronIpa)) {
    obj.pronIpa = {};
    changed = true;
  }

  if (!Object.prototype.hasOwnProperty.call(obj, "pronRu") || !isPlainObject(obj.pronRu)) {
    obj.pronRu = {};
    changed = true;
  }

  return changed;
}

function processValue(value, insideArray, state) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const next = processValue(value[i], true, state);
      if (next !== value[i]) {
        value[i] = next;
        state.fileChanged = true;
      }
    }
    return value;
  }

  if (isPlainObject(value)) {
    let changed = false;
    if (insideArray) {
      if (ensureFields(value)) {
        changed = true;
        state.phrasesUpdated += 1;
      }
    }

    for (const key of Object.keys(value)) {
      const next = processValue(value[key], false, state);
      if (next !== value[key]) {
        value[key] = next;
        changed = true;
      }
    }

    if (changed) state.fileChanged = true;
    return value;
  }

  return value;
}

async function main() {
  try {
    const backupDir = path.join(__dirname, "..", timestampDirName());
    await copyRecursive(dataDir, backupDir);

    const files = await fs.promises.readdir(dataDir);
    const jsonFiles = [];

    async function collectJson(dir, prefix = "") {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const rel = path.join(prefix, entry.name);
        if (entry.isDirectory()) {
          await collectJson(fullPath, rel);
        } else if (entry.name.toLowerCase().endsWith(".json")) {
          jsonFiles.push(rel);
        }
      }
    }

    await collectJson(dataDir);

    let totalPhrasesUpdated = 0;
    for (const relPath of jsonFiles) {
      const filePath = path.join(dataDir, relPath);
      const raw = await fs.promises.readFile(filePath, "utf8");
      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error(`Überspringe ${relPath} (kein gültiges JSON):`, err.message);
        continue;
      }

      const state = { fileChanged: false, phrasesUpdated: 0 };
      processValue(data, false, state);
      totalPhrasesUpdated += state.phrasesUpdated;

      if (state.fileChanged) {
        const serialized = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(filePath, `${serialized}\n`, "utf8");
      }
    }

    console.log("Migration abgeschlossen.");
    console.log(`Backup: ${path.resolve(backupDir)}`);
    console.log(`Verarbeitete Dateien: ${jsonFiles.length}`);
    console.log(`Geänderte Phrasen: ${totalPhrasesUpdated}`);
  } catch (err) {
    console.error("Migration fehlgeschlagen:", err);
    process.exitCode = 1;
  }
}

main();
