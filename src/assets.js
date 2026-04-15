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

const CHARACTERS = {
  aramais: {
    id: 'aramais',
    name: 'Арамаіс',
    nameEn: 'Aramais',
    role: 'Власник групи · Лондон',
    color: '#f0a500',
    portrait: 'assets/portraits/aramais.png',
    portraits: {
      default:    'assets/portraits/aramais.png',
      worried:    'assets/portraits/aramais.png',
      determined: 'assets/portraits/aramais.png',
    },
    bio: 'PhD, дрони, Варвік. Живе в Лондоні, але серцем в Україні.',
  },
  taras: {
    id: 'taras',
    name: 'Тарас',
    nameEn: 'Taras',
    role: 'QA Сеньор · 40+ · Бойовий дід',
    color: '#e74c3c',
    portrait: 'assets/portraits/taras.png',
    portraits: {
      default:     'assets/portraits/taras.png',
      reading:     'assets/portraits/taras.png',
      unimpressed: 'assets/portraits/taras.png',
    },
    bio: 'Два десятки в QA. Бачив все. Нічому не дивується.',
  },
  zheka: {
    id: 'zheka',
    name: 'Жека',
    nameEn: 'Zheka',
    role: 'QA Інженер · 30+',
    color: '#3498db',
    portrait: 'assets/portraits/zheka.png',
    portraits: {
      default: 'assets/portraits/zheka.png',
      focused: 'assets/portraits/zheka.png',
    },
    bio: 'Детальні звіти з виносками. Любить sticky-нотатки.',
  },
  efim: {
    id: 'efim',
    name: 'Єфім',
    nameEn: 'Efim',
    role: 'QA Інженер · 30+',
    color: '#1abc9c',
    portrait: 'assets/portraits/efim.png',
    portraits: {
      default: 'assets/portraits/efim.png',
      precise: 'assets/portraits/efim.png',
    },
    bio: 'Пише лише те, що потрібно. Кожне слово заслужене.',
  },
  ivan: {
    id: 'ivan',
    name: 'Іван',
    nameEn: 'Ivan',
    role: 'QA Інженер · Data Scraper · 30+',
    color: '#9b59b6',
    portrait: 'assets/portraits/ivan.png',
    portraits: {
      default:      'assets/portraits/ivan.png',
      enthusiastic: 'assets/portraits/ivan.png',
    },
    bio: 'Автоматизує все, що рухається. Парсить дані поки інші сплять.',
  },
  anya: {
    id: 'anya',
    name: 'Аня',
    nameEn: 'Anya',
    role: 'QA Інженер · 30+',
    color: '#e91e8c',
    portrait: 'assets/portraits/anya.png',
    portraits: {
      default: 'assets/portraits/anya.png',
      sharp:   'assets/portraits/anya.png',
    },
    bio: 'Помічає те, що всі пропустили. Завжди.',
  },
  vitya: {
    id: 'vitya',
    name: 'Вітя',
    nameEn: 'Vitya',
    role: 'Радіофізик · 30+ · Патріот',
    color: '#27ae60',
    portrait: 'assets/portraits/vitya.png',
    portraits: {
      default:   'assets/portraits/vitya.png',
      patriotic: 'assets/portraits/vitya.png',
    },
    bio: 'Радіофізик. Ненавидить Путіна. Любить Україну. Завжди правий.',
  },
  inessa: {
    id: 'inessa',
    name: 'Інеса',
    nameEn: 'Inessa',
    role: 'Продаж золота · 20+',
    color: '#f39c12',
    portrait: 'assets/portraits/inessa.png',
    portraits: {
      default: 'assets/portraits/inessa.png',
      knowing: 'assets/portraits/inessa.png',
    },
    bio: 'Продає золото. Грає в козаків. Знає всі схеми.',
  },
  misha: {
    id: 'misha',
    name: 'Міша',
    nameEn: 'Misha',
    role: 'Колишній учасник команди',
    color: '#e74c3c',
    portrait: 'assets/portraits/misha.png',
    portraits: {
      default: 'assets/portraits/misha.png',
    },
    bio: 'Дав нам сюжет для гри.',
    isFixedVillain: true,
  },
  sasha: {
    id: 'sasha',
    name: 'Саша',
    nameEn: 'Sasha',
    role: 'Колишній учасник команди',
    color: '#8e44ad',
    portrait: 'assets/portraits/sasha.png',
    portraits: {
      default: 'assets/portraits/sasha.png',
    },
    bio: 'Дав нам сюжет для гри.',
    isFixedVillain: true,
  },
};

// ─────────────────────────────────────────────────────────
// SCENE BACKGROUNDS
// ─────────────────────────────────────────────────────────

const BACKGROUNDS = {
  warroom:       'assets/backgrounds/warroom.png',
  warroom_party: 'assets/backgrounds/warroom_party.png',
  terminal:      'assets/backgrounds/terminal.png',
  villain_forum: 'assets/backgrounds/villain_forum.png',
  bug_tracker:   'assets/backgrounds/bug_tracker.png',
  dark_void:     'assets/backgrounds/dark_void.png',
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

  return { play, stop, stopAll, load };
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
