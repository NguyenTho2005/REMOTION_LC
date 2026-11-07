# REMOTION-LC — ZeroTTS Voice Studio

Tích hợp AI Voice Studio tiếng Việt sử dụng mô hình **ZeroTTS** trực tiếp vào không gian làm việc của **REMOTION-LC**.

Người dùng có thể chọn 8 giọng đọc tiếng Việt chất lượng cao, nhập kịch bản, nghe thử preview, tạo file âm thanh và đưa trực tiếp vào Timeline Remotion để render video.

---

## 🎙️ Danh sách 8 giọng ZeroTTS chính thức

| Voice ID | Tên hiển thị | Giới tính | Đặc điểm / Tags |
|---|---|---|---|
| `maichi` | Mai Chi | Nữ | Trẻ, kể chuyện, nhẹ nhàng, thân thiện |
| `baotrang` | Bảo Trang | Nữ | Trưởng thành, tin tức, rõ ràng, trung tính |
| `kimoanh` | Kim Oanh | Nữ | Trung niên, kể chuyện, ấm áp, truyền cảm |
| `hamy` | Hà My | Nữ | Trẻ, hoạt hình, cao, biểu cảm |
| `giahuy` | Gia Huy | Nam | Trẻ, kể chuyện, trầm ấm, tâm tình |
| `huuduc` | Hữu Đức | Nam | Lớn tuổi, kể chuyện, trầm, điềm đạm |
| `quangminh` | Quang Minh | Nam | Trẻ, tin tức, rõ ràng, dứt khoát |
| `tiendat` | Tiến Đạt | Nam | Trẻ, bình luận, sôi nổi, năng lượng cao |

---

## 🚀 Hướng dẫn cài đặt & Khởi động

### 1. Cài đặt Node dependencies (Frontend / Remotion)

```bash
npm install
```

### 2. Thiết lập môi trường Python & Cài đặt ZeroTTS (Backend)

```bash
# Tạo virtual environment riêng cho tts-service
python3 -m venv tts-service/.venv

# Kích hoạt virtual environment và cài đặt dependencies
source tts-service/.venv/bin/activate
pip install -r tts-service/requirements.txt
```

### 3. Khởi động ZeroTTS Service

```bash
# Chạy trực tiếp qua npm script:
npm run tts

# Hoặc qua lệnh Python:
PYTHONPATH=tts-service tts-service/.venv/bin/python tts-service/app/main.py
```
> Backend sẽ chạy tại `http://127.0.0.1:8000`. Endpoint API: `http://127.0.0.1:8000/api/tts/health`.

### 4. Khởi động REMOTION-LC Studio

Mở một terminal mới và chạy:

```bash
npm run dev
```
> Trình duyệt sẽ mở giao diện Remotion Studio tại `http://localhost:3000`.
> Nhấn nút **🎙️ Mở Voice Studio** ở góc trên bên phải để mở bảng điều khiển Voice Studio.

---

## 🎬 Quy trình sử dụng (User Workflow)

1. **Mở Studio:** Mở `http://localhost:3000`.
2. **Mở Voice Studio:** Nhấn vào nút `🎙️ Mở Voice Studio` nổi ở góc trên bên phải.
3. **Soạn kịch bản:** Nhập hoặc dán đoạn văn bản tiếng Việt vào ô kịch bản (có đếm từ và ký tự).
4. **Chọn giọng đọc:** Lọc theo giới tính (Nữ/Nam) hoặc tìm kiếm theo tên/tags trong 8 giọng ZeroTTS.
5. **Nghe thử:** Nhấn nút `▶ Nghe` trên card giọng nói để nghe audio mẫu của giọng đó.
6. **Tạo âm thanh:** Nhấn `🎙️ Tạo âm thanh với [Tên giọng]`. Hệ thống sẽ chuẩn hóa tiếng Việt, chia câu tự động (chunking) và sinh file WAV 48kHz.
7. **Nghe kết quả:** Nghe lại âm thanh vừa tạo trực tiếp trên trình phát.
8. **Đưa vào Timeline:** Nhấn `➕ Thêm vào Timeline`. Track âm thanh sẽ được tự động ghi vào `public/audio/tracks.json` và xuất hiện dưới timeline Remotion với tên `Voice: [Tên giọng]`.
9. **Xem trước video:** Nhấn Play trên trình phát trung tâm của Remotion Studio để nghe âm thanh phát đồng bộ cùng hoạt ảnh sóng âm (waveform).
10. **Render video:** Xuất video cuối cùng có âm thanh voice-over hoàn chỉnh:
    ```bash
    npm run render
    # hoặc
    npx remotion render MyComp out/output.mp4
    ```

---

## 🧪 Kiểm thử (Testing)

### Chạy kiểm thử Backend TTS (FastAPI & ZeroTTS)
Kiểm thử 8 endpoints: health check, catalog 8 giọng, preview WAV, chuẩn hóa tiếng Việt, chunking câu dài, lưu trữ asset và quản lý timeline:

```bash
npm run test:tts
```

### Chạy Typecheck & Linter Frontend
Kiểm tra TypeScript strict mode và ESLint flat config:

```bash
npm run lint
```

### Kiểm tra Render Video với âm thanh
Render thử composition kiểm tra luồng video `h264` và audio `aac` (48kHz):

```bash
npm run render
ffprobe -v error -show_entries stream=codec_type,codec_name,duration,sample_rate out/output.mp4
```

---

## 🏗️ Kiến trúc kỹ thuật

```text
REMOTION-LC/
├── public/
│   └── audio/
│       ├── generated/       # Thư mục chứa các file WAV được tạo bởi ZeroTTS
│       ├── metadata/        # Thư mục lưu JSON metadata từng file
│       └── tracks.json      # File manifest timeline audio tracks
├── src/
│   ├── components/
│   │   └── voice-studio/
│   │       ├── VoiceStudioPanel.tsx    # Giao diện chính Voice Studio (Tabs, Health, Alert)
│   │       ├── VoiceStudioOverlay.tsx  # Floating overlay gắn vào Remotion Studio DOM
│   │       ├── VoiceSelector.tsx       # Tìm kiếm & danh sách 8 voice cards
│   │       ├── VoiceCard.tsx           # Thẻ hiển thị giọng, tags, nút preview
│   │       ├── ScriptEditor.tsx        # Textarea kịch bản, đếm từ, mẫu văn bản
│   │       ├── AudioPreview.tsx        # Trình phát kết quả vừa tạo + nút Add to Timeline
│   │       └── GeneratedAudioList.tsx  # Danh sách lịch sử audio đã sinh
│   ├── hooks/
│   │   └── useTTS.ts                   # Hook quản lý state, API client & audio player
│   ├── services/
│   │   └── tts-api.ts                  # Client gọi FastAPI endpoints
│   ├── types/
│   │   └── tts.ts                      # TypeScript interfaces
│   ├── Composition.tsx                 # Remotion Composition tích hợp Sequence Audio
│   └── Root.tsx                        # Remotion Root gắn Composition + VoiceStudioOverlay
├── tts-service/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point, CORS, static files
│   │   ├── core/config.py              # Cấu hình đường dẫn asset, model, concurrency
│   │   ├── api/routes.py               # REST API endpoints (/api/tts/*)
│   │   ├── schemas/tts.py              # Pydantic schemas
│   │   └── services/
│   │       ├── zerotts_engine.py       # ZeroTTS Adapter (singleton model, normalization, chunking)
│   │       └── asset_manager.py        # Quản lý audio storage & timeline manifest
│   ├── requirements.txt                # Pinned dependencies
│   └── tests/
│       └── test_api.py                 # Pytest test suite cho TTS engine & API
└── remotion.config.ts
```

---

## 🛠️ Xử lý sự cố (Troubleshooting)

- **Lỗi `⚠️ ZeroTTS Backend chưa chạy` trên giao diện:**
  Mở terminal và khởi động backend: `npm run tts` (hoặc kiểm tra cổng 8000 không bị chiếm dụng).
- **Model ZeroTTS tải về ở đâu?**
  Weights và voice packs được tải tự động qua HuggingFace Hub và lưu tại `~/.cache/huggingface/hub/models--zeroweight-ai--ZeroTTS`. Lần chạy tiếp theo sẽ nạp trực tiếp từ ổ cứng mà không cần tải lại.
- **Render lại có gọi lại ZeroTTS không?**
  Không. Khi render video bằng Remotion CLI, hệ thống sử dụng các file audio đã lưu trong `public/audio/generated/` thông qua `staticFile()`. Quá trình render video hoàn toàn độc lập và không phụ thuộc vào trạng thái chạy của Python backend.
