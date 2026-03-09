# Changelog

## 2026-02-23

- UI-Begriffe geklaert:
  - Inhalts-`Level` wird in der Anzeige jetzt als `Stufe` bezeichnet.
  - Leitner-Fortschritt bleibt `Box` (nun 8 Boxen in der UI/Logik).
- Datenmodell rueckwaertskompatibel getrennt:
  - Karten/Deck-Eintraege nutzen `stufe` (Alias `level` bleibt lesbar).
  - Fortschritt nutzt `box` (Migration alter Progress-Eintraege mit `meta.level -> meta.box`).
- Neues A1-Zusatzdeck (offline) hinzugefuegt:
  - Datei: `data/sentences_a1.json`
  - Wird als Zusatzdeck automatisch geladen (falls vorhanden), ohne bestehende Decks zu ersetzen.
