#!/usr/bin/env python3
"""Analyze portrait images to detect approximate eye and mouth positions."""
from PIL import Image
import os

portraits_dir = '/Users/tyshchea/Aramais/Game/git-blame/assets/portraits'

for fname in sorted(os.listdir(portraits_dir)):
    if not fname.endswith('.jpg'):
        continue
    img = Image.open(os.path.join(portraits_dir, fname)).convert('RGB')
    w, h = img.size

    # Skin tone from forehead area
    pixels = []
    for y in range(int(h * 0.12), int(h * 0.22)):
        for x in range(int(w * 0.35), int(w * 0.65)):
            pixels.append(img.getpixel((x, y)))
    avg_r = sum(p[0] for p in pixels) // len(pixels)
    avg_g = sum(p[1] for p in pixels) // len(pixels)
    avg_b = sum(p[2] for p in pixels) // len(pixels)
    skin_hex = f'#{avg_r:02x}{avg_g:02x}{avg_b:02x}'

    # Find eye Y by darkest horizontal band in 25-55% vertical range
    band_brightness = {}
    for y in range(int(h * 0.25), int(h * 0.55)):
        row_pixels = [img.getpixel((x, y)) for x in range(int(w * 0.2), int(w * 0.8))]
        avg_bright = sum(sum(p) / 3 for p in row_pixels) / len(row_pixels)
        band_brightness[y] = avg_bright

    sorted_bands = sorted(band_brightness.items(), key=lambda x: x[1])
    dark_rows = [b[0] for b in sorted_bands[:15]]
    eye_y_360 = sum(dark_rows) // len(dark_rows)

    # Find mouth Y by redness + darkness in 55-78% range
    mouth_scores = {}
    for y in range(int(h * 0.55), int(h * 0.78)):
        row_pixels = [img.getpixel((x, y)) for x in range(int(w * 0.3), int(w * 0.7))]
        redness = sum(p[0] - (p[1] + p[2]) / 2 for p in row_pixels) / len(row_pixels)
        darkness = sum(sum(p) / 3 for p in row_pixels) / len(row_pixels)
        mouth_scores[y] = -redness + darkness * 0.3
    sorted_mouth = sorted(mouth_scores.items(), key=lambda x: x[1])
    mouth_rows = [b[0] for b in sorted_mouth[:10]]
    mouth_y_360 = sum(mouth_rows) // len(mouth_rows)

    # Find eye X centers by darkest spots in left/right halves
    eye_row = [(x, sum(img.getpixel((x, eye_y_360))) / 3) for x in range(int(w * 0.15), int(w * 0.85))]
    mid = w // 2
    left_pixels = [(x, b) for x, b in eye_row if x < mid]
    right_pixels = [(x, b) for x, b in eye_row if x >= mid]
    left_dark = sorted(left_pixels, key=lambda p: p[1])[:20]
    right_dark = sorted(right_pixels, key=lambda p: p[1])[:20]
    left_eye_x_360 = sum(p[0] for p in left_dark) // len(left_dark)
    right_eye_x_360 = sum(p[0] for p in right_dark) // len(right_dark)

    # Convert to 180×180 scale
    eye_y = eye_y_360 // 2
    mouth_y = mouth_y_360 // 2
    left_eye_x = left_eye_x_360 // 2
    right_eye_x = right_eye_x_360 // 2

    eye_w = 18
    eye_h = 8
    mouth_w = 30
    mouth_h = 10
    mouth_cx = (left_eye_x + right_eye_x) // 2
    mouth_x = mouth_cx - mouth_w // 2

    name = fname.replace('.jpg', '')
    le = f"{{ x: {left_eye_x - eye_w // 2}, y: {eye_y - eye_h // 2}, w: {eye_w}, h: {eye_h} }}"
    re = f"{{ x: {right_eye_x - eye_w // 2}, y: {eye_y - eye_h // 2}, w: {eye_w}, h: {eye_h} }}"
    mo = f"{{ x: {mouth_x}, y: {mouth_y - mouth_h // 2}, w: {mouth_w}, h: {mouth_h} }}"
    print(f"    // {name}")
    print(f"    faceLandmarks: {{ leftEye: {le}, rightEye: {re}, mouth: {mo}, skinColor: '{skin_hex}' }},")
    print()
