# SCHEMA: Talk Levels / Sprachführer Master (`topics/*.json`)

**Gültiger Speicherort:** `pages/language_lab/apps/talk_levels/data/topics/*.json`  
**Rolle:** einziger editierbarer Master für alle Sprachführer-Daten (Talk Levels, Analyse, SprachBox/Leitner, Generator, Exporte).

## Datei‐Aufbau (pro Topic)
```jsonc
{
  "id": "allgemein",          // Pflicht, stable Topic-ID (slug)
  "title": "Allgemein",       // Pflicht, angezeigter Name
  "items": [
    {
      "level": 0,             // Pflicht, Integer 0–10
      "mnemoKey": "greet_wave",   // Pflicht, stabiler Schlüssel (snake/slug)
      "mnemoHint": "HI",          // Optional kurz (2–5 Zeichen), sonst ""
      "de": "Hallo!",             // Pflicht für Master
      "en": "Hello!",             // Optional, aber empfohlen
      "fr": "Salut !",
      "it": "Ciao!",
      "es": "¡Hola!",
      "ru": "Привет!",
      "tr": "Merhaba!",           // TR vorgesehen
      "pronIpa": { "tr": "Merhaba!" }, // Optional, per language
      "pronRu": { "tr": "мерхаба!" }   // Optional, per language (lautschrift russ.)
    }
  ]
}
```

## Pflichtfelder
- `id` (Topic), `title`, `items[]`
- Jedes Item: `level` (0–10), `mnemoKey` (string, stabil), `de` (string).

## Zulässige Sprachen
- `de, en, fr, it, es, ru, tr`
- Weitere Sprachen nur nach Schema-Update; derzeit nicht verwenden.

## Regeln
- `level`: ganzzahlig 0–10; Labeling erfolgt später im Bundle/Export.
- `mnemoKey`: eindeutig pro Topic; keine Leerzeichen; dient als Teil von IDs.
- `mnemoHint`: kurz, optional; wenn nicht benötigt → leerer String.
- Texte: Strings; leere oder fehlende Übersetzungen werden als “missing” gemeldet.
- `pronIpa` / `pronRu`: optionale Objekte; Keys = Sprachcodes; Werte = Lautschrift/Notiz. Nicht erforderlich für alle Sprachen.

## Ableitungen (nicht im Master pflegen)
- `topics_bundle.json` — Sammel-Bundle (Generator)
- Leitner/PWA-Datensätze pro Sprachpaar (`de-en`, `de-es`, …, `de-tr`)
- `phrasebook_levels.json` — kompatibler Export (sekundär)
- TSV/XLSX — optionale Exporte

## IDs in abgeleiteten Formaten
- Wenn im Master kein explizites Item-ID-Feld existiert, wird ein stabiler Hash aus `topic.id | level | mnemoKey | de | <target>` erzeugt (siehe Generator-Skript).

## Validierung
- Alle Master-Dateien müssen JSON ohne Kommentare sein.
- Fehlende Pflichtfelder oder ungültige Levels → Fehler im Generator.
- Fehlende Übersetzungen → Warning (nicht Abbruch).

Dieses Schema beschreibt nur den Master; alle anderen Formate sind read-only Derivate.
