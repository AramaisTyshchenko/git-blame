/**
 * puzzles.js — All puzzle modules
 *
 * Each puzzle exposes:
 *   init(containerEl, onComplete)
 *
 * onComplete is called (no arguments) when the puzzle is solved.
 */

'use strict';

const Puzzles = (() => {

  // ───────────────────────────────────────────────────────
  // PUZZLE 1 — EXIF AUTOPSY
  // Player must identify 3 anomalies in the screenshot metadata
  // and drag them to the evidence board.
  // ───────────────────────────────────────────────────────

  function initEXIF(container, onComplete) {
    const EXIF_ROWS = [
      { key: 'Назва файлу',         value: 'screenshot_final_v2_REAL.png',     anomaly: false },
      { key: 'Дата створення',      value: '2025-10-12  09:14:22',             anomaly: false },
      { key: 'Дата зміни',          value: '2025-10-12  22:47:03',             anomaly: true,
        anomalyId: 'a1',
        evidence: 'Файл змінено через 13+ годин після створення — після «оригінального» експорту' },
      { key: 'Пристрій (Make)',      value: 'НЕVІДОМÓ-DEVICE-X99',             anomaly: true,
        anomalyId: 'a2',
        evidence: 'Пристрій не відповідає жодному члену команди' },
      { key: 'Часовий пояс (TZ)',    value: 'UTC+3 (Москва / Мінськ)',          anomaly: true,
        anomalyId: 'a3',
        evidence: 'Часовий пояс UTC+3 — жоден член команди не знаходиться в цій зоні' },
      { key: 'Розміщення (GPS)',     value: '(відсутнє)',                       anomaly: false },
      { key: 'Програма редагування',value: 'Adobe Photoshop 25.0',             anomaly: false },
      { key: 'Роздільна здатність', value: '1920 × 1080 px',                  anomaly: false },
      { key: 'Розмір файлу',        value: '847 KB',                           anomaly: false },
      { key: 'Колірний простір',    value: 'sRGB',                             anomaly: false },
      { key: 'Коментар EXIF',       value: '( порожній )',                     anomaly: false },
      { key: 'SHA-256 хеш',         value: 'a3f9b1... (не збігається з оригіналом)', anomaly: false },
    ];

    const TOTAL_ANOMALIES = 3;
    let found = new Set();
    let selectedAnomaly = null;

    // Build the 3-column layout
    container.innerHTML = `
      <div class="exif-puzzle">
        <div class="exif-screenshot-panel">
          <div class="panel-title">📸 СКРІНШОТ (ПІДОЗРІЛИЙ)</div>
          <div id="exif-screenshot-placeholder" style="
            width:100%;padding-bottom:56%;background:var(--noir-mid);
            display:flex;align-items:center;justify-content:center;
            color:var(--white-dim);font-size:11px;letter-spacing:2px;
            border:1px dashed var(--noir-border);position:relative;
          ">
            <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
              [СКРІНШОТ ОБРІЗАНО]
            </span>
          </div>
          <div style="margin-top:8px;font-size:10px;color:var(--white-dim);line-height:1.5;">
            Скріншот переписки команди. Частина обрізана.<br>
            EXIF-метадані можуть розкрити, хто і коли редагував файл.
          </div>
        </div>

        <div class="exif-metadata-panel">
          <div class="panel-title">🔍 МЕТАДАНІ ФАЙЛУ (EXIF)</div>
          <div id="exif-rows"></div>
        </div>

        <div class="evidence-board">
          <div class="panel-title">📋 ДОШКА ДОКАЗІВ</div>
          <div id="exif-slots"></div>
          <div style="font-size:13px;color:var(--white-dim);margin-top:8px;">
            Знайди всі ${TOTAL_ANOMALIES} аномалії.
          </div>
          <button class="btn-primary evidence-submit-btn" id="exif-submit">
            ✔ ПІДТВЕРДИТИ ДОКАЗИ
          </button>
        </div>
      </div>
    `;

    // Render EXIF rows
    const rowsEl = document.getElementById('exif-rows');
    EXIF_ROWS.forEach(row => {
      const div = document.createElement('div');
      div.className = 'exif-row' + (row.anomaly ? ' anomaly' : '');
      div.innerHTML = `
        <span class="exif-key">${row.key}</span>
        <span class="exif-val">${row.value}</span>
      `;
      if (row.anomaly && row.anomalyId) {
        div.dataset.anomalyId = row.anomalyId;
        div.onclick = () => {
          // Toggle selection
          document.querySelectorAll('.exif-row.selected').forEach(r => r.classList.remove('selected'));
          if (selectedAnomaly === row.anomalyId) {
            selectedAnomaly = null;
          } else {
            selectedAnomaly = row.anomalyId;
            div.classList.add('selected');
            AudioManager.play('sfx_click');
          }
        };
      }
      rowsEl.appendChild(div);
    });

    // Render evidence slots
    const slotsEl = document.getElementById('exif-slots');
    for (let i = 1; i <= TOTAL_ANOMALIES; i++) {
      const slot = document.createElement('div');
      slot.className = 'evidence-slot';
      slot.id = 'exif-slot-' + i;
      slot.textContent = `Аномалія ${i}: ( клікни після вибору рядка )`;
      slot.onclick = () => {
        if (!selectedAnomaly) {
          notify('Спочатку вибери підозрілий рядок у метаданих!');
          return;
        }
        if (found.has(selectedAnomaly)) {
          notify('Цю аномалію вже додано!');
          return;
        }
        if (slot.classList.contains('filled')) {
          return;
        }

        // Find the anomaly data
        const anomalyData = EXIF_ROWS.find(r => r.anomalyId === selectedAnomaly);
        if (!anomalyData) return;

        found.add(selectedAnomaly);
        slot.classList.add('filled');
        slot.textContent = '✔ ' + anomalyData.evidence;

        // Mark row as used
        document.querySelector(`[data-anomaly-id="${selectedAnomaly}"]`)?.classList.add('selected');
        selectedAnomaly = null;
        document.querySelectorAll('.exif-row.selected').forEach(r => r.classList.remove('selected'));

        AudioManager.play('sfx_found');

        if (found.size >= TOTAL_ANOMALIES) {
          const submitBtn = document.getElementById('exif-submit');
          submitBtn.classList.add('visible');
          submitBtn.style.display = 'block';
          Scenes.showStamp('АНОМАЛІЇ ЗНАЙДЕНО!', '#27ae60');
        }
      };
      slotsEl.appendChild(slot);
    }

    document.getElementById('exif-submit').onclick = () => {
      if (found.size < TOTAL_ANOMALIES) {
        notify('Знайди всі ' + TOTAL_ANOMALIES + ' аномалії перш ніж підтверджувати!');
        return;
      }
      AudioManager.play('puzzle_solved');
      Scenes.showStamp('✔ ДОВЕДЕНО!', '#27ae60');
      setTimeout(onComplete, 2000);
    };
  }


  // ───────────────────────────────────────────────────────
  // PUZZLE 2 — LOG PARSER
  // Fake terminal with filter commands to find gaps and suspects.
  // ───────────────────────────────────────────────────────

  function initLogs(container, onComplete) {
    const FINDINGS_NEEDED = 3;
    const findings = new Set(); // 'gap1' | 'gap2' | 'gap3' | 'suspect'

    const FINDING_DEFS = {
      gap1:    'Пропуск 38 хв (10:09–10:47): видалено розмову між USER_A та командою про клієнта',
      gap2:    'Пропуск 47 хв (11:05–11:52): видалено підтвердження публічності даних',
      gap3:    'Пропуск 21 хв (14:07–14:28): видалено реакцію команди на успіх демо',
      suspect: 'USER_A і USER_B одночасно онлайн у всіх трьох пропусках → ідентифіковані підозрювані',
    };

    // Inject villain names into logs
    const logs = FAKE_LOGS.map(l => ({
      ...l,
      user: l.user === 'USER_A' ? getVillain(0)?.name || 'USER_A'
           : l.user === 'USER_B' ? getVillain(1)?.name || 'USER_B'
           : l.user,
      originalUser: l.user,
    }));

    let currentFilter = '';

    container.innerHTML = `
      <div class="log-puzzle">
        <div class="log-terminal">
          <div class="log-toolbar">
            <input class="log-filter-input" id="log-filter" placeholder="user:Ім'я  або  time:gap  або  (порожньо = всі)" />
            <button class="log-filter-btn" id="log-filter-btn">ФІЛЬТР</button>
            <button class="log-filter-btn" id="log-clear-btn">СКИНУТИ</button>
          </div>
          <div class="log-lines" id="log-lines"></div>
        </div>

        <div class="log-findings-panel">
          <div class="findings-title">📋 ВИСНОВКИ</div>
          <div id="log-findings"></div>
          <button class="btn-primary" id="logs-submit" style="display:none;margin-top:12px;width:100%;">
            ✔ ПІДТВЕРДИТИ
          </button>
        </div>
      </div>
    `;

    // Render findings slots
    const findingsEl = document.getElementById('log-findings');
    const findingIds = Object.keys(FINDING_DEFS);
    findingIds.forEach(fid => {
      const div = document.createElement('div');
      div.className = 'finding-item';
      div.id = 'finding-' + fid;
      div.textContent = '( ' + ({ gap1: 'Пропуск 1', gap2: 'Пропуск 2', gap3: 'Пропуск 3', suspect: 'Підозрювані' }[fid]) + ': не знайдено )';
      findingsEl.appendChild(div);
    });

    function renderLogs(filter) {
      const linesEl = document.getElementById('log-lines');
      linesEl.innerHTML = '';

      const filterLower = (filter || '').toLowerCase().trim();
      const userFilter = filterLower.startsWith('user:') ? filterLower.slice(5).trim() : null;
      const timeGap    = filterLower === 'time:gap';

      logs.forEach((log, i) => {
        const isGap = log.gapBefore;
        const isUserA = log.originalUser === 'USER_A';
        const isUserB = log.originalUser === 'USER_B';

        // Filtering
        if (userFilter) {
          if (!log.user.toLowerCase().includes(userFilter)) return;
        } else if (timeGap) {
          if (!isGap) return;
        }

        if (isGap) {
          // Show gap marker before this line
          const gapDiv = document.createElement('div');
          gapDiv.className = 'log-line gap-line';
          const gapLabel = i < 15 ? '[ ⚠ ПРОПУСК ~38 хв — рядки видалено ]'
                         : i < 25 ? '[ ⚠ ПРОПУСК ~47 хв — рядки видалено ]'
                         : '[ ⚠ ПРОПУСК ~21 хв — рядки видалено ]';
          gapDiv.innerHTML = `
            <span class="log-time">???:??</span>
            <span class="log-user" style="color:var(--red-alert)">⚠</span>
            <span class="log-msg">${gapLabel}</span>
          `;
          gapDiv.onclick = () => addFinding(i < 15 ? 'gap1' : i < 25 ? 'gap2' : 'gap3');
          linesEl.appendChild(gapDiv);
        }

        const div = document.createElement('div');
        div.className = 'log-line' +
          (isUserA ? ' log-suspect-A' : isUserB ? ' log-suspect-B' : '') +
          (log.isTampered ? ' highlight' : '');

        div.innerHTML = `
          <span class="log-time">${log.time}</span>
          <span class="log-user">${log.user}</span>
          <span class="log-msg">${log.msg}${log.isTampered ? ' <span style="color:var(--amber);font-size:9px;">[ШРИФТ?]</span>' : ''}</span>
        `;

        if (isUserA || isUserB) {
          div.onclick = () => addFinding('suspect');
        }

        linesEl.appendChild(div);
      });

      if (linesEl.children.length === 0) {
        linesEl.innerHTML = '<div style="color:var(--white-dim);padding:8px;font-size:11px;">[ Нічого не знайдено. Спробуй інший фільтр. ]</div>';
      }
    }

    function addFinding(fid) {
      if (findings.has(fid)) {
        notify('Вже зафіксовано!');
        return;
      }
      findings.add(fid);
      AudioManager.play('sfx_found');

      const el = document.getElementById('finding-' + fid);
      if (el) {
        el.classList.add('filled');
        el.textContent = '✔ ' + FINDING_DEFS[fid];
      }

      notify(fid === 'suspect' ? 'Підозрюваних ідентифіковано!' : 'Пропуск знайдено!');

      if (findings.size >= FINDINGS_NEEDED) {
        Scenes.showStamp('ЛОГИ ПРОАНАЛІЗОВАНО!', '#27ae60');
        const btn = document.getElementById('logs-submit');
        btn.style.display = 'block';
      }
    }

    document.getElementById('log-filter-btn').onclick = () => {
      currentFilter = document.getElementById('log-filter').value;
      renderLogs(currentFilter);
    };

    document.getElementById('log-clear-btn').onclick = () => {
      document.getElementById('log-filter').value = '';
      currentFilter = '';
      renderLogs('');
    };

    document.getElementById('log-filter').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        currentFilter = e.target.value;
        renderLogs(currentFilter);
      }
    });

    document.getElementById('logs-submit').onclick = () => {
      if (findings.size < FINDINGS_NEEDED) return;
      AudioManager.play('puzzle_solved');
      Scenes.showStamp('✔ СПРАВА РОЗКРИТА!', '#27ae60');
      setTimeout(onComplete, 2000);
    };

    renderLogs('');
  }


  // ───────────────────────────────────────────────────────
  // PUZZLE 3 — CAESAR CIPHER
  // ───────────────────────────────────────────────────────

  function initCipher(container, onComplete) {
    let currentShift = 0;
    let solved = false;

    container.innerHTML = `
      <div class="cipher-puzzle">

        <div class="cipher-forum">
          <div class="cipher-forum-title">💻 ТЕМНИЙ ФОРУМ :: Анонімні оголошення</div>
          ${VILLAIN_FORUM_POSTS.map(p => `
            <div class="cipher-post">
              <div class="cipher-post-header">
                [${p.time}] ${p.user}:
              </div>
              <div class="cipher-post-body ${p.type === 'encoded' ? '' : ''}">
                ${p.type === 'encoded'
                  ? `<div class="cipher-encoded" id="encoded-post">${p.text}</div>
                     <div style="font-size:10px;color:#666;margin-top:4px;">${p.plaintextHint}</div>`
                  : escapeHtml(p.text)
                }
              </div>
            </div>
          `).join('')}
        </div>

        <div class="cipher-decoder">
          <div class="cipher-label">🔐 ДЕШИФРАТОР</div>

          <div style="font-size:13px;color:var(--white-dim);margin-bottom:12px;line-height:1.6;">
            Введи ключове слово або крути колесо зрушення.
          </div>

          <div class="cipher-label">КЛЮЧ (слово)</div>
          <input class="cipher-key-input" id="cipher-key" placeholder="КЛЮЧ..." maxlength="20">

          <div class="cipher-label" style="margin-top:8px;">АБО РУЧНЕ ЗРУШЕННЯ</div>
          <div class="cipher-wheel-row">
            <button class="cipher-arrow" id="shift-left">◀</button>
            <div class="cipher-shift-display" id="shift-display">0</div>
            <button class="cipher-arrow" id="shift-right">▶</button>
          </div>

          <div class="cipher-label">РЕЗУЛЬТАТ РОЗШИФРОВКИ</div>
          <div class="cipher-decoded-output" id="cipher-output">( введи ключ або зрушення )</div>

          <button class="btn-primary" id="cipher-submit" style="display:none;width:100%;margin-top:8px;">
            ✔ РОЗШИФРОВАНО! ПІДТВЕРДИТИ
          </button>
        </div>
      </div>
    `;

    function escapeHtml(t) {
      return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function updateAlphabetMap(shift) {
      const mapEl = document.getElementById('alphabet-map');
      mapEl.innerHTML = '';
      for (let i = 0; i < 26; i++) {
        const orig = String.fromCharCode(65 + i);
        const enc  = String.fromCharCode(65 + ((i + shift + 26) % 26));
        const cell = document.createElement('div');
        cell.className = 'cipher-letter-cell';
        cell.innerHTML = `<div class="orig">${orig}</div><div class="enc">${enc}</div>`;
        mapEl.appendChild(cell);
      }
    }

    function applyShift(shift) {
      currentShift = ((shift % 26) + 26) % 26;
      document.getElementById('shift-display').textContent = currentShift;
      const decoded = caesarDecode(CIPHER_ENCODED, currentShift);
      document.getElementById('cipher-output').textContent = decoded;

      const submitBtn = document.getElementById('cipher-submit');
      // Check if decoded matches plaintext (case insensitive, spaces normalized)
      const clean = s => s.toUpperCase().replace(/\s+/g,' ').trim();
      if (clean(decoded) === clean(CIPHER_PLAINTEXT)) {
        if (!solved) {
          solved = true;
          submitBtn.style.display = 'block';
          AudioManager.play('sfx_found');
          notify('🔓 Повідомлення розшифровано!', 3500);
          Scenes.showStamp('ШИФР ЗЛАМАНО!', '#27ae60');
        }
      } else {
        solved = false;
        submitBtn.style.display = 'none';
      }
    }

    document.getElementById('shift-left').onclick = () => applyShift(currentShift - 1);
    document.getElementById('shift-right').onclick = () => applyShift(currentShift + 1);

    document.getElementById('cipher-key').addEventListener('input', (e) => {
      const key = e.target.value.toUpperCase().trim();
      if (!key) { applyShift(0); return; }
      // Shift = position of first letter (A=1, B=2, ..., but use 1-indexed: C=3)
      const shift = key.charCodeAt(0) - 64; // A=1, C=3, etc.
      applyShift(shift);
    });

    document.getElementById('cipher-key').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const key = e.target.value.toUpperCase().trim();
        if (key === CIPHER_KEY) {
          applyShift(CIPHER_SHIFT);
        }
      }
    });

    document.getElementById('cipher-submit').onclick = () => {
      AudioManager.play('puzzle_solved');
      Scenes.showStamp('✔ ПЛАН ЗЛОЧИНЦІВ РОЗКРИТО!', '#27ae60');
      setTimeout(onComplete, 2000);
    };
  }


  // ───────────────────────────────────────────────────────
  // PUZZLE 4 — GIT FORENSICS
  // Player must inspect fake git log, find the suspicious commit,
  // identify the culprit email, and name what was leaked.
  // ───────────────────────────────────────────────────────

  function initTriage(container, onComplete) {
    const SUSPICIOUS_HASH = 'a4f7c2e';
    const SUSPICIOUS_LEAK = 'Скриншот приватної переписки з клієнтом + контактний номер телефону';

    const villain = getVillain(0);
    const villainEmail = villain
      ? (villain.nameEn.toLowerCase() + '.2025@corp-internal.ua')
      : 'user.2025@corp-internal.ua';

    // Distractor emails from non-villain characters
    const distractorIds = Object.keys(CHARACTERS).filter(id => !GameState.villains.includes(id));
    const shuffledDistractors = [...distractorIds].sort(() => Math.random() - 0.5);
    const emailOptions = [
      villainEmail,
      shuffledDistractors[0] + '@corp-internal.ua',
      shuffledDistractors[1] + '@corp-internal.ua',
      shuffledDistractors[2] + '@corp-internal.ua',
    ].sort(() => Math.random() - 0.5);

    const LEAK_OPTIONS = [
      SUSPICIOUS_LEAK,
      'Паролі адміністраторів та хеші сесій',
      'Вихідний код пропрієтарного платіжного модуля',
      'Перелік IP-адрес та токени внутрішньої мережі',
    ].sort(() => Math.random() - 0.5);

    const COMMITS = [
      { hash: '3b8a19f', author: 'aramais@corp-internal.ua', date: '2025-10-10 09:15', msg: 'init: project setup' },
      { hash: '91fe22d', author: 'taras@corp-internal.ua',   date: '2025-10-10 11:02', msg: 'feat: add login flow' },
      { hash: 'c5d3877', author: 'zheka@corp-internal.ua',   date: '2025-10-11 09:44', msg: 'fix: resolve merge conflict' },
      { hash: '7a1bc90', author: 'efim@corp-internal.ua',    date: '2025-10-11 14:28', msg: 'style: update color palette' },
      { hash: SUSPICIOUS_HASH, author: villainEmail,          date: '2025-10-12 01:17', msg: 'fix: remove unused assets' },
      { hash: 'e2094bf', author: 'aramais@corp-internal.ua', date: '2025-10-12 09:33', msg: 'docs: update README' },
      { hash: 'f81a3c2', author: 'anya@corp-internal.ua',    date: '2025-10-12 11:05', msg: 'feat: add user profile page' },
      { hash: '2d9e5a1', author: 'zheka@corp-internal.ua',   date: '2025-10-13 15:22', msg: 'test: add unit tests for auth' },
      { hash: 'bc47d03', author: 'ivan@corp-internal.ua',    date: '2025-10-13 02:47', msg: 'chore: bump dependencies' },
      { hash: '88f1099', author: 'efim@corp-internal.ua',    date: '2025-10-14 10:08', msg: 'hotfix: typo in error message' },
    ];

    const DIFFS = {
      '3b8a19f': `<span class="gd-add">+ README.md</span>\n<span class="gd-add">+ package.json</span>\n<span class="gd-add">+ src/index.js</span>`,
      '91fe22d': `<span class="gd-file">src/auth.js</span>\n<span class="gd-add">+ function login(user, pass) {</span>\n<span class="gd-add">+   return fetch('/api/auth', { method: 'POST' });</span>\n<span class="gd-add">+ }</span>`,
      'c5d3877': `<span class="gd-file">src/components/Header.js</span>\n<span class="gd-rem">- import { OldNav } from './nav';</span>\n<span class="gd-add">+ import { Nav } from './navigation';</span>`,
      '7a1bc90': `<span class="gd-file">styles/vars.css</span>\n<span class="gd-rem">- --primary: #336699;</span>\n<span class="gd-add">+ --primary: #1a3a5c;</span>\n<span class="gd-rem">- --accent: #ff9900;</span>\n<span class="gd-add">+ --accent: #f0a500;</span>`,
      [SUSPICIOUS_HASH]: `<span class="gd-file">assets/manifest.json</span>\n<span class="gd-ctx">  "screenshots": [</span>\n<span class="gd-ctx">    "demo_public_v1.png",</span>\n<span class="gd-ctx">    "demo_public_v2.png",</span>\n<span class="gd-add">+   "client_private_demo_2025-10-12.png",</span>\n<span class="gd-add">+   "priv_contact_UA_+38063XXXXXXX.txt"</span>\n<span class="gd-ctx">  ],</span>\n\n<span class="gd-file">src/utils/cleanup.js</span>\n<span class="gd-rem">- // TODO: remove temp exports</span>\n<span class="gd-add">+ export { clientDemoData, contactSheet };</span>`,
      'e2094bf': `<span class="gd-file">README.md</span>\n<span class="gd-add">+ ## Deployment</span>\n<span class="gd-add">+ Run \`npm start\` to launch the dev server.</span>`,
      'f81a3c2': `<span class="gd-file">src/pages/Profile.js</span>\n<span class="gd-add">+ export default function ProfilePage() {</span>\n<span class="gd-add">+   return &lt;div className="profile"&gt;&lt;/div&gt;;</span>\n<span class="gd-add">+ }</span>`,
      '2d9e5a1': `<span class="gd-file">tests/auth.test.js</span>\n<span class="gd-add">+ describe('login', () => {</span>\n<span class="gd-add">+   it('should return 200 on valid credentials', () => {</span>\n<span class="gd-add">+     expect(login('test','pass')).resolves.toBe(200);</span>\n<span class="gd-add">+   });</span>\n<span class="gd-add">+ });</span>`,
      'bc47d03': `<span class="gd-file">package.json</span>\n<span class="gd-rem">- "react": "^18.2.0",</span>\n<span class="gd-add">+ "react": "^18.3.1",</span>\n<span class="gd-rem">- "webpack": "^5.88.0",</span>\n<span class="gd-add">+ "webpack": "^5.94.0",</span>`,
      '88f1099': `<span class="gd-file">src/utils/errors.js</span>\n<span class="gd-rem">- throw new Error('Authentification failed');</span>\n<span class="gd-add">+ throw new Error('Authentication failed');</span>`,
    };

    let openHash   = null;
    let answeredHash  = false;
    let answeredEmail = false;
    let answeredLeak  = false;
    let attempts = 0;

    container.innerHTML = `
      <div class="gitlog-puzzle">
        <div class="gitlog-left">
          <div class="gitlog-header">
            <span class="gitlog-cmd">$ git log --all --oneline</span>
            <span class="gitlog-repo">repo: client-portal-v2</span>
          </div>
          <div class="gitlog-list" id="gitlog-list"></div>
        </div>
        <div class="gitlog-right">
          <div class="gitlog-report-title">🔬 ЗВІТ КРИМІНАЛІСТА</div>
          <div class="gitlog-report-desc">
            Знайди підозрілий коміт, що злив приватні дані.<br>
            Відкривай коміти, читай diff, заповни форму.
          </div>
          <div class="gitlog-field">
            <label class="gitlog-label">ХЕШ ПІДОЗРІЛОГО КОМІТУ</label>
            <input class="gitlog-hash-input" id="gf-hash" placeholder="7 символів..." maxlength="7" autocomplete="off">
          </div>
          <div class="gitlog-field">
            <label class="gitlog-label">EMAIL АВТОРА</label>
            <div class="gitlog-options" id="gf-emails">
              ${emailOptions.map((e, i) => `
                <label class="gitlog-option">
                  <input type="radio" name="gf-email" value="${e}"> <span>${e}</span>
                </label>`).join('')}
            </div>
          </div>
          <div class="gitlog-field">
            <label class="gitlog-label">ЩО БУЛО ЗЛИТО?</label>
            <div class="gitlog-options" id="gf-leaks">
              ${LEAK_OPTIONS.map((l, i) => `
                <label class="gitlog-option">
                  <input type="radio" name="gf-leak" value="${l}"> <span>${l}</span>
                </label>`).join('')}
            </div>
          </div>
          <button class="btn-primary" id="gf-submit" style="width:100%;margin-top:16px;">
            ✔ ПІДТВЕРДИТИ ВИСНОВКИ
          </button>
          <div id="gf-result" style="margin-top:12px;font-size:13px;line-height:1.6;min-height:36px;"></div>
        </div>
      </div>
    `;

    // Render commit list
    const listEl = document.getElementById('gitlog-list');
    COMMITS.forEach(commit => {
      const row = document.createElement('div');
      row.className = 'gitlog-row';
      row.id = 'gitrow-' + commit.hash;
      row.innerHTML = `
        <div class="gitlog-row-summary">
          <span class="gitlog-hash">${commit.hash}</span>
          <span class="gitlog-date">${commit.date}</span>
          <span class="gitlog-msg">${commit.msg}</span>
        </div>
        <div class="gitlog-diff hidden" id="diff-${commit.hash}">
          <div class="gitlog-diff-author">Author: ${commit.author}</div>
          <pre class="gitlog-diff-body">${DIFFS[commit.hash] || '( no diff available )'}</pre>
        </div>
      `;
      row.querySelector('.gitlog-row-summary').onclick = () => {
        const diffEl = document.getElementById('diff-' + commit.hash);
        const isOpen = !diffEl.classList.contains('hidden');
        // Close any open diff
        document.querySelectorAll('.gitlog-diff').forEach(d => d.classList.add('hidden'));
        document.querySelectorAll('.gitlog-row').forEach(r => r.classList.remove('open'));
        if (!isOpen) {
          diffEl.classList.remove('hidden');
          row.classList.add('open');
          AudioManager.play('sfx_click');
        }
        openHash = isOpen ? null : commit.hash;
      };
      listEl.appendChild(row);
    });

    document.getElementById('gf-submit').onclick = () => {
      const hashVal  = (document.getElementById('gf-hash').value || '').trim().toLowerCase();
      const emailVal = document.querySelector('input[name="gf-email"]:checked')?.value || '';
      const leakVal  = document.querySelector('input[name="gf-leak"]:checked')?.value || '';

      if (!hashVal || !emailVal || !leakVal) {
        notify('Заповни всі три поля перед підтвердженням!');
        return;
      }

      attempts++;

      const hashOk  = hashVal === SUSPICIOUS_HASH;
      const emailOk = emailVal === villainEmail;
      const leakOk  = leakVal === SUSPICIOUS_LEAK;

      const resultEl = document.getElementById('gf-result');

      if (hashOk && emailOk && leakOk) {
        resultEl.style.color = 'var(--green-ok)';
        resultEl.innerHTML = '✔ ХЕШ: ВІРНО &nbsp; ✔ EMAIL: ВІРНО &nbsp; ✔ ВИТІК: ВІРНО';
        AudioManager.play('puzzle_solved');
        Scenes.showStamp('✔ КОМІТ ЗНАЙДЕНО. СПРАВУ ЗАКРИТО.', '#27ae60');
        setTimeout(() => Scenes.showStamp('git blame — ЗАВЕРШЕНО.', CHARACTERS.taras.color), 900);
        setTimeout(onComplete, 3000);
      } else {
        AudioManager.play('sfx_error');
        const parts = [];
        if (!hashOk)  parts.push('✖ ХЕШ: НЕВІРНО');
        else          parts.push('✔ ХЕШ: ВІРНО');
        if (!emailOk) parts.push('✖ EMAIL: НЕВІРНО');
        else          parts.push('✔ EMAIL: ВІРНО');
        if (!leakOk)  parts.push('✖ ВИТІК: НЕВІРНО');
        else          parts.push('✔ ВИТІК: ВІРНО');
        resultEl.style.color = 'var(--red-alert)';
        resultEl.innerHTML = parts.join(' &nbsp; ');
        notify('Перевір всі три поля. Помилок у розслідуванні не буває.');
      }
    };
  }

  // ───────────────────────────────────────────────────────
  // PUBLIC API
  // ───────────────────────────────────────────────────────

  return {
    initEXIF:   initEXIF,
    initLogs:   initLogs,
    initCipher: initCipher,
    initTriage: initTriage,
  };

})();

window.Puzzles = Puzzles;
