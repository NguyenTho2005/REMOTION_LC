# REMOTION-LC — AI Video Production System & ZeroTTS Studio

Hệ thống sản xuất video công nghệ tự động cho TikTok sử dụng kiến trúc **Single Orchestrator Agent + Modular Engines + Tool-Based Execution**, tích hợp giọng đọc AI tiếng Việt **ZeroTTS** và bộ dựng video lập trình **Remotion**.

---

## 🌟 Tính Năng Nổi Bật

- **AI Video Orchestrator:** Chỉ cần một prompt tiếng Việt tự nhiên (VD: *"Tạo video 30s giải thích AI Agent là gì"*), hệ thống tự động nghiên cứu, viết kịch bản 6 phần chuẩn SEO, chia storyboard, sinh giọng đọc ZeroTTS, dựng composition và render video MP4 hoàn chỉnh.
- **Quy Trình 10 Giai Đoạn (10-Stage Pipeline):** `init` ➔ `research` ➔ `script` ➔ `storyboard` ➔ `voice` ➔ `visuals` ➔ `captions` ➔ `composition` ➔ `render` ➔ `qa`.
- **Định Dạng Chuẩn TikTok 9:16:** Độ phân giải 1080 × 1920, 30 FPS, phong cách Dark Tech Editorial, tuân thủ vùng an toàn (Safe Zones: Top 160px, Bottom 260px).
- **Bộ Templates Đa Dạng:**
  - `HookScene` & `OutroScene`: Mở màn giật tít và kết thúc kêu gọi hành động (CTA).
  - `BreakingNews` & `NewsTimeline`: Tin tức công nghệ nóng hổi.
  - `AIConceptScene`, `ArchitectureScene` & `FeatureHighlight`: Giải thích công nghệ và mô hình AI.
  - `RepositoryCard`, `CodeShowcase` & `TerminalAnimation`: Review kho mã nguồn GitHub mã nguồn mở.
- **ZeroTTS Voice Studio:** Hỗ trợ đầy đủ 8 giọng đọc tiếng Việt 48kHz chất lượng cao, tự động chuẩn hóa văn bản và gắn track trực tiếp vào timeline Remotion.
- **Quality Assurance Engine:** Tự động kiểm tra chất lượng video đầu ra qua `ffprobe` (khớp thời lượng, tỷ lệ 9:16, 30 FPS, âm thanh stereo, dung lượng file).
- **Motion Architecture Đa Tầng + Skills/Styles (mới):** Tích hợp kiến trúc motion graphics và animation đa lớp (zero-clock-drift) cho Remotion:
  - **Tài liệu:** [`docs/MOTION_ARCHITECTURE.md`](docs/MOTION_ARCHITECTURE.md) (bảng quy chuẩn timing/shader/3D/Lottie, phân tầng Background/Midground/Foreground) và [`docs/MOTION_SKILLS_ADAPTER.md`](docs/MOTION_SKILLS_ADAPTER.md).
  - **Nguồn tham chiếu:** `.agents/skills/bang-motion` (camera/typography/timing concept) và `docs/references/mg-styles-15` (15 motion styles, GLSL/WebGL demos).
  - **Stack motion:** Remotion clock (`useCurrentFrame`/`interpolate`/`spring`), R3F + `@remotion/three` + `shaderMaterial`, RoughJS, và **Lottie** (`@remotion/lottie` + `lottie-web`, frame-synced).
  - **PoC & showcase:** `AuroraGlassmorphism`, `LiquidMotionBlob`, `RemotionLottie` wrapper, compositions `MotionStylesShowcase` và `MotionLayeredShowcase` (shader background + RoughJS/Lottie midground + typography foreground).

---

## 🎙️ Danh Sách 8 Giọng ZeroTTS Chính Thức

| Voice ID | Tên hiển thị | Giới tính | Vùng miền / Phong cách | Đề xuất thể loại video |
|---|---|---|---|---|
| `quangminh` | Quang Minh | Nam | Miền Bắc, chuẩn phát thanh, sắc nét | AI Explainer, AI Model Review |
| `tiendat` | Tiến Đạt | Nam | Miền Bắc, trầm ấm, dứt khoát | GitHub Repository Review |
| `baotrang` | Bảo Trang | Nữ | Miền Bắc, chuyên nghiệp, tin tức | Breaking Tech News |
| `giahuy` | Gia Huy | Nam | Miền Nam, hiện đại, sôi nổi | AI Tool Review |
| `maichi` | Mai Chi | Nữ | Miền Bắc, nhẹ nhàng, truyền cảm | Phóng sự công nghệ |
| `hamy` | Hà My | Nữ | Miền Nam, trẻ trung, năng động | Short form content |
| `kimoanh` | Kim Oanh | Nữ | Miền Bắc, ấm áp, thân thiện | Tutorial & Onboarding |
| `huuduc` | Hữu Đức | Nam | Miền Trung, đĩnh đạc, tin cậy | Tech Documentary |

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### 1. Cài đặt Node Dependencies

```bash
npm install
```

### 2. Thiết lập môi trường Python & ZeroTTS

```bash
python3 -m venv tts-service/.venv
source tts-service/.venv/bin/activate
pip install -r tts-service/requirements.txt
```

### 3. Khởi động ZeroTTS Service

```bash
npm run tts
```
> Dịch vụ backend chạy tại `http://127.0.0.1:8000`. Kiểm tra trạng thái: `http://127.0.0.1:8000/api/tts/health`.

### 4. Khởi động Remotion Studio

Mở terminal mới và chạy:
```bash
npm run dev
```
> Truy cập `http://localhost:3000`. Chọn composition **TikTokVideo** (dọc 9:16) hoặc **MyComp** (ngang 16:9). Nhấn nút `🎙️ Mở Voice Studio` để sử dụng tab **✨ AI Video** hoặc **🎙️ TTS Studio**.

---

## ⚡ Các Lệnh Thực Thi (CLI Commands)

| Lệnh | Mô tả |
| :--- | :--- |
| `npm test` | Chạy bộ kiểm thử tự động TypeScript cho TaskPlanner, Engines, StateManager, ToolRegistry |
| `npm run test:tts` | Chạy 8 bài kiểm thử pytest cho backend FastAPI & mô hình ZeroTTS |
| `npm run lint` | Kiểm tra toàn bộ mã nguồn với ESLint và TypeScript compiler strict mode |
| `npm run build` | Bundle dự án với Remotion bundler |
| `npm run render:tiktok` | Render video dọc 9:16 `TikTokVideo` (1080x1920) xuất ra `out/tiktok-video.mp4` |
| `npm run render` | Render video ngang `MyComp` (1280x720) xuất ra `out/output.mp4` |

---

## 🧪 Chạy Thử E2E AI Video Orchestrator

Tạo video hoàn chỉnh tự động từ dòng lệnh:

```bash
node --experimental-strip-types scratch/run_e2e_video.ts
```

Pipeline sẽ thực thi:
1. Nhận prompt: *"Giải thích AI Agent là gì và vì sao đây là xu hướng lập trình 2025 trong 30s"*
2. Lập kế hoạch và nghiên cứu kiến trúc 4 trụ cột của AI Agent.
3. Soạn kịch bản 6 phần chuẩn tiếng Việt (~100 từ).
4. Dựng Storyboard gồm 4 phân cảnh (`HookScene`, `AIConceptScene`, `ArchitectureScene`, `OutroScene`).
5. Tạo giọng đọc AI thực tế với ZeroTTS voice `quangminh`.
6. Dựng composition Remotion `TikTokVideo` (750 frames, 25.0s, 30 FPS).
7. Render ra file MP4 chất lượng cao tại `out/ai_agent_tiktok.mp4`.
8. Kiểm tra chất lượng tự động qua `QualityEngine` (100% Scorecard).

---

## 📐 Kiến Trúc Hệ Thống (Architecture)

Chi tiết thiết kế và tài liệu kỹ thuật có sẵn trong thư mục `docs/`:
- [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md): Tổng quan kiến trúc hệ thống và luồng dữ liệu.
- [`docs/architecture/pipeline.md`](docs/architecture/pipeline.md): Đặc tả 10 giai đoạn của PipelineRunner.
- [`docs/architecture/engine-design.md`](docs/architecture/engine-design.md): Thiết kế các Modular Engines.
- [`docs/api/orchestrator-api.md`](docs/api/orchestrator-api.md): API tham chiếu của VideoOrchestrator và ToolRegistry.
- [`docs/development/extending-engines.md`](docs/development/extending-engines.md): Hướng dẫn mở rộng template và đăng ký tool mới.
- [`docs/MOTION_SKILLS_ADAPTER.md`](docs/MOTION_SKILLS_ADAPTER.md): Quy tắc adapter khi port motion/shader từ `bang-motion` và `mg-styles-15` sang Remotion (deterministic clock, R3F/ThreeCanvas, 9:16).
- [`AGENTS.md`](AGENTS.md): Bộ quy tắc kỹ thuật và tiêu chuẩn code cho lập trình viên và AI agents (bao gồm hướng dẫn tra cứu motion skills/styles).
