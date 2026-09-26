/*!
 * storage.js - Tiny persistence layer.
 *
 * `localStorage` is not guaranteed to work when the page is opened through
 * `file://` (some browsers use an opaque origin and throw on access), and
 * private-mode browsers can throw on write as well. Every access is therefore
 * guarded and falls back to an in-memory map so the app never breaks.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC || (global.LLC = {});

  var PREFIX = 'gnumarus.';
  var memory = Object.create(null);
  var backend = null;
  var probed = false;

  function probe() {
    if (probed) return backend;
    probed = true;
    try {
      var ls = global.localStorage;
      if (!ls) return (backend = null);
      var key = PREFIX + '__probe__';
      ls.setItem(key, '1');
      ls.removeItem(key);
      backend = ls;
    } catch (err) {
      backend = null;
    }
    return backend;
  }

  var store = {
    /** True when values survive a page reload. */
    get persistent() { return probe() !== null; },

    get: function (key, fallback) {
      var raw;
      try {
        var ls = probe();
        raw = ls ? ls.getItem(PREFIX + key) : memory[key];
      } catch (err) {
        raw = memory[key];
      }
      if (raw === null || raw === undefined) return fallback;
      try {
        return JSON.parse(raw);
      } catch (err) {
        return raw;
      }
    },

    set: function (key, value) {
      var raw;
      try { raw = JSON.stringify(value); } catch (err) { return false; }
      memory[key] = raw;
      try {
        var ls = probe();
        if (ls) { ls.setItem(PREFIX + key, raw); return true; }
      } catch (err) { /* quota exceeded or blocked: keep the in-memory copy */ }
      return false;
    },

    remove: function (key) {
      delete memory[key];
      try {
        var ls = probe();
        if (ls) ls.removeItem(PREFIX + key);
      } catch (err) { /* ignore */ }
    },

    keys: function () {
      var out = [];
      try {
        var ls = probe();
        var source = ls ? ls : memory;
        for (var k in source) {
          if (Object.prototype.hasOwnProperty.call(source, k) && k.indexOf(PREFIX) === 0) {
            out.push(k.slice(PREFIX.length));
          }
        }
      } catch (err) {
        for (var m in memory) if (Object.prototype.hasOwnProperty.call(memory, m)) out.push(m);
      }
      return out;
    }
  };

  LLC.store = store;
})(window);
