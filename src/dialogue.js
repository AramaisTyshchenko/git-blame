/**
 * dialogue.js — All game text in Ukrainian
 *
 * Format:
 *   { speaker: characterId|'narrator', portrait: state, text: string }
 *
 * Special keys:
 *   { type: 'pause', ms: 500 }
 *   { type: 'sfx', key: audioKey }
 *   { type: 'music', key: audioKey }
 *   { type: 'bg', scene: sceneId }
 */

'use strict';

// ─────────────────────────────────────────────────────────
// ACTS — metadata
// ─────────────────────────────────────────────────────────

const ACTS = [
  {
    number: 'АКТ І',
    title: 'Баг-репорт, якого ніхто не подав',
    description:
      'П\'ятирічний ювілей команди «TARS» перервано анонімним повідомленням. ' +
      'Хтось підробив скріншот і погрожує зливом клієнтам. ' +
      'Розслідування розпочато.',
    bg: 'warroom_party',
    music: 'main_theme',
  },
  {
    number: 'АКТ ІІ',
    title: 'Дифузія провини',
    description:
      'Журнали чату підробленo. Хтось видалив повідомлення і змінив імена. ' +
      'Тарас відкриває термінал. ' +
      'Логи не брешуть — люди так.',
    bg: 'terminal',
    music: 'investigation',
  },
  {
    number: 'АКТ ІІІ',
    title: 'Протокол Саші-Міші',
    description:
      'В темному куті інтернету знайдено форум двох невдах. ' +
      'Зашифровані плани, дитячі шифри, і золота схема. ' +
      'Вітя вже точить олівець.',
    bg: 'villain_forum',
    music: 'villain_theme',
  },
  {
    number: 'АКТ IV',
    title: 'git blame — Хто Натиснув Push',
    description:
      'Десять комітів. Один злочин. ' +
      'Хеш не бреше, diff — вирок, email — слід злочинця. ' +
      'Час зробити git blame.',
    bg: 'terminal',
    music: 'investigation',
  },
  {
    number: 'АКТ V',
    title: 'git push — Ювілейне видання',
    description:
      'Справу закрито. Команда виграла. ' +
      'П\'ять років — це не жарт. ' +
      'І так, козаки чекають.',
    bg: 'warroom_party',
    music: 'finale',
  },
];

// ─────────────────────────────────────────────────────────
// ACT I — Dialogue sequences
// ─────────────────────────────────────────────────────────

const ACT1_INTRO = [
  { type: 'music', key: 'main_theme' },
  { type: 'bg', scene: 'warroom_party' },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: 'П\'ять років. Тисячі повідомлень. Декілька хороших людей, чудових QA-інженерів, один радіофізик якого я досі не розумію до кінця, і одна людина, яка продає золото та відповідає швидше за девів.',
  },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: 'Непогано, якщо чесно.',
  },
  {
    speaker: 'aramais',
    portrait: 'default',
    text: 'Народ, вітаю всіх з п\'ятирічкою. Я тут замовив піцу... в Лондоні. До вас вона не доїде, але символічно.',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: 'Дякую. Ми вже відсвяткували без тебе.',
  },
  {
    speaker: 'ivan',
    portrait: 'enthusiastic',
    text: '5 РОКІВ!! НЕЙМОВІРНО!! Арамаіс, патч-нотатки до ювілею є??',
  },
  {
    speaker: 'anya',
    portrait: 'default',
    text: 'Іване, стоп. Арамаіс, є щось дивне. У мене нове повідомлення в чаті. Від невідомого номера.',
  },
  { type: 'sfx', key: 'sfx_chat' },
  { type: 'pause', ms: 800 },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: '[ На екрані з\'являється анонімне повідомлення: «Я знаю, що ви сказали клієнту X. Заплатіть — або це стане публічним.» До повідомлення прикріплено скріншот переписки. ]',
  },
  {
    speaker: 'aramais',
    portrait: 'worried',
    text: '...Що за хрінь.',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: 'Цікаво. Скріншот обрізаний. Бачиш? Тут щось видалено.',
  },
  {
    speaker: 'efim',
    portrait: 'default',
    text: 'EXIF-дані. Перевір файл.',
  },
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Це стара совкова схема. Шантаж. Я бачив таке. Розберемося.',
  },
  {
    speaker: 'inessa',
    portrait: 'default',
    text: 'Хлопці, я не розумію половину слів, але виглядає як якийсь лохотрон. У нас в золотарні такі листи щодня.',
  },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: '[ Ти отримуєш файл скріншоту. Час подивитися, що всередині. ]',
  },
];

const ACT1_PUZZLE_INTRO = [
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Файл зображення. Перевір метадані. Хто, коли, з якого пристрою.',
  },
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Шукай аномалії. Три речі, які не збігаються. Як правило, цього достатньо.',
  },
];

const ACT1_OUTRO = [
  {
    speaker: 'efim',
    portrait: 'precise',
    text: 'Часовий пояс — UTC+3. Пристрій — невідомий. Файл змінено після експорту. Три аномалії.',
  },
  {
    speaker: 'anya',
    portrait: 'sharp',
    text: 'Тобто хтось скачав скріншот, відредагував у графічному редакторі, і відправив нам.',
  },
  {
    speaker: 'ivan',
    portrait: 'enthusiastic',
    text: 'КРИТИЧНО! КРИТИЧНО! Це КРИТИЧНО!',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: 'Іване. Дихай.',
  },
  {
    speaker: 'aramais',
    portrait: 'determined',
    text: 'Хтось із наших. Або хтось, хто мав доступ. Переходимо до логів.',
  },
];

// ─────────────────────────────────────────────────────────
// ACT II — Log parser
// ─────────────────────────────────────────────────────────

const ACT2_INTRO = [
  { type: 'bg', scene: 'terminal' },
  { type: 'music', key: 'investigation' },
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Я вже бачив підроблені логи. Не перший раз. Дай доступ — покажу.',
  },
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Шукай пропуски в часі. Якщо між повідомленнями — 3 хвилини, а потім раптом — 40... щось видалено.',
  },
  {
    speaker: 'zheka',
    portrait: 'focused',
    text: 'Також є два замасковані юзера. USER_A і USER_B. Це не випадкові імена — хтось замінив їх вручну.',
  },
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Ці логи не брешуть. Люди — так.',
  },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: '[ Введи фільтр «user:USER_A», «user:USER_B» або «time:gap», щоб відфільтрувати підозрілі рядки. ]',
  },
];

const ACT2_PUZZLE_INTRO = [
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Три аномалії: пропуски в часі, замінені імена, і один рядок з іншим шрифтом. Знайди їх.',
  },
];

const ACT2_OUTRO = [
  {
    speaker: 'zheka',
    portrait: 'focused',
    text: 'USER_A і USER_B завантажили дамп чату за 22 хвилини до того, як нам прийшло повідомлення.',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: 'І пропуски — саме там, де була розмова про кращих клієнтів. Все просто.',
  },
  {
    speaker: 'anya',
    portrait: 'sharp',
    text: 'Це двоє, яких ми знаємо. Я впевнена.',
  },
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Дайте мені дві хвилини. Я знайшов кое-что цікаве в мережі.',
  },
];

// ─────────────────────────────────────────────────────────
// ACT III — Villain forum + Caesar cipher
// ─────────────────────────────────────────────────────────

const ACT3_INTRO = [
  { type: 'bg', scene: 'villain_forum' },
  { type: 'music', key: 'villain_theme' },
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Ось. Я знайшов форум. Він ще онлайн. Паролю немає.',
  },
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Я в своїй роботі аналізую радіосигнали. Це — такий же зашумлений сигнал. Просто треба знайти несучу частоту.',
  },
  {
    speaker: 'inessa',
    portrait: 'knowing',
    text: 'Почекайте... ця схема оплати — я таке бачила. Вони хочуть золото? Серйозно?',
  },
  {
    speaker: 'inessa',
    portrait: 'knowing',
    text: 'Це класичний «псевдо-анонімний обмін». Я таких листів отримую п\'ять на тиждень. Смішно.',
  },
  {
    speaker: 'inessa',
    portrait: 'default',
    text: 'Це ж класична схема, хлопці 🙄',
  },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: '[ На форумі є зашифроване повідомлення. Наші герої жваво обговорюють гру — яку? Той самий шифр. ]',
  },
  {
    speaker: 'aramais',
    portrait: 'determined',
    text: 'Вони завжди грали в Козаків разом з нами. Кожну п\'ятницю. Я знаю ключ.',
  },
];

const ACT3_PUZZLE_INTRO = [
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Шифр Цезаря. Зрушення на кількість літер у ключовому слові. Підказка — це гра, яку вони обожнювали.',
  },
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Вводь ключ у поле або крути колесо. Коли текст стане читабельним — переможеш.',
  },
];

const ACT3_OUTRO = [
  {
    speaker: 'narrator',
    portrait: 'default',
    text: '[ Ключ: COSSACKS. Зрушення 3. Текст розшифровано. ]',
  },
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Ось і все. Вони планували це тиждень. Але вони — дилетанти. Шифр Цезаря, Карле.',
  },
  {
    speaker: 'anya',
    portrait: 'sharp',
    text: 'І ось оригінальний скріншот — нерозрізаний. Ми захищали клієнта. Все тут є.',
  },
  {
    speaker: 'aramais',
    portrait: 'determined',
    text: 'Чудово. Тепер — закриваємо тікет.',
  },
];

// ─────────────────────────────────────────────────────────
// ACT IV — Git Forensics
// ─────────────────────────────────────────────────────────

const ACT4_INTRO = [
  { type: 'bg', scene: 'terminal' },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: '[ GIT LOG · repo: client-portal-v2 · 10 комітів · 1 підозрілий ]',
  },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: '[ git blame — хтось зробив коміт під чужою назвою. Але хеш не бреше. ]',
  },
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Десять комітів. В одному — приватні дані клієнта. Решта — прикриття.',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: 'Знайди підозрілий коміт, визнач автора, назви що злито. Без помилок.',
  },
  {
    speaker: 'ivan',
    portrait: 'enthusiastic',
    text: 'Я вже відкрив всі коміти! Всі — КРИТИЧНО підозрілі! Особливо "fix typo"!',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: '...Іване.',
  },
  {
    speaker: 'anya',
    portrait: 'sharp',
    text: 'Дивись не тільки на повідомлення коміту. Дивись на diff. І на час.',
  },
];

const ACT4_PUZZLE_INTRO = [
  {
    speaker: 'taras',
    portrait: 'reading',
    text: 'Клікай на коміти — відкриється diff. Читай уважно. Заповни форму: хеш, email, що злито.',
  },
];

const ACT4_OUTRO = [
  {
    speaker: 'anya',
    portrait: 'sharp',
    text: 'Ось і деталь. Витік містив лише публічну інформацію. Те, що й так є на сайті клієнта.',
  },
  {
    speaker: 'efim',
    portrait: 'precise',
    text: 'Юридично — нуль. Фактично — нуль. Загроза порожня.',
  },
  {
    speaker: 'zheka',
    portrait: 'focused',
    text: 'Весь шантаж побудований на фейку.',
  },
  {
    speaker: 'ivan',
    portrait: 'enthusiastic',
    text: 'ТІКЕТ ЗАКРИТО! КРИТИЧНО ВИРІШЕНО! ААААА!',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: 'Тест пройдено. Як завжди — через біль, але пройдено.',
  },
  {
    speaker: 'aramais',
    portrait: 'determined',
    text: 'Дякую всім. Це і є наша команда.',
  },
];

// ─────────────────────────────────────────────────────────
// ACT V — Ending narration
// ─────────────────────────────────────────────────────────

const ACT5_ENDING = [
  { type: 'bg', scene: 'warroom_party' },
  { type: 'music', key: 'finale' },
  {
    speaker: 'narrator',
    portrait: 'default',
    text: 'Справу закрито. Загроза знешкоджена. Команда — ціла.',
  },
  {
    speaker: 'aramais',
    portrait: 'determined',
    text: 'П\'ять років. Ми пережили дедлайни, клієнтів, ковід, і тепер ще й цих двох клоунів.',
  },
  {
    speaker: 'taras',
    portrait: 'unimpressed',
    text: 'В мене сорок і більше років. За ці п\'ять — я бачив гірше. Але ця команда — одна з найкращих.',
  },
  {
    speaker: 'vitya',
    portrait: 'patriotic',
    text: 'Слава Україні! І команді теж. (Хоча порядок може змінюватись.)',
  },
  {
    speaker: 'inessa',
    portrait: 'knowing',
    text: 'Ви взагалі знаєте що таке QA? Я досі не певна. Але ви класні.',
  },
  {
    speaker: 'anya',
    portrait: 'default',
    text: 'Ми — команда, яка знаходить баги. В коді і в людях.',
  },
  {
    speaker: 'zheka',
    portrait: 'focused',
    text: 'Стаємо тільки кращими. З кожним роком.',
  },
  {
    speaker: 'efim',
    portrait: 'precise',
    text: 'П\'ять років. Продовжуємо.',
  },
  {
    speaker: 'ivan',
    portrait: 'enthusiastic',
    text: 'ЦЕ НАЙКРАЩА КОМАНДА В СВІТІ!! КРИТИЧНО НАЙКРАЩА!!',
  },
  {
    speaker: 'aramais',
    portrait: 'default',
    text: 'Ще п\'ять. Poïkhali.',
  },
];

// ─────────────────────────────────────────────────────────
// FAKE CHAT LOGS for Puzzle 2 (Log Parser)
// ─────────────────────────────────────────────────────────

// Timestamps are HH:MM, users are member IDs or USER_X
const FAKE_LOGS = [
  { time: '10:01', user: 'aramais', msg: 'Привіт хлопці, є нові завдання від клієнта Х' },
  { time: '10:02', user: 'taras',   msg: 'Бачу. Тут кілька незрозумілих вимог' },
  { time: '10:03', user: 'zheka',   msg: 'Я вже дивився — вони хочуть автоматизацію для форми B-12' },
  { time: '10:04', user: 'efim',    msg: 'Оцінка: 3 дні' },
  { time: '10:05', user: 'anya',    msg: 'Погоджуюсь з Єфімом. Максимум 4.' },
  { time: '10:06', user: 'ivan',    msg: 'ФОРМА B-12 ЦЕ КРИТИЧНО Я ВЖЕ ТЕСТУЮ' },
  { time: '10:07', user: 'taras',   msg: 'Іване, спокійно' },
  { time: '10:08', user: 'USER_A',  msg: 'ок' },
  // GAP 10:09 - 10:47 (deleted)
  { time: '10:47', user: 'USER_A',  msg: 'я взагалі думаю що тут можна працювати краще', isGap: true, gapBefore: true },
  { time: '10:48', user: 'USER_B',  msg: 'та і я теж' },
  { time: '10:49', user: 'aramais', msg: 'Добре, тоді беремось' },
  { time: '10:50', user: 'taras',   msg: 'Планування на завтра' },
  { time: '10:51', user: 'zheka',   msg: 'Ок, запишу нотатки' },
  { time: '10:52', user: 'efim',    msg: 'Готово' },
  { time: '10:53', user: 'anya',    msg: '👍' },
  { time: '10:54', user: 'ivan',    msg: 'ГОТОВО!! КРИТИЧНО ГОТОВО!' },
  { time: '11:00', user: 'vitya',   msg: 'А хто там грає в Козаків сьогодні?' },
  { time: '11:01', user: 'inessa',  msg: 'я можу 😊' },
  { time: '11:02', user: 'vitya',   msg: 'відмінно' },
  { time: '11:03', user: 'USER_B',  msg: 'я теж буду, але trохи пізніше', isTampered: true },
  { time: '11:04', user: 'USER_A',  msg: 'аналогічно' },
  // GAP 11:05 - 11:52 (deleted)
  { time: '11:52', user: 'aramais', msg: 'Стосовно клієнта Х — всі дані які ми надали є публічними на їхньому сайті', isGap: true, gapBefore: true },
  { time: '11:53', user: 'taras',   msg: 'Підтверджую. Ми не виходили за рамки' },
  { time: '11:54', user: 'anya',    msg: 'Все правильно. Клієнт погодився.' },
  { time: '11:55', user: 'efim',    msg: 'Зафіксовано' },
  { time: '11:56', user: 'USER_A',  msg: 'ок зрозуміло' },
  { time: '11:57', user: 'USER_B',  msg: 'зрозуміло' },
  { time: '12:00', user: 'ivan',    msg: 'ОБІДПЕРЕРВА! КРИТИЧНО ВАЖЛИВО!' },
  { time: '12:01', user: 'zheka',   msg: '😂' },
  { time: '14:00', user: 'taras',   msg: 'Після обіду — демо клієнту' },
  { time: '14:01', user: 'anya',    msg: 'Готова' },
  { time: '14:02', user: 'efim',    msg: 'Готовий' },
  { time: '14:03', user: 'zheka',   msg: 'Готовий. Слайди зроблені.' },
  { time: '14:04', user: 'ivan',    msg: 'КРИТИЧНО ГОТОВИЙ!!' },
  { time: '14:05', user: 'USER_A',  msg: 'хм' },
  { time: '14:06', user: 'USER_B',  msg: 'ага' },
  // GAP 14:07 - 14:28 (deleted)
  { time: '14:28', user: 'aramais', msg: 'Демо пройшло добре! Клієнт задоволений.', isGap: true, gapBefore: true },
  { time: '14:29', user: 'taras',   msg: 'Очікувано.' },
  { time: '14:30', user: 'anya',    msg: '🎉' },
  { time: '14:31', user: 'ivan',    msg: '🎉🎉🎉 КРИТИЧНО ЯСКРАВО!!' },
  { time: '14:32', user: 'vitya',   msg: 'Слава! Тепер Козаки 💪' },
  { time: '14:33', user: 'inessa',  msg: '😊🎉' },
];

// ─────────────────────────────────────────────────────────
// VILLAIN FORUM POSTS for Puzzle 3
// ─────────────────────────────────────────────────────────

// Encoded text: shift 3 from COSSACKS key → Caesar shift 3 (C = 3rd letter)
// Plaintext: "ZAPLATY ABO MI ZLYEMO VSI VAШИ SEKRETY KLIENTAM PLZ"
// Encoded (shift +3, Ukrainian transliterated in latin for Caesar):
// Actually we'll use Latin alphabet Caesar for the puzzle to keep it simple
const VILLAIN_FORUM_POSTS = [
  {
    user: 'M_Dark_Lord',
    time: '23:14',
    text: 'Оk brat, plan gotof. Spochatkhu pIshemo yim',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:15',
    text: 'ta ti vzagaly vpevneny shho tse spratsiuye? vony ne durni',
    type: 'normal',
  },
  {
    user: 'M_Dark_Lord',
    time: '23:16',
    text: 'VPEVNENY. Maye boty hroshi. Ya bachyv.',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:17',
    text: 'a yaksho ne zaplatiaty?',
    type: 'normal',
  },
  {
    user: 'M_Dark_Lord',
    time: '23:18',
    text: 'TO MY VSYO VIDPRAVYMO KLIENTAM I VIN BANKRUT HAHA',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:19',
    text: '...а де жити будемо після цього',
    type: 'normal',
  },
  {
    user: 'M_Dark_Lord',
    time: '23:20',
    text: 'ne myslyu tak daleko',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:21',
    text: 'ok ok reshtu planom zashyfruу схему оплати:',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:22',
    // Encoded with Caesar shift 3: plaintext = "ZAPLATY ZOLOTOM NA ANON SKRYNKU INAKSHE VSYO"
    text: 'CDSOCDW CRORCXP ND DQRQ VNUBQNX LQDNVBL EVBR',
    type: 'encoded',
    plaintextHint: 'Схема оплати — зашифрована. Ключ — та гра, в яку всі грали щоп\'ятниці.',
  },
  {
    user: 'M_Dark_Lord',
    time: '23:23',
    text: 'GENIY!! tak i zrobymo',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:24',
    text: 'i ne zabud screenshote zrizaty zайві части',
    type: 'normal',
  },
  {
    user: 'M_Dark_Lord',
    time: '23:25',
    text: 'vzhe zroblyeno ;)',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:40',
    text: 'ти ще не спиш?',
    type: 'normal',
  },
  {
    user: 'M_Dark_Lord',
    time: '23:41',
    text: 'ni',
    type: 'normal',
  },
  {
    user: 'S_Pro_Hacker',
    time: '23:42',
    text: 'meni zhal shho tak vyishlo z komandoyu',
    type: 'normal',
  },
  {
    user: 'M_Dark_Lord',
    time: '23:43',
    text: '...meni tezh. Ale hroshi.',
    type: 'normal',
  },
];

// Caesar encode/decode utility
function caesarDecode(text, shift) {
  return text.replace(/[A-Z]/gi, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base - shift + 26) % 26) + base);
  });
}

function caesarEncode(text, shift) {
  return text.replace(/[A-Z]/gi, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
  });
}

// The encoded post (index 8) uses shift 3, key = COSSACKS (C = 3rd letter)
const CIPHER_PLAINTEXT  = 'ZAPLATY ZOLOTOM NA ANON SKRYNKU INAKSHE VSYO';
const CIPHER_ENCODED    = caesarEncode(CIPHER_PLAINTEXT, 3);
const CIPHER_KEY        = 'COSSACKS';
const CIPHER_SHIFT      = 3;

// Patch the encoded post with actual encoded text
VILLAIN_FORUM_POSTS[8].text = CIPHER_ENCODED;

// ─────────────────────────────────────────────────────────
// INCIDENT REPORTS for Puzzle 4 (Triage)
// ─────────────────────────────────────────────────────────

// Each report has 4 fields; 2 are blank (field.value = null)
// Facts are in a shared pool; player drags them to correct slots

const INCIDENT_FACTS = [
  { id: 'f1', text: 'Витік містить лише публічну інформацію' },
  { id: 'f2', text: 'Файл відредаговано після оригінального експорту' },
  { id: 'f3', text: 'USER_A завантажив дамп о 14:06' },
  { id: 'f4', text: 'USER_B надіслав шантажне повідомлення через 22 хв після дампу' },
  { id: 'f5', text: 'Жодної конфіденційної інформації не передано третім сторонам' },
  { id: 'f6', text: 'Скріншот обрізано — видалено контекст, що підтверджує законність дій' },
  { id: 'f7', text: 'Клієнт X підтверджує: вся передана інформація є публічною' },
  { id: 'f8', text: 'Загроза юридично недійсна — підстав для позову немає' },
  { id: 'f9', text: 'Схема оплати — відомий шаблон шахрайства із золотом' },
  { id: 'f10', text: 'Два юзери виключені з команди до відправки шантажу' },
];

const INCIDENT_REPORTS = [
  {
    id: 'report-taras',
    character: 'taras',
    reportId: 'INC-001',
    fields: [
      { label: 'Критичність', value: 'Середня', blank: false },
      { label: 'Постраждалий компонент', value: 'Репутація команди', blank: false },
      { label: 'Докази', value: null, blank: true, correctFactId: 'f2', hint: 'Що не так з файлом?' },
      { label: 'Висновок', value: null, blank: true, correctFactId: 'f8', hint: 'Який юридичний статус загрози?' },
    ],
    style: 'taras', // methodical, color-coded
    quip: '"Перевірено двічі. Закрито."',
  },
  {
    id: 'report-zheka',
    character: 'zheka',
    reportId: 'INC-002',
    fields: [
      { label: 'Критичність', value: 'Висока', blank: false },
      { label: 'Постраждалий компонент', value: 'Довіра клієнта (примітка: клієнт не постраждав)', blank: false },
      { label: 'Докази', value: null, blank: true, correctFactId: 'f3', hint: 'Хто і коли завантажив дані?' },
      { label: 'Висновок', value: null, blank: true, correctFactId: 'f5', hint: 'Чи передавалась таємна інформація?' },
    ],
    style: 'zheka',
    quip: '"Детально. З виносками. Прикріплено 3 посилання."',
  },
  {
    id: 'report-efim',
    character: 'efim',
    reportId: 'INC-003',
    fields: [
      { label: 'Критичність', value: 'Низька', blank: false },
      { label: 'Постраждалий компонент', value: 'Адмін-доступ', blank: false },
      { label: 'Докази', value: null, blank: true, correctFactId: 'f10', hint: 'Статус акаунтів підозрюваних?' },
      { label: 'Висновок', value: null, blank: true, correctFactId: 'f1', hint: 'Що саме витекло?' },
    ],
    style: 'efim',
    quip: '"Все. Кінець."',
  },
  {
    id: 'report-ivan',
    character: 'ivan',
    reportId: 'INC-004',
    fields: [
      { label: 'Критичність', value: 'КРИТИЧНО 🔴 КРИТИЧНО 🔴', blank: false },
      { label: 'Постраждалий компонент', value: 'ВСЕ ВСЕ ВСЕ КРИТИЧНО', blank: false },
      { label: 'Докази', value: null, blank: true, correctFactId: 'f4', hint: 'Хто відправив повідомлення і коли?' },
      { label: 'Висновок', value: null, blank: true, correctFactId: 'f9', hint: 'Що за схема оплати?' },
    ],
    style: 'ivan',
    quip: '"КРИТИЧНО ВАЖЛИВО ВИПРАВИТИ ЗАРАЗ НЕГАЙНО!!!"',
  },
  {
    id: 'report-anya',
    character: 'anya',
    reportId: 'INC-005',
    fields: [
      { label: 'Критичність', value: 'Середня', blank: false },
      { label: 'Постраждалий компонент', value: 'Імідж та документація', blank: false },
      { label: 'Докази', value: null, blank: true, correctFactId: 'f6', hint: 'Що приховує обрізаний скріншот?' },
      { label: 'Висновок', value: null, blank: true, correctFactId: 'f7', hint: 'Що підтвердив клієнт?' },
    ],
    style: 'anya',
    quip: '"Всі пропустили пункт 3. Я знайшла."',
  },
];

// ─────────────────────────────────────────────────────────
// PUZZLE HINTS
// ─────────────────────────────────────────────────────────

const PUZZLE_HINTS = {
  exif: 'Шукай три речі: часовий пояс, назву пристрою і дату останньої зміни файлу. Щось не збігається.',
  logs: 'Постав фільтр «time:gap» аби знайти пропуски часу. Потім «user:USER_A» і «user:USER_B» — хто теж онлайн у критичні моменти?',
  cipher: 'Вони завжди грали в Козаків. Ключ — англійська назва гри. Спробуй COSSACKS як ключ або зрушення 3.',
  triage: 'Клікай на порожнє поле у звіті — з\'явиться список фактів. Вибирай логічно: «Єфім» — коротко і точно, «Іван» — кричить, «Аня» — бачить те, що всі пропустили.',
};

// ─────────────────────────────────────────────────────────
// ENDING MEMBER LINES
// ─────────────────────────────────────────────────────────

const ENDING_MEMBER_LINES = {
  aramais: 'Вже п\'ять. Скоро десять. Дякую, що ви є.',
  taras:   'Добра команда. Я бачив гірше. Набагато гірше.',
  zheka:   'Зроблено детально. З гордістю.',
  efim:    'Продовжуємо.',
  ivan:    'НАЙКРАЩА КОМАНДА В СВІТІ!! 🔴КРИТИЧНО НАЙКРАЩА!!',
  anya:    'Ми знаходимо баги — в коді і в людях.',
  vitya:   'Слава Україні! І команді! 🇺🇦',
  inessa:  'Ви дивні. Але я рада, що з вами. 💛',
};

// ─────────────────────────────────────────────────────────
// CREDITS CONTENT
// ─────────────────────────────────────────────────────────

const CREDITS_DATA = {
  title: 'GIT BLAME',
  subtitle: '5-річчя команди «TARS» · 2026',
  sections: [
    {
      title: 'КОМАНДА',
      items: [
        { name: 'Арамаіс', role: 'Власник, нарратор, Лондон' },
        { name: 'Тарас',   role: 'Сеньор QA, хранитель логів' },
        { name: 'Жека',    role: 'QA, майстер виносок' },
        { name: 'Єфім',    role: 'QA, короткий і точний' },
        { name: 'Іван',    role: 'QA, Data Scraper, автоматизація' },
        { name: 'Аня',     role: 'QA, бачить невидиме' },
        { name: 'Вітя',    role: 'Радіофізик, патріот, криптоаналітик' },
        { name: 'Інеса',   role: 'Золото, схеми, козаки' },
      ],
    },
    {
      title: 'КОЛИШНІ УЧАСНИКИ',
      items: [
        { name: 'Міша & Саша', role: 'Дали нам сюжет для гри. Дякуємо.' },
      ],
    },
    {
      title: 'AI АСИСТЕНТИ',
      items: [
        { name: 'Claude (Anthropic)',    role: 'Код, текст, ігровий дизайн' },
        { name: 'Gemini (Google)',        role: 'Портрети, фонові сцени, відео' },
        { name: 'Suno AI',               role: 'Музичний супровід' },
      ],
    },
    {
      title: 'ТЕХНОЛОГІЇ',
      items: [
        { name: 'HTML / CSS / JavaScript', role: 'Без фреймворків. Просто так.' },
        { name: 'Web Audio API',           role: 'Музика і звуки' },
        { name: 'Telegram Mini App SDK',   role: 'Запуск прямо в чаті' },
      ],
    },
  ],
  aiNote:
    'Ця гра створена за допомогою AI-інструментів: код написано Claude, ' +
    'зображення та відео згенеровано Gemini, музика — Suno. ' +
    'Жоден QA-фахівець не постраждав у процесі розробки. ' +
    'Хоча Іван написав скрипт, що перевірив кожен рядок автоматично.',
};

// ─────────────────────────────────────────────────────────
// COSSACKS MINI-GAME STRINGS
// ─────────────────────────────────────────────────────────

const COSSACKS_STRINGS = {
  title:    'КОЗАКИ: ЗАХИСТ ЧАТУ',
  subtitle: 'Знищ всіх спам-ботів до кінця таймера!',
  win:      '🏆 Перемога! Чат захищено!\nЗнищено: {score} ворогів',
  lose:     '💀 Чат впав під тиском спаму...\nЗнищено: {score} перед падінням',
  click:    'ТИЦ! 🗡',
};

// ─────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────

window.ACTS               = ACTS;
window.ACT1_INTRO         = ACT1_INTRO;
window.ACT1_PUZZLE_INTRO  = ACT1_PUZZLE_INTRO;
window.ACT1_OUTRO         = ACT1_OUTRO;
window.ACT2_INTRO         = ACT2_INTRO;
window.ACT2_PUZZLE_INTRO  = ACT2_PUZZLE_INTRO;
window.ACT2_OUTRO         = ACT2_OUTRO;
window.ACT3_INTRO         = ACT3_INTRO;
window.ACT3_PUZZLE_INTRO  = ACT3_PUZZLE_INTRO;
window.ACT3_OUTRO         = ACT3_OUTRO;
window.ACT4_INTRO         = ACT4_INTRO;
window.ACT4_PUZZLE_INTRO  = ACT4_PUZZLE_INTRO;
window.ACT4_OUTRO         = ACT4_OUTRO;
window.ACT5_ENDING        = ACT5_ENDING;
window.FAKE_LOGS          = FAKE_LOGS;
window.VILLAIN_FORUM_POSTS = VILLAIN_FORUM_POSTS;
window.CIPHER_PLAINTEXT   = CIPHER_PLAINTEXT;
window.CIPHER_ENCODED     = CIPHER_ENCODED;
window.CIPHER_KEY         = CIPHER_KEY;
window.CIPHER_SHIFT       = CIPHER_SHIFT;
window.caesarDecode       = caesarDecode;
window.caesarEncode       = caesarEncode;
window.INCIDENT_FACTS     = INCIDENT_FACTS;
window.INCIDENT_REPORTS   = INCIDENT_REPORTS;
window.PUZZLE_HINTS       = PUZZLE_HINTS;
window.ENDING_MEMBER_LINES = ENDING_MEMBER_LINES;
window.CREDITS_DATA       = CREDITS_DATA;
window.COSSACKS_STRINGS   = COSSACKS_STRINGS;
