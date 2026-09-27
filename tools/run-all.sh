#!/usr/bin/env bash
# Every check, in the order a change should meet them.
#
#   tools/run-all.sh            everything
#   tools/run-all.sh --quick    skip the browser suites
#
# The browser suites need a static server on :8080 and headless Chrome. Start
# the server first, or use --quick:
#
#   python3 -m http.server 8080 --bind 127.0.0.1
set -u
cd "$(dirname "$0")/.."

QUICK=0
[ "${1:-}" = "--quick" ] && QUICK=1

fails=0
step() {
  printf '\n\033[1m== %s\033[0m\n' "$1"
  shift
  if "$@"; then :; else fails=$((fails + 1)); fi
}

# --- offline: source and data -----------------------------------------------
step 'lint: the positional shape vocabulary'        python3 tools/lint.py
step 'check: the deck, the labels, the artwork'     node tools/check.js
step 'shapes: recipes name something their kind draws' node tools/shapes.js
step 'tables: every field a table sets is read'       node tools/tables.js
step 'snapshot: render every card'                  node tools/snapshot.js
step 'validate: re-parse the rendered markup'       python3 tools/validate.py

# --- offline: drawing quality, reported not enforced -----------------------
# These exit non-zero on purpose. The count is the work list, not a build
# failure, so a red line here is information rather than a broken tree.
printf '\n\033[1m== recolour: the same picture in other colours\033[0m\n'
node tools/recolour.js --thresholds || true
printf '\n\033[1m== recolour: the work list, by kind\033[0m\n'
node tools/recolour.js --by kind || true
printf '\n\033[1m== sheets: one page per category\033[0m\n'
python3 tools/sheet.py || true

# --- in a browser: only exists once the page is running -------------------
if [ "$QUICK" = "0" ]; then
  if curl -sf -o /dev/null http://127.0.0.1:8080/index.html; then
    step 'test: what the app does'    node tools/test.js
    step 'edge: the ends of the deck' node tools/edge.js
  else
    printf '\n\033[33mbrowser suites skipped: no server on :8080\033[0m\n'
    printf '  python3 -m http.server 8080 --bind 127.0.0.1\n'
  fi
else
  printf '\n\033[33mbrowser suites skipped (--quick)\033[0m\n'
fi

printf '\n'
if [ "$fails" = "0" ]; then
  printf '\033[32mall enforced checks passed\033[0m\n'
else
  printf '\033[31m%d enforced check(s) failed\033[0m\n' "$fails"
fi
exit "$fails"
