/**
 * voice.js — Ukrainian Text-to-Speech voice system with gender & age support
 *
 * Uses the Web Speech API (speechSynthesis) to speak dialogue lines
 * in Ukrainian (uk-UA). Selects separate male and female voices when
 * available, and applies per-character pitch/rate profiles based on
 * their gender and age to create distinct-sounding voices.
 *
 * Voice differentiation strategy (Web Speech API best practices):
 *  - Gender: select different base voices (female vs male voice objects)
 *  - Age:    pitch shifts — older = lower pitch, younger = higher pitch
 *  - Personality: rate adjustments — calm/experienced = slower, energetic = faster
 *
 * Chrome provides Google uk-UA voices. macOS has Lesya (female).
 * If multiple Ukrainian voices exist, we pick one male-sounding and one
 * female-sounding voice by inspecting voice names for gender hints.
 *
 * Usage:
 *   VoiceManager.speak(text, 'aramais', onStart, onEnd)
 *   VoiceManager.stop()
 *   VoiceManager.setEnabled(true/false)
 *   VoiceManager.isEnabled()
 */

'use strict';

const VoiceManager = (() => {
  const STORAGE_KEY = 'git-blame-voice-enabled';

  let _enabled = true;
  let _maleVoice = null;     // SpeechSynthesisVoice for male characters
  let _femaleVoice = null;   // SpeechSynthesisVoice for female characters
  let _fallbackVoice = null; // Single voice if gendered selection unavailable
  let _ready = false;
  let _speaking = false;
  let _pendingOnEnd = null;
  let _simTimer = null;

  // ── Load saved preference ────────────────────────────────
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) _enabled = saved === '1';
  } catch {}

  // ── Voice selection helpers ──────────────────────────────

  /** Heuristic: does this voice name/label suggest a female voice? */
  function isFemaleVoiceName(name) {
    const n = name.toLowerCase();
    // Common female Ukrainian/Slavic voice names and markers
    return /lesya|katya|natasha|oksana|female|жін|woman|alina|olena|maria|anna|lesia/i.test(n);
  }

  /** Heuristic: does this voice name/label suggest a male voice? */
  function isMaleVoiceName(name) {
    const n = name.toLowerCase();
    return /mykola|oleksiy|dmytro|male|чол|man|andriy|ivan|boris|taras|volodymyr/i.test(n);
  }

  function findUkrainianVoices() {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;

    // Gather all Ukrainian / Slavic voices by preference
    const ukVoices = voices.filter(v => v.lang === 'uk-UA');
    const ukBroad  = ukVoices.length ? ukVoices : voices.filter(v => v.lang.startsWith('uk'));
    const slavic   = voices.filter(v => /^(ru|pl|cs|sk|bg)/.test(v.lang));
    const pool     = ukBroad.length ? ukBroad : slavic;

    if (!pool.length) return;

    // Try to pick gendered voices from the pool
    const females = pool.filter(v => isFemaleVoiceName(v.name));
    const males   = pool.filter(v => isMaleVoiceName(v.name));
    const unknowns = pool.filter(v => !isFemaleVoiceName(v.name) && !isMaleVoiceName(v.name));

    if (females.length && males.length) {
      _femaleVoice = females[0];
      _maleVoice = males[0];
    } else if (pool.length >= 2) {
      // If we have 2+ voices but can't identify gender, assign first to male, second to female
      // (many TTS engines list male first, female second—or vice versa)
      _maleVoice = pool[0];
      _femaleVoice = pool.length > 1 ? pool[1] : pool[0];
    } else {
      // Only one voice available — use pitch to differentiate
      _fallbackVoice = pool[0];
    }

    _ready = true;

    const m = _maleVoice || _fallbackVoice;
    const f = _femaleVoice || _fallbackVoice;
    console.log('[VoiceManager] Male voice:', m ? `${m.name} (${m.lang})` : 'none');
    console.log('[VoiceManager] Female voice:', f ? `${f.name} (${f.lang})` : 'none');
    if (!m && !f) {
      console.warn('[VoiceManager] No suitable voices found. TTS disabled.');
    }
  }

  // ── Init ─────────────────────────────────────────────────

  function init() {
    if (typeof speechSynthesis === 'undefined') {
      console.warn('[VoiceManager] speechSynthesis not supported.');
      _ready = true;
      return;
    }

    const voices = speechSynthesis.getVoices();
    if (voices.length) {
      findUkrainianVoices();
    } else {
      speechSynthesis.addEventListener('voiceschanged', () => {
        if (!_ready) findUkrainianVoices();
      });
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        if (speechSynthesis.getVoices().length || attempts > 20) {
          clearInterval(poll);
          if (!_ready) findUkrainianVoices();
        }
      }, 200);
    }
  }

  // ── Voice for a character ────────────────────────────────

  function getVoiceForCharacter(characterId) {
    const c = window.CHARACTERS[characterId];
    if (!c || !c.voice) return _fallbackVoice || _maleVoice || _femaleVoice;

    const gender = c.voice.gender || 'male';

    if (gender === 'female') {
      return _femaleVoice || _fallbackVoice || _maleVoice;
    }
    return _maleVoice || _fallbackVoice || _femaleVoice;
  }

  // ── Speak ────────────────────────────────────────────────

  function speak(text, characterId, onStart, onEnd) {
    stop();

    const voice = getVoiceForCharacter(characterId);

    if (!_enabled || !voice || !text) {
      if (!_enabled || !voice) {
        if (onStart) onStart();
        const dur = Math.min(4000, Math.max(500, text.length * 60));
        _simTimer = setTimeout(() => { _simTimer = null; if (onEnd) onEnd(); }, dur);
      }
      return;
    }

    const utt = new SpeechSynthesisUtterance(text);
    utt.voice = voice;
    utt.lang = voice.lang;

    // Apply character voice profile (pitch + rate)
    const c = window.CHARACTERS[characterId];
    const profile = c && c.voice ? c.voice : { pitch: 1, rate: 1 };
    utt.pitch = Math.max(0.1, Math.min(2, profile.pitch));
    utt.rate  = Math.max(0.5, Math.min(2, profile.rate));
    utt.volume = 1.0;

    _pendingOnEnd = onEnd;

    utt.onstart = () => {
      _speaking = true;
      if (onStart) onStart();
    };

    utt.onend = () => {
      _speaking = false;
      if (_pendingOnEnd) { _pendingOnEnd(); _pendingOnEnd = null; }
    };

    utt.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[VoiceManager] Speech error:', e.error);
      }
      _speaking = false;
      if (_pendingOnEnd) { _pendingOnEnd(); _pendingOnEnd = null; }
    };

    speechSynthesis.speak(utt);
  }

  // ── Stop ─────────────────────────────────────────────────

  function stop() {
    clearTimeout(_simTimer);
    _simTimer = null;
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    _speaking = false;
    if (_pendingOnEnd) { _pendingOnEnd(); _pendingOnEnd = null; }
  }

  // ── Enable / Disable ────────────────────────────────────

  function setEnabled(val) {
    _enabled = !!val;
    try { localStorage.setItem(STORAGE_KEY, _enabled ? '1' : '0'); } catch {}
    if (!_enabled) stop();
  }

  function isEnabled() { return _enabled; }
  function isSpeaking() { return _speaking; }
  function hasVoice() { return !!(_maleVoice || _femaleVoice || _fallbackVoice); }

  init();

  return { speak, stop, setEnabled, isEnabled, isSpeaking, hasVoice, init };
})();

window.VoiceManager = VoiceManager;
