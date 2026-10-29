# Wärmepumpen Berlin-Brandenburg

Statische Website: Katalog mit Kontakt per Telefon und WhatsApp. Kein Online-Kauf, keine Formulare, keine Cookies, kein Tracking, keine externen Schriften. Kein Build-Schritt.

## Ansehen

```bash
cd ~/workspace/heatpump
python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen.

## Vor dem Livegang

1. **Fotos laden:** `./scripts/fetch-images.sh` ausführen. Das lädt alle Galerie-Fotos (5–6 pro Gerät) von eBay nach `img/` und verkleinert sie. Fehlt ein Foto, blendet die Galerie es einfach aus. Eigene Fotos können unter denselben Dateinamen in `img/` gelegt werden (z. B. `heatpump-8kw-2.jpg`).
2. **Impressum und Datenschutz:** Name, Anschrift und E-Mail des Inhabers eintragen (alles in eckigen Klammern):
   `grep -n "\[" impressum.html datenschutz.html`
   Die Texte sind Vorlagen und keine Rechtsberatung. Am besten vom Inhaber mit einem Generator (z. B. e-recht24 oder datenschutz-generator.de) gegenprüfen lassen.
3. **Daten bestätigen lassen:** Technische Daten stammen aus den eBay-Angeboten. Beim Warmwasser-Gerät heißt es 100 l, das Modell aber MAHP-150A1.
4. **Kleinanzeigen (optional):** sobald es eine Anzeige gibt, einen Link neben „Auf eBay ansehen" ergänzen.

## Bewusst nicht auf der Seite

Keine Aussagen zu Garantie, CE-Kennzeichnung, Förderung, Effizienz oder Ersparnis, keine Preise, keine Bewertungen, kein erfundener Firmenname. Solche Angaben müsste der Inhaber selbst belegen können.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite |
| `impressum.html`, `datenschutz.html` | Rechtliches |
| `style.css`, `main.js` | Design und Leistungsumschalter 8/16 kW |
| `fonts/` | TeX Gyre Heros, lokal (GUST Font License) |
| `scripts/fetch-images.sh` | Fotos lokal speichern |

## Veröffentlichen mit GitHub Pages

1. Neues Repository auf GitHub anlegen und den Inhalt dieses Ordners hochladen.
2. Unter **Settings → Pages** den Branch `main` und den Ordner `/ (root)` wählen.
3. Nach ein bis zwei Minuten ist die Seite unter `https://<benutzername>.github.io/<repository>/` erreichbar.
