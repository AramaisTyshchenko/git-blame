/**
 * portrait-animator.js — Enhanced animated eyes (blinking) and mouth (speaking) overlays
 *
 * Overlays are CSS-positioned <div> elements placed on top of the portrait <img>.
 * Each character has per-face landmark coordinates stored in CHARACTERS[id].faceLandmarks.
 *
 * Enhancements over v1:
 *   - Crescent-shaped eyelids with occasional double-blinks
 *   - Multi-frame mouth (narrow / open / wide) cycling for natural speech
 *   - Subtle breathing pulse on the portrait image
 *   - Portrait entrance animation on character change
 *
 * Usage:
 *   PortraitAnimator.attach(containerEl, 'aramais')  — inject overlays + start breathing
 *   PortraitAnimator.startBlinking()                  — begin idle blink loop
 *   PortraitAnimator.startSpeaking()                  — begin mouth movement
 *   PortraitAnimator.stopSpeaking()                   — stop mouth movement
 *   PortraitAnimator.detach()                         — remove everything
 *   PortraitAnimator.playEntrance()                   — trigger entrance anim on wrap
 *
 * Debug mode: add ?debug=faces to URL to show red rectangles at landmark positions.
 */

'use strict';

const PortraitAnimator = (() => {
  // ── State ────────────────────────────────────────────────
  let _container = null;     // The portrait-wrap element
  let _charId = null;
  let _blinkTimer = null;
  let _mouthInterval = null;
  let _overlays = [];        // All created overlay DOM elements
  let _leftLid = null;
  let _rightLid = null;
  let _mouth = null;
  let _portraitImg = null;   // The <img> element (for breathing class)

  const DEBUG = new URLSearchParams(window.location.search).has('debug');

  // ── Mouth viseme states (cycled during speech) ───────────
  const MOUTH_STATES = ['mouth-narrow', 'mouth-open', 'mouth-wide', 'mouth-open', 'mouth-narrow'];
  let _mouthIdx = 0;

  // ── Helpers ──────────────────────────────────────────────

  const REFERENCE_SIZE = 180; // landmarks authored at 180×180

  function getLandmarks(characterId) {
    const c = window.CHARACTERS[characterId];
    if (c && c.faceLandmarks) return c.faceLandmarks;
    return window.DEFAULT_FACE_LANDMARKS;
  }

  /**
   * Scale a rect from reference 180px to the actual container size.
   */
  function scaleRect(rect, containerSize) {
    const s = containerSize / REFERENCE_SIZE;
    return {
      x: Math.round(rect.x * s),
      y: Math.round(rect.y * s),
      w: Math.round(rect.w * s),
      h: Math.round(rect.h * s),
    };
  }

  function makeOverlay(rect, className, bgColor) {
    const el = document.createElement('div');
    el.className = className;
    el.style.position = 'absolute';
    el.style.left   = rect.x + 'px';
    el.style.top    = rect.y + 'px';
    el.style.width  = rect.w + 'px';
    el.style.height = rect.h + 'px';
    if (bgColor) el.style.backgroundColor = bgColor;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '2';
    return el;
  }

  function makeDebugRect(rect, label) {
    const el = document.createElement('div');
    el.className = 'face-debug-rect';
    el.style.position = 'absolute';
    el.style.left   = rect.x + 'px';
    el.style.top    = rect.y + 'px';
    el.style.width  = rect.w + 'px';
    el.style.height = rect.h + 'px';
    el.style.border = '2px solid red';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '5';
    if (label) {
      el.style.fontSize = '8px';
      el.style.color = 'red';
      el.style.fontFamily = 'monospace';
      el.textContent = label;
    }
    return el;
  }

  // ── Blink logic (idle: 2–6s, occasional double-blink) ───

  function randomBlinkDelay() {
    return 2000 + Math.random() * 4000;
  }

  function doBlink(callback) {
    if (!_leftLid || !_rightLid) return;
    // Close eyes
    _leftLid.classList.add('blink');
    _rightLid.classList.add('blink');

    // Open after 120–180ms
    const closeDuration = 120 + Math.random() * 60;
    setTimeout(() => {
      if (_leftLid) _leftLid.classList.remove('blink');
      if (_rightLid) _rightLid.classList.remove('blink');
      if (callback) setTimeout(callback, 30);
    }, closeDuration);
  }

  /**
   * Occasionally (20% chance) do a rapid double-blink for realism.
   */
  function doBlinkOrDouble() {
    if (Math.random() < 0.2) {
      // Double-blink: blink → 80ms pause → blink again
      doBlink(() => {
        setTimeout(() => doBlink(), 80);
      });
    } else {
      doBlink();
    }
  }

  function scheduleBlink() {
    _blinkTimer = setTimeout(() => {
      doBlinkOrDouble();
      scheduleBlink();
    }, randomBlinkDelay());
  }

  // ── Mouth animation (multi-frame cycling) ────────────────

  function clearMouthClasses() {
    if (!_mouth) return;
    _mouth.classList.remove('mouth-narrow', 'mouth-open', 'mouth-wide');
  }

  function nextMouthFrame() {
    if (!_mouth) return;
    clearMouthClasses();
    _mouthIdx = (_mouthIdx + 1) % MOUTH_STATES.length;
    _mouth.classList.add(MOUTH_STATES[_mouthIdx]);
  }

  // ── Breathing ────────────────────────────────────────────

  function startBreathing() {
    if (_portraitImg) _portraitImg.classList.add('breathing');
  }

  function stopBreathing() {
    if (_portraitImg) _portraitImg.classList.remove('breathing');
  }

  // ── Entrance animation ──────────────────────────────────

  function playEntrance() {
    if (!_container) return;
    _container.classList.remove('portrait-entering');
    // Force reflow so re-adding the class restarts the animation
    void _container.offsetWidth;
    _container.classList.add('portrait-entering');

    // Clean up class after animation ends so it doesn't interfere
    const onEnd = () => {
      _container.classList.remove('portrait-entering');
      _container.removeEventListener('animationend', onEnd);
    };
    _container.addEventListener('animationend', onEnd);
  }

  // ── Public API ───────────────────────────────────────────

  /**
   * Attach animated overlays to a portrait container.
   * @param {HTMLElement} containerEl — The #dialogue-portrait-wrap element
   * @param {string} characterId — Key from CHARACTERS
   */
  function attach(containerEl, characterId) {
    detach(); // clean previous

    if (!containerEl) return;
    _container = containerEl;
    _charId = characterId;

    const lm = getLandmarks(characterId);

    // Find the portrait <img> inside the container
    _portraitImg = containerEl.querySelector('#dialogue-portrait') || containerEl.querySelector('img');

    // Check actual container size for mobile scaling
    const actualSize = containerEl.offsetWidth || REFERENCE_SIZE;
    const needsScale = Math.abs(actualSize - REFERENCE_SIZE) > 2;

    function sc(rect) {
      return needsScale ? scaleRect(rect, actualSize) : rect;
    }

    // ── Eyelids (skin-colored crescents, hidden by default via scaleY(0)) ──

    _leftLid = makeOverlay(sc(lm.leftEye), 'portrait-eyelid', lm.skinColor);
    _rightLid = makeOverlay(sc(lm.rightEye), 'portrait-eyelid', lm.skinColor);

    // ── Mouth (dark semi-ellipse, hidden by default) ──

    _mouth = makeOverlay(sc(lm.mouth), 'portrait-mouth', 'rgba(30, 10, 10, 0.75)');

    _overlays = [_leftLid, _rightLid, _mouth];

    // ── Debug rectangles ──

    if (DEBUG) {
      const dL = makeDebugRect(sc(lm.leftEye), 'L');
      const dR = makeDebugRect(sc(lm.rightEye), 'R');
      const dM = makeDebugRect(sc(lm.mouth), 'M');
      _overlays.push(dL, dR, dM);
      _container.appendChild(dL);
      _container.appendChild(dR);
      _container.appendChild(dM);
    }

    _container.appendChild(_leftLid);
    _container.appendChild(_rightLid);
    _container.appendChild(_mouth);

    // Start breathing as soon as overlays are attached
    startBreathing();
  }

  /**
   * Begin idle blinking loop.
   */
  function startBlinking() {
    stopBlinking();
    // Initial blink after a short delay
    _blinkTimer = setTimeout(() => {
      doBlinkOrDouble();
      scheduleBlink();
    }, 800 + Math.random() * 1500);
  }

  /**
   * Stop blinking.
   */
  function stopBlinking() {
    clearTimeout(_blinkTimer);
    _blinkTimer = null;
    if (_leftLid) _leftLid.classList.remove('blink', 'half-blink');
    if (_rightLid) _rightLid.classList.remove('blink', 'half-blink');
  }

  /**
   * Begin multi-frame mouth animation (call when TTS starts).
   * Cycles through narrow → open → wide → open → narrow at varied tempo.
   */
  function startSpeaking() {
    stopSpeaking();
    if (!_mouth) return;
    _mouthIdx = 0;
    _mouth.classList.add(MOUTH_STATES[0]);

    _mouthInterval = setInterval(() => {
      nextMouthFrame();
    }, 80 + Math.random() * 70); // 80–150 ms per frame
  }

  /**
   * Stop mouth animation (call when TTS ends or user skips).
   */
  function stopSpeaking() {
    clearInterval(_mouthInterval);
    _mouthInterval = null;
    if (_mouth) clearMouthClasses();
  }

  /**
   * Remove all overlays and stop all timers.
   */
  function detach() {
    stopBlinking();
    stopSpeaking();
    stopBreathing();
    _overlays.forEach(el => { if (el && el.parentNode) el.parentNode.removeChild(el); });
    _overlays = [];
    _leftLid = null;
    _rightLid = null;
    _mouth = null;
    _portraitImg = null;
    _container = null;
    _charId = null;
  }

  return {
    attach, detach,
    startBlinking, stopBlinking,
    startSpeaking, stopSpeaking,
    playEntrance
  };
})();

window.PortraitAnimator = PortraitAnimator;
