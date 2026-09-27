/**
 * What the app does, in a real browser.
 *
 *   node tools/test.js
 *
 * The deck is the easy half and is checked offline by check.js. This checks the
 * half that only exists once the page is running: the cards render, a tap flips
 * one, the revealed words match the data, the language can be switched at any
 * moment and the chrome follows, and nothing is fetched from off-origin.
 *
 * Every suite runs twice — once served, once from `file://` — because working
 * from a file with no server is the point of the project and the two origins
 * fail differently.
 */
'use strict';
const { browser, open, bothOrigins } = require('./lib/browser');

const EXPECTED = { words: 2000, categories: 53, kinds: 83, pageSize: 100 };

let pass = 0, fail = 0;
const ok = (m) => { pass++; console.log('  ok  ' + m); };
const bad = (m) => { fail++; console.log('  x   ' + m); };
const is = (m, c) => (c ? ok(m) : bad(m));

/* Browser expressions are written as template literals rather than
   concatenated quoted fragments. Escaping by hand across two levels of quoting
   produces syntax errors in the test, which look like failures of the app. */
const q = (s) => JSON.stringify(s);

/** A JS expression that reads one card's word in one language. */
const cardWord = (l) => `document.querySelector('.tr[data-lang="${l}"] .tr__word').textContent.trim()`;

/** A JS expression that reads the first card's word in each language. */
const allWords = `['pt','en','es'].map(function(l){
  var e = document.querySelector('.tr[data-lang="' + l + '"] .tr__word');
  return e ? e.textContent.trim() : '';
})`;

async function run(url, label) {
  const ev = await open(url);
  console.log('\n' + label.toUpperCase() + '  ' + url);

  /* --- the deck is there ------------------------------------------------- */
  const words = await ev('LLC.data.words.length');
  const cats = await ev('LLC.data.categories.length');
  const kinds = await ev('LLC.art.kinds().length');
  is('deck has ' + words + ' words', words === EXPECTED.words);
  is('all ' + cats + ' categories present', cats === EXPECTED.categories);
  is(kinds + ' kinds registered', kinds === EXPECTED.kinds);

  const drawable = await ev('LLC.data.words.filter(function(w){return LLC.art.has(w.id)}).length');
  is('every word can be drawn (' + drawable + '/' + words + ')', drawable === words);

  const distinct = await ev('new Set(LLC.data.words.map(function(w){return LLC.art.get(w.id)})).size');
  is('every drawing is distinct (' + distinct + ')', distinct === words);

  const onFallback = await ev(
    'LLC.data.words.filter(function(w){return LLC.art.get(w.id) === LLC.art.fallback(w.id)}).length');
  is('no word fell back to generated geometry', onFallback === 0);

  /* --- the page renders --------------------------------------------------- */
  const cards = await ev('document.querySelectorAll(".card").length');
  is('first page shows ' + cards + ' cards', cards === EXPECTED.pageSize);
  is('every card has artwork',
    (await ev('[...document.querySelectorAll(".card")].filter(function(c){' +
      'return c.querySelector("svg.art")}).length')) === cards);

  const threeLangs = await ev(`[...document.querySelectorAll('.card')].every(function(c){
    return ['pt','en','es'].every(function(l){
      var e = c.querySelector('.tr[data-lang="' + l + '"] .tr__word');
      return e && e.textContent.trim().length > 0;
    });
  })`);
  is('every card carries pt, en and es', threeLangs === true);

  /* --- a tap reveals the word in all three languages ---------------------- */
  const before = await ev('document.querySelector(".card").getAttribute("aria-expanded")');
  await ev('document.querySelector(".card").click()');
  await new Promise((r) => setTimeout(r, 150));
  const after = await ev('document.querySelector(".card").getAttribute("aria-expanded")');
  is('a tap flips the card (' + before + ' -> ' + after + ')', before === 'false' && after === 'true');

  const revealed = await ev(allWords);
  is('reveal shows a word in each language (' + revealed.join(' / ') + ')',
    revealed.every((x) => x && x.length > 1));
  const data = await ev('LLC.data.byId(document.querySelector(".card").dataset.card).w');
  is('the revealed words match the data',
    revealed[0] === data.pt && revealed[1] === data.en && revealed[2] === data.es);

  await ev('document.querySelector(".card").click()');
  await new Promise((r) => setTimeout(r, 120));
  is('a second tap closes it',
    (await ev('document.querySelector(".card").getAttribute("aria-expanded")')) === 'false');

  /* --- the language can be switched at any time --------------------------- */
  const chrome = {};
  for (const lang of ['en', 'es', 'pt']) {
    await ev('LLC.i18n.set(' + q(lang) + ')');
    await new Promise((r) => setTimeout(r, 90));
    chrome[lang] = await ev('document.querySelector(".brand__tagline").textContent.trim()');
    const w = await ev(cardWord(lang));
    is('switch to ' + lang + ' shows "' + w + '"', w.length > 1);
  }
  /* The header, the tabs and the cards all have to follow. Only the <select>
     used to, which left the tagline reading in the previous language. */
  is('the interface chrome follows the language',
    new Set([chrome.en, chrome.es, chrome.pt]).size === 3);

  /* --- the deck is paginated ---------------------------------------------- */
  const pages = await ev('LLC.data.words.length / ' + EXPECTED.pageSize);
  is('the deck needs ' + Math.ceil(pages) + ' pages of ' + EXPECTED.pageSize,
    Math.ceil(pages) === EXPECTED.words / EXPECTED.pageSize);
  is('a pager is present',
    (await ev('!!document.querySelector("[class*=pager], nav button")')) === true);

  /* --- nothing reaches off-origin ----------------------------------------- */
  const external = await ev(
    'performance.getEntriesByType("resource").map(function(r){return r.name})' +
    '.filter(function(n){return n.indexOf(location.origin) !== 0 && n.indexOf("data:") !== 0})');
  is('no resource comes from another origin', external.length === 0);
  if (external.length) console.log('       ' + external.slice(0, 4).join('  '));

  is('no uncaught errors', (await ev('window.__errs ? window.__errs.length : 0')) === 0);
}

(async () => {
  await browser();
  await bothOrigins(run);
  console.log('\nPASS ' + pass + '   FAIL ' + fail);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
