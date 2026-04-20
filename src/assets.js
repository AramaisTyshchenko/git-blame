/**
 * assets.js — Asset manifest + preloader
 *
 * All portrait/background/audio paths point to files in /assets/.
 * Until AI-generated files are placed there, the game uses
 * generated SVG placeholders (no server needed, works offline).
 */

'use strict';

// ─────────────────────────────────────────────────────────
// CHARACTER MANIFEST
// ─────────────────────────────────────────────────────────

// Default face landmark positions (relative to 180×180 portrait)
// Tuned for typical AI-generated headshot portraits
const DEFAULT_FACE_LANDMARKS = {
  leftEye:  { x: 56, y: 72, w: 22, h: 10 },
  rightEye: { x: 102, y: 72, w: 22, h: 10 },
  mouth:    { x: 72, y: 118, w: 36, h: 14 },
  skinColor: '#c8a882',
};

const CHARACTERS = {
  aramais: {
    id: 'aramais',
    name: 'Арамаіс',
    nameEn: 'Aramais',
    role: 'Власник групи · Лондон',
    color: '#f0a500',
    portrait: 'assets/portraits/aramais.jpg',
    portraits: {
      default:    'assets/portraits/aramais.jpg',
      worried:    'assets/portraits/aramais.jpg',
      determined: 'assets/portraits/aramais.jpg',
    },
    bio: 'PhD, дрони, Варвік. Живе в Лондоні, але серцем в Україні.',
    faceLandmarks: { leftEye: { x: 73, y: 60, w: 15, h: 6 }, rightEye: { x: 98, y: 59, w: 15, h: 6 }, mouth: { x: 83, y: 84, w: 23, h: 9 }, skinColor: '#c8a882' },
    voice: { gender: 'male', pitch: 1.0, rate: 1.0 },   // 30+ male, balanced
  },
  taras: {
    id: 'taras',
    name: 'Тарас',
    nameEn: 'Taras',
    role: 'QA Сеньор · 40+ · Бойовий дід',
    color: '#e74c3c',
    portrait: 'assets/portraits/taras.jpg',
    portraits: {
      default:     'assets/portraits/taras.jpg',
      reading:     'assets/portraits/taras.jpg',
      unimpressed: 'assets/portraits/taras.jpg',
    },
    bio: 'Два десятки в QA. Бачив все. Нічому не дивується.',
    faceLandmarks: { leftEye: { x: 63, y: 67, w: 22, h: 10 }, rightEye: { x: 95, y: 68, w: 22, h: 10 }, mouth: { x: 71, y: 99, w: 36, h: 14 }, skinColor: '#c8a882' },
    voice: { gender: 'male', pitch: 0.75, rate: 0.82 },  // 40+ male, deep & deliberate
  },
  zheka: {
    id: 'zheka',
    name: 'Жека',
    nameEn: 'Zheka',
    role: 'QA Інженер · 30+',
    color: '#3498db',
    portrait: 'assets/portraits/zheka.jpg',
    portraits: {
      default: 'assets/portraits/zheka.jpg',
      focused: 'assets/portraits/zheka.jpg',
    },
    bio: 'Детальні звіти з виносками. Любить sticky-нотатки.',
    faceLandmarks: { leftEye: { x: 76, y: 64, w: 22, h: 10 }, rightEye: { x: 113, y: 63, w: 22, h: 10 }, mouth: { x: 86, y: 94, w: 36, h: 14 }, skinColor: '#433e38' },
    voice: { gender: 'male', pitch: 0.95, rate: 0.92 },  // 30+ male, calm & methodical
  },
  efim: {
    id: 'efim',
    name: 'Єфім',
    nameEn: 'Efim',
    role: 'QA Інженер · 30+',
    color: '#1abc9c',
    portrait: 'assets/portraits/efim.jpg',
    portraits: {
      default: 'assets/portraits/efim.jpg',
      precise: 'assets/portraits/efim.jpg',
    },
    bio: 'Пише лише те, що потрібно. Кожне слово заслужене.',
    faceLandmarks: { leftEye: { x: 65, y: 62, w: 22, h: 10 }, rightEye: { x: 108, y: 69, w: 22, h: 10 }, mouth: { x: 74, y: 110, w: 36, h: 14 }, skinColor: '#c8a882' },
    voice: { gender: 'male', pitch: 0.9, rate: 0.88 },   // 30+ male, precise & measured
  },
  ivan: {
    id: 'ivan',
    name: 'Іван',
    nameEn: 'Ivan',
    role: 'QA Інженер · Data Scraper · 30+',
    color: '#9b59b6',
    portrait: 'assets/portraits/ivan.jpg',
    portraits: {
      default:      'assets/portraits/ivan.jpg',
      enthusiastic: 'assets/portraits/ivan.jpg',
    },
    bio: 'Автоматизує все, що рухається. Парсить дані поки інші сплять.',
    faceLandmarks: { leftEye: { x: 62, y: 64, w: 22, h: 10 }, rightEye: { x: 92, y: 63, w: 22, h: 10 }, mouth: { x: 70, y: 94, w: 36, h: 14 }, skinColor: '#c8a882' },
    voice: { gender: 'male', pitch: 1.15, rate: 1.12 },  // 20+ male, young & energetic
  },
  anya: {
    id: 'anya',
    name: 'Аня',
    nameEn: 'Anya',
    role: 'QA Інженер · 30+',
    color: '#e91e8c',
    portrait: 'assets/portraits/anya.jpg',
    portraits: {
      default: 'assets/portraits/anya.jpg',
      sharp:   'assets/portraits/anya.jpg',
    },
    bio: 'Помічає те, що всі пропустили. Завжди.',
    faceLandmarks: { leftEye: { x: 58, y: 71, w: 22, h: 10 }, rightEye: { x: 93, y: 73, w: 22, h: 10 }, mouth: { x: 69, y: 107, w: 32, h: 12 }, skinColor: '#c8a882' },
    voice: { gender: 'female', pitch: 1.1, rate: 0.95 }, // 30+ female, sharp & composed
  },
  vitya: {
    id: 'vitya',
    name: 'Вітя',
    nameEn: 'Vitya',
    role: 'Радіофізик · 30+ · Патріот',
    color: '#27ae60',
    portrait: 'assets/portraits/vitya.jpg',
    portraits: {
      default:   'assets/portraits/vitya.jpg',
      patriotic: 'assets/portraits/vitya.jpg',
    },
    bio: 'Радіофізик. Ненавидить Путіна. Любить Україну. Завжди правий.',
    faceLandmarks: { leftEye: { x: 64, y: 55, w: 22, h: 10 }, rightEye: { x: 94, y: 57, w: 18, h: 9 }, mouth: { x: 75, y: 83, w: 28, h: 11 }, skinColor: '#c8a882' },
    voice: { gender: 'male', pitch: 0.85, rate: 1.1 },   // 30+ male, passionate & rapid
  },
  inessa: {
    id: 'inessa',
    name: 'Інеса',
    nameEn: 'Inessa',
    role: 'Продаж золота · 20+',
    color: '#f39c12',
    portrait: 'assets/portraits/inessa.jpg',
    portraits: {
      default: 'assets/portraits/inessa.jpg',
      knowing: 'assets/portraits/inessa.jpg',
    },
    bio: 'Продає золото. Грає в козаків. Знає всі схеми.',
    faceLandmarks: { leftEye: { x: 61, y: 63, w: 22, h: 10 }, rightEye: { x: 96, y: 63, w: 22, h: 10 }, mouth: { x: 76, y: 97, w: 28, h: 11 }, skinColor: '#c8a882' },
    voice: { gender: 'female', pitch: 1.2, rate: 1.05 }, // 20+ female, young & bright
  },
  misha: {
    id: 'misha',
    name: 'Міша',
    nameEn: 'Misha',
    role: 'Колишній учасник команди',
    color: '#e74c3c',
    portrait: 'assets/portraits/misha.jpg',
    portraits: {
      default: 'assets/portraits/misha.jpg',
    },
    bio: 'Дав нам сюжет для гри.',
    isFixedVillain: true,
    faceLandmarks: { leftEye: { x: 47, y: 58, w: 22, h: 10 }, rightEye: { x: 103, y: 63, w: 22, h: 10 }, mouth: { x: 57, y: 98, w: 36, h: 14 }, skinColor: '#c8a882' },
    voice: { gender: 'male', pitch: 0.7, rate: 0.88 },   // villain, low & menacing
  },
  sasha: {
    id: 'sasha',
    name: 'Саша',
    nameEn: 'Sasha',
    role: 'Колишній учасник команди',
    color: '#8e44ad',
    portrait: 'assets/portraits/sasha.jpg',
    portraits: {
      default: 'assets/portraits/sasha.jpg',
    },
    bio: 'Дав нам сюжет для гри.',
    isFixedVillain: true,
    faceLandmarks: { leftEye: { x: 50, y: 60, w: 22, h: 10 }, rightEye: { x: 103, y: 63, w: 22, h: 10 }, mouth: { x: 62, y: 101, w: 36, h: 14 }, skinColor: '#c8a882' },
    voice: { gender: 'male', pitch: 0.65, rate: 0.85 },  // villain, deeper & sinister
  },
};

// ─────────────────────────────────────────────────────────
// SCENE BACKGROUNDS
// ─────────────────────────────────────────────────────────

const BACKGROUNDS = {
  warroom:       'assets/backgrounds/warroom.jpg',
  warroom_party: 'assets/backgrounds/warroom_party.jpg',
  terminal:      'assets/backgrounds/terminal.jpg',
  villain_forum: 'assets/backgrounds/villain_forum.jpg',
  bug_tracker:   'assets/backgrounds/bug_tracker.jpg',
  dark_void:     'assets/backgrounds/dark_void.jpg',
};

// ─────────────────────────────────────────────────────────
// AUDIO TRACKS
// ─────────────────────────────────────────────────────────

const AUDIO = {
  main_theme:    'assets/audio/main_theme.mp3',
  investigation: 'assets/audio/investigation.mp3',
  villain_theme: 'assets/audio/villain_theme.mp3',
  finale:        'assets/audio/finale.mp3',
  cossacks_bgm:  'assets/audio/cossacks_bgm.mp3',
  puzzle_solved: 'assets/audio/puzzle_solved.mp3',
  // sfx
  sfx_click:     'assets/sfx/click.mp3',
  sfx_found:     'assets/sfx/found.mp3',
  sfx_error:     'assets/sfx/error.wav',
  sfx_stamp:     'assets/sfx/stamp.wav',
  sfx_chat:      'assets/sfx/chat_notification.mp3',
};

// ─────────────────────────────────────────────────────────
// SVG PLACEHOLDER GENERATOR
// (used when real AI-generated portraits are not yet available)
// ─────────────────────────────────────────────────────────

function makePlaceholderPortrait(character) {
  const c = CHARACTERS[character];
  if (!c) return '';
  const initials = c.name.slice(0,2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#141c28"/>
    <rect x="0" y="0" width="200" height="200" fill="${c.color}" opacity="0.15"/>
    <circle cx="100" cy="80" r="40" fill="${c.color}" opacity="0.3"/>
    <rect x="40" y="130" width="120" height="70" rx="60" fill="${c.color}" opacity="0.2"/>
    <text x="100" y="92" text-anchor="middle" dominant-baseline="middle"
          font-family="monospace" font-size="28" font-weight="bold" fill="${c.color}">
      ${initials}
    </text>
    <text x="100" y="175" text-anchor="middle"
          font-family="monospace" font-size="11" fill="#8a8478">
      ${c.nameEn}
    </text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function makePlaceholderBg(sceneId) {
  const labels = {
    warroom:       'ШТАБ КОМАНДИ',
    warroom_party: 'ШТАБ · 5 РОКІВ',
    terminal:      'LOG VIEWER',
    villain_forum: 'FORUM · DARK WEB',
    bug_tracker:   'BUG TRACKER',
    dark_void:     'НЕВІДОМО',
  };
  const label = labels[sceneId] || sceneId.toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect width="1280" height="720" fill="#0a0e14"/>
    <line x1="0" y1="0" x2="1280" y2="720" stroke="#1e2d42" stroke-width="1"/>
    <line x1="1280" y1="0" x2="0" y2="720" stroke="#1e2d42" stroke-width="1"/>
    <text x="640" y="360" text-anchor="middle" dominant-baseline="middle"
          font-family="monospace" font-size="32" fill="#1e2d42" letter-spacing="8">
      ${label}
    </text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// ─────────────────────────────────────────────────────────
// IMAGE LOADER — tries real path, falls back to placeholder
// ─────────────────────────────────────────────────────────

const _imageCache = {};

function loadImage(src, fallbackFn) {
  if (_imageCache[src]) return _imageCache[src];
  const img = new Image();
  img.src = src;
  img.onerror = () => {
    if (fallbackFn) img.src = fallbackFn();
  };
  _imageCache[src] = img;
  return img;
}

function getPortrait(characterId, state = 'default') {
  const c = CHARACTERS[characterId];
  if (!c) return makePlaceholderPortrait('aramais');
  const portraitPath = c.portraits[state] || c.portrait;
  const img = loadImage(portraitPath, () => makePlaceholderPortrait(characterId));
  return img.src.startsWith('data:') ? img.src : portraitPath;
}

function getPortraitSrc(characterId, state = 'default') {
  const c = CHARACTERS[characterId];
  if (!c) return makePlaceholderPortrait('aramais');
  const path = c.portraits?.[state] || c.portrait;
  // Try to detect if file exists by creating an Image; for sync use, return placeholder
  // The <img> tags use onerror to switch to placeholder
  return path;
}

function getBgSrc(sceneId) {
  return BACKGROUNDS[sceneId] || makePlaceholderBg(sceneId);
}

// ─────────────────────────────────────────────────────────
// AUDIO MANAGER
// ─────────────────────────────────────────────────────────

const AudioManager = (() => {
  let context = null;
  const buffers = {};
  const activeSources = {};
  let masterGain;

  function getContext() {
    if (!context) {
      context = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = context.createGain();
      masterGain.gain.value = 0.6;
      masterGain.connect(context.destination);
    }
    return context;
  }

  async function load(key) {
    if (buffers[key]) return buffers[key];
    const url = AUDIO[key];
    if (!url) return null;
    try {
      const ctx = getContext();
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const arr = await resp.arrayBuffer();
      const buf = await ctx.decodeAudioData(arr);
      buffers[key] = buf;
      return buf;
    } catch {
      return null;
    }
  }

  async function play(key, { loop = false, fadeIn = 0 } = {}) {
    const ctx = getContext();
    if (ctx.state === 'suspended') await ctx.resume();
    const buf = await load(key);
    if (!buf) return;

    // If this looping track is already active, don't restart it
    if (loop && activeSources[key]) return;

    stop(key);

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = loop;

    const gainNode = ctx.createGain();
    gainNode.gain.value = fadeIn > 0 ? 0 : 1;
    source.connect(gainNode);
    gainNode.connect(masterGain);
    source.start();

    if (fadeIn > 0) {
      gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + fadeIn);
    }

    activeSources[key] = { source, gainNode };
  }

  function stop(key, fadeOut = 0) {
    const slot = activeSources[key];
    if (!slot) return;
    const { source, gainNode } = slot;
    if (fadeOut > 0 && context) {
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + fadeOut);
      setTimeout(() => { try { source.stop(); } catch {} }, fadeOut * 1000 + 100);
    } else {
      try { source.stop(); } catch {}
    }
    delete activeSources[key];
  }

  function stopAll(fadeOut = 0.5) {
    Object.keys(activeSources).forEach(k => stop(k, fadeOut));
  }

  // ── Mobile audio unlock ──────────────────────────────────
  // iOS / Android WebView (incl. Telegram) suspend AudioContext
  // until a direct user gesture. We must call resume() synchronously
  // inside that gesture — async play() is too late.
  function unlock() {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // Attach once to the earliest possible user gesture.
  // 'touchstart' fires before 'click' on mobile, so we catch both.
  (function attachUnlock() {
    const events = ['touchstart', 'touchend', 'click', 'keydown'];
    function handler() {
      unlock();
      events.forEach(e => document.removeEventListener(e, handler));
    }
    events.forEach(e =>
      document.addEventListener(e, handler, { once: false, passive: true })
    );
  })();

  return { play, stop, stopAll, load, unlock };
})();

// ─────────────────────────────────────────────────────────
// PRELOAD — attempt to preload all audio (non-blocking)
// ─────────────────────────────────────────────────────────

async function preloadAll() {
  const audioKeys = Object.keys(AUDIO);
  await Promise.allSettled(audioKeys.map(k => AudioManager.load(k)));
}

// ─────────────────────────────────────────────────────────
// IMAGE FALLBACK HANDLER — attach to img tags on load
// ─────────────────────────────────────────────────────────

function attachPortraitFallbacks() {
  document.querySelectorAll('img[data-char]').forEach(img => {
    const charId = img.dataset.char;
    img.onerror = () => {
      img.src = makePlaceholderPortrait(charId);
      img.onerror = null;
    };
  });
}

// ─────────────────────────────────────────────────────────
// EXPORTS (global, no module system needed)
// ─────────────────────────────────────────────────────────

window.DEFAULT_FACE_LANDMARKS  = DEFAULT_FACE_LANDMARKS;
window.CHARACTERS             = CHARACTERS;
window.BACKGROUNDS            = BACKGROUNDS;
window.AUDIO                  = AUDIO;
window.AudioManager           = AudioManager;
window.getPortraitSrc         = getPortraitSrc;
window.getBgSrc               = getBgSrc;
window.makePlaceholderPortrait = makePlaceholderPortrait;
window.makePlaceholderBg      = makePlaceholderBg;
window.attachPortraitFallbacks = attachPortraitFallbacks;
window.preloadAll             = preloadAll;
