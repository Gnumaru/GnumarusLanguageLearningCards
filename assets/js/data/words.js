/*!
 * words.js - The deck data.
 *
 * Everything lives in a classic script (no fetch, no JSON) so the app boots
 * identically from an http(s) server and from a bare `file://` path.
 *
 * Schema
 *   category: { id, name: {pt,en,es}, bg, accent }
 *   language: { id, name (native), flag, speech (BCP-47 hint for synthesis) }
 *   word:     { id, cat, type: 'noun'|'adjective'|'verb', w: {pt,en,es} }
 *
 * Adding a language = add the code to each `w` object and one entry to
 * `LANGUAGES`; nothing else in the app needs to change.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC || (global.LLC = {});

  var LANGUAGES = {
    pt: { id: 'pt', name: 'Português', flag: '🇧🇷', speech: 'pt-BR' },
    en: { id: 'en', name: 'English', flag: '🇬🇧', speech: 'en-GB' },
    es: { id: 'es', name: 'Español', flag: '🇪🇸', speech: 'es-ES' }
  };

  var CATEGORIES = [
    { id: 'animals',    bg: '#fff1e0', accent: '#ea580c' },
    { id: 'food',       bg: '#fff0ee', accent: '#dc2626' },
    { id: 'nature',     bg: '#eafaf1', accent: '#059669' },
    { id: 'body',       bg: '#fdf1f7', accent: '#db2777' },
    { id: 'family',     bg: '#f4f2ff', accent: '#7c3aed' },
    { id: 'objects',    bg: '#eef4ff', accent: '#2563eb' },
    { id: 'colors',     bg: '#faf4ff', accent: '#9333ea' },
    { id: 'verbs',      bg: '#ebfeff', accent: '#0e7490' },
    { id: 'adjectives', bg: '#fdfaea', accent: '#a16207' }
  ];

  var TYPES = ['noun', 'adjective', 'verb'];

  /* id | category | part of speech | pt | en | es */
  var RAW = [
    /* ---------------------------------------------------------- animals */
    ['cow',       'animals', 'noun', 'vaca',        'cow',       'vaca'],
    ['dog',       'animals', 'noun', 'cão',         'dog',       'perro'],
    ['cat',       'animals', 'noun', 'gato',        'cat',       'gato'],
    ['horse',     'animals', 'noun', 'cavalo',      'horse',     'caballo'],
    ['bird',      'animals', 'noun', 'pássaro',     'bird',      'pájaro'],
    ['fish',      'animals', 'noun', 'peixe',       'fish',      'pez'],
    ['bee',       'animals', 'noun', 'abelha',      'bee',       'abeja'],
    ['butterfly', 'animals', 'noun', 'borboleta',   'butterfly', 'mariposa'],
    ['rabbit',    'animals', 'noun', 'coelho',      'rabbit',    'conejo'],
    ['lion',      'animals', 'noun', 'leão',        'lion',      'león'],
    ['snake',     'animals', 'noun', 'cobra',       'snake',     'serpiente'],
    ['frog',      'animals', 'noun', 'sapo',        'frog',      'rana'],
    ['owl',       'animals', 'noun', 'coruja',      'owl',       'búho'],
    ['sheep',     'animals', 'noun', 'ovelha',      'sheep',     'oveja'],
    ['elephant',  'animals', 'noun', 'elefante',    'elephant',  'elefante'],
    ['penguin',   'animals', 'noun', 'pinguim',     'penguin',   'pingüino'],

    /* ------------------------------------------------------------- food */
    ['apple',     'food', 'noun', 'maçã',         'apple',     'manzana'],
    ['bread',     'food', 'noun', 'pão',          'bread',     'pan'],
    ['milk',      'food', 'noun', 'leite',        'milk',      'leche'],
    ['egg',       'food', 'noun', 'ovo',          'egg',       'huevo'],
    ['water',     'food', 'noun', 'água',         'water',     'agua'],
    ['cheese',    'food', 'noun', 'queijo',       'cheese',    'queso'],
    ['rice',      'food', 'noun', 'arroz',        'rice',      'arroz'],
    ['coffee',    'food', 'noun', 'café',         'coffee',    'café'],
    ['cake',      'food', 'noun', 'bolo',         'cake',      'pastel'],
    ['banana',    'food', 'noun', 'banana',       'banana',    'plátano'],
    ['tomato',    'food', 'noun', 'tomate',       'tomato',    'tomate'],
    ['grape',     'food', 'noun', 'uva',          'grape',     'uva'],
    ['icecream',  'food', 'noun', 'sorvete',      'ice cream', 'helado'],
    ['honey',     'food', 'noun', 'mel',          'honey',     'miel'],

    /* ----------------------------------------------------------- nature */
    ['sun',       'nature', 'noun', 'sol',         'sun',       'sol'],
    ['moon',      'nature', 'noun', 'lua',         'moon',      'luna'],
    ['star',      'nature', 'noun', 'estrela',     'star',      'estrella'],
    ['tree',      'nature', 'noun', 'árvore',      'tree',      'árbol'],
    ['flower',    'nature', 'noun', 'flor',        'flower',    'flor'],
    ['rain',      'nature', 'noun', 'chuva',       'rain',      'lluvia'],
    ['snow',      'nature', 'noun', 'neve',        'snow',      'nieve'],
    ['mountain',  'nature', 'noun', 'montanha',    'mountain',  'montaña'],
    ['river',     'nature', 'noun', 'rio',         'river',     'río'],
    ['cloud',     'nature', 'noun', 'nuvem',       'cloud',     'nube'],
    ['fire',      'nature', 'noun', 'fogo',        'fire',      'fuego'],
    ['leaf',      'nature', 'noun', 'folha',       'leaf',      'hoja'],

    /* ------------------------------------------------------------- body */
    ['hand',      'body', 'noun', 'mão',          'hand',      'mano'],
    ['eye',       'body', 'noun', 'olho',         'eye',       'ojo'],
    ['heart',     'body', 'noun', 'coração',      'heart',     'corazón'],
    ['head',      'body', 'noun', 'cabeça',       'head',      'cabeza'],
    ['foot',      'body', 'noun', 'pé',           'foot',      'pie'],
    ['mouth',     'body', 'noun', 'boca',         'mouth',     'boca'],
    ['ear',       'body', 'noun', 'orelha',       'ear',       'oído'],
    ['hair',      'body', 'noun', 'cabelo',       'hair',      'pelo'],

    /* ----------------------------------------------------------- family */
    ['mother',    'family', 'noun', 'mãe',         'mother',    'madre'],
    ['father',    'family', 'noun', 'pai',         'father',    'padre'],
    ['sister',    'family', 'noun', 'irmã',        'sister',    'hermana'],
    ['brother',   'family', 'noun', 'irmão',       'brother',   'hermano'],
    ['baby',      'family', 'noun', 'bebê',        'baby',      'bebé'],
    ['friend',    'family', 'noun', 'amigo',       'friend',    'amigo'],

    /* ---------------------------------------------------------- objects */
    ['house',     'objects', 'noun', 'casa',       'house',     'casa'],
    ['door',      'objects', 'noun', 'porta',      'door',      'puerta'],
    ['window',    'objects', 'noun', 'janela',     'window',    'ventana'],
    ['table',     'objects', 'noun', 'mesa',       'table',     'mesa'],
    ['chair',     'objects', 'noun', 'cadeira',    'chair',     'silla'],
    ['book',      'objects', 'noun', 'livro',      'book',      'libro'],
    ['key',       'objects', 'noun', 'chave',      'key',       'llave'],
    ['clock',     'objects', 'noun', 'relógio',    'clock',     'reloj'],
    ['bed',       'objects', 'noun', 'cama',       'bed',       'cama'],
    ['cup',       'objects', 'noun', 'copo',       'cup',       'taza'],
    ['phone',     'objects', 'noun', 'telefone',   'phone',     'teléfono'],
    ['umbrella',  'objects', 'noun', 'guarda-chuva', 'umbrella', 'paraguas'],

    /* ----------------------------------------------------------- colors */
    ['red',       'colors', 'adjective', 'vermelho', 'red',       'rojo'],
    ['blue',      'colors', 'adjective', 'azul',     'blue',      'azul'],
    ['green',     'colors', 'adjective', 'verde',    'green',     'verde'],
    ['yellow',    'colors', 'adjective', 'amarelo',  'yellow',    'amarillo'],
    ['black',     'colors', 'adjective', 'preto',    'black',     'negro'],
    ['white',     'colors', 'adjective', 'branco',   'white',     'blanco'],
    ['orange',    'colors', 'adjective', 'laranja',  'orange',    'naranja'],

    /* ------------------------------------------------------------ verbs */
    ['run',       'verbs', 'verb', 'correr',   'run',    'correr'],
    ['eat',       'verbs', 'verb', 'comer',    'eat',    'comer'],
    ['drink',     'verbs', 'verb', 'beber',    'drink',  'beber'],
    ['sleep',     'verbs', 'verb', 'dormir',   'sleep',  'dormir'],
    ['read',      'verbs', 'verb', 'ler',      'read',   'leer'],
    ['write',     'verbs', 'verb', 'escrever', 'write',  'escribir'],
    ['swim',      'verbs', 'verb', 'nadar',    'swim',   'nadar'],
    ['sing',      'verbs', 'verb', 'cantar',   'sing',   'cantar'],
    ['jump',      'verbs', 'verb', 'pular',    'jump',   'saltar'],
    ['walk',      'verbs', 'verb', 'andar',    'walk',   'caminar'],
    ['dance',     'verbs', 'verb', 'dançar',   'dance',  'bailar'],
    ['play',      'verbs', 'verb', 'brincar',  'play',   'jugar'],
    ['listen',    'verbs', 'verb', 'ouvir',    'listen', 'escuchar'],
    ['fly',       'verbs', 'verb', 'voar',     'fly',    'volar'],
    ['smile',     'verbs', 'verb', 'sorrir',   'smile',  'sonreír'],

    /* ------------------------------------------------------- adjectives */
    ['big',       'adjectives', 'adjective', 'grande',    'big',       'grande'],
    ['small',     'adjectives', 'adjective', 'pequeno',   'small',     'pequeño'],
    ['fast',      'adjectives', 'adjective', 'veloz',     'fast',      'rápido'],
    ['slow',      'adjectives', 'adjective', 'lento',     'slow',      'lento'],
    ['happy',     'adjectives', 'adjective', 'feliz',     'happy',     'feliz'],
    ['sad',       'adjectives', 'adjective', 'triste',    'sad',       'triste'],
    ['hot',       'adjectives', 'adjective', 'quente',    'hot',       'caliente'],
    ['cold',      'adjectives', 'adjective', 'frio',      'cold',      'frío'],
    ['beautiful', 'adjectives', 'adjective', 'bonito',    'beautiful', 'bonito'],
    ['new',       'adjectives', 'adjective', 'novo',      'new',       'nuevo']
  ];

  var WORDS = RAW.map(function (row) {
    return {
      id: row[0],
      cat: row[1],
      type: row[2],
      w: { pt: row[3], en: row[4], es: row[5] }
    };
  });

  var byId = Object.create(null);
  WORDS.forEach(function (word) { byId[word.id] = word; });

  var categoryById = Object.create(null);
  CATEGORIES.forEach(function (cat) { categoryById[cat.id] = cat; });

  LLC.data = {
    version: 1,
    languages: LANGUAGES,
    languageIds: ['pt', 'en', 'es'],
    categories: CATEGORIES,
    categoryNames: {
      animals: { pt: 'Animais', en: 'Animals', es: 'Animales' },
      food: { pt: 'Comida', en: 'Food', es: 'Comida' },
      nature: { pt: 'Natureza', en: 'Nature', es: 'Naturaleza' },
      body: { pt: 'Corpo', en: 'Body', es: 'Cuerpo' },
      family: { pt: 'Família', en: 'Family', es: 'Familia' },
      objects: { pt: 'Objetos', en: 'Objects', es: 'Objetos' },
      colors: { pt: 'Cores', en: 'Colors', es: 'Colores' },
      verbs: { pt: 'Verbos', en: 'Verbs', es: 'Verbos' },
      adjectives: { pt: 'Adjetivos', en: 'Adjectives', es: 'Adjetivos' }
    },
    types: TYPES,
    words: WORDS,
    byId: function (id) { return byId[id] || null; },
    category: function (id) { return categoryById[id] || CATEGORIES[0]; },
    /** Category label in the given UI language, falling back to the id. */
    categoryName: function (id, lang) {
      var names = this.categoryNames[id];
      if (!names) return id;
      return names[lang] || names.en || id;
    },
    /** Translated word for a card, or the id if that language is missing. */
    translate: function (word, lang) {
      return (word && word.w && word.w[lang]) || '';
    }
  };
})(window);
