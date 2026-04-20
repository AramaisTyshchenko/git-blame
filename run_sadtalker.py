#!/usr/bin/env python3
"""Run SadTalker inference for all characters - image + audio -> video."""
import subprocess
import os
import sys
import glob
import shutil
import time

GAME_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_PYTHON = os.path.join(GAME_DIR, '.sadtalker-venv', 'bin', 'python3')
SADTALKER_DIR = os.path.join(GAME_DIR, 'SadTalker')
INFERENCE_SCRIPT = os.path.join(SADTALKER_DIR, 'inference.py')
PORTRAITS_DIR = os.path.join(GAME_DIR, 'assets', 'portraits')
AUDIO_DIR = os.path.join(GAME_DIR, 'assets', 'audio', 'tts')
VIDEO_OUT_DIR = os.path.join(GAME_DIR, 'assets', 'video', 'portraits')
RESULT_DIR = os.path.join(SADTALKER_DIR, 'results')

CHARACTERS = sys.argv[1:] if len(sys.argv) > 1 else [
    'aramais', 'taras', 'zheka', 'efim', 'ivan',
    'anya', 'vitya', 'inessa', 'misha', 'sasha'
]

os.makedirs(VIDEO_OUT_DIR, exist_ok=True)

print(f"SadTalker inference for {len(CHARACTERS)} characters")
print(f"Using: {VENV_PYTHON}")
print()

for i, char_id in enumerate(CHARACTERS, 1):
    portrait = os.path.join(PORTRAITS_DIR, f'{char_id}.jpg')
    audio = os.path.join(AUDIO_DIR, f'{char_id}.mp3')
    output = os.path.join(VIDEO_OUT_DIR, f'{char_id}_talk_local.mp4')

    if not os.path.exists(portrait):
        print(f"[{i}/{len(CHARACTERS)}] {char_id}: SKIP - no portrait")
        continue
    if not os.path.exists(audio):
        print(f"[{i}/{len(CHARACTERS)}] {char_id}: SKIP - no audio")
        continue
    if os.path.exists(output):
        print(f"[{i}/{len(CHARACTERS)}] {char_id}: EXISTS ({os.path.getsize(output) // 1024} KB)")
        continue

    print(f"[{i}/{len(CHARACTERS)}] {char_id}: generating...", flush=True)
    t0 = time.time()

    cmd = [
        VENV_PYTHON, INFERENCE_SCRIPT,
        '--driven_audio', audio,
        '--source_image', portrait,
        '--result_dir', RESULT_DIR,
        '--still',                  # Minimal head motion (photo)
        '--preprocess', 'full',     # Full frame (no face crop = faster)
        '--size', '256',            # 256px face output
        '--expression_scale', '1.0',
    ]

    try:
        proc = subprocess.run(
            cmd, cwd=SADTALKER_DIR,
            capture_output=True, text=True, timeout=600
        )

        if proc.returncode != 0:
            print(f"  ERROR: {proc.stderr[-500:] if proc.stderr else 'unknown'}")
            continue

        # Find generated video
        candidates = sorted(
            glob.glob(os.path.join(RESULT_DIR, '**', '*.mp4'), recursive=True),
            key=os.path.getmtime, reverse=True
        )

        if candidates:
            shutil.move(candidates[0], output)
            elapsed = time.time() - t0
            size_kb = os.path.getsize(output) // 1024
            print(f"  OK: {size_kb} KB, {elapsed:.0f}s")
        else:
            print(f"  ERROR: no output video found")
            if proc.stdout:
                print(f"  stdout: ...{proc.stdout[-300:]}")

    except subprocess.TimeoutExpired:
        print(f"  TIMEOUT (>300s)")
    except Exception as e:
        print(f"  ERROR: {e}")

print("\nDone!")
