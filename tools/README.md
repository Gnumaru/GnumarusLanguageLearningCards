# The test harness

Everything here is for checking the app. None of it is loaded by `index.html`
and the web app itself has no dependencies — this directory is developer
tooling, and the constraint that matters is that a reader who opens `index.html`
gets the deck with nothing else involved.

It lives in the repository rather than in `/tmp` because `/tmp` is wiped. It was
there once and the machine rebooted, and everything below had to be written
again. Generated files go to `tools/.out/`, which is gitignored, so a run leaves
the tree clean.

```
tools/run-all.sh            everything, in order
tools/run-all.sh --quick    skip the two browser suites
```

## Running the browser suites

They need a static server and headless Chrome:

```sh
python3 -m http.server 8080 --bind 127.0.0.1     # in the project root
node tools/test.js
node tools/edge.js
```

Both suites run twice by themselves: once served, once from `file://`. Working
from a file with no server is the point of the project and the two origins fail
in different ways. Without a server, `run-all.sh` skips them and says so.

`CDP_PORT` changes the debugging port (9333 by default); an already-running
browser on that port is reused rather than restarted.

## The checks

### Enforced — a non-zero exit is a broken tree

| | |
| --- | --- |
| `lint.py` | The positional shape vocabulary: argument counts, a quoted string where a number belongs, a bare number or unbalanced quote in the attribute slot, a computed path with no moveto, a polygon point list carrying a command letter, an attribute the helper already emits. |
| `check.js` | The gate. Word count pinned, no empty category, unique ids, every label in all three languages, no blank translation, no two words the same entry in all three, every word draws, nothing on the generated fallback, no two words share a drawing. Delegates the drop check. |
| `drop.js` | Whether a theme file's rows actually reached the deck. |
| `shapes.js` | Whether a recipe asks for something its kind draws — and whether the kind read the parameter at all. |
| `tables.js` | The layer below the recipe. A kind that looks its answer up in a table (`ROLE`, `SCREENGLYPH`) draws nothing itself, so a correct recipe can still come out wrong because a field *in the table* is dead. Checks that every field a table sets is read, and that no entry draws exactly the fallback. |
| `snapshot.js` | Renders every card to `.out/cards.json`. |
| `validate.py` | Re-parses the rendered markup: malformed XML, duplicate attributes, a colour that arrived as a number, a bad point list. |
| `test.js` | The app, in a real browser: cards render, a tap flips one, the revealed words match the data, the language switches and the chrome follows, the deck paginates, nothing is fetched off-origin. |
| `edge.js` | The ends: the pager walked all the way to the last card, a search with no hits, a language switch mid-deck, the keyboard, the very last word. |

### Reported — a non-zero exit is information, not a failure

These measure how good the artwork is. The deck passes every enforced check and
can still be a worse product than it was, so they are printed and the run
continues.

| | |
| --- | --- |
| `recolour.js` | Cards that are the same picture in different colours, and which kinds are responsible. |
| `sheet.py` | One contact sheet per category, plus `--groups` for the eight largest. |

## The three ideas worth knowing

**Load order is data.** Every themed data file and every recipe file registers
under the same ids, and the last registration wins. `lib/deck.js` reads the
script order out of `index.html` rather than sorting by filename, so the checks
see the deck the browser builds. Two cards were byte-identical recipes for a
long time and no check noticed, because the harness was loading them in a
different order than the page.

**A branch that repeats itself is a branch that never runs.** `} else if (cond) {`
immediately followed by `} else if (cond) {` parses perfectly, throws nothing,
and gives every card the first branch — the empty one. Two of those were in the
tree, both copy-paste accidents, and both produced a card that drew nothing but
its shadow. `lint.py` looks for them now. No other check can: from outside, the
shape *is* a known one, so the branch list is satisfied.

**A drawing is a position, not a colour.** `lib/skeleton.js` strips the paint off
a card and keeps only the marks and where they are. Two cards with the same
skeleton are the same picture in different colours — which a duplicate check
comparing markup cannot see, because their markup differs. The similarity score
over the mark sets extends it to the near-misses, and it is calibrated against
pairs whose relationship is known:

```sh
node tools/recolour.js                 # identical skeletons
node tools/recolour.js --thresholds    # the count at several strictnesses
node tools/recolour.js --near=0.85     # related but confusable
node tools/recolour.js --by kind       # the work list
node tools/recolour.js --by category
node tools/recolour.js --list          # every group, worst first
```

## Layout

```
lib/paths.js            where everything is, derived from __dirname
lib/deck.js             load the deck in index.html order, here or in a child
lib/skeleton.js         the paint-stripped metric and the similarity score
lib/skeleton-allow.js   deliberate pairs, with the argument for each
lib/browser.js          a real page over the DevTools protocol
```
`lib/skeleton-allow.js` is a module rather than a data file so the argument for
each allowed pair sits next to the pair. There are two arguments and two
entries: a colour card *is* a swatch of that colour, and a rhombus really is a
diamond. Anything else on that list would be an excuse.

## Where things are not

`/tmp` is not used for anything, including the Chrome profile.
