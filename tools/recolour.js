/**
 * Cards that are the same picture, and which kinds are responsible.
 *
 *   node tools/recolour.js [--list] [--near[=T]] [--by kind|category] [--thresholds]
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
 * Calibrated against pairs whose relationship is known: the ones that were
 * fixed (a stool and a drum table, a basement and a cellar) score 0.18–0.88,
 * and the ones still identical (a hurricane and a typhoon, an oval and a
 * diameter) score exactly 1.000. So 0.94 is a reasonable "you would not tell
 * these apart" line, and --near=0.85 is where the related-but-confusable band
 * starts. `--thresholds` prints the count at several, because which line to draw
 * is a judgement about what the deck is for, not something to settle by picking
 * a number.
 *
 * The allowlist (lib/skeleton-allow.js) is a module so the argument for each
 * case sits next to the case: a colour card *is* a swatch of that colour, and a
 * rhombus really is a diamond. Two arguments, two entries.
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
const DEFAULT_T = 0.94;

loadDeck();
const D = global.window.LLC.data;
const A = global.window.LLC.art;
const RECIPES = A.recipes();

const cards = D.words.map((w) => ({
  id: w.id, cat: w.cat, kind: (RECIPES[w.id] || {}).k || 'hand-drawn'
}));
const skel = new Map(cards.map((c) => [c.id, skeletonOf(A.get(c.id))]));
const marks = new Map(cards.map((c) => [c.id, marksOf(A.get(c.id))]));
const allowed = new Set(allow);

/* ------------------------------------------------------------------ grouping */

function groupBySkeleton() {
  const by = new Map();
  for (const c of cards) {
    const k = skel.get(c.id);
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(c.id);
  }
  return [...by.values()].filter((g) => g.filter((id) => !allowed.has(id)).length > 1);
}

function groupBySimilarity(t) {
  const parent = new Map(cards.map((c) => [c.id, c.id]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); };

  const live = cards.filter((c) => !allowed.has(c.id));
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

const near = nearArg !== null;
const threshold = nearArg === true || nearArg === null ? DEFAULT_T : Number(nearArg);
const groups = near ? groupBySimilarity(threshold) : groupBySkeleton();
const affected = groups.reduce((n, g) => n + g.length, 0);

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

console.log((near ? 'near-identical (>= ' + threshold + ')' : 'identical skeleton') +
  ': ' + groups.length + ' groups, ' + affected + ' cards');
console.log('allowlisted as deliberate: ' + allow.length + ' ids');

if (arg('thresholds') !== null) {
  console.log('\nat several lines:');
  for (const t of [1, 0.98, 0.94, 0.9, 0.85, 0.8, 0.7]) {
    const g = t >= 1 ? groupBySkeleton() : groupBySimilarity(t);
    console.log('  >= ' + t.toFixed(2) + '  ' + String(g.length).padStart(4) + ' groups  ' +
      String(g.reduce((n, x) => n + x.length, 0)).padStart(4) + ' cards');
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
