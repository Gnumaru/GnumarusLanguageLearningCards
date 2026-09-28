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
    /* A wing, where there is one. The kind had no way to draw a flying animal,
       so a bat came out as a four-legged one: a mammal with wings is not a
       mammal, and the silhouette is the word. Drawn before the body so it looks
       attached at the shoulder, and with ribs, because a membrane is what
       tells a wing from a wing-shaped blob. */
    if (o.wing) {
      s += p('M76,58 C50,30 26,20 14,26 C18,44 28,58 44,66 C56,69 68,64 76,58 Z',
        o.wing || '#6b4a7a', 'opacity=".92"');
      s += ps('M76,58 C50,32 28,24 16,27 M76,58 C52,46 36,46 26,49 M76,58 C60,60 50,63 44,66',
        o.rib || '#3f2a1a', 2, 'opacity=".65"');
      s += p('M74,64 C54,74 32,80 20,86 C36,92 58,90 74,72 Z',
        o.wing || '#6b4a7a', 'opacity=".7"');
    }
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
    } else if (o.ear === 'long') {
      /* A rabbit. The ears are the whole animal: nothing else in the kind
         stands them up, so a long-eared silhouette cannot be confused with a
         hare drawn any other way. */
      s += e(hx - 10, 22, 5.5, 20, coat) + e(hx + 7, 20, 5.5, 22, coat);
      s += e(hx - 10, 24, 2.4, 13, o.muzzle || '#f5e0c8') + e(hx + 7, 22, 2.4, 14, o.muzzle || '#f5e0c8');
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
      s += pl('60,22,71,52,102,56,78,74,84,102,60,88,36,102,42,74,18,56,49,52', body);
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
    } else if (o.shape === 'pumpkin') {
      var skin = o.body || '#f97316';
      if (o.cake) {
        /* A mooncake: round, flat, stamped, and it sits on a small plate. */
        s += e(60, 66, 34, 22, skin, 'stroke="' + (o.ink || '#92400e') + '" stroke-width="2"');
        s += e(60, 66, 26, 16, 'none', 'stroke="' + (o.ink || '#92400e') + '" stroke-width="1.6"');
        for (var mk = 0; mk < 6; mk++) {
          var ma = (mk * Math.PI) / 3;
          s += ps('M' + (60 + Math.cos(ma) * 22).toFixed(1) + ',' + (66 + Math.sin(ma) * 13).toFixed(1) +
            ' L' + (60 + Math.cos(ma) * 8).toFixed(1) + ',' + (66 + Math.sin(ma) * 5).toFixed(1),
            o.ink || '#92400e', 1.6);
        }
        s += e(60, 90, 40, 6, '#e2e8f0', 'stroke="#94a3b8" stroke-width="1.4"');
        return s;
      }
      s += e(60, 68, 38, 28, skin, 'stroke="' + (o.ink || '#c2410c') + '" stroke-width="2"');
      s += e(40, 68, 16, 27, skin, 'stroke="' + (o.ink || '#c2410c') + '" stroke-width="1.6"');
      s += e(80, 68, 16, 27, skin, 'stroke="' + (o.ink || '#c2410c') + '" stroke-width="1.6"');
      s += ps('M60,42 v-10', '#4a7a3a', 5);
      s += p('M52,32 q8,-8 16,0 q-8,6 -16,0', '#4a7a3a', 'opacity=".9"');
      if (o.carved) {
        /* A jack-o'-lantern: a face is what makes a pumpkin a Halloween one. */
        s += pl('40,60 52,60 46,72', o.ink || '#7c2d12');
        s += pl('80,60 68,60 74,72', o.ink || '#7c2d12');
        s += pl('42,80 60,98 78,80 66,80 60,88 54,80', o.ink || '#7c2d12');
        s += c(46, 78, 3, o.ink || '#7c2d12') + c(74, 78, 3, o.ink || '#7c2d12');
      }
      s += ps('M26,58 q6,-8 12,0', '#ffffff', 3, 'opacity=".35"');
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
      s += box(24, 30, 72, 66, o.plate || '#fdfdff', 8, 'stroke="#cbd5e1" stroke-width="2"');
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
      s += box(20, 44, 80, 50, o.plate || '#fdfdff', 8, 'stroke="#94a3b8" stroke-width="2"');
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
        return pl((x + 3) + ',' + (y - 11) + ' ' + (x - 8) + ',' + (y + 2) + ' ' + (x - 1) + ',' + (y + 2) +
          ' ' + (x - 3) + ',' + (y + 12) + ' ' + (x + 8) + ',' + (y - 2) + ' ' + (x + 1) + ',' + (y - 2), red);
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
      return pl((x - 5) + ',' + (y + 10) + ' ' + (x + 3) + ',' + (y - 10) + ' ' + (x - 1) + ',' +
        (y - 1) + ' ' + (x + 5) + ',' + (y + 1) + ' ' + (x - 5) + ',' + (y + 10) + ' ' +
        (x - 1) + ',' + (y - 1), '#f59e0b');
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
      var d = '';
      for (var k = 0; k < 10; k++) {
        var a = (k * Math.PI) / 5 - Math.PI / 2;
        var rr = k % 2 ? 4.4 : 10;
        d += (k ? ' ' : '') + (x + Math.cos(a) * rr).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1);
      }
      return pl(d, '#fbbf24');
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
      pl('9,8,2,5,6,1', '#334155'); },
    shield: function (x, y) {
      return p('M' + x + ',' + (y - 10) + ' L' + (x + 8) + ',' + (y - 6) + ' L' + (x + 7) + ',' + (y + 4) + ' ' +
        x + ',' + (y + 10) + ' L' + (x - 7) + ',' + (y + 4) + ' L' + (x - 8) + ',' + (y - 6) + ' Z', '#0ea5e9');
    },
    hand: function (x, y) {
      return box(x - 7, y - 2, 14, 11, '#fbbf24', 3) + box(x - 6, y - 9, 3, 8, '#fbbf24', 1.4) +
        box(x - 1, y - 10, 3, 9, '#fbbf24', 1.4) + box(x + 4, y - 8, 3, 7, '#fbbf24', 1.4);
    },
    hourglass: function (x, y) {
      /* Seven points: the two flat ends and the waist between them. The list
         this replaces had five and repeated two of them, so the shape was a
         pentagon with a duplicated vertex. */
      return pl((x - 9) + ',' + (y - 9) + ' ' + (x + 9) + ',' + (y - 9) + ' ' + x + ',' + y +
        ' ' + (x + 9) + ',' + (y + 9) + ' ' + (x - 9) + ',' + (y + 9) + ' ' + x + ',' + y, '#f59e0b');
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
        s += pl('108,' + (70 + cu * 12) + ' 100,' + (64 + cu * 12) + ' 102,' + (76 + cu * 12), '#ffffff', 'opacity=".65"');
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
    /* A recipe may name the prop or the badge itself; the ROLE table is the
       default. Reading only `o.prop` and `o.badge` left `R.prop` and `R.badge`
       dead — 53 table entries asked for a thing in the hand or on the chest and
       got a figure with neither, which is how `employee` came to draw exactly
       the same picture as `person`. */
    var prop = o.prop || R.prop;
    if (prop) s += roleProp(o.role, prop);
    if (o.badge || R.badge) {
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
      s += pl('90,64,95,78,110,78,98,87,102,102,90,93,78,102,82,87,70,78,85,78', '#fbbf24',
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
    'lender':     { shirt: '#0e7490', hair: '#2f2a3d', hairStyle: 'short', tie: '#0f172a', glasses: '#334155', prop: 'coins' },
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
   * Work: hand tools, the office, the school, devices, messages, media
   * ================================================================== */

  /**
   * A hand tool.
   *
   * Forty tools come out of one figure holding one thing, because that is the
   * part a learner remembers. The handle is shared; the head is the word.
   */
  kind('tool', function (o) {
    var metal = o.metal || '#94a3b8';
    var wood = o.handle || '#a16207';
    var grip = o.grip || '#334155';
    var s = shadow(100, o.wide || 22, 0.08);
    if (o.shape === 'hammer') {
      s += rc(52, 56, 14, 44, wood, 5, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(36, 40, 44, 20, metal, 4, 'stroke="#64748b" stroke-width="2"');
      s += box(36, 40, 12, 20, o.face || metal, 3, 'stroke="#64748b" stroke-width="1.6"');
      s += ps('M46,44 v12', '#475569', 2);
    } else if (o.shape === 'mallet') {
      s += rc(54, 56, 12, 42, wood, 5);
      s += box(38, 36, 40, 24, o.face || '#c98a4b', 10, 'stroke="#8a5a33" stroke-width="2"');
      s += e(58, 48, 12, 6, '#ffffff', 'opacity=".2"');
    } else if (o.shape === 'screwdriver') {
      s += box(48, 62, 24, 34, o.grip || '#dc2626', 7, 'stroke="#991b1b" stroke-width="2"');
      s += ps('M60,26 L60,64', metal, 5);
      s += pl('56,26 64,26 60,18', metal);
      s += box(48, 70, 24, 8, grip, 3);
    } else if (o.shape === 'wrench') {
      s += '<g transform="rotate(22 60 60)">';
      s += box(54, 40, 12, 56, metal, 4, 'stroke="#64748b" stroke-width="2"');
      s += p('M46,40 C46,26 74,26 74,40 L74,50 C74,58 46,58 46,50 Z', metal, 'stroke="#64748b" stroke-width="2"');
      s += p('M54,36 C54,30 66,30 66,36 L66,46 C66,52 54,52 54,46 Z', '#1f2937');
      s += '</g>';
    } else if (o.shape === 'socket') {
      s += rc(34, 56, 14, 44, wood, 5, 'stroke="#6b4423" stroke-width="1.6"');
      s += rc(50, 40, 24, 22, metal, 4, 'stroke="#64748b" stroke-width="2"');
      s += c(62, 51, 7, '#1f2937');
      s += box(50, 40, 24, 6, '#e2e8f0', 2, 'opacity=".5"');
    } else if (o.shape === 'pliers') {
      s += ps('M60,58 L60,98', metal, 6);
      s += p('M60,58 C44,54 38,40 42,28 C52,34 58,44 60,58 Z', metal, 'stroke="#64748b" stroke-width="2"');
      s += p('M60,58 C76,54 82,40 78,28 C68,34 62,44 60,58 Z', metal, 'stroke="#64748b" stroke-width="2"');
      s += box(52, 58, 16, 14, o.grip || '#dc2626', 4);
      s += box(54, 72, 12, 26, o.grip2 || '#1f2937', 5);
    } else if (o.shape === 'saw') {
      s += p('M18,72 L18,34 L86,26 L86,64 Z', metal, 'opacity=".75"');
      s += ps('M18,64 L86,56', '#334155', 2, 'stroke-dasharray="4 4"');
      s += box(86, 24, 30, 20, wood, 5, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M22,74 q6,10 14,6', o.teeth || '#94a3b8', 3);
    } else if (o.shape === 'drill') {
      s += box(30, 40, 46, 34, o.body || '#f59e0b', 8, 'stroke="#b45309" stroke-width="2"');
      s += box(24, 44, 16, 26, o.body2 || '#1f2937', 6);
      s += rc(76, 50, 22, 12, metal, 4);
      s += pl('98,50 108,54 98,58', metal);
      s += box(36, 30, 30, 12, o.body || '#f59e0b', 4, 'stroke="#b45309" stroke-width="1.6"');
    } else if (o.shape === 'chisel') {
      s += rc(38, 52, 44, 20, wood, 6, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M82,56 L104,56 L108,66 L82,68 Z', metal, 8);
    } else if (o.shape === 'file') {
      s += '<g transform="rotate(-30 60 60)">';
      s += box(34, 52, 48, 18, metal, 5, 'stroke="#64748b" stroke-width="1.6"');
      for (var fl = 0; fl < 6; fl++) s += ps('M' + (40 + fl * 8) + ',54 v14', '#64748b', 1.2);
      s += box(20, 50, 16, 22, o.grip || '#1f2937', 4);
      s += '</g>';
    } else if (o.shape === 'sandpaper') {
      s += p('M24,32 L96,32 L96,88 L24,88 Z', o.grit || '#a89878');
      for (var gp = 0; gp < 40; gp++) {
        s += c(28 + (gp * 37) % 64, 36 + (gp * 23) % 48, 1.2, '#6b7280', 'opacity=".7"');
      }
    } else if (o.shape === 'memory') {
      s += p('M26,26 L94,26 L94,58 L78,58 L78,96 L26,96 Z', o.body || '#1f2937', 'stroke="#0f172a" stroke-width="2"');
      s += box(36, 36, 48, 14, o.gold || '#fbbf24', 2, 'stroke="#b45309" stroke-width="1.4"');
      s += box(36, 58, 30, 8, '#475569', 1.5);
      s += box(36, 70, 30, 8, '#475569', 1.5);
    } else if (o.shape === 'tape') {
      s += c(60, 58, 36, o.colour || '#1f2937');
      s += c(60, 58, 12, '#0f172a');
      s += p('M60,22 C46,26 44,40 50,48 L70,48 C76,40 74,26 60,22 Z', o.colour || '#1f2937');
      s += c(60, 34, 6, '#0f172a');
    } else if (o.shape === 'glue') {
      s += box(42, 40, 36, 52, o.body || '#f59e0b', 5, 'stroke="#b45309" stroke-width="2"');
      s += rc(50, 26, 20, 16, o.cap || '#1f2937', 4);
      s += ps('M60,18 L48,8 L60,14 L72,8 Z', o.tip || '#fde68a');
      s += box(46, 56, 28, 22, '#fdfdff', 2);
    } else if (o.shape === 'ruler') {
      s += box(14, 52, 92, 18, o.body || '#fbbf24', 2, 'stroke="#b45309" stroke-width="1.6"');
      for (var rt = 0; rt < 10; rt++) s += ps('M' + (20 + rt * 9) + ',52 v6', '#92400e', 1.4);
    } else if (o.shape === 'balance') {
      /* A weighing scale: the beam and two pans. The word was drawn as a cash
         till, which is the other thing in Portuguese that weighs and takes
         money. A beam balance is unmistakable and a till is not: the pans hang,
         and the thing being weighed sits in one of them. */
      var beam = o.tilt === undefined ? -7 : o.tilt;
      var panL = 60 + beam, panR = 60 - beam;
      s += box(54, 40, 12, 54, o.body || '#475569', 3, 'stroke="#1e293b" stroke-width="2"');
      s += box(38, 94, 44, 8, o.body || '#475569', 3, 'stroke="#1e293b" stroke-width="2"');
      s += ps('M' + (60 - 34) + ',' + (44 + beam) + ' L' + (60 + 34) + ',' + (44 - beam),
        o.rod || '#94a3b8', 4);
      s += c(60, 40, 5, '#e2e8f0', 'stroke="#1e293b" stroke-width="1.6"');
      s += ps('M' + panL + ',' + (48 + beam) + ' v10 M' + panR + ',' + (48 - beam) + ' v10',
        o.rod || '#94a3b8', 1.8);
      s += p('M' + (panL - 16) + ',' + (60 + beam) + ' q16,14 32,0 Z', o.pan || '#cbd5e1',
        'stroke="#64748b" stroke-width="1.8"');
      s += p('M' + (panR - 16) + ',' + (60 - beam) + ' q16,14 32,0 Z', o.pan || '#cbd5e1',
        'stroke="#64748b" stroke-width="1.8"');
      /* what is being weighed, on the heavier side */
      s += c(panR, 56 - beam, 8, o.load || '#f59e0b', 'stroke="#b45309" stroke-width="1.4"');
    } else if (o.shape === 'shears') {
      s += ps('M34,30 L74,86', metal, 6);
      s += ps('M86,30 L46,86', metal, 6);
      s += c(32, 26, 8, 'none', 'stroke="' + (o.handle || '#dc2626') + '" stroke-width="4"');
      s += c(88, 26, 8, 'none', 'stroke="' + (o.handle || '#dc2626') + '" stroke-width="4"');
      s += c(60, 60, 4, '#64748b');
    } else if (o.shape === 'axe') {
      s += rc(72, 20, 12, 80, wood, 5, 'stroke="#6b4423" stroke-width="1.6"');
      s += p('M30,32 C30,18 62,18 68,32 C68,48 30,48 30,32 Z', metal, 'stroke="#64748b" stroke-width="2"');
      s += p('M30,32 C40,28 50,30 56,38 C44,44 34,42 30,32 Z', '#cbd5e1', 'opacity=".5"');
    } else if (o.shape === 'shovel') {
      s += rc(56, 16, 9, 56, wood, 4, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(52, 12, 17, 10, grip, 4);
      s += p('M46,72 L74,72 L70,100 C70,104 66,106 60,106 C54,106 50,104 50,100 Z',
        o.blade || '#94a3b8', 'stroke="#64748b" stroke-width="2"');
    } else if (o.shape === 'rake') {
      s += rc(56, 12, 9, 64, wood, 4);
      s += box(24, 74, 72, 9, metal, 3, 'stroke="#64748b" stroke-width="1.6"');
      for (var tk = 0; tk < 6; tk++) s += ps('M' + (30 + tk * 12) + ',83 v18', metal, 3);
    } else if (o.shape === 'cart') {
      s += p('M16,50 L92,50 L84,88 L30,88 Z', o.body || '#f97316', 'stroke="#c2410c" stroke-width="2"');
      s += ps('M16,50 L8,36', metal, 5);
      s += c(44, 98, 16, 'none', 'stroke="#334155" stroke-width="4"');
      s += c(44, 98, 5, metal);
      s += p('M30,58 L86,58 L82,80 L34,80 Z', '#fed7aa');
    } else if (o.shape === 'bench') {
      s += box(12, 48, 96, 16, wood, 3, 'stroke="#6b4423" stroke-width="2"');
      s += box(20, 64, 12, 34, wood, 3, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(88, 64, 12, 34, wood, 3, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(34, 34, 52, 10, o.vice || '#475569', 3, 'stroke="#1f2937" stroke-width="1.6"');
      s += box(30, 40, 10, 18, '#64748b', 3);
    } else if (o.shape === 'toolbox') {
      s += box(16, 56, 88, 42, o.body || '#dc2626', 6, 'stroke="#991b1b" stroke-width="2"');
      s += box(16, 56, 88, 14, o.lid || '#b91c1c', 4, 'stroke="#991b1b" stroke-width="2"');
      s += ps('M42,56 v-8 a18,18 0 0 1 36,0 v8', metal, 4);
      s += box(52, 70, 16, 12, '#fde68a', 3);
    } else if (o.shape === 'fastener') {
      if (o.kind === 'screw') {
        s += ps('M60,20 L60,96', metal, 8);
        for (var sc = 0; sc < 7; sc++) s += ps('M' + '52,' + (28 + sc * 10) + ' h16', metal, 3.4);
        s += c(60, 98, 10, metal, 'stroke="#64748b" stroke-width="2"');
        s += ps('M52,98 h16', '#64748b', 2.4);
      } else if (o.kind === 'nut') {
        s += pl('60,20,92,40,92,76,60,96,28,76,28,40', metal, 'stroke="#64748b" stroke-width="2"');
        s += c(60, 58, 14, '#0f172a');
        for (var nt = 0; nt < 6; nt++) {
          s += c(60 + Math.cos(nt) * 20, 58 + Math.sin(nt) * 26, 3, '#e2e8f0');
        }
      } else {
        s += ps('M56,20 L64,20 L62,58 L58,58 Z', metal, 5);
        s += ps('M46,18 L74,18', metal, 5);
        s += ps('M60,58 L60,96', metal, 8);
        s += ps('M60,96 l-4,10', metal, 4);
      }
    } else if (o.shape === 'level') {
      s += box(14, 50, 92, 24, o.body || '#fbbf24', 3, 'stroke="#b45309" stroke-width="2"');
      s += c(60, 62, 10, '#fdfdff', 'stroke="#b45309" stroke-width="2"');
      s += e(60, 62, 6, 4, o.bubble || '#22c55e');
      s += ps('M32,62 h10 M78,62 h10', '#92400e', 1.6);
    } else if (o.shape === 'plumb') {
      s += ps('M60,10 L60,70', '#64748b', 2);
      s += p('M60,70 L74,84 L60,104 L46,84 Z', metal, 'stroke="#475569" stroke-width="2"');
      s += ps('M60,20 h16', '#64748b', 3);
    } else if (o.shape === 'protractor') {
      s += p('M16,84 A48,48 0 0 1 104,84 Z', o.body || '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
      for (var pr = 0; pr <= 12; pr++) {
        var pa = Math.PI - (pr / 12) * Math.PI;
        s += ps('M' + (60 + Math.cos(pa) * 40).toFixed(1) + ',' + (84 - Math.sin(pa) * 40).toFixed(1) + ' l' +
          (Math.cos(pa) * 8).toFixed(1) + ',' + (-Math.sin(pa) * 8).toFixed(1), '#475569', 1.4);
      }
      s += c(60, 84, 3, '#dc2626');
    } else if (o.shape === 'clamp') {
      s += box(24, 40, 72, 12, metal, 3, 'stroke="#64748b" stroke-width="1.6"');
      s += box(24, 76, 72, 12, metal, 3, 'stroke="#64748b" stroke-width="1.6"');
      s += rc(18, 34, 12, 60, metal, 5, 'stroke="#64748b" stroke-width="1.6"');
      s += ps('M96,46 L110,46 M96,82 L110,82', metal, 4);
      s += rc(104, 38, 10, 52, metal, 4, 'stroke="#64748b" stroke-width="1.6"');
      s += rc(48, 52, 24, 24, o.wood || '#a16207', 4);
    } else if (o.shape === 'vice') {
      s += box(14, 74, 92, 22, o.body || '#1f2937', 4, 'stroke="#0f172a" stroke-width="2"');
      s += box(22, 44, 18, 30, o.body || '#334155', 3, 'stroke="#0f172a" stroke-width="1.6"');
      s += box(80, 44, 18, 30, o.body || '#334155', 3, 'stroke="#0f172a" stroke-width="1.6"');
      s += rc(96, 58, 22, 8, metal, 4);
      s += ps('M118,62 L106,62', metal, 6);
      s += box(30, 66, 60, 12, '#94a3b8', 3);
    } else if (o.shape === 'chainsaw') {
      s += box(28, 44, 48, 30, o.body || '#f59e0b', 7, 'stroke="#b45309" stroke-width="2"');
      s += box(22, 48, 14, 22, '#1f2937', 5);
      s += ps('M74,52 L100,52', metal, 10);
      s += ps('M78,44 L78,44', metal, 4);
      s += c(100, 52, 12, 'none', 'stroke="#475569" stroke-width="4"');
      s += c(100, 52, 4, metal);
      s += box(70, 40, 12, 38, o.body2 || '#1f2937', 4);
    } else if (o.shape === 'solder') {
      s += '<g transform="rotate(28 60 60)">';
      s += rc(50, 56, 20, 42, o.body || '#1f2937', 5);
      s += ps('M60,26 L60,58', metal, 5);
      s += pl('56,26 64,26 60,16', metal);
      s += '</g>';
      s += ps('M28,88 q10,8 20,0 q10,-8 20,0', '#94a3b8', 3, 'opacity=".7"');
    } else if (o.shape === 'meter') {
      s += box(24, 30, 72, 62, o.body || '#dc2626', 6, 'stroke="#991b1b" stroke-width="2"');
      s += box(30, 36, 60, 26, o.screen || '#fde68a', 3, 'stroke="#92400e" stroke-width="1.6"');
      s += ps('M36,56 l8,-10 l8,6 l8,-12 l8,8 l8,-6', '#92400e', 2.2);
      s += c(60, 76, 7, o.dial || '#0f172a');
      s += ps('M60,76 L60,68', '#fdfdff', 2);
      s += ps('M40,92 L24,100 M80,92 L96,100', metal, 4);
    } else if (o.shape === 'pickaxe') {
      s += rc(56, 22, 10, 76, wood, 4, 'stroke="#6b4423" stroke-width="1.6"');
      s += p('M24,32 C40,22 60,22 60,32 C60,44 40,44 24,36 Z', metal, 'stroke="#64748b" stroke-width="1.6"');
      s += p('M96,32 C80,22 62,22 62,32 C62,44 80,44 96,36 Z', metal, 'stroke="#64748b" stroke-width="1.6"');
    } else if (o.shape === 'trowel') {
      s += rc(54, 16, 12, 30, wood, 4, 'stroke="#6b4423" stroke-width="1.6"');
      s += p('M46,46 L74,46 L78,96 C78,102 42,102 42,96 Z', metal, 'stroke="#64748b" stroke-width="2"');
      s += ps('M60,50 v46', '#cbd5e1', 2, 'opacity=".7"');
    } else if (o.shape === 'club') {
      /* A bat: thick at the barrel and thin at the grip, with a knob at the
         end. Two strokes of different widths is what makes it a bat — one
         stroke of one width is a stick. */
      s += ps('M30,98 L48,76', o.grip || '#8a5a33', 5);
      s += c(27, 100, 5.5, o.grip || '#8a5a33');
      s += ps('M46,78 L88,18', o.body || '#e7d3bb', 14);
      s += ps('M46,78 L56,64', o.body || '#e7d3bb', 10);
    } else if (o.shape === 'crowbar') {
      s += '<g transform="rotate(-18 60 60)">';
      s += box(56, 26, 12, 74, o.body || '#dc2626', 5, 'stroke="#991b1b" stroke-width="1.6"');
      s += p('M44,26 C34,26 30,36 34,44 C38,50 46,46 48,36 Z', metal, 'stroke="#64748b" stroke-width="1.6"');
      s += p('M80,96 C92,96 96,104 92,110 C88,114 82,110 80,102 Z', metal, 'stroke="#64748b" stroke-width="1.6"');
      s += '</g>';
    } else if (o.shape === 'brush') {
      s += rc(58, 14, 10, 40, wood, 4, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(48, 52, 24, 8, metal, 2, 'stroke="#64748b" stroke-width="1.4"');
      s += p('M44,60 L76,60 L72,96 C72,100 48,100 48,96 Z', o.bristle || '#d97706');
      for (var bh = 0; bh < 5; bh++) s += ps('M' + (48 + bh * 7) + ',62 v30', '#b45309', 1.4);
    } else if (o.shape === 'canpaint') {
      s += rc(40, 22, 40, 12, o.cap || '#94a3b8', 4);
      s += box(36, 32, 48, 68, o.body || '#f8fafc', 6, 'stroke="#94a3b8" stroke-width="2"');
      s += box(42, 44, 36, 30, o.band || o.paint || '#ef4444', 3);
      s += box(54, 82, 12, 12, grip, 2);
    } else if (o.shape === 'varnish') {
      s += box(36, 30, 48, 72, o.glass || '#78350f', 6, 'stroke="#451a03" stroke-width="2"');
      s += box(44, 20, 32, 12, o.cap || '#1c1917', 3);
      s += box(42, 46, 36, 26, o.label || '#fde68a', 2);
      s += ps('M48,76 L48,92', '#a16207', 3, 'opacity=".7"');
    } else if (o.shape === 'sawhorse') {
      s += box(22, 40, 76, 10, wood, 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M34,50 L20,96 M86,50 L100,96', wood, 7);
      s += ps('M32,70 L88,70', wood, 5);
    } else if (o.shape === 'plierscut') {
      s += ps('M40,20 L40,100 M80,20 L80,100', metal, 8);
      s += box(32, 54, 56, 16, o.body || '#dc2626', 4, 'stroke="#991b1b" stroke-width="1.6"');
      s += c(40, 60, 5, '#0f172a') + c(60, 60, 5, '#0f172a');
    }
    return s;
  });

  /** Paper, and the things that live in an office. */
  kind('office', function (o) {
    var metal = o.metal || '#94a3b8';
    var s = shadow(100, o.wide || 30, 0.08);
    if (o.shape === 'ruler') {
      /* Units differ by how finely they are divided, and that is the only
         honest thing to vary: a yard has three feet, a metre has a hundred
         centimetres, an inch has eight sixteenths. */
      var major = o.major === undefined ? 2 : o.major;
      var minor = o.minor === undefined ? 5 : o.minor;
      s += box(10, 44, 100, 32, o.body || '#fbbf24', 3, 'stroke="#b45309" stroke-width="2"');
      s += box(10, 44, 100, 8, '#ffffff', 2, 'opacity=".3"');
      for (var tk2 = 0; tk2 < minor; tk2++) {
        var tx = 14 + tk2 * (92 / (minor - 1));
        s += ps('M' + tx.toFixed(1) + ',74 v-' + (tk2 % major === 0 ? 16 : 9), '#78350f',
          tk2 % major === 0 ? 2.6 : 1.6);
      }
      s += box(10, 44, 100, 4, '#ffffff', 1, 'opacity=".4"');
      if (o.end) s += box(96, 44, 14, 32, o.end, 2, 'stroke="#b45309" stroke-width="1.6"');
    } else if (o.shape === 'desk') {
      s += box(10, 44, 100, 14, o.top || '#a16207', 3, 'stroke="#6b4423" stroke-width="2"');
      s += box(18, 58, 14, 42, o.top || '#a16207', 3, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(88, 58, 14, 42, o.top || '#a16207', 3, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(34, 66, 52, 20, o.drawer || '#92400e', 3, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M52,76 h16', '#fbbf24', 3);
    } else if (o.shape === 'chair') {
      s += box(38, 26, 44, 34, o.back || '#334155', 6, 'stroke="#1f2937" stroke-width="2"');
      s += box(28, 58, 64, 14, o.seat || '#475569', 5, 'stroke="#1f2937" stroke-width="2"');
      s += rc(56, 72, 8, 26, '#64748b', 3);
      s += ps('M60,96 L28,100 M60,96 L92,100 M60,96 L60,104', '#64748b', 4);
      s += c(28, 100, 5, '#1f2937') + c(92, 100, 5, '#1f2937') + c(60, 104, 5, '#1f2937');
    } else if (o.shape === 'stapler') {
      s += '<g transform="rotate(-8 60 66)">';
      s += p('M24,72 L96,72 C100,72 100,58 96,58 L30,58 C22,58 22,72 24,72 Z', o.body || '#1f2937', 'stroke="#0f172a" stroke-width="2"');
      s += p('M30,58 L92,44 C98,42 100,50 96,54 L36,62 Z', o.top || '#334155', 'stroke="#0f172a" stroke-width="2"');
      s += box(24, 72, 20, 10, metal, 2, 'stroke="#64748b" stroke-width="1.4"');
      s += '</g>';
    } else if (o.shape === 'clip') {
      s += ps('M34,72 C34,40 40,26 48,26 C54,26 56,34 52,44', metal, 5);
      s += ps('M86,72 C86,40 80,26 72,26 C66,26 64,34 68,44', metal, 5);
      s += ps('M48,30 C54,24 66,24 72,30', metal, 5);
      s += box(36, 72, 48, 6, o.colour || '#0ea5e9', 2);
    } else if (o.shape === 'folder') {
      s += p('M16,36 L48,36 L56,44 L104,44 L104,96 L16,96 Z', o.body || '#f59e0b', 'stroke="#b45309" stroke-width="2"');
      s += p('M22,50 L98,50 L98,96 L22,96 Z', o.inner || '#fde68a');
      s += box(20, 88, 14, 10, o.clip || '#94a3b8', 2, 'stroke="#64748b" stroke-width="1.4"');
    } else if (o.shape === 'envelope') {
      s += box(14, 34, 92, 62, o.paper || '#fdf6e8', 3, 'stroke="#c8b89a" stroke-width="2"');
      s += ps('M14,36 L60,66 L106,36', '#c8b89a', 2.4);
      s += ps('M14,94 L44,62 M106,94 L76,62', '#c8b89a', 1.8);
      s += c(90, 46, 9, o.stamp || '#dc2626');
    } else if (o.shape === 'stamp') {
      s += box(38, 22, 44, 26, o.handle || '#78350f', 6, 'stroke="#451a03" stroke-width="2"');
      s += c(60, 20, 14, o.wood || '#a16207', 'stroke="#6b4423" stroke-width="2"');
      s += box(34, 48, 52, 12, '#475569', 3, 'stroke="#1f2937" stroke-width="1.6"');
      s += box(38, 60, 44, 30, o.ink || '#1f2937', 3);
      s += c(60, 75, 10, o.face || '#dc2626', 'opacity=".8"');
    } else if (o.shape === 'pad') {
      s += box(26, 24, 68, 78, o.cover || '#0ea5e9', 4, 'stroke="#0369a1" stroke-width="2"');
      s += box(20, 18, 80, 14, o.cover || '#0284c7', 3, 'stroke="#0369a1" stroke-width="1.6"');
      s += box(34, 40, 52, 46, '#fdfdff', 2);
      for (var ln = 0; ln < 4; ln++) s += ps('M40,' + (50 + ln * 10) + ' h40', '#cbd5e1', 1.8);
    } else if (o.shape === 'board') {
      s += box(10, 26, 100, 58, o.surface || '#f8fafc', 4, 'stroke="' + (o.frame || '#94a3b8') + '" stroke-width="3"');
      if (o.writing) {
        s += ps(o.writing, o.ink || '#1d4ed8', 3);
      } else {
        s += ps('M24,44 h44 M24,58 h60 M24,70 h30', '#94a3b8', 2.4, 'opacity=".6"');
      }
      s += box(24, 86, 72, 10, o.tray || '#cbd5e1', 3);
    } else if (o.shape === 'cabinet') {
      s += box(20, 18, 80, 84, o.body || '#a8a29e', 5, 'stroke="#57534e" stroke-width="2"');
      for (var dr = 0; dr < 3; dr++) {
        s += box(26, 24 + dr * 26, 68, 22, o.drawer || '#cbd5e1', 3, 'stroke="#78716c" stroke-width="1.4"');
        s += box(50, 33 + dr * 26, 20, 5, '#57534e', 2.5);
        if (o.label) s += box(30, 28 + dr * 26, 16, 10, '#fdfdff', 2);
      }
    } else if (o.shape === 'mouse') {
      s += e(60, 62, 30, 38, o.body || '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M60,26 v22', '#94a3b8', 2);
      s += box(52, 30, 16, 12, o.wheel || '#0f172a', 6);
      s += e(60, 88, 12, 6, o.glow || '#38bdf8', 'opacity=".35"');
    } else if (o.shape === 'keyboard') {
      s += box(10, 44, 100, 40, o.body || '#334155', 6, 'stroke="#1f2937" stroke-width="2"');
      for (var ky = 0; ky < 4; ky++) {
        for (var kx = 0; kx < 10; kx++) {
          s += box(16 + kx * 9, 50 + ky * 9, 7, 7, o.key || '#e2e8f0', 1.5);
        }
      }
      s += box(44, 86, 32, 5, o.accent || '#38bdf8', 2);
    } else if (o.shape === 'drawer') {
      s += box(14, 40, 92, 44, o.front || '#cbd5e1', 5, 'stroke="#64748b" stroke-width="2"');
      s += box(44, 58, 32, 8, '#475569', 4);
      s += box(10, 36, 20, 52, o.side || '#94a3b8', 4, 'stroke="#64748b" stroke-width="1.6"');
      s += ps('M20,60 h0', '#475569', 2);
    } else if (o.shape === 'shelf') {
      s += box(12, 54, 96, 10, o.board || '#a16207', 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(12, 20, 10, 72, o.side || '#8a5a33', 2);
      s += box(98, 20, 10, 72, o.side || '#8a5a33', 2);
      s += box(24, 24, 20, 28, o.item || '#ef4444', 2, 'stroke="#991b1b" stroke-width="1.4"');
      s += box(50, 30, 18, 22, '#3b82f6', 2);
      s += box(74, 26, 16, 26, '#22c55e', 2);
    } else if (o.shape === 'sofa') {
      s += box(12, 40, 96, 34, o.seat || '#6366f1', 8, 'stroke="#4338ca" stroke-width="2"');
      s += box(20, 24, 80, 22, o.back || '#818cf8', 8, 'stroke="#4338ca" stroke-width="2"');
      s += box(6, 44, 18, 30, o.arm || '#4f46e5', 6, 'stroke="#4338ca" stroke-width="1.6"');
      s += box(96, 44, 18, 30, o.arm || '#4f46e5', 6, 'stroke="#4338ca" stroke-width="1.6"');
      s += ps('M20,74 v12 M100,74 v12', '#4338ca', 5);
    } else if (o.shape === 'copier') {
      s += box(14, 20, 92, 66, o.body || '#cbd5e1', 6, 'stroke="#64748b" stroke-width="2"');
      s += box(24, 30, 72, 18, o.panel || '#1f2937', 3);
      s += box(30, 34, 24, 10, '#4ade80', 2);
      s += box(66, 34, 24, 10, '#334155', 2);
      s += box(20, 56, 80, 8, '#94a3b8', 2);
      s += box(26, 66, 60, 20, '#fdfdff', 2, 'stroke="#94a3b8" stroke-width="1.4"');
      s += box(30, 86, 60, 10, o.tray || '#64748b', 3);
    } else if (o.shape === 'calculator') {
      s += '<g transform="rotate(-10 60 60)">';
      s += box(30, 18, 60, 84, o.body || '#334155', 8, 'stroke="#1f2937" stroke-width="2"');
      s += box(38, 26, 44, 20, o.screen || '#86efac', 3, 'stroke="#1f2937" stroke-width="1.4"');
      for (var ky = 0; ky < 12; ky++) {
        s += box(38 + (ky % 3) * 15, 52 + Math.floor(ky / 3) * 12, 12, 9,
          ky % 4 === 3 ? (o.key || '#f59e0b') : '#e2e8f0', 2);
      }
      s += '</g>';
    } else if (o.shape === 'calendar') {
      s += box(14, 24, 92, 76, '#fdfdff', 5, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(14, 24, 92, 20, o.head || '#dc2626', 5, 'stroke="#b91c1c" stroke-width="1.6"');
      s += c(60, 30, 4, '#fdfdff') + c(60, 38, 4, '#fdfdff');
      /* A term is a quarter of the year, a semester a half: the highlighted
         cells are what tell them apart, since the calendar is the same object. */
      var span = o.span || 1;
      var marked = 0;
      for (var cw = 0; cw < 4; cw++) {
        for (var cd = 0; cd < 5; cd++) {
          var on = marked < span;
          s += box(22 + cd * 17, 52 + cw * 11, 12, 8, on ? (o.mark || '#f59e0b') : '#e2e8f0', 1.5);
          if (on) marked++;
        }
      }
    } else if (o.shape === 'diary') {
      s += box(22, 20, 78, 82, o.cover || '#0d9488', 5, 'stroke="#0f766e" stroke-width="2"');
      s += box(30, 28, 62, 66, '#fdfdff', 2);
      for (var dy = 0; dy < 6; dy++) s += ps('M36,' + (40 + dy * 9) + ' h50', '#cbd5e1', 1.6);
      s += box(14, 20, 12, 82, '#0f766e', 3);
      s += box(84, 32, 12, 18, o.strap || '#f59e0b', 3);
    } else if (o.shape === 'pin') {
      s += c(60, 34, 22, o.head || '#ef4444', 'stroke="#b91c1c" stroke-width="2"');
      s += c(60, 34, 8, '#fecaca');
      s += ps('M60,56 L60,96', metal, 4);
      s += pl('56,96 64,96 60,104', '#94a3b8');
    } else if (o.shape === 'band') {
      s += c(44, 60, 26, o.ring || '#f59e0b', 'stroke="#b45309" stroke-width="2"');
      s += c(44, 60, 14, '#0f172a');
      s += c(76, 60, 26, o.ring2 || '#f59e0b', 'stroke="#b45309" stroke-width="2"');
      s += c(76, 60, 14, '#0f172a');
    } else if (o.shape === 'punch') {
      s += box(34, 40, 52, 30, o.body || '#475569', 5, 'stroke="#1f2937" stroke-width="2"');
      s += box(44, 70, 32, 12, '#1f2937', 3);
      s += box(52, 82, 16, 18, metal, 3, 'stroke="#64748b" stroke-width="1.6"');
      s += box(30, 30, 24, 12, '#94a3b8', 3, 'stroke="#64748b" stroke-width="1.4"');
    } else if (o.shape === 'staple') {
      s += ps('M32,72 L32,36 L88,36 L88,72', metal, 6);
      s += ps('M32,72 h56', '#64748b', 3);
      s += box(46, 80, 28, 8, '#cbd5e1', 2, 'stroke="#94a3b8" stroke-width="1.4"');
    } else if (o.shape === 'letter') {
      s += box(16, 26, 88, 66, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += ps('M16,28 L60,58 L104,28', '#cbd5e1', 2);
      s += box(60, 62, 34, 24, o.stamp || '#f59e0b', 2, 'stroke="#b45309" stroke-width="1.4"');
      s += box(24, 60, 30, 22, o.address || '#e2e8f0', 2);
    } else if (o.shape === 'parcel') {
      s += box(18, 32, 84, 62, o.card || '#c8a06a', 4, 'stroke="#8a6a3a" stroke-width="2"');
      s += box(18, 32, 84, 18, '#a8763f', 3, 'stroke="#8a6a3a" stroke-width="1.6"');
      s += box(54, 32, 12, 62, o.tape || '#e2e8f0', 2, 'stroke="#cbd5e1" stroke-width="1.4"');
      s += box(28, 58, 30, 24, '#fdfdff', 2, 'stroke="#cbd5e1" stroke-width="1.4"');
      s += ps('M32,68 h22 M32,76 h16', '#94a3b8', 1.6);
    } else if (o.shape === 'signature') {
      s += box(16, 34, 88, 54, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += ps('M26,74 C34,50 40,80 48,60 C54,46 58,78 64,62 C70,48 74,76 82,58 C88,44 92,70 98,62',
        o.ink || '#1d4ed8', 2.8);
      s += ps('M26,82 h64', '#cbd5e1', 1.4, 'stroke-dasharray="3 3"');
    } else if (o.shape === 'document') {
      s += p('M22,16 L74,16 L98,42 L98,102 L22,102 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"');
      s += p('M74,16 L98,42 L74,42 Z', '#e2e8f0', 'stroke="#cbd5e1" stroke-width="1.6"');
      for (var dl = 0; dl < 5; dl++) s += ps('M32,' + (38 + dl * 12) + ' h52', '#cbd5e1', 1.8);
      if (o.seal) s += c(84, 88, 12, o.seal, 'opacity=".85"');
    } else if (o.shape === 'chart') {
      s += box(12, 16, 96, 86, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += ps('M24,90 h72 M24,90 v-56', '#94a3b8', 2);
      var bars = o.bars || [30, 52, 38, 66];
      for (var bb = 0; bb < bars.length; bb++) {
        s += box(30 + bb * 16, 90 - bars[bb], 11, bars[bb], o.series || '#3b82f6', 2);
      }
      s += ps('M24,60 L96,60', '#e2e8f0', 1.4, 'stroke-dasharray="3 3"');
    } else if (o.shape === 'slide') {
      s += box(10, 22, 100, 62, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(18, 32, 42, 8, o.title || '#1f2937', 2);
      s += ps('M22,52 h34 M22,62 h46 M22,72 h28', '#cbd5e1', 2.4);
      s += c(84, 58, 14, '#dbeafe', 'stroke="#93c5fd" stroke-width="2"');
      s += box(46, 88, 28, 10, '#94a3b8', 3);
    } else if (o.shape === 'meeting') {
      s += box(10, 56, 100, 12, o.table || '#a16207', 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M20,68 v30 M100,68 v30', '#6b4423', 5);
      s += '<g transform="translate(-16 0)">' + miniPerson('#3b82f6', '#2f2a3d', false) + '</g>';
      s += '<g transform="translate(44 0)">' + miniPerson('#f59e0b', '#8a5a33', false) + '</g>';
      s += '<g transform="translate(-4 0)">' + miniPerson('#22c55e', '#4a3728', true) + '</g>';
    } else if (o.shape === 'order') {
      s += box(20, 16, 80, 88, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(20, 16, 80, 16, o.head || '#0ea5e9', 3, 'stroke="#0369a1" stroke-width="1.6"');
      for (var ol = 0; ol < 4; ol++) s += ps('M30,' + (46 + ol * 13) + ' h' + (60 - ol * 8), '#cbd5e1', 2);
      s += c(84, 92, 8, '#16a34a', 'opacity=".8"');
    } else if (o.shape === 'coins') {
      s += e(60, 74, 40, 20, o.gold || '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += c(60, 68, 26, o.gold || '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += c(60, 68, 16, '#fef3c7', 'stroke="#b45309" stroke-width="1.6"');
      s += ps('M60,56 v24 M48,68 h24', '#b45309', 2.4);
      s += e(40, 92, 16, 8, '#fde68a', 'stroke="#b45309" stroke-width="1.4"');
      s += e(80, 92, 16, 8, '#fde68a', 'stroke="#b45309" stroke-width="1.4"');
    } else if (o.shape === 'invoice') {
      s += p('M22,14 L76,14 L98,38 L98,104 L22,104 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"');
      s += p('M76,14 L98,38 L76,38 Z', '#e2e8f0', 'stroke="#cbd5e1" stroke-width="1.6"');
      for (var il = 0; il < 3; il++) s += ps('M' + '30,' + (56 + il * 11) + ' h44', '#cbd5e1', 1.8);
      s += ps('M30,92 h30', '#334155', 2.4);
      s += c(84, 86, 11, o.mark || '#16a34a', 'opacity=".85"');
    } else if (o.shape === 'form') {
      s += box(16, 18, 88, 84, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      for (var fm = 0; fm < 4; fm++) {
        s += box(26, 30 + fm * 18, 10, 10, '#fdfdff', 2, 'stroke="#94a3b8" stroke-width="1.6"');
        s += box(44, 33 + fm * 18, 48, 5, '#cbd5e1', 2);
        if (fm === 1) s += ps('M28,36 l4,4 l6,-7', '#16a34a', 2);
      }
    } else if (o.shape === 'clipboard') {
      s += '<g transform="rotate(-8 60 60)">';
      s += box(26, 24, 68, 80, o.board || '#92400e', 5, 'stroke="#6b4423" stroke-width="2"');
      s += box(32, 30, 56, 68, '#fdfdff', 2);
      s += box(48, 16, 24, 14, '#475569', 3, 'stroke="#1f2937" stroke-width="1.6"');
      for (var cp = 0; cp < 5; cp++) s += ps('M38,' + (44 + cp * 11) + ' h44', '#cbd5e1', 1.8);
      s += '</g>';
    } else if (o.shape === 'briefcase') {
      s += box(12, 40, 96, 56, o.body || '#78350f', 6, 'stroke="#451a03" stroke-width="2"');
      s += ps('M40,40 v-8 a20,14 0 0 1 40,0 v8', '#451a03', 5);
      s += box(12, 58, 96, 12, '#451a03', 2);
      s += box(52, 54, 16, 20, '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.6"');
      s += c(60, 64, 3, '#451a03');
    } else if (o.shape === 'bin') {
      s += p('M28,40 L92,40 L84,102 C84,106 80,108 76,108 L44,108 C40,108 36,106 36,102 Z',
        o.body || '#64748b', 'stroke="#475569" stroke-width="2"');
      for (var bv = 0; bv < 4; bv++) s += ps('M' + (40 + bv * 12) + ',50 l' + (bv * -1) + ',48', '#475569', 2, 'opacity=".6"');
      s += box(24, 30, 72, 12, o.lid || '#475569', 4, 'stroke="#1f2937" stroke-width="1.6"');
      s += c(60, 24, 6, '#1f2937');
    }
    return s;
  });

  /** A screen with a symbol on it: the part of a device that matters. */
  kind('screen', function (o) {
    var bezel = o.bezel || '#1f2937';
    var s = shadow(100, o.wide || 32, 0.08);
    if (o.stand) {
      s += box(o.standX || 44, 82, 32, 8, bezel, 2);
      s += box((o.standX || 44) + 10, 70, 12, 14, '#475569', 2);
    }
    s += box(14, o.top || 16, 92, o.h || 62, bezel, 6, 'stroke="#0f172a" stroke-width="2"');
    s += box(20, (o.top || 16) + 6, 80, (o.h || 62) - 14, o.screen || '#0f172a', 2);
    var cxp = 60, cyp = (o.top || 16) + (o.h || 62) / 2 - 1;
    var g = SCREENGLYPH[o.glyph];
    if (g) s += g(cxp, cyp, o.ink || '#f8fafc', o.ink2 || o.accent || '#38bdf8');
    else s += ps('M30,' + cyp + ' h60', '#334155', 2.4);
    if (o.light) s += e(20, (o.top || 16) + 4, 8, 2, '#ffffff', 'opacity=".3"');
    return s;
  });

  /** The symbol drawn inside a screen, and the other display shapes. */
  var SCREENGLYPH = {
    text: function (x, y, ink, acc) {
      return ps('M' + (x - 30) + ',' + (y - 8) + ' h60 M' + (x - 30) + ',' + y + ' h60 M' + (x - 30) + ',' + (y + 8) + ' h34', ink, 3);
    },
    chart: function (x, y, ink, acc) {
      var s = '';
      var h = [10, 20, 14, 26];
      for (var i = 0; i < 4; i++) s += box(x - 26 + i * 14, y + 12 - h[i], 9, h[i], i === 3 ? acc : ink, 1.5);
      return s;
    },
    play: function (x, y) { return pl((x - 8) + ',' + (y - 14) + ' ' + (x + 16) + ',' + y + ' ' + (x - 8) + ',' + (y + 14), '#f8fafc'); },
    pause: function (x, y) { return box(x - 12, y - 14, 8, 28, '#f8fafc', 1.5) + box(x + 4, y - 14, 8, 28, '#f8fafc', 1.5); },
    laptop: function (x, y) {
      return box(x - 22, y - 10, 44, 24, '#f8fafc', 3) +
        box(x - 18, y - 6, 36, 16, '#1e3a8a', 2) +
        box(x - 30, y + 16, 60, 5, '#cbd5e1', 2);
    },
    nodes: function (x, y) {
      var s = ps('M' + (x - 18) + ',' + y + ' h36 M' + x + ',' + (y - 14) + ' v28', '#f8fafc', 2.4);
      s += c(x - 18, y, 6, '#4ade80') + c(x + 18, y, 6, '#4ade80');
      s += c(x, y - 14, 6, '#38bdf8') + c(x, y + 14, 6, '#38bdf8');
      return s;
    },
    music: function (x, y) {
      return ps('M' + (x + 10) + ',' + (y - 18) + ' v26', '#f8fafc', 3) +
        e(x + 4, y + 10, 8, 6, '#f8fafc') + e(x + 16, y + 6, 7, 5, '#f8fafc') +
        ps('M' + (x + 12) + ',' + (y - 18) + ' l14,4', '#f8fafc', 3);
    },
    code: function (x, y) {
      return ps('M' + (x - 4) + ',' + (y - 12) + ' l-14,12 l14,12 M' + (x + 4) + ',' + (y - 12) + ' l14,12 l-14,12', '#f8fafc', 3);
    },
    grid: function (x, y) {
      var s = '';
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
        s += box(x - 24 + j * 26, y - 22 + i * 24, 20, 18, i ? '#334155' : '#1e40af', 3);
      }
      return s;
    },
    bulb: function (x, y) {
      return c(x, y - 6, 12, '#fbbf24') + box(x - 6, y + 6, 12, 10, '#94a3b8', 2);
    },
    sun: function (x, y, ink, acc) {
      /* The UV index: a sun, read on a screen. The rays are what say "sun" —
         the disc alone is a dot, and a disc is also what `bulb` next door is.
         The rays are the difference between the two words. */
      var t = acc || '#fbbf24';
      var s = c(x, y, 9, t);
      for (var r = 0; r < 8; r++) {
        var a = (r * Math.PI) / 4;
        s += ps('M' + (x + Math.cos(a) * 12).toFixed(1) + ',' + (y + Math.sin(a) * 12).toFixed(1) +
          ' L' + (x + Math.cos(a) * 19).toFixed(1) + ',' + (y + Math.sin(a) * 19).toFixed(1), t, 2.6);
      }
      return s;
    },
    phone: function (x, y) {
      return box(x - 12, y - 20, 24, 40, '#f8fafc', 5) + box(x - 8, y - 14, 16, 28, '#1e40af', 2);
    },
    mail: function (x, y) {
      return box(x - 24, y - 16, 48, 32, '#f8fafc', 3) + ps('M' + (x - 24) + ',' + (y - 16) + ' l24,18 l24,-18', '#1e40af', 2.4);
    },
    search: function (x, y) {
      return c(x - 4, y - 4, 14, 'none', 'stroke="#f8fafc" stroke-width="4"') +
        ps('M' + (x + 7) + ',' + (y + 7) + ' l14,14', '#f8fafc', 5);
    },
    lock: function (x, y) {
      return box(x - 16, y - 6, 32, 26, '#f59e0b', 4) + ps('M' + (x - 8) + ',' + (y - 6) + ' v-8 a8,8 0 0 1 16,0 v8', '#f8fafc', 3.4);
    },
    globe: function (x, y) {
      return c(x, y, 20, 'none', 'stroke="#f8fafc" stroke-width="3"') +
        c(x, y, 20, 'none', 'stroke="#f8fafc" stroke-width="2"') +
        ps('M' + (x - 20) + ',' + y + ' h40', '#f8fafc', 2) +
        e(x, y, 9, 20, 'none', 'stroke="#f8fafc" stroke-width="2"');
    },
    cloud: function (x, y) {
      return c(x - 12, y + 4, 12, '#f8fafc') + c(x + 2, y - 4, 16, '#f8fafc') + c(x + 16, y + 4, 12, '#f8fafc') +
        box(x - 24, y + 4, 52, 12, '#f8fafc', 3);
    },
    warn: function (x, y) {
      return pl(x + ',' + (y - 20) + ' ' + (x + 22) + ',' + (y + 16) + ' ' + (x - 22) + ',' + (y + 16), '#fbbf24') +
        ps('M' + x + ',' + (y - 8) + ' v12 M' + x + ',' + (y + 9) + ' v0.1', '#78350f', 3);
    },
    key: function (x, y) {
      return c(x - 12, y, 9, 'none', 'stroke="#f8fafc" stroke-width="3.4"') +
        ps('M' + (x - 3) + ',' + y + ' h26 M' + (x + 15) + ',' + y + ' v8 M' + (x + 23) + ',' + y + ' v8', '#f8fafc', 3.4);
    },
    wifi: function (x, y) {
      var s = c(x, y + 14, 4, '#f8fafc');
      for (var i = 1; i <= 3; i++) {
        s += ps('M' + (x - 10 * i) + ',' + (y + 10 - 8 * i) + ' a' + (10 * i) + ',' + (8 * i) + ' 0 0 1 ' + (20 * i) + ',0',
          '#f8fafc', 3);
      }
      return s;
    },
    battery: function (x, y) {
      return box(x - 22, y - 12, 44, 24, 'none', 3, 'stroke="#f8fafc" stroke-width="3"') +
        box(x - 18, y - 8, 24, 16, '#4ade80', 2) + box(x + 22, y - 6, 5, 12, '#f8fafc', 1.5);
    },
    folder: function (x, y) {
      return p('M' + (x - 26) + ',' + (y - 14) + ' l16,0 l6,6 l30,0 l0,22 l-52,0 Z', '#fbbf24');
    },
    doc: function (x, y) {
      return p('M' + (x - 16) + ',' + (y - 20) + ' l20,0 l14,14 l0,26 l-34,0 Z', '#f8fafc', 'stroke="#94a3b8" stroke-width="1.6"');
    },
    camera: function (x, y) {
      return box(x - 26, y - 12, 52, 32, '#f8fafc', 5) + box(x - 12, y - 20, 24, 10, '#f8fafc', 3) +
        c(x, y + 4, 11, '#1e40af');
    },
    mic: function (x, y) {
      return e(x, y - 6, 9, 16, '#f8fafc') + ps('M' + (x - 16) + ',' + (y - 4) + ' a16,16 0 0 0 32,0 M' + x + ',' + (y + 12) + ' v10',
        '#f8fafc', 3);
    },
    speaker: function (x, y) {
      return p('M' + (x - 22) + ',' + (y - 7) + ' l10,0 l12,-12 l0,38 l-12,-12 l-10,0 Z', '#f8fafc') +
        ps('M' + (x + 6) + ',' + (y - 10) + ' a14,14 0 0 1 0,20 M' + (x + 14) + ',' + (y - 18) + ' a24,24 0 0 1 0,36', '#f8fafc', 3);
    },
    camera2: function (x, y) {
      return c(x, y, 20, 'none', 'stroke="#f8fafc" stroke-width="3"') + c(x, y, 9, '#f8fafc') + c(x + 7, y - 7, 4, '#f8fafc');
    },
    projector: function (x, y) {
      return box(x - 28, y - 14, 56, 28, '#f8fafc', 5) + c(x - 14, y, 9, '#1e40af') + c(x + 10, y - 4, 5, '#94a3b8');
    },
    stack: function (x, y) {
      return box(x - 24, y - 18, 48, 12, '#f8fafc', 3) + box(x - 24, y - 6, 48, 12, '#cbd5e1', 3) + box(x - 24, y + 6, 48, 12, '#94a3b8', 3);
    },
    plug: function (x, y) {
      return box(x - 18, y - 6, 36, 22, '#f8fafc', 4) + box(x - 10, y - 20, 6, 14, '#f8fafc', 2) + box(x + 4, y - 20, 6, 14, '#f8fafc', 2);
    },
    signal: function (x, y) {
      var s = '';
      for (var i = 0; i < 4; i++) s += box(x - 22 + i * 12, y + 14 - (i + 1) * 7, 8, (i + 1) * 7, i < 3 ? '#4ade80' : '#475569', 1.5);
      return s;
    },
    download: function (x, y) {
      return ps('M' + x + ',' + (y - 20) + ' v26 M' + (x - 12) + ',' + (y - 4) + ' l12,12 l12,-12 M' + (x - 18) + ',' + (y + 18) + ' h36', '#f8fafc', 3.4);
    },
    upload: function (x, y) {
      return ps('M' + x + ',' + (y + 18) + ' v-26 M' + (x - 12) + ',' + (y + 2) + ' l12,-12 l12,12 M' + (x - 18) + ',' + (y - 18) + ' h36', '#f8fafc', 3.4);
    },
    user: function (x, y) {
      return c(x, y - 10, 11, '#f8fafc') + e(x, y + 18, 20, 16, '#f8fafc');
    },
    users: function (x, y) {
      return c(x - 12, y - 8, 9, '#f8fafc') + e(x - 12, y + 16, 16, 13, '#f8fafc') +
        c(x + 14, y - 10, 11, '#f8fafc') + e(x + 14, y + 18, 19, 15, '#f8fafc');
    },
    talk: function (x, y) {
      return p('M' + (x - 24) + ',' + (y - 16) + ' l48,0 l0,26 l-12,0 l-8,10 l-8,-10 l-20,0 Z', '#f8fafc');
    },
    talk2: function (x, y) {
      return p('M' + (x - 26) + ',' + (y - 20) + ' l44,0 l0,22 l-10,0 l-7,9 l-7,-9 l-20,0 Z', '#f8fafc', 'opacity=".9"') +
        p('M' + (x - 8) + ',' + (y + 2) + ' l40,0 l0,20 l-9,0 l-6,8 l-6,-8 l-19,0 Z', '#94a3b8', 'opacity=".9"');
    },
    wave: function (x, y) {
      return ps('M' + (x - 26) + ',' + y + ' q6,-14 12,0 q6,14 12,0 q6,-14 12,0 q6,14 12,0', '#f8fafc', 3.4);
    },
    heart: function (x, y) {
      return c(x - 9, y - 5, 9, '#f87171') + c(x + 9, y - 5, 9, '#f87171') + c(x, y + 6, 9, '#f87171');
    },
    star: function (x, y) {
      return pl(x + ',' + (y - 26) + ' ' + (x + 6) + ',' + (y - 8) + ' ' + (x + 26) + ',' + (y - 7) +
        ' ' + (x + 13) + ',' + (y + 6) + ' ' + (x + 16) + ',' + (y + 24) + ' ' + x + ',' + (y + 14) +
        ' ' + (x - 16) + ',' + (y + 24) + ' ' + (x - 13) + ',' + (y + 6) + ' ' + (x - 26) + ',' + (y - 7) +
        ' ' + (x - 8) + ',' + (y - 8), '#fbbf24');
    },
    pin: function (x, y) {
      return p('M' + x + ',' + (y + 20) + ' c-10,-14 -16,-20 -16,-30 a16,16 0 0 1 32,0 c0,10 -6,16 -16,30 Z', '#f87171');
    },
    clock: function (x, y) {
      return c(x, y, 20, 'none', 'stroke="#f8fafc" stroke-width="3"') + ps('M' + x + ',' + (y - 11) + ' v11 l8,5', '#f8fafc', 3);
    },
    smile: function (x, y) {
      return c(x, y, 20, '#f8fafc') + c(x - 7, y - 5, 2.6, '#1f2937') + c(x + 7, y - 5, 2.6, '#1f2937') +
        ps('M' + (x - 8) + ',' + (y + 5) + ' q8,8 16,0', '#1f2937', 2.6);
    },
    news: function (x, y) {
      return box(x - 24, y - 20, 48, 40, '#f8fafc', 3) + box(x - 18, y - 14, 36, 10, '#dc2626', 2) +
        box(x - 18, y + 0, 16, 6, '#94a3b8', 1.5) + box(x + 2, y + 0, 16, 6, '#94a3b8', 1.5) +
        box(x - 18, y + 10, 36, 6, '#cbd5e1', 1.5);
    },
    megaphone: function (x, y) {
      return p('M' + (x - 18) + ',' + (y - 8) + ' l30,-14 l0,44 l-30,-14 Z', '#f8fafc') +
        box(x - 26, y - 8, 10, 22, '#f8fafc', 2) + ps('M' + (x + 16) + ',' + (y + 20) + ' q8,6 0,12', '#f8fafc', 2.6);
    },
    newsprint: function (x, y) {
      return p('M' + (x - 22) + ',' + (y - 20) + ' l44,0 l0,40 l-44,0 Z', '#f8fafc', 'stroke="#94a3b8" stroke-width="1.6"') +
        box(x - 16, y - 14, 32, 6, '#0f172a', 1.5) + box(x - 16, y - 4, 14, 16, '#cbd5e1', 1.5) +
        box(x + 2, y - 4, 14, 16, '#cbd5e1', 1.5);
    },
    record: function (x, y) {
      return c(x, y, 22, '#1f2937') + c(x, y, 7, '#f8fafc') + c(x, y, 2.4, '#1f2937') +
        c(x, y, 15, 'none', 'stroke="#4b5563" stroke-width="1.4"');
    },
    podium: function (x, y) {
      return p('M' + (x - 24) + ',' + (y - 18) + ' l48,0 l0,36 l-48,0 Z', '#a16207', 'stroke="#6b4423" stroke-width="2"');
    }
  };

  /** A small figure, for scenes made of people. */
  function miniPerson(shirt, hair, seated) {
    var s = '';
    if (seated) {
      s += c(60, 40, 12, SKIN);
      s += p('M46,52 C46,48 50,46 60,46 C70,46 74,48 74,52 L74,72 C74,76 70,78 60,78 C50,78 46,76 46,72 Z', shirt);
      s += ps('M60,78 L60,92 M60,92 L48,96 M60,92 L72,96', '#334155', 5);
    } else {
      s += c(60, 34, 12, SKIN);
      s += p('M48,46 C48,42 52,40 60,40 C68,40 72,42 72,46 L74,70 C74,74 70,76 60,76 C50,76 46,74 46,70 Z', shirt);
      s += ps('M60,76 L60,96', '#334155', 6);
      s += ps('M52,98 h16 M68,98 h16', '#1f2937', 5);
    }
    s += p('M47,32 C47,22 73,22 73,32 C67,27 53,27 47,32 Z', hair);
    s += c(55, 33, 1.8, NIGHT) + c(65, 33, 1.8, NIGHT);
    return s;
  }


  /* ================================================================== *
   * Work and study: school, devices, messages, the media that carries them
   * ================================================================== */

  /** A schoolroom object: a board, a book, a piece of kit for a bag. */
  kind('school', function (o) {
    var s = shadow(100, o.wide || 26, 0.08);
    if (o.shape === 'deskpupil') {
      s += box(16, 62, 88, 12, o.desk || '#a16207', 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M26,74 v22 M94,74 v22', '#6b4423', 5);
      s += miniPerson(o.shirt || '#3b82f6', o.hair || '#2f2a3d', true);
      s += box(78, 48, 28, 16, '#fdfdff', 2, 'stroke="#cbd5e1" stroke-width="1.4"');
      s += box(38, 36, 44, 24, o.board || '#2f4f3f', 3, 'stroke="#1f2937" stroke-width="2"');
      s += ps('M46,46 h22 M46,54 h14', '#fdfdff', 2, 'opacity=".7"');
    } else if (o.shape === 'pupil') {
      s += c(60, 30, 22, SKIN, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += p('M44,32 C44,20 76,20 76,32 C70,26 50,26 44,32 Z', o.hair || '#3a2f2a');
      s += c(52, 32, 2.4, NIGHT) + c(68, 32, 2.4, NIGHT);
      s += ps('M54,42 q6,5 12,0', '#a3506a', 2.4);
      s += p('M34,86 C34,62 86,62 86,86 Z', o.shirt || '#3b82f6', 'stroke="#1d4ed8" stroke-width="2"');
      s += rc(24, 48, 12, 34, o.shirt || '#3b82f6', 6);
      s += c(30, 50, 7, SKIN);
      for (var fr = 0; fr < 4; fr++) s += e(24 + fr * 3, 42 - fr * 5, 3.4, 5, SKIN);
      s += c(92, 80, 7, SKIN);
    } else if (o.shape === 'room') {
      s += box(8, 20, 104, 76, o.wall || '#fef3c7', 5, 'stroke="#d6c9a8" stroke-width="2"');
      s += box(16, 30, 56, 34, o.board || '#2f4f3f', 3, 'stroke="#1f2937" stroke-width="2"');
      s += ps('M24,42 h32 M24,52 h22', '#fdfdff', 2.4, 'opacity=".8"');
      s += box(80, 34, 26, 40, o.window || '#bae6fd', 3, 'stroke="#0369a1" stroke-width="2"');
      s += ps('M93,34 v40 M80,54 h26', '#0369a1', 2);
      s += box(16, 62, 60, 12, o.desk || '#a16207', 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M22,74 v18 M70,74 v18', '#6b4423', 4);
      s += miniPerson('#3b82f6', '#2f2a3d', true);
      s += c(40, 46, 4, '#f8fafc');
    } else if (o.shape === 'board') {
      s += box(8, 18, 104, 62, o.frame || '#a16207', 5, 'stroke="#6b4423" stroke-width="2"');
      s += box(14, 24, 92, 50, o.surface || '#2f4f3f', 2);
      if (o.writing) s += ps(o.writing, o.chalk || '#fdfdff', 3);
      else s += ps('M24,40 h40 M24,52 h60 M24,64 h28', '#fdfdff', 2.6, 'opacity=".8"');
      s += box(22, 84, 76, 8, '#6b4423', 2);
      for (var ch = 0; ch < 3; ch++) s += box(30 + ch * 22, 88, 14, 5, o.chalkbar || '#fdfdff', 2);
    } else if (o.shape === 'writing') {
      s += '<g transform="rotate(20 60 60)">';
      s += rc(48, 20, 14, 58, o.body || '#f59e0b', 3, 'stroke="#b45309" stroke-width="1.6"');
      s += p('M52,78 L58,78 L60,96 L54,96 Z', '#f5e6c8');
      s += pl('54,96 66,96 60,106', '#2f2a3d');
      s += box(44, 26, 22, 6, o.band || '#64748b', 2);
      s += '</g>';
    } else if (o.shape === 'book') {
      s += p('M18,26 L56,34 L56,96 L18,88 Z', o.left || '#2563eb', 'stroke="#1e40af" stroke-width="2"');
      s += p('M102,26 L64,34 L64,96 L102,88 Z', o.right || '#1d4ed8', 'stroke="#1e3a8a" stroke-width="2"');
      s += p('M24,32 L52,38 L52,88 L24,82 Z', '#fdfdff', 'opacity=".9"');
      s += ps('M60,34 v62', '#0f172a', 2);
      for (var pg = 0; pg < 4; pg++) {
        s += ps('M30,' + (44 + pg * 10) + ' l18,2', '#cbd5e1', 1.6);
      }
    } else if (o.shape === 'bag') {
      s += box(14, 34, 92, 66, o.body || '#dc2626', 8, 'stroke="#b91c1c" stroke-width="2"');
      s += box(14, 46, 92, 20, o.flap || '#b91c1c', 6, 'stroke="#991b1b" stroke-width="1.6"');
      s += box(48, 56, 24, 18, '#fbbf24', 4, 'stroke="#b45309" stroke-width="1.6"');
      s += ps('M32,34 C32,18 88,18 88,34', '#991b1b', 5);
      s += box(20, 84, 20, 16, '#0f172a', 4);
    } else if (o.shape === 'lunchbox') {
      s += box(20, 44, 80, 46, o.body || '#22c55e', 8, 'stroke="#15803d" stroke-width="2"');
      s += box(20, 44, 80, 16, o.lid || '#16a34a', 6, 'stroke="#15803d" stroke-width="1.6"');
      s += box(48, 36, 24, 10, '#166534', 3);
      s += box(34, 66, 52, 16, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="1.4"');
      s += ps('M48,74 h24', '#94a3b8', 1.8);
    } else if (o.shape === 'pencilcase') {
      s += box(14, 46, 92, 34, o.body || '#8b5cf6', 10, 'stroke="#6d28d9" stroke-width="2"');
      s += ps('M14,54 h92', '#6d28d9', 2.4);
      s += c(100, 56, 4, '#fbbf24');
      s += box(20, 62, 26, 10, '#fdfdff', 3, 'stroke="#c4b5fd" stroke-width="1.4"');
    } else if (o.shape === 'gluestick') {
      s += box(44, 36, 32, 60, o.body || '#f59e0b', 4, 'stroke="#b45309" stroke-width="2"');
      s += box(44, 36, 32, 14, o.cap || '#1f2937', 3, 'stroke="#0f172a" stroke-width="1.6"');
      s += box(48, 58, 24, 26, '#fdfdff', 2);
      s += c(60, 71, 7, '#0ea5e9', 'opacity=".8"');
    } else if (o.shape === 'crayon') {
      s += p('M40,26 L80,26 L80,92 L40,92 Z', o.body || '#dc2626', 'stroke="#991b1b" stroke-width="2"');
      s += p('M40,26 L60,8 L80,26 Z', '#fca5a5', 'stroke="#991b1b" stroke-width="1.6"');
      s += box(40, 42, 40, 24, '#fdfdff', 2);
      s += box(40, 72, 40, 20, '#fda4af', 2);
    } else if (o.shape === 'compass') {
      /* A divider, hinged at the top. The horizontal bar this had between the
         feet is what made it read as a tent: a compass has nothing joining its
         two legs except the hinge. */
      s += ps('M34,94 L60,20 L86,94', '#475569', 3.4);
      s += ps('M40,94 L34,98 M80,94 L86,98', '#334155', 2.6);
      s += c(60, 20, 5.5, '#dc2626', 'stroke="#fdfdff" stroke-width="1.4"');
      s += c(60, 20, 1.6, '#7f1d1d');
      s += ps('M60,26 v10', '#94a3b8', 1.8);
    } else if (o.shape === 'geometry') {
      s += box(14, 34, 92, 56, o.box || '#0ea9e9', 5, 'stroke="#0369a1" stroke-width="2"');
      s += box(20, 40, 80, 44, '#fdfdff', 2);
      s += pl('30,78,46,48,62,78', '#dc2626');
      s += box(66, 56, 12, 22, '#f59e0b');
      s += c(40, 54, 7, '#22c55e');
    } else if (o.shape === 'map') {
      s += p('M14,24 L44,32 L76,22 L106,32 L106,96 L76,86 L44,96 L14,86 Z',
        o.paper || '#fdf6e8', 'stroke="#c8b89a" stroke-width="2"');
      s += ps('M44,32 v64 M76,22 v64', '#c8b89a', 1.6);
      s += ps('M22,44 q10,-8 18,2 q10,10 4,20 q-8,10 -20,4 Z', '#7dd3fc', 2.4, 'opacity=".9"');
      s += ps('M56,54 q12,-10 20,4 q8,14 -4,20', '#86efac', 2.4, 'opacity=".9"');
      s += pl('86,40 94,58 78,58', '#a16207');
    } else if (o.shape === 'globe') {
      s += c(60, 58, 34, o.sea || '#38bdf8', 'stroke="#0369a1" stroke-width="2"');
      s += p('M40,38 C50,30 56,44 50,54 C44,64 36,58 34,52 C32,44 36,40 40,38 Z', o.land || '#4ade80', 'stroke="#15803d" stroke-width="1.6"');
      s += p('M74,54 C84,48 92,58 86,68 C80,78 68,76 66,66 C64,58 70,56 74,54 Z', o.land || '#4ade80', 'stroke="#15803d" stroke-width="1.6"');
      s += e(60, 58, 14, 34, 'none', 'stroke="#0369a1" stroke-width="1.6"');
      s += ps('M26,58 h68 M34,40 q26,10 52,0 M34,76 q26,-10 52,0', '#0369a1', 1.4);
      s += '<g transform="rotate(-18 60 58)">' + c(60, 58, 34, 'none', 'stroke="#94a3b8" stroke-width="3"') + '</g>';
      s += ps('M60,16 l0,10 M36,24 l5,8 M84,24 l-5,8', '#94a3b8', 3);
    } else if (o.shape === 'atlas') {
      s += p('M14,22 L58,32 L58,96 L14,86 Z', o.left || '#0ea5e9', 'stroke="#0369a1" stroke-width="2"');
      s += p('M106,22 L62,32 L62,96 L106,86 Z', o.right || '#0284c7', 'stroke="#075985" stroke-width="2"');
      s += p('M20,28 L54,36 L54,88 L20,80 Z', '#fdfdff', 'opacity=".85"');
      s += ps('M28,40 l16,10 l-16,10 M36,50 h14', '#94a3b8', 1.8);
    } else if (o.shape === 'dictionary') {
      s += box(20, 20, 80, 82, o.cover || '#0f172a', 5, 'stroke="#020617" stroke-width="2"');
      s += box(28, 28, 64, 66, '#fdfdff', 2);
      s += ps('M40,42 h40 M40,54 h40 M40,66 h28', '#94a3b8', 2);
      s += box(20, 46, 8, 34, o.spine || '#334155', 2);
      s += c(64, 40, 6, '#fbbf24');
    } else if (o.shape === 'worksheet') {
      s += box(18, 16, 84, 90, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(18, 16, 84, 14, o.head || '#e2e8f0', 2);
      for (var wr = 0; wr < 4; wr++) {
        for (var wc = 0; wc < 3; wc++) {
          s += box(28 + wc * 24, 38 + wr * 17, 18, 12, '#f8fafc', 1.5, 'stroke="#cbd5e1" stroke-width="1.2"');
          if (wr === 0 && wc === 0) s += ps('M31,45 l4,3 l7,-8', '#16a34a', 2);
        }
      }
    } else if (o.shape === 'gown') {
      s += p('M42,22 L78,22 L86,44 L94,96 L26,96 L34,44 Z', o.body || '#1e3a8a', 'stroke="#1e40af" stroke-width="2"');
      s += ps('M48,24 L60,40 L72,24', '#0f172a', 2.4);
      s += ps('M60,40 v56', '#3b82f6', 2, 'opacity=".6"');
      s += c(60, 20, 4, '#0f172a');
    } else if (o.shape === 'register') {
      s += box(16, 20, 88, 82, o.cover || '#166534', 4, 'stroke="#14532d" stroke-width="2"');
      s += box(24, 30, 72, 60, '#fdfdff', 2);
      for (var rg = 0; rg < 6; rg++) s += ps('M' + '30,' + (42 + rg * 9) + ' h60', '#cbd5e1', 1.6);
      s += box(70, 34, 22, 10, '#ef4444', 2);
    } else if (o.shape === 'bell') {
      s += rc(54, 16, 12, 14, '#94a3b8', 3);
      s += p('M32,80 C32,44 88,44 88,80 Z', o.bell || '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += box(28, 80, 64, 8, '#b45309', 3);
      s += c(60, 94, 7, '#b45309');
      for (var bl = 0; bl < 2; bl++) s += ps('M' + '22,' + (56 + bl * 14) + ' q-8,7 0,14 M98,' + (56 + bl * 14) + ' q8,7 0,14', '#fbbf24', 2.4);
    } else if (o.shape === 'timetable') {
      s += box(14, 18, 92, 86, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(14, 18, 92, 16, o.head || '#7c3aed', 3, 'stroke="#5b21b6" stroke-width="1.6"');
      for (var tm = 0; tm < 4; tm++) {
        s += ps('M' + '14,' + (34 + tm * 18) + ' h92', '#e2e8f0', 1.6);
        s += ps('M' + (38 + tm * 18) + ',34 v70', '#e2e8f0', 1.2);
      }
      s += box(40, 38, 16, 14, '#38bdf8', 2);
      s += box(58, 56, 16, 32, '#f59e0b', 2);
      s += box(76, 74, 16, 14, '#22c55e', 2);
    } else if (o.shape === 'lab') {
      s += p('M44,16 L76,16 L76,50 L100,96 L20,96 L44,50 Z', o.glass || '#e2e8f0',
        'stroke="#94a3b8" stroke-width="2"');
      s += p('M30,74 L90,74 L98,96 L22,96 Z', o.liquid || '#22c55e', 'opacity=".85"');
      s += box(50, 8, 20, 10, '#94a3b8', 2);
      s += c(66, 80, 4, '#fef9c3', 'opacity=".9"');
      s += c(44, 86, 3, '#fef9c3', 'opacity=".9"');
    } else if (o.shape === 'playground') {
      s += ps('M0,80 h120', '#a8a29e', 4);
      s += ps('M20,80 L20,34 L76,34', '#0f766e', 5);
      s += ps('M76,34 L76,20', '#0f766e', 5);
      s += ps('M76,22 L96,54', '#dc2626', 3);
      s += ps('M76,22 L56,54', '#dc2626', 3);
      s += ps('M24,80 L24,58 M60,80 L60,58', '#0f766e', 4);
      s += ps('M24,58 L60,58', '#0f766e', 4);
      s += c(96, 68, 12, '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += c(104, 88, 6, '#fbbf24', 'stroke="#b45309" stroke-width="1.6"');
    } else if (o.shape === 'yard') {
      s += ps('M0,84 h120', '#a8a29e', 4);
      s += ps('M20,84 L20,38 L76,38', o.frame || '#0f766e', 5);
      s += ps('M76,38 L76,24', o.frame || '#0f766e', 5);
      s += ps('M76,26 L96,58 M76,26 L56,58', o.slide || '#dc2626', 3);
      s += ps('M24,84 L24,62 M60,84 L60,62', o.frame || '#0f766e', 4);
      s += ps('M24,62 L60,62', o.frame || '#0f766e', 4);
      s += '<g transform="translate(-12 4) scale(0.68)">' + miniPerson('#f59e0b', '#3a2f2a', false) + '</g>';
      s += '<g transform="translate(36 6) scale(0.64)">' + miniPerson('#e0457f', '#8a5a33', false) + '</g>';
    } else if (o.shape === 'diploma') {
      s += '<g transform="rotate(-14 60 60)">';
      s += p('M20,30 L100,30 L100,74 L20,74 Z', o.paper || '#fef3c7', 'stroke="#d6c9a8" stroke-width="2"');
      s += ps('M32,46 h56 M32,58 h36', '#b45309', 2);
      s += c(84, 64, 10, o.seal || '#dc2626');
      s += ps('M84,74 l-6,22 l6,-6 l6,6 Z', o.seal || '#dc2626');
      s += '</g>';
    } else if (o.shape === 'reportcard') {
      s += box(16, 20, 88, 80, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(16, 20, 88, 18, o.band || '#0ea5e9', 3, 'stroke="#0369a1" stroke-width="1.6"');
      s += ps('M26,29 h56', '#f8fafc', 3);
      for (var rc2 = 0; rc2 < 3; rc2++) s += ps('M28,' + (52 + rc2 * 12) + ' h40', '#cbd5e1', 2.2);
      s += c(84, 68, 17, o.grade || '#16a34a');
      s += ps('M78,68 l5,6 l9,-11', '#f8fafc', 3.4);
    } else if (o.shape === 'certificate') {
      s += box(16, 24, 88, 60, o.paper || '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(24, 32, 72, 46, 'none', 0, 'stroke="' + (o.trim || '#b45309') + '" stroke-width="1.6"');
      s += ps('M36,48 h48 M36,60 h32', '#94a3b8', 2);
      s += c(84, 76, 11, o.seal || '#16a34a', 'opacity=".9"');
      s += box(74, 86, 22, 6, '#0f172a', 2);
    } else if (o.shape === 'hall') {
      s += p('M60,14 L104,44 L104,96 L16,96 L16,44 Z', o.wall || '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
      s += box(46, 58, 28, 38, o.door || '#78350f', 3, 'stroke="#451a03" stroke-width="2"');
      s += box(24, 48, 16, 22, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
      s += box(80, 48, 16, 22, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
      s += ps('M16,52 L104,52', '#cbd5e1', 1.6);
    } else if (o.shape === 'locker') {
      s += box(16, 18, 88, 84, o.body || '#475569', 5, 'stroke="#1e293b" stroke-width="2"');
      s += ps('M60,18 v84', '#334155', 2.4);
      s += box(24, 26, 30, 34, o.door || '#64748b', 2, 'stroke="#475569" stroke-width="1.6"');
      s += box(66, 26, 30, 34, o.door || '#64748b', 2, 'stroke="#475569" stroke-width="1.6"');
      s += c(48, 68, 4, '#e2e8f0') + c(72, 68, 4, '#e2e8f0');
      for (var lk = 0; lk < 3; lk++) s += ps('M24,' + (78 + lk * 8) + ' h28', '#334155', 2);
    } else if (o.shape === 'chalk') {
      s += p('M34,44 L86,44 L86,80 L34,80 Z', o.body || '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"');
      s += p('M34,44 L86,44 L86,52 L34,52 Z', o.tip || '#f1f5f9', 'stroke="#cbd5e1" stroke-width="1.4"');
      s += box(34, 68, 52, 12, o.label || '#7c3aed', 2);
    } else if (o.shape === 'head') {
      s += c(60, 46, 22, SKIN, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += p('M44,48 C44,36 76,36 76,48 C70,42 50,42 44,48 Z', o.hair || '#4a3728');
      s += c(52, 50, 2.4, NIGHT) + c(68, 50, 2.4, NIGHT);
      s += ps('M54,60 q6,5 12,0', '#a3506a', 2.4);
      s += p('M32,104 C32,78 88,78 88,104 Z', o.shirt || '#0f766e');
      s += box(14, 10, 92, 46, o.board || '#2f4f3f', 3, 'stroke="#1f2937" stroke-width="2"');
      s += ps('M24,26 h40 M24,40 h28', '#fdfdff', 2.6, 'opacity=".8"');
    } else if (o.shape === 'podium') {
      s += p('M40,16 L80,16 L90,100 L30,100 Z', o.body || '#7c2a12', 'stroke="#451a03" stroke-width="2"');
      s += box(34, 20, 52, 16, o.top || '#92400e', 3, 'stroke="#451a03" stroke-width="1.6"');
      s += box(46, 44, 28, 18, '#fdfdff', 2, 'stroke="#e2e8f0" stroke-width="1.6"');
      s += ps('M50,52 h20', '#94a3b8', 1.8);
    } else if (o.shape === 'chalkboard') {
      s += box(10, 20, 100, 60, o.frame || '#92400e', 4, 'stroke="#451a03" stroke-width="2"');
      s += box(16, 26, 88, 48, o.surface || '#2f4f3f', 2);
      s += ps('M28,42 q10,10 20,0 q10,-10 20,0', '#fdfdff', 2.6, 'opacity=".85"');
      s += box(20, 84, 80, 8, '#6b4423', 2);
    }
    return s;
  });

  /** Something said or written: a speech bubble with a mark in it. */
  kind('message', function (o) {
    var s = shadow(100, o.wide || 28, 0.08);
    if (o.shape === 'bubble') {
      s += p('M14,22 L106,22 L106,80 L54,80 L34,100 L36,80 L14,80 Z',
        o.bubble || '#fdfdff', 'stroke="' + (o.edge || '#94a3b8') + '" stroke-width="2"');
      var g = o.glyph || 'text';
      var t = TALKGLYPH[g] || TALKGLYPH.text;
      s += t(60, 52, o.ink || '#334155', o.accent || '#0ea5e9');
    } else if (o.shape === 'phone') {
      s += box(30, 12, 60, 96, o.body || '#1f2937', 10, 'stroke="#0f172a" stroke-width="2"');
      s += box(36, 22, 48, 74, o.screen || '#f8fafc', 3);
      s += box(48, 14, 24, 5, '#0f172a', 2);
      s += c(60, 100, 4, '#475569');
      var g2 = TALKGLYPH[o.glyph || 'text'];
      if (g2) s += g2(60, 58, o.ink || '#334155', o.accent || '#0ea5e9');
    } else if (o.shape === 'ring') {
      for (var rg = 0; rg < 3; rg++) {
        s += c(60, 60, 16 + rg * 14, 'none', 'stroke="' + (o.ring || '#0ea5e9') + '" stroke-width="' + (4 - rg) +
          '" opacity="' + (1 - rg * 0.3) + '"');
      }
      s += c(60, 60, 11, o.dot || '#22c55e', 'stroke="#16a34a" stroke-width="2"');
    } else if (o.shape === 'handset') {
      s += p('M32,30 C32,22 42,18 50,22 L58,28 C64,32 62,40 56,42 L50,44 C52,54 58,62 68,66 L72,60 C76,54 84,56 86,62 L90,74 C92,82 86,90 78,90 C50,90 30,68 30,40 Z',
        o.body || '#0ea9e9', 'stroke="#0369a1" stroke-width="2"');
    } else if (o.shape === 'chat') {
      s += p('M10,28 L74,28 L74,66 L40,66 L28,80 L30,66 L10,66 Z', o.a || '#7dd3fc', 'stroke="#0369a1" stroke-width="2"');
      s += p('M50,44 L112,44 L112,86 L86,86 L74,100 L76,86 L50,86 Z', o.b || '#a7f3d0', 'stroke="#047857" stroke-width="2"');
      s += ps('M22,44 h40 M24,54 h28', '#0369a1', 2.4);
      s += ps('M62,62 h38 M64,72 h26', '#047857', 2.4);
    } else if (o.shape === 'letterbox') {
      s += box(10, 40, 100, 54, o.body || '#475569', 5, 'stroke="#1e293b" stroke-width="2"');
      s += box(20, 32, 80, 14, o.lid || '#64748b', 4, 'stroke="#334155" stroke-width="1.6"');
      s += box(52, 20, 16, 14, '#334155', 3);
      s += c(60, 24, 5, '#0f172a');
      if (o.flag) s += ps('M60,16 l0,-8', o.flag, 3) + pl('60,8 68,12 60,16', o.flag);
      s += box(24, 52, 72, 12, o.label || '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.4"');
    } else if (o.shape === 'post') {
      s += p('M18,58 L60,20 L102,58 L102,104 L18,104 Z', o.wall || '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
      s += p('M12,62 L60,26 L108,62 L104,64 L60,34 L16,64 Z', o.roof || '#dc2626');
      s += box(48, 76, 24, 28, o.door || '#78350f', 2, 'stroke="#451a03" stroke-width="1.6"');
      s += c(66, 92, 2, '#fbbf24');
      s += box(26, 68, 14, 12, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
      s += box(80, 68, 14, 12, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
    } else if (o.shape === 'mail') {
      s += box(14, 34, 92, 62, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += ps('M14,36 L60,66 L106,36', '#cbd5e1', 2.4);
      s += c(92, 26, 12, '#dc2626', 'stroke="#b91c1c" stroke-width="2"');
      s += pl('92,18 94,25 101,25 95,30 98,37 92,32 86,37 89,30 83,25 90,25', '#fdfdff');
    } else if (o.shape === 'roomchat') {
      s += p('M8,20 L60,20 L60,54 L34,54 L24,66 L26,54 L8,54 Z', o.a || '#bfdbfe', 'stroke="#0369a1" stroke-width="2"');
      s += p('M64,36 L114,36 L114,74 L96,74 L86,86 L88,74 L64,74 Z', o.b || '#a7f3d0', 'stroke="#047857" stroke-width="2"');
      s += p('M40,58 L88,58 L88,92 L74,92 L66,104 L68,92 L40,92 Z', o.c || '#fbcfe8', 'stroke="#be185d" stroke-width="2"');
      s += ps('M18,32 h32 M20,42 h22', '#0369a1', 2.2);
      s += ps('M72,50 h34 M74,60 h26', '#047857', 2.2);
      s += ps('M48,72 h32 M50,82 h22', '#be185d', 2.2);
    } else if (o.shape === 'contact') {
      s += box(14, 24, 92, 76, o.card || '#fdfdff', 6, 'stroke="#cbd5e1" stroke-width="2"');
      s += c(40, 52, 18, o.face || '#e2e8f0');
      s += e(40, 88, 22, 18, o.face || '#e2e8f0');
      s += ps('M70,44 h28 M70,58 h24 M70,72 h28', '#cbd5e1', 2.4);
      s += box(22, 30, 8, 44, o.stripe || '#0ea5e9', 2);
    } else if (o.shape === 'sound') {
      /* A speaker, which is a box with a cone in it. Three words were on this
         branch — headphones, a headset and a speaker — and all three drew a
         speaker, because there was nowhere else to put them. */
      s += box(24, 26, 44, 68, o.body || '#334155', 5, 'stroke="#0f172a" stroke-width="2"');
      s += c(46, 46, 13, o.cone || '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
      s += c(46, 46, 5, o.accent || '#0ea5e9');
      s += c(46, 78, 8, o.cone || '#e2e8f0', 'stroke="#94a3b8" stroke-width="1.6"');
      s += ps('M74,46 a14,14 0 0 1 0,28', o.accent || '#0ea5e9', 2.4);
      s += ps('M80,38 a24,24 0 0 1 0,44', o.accent || '#0ea5e9', 2);
    } else if (o.shape === 'headphones') {
      /* Headphones: a band over two cups. `boom` is the whole difference
         between *headphones* and a *headset* — headphones and a microphone are
         two words, and the microphone is the new information. */
      var cup = o.cup || '#334155';
      s += ps('M24,68 v-8 a36,36 0 0 1 72,0 v8', o.band || '#0f172a', 6);
      s += rc(16, 62, 18, 32, cup, 7, 'stroke="#0f172a" stroke-width="2"');
      s += rc(86, 62, 18, 32, cup, 7, 'stroke="#0f172a" stroke-width="2"');
      s += e(25, 78, 5, 10, o.pad || '#e2e8f0');
      s += e(95, 78, 5, 10, o.pad || '#e2e8f0');
      if (o.boom) {
        /* A headset: the microphone on a boom, hanging off the left cup. The
           flag and the colour are two fields — `o.boom` used for both, and a
           flag of 1 became `stroke="1"`, which renders as no stroke at all. */
        s += ps('M25,92 q-4,14 14,14', o.boomColor || '#0ea5e9', 3);
        s += rc(34, 100, 16, 10, o.boomColor || '#0ea5e9', 4, 'stroke="#0f172a" stroke-width="1.6"');
        s += c(41, 105, 2.4, '#f8fafc');
      } else {
        s += ps('M60,32 v10', o.accent || '#94a3b8', 2.4);
      }
    } else if (o.shape === 'mute') {
      s += p('M24,50 L40,50 L58,30 L58,90 L40,70 L24,70 Z', o.body || '#334155');
      s += ps('M70,44 L96,76 M96,44 L70,76', '#dc2626', 5);
    } else if (o.shape === 'word') {
      s += e(60, 62, 44, 34, o.paper || '#fdf6e8', 'stroke="#c8b89a" stroke-width="2"');
      s += ps('M40,52 h40 M40,64 h32 M40,76 h24', o.ink || '#334155', 3);
      s += ps('M40,90 q8,-6 16,0 q8,6 16,0', o.accent || '#0ea5e9', 2.4);
    } else if (o.shape === 'emoticon') {
      s += c(60, 62, 34, o.face || '#fbbf24', 'stroke="' + (o.edge || '#b45309') + '" stroke-width="3"');
      s += c(48, 54, 3.4, NIGHT) + c(72, 54, 3.4, NIGHT);
      s += ps('M46,68 q14,14 28,0', NIGHT, 3);
      s += c(38, 64, 5, '#f87171', 'opacity=".5"') + c(82, 64, 5, '#f87171', 'opacity=".5"');
    } else if (o.shape === 'alphabet') {
      s += c(60, 60, 40, o.tile || '#f59e0b', 'stroke="#b45309" stroke-width="3"');
      s += ps('M40,74 L52,44 L64,74 M45,64 h14', o.ink || '#78350f', 4);
      s += c(82, 50, 7, o.ink2 || '#dc2626');
    } else if (o.shape === 'nickname') {
      s += p('M14,30 L84,30 L84,72 L46,72 L30,88 L32,72 L14,72 Z', o.bubble || '#fdfdff', 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M28,52 q6,-8 12,0 q6,8 12,0 q6,-8 12,0', o.ink || '#7c3aed', 3.4);
      s += c(96, 30, 16, o.dot || '#facc15', 'stroke="#ca8a04" stroke-width="2"');
      s += pl('96,20 99,27 106,27 101,32 103,40 96,35 89,40 91,32 86,27 93,27', '#78350f');
    } else if (o.shape === 'note') {
      if (o.card) {
        /* A folded greeting card: two panels and a picture, not a sticky note. */
        s += box(16, 26, 88, 68, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
        s += ps('M60,26 v68', '#cbd5e1', 2);
        s += box(22, 32, 34, 26, o.colour || '#fbcfe8', 2, 'stroke="#be185d" stroke-width="1.4"');
        s += c(39, 45, 8, '#f43f5e');
        s += ps('M70,40 h26 M70,50 h20 M70,60 h24 M70,70 h16', '#94a3b8', 2.2);
        s += pl('24,88 34,80 44,88', o.colour || '#fbcfe8', 'stroke="#be185d" stroke-width="1.2"');
        s += ps('M34,84 l6,6 l10,-12', o.ink || '#16a34a', 3);
        return s;
      }
      s += box(20, 20, 80, 84, o.colour || '#fde047', 4, 'stroke="#ca8a04" stroke-width="2"');
      s += box(20, 20, 80, 18, '#facc15', 3, 'stroke="#ca8a04" stroke-width="1.6"');
      var noteLines = o.lines || 3;
      for (var nl = 0; nl < noteLines; nl++) {
        s += ps('M32,' + (54 + nl * 14) + ' h' + (56 - (nl % 3) * 12), '#a16207', 2.4);
      }
    }
    return s;
  });

  /**
   * A seven-segment digit. A channel card is identified by its number, and a
   * bar standing in for a 3 looks like a bar standing in for a 1.
   */
  var DIGIT = {
    '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc',
    '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcfgd'
  };
  var SEG = {
    a: [0, -12, 20, 0], b: [12, -6, 0, 12], c: [12, 6, 0, 12],
    d: [0, 12, 20, 0], e: [-12, 6, 0, 12], f: [-12, -6, 0, 12],
    g: [0, 0, 20, 0]
  };
  function digit(n, x, y, ink, w) {
    var on = DIGIT[String(n)] === undefined ? 'abcdef' : DIGIT[String(n)];
    var s = '';
    for (var k = 0; k < on.length; k++) {
      var sg = SEG[on[k]];
      s += ps('M' + (x + sg[0]) + ',' + (y + sg[1]) + ' L' + (x + sg[0] + sg[2]) + ',' + (y + sg[1] + sg[3]), ink, w,
        '');
    }
    return s;
  }

  /** The mark inside a message bubble. */
  var TALKGLYPH = {
    text: function (x, y) {
      var s = '';
      for (var i = 0; i < 3; i++) s += ps('M' + (x - 30) + ',' + (y - 12 + i * 12) + ' h' + (60 - i * 14), '#334155', 3);
      return s;
    },
    dots: function (x, y) {
      return c(x - 16, y, 6, '#334155') + c(x, y, 6, '#334155') + c(x + 16, y, 6, '#334155');
    },
    question: function (x, y) {
      return ps('M' + (x - 10) + ',' + (y - 12) + ' a11,11 0 1 1 12,12 v6', '#334155', 4) + c(x + 2, y + 14, 3, '#334155');
    },
    tick: function (x, y) { return ps('M' + (x - 20) + ',' + y + ' l14,14 l28,-30', '#16a34a', 6); },
    cross: function (x, y) { return ps('M' + (x - 18) + ',' + (y - 18) + ' l36,36 M' + (x + 18) + ',' + (y - 18) + ' l-36,36', '#dc2626', 6); },
    heart: function (x, y) {
      return c(x - 12, y - 6, 12, '#f43f5e') + c(x + 12, y - 6, 12, '#f43f5e') + c(x, y + 8, 12, '#f43f5e');
    },
    smile: function (x, y) {
      return c(x, y, 26, '#fbbf24') + c(x - 9, y - 7, 3.4, '#78350f') + c(x + 9, y - 7, 3.4, '#78350f') +
        ps('M' + (x - 11) + ',' + (y + 5) + ' q11,11 22,0', '#78350f', 3);
    },
    call: function (x, y) {
      return p('M' + (x - 24) + ',' + (y - 20) + ' l12,4 l4,12 l-8,6 q6,10 16,16 l6,-8 l12,4 l4,12 l-8,8 q-24,0 -38,-38 Z', '#22c55e');
    },
    mail: function (x, y) {
      return box(x - 26, y - 18, 52, 36, '#f8fafc', 3, 'stroke="#334155" stroke-width="2.4"') +
        ps('M' + (x - 26) + ',' + (y - 18) + ' l26,20 l26,-20', '#334155', 2.4);
    },
    bell: function (x, y) {
      return p('M' + (x - 20) + ',' + (y + 12) + ' c0,-26 40,-26 40,0 Z', '#fbbf24', 'stroke="#b45309" stroke-width="2.4"') +
        box(x - 24, y + 12, 48, 6, '#b45309', 2) + c(x, y + 24, 6, '#b45309');
    },
    star: function (x, y) {
      return pl(x + ',' + (y - 20) + ' ' + (x + 3) + ',' + (y - 3) + ' ' + (x + 10) + ',' + (y - 2) +
        ' ' + (x + 5) + ',' + (y + 3) + ' ' + (x + 6) + ',' + (y + 10) + ' ' + x + ',' + (y + 6) +
        ' ' + (x - 6) + ',' + (y + 10) + ' ' + (x - 5) + ',' + (y + 3) + ' ' + (x - 10) + ',' + (y - 2) +
        ' ' + (x - 3) + ',' + (y - 3), '#fbbf24');
    },
    pin: function (x, y) {
      return p('M' + x + ',' + (y + 26) + ' c-12,-18 -20,-24 -20,-36 a20,20 0 0 1 40,0 c0,12 -8,18 -20,36 Z', '#ef4444');
    },
    clock: function (x, y) {
      return c(x, y, 24, 'none', 'stroke="#334155" stroke-width="3"') + ps('M' + x + ',' + (y - 13) + ' v13 l9,6', '#334155', 3);
    },
    search: function (x, y) {
      return c(x - 5, y - 5, 17, 'none', 'stroke="#334155" stroke-width="4"') + ps('M' + (x + 8) + ',' + (y + 8) + ' l16,16', '#334155', 5);
    },
    upload: function (x, y) {
      return ps('M' + x + ',' + (y + 20) + ' v-34 M' + (x - 12) + ',' + (y - 2) + ' l12,-14 l12,14 M' + (x - 20) + ',' + (y + 20) + ' h40', '#16a34a', 4);
    },
    share: function (x, y) {
      return c(x - 20, y, 7, '#0ea5e9') + c(x + 20, y - 16, 7, '#0ea5e9') + c(x + 20, y + 16, 7, '#0ea5e9') +
        ps('M' + (x - 14) + ',' + (y - 3) + ' l28,-11 M' + (x - 14) + ',' + (y + 3) + ' l28,11', '#0ea5e9', 3);
    },
    reply: function (x, y) {
      return p('M' + (x + 22) + ',' + (y - 20) + ' L' + (x - 8) + ',' + (y + 2) + ' l30,0 l0,30 q0,-32 -30,-30 Z', '#22c55e');
    },
    warn: function (x, y) {
      /* A warning triangle, built from x and y. The list this replaces was typed
         out at a fixed spot while the two strokes below it used the centre, so
         the triangle and its mark came apart wherever it was drawn. */
      return pl(x + ',' + (y - 18) + ' ' + (x + 20) + ',' + (y + 14) + ' ' + (x - 20) + ',' + (y + 14),
        '#fbbf24', 'stroke="#b45309" stroke-width="1.4"') +
        ps('M' + x + ',' + (y - 8) + ' v14 M' + x + ',' + (y + 11) + ' v0.1', '#78350f', 3.4);
    },
    lock: function (x, y) {
      return box(x - 18, y - 4, 36, 28, '#f59e0b', 4, 'stroke="#b45309" stroke-width="2"') +
        ps('M' + (x - 9) + ',' + (y - 4) + ' v-9 a9,9 0 0 1 18,0 v9', '#334155', 3.4);
    },
    video: function (x, y) {
      return box(x - 26, y - 16, 36, 32, '#334155', 4) + p('M' + (x + 10) + ',' + (y - 12) + ' l16,-8 l0,40 l-16,-8 Z', '#334155');
    },
    emoji: function (x, y) {
      return c(x, y, 26, '#fbbf24') + c(x - 9, y - 7, 3.4, '#78350f') + c(x + 9, y - 7, 3.4, '#78350f') +
        ps('M' + (x - 11) + ',' + (y + 5) + ' q11,11 22,0', '#78350f', 3);
    },
    fire: function (x, y) {
      return p('M' + x + ',' + (y - 26) + ' c18,16 16,44 0,44 c-16,0 -18,-28 0,-44 Z', '#f97316');
    }
  };

  /** Something printed, broadcast or published. */
  kind('media', function (o) {
    var s = shadow(100, o.wide || 30, 0.08);
    if (o.shape === 'press') {
      /* A broadsheet: masthead, a photo, columns of type. */
      s += box(10, 14, 100, 74, o.paper || '#fdf6e8', 2, 'stroke="#c8b89a" stroke-width="2"');
      s += box(10, 14, 100, 12, '#0f172a', 2);
      s += ps('M24,22 h72', '#fdf6e8', 3);
      s += box(18, 32, 40, 26, o.photo || '#94a3b8', 2, 'stroke="#64748b" stroke-width="1.4"');
      s += ps('M18,52 l12,-14 l10,10 l8,-6 l10,10', '#e2e8f0', 2, 'opacity=".8"');
      s += c(48, 38, 4, '#fef3c7');
      for (var cn = 0; cn < 3; cn++) {
        for (var cl = 0; cl < 4; cl++) {
          s += ps('M62,' + (34 + cl * 6) + ' h' + (38 - cn * 4), '#94a3b8', 1.6);
        }
      }
      for (var bc = 0; bc < 2; bc++) {
        for (var bl = 0; bl < 8; bl++) s += ps('M' + (18 + bc * 46) + ',' + (64 + bl * 3) + ' h42', '#cbd5e1', 1.4);
      }
    } else if (o.shape === 'magazine') {
      s += box(16, 14, 88, 76, o.cover || '#f472b6', 2, 'stroke="#be185d" stroke-width="2"');
      s += box(16, 14, 88, 20, o.band || '#db2777', 2, 'stroke="#be185d" stroke-width="1.6"');
      s += ps('M28,24 h60', '#fdfdff', 3.4);
      s += box(24, 40, 72, 42, o.photo || '#fecdd3', 2, 'stroke="#be185d" stroke-width="1.4"');
      s += c(60, 58, 14, o.subject || '#fb7185', 'stroke="#be185d" stroke-width="1.6"');
      s += box(34, 76, 52, 4, '#fdfdff', 2, 'opacity=".7"');
    } else if (o.shape === 'headline') {
      s += box(10, 26, 100, 48, o.paper || '#fdfdff', 2, 'stroke="#cbd5e1" stroke-width="2"');
      s += ps('M20,46 h80 M20,60 h64', o.ink || '#0f172a', 6);
      s += ps('M20,70 h40', '#94a3b8', 2.4);
      s += box(10, 74, 100, 8, o.accent || '#dc2626', 2);
      s += c(96, 30, 12, o.accent || '#dc2626', 'opacity=".2"');
    } else if (o.shape === 'column') {
      s += box(14, 16, 92, 80, o.paper || '#fdf6e8', 2, 'stroke="#c8b89a" stroke-width="2"');
      for (var co = 0; co < 3; co++) {
        for (var cl2 = 0; cl2 < 11; cl2++) {
          s += ps('M' + (20 + co * 28) + ',' + (26 + cl2 * 6) + ' h22', cl2 === 0 && co === 0 ? '#334155' : '#94a3b8',
            cl2 === 0 && co === 0 ? 3 : 1.6);
        }
      }
      s += ps('M14,16 v80', o.accent || '#dc2626', 2.4);
    } else if (o.shape === 'broadcast') {
      s += c(60, 78, 10, o.dot || '#dc2626');
      for (var bc2 = 0; bc2 < 3; bc2++) {
        s += ps('M' + (60 - (16 + bc2 * 14)) + ',' + (78 - (14 + bc2 * 12)) + ' a' + (16 + bc2 * 14) + ',' + (14 + bc2 * 12) + ' 0 0 1 ' + (32 + bc2 * 28) + ',0',
          o.wave || '#f87171', 4 - bc2 * 0.6);
      }
      s += box(18, 18, 84, 30, o.screen || '#0f172a', 4, 'stroke="#1f2937" stroke-width="2"');
      s += ps('M30,32 h40 M30,40 h24', '#f8fafc', 2.4);
      s += c(90, 33, 7, '#22c55e');
    } else if (o.shape === 'channel') {
      s += box(10, 22, 100, 58, '#0f172a', 5, 'stroke="#1f2937" stroke-width="2"');
      s += box(16, 28, 88, 46, o.screen || '#1e40af', 2);
      var n = o.num === undefined ? 7 : o.num;
      s += box(42, 36, 36, 30, '#f8fafc', 3);
      s += digit(n, 60, 51, '#1e3a8a', 3.4);
      if (o.panels) {
        /* A mosaic: the number is a caption, the tiles are the picture. */
        for (var pn2 = 0; pn2 < o.panels; pn2++) {
          var px2 = 18 + (pn2 % 3) * 22, py2 = 32 + Math.floor(pn2 / 3) * 13;
          s += box(px2, py2, 19, 10, ['#f87171', '#fbbf24', '#4ade80', '#60a5fa', '#c084fc', '#f472b6'][pn2 % 6], 1.5, 'opacity=".8"');
        }
        s += ps('M22,70 h64', '#f8fafc', 2.4, 'opacity=".8"');
      }
      s += box(16, 76, 88, 4, '#334155', 1);
      s += c(70, 78, 3, '#f8fafc');
      s += box(30, 86, 60, 8, o.stand || '#334155', 3);
    } else if (o.shape === 'episode') {
      s += box(10, 20, 100, 62, o.frame || '#1f2937', 5, 'stroke="#0f172a" stroke-width="2"');
      s += box(16, 26, 88, 44, o.screen || '#334155', 2);
      s += pl('56,38,70,48,56,58', '#f8fafc');
      s += box(10, 82, 100, 10, o.stand || '#0f172a', 3);
    } else if (o.shape === 'series') {
      s += box(8, 30, 30, 44, o.a || '#0ea5e9', 3, 'stroke="#0369a1" stroke-width="1.6"');
      s += box(45, 26, 30, 48, o.b || '#7c3aed', 3, 'stroke="#5b21b6" stroke-width="1.6"');
      s += box(82, 32, 30, 42, o.c || '#f59e0b', 3, 'stroke="#b45309" stroke-width="1.6"');
      s += ps('M14,44 h18 M51,40 h18 M88,46 h18', '#fdfdff', 2.4, 'opacity=".7"');
      s += ps('M14,58 h18 M51,54 h18 M88,58 h18', '#fdfdff', 2, 'opacity=".5"');
      s += c(60, 16, 8, '#f43f5e');
    } else if (o.shape === 'documentary') {
      s += c(44, 56, 26, o.cam || '#334155', 'stroke="#0f172a" stroke-width="2"');
      s += c(44, 56, 11, '#94a3b8');
      s += c(44, 56, 5, '#0f172a');
      s += box(66, 44, 26, 24, o.cam || '#334155', 4, 'stroke="#0f172a" stroke-width="1.6"');
      s += pl('92,48 104,42 104,70 92,64', o.cam || '#334155');
      s += ps('M44,82 l0,14 M30,96 h28', '#334155', 4);
      s += box(14, 20, 40, 12, '#0f172a', 2);
      s += ps('M20,26 h28', '#f8fafc', 2.4);
    } else if (o.shape === 'interview') {
      s += box(8, 40, 30, 34, o.a || '#7dd3fc', 3, 'stroke="#0369a1" stroke-width="1.6"');
      s += c(23, 50, 6, '#1e293b');
      s += ps('M13,66 h20 M13,58 h14', '#0369a1', 1.8);
      s += box(30, 34, 62, 22, '#0f172a', 3);
      s += pl('48,40,58,45,48,50', '#f8fafc');
      s += box(82, 40, 30, 34, o.b || '#fbcfe8', 3, 'stroke="#be185d" stroke-width="1.6"');
      s += c(97, 50, 6, '#1e293b');
      s += ps('M87,66 h20 M93,58 h14', '#be185d', 1.8);
      s += ps('M60,26 l0,8', '#64748b', 3);
      s += c(60, 22, 6, '#64748b');
    } else if (o.shape === 'ad') {
      s += box(8, 26, 104, 60, o.plate || '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(8, 26, 104, 14, o.brand || '#0ea5e9', 3, 'stroke="#0369a1" stroke-width="1.6"');
      s += c(34, 62, 16, o.product || '#f59e0b', 'stroke="#b45309" stroke-width="1.6"');
      s += ps('M58,52 h44 M58,64 h34 M58,76 h40', '#334155', 2.6);
      s += box(72, 84, 32, 10, o.cta || '#ef4444', 4, 'stroke="#b91c1c" stroke-width="1.4"');
    } else if (o.shape === 'slogan') {
      s += p('M12,30 L108,30 L96,80 L24,80 Z', o.flag || '#dc2626', 'stroke="#b91c1c" stroke-width="2"');
      s += box(8, 80, 8, 20, '#0f172a', 2);
      s += ps('M30,50 h56 M30,64 h40', '#fdfdff', 3.4);
      s += c(60, 100, 4, '#0f172a');
    } else if (o.shape === 'caption') {
      s += box(8, 34, 104, 46, o.screen || '#0f172a', 3);
      s += box(18, 42, 24, 30, o.video || '#334155', 2);
      s += pl('26,50,34,57,26,64', '#f8fafc');
      s += box(50, 42, 52, 30, '#334155', 2);
      s += box(18, 80, 84, 16, '#f8fafc', 2, 'stroke="#cbd5e1" stroke-width="1.4"');
      s += ps('M26,90 h40 M70,90 h24', '#334155', 3);
      s += ps('M14,100 h92', '#dc2626', 2.4);
    } else if (o.shape === 'trailer') {
      s += box(8, 22, 104, 60, '#0f172a', 4, 'stroke="#1f2937" stroke-width="2"');
      s += box(14, 28, 92, 48, o.screen || '#7f1d1d', 2);
      s += pl('54,42,68,52,54,62', '#f8fafc');
      s += box(8, 82, 104, 6, o.bar || '#f59e0b', 2);
      s += box(30, 88, 44, 6, '#f8fafc', 1, 'opacity=".5"');
      s += box(24, 60, 14, 6, '#f8fafc', 1, 'opacity=".4"');
    } else if (o.shape === 'review') {
      s += box(14, 18, 92, 72, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(22, 26, 76, 12, o.head || '#0f172a', 2);
      for (var st = 0; st < 5; st++) {
        var sx = 30 + st * 15;
        s += pl(sx + ',48 ' + (sx + 5) + ',54 ' + sx + ',60 ' + (sx + 2) + ',55 ' + (sx + 4) + ',60 ' + sx + ',60',
          st < (o.rating || 4) ? '#f59e0b' : '#e2e8f0');
      }
      s += ps('M26,74 h64 M26,82 h44', '#cbd5e1', 2.4);
    } else if (o.shape === 'subscriber') {
      s += box(10, 20, 100, 60, o.screen || '#0f172a', 3);
      s += box(16, 26, 88, 30, '#1e40af', 2);
      s += c(40, 40, 9, '#93c5fd');
      s += box(54, 36, 34, 6, '#f8fafc', 2, 'opacity=".7"');
      s += box(16, 60, 40, 5, '#475569', 1.5);
      s += box(16, 68, 28, 5, '#475569', 1.5);
      s += box(66, 66, 24, 10, o.btn || '#22c55e', 3);
      s += miniPerson(o.shirt || '#f59e0b', o.hair || '#2f2a3d', false);
    } else if (o.shape === 'circulation') {
      s += c(60, 58, 30, o.colour || '#dc2626', 'stroke="#b91c1c" stroke-width="3"');
      s += c(60, 58, 14, '#fdfdff');
      s += ps('M60,28 l8,8 l-8,8 l-8,-8 Z', '#f8fafc', 3);
      s += ps('M90,58 l-8,8 l-8,-8 l8,-8 Z', '#f8fafc', 3);
      s += ps('M60,88 l-8,-8 l8,-8 l8,8 Z', '#f8fafc', 3);
      s += ps('M30,58 l8,-8 l8,8 l-8,8 Z', '#f8fafc', 3);
      s += ps('M38,36 L82,80 M82,36 L38,80', '#b91c1c', 2, 'opacity=".4"');
    } else if (o.shape === 'editorial') {
      s += box(12, 16, 96, 72, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(12, 16, 96, 18, o.head || '#1e40af', 3, 'stroke="#1e3a8a" stroke-width="1.6"');
      s += ps('M24,28 h60', '#f8fafc', 3.4);
      s += e(60, 66, 22, 18, o.face || '#e2e8f0');
      s += c(52, 62, 2.4, NIGHT) + c(68, 62, 2.4, NIGHT);
      s += ps('M52,72 q8,6 16,0', '#a3506a', 2);
      s += c(30, 76, 5, '#dc2626');
    } else if (o.shape === 'coverage') {
      s += box(8, 30, 76, 46, '#0f172a', 3);
      s += box(14, 36, 64, 34, o.live || '#dc2626', 2);
      s += c(26, 44, 6, '#f8fafc');
      s += ps('M36,46 h30 M36,56 h22', '#f8fafc', 2.6, 'opacity=".7"');
      s += box(74, 52, 24, 18, o.cam || '#334155', 3, 'stroke="#0f172a" stroke-width="1.6"');
      s += pl('98,56 108,52 108,70 98,66', o.cam || '#334155');
      s += ps('M86,70 l0,10 M74,80 h24', '#334155', 3.4);
      s += ps('M20,94 h80', '#94a3b8', 2, 'stroke-dasharray="4 4"');
    } else if (o.shape === 'censorship') {
      s += box(14, 26, 92, 62, o.paper || '#fdf6e8', 3, 'stroke="#c8b89a" stroke-width="2"');
      for (var cn2 = 0; cn2 < 5; cn2++) {
        s += ps('M24,' + (42 + cn2 * 9) + ' h' + (72 - cn2 * 8), '#94a3b8', 2.4);
      }
      s += c(66, 62, 30, '#0f172a', 'opacity=".55"');
      s += ps('M46,42 L86,82', '#dc2626', 6);
    } else if (o.shape === 'copyright') {
      s += c(60, 60, 36, o.plate || '#1e40af');
      s += c(60, 60, 28, 'none', 'stroke="#f8fafc" stroke-width="2.4"');
      s += ps('M60,44 v32', '#f8fafc', 3.4);
      s += ps('M60,48 a10,10 0 1 1 0,20 a8,8 0 1 0 0,-16', '#f8fafc', 3.4);
    } else if (o.shape === 'podcast') {
      s += c(60, 46, 18, o.mic || '#0f172a', 'stroke="#334155" stroke-width="2"');
      s += ps('M42,42 a18,18 0 0 0 36,0 M60,60 v14 M46,74 h28', o.mic || '#0f172a', 4);
      s += box(34, 78, 52, 22, o.stand || '#0f172a', 4);
      s += ps('M46,90 h28', '#f8fafc', 3);
      s += c(60, 22, 6, o.accent || '#f43f5e');
    } else if (o.shape === 'record') {
      s += c(60, 60, 38, o.disc || '#1f2937', 'stroke="#0f172a" stroke-width="2"');
      for (var gr = 1; gr < 4; gr++) s += c(60, 60, 38 - gr * 9, 'none', 'stroke="#374151" stroke-width="1.4"');
      s += c(60, 60, 10, o.label || '#f97316', 'stroke="#c2410c" stroke-width="1.6"');
      s += c(60, 60, 3, '#fdfdff');
    } else if (o.shape === 'chessboard') {
      for (var cb = 0; cb < 8; cb++) {
        for (var cr2 = 0; cr2 < 8; cr2++) {
          s += box(22 + cr2 * 9.5, 22 + cb * 9.5, 9.5, 9.5,
            (cb + cr2) % 2 ? '#0f172a' : '#e2e8f0', 0.5);
        }
      }
      s += box(22, 22, 76, 76, 'none', 2, 'stroke="#334155" stroke-width="1.6"');
      /* A king, fallen: that is the difference between a board and checkmate. */
      s += c(60, 48, 9, '#fdfdff', 'stroke="#334155" stroke-width="1.6"');
      s += ps('M60,39 v-6 M54,42 h12', '#fbbf24', 2.4);
      s += c(60, 62, 7, '#fdfdff', 'stroke="#334155" stroke-width="1.4"');
      s += ps('M44,74 L76,64 M48,68 l6,4', '#dc2626', 3.4);
    } else if (o.shape === 'burst') {
      /* One big shell and two small ones, which is what a display looks like. */
      var shells = [[60, 44, 22, ['#f43f5e', '#fbbf24']],
                    [26, 74, 13, ['#38bdf8', '#a78bfa']],
                    [96, 72, 11, ['#4ade80', '#facc15']]];
      for (var sh = 0; sh < shells.length; sh++) {
        var shx = shells[sh][0], shy = shells[sh][1], shr = shells[sh][2];
        for (var sp = 0; sp < 10; sp++) {
          var spa = (sp * Math.PI) / 5 + (sh * 0.3);
          s += ps('M' + (shx + Math.cos(spa) * (shr * 0.4)).toFixed(1) + ',' +
            (shy + Math.sin(spa) * (shr * 0.4)).toFixed(1) +
            ' L' + (shx + Math.cos(spa) * shr).toFixed(1) + ',' + (shy + Math.sin(spa) * shr).toFixed(1),
            shells[sh][3][sp % 2], 2.6);
          s += c(shx + Math.cos(spa) * shr, shy + Math.sin(spa) * shr, 1.6, shells[sh][3][sp % 2]);
        }
      }
      s += ps('M0,112 q14,-8 28,0 q14,8 28,0 q14,-8 28,0 q14,8 28,0', '#f8fafc', 2, 'opacity=".5"');
    } else if (o.shape === 'gift') {
      s += box(24, 48, 72, 50, o.body || '#dc2626', 4, 'stroke="#991b1b" stroke-width="2"');
      s += box(24, 48, 72, 14, o.ribbon || '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.6"');
      s += box(52, 48, 16, 50, o.ribbon || '#fbbf24', 2);
      s += p('M60,48 C40,48 38,26 52,26 C58,26 60,36 60,48 Z', o.ribbon || '#fbbf24', 'stroke="#b45309" stroke-width="1.6"');
      s += p('M60,48 C80,48 82,26 68,26 C62,26 60,36 60,48 Z', o.ribbon || '#fbbf24', 'stroke="#b45309" stroke-width="1.6"');
      s += c(60, 44, 5, o.ribbon || '#fbbf24', 'stroke="#b45309" stroke-width="1.2"');
      s += box(34, 68, 20, 20, '#fdfdff', 2, 'opacity=".9"');
    } else if (o.shape === 'sheet') {
      /* A page of song: five staff lines and a note on each. */
      s += box(24, 16, 72, 88, '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(24, 16, 72, 12, '#e2e8f0', 2, 'stroke="#cbd5e1" stroke-width="1.2"');
      for (var stf = 0; stf < 2; stf++) {
        for (var lnz = 0; lnz < 5; lnz++) {
          s += ps('M30,' + (40 + stf * 32 + lnz * 5) + ' h60', '#94a3b8', 1.2);
        }
        for (var nt = 0; nt < 3; nt++) {
          var nx = 40 + nt * 18, ny = 45 + stf * 32 + (nt % 2) * 5;
          s += c(nx, ny, 3.4, '#1f2937');
          s += ps('M' + (nx + 3) + ',' + ny + ' v-11', '#1f2937', 1.8);
          s += pl((nx + 3) + ',' + (ny - 11) + ' ' + (nx + 10) + ',' + (ny - 8) + ' ' + (nx + 3) + ',' + (ny - 5), '#1f2937');
        }
      }
    } else if (o.shape === 'partyClock') {
      s += c(60, 52, 32, '#fdfdff', 'stroke="#334155" stroke-width="3"');
      for (var pt = 0; pt < 12; pt++) {
        var pta = (pt * Math.PI) / 6;
        s += ps('M' + (60 + Math.cos(pta) * 26).toFixed(1) + ',' + (52 + Math.sin(pta) * 26).toFixed(1) +
          ' L' + (60 + Math.cos(pta) * 22).toFixed(1) + ',' + (52 + Math.sin(pta) * 22).toFixed(1), '#334155', 2);
      }
      s += ps('M60,52 L60,36 M60,52 L74,52', '#dc2626', 3);
      s += c(60, 52, 3, '#dc2626');
      s += ps('M56,30 h8 M60,26 v8', '#22c55e', 2.4);
      for (var cf = 0; cf < 12; cf++) {
        var cfa = (cf * Math.PI) / 6;
        s += box((18 + Math.cos(cfa) * 40).toFixed(1), (86 + Math.sin(cfa) * 22).toFixed(1), 6, 3,
          ['#f43f5e', '#fbbf24', '#38bdf8', '#4ade80'][cf % 4], 1,
          'transform="rotate(' + ((cf * 30) % 180) + ' ' + (18 + Math.cos(cfa) * 40).toFixed(1) + ' ' +
          (86 + Math.sin(cfa) * 22).toFixed(1) + ')"');
      }
      s += ps('M0,112 q15,-7 30,0 q15,7 30,0 q15,-7 30,0 q15,7 30,0', '#f8fafc', 2, 'opacity=".5"');
    } else if (o.shape === 'mic') {
      s += e(60, 50, 12, 22, o.body || '#334155', 'stroke="#0f172a" stroke-width="2"');
      for (var mg = 0; mg < 4; mg++) s += ps('M' + (50 + mg * 7) + ',32 v36', '#1f2937', 1.6);
      s += ps('M44,50 a16,16 0 0 0 32,0 M60,66 v16 M46,82 h28', o.body || '#334155', 4);
      s += box(34, 82, 52, 10, o.stand || '#1f2937', 3);
    }
    return s;
  });



  /* ================================================================== *
   * The last fifteen categories
   *
   * Fifteen categories, eleven kinds. A person carries an accessory, a house
   * is made of fixtures, a room is made of furniture, a city is made of
   * buildings, a holiday is a set of things you do once a year. Where several
   * categories need the same drawing — a swatch for a texture and a shape, a
   * group of dots for a quantity and a position — they share one kind on
   * purpose, so the deck still reads as one illustrated set.
   * ================================================================== */

  /** Worn or carried: the part of a person you can see. */
  kind('accessory', function (o) {
    var s = shadow(100, o.wide || 28, 0.08);
    if (o.shape === 'wrist') {
      s += c(60, 62, 32, o.strap || '#334155', 'stroke="#1f2937" stroke-width="2"');
      s += c(60, 62, 22, o.strap || '#334155');
      s += box(48, 50, 24, 24, o.face || '#e2e8f0', 5, 'stroke="#94a3b8" stroke-width="2"');
      s += c(60, 62, 8, o.ink || '#0f172a');
      s += ps('M60,58 v-4 M60,66 v4', o.ink || '#0f172a', 1.6);
      if (o.band) s += ps('M32,52 a30,30 0 0 1 56,0 M32,72 a30,30 0 0 0 56,0', o.band, 3);
    } else if (o.shape === 'head') {
      s += c(60, 66, 38, SKIN, 'stroke="' + SKIN_D + '" stroke-width="2"');
      if (o.hair === 'long') s += c(60, 60, 44, o.hairColour || '#6b4423', 'opacity=".9"');
      s += p('M22,52 C22,26 98,26 98,52 C94,44 80,40 60,40 C40,40 26,44 22,52 Z', o.hairColour || '#3a2f2a');
      if (o.crown) {
        s += p('M28,32 L28,14 L44,26 L60,10 L76,26 L92,14 L92,32 Z', o.crown, 'stroke="#b45309" stroke-width="2"');
        s += c(60, 24, 4, '#dc2626');
      }
      if (o.brim) {
        s += e(60, 34, 46, 9, o.body || '#1e40af', 'stroke="#1e3a8a" stroke-width="2"');
        s += p('M32,34 C32,14 88,14 88,34 Z', o.body || '#1e40af', 'stroke="#1e3a8a" stroke-width="2"');
        if (o.band) s += box(32, 30, 56, 7, o.band, 2, 'stroke="#1e3a8a" stroke-width="1.6"');
      }
      if (o.sunglasses) {
        s += c(46, 62, 13, '#1f2937') + c(74, 62, 13, '#1f2937');
        s += ps('M59,62 h2 M33,60 l-6,-3 M87,60 l6,-3', '#1f2937', 3);
      }
    } else if (o.shape === 'torso') {
      s += p('M30,50 C30,42 36,38 44,38 L76,38 C84,38 90,42 90,50 L92,96 L28,96 Z', o.shirt || '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"');
      s += rc(54, 32, 12, 10, SKIN_D, 4);
      if (o.neckwear === 'tie') {
        s += p('M54,42 L66,42 L70,88 L50,88 Z', o.colour || '#dc2626', 'stroke="#991b1b" stroke-width="1.6"');
        s += ps('M54,42 L60,50 L66,42', '#0f172a', 2);
      } else if (o.neckwear === 'bow') {
        s += p('M60,50 L40,40 L40,60 Z', o.colour || '#1f2937', 'stroke="#0f172a" stroke-width="1.6"');
        s += p('M60,50 L80,40 L80,60 Z', o.colour || '#1f2937', 'stroke="#0f172a" stroke-width="1.6"');
        s += c(60, 50, 5, o.colour || '#1f2937');
      } else if (o.neckwear === 'scarf') {
        s += p('M40,42 C52,54 68,54 80,42 L86,54 C70,68 50,68 34,54 Z', o.colour || '#dc2626', 'stroke="#991b1b" stroke-width="1.6"');
        s += p('M74,58 L90,62 L84,96 L66,92 Z', o.colour || '#dc2626', 'stroke="#991b1b" stroke-width="1.6"');
      }
      if (o.belt) {
        s += box(28, 74, 64, 12, o.belt || '#78350f', 3, 'stroke="#451a03" stroke-width="1.6"');
        s += box(54, 70, 14, 20, o.buckle || '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.6"');
      }
    } else if (o.shape === 'carried') {
      if (o.open) {
        s += box(20, 52, 80, 44, o.body || '#78350f', 5, 'stroke="#451a03" stroke-width="2"');
        s += p('M20,52 L60,30 L100,52 Z', o.lid || '#92400e', 'stroke="#451a03" stroke-width="2"');
        s += p('M60,30 L100,52 L100,60 L60,38 Z', '#1c1917', 'opacity=".35"');
        var oRx = o.wide2 ? 38 : 26;
        s += e(60, 62, oRx, 8, o.liner || '#fdf6e8', 'stroke="#451a03" stroke-width="1.4"');
        var oN = o.contents === true ? 3 : (o.contents || 0);
        for (var or2 = 0; or2 < oN; or2++) {
          var orx = 60 - oRx + 8 + or2 * ((oRx * 2 - 16) / Math.max(1, oN - 1));
          s += c(orx, 60, 5, o.mark || '#fbbf24', 'stroke="#b45309" stroke-width="1.4"');
        }
        if (o.fold) {
          /* A wardrobe box is wider and has something folded over the edge. */
          s += p('M' + (60 - oRx) + ',58 q' + oRx + ',-20 ' + (oRx * 2) + ',0 l0,18 q' + (-oRx) + ',20 ' +
            (-oRx * 2) + ',0 Z', o.lid || '#cbd5e1', 'stroke="#64748b" stroke-width="1.4"');
        }
        return s;
      }
      s += box(20, 44, 80, 52, o.body || '#78350f', 7, 'stroke="#451a03" stroke-width="2"');
      s += box(20, 60, 80, 10, '#451a03', 2);
      s += box(52, 56, 16, 22, o.clasp || '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.6"');
      if (o.strap) s += ps('M34,46 C34,20 86,20 86,46', o.strap, 5);
      if (o.zip) s += ps('M60,44 v44', o.zip, 3);
      if (o.button) {
        for (var bt = 0; bt < 3; bt++) s += c(60, 24 + bt * 16, 5, o.button);
      }
    } else if (o.shape === 'jewel') {
      var gem = o.stone || '#38bdf8';
      var metal = o.metal || '#cbd5e1';
      if (o.jewel === 'ring') {
        /* Seen from above: a band, a setting, and a stone. */
        s += c(60, 70, 24, metal, 'stroke="#94a3b8" stroke-width="3"');
        s += c(60, 70, 15, '#fdf6e8', 'stroke="#94a3b8" stroke-width="1.6"');
        s += pl('60,26 74,40 60,54 46,40', gem, 'stroke="#0369a1" stroke-width="2"');
        s += ps('M60,54 v10', metal, 3);
      } else if (o.jewel === 'earring') {
        s += ps('M60,18 a12,12 0 1 0 0.1,0', metal, 2.6);
        s += pl('60,38 74,52 60,66 46,52', gem, 'stroke="#0369a1" stroke-width="2"');
        s += c(60, 24, 3, gem);
      } else if (o.jewel === 'brooch') {
        s += e(60, 62, 30, 22, metal, 'stroke="#94a3b8" stroke-width="2.4"');
        for (var ptl = 0; ptl < 8; ptl++) {
          var pa = (ptl * Math.PI) / 4;
          s += c(60 + Math.cos(pa) * 24, 62 + Math.sin(pa) * 17, 4, gem, 'stroke="#0369a1" stroke-width="1.2"');
        }
        s += c(60, 62, 9, gem, 'stroke="#0369a1" stroke-width="2"');
      } else if (o.jewel === 'pin') {
        s += ps('M60,88 L60,42', metal, 3.4);
        s += ps('M52,86 L60,50 L68,86', metal, 2.4);
        s += c(60, 34, 9, gem, 'stroke="#0369a1" stroke-width="2"');
      } else {
        /* A necklace: two chains down from the shoulders to a stone. */
        s += ps('M34,14 C34,44 44,62 60,68 C76,62 86,44 86,14', metal, 3);
        s += c(46, 34, 2.6, metal) + c(60, 26, 2.6, metal) + c(74, 34, 2.6, metal);
        s += ps('M60,68 v8', metal, 2.4);
        s += pl('60,76 70,86 60,100 50,86', gem, 'stroke="#0369a1" stroke-width="2"');
      }
    } else if (o.shape === 'badge') {
      s += box(34, 26, 52, 72, o.card || '#fdfdff', 5, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(34, 26, 52, 18, o.band || '#0ea5e9', 4, 'stroke="#0369a1" stroke-width="1.6"');
      s += c(60, 62, 16, o.photo || '#e2e8f0');
      s += ps('M44,86 h32 M44,92 h20', '#cbd5e1', 2.2);
      if (o.photo) s += ps('M86,84 l6,4 l-6,4 Z', o.mark || '#0ea5e9');
    } else if (o.shape === 'soft') {
      s += p('M18,64 C18,42 40,30 60,36 C80,42 102,42 102,64 C102,86 78,96 60,92 C42,88 18,86 18,64 Z',
        o.body || '#0f172a', 'stroke="#1f2937" stroke-width="2"');
      if (o.mark) s += p(o.mark, o.markColour || '#f43f5e');
      if (o.pattern) {
        for (var gp = 0; gp < 6; gp++) s += c(28 + (gp * 17) % 64, 48 + (gp * 23) % 34, 3, o.pattern, 'opacity=".7"');
      }
    } else if (o.shape === 'mask') {
      /* A masquerade mask, worn over the eyes. It was drawn as `soft`, which is
         a patch of fabric: the two almond eye holes are what make it a mask, and
         without them it is a cloth. The ribbon is what says it is tied on. */
      s += p('M20,50 C20,30 100,30 100,50 C100,72 82,86 60,86 C38,86 20,72 20,50 Z',
        o.body || '#7c3aed', 'stroke="' + (o.edge || '#4c1d95') + '" stroke-width="2"');
      s += e(41, 55, 12, 8, o.eye || '#0f172a');
      s += e(79, 55, 12, 8, o.eye || '#0f172a');
      s += ps('M20,58 q-14,6 -16,18 M100,58 q14,6 16,18', o.body || '#7c3aed', 3.4);
      s += c(60, 38, 5, o.pattern || '#fbbf24') + c(60, 74, 4, o.pattern || '#fbbf24');
      s += ps('M32,44 q10,-6 18,-2 M88,44 q-10,-6 -18,-2', o.pattern || '#fbbf24', 2.4, 'opacity=".85"');
    } else if (o.shape === 'headgear') {
      s += c(60, 60, 34, SKIN, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += p('M26,52 C26,30 94,30 94,52 L94,58 L26,58 Z', o.body || '#dc2626', 'stroke="#991b1b" stroke-width="2"');
      if (o.kind === 'cap') {
        s += e(60, 58, 46, 8, o.body || '#dc2626', 'stroke="#991b1b" stroke-width="2"');
        s += c(60, 34, 5, o.band || '#fdfdff');
      } else if (o.kind === 'helmet') {
        s += p('M26,52 C26,20 94,20 94,52 Z', o.body || '#f59e0b', 'stroke="#b45309" stroke-width="2"');
        s += box(22, 48, 76, 8, o.band || '#b45309', 3, 'stroke="#92400e" stroke-width="1.6"');
      } else if (o.kind === 'beanie') {
        s += p('M26,54 C26,28 94,28 94,54 Z', o.body || '#0ea5e9', 'stroke="#0369a1" stroke-width="2"');
        s += box(24, 50, 72, 10, o.band || '#0284c7', 3);
        s += c(60, 24, 7, o.band || '#0284c7');
      } else {
        s += box(20, 50, 80, 8, o.band || '#b45309', 3, 'stroke="#92400e" stroke-width="1.6"');
      }
    }
    return s;
  });

  /** A room and the things built into it. */
  kind('household', function (o) {
    var s = shadow(100, o.wide || 34, 0.08);
    if (o.shape === 'door') {
      s += box(30, 16, 60, 88, o.leaf || '#92400e', 4, 'stroke="#6b4423" stroke-width="2"');
      s += box(38, 26, 20, 30, o.panel || '#78350f', 3, 'stroke="#5c3a1a" stroke-width="1.6"');
      s += box(38, 66, 20, 28, o.panel || '#78350f', 3, 'stroke="#5c3a1a" stroke-width="1.6"');
      s += c(76, 62, 5, o.handle || '#fbbf24', 'stroke="#b45309" stroke-width="1.6"');
      if (o.frame) s += box(24, 10, 72, 10, o.frame, 2, 'stroke="#6b4423" stroke-width="1.6"');
      if (o.lamp) s += c(60, 12, 8, '#fde68a', 'stroke="#fbbf24" stroke-width="2"');
    } else if (o.shape === 'gate') {
      /* A gate, which is a door you can see through: two posts, a frame, and
         bars. The word was drawn as an envelope. What separates it from `door`
         is the bars — a solid panel with a handle is a door, a frame you can
         see the garden through is a gate, and the bars are the whole
         difference. */
      s += box(14, 22, 12, 80, o.post || '#92400e', 3, 'stroke="#6b4423" stroke-width="2"');
      s += box(94, 22, 12, 80, o.post || '#92400e', 3, 'stroke="#6b4423" stroke-width="2"');
      s += box(14, 22, 92, 10, o.rail || '#78350f', 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(14, 92, 92, 10, o.rail || '#78350f', 2, 'stroke="#6b4423" stroke-width="1.6"');
      for (var gb = 0; gb < 5; gb++) {
        s += box(32 + gb * 14, 32, 6, 60, o.bar || '#b45309', 2, 'stroke="#6b4423" stroke-width="1.2"');
      }
      /* the diagonal brace is what says "gate" and not "fence panel" */
      s += ps('M32,92 L90,32', o.rail || '#78350f', 4);
      s += c(86, 62, 4.5, o.handle || '#fbbf24', 'stroke="#b45309" stroke-width="1.4"');
    } else if (o.shape === 'window') {
      s += box(20, 24, 80, 64, o.frame || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
      s += box(28, 32, 64, 48, o.glass || '#bae6fd', 2);
      s += ps('M60,32 v48 M28,56 h64', o.frame || '#94a3b8', 3);
      s += ps('M32,74 L52,44 M50,78 L72,46', '#ffffff', 3, 'opacity=".7"');
      if (o.sill) s += box(14, 88, 92, 10, o.sill, 2, 'stroke="#78716c" stroke-width="1.6"');
      if (o.curtain) {
        s += p('M14,20 C22,44 20,70 12,92 L30,92 C34,66 32,42 26,20 Z', o.curtain, 'stroke="#991b1b" stroke-width="1.6"');
        s += p('M106,20 C98,44 100,70 108,92 L90,92 C86,66 88,42 94,20 Z', o.curtain, 'stroke="#991b1b" stroke-width="1.6"');
      }
      if (o.blind) for (var bl = 0; bl < 4; bl++) s += box(22, 26 + bl * 12, 76, 7, o.blind, 2);
    } else if (o.shape === 'stairs') {
      for (var st = 0; st < 6; st++) {
        s += box(20 + st * 13, 92 - st * 13, 14, 13, o.step || '#a16207', 2, 'stroke="#6b4423" stroke-width="1.4"');
      }
      if (o.rail) {
        s += ps('M22,84 L92,14', o.rail, 5);
        s += ps('M22,96 L100,18', o.rail, 3);
      }
    } else if (o.shape === 'roof') {
      /* A house is a roof pitch, a number of storeys, an opening and whether
         it has a chimney. Four colours on the same cottage is one cottage. */
      var pitch = o.pitch === undefined ? 44 : o.pitch;
      var storeys = o.storeys === undefined ? 1 : o.storeys;
      var wallTop = 62 + (storeys - 1) * 0;
      var eave = 62 - (pitch - 44) * 0.5;
      s += p('M8,' + eave + ' L60,' + (eave - pitch) + ' L112,' + eave + ' L112,' + (eave + 8) + ' L8,' + (eave + 8) + ' Z',
        o.roof || '#dc2626', 'stroke="#b91c1c" stroke-width="2"');
      s += box(16, eave + 6, 88, 104 - eave, o.wall || '#e2e8f0', 3, 'stroke="#94a3b8" stroke-width="2"');
      if (storeys > 1) {
        s += box(16, eave + 6, 88, 4, '#94a3b8', 1);
        for (var wu = 0; wu < 2; wu++) {
          s += box(26 + wu * 46, eave + 14, 18, 14, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
        }
      }
      if (o.garage) {
        s += box(24, 74, 42, 30, o.door || '#94a3b8', 2, 'stroke="#64748b" stroke-width="1.6"');
        for (var gl = 0; gl < 3; gl++) s += ps('M24,' + (81 + gl * 8) + ' h42', '#64748b', 1.4);
        s += box(76, 78, 20, 14, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
      } else if (o.dormer) {
        s += box(40, eave - 4, 40, 20, o.wall || '#e2e8f0', 2, 'stroke="#94a3b8" stroke-width="1.6"');
        s += p('M36,' + (eave - 4) + ' L60,' + (eave - 22) + ' L84,' + (eave - 4) + ' Z', o.roof || '#dc2626',
          'stroke="#b91c1c" stroke-width="1.4"');
        s += box(52, eave + 2, 16, 12, '#bae6fd', 1.5, 'stroke="#0369a1" stroke-width="1.2"');
        s += box(48, 88, 24, 16, o.door || '#78350f', 2, 'stroke="#451a03" stroke-width="1.4"');
      } else {
        s += box(48, 78, 24, 26, o.door || '#78350f', 2, 'stroke="#451a03" stroke-width="1.6"');
        s += box(24, 76, 16, 14, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
        s += box(80, 76, 16, 14, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
      }
      if (o.chimney) {
        s += box(o.chimneyAt === 'left' ? 26 : 78, eave - pitch * 0.7, 16, pitch * 0.7 + 12,
          o.chimney, 2, 'stroke="#78716c" stroke-width="1.6"');
        s += box((o.chimneyAt === 'left' ? 24 : 76), eave - pitch * 0.7 - 4, 20, 6, '#57534e', 2);
        s += ps('M' + (o.chimneyAt === 'left' ? 34 : 86) + ',' + (eave - pitch * 0.7 - 8) +
          ' c-4,-6 4,-8 0,-14', '#cbd5e1', 3, 'opacity=".7"');
      }
    } else if (o.shape === 'heating') {
      for (var cl = 0; cl < 7; cl++) s += box(28 + cl * 10, 34, 7, 54, o.body || '#f1f5f9', 2, 'stroke="#94a3b8" stroke-width="1.4"');
      s += rc(24, 88, 72, 10, o.body || '#e2e8f0', 3, 'stroke="#94a3b8" stroke-width="1.6"');
      s += ps('M60,20 a10,10 0 1 1 0,0.1 M60,14 c0,0 -6,-4 -4,-8', '#94a3b8', 2.4);
    } else if (o.shape === 'lamp') {
      s += ps('M60,20 L60,76', o.stem || '#94a3b8', 4);
      s += p('M34,20 L86,20 L74,4 L46,4 Z', o.shade || '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += e(60, 84, 26, 8, o.base || '#94a3b8', 'stroke="#64748b" stroke-width="1.6"');
      s += c(60, 14, 8, '#fef3c7', 'opacity=".8"');
    } else if (o.shape === 'wallpaper') {
      if (o.surface === 'floor') {
        /* Boards running away from you: they narrow as they go. */
        s += box(8, 26, 104, 74, o.paper || '#d6c9a8', 3, 'stroke="#a89878" stroke-width="2"');
        for (var fb = 0; fb < 6; fb++) {
          var fx2 = 16 + fb * 16;
          s += ps('M' + fx2 + ',28 L' + (60 + (fx2 - 60) * 0.6).toFixed(1) + ',98', '#a89878', 1.4);
        }
        for (var fr = 0; fr < 3; fr++) {
          var fy2 = 42 + fr * 20;
          var k = (fy2 - 28) / 70;
          s += ps('M' + (60 - 52 * (1 - k * 0.4)).toFixed(1) + ',' + fy2 + ' h' + (104 * (1 - k * 0.4)).toFixed(1),
            '#a89878', 1.4);
        }
      } else if (o.surface === 'wall') {
        s += box(10, 14, 100, 74, o.paper || '#e2e8f0', 3, 'stroke="#94a3b8" stroke-width="2"');
        for (var vs = 0; vs < 5; vs++) {
          s += box(18 + vs * 19, 16, 8, 70, o.motif || '#cbd5e1', 2, 'opacity=".7"');
        }
        s += box(10, 88, 100, 10, o.skirt || '#a16207', 2, 'stroke="#6b4423" stroke-width="1.6"');
      } else if (o.surface === 'ceiling') {
        s += box(10, 40, 100, 60, o.paper || '#f8fafc', 3, 'stroke="#cbd5e1" stroke-width="2"');
        s += rc(52, 62, 16, 18, '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="1.6"');
        s += c(60, 78, 9, '#fef3c7', 'stroke="#fbbf24" stroke-width="1.6"');
        for (var rt = 0; rt < 3; rt++) s += ps('M60,88 v10 M' + (52 - rt * 6) + ',98 h' + (16 + rt * 12), '#cbd5e1', 1.6);
      } else {
        s += box(12, 16, 96, 84, o.paper || '#fce7f3', 3, 'stroke="#cbd5e1" stroke-width="2"');
        for (var wv = 0; wv < 4; wv++) {
          for (var wu = 0; wu < 4; wu++) {
            s += c(26 + wu * 24, 32 + wv * 22, 5, o.motif || '#f9a8d4', 'opacity=".8"');
            s += c(26 + wu * 24 + 12, 32 + wv * 22 + 11, 5, o.motif || '#f9a8d4', 'opacity=".8"');
          }
        }
      }
    } else if (o.shape === 'room') {
      /* A room is a shell, a floor line and what stands in it. Dressing it is
         what tells a kitchen from a bathroom; four walls alone do not. */
      s += box(10, 16, 100, 84, o.wall || '#fef3c7', 5, 'stroke="#d6c9a8" stroke-width="2"');
      s += box(10, 74, 100, 26, o.floor || '#d6c9a8', 0);
      s += ps('M10,74 h100', '#a89878', 1.6);
      for (var fl = 0; fl < 4; fl++) s += ps('M' + (26 + fl * 24) + ',76 l-6,22', '#a89878', 1.2);
      if (o.furniture === 'bath') {
        s += p('M56,74 C56,56 84,56 84,74 L84,86 L56,86 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="1.6"');
        s += ps('M70,56 v-6 q0,-4 6,-4', '#94a3b8', 2.4);
        s += c(70, 60, 3, '#cbd5e1');
        s += e(28, 84, 14, 6, '#f8fafc', 'stroke="#94a3b8" stroke-width="1.4"');
      } else if (o.furniture === 'bed') {
        s += box(20, 60, 46, 16, '#a16207', 3, 'stroke="#6b4423" stroke-width="1.6"');
        s += box(22, 52, 22, 12, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="1.2"');
        s += p('M44,66 C44,60 64,60 64,66 L64,76 L44,76 Z', '#60a5fa');
        s += box(66, 40, 12, 22, '#78350f', 2, 'stroke="#451a03" stroke-width="1.4"');
      } else if (o.furniture === 'kitchen') {
        s += box(18, 46, 50, 20, '#cbd5e1', 2, 'stroke="#64748b" stroke-width="1.6"');
        s += box(18, 66, 50, 8, '#94a3b8', 2, 'stroke="#64748b" stroke-width="1.2"');
        s += c(34, 50, 4, '#334155') + c(52, 50, 4, '#334155');
        s += box(74, 34, 22, 20, '#e2e8f0', 2, 'stroke="#64748b" stroke-width="1.6"');
        s += ps('M85,34 v-8 M81,28 h8', '#64748b', 2.4);
        s += c(85, 22, 4, '#94a3b8');
      } else if (o.furniture === 'hall') {
        /* A hallway runs from the front door to the rooms: a runner, hooks. */
        s += box(20, 58, 28, 18, '#78350f', 2, 'stroke="#451a03" stroke-width="1.6"');
        s += c(42, 68, 3, '#fbbf24');
        s += box(66, 44, 26, 32, '#e2e8f0', 2, 'stroke="#94a3b8" stroke-width="1.6"');
        s += ps('M79,44 v32 M66,60 h26', '#0369a1', 1.6);
        s += p('M30,78 L84,78 L90,94 L24,94 Z', '#be123c', 'stroke="#881337" stroke-width="1.4"');
        s += ps('M32,83 h50 M30,88 h54', '#fecdd3', 1.6);
        s += ps('M52,58 v14 M58,58 v14', '#94a3b8', 2.4);
        s += p('M50,72 C50,62 62,62 62,72 L62,86 L50,86 Z', '#334155', 'stroke="#1f2937" stroke-width="1.4"');
      } else if (o.furniture === 'foyer') {
        /* A foyer is the room inside the door: a mirror, a console, a lamp. */
        s += e(40, 40, 18, 22, '#bae6fd', 'stroke="#94a3b8" stroke-width="3"');
        s += ps('M30,28 l-6,-8 M28,44 l-8,-4', '#ffffff', 3, 'opacity=".8"');
        s += box(62, 52, 40, 8, '#a16207', 2, 'stroke="#6b4423" stroke-width="1.6"');
        s += ps('M68,60 v22 M96,60 v22', '#78350f', 4);
        s += box(74, 40, 16, 12, '#fbbf24', 2, 'stroke="#b45309" stroke-width="1.4"');
        s += ps('M82,40 v-8 M78,34 h8', '#92400e', 2.2);
        s += p('M18,84 L104,84 L98,100 L24,100 Z', '#cbd5e1', 'stroke="#94a3b8" stroke-width="1.4"');
        s += c(30, 90, 5, '#94a3b8', 'opacity=".7"');
        s += c(84, 92, 4, '#94a3b8', 'opacity=".7"');
      } else if (o.furniture === 'cellar') {
        /* A cellar is underground: stone courses, a barrel, a rack, no light. */
        s += box(14, 22, 44, 52, '#78716c', 3, 'stroke="#57534e" stroke-width="1.6"');
        for (var cst = 0; cst < 4; cst++) {
          for (var csc = 0; csc < 2; csc++) {
            s += box(16 + csc * 23 + (cst % 2) * 11, 26 + cst * 12, 20, 9, '#a8a29e', 1.2, 'opacity=".8"');
          }
        }
        s += ps('M44,22 v52', '#44403c', 1.4);
        s += p('M70,74 C70,50 94,50 94,74 L94,88 L70,88 Z', '#a16207', 'stroke="#6b4423" stroke-width="1.6"');
        s += ps('M70,60 h24 M70,70 h24', '#6b4423', 1.6, 'opacity=".7"');
        s += box(66, 90, 28, 8, '#57534e', 2, 'stroke="#44403c" stroke-width="1.4"');
      } else if (o.furniture === 'furnace') {
        /* A basement is finished: a furnace, a duct, a window down at grade. */
        s += box(14, 32, 40, 58, '#cbd5e1', 3, 'stroke="#64748b" stroke-width="1.8"');
        s += box(20, 38, 28, 20, '#94a3b8', 2, 'stroke="#64748b" stroke-width="1.4"');
        s += c(34, 66, 8, '#334155', 'stroke="#1f2937" stroke-width="1.6"');
        s += ps('M28,66 h12 M34,60 v12', '#e2e8f0', 2);
        s += rc(56, 20, 18, 16, '#cbd5e1', 3, 'stroke="#64748b" stroke-width="1.4"');
        s += ps('M65,36 v44', '#94a3b8', 7);
        s += ps('M65,80 q0,8 10,8', '#94a3b8', 7);
        s += box(78, 60, 28, 30, '#bae6fd', 3, 'stroke="#0369a1" stroke-width="1.6"');
        s += ps('M92,60 v30 M78,75 h28', '#0369a1', 1.8);
      } else {
        s += box(20, 54, 40, 22, '#a16207', 2, 'stroke="#6b4423" stroke-width="1.6"');
        s += box(66, 46, 26, 30, '#cbd5e1', 2, 'stroke="#94a3b8" stroke-width="1.6"');
      }
      if (o.skirt) s += box(10, 70, 100, 5, o.skirt, 1.5);
    } else if (o.shape === 'mat') {
      /* A mat lies on the ground: seen at an angle, with a border. */
      s += p('M14,74 L106,74 L98,100 L22,100 Z', o.body || '#a16207', 'stroke="#6b4423" stroke-width="2"');
      s += p('M22,80 L98,80 L94,94 L26,94 Z', o.inner || '#d6c9a8');
      for (var mw2 = 0; mw2 < 7; mw2++) {
        s += ps('M' + (26 + mw2 * 11) + ',82 l-3,10', '#a89878', 1.4);
      }
      s += box(14, 68, 92, 8, o.body || '#a16207', 3, 'stroke="#6b4423" stroke-width="1.6"');
    } else if (o.shape === 'dial') {
      /* A thermostat is a needle on a dial, not a screen. */
      s += c(60, 62, 36, o.body || '#f8fafc', 'stroke="#64748b" stroke-width="3"');
      s += c(60, 62, 30, o.face || '#e2e8f0');
      for (var tk = 0; tk < 9; tk++) {
        var tka = Math.PI * 0.75 + (tk * Math.PI * 1.5) / 8;
        s += ps('M' + (60 + Math.cos(tka) * 24).toFixed(1) + ',' + (62 + Math.sin(tka) * 24).toFixed(1) +
          ' l' + (Math.cos(tka) * 6).toFixed(1) + ',' + (Math.sin(tka) * 6).toFixed(1), '#64748b', 2);
      }
      s += ps('M60,62 L' + (60 + Math.cos(-2.1) * 20).toFixed(1) + ',' + (62 + Math.sin(-2.1) * 20).toFixed(1),
        '#dc2626', 3.4);
      s += c(60, 62, 4, '#334155');
      s += ps('M60,26 v-8', '#94a3b8', 4);
    } else if (o.shape === 'smoke') {
      /* A smoke alarm hangs from the ceiling: a disc, a slot, a light. */
      s += rc(56, 20, 8, 18, '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="1.4"');
      s += e(60, 58, 34, 22, o.body || '#f1f5f9', 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M42,54 q18,10 36,0', '#64748b', 2.4);
      s += c(60, 70, 5, o.light || '#22c55e', 'stroke="#166534" stroke-width="1.2"');
      for (var smk = 0; smk < 3; smk++) {
        s += ps('M' + (48 + smk * 12) + ',34 c-3,-5 3,-7 0,-12', '#cbd5e1', 2.4, 'opacity=".8"');
      }
    } else if (o.shape === 'skirting') {
      s += box(10, 20, 100, 72, o.wall || '#e2e8f0', 3, 'stroke="#94a3b8" stroke-width="2"');
      for (var stp = 0; stp < 4; stp++) s += ps('M' + (24 + stp * 24) + ',24 v12', '#cbd5e1', 1.4);
      s += box(10, 76, 100, 20, o.board || '#fdfdff', 3, 'stroke="#94a3b8" stroke-width="1.6"');
      s += box(10, 68, 100, 8, o.board || '#fdfdff', 2, 'stroke="#94a3b8" stroke-width="1.4"');
      s += ps('M10,80 h100', '#cbd5e1', 1.4);
    } else if (o.shape === 'rail') {
      s += rc(12, 46, 96, 10, o.metal || '#cbd5e1', 5, 'stroke="#94a3b8" stroke-width="1.6"');
      s += e(14, 51, 8, 10, o.metal || '#cbd5e1', 'stroke="#94a3b8" stroke-width="1.6"');
      s += e(106, 51, 8, 10, o.metal || '#cbd5e1', 'stroke="#94a3b8" stroke-width="1.6"');
      for (var rg = 0; rg < 5; rg++) {
        s += c(28 + rg * 16, 66, 6, 'none', 'stroke="' + (o.ring || '#e2e8f0') + '" stroke-width="2.4"');
      }
      s += p('M22,70 C24,86 20,94 16,102 L34,102 C30,92 32,82 36,70 Z',
        o.cloth || '#fda4af', 'stroke="#be185d" stroke-width="1.4"');
    } else if (o.shape === 'slot') {
      /* A letter slot in a door: a plate, a flap and a mouth. */
      s += box(24, 30, 72, 62, o.door || '#92400e', 4, 'stroke="#6b4423" stroke-width="2"');
      s += box(32, 50, 56, 18, o.plate || '#cbd5e1', 3, 'stroke="#64748b" stroke-width="1.6"');
      s += box(38, 56, 44, 6, o.mouth || '#1f2937', 2);
      s += ps('M34,52 h52', '#f8fafc', 1.6, 'opacity=".7"');
      s += c(80, 80, 4, '#fbbf24', 'stroke="#b45309" stroke-width="1.2"');
    } else if (o.shape === 'keyhole') {
      s += box(38, 34, 44, 56, o.plate || '#cbd5e1', 6, 'stroke="#64748b" stroke-width="2"');
      s += c(60, 54, 7, o.mouth || '#1f2937');
      s += p('M56,58 L64,58 L66,80 L54,80 Z', o.mouth || '#1f2937');
      s += ps('M46,40 l6,6 M74,40 l-6,6 M60,38 v-4', '#f8fafc', 1.6, 'opacity=".8"');
    } else if (o.shape === 'bumper') {
      /* A car bumper: a long bar with two overriders and a number plate. */
      s += p('M8,58 C8,48 20,44 34,44 L86,44 C100,44 112,48 112,58 L112,72 C112,78 104,82 96,82 L24,82 C16,82 8,78 8,72 Z',
        o.body || '#475569', 'stroke="#1e293b" stroke-width="2"');
      s += box(44, 52, 32, 18, o.plate || '#f8fafc', 3, 'stroke="#94a3b8" stroke-width="1.4"');
      s += ps('M52,58 h16 M52,64 h12', '#334155', 2);
      s += box(20, 86, 22, 10, o.body || '#475569', 3, 'stroke="#1e293b" stroke-width="1.4"');
      s += box(78, 86, 22, 10, o.body || '#475569', 3, 'stroke="#1e293b" stroke-width="1.4"');
      s += ps('M14,64 h8 M98,64 h8', '#94a3b8', 2, 'opacity=".7"');
    } else if (o.shape === 'panel') {
      /* A light switch. The plate says nothing on its own — it is a blank
         rectangle, and it was drawn as one until the rocker went in. The
         reading has to come from the rocker and the line across it, which is
         the only part of a switch that differs from the wall around it. */
      s += box(20, 24, 80, 74, o.face || '#e2e8f0', 5, 'stroke="#94a3b8" stroke-width="2"');
      s += box(44, 40, 32, 42, o.slot || '#f8fafc', 4, 'stroke="#64748b" stroke-width="1.8"');
      s += ps('M46,61 h28', '#94a3b8', 1.6);
      if (o.glow) s += c(60, 38, 22, o.glow, 'opacity=".3"');
    } else if (o.shape === 'gutter') {
      s += box(8, 18, 104, 84, o.wall || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="2"');
      s += p('M8,30 L112,30 L112,46 C112,54 96,54 90,50 C80,44 40,44 30,50 C24,54 8,54 8,46 Z',
        o.metal || '#94a3b8', 'stroke="#64748b" stroke-width="1.6"');
      s += box(8, 18, 104, 12, o.roof || '#334155', 2, 'stroke="#1f2937" stroke-width="1.4"');
      s += ps('M60,50 v30', '#475569', 4);
      s += p('M52,50 h16 v10 h-16 Z', o.metal || '#94a3b8', 'stroke="#64748b" stroke-width="1.4"');
      s += ps('M16,66 h30 M74,66 h30', '#94a3b8', 1.6, 'opacity=".7"');
    } else if (o.shape === 'calendar') {
      s += box(20, 18, 80, 84, '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(20, 18, 80, 20, o.band || '#0ea5e9', 4, 'stroke="#0369a1" stroke-width="1.6"');
      s += ps('M40,18 v-6 M80,18 v-6', '#334155', 3.4);
      for (var cl2 = 0; cl2 < 4; cl2++) {
        for (var cr3 = 0; cr3 < 4; cr3++) {
          s += box(28 + cr3 * 17, 46 + cl2 * 14, 12, 10,
            (cl2 === 1 && cr3 === 2) ? (o.mark || '#dc2626') : '#e2e8f0', 2);
        }
      }
    } else if (o.shape === 'soil') {
      /* A cut through the ground: topsoil, subsoil, then rock. */
      s += rc(0, 0, 120, 120, o.sky || '#eff6e2', 16);
      s += ps('M0,20 q30,-8 60,0 q30,8 60,0', '#4a9e4a', 10);
      s += box(0, 30, 120, 24, o.top || '#5c3a1a', 0);
      s += box(0, 54, 120, 28, o.sub || '#8a6a3a', 0);
      s += box(0, 82, 120, 38, o.rock || '#a8a29e', 0);
      for (var sm2 = 0; sm2 < 5; sm2++) {
        s += c(14 + sm2 * 24, 66 + (sm2 % 2) * 12, 4, o.stone || '#78716c', 'opacity=".8"');
      }
      s += ps('M60,30 v-12 M52,22 l8,-8 l8,8', '#4a9e4a', 3);
    } else if (o.shape === 'rootball') {
      s += ps('M0,40 h120', o.top || '#4a9e4a', 9);
      s += ps('M44,40 C44,58 34,74 40,96 M76,40 C76,60 88,76 82,96 M60,40 v56', '#b45309', 4);
      s += e(60, 82, 34, 20, o.ball || '#8a6a3a', 'stroke="#6b4423" stroke-width="1.6"');
      for (var th = 0; th < 4; th++) {
        s += ps('M' + (40 + th * 13) + ',40 l-6,14 M' + (44 + th * 13) + ',40 l6,14', '#4a9e4a', 2.4);
      }
    } else if (o.shape === 'bell') {
      s += rc(54, 14, 12, 14, '#94a3b8', 3);
      s += p('M32,80 C32,44 88,44 88,80 Z', o.bell || '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += box(28, 80, 64, 8, '#b45309', 3);
      s += c(60, 94, 7, '#b45309');
      for (var bn = 0; bn < 2; bn++) s += ps('M22,' + (56 + bn * 14) + ' q-8,7 0,14 M98,' + (56 + bn * 14) + ' q8,7 0,14', o.bell || '#fbbf24', 2.4);
    }
    return s;
  });

  /** A thing you can sit on, sleep on, or keep things in. */
  kind('furniture', function (o) {
    var wood = o.wood || '#a16207';
    var s = shadow(100, o.wide || 36, 0.08);
    if (o.shape === 'bed') {
      s += box(12, 44, 96, 14, o.head || wood, 3, 'stroke="#6b4423" stroke-width="2"');
      s += box(16, 30, 34, 18, '#fdfdff', 6, 'stroke="#cbd5e1" stroke-width="1.6"');
      s += p('M44,58 C44,48 96,48 96,58 L96,76 C96,80 92,82 88,82 L52,82 C48,82 44,80 44,76 Z', o.cover || '#3b82f6');
      s += box(12, 78, 96, 18, o.base || wood, 3, 'stroke="#6b4423" stroke-width="2"');
      s += box(16, 60, 12, 36, o.base || wood, 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(92, 60, 12, 36, o.base || wood, 2, 'stroke="#6b4423" stroke-width="1.6"');
      if (o.stacked) s += p('M46,50 C46,40 94,40 94,50 L94,58 L46,58 Z', o.stacked);
      if (o.skirt) s += box(12, 96, 96, 6, o.skirt, 2);
    } else if (o.shape === 'chair') {
      /* Seat, back, legs. A bench has no back, a deckchair folds flat, and a
         rocking chair has rockers instead of feet. */
      if (o.noBack) {
        s += box(12, 56, 96, 12, o.seat || '#a16207', 3, 'stroke="#6b4423" stroke-width="2"');
        s += ps('M20,68 L12,100 M100,68 L108,100 M18,86 h84', o.frame || '#78350f', 5);
        s += ps('M12,56 h96', o.frame || '#78350f', 4);
        return s;
      }
      if (o.reclined) {
        s += p('M28,58 L84,46 L96,60 L44,76 Z', o.seat || '#f1f5f9', 'stroke="#0369a1" stroke-width="2"');
        s += ps('M30,50 L22,78 M86,42 L98,68', o.frame || '#0ea9e9', 4);
        s += ps('M24,80 L88,58', o.frame || '#0ea9e9', 5);
        s += ps('M22,78 L12,100 M98,68 L106,92', o.frame || '#0ea9e9', 4);
        return s;
      }
      s += box(36, 22, 48, 40, o.seat || '#334155', 8, 'stroke="#1f2937" stroke-width="2"');
      s += box(24, 60, 72, 14, o.frame || '#a16207', 4, 'stroke="#6b4423" stroke-width="2"');
      s += ps('M32,74 L26,98 M88,74 L94,98 M32,74 L88,74', o.frame || '#a16207', 5);
      if (o.pad) {
        /* An armchair is padded: a seat cushion and two rolled arms. */
        s += e(60, 64, 34, 8, o.pad, 'stroke="#94a3b8" stroke-width="1.4"');
        s += e(28, 50, 8, 20, o.pad, 'stroke="#94a3b8" stroke-width="1.4"');
        s += e(92, 50, 8, 20, o.pad, 'stroke="#94a3b8" stroke-width="1.4"');
        s += c(46, 38, 4, o.pad, 'opacity=".6"') + c(74, 38, 4, o.pad, 'opacity=".6"');
      }
      if (o.woven) {
        s += ps('M40,30 h40 M40,42 h40 M40,54 h40', o.woven, 2, 'opacity=".8"');
      }
      if (o.rocker) s += ps('M20,100 q40,10 80,0', o.frame || '#a16207', 5);
    } else if (o.shape === 'sofa') {
      if (o.reclined) {
        /* A chaise longue: a seat with one end raised, on a low frame. */
        s += p('M14,66 L74,50 L86,62 L26,80 Z', o.seat || '#7c3aed', 'stroke="#5b21b6" stroke-width="2"');
        s += p('M14,66 L74,50 L74,42 L14,58 Z', o.back || '#a78bfa', 'stroke="#5b21b6" stroke-width="1.6"');
        s += ps('M26,80 L18,102 M86,62 L94,86 M18,94 h76', o.arm || '#6d28d9', 4);
        s += e(48, 70, 16, 5, o.cushions || '#c4b5fd', 'opacity=".8"');
        return s;
      }
      s += box(12, 46, 96, 30, o.seat || '#6366f1', 8, 'stroke="#4338ca" stroke-width="2"');
      s += box(20, 30, 80, 22, o.back || '#818cf8', 8, 'stroke="#4338ca" stroke-width="2"');
      s += box(6, 46, 18, 32, o.arm || '#4f46e5', 6, 'stroke="#4338ca" stroke-width="1.6"');
      s += box(96, 46, 18, 32, o.arm || '#4f46e5', 6, 'stroke="#4338ca" stroke-width="1.6"');
      s += ps('M20,76 v16 M100,76 v16', o.leg || '#4338ca', 5);
      if (o.cushions) s += e(42, 44, 14, 10, o.cushions) + e(78, 44, 14, 10, o.cushions);
    } else if (o.shape === 'table') {
      /* Ten words are a table, and a table is only a table if you can tell
         which one. What differs is the top (round, square, overhanging or not),
         the legs (splayed, straight, splayed and braced) and what is under it
         (a drawer, a shelf, a step, nothing). Colour is not one of those. */
      if (o.round) {
        s += e(60, 50, o.wide2 ? 42 : 28, 11, o.top || wood, 'stroke="#6b4423" stroke-width="2"');
        s += e(60, 54, o.wide2 ? 38 : 24, 8, o.edge || '#92400e', 'opacity=".55"');
        if (o.splay) {
          s += ps('M38,56 L24,100 M82,56 L96,100', o.leg || wood, 6);
          s += ps('M30,84 h60', o.leg || wood, 4);
        } else {
          s += ps('M42,58 L40,100 M78,58 L80,100', o.leg || wood, 6);
        }
      } else if (o.pedestal) {
        /* A plinth is a plain block: no overhang, no stretcher, nothing. */
        s += box(34, 30, 52, 14, o.top || wood, 2, 'stroke="#6b4423" stroke-width="2"');
        s += box(38, 44, 44, 48, o.leg || '#a8a29e', 2, 'stroke="#6b4423" stroke-width="1.6"');
        s += box(32, 92, 56, 10, o.cap || '#92400e', 2, 'stroke="#6b4423" stroke-width="1.6"');
        s += ps('M44,50 v36 M76,50 v36', o.cap || '#92400e', 1.6, 'opacity=".6"');
      } else if (o.low) {
        /* A coffee table is long and low, with the shelf underneath. */
        s += box(6, 62, 108, 12, o.top || wood, 3, 'stroke="#6b4423" stroke-width="2"');
        s += ps('M20,74 L14,102 M100,74 L106,102', o.leg || wood, 6);
        s += box(22, 84, 76, 6, o.shelf || '#c2843a', 2, 'stroke="#6b4423" stroke-width="1.4"');
        s += box(46, 76, 28, 5, o.accent || '#94a3b8', 2);
      } else {
        s += box(o.overhang === 0 ? 22 : 10, 48, o.overhang === 0 ? 76 : 100, 14,
          o.top || wood, 3, 'stroke="#6b4423" stroke-width="2"');
        if (o.overhang !== 0) {
          s += box(6, 56, 108, 6, o.edge || '#92400e', 2, 'opacity=".5"');
        }
        if (o.splay) {
          s += ps('M24,62 L16,100 M96,62 L104,100', o.leg || wood, 6);
          s += ps('M24,92 h72', o.leg || wood, 4);
        } else {
          s += ps('M26,62 L22,100 M94,62 L98,100', o.leg || wood, 6);
          s += ps('M26,82 h68', o.leg || wood, 5);
        }
        if (o.lip) s += box(14, 60, 92, 5, o.lip, 2, 'stroke="#6b4423" stroke-width="1.2"');
      }
      var rows = o.drawers === true ? 2 : (o.drawers || 0);
      for (var dr = 0; dr < rows; dr++) {
        var dy = 66 + dr * 11;
        if (dy > 88) break;
        s += box(34, dy, 52, 9, o.drawerFace || o.drawers || '#b45309', 2, 'stroke="#6b4423" stroke-width="1.2"');
        if (o.knob) s += c(60, dy + 4, 3.4, o.pull || '#fbbf24', 'stroke="#b45309" stroke-width="1"');
        else s += ps('M52,' + (dy + 4) + ' h16', o.pull || '#fbbf24', 2.4);
      }
      if (o.door) {
        /* A sideboard is a wide box with two doors, not a table with a top. */
        s += box(24, 46, 72, 44, o.door, 3, 'stroke="#6b4423" stroke-width="1.8"');
        s += ps('M60,48 v40', '#6b4423', 1.6);
        s += c(54, 68, 2.6, o.pull || '#fbbf24') + c(66, 68, 2.6, o.pull || '#fbbf24');
        s += ps('M34,88 l6,-6 M86,88 l-6,-6', '#6b4423', 3);
      }
      if (o.mirror) {
        s += e(60, 32, 26, 20, o.mirror, 'stroke="#94a3b8" stroke-width="3"');
        s += ps('M60,52 v-6', '#94a3b8', 3);
      }
      if (o.step) {
        s += box(20, 86, 40, 12, o.step, 3, 'stroke="#6b4423" stroke-width="1.6"');
        s += box(60, 86, 40, 12, o.step, 3, 'stroke="#6b4423" stroke-width="1.6"');
      }
    } else if (o.shape === 'storage') {
      /* A wardrobe has two tall doors, a dresser three wide drawers, a sideboard
         two doors over legs, and a cupboard one short door. Same carcass, four
         different objects. */
      s += box(18, 14, 84, 88, o.body || '#a8a29e', 5, 'stroke="#57534e" stroke-width="2"');
      if (o.single) {
        /* A cupboard: one short door, on a plinth, with a shelf showing. */
        s += box(26, 32, 68, 44, o.door || '#cbd5e1', 3, 'stroke="#78716c" stroke-width="1.6"');
        s += c(86, 54, 3.4, o.handle || '#475569');
        s += box(30, 82, 60, 6, o.door || '#cbd5e1', 2, 'stroke="#78716c" stroke-width="1.2"');
        s += box(24, 100, 72, 8, o.body || '#a8a29e', 2, 'stroke="#57534e" stroke-width="1.4"');
        s += e(60, 24, 26, 8, '#cbd5e1', 'opacity=".35"');
      } else if (o.drawers) {
        /* A dresser: a stack of wide drawers, one per row. */
        for (var dw = 0; dw < 3; dw++) {
          s += box(24, 22 + dw * 26, 72, 22, o.door || '#cbd5e1', 3, 'stroke="#78716c" stroke-width="1.4"');
          s += ps('M' + (38 + dw * 2) + ',' + (33 + dw * 26) + ' h44', o.handle || '#475569', 2.6);
        }
        s += box(16, 100, 88, 6, o.body || '#a8a29e', 2, 'stroke="#57534e" stroke-width="1.4"');
      } else {
        s += box(24, 20, 36, 38, o.door || '#cbd5e1', 3, 'stroke="#78716c" stroke-width="1.6"');
        s += box(62, 20, 36, 38, o.door || '#cbd5e1', 3, 'stroke="#78716c" stroke-width="1.6"');
        s += ps('M56,38 v6 M64,38 v6 M56,40 h8', o.handle || '#475569', 3);
      }
      if (o.hanging) {
        s += ps('M60,14 v-6', '#94a3b8', 3);
        s += c(60, 6, 4, '#94a3b8');
      }
      if (o.legs) {
        s += ps('M28,102 v8 M92,102 v8', '#57534e', 5);
        s += box(14, 96, 92, 8, o.body || '#a8a29e', 2, 'stroke="#57534e" stroke-width="1.4"');
      }
    } else if (o.shape === 'shelf') {
      s += box(14, 20, 10, 80, o.side || wood, 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(96, 20, 10, 80, o.side || wood, 2, 'stroke="#6b4423" stroke-width="1.6"');
      for (var sh = 0; sh < 3; sh++) {
        s += box(14, 40 + sh * 26, 92, 9, wood, 2, 'stroke="#6b4423" stroke-width="1.6"');
        for (var bk = 0; bk < 4; bk++) {
          s += box(24 + bk * 12, 22 + sh * 26, 9, 18,
            ['#dc2626', '#2563eb', '#22c55e', '#f59e0b'][bk], 1.5);
        }
      }
    } else if (o.shape === 'soft') {
      if (o.pouf) {
        /* A round soft seat. How wide it is and whether it stands on a ring is
           the whole difference between a pouf and a footstool, so both are
           parameters: a variant per word only moves the collision elsewhere. */
        var pRx = o.wide2 ? 40 : 24;
        var pRy = o.wide2 ? 24 : 20;
        var pBy = o.foot ? 60 : 78;
        s += e(60, pBy, pRx, pRy, o.body || '#f59e0b', 'stroke="#be185d" stroke-width="2"');
        s += e(60, pBy - pRy * 0.55, pRx - 4, pRy * 0.8, o.body || '#f59e0b', 'stroke="#be185d" stroke-width="1.6"');
        s += c(60, pBy - pRy * 0.55, 4, o.stitch || '#b45309');
        for (var psg = 0; psg < 4; psg++) {
          var psa = psg * Math.PI / 2;
          s += ps('M' + (60 + Math.cos(psa) * (pRx - 8)).toFixed(1) + ',' +
            (pBy - pRy * 0.55 + Math.sin(psa) * (pRy * 0.5)).toFixed(1) +
            ' l' + (Math.cos(psa) * 10).toFixed(1) + ',' + (Math.sin(psa) * 5).toFixed(1), o.stitch || '#b45309', 1.6);
        }
        if (o.foot) {
          s += e(60, pBy + pRy - 2, pRx - 6, 6, o.lighter || '#fde68a', 'stroke="#be185d" stroke-width="1.4"');
          s += e(60, 100, pRx - 4, 5, o.stitch || '#b45309', 'opacity=".5"');
        } else {
          s += e(60, 100, pRx - 8, 6, o.lighter || '#fde68a', 'opacity=".6"');
        }
      } else if (o.flat) {
        /* A flat soft thing. A pillow is a fat ellipse, a cushion has corners
           and a rug is very wide, low and fringed — proportion says which. */
        var fRx = o.wide2 ? 50 : 42;
        var fRy = o.rug ? 22 : (o.square ? 30 : 32);
        var fBy = o.rug ? 84 : 60;
        if (o.square) {
          s += box(60 - fRx, fBy - fRy, fRx * 2, fRy * 2, o.body || '#0ea9e9', 12,
            'stroke="#0369a1" stroke-width="2"');
          s += box(60 - fRx + 7, fBy - fRy + 7, fRx * 2 - 14, fRy * 2 - 14, o.lighter || '#bae6fd', 9);
          s += c(60, fBy, 3.4, o.stitch || '#0369a1');
        } else {
          s += e(60, fBy, fRx, fRy, o.body || '#fdfdff', 'stroke="#0369a1" stroke-width="2"');
          s += e(60, fBy, fRx - 8, fRy - 7, o.lighter || '#e2e8f0', 'stroke="#0369a1" stroke-width="1.4"');
          s += c(60, fBy, 3.4, o.stitch || '#0369a1');
        }
        for (var csg = 0; csg < 4; csg++) {
          var csa = csg * Math.PI / 2 + Math.PI / 4;
          s += ps('M' + (60 + Math.cos(csa) * (fRx - 6)).toFixed(1) + ',' +
            (fBy + Math.sin(csa) * (fRy - 4)).toFixed(1) +
            ' l' + (Math.cos(csa) * 9).toFixed(1) + ',' + (Math.sin(csa) * 5).toFixed(1), o.stitch || '#0369a1', 1.4);
        }
        if (o.rug) {
          for (var frg = 0; frg < 9; frg++) {
            s += ps('M' + (14 + frg * 11) + ',' + (fBy + fRy - 2) + ' v10', o.stitch || '#0369a1', 1.6);
          }
        }
      } else if (o.fold) {
        /* Folded in three, so it stands up like a stack rather than lying flat. */
        s += box(18, 56, 84, 16, o.body || '#fda4af', 4, 'stroke="#be185d" stroke-width="2"');
        s += box(22, 42, 76, 15, o.lighter || '#fecdd3', 4, 'stroke="#be185d" stroke-width="1.6"');
        s += box(26, 28, 68, 15, o.body || '#fda4af', 4, 'stroke="#be185d" stroke-width="1.6"');
        s += ps('M20,64 q40,8 80,0 M24,50 q36,7 72,0', o.stitch || '#be185d', 1.8, 'opacity=".6"');
        return s;
      }
      if (o.pouf) {
        /* A pouf is a round pouf: a disc on the floor with a button on top. */
        s += e(60, 78, 34, 22, o.body || '#f59e0b', 'stroke="#be185d" stroke-width="2"');
        s += e(60, 66, 30, 18, o.body || '#f59e0b', 'stroke="#be185d" stroke-width="1.6"');
        s += c(60, 66, 4, o.stitch || '#b45309');
        for (var psg = 0; psg < 4; psg++) {
          var psa = psg * Math.PI / 2;
          s += ps('M' + (60 + Math.cos(psa) * 18).toFixed(1) + ',' + (66 + Math.sin(psa) * 10).toFixed(1) +
            ' l' + (Math.cos(psa) * 12).toFixed(1) + ',' + (Math.sin(psa) * 7).toFixed(1), o.stitch || '#b45309', 1.6);
        }
        s += e(60, 100, 26, 6, o.lighter || '#fde68a', 'opacity=".6"');
      } else if (o.flat) {
        /* A cushion lies flat, seen from above, with a seam round the edge. */
        s += e(60, 62, 44, 32, o.body || '#0ea9e9', 'stroke="#0369a1" stroke-width="2"');
        s += e(60, 62, 36, 25, o.lighter || '#bae6fd', 'stroke="#0369a1" stroke-width="1.4"');
        s += c(60, 62, 4, o.stitch || '#0369a1');
        for (var csg = 0; csg < 4; csg++) {
          var csa = csg * Math.PI / 2 + Math.PI / 4;
          s += ps('M' + (60 + Math.cos(csa) * 26).toFixed(1) + ',' + (62 + Math.sin(csa) * 18).toFixed(1) +
            ' l' + (Math.cos(csa) * 12).toFixed(1) + ',' + (Math.sin(csa) * 8).toFixed(1), o.stitch || '#0369a1', 1.6);
        }
      } else if (o.bolster) {
        /* A bolster is a long roll: two ends, a seam along the side. */
        s += e(60, 62, 46, 18, o.body || '#fda4af', 'stroke="#be185d" stroke-width="2"');
        s += e(60, 62, 38, 11, o.lighter || '#fecdd3', 'stroke="#be185d" stroke-width="1.4"');
        s += ps('M22,54 C34,44 86,44 98,54', o.stitch || '#be185d', 1.6, 'stroke-dasharray="3 3"');
        s += ps('M24,70 q36,10 72,0', o.stitch || '#be185d', 1.6, 'stroke-dasharray="3 3"');
        s += e(24, 62, 8, 16, o.lighter || '#fecdd3', 'stroke="#be185d" stroke-width="1.4"');
        s += e(96, 62, 8, 16, o.lighter || '#fecdd3', 'stroke="#be185d" stroke-width="1.4"');
      } else {
        s += e(60, 70, 44, 22, o.body || '#fda4af', 'stroke="#be185d" stroke-width="2"');
        s += e(60, 50, 32, 20, o.body || '#fda4af', 'stroke="#be185d" stroke-width="2"');
        s += e(60, 40, 20, 14, o.lighter || '#fecdd3', 'stroke="#be185d" stroke-width="1.6"');
        if (o.stitch) s += ps('M24,70 q36,10 72,0', o.stitch, 2, 'stroke-dasharray="3 3"');
      }
    } else if (o.shape === 'fireplace') {
      s += box(16, 20, 88, 80, o.surround || '#a8a29e', 5, 'stroke="#57534e" stroke-width="2"');
      s += box(18, 24, 84, 16, o.mantel || '#78716c', 4, 'stroke="#475569" stroke-width="1.6"');
      s += p('M32,96 L32,62 C32,48 88,48 88,62 L88,96 Z', '#0f172a');
      s += p('M44,96 C44,80 60,80 60,66 C72,74 72,86 62,96 Z', o.fire || '#f97316');
      s += p('M52,96 C52,86 62,84 62,74 C70,80 70,90 62,96 Z', '#fde047');
      if (o.clock) s += c(60, 34, 11, '#fdfdff', 'stroke="#475569" stroke-width="2"');
    } else if (o.shape === 'mirror') {
      s += e(60, 48, 32, 36, o.glass || '#bae6fd', 'stroke="#94a3b8" stroke-width="4"');
      s += ps('M42,32 l-8,-10 M36,52 l-10,-4', '#ffffff', 4, 'opacity=".75"');
      s += ps('M60,84 v14 M44,98 h32', o.frame || '#94a3b8', 5);
    } else if (o.shape === 'vase') {
      s += p('M44,20 L76,20 L72,44 C86,56 88,84 72,96 C58,104 42,96 40,82 C38,62 44,50 48,44 Z',
        o.body || '#0ea5e9', 'stroke="#0369a1" stroke-width="2"');
      for (var fl = 0; fl < 5; fl++) {
        s += ps('M60,20 L' + (40 + fl * 10) + ',' + (6 - (fl % 2) * 8), o.stem || '#4a9e4a', 3);
        s += c(40 + fl * 10, 6 - (fl % 2) * 8, 7, ['#e0457f', '#fbbf24', '#8b5cf6', '#f472b6', '#f97316'][fl]);
      }
    } else if (o.shape === 'frame') {
      s += box(20, 16, 80, 80, o.frame || '#a16207', 4, 'stroke="#6b4423" stroke-width="2"');
      s += box(30, 26, 60, 60, o.inside || '#bae6fd', 2, 'stroke="#6b4423" stroke-width="1.6"');
      s += ps('M34,80 L54,52 L70,68 L86,44', o.scene || '#4a9e4a', 3);
      s += c(46, 40, 6, '#fef3c7');
    } else if (o.shape === 'column') {
      /* A bare post: the difference between a radiator, a newel and a plinth is
         how wide the thing is and what sits on top of it, not its colour. */
      s += box(48, 14, 24, 88, o.body || wood, 3, 'stroke="#6b4423" stroke-width="2"');
      s += box(42, 8, 36, 10, o.cap || '#92400e', 3, 'stroke="#6b4423" stroke-width="1.6"');
      s += box(44, 96, 32, 8, o.cap || '#92400e', 3, 'stroke="#6b4423" stroke-width="1.6"');
      for (var pn = 0; pn < 4; pn++) s += ps('M50,' + (28 + pn * 18) + ' h20', '#78350f', 2, 'opacity=".5"');
    } else if (o.shape === 'panel') {
      /* A flat board on legs. `o.screens` folds it into a room divider. */
      var pw = o.wide ? o.wide : 52;
      s += box(60 - pw / 2, 22, pw, 56, o.face || '#e2e8f0', 3, 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M44,78 v24 M76,78 v24', o.leg || '#78350f', 5);
      s += ps('M40,102 h40', o.leg || '#78350f', 4);
      if (o.screens) {
        for (var sc = 1; sc < o.screens; sc++) {
          var sx = 60 - pw / 2 + sc * (pw / o.screens);
          s += box(sx, 30, 4, 48, o.hinge || '#94a3b8', 2);
        }
      }
      if (o.slot) s += box(60 - pw / 4, 40, pw / 2, 14, o.slot, 2, 'stroke="#94a3b8" stroke-width="1.2"');
      if (o.glow) s += c(60, 50, 14, o.glow, 'opacity=".35"');
    } else if (o.shape === 'clockface') {
      s += c(60, 60, 40, o.rim || '#78350f', 'stroke="#451a03" stroke-width="3"');
      s += c(60, 60, 33, o.face || '#fdf6e8', 'stroke="#c8b89a" stroke-width="2"');
      for (var tk = 0; tk < 12; tk++) {
        var ta = (tk * Math.PI) / 6;
        s += ps('M' + (60 + Math.cos(ta) * 28).toFixed(1) + ',' + (60 + Math.sin(ta) * 28).toFixed(1) +
          ' l' + (Math.cos(ta) * 5).toFixed(1) + ',' + (Math.sin(ta) * 5).toFixed(1), '#78350f', 2);
      }
      var hAng = ((o.hand || 10) - 12) * (Math.PI / 6);
      s += ps('M60,60 L' + (60 + Math.cos(hAng) * 16).toFixed(1) + ',' + (60 + Math.sin(hAng) * 16).toFixed(1), '#1f2937', 3.4);
      s += ps('M60,60 L' + (60 + Math.cos(Math.PI / 2) * 22).toFixed(1) + ',' + (60 + Math.sin(Math.PI / 2) * 22).toFixed(1), '#dc2626', 2.4);
      s += c(60, 60, 4, '#1f2937');
    } else if (o.shape === 'stand') {
      /* A coat stand has hooks, a hat stand has a brim, a book stand has a
         sloping ledge. A pole with three hats is only one of the three. */
      s += ps('M60,18 L60,64', o.post || '#94a3b8', 4);
      s += ps('M32,64 L88,64', o.post || '#94a3b8', 4);
      if (o.brim) {
        s += e(60, 26, 24, 7, o.brim, 'stroke="#92400e" stroke-width="1.6"');
        s += p('M36,26 C36,10 84,10 84,26 Z', o.brim, 'stroke="#92400e" stroke-width="1.6"');
        s += ps('M60,20 h-12 M60,20 h12', o.brim, 2.4);
      }
      if (o.hooks) {
        for (var hk = 0; hk < 3; hk++) {
          var hx3 = 34 + hk * 26;
          s += ps('M' + hx3 + ',64 v10 q0,6 8,6', o.hooks, 3);
        }
        s += p('M42,80 C42,66 58,66 58,80 L58,102 L42,102 Z', o.items || '#be123c', 'stroke="#7f1d1d" stroke-width="1.6"');
      }
      if (o.ledge) {
        s += p('M34,52 L86,52 L80,80 L40,80 Z', o.ledge, 'stroke="#6b4423" stroke-width="1.6"');
        s += box(44, 42, 32, 12, o.items || '#b91c1c', 2, 'stroke="#7f1d1d" stroke-width="1.4"');
        s += box(40, 80, 40, 8, o.ledge, 2, 'stroke="#6b4423" stroke-width="1.4"');
      }
      if (o.items && !o.hooks && !o.ledge) {
        for (var it = 0; it < 3; it++) {
          s += p('M' + (30 + it * 22) + ',64 q6,-16 12,0 Z', o.items);
        }
      }
      s += e(60, 96, 30, 7, o.base || '#94a3b8', 'stroke="#64748b" stroke-width="1.6"');
      if (o.hang) s += ps('M52,26 h16 M60,26 v14', o.hang, 3);
    }
    return s;
  });


  /** Outdoors: a patch of garden, a piece of weather, a piece of city. */
  kind('outdoor', function (o) {
    var s = '';
    if (o.what === 'garden') {
      s += rc(0, 0, 120, 120, o.sky || '#eff6e2', 16);
      s += e(104, 20, 10, 10, '#fef3c7', 'opacity=".8"');
      if (o.bed) {
        s += p('M0,74 C26,66 48,80 74,72 L74,120 L0,120 Z', o.soil || '#8a6a3a');
        for (var fl = 0; fl < 6; fl++) {
          var fx = 10 + fl * 13, fy = 70 - (fl % 2) * 6;
          s += ps('M' + fx + ',' + fy + ' v-16', '#4a9e4a', 2.4);
          s += c(fx, fy - 20, 5, o.flower || '#e0457f');
        }
      }
      if (o.hedge) {
        /* Trimmed is a level top; a thicket is all spikes and no line. */
        if (o.trim) {
          s += p('M0,58 C22,46 44,64 66,54 C86,46 102,58 120,52 L120,96 L0,96 Z',
            o.leaf || '#4a9e4a', 'stroke="#2f6b34" stroke-width="1.6"');
          s += ps('M0,58 C22,46 44,64 66,54 C86,46 102,58 120,52', '#2f6b34', 2.4);
        } else if (o.wild) {
          s += pl('0,64 10,42 22,58 32,32 44,54 56,26 68,50 78,30 90,56 102,36 112,60 120,44 120,96 0,96',
            o.leaf || '#4a9e4a', 'stroke="#2f6b34" stroke-width="1.6"');
        } else {
          s += p('M0,60 q10,-22 22,-8 q8,-24 22,-6 q12,-22 24,2 q14,-16 26,4 q14,-12 26,8 L120,96 L0,96 Z',
            o.leaf || '#4a9e4a');
        }
        if (o.berries) {
          for (var bb = 0; bb < 5; bb++) s += c(16 + bb * 22, 62 + (bb % 2) * 10, 3.4, o.berries);
        }
      }
      if (o.glass) {
        s += p('M30,96 L30,52 L90,52 L90,96 Z', o.wall || '#f1f5f9', 'stroke="#94a3b8" stroke-width="2"');
        s += ps('M30,52 L60,26 L90,52', '#94a3b8', 3);
        s += ps('M60,26 v70 M30,74 h60', '#cbd5e1', 2);
        for (var gp = 0; gp < 3; gp++) s += c(42 + gp * 18, 84, 5, o.plant || '#22c55e');
      }
      if (o.water) {
        if (o.barrel) {
          /* A butt is a tall cylinder with hoops; a pond is wide and flat. */
          s += p('M34,50 L34,100 C34,108 86,108 86,100 L86,50 Z',
            o.water || '#7dd3fc', 'stroke="#0369a1" stroke-width="2"');
          s += e(60, 50, 26, 7, o.water || '#7dd3fc', 'stroke="#0369a1" stroke-width="2"');
          s += ps('M34,66 h52 M34,86 h52', '#0369a1', 2, 'opacity=".6"');
          s += ps('M50,50 v-6 M70,50 v-6', '#0369a1', 2.4);
        } else {
          s += p('M6,100 C6,74 34,62 60,76 C84,90 114,84 114,100 C114,114 6,114 6,100 Z',
            o.water || '#7dd3fc', 'stroke="#0369a1" stroke-width="2"');
          for (var rp = 0; rp < 3; rp++) s += ps('M' + (72 + rp * 12) + ',96 v-20', '#4a9e4a', 2.4);
          s += e(44, 84, 8, 4, '#4a9e4a');
        }
        s += c(30, 82, 5, o.plant || '#4a9e4a');
      }
      if (o.tool === 'can') {
        s += p('M34,52 L86,52 L80,96 C80,100 40,100 40,96 Z', o.metal || '#0ea5e9', 'stroke="#0369a1" stroke-width="2"');
        s += p('M34,52 C34,44 40,40 46,42 C48,46 48,50 48,52 Z', o.metal || '#0ea5e9', 'stroke="#0369a1" stroke-width="1.6"');
        s += p('M86,58 C102,58 108,68 100,76', o.metal || '#0ea5e9', 'stroke="#0369a1" stroke-width="4"');
        s += pl('96,72 106,80 98,84', o.metal || '#0ea5e9', 'stroke="#0369a1" stroke-width="1.4"');
        s += box(40, 62, 40, 5, '#0369a1', 2, 'opacity=".4"');
      } else if (o.tool === 'hose') {
        for (var hs = 0; hs < 3; hs++) {
          s += c(60, 72, 30 - hs * 8, 'none', 'stroke="' + (o.hose || '#16a34a') + '" stroke-width="6"');
        }
        s += ps('M88,54 C104,50 108,66 96,68', o.hose || '#16a34a', 5);
        s += rc(84, 66, 10, 12, '#94a3b8', 2, 'stroke="#64748b" stroke-width="1.4"');
      } else if (o.tool === 'spade') {
        s += '<g transform="rotate(-18 60 66)">';
        s += rc(56, 34, 9, 42, o.wood || '#a16207', 4, 'stroke="#6b4423" stroke-width="1.6"');
        s += ps('M44,34 h32', o.wood || '#a16207', 7);
        s += p('M50,78 L70,78 L66,102 L54,102 Z', o.steel || '#94a3b8', 'stroke="#64748b" stroke-width="1.6"');
        s += '</g>';
      } else if (o.tool === 'barrow') {
        s += p('M24,58 L80,58 L70,88 L34,88 Z', o.tray || '#b45309', 'stroke="#7c2a12" stroke-width="2"');
        s += p('M24,58 C24,44 40,40 52,46 L60,58 Z', o.tray || '#b45309', 'stroke="#7c2a12" stroke-width="1.6"');
        s += ps('M80,62 L102,44 M96,44 h8 v8', '#64748b', 4);
        s += c(40, 92, 12, '#334155', 'stroke="#1f2937" stroke-width="1.6"');
        s += ps('M40,88 v-4 M40,96 v4', '#94a3b8', 1.6);
      } else if (o.tool === 'mower') {
        s += box(30, 62, 58, 26, o.body || '#16a34a', 4, 'stroke="#14532d" stroke-width="2"');
        s += ps('M88,66 C104,58 108,42 100,34', '#64748b', 4);
        s += ps('M100,34 l-8,4 M100,34 l4,8', '#334155', 2.6);
        s += c(44, 90, 9, '#1f2937') + c(76, 90, 9, '#1f2937');
        s += box(38, 68, 20, 6, '#bbf7d0', 2);
      } else if (o.tools) {
        s += '<g transform="rotate(-24 60 70)">';
        s += rc(56, 44, 10, 46, '#a16207', 4, 'stroke="#6b4423" stroke-width="1.6"');
        s += box(48, 36, 26, 12, '#94a3b8', 3, 'stroke="#64748b" stroke-width="1.6"');
        s += '</g>';
      }
      if (o.hive) {
        if (o.hive === 'feeder') {
          s += rc(46, 44, 28, 40, o.body || '#0ea5e9', 4, 'stroke="#0369a1" stroke-width="2"');
          s += p('M40,44 C40,30 80,30 80,44 Z', o.lid || '#0284c7', 'stroke="#0369a1" stroke-width="1.6"');
          s += ps('M60,84 v16', '#64748b', 3);
          s += e(60, 102, 24, 5, '#94a3b8');
        } else {
          for (var hv = 0; hv < 3; hv++) s += box(36, 60 + hv * 14, 48, 12, o.body || '#eab308', 2, 'stroke="#a16207" stroke-width="1.4"');
          s += box(30, 96, 60, 8, '#a16207', 2);
        }
      }
      if (o.wall) {
        var rowsW = o.brickRows || 4, colsW = o.brickCols || 5;
        s += box(2, 54 + 2, 116, rowsW * 14, o.mortar || '#d6c9a8', 2);
        for (var br = 0; br < rowsW; br++) {
          for (var bc = 0; bc < colsW; bc++) {
            s += box(6 + bc * 23 + (br % 2) * 11, 58 + br * 14, 20, 11, o.wall || '#b45309', 1.5, 'opacity=".9"');
          }
        }
      }
      if (o.slats) {
        /* A slatted bin: air gaps are the whole point of a compost heap. */
        for (var sl = 0; sl < 5; sl++) s += box(30, 52 + sl * 14, 60, 10, o.slats, 2, 'stroke="#451a03" stroke-width="1.2"');
        s += p('M28,54 C40,38 80,38 92,54 Z', o.lid || '#65a30d', 'stroke="#3f6212" stroke-width="1.6"');
        for (var sm = 0; sm < 4; sm++) s += ps('M36,66 q24,-6 48,0 M36,82 q24,-6 48,0', '#451a03', 1.6, 'opacity=".5"');
      }
      s += shadow(104, 40, 0.05);
    } else if (o.what === 'weather') {
      s += rc(0, 0, 120, 120, o.sky || '#dbeafe', 16);
      if (o.sun) {
        s += c(78, 40, 20, '#fbbf24');
        for (var sr = 0; sr < 8; sr++) {
          var sa = (sr * Math.PI) / 4;
          s += ps('M' + (78 + Math.cos(sa) * 26).toFixed(1) + ',' + (40 + Math.sin(sa) * 26).toFixed(1) +
            ' l' + (Math.cos(sa) * 8).toFixed(1) + ',' + (Math.sin(sa) * 8).toFixed(1), '#f59e0b', 3);
        }
      }
      if (o.cloud) {
        s += c(46, 48, 18, o.cloudColour || '#f1f5f9') + c(64, 42, 22, o.cloudColour || '#f1f5f9') +
          c(82, 50, 16, o.cloudColour || '#f1f5f9') + box(40, 50, 56, 18, o.cloudColour || '#f1f5f9', 8);
      }
      if (o.rain) {
        for (var rn = 0; rn < 7; rn++) {
          s += ps('M' + (16 + rn * 14) + ',64 l-4,18', '#38bdf8', 3);
        }
      }
      if (o.snow) {
        for (var sn = 0; sn < 9; sn++) {
          s += c(14 + (sn * 27) % 94, 62 + (sn * 19) % 34, 3, '#f1f5f9');
        }
      }
      if (o.bolt) {
        s += pl('64,60 50,86 62,86 57,102 74,72 70,86', '#fbbf24',
          'stroke="#b45309" stroke-width="1.6" stroke-linejoin="round"');
      }
      if (o.wind) {
        /* Wind is told apart by what it does: a flag snaps, trees lean, a
           hurricane turns, a tornado funnels. Three identical gust lines for
           all of them says none of it. */
        if (o.wind === 'flag') {
          s += rc(26, 14, 6, 76, '#78716c', 3);
          s += p('M32,18 C58,22 50,42 74,46 C56,50 58,70 32,72 Z', o.flag || '#dc2626', 'stroke="#991b1b" stroke-width="1.6"');
          s += ps('M0,110 h120', o.ground || '#86efac', 8);
        } else if (o.wind === 'trees') {
          s += ps('M0,104 h120', o.ground || '#4a9e4a', 8);
          for (var wt = 0; wt < 3; wt++) {
            var wx2 = 26 + wt * 34;
            s += ps('M' + wx2 + ',104 L' + (wx2 + 10) + ',64', '#78350f', 5);
            s += p('M' + (wx2 + 10) + ',66 q-16,-6 -14,-18 q10,2 14,10 q4,-12 16,-14 q2,14 -8,22 Z',
              o.leaf || '#4a9e4a', 'stroke="#2f6b34" stroke-width="1.2"');
          }
          for (var wl = 0; wl < 3; wl++) s += p('M' + (20 + wl * 34) + ',30 l7,-4 l-6,8 Z', '#ca8a04');
        } else if (o.wind === 'spiral') {
          var sd2 = '';
          for (var sa2 = 0; sa2 < Math.PI * 4.5; sa2 += 0.24) {
            var sr2 = 4 + sa2 * 4.4;
            sd2 += (sd2 ? 'L' : 'M') + (60 + Math.cos(sa2) * sr2).toFixed(1) + ',' + (64 + Math.sin(sa2) * sr2 * 0.7).toFixed(1);
          }
          s += p('M' + sd2, 'none', 'stroke="' + (o.spin || '#cbd5e1') + '" stroke-width="7"');
          s += p('M60,64 m-46,4 a46,30 0 0 0 92,0', 'none', 'stroke="' + (o.spin || '#cbd5e1') + '" stroke-width="3"');
        } else if (o.wind === 'funnel') {
          s += ps('M0,110 h120', o.ground || '#4a9e4a', 8);
          s += p('M30,20 C42,48 40,70 22,106 L98,106 C82,70 80,48 92,20 Z', o.spin || '#94a3b8',
            'stroke="#64748b" stroke-width="1.6"');
          for (var fn = 0; fn < 3; fn++) {
            s += e(60, 34 + fn * 26, 30 - fn * 8, 7, '#cbd5e1', 'opacity=".5"');
          }
          for (var fd = 0; fd < 4; fd++) s += ps('M' + (20 + fd * 26) + ',112 q6,-8 12,0', '#a8a29e', 2.4);
        } else if (o.wind === 'gust') {
          for (var wn = 0; wn < 3; wn++) {
            s += ps('M14,' + (40 + wn * 16) + ' h' + (50 + wn * 12) + ' q12,0 12,-8 M14,' + (40 + wn * 16) +
              ' h' + (64 + wn * 12) + ' q14,0 14,8', '#94a3b8', 3);
          }
          s += p('M92,34 l7,-4 l-6,9 Z', '#94a3b8');
        } else {
          for (var wn2 = 0; wn2 < 3; wn2++) {
            s += ps('M14,' + (40 + wn2 * 16) + ' h64 q12,0 12,-8 M14,' + (40 + wn2 * 16) + ' h78 q14,0 14,8',
              '#94a3b8', 3);
          }
        }
      }
      if (o.fog) {
        /* Four different things hide you: a bank rolls in, mist lies low, haze
           is a sun seen through dust, and smog is a city seen through it. */
        if (o.fog === 'bank') {
          for (var fg = 0; fg < 4; fg++) {
            s += e(30 + (fg % 2) * 44, 60 + fg * 15, 58 - fg * 6, 12 - fg * 1.5, '#f8fafc', 'opacity=".9"');
          }
          s += ps('M12,36 h44 M70,30 h38', '#cbd5e1', 2.4, 'opacity=".7"');
        } else if (o.fog === 'mist') {
          s += p('M0,100 C22,92 44,102 66,96 C88,90 104,100 120,94 L120,120 L0,120 Z', o.ground || '#86efac');
          for (var mw = 0; mw < 3; mw++) {
            s += e(34 + mw * 26, 84 - mw * 5, 30, 7, '#f8fafc', 'opacity=".85"');
          }
        } else if (o.fog === 'sun') {
          s += c(60, 52, 20, '#fcd34d', 'opacity=".55"');
          for (var hv2 = 0; hv2 < 4; hv2++) {
            s += e(28 + hv2 * 22, 66 + (hv2 % 2) * 8, 24, 8, '#fef3c7', 'opacity=".8"');
          }
        } else if (o.fog === 'city') {
          for (var sb = 0; sb < 5; sb++) {
            s += box(8 + sb * 23, 100 - (34 + (sb * 29) % 40), 19, 34 + (sb * 29) % 40, '#78716c', 2, 'opacity=".6"');
          }
          s += box(0, 100, 120, 20, '#57534e', 0);
          for (var sg2 = 0; sg2 < 3; sg2++) s += e(30 + sg2 * 32, 88, 28, 8, '#a8a29e', 'opacity=".7"');
        } else {
          s += rc(0, 0, 120, 120, '#e2e8f0', 16);
          for (var fg = 0; fg < 4; fg++) s += box(8, 44 + fg * 16, 104, 9, '#f1f5f9', 4, 'opacity=".9"');
        }
      }
      if (o.arc) {
        var cols = ['#dc2626', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6'];
        for (var ar = 0; ar < cols.length; ar++) {
          var aa = Math.PI - (ar + 0.5) * (Math.PI / cols.length);
          s += ps('M' + (60 + Math.cos(aa) * 46).toFixed(1) + ',' + (76 + Math.sin(aa) * 46).toFixed(1) +
            ' a46,46 0 0 1 ' + (-Math.cos(aa) * 92).toFixed(1) + ',' + (-Math.sin(aa) * 92).toFixed(1), cols[ar], 5);
        }
      }
      if (o.cold) {
        s += c(60, 60, 26, '#bae6fd', 'stroke="#0369a1" stroke-width="2"');
        for (var cd = 0; cd < 6; cd++) {
          var ca = (cd * Math.PI) / 3;
          s += ps('M' + (60 + Math.cos(ca) * 14).toFixed(1) + ',' + (60 + Math.sin(ca) * 14).toFixed(1) +
            ' l' + (Math.cos(ca) * 24).toFixed(1) + ',' + (Math.sin(ca) * 24).toFixed(1), '#0369a1', 3);
        }
      }
      if (o.night) {
        s += c(84, 36, 18, '#f1f5f9');
        s += c(90, 32, 16, o.sky || '#1e1b4b');
        for (var st2 = 0; st2 < 6; st2++) s += c(12 + (st2 * 37) % 96, 14 + (st2 * 23) % 30, 1.8, '#fde68a');
      }
      if (o.ground) s += p('M0,100 C26,92 48,104 74,98 L120,104 L120,120 L0,120 Z', o.ground);
    } else if (o.what === 'city') {
      s += rc(0, 0, 120, 120, o.sky || '#e0f2fe', 16);

      /* Buildings come in four named silhouettes. A skyline and a terrace of
         pitched roofs are not the same drawing in a different colour: one is a
         row of towers of uneven height, the other is a row of houses. */
      var skyline = o.skyline === undefined ? 'towers' : o.skyline;
      if (skyline === 'towers') {
        for (var bt = 0; bt < 5; bt++) {
          var bx = 6 + bt * 23, bh = 30 + (bt * 37) % 60;
          s += box(bx, 100 - bh, 20, bh, o.block || '#94a3b8', 2, 'stroke="#64748b" stroke-width="1.4"');
          for (var wy = 0; wy < Math.floor(bh / 12); wy++) {
            for (var wx = 0; wx < 2; wx++) {
              s += box(bx + 4 + wx * 8, 100 - bh + 6 + wy * 12, 5, 6, '#fde68a', 1);
            }
          }
        }
      } else if (skyline === 'one') {
        s += box(18, 26, 84, 76, o.block || '#94a3b8', 3, 'stroke="#64748b" stroke-width="2"');
        for (var oy = 0; oy < 5; oy++) {
          for (var ox = 0; ox < 4; ox++) {
            s += box(26 + ox * 20, 34 + oy * 13, 13, 9, '#fde68a', 1.5);
          }
        }
        s += box(52, 82, 16, 20, '#78350f', 2, 'stroke="#451a03" stroke-width="1.6"');
      } else if (skyline === 'slab') {
        s += box(10, 34, 100, 68, o.block || '#c0846a', 3, 'stroke="#64748b" stroke-width="2"');
        for (var by = 0; by < 4; by++) s += box(14, 40 + by * 15, 92, 5, '#e2e8f0', 1.5, 'opacity=".8"');
        for (var bx2 = 0; bx2 < 5; bx2++) s += box(16 + bx2 * 19, 44 + ((bx2 % 2) ? 15 : 0), 12, 9, '#fde68a', 1.5);
      } else if (skyline === 'houses') {
        for (var hb = 0; hb < 4; hb++) {
          var hx = 8 + hb * 29, hh = 30 + (hb % 2) * 8;
          s += box(hx, 100 - hh, 24, hh, o.block || '#d6c9a8', 2, 'stroke="#78716c" stroke-width="1.4"');
          s += p('M' + (hx - 3) + ',' + (100 - hh) + ' L' + (hx + 12) + ',' + (100 - hh - 16) +
            ' L' + (hx + 27) + ',' + (100 - hh) + ' Z', o.roof || '#b91c1c', 'stroke="#7f1d1d" stroke-width="1.4"');
          s += box(hx + 8, 100 - 20, 8, 10, '#78350f', 1.5);
        }
      } else {
        /* Nothing behind: the road is the subject, so leave it room. */
        s += p('M0,86 C22,78 44,92 66,86 C88,80 104,88 120,84 L120,120 L0,120 Z', o.ground || '#86efac');
      }

      if (o.road !== false) {
        s += box(0, 100, 120, 20, o.road || '#334155', 0);
        s += ps('M0,110 h120', o.laneMark || '#fbbf24', 3, 'stroke-dasharray="8 8"');
      }
      if (o.zebra) {
        s += box(0, 96, 120, 24, o.road || '#334155', 0);
        for (var cr = 0; cr < 6; cr++) s += box(6 + cr * 20, 100, 14, 16, '#f8fafc', 1.5);
      }
      if (o.crossroads) {
        s += box(0, 92, 120, 28, o.road || '#334155', 0);
        s += box(40, 58, 40, 62, o.road || '#334155', 0);
        s += ps('M0,106 h120 M60,60 v60', '#fbbf24', 3, 'stroke-dasharray="8 8"');
        s += ps('M42,94 h-24 M78,94 h24 M42,102 h-24 M78,102 h24 M50,74 v-14 M50,102 v14 M70,74 v-14 M70,102 v14',
          '#f8fafc', 3, 'stroke-dasharray="4 3"');
      }
      if (o.tjunction) {
        s += box(0, 92, 120, 28, o.road || '#334155', 0);
        s += box(40, 42, 40, 78, o.road || '#334155', 0);
        s += ps('M0,106 h38 M62,46 v74 M82,106 h38', '#fbbf24', 3, 'stroke-dasharray="8 8"');
        s += ps('M42,100 h-22 M78,100 h22 M50,84 v-18 M50,108 v12 M70,84 v-18 M70,108 v12',
          '#f8fafc', 3, 'stroke-dasharray="4 3"');
      }
      if (o.kerbEdge) {
        s += box(0, 96, 120, 24, o.paving || '#cbd5e1', 0);
        s += box(0, 92, 120, 5, o.kerb || '#94a3b8', 1);
        for (var pv = 0; pv < 6; pv++) s += ps('M' + (4 + pv * 20) + ',98 v20', '#94a3b8', 1.4, 'opacity=".7"');
        s += ps('M0,102 h120', '#94a3b8', 1.6, 'opacity=".7"');
      }
      if (o.cycle) {
        s += box(0, 100, 120, 20, o.road || '#334155', 0);
        s += box(20, 104, 80, 12, o.bike || '#16a34a', 2, 'opacity=".85"');
        s += ps('M20,110 h80', '#f8fafc', 2, 'stroke-dasharray="6 5"');
      }
      if (o.plaza) {
        s += e(60, 96, 52, 20, o.paving || '#cbd5e1', 'stroke="#94a3b8" stroke-width="1.6"');
        for (var pg = 0; pg < 3; pg++) s += ps('M' + (14 + pg * 46) + ',86 v-10', '#64748b', 2.4);
      }
      if (o.light) {
        s += rc(56, 44, 8, 56, '#334155', 3);
        s += box(48, 30, 24, 20, '#1f2937', 4);
        s += c(60, 36, 4, '#dc2626');
        s += c(60, 44, 4, '#fbbf24');
        s += c(60, 52, 4, '#22c55e');
      }
      if (o.fountain) {
        s += e(60, 92, 36, 12, o.stone || '#cbd5e1', 'stroke="#94a3b8" stroke-width="2"');
        s += rc(56, 62, 8, 30, o.stone || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="1.6"');
        s += e(60, 60, 22, 7, '#7dd3fc', 'stroke="#0369a1" stroke-width="1.4"');
      }
      if (o.statue) {
        s += box(46, 76, 28, 24, o.stone || '#a8a29e', 3, 'stroke="#78716c" stroke-width="2"');
        s += p('M52,76 L52,56 C52,44 68,44 68,56 L68,76 Z', o.stone || '#a8a29e', 'stroke="#78716c" stroke-width="2"');
        s += c(60, 36, 9, o.stone || '#a8a29e', 'stroke="#78716c" stroke-width="2"');
        s += ps('M68,58 l14,-10', o.stone || '#a8a29e', 5);
      }
      if (o.post) {
        s += rc(54, 46, 12, 54, o.post || '#0f766e', 3, 'stroke="#134e4a" stroke-width="1.6"');
        s += box(48, 40, 24, 10, o.post || '#0f766e', 3, 'stroke="#134e4a" stroke-width="1.6"');
        s += box(52, 54, 16, 22, o.slot || '#1f2937', 2);
        if (o.sign) s += box(50, 34, 20, 8, o.sign, 1.5, 'stroke="#134e4a" stroke-width="1.2"');
      }
      if (o.car) {
        s += p('M20,96 L20,84 C20,78 26,76 34,76 L48,64 C52,60 66,60 72,66 L86,78 L96,80 C102,82 102,96 96,96 Z',
          o.car || '#dc2626', 'stroke="#991b1b" stroke-width="2"');
        s += c(36, 96, 8, '#1f2937') + c(84, 96, 8, '#1f2937');
        s += ps('M52,76 L66,76', '#bae6fd', 3);
      }
      if (o.kiosk) {
        s += box(28, 56, 64, 44, o.kiosk || '#f59e0b', 4, 'stroke="#b45309" stroke-width="2"');
        s += p('M20,58 L60,32 L100,58 Z', '#dc2626', 'stroke="#b91c1c" stroke-width="2"');
        s += box(40, 68, 40, 18, '#e2e8f0', 2, 'stroke="#b45309" stroke-width="1.4"');
      }
      if (o.crane) {
        s += rc(30, 40, 8, 60, '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.6"');
        s += box(20, 36, 80, 8, '#fbbf24', 2, 'stroke="#b45309" stroke-width="1.6"');
        s += ps('M92,44 v22 M92,66 h8 v10', '#64748b', 2.4);
      }
    }
    return s;
  });

  /** Going somewhere: what you carry, what you show, where you sleep. */
  kind('journey', function (o) {
    var s = shadow(100, o.wide || 32, 0.08);
    if (o.shape === 'bag') {
      s += box(20, 42, 80, 56, o.body || '#2563eb', 8, 'stroke="#1e3a8a" stroke-width="2"');
      s += box(20, 58, 80, 12, o.trim || '#1d4ed8', 4, 'stroke="#1e3a8a" stroke-width="1.6"');
      s += ps('M42,42 v-8 a18,18 0 0 1 36,0 v8', '#1e3a8a', 5);
      s += box(52, 54, 16, 20, o.clasp || '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.6"');
      if (o.strap) s += ps('M34,50 C34,24 86,24 86,50', o.strap, 4);
      if (o.wheels) {
        s += c(32, 100, 7, '#1f2937') + c(88, 100, 7, '#1f2937');
        s += ps('M28,98 h12 M84,98 h12', '#94a3b8', 4);
      }
    } else if (o.shape === 'document') {
      s += box(24, 18, 72, 84, o.paper || '#fdf6e8', 4, 'stroke="#c8b89a" stroke-width="2"');
      s += c(60, 40, 16, o.stamp || '#dc2626', 'stroke="#b91c1c" stroke-width="1.6"');
      s += pl('60,28 63,37 73,37 65,43 68,52 60,46 52,52 55,43 47,37 57,37', '#fdfdff');
      s += ps('M38,64 h44 M38,74 h30 M38,84 h38', '#94a3b8', 2.2);
      if (o.photo) s += box(38, 58, 18, 16, o.photo, 2, 'stroke="#94a3b8" stroke-width="1.2"');
      if (o.chip) s += box(72, 76, 16, 12, '#fbbf24', 2, 'stroke="#b45309" stroke-width="1.4"');
    } else if (o.shape === 'ticket') {
      s += box(14, 40, 92, 44, o.paper || '#fdfdff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      s += ps('M78,40 v44', '#cbd5e1', 2, 'stroke-dasharray="3 3"');
      var stub = o.route || 3;
      for (var st2 = 0; st2 < stub; st2++) {
        s += ps('M26,' + (50 + st2 * 9) + ' h' + (30 + (st2 % 2) * 12), '#94a3b8', 2.4);
      }
      s += c(92, 62, 9, o.stamp || '#0ea5e9', 'opacity=".8"');
      s += pl('86,60 96,68 86,76', 'none',
        'stroke="' + (o.stamp || '#0ea5e9') + '" stroke-width="2"');
    } else if (o.shape === 'map') {
      s += p('M10,26 L40,34 L80,22 L110,32 L110,94 L80,84 L40,96 L10,86 Z', o.paper || '#fef3c7', 'stroke="#c8b89a" stroke-width="2"');
      s += ps('M40,34 v62 M80,22 v62', '#c8b89a', 1.6);
      s += ps('M18,52 q12,-10 22,2 q10,12 2,22', '#7dd3fc', 3);
      s += ps('M56,68 q14,-12 24,4 q8,16 -4,24', '#86efac', 3);
      s += ps('M86,44 q8,-6 14,2', '#a16207', 2.4);
      if (o.fold) s += ps('M55,30 v64 M95,28 v58', '#c8b89a', 1.2, 'stroke-dasharray="3 3"');
      if (o.pin) {
        s += ps('M96,20 v14', '#94a3b8', 2.4);
        s += c(96, 38, 8, '#dc2626', 'stroke="#b91c1c" stroke-width="1.6"');
      }
    } else if (o.shape === 'building') {
      s += box(16, 24, 88, 76, o.wall || '#e2e8f0', 5, 'stroke="#94a3b8" stroke-width="2"');
      s += box(10, 18, 100, 12, o.roof || '#0f172a', 3, 'stroke="#020617" stroke-width="1.6"');
      for (var wn2 = 0; wn2 < 3; wn2++) {
        for (var wd = 0; wd < 3; wd++) {
          s += box(26 + wd * 26, 34 + wn2 * 20, 18, 14, o.glass || '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
        }
      }
      s += box(48, 80, 24, 20, o.door || '#78350f', 2, 'stroke="#451a03" stroke-width="1.6"');
      s += ps('M14,30 h92', o.trim || '#94a3b8', 2);
    } else if (o.shape === 'tent') {
      s += p('M60,20 L108,96 L12,96 Z', o.body || '#16a34a', 'stroke="#15803d" stroke-width="2"');
      s += p('M60,20 L60,96 L88,96 Z', o.dark || '#15803d', 'opacity=".55"');
      s += ps('M60,24 L60,94', '#0f172a', 2, 'opacity=".4"');
      s += ps('M60,20 L60,6', '#94a3b8', 2.4);
      s += ps('M0,98 h120', '#4a7a3a', 4);
    } else if (o.shape === 'souvenir') {
      if (o.plate) {
        /* A plate on a stand: the roundest souvenir there is. */
        s += c(60, 62, 32, o.body || '#0ea5e9', 'stroke="#0369a1" stroke-width="2"');
        s += c(60, 62, 20, '#f8fafc', 'stroke="#0369a1" stroke-width="1.4"');
        s += ps('M60,94 v10 M44,104 h32', o.trim || '#0284c7', 4);
        s += c(60, 62, 6, o.mark || '#fbbf24');
        return s;
      }
      if (o.card) {
        /* A postcard propped on a stand. */
        s += box(22, 30, 76, 62, o.body || '#fbcfe8', 4, 'stroke="#be185d" stroke-width="2"');
        s += box(30, 38, 60, 34, '#bae6fd', 2, 'stroke="#0369a1" stroke-width="1.4"');
        s += p('M34,66 L48,50 L60,62 L74,44 L86,58', '#4a9e4a', 'stroke="none"');
        s += c(46, 46, 5, '#fef3c7');
        s += ps('M60,92 v10 M44,102 h32', o.trim || '#be185d', 4);
        return s;
      }
      s += box(24, 46, 72, 54, o.body || '#0ea5e9', 6, 'stroke="#0369a1" stroke-width="2"');
      s += box(24, 46, 72, 16, o.trim || '#0284c7', 4, 'stroke="#0369a1" stroke-width="1.6"');
      s += c(60, 74, 16, o.mark || '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += pl('60,62 65,73 77,74 67,81 70,93 60,86 50,93 53,81 43,74 55,73', '#b45309');
    } else if (o.shape === 'guide') {
      s += c(60, 38, 18, SKIN, 'stroke="' + SKIN_D + '" stroke-width="2"');
      s += c(78, 34, 5, SKIN, 'stroke="' + SKIN_D + '" stroke-width="1.6"');
      s += p('M42,34 C42,18 78,18 78,34 C72,28 48,28 42,34 Z', '#4a3728');
      s += p('M34,100 C34,72 86,72 86,100 Z', o.shirt || '#0f766e', 'stroke="#134e4a" stroke-width="2"');
      s += box(10, 58, 26, 34, o.book || '#b91c1c', 3, 'stroke="#7f1d1d" stroke-width="1.6"');
      s += ps('M14,68 h18 M14,76 h18', '#fecaca', 2);
    } else if (o.shape === 'boat') {
      if (o.sleigh) {
        s += p('M20,84 C28,62 92,62 100,84 Z', o.body || '#b91c1c', 'stroke="#7f1d1d" stroke-width="2"');
        s += box(38, 54, 44, 12, '#7f1d1d', 3, 'stroke="#7f1d1d" stroke-width="1.4"');
        s += ps('M22,88 q38,12 76,0', '#cbd5e1', 4);
        s += ps('M60,54 v-14 M60,40 l-10,6 M60,40 l10,6', '#7f1d1d', 3);
        s += c(60, 24, 4, '#fbbf24');
      } else {
        s += p('M16,76 L104,76 L92,98 L28,98 Z', o.body || '#0ea5e9', 'stroke="#0369a1" stroke-width="2"');
        s += rc(56, 12, 8, 66, o.mast || '#78350f', 3);
        s += p('M64,18 L94,68 L64,68 Z', o.sail || '#fdfdff', 'stroke="#0369a1" stroke-width="1.6"');
        s += p('M56,26 L34,68 L56,68 Z', o.jib || '#e0f2fe', 'stroke="#0369a1" stroke-width="1.4"');
        s += ps('M6,102 q10,-6 20,0 q10,6 20,0', '#7dd3fc', 3);
      }
    } else if (o.shape === 'compass') {
      /* A magnetic compass. Not the divider — that is `school`/`compass`, and
         the two are different instruments. The needle is the whole word: a case
         and a dial with nothing between them is a pocket watch. */
      s += c(60, 58, 36, o.shell || '#334155', 'stroke="#0f172a" stroke-width="2"');
      s += c(60, 58, 29, o.face || '#fdfdff', 'stroke="#94a3b8" stroke-width="1.6"');
      s += ps('M60,30 v6 M60,80 v6 M32,58 h6 M82,58 h6', '#94a3b8', 1.6);
      s += pl('60,32 67,64 60,58 53,64', o.needle || '#dc2626');
      s += pl('60,84 67,52 60,58 53,52', '#334155');
      s += c(60, 58, 4, '#0f172a');
      s += ps('M60,46 v-6', '#334155', 1.4);
    } else if (o.shape === 'board') {
      s += box(12, 26, 96, 52, o.surface || '#0f172a', 4, 'stroke="#1f2937" stroke-width="2"');
      if (o.glyph === 'departure') {
        s += ps('M24,52 h44 M24,52 l10,-8 M24,52 l10,8', '#4ade80', 4);
        s += c(86, 52, 10, '#4ade80');
      } else if (o.glyph === 'arrival') {
        s += ps('M24,52 h44 M68,52 l-10,-8 M68,52 l-10,8', '#4ade80', 4);
        s += c(86, 52, 10, '#4ade80');
      } else {
        for (var rw = 0; rw < (o.rows || 3); rw++) {
          s += ps('M28,' + (44 + rw * 12) + ' h' + (58 - rw * 6) + ' M' + (86) + ',' + (44 + rw * 12) + ' h6',
            '#64748b', 3);
        }
      }
      if (o.head) s += box(12, 16, 96, 8, o.head, 2);
      s += box(48, 82, 24, 8, o.stand || '#334155', 3);
    }
    return s;
  });

  /** Money: what it is made of and where it comes from. */
  kind('money', function (o) {
    var s = shadow(100, o.wide || 30, 0.08);
    if (o.shape === 'coin') {
      s += c(60, 68, 30, o.face || '#fbbf24', 'stroke="#b45309" stroke-width="3"');
      s += c(60, 68, 23, o.rim || '#fde68a', 'stroke="#b45309" stroke-width="2"');
      s += ps('M60,54 v28 M50,60 h20 M50,76 h20', o.ink || '#92400e', 3);
      s += e(60, 96, 22, 7, o.face || '#f59e0b', 'stroke="#b45309" stroke-width="2"');
    } else if (o.shape === 'note') {
      s += box(12, 34, 96, 46, o.paper || '#bbf7d0', 4, 'stroke="#065f46" stroke-width="2"');
      s += c(32, 57, 12, o.ink || '#065f46', 'opacity=".25"');
      s += c(88, 57, 12, o.ink || '#065f46', 'opacity=".25"');
      s += c(60, 57, 14, o.ink || '#065f46', 'opacity=".3"');
      s += box(46, 46, 28, 22, o.ink || '#065f46', 2, 'opacity=".3"');
      s += ps('M20,80 h80', o.ink || '#065f46', 2, 'opacity=".5"');
      if (o.serial) {
        /* A serial number is how you tell a note from its twin. */
        for (var sd = 0; sd < 6; sd++) {
          s += ps('M' + (26 + sd * 5) + ',46 v-6', o.ink || '#065f46', 1.4, 'opacity=".8"');
        }
      }
      if (o.value) {
        s += c(20, 57, 9, o.ink || '#065f46', 'opacity=".35"');
        s += c(100, 57, 9, o.ink || '#065f46', 'opacity=".35"');
      }
    } else if (o.shape === 'card') {
      s += '<g transform="rotate(-8 60 60)">';
      s += box(14, 36, 92, 48, o.body || '#1e3a8a', 6, 'stroke="#0f172a" stroke-width="2"');
      s += box(14, 46, 92, 12, '#fbbf24', 2);
      s += box(26, 66, 22, 15, '#e2e8f0', 2, 'opacity=".8"');
      s += ps('M56,66 h34 M56,74 h22', '#e2e8f0', 2.4, 'opacity=".7"');
      s += c(84, 44, 8, '#f87171', 'opacity=".8"');
      s += '</g>';
    } else if (o.shape === 'till') {
      s += box(24, 40, 72, 58, o.body || '#cbd5e1', 5, 'stroke="#64748b" stroke-width="2"');
      s += box(32, 48, 56, 20, '#1f2937', 3);
      s += box(38, 52, 24, 12, '#4ade80', 2);
      s += box(70, 52, 12, 12, '#334155', 2);
      s += box(32, 76, 56, 14, '#94a3b8', 3, 'stroke="#64748b" stroke-width="1.4"');
      s += c(50, 83, 5, '#b45309') + c(70, 83, 5, '#b45309');
    } else if (o.shape === 'wallet') {
      s += box(18, 42, 84, 54, o.body || '#78350f', 7, 'stroke="#451a03" stroke-width="2"');
      s += box(18, 58, 84, 12, '#451a03', 2);
      s += box(52, 54, 16, 20, o.clasp || '#fbbf24', 3, 'stroke="#b45309" stroke-width="1.6"');
      s += box(24, 44, 34, 12, o.card || '#f1f5f9', 2, 'stroke="#cbd5e1" stroke-width="1.2"');
      s += box(24, 80, 30, 10, o.card || '#f1f5f9', 2, 'stroke="#cbd5e1" stroke-width="1.2"');
    } else if (o.shape === 'bank') {
      s += box(20, 30, 80, 26, o.roof || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
      for (var cl = 0; cl < 4; cl++) s += rc(28 + cl * 18, 56, 10, 26, o.column || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="1.4"');
      s += box(20, 82, 80, 18, o.base || '#e2e8f0', 3, 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M60,36 l-10,10 M60,36 l10,10 M54,40 h12', o.ink || '#dc2626', 2.4);
    } else if (o.shape === 'piggy') {
      s += e(60, 64, 34, 26, o.body || '#f472b6', 'stroke="#be185d" stroke-width="2"');
      s += c(38, 56, 12, o.body || '#f472b6', 'stroke="#be185d" stroke-width="1.6"');
      s += c(34, 52, 5, '#be185d', 'stroke="#be185d" stroke-width="1.6"');
      s += c(80, 58, 5, NIGHT);
      s += c(88, 68, 6, o.body || '#f472b6', 'stroke="#be185d" stroke-width="1.6"');
      if (o.lid) {
        s += box(46, 36, 28, 7, o.lid, 3, 'stroke="#be185d" stroke-width="1.4"');
      } else {
        s += box(48, 42, 24, 8, '#be185d', 3);
        s += ps('M52,42 v-6 M68,42 v-6', '#be185d', 3);
      }
      if (o.coin) {
        s += c(60, 22, 10, '#fbbf24', 'stroke="#b45309" stroke-width="1.6"');
        s += ps('M56,30 q4,6 8,0', '#b45309', 1.6);
      }
      s += e(60, 90, 6, 4, '#be185d');
    } else if (o.shape === 'vending') {
      s += box(26, 12, 68, 88, o.body || '#334155', 5, 'stroke="#1f2937" stroke-width="2"');
      s += box(34, 20, 40, 46, '#0f172a', 2, 'stroke="#64748b" stroke-width="1.4"');
      for (var pr = 0; pr < 3; pr++) {
        for (var pc = 0; pc < 3; pc++) {
          s += box(37 + pc * 12, 24 + pr * 14, 9, 11, ['#ef4444', '#22c55e', '#3b82f6'][(pr + pc) % 3], 1.5);
        }
      }
      s += box(78, 20, 12, 20, '#1f2937', 2, 'stroke="#64748b" stroke-width="1.2"');
      s += box(34, 72, 52, 10, '#0f172a', 2, 'stroke="#64748b" stroke-width="1.2"');
      s += ps('M50,78 h20', '#94a3b8', 2.4);
      s += box(34, 88, 20, 8, '#0f172a', 2);
    } else if (o.shape === 'label') {
      s += p('M18,32 L102,32 L102,88 L18,88 L18,60 L6,60 L18,46 Z', o.paper || '#fbbf24', 'stroke="#b45309" stroke-width="2"');
      s += c(30, 60, 5, '#fdfdff', 'stroke="#b45309" stroke-width="1.4"');
      var bars = o.bars || 3;
      for (var lb = 0; lb < bars; lb++) {
        s += ps('M44,' + (52 + lb * 12) + ' h' + (44 - (lb % 2) * 10), o.ink || '#78350f', 3);
      }
      if (o.slash) {
        s += ps('M14,86 L104,34', '#dc2626', 5);
        s += pl('96,30 106,32 104,42 94,40', '#dc2626');
      }
    } else if (o.shape === 'receipt') {
      s += box(24, 14, 72, 92, o.paper || '#fdfdff', 3, 'stroke="#cbd5e1" stroke-width="2"');
      s += ps('M24,100 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8 l8,-8', '#cbd5e1', 2);
      var items = o.items || 4;
      for (var rr = 0; rr < items; rr++) {
        s += ps('M34,' + (30 + rr * 10) + ' h' + (46 - (rr % 3) * 6) + ' M' + (86 - (rr % 2) * 6) +
          ',' + (30 + rr * 10) + ' h10', '#94a3b8', 2.2);
      }
      s += ps('M34,82 h44', '#334155', 2.6);
      if (o.total) s += ps('M60,90 h34', '#334155', 3);
      if (o.stamp) {
        s += c(80, 88, 9, o.stamp, 'opacity=".8"');
        s += ps('M74,88 h12 M80,82 v12', '#fdfdff', 1.6, 'opacity=".9"');
      }
    } else if (o.shape === 'vault') {
      s += box(18, 20, 84, 82, o.body || '#475569', 5, 'stroke="#1f2937" stroke-width="2"');
      s += c(60, 62, 26, o.door || '#334155', 'stroke="#0f172a" stroke-width="3"');
      s += c(60, 62, 18, '#1f2937', 'stroke="#94a3b8" stroke-width="2"');
      s += ps('M60,44 v36 M42,62 h36 M47,49 l26,26 M73,49 l-26,26', '#94a3b8', 3);
      s += c(60, 62, 5, '#0f172a');
    }
    return s;
  });

  /** A shape, a swatch, a comparison: the abstract made visible. */
  kind('diagram', function (o) {
    var s = shadow(100, o.wide || 34, 0.08);
    if (o.mode === 'shape') {
      var f = SHAPE[o.shape] || SHAPE.circle;
      s += c(60, 60, 38, o.tint || '#eef2ff');
      s += f(60, 60, o.fill || '#3b82f6', o.ink || '#1e3a8a');
    } else if (o.mode === 'compare') {
      /* One small thing beside one big one: that is the whole of "bigger". */
      s += c(60, 60, 40, o.tint || '#eef2ff');
      var n = o.count === undefined ? 3 : o.count;
      for (var i = 0; i < n; i++) {
        s += c(30 + i * (o.wide2 ? 30 : 16), 84, o.big ? 16 : 6, o.fill || '#3b82f6');
      }
      s += ps('M18,26 h84', o.ink || '#94a3b8', 2, 'stroke-dasharray="4 4"');
      s += ps('M18,22 v8 M102,22 v-8', o.ink || '#94a3b8', 2);
    } else if (o.mode === 'grid') {
      s += box(12, 18, 96, 84, o.tint || '#eef2ff', 4, 'stroke="#cbd5e1" stroke-width="2"');
      for (var r = 0; r < 3; r++) {
        for (var col = 0; col < 4; col++) {
          var on = o.filled && (o.filled.indexOf(r * 4 + col) !== -1);
          s += box(18 + col * 23, 24 + r * 25, 19, 20, on ? (o.fill || '#3b82f6') : '#f8fafc',
            2, 'stroke="#cbd5e1" stroke-width="1.4"');
        }
      }
    } else if (o.mode === 'swatch') {
      s += box(20, 24, 80, 76, o.paper || '#fdfdff', 5, 'stroke="#cbd5e1" stroke-width="2"');
      s += box(28, 32, 64, 44, o.fill || '#94a3b8', 3);
      s += SWATCH[o.texture] ? SWATCH[o.texture](28, 32, 64, 44) : '';
      s += ps('M32,88 h56', '#cbd5e1', 3);
    } else if (o.mode === 'arrow') {
      s += c(60, 60, 40, o.tint || '#eef2ff');
      s += ps('M' + (o.from || 26) + ',' + (o.y || 60) + ' L' + (o.to || 94) + ',' + (o.y || 60),
        o.ink || '#3b82f6', 5);
      var ax = o.to === undefined ? 94 : o.to;
      var ay = o.y === undefined ? 60 : o.y;
      s += pl(ax + ',' + (ay - 9) + ' ' + (ax + 4) + ',' + ay + ' ' + (ax + 14) + ',' + (ay + 9), o.ink || '#3b82f6');
      if (o.dot) s += c(o.dot, 60, 8, o.fill || '#dc2626');
    } else if (o.mode === 'crosshair') {
      s += c(60, 60, 40, o.tint || '#eef2ff');
      s += ps('M60,16 v88 M16,60 h88', o.ink || '#4f46e5', 2, 'stroke-dasharray="5 5"');
      s += c(60, 60, 18, 'none', 'stroke="' + (o.ink || '#4f46e5') + '" stroke-width="2.6"');
      s += ps('M60,60 L' + (o.markerX || 84) + ',' + (o.markerY || 42), o.ink || '#4f46e5', 3.4);
      s += c(o.markerX || 84, o.markerY || 42, 7, o.fill || '#dc2626', 'stroke="#fdfdff" stroke-width="1.6"');
    } else if (o.mode === 'void') {
      s += c(60, 60, 40, o.tint || '#eef2ff');
      if (o.slash) {
        /* "none" is a thing that is not there: an empty ring with a bar across. */
        s += c(60, 60, 26, 'none', 'stroke="#94a3b8" stroke-width="7"');
        s += ps('M40,40 L80,80', '#dc2626', 6);
      } else {
        /* "zero" is a number: a big round nothing with a hole in the middle. */
        s += c(60, 60, 26, 'none', 'stroke="' + (o.ink || '#0f172a') + '" stroke-width="9"');
        s += c(60, 60, 6, o.ink || '#0f172a');
      }
    } else if (o.mode === 'dots') {
      /* A quantity of things, and `mark` says what the quantity is *for*.
         Count alone was the whole parameter, so `pair`, `fewer`, `remainder`
         and `quarter` were four different words drawn as the same N circles.
         The mark is the difference between a count and a claim about a count. */
      s += c(60, 60, 40, o.tint || '#eef2ff');
      var total = o.count === undefined ? 5 : o.count;
      var mark = o.mark;
      var cols = mark === 'tally' ? 5 : (total > 6 ? 4 : total);
      var yTop = mark === 'tally' ? 40 : 46;
      var fill = o.fill || '#3b82f6';
      var ink = o.ink || '#64748b';
      var step = cols > 1 ? 60 / (cols - 1) : 0;
      for (var d = 0; d < total; d++) {
        s += c(30 + (d % cols) * step, yTop + Math.floor(d / cols) * 16, 6, fill);
      }
      if (mark === 'bracket') {
        /* an amount, gathered up */
        s += ps('M26,74 h68 M26,74 v8 M94,74 v8 M60,80 v6', ink, 2.6);
      } else if (mark === 'pair') {
        /* two things that are one unit, not two things */
        s += ps('M40,66 q20,14 40,0', ink, 2.4);
        s += ps('M42,68 q18,3 36,0', fill, 3);
      } else if (mark === 'each') {
        /* every single one */
        s += ps('M22,68 h76', ink, 2.6);
        for (var e2 = 0; e2 < total; e2++) {
          s += ps('M' + (30 + (e2 % cols) * step) + ',68 v9', fill, 2.2);
        }
      } else if (mark === 'tally') {
        /* counting, the way it is written: strokes in fives */
        s += ps('M24,70 h10 M30,62 v16', ink, 3);
        s += ps('M24,84 h8', fill, 3);
        s += ps('M42,62 v24 M52,62 v24 M62,62 v24 M72,62 v24', ink, 3);
        s += ps('M36,60 l40,28', o.fill || '#dc2626', 3);
      } else if (mark === 'mean') {
        /* the average: a line through the middle of the set */
        s += ps('M20,58 h80', '#dc2626', 2.6, 'stroke-dasharray="5 3"');
        s += ps('M20,53 v10 M100,53 v10', ink, 2);
      } else if (mark === 'middle') {
        /* the middle value on a scale, not a number of things */
        s += ps('M18,78 h84', ink, 3);
        for (var t3 = 0; t3 < 5; t3++) s += ps('M' + (24 + t3 * 18) + ',78 v7', ink, 2);
        s += pl('60,56 52,72 68,72', o.fill || '#f59e0b');
      } else if (mark === 'portion') {
        /* one part of a whole, cut and marked */
        s += box(22, 68, 76, 16, '#f8fafc', 3, 'stroke="#94a3b8" stroke-width="1.8"');
        s += box(22, 68, 25, 16, fill, 2);
        s += ps('M47,64 v24 M72,64 v24', ink, 1.6, 'stroke-dasharray="3 2"');
      } else if (mark === 'leftover') {
        /* `remainder` is what is *left*, so the whole is drawn as an outline
           and only the scrap that survived is filled. A shaded wedge said
           "a fraction", which is the word next to it. */
        s += box(20, 40, 80, 34, 'none', 3, 'stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"');
        s += box(20, 40, 18, 34, fill, 2);
        s += ps('M44,57 h22', ink, 2.4, 'stroke-dasharray="3 3"');
        s += pl('70,57 62,52 62,62', ink);
        s += ps('M74,57 h26', ink, 2.6);
        s += ps('M20,84 h80', ink, 2);
      } else if (mark === 'min') {
        /* the smallest of a graded set: the answer is what is *not* the size */
        for (var m2 = 0; m2 < 4; m2++) s += c(28 + m2 * 21, 58, 4 + m2 * 2.6, m2 === 0 ? fill : '#cbd5e1');
        s += ps('M28,78 h13 M28,74 v8', '#dc2626', 2.4);
      } else if (mark === 'less') {
        /* less *of* something: a measure, and it does not reach */
        s += box(20, 78, 80, 10, '#f8fafc', 2, 'stroke="#94a3b8" stroke-width="1.8"');
        s += box(20, 78, 32, 10, fill, 2);
        s += ps('M16,74 h88', ink, 2, 'stroke-dasharray="4 3"');
      } else if (mark === 'quota') {
        /* a target, and a bar that has reached it */
        s += box(20, 76, 80, 14, '#f8fafc', 2, 'stroke="#94a3b8" stroke-width="1.8"');
        s += box(20, 76, 80, 14, fill, 2);
        s += ps('M20,64 v34 M100,64 v34', '#dc2626', 3);
        s += ps('M20,60 h80', '#dc2626', 2.4, 'stroke-dasharray="5 3"');
        s += pl('60,50 53,62 67,62', '#dc2626');
      } else if (mark === 'short') {
        /* `fewer` is fewer *of a set*, so the set is drawn whole and the part
           that is not there is what is left. A bracket says "an amount", which
           is a different word. */
        for (var g2 = 0; g2 < 5; g2++) s += c(26 + g2 * 17, 44, 6, '#cbd5e1');
        for (var g3 = 0; g3 < total; g3++) s += c(26 + g3 * 17, 68, 6, fill);
        s += ps('M20,58 h84', ink, 1.8, 'stroke-dasharray="4 3"');
      } else if (mark === 'sum') {
        /* `total` is the sum of parts, not a larger amount. */
        for (var h2 = 0; h2 < 3; h2++) s += c(28 + h2 * 14, 40, 5, fill);
        s += ps('M62,40 h10 M67,35 v10', ink, 3);
        for (var h3 = 0; h3 < 4; h3++) s += c(80 + h3 * 14, 40, 5, fill);
        s += ps('M58,62 h34 M60,56 h30 M64,50 h22 M68,44 h14', ink, 2.6);
        s += ps('M60,68 h28', fill, 3.4);
      } else if (mark === 'batch') {
        /* a batch: things gathered into one lot, which is the whole of the
           word — a loose row of the same things is `several` instead. */
        s += p('M26,44 C26,36 94,36 94,44 L94,80 C94,88 26,88 26,80 Z', '#f8fafc',
          'stroke="#94a3b8" stroke-width="2"');
        s += ps('M26,52 h68 M26,64 h68 M26,76 h68', '#cbd5e1', 2);
        s += ps('M26,36 h68', '#a16207', 3);
        s += ps('M42,32 q18,-8 36,0', '#a16207', 3);
      } else if (mark === 'most') {
        /* most of them, and the one that is not */
        for (var q2 = 0; q2 < 5; q2++) s += c(28 + q2 * 16, 56, 6, q2 === 4 ? '#cbd5e1' : fill);
        s += ps('M20,78 h80', ink, 2.6);
      }
      if (o.more) s += ps('M78,90 h18 M90,82 v16', ink, 3);
    } else if (o.mode === 'place') {
      /* Where a thing is, said by where the dot is.
         A grid of filled cells was the old answer and it was the wrong
         question: it encodes *which cells*, not *above* or *beside*, and it made
         `above` and `below` two fillings of the same twelve cells. The dot moves
         and the box does not.

         The second thing this needs is that these words are not all the same kind
         of relation. `top` is the upper *part* of something, so the box is tall
         and the dot sits on its edge. `above` is higher *than* something, so the
         box is a single object and the dot is clear of it. `atop` is the one in
         between — touching. Three words, and the only difference is where the dot
         is relative to the outline.

         `ref` picks the reference: a tall thing that has a top and a bottom, or
         a single object to be above or below. */
      s += c(60, 60, 40, o.tint || '#eef2ff');
      var spot = o.spot || 'centre';
      var ink = o.ink || '#dc2626';
      var part = o.ref === 'tall';
      var bw = part ? 44 : 30, bh = part ? 62 : 30;
      var bx = o.boxX === undefined ? 60 : o.boxX, byy = o.boxY === undefined ? 60 : o.boxY;
      var ox = bx - bw / 2, oy = byy - bh / 2;

      if (spot === 'point') {
        /* `at` is a point in space, not a point in a thing: there is nothing
           to be at the middle of, so no box is drawn. */
        s += c(60, 60, 22, 'none', 'stroke="#94a3b8" stroke-width="2.6"');
        s += c(60, 60, 9, ink, 'stroke="#fdfdff" stroke-width="1.6"');
        return s;
      }
      if (spot === 'amidst') {
        /* `amidst` is in the middle *of a group*, so the band has things on
           both sides of it — which is what it has over `middle`. */
        s += c(24, byy, 8, '#94a3b8') + c(38, byy, 8, '#94a3b8');
        s += c(96, byy, 8, '#94a3b8') + c(82, byy, 8, '#94a3b8');
        s += box(52, byy - 11, 16, 22, ink, 3, 'opacity=".28"');
        s += c(60, byy, 7, ink, 'stroke="#fdfdff" stroke-width="1.6"');
        return s;
      }
      if (spot === 'here') {
        /* `here` is this place, and a pin on a map is the one symbol the world
           already uses for it. A dot with a box around it said nothing. */
        s += p('M60,92 C60,92 34,60 34,44 C34,28 46,16 60,16 C74,16 86,28 86,44 C86,60 60,92 60,92 Z',
          o.fill || '#4f46e5', 'stroke="' + (o.ink || '#312e81') + '" stroke-width="2"');
        s += c(60, 42, 12, '#fdfdff');
        s += c(60, 42, 6, o.fill || '#4f46e5');
        return s;
      }
      if (spot === 'midship') {
        /* `amidships` is not "amidst" with another preposition: in English it
           is the middle of a *ship*. So it gets a hull, which is the one thing
           the word is actually about. */
        s += p('M18,64 L96,64 C96,80 82,90 58,90 C34,90 20,80 20,64 Z',
          o.fill || '#334155', 'stroke="#0f172a" stroke-width="2"');
        s += ps('M58,40 v22', '#64748b', 3);
        s += pl('58,38 50,50 66,50', '#64748b');
        s += ps('M18,64 h78', ink, 3, 'stroke-dasharray="5 4"');
        s += c(58, 64, 8, ink, 'stroke="#fdfdff" stroke-width="1.6"');
        return s;
      }
      if (spot === 'against') {
        /* `against` is touch, so two things and no gap. */
        s += box(24, oy, 34, 34, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += box(64, oy, 34, 34, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += c(60, oy + 17, 7, ink, 'stroke="#fdfdff" stroke-width="1.6"');
        return s;
      }
      if (spot === 'barrier') {
        /* `despite`: a thing, and a wall it is in spite of. */
        s += box(24, oy, 34, 30, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += ps('M66,26 v68', '#dc2626', 6);
        s += ps('M18,60 h84', ink, 3.4, 'stroke-dasharray="5 4"');
        return s;
      }
      if (spot === 'cover' || spot === 'beneath') {
        /* `over` and `underneath` put something *on* or *past* the thing, which
           is what separates them from `above` and `under`, where only a dot
           moves. */
        s += box(28, oy + 6, 64, 26, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        if (spot === 'cover') {
          s += box(28, oy - 14, 64, 12, ink, 3);
          s += ps('M20,' + (oy - 8) + ' h80', ink, 3.4);
        } else {
          s += box(28, oy + 38, 64, 12, ink, 3);
          s += ps('M20,' + (oy + 44) + ' h80', ink, 3.4);
        }
        return s;
      }
      if (spot === 'side') {
        /* `side` is a face of the thing, so half the outline is shaded rather
           than a dot put on it. */
        s += box(ox, oy, bw, bh, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += box(ox, oy, bw / 2, bh, ink, 4, 'opacity=".3"');
        s += ps('M' + (ox + bw / 2) + ',' + oy + ' v' + bh, ink, 2.6);
        return s;
      }
      if (spot === 'between') {
        /* `between` is not a position on its own — it needs two things to be
           between, and the dot has to sit in the gap, not on either of them. */
        s += box(18, oy, 30, 30, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += box(72, oy, 30, 30, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += c(60, oy + 15, 8, ink, 'stroke="#fdfdff" stroke-width="1.6"');
        return s;
      }
      if (spot === 'close' || spot === 'far') {
        /* `near` and `far` are about the gap between two things, so both are
           drawn and only the spacing changes. */
        var gap = spot === 'close' ? 32 : 54;
        s += box(60 - gap - 15, oy, 30, 30, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += box(60 + gap - 15, oy, 30, 30, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += ps('M' + (75 - gap) + ',' + (oy + 15) + ' h' + (gap * 2 - 30), '#64748b', 2,
          'stroke-dasharray="3 3"');
        return s;
      }

      if (spot !== 'behind' && spot !== 'front') {
        s += box(ox, oy, bw, bh, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
      }
      var dx = 0, dy = 0, on = false;
      if (spot === 'top') { dy = -(bh / 2 + 7); on = true; }
      else if (spot === 'bottom') { dy = bh / 2 + 7; on = true; }
      else if (spot === 'ontop') { dy = -(bh / 2 + 7); on = true; }
      else if (spot === 'under') { dy = bh / 2 + 7; on = true; }
      else if (spot === 'above') dy = -(bh / 2 + 26);
      else if (spot === 'below') dy = bh / 2 + 26;
      else if (spot === 'left') { dx = -(bw / 2 + 7); on = true; }
      else if (spot === 'right') { dx = bw / 2 + 7; on = true; }
      else if (spot === 'edge') { dx = bw / 2 + 7; dy = -(bh / 2 - 12); on = true; }
      else if (spot === 'corner') { dx = bw / 2 + 7; dy = -(bh / 2 + 7); on = true; }
      else if (spot === 'beside') dx = bw / 2 + 26;
      else if (spot === 'opposite') { dx = bw / 2 + 24; dy = bh / 2 + 22; }
      else if (spot === 'outside') { dx = bw / 2 + 22; dy = -(bh / 2 + 22); }
      else if (spot === 'behind') dy = -13;
      else if (spot === 'front') dy = 13;
      else if (spot === 'band') s += box(ox - 8, byy - 11, bw + 16, 22, ink, 3, 'opacity=".22"');

      if (spot === 'centre') {
        s += ps('M' + (ox - 8) + ',' + byy + ' h' + (bw + 16) + ' M' + bx + ',' + (oy - 8) + ' v' + (bh + 16),
          '#64748b', 1.4, 'stroke-dasharray="3 3"');
      }
      if (on) s += ps('M' + (bx + dx * 0.72) + ',' + (byy + dy * 0.72) + ' L' + (bx + dx) + ',' + (byy + dy), ink, 2.2);
      s += c(bx + dx, byy + dy, 8, ink, 'stroke="#fdfdff" stroke-width="1.6"');
      if (spot === 'behind') {
        /* Depth is occlusion. A dashed outline behind and a solid one in front
           is the only drawing of "behind" that reads without a caption; a
           dashed line above the box could be anything. */
        s += box(ox - 12, oy - 12, bw + 24, bh + 24, 'none', 4, 'stroke="#94a3b8" stroke-width="2"');
        s += box(ox, oy, bw, bh, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="2"');
        s += c(bx, byy, 8, ink, 'stroke="#fdfdff" stroke-width="1.6"');
        return s;
      }
      if (spot === 'front') {
        s += box(ox - 12, oy - 12, bw + 24, bh + 24, o.fill || '#cbd5e1', 4, 'stroke="#64748b" stroke-width="2"');
        s += box(ox + 9, oy + 9, bw - 18, bh - 18, 'none', 3,
          'stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"');
        s += c(bx, byy, 8, ink, 'stroke="#fdfdff" stroke-width="1.6"');
        return s;
      }
    } else if (o.mode === 'route') {
      /* A direction, said by the path the arrow takes. `through` goes through
         an opening, `across` goes over a surface, `along` follows one: the
         difference between three words that all look like a line with a head. */
      s += c(60, 60, 40, o.tint || '#eef2ff');
      var route = o.route || 'across';
      var ink = o.ink || '#3b82f6';
      if (route === 'up' || route === 'down') {
        var uy = route === 'up' ? 26 : 94;
        s += ps('M60,94 L60,26', ink, 4);
        var ty = route === 'up' ? 26 : 94;
        s += pl('60,' + ty + ' ' + (60 - 8) + ',' + (ty + (route === 'up' ? 12 : -12)) + ' ' +
          (60 + 8) + ',' + (ty + (route === 'up' ? 12 : -12)), ink);
      } else if (route === 'along') {
        s += ps('M22,84 C44,84 46,40 68,40 L98,40', ink, 4);
        s += pl('98,40 84,33 84,47', ink);
      } else if (route === 'through') {
        s += box(34, 34, 52, 52, 'none', 6, 'stroke="#94a3b8" stroke-width="7"');
        s += ps('M14,60 L106,60', ink, 4);
        s += pl('106,60 92,53 92,67', ink);
      } else if (route === 'beyond') {
        s += ps('M16,60 L100,60', ink, 4);
        s += pl('100,60 86,53 86,67', ink);
        s += ps('M56,32 v56', '#dc2626', 4);
        s += c(72, 60, 7, o.fill || '#dc2626');
      } else if (route === 'towards') {
        /* `towards` is motion aimed at a thing. */
        s += ps('M22,60 L70,60', ink, 4);
        s += pl('80,60 66,53 66,67', ink);
        s += c(90, 60, 9, o.fill || '#dc2626');
      } else if (route === 'next') {
        /* `next` is two things in a row and the step from the first to the
           second — not an arrow at a distant target. */
        s += box(20, 44, 28, 28, o.fill || '#94a3b8', 4, 'stroke="#64748b" stroke-width="1.8"');
        s += box(72, 44, 28, 28, 'none', 4, 'stroke="#94a3b8" stroke-width="2"');
        s += ps('M52,58 L66,58', ink, 3.4);
        s += pl('72,58 62,52 62,64', ink);
      } else if (route === 'start') {
        /* `beginning` is the start of a run, marked at one end. */
        s += ps('M18,74 L102,74', '#94a3b8', 4);
        s += c(18, 74, 8, o.fill || '#dc2626', 'stroke="#fdfdff" stroke-width="1.6"');
        s += pl('18,58 10,70 26,70', ink);
        s += ps('M34,66 h56', ink, 2.4, 'stroke-dasharray="5 4"');
      } else if (route === 'end') {
        /* `end` is the far end of a run reached, not a barrier passed. */
        s += ps('M18,60 H100', '#94a3b8', 4);
        s += ps('M18,60 L74,60', ink, 4);
        s += pl('84,60 70,53 70,67', ink);
        s += ps('M100,40 v40', ink, 5);
        s += c(84, 60, 6, o.fill || '#dc2626');
      } else if (route === 'whole') {
        /* `throughout` is the whole length, marked at both ends. */
        s += ps('M20,60 H100', ink, 4);
        s += c(20, 60, 7, o.fill || '#dc2626', 'stroke="#fdfdff" stroke-width="1.6"');
        s += c(100, 60, 7, o.fill || '#dc2626', 'stroke="#fdfdff" stroke-width="1.6"');
        s += box(44, 42, 32, 36, 'none', 3, 'stroke="#94a3b8" stroke-width="2"');
      } else if (route === 'level') {
        s += box(20, 74, 34, 16, o.fill || '#94a3b8', 3, 'stroke="#64748b" stroke-width="1.6"');
        s += box(66, 74, 34, 16, o.fill || '#94a3b8', 3, 'stroke="#64748b" stroke-width="1.6"');
        s += ps('M14,64 h92', ink, 3, 'stroke-dasharray="5 4"');
        s += c(37, 58, 4, ink) + c(83, 58, 4, ink);
      } else {
        s += box(20, 50, 80, 20, o.fill || '#cbd5e1', 3, 'stroke="#94a3b8" stroke-width="1.6"');
        s += ps('M14,44 L106,44', ink, 4);
        s += pl('106,44 92,37 92,51', ink);
      }
    } else if (o.mode === 'sector') {
      /* A third or a quarter: the whole divided, one part marked. Drawing a
         third as "three dots" was the same as drawing a pair as two dots, and
         a dot cannot say which part of the whole it is. */
      s += c(60, 58, 38, o.tint || '#eef2ff');
      var n3 = o.parts === undefined ? 3 : o.parts;
      for (var q = 0; q < n3; q++) {
        var a0 = (q * Math.PI * 2) / n3 - Math.PI / 2;
        var a1 = ((q + 1) * Math.PI * 2) / n3 - Math.PI / 2;
        var x0 = 60 + Math.cos(a0) * 38, y0 = 58 + Math.sin(a0) * 38;
        var x1 = 60 + Math.cos(a1) * 38, y1 = 58 + Math.sin(a1) * 38;
        s += p('M60,58 L' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' A38,38 0 0 1 ' +
          x1.toFixed(1) + ',' + y1.toFixed(1) + ' Z', q === 0 ? (o.fill || '#f59e0b') : '#f8fafc',
          'stroke="#94a3b8" stroke-width="2"');
      }
      s += ps('M22,58 h76', o.ink || '#64748b', 1.6, 'stroke-dasharray="4 3"');
    } else if (o.mode === 'numeral') {
      /* The number, written. A hundred drawn as ten dots and a million as
         eighteen was a picture that said something untrue, and a learner
         counting the dots would have been taught a wrong fact. The digits are
         the word, so they are drawn. */
      s += c(60, 60, 40, o.tint || '#eef2ff');
      var txt = String(o.value === undefined ? 12 : o.value);
      /* Written out in full, a million and a billion differ in how many digits
         there are — which is the actual difference between them. Both drawn as
         "10" with an exponent differing by three segments was two pictures of
         the same size.

         Laid out by *ink*, not by advance. A seven-segment digit draws from
         x-12 to x+20, so centring the advance widths left the last digit
         hanging 8 units off the right of the card and put the exponent of
         "10⁹" outside it entirely. */
      var w2 = 30, gap = 9;
      var xs = [], adv = 0;
      for (var q4 = 0; q4 < txt.length; q4++) {
        xs.push(adv);
        adv += w2;
        /* Grouped in threes, the way a million is written in Portuguese and
           Spanish. It also rescues the leading 1: a seven-segment "1" is two
           bars hard against the right of its cell, so "1000000" was
           "|000000" until the groups gave it room. */
        var fromRight = txt.length - 1 - q4;
        if (fromRight > 0 && fromRight % 3 === 0) adv += gap;
      }
      var lastInk = xs[xs.length - 1] + 20;     /* right edge of the last digit */
      var totalInk = o.sup ? lastInk + 8 + 32 : lastInk;
      if (o.scale === undefined && totalInk > 104) o.scale = 104 / totalInk;
      var sc = o.scale || 1;
      var x0 = 60 - (totalInk * sc) / 2 - 12;    /* origin of the first digit */

      s += '<g transform="translate(60 58) scale(' + sc + ') translate(-60 -58)">';
      for (var dg = 0; dg < txt.length; dg++) {
        s += digit(txt[dg], x0 + xs[dg], 58, o.ink || '#0f172a', 4);
      }
      if (o.sup) {
        s += digit(String(o.sup), x0 + lastInk + 8, 34, o.fill || '#dc2626', 2.4);
      }
      s += '</g>';
      if (o.sup) s += ps('M' + (60 + (totalInk * sc) / 2 - 26) + ',22 h20', o.ink || '#0f172a', 1.4);
      s += ps('M' + (60 - (totalInk * sc) / 2 - 8) + ',82 h' + (totalInk * sc + 16), '#cbd5e1', 2.4);
    }
    return s;
  });

  /** A regular polygon as path data, so the named shapes are not special cases. */
  function polygon(x, y, sides, offset, r) {
    var d = '';
    for (var i = 0; i < sides; i++) {
      var a = (i * Math.PI * 2) / sides + (offset || 0);
      d += (i ? ' L' : 'M') + (x + Math.cos(a) * r).toFixed(1) + ',' + (y + Math.sin(a) * r).toFixed(1);
    }
    return d + ' Z';
  }

  /** The named shapes, so a shape card is the shape and not a box around it. */
  var SHAPE = {
    circle: function (x, y, f, i) { return c(x, y, 26, f, 'stroke="' + i + '" stroke-width="2"'); },
    square: function (x, y, f, i) { return box(x - 22, y - 22, 44, 44, f, 4, 'stroke="' + i + '" stroke-width="2"'); },
    triangle: function (x, y, f, i) { return pl((x) + ',' + (y - 26) + ' ' + (x + 26) + ',' + (y + 22) + ' ' + (x - 26) + ',' + (y + 22), f, 'stroke="' + i + '" stroke-width="2"'); },
    rect: function (x, y, f, i) { return box(x - 30, y - 18, 60, 36, f, 3, 'stroke="' + i + '" stroke-width="2"'); },
    oval: function (x, y, f, i) { return e(x, y, 30, 18, f, 'stroke="' + i + '" stroke-width="2"'); },
    star: function (x, y, f, i) {
      /* Ten vertices alternating between the outer and the inner radius, so the
         point count and the shape follow from the radius instead of being typed
         out. This was a hand-written point list that was a *lightning bolt*, and
         it ignored x and y, so every star in the deck was the same bolt in the
         same place. A point list that is syntactically valid is not the same as
         one that is the right shape, and nothing in the harness could tell. */
      var d = '';
      for (var k = 0; k < 10; k++) {
        var a = (k * Math.PI) / 5 - Math.PI / 2;
        var rr = k % 2 ? 11 : 26;
        d += (k ? ' ' : '') + (x + Math.cos(a) * rr).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1);
      }
      return pl(d, f, 'stroke="' + i + '" stroke-width="2"');
    },
    heart: function (x, y, f, i) {
      return c(x - 12, y - 8, 12, f) + c(x + 12, y - 8, 12, f) + c(x, y + 6, 12, f);
    },
    diamond: function (x, y, f, i) { return pl(x + ',' + (y - 28) + ' ' + (x + 24) + ',' + y + ' ' + x + ',' + (y + 28) + ' ' + (x - 24) + ',' + y, f, 'stroke="' + i + '" stroke-width="2"'); },
    hexagon: function (x, y, f, i) { return p(polygon(x, y, 6, Math.PI / 6, 26), f, 'stroke="' + i + '" stroke-width="2"'); },
    pentagon: function (x, y, f, i) { return p(polygon(x, y, 5, -Math.PI / 2, 26), f, 'stroke="' + i + '" stroke-width="2"'); },
    octagon: function (x, y, f, i) { return p(polygon(x, y, 8, 0, 26), f, 'stroke="' + i + '" stroke-width="2"'); },
    cross: function (x, y, f, i) {
      return box(x - 9, y - 28, 18, 56, f) + box(x - 28, y - 9, 56, 18, f);
    },
    arrow: function (x, y, f, i) {
      return box(x - 28, y - 6, 34, 12, f) + pl(x + 6 + ',' + (y - 16) + ' ' + (x + 28) + ',' + y + ' ' + (x + 6) + ',' + (y + 16), f);
    },
    line: function (x, y, f, i) { return ps('M' + (x - 28) + ',' + (y + 14) + ' L' + (x + 28) + ',' + (y - 14), f, 5); },
    curve: function (x, y, f, i) { return ps('M' + (x - 28) + ',' + (y + 16) + ' q28,-32 56,0', f, 5); },
    dot: function (x, y, f, i) { return c(x, y, 14, f, 'stroke="' + i + '" stroke-width="2"'); },
    ring: function (x, y, f, i) { return c(x, y, 26, 'none', 'stroke="' + f + '" stroke-width="8"'); },
    bar: function (x, y, f, i) { return box(x - 30, y - 8, 60, 16, f, 3); },
    column: function (x, y, f, i) { return box(x - 12, y - 26, 24, 52, f, 3, 'stroke="' + i + '" stroke-width="2"'); },
    sphere: function (x, y, f, i) { return c(x, y, 26, f, 'stroke="' + i + '" stroke-width="2"'); },
    cube: function (x, y, f, i) {
      return pl(x + ',' + (y - 26) + ' ' + (x + 26) + ',' + (y - 12) + ' ' + (x + 26) + ',' + (y + 20) + ' ' + x + ',' + (y + 34) + ' ' + (x - 26) + ',' + (y + 20) + ' ' + (x - 26) + ',' + (y - 12), f, 'stroke="' + i + '" stroke-width="2"');
    },
    /* A trapezoid is a rectangle with one edge cut: a wide bottom, a narrow
       top, and the two slanted sides are what make it a trapezoid. */
    trapezoid: function (x, y, f, i) {
      return pl((x - 18) + ',' + (y - 22) + ' ' + (x + 18) + ',' + (y - 22) + ' ' + (x + 28) + ',' + (y + 24) + ' ' + (x - 28) + ',' + (y + 24),
        f, 'stroke="' + i + '" stroke-width="2"');
    },
    /* A cone: a point, a curve down to the base, and an ellipse to sit on. */
    cone: function (x, y, f, i) {
      return p('M' + x + ',' + (y - 28) + ' C' + (x + 10) + ',' + (y - 4) + ' ' + (x + 22) + ',' + (y + 6) + ' ' + (x + 24) + ',' + (y + 16) +
        ' L' + (x - 24) + ',' + (y + 16) + ' C' + (x - 22) + ',' + (y + 6) + ' ' + (x - 10) + ',' + (y - 4) + ' ' + x + ',' + (y - 28) + ' Z',
        f, 'stroke="' + i + '" stroke-width="2"') + e(x, y + 16, 24, 7, i);
    },
    /* An angle: two rays and the arc between them, which is what makes it an
       angle rather than a corner. */
    angle: function (x, y, f, i) {
      return ps('M' + (x - 26) + ',' + (y + 22) + ' L' + x + ',' + (y - 26), f, 6) +
        ps('M' + x + ',' + (y + 22) + ' L' + (x + 28) + ',' + (y - 2), f, 6) +
        ps('M' + (x - 26) + ',' + (y + 22) + ' A30,30 0 0 0 ' + (x + 28) + ',' + (y - 2), i, 2, 'stroke-dasharray="3 3"');
    },
    zigzag: function (x, y, f, i) {
      return ps('M' + (x - 30) + ',' + (y + 16) + ' L' + (x - 15) + ',' + (y - 14) + ' L' + x + ',' + (y + 16) +
        ' L' + (x + 15) + ',' + (y - 14) + ' L' + (x + 30) + ',' + (y + 16), f, 6);
    },
    spiral: function (x, y, f, i) {
      var d = '', n = 0;
      for (var a = 0; a < Math.PI * 4; a += 0.3) {
        n += 1.5;
        d += (d ? 'L' : 'M') + (x + Math.cos(a) * n).toFixed(1) + ',' + (y + Math.sin(a) * n).toFixed(1);
      }
      return p(d, 'none', 'stroke="' + f + '" stroke-width="4" stroke-linecap="round"');
    }
  };

  /** A texture, drawn rather than described. */
  var SWATCH = {
    rough: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 40; i++) {
        s += c(x + ((i * 37) % w), y + ((i * 23) % h), 1.6, '#78716c', 'opacity=".8"');
      }
      return s;
    },
    smooth: function (x, y, w, h) { return ps('M' + x + ',' + (y + h / 2) + ' h' + w, '#f8fafc', 8, 'opacity=".7"'); },
    bumpy: function (x, y, w, h) {
      var s = '';
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 5; col++) {
          s += c(x + 7 + col * 12, y + 7 + row * 10, 5, '#475569', 'opacity=".5"');
        }
      }
      return s;
    },
    flat: function (x, y, w, h) { return box(x + 4, y + 6, w - 8, h - 12, '#ffffff', 2, 'opacity=".25"'); },
    fuzzy: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 26; i++) {
        s += ps('M' + (x + 3 + ((i * 29) % (w - 6))) + ',' + (y + 4 + ((i * 17) % (h - 8))) +
          ' l6,4', '#cbd5e1', 2, 'opacity=".8"');
      }
      return s;
    },
    grainy: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 50; i++) {
        s += ps('M' + (x + ((i * 19) % w)) + ',' + (y + ((i * 31) % h)) + ' l3,3', '#78716c', 1.4, 'opacity=".7"');
      }
      return s;
    },
    powdery: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 30; i++) {
        s += c(x + ((i * 41) % w), y + ((i * 13) % h), 2.4, '#f8fafc', 'opacity=".8"');
      }
      return s;
    },
    greasy: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 6; i++) {
        s += e(x + 8 + i * 10, y + 8 + (i % 3) * 12, 8, 4, '#fde047', 'opacity=".6"');
      }
      return s;
    },
    rusty: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 14; i++) {
        s += c(x + 5 + ((i * 23) % (w - 10)), y + 5 + ((i * 17) % (h - 10)), 3.4, '#b45309', 'opacity=".7"');
      }
      return s;
    },
    wrinkled: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 4; i++) {
        s += ps('M' + (x + 4) + ',' + (y + 8 + i * 9) + ' q' + (w / 4) + ',-7 ' + (w / 2) + ',0 q' + (w / 4) + ',7 ' + (w / 2) + ',0',
          '#64748b', 2, 'opacity=".7"');
      }
      return s;
    },
    scaly: function (x, y, w, h) {
      var s = '';
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 4; col++) {
          s += ps('M' + (x + 4 + col * 15) + ',' + (y + 12 + row * 12) + ' a8,8 0 0 1 15,0',
            '#334155', 2, 'opacity=".6"');
        }
      }
      return s;
    },
    mesh: function (x, y, w, h) {
      var s = '';
      for (var i = 0; i < 6; i++) s += ps('M' + (x + i * 11) + ',' + y + ' v' + h, '#e2e8f0', 2);
      for (var j = 0; j < 4; j++) s += ps('M' + x + ',' + (y + j * 12) + ' h' + w, '#e2e8f0', 2);
      return s;
    },
    shiny: function (x, y, w, h) {
      return ps('M' + (x + 8) + ',' + (y + 10) + ' l16,6 M' + (x + 10) + ',' + (y + 22) + ' l24,8', '#ffffff', 4, 'opacity=".8"');
    },
    /* A facet: two flat planes meeting at an edge, which is what a sharp
       surface looks like head on. */
    facet: function (x, y, w, h) {
      return p('M' + x + ',' + y + ' L' + (x + w) + ',' + (y + h / 2) + ' L' + x + ',' + (y + h) + ' Z',
        '#ffffff', 'opacity=".3"') + ps('M' + x + ',' + y + ' L' + (x + w) + ',' + (y + h / 2) + ' L' + x + ',' + (y + h),
          '#0f172a', 2, 'opacity=".6"');
    },
    /* Dust: the patch sits proud of the surface it covers. */
    dust: function (x, y, w, h) {
      var s2 = '';
      for (var i = 0; i < 18; i++) {
        var px = x + ((i * 47) % w), py = y + h - 4 - ((i * 31) % (h - 8));
        s2 += c(px, py, 2.6, '#e7e5e4', 'opacity=".9"');
      }
      return s2;
    },
    /* Slick: an unbroken film, drawn as one long highlight. */
    slick: function (x, y, w, h) {
      return ps('M' + (x + 4) + ',' + (y + h * 0.6) + ' C' + (x + w * 0.3) + ',' + (y + h * 0.2) + ' ' +
        (x + w * 0.7) + ',' + (y + h * 0.8) + ' ' + (x + w - 4) + ',' + (y + h * 0.4), '#ffffff', 7, 'opacity=".65"');
    }
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
  var RECIPES = {};

  LLC.art.spec = function (map) {
    var wrappers = {};
    for (var id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      RECIPES[id] = map[id];
      /* Both `id` and `spec` have to be captured: a closure over the loop
         variable would hand every recipe the last id in the map. */
      wrappers[id] = (function (wordId, recipe) {
        return function () { return LLC.art.recipe(wordId, recipe); };
      })(id, map[id]);
    }
    LLC.art.register(wrappers);
    return Object.keys(wrappers).length;
  };

  /** What a word was asked to draw, for the test harness to inspect. */
  LLC.art.recipes = function () { return RECIPES; };

  /** Ids whose recipe failed; expected to stay empty. */
  LLC.art.specFailures = function () { return failures.slice(); };
})(window);
