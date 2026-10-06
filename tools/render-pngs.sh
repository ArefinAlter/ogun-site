#!/usr/bin/env bash
# Renders the PNG files that browsers and social networks need (og.png, icons) from dist/_render/*.
# Needs Microsoft Edge or Google Chrome. Run after `node build.mjs`; commit the results in public/.
set -euo pipefail
cd "$(dirname "$0")/.."
B=""
for c in "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" "/c/Program Files/Google/Chrome/Application/chrome.exe" "$(command -v google-chrome || true)" "$(command -v chromium || true)" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
  [ -n "$c" ] && [ -x "$c" ] && B="$c" && break
done
[ -z "$B" ] && { echo "Edge or Chrome not found"; exit 1; }
url() { local p; p="$(pwd)/dist/_render/$1/index.html"; command -v cygpath >/dev/null && p="$(cygpath -m "$p")"; echo "file:///${p#/}"; }
out() { local p; p="$(pwd)/public/$1"; command -v cygpath >/dev/null && p="$(cygpath -w "$p")"; echo "$p"; }
shot() { # name file width height transparent
  local bg=(); [ "$5" = "1" ] && bg=(--default-background-color=00000000)
  "$B" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 "${bg[@]}" --screenshot="$(out "$2")" --window-size="$3,$4" --virtual-time-budget=1500 "$(url "$1")" >/dev/null 2>&1
  echo "public/$2"
}
shot og og.png 1200 630 0
shot icon-512 icon-512.png 512 512 1
shot icon-192 icon-192.png 192 192 1
shot apple-touch-icon apple-touch-icon.png 180 180 0
shot favicon-32 favicon-32.png 32 32 1
