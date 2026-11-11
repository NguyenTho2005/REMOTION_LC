# Motion Graphics & Animation Architecture (REMOTION_LC)

Tài liệu này định nghĩa **kiến trúc motion đa tầng** và **quy chuẩn chuyển đổi (adapter)** để tích hợp hoạt hình 2D/3D, shader WebGL, RoughJS, Lottie, và tham chiếu từ `bang-motion` / `mg-styles-15` vào Remotion một cách **deterministic, zero-clock-drift**.

## 1) Nguyên tắc thời gian tối thượng (Zero Clock Drift)

- **Nguồn chân lý thời gian duy nhất:** `frame = useCurrentFrame()` và `fps` từ `useVideoConfig()` (mặc định 30 FPS).
- **Cấm tuyệt đối trong render path:** `requestAnimationFrame`, `performance.now()`, `Date.now()`, timer realtime, GSAP runtime clock, Three.js internal animation clock không đồng bộ frame.
- Mọi animation/visual state phải là **hàm thuần của frame** (cùng frame → cùng output) để hỗ trợ scrub, seek, và render headless chính xác.

## 2) Bảng quy chuẩn chuyển đổi (Adapter Conversion Rules)

| Hạng mục | Nguồn/thói quen gốc | Quy chuẩn trong REMOTION_LC | Ghi chú |
|---|---|---|---|
| **Timing / Tween** | `gsap.to`, `setTimeout`, CSS animation, RAF loop | `interpolate(frame, inputRange, outputRange, { easing, extrapolateLeft/Right })` hoặc `spring({ frame, fps, config, delay, durationInFrames? })` | Chuyển thời gian `t` (giây/ms) → frame domain; giữ easing tương đương khi port |
| **Clock tổng** | `tl.time()`, `window.renderAt(t)` | `frame`, `fps`, `timeSec = frame / fps` | Không đọc clock hệ thống |
| **Shader uniforms** | `uTime = performance.now()/1000` | `uTime = frame / fps` (hoặc `frame / 30` nếu component yêu cầu rõ, phải deterministic) | Cập nhật uniform theo frame mỗi lần render |
| **3D/WebGL scene** | Raw Three.js/WebGL loop, tự RAF | Declarative R3F trong `<ThreeCanvas>` của `@remotion/three`, `shaderMaterial` (`@react-three/drei`) | Không tự chạy render loop; state/uniforms driven by frame |
| **Lottie / Vector animation** | `lottie-web` autoplay/realtime | `@remotion/lottie` `<Lottie>` (frame-synced) hoặc wrapper đồng bộ frame trong dự án | Không bật autoplay; playback phải bám timeline Remotion |
| **RoughJS / 2D drawing** | Vẽ theo timer/event | Vẽ trong React render dựa trên `frame`/`interpolate`/`spring` (SVG/Canvas) | Seed/stroke config ổn định để deterministic |
| **Camera motion** | Keyframe engine/runtime camera | `interpolate`/`spring` cho position/lookAt/FOV hoặc controller frame-driven | Port ý tưởng từ `bang-motion` sang frame math |
| **Audio sync** | Realtime playback cues | Cues/timestamps từ pipeline (ZeroTTS/storyboard) → map sang `Sequence`/frame ranges | Audio pre-synthesized, không gọi TTS trong render |

## 3) Kiến trúc phân tầng cảnh (Layer Composition)

Mỗi cảnh (scene/composition segment) nên tách rõ 3 tầng để dễ tái sử dụng, debug và đồng bộ nhịp:

| Tầng | Vai trò | Công nghệ gợi ý | Quy tắc |
|---|---|---|---|
| **Background Layer** | Nền thị giác, môi trường, ánh sáng/chuyển động nền | WebGL Shader, R3F scene trong `<ThreeCanvas>`, gradient/noise, particles | Chạy theo `frame`; shader `uTime = frame / fps`; ưu tiên hiệu năng headless |
| **Midground Layer** | Chủ thể chính, vật thể/nhân vật, minh họa hành động | 3D objects (R3F), RoughJS 2D, **Lottie** (nhân vật/VFX vector), motion graphics shapes | Chuyển động/pose/state đồng bộ frame; có thể nhận cues từ storyboard/audio timeline |
| **Foreground Layer** | Thông tin đọc nhanh, nhấn ý, dẫn dắt người xem | UI overlays, kinetic typography, captions/subtitles ZeroTTS, badges/cards | Tôn trọng safe zones TikTok 9:16 (top 150, bottom 280, right 120), ưu tiên legibility |

### Nguyên tắc phối tầng
- **Đồng bộ nhịp:** Cùng mốc beat/cue có thể ảnh hưởng nhiều tầng, nhưng mỗi tầng vẫn tính từ frame/timeline chung.
- **Tách trách nhiệm:** Background không chứa logic subtitle; foreground không chứa shader scene nặng.
- **Deterministic assets:** Lottie JSON, texture, model, audio đều là assets cố định/versioned; không random runtime không seed.

## 4) Lottie Integration (Nhân vật & VFX)

- **Thư viện:** `@remotion/lottie` + `lottie-web` (đã cài trong project).
- **Cách dùng chuẩn:** render bằng `<Lottie animationData={...} />` từ `@remotion/lottie` để playback tự đồng bộ với timeline Remotion (frame-driven).
- **Khuyến nghị:** dùng wrapper nội bộ (ví dụ `src/components/animation/RemotionLottie.tsx`) để chuẩn hóa style/fit/playbackRate/delay theo frame khi cần.
- **Assets:** đặt file JSON trong `public/` (ví dụ `public/lottie/*.json`) và load qua `staticFile(...)`/fetch deterministic tại bundle-time pattern phù hợp; tránh phụ thuộc network runtime không kiểm soát.

## 5) Tham chiếu & Porting Sources

- **`docs/MOTION_SKILLS_ADAPTER.md`**: quy tắc adapter chi tiết khi port từ nguồn tham chiếu.
- **`.agents/skills/bang-motion`**: tham khảo camera continuous, nhịp typography/kinetic timing (chỉ concept).
- **`docs/references/mg-styles-15`**: tham khảo 15 styles (Aurora/Glass, Liquid/SDF, v.v.) để tái hiện logic visual bằng stack Remotion.

## 6) Checklist khi thêm motion/animation mới

1. Xác định tầng (background/midground/foreground) và phạm vi sync (beat/cue/frame range)
2. Chuyển toàn bộ timing sang `interpolate`/`spring` và shader sang `uTime = frame / fps`
3. Nếu dùng 3D/shader: đặt trong `<ThreeCanvas>` + R3F + `shaderMaterial` (deterministic uniforms)
4. Nếu dùng Lottie: dùng `@remotion/lottie` (frame-synced), không autoplay realtime
5. Kiểm tra 9:16 safe zones và hiệu năng headless (shader steps/overdraw)
6. Chạy `npm run lint` (`eslint src && tsc`) trước khi hoàn tất
