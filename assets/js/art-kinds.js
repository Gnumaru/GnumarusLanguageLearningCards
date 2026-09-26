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
  var SKIN = LLC.art.colors.SKIN, SKIN_D = LLC.art.colors.SKIN_D;
  var NIGHT = LLC.art.colors.NIGHT, WHITE = LLC.art.colors.WHITE;

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
   * People: animals
   *
   * A quadruped is one drawing with a coat, an ear, a tail and a pattern, so
   * the dog, the cat, the fox, the wolf and the bear are recognisably the same
   * animal family rather than fifty unrelated blobs.
   * ================================================================== */

  kind('beast', function (o) {
    var coat = o.coat || '#c98a4b';
    var s = shadow(102, 36);
    /* legs */
    var legX = o.legs === 'hoof' ? [32, 46, 74, 88] : [34, 48, 72, 86];
    for (var i = 0; i < 4; i++) {
      s += rc(legX[i], 76, 12, o.legs === 'hoof' ? 22 : 20, coat, 5);
      s += rc(legX[i] - 1, o.legs === 'hoof' ? 94 : 93, 14, 6, o.legs === 'hoof' ? '#3f3a4d' : coat, 3);
    }
    /* tail */
    if (o.tail === 'bushy') s += ps('M24,60 C8,52 6,72 18,78', coat, 9);
    else if (o.tail === 'thin') s += ps('M24,62 C10,58 8,72 16,78', coat, 4);
    else if (o.tail === 'curl') s += ps('M24,62 C12,60 10,46 20,44', coat, 4.4);
    else if (o.tail === 'tuft') s += ps('M24,62 C12,58 10,44 18,42', coat, 4.4);
    /* body */
    s += e(60, 68, 40, 22, coat);
    if (o.pattern === 'spots') {
      s += c(44, 66, 5, o.mark || '#8a5a33') + c(66, 74, 4.4, o.mark || '#8a5a33') +
           c(78, 62, 3.6, o.mark || '#8a5a33');
    } else if (o.pattern === 'stripes') {
      s += ps('M44,54 L50,82 M58,52 L64,84 M72,54 L78,80', o.mark || '#4a2c17', 3.4);
    } else if (o.pattern === 'patches') {
      s += p('M38,58 C48,52 56,58 54,70 C46,76 36,70 38,58 Z', o.mark || '#3f2a1a') +
           p('M68,56 C80,52 88,60 84,72 C74,78 66,68 68,56 Z', o.mark || '#3f2a1a');
    } else if (o.pattern === 'shell') {
      s += e(60, 64, 22, 15, '#3f7a4a') +
           ps('M44,62 L54,70 M54,58 L62,70 M64,60 L72,70 M48,72 L58,78 M64,74 L72,80', '#2f5c38', 2);
    }
    /* head */
    var hx = o.headX || 88;
    s += e(hx, 50, 22, 20, coat);
    /* ears */
    if (o.ear === 'point') {
      s += p('M' + (hx - 8) + ',34 L' + (hx - 2) + ',18 L' + (hx + 4) + ',36 Z', coat) +
           p('M' + (hx + 4) + ',34 L' + (hx + 12) + ',18 L' + (hx + 16) + ',36 Z', coat);
    } else if (o.ear === 'round') {
      s += c(hx - 8, 32, 8, coat) + c(hx + 9, 32, 8, coat);
    } else if (o.ear === 'flop') {
      s += e(hx - 12, 38, 8, 16, coat) + e(hx + 6, 38, 8, 16, coat);
    }
    /* muzzle */
    s += e(hx + 10, 58, 12, 9, o.muzzle || '#f5e0c8');
    s += c(hx + 15, 55, 3, o.nose || '#3f2a1a');
    if (o.face === 'cat') {
      /* just the nose triangle and the whiskers; the eyes are drawn below */
      s += ps('M' + (hx + 2) + ',56 L' + (hx + 14) + ',56 M' + (hx + 2) + ',56 L' + (hx + 6) + ',64 M' + (hx + 14) + ',56 L' + (hx + 10) + ',64',
        o.nose || '#3f2a1a', 1.4);
    } else if (o.face === 'dog') {
      s += e(hx + 4, 46, 3, 4, NIGHT) + e(hx + 12, 46, 3, 4, NIGHT);
    }
    s += e(hx + 4, 46, 3, 4, o.eye || NIGHT) + e(hx + 12, 46, 3, 4, o.eye || NIGHT);
    if (o.mane) s += e(hx - 2, 50, 30, 26, o.mane);
    if (o.horn) {
      s += ps('M' + (hx - 7) + ',34 L' + (hx - 3) + ',20 M' + (hx - 3) + ',27 L' + (hx - 11) + ',16 M' + (hx - 3) + ',25 L' + (hx + 5) + ',14',
        o.horn, 3.4);
    }
    if (o.horn2) {
      s += ps('M' + (hx + 7) + ',34 L' + (hx + 3) + ',20 M' + (hx + 3) + ',27 L' + (hx + 11) + ',16 M' + (hx + 3) + ',25 L' + (hx - 5) + ',14',
        o.horn2, 3.4);
    }
    if (o.snout) s += e(hx + 16, 60, 14, 11, o.muzzle || '#e8e4dc');
    return s;
  });

  kind('bird', function (o) {
    /* A nest is a bird's house, so it belongs to the same family. */
    if (o.shape === 'nest') {
      var ns = shadow(100, 30, 0.08);
      ns += p('M22,62 C22,44 98,44 98,62 C98,76 78,84 60,84 C42,84 22,76 22,62 Z',
        o.inner || '#c99a6a', 'stroke="' + (o.outer || '#8a5a33') + '" stroke-width="3"');
      for (var nt = 0; nt < 7; nt++) {
        ns += ps('M' + (26 + nt * 11) + ',' + (58 + (nt % 2) * 6) + ' q6,-4 12,0', o.outer || '#8a5a33', 2.4);
      }
      for (var ne = 0; ne < 3; ne++) {
        ns += e(44 + ne * 16, 58 - (ne === 1 ? 6 : 0), 8, 10, o.egg || '#fdfdff',
          'stroke="' + (o.shell || '#e2e8f0') + '" stroke-width="1.6"');
      }
      return ns;
    }
    if (o.shape === 'egg') {
      return shadow(100, 22, 0.08) + e(60, 70, 26, 32, o.egg || '#fdfdff',
        'stroke="' + (o.shell || '#e2e8f0') + '" stroke-width="3"') +
        c(50, 56, 6, '#ffffff', 'opacity=".7"');
    }
    var body = o.body || '#5ba8f5';
    /* A white bird on a pale card is a white blob, so pale birds get an edge.
       `outline: 1` takes the default grey; a string takes that exact colour. */
    var ed = o.outline ? 'stroke="' + (typeof o.outline === 'string' ? o.outline : '#c3ccd6') + '" stroke-width="2"' : '';
    var s = shadow(102, 26);
    /* body, tail, head */
    s += e(56, 62, 26, 20, body, ed);
    if (o.tail === 'long') s += p('M34,60 L6,48 L10,66 L34,70 Z', o.tailColor || body);
    else if (o.tail === 'fan') s += p('M32,58 C14,52 8,66 20,72 L34,72 Z', o.tailColor || body);
    else s += p('M34,58 L10,52 L14,68 L34,70 Z', o.tailColor || body);
    if (o.wing) s += e(54, 64, 18, 12, o.wing, 'opacity=".55"' + (ed ? ' ' + ed : ''));
    /* legs */
    if (o.legs !== 'none') {
      s += ps('M52,78 L50,94 M68,78 L72,94', o.leg || '#f59e0b', 2.6);
      if (o.legs === 'long') s += ps('M52,78 L44,96 M68,78 L78,96', o.leg || '#f59e0b', 2.4);
      s += ps('M46,96 L56,96 M68,96 L78,96', o.leg || '#f59e0b', 2.4);
    }
    /* neck + head: the beak, crest and eye all hang off the head position,
       so a bird with its head up high still gets a beak that lines up */
    var hx = o.headX || 84, hy = o.headY || 40;
    if (o.longneck) {
      s += ps('M' + (o.neckX || 68) + ',62 C' + (o.neckX || 68) + ',42 ' + (hx - 8) + ',' + (hy + 14) +
        ' ' + hx + ',' + hy, body, 11);
    } else {
      s += e(82, hy + 4, 15, 14, body);
    }
    s += c(hx, hy, 12, body, ed);
    /* beak */
    var bx = hx + 10;
    if (o.beak === 'long') s += pl(bx + ',' + (hy - 2) + ' ' + (bx + 22) + ',' + hy + ' ' + bx + ',' + (hy + 2), o.beakColor || '#f59e0b');
    else if (o.beak === 'hook') s += p('M' + bx + ',' + (hy - 4) + ' L' + (bx + 18) + ',' + hy + ' L' + (bx + 2) + ',' + (hy + 10) + ' Z', o.beakColor || '#f59e0b');
    else if (o.beak === 'wide') s += pl((bx - 2) + ',' + (hy - 2) + ' ' + (bx + 22) + ',' + hy + ' ' + (bx - 2) + ',' + (hy + 2), o.beakColor || '#f97316');
    else s += pl(bx + ',' + (hy - 2) + ' ' + (bx + 12) + ',' + hy + ' ' + bx + ',' + (hy + 2), o.beakColor || '#f59e0b');
    /* crest */
    if (o.crest) s += p('M' + (hx - 6) + ',' + (hy - 9) + ' C' + (hx - 8) + ',' + (hy - 22) + ' ' + (hx + 2) + ',' + (hy - 24) + ' ' + (hx + 4) + ',' + (hy - 11) + ' Z', o.crest);
    if (o.crest === 'tuft') s += ps('M' + (hx - 4) + ',' + (hy - 9) + ' C' + (hx - 10) + ',' + (hy - 22) + ' ' + (hx) + ',' + (hy - 26) + ' ' + (hx + 2) + ',' + (hy - 11) + ' M' + (hx + 2) + ',' + (hy - 9) + ' C' + (hx + 4) + ',' + (hy - 24) + ' ' + (hx + 12) + ',' + (hy - 22) + ' ' + (hx + 10) + ',' + (hy - 11), o.crest, 3.4);
    s += c(hx - 5, hy - 2, 2.6, NIGHT);
    if (o.cheek) s += e(hx + 2, hy + 4, 4, 3, o.cheek);
    if (o.pattern === 'spot') {
      s += c(48, 60, 4, '#ffffff', 'opacity=".5"') + c(62, 66, 3, '#ffffff', 'opacity=".45"');
    } else if (o.pattern === 'stripe') {
      s += ps('M46,52 L52,76 M58,50 L64,78 M70,52 L76,74', '#334155', 2.4, 'opacity=".5"');
    }
    return s;
  });

  kind('flyer', function (o) {
    /* insects: body segments, wings, legs */
    var body = o.body || '#3f3a4d';
    var s = '';
    if (o.wings) {
      s += e(56, 40, 34, 16, o.wings, 'opacity=".55"');
      s += e(56, 40, 30, 13, '#ffffff', 'opacity=".35"');
    }
    if (o.legs) {
      for (var i = 0; i < 3; i++) {
        s += ps('M' + (44 + i * 14) + ',62 L' + (38 + i * 14) + ',80 L' + (44 + i * 14) + ',92', '#5a5468', 1.8);
        s += ps('M' + (62 + i * 10) + ',62 L' + (70 + i * 10) + ',80 L' + (64 + i * 10) + ',92', '#5a5468', 1.8);
      }
    }
    s += e(o.abdomenX || 62, 66, o.abdomen || 18, o.abdomenH || 24, body);
    s += c(o.thoraxX || 40, 62, o.thorax || 12, o.thoraxColor || body);
    s += c(o.thoraxX || 40, 62, (o.thorax || 12) * 0.55, '#ffffff', 'opacity=".18"');
    if (o.stripes) {
      s += ps('M50,54 L50,78 M58,52 L58,80 M66,54 L66,78', o.mark || '#f5d33c', 3);
    }
    if (o.spots) {
      s += c(56, 62, 3, o.mark || '#f5d33c') + c(68, 70, 2.6, o.mark || '#f5d33c');
    }
    if (o.eyes) {
      s += c(34, 56, 3.4, o.eyes) + c(46, 56, 3.4, o.eyes);
    }
    if (o.antennae) {
      s += ps('M34,54 C28,44 24,48 22,40 M46,54 C52,44 56,48 58,40', o.antennae, 1.8);
    }
    if (o.tailpin) s += pl('78,58 96,62 78,68 Z', o.tailpin);
    if (o.hair) {
      s += ps('M50,46 C44,36 48,32 46,26 M56,44 C52,34 56,30 54,24 M62,46 C66,36 64,32 66,26', o.hair, 2);
    }
    if (o.shell) {
      s += e(60, 40, 30, 20, o.shell, 'stroke="#1f2937" stroke-width="2"');
      s += ps('M46,36 L60,46 L74,36', '#1f2937', 2);
    }
    if (o.glow) s += e(60, 66, 16, 20, o.glow, 'opacity=".6"');
    return s;
  });

  /** Underwater creatures and the things you find on a shore. */
  kind('seacreature', function (o) {
    var body = o.body || '#3f7fb5';
    var s = o.water === false ? shadow(102, 32) : '';
    if (o.water !== false) {
      s += rc(0, 0, 120, 120, o.waterColor || '#dff0fb', 16);
      s += ps('M0,86 C18,78 32,94 50,86 C68,78 84,94 102,86 C110,82 116,86 120,88 L120,120 L0,120 Z',
        o.sandColor || '#bfe0f7');
      for (var b = 0; b < 3; b++) {
        s += c(16 + b * 40, 12 + (b % 2) * 8, 3, '#ffffff', 'opacity=".6"');
      }
    }
    if (o.shape === 'fish') {
      var fy = o.deep ? 25 : (o.slim ? 13 : 18);   /* half-height of the body */
      var ft = o.tailX || 88;                       /* where the tail joins   */
      var fn = o.fin || body;
      /* body */
      s += p('M' + (o.blunt ? 16 : 26) + ',58 C' + (o.blunt ? 18 : 28) + ',' + (58 - fy) + ' ' +
        (ft - 18) + ',' + (58 - fy) + ' ' + ft + ',58 C' + (ft - 18) + ',' + (58 + fy) + ' ' +
        (o.blunt ? 18 : 28) + ',' + (58 + fy) + ' ' + (o.blunt ? 16 : 26) + ',58 Z', body);
      /* tail: forked, round or shovel */
      if (o.tail === 'fork') {
        s += p('M' + ft + ',58 L' + (ft + 20) + ',' + (58 - fy - 4) + ' L' + (ft + 13) + ',58 L' +
          (ft + 20) + ',' + (58 + fy + 4) + ' Z', fn);
      } else if (o.tail === 'round') {
        s += p('M' + ft + ',58 C' + (ft + 22) + ',' + (58 - fy) + ' ' + (ft + 24) + ',' + (58 + fy) + ' ' + ft + ',58 Z', fn);
      } else if (o.tail === 'shovel') {
        s += p('M' + ft + ',58 L' + (ft + 22) + ',' + (58 - fy - 2) + ' L' + (ft + 24) + ',' + (58 + fy + 2) +
          ' L' + (ft + 22) + ',' + (58 + fy + 6) + ' L' + ft + ',58 Z', fn);
      } else {
        s += p('M' + ft + ',58 L' + (ft + 20) + ',' + (58 - fy - 2) + ' L' + (ft + 22) + ',' + (58 + fy + 2) + ' Z', fn);
      }
      /* dorsal fin: small, spiny or tall */
      if (o.dorsal === 'spiny') {
        s += p('M40,' + (58 - fy + 6) + ' L48,' + (58 - fy - 14) + ' L56,' + (58 - fy - 4) +
          ' L64,' + (58 - fy - 16) + ' L72,' + (58 - fy + 4) + ' Z', fn, 'opacity=".85"');
      } else if (o.dorsal === 'tall') {
        s += p('M' + (ft - 34) + ',' + (58 - fy + 6) + ' C' + (ft - 30) + ',' + (58 - fy - 20) + ' ' +
          (ft - 16) + ',' + (58 - fy - 20) + ' ' + (ft - 12) + ',' + (58 - fy + 4) + ' Z', fn);
      } else {
        s += p('M' + (ft - 30) + ',' + (58 - fy + 5) + ' C' + (ft - 26) + ',' + (58 - fy - 10) + ' ' +
          (ft - 16) + ',' + (58 - fy - 10) + ' ' + (ft - 12) + ',' + (58 - fy + 4) + ' Z', fn);
      }
      /* pectoral fin, gill line, eye, lateral stripe */
      s += e(ft - 26, 58 + fy * 0.4, 13, 8, fn, 'opacity=".55"');
      s += ps('M' + (o.blunt ? 34 : 40) + ',' + (58 - fy * 0.7) + ' q6,6 0,' + (fy * 1.4), o.gill || fn, 2, 'opacity=".55"');
      s += c(o.blunt ? 30 : 36, 54, 4, NIGHT);
      if (o.stripe) s += ps('M' + (ft - 40) + ',58 L' + (ft - 8) + ',58', o.mark || '#ffffff', 4, 'opacity=".5"');
      else s += ps('M' + (ft - 38) + ',' + (58 - fy * 0.5) + ' L' + (ft - 12) + ',' + (58 - fy * 0.5) +
        ' M' + (ft - 38) + ',' + (58 + fy * 0.5) + ' L' + (ft - 12) + ',' + (58 + fy * 0.5),
        o.mark || '#ffffff', 2, 'opacity=".45"');
    } else if (o.shape === 'shark') {
      s += p('M10,62 C30,36 80,38 98,60 C78,80 30,78 10,62 Z', body);
      s += p('M98,60 L116,48 L112,70 Z', o.fin || body);
      s += p('M46,44 C52,28 66,28 70,44 Z', o.fin || body);
      s += p('M22,68 C14,74 12,84 18,90', o.fin || body);
      s += c(30, 56, 3.4, NIGHT);
      s += ps('M44,64 L56,64', NIGHT, 2);
    } else if (o.shape === 'ray') {
      s += p('M60,34 C86,44 96,72 60,98 C24,72 34,44 60,34 Z', body);
      s += ps('M60,34 L60,98', o.mark || '#ffffff', 2, 'opacity=".4"');
      s += ps('M60,36 C52,24 44,20 40,14 M60,36 C68,24 76,20 80,14', body, 4);
      s += c(54, 48, 3, NIGHT) + c(66, 48, 3, NIGHT);
    } else if (o.shape === 'eel') {
      s += ps('M10,80 C34,80 30,40 58,40 C86,40 88,72 110,66', body, 11);
      s += c(108, 66, 7, body);
      s += c(110, 63, 2, NIGHT);
    } else if (o.shape === 'shellfish') {
      s += p('M26,68 C26,40 94,40 94,68 Z', o.shell || '#d6a3e0');
      s += ps('M60,40 L60,68 M42,44 L48,68 M78,44 L72,68 M32,54 L42,68 M88,54 L78,68',
        o.ridge || '#a97bc4', 2);
      s += e(60, 68, 34, 6, o.ridge || '#a97bc4');
    } else if (o.shape === 'crustacean') {
      s += e(60, 66, 22, 30, body);
      s += ps('M40,54 C26,44 20,34 28,28 M80,54 C94,44 100,34 92,28', body, 5);
      s += c(28, 26, 7, body) + c(92, 26, 7, body);
      s += ps('M44,84 L40,98 M76,84 L80,98 M54,92 L52,100 M66,92 L68,100', body, 2.4);
      s += c(52, 58, 2.6, NIGHT) + c(68, 58, 2.6, NIGHT);
    } else if (o.shape === 'cephalopod') {
      s += e(60, 44, 26, 32, body);
      s += c(50, 38, 3, NIGHT) + c(70, 38, 3, NIGHT);
      for (var t = 0; t < 5; t++) {
        s += ps('M' + (44 + t * 8) + ',72 C' + (40 + t * 8) + ',86 ' + (48 + t * 8) + ',92 ' + (44 + t * 8) + ',100', body, 4);
      }
    } else if (o.shape === 'jelly') {
      s += p('M32,52 C32,20 88,20 88,52 Z', body, 'opacity=".8"');
      s += ps('M40,52 C36,70 46,80 40,96 M52,52 C50,72 58,84 52,98 M64,52 C66,72 60,84 66,98 M76,52 C80,70 70,80 76,96',
        body, 4, 'opacity=".7"');
      s += e(60, 52, 28, 5, '#ffffff', 'opacity=".5"');
    } else if (o.shape === 'seahorse') {
      s += ps('M64,26 C44,26 48,44 40,52 C32,60 40,74 52,80 C64,86 78,82 78,72 C78,64 70,60 70,52 C70,44 76,36 72,30',
        body, 9);
      s += p('M72,30 L86,36 L72,42 Z', o.mark || '#fbbf24');
      s += c(50, 56, 3, NIGHT);
      for (var sf = 0; sf < 4; sf++) {
        s += ps('M' + (78 + (sf % 2) * 5) + ',' + (56 + sf * 6) + ' l6,0', o.fin || body, 2.6);
      }
    } else if (o.shape === 'cone') {
      /* a barnacle is a volcano, which is the whole joke of the animal */
      s += p('M36,92 L60,44 L84,92 Z', o.shell || '#d6c9b8', 'stroke="' + (o.ridge || '#a89878') + '" stroke-width="2"');
      s += e(60, 92, 24, 7, o.ridge || '#a89878');
      s += e(60, 50, 6, 4, '#fdfdff', 'opacity=".7"');
    } else if (o.shape === 'star') {
      s += pl([60, 22, 71, 52, 102, 56, 78, 74, 84, 102, 60, 88, 36, 102, 42, 74, 18, 56, 49, 52], body);
      for (var d = 0; d < 5; d++) {
        var a = (d * Math.PI * 2) / 5 - Math.PI / 2;
        s += c(60 + Math.cos(a) * 22, 62 + Math.sin(a) * 22, 2.4, o.mark || '#fbbf24');
      }
    } else if (o.shape === 'urchin') {
      s += c(60, 60, 22, body);
      for (var u = 0; u < 12; u++) {
        var ua = (u * Math.PI) / 6;
        s += ps('M' + (60 + Math.cos(ua) * 20) + ',' + (60 + Math.sin(ua) * 20) + ' L' +
          (60 + Math.cos(ua) * 34) + ',' + (60 + Math.sin(ua) * 34), body, 2.4);
      }
    }
    return s;
  });


  /* ================================================================== *
   * People: plants, body, face, health
   * ================================================================== */

  kind('flower', function (o) {
    var petal = o.petal || '#f472b6';
    var core = o.core || '#fbbf24';
    var s = shadow(102, 22);
    s += ps('M60,58 L60,96', o.stem || '#4a9e4a', 3.4);
    s += p('M60,80 C46,72 40,80 44,86 C48,90 56,88 60,84 Z', o.stem || '#4a9e4a');
    if (o.petalCount === 4) {
      s += e(60, 40, 18, 30, petal) + e(60, 40, 30, 18, petal) +
           e(40, 40, 18, 30, petal) + e(80, 40, 18, 30, petal);
    } else if (o.petalCount === 6) {
      for (var i = 0; i < 6; i++) {
        var a = (i * Math.PI) / 3;
        s += e(60 + Math.cos(a) * 17, 40 + Math.sin(a) * 17, 9, 15, petal,
          'transform="rotate(' + (i * 60) + ' ' + (60 + Math.cos(a) * 17).toFixed(1) + ' ' + (40 + Math.sin(a) * 17).toFixed(1) + ')"');
      }
    } else if (o.petalCount === 'many') {
      for (var j = 0; j < 10; j++) {
        var b = (j * Math.PI) / 5;
        s += e(60 + Math.cos(b) * 18, 40 + Math.sin(b) * 18, 8, 13, petal,
          'transform="rotate(' + (j * 36) + ' ' + (60 + Math.cos(b) * 18).toFixed(1) + ' ' + (40 + Math.sin(b) * 18).toFixed(1) + ')"');
      }
    } else if (o.petalCount === 'spike') {
      for (var k = 0; k < 8; k++) {
        var c2 = (k * Math.PI) / 4;
        s += e(60 + Math.cos(c2) * 16, 40 + Math.sin(c2) * 16, 7, 14, petal,
          'transform="rotate(' + (k * 45) + ' ' + (60 + Math.cos(c2) * 16).toFixed(1) + ' ' + (40 + Math.sin(c2) * 16).toFixed(1) + ')"');
      }
    } else {
      s += e(60, 40, 20, 28, petal) + e(60, 40, 28, 20, petal);
    }
    s += c(60, 40, 9, core) + c(60, 40, 4.4, o.coreDark || '#f59e0b');
    if (o.dots) {
      s += c(52, 34, 1.6, core) + c(68, 44, 1.6, core) + c(60, 50, 1.6, core);
    }
    return s;
  });

  kind('plant', function (o) {
    var s = shadow(102, o.shadow || 30);
    if (o.shape === 'tree') {
      s += rc(54, 62, 12, 34, o.trunk || '#8a5a33', 4);
      s += c(60, 42, o.canopy || 26, o.leaf || '#4a9e4a');
      s += c(40, 52, (o.canopy || 26) * 0.6, o.leaf2 || '#3f8f4a');
      s += c(80, 52, (o.canopy || 26) * 0.6, o.leaf2 || '#3f8f4a');
      s += c(52, 30, (o.canopy || 26) * 0.4, '#ffffff', 'opacity=".14"');
    } else if (o.shape === 'bush') {
      s += F.bush(60, 60, o.size || 30, o.leaf || '#4a9e4a');
    } else if (o.shape === 'cactus') {
      s += box(50, 40, 20, 56, o.body || '#4a9e4a', 10);
      s += box(28, 58, 14, 30, o.body || '#4a9e4a', 7);
      s += box(78, 52, 14, 36, o.body || '#4a9e4a', 7);
      s += c(38, 58, 2, '#ffffff', 'opacity=".3"') + c(44, 50, 2, '#ffffff', 'opacity=".3"');
      s += p('M60,40 C56,32 64,32 60,26 Z', o.flower || '#f472b6');
    } else if (o.shape === 'palm') {
      s += ps('M62,96 C60,74 58,56 54,40', o.trunk || '#8a5a33', 7);
      for (var f = 0; f < 5; f++) {
        var a = -Math.PI / 2 + (f - 2) * 0.6;
        s += p('M54,40 C' + (54 + Math.cos(a) * 30 - 8) + ',' + (40 + Math.sin(a) * 30) + ' ' +
          (54 + Math.cos(a) * 34) + ',' + (40 + Math.sin(a) * 34 + 8) + ' ' + (54 + Math.cos(a) * 30 + 8) + ',' +
          (40 + Math.sin(a) * 30 + 10) + ' Z', o.leaf || '#4a9e4a');
      }
    } else if (o.shape === 'bamboo') {
      for (var b = 0; b < 3; b++) {
        var bx = 40 + b * 20;
        s += rc(bx, 24 + b * 8, 12, 72 - b * 8, o.body || '#7ca844', 5);
        s += ln(bx - 1, 44 + b * 8, bx + 13, 44 + b * 8, '#5c8230', 2);
      }
    } else if (o.shape === 'grass') {
      var blades = o.blades || 7;
      for (var g = 0; g < blades; g++) {
        var gx = blades === 1 ? 60 : 16 + g * (88 / (blades - 1));
        s += ps('M' + gx + ',96 C' + (gx - 8) + ',80 ' + (gx + 6) + ',68 ' + gx + ',54', o.leaf || '#4a9e4a', 3.4);
      }
      s += p('M0,96 L120,96 L120,104 L0,104 Z', o.soil || '#8a6a3a');
    } else if (o.shape === 'vine') {
      s += ps('M20,96 C40,70 30,50 50,34 C70,18 90,30 100,16', o.stem || '#4a9e4a', 4);
      for (var l = 0; l < 4; l++) {
        s += e(34 + l * 20, 40 + (l % 2) * 24, 14, 10, o.leaf || '#4a9e4a',
          'transform="rotate(' + (l % 2 ? 30 : -30) + ' ' + (34 + l * 20) + ' ' + (40 + (l % 2) * 24) + ')"');
      }
    } else if (o.shape === 'seed') {
      s += e(60, 66, 20, 26, o.body || '#8a5a33');
      s += ps('M60,42 C56,32 64,30 60,22', o.stem || '#4a9e4a', 3);
      s += e(70, 58, 6, 10, '#ffffff', 'opacity=".3"');
    } else if (o.shape === 'sprout') {
      s += p('M0,88 L120,88 L120,100 L0,100 Z', o.soil || '#8a6a3a');
      s += ps('M60,88 L60,58', o.stem || '#4a9e4a', 4);
      s += e(44, 52, 18, 12, o.leaf || '#4a9e4a', 'transform="rotate(-24 44 52)"');
      s += e(76, 50, 18, 12, o.leaf || '#4a9e4a', 'transform="rotate(24 76 50)"');
    } else if (o.shape === 'fern') {
      s += ps('M60,100 C58,80 56,60 58,38', o.stem || '#4a9e4a', 3.4);
      for (var fr = 0; fr < 7; fr++) {
        var fy = 92 - fr * 8, fw = 20 - fr * 2;
        s += e(60 - fw / 2, fy, fw, 4, o.leaf || '#3f8f4a', 'transform="rotate(-22 ' + (60 - fw / 2) + ' ' + fy + ')"');
        s += e(60 + fw / 2, fy, fw, 4, o.leaf || '#3f8f4a', 'transform="rotate(22 ' + (60 + fw / 2) + ' ' + fy + ')"');
      }
    } else if (o.shape === 'moss') {
      s += p('M0,92 C20,84 40,96 60,90 C80,84 100,96 120,90 L120,120 L0,120 Z', o.base || '#4a9e4a');
      for (var mo = 0; mo < 22; mo++) {
        var mx = 6 + mo * 5, my = 92 - ((mo * 37) % 26);
        s += c(mx, my, 3 + ((mo * 13) % 3), (mo % 3) ? (o.leaf || '#3f8f4a') : (o.leaf2 || '#5cba5c'));
      }
    } else if (o.shape === 'branch') {
      s += ps('M14,96 C40,80 60,60 104,26', o.bark || '#8a5a33', 7);
      s += ps('M52,68 C48,50 40,42 26,36', o.bark || '#8a5a33', 4);
      s += ps('M68,54 C76,44 88,42 100,44', o.bark || '#8a5a33', 4);
      for (var lf = 0; lf < 5; lf++) {
        var lx = 26 + lf * 17, ly = 92 - lf * 15;
        s += e(lx - 7, ly - 6, 10, 5, o.leaf || '#4a9e4a', 'transform="rotate(-30 ' + (lx - 7) + ' ' + (ly - 6) + ')"');
        s += e(lx + 8, ly - 10, 10, 5, o.leaf || '#4a9e4a', 'transform="rotate(24 ' + (lx + 8) + ' ' + (ly - 10) + ')"');
      }
    } else if (o.shape === 'trunk') {
      s += p('M38,104 C40,70 44,50 48,26 L72,26 C76,50 80,70 82,104 Z',
        o.bark || '#8a5a33', 'stroke="' + (o.shade || '#6b4423') + '" stroke-width="2"');
      for (var bk = 0; bk < 6; bk++) {
        s += ps('M' + (44 + (bk % 2) * 4) + ',' + (36 + bk * 11) + ' q8,' + (3 + bk) + ' 16,0',
          o.shade || '#6b4423', 2, 'opacity=".7"');
      }
      s += p('M0,104 L120,104 L120,112 L0,112 Z', o.soil || '#8a6a3a');
    } else if (o.shape === 'root') {
      s += p('M0,40 L120,40 L120,50 L0,50 Z', o.soil || '#8a6a3a');
      s += ps('M60,50 L60,64 M60,64 C44,70 36,84 30,100 M60,64 C76,70 84,84 90,100',
        o.root || '#f4ead8', 4.4);
      s += ps('M48,72 C40,80 38,90 36,100 M72,72 C80,80 82,90 84,100', o.root || '#f4ead8', 3);
      s += ps('M60,64 L60,92 M56,78 L48,86 M64,80 L72,88', o.hair || '#dccbb0', 2);
      s += c(60, 44, 4, o.stem || '#4a9e4a');
    } else if (o.shape === 'petal') {
      s += e(60, 66, 26, 38, o.petal || '#f472b6', 'transform="rotate(-14 60 66)"');
      s += ps('M52,40 C56,58 56,80 54,98', o.vein || '#f9a8d4', 2.4, 'opacity=".8"');
      s += ps('M60,42 C60,60 60,80 60,98', o.vein || '#f9a8d4', 2.4, 'opacity=".6"');
      s += c(52, 44, 5, o.base || '#fbbf24');
    } else if (o.shape === 'pollen') {
      s += '<g transform="translate(60 40)">';
      for (var pg = 0; pg < 7; pg++) {
        var pa = (pg * Math.PI * 2) / 7;
        s += e(Math.cos(pa) * 24, Math.sin(pa) * 24, 9, 6, o.grain || '#fde047', 'transform="rotate(' +
          ((pg * 360) / 7).toFixed(0) + ' ' + Math.cos(pa).toFixed(1) * 24 + ' ' + Math.sin(pa).toFixed(1) * 24 + ')"');
      }
      s += c(0, 0, 11, o.grain || '#fde047') + c(0, 0, 5, o.core || '#f59e0b');
      s += '</g>';
      s += ps('M60,52 L60,104', o.stalk || '#4a9e4a', 3);
    } else if (o.shape === 'clover') {
      for (var cl = 0; cl < 4; cl++) {
        var ca = (cl * Math.PI) / 2 - Math.PI / 2;
        s += e(60 + Math.cos(ca) * 16, 54 + Math.sin(ca) * 16, 15, 15, o.leaf || '#4ade80',
          'transform="rotate(' + (cl * 90) + ' ' + (60 + Math.cos(ca) * 16).toFixed(1) + ' ' +
          (54 + Math.sin(ca) * 16).toFixed(1) + ')"');
      }
      s += ps('M60,70 L60,104', o.stem || '#4a9e4a', 3.4);
    } else if (o.shape === 'hay') {
      s += p('M20,104 C20,80 34,66 60,66 C86,66 100,80 100,104 Z', o.bale || '#fbbf24',
        'stroke="' + (o.shade || '#b45309') + '" stroke-width="2"');
      for (var hy = 0; hy < 6; hy++) {
        s += ps('M' + (28 + hy * 12) + ',102 C' + (30 + hy * 12) + ',86 ' + (32 + hy * 12) + ',74 ' + (30 + hy * 12) + ',70',
          o.shade || '#b45309', 1.8, 'opacity=".7"');
      }
      s += ps('M60,66 C60,50 64,44 62,32', o.stalk || '#a16207', 3);
    } else if (o.shape === 'herb') {
      s += ps('M60,100 L60,50', o.stem || '#4a9e4a', 3.4);
      for (var hb = 0; hb < 3; hb++) {
        var hy2 = 56 + hb * 14, hw = 22 - hb * 4;
        s += e(60 - hw / 2, hy2, hw, 7, o.leaf || '#3f8f4a', 'transform="rotate(-26 ' + (60 - hw / 2) + ' ' + hy2 + ')"');
        s += e(60 + hw / 2, hy2, hw, 7, o.leaf || '#3f8f4a', 'transform="rotate(26 ' + (60 + hw / 2) + ' ' + hy2 + ')"');
      }
      s += c(60, 44, 5, o.flower || '#f472b6');
    } else if (o.shape === 'weed') {
      s += ps('M40,104 C38,80 42,60 50,44 M64,104 C66,78 70,60 78,46 M86,104 C88,86 92,72 98,62',
        o.leaf || '#65a30d', 3.4);
      s += e(34, 56, 13, 6, o.leaf || '#65a30d', 'transform="rotate(-30 34 56)"');
      s += e(84, 60, 13, 6, o.leaf || '#65a30d', 'transform="rotate(28 84 60)"');
      s += p('M0,104 L120,104 L120,112 L0,112 Z', o.soil || '#8a6a3a');
    }
    if (o.fruit) s += o.fruit;
    return s;
  });

  /** A body part on its own, drawn as a simple limb or organ. */
  kind('bodyPart', function (o) {
    var skin = o.skin || SKIN;
    var s = shadow(102, 26);
    if (o.shape === 'hand') {
      s += rc(46, 46, 28, 44, skin, 12);
      s += rc(40, 16, 10, 34, skin, 5) + rc(52, 10, 10, 40, skin, 5) +
           rc(64, 12, 10, 38, skin, 5) + rc(76, 20, 10, 30, skin, 5);
      s += rc(38, 44, 12, 22, skin, 6, 'transform="rotate(-24 44 55)"');
      s += e(62, 30, 5, 10, '#e8b48a');
    } else if (o.shape === 'foot') {
      s += p('M42,30 C56,26 66,40 66,56 L66,80 C66,92 54,98 44,92 C34,86 30,72 30,58 C30,44 34,34 42,30 Z', skin);
      for (var t = 0; t < 5; t++) {
        s += e(38 + t * 11, 34, 8, 12, skin);
      }
      s += e(48, 80, 10, 5, '#e8b48a');
    } else if (o.shape === 'eye') {
      s += p('M14,58 C30,32 90,32 106,58 C90,84 30,84 14,58 Z', '#fdfdff', 'stroke="#64748b" stroke-width="3"');
      s += c(60, 58, 20, o.iris || '#5b8ed6') + c(60, 58, 9, NIGHT);
      s += c(50, 48, 5, '#ffffff', 'opacity=".9"');
      s += ps('M30,36 C46,28 74,28 90,36', NIGHT, 3);
    } else if (o.shape === 'ear') {
      s += p('M60,18 C86,18 92,44 84,64 C78,80 68,86 62,96 C56,104 44,96 48,86 C52,74 44,64 44,50 C44,32 50,18 60,18 Z',
        skin, 'stroke="#dda57e" stroke-width="2"');
      s += ps('M60,34 C74,34 76,50 68,64', '#dda57e', 3);
    } else if (o.shape === 'mouth') {
      s += p('M18,52 C40,34 80,34 102,52 C80,80 40,80 18,52 Z', '#7f1d1d');
      s += p('M24,52 C44,42 76,42 96,52 C76,66 44,66 24,52 Z', '#fecaca');
      s += p('M34,78 C50,92 70,92 86,78 C70,80 50,80 34,78 Z', '#f472b6', 'opacity=".7"');
    } else if (o.shape === 'organ') {
      s += p(o.path, o.body || '#e8707a', o.stroke || 'stroke="#c8545f" stroke-width="2"');
      if (o.mark) s += o.mark;
    } else if (o.shape === 'gums') {
      s += p('M18,44 C18,34 102,34 102,44 L102,64 C102,76 84,82 60,82 C36,82 18,76 18,64 Z',
        o.gum || '#e57a7a', 'stroke="#c8545f" stroke-width="2"');
      for (var gt = 0; gt < 5; gt++) {
        s += p('M' + (26 + gt * 15) + ',46 C' + (30 + gt * 15) + ',40 ' + (34 + gt * 15) + ',40 ' +
          (37 + gt * 15) + ',46 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="1.4"');
      }
    } else if (o.shape === 'torso') {
      /* chest, belly and hip differ by outline alone, which is the point */
      if (o.mass === 'chest') {
        s += p('M24,40 C24,26 96,26 96,40 C96,58 84,72 60,72 C36,72 24,58 24,40 Z', skin,
          'stroke="' + SKIN_D + '" stroke-width="2"');
        s += ps('M34,44 C40,58 48,64 56,66 M86,44 C80,58 72,64 64,66', '#e8b48a', 2.4);
      } else if (o.mass === 'belly') {
        s += e(60, 58, 38, 30, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
        s += c(60, 58, 5, '#e8b48a');
      } else {
        s += p('M28,34 C28,24 92,24 92,34 L92,58 C92,72 78,78 60,78 C42,78 28,72 28,58 Z', skin,
          'stroke="' + SKIN_D + '" stroke-width="2"');
        s += ps('M60,34 L60,66', '#e8b48a', 2.4);
      }
    } else if (o.shape === 'bone') {
      s += '<g transform="rotate(-20 60 60)">' +
        rc(48, 52, 24, 16, '#f4ead8', 6, 'stroke="#dccbb0" stroke-width="2"') +
        c(46, 54, 9, '#fdf6ea', 'stroke="#dccbb0" stroke-width="2"') + c(46, 66, 9, '#fdf6ea', 'stroke="#dccbb0" stroke-width="2"') +
        c(74, 54, 9, '#fdf6ea', 'stroke="#dccbb0" stroke-width="2"') + c(74, 66, 9, '#fdf6ea', 'stroke="#dccbb0" stroke-width="2"') +
        '</g>';
    } else {
      s += rc(44, 30, 32, 66, skin, 14);
      s += e(60, 40, 8, 22, '#e8b48a');
    }
    return s;
  });

  /** A face: the same head with a different expression, which is the point. */
  /**
   * The head template behind the `face` and `feeling` kinds.
   *
   * Both kinds want the same head; the only difference is how much of the card
   * it takes up. Keeping the drawing in one place is what stops the face cards
   * and the feeling cards from drifting apart as they are edited.
   */
  function faceArt(o) {
    var skin = o.skin || SKIN;
    /* A profile is half a face, so it cannot be an option on a full one. */
    if (o.profile) {
      var pr = c(58, 58, 36, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      pr += p('M92,50 C104,52 106,60 100,66 C96,70 92,70 90,70', skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      pr += p('M86,64 C94,64 98,70 94,76 C90,80 84,78 84,72 Z', skin, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      pr += p('M42,44 C44,22 76,20 84,38 C88,46 86,50 82,48 C74,40 56,40 48,50 Z', o.hair || '#3a2f2a');
      pr += c(74, 50, 3, NIGHT);
      pr += ps('M74,50 q6,3 10,0', NIGHT, 1.6);
      pr += ps('M86,72 q7,3 11,1', '#a3506a', 2.2);
      pr += e(72, 66, 8, 5, '#f9a8a8', 'opacity=".5"');
      pr += e(38, 62, 8, 11, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      return pr;
    }
    var s = c(60, 56, 40, skin);
    s += e(60, 34, 34, 18, o.hair || '#3a2f2a');
    if (o.longhair) s += e(26, 58, 10, 34, o.hair || '#6b4423') + e(94, 58, 10, 34, o.hair || '#6b4423');
    s += e(20, 56, 9, 11, skin) + e(100, 56, 9, 11, skin);
    /* eyes */
    var ey = o.eyeY || 52;
    if (o.eyes === 'closed') s += ps('M42,52 q8,7 16,0 M62,52 q8,7 16,0', NIGHT, 2.6);
    else if (o.eyes === 'wide') s += c(50, ey, 8, '#ffffff', 'stroke="#64748b" stroke-width="2"') + c(70, ey, 8, '#ffffff', 'stroke="#64748b" stroke-width="2"') +
           c(50, ey, 4, NIGHT) + c(70, ey, 4, NIGHT);
    else if (o.eyes === 'squint') s += ps('M42,54 q8,-4 16,0 M62,54 q8,-4 16,0', NIGHT, 2.6);
    else { s += c(50, ey, 3.4, NIGHT) + c(70, ey, 3.4, NIGHT); }
    /* brows */
    if (o.brows === 'sad') s += ps('M40,42 L58,48 M80,42 L62,48', '#3a2f2a', 3);
    else if (o.brows === 'angry') s += ps('M40,44 L58,38 M80,44 L62,38', '#3a2f2a', 3.4);
    else if (o.brows === 'raised') s += ps('M42,38 L58,34 M78,38 L62,34', '#3a2f2a', 3);
    /* nose */
    s += ps('M60,54 L58,66 L64,66', '#dda57e', 2.4);
    /* mouth */
    if (o.mouth === 'smile') s += ps('M44,74 Q60,88 76,74', '#a3506a', 3);
    else if (o.mouth === 'grin') s += p('M42,70 C50,88 70,88 78,70 Z', '#7f1d1d') + p('M50,78 Q60,84 70,78 Z', '#fecaca');
    else if (o.mouth === 'frown') s += ps('M44,80 Q60,68 76,80', '#a3506a', 3);
    else if (o.mouth === 'open') s += e(60, 76, 10, 12, '#7f1d1d');
    else if (o.mouth === 'line') s += ln(46, 76, 74, 76, '#a3506a', 3);
    if (o.eyes === 'wink') {
      s += ps('M42,52 q8,7 16,0', NIGHT, 2.6);
      s += c(70, 52, 4, '#fdfdff', 'stroke="#64748b" stroke-width="2"') + c(70, 52, 2, NIGHT);
    }
    if (o.blush) s += e(38, 66, 9, 5, '#f9a8a8', 'opacity=".7"') + e(82, 66, 9, 5, '#f9a8a8', 'opacity=".7"');
    if (o.freckles) s += c(38, 64, 1.8, '#c07a52') + c(46, 68, 1.8, '#c07a52') + c(74, 68, 1.8, '#c07a52') + c(82, 64, 1.8, '#c07a52');
    if (o.dimple) s += ps('M40,74 q-4,5 1,7 M80,74 q4,5 -1,7', '#a3506a', 2);
    if (o.lines) {
      s += ps('M30,44 q6,-3 12,0 M78,44 q6,-3 12,0 M34,64 q6,-3 12,0 M74,64 q6,-3 12,0', '#dda57e', 2);
      s += ps('M44,80 C50,84 70,84 76,80', '#dda57e', 2);
    }
    if (o.sideburns) s += box(22, 48, 7, 22, o.sideburnColor || '#3a2f2a', 3) + box(91, 48, 7, 22, o.sideburnColor || '#3a2f2a', 3);
    if (o.beard) s += p('M36,68 C40,92 80,92 84,68 C74,78 46,78 36,68 Z', o.beard);
    if (o.moustache) s += p('M40,70 C48,64 56,70 60,72 C64,70 72,64 80,70 C72,76 48,76 40,70 Z', o.moustache);
    return s;
  }

  kind('face', function (o) { return faceArt(o); });

  /** Medical kit: the shape carries the meaning, so one drawing does a lot. */
  kind('medical', function (o) {
    var s = shadow(102, o.shadow || 30);
    if (o.shape === 'bottle') {
      s += rc(48, 22, 24, 12, o.cap || '#94a3b8', 3);
      s += p('M40,34 C40,40 36,44 36,52 L36,94 C36,97 40,98 44,98 L76,98 C80,98 84,97 84,94 L84,52 C84,44 80,40 80,34 Z',
        o.glass || '#e2e8f0', 'opacity=".7"');
      s += p('M40,58 L80,58 L80,92 C80,95 78,95 76,95 L44,95 C42,95 40,95 40,92 Z', o.liquid || '#ef4444');
      s += box(44, 50, 32, 20, o.label || '#fdfdff', 2);
      s += box(54, 54, 12, 4, o.markColor || '#dc2626') + box(58, 50, 4, 12, o.markColor || '#dc2626');
    } else if (o.shape === 'pill') {
      s += '<g transform="rotate(-24 60 60)">' +
        rc(30, 44, 40, 32, o.a || '#fdfdff', 16, 'stroke="#cbd5e1" stroke-width="2"') +
        ps('M50,44 L50,76', '#cbd5e1', 2) +
        p('M50,44 C62,44 70,52 70,60 C70,68 62,76 50,76 Z', o.b || '#4f46e5') +
        '</g>';
    } else if (o.shape === 'syringe') {
      s += '<g transform="rotate(-30 60 60)">' +
        box(28, 50, 44, 20, '#e2e8f0', 3, 'stroke="#94a3b8" stroke-width="2"') +
        box(34, 54, 16, 12, o.liquid || '#38bdf8', 2) +
        rc(72, 52, 20, 6, '#cbd5e1', 2) + ln(92, 55, 108, 55, '#94a3b8', 2) +
        rc(20, 48, 8, 24, '#94a3b8', 3) +
        '</g>';
    } else if (o.shape === 'bandage') {
      s += '<g transform="rotate(-24 60 60)">' +
        box(26, 44, 68, 32, o.color || '#fde68a', 8, 'stroke="#d97706" stroke-width="2"') +
        box(44, 44, 32, 32, o.pad || '#fdf6e8', 4, 'opacity=".8"') +
        '</g>';
    } else if (o.shape === 'cross') {
      s += box(24, 30, 72, 66, o.bg || '#fdfdff', 8, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(52, 40, 16, 46, o.markColor || '#dc2626') + box(37, 55, 46, 16, o.markColor || '#dc2626');
    } else if (o.shape === 'crutch') {
      s += ps('M52,26 C52,50 52,64 46,98', '#c98a4b', 5);
      s += box(38, 20, 44, 10, '#8a5a33', 4);
      s += ps('M52,60 C66,64 74,78 70,94', '#c98a4b', 4);
    } else if (o.shape === 'wheelchair') {
      s += c(44, 74, 22, 'none', 'stroke="#334155" stroke-width="5"');
      s += c(84, 84, 10, 'none', 'stroke="#334155" stroke-width="4"');
      s += box(46, 40, 22, 20, o.seat || '#2563eb', 3);
      s += ps('M46,46 L34,64 M60,46 L52,30', '#334155', 3.4);
      s += c(44, 26, 9, SKIN);
      s += ps('M56,40 C68,40 76,44 82,50', '#334155', 3);
    } else if (o.shape === 'stethoscope') {
      s += ps('M40,22 C40,52 80,52 80,22', '#334155', 4.4);
      s += e(40, 22, 7, 7, '#334155') + e(80, 22, 7, 7, '#334155');
      s += ps('M80,50 C80,78 66,86 62,96', '#334155', 4);
      s += c(60, 98, 9, '#cbd5e1', 'stroke="#64748b" stroke-width="2"');
    } else if (o.shape === 'mask') {
      s += p('M18,46 C18,40 30,36 60,36 C90,36 102,40 102,46 L102,72 C102,86 84,94 60,94 C36,94 18,86 18,72 Z',
        o.color || '#7dd3fc', 'stroke="#38bdf8" stroke-width="2"');
      s += ps('M24,58 L96,58 M24,72 L96,72', '#e0f2fe', 2.4);
      s += ps('M18,50 L6,44 M102,50 L114,44', '#94a3b8', 2);
    } else if (o.shape === 'kit') {
      s += box(20, 44, 80, 50, o.bg || '#fdfdff', 8, 'stroke="#94a3b8" stroke-width="2"');
      s += box(20, 44, 80, 16, o.lid || '#e2e8f0', 6, 'stroke="#94a3b8" stroke-width="2"');
      s += box(52, 38, 16, 8, '#64748b', 3);
      s += box(54, 64, 12, 22, o.markColor || '#dc2626') + box(46, 70, 28, 10, o.markColor || '#dc2626');
    } else if (o.shape === 'vials') {
      /* a blood test or a virus under a microscope, read as a rack of tubes */
      s += box(24, 74, 72, 12, o.rack || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="2"');
      for (var vt = 0; vt < 3; vt++) {
        var vx = 32 + vt * 24;
        s += rc(vx, 34, 16, 44, '#e2e8f0', 6, 'stroke="#94a3b8" stroke-width="2"');
        s += rc(vx + 2, 56 + vt * 2, 12, 22, o.liquid || '#dc2626', 4);
        s += rc(vx, 28, 16, 8, o.cap || '#64748b', 3);
      }
    } else if (o.shape === 'vitals') {
      /* pulse, heartbeat, blood pressure: a trace on a screen */
      s += box(16, 34, 88, 52, '#1f2937', 8);
      s += box(22, 40, 76, 40, o.screen || '#0f2e2a', 4);
      s += ps('M24,66 L44,66 L50,50 L58,84 L64,58 L70,66 L96,66', o.trace || '#4ade80', 3);
      s += c(50, 60, 5, o.trace || '#4ade80', 'opacity=".35"');
    } else if (o.shape === 'clinic') {
      s += box(12, 40, 96, 60, o.wall || '#f1f5f9', 8, 'stroke="#94a3b8" stroke-width="2"');
      s += box(12, 40, 96, 14, o.roof || '#cbd5e1', 6);
      s += box(26, 62, 26, 38, o.door || '#bae6fd', 4, 'stroke="#94a3b8" stroke-width="1.6"');
      s += box(58, 46, 12, 34, o.markColor || '#dc2626');
      s += box(48, 58, 32, 10, o.markColor || '#dc2626');
      s += rc(46, 32, 28, 10, '#94a3b8', 4);
    } else if (o.shape === 'sachet') {
      s += p('M28,36 L92,36 L92,90 C92,94 88,96 84,96 L36,96 C32,96 28,94 28,90 Z',
        o.paper || '#fdfdff', 'stroke="' + (o.edge || '#cbd5e1') + '" stroke-width="2"');
      s += ps('M28,44 L92,44', o.edge || '#cbd5e1', 1.6, 'stroke-dasharray="3 3"');
      s += box(38, 54, 44, 30, o.band || '#7dd3fc', 3);
      s += c(60, 69, 8, o.markColor || '#0ea5e9', 'opacity=".8"');
    } else if (o.shape === 'xray') {
      s += box(22, 20, 76, 84, '#0f172a', 6, 'stroke="#475569" stroke-width="2"');
      s += e(60, 40, 11, 13, '#e2e8f0', 'opacity=".9"');
      s += rc(56, 50, 8, 44, '#e2e8f0', 4, 'opacity=".9"');
      for (var xb = 0; xb < 4; xb++) {
        s += ps('M' + (38 + xb * 11) + ',56 l6,10 M' + (44 + xb * 11) + ',56 l-6,10', '#e2e8f0', 3, 'opacity=".75"');
        s += ps('M' + (38 + xb * 11) + ',76 l6,10 M' + (44 + xb * 11) + ',76 l-6,10', '#e2e8f0', 3, 'opacity=".75"');
      }
      s += c(44, 34, 5, '#e2e8f0', 'opacity=".7"') + c(76, 34, 5, '#e2e8f0', 'opacity=".7"');
    } else if (o.shape === 'bed') {
      s += box(14, 58, 92, 10, o.frame || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="2"');
      s += box(14, 68, 10, 26, o.frame || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="2"');
      s += box(96, 52, 10, 42, o.frame || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="2"');
      s += box(20, 52, 34, 8, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="1.6"');
      s += p('M48,58 C48,50 60,50 60,58 C60,52 72,52 72,58 L72,64 L48,64 Z', o.blanket || '#93c5fd');
      s += c(88, 44, 8, o.skin || SKIN, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += ps('M54,54 C58,50 64,50 68,54', o.blanket || '#93c5fd', 3);
      s += c(86, 43, 1.6, NIGHT);
    } else if (o.shape === 'chairs') {
      for (var ch = 0; ch < 3; ch++) {
        var chx = 16 + ch * 34;
        s += box(chx, 56, 26, 8, o.seat || '#94a3b8', 3);
        s += box(chx, 40, 8, 18, o.seat || '#94a3b8', 3);
        s += ps('M' + (chx + 4) + ',64 v18 M' + (chx + 22) + ',64 v18', '#64748b', 2.4);
      }
      s += box(10, 88, 100, 6, o.floor || '#cbd5e1', 2);
    } else if (o.shape === 'bell') {
      s += p('M32,80 C32,48 88,48 88,80 Z', o.bell || '#f87171', 'stroke="' + (o.edge || '#dc2626') + '" stroke-width="2"');
      s += box(28, 80, 64, 8, o.edge || '#dc2626', 3);
      s += c(60, 94, 7, o.edge || '#dc2626');
      s += rc(56, 38, 8, 12, o.edge || '#dc2626', 3);
      for (var bl = 0; bl < 2; bl++) {
        s += ps('M22,' + (58 + bl * 14) + ' q-8,6 0,12 M98,' + (58 + bl * 14) + ' q8,6 0,12', o.edge || '#dc2626', 2.4);
      }
    } else if (o.shape === 'microbe') {
      s += c(60, 60, 22, o.body || '#84cc16', 'opacity=".85"');
      for (var mb = 0; mb < 10; mb++) {
        var ma = (mb * Math.PI) / 5;
        var mx = 60 + Math.cos(ma) * 22, my = 60 + Math.sin(ma) * 22;
        s += ps('M' + mx.toFixed(1) + ',' + my.toFixed(1) + ' l' + (Math.cos(ma) * 12).toFixed(1) + ',' +
          (Math.sin(ma) * 12).toFixed(1), o.spike || '#4d7c0f', 3);
        s += c(mx + Math.cos(ma) * 13, my + Math.sin(ma) * 13, 3, o.spike || '#4d7c0f');
      }
      s += c(52, 56, 4, '#ffffff', 'opacity=".35"') + c(68, 66, 3, '#ffffff', 'opacity=".3"');
    } else if (o.shape === 'card') {
      /* insurance, appointment card, membership: the rectangle does the work */
      s += '<g transform="rotate(-10 60 62)">';
      s += box(16, 40, 88, 46, o.card || '#fdfdff', 6, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(16, 40, 88, 14, o.band || '#0ea5e9', 6);
      s += box(26, 62, 34, 5, '#cbd5e1', 2) + box(26, 72, 22, 5, '#cbd5e1', 2);
      s += box(70, 62, 24, 20, o.band || '#0ea5e9', 3, 'opacity=".8"');
      s += '</g>';
    }
    return s;
  });

  /**
   * A symptom: the same body every time, with one mark on it.
   *
   * Twenty words in the health category are "something is wrong with a named
   * part of a person". Drawing twenty separate bodies would not help anyone
   * read them; drawing one body and moving a mark does, because the position
   * of the mark is exactly the new information in the word.
   */
  kind('symptom', function (o) {
    var skin = o.skin || SKIN;
    var s = shadow(102, 26, 0.08);
    var marks = o.marks || {};
    if (!o.bare) {
      s += c(60, 24, 13, skin, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += rc(52, 34, 16, 10, SKIN_D, 4);
      s += p('M40,44 C40,40 44,38 48,38 L72,38 C76,38 80,40 80,44 L82,78 C82,82 78,84 74,84 L46,84 C42,84 38,82 38,78 Z',
        skin, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += rc(26, 44, 11, 30, skin, 5, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += rc(83, 44, 11, 30, skin, 5, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += rc(44, 82, 12, 18, skin, 5, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += rc(64, 82, 12, 18, skin, 5, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += c(55, 22, 1.8, NIGHT) + c(65, 22, 1.8, NIGHT);
    }
    var red = o.color || '#dc2626';
    var marks2 = {
      bolt: function (x, y) {
        return pl([x + 3, y - 11, x - 8, y + 2, x - 1, y + 2, x - 3, y + 12, x + 8, y - 2, x + 1, y - 2], red);
      },
      bruise: function (x, y) {
        return c(x, y, 12, red, 'opacity=".75"') + c(x - 6, y - 5, 6, '#7c3aed', 'opacity=".6"') +
          c(x + 6, y + 4, 5, '#1d4ed8', 'opacity=".5"');
      },
      scratch: function (x, y) {
        return ps('M' + (x - 10) + ',' + (y + 8) + ' L' + (x + 8) + ',' + (y - 8), red, 3) +
          ps('M' + (x - 4) + ',' + (y + 10) + ' L' + (x + 12) + ',' + (y - 4), red, 2.4);
      },
      cut: function (x, y) {
        return ps('M' + (x - 9) + ',' + (y - 4) + ' L' + (x + 8) + ',' + (y + 4), red, 3.4);
      },
      burn: function (x, y) {
        return p('M' + x + ',' + (y - 13) + ' C' + (x + 9) + ',' + (y - 2) + ' ' + (x + 7) + ',' + (y + 11) + ' ' + x + ',' + (y + 11) +
          ' C' + (x - 7) + ',' + (y + 11) + ' ' + (x - 9) + ',' + (y - 2) + ' ' + x + ',' + (y - 13) + ' Z', red);
      },
      rash: function (x, y) {
        var m = '';
        for (var rd = 0; rd < 7; rd++) {
          m += c(x - 11 + rd * 4, y - 6 + (rd % 3) * 6, 2.6, red);
        }
        return m;
      },
      puff: function (x, y) {
        return c(x, y, 13, red, 'opacity=".35"') + c(x, y, 8, red, 'opacity=".4"');
      },
      swirl: function (x, y) {
        return ps('M' + x + ',' + y + ' a7,7 0 1 1 7,7 a5,5 0 1 1 -5,5 a3.4,3.4 0 1 1 3.4,-3.4',
          red, 2.8);
      },
      zzz: function (x, y) {
        return ps('M' + (x - 8) + ',' + (y - 8) + ' h9 l-9,9 h9', red, 2.6) +
          ps('M' + (x - 2) + ',' + (y + 2) + ' h7 l-7,7 h7', red, 2.2);
      },
      drop: function (x, y) {
        return p('M' + x + ',' + (y - 11) + ' C' + (x + 8) + ',' + (y - 1) + ' ' + (x + 7) + ',' + (y + 9) + ' ' + x + ',' + (y + 9) +
          ' C' + (x - 7) + ',' + (y + 9) + ' ' + (x - 8) + ',' + (y - 1) + ' ' + x + ',' + (y - 11) + ' Z', red);
      },
      flake: function (x, y) {
        var fl = '';
        for (var fd = 0; fd < 3; fd++) {
          var fa = (fd * Math.PI * 2) / 3;
          fl += ps('M' + (x + Math.cos(fa) * 12).toFixed(1) + ',' + (y + Math.sin(fa) * 12).toFixed(1) + ' l' +
            (Math.cos(fa) * 12).toFixed(1) + ',' + (Math.sin(fa) * 12).toFixed(1), red, 2.2);
        }
        return fl;
      },
      puffout: function (x, y) {
        return ps('M' + (x - 10) + ',' + y + ' q5,-9 10,0 q5,9 10,0', red, 2.6) +
          c(x, y + 8, 2.4, red) + c(x + 13, y + 8, 2, red) + c(x - 13, y + 8, 2, red);
      },
      up: function (x, y) {
        return ps('M' + x + ',' + (y + 10) + ' L' + x + ',' + (y - 6) + ' M' + x + ',' + (y - 10) +
          ' l-6,7 M' + x + ',' + (y - 10) + ' l6,7', red, 3.4);
      },
      germ: function (x, y) {
        return c(x, y, 9, red, 'opacity=".8"') + c(x - 12, y + 8, 3, red, 'opacity=".7"') +
          c(x + 12, y - 6, 3.4, red, 'opacity=".7"');
      }
    };
    var at = o.at || 'chest';
    var pos = {
      head: [60, 24], eye: [55, 24], throat: [60, 42], chest: [60, 58],
      belly: [60, 74], back: [76, 60], arm: [31, 58], hand: [31, 74],
      leg: [50, 92], foot: [50, 100], whole: [60, 58]
    }[at] || [60, 58];
    var glyph = marks[o.mark] || marks2[o.mark];
    if (glyph) s += glyph(pos[0], pos[1], marks);
    return s;
  });

  /**
   * A feeling: a face, a tint, and a badge with a symbol on it.
   *
   * The expression alone is not enough to tell thirty-seven feelings apart —
   * that is the same mistake as six identical white cups. The badge is what
   * makes each card individually recognisable at a glance.
   */
  kind('feeling', function (o) {
    var s = c(60, 62, 40, o.tint || '#fdf2f8') +
      c(60, 62, 32, o.face || SKIN) +
      '<g transform="translate(13 17) scale(0.78)">' +
      faceArt({ skin: o.face || SKIN, mouth: o.mouth, eyes: o.eyes, brows: o.brows,
                blush: o.blush, eyeY: 58 }) + '</g>';
    if (o.badge !== false) {
      var bx = 88, by = 92, badge = o.badgeColor || o.tint || '#e0f2fe';
      s += c(bx, by, 19, badge, 'stroke="#ffffff" stroke-width="3"');
      var g = BADGE[o.symbol] || BADGE.dot;
      s += g(bx, by, o.symbolColor || '#334155');
    }
    if (o.icon) s += o.icon;
    return s;
  });

  /* The symbol inside a feeling's badge. One shape per noun, reused widely. */
  var BADGE = {
    dot: function (x, y) { return c(x, y, 5, '#334155'); },
    heart: function (x, y) {
      return c(x - 5, y - 3, 6, '#e0457f') + c(x + 5, y - 3, 6, '#e0457f') + c(x, y + 5, 6, '#e0457f');
    },
    bolt: function (x, y) {
      return pl([x + 3, y - 10, x - 7, y + 1, x - 1, y + 1, x - 3, y + 10, x + 7, y - 1, x + 1, y - 1], '#f59e0b');
    },
    drop: function (x, y) {
      return p('M' + x + ',' + (y - 10) + ' C' + (x + 8) + ',' + (y - 1) + ' ' + (x + 7) + ',' + (y + 8) + ' ' + x + ',' + (y + 8) +
        ' C' + (x - 7) + ',' + (y + 8) + ' ' + (x - 8) + ',' + (y - 1) + ' ' + x + ',' + (y - 10) + ' Z', '#38bdf8');
    },
    clock: function (x, y) {
      return c(x, y, 9, 'none', 'stroke="#334155" stroke-width="2.4"') +
        ps('M' + x + ',' + (y - 5) + ' V' + y + ' h4', '#334155', 2.4);
    },
    star: function (x, y) {
      return pl([x, y - 10, x + 3, y - 3, x + 10, y - 2, x + 5, y + 3, x + 6, y + 10, x, y + 6,
        x - 6, y + 10, x - 5, y + 3, x - 10, y - 2, x - 3, y - 3], '#fbbf24');
    },
    eye: function (x, y) {
      return p('M' + (x - 10) + ',' + y + ' q10,-9 20,0 q-10,9 -20,0 Z', '#0ea5e9') + c(x, y, 3, '#1f2937');
    },
    smiley: function (x, y) {
      return c(x, y, 9, '#fbbf24') + ps('M' + (x - 4) + ',' + (y + 2) + ' q4,4 8,0', '#92400e', 1.8);
    },
    cross: function (x, y) {
      return box(x - 2.5, y - 9, 5, 18, '#dc2626') + box(x - 9, y - 2.5, 18, 5, '#dc2626');
    },
    check: function (x, y) { return ps('M' + (x - 7) + ',' + y + ' l5,6 l10,-12', '#16a34a', 3.4); },
    bulb: function (x, y) {
      return c(x, y - 4, 7, '#fde047') + box(x - 4, y + 3, 8, 6, '#94a3b8', 2);
    },
    key: function (x, y) {
      return c(x - 5, y, 5, 'none', 'stroke="#334155" stroke-width="2.6"') +
        ps('M0,0', '#334155', 0) + ps('M' + x + ',' + y + ' h12 M' + (x + 8) + ',' + y + ' v5', '#334155', 2.6);
    },
    chart: function (x, y) {
      return box(x - 9, y - 2, 4, 11, '#94a3b8', 1.4) + box(x - 2, y - 8, 4, 17, '#0ea5e9', 1.4) +
        box(x + 5, y - 5, 4, 14, '#94a3b8', 1.4);
    },
    question: function (x, y) {
      return ps('M' + (x - 4) + ',' + (y - 4) + ' a4,4 0 1 1 5,4 v3', '#334155', 2.6) + c(x + 1, y + 7, 1.8, '#334155');
    },
    arrow: function (x, y) { return ps('M' + (x - 8) + ',' + (y + 6) + ' L' + (x + 7) + ',' + (y - 6), '#334155', 3) +
      pl([x + 9, y - 8, x + 2, y - 5, x + 6, y - 1], '#334155'); },
    shield: function (x, y) {
      return p('M' + x + ',' + (y - 10) + ' L' + (x + 8) + ',' + (y - 6) + ' L' + (x + 7) + ',' + (y + 4) + ' ' +
        x + ',' + (y + 10) + ' L' + (x - 7) + ',' + (y + 4) + ' L' + (x - 8) + ',' + (y - 6) + ' Z', '#0ea5e9');
    },
    hand: function (x, y) {
      return box(x - 7, y - 2, 14, 11, '#fbbf24', 3) + box(x - 6, y - 9, 3, 8, '#fbbf24', 1.4) +
        box(x - 1, y - 10, 3, 9, '#fbbf24', 1.4) + box(x + 4, y - 8, 3, 7, '#fbbf24', 1.4);
    },
    hourglass: function (x, y) {
      return pl([x - 8, y - 9, x + 8, y - 9, x + 2, y, x + 8, y + 9, x - 8, y + 9, x - 2, y], '#f59e0b');
    },
    target: function (x, y) {
      return c(x, y, 9, 'none', 'stroke="#dc2626" stroke-width="2.4"') +
        c(x, y, 5, 'none', 'stroke="#dc2626" stroke-width="2.4"') + c(x, y, 1.8, '#dc2626');
    },
    book: function (x, y) {
      return box(x - 9, y - 8, 18, 16, '#8b5cf6', 2) + ps('M' + x + ',' + (y - 8) + ' v16', '#4c1d95', 1.6);
    }
  };


  /* ================================================================== *
   * People: the long tail, expressed as a handful of extended kinds
   *
   * A vocabulary deck only works if related words *look* related, so the
   * batches below reuse the kinds already there and add shapes to them
   * rather than inventing a kind per word. Nine more kinds cover 160 words.
   * ================================================================== */

  /** Creepers and crawlers that are not a bee with legs. */
  kind('bug', function (o) {
    var body = o.body || '#4a9e4a';
    var s = shadow(102, o.wide || 34, 0.08);
    if (o.shape === 'larva') {
      /* caterpillar / worm: a chain of shrinking segments */
      var n = o.segments || 8;
      var ledge = o.edge ? 'stroke="' + o.edge + '" stroke-width="1.6"' : '';
      for (var i = n - 1; i >= 0; i--) {
        var x = 26 + i * 9, y = 78 - Math.sin((i / (n - 1)) * Math.PI) * 22;
        s += c(x, y, 9 - i * 0.4, i % 2 ? body : (o.alt || body), ledge);
      }
      if (o.eyes !== false) s += c(30, 74, 3.4, NIGHT) + c(36, 74, 3.4, NIGHT);
      if (o.hair) {
        for (var h = 0; h < 4; h++) {
          s += ps('M' + (44 + h * 10) + ',' + (70 - h * 3) + ' l-3,-9', o.hair, 1.6);
        }
      }
    } else if (o.shape === 'slug') {
      s += p('M20,88 C20,64 44,52 68,58 C92,64 100,84 84,90 C60,98 20,98 20,88 Z',
        body, 'stroke="' + (o.ridge || '#94a3b8') + '" stroke-width="2"');
      s += ps('M34,58 C28,40 40,30 52,32', body, 5);
      s += ps('M50,56 C48,36 60,28 70,32', body, 5);
      s += c(32, 50, 2.4, NIGHT) + c(38, 48, 2.4, NIGHT);
    } else if (o.shape === 'centipede') {
      for (var b = 0; b < 9; b++) {
        var bx = 22 + b * 10;
        s += c(bx, 62 - Math.sin((b / 8) * Math.PI) * 16, 5.4, body);
        s += ps('M' + (bx - 2) + ',' + (68 - b) + ' l-6,10 M' + (bx + 2) + ',' + (68 - b) + ' l6,10', o.legs || '#7c2d12', 1.8);
      }
      s += c(26, 56, 4, o.head || '#7c2d12') + c(24, 54, 1.6, NIGHT);
    } else if (o.shape === 'arachnid') {
      /* scorpion, tick, spider-shaped things share the eight legs */
      s += e(58, 58, 26, 18, body, 'stroke="' + (o.ridge || '#7c2d12') + '" stroke-width="2"');
      for (var l = 0; l < 4; l++) {
        var ly = 50 + l * 6;
        s += ps('M36,' + ly + ' C24,' + (ly - 6) + ' 18,' + (ly + 6) + ' 10,' + (ly + 2), o.legs || body, 2.6);
        s += ps('M80,' + ly + ' C92,' + (ly - 6) + ' 98,' + (ly + 6) + ' 106,' + (ly + 2), o.legs || body, 2.6);
      }
      if (o.sting) {
        s += p('M84,58 C100,56 108,64 100,74 C96,80 88,80 88,74 C88,68 96,68 96,74',
          o.sting, 'stroke="' + (o.ridge || '#7c2d12') + '" stroke-width="2"');
      } else if (o.claws) {
        s += c(88, 50, 7, body) + c(88, 66, 7, body);
        s += ps('M94,48 L104,44 M94,68 L104,72', o.sting || body, 3);
      }
      s += c(50, 52, 2.4, NIGHT) + c(66, 52, 2.4, NIGHT);
    } else if (o.shape === 'winged') {
      /* moth, and anything that is a butterfly with the wrong colours */
      s += ps('M60,44 L60,84', o.body, 5);
      s += p('M60,48 C40,26 14,34 22,58 C28,76 48,76 60,60 Z', o.wings || '#cbd5e1',
        'stroke="' + (o.ridge || '#94a3b8') + '" stroke-width="2"');
      s += p('M60,48 C80,26 106,34 98,58 C92,76 72,76 60,60 Z', o.wings || '#cbd5e1',
        'stroke="' + (o.ridge || '#94a3b8') + '" stroke-width="2"');
      s += c(60, 38, 7, o.head || o.body);
      s += ps('M54,32 C48,24 42,28 40,22 M66,32 C72,24 78,28 80,22', o.legs || o.body, 1.6);
      if (o.spots) s += c(40, 50, 5, o.spots) + c(80, 50, 5, o.spots);
    } else if (o.shape === 'praying') {
      s += ps('M62,92 C58,66 60,48 64,32', o.body, 5);
      s += e(60, 26, 8, 9, o.head || '#4a9e4a');
      s += c(56, 24, 2.4, NIGHT) + c(64, 24, 2.4, NIGHT);
      s += ps('M60,40 C48,36 40,44 42,54 C44,64 54,66 60,58', o.body, 3.4);
      s += ps('M62,46 C70,40 78,44 78,52', o.body, 3);
      s += ps('M60,60 L48,86 M62,60 L76,86', o.legs || '#3f8f4a', 3);
    } else if (o.shape === 'blob') {
      /* tick, aphid: a round body on short legs, no wings, no opinions */
      s += e(60, 64, 22, 18, body, 'stroke="' + (o.ridge || '#4a7a3a') + '" stroke-width="2"');
      for (var g = 0; g < 3; g++) {
        s += ps('M' + (42 + g * 18) + ',78 l-4,10 M' + (46 + g * 18) + ',78 l4,10', o.legs || '#4a7a3a', 2);
      }
      s += e(60, 46, 10, 8, o.head || body);
      s += c(56, 44, 2, NIGHT) + c(64, 44, 2, NIGHT);
      if (o.marks) s += c(50, 62, 4, o.marks) + c(70, 68, 3.4, o.marks);
    }
    return s;
  });

  /** A close-up of one body part, cropped so it fills the card. */
  kind('bodyDetail', function (o) {
    var skin = o.skin || SKIN;
    var s = e(60, 60, 60, 60, o.tint || '#fdf1f7');
    var ink = o.ink || NIGHT;
    if (o.part === 'brow') {
      s += ps('M22,70 C40,48 60,44 78,52', skin, 9);
      for (var i = 0; i < 14; i++) {
        var t = i / 13;
        s += ps('M' + (24 + t * 52) + ',' + (66 - t * 12) + ' l' + (2 + t * 2) + ',-9', o.hair || '#3a2f2a', 2.2);
      }
    } else if (o.part === 'lash') {
      s += e(60, 74, 52, 26, '#fdfdff', 'stroke="' + SKIN_D + '" stroke-width="3"');
      for (var l = 0; l < 9; l++) {
        s += ps('M' + (18 + l * 11) + ',58 C' + (18 + l * 11) + ',46 ' + (22 + l * 11) + ',40 ' + (26 + l * 11) + ',36',
          ink, 2.4);
      }
      s += e(60, 34, 46, 12, skin);
    } else if (o.part === 'cheek') {
      s += e(60, 62, 46, 42, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += ps('M26,44 C40,34 56,32 70,34', SKIN_D, 3, 'opacity=".5"');
      s += ps('M30,86 C46,92 60,92 74,86', SKIN_D, 3, 'opacity=".5"');
      s += c(48, 62, 8, '#f9a8a8', 'opacity=".55"');
    } else if (o.part === 'cheekbone') {
      s += e(60, 60, 50, 46, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += ps('M18,70 C34,50 60,48 76,58', '#dda57e', 4, 'opacity=".65"');
      s += ps('M102,70 C86,50 60,48 44,58', '#dda57e', 4, 'opacity=".65"');
      s += ps('M30,88 C48,94 72,94 90,88', SKIN_D, 2.6, 'opacity=".45"');
      s += e(60, 34, 16, 12, '#e8b48a', 'opacity=".7"');
    } else if (o.part === 'chin') {
      s += e(60, 58, 48, 46, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += ps('M40,28 C48,40 72,40 80,28', SKIN_D, 3, 'opacity=".5"');
      s += ps('M42,58 q18,16 36,0', '#a3506a', 3);
    } else if (o.part === 'forehead') {
      s += e(60, 64, 50, 44, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += ps('M26,40 C48,30 72,30 94,40 M24,56 C48,46 72,46 96,56 M26,72 C48,62 72,62 94,72',
        SKIN_D, 2.4, 'opacity=".45"');
      s += e(24, 88, 10, 10, o.hair || '#3a2f2a') + e(96, 88, 10, 10, o.hair || '#3a2f2a');
    } else if (o.part === 'throat') {
      s += e(60, 40, 44, 22, skin);
      s += rc(40, 48, 40, 40, skin, 14, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += e(60, 62, 15, 12, '#e8b48a');
      s += ps('M46,80 C54,90 66,90 74,80', SKIN_D, 2.4, 'opacity=".5"');
    } else if (o.part === 'joint') {
      /* wrist and ankle: a limb end plus the joint it turns on */
      s += e(60, 28, 26, 22, skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += rc(38, 40, 44, 56, skin, 12, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += e(60, 52, 17, 12, '#e8b48a', 'stroke="' + SKIN_D + '" stroke-width="2"');
      if (o.limb === 'wrist') {
        for (var f = 0; f < 4; f++) s += rc(44 + f * 11, 60, 9, 40, skin, 5);
      } else {
        s += p('M40,96 C44,84 76,84 80,96 L80,104 L40,104 Z', skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      }
    } else if (o.part === 'palm') {
      s += rc(40, 40, 40, 56, skin, 14, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += rc(34, 34, 12, 26, skin, 6, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += ps('M48,54 q10,8 22,2 M48,68 q12,8 24,0 M48,82 q10,6 20,0', '#dda57e', 2.2);
    } else if (o.part === 'digit') {
      /* thumb, toe: a single digit, drawn big */
      s += p('M46,100 C40,72 42,40 54,28 C64,18 80,24 80,40 C80,58 66,72 66,100 Z',
        skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += e(66, 34, 13, 11, '#e8b48a');
      s += ps('M50,100 L46,110 M64,100 L62,110', SKIN_D, 2.4, 'opacity=".5"');
      if (o.nail) s += e(66, 32, 8, 6, '#fbe3d0', 'stroke="' + SKIN_D + '" stroke-width="1.6"');
    } else if (o.part === 'heel') {
      s += p('M30,40 C46,34 74,36 84,48 C94,62 88,86 74,92 C58,98 30,92 26,76 C22,60 22,46 30,40 Z',
        skin, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += e(50, 52, 16, 11, '#e8b48a');
    } else if (o.part === 'ribs') {
      for (var r = 0; r < 4; r++) {
        s += ps('M' + (30 + r * 3) + ',' + (34 + r * 14) + ' C' + (58) + ',' + (26 + r * 14) + ' ' +
          (86 - r * 3) + ',' + (26 + r * 14) + ' ' + (92 - r * 3) + ',' + (34 + r * 14),
          o.bone || '#f4ead8', 7, 'opacity=".85"');
      }
      s += rc(24, 22, 12, 78, o.spine || '#f4ead8', 5, 'stroke="' + (o.shade || '#dccbb0') + '" stroke-width="2"');
    } else if (o.part === 'vessel') {
      s += ps('M60,104 C60,80 44,70 44,52 C44,32 76,32 76,52 C76,70 60,80 60,104',
        o.wall || '#f7a8a8', 12);
      s += ps('M60,98 C60,78 48,68 48,52', o.blood || '#dc2626', 4);
      s += c(60, 44, 5, o.blood || '#dc2626');
    } else if (o.part === 'muscle') {
      s += p('M22,60 C22,34 40,22 58,26 C74,30 84,20 98,24 C98,50 88,84 60,92 C34,98 22,84 22,60 Z',
        o.muscle || '#dc2626', 'stroke="' + (o.shade || '#991b1b') + '" stroke-width="2"');
      for (var st = 0; st < 4; st++) {
        s += ps('M' + (32 + st * 16) + ',40 C' + (28 + st * 16) + ',60 ' + (32 + st * 16) + ',76 ' + (40 + st * 16) + ',86',
          o.shade || '#991b1b', 2.4, 'opacity=".7"');
      }
    } else if (o.part === 'drop') {
      s += c(60, 66, 30, o.drop || '#dc2626');
      s += p('M60,20 C74,42 90,54 90,66 C90,84 76,96 60,96 C44,96 30,84 30,66 C30,54 46,42 60,20 Z',
        o.drop || '#dc2626');
      s += e(48, 58, 8, 12, '#ffffff', 'opacity=".4"');
    } else if (o.part === 'spine') {
      s += rc(46, 16, 28, 84, o.bone || '#f4ead8', 12, 'stroke="' + (o.shade || '#dccbb0') + '" stroke-width="2"');
      for (var v = 0; v < 6; v++) {
        s += box(36, 24 + v * 14, 48, 9, o.shade || '#dccbb0', 4);
        s += ps('M84,' + (28 + v * 14) + ' l12,4', o.shade || '#dccbb0', 3);
      }
    }
    return s;
  });

  /** Bathroom shelf: the small bottles and tools of a morning routine. */
  kind('groom', function (o) {
    var s = shadow(102, o.wide || 30, 0.08);
    if (o.shape === 'tube') {
      /* toothpaste, cream, lip balm: a squeeze tube with a cap */
      s += rc(50, 18, 20, 10, o.cap || '#38bdf8', 3);
      s += p('M46,28 L74,28 L70,86 C70,90 66,92 62,92 L58,92 C54,92 50,90 50,86 Z',
        o.body || '#fdfdff', 'stroke="' + (o.edge || '#cbd5e1') + '" stroke-width="2"');
      s += box(48, 46, 24, 22, o.band || '#38bdf8', 3);
      s += o.mark || '';
    } else if (o.shape === 'brush') {
      /* toothbrush: a handle and a head of bristles */
      s += '<g transform="rotate(-38 60 60)">';
      s += rc(34, 52, 46, 16, o.handle || '#38bdf8', 8, 'stroke="' + (o.edge || '#0ea5e9') + '" stroke-width="2"');
      s += box(78, 46, 20, 28, o.head || '#fdfdff', 5, 'stroke="' + (o.edge || '#cbd5e1') + '" stroke-width="2"');
      for (var b = 0; b < 4; b++) {
        s += box(82, 50 + b * 6, 12, 3, o.bristles || '#cbd5e1', 1.5);
      }
      s += '</g>';
    } else if (o.shape === 'floss') {
      s += box(30, 42, 34, 44, o.box || '#a78bfa', 6, 'stroke="' + (o.edge || '#7c3aed') + '" stroke-width="2"');
      s += ps('M64,54 C86,48 100,60 92,74 C86,86 70,80 74,68', '#fdfdff', 2.4);
      s += box(38, 52, 18, 5, '#fdfdff', 2, 'opacity=".7"');
    } else if (o.shape === 'bottle') {
      /* perfume, aftershave, nail polish: small and square-ish */
      s += box(38, 40, 44, 56, o.glass || '#fdfdff', 8,
        'stroke="' + (o.edge || '#94a3b8') + '" stroke-width="2"');
      s += box(52, 26, 16, 16, o.glass || '#fdfdff', 3, 'stroke="' + (o.edge || '#94a3b8') + '" stroke-width="2"');
      s += box(50, 14, 20, 14, o.cap || '#2f2a3d', 4);
      s += box(46, 62, 28, 22, o.liquid || '#f472b6', 3, 'opacity=".75"');
      s += c(50, 52, 6, '#ffffff', 'opacity=".5"');
    } else if (o.shape === 'can') {
      s += rc(42, 22, 36, 12, o.cap || '#cbd5e1', 4);
      s += box(40, 32, 40, 64, o.body || '#fdfdff', 6, 'stroke="' + (o.edge || '#94a3b8') + '" stroke-width="2"');
      s += box(48, 40, 24, 34, o.band || '#38bdf8', 3);
      s += box(56, 50, 8, 14, o.markColor || '#dc2626');
    } else if (o.shape === 'mirror') {
      s += c(58, 52, 36, o.mirror || '#bae6fd', 'stroke="' + (o.edge || '#0ea5e9') + '" stroke-width="4"');
      s += ps('M46,36 l-8,-10 M40,56 l-10,-4', '#ffffff', 4, 'opacity=".7"');
      s += ps('M58,88 L58,104', o.edge || '#0ea5e9', 5);
      s += ps('M42,104 L74,104', o.edge || '#0ea5e9', 5);
    } else if (o.shape === 'dryer') {
      s += '<g transform="rotate(-24 60 60)">';
      s += p('M26,40 L74,40 C86,40 92,50 92,60 C92,70 86,78 74,78 L26,78 Z',
        o.body || '#f472b6', 'stroke="' + (o.edge || '#db2777') + '" stroke-width="2"');
      s += box(90, 48, 20, 22, o.barrel || '#374151', 4);
      s += rc(30, 46, 30, 26, o.edge || '#db2777', 6);
      s += '</g>';
    } else if (o.shape === 'compact') {
      s += '<g transform="rotate(-18 60 60)">';
      s += box(26, 42, 68, 16, o.edge || '#334155', 6);
      s += box(26, 56, 68, 34, o.pan || '#f9a8d4', 6, 'stroke="' + (o.edge || '#334155') + '" stroke-width="2"');
      s += c(46, 72, 8, o.shade || '#db2777', 'opacity=".5"') + c(70, 78, 7, o.shade || '#db2777', 'opacity=".4"');
      s += '</g>';
    } else if (o.shape === 'jar') {
      s += rc(40, 26, 40, 10, o.cap || '#cbd5e1', 3);
      s += p('M40,36 L80,36 L80,90 C80,94 76,96 72,96 L48,96 C44,96 40,94 40,90 Z',
        o.glass || '#e2e8f0', 'stroke="' + (o.edge || '#94a3b8') + '" stroke-width="2"');
      s += p('M40,60 L80,60 L80,90 C80,94 76,96 72,96 L48,96 C44,96 40,94 40,90 Z',
        o.content || '#fdf6e8', 'opacity=".9"');
    } else if (o.shape === 'razor') {
      s += '<g transform="rotate(-32 66 66)">';
      s += box(46, 82, 18, 22, o.grip || '#0ea5e9', 5, 'stroke="#0369a1" stroke-width="2"');
      s += box(46, 46, 18, 40, o.body || '#cbd5e1', 4, 'stroke="#94a3b8" stroke-width="2"');
      s += box(42, 38, 26, 10, o.blade || '#e2e8f0', 2, 'stroke="#64748b" stroke-width="1.6"');
      s += '</g>';
    } else if (o.shape === 'lipstick') {
      s += box(44, 66, 32, 34, o.case || '#334155', 4, 'stroke="#1f2937" stroke-width="2"');
      s += box(48, 58, 24, 10, '#94a3b8', 2);
      s += p('M50,58 L70,58 L70,36 C70,28 50,28 50,36 Z', o.bullet || '#e0457f');
      s += ps('M50,44 L70,44', '#be123c', 1.6, 'opacity=".6"');
    } else if (o.shape === 'spray') {
      s += box(44, 40, 32, 56, o.body || '#fdfdff', 6, 'stroke="' + (o.edge || '#94a3b8') + '" stroke-width="2"');
      s += rc(54, 28, 12, 14, o.cap || '#334155', 3);
      s += box(58, 16, 24, 12, o.cap || '#334155', 3);
      s += box(48, 56, 24, 28, o.band || '#38bdf8', 3);
      for (var d = 0; d < 3; d++) {
        s += c(86 + d * 4, 30 + d * 5, 2.4, '#7dd3fc', 'opacity=".8"');
      }
    }
    return s;
  });

  /** The sea as a place: water, sand, and one landmark. */
  kind('seascape', function (o) {
    var s = rc(0, 0, 120, 120, o.sky || '#dbeafe', 16);
    s += e(96, 24, 12, 12, '#fde68a', 'opacity=".9"');
    if (o.hills !== false) {
      s += p('M0,58 C18,42 34,50 52,44 L52,120 L0,120 Z', o.hill || '#86b8a0');
    }
    var waterTop = o.waterY || 62;
    s += p('M0,' + waterTop + ' C20,' + (waterTop - 5) + ' 36,' + (waterTop + 6) + ' 60,' + waterTop +
      ' C84,' + (waterTop - 6) + ' 100,' + (waterTop + 5) + ' 120,' + waterTop + ' L120,120 L0,120 Z',
      o.water || '#7dd3fc');
    for (var w = 0; w < 3; w++) {
      s += ps('M' + (14 + w * 34) + ',' + (waterTop + 16 + w * 12) + ' q10,-4 20,0', '#ffffff', 2.2, 'opacity=".6"');
    }
    if (o.sand !== false) {
      s += p('M0,96 C22,88 44,100 70,95 C92,91 108,98 120,94 L120,120 L0,120 Z',
        o.sandColor || '#f5d9a8');
    }
    if (o.landmark === 'lighthouse') {
      s += p('M52,58 L68,58 L72,100 L48,100 Z', o.tower || '#fdfdff',
        'stroke="' + (o.towerEdge || '#94a3b8') + '" stroke-width="2"');
      s += box(50, 46, 20, 14, '#dc2626', 3);
      s += box(50, 32, 20, 14, '#fdfdff', 3, 'stroke="#94a3b8" stroke-width="1.6"');
      s += ps('M70,38 l26,-8 M70,44 l26,8', '#fde68a', 4, 'opacity=".7"');
    } else if (o.landmark === 'reef') {
      s += p('M0,100 C16,84 30,92 44,78 C56,66 66,74 78,86 L120,120 L0,120 Z', o.reef || '#f472b6');
      s += c(30, 88, 4, '#fde68a') + c(50, 80, 3.4, '#fde68a') + c(66, 92, 3, '#fde68a');
    } else if (o.landmark === 'lagoon') {
      s += p('M6,102 C6,76 40,70 60,86 C80,102 114,96 114,102 Z', '#bae6fd',
        'stroke="#ffffff" stroke-width="2"');
      s += c(84, 90, 8, o.palm || '#4a9e4a');
    } else if (o.landmark === 'anchor') {
      s += ps('M60,34 L60,92', '#94a3b8', 5);
      s += c(60, 28, 6, 'none', 'stroke="#94a3b8" stroke-width="4"');
      s += ps('M44,52 L76,52', '#94a3b8', 5);
      s += p('M36,62 C36,86 48,98 60,98 C72,98 84,86 84,62 C80,80 70,88 60,88 C50,88 40,80 36,62 Z', '#94a3b8');
      s += c(60, 78, 6, 'none', 'stroke="#cbd5e1" stroke-width="3"');
    } else if (o.landmark === 'shell') {
      s += p('M60,96 C34,96 20,80 24,62 C28,44 46,34 60,44 C74,34 92,44 96,62 C100,80 86,96 60,96 Z',
        o.shell || '#fbcfe8', 'stroke="' + (o.ridge || '#f9a8d4') + '" stroke-width="2"');
      for (var r = 0; r < 5; r++) {
        s += ps('M60,50 C' + (40 + r * 2) + ',60 ' + (36 + r * 4) + ',80 ' + (44 + r * 3) + ',94',
          o.ridge || '#f9a8d4', 1.8);
        s += ps('M60,50 C' + (80 - r * 2) + ',60 ' + (84 - r * 4) + ',80 ' + (76 - r * 3) + ',94',
          o.ridge || '#f9a8d4', 1.8);
      }
    } else if (o.landmark === 'pearl') {
      s += e(60, 78, 30, 22, '#fdfdff', 'stroke="#e2e8f0" stroke-width="2"');
      s += c(60, 70, 20, o.pearl || '#fdf4e3', 'stroke="#d6c9a8" stroke-width="2"');
      s += c(52, 62, 6, '#ffffff', 'opacity=".8"');
      s += p('M28,90 C40,82 80,82 92,90', '#fde68a', 'opacity=".6"');
    } else if (o.landmark === 'weed') {
      for (var k = 0; k < 4; k++) {
        s += ps('M' + (38 + k * 16) + ',102 C' + (30 + k * 16) + ',80 ' + (48 + k * 16) + ',70 ' + (40 + k * 16) + ',50',
          o.weed || '#4a9e4a', 5);
      }
    } else if (o.landmark === 'coral') {
      s += ps('M60,102 L60,74 M60,86 L40,66 M60,86 L80,66 M60,80 L52,56 M60,80 L70,58',
        o.coral || '#fb7185', 6);
      s += c(40, 64, 5, o.coral || '#fb7185') + c(80, 64, 5, o.coral || '#fb7185');
      s += c(52, 54, 4.4, o.coral || '#fb7185') + c(70, 56, 4.4, o.coral || '#fb7185');
    } else if (o.landmark === 'boat') {
      s += p('M30,84 L90,84 L80,100 L40,100 Z', o.hull || '#dc2626',
        'stroke="#b91c1c" stroke-width="2"');
      s += rc(58, 40, 4, 44, '#94a3b8', 2);
      s += p('M62,42 L94,80 L62,80 Z', '#fdfdff');
      s += ps('M30,110 q10,-4 20,0 q10,4 20,0 q10,-4 20,0', '#ffffff', 2, 'opacity=".5"');
    } else if (o.landmark === 'buoy') {
      s += p('M60,36 C76,36 84,54 84,70 L84,88 L36,88 L36,70 C36,54 44,36 60,36 Z',
        o.body || '#dc2626', 'stroke="#b91c1c" stroke-width="2"');
      s += box(36, 66, 48, 10, '#fdfdff', 2);
      s += rc(54, 22, 12, 16, '#94a3b8', 3);
      s += ps('M30,98 q10,-4 20,0 q10,4 20,0', '#ffffff', 2, 'opacity=".5"');
    } else if (o.landmark === 'inlet') {
      /* a bay is water with land on both sides; a gulf is open on one */
      s += p('M0,44 C10,38 20,38 28,46 L34,120 L0,120 Z', o.head || '#86b8a0');
      s += p('M120,44 C110,38 100,38 92,46 L86,120 L120,120 Z', o.head || '#86b8a0');
      s += ps('M40,' + (waterTop + 10) + ' q8,-4 16,0 M64,' + (waterTop + 22) + ' q8,-4 16,0', '#ffffff', 2, 'opacity=".55"');
    } else if (o.landmark === 'atoll') {
      s += p('M8,100 C8,68 40,54 60,68 C80,82 112,76 112,100 C112,116 8,116 8,100 Z',
        o.sandColor || '#f5d9a8', 'stroke="#e0c48c" stroke-width="2"');
      s += e(60, 98, 34, 18, o.water || '#7dd3fc');
      s += c(30, 78, 7, o.palm || '#4a9e4a') + c(94, 82, 6, o.palm || '#4a9e4a');
    } else if (o.landmark === 'strand') {
      s += ps('M0,88 C26,80 48,94 74,88 C96,83 110,91 120,88 L120,120 L0,120 Z',
        o.sandColor || '#f5d9a8');
      s += ps('M0,78 C16,71 32,85 50,78 C68,71 84,85 102,78', '#ffffff', 3, 'opacity=".7"');
      s += ps('M58,74 L58,50', '#8a5a33', 3);
      s += p('M42,52 C42,40 74,40 74,52 Z', o.parasol || '#ef4444');
      s += p('M42,52 C48,58 68,58 74,52 Z', '#fca5a5');
    } else if (o.landmark === 'beach') {
      s += ps('M0,92 C26,84 48,98 74,92 C96,87 110,95 120,92', '#f5d9a8', 8, 'opacity=".6"');
      s += ps('M56,60 L56,80 M48,80 L64,80', '#8a5a33', 3);
      s += e(60, 56, 14, 12, '#4a9e4a');
    } else if (o.landmark === 'bay') {
      s += p('M0,80 C14,66 30,66 40,80 C50,94 64,94 74,80 C84,66 100,66 120,80 L120,120 L0,120 Z',
        o.water || '#7dd3fc');
      s += p('M0,80 C20,72 40,88 60,82 C80,76 100,90 120,84 L120,120 L0,120 Z',
        o.sandColor || '#f5d9a8', 'opacity=".85"');
    } else if (o.landmark === 'tide') {
      s += ps('M0,74 C16,66 32,82 50,74 C68,66 84,82 102,74 C108,72 114,74 120,76', '#ffffff', 4, 'opacity=".85"');
      s += ps('M0,86 C18,78 34,94 54,86 C74,78 90,94 120,86', '#ffffff', 3, 'opacity=".6"');
      s += p('M0,96 C22,88 44,100 70,95 C92,91 108,98 120,94 L120,120 L0,120 Z', o.sandColor || '#f5d9a8');
    } else if (o.landmark === 'current') {
      for (var cu = 0; cu < 3; cu++) {
        s += ps('M10,' + (70 + cu * 12) + ' C40,' + (64 + cu * 12) + ' 70,' + (78 + cu * 12) + ' 108,' + (70 + cu * 12),
          '#ffffff', 3, 'opacity=".65"');
        s += pl([108, 70 + cu * 12, 100, 64 + cu * 12, 102, 76 + cu * 12], '#ffffff', 'opacity=".65"');
      }
    } else if (o.landmark === 'plankton') {
      for (var pk = 0; pk < 14; pk++) {
        s += c(10 + (pk * 37) % 100, 44 + (pk * 53) % 44, 2 + (pk % 3), o.dot || '#fde047', 'opacity=".85"');
      }
      s += c(38, 62, 8, o.dot || '#fde047', 'opacity=".5"');
    } else if (o.landmark === 'depth') {
      s += ps('M60,30 L60,94', '#94a3b8', 3, 'stroke-dasharray="4 4"');
      s += p('M60,30 l-8,14 h16 Z', o.arrow || '#0ea5e9');
      for (var dp = 0; dp < 4; dp++) {
        s += c(24 + (dp % 2) * 72, 44 + dp * 14, 2.6, '#ffffff', 'opacity=".5"');
      }
    }
    return s;
  });


  /**
   * A person, with the job or the relationship doing the drawing.
   *
   * Ninety-odd words in this deck are people, and drawing ninety-odd
   * separate people would be both tedious and inconsistent. Instead the
   * figure is fixed and the role changes its hair, its outfit, its hat and
   * what it holds, which is the part a learner actually remembers.
   */
  kind('roleFigure', function (o) {
    var R = ROLE[o.role] || ROLE.default;
    var s = shadow(102, o.count > 1 ? 40 : 26, 0.08);

    /* A row of people: a crowd, an audience, a family. */
    if (o.count && o.count > 1) {
      var n = o.count;
      for (var i = 0; i < n; i++) {
        var x = 120 / (n + 1) * (i + 1);
        var scale = 0.62 - Math.abs(i - (n - 1) / 2) * 0.05;
        var back = i === Math.floor((n - 1) / 2) ? 0 : 0.16;
        s += '<g transform="translate(' + (x - 60 * scale).toFixed(1) + ' ' +
          (60 - 60 * scale).toFixed(1) + ') scale(' + scale.toFixed(2) + ')" opacity="' +
          (1 - back).toFixed(2) + '">' + personBody(R) + '</g>';
      }
      if (o.heart) s += c(60, 34, 9, '#e0457f') + c(50, 30, 9, '#e0457f') + c(70, 30, 9, '#e0457f');
      return s;
    }

    s += '<g' + (R.scale ? ' transform="translate(60 104) scale(' + R.scale + ') translate(-60 -104)"' : '') + '>' +
      personBody(R) + '</g>';
    if (o.prop) s += roleProp(o.role, o.prop);
    if (o.badge) {
      s += box(72, 60, 14, 18, o.badgeColor || '#0ea5e9', 3, 'stroke="#ffffff" stroke-width="1.6"');
      s += c(79, 66, 3, '#ffffff') + c(79, 72, 3, '#ffffff');
    }
    return s;
  });

  /** Darken a hex colour, so a sleeve can read as cloth next to a shirt. */
  function shade(hex, t) {
    var n = parseInt(hex.slice(1), 16);
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(v * (1 + t)))); };
    return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(function (v) {
      return ('0' + v.toString(16)).slice(-2);
    }).join('');
  }

  /* The head-and-body template every role shares. */
  function personBody(R) {
    var skin = R.skin || SKIN;
    var hair = R.hair || '#3a2f2a';
    var shirt = R.shirt || '#38bdf8';
    var legs = R.legs || '#334155';
    var s = '';
    /* legs and shoes */
    s += rc(46, 78, 12, 20, legs, 5) + rc(62, 78, 12, 20, legs, 5);
    s += rc(42, 94, 17, 8, R.shoe || '#1f2937', 4) + rc(61, 94, 17, 8, R.shoe || '#1f2937', 4);
    /* torso: `broad` and `slim` are one drawing at two widths, which is a real
       difference between the words "man" and "woman" and a poor one between
       "man" and "adult" — hence both */
    var bw = R.broad ? 5 : (R.slim ? -4 : 0);
    s += p('M' + (40 - bw) + ',54 C' + (40 - bw) + ',48 ' + (44 - bw) + ',44 ' + (50 - bw) + ',44 L' +
      (70 + bw) + ',44 C' + (76 + bw) + ',44 ' + (80 + bw) + ',48 ' + (80 + bw) + ',54 L' +
      (82 + bw) + ',80 C' + (82 + bw) + ',84 ' + (78 + bw) + ',86 ' + (74 + bw) + ',86 L' +
      (46 - bw) + ',86 C' + (42 - bw) + ',86 ' + (38 - bw) + ',84 ' + (38 - bw) + ',80 Z', shirt);
    if (R.apron) {
      s += p('M46,54 C46,50 50,48 54,48 L66,48 C70,48 74,50 74,54 L78,84 C78,88 74,90 70,90 L50,90 C46,90 42,88 42,84 Z',
        R.apron, 'opacity=".9"');
    }
    if (R.collar) s += p('M52,44 L60,54 L68,44 L64,42 L60,48 L56,42 Z', R.collar);
    if (R.tie) s += p('M57,48 L63,48 L66,78 L54,78 Z', R.tie);
    /* arms */
    var sleeve = R.sleeve || shade(shirt, -0.14);
    s += rc(22, 50, 13, 32, sleeve, 6.5) + rc(85, 50, 13, 32, sleeve, 6.5);
    s += c(28.5, 84, 6.5, skin) + c(91.5, 84, 6.5, skin);
    /* neck and head */
    s += rc(54, 36, 12, 12, R.neck || SKIN_D, 4);
    s += c(60, 26, 16, skin, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
    /* hair */
    if (R.hairStyle === 'long') {
      s += c(60, 24, 17, hair) + rc(42, 24, 7, 22, hair, 3.4) + rc(71, 24, 7, 22, hair, 3.4);
    } else if (R.hairStyle === 'bun') {
      s += c(60, 22, 17, hair) + c(60, 6, 7, hair);
    } else if (R.hairStyle === 'curly') {
      s += c(60, 18, 15, hair) + c(48, 14, 7, hair) + c(60, 8, 7.4, hair) + c(72, 14, 7, hair);
    } else if (R.hairStyle === 'bald') {
      s += '';
    } else {
      s += p('M43,24 C43,10 77,10 77,24 C77,18 68,16 60,16 C52,16 43,18 43,24 Z', hair);
    }
    /* face */
    s += c(54, 28, 2, NIGHT) + c(66, 28, 2, NIGHT);
    s += ps('M56,34 q4,3 8,0', '#a3506a', 1.8);
    /* hats last, so they sit on the hair */
    if (R.hat === 'cap') {
      s += p('M42,18 C42,8 78,8 78,18 L78,21 L42,21 Z', R.hatColor || '#1d4ed8');
      s += p('M78,20 C90,20 92,24 92,25 L78,25 Z', R.hatColor || '#1d4ed8');
    } else if (R.hat === 'chef') {
      s += rc(46, 6, 28, 12, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="1.6"');
      s += c(48, 6, 8, '#fdfdff') + c(60, 4, 9, '#fdfdff') + c(72, 6, 8, '#fdfdff');
    } else if (R.hat === 'helmet') {
      s += p('M42,20 C42,6 78,6 78,20 Z', R.hatColor || '#f59e0b');
      s += box(38, 18, 44, 5, R.hatEdge || '#b45309', 2.5);
    } else if (R.hat === 'surgical') {
      s += p('M42,22 C42,8 78,8 78,22 Z', '#7dd3fc', 'stroke="#38bdf8" stroke-width="1.6"');
      s += ps('M50,20 L70,20', '#e0f2fe', 2);
    } else if (R.hat === 'hard') {
      s += p('M40,20 C40,4 80,4 80,20 Z', '#fbbf24');
      s += box(36, 18, 48, 5, '#b45309', 2.5);
    } else if (R.hat === 'turban') {
      s += p('M42,20 C42,6 78,6 78,20 C70,12 50,12 42,20 Z', R.hatColor || '#f59e0b');
    } else if (R.hat === 'veil') {
      s += p('M40,22 C40,4 80,4 80,22 L80,52 C80,56 76,58 74,56 L74,26 L46,26 L46,56 C44,58 40,56 40,52 Z',
        '#fdfdff', 'opacity=".7"');
    } else if (R.hat === 'beret') {
      s += e(60, 14, 20, 9, R.hatColor || '#1f2937');
      s += c(72, 9, 3, R.hatColor || '#1f2937');
    } else if (R.hat === 'graduation') {
      s += p('M60,4 L92,16 L60,28 L28,16 Z', '#1f2937');
      s += ps('M82,20 L82,34', '#1f2937', 2) + c(82, 36, 3.4, '#fbbf24');
    } else if (R.hat === 'crown') {
      s += p('M44,18 L44,8 L52,14 L60,4 L68,14 L76,8 L76,18 Z', '#fbbf24',
        'stroke="#b45309" stroke-width="1.4"');
    } else if (R.hat === 'brim') {
      s += e(60, 16, 24, 6, R.hatColor || '#334155') + p('M46,16 C46,6 74,6 74,16 Z', R.hatColor || '#334155');
    }
    if (R.glasses) {
      s += c(54, 28, 6, 'none', 'stroke="' + (R.glasses) + '" stroke-width="2"') +
           c(66, 28, 6, 'none', 'stroke="' + (R.glasses) + '" stroke-width="2"') +
           ps('M60,28 L60,28', R.glasses, 2) + ps('M48,28 L42,26 M72,28 L78,26', R.glasses, 2);
    }
    if (R.beard) s += p('M48,32 C50,44 70,44 72,32 C66,38 54,38 48,32 Z', R.beard);
    if (R.mask) {
      s += p('M48,28 C48,24 72,24 72,28 L72,36 C72,42 48,42 48,36 Z', '#bae6fd',
        'stroke="#38bdf8" stroke-width="1.4"');
    }
    return s;
  }

  /* The object in the figure's hand: the part that names the job. */
  function roleProp(role, prop) {
    var s = '';
    var x = 88, y = 84;
    if (prop === 'tooth') {
      s += c(x, y, 14, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
           ps('M' + (x - 5) + ',' + (y - 8) + ' q5,4 10,0 M' + (x - 5) + ',' + (y + 6) + ' q5,-4 10,0', '#cbd5e1', 1.6);
    } else if (prop === 'stethoscope') {
      s += ps('M46,44 C46,66 74,66 74,44', '#334155', 3);
      s += c(74, 72, 8, '#cbd5e1', 'stroke="#64748b" stroke-width="2"');
    } else if (prop === 'pills') {
      s += c(x, y, 9, '#fdfdff', 'stroke="#cbd5e1" stroke-width="1.6"');
      s += p('M' + (x - 4) + ',' + (y - 9) + ' a9,9 0 0 1 8,4 l0,10 a9,9 0 0 1 -8,-4 Z', '#4f46e5');
    } else if (prop === 'mortar') {
      s += p('M76,80 C76,98 100,98 100,80 Z', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
      s += box(74, 74, 28, 8, '#94a3b8', 3);
      s += ps('M88,60 L98,74', '#8a5a33', 4);
    } else if (prop === 'scalpel') {
      s += ps('M80,96 L100,70', '#cbd5e1', 4) + pl('100,70 108,66 104,76', '#e2e8f0');
    } else if (prop === 'clipboard') {
      s += '<g transform="rotate(-12 90 84)">' + box(76, 58, 30, 38, '#f8fafc', 3, 'stroke="#94a3b8" stroke-width="2"') +
           box(84, 54, 14, 7, '#64748b', 2) +
           ps('M82,72 h18 M82,80 h18 M82,88 h12', '#94a3b8', 1.8) + '</g>';
    } else if (prop === 'bell') {
      s += p('M78,92 C78,72 102,72 102,92 Z', '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += box(76, 92, 28, 5, '#b45309', 2) + c(90, 100, 3.4, '#b45309');
    } else if (prop === 'folder') {
      s += box(74, 62, 32, 36, '#f59e0b', 3, 'stroke="#b45309" stroke-width="2"');
      s += box(80, 56, 16, 8, '#b45309', 2);
      s += ps('M80,74 h20 M80,82 h20', '#fef3c7', 1.8);
    } else if (prop === 'tie') {
      s += p('M84,58 L96,58 L100,96 L80,96 Z', '#dc2626');
      s += ps('M84,58 L96,58', '#b91c1c', 2);
    } else if (prop === 'wrench') {
      s += '<g transform="rotate(24 92 82)">' + box(86, 60, 10, 42, '#94a3b8', 3) +
           p('M86,58 L82,48 C82,42 100,42 100,48 L96,58 Z', '#94a3b8', 'stroke="#64748b" stroke-width="1.6"') + '</g>';
    } else if (prop === 'gear') {
      s += c(90, 82, 12, '#cbd5e1', 'stroke="#64748b" stroke-width="2"') + c(90, 82, 4.4, '#fdfdff');
      for (var g = 0; g < 8; g++) {
        var a = (g * Math.PI) / 4;
        s += box(90 + Math.cos(a) * 15 - 3, 82 + Math.sin(a) * 15 - 3, 6, 6, '#cbd5e1', 1.4);
      }
    } else if (prop === 'ruler') {
      s += '<g transform="rotate(-28 92 82)">' + box(78, 74, 34, 14, '#fde68a', 2, 'stroke="#b45309" stroke-width="2"');
      for (var t = 0; t < 4; t++) s += ps('M' + (84 + t * 8) + ',74 v5', '#b45309', 1.4);
      s += '</g>';
    } else if (prop === 'plug') {
      s += box(80, 74, 24, 20, '#334155', 4) + rc(88, 62, 5, 12, '#94a3b8', 2) + rc(96, 62, 5, 12, '#94a3b8', 2);
    } else if (prop === 'pipe') {
      s += rc(80, 76, 40, 12, '#94a3b8', 5) + rc(96, 62, 12, 22, '#cbd5e1', 5,
        'stroke="#64748b" stroke-width="1.6"');
    } else if (prop === 'hammer') {
      s += ps('M92,60 L86,98', '#8a5a33', 6);
      s += box(78, 52, 30, 14, '#94a3b8', 3);
    } else if (prop === 'plank') {
      s += box(74, 66, 42, 14, '#d9a05b', 3, 'stroke="#8a5a33" stroke-width="2"');
      s += ps('M80,70 h30 M80,76 h22', '#b45309', 1.4);
    } else if (prop === 'bread') {
      s += e(88, 84, 20, 13, '#d9a05b', 'stroke="#8a5a33" stroke-width="2"');
      s += ps('M80,80 l4,-5 M88,82 l4,-6 M96,80 l4,-5', '#8a5a33', 1.6);
    } else if (prop === 'cleaver') {
      s += ps('M92,58 L88,80', '#8a5a33', 6);
      s += p('M90,58 L112,60 L110,82 L88,80 Z', '#cbd5e1', 'stroke="#64748b" stroke-width="2"');
    } else if (prop === 'scissors') {
      s += c(84, 92, 5, 'none', 'stroke="#64748b" stroke-width="2.4"');
      s += c(94, 92, 5, 'none', 'stroke="#64748b" stroke-width="2.4"');
      s += ps('M88,88 L100,60 M92,88 L80,60', '#94a3b8', 2.6);
    } else if (prop === 'bouquet') {
      for (var bq = 0; bq < 4; bq++) {
        s += c(80 + bq * 8, 70 - (bq % 2) * 8, 7, ['#e0457f', '#fbbf24', '#8b5cf6', '#f472b6'][bq]);
      }
      s += ps('M88,80 L86,100', '#4a9e4a', 3) + ps('M84,100 L92,100', '#4a9e4a', 3);
    } else if (prop === 'bag') {
      s += box(74, 68, 32, 34, '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M82,68 C82,58 98,58 98,68', '#94a3b8', 2.4);
    } else if (prop === 'coins') {
      for (var co = 0; co < 3; co++) s += e(90, 92 - co * 6, 14, 4.4, '#fbbf24', 'stroke="#b45309" stroke-width="1.4"');
    } else if (prop === 'cup') {
      s += c(90, 84, 12, '#fdfdff', 'stroke="#94a3b8" stroke-width="2"') +
           e(90, 82, 7, 3, '#8a5a33') + ps('M86,70 C84,60 92,58 90,50', '#cbd5e1', 2, 'opacity=".7"');
    } else if (prop === 'star') {
      s += pl([90, 64, 95, 78, 110, 78, 98, 87, 102, 102, 90, 93, 78, 102, 82, 87, 70, 78, 85, 78], '#fbbf24',
        'stroke="#b45309" stroke-width="1.6"');
    } else if (prop === 'ring') {
      s += c(90, 82, 18, 'none', 'stroke="#fb923c" stroke-width="8"');
      s += ps('M76,66 L70,54 M104,66 L110,54', '#fb923c', 5);
    } else if (prop === 'whistle') {
      s += box(80, 76, 26, 14, '#fbbf24', 6, 'stroke="#b45309" stroke-width="1.6"') + c(86, 83, 5, '#fdfdff');
      s += ps('M106,83 L114,83', '#b45309', 3);
    } else if (prop === 'mop') {
      s += ps('M94,52 L86,84', '#94a3b8', 4);
      s += p('M74,84 L98,84 L94,104 L78,104 Z', '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
    } else if (prop === 'letter') {
      s += box(74, 68, 34, 24, '#fdfdff', 2, 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M74,70 L91,82 L108,70', '#94a3b8', 1.8);
    } else if (prop === 'needle') {
      s += ps('M78,92 L104,64', '#94a3b8', 2) + c(76, 94, 3.4, 'none', 'stroke="#e0457f" stroke-width="2"');
    } else if (prop === 'glasses') {
      s += c(82, 80, 10, 'none', 'stroke="#334155" stroke-width="2.6"');
      s += c(104, 80, 10, 'none', 'stroke="#334155" stroke-width="2.6"');
      s += ps('M92,80 h2', '#334155', 2.4);
    } else if (prop === 'flag') {
      s += ps('M84,56 L84,100', '#94a3b8', 3);
      s += p('M84,58 L108,64 L84,74 Z', '#fbbf24', 'stroke="#b45309" stroke-width="1.4"');
    } else if (prop === 'flask') {
      s += p('M84,56 L96,56 L96,72 L108,98 L72,98 L84,72 Z', '#e2e8f0',
        'stroke="#94a3b8" stroke-width="2"');
      s += p('M78,86 L102,86 L106,98 L74,98 Z', '#22c55e', 'opacity=".8"');
    } else if (prop === 'mic') {
      s += c(90, 76, 12, '#cbd5e1', 'stroke="#64748b" stroke-width="2"');
      s += ps('M90,88 L90,100', '#334155', 3) + ps('M82,100 L98,100', '#334155', 3);
    } else if (prop === 'calculator') {
      s += box(76, 62, 30, 40, '#334155', 4);
      s += box(80, 66, 22, 10, '#86efac', 2);
      for (var kk = 0; kk < 6; kk++) {
        s += c(83 + (kk % 3) * 8, 84 + Math.floor(kk / 3) * 7, 2.4, '#e2e8f0');
      }
    } else if (prop === 'book') {
      s += box(74, 62, 22, 38, '#e0457f', 2, 'stroke="#be123c" stroke-width="1.6"');
      s += box(96, 62, 22, 38, '#e0457f', 2, 'stroke="#be123c" stroke-width="1.6"');
      s += ps('M96,64 L96,98', '#be123c', 2);
    } else if (prop === 'net') {
      s += ps('M78,58 L78,78', '#8a5a33', 4);
      s += c(90, 84, 20, 'none', 'stroke="#cbd5e1" stroke-width="2.4"');
      s += ps('M74,78 h32 M90,68 v32 M70,84 h40', '#cbd5e1', 1.4);
    } else if (prop === 'cross') {
      s += box(84, 62, 6, 24, '#fdfdff', 1) + box(75, 71, 24, 6, '#fdfdff', 1);
    } else if (prop === 'bubbles') {
      s += box(70, 58, 34, 20, '#fdfdff', 6, 'stroke="#94a3b8" stroke-width="2"');
      s += box(80, 82, 32, 18, '#e0f2fe', 6, 'stroke="#38bdf8" stroke-width="2"');
      s += ps('M78,66 h18 M88,90 h16', '#94a3b8', 1.8);
    } else if (prop === 'cane') {
      s += ps('M88,60 L84,100', '#8a5a33', 5);
      s += ps('M88,60 C98,60 100,72 94,76', '#8a5a33', 5);
    } else if (prop === 'sunglasses') {
      s += c(52, 28, 8, '#1f2937') + c(70, 28, 8, '#1f2937') + ps('M60,28 h2', '#1f2937', 2.4);
    } else if (prop === 'bottle') {
      s += rc(86, 68, 16, 8, '#f9a8a8', 2);
      s += p('M80,76 L108,76 L106,100 L82,100 Z', '#fdfdff', 'stroke="#e2e8f0" stroke-width="2"');
    } else if (prop === 'ear') {
      return roleProp(role, 'wave') + ps('M84,42 a7,9 0 1 0 0,18', SKIN, 3.4);
    } else if (prop === 'flower') {
      for (var fl2 = 0; fl2 < 5; fl2++) {
        var fa2 = (fl2 * Math.PI * 2) / 5 - Math.PI / 2;
        s += c(90 + Math.cos(fa2) * 7, 74 + Math.sin(fa2) * 7, 4.4, '#fbcfe8');
      }
      s += c(90, 74, 3.4, '#fbbf24');
      s += ps('M90,82 L90,102', '#4a9e4a', 2.4);
      s += e(84, 94, 6, 3.4, '#4a9e4a', 'transform="rotate(-28 84 94)"');
    } else if (prop === 'suitcase') {
      s += box(74, 72, 32, 26, '#8a5a33', 3, 'stroke="#5c3a1a" stroke-width="2"');
      s += ps('M84,72 v-6 h12 v6', '#5c3a1a', 3);
    } else if (prop === 'wave') {
      s += ps('M78,90 C86,78 94,96 104,80', SKIN, 8);
    }
    return s;
  }

  /* The role table: who wears what, and what is in their hand. */
  var ROLE = {
    'default':    { shirt: '#38bdf8' },
    /* people */
    'man':        { shirt: '#3f6fb5', hair: '#2f2a3d', hairStyle: 'short', broad: 1 },
    'woman':      { shirt: '#e0457f', hair: '#6b4423', hairStyle: 'long', slim: 1 },
    'boy':        { shirt: '#22c55e', hair: '#3a2f2a', hairStyle: 'short', legs: '#1d4ed8', scale: 0.78, slim: 1 },
    'girl':       { shirt: '#f59e0b', hair: '#8a5a33', hairStyle: 'long', legs: '#be123c', scale: 0.78, slim: 1 },
    'adult':      { shirt: '#64748b', hair: '#2f2a3d', hairStyle: 'short', broad: 1 },
    'teenager':   { shirt: '#8b5cf6', hair: '#1f2937', hairStyle: 'curly', legs: '#1f2937', scale: 0.92, slim: 1 },
    'elderly':    { shirt: '#a8a29e', hair: '#cbd5e1', hairStyle: 'bald', legs: '#57534e' },
    'blind':      { shirt: '#78716c', hair: '#cbd5e1', hairStyle: 'bald', legs: '#57534e', glasses: '#1f2937' },
    'deaf2':      { shirt: '#0891b2', hair: '#4a3728', hairStyle: 'bun' },
    'infant':     { shirt: '#fdfdff', hair: '#c9a227', hairStyle: 'bald', legs: '#fdfdff', scale: 0.62 },
    'widow':      { shirt: '#334155', hair: '#cbd5e1', hairStyle: 'bun', prop: 'flower' },
    'stranger':   { shirt: '#57534e', hair: '#1f2937', hairStyle: 'short', glasses: '#334155' },
    'foreigner':  { shirt: '#0ea5e9', hair: '#c9a227', hairStyle: 'short', glasses: '#334155' },
    'twin':       { shirt: '#a78bfa', hair: '#3a2f2a', hairStyle: 'curly' },
    'lefty':      { shirt: '#f97316', hair: '#3a2f2a', hairStyle: 'short' },
    'neighbour':  { shirt: '#22c55e', hair: '#4a3728', hairStyle: 'short', prop: 'wave' },
    'guest':      { shirt: '#fbbf24', hair: '#2f2a3d', hairStyle: 'short', prop: 'bag' },
    'deaf':       { shirt: '#0891b2', hair: '#4a3728', hairStyle: 'bun', prop: 'ear' },
    'orphan':     { shirt: '#94a3b8', hair: '#a3a3a3', hairStyle: 'short', scale: 0.85, slim: 1 },
    'host':       { shirt: '#7c3aed', hair: '#2f2a3d', hairStyle: 'short', prop: 'wave', broad: 1 },
    'customer':   { shirt: '#f472b6', hair: '#6b4423', hairStyle: 'long' },
    'member':     { shirt: '#0ea5e9', hair: '#3a2f2a', hairStyle: 'curly' },
    'citizen':    { shirt: '#0f766e', hair: '#2f2a3d', hairStyle: 'short', prop: 'letter' },
    'resident':   { shirt: '#57534e', hair: '#4a3728', hairStyle: 'short', prop: 'suitcase' },
    'passenger':  { shirt: '#0284c7', hair: '#2f2a3d', hairStyle: 'short' },
    'pedestrian': { shirt: '#f97316', hair: '#3a2f2a', hairStyle: 'short', glasses: '#334155' },
    'volunteer':  { shirt: '#16a34a', hair: '#4a3728', hairStyle: 'bun' },
    /* family */
    'wife':       { shirt: '#f472b6', hair: '#6b4423', hairStyle: 'long' },
    'husband':    { shirt: '#334155', hair: '#2f2a3d', hairStyle: 'short', tie: '#dc2626', broad: 1 },
    'mother':     { shirt: '#f472b6', hair: '#6b4423', hairStyle: 'bun' },
    'father':     { shirt: '#3f6fb5', hair: '#2f2a3d', hairStyle: 'short' },
    'sister':     { shirt: '#a78bfa', hair: '#6b4423', hairStyle: 'long', scale: 0.9, slim: 1 },
    'brother':    { shirt: '#0ea5e9', hair: '#3a2f2a', hairStyle: 'short', scale: 0.9 },
    'son':        { shirt: '#22c55e', hair: '#3a2f2a', hairStyle: 'short', legs: '#1d4ed8', scale: 0.78, slim: 1 },
    'daughter':   { shirt: '#fbbf24', hair: '#8a5a33', hairStyle: 'long', legs: '#be123c', scale: 0.78, slim: 1 },
    'uncle':      { shirt: '#0f766e', hair: '#2f2a3d', hairStyle: 'short', beard: '#2f2a3d' },
    'aunt':       { shirt: '#db2777', hair: '#4a3728', hairStyle: 'bun' },
    'grandfather':{ shirt: '#78716c', hair: '#e5e7eb', hairStyle: 'bald', glasses: '#334155' },
    'grandmother':{ shirt: '#c084fc', hair: '#e5e7eb', hairStyle: 'bun', glasses: '#334155' },
    'grandson':   { shirt: '#fb923c', hair: '#c9a227', hairStyle: 'short', legs: '#1d4ed8', scale: 0.72, slim: 1 },
    'granddaughter': { shirt: '#f9a8d4', hair: '#c9a227', hairStyle: 'long', legs: '#be123c', scale: 0.72, slim: 1 },
    'cousin':     { shirt: '#4ade80', hair: '#8a5a33', hairStyle: 'curly' },
    'nephew':     { shirt: '#2f8fd8', hair: '#2f2a3d', hairStyle: 'short', legs: '#334155', scale: 0.76, slim: 1 },
    'niece':      { shirt: '#fda4af', hair: '#8a5a33', hairStyle: 'long', legs: '#be123c', scale: 0.76, slim: 1 },
    'godmother':  { shirt: '#c084fc', hair: '#6b4423', hairStyle: 'bun' },
    'godfather':  { shirt: '#1e40af', hair: '#2f2a3d', hairStyle: 'short', beard: '#2f2a3d' },
    'stepmother': { shirt: '#7c3aed', hair: '#4a3728', hairStyle: 'long' },
    'stepfather': { shirt: '#475569', hair: '#4a3728', hairStyle: 'bald' },
    'motherinlaw': { shirt: '#be123c', hair: '#9ca3af', hairStyle: 'bun', glasses: '#334155' },
    'fatherinlaw': { shirt: '#334155', hair: '#e5e7eb', hairStyle: 'bald', glasses: '#334155' },
    'relative':   { shirt: '#a3a3a3', hair: '#57534e', hairStyle: 'short' },
    'heir':       { shirt: '#ca8a04', hair: '#2f2a3d', hairStyle: 'short', hat: 'beret', hatColor: '#ca8a04' },
    'bride':      { shirt: '#fdfdff', hair: '#6b4423', hairStyle: 'bun', hat: 'veil' },
    'groom':      { shirt: '#fdfdff', hair: '#2f2a3d', hairStyle: 'short', tie: '#1f2937' },
    'friend':     { shirt: '#84cc16', hair: '#3a2f2a', hairStyle: 'curly' },
    'baby':       { shirt: '#fdfdff', hair: '#c9a227', hairStyle: 'bald' },
    /* jobs */
    'dentist':    { shirt: '#fdfdff', hair: '#2f2a3d', hairStyle: 'short', mask: 1, prop: 'tooth' },
    'vet':        { shirt: '#0d9488', hair: '#4a3728', hairStyle: 'bun', prop: 'stethoscope' },
    'pharmacist': { shirt: '#fdfdff', hair: '#1f2937', hairStyle: 'short', prop: 'pills' },
    'surgeon':    { shirt: '#38bdf8', hair: '#2f2a3d', hairStyle: 'short', hat: 'surgical', mask: 1, prop: 'scalpel' },
    'psychologist': { shirt: '#c084fc', hair: '#4a3728', hairStyle: 'curly', prop: 'clipboard' },
    'receptionist': { shirt: '#f472b6', hair: '#6b4423', hairStyle: 'bun', prop: 'bell' },
    'secretary':  { shirt: '#fdfdff', hair: '#3a2f2a', hairStyle: 'bun', prop: 'folder' },
    'manager':    { shirt: '#1e40af', hair: '#2f2a3d', hairStyle: 'short', tie: '#f59e0b', prop: 'clipboard' },
    'boss':       { shirt: '#1f2937', hair: '#2f2a3d', hairStyle: 'short', tie: '#dc2626', prop: 'tie' },
    'employee':   { shirt: '#38bdf8', hair: '#3a2f2a', hairStyle: 'short', badge: 1 },
    'worker':     { shirt: '#f59e0b', hair: '#2f2a3d', hairStyle: 'short', hat: 'hard', prop: 'wrench' },
    'engineer':   { shirt: '#0ea5e9', hair: '#2f2a3d', hairStyle: 'short', hat: 'hard', prop: 'gear' },
    'architect':  { shirt: '#57534e', hair: '#2f2a3d', hairStyle: 'short', prop: 'ruler' },
    'electrician': { shirt: '#fbbf24', hair: '#2f2a3d', hairStyle: 'short', hat: 'hard', prop: 'plug' },
    'plumber':    { shirt: '#0ea5e9', hair: '#4a3728', hairStyle: 'short', hat: 'cap', hatColor: '#0369a1', prop: 'pipe' },
    'carpenter':  { shirt: '#a16207', hair: '#4a3728', hairStyle: 'short', hat: 'brim', prop: 'hammer' },
    'baker':      { shirt: '#fef3c7', hair: '#4a3728', hairStyle: 'bun', hat: 'chef', apron: '#d6d3d1', prop: 'bread' },
    'chef':       { shirt: '#fdfdff', hair: '#2f2a3d', hairStyle: 'short', hat: 'chef', apron: '#cbd5e1' },
    'butcher':    { shirt: '#fdfdff', hair: '#1f2937', hairStyle: 'short', apron: '#dc2626', prop: 'cleaver' },
    'hairdresser': { shirt: '#ec4899', hair: '#e0457f', hairStyle: 'curly', prop: 'scissors' },
    'florist':    { shirt: '#4ade80', hair: '#6b4423', hairStyle: 'bun', prop: 'bouquet' },
    'shopkeeper': { shirt: '#0d9488', hair: '#2f2a3d', hairStyle: 'short', apron: '#0f766e', prop: 'bag' },
    'cashier':    { shirt: '#f97316', hair: '#3a2f2a', hairStyle: 'short', prop: 'coins' },
    'barista':    { shirt: '#3f2a1a', hair: '#2f2a3d', hairStyle: 'short', apron: '#78350f', prop: 'cup' },
    'waiter':     { shirt: '#1f2937', hair: '#2f2a3d', hairStyle: 'short', tie: '#dc2626' },
    'soldier':    { shirt: '#4d7c0f', hair: '#2f2a3d', hairStyle: 'short', hat: 'helmet', prop: 'star' },
    'lifeguard':  { shirt: '#dc2626', hair: '#2f2a3d', hairStyle: 'short', prop: 'ring' },
    'cleaner':    { shirt: '#38bdf8', hair: '#4a3728', hairStyle: 'bun', prop: 'mop' },
    'postman':    { shirt: '#1d4ed8', hair: '#2f2a3d', hairStyle: 'short', hat: 'cap', hatColor: '#1e3a8a', prop: 'letter' },
    'tailor':     { shirt: '#a8a29e', hair: '#57534e', hairStyle: 'bun', prop: 'needle' },
    'optician':   { shirt: '#0f766e', hair: '#4a3728', hairStyle: 'short', glasses: '#334155', prop: 'glasses' },
    'referee':    { shirt: '#fcd34d', hair: '#2f2a3d', hairStyle: 'short', prop: 'flag' },
    'coach':      { shirt: '#dc2626', hair: '#1f2937', hairStyle: 'short', hat: 'cap', hatColor: '#b91c1c', prop: 'whistle' },
    'scientist':  { shirt: '#fdfdff', hair: '#2f2a3d', hairStyle: 'short', prop: 'flask' },
    'journalist': { shirt: '#334155', hair: '#4a3728', hairStyle: 'short', prop: 'mic' },
    'accountant': { shirt: '#1e293b', hair: '#2f2a3d', hairStyle: 'short', glasses: '#334155', prop: 'calculator' },
    'librarian':  { shirt: '#0d9488', hair: '#4a3728', hairStyle: 'bun', glasses: '#334155', prop: 'book' },
    'fisherman':  { shirt: '#0369a1', hair: '#2f2a3d', hairStyle: 'short', hat: 'brim', hatColor: '#0c4a6e', prop: 'net' },
    'guard':      { shirt: '#1f2937', hair: '#2f2a3d', hairStyle: 'short', hat: 'brim', prop: 'whistle' },
    'priest':     { shirt: '#1f2937', hair: '#9ca3af', hairStyle: 'bald', prop: 'cross' },
    'interpreter': { shirt: '#6366f1', hair: '#2f2a3d', hairStyle: 'short', prop: 'bubbles' },
    'translator': { shirt: '#8b5cf6', hair: '#4a3728', hairStyle: 'bun', prop: 'bubbles' },
    'doctor':     { shirt: '#fdfdff', hair: '#2f2a3d', hairStyle: 'short', prop: 'stethoscope' },
    'nurse':      { shirt: '#38bdf8', hair: '#4a3728', hairStyle: 'bun', prop: 'clipboard' },
    'teacher':    { shirt: '#22c55e', hair: '#4a3728', hairStyle: 'bun', prop: 'clipboard' },
    'police':     { shirt: '#1e3a8a', hair: '#2f2a3d', hairStyle: 'short', hat: 'cap', hatColor: '#1e3a8a', prop: 'star' },
    'firefighter': { shirt: '#dc2626', hair: '#2f2a3d', hairStyle: 'short', hat: 'helmet', hatColor: '#b91c1c' },
    'farmer':     { shirt: '#65a30d', hair: '#8a5a33', hairStyle: 'brim', hatColor: '#a16207' },
    'driver':     { shirt: '#334155', hair: '#2f2a3d', hairStyle: 'short', hat: 'cap', hatColor: '#1f2937' },
    'pilot':      { shirt: '#1e3a8a', hair: '#2f2a3d', hairStyle: 'short', hat: 'cap', hatColor: '#1e3a8a' },
    'artist':     { shirt: '#f472b6', hair: '#e0457f', hairStyle: 'curly' },
    'singer':     { shirt: '#8b5cf6', hair: '#1f2937', hairStyle: 'curly' },
    'writer':     { shirt: '#475569', hair: '#4a3728', hairStyle: 'curly', glasses: '#334155' },
    'lawyer':     { shirt: '#1f2937', hair: '#2f2a3d', hairStyle: 'short', tie: '#dc2626' },
    'mechanic':   { shirt: '#ea580c', hair: '#2f2a3d', hairStyle: 'short', hat: 'cap', hatColor: '#c2410c', prop: 'wrench' },
    'student':    { shirt: '#38bdf8', hair: '#3a2f2a', hairStyle: 'short', prop: 'book' }
  };

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
