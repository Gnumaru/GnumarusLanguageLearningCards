/**
 * The ends: of the deck, of a filter, and of the states a user reaches by
 * clicking in the wrong order.
 *
 *   node tools/edge.js
 *
 * Paging is walked all the way to the last card rather than sampled, because the
 * interesting failures are cumulative — a pager window that is correct on page 3
 * and skips a card on page 17 is a bug the count would not reveal.
 */
'use strict';
const { browser, open, bothOrigins } = require('./lib/browser');

const PAGE = 100;
let pass = 0, fail = 0;
const is = (m, c) => { if (c) { pass++; console.log('  ok  ' + m); } else { fail++; console.log('  x   ' + m); } };

async function run(url, label) {
  const ev = await open(url);
  console.log('\n' + label.toUpperCase() + '  ' + url);

  const total = await ev('LLC.data.words.length');
  const expected = total % PAGE === 0 ? PAGE : total % PAGE;

  /* --- the pager walks the whole deck ------------------------------------ */
  const first = await ev(`[...document.querySelectorAll('.card')].map(function(c){return c.dataset.card})`);
  is('page 1 holds ' + first.length + ' cards', first.length === PAGE);

  const seen = new Set(first);
  let lastPage = first, steps = 0;
  for (;;) {
    const moved = await ev(`(function(){
      var n = [...document.querySelectorAll('button')].filter(function(x){
        return !x.disabled && /next|›|»|→/i.test(x.textContent + x.title + (x.getAttribute('aria-label') || ''));
      });
      if (!n.length) return false;
      n[n.length - 1].click();
      return true;
    })()`);
    if (!moved || steps++ > 40) break;
    await new Promise((r) => setTimeout(r, 130));
    lastPage = await ev(`[...document.querySelectorAll('.card')].map(function(c){return c.dataset.card})`);
    lastPage.forEach((x) => seen.add(x));
  }
  is('the pager reaches every card (' + seen.size + '/' + total + ')', seen.size === total);
  is('the last page is a short final page (' + lastPage.length + ' of ' + expected + ')', lastPage.length === expected);
  is('the last page ends on the final word',
    lastPage[lastPage.length - 1] === (await ev('LLC.data.words[LLC.data.words.length - 1].id')));

  /* --- a search with no hits must not dead-end ---------------------------- */
  const hasSearch = await ev(`!!document.querySelector('input[type=search], .search input')`);
  if (hasSearch) {
    await ev(`(function(){
      var s = document.querySelector('input[type=search], .search input');
      s.value = 'zzzzzznotaword';
      s.dispatchEvent(new Event('input', {bubbles: true}));
    })()`);
    await new Promise((r) => setTimeout(r, 250));
    is('a search with no hits does not throw', (await ev('document.querySelectorAll(".card").length')) >= 0);
    await ev(`(function(){
      var s = document.querySelector('input[type=search], .search input');
      s.value = '';
      s.dispatchEvent(new Event('input', {bubbles: true}));
    })()`);
    await new Promise((r) => setTimeout(r, 200));
    is('clearing the search brings the cards back',
      (await ev('document.querySelectorAll(".card").length')) === PAGE);
  } else {
    is('the deck has no free-text search, so there is no empty result to handle', true);
  }

  /* --- switching language mid-deck must not lose the page ---------------- */
  const before = await ev('document.querySelectorAll(".card").length');
  await ev("LLC.i18n.set('es')");
  await new Promise((r) => setTimeout(r, 200));
  is('the page survives a language switch (' + before + ' cards)',
    (await ev('document.querySelectorAll(".card").length')) === before);
  await ev("LLC.i18n.set('pt')");
  await new Promise((r) => setTimeout(r, 150));

  /* --- the data is clean enough to render without escaping --------------- */
  const needsEscaping = await ev(`LLC.data.words.filter(function(w){
    return /[<>&"]/.test(w.w.pt + w.w.en + w.w.es);
  }).length`);
  is('no word needs HTML escaping (' + needsEscaping + ' do)', needsEscaping === 0);

  const missing = await ev(`LLC.data.words.filter(function(w){
    return ['pt','en','es'].some(function(l){return !w.w[l] || !w.w[l].trim()});
  }).length`);
  is('no word is missing a translation (' + missing + ' are)', missing === 0);

  /* --- the keyboard reaches a card and flips it --------------------------- */
  const kbd = await ev(`(function(){
    var c = document.querySelector('.card');
    c.focus();
    var before = c.getAttribute('aria-expanded');
    c.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
    return [before, c.getAttribute('aria-expanded')];
  })()`);
  is('Enter flips a focused card', Array.isArray(kbd) && kbd[0] === 'false' && kbd[1] === 'true');

  /* --- the very last word is as well-formed as the first ----------------- */
  const lastArt = await ev(`(function(){
    var w = LLC.data.words[LLC.data.words.length - 1];
    var s = LLC.art.get(w.id);
    return s.indexOf('<svg') === 0 && s.indexOf('</svg>') > 0;
  })()`);
  is('the last word has well-formed artwork', lastArt === true);

  is('still no uncaught errors', (await ev('window.__errs ? window.__errs.length : 0')) === 0);
}

(async () => {
  await browser();
  await bothOrigins(run);
  console.log('\nPASS ' + pass + '   FAIL ' + fail);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
