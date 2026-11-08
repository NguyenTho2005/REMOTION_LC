# KẾ HOẠCH TRIỂN KHAI — VIDEO STICKMAN EXPLAINER: AI AGENT LÀ GÌ?
## Project ID: `stickman-ai-agent-001`

---

### 1. Mục Tiêu Dự Án (Project Objective)
- **Tên dự án:** `stickman-ai-agent-001`
- **Tiêu đề:** *AI Agent là gì? Và tại sao nó có thể thay đổi cách chúng ta làm việc?*
- **Thời lượng mục tiêu:** Khoảng 4 phút (~240 giây), điều phối 100% bằng thời lượng âm thanh thực tế từ ZeroTTS.
- **Tỷ lệ khung hình & Độ phân giải:** 9:16 — 1080 × 1920 pixels — 30 FPS.
- **Phong cách thị giác:** Stickman Explainer / Educational / Tech Storytelling (Nền trắng/kem tối giản, nhân vật que đen, điểm nhấn màu Cyan/Electric Blue).
- **Giọng đọc:** ZeroTTS tiếng Việt chuẩn (`quangminh` hoặc `tiendat` hoặc `maichi` — nam/nữ rõ ràng, tự nhiên, nhịp vừa phải).
- **Công nghệ hoạt ảnh:** React 19 + SVG Vector + Remotion 4.0.541 (Frame-driven animations qua `useCurrentFrame()`, `interpolate()`, `spring()`).

---

### 2. Các Module Sẽ Tái Sử Dụng (Reused Modules)
1. **Audio & Voice Service:**
   - `tts-service/` (FastAPI backend wrapping ZeroTTS ONNX runtime).
   - `src/services/tts-api.ts` & `src/engines/VoiceEngine.ts` để gọi API tổng hợp 14 file audio WAV 48kHz.
2. **Quality & Validation Engine:**
   - `src/engines/QualityEngine.ts` để kiểm tra toàn diện: File size, Resolution (1080x1920), Frame rate (30fps), Audio stream, Duration sync.
3. **Core Remotion Components:**
   - `src/templates/shared/SubtitleSequence.tsx` (hoặc mở rộng phiên bản Subtitle tối ưu cho explainer).
   - Cấu hình Bundler trong `remotion.config.ts`.
4. **Test & QA Framework:**
   - `tests/` và các suite kiểm thử tự động.

---

### 3. Các Module Cần Tạo Mới (New Modules to Create)

#### A. Stickman Animation Engine (`src/templates/stickman/`)
- `Stickman.tsx`: Component tổng hợp nhận các prop: `pose`, `facing` ('left' | 'right'), `emotion`, `holdingProp`, `animationState`.
- `StickmanBody.tsx`: Khung xương vector:
  - `StickmanHead.tsx`: Đầu tròn, mắt (chớp/nhìn), miệng (mở nói theo frame/audio).
  - `StickmanArm.tsx`: Khớp vai, cánh tay, khuỷu tay, cẳng tay, bàn tay (vung tay, gõ phím, cầm đồ, chỉ bảng).
  - `StickmanLeg.tsx`: Khớp hông, đùi, đầu gối, cẳng chân, bàn chân (bước đi walk-cycle, ngồi, đứng nghiêm).
- `StickmanAnimator.ts`: Các hàm tính góc và tọa độ frame-driven (`walkCycle(frame)`, `typingCycle(frame)`, `talkingHeadBounce(frame)`).
- `StickmanProps.tsx`: Hệ thống đạo cụ vector SVG:
  - Bàn làm việc & laptop gõ phím (`DeskLaptop`)
  - Đồng hồ quay nhanh (`FastClock`)
  - Robot cộng sự (`CompanionRobot`)
  - Khung chat bong bóng (`ChatBubbleStack`)
  - Bảng vẽ sơ đồ (`WhiteboardDiagram`)
  - Biểu tượng công cụ (`ToolIcons`: Browser, Database, API, Filesystem)
  - Thẻ nhớ (`MemoryCards`)
  - Hệ thống nhiều robot nhỏ (`MultiAgentNetwork`)
  - Bảng cảnh báo (`WarningSign`) & Nút phê duyệt (`ApproveButton`)

#### B. 14 Phân Cảnh Chuyên Biệt (14 Scenes)
1. `S01Hook.tsx`: Người que làm việc kiệt sức, đồng hồ quay nhanh, robot xuất hiện tiếp quản.
2. `S02Problem.tsx`: Người que chat từng câu lặp đi lặp lại với chatbot, các tab chat xếp chồng.
3. `S03Introduction.tsx`: Chatbot biến hình thành AI Agent, bảng mục tiêu "GOAL → PLAN → ACTION".
4. `S04Workflow.tsx`: Sơ đồ 5 bước (Goal, Planning, Tool Use, Execution, Evaluation), robot di chuyển qua từng bước.
5. `S05Example.tsx`: Giao việc nghiên cứu, robot lướt web, trích xuất tài liệu vào máy tổng hợp, báo cáo hoàn tất xuất hiện.
6. `S06ToolCalling.tsx`: Bảng công cụ bên ngoài (Browser, Database, API, File), robot kết nối và thao tác.
7. `S07Memory.tsx`: Robot mở các thẻ nhớ ngữ cảnh từ quá khứ, tiếp tục làm việc không bị gián đoạn.
8. `S08MultiAgent.tsx`: Robot quản lý ở trung tâm điều phối 3 robot chuyên trách (Nghiên cứu, Viết, Kiểm tra).
9. `S09Applications.tsx`: 4 bối cảnh thực tế (Lập trình, Phân tích dữ liệu, CSKH, Phân loại tài liệu).
10. `S10Risks.tsx`: Robot chọn nhầm công cụ, biển cảnh báo lỗi, người que giơ biển "CHECK FIRST".
11. `S11HumanInLoop.tsx`: Robot đưa kết quả duyệt, người que ấn "Approve", cộng tác an toàn.
12. `S12Future.tsx`: Mạng lưới công nghệ tương lai, trợ lý thông minh tích hợp sâu mọi phần mềm.
13. `S13Summary.tsx`: Vòng tròn 5 trụ cột cốt lõi: Goal, Plan, Tools, Memory, Evaluation.
14. `S14Outro.tsx`: Người que và Robot vẫy tay chào, câu hỏi thảo luận "WHAT WILL YOU AUTOMATE?" và kêu gọi Follow.

#### C. Composition & Timeline Master
- `src/templates/stickman/StickmanAIAgentExplainer.tsx`: Master Composition kết nối 14 Sequence, audio tracks, subtitle, BGM, SFX.
- `src/Root.tsx`: Đăng ký `<StickmanAIAgentExplainerComposition />`.

#### D. Tài Liệu & Artifacts Sản Xuất
- `production/videos/stickman-ai-agent-001/script.md`: Kịch bản phân cảnh chi tiết.
- `production/videos/stickman-ai-agent-001/voice-script.md`: Kịch bản đọc âm thanh tiếng Việt chuẩn.
- `production/videos/stickman-ai-agent-001/storyboard.json`: Phân bổ frame và đạo cụ cho 14 cảnh.
- `production/videos/stickman-ai-agent-001/manifest.json`: Siêu dữ liệu dự án.
- `production/videos/stickman-ai-agent-001/audio/`: 14 file âm thanh `S01.wav` – `S14.wav`.
- `production/videos/stickman-ai-agent-001/output/`: Video MP4 và thumbnail.
- `production/videos/stickman-ai-agent-001/reports/`: QA report và báo cáo nghiệm thu.

---

### 4. Các Module Cần Chỉnh Sửa (Modules to Modify)
- `src/Root.tsx`: Đăng ký thêm composition `StickmanAIAgentExplainer`.
- Cấu hình âm thanh: Sao chép 14 file audio vào `public/audio/stickman/` để Remotion `staticFile()` truy xuất trực tiếp.

---

### 5. Dependencies & Thư Viện
- Đã có đầy đủ trong dự án: `remotion`, `@remotion/cli`, `react 19`, `fastapi`, `zerotts`, `soundfile`, `ffmpeg`, `ffprobe`.
- Không cần cài thêm thư viện npm nặng; vector SVG được dựng native để tối ưu tốc độ render.

---

### 6. Các Rủi Ro Kỹ Thuật & Giải Pháp (Technical Risks & Mitigations)
1. **Lệch nhịp giữa hình ảnh và giọng đọc:**
   - *Giải pháp:* Đo đạc thời lượng chính xác của từng file `Sxx.wav` qua `ffprobe`/`soundfile` và lấy thời lượng thực tế nhân với 30 FPS để tính `durationInFrames` cho từng `<Sequence>`.
2. **Khung hình dài (4 phút = ~7.200 frames):**
   - *Giải pháp:* Tách 14 scenes thành các React component con độc lập; Remotion chỉ render scene đang active tại khoảng frame tương ứng, giữ lượng memory thấp và ổn định.
3. **Chuyển động người que bị cứng nhắc:**
   - *Giải pháp:* Sử dụng hàm toán học nội suy mượt mà (`interpolate` với easing bezier, `spring` dao động tự nhiên cho tay, chân, đầu).
4. **Vùng an toàn TikTok (9:16 Safe Zones):**
   - *Giải pháp:* Thiết kế nhân vật và hành động nằm trọn trong vùng an toàn (Top: >180px, Bottom: <1650px, Lề: >60px).

---

### 7. Lộ Trình Triển Khai (Execution Steps)
- [x] **Bước 1:** Khởi tạo cấu trúc thư mục và tài liệu kế hoạch `implementation-plan.md`.
- [ ] **Bước 2:** Chuẩn hóa kịch bản `script.md`, `voice-script.md` và `storyboard.json`.
- [ ] **Bước 3:** Chạy ZeroTTS FastAPI service và tạo 14 file WAV chuẩn 48kHz.
- [ ] **Bước 4:** Xây dựng Stickman Animation Engine & Props trong `src/templates/stickman/`.
- [ ] **Bước 5:** Xây dựng 14 component phân cảnh hoàn chỉnh.
- [ ] **Bước 6:** Ghép Composition Master trong `StickmanAIAgentExplainer.tsx` và đăng ký trong `src/Root.tsx`.
- [ ] **Bước 7:** Render Thumbnail và Video MP4 hoàn thiện.
- [ ] **Bước 8:** Chạy kiểm thử chất lượng qua `QualityEngine`, trích xuất frame mẫu và lập báo cáo QA.
