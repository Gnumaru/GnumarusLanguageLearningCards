/**
 * A recipe registered twice: the later one silently replaces the earlier.
 *
 *   node tools/duplicates.js
 *
 * `LLC.art.spec(map)` assigns into one table, so two blocks registering the same
 * id do not collide loudly — the second simply wins, and whichever was written
 * first is gone with nothing saying so.
 *
 * The case that matters is when the two name **different kinds or shapes**, which
 * means one of them draws a different object. There were nine, and the one that
 * started this was `gate`: a `house` block drew a gate as a wall panel, a `travel`
 * block drew one as an office letter, and because the travel block is registered
 * later the card for *portão* was an **envelope**. The other eight were the same
 * disease with a different symptom.
 *
 * A duplicate whose two entries are identical is harmless and is reported as such.
 * A duplicate where only the background tint differs is a mismatch, not a wrong
 * picture: the category in `r(cat, spec)` only chooses the background colour.
 *
 * A stale entry that shadows a live one is a silent, permanent loss and this is
 * the only thing that can see it — `check.js` walks the deck after registration
 * and by then the loser is gone.
 */
'use strict';
const fs = require('node:fs');
const { loadDeck } = require('./lib/deck');
const { JS, scriptOrder } = require('./lib/paths');

loadDeck();
const D = global.window.LLC.data;
const by = Object.fromEntries(D.words.map((w) => [w.id, w]));

/* The spec files, in the order index.html loads them. Order is the whole point:
   a duplicate is only a problem because of which one wins. */
const specFiles = scriptOrder().filter((f) => /^art-specs-.*\.js$/.test(f));

/** Every `    name: r('cat', { ... })` entry, with the file and line it is on. */
function registrations() {
  const all = new Map();
  for (const f of specFiles) {
    const src = fs.readFileSync(JS + '/' + f, 'utf8');
    src.split('\n').forEach((line, i) => {
      const m = line.match(/^ {4}([A-Za-z0-9_]+):\s+r\('([a-z]+)',\s*\{\s*k:\s*'(\w+)'(?:\s*,\s*shape:\s*'(\w+)')?/);
      if (!m) return;
      if (!all.has(m[1])) all.set(m[1], []);
      all.get(m[1]).push({
        file: f, line: i + 1, cat: m[2], k: m[3], shape: m[4] || '',
        text: line.trim()
      });
    });
  }
  return all;
}

const all = registrations();
const dups = [...all].filter(([, v]) => v.length > 1);

/**
 * The cases where the winner is not just *different* but **wrong**, each with
 * the reason. This is an allowlist in reverse: it holds the ones still to fix,
 * and it shrinks as they are fixed.
 *
 * A different kind is not on its own a fault. `wallet` is registered once as an
 * accessory and once as money and the money one wins — a wallet drawn as a
 * money wallet is right, and the same goes for `wheelbarrow` (a barrow is a
 * wheelbarrow), `root` (a root ball is a root) and `sideboard` (a sideboard is
 * a cabinet). Five of the eleven were looked at and the winner is the better
 * drawing of the same object; one was an envelope.
 */
const CONFIRMED_WRONG = {
  // empty on purpose. The five that were here — bat, compass, depth, column, mask
  // — are fixed, and the table stays so that a reintroduction is a failure with
  // the reason still written down. The same argument the allowlist in
  // `lib/skeleton-allow.js` makes.
};

let identical = 0, tintOnly = 0, differentObject = 0, wrong = 0;

console.log('spec files in load order: ' + specFiles.length +
  '   (order decides which duplicate wins, so it is read, not assumed)\n');

for (const [id, entries] of dups.sort()) {
  const winner = entries[entries.length - 1];
  const losers = entries.slice(0, -1);
  const kinds = new Set(entries.map((e) => e.k));
  const word = by[id];
  const bad = CONFIRMED_WRONG[id];

  let kind;
  if (kinds.size === 1 && new Set(entries.map((e) => e.k + e.shape + e.text.slice(-14))).size === 1) {
    kind = 'identical';
    identical++;
  } else if (kinds.size === 1) { kind = 'same kind, other tint'; tintOnly++; }
  else { kind = 'DIFFERENT OBJECT'; differentObject++; }
  if (bad) wrong++;

  console.log('  ' + (bad ? 'x' : '.') + ' ' + id.padEnd(14) + kind.padEnd(24) +
    (word ? word.cat.padEnd(12) : '(no word)'.padEnd(12)) +
    'wins: ' + winner.k + '/' + winner.shape + '  (' + winner.file + ':' + winner.line + ')');
  if (bad) console.log('        WRONG: ' + bad);
  for (const l of losers) {
    console.log('        shadowed: ' + l.k + '/' + l.shape + '  (' + l.file + ':' + l.line + ')');
  }
}

console.log('\nduplicate keys: ' + dups.length +
  '   identical: ' + identical +
  '   same kind, other tint: ' + tintOnly +
  '   a different object: ' + differentObject);
console.log('confirmed to draw the wrong thing: ' + wrong +
  '  of ' + Object.keys(CONFIRMED_WRONG).length + ' on the to-fix list');

/* There were 24. One recipe per id is now a failure rather than a note, because it
   is zero and the point is that it stays zero — the same treatment the dead
   recipes got, and for the same reason: a stale entry is a silent, permanent
   loss, and it is only ever added by someone who does not know it is there. */
if (dups.length) {
  console.log('\nevery key must be registered exactly once: ' + dups.length + ' are not');
  process.exit(1);
}
process.exit(0);
