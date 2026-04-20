#!/usr/bin/env python3
"""
generate_did_videos.py — Generate talking-head videos via D-ID API

D-ID free tier: 5 minutes of video. We generate:
  - 10 characters × 1 idle video (2s, subtle movement) ≈ 20s
  - 10 characters × 1 talking video (3s, mouth movement) ≈ 30s
  Total ≈ 50s — well within free tier.

Setup:
  1. Sign up at https://studio.d-id.com/
  2. Go to API → get your API key
  3. Run: python3 generate_did_videos.py --api-key YOUR_KEY

Output: assets/video/portraits/{charId}_idle.mp4, {charId}_talk.mp4
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
import base64

API_BASE = 'https://api.d-id.com'

CHARACTERS = [
    'aramais', 'taras', 'zheka', 'efim', 'ivan',
    'anya', 'vitya', 'inessa', 'misha', 'sasha'
]

# Short Ukrainian phrases for talking videos (one per character for variety)
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

# Voice settings per character (for D-ID's built-in TTS)
# D-ID expects { "type": "microsoft", "voice_id": "..." } inside script.provider
VOICE_SETTINGS = {
    'aramais': {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
    'taras':   {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
    'zheka':   {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
    'efim':    {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
    'ivan':    {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
    'anya':    {'type': 'microsoft', 'voice_id': 'uk-UA-PolinaNeural'},
    'vitya':   {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
    'inessa':  {'type': 'microsoft', 'voice_id': 'uk-UA-PolinaNeural'},
    'misha':   {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
    'sasha':   {'type': 'microsoft', 'voice_id': 'uk-UA-OstapNeural'},
}


def api_request(method, path, api_key, body=None):
    """Make a D-ID API request."""
    url = API_BASE + path
    headers = {
        'Authorization': f'Basic {api_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"  API Error {e.code}: {err_body}")
        return None


def upload_image(api_key, image_path):
    """Upload a portrait image to D-ID and get its URL."""
    url = API_BASE + '/images'
    
    with open(image_path, 'rb') as f:
        image_data = f.read()
    
    # D-ID expects multipart form data for image upload
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    filename = os.path.basename(image_path)
    
    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'
        f'Content-Type: image/jpeg\r\n\r\n'
    ).encode() + image_data + f'\r\n--{boundary}--\r\n'.encode()
    
    headers = {
        'Authorization': f'Basic {api_key}',
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Accept': 'application/json',
    }
    
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            return result.get('url') or result.get('id')
    except urllib.error.HTTPError as e:
        print(f"  Upload Error {e.code}: {e.read().decode()}")
        return None


def create_talk_video(api_key, image_url, text, voice_cfg):
    """Create a talking-head video with D-ID Talks API."""
    body = {
        'source_url': image_url,
        'script': {
            'type': 'text',
            'input': text,
            'provider': voice_cfg,
        },
        'config': {
            'stitch': True,        # Smooth face-background blending
            'result_format': 'mp4',
        },
    }
    return api_request('POST', '/talks', api_key, body)


def create_idle_video(api_key, image_url):
    """Create a short idle animation (subtle movement, no speech)."""
    # Use the animations endpoint for idle — generates natural micro-movements
    body = {
        'source_url': image_url,
        'driver_url': 'bank://nostalgia',  # Subtle nostalgic head movement
        'config': {
            'stitch': True,
            'result_format': 'mp4',
        },
    }
    result = api_request('POST', '/animations', api_key, body)
    return result


def wait_for_video(api_key, talk_id, endpoint='talks', timeout=120):
    """Poll until the video is ready, then return the result URL."""
    for _ in range(timeout // 3):
        time.sleep(3)
        result = api_request('GET', f'/{endpoint}/{talk_id}', api_key)
        if not result:
            continue
        status = result.get('status', '')
        if status == 'done':
            return result.get('result_url')
        elif status in ('error', 'rejected'):
            print(f"  Video failed: {result.get('error', {}).get('description', 'unknown')}")
            return None
        else:
            print(f"  Status: {status}...", end='\r')
    print("  Timeout waiting for video.")
    return None


def download_video(url, output_path):
    """Download a video from URL to local file."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    urllib.request.urlretrieve(url, output_path)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"  Saved: {output_path} ({size_kb:.0f} KB)")


def main():
    parser = argparse.ArgumentParser(description='Generate D-ID talking-head videos')
    parser.add_argument('--api-key', required=True, help='D-ID API key')
    parser.add_argument('--portraits-dir', default='assets/portraits',
                        help='Directory with portrait JPGs')
    parser.add_argument('--output-dir', default='assets/video/portraits',
                        help='Output directory for videos')
    parser.add_argument('--characters', nargs='*', default=None,
                        help='Generate only for specific characters')
    parser.add_argument('--skip-idle', action='store_true',
                        help='Skip idle video generation')
    parser.add_argument('--skip-talk', action='store_true',
                        help='Skip talk video generation')
    args = parser.parse_args()

    chars = args.characters or CHARACTERS
    os.makedirs(args.output_dir, exist_ok=True)

    print(f"🎬 D-ID Video Generator — {len(chars)} characters")
    print(f"   Free tier: 5 min. Estimated use: ~{len(chars) * 5}s\n")

    # Track uploaded image URLs to avoid re-uploading
    image_urls = {}

    for char_id in chars:
        portrait_path = os.path.join(args.portraits_dir, f'{char_id}.jpg')
        if not os.path.exists(portrait_path):
            print(f"⚠ {char_id}: portrait not found at {portrait_path}, skipping")
            continue

        print(f"━━━ {char_id.upper()} ━━━")

        # Upload portrait
        if char_id not in image_urls:
            print(f"  Uploading portrait...")
            img_url = upload_image(args.api_key, portrait_path)
            if not img_url:
                print(f"  ✗ Failed to upload portrait, skipping")
                continue
            image_urls[char_id] = img_url
            print(f"  ✓ Uploaded")

        img_url = image_urls[char_id]

        # Generate talking video
        if not args.skip_talk:
            talk_out = os.path.join(args.output_dir, f'{char_id}_talk.mp4')
            if os.path.exists(talk_out):
                print(f"  Talk video already exists, skipping")
            else:
                phrase = TALK_PHRASES.get(char_id, 'Привіт, це тест.')
                voice = VOICE_SETTINGS.get(char_id, VOICE_SETTINGS['aramais'])
                print(f"  Creating talk video: \"{phrase[:40]}...\"")
                result = create_talk_video(args.api_key, img_url, phrase, voice)
                if result and result.get('id'):
                    video_url = wait_for_video(args.api_key, result['id'], 'talks')
                    if video_url:
                        download_video(video_url, talk_out)
                        print(f"  ✓ Talk video done")
                    else:
                        print(f"  ✗ Talk video failed")
                else:
                    print(f"  ✗ Could not create talk video")

        # Generate idle video
        if not args.skip_idle:
            idle_out = os.path.join(args.output_dir, f'{char_id}_idle.mp4')
            if os.path.exists(idle_out):
                print(f"  Idle video already exists, skipping")
            else:
                print(f"  Creating idle animation...")
                result = create_idle_video(args.api_key, img_url)
                if result and result.get('id'):
                    video_url = wait_for_video(args.api_key, result['id'], 'animations')
                    if video_url:
                        download_video(video_url, idle_out)
                        print(f"  ✓ Idle video done")
                    else:
                        print(f"  ✗ Idle video failed")
                else:
                    print(f"  ✗ Could not create idle video")

        print()

    print("🏁 Done! Videos saved to:", args.output_dir)
    print("\nTo use in the game, just refresh — the game auto-detects video files.")


if __name__ == '__main__':
    main()
