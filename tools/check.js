/**
 * The gate: everything about the deck that must be true, checked in one place.
 *
 * Run:  node tools/check.js
 *
 * DECK     the word count is pinned, no category is empty
 * LABELS   every group caption, category label and type name resolves, in all
 *          three languages, and every word is in a known category
 * WORDS    no blank translation, no two words the same entry in all three
 * ARTWORK  every word draws, nothing falls back to generated geometry, no two
 *          words share a drawing, every path begins with a command
 *
 * The word count is pinned rather than derived because a decision was made
 * about it: the deck is 2000 words, and a word silently lost to an id collision
 * is a decision undone without anybody noticing. `drop.js` finds the collisions;
 * this is the check that would notice the consequence.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadDeck } = require('./lib/deck');
const { TOOLS } = require('./lib/paths');

const EXPECTED_WORDS = 2000;
const EXPECTED_CATEGORIES = 53;
const EXPECTED_KINDS = 83;

/* The deliberate exception: two cards that are the same entry in all three
   languages, on purpose. *Orange* the fruit and *orange* the colour are one
   English word doing two jobs, and a deck offering only one of them teaches an
   English speaker's shortcut. That is a different claim from "I ran out of
   ideas", which is why it is written down rather than tolerated. */
const HOMOGRAPHS = new Set(['orange', 'orangefruit']);

let fails = 0;
const fail = (m) => { console.log('  x ' + m); fails++; };
const ok = (m) => console.log('  ok  ' + m);

loadDeck();
const LLC = global.window.LLC;
const D = LLC.data;
const A = LLC.art;

/* --------------------------------------------------------------- DECK */

console.log('\nDECK');
if (D.words.length !== EXPECTED_WORDS) fail('deck has ' + D.words.length + ' words, expected ' + EXPECTED_WORDS);
else ok(D.words.length + ' words');
if (D.categories.length !== EXPECTED_CATEGORIES) fail('categories: ' + D.categories.length);
else ok(D.categories.length + ' categories, ' + D.groups.length + ' groups, ' + D.types.length + ' types');

const empty = D.categories.filter((c) => !D.words.some((w) => w.cat === c.id));
if (empty.length) fail('categories with no words: ' + empty.map((c) => c.id).join(' '));
else ok('every category has words');

const ids = D.words.map((w) => w.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) fail('repeated ids: ' + [...new Set(dupes)].join(' '));
else ok('every id is unique');

/* -------------------------------------------------------------- LABELS */

console.log('\nLABELS');
for (const lang of LLC.i18n.available) {
  for (const g of D.groups) {
    if (D.groupName(g.id, lang) === g.id) fail(lang + ' has no caption for group ' + g.id);
  }
  for (const c of D.categories) {
    if (D.categoryName(c.id, lang) === c.id) fail(lang + ' has no label for category ' + c.id);
  }
  LLC.i18n.set(lang);
  for (const t of D.types) {
    if (LLC.i18n.t('type.' + t) === 'type.' + t) fail(lang + ' has no name for type ' + t);
  }
}
ok('every group caption, category label and type name resolves in all languages');

const usedTypes = new Set(D.words.map((w) => w.type));
const undeclared = [...usedTypes].filter((t) => !D.types.includes(t));
if (undeclared.length) fail('words carry a part of speech the deck does not declare: ' + undeclared.join(' '));
else ok('every word carries a declared part of speech');

/* --------------------------------------------------------------- WORDS */

console.log('\nWORDS');
const blanks = D.words.filter((w) => D.languageIds.some((l) => !(w.w[l] || '').trim()));
if (blanks.length) fail(blanks.length + ' words have a blank translation: ' + blanks.slice(0, 6).map((w) => w.id).join(' '));
else ok('no blank translations');

const unknownCat = D.words.filter((w) => !D.categories.some((c) => c.id === w.cat));
if (unknownCat.length) fail(unknownCat.length + ' words in an unknown category');
else ok('every word is in a known category');

const seen = new Map();
const dupEntries = [];
const homographs = [];
for (const w of D.words) {
  const key = D.languageIds.map((l) => (w.w[l] || '').trim().toLowerCase()).join('|');
  if (seen.has(key)) {
    const other = seen.get(key);
    if (HOMOGRAPHS.has(other) && HOMOGRAPHS.has(w.id)) homographs.push(other + '/' + w.id);
    else dupEntries.push(other + ' == ' + w.id);
  } else seen.set(key, w.id);
}
if (dupEntries.length) fail(dupEntries.length + ' duplicated entries: ' + dupEntries.join('; '));
else ok('no duplicated entries' + (homographs.length ? ' (homographs kept: ' + homographs.join(', ') + ')' : ''));

/* A translation in the wrong script. `dutyfree` was found carrying
   "loja免税" in the Portuguese field — Chinese characters in a column where
   every other one of the 2000 rows is Portuguese. Nothing throws, the card
   renders, and the word is simply unreadable to the one reader the app is for. */
const WRONG_SCRIPT = /[Ѐ-ӿ一-鿿぀-ヿ가-힯]/;
const alien = D.words.filter((w) => D.languageIds.some((l) => WRONG_SCRIPT.test(w.w[l] || '')));
if (alien.length) {
  fail(alien.length + ' translations in the wrong script: ' +
    alien.map((w) => w.id + ' (' + D.languageIds.filter((l) => WRONG_SCRIPT.test(w.w[l] || '')).join(',') +
      ' = "' + D.languageIds.map((l) => w.w[l]).find((x) => WRONG_SCRIPT.test(x)) + '")').join('; '));
} else ok('every translation is in its own script');

/* `add()` keeps the first definition of an id and skips the rest without a word.
   It is the only failure that loses vocabulary silently, so it has its own
   script, which loads each theme file on its own to see the collisions the
   combined load would hide. */
try {
  execFileSync(process.execPath, [path.join(TOOLS, 'drop.js')], { stdio: 'inherit' });
  ok('every row a themes-*.js file declares reached the deck');
} catch (e) {
  fail('a themes-*.js file lost a word (see above)');
}

/* ------------------------------------------------------------- ARTWORK */

console.log('\nARTWORK');
if (A.kinds().length !== EXPECTED_KINDS) fail('kinds: ' + A.kinds().length + ', expected ' + EXPECTED_KINDS);
else ok(A.kinds().length + ' kinds, ' + Object.keys(A.recipes()).length + ' recipes');

const drawings = new Map();
const fallback = [];
const thrown = [];
const bare = [];
const noMoveTo = [];
const sameDrawing = [];
const SPEC = {};
for (const w of D.words) {
  let svg;
  try { svg = A.get(w.id); } catch (e) { thrown.push(w.id); continue; }
  if (!svg) { thrown.push(w.id); continue; }
  if (svg === A.fallback(w.id)) fallback.push(w.id);
  if ((svg.match(/<(circle|rect|ellipse|path|polygon|line|polyline)\b/g) || []).length < 3) bare.push(w.id);
  if (/<(path|polygon|polyline)\b[^>]*\bd="(?!\s*[Mm])/.test(svg)) noMoveTo.push(w.id);
  const prev = drawings.get(svg);
  if (prev) sameDrawing.push(prev + ' == ' + w.id);
  else drawings.set(svg, w.id);
}
const specFailures = A.specFailures();
const artFailures = A.failures();

/* A recipe for a word the deck does not have. Every other check here walks the
   *words*, so a recipe nobody will ever look at is invisible to all of them.

   There were 55. The pattern was a rename: a word needed a distinct id to stop
   colliding with the core deck, so `level` became `level2` and `enormous2` took
   the place of `enormous`, and the recipe written for the old id was left behind
   drawing nothing. Some were worse than dead — `gatepost` drew a gate post
   while the live `gate` card drew an envelope, and `scale2` (balança) was drawn
   as a cash till. Both were only visible because a dead recipe was sitting next
   to them with a better drawing in it.

   A failure, not a note, because it is now zero and the whole point is that it
   stays zero. */
const wordIds = new Set(D.words.map((w) => w.id));
const deadRecipes = Object.keys(A.recipes()).filter((id) => !wordIds.has(id));
if (deadRecipes.length) fail(deadRecipes.length + ' recipes for ids the deck does not have: ' + deadRecipes.join(' '));
else ok('every recipe belongs to a word');

if (thrown.length) fail(thrown.length + ' cards threw while drawing: ' + thrown.slice(0, 6).join(' '));
else ok('no card threw while drawing');
if (specFailures.length) fail(specFailures.length + ' recipes failed: ' + specFailures.slice(0, 6).map((x) => x.id + ' (' + x.error + ')').join(', '));
else ok('every recipe drew without recording a failure');
if (artFailures.length) fail(artFailures.length + ' hand-drawn entries failed: ' + artFailures.slice(0, 6).map((x) => x.id).join(' '));
else ok('no hand-drawn entry failed');
if (fallback.length) fail(fallback.length + ' words on the generated fallback: ' + fallback.slice(0, 8).join(' '));
else ok('no word falls back to generated geometry');
if (bare.length) fail(bare.length + ' cards drew nothing but their shadow: ' + bare.join(' '));
else ok('every card drew something');
if (noMoveTo.length) fail(noMoveTo.length + ' drawings contain a path with no moveto: ' + [...new Set(noMoveTo)].join(' '));
else ok('every path begins with a command, so nothing is silently dropped');
if (sameDrawing.length) fail(sameDrawing.length + ' pairs share a drawing: ' + sameDrawing.slice(0, 10).join('; '));
else ok('every drawing is distinct');

console.log('\nFAIL: ' + fails);
process.exit(fails ? 1 : 0);
