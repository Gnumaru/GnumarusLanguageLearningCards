/**
 * Where everything is, derived from this file's own location.
 *
 * The harness used to live in /tmp and was wiped twice by the machine, taking
 * the measurements with it. Every path here is therefore resolved from __dirname
 * and nothing is written outside the project: generated files go to tools/.out,
 * which is gitignored, so a run leaves the working tree clean apart from the
 * checks' own output.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const TOOLS = path.resolve(__dirname, '..');
const ROOT = path.resolve(TOOLS, '..');
const JS = path.join(ROOT, 'assets', 'js');
const OUT = path.join(TOOLS, '.out');

/** Make tools/.out exist and return it. */
function out(...parts) {
  fs.mkdirSync(OUT, { recursive: true });
  return path.join(OUT, ...parts);
}

/**
 * The script tags in index.html, in the order the page loads them.
 *
 * This order is load-bearing. Every themed data file and every recipe file
 * registers under the same ids and the last registration wins, so a harness that
 * sorts by filename tests a different deck from the one the browser builds. Two
 * cards were identical recipes for weeks before this was read out of the page
 * instead of guessed.
 */
function scriptOrder() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="assets\/js\/([^"]+)"><\/script>/g)].map((m) => m[1]);
  if (!files.length) throw new Error('no script tags found in index.html');
  return files;
}

module.exports = { TOOLS, ROOT, JS, OUT, out, scriptOrder };
