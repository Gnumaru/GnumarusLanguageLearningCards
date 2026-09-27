/**
 * Load the deck the way the browser loads it.
 *
 * `app.js` is left out: it needs a document, and no offline check has any use
 * for the view layer. Everything else is required in index.html order, so what
 * the checks see is what the page builds.
 *
 * The deck is module-level state and cannot be unloaded, so a check that needs
 * to see the deck at an *earlier* state loads it again in a child process —
 * see drop.js, which does exactly that once per theme file.
 */
'use strict';
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { JS, ROOT, scriptOrder } = require('./paths');

/** Load the deck into this process and return the files loaded. */
function loadDeck() {
  const files = scriptOrder().filter((f) => f !== 'app.js');
  global.window = {};
  for (const f of files) require(path.join(JS, f));
  return files;
}

/** Load the deck in a child process and return its state as JSON. */
function loadDeckInChild(upto) {
  const files = upto || scriptOrder().filter((f) => f !== 'app.js');
  return JSON.parse(execFileSync(process.execPath, ['-e', `
    global.window = {};
    ${files.map((f) => 'require(' + JSON.stringify(path.join(JS, f)) + ');').join('\n    ')}
    const LLC = global.window.LLC;
    const D = LLC.data;
    const A = LLC.art;                      // absent when only data files loaded
    process.stdout.write(JSON.stringify({
      words: D.words.map(w => ({ id: w.id, cat: w.cat, type: w.type, w: w.w })),
      kinds: A ? A.kinds() : [],
      recipes: A ? A.recipes() : {}
    }));
  `], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
}

module.exports = { loadDeck, loadDeckInChild, ROOT, JS, scriptOrder };
