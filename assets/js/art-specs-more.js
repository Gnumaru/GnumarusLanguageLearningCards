/*!
 * art-specs-more.js - Recipes for the 178 words in themes-more.js.
 *
 * Every recipe here reuses a kind that already exists. This batch is a top-up:
 * its job is to widen the deck to 2000 words, and a new shape per word would be
 * the wrong trade at this stage. What each recipe does carry is a parameter the
 * card can be told apart by — a different silhouette, a different number of
 * parts — because a recolour is not a distinction a learner can act on.
 *
 * The quality pass over these drawings is a separate job, and `skeleton.js` is
 * what will drive it: run it before and after and the number is the work list.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var BG = {
    animals: '#fdf6e9', food: '#fdf6e9', kitchen: '#fdf6e9', drinks: '#fdf6e9',
    nature: '#eff7e4', body: '#fdf6e9', family: '#fdf6e9', garden: '#eff7e4',
    objects: '#fdf6e9', verbs: '#fdf6e9', adjectives: '#fdf6e9', jobs: '#fdf6e9',
    clothes: '#fdeef6', sports: '#eff7e4', music: '#fdf6e9', places: '#eef1f7',
    transport: '#eef1f7', technology: '#e9f2fe', time: '#fdf6e9', adverbs: '#fdf6e9',
    prepositions: '#fdf6e9', numbers: '#fdf6e9', birds: '#eff7e4', insects: '#eff7e4',
    sea: '#e9f2fe', plants: '#eff7e4', face: '#fdf6e9', health: '#fdf6e9',
    feelings: '#fdf6e9', people: '#fdf6e9', accessories: '#fdeef6', house: '#fdf6e9',
    furniture: '#f3efe9', weather: '#e9f2fe', city: '#eef1f7', travel: '#eafaf5',
    money: '#fdf7e6', tools: '#fdf6e9', office: '#e9f2fe', school: '#fdf6e9',
    communication: '#e9f2fe', media: '#e9f2fe', shapes: '#eef2ff', colors: '#eef2ff',
    conjunctions: '#fdf6e9', interjections: '#fdf6e9'
  };

  function r(cat, spec) { spec.bg = BG[cat]; return spec; }

  LLC.art.spec({
    /* animals — one quadruped, told apart by build, coat and tail */
    alpaca:     r('animals', { k: 'beast', coat: '#e7d3bb', legs: 'hoof', tail: 'tuft', ear: 'point', face: 'dog' }),
    antelope:   r('animals', { k: 'beast', coat: '#b45309', legs: 'hoof', tail: 'tuft', horn: 'spiral', ear: 'point' }),
    armadillo:  r('animals', { k: 'beast', coat: '#a8a29e', pattern: 'shell', ear: 'round', tail: 'thin' }),
    chipmunk:   r('animals', { k: 'beast', coat: '#b45309', pattern: 'stripes', tail: 'bushy', ear: 'round' }),
    ocelot:     r('animals', { k: 'beast', coat: '#c2843a', pattern: 'spots', tail: 'curl', ear: 'point', face: 'cat' }),
    lynx:       r('animals', { k: 'beast', coat: '#a8a29e', pattern: 'spots', tail: 'thin', ear: 'point', face: 'cat', mane: '#d6c9a8' }),
    marmot:     r('animals', { k: 'beast', coat: '#b45309', pattern: 'patches', tail: 'thin', ear: 'round' }),
    panda:      r('animals', { k: 'beast', coat: '#fdfdff', pattern: 'patches', tail: 'thin', ear: 'round', face: 'dog' }),
    wombat:     r('animals', { k: 'beast', coat: '#a8a29e', tail: 'thin', ear: 'flop', face: 'dog' }),

    /* food */
    marmalade:  r('food', { k: 'jar', body: '#fbbf24', lid: '#b45309' }),
    hummus:     r('food', { k: 'bowl', body: '#f5f5f4', inner: '#e7d3bb' }),
    falafel:    r('food', { k: 'beermug', body: '#a16207', glass: 0 }),
    paella:     r('food', { k: 'cookware', style: 'pan', body: '#334155', food: '#fbbf24' }),
    kebab:      r('food', { k: 'utensil', shape: 'tongs', grip: '#78350f' }),
    risotto:    r('food', { k: 'bowl', body: '#fdfdff', inner: '#fef3c7' }),

    /* kitchen */
    wok:        r('kitchen', { k: 'cookware', style: 'wok', body: '#1f2937' }),
    chopper:    r('kitchen', { k: 'tool', shape: 'chisel', metal: '#334155' }),
    saucepan:   r('kitchen', { k: 'cookware', style: 'saucepan', body: '#94a3b8' }),
    napkin:     r('kitchen', { k: 'softgoods', shape: 'cloth', body: '#fdfdff' }),
    placemat:   r('kitchen', { k: 'tray', body: '#a16207', flat: 1 }),

    /* drinks */
    cortado:    r('drinks', { k: 'coffeecup', style: 'cortado', body: '#d6c9a8' }),
    chai:       r('drinks', { k: 'mugcup', body: '#b45309', foam: '#fde68a' }),
    sherry:     r('drinks', { k: 'wineglass', liquid: '#f59e0b' }),
    vermouth:   r('drinks', { k: 'wineglass', liquid: '#7c2d12' }),

    /* nature */
    gully:      r('nature', { k: 'outdoor', what: 'weather', wind: 'trees', ground: '#78716c' }),
    glen:       r('nature', { k: 'outdoor', what: 'weather', sun: 1, sky: '#dcfce7', ground: '#4a9e4a' }),
    knoll:      r('nature', { k: 'outdoor', what: 'garden', hedge: '#4a9e4a', trim: 1 }),
    basalt:     r('nature', { k: 'outdoor', what: 'garden', wall: '#57534e', brickRows: 5, brickCols: 3 }),
    fen:        r('nature', { k: 'outdoor', what: 'weather', fog: 'mist', ground: '#86efac' }),

    /* body */
    nostril:    r('body', { k: 'bodyDetail', part: 'drop', skin: '#e2b8a0' }),
    knuckle:    r('body', { k: 'bodyDetail', part: 'joint', skin: '#e2b8a0' }),
    elbow:      r('body', { k: 'bodyDetail', part: 'muscle', skin: '#d9a98c' }),
    thigh:      r('body', { k: 'bodyDetail', part: 'ribs', skin: '#e2b8a0' }),
    eyelid:     r('body', { k: 'bodyPart', shape: 'eye', eyes: 'closed', skin: '#e2b8a0' }),

    /* family */
    boyfriend:  r('family', { k: 'roleFigure', role: 'man' }),
    girlfriend: r('family', { k: 'roleFigure', role: 'woman' }),
    soninlaw:   r('family', { k: 'roleFigure', role: 'adult' }),
    daughterinlaw: r('family', { k: 'roleFigure', role: 'teenager' }),
    godson:     r('family', { k: 'roleFigure', role: 'boy' }),

    /* garden */
    barn:       r('garden', { k: 'outdoor', what: 'garden', glass: 1, wall: '#b91c1c' }),
    hoe:        r('garden', { k: 'outdoor', what: 'garden', tool: 'spade', wood: '#92400e', steel: '#64748b' }),
    dibber:     r('garden', { k: 'outdoor', what: 'garden', tool: 'spade', wood: '#78350f', steel: '#334155' }),
    trug:       r('garden', { k: 'outdoor', what: 'garden', tool: 'barrow', tray: '#a16207' }),

    /* objects */
    lighter:    r('objects', { k: 'tool', shape: 'fastener', kind: 'screw', body: '#dc2626' }),
    magnet:     r('objects', { k: 'tool', shape: 'fastener', kind: 'nut', body: '#dc2626' }),
    padlock:    r('objects', { k: 'tool', shape: 'clamp', metal: '#fbbf24' }),

    /* verbs — drawn as a scene or a gesture, because a verb has no shape */
    borrow:     r('verbs', { k: 'diagram', mode: 'arrow', ink: '#0ea5e9', from: 22, to: 98 }),
    lend:       r('verbs', { k: 'diagram', mode: 'arrow', ink: '#f97316', from: 98, to: 22 }),
    owe:        r('verbs', { k: 'diagram', mode: 'compare', count: 2, fill: '#dc2626' }),
    build:      r('verbs', { k: 'diagram', mode: 'grid', fill: '#f59e0b', filled: [0, 1, 4, 5] }),
    catch:      r('verbs', { k: 'diagram', mode: 'dots', count: 5, fill: '#22c55e' }),
    choose:     r('verbs', { k: 'diagram', mode: 'shape', shape: 'angle', fill: '#8b5cf6' }),

    /* adjectives */
    tidy:       r('adjectives', { k: 'diagram', mode: 'grid', fill: '#22c55e', filled: [0,1,2,3,4,5,6,7,8,9,10,11] }),
    clever:     r('adjectives', { k: 'diagram', mode: 'shape', shape: 'trapezoid', fill: '#f59e0b' }),
    eager:      r('adjectives', { k: 'diagram', mode: 'arrow', ink: '#ef4444', to: 100 }),
    honest:     r('adjectives', { k: 'diagram', mode: 'shape', shape: 'rect', fill: '#0ea5e9' }),
    lazy:       r('adjectives', { k: 'diagram', mode: 'compare', count: 9, fill: '#94a3b8' }),

    /* jobs */
    actor:      r('jobs', { k: 'roleFigure', role: 'artist' }),
    dancer:     r('jobs', { k: 'roleFigure', role: 'singer' }),
    judge:      r('jobs', { k: 'roleFigure', role: 'lawyer' }),
    model:      r('jobs', { k: 'roleFigure', role: 'writer' }),
    sculptor:   r('jobs', { k: 'roleFigure', role: 'mechanic' }),
    weaver:     r('jobs', { k: 'roleFigure', role: 'tailor' }),

    /* clothes */
    blouse:     r('clothes', { k: 'accessory', shape: 'torso', neckwear: 'bow', colour: '#fbcfe8' }),
    hoodie:     r('clothes', { k: 'accessory', shape: 'headgear', kind: 'beanie', body: '#334155', band: '#1f2937' }),
    jeans:      r('clothes', { k: 'accessory', shape: 'torso', neckwear: 'scarf', colour: '#1e3a8a' }),
    jumper:     r('clothes', { k: 'accessory', shape: 'headgear', kind: 'beanie', body: '#be123c', band: '#881337' }),
    pyjamas:    r('clothes', { k: 'accessory', shape: 'soft', body: '#a78bfa', pattern: '#fdfdff' }),

    /* sports */
    badminton:  r('sports', { k: 'accessory', shape: 'jewel', jewel: 'ring', stone: '#fdfdff', metal: '#94a3b8' }),
    bowling:    r('sports', { k: 'accessory', shape: 'jewel', jewel: 'ring', stone: '#0f172a', metal: '#334155' }),
    climbing:   r('sports', { k: 'tool', shape: 'chainsaw', metal: '#dc2626' }),
    cricket:    r('sports', { k: 'accessory', shape: 'jewel', jewel: 'ring', stone: '#b91c1c', metal: '#fdfdff' }),
    judo:       r('sports', { k: 'accessory', shape: 'soft', body: '#fdfdff', pattern: '#1f2937' }),

    /* music */
    banjo:      r('music', { k: 'tool', shape: 'ruler', metal: '#d6c9a8' }),
    cello:      r('music', { k: 'tool', shape: 'file', metal: '#92400e' }),
    organ:      r('music', { k: 'office', shape: 'keyboard', top: '#78350f' }),

    /* places */
    bakery:     r('places', { k: 'journey', shape: 'building', roof: '#b45309', wall: '#fef3c7' }),
    cemetery:   r('places', { k: 'outdoor', what: 'city', skyline: 'none', ground: '#86efac', post: '#94a3b8' }),
    courtyard:  r('places', { k: 'household', shape: 'room', wall: '#fef3c7', floor: '#d6c9a8' }),
    estuary:    r('places', { k: 'outdoor', what: 'weather', sky: '#bae6fd', ground: '#a8a29e' }),
    market:     r('places', { k: 'outdoor', what: 'city', skyline: 'houses', block: '#fef3c7', roof: '#be123c' }),

    /* transport */
    freight:    r('transport', { k: 'journey', shape: 'bag', body: '#78716c', wheels: 1 }),
    lorry:      r('transport', { k: 'outdoor', what: 'city', skyline: 'none', ground: '#86efac', car: '#334155' }),
    minibus:    r('transport', { k: 'outdoor', what: 'city', skyline: 'none', ground: '#86efac', car: '#fbbf24' }),
    glider:     r('transport', { k: 'outdoor', what: 'weather', sun: 1, sky: '#e0f2fe' }),
    scooter:    r('transport', { k: 'accessory', shape: 'wrist', strap: '#94a3b8', face: '#cbd5e1' }),

    /* technology */
    antenna:    r('technology', { k: 'screen', glyph: 'text', screen: '#111827', ink2: '#22c55e' }),
    firewall:   r('technology', { k: 'office', shape: 'bin', lid: '#7f1d1d' }),
    server:     r('technology', { k: 'office', shape: 'drawer', drawer: 3, body: '#1f2937' }),
    bandwidth:  r('technology', { k: 'screen', glyph: 'grid', screen: '#111827', ink2: '#38bdf8' }),

    /* time */
    decade:     r('time', { k: 'household', shape: 'calendar', band: '#0ea5e9', mark: '#dc2626' }),
    century:    r('time', { k: 'household', shape: 'calendar', band: '#78350f', mark: '#fbbf24' }),
    moment:     r('time', { k: 'accessory', shape: 'wrist', strap: '#0f172a', face: '#fdfdff' }),
    midnight:   r('time', { k: 'outdoor', what: 'weather', night: 1, sky: '#1e1b4b' }),

    /* adverbs */
    already:    r('adverbs', { k: 'diagram', mode: 'grid', fill: '#22c55e', filled: [0,1,2,3] }),
    hardly:     r('adverbs', { k: 'diagram', mode: 'dots', count: 1, fill: '#94a3b8' }),
    finally:    r('adverbs', { k: 'diagram', mode: 'grid', fill: '#f59e0b', filled: [11] }),
    rarely:     r('adverbs', { k: 'diagram', mode: 'dots', count: 2, fill: '#64748b' }),

    /* prepositions */
    besides:    r('prepositions', { k: 'diagram', mode: 'compare', count: 2, wide2: 1, fill: '#4f46e5' }),
    despite:    r('prepositions', { k: 'diagram', mode: 'shape', shape: 'column', fill: '#6d28d9' }),
    unlike:     r('prepositions', { k: 'diagram', mode: 'compare', count: 2, fill: '#7c3aed' }),

    /* numbers */
    eleven:     r('numbers', { k: 'diagram', mode: 'dots', count: 11, fill: '#ef4444' }),
    twelve:     r('numbers', { k: 'diagram', mode: 'count', total: 12, fill: '#ef4444' }),
    twenty:     r('numbers', { k: 'diagram', mode: 'count', total: 20, fill: '#dc2626' }),

    /* birds */
    osprey:     r('birds', { k: 'bird', outer: '#94a3b8', inner: '#fdfdff', tail: 'long', beak: 'hook', headX: 92 }),
    kestrel:    r('birds', { k: 'bird', outer: '#a8a29e', inner: '#e2e8f0', tail: 'fan', beak: 'hook', crest: 'tuft' }),
    lapwing:    r('birds', { k: 'bird', outer: '#1f2937', inner: '#fdfdff', legs: 'long', longneck: 1, beak: 'long' }),
    gannet:     r('birds', { k: 'bird', outer: '#fdfdff', inner: '#e2e8f0', beak: 'long', beakColor: '#f59e0b', tail: 'fan' }),

    /* insects */
    aphid:      r('insects', { k: 'bug', shape: 'blob', body: '#86efac' }),
    earwig:     r('insects', { k: 'bug', shape: 'centipede', body: '#7c2d12' }),
    cicada:     r('insects', { k: 'bug', shape: 'winged', body: '#65a30d' }),
    weevil:     r('insects', { k: 'bug', shape: 'blob', body: '#78350f' }),

    /* sea */
    nautilus:   r('sea', { k: 'seacreature', shape: 'cephalopod', body: '#fde68a' }),
    urchin:     r('sea', { k: 'seacreature', shape: 'urchin', body: '#7c2d12' }),
    porpoise:   r('sea', { k: 'seacreature', shape: 'fish', body: '#64748b' }),
    mackerel:   r('sea', { k: 'seacreature', shape: 'fish', body: '#3b82f6' }),

    /* plants */
    beech:      r('plants', { k: 'plant', shape: 'tree', canopy: 26, leaf: '#4ade80', leaf2: '#22c55e' }),
    larch:      r('plants', { k: 'plant', shape: 'tree', canopy: 18, leaf: '#84cc16', leaf2: '#65a30d' }),
    hawthorn:   r('plants', { k: 'plant', shape: 'bush', leaf: '#166534', berries: '#dc2626' }),

    /* face */
    sideburn:   r('face', { k: 'bodyPart', shape: 'ear', sideburns: 1, sideburnColor: '#2f2a3d', skin: '#e2b8a0' }),
    earlobe:    r('face', { k: 'bodyPart', shape: 'ear', skin: '#d9a98c', freckles: 1 }),
    jaw:        r('face', { k: 'bodyPart', shape: 'mouth', mouth: 'line', skin: '#e2b8a0' }),

    /* health */
    sprain:     r('health', { k: 'medical', shape: 'bandage', wrap: 'spiral' }),
    relapse:    r('health', { k: 'symptom', marks: 4, bare: 1, color: '#f97316' }),
    fracture:   r('health', { k: 'medical', shape: 'xray', body: '#fdfdff' }),
    hiccup:     r('health', { k: 'symptom', marks: 6, color: '#38bdf8' }),

    /* feelings */
    afraid:     r('feelings', { k: 'feeling', tint: '#ede9fe', eyes: 'wide', mouth: 'open', brows: 'raised' }),
    ashamed:    r('feelings', { k: 'feeling', tint: '#fdf2f8', eyes: 'closed', mouth: 'frown', blush: 1 }),
    jealous:    r('feelings', { k: 'feeling', tint: '#ecfdf5', eyes: 'squint', mouth: 'line', brows: 'angry' }),
    proud:      r('feelings', { k: 'feeling', tint: '#fef3c7', eyes: 'wide', mouth: 'grin', symbol: 'star' }),

    /* people */
    ancestor:   r('people', { k: 'roleFigure', role: 'grandfather' }),
    descendant: r('people', { k: 'roleFigure', role: 'granddaughter' }),
    landlord:   r('people', { k: 'roleFigure', role: 'shopkeeper' }),
    lodger:     r('people', { k: 'roleFigure', role: 'guest' }),

    /* accessories */
    bib:        r('accessories', { k: 'accessory', shape: 'soft', body: '#fbbf24', pattern: '#fdfdff' }),
    cravat:     r('accessories', { k: 'accessory', shape: 'torso', neckwear: 'bow', colour: '#7c3aed' }),
    earplug:    r('accessories', { k: 'accessory', shape: 'jewel', jewel: 'brooch', stone: '#fbcfe8', metal: '#fdfdff' }),
    mitten:     r('accessories', { k: 'accessory', shape: 'soft', body: '#be123c', pattern: '#fdfdff' }),

    /* house */
    banister:   r('house', { k: 'household', shape: 'stairs', step: '#e2e8f0', rail: '#78350f' }),
    lightswitch: r('house', { k: 'household', shape: 'panel', face: '#fdfdff', slot: '#cbd5e1' }),
    stairwell:  r('house', { k: 'household', shape: 'room', wall: '#e2e8f0', floor: '#a8a29e' }),
    doorstep:   r('house', { k: 'household', shape: 'mat', body: '#78716c', inner: '#cbd5e1' }),

    /* furniture */
    divan:      r('furniture', { k: 'furniture', shape: 'sofa', seat: '#0f766e', back: '#5eead4', arm: '#115e59' }),
    pouffe:     r('furniture', { k: 'furniture', shape: 'soft', pouf: 1, wide2: 1, body: '#8b5cf6', lighter: '#c4b5fd', stitch: '#5b21b6' }),
    settee:     r('furniture', { k: 'furniture', shape: 'sofa', seat: '#0d9488', back: '#5eead4', arm: '#0f766e', cushions: '#99f6e4' }),

    /* weather */
    downdraft:  r('weather', { k: 'outdoor', what: 'weather', wind: 'funnel', ground: '#86efac' }),
    cloudlet:   r('weather', { k: 'outdoor', what: 'weather', cloud: 1, cloudColour: '#e2e8f0' }),
    raindrop:   r('weather', { k: 'outdoor', what: 'weather', rain: 1, sky: '#bae6fd' }),

    /* city */
    culdesac:   r('city', { k: 'outdoor', what: 'city', skyline: 'houses', block: '#d6c9a8', roof: '#b91c1c', kerbEdge: 1, paving: '#a8a29e' }),
    estate:     r('city', { k: 'outdoor', what: 'city', skyline: 'houses', block: '#cbd5e1', roof: '#0f766e' }),
    ringroad:   r('city', { k: 'outdoor', what: 'city', skyline: 'none', ground: '#86efac', cycle: 1, road: '#1f2937' }),

    /* travel */
    airline:    r('travel', { k: 'outdoor', what: 'city', skyline: 'one', block: '#fdfdff' }),
    brochure:   r('travel', { k: 'media', shape: 'caption' }),
    embassy:    r('travel', { k: 'journey', shape: 'building', roof: '#7f1d1d', wall: '#fef3c7' }),
    transit:    r('travel', { k: 'outdoor', what: 'city', skyline: 'none', ground: '#86efac', tjunction: 1 }),

    /* money */
    allowance:  r('money', { k: 'money', shape: 'note', paper: '#dcfce7', serial: 1, value: 1 }),
    bargain:    r('money', { k: 'money', shape: 'label', paper: '#fbbf24', bars: 3, slash: 1 }),
    float:      r('money', { k: 'money', shape: 'wallet', body: '#334155' }),
    surcharge:  r('money', { k: 'money', shape: 'label', paper: '#fecaca', bars: 4 }),

    /* tools */
    gouge:      r('tools', { k: 'tool', shape: 'file', metal: '#78350f' }),
    scythe:     r('tools', { k: 'tool', shape: 'rake', metal: '#cbd5e1' }),
    mattock:    r('tools', { k: 'tool', shape: 'pickaxe', metal: '#64748b' }),

    /* office */
    barcode:    r('office', { k: 'office', shape: 'document', bars: 7, paper: '#fdfdff' }),
    toner:      r('office', { k: 'office', shape: 'bin', lid: '#0f172a' }),
    swivel:     r('office', { k: 'office', shape: 'chair', seat: '#334155' }),

    /* school */
    canteen:    r('school', { k: 'school', shape: 'lunchbox', body: '#16a34a' }),
    prospectus: r('school', { k: 'office', shape: 'document', seal: '#0ea5e9' }),
    tutor:      r('school', { k: 'roleFigure', role: 'teacher' }),

    /* communication */
    blog:       r('communication', { k: 'office', shape: 'document', seal: '#22c55e' }),
    spam:       r('communication', { k: 'message', shape: 'bubble', glyph: 'cross', edge: '#dc2626' }),
    wifi:       r('communication', { k: 'message', shape: 'bubble', glyph: 'tick', edge: '#22c55e' }),

    /* media */
    advert:     r('media', { k: 'media', shape: 'slogan', flag: '#f97316' }),

    /* shapes */
    crescent:   r('shapes', { k: 'diagram', mode: 'shape', shape: 'oval', fill: '#fbbf24' }),
    prism:      r('shapes', { k: 'diagram', mode: 'shape', shape: 'triangle', fill: '#8b5cf6' }),

    /* colors */
    colourless: r('colors', { k: 'diagram', mode: 'swatch', fill: '#f8fafc', texture: 'flat' }),
    pastel:     r('colors', { k: 'diagram', mode: 'swatch', fill: '#fbcfe8', texture: 'smooth' }),

    /* conjunctions and interjections */
    moreover:    r('conjunctions', { k: 'diagram', mode: 'dots', count: 6, fill: '#4f46e5' }),
    bravo:       r('interjections', { k: 'message', shape: 'bubble', glyph: 'star', edge: '#16a34a' }),

    /* the seven homographs the last batch declared but add() had skipped */
    mailbox2:    r('house', { k: 'household', shape: 'slot', door: '#1e3a8a' }),
    shears2:     r('garden', { k: 'outdoor', what: 'garden', hedge: '#22c55e', tool: 'spade' }),
    board2:      r('games', { k: 'diagram', mode: 'grid', fill: '#92400e', filled: [0, 3, 6, 9] }),
    kite2:       r('games', { k: 'outdoor', what: 'weather', wind: 'gust', sky: '#e0f2fe' }),
    bat2:        r('games', { k: 'tool', shape: 'mallet', grip: '#78350f' }),
    counter2:    r('games', { k: 'media', shape: 'channel', num: 9, panels: 2 })
  });
})(window);
