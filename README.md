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

**Deck** — all 1187 words, a hundred at a time. Search across every language,
filter by category or by one of nine parts of speech, hide what you have already
mastered. Tap a card to flip it and read the word in every selected language,
with a speaker button on each row that uses the voices already installed on your
device.

The deck is **paginated, 100 cards per page**, and that is the difference between
a grid that stays quick and one that does not. Rendering 1187 cards up front means
~35,000 DOM nodes, ~7 MB of heap and a full grid re-render on every keystroke;
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

### What is in the 1187 words

Nouns, adjectives and verbs were only the starting point. A language learner also
needs function words, so the deck covers nine parts of speech:

| Part of speech | Words | Examples |
| --- | --- | --- |
| Noun | 950 | *vaca*, *pontapé*, *violino* |
| Adjective | 66 | *veloz*, *coredondo*, *silencioso* |
| Verb | 71 | *correr*, *lavar*, *esquecer* |
| Adverb | 26 | *aqui*, *nunca*, *de repente* |
| Pronoun | 26 | *eu*, *aquilo*, *deles* |
| Preposition | 16 | *sob*, *entre*, *através de* |
| Conjunction | 11 | *mas*, *porque*, *embora* |
| Interjection | 11 | *olá*, *ai*, *parabéns* |
| Numeral | 10 | *um* … *dez* |

The 1187 words sit in 53 categories, gathered into eight captioned groups so the
filter bar stays readable. Thirty-eight of the categories have words in them and
fifteen are still empty, waiting to be filled:

| Group | Filled | Words | Still empty |
| --- | --- | --- | --- |
| People | animals, birds, insects, sea, plants, body, face, health, feelings, people, family, jobs | 459 | — |
| Work and study | technology, tools, office, school, communication, media | 212 | — |
| Words | verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, interjections, numbers | 196 | position, quantity |
| Food | food, drinks, kitchen | 150 | — |
| World | nature, places, transport, time | 71 | weather, city, travel, money |
| Fun | colors, sports, music | 42 | shapes, sizes, textures, holidays, games |
| Home | objects | 40 | house, furniture, garden |
| Clothing | clothes | 17 | accessories |

The original 500 hand-drawn words are the spine; the Food, People and Work groups
were added afterwards in themed batches.

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
  art.js                       the shape vocabulary, the shared families, the
                               hand-drawn core catalogue
  art-nouns.js                 hand-drawn illustrations for the core nouns
  art-things.js                ...for jobs, objects, sports, music, places
  art-grammar.js               ...for verbs, adjectives and the grammar
  art-kinds.js                 the picture engine: 76 parameterised kinds
  art-specs-food.js            recipes, one line per themed word
  art-specs-people.js          recipes for the people group
  art-specs-work.js            recipes for the work and study group
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

Three things keep 1187 drawings consistent rather than merely present:

* **Shared families.** Drink containers, garments, buildings, vehicles, balls,
  instruments, screens and weather are drawn once and parameterised by colour and
  proportion, so seventeen garments and twenty-eight kitchen objects look like one
  set rather than forty-five inventions. The themed batches work the same way: one
  quadruped with a coat, an ear and a tail covers a horse, a fox and a goat; one
  bird with a beak covers thirty-one species; one body with a mark in a different
  place covers twenty symptoms; one figure with a different hat and tool covers
  fifty-six jobs. One tool, one desk object, one screen, one schoolroom thing, one
  speech bubble and one printed page cover two hundred words of work and study
  between them.
* **Silhouette before colour.** A recolour does not make a card distinguishable —
  six white cups with steam are six of the same card. Fish are told apart by
  build (a sardine is a sliver, a tilapia is a disc) and tail, a white bird gets an
  outline so it is not a blob on a pale card, a man is broader than a woman, and a
  boy is shorter. Every distinct drawing in the deck is asserted to be unique, so
  this cannot quietly regress.
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

Forty-nine drinks come out of a dozen kinds, four hundred and twenty-five words
about people come out of seven, and they look like one set. A recipe naming a kind
that does not exist falls back to generated geometry **and** is recorded in
`LLC.art.specFailures()`, which the test suite asserts is empty — a typo in one line
of a thousand is caught rather than shipping a card that quietly looks like nothing.

The vocabulary is positional, and positional arguments are easy to get wrong in ways
that render as nothing at all rather than as an error. Four lints in the test harness
cover the mistakes that actually happened while building this:

| Lint | Catches |
| --- | --- |
| `artlint.py` | a width passed where an attribute string belongs; a second `stroke-width` handed to a helper that already emits one |
| `arity.py` | too many arguments for a helper; a bare number or an unbalanced quote in the attribute slot |
| `pathcmd.py` | a computed path that never got its `M`, so the browser silently drops the shape |
| `dupes.py` | a themed word that repeats an existing entry in all three languages |
| `dropped.js` | a theme row that `add()` skipped, which is how five words went missing without a word |

`pathcmd.py` exists because the most expensive bug in the whole build was invisible:
twenty-nine paths were written `d="44,72 C40,86..."` with no command letter, and
every renderer discards such a path without a word. Forty-eight cards were quietly
missing a limb. `fixpath.py` repaired them, and the validator now re-checks the
generated markup so it cannot come back.

`arity.py` grew the same way. It started by checking the argument *count* and
finished by checking every slot that must hold a number, because `box(x, y, w, h,
fill, 'stroke=…')` drops the radius into the fill and renders nothing — silently,
in a card you have to open the app to see. The lesson is that in a positional DSL
the errors do not throw, they draw, and a lint that only catches the loud ones is
half a lint.

`dropped.js` exists because `LLC.data.add()` keeps the first definition of an id
and skips the rest without a word. It found a themed `fly` that the core deck
already owned, and a `palm` that meant two different things inside a single file.

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
actually landed: `add()` **silently skips** an id that already exists, and four
words in the first themed batch were dropped for exactly this reason without any
error. `dupes.py` and the row-count check in `i18ncheck.js` are the safety net.

**Add a picture kind** — one `kind('name', function (o) { … })` in
`art-kinds.js`, then use it from any recipe. A kind draws into a 120×120 viewBox
and should fill it: a pictogram that leaves half the tile empty reads as a
mistake. `shadow()`, `box()` and `cup()` are shared helpers.

**Draw a core word by hand** — add `map.otter = function () { return scene(…); }`
to the `map` in `art-nouns.js`, `art-things.js` or `art-grammar.js`. The helpers
(`LLC.art.d` for shapes, `LLC.art.f` for the families, `LLC.art.person` for a
figure) are shared with the recipe engine.

### Checking a change

The harness lives outside the repository, in `/tmp/opencode`, so the app itself
stays dependency-free. From a `python3 -m http.server 8080` in the project root:

```sh
node i18ncheck.js                          # labels resolve in all 3 languages
node dropped.js                            # every theme row reached the deck
python3 arity.py    ../…/assets/js/art*.js # numeric slots and argument counts
python3 artlint.py  ../…/assets/js/art*.js # attribute-string mistakes
python3 pathcmd.py  ../…/assets/js/art*.js # missing path commands
python3 validate.py svgs-all.json          # XML + attribute sanity
node test.js  http://127.0.0.1:8080/index.html   # 93 checks
node edge.js  http://127.0.0.1:8080/index.html   # 32 checks
node paging.js http://127.0.0.1:8080/index.html  # 62 checks
```

All three browser suites also run against `file:///…/index.html`, because working
from a file with no server is the point of the project. `sheet.py` builds a contact
sheet from `svgs-all.json` for looking at a whole category at once — that is how
the six-identical-fish problem was found, and it is faster than reading code.

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
