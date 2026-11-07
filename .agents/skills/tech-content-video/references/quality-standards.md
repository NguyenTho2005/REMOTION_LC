# Quality Standards — Automated Video QA Criteria

Every generated video must pass these automated verification checks before being delivered:

## 1. Container & Codec Standards
- Video format: MP4 container (`h264` codec, progressive scan, yuv420p).
- Audio format: AAC 48,000 Hz, stereo, >= 128 kbps.
- Resolution: Exact 1080 (width) × 1920 (height).
- Frame rate: 30 FPS.

## 2. Synchronization & Timing
- Total video duration must match audio narration length within a `0.5s` tolerance buffer.
- No audio truncation: audio speech must not be clipped before the end of sentence.
- Zero blank scenes: each scene must render visual cards, motion elements, or text.

## 3. Subtitles & Text Integrity
- Subtitle segments must not overflow the horizontal safe area (`width <= 900px`).
- Subtitle lines should not exceed 8–10 Vietnamese words per display flash.
- Vietnamese characters must be valid Unicode NFC without corrupted diacritic glyphs.
