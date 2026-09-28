/*!
 * art-specs-work.js - Recipes for the work and study group.
 *
 * Hand tools, the office, the school, devices, messages, media. The same
 * handful of kinds as everywhere else: one tool, one desk object, one screen,
 * one schoolroom thing, one speech bubble, one printed page. Related words look
 * related, which is the whole point of doing this with recipes.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC;
  var BG = {
    tools: '#fdf2e8', office: '#eef4fb', school: '#fdf8ec',
    technology: '#eaf4fb', communication: '#f3f0fd', media: '#fdf0f4'
  };

  function r(cat, spec) { spec.bg = BG[cat]; return spec; }

  /* -------------------------------------------------------------- tools (37) */
  var tools = {
    hammer:     r('tools', { k: 'tool', shape: 'hammer', face: '#cbd5e1' }),
    mallet:     r('tools', { k: 'tool', shape: 'mallet', face: '#c98a4b' }),
    screwdriver: r('tools', { k: 'tool', shape: 'screwdriver', grip: '#dc2626' }),
    wrench:     r('tools', { k: 'tool', shape: 'wrench' }),
    pliers:     r('tools', { k: 'tool', shape: 'pliers' }),
    socket:     r('tools', { k: 'tool', shape: 'socket' }),
    handsaw:    r('tools', { k: 'tool', shape: 'saw' }),
    sawhorse:   r('tools', { k: 'tool', shape: 'sawhorse' }),
    drill:      r('tools', { k: 'tool', shape: 'drill' }),
    chisel:     r('tools', { k: 'tool', shape: 'chisel' }),
    needlefile: r('tools', { k: 'tool', shape: 'file' }),
    sandpaper:  r('tools', { k: 'tool', shape: 'sandpaper' }),
    ducttape:   r('tools', { k: 'tool', shape: 'tape', colour: '#1f2937' }),
    glue:       r('tools', { k: 'tool', shape: 'glue' }),
    shears:     r('tools', { k: 'tool', shape: 'shears', handle: '#16a34a' }),
    axe:        r('tools', { k: 'tool', shape: 'axe' }),
    shovel:     r('tools', { k: 'tool', shape: 'shovel' }),
    trowel:     r('tools', { k: 'tool', shape: 'trowel' }),
    rake:       r('tools', { k: 'tool', shape: 'rake' }),
    wheelbarrow: r('tools', { k: 'tool', shape: 'cart' }),
    workbench:  r('tools', { k: 'tool', shape: 'bench' }),
    toolbox:    r('tools', { k: 'tool', shape: 'toolbox' }),
    nail:       r('tools', { k: 'tool', shape: 'fastener', kind: 'nail' }),
    screw:      r('tools', { k: 'tool', shape: 'fastener', kind: 'screw' }),
    nut:        r('tools', { k: 'tool', shape: 'fastener', kind: 'nut' }),
    boltcutter: r('tools', { k: 'tool', shape: 'plierscut' }),
    plumbline:  r('tools', { k: 'tool', shape: 'plumb' }),
    spiritlevel: r('tools', { k: 'tool', shape: 'level' }),
    protractor: r('tools', { k: 'tool', shape: 'protractor' }),
    clamp:      r('tools', { k: 'tool', shape: 'clamp' }),
    vice:       r('tools', { k: 'tool', shape: 'vice' }),
    chainsaw:   r('tools', { k: 'tool', shape: 'chainsaw' }),
    pickaxe:    r('tools', { k: 'tool', shape: 'pickaxe' }),
    crowbar:    r('tools', { k: 'tool', shape: 'crowbar' }),
    solderingiron: r('tools', { k: 'tool', shape: 'solder' }),
    multimeter:  r('tools', { k: 'tool', shape: 'meter' }),
    paintbrush: r('tools', { k: 'tool', shape: 'brush' }),
    paint:      r('tools', { k: 'tool', shape: 'canpaint', paint: '#ef4444' }),
    varnish:    r('tools', { k: 'tool', shape: 'varnish' })
  };

  /* ------------------------------------------------------------- office (39) */
  var office = {
    desk:        r('office', { k: 'office', shape: 'desk' }),
    officechair: r('office', { k: 'office', shape: 'chair' }),
    stapler:     r('office', { k: 'office', shape: 'stapler' }),
    paperclip:   r('office', { k: 'office', shape: 'clip', colour: '#0ea5e9' }),
    staple:      r('office', { k: 'office', shape: 'staple' }),
    folder:      r('office', { k: 'office', shape: 'folder' }),
    envelope:    r('office', { k: 'office', shape: 'envelope' }),
    stamp:       r('office', { k: 'office', shape: 'stamp' }),
    ink:         r('office', { k: 'office', shape: 'stamp', handle: '#1f2937', wood: '#334155', face: '#1d4ed8' }),
    notepad:     r('office', { k: 'office', shape: 'pad' }),
    whiteboard:  r('office', { k: 'office', shape: 'board', frame: '#94a3b8', writing: 'M28,48 q10,-16 22,0 t22,0' }),
    filingcabinet: r('office', { k: 'office', shape: 'cabinet', label: 1 }),
    drawer:      r('office', { k: 'office', shape: 'drawer' }),
    shelf:       r('office', { k: 'office', shape: 'shelf' }),
    sideboard:   r('office', { k: 'office', shape: 'cabinet', body: '#92400e', drawer: '#b45309' }),
    sofa:        r('office', { k: 'office', shape: 'sofa' }),
    photocopier: r('office', { k: 'office', shape: 'copier' }),
    calculator:  r('office', { k: 'office', shape: 'calculator' }),
    calendar:    r('office', { k: 'office', shape: 'calendar' }),
    diary:       r('office', { k: 'office', shape: 'diary' }),
    pushpin:     r('office', { k: 'office', shape: 'pin', head: '#ef4444' }),
    elasticband: r('office', { k: 'office', shape: 'band', ring: '#f59e0b', ring2: '#22c55e' }),
    holepunch:   r('office', { k: 'office', shape: 'punch' }),
    letter:      r('office', { k: 'office', shape: 'letter' }),
    parcel:      r('office', { k: 'office', shape: 'parcel' }),
    signature:   r('office', { k: 'office', shape: 'signature' }),
    contract:    r('office', { k: 'office', shape: 'document', seal: '#16a34a' }),
    report:      r('office', { k: 'office', shape: 'document' }),
    spreadsheet: r('office', { k: 'office', shape: 'chart', series: '#16a34a' }),
    presentation: r('office', { k: 'office', shape: 'slide' }),
    meeting:     r('office', { k: 'office', shape: 'meeting' }),
    purchase:    r('office', { k: 'office', shape: 'order' }),
    budget:      r('office', { k: 'office', shape: 'coins' }),
    invoice:     r('office', { k: 'office', shape: 'invoice' }),
    form:        r('office', { k: 'office', shape: 'form' }),
    clipboard:   r('office', { k: 'office', shape: 'clipboard' }),
    briefcase:   r('office', { k: 'office', shape: 'briefcase' }),
    wastebasket: r('office', { k: 'office', shape: 'bin', body: '#334155', lid: '#1f2937' }),
    bookshelf:   r('office', { k: 'office', shape: 'shelf', board: '#b45309', side: '#92400e', item: '#8b5cf6' })
  };

  /* ------------------------------------------------------------- school (40) */
  var school = {
    classroom:  r('school', { k: 'school', shape: 'room' }),
    pupil:      r('school', { k: 'school', shape: 'pupil', shirt: '#3b82f6' }),
    blackboard: r('school', { k: 'school', shape: 'chalkboard' }),
    lesson:     r('school', { k: 'school', shape: 'chalkboard', frame: '#7c2a12', surface: '#365314' }),
    homework:   r('school', { k: 'school', shape: 'worksheet', head: '#fde68a' }),
    exam:       r('school', { k: 'school', shape: 'worksheet', head: '#fecaca' }),
    grade:      r('school', { k: 'school', shape: 'reportcard', band: '#0ea5e9', grade: '#16a34a' }),
    pencil:     r('school', { k: 'school', shape: 'writing', body: '#f59e0b', band: '#64748b' }),
    pen:        r('school', { k: 'school', shape: 'writing', body: '#0f172a', band: '#0ea5e9' }),
    crayon:     r('school', { k: 'school', shape: 'crayon', body: '#16a34a' }),
    gluestick:  r('school', { k: 'school', shape: 'gluestick' }),
    backpack:   r('school', { k: 'school', shape: 'bag' }),
    lunchbox:   r('school', { k: 'school', shape: 'lunchbox' }),
    pencilcase: r('school', { k: 'school', shape: 'pencilcase' }),
    compass:    r('school', { k: 'school', shape: 'compass' }),
    map:        r('school', { k: 'school', shape: 'map' }),
    globe:      r('school', { k: 'school', shape: 'globe' }),
    atlas:      r('school', { k: 'school', shape: 'atlas' }),
    dictionary: r('school', { k: 'school', shape: 'dictionary' }),
    textbook:   r('school', { k: 'school', shape: 'book', left: '#0f766e', right: '#115e59' }),
    worksheet:  r('school', { k: 'school', shape: 'worksheet' }),
    uniform:    r('school', { k: 'school', shape: 'gown' }),
    register:   r('school', { k: 'school', shape: 'register' }),
    schoolbell: r('school', { k: 'school', shape: 'bell' }),
    timetable:  r('school', { k: 'school', shape: 'timetable' }),
    subject:    r('school', { k: 'school', shape: 'book', left: '#7c2aed', right: '#6d28d9' }),
    semester:   r('school', { k: 'office', shape: 'calendar', head: '#7c3aed', mark: '#a78bfa', span: 10 }),
    term:       r('school', { k: 'office', shape: 'calendar', head: '#0891b2', mark: '#22d3ee', span: 5 }),
    laboratory: r('school', { k: 'school', shape: 'lab' }),
    playground: r('school', { k: 'school', shape: 'playground' }),
    breaktime:  r('school', { k: 'school', shape: 'bell', bell: '#34d399' }),
    recess:     r('school', { k: 'school', shape: 'yard', slide: '#f59e0b' }),
    diploma:    r('school', { k: 'school', shape: 'diploma' }),
    certificate: r('school', { k: 'school', shape: 'certificate' }),
    knowledge:  r('school', { k: 'screen', glyph: 'bulb', screen: '#1e1b4b', ink2: '#fbbf24' }),
    principal:  r('school', { k: 'school', shape: 'head', shirt: '#0f766e', hair: '#4a3728' }),
    podium:     r('school', { k: 'school', shape: 'podium', body: '#0f172a', top: '#334155' }),
    staffroom:  r('school', { k: 'school', shape: 'room', wall: '#e0f2fe', board: '#0f766e', desk: '#7c2a12' }),
    enrolment:  r('school', { k: 'office', shape: 'form' }),
    attendance: r('school', { k: 'school', shape: 'register', cover: '#7c2a12' }),
    corridor:   r('school', { k: 'school', shape: 'hall' }),
    locker:     r('school', { k: 'school', shape: 'locker' }),
    chalk:      r('school', { k: 'school', shape: 'chalk' })
  };

  /* -------------------------------------------------------- technology (35) */
  var technology = {
    phone:        r('technology', { k: 'message', shape: 'phone', glyph: 'mail', body: '#1f2937' }),
    smartphone:   r('technology', { k: 'message', shape: 'phone', glyph: 'grid', body: '#0f172a', screen: '#e0f2fe' }),
    computermouse: r('technology', { k: 'office', shape: 'mouse' }),
    keyboard:     r('technology', { k: 'office', shape: 'keyboard' }),
    headphones:   r('technology', { k: 'message', shape: 'sound', body: '#334155', accent: '#0ea5e9' }),
    microphone:   r('technology', { k: 'media', shape: 'mic', body: '#0f172a' }),
    webcam:       r('technology', { k: 'screen', glyph: 'camera2', screen: '#111827', ink2: '#0ea5e9' }),
    projector:    r('technology', { k: 'screen', glyph: 'projector', screen: '#111827', ink2: '#f59e0b', h: 54 }),
    router:       r('technology', { k: 'screen', glyph: 'wifi', screen: '#0f172a', ink2: '#4ade80' }),
    modem:        r('technology', { k: 'screen', glyph: 'signal', screen: '#111827', ink2: '#4ade80' }),
    pendrive:     r('technology', { k: 'tool', shape: 'chisel', handle: '#0f172a' }),
    memorycard:   r('technology', { k: 'tool', shape: 'memory' }),
    harddisk:     r('technology', { k: 'screen', glyph: 'stack', screen: '#111827', ink2: '#38bdf8' }),
    software:     r('technology', { k: 'screen', glyph: 'code', screen: '#111827', ink2: '#4ade80' }),
    application:  r('technology', { k: 'screen', glyph: 'grid', screen: '#0f172a', ink2: '#38bdf8' }),
    browser:      r('technology', { k: 'screen', glyph: 'globe', screen: '#111827', ink2: '#38bdf8' }),
    password:     r('technology', { k: 'screen', glyph: 'lock', screen: '#111827', ink2: '#fbbf24' }),
    username:     r('technology', { k: 'screen', glyph: 'user', screen: '#111827', ink2: '#38bdf8' }),
    file:         r('technology', { k: 'office', shape: 'document' }),
    program:      r('technology', { k: 'screen', glyph: 'code', screen: '#0f172a', ink2: '#a78bfa' }),
    website:      r('technology', { k: 'screen', glyph: 'globe', screen: '#0f172a', ink2: '#4ade80' }),
    email:        r('technology', { k: 'message', shape: 'mail' }),
    download:     r('technology', { k: 'screen', glyph: 'download', screen: '#111827', ink2: '#4ade80' }),
    upload:       r('technology', { k: 'screen', glyph: 'upload', screen: '#111827', ink2: '#38bdf8' }),
    network:      r('technology', { k: 'screen', glyph: 'nodes', screen: '#0f172a', ink2: '#38bdf8' }),
    /* the eleven the core deck already teaches */
    computer:     r('technology', { k: 'screen', glyph: 'grid', screen: '#111827', ink2: '#60a5fa', stand: 1 }),
    laptop:       r('technology', { k: 'screen', glyph: 'laptop', screen: '#111827', ink2: '#60a5fa', h: 44, top: 30 }),
    tablet:       r('technology', { k: 'screen', glyph: 'text', screen: '#111827', ink2: '#a78bfa', h: 70, top: 14 }),
    television:   r('technology', { k: 'screen', glyph: 'play', screen: '#111827', ink2: '#f87171', stand: 1, h: 56, top: 20 }),
    camera:       r('technology', { k: 'media', shape: 'documentary' }),
    radio:        r('technology', { k: 'media', shape: 'broadcast', screen: '#1f2937' }),
    printer:      r('technology', { k: 'office', shape: 'copier', body: '#94a3b8', panel: '#334155' }),
    speaker:      r('technology', { k: 'message', shape: 'sound', body: '#0f172a', accent: '#f43f5e' }),
    screen:       r('technology', { k: 'screen', glyph: 'chart', screen: '#111827', ink2: '#4ade80', stand: 1 }),
    battery:      r('technology', { k: 'screen', glyph: 'battery', screen: '#111827', ink2: '#4ade80' }),
    charger:      r('technology', { k: 'screen', glyph: 'plug', screen: '#111827', ink2: '#fbbf24' })
  };

  /* ----------------------------------------------------- communication (36) */
  var communication = {
    message:      r('communication', { k: 'message', shape: 'bubble', glyph: 'text' }),
    ringing:      r('communication', { k: 'message', shape: 'ring' }),
    pickup:       r('communication', { k: 'message', shape: 'handset' }),
    text:         r('communication', { k: 'message', shape: 'phone', glyph: 'text', body: '#1f2937' }),
    chat:         r('communication', { k: 'message', shape: 'chat' }),
    conversation: r('communication', { k: 'message', shape: 'bubble', glyph: 'dots' }),
    speech:       r('communication', { k: 'message', shape: 'bubble', glyph: 'call', edge: '#047857', accent: '#16a34a' }),
    tell:         r('communication', { k: 'message', shape: 'bubble', glyph: 'star' }),
    reply:        r('communication', { k: 'message', shape: 'bubble', glyph: 'reply' }),
    sign:         r('communication', { k: 'office', shape: 'signature', ink: '#0f172a' }),
    post:         r('communication', { k: 'message', shape: 'note' }),
    share:        r('communication', { k: 'message', shape: 'bubble', glyph: 'share' }),
    attach:       r('communication', { k: 'message', shape: 'bubble', glyph: 'upload' }),
    forward:      r('communication', { k: 'message', shape: 'bubble', glyph: 'reply', edge: '#0369a1', accent: '#0284c7' }),
    voice:        r('communication', { k: 'message', shape: 'sound' }),
    tone:         r('communication', { k: 'message', shape: 'word', ink: '#334155', accent: '#7c3aed' }),
    sentence:     r('communication', { k: 'message', shape: 'word' }),
    phrase:       r('communication', { k: 'message', shape: 'word', paper: '#fef3c7', accent: '#b45309' }),
    alphabet:     r('communication', { k: 'message', shape: 'alphabet' }),
    spelling:     r('communication', { k: 'school', shape: 'worksheet', head: '#ddd6fe' }),
    address:      r('communication', { k: 'message', shape: 'post' }),
    inbox:        r('communication', { k: 'message', shape: 'letterbox', label: '#4ade80' }),
    outbox:       r('communication', { k: 'message', shape: 'letterbox', label: '#fbbf24' }),
    mailbox:      r('communication', { k: 'message', shape: 'letterbox', body: '#2563eb', lid: '#1d4ed8', flag: '#dc2626' }),
    contact:      r('communication', { k: 'message', shape: 'contact' }),
    introduce:    r('communication', { k: 'message', shape: 'bubble', glyph: 'emoji' }),
    greet:        r('communication', { k: 'message', shape: 'bubble', glyph: 'wave', edge: '#0f766e', accent: '#14b8a6' }),
    welcome:      r('communication', { k: 'message', shape: 'bubble', glyph: 'heart', edge: '#c2410c', accent: '#f43f5e' }),
    interrupt:    r('communication', { k: 'message', shape: 'bubble', glyph: 'warn' }),
    mute:         r('communication', { k: 'message', shape: 'mute' }),
    nickname:     r('communication', { k: 'message', shape: 'nickname' }),
    voicemail:    r('communication', { k: 'message', shape: 'sound', body: '#334155', accent: '#f43f5e' }),
    chatroom:     r('communication', { k: 'message', shape: 'roomchat' }),
    emoticon:     r('communication', { k: 'message', shape: 'emoticon' }),
    newsletter:   r('communication', { k: 'message', shape: 'note', colour: '#dbeafe' }),
    intercom:     r('communication', { k: 'message', shape: 'sound', body: '#475569', accent: '#f59e0b' })
  };

  /* ------------------------------------------------------------- media (25) */
  var media = {
    newspaper:    r('media', { k: 'media', shape: 'press' }),
    magazine:     r('media', { k: 'media', shape: 'magazine' }),
    article:      r('media', { k: 'media', shape: 'headline', paper: '#fdfdff', ink: '#0f172a', accent: '#0369a1' }),
    headline:     r('media', { k: 'media', shape: 'headline' }),
    column:       r('media', { k: 'media', shape: 'column', accent: '#0369a1' }),
    press:        r('media', { k: 'media', shape: 'coverage' }),
    podcast:      r('media', { k: 'media', shape: 'podcast' }),
    broadcast:    r('media', { k: 'media', shape: 'broadcast' }),
    channel:      r('media', { k: 'media', shape: 'channel', num: 7 }),
    programme:    r('media', { k: 'media', shape: 'episode' }),
    episode:      r('media', { k: 'media', shape: 'episode', frame: '#7c3aed', screen: '#4c1d95' }),
    series:       r('media', { k: 'media', shape: 'series' }),
    documentary:  r('media', { k: 'media', shape: 'documentary', cam: '#334155' }),
    interview:    r('media', { k: 'media', shape: 'interview' }),
    advertisement: r('media', { k: 'media', shape: 'ad' }),
    slogan:       r('media', { k: 'media', shape: 'slogan' }),
    subscriber:   r('media', { k: 'media', shape: 'subscriber' }),
    circulation:  r('media', { k: 'media', shape: 'circulation' }),
    editorial:    r('media', { k: 'media', shape: 'editorial' }),
    coverage:     r('media', { k: 'media', shape: 'coverage', live: '#b91c1c' }),
    censorship:   r('media', { k: 'media', shape: 'censorship' }),
    copyright:    r('media', { k: 'media', shape: 'copyright' }),
    caption:      r('media', { k: 'media', shape: 'caption' }),
    trailer:      r('media', { k: 'media', shape: 'trailer' }),
    review:       r('media', { k: 'media', shape: 'review', rating: 4 })
  };

  LLC.art.spec(tools);
  LLC.art.spec(office);
  LLC.art.spec(school);
  LLC.art.spec(technology);
  LLC.art.spec(communication);
  LLC.art.spec(media);
})(window);
