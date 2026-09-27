# Gnumarus · Language Flashcards

A picture-based vocabulary trainer. You see a drawing of a thing — *vaca*, *veloz*,
*comer*, *entre* — and, by tapping the card, you see what it is called in
Portuguese, English and Spanish. The same deck doubles as a spaced-repetition
study app, so words you already know stop coming back and words you keep
forgetting come back sooner.

Built with plain HTML, CSS and JavaScript. No build step, no dependencies, no
network calls, no accounts. It works from a web server **and** by double-clicking
`index.html` straight from your disk.

---

## Running it

**Offline, from the file system**

```
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

**Over HTTP** (any static server will do)

```sh
python3 -m http.server 8080
# then visit http://localhost:8080/
```

There is nothing to compile, install or configure.

---

## What it does

**Deck** — all 2000 words, a hundred at a time. Search across every language,
filter by category or by one of nine parts of speech, hide what you have already
mastered. Tap a card to flip it and read the word in every selected language,
with a speaker button on each row that uses the voices already installed on your
device.

The deck is **paginated, 100 cards per page**, and that is the difference between
a grid that stays quick and one that does not. Rendering 2000 cards up front means
~60,000 DOM nodes, ~12 MB of heap and a full grid re-render on every keystroke;
one page of 100 is ~7,000 nodes, 2 MB, and 30 ms. The page size is a single
constant, `DECK_PAGE_SIZE` in `app.js`.

How paging behaves:

* The page lives in the hash — `#/deck/3` — so it survives a reload and can be
  linked to. A page past the end, a zero or a negative clamps; junk falls back
  to the first page.
* The range line sits above the grid *and* under it, so you always know where
  you are without scrolling back to the top.
* Any change to the filters — typing, a chip, the learned toggle, Clear — snaps
  back to page 1, because leaving someone on page 4 of a list that just shrank
  is worse than losing their place.
* Filters that fit on one page (a category of 16 words, a search with one hit)
  simply have no pager.
* Changing page moves the keyboard focus to the new page button, so a keyboard
  or screen-reader user is not dropped at the top of the document.
* Study sessions are unaffected: they are built from the scheduler, not from the
  page you happen to be looking at.

Search itself avoids rebuilding anything when it can. If the cards the new page
needs are already in the DOM, the ones that dropped out are hidden and only the
highlighted word is rewritten. When the page genuinely has to change, only
`#deckResults` is replaced — never the whole view, because that would rebuild
the search field and drop the caret mid-word.

The category and part-of-speech rows scroll horizontally, and whichever chip is
switched on is scrolled back into view — an active filter you cannot see reads
as no filter at all.

**Study** — three modes:

| Mode | What it does |
| --- | --- |
| **Learn** | Free study. Look at the picture, say the word out loud, reveal, grade yourself. |
| **Review** | Only the cards the scheduler says are due. Empty when you are up to date. |
| **Quiz** | Four options, one correct. Wrong answers come back before the session ends. |

Pick the language you already know and the ones you are learning, and the app
pairs them. A card you miss is scheduled to return within the same session; a card
you know is pushed further out.

**Progress** — mastered / in progress / untouched counters, answer accuracy, day
streak, per-category breakdown, a 14-day activity chart, and JSON export/import so
you can move your progress between browsers or machines.

**Settings** — interface language, theme (light / dark / follow the system), which
languages appear on the cards, pronunciation, animations, and where your data
lives.

### What is in the 2000 words

Nouns, adjectives and verbs were only the starting point. A language learner also
needs function words, so the deck covers nine parts of speech:

| Part of speech | Words | Examples |
| --- | --- | --- |
| Noun | 1654 | *vaca*, *pontapé*, *violino* |
| Adjective | 139 | *veloz*, *coredondo*, *áspero* |
| Verb | 77 | *correr*, *lavar*, *esquecer* |
| Adverb | 35 | *aqui*, *nunca*, *de repente* |
| Preposition | 32 | *sob*, *entre*, *por baixo de* |
| Pronoun | 26 | *eu*, *aquilo*, *deles* |
| Conjunction | 12 | *mas*, *porque*, *embora* |
| Interjection | 12 | *olá*, *ai*, *parabéns* |
| Numeral | 13 | *um* … *vinte* |

The 2000 words sit in 53 categories, gathered into eight captioned groups so the
filter bar stays readable. **Every category has words in it** — there are no
placeholder groups left:

| Group | Categories | Words |
| --- | --- | --- |
| People | animals, birds, insects, sea, plants, body, face, health, feelings, people, family, jobs | 514 |
| Words | verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, interjections, numbers, position, quantity | 303 |
| World | nature, places, transport, time, weather, city, travel, money | 283 |
| Play | colors, sports, music, shapes, sizes, textures, holidays, games | 245 |
| Work and study | technology, tools, office, school, communication, media | 229 |
| Home | objects, house, furniture, garden | 190 |
| Food | food, drinks, kitchen | 165 |
| Wear | clothes, accessories | 71 |

The original 500 hand-drawn words are the spine. Four themed batches were added
afterwards — food, people (12 categories), work and study, and finally the fifteen
categories that were still empty, which is where shapes, sizes, textures,
position and quantity came from.

Concrete things are drawn as concrete things. Abstract words are drawn as **scenes
and gestures**, because a picture of *entre* has to be an idea: a hand pointing at a
spot on the ground for *aqui*, a figure pointing at its own chest for *eu*, a ball
sitting inside a box for *em*, a figure with a suitcase under a plane for *viajar*,
a looping arrow with a tick for *sempre* and the same arrow struck through for
*nunca*. The numerals are the dots you would count on a die.

Some words are homographs in one language and distinct in another, and both cards
are kept on purpose — *he* and *him* are both *ele*, *morning* and *tomorrow* are
both *mañana*. The drawing is what tells them apart.

### Keyboard

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Reveal the answer, then continue |
| <kbd>1</kbd> / <kbd>2</kbd> | "I didn't know" / "I knew it" |
| <kbd>1</kbd>–<kbd>4</kbd> | Pick an option in Quiz mode |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a card | Flip it |
| <kbd>Esc</kbd> | Leave the session |

---

## Localisation

Two independent language settings, and the distinction matters:

* **Interface language** — the language the app itself speaks. Switchable at any
  time from the globe menu in the header, in three clicks, with no reload. It is
  remembered across visits.
* **Card languages** — the languages a word is *shown* in. A Brazilian reader can
  study English → Spanish with the interface in Portuguese. At least two must stay
  selected; you can still study any pair you like.

Right now both sets cover Portuguese, English and Spanish. The `dir` attribute is
already wired to each locale, so adding a right-to-left language needs no layout
work.

---

## Project layout

```
index.html                     the whole shell; no build step
assets/css/styles.css          theming via custom properties, light + dark
assets/js/
  i18n.js                      interface strings for every locale + t()
  storage.js                   localStorage with an in-memory fallback
  data/words.js                languages, groups, categories, the core 500 words
  data/themes-food.js          themed set: drinks + kitchen
  data/themes-people.js        themed set: animals … jobs (12 categories)
  data/themes-work.js          themed set: tools, office, school, media
  data/themes-last.js          themed set: the fifteen categories that were
                                still empty, accessories to quantity
  data/themes-more.js          top-up batch: 178 words spread over 46 of the
                                53 categories, all of them already in the deck
  art.js                       the shape vocabulary, the shared families, the
                               hand-drawn core catalogue
  art-nouns.js                 hand-drawn illustrations for the core nouns
  art-things.js                ...for jobs, objects, sports, music, places
  art-grammar.js               ...for verbs, adjectives and the grammar
  art-kinds.js                 the picture engine: 83 parameterised kinds
  art-specs-food.js            recipes, one line per themed word
  art-specs-people.js          recipes for the people group
  art-specs-work.js            recipes for the work and study group
  art-specs-last.js            recipes for the fifteen new categories
  art-specs-more.js            recipes for the top-up batch
  srs.js                       Leitner-box scheduling and progress bookkeeping
  app.js                       routing and the five views
```

Everything hangs off a single `window.LLC` namespace. Each file is a classic
`<script>`, deliberately: `file://` blocks ES modules over CORS, so `type="module"`
would break the offline use case. Data lives in JavaScript rather than JSON for the
same reason — `fetch()` of a local file is blocked on `file://`, and the whole deck
has to be there before the first paint.

Artwork is inline SVG built from a tiny shape vocabulary (`c`, `e`, `rc`, `p`,
`ps`, `pl`, `ln`, `txt`), so the whole deck is a few hundred KB of text, sharp at
any size, printable, and impossible to break with a missing file.

Four things keep 2000 drawings consistent rather than merely present:

* **Shared families.** Drink containers, garments, buildings, vehicles, balls,
  instruments, screens and weather are drawn once and parameterised by colour and
  proportion, so seventeen garments and twenty-eight kitchen objects look like one
  set rather than forty-five inventions. The themed batches work the same way: one
  quadruped with a coat, an ear and a tail covers a horse, a fox and a goat; one
  bird with a beak covers thirty-one species; one body with a mark in a different
  place covers twenty symptoms; one figure with a different hat and tool covers
  fifty-six jobs. One tool, one desk object, one screen, one schoolroom thing, one
  speech bubble and one printed page cover two hundred words of work and study
  between them. The last batch works the same way: one accessory renderer, one
  house-fixture renderer, one furniture renderer, one outdoor renderer that
  covers a garden, the weather and a street, one journey renderer, one money
  renderer and one diagram renderer carry six hundred and thirty-four words
  across fifteen categories.
* **Silhouette before colour.** A recolour does not make a card distinguishable —
  six white cups with steam are six of the same card. Fish are told apart by
  build (a sardine is a sliver, a tilapia is a disc) and tail, a white bird gets an
  outline so it is not a blob on a pale card, a man is broader than a woman, and a
  boy is shorter. Every distinct drawing in the deck is asserted to be unique, so
  this cannot quietly regress — and forty collisions were found and fixed this
  way in the last batch alone. A trimmed hedge is flat on top and a thicket is all
  spikes; a wall is striped with a skirting board, a floor is boards running away
  from you and a ceiling has a light fitting; a metre is divided into ten, a yard
  into three, and that is the only honest difference between a ruler and another
  ruler. A stool is a round seat on splayed legs with a footrest, a bedside table
  is small with one drawer and a lip, a plinth is a plain block with no overhang,
  and a coffee table is long and low with a shelf. A cellar is stone and barrels
  with no light; a basement is finished, with a furnace and a duct. A recolour is
  never the answer.

  The parameter is the difference between fixing this and postponing it. A
  footstool is not "a pouf, but brown" — it is a narrower pouf that stands on a
  ring, so the width and the ring are the parameters and the colour is not. A
  per-word variant produces a `footstool` shape identical to `pouf` and moves the
  collision one word along, which is exactly what happened the first time.
* **A draw-time safety net.** `LLC.art.get()` catches anything a drawing throws
  and falls back to deterministic generated geometry, so one bad card can never
  break a page — but it also records the failure in `LLC.art.failures()`, and the
  test suite asserts that list is empty. A silent fallback is exactly the kind of
  thing that hides a real bug; it caught one during this build.
* **A build-time check.** Every card is re-parsed as XML and compared against the
  others for duplicates, so a typo in a path data string, or two words quietly
  sharing a drawing, is caught before anyone opens the app.

The four art files each end with `LLC.art.register(map)`, so artwork can be split
and added to without touching the engine.

### Drawing a thousand words

Hand-drawing every word is not viable at this size, and it is not even the best
answer: a learner recognises a whole family from one shape. So the themed
vocabulary is described by **recipes**, and a recipe is a short record naming a
`kind` plus the parameters it draws with.

```js
// art-specs-food.js
latte:      d({ k: 'coffeecup', style: 'latte' }),
isotonic:   d({ k: 'bottle', liquid: '#38bdf8', cap: '#0284c7', tall: 1.1 }),
```

```js
// art-kinds.js — one renderer, many words
kind('bottle', function (o) { /* draws with o.liquid, o.cap, o.label, o.tall */ });
```

Forty-nine drinks come out of a dozen kinds, four hundred and fifty-nine words
about people come out of seven, six hundred and thirty-four words about the last
fifteen categories come out of seven more, and they all look like one set. A recipe
naming a kind that does not exist falls back to generated geometry **and** is
recorded in `LLC.art.specFailures()`, which the test suite asserts is empty — a typo
in one line of two thousand is caught rather than shipping a card that quietly looks
like nothing. A recipe naming a *shape* its kind does not have is a level below that
and needed its own check; see `shapes.js` above.

The vocabulary is positional, and positional arguments are easy to get wrong in ways
that render as nothing at all rather than as an error. Seven lints in the test
harness cover the mistakes that actually happened while building this:

| Lint | Catches |
| --- | --- |
| `lint.py` | too many arguments for a helper; a quoted string in a numeric slot; a bare number or an unbalanced quote in the attribute slot; a computed path with no `M`; a polygon point list carrying a command letter; two branches on the same condition |
| `check.js` | a themed row `add()` skipped, a duplicate entry in all three languages, a blank translation, a translation in the wrong script, a recipe that throws, a card on the generic fallback, two cards with the same drawing |
| `drop.js` | the same drop, one theme file at a time, which is the only way to see a collision masked by load order |
| `shapes.js` | a recipe naming a shape its kind does not have, and a recipe that draws the kind's default |
| `tables.js` | a field a kind's lookup table sets that the drawing never reads, and a table entry that draws exactly the fallback |
| `recolour.js` | two cards that are the same drawing in different colours, or nearly so |
| `validate.py` | every card re-parsed as XML: duplicate attributes, a numeric `fill`, a malformed point list |
| `sheet.py` | nothing — it draws a contact sheet so a human can look at a category at once |

`shapes.js` has a second half that matters more than the first. A branch list
only covers kinds that branch on a name; a kind that looks its parameter up in a
table, or in a chain of `if`s, returns the same default for every name it does
not recognise, and a branch list sees nothing wrong. So the check also renders
each recipe with a deliberately impossible parameter and compares: a drawing
identical to the fallback *is* the fallback. Every one of the 178 new recipes was
written blind and named a `kind:` or `mark:` no kind reads — `beast` is
combinatorial (coat, legs, tail, pattern, ear, face) and `roleFigure` reads a
fixed table — so a third of them drew the same default picture as their
neighbours. None of it threw, and all of it passed every other check.

`tables.js` exists for the layer below that. A kind like `roleFigure` draws
nothing itself: it looks the name up in a table and hands the entry to a shared
figure. So a recipe can be perfectly correct and the card still come out wrong,
because a field *in the table* is dead. `roleFigure` read `o.badge` and `o.prop`
but never `R.badge` and `R.prop`, so `employee` drew byte-for-byte the same
picture as `person`, and fifty-two figures were drawn with an empty hand — a
postman with no letter, a butcher with no cleaver, a teacher with no clipboard.
No exception, no duplicate markup, every other check green. Nothing looked at a
table, so nothing looked.

`recolour.js` is the one that measures the most. Every other check compares markup,
so it catches two cards that are byte-for-byte identical and says nothing about
two cards that differ only in the colour of their top. That is a much weaker
guarantee than it looks: the deck had 237 groups — 732 cards, two in every five —
where the picture was the same shape in different paint. It strips the fill, the
stroke and the style attributes off every card and compares what is left: the
sequence of marks and their geometry. A pouf and a footstool both drew three
stacked ellipses; four rooms in the house were the same room in four wall colours;
thirteen accessories were the same box.

It also scores near-misses by Jaccard over the mark sets, and the line it draws
is set at **0.85**. The distribution made the edge easy to find: 1.69k pairs sit
at exactly 1.00 and the next bucket holds twelve, so "identical" is a mode with a
clear edge and not a judgement call. The judgement was where to cut the tail, and
sampling each band settled it. Above 0.85 every pair found was a real defect — a
marmot drawn as a panda, three kinship words drawn as the same child, a citizen
drawn as a cashier. Below 0.85 the population changes character and the mass is
parametric families where sharing a curve *is* what the kind does. 0.85 is a line
through a gradient, not a boundary between right and wrong: `manager` and `boss`
are a real defect and sit at 0.77, under it.

Its allowlist (`tools/lib/skeleton-allow.js`) is a module so the argument for each
case sits next to the case, and it has **two** categories rather than the four it
started with. A colour card *is* a swatch of that colour, and a rhombus really is
a diamond. A third category — "the same object, distinguished by what it is used
for" — was tried and **failed**: a passport is a booklet and a visa is a stamp in
it, a departure is an event and a departures board is a display. Showing the same
picture for *passport* and *visa* tells the learner something untrue. A fourth
exists but is computed from the data rather than written out: two cards carrying
the same Portuguese word cannot be told apart by a picture, because the learner's
own language does not tell them apart. `recolour.js --excused` lists everything
the allowlist drops, which is the check on the check.

**52 pairs of different words share an English base** and draw one picture —
`thirsty`/`thirst`, `gale`/`gust`, `camel`/`hippo`, `dozen`/`dozens`. Not one is
excusable: they are two words that were never told apart. They are reported as
their own number rather than folded into the total.

The honest number today is **292 groups, 1,013 cards** at the line, 875 of them at
exact identity. The worst kinds are `diagram` (203), `outdoor` (122),
`roleFigure` (92), `accessory` (75), `money` (51), `office` (47) and `journey`
(42); by category, money (46), quantity (44), accessories (43), city (40), games
(38) and weather (35). Most of it predates the last batch: the colours and the
first fifty people are from the original 500. Fixing it means adding parameters to
kinds the same way this batch did.

`lint.py` exists because the most expensive bug in the whole build was invisible:
twenty-nine paths were written `d="44,72 C40,86..."` with no command letter, and
every renderer discards such a path without a word. Forty-eight cards were quietly
missing a limb. The validator now re-checks the generated markup so it cannot come
back.

The same file now also refuses two branches on the same condition. `} else if (a) {`
immediately followed by `} else if (a) {` parses perfectly, throws nothing, and
gives every card the first branch — the empty one. There were two in the tree, both
copy-paste accidents: `emergency` (medical) and `lightswitch` (household) were cards
showing nothing but their shadow. No other check can see this, because from the
outside the shape *is* a known one and the branch list is satisfied.

The same lint grew to check every slot that must hold a number, because
`box(x, y, w, h, fill, 'stroke=…')` drops the radius into the fill and renders
nothing — silently, in a card you have to open the app to see. The lesson is that in
a positional DSL the errors do not throw, they draw, and a lint that only catches
the loud ones is half a lint.

`drop.js` exists because `LLC.data.add()` keeps the first definition of an id
and skips the rest without a word. It found a themed `fly` that the core deck
already owned, and a `palm` that meant two different things inside a single file.
The last batch lost 71 rows this way, and two suffixes that had been added to dodge
a collision turned out to have created an exact duplicate in all three languages,
which is not a new card at all.

**Load order matters, and the harness now reads it from `index.html`.** Every
themed data file and every recipe file registers under the same ids, and the last
registration wins. A harness that loads them in alphabetical order therefore
tests a *different deck* from the one the browser builds: `compass` and `compass2`
were identical recipes, and the bug was invisible until the harness was ordered the
way the page is. `deck.js` parses the `<script>` tags so both agree.

### The scheduling

Each card sits in one of six boxes. A correct answer moves it up one box; a wrong
answer sends it back to the first. Box *n* comes back after `[0, 1, 2, 4, 9, 21]`
days, and the last box counts as mastered. Review sessions take the weakest cards
first. Learn sessions fall back to the least recently seen card, so the mode never
dead-ends just because nothing happens to be due.

---

## Extending it

**Add a word** — one row in the `RAW` table in `assets/js/data/words.js`:

```js
['otter', 'animals', 'noun', 'lontra', 'otter', 'nutria'],
```

`id | category | part of speech | pt | en | es`. The `id` is what progress is
tracked against, so changing an existing one resets that word's history, and it
has to be unique. Where one English word covers two ideas, disambiguate the id and
leave the visible translation alone: the deck carries `orange` (the colour) beside
`orangefruit` (the fruit), and `clean` (the adjective) beside `cleanverb` (the
verb). Nothing the reader ever sees shows the difference.

**Add a language** — add the code to each word's `w` object, add an entry to
`LANGUAGES` and to `languageIds`, and add `lang.<code>` to every locale in
`i18n.js`. Nothing else needs to change: cards, study pairs, progress and export
all read from `data.languageIds`.

**Add an interface language** — copy a block in `LOCALES` in `i18n.js` and set
`_dir` to `'ltr'` or `'rtl'`. The header picker builds itself from that object.

**Add a themed word** — one row in a `data/themes-*.js` file, then one recipe in
the matching `art-specs-*.js`:

```js
// data/themes-kitchen.js
['whisk', 'kitchen', 'noun', 'batedor', 'whisk', 'batidor'],

// art-specs-kitchen.js
whisk:  k({ k: 'utensil', shape: 'whisk', grip: '#334155' }),
```

`LLC.data.add()` keeps the first definition of an id, so a themed file can
overlap the core deck without clobbering it — and a word with no recipe still
renders through the fallback. That rule cuts both ways, so always check what
actually landed: `add()` **silently skips** an id that already exists. Four words
in the first themed batch and seventy-one in the last were dropped for exactly
this reason without any error. `drop.js` and `check.js` are the safety net.

Suffixing an id to dodge a collision is not a fix. `star2`, `mirror2`, `wallet2`
and seventeen others were added that way in one pass and turned out to be exact
duplicates of the core entry in all three languages — the same card twice, which
teaches nothing. When a word already exists under a different id, either drop the
row or make it a genuinely different word.

**Add a picture kind** — one `kind('name', function (o) { … })` in
`art-kinds.js`, then use it from any recipe. A kind draws into a 120×120 viewBox
and should fill it: a pictogram that leaves half the tile empty reads as a
mistake. `shadow()`, `box()` and `cup()` are shared helpers.

**Draw a core word by hand** — add `map.otter = function () { return scene(…); }`
to the `map` in `art-nouns.js`, `art-things.js` or `art-grammar.js`. The helpers
(`LLC.art.d` for shapes, `LLC.art.f` for the families, `LLC.art.person` for a
figure) are shared with the recipe engine.

### Checking a change

The harness lives in `tools/`, inside the repository. Nothing in it is loaded by
`index.html` and the app has no dependencies — a reader who opens `index.html`
gets the deck and nothing else is involved. It is in the repository rather than
in `/tmp` because `/tmp` is wiped; the harness was there once and the machine
rebooted, and all of it had to be written again. Generated files go to
`tools/.out/`, which is gitignored.

```sh
tools/run-all.sh                                # everything, in order
tools/run-all.sh --quick                        # skip the two browser suites
```

Individually, from the project root, with a `python3 -m http.server 8080` for the
browser suites:

```sh
python3 tools/lint.py                           # the shape vocabulary, positionally
node    tools/check.js                          # labels, drops, duplicates, artwork
node    tools/drop.js                           # every theme row reached the deck
node    tools/shapes.js                         # recipes name a shape their kind has
node    tools/tables.js                         # every field a table sets is read
node    tools/snapshot.js                       # render every card to .out/cards.json
python3 tools/validate.py                       # XML, attributes, point lists
node    tools/recolour.js                        # the same picture, at the triage line
node    tools/recolour.js --by kind              # ...grouped by kind, to work through
python3 tools/sheet.py                          # one contact sheet per category
node    tools/test.js                           # 42 checks, both origins
node    tools/edge.js                           # 24 checks, both origins
```

`tools/README.md` documents each check and why it exists.

`test.js` and `edge.js` each run twice: once against `http://127.0.0.1:8080/` and
once against `file:///…/index.html`, because working from a file with no server is
the point of the project. Both drive real Chrome over the DevTools protocol and
**disable the cache first** — without that, a second run tests the previous run's
JavaScript and a fix reads as still broken.

`sheet.py` builds a contact sheet from `.out/cards.json` for looking at a whole
category at once. That is how the six-identical-fish problem was found, and it is
also how the last batch was reviewed: the first draft had five garden tools all
rendered as the same hammer, four kinds of fog as the same three white bars, and
every room in the house drawn as the same television. None of those are duplicate
markup, so no automated check could see them. Reading the sheet took a minute and
found all three.

Two things in the harness are worth knowing about:

* `lib/deck.js` loads the deck in the order `index.html` loads it. The themed files
  all register under the same ids, so a harness that sorts by filename tests a
  different deck from the one the browser builds.
* `recolour.js` measures how much of the same-picture problem is left, and prints
  the count at several strictnesses. Run it before a drawing pass, not after: the
  number is the work list.

---

## Notes on running from `file://`

Three browser restrictions shape the code, and all three are handled:

* **No `fetch`, no modules.** Data and scripts are plain classic files, loaded by
  the parser in order.
* **`localStorage` may be unavailable.** Some browsers use an opaque origin for
  `file://` and throw on access. Every access is guarded and falls back to an
  in-memory map; if storage really is blocked the app says so in Settings and
  keeps working for the session, and the progress screen explains that it will be
  lost on close.
* **No service worker, no web manifest.** Not needed: the app is already offline
  once the files are on disk.

A corrupt or hand-edited progress file is normalised on load rather than trusted —
bad records are dropped, counters are coerced to numbers, and box values are
clamped — so a bad file degrades to "start over" instead of a blank page.

## Data

Everything stays in your browser. There is no analytics, no telemetry, no fonts or
assets fetched from a third party, and no network request of any kind after the
page loads. Export writes a plain JSON file you own; delete it and the app forgets
the import.

## Browser support

Current Chrome, Edge, Firefox and Safari, on desktop and mobile. The layout adapts
down to small screens, honours `prefers-color-scheme` and
`prefers-reduced-motion`, and the whole app is keyboard reachable.

## Licence

See `LICENSE`.
