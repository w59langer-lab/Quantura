## Grammar Rule DB (Schema)

Jede Regel ist ein JSON-Objekt:
```json
{
  "id": "DE.PREP.AUS_DAT",
  "lang": "de",
  "type": "prep_case",
  "priority": 100,
  "data": {
    "prep": "aus",
    "case": "Dativ",
    "question": "Woher?",
    "why": "‚aus‘ verlangt Dativ."
  },
  "examples": ["Ich komme aus Deutschland."]
}
```

### Typen (Start)
- `prep_case`            – feste Präposition mit Kasus/Frage/Begründung
- `wechselprep_wo_wohin` – Wechselpräpositionen mit Bewegung/Ort Heuristik (woCase/wohinCase, motionVerbs/staticVerbs)
- `formal_subject_es`    – Muster „es“ als formales Subjekt (z. B. „es geht …“)
- `copula_predicative`   – Kopula-Verben (sein/werden/bleiben/heißen) → Prädikativ statt Objekt
- `punctuation`          – Satzzeichen nie als Objekt/Ergänzung
- `verb_aux_perfekt`     – Wahl des Hilfsverbs bei Perfekt/Plusquamperfekt/Futur II
- `language_nouns`       – Sprachennamen als Nomen (Neutrum „das …“), oft ohne Artikel

### Dateien
- `rules_shared.json`   – gemeinsame Regeln
- `rules_de.json`       – deutsche Regeln

Regeln werden nach `priority` sortiert (höher = früher angewendet). Fehlende Felder sind optional; unbekannte Felder werden ignoriert.
