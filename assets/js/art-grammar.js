/*!
 * art-grammar.js - Artwork for the abstract half of the deck: verbs,
 * adjectives and the whole grammar (adverbs, pronouns, prepositions,
 * conjunctions, interjections and numerals).
 *
 * Abstract words are drawn as *scenes and gestures* rather than objects: a
 * figure pointing at itself for "I", a hand reaching into a box for "in", a
 * speaker bubble for "hello". The little helpers below keep that language
 * consistent across the 171 cards.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var d = LLC.art.d, F = LLC.art.f, person = LLC.art.person;
  var spark = F.spark;
  var c = d.c, e = d.e, rc = d.rc, p = d.p, ps = d.ps, pl = d.pl, ln = d.ln, txt = d.txt, scene = d.scene;
  var SKIN = LLC.art.colors.SKIN, NIGHT = LLC.art.colors.NIGHT;
  var map = {};

  /* ================================================== local vocabulary == */

  function bubble(x, y, w, h, fill) { return F.bubble(x, y, w, h, fill || '#fdfdff'); }

  function qm(x, y, s, color) {
    color = color || '#7c3aed';
    return ps('M' + (x - s * 0.4) + ',' + (y - s * 0.55) + ' a' + (s * 0.4) + ',' + (s * 0.45) + ' 0 1 1 ' + (s * 0.4) + ',' + (s * 0.35) +
      ' l0,' + (s * 0.25), color, s * 0.22) + c(x, y + s * 0.45, s * 0.12, color);
  }

  function excl(x, y, s, color) {
    color = color || '#dc2626';
    return rc(x - s * 0.11, y - s * 0.6, s * 0.22, s * 0.85, color, s * 0.11) + c(x, y + s * 0.5, s * 0.12, color);
  }

  function arrow(x1, y1, x2, y2, color, w) {
    w = w || 4;
    var a = Math.atan2(y2 - y1, x2 - x1);
    var h = w * 2.6;
    return ps('M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2, color, w) +
      pl([x2, y2,
        x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42),
        x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)], color);
  }

  function arcArrow(cx, cy, r, a0, a1, color, w) {
    var x0 = cx + Math.cos(a0) * r, y0 = cy + Math.sin(a0) * r;
    var x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r;
    var large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
    var sweep = a1 > a0 ? 1 : 0;
    var path = 'M' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large + ' ' + sweep + ' ' + x1.toFixed(1) + ',' + y1.toFixed(1);
    var a = a1, h = 11;
    return ps(path, color, w || 4) +
      pl([x1, y1, x1 - h * Math.cos(a - 0.5), y1 - h * Math.sin(a - 0.5), x1 - h * Math.cos(a + 0.5), y1 - h * Math.sin(a + 0.5)], color);
  }

  function tick(x, y, s, color) {
    color = color || '#22c55e';
    return ps('M' + (x - s * 0.45) + ',' + y + ' L' + (x - s * 0.1) + ',' + (y + s * 0.38) + ' L' + (x + s * 0.5) + ',' + (y - s * 0.4), color, s * 0.24);
  }

  function cross(x, y, s, color, w) {
    color = color || '#dc2626';
    w = w || 7;
    return ln(x - s / 2, y - s / 2, x + s / 2, y + s / 2, color, w) + ln(x + s / 2, y - s / 2, x - s / 2, y + s / 2, color, w);
  }

  function loopSlash(x, y, r, color) {
    return arcArrow(x, y, r, -2.4, 1.6, color, 4) + cross(x, y, r * 1.7, color, 6);
  }

  function check(x, y, s, color, w) {
    color = color || '#22c55e';
    return ps('M' + (x - s * 0.45) + ',' + y + ' L' + (x - s * 0.1) + ',' + (y + s * 0.4) + ' L' + (x + s * 0.5) + ',' + (y - s * 0.42), color, w || 8);
  }

  function bulb(x, y, r, color) {
    return c(x, y, r, color || '#fbbf24') + rc(x - r * 0.3, y + r * 0.7, r * 0.6, r * 0.4, '#cbd5e1', 2) +
      rc(x - r * 0.22, y + r * 1.2, r * 0.44, r * 0.28, '#94a3b8', 2);
  }

  function handUp(x, base, count, color) {
    color = color || SKIN;
    var s = rc(x - 22, base - 30, 44, 34, color, 12);
    var w = 9, gap = 3, i;
    var total = count * w + (count - 1) * gap;
    var startX = x - total / 2;
    for (i = 0; i < count; i++) {
      var h = count === 1 ? 22 : 28;
      s += rc(startX + i * (w + gap), base - 30 - h, w, h, color, 4.5);
    }
    s += rc(x - 31, base - 20, 12, 20, color, 6);
    return s;
  }

  /* Dot layouts for the numerals, arranged the way they are usually shown. */
  var DOT_LAYOUT = [
    [[0, 0]],
    [[-22, 0], [22, 0]],
    [[-24, -18], [0, 0], [24, 18]],
    [[-22, -20], [22, -20], [-22, 20], [22, 20]],
    [[-24, -22], [24, -22], [0, 0], [-24, 22], [24, 22]],
    [[-24, -26], [24, -26], [-24, 0], [24, 0], [-24, 26], [24, 26]],
    [[-26, -26], [26, -26], [-26, 0], [26, 0], [-26, 26], [26, 26], [0, -13]],
    [[-30, -24], [-10, -24], [10, -24], [30, -24], [-30, 4], [-10, 4], [10, 4], [30, 4]],
    [[-30, -28], [0, -28], [30, -28], [-30, 0], [0, 0], [30, 0], [-30, 28], [0, 28], [30, 28]],
    [[-34, -22], [-17, -22], [0, -22], [17, -22], [34, -22], [-34, 2], [-17, 2], [0, 2], [17, 2], [34, 2]]
  ];

  function dots(n, color) {
    return DOT_LAYOUT[n - 1].map(function (pt) {
      return c(60 + pt[0] * 1.15, 62 + pt[1] * 1.15, 8.5, color || '#4f46e5') +
        c(58 + pt[0] * 1.15, 60 + pt[1] * 1.15, 3, '#ffffff', 'opacity=".45"');
    }).join('');
  }

  function part(x, y, opts) {
    return scene(person(x, y, opts), { bg: '#ebfeff' });
  }

  var VBG = '#ebfeff', ABG = '#fdfaea', GBG = '#eef2ff';

  /* =========================================================== verbs (40) */

  map.cook = function () {
    return scene(
      rc(14, 74, 92, 8, '#94a3b8', 2) + rc(22, 82, 8, 22, '#64748b', 2) + rc(90, 82, 8, 22, '#64748b', 2) +
      c(46, 68, 4, '#334155') + c(74, 68, 4, '#334155') +
      e(46, 62, 16, 5, '#334155') + e(74, 62, 16, 5, '#334155') +
      ps('M42,54 C46,46 36,42 40,34 M50,54 C54,46 44,42 48,34', '#cbd5e1', 2.6) +
      person(60, 36, { scale: 0.78, shirt: '#e0453f', hair: '#3a2f2a', arms: false, smile: true }) +
      ps('M48,50 C44,58 40,62 38,66', SKIN, 5) + c(38, 66, 3.4, SKIN),
      { bg: VBG });
  };

  map.cleanverb = function () {
    return scene(
      rc(16, 78, 88, 12, '#cbd5e1', 3) +
      p('M30,78 C30,66 46,64 52,74 L60,84 L44,92 C34,90 30,86 30,78 Z', '#7dd3fc') +
      spark(72, 62, 8, '#fbbf24') + spark(88, 76, 6, '#fcd34d') + spark(60, 56, 5, '#fde68a') +
      person(46, 34, { scale: 0.78, shirt: '#0ea5e9', hair: '#3a2f2a', arms: false, smile: true }) +
      ps('M56,48 C64,54 68,60 66,66', SKIN, 5) + c(66, 67, 3.4, SKIN),
      { bg: VBG });
  };

  map.wash = function () {
    return scene(
      rc(24, 58, 72, 34, '#e2e8f0', 8, 'stroke="#cbd5e1" stroke-width="2"') +
      p('M30,68 C40,60 50,72 60,64 C70,56 80,70 90,62 L90,88 L30,88 Z', '#7dd3fc') +
      c(46, 56, 5, '#fdfdff') + c(66, 50, 4, '#fdfdff') + c(78, 58, 3.4, '#fdfdff') +
      c(50, 44, 3, '#fdfdff', 'opacity=".8"') + c(60, 40, 2.4, '#fdfdff', 'opacity=".7"') +
      rc(40, 84, 18, 12, '#fbcfe8', 5) + c(48, 78, 3, '#fdfdff'),
      { bg: VBG });
  };

  map.work = function () {
    return scene(
      rc(16, 82, 88, 8, '#8a5a33', 2) + rc(24, 90, 8, 16, '#6b4423', 2) + rc(88, 90, 8, 16, '#6b4423', 2) +
      rc(38, 48, 44, 32, '#334155', 3) + rc(42, 52, 36, 24, '#8ec6fb', 2) + rc(52, 82, 16, 4, '#94a3b8', 1.5) +
      person(60, 30, { scale: 0.72, shirt: '#4f46e5', hair: '#3a2f2a', arms: false, smile: true }) +
      ps('M50,44 C50,50 52,54 56,56 M70,44 C70,50 68,54 64,56', SKIN, 4.4),
      { bg: VBG });
  };

  map.study = function () {
    return scene(
      person(60, 40, { scale: 0.8, shirt: '#0d9488', hair: '#3a2f2a', arms: false, smile: true }) +
      c(48, 38, 9, 'none', 'stroke="#0f172a" stroke-width="2.2"') +
      c(70, 38, 9, 'none', 'stroke="#0f172a" stroke-width="2.2"') +
      ln(57, 38, 61, 38, '#0f172a', 2.2) +
      p('M60,66 C50,60 36,60 28,64 L28,88 C36,84 50,84 60,90 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      p('M60,66 C70,60 84,60 92,64 L92,88 C84,84 70,84 60,90 Z', '#fdf6ea', 'stroke="#cbd5e1" stroke-width="2"') +
      ln(60, 64, 60, 90, '#cbd5e1', 2),
      { bg: VBG });
  };

  map.learn = function () {
    return scene(
      bulb(60, 26, 14) + spark(38, 20, 6) + spark(84, 24, 5) +
      rc(34, 66, 22, 28, '#f8d47c', 2) + ln(40, 74, 50, 74, '#b48a2a', 1.8) + ln(40, 80, 50, 80, '#b48a2a', 1.8) +
      ln(58, 82, 58, 62, '#b48a2a', 1.8) + ln(58, 62, 92, 50, '#b48a2a', 1.8) +
      person(60, 44, { scale: 0.62, shirt: '#8b5cf6', hair: '#3a2f2a', arms: false, smile: true }),
      { bg: VBG });
  };

  map.teach = function () {
    return scene(
      rc(66, 22, 44, 34, '#0f766e', 3) + txt(88, 44, 'A', 15, '#ffffff') + txt(80, 44, 'B', 15, '#ffffff') + txt(96, 44, 'C', 15, '#ffffff') +
      ps('M58,54 L82,58', '#8a5a33', 3.4) +
      person(40, 44, { scale: 0.78, shirt: '#0d9488', hair: '#3a2f2a', arms: false, smile: true }),
      { bg: VBG });
  };

  map.buy = function () {
    return scene(
      p('M34,34 L86,34 L78,100 L42,100 Z', '#e0457b') +
      arcArrow(60, 36, 26, Math.PI, 0, '#e0457b', 4) +
      c(60, 66, 11, '#fbbf24') + txt(60, 72, '$', 15, '#8a6a10') +
      spark(30, 30, 6, '#fcd34d') + spark(94, 44, 5, '#fde68a'),
      { bg: VBG });
  };

  map.sell = function () {
    return scene(
      rc(10, 62, 100, 8, '#8a5a33', 2) +
      p('M36,40 L80,40 L74,62 L42,62 Z', '#8a5a33') + arcArrow(58, 42, 20, Math.PI, 0, '#8a5a33', 3.4) +
      c(88, 40, 9, '#fbbf24') + txt(88, 45, '$', 12, '#8a6a10') +
      person(34, 40, { scale: 0.72, shirt: '#16a34a', hair: '#3a2f2a', arms: false, smile: true }) +
      ps('M46,52 C54,56 58,58 62,58', SKIN, 4.4),
      { bg: VBG });
  };

  map.pay = function () {
    return scene(
      p('M22,40 L66,34 L70,60 L26,66 Z', '#4a9e4a') + txt(46, 54, '10', 13, '#ffffff') +
      p('M58,74 L102,68 L106,94 L62,100 Z', '#8a5a33') + txt(82, 88, '20', 13, '#fcd34d') +
      check(60, 100, 22, '#22c55e', 6),
      { bg: VBG });
  };

  map.open = function () {
    return scene(
      rc(28, 48, 64, 52, '#c98a4b', 3) +
      p('M28,48 L92,48 L86,32 L34,32 Z', '#a9754a') +
      ps('M60,30 C60,14 66,10 74,8', '#a9754a', 4) +
      c(96, 30, 6, '#a9754a') + c(24, 30, 6, '#a9754a') +
      spark(60, 24, 8, '#fbbf24') + spark(84, 20, 5, '#fcd34d') +
      arrow(20, 74, 4, 74, '#64748b', 3.4),
      { bg: VBG });
  };

  map['close'] = function () {
    return scene(
      rc(28, 44, 64, 56, '#c98a4b', 3) +
      p('M28,44 L92,44 L96,28 L24,28 Z', '#a9754a') +
      c(60, 36, 3, '#6b4423') +
      arrow(20, 62, 4, 62, '#64748b', 3.4) +
      ps('M74,80 L86,92 M86,80 L74,92', '#dc2626', 5),
      { bg: VBG });
  };

  map.give = function () {
    return scene(
      p('M14,64 C24,58 36,60 44,64 L44,88 C34,92 22,90 14,86 Z', SKIN) +
      c(52, 76, 12, '#e0453f') +
      p('M74,64 C84,58 96,60 106,64 L106,88 C96,92 84,90 74,86 Z', SKIN) +
      c(52, 76, 12, 'none', 'stroke="#ffffff" stroke-width="2" opacity=".6"') +
      heartTop(60, 26),
      { bg: VBG });
  };

  function heartTop(x, y) {
    return p('M' + x + ',' + (y + 14) + ' C' + (x - 14) + ',' + (y + 4) + ' ' + (x - 11) + ',' + (y - 8) + ' ' + x + ',' + (y - 2) +
      ' C' + (x + 11) + ',' + (y - 8) + ' ' + (x + 14) + ',' + (y + 4) + ' ' + x + ',' + (y + 14) + ' Z', '#e0453f');
  }

  map.take = function () {
    return scene(
      rc(24, 70, 44, 30, '#c98a4b', 3) + p('M24,70 L68,70 L64,58 L28,58 Z', '#a9754a') +
      c(46, 50, 12, '#e0453f') +
      p('M76,64 C86,58 98,60 108,64 L108,88 C98,92 86,90 76,86 Z', SKIN) +
      ps('M78,54 C74,48 72,44 74,40', SKIN, 5),
      { bg: VBG });
  };

  map.send = function () {
    return scene(
      rc(14, 42, 56, 38, '#fdfdff', 3) +
      ps('M14,42 L42,62 L70,42', '#94a3b8', 2.4) +
      arrow(78, 60, 112, 44, '#4f46e5', 4) +
      ps('M24,88 C34,94 44,88 54,92', '#cbd5e1', 2.6) +
      person(42, 34, { scale: 0.6, shirt: '#4f46e5', hair: '#3a2f2a', arms: false, smile: true }),
      { bg: VBG });
  };

  map.help = function () {
    return scene(
      person(34, 44, { scale: 0.86, shirt: '#16a34a', hair: '#3a2f2a', smile: true, arms: false }) +
      person(86, 58, { scale: 0.6, shirt: '#f97316', hair: '#3a2f2a', smile: true, arms: false, legs: false }) +
      ps('M48,54 C58,42 68,44 76,54', '#16a34a', 6) + c(78, 55, 4, SKIN) +
      ps('M50,64 C60,54 70,56 78,64', '#16a34a', 5) + c(80, 64, 3.6, SKIN) +
      spark(60, 22, 8, '#fcd34d') + spark(84, 30, 5, '#fde68a') + spark(38, 28, 4.4, '#fbbf24'),
      { bg: VBG });
  };

  map.need = function () {
    return scene(
      person(40, 56, { scale: 0.8, shirt: '#dc2626', hair: '#3a2f2a', smile: true, arms: false }) +
      bubble(88, 30, 46, 34, '#fdfdff') +
      c(88, 30, 13, '#e2e8f0') +
      c(88, 30, 13, 'none', 'stroke="#94a3b8" stroke-width="2.6" stroke-dasharray="5 4"') +
      cross(88, 30, 22, '#dc2626', 4) +
      ps('M52,64 C60,58 68,54 74,50', SKIN, 5),
      { bg: VBG });
  };

  map.wait = function () {
    return scene(
      c(88, 30, 16, '#fcd34d') + c(88, 30, 13, '#fdfdff') +
      ln(88, 30, 88, 22, '#334155', 2.4) + ln(88, 30, 95, 33, '#334155', 2.4) + c(88, 30, 2, '#334155') +
      person(48, 46, { scale: 0.8, shirt: '#8b5cf6', hair: '#3a2f2a', smile: true }) +
      rc(30, 80, 36, 6, '#c98a4b', 2) + rc(34, 86, 5, 14, '#a9754a', 2) + rc(57, 86, 5, 14, '#a9754a', 2) +
      ps('M40,58 C36,64 34,68 32,72', SKIN, 4.4),
      { bg: VBG });
  };

  map.look = function () {
    return scene(
      p('M8,58 C26,34 74,34 92,58 C74,82 26,82 8,58 Z', '#fdfdff', 'stroke="#64748b" stroke-width="3"') +
      c(50, 58, 19, '#5b8ed6') + c(50, 58, 9, NIGHT) + c(44, 51, 5, '#ffffff', 'opacity=".8"') +
      arrow(66, 76, 104, 96, '#4f46e5', 4) +
      c(104, 98, 4, '#4f46e5'),
      { bg: VBG });
  };

  map.watch = function () {
    return scene(
      rc(12, 24, 84, 56, '#1f2937', 5) + rc(19, 31, 70, 42, '#8ec6fb', 2) +
      person(54, 52, { scale: 0.42, shirt: '#e0453f', hair: '#3a2f2a', arms: false }) +
      rc(44, 80, 28, 6, '#374151', 2) + e(58, 92, 28, 4, '#374151') +
      rc(100, 40, 6, 24, '#4f46e5', 2),
      { bg: VBG });
  };

  map.speak = function () {
    return scene(
      person(46, 46, { scale: 0.82, shirt: '#0d9488', hair: '#3a2f2a', smile: false }) +
      e(46, 52, 4, 5, '#8a3a4a') +
      bubble(92, 40, 46, 34, '#fdfdff') +
      ps('M22,46 C30,42 32,52 26,56', '#0d9488', 2.6) +
      ps('M28,58 C34,54 36,62 30,66', '#0d9488', 2.4),
      { bg: VBG });
  };

  map.talk = function () {
    return scene(
      person(34, 50, { scale: 0.72, shirt: '#0d9488', hair: '#3a2f2a', smile: true }) +
      person(88, 50, { scale: 0.72, shirt: '#e0457f', hair: '#3f2f28', smile: true }) +
      bubble(58, 24, 40, 26, '#fdfdff') +
      ps('M52,30 C50,36 52,40 56,42', '#0d9488', 2.2) +
      ps('M66,30 C68,36 66,40 62,42', '#e0457f', 2.2) +
      tick(58, 24, 9, '#0d9488') + tick(58, 24, 9, '#e0457f'),
      { bg: VBG });
  };

  map.ask = function () {
    return scene(
      person(46, 48, { scale: 0.8, shirt: '#4f46e5', hair: '#3a2f2a', smile: true }) +
      bubble(90, 40, 44, 40, '#fdfdff') + qm(90, 42, 22, '#4f46e5') +
      ps('M22,48 C30,44 32,54 26,58', '#4f46e5', 2.6),
      { bg: VBG });
  };

  map.answer = function () {
    return scene(
      bubble(36, 34, 44, 34, '#e2e8f0') + qm(36, 36, 20, '#64748b') +
      bubble(88, 56, 44, 36, '#dcfce7') + check(88, 56, 24, '#16a34a', 6) +
      arrow(56, 48, 66, 52, '#22c55e', 3.4) +
      person(24, 74, { scale: 0.56, shirt: '#0d9488', hair: '#3a2f2a', arms: false, smile: true }),
      { bg: VBG });
  };

  map.call = function () {
    return scene(
      person(50, 44, { scale: 0.84, shirt: '#0ea5e9', hair: '#3a2f2a', smile: true, arms: false }) +
      rc(30, 36, 14, 24, '#1f2937', 4) + c(37, 48, 4, '#334155') +
      ps('M48,56 C42,56 40,50 42,44', SKIN, 5) +
      ps('M52,36 C60,32 64,40 58,46', '#1f2937', 3) +
      arcArrow(74, 60, 16, -1.1, 0.5, '#0ea5e9', 3) +
      arcArrow(78, 60, 24, -1.1, 0.5, '#38bdf8', 3) +
      c(96, 30, 4, '#fcd34d'),
      { bg: VBG });
  };

  map.meet = function () {
    return scene(
      person(34, 48, { scale: 0.78, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      person(88, 48, { scale: 0.78, shirt: '#4f46e5', hair: '#3f2f28', smile: true, arms: false }) +
      rc(52, 64, 20, 14, SKIN, 5) + rc(50, 66, 20, 12, SKIN, 5, 'opacity=".5"') +
      ps('M46,56 C52,62 56,64 60,64', '#0d9488', 5) +
      ps('M78,56 C72,62 68,64 64,64', '#4f46e5', 5) +
      spark(60, 26, 7, '#fcd34d') + spark(80, 18, 5, '#fde68a'),
      { bg: VBG });
  };

  map.love = function () {
    return scene(
      person(40, 50, { scale: 0.76, shirt: '#e0457f', longHair: true, hair: '#3f2f28', smile: true, arms: false }) +
      person(84, 50, { scale: 0.76, shirt: '#4f46e5', hair: '#3a2f2a', smile: true, arms: false }) +
      heartTop(62, 22) +
      ps('M50,62 C56,56 60,58 62,62', '#e0457f', 5) +
      ps('M74,62 C68,56 64,58 62,62', '#4f46e5', 5) +
      c(60, 22, 3, '#ffffff', 'opacity=".4"'),
      { bg: VBG });
  };

  map.want = function () {
    return scene(
      person(44, 52, { scale: 0.78, shirt: '#f97316', hair: '#3a2f2a', smile: true, arms: false }) +
      ps('M56,60 C68,52 76,48 84,46', SKIN, 5) + c(86, 45, 4, SKIN) +
      bubble(86, 24, 40, 30, '#fdfdff') + c(86, 24, 9, '#e0453f') +
      c(70, 18, 3, '#fcd34d'),
      { bg: VBG });
  };

  map.know = function () {
    return scene(
      person(52, 52, { scale: 0.8, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      bulb(90, 30, 13) +
      check(90, 30, 24, '#16a34a', 4) +
      spark(76, 20, 5, '#fcd34d') + spark(104, 18, 4, '#fde68a'),
      { bg: VBG });
  };

  map.remember = function () {
    return scene(
      person(46, 56, { scale: 0.76, shirt: '#8b5cf6', hair: '#3a2f2a', smile: true, arms: false }) +
      bubble(88, 30, 44, 34, '#fdfdff') +
      rc(80, 18, 16, 24, '#fdfdff', 2, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(76, 16, 24, 6, '#8b5cf6', 2) +
      ln(88, 24, 88, 30, '#94a3b8', 2) + ln(88, 30, 92, 32, '#94a3b8', 2) +
      ps('M58,64 C66,60 72,58 78,56', SKIN, 5),
      { bg: VBG });
  };

  map.forget = function () {
    return scene(
      person(46, 56, { scale: 0.76, shirt: '#64748b', hair: '#3a2f2a', smile: false, arms: false }) +
      bubble(88, 32, 46, 32, '#e2e8f0') +
      c(80, 26, 9, '#cbd5e1') + c(92, 26, 7, '#cbd5e1') +
      cross(88, 32, 30, '#94a3b8', 4) +
      c(30, 30, 4, '#cbd5e1', 'opacity=".7"') + c(22, 38, 3, '#cbd5e1', 'opacity=".6"'),
      { bg: VBG });
  };

  map.think = function () {
    return scene(
      person(48, 58, { scale: 0.8, shirt: '#0ea5e9', hair: '#3a2f2a', smile: true, arms: false }) +
      c(70, 36, 6, '#fdfdff') + c(82, 26, 10, '#fdfdff') + c(94, 17, 15, '#fdfdff') +
      qm(94, 18, 20, '#4f46e5') +
      ps('M40,68 C32,68 28,64 26,58', SKIN, 5),
      { bg: VBG });
  };

  map.start = function () {
    return scene(
      ps('M6,96 C34,84 70,84 114,94', '#cbd5e1', 4) +
      rc(60, 24, 5, 62, '#64748b', 2) + p('M65,26 L104,38 L65,50 Z', '#22c55e') +
      person(38, 52, { scale: 0.7, shirt: '#22c55e', hair: '#3a2f2a', smile: true }) +
      ps('M12,60 L34,54 M6,72 L30,68', '#94a3b8', 3),
      { bg: VBG });
  };

  map.stop = function () {
    return scene(
      rc(34, 26, 6, 74, '#94a3b8', 2) + e(37, 26, 9, 5, '#64748b') +
      p('M14,58 L60,24 L106,58 L106,80 L14,80 Z', '#dc2626') +
      rc(26, 50, 68, 12, '#fdfdff', 2) +
      e(60, 100, 22, 6, '#cbd5e1'),
      { bg: VBG });
  };

  map.finish = function () {
    return scene(
      ps('M6,96 C40,86 78,86 114,94', '#cbd5e1', 4) +
      rc(88, 26, 5, 60, '#64748b', 2) + p('M93,28 L116,36 L93,44 Z', '#f59e0b') +
      check(38, 52, 44, '#22c55e', 9) +
      person(70, 56, { scale: 0.6, shirt: '#16a34a', hair: '#3a2f2a', arms: false, smile: true }),
      { bg: VBG });
  };

  map.lose = function () {
    return scene(
      rc(40, 60, 5, 44, '#64748b', 2) + p('M45,62 L76,70 L45,78 Z', '#94a3b8') +
      c(84, 78, 14, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      person(56, 34, { scale: 0.72, shirt: '#64748b', hair: '#3a2f2a', smile: false, arms: false }) +
      ps('M46,42 Q50,38 54,42 M58,42 Q62,38 66,42', '#2f2a3d', 2.4) +
      ps('M48,50 Q56,45 64,50', '#2f2a3d', 2.4),
      { bg: VBG });
  };

  map.win = function () {
    return scene(
      e(60, 78, 26, 8, '#94a3b8') + rc(52, 78, 16, 16, '#cbd5e1', 2) +
      p('M38,32 L82,32 C82,56 72,64 60,64 C48,64 38,56 38,32 Z', '#fbbf24') +
      p('M38,38 L26,38 C26,52 32,58 40,56', '#f59e0b') +
      p('M82,38 L94,38 C94,52 88,58 80,56', '#f59e0b') +
      c(60, 44, 6, '#b45309') +
      spark(24, 22, 6, '#fcd34d') + spark(98, 20, 5, '#fde68a') + spark(60, 12, 5, '#fbbf24') +
      rc(44, 92, 32, 8, '#94a3b8', 3),
      { bg: VBG });
  };

  map.cry = function () {
    return scene(
      person(60, 46, { scale: 0.86, shirt: '#64748b', hair: '#3a2f2a', smile: false, arms: false }) +
      e(50, 46, 2.6, 4, NIGHT) + e(70, 46, 2.6, 4, NIGHT) +
      ps('M52,60 Q60,54 68,60', '#2f2a3d', 2.6) +
      p('M48,64 C48,74 46,80 46,86 C46,92 54,92 54,86 C54,80 52,74 52,64 Z', '#7dd3fc') +
      p('M70,64 C70,74 68,80 68,86 C68,92 76,92 76,86 C76,80 74,74 74,64 Z', '#7dd3fc'),
      { bg: VBG });
  };

  map.laugh = function () {
    return scene(
      person(60, 44, { scale: 0.86, shirt: '#f59e0b', hair: '#3a2f2a', smile: false, arms: false }) +
      ps('M45,42 q6,-9 12,0 M63,42 q6,-9 12,0', NIGHT, 3) +
      p('M44,54 C48,74 72,74 76,54 Z', '#7a2c2c') + p('M50,66 C56,70 64,70 70,66 Z', '#e8706a') +
      ps('M30,48 C22,52 20,62 26,68 M90,48 C98,52 100,62 94,68', '#f59e0b', 3) +
      txt(24, 26, 'ha', 11, '#94a3b8') + txt(96, 24, 'ha', 11, '#94a3b8'),
      { bg: VBG });
  };

  map.travel = function () {
    return scene(
      p('M20,58 L48,50 L66,52 L78,42 L84,42 L76,52 L94,54 L102,60 L94,66 L76,66 L84,78 L78,78 L66,66 L48,68 L28,78 L20,72 L28,60 Z',
        '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"') +
      p('M38,56 L60,58 L72,60 L60,64 L38,64 Z', '#3b82f6') +
      rc(28, 82, 30, 22, '#8a5a33', 3) + arcArrow(43, 82, 11, Math.PI, 0, '#8a5a33', 2.6) +
      c(38, 93, 2.4, '#fcd34d') +
      ps('M74,30 L86,18', '#64748b', 3) +
      c(104, 22, 4, '#fcd34d'),
      { bg: VBG, ground: false });
  };

  /* ====================================================== adjectives (31) */

  function cmp(a, b, label) { return scene(a + b, { bg: ABG }); }

  map.old = function () {
    return scene(
      c(46, 40, 16, '#e5e7eb') + c(66, 42, 13, '#e5e7eb') +
      c(56, 58, 19, SKIN) +
      c(49, 54, 2.2, NIGHT) + c(63, 54, 2.2, NIGHT) +
      p('M48,66 C48,82 64,82 64,66 C60,72 52,72 48,66 Z', '#e5e7eb') +
      ps('M50,72 Q56,75 62,72', '#c08a72', 1.8) +
      person(56, 58, { beard: true, shirt: '#64748b', hair: '#d1d5db', scale: 0.92, legs: false }) +
      rc(78, 60, 5, 44, '#8a5a33', 2) + ps('M80,64 C86,64 88,70 86,74', '#8a5a33', 3) + c(80, 60, 4, '#8a5a33'),
      { bg: ABG });
  };

  map.young = function () {
    return scene(
      person(60, 46, { scale: 0.62, shirt: '#4f46e5', longHair: true, hair: '#6b4423', smile: true }) +
      rc(28, 84, 64, 8, '#e2e8f0', 3) +
      spark(30, 26, 7, '#fcd34d') + spark(92, 30, 5, '#fde68a'),
      { bg: ABG });
  };

  map.tall = function () {
    return scene(
      rc(96, 14, 4, 90, '#cbd5e1', 2) +
      arrow(30, 96, 30, 18, '#22c55e', 4) +
      ln(22, 96, 98, 96, '#94a3b8', 3) +
      person(30, 50, { scale: 1.16, shirt: '#4f46e5', hair: '#3a2f2a', smile: true }) +
      txt(30, 112, '+', 14, '#22c55e'),
      { bg: ABG });
  };

  map.short = function () {
    return scene(
      rc(24, 18, 76, 8, '#f97316', 3) +
      rc(96, 26, 4, 76, '#cbd5e1', 2) +
      arrow(40, 26, 40, 96, '#dc2626', 4) +
      ln(18, 96, 100, 96, '#94a3b8', 3) +
      person(40, 82, { scale: 0.56, shirt: '#f97316', hair: '#3a2f2a', smile: true }),
      { bg: ABG });
  };

  map.long = function () {
    return scene(
      ps('M10,62 C40,50 80,74 110,58', '#f59e0b', 9) +
      arrow(10, 40, 10, 56, '#f59e0b', 4) +
      arrow(110, 86, 110, 70, '#f59e0b', 4) +
      ln(4, 48, 4, 84, '#f59e0b', 3) + ln(116, 48, 116, 84, '#f59e0b', 3),
      { bg: ABG, ground: false });
  };

  map.strong = function () {
    return scene(
      rc(22, 46, 10, 44, '#334155', 3) + rc(88, 46, 10, 44, '#334155', 3) +
      rc(20, 54, 80, 6, '#94a3b8', 2) +
      person(60, 40, { scale: 0.86, shirt: '#e0453f', hair: '#3a2f2a', smile: true, arms: false }) +
      ps('M50,54 C46,48 44,50 42,54 M70,54 C74,48 76,50 78,54', SKIN, 5) +
      spark(30, 24, 7, '#fcd34d') + spark(92, 26, 5, '#fde68a'),
      { bg: ABG });
  };

  map.weak = function () {
    return scene(
      rc(22, 46, 10, 44, '#334155', 3) + rc(88, 46, 10, 44, '#334155', 3) +
      rc(20, 56, 80, 5, '#cbd5e1', 2) +
      person(60, 40, { scale: 0.86, shirt: '#94a3b8', hair: '#3a2f2a', smile: false, arms: false }) +
      ps('M50,56 C44,60 40,58 38,54 M70,56 C76,60 80,58 82,54', SKIN, 4.4) +
      ps('M52,64 Q60,58 68,64', '#2f2a3d', 2.4) +
      c(100, 24, 3, '#cbd5e1', 'opacity=".8"'),
      { bg: ABG });
  };

  map.heavy = function () {
    return scene(
      p('M34,54 L86,54 L96,88 L24,88 Z', '#475569') +
      ps('M48,54 C48,40 58,36 60,26 C62,36 72,40 72,54', '#94a3b8', 6) +
      arrow(60, 14, 60, 30, '#dc2626', 4) +
      ln(10, 100, 110, 100, '#94a3b8', 3),
      { bg: ABG });
  };

  map.thin = function () {
    return scene(
      rc(46, 16, 4, 76, '#cbd5e1', 2) + p('M48,92 L44,104 L52,104 Z', '#cbd5e1') +
      rc(70, 16, 12, 76, '#94a3b8', 2) +
      arrow(48, 50, 26, 50, '#dc2626', 3.4) +
      ps('M22,50 L34,44 M22,50 L34,56', '#dc2626', 3),
      { bg: ABG });
  };

  map.wide = function () {
    return scene(
      ps('M14,62 C14,34 106,34 106,62', '#3b82f6', 6) +
      arrow(20, 50, 4, 34, '#3b82f6', 3.4) +
      arrow(100, 50, 116, 34, '#3b82f6', 3.4) +
      arrow(20, 74, 4, 90, '#3b82f6', 3.4) +
      arrow(100, 74, 116, 90, '#3b82f6', 3.4),
      { bg: ABG, ground: false });
  };

  map.rich = function () {
    return scene(
      rc(24, 52, 72, 48, '#8a5a33', 4) + p('M24,52 C24,40 96,40 96,52 Z', '#a9754a') +
      rc(52, 62, 16, 18, '#fbbf24', 2) +
      c(46, 36, 9, '#fbbf24') + c(60, 30, 9, '#fcd34d') + c(74, 36, 9, '#fbbf24') +
      c(60, 22, 8, '#fbbf24') + c(38, 26, 6, '#fcd34d') + c(84, 24, 6, '#fcd34d') +
      spark(102, 20, 5, '#fbbf24'),
      { bg: ABG });
  };

  map.poor = function () {
    return scene(
      p('M18,60 L102,60 L94,98 L26,98 Z', '#94a3b8') +
      ps('M18,60 C18,44 102,44 102,60', 'none', 0) +
      c(60, 52, 12, '#0f172a', 'opacity=".5"') +
      ps('M40,70 L46,78 M50,66 L58,76 M62,70 L70,80 M74,66 L82,76', '#64748b', 2) +
      c(34, 104, 2, '#94a3b8', 'opacity=".7"') + c(86, 104, 2, '#94a3b8', 'opacity=".7"'),
      { bg: ABG });
  };

  map.clean = function () {
    return scene(
      rc(14, 70, 92, 12, '#cbd5e1', 3) + rc(20, 82, 6, 22, '#94a3b8', 2) + rc(94, 82, 6, 22, '#94a3b8', 2) +
      spark(44, 44, 11, '#fcd34d') + spark(74, 36, 8, '#fbbf24') + spark(66, 58, 6, '#fde68a') +
      check(60, 22, 22, '#22c55e', 5),
      { bg: ABG });
  };

  map.dirty = function () {
    return scene(
      rc(14, 70, 92, 12, '#a8a29e', 3) + rc(20, 82, 6, 22, '#78716c', 2) + rc(94, 82, 6, 22, '#78716c', 2) +
      c(40, 66, 6, '#6b7280', 'opacity=".7"') + c(58, 68, 8, '#57534e', 'opacity=".6"') +
      c(76, 64, 5, '#6b7280', 'opacity=".65"') + c(66, 70, 4, '#78716c', 'opacity=".6"') +
      c(30, 24, 3, '#57534e') + c(50, 16, 2.4, '#57534e') + c(96, 22, 2.6, '#57534e') +
      ps('M84,30 C92,34 92,42 86,44', '#78716c', 2.4),
      { bg: ABG });
  };

  map.easy = function () {
    return scene(
      p('M4,96 C30,88 44,60 62,58 C82,56 92,74 116,64 L116,110 L4,110 Z', '#86efac') +
      arrow(20, 92, 52, 66, '#22c55e', 4) +
      check(92, 40, 26, '#22c55e', 6),
      { bg: ABG });
  };

  map.difficult = function () {
    return scene(
      p('M4,100 L40,44 L56,64 L70,30 L116,100 Z', '#94a3b8') +
      p('M66,34 L76,54 L86,42 L92,56 L100,40 L104,56 Z', '#f1f5f9') +
      person(34, 62, { scale: 0.62, shirt: '#dc2626', hair: '#3a2f2a', smile: false, arms: false }) +
      ps('M46,74 C52,68 56,70 60,76', '#dc2626', 3) +
      c(22, 30, 3, '#facc15') + c(100, 22, 2.4, '#facc15'),
      { bg: ABG });
  };

  map.busy = function () {
    return scene(
      person(60, 46, { scale: 0.82, shirt: '#f97316', hair: '#3a2f2a', smile: true, arms: false }) +
      e(30, 40, 9, 9, '#0ea5e9') + e(92, 42, 9, 9, '#e0457f') + e(34, 76, 9, 9, '#22c55e') + e(90, 78, 9, 9, '#fbbf24') +
      ps('M52,52 C46,46 40,44 34,42 M68,52 C74,46 80,44 86,44', SKIN, 4.4) +
      ps('M50,68 C44,74 40,76 34,76 M70,68 C76,74 80,76 86,76', SKIN, 4.4) +
      c(104, 24, 11, '#fdfdff') + c(104, 24, 9, '#334155') + ln(104, 24, 104, 18, '#334155', 2) + ln(104, 24, 109, 27, '#334155', 2),
      { bg: ABG });
  };

  map.quiet = function () {
    return scene(
      person(52, 48, { scale: 0.84, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      ps('M48,58 C46,54 44,52 42,50', SKIN, 4.4) +
      c(38, 48, 4, SKIN) +
      txt(88, 40, 'z', 16, '#94a3b8') + txt(100, 26, 'z', 12, '#b0bac9') +
      spark(92, 66, 5, '#cbd5e1'),
      { bg: ABG });
  };

  map.hungry = function () {
    return scene(
      e(60, 76, 36, 10, '#e2e8f0') + e(60, 70, 36, 10, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      e(60, 70, 24, 6, '#f1f5f9') +
      ps('M40,54 C44,60 48,62 52,62 M80,54 C76,60 72,62 68,62', '#f59e0b', 3) +
      c(60, 40, 18, '#fdfdff') + c(60, 46, 9, 'none', 'stroke="#e2e8f0" stroke-width="3"') +
      ps('M52,62 Q60,56 68,62', '#2f2a3d', 2.4) +
      ps('M84,44 C92,48 92,58 86,60', '#f59e0b', 2.6),
      { bg: ABG });
  };

  map.thirsty = function () {
    return scene(
      p('M48,44 L88,44 L80,96 L56,96 Z', '#dbeafe', 'stroke="#bfdbfe" stroke-width="2"') +
      c(68, 72, 4, '#94a3b8', 'opacity=".6"') +
      ps('M58,52 C62,60 66,62 70,62 M78,52 C74,60 70,62 66,62', '#e2e8f0', 2) +
      ps('M30,52 C22,56 20,64 26,68', '#f59e0b', 2.6) +
      c(20, 44, 3, '#facc15'),
      { bg: ABG });
  };

  map.tired = function () {
    return scene(
      person(60, 46, { scale: 0.86, shirt: '#64748b', hair: '#3a2f2a', smile: false, arms: false }) +
      ps('M47,44 q6,5 12,0 M61,44 q6,5 12,0', NIGHT, 2.6) +
      ps('M53,60 Q60,58 67,60', '#2f2a3d', 2.4) +
      c(84, 22, 5, '#60a5fa') +      p('M82,28 C82,36 80,40 80,46 C80,53 90,53 90,46 C90,40 88,36 88,28 Z', '#93c5fd') +
      c(100, 30, 4, '#93c5fd', 'opacity=".8"'),
      { bg: ABG });
  };

  map.brave = function () {
    return scene(
      c(88, 60, 26, '#e8862c') + c(80, 42, 8, '#e8862c') + c(96, 42, 8, '#e8862c') +
      c(88, 60, 22, '#f0932f') + e(88, 68, 12, 9, '#fbe3c0') + p('M85,64 L91,64 L88,68 Z', '#8a4b20') +
      c(81, 56, 2.2, NIGHT) + c(95, 56, 2.2, NIGHT) +
      c(26, 42, 3, '#fbbf24') + c(34, 30, 2.4, '#fbbf24') +
      person(30, 54, { scale: 0.66, shirt: '#dc2626', hair: '#3a2f2a', smile: true, arms: false }),
      { bg: ABG });
  };

  map.funny = function () {
    return scene(
      p('M30,34 C30,24 90,24 90,34 C90,38 68,38 60,36 C52,38 30,38 30,34 Z', '#7c3aed') +
      c(60, 32, 5, '#7c3aed') + c(44, 28, 4, '#fbbf24') + c(78, 28, 4, '#fbbf24') +
      person(60, 52, { scale: 0.84, shirt: '#7c3aed', hair: '#3a2f2a', smile: false, arms: false }) +
      ps('M46,50 q6,-8 12,0 M62,50 q6,-8 12,0', NIGHT, 2.8) +
      p('M44,60 C48,80 72,80 76,60 Z', '#7a2c2c') + p('M50,70 C56,74 64,74 70,70 Z', '#e8706a') +
      spark(24, 40, 6, '#fcd34d') + spark(98, 44, 5, '#fde68a'),
      { bg: ABG });
  };

  map.serious = function () {
    return scene(
      person(60, 46, { scale: 0.86, shirt: '#334155', hair: '#3a2f2a', smile: false, arms: false }) +
      ln(46, 48, 56, 48, NIGHT, 2.8) + ln(64, 48, 74, 48, NIGHT, 2.8) +
      ps('M52,62 L68,62', '#2f2a3d', 2.6) +
      rc(38, 22, 10, 22, '#4f46e5', 3, 'transform="rotate(-12 43 33)"') +
      rc(72, 22, 10, 22, '#4f46e5', 3, 'transform="rotate(12 77 33)"') +
      ln(48, 34, 72, 34, '#4f46e5', 2.6),
      { bg: ABG });
  };

  map.kind = function () {
    return scene(
      heartTop(60, 30) +
      p('M30,70 C30,58 46,56 54,64 L54,88 C44,92 30,88 30,70 Z', SKIN) +
      p('M90,70 C90,58 74,56 66,64 L66,88 C76,92 90,88 90,70 Z', SKIN) +
      ps('M60,42 L60,54', '#e0453f', 2.4) +
      c(60, 50, 4, '#e0453f'),
      { bg: ABG });
  };

  map.polite = function () {
    return scene(
      person(56, 48, { scale: 0.84, shirt: '#0f172a', hair: '#3a2f2a', smile: true, arms: false }) +
      rc(30, 56, 22, 18, '#334155', 3) + c(41, 65, 2, '#e2e8f0') +
      ps('M44,64 C52,68 58,70 64,70', SKIN, 5) + c(65, 70, 3.4, SKIN) +
      ps('M56,30 C56,20 50,18 46,20', '#3a2f2a', 3) +
      spark(84, 40, 6, '#fcd34d') + spark(96, 56, 4.4, '#fde68a'),
      { bg: ABG });
  };

  map.expensive = function () {
    return scene(
      p('M40,20 L80,20 L92,52 L28,52 Z', '#dc2626') + c(60, 36, 7, '#fdfdff') +
      txt(60, 78, '$', 26, '#b91c1c') + txt(60, 98, '', 12, '#b91c1c') +
      ps('M28,52 C18,52 18,66 28,66', '#b91c1c', 3),
      { bg: ABG });
  };

  map.cheap = function () {
    return scene(
      p('M52,44 L80,44 L88,68 L44,68 Z', '#22c55e') + c(66, 56, 5, '#fdfdff') +
      txt(66, 88, '$', 16, '#16a34a') +
      c(34, 88, 7, '#fbbf24') + c(22, 92, 6, '#fcd34d') + c(44, 94, 5, '#fbbf24') +
      check(96, 60, 20, '#22c55e', 5),
      { bg: ABG });
  };

  map.delicious = function () {
    return scene(
      e(60, 76, 40, 12, '#e2e8f0') + e(60, 70, 40, 12, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      c(60, 62, 20, '#f97316') + p('M60,42 C76,42 82,54 78,62 C74,68 46,68 42,62 C38,54 44,42 60,42 Z', '#fbbf24') +
      ps('M42,44 C32,38 24,40 22,46 M78,44 C88,38 96,40 98,46', '#22c55e', 3) +
      spark(28, 26, 8, '#fcd34d') + spark(92, 22, 6, '#fbbf24') +
      ps('M50,26 C54,20 58,24 56,28 M70,26 C66,20 62,24 64,28', '#f59e0b', 2.4),
      { bg: ABG });
  };

  map.loud = function () {
    return scene(
      p('M14,52 L40,52 L66,28 L66,92 L40,68 L14,68 Z', '#dc2626') +
      rc(66, 48, 10, 24, '#b91c1c', 3) +
      arcArrow(80, 60, 14, -0.9, 0.9, '#f97316', 4) +
      arcArrow(88, 60, 24, -0.9, 0.9, '#fbbf24', 4) +
      arcArrow(96, 60, 34, -0.9, 0.9, '#fcd34d', 4),
      { bg: ABG, ground: false });
  };

  map.sweet = function () {
    return scene(
      c(60, 62, 24, '#f472b6') +
      ps('M60,86 C60,104 44,108 34,104', '#fdfdff', 6) +
      heartTop(60, 52) +
      spark(26, 30, 7, '#fcd34d') + spark(96, 34, 5, '#fde68a'),
      { bg: ABG });
  };

  /* ========================================================= adverbs (26) */

  map.here = function () {
    return scene(
      c(58, 62, 16, '#4f46e5', 'opacity=".25"') + c(58, 62, 7, '#4f46e5') +
      F.pointHand(30, 40, 'right', SKIN) +
      arrow(76, 44, 66, 54, '#4f46e5', 4) +
      tick(100, 60, 22, '#22c55e'),
      { bg: '#eefce8' });
  };

  map.there = function () {
    return scene(
      c(96, 40, 8, '#4f46e5') + c(96, 40, 16, '#4f46e5', 'opacity=".22"') +
      F.pointHand(24, 40, 'right', SKIN) +
      arrow(72, 40, 88, 40, '#4f46e5', 4) +
      tick(34, 84, 22, '#22c55e'),
      { bg: '#eefce8' });
  };

  map.now = function () {
    return scene(
      c(60, 56, 32, '#fcd34d') + c(60, 56, 27, '#fdfdff') +
      ln(60, 56, 60, 38, '#334155', 4) + ln(60, 56, 74, 62, '#e0453f', 3) + c(60, 56, 3.4, '#334155') +
      p('M96,20 L86,44 L94,44 L88,64 L108,36 L98,36 L106,20 Z', '#f59e0b') +
      c(24, 40, 4, '#4a9e4a'),
      { bg: '#eefce8' });
  };

  map.today = function () {
    return scene(
      rc(24, 20, 72, 84, '#fdfdff', 6, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(24, 20, 72, 20, '#f97316', 6) + rc(24, 32, 72, 8, '#f97316', 0) +
      c(38, 24, 3, '#e2e8f0') + c(60, 24, 3, '#e2e8f0') + c(82, 24, 3, '#e2e8f0') +
      c(60, 62, 22, '#fecaca') + c(60, 62, 17, '#ef4444') + c(60, 62, 4, '#ffffff') +
      c(96, 30, 11, '#fbbf24'),
      { bg: '#eefce8' });
  };

  map.tomorrow = function () {
    return scene(
      rc(24, 20, 72, 84, '#fdfdff', 6, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(24, 20, 72, 20, '#0ea5e9', 6) + rc(24, 32, 72, 8, '#0ea5e9', 0) +
      c(38, 24, 3, '#bae6fd') + c(60, 24, 3, '#bae6fd') + c(82, 24, 3, '#bae6fd') +
      c(78, 62, 17, '#bae6fd') + arcArrow(78, 62, 10, -1.2, 1.2, '#0284c7', 2.6) +
      arrow(30, 62, 48, 62, '#0284c7', 3.4) +
      c(96, 34, 12, '#fbbf24'),
      { bg: '#eefce8' });
  };

  map.yesterday = function () {
    return scene(
      rc(24, 20, 72, 84, '#fdfdff', 6, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(24, 20, 72, 20, '#64748b', 6) + rc(24, 32, 72, 8, '#64748b', 0) +
      c(38, 24, 3, '#cbd5e1') + c(60, 24, 3, '#cbd5e1') + c(82, 24, 3, '#cbd5e1') +
      c(42, 62, 17, '#cbd5e1') + c(60, 62, 17, '#e2e8f0') + c(78, 62, 17, '#cbd5e1') +
      arrow(56, 62, 76, 62, '#64748b', 3.4) +
      c(96, 30, 12, '#cbd5e1'),
      { bg: '#eefce8' });
  };

  map.always = function () {
    return scene(
      arcArrow(60, 60, 30, -2.3, 2.3, '#22c55e', 6) +
      tick(60, 60, 22, '#16a34a'),
      { bg: '#eefce8', ground: false });
  };

  map.never = function () {
    return scene(
      arcArrow(60, 60, 30, -2.3, 2.3, '#94a3b8', 6) +
      cross(60, 60, 66, '#dc2626', 7),
      { bg: '#eefce8', ground: false });
  };

  map.often = function () {
    return scene(
      tick(22, 62, 20, '#22c55e') + tick(50, 62, 20, '#22c55e') + tick(78, 62, 20, '#22c55e') +
      ps('M96,40 L108,26 M100,26 L108,26 L108,34', '#16a34a', 3),
      { bg: '#eefce8', ground: false });
  };

  map.sometimes = function () {
    return scene(
      tick(26, 62, 20, '#22c55e') + cross(78, 62, 18, '#dc2626', 5) +
      ps('M52,62 L68,62', '#cbd5e1', 3),
      { bg: '#eefce8', ground: false });
  };

  map.early = function () {
    return scene(
      c(36, 80, 16, '#fbbf24') +
      p('M0,92 L120,92 L120,110 L0,110 Z', '#86efac') +
      c(92, 44, 20, '#fdfdff', 'stroke="#cbd5e1" stroke-width="3"') +
      ln(92, 44, 92, 30, '#334155', 2.6) + ln(92, 44, 100, 48, '#e0453f', 2.4) +
      arcArrow(36, 66, 26, -1.5, 0.2, '#f59e0b', 3),
      { bg: '#eefce8' });
  };

  map.late = function () {
    return scene(
      c(92, 26, 14, '#cbd5e1') + c(90, 26, 11, '#f1f5f9') + c(102, 30, 3, '#e2e8f0') +
      p('M0,92 L120,92 L120,110 L0,110 Z', '#1e293b') +
      c(34, 66, 20, '#fdfdff', 'stroke="#94a3b8" stroke-width="3"') +
      ln(34, 66, 34, 76, '#334155', 2.6) + ln(34, 66, 44, 62, '#e0453f', 2.4) +
      c(60, 30, 3, '#fde68a') + c(76, 22, 2.4, '#fde68a') + c(46, 20, 2, '#fde68a'),
      { bg: '#eefce8' });
  };

  map.slowly = function () {
    return scene(
      c(80, 62, 20, '#e08a3c') +
      ps('M80,62 C68,62 66,50 76,48 C84,46 88,54 82,58 C77,61 72,56 75,53', '#a45a15', 3) +
      p('M14,86 C28,74 52,74 72,80 C84,84 96,82 92,77 C88,73 82,75 80,80 C74,88 52,90 38,90 Z', '#f5d6a0') +
      ps('M20,80 C16,68 20,62 25,62', '#f5d6a0', 4) + c(25, 61, 3, SKIN) +
      arrow(8, 40, 8, 24, '#94a3b8', 3) + ps('M8,40 C20,44 26,52 30,60', '#94a3b8', 3),
      { bg: '#eefce8' });
  };

  map.well = function () {
    return scene(
      rc(44, 44, 22, 40, SKIN, 10) +
      rc(48, 20, 14, 28, SKIN, 7) +
      p('M48,20 C44,10 40,14 42,20 Z', SKIN) + p('M62,20 C66,10 70,14 68,20 Z', SKIN) +
      spark(24, 32, 8, '#22c55e') + spark(96, 40, 6, '#16a34a') + spark(88, 20, 5, '#4ade80'),
      { bg: '#eefce8' });
  };

  map.badly = function () {
    return scene(
      rc(44, 44, 22, 40, SKIN, 10) +
      rc(48, 20, 14, 28, SKIN, 7) +
      p('M48,20 C44,10 40,14 42,20 Z', SKIN) + p('M62,20 C66,10 70,14 68,20 Z', SKIN) +
      cross(94, 32, 22, '#dc2626', 5) +
      spark(24, 32, 7, '#94a3b8', '#cbd5e1'),
      { bg: '#eefce8' });
  };

  map.together = function () {
    return scene(
      person(40, 46, { scale: 0.82, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      person(84, 46, { scale: 0.82, shirt: '#e0457f', hair: '#3f2f28', smile: true, arms: false }) +
      ps('M52,58 C58,64 62,64 64,64', '#0d9488', 5) +
      ps('M72,58 C66,64 62,64 60,64', '#e0457f', 5) +
      heartTop(62, 30),
      { bg: '#eefce8' });
  };

  map.alone = function () {
    return scene(
      person(60, 46, { scale: 0.86, shirt: '#64748b', hair: '#3a2f2a', smile: true, arms: false }) +
      c(18, 40, 3, '#cbd5e1') + c(102, 40, 3, '#cbd5e1') +
      c(24, 88, 3, '#cbd5e1') + c(96, 88, 3, '#cbd5e1') +
      ps('M20,60 C30,64 34,72 32,80 M100,60 C90,64 86,72 88,80', '#e2e8f0', 2.6),
      { bg: '#eefce8' });
  };

  map.very = function () {
    return scene(
      c(20, 90, 4, '#4f46e5') + c(38, 82, 5, '#6366f1') + c(56, 72, 6, '#818cf8') + c(74, 58, 7, '#a5b4fc') +
      c(94, 38, 9, '#4f46e5') +
      arrow(60, 22, 60, 4, '#4f46e5', 4),
      { bg: '#eefce8' });
  };

  map.enough = function () {
    return scene(
      p('M34,30 L86,30 L78,96 L42,96 Z', '#dbeafe', 'stroke="#bfdbfe" stroke-width="2"') +
      p('M37,40 L83,40 L80,92 L40,92 Z', '#5ba8f5') +
      check(92, 40, 24, '#22c55e', 5) +
      c(46, 84, 3, '#ffffff', 'opacity=".6"') + c(58, 76, 2.4, '#ffffff', 'opacity=".5"'),
      { bg: '#eefce8' });
  };

  map.almost = function () {
    return scene(
      c(60, 60, 34, '#e2e8f0') +
      p('M60,26 A34,34 0 1 1 30,81 Z', '#f59e0b') +
      c(60, 60, 4, '#fdfdff') +
      c(92, 28, 5, '#fcd34d'),
      { bg: '#eefce8', ground: false });
  };

  map.only = function () {
    return scene(
      c(60, 58, 20, '#4f46e5') + c(60, 58, 13, '#6366f1') +
      c(24, 34, 3, '#cbd5e1') + c(96, 34, 3, '#cbd5e1') + c(20, 88, 3, '#cbd5e1') + c(100, 88, 3, '#cbd5e1') +
      tick(60, 100, 22, '#22c55e'),
      { bg: '#eefce8', ground: false });
  };

  map.also = function () {
    return scene(
      c(26, 58, 18, '#0ea5e9') + c(94, 58, 18, '#e0457f') +
      txt(60, 66, '+', 20, '#64748b') +
      c(60, 34, 3, '#cbd5e1'),
      { bg: '#eefce8', ground: false });
  };

  map.again = function () {
    return scene(
      c(60, 58, 20, '#f97316') +
      arcArrow(60, 58, 38, -0.4, 3.4, '#4f46e5', 4) +
      pl([98, 22, 110, 20, 106, 32], '#4f46e5'),
      { bg: '#eefce8', ground: false });
  };

  map.maybe = function () {
    return scene(
      bubble(60, 44, 62, 48, '#fdfdff') + qm(60, 46, 26, '#7c3aed') +
      c(60, 88, 9, '#fbbf24') + c(78, 94, 7, '#fcd34d') + c(42, 94, 6, '#f59e0b') +
      c(24, 26, 3, '#cbd5e1') + c(98, 30, 3, '#cbd5e1'),
      { bg: '#eefce8' });
  };

  map.suddenly = function () {
    return scene(
      p('M64,14 L36,60 L54,60 L44,102 L86,54 L66,54 L80,14 Z', '#f59e0b') +
      c(24, 34, 4, '#fbbf24', 'opacity=".8"') + c(96, 26, 3, '#fbbf24', 'opacity=".7"') +
      c(20, 84, 3, '#fcd34d') + c(100, 78, 3, '#fcd34d'),
      { bg: '#eefce8', ground: false });
  };

  map.outside = function () {
    return scene(
      p('M14,60 L60,26 L106,60 Z', '#e0453f') +
      rc(26, 60, 68, 42, '#f6d8b0', 2) +
      rc(50, 76, 18, 26, '#8a5a33', 2) +
      c(96, 32, 11, '#fbbf24') +
      p('M0,102 L120,102 L120,112 L0,112 Z', '#86efac') +
      person(28, 66, { scale: 0.52, shirt: '#4f46e5', hair: '#3a2f2a', arms: false, smile: true }) +
      c(14, 50, 3, '#4a9e4a') + c(112, 84, 3, '#4a9e4a'),
      { bg: '#eefce8' });
  };

  /* ========================================================= pronouns (26) */

  var PB = '#eef2ff';

  function pointSelf(x, y, o) {
    return scene(
      person(x, y, o) +
      ps('M' + (x - 6) + ',' + (y + 20) + ' C' + (x - 14) + ',' + (y + 24) + ' ' + (x - 16) + ',' + (y + 16) + ' ' + (x - 10) + ',' + (y + 12), SKIN, 5.4) +
      c(x - 10, y + 12, 3.6, SKIN),
      { bg: PB });
  }

  map.i = function () {
    return pointSelf(64, 48, { scale: 1, shirt: '#4f46e5', hair: '#3a2f2a', smile: true, arms: false });
  };

  map.you = function () {
    return scene(
      person(50, 48, { scale: 1, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      F.pointHand(64, 30, 'down', SKIN) +
      ps('M56,50 C64,46 70,44 76,42', SKIN, 5),
      { bg: PB });
  };

  map.he = function () {
    return scene(
      person(84, 48, { scale: 0.86, shirt: '#2563eb', hair: '#2f2a24', smile: true, arms: false }) +
      F.pointHand(34, 34, 'right', SKIN) +
      ps('M40,54 C50,50 56,46 62,42', SKIN, 5),
      { bg: PB });
  };

  map.she = function () {
    return scene(
      person(84, 48, { scale: 0.86, shirt: '#e0457f', longHair: true, hair: '#6b4423', smile: true, arms: false }) +
      F.pointHand(34, 34, 'right', SKIN) +
      ps('M40,54 C50,50 56,46 62,42', SKIN, 5),
      { bg: PB });
  };

  map.it = function () {
    return scene(
      person(34, 56, { scale: 0.68, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      c(88, 66, 22, '#f97316') + c(80, 58, 4, '#ffffff', 'opacity=".5"') +
      ps('M70,74 C76,70 80,66 84,64', SKIN, 4.4),
      { bg: PB });
  };

  map.we = function () {
    return scene(
      person(38, 48, { scale: 0.86, shirt: '#4f46e5', hair: '#3a2f2a', smile: true, arms: false }) +
      person(84, 48, { scale: 0.86, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      ps('M50,58 C56,64 62,64 64,64', '#4f46e5', 5) +
      ps('M72,58 C66,64 62,64 60,64', '#0d9488', 5),
      { bg: PB });
  };

  map.youall = function () {
    return scene(
      person(26, 54, { scale: 0.7, shirt: '#4f46e5', hair: '#3a2f2a', smile: true }) +
      person(60, 46, { scale: 0.82, shirt: '#0d9488', hair: '#3a2f2a', smile: true }) +
      person(94, 54, { scale: 0.7, shirt: '#e0457f', hair: '#3f2f28', smile: true }) +
      c(60, 22, 5, '#4f46e5'),
      { bg: PB });
  };

  map.they = function () {
    return scene(
      person(24, 56, { scale: 0.66, shirt: '#2563eb', hair: '#2f2a24', smile: true }) +
      person(60, 48, { scale: 0.78, shirt: '#e0457f', longHair: true, hair: '#6b4423', smile: true }) +
      person(96, 56, { scale: 0.66, shirt: '#16a34a', hair: '#3a2f2a', smile: true }) +
      ps('M8,34 C8,20 26,20 26,30 M94,30 C94,20 112,20 112,34', '#64748b', 3),
      { bg: PB });
  };

  map.me = function () {
    return scene(
      person(40, 48, { scale: 0.86, shirt: '#4f46e5', hair: '#3a2f2a', smile: true, arms: false }) +
      F.pointHand(66, 36, 'left', SKIN) +
      heartTop(96, 42) +
      ps('M56,56 C64,52 68,48 70,44', SKIN, 5),
      { bg: PB });
  };

  map.him = function () {
    return scene(
      person(76, 48, { scale: 0.86, shirt: '#2563eb', hair: '#2f2a24', smile: true, arms: false }) +
      F.pointHand(48, 40, 'right', SKIN) +
      ps('M50,58 C60,54 66,50 70,46', SKIN, 5),
      { bg: PB });
  };

  map.her = function () {
    return scene(
      person(78, 48, { scale: 0.86, shirt: '#e0457f', longHair: true, hair: '#6b4423', smile: true, arms: false }) +
      heartTop(30, 42) +
      ps('M50,58 C60,54 66,50 70,46', SKIN, 5),
      { bg: PB });
  };

  map.us = function () {
    return scene(
      person(36, 50, { scale: 0.78, shirt: '#4f46e5', hair: '#3a2f2a', smile: true, arms: false }) +
      person(84, 50, { scale: 0.78, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      F.pointHand(38, 22, 'down', SKIN) +
      ps('M60,26 L60,40', '#64748b', 3),
      { bg: PB });
  };

  map.them = function () {
    return scene(
      person(22, 58, { scale: 0.6, shirt: '#2563eb', hair: '#2f2a24', smile: true }) +
      person(60, 48, { scale: 0.74, shirt: '#e0457f', hair: '#3f2f28', smile: true }) +
      person(98, 58, { scale: 0.6, shirt: '#16a34a', hair: '#3a2f2a', smile: true }) +
      ps('M14,26 C14,16 106,16 106,26', '#64748b', 3) +
      arrow(60, 16, 60, 4, '#64748b', 3.4),
      { bg: PB });
  };

  map.my = function () {
    return scene(
      p('M30,54 C20,50 14,60 20,66 L46,66 C52,60 46,50 36,54 Z', SKIN) +
      c(58, 60, 16, '#e0453f') +
      ps('M34,46 C40,40 48,42 52,50', SKIN, 5) +
      heartTop(84, 34),
      { bg: PB });
  };

  map.your = function () {
    return scene(
      p('M84,52 C94,48 100,58 94,64 L66,64 C60,58 66,48 76,52 Z', SKIN) +
      c(48, 60, 16, '#0ea5e9') +
      arrow(36, 60, 26, 60, '#64748b', 3.4),
      { bg: PB });
  };

  map.his = function () {
    return scene(
      person(84, 48, { scale: 0.66, shirt: '#2563eb', hair: '#2f2a24', smile: true, arms: false }) +
      p('M18,58 C8,54 2,64 8,70 L40,70 C46,64 40,54 30,58 Z', SKIN) +
      c(52, 64, 13, '#f97316') +
      ps('M60,64 C68,64 72,60 74,56', SKIN, 4.4),
      { bg: PB });
  };

  map.our = function () {
    return scene(
      person(26, 52, { scale: 0.68, shirt: '#4f46e5', hair: '#3a2f2a', smile: true, arms: false }) +
      person(94, 52, { scale: 0.68, shirt: '#0d9488', hair: '#3a2f2a', smile: true, arms: false }) +
      c(60, 72, 18, '#22c55e') +
      ps('M46,64 C52,68 56,70 58,70 M74,64 C68,68 64,70 62,70', SKIN, 4.4),
      { bg: PB });
  };

  map.their = function () {
    return scene(
      person(20, 56, { scale: 0.6, shirt: '#2563eb', hair: '#2f2a24', smile: true }) +
      person(60, 48, { scale: 0.7, shirt: '#e0457f', hair: '#3f2f28', smile: true }) +
      person(100, 56, { scale: 0.6, shirt: '#16a34a', hair: '#3a2f2a', smile: true }) +
      c(60, 84, 15, '#f59e0b') +
      ps('M10,26 C10,18 110,18 110,26', '#64748b', 2.6),
      { bg: PB });
  };

  map.this = function () {
    return scene(
      F.pointHand(30, 30, 'right', SKIN) +
      c(88, 66, 26, '#4f46e5') + c(80, 58, 5, '#ffffff', 'opacity=".45"') +
      c(88, 66, 30, '#4f46e5', 'opacity=".18"'),
      { bg: PB });
  };

  map.that = function () {
    return scene(
      c(30, 66, 9, '#64748b') + c(30, 66, 16, '#64748b', 'opacity=".22"') +
      F.pointHand(20, 26, 'right', SKIN) +
      arrow(58, 30, 88, 44, '#64748b', 3.4) +
      c(96, 48, 5, '#64748b'),
      { bg: PB });
  };

  map.these = function () {
    return scene(
      F.pointHand(26, 24, 'right', SKIN) +
      c(64, 56, 16, '#e0453f') + c(94, 60, 14, '#0ea5e9') + c(79, 82, 12, '#f59e0b') +
      c(64, 56, 22, '#e0453f', 'opacity=".16"') + c(94, 60, 20, '#0ea5e9', 'opacity=".16"'),
      { bg: PB });
  };

  map.those = function () {
    return scene(
      c(16, 44, 6, '#64748b') +
      F.pointHand(20, 22, 'right', SKIN) +
      arrow(52, 26, 78, 40, '#64748b', 3) +
      c(90, 46, 9, '#e0453f') + c(108, 52, 7, '#0ea5e9') + c(98, 64, 6, '#f59e0b') +
      ps('M78,72 L108,72', '#94a3b8', 2.4),
      { bg: PB });
  };

  map.who = function () {
    return scene(
      person(52, 56, { scale: 0.86, shirt: '#4f46e5', hair: '#3a2f2a', smile: true, arms: false }) +
      qm(96, 34, 30, '#4f46e5'),
      { bg: PB });
  };

  map.what = function () {
    return scene(
      c(46, 74, 22, '#94a3b8') + c(38, 66, 4, '#ffffff', 'opacity=".4"') +
      qm(90, 40, 30, '#4f46e5'),
      { bg: PB });
  };

  map.where = function () {
    return scene(
      p('M60,14 C44,14 34,28 34,44 C34,64 60,94 60,94 C60,94 86,64 86,44 C86,28 76,14 60,14 Z', '#ef4444') +
      c(60, 42, 12, '#fdfdff') +
      qm(100, 26, 20, '#4f46e5'),
      { bg: PB });
  };

  map.which = function () {
    return scene(
      rc(16, 44, 34, 40, '#e0453f', 4) + rc(70, 44, 34, 40, '#0ea5e9', 4) +
      qm(60, 28, 26, '#4f46e5') +
      ps('M50,44 C46,50 46,56 50,62 M70,44 C74,50 74,56 70,62', '#cbd5e1', 2.6),
      { bg: PB });
  };

  /* ===================================================== prepositions (16) */

  var RB = '#ecfdf5';

  map.in = function () {
    return scene(
      p('M26,44 L94,44 L94,96 L26,96 Z', 'none', 'stroke="#64748b" stroke-width="3"') +
      c(60, 74, 15, '#f97316') +
      arrow(60, 16, 60, 48, '#22c55e', 4) +
      c(60, 68, 5, '#ffffff', 'opacity=".4"'),
      { bg: RB });
  };

  map.on = function () {
    return scene(
      rc(18, 76, 84, 10, '#8a5a33', 3) + rc(26, 86, 8, 18, '#6b4423', 2) + rc(86, 86, 8, 18, '#6b4423', 2) +
      c(60, 62, 16, '#e0457f') +
      arrow(60, 20, 60, 38, '#22c55e', 4) +
      c(54, 58, 4, '#ffffff', 'opacity=".4"'),
      { bg: RB });
  };

  map.under = function () {
    return scene(
      rc(18, 26, 84, 10, '#8a5a33', 3) + rc(26, 36, 8, 14, '#6b4423', 2) + rc(86, 36, 8, 14, '#6b4423', 2) +
      c(60, 78, 16, '#e0457f') +
      arrow(60, 96, 60, 66, '#dc2626', 4) +
      c(54, 74, 4, '#ffffff', 'opacity=".4"'),
      { bg: RB });
  };

  map.between = function () {
    return scene(
      rc(12, 40, 30, 60, '#94a3b8', 5) + rc(78, 40, 30, 60, '#64748b', 5) +
      c(60, 70, 17, '#f59e0b') +
      arrow(46, 70, 52, 70, '#22c55e', 3) + arrow(74, 70, 68, 70, '#22c55e', 3) +
      c(54, 65, 4, '#ffffff', 'opacity=".45"'),
      { bg: RB });
  };

  map.with = function () {
    return scene(
      c(32, 58, 18, '#0ea5e9') + c(88, 58, 18, '#f59e0b') +
      txt(60, 66, '+', 20, '#64748b') +
      ps('M32,86 C46,98 74,98 88,86', '#22c55e', 4) +
      c(26, 50, 4, '#ffffff', 'opacity=".4"') + c(82, 50, 4, '#ffffff', 'opacity=".4"'),
      { bg: RB });
  };

  map.without = function () {
    return scene(
      c(60, 60, 24, '#94a3b8') + c(52, 52, 5, '#ffffff', 'opacity=".4"') +
      cross(60, 60, 74, '#dc2626', 7),
      { bg: RB });
  };

  map.for = function () {
    return scene(
      circleTarget(88, 60) +
      arrow(16, 60, 56, 60, '#22c55e', 5),
      { bg: RB });
  };

  function circleTarget(x, y) {
    return c(x, y, 24, '#f97316') + c(x, y, 14, '#fdfdff') + c(x, y, 6, '#f97316');
  }

  map.from = function () {
    return scene(
      circleTarget(30, 60) +
      arrow(58, 60, 102, 60, '#64748b', 5) +
      ps('M16,44 L28,44 M16,76 L28,76', '#f97316', 3),
      { bg: RB });
  };

  map.to = function () {
    return scene(
      c(20, 60, 8, '#94a3b8') +
      arrow(30, 60, 70, 60, '#22c55e', 5) +
      circleTarget(92, 60),
      { bg: RB });
  };

  map.at = function () {
    return scene(
      c(60, 66, 20, '#f97316') +
      arrow(60, 16, 60, 38, '#22c55e', 5) +
      rc(38, 66, 44, 5, '#22c55e', 2) +
      tick(60, 92, 20, '#64748b'),
      { bg: RB });
  };

  map.about = function () {
    return scene(
      c(60, 60, 20, '#8b5cf6') + c(52, 52, 5, '#ffffff', 'opacity=".4"') +
      arcArrow(60, 60, 36, -0.6, 4.2, '#7c3aed', 4),
      { bg: RB, ground: false });
  };

  map.by = function () {
    return scene(
      c(84, 60, 22, '#f59e0b') +
      p('M22,74 C16,66 22,58 30,62 L52,68 C58,72 54,80 48,78 Z', SKIN) +
      ps('M54,70 C60,70 62,66 62,62', SKIN, 4) +
      c(64, 90, 3, '#cbd5e1'),
      { bg: RB });
  };

  map.after = function () {
    return scene(
      c(30, 60, 16, '#94a3b8') + c(90, 60, 16, '#22c55e') +
      arrow(50, 60, 70, 60, '#22c55e', 4) +
      ps('M6,30 L6,90', '#cbd5e1', 3) +
      ps('M114,30 L114,90', '#cbd5e1', 3) +
      c(30, 60, 5, '#ffffff', 'opacity=".5"') + c(90, 60, 5, '#ffffff', 'opacity=".5"'),
      { bg: RB, ground: false });
  };

  map.before = function () {
    return scene(
      c(90, 60, 16, '#22c55e') + c(30, 60, 16, '#94a3b8') +
      arrow(70, 60, 50, 60, '#22c55e', 4) +
      ps('M6,30 L6,90', '#cbd5e1', 3) +
      ps('M114,30 L114,90', '#cbd5e1', 3) +
      c(30, 60, 5, '#ffffff', 'opacity=".5"'),
      { bg: RB, ground: false });
  };

  map.near = function () {
    return scene(
      c(44, 62, 20, '#0ea5e9') + c(78, 62, 20, '#f59e0b') +
      ln(62, 62, 58, 62, '#64748b', 3) +
      ps('M56,50 L64,50 M56,74 L64,74', '#64748b', 2.6) +
      c(38, 56, 4, '#ffffff', 'opacity=".4"'),
      { bg: RB, ground: false });
  };

  map.through = function () {
    return scene(
      rc(20, 26, 14, 70, '#94a3b8', 3) + rc(86, 26, 14, 70, '#94a3b8', 3) +
      c(60, 60, 15, '#f97316') +
      arrow(4, 60, 44, 60, '#22c55e', 4) +
      arrow(76, 60, 116, 60, '#22c55e', 4) +
      c(54, 55, 4, '#ffffff', 'opacity=".4"'),
      { bg: RB, ground: false });
  };

  /* ====================================================== conjunctions (11) */

  var CB = '#fef2f2';

  map.and = function () {
    return scene(
      c(34, 60, 20, '#0ea5e9') + c(86, 60, 20, '#e0457f') +
      ln(56, 60, 64, 60, '#64748b', 5) +
      c(24, 50, 4, '#ffffff', 'opacity=".4"'),
      { bg: CB, ground: false });
  };

  map.or = function () {
    return scene(
      c(34, 60, 20, '#0ea5e9') + c(86, 60, 20, '#e0457f') +
      ps('M60,60 L60,30', '#64748b', 4) +
      c(60, 26, 5, '#64748b') + c(60, 56, 4, '#64748b') +
      c(24, 50, 4, '#ffffff', 'opacity=".4"'),
      { bg: CB, ground: false });
  };

  map.but = function () {
    return scene(
      rc(20, 34, 12, 52, '#94a3b8', 3) +
      c(44, 60, 18, '#0ea5e9') +
      arrow(74, 60, 108, 60, '#dc2626', 4) +
      cross(96, 60, 22, '#dc2626', 4),
      { bg: CB, ground: false });
  };

  map.because = function () {
    return scene(
      bubble(34, 38, 44, 34, '#fdfdff') + qm(34, 40, 20, '#64748b') +
      arrow(58, 44, 76, 58, '#64748b', 3.4) +
      rc(80, 62, 34, 26, '#22c55e', 4) + check(97, 75, 18, '#ffffff', 4),
      { bg: CB, ground: false });
  };

  map.if = function () {
    return scene(
      c(20, 84, 8, '#94a3b8') +
      ps('M24,80 L48,40 L74,80', '#64748b', 4) +
      ps('M48,40 L92,80', '#22c55e', 4) +
      ps('M48,40 L92,80', 'none', 0) +
      ps('M60,58 C72,58 78,64 84,72', '#22c55e', 3, 'stroke-dasharray="5 5"') +
      c(92, 82, 5, '#22c55e'),
      { bg: CB, ground: false });
  };

  map.when = function () {
    return scene(
      c(60, 58, 30, '#fcd34d') + c(60, 58, 25, '#fdfdff') +
      ln(60, 58, 60, 40, '#334155', 4) + ln(60, 58, 74, 64, '#e0453f', 3) + c(60, 58, 3, '#334155') +
      arrow(96, 30, 108, 18, '#dc2626', 3.4) +
      c(24, 30, 5, '#7c3aed') + txt(24, 38, '?', 12, '#7c3aed'),
      { bg: CB, ground: false });
  };

  map.so = function () {
    return scene(
      rc(16, 48, 34, 26, '#94a3b8', 4) +
      arrow(54, 61, 76, 61, '#64748b', 4) +
      rc(80, 44, 30, 34, '#22c55e', 4) + check(95, 61, 18, '#ffffff', 4),
      { bg: CB, ground: false });
  };

  map.while = function () {
    return scene(
      ps('M10,60 L110,60', '#64748b', 5) +
      c(34, 60, 5, '#0d9488') + c(86, 60, 5, '#e0457f') +
      rc(8, 44, 30, 32, '#d1fae5', 4, 'stroke="#0d9488" stroke-width="2"') +
      rc(82, 44, 30, 32, '#fce7f3', 4, 'stroke="#e0457f" stroke-width="2"') +
      arrow(46, 60, 74, 60, '#94a3b8', 3),
      { bg: CB, ground: false });
  };

  map.although = function () {
    return scene(
      c(40, 60, 14, '#94a3b8') +
      c(84, 60, 26, '#f97316') +
      cross(40, 60, 34, '#dc2626', 4),
      { bg: CB, ground: false });
  };

  map.than = function () {
    return scene(
      rc(30, 24, 12, 76, '#22c55e', 3) + rc(70, 54, 12, 46, '#94a3b8', 3) +
      ps('M48,62 L66,62', '#64748b', 4) +
      arrow(48, 52, 60, 52, '#dc2626', 3) +
      c(26, 16, 4, '#22c55e'),
      { bg: CB, ground: false });
  };

  map.as = function () {
    return scene(
      rc(24, 40, 24, 44, '#0ea5e9', 4) + rc(72, 40, 24, 44, '#0ea5e9', 4) +
      ln(52, 62, 68, 62, '#64748b', 4) +
      tick(60, 62, 20, '#22c55e'),
      { bg: CB, ground: false });
  };

  /* =================================================== interjections (11) */

  var IB = '#fff7ed';

  function wave(x, y, color) {
    return rc(x - 12, y - 4, 24, 30, color || SKIN, 10) +
      rc(x - 16, y + 18, 8, 18, color || SKIN, 4) +
      rc(x - 4, y + 20, 7, 16, color || SKIN, 3.5) +
      rc(x + 4, y + 18, 7, 18, color || SKIN, 3.5);
  }

  map.hello = function () {
    return scene(
      wave(34, 54) +
      bubble(86, 44, 52, 40, '#fdfdff') + txt(86, 52, 'Hi!', 15, '#0d9488') +
      arcArrow(34, 40, 24, -2.6, -0.8, '#0d9488', 3),
      { bg: IB });
  };

  map.goodbye = function () {
    return scene(
      wave(34, 54) +
      bubble(88, 40, 52, 38, '#e2e8f0', '#94a3b8') +
      ps('M62,50 C60,44 56,42 52,42', '#94a3b8', 2.2, 'stroke-dasharray="4 4"') +
      ps('M56,20 L44,10 M60,16 L52,4', '#94a3b8', 2.6),
      { bg: IB });
  };

  map['thanks'] = function () {
    return scene(
      heartTop(60, 24) +
      p('M28,68 C20,60 30,50 40,58 L60,76 L80,58 C90,50 100,60 92,68 L60,98 Z', SKIN) +
      spark(28, 30, 7, '#fcd34d') + spark(96, 34, 5, '#fde68a'),
      { bg: IB });
  };

  map.please = function () {
    return scene(
      person(56, 52, { scale: 0.88, shirt: '#0ea5e9', hair: '#3a2f2a', smile: true, arms: false }) +
      ps('M50,64 C50,58 56,54 62,56', SKIN, 5) + c(62, 56, 4, SKIN) +
      bubble(90, 32, 44, 30, '#fdfdff') + tick(90, 32, 16, '#22c55e') +
      spark(30, 30, 6, '#fcd34d'),
      { bg: IB });
  };

  map.yes = function () {
    return scene(
      c(60, 58, 40, '#22c55e') +
      check(60, 58, 46, '#ffffff', 9) +
      arcArrow(60, 58, 52, -2.2, -0.6, '#16a34a', 3),
      { bg: IB, ground: false });
  };

  map.no = function () {
    return scene(
      c(60, 58, 40, '#dc2626') +
      cross(60, 58, 50, '#ffffff', 9) +
      arcArrow(60, 58, 52, -2.2, -0.6, '#b91c1c', 3),
      { bg: IB, ground: false });
  };

  map.sorry = function () {
    return scene(
      person(56, 50, { scale: 0.88, shirt: '#64748b', hair: '#3a2f2a', smile: false, arms: false }) +
      ps('M48,66 C54,72 60,72 66,66', SKIN, 5) +
      e(48, 48, 2.6, 4, NIGHT) + e(66, 48, 2.6, 4, NIGHT) +
      ps('M50,56 Q58,52 66,56', '#2f2a3d', 2.2) +
      bubble(92, 30, 40, 28, '#fdfdff') + txt(92, 37, '...', 15, '#64748b'),
      { bg: IB });
  };

  map.wow = function () {
    return scene(
      bubble(56, 40, 60, 44, '#fdfdff') + txt(56, 48, 'wow!', 15, '#7c3aed') +
      c(30, 70, 18, '#fcd34d') + c(23, 66, 2.6, '#8a6a10') + c(37, 66, 2.6, '#8a6a10') +
      e(30, 82, 7, 6, '#8a6a10') +
      spark(96, 26, 8, '#fbbf24') + spark(14, 30, 5, '#fcd34d') + spark(92, 74, 5, '#fde68a'),
      { bg: IB, ground: false });
  };

  map.ouch = function () {
    return scene(
      person(56, 40, { scale: 0.86, shirt: '#dc2626', hair: '#3a2f2a', smile: false, arms: false }) +
      e(46, 38, 2.6, 4, NIGHT) + e(66, 38, 2.6, 4, NIGHT) +
      ps('M48,52 Q56,46 64,52', '#2f2a3d', 2.4) +
      c(60, 88, 14, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') + c(60, 88, 5, '#fca5a5') +
      ps('M56,74 C52,80 52,84 54,88 M64,74 C68,80 68,84 66,88', SKIN, 5) +
      ps('M88,26 L94,38 M98,22 L100,36 M78,30 L80,42', '#facc15', 3),
      { bg: IB });
  };

  map.oops = function () {
    return scene(
      c(44, 66, 20, '#fcd34d') + c(37, 62, 2.6, NIGHT) + c(51, 62, 2.6, NIGHT) +
      e(44, 78, 7, 5, '#8a6a10') +
      p('M60,24 C60,14 68,10 74,16 C68,12 62,16 60,24 Z', '#38bdf8') +
      p('M60,24 C60,34 56,40 56,46 C56,54 70,54 70,46 C70,40 66,34 60,24 Z', '#7dd3fc') +
      bubble(92, 40, 40, 30, '#fdfdff') + txt(92, 47, 'oops', 12, '#64748b'),
      { bg: IB });
  };

  map.congrats = function () {
    return scene(
      ps('M30,96 L86,20 L98,26 L42,102 Z', '#f97316') +
      c(92, 18, 12, '#fbbf24') + c(90, 14, 5, '#fde68a') +
      rc(24, 88, 26, 10, '#dc2626', 3) +
      spark(20, 40, 7, '#fbbf24') + spark(104, 54, 6, '#fcd34d') + spark(66, 12, 5, '#fbbf24') +
      c(106, 26, 4, '#22c55e') + c(16, 64, 4, '#e0457f') + c(100, 86, 4, '#3b82f6'),
      { bg: IB, ground: false });
  };

  /* ============================================================ numbers (10) */

  var NUM_COLORS = ['#4f46e5', '#0ea5e9', '#0d9488', '#16a34a', '#f59e0b',
                    '#ef4444', '#e0457f', '#8b5cf6', '#0f766e', '#d97706'];

  for (var n = 1; n <= 10; n++) {
    (function (count) {
      map[['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][count - 1]] = function () {
        return scene(dots(count, NUM_COLORS[count - 1]), { bg: '#f0f9ff', ground: false });
      };
    })(n);
  }

  LLC.art.register(map);
})(window);
