# BÁO CÁO SẢN XUẤT VIDEO — REMOTION-LC
## Project: Supermemory GitHub Repository Review (`supermemory-review-001`)

---

### 1. Tổng Quan Dự Án (Executive Summary)

- **Mã dự án:** `supermemory-review-001`
- **Tiêu đề video:** Supermemory — AI có thể nhớ mọi thứ?
- **Chuyên mục:** `github-repo-review`
- **Kho lưu trữ phân tích:** [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory)
- **Nền tảng mục tiêu:** TikTok (Định dạng dọc 9:16)
- **Độ phân giải:** 1080 × 1920 pixels
- **Tốc độ khung hình:** 30 FPS
- **Tổng thời lượng thực tế:** 60.31 giây (1,809 frames)
- **Độ dài thoại:** 8 phân cảnh / 228 từ Tiếng Việt (Tốc độ đọc trung bình: ~227 từ/phút)
- **Công nghệ giọng đọc:** ZeroTTS (ONNX Runtime, 48,000 Hz WAV)
- **Giọng đọc sử dụng:** `maichi` (Mai Chi — Nữ miền Bắc chuẩn)
- **Engine kết xuất đồ họa:** Remotion 4.0.541 + React 19
- **Tập tin xuất bản:** `production/videos/supermemory-review-001/output/supermemory-review-001.mp4` (6.45 MB)
- **Ảnh đại diện (Thumbnail):** `production/videos/supermemory-review-001/output/thumbnail.png` (1080×1920)
- **Điểm chất lượng (QA Score):** **100 / 100** (Kiểm tra bởi `QualityEngine`)

---

### 2. Thông Số Kỹ Thuật Tập Tin (Media Specs)

| Thuộc tính | Giá trị chi tiết | Ghi chú kiểm thử ffprobe |
| :--- | :--- | :--- |
| **Định dạng bao gói (Container)** | MP4 (MPEG-4 Part 14) | Chuẩn tương thích phát video di động |
| **Video Codec** | H.264 / AVC (High Profile) | YUV420p |
| **Kích thước khung hình** | 1080 × 1920 | Tỷ lệ chuẩn 9:16 (TikTok / Reels / Shorts) |
| **Tốc độ khung hình (FPS)** | 30.00 fps | 1,809 frames tổng cộng |
| **Audio Codec** | AAC (Advanced Audio Coding) | 48,000 Hz, Stereo, 160 kbps |
| **Dung lượng tập tin video** | 6,764,772 bytes (~6.45 MB) | Tối ưu hóa nén và truyền tải mạng xã hội |
| **Độ dài âm thanh gốc (ZeroTTS)** | 60.16 giây | 8 tập tin WAV độc lập tại 48kHz |
| **Đồng bộ âm thanh - hình ảnh** | Khóa cứng theo frame (`calculateMetadata`) | Sai lệch: 0.01 giây (< 1 frame) |

---

### 3. Chi Tiết Kịch Bản & Phân Cảnh (Scene-by-Scene Timeline)

| Cảnh | Tên phân cảnh | Thời lượng | Khoảng frame | Số từ | Giọng đọc (ZeroTTS `maichi`) | Đồ họa & Hiệu ứng chính |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- |
| **S01** | **Hook** | 5.52s | 0 – 165 | 20 | *"Bạn có bao giờ bực mình vì mỗi lần mở đoạn chat mới, AI lại quên sạch mọi thông tin về bạn?"* | Icon AI Brain phát xung điện tử (`Electric Blue`), hạt neural chuyển động, nhãn câu hỏi giật tít. |
| **S02** | **The Problem** | 6.48s | 166 – 360 | 22 | *"Dù context window có lớn đến đâu, AI vẫn gặp hiện tượng mất ngữ cảnh thảm khốc khi chuyển đổi giữa các phiên làm việc."* | Cảnh báo đỏ-cam (`#EF4444`), bong bóng chat bị đứt gãy, minh họa ngữ cảnh bị xóa sổ. |
| **S03** | **Introduction** | 7.84s | 361 – 596 | 23 | *"Supermemory là dự án mã nguồn mở với hơn ba mươi hai nghìn ngôi sao trên GitHub, đóng vai trò như bộ não ngoài của AI."* | Thẻ GitHub repository chính thức, huy hiệu 32.000+ stars, giấy phép MIT, Next.js & Cloudflare stack. |
| **S04** | **Memory Engine** | 7.04s | 597 – 808 | 27 | *"Khác với RAG thông thường, hệ thống tự động bóc tách sự thật, xây dựng đồ thị quan hệ và cập nhật hồ sơ người dùng chỉ trong năm mươi mili giây."* | Sơ đồ luồng trích xuất tri thức, biểu đồ đồ thị quan hệ, thẻ User Profile trích xuất động siêu tốc (~50ms). |
| **S05** | **Hybrid Search** | 8.08s | 809 – 1051 | 28 | *"Chế độ tìm kiếm lai kết hợp cả vector ngữ nghĩa lẫn từ khóa chính xác, giúp AI truy xuất thông tin quá khứ mà không bỏ sót bất kỳ chi tiết nào."* | So sánh song song Vector Search (Cos-Sim) vs Keyword BM25, thanh điểm Reciprocal Rank Fusion 98.4%. |
| **S06** | **MCP & Connectors** | 8.08s | 1052 – 1294 | 26 | *"Nhờ giao thức Model Context Protocol, Supermemory tích hợp trực tiếp vào Cursor và Claude Code, đồng bộ dữ liệu từ Notion, Drive và trình duyệt."* | Trung tâm giao thức MCP kết nối Cursor, Claude Code, Chrome Extension, Notion và Google Drive. |
| **S07** | **Local Deployment** | 8.56s | 1295 – 1551 | 25 | *"Bạn có thể tự chạy Supermemory cục bộ bằng Docker hoặc một lệnh đơn giản, kết nối với mô hình AI cục bộ để bảo mật dữ liệu tuyệt đối."* | Giao diện Terminal phong cách Dark macOS, lệnh `docker run` và kết nối mô hình nhúng cục bộ Ollama. |
| **S08** | **Conclusion & CTA** | 8.56s | 1552 – 1808 | 27 | *"Supermemory chính là mảnh ghép còn thiếu để AI thực sự hiểu bạn. Bạn nghĩ sao về công nghệ này? Follow ngay để đón xem các công cụ đột phá tiếp theo!"* | Thẻ tổng kết công nghệ cốt lõi, nút kêu gọi hành động (Follow / Thảo luận) hiệu ứng sóng năng lượng. |

---

### 4. Báo Cáo Đảm Bảo Chất Lượng (Quality Assurance Report)

Dữ liệu được trích xuất từ `QualityEngine.analyzeVideo()` chạy trực tiếp trên file MP4 đầu ra:

```json
{
  "videoId": "supermemory-review-001",
  "overallPassed": true,
  "score": 100,
  "checks": [
    {
      "name": "File Integrity",
      "passed": true,
      "details": "File size: 6.45 MB",
      "score": 100
    },
    {
      "name": "Resolution & Aspect Ratio (9:16)",
      "passed": true,
      "details": "Resolution verified: 1080x1920 (9:16 vertical)",
      "score": 100
    },
    {
      "name": "Audio Stream Presence",
      "passed": true,
      "details": "Audio stream detected (2 channels)",
      "score": 100
    },
    {
      "name": "Frame Rate (30 FPS)",
      "passed": true,
      "details": "Frame rate verified: 30 FPS",
      "score": 100
    },
    {
      "name": "Duration Alignment",
      "passed": true,
      "details": "Duration: 60.31s (Target: 60.30s, diff: 0.01s)",
      "score": 100
    }
  ],
  "mediaMetadata": {
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "duration": 60.309,
    "hasAudio": true,
    "audioChannels": 2,
    "fileSizeBytes": 6764772
  }
}
```

#### Tuân thủ vùng an toàn TikTok (TikTok Safe Zones):
- **Khoảng đệm đỉnh (Top Safe Zone):** `180px` — Không bị che bởi thanh tìm kiếm hay icon TikTok.
- **Khoảng đệm đáy (Bottom Safe Zone):** `270px` — Tránh hoàn toàn thanh tiêu đề, tên tác giả, âm thanh và phụ đề gốc TikTok.
- **Khoảng đệm lề phải (Right Margin):** `120px` — Tránh vùng bấm Like, Comment, Bookmark, Share.
- **Khu vực hiển thị trọng tâm (Center Safe Area):** `800px × 1400px` — Toàn bộ tiêu đề, thẻ minh họa đồ thị, terminal và phụ đề nằm trọn trong vùng mắt nhìn tự nhiên.

---

### 5. Cấu Trúc Tài Nguyên & Tạo Tác (Artifact Manifest)

Toàn bộ các tài nguyên sản xuất được lưu trữ ngăn nắp và có thể tái tạo hoàn toàn:

```
production/videos/supermemory-review-001/
├── manifest.json                  # Cấu hình dự án và timeline master
├── research.json                  # Dữ liệu phân tích kỹ thuật repo Supermemory
├── script.md                      # Kịch bản chi tiết kèm visual notes
├── script.json                    # Kịch bản dạng JSON có cấu trúc
├── voice-script.md                # Kịch bản đọc âm thanh tiếng Việt chuẩn hóa
├── storyboard.json                # Kịch bản phân cảnh kèm frame, animation, subtitle
├── tiktok-caption.md              # Caption đăng TikTok, hashtag, liên kết GitHub
├── audio-manifest.json            # Manifest chi tiết 8 file âm thanh ZeroTTS
├── audio/                         # Thư mục chứa 8 tập tin WAV gốc 48kHz
│   ├── S01.wav ~ S08.wav
├── assets/
│   ├── architecture-diagram.svg   # Sơ đồ kiến trúc bộ nhớ ngoài
│   └── scene-frames/              # 8 ảnh chụp tĩnh của từng phân cảnh để kiểm tra trực quan
│       ├── frame_S01.png ~ frame_S08.png
├── output/
│   ├── supermemory-review-001.mp4 # Video MP4 hoàn thiện (1080x1920, 60s, 30fps)
│   └── thumbnail.png              # Thumbnail video độ phân giải cao
└── reports/
    ├── qa-report.json             # Báo cáo kiểm thử luồng media tự động
    └── production-report.md       # Báo cáo sản xuất tổng thể này
```

---

### 6. Kết Luận & Hướng Dẫn Sử Dụng Tiếp Theo

1. **Xem trước cục bộ qua Remotion Studio:**
   ```bash
   npm run dev
   ```
   Chọn composition `SupermemoryReview` trên trình duyệt để kiểm tra timeline tương tác trực tiếp.

2. **Xem lại file video hoàn thiện:**
   Tập tin MP4 sẵn sàng tải lên TikTok, YouTube Shorts, Reels tại:
   `production/videos/supermemory-review-001/output/supermemory-review-001.mp4`

3. **Nội dung bài đăng:**
   Sử dụng tiêu đề, mô tả và bộ hashtag trong file `production/videos/supermemory-review-001/tiktok-caption.md`.
