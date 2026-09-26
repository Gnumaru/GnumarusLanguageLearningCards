/*!
 * art-things.js - Artwork for the world around us: jobs, household objects,
 * sports, music, places, transport, technology and time.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var d = LLC.art.d, F = LLC.art.f, person = LLC.art.person;
  var c = d.c, e = d.e, rc = d.rc, p = d.p, ps = d.ps, pl = d.pl, ln = d.ln, txt = d.txt, scene = d.scene;
  var SKIN = LLC.art.colors.SKIN, NIGHT = LLC.art.colors.NIGHT;
  var BG = '#f0fdfa';

  var map = {};

  /* ============================================================ jobs (16) */

  function job(shirt, prop, extra) {
    return scene(
      person(60, 40, { shirt: shirt, smile: true, hair: '#33261f', scale: 1.02 }) +
      (prop || '') + (extra || ''),
      { bg: BG });
  }

  map.doctor = function () {
    return job('#fdfdff',
      p('M46,50 L74,50 L80,104 L40,104 Z', '#fdfdff', 'stroke="#dbe3ee" stroke-width="2"') +
      ps('M52,54 C48,66 54,72 60,74 C66,72 72,66 68,54', '#334155', 2.6) +
      c(60, 74, 4, '#334155') + c(46, 40, 2, '#e0453f'));
  };

  map.nurse = function () {
    return job('#fdfdff',
      p('M46,50 L74,50 L80,104 L40,104 Z', '#fdfdff', 'stroke="#dbe3ee" stroke-width="2"') +
      rc(48, 26, 24, 10, '#fdfdff', 3, 'stroke="#dbe3ee" stroke-width="2"') +
      ln(60, 28, 60, 34, '#e0453f', 2.6) + ln(57, 31, 63, 31, '#e0453f', 2.6) +
      rc(70, 56, 16, 12, '#cbd5e1', 2) + ln(74, 56, 74, 68, '#94a3b8', 2) + ln(70, 68, 78, 68, '#94a3b8', 2));
  };

  map.teacher = function () {
    return job('#0d9488',
      rc(24, 58, 22, 28, '#e0453f', 3) + ln(35, 58, 35, 86, '#fdfdff', 2) +
      ln(29, 66, 41, 66, '#fdfdff', 2) + ln(29, 74, 41, 74, '#fdfdff', 2) +
      ps('M88,44 L98,88', '#8a5a33', 3.4));
  };

  map.student = function () {
    return job('#f97316',
      p('M32,50 C24,52 24,72 30,84 L44,84 C40,70 42,56 44,50 Z', '#2563eb') +
      rc(28, 58, 20, 22, '#3b82f6', 4) + ln(36, 70, 36, 80, '#1d4ed8', 2) +
      rc(76, 60, 22, 26, '#fdfdff', 2) + ln(87, 60, 87, 86, '#cbd5e1', 2));
  };

  map.police = function () {
    return job('#1e3a8a',
      p('M34,26 L86,26 L86,32 L34,32 Z', '#1e3a5f') +
      p('M40,14 L80,14 L84,26 L36,26 Z', '#1e3a5f') +
      c(60, 22, 5, '#fbbf24') +
      pl('60,62 66,68 60,80 54,68', '#fbbf24') +
      c(46, 70, 3, '#fbbf24'));
  };

  map.firefighter = function () {
    return job('#dc2626',
      p('M34,22 C34,12 86,12 86,22 L86,30 L34,30 Z', '#ea580c') +
      rc(30, 28, 60, 6, '#fcd34d', 2) + rc(50, 6, 20, 8, '#cbd5e1', 2) +
      rc(44, 56, 32, 5, '#fcd34d', 2) +
      ps('M28,52 C18,48 16,38 24,34 M92,52 C102,48 104,38 96,34', '#94a3b8', 2.4));
  };

  map.farmer = function () {
    return job('#3f7fb5',
      p('M30,22 L90,22 L96,30 L24,30 Z', '#e8c98a') +
      e(57, 20, 24, 10, '#e8c98a') +
      p('M42,52 L78,52 L82,104 L38,104 Z', '#4a6b8a') +
      ln(52, 52, 52, 104, '#8a5a33', 2) + ln(68, 52, 68, 104, '#8a5a33', 2));
  };

  map.chef = function () {
    return job('#fdfdff',
      p('M40,26 C32,26 32,14 40,14 C42,4 54,4 56,14 C60,6 70,10 70,18 C82,18 82,26 76,26 Z', '#fdfdff', 'stroke="#dbe3ee" stroke-width="2"') +
      ln(50, 66, 70, 66, '#cbd5e1', 2.4) + ln(50, 76, 70, 76, '#cbd5e1', 2.4) +
      c(60, 71, 2, '#cbd5e1'));
  };

  map.waiter = function () {
    return job('#1f2937',
      p('M46,50 L74,50 L70,86 L50,86 Z', '#111827') +
      e(84, 58, 16, 5, '#cbd5e1') + rc(80, 62, 8, 12, '#e2e8f0', 2) +
      c(70, 44, 3, '#fbbf24') + c(60, 40, 2, '#fbbf24') + c(50, 44, 3, '#fbbf24'));
  };

  map.driver = function () {
    return job('#334155',
      p('M34,26 L86,26 L86,32 L34,32 Z', '#0f172a') + p('M40,14 L80,14 L84,26 L36,26 Z', '#0f172a') +
      c(60, 62, 18, 'none', 'stroke="#0f172a" stroke-width="5"') +
      ln(60, 62, 60, 48, '#0f172a', 4) + ln(60, 62, 72, 68, '#0f172a', 4) +
      c(60, 62, 4, '#0f172a'));
  };

  map.pilot = function () {
    return job('#1e3a8a',
      p('M34,26 L86,26 L86,32 L34,32 Z', '#0f172a') + p('M40,16 L80,16 L84,26 L36,26 Z', '#0f172a') +
      c(60, 22, 5, '#fbbf24') +
      pl('60,58 72,64 66,70 60,66 54,70 48,64', '#e2e8f0') +
      rc(30, 60, 12, 22, '#1e3a8a', 3));
  };

  map.artist = function () {
    return job('#9333ea',
      p('M34,28 C34,18 86,18 86,28 C86,32 70,32 60,30 C50,32 34,32 34,28 Z', '#e0453f') +
      c(60, 26, 4, '#e0453f') +
      e(88, 68, 16, 12, '#e8c98a') + c(82, 64, 3, '#e0453f') + c(92, 66, 3, '#3b82f6') +
      c(88, 74, 3, '#4a9e4a') + c(96, 74, 2.4, '#f2903c') +
      ps('M76,58 L84,50', '#8a5a33', 2.4));
  };

  map.singer = function () {
    return job('#111827',
      rc(74, 44, 8, 26, '#334155', 4) + e(78, 40, 11, 11, '#cbd5e1') +
      ln(78, 70, 78, 88, '#334155', 3) + ln(64, 90, 92, 90, '#334155', 3.4) +
      ps('M60,40 C68,36 70,46 64,50', '#7c3aed', 2.4) +
      c(72, 20, 3.4, '#3f3a4d') + ln(75, 20, 75, 8, '#3f3a4d', 2.6));
  };

  map.writer = function () {
    return job('#334155',
      c(46, 40, 10, 'none', 'stroke="#0f172a" stroke-width="2.6"') +
      c(66, 40, 10, 'none', 'stroke="#0f172a" stroke-width="2.6"') +
      ln(56, 40, 60, 40, '#0f172a', 2.6) +
      rc(28, 58, 24, 28, '#fdfdff', 2) + ln(40, 58, 40, 86, '#cbd5e1', 2) +
      ln(32, 66, 38, 66, '#cbd5e1', 1.8) + ln(32, 72, 38, 72, '#cbd5e1', 1.8) +
      ps('M56,70 L70,52', '#e8b45c', 3.4) + p('M70,52 74,46 72,54  Z', '#334155'));
  };

  map.lawyer = function () {
    return job('#1f2937',
      pl('60,52 68,58 63,84 57,84 52,58', '#b91c1c') +
      rc(22, 62, 26, 22, '#8a5a33', 3) + rc(26, 66, 18, 6, '#6b4423', 2) +
      ln(35, 62, 35, 56, '#8a5a33', 3) + c(46, 40, 2, NIGHT) + c(74, 40, 2, NIGHT));
  };

  map.mechanic = function () {
    return job('#1d4ed8',
      p('M42,52 L78,52 L82,104 L38,104 Z', '#1e3a8a') +
      ln(52, 52, 52, 104, '#8a5a33', 2) + ln(68, 52, 68, 104, '#8a5a33', 2) +
      ps('M84,56 C96,52 100,62 94,68 C90,72 84,68 86,62', '#94a3b8', 5) +
      ps('M96,68 C104,64 108,74 102,80', '#94a3b8', 4));
  };

  /* ========================================================= objects (28) */

  map.fork = function () {
    return scene(
      rc(50, 52, 20, 40, '#cbd5e1', 3) +
      rc(48, 88, 24, 14, '#94a3b8', 4) +
      rc(44, 14, 6, 40, '#cbd5e1', 3) + rc(54, 14, 6, 40, '#cbd5e1', 3) +
      rc(64, 14, 6, 40, '#cbd5e1', 3) + rc(74, 14, 6, 40, '#cbd5e1', 3) +
      rc(48, 8, 46, 12, '#cbd5e1', 5),
      { bg: '#eef4ff' });
  };

  map.knife = function () {
    return scene(
      p('M40,16 C64,20 84,42 84,62 L84,70 L40,70 Z', '#dbe3ee', 'stroke="#b6c2d4" stroke-width="2"') +
      p('M46,24 C64,30 78,46 78,62 L46,62 Z', '#f1f5f9') +
      rc(40, 68, 46, 10, '#94a3b8', 3) +
      p('M40,78 L86,78 L86,86 C86,94 80,98 72,98 L54,98 C46,98 40,94 40,86 Z', '#4a3a2a') +
      c(46, 88, 2, '#cbd5e1'),
      { bg: '#eef4ff' });
  };

  map.spoon = function () {
    return scene(
      e(60, 32, 20, 26, '#dbe3ee', 'stroke="#b6c2d4" stroke-width="2"') +
      e(60, 30, 14, 19, '#f1f5f9') +
      rc(54, 54, 12, 44, '#cbd5e1', 5, 'stroke="#b6c2d4" stroke-width="2"'),
      { bg: '#eef4ff' });
  };

  map.plate = function () {
    return scene(
      e(60, 68, 46, 14, '#cbd5e1') +
      e(60, 62, 46, 15, '#fdfdff', 'stroke="#dbe3ee" stroke-width="2"') +
      e(60, 62, 30, 9, '#eef2f7') +
      e(42, 56, 10, 4, '#ffffff', 'opacity=".8"'),
      { bg: '#eef4ff' });
  };

  map.bowl = function () {
    return scene(
      e(60, 44, 34, 9, '#dbeafe', 'stroke="#bfdbfe" stroke-width="2"') +
      e(60, 42, 28, 6, '#fdfdff') +
      p('M26,44 L94,44 C92,80 78,100 60,100 C42,100 28,80 26,44 Z', '#fdfdff', 'stroke="#bfdbfe" stroke-width="2"') +
      p('M34,56 C38,76 48,88 60,90', '#ffffff', 'opacity=".7"'),
      { bg: '#eef4ff' });
  };

  map.pan = function () {
    return scene(
      ps('M84,44 C104,44 108,64 96,72', '#334155', 5) +
      p('M14,48 L84,48 C84,78 66,94 44,94 C24,94 14,78 14,48 Z', '#334155') +
      p('M20,54 L78,54 C78,78 62,90 44,90 C26,90 20,78 20,54 Z', '#475569') +
      e(48, 56, 22, 5, '#0f766e', 'opacity=".5"'),
      { bg: '#eef4ff' });
  };

  map.pot = function () {
    return scene(
      p('M26,44 L94,44 C94,86 82,100 60,100 C38,100 26,86 26,44 Z', '#64748b') +
      rc(22, 34, 76, 12, '#475569', 4) +
      rc(56, 22, 8, 12, '#475569', 2) +
      e(60, 24, 12, 5, '#94a3b8') +
      ps('M20,54 C8,54 8,72 20,72', '#475569', 4) +
      ps('M100,54 C112,54 112,72 100,72', '#475569', 4) +
      e(46, 64, 10, 16, '#94a3b8', 'opacity=".35"'),
      { bg: '#eef4ff' });
  };

  map.kettle = function () {
    return scene(
      p('M34,50 C34,36 46,32 60,32 C74,32 86,36 86,50 L90,88 C90,96 82,100 60,100 C38,100 30,96 30,88 Z', '#0f766e') +
      rc(24, 40, 72, 12, '#134e4a', 4) + c(60, 32, 5, '#134e4a') +
      ps('M90,60 C106,58 108,78 94,84', '#0f766e', 5) +
      ps('M30,60 C14,58 12,78 26,84', '#0f766e', 5) +
      e(48, 70, 8, 14, '#5eead4', 'opacity=".4"'),
      { bg: '#eef4ff' });
  };

  map.towel = function () {
    return scene(
      p('M26,26 L94,26 L94,72 L82,72 L82,100 L70,100 L70,72 L38,72 L38,100 L26,100 Z', '#38bdf8') +
      rc(26, 40, 68, 8, '#fdfdff', 0, 'opacity=".55"') +
      rc(26, 58, 68, 6, '#fdfdff', 0, 'opacity=".4"') +
      rc(26, 26, 68, 8, '#0ea5e9', 2),
      { bg: '#eef4ff' });
  };

  map.soap = function () {
    return scene(
      rc(34, 44, 52, 42, '#fbcfe8', 12) +
      e(60, 44, 26, 9, '#fde7f3') +
      c(84, 26, 5, '#fbcfe8', 'opacity=".8"') + c(96, 36, 3.4, '#fbcfe8', 'opacity=".7"') +
      c(30, 32, 3.4, '#fbcfe8', 'opacity=".7"') +
      e(46, 58, 10, 6, '#ffffff', 'opacity=".45"'),
      { bg: '#eef4ff' });
  };

  map.brush = function () {
    return scene(
      rc(52, 52, 16, 40, '#8a5a33', 4) +
      rc(44, 84, 32, 12, '#cbd5e1', 3) +
      rc(42, 94, 36, 12, '#0ea5e9', 3) +
      rc(46, 18, 28, 36, '#8a5a33', 4) +
      rc(46, 18, 7, 36, '#a9754a', 1) + rc(56, 18, 7, 36, '#a9754a', 1) + rc(66, 18, 7, 36, '#a9754a', 1),
      { bg: '#eef4ff' });
  };

  map.comb = function () {
    return scene(
      rc(20, 42, 80, 18, '#4a3a2a', 6) +
      rc(24, 58, 6, 36, '#4a3a2a', 3) + rc(36, 58, 6, 36, '#4a3a2a', 3) +
      rc(48, 58, 6, 36, '#4a3a2a', 3) + rc(60, 58, 6, 36, '#4a3a2a', 3) +
      rc(72, 58, 6, 36, '#4a3a2a', 3) + rc(84, 58, 6, 36, '#4a3a2a', 3),
      { bg: '#eef4ff' });
  };

  map.mirror = function () {
    return scene(
      e(60, 52, 34, 40, '#cbd5e1') +
      e(60, 52, 29, 35, '#dbeafe') +
      p('M44,40 C52,26 70,26 76,32 L60,58 Z', '#ffffff', 'opacity=".7"') +
      rc(54, 90, 12, 14, '#94a3b8', 4) + e(60, 104, 22, 6, '#94a3b8'),
      { bg: '#eef4ff' });
  };

  map.lamp = function () {
    return scene(
      p('M34,20 L86,20 L98,54 L22,54 Z', '#f59e0b') +
      p('M40,26 L80,26 L88,48 L32,48 Z', '#fde68a') +
      ps('M60,54 L60,88', '#64748b', 4) +
      e(60, 92, 24, 6, '#475569') +
      c(60, 62, 8, '#fef3c7', 'opacity=".5"'),
      { bg: '#eef4ff' });
  };

  map.candle = function () {
    return scene(
      rc(46, 40, 28, 56, '#fdf6ea', 4) +
      rc(46, 62, 28, 5, '#e0453f', 0) + rc(46, 78, 28, 5, '#e0453f', 0) +
      p('M60,20 C68,28 70,34 60,40 C50,34 52,28 60,20 Z', '#f59e0b') +
      p('M60,26 C64,30 65,33 60,36 C55,33 56,30 60,26 Z', '#fde68a') +
      e(60, 98, 26, 6, '#cbd5e1'),
      { bg: '#eef4ff' });
  };

  map.scissors = function () {
    return scene(
      ps('M46,20 L74,72', '#94a3b8', 4.4) + ps('M74,20 L46,72', '#94a3b8', 4.4) +
      c(46, 20, 5, '#cbd5e1') + c(74, 20, 5, '#cbd5e1') +
      c(42, 88, 11, 'none', 'stroke="#e0453f" stroke-width="5"') +
      c(78, 88, 11, 'none', 'stroke="#e0453f" stroke-width="5"'),
      { bg: '#eef4ff' });
  };

  map.hammer = function () {
    return scene(
      '<g transform="rotate(30 60 60)">' +
      rc(54, 40, 12, 60, '#8a5a33', 4) +
      rc(34, 26, 52, 18, '#64748b', 3) +
      rc(30, 20, 20, 30, '#94a3b8', 4) +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.screwdriver = function () {
    return scene(
      '<g transform="rotate(30 60 60)">' +
      rc(52, 22, 16, 30, '#f97316', 4) +
      rc(50, 14, 20, 12, '#ea580c', 3) +
      rc(56, 52, 8, 46, '#cbd5e1', 2) +
      p('M56,98 64,98 60,110  Z', '#94a3b8') +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.ruler = function () {
    return scene(
      '<g transform="rotate(-24 60 60)">' +
      rc(12, 48, 96, 24, '#fbbf24', 3) +
      ln(28, 48, 28, 60, '#8a6a2a', 2) + ln(44, 48, 44, 64, '#8a6a2a', 2) +
      ln(60, 48, 60, 60, '#8a6a2a', 2) + ln(76, 48, 76, 64, '#8a6a2a', 2) +
      ln(92, 48, 92, 60, '#8a6a2a', 2) +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.pencil = function () {
    return scene(
      '<g transform="rotate(30 60 60)">' +
      rc(50, 14, 20, 60, '#fbbf24', 2) +
      rc(50, 14, 7, 60, '#e0453f', 1) + rc(63, 14, 7, 60, '#3b82f6', 1) +
      p('M50,74 70,74 60,96  Z', '#f5d9a8') +
      p('M56,86 64,86 60,96  Z', '#2f2a3d') +
      rc(50, 8, 20, 8, '#94a3b8', 2) +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.pen = function () {
    return scene(
      '<g transform="rotate(30 60 60)">' +
      rc(54, 16, 12, 56, '#1e3a8a', 5) +
      p('M54,72 66,72 60,86  Z', '#cbd5e1') +
      p('M57,78 63,78 60,86  Z', '#2f2a3d') +
      rc(52, 10, 16, 8, '#fbbf24', 2) +
      rc(54, 44, 12, 5, '#fbbf24', 0) +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.eraser = function () {
    return scene(
      '<g transform="rotate(-16 60 60)">' +
      rc(28, 42, 64, 30, '#f472b6', 3) +
      p('M28,42 L52,42 L52,72 L28,72 Z', '#fdfdff') +
      p('M52,42 L92,42 L92,72 L52,72 Z', '#fb7185') +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.backpack = function () {
    return scene(
      p('M32,44 C32,26 88,26 88,44 L88,96 C88,102 32,102 32,96 Z', '#2563eb') +
      p('M40,44 C40,32 80,32 80,44 L80,68 C80,74 40,74 40,68 Z', '#1d4ed8') +
      rc(44, 74, 32, 16, '#3b82f6', 3) + ln(60, 78, 60, 88, '#93c5fd', 2.4) +
      ps('M40,30 C30,30 28,44 32,54', '#1d4ed8', 4) + ps('M80,30 C90,30 92,44 88,54', '#1d4ed8', 4),
      { bg: '#eef4ff' });
  };

  map.suitcase = function () {
    return scene(
      rc(22, 38, 76, 58, '#8a5a33', 6) +
      rc(22, 52, 76, 8, '#6b4423', 2) +
      ps('M48,38 C48,26 72,26 72,38', '#4a3a2a', 4) +
      rc(38, 62, 44, 10, '#a9754a', 3) + c(60, 67, 3, '#fcd34d') +
      rc(22, 44, 8, 12, '#6b4423', 2) + rc(90, 44, 8, 12, '#6b4423', 2),
      { bg: '#eef4ff' });
  };

  map.ladder = function () {
    return scene(
      '<g transform="rotate(-8 60 60)">' +
      rc(34, 16, 9, 88, '#c98a4b', 3) + rc(77, 16, 9, 88, '#c98a4b', 3) +
      rc(36, 30, 48, 7, '#a9754a', 2) + rc(36, 52, 48, 7, '#a9754a', 2) +
      rc(36, 74, 48, 7, '#a9754a', 2) +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.broom = function () {
    return scene(
      '<g transform="rotate(24 60 60)">' +
      rc(56, 14, 8, 56, '#a9754a', 3) +
      p('M44,66 L76,66 L82,100 L38,100 Z', '#e8c98a') +
      ln(46, 74, 46, 100, '#c9a06a', 2) + ln(54, 74, 54, 100, '#c9a06a', 2) +
      ln(62, 74, 62, 100, '#c9a06a', 2) + ln(70, 74, 70, 100, '#c9a06a', 2) +
      rc(42, 62, 36, 6, '#8a5a33', 2) +
      '</g>',
      { bg: '#eef4ff' });
  };

  map.basket = function () {
    return scene(
      p('M24,52 L96,52 C94,84 80,100 60,100 C40,100 26,84 24,52 Z', '#c98a4b') +
      ps('M30,52 C30,26 90,26 90,52', '#a9754a', 5) +
      ln(24, 66, 96, 66, '#a9754a', 3) +
      ps('M36,52 L36,86 M60,52 L60,96 M84,52 L84,86', '#a9754a', 2, 'opacity=".6"'),
      { bg: '#eef4ff' });
  };

  map.box = function () {
    return scene(
      p('M20,44 L60,24 L100,44 L100,92 L20,92 Z', '#c98a4b') +
      p('M20,44 L60,64 L100,44 L60,24 Z', '#e0b17f') +
      p('M60,64 L100,44 L100,92 L60,112 Z', '#a9754a') +
      rc(52, 66, 16, 10, '#fdfdff', 1, 'opacity=".85"'),
      { bg: '#eef4ff' });
  };

  /* ========================================================== sports (13) */

  map.football = function () {
    return scene(
      e(60, 96, 34, 8, '#cbd5e1') +
      c(60, 60, 32, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      pl('60,40 76,50 70,68 50,68 44,50', '#2f3b4d') +
      ps('M60,40 L60,96 M44,50 L82,86 M76,50 L38,86', '#2f3b4d', 2.4) +
      c(46, 42, 6, '#ffffff', 'opacity=".5"'),
      { bg: '#f0fdf4' });
  };

  map.basketball = function () {
    return scene(
      e(60, 96, 34, 8, '#cbd5e1') +
      c(60, 60, 32, '#f97316') +
      ps('M28,60 A32,32 0 0 0 92,60 M28,60 A32,32 0 0 1 92,60', '#7c2d12', 2.6) +
      ps('M60,28 C44,44 44,76 60,92 M60,28 C76,44 76,76 60,92', '#7c2d12', 2.6) +
      c(48, 44, 6, '#ffffff', 'opacity=".3"'),
      { bg: '#f0fdf4' });
  };

  map.tennis = function () {
    return scene(
      ps('M46,16 C58,40 60,60 56,78', '#94a3b8', 3.4) +
      e(60, 26, 15, 20, 'none', 'stroke="#cbd5e1" stroke-width="5"') +
      ps('M50,20 L70,32 M48,28 L66,40', '#e2e8f0', 1.6) +
      rc(44, 76, 24, 12, '#334155', 4) + rc(48, 86, 16, 8, '#4a3a2a', 3) +
      c(88, 60, 12, '#d9f99d', 'stroke="#84cc16" stroke-width="2"') +
      ps('M80,52 Q90,60 80,68 M96,52 Q88,60 96,68', '#ffffff', 2, 'opacity=".8"'),
      { bg: '#f0fdf4' });
  };

  map.volleyball = function () {
    return scene(
      e(60, 96, 34, 8, '#cbd5e1') +
      c(60, 58, 30, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      ps('M60,28 C44,42 42,74 60,88 M60,28 C76,42 78,74 60,88', '#94a3b8', 2.6) +
      ps('M32,52 C48,62 72,62 88,52 M32,66 C48,54 72,54 88,66', '#94a3b8', 2.6) +
      c(48, 44, 6, '#ffffff', 'opacity=".6"'),
      { bg: '#f0fdf4' });
  };

  map.golf = function () {
    return scene(
      e(60, 98, 36, 7, '#cbd5e1') +
      ps('M84,20 L52,84', '#cbd5e1', 4) +
      ps('M84,20 L80,40 L96,40 Z', '#cbd5e1', 3) +
      p('M84,20 C74,28 70,44 74,58 L96,58 C92,40 88,28 84,20 Z', '#94a3b8', 'opacity=".6"') +
      c(46, 90, 7, '#fdfdff', 'stroke="#94a3b8" stroke-width="1.6"'),
      { bg: '#f0fdf4' });
  };

  map.boxing = function () {
    return scene(
      e(60, 98, 34, 7, '#cbd5e1') +
      p('M26,52 C26,36 52,30 56,44 C60,58 50,72 38,70 C28,68 26,60 26,52 Z', '#dc2626') +
      p('M94,52 C94,36 68,30 64,44 C60,58 70,72 82,70 C92,68 94,60 94,52 Z', '#dc2626') +
      rc(48, 40, 24, 26, '#b91c1c', 5) + rc(53, 48, 14, 10, '#fca5a5', 3),
      { bg: '#f0fdf4' });
  };

  map.surfing = function () {
    return scene(
      p('M0,72 C16,58 26,58 40,68 C52,78 62,78 74,66 C86,54 100,56 120,68 L120,120 L0,120 Z', '#3f8fd6') +
      p('M0,90 C18,78 30,80 44,88 C58,96 70,96 82,86 C96,74 108,76 120,84 L120,120 L0,120 Z', '#5ba8f5') +
      '<g transform="rotate(-18 60 56)">' +
      p('M44,20 C56,16 68,26 66,42 C64,58 52,66 42,62 C50,54 52,36 44,20 Z', '#f97316') +
      '</g>' +
      person(88, 44, { scale: 0.5, shirt: '#0f172a', hair: '#2f2a24', arms: false }) +
      ps('M78,58 C86,54 92,58 96,64', SKIN, 4),
      { bg: '#f0fdf4' });
  };

  map.skating = function () {
    return scene(
      e(60, 98, 36, 7, '#cbd5e1') +
      p('M20,84 L92,84 L96,98 L16,98 Z', '#334155') +
      c(24, 84, 7, '#94a3b8') + c(88, 84, 7, '#94a3b8') +
      rc(36, 62, 44, 20, '#4a3a2a', 6) +
      person(58, 30, { scale: 0.62, shirt: '#e0453f', hair: '#3a2f2a', arms: false }) +
      ps('M42,52 C34,48 30,54 28,60', SKIN, 4.4) + ps('M74,52 C82,48 86,54 88,60', SKIN, 4.4),
      { bg: '#f0fdf4' });
  };

  map.skiing = function () {
    return scene(
      p('M0,78 C16,68 28,70 42,78 C56,86 70,86 84,78 C98,70 110,72 120,78 L120,120 L0,120 Z', '#fdfdff') +
      '<g transform="rotate(-8 60 60)">' +
      p('M28,74 C48,66 74,66 92,74 C94,80 90,84 84,82 L32,82 C26,82 24,78 28,74 Z', '#ef4444') +
      '</g>' +
      person(60, 40, { scale: 0.62, shirt: '#0ea5e9', hair: '#3a2f2a', arms: false }) +
      ps('M44,60 C34,52 30,60 26,66', SKIN, 4.4) + ps('M76,60 C86,52 90,60 94,66', SKIN, 4.4) +
      ps('M70,26 L78,14', '#64748b', 3),
      { bg: '#f0fdf4' });
  };

  map.cycling = function () {
    return scene(
      e(60, 98, 36, 7, '#cbd5e1') +
      c(32, 78, 17, 'none', 'stroke="#334155" stroke-width="4"') +
      c(88, 78, 17, 'none', 'stroke="#334155" stroke-width="4"') +
      ps('M32,78 L50,78 L62,52 L84,52 M50,78 L62,52 M62,52 L72,44', '#ef4444', 3.4) +
      c(72, 42, 4, '#334155') +
      person(62, 30, { scale: 0.55, shirt: '#16a34a', hair: '#3a2f2a', arms: false, legs: false }) +
      ps('M56,44 L64,46 M68,44 L76,42', SKIN, 3.6),
      { bg: '#f0fdf4' });
  };

  map.swimming = function () {
    return scene(
      p('M0,74 C14,66 24,82 38,74 C52,66 62,82 76,74 C90,66 104,82 120,74 L120,120 L0,120 Z', '#3f8fd6') +
      p('M0,90 C16,82 28,94 44,88 C60,82 72,94 88,88 C102,82 112,92 120,88 L120,120 L0,120 Z', '#5ba8f5') +
      c(50, 52, 14, SKIN) + p('M36,50 C36,36 64,36 64,50 Z', '#e0453f') +
      rc(40, 48, 10, 7, '#38bdf8', 3) + rc(52, 48, 10, 7, '#38bdf8', 3) +
      ps('M40,66 C28,70 24,80 26,88', SKIN, 6) + c(26, 90, 4, SKIN),
      { bg: '#f0fdf4', ground: false });
  };

  map.yoga = function () {
    return scene(
      e(60, 98, 36, 7, '#cbd5e1') +
      person(60, 40, { scale: 0.82, shirt: '#8b5cf6', smile: true, hair: '#3f2f28', legs: false }) +
      ps('M44,58 C30,66 24,80 34,88 C44,94 56,86 60,74', '#8b5cf6', 7) +
      ps('M76,58 C90,66 96,80 86,88 C76,94 64,86 60,74', '#8b5cf6', 7) +
      c(60, 76, 6, '#8b5cf6') +
      c(52, 42, 2, NIGHT) + c(68, 42, 2, NIGHT) +
      ps('M55,48 Q60,52 65,48', '#7c3aed', 2),
      { bg: '#f0fdf4' });
  };

  map.dancing = function () {
    return scene(
      c(60, 16, 3, '#fbbf24') + c(26, 26, 2.4, '#fbbf24') + c(96, 24, 2.4, '#fbbf24') +
      person(36, 46, { scale: 0.78, shirt: '#e0457b', arms: false, smile: true, longHair: true, hair: '#3f2f28' }) +
      person(86, 46, { scale: 0.78, shirt: '#7c3aed', arms: false, smile: true, hair: '#2b2118' }) +
      ps('M32,60 C22,50 20,42 24,36', '#e0457b', 5) + c(24, 34, 3.4, SKIN) +
      ps('M42,60 C50,50 50,42 46,36', '#e0457b', 5) + c(46, 34, 3.4, SKIN) +
      ps('M80,60 C72,50 72,42 76,36', '#7c3aed', 5) + c(76, 34, 3.4, SKIN) +
      ps('M90,60 C98,50 98,42 94,36', '#7c3aed', 5) + c(94, 34, 3.4, SKIN) +
      c(60, 36, 5, '#3f3a4d') + ln(65, 36, 65, 24, '#3f3a4d', 2.6),
      { bg: '#f0fdf4' });
  };

  /* =========================================================== music (11) */

  map.guitar = function () {
    return scene(
      '<g transform="rotate(-16 60 60)">' +
      e(60, 40, 22, 24, '#a9754a') + e(60, 76, 17, 20, '#8a5a33') +
      c(60, 40, 7, '#4a2c17') +
      rc(56, 6, 8, 34, '#6b4423', 2) + rc(52, 2, 16, 8, '#3f2a1a', 2) +
      ln(58, 10, 58, 34, '#cbd5e1', 1.2) + ln(62, 10, 62, 34, '#cbd5e1', 1.2) +
      '</g>',
      { bg: '#fdf2f8' });
  };

  map.piano = function () {
    return scene(
      p('M12,32 L108,32 L108,96 L12,96 Z', '#2f2a3d') +
      p('M12,32 L108,32 L108,40 L12,40 Z', '#4a4453') +
      rc(16, 64, 92, 32, '#fdfdff') +
      rc(20, 64, 10, 20, '#1a1720') + rc(36, 64, 10, 20, '#1a1720') +
      rc(52, 64, 10, 20, '#1a1720') + rc(68, 64, 10, 20, '#1a1720') + rc(84, 64, 10, 20, '#1a1720') +
      rc(30, 64, 8, 12, '#3f3a4d') + rc(46, 64, 8, 12, '#3f3a4d') +
      rc(62, 64, 8, 12, '#3f3a4d') + rc(78, 64, 8, 12, '#3f3a4d'),
      { bg: '#fdf2f8' });
  };

  map.drum = function () {
    return scene(
      p('M26,44 L94,44 L90,96 L30,96 Z', '#dc2626') +
      e(60, 44, 34, 10, '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      e(60, 44, 26, 7, '#f1f5f9') +
      ps('M34,52 L42,92 M50,52 L52,94 M66,52 L66,94 M82,52 L78,92', '#fca5a5', 2) +
      ps('M20,26 L48,40', '#a9754a', 4) + c(20, 24, 5, '#c98a4b') +
      ps('M100,26 L72,40', '#a9754a', 4) + c(100, 24, 5, '#c98a4b'),
      { bg: '#fdf2f8' });
  };

  map.flute = function () {
    return scene(
      '<g transform="rotate(-18 60 60)">' +
      rc(16, 52, 88, 14, '#cbd5e1', 7, 'stroke="#94a3b8" stroke-width="2"') +
      rc(92, 46, 12, 26, '#e2e8f0', 5) +
      c(30, 59, 3, '#64748b') + c(44, 59, 3, '#64748b') + c(58, 59, 3, '#64748b') +
      c(72, 59, 3, '#64748b') + c(84, 59, 2.4, '#64748b') +
      '</g>',
      { bg: '#fdf2f8' });
  };

  map.violin = function () {
    return scene(
      e(60, 50, 18, 22, '#a9754a') + e(60, 82, 22, 20, '#8a5a33') +
      c(60, 50, 6, '#4a2c17') +
      rc(57, 6, 6, 28, '#6b4423', 2) + c(60, 6, 6, '#3f2a1a') +
      ps('M84,44 C98,48 100,62 90,68', '#a9754a', 3.4) +
      ln(58, 12, 58, 44, '#cbd5e1', 1.2) + ln(62, 12, 62, 44, '#cbd5e1', 1.2),
      { bg: '#fdf2f8' });
  };

  map.trumpet = function () {
    return scene(
      '<g transform="rotate(-14 60 60)">' +
      rc(20, 54, 52, 10, '#fbbf24', 4) +
      c(84, 59, 16, '#f59e0b') + c(84, 59, 9, '#78350f') +
      rc(30, 44, 8, 12, '#fcd34d', 2) + rc(46, 44, 8, 12, '#fcd34d', 2) +
      rc(14, 52, 10, 14, '#f59e0b', 3) +
      '</g>',
      { bg: '#fdf2f8' });
  };

  map.saxophone = function () {
    return scene(
      ps('M74,14 C90,14 96,30 90,44 C84,58 88,74 78,86 L62,92', '#fbbf24', 9) +
      ps('M74,14 C88,14 93,30 87,44', '#fde68a', 3, 'opacity=".7"') +
      rc(60, 76, 20, 10, '#f59e0b', 4, 'transform="rotate(20 70 81)"') +
      c(60, 92, 6, '#f59e0b') +
      c(78, 22, 3, '#78350f') + c(86, 40, 3, '#78350f'),
      { bg: '#fdf2f8' });
  };

  map.harp = function () {
    return scene(
      p('M34,20 C34,20 30,80 44,98 L56,94 C42,76 44,44 44,28 Z', '#a9754a') +
      p('M34,20 C34,20 30,80 44,98 L56,94 C42,76 44,44 44,28 Z', '#c98a4b', 'opacity=".5"') +
      p('M42,28 C70,26 88,52 84,84 L74,86 C78,58 64,36 44,34 Z', '#8a5a33') +
      ln(46,32, 78,80, '#e8dcc0', 1.4) + ln(46,44, 76,82, '#e8dcc0', 1.4) +
      ln(46,56, 72,84, '#e8dcc0', 1.4) + ln(46,68, 68,86, '#e8dcc0', 1.4) +
      ln(44,26, 32,20, '#8a5a33', 4),
      { bg: '#fdf2f8' });
  };

  map.accordion = function () {
    return scene(
      rc(14, 44, 30, 44, '#dc2626', 5) + rc(76, 44, 30, 44, '#dc2626', 5) +
      rc(44, 50, 32, 32, '#f1f5f9', 3) +
      ps('M44,58 L76,58 M44,66 L76,66 M44,74 L76,74', '#94a3b8', 2.6) +
      c(26, 52, 3.4, '#fdfdff') + c(26, 66, 3.4, '#fdfdff') + c(26, 80, 3.4, '#fdfdff') +
      c(92, 52, 3.4, '#fdfdff') + c(92, 66, 3.4, '#fdfdff') + c(92, 80, 3.4, '#fdfdff'),
      { bg: '#fdf2f8' });
  };

  map.music = function () {
    return scene(
      c(44, 76, 15, '#3f3a4d', 'transform="rotate(-18 44 76)"') +
      ln(57, 76, 92, 76, '#3f3a4d', 5) +
      ps('M92,30 C104,36 98,48 106,52', '#3f3a4d', 5) +
      c(44, 76, 15, '#3f3a4d', 'transform="rotate(-18 44 76)"') +
      c(40, 72, 5, '#ffffff', 'opacity=".25" transform="rotate(-18 44 76)"') +
      c(84, 22, 4, '#a855f7') + c(20, 34, 3, '#a855f7') + c(100, 60, 3, '#a855f7'),
      { bg: '#fdf2f8', ground: false });
  };

  map.song = function () {
    return scene(
      F.bubble(58, 46, 66, 40, '#fdfdff') +
      c(46, 52, 10, '#3f3a4d') + ln(56, 52, 82, 52, '#3f3a4d', 4) +
      ps('M82,20 C92,25 87,34 93,37', '#3f3a4d', 4) +
      c(46, 52, 4, '#ffffff', 'opacity=".25"') +
      c(20, 90, 3, '#a855f7') + c(96, 92, 3.4, '#a855f7'),
      { bg: '#fdf2f8', ground: false });
  };

  /* ========================================================== places (18) */

  var PBG = '#fafaf9';

  function houseLike(o) {
    return scene(
      F.building(60, 56, o) + (o.extra || ''),
      { bg: PBG });
  }

  map.city = function () {
    return scene(
      rc(6, 46, 30, 56, '#cbd5e1') + rc(40, 26, 32, 76, '#94a3b8') + rc(76, 56, 38, 46, '#cbd5e1') +
      rc(12, 54, 8, 8, '#f1f5f9') + rc(24, 54, 8, 8, '#f1f5f9') + rc(12, 70, 8, 8, '#f1f5f9') + rc(24, 70, 8, 8, '#f1f5f9') +
      rc(48, 36, 8, 9, '#f1f5f9') + rc(60, 36, 8, 9, '#f1f5f9') + rc(48, 54, 8, 9, '#f1f5f9') + rc(60, 54, 8, 9, '#f1f5f9') +
      rc(48, 72, 8, 9, '#f1f5f9') + rc(60, 72, 8, 9, '#f1f5f9') +
      rc(84, 66, 9, 9, '#f1f5f9') + rc(98, 66, 9, 9, '#f1f5f9') + rc(84, 82, 9, 9, '#f1f5f9') +
      p('M0,102 L120,102 L120,112 L0,112 Z', '#a8a29e') +
      ln(20, 102, 14, 112, '#fdfdff', 3) + ln(44, 102, 38, 112, '#fdfdff', 3) + ln(68, 102, 62, 112, '#fdfdff', 3),
      { bg: PBG });
  };

  map.park = function () {
    return scene(
      c(94, 26, 11, '#fcd34d') +
      p('M0,84 L120,84 L120,108 L0,108 Z', '#8fd48f') +
      rc(50, 56, 7, 30, '#8a5a33', 3) + c(50, 46, 17, '#4a9e4a') + c(38, 54, 11, '#3f8f4a') + c(62, 54, 11, '#3f8f4a') +
      rc(18, 76, 26, 5, '#a9754a', 2) + rc(20, 81, 5, 10, '#a9754a', 2) + rc(37, 81, 5, 10, '#a9754a', 2) +
      c(86, 74, 5, '#f472b6') + c(96, 78, 5, '#facc15') + c(86, 84, 5, '#e879f9') +
      ps('M74,92 C80,86 86,92 92,86', '#fdfdff', 1.6),
      { bg: PBG });
  };

  map.school = function () {
    return houseLike({
      wall: '#f1d9a8', roofColor: '#c2352f', w: 68, h: 50,
      extra: rc(56, 22, 6, 22, '#fdfdff', 2) + c(59, 26, 5, '#8ec6fb') +
        rc(46, 76, 28, 30, '#e8e4d8', 2) + ln(52, 76, 52, 106, '#94a3b8', 2) + ln(68, 76, 68, 106, '#94a3b8', 2)
    });
  };

  map.hospital = function () {
    return houseLike({
      wall: '#fdfdff', roofColor: '#94a3b8', w: 70, h: 50,
      extra: rc(52, 66, 16, 38, '#cbd5e1', 2) +
        rc(50, 78, 20, 5, '#e0453f') + rc(57.5, 72, 5, 17, '#e0453f')
    });
  };

  map.shop = function () {
    return houseLike({
      wall: '#f6e3c8', roofColor: '#0f766e', w: 68, h: 50,
      extra: p('M22,60 L98,60 L94,74 L26,74 Z', '#f97316') +
        ln(30,60,30,74,'#ffffff',3) + ln(44,60,44,74,'#ffffff',3) + ln(58,60,58,74,'#ffffff',3) + ln(72,60,72,74,'#ffffff',3) + ln(86,60,86,74,'#ffffff',3) +
        rc(36, 62, 12, 12, '#fdfdff', 2) + rc(72, 62, 12, 12, '#fdfdff', 2)
    });
  };

  map.beach = function () {
    return scene(
      c(90, 24, 12, '#fcd34d') +
      p('M0,66 L120,66 L120,88 L0,88 Z', '#3f8fd6') +
      ps('M0,70 C18,62 30,78 48,70 C66,62 78,78 96,70', '#8ec6fb', 3) +
      p('M0,88 L120,88 L120,120 L0,120 Z', '#f0d9a0') +
      p('M22,94 C40,80 60,80 78,94 Z', '#e8c98a') +
      ps('M22,94 C40,104 60,104 78,94', '#d9b570', 3) +
      rc(96, 62, 5, 30, '#8a5a33', 2) + p('M84,62 C90,52 106,52 112,62 Z', '#e0453f') +
      c(20, 104, 3, '#fdfdff'),
      { bg: PBG });
  };

  map.station = function () {
    return scene(
      rc(14, 52, 92, 50, '#dbe4ee', 3) +
      p('M8,52 L26,30 L94,30 L112,52 Z', '#334155') +
      rc(24, 64, 20, 20, '#8ec6fb', 2) + rc(50, 64, 20, 20, '#8ec6fb', 2) + rc(76, 64, 20, 20, '#8ec6fb', 2) +
      rc(46, 84, 28, 18, '#c2410c', 2) + rc(52, 88, 16, 8, '#fcd34d', 1.5) +
      p('M0,102 L120,102 L120,110 L0,110 Z', '#94a3b8') +
      rc(14, 98, 12, 5, '#475569', 1.5) + rc(40, 98, 12, 5, '#475569', 1.5) + rc(66, 98, 12, 5, '#475569', 1.5) + rc(92, 98, 12, 5, '#475569', 1.5),
      { bg: PBG });
  };

  map.airport = function () {
    return scene(
      c(94, 24, 11, '#fcd34d') +
      p('M0,80 L120,80 L120,100 L0,100 Z', '#cbd5e1') +
      ps('M6,88 L40,88 M52,88 L86,88 M98,88 L116,88', '#fdfdff', 4) +
      p('M18,54 L60,54 L74,44 L86,44 L86,52 L60,62 L18,62 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"') +
      p('M34,54 L46,32 L56,32 L50,54 Z', '#cbd5e1') +
      c(20, 58, 3, '#334155') + c(78, 58, 3, '#334155') +
      c(34, 104, 3, '#94a3b8'),
      { bg: PBG });
  };

  map.library = function () {
    return houseLike({
      wall: '#e0d0f0', roofColor: '#7c3aed', w: 68, h: 50,
      extra: rc(36, 66, 12, 40, '#7c3aed', 2) + rc(50, 66, 12, 40, '#7c3aed', 2) + rc(64, 66, 12, 40, '#7c3aed', 2) +
        ln(42, 76, 42, 96, '#fdfdff', 1.6) + ln(56, 76, 56, 96, '#fdfdff', 1.6) + ln(70, 76, 70, 96, '#fdfdff', 1.6)
    });
  };

  map.museum = function () {
    return scene(
      p('M10,44 L110,44 L110,54 L10,54 Z', '#d1d5db') +
      p('M6,40 L114,40 L60,16 Z', '#b0b8c4') +
      c(60, 46, 6, '#fcd34d') +
      rc(22, 54, 12, 48, '#e7e5e4') + rc(48, 54, 12, 48, '#e7e5e4') + rc(74, 54, 12, 48, '#e7e5e4') + rc(98, 54, 0, 48, '#e7e5e4') +
      rc(86, 54, 12, 48, '#e7e5e4') +
      rc(14, 100, 92, 8, '#d1d5db', 2) +
      c(42, 74, 4, '#94a3b8') + c(78, 74, 4, '#94a3b8'),
      { bg: PBG });
  };

  map.farm = function () {
    return scene(
      p('M0,80 L120,80 L120,104 L0,104 Z', '#8fd48f') +
      p('M62,44 L96,44 L96,84 L62,84 Z', '#c2352f') +
      p('M56,44 L79,26 L102,44 Z', '#8a5a33') +
      rc(74, 58, 12, 26, '#fdfdff', 1.5) + ln(80, 58, 80, 84, '#cbd5e1', 1.6) +
      rc(30, 60, 30, 24, '#e7e5e4', 2) + rc(24, 52, 42, 10, '#94a3b8', 2) +
      ps('M22,66 L68,66 M22,74 L68,74', '#cbd5e1', 1.6) +
      c(96, 92, 3, '#fcd34d'),
      { bg: PBG });
  };

  map.restaurant = function () {
    return houseLike({
      wall: '#ffe0c2', roofColor: '#c2410c', w: 66, h: 50,
      extra: rc(30, 60, 24, 20, '#fdfdff', 2) + c(42, 70, 7, '#e0453f') +
        rc(62, 60, 4, 16, '#cbd5e1', 1.5) + ln(66, 60, 66, 70, '#cbd5e1', 1.5)
    });
  };

  map.hotel = function () {
    return scene(
      rc(24, 18, 72, 86, '#dbe4ee', 3) +
      p('M20,18 L100,18 L100,10 L20,10 Z', '#334155') +
      rc(32, 32, 18, 16, '#8ec6fb', 2) + rc(70, 32, 18, 16, '#8ec6fb', 2) +
      rc(32, 56, 18, 16, '#8ec6fb', 2) + rc(70, 56, 18, 16, '#8ec6fb', 2) +
      rc(48, 78, 24, 26, '#94a3b8', 2) + c(68, 92, 2.4, '#fcd34d') +
      c(60, 26, 4, '#fbbf24'),
      { bg: PBG });
  };

  map.bank = function () {
    return scene(
      p('M8,42 L112,42 L112,52 L8,52 Z', '#d1d5db') +
      p('M4,38 L116,38 L60,14 Z', '#94a3b8') +
      rc(20, 52, 14, 44, '#e7e5e4') + rc(46, 52, 14, 44, '#e7e5e4') + rc(72, 52, 14, 44, '#e7e5e4') + rc(96, 52, 0, 44, '#e7e5e4') +
      rc(88, 52, 14, 44, '#e7e5e4') +
      rc(12, 96, 96, 8, '#d1d5db', 2) +
      c(60, 36, 5, '#fbbf24') +
      ps('M50,44 L60,32 L70,44 Z', '#e0453f'),
      { bg: PBG });
  };

  map.church = function () {
    return scene(
      p('M20,58 L100,58 L100,104 L20,104 Z', '#e7e5e4') +
      p('M14,58 L60,20 L106,58 Z', '#94a3b8') +
      rc(52, 4, 16, 40, '#e7e5e4', 2) + p('M52,4 L60,0 L68,4 Z', '#c2410c') +
      rc(55, 12, 10, 20, '#e7e5e4', 1.5) + c(60, 22, 4, '#64748b') +
      rc(52, 78, 16, 26, '#8a5a33', 2) + c(64, 92, 2, '#fcd34d') +
      rc(26, 68, 12, 18, '#8ec6fb', 2) + rc(82, 68, 12, 18, '#8ec6fb', 2) +
      c(60, 68, 5, '#fcd34d'),
      { bg: PBG });
  };

  map.bridge = function () {
    return scene(
      p('M0,78 L120,78 L120,90 L0,90 Z', '#94a3b8') +
      ps('M4,78 C24,30 96,30 116,78', '#c2352f', 6) +
      ps('M4,78 L4,92 M116,78 L116,92 M60,42 L60,78', '#c2352f', 4) +
      p('M0,92 L120,92 L120,120 L0,120 Z', '#5ba8f5') +
      ps('M0,104 C20,98 34,110 54,104 C74,98 88,110 120,102', '#8ec6fb', 3),
      { bg: PBG });
  };

  map.road = function () {
    return scene(
      p('M0,20 L120,20 L120,60 L0,60 Z', '#8fd48f') +
      p('M40,52 L80,52 L96,120 L24,120 Z', '#4b5563') +
      ps('M60,58 L60,74 M60,82 L60,98 M60,106 L60,118', '#fcd34d', 4) +
      p('M0,20 L40,52 L0,52 Z', '#8fd48f') + p('M120,20 L80,52 L120,52 Z', '#8fd48f') +
      rc(18, 26, 4, 22, '#fdfdff', 1) + rc(98, 26, 4, 22, '#fdfdff', 1),
      { bg: PBG });
  };

  map.garden = function () {
    return scene(
      p('M0,74 L120,74 L120,108 L0,108 Z', '#8fd48f') +
      ps('M28,96 C28,72 28,60 28,52 M28,74 C18,68 16,58 24,54 M28,68 C38,62 40,52 32,48', '#4a9e4a', 3.4) +
      c(20, 50, 6, '#f472b6') + c(34, 44, 6, '#e879f9') + c(26, 36, 5, '#facc15') +
      ps('M76,96 C76,76 76,64 76,58 M76,82 C66,76 64,66 72,62 M76,78 C86,72 88,62 80,58', '#4a9e4a', 3.4) +
      c(68, 56, 6, '#fbbf24') + c(82, 50, 6, '#f97316') + c(74, 42, 5, '#ef4444') +
      c(58, 30, 4, '#facc15') + c(98, 62, 4, '#f472b6'),
      { bg: PBG });
  };

  /* ======================================================= transport (14) */

  var TBG = '#eff6ff';

  map.car = function () {
    return scene(F.carBody(60, 96, '#e0453f') + e(60, 108, 34, 6, '#94a3b8', 'opacity=".4"'), { bg: TBG });
  };

  map.bus = function () {
    return scene(
      rc(14, 34, 92, 54, '#f59e0b', 6) +
      rc(22, 42, 20, 18, '#cfe4f5', 2) + rc(48, 42, 20, 18, '#cfe4f5', 2) + rc(74, 42, 20, 18, '#cfe4f5', 2) +
      rc(22, 66, 76, 4, '#0f766e', 1) +
      F.wheels([[32, 90], [88, 90]], '#fcd34d') +
      e(60, 106, 36, 6, '#94a3b8', 'opacity=".4"'),
      { bg: TBG });
  };

  map.bicycle = function () {
    return scene(
      c(30, 78, 18, 'none', 'stroke="#334155" stroke-width="4"') +
      c(90, 78, 18, 'none', 'stroke="#334155" stroke-width="4"') +
      ps('M30,78 L50,78 L64,50 L86,50 M50,78 L64,50 M64,50 L76,42', '#e0453f', 3.4) +
      c(76, 40, 4, '#334155') +
      ps('M56,50 L60,40', '#64748b', 3) +
      e(60, 104, 34, 5, '#94a3b8', 'opacity=".4"'),
      { bg: TBG });
  };

  map.train = function () {
    return scene(
      p('M22,90 L22,40 C22,26 40,20 60,20 C80,20 98,26 98,40 L98,90 Z', '#3b82f6') +
      rc(32, 32, 22, 20, '#cfe4f5', 2) + rc(60, 32, 22, 20, '#cfe4f5', 2) +
      c(60, 66, 8, '#fcd34d') + rc(30, 78, 60, 6, '#1d4ed8', 2) +
      c(40, 92, 7, '#334155') + c(80, 92, 7, '#334155') +
      p('M0,104 L120,104 L120,112 L0,112 Z', '#94a3b8') +
      rc(6, 100, 12, 5, '#64748b', 1.5) + rc(32, 100, 12, 5, '#64748b', 1.5) +
      rc(58, 100, 12, 5, '#64748b', 1.5) + rc(84, 100, 12, 5, '#64748b', 1.5),
      { bg: TBG });
  };

  map.boat = function () {
    return scene(
      p('M16,72 L104,72 L92,96 L28,96 Z', '#c2410c') +
      p('M16,72 L104,72 L100,78 L20,78 Z', '#ea580c') +
      rc(56, 20, 6, 52, '#8a5a33', 2) +
      p('M62,24 L98,66 L62,66 Z', '#fdfdff') + p('M50,32 L28,66 L50,66 Z', '#e0453f') +
      c(20, 34, 4, '#8ec6fb', 'opacity=".8"') + c(30, 24, 3, '#8ec6fb', 'opacity=".7"'),
      { bg: TBG });
  };

  map.airplane = function () {
    return scene(
      p('M8,60 L34,52 L58,54 L74,40 L82,40 L72,56 L96,58 L104,64 L96,70 L72,70 L82,84 L74,84 L58,68 L34,70 L16,80 L8,74 L18,62 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="2"') +
      p('M30,58 L60,60 L74,62 L60,66 L30,66 Z', '#3b82f6') +
      c(96, 64, 3, '#334155') + c(104, 64, 3, '#334155') +
      c(36, 60, 2.4, '#8ec6fb') + c(44, 60, 2.4, '#8ec6fb') +
      c(20, 44, 4, '#ffffff', 'opacity=".7"') + c(12, 56, 3, '#ffffff', 'opacity=".6"'),
      { bg: TBG, ground: false });
  };

  map.motorcycle = function () {
    return scene(
      c(28, 80, 16, 'none', 'stroke="#334155" stroke-width="4.4"') +
      c(90, 80, 16, 'none', 'stroke="#334155" stroke-width="4.4"') +
      ps('M28,80 L48,80 L60,60 L82,60 M48,80 L60,60', '#dc2626', 4) +
      ps('M82,60 L92,60 L88,52', '#dc2626', 3) +
      rc(54, 46, 18, 12, '#1f2937', 4) + rc(56, 42, 14, 6, '#0f172a', 3) +
      e(60, 102, 30, 5, '#94a3b8', 'opacity=".4"'),
      { bg: TBG });
  };

  map.truck = function () {
    return scene(
      rc(10, 40, 62, 46, '#0ea5e9', 4) +
      p('M72,54 L94,54 L104,66 L104,86 L72,86 Z', '#0284c7') +
      p('M78,58 L92,58 L98,66 L78,66 Z', '#cfe4f5') +
      rc(10, 46, 62, 4, '#fdfdff', 1, 'opacity=".5"') +
      F.wheels([[28, 88], [86, 88]], '#e2e8f0') +
      e(60, 104, 36, 5, '#94a3b8', 'opacity=".4"'),
      { bg: TBG });
  };

  map.subway = function () {
    return scene(
      p('M0,26 C0,18 120,18 120,26 L120,34 L0,34 Z', '#cbd5e1') +
      rc(18, 40, 84, 50, '#1d4ed8', 8) +
      rc(26, 48, 28, 20, '#cfe4f5', 3) + rc(66, 48, 28, 20, '#cfe4f5', 3) +
      c(60, 78, 4, '#fcd34d') +
      c(34, 92, 7, '#334155') + c(86, 92, 7, '#334155') +
      p('M0,104 L120,104 L120,112 L0,112 Z', '#94a3b8'),
      { bg: TBG });
  };

  map.tram = function () {
    return scene(
      ps('M60,4 L60,18', '#64748b', 2.4) + e(60, 18, 8, 5, '#334155') +
      rc(24, 30, 72, 62, '#0d9488', 8) +
      rc(32, 40, 24, 24, '#cfe4f5', 3) + rc(64, 40, 24, 24, '#cfe4f5', 3) +
      rc(30, 70, 60, 5, '#fcd34d', 2) +
      c(40, 92, 6, '#334155') + c(80, 92, 6, '#334155') +
      p('M0,104 L120,104 L120,112 L0,112 Z', '#94a3b8'),
      { bg: TBG });
  };

  map.taxi = function () {
    return scene(
      F.carBody(60, 96, '#fbbf24') +
      rc(50, 62, 20, 12, '#1f2937', 3) + txt(60, 72, 'T', 9, '#fbbf24') +
      e(60, 108, 34, 6, '#94a3b8', 'opacity=".4"'),
      { bg: TBG });
  };

  map.helicopter = function () {
    return scene(
      rc(38, 6, 44, 5, '#334155', 2) + rc(58, 11, 4, 14, '#64748b', 2) +
      e(60, 50, 30, 20, '#3b82f6') +
      p('M88,50 L110,44 L114,58 L88,58 Z', '#1d4ed8') +
      ps('M30,54 C16,54 14,70 28,72', '#64748b', 3) +
      rc(20, 78, 8, 12, '#1f2937', 2) + rc(88, 78, 8, 12, '#1f2937', 2) +
      c(48, 46, 4, '#cfe4f5') + c(66, 46, 4, '#cfe4f5'),
      { bg: TBG });
  };

  map.rocket = function () {
    return scene(
      p('M60,8 C74,26 78,52 78,76 L78,90 L42,90 L42,76 C42,52 46,26 60,8 Z', '#fdfdff', 'stroke="#cbd5e1" stroke-width="2"') +
      c(60, 46, 9, '#38bdf8') +
      p('M42,62 L26,86 L42,86 Z', '#dc2626') + p('M78,62 L94,86 L78,86 Z', '#dc2626') +
      p('M48,90 L72,90 L66,110 L54,110 Z', '#f59e0b') +
      p('M52,92 L68,92 L64,104 L56,104 Z', '#fde68a') +
      c(20, 96, 3, '#f97316', 'opacity=".7"') + c(100, 92, 3, '#f97316', 'opacity=".6"'),
      { bg: TBG, ground: false });
  };

  map.ambulance = function () {
    return scene(
      rc(10, 40, 68, 46, '#fdfdff', 4) +
      p('M78,52 L98,52 L108,64 L108,86 L78,86 Z', '#e2e8f0') +
      p('M84,58 L96,58 L102,66 L84,66 Z', '#cfe4f5') +
      rc(36, 54, 8, 26, '#dc2626', 1.5) + rc(27, 62, 26, 8, '#dc2626', 1.5) +
      F.wheels([[28, 88], [88, 88]], '#cbd5e1') +
      e(60, 104, 36, 5, '#94a3b8', 'opacity=".4"'),
      { bg: TBG });
  };

  /* ======================================================= technology (11) */

  var XBG = '#f1f5f9';

  function monitor(x, y, w, h, screen) {
    return rc(x - w / 2, y, w, h, '#334155', 5) +
      rc(x - w / 2 + 6, y + 6, w - 12, h - 12, screen, 2) +
      rc(x - 6, y + h, 12, 8, '#475569', 2) + e(x, y + h + 10, 20, 4, '#475569');
  }

  map.computer = function () {
    return scene(
      monitor(60, 24, 78, 52, '#8ec6fb') +
      rc(34, 44, 18, 12, '#fdfdff', 2) + rc(52, 38, 12, 8, '#fdfdff', 2) + rc(68, 48, 16, 10, '#fdfdff', 2) +
      rc(20, 86, 80, 12, '#cbd5e1', 3) + rc(28, 88, 30, 8, '#94a3b8', 2) + rc(66, 88, 26, 8, '#94a3b8', 2) +
      e(60, 104, 30, 5, '#94a3b8', 'opacity=".5"'),
      { bg: XBG });
  };

  map.laptop = function () {
    return scene(
      rc(24, 24, 72, 50, '#334155', 5) + rc(30, 30, 60, 38, '#8ec6fb', 2) +
      c(60, 62, 4, '#94a3b8') +
      p('M14,80 L106,80 L116,98 L4,98 Z', '#cbd5e1') +
      rc(44, 84, 32, 7, '#94a3b8', 3) +
      e(60, 106, 36, 5, '#94a3b8', 'opacity=".5"'),
      { bg: XBG });
  };

  map.tablet = function () {
    return scene(
      rc(32, 14, 56, 84, '#334155', 8) + rc(38, 24, 44, 60, '#8ec6fb', 3) +
      c(60, 90, 4, '#94a3b8') +
      rc(46, 32, 16, 12, '#fdfdff', 2) + rc(66, 40, 12, 9, '#fdfdff', 2) + rc(46, 50, 28, 8, '#fdfdff', 2) +
      e(60, 106, 28, 5, '#94a3b8', 'opacity=".5"'),
      { bg: XBG });
  };

  map.television = function () {
    return scene(
      rc(12, 22, 96, 62, '#1f2937', 6) + rc(20, 30, 80, 46, '#8ec6fb', 2) +
      ps('M28,60 C40,44 52,68 64,50 C72,38 80,58 92,46', '#ffffff', 2.4, 'opacity=".8"') +
      c(96, 76, 2.4, '#ef4444') +
      rc(44, 84, 32, 6, '#374151', 2) + e(60, 96, 30, 4, '#374151') +
      e(60, 104, 34, 5, '#94a3b8', 'opacity=".5"'),
      { bg: XBG });
  };

  map.camera = function () {
    return scene(
      p('M20,52 L34,52 L40,40 L62,40 L68,52 L100,52 C104,52 106,56 106,60 L106,92 C106,96 104,98 100,98 L20,98 C16,98 14,96 14,92 L14,60 C14,56 16,52 20,52 Z', '#334155') +
      c(60, 74, 20, '#0f172a') + c(60, 74, 14, '#38bdf8') + c(60, 74, 8, '#1e3a8a') +
      c(60, 74, 4, '#ffffff', 'opacity=".6"') +
      rc(84, 56, 14, 8, '#f59e0b', 2) + c(28, 62, 3, '#f87171'),
      { bg: XBG });
  };

  map.radio = function () {
    return scene(
      rc(26, 46, 68, 50, '#0f766e', 5) +
      rc(34, 54, 32, 24, '#fdfdff', 2) + c(40, 84, 3, '#64748b') + c(48, 84, 3, '#64748b') +
      c(80, 62, 9, '#334155') + c(80, 62, 4, '#94a3b8') +
      ps('M44,46 L34,14', '#64748b', 3) + c(34, 12, 4, '#334155') +
      ps('M76,46 L86,14', '#64748b', 3) + c(86, 12, 4, '#334155'),
      { bg: XBG });
  };

  map.printer = function () {
    return scene(
      rc(24, 30, 72, 20, '#cbd5e1', 3) + rc(20, 48, 80, 34, '#e2e8f0', 4) +
      rc(36, 24, 48, 30, '#fdfdff', 2) + ln(44, 32, 76, 32, '#cbd5e1', 2) + ln(44, 40, 76, 40, '#cbd5e1', 2) +
      rc(32, 70, 56, 26, '#fdfdff', 2) + ln(40, 78, 80, 78, '#cbd5e1', 2) + ln(40, 86, 68, 86, '#cbd5e1', 2) +
      c(92, 58, 3, '#22c55e'),
      { bg: XBG });
  };

  map.speaker = function () {
    return scene(
      rc(30, 20, 60, 84, '#1f2937', 6) +
      c(60, 48, 20, '#334155') + c(60, 48, 13, '#0f172a') + c(60, 48, 5, '#475569') +
      c(60, 84, 11, '#334155') + c(60, 84, 6, '#0f172a') +
      c(60, 30, 3, '#f87171') +
      e(60, 106, 26, 4, '#94a3b8', 'opacity=".5"'),
      { bg: XBG });
  };

  map.screen = function () {
    return scene(
      rc(14, 20, 92, 62, '#334155', 5) + rc(21, 27, 78, 48, '#8ec6fb', 2) +
      ps('M30,58 C42,42 54,66 66,48 C74,36 82,56 94,44', '#ffffff', 2.4, 'opacity=".8"') +
      c(88, 34, 3, '#fcd34d') + c(34, 34, 2.4, '#fcd34d') +
      rc(48, 82, 24, 7, '#475569', 2) + e(60, 94, 30, 4, '#475569'),
      { bg: XBG, ground: false });
  };

  map.battery = function () {
    return scene(
      rc(20, 42, 80, 44, '#22c55e', 5) + rc(100, 56, 10, 16, '#16a34a', 3) +
      rc(28, 50, 36, 28, '#4ade80', 3) +
      pl('56,52 40,64 52,64 44,78 68,62 54,62 64,52', '#ffffff'),
      { bg: XBG });
  };

  map.charger = function () {
    return scene(
      rc(20, 44, 54, 46, '#0f172a', 6) + rc(74, 56, 8, 22, '#0f172a', 2) +
      pl('56,46 38,62 52,62 42,82 70,60 54,60 66,46', '#fbbf24') +
      ps('M84,44 C98,44 100,58 92,64', '#334155', 4) + c(94, 66, 4, '#334155') +
      e(50, 100, 28, 4, '#94a3b8', 'opacity=".5"'),
      { bg: XBG });
  };

  /* ============================================================= time (11) */

  var MBG = '#fefce8';

  function face(hands) {
    return c(60, 58, 38, '#fcd34d') + c(60, 58, 32, '#fdfdff') + hands;
  }

  var TICKS = '';
  (function () {
    for (var i = 0; i < 12; i++) {
      var a = (i * Math.PI) / 6;
      var r1 = i % 3 === 0 ? 25 : 28;
      TICKS += ln(60 + Math.cos(a) * r1, 58 + Math.sin(a) * r1,
                  60 + Math.cos(a) * 31, 58 + Math.sin(a) * 31, '#94a3b8', i % 3 === 0 ? 2.6 : 1.4);
    }
  })();

  map.hour = function () {
    return scene(face(TICKS + ln(60, 58, 60, 40, '#334155', 5) + c(60, 58, 4, '#334155')) +
      txt(60, 110, 'h', 14, '#854d0e'), { bg: MBG });
  };

  map.minute = function () {
    return scene(face(TICKS + ln(60, 58, 60, 84, '#334155', 3.4) + c(60, 58, 4, '#334155')) +
      txt(60, 110, 'm', 14, '#854d0e'), { bg: MBG });
  };

  map.second = function () {
    return scene(face(TICKS + ln(60, 58, 82, 44, '#e0453f', 2.4) + c(60, 58, 4, '#334155')) +
      c(82, 44, 3, '#e0453f') + txt(60, 110, 's', 14, '#854d0e'), { bg: MBG });
  };

  map.day = function () {
    var rays = '', i;
    for (i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      rays += ln(36 + Math.cos(a) * 21, 40 + Math.sin(a) * 21,
                 36 + Math.cos(a) * 27, 40 + Math.sin(a) * 27, '#f59e0b', 3);
    }
    return scene(
      c(36, 40, 16, '#fbbf24') + rays +
      p('M74,64 A22,22 0 1 0 74,42 A17,17 0 1 1 74,64 Z', '#cbd5e1') +
      c(92, 30, 3, '#fbbf24') + c(102, 46, 2.4, '#fbbf24') +
      ps('M14,90 C34,82 60,94 106,84', '#94a3b8', 3),
      { bg: MBG, ground: false });
  };

  map.week = function () {
    return scene(
      rc(20, 22, 80, 82, '#fdfdff', 5, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(20, 22, 80, 18, '#dc2626', 5) + rc(20, 34, 80, 6, '#dc2626', 0) +
      txt(60, 36, '7', 12, '#ffffff') +
      ln(30, 58, 90, 58, '#e2e8f0', 2) + ln(30, 72, 90, 72, '#e2e8f0', 2) + ln(30, 86, 90, 86, '#e2e8f0', 2) +
      rc(40, 50, 14, 8, '#22c55e', 2) + rc(64, 64, 14, 8, '#22c55e', 2) + rc(40, 78, 14, 8, '#22c55e', 2) +
      rc(64, 50, 14, 8, '#e2e8f0', 2) + rc(40, 64, 14, 8, '#e2e8f0', 2) + rc(64, 78, 14, 8, '#e2e8f0', 2),
      { bg: MBG });
  };

  map.month = function () {
    return scene(
      rc(22, 18, 76, 86, '#fdfdff', 5, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(22, 18, 76, 22, '#2563eb', 5) + rc(22, 32, 76, 8, '#2563eb', 0) +
      c(34, 24, 3, '#cbd5e1') + c(60, 24, 3, '#cbd5e1') + c(86, 24, 3, '#cbd5e1') +
      c(60, 62, 14, '#fbbf24', 'opacity=".6"') + c(60, 62, 8, '#f59e0b') +
      rc(32, 46, 10, 10, '#e2e8f0', 2) + rc(48, 46, 10, 10, '#e2e8f0', 2) +
      rc(64, 46, 10, 10, '#e2e8f0', 2) + rc(80, 46, 10, 10, '#e2e8f0', 2) +
      rc(32, 68, 10, 10, '#e2e8f0', 2) + rc(48, 68, 10, 10, '#e2e8f0', 2) +
      rc(64, 68, 10, 10, '#e2e8f0', 2) + rc(80, 68, 10, 10, '#e2e8f0', 2) +
      rc(32, 88, 10, 10, '#e2e8f0', 2) + rc(48, 88, 10, 10, '#e2e8f0', 2),
      { bg: MBG });
  };

  map.year = function () {
    return scene(
      rc(20, 20, 80, 84, '#fdfdff', 5, 'stroke="#cbd5e1" stroke-width="2"') +
      rc(20, 20, 80, 20, '#0f766e', 5) + rc(20, 32, 80, 8, '#0f766e', 0) +
      txt(60, 36, '365', 13, '#ffffff') +
      ps('M30,86 C48,74 72,74 90,86', '#94a3b8', 2.4) +
      rc(34, 52, 14, 14, '#e2e8f0', 2) + rc(54, 52, 14, 14, '#e2e8f0', 2) + rc(74, 52, 14, 14, '#e2e8f0', 2) +
      rc(34, 72, 14, 14, '#e2e8f0', 2) + rc(54, 72, 14, 14, '#22c55e', 2) + rc(74, 72, 14, 14, '#e2e8f0', 2) +
      c(60, 12, 4, '#fbbf24'),
      { bg: MBG });
  };

  map.morning = function () {
    var rays = '', i;
    for (i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      rays += ln(52 + Math.cos(a) * 23, 62 + Math.sin(a) * 23,
                 52 + Math.cos(a) * 29, 62 + Math.sin(a) * 29, '#f59e0b', 3);
    }
    return scene(
      c(52, 62, 18, '#fbbf24') + rays +
      p('M0,86 L120,86 L120,104 L0,104 Z', '#8fd48f') +
      ps('M52,90 C70,90 84,96 96,104', '#fbbf24', 3) +
      c(98, 40, 4, '#facc15') + c(88, 30, 3, '#facc15'),
      { bg: MBG });
  };

  map.afternoon = function () {
    var rays = '', i;
    for (i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      rays += ln(74 + Math.cos(a) * 25, 34 + Math.sin(a) * 25, 74 + Math.cos(a) * 31, 34 + Math.sin(a) * 31, '#f59e0b', 3);
    }
    return scene(
      c(74, 34, 20, '#fbbf24') +
      p('M0,86 L120,86 L120,104 L0,104 Z', '#8fd48f') +
      e(30, 96, 16, 4, '#000000', 'opacity=".12"') +
      rc(26, 78, 4, 8, '#4a9e4a', 1) + c(28, 74, 6, '#4a9e4a') +
      c(30, 100, 2, '#facc15'),
      { bg: MBG });
  };

  map.night = function () {
    return scene(
      p('M78,20 C56,28 50,54 62,74 C42,68 32,46 38,28 C44,10 68,4 82,14 C78,16 78,18 78,20 Z', '#fcd34d') +
      c(60, 34, 4, '#e5b93f') + c(70, 50, 3, '#e5b93f') +
      c(24, 26, 2.6, '#fde68a') + c(100, 34, 2.4, '#fde68a') + c(36, 60, 2, '#fde68a') +
      c(94, 68, 2.4, '#fde68a') + c(14, 46, 2, '#fde68a') +
      p('M0,92 C20,86 40,96 60,90 C80,84 100,94 120,88 L120,120 L0,120 Z', '#1e293b'),
      { bg: '#1e1b4b', ground: false });
  };

  map.noon = function () {
    var rays = '', i;
    for (i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      rays += ln(60 + Math.cos(a) * 23, 26 + Math.sin(a) * 23, 60 + Math.cos(a) * 29, 26 + Math.sin(a) * 29, '#f59e0b', 3);
    }
    return scene(
      ps('M14,88 C34,34 86,34 106,88', '#94a3b8', 3, 'stroke-dasharray="6 5"') +
      c(60, 26, 18, '#fbbf24') +
      rc(78, 66, 34, 34, '#334155', 4) + c(95, 78, 10, '#fdfdff') + ln(95, 78, 95, 70, '#334155', 2.4) +
      rc(88, 100, 14, 5, '#334155', 2) +
      p('M0,90 L120,90 L120,108 L0,108 Z', '#8fd48f'),
      { bg: MBG });
  };

  LLC.art.register(map);
})(window);
