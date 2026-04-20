#!/bin/bash
# run_sadtalker_bg.sh — Run SadTalker inference for characters
GAME_DIR=/Users/tyshchea/Aramais/Game/git-blame
cd "$GAME_DIR/SadTalker"

# Add venv bin to PATH so ffmpeg/ffprobe symlinks are found
export PATH="$GAME_DIR/.sadtalker-venv/bin:$PATH"
PYTHON="$GAME_DIR/.sadtalker-venv/bin/python3"

# Characters to process: pass as args, or do all
CHARS="${@:-aramais taras zheka efim ivan anya vitya inessa misha sasha}"

echo "SadTalker batch generation" > /tmp/sadtalker_run.log
echo "Characters: $CHARS" >> /tmp/sadtalker_run.log
echo "Start: $(date)" >> /tmp/sadtalker_run.log

for CHAR in $CHARS; do
  PORTRAIT="$GAME_DIR/assets/portraits/${CHAR}.jpg"
  AUDIO="$GAME_DIR/assets/audio/tts/${CHAR}.mp3"
  OUTPUT="$GAME_DIR/assets/video/portraits/${CHAR}_talk_local.mp4"
  
  if [ -f "$OUTPUT" ]; then
    echo "SKIP $CHAR: already exists" >> /tmp/sadtalker_run.log
    continue
  fi
  
  echo ">>> $CHAR: starting at $(date)" >> /tmp/sadtalker_run.log
  
  $PYTHON inference.py \
    --driven_audio "$AUDIO" \
    --source_image "$PORTRAIT" \
    --result_dir results \
    --still \
    --preprocess full \
    --size 256 \
    --expression_scale 1.0 \
    >> /tmp/sadtalker_run.log 2>&1
  
  RC=$?
  echo ">>> $CHAR: exit=$RC at $(date)" >> /tmp/sadtalker_run.log
  
  # Find and move the output video
  LATEST=$(find results -name "*.mp4" -newer "$PORTRAIT" -not -name "temp_*" 2>/dev/null | sort -t/ -k3 | tail -1)
  if [ -n "$LATEST" ]; then
    mv "$LATEST" "$OUTPUT"
    echo ">>> $CHAR: saved to $OUTPUT" >> /tmp/sadtalker_run.log
  else
    # Try temp video + merge audio
    TEMP=$(find results -name "temp_${CHAR}*" -newer "$PORTRAIT" 2>/dev/null | tail -1)
    if [ -n "$TEMP" ]; then
      echo ">>> $CHAR: merging temp video with audio" >> /tmp/sadtalker_run.log
      ffmpeg -y -i "$TEMP" -i "$AUDIO" -c:v copy -c:a aac -shortest -movflags +faststart "$OUTPUT" >> /tmp/sadtalker_run.log 2>&1
      echo ">>> $CHAR: merge done, saved to $OUTPUT" >> /tmp/sadtalker_run.log
    fi
  fi
done

echo "ALL_DONE at $(date)" >> /tmp/sadtalker_run.log
