# GIT BLAME — Asset Generation Guide

All assets go in specific subfolders. The game works without them (SVG placeholders are shown),
but the real AI-generated assets make it shine.

---

## Directory Structure

```
assets/
├── portraits/          ← Character portraits (PNG, 256×256 or 512×512)
│   ├── aramais.png
│   ├── aramais_worried.png
│   ├── aramais_determined.png
│   ├── taras.png
│   ├── taras_reading.png
│   ├── taras_unimpressed.png
│   ├── zheka.png
│   ├── zheka_focused.png
│   ├── efim.png
│   ├── efim_precise.png
│   ├── ivan.png
│   ├── ivan_enthusiastic.png
│   ├── anya.png
│   ├── anya_sharp.png
│   ├── vitya.png
│   ├── vitya_patriotic.png
│   ├── inessa.png
│   └── inessa_knowing.png
├── backgrounds/        ← Scene backgrounds (JPG, 1280×720 or 1920×1080)
│   ├── warroom.jpg
│   ├── warroom_party.jpg
│   ├── terminal.jpg
│   ├── villain_forum.jpg
│   ├── bug_tracker.jpg
│   └── dark_void.jpg
├── audio/              ← Music tracks (MP3, 128-192kbps)
│   ├── main_theme.mp3
│   ├── investigation.mp3
│   ├── villain_theme.mp3
│   ├── finale.mp3
│   └── cossacks_bgm.mp3
└── sfx/                ← Sound effects (MP3, short)
    ├── click.mp3
    ├── found.mp3
    ├── error.mp3
    ├── stamp.mp3
    └── chat_notification.mp3
```

---

## Portrait Generation

### Base Style Prompt (append to each character prompt)

```
noir comic book illustration, Ukrainian character, dark blue and amber color palette,
half-shadow dramatic lighting from one side, clean bold lines,
IT office background blurred, head and shoulders only, facing slightly left,
professional portrait style, cel-shaded, muted colors with amber highlight
```

### Character-Specific Prompts (Midjourney / DALL-E 3)

#### Арамаіс (aramais.png — default)
```
30-something Ukrainian man, calm intelligent eyes, slight fatigue, short dark hair,
holding coffee cup, casual business style, dry wit expression,
{{BASE_STYLE}}
```
`.worried` variant: same but eyebrows raised, concerned expression
`.determined` variant: same but jaw set, direct eye contact

#### Тарас (taras.png — default)
```
40+ Ukrainian man, experienced senior engineer look, reading glasses pushed up,
unimpressed default expression, red pen tucked behind ear, open notebook visible,
authoritative presence, {{BASE_STYLE}}
```
`.reading` variant: looking down at notebook, glasses on
`.unimpressed` variant: flat expression, one eyebrow raised

#### Жека (zheka.png — default)
```
30-something Ukrainian man, focused analytical look, slight knowing smirk,
laptop open with sticky notes around the screen, casual professional,
{{BASE_STYLE}}
```

#### Єфім (efim.png — default)
```
30-something Ukrainian man, minimal precise expression, clean desk visible behind,
single monitor, calm controlled posture, minimal aesthetic,
{{BASE_STYLE}}
```

#### Іван (ivan.png — default)
```
Ukrainian man early-to-mid 20s, wide enthusiastic eyes, slightly messy hair,
energy drink can on desk, multiple browser tabs visible in background,
excited look, young engineer vibe, {{BASE_STYLE}}
```
`.enthusiastic` variant: huge smile, hand raised as if shouting

#### Аня (anya.png — default)
```
Beautiful Ukrainian woman 30s, sharp confident expression, holding clipboard
with a checklist, one item circled in red, organized professional,
{{BASE_STYLE}}
```
`.sharp` variant: intense focused look, slightly narrowed eyes, pointing at something

#### Вітя (vitya.png — default)
```
Ukrainian man 30s, animated passionate expression, Ukrainian flag small pin on jacket,
antenna diagram or signal graph visible on whiteboard behind him,
patriotic energy, radio-physics researcher, {{BASE_STYLE}}
```
`.patriotic` variant: standing straight, Ukrainian flag visible, determined proud expression

#### Інеса (inessa.png — default)
```
Beautiful Ukrainian woman 20s, stylish gold jewelry visible, phone in hand,
slightly amused by being in a room full of IT people, elegant but casual,
{{BASE_STYLE}}
```
`.knowing` variant: confident knowing smile, finger raised as if recognizing something

---

## Background Generation

### Base Style (append to each scene prompt)
```
cinematic illustration, dark noir atmosphere, Ukrainian IT office aesthetic,
amber and dark blue color palette, dramatic lighting, high quality,
digital art, subtle CRT scanline texture, moody and atmospheric
```

#### warroom.jpg — Штаб команди
```
cozy dark IT command center, multiple monitors showing dashboards and code,
one monitor showing an old strategy game (Cossacks-era), chat windows,
ambient blue glow, cluttered but comfortable, Ukrainian IT team workspace,
{{BASE_STYLE}}
```

#### warroom_party.jpg — Штаб (ювілей)
```
same IT command center but decorated for a 5-year anniversary party,
"5 YEARS" banner in Ukrainian, subtle balloons, festive but still nerdy,
monitors showing celebration messages, confetti scattered, {{BASE_STYLE}}
```

#### terminal.jpg — Термінал / лог-вьювер
```
dark hacker terminal aesthetic, green text on black screen, multiple terminal windows,
log files scrolling, matrix-like but professional, dark room lit only by screens,
{{BASE_STYLE}}
```

#### villain_forum.jpg — Темний форум
```
deliberately ugly low-tech internet forum interface circa 2005,
grey background, Comic Sans vibe, badly designed website,
late night dim room, cheap laptop, suspicious atmosphere,
{{BASE_STYLE}}
```

#### bug_tracker.jpg — Трекер багів
```
modern bug tracking interface (Jira-parody), warm office lighting,
multiple ticket cards with colorful priority labels, sticky notes everywhere,
organized chaos, QA team workspace atmosphere, {{BASE_STYLE}}
```

#### dark_void.jpg — Чорна порожнеча
```
pure darkness with subtle amber grid lines,
atmospheric black void, cinematic, {{BASE_STYLE}}
```

---

## Music Generation (Suno AI)

Go to: https://suno.com
Use the "Instrumental" style tag to avoid vocals (unless you want Ukrainian lyrics).

### main_theme.mp3 — Головна тема
```
Style: Ukrainian folk jazz noir, instrumental
Prompt: Ukrainian bandura and jazz piano detective theme, hopeful underlying melody,
noir atmosphere, Eastern European folk scales, coffee shop jazz meets spy thriller,
loopable, 60-90 seconds
```

### investigation.mp3 — Розслідування
```
Style: Lo-fi detective, instrumental
Prompt: lo-fi detective investigation beat, slow ambient tempo,
typewriter sounds layered in, dark piano chords, occasional dissonant note,
focused tension without being aggressive, loopable 90-120 seconds
```

### villain_theme.mp3 — Тема злочинців
```
Style: Comedy villain, instrumental
Prompt: bumbling cartoon villain music, minor key tuba and trombone,
slightly out of tune on purpose, sneaky but incompetent energy,
Eastern European folk minor scale, comic timing, loopable 30-60 seconds
```

### finale.mp3 — Фінал (5 років)
```
Style: Celebratory folk-electronic, instrumental
Prompt: uplifting Eastern European folk celebration, builds from solo bandura to full band,
triumphant and warm, Ukrainian folk scale, modern synth elements,
5-year reunion energy, 60-90 seconds finale
```

### cossacks_bgm.mp3 — Козаки міні-гра
```
Style: 8-bit chiptune, instrumental
Prompt: retro 8-bit chiptune battle music, fast tempo,
Ukrainian folk scale melody on chip instruments, defensive arcade game energy,
loopable, 30 seconds
```

### puzzle_solved.mp3 — Пазл вирішено (SFX)
```
Style: Short jingle
Prompt: 3-5 second brass victory fanfare, game show puzzle solved sound,
satisfying and bright, classic game completion jingle
```

---

## Sound Effects (from Freesound.org — free CC0 license)

Search these terms on freesound.org:

| File | Search Term |
|------|------------|
| click.mp3 | "UI click button" (short, under 0.3s) |
| found.mp3 | "evidence found discovery" or "item pickup RPG" |
| error.mp3 | "error buzz negative" (short, 0.5-1s) |
| stamp.mp3 | "rubber stamp document" |
| chat_notification.mp3 | "message notification phone" (Telegram-like) |

Alternatively, generate them with ElevenLabs Sound Effects or Adobe Audition.

---

## Quick Start (Minimal Viable Assets)

For the fastest path to a playable game, generate in this order:

1. **3 portraits** — Aramais (narrator), Taras (guide), villain shadow (reuse any portrait + CSS filter)
2. **2 backgrounds** — warroom, terminal
3. **2 music tracks** — investigation (plays most), puzzle_solved SFX
4. **1 SFX** — click (makes everything feel better)

The game is fully playable without any assets (SVG placeholders cover everything).
Add assets progressively as you generate them.

---

## File Optimization

Before publishing:
- Portraits: `convert input.png -resize 256x256 output.png` (ImageMagick)
- Backgrounds: `jpegoptim --max=85 *.jpg`
- Audio: `ffmpeg -i input.mp3 -b:a 128k output.mp3`

Target sizes:
- Portrait PNG: < 100KB each
- Background JPG: < 300KB each
- Music MP3: < 3MB each
- SFX MP3: < 100KB each

Total game size target: < 30MB (playable over mobile data)
