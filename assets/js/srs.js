/*!
 * srs.js - Leitner-box scheduling plus progress bookkeeping.
 *
 * Every card lives in one of six boxes. Answering correctly pushes it one box
 * further away in time; answering wrong sends it back to the first box. A card
 * in the last box counts as "mastered".
 *
 * All state lives behind LLC.store, so it degrades to an in-memory object when
 * the browser refuses local storage (common with `file://`).
 */
(function (global) {
  'use strict';

  var LLC = global.LLC || (global.LLC = {});
  var KEY = 'progress.v1';
  var DAY = 86400000;

  /* Days until a card in box N comes back. Box 0 is always due immediately. */
  var INTERVALS = [0, 1, 2, 4, 9, 21];
  var MAX_BOX = INTERVALS.length - 1;

  function blank() {
    return { cards: {}, stats: { streak: 0, best: 0, lastDay: '', days: {} }, updatedAt: 0 };
  }

  var data = blank();

  /* ------------------------------------------------------------------ *
   * Day helpers (local time, no Intl dependency)
   * ------------------------------------------------------------------ */

  function dayKey(ts) {
    var d = new Date(ts === undefined ? Date.now() : ts);
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }

  function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  /* ------------------------------------------------------------------ *
   * Persistence
   * ------------------------------------------------------------------ */

  function load() {
    var stored = LLC.store.get(KEY, null);
    data = blank();
    if (stored && typeof stored === 'object') {
      if (stored.cards && typeof stored.cards === 'object') data.cards = stored.cards;
      if (stored.stats && typeof stored.stats === 'object') {
        data.stats.streak = stored.stats.streak || 0;
        data.stats.best = stored.stats.best || 0;
        data.stats.lastDay = stored.stats.lastDay || '';
        data.stats.days = stored.stats.days || {};
      }
    }
    // Guard against a hand-edited or truncated file.
    for (var id in data.cards) {
      if (!Object.prototype.hasOwnProperty.call(data.cards, id)) continue;
      var rec = data.cards[id];
      if (!rec || typeof rec !== 'object') { delete data.cards[id]; continue; }
      rec.box = Math.max(0, Math.min(MAX_BOX, rec.box | 0));
      rec.seen = rec.seen | 0;
      rec.correct = rec.correct | 0;
      rec.lapses = rec.lapses | 0;
      rec.due = +rec.due || 0;
      rec.last = +rec.last || 0;
    }
    return data;
  }

  function save() {
    data.updatedAt = Date.now();
    LLC.store.set(KEY, data);
  }

  /* ------------------------------------------------------------------ *
   * Card records
   * ------------------------------------------------------------------ */

  function card(id) {
    var rec = data.cards[id];
    if (rec) return rec;
    rec = { box: 0, seen: 0, correct: 0, lapses: 0, due: 0, last: 0 };
    data.cards[id] = rec;
    return rec;
  }

  function peek(id) {
    return data.cards[id] || null;
  }

  /** True when the card exists and has been answered at least once. */
  function touched(id) {
    var rec = data.cards[id];
    return !!(rec && rec.seen > 0);
  }

  function isMastered(id) {
    var rec = data.cards[id];
    return !!(rec && rec.box >= MAX_BOX);
  }

  function isDue(id, now) {
    var rec = data.cards[id];
    if (!rec || rec.seen === 0) return false;
    return rec.due <= (now || Date.now());
  }

  /**
   * Record an answer and reschedule the card.
   * @returns {object} the updated record
   */
  function grade(id, known) {
    var rec = card(id);
    var now = Date.now();
    var today = dayKey(now);

    rec.seen += 1;
    if (known) {
      rec.correct += 1;
      rec.box = Math.min(MAX_BOX, rec.box + 1);
    } else {
      rec.lapses += 1;
      rec.box = 0;
    }
    rec.last = now;
    rec.due = now + INTERVALS[rec.box] * DAY;

    var stats = data.stats;
    stats.days[today] = stats.days[today] || { reviewed: 0, correct: 0 };
    stats.days[today].reviewed += 1;
    if (known) stats.days[today].correct += 1;

    if (stats.lastDay !== today) {
      var yesterday = dayKey(now - DAY);
      stats.streak = stats.lastDay === yesterday ? stats.streak + 1 : 1;
      stats.lastDay = today;
      if (stats.streak > stats.best) stats.best = stats.streak;
    }

    save();
    return rec;
  }

  /* ------------------------------------------------------------------ *
   * Deck selection
   * ------------------------------------------------------------------ */

  /**
   * Build a study queue: due cards first (hardest first), then unseen cards up
   * to `limit`. With `allowAny`, whatever room is left is filled with the
   * least recently reviewed cards, so "Learn" always has something to do even
   * when nothing is due and nothing is new.
   */
  function queue(options) {
    options = options || {};
    var limit = options.limit || 20;
    var includeNew = options.includeNew !== false;
    var allowAny = !!options.allowAny;
    var words = options.words || LLC.data.words;
    var now = options.now || Date.now();
    var taken = Object.create(null);

    var due = [], fresh = [], rest = [];
    words.forEach(function (word) {
      var rec = data.cards[word.id];
      if (!rec || rec.seen === 0) { fresh.push(word); return; }
      if (rec.due <= now) { due.push(word); return; }
      rest.push(word);
    });

    due.sort(function (a, b) {
      var ra = data.cards[a.id], rb = data.cards[b.id];
      if (ra.box !== rb.box) return ra.box - rb.box;   /* weakest box first */
      return ra.due - rb.due;                             /* then the oldest */
    });

    var picked = due.slice(0, limit);
    picked.forEach(function (w) { taken[w.id] = true; });

    if (includeNew && picked.length < limit) {
      for (var i = 0; i < fresh.length && picked.length < limit; i++) {
        picked.push(fresh[i]);
        taken[fresh[i].id] = true;
      }
    }

    if (allowAny && picked.length < limit) {
      rest.sort(function (a, b) {
        var ra = data.cards[a.id], rb = data.cards[b.id];
        if (ra.box !== rb.box) return ra.box - rb.box;
        return ra.last - rb.last;                        /* least recent first */
      });
      for (var j = 0; j < rest.length && picked.length < limit; j++) {
        if (taken[rest[j].id]) continue;
        picked.push(rest[j]);
        taken[rest[j].id] = true;
      }
    }

    return {
      cards: picked,
      dueCount: due.length,
      newCount: picked.filter(function (w) { return !data.cards[w.id] || data.cards[w.id].seen === 0; }).length
    };
  }

  /* ------------------------------------------------------------------ *
   * Aggregates
   * ------------------------------------------------------------------ */

  function summary() {
    var words = LLC.data.words;
    var total = words.length;
    var mastered = 0, learning = 0, unseen = 0, due = 0;
    var studiedCards = 0, answers = 0, correct = 0;
    var now = Date.now();
    var today = dayKey(now);

    words.forEach(function (word) {
      var rec = data.cards[word.id];
      if (!rec || rec.seen === 0) { unseen++; return; }
      studiedCards++;
      /* Accuracy is per *answer*, not per card: a card answered three times
         counts three times, otherwise repeating a card can push the ratio
         above 100%. */
      answers += rec.seen;
      correct += rec.correct;
      if (rec.box >= MAX_BOX) mastered++; else learning++;
      if (rec.due <= now) due++;
    });

    var todayRec = data.stats.days[today] || { reviewed: 0, correct: 0 };

    return {
      total: total,
      mastered: mastered,
      learning: learning,
      unseen: unseen,
      due: due,
      reviewed: studiedCards,
      answers: answers,
      correct: correct,
      accuracy: answers ? Math.round((correct / answers) * 100) : 0,
      streak: data.stats.streak,
      best: data.stats.best,
      today: todayRec
    };
  }

  function byCategory() {
    var out = LLC.data.categories.map(function (cat) {
      return { id: cat.id, total: 0, mastered: 0, learning: 0, unseen: 0 };
    });
    var index = Object.create(null);
    out.forEach(function (row, i) { index[row.id] = i; });

    LLC.data.words.forEach(function (word) {
      var row = out[index[word.cat]];
      if (!row) return;
      row.total++;
      var rec = data.cards[word.id];
      if (!rec || rec.seen === 0) { row.unseen++; return; }
      if (rec.box >= MAX_BOX) row.mastered++; else row.learning++;
    });
    return out;
  }

  /** Reviews per day for the last `days` days, oldest first. */
  function history(days) {
    days = days || 14;
    var now = Date.now();
    var out = [];
    for (var i = days - 1; i >= 0; i--) {
      var ts = now - i * DAY;
      var rec = data.stats.days[dayKey(ts)] || { reviewed: 0, correct: 0 };
      out.push({ day: dayKey(ts), reviewed: rec.reviewed, correct: rec.correct, isToday: i === 0 });
    }
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Transfer
   * ------------------------------------------------------------------ */

  function reset() {
    data = blank();
    save();
  }

  function exportData() {
    return JSON.stringify({
      app: 'gnumarus-language-cards',
      schema: 1,
      exportedAt: new Date().toISOString(),
      progress: data
    }, null, 2);
  }

  function importData(text) {
    var parsed;
    try { parsed = JSON.parse(text); } catch (err) { return false; }
    var incoming = parsed && (parsed.progress || parsed);
    if (!incoming || typeof incoming !== 'object' || typeof incoming.cards !== 'object') return false;
    data = blank();
    if (typeof incoming.cards === 'object') data.cards = incoming.cards;
    if (incoming.stats && typeof incoming.stats === 'object') {
      data.stats = {
        streak: incoming.stats.streak | 0,
        best: incoming.stats.best | 0,
        lastDay: incoming.stats.lastDay || '',
        days: incoming.stats.days || {}
      };
    }
    load();  // normalise
    save();
    return true;
  }

  load();

  LLC.srs = {
    MAX_BOX: MAX_BOX,
    INTERVALS: INTERVALS,
    dayKey: dayKey,
    startOfToday: startOfToday,
    reload: load,
    card: card,
    peek: peek,
    touched: touched,
    isMastered: isMastered,
    isDue: isDue,
    grade: grade,
    queue: queue,
    summary: summary,
    byCategory: byCategory,
    history: history,
    reset: reset,
    exportData: exportData,
    importData: importData,
    raw: function () { return data; }
  };
})(window);
