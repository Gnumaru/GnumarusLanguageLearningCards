/*!
 * art-nouns.js - Artwork for the concrete nouns: animals, food, nature, body,
 * family, clothes and colours.
 *
 * Registered into the shared catalogue by art.js, which also provides the
 * shape vocabulary (LLC.art.d) and the parametric families (LLC.art.f).
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var d = LLC.art.d, F = LLC.art.f, person = LLC.art.person;
  var c = d.c, e = d.e, rc = d.rc, p = d.p, ps = d.ps, pl = d.pl, ln = d.ln, scene = d.scene;
  var SKIN = LLC.art.colors.SKIN, NIGHT = LLC.art.colors.NIGHT;

  var map = {};

  /* ======================================================= animals (14) */

  map.bear = function () {
    return scene(
      rc(34, 76, 13, 28, '#8a5a2b', 5) + rc(56, 78, 13, 26, '#8a5a2b', 5) +
      rc(76, 76, 13, 28, '#8a5a2b', 5) + rc(90, 78, 13, 26, '#8a5a2b', 5) +
      e(62, 72, 33, 25, '#a97244') +
      c(43, 28, 9, '#8a5a2b') + c(81, 28, 9, '#8a5a2b') +
      c(62, 44, 22, '#a97244') +
      e(62, 52, 12, 9, '#e8c9a0') + c(62, 46, 4, '#5a3a22') +
      c(53, 40, 2.4, NIGHT) + c(71, 40, 2.4, NIGHT) +
      ps('M56,56 Q62,62 68,56', '#7a5230', 2.2),
      { bg: '#fff1e0' });
  };

  map.tiger = function () {
    return scene(
      rc(32, 78, 12, 26, '#e8862c', 5) + rc(50, 80, 12, 24, '#e8862c', 5) +
      rc(72, 80, 12, 24, '#e8862c', 5) + rc(90, 78, 12, 26, '#e8862c', 5) +
      ps('M24,64 C10,60 8,78 16,86', '#e8862c', 5) +
      e(58, 72, 34, 22, '#f0932f') +
      ps('M40,54 L52,58 M40,66 L54,68 M64,58 L78,54 M66,70 L80,68 M44,80 L56,78', '#2f2a3d', 3.4) +
      e(58, 60, 30, 20, '#f5b04e', 'opacity=".55"') +
      c(88, 46, 19, '#f0932f') + c(76, 30, 7, '#f0932f') + c(100, 30, 7, '#f0932f') +
      c(86, 30, 4, '#2f2a3d') + c(100, 30, 4, '#2f2a3d') +
      e(88, 56, 11, 8, '#fdf1de') +
      p('M85,52 L91,52 L88,56 Z', '#8a4b20') +
      ps('M84,61 Q88,65 92,61', '#8a4b20', 1.8) +
      ln(74, 52, 64, 48, '#2f2a3d', 1.6) + ln(74, 56, 63, 56, '#2f2a3d', 1.6) +
      ln(102, 52, 112, 48, '#2f2a3d', 1.6) + ln(102, 56, 113, 56, '#2f2a3d', 1.6),
      { bg: '#fff1e0' });
  };

  map.monkey = function () {
    return scene(
      ps('M34,66 C14,62 10,88 26,92', '#8a5a3a', 5) +
      rc(40, 76, 11, 26, '#8a5a3a', 5) + rc(64, 76, 11, 26, '#8a5a3a', 5) +
      e(60, 70, 28, 22, '#a9724a') +
      e(60, 70, 18, 14, '#d9a066') +
      c(46, 48, 7, '#a9724a') + c(74, 48, 7, '#a9724a') +
      c(60, 48, 18, '#a9724a') +
      e(60, 52, 13, 12, '#e8c9a0') +
      c(54, 46, 2.2, NIGHT) + c(66, 46, 2.2, NIGHT) +
      e(60, 58, 9, 6, '#e0a0a0') + c(57, 58, 1.3, '#8a5a5a') + c(63, 58, 1.3, '#8a5a5a') +
      ps('M56,64 Q60,67 64,64', '#7a4a2a', 1.8),
      { bg: '#fff1e0' });
  };

  map.zebra = function () {
    return scene(
      rc(30, 78, 11, 26, '#e8e8ee', 5) + rc(46, 80, 11, 24, '#e8e8ee', 5) +
      rc(70, 80, 11, 24, '#e8e8ee', 5) + rc(88, 78, 11, 26, '#e8e8ee', 5) +
      ps('M22,62 C8,58 6,76 12,84', '#2f2a3d', 5) +
      e(56, 70, 34, 22, '#f4f4f8') +
      ps('M34,52 L44,56 M30,64 L42,66 M48,54 L60,58 M50,68 L62,70 M64,52 L76,56 M66,66 L78,68 M82,58 L92,62',
        '#2f2a3d', 4) +
      rc(80, 50, 8, 8, '#2f2a3d', 2) +
      p('M80,54 C88,46 96,42 104,42 L104,60 C96,60 88,58 80,60 Z', '#f4f4f8') +
      p('M80,50 C88,42 98,40 104,42 L102,50 C96,48 88,48 80,52 Z', '#2f2a3d') +
      c(96, 48, 2.2, NIGHT) +
      e(106, 50, 6, 4, '#2f2a3d', 'transform="rotate(-20 106 50)"') +
      e(103, 55, 5, 4, '#2f2a3d') + c(101, 54, 1, NIGHT) + c(105, 55, 1, NIGHT),
      { bg: '#fff1e0' });
  };

  map.giraffe = function () {
    return scene(
      rc(34, 76, 12, 28, '#e8b45c', 6) + rc(70, 76, 12, 28, '#e8b45c', 6) +
      e(60, 76, 34, 20, '#efc978') +
      c(38, 66, 8, '#c98a3a') + c(64, 62, 9, '#c98a3a') + c(82, 82, 8, '#c98a3a') + c(44, 86, 7, '#c98a3a') +
      rc(86, 30, 15, 40, '#efc978', 7) +
      c(92, 44, 7, '#c98a3a') + c(96, 62, 6, '#c98a3a') +
      c(94, 28, 13, '#f0d08a') +
      ln(89, 16, 89, 22, '#8a5a2b', 2.4) + c(89, 14, 3, '#8a5a2b') +
      ln(99, 16, 99, 22, '#8a5a2b', 2.4) + c(99, 14, 3, '#8a5a2b') +
      c(96, 32, 3.2, NIGHT) + c(102, 33, 3.2, NIGHT) +
      ps('M92,38 Q96,42 100,38', '#8a5a2b', 1.8) +
      ln(80, 34, 70, 30, '#8a5a2b', 2) + ln(102, 34, 112, 32, '#8a5a2b', 2),
      { bg: '#fff1e0' });
  };

  map.pig = function () {
    return scene(
      rc(34, 76, 11, 26, '#f2a8bd', 5) + rc(50, 78, 11, 24, '#f2a8bd', 5) +
      rc(72, 78, 11, 24, '#f2a8bd', 5) + rc(88, 76, 11, 26, '#f2a8bd', 5) +
      ps('M30,62 C18,60 16,74 20,80', '#e0899f', 4) +
      e(58, 72, 34, 22, '#f7bccb') +
      c(88, 48, 18, '#f7bccb') +
      p('M74,38 C68,26 80,24 84,32 Z', '#e0899f') + p('M100,36 C106,24 96,24 94,32 Z', '#e0899f') +
      e(88, 60, 11, 8, '#e0899f') +
      c(85, 60, 1.8, '#a35a70') + c(91, 60, 1.8, '#a35a70') +
      c(81, 46, 2.2, NIGHT) + c(95, 46, 2.2, NIGHT) +
      rc(60, 62, 8, 6, '#ffffff', 3, 'opacity=".5"'),
      { bg: '#fff1e0' });
  };

  map.duck = function () {
    return scene(
      e(56, 62, 28, 20, '#5ba8f5') +
      p('M28,66 C18,74 22,84 34,80 Z', '#3f8fd6') +
      c(84, 42, 15, '#5ba8f5') +
      pl('97,40 116,46 97,52', '#f2a63b') +
      c(87, 39, 2.4, NIGHT) + c(88, 38, .9, '#ffffff') +
      ps('M80,28 C86,20 96,22 96,30', '#3f8fd6', 4) +
      ps('M50,54 C40,48 44,38 54,44', '#3f8fd6', 5) +
      e(56, 84, 8, 4, '#f2a63b') +
      ps('M20,88 C34,82 44,92 58,88', '#8ec6fb', 3),
      { bg: '#fff1e0' });
  };

  map.goat = function () {
    var line = 'stroke="#ddd3bd" stroke-width="2"';
    return scene(
      rc(32, 78, 11, 26, '#f8f3e9', 5, line) + rc(48, 80, 11, 24, '#f8f3e9', 5, line) +
      rc(70, 80, 11, 24, '#f8f3e9', 5, line) + rc(86, 78, 11, 26, '#f8f3e9', 5, line) +
      ps('M24,62 C12,58 10,74 16,82', '#f8f3e9', 5) +
      e(56, 70, 34, 22, '#f8f3e9', line) +
      c(88, 44, 16, '#f8f3e9', line) +
      ps('M78,32 C72,20 82,16 87,26', '#8a6a4a', 3.4) +
      ps('M96,30 C102,18 110,22 106,32', '#8a6a4a', 3.4) +
      p('M79,34 C70,28 68,38 75,44 Z', '#f8f3e9', line) +
      e(101, 48, 6, 4, '#f8f3e9', 'transform="rotate(-24 101 48)"') +
      e(88, 50, 9, 7, '#f8f3e9', line) +
      c(92, 42, 2.4, NIGHT) +
      c(84, 46, 2.4, NIGHT) +
      ps('M88,58 L88,74', '#f8f3e9', 5) + c(88, 76, 3.4, '#f8f3e9'),
      { bg: '#fff1e0' });
  };

  map.mouse = function () {
    return scene(
      ps('M34,78 C12,80 10,66 26,64', '#a8a2b0', 3.4) +
      e(58, 78, 28, 19, '#b8b2c0') +
      c(88, 68, 18, '#c4becd') +
      c(76, 52, 10, '#d8d3de') + c(100, 52, 10, '#d8d3de') +
      c(76, 52, 5, '#f0a8b8') + c(100, 52, 5, '#f0a8b8') +
      c(93, 64, 2.2, NIGHT) +
      e(93, 74, 5, 3.6, '#f0a8b8') +
      ln(102, 72, 112, 68, '#a8a2b0', 1.2) + ln(102, 76, 112, 78, '#a8a2b0', 1.2) +
      c(30, 60, 1.6, '#d8d3de'),
      { bg: '#fff1e0' });
  };

  map.spider = function () {
    return scene(
      ps('M42,54 C22,44 20,26 32,22', '#4a4453', 2.6) +
      ps('M38,60 C16,58 10,42 20,36', '#4a4453', 2.6) +
      ps('M40,68 C20,72 12,86 20,94', '#4a4453', 2.6) +
      ps('M78,54 C98,44 100,26 88,22', '#4a4453', 2.6) +
      ps('M82,60 C104,58 110,42 100,36', '#4a4453', 2.6) +
      ps('M80,68 C100,72 108,86 100,94', '#4a4453', 2.6) +
      c(60, 46, 15, '#5a5468') +
      e(60, 76, 17, 14, '#4a4453') +
      c(56, 42, 2.6, '#e0453f') + c(64, 42, 2.6, '#e0453f') + c(60, 49, 2.2, '#e0453f') +
      c(56, 42, 1, '#ffffff') + c(64, 42, 1, '#ffffff') +
      c(60, 68, 4, '#6b6478'),
      { bg: '#fff1e0' });
  };

  map.crab = function () {
    return scene(
      ps('M36,66 C20,58 18,44 28,40', '#e0453f', 4) +
      ps('M84,66 C100,58 102,44 92,40', '#e0453f', 4) +
      ps('M40,76 C24,74 20,86 28,92', '#e0453f', 4) +
      ps('M80,76 C96,74 100,86 92,92', '#e0453f', 4) +
      ps('M44,84 C30,88 30,100 40,100', '#e0453f', 3.4) +
      ps('M76,84 C90,88 90,100 80,100', '#e0453f', 3.4) +
      e(60, 70, 28, 20, '#ef5350') +
      c(30, 36, 11, '#e0453f') + pl('19,30 31,32 29,44 17,42', '#e0453f') +
      c(90, 36, 11, '#e0453f') + pl('101,30 89,32 91,44 103,42', '#e0453f') +
      c(52, 64, 3, '#2f2a3d') + c(68, 64, 3, '#2f2a3d') +
      ps('M50,76 Q60,82 70,76', '#2f2a3d', 2.2) +
      ln(38, 56, 26, 48, '#e0453f', 2.2) + ln(82, 56, 94, 48, '#e0453f', 2.2),
      { bg: '#fff1e0' });
  };

  map.whale = function () {
    return scene(
      p('M14,66 C22,40 66,36 92,58 C70,80 26,84 14,66 Z', '#3f7fb5') +
      p('M92,58 L114,42 L114,74 Z', '#2f6fa8') +
      p('M52,42 C56,30 68,30 70,42 Z', '#2f6fa8') +
      p('M40,78 C44,86 56,86 58,78 Z', '#2f6fa8') +
      c(34, 54, 2.6, NIGHT) +
      ps('M26,60 Q32,66 38,60', '#2f6fa8', 2.4) +
      ps('M74,32 C76,18 70,14 66,8', '#bfe0f7', 4) +
      c(64, 6, 3.4, '#dbeafe') + c(72, 12, 2.4, '#dbeafe') +
      ps('M10,92 C26,86 34,98 50,92', '#8ec6fb', 3),
      { bg: '#e7f4ff', ground: false });
  };

  map.dolphin = function () {
    return scene(
      p('M18,74 C26,50 66,44 88,60 C70,82 32,88 18,74 Z', '#8fa3c0') +
      p('M88,60 L108,46 L106,72 Z', '#7a8fb0') +
      p('M54,50 C58,38 70,38 72,50 Z', '#7a8fb0') +
      p('M18,74 C8,72 6,84 14,88 Z', '#7a8fb0') +
      p('M30,70 C24,74 22,80 26,84 C32,82 36,76 34,72 Z', '#dbeafe') +
      c(34, 60, 2.6, NIGHT) +
      ps('M32,66 Q38,70 42,66', '#4a5a72', 2.2) +
      ps('M8,96 C24,90 34,102 50,96', '#8ec6fb', 3),
      { bg: '#e7f4ff', ground: false });
  };

  map.snail = function () {
    return scene(
      c(74, 74, 24, '#e08a3c') +
      ps('M74,74 C60,74 58,60 70,58 C80,56 86,66 78,72 C72,76 66,70 70,66', '#a45a15', 3.6) +
      p('M12,94 C28,80 56,80 78,88 C90,92 102,90 98,84 C94,80 86,82 84,88 C78,96 56,98 40,98 Z', '#f5d6a0') +
      ps('M18,88 C14,74 18,66 24,66', '#f5d6a0', 4.6) + c(24, 65, 3.6, SKIN) +
      ps('M28,86 C26,72 32,66 37,67', '#f5d6a0', 4.6) + c(37, 66, 3.6, SKIN) +
      p('M10,88 L2,84 L8,78 Z', '#f5d6a0') + p('M96,84 L104,78 L100,90 Z', '#f5d6a0'),
      { bg: '#fff1e0' });
  };

  /* ========================================================== food (31) */

  map.orangefruit = function () {
    return scene(
      F.roundFruit(60, 66, 26, '#f97316', '#4a9e4a') +
      c(50, 56, 4, '#ffffff', 'opacity=".35"'),
      { bg: '#fff0ee' });
  };

  map.lemon = function () {
    return scene(
      '<g transform="rotate(-20 60 62)">' +
      e(60, 62, 34, 22, '#f5d33c') +
      e(60, 62, 30, 18, '#fbe68a') +
      '</g>' +
      F.citrusSlice(94, 84, 18, '#f5d33c', '#fbe68a'),
      { bg: '#fff0ee' });
  };

  map.strawberry = function () {
    return scene(
      p('M60,32 C86,32 96,58 60,96 C24,58 34,32 60,32 Z', '#e0453f') +
      pl('60,18 78,30 68,38 60,32 52,38 42,30', '#4a9e4a') +
      c(46, 48, 2, '#fde68a') + c(60, 44, 2, '#fde68a') + c(74, 48, 2, '#fde68a') +
      c(40, 62, 2, '#fde68a') + c(60, 60, 2, '#fde68a') + c(80, 62, 2, '#fde68a') +
      c(50, 74, 2, '#fde68a') + c(70, 74, 2, '#fde68a') + c(60, 84, 2, '#fde68a') +
      c(50, 50, 3, '#ffffff', 'opacity=".3"'),
      { bg: '#fff0ee' });
  };

  map.pear = function () {
    return scene(
      p('M60,30 C50,30 48,42 52,50 C56,58 34,62 34,76 C34,90 46,98 60,98 C74,98 86,90 86,76 C86,62 64,58 68,50 C72,42 70,30 60,30 Z', '#c3d84a') +
      ps('M60,30 C60,22 62,16 66,10', '#7a5230', 3) +
      p('M64,24 C74,14 88,18 86,28 C84,36 70,32 64,24 Z', '#4a9e4a') +
      c(50, 76, 4, '#ffffff', 'opacity=".35"'),
      { bg: '#fff0ee' });
  };

  map.peach = function () {
    return scene(
      p('M60,34 C36,26 24,44 28,66 C32,90 48,102 60,94 C72,102 88,90 92,66 C96,44 84,26 60,34 Z', '#f79ab0') +
      ps('M60,34 C60,24 62,18 66,12', '#7a5230', 3.2) +
      p('M64,26 C76,14 92,20 88,32 C84,42 68,36 64,26 Z', '#4a9e4a') +
      ps('M60,38 C54,56 54,76 60,92', '#e87a95', 2.2) +
      c(46, 54, 4, '#ffffff', 'opacity=".3"'),
      { bg: '#fff0ee' });
  };

  map.pineapple = function () {
    return scene(
      p('M42,44 C30,26 34,16 44,22 C48,10 58,8 60,20 C66,8 78,12 78,24 C88,18 94,28 84,44 Z', '#4a9e4a') +
      p('M36,42 L84,42 L76,96 L44,96 Z', '#e8b45c') +
      ps('M44,54 L60,60 L44,66 M76,54 L60,60 L76,66 M46,72 L60,78 L46,84 M74,72 L60,78 L74,84 M52,88 L60,92 L68,88',
        '#c98a3a', 2.2),
      { bg: '#fff0ee' });
  };

  map.watermelon = function () {
    return scene(
      p('M10,64 A50,44 0 0 0 110,64 Z', '#4a9e4a') +
      p('M16,64 A44,38 0 0 0 104,64 Z', '#fdfdff') +
      p('M20,64 A40,34 0 0 0 100,64 Z', '#ef5350') +
      c(38, 60, 2.4, NIGHT) + c(60, 56, 2.4, NIGHT) + c(82, 60, 2.4, NIGHT) +
      c(48, 72, 2.4, NIGHT) + c(72, 72, 2.4, NIGHT) + c(60, 78, 2.4, NIGHT),
      { bg: '#fff0ee' });
  };

  map.cherry = function () {
    return scene(
      ps('M56,58 C56,40 68,32 78,26', '#5a8a3a', 2.6) +
      ps('M68,60 C70,44 76,34 78,26', '#5a8a3a', 2.6) +
      p('M78,26 C86,18 96,22 92,30', '#4a9e4a') +
      c(50, 70, 17, '#e0453f') + c(74, 72, 15, '#d93a35') +
      c(45, 64, 4, '#ffffff', 'opacity=".35"') + c(70, 67, 3.4, '#ffffff', 'opacity=".3"'),
      { bg: '#fff0ee' });
  };

  map.avocado = function () {
    return scene(
      p('M60,24 C78,32 84,56 78,78 C72,98 48,98 42,78 C36,56 42,32 60,24 Z', '#4a7a3a') +
      p('M60,32 C74,38 78,58 73,76 C68,92 52,92 47,76 C42,58 46,38 60,32 Z', '#c3d84a') +
      e(60, 72, 13, 12, '#8a5a2b') +
      c(55, 66, 3, '#ffffff', 'opacity=".28"'),
      { bg: '#fff0ee' });
  };

  map.olive = function () {
    return scene(
      F.roundFruit(48, 70, 16, '#6b7a3a', '#3f5a2a') +
      F.roundFruit(78, 62, 14, '#5a6b30', '#3f5a2a') +
      ps('M60,44 C58,34 60,28 64,24', '#7a5230', 2.4),
      { bg: '#fff0ee' });
  };

  map.potato = function () {
    return scene(
      p('M28,72 C28,54 48,44 68,48 C88,52 96,70 88,84 C80,98 52,100 36,90 C28,84 28,80 28,72 Z', '#c19a5b') +
      c(50, 62, 3, '#8a6a3a') + c(74, 70, 2.6, '#8a6a3a') + c(62, 86, 2.6, '#8a6a3a') +
      c(44, 80, 2, '#8a6a3a') +
      e(46, 60, 10, 6, '#ffffff', 'opacity=".25" transform="rotate(-20 46 60)"'),
      { bg: '#fff0ee' });
  };

  map.carrot = function () {
    return scene(
      p('M60,100 C48,90 42,64 48,42 L72,42 C78,64 72,90 60,100 Z', '#f2903c') +
      ps('M56,42 C50,28 40,22 32,22 M60,42 C60,26 60,18 60,14 M64,42 C70,28 80,22 88,22', '#4a9e4a', 3.4) +
      ps('M50,58 L70,56 M50,72 L72,70 M54,86 L68,84', '#d97a26', 2.4),
      { bg: '#fff0ee' });
  };

  map.onion = function () {
    return scene(
      p('M60,40 C40,40 30,58 34,76 C38,94 82,94 86,76 C90,58 80,40 60,40 Z', '#d9a8e0') +
      ps('M60,40 C60,30 60,22 60,16', '#8a7a3a', 3) +
      ps('M60,16 C68,8 76,12 70,20', '#6b8a3a', 3) +
      ps('M60,48 C48,62 46,78 50,88 M60,48 C72,62 74,78 70,88', '#b889c4', 2.2),
      { bg: '#fff0ee' });
  };

  map.garlic = function () {
    return scene(
      p('M60,32 C42,32 32,50 34,72 C36,92 84,92 86,72 C88,50 78,32 60,32 Z', '#f4e8ee') +
      ps('M60,32 C60,24 60,20 60,14', '#8a7a3a', 3) +
      ps('M46,60 C42,74 44,84 48,90 M60,56 C58,74 58,84 60,92 M74,60 C78,74 76,84 72,90', '#dcc4cc', 2.2) +
      ps('M60,10 C70,4 78,8 72,16', '#6b8a3a', 3),
      { bg: '#fff0ee' });
  };

  map.corn = function () {
    return scene(
      e(60, 60, 20, 36, '#f5d33c') +
      p('M40,60 C28,74 26,92 30,100 L48,80 Z', '#4a9e4a') +
      p('M80,60 C92,74 94,92 90,100 L72,80 Z', '#4a9e4a') +
      ps('M48,40 L52,48 M60,36 L60,46 M72,40 L68,48 M44,52 L50,58 M76,52 L70,58 M44,68 L50,66 M76,68 L70,66 M48,82 L54,80 M72,82 L66,80',
        '#c9a82a', 2),
      { bg: '#fff0ee' });
  };

  map.pepper = function () {
    return scene(
      p('M60,34 C84,34 96,50 92,70 C88,92 32,92 28,70 C24,50 36,34 60,34 Z', '#e0453f') +
      p('M52,32 C56,20 64,18 68,26 C64,20 58,22 56,30 Z', '#4a9e4a') +
      c(60, 28, 4, '#4a9e4a') +
      ps('M74,44 C82,50 84,62 80,72', '#f4796f', 3),
      { bg: '#fff0ee' });
  };

  map.lettuce = function () {
    return scene(
      p('M60,40 C34,36 20,58 28,78 C36,98 84,98 92,78 C100,58 86,36 60,40 Z', '#6bbf4a') +
      p('M60,46 C42,44 32,62 38,78 C44,92 76,92 82,78 C88,62 78,44 60,46 Z', '#8ed46a') +
      c(50, 66, 3, '#4a9e4a') + c(68, 70, 3, '#4a9e4a') + c(58, 82, 3, '#4a9e4a') +
      ps('M60,40 C60,32 60,28 60,24', '#4a9e4a', 3),
      { bg: '#fff0ee' });
  };

  map.cucumber = function () {
    return scene(
      '<g transform="rotate(-24 60 62)">' +
      rc(24, 48, 72, 28, '#3f8f4a', 14) +
      rc(24, 48, 72, 12, '#5cb85c', 14, 'opacity=".55"') +
      '</g>' +
      c(38, 56, 2, '#2f6b32') + c(58, 68, 2, '#2f6b32') + c(78, 56, 2, '#2f6b32'),
      { bg: '#fff0ee' });
  };

  map.mushroom = function () {
    return scene(
      p('M60,28 C32,28 16,46 18,60 C20,68 100,68 102,60 C104,46 88,28 60,28 Z', '#e0453f') +
      c(40, 46, 6, '#fdfdff') + c(62, 40, 5, '#fdfdff') + c(82, 50, 5, '#fdfdff') +
      rc(48, 66, 24, 30, '#f4ead8', 8) +
      e(60, 96, 20, 6, '#e0d4bc'),
      { bg: '#fff0ee' });
  };

  map.tea = function () {
    return scene(
      ps('M40,26 C44,18 34,14 38,6', '#94a3b8', 3) +
      ps('M56,24 C60,16 50,12 54,4', '#94a3b8', 3) +
      ps('M72,26 C76,18 66,14 70,6', '#94a3b8', 3) +
      ps('M74,52 C88,52 88,78 74,78', '#0f766e', 6) +
      ps('M74,56 C84,56 84,74 74,74', '#5eead4', 3) +
      p('M34,46 L70,46 L63,98 L41,98 Z', '#0f766e') +
      e(52, 46, 18, 5, '#134e4a') +
      e(46, 46, 13, 3.4, '#99f6e4', 'opacity=".7"') +
      e(52, 100, 30, 7, '#0d9488', 'opacity=".35"'),
      { bg: '#fff0ee' });
  };

  map.juice = function () {
    return scene(
      ln(62, 58, 82, 22, '#e0453f', 3.4) +
      F.glassOf(56, 100, '#f2903c', { w: 34, h: 56, fill: 0.72 }) +
      F.citrusSlice(88, 20, 12, '#f5d33c', '#fbe68a') +
      c(38, 46, 3, '#ffffff', 'opacity=".7"'),
      { bg: '#fff0ee' });
  };

  map.wine = function () {
    return scene(
      p('M36,24 L84,24 C84,48 74,58 74,70 L46,70 C46,58 36,48 36,24 Z', '#e2e8f0', 'opacity=".95"') +
      p('M39,30 L81,30 C81,48 72,56 72,66 L48,66 C48,56 39,48 39,30 Z', '#9f1239') +
      p('M42,34 L78,34 C78,48 70,54 70,64 L50,64 C50,54 42,48 42,34 Z', '#be123c') +
      ln(48, 70, 46, 84, '#cbd5e1', 3) + ln(72, 70, 74, 84, '#cbd5e1', 3) +
      e(60, 88, 28, 7, '#e2e8f0') +
      e(60, 85, 22, 5, '#cbd5e1') +
      c(50, 40, 4, '#ffffff', 'opacity=".3"'),
      { bg: '#fff0ee' });
  };

  map.beer = function () {
    return scene(
      rc(44, 34, 32, 62, '#f5a524', 5) +
      rc(44, 60, 32, 36, '#fbbf24', 3) +
      rc(44, 34, 32, 10, '#e8901a', 3) +
      rc(56, 28, 8, 8, '#cbd5e1', 2) +
      c(50, 74, 3, '#fdfdff', 'opacity=".7"') + c(56, 84, 2.4, '#fdfdff', 'opacity=".6"') +
      rc(50, 40, 20, 14, '#fdfdff', 2, 'opacity=".85"'),
      { bg: '#fff0ee' });
  };

  map.chocolate = function () {
    return scene(
      rc(20, 34, 80, 56, '#6b3f24', 6) +
      rc(24, 38, 72, 48, '#8a5a33', 4) +
      ln(60, 38, 60, 86, '#6b3f24', 3) + ln(24, 62, 96, 62, '#6b3f24', 3) +
      ln(42, 38, 42, 62, '#6b3f24', 2.4) + ln(78, 38, 78, 62, '#6b3f24', 2.4) +
      ln(42, 62, 42, 86, '#6b3f24', 2.4) + ln(78, 62, 78, 86, '#6b3f24', 2.4) +
      e(36, 44, 6, 4, '#ffffff', 'opacity=".18"'),
      { bg: '#fff0ee' });
  };

  map.candy = function () {
    return scene(
      p('M44,44 C20,34 10,60 32,60 L44,60 Z', '#f472b6') +
      p('M76,44 C100,34 110,60 88,60 L76,60 Z', '#f472b6') +
      e(60, 60, 20, 18, '#fb7185') +
      ps('M46,54 C54,50 66,50 74,54', '#ffffff', 2.4, 'opacity=".6"'),
      { bg: '#fff0ee' });
  };

  map.cookie = function () {
    return scene(
      e(60, 60, 34, 33, '#d9a05b') +
      e(60, 60, 30, 29, '#e8bd7d') +
      c(48, 50, 4, '#5a3a22') + c(72, 56, 4.4, '#5a3a22') + c(56, 74, 4, '#5a3a22') +
      c(76, 78, 3.4, '#5a3a22') + c(44, 66, 3, '#5a3a22') +
      c(64, 42, 3, '#5a3a22'),
      { bg: '#fff0ee' });
  };

  map.popcorn = function () {
    return scene(
      c(44, 40, 11, '#fdf3d4') + c(62, 34, 12, '#fdf3d4') + c(80, 42, 10, '#fdf3d4') +
      c(52, 54, 11, '#fdf3d4') + c(72, 56, 11, '#fdf3d4') + c(36, 54, 9, '#fdf3d4') +
      p('M30,52 L90,52 L80,100 L40,100 Z', '#e0453f') +
      p('M52,52 L60,100 L68,52 Z', '#fdfdff', 'opacity=".85"') +
      p('M36,52 L84,52 L80,66 L40,66 Z', '#b91c1c', 'opacity=".25"'),
      { bg: '#fff0ee' });
  };

  map.soup = function () {
    return scene(
      ps('M42,32 C46,24 36,20 40,12', '#94a3b8', 2.8) +
      ps('M60,30 C64,22 54,18 58,10', '#94a3b8', 2.8) +
      ps('M78,32 C82,24 72,20 76,12', '#94a3b8', 2.8) +
      e(60, 78, 27, 6, '#c2410c') +
      e(52, 76, 5, 2.4, '#f2903c') + c(68, 79, 3, '#4a9e4a') + c(58, 80, 2.4, '#4a9e4a') +
      p('M30,78 L90,78 C88,98 74,106 60,106 C46,106 32,98 30,78 Z', '#0f766e') +
      rc(26, 72, 68, 9, '#0d9488', 4) +
      e(60, 76, 27, 4, '#f97316') +
      e(44, 92, 8, 4, '#ffffff', 'opacity=".28" transform="rotate(-24 44 92)"'),
      { bg: '#fff0ee' });
  };

  map.sandwich = function () {
    return scene(
      p('M16,60 L60,20 L104,60 Z', '#e8c98a') +
      p('M22,60 L98,60 L98,66 L22,66 Z', '#6bbf4a') +
      p('M22,66 L98,66 L98,72 L22,72 Z', '#e0453f') +
      p('M24,72 L96,72 L96,78 L24,78 Z', '#f5d33c') +
      p('M16,78 L104,78 L104,84 L16,84 Z', '#e8c98a') +
      c(46, 42, 3, '#fdfdff', 'opacity=".5"') + c(66, 48, 3, '#fdfdff', 'opacity=".5"'),
      { bg: '#fff0ee' });
  };

  map.pizza = function () {
    return scene(
      p('M60,20 L104,92 L16,92 Z', '#e8c98a') +
      p('M60,32 L94,86 L26,86 Z', '#f5d33c') +
      c(60, 46, 6, '#e0453f') + c(48, 66, 5.4, '#e0453f') + c(72, 70, 5.4, '#e0453f') +
      c(60, 78, 5, '#e0453f') +
      c(60, 36, 2.4, '#5a8a3a') + c(40, 80, 2.4, '#5a8a3a') + c(82, 78, 2.4, '#5a8a3a'),
      { bg: '#fff0ee' });
  };

  map.pasta = function () {
    return scene(
      ps('M30,74 L90,74 C88,96 74,104 60,104 C46,104 32,96 30,74 Z', '#2563eb') +
      rc(26, 68, 68, 9, '#1d4ed8', 4) +
      e(60, 72, 27, 5, '#f5d33c') +
      ps('M38,66 C46,54 54,70 64,58 C72,48 80,64 86,56', '#f5d33c', 4) +
      ps('M36,76 C44,64 52,80 62,68 C70,58 78,74 84,66', '#fbe68a', 3.4) +
      ps('M40,58 C48,50 54,62 62,54', '#fde68a', 3) +
      ps('M70,32 L84,18', '#8a5a33', 3.4) +
      c(48, 60, 3, '#e0453f') + c(70, 54, 3, '#e0453f'),
      { bg: '#fff0ee' });
  };

  /* ======================================================== nature (16) */

  map.rainbow = function () {
    var arcs = '', cols = ['#e0453f', '#f2903c', '#f5d33c', '#4a9e4a', '#3f7fb5', '#7c3aed'], i;
    for (i = 0; i < 6; i++) {
      var r = 46 - i * 6;
      arcs += ps('M' + (60 - r) + ',90 A' + r + ',' + r + ' 0 0 1 ' + (60 + r) + ',90', cols[i], 6);
    }
    return scene(arcs + c(20, 96, 8, '#fdfdff', 'opacity=".7"') + c(100, 96, 8, '#fdfdff', 'opacity=".7"'),
      { bg: '#e7f4ff', ground: false });
  };

  map.wind = function () {
    return scene(
      ps('M14,44 C34,32 62,44 82,34 C96,28 92,18 82,20', '#8fb8d8', 4) +
      ps('M14,64 C40,52 66,66 92,54', '#8fb8d8', 4) +
      ps('M20,84 C44,74 70,86 96,74', '#8fb8d8', 4) +
      ps('M96,34 C106,32 108,42 98,44', '#5b93b8', 3),
      { bg: '#dceaf7', ground: false });
  };

  map.fog = function () {
    return scene(
      rc(10, 44, 100, 12, '#c3d3e6', 6) +
      rc(20, 58, 80, 12, '#d3e0ee', 6) +
      rc(8, 72, 92, 12, '#c3d3e6', 6) +
      rc(28, 86, 66, 10, '#d3e0ee', 5) +
      c(84, 34, 14, '#dfe9f4') + c(70, 30, 18, '#eef4fb'),
      { bg: '#dbeafe', ground: false });
  };

  map.thunder = function () {
    return scene(
      c(42, 40, 16, '#c3d3e6') + c(66, 34, 20, '#d3e0ee') + c(86, 42, 15, '#c3d3e6') +
      rc(26, 40, 74, 14, '#d3e0ee', 7) +
      p('M64,54 L48,78 L60,78 L50,100 L78,70 L64,70 L74,54 Z', '#f5c542') +
      p('M64,54 L56,78 L64,78 L58,90 L74,70 L64,70 L70,54 Z', '#fde68a'),
      { bg: '#dceaf7', ground: false });
  };

  map.lightning = function () {
    return scene(
      p('M66,10 L34,58 L54,58 L44,106 L84,52 L62,52 L78,10 Z', '#f5c542') +
      p('M66,18 L44,56 L58,56 L52,88 L74,54 L64,54 L74,18 Z', '#fde68a'),
      { bg: '#e2e8f0', ground: false });
  };

  map.ice = function () {
    /* An ice cube is almost white on a near-white background, which reads as an
       empty box at card size, so every face gets a real edge. Geometry is the
       usual 2D isometric: top (60,24)-(86,44)-(60,64)-(34,44), with the two side
       faces hanging off the (60,64) corner down to y=96. */
    var line = 'stroke="#5fa8dc" stroke-width="2.4"';
    return scene(
      p('M60,24 L86,44 L60,64 L34,44 Z', '#cfe8fa', line) +
      p('M34,44 L60,64 L60,96 L34,96 Z', '#e3f2fd', line) +
      p('M60,64 L86,44 L86,96 L60,96 Z', '#b3d8f3', line) +
      ps('M44,44 C50,38 56,36 62,38', '#ffffff', 3) +
      c(74, 82, 3, '#ffffff', 'opacity=\".55\"') +
      c(50, 80, 2.2, '#ffffff', 'opacity=\".45\"'),
      { bg: '#e7f4ff', ground: false });
  };

  map.wave = function () {
    return scene(
      p('M0,78 C18,54 30,54 44,68 C56,80 66,80 78,66 C92,50 104,52 120,66 L120,120 L0,120 Z', '#3f8fd6') +
      p('M0,92 C20,74 34,76 48,86 C60,94 70,94 82,84 C96,72 108,74 120,84 L120,120 L0,120 Z', '#5ba8f5') +
      c(30, 40, 3.4, '#fdfdff', 'opacity=".85"') + c(44, 32, 2.4, '#fdfdff', 'opacity=".7"'),
      { bg: '#e7f4ff', ground: false });
  };

  map.sand = function () {
    return scene(
      p('M0,66 C22,50 40,50 60,62 C80,74 100,74 120,60 L120,120 L0,120 Z', '#e8c98a') +
      p('M0,84 C24,70 44,72 64,82 C82,90 102,88 120,78 L120,120 L0,120 Z', '#d9b570') +
      ps('M76,26 L76,66 M58,66 L94,66', '#8a6a3a', 4) +
      p('M66,26 L86,26 L80,36 L72,36 Z', '#d9b570') +
      p('M60,66 C68,50 82,50 90,66 Z', '#d9b570') +
      p('M80,66 C88,54 100,54 108,66 Z', '#e8c98a'),
      { bg: '#fdf6e8' });
  };

  map.rock = function () {
    return scene(
      p('M14,100 C10,74 26,58 46,58 C66,58 78,74 74,100 Z', '#8a94a8') +
      p('M50,100 C46,80 58,68 74,68 C90,68 100,82 96,100 Z', '#6b7488') +
      p('M26,90 C24,78 32,70 42,70 C50,70 56,78 54,90 Z', '#a8b2c4') +
      e(46, 66, 8, 4, '#4a9e4a', 'opacity=".7"'),
      { bg: '#eef2f7' });
  };

  map.desert = function () {
    return scene(
      c(96, 24, 12, '#fcd34d') +
      p('M0,72 C24,56 44,58 64,68 C84,78 102,76 120,64 L120,120 L0,120 Z', '#e8c98a') +
      p('M0,90 C26,78 48,80 70,88 C90,96 106,94 120,86 L120,120 L0,120 Z', '#d9b570') +
      rc(26, 56, 9, 34, '#4a9e4a', 4) +
      ps('M30,64 C18,60 16,50 24,48 M31,72 C43,68 45,58 37,56', '#4a9e4a', 5) +
      rc(23, 46, 15, 6, '#e0453f', 2) + c(30, 50, 3, '#e0453f'),
      { bg: '#fdf6e8' });
  };

  map.island = function () {
    return scene(
      c(34, 22, 10, '#fcd34d') +
      p('M0,84 C22,78 40,80 60,84 C82,88 100,86 120,80 L120,120 L0,120 Z', '#5ba8f5') +
      p('M18,88 C34,66 62,60 100,72 L110,90 C78,94 44,94 18,88 Z', '#e8c98a') +
      rc(56, 54, 8, 24, '#8a5a33', 3) +
      ps('M60,56 C46,50 42,38 52,34 M60,56 C74,50 78,38 68,34', '#4a9e4a', 4) +
      c(38, 42, 8, '#4a9e4a') + c(82, 42, 8, '#4a9e4a'),
      { bg: '#e7f4ff' });
  };

  map.forest = function () {
    var s = '';
    var xs = [22, 46, 70, 94];
    for (var i = 0; i < xs.length; i++) {
      var x = xs[i], sc = 0.7 + (i % 3) * 0.14;
      s += rc(x - 4, 76, 8, 26, '#7a5230', 2) +
        c(x, 56, 18 * sc, i % 2 ? '#3f8f4a' : '#4a9e4a') +
        c(x - 10, 64, 12 * sc, i % 2 ? '#357a3f' : '#3f8f4a');
    }
    return scene(s + p('M0,96 L120,96 L120,110 L0,110 Z', '#8a6a3a'), { bg: '#eafaf1' });
  };

  map.field = function () {
    return scene(
      c(96, 24, 11, '#fcd34d') +
      p('M0,66 L120,66 L120,120 L0,120 Z', '#8a6a3a') +
      rc(66, 42, 44, 30, '#e0453f', 2) +
      p('M60,42 L88,26 L116,42 Z', '#b91c1c') +
      rc(80, 56, 14, 16, '#fdfdff', 2) +
      ps('M6,74 L20,74 M2,84 L22,84 M4,94 L18,94 M34,72 L48,72 M30,84 L52,84 M34,96 L50,96 M62,74 L74,74 M60,86 L76,86 M64,98 L78,98',
        '#c9a82a', 3) +
      ps('M4,74 L4,64 M20,74 L20,64 M36,72 L36,62 M48,72 L48,62 M64,74 L64,64 M74,74 L74,64', '#c9a82a', 2),
      { bg: '#fdf6e8' });
  };

  map.volcano = function () {
    return scene(
      p('M4,104 L44,44 L56,44 L64,60 L76,44 L88,44 L116,104 Z', '#6b7488') +
      p('M44,44 L52,44 L58,52 L48,52 Z', '#f1f5f9') +
      p('M76,44 L88,44 L82,52 L72,52 Z', '#f1f5f9') +
      ps('M60,44 C58,30 64,26 60,16', '#b0b8c4', 5) +
      ps('M58,26 C54,18 58,12 56,6', '#cbd5e1', 4) +
      ps('M64,32 C68,26 66,20 70,14', '#b0b8c4', 4) +
      p('M50,48 C56,44 60,50 66,46 L64,60 L54,60 Z', '#f97316') +
      ps('M30,104 C36,100 40,104 46,100 M70,104 C76,100 82,104 88,100', '#4a9e4a', 3),
      { bg: '#eef2f7' });
  };

  map.sky = function () {
    return scene(
      c(30, 26, 12, '#fcd34d') +
      c(76, 40, 12, '#f2f7fc') + c(90, 36, 15, '#f8fbff') + c(102, 42, 10, '#e6eef7') +
      rc(62, 38, 46, 13, '#f2f7fc', 6.5) +
      ps('M36,70 C30,76 30,84 36,88 M30,70 C24,76 24,84 30,88', '#8fa3b8', 2.4) +
      ps('M92,72 C98,78 98,86 92,90 M88,72 C82,78 82,86 88,90', '#8fa3b8', 2.4),
      { bg: '#cfe4fb', ground: false });
  };

  map.ocean = function () {
    return scene(
      p('M0,56 L120,56 L120,120 L0,120 Z', '#3f8fd6') +
      p('M0,56 L120,56 L120,64 L0,64 Z', '#bfe0f7') +
      ps('M0,74 C18,66 30,82 48,74 C66,66 78,82 96,74 C106,70 114,74 120,76', '#8ec6fb', 3.4) +
      ps('M0,92 C18,84 30,100 48,92 C66,84 78,100 96,92 C106,88 114,92 120,94', '#8ec6fb', 3.4) +
      c(84, 30, 10, '#fcd34d', 'opacity=".9"'),
      { bg: '#e7f4ff', ground: false });
  };

  /* ========================================================== body (12) */

  map.arm = function () {
    return scene(
      rc(44, 22, 32, 22, SKIN, 11) +
      c(90, 33, 15, SKIN) +
      rc(80, 8, 7, 16, SKIN, 3.5) + rc(88, 6, 7, 18, SKIN, 3.5) + rc(96, 8, 7, 16, SKIN, 3.5) +
      ps('M62,32 C74,32 80,40 82,48', '#dda57e', 2.2),
      { bg: '#fdf1f7' });
  };

  map.leg = function () {
    return scene(
      rc(40, 20, 34, 40, '#3f7fb5', 8) +
      rc(42, 58, 30, 30, SKIN, 8) +
      p('M38,86 L78,86 C86,86 92,94 88,100 C84,106 70,106 62,102 L38,94 Z', NIGHT) +
      c(50, 30, 4, '#ffffff', 'opacity=".3"'),
      { bg: '#fdf1f7' });
  };

  map.finger = function () {
    return scene(
      rc(50, 18, 20, 62, SKIN, 10) +
      rc(53, 80, 14, 20, SKIN, 7) +
      e(60, 26, 7, 4, '#dda57e', 'opacity=".5"') +
      e(60, 46, 7, 4, '#dda57e', 'opacity=".5"') + e(60, 66, 7, 4, '#dda57e', 'opacity=".5"') +
      ps('M50,90 C56,94 64,94 70,90', '#dda57e', 2),
      { bg: '#fdf1f7' });
  };

  map.nose = function () {
    return scene(
      p('M60,18 C74,18 82,34 84,54 C86,72 76,86 60,86 C44,86 34,72 36,54 C38,34 46,18 60,18 Z', SKIN) +
      e(60, 66, 13, 9, '#e8b48a') +
      c(54, 66, 2.4, '#a3704f') + c(66, 66, 2.4, '#a3704f') +
      e(44, 34, 7, 10, '#ffffff', 'opacity=".35" transform="rotate(-18 44 34)"'),
      { bg: '#fdf1f7' });
  };

  map.tooth = function () {
    var line = 'stroke="#c8d2e0" stroke-width="2"';
    return scene(
      p('M34,24 C34,12 56,12 56,24 L58,68 C59,84 48,88 45,74 C42,88 33,84 34,68 Z', '#fdfdff', line) +
      p('M64,24 C64,12 86,12 86,24 L88,68 C89,84 78,88 75,74 C72,88 63,84 64,68 Z', '#fdf6ea', line) +
      p('M34,24 C34,12 56,12 56,24 L56,50 C48,56 40,56 34,50 Z', '#dbeafe') +
      p('M64,24 C64,12 86,12 86,24 L86,50 C78,56 70,56 64,50 Z', '#dbeafe') +
      ps('M45,34 L47,64 M75,34 L77,64', '#c8d2e0', 1.8),
      { bg: '#fdf1f7' });
  };

  map.tongue = function () {
    return scene(
      p('M60,14 C78,14 88,34 86,58 C84,80 74,98 60,98 C46,98 36,80 34,58 C32,34 42,14 60,14 Z', '#e8707a') +
      ps('M60,26 L60,84', '#c8545f', 2.6) +
      e(60, 60, 20, 26, '#f2909a', 'opacity=".6"') +
      e(60, 34, 14, 10, '#ffffff', 'opacity=".2"'),
      { bg: '#fdf1f7' });
  };

  map.neck = function () {
    return scene(
      p('M38,20 L82,20 L86,66 C86,84 76,94 60,94 C44,94 34,84 34,66 Z', SKIN) +
      c(38, 26, 12, SKIN) + c(82, 26, 12, SKIN) +
      ps('M42,40 C50,50 70,50 78,40', '#dda57e', 2.6) +
      p('M34,84 C44,94 76,94 86,84 L90,106 L30,106 Z', '#4f7df3') +
      e(48, 32, 6, 10, '#ffffff', 'opacity=".25"'),
      { bg: '#fdf1f7' });
  };

  map.back = function () {
    return scene(
      p('M60,16 C86,16 96,44 96,68 C96,88 82,102 60,102 C38,102 24,88 24,68 C24,44 34,16 60,16 Z', SKIN) +
      c(60, 62, 3, '#c07a52') +
      ps('M60,34 L60,88', '#dda57e', 2) +
      ps('M46,40 C50,58 50,76 46,92 M74,40 C70,58 70,76 74,92', '#dda57e', 2) +
      e(44, 34, 8, 12, '#ffffff', 'opacity=".25" transform="rotate(-16 44 34)"'),
      { bg: '#fdf1f7' });
  };

  map.knee = function () {
    return scene(
      rc(30, 60, 26, 46, '#3f7fb5', 8) + rc(64, 60, 26, 46, '#3f7fb5', 8) +
      rc(44, 34, 32, 40, SKIN, 12) +
      e(60, 56, 17, 14, '#e8b48a') +
      e(54, 52, 6, 4, '#ffffff', 'opacity=".45"'),
      { bg: '#fdf1f7' });
  };

  map.shoulder = function () {
    return scene(
      e(60, 62, 30, 26, SKIN) +
      c(84, 66, 16, SKIN) +
      e(60, 48, 22, 18, '#e8b48a', 'opacity=".5"') +
      e(48, 46, 8, 6, '#ffffff', 'opacity=".35"') +
      p('M34,86 C44,78 76,78 86,86 L86,106 L34,106 Z', '#4f7df3'),
      { bg: '#fdf1f7' });
  };

  map.bone = function () {
    return scene(
      '<g transform="rotate(-24 60 60)">' +
      rc(44, 50, 32, 20, '#f4ead8', 6) +
      c(42, 52, 11, '#fdf6ea') + c(42, 68, 11, '#fdf6ea') +
      c(78, 52, 11, '#fdf6ea') + c(78, 68, 11, '#fdf6ea') +
      '</g>',
      { bg: '#fdf1f7' });
  };

  map.skin = function () {
    return scene(
      rc(26, 26, 68, 68, SKIN, 10) +
      c(60, 60, 22, '#e8b48a', 'opacity=".45"') +
      e(38, 40, 9, 6, '#ffffff', 'opacity=".35" transform="rotate(-20 38 40)"') +
      e(84, 74, 7, 5, '#ffffff', 'opacity=".25" transform="rotate(-20 84 74)"'),
      { bg: '#fdf1f7' });
  };

  /* ======================================================== family (6) */

  map.son = function () {
    return scene(
      person(44, 54, { scale: 0.8, shirt: '#3b82f6', smile: true, hair: '#3a2f2a' }) +
      person(84, 42, { scale: 1, shirt: '#4f7df3', smile: true, hair: '#33261f' }) +
      c(64, 20, 5, '#fbbf24'),
      { bg: '#f4f2ff' });
  };

  map.daughter = function () {
    return scene(
      person(46, 54, { scale: 0.8, shirt: '#f472b6', longHair: true, smile: true, hair: '#6b4423' }) +
      person(84, 42, { scale: 1, shirt: '#ec4899', longHair: true, smile: true, hair: '#3f2f28' }) +
      c(64, 20, 5, '#fb7185'),
      { bg: '#f4f2ff' });
  };

  map.uncle = function () {
    return scene(
      person(60, 42, { beard: true, shirt: '#8a5a33', smile: true, hair: '#2f2a24', scale: 1.05 }) +
      c(60, 18, 6, '#4a9e4a') +
      p('M48,58 L72,58 L80,104 L40,104 Z', '#8a5a33'),
      { bg: '#f4f2ff' });
  };

  map.aunt = function () {
    return scene(
      c(60, 16, 5, '#f472b6') +
      person(60, 40, { longHair: true, shirt: '#a78bfa', smile: true, hair: '#3f2f28' }) +
      p('M46,58 L74,58 L86,104 L34,104 Z', '#a78bfa'),
      { bg: '#f4f2ff' });
  };

  map.grandfather = function () {
    return scene(
      c(52, 30, 16, '#e5e7eb') + c(68, 32, 13, '#e5e7eb') +
      c(60, 50, 19, SKIN) +
      c(53, 46, 2.2, NIGHT) + c(67, 46, 2.2, NIGHT) +
      ps('M60,60 L60,70', '#dda57e', 2) +
      p('M48,66 C48,84 72,84 72,66 C66,74 54,74 48,66 Z', '#e5e7eb') +
      person(60, 50, { beard: true, shirt: '#64748b', smile: true, hair: '#d1d5db', scale: 0.9, legs: false }),
      { bg: '#f4f2ff' });
  };

  map.grandmother = function () {
    return scene(
      c(52, 28, 16, '#e5e7eb') + c(68, 30, 13, '#e5e7eb') +
      c(60, 48, 19, SKIN) +
      c(53, 44, 2.2, NIGHT) + c(67, 44, 2.2, NIGHT) +
      ps('M53,56 Q60,61 67,56', '#c08a72', 2) +
      c(44, 30, 8, '#f472b6') + c(76, 30, 8, '#f472b6') +
      person(60, 48, { longHair: true, shirt: '#8b5cf6', smile: true, hair: '#d1d5db', scale: 0.9, legs: false }),
      { bg: '#f4f2ff' });
  };

  /* ======================================================== clothes (17) */

  map.shirt = function () {
    return scene(F.shirt(60, 50, '#8ec6fb'), { bg: '#fdf4ed' });
  };

  map.pants = function () {
    return scene(F.pants(60, 34, '#3f4a6b'), { bg: '#fdf4ed' });
  };

  map.dress = function () {
    return scene(F.dress(60, 34, '#f472b6'), { bg: '#fdf4ed' });
  };

  map.skirt = function () {
    return scene(F.skirt(60, 46, '#a78bfa'), { bg: '#fdf4ed' });
  };

  map.sock = function () {
    return scene(F.sock(56, 40, '#ef4444'), { bg: '#fdf4ed' });
  };

  map.shoe = function () {
    return scene(F.shoe(56, 96, '#8a5a33'), { bg: '#fdf4ed' });
  };

  map.boot = function () {
    return scene(F.shoe(56, 96, '#4a3a2a', true), { bg: '#fdf4ed' });
  };

  map.hat = function () {
    return scene(F.headgear(60, 48, 'hat', '#c2410c'), { bg: '#fdf4ed' });
  };

  map.cap = function () {
    return scene(F.headgear(60, 50, 'cap', '#2563eb'), { bg: '#fdf4ed' });
  };

  map.scarf = function () {
    return scene(F.scarf(58, 46, '#e0453f'), { bg: '#fdf4ed' });
  };

  map.glove = function () {
    return scene(F.glove(58, 44, '#8a5a33'), { bg: '#fdf4ed' });
  };

  map.coat = function () {
    return scene(F.coatArt(60, 36, '#2f4858'), { bg: '#fdf4ed' });
  };

  map.jacket = function () {
    return scene(
      p('M38,42 L50,34 L70,34 L82,42 L86,66 L80,64 L80,104 L40,104 L40,64 L34,66 Z', '#4a9e4a') +
      ln(60, 34, 60, 104, '#2f6b32', 2.4) +
      c(53, 58, 2.4, '#fde68a') + c(53, 70, 2.4, '#fde68a') +
      rc(32, 48, 8, 26, '#3f8f4a', 3) + rc(80, 48, 8, 26, '#3f8f4a', 3),
      { bg: '#fdf4ed' });
  };

  map.belt = function () {
    return scene(
      rc(14, 52, 92, 18, '#8a5a33', 4) +
      rc(48, 46, 26, 30, 'none', 0, 'stroke="#fcd34d" stroke-width="7"') +
      ln(61, 48, 61, 74, '#fcd34d', 5) +
      c(26, 61, 3, '#6b3f24') + c(94, 61, 3, '#6b3f24'),
      { bg: '#fdf4ed' });
  };

  map.glasses = function () {
    return scene(F.glasses(60, 60), { bg: '#fdf4ed' });
  };

  map.ring = function () {
    return scene(
      c(60, 62, 26, 'none', 'stroke="#fcd34d" stroke-width="10"') +
      c(60, 62, 26, 'none', 'stroke="#f59e0b" stroke-width="4"') +
      pl('60,20 70,34 60,48 50,34', '#7dd3fc') +
      pl('56,28 60,24 64,28 60,34', '#ffffff', 'opacity=".8"'),
      { bg: '#fdf4ed' });
  };

  map.tie = function () {
    return scene(
      p('M48,22 L60,34 L72,22 L66,20 L54,20 Z', '#e0453f') +
      p('M54,32 L66,32 L70,44 L60,54 L50,44 Z', '#e0453f') +
      p('M60,54 L68,46 L70,88 C70,94 50,94 50,88 L52,46 Z', '#c2352f') +
      ps('M56,60 L60,86', '#e8736c', 2),
      { bg: '#fdf4ed' });
  };

  /* ======================================================== colors (11) */

  function swatch2(color, bg, outline) {
    return scene(
      p('M18,62 C18,40 40,26 62,26 C86,26 104,42 104,62 C104,78 92,84 82,78 C74,73 68,78 64,88 C58,102 40,102 32,90 C22,76 18,70 18,62 Z', color, outline) +
      c(36, 46, 8, bg) +
      p('M88,88 C88,88 98,76 98,70 C98,64 88,60 88,60 C88,60 78,64 78,70 C78,76 88,88 88,88 Z', color) +
      ps('M14,104 C28,96 42,108 58,100', color, 5) +
      c(20, 28, 3, color) + c(106, 34, 2.4, color),
      { bg: bg, ground: false });
  }

  map.pink = function () { return swatch2('#ec4899', '#fdf2f8'); };
  map.purple = function () { return swatch2('#9333ea', '#faf4ff'); };
  map.brown = function () { return swatch2('#92400e', '#f7f2ec'); };
  map.gray = function () { return swatch2('#6b7280', '#eef0f4'); };
  map.gold = function () {
    /* Gold is a metal, not a hue, so it gets an ingot rather than a swatch
       (otherwise it would be pixel-identical to "yellow"). */
    return scene(
      p('M18,84 L36,54 L84,54 L102,84 Z', '#ca8a04') +
      p('M18,84 L36,54 L52,54 L36,84 Z', '#eab308') +
      p('M36,84 L54,54 L84,54 L66,84 Z', '#fcd34d') +
      p('M66,84 L84,54 L102,84 Z', '#a16207') +
      ps('M44,66 C52,60 62,60 70,64', '#fde68a', 4, 'opacity=".8"') +
      F.spark(96, 30, 8, '#fbbf24') + F.spark(24, 34, 6, '#fcd34d') + F.spark(78, 24, 5, '#fde68a'),
      { bg: '#fffbeb' });
  };
  map.silver = function () { return swatch2('#cbd5e1', '#eef2f7', 'stroke="#94a3b8" stroke-width="2"'); };

  map.dark = function () {
    return scene(
      rc(20, 24, 36, 76, '#f8fafc', 6) + rc(64, 24, 36, 76, '#22262f', 6) +
      rc(20, 24, 36, 76, 'none', 0, 'stroke="#cbd5e1" stroke-width="2"') +
      c(38, 62, 10, '#fbbf24') + c(82, 62, 10, '#fbbf24'),
      { bg: '#faf4ff', ground: false });
  };

  map.light = function () {
    return scene(
      rc(20, 24, 36, 76, '#e2e8f0', 6) + rc(64, 24, 36, 76, '#f8fafc', 6) +
      rc(64, 24, 36, 76, 'none', 0, 'stroke="#cbd5e1" stroke-width="2"') +
      c(38, 62, 10, '#94a3b8') + c(82, 62, 10, '#fbbf24'),
      { bg: '#faf4ff', ground: false });
  };

  map.colourful = function () {
    var cols = ['#e0453f', '#f2903c', '#f5d33c', '#4a9e4a', '#3f7fb5', '#9333ea'], s = '', i;
    for (i = 0; i < 6; i++) {
      var a = (i * Math.PI) / 3;
      s += e(60 + Math.cos(a) * 22, 62 + Math.sin(a) * 22, 13, 13, cols[i],
        'transform="rotate(' + (i * 60) + ' ' + (60 + Math.cos(a) * 22).toFixed(1) + ' ' + (62 + Math.sin(a) * 22).toFixed(1) + ')"');
    }
    return scene(s + c(60, 62, 9, '#fdfdff') +
      c(26, 30, 3, '#e0453f') + c(94, 30, 3, '#3f7fb5') + c(24, 92, 3, '#4a9e4a') + c(96, 92, 3, '#f2903c'),
      { bg: '#faf4ff', ground: false });
  };

  map.bright = function () {
    var rays = '', i;
    for (i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      rays += ln(60 + Math.cos(a) * 32, 62 + Math.sin(a) * 32,
                 60 + Math.cos(a) * 46, 62 + Math.sin(a) * 46, '#f59e0b', 4);
    }
    return scene(
      c(60, 62, 28, '#fbbf24') + c(60, 62, 22, '#fde68a') + rays +
      c(52, 54, 5, '#ffffff', 'opacity=".6"'),
      { bg: '#faf4ff', ground: false });
  };

  map.soft = function () {
    return scene(
      e(60, 74, 38, 26, '#c4b5fd') +
      e(60, 66, 34, 22, '#ddd6fe') +
      c(44, 58, 6, '#ffffff', 'opacity=".55"') + c(56, 52, 4, '#ffffff', 'opacity=".45"') +
      ps('M14,96 C30,88 44,100 60,94', '#c4b5fd', 5) +
      ps('M62,98 C76,92 88,100 102,94', '#c4b5fd', 5),
      { bg: '#faf4ff', ground: false });
  };

  LLC.art.register(map);
})(window);
