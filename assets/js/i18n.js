/*!
 * i18n.js - Interface localisation (UI strings).
 *
 * Plain classic script (no ES modules) so the app also runs from file:// URLs,
 * where module loading is blocked by CORS.
 *
 * The UI language is intentionally independent from the languages shown on the
 * cards: a Brazilian user can study English -> Spanish with the interface in
 * Portuguese. Adding a new UI language only requires a new entry in LOCALES.
 */
(function (global) {
  'use strict';

  var LLC = global.LLC || (global.LLC = {});

  /* ------------------------------------------------------------------ *
   * UI strings
   * ------------------------------------------------------------------ */

  var LOCALES = {
    en: {
      _name: 'English',
      _dir: 'ltr',
      _flag: '🇬🇧',

      'app.title': 'Gnumarus',
      'app.tagline': 'Learn languages with pictures',
      'app.skip': 'Skip to content',

      'nav.deck': 'Deck',
      'nav.study': 'Study',
      'nav.progress': 'Progress',
      'nav.settings': 'Settings',
      'nav.language': 'Interface language',

      'common.search': 'Search',
      'common.searchPlaceholder': 'Search words…',
      'common.clear': 'Clear',
      'common.next': 'Next',
      'common.reset': 'Reset',
      'common.export': 'Export',
      'common.import': 'Import',
      'common.words': 'words',
      'common.of': 'of',
      'common.speak': 'Pronounce',

      'type.noun': 'Noun',
      'type.adjective': 'Adjective',
      'type.verb': 'Verb',
      'type.adverb': 'Adverb',
      'type.pronoun': 'Pronoun',
      'type.preposition': 'Preposition',
      'type.conjunction': 'Conjunction',
      'type.interjection': 'Interjection',
      'type.number': 'Numeral',

      'deck.title': 'Card deck',
      'deck.subtitle': 'Tap a card to see the word in every language.',
      'deck.empty': 'No cards match your filters.',
      'deck.emptyHint': 'Try clearing the search box or picking “All”.',
      'deck.new': 'New',
      'deck.showLearned': 'Show learned cards',
      'deck.progress': 'Box {box} of {max} · {seen} seen',
      'deck.untouched': 'Not studied yet',
      'deck.showing': 'Showing {from}–{to} of {total}',
      'deck.prevPage': 'Previous',
      'deck.nextPage': 'Next',
      'deck.goToPage': 'Go to page {page}',
      'deck.pagesLabel': 'Deck pages',
      'deck.tapToHear': 'Tap a language to hear it',
      'deck.summaryLine': '{mastered} of {total} mastered · {due} due today',

      'study.title': 'Study session',
      'study.subtitle': 'Look at the picture, recall the word, then reveal it.',
      'study.mode': 'Mode',
      'study.modeLearn': 'Learn',
      'study.modeLearnDesc': 'Show the answer as soon as you want.',
      'study.modeReview': 'Review',
      'study.modeReviewDesc': 'Only cards that are due for review.',
      'study.modeQuiz': 'Quiz',
      'study.modeQuizDesc': 'Multiple choice, the answer is hidden.',
      'study.source': 'I know this language',
      'study.target': 'I want to learn',
      'study.start': 'Start session',
      'study.sessionSize': 'Cards per session',
      'study.upNext': 'Up next',
      'study.showAnswer': 'Show answer',
      'study.knew': 'I knew it',
      'study.didntKnow': "I didn't know",
      'study.exit': 'Leave session',
      'study.complete': 'Session complete',
      'study.completeBody': 'You reviewed {count} cards.',
      'study.accuracy': 'Accuracy',
      'study.knewCount': 'Got it',
      'study.missedCount': 'Missed',
      'study.again': 'Study again',
      'study.home': 'Back to deck',
      'study.noCards': 'Nothing to study right now.',
      'study.noCardsHint': 'Come back later, or switch to Learn mode to keep going.',
      'study.position': 'Card {current} of {total}',

      'quiz.choose': 'Which word is this picture?',
      'quiz.correct': 'Correct!',
      'quiz.correctAnswer': 'The answer is {word}.',

      'progress.title': 'Progress',
      'progress.subtitle': 'How much of the deck you have already collected.',
      'progress.mastered': 'Mastered',
      'progress.learning': 'In progress',
      'progress.unseen': 'Not studied',
      'progress.accuracy': 'Answers right',
      'progress.streak': 'Day streak',
      'progress.streakDay': '{count} days in a row',
      'progress.best': 'Best streak: {count}',
      'progress.dueToday': 'Due today',
      'progress.dueTodayHint': 'cards waiting for review.',
      'progress.byCategory': 'By category',
      'progress.history': 'Last 14 days',
      'progress.historyEmpty': 'No study sessions yet — start one!',
      'progress.resetTitle': 'Reset all progress?',
      'progress.resetBody': 'Every card goes back to “not studied”. This cannot be undone.',
      'progress.exportTitle': 'Export progress',
      'progress.importOk': 'Progress imported.',
      'progress.importError': 'That file could not be read as progress data.',
      'progress.resetDone': 'Progress cleared.',
      'progress.learnedToday': 'Reviewed today',
      'progress.storageWarn': 'This browser is blocking local storage, so progress will be lost when you close the page.',

      'settings.title': 'Settings',
      'settings.subtitle': 'How the app looks, and which languages the cards show.',
      'settings.theme': 'Theme',
      'settings.themeHint': 'Light, dark, or follow your device.',
      'settings.themeLight': 'Light',
      'settings.themeDark': 'Dark',
      'settings.themeSystem': 'System',
      'settings.interface': 'Interface',
      'settings.langHint': 'The interface language is separate from the languages you study.',
      'settings.cardLanguages': 'Languages on the cards',
      'settings.cardLanguagesHint': 'Pick at least two. You can still study any pair.',
      'settings.speech': 'Pronunciation',
      'settings.speechHint': 'Use the voices installed on your device.',
      'settings.motion': 'Animations',
      'settings.motionHint': 'Turn off to reduce motion.',
      'settings.data': 'Your data',
      'settings.storageOn': 'Progress is saved in this browser.',
      'settings.storageOff': 'Storage unavailable — progress is kept only while the page is open.',
      'settings.about': 'About',
      'settings.aboutBody': 'A picture dictionary that turns into a spaced-repetition deck. Works offline, straight from your file system, with no server and no build step.',
      'settings.version': 'Version {version}',

      'a11y.art': 'Picture: {word}',
      'a11y.flip': 'Flip card to reveal translations',
      'a11y.boxProgress': 'Review box {box} of {max}',
      'a11y.category': 'Category: {name}',

      'lang.en': 'English',
      'lang.pt': 'Portuguese',
      'lang.es': 'Spanish'
    },

    pt: {
      _name: 'Português',
      _dir: 'ltr',
      _flag: '🇧🇷',

      'app.title': 'Gnumarus',
      'app.tagline': 'Aprenda idiomas com imagens',
      'app.skip': 'Ir para o conteúdo',

      'nav.deck': 'Baralho',
      'nav.study': 'Estudo',
      'nav.progress': 'Progresso',
      'nav.settings': 'Ajustes',
      'nav.language': 'Idioma da interface',

      'common.search': 'Buscar',
      'common.searchPlaceholder': 'Buscar palavras…',
      'common.clear': 'Limpar',
      'common.next': 'Avançar',
      'common.reset': 'Apagar',
      'common.export': 'Exportar',
      'common.import': 'Importar',
      'common.words': 'palavras',
      'common.of': 'de',
      'common.speak': 'Ouvir',

      'type.noun': 'Substantivo',
      'type.adjective': 'Adjetivo',
      'type.verb': 'Verbo',
      'type.adverb': 'Adverbio',
      'type.pronoun': 'Pronombre',
      'type.preposition': 'Preposición',
      'type.conjunction': 'Conjunción',
      'type.interjection': 'Interjección',
      'type.number': 'Numeral',
      'type.adverb': 'Advérbio',
      'type.pronoun': 'Pronome',
      'type.preposition': 'Preposição',
      'type.conjunction': 'Conjunção',
      'type.interjection': 'Interjeição',
      'type.number': 'Numeral',

      'deck.title': 'Baralho de cards',
      'deck.subtitle': 'Toque em um card para ver a palavra em todos os idiomas.',
      'deck.empty': 'Nenhum card corresponde aos filtros.',
      'deck.emptyHint': 'Tente limpar a busca ou escolher “Tudo”.',
      'deck.new': 'Novo',
      'deck.showLearned': 'Mostrar cards aprendidos',
      'deck.progress': 'Caixa {box} de {max} · {seen} vistas',
      'deck.untouched': 'Ainda não estudada',
      'deck.showing': 'Mostrando {from}–{to} de {total}',
      'deck.prevPage': 'Anterior',
      'deck.nextPage': 'Próxima',
      'deck.goToPage': 'Ir para a página {page}',
      'deck.pagesLabel': 'Páginas do baralho',
      'deck.tapToHear': 'Toque em um idioma para ouvir',
      'deck.summaryLine': '{mastered} de {total} aprendidas · {due} para hoje',

      'study.title': 'Sessão de estudo',
      'study.subtitle': 'Veja a imagem, lembre a palavra e só então revele.',
      'study.mode': 'Modo',
      'study.modeLearn': 'Aprender',
      'study.modeLearnDesc': 'Mostre a resposta quando quiser.',
      'study.modeReview': 'Revisão',
      'study.modeReviewDesc': 'Só os cards que já estão na hora.',
      'study.modeQuiz': 'Teste',
      'study.modeQuizDesc': 'Múltipla escolha, sem mostrar a resposta.',
      'study.source': 'Eu já sei este idioma',
      'study.target': 'Quero aprender',
      'study.start': 'Começar sessão',
      'study.sessionSize': 'Cards por sessão',
      'study.upNext': 'A seguir',
      'study.showAnswer': 'Mostrar resposta',
      'study.knew': 'Eu sabia',
      'study.didntKnow': 'Não sabia',
      'study.exit': 'Sair da sessão',
      'study.complete': 'Sessão concluída',
      'study.completeBody': 'Você revisou {count} cards.',
      'study.accuracy': 'Acertos',
      'study.knewCount': 'Acertou',
      'study.missedCount': 'Errou',
      'study.again': 'Estudar de novo',
      'study.home': 'Voltar ao baralho',
      'study.noCards': 'Nada para estudar agora.',
      'study.noCardsHint': 'Volte mais tarde ou troque para o modo Aprender para continuar.',
      'study.position': 'Card {current} de {total}',

      'quiz.choose': 'Qual palavra é esta imagem?',
      'quiz.correct': 'Isso!',
      'quiz.correctAnswer': 'A resposta é {word}.',

      'progress.title': 'Progresso',
      'progress.subtitle': 'Quanto do baralho você já conquistou.',
      'progress.mastered': 'Dominadas',
      'progress.learning': 'Em andamento',
      'progress.unseen': 'Não estudadas',
      'progress.accuracy': 'Respostas certas',
      'progress.streak': 'Dias seguidos',
      'progress.streakDay': '{count} dias seguidos',
      'progress.best': 'Melhor sequência: {count}',
      'progress.dueToday': 'Para hoje',
      'progress.dueTodayHint': 'cards esperando a revisão.',
      'progress.byCategory': 'Por categoria',
      'progress.history': 'Últimos 14 dias',
      'progress.historyEmpty': 'Nenhuma sessão ainda — comece uma!',
      'progress.resetTitle': 'Apagar todo o progresso?',
      'progress.resetBody': 'Todos os cards voltam para “não estudado”. Não dá para desfazer.',
      'progress.exportTitle': 'Exportar progresso',
      'progress.importOk': 'Progresso importado.',
      'progress.importError': 'Não consegui ler esse arquivo como dados de progresso.',
      'progress.resetDone': 'Progresso apagado.',
      'progress.learnedToday': 'Revisadas hoje',
      'progress.storageWarn': 'Este navegador está bloqueando o armazenamento local, então o progresso será perdido ao fechar a página.',

      'settings.title': 'Ajustes',
      'settings.subtitle': 'A aparência do app e quais idiomas os cards mostram.',
      'settings.theme': 'Tema',
      'settings.themeHint': 'Claro, escuro ou conforme ao seu dispositivo.',
      'settings.themeLight': 'Claro',
      'settings.themeDark': 'Escuro',
      'settings.themeSystem': 'Sistema',
      'settings.interface': 'Interface',
      'settings.langHint': 'O idioma da interface é independente dos idiomas que você estuda.',
      'settings.cardLanguages': 'Idiomas nos cards',
      'settings.cardLanguagesHint': 'Escolha pelo menos dois. Você pode estudar qualquer par.',
      'settings.speech': 'Pronúncia',
      'settings.speechHint': 'Usa as vozes instaladas no seu dispositivo.',
      'settings.motion': 'Animações',
      'settings.motionHint': 'Desligue para reduzir o movimento.',
      'settings.data': 'Seus dados',
      'settings.storageOn': 'O progresso é salvo neste navegador.',
      'settings.storageOff': 'Sem armazenamento — o progresso só vale enquanto a página estiver aberta.',
      'settings.about': 'Sobre',
      'settings.aboutBody': 'Um dicionário ilustrado que se transforma em baralho de repetição espaçada. Funciona offline, direto do seu sistema de arquivos, sem servidor e sem build.',
      'settings.version': 'Versão {version}',

      'a11y.art': 'Imagem: {word}',
      'a11y.flip': 'Virar o card para ver as traduções',
      'a11y.boxProgress': 'Caixa {box} de {max}',
      'a11y.category': 'Categoria: {name}',

      'lang.en': 'Inglês',
      'lang.pt': 'Português',
      'lang.es': 'Espanhol'
    },

    es: {
      _name: 'Español',
      _dir: 'ltr',
      _flag: '🇪🇸',

      'app.title': 'Gnumarus',
      'app.tagline': 'Aprende idiomas con imágenes',
      'app.skip': 'Saltar al contenido',

      'nav.deck': 'Mazo',
      'nav.study': 'Estudio',
      'nav.progress': 'Progreso',
      'nav.settings': 'Ajustes',
      'nav.language': 'Idioma de la interfaz',

      'common.search': 'Buscar',
      'common.searchPlaceholder': 'Buscar palabras…',
      'common.clear': 'Limpiar',
      'common.next': 'Siguiente',
      'common.reset': 'Borrar',
      'common.export': 'Exportar',
      'common.import': 'Importar',
      'common.words': 'palabras',
      'common.of': 'de',
      'common.speak': 'Escuchar',

      'type.noun': 'Sustantivo',
      'type.adjective': 'Adjetivo',
      'type.verb': 'Verbo',
      'type.adverb': 'Adverbio',
      'type.pronoun': 'Pronombre',
      'type.preposition': 'Preposición',
      'type.conjunction': 'Conjunción',
      'type.interjection': 'Interjección',
      'type.number': 'Numeral',

      'deck.title': 'Mazo de tarjetas',
      'deck.subtitle': 'Toca una tarjeta para ver la palabra en todos los idiomas.',
      'deck.empty': 'Ninguna tarjeta coincide con los filtros.',
      'deck.emptyHint': 'Prueba a limpiar la búsqueda o elige “Todo”.',
      'deck.new': 'Nueva',
      'deck.showLearned': 'Mostrar las aprendidas',
      'deck.progress': 'Caja {box} de {max} · {seen} vistas',
      'deck.untouched': 'Todavía sin estudiar',
      'deck.showing': 'Mostrando {from}–{to} de {total}',
      'deck.prevPage': 'Anterior',
      'deck.nextPage': 'Siguiente',
      'deck.goToPage': 'Ir a la página {page}',
      'deck.pagesLabel': 'Páginas del mazo',
      'deck.tapToHear': 'Toca un idioma para escucharlo',
      'deck.summaryLine': '{mastered} de {total} aprendidas · {due} para hoy',

      'study.title': 'Sesión de estudio',
      'study.subtitle': 'Mira la imagen, recuerda la palabra y solo entonces descubre la respuesta.',
      'study.mode': 'Modo',
      'study.modeLearn': 'Aprender',
      'study.modeLearnDesc': 'Muestra la respuesta cuando quieras.',
      'study.modeReview': 'Repaso',
      'study.modeReviewDesc': 'Solo las tarjetas que ya tocaban.',
      'study.modeQuiz': 'Prueba',
      'study.modeQuizDesc': 'Opción múltiple, sin mostrar la respuesta.',
      'study.source': 'Ya sé este idioma',
      'study.target': 'Quiero aprender',
      'study.start': 'Empezar',
      'study.sessionSize': 'Tarjetas por sesión',
      'study.upNext': 'Lo siguiente',
      'study.showAnswer': 'Mostrar respuesta',
      'study.knew': 'Lo sabía',
      'study.didntKnow': 'No lo sabía',
      'study.exit': 'Salir de la sesión',
      'study.complete': 'Sesión completada',
      'study.completeBody': 'Repasaste {count} tarjetas.',
      'study.accuracy': 'Aciertos',
      'study.knewCount': 'Acertaste',
      'study.missedCount': 'Fallaste',
      'study.again': 'Estudiar otra vez',
      'study.home': 'Volver al mazo',
      'study.noCards': 'No hay nada para estudiar ahora.',
      'study.noCardsHint': 'Vuelve más tarde o cambia al modo Aprender para seguir.',
      'study.position': 'Tarjeta {current} de {total}',

      'quiz.choose': '¿Qué palabra es esta imagen?',
      'quiz.correct': '¡Correcto!',
      'quiz.correctAnswer': 'La respuesta es {word}.',

      'progress.title': 'Progreso',
      'progress.subtitle': 'Cuánto del mazo ya has conseguido.',
      'progress.mastered': 'Dominadas',
      'progress.learning': 'En progreso',
      'progress.unseen': 'Sin estudiar',
      'progress.accuracy': 'Respuestas correctas',
      'progress.streak': 'Días seguidos',
      'progress.streakDay': '{count} días seguidos',
      'progress.best': 'Mejor racha: {count}',
      'progress.dueToday': 'Para hoy',
      'progress.dueTodayHint': 'tarjetas esperando el repaso.',
      'progress.byCategory': 'Por categoría',
      'progress.history': 'Últimos 14 días',
      'progress.historyEmpty': 'Aún no hay sesiones — ¡empieza una!',
      'progress.resetTitle': '¿Borrar todo el progreso?',
      'progress.resetBody': 'Todas las vuelven a “sin estudiar”. No se puede deshacer.',
      'progress.exportTitle': 'Exportar progreso',
      'progress.importOk': 'Progreso importado.',
      'progress.importError': 'No se pudo leer ese archivo como datos de progreso.',
      'progress.resetDone': 'Progreso borrado.',
      'progress.learnedToday': 'Revisadas hoy',
      'progress.storageWarn': 'Este navegador está bloqueando el almacenamiento local, así que el progreso se perderá al cerrar la página.',

      'settings.title': 'Ajustes',
      'settings.subtitle': 'El aspecto de la app y qué idiomas muestran las tarjetas.',
      'settings.theme': 'Tema',
      'settings.themeHint': 'Claro, oscuro o según tu dispositivo.',
      'settings.themeLight': 'Claro',
      'settings.themeDark': 'Oscuro',
      'settings.themeSystem': 'Sistema',
      'settings.interface': 'Interfaz',
      'settings.langHint': 'El idioma de la interfaz es independiente de los idiomas que estudias.',
      'settings.cardLanguages': 'Idiomas en las tarjetas',
      'settings.cardLanguagesHint': 'Elige al menos dos. Puedes estudiar cualquier par.',
      'settings.speech': 'Pronunciación',
      'settings.speechHint': 'Usa las voces instaladas en tu dispositivo.',
      'settings.motion': 'Animaciones',
      'settings.motionHint': 'Desactívalas para reducir el movimiento.',
      'settings.data': 'Tus datos',
      'settings.storageOn': 'El progreso se guarda en este navegador.',
      'settings.storageOff': 'Sin almacenamiento: el progreso solo vale con la página abierta.',
      'settings.about': 'Acerca de',
      'settings.aboutBody': 'Un diccionario ilustrado que se convierte en un mazo de repetición espaciada. Funciona sin conexión, desde tu propio disco, sin servidor y sin compilación.',
      'settings.version': 'Versión {version}',

      'a11y.art': 'Imagen: {word}',
      'a11y.flip': 'Girar la tarjeta para ver las traducciones',
      'a11y.boxProgress': 'Caja {box} de {max}',
      'a11y.category': 'Categoría: {name}',

      'lang.en': 'Inglés',
      'lang.pt': 'Portugués',
      'lang.es': 'Español'
    }
  };

  /* ------------------------------------------------------------------ *
   * Runtime
   * ------------------------------------------------------------------ */

  var current = 'en';
  var listeners = [];

  function detect() {
    var nav = (global.navigator && (global.navigator.languages || [global.navigator.language])) || [];
    for (var i = 0; i < nav.length; i++) {
      var tag = String(nav[i] || '').toLowerCase();
      if (LOCALES[tag]) return tag;
      var base = tag.split('-')[0];
      if (LOCALES[base]) return base;
    }
    return 'en';
  }

  function set(lang) {
    var next = LOCALES[lang] ? lang : 'en';
    var changed = next !== current;
    current = next;
    applyToDocument();
    if (!changed) return current;
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](current); } catch (err) { /* a listener must not break the switch */ }
    }
    return current;
  }

  /** Keeps <html lang/dir> in sync; also needed for the very first set(). */
  function applyToDocument() {
    var root = global.document && global.document.documentElement;
    if (!root) return;
    root.setAttribute('lang', current);
    root.setAttribute('dir', LOCALES[current]._dir);
  }

  /** Translate a key, replacing {placeholders} with the values in `params`. */
  function t(key, params) {
    var table = LOCALES[current] || LOCALES.en;
    var value = table[key];
    if (value === undefined) value = LOCALES.en[key];
    if (value === undefined) return key;
    if (!params) return value;
    return value.replace(/\{(\w+)\}/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match;
    });
  }

  /**
   * Walk `root` and localise every element carrying a data-i18n attribute.
   *   data-i18n="key"                  -> textContent
   *   data-i18n-aria-label="key"       -> aria-label
   *   data-i18n-title="key"            -> title
   *   data-i18n-placeholder="key"      -> placeholder
   *   data-i18n-args="a|b|c"           -> {a,b,c} interpolation for the key
   */
  function apply(root) {
    var scope = root || global.document;
    if (!scope || !scope.querySelectorAll) return;

    var attrMap = [
      ['', 'textContent'],
      ['aria-label', 'aria-label'],
      ['title', 'title'],
      ['placeholder', 'placeholder'],
      ['value', 'value']
    ];

    var nodes = scope.querySelectorAll('[data-i18n],[data-i18n-aria-label],[data-i18n-title],[data-i18n-placeholder],[data-i18n-value]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var rawArgs = node.getAttribute('data-i18n-args');
      var params = null;
      if (rawArgs) {
        var names = rawArgs.split('|');
        params = {};
        for (var j = 0; j < names.length; j++) {
          if (!names[j]) continue;
          params[names[j]] = node.getAttribute('data-' + names[j]);
        }
      }
      for (var k = 0; k < attrMap.length; k++) {
        var suffix = attrMap[k][0];
        var node2 = suffix ? node.getAttribute('data-i18n-' + suffix) : node.getAttribute('data-i18n');
        if (node2 === null || node2 === undefined) continue;
        var text = t(node2, params);
        if (attrMap[k][1] === 'textContent') node.textContent = text;
        else node.setAttribute(attrMap[k][1], text);
      }
    }
  }

  /** Localised display name of a content language, e.g. { id: 'pt', name: 'Português' }. */
  function languageName(langId, inLang) {
    var inId = inLang || current;
    var table = LOCALES[inId] || LOCALES.en;
    if (table['lang.' + langId]) return table['lang.' + langId];
    return (LLC.data && LLC.data.languages && LLC.data.languages[langId] && LLC.data.languages[langId].name) || langId;
  }

  var i18n = {
    LOCALES: LOCALES,
    get current() { return current; },
    get available() { return Object.keys(LOCALES); },
    detect: detect,
    set: set,
    t: t,
    apply: apply,
    languageName: languageName,
    onChange: function (fn) { listeners.push(fn); return fn; }
  };

  LLC.i18n = i18n;
})(window);
