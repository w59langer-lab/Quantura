// ==========================================================
// DE: Basisdatenbank Level-Karten (nur Deutsch)
// EN: Base level card database (German only)
// RU: Базовая БД карточек уровней (только немецкий)
// ==========================================================
(function () {
  const base = [
    // Level 1 – Begrüßung / Höflichkeit
    { id: "L1_001", level: 1, topic: "Begrüßung", de: "Hallo!" },
    { id: "L1_002", level: 1, topic: "Begrüßung", de: "Guten Morgen!" },
    { id: "L1_003", level: 1, topic: "Begrüßung", de: "Guten Abend!" },
    { id: "L1_004", level: 1, topic: "Small Talk", de: "Wie geht es dir?" },
    { id: "L1_005", level: 1, topic: "Small Talk", de: "Mir geht es gut, danke." },
    { id: "L1_006", level: 1, topic: "Höflichkeit", de: "Danke schön!" },
    { id: "L1_007", level: 1, topic: "Höflichkeit", de: "Bitte sehr." },
    { id: "L1_008", level: 1, topic: "Höflichkeit", de: "Entschuldigung, können Sie mir helfen?" },
    { id: "L1_009", level: 1, topic: "Antwort", de: "Ja, gerne." },
    { id: "L1_010", level: 1, topic: "Antwort", de: "Nein, leider nicht." },

    // Level 2 – Persönliche Daten
    { id: "L2_011", level: 2, topic: "Persönliche Daten", de: "Wie heißt du?" },
    { id: "L2_012", level: 2, topic: "Persönliche Daten", de: "Ich heiße Markus." },
    { id: "L2_013", level: 2, topic: "Persönliche Daten", de: "Woher kommst du?" },
    { id: "L2_014", level: 2, topic: "Persönliche Daten", de: "Ich komme aus Österreich." },
    { id: "L2_015", level: 2, topic: "Persönliche Daten", de: "Wo wohnst du jetzt?" },
    { id: "L2_016", level: 2, topic: "Persönliche Daten", de: "Ich wohne in Wien." },
    { id: "L2_017", level: 2, topic: "Persönliche Daten", de: "Wie alt bist du?" },
    { id: "L2_018", level: 2, topic: "Persönliche Daten", de: "Ich bin achtundzwanzig Jahre alt." },
    { id: "L2_019", level: 2, topic: "Persönliche Daten", de: "Welche Sprachen sprichst du?" },
    { id: "L2_020", level: 2, topic: "Persönliche Daten", de: "Ich spreche Deutsch und ein bisschen Englisch." },

    // Level 3 – Wegbeschreibung
    { id: "L3_021", level: 3, topic: "Wegbeschreibung", de: "Wo ist der Bahnhof?" },
    { id: "L3_022", level: 3, topic: "Wegbeschreibung", de: "Ich suche die U-Bahn-Station." },
    { id: "L3_023", level: 3, topic: "Wegbeschreibung", de: "Gehen Sie geradeaus und dann links." },
    { id: "L3_024", level: 3, topic: "Wegbeschreibung", de: "Die Straße ist hier gesperrt." },
    { id: "L3_025", level: 3, topic: "Wegbeschreibung", de: "Der Platz ist fünf Minuten zu Fuß entfernt." },
    { id: "L3_026", level: 3, topic: "Wegbeschreibung", de: "Können Sie es auf der Karte zeigen?" },
    { id: "L3_027", level: 3, topic: "Wegbeschreibung", de: "Gibt es hier in der Nähe eine Apotheke?" },
    { id: "L3_028", level: 3, topic: "Wegbeschreibung", de: "Die Bushaltestelle ist gegenüber." },
    { id: "L3_029", level: 3, topic: "Wegbeschreibung", de: "Nehmen Sie die zweite Straße rechts." },
    { id: "L3_030", level: 3, topic: "Wegbeschreibung", de: "Ich habe mich verlaufen." },

    // Level 4 – Essen & Trinken / Restaurant
    { id: "L4_031", level: 4, topic: "Essen & Trinken", de: "Einen Tisch für zwei Personen, bitte." },
    { id: "L4_032", level: 4, topic: "Essen & Trinken", de: "Haben Sie die Speisekarte?" },
    { id: "L4_033", level: 4, topic: "Essen & Trinken", de: "Ich hätte gern ein Glas Wasser." },
    { id: "L4_034", level: 4, topic: "Essen & Trinken", de: "Ohne Zucker, bitte." },
    { id: "L4_035", level: 4, topic: "Essen & Trinken", de: "Können wir getrennt bezahlen?" },
    { id: "L4_036", level: 4, topic: "Essen & Trinken", de: "Ich bin Vegetarier." },
    { id: "L4_037", level: 4, topic: "Essen & Trinken", de: "Was empfehlen Sie heute?" },
    { id: "L4_038", level: 4, topic: "Essen & Trinken", de: "Die Suppe ist zu salzig." },
    { id: "L4_039", level: 4, topic: "Essen & Trinken", de: "Entschuldigung, das ist nicht, was ich bestellt habe." },
    { id: "L4_040", level: 4, topic: "Essen & Trinken", de: "Die Rechnung, bitte." },

    // Level 5 – Alltag / Einkaufen / Uhrzeit
    { id: "L5_041", level: 5, topic: "Alltag / Einkaufen", de: "Wie viel kostet das?" },
    { id: "L5_042", level: 5, topic: "Alltag / Einkaufen", de: "Haben Sie das auch in Größe M?" },
    { id: "L5_043", level: 5, topic: "Alltag / Einkaufen", de: "Ich möchte mit Karte bezahlen." },
    { id: "L5_044", level: 5, topic: "Alltag / Einkaufen", de: "Der Supermarkt schließt um neun Uhr." },
    { id: "L5_045", level: 5, topic: "Alltag / Einkaufen", de: "Ich suche eine günstige Unterkunft." },
    { id: "L5_046", level: 5, topic: "Alltag / Einkaufen", de: "Ich muss heute noch einkaufen gehen." },
    { id: "L5_047", level: 5, topic: "Alltag / Einkaufen", de: "Der Bus fährt alle zehn Minuten." },
    { id: "L5_048", level: 5, topic: "Alltag / Einkaufen", de: "Ich habe keine Münzen für den Automaten." },
    { id: "L5_049", level: 5, topic: "Alltag / Einkaufen", de: "Können Sie mir bitte das Kleingeld wechseln?" },
    { id: "L5_050", level: 5, topic: "Alltag / Einkaufen", de: "Wir treffen uns um halb sieben." },

    // Level 6 – Reise & Unterkunft
    { id: "L6_051", level: 6, topic: "Reise & Unterkunft", de: "Ich habe ein Zimmer reserviert." },
    { id: "L6_052", level: 6, topic: "Reise & Unterkunft", de: "Gibt es WLAN im Zimmer?" },
    { id: "L6_053", level: 6, topic: "Reise & Unterkunft", de: "Ich brauche ein zusätzliches Kissen." },
    { id: "L6_054", level: 6, topic: "Reise & Unterkunft", de: "Das Wasser in der Dusche ist kalt." },
    { id: "L6_055", level: 6, topic: "Reise & Unterkunft", de: "Wann ist der Check-out?" },
    { id: "L6_056", level: 6, topic: "Reise & Unterkunft", de: "Gibt es einen Shuttle zum Flughafen?" },
    { id: "L6_057", level: 6, topic: "Reise & Unterkunft", de: "Der Zug hat dreißig Minuten Verspätung." },
    { id: "L6_058", level: 6, topic: "Reise & Unterkunft", de: "Wo kann ich ein Fahrrad ausleihen?" },
    { id: "L6_059", level: 6, topic: "Reise & Unterkunft", de: "Können Sie ein gutes Restaurant in der Nähe empfehlen?" },
    { id: "L6_060", level: 6, topic: "Reise & Unterkunft", de: "Ich reise morgen weiter." },

    // Level 7 – Gesundheit / Arzt
    { id: "L7_061", level: 7, topic: "Gesundheit", de: "Ich habe starke Kopfschmerzen." },
    { id: "L7_062", level: 7, topic: "Gesundheit", de: "Ich brauche einen Arzt." },
    { id: "L7_063", level: 7, topic: "Gesundheit", de: "Haben Sie etwas gegen Fieber?" },
    { id: "L7_064", level: 7, topic: "Gesundheit", de: "Ich habe mich am Fuß verletzt." },
    { id: "L7_065", level: 7, topic: "Gesundheit", de: "Ich bin gegen Penicillin allergisch." },
    { id: "L7_066", level: 7, topic: "Gesundheit", de: "Ich brauche ein Rezept für dieses Medikament." },
    { id: "L7_067", level: 7, topic: "Gesundheit", de: "Wo ist die nächste Notaufnahme?" },
    { id: "L7_068", level: 7, topic: "Gesundheit", de: "Können Sie meinen Blutdruck messen?" },
    { id: "L7_069", level: 7, topic: "Gesundheit", de: "Ich habe seit gestern Bauchschmerzen." },
    { id: "L7_070", level: 7, topic: "Gesundheit", de: "Ich brauche einen Termin so schnell wie möglich." },

    // Level 8 – Probleme / Reklamation
    { id: "L8_071", level: 8, topic: "Probleme", de: "Mein Gepäck ist nicht angekommen." },
    { id: "L8_072", level: 8, topic: "Probleme", de: "Das Gerät funktioniert nicht." },
    { id: "L8_073", level: 8, topic: "Probleme", de: "Ich habe eine falsche Rechnung bekommen." },
    { id: "L8_074", level: 8, topic: "Probleme", de: "Es gibt kein warmes Wasser im Zimmer." },
    { id: "L8_075", level: 8, topic: "Probleme", de: "Der Nachbar macht die ganze Nacht Lärm." },
    { id: "L8_076", level: 8, topic: "Probleme", de: "Dieses Produkt ist beschädigt." },
    { id: "L8_077", level: 8, topic: "Probleme", de: "Ich möchte mein Geld zurück." },
    { id: "L8_078", level: 8, topic: "Probleme", de: "Können Sie mir bitte sofort helfen?" },
    { id: "L8_079", level: 8, topic: "Probleme", de: "Ich möchte mit der verantwortlichen Person sprechen." },
    { id: "L8_080", level: 8, topic: "Probleme", de: "Ich habe meinen Schlüssel verloren." },

    // Level 9 – Meinung / Begründung
    { id: "L9_081", level: 9, topic: "Meinung", de: "Meiner Meinung nach ist das eine gute Idee." },
    { id: "L9_082", level: 9, topic: "Meinung", de: "Ich finde, wir sollten früher anfangen." },
    { id: "L9_083", level: 9, topic: "Meinung", de: "Das ist besser, weil wir Zeit sparen." },
    { id: "L9_084", level: 9, topic: "Meinung", de: "Ich stimme dir teilweise zu." },
    { id: "L9_085", level: 9, topic: "Meinung", de: "Ich verstehe deinen Punkt, aber ich sehe das anders." },
    { id: "L9_086", level: 9, topic: "Meinung", de: "Mir gefällt dieser Plan nicht." },
    { id: "L9_087", level: 9, topic: "Meinung", de: "Das klingt vernünftig." },
    { id: "L9_088", level: 9, topic: "Meinung", de: "Ich bin nicht sicher, ob das funktioniert." },
    { id: "L9_089", level: 9, topic: "Meinung", de: "Ich glaube, wir brauchen mehr Informationen." },
    { id: "L9_090", level: 9, topic: "Meinung", de: "Ich würde lieber eine andere Option wählen." },

    // Level 10 – längere Sätze (A2/B1)
    {
      id: "L10_091",
      level: 10,
      topic: "Längere Sätze",
      de: "Ich habe gestern ein Museum besucht und viel über die Stadtgeschichte gelernt.",
    },
    {
      id: "L10_092",
      level: 10,
      topic: "Längere Sätze",
      de: "Wenn das Wetter morgen gut ist, machen wir einen Ausflug ins Gebirge.",
    },
    {
      id: "L10_093",
      level: 10,
      topic: "Längere Sätze",
      de: "Ich habe den Zug verpasst, weil es einen Stau auf der Autobahn gab.",
    },
    {
      id: "L10_094",
      level: 10,
      topic: "Längere Sätze",
      de: "Könnten Sie mir erklären, wie ich mich für den Kurs anmelden kann?",
    },
    {
      id: "L10_095",
      level: 10,
      topic: "Längere Sätze",
      de: "Ich versuche, jeden Tag ein wenig zu üben, damit ich schneller Fortschritte mache.",
    },
    {
      id: "L10_096",
      level: 10,
      topic: "Längere Sätze",
      de: "Es wäre hilfreich, wenn Sie mir die Unterlagen per E-Mail schicken könnten.",
    },
    {
      id: "L10_097",
      level: 10,
      topic: "Längere Sätze",
      de: "Ich war überrascht, wie freundlich die Leute hier sind.",
    },
    {
      id: "L10_098",
      level: 10,
      topic: "Längere Sätze",
      de: "Obwohl ich müde war, habe ich den Vortrag bis zum Ende gehört.",
    },
    {
      id: "L10_099",
      level: 10,
      topic: "Längere Sätze",
      de: "Ich möchte wissen, welche Voraussetzungen ich erfüllen muss, um teilzunehmen.",
    },
    {
      id: "L10_100",
      level: 10,
      topic: "Längere Sätze",
      de: "Können wir einen Termin finden, der für alle Beteiligten passt?",
    },
  ];

  window.LG_KARTEN_LEVEL_BASE_DE = base;
})();
