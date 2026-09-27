/**
 * Cards that are allowed to look alike, and why.
 *
 * `recolour.js` groups cards by how alike their drawings are and reports the
 * groups. This list takes some of them out of the count — and an allowlist is
 * the easiest way to make a number look better without making the deck better,
 * so every entry here has to answer one question: **is the picture the word?**
 *
 * If the answer is no — if a learner looking at the two cards side by side would
 * not know which is which, and the translation is the only thing telling them
 * apart — then the entry does not belong here, however similar the words are.
 * `narrow` and `tight` are two different adjectives and they are *not* on this
 * list. Fifty-two pairs of words that share an English base (`thirsty`/`thirst`,
 * `gale`/`gust`, `camel`/`hippo`) are all real work; see `homographs()` below.
 *
 * There are four arguments, and four kinds of entry.
 */

/* --------------------------------------------------------------- 1. colour */

/* A colour card is a swatch of that colour. The picture and the word are the
   same thing, so twelve identical shapes in twelve colours is the right answer
   rather than a shortcut. The shapes are all the same on purpose: what
   distinguishes *red* from *blue* is the red and the blue. */
const COLOURS = [
  'red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'pink',
  'purple', 'brown', 'gray', 'silver', 'golden', 'grey', 'turquoise', 'beige',
  'violet', 'indigo', 'magenta', 'cyan', 'lime', 'navy', 'olive', 'maroon',
  'teal', 'aqua', 'crimson', 'scarlet', 'ivory', 'cream', 'tan', 'khaki',
  'charcoal', 'ochre', 'coral', 'salmon', 'peach', 'lilac', 'mint', 'auburn',
  'burgundy', 'chestnut', 'emerald', 'sapphire', 'russet', 'sepia'
];

/* --------------------------------------------- 2. one shape, two names */

/* The languages disagree about which name is the general one, so the English
   words differ and the pictures do not — and should not. A rhombus is a
   diamond; an ellipse is an oval. */
const SAME_SHAPE = ['rhombus', 'rhomboid', 'ovoid', 'ellipse'];

/* ------------------------------------ 3. a category that turned out empty */

/* "The same object, distinguished by what it is used for rather than by what
   it looks like" sounded like a third legitimate argument. It is not, and the
   deck is why:

     passport  / passaporte  vs  visa  / visto          two documents
     departure / partida     vs  departures / partidas   an event vs a display
     transfer  / transporte  vs  transfer2 / transferência  a move vs a payment

   All three were added to this list, and all three are wrong: a learner shown
   the same booklet for *passport* and *visa* has been told something untrue.
   Near in meaning is not the same as the same thing, and the picture has to be
   the thing.

   So the list has two categories and two arguments. That is not a shortfall to
   be padded — it is the finding. Every other near-duplicate in the deck is
   work. */

/* ------------------------------------------------- 3. one word, two names */

/**
 * Pairs that are a single word in the language the app teaches from.
 *
 * The app shows Portuguese first, so Portuguese is the word a learner actually
 * has to attach a meaning to. When two cards carry the *same* Portuguese word,
 * there is nothing in the learner's own language to tell them apart, and the
 * picture is not expected to do better than the translation — a *sol* is a
 * *sun* and a *sunshine*, and drawing them differently would be inventing a
 * distinction the language does not make.
 *
 * This is the `rhombus`/`diamond` argument generalised from geometry to
 * vocabulary, and it is why `diamond`/`rhombus` appears in both lists.
 *
 * The criterion is mechanical — same Portuguese spelling, different English
 * spelling — so it is computed rather than written out. A hand-kept list of
 * synonym pairs would rot, and a list is the easiest thing here to pad.
 *
 * It is not a blanket excuse. It excuses a shared picture only where the
 * Portuguese is genuinely one word. Where the data is at fault it hides the
 * fault instead of fixing it, and there is one such case: *lanterna* is the
 * Portuguese for both a lantern and a sky lantern, so those two cards look
 * alike for a reason that is a missing word rather than a missing drawing.
 *
 * Returns the groups rather than a flat set of ids, and the caller has to ask
 * about a *specific pair*. Two cards each being a synonym of something is not
 * two cards being synonyms of each other: returning a set of ids and testing
 * membership excused `marmot`/`panda` and `triangle`/`prism`, which are a
 * marmot and a panda.
 */
function synonyms(words, home = 'pt') {
  const groups = new Map();
  for (const id of Object.keys(words)) {
    const key = String(words[id][home] || '').trim().toLowerCase();
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, new Set());
    groups.get(key).add(id);
  }
  const out = [];
  for (const g of groups.values()) {
    // only a *pair of different English words*; two spellings of one word
    // (backpack/rucksack) is a different case and needs no argument
    if (g.size < 2) continue;
    if (new Set([...g].map((id) => String(words[id].en || '').toLowerCase())).size < g.size) continue;
    out.push(g);
  }
  return out;
}

/** Whether these two ids are one word in the language the app teaches from. */
function sameWord(ids, a, b) {
  for (const g of ids) if (g.has(a) && g.has(b)) return true;
  return false;
}

/**
 * The measure: a pair of words that share an English base and are *not* the
 * same entry in any of the three languages.
 *
 * These are the largest single group of near-duplicates in the deck, and none
 * of them is excusable — every one is two different words drawing one picture.
 * They are listed here so the scope is explicit and so a drawing pass can work
 * through them by name. They are **not** in the allowlist, and `recolour.js`
 * reports them separately rather than folding them into the total.
 */
function homographs(entries) {
  const out = [];
  const groups = new Map();
  for (const id of Object.keys(entries)) {
    const base = id.replace(/2$/, '').replace(/s$/, '');
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push(id);
  }
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const triple = (id) => {
      const w = entries[id];
      return w ? [w.pt, w.en, w.es].join('|') : id;
    };
    if (g.every((id) => triple(id) === triple(g[0]))) continue;  // genuinely one word
    out.push(g);
  }
  return out;
}

const HAND = [...COLOURS, ...SAME_SHAPE];

module.exports = {
  hand: HAND,
  reasons: { COLOURS, SAME_SHAPE },
  synonyms,
  sameWord,
  homographs
};
