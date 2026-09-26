# Gnumarus · Language Flashcards

A picture-based vocabulary trainer. You see a drawing of a thing — *vaca*, *veloz*,
*comer* — and, by tapping the card, you see what it is called in Portuguese,
English and Spanish. The same deck doubles as a spaced-repetition study app, so
words you already know stop coming back and words you keep forgetting come back
sooner.

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

**Deck** — all 100 words in a filterable grid. Search across every language, filter
by category or part of speech, hide what you have already mastered. Tap a card to
flip it and read the word in every selected language, with a speaker button on
each row that uses the voices already installed on your device.

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
  data/words.js                the deck: languages, categories, 100 words
  art.js                       100 hand-built SVG illustrations
  srs.js                       Leitner-box scheduling and progress bookkeeping
  app.js                       routing and the five views
```

Everything hangs off a single `window.LLC` namespace. Each file is a classic
`<script>`, deliberately: `file://` blocks ES modules over CORS, so `type="module"`
would break the offline use case. Data lives in JavaScript rather than JSON for the
same reason — `fetch()` of a local file is blocked on `file://`, and the whole deck
has to be there before the first paint.

Artwork is inline SVG built from a tiny shape vocabulary (`c`, `e`, `rc`, `p`,
`ps`, `pl`, `ln`), so the entire deck is about 110 KB of text, sharp at any size,
printable, and impossible to break with a missing file. A word without bespoke art
falls back to deterministic generated geometry rather than a broken image.

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
tracked against, so changing an existing one resets that word's history.

**Add a language** — add the code to each word's `w` object, add an entry to
`LANGUAGES` and to `languageIds`, and add `lang.<code>` to every locale in
`i18n.js`. Nothing else needs to change: cards, study pairs, progress and export
all read from `data.languageIds`.

**Add an interface language** — copy a block in `LOCALES` in `i18n.js` and set
`_dir` to `'ltr'` or `'rtl'`. The header picker builds itself from that object.

**Draw something** — add a function to `ART` in `art.js` returning a `scene(...)`
built from the shape helpers. A forgotten word still renders (via the fallback), so
artwork can be added at whatever pace you like.

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
