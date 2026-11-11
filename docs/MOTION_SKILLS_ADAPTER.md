# Motion Skills Adapter (bang-motion + mg-styles-15)

> Xem thêm kiến trúc phân tầng & bảng quy chuẩn tổng quát: [`docs/MOTION_ARCHITECTURE.md`](MOTION_ARCHITECTURE.md)

Tài liệu này chuẩn hóa cách **tra cứu** và **chuyển đổi** mã/ý tưởng từ hai nguồn tham chiếu thành module chạy được trong REMOTION_LC (Remotion 4 + React + R3F/Three.js + TypeScript strict).

## Nguồn tham chiếu

| Nguồn | Vị trí trong repo | Mục đích |
|---|---|---|
| `bang-motion` | `.agents/skills/bang-motion/` | Tư duy motion/camera continuous, nhịp typography/kinetic timing, anti-PPT, kiến trúc timeline determinisitic (tham khảo concept) |
| `mg-styles-15` | `docs/references/mg-styles-15/` | Kho 15 phong cách motion/visual (HTML/WebGL/Three/GLSL), demos như Aurora Glassmorphism (12) và Liquid Motion (07) để tái sử dụng logic shader/visual |

> Lưu ý: hai thư mục trên là **reference** (đã bỏ `.git` lồng) để agent đọc và port logic; không coi như package runtime của dự án.

## Quy tắc chuyển đổi bắt buộc (Adapter Rules)

### 1) Clock & Timing Adapter

- **Cấm** dùng `requestAnimationFrame`, `gsap.to()`, `gsap.timeline()` runtime, `window.renderAt(t)` từ demo gốc, hoặc bất kỳ clock hệ thống nào (`performance.now()`, `Date.now()`) để điều khiển animation trong output Remotion.
- Toàn bộ chuyển động phải quy về API Remotion:
  - `useCurrentFrame()` và `useVideoConfig()` để lấy `frame`/`fps`
  - `interpolate()` / `spring()` / `interpolateColors()` cho motion 2D/param
- **Shader GLSL** phải nhận thời gian từ Remotion (deterministic):
  - `uTime = frame / fps` (hoặc `frame / 30` khi component yêu cầu rõ)
  - Cùng `frame` phải cho cùng output hình ảnh (phục vụ render headless/seek)

### 2) 3D Scene Adapter

- Mã Three.js/WebGL2 từ `mg-styles-15` (raw WebGL, canvas script) phải được chuyển sang **Declarative R3F components** (`@react-three/fiber`).
- Render scene 3D bên trong `<ThreeCanvas>` của `@remotion/three` (đồng bộ render loop với Remotion/Chromium headless).
- Bọc fragment/vertex GLSL bằng `shaderMaterial` từ `@react-three/drei` (kết hợp `extend` khi cần dùng declarative JSX), quản lý uniforms có type rõ ràng.
- Giữ state-driven/deterministic: uniforms cập nhật theo frame, không dùng internal animation loop.

### 3) Aspect Ratio & Viewport Adapter

- Chuẩn hóa output cho TikTok/Reels dọc: **9:16, 1080×1920, 30 FPS** (mặc định dự án).
- Thiết lập camera/projection/fullscreen quad theo viewport 1080x1920 (orthographic bounds hoặc perspective/FOV cố định phù hợp 9:16).
- UI/text overlay phải tôn trọng safe zones khi áp dụng vào template sản xuất (top ~150, bottom ~280, right ~120).

### 4) Performance & Compatibility Adapter

- Tối ưu shader cho headless Chromium/Puppeteer: tránh raymarch/SDF loop quá sâu, giới hạn steps (ví dụ metaball raymarch ≤ 40), tránh branching nặng không cần thiết.
- Ưu tiên WebGL1/WebGL2 tương thích rộng, không dùng extension thử nghiệm không ổn định trong môi trường render.
- TypeScript **strict**: không `any`, export type/interface rõ ràng, tuân thủ ESLint/tsc của dự án.

### 5) Mapping nhanh từ demo gốc sang Remotion

- `mg-styles-15/demos/12-aurora-glass` (Aurora/Glass, mesh-gradient/light field) → aurora background shader + glass layer (`MeshTransmissionMaterial`) trong R3F.
- `mg-styles-15/demos/07-liquid` (Liquid Motion / SDF-like metaball feel) → shader metaball/SDF raymarch hoặc field shader gọn, `uTime` từ frame.
- `bang-motion` (timing/camera/typography principles) → chuyển nhịp và camera moves sang `interpolate`/`spring`/`Sequence`/CameraController theo frame; giữ tinh thần continuous motion nhưng deterministic.

## Khi triển khai component mới

1. Đọc demo/reference tương ứng trong `docs/references/mg-styles-15/...` và/hoặc `.agents/skills/bang-motion/...`
2. Trích logic visual cốt lõi (palette, noise/fbm, SDF/metaball, lighting cues) và bỏ phụ thuộc runtime gốc
3. Port sang `src/three/materials` + `src/three/components` (R3F + shaderMaterial + Remotion clock)
4. Tạo composition/template mẫu (9:16) và đăng ký trong `src/Root.tsx` để preview
5. Chạy `npm run lint` (`eslint src && tsc`) trước khi hoàn tất
