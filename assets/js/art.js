/*!
 * art.js - Vector artwork for every card.
 *
 * Each word owns a hand-built SVG drawn from a tiny shape vocabulary, so the
 * whole deck is a handful of kilobytes of code, scales to any screen size,
 * prints cleanly and needs no image files (which keeps `file://` happy).
 *
 * Style: flat shapes, one soft background, no filters, no external references.
 * Missing art is replaced by a deterministic geometric fallback, so a card can
 * never render as a broken image.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC || (global.LLC = {});

  /* ------------------------------------------------------------------ *
   * Shape vocabulary
   * ------------------------------------------------------------------ */

  function attrs(extra) { return extra ? ' ' + extra : ''; }

  function c(cx, cy, r, fill, extra) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + attrs(extra) + '/>';
  }
  function e(cx, cy, rx, ry, fill, extra) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + attrs(extra) + '/>';
  }
  function rc(x, y, w, h, fill, radius, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (radius || 0) + '" fill="' + fill + '"' + attrs(extra) + '/>';
  }
  function p(d, fill, extra) {
    return '<path d="' + d + '" fill="' + fill + '"' + attrs(extra) + '/>';
  }
  function ps(d, stroke, width, extra) {
    return '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + (width || 3) + '" stroke-linecap="round" stroke-linejoin="round"' + attrs(extra) + '/>';
  }
  function pl(points, fill, extra) {
    return '<polygon points="' + points + '" fill="' + fill + '"' + attrs(extra) + '/>';
  }
  function ln(x1, y1, x2, y2, stroke, width, extra) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + stroke + '" stroke-width="' + (width || 3) + '" stroke-linecap="round"' + attrs(extra) + '/>';
  }
  function txt(x, y, value, size, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="ui-rounded,Segoe UI,system-ui,sans-serif" font-size="' + size + '" font-weight="700" fill="' + fill + '" text-anchor="' + (anchor || 'middle') + '">' + value + '</text>';
  }

  /* Frequently reused colours, so the deck looks like one family. */
  var SKIN = '#f4c8a6';
  var SKIN_D = '#dda57e';
  var NIGHT = '#2f2a3d';
  var WHITE = '#fdfdff';

  /* ------------------------------------------------------------------ *
   * Scene wrapper
   * ------------------------------------------------------------------ */

  function scene(inner, opts) {
    opts = opts || {};
    var ground = '';
    if (opts.ground !== false) {
      ground = '<ellipse cx="60" cy="103" rx="' + (opts.groundW || 38) + '" ry="' + (opts.groundRy || 6) + '" fill="rgba(15,23,42,.09)"/>';
    }
    return '<svg class="art" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<rect width="120" height="120" rx="16" fill="' + (opts.bg || '#eef4fb') + '"/>' +
      ground + inner + '</svg>';
  }

  /* ------------------------------------------------------------------ *
   * Fallback art
   * ------------------------------------------------------------------ */

  var FALLBACK_TONES = [
    ['#fde68a', '#f59e0b'], ['#bfdbfe', '#3b82f6'], ['#bbf7d0', '#22c55e'],
    ['#fecdd3', '#f43f5e'], ['#ddd6fe', '#8b5cf6'], ['#bae6fd', '#0ea5e9'],
    ['#fed7aa', '#fb923c'], ['#c7d2fe', '#6366f1']
  ];

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }

  function fallback(id) {
    var h = hash(id || '?');
    var tone = FALLBACK_TONES[h % FALLBACK_TONES.length];
    var parts = [];
    var i;
    for (i = 0; i < 4; i++) {
      var cx = 30 + ((h >> (i * 3)) % 60);
      var cy = 32 + ((h >> (i * 4 + 2)) % 48);
      var r = 10 + ((h >> (i * 2 + 5)) % 16);
      parts.push(c(cx, cy, r, i % 2 ? tone[0] : tone[1], 'opacity=".55"'));
    }
    parts.push(c(60, 60, 22, 'rgba(255,255,255,.75)'));
    return scene(parts.join(''), { bg: tone[0], ground: false });
  }

  /* ------------------------------------------------------------------ *
   * Shared human figure
   * ------------------------------------------------------------------ */

  /* A simple front-facing person. x,y = head centre. scale = 1 fills ~40px. */
  function person(x, y, opts) {
    opts = opts || {};
    var s = opts.scale || 1;
    var skin = opts.skin || SKIN;
    var shirt = opts.shirt || '#4f7df3';
    var pants = opts.pants || '#3b4a6b';
    var hair = opts.hair || '#3a2f2a';
    var u = function (v) { return Math.round(v * s * 10) / 10; };
    var parts = [];
    if (opts.legs !== false) {
      parts.push(rc(x - u(9), y + u(22), u(7), u(22), pants, u(3)));
      parts.push(rc(x + u(2), y + u(22), u(7), u(22), pants, u(3)));
      parts.push(rc(x - u(10), y + u(42), u(9), u(4), NIGHT, u(2)));
      parts.push(rc(x + u(1), y + u(42), u(9), u(4), NIGHT, u(2)));
    }
    parts.push(rc(x - u(12), y + u(9), u(24), u(16), shirt, u(7)));
    if (opts.arms !== false) {
      parts.push(rc(x - u(18), y + u(11), u(6), u(17), shirt, u(3)));
      parts.push(rc(x + u(12), y + u(11), u(6), u(17), shirt, u(3)));
      parts.push(c(x - u(15), y + u(28), u(3.4), skin));
      parts.push(c(x + u(15), y + u(28), u(3.4), skin));
    }
    if (opts.longHair) {
      parts.push(e(x - u(11), y + u(2), u(5), u(16), hair));
      parts.push(e(x + u(11), y + u(2), u(5), u(16), hair));
    }
    parts.push(c(x, y, u(11), skin));
    parts.push(p('M' + (x - u(11)) + ',' + (y - u(2)) + ' a' + u(11) + ',' + u(11) + ' 0 0 1 ' + u(22) + ',0 z', hair));
    if (opts.beard) {
      parts.push(p('M' + (x - u(8)) + ',' + (y + u(1)) + ' q' + u(8) + ',' + u(16) + ' ' + u(16) + ',0 q-' + u(3) + ',' + u(-6) + ' -' + u(8) + ',' + u(-6) + ' q-' + u(5) + ',0 -' + u(8) + ',' + u(6) + ' z', hair));
    }
    if (opts.hat) {
      parts.push(p('M' + (x - u(14)) + ',' + (y - u(6)) + ' h' + u(28) + ' v' + u(-3) + ' h' + u(-28) + ' z', opts.hat));
      parts.push(p('M' + (x - u(9)) + ',' + (y - u(6)) + ' v' + u(-8) + ' h' + u(18) + ' v' + u(8) + ' z', opts.hat));
    }
    if (opts.eyes !== false) {
      parts.push(c(x - u(4), y + u(1), u(1.5), NIGHT));
      parts.push(c(x + u(4), y + u(1), u(1.5), NIGHT));
    }
    if (opts.smile) parts.push(ps('M' + (x - u(4)) + ',' + (y + u(5)) + ' q' + u(4) + ',' + u(4) + ' ' + u(8) + ',0', NIGHT, u(1.6)));
    return parts.join('');
  }

  /* ------------------------------------------------------------------ *
   * The artwork
   * ------------------------------------------------------------------ */

  var ART = {};

  /* ------------------------------------------------------- animals (16) */

  ART.cow = function () {
    var line = 'stroke="#d3c9b6" stroke-width="2"';
    return scene(
      rc(28, 72, 10, 33, '#fdfaf4', 5, line) + rc(42, 76, 10, 29, '#fdfaf4', 5, line) +
      rc(66, 76, 10, 29, '#fdfaf4', 5, line) + rc(80, 72, 10, 33, '#fdfaf4', 5, line) +
      rc(28, 99, 10, 7, '#3f3b4a', 3) + rc(42, 99, 10, 7, '#3f3b4a', 3) +
      rc(66, 99, 10, 7, '#3f3b4a', 3) + rc(80, 99, 10, 7, '#3f3b4a', 3) +
      e(54, 62, 33, 21, '#fdfaf4', line) +
      e(40, 54, 14, 11, '#3f3b4a') + e(72, 70, 12, 8, '#3f3b4a') +
      ps('M22,50 C11,56 10,76 19,84', '#fdfaf4', 5) + e(19, 86, 5, 6, '#3f3b4a') +
      p('M74,46 C84,40 92,38 100,38 L102,58 C94,58 84,60 76,64 Z', '#fdfaf4', line) +
      e(96, 48, 15, 13, '#fdfaf4', line) +
      e(88, 53, 8, 6, '#3f3b4a') +
      e(79, 38, 9, 5, '#e8b79c', 'transform="rotate(-30 79 38)"') +
      ps('M88,34 C88,27 93,26 94,31', '#e8dcbe', 3) +
      ps('M100,33 C101,26 106,26 106,31', '#e8dcbe', 3) +
      c(95, 44, 2.4, '#1f1d26') +
      e(101, 58, 9, 6.5, '#f2bcbc') +
      c(98, 58, 1.4, '#c98d8d') + c(104, 58, 1.4, '#c98d8d'),
      { bg: '#fff1e0' });
  };

  ART.dog = function () {
    return scene(
      rc(38, 84, 9, 22, '#c98a4b', 4) + rc(56, 86, 9, 20, '#c98a4b', 4) +
      rc(70, 86, 9, 20, '#c98a4b', 4) + rc(84, 84, 9, 22, '#c98a4b', 4) +
      ps('M32,66 C18,58 16,44 26,42', '#c98a4b', 7) +
      e(58, 72, 30, 20, '#d69a56') + e(58, 78, 16, 10, '#f0d7ae') +
      c(88, 54, 20, '#d69a56') +
      p('M70,42 C58,40 54,54 62,62 C70,68 76,58 74,48 Z', '#8d5a2b') +
      p('M100,40 C112,36 116,52 106,60 C98,64 94,52 98,44 Z', '#8d5a2b') +
      e(88, 64, 11, 8, '#f6e2c0') + c(88, 58, 4.5, '#3b2b23') +
      c(80, 50, 2.3, NIGHT) + ps('M88,69 L88,73', '#a06a3c', 2),
      { bg: '#fff1e0' });
  };

  ART.cat = function () {
    return scene(
      e(58, 78, 26, 18, '#8e93a8') +
      ps('M84,80 C104,78 106,58 92,54', '#8e93a8', 7) +
      pl('66,50 62,28 80,42', '#8e93a8') + pl('92,50 96,28 78,42', '#8e93a8') +
      pl('69,47 67,34 77,43', '#f0a8b8') + pl('89,47 91,34 81,43', '#f0a8b8') +
      c(79, 58, 19, '#8e93a8') +
      e(79, 66, 11, 8, '#f4f6fb') +
      c(71, 54, 2.4, '#2f7a3d') + c(87, 54, 2.4, '#2f7a3d') + c(71, 54, 1, NIGHT) + c(87, 54, 1, NIGHT) +
      p('M76,64 L82,64 L79,68 Z', '#e08a9c') +
      ps('M79,68 L79,71', '#c06f83', 1.6) +
      ln(64, 62, 52, 58, '#9aa0b5', 1.4) + ln(64, 66, 51, 66, '#9aa0b5', 1.4) + ln(64, 70, 52, 74, '#9aa0b5', 1.4) +
      ln(94, 62, 106, 58, '#9aa0b5', 1.4) + ln(94, 66, 107, 66, '#9aa0b5', 1.4) + ln(94, 70, 106, 74, '#9aa0b5', 1.4),
      { bg: '#fff1e0' });
  };

  ART.horse = function () {
    return scene(
      rc(28, 80, 11, 24, '#8a5a33', 5) + rc(42, 84, 11, 20, '#8a5a33', 5) +
      rc(64, 84, 11, 20, '#8a5a33', 5) + rc(78, 80, 11, 24, '#8a5a33', 5) +
      rc(28, 99, 11, 6, '#4a2c17', 2.5) + rc(42, 99, 11, 6, '#4a2c17', 2.5) +
      rc(64, 99, 11, 6, '#4a2c17', 2.5) + rc(78, 99, 11, 6, '#4a2c17', 2.5) +
      ps('M22,60 C10,56 6,72 10,84', '#3f2a1a', 6) +
      e(52, 70, 34, 20, '#a97244') +
      p('M72,58 C80,44 88,34 94,30 L101,45 C95,51 88,61 84,72 Z', '#a97244') +
      p('M70,58 C78,42 86,32 92,28 L97,37 C90,43 82,55 76,69 Z', '#3f2a1a') +
      p('M96,30 C108,28 117,36 115,47 C113,59 101,63 92,59 C86,49 88,34 96,30 Z', '#a97244') +
      pl('94,32 88,19 100,27', '#a97244') +
      p('M90,32 C84,40 86,50 92,54 C88,44 88,34 93,29 Z', '#3f2a1a') +
      c(101, 39, 2.3, '#1a1a1f') +
      e(107, 55, 7, 5, '#4a2c17') + c(105, 54, 1.1, '#1a1a1f') + c(109, 55, 1.1, '#1a1a1f'),
      { bg: '#fff1e0' });
  };

  ART.bird = function () {
    return scene(
      e(56, 66, 26, 22, '#4aa3e0') +
      p('M40,58 C30,44 44,40 54,54 Z', '#3a86c4') +
      p('M34,72 L20,66 L30,78 Z', '#2f6fa8') +
      c(78, 46, 15, '#4aa3e0') +
      pl('91,44 108,50 91,56', '#f2a63b') +
      c(82, 43, 2.4, NIGHT) + c(82.8, 42.2, .9, WHITE) +
      ps('M74,36 C78,28 90,28 92,34', '#3a86c4', 4) +
      ln(56, 88, 56, 98, '#f2a63b', 2.6) + ln(64, 88, 64, 98, '#f2a63b', 2.6) +
      ln(52, 98, 60, 98, '#f2a63b', 2.6) + ln(60, 98, 68, 98, '#f2a63b', 2.6),
      { bg: '#fff1e0' });
  };

  ART.fish = function () {
    return scene(
      p('M18,60 C30,34 74,30 92,58 C74,86 30,86 18,60 Z', '#f58f4c') +
      p('M92,58 L112,42 L112,78 Z', '#e2703a') +
      p('M52,44 C56,32 70,32 72,44 Z', '#e2703a') +
      p('M52,76 C56,88 70,88 72,76 Z', '#e2703a') +
      c(40, 52, 6, '#ffd7a8') + c(40, 52, 3, NIGHT) +
      p('M60,60 C68,54 78,60 74,66 C70,70 62,66 60,60 Z', '#ffd7a8') +
      c(24, 26, 4, 'rgba(255,255,255,.8)') + c(34, 18, 2.6, 'rgba(255,255,255,.8)'),
      { bg: '#e7f4ff', ground: false });
  };

  ART.bee = function () {
    return scene(
      e(46, 44, 20, 13, '#e2efff', 'transform="rotate(-25 46 44)"') +
      e(76, 46, 20, 13, '#e2efff', 'transform="rotate(25 76 46)"') +
      e(60, 68, 30, 21, '#f5c542') +
      p('M42,52 C40,72 44,82 46,87 L54,86 C50,78 48,66 50,52 Z', '#2f2a3d') +
      p('M60,49 C58,72 60,84 61,89 L69,88 C67,80 66,66 68,49 Z', '#2f2a3d') +
      c(88, 58, 14, '#2f2a3d') +
      c(92, 54, 2.2, WHITE) + c(98, 60, 2.2, WHITE) +
      ps('M94,44 C98,34 106,34 106,30', '#2f2a3d', 2.4) +
      ps('M100,46 C108,42 112,36 112,32', '#2f2a3d', 2.4) +
      pl('88,70 82,80 88,78', '#2f2a3d'),
      { bg: '#fff1e0' });
  };

  ART.butterfly = function () {
    return scene(
      p('M60,58 C34,22 8,30 14,52 C18,70 42,70 60,62 Z', '#f2708f') +
      p('M60,58 C86,22 112,30 106,52 C102,70 78,70 60,62 Z', '#6f8df2') +
      p('M60,64 C40,74 32,96 48,100 C60,103 60,80 60,68 Z', '#ffb3c6') +
      p('M60,64 C80,74 88,96 72,100 C60,103 60,80 60,68 Z', '#a8b9ff') +
      c(60, 62, 5, '#3f3a4d') + c(60, 46, 4, '#3f3a4d') +
      ps('M58,44 C52,32 42,30 40,26', '#3f3a4d', 2.2) + c(39, 25, 2.4, '#3f3a4d') +
      ps('M62,44 C68,32 78,30 80,26', '#3f3a4d', 2.2) + c(81, 25, 2.4, '#3f3a4d') +
      c(32, 44, 4.5, '#ffd6e0') + c(88, 44, 4.5, '#dbe3ff') + c(50, 86, 3.4, '#ffd6e0') + c(70, 86, 3.4, '#dbe3ff'),
      { bg: '#fff1e0', ground: false });
  };

  ART.rabbit = function () {
    return scene(
      e(58, 80, 26, 20, '#e9e6df') + c(80, 82, 9, WHITE) +
      c(38, 68, 20, '#e9e6df') +
      e(28, 40, 7, 20, '#e9e6df', 'transform="rotate(-14 28 40)"') +
      e(48, 40, 7, 20, '#e9e6df', 'transform="rotate(12 48 40)"') +
      e(28, 40, 3.6, 14, '#f7b9c4', 'transform="rotate(-14 28 40)"') +
      e(48, 40, 3.6, 14, '#f7b9c4', 'transform="rotate(12 48 40)"') +
      c(31, 65, 2.6, NIGHT) + c(45, 65, 2.6, NIGHT) +
      e(38, 76, 5, 3.6, '#f7b9c4') + ps('M38,79 L38,82', '#d98ba0', 1.6) +
      ln(26, 76, 12, 73, '#cfccc4', 1.4) + ln(26, 80, 12, 80, '#cfccc4', 1.4) +
      ln(50, 76, 64, 73, '#cfccc4', 1.4) + ln(50, 80, 64, 80, '#cfccc4', 1.4),
      { bg: '#fff1e0' });
  };

  ART.lion = function () {
    return scene(
      rc(36, 84, 10, 22, '#c98a4b', 4) + rc(56, 86, 10, 20, '#c98a4b', 4) +
      rc(72, 86, 10, 20, '#c98a4b', 4) + rc(88, 84, 10, 22, '#c98a4b', 4) +
      ps('M26,68 C12,66 10,50 22,44', '#c98a4b', 5) + e(21, 42, 6, 6, '#8a5a2b') +
      e(58, 70, 32, 20, '#dba066') +
      c(90, 50, 25, '#a05a24') +
      c(90, 50, 17, '#e5b478') +
      c(82, 46, 2.4, NIGHT) + c(98, 46, 2.4, NIGHT) +
      e(90, 58, 9, 7, '#fbe3c0') +
      p('M87,54 L93,54 L90,58 Z', '#8a4b20') +
      ps('M85,62 Q90,67 95,62', '#8a4b20', 1.8) +
      ln(72, 56, 64, 52, '#e5b478', 1.4) + ln(72, 60, 63, 60, '#e5b478', 1.4) +
      ln(108, 56, 116, 52, '#e5b478', 1.4) + ln(108, 60, 117, 60, '#e5b478', 1.4),
      { bg: '#fff1e0' });
  };

  ART.snake = function () {
    return scene(
      ps('M16,96 C40,96 30,72 52,72 C76,72 64,44 88,44 C100,44 104,50 104,56', '#3fa96a', 14) +
      ps('M16,96 C40,96 30,72 52,72 C76,72 64,44 88,44 C100,44 104,50 104,56', '#57c882', 9) +
      c(104, 52, 11, '#57c882') +
      c(101, 48, 2.4, NIGHT) + c(108, 48, 2.4, NIGHT) +
      ps('M110,58 C116,60 120,58 118,54', '#ef6a8a', 2.2) +
      c(20, 30, 3.4, '#57c882') + c(30, 22, 2.4, '#57c882'),
      { bg: '#fff1e0' });
  };

  ART.frog = function () {
    return scene(
      e(60, 76, 32, 22, '#5cb85c') +
      p('M34,80 C20,76 16,90 26,94 C34,97 40,88 34,80 Z', '#4aa24a') +
      p('M86,80 C100,76 104,90 94,94 C86,97 80,88 86,80 Z', '#4aa24a') +
      e(40, 48, 15, 14, '#5cb85c') + e(80, 48, 15, 14, '#5cb85c') +
      c(40, 46, 9, WHITE) + c(80, 46, 9, WHITE) + c(41, 47, 4, NIGHT) + c(79, 47, 4, NIGHT) +
      ps('M32,64 Q60,82 88,64', '#2f6b2f', 3) +
      e(48, 66, 3, 2.4, '#2f6b2f') + e(72, 66, 3, 2.4, '#2f6b2f') +
      c(60, 60, 4, '#7ed07e') + c(24, 68, 3, '#4aa24a') + c(96, 68, 3, '#4aa24a'),
      { bg: '#fff1e0' });
  };

  ART.owl = function () {
    return scene(
      rc(30, 92, 60, 6, '#7c5a3a', 3) +
      e(60, 60, 30, 36, '#8a6a4a') +
      p('M36,32 C36,22 46,20 52,30 Z', '#8a6a4a') + p('M84,32 C84,22 74,20 68,30 Z', '#8a6a4a') +
      c(46, 48, 16, '#f6efe2') + c(74, 48, 16, '#f6efe2') +
      c(46, 48, 8, '#f0a63b') + c(74, 48, 8, '#f0a63b') +
      c(46, 48, 4, NIGHT) + c(74, 48, 4, NIGHT) +
      c(47.5, 46, 1.5, WHITE) + c(75.5, 46, 1.5, WHITE) +
      pl('60,56 54,66 66,66', '#e08a2a') +
      p('M40,74 C36,84 40,92 48,94 L46,80 Z', '#6f5238') +
      p('M80,74 C84,84 80,92 72,94 L74,80 Z', '#6f5238') +
      ln(52, 96, 52, 100, '#e08a2a', 2.4) + ln(68, 96, 68, 100, '#e08a2a', 2.4),
      { bg: '#fff1e0' });
  };

  ART.sheep = function () {
    var wool = 'stroke="#d8d1c0" stroke-width="2"';
    return scene(
      rc(36, 84, 10, 22, '#4a4453', 4) + rc(54, 86, 10, 20, '#4a4453', 4) +
      rc(70, 86, 10, 20, '#4a4453', 4) + rc(84, 84, 10, 22, '#4a4453', 4) +
      c(38, 62, 18, '#fdfcf7', wool) + c(62, 54, 19, '#fdfcf7', wool) + c(84, 62, 18, '#fdfcf7', wool) +
      c(50, 68, 15, '#fdfcf7', wool) + c(72, 68, 15, '#fdfcf7', wool) +
      c(60, 70, 15, '#fdfcf7', wool) +
      c(96, 56, 14, '#4a4453') +
      c(90, 48, 8, '#fdfcf7', wool) +
      e(84, 47, 9, 5, '#4a4453', 'transform="rotate(-32 84 47)"') +
      c(101, 53, 2.3, '#fdfcf7') + c(94, 53, 2.3, '#fdfcf7') +
      e(99, 63, 6, 4, '#3a3542') +
      ps('M96,74 C92,84 86,88 80,86', '#4a4453', 4),
      { bg: '#fff1e0' });
  };

  ART.elephant = function () {
    return scene(
      rc(24, 82, 14, 24, '#93a3b8', 6) + rc(44, 86, 14, 20, '#93a3b8', 6) +
      rc(66, 86, 14, 20, '#93a3b8', 6) + rc(82, 82, 14, 24, '#93a3b8', 6) +
      e(56, 68, 34, 26, '#a3b2c6') +
      c(88, 50, 22, '#a3b2c6') +
      p('M74,42 C62,38 54,52 64,64 C72,72 80,62 78,50 Z', '#8b9ab0') +
      p('M96,62 C104,74 100,90 90,96 C84,99 82,92 88,88 C94,82 92,72 90,66 Z', '#a3b2c6') +
      p('M80,60 C74,62 72,70 76,76 C78,70 80,64 84,62 Z', '#f6f1e4') +
      c(96, 44, 2.4, NIGHT) +
      ps('M100,60 C110,58 114,64 110,70', '#8b9ab0', 3),
      { bg: '#fff1e0' });
  };

  ART.penguin = function () {
    return scene(
      e(60, 68, 26, 34, '#2f3b4d') +
      e(60, 74, 17, 24, '#fdfdff') +
      c(60, 42, 19, '#2f3b4d') +
      p('M46,30 C46,18 74,18 74,30 Z', '#fdfdff') +
      c(52, 40, 3.4, WHITE) + c(68, 40, 3.4, WHITE) + c(52, 40, 1.8, NIGHT) + c(68, 40, 1.8, NIGHT) +
      pl('60,46 52,52 68,52', '#f2a63b') +
      p('M36,58 C26,66 28,80 38,78 C42,72 40,64 40,60 Z', '#3f4c60') +
      p('M84,58 C94,66 92,80 82,78 C78,72 80,64 80,60 Z', '#3f4c60') +
      p('M46,98 C46,94 56,94 56,98 Z', '#f2a63b') + p('M64,98 C64,94 74,94 74,98 Z', '#f2a63b') +
      c(24, 26, 4, '#e8f4ff') + c(94, 22, 3, '#e8f4ff'),
      { bg: '#e7f4ff' });
  };

  /* ---------------------------------------------------------- food (14) */

  ART.apple = function () {
    return scene(
      p('M60,32 C36,22 22,40 26,64 C30,90 48,104 60,96 C72,104 90,90 94,64 C98,40 84,22 60,32 Z', '#e0453f') +
      p('M46,40 C36,48 34,70 40,84 C34,64 38,48 48,42 Z', '#f4796f') +
      ps('M60,32 C60,22 62,16 66,10', '#7a5230', 3.4) +
      p('M64,22 C76,10 92,16 88,28 C84,38 68,32 64,22 Z', '#5cb85c') +
      c(46, 52, 4, 'rgba(255,255,255,.45)'),
      { bg: '#fff0ee' });
  };

  ART.bread = function () {
    return scene(
      e(60, 92, 40, 7, '#e8d9bf') +
      p('M18,92 C18,62 38,44 60,44 C82,44 102,62 102,92 Z', '#d19a52') +
      p('M26,92 C26,68 42,52 60,52 C78,52 94,68 94,92 Z', '#eec089') +
      e(44, 64, 6, 2.6, '#b57a3c', 'transform="rotate(-20 44 64)"') +
      e(62, 60, 6, 2.6, '#b57a3c', 'transform="rotate(6 62 60)"') +
      e(79, 67, 6, 2.6, '#b57a3c', 'transform="rotate(22 79 67)"') +
      e(56, 76, 4, 2, '#c98a4b', 'transform="rotate(-8 56 76)"') +
      e(70, 78, 4, 2, '#c98a4b', 'transform="rotate(10 70 78)"'),
      { bg: '#fff0ee' });
  };

  ART.milk = function () {
    return scene(
      p('M36,34 L84,34 L78,100 L42,100 Z', '#eef4ff', 'opacity=".95"') +
      p('M38,56 L82,56 L78,100 L42,100 Z', '#ffffff') +
      p('M36,34 L42,20 L78,20 L84,34 Z', '#dbe7f7') +
      rc(48, 64, 24, 20, '#7fb2e8', 3) +
      p('M50,80 C50,72 54,68 60,68 C66,68 70,72 70,80 Z', WHITE),
      { bg: '#fff0ee' });
  };

  ART.egg = function () {
    return scene(
      e(60, 84, 40, 9, '#e8dfe8') +
      p('M60,26 C76,26 88,50 88,64 C88,80 76,90 60,90 C44,90 32,80 32,64 C32,50 44,26 60,26 Z', '#fdf6ec') +
      p('M48,42 C42,50 40,62 42,70 C40,58 42,48 48,42 Z', '#ffffff') +
      c(74, 40, 5, 'rgba(0,0,0,.05)'),
      { bg: '#fff0ee' });
  };

  ART.water = function () {
    return scene(
      p('M36,32 L84,32 L78,102 L42,102 Z', '#dbeafe', 'opacity=".85"') +
      p('M38,54 L82,54 L78,102 L42,102 Z', '#5ba8f5') +
      p('M38,54 C44,48 52,60 60,54 C68,48 76,60 82,54 L82,58 L38,58 Z', '#8ec6fb') +
      p('M36,32 L84,32 L82,44 L38,44 Z', '#bfdbfe') +
      p('M96,60 C96,60 104,72 104,78 C104,84 99,88 94,88 C89,88 84,84 84,78 C84,72 96,60 96,60 Z', '#5ba8f5') +
      p('M22,72 C22,72 29,82 29,87 C29,92 25,95 21,95 C17,95 13,92 13,87 C13,82 22,72 22,72 Z', '#8ec6fb'),
      { bg: '#e7f4ff' });
  };

  ART.cheese = function () {
    return scene(
      p('M16,84 L100,84 L100,50 Z', '#f2c94c') +
      p('M16,84 L16,64 L58,64 L58,84 Z', '#ffd76e') +
      p('M58,64 L100,50 L100,84 Z', '#e0b23a') +
      c(36, 76, 5, '#e0b23a') + c(52, 70, 4, '#e0b23a') + c(78, 74, 5.5, '#e0b23a') +
      c(28, 68, 3, '#c99a2c') + c(66, 79, 3.4, '#c99a2c'),
      { bg: '#fff0ee' });
  };

  ART.rice = function () {
    return scene(
      p('M22,58 L98,58 L88,98 L32,98 Z', '#fdfdff') +
      p('M24,60 L96,60 L94,72 L26,72 Z', '#cfe3f7') +
      p('M30,58 C36,40 84,40 90,58 Z', '#ffffff') +
      e(44, 50, 4, 2.4, '#e8eef6', 'transform="rotate(-20 44 50)"') +
      e(60, 46, 4, 2.4, '#e8eef6', 'transform="rotate(10 60 46)"') +
      e(74, 52, 4, 2.4, '#e8eef6', 'transform="rotate(30 74 52)"') +
      ln(64, 20, 40, 52, '#c98a4b', 3) + ln(72, 20, 50, 52, '#c98a4b', 3),
      { bg: '#fff0ee' });
  };

  ART.coffee = function () {
    return scene(
      ps('M44,28 C48,20 38,16 42,8', '#b7c3d0', 3) +
      ps('M60,26 C64,18 54,14 58,6', '#b7c3d0', 3) +
      ps('M76,28 C80,20 70,16 74,8', '#b7c3d0', 3) +
      e(56, 96, 34, 7, '#dfe7ef') +
      p('M28,44 L84,44 L76,88 L36,88 Z', '#fdfdff') +
      p('M28,44 L84,44 L82,54 L30,54 Z', '#e5d3bd') +
      p('M32,54 L80,54 L74,86 L38,86 Z', '#8a5a34') +
      ps('M84,54 C96,54 96,74 84,74', 'none', 5) +
      ps('M84,54 C94,54 94,72 84,72', '#fdfdff', 4),
      { bg: '#fff0ee' });
  };

  ART.cake = function () {
    return scene(
      e(60, 96, 42, 7, '#eadff0') +
      p('M22,92 L22,58 L98,58 L98,92 Z', '#f7e0c4') +
      p('M22,72 L98,72 L98,80 L22,80 Z', '#f0a8b8') +
      p('M22,58 C22,48 34,46 40,52 C46,44 60,44 66,50 C72,44 86,46 90,52 C96,46 104,52 98,58 Z', '#fff6ef') +
      p('M22,58 L98,58 L98,64 L22,64 Z', '#fdfdff') +
      c(60, 44, 6, '#e0453f') + ps('M60,38 L60,32', '#5cb85c', 2.4),
      { bg: '#fff0ee' });
  };

  ART.banana = function () {
    return scene(
      p('M22,34 C30,72 62,94 98,80 C84,102 44,104 26,72 C18,58 16,44 22,34 Z', '#f5d33c') +
      p('M30,44 C40,72 62,86 90,80 C74,94 46,90 34,68 C28,58 26,50 30,44 Z', '#fbe68a') +
      p('M20,32 L28,28 L32,40 L24,44 Z', '#8a6a2a') +
      p('M94,78 L102,74 L102,84 L94,88 Z', '#8a6a2a'),
      { bg: '#fff0ee' });
  };

  ART.tomato = function () {
    return scene(
      c(60, 66, 34, '#e0453f') +
      ps('M60,34 L60,48', '#4a9e4a', 3) +
      pl('60,26 76,36 68,44 60,38 52,44 44,36', '#4a9e4a') +
      c(46, 56, 6, 'rgba(255,255,255,.4)'),
      { bg: '#fff0ee' });
  };

  ART.grape = function () {
    return scene(
      ps('M60,26 C60,18 64,14 70,12', '#7a5230', 3) +
      p('M70,14 C82,4 100,10 96,22 C92,32 76,28 70,14 Z', '#5cb85c') +
      c(60, 44, 11, '#7c4d9e') + c(46, 56, 11, '#7c4d9e') + c(74, 56, 11, '#7c4d9e') +
      c(53, 68, 11, '#7c4d9e') + c(67, 68, 11, '#7c4d9e') + c(60, 82, 11, '#7c4d9e') +
      c(57, 42, 3.4, 'rgba(255,255,255,.45)') + c(43, 54, 3, 'rgba(255,255,255,.35)') +
      c(50, 66, 3, 'rgba(255,255,255,.35)'),
      { bg: '#fff0ee' });
  };

  ART.icecream = function () {
    return scene(
      pl('38,60 82,60 60,106', '#e0a95b') +
      ps('M44,68 L76,68', '#c98a4b', 2) + ps('M48,78 L72,78', '#c98a4b', 2) + ps('M52,88 L68,88', '#c98a4b', 2) +
      c(48, 50, 17, '#f7a8c0') + c(72, 50, 17, '#a8d8f0') +
      c(60, 38, 15, '#fdf0b8') +
      c(60, 20, 6, '#e0453f') + ps('M60,24 L60,28', '#5cb85c', 2.4),
      { bg: '#fff0ee' });
  };

  ART.honey = function () {
    return scene(
      rc(34, 40, 52, 62, '#f0a63b', 8) +
      rc(30, 28, 60, 16, '#c98a4b', 5) +
      rc(38, 58, 44, 30, '#fdf0cf', 4) +
      p('M60,62 L74,70 L74,78 L60,70 L46,78 L46,70 Z', '#f5c542') +
      ps('M40,34 C36,44 44,46 40,56', '#8a5a2b', 3) +
      p('M60,102 C60,102 68,92 68,87 C68,82 60,78 60,78 C60,78 52,82 52,87 C52,92 60,102 60,102 Z', '#f5c542'),
      { bg: '#fff0ee' });
  };

  /* -------------------------------------------------------- nature (12) */

  ART.sun = function () {
    var rays = '';
    for (var i = 0; i < 12; i++) {
      var a = (i * Math.PI) / 6;
      var x1 = 60 + Math.cos(a) * 32, y1 = 60 + Math.sin(a) * 32;
      var x2 = 60 + Math.cos(a) * 44, y2 = 60 + Math.sin(a) * 44;
      rays += ln(x1.toFixed(1), y1.toFixed(1), x2.toFixed(1), y2.toFixed(1), '#f5a524', 5);
    }
    return scene(rays + c(60, 60, 24, '#fbbf24') + c(60, 60, 19, '#fcd34d') +
      c(53, 53, 4, 'rgba(255,255,255,.5)'), { bg: '#fff7e0', ground: false });
  };

  ART.moon = function () {
    return scene(
      c(34, 24, 3, '#fcd34d') + c(96, 32, 2.4, '#fcd34d') + c(102, 76, 2.8, '#fcd34d') + c(22, 78, 2.2, '#fcd34d') +
      p('M74,22 C50,32 44,60 60,84 C38,80 26,60 32,38 C40,14 66,6 82,16 C78,18 76,20 74,22 Z', '#fcd34d') +
      c(56, 44, 5, '#e5b93f') + c(70, 62, 4, '#e5b93f') + c(46, 68, 3, '#e5b93f'),
      { bg: '#222a4a', ground: false });
  };

  ART.star = function () {
    return scene(
      p('M60,18 L72,48 L104,48 L79,67 L89,98 L60,79 L31,98 L41,67 L16,48 L48,48 Z', '#fbbf24') +
      p('M60,34 L66,52 L85,52 L70,63 L76,81 L60,70 L44,81 L50,63 L35,52 L54,52 Z', '#fcd34d') +
      c(24, 26, 2.4, '#fde68a') + c(98, 78, 2.6, '#fde68a') + c(94, 20, 2, '#fde68a'),
      { bg: '#222a4a', ground: false });
  };

  ART.tree = function () {
    return scene(
      p('M52,96 L52,58 L68,58 L68,96 Z', '#8a5a33') +
      ps('M60,68 L48,58 M60,76 L72,68', '#7a4a28', 2.6) +
      c(60, 40, 22, '#4a9e4a') + c(38, 50, 17, '#57b357') + c(82, 50, 17, '#57b357') +
      c(48, 60, 15, '#4a9e4a') + c(72, 60, 15, '#4a9e4a') +
      c(52, 34, 4, 'rgba(255,255,255,.25)'),
      { bg: '#eafaf1' });
  };

  ART.flower = function () {
    var petals = '';
    for (var i = 0; i < 6; i++) {
      var a = (i * Math.PI) / 3;
      var cx = 60 + Math.cos(a) * 18, cy = 42 + Math.sin(a) * 18;
      petals += e(cx, cy, 12, 12, '#f472b6', 'transform="rotate(' + ((i * 60).toFixed(0)) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"');
    }
    return scene(
      ps('M60,58 C60,74 58,88 58,98', '#4a9e4a', 4) +
      p('M58,78 C44,74 40,86 50,90 C56,92 58,86 58,78 Z', '#4a9e4a') +
      petals + c(60, 42, 12, '#fbbf24') + c(60, 42, 7, '#f59e0b'),
      { bg: '#eafaf1' });
  };

  ART.rain = function () {
    return scene(
      c(40, 44, 16, '#c3d3e6') + c(64, 38, 20, '#d3e0ee') + c(84, 46, 15, '#c3d3e6') +
      rc(24, 44, 76, 14, '#d3e0ee', 7) +
      ps('M38,66 L32,84', '#5ba8f5', 4) + ps('M56,66 L50,88', '#5ba8f5', 4) +
      ps('M74,66 L68,84', '#5ba8f5', 4) + ps('M90,66 L84,82', '#5ba8f5', 4) +
      ps('M46,74 L42,86', '#8ec6fb', 3) + ps('M82,72 L78,86', '#8ec6fb', 3),
      { bg: '#dceaf7', ground: false });
  };

  ART.snow = function () {
    function flake(cx, cy, r) {
      var s = '';
      for (var i = 0; i < 3; i++) {
        var a = (i * Math.PI) / 3;
        s += ln((cx - Math.cos(a) * r).toFixed(1), (cy - Math.sin(a) * r).toFixed(1),
                (cx + Math.cos(a) * r).toFixed(1), (cy + Math.sin(a) * r).toFixed(1), '#ffffff', 2.6);
      }
      return s + c(cx, cy, 1.4, '#ffffff');
    }
    return scene(
      c(40, 40, 15, '#a9cdf0', 'stroke="#8ab6dd" stroke-width="2"') +
      c(62, 34, 19, '#b9d8f5', 'stroke="#8ab6dd" stroke-width="2"') +
      c(82, 42, 14, '#a9cdf0', 'stroke="#8ab6dd" stroke-width="2"') +
      rc(24, 40, 74, 14, '#b9d8f5', 7, 'stroke="#8ab6dd" stroke-width="2"') +
      flake(34, 72, 9) + flake(60, 82, 10) + flake(86, 70, 8) + flake(46, 96, 6.5) + flake(76, 98, 6),
      { bg: '#c3e2fb', ground: false });
  };

  ART.mountain = function () {
    return scene(
      c(96, 30, 12, '#fcd34d') +
      p('M6,100 L44,38 L82,100 Z', '#8d99ae') +
      p('M34,100 L74,44 L114,100 Z', '#6b7a92') +
      p('M44,38 L30,58 L40,54 L48,62 L58,52 Z', '#fdfdff') +
      p('M74,44 L58,68 L70,62 L78,70 L90,58 Z', '#fdfdff') +
      p('M0,100 L120,100 L120,108 L0,108 Z', '#5cb85c'),
      { bg: '#eafaf1' });
  };

  ART.river = function () {
    return scene(
      p('M0,52 C20,44 40,58 60,52 C80,46 100,58 120,52 L120,108 L0,108 Z', '#8fd48f') +
      p('M46,44 C58,60 38,72 50,88 C60,100 48,104 46,110 L76,110 C78,100 66,92 74,80 C82,68 66,56 74,44 Z', '#5ba8f5') +
      c(46, 44, 7, '#fcd34d') +
      p('M12,44 L20,26 L28,44 Z', '#4a9e4a') + rc(18, 42, 4, 12, '#8a5a33', 2) +
      p('M92,44 L100,24 L108,44 Z', '#4a9e4a') + rc(98, 42, 4, 12, '#8a5a33', 2),
      { bg: '#eafaf1', ground: false });
  };

  ART.cloud = function () {
    return scene(
      c(40, 62, 18, '#f2f7fc') + c(66, 54, 24, '#f8fbff') + c(88, 66, 15, '#e6eef7') +
      rc(20, 60, 84, 22, '#f2f7fc', 11) +
      e(60, 82, 40, 6, 'rgba(148,163,184,.25)'),
      { bg: '#dbeafe', ground: false });
  };

  ART.fire = function () {
    return scene(
      p('M60,12 C74,34 92,44 92,66 C92,88 78,102 60,102 C42,102 28,88 28,66 C28,48 40,44 44,32 C48,44 56,48 60,42 C64,36 60,24 60,12 Z', '#f97316') +
      p('M60,40 C68,54 78,60 78,74 C78,88 70,96 60,96 C50,96 42,88 42,74 C42,62 52,58 56,50 C58,56 62,54 60,40 Z', '#fbbf24') +
      p('M60,62 C64,72 68,74 68,82 C68,88 64,92 60,92 C56,92 52,88 52,82 C52,74 58,72 60,62 Z', '#fde68a') +
      rc(30, 100, 60, 8, '#8a5a33', 4),
      { bg: '#fff0ee', ground: false });
  };

  ART.leaf = function () {
    return scene(
      p('M60,16 C88,30 96,66 60,102 C24,66 32,30 60,16 Z', '#4a9e4a') +
      p('M60,22 C80,34 86,62 60,94 C34,62 40,34 60,22 Z', '#5cb85c') +
      ps('M60,24 L60,96', '#2f6b2f', 3) +
      ps('M60,42 L46,34 M60,42 L74,34 M60,58 L44,50 M60,58 L76,50 M60,74 L46,66 M60,74 L74,66', '#2f6b2f', 2) +
      ps('M60,96 C56,106 46,108 40,104', '#8a5a33', 3),
      { bg: '#eafaf1' });
  };

  /* ----------------------------------------------------------- body (8) */

  ART.hand = function () {
    return scene(
      rc(45, 26, 9, 34, SKIN, 4.5) + rc(56, 20, 9, 40, SKIN, 4.5) +
      rc(67, 24, 9, 36, SKIN, 4.5) + rc(77, 32, 8, 28, SKIN, 4) +
      rc(34, 54, 9, 22, SKIN, 4.5, 'transform="rotate(-26 38 64)"') +
      rc(40, 50, 44, 38, SKIN, 13) +
      ps('M50,70 C58,64 66,68 72,74', SKIN_D, 2.6) +
      ps('M50,82 C58,78 66,82 72,88', SKIN_D, 2.2),
      { bg: '#fdf1f7' });
  };

  ART.eye = function () {
    return scene(
      p('M8,60 C28,28 92,28 112,60 C92,92 28,92 8,60 Z', '#fdfdff') +
      c(60, 60, 21, '#5b8ed6') + c(60, 60, 15, '#3f6fb5') + c(60, 60, 8, NIGHT) +
      c(52, 51, 5, 'rgba(255,255,255,.85)') +
      ps('M8,60 C28,28 92,28 112,60', '#5a4a6a', 4) +
      ps('M12,68 C30,92 90,92 108,68', '#7c6a8a', 3) +
      ps('M32,34 L26,22', NIGHT, 3.4) + ps('M52,26 L50,12', NIGHT, 3.4) +
      ps('M70,26 L74,12', NIGHT, 3.4) + ps('M90,36 L96,24', NIGHT, 3.4),
      { bg: '#fdf1f7' });
  };

  ART.heart = function () {
    return scene(
      p('M60,102 C22,78 12,52 26,34 C40,16 56,24 60,40 C64,24 80,16 94,34 C108,52 98,78 60,102 Z', '#e0453f') +
      p('M60,92 C34,74 28,54 38,44 C46,36 54,42 56,52 C50,58 46,68 46,78 Z', '#f4796f') +
      c(36, 40, 7, 'rgba(255,255,255,.45)'),
      { bg: '#fdf1f7' });
  };

  ART.head = function () {
    return scene(
      rc(50, 72, 20, 22, SKIN_D, 6) + rc(24, 92, 72, 24, '#4f7df3', 10) +
      e(34, 56, 5, 8, SKIN) + e(86, 56, 5, 8, SKIN) +
      c(60, 50, 27, SKIN) +
      p('M33,50 C33,22 87,22 87,50 C87,36 76,32 60,32 C44,32 33,36 33,50 Z', '#3a2f2a') +
      c(50, 52, 2.8, NIGHT) + c(70, 52, 2.8, NIGHT) +
      ps('M60,54 L58,63 L64,63', SKIN_D, 2.4) +
      ps('M52,70 Q60,77 68,70', '#8a3a4a', 2.8),
      { bg: '#fdf1f7' });
  };

  ART.foot = function () {
    return scene(
      p('M60,22 C76,22 84,34 84,52 C84,78 76,100 60,100 C44,100 36,78 36,52 C36,34 44,22 60,22 Z', SKIN) +
      c(36, 32, 9, SKIN) + c(50, 24, 9.5, SKIN) + c(64, 22, 9, SKIN) +
      c(77, 27, 7.5, SKIN) + c(86, 36, 6, SKIN) +
      c(36, 32, 3.4, SKIN_D) + c(50, 24, 3.6, SKIN_D) + c(64, 22, 3.4, SKIN_D) +
      ps('M44,58 C52,70 52,86 46,94', SKIN_D, 3) +
      c(66, 52, 4, SKIN_D),
      { bg: '#fdf1f7' });
  };

  ART.mouth = function () {
    return scene(
      p('M18,60 C34,44 46,48 60,56 C74,48 86,44 102,60 C86,88 34,88 18,60 Z', '#7a2c2c') +
      p('M32,58 C42,50 50,52 60,57 C70,52 78,50 88,58 L88,67 C76,62 46,62 32,67 Z', '#fdfdff') +
      e(60, 78, 17, 7, '#e08a8a') +
      p('M18,60 C30,40 46,42 60,55 C74,42 90,40 102,60 C88,54 32,54 18,60 Z', '#d8504a') +
      p('M18,60 C30,82 46,86 60,86 C74,86 90,82 102,60 C88,70 32,70 18,60 Z', '#e8706a') +
      ps('M44,80 C52,86 68,86 76,80', '#c04a45', 2),
      { bg: '#fdf1f7' });
  };

  ART.ear = function () {
    return scene(
      p('M64,14 C42,14 26,32 26,56 C26,80 44,96 58,106 C70,113 80,104 74,93 C70,85 62,84 62,74 C62,63 76,60 78,44 C80,26 74,14 64,14 Z', SKIN) +
      ps('M62,30 C48,30 40,42 40,56 C40,70 52,80 62,87', SKIN_D, 4.5) +
      ps('M58,46 C50,46 47,54 50,62', SKIN_D, 3.5),
      { bg: '#fdf1f7' });
  };

  ART.hair = function () {
    return scene(
      p('M60,12 C86,12 98,34 98,60 C98,86 88,106 60,106 C32,106 22,86 22,60 C22,34 34,12 60,12 Z', '#4a3a30') +
      e(60, 54, 21, 25, SKIN) +
      p('M38,46 C38,24 82,24 82,46 C76,34 68,32 60,36 C50,40 42,40 38,46 Z', '#4a3a30') +
      c(51, 56, 2.6, NIGHT) + c(69, 56, 2.6, NIGHT) +
      ps('M54,66 Q60,71 66,66', '#8a3a4a', 2.6) +
      ps('M30,50 C26,70 28,88 34,98', '#5a4738', 3) +
      ps('M90,50 C94,70 92,88 86,98', '#5a4738', 3),
      { bg: '#fdf1f7' });
  };

  /* --------------------------------------------------------- family (6) */

  ART.mother = function () {
    return scene(
      p('M60,8 C54,14 50,18 50,22 C50,27 55,30 60,34 C65,30 70,27 70,22 C70,18 66,14 60,8 Z', '#e0453f') +
      person(60, 48, { longHair: true, shirt: '#e0457b', smile: true, legs: false, hair: '#3f2f28' }) +
      p('M45,64 L75,64 L88,100 L32,100 Z', '#f06292') +
      rc(40, 94, 40, 7, '#d94a80', 3),
      { bg: '#f4f2ff' });
  };

  ART.father = function () {
    return scene(
      person(60, 44, { beard: true, shirt: '#3b82f6', smile: true, hair: '#33261f' }) +
      pl('60,54 66,62 63,78 57,78 54,62', '#e0453f') +
      p('M60,54 L66,62 L60,58 Z', '#b91c1c') +
      c(60, 24, 5, '#fbbf24'),
      { bg: '#f4f2ff' });
  };

  ART.sister = function () {
    return scene(
      person(80, 46, { scale: 0.94, shirt: '#6366f1', smile: true, hair: '#2b2118' }) +
      person(40, 56, { scale: 0.78, shirt: '#f59e0b', longHair: true, smile: true, hair: '#6b4423' }) +
      e(22, 56, 7, 11, '#6b4423') +
      c(60, 20, 5, '#f472b6'),
      { bg: '#f4f2ff' });
  };

  ART.brother = function () {
    return scene(
      person(80, 46, { scale: 0.94, shirt: '#0ea5e9', smile: true, hair: '#241c18' }) +
      person(40, 56, { scale: 0.78, shirt: '#22c55e', smile: true, hair: '#4a3324' }) +
      c(60, 20, 6, '#f97316') +
      ps('M52,20 L68,20', '#f97316', 3),
      { bg: '#f4f2ff' });
  };

  ART.baby = function () {
    return scene(
      p('M28,66 C28,52 92,52 92,66 L98,102 L22,102 Z', '#a8d8f0') +
      p('M28,66 C28,56 92,56 92,66 L92,74 C80,68 40,68 28,74 Z', '#8ec6fb') +
      rc(24, 68, 12, 20, SKIN, 6, 'transform="rotate(-18 30 78)"') +
      c(28, 90, 4, SKIN) +
      c(60, 44, 21, SKIN) +
      ps('M60,25 C60,15 68,11 73,16', '#3a2f2a', 4) +
      ps('M48,44 q5,-5 10,0', NIGHT, 2.6) + ps('M62,44 q5,-5 10,0', NIGHT, 2.6) +
      c(60, 55, 7.5, '#f0a8b8') + c(60, 55, 3.4, '#d4758c') +
      c(46, 50, 4, '#f7a8a0', 'opacity=".7"') + c(74, 50, 4, '#f7a8a0', 'opacity=".7"'),
      { bg: '#f4f2ff' });
  };

  ART.friend = function () {
    return scene(
      p('M60,10 C55,15 51,19 51,23 C51,27 56,30 60,33 C64,30 69,27 69,23 C69,19 65,15 60,10 Z', '#e0453f') +
      person(36, 48, { scale: 0.86, shirt: '#e0453f', smile: true, arms: false, hair: '#3a2f2a' }) +
      person(84, 48, { scale: 0.86, shirt: '#22c55e', smile: true, arms: false, hair: '#6b4423' }) +
      ps('M48,58 C52,48 56,44 60,44', '#e0453f', 5.5) +
      ps('M72,58 C68,48 64,44 60,44', '#22c55e', 5.5) +
      c(60, 42, 6, SKIN),
      { bg: '#f4f2ff' });
  };

  /* -------------------------------------------------------- objects (12) */

  ART.house = function () {
    return scene(
      rc(76, 28, 14, 20, '#c98a4b', 2) +
      rc(26, 58, 68, 42, '#f6d8b0', 3) +
      p('M12,60 L60,20 L108,60 Z', '#e0453f') +
      p('M12,60 L108,60 L108,66 L12,66 Z', '#b91c1c') +
      rc(52, 74, 18, 26, '#8a5a33', 2) + c(66, 88, 2, '#fcd34d') +
      rc(34, 70, 13, 13, '#8ec6fb', 2) + ln(40.5, 70, 40.5, 83, '#fdfdff', 2) + ln(34, 76.5, 47, 76.5, '#fdfdff', 2) +
      p('M18,100 C28,90 44,94 52,100 Z', '#5cb85c') +
      p('M70,100 C80,90 96,94 104,100 Z', '#5cb85c'),
      { bg: '#eef4ff' });
  };

  ART.door = function () {
    return scene(
      rc(28, 16, 64, 88, '#c98a4b', 4) +
      rc(34, 22, 52, 82, '#a97244', 3) +
      rc(42, 32, 36, 26, '#c99a6b', 2) + rc(42, 68, 36, 26, '#c99a6b', 2) +
      c(78, 66, 3.6, '#fcd34d') + c(78, 66, 1.4, '#b48a20') +
      rc(32, 30, 4, 10, '#7a5230', 1.5) + rc(32, 80, 4, 10, '#7a5230', 1.5),
      { bg: '#eef4ff' });
  };

  ART.window = function () {
    return scene(
      rc(24, 18, 72, 76, '#c98a4b', 4) +
      rc(30, 24, 60, 64, '#8ec6fb', 2) +
      c(78, 38, 8, '#fcd34d') +
      c(42, 46, 7, '#fdfdff') + c(50, 43, 9, '#fdfdff') + c(58, 47, 6, '#fdfdff') +
      rc(56, 24, 8, 64, '#fdfdff') + rc(30, 52, 60, 8, '#fdfdff') +
      rc(18, 92, 84, 9, '#e8dcc0', 2) +
      p('M30,24 C36,40 40,54 36,70 L30,70 Z', '#f472b6') +
      p('M90,24 C84,40 80,54 84,70 L90,70 Z', '#f472b6'),
      { bg: '#eef4ff' });
  };

  ART.table = function () {
    return scene(
      rc(22, 66, 10, 38, '#c98a4b', 2) + rc(88, 66, 10, 38, '#c98a4b', 2) +
      rc(14, 50, 92, 11, '#c98a4b', 3) +
      rc(22, 61, 76, 6, '#a97244', 1) +
      e(60, 47, 11, 5, '#8ec6fb') + rc(50, 36, 20, 10, '#dbeafe', 3) +
      c(60, 40, 3, '#e0453f'),
      { bg: '#eef4ff' });
  };

  ART.chair = function () {
    return scene(
      rc(34, 16, 8, 46, '#8a5a33', 2) + rc(78, 16, 8, 46, '#8a5a33', 2) +
      rc(40, 18, 40, 34, '#c98a4b', 3) +
      rc(46, 24, 5, 24, '#e8dcc0', 1.5) + rc(58, 24, 5, 24, '#e8dcc0', 1.5) + rc(70, 24, 5, 24, '#e8dcc0', 1.5) +
      rc(28, 60, 64, 10, '#a97244', 3) +
      rc(30, 70, 9, 34, '#c98a4b', 2) + rc(81, 70, 9, 34, '#c98a4b', 2),
      { bg: '#eef4ff' });
  };

  ART.book = function () {
    return scene(
      p('M58,32 C46,24 26,22 12,26 L12,94 C26,90 46,92 58,98 Z', '#e0453f') +
      p('M62,32 C74,24 94,22 108,26 L108,94 C94,90 74,92 62,98 Z', '#dc2626') +
      p('M58,38 C46,31 28,29 17,32 L17,90 C28,87 46,89 58,94 Z', '#fdfdff') +
      p('M62,38 C74,31 92,29 103,32 L103,90 C92,87 74,89 62,94 Z', '#fdf6ea') +
      rc(55, 34, 10, 62, '#b91c1c', 2) +
      ps('M24,46 L48,49 M24,58 L48,61 M24,70 L48,73', '#cbd5e1', 2.4) +
      ps('M72,49 L96,46 M72,61 L96,58 M72,73 L96,70', '#cbd5e1', 2.4),
      { bg: '#eef4ff' });
  };

  ART.key = function () {
    return scene(
      c(36, 60, 22, '#fcd34d') + c(36, 60, 10, '#fff7e0') +
      rc(52, 55, 46, 10, '#f0b91b', 2) +
      rc(78, 64, 9, 13, '#f0b91b', 2) + rc(90, 64, 7, 10, '#f0b91b', 2) +
      ps('M24,50 C30,46 40,46 46,50', '#fff0b8', 2.6),
      { bg: '#eef4ff' });
  };

  ART.clock = function () {
    var ticks = '';
    for (var i = 0; i < 12; i++) {
      var a = (i * Math.PI) / 6;
      var r1 = i % 3 === 0 ? 24 : 27;
      ticks += ln((60 + Math.cos(a) * r1).toFixed(1), (60 + Math.sin(a) * r1).toFixed(1),
                  (60 + Math.cos(a) * 31).toFixed(1), (60 + Math.sin(a) * 31).toFixed(1), '#94a3b8', i % 3 === 0 ? 3 : 1.6);
    }
    return scene(
      e(38, 20, 9, 7, '#c98a4b') + e(82, 20, 9, 7, '#c98a4b') +
      c(60, 60, 40, '#c98a4b') + c(60, 60, 34, '#fdfdff') +
      ticks + ln(60, 60, 60, 38, '#334155', 4) + ln(60, 60, 80, 68, '#e0453f', 3.4) +
      c(60, 60, 4, '#334155') +
      rc(50, 96, 20, 6, '#8a5a33', 2),
      { bg: '#eef4ff' });
  };

  ART.bed = function () {
    return scene(
      rc(10, 26, 16, 78, '#8a5a33', 3) +
      rc(26, 60, 88, 22, '#fdfdff', 6) +
      rc(32, 54, 28, 16, '#e8f0ff', 5) +
      rc(56, 60, 58, 22, '#8ec6fb', 6) +
      p('M56,76 C66,70 76,82 88,76 C100,70 108,78 114,74 L114,88 L56,88 Z', '#5ba8f5') +
      rc(26, 82, 10, 22, '#8a5a33', 2) + rc(100, 82, 10, 22, '#8a5a33', 2),
      { bg: '#eef4ff' });
  };

  ART.cup = function () {
    return scene(
      ps('M44,28 C48,20 38,16 42,8', '#b7c3d0', 3) +
      ps('M60,26 C64,18 54,14 58,6', '#b7c3d0', 3) +
      ps('M76,28 C80,20 70,16 74,8', '#b7c3d0', 3) +
      ps('M84,56 C100,56 100,80 84,80', '#dbe7f7', 8) +
      ps('M84,56 C97,56 97,78 84,78', '#fdfdff', 4.4) +
      p('M30,42 L90,42 L80,98 L40,98 Z', '#fdfdff') +
      p('M32,54 L88,54 L85,68 L35,68 Z', '#8a5a34') +
      e(60, 42, 30, 7, '#e8eef6') + e(60, 42, 25, 5, '#5b3a20'),
      { bg: '#eef4ff' });
  };

  ART.phone = function () {
    return scene(
      rc(32, 12, 56, 96, '#2f3b4d', 9) +
      rc(38, 22, 44, 68, '#8ec6fb', 3) +
      c(60, 17, 2.4, '#6b7688') +
      rc(46, 40, 28, 18, '#fdfdff', 5) + p('M50,58 L46,64 L56,58 Z', '#fdfdff') +
      rc(46, 66, 20, 3.4, '#cbd5e1', 1.7) + rc(46, 73, 13, 3.4, '#cbd5e1', 1.7) +
      rc(53, 96, 14, 3.4, '#8a94a8', 1.7),
      { bg: '#eef4ff' });
  };

  ART.umbrella = function () {
    return scene(
      rc(58, 58, 5, 40, '#8a5a33', 2) +
      p('M8,64 C8,26 112,26 112,64 Z', '#e0453f') +
      ps('M8,64 C14,50 30,50 35,64', '#fdfdff', 3) +
      ps('M35,64 C41,50 56,50 61,64', '#fdfdff', 3) +
      ps('M61,64 C67,50 82,50 87,64', '#fdfdff', 3) +
      ps('M87,64 C93,50 106,50 112,64', '#fdfdff', 3) +
      pl('60,18 55,29 65,29', '#8a5a33') +
      ps('M60,98 C60,110 76,110 76,101', '#8a5a33', 5) +
      p('M28,64 C28,74 24,78 24,84 C24,90 32,90 32,84 C32,78 28,74 28,64 Z', '#5ba8f5') +
      p('M92,64 C92,74 88,78 88,84 C88,90 96,90 96,84 C96,78 92,74 92,64 Z', '#5ba8f5'),
      { bg: '#eef4ff' });
  };

  /* ---------------------------------------------------------- colors (7) */

  function swatch(color, bg, outline) {
    return scene(
      p('M18,62 C18,40 40,26 62,26 C86,26 104,42 104,62 C104,78 92,84 82,78 C74,73 68,78 64,88 C58,102 40,102 32,90 C22,76 18,70 18,62 Z', color, outline) +
      c(36, 46, 8, bg) +
      p('M88,88 C88,88 98,76 98,70 C98,64 88,60 88,60 C88,60 78,64 78,70 C78,76 88,88 88,88 Z', color) +
      ps('M14,104 C28,96 42,108 58,100', color, 5) +
      c(20, 28, 3, color) + c(106, 34, 2.4, color),
      { bg: bg, ground: false });
  }

  ART.red = function () { return swatch('#ef4444', '#fff1f0'); };
  ART.blue = function () { return swatch('#3b82f6', '#eff6ff'); };
  ART.green = function () { return swatch('#22c55e', '#effaf3'); };
  ART.yellow = function () { return swatch('#eab308', '#fffbeb'); };
  ART.orange = function () { return swatch('#f97316', '#fff4ec'); };
  ART.black = function () { return swatch('#22262f', '#eef0f4'); };
  ART.white = function () { return swatch('#ffffff', '#dfe3ea', 'stroke="#b9bfca" stroke-width="2"'); };

  /* ----------------------------------------------------------- verbs (15) */

  ART.run = function () {
    return scene(
      ln(6, 48, 26, 44, '#9aa4b8', 4) + ln(2, 62, 24, 58, '#9aa4b8', 4) + ln(10, 76, 30, 72, '#9aa4b8', 4) +
      c(14, 96, 4, '#cbd5e1') + c(24, 100, 3, '#cbd5e1') +
      '<g transform="rotate(-16 60 72)">' + person(60, 44, { shirt: '#ef4444', pants: '#2563eb', smile: true }) + '</g>',
      { bg: '#ebfeff' });
  };

  ART.eat = function () {
    return scene(
      rc(6, 86, 108, 8, '#c98a4b', 2) + rc(18, 94, 9, 10, '#a97244', 2) + rc(93, 94, 9, 10, '#a97244', 2) +
      person(40, 40, { scale: 0.84, shirt: '#0ea5e9', legs: false, smile: true, hair: '#3a2f2a' }) +
      ps('M56,60 C64,54 66,48 62,44', '#f59e0b', 5.5) +
      c(62, 42, 4.4, '#cbd5e1') +
      e(82, 82, 20, 6, '#fdfdff') + e(82, 80, 13, 5, '#f1f5f9') +
      c(82, 78, 7, '#e0453f') + ps('M88,70 C92,64 92,60 88,58', '#cbd5e1', 2.4),
      { bg: '#ebfeff' });
  };

  ART.drink = function () {
    return scene(
      person(42, 38, { scale: 0.86, shirt: '#22c55e', legs: false, smile: true, hair: '#2f2a24' }) +
      ps('M56,58 C64,56 68,50 66,44', '#22c55e', 5.5) +
      '<g transform="rotate(38 78 52)">' +
        p('M70,36 L90,36 L87,64 L73,64 Z', '#dbeafe') +
        p('M71,46 L89,46 L87,64 L73,64 Z', '#8a5a34') +
        e(80, 36, 10, 3, '#bfdbfe') +
      '</g>' +
      ln(74, 30, 88, 12, '#e0453f', 3) +
      c(102, 34, 3, '#8ec6fb') + c(108, 46, 2.2, '#8ec6fb') + c(98, 24, 2, '#8ec6fb'),
      { bg: '#ebfeff' });
  };

  ART.sleep = function () {
    return scene(
      rc(6, 84, 108, 14, '#c98a4b', 3) +
      p('M74,66 C92,62 106,72 110,84 L110,98 L74,98 Z', '#8ec6fb') +
      rc(14, 68, 34, 16, '#fdfdff', 5) +
      c(56, 60, 21, SKIN) +
      p('M35,58 C35,38 77,38 77,58 C72,48 62,46 56,50 C48,54 40,54 35,58 Z', '#3a2f2a') +
      ps('M45,62 q5,-5 10,0', NIGHT, 2.6) +
      ps('M58,70 q4,4 8,0', '#8a3a4a', 2.4) +
      txt(84, 34, 'Z', 20, '#94a3b8') + txt(96, 22, 'z', 15, '#a5b4c4') + txt(105, 13, 'z', 11, '#b8c4d4'),
      { bg: '#ebfeff' });
  };

  ART.read = function () {
    return scene(
      person(60, 34, { scale: 0.8, shirt: '#8b5cf6', legs: false, smile: true, hair: '#33261f' }) +
      ps('M50,52 C46,60 44,64 46,68', '#8b5cf6', 5) +
      ps('M70,52 C74,60 76,64 74,68', '#8b5cf6', 5) +
      p('M58,64 C50,58 38,58 30,62 L30,88 C38,84 50,84 58,90 Z', '#fdfdff') +
      p('M62,64 C70,58 82,58 90,62 L90,88 C82,84 70,84 62,90 Z', '#fdf6ea') +
      ln(60, 62, 60, 90, '#cbd5e1', 2.4) +
      ps('M36,68 L52,71 M36,76 L52,79', '#cbd5e1', 2.2) +
      ps('M68,71 L84,68 M68,79 L84,76', '#cbd5e1', 2.2),
      { bg: '#ebfeff' });
  };

  ART.write = function () {
    return scene(
      rc(4, 82, 112, 8, '#c98a4b', 2) + rc(16, 90, 9, 14, '#a97244', 2) + rc(96, 90, 9, 14, '#a97244', 2) +
      person(36, 36, { scale: 0.8, shirt: '#f97316', legs: false, smile: true, hair: '#3a2f2a' }) +
      ps('M46,54 C52,60 56,64 60,66', '#f97316', 5) +
      rc(56, 66, 42, 22, '#fdfdff', 2) +
      ps('M62,74 L92,74 M62,81 L92,81 M62,88 L84,88', '#cbd5e1', 2) +
      ln(64, 64, 78, 50, '#fbbf24', 5.4) + p('M78,50 L84,44 L80,52 Z', '#3f3a4d') +
      rc(62, 62, 6, 5, '#f472b6', 2),
      { bg: '#ebfeff' });
  };

  ART.swim = function () {
    return scene(
      p('M0,84 C14,76 22,92 36,84 C50,76 58,92 72,84 C86,76 94,92 108,84 C114,80 120,84 120,88 L120,120 L0,120 Z', '#5ba8f5') +
      c(60, 44, 17, SKIN) +
      p('M43,42 C43,25 77,25 77,42 Z', '#e0453f') +
      rc(45, 40, 12, 8, '#38bdf8', 3) + rc(63, 40, 12, 8, '#38bdf8', 3) + ln(57, 44, 63, 44, '#38bdf8', 2.6) +
      p('M46,60 L74,60 L78,86 L42,86 Z', SKIN) +
      ps('M48,64 C38,68 32,76 32,84', SKIN, 7) + c(32, 86, 4, SKIN) +
      p('M0,84 C14,76 22,92 36,84 C50,76 58,92 72,84 C86,76 94,92 108,84 C114,80 120,84 120,88 L120,120 L0,120 Z', '#7cc0fb'),
      { bg: '#ebfeff', ground: false });
  };

  ART.sing = function () {
    return scene(
      person(48, 42, { scale: 0.86, shirt: '#ec4899', smile: false, hair: '#3f2f28' }) +
      e(48, 47, 4, 5.5, '#8a3a4a') +
      ps('M58,44 C64,42 66,50 62,54', '#7c3aed', 2.4) +
      c(82, 44, 6.5, '#3f3a4d') + ln(88, 44, 88, 26, '#3f3a4d', 3) +
      ps('M88,26 C99,30 94,39 99,41', '#3f3a4d', 3) +
      c(100, 58, 5.5, '#3f3a4d') + ln(105, 58, 105, 44, '#3f3a4d', 2.6) +
      ps('M105,44 C113,47 109,54 113,56', '#3f3a4d', 2.6) +
      c(24, 26, 3, '#fbbf24') + c(112, 20, 2.4, '#fbbf24'),
      { bg: '#ebfeff' });
  };

  ART.jump = function () {
    return scene(
      ps('M6,104 C30,88 66,84 108,96', '#cbd5e1', 3.4) +
      '<g transform="translate(0,-6)">' +
        person(60, 34, { scale: 0.86, shirt: '#22c55e', arms: false, smile: true, hair: '#3a2f2a' }) +
        ps('M50,44 C42,36 40,30 44,24', '#22c55e', 5.4) + c(44, 22, 3.6, SKIN) +
        ps('M70,44 C78,36 80,30 76,24', '#22c55e', 5.4) + c(76, 22, 3.6, SKIN) +
      '</g>' +
      ln(46, 96, 40, 104, '#cbd5e1', 3) + ln(74, 96, 80, 104, '#cbd5e1', 3),
      { bg: '#ebfeff' });
  };

  ART.walk = function () {
    return scene(
      ps('M4,104 C34,96 62,108 116,98', '#cbd5e1', 3.4) +
      ln(14, 96, 34, 96, '#cbd5e1', 3) + ln(46, 100, 70, 100, '#cbd5e1', 3) + ln(82, 96, 100, 96, '#cbd5e1', 3) +
      person(58, 38, { scale: 0.9, shirt: '#0ea5e9', smile: true, hair: '#2f2a24' }),
      { bg: '#ebfeff' });
  };

  ART.dance = function () {
    return scene(
      c(60, 12, 3, '#fbbf24') + c(28, 24, 2.4, '#fbbf24') + c(94, 22, 2.4, '#fbbf24') +
      person(36, 44, { scale: 0.8, shirt: '#e0457b', arms: false, smile: true, longHair: true, hair: '#3f2f28' }) +
      person(86, 44, { scale: 0.8, shirt: '#7c3aed', arms: false, smile: true, hair: '#2b2118' }) +
      ps('M32,56 C22,48 20,40 24,34', '#e0457b', 5) + c(24, 32, 3.4, SKIN) +
      ps('M42,56 C50,46 50,40 46,34', '#e0457b', 5) + c(46, 32, 3.4, SKIN) +
      ps('M80,56 C72,46 72,40 76,34', '#7c3aed', 5) + c(76, 32, 3.4, SKIN) +
      ps('M90,56 C98,46 98,40 94,34', '#7c3aed', 5) + c(94, 32, 3.4, SKIN) +
      c(60, 34, 5, '#3f3a4d') + ln(65, 34, 65, 22, '#3f3a4d', 2.6),
      { bg: '#ebfeff' });
  };

  ART.play = function () {
    return scene(
      ps('M84,80 C90,85 98,85 104,80', '#cbd5e1', 3) +
      c(92, 60, 17, '#fdfdff') +
      pl('92,50 101,57 96,68 88,68 83,57', '#2f3b4d') +
      ps('M92,43 C99,44 100,51 95,52', '#cbd5e1', 1.6) +
      person(44, 40, { scale: 0.9, shirt: '#f59e0b', arms: false, smile: true, hair: '#3a2f2a' }) +
      ps('M34,56 C24,50 22,42 26,36', '#f59e0b', 5.4) + c(26, 34, 3.6, SKIN) +
      ps('M56,56 C64,48 66,42 62,36', '#f59e0b', 5.4) + c(62, 34, 3.6, SKIN),
      { bg: '#ebfeff' });
  };

  ART.listen = function () {
    return scene(
      c(30, 46, 8, SKIN) + c(30, 46, 4, SKIN_D) +
      person(74, 42, { scale: 0.9, shirt: '#8b5cf6', arms: false, smile: true, hair: '#33261f' }) +
      ps('M70,58 C64,58 61,52 61,48', '#8b5cf6', 5.4) + c(61, 46, 3.6, SKIN) +
      ps('M52,36 C42,44 42,58 52,66', '#94a3b8', 3.4) +
      ps('M42,26 C26,38 26,64 42,76', '#94a3b8', 3.4) +
      ps('M32,16 C10,32 10,70 32,86', '#cbd5e1', 3),
      { bg: '#ebfeff' });
  };

  ART.fly = function () {
    return scene(
      c(24, 28, 9, '#f2f7fc') + c(34, 24, 12, '#f8fbff') + c(44, 30, 7, '#f2f7fc') +
      c(98, 84, 8, '#f2f7fc') + c(106, 80, 10, '#f8fbff') +
      e(58, 62, 22, 15, '#4aa3e0') +
      p('M46,54 C28,28 42,24 54,46 Z', '#3a86c4') +
      p('M62,50 C56,26 70,24 74,44 Z', '#2f6fa8') +
      p('M36,58 L14,50 L22,68 Z', '#2f6fa8') +
      c(78, 50, 12, '#4aa3e0') +
      p('M88,48 L106,54 L88,60 Z', '#f2a63b') +
      c(81, 47, 2.4, NIGHT) + c(82, 46, .9, WHITE) +
      ps('M74,40 C78,32 88,32 90,38', '#3a86c4', 3.4) +
      ln(20, 66, 34, 62, '#cbd5e1', 3) + ln(24, 78, 38, 74, '#cbd5e1', 3),
      { bg: '#ebfeff', ground: false });
  };

  ART.smile = function () {
    return scene(
      c(60, 60, 40, '#f59e0b') + c(60, 60, 34, '#fbbf24') +
      ps('M38,52 q7,-9 14,0', NIGHT, 3.4) + ps('M68,52 q7,-9 14,0', NIGHT, 3.4) +
      ps('M40,66 C48,86 72,86 80,66', '#8a4b20', 5) +
      e(34, 68, 6.5, 4.5, '#f87171', 'opacity=".8"') + e(86, 68, 6.5, 4.5, '#f87171', 'opacity=".8"') +
      c(60, 60, 3, '#f59e0b', 'opacity=".5"') +
      c(20, 26, 3, '#fde68a') + c(100, 30, 2.6, '#fde68a') + c(96, 96, 2.2, '#fde68a'),
      { bg: '#ebfeff', ground: false });
  };

  /* ------------------------------------------------------ adjectives (10) */

  ART.big = function () {
    return scene(
      rc(36, 78, 12, 26, '#8a5a2b', 4) + rc(56, 80, 12, 24, '#8a5a2b', 4) +
      rc(76, 78, 12, 26, '#8a5a2b', 4) + rc(92, 80, 12, 24, '#8a5a2b', 4) +
      e(64, 72, 32, 24, '#a97244') +
      c(44, 30, 8, '#8a5a2b') + c(84, 30, 8, '#8a5a2b') +
      c(64, 44, 22, '#a97244') +
      e(64, 52, 12, 9, '#e8c9a0') + c(64, 46, 4, '#5a3a22') +
      c(55, 40, 2.4, NIGHT) + c(73, 40, 2.4, NIGHT) +
      ps('M56,56 Q64,62 72,56', '#7a5230', 2.2) +
      person(20, 62, { scale: 0.42, shirt: '#e0453f', smile: true, hair: '#2f2a24' }),
      { bg: '#fdfaea' });
  };

  ART.small = function () {
    var ant = c(62, 62, 7, '#4a3a30') + c(52, 66, 5, '#4a3a30') + c(42, 70, 6, '#4a3a30') +
      ps('M46,64 L38,56 M48,70 L38,70 M50,76 L42,84', '#4a3a30', 2.4) +
      ps('M66,54 C70,48 74,48 76,50', '#4a3a30', 2.2) + c(77, 50, 2, '#4a3a30');
    return scene(
      rc(88, 84, 30, 10, '#8a5a33', 4, 'transform="rotate(42 100 90)"') +
      c(58, 58, 42, '#e2f2ff', 'opacity=".7"') +
      c(58, 58, 42, 'none', 'stroke="#7aa8cc" stroke-width="6"') +
      ant,
      { bg: '#fdfaea', ground: false });
  };

  ART.fast = function () {
    var ticks = '';
    for (var i = 0; i <= 8; i++) {
      var a = Math.PI - (i * Math.PI) / 8;
      var x1 = 60 + Math.cos(a) * 31, y1 = 86 + Math.sin(a) * 31;
      var x2 = 60 + Math.cos(a) * 42, y2 = 86 + Math.sin(a) * 42;
      ticks += ln(x1.toFixed(1), y1.toFixed(1), x2.toFixed(1), y2.toFixed(1),
                  i > 5 ? '#dc2626' : '#64748b', i > 5 ? 4.4 : 3);
    }
    return scene(
      ln(24, 18, 46, 18, '#cbd5e1', 4) + ln(32, 27, 52, 27, '#cbd5e1', 4) + ln(26, 36, 44, 36, '#cbd5e1', 4) +
      p('M14,86 A46,46 0 0 1 106,86 Z', '#f8fafc', 'stroke="#cbd5e1" stroke-width="3"') +
      p('M60,86 L92.5,53.5 A46,46 0 0 1 106,86 Z', '#fca5a5') +
      ticks +
      ln(60, 86, 93, 72, '#e0453f', 5) + c(60, 86, 8, '#334155') + c(60, 86, 3, '#94a3b8') +
      rc(30, 84, 60, 11, '#334155', 4) + rc(40, 95, 40, 9, '#1e293b', 3),
      { bg: '#fdfaea' });
  };

  ART.slow = function () {
    return scene(
      c(96, 26, 16, '#f1f5f9') + c(96, 26, 12, '#fdfdff') +
      ln(96, 26, 96, 18, '#334155', 2.6) + ln(96, 26, 103, 30, '#e0453f', 2.4) + c(96, 26, 2, '#334155') +
      c(76, 76, 22, '#e08a3c') +
      ps('M76,76 C64,76 62,64 72,62 C80,60 86,68 80,74 C76,78 70,74 73,70', '#a45a15', 3.4) +
      p('M12,94 C28,80 58,80 80,88 C92,92 104,90 100,84 C96,80 88,82 86,88 C80,96 58,98 40,98 Z', '#f5d6a0') +
      ps('M18,88 C14,76 18,70 23,70', '#f5d6a0', 4.4) + c(23, 69, 3.4, SKIN) +
      ps('M27,86 C25,74 30,68 35,69', '#f5d6a0', 4.4) + c(35, 68, 3.4, SKIN) +
      ps('M86,88 C92,86 96,84 96,80', '#e8c48a', 2.4),
      { bg: '#fdfaea' });
  };

  ART.happy = function () {
    return scene(
      c(22, 24, 9, '#fbbf24') +
      person(60, 44, { scale: 0.9, shirt: '#f59e0b', arms: false, smile: true, hair: '#3a2f2a' }) +
      ps('M50,54 C42,46 40,38 44,30', '#f59e0b', 5.4) + c(44, 28, 3.6, SKIN) +
      ps('M70,54 C78,46 80,38 76,30', '#f59e0b', 5.4) + c(76, 28, 3.6, SKIN) +
      rc(16, 56, 6, 6, '#ef4444', 1.5) + rc(98, 50, 6, 6, '#8b5cf6', 1.5) +
      c(30, 40, 3.4, '#22c55e') + c(92, 36, 3.4, '#3b82f6') + c(104, 68, 3, '#ec4899') +
      rc(84, 78, 7, 7, '#fbbf24', 1.5) + rc(28, 84, 6, 6, '#22c55e', 1.5),
      { bg: '#fdfaea' });
  };

  ART.sad = function () {
    return scene(
      c(42, 30, 15, '#c3d3e6') + c(60, 26, 18, '#d3e0ee') + c(78, 30, 14, '#c3d3e6') +
      rc(28, 28, 64, 13, '#d3e0ee', 6.5) +
      ps('M38,50 L34,64', '#5ba8f5', 3.4) + ps('M52,50 L48,68', '#5ba8f5', 3.4) + ps('M66,50 L62,64', '#5ba8f5', 3.4) +
      e(48, 100, 9, 6, '#475569') + e(72, 100, 9, 6, '#475569') +
      p('M46,90 C46,80 74,80 74,90 L74,104 L46,104 Z', '#64748b') +
      c(60, 70, 12, SKIN) +
      p('M48,68 C48,54 72,54 72,68 C68,60 52,60 48,68 Z', '#3a2f2a') +
      ps('M54,70 q2.5,3 5,0', NIGHT, 2) + ps('M61,70 q2.5,3 5,0', NIGHT, 2) +
      ps('M55,78 Q60,73 65,78', '#8a3a4a', 2.2) +
      c(53, 77, 2, '#5ba8f5'),
      { bg: '#fdfaea' });
  };

  ART.hot = function () {
    var rays = '';
    for (var i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      rays += ln((88 + Math.cos(a) * 21).toFixed(1), (26 + Math.sin(a) * 21).toFixed(1),
                 (88 + Math.cos(a) * 28).toFixed(1), (26 + Math.sin(a) * 28).toFixed(1), '#f59e0b', 3.4);
    }
    return scene(
      c(88, 26, 15, '#fbbf24') + rays +
      rc(48, 42, 14, 56, '#f1f5f9', 7) + c(55, 100, 11, '#e0453f') +
      rc(52, 60, 6, 42, '#e0453f', 3) +
      ln(62, 50, 68, 50, '#94a3b8', 2) + ln(62, 62, 68, 62, '#94a3b8', 2) +
      ln(62, 74, 68, 74, '#94a3b8', 2) + ln(62, 86, 68, 86, '#94a3b8', 2) +
      ps('M30,58 C22,68 36,74 28,84', '#f97316', 3.4) +
      ps('M16,60 C8,70 22,76 14,86', '#fbbf24', 3),
      { bg: '#fdfaea', ground: false });
  };

  ART.cold = function () {
    var flake = '';
    for (var i = 0; i < 3; i++) {
      var a = (i * Math.PI) / 3;
      flake += ln((98 - Math.cos(a) * 10).toFixed(1), (26 - Math.sin(a) * 10).toFixed(1),
                  (98 + Math.cos(a) * 10).toFixed(1), (26 + Math.sin(a) * 10).toFixed(1), '#7dd3fc', 2.6);
    }
    return scene(
      flake +
      c(60, 90, 24, '#fdfdff') + c(60, 62, 18, '#fdfdff') + c(60, 38, 14, '#fdfdff') +
      c(55, 36, 2, NIGHT) + c(65, 36, 2, NIGHT) +
      pl('60,40 51,44 60,45', '#f97316') +
      c(60, 58, 2.2, '#cbd5e1') + c(60, 66, 2.2, '#cbd5e1') + c(60, 84, 2.4, '#cbd5e1') + c(60, 93, 2.4, '#cbd5e1') +
      rc(42, 76, 36, 8, '#ef4444', 3) + p('M70,82 L80,104 L68,102 Z', '#dc2626') +
      ps('M44,66 C30,62 26,54 26,46', '#8a5a33', 3.2) +
      ps('M76,66 C90,62 94,54 94,46', '#8a5a33', 3.2),
      { bg: '#fdfaea' });
  };

  ART.beautiful = function () {
    function daisy(cx, cy, r, color) {
      var s = '', i;
      for (i = 0; i < 6; i++) {
        var a = (i * Math.PI) / 3;
        s += e(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.62, r * 0.62, color,
               'transform="rotate(' + (i * 60) + ' ' + (cx + Math.cos(a) * r).toFixed(1) + ' ' + (cy + Math.sin(a) * r).toFixed(1) + ')"');
      }
      return s + c(cx, cy, r * 0.5, '#fbbf24') + c(cx, cy, r * 0.26, '#f59e0b');
    }
    return scene(
      ps('M38,52 C42,64 48,72 56,78', '#4a9e4a', 3) +
      ps('M60,42 C60,58 60,68 60,80', '#4a9e4a', 3) +
      ps('M82,54 C78,66 72,74 64,80', '#4a9e4a', 3) +
      p('M34,104 L60,62 L86,104 Z', '#fde68a') +
      p('M60,62 L86,104 L60,104 Z', '#fcd34d') +
      rc(38, 86, 44, 10, '#e0453f', 3) +
      e(44, 84, 11, 6, '#e0453f', 'transform="rotate(-28 44 84)"') +
      e(76, 84, 11, 6, '#e0453f', 'transform="rotate(28 76 84)"') +
      daisy(38, 48, 11, '#f472b6') + daisy(60, 38, 12, '#fb7185') + daisy(82, 52, 10, '#a78bfa') +
      p('M12,26 L15,34 L23,37 L15,40 L12,48 L9,40 L1,37 L9,34 Z', '#fbbf24') +
      p('M104,22 L106,28 L112,30 L106,32 L104,38 L102,32 L96,30 L102,28 Z', '#fbbf24') +
      c(30, 16, 2.4, '#fde68a') + c(90, 12, 2, '#fde68a') + c(102, 66, 2.2, '#fde68a'),
      { bg: '#fdfaea' });
  };

  ART.new = function () {
    return scene(
      rc(22, 54, 76, 48, '#ef4444', 4) +
      rc(16, 42, 88, 16, '#dc2626', 3) +
      rc(52, 42, 16, 60, '#fbbf24') + rc(16, 46, 88, 9, '#fbbf24') +
      e(46, 40, 13, 8, '#fcd34d', 'transform="rotate(-26 46 40)"') +
      e(74, 40, 13, 8, '#fcd34d', 'transform="rotate(26 74 40)"') +
      c(60, 44, 6, '#f59e0b') +
      p('M104,26 L107,34 L115,37 L107,40 L104,48 L101,40 L93,37 L101,34 Z', '#fbbf24') +
      p('M18,80 L20,86 L26,88 L20,90 L18,96 L16,90 L10,88 L16,86 Z', '#fde68a'),
      { bg: '#fdfaea' });
  };

  /* ------------------------------------------------------------------ *
   * Public API
   * ------------------------------------------------------------------ */

  var cache = Object.create(null);

  LLC.art = {
    /** SVG markup for a word id; falls back to generated geometry. */
    get: function (id) {
      if (cache[id]) return cache[id];
      var markup;
      try {
        markup = ART[id] ? ART[id]() : fallback(id);
      } catch (err) {
        markup = fallback(id);
      }
      cache[id] = markup;
      return markup;
    },
    has: function (id) { return !!ART[id]; },
    scene: scene,
    fallback: fallback,
    person: person
  };
})(window);
