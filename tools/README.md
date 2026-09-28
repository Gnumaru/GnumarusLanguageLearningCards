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
| `check.js` | The gate. Word count pinned, no empty category, unique ids, every label in all three languages, no blank translation, no translation in the wrong script, no two words the same entry in all three, a recipe for an id the deck does not have, every word draws, nothing on the generated fallback, no two words share a drawing. Delegates the drop check. |
| `drop.js` | Whether a theme file's rows actually reached the deck. |
| `shapes.js` | Whether a recipe asks for something its kind draws — and whether the kind read the parameter at all. |
| `tables.js` | The layer below the recipe. A kind that looks its answer up in a table (`ROLE`, `SCREENGLYPH`) draws nothing itself, so a correct recipe can still come out wrong because a field *in the table* is dead. Checks that every field a table sets is read, and that no entry draws exactly the fallback. |
| `duplicates.js` | A recipe registered twice, where the later one silently replaces the earlier. Fails on any: one recipe per id. |
| `branches.js` | A branch a kind declares that no recipe can reach — the half `shapes.js` cannot see, because the recipe is still pointing at the old shape. Fails on any undeclared one. |
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

**The number today is 283 groups, 924 cards.** Worst kinds: `diagram` 132,
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

### Worked example: counting

`count` was drawing a hundred as ten dots, a thousand as fifteen and a million as
eighteen. It is a parametric drawing, it did not throw, every check passed — and
a learner counting the dots would have been taught a wrong fact. The numbers are
now **written**, with the seven-segment table the `media` batch already had:

```
twelve 12    hundred 100    thousand 1 000
twenty 20    million  1 000 000    billion 10⁹
```

Two things about writing them that only showed up on the contact sheet. A
seven-segment digit draws from `x-12` to `x+20`, so centring the advance widths
left the last digit hanging off the card and put the exponent of `10⁹` outside it
entirely — the layout has to be done by **ink**, not by advance. And a
seven-segment `1` is two bars hard against the right of its cell, so `1000000`
read as `|000000` until the digits were **grouped in threes**, which is how a
million is written in Portuguese and Spanish anyway.

The rest of the counting words needed `mark` on the `dots` mode: the count alone
was the whole parameter, so `pair`, `fewer`, `remainder` and `quarter` were four
words drawn as the same N circles. What separates them is what the count is *for*
— a pair is two things that are one unit, `fewer` is a shorter set beside a whole
one, `remainder` is what is left of something, and a quarter is the whole
divided rather than a number of things at all.

`count` (the tally) is the one worth looking at: it is the mark you actually make
when you count, strokes in fives with a diagonal across the last group.

`count` — the old mode, a box of dots under a line — is **gone**. Its last caller
was a recipe for a word the deck does not have, and a drawing nobody can reach is
worse than no drawing. Deleting it turned up something bigger: **55 recipes belong
to ids that are not words.** Every check walks the *words*, so a recipe nobody
will ever see is invisible to all of them. The pattern is a rename — a word needed
a distinct id to stop colliding with the core deck, so `level` became `level2` and
the recipe written for `level` was left behind. `check.js` now fails on it.

Finding them took two sweeps, not one. The obvious sweep looks for `X2` beside
`X`, and it found 22. The other 33 needed the second kind of match: the word's id
was not a variant of the recipe's at all. `banktransfer` is the word
`transfer2` (bank transfer / transferência), `downpour` is `shower2`,
`frostwarning` is `frost2`, `lightsnow` is `sleet2`, `voucher` is `discount2`.
Matching on the *English* the id carries found those. One dead recipe, `geometry`,
had no word at all — and it was a finished drawing, so it is the one deletion that
might be worth undoing if a word slot is ever spent on geometry.

**The sweep was worth more than the deletion.** A dead recipe sitting next to a
live one is a free second opinion, and two live cards turned out to be plainly
wrong only because of it:

* `gate` (portão) was drawn as an **envelope** — `office`/`letter`. The dead
  `gatepost` next to it was a wooden post.
* `scale2` (balança) was drawn as a **cash till** — `money`/`till`.
* `headphones2` (auscultadores) is a speaker with sound waves.

None of them is a near-duplicate, so `recolour.js` cannot see them and no
similarity measure would: the picture is simply of the wrong thing. Fixing them
means new branches (`household` has no gate, `office` has no balance), which is
its own batch.

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

### Worked example: three cards that were the wrong object

`gate` (portão) was drawn as an **envelope**, `scale2` (balança) as a **cash
till**, and `headphones2` (auscultadores) as a **speaker**. None of them is a
near-duplicate, so no similarity measure can see them — the picture is of the
wrong thing, and the only evidence was a dead recipe for `gatepost` sitting in
the next file, drawing a gate post.

Fixing them was three new branches, and two serve more than the word they were
written for:

* `household`/`gate` — two posts, five bars, a diagonal brace. The bars are what
  separate a gate from `door`: a solid panel with a handle is a door, a frame you
  can see the garden through is a gate.
* `tool`/`balance` — a beam and two pans, with a weight in the heavier one. It
  went beside `tool`/`ruler` because a ruler and a balance are both instruments.
* `message`/`headphones` — a band over two cups, with `boom` for the microphone.
  Three words were on the old `sound` branch and all three drew a speaker,
  because there was nowhere else to put them, so `sound` became a proper speaker
  box and the headset is headphones **plus** a boom. The microphone is the whole
  difference between *headphones* and a *headset*.

`gate` also needed the duplicate recipe next to it deleted. A `house` block drew
a gate as a wall panel and a `travel` block drew one as an office letter; because
the travel block registers later, the envelope won.

### Worked example: a recipe registered twice

Five cards were drawn by a *third* recipe for an id that two words already shared.
`bat`/`bat2` (animal / baseball bat), `compass`/`compass2` (divider / magnetic),
`column`/`column2` (newspaper / geometric), `mask`/`mask2` (health / costume) all
had a recipe each, and `art-specs-last.js` added a third for the bare id. Because
that file registers last it won, and each drew the wrong object: a crowbar for a
bat, a travel map for a pair of compasses, a hexagon for the sea, a plain bar for
a newspaper column, a masquerade for a health mask.

Deleting the five lines was the whole fix, and it is the cheapest batch in the
project: no new art, just removing a line that was overwriting the right one.
Three of the five landed immediately. Two did not, and the reason is worth
recording, because it is the difference between *which drawing wins* and *what any
kind can draw at all*:

* `bat` now draws the `beast` kind, which reads `coat ear eye face headX horn
  legs mane mark muzzle nose pattern snout tail` — **there is no `wing`**, so a
  flying mammal comes out as a four-legged animal. The right recipe won and the
  right answer is still out of reach.
* `bat2` draws `tool`/`mallet`, because the `tool` kind has no club.

So "a stale recipe is shadowing this" and "no kind can draw this" are different
defects that look identical from the outside, and the first one was hiding the
second. `duplicates.js` reported the rest, and the count is now zero.
because the six that draw a different object were checked: `wallet` winning as
`money`/`wallet`, `wheelbarrow` as a barrow, `root` as a root ball and `sideboard`
as a cabinet are all the right object, better drawn.

### Worked example: four words no kind could draw

Having the right recipe win is not the same as any kind being able to answer. Four
words were correctly pointed at a kind that had no way to draw them, and no metric
distinguishes those two situations — the card looks deliberate either way.

| | was | now |
| --- | --- | --- |
| `bat` | a `beast`, and the kind reads `coat ear eye face headX horn legs mane mark muzzle nose pattern snout tail` — **no `wing`**, so a flying mammal came out as a four-legged one | `beast` with a `wing`: a membrane drawn before the body so it is attached at the shoulder, with ribs, because a membrane is what tells a wing from a wing-shaped blob |
| `bat2` | `tool`/`mallet` | `tool`/`club`: two strokes of different widths, because one stroke of one width is a stick |
| `compass2` | `diagram`/`arrow` | `journey`/`compass`: a case, a dial, cardinal ticks and a needle. The needle is the whole word — a case and a dial with nothing between them is a pocket watch |
| `mask2` | `accessory`/`soft`, a patch of fabric | `accessory`/`mask`: the two almond eye holes are what make it a mask, and a ribbon says it is tied on |

`journey`/`compass` and `school`/`compass` are now two different instruments under
the same shape name in two different kinds — a divider and a magnetic compass.
That is worth knowing when reading the source, and it is why the comment on the
new branch names the other one.

Three of the four branches went into the wrong kind on the first attempt. `club`
was anchored on `crowbar` and `mask` on `podium`, neither of which is in the kind
being extended — so the branch parsed, the lint stayed clean, and the card drew
nothing at all. **A branch in the wrong `if` chain is not a compile error; it is a
branch that cannot run.** The tell is the drawing: 312 characters, which is a
background and a shadow.

### Worked example: the last 18 duplicate keys

The five that drew the wrong thing were the visible half. The other 18 broke down
as six exact copies, six that differed only in background tint, and six that drew
a different object and were correct.

The exact copies were free. The tinted ones were a real find: `referee` is a
`jobs` word whose drawing was being tinted by a `games` registration, `trophy` an
`accessories` word tinted by a `games` one. Same picture, wrong background, and
nobody looking at a card would ever know why the card was the colour it was.

One of the six was hiding something. `flat` is a texture, and the registration
winning for it was a `position` recipe drawing a **bar** — a flat texture is a flat
swatch. The one the word wanted had been there the whole time, shadowed.

`budget` was the interesting decision. Both it and `spreadsheet` were
`office`/`chart`, and the obvious fix — different bar heights — is the same
picture with different numbers, which is a recolour with extra steps. So `budget`
went to `office`/`coins` instead: money in a pile is a different object from a
table of figures, which is what the two words actually are. That is the same
distinction the project has been making since the first batch, and it was
available here too.

The last six were all redundant: two because the `X2` twin already had a drawing,
four written for words that never arrived. `duplicate keys: 0`, and
`duplicates.js` now fails on any — the same treatment the dead recipes got, for
the same reason. A stale entry is a silent, permanent loss, and it is only ever
added by someone who does not know it is there.

### Worked example: the half of a misplaced branch that nothing can see

`shapes.js` catches a *recipe* that names a shape its kind does not draw — and it
would have caught a recipe pointing at the wrong kind, which was verified rather
than assumed. What it cannot catch is the other half: a **branch** in a kind that
no recipe ever points at, which is where the work actually goes missing.

It happened three times in one afternoon and looked fine every time. `tool`/`club`
was anchored on `crowbar`, which is not in `tool`. `accessory`/`mask` on `podium`,
which is in `school`. `journey`/`compass` on `board`, which is declared in three
kinds. In each case the branch parsed, the lint stayed clean, and the card drew
**312 characters** — a background and a shadow. `shapes.js` had no reason to fire,
because the recipe was still pointing at the old shape. The bug lived in the gap
between adding a branch and pointing a recipe at it, and no check looks at a gap.

`branches.js` looks at the gap. It reads every `if (o.shape === ...)` a kind
declares and every `(kind, field, value)` triple a recipe actually asks for, and
reports the difference. A kind that ends in an `else` reaches every name and is
exempt — the fallback is a real answer, and a branch only one word in the world
would ever want is not dead.

It found ten, and they are not all the same thing. Five are branches I orphaned
myself by deleting the duplicate recipes in the previous batch — `school`/`bag`,
`school`/`board`, `tool`/`cart`, `plant`/`root` and `school`/`geometry` — which is
the honest cost of that batch: the art is finished and unreachable, and now it says
so. Three are a second drawing of something another kind already draws
(`groom`/`jar`, `groom`/`mirror`, `media`/`record`). Two are art for words nobody
has added.

The ten are a declared table with the reason written beside each, and an
*undeclared* orphan fails. The same argument `lib/skeleton-allow.js` makes: a table
of exceptions is the easiest thing in a tool to pad, so each row says what the
branch is for.

Two of them are worth a decision rather than a note, and both decisions went the
other way from what was expected.

`classroom` is drawn by `school`/`room`, and there is a `school`/`deskpupil`
branch — a desk, a pupil, a board — that was assumed to be the better drawing.
It is not. `classroom` is *aula*: the room, with the board, the window and a
person for scale. The other branch is a person **behind a desk**, which is a
different word. So `classroom` stays where it is, `school`/`room` also serves
`staffroom`, and the branch is a picture waiting for its own name.

Which answers the question that was asked about the name: **no, it does not need
renaming.** The case for renaming rested on the assumption that the branch was
`classroom`'s drawing and that the name collided. It is neither — no recipe points
at it, so the name is read by nobody but the next person to open the file, and a
rename is churn until a word arrives that wants it. When one does, the name should
be one word.

`mirror` is drawn by `furniture`/`mirror`: a round glass in a **wooden frame on a
foot** — a dressing-table mirror, which is why it is in `furniture`. The
`groom` branch is the same round glass in a **blue frame on a thin stem**, among
the toothpaste and the razor. Both read as a mirror, they do not collide, and
neither is the better picture of the word: a mirror is a mirror. There is no case
for switching, so `mirror` stays.

The four `seascape` orphans turned out to be the most interesting. `lagoon` and
`bay` **are** words, and both take a neighbouring branch — `lagoon` takes `atoll`,
a ring-shaped reef, and `bay` and `gulf` both take `inlet`. So the branch that
names the word is the one not in use, and `bay`/`gulf` sharing a drawing is a
separate finding already in the recolour count.

And the first draft of these reasons was written from assumption: it described
`lagoon` and `bay` as having no word at all, which was wrong. **A reason that is a
guess is worse than no reason, because it stops the next person from looking.**

### Worked example: a star that was a lightning bolt

`SHAPE.star` was a hand-written point list that was a **lightning bolt**, and it
ignored the `x` and `y` it was handed, so every star in the deck was the same bolt
in the same place. `BADGE.star`, `BADGE.bolt`, `BADGE.hourglass` and
`TALKGLYPH.warn` were the same mistake.

Nothing could have caught it. The point list was syntactically valid — an even
number of numeric coordinates — so `validate.py` passed it, and there was only
one star in the deck, so no duplicate check fired. **A polygon being well formed
is not the same as being the right shape**, and that gap is where it lived.
`lint.py` now refuses a table entry that draws a fixed point list while accepting
a centre.

The lesson generalises: the harness can tell you a drawing is *well made* and a
drawing is *the right thing* only by looking at it. Everything above was found by
looking.

## Where things are not

`/tmp` is not used for anything, including the Chrome profile.
