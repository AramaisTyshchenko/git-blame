# 🕵️ GIT BLAME — AI Detective Visual Novel

[![Live Demo](https://img.shields.io/badge/▶_Play_Now-Live_Demo-FF6B6B?style=for-the-badge)](https://aramaistyshchenko.github.io/git-blame)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Telegram Mini App](https://img.shields.io/badge/Telegram_Mini_App-2CA5E0?style=flat&logo=telegram)](https://core.telegram.org/bots/webapps)
[![SadTalker](https://img.shields.io/badge/SadTalker-AI_Video-FF6B6B?style=flat)](https://github.com/OpenTalker/SadTalker)
[![GFPGAN](https://img.shields.io/badge/GFPGAN-Face_Restoration-orange?style=flat)](https://github.com/TencentARC/GFPGAN)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)

> **A personalised 5-act detective game** — built as a birthday gift for an 8-person Ukrainian IT team celebrating 5 years together. Two ex-members who had betrayed the group are the villains. Players must investigate and expose them.

---

## The Story

Five years ago, a Telegram group of Ukrainian developers came together. Last year, two members blackmailed the group and were expelled.

*GIT BLAME* fictionalises these real events as a detective thriller. On each playthrough, two suspects are **randomly selected** from the character pool — so the villain could be anyone. Players navigate 5 acts of dialogue, evidence, and confrontation to unmask the traitors.

Built solo in Ukrainian for a real audience. Every character is a real person from the group, with an AI-animated portrait and a TTS voice.

---

## Screenshots

*← Place a GIF of gameplay here (screen record the game and add it to `assets/`)*

---

## AI Pipeline

Every character portrait in the game is fully AI-animated:

| Step | Tool | Output |
|---|---|---|
| 1. Source portrait photo | Real photo of team member | Static image |
| 2. Face restoration | [GFPGAN](https://github.com/TencentARC/GFPGAN) | Enhanced portrait |
| 3. Talking-head video | [SadTalker](https://github.com/OpenTalker/SadTalker) | Animated face video |
| 4. Voice synthesis | TTS (`gen_audio.py`) | Character audio |
| 5. Merge | FFmpeg (`merge_video_audio.py`) | Final `.mp4` per character |
| 6. In-game playback | HTML5 `<video>` | Dialogue scenes |

Batch generation is fully automated via `batch_sadtalker.py` — one command generates all character videos for a given list of names.

---

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 — zero framework dependencies
- **Game mechanics**: `src/game.js`, `src/scenes.js`, `src/dialogue.js`, `src/puzzles.js`
- **Character animation**: `src/portrait-animator.js`, `src/video-portrait.js`
- **Save system**: `localStorage` — players resume where they left off
- **Telegram integration**: Telegram Mini App SDK — runs directly inside a Telegram chat
- **AI asset pipeline**: Python scripts (`batch_sadtalker.py`, `gen_audio.py`, `merge_video_audio.py`, `detect_faces.py`)

---

## Run Locally

```bash
# Clone and serve
git clone https://github.com/AramaisTyshchenko/git-blame.git
cd git-blame
python3 -m http.server 8080
# Open http://localhost:8080
```

The game runs entirely in the browser — no build step, no bundler, no backend.

---

## Generate AI Character Assets

```bash
# Set up SadTalker environment
cd SadTalker
pip install -r requirements.txt

# Batch generate talking-head videos for all characters
bash run_sadtalker_bg.sh taras zheka efim ivan anya vitya inessa misha sasha

# Merge video + audio for each character
python merge_video_audio.py
```

Source portraits go in `assets/portraits/`, TTS audio in `assets/audio/tts/`, and final videos are output to `assets/video/portraits/`.

---

## Project Structure

```
git-blame/
├── index.html                # Game entry point
├── styles.css
├── src/
│   ├── game.js               # Core game loop, state, act progression
│   ├── scenes.js             # 5-act scene definitions
│   ├── dialogue.js           # Dialogue engine
│   ├── puzzles.js            # Evidence triage puzzle
│   ├── portrait-animator.js  # Character animation controller
│   └── video-portrait.js     # AI video portrait playback
├── assets/
│   ├── portraits/            # Character still images
│   ├── audio/tts/            # TTS voice lines
│   ├── video/portraits/      # SadTalker-generated videos
│   └── backgrounds/          # AI-generated scene backgrounds
├── SadTalker/                # Talking-head video generation
├── batch_sadtalker.py        # Batch video generation pipeline
├── gen_audio.py              # TTS audio generation
├── merge_video_audio.py      # FFmpeg video/audio merge
└── detect_faces.py           # Face detection & alignment
```

---

## Features

- **Randomised villain system** — 2 of N characters are secretly designated as culprits at game start; each playthrough can differ
- **5 acts** — Introduction, Investigation, Confrontation, Evidence, Verdict
- **AI talking portraits** — every character has a talking-head video generated from a real photo
- **Evidence puzzle** — slot-based fact-triage mechanic to identify the traitors
- **Telegram Mini App** — distributable directly inside a Telegram chat, no install required
- **LocalStorage saves** — resume progress across sessions
- **Ukrainian language** — fully localised for the target audience

---

*Built solo · April 2025 · Ukrainian IT team 5th anniversary*  
*Contact: [tishchenko.a.v@gmail.com](mailto:tishchenko.a.v@gmail.com)*
