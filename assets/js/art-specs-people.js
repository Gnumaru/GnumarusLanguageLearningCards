/*!
 * art-specs-people.js - Recipes for the people group.
 *
 * Animals, birds, insects, the sea, plants, the body, the face, health,
 * feelings, people, family and jobs.
 *
 * The whole point of these recipes is that related words look related. A horse
 * and a goat are one quadruped with a different coat; every bird is one bird
 * with a different beak; a symptom is one body with a mark in a different
 * place; a job is one person with a different hat and a different tool. A
 * learner flipping through these cards should feel they are looking at one
 * illustrated set, not three hundred unrelated pictures.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var BG = {
    animals: '#fff1e0', birds: '#f2edff', insects: '#f0f8e4', sea: '#e2f4fb',
    plants: '#edf6df', body: '#fceff6', face: '#fbeef5', health: '#fdecee',
    feelings: '#f7ecff', people: '#f7efe8', family: '#f3f1ff', jobs: '#eefaf7'
  };

  function r(cat, spec) { spec.bg = BG[cat]; return spec; }

  /* ------------------------------------------------------------ animals (27) */
  var animals = {
    hamster:   r('animals', { k: 'beast', coat: '#d9b38c', ear: 'round', tail: 'thin', muzzle: '#f5e0c8', headX: 86 }),
    parrot:    r('animals', { k: 'bird', body: '#e0457f', beak: 'hook', beakColor: '#fde68a', tail: 'long', tailColor: '#22c55e', headY: 42 }),
    kangaroo:  r('animals', { k: 'beast', coat: '#c98a4b', ear: 'point', tail: 'tuft', muzzle: '#f5e0c8' }),
    fox:       r('animals', { k: 'beast', coat: '#e07a3c', ear: 'point', tail: 'bushy', muzzle: '#fdfdff', face: 'cat' }),
    wolf:      r('animals', { k: 'beast', coat: '#8a94a8', ear: 'point', tail: 'bushy', muzzle: '#cbd5e1' }),
    deer:      r('animals', { k: 'beast', coat: '#c98a4b', ear: 'point', tail: 'tuft', horn: '#8a6a4a', horn2: '#8a6a4a', muzzle: '#f5e0c8' }),
    donkey:    r('animals', { k: 'beast', coat: '#a8a29e', ear: 'flop', tail: 'tuft', muzzle: '#e8e4dc' }),
    camel:     r('animals', { k: 'beast', coat: '#d9a05b', ear: 'round', tail: 'thin', muzzle: '#f5e0c8' }),
    leopard:   r('animals', { k: 'beast', coat: '#fbbf24', ear: 'round', tail: 'long', pattern: 'spots', mark: '#3f2a1a', muzzle: '#fdfdff', face: 'cat' }),
    rhino:     r('animals', { k: 'beast', coat: '#94a3b8', ear: 'round', tail: 'thin', horn: '#e2e8f0', snout: 1, muzzle: '#cbd5e1' }),
    hippo:     r('animals', { k: 'beast', coat: '#a8a29e', ear: 'round', tail: 'thin', snout: 1, muzzle: '#c4a8a0' }),
    swan:      r('animals', { k: 'bird', body: '#fdfdff', outline: 1, beak: 'long', beakColor: '#f59e0b', longneck: 1, headY: 24, headX: 90, neckX: 64 }),
    eagle:     r('animals', { k: 'bird', body: '#6b4423', beak: 'hook', beakColor: '#fbbf24', wing: '#8a5a33', tail: 'fan', headY: 44 }),
    ostrich:   r('animals', { k: 'bird', body: '#e7e5e4', beak: 'long', beakColor: '#f0a830', legs: 'long', longneck: 1, headY: 18, headX: 90, neckX: 62 }),
    crow:      r('animals', { k: 'bird', body: '#2f2a3d', beak: 'hook', beakColor: '#2f2a3d', wing: '#4a4453', headY: 44 }),
    dove:      r('animals', { k: 'bird', body: '#c4cfdb', beakColor: '#94a3b8', wing: '#a8b8c8', headY: 44 }),
    flamingo:  r('animals', { k: 'bird', body: '#fb7185', beak: 'hook', beakColor: '#2f2a3d', legs: 'long', longneck: 1, headY: 24, headX: 88, neckX: 64 }),
    hedgehog:  r('animals', { k: 'beast', coat: '#a8763f', ear: 'round', tail: 'none', pattern: 'patches', mark: '#5a3a22', muzzle: '#f5e0c8', headX: 86 }),
    bat:       r('animals', { k: 'beast', coat: '#5a4a6a', ear: 'point', wing: '#7c6a99', rib: '#3a2f45',
                             tail: 'none', pattern: 'patches', mark: '#3f3350', muzzle: '#8a7a9a', headX: 88 }),
    otter:     r('animals', { k: 'beast', coat: '#8a5a33', ear: 'round', tail: 'bushy', muzzle: '#e8c9a0', headX: 86 }),
    seal:      r('animals', { k: 'beast', coat: '#94a3b8', ear: 'none', tail: 'fan', muzzle: '#cbd5e1', headX: 88 }),
    shark:     r('animals', { k: 'seacreature', shape: 'shark', body: '#94a3b8', fin: '#7f8fa3', waterColor: '#cfe4f5', sandColor: '#bfe0f7' }),
    octopus:   r('animals', { k: 'seacreature', shape: 'cephalopod', body: '#f472b6', waterColor: '#cfe4f5', sandColor: '#bfe0f7' }),
    jellyfish: r('animals', { k: 'seacreature', shape: 'jelly', body: '#c4b5fd', waterColor: '#e0f2fe' }),
    starfish:  r('animals', { k: 'seacreature', shape: 'star', body: '#f97316', mark: '#fdba74', waterColor: '#cfe4f5', sandColor: '#f5d9a8' }),
    turtle:    r('animals', { k: 'seacreature', shape: 'shellfish', shell: '#4a7a4a', ridge: '#2f5c38', waterColor: '#cfe4f5', sandColor: '#f5d9a8' }),
    goldfish:  r('animals', { k: 'seacreature', shape: 'fish', body: '#f59e0b', fin: '#fbbf24', mark: '#fde68a', deep: 1, tail: 'fork', dorsal: 'tall', tailX: 84, waterColor: '#dbeafe', sandColor: '#f5d9a8' })
  };

  /* --------------------------------------------------------------- birds (31) */
  var birds = {
    pigeon:      r('birds', { k: 'bird', body: '#94a3b8', beakColor: '#94a3b8', cheek: '#c4a8a0', headY: 42 }),
    sparrow:     r('birds', { k: 'bird', body: '#a8763f', beakColor: '#f59e0b', headY: 44 }),
    seagull:     r('birds', { k: 'bird', body: '#fdfdff', outline: 1, beakColor: '#f59e0b', wing: '#dbeafe', headY: 42 }),
    stork:       r('birds', { k: 'bird', body: '#fdfdff', outline: 1, beak: 'long', beakColor: '#dc2626', legs: 'long', longneck: 1, headY: 22, headX: 90, neckX: 62 }),
    heron:       r('birds', { k: 'bird', body: '#94a3b8', beak: 'long', beakColor: '#f59e0b', legs: 'long', longneck: 1, headY: 22, headX: 90, neckX: 62 }),
    peacock:     r('birds', { k: 'bird', body: '#0ea5e9', beakColor: '#f59e0b', tail: 'fan', tailColor: '#0d9488', headY: 42 }),
    canary:      r('birds', { k: 'bird', body: '#f5d33c', beakColor: '#f59e0b', headY: 44 }),
    macaw:       r('birds', { k: 'bird', body: '#dc2626', beak: 'hook', beakColor: '#1f2937', tail: 'long', tailColor: '#2563eb', headY: 40 }),
    hawk:        r('birds', { k: 'bird', body: '#8a6a4a', beak: 'hook', beakColor: '#f59e0b', tail: 'fan', headY: 44 }),
    vulture:     r('birds', { k: 'bird', body: '#57534e', beak: 'hook', beakColor: '#d6c9a8', tail: 'fan', headY: 46, headX: 86 }),
    hummingbird: r('birds', { k: 'bird', body: '#22c55e', beak: 'long', beakColor: '#1f2937', tail: 'fan', headY: 44 }),
    pelican:     r('birds', { k: 'bird', body: '#cbd5e1', beak: 'wide', beakColor: '#f59e0b', headY: 40 }),
    toucan:      r('birds', { k: 'bird', body: '#1f2937', beak: 'hook', beakColor: '#f59e0b', headY: 40 }),
    magpie:      r('birds', { k: 'bird', body: '#1f2937', beakColor: '#f59e0b', tail: 'long', headY: 44 }),
    nightingale: r('birds', { k: 'bird', body: '#a8763f', beakColor: '#6b4423', headY: 46 }),
    swallow:     r('birds', { k: 'bird', body: '#3f5a8a', beakColor: '#dc2626', tail: 'long', headY: 44 }),
    robin:       r('birds', { k: 'bird', body: '#64748b', beakColor: '#f59e0b', cheek: '#e0788a', headY: 44 }),
    cockatoo:    r('birds', { k: 'bird', body: '#fdfdff', outline: 1, beak: 'hook', beakColor: '#475569', crest: '#fcd34d', headY: 44 }),
    albatross:   r('birds', { k: 'bird', body: '#fdfdff', outline: 1, beak: 'long', beakColor: '#f59e0b', tail: 'long', wing: '#e2e8f0', headY: 44 }),
    cormorant:   r('birds', { k: 'bird', body: '#334155', beak: 'long', beakColor: '#f59e0b', longneck: 1, headY: 22, headX: 90, neckX: 64 }),
    kingfisher:  r('birds', { k: 'bird', body: '#0ea5e9', beak: 'long', beakColor: '#1f2937', wing: '#bae6fd', headY: 40 }),
    condor:      r('birds', { k: 'bird', body: '#2f2a3d', beak: 'hook', beakColor: '#d6c9a8', tail: 'fan', headY: 46 }),
    quail:       r('birds', { k: 'bird', body: '#a8763f', beakColor: '#f59e0b', pattern: 'spot', headY: 46 }),
    puffin:      r('birds', { k: 'bird', body: '#2f2a3d', beak: 'wide', beakColor: '#f97316', wing: '#fdfdff', headY: 40 }),
    starling:    r('birds', { k: 'bird', body: '#1f2937', beakColor: '#f59e0b', pattern: 'spot', headY: 44 }),
    wren:        r('birds', { k: 'bird', body: '#8a6a4a', beakColor: '#6b4423', tail: 'fan', headY: 46 }),
    sandpiper:   r('birds', { k: 'bird', body: '#cbd5e1', beak: 'long', beakColor: '#f59e0b', legs: 'long', headY: 42 }),
    parakeet:    r('birds', { k: 'bird', body: '#22c55e', beak: 'hook', beakColor: '#f59e0b', tail: 'long', headY: 42 }),
    kite:        r('birds', { k: 'bird', body: '#cbd5e1', beak: 'hook', beakColor: '#f59e0b', tail: 'fan', headY: 44 }),
    chick:       r('birds', { k: 'bird', body: '#fbbf24', beakColor: '#f97316', headY: 46, headX: 82 }),
    nest:        r('birds', { k: 'bird', shape: 'nest' })
  };

  /* ------------------------------------------------------------ insects (24) */
  var insects = {
    housefly:   r('insects', { k: 'flyer', body: '#334155', thorax: 12, legs: 1, wings: '#cbd5e1', eyes: '#dc2626' }),
    ant:         r('insects', { k: 'flyer', body: '#7f1d1d', thorax: 10, thoraxColor: '#b91c1c', legs: 1, antennae: '#7f1d1d' }),
    mosquito:    r('insects', { k: 'flyer', body: '#4a4453', thorax: 7, legs: 1, wings: '#e2e8f0', antennae: '#4a4453' }),
    cockroach:   r('insects', { k: 'flyer', body: '#7c2d12', thorax: 12, legs: 1, antennae: '#7c2d12', abdomen: 22, abdomenH: 26 }),
    beetle:      r('insects', { k: 'flyer', body: '#166534', thorax: 13, thoraxColor: '#22c55e', legs: 1, spots: 1, mark: '#fbbf24' }),
    grasshopper: r('insects', { k: 'flyer', body: '#4a9e4a', thorax: 10, legs: 1, wings: '#86efac', abdomenX: 74, abdomen: 20, abdomenH: 32 }),
    caterpillar: r('insects', { k: 'bug', shape: 'larva', body: '#84cc16', alt: '#a3e635', hair: '#4d7c0f' }),
    worm:        r('insects', { k: 'bug', shape: 'larva', body: '#c084e0', alt: '#d8b4ec', segments: 9, eyes: false }),
    slug:        r('insects', { k: 'bug', shape: 'slug', body: '#a3a3a3', ridge: '#78716c' }),
    centipede:   r('insects', { k: 'bug', shape: 'centipede', body: '#7c2d12', head: '#5c1a0a', legs: '#5c1a0a' }),
    scorpion:    r('insects', { k: 'bug', shape: 'arachnid', body: '#1f2937', ridge: '#111827', legs: '#374151', sting: '#f59e0b' }),
    tick:        r('insects', { k: 'bug', shape: 'blob', body: '#9ca3af', ridge: '#6b7280', head: '#d1d5db', legs: '#6b7280' }),
    termite:     r('insects', { k: 'bug', shape: 'larva', body: '#d6c3a0', alt: '#c2ab84', edge: '#8a7550', segments: 10, eyes: false }),
    wasp:        r('insects', { k: 'flyer', body: '#f5d33c', thorax: 10, legs: 1, stripes: 1, mark: '#78350f', wings: '#fef3c7', abdomen: 20, abdomenH: 26 }),
    hornet:      r('insects', { k: 'flyer', body: '#e0a800', thorax: 14, legs: 1, stripes: 1, mark: '#1f2937', wings: '#cbd5e1', abdomen: 22, abdomenH: 28 }),
    ladybug:     r('insects', { k: 'flyer', body: '#dc2626', thorax: 10, thoraxColor: '#2f2a3d', legs: 1, spots: 1, mark: '#1f2937' }),
    dragonfly:   r('insects', { k: 'flyer', body: '#0ea5e9', thorax: 9, legs: 1, wings: '#bae6fd', abdomenX: 66, abdomen: 8, abdomenH: 36 }),
    flea:        r('insects', { k: 'bug', shape: 'blob', body: '#78350f', ridge: '#451a03', head: '#92400e', legs: '#451a03' }),
    louse:       r('insects', { k: 'bug', shape: 'blob', body: '#e7d3bb', ridge: '#c9b79c', head: '#dbc4a8', legs: '#c9b79c' }),
    moth:        r('insects', { k: 'bug', shape: 'winged', body: '#8a5a33', head: '#8a5a33', wings: '#d6c9a8', ridge: '#a89878', legs: '#8a5a33', spots: '#4a3728' }),
    locust:      r('insects', { k: 'flyer', body: '#a3a3a3', thorax: 10, legs: 1, wings: '#d4d4d4', abdomenX: 74, abdomen: 20, abdomenH: 32 }),
    bumblebee:   r('insects', { k: 'flyer', body: '#fbbf24', thorax: 14, thoraxColor: '#fde68a', legs: 1, stripes: 1, mark: '#78350f', wings: '#fef3c7' }),
    mantis:      r('insects', { k: 'bug', shape: 'praying', body: '#4a9e4a', head: '#3f8f4a', legs: '#3f8f4a' }),
    glowworm:    r('insects', { k: 'flyer', body: '#4a4453', thorax: 9, legs: 1, glow: '#fde047' }),
    silkworm:    r('insects', { k: 'bug', shape: 'larva', body: '#fdfdff', alt: '#e8edf3', edge: '#9ca3af', segments: 7 })
  };

  /* ---------------------------------------------------------------- sea (34) */
  var sea = {
    seahorse:   r('sea', { k: 'seacreature', shape: 'seahorse', body: '#f59e0b', fin: '#fbbf24', mark: '#fbbf24' }),
    stingray:   r('sea', { k: 'seacreature', shape: 'ray', body: '#64748b' }),
    eel:        r('sea', { k: 'seacreature', shape: 'eel', body: '#4a7a4a', waterColor: '#cfe4f5' }),
    tuna:       r('sea', { k: 'seacreature', shape: 'fish', body: '#3f5a8a', fin: '#2f4a72', mark: '#8ec6fb', tail: 'fork', dorsal: 'spiny', tailX: 86 }),
    salmon:     r('sea', { k: 'seacreature', shape: 'fish', body: '#f08a7a', fin: '#e0786a', mark: '#fdfdff', deep: 1, tail: 'fork', dorsal: 'tall' }),
    anchovy:    r('sea', { k: 'seacreature', shape: 'fish', body: '#94a3b8', fin: '#7f8fa3', mark: '#e2e8f0', slim: 1, tail: 'fork', tailX: 90 }),
    sardine:    r('sea', { k: 'seacreature', shape: 'fish', body: '#8fb8d8', fin: '#7fa8c8', mark: '#dbeafe', slim: 1, blunt: 1, tail: 'round', tailX: 88 }),
    tilapia:    r('sea', { k: 'seacreature', shape: 'fish', body: '#a8a29e', fin: '#8a8578', mark: '#e7e5e4', deep: 1, blunt: 1, tail: 'round', dorsal: 'tall' }),
    catfish:    r('sea', { k: 'seacreature', shape: 'fish', body: '#4a5a72', fin: '#334155', mark: '#8fa3b8', blunt: 1, tail: 'shovel', dorsal: 'spiny', tailX: 84 }),
    oyster:     r('sea', { k: 'seacreature', shape: 'shellfish', shell: '#c8b8a8', ridge: '#8a7a6a' }),
    mussel:     r('sea', { k: 'seacreature', shape: 'shellfish', shell: '#4a5568', ridge: '#2d3748' }),
    scallop:    r('sea', { k: 'seacreature', shape: 'shellfish', shell: '#fbbf24', ridge: '#d97706' }),
    clam:       r('sea', { k: 'seacreature', shape: 'shellfish', shell: '#a8b8c8', ridge: '#6b7a8a' }),
    squid:      r('sea', { k: 'seacreature', shape: 'cephalopod', body: '#f08a7a' }),
    cuttlefish: r('sea', { k: 'seacreature', shape: 'cephalopod', body: '#a8763f' }),
    lobster:    r('sea', { k: 'seacreature', shape: 'crustacean', body: '#e0453f' }),
    shrimp:     r('sea', { k: 'seacreature', shape: 'crustacean', body: '#fb923c' }),
    barnacle:   r('sea', { k: 'seacreature', shape: 'cone', shell: '#d6c9b8', ridge: '#a89878', waterColor: '#cfe4f5' }),
    coral:      r('sea', { k: 'seascape', landmark: 'coral', coral: '#fb7185', water: '#7dd3fc', sand: false }),
    seaweed:    r('sea', { k: 'seascape', landmark: 'weed', weed: '#4a9e4a', water: '#7dd3fc', sand: false }),
    plankton:   r('sea', { k: 'seascape', landmark: 'plankton', dot: '#fde047', water: '#7dd3fc', sand: false }),
    tide:       r('sea', { k: 'seascape', landmark: 'tide', waterY: 68, water: '#7dd3fc' }),
    shore:      r('sea', { k: 'seascape', landmark: 'strand', hills: false, waterY: 58, water: '#7dd3fc', parasol: '#ef4444' }),
    bay:        r('sea', { k: 'seascape', landmark: 'inlet', hills: false, waterY: 58, water: '#38bdf8', head: '#7cae94' }),
    gulf:       r('sea', { k: 'seascape', landmark: 'inlet', hills: false, waterY: 52, water: '#0ea5e9', head: '#a8c6a0' }),
    reef:       r('sea', { k: 'seascape', landmark: 'reef', water: '#38bdf8', reef: '#f472b6' }),
    lagoon:     r('sea', { k: 'seascape', landmark: 'atoll', water: '#4dd0e1', palm: '#4a9e4a', sandColor: '#f0e0b8' }),
    anchor:     r('sea', { k: 'seascape', landmark: 'anchor', waterY: 58, water: '#7dd3fc', sand: false }),
    buoy:       r('sea', { k: 'seascape', landmark: 'buoy', body: '#dc2626', water: '#7dd3fc' }),
    pearl:      r('sea', { k: 'seascape', landmark: 'pearl', pearl: '#fdf4e3', waterY: 60, water: '#bae6fd' }),
    seashell:   r('sea', { k: 'seascape', landmark: 'shell', shell: '#fbcfe8', ridge: '#f9a8d4', waterY: 64, water: '#7dd3fc' }),
    harbour:    r('sea', { k: 'seascape', landmark: 'lighthouse', waterY: 66, water: '#38bdf8' }),
    depth:      r('sea', { k: 'seascape', landmark: 'depth', arrow: '#0ea5e9', waterY: 40, water: '#1d4ed8', sand: false, sky: '#bfdbfe' }),
    current:    r('sea', { k: 'seascape', landmark: 'current', waterY: 44, water: '#38bdf8', sand: false })
  };

  /* ------------------------------------------------------------- plants (33) */
  var plants = {
    rose:      r('plants', { k: 'flower', petal: '#e0457f', petalCount: 'many', core: '#fbbf24' }),
    tulip:     r('plants', { k: 'flower', petal: '#dc2626', petalCount: 4, core: '#15803d', coreDark: '#166534', stem: '#4a9e4a' }),
    daisy:     r('plants', { k: 'flower', petal: '#fdfdff', petalCount: 'many', core: '#fbbf24' }),
    sunflower: r('plants', { k: 'flower', petal: '#f5d33c', petalCount: 'spike', core: '#92400e', coreDark: '#78350f', stem: '#4a9e4a' }),
    orchid:    r('plants', { k: 'flower', petal: '#c084fc', petalCount: 6, core: '#fde68a', coreDark: '#f59e0b', stem: '#4a9e4a' }),
    lily:      r('plants', { k: 'flower', petal: '#fdfdff', petalCount: 6, core: '#fcd34d', stem: '#4a9e4a' }),
    lavender:  r('plants', { k: 'flower', petal: '#8b5cf6', petalCount: 'spike', core: '#5b21b6', coreDark: '#4c1d95', stem: '#4a9e4a' }),
    jasmine:   r('plants', { k: 'flower', petal: '#fdfdff', petalCount: 6, core: '#fbbf24', stem: '#4a9e4a' }),
    fern:      r('plants', { k: 'plant', shape: 'fern' }),
    moss:      r('plants', { k: 'plant', shape: 'moss' }),
    branch:    r('plants', { k: 'plant', shape: 'branch' }),
    trunk:     r('plants', { k: 'plant', shape: 'trunk' }),
    seed:      r('plants', { k: 'plant', shape: 'seed' }),
    sprout:    r('plants', { k: 'plant', shape: 'sprout' }),
    petal:     r('plants', { k: 'plant', shape: 'petal', petal: '#f472b6', vein: '#f9a8d4', base: '#fbbf24' }),
    pollen:    r('plants', { k: 'plant', shape: 'pollen' }),
    stem:      r('plants', { k: 'plant', shape: 'grass', blades: 1, leaf: '#4a9e4a', soil: '#8a6a3a' }),
    ivy:       r('plants', { k: 'plant', shape: 'vine', leaf: '#3f7a4a' }),
    bamboo:    r('plants', { k: 'plant', shape: 'bamboo' }),
    cactus:    r('plants', { k: 'plant', shape: 'cactus' }),
    palm:      r('plants', { k: 'plant', shape: 'palm' }),
    pine:      r('plants', { k: 'plant', shape: 'tree', canopy: 22, leaf: '#2f6b3a', leaf2: '#275c31' }),
    oak:       r('plants', { k: 'plant', shape: 'tree', canopy: 28, leaf: '#4a7a3a', leaf2: '#3f6b32' }),
    maple:     r('plants', { k: 'plant', shape: 'tree', canopy: 27, leaf: '#dc2626', leaf2: '#b91c1c' }),
    willow:    r('plants', { k: 'plant', shape: 'tree', canopy: 25, leaf: '#84cc16', leaf2: '#65a30d' }),
    bush:      r('plants', { k: 'plant', shape: 'bush' }),
    grass:     r('plants', { k: 'plant', shape: 'grass' }),
    vine:      r('plants', { k: 'plant', shape: 'vine' }),
    clover:    r('plants', { k: 'plant', shape: 'clover' }),
    hay:       r('plants', { k: 'plant', shape: 'hay' }),
    herb:      r('plants', { k: 'plant', shape: 'herb' }),
    weed:      r('plants', { k: 'plant', shape: 'weed' })
  };

  /* -------------------------------------------------------------- body (22) */
  var body = {
    eyebrow:   r('body', { k: 'bodyDetail', part: 'brow' }),
    eyelash:   r('body', { k: 'bodyDetail', part: 'lash' }),
    cheek:     r('body', { k: 'bodyDetail', part: 'cheek' }),
    chin:      r('body', { k: 'bodyDetail', part: 'chin' }),
    forehead:  r('body', { k: 'bodyDetail', part: 'forehead' }),
    throat:    r('body', { k: 'bodyDetail', part: 'throat' }),
    wrist:     r('body', { k: 'bodyDetail', part: 'joint', limb: 'wrist' }),
    ankle:     r('body', { k: 'bodyDetail', part: 'joint', limb: 'ankle' }),
    hip:       r('body', { k: 'bodyPart', shape: 'torso', mass: 'hip' }),
    handpalm:  r('body', { k: 'bodyDetail', part: 'palm' }),
    chest:     r('body', { k: 'bodyPart', shape: 'torso', mass: 'chest' }),
    belly:     r('body', { k: 'bodyPart', shape: 'torso', mass: 'belly' }),
    thumb:     r('body', { k: 'bodyDetail', part: 'digit', nail: 1 }),
    toe:       r('body', { k: 'bodyDetail', part: 'digit', nail: 1, tint: '#fdf0f6' }),
    heel:      r('body', { k: 'bodyDetail', part: 'heel' }),
    rib:       r('body', { k: 'bodyDetail', part: 'ribs' }),
    vein:      r('body', { k: 'bodyDetail', part: 'vessel' }),
    muscle:    r('body', { k: 'bodyDetail', part: 'muscle' }),
    lung:      r('body', { k: 'bodyPart', shape: 'organ', path: 'M40,26 C30,26 26,40 28,56 C30,70 36,78 44,76 L44,26 Z M80,26 C90,26 94,40 92,56 C90,70 84,78 76,76 L76,26 Z', body: '#f4a4a4', stroke: 'stroke="#e07878" stroke-width="2"' }),
    stomach:   r('body', { k: 'bodyPart', shape: 'organ', path: 'M44,22 C30,26 26,44 34,58 C40,70 34,84 46,92 C60,100 78,94 82,76 C86,58 78,44 66,44 C60,36 52,26 44,22 Z', body: '#f4a4a4', stroke: 'stroke="#e07878" stroke-width="2"' }),
    brain:     r('body', { k: 'bodyPart', shape: 'organ', path: 'M60,16 C40,16 28,28 28,44 C20,50 22,64 32,68 C34,82 48,88 60,82 C72,88 86,82 88,68 C98,64 100,50 92,44 C92,28 80,16 60,16 Z', body: '#f0a0b4', stroke: 'stroke="#d97b92" stroke-width="2"' }),
    blood:     r('body', { k: 'bodyDetail', part: 'drop', drop: '#dc2626' }),
    skeleton:  r('body', { k: 'bodyDetail', part: 'spine' })
  };

  /* -------------------------------------------------------------- face (31) */
  var face = {
    face:        r('face', { k: 'face', mouth: 'smile' }),
    profile:     r('face', { k: 'face', profile: 1 }),
    freckles:    r('face', { k: 'face', freckles: 1, mouth: 'grin' }),
    dimple:      r('face', { k: 'face', dimple: 1, mouth: 'smile', blush: 1 }),
    wrinkle:     r('face', { k: 'face', lines: 1, mouth: 'line' }),
    beard:       r('face', { k: 'face', beard: '#6b4423', mouth: 'smile' }),
    moustache:   r('face', { k: 'face', moustache: '#3a2f2a', mouth: 'line' }),
    sideburns:   r('face', { k: 'face', sideburns: 1, mouth: 'smile', sideburnColor: '#3a2f2a' }),
    lips:        r('face', { k: 'bodyPart', shape: 'mouth' }),
    gum:         r('face', { k: 'bodyPart', shape: 'gums' }),
    cheekbone:   r('face', { k: 'bodyDetail', part: 'cheekbone' }),
    complexion:  r('face', { k: 'face', skin: '#8d5524', mouth: 'smile', hair: '#2f2a3d' }),
    makeup:      r('face', { k: 'groom', shape: 'compact', pan: '#f9a8d4', shade: '#db2777' }),
    perfume:     r('face', { k: 'groom', shape: 'bottle', liquid: '#f472b6' }),
    razor:       r('face', { k: 'groom', shape: 'razor' }),
    expression:  r('face', { k: 'face', mouth: 'grin', brows: 'raised' }),
    blush:       r('face', { k: 'face', blush: 1, mouth: 'smile' }),
    gaze:        r('face', { k: 'face', eyes: 'wide', mouth: 'line' }),
    stare:       r('face', { k: 'face', eyes: 'squint', brows: 'angry', mouth: 'frown' }),
    wink:        r('face', { k: 'face', eyes: 'wink', mouth: 'grin', blush: 1 }),
    blink:       r('face', { k: 'face', eyes: 'closed', mouth: 'smile' }),
    facemask:    r('face', { k: 'medical', shape: 'mask' }),
    sunscreen:   r('face', { k: 'groom', shape: 'tube', body: '#fef3c7', band: '#fbbf24', cap: '#f59e0b', wide: 22 }),
    hairdryer:   r('face', { k: 'groom', shape: 'dryer' }),
    toothpaste:  r('face', { k: 'groom', shape: 'tube', body: '#fdfdff', band: '#38bdf8', cap: '#0ea5e9' }),
    toothbrush:  r('face', { k: 'groom', shape: 'brush' }),
    floss:       r('face', { k: 'groom', shape: 'floss' }),
    shavingfoam: r('face', { k: 'groom', shape: 'can', band: '#cbd5e1', cap: '#94a3b8' }),
    lipbalm:     r('face', { k: 'groom', shape: 'tube', body: '#fdfdff', band: '#f472b6', cap: '#e0457f', wide: 20 }),
    eyeshadow:   r('face', { k: 'groom', shape: 'compact', pan: '#c4b5fd', shade: '#7c3aed' }),
    lipstick:    r('face', { k: 'groom', shape: 'lipstick', bullet: '#be123c' })
  };

  /* ------------------------------------------------------------ health (49) */
  var health = {
    health:      r('health', { k: 'medical', shape: 'cross' }),
    sick:        r('health', { k: 'symptom', skin: '#e8d0b8', mark: 'drop', at: 'head', color: '#38bdf8' }),
    illness:     r('health', { k: 'symptom', mark: 'germ', at: 'whole', color: '#7c3aed' }),
    fever:       r('health', { k: 'thermometer', liquid: '#dc2626' }),
    cough:       r('health', { k: 'symptom', mark: 'puffout', at: 'throat', color: '#0891b2' }),
    cold2:       r('health', { k: 'symptom', mark: 'flake', at: 'whole', color: '#0ea5e9' }),
    flu:         r('health', { k: 'symptom', mark: 'germ', at: 'head', color: '#7c3aed' }),
    pain:        r('health', { k: 'symptom', mark: 'bolt', at: 'whole', color: '#dc2626' }),
    headache:    r('health', { k: 'symptom', mark: 'bolt', at: 'head', color: '#dc2626' }),
    stomachache: r('health', { k: 'symptom', mark: 'bolt', at: 'belly', color: '#dc2626' }),
    backache:    r('health', { k: 'symptom', mark: 'bolt', at: 'back', color: '#dc2626' }),
    bruise:      r('health', { k: 'symptom', mark: 'bruise', at: 'arm', color: '#7c3aed' }),
    scratch:     r('health', { k: 'symptom', mark: 'scratch', at: 'hand', color: '#be123c' }),
    cut:         r('health', { k: 'symptom', mark: 'cut', at: 'hand', color: '#dc2626' }),
    burn:        r('health', { k: 'symptom', mark: 'burn', at: 'hand', color: '#ea580c' }),
    allergy:     r('health', { k: 'symptom', mark: 'puffout', at: 'head', color: '#ca8a04' }),
    rash:        r('health', { k: 'symptom', mark: 'rash', at: 'arm', color: '#c026d3' }),
    swollen:     r('health', { k: 'symptom', mark: 'puff', at: 'leg', color: '#7c3aed' }),
    dizzy:       r('health', { k: 'symptom', mark: 'swirl', at: 'head', color: '#ca8a04' }),
    sleepy:      r('health', { k: 'symptom', mark: 'zzz', at: 'head', color: '#4f46e5' }),
    medicine:    r('health', { k: 'medical', shape: 'bottle', liquid: '#ef4444', label: '#fdfdff' }),
    pill:        r('health', { k: 'medical', shape: 'pill', a: '#fdfdff', b: '#ef4444' }),
    tablet2:     r('health', { k: 'medical', shape: 'pill', a: '#fef3c7', b: '#f59e0b' }),
    sachet:      r('health', { k: 'medical', shape: 'sachet', band: '#bae6fd', markColor: '#0284c7' }),
    injection:   r('health', { k: 'medical', shape: 'syringe', liquid: '#38bdf8' }),
    syringe:     r('health', { k: 'medical', shape: 'syringe', liquid: '#f87171' }),
    bandage:     r('health', { k: 'medical', shape: 'bandage', color: '#fde68a', pad: '#fdf6e8' }),
    plaster:     r('health', { k: 'medical', shape: 'bandage', color: '#fdfdff', pad: '#fecaca' }),
    crutch:      r('health', { k: 'medical', shape: 'crutch' }),
    wheelchair:  r('health', { k: 'medical', shape: 'wheelchair', seat: '#2563eb' }),
    mask:        r('health', { k: 'medical', shape: 'mask', color: '#bae6fd' }),
    stethoscope: r('health', { k: 'medical', shape: 'stethoscope' }),
    xray:        r('health', { k: 'medical', shape: 'xray' }),
    bloodtest:   r('health', { k: 'medical', shape: 'vials', liquid: '#dc2626' }),
    pulse:       r('health', { k: 'medical', shape: 'vitals', trace: '#4ade80' }),
    heartbeat:   r('health', { k: 'medical', shape: 'vitals', trace: '#f87171', screen: '#2a1414' }),
    firstaid:    r('health', { k: 'medical', shape: 'kit' }),
    clinic:      r('health', { k: 'medical', shape: 'clinic' }),
    appointment: r('health', { k: 'medical', shape: 'card', band: '#0ea5e9' }),
    patient:     r('health', { k: 'medical', shape: 'bed' }),
    waitingroom: r('health', { k: 'medical', shape: 'chairs' }),
    prescription: r('health', { k: 'medical', shape: 'card', band: '#16a34a' }),
    insurance:   r('health', { k: 'medical', shape: 'card', band: '#7c3aed' }),
    emergency:   r('health', { k: 'medical', shape: 'bell' }),
    recovery:    r('health', { k: 'symptom', mark: 'up', at: 'whole', color: '#16a34a' }),
    cure:        r('health', { k: 'medical', shape: 'cross', markColor: '#16a34a', bg: '#f0fdf4' }),
    germ:        r('health', { k: 'medical', shape: 'microbe', body: '#84cc16', spike: '#4d7c0f' }),
    virus:       r('health', { k: 'medical', shape: 'microbe', body: '#c4b5fd', spike: '#7c3aed' }),
    healthy:     r('health', { k: 'symptom', mark: 'check', at: 'whole', color: '#16a34a' })
  };

  /* ---------------------------------------------------------- feelings (37) */
  /* Every one of these is a face plus a tint plus a badge. The badge is the
     part that tells two similar feelings apart on a shelf of cards. */
  var feelings = {
    joy:            r('feelings', { k: 'feeling', tint: '#fef3c7', mouth: 'grin', eyes: 'closed', symbol: 'smiley' }),
    sadness:        r('feelings', { k: 'feeling', tint: '#dbeafe', mouth: 'frown', eyes: 'closed', brows: 'sad', symbol: 'drop' }),
    fear:           r('feelings', { k: 'feeling', tint: '#ede9fe', mouth: 'open', eyes: 'wide', brows: 'raised', symbol: 'eye' }),
    anger:          r('feelings', { k: 'feeling', tint: '#fee2e2', mouth: 'frown', brows: 'angry', symbol: 'bolt' }),
    calm:           r('feelings', { k: 'feeling', tint: '#dcfce7', mouth: 'smile', eyes: 'closed', symbol: 'drop' }),
    surprise:       r('feelings', { k: 'feeling', tint: '#faf5ff', mouth: 'open', eyes: 'wide', symbol: 'star' }),
    shame:          r('feelings', { k: 'feeling', tint: '#f1f5f9', mouth: 'frown', eyes: 'closed', brows: 'sad', symbol: 'drop' }),
    guilt:          r('feelings', { k: 'feeling', tint: '#e2e8f0', mouth: 'frown', eyes: 'closed', symbol: 'heart' }),
    pride:          r('feelings', { k: 'feeling', tint: '#fef3c7', mouth: 'smile', eyes: 'closed', symbol: 'star' }),
    jealousy:       r('feelings', { k: 'feeling', tint: '#fce7f3', mouth: 'frown', brows: 'sad', symbol: 'eye' }),
    embarrassment:  r('feelings', { k: 'feeling', tint: '#ffe4e6', mouth: 'grin', eyes: 'wide', blush: 1, symbol: 'drop' }),
    gratitude:      r('feelings', { k: 'feeling', tint: '#d1fae5', mouth: 'smile', eyes: 'closed', symbol: 'heart' }),
    disappointment: r('feelings', { k: 'feeling', tint: '#e0e7ff', mouth: 'frown', eyes: 'closed', symbol: 'drop' }),
    relief:         r('feelings', { k: 'feeling', tint: '#dcfce7', mouth: 'smile', eyes: 'closed', symbol: 'check' }),
    anxiety:        r('feelings', { k: 'feeling', tint: '#fef9c3', mouth: 'line', eyes: 'wide', symbol: 'clock' }),
    excitement:     r('feelings', { k: 'feeling', tint: '#ffedd5', mouth: 'open', eyes: 'wide', blush: 1, symbol: 'star' }),
    boredom:        r('feelings', { k: 'feeling', tint: '#f1f5f9', mouth: 'line', eyes: 'closed', symbol: 'clock' }),
    nostalgia:      r('feelings', { k: 'feeling', tint: '#f5f3ff', mouth: 'smile', eyes: 'closed', symbol: 'heart' }),
    confidence:     r('feelings', { k: 'feeling', tint: '#dbeafe', mouth: 'grin', eyes: 'wide', symbol: 'star' }),
    patience:       r('feelings', { k: 'feeling', tint: '#ecfdf5', mouth: 'smile', eyes: 'closed', symbol: 'hourglass' }),
    courage:        r('feelings', { k: 'feeling', tint: '#fee2e2', mouth: 'grin', eyes: 'wide', symbol: 'shield' }),
    sympathy:       r('feelings', { k: 'feeling', tint: '#fae8ff', mouth: 'smile', eyes: 'closed', symbol: 'heart' }),
    affection:      r('feelings', { k: 'feeling', tint: '#fce7f3', mouth: 'grin', eyes: 'closed', blush: 1, symbol: 'heart' }),
    loneliness:     r('feelings', { k: 'feeling', tint: '#e2e8f0', mouth: 'frown', eyes: 'closed', symbol: 'drop' }),
    mood:           r('feelings', { k: 'feeling', tint: '#fef9c3', mouth: 'line', eyes: 'wide', symbol: 'smiley' }),
    temper:         r('feelings', { k: 'feeling', tint: '#ffedd5', mouth: 'frown', brows: 'angry', symbol: 'bolt' }),
    crisis:         r('feelings', { k: 'feeling', tint: '#fee2e2', mouth: 'open', eyes: 'wide', symbol: 'bolt' }),
    comfort:        r('feelings', { k: 'feeling', tint: '#ffedd5', mouth: 'smile', eyes: 'closed', symbol: 'hand' }),
    stress:         r('feelings', { k: 'feeling', tint: '#fecaca', mouth: 'open', eyes: 'wide', symbol: 'clock' }),
    satisfaction:   r('feelings', { k: 'feeling', tint: '#dcfce7', mouth: 'grin', eyes: 'closed', symbol: 'check' }),
    despair:        r('feelings', { k: 'feeling', tint: '#cbd5e1', mouth: 'frown', eyes: 'closed', brows: 'sad', symbol: 'drop' }),
    curiosity:      r('feelings', { k: 'feeling', tint: '#e0f2fe', mouth: 'line', eyes: 'wide', brows: 'raised', symbol: 'question' }),
    attitude:       r('feelings', { k: 'feeling', tint: '#ede9fe', mouth: 'line', brows: 'raised', symbol: 'star' }),
    impression:     r('feelings', { k: 'feeling', tint: '#ede9fe', mouth: 'line', eyes: 'wide', symbol: 'eye' }),
    reputation:     r('feelings', { k: 'feeling', tint: '#ede9fe', mouth: 'line', eyes: 'closed', symbol: 'shield' }),
    kiss:           r('feelings', { k: 'face', profile: 1, hair: '#6b4423', mouth: 'open' }),
    hug:            r('feelings', { k: 'roleFigure', role: 'wife', count: 2, heart: 1 })
  };

  /* ------------------------------------------------------------ people (35) */
  var people = {
    person:     r('people', { k: 'roleFigure', role: 'default' }),
    man:        r('people', { k: 'roleFigure', role: 'man' }),
    woman:      r('people', { k: 'roleFigure', role: 'woman' }),
    boy:        r('people', { k: 'roleFigure', role: 'boy' }),
    girl:       r('people', { k: 'roleFigure', role: 'girl' }),
    adult:      r('people', { k: 'roleFigure', role: 'adult' }),
    teenager:   r('people', { k: 'roleFigure', role: 'teenager' }),
    neighbour:  r('people', { k: 'roleFigure', role: 'neighbour' }),
    guest:      r('people', { k: 'roleFigure', role: 'guest' }),
    stranger:   r('people', { k: 'roleFigure', role: 'stranger' }),
    crowd:      r('people', { k: 'roleFigure', count: 5, role: 'default' }),
    audience:   r('people', { k: 'roleFigure', count: 4, role: 'default' }),
    couple:     r('people', { k: 'roleFigure', count: 2, role: 'woman', heart: 1 }),
    partner:    r('people', { k: 'roleFigure', count: 2, role: 'man' }),
    classmate:  r('people', { k: 'roleFigure', count: 2, role: 'boy' }),
    foreigner:  r('people', { k: 'roleFigure', role: 'foreigner' }),
    twin:       r('people', { k: 'roleFigure', count: 2, role: 'twin' }),
    elderly:    r('people', { k: 'roleFigure', role: 'elderly', prop: 'cane' }),
    blind:      r('people', { k: 'roleFigure', role: 'blind', prop: 'cane' }),
    deaf:       r('people', { k: 'roleFigure', role: 'deaf' }),
    lefty:      r('people', { k: 'roleFigure', role: 'lefty', prop: 'wave' }),
    orphan:     r('people', { k: 'roleFigure', role: 'orphan' }),
    host:       r('people', { k: 'roleFigure', role: 'host' }),
    customer:   r('people', { k: 'roleFigure', role: 'customer', prop: 'bag' }),
    member:     r('people', { k: 'roleFigure', role: 'member' }),
    citizen:    r('people', { k: 'roleFigure', role: 'citizen' }),
    resident:   r('people', { k: 'roleFigure', role: 'resident' }),
    passenger:  r('people', { k: 'roleFigure', role: 'passenger', prop: 'suitcase' }),
    pedestrian: r('people', { k: 'roleFigure', role: 'pedestrian' }),
    volunteer:  r('people', { k: 'roleFigure', role: 'volunteer', badge: 1, badgeColor: '#16a34a' }),
    infant:     r('people', { k: 'roleFigure', role: 'infant', prop: 'bottle' }),
    bride:      r('people', { k: 'roleFigure', role: 'bride' }),
    groom:      r('people', { k: 'roleFigure', role: 'groom' }),
    widow:      r('people', { k: 'roleFigure', role: 'widow' }),
    family:     r('people', { k: 'roleFigure', count: 4, role: 'default', heart: 1 })
  };

  /* ------------------------------------------------------------ family (16) */
  var family = {
    wife:          r('family', { k: 'roleFigure', role: 'wife' }),
    husband:       r('family', { k: 'roleFigure', role: 'husband' }),
    cousin:        r('family', { k: 'roleFigure', role: 'cousin' }),
    nephew:        r('family', { k: 'roleFigure', role: 'nephew' }),
    niece:         r('family', { k: 'roleFigure', role: 'niece' }),
    godmother:     r('family', { k: 'roleFigure', role: 'godmother' }),
    godfather:     r('family', { k: 'roleFigure', role: 'godfather' }),
    grandson:      r('family', { k: 'roleFigure', role: 'grandson' }),
    granddaughter: r('family', { k: 'roleFigure', role: 'granddaughter' }),
    stepmother:    r('family', { k: 'roleFigure', role: 'stepmother' }),
    stepfather:    r('family', { k: 'roleFigure', role: 'stepfather' }),
    motherinlaw:   r('family', { k: 'roleFigure', role: 'motherinlaw' }),
    fatherinlaw:   r('family', { k: 'roleFigure', role: 'fatherinlaw' }),
    relative:      r('family', { k: 'roleFigure', role: 'relative' }),
    heir:          r('family', { k: 'roleFigure', role: 'heir', prop: 'coins' }),
    newborn:       r('family', { k: 'roleFigure', role: 'infant', prop: 'bottle' })
  };

  /* -------------------------------------------------------------- jobs (40) */
  var jobs = {
    dentist:     r('jobs', { k: 'roleFigure', role: 'dentist' }),
    vet:         r('jobs', { k: 'roleFigure', role: 'vet' }),
    pharmacist:  r('jobs', { k: 'roleFigure', role: 'pharmacist' }),
    surgeon:     r('jobs', { k: 'roleFigure', role: 'surgeon' }),
    psychologist: r('jobs', { k: 'roleFigure', role: 'psychologist' }),
    receptionist: r('jobs', { k: 'roleFigure', role: 'receptionist' }),
    secretary:   r('jobs', { k: 'roleFigure', role: 'secretary' }),
    manager:     r('jobs', { k: 'roleFigure', role: 'manager' }),
    boss:        r('jobs', { k: 'roleFigure', role: 'boss' }),
    employee:    r('jobs', { k: 'roleFigure', role: 'employee' }),
    worker:      r('jobs', { k: 'roleFigure', role: 'worker' }),
    engineer:    r('jobs', { k: 'roleFigure', role: 'engineer' }),
    architect:   r('jobs', { k: 'roleFigure', role: 'architect' }),
    electrician: r('jobs', { k: 'roleFigure', role: 'electrician' }),
    plumber:     r('jobs', { k: 'roleFigure', role: 'plumber' }),
    carpenter:   r('jobs', { k: 'roleFigure', role: 'carpenter' }),
    baker:       r('jobs', { k: 'roleFigure', role: 'baker' }),
    butcher:     r('jobs', { k: 'roleFigure', role: 'butcher' }),
    hairdresser: r('jobs', { k: 'roleFigure', role: 'hairdresser' }),
    florist:     r('jobs', { k: 'roleFigure', role: 'florist' }),
    shopkeeper:  r('jobs', { k: 'roleFigure', role: 'shopkeeper' }),
    cashier:     r('jobs', { k: 'roleFigure', role: 'cashier' }),
    barista:     r('jobs', { k: 'roleFigure', role: 'barista' }),
    soldier:     r('jobs', { k: 'roleFigure', role: 'soldier' }),
    lifeguard:   r('jobs', { k: 'roleFigure', role: 'lifeguard' }),
    cleaner:     r('jobs', { k: 'roleFigure', role: 'cleaner' }),
    postman:     r('jobs', { k: 'roleFigure', role: 'postman' }),
    tailor:      r('jobs', { k: 'roleFigure', role: 'tailor' }),
    optician:    r('jobs', { k: 'roleFigure', role: 'optician' }),
    referee:     r('jobs', { k: 'roleFigure', role: 'referee' }),
    coach:       r('jobs', { k: 'roleFigure', role: 'coach' }),
    scientist:   r('jobs', { k: 'roleFigure', role: 'scientist' }),
    journalist:  r('jobs', { k: 'roleFigure', role: 'journalist' }),
    accountant:  r('jobs', { k: 'roleFigure', role: 'accountant' }),
    librarian:   r('jobs', { k: 'roleFigure', role: 'librarian' }),
    fisherman:   r('jobs', { k: 'roleFigure', role: 'fisherman' }),
    guard:       r('jobs', { k: 'roleFigure', role: 'guard' }),
    priest:      r('jobs', { k: 'roleFigure', role: 'priest' }),
    interpreter: r('jobs', { k: 'roleFigure', role: 'interpreter' }),
    translator:  r('jobs', { k: 'roleFigure', role: 'translator' })
  };

  LLC.art.spec(animals);
  LLC.art.spec(birds);
  LLC.art.spec(insects);
  LLC.art.spec(sea);
  LLC.art.spec(plants);
  LLC.art.spec(body);
  LLC.art.spec(face);
  LLC.art.spec(health);
  LLC.art.spec(feelings);
  LLC.art.spec(people);
  LLC.art.spec(family);
  LLC.art.spec(jobs);
})(window);
