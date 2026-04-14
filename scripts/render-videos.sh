#!/usr/bin/env bash
set -e

OUTDIR="out/videos"
mkdir -p "$OUTDIR"

COMPOSITIONS=("PainPoint" "BeforeAfter" "HotTake" "DmResults")

for comp in "${COMPOSITIONS[@]}"; do
  echo "🎬 Rendering ${comp}..."
  npx remotion render \
    remotion/index.ts \
    "$comp" \
    "${OUTDIR}/${comp}.mp4" \
    --codec h264
  echo "✅ ${comp} → ${OUTDIR}/${comp}.mp4"
done

echo ""
echo "🎉 All videos rendered to ${OUTDIR}/"
ls -lh "$OUTDIR"/*.mp4
