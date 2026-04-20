#!/usr/bin/env python3
"""
batch_sadtalker.py — Run SadTalker for all characters, with proper ffmpeg handling.
Renders one character at a time, merges video+audio via imageio-ffmpeg, logs progress.
"""
import os
import sys
import glob
import time
import shutil
import subprocess

GAME_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_PYTHON = os.path.join(GAME_DIR, '.sadtalker-venv', 'bin', 'python3')
SADTALKER_DIR = os.path.join(GAME_DIR, 'SadTalker')
PORTRAITS_DIR = os.path.join(GAME_DIR, 'assets', 'portraits')
AUDIO_DIR = os.path.join(GAME_DIR, 'assets', 'audio', 'tts')
VIDEO_OUT_DIR = os.path.join(GAME_DIR, 'assets', 'video', 'portraits')
RESULT_DIR = os.path.join(SADTALKER_DIR, 'results')
LOG = '/tmp/sadtalker_run.log'

# Get ffmpeg from imageio_ffmpeg
import imageio_ffmpeg
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Add venv bin to PATH for ffprobe symlink
os.environ['PATH'] = os.path.join(GAME_DIR, '.sadtalker-venv', 'bin') + ':' + os.environ.get('PATH', '')

ALL_CHARS = ['aramais', 'taras', 'zheka', 'efim', 'ivan',
             'anya', 'vitya', 'inessa', 'misha', 'sasha']

chars = sys.argv[1:] if len(sys.argv) > 1 else ALL_CHARS

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, 'a') as f:
        f.write(line + '\n')

def merge_video_audio(temp_video, audio_path, output_path):
    """Merge temp video (no audio) with audio file using ffmpeg."""
    cmd = [
        FFMPEG, '-y', '-nostdin',
        '-i', temp_video,
        '-i', audio_path,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-shortest',
        '-movflags', '+faststart',
        output_path
    ]
    proc = subprocess.run(
        cmd,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
        timeout=60
    )
    if proc.returncode != 0:
        log(f'  ffmpeg error: {proc.stderr[-200:] if proc.stderr else "no stderr"}')
    return proc.returncode == 0

def run_sadtalker(char_id):
    """Run SadTalker inference for one character."""
    portrait = os.path.join(PORTRAITS_DIR, f'{char_id}.jpg')
    audio = os.path.join(AUDIO_DIR, f'{char_id}.mp3')
    output = os.path.join(VIDEO_OUT_DIR, f'{char_id}_talk_local.mp4')

    if not os.path.exists(portrait):
        log(f'{char_id}: SKIP - no portrait')
        return False
    if not os.path.exists(audio):
        log(f'{char_id}: SKIP - no audio')
        return False
    if os.path.exists(output):
        size = os.path.getsize(output) // 1024
        log(f'{char_id}: EXISTS ({size} KB)')
        return True

    log(f'{char_id}: starting inference...')
    t0 = time.time()

    cmd = [
        VENV_PYTHON,
        os.path.join(SADTALKER_DIR, 'inference.py'),
        '--driven_audio', audio,
        '--source_image', portrait,
        '--result_dir', RESULT_DIR,
        '--still',
        '--preprocess', 'full',
        '--size', '256',
        '--expression_scale', '1.0',
    ]

    proc = subprocess.run(
        cmd, cwd=SADTALKER_DIR,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    elapsed = time.time() - t0
    log(f'{char_id}: inference done in {elapsed:.0f}s (exit={proc.returncode})')

    # Look for final output video first
    finals = sorted(
        glob.glob(os.path.join(RESULT_DIR, '**', '*.mp4'), recursive=True),
        key=os.path.getmtime, reverse=True
    )
    # Filter out temp files
    finals = [f for f in finals if 'temp_' not in os.path.basename(f)]

    if finals:
        shutil.move(finals[0], output)
        size = os.path.getsize(output) // 1024
        log(f'{char_id}: OK {size} KB (full pipeline)')
        return True

    # If no final video, look for temp video and merge with audio
    temps = sorted(
        glob.glob(os.path.join(RESULT_DIR, '**', f'temp_{char_id}*.mp4'), recursive=True),
        key=os.path.getmtime, reverse=True
    )

    if temps:
        log(f'{char_id}: merging temp video + audio...')
        if merge_video_audio(temps[0], audio, output):
            size = os.path.getsize(output) // 1024
            log(f'{char_id}: OK {size} KB (merged)')
            return True
        else:
            log(f'{char_id}: FAIL - merge failed')
            return False

    # Debug: show last lines of stderr
    if proc.stderr:
        log(f'{char_id}: FAIL - {proc.stderr[-200:]}')
    return False


def main():
    with open(LOG, 'w') as f:
        f.write(f'SadTalker batch - {time.strftime("%Y-%m-%d %H:%M:%S")}\n')
        f.write(f'Characters: {", ".join(chars)}\n\n')

    os.makedirs(VIDEO_OUT_DIR, exist_ok=True)
    results = []

    for i, char_id in enumerate(chars, 1):
        log(f'--- [{i}/{len(chars)}] {char_id} ---')
        ok = run_sadtalker(char_id)
        results.append((char_id, ok))

    log('\n=== SUMMARY ===')
    for char_id, ok in results:
        status = 'OK' if ok else 'FAIL'
        log(f'  {char_id}: {status}')

    ok_count = sum(1 for _, ok in results if ok)
    log(f'\n{ok_count}/{len(results)} videos generated')
    log('ALL_DONE')


if __name__ == '__main__':
    main()
