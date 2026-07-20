#!/bin/bash
# Compress all portfolio videos to web-optimized quality
# Target: 720p, reasonable bitrate, small file sizes

VIDEOS_DIR="/Users/tanyasharma/Documents/tanmay/tanmay-site/frontend/public/videos"
OUT_DIR="/Users/tanyasharma/Documents/tanmay/tanmay-site/frontend/public/videos_web"

mkdir -p "$OUT_DIR"

compress_video() {
  local input="$1"
  local filename=$(basename "$input")
  local output="$OUT_DIR/$filename"
  
  if [ -f "$output" ]; then
    echo "SKIP: $filename (already exists)"
    return
  fi
  
  echo "COMPRESSING: $filename ..."
  ffmpeg -y -i "$input" \
    -vf "scale='min(720,iw)':-2" \
    -c:v libx264 -preset fast -crf 28 \
    -c:a aac -b:a 96k \
    -movflags +faststart \
    -threads 0 \
    "$output" 2>/dev/null
  
  local orig_size=$(du -h "$input" | cut -f1)
  local new_size=$(du -h "$output" | cut -f1)
  echo "  DONE: $filename ($orig_size → $new_size)"
}

echo "=== Compressing videos for web deployment ==="
echo ""

for f in "$VIDEOS_DIR"/*.mp4; do
  [ -f "$f" ] && compress_video "$f"
done

echo ""
echo "=== All done! ==="
du -sh "$OUT_DIR"
