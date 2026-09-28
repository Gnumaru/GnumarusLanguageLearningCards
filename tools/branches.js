/**
 * A branch a kind declares that no recipe can reach.
 *
 *   node tools/branches.js [--list]
 *
 * `shapes.js` catches a *recipe* that names a shape its kind does not draw. It
 * cannot catch the other half, which is a *branch* in a kind that no recipe ever
 * points at — and that half is where the work is lost.
 *
 * It happened three times in one afternoon, and each time it looked fine:
 *
 *   `tool`/`club`       anchored on `crowbar`, which is not in `tool`
 *   `accessory`/`mask`  anchored on `podium`, which is in `school`
 *   `journey`/`compass` on `board`, which is declared in three kinds
 *
 * In each case the branch parsed, the lint stayed clean, and the card drew
 * nothing at all: 312 characters, a background and a shadow. `shapes.js` had no
 * reason to fire, because the recipe was still pointing at the old shape. The bug
 * lived in the gap between adding a branch and pointing a recipe at it, and no
 * check looks at a gap.
 *
 * A kind with a final `else` reaches every name, so its branches are exempt: the
 * fallback is a real answer, and a branch that only one word in the world would
 * ever want is not dead. A kind that looks its answer up in a table declares no
 * branches at all and is not reported either.
 *
 * This is a work list as much as a gate. A branch with no recipe is either
 * unfinished work — art done for a word that never arrived, which is worth
 * knowing about — or a leftover, which is worth knowing about more.
 */
'use strict';
const fs = require('node:fs');
const { loadDeck } = require('./lib/deck');
const { JS } = require('./lib/paths');

loadDeck();
const RECIPES = global.window.LLC.art.recipes();

/** The fields a branch can be on. The same list shapes.js reads. */
const FIELDS = ['shape', 'what', 'mode', 'mark', 'part', 'symbol', 'glyph', 'texture', 'prop',
  'role', 'variant', 'spot', 'route', 'landmark', 'side', 'face', 'style'];

/**
 * Every branch each kind declares, and whether it has a tail.
 *
 * Slicing runs to the next `kind(` and not to the matching brace: a body can
 * contain a `});` of its own, and brace-matching then swallows the kind after it.
 * That happened, and one kind silently stopped being checked.
 */
function branches() {
  const src = fs.readFileSync(JS + '/art-kinds.js', 'utf8');
  const starts = [...src.matchAll(/\n  kind\('(\w+)'/g)];
  const out = {};
  starts.forEach((m, i) => {
    const body = src.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : src.length);
    const set = new Set();
    for (const f of FIELDS) {
      for (const b of body.matchAll(new RegExp('o\\.' + f + "\\s*===\\s*'([^']+)'", 'g'))) {
        set.add(f + "='" + b[1] + "'");
      }
    }
    out[m[1]] = { branches: set, hasTail: /\n {4}\}? ?else \{/.test(body) };
  });
  return out;
}

/** Every (field, value) a recipe pairs with its kind, read from the live specs. */
function asked() {
  const map = {};
  for (const spec of Object.values(RECIPES)) {
    if (!spec || !spec.k) continue;
    if (!map[spec.k]) map[spec.k] = new Set();
    for (const f of FIELDS) {
      if (typeof spec[f] === 'string') map[spec.k].add(f + "='" + spec[f] + "'");
    }
  }
  return map;
}

/** `shape='jar'` -> `jar`. A greedy pattern over the quotes eats the value. */
const valueOf = (pair) => pair.slice(pair.indexOf('=') + 1).replace(/'/g, '');

/**
 * Branches that are deliberately unreachable: art finished for a word that has
 * not arrived, or a second drawing of something another kind already draws.
 *
 * This is an allowlist in reverse, and it is here for the same reason
 * `lib/skeleton-allow.js` exists — a table of exceptions is the easiest thing in
 * a tool to pad, so every row says what the branch is *for*, and every row was
 * checked against the deck rather than assumed. Several first-draft reasons here
 * were wrong: `lagoon` and `bay` were described as having no word, and both are
 * words that take a different branch. A reason that is a guess is worse than no
 * reason, because it stops the next person from looking.
 *
 * A new orphan fails. Fourteen rows, from four causes: five branches orphaned by
 * deleting a duplicate recipe, three second drawings of a word that lives on
 * another kind, four seascape landmarks whose words took a neighbouring branch,
 * and two finished art for words nobody has added.
 */
const WAITING = {
  'school:bag':
    'a satchel. `backpack` took `journey`/`bag`, and a school bag is a different object',
  'school:board':
    'a notice board. The name `board` is already doing three jobs — `whiteboard` takes it in `office`, and six arrival and departure words take it in `journey` — so this needs a word of its own',
  'school:deskpupil':
    'a person at a desk with a board behind. This was assumed to be the better drawing of `classroom` and is not: ' +
    'a classroom is the room, and `school`/`room` draws the room while this draws a person behind a desk. No word ' +
    'uses it. The name is a concatenation and would have to be one word if a word ever arrived for it',
  'school:geometry':
    'finished art for a `geometry` word that was removed; nothing in the deck uses a set-square and a protractor together',
  'tool:cart':
    'a garden cart. `wheelbarrow2` took the garden barrow, and a cart and a barrow are not the same thing',
  'plant:root':
    'roots in the ground. `root2` took the root ball, and a root ball is a plant in its pot rather than a root in soil',
  'groom:jar':
    'a second jar. `jar` is a kitchen word — pote / jar — and the `jar` kind already draws it',
  'groom:mirror':
    'a second mirror, and the one that belongs to this family: a round glass in a blue frame on a thin stem, among ' +
    'the toothpaste and the razor. `mirror` is drawn instead by `furniture`/`mirror`, the same round glass in a ' +
    'wooden frame on a foot. Both read as a mirror, the two drawings do not collide, and neither is the better ' +
    'picture of the word — a mirror is a mirror. There is no case for switching',
  'groom:spray':
    'finished art, no word. An aerosol can has no entry',
  'media:record':
    'a disc. The word `record` is recorde / record — a score — and is drawn as one. A spinning disc has no word',
  'seascape:bay':
    'a bay. The words `bay` and `gulf` both take `inlet`, so a separate bay branch has nothing of its own to serve. ' +
    'Those two sharing one drawing is a separate problem, already in the recolour count',
  'seascape:beach':
    'a beach. No word for a whole beach; `sand` is not in the deck either',
  'seascape:boat':
    'a boat on the water. `boat` is not in the deck at all, and the `journey` kind would draw a boat better',
  'seascape:lagoon':
    'a lagoon, and the more accurate drawing of its own word: `lagoon` is lagoa / lagoon and takes `atoll`, which ' +
    'is a ring-shaped reef. The branch that names the word is not the one in use'
};

const declared = branches();
const wants = asked();

let total = 0, unreachable = 0, exempt = 0, undeclared = 0;
const rows = [];

for (const kind of Object.keys(declared).sort()) {
  const d = declared[kind];
  if (!d.branches.size) continue;
  if (d.hasTail) { exempt++; continue; }
  const askedFor = wants[kind] || new Set();
  const dead = [...d.branches].filter((b) => !askedFor.has(b)).sort();
  total += d.branches.size;
  unreachable += dead.length;
  rows.push([kind, dead]);
}

console.log('kinds with branches: ' + Object.keys(declared).filter((k) => declared[k].branches.size).length +
  '   exempt because they end in an else: ' + exempt);
console.log('branches declared: ' + total +
  '   no recipe reaches: ' + unreachable +
  '   declared as waiting: ' + Object.keys(WAITING).length + '\n');

for (const [kind, dead] of rows) {
  for (const b of dead) {
    const key = kind + ':' + valueOf(b);
    const why = WAITING[key];
    if (!why) undeclared++;
    console.log('  ' + (why ? '.' : 'x') + ' ' + key.padEnd(20) +
      (why || 'NOT DECLARED — an art branch no recipe reaches'));
  }
}

console.log('\nundeclared orphans: ' + undeclared +
  '  (a new one means a branch landed in the wrong kind, or a recipe was deleted and took its art with it)');

if (process.argv.includes('--list')) {
  console.log('\nthe full inventory:');
  for (const kind of Object.keys(declared).sort()) {
    const d = declared[kind];
    if (!d.branches.size) continue;
    const askedFor = wants[kind] || new Set();
    const mark = (b) => (askedFor.has(b) ? valueOf(b) : '[' + valueOf(b) + ']');
    console.log('  ' + kind.padEnd(16) + (d.hasTail ? '(else) ' : '        ') +
      [...d.branches].sort().map(mark).join(' '));
  }
}

process.exit(undeclared ? 1 : 0);
