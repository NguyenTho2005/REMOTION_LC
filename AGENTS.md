# AGENTS.md — REMOTION-LC AI Video Production System Guidelines

Welcome to **REMOTION-LC**. This document governs all autonomous AI agents, human contributors, and tooling working in this codebase.

---

## 1. Project Architecture

REMOTION-LC is an AI Video Production System specialized for Vietnamese technology and AI content, formatted for TikTok (vertical 9:16, 1080×1920, 30 FPS).

### Core Architectural Principle
**Single Orchestrator Agent + Modular Engines + Tool-Based Execution**

- **Orchestrator:** `src/orchestrator/VideoOrchestrator.ts` oversees the complete workflow.
- **Pipeline Runner:** `src/orchestrator/PipelineRunner.ts` manages a 10-stage linear pipeline with state persistence and recovery.
- **Engines (`src/engines/`):** Specialized, self-contained functional modules:
  - `ResearchEngine`: Fact-checking, GitHub repo analysis, AI model docs.
  - `ScriptEngine`: 6-stage Vietnamese tech script generation.
  - `StoryboardEngine`: Scene decomposition with visual cues and timing.
  - `VoiceEngine`: ZeroTTS integration via the local FastAPI backend.
  - `VisualEngine`: Code showcase, diagrams, terminal cards, motion elements.
  - `RemotionEngine`: Assembles scenes into Remotion compositions.
  - `QualityEngine`: Validates video dimensions, fps, audio presence, sync.
- **Backend Service (`tts-service/`):** Python FastAPI microservice wrapping ZeroTTS ONNX runtime for Vietnamese TTS.
- **Tool Registry (`src/tools/ToolRegistry.ts`):** Controlled execution environment exposing typed tools to the orchestrator.

---

## 2. Coding & TypeScript Standards

1. **Strict TypeScript:** No `any`. Always provide exact type signatures. Use Zod for runtime validations.
2. **ESLint & Prettier:** Preserve zero lint errors and zero warnings (`npm run lint`).
3. **No Phantom Code:** Never write mock or placeholder code that claims to be functional. Every file and function must be implemented and tested.
4. **Preserve Existing Code:** Do not overwrite existing compositions (`MyComp`) or break existing editor functionality. Extend cleanly.
5. **Node & React Compatibility:** Node >= 20.19.0, React 19, Remotion 4.0.541.

---

## 3. Remotion Conventions

1. **Frame-driven Animations:** All animations inside video compositions must be pure functions of `useCurrentFrame()` and `useVideoConfig()`. Never use CSS `transition` or `animation: spin 1s infinite` inside composition rendering.
2. **Safe Margins for TikTok (9:16 vertical 1080×1920):**
   - Top safe zone: `150px` (avoid TikTok header icons).
   - Bottom safe zone: `280px` (avoid caption, sound title, and author bar).
   - Right safe zone: `120px` (avoid like/comment/share buttons).
   - Center action safe area: `800px × 1400px`.
3. **Audio Playback:** Always use `<Sequence>` with `<Audio src={staticFile(...)} />`. ZeroTTS must **never** be invoked inside the Remotion render cycle. All audio must be pre-synthesized and stored in `public/audio/generated/`.
4. **Dynamic Metadata:** Use `calculateMetadata` to determine exact `durationInFrames` based on storyboard/audio durations, preventing truncated speech.

---

## 4. ZeroTTS Integration Rules

1. **Official Voices Only:** Only use the 8 official verified voice IDs:
   `maichi`, `baotrang`, `kimoanh`, `hamy`, `giahuy`, `huuduc`, `quangminh`, `tiendat`.
2. **Reuse Backend:** Do not spin up secondary TTS backends. Use the existing service in `tts-service/` at port 8000 via `src/services/tts-api.ts`.
3. **Audio Format:** Output must be signed 16-bit PCM WAV at 48,000 Hz.
4. **Vietnamese Text Processing:** Always normalize text via `normalize_vi_text` and chunk via `chunk_text` for multi-sentence inputs.

---

## 5. Asset Management Rules

1. **Storage Paths:**
   - Generated audio: `public/audio/generated/{asset_id}.wav`
   - Audio metadata: `public/audio/metadata/{asset_id}.json`
   - Timeline manifest: `public/audio/tracks.json`
   - Visual artifacts: `public/assets/{video_id}/`
2. **Path Traversal Protection:** Sanitize all asset IDs and paths. Never use user input directly as a raw filesystem path.
3. **Idempotence & Caching:** Re-rendering an existing video must reuse existing audio and visual assets without re-running TTS inference.

---

## 6. Testing Requirements

1. **Unit Testing:** Maintain unit tests in `tests/` for TaskPlanner, StateManager, PipelineRunner, Schemas, and Engines.
2. **Backend Testing:** Run `npm run test:tts` to verify all 8 ZeroTTS endpoints.
3. **Lint & Typecheck:** Run `npm run lint` before committing any milestone.
4. **Render Verification:** Run `npm run render` and inspect audio/video streams with `ffprobe`.
5. **Truthful Reporting:** If a service or environment is unavailable, report it honestly as `BLOCKED` or `NOT TESTED`. Never fake test outputs.

---

## 7. Security & Sandbox Boundary

1. Never commit API secrets, `.env` files, or large model weights to git.
2. Respect sandbox boundaries. Run commands sandboxed first (`BypassSandbox: false`); only elevate when network access is required.
3. Do not execute arbitrary, unvalidated shell strings via the LLM. All system actions must pass through registered tools in `ToolRegistry`.

---

## 8. Motion Architecture, Skills & Style References

Khi làm việc với motion graphics/animation đa tầng, shader, Lottie, hoặc style presets, **phải** tra cứu và tuân thủ tài liệu kiến trúc + adapter trước khi port mã:

- **Kiến trúc motion đa tầng (bắt buộc):** [`docs/MOTION_ARCHITECTURE.md`](docs/MOTION_ARCHITECTURE.md)
  - Bảng quy chuẩn chuyển đổi timing/shader/3D/Lottie (zero-clock-drift)
  - Phân tầng cảnh: **Background** (WebGL/R3F shader) / **Midground** (3D, RoughJS, Lottie) / **Foreground** (UI, kinetic typography, captions)
- **Adapter rules tham chiếu:** [`docs/MOTION_SKILLS_ADAPTER.md`](docs/MOTION_SKILLS_ADAPTER.md)
- **bang-motion (camera/typography/kinetic timing principles):** `.agents/skills/bang-motion/`
  - Đọc `README.md`, `references/architecture.md`, `references/techniques.md` khi cần ý tưởng nhịp/camera/anti-PPT
  - Chỉ tham khảo concept; không copy runtime GSAP/RAF/renderAt vào Remotion
- **mg-styles-15 (15 motion styles, GLSL/WebGL demos):** `docs/references/mg-styles-15/`
  - Tra cứu demo/style tương ứng (ví dụ `demos/12-aurora-glass`, `demos/07-liquid`) để tái sử dụng logic visual/shader
  - Port sang R3F + `@remotion/three` + `shaderMaterial` + clock Remotion

**Nguyên tắc cốt lõi khi port:** `uTime = frame / fps` (deterministic), tweening qua `interpolate`/`spring`, không `requestAnimationFrame`/`gsap`/clock realtime, chuẩn 9:16 (1080x1920), shader/Lottie/animation đồng bộ frame.
