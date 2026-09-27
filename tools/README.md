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
| `recolour.js` | Cards that are the same picture, and which kinds are responsible. |
| `sheet.py` | One contact sheet per category, plus `--groups` for the eight largest. |

## The triage line

`recolour.js` is the work list, so the line it draws decides how much work there
is. It is set at **similarity ≥ 0.85**, and the reasoning is in the file.

The distribution made it easy to see where the edge was. 1.69k pairs sit at
exactly 1.00 and the next bucket holds twelve, so "identical" is a mode with a
clear edge and not a judgement call. The only judgement was where to cut the
tail, and sampling each band settled it:

* **above 0.85** every pair found was a real defect — a marmot drawn as a
  panda, three kinship words drawn as the same child, a citizen drawn as a
  cashier — with no exceptions left, because the exceptions were checked and are
  either on the allowlist or were found to be wrong
* **below 0.85** the population changes character: the mass is parametric
  families where sharing a curve *is* what the kind does

0.85 is a line through a gradient, not a boundary between right and wrong.
`manager` and `boss` are a real defect and sit at 0.77, below it.

```sh
node tools/recolour.js                  # the work list at the line
node tools/recolour.js --thresholds     # the count at seven strictnesses
node tools/recolour.js --exact          # identity only, no similarity
node tools/recolour.js --by kind        # the work list, grouped by kind
node tools/recolour.js --by category
node tools/recolour.js --list           # every group, worst first
node tools/recolour.js --homographs     # pairs of different words, one drawing
node tools/recolour.js --excused        # what the allowlist drops — audit this
```

**The number today is 290 groups, 975 cards.** Worst kinds: `diagram` 165,
`outdoor` 122, `roleFigure` 92, `accessory` 75, `money` 51, `office` 47,
`journey` 42, `message` 32, `media` 32, `tool` 29.

### Worked example: the position words

The first kind attacked was `diagram`, and inside it the 36 position words. They
were drawn as a grid of twelve cells with some of them filled, which encodes
*which cells* rather than *above* — so `above` and `below` were two fillings of
the same twelve and 24 words were one group.

Two new modes in the `diagram` kind fixed all 36 with no parameter collisions:

* `place` — a dot at a named spot relative to a box
* `route` — an arrow taking a named path

The part that was not obvious is that the words are not all the same kind of
relation. `top` is the upper **part** of a thing, so the reference is tall and
the dot sits on its edge; `above` is higher **than** a thing, so the reference is
a single object and the dot is clear of it; `atop` is the one in between —
touching. First attempt gave all three the same spot and changed nothing.
`ref: 'tall'` is the parameter that separates them.

`amidships` is the one worth reading: it collided with `amidst` because both mean
"in the middle", but in English *amidships* is the middle of a **ship**, so it
got a hull. Reading the word properly beat inventing a difference.

36 words, 9 groups, 38 cards off the total.

## The allowlist

An allowlist is the easiest thing in this file to abuse: every entry makes the
number better without making the deck better. So each one has to answer **is the
picture the word?** — and the answers live next to the cases, in
`lib/skeleton-allow.js`.

There are **two** categories, and finding that out was most of the work:

1. **A colour card is a swatch of that colour.** 46 ids. The shapes are all the
   same on purpose: what distinguishes *red* from *blue* is the red and the blue.
2. **One shape, two names.** 4 ids. The languages disagree about which name is
   the general one, so the words differ and the pictures should not.

And a third that was tried and **failed**, which is the useful part:

3. **"The same object, distinguished by what it is used for."** All three
   candidates were wrong. A passport is a booklet and a visa is a stamp in it;
   a departure is an event and a departures board is a display. A learner shown
   the same picture for *passport* and *visa* has been told something untrue.
   Near in meaning is not the same as the same thing.

A fourth exists but is **computed from the data** rather than written out: two
cards carrying the same Portuguese word. The app teaches Portuguese first, so
that is the word a learner has to attach a meaning to, and when it is the same
word there is nothing in their own language to tell the cards apart — the
`rhombus`/`diamond` argument generalised from geometry to vocabulary. In
practice it excuses only three whole groups today, so the rule is narrow even
though 190 ids qualify.

Two rules kept this honest:

* **Per pair, not per card.** A synonym excuse covers two cards against *each
  other* and says nothing about either against a third. Removing every synonym
  card from consideration wholesale excused 30 groups the rule has no claim to.
* **Auditable.** `recolour.js --excused` lists every group the allowlist drops.
  It is the check on the check. Reading it is how I caught the synonym rule
  excusing `marmot`/`panda` and `triangle`/`prism` — two cards each being a
  synonym of something is not two cards being synonyms of each other.

**52 pairs of different words share an English base** and draw one picture:
`thirsty`/`thirst`, `gale`/`gust`, `camel`/`hippo`, `dozen`/`dozens`. Not one is
excusable — they are two words that were never told apart. They are reported as
their own number (`--homographs`) rather than folded into the total, and none of
them is on any allowlist.

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
over the mark sets extends it to the near-misses. The line it draws is discussed
above.

## Layout

```
lib/paths.js            where everything is, derived from __dirname
lib/deck.js             load the deck in index.html order, here or in a child
lib/skeleton.js         the paint-stripped metric and the similarity score
lib/skeleton-allow.js   deliberate pairs, with the argument for each
lib/browser.js          a real page over the DevTools protocol
```
`lib/skeleton-allow.js` is a module rather than a data file so the argument for
each allowed pair sits next to the pair — including the category that was tried
and found to have no members, which is the part worth keeping. Two arguments and
two entries: a colour card *is* a swatch of that colour, and a rhombus really is
a diamond. Anything else on that list would be an excuse.

## Where things are not

`/tmp` is not used for anything, including the Chrome profile.
