/*!
 * themes-food.js - Themed vocabulary: drinks and kitchen.
 *
 * Rows are `id | category | part of speech | pt | en | es` and are pushed into
 * the shared deck with `LLC.data.add()`, which keeps the first definition of an
 * id. That is what lets several themed files add to the deck without knowing
 * what each other contains.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;

  /* ------------------------------------------------------------- drinks */
  var drinks = [
    ['soda',          'drinks', 'noun', 'refrigerante',      'soft drink',   'refresco'],
    ['sparkling',     'drinks', 'noun', 'água com gás',      'sparkling water', 'agua con gas'],
    ['mineralwater',  'drinks', 'noun', 'água mineral',      'mineral water', 'agua mineral'],
    ['lemonade',      'drinks', 'noun', 'limonada',          'lemonade',      'limonada'],
    ['milkshake',     'drinks', 'noun', 'milk-shake',        'milkshake',     'malteada'],
    ['smoothie',      'drinks', 'noun', 'vitamina',          'smoothie',      'batido'],
    ['hotchocolate',  'drinks', 'noun', 'chocolate quente',  'hot chocolate', 'chocolate caliente'],
    ['espresso',      'drinks', 'noun', 'expresso',          'espresso',      'espresso'],
    ['cappuccino',    'drinks', 'noun', 'capuccino',         'cappuccino',    'capuchino'],
    ['latte',         'drinks', 'noun', 'latte',             'latte',         'café latte'],
    ['americano',     'drinks', 'noun', 'americano',         'americano',     'americano'],
    ['orangejuice',   'drinks', 'noun', 'suco de laranja',   'orange juice',  'zumo de naranja'],
    ['applejuice',    'drinks', 'noun', 'suco de maçã',      'apple juice',   'zumo de manzana'],
    ['tomatojuice',   'drinks', 'noun', 'suco de tomate',    'tomato juice',  'zumo de tomate'],
    ['cocktail',      'drinks', 'noun', 'coquetel',          'cocktail',      'cóctel'],
    ['punch',         'drinks', 'noun', 'ponche',            'punch',         'ponche'],
    ['whisky',        'drinks', 'noun', 'uísque',            'whisky',        'whisky'],
    ['vodka',         'drinks', 'noun', 'vodca',             'vodka',         'vodka'],
    ['rum',           'drinks', 'noun', 'rum',               'rum',           'ron'],
    ['gin',           'drinks', 'noun', 'gin',               'gin',           'ginebra'],
    ['tequila',       'drinks', 'noun', 'tequila',           'tequila',       'tequila'],
    ['liqueur',       'drinks', 'noun', 'licor',             'liqueur',       'licor'],
    ['champagne',     'drinks', 'noun', 'champanhe',         'champagne',     'champán'],
    ['cider',         'drinks', 'noun', 'sidra',             'cider',         'sidra'],
    ['mead',          'drinks', 'noun', 'hidromel',          'mead',          'hidromiel'],
    ['sake',          'drinks', 'noun', 'saquê',             'sake',          'sake'],
    ['energy',        'drinks', 'noun', 'energético',        'energy drink',  'bebida energética'],
    ['isotonic',      'drinks', 'noun', 'isotônico',         'sports drink',  'isotónica'],
    ['tonicwater',    'drinks', 'noun', 'água tônica',       'tonic water',   'agua tónica'],
    ['syrup',         'drinks', 'noun', 'xarope',            'syrup',         'jarabe'],
    ['whippedcream',  'drinks', 'noun', 'chantilly',         'whipped cream', 'nata montada'],
    ['caffeine',      'drinks', 'noun', 'cafeína',           'caffeine',      'cafeína'],
    ['distiller',     'drinks', 'noun', 'alambique',         'still',         'alambique'],
    ['straw',         'drinks', 'noun', 'canudo',            'straw',         'pajita'],
    ['icecube',       'drinks', 'noun', 'cubo de gelo',      'ice cube',      'cubito de hielo'],
    ['thermos',       'drinks', 'noun', 'garrafa térmica',   'thermos',       'termo'],
    ['flask',         'drinks', 'noun', 'cantil',            'flask',         'cantimplora'],
    ['bottleopener',  'drinks', 'noun', 'abridor de garrafas', 'bottle opener', 'abrebotellas'],
    ['cork',          'drinks', 'noun', 'rolha',             'cork',          'corcho'],
    ['icebucket',     'drinks', 'noun', 'balde de gelo',     'ice bucket',    'cubitera'],
    ['wineglass',     'drinks', 'noun', 'taça de vinho',     'wine glass',    'copa de vino'],
    ['beermug',       'drinks', 'noun', 'caneca de cerveja', 'beer mug',      'jarra de cerveza'],
    ['tap',           'drinks', 'noun', 'torneira',          'tap',           'grifo'],
    ['thirsty2',      'drinks', 'noun', 'sede',              'thirst',        'sed'],
    ['goblet',        'drinks', 'noun', 'cálice',            'goblet',        'cáliz'],
    ['carafe',        'drinks', 'noun', 'garrafa de decantação', 'decanter',   'jarra de cristal'],
    ['stirrer',       'drinks', 'noun', 'misturador',        'stirrer',       'agitador'],
    ['strainer',      'drinks', 'noun', 'coador',            'strainer',      'colador'],
    ['blender',       'drinks', 'noun', 'liquidificador',    'blender',       'batidora']
  ];

  /* ------------------------------------------------------------ kitchen */
  var kitchen = [
    ['pan2',          'kitchen', 'noun', 'frigideira',       'frying pan',    'sartén'],
    ['pot2',          'kitchen', 'noun', 'panela',           'saucepan',      'cacerola'],
    ['stockpot',      'kitchen', 'noun', 'caldeirão',        'stock pot',     'olla grande'],
    ['lid',           'kitchen', 'noun', 'tampa',            'lid',           'tapa'],
    ['oven',          'kitchen', 'noun', 'forno',            'oven',          'horno'],
    ['stove',         'kitchen', 'noun', 'fogão',            'stove',         'cocina'],
    ['fridge',        'kitchen', 'noun', 'geladeira',        'fridge',        'nevera'],
    ['freezer',       'kitchen', 'noun', 'freezer',          'freezer',       'congelador'],
    ['microwave',     'kitchen', 'noun', 'micro-ondas',      'microwave',     'microondas'],
    ['dishwasher',    'kitchen', 'noun', 'lava-louças',      'dishwasher',    'lavavajillas'],
    ['toaster',       'kitchen', 'noun', 'torradeira',       'toaster',       'tostadora'],
    ['mixer',         'kitchen', 'noun', 'batedeira',        'mixer',         'batidora de mano'],
    ['grill',         'kitchen', 'noun', 'churrasqueira',    'grill',         'barbacoa'],
    ['chopsticks',    'kitchen', 'noun', 'haste',            'chopsticks',    'palillos'],
    ['ladle',         'kitchen', 'noun', 'concha',           'ladle',         'cuchara de servir'],
    ['whisk',         'kitchen', 'noun', 'batedor',          'whisk',         'batidor'],
    ['spatula',       'kitchen', 'noun', 'espátula',         'spatula',       'espátula'],
    ['tongs',         'kitchen', 'noun', 'pinça',            'tongs',         'pinzas'],
    ['peeler',        'kitchen', 'noun', 'descascador',      'peeler',        'pelador'],
    ['grater',        'kitchen', 'noun', 'ralador',          'grater',        'rallador'],
    ['colander',      'kitchen', 'noun', 'escumidor',        'colander',      'colador'],
    ['rollingpin',    'kitchen', 'noun', 'rolo da massa',    'rolling pin',   'rodillo'],
    ['board',         'kitchen', 'noun', 'tábua de corte',   'chopping board', 'tabla de cortar'],
    ['apron',         'kitchen', 'noun', 'avental',          'apron',         'delantal'],
    ['ovenglove',     'kitchen', 'noun', 'luva de forno',    'oven glove',    'guante de horno'],
    ['trivet',        'kitchen', 'noun', 'descanso de panela', 'trivet',       'trivet'],
    ['jar',           'kitchen', 'noun', 'pote',             'jar',           'bote'],
    ['bottle2',       'kitchen', 'noun', 'garrafa',          'bottle',        'botella'],
    ['canister',      'kitchen', 'noun', 'lata',             'tin',           'lata'],
    ['flour',         'kitchen', 'noun', 'farinha',          'flour',         'harina'],
    ['sugar',         'kitchen', 'noun', 'açúcar',           'sugar',         'azúcar'],
    ['salt',          'kitchen', 'noun', 'sal',              'salt',          'sal'],
    ['pepper2',       'kitchen', 'noun', 'pimenta-do-reino', 'black pepper',  'pimienta'],
    ['spice',         'kitchen', 'noun', 'tempero',          'spice',         'especie'],
    ['oil',           'kitchen', 'noun', 'azeite',           'oil',           'aceite'],
    ['vinegar',       'kitchen', 'noun', 'vinagre',          'vinegar',       'vinagre'],
    ['yeast',         'kitchen', 'noun', 'fermento',         'yeast',         'levadura'],
    ['dough',         'kitchen', 'noun', 'massa',            'dough',         'masa'],
    ['recipe',        'kitchen', 'noun', 'receita',          'recipe',        'receta'],
    ['ingredient',    'kitchen', 'noun', 'ingrediente',      'ingredient',    'ingrediente'],
    ['ovenproof',     'kitchen', 'noun', 'assadeira',        'baking tray',   'bandeja de horno'],
    ['rack',          'kitchen', 'noun', 'grade',            'rack',          'rejilla'],
    ['burner',        'kitchen', 'noun', 'boca do fogão',    'burner',        'fogonero'],
    ['sink',          'kitchen', 'noun', 'pia',              'sink',          'fregadero'],
    ['tap2',          'kitchen', 'noun', 'torneira',         'faucet',        'grifo'],
    ['counter',       'kitchen', 'noun', 'bancada',          'counter',       'encimera'],
    ['cabinet',       'kitchen', 'noun', 'armário',          'cabinet',       'armario'],
    ['extractor',     'kitchen', 'noun', 'coifa',            'extractor hood', 'campana'],
    ['dishcloth',     'kitchen', 'noun', 'pano de prato',    'dishcloth',     'trapero'],
    ['sponge',        'kitchen', 'noun', 'esponja',          'sponge',        'esponja'],
    ['bin',           'kitchen', 'noun', 'lixeira',          'bin',           'basura'],
    ['stove2',        'kitchen', 'noun', 'fogareiro',        'camping stove', 'hornillo'],
    ['thermometer',   'kitchen', 'noun', 'termômetro',       'thermometer',   'termómetro'],
    ['timer',         'kitchen', 'noun', 'cronômetro',       'timer',         'cronómetro'],
    ['rodo',         'kitchen', 'noun', 'rodo',              'mop',           'fregona'],
    ['timer2',        'kitchen', 'noun', 'temporizador',     'kitchen timer', 'temporizador de cocina']
  ];

  LLC.data.add(drinks.concat(kitchen));
})(window);
