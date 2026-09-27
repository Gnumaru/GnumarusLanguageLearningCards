/*!
 * app.js - UI: routing, views, deck, study session, quiz, progress, settings.
 *
 * Classic script on purpose: `file://` blocks ES modules, so the whole app is
 * loaded with plain <script> tags and talks through the LLC namespace.
 *
 * Rendering strategy: each view returns an HTML string, which is injected into
 * <main> and then localised by walking [data-i18n] attributes. Events are
 * handled by delegation on document, so re-rendering never leaks listeners.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var i18n = LLC.i18n;
  var data = LLC.data;
  var srs = LLC.srs;
  var store = LLC.store;
  var t = i18n.t;

  var UI_KEY = 'ui.v1';
  var doc = global.document;

  /* ================================================================== *
   * Tiny helpers
   * ================================================================== */

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }

  function esc(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** Wrap every occurrence of `needle` inside `text` with <mark>. */
  function highlight(text, needle) {
    var safe = esc(text);
    if (!needle) return safe;
    var pattern = needle.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!pattern) return safe;
    return safe.replace(new RegExp('(' + pattern + ')', 'ig'), '<mark>$1</mark>');
  }

  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  var ICONS = {
    deck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="14" rx="2.5"/><path d="M7 3h11a2 2 0 0 1 2 2v11"/></svg>',
    study: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 7l9 4 9-4-9-4Z"/><path d="M7 9v6c0 1.7 2.2 3 5 3s5-1.3 5-3V9"/></svg>',
    progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.9 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.7 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.7 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.7a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.3 9v0a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h3l5 4V5L7 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17.4v.1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
    cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  function icon(name) { return ICONS[name] || ''; }

  /* ================================================================== *
   * Application state
   * ================================================================== */

  var DEFAULT_UI = {
    lang: null,        // null => detect from the browser
    theme: null,       // null => follow the system
    cardLangs: null,   // null => every available language
    speech: true,
    motion: true
  };

  var ui = loadUI();

  var state = {
    view: 'deck',
    q: '',
    cats: [],
    types: [],
    hideMastered: false,
    page: 1,
    flipped: {},
    setup: { mode: 'learn', source: null, targets: [], size: 20 },
    session: null
  };

  /* The deck is browsed one page at a time. Rendering all 500 cards (or 5,000)
     up front makes the grid, the first paint and every re-filter pay for cards
     nobody is looking at. This is the only knob: change it and the pager, the
     range line and the routes follow. */
  var DECK_PAGE_SIZE = 100;

  /* Set while a hash change comes from the pager, so `route()` knows to keep
     the viewport where the reader is instead of scrolling back to the top. */
  var paging = false;

  function loadUI() {
    var saved = store.get(UI_KEY, null);
    var out = {};
    Object.keys(DEFAULT_UI).forEach(function (key) { out[key] = DEFAULT_UI[key]; });
    if (saved && typeof saved === 'object') {
      Object.keys(DEFAULT_UI).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(saved, key)) out[key] = saved[key];
      });
    }
    if (!Array.isArray(out.cardLangs) || !out.cardLangs.length) out.cardLangs = null;
    if (i18n.LOCALES[out.lang] === undefined) out.lang = null;
    return out;
  }

  function saveUI() { store.set(UI_KEY, ui); }

  function cardLangs() {
    var available = data.languageIds;
    if (!ui.cardLangs) return available.slice();
    var kept = ui.cardLangs.filter(function (id) { return available.indexOf(id) !== -1; });
    return kept.length >= 2 ? kept : available.slice();
  }

  function availableLanguages() { return cardLangs(); }

  /** Every language the deck knows about, selected or not. */
  function allLanguages() { return data.languageIds.slice(); }

  function langName(id) { return i18n.languageName(id); }
  function langMeta(id) { return data.languages[id] || { id: id, name: id, flag: '', speech: id }; }

  /* ================================================================== *
   * Bootstrap
   * ================================================================== */

  function boot() {
    i18n.set(ui.lang || i18n.detect());
    applyTheme();
    applyMotion();
    buildLangPicker();
    bindGlobalEvents();
    window.addEventListener('hashchange', route);
    i18n.apply(doc);   /* static chrome comes from index.html */
    route();
  }

  function applyTheme() {
    var theme = ui.theme;
    if (theme !== 'light' && theme !== 'dark') {
      var dark = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = dark ? 'dark' : 'light';
    }
    doc.documentElement.setAttribute('data-theme', theme);
    var btn = $('#themeBtn');
    if (btn) btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
  }

  function applyMotion() {
    doc.documentElement.classList.toggle('no-motion', ui.motion === false);
  }

  function buildLangPicker() {
    var select = $('#uiLang');
    if (!select) return;
    select.innerHTML = i18n.available.map(function (id) {
      var loc = i18n.LOCALES[id];
      return '<option value="' + esc(id) + '">' + esc(loc._flag + ' ' + loc._name) + '</option>';
    }).join('');
    select.value = i18n.current;
  }

  function buildTabs() {
    var nav = $('#tabs');
    if (!nav) return;
    var items = [
      { id: 'deck', key: 'nav.deck', icon: 'deck' },
      { id: 'study', key: 'nav.study', icon: 'study' },
      { id: 'progress', key: 'nav.progress', icon: 'progress' },
      { id: 'settings', key: 'nav.settings', icon: 'settings' }
    ];
    nav.innerHTML = items.map(function (item) {
      var active = state.view === item.id || (item.id === 'study' && state.view === 'session');
      /* No data-i18n here on purpose: the label is already translated and the
         icon must survive the localisation pass. */
      return '<a class="tab' + (active ? ' is-active' : '') + '" href="#/' + item.id + '">' +
        icon(item.icon) + '<span>' + esc(t(item.key)) + '</span></a>';
    }).join('');
  }

  /* ================================================================== *
   * Routing
   * ================================================================== */

  function route() {
    var hash = (global.location.hash || '').replace(/^#\/?/, '');
    var parts = hash.split('/');
    var head = parts[0] || 'deck';
    var known = ['deck', 'study', 'progress', 'settings'];
    state.view = known.indexOf(head) !== -1 ? head : 'deck';

    /* `#/deck/3` is a real, linkable page of the deck. Anything unparseable
       falls back to the first page rather than an empty grid. */
    if (state.view === 'deck') {
      var wanted = parseInt(parts[1], 10);
      state.page = (wanted >= 1 && String(wanted) === parts[1]) ? wanted : 1;
    }

    if (state.view === 'study' && parts[1] === 'run' && state.session) {
      state.view = 'session';
    } else if (state.view !== 'session') {
      state.session = null;   /* leaving the runner keeps a stale session around */
    }

    var fromPager = paging;
    paging = false;
    render();
    if (fromPager) afterPageChange();
    else global.scrollTo(0, 0);
  }

  function go(path) {
    if (global.location.hash === '#/' + path) route();
    else global.location.hash = '#/' + path;
  }

  /* ================================================================== *
   * Shared fragments
   * ================================================================== */

  function viewHead(titleKey, subKey) {
    return '<header class="viewhead"><h1>' + esc(t(titleKey)) + '</h1>' +
      (subKey ? '<p>' + esc(t(subKey)) + '</p>' : '') + '</header>';
  }

  function dotsMarkup(box) {
    var out = '<span class="dots" role="img" aria-label="' +
      esc(t('a11y.boxProgress', { box: box + 1, max: srs.MAX_BOX })) + '">';
    for (var i = 0; i < srs.MAX_BOX; i++) out += '<i class="' + (i < box ? 'on' : '') + '"></i>';
    return out + '</span>';
  }

  function speakButton(text, langId) {
    return '<button type="button" class="speak" data-speak="' + esc(langId) + '" data-text="' + esc(text) + '" ' +
      'title="' + esc(t('common.speak')) + '" aria-label="' + esc(t('common.speak') + ': ' + text) + '">' + icon('sound') + '</button>';
  }

  function typeLabel(type) { return t('type.' + type); }

  /* ================================================================== *
   * Deck view
   * ================================================================== */

  function filteredWords() {
    var q = state.q.trim().toLowerCase();
    var langs = cardLangs();
    return data.words.filter(function (word) {
      if (state.cats.length && state.cats.indexOf(word.cat) === -1) return false;
      if (state.types.length && state.types.indexOf(word.type) === -1) return false;
      if (state.hideMastered && srs.isMastered(word.id)) return false;
      if (!q) return true;
      if (word.id.indexOf(q) !== -1) return true;
      for (var i = 0; i < langs.length; i++) {
        var value = data.translate(word, langs[i]);
        if (value && value.toLowerCase().indexOf(q) !== -1) return true;
      }
      return false;
    });
  }

  function deckCardMarkup(word) {
    var rec = srs.peek(word.id);
    var box = rec ? rec.box : 0;
    var seen = rec ? rec.seen : 0;
    var langs = cardLangs();
    var flipped = !!state.flipped[word.id];
    var label = data.translate(word, langs[0]);
    var cat = data.category(word.cat);

    var rows = langs.map(function (id) {
      /* Short code, not the full language name: the row is only a few words
         wide and long labels collide with the translation. */
      return '<span class="tr" data-lang="' + esc(id) + '">' +
        '<span class="tr__lang">' + esc(id.toUpperCase()) + '</span>' +
        '<span class="tr__word">' + highlight(data.translate(word, id), state.q) + '</span>' +
        speakButton(data.translate(word, id), id) + '</span>';
    }).join('');

    /* The card is a div, not a <button>: HTML forbids nesting a <button>
       inside another <button>, and the parser silently closes the outer one
       when it meets the per-language "pronounce" buttons on the back face. */
    return '<div class="card' + (flipped ? ' is-flipped' : '') + '" data-card="' + esc(word.id) + '" ' +
      'role="button" tabindex="0" aria-expanded="' + (flipped ? 'true' : 'false') + '" ' +
      'aria-label="' + esc(t('a11y.art', { word: label }) + ' · ' +
        t('a11y.category', { name: data.categoryName(word.cat, i18n.current) }) + ' · ' + t('a11y.flip')) + '" ' +
      'data-i18n-title="a11y.flip" title="' + esc(t('a11y.flip')) + '">' +
      '<span class="card__inner">' +
        '<span class="card__face card__face--front">' +
          '<span class="card__art">' + LLC.art.get(word.id) + '</span>' +
          '<span class="card__foot">' +
            '<span class="tag" style="background:' + esc(cat.bg) + ';color:' + esc(cat.accent) + '">' + esc(typeLabel(word.type)) + '</span>' +
            dotsMarkup(box) +
          '</span>' +
        '</span>' +
        '<span class="card__face card__face--back">' +
          '<span class="card__art card__art--sm">' + LLC.art.get(word.id) + '</span>' +
          '<span class="trlist">' + rows + '</span>' +
          '<span class="card__foot">' +
            '<span class="card__count">' + (seen ? esc(t('deck.progress', { box: box + 1, max: srs.MAX_BOX, seen: seen })) : esc(t('deck.untouched'))) + '</span>' +
            dotsMarkup(box) +
          '</span>' +
        '</span>' +
      '</span></div>';
  }

  /**
   * The filtered deck, split into the current page.
   *
   * The page is always clamped to a real one, so a filter change, a deleted
   * word or a stale `#/deck/99` link can never leave the deck showing nothing.
   */
  function pagedDeck() {
    var all = filteredWords();
    var pages = Math.max(1, Math.ceil(all.length / DECK_PAGE_SIZE));
    var page = state.page;
    if (!(page >= 1)) page = 1;
    if (page > pages) page = pages;
    var from = (page - 1) * DECK_PAGE_SIZE;
    return {
      words: all.slice(from, from + DECK_PAGE_SIZE),
      total: all.length,
      page: page,
      pages: pages
    };
  }

  /**
   * Page numbers to offer, with `0` standing in for an ellipsis.
   *
   * Always the first and last page plus a window around the current one, so a
   * deck that grows to fifty pages does not produce fifty buttons.
   */
  /* The page numbers to offer: always the first and the last, a window around
     the current one, and an ellipsis wherever something was skipped. The
     window is two pages each side, which is what makes a ten-page deck
     navigable without stepping through it one card page at a time. */
  function pageSequence(page, pages) {
    var out = [];
    var i;
    if (pages <= 7) {
      for (i = 1; i <= pages; i++) out.push(i);
      return out;
    }
    out.push(1);
    var from = Math.max(2, page - 2);
    var to = Math.min(pages - 1, page + 2);
    if (from > 2) out.push(0);
    for (i = from; i <= to; i++) out.push(i);
    if (to < pages - 1) out.push(0);
    out.push(pages);
    return out;
  }

  function pagerMarkup(pages, page) {
    if (pages <= 1) return '';

    var buttons = pageSequence(page, pages).map(function (n) {
      if (n === 0) return '<li class="pager__gap" aria-hidden="true">…</li>';
      var on = n === page;
      return '<li><button type="button" class="pagebtn' + (on ? ' is-on' : '') + '" data-page="' + n + '"' +
        (on ? ' aria-current="page"' : '') +
        ' aria-label="' + esc(t('deck.goToPage', { page: n })) + '">' + n + '</button></li>';
    }).join('');

    return '<nav class="pager" id="deckPager" aria-label="' + esc(t('deck.pagesLabel')) + '">' +
      '<button type="button" class="btn btn--ghost pager__step" data-page-step="-1"' +
        (page <= 1 ? ' disabled' : '') + '>' +
        '<span aria-hidden="true">&larr;</span> ' + esc(t('deck.prevPage')) + '</button>' +
      '<ol class="pager__pages">' + buttons + '</ol>' +
      '<button type="button" class="btn btn--ghost pager__step" data-page-step="1"' +
        (page >= pages ? ' disabled' : '') + '>' +
        esc(t('deck.nextPage')) + ' <span aria-hidden="true">&rarr;</span></button>' +
      '</nav>';
  }

  function deckResultsMarkup() {
    var deck = pagedDeck();
    /* `data-current-page` and not `data-page`: the click handler looks for
       `[data-page]` to find a pager button, and a plain `data-page` on an
       ancestor would make `closest()` swallow the click and send it back to
       the page it is already on. */
    return '<div id="deckResults" data-current-page="' + deck.page + '" ' +
      'data-total="' + deck.total + '">' + deckResultsInnerMarkup(deck) + '</div>';
  }

  function deckResultsInnerMarkup(deck) {
    if (!deck.total) {
      return '<div class="empty" id="deckEmpty"><strong>' + esc(t('deck.empty')) + '</strong>' +
        '<p>' + esc(t('deck.emptyHint')) + '</p></div>';
    }
    return '<div class="pagerbar pagerbar--top">' + rangeLine(deck) + '</div>' +
      '<div class="deckgrid">' + deck.words.map(deckCardMarkup).join('') + '</div>' +
      '<div class="pagerbar">' + rangeLine(deck) + pagerMarkup(deck.pages, deck.page) + '</div>';
  }

  /** "Showing 101–200 of 360" — shown above the grid and again under the pager. */
  function rangeLine(deck) {
    var from = (deck.page - 1) * DECK_PAGE_SIZE + 1;
    return '<p class="pagerbar__range">' +
      esc(t('deck.showing', { from: from, to: from + deck.words.length - 1, total: deck.total })) +
      '</p>';
  }

  /**
   * Re-apply the search to the page on screen.
   *
   * Two paths, because a full re-render throws away the focus in the search
   * box and the flip state:
   *
   *   - If every card the new page needs is already in the DOM, hide the
   *     extras and refresh only the highlighted word. Free.
   *   - Otherwise replace the contents of `#deckResults` — *not* the whole
   *     view, because that would rebuild the search field and drop the caret
   *     on every keystroke that changes which page is showing.
   */
  function refreshDeck() {
    var results = $('#deckResults');
    if (!results) { render(); return; }

    syncClearButton();

    var deck = pagedDeck();
    /* These describe the results as a whole, so they have to be set on every
       path out of here — including the ones that swap the inner markup. */
    results.setAttribute('data-current-page', String(deck.page));
    results.setAttribute('data-total', String(deck.total));

    var grid = results.querySelector('.deckgrid');
    if (!grid) {
      results.innerHTML = deckResultsInnerMarkup(deck);
      i18n.apply(results);
      return;
    }

    var keep = Object.create(null);
    deck.words.forEach(function (word) { keep[word.id] = true; });

    var cards = $$('.card', grid);
    var reusable = true;
    cards.forEach(function (card) {
      if (!keep[card.getAttribute('data-card')]) reusable = false;
    });
    for (var id in keep) {
      if (!Object.prototype.hasOwnProperty.call(keep, id)) continue;
      var found = false;
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute('data-card') === id) { found = true; break; }
      }
      if (!found) { reusable = false; break; }
    }

    if (!reusable) {
      results.innerHTML = deckResultsInnerMarkup(deck);
      i18n.apply(results);
      return;
    }

    cards.forEach(function (card) {
      var show = !!keep[card.getAttribute('data-card')];
      card.hidden = !show;
      if (!show) return;
      var word = data.byId(card.getAttribute('data-card'));
      $$('.tr', card).forEach(function (row) {
        var cell = row.querySelector('.tr__word');
        if (cell) cell.innerHTML = highlight(data.translate(word, row.getAttribute('data-lang')), state.q);
      });
    });

    var bars = $$('.pagerbar', results);
    if (bars.length) {
      var pager = pagerMarkup(deck.pages, deck.page);
      bars.forEach(function (bar, index) {
        bar.innerHTML = rangeLine(deck) + (index === 0 ? '' : pager);
      });
    }
  }

  /**
   * Jump to a page of the deck.
   *
   * The page lives in the hash (`#/deck/3`) so it survives a reload and can be
   * linked to. Writing the hash re-enters `route()`, which does the render, so
   * `paging` tells it to skip the usual scroll-to-top and instead hand the
   * viewport and the keyboard back to the grid and the new page button.
   */
  function setPage(page) {
    var deck = pagedDeck();
    var next = page;
    if (!(next >= 1)) next = 1;
    if (next > deck.pages) next = deck.pages;
    state.page = next;
    if (state.view === 'deck') {
      paging = true;
      global.location.hash = next > 1 ? '#/deck/' + next : '#/deck';
    } else {
      render();
      afterPageChange();
    }
  }

  function afterPageChange() {
    var results = $('#deckResults');
    if (results) {
      var top = results.getBoundingClientRect().top;
      /* Only pull the viewport when the grid has scrolled out of sight: on a
         long page the reader may already be looking at the first row, and
         yanking them to the top would be worse than doing nothing. */
      if (top < 0 || top > (global.innerHeight || 800) * 0.6) {
        results.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    }
    /* The pager is re-rendered, so a keyboard user needs to be put back on the
       button for the page they just chose. */
    var active = $('#deckPager [data-page="' + state.page + '"]');
    if (active && active.focus) active.focus({ preventScroll: true });
  }

  function filtersActive() {
    return !!(state.q || state.cats.length || state.types.length || state.hideMastered);
  }

  /**
   * Keep the Clear button in step with the filters.
   *
   * It is always rendered and only toggled with `hidden`, because searching
   * re-filters the results without re-rendering the filter bar — otherwise the
   * button would come and go with the layout and never match the filters.
   */
  function syncClearButton() {
    var btn = $('#clearFilters');
    if (btn) btn.hidden = !filtersActive();
  }

  function deckView() {
    var summary = srs.summary();

    var catChip = function (cat) {
      var on = state.cats.indexOf(cat.id) !== -1;
      return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" data-cat="' + esc(cat.id) + '" ' +
        'aria-pressed="' + on + '">' +
        '<span class="chip__dot" style="background:' + esc(cat.accent) + '"></span>' +
        esc(data.categoryName(cat.id, i18n.current)) + '</button>';
    };

    /* With fifty-odd categories a single ribbon of chips is unreadable, so the
       categories are laid out one scrollable row per themed group, each under a
       caption. The rows keep the group order of `data.groups`. */
    var catChips = data.groups.map(function (group) {
      var cats = data.categories.filter(function (cat) { return cat.group === group.id; });
      if (!cats.length) return '';
      return '<div class="chipgroup">' +
        '<span class="chipgroup__label">' + esc(data.groupName(group.id, i18n.current)) + '</span>' +
        '<div class="chiprow chiprow--scroll">' +
          cats.map(catChip).join('') +
        '</div></div>';
    }).join('');

    var typeChips = data.types.map(function (type) {
      var on = state.types.indexOf(type) !== -1;
      return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" data-type="' + esc(type) + '" ' +
        'aria-pressed="' + on + '">' + esc(typeLabel(type)) + '</button>';
    }).join('');

    var clearBtn = '<button type="button" class="btn btn--ghost" id="clearFilters"' +
      (filtersActive() ? '' : ' hidden') + '>' + esc(t('common.clear')) + '</button>';

    return '<div class="view">' +
      viewHead('deck.title', 'deck.subtitle') +
      '<div class="card-surface filters">' +
        '<div class="searchbox">' + icon('search') +
          '<input class="input" id="deckSearch" type="search" autocomplete="off" spellcheck="false" ' +
            'placeholder="' + esc(t('common.searchPlaceholder')) + '" data-i18n-placeholder="common.searchPlaceholder" ' +
            'value="' + esc(state.q) + '">' +
        '</div>' +
        '<div class="filters__sep"></div>' +
        '<div class="chipgroups">' + catChips + '</div>' +
        '<div class="filters__sep"></div>' +
        '<div class="chiprow chiprow--scroll">' + typeChips + '</div>' +
        '<div class="filters__sep"></div>' +
        '<label class="switch"><input type="checkbox" id="hideMastered"' + (state.hideMastered ? ' checked' : '') + '>' +
          '<span class="switch__track"></span><span data-i18n="deck.showLearned">Show learned cards</span></label>' +
        clearBtn +
        '<a class="btn btn--primary" href="#/study">' + esc(t('study.start')) + '</a>' +
      '</div>' +
      '<p class="field-hint" id="deckSummary" style="margin:-12px 0 18px">' +
        esc(t('deck.summaryLine', { mastered: summary.mastered, total: summary.total, due: summary.due })) +
        ' · ' + esc(t('deck.tapToHear')) +
      '</p>' +
      deckResultsMarkup() +
      '</div>';
  }

  /* ================================================================== *
   * Study setup view
   * ================================================================== */

  function normaliseSetup() {
    var langs = cardLangs();
    if (!langs.length) return;
    if (!state.setup.source || langs.indexOf(state.setup.source) === -1) {
      /* Default to the interface language: it is the one the reader is most
         comfortable in, so it makes a sensible "I already know this" pick. */
      state.setup.source = langs.indexOf(i18n.current) !== -1 ? i18n.current : langs[0];
    }
    var valid = state.setup.targets.filter(function (id) {
      return langs.indexOf(id) !== -1 && id !== state.setup.source;
    });
    if (!valid.length) {
      valid = langs.filter(function (id) { return id !== state.setup.source; }).slice(0, 1);
    }
    state.setup.targets = valid;
  }

  function languageChipRow(selected, exclude, attr) {
    return availableLanguages().filter(function (id) { return id !== exclude; }).map(function (id) {
      var meta = langMeta(id);
      var on = selected.indexOf(id) !== -1;
      return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" ' + attr + '="' + esc(id) + '" ' +
        'aria-pressed="' + on + '">' + esc(meta.flag + ' ' + langName(id)) + '</button>';
    }).join('');
  }

  function studyView() {
    normaliseSetup();
    var langs = availableLanguages();
    var setup = state.setup;

    var modes = [
      { id: 'learn', title: 'study.modeLearn', desc: 'study.modeLearnDesc' },
      { id: 'review', title: 'study.modeReview', desc: 'study.modeReviewDesc' },
      { id: 'quiz', title: 'study.modeQuiz', desc: 'study.modeQuizDesc' }
    ].map(function (mode) {
      return '<button type="button" class="mode' + (setup.mode === mode.id ? ' is-on' : '') + '" data-mode="' + mode.id + '" ' +
        'aria-pressed="' + (setup.mode === mode.id) + '">' +
        '<strong>' + esc(t(mode.title)) + '</strong><span>' + esc(t(mode.desc)) + '</span></button>';
    }).join('');

    var sizes = [10, 20, 30].map(function (n) {
      return '<button type="button" class="chip' + (setup.size === n ? ' is-on' : '') + '" data-size="' + n + '" ' +
        'aria-pressed="' + (setup.size === n) + '">' + n + '</button>';
    }).join('');

    /* Live preview of what pressing "start" would actually deal. */
    var planned = srs.queue({
      limit: setup.size,
      includeNew: setup.mode !== 'review',
      allowAny: setup.mode !== 'review'
    });
    var plannedNew = planned.cards.filter(function (w) { return !srs.touched(w.id); }).length;
    var preview = planned.cards.length
      ? plannedNew + ' ' + t('deck.new') + ' · ' + (planned.cards.length - plannedNew) + ' ' + t('progress.dueToday')
      : t('study.noCards') + ' ' + t('study.noCardsHint');

    /* A peek at the actual queue, so "start" is never a leap of faith. */
    var upNext = planned.cards.length
      ? '<div class="field"><span data-i18n="study.upNext">Up next</span>' +
        '<div class="upnext">' + planned.cards.slice(0, 8).map(function (word) {
          return '<span class="upnext__item" title="' + esc(data.translate(word, setup.targets[0])) + '">' +
            LLC.art.get(word.id) + '</span>';
        }).join('') + '</div></div>'
      : '';

    return '<div class="view">' +
      viewHead('study.title', 'study.subtitle') +
      '<div class="card-surface studysetup">' +
        '<div class="field"><span data-i18n="study.mode">Mode</span><div class="modes">' + modes + '</div></div>' +
        '<div class="studysetup__row">' +
          '<div class="field"><span data-i18n="study.source">I know this language</span>' +
            '<div class="chiprow">' + languageChipRow([setup.source], null, 'data-source') + '</div></div>' +
          '<div class="field"><span data-i18n="study.target">I want to learn</span>' +
            '<div class="chiprow">' + languageChipRow(setup.targets, setup.source, 'data-target') + '</div></div>' +
        '</div>' +
        '<div class="field"><span data-i18n="study.sessionSize">Cards per session</span>' +
          '<div class="chiprow">' + sizes + '</div></div>' +
        upNext +
        '<div class="rowbtns">' +
          '<button type="button" class="btn btn--primary btn--lg" id="startSession"' +
            (planned.cards.length ? '' : ' disabled') + '>' + esc(t('study.start')) + '</button>' +
          '<span class="field-hint">' + esc(preview) + '</span>' +
        '</div>' +
      '</div>' +
      '</div>';
  }

  /* ================================================================== *
   * Session view
   * ================================================================== */

  function makeSession() {
    normaliseSetup();
    var isReview = state.setup.mode === 'review';
    var built = srs.queue({
      limit: state.setup.size,
      includeNew: !isReview,
      /* Learn is free study: it should never dead-end just because the
         scheduler thinks nothing is due. */
      allowAny: !isReview
    });
    return {
      mode: state.setup.mode,
      source: state.setup.source,
      targets: state.setup.targets.slice(),
      queue: built.cards.slice(),
      index: 0,
      revealed: false,
      options: null,
      picked: null,
      right: 0,
      wrong: 0,
      retry: [],
      retryPasses: 0,
      finished: false
    };
  }

  function sessionCard() {
    return state.session.queue[state.session.index] || null;
  }

  function buildOptions(word) {
    var target = state.session.targets[0];
    var right = data.translate(word, target);
    var pool = shuffle(data.words.filter(function (w) { return w.id !== word.id; })).slice(0, 3);
    var options = shuffle([{ id: word.id, text: right, right: true }].concat(pool.map(function (w) {
      return { id: w.id, text: data.translate(w, target), right: false };
    })));
    return options;
  }

  function renderAnswer(sess, word) {
    var rows = [sess.source].concat(sess.targets).map(function (id) {
      var isSource = id === sess.source;
      return '<div class="answer__row' + (isSource ? ' answer__row--source' : '') + '">' +
        '<span class="answer__lang">' + esc(langName(id)) + '</span>' +
        '<span class="answer__word">' + esc(data.translate(word, id)) + '</span>' +
        speakButton(data.translate(word, id), id) + '</div>';
    }).join('');

    return '<div class="answer">' + rows +
      '<p class="field-hint">' + esc(typeLabel(word.type)) + ' · ' +
        esc(data.categoryName(word.cat, i18n.current)) + '</p>' +
      '</div>';
  }

  function sessionView() {
    var sess = state.session;

    if (!sess || sess.finished || !sessionCard()) return sessionDoneView();

    var word = sessionCard();
    var total = sess.queue.length;
    var pct = total ? Math.round((sess.index / total) * 100) : 0;

    var stage;
    if (sess.mode === 'quiz') {
      stage = renderQuiz(sess, word);
    } else {
      /* The picture stays on screen after revealing: seeing the word next to
         the image is the whole point of a picture deck. */
      var picture = sess.revealed
        ? '<div class="flash">' + LLC.art.get(word.id) + '</div>'
        : '<button type="button" class="flash flash--locked" id="revealBtn" aria-label="' + esc(t('study.showAnswer')) + '">' +
            LLC.art.get(word.id) + '</button>';

      if (sess.revealed) {
        stage = picture + renderAnswer(sess, word) +
          '<div class="gradebar">' +
            '<button type="button" class="btn btn--bad" data-grade="0">' + esc(t('study.didntKnow')) + ' <kbd>1</kbd></button>' +
            '<button type="button" class="btn btn--good" data-grade="1">' + esc(t('study.knew')) + ' <kbd>2</kbd></button>' +
          '</div>';
      } else {
        stage = picture +
          '<p class="hintline">' + esc(t('study.showAnswer')) + ' <kbd>Space</kbd></p>';
      }
    }

    return '<div class="view">' +
      '<div class="studybar">' +
        '<a class="btn btn--ghost" href="#/study">' + esc(t('study.exit')) + '</a>' +
        '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + sess.index + '">' +
          '<i style="width:' + pct + '%"></i></div>' +
        '<span class="studybar__count">' + esc(t('study.position', { current: sess.index + 1, total: total })) + '</span>' +
      '</div>' +
      '<div class="studycard"><div class="studycard__stage">' + stage + '</div></div>' +
      '</div>';
  }

  function renderQuiz(sess, word) {
    var target = sess.targets[0];
    /* The picture is not a button in quiz mode: tapping it must not give the
       answer away. */
    var html = '<div class="flash">' + LLC.art.get(word.id) + '</div>';

    if (!sess.options) sess.options = buildOptions(word);

    if (!sess.revealed) {
      html += '<p class="hintline">' + esc(t('quiz.choose')) + ' · ' + esc(langName(target)) + '</p>';
      html += '<div class="options">' + sess.options.map(function (opt, i) {
        return '<button type="button" class="option" data-option="' + i + '">' +
          '<span class="option__key">' + (i + 1) + '</span>' + esc(opt.text) + '</button>';
      }).join('') + '</div>';
      return html;
    }

    html += '<div class="options">' + sess.options.map(function (opt, i) {
      var cls = '';
      if (opt.right) cls = ' is-right';
      else if (i === sess.picked) cls = ' is-wrong';
      return '<button type="button" class="option' + cls + '" disabled>' +
        '<span class="option__key">' + (i + 1) + '</span>' + esc(opt.text) + '</button>';
    }).join('') + '</div>';

    var right = sess.options.filter(function (o) { return o.right; })[0];
    var ok = sess.picked !== null && sess.options[sess.picked] && sess.options[sess.picked].right;
    html += '<div class="verdict verdict--' + (ok ? 'right' : 'wrong') + '">' +
      icon(ok ? 'check' : 'cross') +
      '<span>' + (ok ? esc(t('quiz.correct')) : esc(t('quiz.correctAnswer', { word: right.text }))) + '</span></div>';

    html += '<div class="answer">' +
      '<div class="answer__row answer__row--source"><span class="answer__lang">' + esc(langName(sess.source)) + '</span>' +
        '<span class="answer__word">' + esc(data.translate(word, sess.source)) + '</span>' +
        speakButton(data.translate(word, sess.source), sess.source) + '</div>' +
      sess.targets.map(function (id) {
        return '<div class="answer__row"><span class="answer__lang">' + esc(langName(id)) + '</span>' +
          '<span class="answer__word">' + esc(data.translate(word, id)) + '</span>' +
          speakButton(data.translate(word, id), id) + '</div>';
      }).join('') + '</div>';

    html += '<div class="gradebar"><button type="button" class="btn btn--primary btn--block" data-grade="next">' +
      esc(t('common.next')) + ' <kbd>Space</kbd></button></div>';

    return html;
  }

  function sessionDoneView() {
    var sess = state.session;
    if (!sess) return studyView();
    var answered = sess.right + sess.wrong;
    var acc = answered ? Math.round((sess.right / answered) * 100) : 0;
    var mood = acc >= 80 ? '\u{1F389}' : acc >= 50 ? '\u{1F4AA}' : '\u{1F4D6}';

    return '<div class="view"><div class="card-surface done">' +
      '<div class="done__emoji">' + mood + '</div>' +
      '<h2>' + esc(t('study.complete')) + '</h2>' +
      '<p>' + esc(t('study.completeBody', { count: answered })) + '</p>' +
      '<div class="stats">' +
        '<div class="stat"><b>' + sess.right + '</b><span>' + esc(t('study.knewCount')) + '</span></div>' +
        '<div class="stat"><b>' + sess.wrong + '</b><span>' + esc(t('study.missedCount')) + '</span></div>' +
        '<div class="stat"><b>' + acc + '%</b><span>' + esc(t('study.accuracy')) + '</span></div>' +
      '</div>' +
      '<div class="rowbtns" style="justify-content:center">' +
        '<button type="button" class="btn btn--primary" id="studyAgain">' + esc(t('study.again')) + '</button>' +
        '<a class="btn btn--ghost" href="#/deck">' + esc(t('study.home')) + '</a>' +
      '</div>' +
      '</div></div>';
  }

  /* ================================================================== *
   * Progress view
   * ================================================================== */

  function progressView() {
    var s = srs.summary();
    var cats = srs.byCategory();
    var hist = srs.history(14);
    var peak = hist.reduce(function (max, day) { return Math.max(max, day.reviewed); }, 0) || 1;

    var tiles = [
      { value: s.mastered, label: 'progress.mastered', note: s.mastered + ' ' + t('common.of') + ' ' + s.total },
      { value: s.learning, label: 'progress.learning', note: t('progress.dueToday') + ': ' + s.due },
      { value: s.unseen, label: 'progress.unseen', note: s.unseen + ' ' + t('common.words') },
      { value: s.accuracy + '%', label: 'progress.accuracy', note: s.correct + ' / ' + s.answers }
    ].map(function (tile) {
      return '<div class="tile"><b>' + esc(String(tile.value)) + '</b>' +
        '<span>' + esc(t(tile.label)) + '</span><small>' + esc(tile.note) + '</small></div>';
    }).join('');

    var catBars = cats.map(function (row) {
      var total = row.total || 1;
      return '<div class="bar">' +
        '<span>' + esc(data.categoryName(row.id, i18n.current)) + '</span>' +
        '<span class="bar__track">' +
          '<span class="bar__fill bar__fill--learning" style="width:' + ((row.learning / total) * 100).toFixed(1) + '%"></span>' +
          '<span class="bar__fill bar__fill--mastered" style="width:' + ((row.mastered / total) * 100).toFixed(1) + '%"></span>' +
        '</span>' +
        '<span class="bar__num">' + (row.mastered + row.learning) + '/' + row.total + '</span>' +
      '</div>';
    }).join('');

    var days = hist.map(function (day) {
      var h = Math.round((day.reviewed / peak) * 100);
      return '<div class="spark__col' + (day.isToday ? ' spark__col--today' : '') + '" title="' + esc(day.day + ': ' + day.reviewed) + '">' +
        '<span class="spark__bar' + (day.reviewed ? '' : ' spark__bar--zero') + '" style="height:' + Math.max(h, 3) + '%"></span>' +
        '<span class="spark__day">' + esc(day.day.slice(8)) + '</span></div>';
    }).join('');

    return '<div class="view">' +
      viewHead('progress.title', 'progress.subtitle') +
      '<div class="tiles">' + tiles + '</div>' +

      '<div class="card-surface panel">' +
        '<h2>' + esc(t('progress.streak')) + '</h2>' +
        '<p>' + esc(t('progress.streakDay', { count: s.streak })) + ' · ' + esc(t('progress.best', { count: s.best })) +
          ' · ' + esc(t('progress.learnedToday')) + ': ' + s.today.reviewed + '</p>' +
      '</div>' +

      '<div class="card-surface panel">' +
        '<h2>' + esc(t('progress.byCategory')) + '</h2>' +
        '<div class="bars">' + catBars + '</div>' +
        '<div class="legend">' +
          '<span><i style="background:var(--brand)"></i>' + esc(t('progress.learning')) + '</span>' +
          '<span><i style="background:var(--good)"></i>' + esc(t('progress.mastered')) + '</span>' +
          '<span><i style="background:var(--surface-3)"></i>' + esc(t('progress.unseen')) + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="card-surface panel">' +
        '<h2>' + esc(t('progress.history')) + '</h2>' +
        (s.reviewed
          ? '<div class="spark">' + days + '</div>'
          : '<p class="field-hint">' + esc(t('progress.historyEmpty')) + '</p>') +
      '</div>' +

      '<div class="card-surface panel">' +
        '<h2>' + esc(t('settings.data')) + '</h2>' +
        '<div class="rowbtns">' +
          '<button type="button" class="btn" id="exportBtn">' + esc(t('common.export')) + '</button>' +
          '<button type="button" class="btn" id="importBtn">' + esc(t('common.import')) + '</button>' +
          '<button type="button" class="btn btn--bad" id="resetBtn">' + esc(t('common.reset')) + '</button>' +
        '</div>' +
        '<input type="file" id="importFile" accept="application/json,.json" class="visually-hidden">' +
        '<p class="field-hint" style="margin-top:10px">' + esc(store.persistent ? t('settings.storageOn') : t('settings.storageOff')) + '</p>' +
      '</div>' +
      '</div>';
  }

  /* ================================================================== *
   * Settings view
   * ================================================================== */

  function settingsView() {
    var themes = [
      { id: 'light', key: 'settings.themeLight' },
      { id: 'dark', key: 'settings.themeDark' },
      { id: 'system', key: 'settings.themeSystem' }
    ].map(function (item) {
      var on = (ui.theme || 'system') === item.id;
      return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" data-theme-set="' + item.id + '" ' +
        'aria-pressed="' + on + '">' + esc(t(item.key)) + '</button>';
    }).join('');

    /* Every known language gets a chip, otherwise deselecting one would make
       it impossible to select it again. */
    var langChips = allLanguages().map(function (id) {
      var meta = langMeta(id);
      var on = cardLangs().indexOf(id) !== -1;
      return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" data-cardlang="' + esc(id) + '" ' +
        'aria-pressed="' + on + '">' + esc(meta.flag + ' ' + meta.name) + '</button>';
    }).join('');

    var uiChips = i18n.available.map(function (id) {
      var loc = i18n.LOCALES[id];
      var on = i18n.current === id;
      return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" data-uilang="' + esc(id) + '" ' +
        'aria-pressed="' + on + '">' + esc(loc._flag + ' ' + loc._name) + '</button>';
    }).join('');

    var speechAvailable = 'speechSynthesis' in global;

    return '<div class="view">' +
      viewHead('settings.title', 'settings.subtitle') +
      '<div class="card-surface panel">' +
        '<h2>' + esc(t('settings.interface')) + '</h2>' +
        '<div class="setting setting--stack"><div class="setting__text">' +
          '<strong>' + esc(t('nav.language')) + '</strong>' +
          '<span>' + esc(t('settings.langHint')) + '</span></div>' +
          '<div class="setting__control chiprow">' + uiChips + '</div></div>' +
        '<div class="setting"><div class="setting__text"><strong>' + esc(t('settings.theme')) + '</strong>' +
          '<span>' + esc(t('settings.themeHint')) + '</span></div>' +
          '<div class="setting__control chiprow">' + themes + '</div></div>' +
      '</div>' +

      '<div class="card-surface panel">' +
        '<h2>' + esc(t('settings.cardLanguages')) + '</h2>' +
        '<div class="setting setting--stack"><div class="setting__text">' +
          '<span>' + esc(t('settings.cardLanguagesHint')) + '</span></div>' +
          '<div class="setting__control chiprow">' + langChips + '</div></div>' +
        '<div class="setting"><div class="setting__text"><strong>' + esc(t('settings.speech')) + '</strong>' +
          '<span>' + esc(t('settings.speechHint')) + '</span></div>' +
          '<div class="setting__control"><label class="switch">' +
            '<input type="checkbox" id="speechToggle"' + (ui.speech ? ' checked' : '') + (speechAvailable ? '' : ' disabled') + '>' +
            '<span class="switch__track"></span></label></div></div>' +
        '<div class="setting"><div class="setting__text"><strong>' + esc(t('settings.motion')) + '</strong>' +
          '<span>' + esc(t('settings.motionHint')) + '</span></div>' +
          '<div class="setting__control"><label class="switch">' +
            '<input type="checkbox" id="motionToggle"' + (ui.motion !== false ? ' checked' : '') + '>' +
            '<span class="switch__track"></span></label></div></div>' +
        (!store.persistent
          ? '<div class="note note--warn" style="margin-top:12px">' + icon('warn') +
            '<p>' + esc(t('progress.storageWarn')) + '</p></div>'
          : '') +
      '</div>' +

      '<div class="card-surface panel">' +
        '<h2>' + esc(t('settings.about')) + '</h2>' +
        '<p class="field-hint">' + esc(t('settings.aboutBody')) + '</p>' +
        '<p class="field-hint" style="margin-top:8px">' + esc(t('settings.version', { version: '1.0' })) + '</p>' +
      '</div>' +
      '</div>';
  }

  /* ================================================================== *
   * Render
   * ================================================================== */

  var VIEWS = {
    deck: deckView,
    study: studyView,
    session: sessionView,
    progress: progressView,
    settings: settingsView
  };

  function render() {
    buildTabs();
    var main = $('#main');
    if (!main) return;
    var view = VIEWS[state.view] || deckView;
    main.innerHTML = view();
    i18n.apply(main);
    if (state.view === 'deck') {
      var search = $('#deckSearch');
      if (search) search.setAttribute('aria-label', t('common.search'));
      revealActiveChips(main);
    }
  }

  /**
   * Nudge the horizontally scrolling filter rows so the chips that are
   * actually switched on are visible. With 23 categories the "Adverbs" chip
   * sits well off-screen, and an active filter you cannot see reads as no
   * filter at all.
   *
   * The offset is computed by hand in the next frame: `scrollIntoView` called
   * straight after assigning innerHTML measures a row that has not been laid
   * out yet, so it silently does nothing.
   */
  function revealActiveChips(scope) {
    var rows = $$('.chiprow--scroll', scope);
    if (!rows.length) return;
    var raf = global.requestAnimationFrame || function (fn) { global.setTimeout(fn, 0); };
    raf(function () {
      rows.forEach(function (row) {
        var on = row.querySelector('.chip.is-on');
        if (!on) return;
        var rowBox = row.getBoundingClientRect();
        var chipBox = on.getBoundingClientRect();
        if (chipBox.left >= rowBox.left && chipBox.right <= rowBox.right) return;
        row.scrollLeft += chipBox.left - rowBox.left - 8;
      });
    });
  }

  /* ================================================================== *
   * Speech
   * ================================================================== */

  function speak(text, langId) {
    if (ui.speech === false) return;
    var synth = global.speechSynthesis;
    if (!synth || typeof global.SpeechSynthesisUtterance !== 'function') return;
    try {
      synth.cancel();
      var utter = new global.SpeechSynthesisUtterance(text);
      utter.lang = langMeta(langId).speech || langId;
      utter.rate = 0.92;
      var voices = synth.getVoices() || [];
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang && voices[i].lang.toLowerCase().indexOf(langId) === 0) { utter.voice = voices[i]; break; }
      }
      synth.speak(utter);
    } catch (err) { /* speech is a bonus, never a hard requirement */ }
  }

  /* ================================================================== *
   * Toast
   * ================================================================== */

  var toastTimer = null;
  function toast(message) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    // force reflow so the transition replays
    void el.offsetWidth;
    el.classList.add('is-open');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('is-open');
      setTimeout(function () { el.hidden = true; }, 400);
    }, 2600);
  }

  /* ================================================================== *
   * Actions
   * ================================================================== */

  function toggleIn(list, value) {
    var i = list.indexOf(value);
    if (i === -1) list.push(value); else list.splice(i, 1);
  }

  function startSession() {
    var sess = makeSession();
    if (!sess.queue.length) { toast(t('study.noCards')); return; }
    state.session = sess;
    go('study/run');
  }

  function revealSession() {
    var sess = state.session;
    if (!sess || sess.revealed) return;
    sess.revealed = true;
    render();
  }

  function gradeSession(known) {
    var sess = state.session;
    var word = sessionCard();
    if (!sess || !word) return;
    srs.grade(word.id, !!known);
    if (known) sess.right++; else { sess.wrong++; sess.retry.push(word); }
    advanceSession();
  }

  function advanceSession() {
    var sess = state.session;
    if (!sess) return;
    sess.index++;
    sess.revealed = false;
    sess.options = null;
    sess.picked = null;

    if (sess.index >= sess.queue.length) {
      /* One extra pass with whatever was missed, then the session is over. */
      if (sess.retry.length && sess.retryPasses < 1) {
        sess.retryPasses++;
        sess.queue = sess.queue.concat(sess.retry.splice(0, sess.retry.length));
        sess.index = 0;
      } else {
        sess.finished = true;
      }
    }
    render();
  }

  function answerOption(index) {
    var sess = state.session;
    if (!sess || sess.revealed || !sess.options) return;
    sess.picked = index;
    sess.revealed = true;
    render();
  }

  function exportProgress() {
    var blob = new global.Blob([srs.exportData()], { type: 'application/json' });
    var url = global.URL.createObjectURL(blob);
    var link = doc.createElement('a');
    link.href = url;
    link.download = 'gnumarus-progress-' + srs.dayKey() + '.json';
    doc.body.appendChild(link);
    link.click();
    doc.body.removeChild(link);
    setTimeout(function () { global.URL.revokeObjectURL(url); }, 1000);
    toast(t('progress.exportTitle'));
  }

  function importProgress(file) {
    if (!file) return;
    var reader = new global.FileReader();
    reader.onload = function () {
      toast(srs.importData(String(reader.result)) ? t('progress.importOk') : t('progress.importError'));
      render();
    };
    reader.onerror = function () { toast(t('progress.importError')); };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!global.confirm(t('progress.resetTitle') + '\n\n' + t('progress.resetBody'))) return;
    srs.reset();
    state.session = null;
    toast(t('progress.resetDone'));
    render();
  }

  /* ================================================================== *
   * Global event delegation
   * ================================================================== */

  function bindGlobalEvents() {
    doc.addEventListener('click', onClick);
    doc.addEventListener('input', onInput);
    doc.addEventListener('change', onChange);
    doc.addEventListener('keydown', onKeydown);
  }

  function flipCard(el) {
    var id = el.getAttribute('data-card');
    state.flipped[id] = !state.flipped[id];
    el.classList.toggle('is-flipped', state.flipped[id]);
    el.setAttribute('aria-expanded', String(!!state.flipped[id]));
  }

  function onClick(event) {
    var el = event.target;
    if (!el || !el.closest) return;

    var speakEl = el.closest('[data-speak]');
    if (speakEl) { speak(speakEl.getAttribute('data-text'), speakEl.getAttribute('data-speak')); return; }

    var cardEl = el.closest('[data-card]');
    if (cardEl) { flipCard(cardEl); return; }

    var cat = el.closest('[data-cat]');
    if (cat) { toggleIn(state.cats, cat.getAttribute('data-cat')); state.page = 1; render(); return; }

    var type = el.closest('[data-type]');
    if (type) { toggleIn(state.types, type.getAttribute('data-type')); state.page = 1; render(); return; }

    /* Both pager lookups are scoped to the pager: a bare `[data-page]` on an
       ancestor would be picked up by closest() and send the reader straight
       back to the page they are already on. */
    var pageBtn = el.closest('#deckPager [data-page]');
    if (pageBtn) { setPage(parseInt(pageBtn.getAttribute('data-page'), 10) || 1); return; }

    var stepBtn = el.closest('#deckPager [data-page-step]');
    if (stepBtn && !stepBtn.disabled) {
      setPage(state.page + (parseInt(stepBtn.getAttribute('data-page-step'), 10) || 0));
      return;
    }

    var mode = el.closest('[data-mode]');
    if (mode) { state.setup.mode = mode.getAttribute('data-mode'); render(); return; }

    var source = el.closest('[data-source]');
    if (source) {
      var src = source.getAttribute('data-source');
      if (src !== state.setup.source) {
        state.setup.source = src;
        state.setup.targets = state.setup.targets.filter(function (id) { return id !== src; });
        if (!state.setup.targets.length) {
          state.setup.targets = availableLanguages().filter(function (id) { return id !== src; }).slice(0, 1);
        }
        render();
      }
      return;
    }

    var target = el.closest('[data-target]');
    if (target) { toggleIn(state.setup.targets, target.getAttribute('data-target')); render(); return; }

    var size = el.closest('[data-size]');
    if (size) { state.setup.size = parseInt(size.getAttribute('data-size'), 10) || 20; render(); return; }

    if (el.closest('#startSession')) { startSession(); return; }
    if (el.closest('#clearFilters')) {
      state.q = ''; state.cats = []; state.types = []; state.hideMastered = false; state.page = 1;
      render();
      return;
    }
    if (el.closest('#revealBtn')) { revealSession(); return; }
    if (el.closest('#studyAgain')) { startSession(); return; }

    var grade = el.closest('[data-grade]');
    if (grade) {
      var value = grade.getAttribute('data-grade');
      if (value === 'next') {
        var sess = state.session;
        if (sess && sess.mode === 'quiz' && sess.revealed && sess.picked !== null) {
          var word = sess.queue[sess.index];
          var known = !!(sess.options[sess.picked] && sess.options[sess.picked].right);
          srs.grade(word.id, known);
          if (known) sess.right++; else { sess.wrong++; sess.retry.push(word); }
        }
        advanceSession();
      } else {
        gradeSession(value === '1');
      }
      return;
    }

    var option = el.closest('[data-option]');
    if (option && !option.disabled) { answerOption(parseInt(option.getAttribute('data-option'), 10)); return; }

    var themeSet = el.closest('[data-theme-set]');
    if (themeSet) {
      ui.theme = themeSet.getAttribute('data-theme-set');
      saveUI();
      applyTheme();
      render();
      return;
    }

    var uiLang = el.closest('[data-uilang]');
    if (uiLang) { setUiLang(uiLang.getAttribute('data-uilang')); return; }

    var cardLang = el.closest('[data-cardlang]');
    if (cardLang) {
      var id = cardLang.getAttribute('data-cardlang');
      var langs = cardLangs().slice();
      toggleIn(langs, id);
      if (langs.length < 2) { toast(t('settings.cardLanguagesHint')); return; }
      ui.cardLangs = langs;
      saveUI();
      state.session = null;
      render();
      return;
    }

    if (el.closest('#themeBtn')) {
      ui.theme = doc.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      saveUI();
      applyTheme();
      render();
      return;
    }

    if (el.closest('#exportBtn')) { exportProgress(); return; }
    if (el.closest('#importBtn')) { $('#importFile').click(); return; }
    if (el.closest('#resetBtn')) { resetProgress(); return; }
  }

  function onInput(event) {
    var el = event.target;
    if (!el || el.id !== 'deckSearch') return;
    state.q = el.value;
    /* A new search is a new result set, so start it at the top instead of
       leaving the reader on page 4 of a list that just shrank. */
    state.page = 1;
    refreshDeck();
  }

  function onChange(event) {
    var el = event.target;
    if (!el) return;

    if (el.id === 'hideMastered') { state.hideMastered = el.checked; state.page = 1; render(); return; }
    if (el.id === 'uiLang') { setUiLang(el.value); return; }
    if (el.id === 'speechToggle') { ui.speech = el.checked; saveUI(); return; }
    if (el.id === 'motionToggle') { ui.motion = el.checked; saveUI(); applyMotion(); return; }
    if (el.id === 'importFile') { importProgress(el.files && el.files[0]); el.value = ''; return; }
  }

  function onKeydown(event) {
    var el = event.target;
    var tag = (el && el.tagName) || '';
    var typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    /* Cards are div[role=button], so Enter/Space must be handled by hand. */
    if (!typing && el && el.getAttribute && el.getAttribute('data-card') &&
        (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      flipCard(el);
      return;
    }

    var sess = state.session;
    if (event.key === 'Escape' && sess) { state.session = null; go('study'); return; }
    if (typing || !sess) return;
    if (state.view !== 'session') return;

    var key = event.key;
    if (key === ' ' || key === 'Enter') {
      if (sess.mode === 'quiz' && !sess.revealed) return; // waiting for a choice
      event.preventDefault();
      if (!sess.revealed) revealSession();
      else if (sess.mode === 'quiz') {
        var gradeBtn = $('[data-grade="next"]');
        if (gradeBtn) gradeBtn.click();
      } else gradeSession(true);
      return;
    }
    if (sess.mode === 'quiz' && !sess.revealed && /^[1-4]$/.test(key)) {
      event.preventDefault();
      answerOption(parseInt(key, 10) - 1);
      return;
    }
    if (sess.mode !== 'quiz' && /^[12]$/.test(key)) {
      event.preventDefault();
      gradeSession(key === '2');
    }
  }

  /* ================================================================== *
   * Language switching
   * ================================================================== */

  function setUiLang(lang) {
    if (!i18n.LOCALES[lang]) return;
    ui.lang = lang;
    saveUI();
    /* setUiLang itself is one of several callers, and set() does not call
       listeners when the language has not actually changed, so the rebuild is
       done here as well. It is idempotent. */
    buildLangPicker();
    buildTabs();
    i18n.set(lang);
    i18n.apply(doc);
    render();
  }

  i18n.onChange(function () {
    /* Every route to a new language lands here, not just the picker: a stored
       preference, a deep link, or i18n.set() called by something else. The
       header, the tabs and the cards all have to follow, so re-localise the
       whole document and redraw — keeping only the <select> in sync left the
       tagline and every tab reading in the previous language. */
    var select = $('#uiLang');
    if (select) select.value = i18n.current;
    i18n.apply(doc);
    render();
  });

  /* ================================================================== *
   * Go
   * ================================================================== */

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();

  LLC.app = { render: render, speak: speak, toast: toast, state: state, ui: ui };
})(window);
