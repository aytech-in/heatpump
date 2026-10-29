#!/usr/bin/env bash
# Lädt die Produktfotos einmalig von eBay in den Ordner img/.
# Danach lädt die Website nichts mehr von eBay.  Ausführen:  ./scripts/fetch-images.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p img
get() { echo "-> img/$1"; curl -fsSL "$2" -o "img/$1"; }
get heatpump-8kw.jpg  "https://i.ebayimg.com/images/g/A-0AAeSwED5qv4I5/s-l1600.jpg"
get heatpump-16kw.jpg "https://i.ebayimg.com/images/g/aLEAAeSw-ftqv42o/s-l1600.jpg"
get hotwater-100l.jpg "https://i.ebayimg.com/images/g/kmkAAeSwMYpqv5Bw/s-l1600.jpg"
get generator.png     "https://i.ebayimg.com/images/g/P1sAAeSwmP5qv5QJ/s-l1600.png"
# eBay-Ersatzlinks aus index.html entfernen, damit nie wieder etwas von eBay geladen wird
sed -i.bak -E "s#[[:space:]]*onerror=\"this.onerror=null;this.src='https://i\.ebayimg\.com[^\"]*'\"##" index.html && rm -f index.html.bak
echo "Fertig. Bilder liegen in img/, index.html lädt nichts mehr von eBay."
