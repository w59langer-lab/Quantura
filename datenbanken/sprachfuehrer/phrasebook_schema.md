setting## phrasebook_levels.json – Format

- `meta.languages`: Reihenfolge der Sprachen im Dataset, aktuell `["de","en","it","fr","es","ru"]`.
- `meta.levels`: Liste mit `id` (0–10) und `label` (z.B. `Level 3`).
- `topics[]`: Themenblöcke mit:
  - `id`: stabiler Identifier (z.B. `hotel`, `restaurant`).
  - `title`: Anzeigename.
  - `items[]`: Einträge mit:
    - `level`: Zahl 0–10.
    - `mnemoKey`: eindeutiger Schlüssel für Mnemo-Sketch/SVG.
    - `mnemoHint`: kurze Abkürzung (optional, 2–5 Zeichen).
    - `de` / `en` / `it` / `fr` / `es` / `ru`: Phrasen in sechs Sprachen.

Mehr Felder können später ergänzt werden, solange bestehende Keys stabil bleiben.
