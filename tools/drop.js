/**
 * Which words does a themes-*.js file actually deliver?
 *
 *   node tools/drop.js [file ...]
 *
 * `LLC.data.add()` keeps the first definition of an id and skips every later one
 * without a word, so a theme that reuses an id just loses a word. Nothing
 * reports that: the file parses, the row count looks right, and the card is
 * simply not there. This is the only detector.
 *
 * The check has to compare the deck *before* a file with the deck *after* it.
 * Asking "is this id in the deck?" cannot tell a delivered row from a dropped
 * one — both look present. Two earlier versions of this file made that mistake
 * and reported 184 delivered rows when 49 had been dropped, and sat on seven dead
 * rows in an earlier batch for the whole of its life.
 *
 * Two failures are reported, and they are different:
 *
 *   lost    the id was already owned by an earlier file, so this row was skipped
 *   twin    the id is new but pt/en/es is an entry the deck already teaches
 *
 * A twin is the one that hides: it passes every count and teaches the same card
 * twice under two names.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadDeckInChild, JS, scriptOrder } = require('./lib/deck');
const { TOOLS } = require('./lib/paths');

const ROW = /^\s*\['(\w+)',\s*'(\w+)',\s*'(\w+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\]/gm;

const order = scriptOrder();
const dataFiles = order.filter((f) => f.startsWith('data/'));
const themeFiles = process.argv.length > 2
  ? process.argv.slice(2).map((f) => 'data/' + f.replace(/^data\//, ''))
  : dataFiles.filter((f) => /^data\/themes-.*\.js$/.test(f));

/** What the deck already owns before `f` is loaded. */
function ownedBefore(f) {
  const upto = dataFiles.slice(0, dataFiles.indexOf(f));
  const { words } = loadDeckInChild(upto);
  return {
    ids: words.map((w) => w.id),
    triples: words.map((w) => [w.w.pt, w.w.en, w.w.es].join('|'))
  };
}

let fails = 0;
for (const f of themeFiles) {
  const name = f.replace('data/', '');
  const rows = [...fs.readFileSync(path.join(JS, f), 'utf8').matchAll(ROW)].map((m) => m.slice(1, 7));
  const ids = rows.map((r) => r[0]);

  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  const { ids: owned, triples: ownedTriples } = ownedBefore(f);
  const ownedSet = new Set(owned);
  const tripleSet = new Set(ownedTriples);

  const lost = ids.filter((id) => ownedSet.has(id));
  const twin = rows
    .filter((r) => !ownedSet.has(r[0]) && tripleSet.has([r[3], r[4], r[5]].join('|')))
    .map((r) => r[0]);

  if (dupes.length) {
    console.log('  x ' + name + ' declares ' + [...new Set(dupes)].join(', ') + ' twice');
    fails += new Set(dupes).size;
  }
  if (lost.length) {
    console.log('  x ' + name + ' declares ' + lost.length + ' id(s) the deck already owns; ' +
      lost.length + ' row(s) were dropped:');
    console.log('      ' + lost.join(' '));
    fails += lost.length;
  }
  if (twin.length) {
    console.log('  x ' + name + ' adds ' + twin.join(', ') +
      ' as a second copy of an entry the deck already teaches');
    fails += twin.length;
  }
  if (!lost.length && !dupes.length && !twin.length) {
    console.log('  ok ' + name + ': all ' + ids.length + ' rows reached the deck');
  }
}
console.log('dropped or duplicated rows: ' + fails);
process.exit(fails ? 1 : 0);
