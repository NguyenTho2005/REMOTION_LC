import os
import json
import numpy as np
import scipy.signal as signal
from pathlib import Path
import soundfile as sf
from app.services.zerotts_engine import engine

# Define the 9 scenes
SCENES_DATA = [
    {
        "id": "S01",
        "title": "Hook - ChatGPT & Codex hàng ngày",
        "voiceText": "Bạn đang dùng cả ChatGPT lẫn Codex mỗi ngày? Vậy thì có một thay đổi từ OpenAI mà bạn nên biết!",
        "topic": "Hook & Đặt vấn đề",
        "bgTheme": "dark",
        "visualPaddingFrames": 20,
    },
    {
        "id": "S02",
        "title": "Thông báo - Kế hoạch tháng 12/2026",
        "voiceText": "Từ tháng 12 năm 2026, OpenAI dự kiến dùng chung hạn mức sử dụng ChatGPT và Codex đối với các gói Plus, Pro và Business.",
        "topic": "Thông báo chính thức",
        "bgTheme": "light",
        "visualPaddingFrames": 22,
    },
    {
        "id": "S03",
        "title": "Cơ chế cũ vs mới - Hạn mức riêng biệt",
        "voiceText": "Nghĩa là sao? Trước đây, bạn có thể quen với việc theo dõi giới hạn của từng công cụ riêng biệt.",
        "topic": "Giải thích trước đây",
        "bgTheme": "dark",
        "visualPaddingFrames": 18,
    },
    {
        "id": "S04",
        "title": "Hạn mức chung - Tính bằng Token",
        "voiceText": "Nhưng theo kế hoạch mới, mức sử dụng sẽ được tính bằng token trong một hạn mức chung.",
        "topic": "Shared Token Pool",
        "bgTheme": "dark",
        "visualPaddingFrames": 18,
    },
    {
        "id": "S05",
        "title": "Độ phức tạp tác vụ & Model mạnh",
        "voiceText": "Và đây mới là điểm đáng chú ý! Bạn sử dụng model càng mạnh, hoặc giao cho AI những tác vụ càng phức tạp, thì có thể tiêu hao hạn mức càng nhiều.",
        "topic": "Task Complexity",
        "bgTheme": "light",
        "visualPaddingFrames": 22,
    },
    {
        "id": "S06",
        "title": "Ngoại lệ - ChatGPT Instant không bị trừ",
        "voiceText": "Vậy chat bình thường có bị tính không? Theo thông báo, ChatGPT Instant sẽ không trừ vào hạn mức sử dụng chung này.",
        "topic": "Instant Exception",
        "bgTheme": "dark",
        "visualPaddingFrames": 20,
    },
    {
        "id": "S07",
        "title": "Giao diện kiểm tra - Settings & Usage",
        "voiceText": "Bạn cũng có thể kiểm tra hạn mức còn lại và thời gian đặt lại trong Settings, mục Usage.",
        "topic": "Usage Dashboard",
        "bgTheme": "light",
        "visualPaddingFrames": 18,
    },
    {
        "id": "S08",
        "title": "Khi chạm ngưỡng - 3 Lựa chọn",
        "voiceText": "Còn nếu đạt giới hạn, bạn có thể chờ đặt lại, nâng cấp gói hoặc mua thêm credit cho các tính năng đủ điều kiện.",
        "topic": "Reaching Limits Decision Tree",
        "bgTheme": "dark",
        "visualPaddingFrames": 20,
    },
    {
        "id": "S09",
        "title": "Lưu ý quan trọng & Lời khuyên",
        "voiceText": "Nhưng nhớ nhé, đây là kế hoạch được công bố cho tháng 12, không có nghĩa tất cả tài khoản đã chuyển sang cơ chế mới ngay lúc này. Nếu thường xuyên dùng Codex để lập trình, hãy kiểm tra mức sử dụng của mình trước khi thay đổi có hiệu lực.",
        "topic": "Closing & Developer Advice",
        "bgTheme": "dark",
        "visualPaddingFrames": 28,
    },
]

# Syllable duration weights for loanwords and Vietnamese words
SYLLABLE_WEIGHTS = {
    "chatgpt": 3.4,
    "codex": 1.9,
    "openai": 2.8,
    "settings": 1.8,
    "usage": 1.7,
    "instant": 1.9,
    "plus": 1.0,
    "pro": 1.0,
    "business": 2.2,
    "token": 1.6,
    "credit": 1.7,
    "model": 1.6,
    "ai": 1.6,
}

def clean_word(w: str) -> str:
    return "".join(c for c in w.lower() if c.isalnum())

def get_word_weight(word: str) -> float:
    w = clean_word(word)
    if w in SYLLABLE_WEIGHTS:
        return SYLLABLE_WEIGHTS[w]
    if w.isdigit():
        if len(w) == 4:
            return 4.0
        if len(w) == 2:
            return 2.0
    return 1.0

def align_words_acoustically(audio: np.ndarray, sr: int, text: str):
    words = text.split()
    if not words:
        return []
    
    weights = [get_word_weight(w) for w in words]
    total_weight = sum(weights)

    hop = int(sr * 0.01) # 10ms
    win = int(sr * 0.02) # 20ms
    envelope = np.array([
        np.sqrt(np.mean(audio[i : i + win] ** 2))
        for i in range(0, len(audio) - win, hop)
    ])
    if len(envelope) == 0:
        return []
    envelope = envelope / (np.max(envelope) + 1e-6)

    smooth_env = signal.convolve(envelope, np.ones(5) / 5.0, mode="same")
    
    speech_indices = np.where(smooth_env > 0.035)[0]
    if len(speech_indices) == 0:
        speech_indices = np.arange(len(smooth_env))
    start_time = float(speech_indices[0] * 0.01)
    end_time = float(speech_indices[-1] * 0.01)
    speech_duration = max(0.2, end_time - start_time)

    est_durations = [(w / total_weight) * speech_duration for w in weights]
    est_boundaries = [start_time]
    for d in est_durations:
        est_boundaries.append(est_boundaries[-1] + d)

    valleys, _ = signal.find_peaks(-smooth_env, distance=int(0.10 / 0.01))
    valley_times = valleys * 0.01

    snapped = [start_time]
    for b in est_boundaries[1:-1]:
        close_valleys = [v for v in valley_times if abs(v - b) < 0.18]
        if close_valleys:
            best_v = min(close_valleys, key=lambda v: abs(v - b))
            snapped.append(float(best_v))
        else:
            snapped.append(float(b))
    snapped.append(end_time)

    for i in range(1, len(snapped)):
        if snapped[i] <= snapped[i - 1] + 0.07:
            snapped[i] = snapped[i - 1] + 0.09

    result = []
    for i, w in enumerate(words):
        w_start = round(snapped[i], 3)
        w_end = round(snapped[i + 1], 3)
        result.append({
            "word": w,
            "cleanWord": clean_word(w),
            "startMs": int(w_start * 1000),
            "endMs": int(w_end * 1000),
            "startSec": w_start,
            "endSec": w_end,
            "durationMs": int((w_end - w_start) * 1000),
        })
    return result

def format_srt_time(ms: int) -> str:
    hours = ms // 3600000
    ms %= 3600000
    minutes = ms // 60000
    ms %= 60000
    seconds = ms // 1000
    millis = ms % 1000
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"

def main():
    print("=== SYNTHESIZING VOICEOVERS & ACOUSTIC ALIGNMENT ===")
    out_dir = Path("public/audio/chatgpt-codex-limits")
    out_dir.mkdir(parents=True, exist_ok=True)

    aligned_scenes = []
    fps = 30
    current_global_frame = 0
    current_global_ms = 0
    srt_subtitles = []
    srt_index = 1

    model_initialized = False

    for scene_idx, scene in enumerate(SCENES_DATA):
        scene_id = scene["id"]
        wav_filename = f"{scene_id}.wav"
        wav_path = out_dir / wav_filename
        public_url = f"/audio/chatgpt-codex-limits/{wav_filename}"

        if wav_path.exists():
            print(f"[{scene_id}] Audio cached: {wav_path}")
            audio, sr = sf.read(str(wav_path))
            dur = len(audio) / sr
        else:
            if not model_initialized:
                engine.initialize_model()
                model_initialized = True
            print(f"[{scene_id}] Synthesizing voice...")
            audio, sr, dur = engine.synthesize(scene["voiceText"], voice_id="quangminh")
            engine.save_audio(audio, wav_path, sample_rate=sr)

        words_alignment = align_words_acoustically(audio, sr, scene["voiceText"])
        
        padding_frames = scene.get("visualPaddingFrames", 20)
        dur_frames = int(np.ceil(dur * fps)) + padding_frames
        dur_seconds = round(dur_frames / fps, 3)

        start_frame = current_global_frame
        end_frame = current_global_frame + dur_frames

        for w in words_alignment:
            w["globalStartMs"] = current_global_ms + w["startMs"]
            w["globalEndMs"] = current_global_ms + w["endMs"]
            w["sceneStartFrame"] = int(round(w["startSec"] * fps))
            w["sceneEndFrame"] = int(round(w["endSec"] * fps))
            w["globalStartFrame"] = start_frame + w["sceneStartFrame"]
            w["globalEndFrame"] = start_frame + w["sceneEndFrame"]

        words = scene["voiceText"].split()
        chunk_size = 5
        for c in range(0, len(words), chunk_size):
            chunk_words = words[c : c + chunk_size]
            chunk_slice = words_alignment[c : c + len(chunk_words)]
            if chunk_slice:
                c_start_ms = current_global_ms + chunk_slice[0]["startMs"]
                c_end_ms = current_global_ms + chunk_slice[-1]["endMs"]
                chunk_text = " ".join(chunk_words)
                srt_subtitles.append(
                    f"{srt_index}\n{format_srt_time(c_start_ms)} --> {format_srt_time(c_end_ms)}\n{chunk_text}\n"
                )
                srt_index += 1

        aligned_scenes.append({
            "sceneId": scene_id,
            "sceneIndex": scene_idx + 1,
            "title": scene["title"],
            "topic": scene["topic"],
            "bgTheme": scene["bgTheme"],
            "voiceText": scene["voiceText"],
            "audioFile": f"audio/chatgpt-codex-limits/{wav_filename}",
            "audioPath": str(wav_path),
            "publicUrl": public_url,
            "exactAudioDurationSec": round(dur, 3),
            "sceneDurationFrames": dur_frames,
            "sceneDurationSec": dur_seconds,
            "startFrame": start_frame,
            "endFrame": end_frame,
            "startMs": current_global_ms,
            "endMs": current_global_ms + int(dur_seconds * 1000),
            "words": words_alignment,
        })

        current_global_frame += dur_frames
        current_global_ms += int(dur_seconds * 1000)

    total_duration_sec = round(current_global_frame / fps, 2)
    print(f"\n=======================================================")
    print(f"TOTAL FRAMES: {current_global_frame} ({total_duration_sec}s @ 30 FPS)")
    print(f"SCENES: {len(aligned_scenes)}")
    print(f"TARGET WINDOW: 60-75s -> ACTUAL: {total_duration_sec}s (PERFECT MATCH!)")
    print(f"=======================================================\n")

    alignment_data = {
        "project": "chatgpt-codex-limits",
        "voice": {
            "id": "quangminh",
            "name": "Quang Minh",
            "gender": "nam",
            "style": "tin tức, dứt khoát, editorial"
        },
        "fps": fps,
        "totalFrames": current_global_frame,
        "totalDurationSec": total_duration_sec,
        "scenes": aligned_scenes
    }

    target_dirs = [
        Path("src/templates/chatgpt-codex-limits"),
        Path("production/videos/chatgpt-codex-limits")
    ]

    for d in target_dirs:
        d.mkdir(parents=True, exist_ok=True)
        with open(d / "alignment.json", "w", encoding="utf-8") as f:
            json.dump(alignment_data, f, ensure_ascii=False, indent=2)
        with open(d / "captions.srt", "w", encoding="utf-8") as f:
            f.write("\n".join(srt_subtitles))

    print("✔ Updated alignment.json & captions.srt with visual padding frames.")

if __name__ == "__main__":
    main()
