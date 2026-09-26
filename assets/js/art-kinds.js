/*!
 * art-kinds.js - The picture engine for the themed vocabulary.
 *
 * Hand-drawing fifteen hundred words one function at a time is not viable, and
 * it is not even the best answer: a learner benefits when related words look
 * related. So a themed word is described by a *recipe* — a short record naming
 * a `kind` and the parameters it draws with — and a kind is a single
 * parameterised renderer.
 *
 *   LLC.art.recipe({ k: 'glass', liquid: '#f97316', fill: 0.7 })
 *   LLC.art.recipe({ k: 'tool', head: 'hammer', handle: '#a16207' })
 *
 * Kinds live in KINDS below; recipes live in assets/js/art-specs-*.js and are
 * registered with `LLC.art.spec(map)`. A word with no recipe still renders
 * through the geometric fallback, and a recipe naming an unknown kind is
 * reported in `LLC.art.failures()` rather than failing silently.
 *
 * Every renderer draws into a 120x120 viewBox and is expected to fill it: a
 * pictogram that leaves half the tile empty reads as a mistake.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var d = LLC.art.d, F = LLC.art.f, person = LLC.art.person;
  var c = d.c, e = d.e, rc = d.rc, p = d.p, ps = d.ps, pl = d.pl, ln = d.ln, txt = d.txt;
  var scene = d.scene;
  var SKIN = LLC.art.colors.SKIN, NIGHT = LLC.art.colors.NIGHT;

  var KINDS = {};

  /** Register a renderer. Kinds are addressed from recipes by `k`. */
  function kind(name, fn) { KINDS[name] = fn; }

  /* ================================================================== *
   * Shared bits
   * ================================================================== */

  /** A soft elliptical shadow so objects sit on something. */
  function shadow(y, rx, opacity) {
    return e(60, y, rx, rx * 0.16, '#0f172a', 'opacity="' + (opacity || 0.09) + '"');
  }

  /** A cylinder: the workhorse for glasses, tins, cans and bottles. */
  function cup(x, top, bottom, topW, botW, fill, edge) {
    return p('M' + (x - topW / 2) + ',' + top + ' L' + (x + topW / 2) + ',' + top +
      ' L' + (x + botW / 2) + ',' + bottom + ' L' + (x - botW / 2) + ',' + bottom + ' Z', fill, edge || 0);
  }

  /** A rectangle with softly rounded corners and an optional outline. */
  function box(x, y, w, h, fill, r, edge) {
    return rc(x, y, w, h, fill, r || 0, edge || 0);
  }

  /** Two tone: a lit face and a shaded one, for anything boxy. */
  function shadedBox(x, y, w, h, light, dark, edge) {
    return box(x, y, w, h, light, 4, edge) + box(x + w * 0.68, y, w * 0.32, h, dark, 4, edge);
  }

  /* ================================================================== *
   * Drinks
   * ================================================================== */

  kind('glass', function (o) {
    var liquid = o.liquid || '#f97316';
    var level = 96 - 46 * (o.fill == null ? 0.68 : o.fill);
    var s = shadow(102, 26);
    s += cup(56, 40, 96, 44, 34, '#e2e8f0', 'opacity=".55"');
    s += p('M34,' + level + ' L78,' + level + ' L73,96 L39,96 Z', liquid);
    s += e(56, level, 22, 3.5, liquid);
    s += e(56, 40, 22, 3.5, '#ffffff', 'opacity=".9"');
    if (o.ice) s += rc(44, 48, 12, 12, '#ffffff', 2, 'opacity=".7" transform="rotate(-12 50 54)"');
    if (o.straw) s += ps('M68,72 L86,28', o.straw || '#e0453f', 4);
    if (o.foam) s += e(56, 42, 22, 5, '#fdf6e8') + c(44, 38, 4, '#fdf6e8') + c(66, 37, 3.4, '#fdf6e8');
    s += rc(34, 84, 5, 14, '#ffffff', 2, 'opacity=".45"');
    return s;
  });

  kind('mugcup', function (o) {
    var liquid = o.liquid || '#4a2c17';
    var s = shadow(102, 28);
    s += ps('M76,56 C92,56 92,84 76,84', o.body || '#fdfdff', 7);
    s += p('M38,48 L76,48 L71,96 L43,96 Z', o.body || '#fdfdff', o.edge || '');
    s += e(57, 48, 19, 5, liquid);
    s += e(57, 48, 15, 3, '#ffffff', 'opacity=".35"');
    if (o.steam) s += ps('M46,26 C50,18 40,14 44,6 M60,24 C64,16 54,12 58,4', '#94a3b8', 2.6);
    return s;
  });

  kind('bottle', function (o) {
    var liquid = o.liquid || '#7c2d12';
    var tall = o.tall == null ? 1 : o.tall;
    var h = 74 * tall;
    var top = 96 - h;
    var s = shadow(102, 26);
    s += rc(52, top, 16, 14, '#e2e8f0', 2, 'opacity=".6"');
    s += p('M40,' + (top + 12) + ' C40,' + (top + 18) + ' ' + (60 - 19) + ',' + (top + 20) + ' ' + (60 - 19) + ',' + (top + 26) +
      ' L' + (60 + 19) + ',' + (top + 26) + ' C' + (60 + 19) + ',' + (top + 20) + ' 80,' + (top + 18) + ' 80,' + (top + 12) +
      ' L80,96 L40,96 Z', liquid);
    s += rc(44, 66, 32, 18, o.label || '#fdf6e8', 2);
    s += rc(41, 30 + (1 - tall) * 20, 38, 9, o.cap || '#1e3a8a', 2);
    s += rc(42, 40, 6, 50, '#ffffff', 3, 'opacity=".28"');
    return s;
  });

  kind('can', function (o) {
    var s = shadow(102, 24);
    s += rc(40, 34, 40, 62, o.body || '#94a3b8', 5);
    s += rc(40, 34, 40, 12, o.lid || '#cbd5e1', 5);
    s += rc(40, 82, 40, 10, o.lid || '#cbd5e1', 3);
    if (o.band) s += box(40, 50, 40, 24, o.band);
    s += e(60, 66, 20, 5, '#ffffff', 'opacity=".2"');
    s += rc(43, 40, 5, 48, '#ffffff', 3, 'opacity=".3"');
    return s;
  });

  kind('wineglass', function (o) {
    var s = shadow(104, 24);
    s += p('M40,26 L80,26 C80,48 70,56 70,66 L50,66 C50,56 40,48 40,26 Z',
      o.liquid ? o.liquid : '#e2e8f0', o.liquid ? 0 : 'opacity=".6"');
    if (o.liquid) s += p('M44,32 L76,32 C76,48 68,54 68,62 L52,62 C52,54 44,48 44,32 Z', o.liquid);
    s += ln(52, 66, 49, 88, '#cbd5e1', 3.4) + ln(68, 66, 71, 88, '#cbd5e1', 3.4);
    s += e(60, 90, 26, 6, '#e2e8f0') + e(60, 87, 21, 5, '#cbd5e1');
    if (o.sparkle) s += F.spark(38, 20, 5, '#fbbf24') + F.spark(84, 24, 4, '#fcd34d');
    return s;
  });

  kind('beermug', function (o) {
    var s = shadow(102, 30);
    s += ps('M40,50 C26,50 26,86 40,86', o.glass || '#f8fafc', 5);
    s += box(38, 44, 44, 52, o.glass || '#f8fafc', 4, 'stroke="#cbd5e1" stroke-width="2"');
    s += box(42, 58, 36, 36, o.beer || '#f59e0b');
    s += e(60, 58, 18, 4, '#fdf6e8');
    s += c(50, 70, 3, '#fdf6e8', 'opacity=".7"') + c(58, 80, 2.4, '#fdf6e8', 'opacity=".6"');
    return s;
  });

  kind('cupsmall', function (o) {
    var s = shadow(102, 24);
    s += ps('M74,52 C88,52 88,78 74,78', o.body || '#fdfdff', 6);
    s += p('M40,50 L76,50 L71,96 L45,96 Z', o.body || '#fdfdff', o.edge || '');
    s += e(58, 50, 18, 5, o.liquid || '#6b4423');
    s += e(58, 50, 14, 3, '#ffffff', 'opacity=".3"');
    if (o.steam) s += ps('M48,28 C52,20 42,16 46,8 M64,26 C68,18 58,14 62,6', '#94a3b8', 2.6);
    return s;
  });

  /**
   * Coffee, told apart by silhouette rather than by colour: a demitasse, a
   * foam-domed cappuccino, a tall layered latte and a black cup with a saucer
   * all look like "a white cup" if you only change the liquid.
   */
  kind('coffeecup', function (o) {
    var style = o.style || 'cup';
    var s = shadow(102, 30);
    var steam = o.steam === 0 ? '' :
      ps('M46,28 C50,20 40,16 44,8 M60,26 C64,18 54,14 58,6 M74,28 C78,20 68,16 72,8', '#94a3b8', 2.4);

    if (style === 'demitasse') {
      /* espresso: tiny cup, thick dark crema, a saucer under it */
      s += e(60, 100, 26, 5, '#cbd5e1');
      s += ps('M68,60 C80,60 80,80 68,80', '#fdfdff', 5);
      s += p('M44,58 L72,58 L68,88 L48,88 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"');
      s += e(58, 58, 14, 4, '#2b1a0c');
      s += e(58, 58, 10, 2.4, '#a9714b');
      return s + steam;
    }
    if (style === 'cappuccino') {
      /* a dome of foam sitting proud of the rim */
      s += ps('M80,54 C96,54 96,84 80,84', '#fdfdff', 6);
      s += p('M36,56 L80,56 L74,96 L42,96 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"');
      s += e(58, 58, 22, 5, '#fdf6e8');
      s += p('M36,58 C36,40 80,40 80,58 Z', '#fdf6e8', 'stroke="#cbd5e1" stroke-width="2"');
      s += c(52, 50, 3, '#d6c9a8') + c(64, 48, 2.4, '#d6c9a8');
      s += e(58, 72, 9, 7, '#a9714b');
      return s + steam;
    }
    if (style === 'latte') {
      /* a tall glass, milk graded into espresso */
      s += cup(56, 30, 98, 42, 36, '#e2e8f0', 'opacity=".6"');
      s += p('M36,62 L76,62 L73,98 L39,98 Z', '#f5ead7');
      s += p('M37,76 L75,76 L73,98 L39,98 Z', '#a9714b');
      s += e(56, 76, 19, 3, '#8a5a34');
      s += e(56, 30, 21, 3.5, '#ffffff', 'opacity=".9"');
      s += e(56, 62, 20, 3, '#fdf6e8');
      return s + steam;
    }
    if (style === 'saucer') {
      s += e(60, 100, 30, 6, '#cbd5e1');
      s += ps('M76,60 C92,60 92,86 76,86', '#fdfdff', 6);
      s += p('M40,52 L76,52 L71,94 L45,94 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"');
      s += e(58, 52, 18, 5, o.liquid || '#3f2a18');
      s += e(58, 52, 13, 3, '#6b4423');
      return s + steam;
    }
    s += ps('M76,58 C92,58 92,86 76,86', '#fdfdff', 6);
    s += ps('M76,62 C86,62 86,82 76,82', '#e2e8f0', 3);
    s += p('M40,50 L76,50 L71,96 L45,96 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"');
    s += e(58, 50, 18, 5, o.liquid || '#4a2c17');
    s += e(58, 50, 13, 3, '#c89b6a');
    if (o.art) s += e(58, 70, 8, 7, o.art) + e(58, 76, 5, 4, o.art);
    return s + steam;
  });

  /** Two coffee beans, for the idea of caffeine rather than a cup. */
  kind('coffeebean', function (o) {
    var bean = function (x, y, rot) {
      return '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')">' +
        e(x, y, 17, 12, o.bean || '#6b4423') +
        ps('M' + (x - 13) + ',' + y + ' C' + (x - 6) + ',' + (y - 6) + ' ' + (x + 6) + ',' + (y + 6) + ' ' + (x + 13) + ',' + y,
           '#3f2a18', 2.6) +
        '</g>';
    };
    return shadow(102, 30) + bean(42, 62, -18) + bean(78, 74, 14) +
      F.spark(88, 30, 8, '#fbbf24') + F.spark(26, 34, 6, '#fcd34d');
  });

  kind('flask', function (o) {
    var s = shadow(102, 22);
    s += rc(48, 22, 24, 12, o.cap || '#1e3a8a', 3);
    s += p('M50,32 L70,32 L70,52 C70,62 78,68 78,80 C78,92 70,98 60,98 C50,98 42,92 42,80 C42,68 50,62 50,52 Z',
      o.body || '#0f766e');
    s += p('M52,34 L68,34 L68,52 C68,60 74,66 74,78 C74,88 68,93 60,93 C52,93 46,88 46,78 C46,66 52,60 52,52 Z',
      o.liquid || '#e2e8f0', 'opacity=".55"');
    s += rc(46, 66, 5, 26, '#ffffff', 3, 'opacity=".3"');
    return s;
  });

  kind('carafe', function (o) {
    var s = shadow(102, 26);
    s += p('M46,20 L74,20 L74,34 C74,40 80,44 80,56 L80,90 C80,96 76,98 70,98 L50,98 C44,98 40,96 40,90 L40,56 C40,44 46,40 46,34 Z',
      '#e2e8f0', 'opacity=".65"');
    s += p('M43,58 L77,58 L77,90 C77,94 74,95 70,95 L50,95 C46,95 43,94 43,90 Z', o.liquid || '#9f1239');
    s += e(60, 58, 17, 3.5, o.liquid || '#9f1239');
    s += ps('M80,50 C96,48 98,74 82,80', '#e2e8f0', 4);
    return s;
  });

  kind('jar', function (o) {
    var s = shadow(102, 24);
    s += box(40, 34, 40, 62, o.glass || '#e2e8f0', 6, 'stroke="#cbd5e1" stroke-width="2"');
    s += box(44, 56, 32, 38, o.content || '#f5d33c', 4);
    s += box(36, 26, 48, 12, o.lid || '#a16207', 3);
    s += rc(44, 42, 5, 44, '#ffffff', 3, 'opacity=".4"');
    if (o.contents) s += o.contents;
    return s;
  });

  kind('tin', function (o) {
    var s = shadow(102, 24);
    s += box(40, 36, 40, 60, o.body || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
    s += box(36, 30, 48, 10, o.lid || '#cbd5e1', 3, 'stroke="#64748b" stroke-width="2"');
    s += e(60, 30, 24, 4, '#e2e8f0');
    s += box(44, 48, 32, 30, o.label || '#fdf6e8', 2);
    if (o.mark) s += txt(60, 70, o.mark, 16, o.markColor || '#334155');
    return s;
  });

  kind('flask2', function (o) {
    /* drinking glass, straight sided: used where a tumbler is meant */
    var s = shadow(102, 26);
    s += cup(56, 42, 96, 46, 38, '#e2e8f0', 'opacity=".55"');
    s += p('M36,56 L76,56 L73,96 L39,96 Z', o.liquid || '#38bdf8');
    s += e(56, 56, 20, 3.5, o.liquid || '#38bdf8');
    s += e(56, 42, 23, 3.5, '#ffffff', 'opacity=".9"');
    s += rc(40, 62, 4, 26, '#ffffff', 2, 'opacity=".45"');
    return s;
  });

  kind('goblet', function (o) {
    var s = shadow(104, 24);
    s += p('M42,28 L78,28 C78,50 70,58 70,70 L50,70 C50,58 42,50 42,28 Z',
      o.liquid ? o.liquid : '#e2e8f0', o.liquid ? 0 : 'opacity=".6"');
    s += ln(60, 70, 60, 92, '#cbd5e1', 4);
    s += e(60, 94, 22, 6, '#cbd5e1') + e(60, 91, 18, 5, '#94a3b8');
    s += e(60, 40, 12, 3, '#ffffff', 'opacity=".4"');
    return s;
  });

  /* ================================================================== *
   * Kitchen
   * ================================================================== */

  kind('cookware', function (o) {
    var s = shadow(102, 30);
    if (o.handle === 'long') {
      s += ps('M84,54 C106,54 108,76 92,84', o.grip || '#334155', 6);
    } else {
      s += ps('M84,50 C104,50 104,72 88,78', o.grip || '#334155', 5);
    }
    s += p('M18,50 L82,50 C82,80 66,96 50,96 C34,96 18,80 18,50 Z', o.body || '#334155');
    s += p('M23,55 L77,55 C77,78 64,90 50,90 C36,90 23,78 23,55 Z', o.inner || '#475569');
    if (o.content) s += e(50, 58, 24, 5, o.content);
    if (o.lid) s += e(50, 50, 32, 7, o.body || '#334155') + c(50, 42, 5, o.body || '#334155');
    if (o.steam) s += ps('M42,42 C46,34 36,30 40,22 M60,40 C64,32 54,28 58,20', '#cbd5e1', 2.6);
    return s;
  });

  kind('pot', function (o) {
    var s = shadow(102, 32);
    s += ps('M26,58 C12,58 12,80 26,80', o.grip || '#475569', 4.4);
    s += ps('M94,58 C108,58 108,80 94,80', o.grip || '#475569', 4.4);
    s += p('M28,46 L92,46 C92,84 80,98 60,98 C40,98 28,84 28,46 Z', o.body || '#64748b');
    s += box(24, 38, 72, 11, o.lid || '#475569', 3);
    s += c(60, 28, 6, o.lid || '#475569') + e(60, 28, 14, 5, '#94a3b8');
    s += rc(44, 60, 8, 28, '#ffffff', 4, 'opacity=".22"');
    if (o.steam) s += ps('M48,30 C52,22 42,18 46,10 M66,28 C70,20 60,16 64,8', '#cbd5e1', 2.6);
    return s;
  });

  kind('appliance', function (o) {
    var s = shadow(102, o.shadow || 34);
    if (o.kind === 'fridge') {
      s += shadedBox(34, 22, 52, 76, '#e2e8f0', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
      s += ln(60, 24, 60, 52, '#94a3b8', 2);
      s += rc(53, 38, 4, 12, '#64748b', 2) + rc(53, 60, 4, 14, '#64748b', 2);
      if (o.sticker) s += e(60, 80, 12, 10, o.sticker);
    } else if (o.kind === 'oven') {
      s += shadedBox(28, 30, 64, 66, '#e2e8f0', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
      s += box(36, 48, 48, 34, '#334155', 3);
      s += rc(42, 54, 36, 20, o.glow || '#f97316', 2, 'opacity=".85"');
      s += box(34, 36, 24, 7, '#94a3b8', 3);
      for (var i = 0; i < 3; i++) s += c(38 + i * 8, 34, 3, '#475569');
    } else if (o.kind === 'stove') {
      s += shadedBox(26, 40, 68, 56, '#e2e8f0', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
      s += box(30, 24, 60, 18, '#94a3b8', 3);
      s += c(44, 62, 9, '#334155') + c(76, 62, 9, '#334155');
      s += e(44, 62, 14, 4, '#f97316') + e(76, 62, 14, 4, '#f97316');
      s += c(40, 84, 4, '#334155') + c(60, 84, 4, '#334155') + c(80, 84, 4, '#334155');
    } else if (o.kind === 'microwave') {
      s += shadedBox(20, 38, 80, 50, '#e2e8f0', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
      s += box(28, 46, 44, 34, '#334155', 2);
      s += box(32, 50, 36, 26, '#0f172a', 2);
      s += box(78, 48, 14, 8, '#334155', 2);
      s += c(85, 68, 4, '#ef4444') + c(85, 78, 4, '#22c55e');
    } else if (o.kind === 'dishwasher') {
      s += shadedBox(30, 30, 60, 68, '#e2e8f0', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
      s += box(36, 44, 48, 44, '#334155', 2);
      s += rc(42, 50, 36, 18, '#38bdf8', 2, 'opacity=".7"');
      s += c(60, 38, 3.4, '#22c55e');
    } else if (o.kind === 'toaster') {
      s += shadedBox(28, 52, 64, 38, '#cbd5e1', '#94a3b8', 'stroke="#64748b" stroke-width="2"');
      s += box(40, 44, 16, 10, '#64748b', 2) + box(64, 44, 16, 10, '#64748b', 2);
      s += p('M40,42 L56,42 L56,30 L40,30 Z', o.toast || '#d9a05b');
      s += p('M64,42 L80,42 L80,30 L64,30 Z', o.toast || '#d9a05b');
      s += rc(36, 62, 5, 14, '#64748b', 2);
    } else if (o.kind === 'kettle') {
      s += ps('M84,56 C104,54 106,80 88,86', '#0f766e', 5);
      s += ps('M34,58 C16,58 14,82 30,86', '#0f766e', 5);
      s += p('M32,48 C32,34 44,30 60,30 C76,30 88,34 88,48 L90,86 C90,94 84,98 60,98 C36,98 30,94 30,86 Z', '#0f766e');
      s += box(28, 38, 64, 11, '#134e4a', 3);
      s += c(60, 28, 6, '#134e4a');
      s += rc(46, 62, 7, 22, '#5eead4', 4, 'opacity=".45"');
    } else if (o.kind === 'mixer') {
      s += p('M40,96 L80,96 L86,72 L34,72 Z', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
      s += rc(52, 40, 16, 32, '#334155', 4);
      s += p('M46,42 L74,42 L82,20 L38,20 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M60,72 L60,64', '#334155', 3);
      if (o.cream) s += e(60, 66, 20, 6, o.cream);
    } else if (o.kind === 'grill') {
      s += p('M14,44 C34,30 86,30 106,44 L98,58 C78,46 42,46 22,58 Z', '#334155');
      s += ln(20, 48, 100, 48, '#64748b', 2.4);
      s += ps('M24,54 L20,96 M96,54 L100,96', '#475569', 4);
      s += ps('M40,56 L36,96 M80,56 L84,96', '#475569', 3);
      if (o.steam) s += ps('M52,28 C56,20 46,16 50,8 M72,26 C76,18 66,14 70,6', '#cbd5e1', 2.4);
    }
    return s;
  });

  kind('utensil', function (o) {
    var metal = o.metal || '#cbd5e1';
    var edge = o.edge || 'stroke="#94a3b8" stroke-width="2"';
    var s = '';
    if (o.shape === 'fork') {
      /* long handle, short neck, four clearly separated tines */
      s += rc(55, 58, 11, 40, metal, 5, edge);
      s += rc(48, 52, 24, 8, metal, 3, edge);
      var tx = [43, 52, 61, 70];
      for (var fi = 0; fi < 4; fi++) {
        s += rc(tx[fi], 16, 7, 38, metal, 3.5, edge);
      }
      s += box(41, 10, 38, 9, metal, 4, edge);
      s += rc(58, 70, 5, 20, '#ffffff', 3, 'opacity=".45"');
    } else if (o.shape === 'knife') {
      /* blade and handle on the same axis so the edge reads at card size */
      s += p('M16,20 L74,20 L74,44 C74,52 66,56 56,56 L16,56 Z', metal, edge);
      s += p('M20,24 L70,24 L70,42 C70,48 64,50 56,50 L20,50 Z', '#f1f5f9');
      s += ps('M20,50 L58,50', '#94a3b8', 2);
      s += box(72, 22, 8, 32, '#94a3b8', 2, edge);
      s += p('M78,22 L104,22 L104,88 C104,94 100,96 96,96 L86,96 C82,96 78,94 78,88 Z',
        o.grip || '#4a3a2a');
      s += c(88, 32, 2, '#cbd5e1') + c(88, 44, 2, '#cbd5e1');
    } else if (o.shape === 'spoon') {
      s += e(58, 34, 20, 26, metal, edge);
      s += e(58, 32, 14, 19, '#f1f5f9');
      s += rc(52, 56, 12, 42, metal, 6, edge);
    } else if (o.shape === 'chopsticks') {
      s += ps('M42,96 L74,16', o.grip || '#8a5a33', 5);
      s += ps('M56,96 L88,16', o.grip || '#8a5a33', 5);
    } else if (o.shape === 'ladle') {
      s += rc(56, 40, 8, 54, metal, 4, edge);
      s += e(50, 34, 20, 16, metal, edge);
      s += e(50, 34, 14, 10, '#f1f5f9');
    } else if (o.shape === 'whisk') {
      s += rc(56, 62, 8, 34, o.grip || '#334155', 4);
      s += ps('M44,64 C34,44 44,22 60,22 C76,22 86,44 76,64', metal, 3.4);
      s += ps('M50,64 C44,44 50,28 60,28 C70,28 76,44 70,64', metal, 3);
    } else if (o.shape === 'spatula') {
      s += rc(56, 40, 8, 56, o.grip || '#334155', 4);
      s += p('M36,22 L84,22 L80,40 L40,40 Z', metal, edge);
      s += ln(44, 26, 44, 36, '#94a3b8', 1.6) + ln(54, 26, 54, 36, '#94a3b8', 1.6) +
           ln(64, 26, 64, 36, '#94a3b8', 1.6) + ln(74, 26, 74, 36, '#94a3b8', 1.6);
    } else if (o.shape === 'tongs') {
      s += ps('M46,96 L54,26', '#94a3b8', 5);
      s += ps('M74,96 L66,26', '#94a3b8', 5);
      s += c(60, 22, 4, '#cbd5e1');
      s += e(46, 30, 8, 10, '#cbd5e1') + e(74, 30, 8, 10, '#cbd5e1');
    } else if (o.shape === 'peeler') {
      s += rc(54, 48, 12, 48, o.grip || '#0f766e', 5);
      s += p('M34,32 L86,32 L86,48 L34,48 Z', metal, edge);
      s += ln(40, 40, 80, 40, '#94a3b8', 2);
    } else if (o.shape === 'grater') {
      s += p('M40,24 L80,24 L74,92 L46,92 Z', metal, edge);
      for (var gx = 0; gx < 4; gx++) for (var gy = 0; gy < 6; gy++) {
        s += c(48 + gx * 8, 34 + gy * 10, 1.4, '#94a3b8');
      }
    } else if (o.shape === 'colander') {
      s += p('M28,44 L92,44 C90,80 78,98 60,98 C42,98 30,80 28,44 Z', metal, edge);
      s += e(60, 44, 32, 6, metal, edge);
      s += ps('M40,58 L80,58 M46,74 L74,74', '#94a3b8', 1.6);
    } else if (o.shape === 'rollingpin') {
      s += rc(22, 44, 76, 24, '#c9a066', 12, 'stroke="#a97b45" stroke-width="2"');
      s += rc(14, 48, 12, 16, '#8a5a33', 4) + rc(94, 48, 12, 16, '#8a5a33', 4);
      s += rc(34, 48, 52, 6, '#ffffff', 3, 'opacity=".25"');
    }
    return s;
  });

  kind('board', function (o) {
    var s = shadow(102, 34);
    s += p('M16,44 L104,44 L96,96 L24,96 Z', o.wood || '#c98a4b', 'stroke="#8a5a33" stroke-width="2"');
    s += rc(16, 38, 88, 10, o.wood || '#c98a4b', 4, 'stroke="#8a5a33" stroke-width="2"');
    s += ln(32, 56, 30, 88, '#a9754a', 1.6) + ln(60, 54, 59, 88, '#a9754a', 1.6) + ln(86, 56, 85, 88, '#a9754a', 1.6);
    if (o.onBoard) s += o.onBoard;
    return s;
  });

  kind('pantry', function (o) {
    var s = shadow(102, 24);
    if (o.shape === 'bottle') {
      s += rc(52, 22, 16, 14, '#e2e8f0', 2, 'opacity=".6"');
      s += p('M42,34 C42,40 40,42 40,48 L40,94 C40,97 43,98 46,98 L74,98 C77,98 80,97 80,94 L80,48 C80,42 78,40 78,34 Z', o.liquid || '#f5d33c');
      s += box(44, 58, 32, 22, o.label || '#fdf6e8', 2);
      s += rc(41, 44, 5, 48, '#ffffff', 3, 'opacity=".3"');
    } else if (o.shape === 'box') {
      s += p('M22,44 L98,44 L92,98 L28,98 Z', o.body || '#d9a05b', 'stroke="#a97b45" stroke-width="2"');
      s += p('M22,44 L98,44 L94,58 L26,58 Z', o.flap || '#e8bd7d');
      s += box(46, 70, 28, 12, o.label || '#fdf6e8', 2);
    } else if (o.shape === 'jar') {
      s += box(40, 36, 40, 60, '#e2e8f0', 6, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(44, 56, 32, 38, o.content || '#f5d33c', 4);
      s += box(36, 28, 48, 11, o.lid || '#a16207', 3);
    }
    if (o.mark) s += txt(60, o.markY || 76, o.mark, 15, o.markColor || '#334155');
    return s;
  });

  kind('apron', function (o) {
    var s = person(60, 40, { scale: 0.86, shirt: o.shirt || '#0f172a', arms: false, smile: true, hair: '#3a2f2a' });
    s += p('M40,54 L80,54 L92,98 L28,98 Z', o.color || '#b45309');
    s += p('M40,54 C44,64 50,68 60,68 C70,68 76,64 80,54 L74,54 C70,60 50,60 46,54 Z', o.color || '#b45309');
    s += box(40, 74, 40, 10, '#ffffff', 2, 'opacity=".3"');
    s += ln(48, 46, 50, 56, o.color || '#b45309', 3) + ln(72, 46, 70, 56, o.color || '#b45309', 3);
    return s;
  });

  kind('mitt', function (o) {
    var s = shadow(102, 26);
    s += p('M42,50 L80,50 L76,92 L46,92 Z', o.color || '#334155', 'stroke="#1e293b" stroke-width="2"');
    s += rc(40, 26, 44, 30, o.color || '#334155', 10, 'stroke="#1e293b" stroke-width="2"');
    s += rc(44, 16, 9, 16, o.color || '#334155', 4) + rc(55, 12, 9, 20, o.color || '#334155', 4) +
         rc(66, 16, 9, 16, o.color || '#334155', 4);
    s += box(42, 88, 34, 10, '#fdfdff', 2, 'opacity=".35"');
    if (o.steam) s += ps('M52,10 C56,4 48,2 52,-4 M70,10 C74,4 66,2 70,-4', '#cbd5e1', 2.4);
    return s;
  });

  kind('appliancebox', function (o) {
    var s = shadow(102, 34);
    s += shadedBox(30, o.top || 40, 60, 98 - (o.top || 40), '#e2e8f0', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
    s += box(o.inset || 36, (o.top || 40) + 8, 48, o.insetH || 20, o.inset || '#334155', 3);
    if (o.knobs) {
      for (var i = 0; i < 3; i++) s += c(42 + i * 18, (o.top || 40) + 6, 3.4, '#475569');
    }
    if (o.label) s += txt(60, o.labelY || 80, o.label, 12, '#334155');
    return s;
  });

  kind('softgoods', function (o) {
    var s = shadow(102, o.shadow || 28);
    if (o.shape === 'cloth') {
      s += p('M24,30 L96,30 L96,58 L84,58 L84,96 L70,96 L70,58 L50,58 L50,96 L36,96 L36,58 L24,58 Z',
        o.color || '#38bdf8');
      s += box(24, 40, 72, 7, '#ffffff', 0, 'opacity=".4"');
      s += box(24, 54, 72, 5, '#ffffff', 0, 'opacity=".3"');
    } else if (o.shape === 'sponge') {
      s += box(34, 46, 52, 44, o.color || '#fbcfe8', 12);
      s += e(60, 46, 26, 8, '#fde7f3');
      s += c(94, 30, 5, o.color || '#fbcfe8', 'opacity=".8"') + c(100, 40, 3.4, o.color || '#fbcfe8', 'opacity=".7"') +
           c(24, 34, 3.4, o.color || '#fbcfe8', 'opacity=".7"');
    }
    if (o.parts) s += o.parts;
    return s;
  });

  kind('faucet', function (o) {
    var s = shadow(102, 26);
    s += box(30, 76, 60, 20, o.body || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
    s += ps('M46,76 L46,44 C46,32 56,30 70,30 L76,30', o.body || '#94a3b8', 7);
    s += c(76, 34, 6, o.body || '#94a3b8');
    s += rc(24, 30, 12, 8, o.body || '#94a3b8', 3);
    if (o.drip) s += ps('M76,44 C76,54 74,60 76,66', '#38bdf8', 3) + c(76, 68, 3.4, '#38bdf8');
    return s;
  });

  kind('bin', function (o) {
    var s = shadow(102, 26);
    s += p('M34,36 L86,36 L80,96 L40,96 Z', o.body || '#94a3b8', 'stroke="#64748b" stroke-width="2"');
    s += box(30, 28, 60, 10, o.lid || '#64748b', 4, 'stroke="#475569" stroke-width="2"');
    s += rc(50, 22, 20, 7, '#475569', 3);
    s += rc(44, 48, 5, 40, '#ffffff', 3, 'opacity=".25"');
    if (o.liner) s += p('M40,32 L80,32 L76,44 L44,44 Z', o.liner);
    return s;
  });

  kind('apronstrim', function (o) {
    var s = p('M30,50 L90,50 L102,98 L18,98 Z', o.color || '#0f766e');
    s += ps('M46,50 C46,34 74,34 74,50', o.color || '#0f766e', 4);
    s += box(40, 66, 40, 8, '#ffffff', 2, 'opacity=".35"');
    if (o.item) s += o.item;
    return s;
  });


  /* ================================================================== *
   * Drinks, part two: the small objects that live on and around a drink
   * ================================================================== */

  kind('straw', function (o) {
    return '<g transform="rotate(24 60 60)">' +
      rc(52, 10, 16, 74, o.color || '#e0453f', 6) +
      rc(52, 74, 16, 10, '#ffffff', 0, 'opacity=".55"') +
      ln(56, 18, 56, 66, '#ffffff', 2, 'opacity=".4"') +
      '</g>';
  });

  kind('icecube', function (o) {
    var line = 'stroke="#5fa8dc" stroke-width="2.4"';
    return p('M60,24 L86,44 L60,64 L34,44 Z', '#cfe8fa', line) +
      p('M34,44 L60,64 L60,96 L34,96 Z', '#e3f2fd', line) +
      p('M60,64 L86,44 L86,96 L60,96 Z', '#b3d8f3', line) +
      ps('M44,44 C50,38 56,36 62,38', '#ffffff', 3) +
      c(74, 82, 3, '#ffffff', 'opacity=".55"') + c(50, 80, 2.2, '#ffffff', 'opacity=".45"');
  });

  kind('opener', function (o) {
    return shadow(102, 22) +
      rc(34, 56, 12, 40, o.grip || '#dc2626', 5) +
      rc(34, 48, 30, 14, '#cbd5e1', 5, 'stroke="#94a3b8" stroke-width="2"') +
      p('M64,48 L84,30 L90,38 L72,56 Z', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"') +
      c(86, 32, 4, '#64748b');
  });

  kind('cork', function (o) {
    return shadow(102, 18) +
      rc(46, 46, 28, 44, o.color || '#d9a05b', 6, 'stroke="#a97b45" stroke-width="2"') +
      ps('M46,56 L74,56 M46,66 L74,66 M46,76 L74,76', '#a97b45', 1.6) +
      e(60, 44, 14, 5, '#e8bd7d');
  });

  kind('icebucket', function (o) {
    var s = shadow(102, 30);
    s += p('M30,44 L90,44 L82,96 L38,96 Z', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
    s += e(60, 44, 30, 6, '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
    s += ps('M36,50 C22,52 22,76 34,80', '#cbd5e1', 4);
    s += ps('M84,50 C98,52 98,76 86,80', '#cbd5e1', 4);
    s += p('M40,42 L54,32 L60,44 L68,30 L80,42 Z', '#e2f2fd');
    s += rc(44, 40, 10, 8, '#b3d8f3', 2, 'transform="rotate(-14 49 44)"');
    s += rc(66, 38, 10, 8, '#cfe8fa', 2, 'transform="rotate(12 71 42)"');
    s += rc(46, 62, 5, 30, '#ffffff', 3, 'opacity=".4"');
    return s;
  });

  kind('thirst', function (o) {
    /* A dry mouth: the "ah" shape plus three parched lines. */
    return shadow(102, 26) +
      c(60, 50, 28, '#fca5a5', 'opacity=".55"') +
      e(60, 66, 15, 8, '#7f1d1d') +
      ps('M44,30 C48,22 38,18 42,10 M76,30 C80,22 70,18 74,10', '#9f1239', 3, 'opacity=".7"') +
      ps('M30,84 C40,78 50,84 60,80 M70,80 C80,86 90,80 96,84', '#94a3b8', 2.6, 'stroke-dasharray="4 4"');
  });

  kind('stirrer', function (o) {
    return '<g transform="rotate(20 60 60)">' +
      rc(56, 8, 8, 88, o.color || '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(56, 88, 8, 16, o.color || '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"') +
      '</g>';
  });

  kind('strainer', function (o) {
    var s = shadow(102, 24);
    s += e(60, 46, 32, 8, '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
    s += p('M28,46 L92,46 L86,74 C80,90 70,98 60,98 C50,98 40,90 34,74 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
    for (var i = -1; i <= 1; i++) s += ln(60 + i * 14, 52, 60 + i * 10, 92, '#94a3b8', 1.6);
    s += ps('M86,40 C100,38 102,58 90,62', '#cbd5e1', 4);
    s += rc(36, 50, 4, 34, '#ffffff', 2, 'opacity=".5"');
    return s;
  });

  kind('blender', function (o) {
    var s = shadow(102, 26);
    s += box(34, 26, 52, 12, '#334155', 3);
    s += p('M40,38 L80,38 L74,86 L46,86 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
    s += p('M44,60 L76,60 L73,84 L47,84 Z', o.liquid || '#f472b6');
    s += e(60, 60, 16, 3, o.liquid || '#f472b6');
    s += box(32, 86, 56, 12, '#334155', 3);
    s += c(50, 92, 3.4, o.power ? '#22c55e' : '#64748b') + c(66, 92, 3.4, '#475569');
    s += rc(44, 44, 4, 34, '#ffffff', 2, 'opacity=".45"');
    return s;
  });

  kind('bowl', function (o) {
    var s = shadow(102, 32);
    s += p('M26,44 L94,44 C92,84 78,100 60,100 C42,100 28,84 26,44 Z', o.body || '#fdfdff',
      'stroke="#cbd5e1" stroke-width="2"');
    s += e(60, 46, 30, 6, o.liquid || '#ef4444', 'stroke="#cbd5e1" stroke-width="2"');
    s += c(48, 42, 4, o.liquid || '#ef4444') + c(70, 40, 3, o.liquid || '#ef4444') +
         c(58, 36, 2.6, o.liquid || '#ef4444');
    s += ps('M40,60 C44,78 52,90 60,92', '#ffffff', 3, 'opacity=".5"');
    return s;
  });

  /* ================================================================== *
   * Kitchen, part two
   * ================================================================== */

  kind('lid', function (o) {
    return shadow(102, 28) +
      p('M22,52 L98,52 L92,74 L28,74 Z', o.color || '#64748b', 'stroke="#475569" stroke-width="2"') +
      e(60, 52, 38, 8, '#94a3b8', 'stroke="#475569" stroke-width="2"') +
      c(60, 38, 7, o.color || '#64748b') + e(60, 38, 16, 5, '#94a3b8') +
      e(38, 64, 8, 4, '#ffffff', 'opacity=".3"');
  });

  kind('trivet', function (o) {
    return shadow(102, 30) +
      p('M26,60 L94,60 L86,90 L34,90 Z', o.color || '#475569', 'stroke="#334155" stroke-width="2"') +
      ln(34, 70, 86, 70, '#64748b', 2) + ln(36, 80, 84, 80, '#64748b', 2) +
      ln(40, 60, 44, 90, '#64748b', 1.6) + ln(60, 60, 60, 90, '#64748b', 1.6) +
      ln(80, 60, 76, 90, '#64748b', 1.6) +
      p('M44,58 C52,46 68,46 76,58 Z', '#f97316', 'opacity=".85"');
  });

  kind('dough', function (o) {
    return shadow(102, 30) +
      e(60, 74, 32, 16, '#f5e6c8') +
      e(50, 66, 12, 5, '#ffffff', 'opacity=".45"') +
      box(28, 86, 64, 10, '#c98a4b', 3, 'stroke="#8a5a33" stroke-width="2"') +
      ps('M84,44 C92,38 96,46 90,52', '#cbd5e1', 2.4);
  });

  kind('recipe', function (o) {
    return shadow(102, 24) +
      p('M32,22 L88,22 L88,98 L32,98 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      box(32, 22, 56, 14, o.color || '#0ea5e9') +
      ln(42, 48, 78, 48, '#94a3b8', 2.4) + ln(42, 60, 78, 60, '#cbd5e1', 2) +
      ln(42, 70, 70, 70, '#cbd5e1', 2) + ln(42, 80, 78, 80, '#cbd5e1', 2) +
      c(46, 60, 4, '#0ea5e9') + c(46, 70, 4, '#0ea5e9');
  });

  kind('ingredient', function (o) {
    return shadow(102, 26) +
      e(60, 82, 30, 7, '#e2e8f0') +
      c(44, 62, 13, o.a || '#ef4444') + c(60, 56, 12, o.b || '#fbbf24') + c(74, 64, 11, o.c || '#22c55e') +
      c(52, 74, 9, o.c || '#22c55e') + c(66, 76, 8, o.a || '#ef4444') +
      c(60, 40, 2.6, o.b || '#fbbf24') + c(80, 46, 2.2, o.a || '#ef4444');
  });

  kind('tray', function (o) {
    var s = shadow(102, 38);
    s += p('M16,44 L104,44 L96,96 L24,96 Z', o.color || '#475569', 'stroke="#334155" stroke-width="2"');
    s += p('M22,52 L98,52 L92,88 L28,88 Z', o.inner || '#64748b');
    s += p('M20,38 L100,38 L96,50 L24,50 Z', '#94a3b8', 'stroke="#64748b" stroke-width="2"');
    s += rc(30, 56, 60, 4, '#ffffff', 2, 'opacity=".2"');
    return s;
  });

  kind('rack', function (o) {
    var s = shadow(102, 32);
    s += ps('M24,96 L24,20 M96,96 L96,20', '#94a3b8', 5);
    for (var i = 0; i < 5; i++) s += ln(24, 30 + i * 15, 96, 30 + i * 15, '#cbd5e1', 3);
    s += e(24, 20, 4, 4, '#64748b') + e(96, 20, 4, 4, '#64748b');
    return s;
  });

  kind('burner', function (o) {
    return shadow(102, 30) +
      e(60, 74, 30, 10, '#334155') +
      c(60, 74, 16, '#475569') +
      c(60, 74, 9, '#1e293b') +
      ps('M44,60 C40,50 46,44 44,36 M60,58 C56,48 62,42 60,32 M76,60 C72,50 78,44 76,36',
        o.flame || '#f97316', 3.4, 'opacity=".85"') +
      ps('M50,58 C48,50 52,46 50,40 M70,58 C68,50 72,46 70,40', '#fde68a', 2, 'opacity=".9"');
  });

  kind('sink', function (o) {
    var s = shadow(102, 36);
    s += p('M20,44 L100,44 L100,58 L20,58 Z', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
    s += p('M28,58 L92,58 C92,86 78,98 60,98 C42,98 28,86 28,58 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
    s += e(60, 60, 28, 5, '#94a3b8');
    s += ps('M48,44 L48,30 C48,22 56,20 68,20', '#94a3b8', 6);
    s += c(68, 20, 5, '#64748b');
    s += ps('M68,30 C68,38 66,42 66,48', '#38bdf8', 3);
    s += rc(34, 66, 5, 24, '#ffffff', 3, 'opacity=".5"');
    return s;
  });

  kind('counter', function (o) {
    return shadow(102, 40) +
      box(14, 40, 92, 12, o.top || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="2"') +
      box(18, 52, 38, 44, o.body || '#a8a29e', 2) + box(64, 52, 38, 44, o.body || '#a8a29e', 2) +
      rc(30, 68, 4, 12, '#57534e', 2) + rc(76, 68, 4, 12, '#57534e', 2) +
      ps('M20,40 C34,34 86,34 100,40', '#ffffff', 2, 'opacity=".4"');
  });

  kind('cabinet', function (o) {
    return shadow(102, 32) +
      box(30, 20, 60, 76, o.body || '#c9a066', 3, 'stroke="#8a5a33" stroke-width="2"') +
      box(34, 26, 24, 32, o.door || '#e0be8a', 2, 'stroke="#8a5a33" stroke-width="2"') +
      box(62, 26, 24, 32, o.door || '#e0be8a', 2, 'stroke="#8a5a33" stroke-width="2"') +
      box(34, 62, 24, 30, o.door || '#e0be8a', 2, 'stroke="#8a5a33" stroke-width="2"') +
      box(62, 62, 24, 30, o.door || '#e0be8a', 2, 'stroke="#8a5a33" stroke-width="2"') +
      c(56, 42, 2.4, '#8a5a33') + c(64, 42, 2.4, '#8a5a33') +
      c(56, 77, 2.4, '#8a5a33') + c(64, 77, 2.4, '#8a5a33');
  });

  kind('extractor', function (o) {
    return box(24, 20, 72, 22, '#cbd5e1', 4, 'stroke="#94a3b8" stroke-width="2"') +
      box(18, 42, 84, 10, '#94a3b8', 3) +
      box(30, 14, 60, 8, '#64748b', 2) +
      ps('M42,52 C42,44 48,40 48,34 M60,52 C60,44 66,40 66,34 M78,52 C78,44 84,40 84,34',
        '#cbd5e1', 2.4, 'opacity=".8"') +
      c(60, 58, 4, '#22c55e');
  });

  kind('mop', function (o) {
    return '<g transform="rotate(12 60 60)">' +
      rc(56, 8, 8, 62, o.stick || '#a16207', 4) +
      p('M40,68 L80,68 L86,98 L34,98 Z', o.head || '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"') +
      ln(42, 76, 42, 98, '#cbd5e1', 2) + ln(52, 76, 52, 98, '#cbd5e1', 2) +
      ln(62, 76, 62, 98, '#cbd5e1', 2) + ln(72, 76, 72, 98, '#cbd5e1', 2) +
      box(38, 64, 44, 6, '#94a3b8', 2) +
      '</g>';
  });

  kind('campingstove', function (o) {
    return shadow(102, 28) +
      box(38, 58, 44, 26, '#b91c1c', 4, 'stroke="#7f1d1d" stroke-width="2"') +
      box(30, 50, 60, 10, '#dc2626', 3, 'stroke="#7f1d1d" stroke-width="2"') +
      ps('M44,46 C40,36 46,30 44,22 M60,44 C56,34 62,28 60,18 M76,46 C72,36 78,30 76,22',
        '#f97316', 3.4, 'opacity=".9"') +
      ps('M50,44 C48,36 52,32 50,26 M70,44 C68,36 72,32 70,26', '#fde68a', 2, 'opacity=".9"') +
      rc(44, 68, 32, 6, '#fcd34d', 2);
  });

  kind('thermometer', function (o) {
    return '<g transform="rotate(-16 60 60)">' +
      rc(55, 14, 10, 62, '#fdfdff', 5, 'stroke="#cbd5e1" stroke-width="2"') +
      c(60, 84, 15, '#dc2626') +
      c(60, 84, 9, '#f87171') +
      rc(56, 46, 8, 26, '#dc2626', 4) +
      ln(60, 22, 60, 34, '#94a3b8', 1.6) + ln(60, 40, 60, 52, '#94a3b8', 1.6) +
      '</g>';
  });

  kind('kitchentimer', function (o) {
    if (o.shape === 'stack') {
      /* a wind-up kitchen timer: two discs and a lever */
      return shadow(102, 32) +
        e(60, 82, 34, 8, '#cbd5e1') +
        e(60, 62, 30, 26, '#e2e8f0', 'stroke="#334155" stroke-width="3"') +
        e(60, 46, 24, 12, '#fdfdff', 'stroke="#334155" stroke-width="2"') +
        ln(60, 46, 60, 36, '#334155', 2.4) +
        rc(80, 32, 22, 8, '#dc2626', 3, 'stroke="#b91c1c" stroke-width="2"') +
        c(60, 62, 5, '#334155');
    }
    /* a push-button countdown: a crown, a stem and a big face */
    return shadow(102, 30) +
      box(52, 10, 16, 10, '#334155', 3) +
      rc(57, 20, 6, 10, '#94a3b8', 2) +
      e(60, 58, 34, 34, '#fdfdff', 'stroke="#334155" stroke-width="3"') +
      e(60, 58, 26, 26, '#f8fafc') +
      ln(60, 58, 60, 36, '#334155', 3.4) +
      ln(60, 58, 74, 64, '#dc2626', 2.6) +
      c(60, 58, 3.4, '#334155') +
      e(60, 88, 16, 4, '#334155');
  });

  /* ================================================================== *
   * Registration
   * ================================================================== */

  LLC.art.kind = function (name) { return KINDS[name] || null; };
  LLC.art.kinds = function () { return Object.keys(KINDS); };

  /**
   * Turn a recipe into SVG. A recipe naming a kind that does not exist falls
   * back to the generated geometry *and* records the failure, so a typo in one
   * line of a thousand is caught by the test suite instead of shipping a card
   * that quietly looks like nothing.
   */
  var cache = Object.create(null);
  var failures = [];

  LLC.art.recipe = function (id, spec) {
    if (cache[id]) return cache[id];
    var markup;
    try {
      if (!spec) throw new Error('no recipe');
      var fn = KINDS[spec.k];
      if (!fn) throw new Error('unknown kind: ' + spec.k);
      markup = scene(fn(spec), { bg: spec.bg, ground: spec.ground });
    } catch (err) {
      failures.push({ id: id, error: err && err.message ? err.message : String(err) });
      markup = LLC.art.fallback(id);
    }
    cache[id] = markup;
    return markup;
  };

  /**
   * Register recipes. They go through the same `register()` hook the hand-drawn
   * catalogue uses, so a recipe simply overrides or joins the existing art and
   * the lookup order stays in one place.
   */
  LLC.art.spec = function (map) {
    var wrappers = {};
    for (var id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      /* Both `id` and `spec` have to be captured: a closure over the loop
         variable would hand every recipe the last id in the map. */
      wrappers[id] = (function (wordId, recipe) {
        return function () { return LLC.art.recipe(wordId, recipe); };
      })(id, map[id]);
    }
    LLC.art.register(wrappers);
    return Object.keys(wrappers).length;
  };

  /** Ids whose recipe failed; expected to stay empty. */
  LLC.art.specFailures = function () { return failures.slice(); };
})(window);
