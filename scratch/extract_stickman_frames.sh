#!/usr/bin/env bash
set -e

VIDEO="production/videos/stickman-ai-agent-001/output/ai-agent-motion-graphics-explainer.mp4"
FRAMES_DIR="production/videos/stickman-ai-agent-001/assets/scene-frames"

mkdir -p "$FRAMES_DIR"

echo "Extracting representative frames for all 14 Motion Graphics scenes..."

ffmpeg -y -ss 00:00:05.67 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S01.png"
ffmpeg -y -ss 00:00:16.67 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S02.png"
ffmpeg -y -ss 00:00:27.67 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S03.png"
ffmpeg -y -ss 00:00:37.67 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S04.png"
ffmpeg -y -ss 00:00:49.17 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S05.png"
ffmpeg -y -ss 00:01:01.50 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S06.png"
ffmpeg -y -ss 00:01:13.33 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S07.png"
ffmpeg -y -ss 00:01:25.67 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S08.png"
ffmpeg -y -ss 00:01:37.83 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S09.png"
ffmpeg -y -ss 00:01:49.00 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S10.png"
ffmpeg -y -ss 00:02:00.00 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S11.png"
ffmpeg -y -ss 00:02:11.17 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S12.png"
ffmpeg -y -ss 00:02:23.33 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S13.png"
ffmpeg -y -ss 00:02:34.33 -i "$VIDEO" -vframes 1 "$FRAMES_DIR/frame_S14.png"

echo "All 14 Motion Graphics frames extracted successfully!"
ls -lh "$FRAMES_DIR"
