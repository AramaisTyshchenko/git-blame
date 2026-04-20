/**
 * video-portrait.js — D-ID talking-head video portrait with CSS fallback
 *
 * Manages a <video> element layered over or replacing the portrait <img>.
 * If D-ID videos exist (assets/video/portraits/{charId}_idle.mp4 / _talk.mp4),
 * they are used for a photorealistic talking-head effect.
 * If videos are not found, falls back to the CSS overlay system
 * (PortraitAnimator blinking + mouth).
 *
 * Usage:
 *   VideoPortrait.attach(wrapEl, imgEl, 'aramais')
 *   VideoPortrait.setTalking(true)   // switch to talk video
 *   VideoPortrait.setTalking(false)  // switch to idle video
 *   VideoPortrait.detach()           // clean up
 */

'use strict';

const VideoPortrait = (() => {
  const VIDEO_BASE = 'assets/video/portraits/';

  let _wrapEl = null;
  let _imgEl = null;
  let _videoEl = null;
  let _charId = null;
  let _hasIdle = false;
  let _hasTalk = false;
  let _talkUrl = null;
  let _isTalking = false;
  let _useFallback = false;

  // Cache which characters have videos (probed once per session)
  const _videoCache = {}; // { charId: { idle: bool, talk: bool } }

  /**
   * Probe whether a video file exists by attempting to fetch headers.
   * Returns a promise that resolves to true/false.
   */
  function probeVideo(url) {
    return new Promise((resolve) => {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => { resolve(true); vid.src = ''; };
      vid.onerror = () => resolve(false);
      vid.src = url;
      // Timeout: if no response in 2s, assume missing
      setTimeout(() => resolve(false), 2000);
    });
  }

  /**
   * Check video availability for a character (cached).
   * Probes for D-ID (_talk.mp4) and SadTalker (_talk_local.mp4) variants.
   */
  async function checkVideos(charId) {
    if (_videoCache[charId]) return _videoCache[charId];

    const [idle, talk, talkLocal] = await Promise.all([
      probeVideo(VIDEO_BASE + charId + '_idle.mp4'),
      probeVideo(VIDEO_BASE + charId + '_talk.mp4'),
      probeVideo(VIDEO_BASE + charId + '_talk_local.mp4'),
    ]);

    // Prefer D-ID talk video; fall back to local SadTalker
    const talkUrl = talk  ? (VIDEO_BASE + charId + '_talk.mp4')
                 : talkLocal ? (VIDEO_BASE + charId + '_talk_local.mp4')
                 : null;

    _videoCache[charId] = { idle, talk: !!talkUrl, talkUrl };
    console.log(`[VideoPortrait] ${charId}: idle=${idle}, talk=${talk}, local=${talkLocal}`);
    return _videoCache[charId];
  }

  /**
   * Create and insert the <video> element.
   */
  function createVideoEl() {
    if (_videoEl) return;
    _videoEl = document.createElement('video');
    _videoEl.id = 'dialogue-portrait-video';
    _videoEl.autoplay = true;
    _videoEl.loop = true;
    _videoEl.muted = true;     // Must be muted for autoplay to work
    _videoEl.playsInline = true;
    _videoEl.setAttribute('playsinline', '');
    _videoEl.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      z-index: 3;
      pointer-events: none;
    `;
  }

  /**
   * Attach to a portrait container. Probes for videos, falls back to CSS if missing.
   * @param {HTMLElement} wrapEl — #dialogue-portrait-wrap
   * @param {HTMLElement} imgEl — #dialogue-portrait <img>
   * @param {string} charId — Character key
   */
  async function attach(wrapEl, imgEl, charId) {
    detach();
    _wrapEl = wrapEl;
    _imgEl = imgEl;
    _charId = charId;
    _isTalking = false;

    const avail = await checkVideos(charId);
    _hasIdle = avail.idle;
    _hasTalk = avail.talk;
    _talkUrl = avail.talkUrl || null;

    // If we have at least a talk video, use video mode
    if (_hasIdle || _hasTalk) {
      _useFallback = false;
      createVideoEl();
      _wrapEl.appendChild(_videoEl);

      // Start with idle if available, otherwise show static image
      if (_hasIdle) {
        _videoEl.src = VIDEO_BASE + charId + '_idle.mp4';
        _videoEl.style.display = 'block';
        _videoEl.play().catch(() => {});
      } else {
        _videoEl.style.display = 'none';
      }
    } else {
      // No videos — use CSS fallback
      _useFallback = true;
    }

    return _useFallback;
  }

  /**
   * Switch between talking and idle video.
   * @param {boolean} talking — true = show talk video, false = show idle
   */
  function setTalking(talking) {
    if (_useFallback || !_videoEl) return;
    _isTalking = talking;

    if (talking && _hasTalk && _talkUrl) {
      _videoEl.src = _talkUrl;
      _videoEl.style.display = 'block';
      _videoEl.play().catch(() => {});
    } else if (!talking && _hasIdle) {
      _videoEl.src = VIDEO_BASE + _charId + '_idle.mp4';
      _videoEl.style.display = 'block';
      _videoEl.play().catch(() => {});
    } else if (!talking) {
      // No idle video, hide video and show static image
      if (_videoEl) _videoEl.style.display = 'none';
    }
  }

  /**
   * Clean up — remove video element.
   */
  function detach() {
    if (_videoEl && _videoEl.parentNode) {
      _videoEl.pause();
      _videoEl.removeAttribute('src');
      _videoEl.parentNode.removeChild(_videoEl);
    }
    _videoEl = null;
    _wrapEl = null;
    _imgEl = null;
    _charId = null;
    _hasIdle = false;
    _hasTalk = false;
    _talkUrl = null;
    _isTalking = false;
    _useFallback = false;
  }

  /**
   * Check if currently using fallback (CSS) mode.
   */
  function isFallback() {
    return _useFallback;
  }

  return { attach, detach, setTalking, isFallback, checkVideos };
})();

window.VideoPortrait = VideoPortrait;
