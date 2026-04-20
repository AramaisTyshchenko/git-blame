#!/usr/bin/env python3
"""Merge SadTalker temp video with audio using imageio-ffmpeg's bundled ffmpeg."""
import os
import sys
import subprocess

GAME_DIR = os.path.dirname(os.path.abspath(__file__))
VENV = os.path.join(GAME_DIR, '.sadtalker-venv', 'bin', 'python3')

# Get ffmpeg path from imageio-ffmpeg
result = subprocess.run(
    [VENV, '-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],
    capture_output=True, text=True
)
FFMPEG = result.stdout.strip()
print(f"Using ffmpeg: {FFMPEG}")

# Find temp video
import glob
temps = glob.glob(os.path.join(GAME_DIR, 'SadTalker', 'results', '**', 'temp_*.mp4'), recursive=True)
if not temps:
    print("No temp videos found!")
    sys.exit(1)

for temp_path in temps:
    # Extract character name from filename: temp_aramais##aramais.mp4
    basename = os.path.basename(temp_path)
    char_id = basename.split('##')[0].replace('temp_', '')
    
    audio_path = os.path.join(GAME_DIR, 'assets', 'audio', 'tts', f'{char_id}.mp3')
    output_path = os.path.join(GAME_DIR, 'assets', 'video', 'portraits', f'{char_id}_talk_local.mp4')
    
    if not os.path.exists(audio_path):
        print(f"  {char_id}: no audio found at {audio_path}")
        continue
    
    print(f"  Merging {char_id}: video + audio...")
    
    cmd = [
        FFMPEG,
        '-y',
        '-i', temp_path,
        '-i', audio_path,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-shortest',
        '-movflags', '+faststart',
        output_path
    ]
    
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode == 0 and os.path.exists(output_path):
        size = os.path.getsize(output_path) // 1024
        print(f"  OK: {output_path} ({size} KB)")
    else:
        print(f"  ERROR: {proc.stderr[-300:] if proc.stderr else 'unknown'}")

print("Done!")
