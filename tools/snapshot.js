/**
 * Render every card once and write the markup out, so the offline validators
 * and the contact-sheet builder have something to read.
 *
 * The load order is read out of index.html rather than sorted by filename: the
 * themed data and the recipe files all register under the same ids and the last
 * registration wins, so a harness that loads them in a different order sees a
 * different deck than the browser does. That is a quiet way to test the wrong
 * thing — every check passes and the app is still broken.
 *
 * Output: tools/.out/cards.json
 *
 * Run:  node tools/snapshot.js
 */
'use strict';
const fs = require('node:fs');
const { loadDeck } = require('./lib/deck');
const { out } = require('./lib/paths');

const files = loadDeck();
const D = global.window.LLC.data;
const A = global.window.LLC.art;

const cards = D.words.map((w) => ({ id: w.id, cat: w.cat, type: w.type, svg: A.get(w.id) }));
const target = out('cards.json');
fs.writeFileSync(target, JSON.stringify(cards));

const empty = cards.filter((c) => !c.svg || c.svg.length < 40);
console.log('wrote ' + cards.length + ' cards to ' + target.replace(process.cwd() + '/', ''));
console.log('loaded ' + files.length + ' scripts in index.html order' +
  (empty.length ? '  (' + empty.length + ' card(s) drew nothing)' : ''));
if (empty.length) {
  empty.slice(0, 10).forEach((c) => console.log('  x ' + c.id));
  process.exit(1);
}
