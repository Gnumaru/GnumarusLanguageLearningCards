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

**Deck** — all 500 words, a hundred at a time. Search across every language,
filter by category or by one of nine parts of speech, hide what you have already
mastered. Tap a card to flip it and read the word in every selected language,
with a speaker button on each row that uses the voices already installed on your
device.

The deck is **paginated, 100 cards per page**, and that is the difference between
a grid that stays quick and one that does not. Rendering 500 cards up front means
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

### What is in the 500 words

Nouns, adjectives and verbs were only the starting point. A language learner also
needs function words, so the deck covers nine parts of speech:

| Part of speech | Words | Examples |
| --- | --- | --- |
| Noun | 286 | *vaca*, *pontapé*, *violino* |
| Adjective | 59 | *veloz*, *coredondo*, *silencioso* |
| Verb | 55 | *correr*, *lavar*, *esquecer* |
| Adverb | 26 | *aqui*, *nunca*, *de repente* |
| Pronoun | 26 | *eu*, *aquilo*, *deles* |
| Preposition | 16 | *sob*, *entre*, *através de* |
| Conjunction | 11 | *mas*, *porque*, *embora* |
| Interjection | 11 | *olá*, *ai*, *parabéns* |
| Numeral | 10 | *um* … *dez* |

The 500 words sit in 23 categories, from the everyday (*animals*, *food*, *body*,
*clothes*) to the situational (*places*, *transport*, *time*, *technology*).

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
  data/themes-food.js          themed sets; each pushes into LLC.data.add()
  art.js                       the shape vocabulary, the shared families, the
                               hand-drawn core catalogue
  art-nouns.js                 hand-drawn illustrations for the core nouns
  art-things.js                ...for jobs, objects, sports, music, places
  art-grammar.js               ...for verbs, adjectives and the grammar
  art-kinds.js                 the picture engine: 50+ parameterised kinds
  art-specs-food.js            recipes, one line per themed word
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

Three things keep 500 drawings consistent rather than merely present:

* **Shared families.** Drink containers, garments, buildings, vehicles, balls,
  instruments, screens and weather are drawn once and parameterised by colour and
  proportion, so seventeen garments and twenty-eight kitchen objects look like one
  set rather than forty-five inventions.
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

### Drawing fifteen hundred words

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

Forty-nine drinks come out of a dozen kinds, and they look like one set. A recipe
naming a kind that does not exist falls back to generated geometry **and** is
recorded in `LLC.art.specFailures()`, which the test suite asserts is empty — a
typo in one line of a thousand is caught rather than shipping a card that
quietly looks like nothing.

The two mistakes the positional vocabulary invites are also linted
(`artlint.py` in the test harness): a width passed where an attribute string
belongs, and a second `stroke-width` handed to a helper that already emits one.

Related words share a kind on purpose, so the deck reads as a set rather than as
fifteen hundred unrelated pictures.

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
renders through the fallback.

**Add a picture kind** — one `kind('name', function (o) { … })` in
`art-kinds.js`, then use it from any recipe. A kind draws into a 120×120 viewBox
and should fill it: a pictogram that leaves half the tile empty reads as a
mistake. `shadow()`, `box()` and `cup()` are shared helpers.

**Draw a core word by hand** — add `map.otter = function () { return scene(…); }`
to the `map` in `art-nouns.js`, `art-things.js` or `art-grammar.js`. The helpers
(`LLC.art.d` for shapes, `LLC.art.f` for the families, `LLC.art.person` for a
figure) are shared with the recipe engine.

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
