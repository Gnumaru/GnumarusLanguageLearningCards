/*!
 * art-specs-food.js - Recipes for the drinks and kitchen sets.
 *
 * One line per word. A recipe names a `kind` from art-kinds.js and the
 * parameters it draws with, so forty-nine drinks come out of a dozen kinds and
 * look like one set — which is the point: a learner recognises a whole family
 * from one shape.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var DRINKS_BG = '#e7f6fd';
  var KITCHEN_BG = '#fdf6e8';

  function d(spec) { spec.bg = DRINKS_BG; return spec; }
  function k(spec) { spec.bg = KITCHEN_BG; return spec; }

  var DRINKS = {
    soda:         d({ k: 'can', body: '#dc2626', lid: '#b91c1c', band: '#fdfdff' }),
    sparkling:    d({ k: 'glass', liquid: '#e2e8f0', fill: 0.72, ice: 1, straw: '#0ea5e9' }),
    mineralwater: d({ k: 'bottle', liquid: '#bae6fd', cap: '#0284c7', label: '#f0f9ff', tall: 0.9 }),
    lemonade:     d({ k: 'glass', liquid: '#fde047', fill: 0.8, ice: 1, straw: '#dc2626' }),
    milkshake:    d({ k: 'glass', liquid: '#fdf6e8', fill: 0.82, foam: 1, straw: '#db2777' }),
    smoothie:     d({ k: 'glass', liquid: '#f472b6', fill: 0.78, straw: '#22c55e' }),
    hotchocolate: d({ k: 'mugcup', liquid: '#5a3210', body: '#fdfdff', edge: 'stroke="#cbd5e1" stroke-width="2"', steam: 1 }),
    espresso:     d({ k: 'coffeecup', style: 'demitasse', liquid: '#2b1a0c' }),
    cappuccino:   d({ k: 'coffeecup', style: 'cappuccino' }),
    latte:        d({ k: 'coffeecup', style: 'latte' }),
    americano:    d({ k: 'coffeecup', style: 'saucer', liquid: '#3f2a18' }),
    orangejuice:  d({ k: 'glass', liquid: '#fb923c', fill: 0.78, straw: '#f97316' }),
    applejuice:   d({ k: 'glass', liquid: '#eab308', fill: 0.78, straw: '#16a34a' }),
    tomatojuice:  d({ k: 'glass', liquid: '#ef4444', fill: 0.74 }),
    cocktail:     d({ k: 'wineglass', liquid: '#f472b6', sparkle: 1 }),
    punch:        d({ k: 'bowl', liquid: '#ef4444' }),
    whisky:       d({ k: 'bottle', liquid: '#b45309', cap: '#1c1917', label: '#fdf6e8' }),
    vodka:        d({ k: 'bottle', liquid: '#e2e8f0', cap: '#dc2626', label: '#fdfdff' }),
    rum:          d({ k: 'bottle', liquid: '#92400e', cap: '#1c1917', label: '#fde68a' }),
    gin:          d({ k: 'bottle', liquid: '#d1fae5', cap: '#065f46', label: '#fdfdff' }),
    tequila:      d({ k: 'bottle', liquid: '#d1fae5', cap: '#a16207', label: '#fdf6e8' }),
    liqueur:      d({ k: 'bottle', liquid: '#7c3aed', cap: '#fbbf24', label: '#f5d0fe' }),
    champagne:    d({ k: 'wineglass', liquid: '#fbbf24', sparkle: 1 }),
    cider:        d({ k: 'beermug', beer: '#f0a830' }),
    mead:         d({ k: 'beermug', beer: '#fbbf24' }),
    sake:         d({ k: 'cupsmall', liquid: '#fef3c7', body: '#e2e8f0', edge: 'stroke="#94a3b8" stroke-width="2"' }),
    energy:       d({ k: 'can', body: '#f59e0b', lid: '#b45309', band: '#dc2626' }),
    isotonic:     d({ k: 'bottle', liquid: '#38bdf8', cap: '#0284c7', label: '#f0f9ff', tall: 1.1 }),
    tonicwater:   d({ k: 'glass', liquid: '#cffafe', fill: 0.7, ice: 1, straw: '#0f766e' }),
    syrup:        d({ k: 'bottle', liquid: '#92400e', cap: '#c2410c', label: '#fdf6e8', tall: 0.8 }),
    whippedcream: d({ k: 'cupsmall', liquid: '#fdf6e8', body: '#ffffff', edge: 'stroke="#cbd5e1" stroke-width="2"' }),
    caffeine:     d({ k: 'coffeebean', bean: '#6b4423' }),
    distiller:    d({ k: 'bottle', liquid: '#94a3b8', cap: '#334155', label: '#e2e8f0', tall: 0.95 }),
    straw:        d({ k: 'straw' }),
    icecube:      d({ k: 'icecube' }),
    thermos:      d({ k: 'flask', body: '#334155', liquid: '#0f172a', cap: '#111827' }),
    flask:        d({ k: 'flask', body: '#94a3b8', liquid: '#cbd5e1', cap: '#475569' }),
    bottleopener: d({ k: 'opener' }),
    cork:         d({ k: 'cork' }),
    icebucket:    d({ k: 'icebucket' }),
    wineglass:    d({ k: 'wineglass' }),
    beermug:      d({ k: 'beermug', beer: '#f59e0b' }),
    tap:          d({ k: 'faucet' }),
    thirsty2:     d({ k: 'thirst' }),
    goblet:       d({ k: 'goblet', liquid: '#7c2d12' }),
    carafe:       d({ k: 'carafe', liquid: '#9f1239' }),
    stirrer:      d({ k: 'stirrer' }),
    strainer:     d({ k: 'strainer' }),
    blender:      d({ k: 'blender' })
  };

  var KITCHEN = {
    pan2:         k({ k: 'cookware', body: '#334155', inner: '#475569', handle: 'long' }),
    pot2:         k({ k: 'pot', body: '#64748b', grip: '#475569' }),
    stockpot:     k({ k: 'pot', body: '#475569', grip: '#334155', lid: '#334155', steam: 1 }),
    lid:          k({ k: 'lid' }),
    oven:         k({ k: 'appliance', kind: 'oven', glow: '#f97316' }),
    stove:        k({ k: 'appliance', kind: 'stove' }),
    fridge:       k({ k: 'appliance', kind: 'fridge', sticker: '#38bdf8' }),
    freezer:      k({ k: 'appliance', kind: 'fridge', sticker: '#bae6fd' }),
    microwave:    k({ k: 'appliance', kind: 'microwave' }),
    dishwasher:   k({ k: 'appliance', kind: 'dishwasher' }),
    kettle:       k({ k: 'appliance', kind: 'kettle' }),
    toaster:      k({ k: 'appliance', kind: 'toaster', toast: '#d9a05b' }),
    mixer:        k({ k: 'appliance', kind: 'mixer', cream: '#fdf6e8' }),
    grill:        k({ k: 'appliance', kind: 'grill', steam: 1 }),
    fork:         k({ k: 'utensil', shape: 'fork' }),
    knife:        k({ k: 'utensil', shape: 'knife', grip: '#4a3a2a' }),
    spoon:        k({ k: 'utensil', shape: 'spoon' }),
    chopsticks:   k({ k: 'utensil', shape: 'chopsticks' }),
    ladle:        k({ k: 'utensil', shape: 'ladle' }),
    whisk:        k({ k: 'utensil', shape: 'whisk', grip: '#334155' }),
    spatula:      k({ k: 'utensil', shape: 'spatula', grip: '#334155' }),
    tongs:        k({ k: 'utensil', shape: 'tongs' }),
    peeler:       k({ k: 'utensil', shape: 'peeler', grip: '#0f766e' }),
    grater:       k({ k: 'utensil', shape: 'grater' }),
    colander:     k({ k: 'utensil', shape: 'colander' }),
    rollingpin:   k({ k: 'utensil', shape: 'rollingpin' }),
    board:        k({ k: 'board', wood: '#c98a4b' }),
    apron:        k({ k: 'apron', color: '#b45309', shirt: '#0f172a' }),
    ovenglove:    k({ k: 'mitt', color: '#b45309', steam: 1 }),
    trivet:       k({ k: 'trivet' }),
    jar:          k({ k: 'jar', content: '#f5d33c', lid: '#a16207' }),
    bottle2:      k({ k: 'bottle', liquid: '#4a9e4a', cap: '#166534', label: '#fdf6e8', bg: KITCHEN_BG }),
    canister:     k({ k: 'tin', body: '#cbd5e1', lid: '#94a3b8', label: '#fdf6e8' }),
    flour:        k({ k: 'pantry', shape: 'box', body: '#e7e5e4', flap: '#f5f5f4', label: '#fdfdff' }),
    sugar:        k({ k: 'pantry', shape: 'box', body: '#fdfdff', flap: '#f5f5f4', label: '#e2e8f0' }),
    salt:         k({ k: 'pantry', shape: 'jar', content: '#fdfdff', lid: '#64748b' }),
    pepper2:      k({ k: 'pantry', shape: 'jar', content: '#292524', lid: '#1c1917' }),
    spice:        k({ k: 'pantry', shape: 'jar', content: '#b91c1c', lid: '#7f1d1d' }),
    oil:          k({ k: 'pantry', shape: 'bottle', liquid: '#fbbf24', label: '#fef3c7' }),
    vinegar:      k({ k: 'pantry', shape: 'bottle', liquid: '#7f1d1d', label: '#fee2e2' }),
    yeast:        k({ k: 'pantry', shape: 'jar', content: '#d6c9a8', lid: '#78716c' }),
    dough:        k({ k: 'dough' }),
    recipe:       k({ k: 'recipe' }),
    ingredient:   k({ k: 'ingredient' }),
    ovenproof:    k({ k: 'tray', color: '#475569' }),
    rack:         k({ k: 'rack' }),
    burner:       k({ k: 'burner' }),
    sink:         k({ k: 'sink' }),
    tap2:         k({ k: 'faucet', body: '#94a3b8' }),
    counter:      k({ k: 'counter' }),
    cabinet:      k({ k: 'cabinet' }),
    extractor:    k({ k: 'extractor' }),
    dishcloth:    k({ k: 'softgoods', shape: 'cloth', color: '#38bdf8' }),
    sponge:       k({ k: 'softgoods', shape: 'sponge', color: '#fbcfe8' }),
    bin:          k({ k: 'bin', body: '#94a3b8', lid: '#64748b' }),
    rodo:         k({ k: 'mop' }),
    stove2:       k({ k: 'campingstove' }),
    thermometer:  k({ k: 'thermometer' }),
    timer:        k({ k: 'kitchentimer' }),
    timer2:       k({ k: 'kitchentimer', shape: 'stack' })
  };

  LLC.art.spec(DRINKS);
  LLC.art.spec(KITCHEN);
})(window);
