/*!
 * themes-more.js - A top-up batch: 184 words for categories that are already
 * in the deck.
 *
 * Every category had words after the last batch, so this one widens them rather
 * than opening new ground. The picks are the words a learner meets next: the
 * second decade of numbers, the relatives beyond the nuclear family, the
 * prepositions and adverbs that carry the grammar, and the everyday nouns —
 * a camel, a filing code, a croissant tin — that the first pass did not reach.
 *
 * Ids are checked against the deck before they land. `LLC.data.add()` keeps the
 * first definition of an id and silently skips the rest, so a collision here is
 * a word that quietly does not exist.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;

  var rows = [
    /* animals (9) */
['alpaca', 'animals', 'noun', 'alpaca', 'alpaca', 'alpaca'],
['antelope', 'animals', 'noun', 'antílope', 'antelope', 'antílope'],
['armadillo', 'animals', 'noun', 'tatu', 'armadillo', 'armadillo'],
['chipmunk', 'animals', 'noun', 'toupeira', 'chipmunk', 'ardilla'],
['ocelot', 'animals', 'noun', 'ocelote', 'ocelot', 'ocelote'],
['lynx', 'animals', 'noun', 'lince', 'lynx', 'lince'],
['marmot', 'animals', 'noun', 'marmota', 'marmot', 'marmota'],
    ['panda', 'animals', 'noun', 'panda', 'panda', 'panda'],
['wombat', 'animals', 'noun', 'vombate', 'wombat', 'vombate'],

    /* food (6) */
['marmalade', 'food', 'noun', 'marmelada', 'marmalade', 'mermelada'],
['hummus', 'food', 'noun', 'húmus', 'hummus', 'hummus'],
['falafel', 'food', 'noun', 'falafel', 'falafel', 'falafel'],
['paella', 'food', 'noun', 'paella', 'paella', 'paella'],
['kebab', 'food', 'noun', 'kebab', 'kebab', 'kebab'],
['risotto', 'food', 'noun', 'risoto', 'risotto', 'risotto'],

    /* kitchen (5) */
['wok', 'kitchen', 'noun', 'wok', 'wok', 'wok'],
['chopper', 'kitchen', 'noun', 'picador', 'chopper', 'picador'],
['saucepan', 'kitchen', 'noun', 'caçarola', 'saucepan', 'cacerola'],
['napkin', 'kitchen', 'noun', 'guardanapo', 'napkin', 'servilleta'],
['placemat', 'kitchen', 'noun', 'tapete de mesa', 'placemat', 'tapete'],

    /* drinks (4) */
['cortado', 'drinks', 'noun', 'cortado', 'cortado', 'cortado'],
['chai', 'drinks', 'noun', 'chai', 'chai', 'chai'],
['sherry', 'drinks', 'noun', 'vinho do Porto', 'sherry', 'jerez'],
['vermouth', 'drinks', 'noun', 'vermut', 'vermouth', 'vermut'],

    /* nature (5) */
['gully', 'nature', 'noun', 'garganta', 'gully', 'garganta'],
['glen', 'nature', 'noun', 'vale', 'glen', 'glen'],
['knoll', 'nature', 'noun', 'outeiro', 'knoll', 'cerro'],
['basalt', 'nature', 'noun', 'basalto', 'basalt', 'basalto'],
['fen', 'nature', 'noun', 'pântano', 'fen', 'turba'],

    /* body (5) */
['nostril', 'body', 'noun', 'narina', 'nostril', 'nariz'],
['knuckle', 'body', 'noun', 'articulação', 'knuckle', 'nudillo'],
['elbow', 'body', 'noun', 'cotovelo', 'elbow', 'codo'],
['thigh', 'body', 'noun', 'coxa', 'thigh', 'muslo'],
['eyelid', 'body', 'noun', 'pálpebra', 'eyelid', 'párpado'],

    /* family (5) */
    ['boyfriend', 'family', 'noun', 'namorado', 'boyfriend', 'novio'],
    ['girlfriend', 'family', 'noun', 'namorada', 'girlfriend', 'novia'],
    ['soninlaw', 'family', 'noun', 'genro', 'son-in-law', 'yerno'],
    ['daughterinlaw', 'family', 'noun', 'nora', 'daughter-in-law', 'nuera'],
    ['godson', 'family', 'noun', 'afilhado', 'godson', 'ahijado'],

    /* objects (4) */
    ['barn', 'garden', 'noun', 'celeiro', 'barn', 'granero'],
    ['lighter', 'objects', 'noun', 'isqueiro', 'lighter', 'encendedor'],
    ['magnet', 'objects', 'noun', 'ímã', 'magnet', 'imán'],
    ['padlock', 'objects', 'noun', 'cadeado', 'padlock', 'candado'],

    /* verbs (7) */
    ['borrow', 'verbs', 'verb', 'pegar emprestado', 'borrow', 'tomar prestado'],
    ['lend', 'verbs', 'verb', 'emprestar', 'lend', 'prestar'],
    ['owe', 'verbs', 'verb', 'dever', 'owe', 'deber'],
    ['build', 'verbs', 'verb', 'construir', 'build', 'construir'],
    ['catch', 'verbs', 'verb', 'apanhar', 'catch', 'coger'],
    ['choose', 'verbs', 'verb', 'escolher', 'choose', 'elegir'],

    /* adjectives (6) */
    ['tidy', 'adjectives', 'adjective', 'arrumado', 'tidy', 'ordenado'],
    ['clever', 'adjectives', 'adjective', 'esperto', 'clever', 'listo'],
    ['eager', 'adjectives', 'adjective', 'ansioso', 'eager', 'ansioso'],
    ['honest', 'adjectives', 'adjective', 'honesto', 'honest', 'honesto'],
    ['lazy', 'adjectives', 'adjective', 'preguiçoso', 'lazy', 'perezoso'],

    /* jobs (6) */
    ['actor', 'jobs', 'noun', 'actor', 'actor', 'actor'],
    ['dancer', 'jobs', 'noun', 'bailarino', 'dancer', 'bailarín'],
    ['judge', 'jobs', 'noun', 'juiz', 'judge', 'juez'],
    ['model', 'jobs', 'noun', 'modelo', 'model', 'modelo'],
    ['sculptor', 'jobs', 'noun', 'escultor', 'sculptor', 'escultor'],
    ['weaver', 'jobs', 'noun', 'tecelão', 'weaver', 'tejedora'],

    /* clothes (5) */
    ['blouse', 'clothes', 'noun', 'blusa', 'blouse', 'blusa'],
    ['hoodie', 'clothes', 'noun', 'capuz', 'hoodie', 'sudadera'],
    ['jeans', 'clothes', 'noun', 'calças de ganga', 'jeans', 'vaqueros'],
    ['jumper', 'clothes', 'noun', 'camisola', 'jumper', 'jersey'],
    ['pyjamas', 'clothes', 'noun', 'pijama', 'pyjamas', 'pijama'],

    /* sports (5) */
    ['badminton', 'sports', 'noun', 'badminton', 'badminton', 'bádminton'],
    ['bowling', 'sports', 'noun', 'bowling', 'bowling', 'bolos'],
    ['climbing', 'sports', 'noun', 'escalada', 'climbing', 'escalada'],
    ['cricket', 'sports', 'noun', 'cricket', 'cricket', 'críquet'],
    ['judo', 'sports', 'noun', 'judo', 'judo', 'yudo'],

    /* music (3) */
    ['banjo', 'music', 'noun', 'banjo', 'banjo', 'banjo'],
    ['cello', 'music', 'noun', 'violoncelo', 'cello', 'violonchelo'],
    ['organ', 'music', 'noun', 'órgão', 'organ', 'órgano'],

    /* places (5) */
    ['bakery', 'places', 'noun', 'pastelaria', 'bakery', 'panadería'],
    ['cemetery', 'places', 'noun', 'cemitério', 'cemetery', 'cementerio'],
    ['courtyard', 'places', 'noun', 'pátio', 'courtyard', 'patio'],
    ['estuary', 'places', 'noun', 'estuário', 'estuary', 'estuario'],
    ['market', 'places', 'noun', 'mercado', 'market', 'mercado'],

    /* transport (5) */
    ['freight', 'transport', 'noun', 'carga', 'freight', 'carga'],
    ['lorry', 'transport', 'noun', 'camião', 'lorry', 'camión'],
    ['minibus', 'transport', 'noun', 'minibús', 'minibus', 'furgoneta'],
    ['glider', 'transport', 'noun', 'planador', 'glider', 'planeador'],
    ['scooter', 'transport', 'noun', 'trotinete', 'scooter', 'patinete'],

    /* technology (5) */
    ['antenna', 'technology', 'noun', 'antena', 'antenna', 'antena'],
    ['firewall', 'technology', 'noun', 'firewall', 'firewall', 'cortafuegos'],
    ['server', 'technology', 'noun', 'servidor', 'server', 'servidor'],
    ['bandwidth', 'technology', 'noun', 'largura de banda', 'bandwidth', 'ancho de banda'],

    /* time (4) */
    ['decade', 'time', 'noun', 'década', 'decade', 'década'],
    ['century', 'time', 'noun', 'século', 'century', 'siglo'],
    ['moment', 'time', 'noun', 'momento', 'moment', 'momento'],
    ['midnight', 'time', 'noun', 'meia-noite', 'midnight', 'medianoche'],

    /* adverbs (4) */
    ['already', 'adverbs', 'adverb', 'já', 'already', 'ya'],
    ['hardly', 'adverbs', 'adverb', 'mal', 'hardly', 'apenas'],
    ['finally', 'adverbs', 'adverb', 'finalmente', 'finally', 'por fin'],
    ['rarely', 'adverbs', 'adverb', 'raramente', 'rarely', 'rara vez'],

    /* prepositions (3) */
    ['besides', 'prepositions', 'preposition', 'além de', 'besides', 'además de'],
    ['despite', 'prepositions', 'preposition', 'apesar de', 'despite', 'a pesar de'],
    ['unlike', 'prepositions', 'preposition', 'ao contrário de', 'unlike', 'a diferencia de'],

    /* numbers (3) */
    ['eleven', 'numbers', 'number', 'onze', 'eleven', 'once'],
    ['twelve', 'numbers', 'number', 'doze', 'twelve', 'doce'],
    ['twenty', 'numbers', 'number', 'vinte', 'twenty', 'veinte'],

    /* birds (4) */
['osprey', 'birds', 'noun', 'osprey', 'osprey', 'osprey'],
['kestrel', 'birds', 'noun', 'peneireiro', 'kestrel', 'cernícalo'],
['lapwing', 'birds', 'noun', 'abibeiro', 'lapwing', 'avefria'],
['gannet', 'birds', 'noun', 'albatroz', 'gannet', 'alcatraz'],

    /* insects (4) */
['aphid', 'insects', 'noun', 'pulgão', 'aphid', 'pulgón'],
['earwig', 'insects', 'noun', 'bicho-pau', 'earwig', 'ciempiés'],
['cicada', 'insects', 'noun', 'cigarra', 'cicada', 'cigarra'],
['weevil', 'insects', 'noun', 'carvalho', 'weevil', 'picudo'],

    /* sea (4) */
['nautilus', 'sea', 'noun', 'náutilo', 'nautilus', 'nautilus'],
['urchin', 'sea', 'noun', 'ouriço-do-mar', 'sea urchin', 'erizo de mar'],
['porpoise', 'sea', 'noun', 'marselha', 'porpoise', 'marsopa'],
['mackerel', 'sea', 'noun', 'cavala', 'mackerel', 'caballa'],

    /* plants (4) */
['beech', 'plants', 'noun', 'faia', 'beech', 'haya'],
['larch', 'plants', 'noun', 'lariço', 'larch', 'alerce'],
['hawthorn', 'plants', 'noun', 'espinheiro', 'hawthorn', 'espino'],

    /* face (4) */
    ['sideburn', 'face', 'noun', 'costaneta', 'sideburn', 'patillas'],
    ['earlobe', 'face', 'noun', 'lóbulo da orelha', 'earlobe', 'lóbulo'],
    ['jaw', 'face', 'noun', 'maxilar', 'jaw', 'mandíbula'],

    /* health (4) */
    ['sprain', 'health', 'noun', 'entorse', 'sprain', 'esguince'],
    ['relapse', 'health', 'noun', 'reincidência', 'relapse', 'recaída'],
    ['fracture', 'health', 'noun', 'fratura', 'fracture', 'fractura'],
    ['hiccup', 'health', 'noun', 'soluço', 'hiccup', 'hipo'],

    /* feelings (4) */
    ['afraid', 'feelings', 'adjective', 'com medo', 'afraid', 'asustado'],
    ['ashamed', 'feelings', 'adjective', 'envergonhado', 'ashamed', 'avergonzado'],
    ['jealous', 'feelings', 'adjective', 'ciumento', 'jealous', 'celoso'],
    ['proud', 'feelings', 'adjective', 'orgulhoso', 'proud', 'orgulloso'],

    /* people (4) */
    ['ancestor', 'people', 'noun', 'ancestral', 'ancestor', 'antepasado'],
    ['descendant', 'people', 'noun', 'descendente', 'descendant', 'descendiente'],
    ['landlord', 'people', 'noun', 'senhorio', 'landlord', 'casero'],
    ['lodger', 'people', 'noun', 'inquilino', 'lodger', 'inquilino'],

    /* accessories (4) */
    ['bib', 'accessories', 'noun', 'bibe', 'bib', 'babero'],
    ['cravat', 'accessories', 'noun', 'gravata de laço', 'cravat', 'corbata de lazo'],
    ['earplug', 'accessories', 'noun', 'tampão', 'earplug', 'tapón'],
    ['mitten', 'accessories', 'noun', 'luva sem dedos', 'mitten', 'manopla'],

    /* house (4) */
    ['banister', 'house', 'noun', 'corrimão da escada', 'banister', 'barandilla'],
    ['lightswitch', 'house', 'noun', 'interruptor', 'light switch', 'interruptor'],
    ['stairwell', 'house', 'noun', 'caixa de escadas', 'stairwell', 'hueco de escalera'],
    ['doorstep', 'house', 'noun', 'degrau da porta', 'doorstep', 'escalón'],

    /* furniture (4) */
    ['divan', 'furniture', 'noun', 'divã', 'divan', 'diván'],
    ['pouffe', 'furniture', 'noun', 'pufe', 'pouffe', 'taburete'],
    ['settee', 'furniture', 'noun', 'sofá de três lugares', 'settee', 'tresillo'],

    /* garden (3) */
    ['hoe', 'garden', 'noun', 'sacho', 'hoe', 'azada'],
    ['dibber', 'garden', 'noun', 'cova-leira', 'dibber', 'plantador'],
    ['trug', 'garden', 'noun', 'caixa de jardinagem', 'trug', 'caja de jardinería'],

    /* weather (3) */
    ['downdraft', 'weather', 'noun', 'corrente descendente', 'downdraft', 'corriente descendente'],
    ['cloudlet', 'weather', 'noun', 'nuemzinha', 'cloudlet', 'nucecilla'],
    ['raindrop', 'weather', 'noun', 'gota de chuva', 'raindrop', 'gota de lluvia'],

    /* city (3) */
    ['culdesac', 'city', 'noun', 'beco sem saída', 'cul-de-sac', 'callejón sin salida'],
    ['estate', 'city', 'noun', 'bairro', 'estate', 'urbanización'],
    ['ringroad', 'city', 'noun', 'via de circular', 'ring road', 'vía de circunvalación'],

    /* travel (4) */
    ['airline', 'travel', 'noun', 'companhia aérea', 'airline', 'línea aérea'],
    ['brochure', 'travel', 'noun', 'folheto', 'brochure', 'folleto'],
    ['embassy', 'travel', 'noun', 'embaixada', 'embassy', 'embajada'],
    ['transit', 'travel', 'noun', 'transporte público', 'public transit', 'transporte público'],

    /* money (4) */
    ['allowance', 'money', 'noun', 'mesada', 'allowance', 'mesada'],
    ['bargain', 'money', 'noun', 'pega', 'bargain', 'ganga'],
    ['float', 'money', 'noun', 'fundo de caixa', 'float', 'efectivo'],
    ['surcharge', 'money', 'noun', 'sobretaxa', 'surcharge', 'recargo'],

    /* tools (3) */
['gouge', 'tools', 'noun', 'formão', 'gouge', 'gubia'],
['scythe', 'tools', 'noun', 'foice', 'scythe', 'guadaña'],
['mattock', 'tools', 'noun', 'alcovite', 'mattock', 'azadón'],

    /* office (3) */
    ['barcode', 'office', 'noun', 'código de barras', 'barcode', 'código de barras'],
    ['toner', 'office', 'noun', 'tóner', 'toner', 'tóner'],
    ['swivel', 'office', 'noun', 'cadeira giratória', 'swivel chair', 'silla giratoria'],

    /* school (3) */
    ['canteen', 'school', 'noun', 'cantina', 'canteen', 'cantina'],
    ['prospectus', 'school', 'noun', 'prospecto', 'prospectus', 'prospecto'],
    ['tutor', 'school', 'noun', 'tutor', 'tutor', 'tutor'],

    /* communication (3) */
    ['blog', 'communication', 'noun', 'blogue', 'blog', 'blog'],
    ['spam', 'communication', 'noun', 'spam', 'spam', 'spam'],
    ['wifi', 'communication', 'noun', 'wi-fi', 'wi-fi', 'wifi'],

    /* media (1) */
    ['advert', 'media', 'noun', 'anúncio', 'advert', 'anuncio'],

    /* shapes (2) */
    ['crescent', 'shapes', 'noun', 'meia-lua', 'crescent', 'media luna'],
    ['prism', 'shapes', 'noun', 'prisma', 'prism', 'prisma'],

    /* colors (2) */
    ['colourless', 'colors', 'adjective', 'incolor', 'colourless', 'incoloro'],
    ['pastel', 'colors', 'noun', 'pastel', 'pastel', 'pastel'],

    /* conjunctions (1) */
    ['moreover', 'conjunctions', 'conjunction', 'aliás', 'moreover', 'además'],

    /* interjections (1) */
    ['bravo', 'interjections', 'interjection', 'bis', 'bravo', 'bravo']
  ];

  LLC.data.add(rows);
})(window);
