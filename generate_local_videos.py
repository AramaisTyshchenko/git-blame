#!/usr/bin/env python3
"""
generate_local_videos.py — Generate talking-head videos locally with SadTalker

Fully local & free — no API keys needed. Uses:
  - edge-tts (Microsoft Edge TTS, free) for Ukrainian voice audio
  - SadTalker (open-source) for face animation from audio

Pipeline:
  1. Create a Python venv with PyTorch + SadTalker + edge-tts
  2. Download SadTalker model checkpoints (~1.5GB, one-time)
  3. Generate Ukrainian TTS audio per character
  4. Run SadTalker inference: portrait image + audio → talking video
  5. Output to assets/video/portraits/{charId}_talk_local.mp4

Hardware: Apple M1 Pro detected — uses MPS (Metal) acceleration.
Time estimate: ~2-3 min per character, ~25 min total for 10 characters.

Usage:
  python3 generate_local_videos.py                     # All characters
  python3 generate_local_videos.py --characters aramais taras
  python3 generate_local_videos.py --use-local         # Replace D-ID with local
  python3 generate_local_videos.py --compare            # Keep both, side by side

Requirements: macOS with Python 3.9+, ~5GB free disk space
"""

import argparse
import os
import subprocess
import sys
import shutil

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_DIR = os.path.join(SCRIPT_DIR, '.sadtalker-venv')
SADTALKER_DIR = os.path.join(SCRIPT_DIR, 'SadTalker')
AUDIO_DIR = os.path.join(SCRIPT_DIR, 'assets', 'audio', 'tts')
PORTRAITS_DIR = os.path.join(SCRIPT_DIR, 'assets', 'portraits')
VIDEO_OUT_DIR = os.path.join(SCRIPT_DIR, 'assets', 'video', 'portraits')

CHARACTERS = [
    'aramais', 'taras', 'zheka', 'efim', 'ivan',
    'anya', 'vitya', 'inessa', 'misha', 'sasha'
]

# Ukrainian text for each character (same phrases as D-ID for comparison)
TALK_PHRASES = {
    'aramais': 'Хтось злив наше репо. Ми маємо знайти хто це зробив.',
    'taras':   'Я бачив таке двадцять років тому. Нічого нового.',
    'zheka':   'Подивіться на ці логи. Тут є щось дуже підозріле.',
    'efim':    'Факти говорять самі за себе. Дайте мені хвилину.',
    'ivan':    'Я написав скрипт для аналізу. Зараз покажу результати.',
    'anya':    'Зачекайте. Я помітила щось що всі пропустили.',
    'vitya':   'Це як радіосигнал. Треба знайти джерело перешкод.',
    'inessa':  'У продажах золота теж бувають шахраї, я знаю як їх впіймати.',
    'misha':   'Ви нічого не доведете. Це все непорозуміння.',
    'sasha':   'Ми просто хотіли справедливості. Нічого особистого.',
}

# Voice IDs for edge-tts (Microsoft Edge, same voices as D-ID)
VOICE_MAP = {
    'aramais': 'uk-UA-OstapNeural',
    'taras':   'uk-UA-OstapNeural',
    'zheka':   'uk-UA-OstapNeural',
    'efim':    'uk-UA-OstapNeural',
    'ivan':    'uk-UA-OstapNeural',
    'anya':    'uk-UA-PolinaNeural',
    'vitya':   'uk-UA-OstapNeural',
    'inessa':  'uk-UA-PolinaNeural',
    'misha':   'uk-UA-OstapNeural',
    'sasha':   'uk-UA-OstapNeural',
}


def run(cmd, cwd=None, check=True, capture=False):
    """Run a shell command with nice output."""
    if isinstance(cmd, str):
        cmd = cmd.split()
    print(f"  $ {' '.join(cmd[:6])}{'...' if len(cmd) > 6 else ''}")
    kwargs = dict(cwd=cwd, check=check)
    if capture:
        kwargs['capture_output'] = True
        kwargs['text'] = True
    return subprocess.run(cmd, **kwargs)


def venv_python():
    return os.path.join(VENV_DIR, 'bin', 'python3')


def venv_pip():
    return os.path.join(VENV_DIR, 'bin', 'pip3')


def step_create_venv():
    """Step 1: Create virtual environment with required packages."""
    print("\n━━━ STEP 1: Virtual Environment ━━━")

    if os.path.exists(venv_python()):
        print("  ✓ Venv already exists")
        # Check if key packages are installed
        result = run([venv_python(), '-c', 'import torch; import edge_tts'],
                     check=False, capture=True)
        if result.returncode == 0:
            print("  ✓ All packages installed")
            return True

    print("  Creating venv...")
    run([sys.executable, '-m', 'venv', VENV_DIR])

    print("  Installing PyTorch (MPS-enabled)...")
    run([venv_pip(), 'install', '--upgrade', 'pip'])
    run([venv_pip(), 'install', 'torch', 'torchvision', 'torchaudio'])

    print("  Installing edge-tts...")
    run([venv_pip(), 'install', 'edge-tts'])

    print("  Installing SadTalker dependencies...")
    # Core SadTalker deps
    run([venv_pip(), 'install',
         'numpy', 'scipy', 'opencv-python-headless', 'Pillow',
         'imageio', 'imageio-ffmpeg', 'ffmpeg-python',
         'face-alignment', 'dlib',
         'pyyaml', 'tqdm', 'yacs', 'gfpgan', 'kornia',
         'safetensors', 'gradio',
         ])

    print("  ✓ Venv ready")
    return True


def step_clone_sadtalker():
    """Step 2: Clone SadTalker repo and download checkpoints."""
    print("\n━━━ STEP 2: SadTalker Setup ━━━")

    if os.path.exists(os.path.join(SADTALKER_DIR, 'inference.py')):
        print("  ✓ SadTalker repo already exists")
    else:
        print("  Cloning SadTalker...")
        run(['git', 'clone', '--depth', '1',
             'https://github.com/OpenTalker/SadTalker.git', SADTALKER_DIR])

    # Check for checkpoints
    ckpt_dir = os.path.join(SADTALKER_DIR, 'checkpoints')
    mapping_ckpt = os.path.join(ckpt_dir, 'mapping_00109-model.pth.tar')
    
    if os.path.exists(mapping_ckpt):
        print("  ✓ Checkpoints already downloaded")
        return True

    print("  Downloading checkpoints (~1.5GB)...")
    os.makedirs(ckpt_dir, exist_ok=True)

    # SadTalker provides a download script
    download_script = os.path.join(SADTALKER_DIR, 'scripts', 'download_models.sh')
    if os.path.exists(download_script):
        run(['bash', download_script], cwd=SADTALKER_DIR)
    else:
        # Manual download from HuggingFace
        print("  Downloading from HuggingFace...")
        run([venv_pip(), 'install', 'huggingface_hub'])
        run([venv_python(), '-c',
             'from huggingface_hub import snapshot_download; '
             f'snapshot_download("vinthony/SadTalker", local_dir="{ckpt_dir}")'])

    print("  ✓ Checkpoints ready")
    return True


def step_generate_audio(characters):
    """Step 3: Generate Ukrainian TTS audio for each character using edge-tts."""
    print("\n━━━ STEP 3: Generate TTS Audio ━━━")
    os.makedirs(AUDIO_DIR, exist_ok=True)

    generated = []
    for char_id in characters:
        audio_path = os.path.join(AUDIO_DIR, f'{char_id}.mp3')
        if os.path.exists(audio_path):
            print(f"  ✓ {char_id}: audio exists ({os.path.getsize(audio_path) // 1024} KB)")
            generated.append((char_id, audio_path))
            continue

        text = TALK_PHRASES.get(char_id, 'Привіт, це тест.')
        voice = VOICE_MAP.get(char_id, 'uk-UA-OstapNeural')

        print(f"  🔊 {char_id}: generating audio ({voice})...")

        # Use edge-tts via subprocess since it's async
        run([venv_python(), '-c',
             f'import asyncio, edge_tts; '
             f'async def gen(): '
             f'  c = edge_tts.Communicate("{text}", "{voice}"); '
             f'  await c.save("{audio_path}"); '
             f'asyncio.run(gen())'])

        if os.path.exists(audio_path):
            size_kb = os.path.getsize(audio_path) // 1024
            print(f"  ✓ {char_id}: saved ({size_kb} KB)")
            generated.append((char_id, audio_path))
        else:
            print(f"  ✗ {char_id}: audio generation failed")

    return generated


def step_generate_videos(audio_list, use_local=False):
    """Step 4: Run SadTalker inference — image + audio → video."""
    print("\n━━━ STEP 4: SadTalker Inference ━━━")
    os.makedirs(VIDEO_OUT_DIR, exist_ok=True)

    # Determine output suffix
    suffix = '_talk' if use_local else '_talk_local'

    results = []
    for char_id, audio_path in audio_list:
        portrait_path = os.path.join(PORTRAITS_DIR, f'{char_id}.jpg')
        if not os.path.exists(portrait_path):
            print(f"  ⚠ {char_id}: portrait not found, skipping")
            continue

        output_name = f'{char_id}{suffix}.mp4'
        output_path = os.path.join(VIDEO_OUT_DIR, output_name)

        if os.path.exists(output_path) and not use_local:
            print(f"  ✓ {char_id}: video exists ({os.path.getsize(output_path) // 1024} KB)")
            results.append((char_id, output_path))
            continue

        # If --use-local and D-ID exists, back it up
        did_path = os.path.join(VIDEO_OUT_DIR, f'{char_id}_talk.mp4')
        did_backup = os.path.join(VIDEO_OUT_DIR, f'{char_id}_talk_did.mp4')
        if use_local and os.path.exists(did_path) and not os.path.exists(did_backup):
            print(f"  📦 Backing up D-ID video → {char_id}_talk_did.mp4")
            shutil.copy2(did_path, did_backup)

        print(f"  🎬 {char_id}: running SadTalker inference...")

        # SadTalker inference command
        inference_script = os.path.join(SADTALKER_DIR, 'inference.py')
        result_dir = os.path.join(SADTALKER_DIR, 'results')

        try:
            run([
                venv_python(), inference_script,
                '--driven_audio', audio_path,
                '--source_image', portrait_path,
                '--result_dir', result_dir,
                '--enhancer', 'gfpgan',  # Face enhancement for quality
                '--still',               # Minimal head movement (portrait photo)
                '--preprocess', 'crop',  # Crop to face region
                '--size', '256',         # 256px face output
                '--expression_scale', '1.0',
            ], cwd=SADTALKER_DIR)

            # Find the generated video (SadTalker names them based on input)
            # It creates: results/<timestamp>/<source_name>--<audio_name>.mp4
            import glob
            pattern = os.path.join(result_dir, '**', f'{char_id}*.mp4')
            candidates = sorted(glob.glob(pattern, recursive=True),
                               key=os.path.getmtime, reverse=True)

            if candidates:
                generated_path = candidates[0]
                shutil.move(generated_path, output_path)
                size_kb = os.path.getsize(output_path) // 1024
                print(f"  ✓ {char_id}: done ({size_kb} KB)")
                results.append((char_id, output_path))
            else:
                print(f"  ✗ {char_id}: no output found from SadTalker")

        except subprocess.CalledProcessError as e:
            print(f"  ✗ {char_id}: SadTalker error: {e}")

    return results


def main():
    parser = argparse.ArgumentParser(
        description='Generate talking-head videos locally with SadTalker')
    parser.add_argument('--characters', nargs='*', default=None,
                        help='Generate only for specific characters')
    parser.add_argument('--use-local', action='store_true',
                        help='Replace D-ID videos with local ones (backs up D-ID)')
    parser.add_argument('--compare', action='store_true',
                        help='Generate as *_talk_local.mp4 for A/B comparison')
    parser.add_argument('--skip-setup', action='store_true',
                        help='Skip venv/repo setup (assume already done)')
    parser.add_argument('--audio-only', action='store_true',
                        help='Only generate TTS audio, skip video inference')
    args = parser.parse_args()

    chars = args.characters or CHARACTERS

    print("🎬 SadTalker Local Video Generator")
    print(f"   Characters: {', '.join(chars)}")
    print(f"   Platform: Apple M1 Pro (MPS acceleration)")
    print(f"   Est. time: ~{len(chars) * 2}-{len(chars) * 3} minutes")
    print()

    # Step 1 & 2: Setup
    if not args.skip_setup:
        step_create_venv()
        step_clone_sadtalker()

    # Step 3: Audio
    audio_list = step_generate_audio(chars)
    if not audio_list:
        print("\n✗ No audio files generated. Aborting.")
        return

    print(f"\n  Audio ready: {len(audio_list)}/{len(chars)} characters")

    if args.audio_only:
        print("\n🏁 Audio-only mode — skipping video generation.")
        return

    # Step 4: Video
    results = step_generate_videos(audio_list, use_local=args.use_local)

    # Summary
    print(f"\n{'━' * 50}")
    print(f"🏁 Done! Generated {len(results)}/{len(chars)} videos")
    if results:
        for char_id, path in results:
            size_kb = os.path.getsize(path) // 1024
            print(f"   {char_id}: {os.path.basename(path)} ({size_kb} KB)")

    if args.use_local:
        print("\n   D-ID videos backed up as *_talk_did.mp4")
        print("   Local videos saved as *_talk.mp4 (game will auto-detect)")
    elif args.compare:
        print("\n   Local videos saved as *_talk_local.mp4")
        print("   Open compare_videos.html to see A/B comparison")
    else:
        print(f"\n   Videos saved to: {VIDEO_OUT_DIR}")
        print("   To use in game, run with --use-local flag")


if __name__ == '__main__':
    main()
