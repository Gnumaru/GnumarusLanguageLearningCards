/**
 * Cards that are the same picture, and which kinds are responsible.
 *
 *   node tools/recolour.js [--exact] [--list] [--by kind|category]
 *                           [--thresholds] [--homographs] [--excused] [--near[=T]]
 *
 * The duplicate check in check.js compares markup, so it catches two cards that
 * are byte-for-byte identical and says nothing about two cards that differ only
 * in the colour of their top. That is a much weaker guarantee than it looks, and
 * it is the one that matters for a deck whose whole premise is recognising the
 * picture: this measures it.
 *
 * Two ways to group, because they answer different questions.
 *
 * Equality strips the paint off every card — fill, stroke, and the style
 * attributes that say how a mark looks rather than where it is — and compares
 * what is left: the sequence of marks and their geometry. Two cards with the
 * same skeleton are the same drawing in different colours.
 *
 * Similarity scores two cards by Jaccard over their mark sets. It finds the
 * near-misses equality cannot see: two tables differing by one drawer are not
 * equal and are still hard to tell apart. It is O(n²) over 2000 cards, which
 * takes under two seconds.
 *
 * Calibrated against pairs whose relationship is known, and the line is set at
 * 0.85. The reasoning, and its limit:
 *
 * The distribution is lumpy. 1.69k pairs sit at exactly 1.00 and the next
 * bucket holds twelve, so "identical" is a mode with a clear edge around it and
 * not a judgement call. The only judgement is where to cut the tail.
 *
 * Sampling each band settles it. Above 0.85 every pair found was a real defect
 * — a marmot drawn as a panda, three kinship words drawn as the same child, a
 * dove drawn as a robin, a citizen drawn as a cashier — with no exceptions
 * left, because the exceptions were checked and are on the allowlist or were
 * found to be wrong. Below 0.85 the population changes character: the mass is
 * parametric families where sharing a curve *is* what the kind does, and
 * defects still occur but are mixed in rather than making up the whole band.
 *
 * So 0.85 is a line through a gradient, not a boundary between right and wrong.
 * `manager` and `boss` are a real defect and sit at 0.77, below it. Moving the
 * line to 0.75 buys those and costs two hundred cards of families that are
 * working as intended. The trade is worth taking in one direction only, which
 * is why the band under the line is kept visible rather than discarded.
 *
 * `--thresholds` prints the count at several, because re-deciding the line is
 * a legitimate thing to want to do and the numbers should be on the page.
 *
 * The allowlist (lib/skeleton-allow.js) is a module so the argument for each
 * case sits next to the case. It is the easiest thing in this file to abuse, so
 * it is kept to two arguments where the picture *is* the word, and the largest
 * group of near-duplicates — 52 pairs of different words sharing an English
 * base, none of them excusable — is reported as its own number rather than
 * folded into the total.
 */
'use strict';
const { loadDeck } = require('./lib/deck');
const { skeletonOf, marksOf, similarity } = require('./lib/skeleton');
const allow = require('./lib/skeleton-allow');

/* Accepts both `--by kind` and `--by=kind`: a flag that takes a value should
   work the way it reads. */
const arg = (name) => {
  const i = process.argv.findIndex((a) => a === '--' + name || a.startsWith('--' + name + '='));
  if (i === -1) return null;
  const eq = process.argv[i].indexOf('=');
  if (eq !== -1) return process.argv[i].slice(eq + 1);
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
};
const LIST = arg('list') !== null;
const BY = arg('by');
const nearArg = arg('near');

/** The line. See the note above for why it sits here and not elsewhere. */
const DEFAULT_T = 0.85;

loadDeck();
const D = global.window.LLC.data;
const A = global.window.LLC.art;
const RECIPES = A.recipes();

const cards = D.words.map((w) => ({
  id: w.id, cat: w.cat, kind: (RECIPES[w.id] || {}).k || 'hand-drawn'
}));

/* The allowlist is in two parts. `hand` is a written judgement, one line per
   case with the argument beside it. `synonyms` is computed from the data — two
   cards carrying the same Portuguese word cannot be told apart by a picture,
   because the learner's own language does not tell them apart. Both are applied
   here so the grouping code has a single set to work against. */
const WORDS = Object.fromEntries(D.words.map((w) => [w.id, w.w]));
const hand = new Set(allow.hand);
const syn = allow.synonyms(WORDS);          // groups, not a flat set
const synIds = new Set([...syn].flatMap((g) => [...g]));

const skel = new Map(cards.map((c) => [c.id, skeletonOf(A.get(c.id))]));
const marks = new Map(cards.map((c) => [c.id, marksOf(A.get(c.id))]));

/* ------------------------------------------------------------------ grouping */

function groupBySkeleton() {
  const by = new Map();
  for (const c of cards) {
    if (hand.has(c.id)) continue;
    const k = skel.get(c.id);
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(c.id);
  }
  return [...by.values()].filter((g) => g.length > 1);
}

function groupBySimilarity(t) {
  const parent = new Map(cards.map((c) => [c.id, c.id]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); };

  /* Only the hand list removes a card from consideration entirely: it is a
     per-card statement that this card's picture is *supposed* to be shared, so
     there is nothing to report about it. */
  const live = cards.filter((c) => !hand.has(c.id));
  for (let i = 0; i < live.length; i++) {
    for (let j = i + 1; j < live.length; j++) {
      const a = live[i].id, b = live[j].id;
      const s = skel.get(a) === skel.get(b) ? 1 : similarity(marks.get(a), marks.get(b));
      if (s >= t) union(a, b);
    }
  }
  const byRoot = new Map();
  for (const c of live) {
    const r = find(c.id);
    if (!byRoot.has(r)) byRoot.set(r, []);
    byRoot.get(r).push(c.id);
  }
  return [...byRoot.values()].filter((g) => g.length > 1);
}

/**
 * Whether a pair is one the deck is allowed to get wrong.
 *
 * Per pair, not per card, and the difference matters. The synonym rule excuses
 * *two cards that are one word in Portuguese* from looking alike — it says
 * nothing about either of them against a third card. Dropping every synonym
 * card from consideration wholesale excused 30 groups the rule has no claim to,
 * because each of those groups also held a pair the rule does not cover.
 */
function excusedPair(a, b) {
  return hand.has(a) || hand.has(b) || allow.sameWord(syn, a, b);
}

/** Groups that still contain at least one pair nobody has an answer for. */
function reportable(groups) {
  return groups.filter((g) => {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) if (!excusedPair(g[i], g[j])) return true;
    }
    return false;
  });
}

/* -------------------------------------------------------------------- report */

const kindOf = (id) => cards.find((c) => c.id === id).kind;
const catOf = (id) => cards.find((c) => c.id === id).cat;

function tally(groups, key) {
  const per = new Map();
  for (const g of groups) for (const id of g) {
    const k = key(id);
    per.set(k, (per.get(k) || 0) + 1);
  }
  return [...per.entries()].sort((a, b) => b[1] - a[1]);
}

const near = nearArg !== null || arg('exact') === null;
const threshold = nearArg === true || nearArg === null ? DEFAULT_T : Number(nearArg);
/* Grouped once and filtered afterwards. Two separate calls build two sets of
   arrays, and `Array.includes` compares references — the `--excused` view then
   reports every group as dropped, which is how a bug in the excuse rule
   managed to look like a legitimate one. */
const all = near ? groupBySimilarity(threshold) : groupBySkeleton();
const groups = reportable(all);
const affected = groups.reduce((n, g) => n + g.length, 0);

/* ---------------------------------------------------------------- breakdown */

/**
 * How much of the count is a pair of *different words* sharing one drawing.
 *
 * This is reported apart rather than allowed away, because the two need
 * different work: a genuine near-duplicate inside a kind is a parameter to
 * add, while a homograph pair is two words that were never distinguished in the
 * first place and need one of them redrawn from scratch.
 */
const homo = allow.homographs(WORDS);
const homoPairs = new Map();
for (const g of homo) for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
  homoPairs.set(g[i] + '|' + g[j], g);
  homoPairs.set(g[j] + '|' + g[i], g);
}
const inHomo = new Set();
let homoGroups = 0;
for (const g of groups) {
  for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
    if (homoPairs.has(g[i] + '|' + g[j])) { homoGroups++; g.forEach((x) => inHomo.add(x)); }
  }
}

/* ------------------------------------------------------------------ report */

if (BY === 'kind' || BY === 'category') {
  const key = BY === 'kind' ? kindOf : catOf;
  console.log((BY === 'kind' ? 'by kind' : 'by category') +
    (near ? ' (similarity >= ' + threshold + ')' : ' (identical skeleton)') + '\n');
  let total = 0;
  for (const [k, n] of tally(groups, key)) {
    total += n;
    console.log('  ' + String(n).padStart(4) + '  ' + k);
  }
  console.log('  ----\n  ' + String(total).padStart(4) +
    ' cards in ' + groups.length + ' groups');
  process.exit(groups.length ? 1 : 0);
}

console.log((near ? 'near-identical, similarity >= ' + threshold : 'identical skeleton') +
  ':  ' + groups.length + ' groups, ' + affected + ' cards');
console.log('  groups holding a homograph pair   ' + String(homoGroups).padStart(4) +
  '   (different words, one drawing — all work, none excusable)');
console.log('  cards in a homograph pair         ' + String(inHomo.size).padStart(4));
console.log('  allowlisted, written judgement    ' + String(hand.size).padStart(4) + ' ids' +
  '   (' + Object.keys(allow.reasons).map((k) => k.toLowerCase() + ' ' + allow.reasons[k].length).join(', ') + ')');
console.log('  allowlisted, one Portuguese word  ' + String(synIds.size).padStart(4) +
  ' ids in ' + syn.length + ' groups   (computed from the data)');

if (arg('thresholds') !== null) {
  console.log('\nat several lines:');
  for (const t of [1, 0.94, 0.9, 0.85, 0.8, 0.75, 0.7]) {
    const g = reportable(t >= 1 ? groupBySkeleton() : groupBySimilarity(t));
    console.log('  >= ' + t.toFixed(2) + (t === DEFAULT_T ? '  <- the line' : '        ') + '  ' +
      String(g.length).padStart(4) + ' groups  ' +
      String(g.reduce((n, x) => n + x.length, 0)).padStart(4) + ' cards');
  }
}

if (arg('excused') !== null) {
  console.log('\ngroups the allowlist drops — every pair in each is excused. Audit these, do not trust them:');
  const dropped = all.filter((g) => !groups.includes(g));
  if (!dropped.length) console.log('  (none)');
  for (const g of dropped.sort((a, b) => b.length - a.length)) {
    const how = g.every((id) => hand.has(id)) ? 'hand' : 'one Portuguese word';
    console.log('  . ' + g.join(' ') + '   [' + how + ': ' +
      g.map((id) => (WORDS[id] ? WORDS[id].pt : '?')).join(' / ') + ']');
  }
}

if (arg('homographs') !== null) {
  console.log('\ndifferent words sharing an English base, one drawing each:');
  for (const g of homo.sort((a, b) => b.length - a.length)) {
    console.log('  x ' + g.map((id) => id + ' (' + D.words.find((w) => w.id === id).w.pt + ')').join('  /  '));
  }
}

if (LIST) {
  console.log('\nworst kinds: ' +
    tally(groups, kindOf).slice(0, 8).map(([k, n]) => k + ' ' + n).join(', '));
  for (const g of groups.sort((a, b) => b.length - a.length)) {
    console.log('  x ' + g.join(' '));
  }
}

process.exit(groups.length ? 1 : 0);
