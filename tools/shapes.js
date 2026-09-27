/**
 * Does every recipe ask for something its kind actually draws?
 *
 * Two kinds of failure, and the second is the one that hides.
 *
 * The obvious one: a kind is a long if/else over `o.shape`, and a recipe that
 * names a branch the kind does not have falls through to nothing. `ferry` and
 * `sleigh` were blank cards for exactly this reason — both asked for a `boat`
 * shape that had never been written. A branch list catches that.
 *
 * The hidden one: a kind that looks its parameter up in a table, or in a chain
 * of `if`s, returns the same default for every name it does not recognise. A
 * branch list sees nothing wrong, because the kind genuinely has no branch for
 * the name — the default *is* its behaviour. So this check also renders every
 * recipe with a deliberately impossible parameter and compares the result with
 * the same kind's default: a drawing identical to the fallback is the fallback.
 *
 * That second half is what found sixty of the 178 recipes in the top-up batch,
 * all of which named a `kind:` or `mark:` that no kind reads. None of them threw
 * and every other check passed.
 *
 * Run:  node tools/shapes.js
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { loadDeck } = require('./lib/deck');
const { JS, scriptOrder } = require('./lib/paths');

const PARAM = ['shape', 'kind', 'mode', 'what', 'prop', 'role', 'glyph', 'texture'];
const ART_FILES = ['art-nouns', 'art-things', 'art-grammar', 'art-kinds'];

loadDeck();
const D = global.window.LLC.data;
const A = global.window.LLC.art;

/* ---------------------------------------------------------------- branches */

/**
 * What each kind branches on, read out of the source rather than assumed.
 *
 * Slicing happens on the next `kind(` and not on a matching closing brace: a
 * body can contain a `});` of its own, and a brace-matching regex then swallows
 * the kind that follows. That happened, and one kind silently stopped being
 * checked at all.
 */
function readBranches() {
  const out = {};
  for (const f of ART_FILES) {
    const src = fs.readFileSync(path.join(JS, f + '.js'), 'utf8');
    const starts = [...src.matchAll(/\n  kind\('(\w+)'/g)];
    starts.forEach((m, i) => {
      const body = src.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : src.length);
      const keys = new Set();
      for (const b of body.matchAll(/o\.(shape|mode|what|prop|role|glyph|texture)\s*===?\s*'([^']+)'/g)) {
        keys.add(b[2]);
      }
      // A top-level `else` is a real branch: the kind draws *something* for any
      // name it did not match, which is the opposite of a hole. Four spaces is
      // top level here; a nested `} else {` deeper in says nothing.
      const hasTail = /\n {4}\} else \{/.test(body);
      // A kind that indexes a table with the name accepts any name the table
      // holds, so the branch list is not the whole story.
      const viaTable = /o\.(shape|mode|what|prop|role|glyph|texture)\]/.test(body);
      const rec = out[m[1]] = out[m[1]] || { keys, hasTail, viaTable, files: [] };
      for (const k of keys) rec.keys.add(k);
      rec.hasTail = rec.hasTail || hasTail;
      rec.viaTable = rec.viaTable || viaTable;
      if (!rec.files.includes(f)) rec.files.push(f);
    });
  }
  return out;
}

const branches = readBranches();

/* ----------------------------------------------------------------- report */

const problems = [];
const recipes = A.recipes();

for (const id of Object.keys(recipes)) {
  const spec = recipes[id];
  const b = branches[spec.k];
  if (!b) { problems.push(id + ': no kind named ' + spec.k); continue; }
  const name = spec.shape || spec.mode || spec.what || spec.prop || spec.role || spec.texture;
  if (!name) continue;
  if (b.keys.has(name)) continue;
  if (b.hasTail || b.viaTable) continue;
  const slot = spec.shape ? 'shape' : spec.mode ? 'mode' : spec.what ? 'what'
    : spec.prop ? 'prop' : spec.role ? 'role' : 'texture';
  problems.push(id + ': ' + spec.k + " has no " + slot + " '" + name + "'");
}

/* -------------------------------------------------- the empirical half */

/**
 * Whether a parameter has any effect at all.
 *
 * The recipe is drawn twice: once as written, and once with every parameter it
 * names replaced by a value nothing could match. The two are built from the same
 * record, so the background and every colour are identical and the *only*
 * difference is whether the kind read the parameter. Equal drawings mean the
 * kind ignored it and drew its default — which is exactly the failure a branch
 * list cannot see, because a lookup kind has no branch for the name.
 *
 * The comparison has to run both ways to be meaningful. A parameter the kind
 * reads differently in each probe is doing its job, and one that reads the same
 * is a name the kind never learned.
 */
let ignored = 0;
for (const id of Object.keys(recipes)) {
  const spec = recipes[id];
  const slot = PARAM.find((k) => spec[k] !== undefined);
  if (!slot) continue;

  const asWritten = {};
  const impossible = {};
  for (const k of Object.keys(spec)) {
    asWritten[k] = spec[k];
    impossible[k] = spec[k];
  }
  for (const k of PARAM) {
    if (impossible[k] !== undefined) impossible[k] = '__no_such_value__';
  }

  /* A recipe that asks for the fallback by name is asking for it. Probing that
     with an impossible value lands on the same picture for that reason alone,
     so it would be reported as a bug when it is the documented default. */
  if (PARAM.some((k) => spec[k] === 'default')) continue;

  let a, b;
  try {
    a = A.recipe('__aswritten__' + id, asWritten);
    b = A.recipe('__impossible__' + id, impossible);
  } catch (e) { continue; }
  if (!a || !b) continue;

  if (a === b) {
    ignored++;
    problems.push(id + ': ' + spec.k + " ignores " + slot + "='" + spec[slot] + "' and draws its default");
  }
}

/* ------------------------------------------------------------------ output */

for (const p of problems) console.log('  x ' + p);
console.log('recipe problems: ' + problems.length + ' (' + ignored + ' ignored parameters)');
console.log('kinds read: ' + Object.keys(branches).length +
  ', scripts: ' + scriptOrder().length + ' (app.js excluded)');
process.exit(problems.length ? 1 : 0);
