/**
 * game.js — Core state machine, random villain system, main loop
 */

'use strict';

// ─────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────

const STATE_KEY = 'git-blame-v1';

const GameState = {
  act: 0,            // 0 = title, 1–5 = acts
  phase: 'title',    // title | villain_reveal | dialogue | puzzle | transition | ending | cossacks | credits
  villains: [],      // [ characterId, characterId ] — chosen at game start
  puzzlesDone: [],   // [ 1, 2, 3, 4 ] — completed puzzle numbers
  dialogueIndex: 0,  // current line in active dialogue sequence
  activeDialogue: null,
  selectedFacts: {},  // { slotId: factId } for triage puzzle

  save() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        act: this.act,
        villains: this.villains,
        puzzlesDone: this.puzzlesDone,
      }));
    } catch {}
  },

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
      if (saved && saved.villains && saved.villains.length === 2) {
        this.act = saved.act || 0;
        this.villains = saved.villains;
        this.puzzlesDone = saved.puzzlesDone || [];
        return true;
      }
    } catch {}
    return false;
  },

  reset() {
    this.act = 0;
    this.phase = 'title';
    this.villains = [];
    this.puzzlesDone = [];
    this.dialogueIndex = 0;
    this.activeDialogue = null;
    this.selectedFacts = {};
    try { localStorage.removeItem(STATE_KEY); } catch {}
  },
};

// ─────────────────────────────────────────────────────────
// VILLAIN SYSTEM
// ─────────────────────────────────────────────────────────

function pickVillains() {
  GameState.villains = ['misha', 'sasha'];
}

function getVillain(slot) {
  // slot: 0 or 1
  return CHARACTERS[GameState.villains[slot]] || null;
}

function isVillain(characterId) {
  return GameState.villains.includes(characterId);
}

// Inject villain names into dialogue strings
function injectVillains(text) {
  const v0 = getVillain(0);
  const v1 = getVillain(1);
  return text
    .replace(/\[USER_A\]/g, v0 ? v0.name : '???')
    .replace(/\[USER_B\]/g, v1 ? v1.name : '???')
    .replace(/\[VILLAIN_A\]/g, v0 ? v0.name : '???')
    .replace(/\[VILLAIN_B\]/g, v1 ? v1.name : '???');
}

// ─────────────────────────────────────────────────────────
// SCREEN MANAGEMENT
// ─────────────────────────────────────────────────────────

function showScreen(id, cb) {
  const overlay = document.getElementById('transition-overlay');
  overlay.classList.add('fade-in');

  setTimeout(() => {
    document.querySelectorAll('.screen.active').forEach(s => {
      s.classList.remove('active');
      s.style.display = '';
    });

    const el = document.getElementById('screen-' + id);
    if (el) {
      el.classList.add('active');
      el.style.display = 'flex';
    }

    overlay.classList.remove('fade-in');
    if (cb) cb();
  }, 400);
}

// ─────────────────────────────────────────────────────────
// NOTIFICATION
// ─────────────────────────────────────────────────────────

let _notifTimer = null;

function notify(text, duration = 3000) {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(_notifTimer);
  _notifTimer = setTimeout(() => el.classList.add('hidden'), duration);
}

// ─────────────────────────────────────────────────────────
// TITLE SCREEN
// ─────────────────────────────────────────────────────────

function initTitleScreen() {
  document.getElementById('btn-start').onclick = () => {
    // Check for saved game
    const hasSaved = GameState.load();
    if (hasSaved && GameState.act > 0 && GameState.act < 5) {
      if (confirm('Є збережений прогрес з Акту ' + GameState.act + '. Продовжити? (ОК = продовжити, Скасувати = нова гра)')) {
        continueFromSave();
        return;
      }
    }
    startNewGame();
  };

  document.getElementById('btn-credits').onclick = () => showCredits('title');
}

function startNewGame() {
  GameState.reset();
  pickVillains();
  GameState.save();
  showVillainReveal();
}

function continueFromSave() {
  const act = GameState.act;
  if (act >= 5) {
    showEnding();
  } else {
    startAct(act);
  }
}

// ─────────────────────────────────────────────────────────
// VILLAIN REVEAL
// ─────────────────────────────────────────────────────────

function showVillainReveal() {
  const v0 = getVillain(0);
  const v1 = getVillain(1);

  // Portraits
  const p1 = document.getElementById('suspect-1-portrait');
  const p2 = document.getElementById('suspect-2-portrait');
  p1.src = getPortraitSrc(v0.id);
  p1.onerror = () => { p1.src = makePlaceholderPortrait(v0.id); };
  p2.src = getPortraitSrc(v1.id);
  p2.onerror = () => { p2.src = makePlaceholderPortrait(v1.id); };

  showScreen('villain-reveal', () => {
    AudioManager.stopAll(0.5);
    AudioManager.play('main_theme', { loop: true, fadeIn: 1.5 });
  });

  document.getElementById('btn-reveal-start').onclick = () => {
    startAct(1);
  };
}

// ─────────────────────────────────────────────────────────
// ACT TRANSITION
// ─────────────────────────────────────────────────────────

function showActTransition(actIndex, cb) {
  const act = ACTS[actIndex - 1];
  if (!act) { if (cb) cb(); return; }

  document.getElementById('act-number').textContent = act.number;
  document.getElementById('act-title').textContent = act.title;
  document.getElementById('act-description').textContent = injectVillains(act.description);

  showScreen('act-transition', () => {
    if (act.music) {
      AudioManager.stopAll(0.5);
      AudioManager.play(act.music, { loop: true, fadeIn: 1 });
    }
  });

  document.getElementById('btn-act-continue').onclick = () => {
    if (cb) cb();
  };
}

// ─────────────────────────────────────────────────────────
// DIALOGUE ENGINE
// ─────────────────────────────────────────────────────────

function playDialogue(sequence, bgScene, cb) {
  const clean = sequence.filter(l => l.speaker || l.type);
  let idx = 0;

  const portraitEl = document.getElementById('dialogue-portrait');
  const speakerEl  = document.getElementById('dialogue-speaker-name');
  const textEl     = document.getElementById('dialogue-text');
  const bgEl       = document.getElementById('dialogue-bg');

  if (bgScene) bgEl.style.backgroundImage = `url('${getBgSrc(bgScene)}')`;

  function advance() {
    while (idx < clean.length) {
      const line = clean[idx++];

      if (line.type === 'pause') {
        setTimeout(advance, line.ms || 500);
        return;
      }
      if (line.type === 'sfx') {
        AudioManager.play(line.key);
        continue;
      }
      if (line.type === 'music') {
        AudioManager.stopAll(0.5);
        AudioManager.play(line.key, { loop: true, fadeIn: 1 });
        continue;
      }
      if (line.type === 'bg') {
        bgEl.style.backgroundImage = `url('${getBgSrc(line.scene)}')`;
        continue;
      }

      // Dialogue line
      const char = CHARACTERS[line.speaker];
      if (line.speaker === 'narrator' || !char) {
        portraitEl.style.display = 'none';
        portraitEl.classList.remove('is-talking');
        speakerEl.textContent = '';
      } else {
        portraitEl.style.display = 'block';
        portraitEl.classList.add('is-talking');
        const portraitState = line.portrait || 'default';
        Scenes.setPortrait(portraitEl, line.speaker, portraitState);
        speakerEl.textContent = char.name.toUpperCase();
        speakerEl.style.color = char.color;
      }

      textEl.textContent = injectVillains(line.text);
      return; // wait for click
    }

    // Sequence done
    if (cb) cb();
  }

  showScreen('dialogue', () => advance());
  document.getElementById('screen-dialogue').onclick = () => {
    AudioManager.play('sfx_click');
    advance();
  };
}

// ─────────────────────────────────────────────────────────
// ACT FLOW
// ─────────────────────────────────────────────────────────

function startAct(actNum) {
  GameState.act = actNum;
  GameState.save();

  showActTransition(actNum, () => {
    switch (actNum) {
      case 1: runAct1(); break;
      case 2: runAct2(); break;
      case 3: runAct3(); break;
      case 4: runAct4(); break;
      case 5: runAct5(); break;
    }
  });
}

// ACT 1
function runAct1() {
  playDialogue(ACT1_INTRO, 'warroom_party', () => {
    playDialogue(ACT1_PUZZLE_INTRO, 'warroom', () => {
      showPuzzle(1, 'warroom', () => {
        playDialogue(ACT1_OUTRO, 'warroom', () => {
          GameState.puzzlesDone.push(1);
          GameState.save();
          startAct(2);
        });
      });
    });
  });
}

// ACT 2
function runAct2() {
  playDialogue(ACT2_INTRO, 'terminal', () => {
    playDialogue(ACT2_PUZZLE_INTRO, 'terminal', () => {
      showPuzzle(2, 'terminal', () => {
        playDialogue(ACT2_OUTRO, 'terminal', () => {
          GameState.puzzlesDone.push(2);
          GameState.save();
          startAct(3);
        });
      });
    });
  });
}

// ACT 3
function runAct3() {
  playDialogue(ACT3_INTRO, 'villain_forum', () => {
    playDialogue(ACT3_PUZZLE_INTRO, 'villain_forum', () => {
      showPuzzle(3, 'villain_forum', () => {
        showVideoClip('assets/video/misha_crying.mp4', 'Тим часом... у Міші вдома', () => {
          playDialogue(ACT3_OUTRO, 'villain_forum', () => {
            GameState.puzzlesDone.push(3);
            GameState.save();
            startAct(4);
          });
        });
      });
    });
  });
}

// ACT 4
function runAct4() {
  playDialogue(ACT4_INTRO, 'terminal', () => {
    playDialogue(ACT4_PUZZLE_INTRO, 'terminal', () => {
      showPuzzle(4, 'terminal', () => {
        playDialogue(ACT4_OUTRO, 'terminal', () => {
          GameState.puzzlesDone.push(4);
          GameState.save();
          startAct(5);
        });
      });
    });
  });
}

// ACT 5
function runAct5() {
  playDialogue(ACT5_ENDING, 'warroom_party', () => {
    GameState.act = 5;
    GameState.save();
    showEnding();
  });
}

// ─────────────────────────────────────────────────────────
// PUZZLE WRAPPER
// ─────────────────────────────────────────────────────────

function showPuzzle(puzzleNum, bgScene, onComplete) {
  const puzzleTitles = {
    1: 'EXIF АВТОПСІЯ',
    2: 'АНАЛІЗАТОР ЛОГІВ',
    3: 'РОЗШИФРОВКА ШИФРУ',
    4: 'GIT FORENSICS — git blame',
  };
  const actLabels = {
    1: 'АКТ І',
    2: 'АКТ ІІ',
    3: 'АКТ ІІІ',
    4: 'АКТ IV',
  };

  document.getElementById('puzzle-act-label').textContent = actLabels[puzzleNum] || '';
  document.getElementById('puzzle-title').textContent = puzzleTitles[puzzleNum] || '';

  const bgEl = document.getElementById('puzzle-bg');
  bgEl.style.backgroundImage = `url('${getBgSrc(bgScene)}')`;

  // Hint
  const hintKeys = { 1: 'exif', 2: 'logs', 3: 'cipher', 4: 'triage' };
  const hintBox = document.getElementById('puzzle-hint-box');
  hintBox.classList.add('hidden');
  hintBox.textContent = PUZZLE_HINTS[hintKeys[puzzleNum]] || '';

  document.getElementById('puzzle-hint-btn').onclick = () => {
    hintBox.classList.toggle('hidden');
  };

  showScreen('puzzle', () => {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';

    switch (puzzleNum) {
      case 1: Puzzles.initEXIF(container, onComplete); break;
      case 2: Puzzles.initLogs(container, onComplete); break;
      case 3: Puzzles.initCipher(container, onComplete); break;
      case 4: Puzzles.initTriage(container, onComplete); break;
    }
  });
}

// ─────────────────────────────────────────────────────────
// VIDEO CLIP
// Shows a full-screen video with a title caption.
// Advances automatically when the video ends, or on click/tap to skip.
// ─────────────────────────────────────────────────────────

function showVideoClip(src, title, cb) {
  const titleEl  = document.getElementById('video-clip-title');
  const videoEl  = document.getElementById('video-clip-player');
  const screenEl = document.getElementById('screen-video-clip');

  titleEl.textContent = title || '';
  videoEl.src = src;

  let done = false;
  function advance() {
    if (done) return;
    done = true;
    videoEl.onended = null;
    videoEl.onerror = null;
    videoEl.pause();
    screenEl.onclick = null;
    if (cb) cb();
  }

  videoEl.onended = advance;
  videoEl.onerror = advance; // if file is missing, skip gracefully

  showScreen('video-clip', () => {
    videoEl.currentTime = 0;
    videoEl.play().catch(() => {}); // autoplay may be blocked; clicked advance still works
    screenEl.onclick = advance;
  });
}

// ─────────────────────────────────────────────────────────
// ENDING
// ─────────────────────────────────────────────────────────

function showEnding() {
  const groupPortrait = document.getElementById('ending-group-portrait');
  groupPortrait.innerHTML = '';
  Object.keys(CHARACTERS).filter(id => !CHARACTERS[id].isFixedVillain).forEach(id => {
    const c = CHARACTERS[id];
    const wrap = document.createElement('div');
    wrap.className = 'group-member-mini';
    const img = document.createElement('img');
    img.src = getPortraitSrc(id);
    img.onerror = () => { img.src = makePlaceholderPortrait(id); };
    const name = document.createElement('div');
    name.className = 'mini-name';
    name.textContent = c.name;
    wrap.appendChild(img);
    wrap.appendChild(name);
    groupPortrait.appendChild(wrap);
  });

  // Member lines
  const memberList = document.getElementById('ending-members-list');
  memberList.innerHTML = Object.entries(ENDING_MEMBER_LINES)
    .map(([id, line]) => {
      const c = CHARACTERS[id];
      return `<div style="color:${c.color}"><strong>${c.name}:</strong> ${line}</div>`;
    }).join('');

  document.getElementById('ending-final-text').textContent =
    'П\'ять років. Ми не здалися. Ми не зламалися. ' +
    'Ми пройшли баги, клієнтів, і навіть шантаж. ' +
    'І ми продовжуємо. Разом.';

  AudioManager.stopAll(1);
  AudioManager.play('finale', { loop: false, fadeIn: 2 });

  showScreen('ending', () => {
    document.getElementById('btn-easter-egg').onclick = () => showCossacks();
    document.getElementById('btn-replay').onclick = () => {
      startNewGame();
    };
    document.getElementById('btn-credits-end').onclick = () => showCredits('ending');
  });
}

// ─────────────────────────────────────────────────────────
// COSSACKS MINI-GAME
// ─────────────────────────────────────────────────────────

function showCossacks() {
  AudioManager.stopAll(0.5);
  AudioManager.play('cossacks_bgm', { loop: true });

  showScreen('cossacks', () => {
    const canvas = document.getElementById('cossacks-canvas');
    const overlay = document.getElementById('cossacks-overlay');
    const resultEl = document.getElementById('cossacks-result');
    const timerEl = document.getElementById('cossacks-timer');
    const scoreEl = document.getElementById('cossacks-score');
    const livesEl = document.getElementById('cossacks-lives');

    overlay.classList.add('hidden');

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let timeLeft = 30;
    let score = 0;
    let lives = 3;
    let enemies = [];
    let particles = [];
    let running = true;

    // Player (Aramais — cossack icon at bottom center)
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 80,
      r: 28,
      color: CHARACTERS.aramais.color,
    };

    function spawnEnemy() {
      enemies.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: -30,
        r: 18 + Math.random() * 12,
        speed: 1.5 + Math.random() * 2 + (30 - timeLeft) * 0.08,
        color: Math.random() > 0.5 ? '#e74c3c' : '#8e44ad',
        label: Math.random() > 0.5 ? 'SPAM' : 'ШАНТАЖ',
        hp: 1,
      });
    }

    function spawnParticle(x, y, color) {
      for (let i = 0; i < 6; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 20,
          color,
        });
      }
    }

    const spawnInterval = setInterval(spawnEnemy, 900);
    const timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = String(timeLeft);
      if (timeLeft <= 0) endGame(true);
    }, 1000);

    function endGame(win) {
      if (!running) return;
      running = false;
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
      cancelAnimationFrame(_rafId);
      AudioManager.stop('cossacks_bgm', 0.5);
      AudioManager.play('puzzle_solved');

      const tmpl = win ? COSSACKS_STRINGS.win : COSSACKS_STRINGS.lose;
      resultEl.textContent = tmpl.replace('{score}', score);
      overlay.classList.remove('hidden');

      document.getElementById('btn-cossacks-end').onclick = () => {
        showEnding();
      };
    }

    canvas.onclick = (e) => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (let i = enemies.length - 1; i >= 0; i--) {
        const en = enemies[i];
        const dist = Math.hypot(mx - en.x, my - en.y);
        if (dist < en.r + 10) {
          spawnParticle(en.x, en.y, en.color);
          enemies.splice(i, 1);
          score++;
          scoreEl.textContent = score + ' знищено';
          AudioManager.play('sfx_found');
          break;
        }
      }
    };

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      canvas.onclick({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: false });

    let _rafId;
    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#1a0a2a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(60,20,80,0.3)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < canvas.width; gx += 60) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
      }
      for (let gy = 0; gy < canvas.height; gy += 60) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
      }

      // Player (cossack / Aramais icon)
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚔', player.x, player.y);

      // Enemies
      enemies = enemies.filter(en => {
        en.y += en.speed;

        // Hit player base line
        if (en.y > canvas.height - 40) {
          spawnParticle(en.x, en.y, en.color);
          lives--;
          if (lives <= 0) livesEl.textContent = '';
          else livesEl.textContent = '❤'.repeat(lives);
          if (lives <= 0) endGame(false);
          return false;
        }

        // Draw enemy
        ctx.fillStyle = en.color;
        ctx.beginPath();
        ctx.arc(en.x, en.y, en.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(en.label, en.x, en.y);
        return true;
      });

      // Particles
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.globalAlpha = p.life / 20;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return p.life > 0;
      });

      // Bottom line
      ctx.strokeStyle = player.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();

      _rafId = requestAnimationFrame(loop);
    }

    loop();
  });
}

// ─────────────────────────────────────────────────────────
// CREDITS
// ─────────────────────────────────────────────────────────

function showCredits(returnScreen) {
  const container = document.getElementById('credits-content');
  const d = CREDITS_DATA;

  let html = `<h1>${d.title}</h1><h2>${d.subtitle}</h2>`;

  d.sections.forEach(sec => {
    html += `<div class="credits-section">`;
    html += `<div class="credits-section-title">${sec.title}</div>`;
    sec.items.forEach(item => {
      html += `<div class="credits-item">${item.name} <span>— ${item.role}</span></div>`;
    });
    html += `</div>`;
  });

  html += `<div class="credits-ai-note">${d.aiNote}</div>`;
  container.innerHTML = html;

  showScreen('credits', () => {
    document.getElementById('btn-credits-back').onclick = () => {
      showScreen(returnScreen === 'ending' ? 'ending' : 'title');
    };
  });
}

// ─────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────

function init() {
  // Telegram Mini App integration (optional)
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    // Greet player by their Telegram name if available
    const tgName = tg.initDataUnsafe?.user?.first_name;
    if (tgName) {
      const tagline = document.querySelector('.title-tagline');
      if (tagline) {
        tagline.textContent = `Привіт, ${tgName}! "Хтось злив репо. Хтось завжди зливає."`;
      }
    }
  }

  // Lock screen to show title
  showScreen('title', () => {
    initTitleScreen();
    preloadAll(); // non-blocking audio preload
  });
}

window.addEventListener('DOMContentLoaded', init);
window.GameState   = GameState;
window.notify      = notify;
window.showScreen  = showScreen;
window.isVillain   = isVillain;
window.getVillain  = getVillain;
window.injectVillains = injectVillains;
