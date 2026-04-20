#!/usr/bin/env python3
"""Merge all SadTalker temp videos with their audio tracks."""
import os
import sys
import glob
import subprocess
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
BASE = os.path.dirname(os.path.abspath(__file__))
RESULTS = os.path.join(BASE, 'SadTalker', 'results')
AUDIO_DIR = os.path.join(BASE, 'assets', 'audio', 'tts')
VIDEO_DIR = os.path.join(BASE, 'assets', 'video', 'portraits')

os.makedirs(VIDEO_DIR, exist_ok=True)

# Find all temp mp4 files
temps = glob.glob(os.path.join(RESULTS, '**', 'temp_*.mp4'), recursive=True)
print(f"Found {len(temps)} temp videos")

for temp in sorted(temps):
    fname = os.path.basename(temp)
    # Extract char_id: temp_zheka##zheka.mp4 -> zheka
    char_id = fname.replace('temp_', '').split('#')[0].split('.')[0]
    
    output = os.path.join(VIDEO_DIR, f'{char_id}_talk_local.mp4')
    audio = os.path.join(AUDIO_DIR, f'{char_id}.mp3')
    
    if os.path.exists(output):
        size = os.path.getsize(output) // 1024
        print(f"  {char_id}: already exists ({size} KB)")
        continue
    
    if not os.path.exists(audio):
        print(f"  {char_id}: no audio file, skipping")
        continue
    
    print(f"  {char_id}: merging {fname} + audio...", end=' ', flush=True)
    
    cmd = [
        FFMPEG, '-y',
        '-i', temp,
        '-i', audio,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-shortest',
        '-movflags', '+faststart',
        output
    ]
    
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if proc.returncode == 0 and os.path.exists(output):
            size = os.path.getsize(output) // 1024
            print(f"OK ({size} KB)")
        else:
            print(f"FAILED (exit={proc.returncode})")
            if proc.stderr:
                print(f"    stderr: {proc.stderr[-300:]}")
    except subprocess.TimeoutExpired:
        print("TIMEOUT")

# Summary
print("\nAll local videos:")
for f in sorted(glob.glob(os.path.join(VIDEO_DIR, '*_talk_local.mp4'))):
    size = os.path.getsize(f) // 1024
    print(f"  {os.path.basename(f)}: {size} KB")
