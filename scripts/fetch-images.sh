#!/usr/bin/env bash
# Lädt alle Produktfotos von eBay in den Ordner img/ und verkleinert sie für das Web.
# Danach lädt die Website nichts von eBay.   Ausführen:  ./scripts/fetch-images.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p img

E="https://i.ebayimg.com/images/g"

get() { # <Dateiname> <eBay-Bild-ID> [Endung auf eBay]
  local file="img/$1" ext="${3:-jpg}"
  if [ -s "$file" ]; then echo "   vorhanden: $file"; return; fi
  echo "-> $file"
  curl -fsSL "$E/$2/s-l1600.$ext" -o "$file" || { echo "   FEHLER beim Laden von $1 (wird übersprungen)"; rm -f "$file"; }
}

# Wärmepumpe 8 kW
get heatpump-8kw.jpg    A-0AAeSwED5qv4I5
get heatpump-8kw-2.jpg  9-YAAeSwuP5qv4Jd
get heatpump-8kw-3.jpg  O-oAAeSwOJdqv4Kc
get heatpump-8kw-4.jpg  xMoAAeSwRMlqv4L8
get heatpump-8kw-5.jpg  8FkAAeSw5XZqv4Mo

# Wärmepumpe 16 kW
get heatpump-16kw.jpg   aLEAAeSw-ftqv42o
get heatpump-16kw-2.jpg huIAAeSwgQBqv42-
get heatpump-16kw-3.jpg MhEAAeSwuV9qv43g
get heatpump-16kw-4.jpg LloAAeSwodNqv43z
get heatpump-16kw-5.jpg wDcAAeSwNnNqv44O
get heatpump-16kw-6.jpg cNUAAeSwUMdqv44e

# Warmwasser-Wärmepumpe
get hotwater-100l.jpg   kmkAAeSwMYpqv5Bw
get hotwater-100l-2.jpg WxYAAeSwh3Zqv5CH
get hotwater-100l-3.jpg zQsAAeSw8DZqv5CV
get hotwater-100l-4.jpg 6DUAAeSwNnNqv5Ch
get hotwater-100l-5.jpg 4CMAAeSwED5qv5Ct

# Notstromaggregat (auf eBay nur als PNG vorhanden)
if [ ! -s img/generator.jpg ]; then
  [ -s img/generator.png ] || get generator.png P1sAAeSwmP5qv5QJ png
  if [ -s img/generator.png ] && command -v sips >/dev/null; then
    echo "-> img/generator.jpg (umgewandelt)"
    sips -s format jpeg -s formatOptions 82 img/generator.png --out img/generator.jpg >/dev/null
    rm -f img/generator.png
  fi
fi

# Für das Web verkleinern (max. 1400 px), nur auf dem Mac mit "sips"
if command -v sips >/dev/null; then
  echo "-> verkleinere Fotos"
  for f in img/*.jpg; do
    w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
    h=$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}')
    if [ "${w:-0}" -gt 1400 ] || [ "${h:-0}" -gt 1400 ]; then sips -Z 1400 -s formatOptions 82 "$f" >/dev/null; fi
  done
fi

echo "Fertig. Fotos in img/:"
ls -lh img/
