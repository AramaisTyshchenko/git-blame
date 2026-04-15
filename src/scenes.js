/**
 * scenes.js — Scene background management and visual utilities
 *
 * Handles:
 * - Setting background image on any .scene-bg element
 * - Portrait fallback logic
 * - Text/typing animation
 * - Visual effects (glitch, stamp, etc.)
 */

'use strict';

// ─────────────────────────────────────────────────────────
// BACKGROUND SETTER
// ─────────────────────────────────────────────────────────

/**
 * Set the background of a scene element.
 * Tries the real asset path first, falls back to SVG placeholder.
 *
 * @param {HTMLElement} el - Element with class .scene-bg
 * @param {string} sceneId  - Key from BACKGROUNDS map
 */
function setSceneBg(el, sceneId) {
  if (!el) return;
  const realUrl = BACKGROUNDS[sceneId];
  if (!realUrl) {
    el.style.backgroundImage = `url('${makePlaceholderBg(sceneId)}')`;
    return;
  }
  // Try loading the real image; fall back on error
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url('${realUrl}')`;
  };
  img.onerror = () => {
    el.style.backgroundImage = `url('${makePlaceholderBg(sceneId)}')`;
  };
  img.src = realUrl;
}

// ─────────────────────────────────────────────────────────
// PORTRAIT HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Safely set <img> src with placeholder fallback.
 */
function setPortrait(imgEl, characterId, state = 'default') {
  if (!imgEl) return;
  const c = CHARACTERS[characterId];
  if (!c) {
    imgEl.src = makePlaceholderPortrait('aramais');
    return;
  }
  const path = c.portraits?.[state] || c.portrait;
  imgEl.src = path;
  imgEl.onerror = () => {
    imgEl.src = makePlaceholderPortrait(characterId);
    imgEl.onerror = null;
  };
  imgEl.dataset.char = characterId;
}

/**
 * Apply villain shadow filter to portrait img element.
 */
function applyVillainFilter(imgEl, isVillainChar) {
  if (!imgEl) return;
  if (isVillainChar) {
    imgEl.classList.add('villain-shadow');
  } else {
    imgEl.classList.remove('villain-shadow');
  }
}

// ─────────────────────────────────────────────────────────
// TEXT EFFECTS
// ─────────────────────────────────────────────────────────

/**
 * Typewriter effect for a text element.
 *
 * @param {HTMLElement} el
 * @param {string} text
 * @param {number} speed - ms per character
 * @param {Function} [cb] - called when done
 */
function typewrite(el, text, speed = 28, cb) {
  if (!el) { if (cb) cb(); return; }
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i >= text.length) {
      if (cb) cb();
      return;
    }
    el.textContent += text[i++];
    setTimeout(tick, speed);
  };
  tick();
}

/**
 * Glitch flash effect on an element.
 */
function glitchEffect(el, duration = 400) {
  if (!el) return;
  const orig = el.style.cssText;
  let t = 0;
  const interval = setInterval(() => {
    el.style.transform = `translateX(${(Math.random() - 0.5) * 6}px)`;
    el.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(2)`;
    t += 60;
    if (t >= duration) {
      clearInterval(interval);
      el.style.cssText = orig;
    }
  }, 60);
}

// ─────────────────────────────────────────────────────────
// STAMP ANIMATION
// Used for "BUG CLOSED" / "RESOLVED" stamps in the ending.
// ─────────────────────────────────────────────────────────

function showStamp(text, color = '#27ae60', container = document.body) {
  const stamp = document.createElement('div');
  stamp.textContent = text;
  stamp.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-12deg) scale(0.3);
    font-size: clamp(28px, 5vw, 52px);
    font-weight: bold;
    font-family: monospace;
    letter-spacing: 4px;
    color: ${color};
    border: 5px solid ${color};
    padding: 16px 28px;
    background: rgba(0,0,0,0.85);
    z-index: 500;
    pointer-events: none;
    transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease;
    opacity: 0;
    text-transform: uppercase;
  `;
  container.appendChild(stamp);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      stamp.style.transform = 'translate(-50%, -50%) rotate(-12deg) scale(1)';
      stamp.style.opacity = '1';
      AudioManager.play('sfx_stamp');
      setTimeout(() => {
        stamp.style.opacity = '0';
        setTimeout(() => stamp.remove(), 400);
      }, 1800);
    });
  });
}

// ─────────────────────────────────────────────────────────
// CHAT NOTIFICATION POPUP
// Mimics a Telegram message arriving.
// ─────────────────────────────────────────────────────────

function showChatPopup(senderName, messageText, duration = 4000) {
  const pop = document.createElement('div');
  pop.style.cssText = `
    position: fixed;
    top: 16px; right: 16px;
    background: #1e2d42;
    border: 1px solid #f0a500;
    padding: 12px 16px;
    max-width: 280px;
    font-family: monospace;
    font-size: 12px;
    z-index: 300;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    animation: notif-in 0.3s ease;
    cursor: pointer;
  `;
  pop.innerHTML = `
    <div style="color:#f0a500;font-size:11px;letter-spacing:1px;margin-bottom:4px;">
      📱 ${senderName}
    </div>
    <div style="color:#e8e4d8;line-height:1.5;">${messageText}</div>
  `;
  document.body.appendChild(pop);
  AudioManager.play('sfx_chat');
  pop.onclick = () => pop.remove();
  setTimeout(() => { if (pop.parentNode) pop.remove(); }, duration);
}

// ─────────────────────────────────────────────────────────
// PROGRESS BAR
// Used during loading or dramatic pauses.
// ─────────────────────────────────────────────────────────

function animateProgressBar(el, to = 100, duration = 1200, cb) {
  if (!el) { if (cb) cb(); return; }
  let current = parseFloat(el.style.width) || 0;
  const step = (to - current) / (duration / 16);
  const tick = () => {
    current = Math.min(current + step, to);
    el.style.width = current + '%';
    if (current < to) requestAnimationFrame(tick);
    else if (cb) cb();
  };
  requestAnimationFrame(tick);
}

// ─────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────

window.Scenes = {
  setSceneBg,
  setPortrait,
  applyVillainFilter,
  typewrite,
  glitchEffect,
  showStamp,
  showChatPopup,
  animateProgressBar,
};
