/**
 * The tables a kind looks its answer up in, and whether they say anything.
 *
 *   node tools/tables.js
 *
 * `shapes.js` probes a *recipe*: it draws the card, draws it again with an
 * impossible parameter, and reports the two as equal when the kind ignored what
 * it was told. That catches a recipe asking for a shape nobody drew.
 *
 * It cannot see the layer below. A kind like `roleFigure` draws nothing itself —
 * it looks the name up in the `ROLE` table and hands the entry to a shared
 * figure. So a recipe can be perfectly correct and still come out wrong, because
 * a field *in the table* is dead. Two were:
 *
 *   R.badge   1 entry   — `roleFigure` read `o.badge`, never `R.badge`
 *   R.prop   52 entries  — the same, and every one of those figures came out
 *                          with an empty hand: a postman with no letter, a
 *                          butcher with no cleaver, a teacher with no clipboard
 *
 * Fifty-three cards. No exception thrown, no duplicate markup, every other check
 * green, and `person` and `employee` drawing byte-identical pictures. Nothing in
 * the harness looked at a table, so nothing looked.
 *
 * Two questions, one static and one empirical.
 *
 * **Is any field dead?** A field the table sets that the drawing never reads.
 * Checked by finding the local the lookup result is bound to — `var R = ROLE[o.role]`
 * — and looking for `R.<field>` anywhere in the file. The convention of naming
 * that local after the table is what makes this work; a second table with a
 * different convention reports every field dead, which is loud and obvious
 * rather than silent.
 *
 * **Does any entry draw the same as the fallback?** The lookup is
 * `TABLE[key] || TABLE.default`, so an entry that draws identically to the
 * default is indistinguishable from having no entry at all. Checked by drawing
 * the entry and drawing it again with a key no table holds.
 */
'use strict';
const fs = require('node:fs');
const { loadDeck } = require('./lib/deck');
const { JS } = require('./lib/paths');

loadDeck();
const A = global.window.LLC.art;
const SRC = fs.readFileSync(JS + '/art-kinds.js', 'utf8');

/**
 * Every `var NAME = {` block whose entries are plain objects.
 *
 * The block runs to the first `\n  };` at the declaration's own indentation. A
 * nested `};` inside an entry would end it early, and reading past that would
 * pick up the following function as if it were table data.
 */
function findTables() {
  const out = [];
  for (const m of SRC.matchAll(/^  var ([A-Z][A-Z0-9_]*) = \{/gm)) {
    const end = SRC.indexOf('\n  };', m.index);
    if (end === -1) continue;
    const entries = [];
    for (const e of SRC.slice(m.index + m[0].length, end).matchAll(/^\s{4}'?([\w-]+)'?\s*:\s*\{([^}]*)\}/gm)) {
      const fields = [];
      for (const f of e[2].matchAll(/([\w-]+)\s*:/g)) if (f[1]) fields.push(f[1]);
      entries.push({ key: e[1], fields: [...new Set(fields)] });
    }
    if (entries.length) out.push({ name: m[1], entries, at: m.index });
  }
  return out;
}

/**
 * How the table is reached: the local the entry is bound to, and the recipe
 * parameter that chooses it. `var R = ROLE[o.role] || ROLE.default` gives
 * `R`, `role`, and `default` — the last being the entry that is *meant* to draw
 * the same as an unknown key, so it cannot also be reported as a twin of one.
 */
function lookupFor(name) {
  const m = SRC.match(new RegExp('var\\s+(\\w+)\\s*=\\s*' + name + '\\s*\\[\\s*o\\.(\\w+)\\s*\\]\\s*(?:\\|\\|\\s*' +
    name + '\\.(\\w+)\\s*)?'));
  if (!m) return null;
  const owner = [...SRC.slice(0, m.index).matchAll(/\n  kind\('(\w+)'/g)].pop();
  return { local: m[1], selector: m[2], fallback: m[3] || null, kind: owner ? owner[1] : null };
}

const tables = findTables();
let problems = 0;
let fieldsChecked = 0;

if (!tables.length) {
  console.log('no object tables found — has the declaration format changed?');
  process.exit(1);
}

for (const t of tables) {
  const use = lookupFor(t.name);
  console.log('\n' + t.name + '  ' + t.entries.length + ' entries' +
    (use ? '  —  kind ' + use.kind + ' reads ' + t.name + '[o.' + use.selector + '] into ' + use.local : ''));

  if (!use) {
    console.log('  ! no lookup found; skipped');
    continue;
  }

  /* --- is any field dead? ------------------------------------------------ */

  const used = new Set();
  for (const m of SRC.matchAll(new RegExp('\\b' + use.local + '\\.(\\w+)', 'g'))) used.add(m[1]);

  const deadFields = new Map();
  for (const entry of t.entries) {
    for (const f of entry.fields) {
      fieldsChecked++;
      if (!used.has(f) && !deadFields.has(f)) deadFields.set(f, []);
      if (!used.has(f)) deadFields.get(f).push(entry.key);
    }
  }

  if (!deadFields.size) {
    console.log('  ok  every field the table sets is read by the drawing (' +
      [...new Set(t.entries.flatMap((e) => e.fields))].length + ' fields)');
  } else {
    for (const [field, keys] of deadFields) {
      console.log('  x ' + field + ' is set on ' + keys.length + ' entries and never read: ' + keys.join(' '));
      problems += keys.length;
    }
  }

  /* --- does any entry draw the same as the fallback? --------------------- */

  const base = A.recipe('__fallback__' + t.name, { k: use.kind, [use.selector]: '__no_such_entry__', bg: '#ffffff' });
  const twins = [];
  for (const entry of t.entries) {
    if (entry.key === use.fallback) continue;   // the fallback drawing the fallback
    const drawn = A.recipe('__entry__' + t.name + '__' + entry.key,
      { k: use.kind, [use.selector]: entry.key, bg: '#ffffff' });
    if (drawn === base) twins.push(entry.key);
  }
  if (!twins.length) {
    console.log('  ok  every entry draws something the fallback does not');
  } else {
    console.log('  x ' + twins.length + ' entries draw exactly the fallback: ' + twins.join(' '));
    problems += twins.length;
  }
}

console.log('\nfields checked: ' + fieldsChecked + '   problems: ' + problems);
process.exit(problems ? 1 : 0);
