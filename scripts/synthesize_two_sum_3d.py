import os
import sys
import json
import numpy as np
import scipy.signal as signal
import soundfile as sf

# Add tts-service to path
sys.path.insert(0, os.path.abspath("tts-service"))
from app.services.zerotts_engine import engine

VOICE_ID = "quangminh"
FPS = 30
SAMPLE_RATE = 48000

SCENES_DATA = [
  {
    "sceneId": "scene01",
    "name": "Hook",
    "title": "Cảnh 1 · Mở Đầu",
    "text": "Nếu bạn đi phỏng vấn lập trình, gần như chắc chắn sẽ gặp bài toán Two Sum. Nhưng tại sao có người mất O n bình phương, trong khi cao thủ chỉ giải trong một vòng lặp?"
  },
  {
    "sceneId": "scene02",
    "name": "Problem",
    "title": "Cảnh 2 · Đề Bài Two Sum",
    "text": "Đề bài cho một mảng số nguyên và một mục tiêu target. Nhiệm vụ của bạn là tìm vị trí của hai số có tổng đúng bằng target. Nhớ kỹ nhé, chúng ta cần trả về chỉ số index, chứ không phải giá trị của số đó."
  },
  {
    "sceneId": "scene03",
    "name": "BruteForce",
    "title": "Cảnh 3 · Vét Cạn Brute Force",
    "text": "Cách trực quan nhất là thử mọi cặp số bằng hai vòng lặp lồng nhau. Con trỏ i đứng ở phần tử đầu tiên, con trỏ j chạy quét qua tất cả các phần tử còn lại để tính tổng."
  },
  {
    "sceneId": "scene04",
    "name": "Complexity",
    "title": "Cảnh 4 · Tại Sao Lại O(n²)?",
    "text": "Với bốn phần tử, số phép so sánh chưa nhiều. Nhưng khi mảng có mười nghìn số, hai vòng lặp này sẽ thực hiện gần năm mươi triệu phép tính. Thời gian O n bình phương sẽ khiến hệ thống nghẽn lại."
  },
  {
    "sceneId": "scene05",
    "name": "HashMap",
    "title": "Cảnh 5 · Ý Tưởng Hash Map",
    "text": "Để tối ưu, hãy thay đổi góc nhìn. Thay vì mải miết đi tìm số thứ hai ở tương lai, tại sao không ghi nhớ những số ta đã từng đi qua? Đó chính là lúc Hash Map xuất hiện."
  },
  {
    "sceneId": "scene06",
    "name": "Complement",
    "title": "Cảnh 6 · Phép Tính Bù Complement",
    "text": "Với mỗi số hiện tại, ta chỉ cần tìm phần bù bằng target trừ đi chính nó. Tại số hai, phần bù là bảy. Bảng đang trống, ta lưu hai vào vị trí số không. Bước sang số bảy, phần bù là hai. Tra vào bảng: số hai đã có sẵn ở vị trí số không!"
  },
  {
    "sceneId": "scene07",
    "name": "Match",
    "title": "Cảnh 7 · Khớp Kết Quả Hoàn Hảo",
    "text": "Bùm! Hai cộng bảy đúng bằng chín. Ta lấy ngay được chỉ số không từ bảng và chỉ số một hiện tại. Kết quả là mảng không, một. Cực kỳ nhanh gọn chỉ với một lần duyệt duy nhất!"
  },
  {
    "sceneId": "scene08",
    "name": "Mistakes",
    "title": "Cảnh 8 · Những Cái Bẫy Phổ Biến",
    "text": "Có ba cái bẫy lớn: trả về giá trị thay vì chỉ số; tái sử dụng chính một phần tử hai lần; và xử lý trùng lặp như mảng ba, ba mục tiêu sáu. Nếu bạn thêm vào bảng trước khi kiểm tra, số ba sẽ tự bắt cặp với chính nó!"
  },
  {
    "sceneId": "scene09",
    "name": "Comparison",
    "title": "Cảnh 9 · So Sánh Độ Phức Tạp",
    "text": "Hãy nhìn sự khác biệt: Vét cạn tốn O n bình phương thời gian nhưng chỉ O một bộ nhớ. Hash Map chỉ mất O n thời gian nhờ đánh đổi thêm O n không gian lưu trữ. Đây là sự đánh đổi kinh điển trong khoa học máy tính."
  },
  {
    "sceneId": "scene10",
    "name": "Outro",
    "title": "Cảnh 10 · Tổng Kết & CTA",
    "text": "Đừng vét cạn mọi cặp số, hãy nhớ lại quá khứ và tìm kiếm phần bù. Đăng ký kênh DevPeek36 để làm chủ các thuật toán LeetCode tiếp theo nhé!"
  }
]

def align_words_acoustically(audio, sr, text):
    words = [w.strip() for w in text.split() if w.strip()]
    if not words:
        return []

    syllable_weights = [max(1, len(w)) for w in words]
    total_weight = sum(syllable_weights)

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

    est_durations = [(w / total_weight) * speech_duration for w in syllable_weights]
    est_boundaries = [start_time]
    for d in est_durations:
        est_boundaries.append(est_boundaries[-1] + d)

    valleys, _ = signal.find_peaks(-smooth_env, distance=int(0.10 / 0.01))
    valley_times = valleys * 0.01

    snapped_boundaries = [start_time]
    for b in est_boundaries[1:-1]:
        near = [v for v in valley_times if abs(v - b) < 0.12]
        if near:
            snapped_boundaries.append(float(min(near, key=lambda v: abs(v - b))))
        else:
            snapped_boundaries.append(float(b))
    snapped_boundaries.append(end_time)

    word_timings = []
    for i, w in enumerate(words):
        w_start = snapped_boundaries[i]
        w_end = max(w_start + 0.08, snapped_boundaries[i + 1])
        word_timings.append({
            "text": w,
            "relStartMs": int(round(w_start * 1000)),
            "relEndMs": int(round(w_end * 1000)),
        })
    return word_timings

def format_srt_time(ms):
    hours = ms // 3600000
    minutes = (ms % 3600000) // 60000
    seconds = (ms % 60000) // 1000
    milli = ms % 1000
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milli:03d}"

def main():
    print(f"Synthesizing Two Sum 3D voice tracks with ZeroTTS ({VOICE_ID})...")
    os.makedirs("public/audio/two-sum-3d", exist_ok=True)
    os.makedirs("production/videos/two-sum-3d", exist_ok=True)
    os.makedirs("src/templates/two-sum-3d", exist_ok=True)
    
    current_global_frame = 0
    all_scenes_alignment = []
    all_srt_entries = []
    srt_counter = 1
    
    scene_timings = []
    
    for idx, sc in enumerate(SCENES_DATA):
        print(f"[{idx+1}/{len(SCENES_DATA)}] Synthesizing {sc['sceneId']}: {sc['name']}...")
        audio, sr, duration_sec = engine.synthesize(sc["text"], VOICE_ID)
        
        wav_filename = f"public/audio/two-sum-3d/{sc['sceneId']}.wav"
        sf.write(wav_filename, audio, sr)
            
        print(f"  -> Generated {wav_filename} ({duration_sec:.2f}s, {sr}Hz)")
        
        # Audio duration in frames (with padding for visual comprehension)
        audio_frames = int(np.ceil(duration_sec * FPS))
        scene_padding_frames = 20 # 0.67s padding per scene for scene pacing
        scene_total_frames = audio_frames + scene_padding_frames
        
        scene_start_frame = current_global_frame
        audio_offset_frame = scene_start_frame + 8 # 8 frames pause before voice starts
        
        # Word alignment
        local_words = align_words_acoustically(audio, sr, sc["text"])
        
        # Global alignment
        global_words = []
        for w in local_words:
            abs_start_ms = int((audio_offset_frame / FPS) * 1000) + w["relStartMs"]
            abs_end_ms = int((audio_offset_frame / FPS) * 1000) + w["relEndMs"]
            w_start_frame = int(np.floor((abs_start_ms / 1000.0) * FPS))
            w_end_frame = int(np.ceil((abs_end_ms / 1000.0) * FPS))
            global_words.append({
                "text": w["text"],
                "relStartMs": w["relStartMs"],
                "relEndMs": w["relEndMs"],
                "absStartMs": abs_start_ms,
                "absEndMs": abs_end_ms,
                "startFrame": w_start_frame,
                "endFrame": w_end_frame
            })
            
        # Group words into 5-7 word subtitle phrases for clean 2-line karaoke
        phrases = []
        phrase_size = 6
        for p_idx in range(0, len(global_words), phrase_size):
            p_words = global_words[p_idx:p_idx+phrase_size]
            phrase_text = " ".join([w["text"] for w in p_words])
            p_start_frame = p_words[0]["startFrame"]
            p_end_frame = p_words[-1]["endFrame"]
            p_start_ms = p_words[0]["absStartMs"]
            p_end_ms = p_words[-1]["absEndMs"]
            
            phrases.append({
                "phraseText": phrase_text,
                "startMs": p_start_ms,
                "endMs": p_end_ms,
                "startFrame": p_start_frame,
                "endFrame": p_end_frame,
                "words": p_words
            })
            
            # SRT Entry
            all_srt_entries.append(
                f"{srt_counter}\n"
                f"{format_srt_time(p_start_ms)} --> {format_srt_time(p_end_ms)}\n"
                f"{phrase_text}\n"
            )
            srt_counter += 1
            
        scene_info = {
            "sceneId": sc["sceneId"],
            "name": sc["name"],
            "title": sc["title"],
            "audioFile": f"audio/two-sum-3d/{sc['sceneId']}.wav",
            "audioDurationSec": round(duration_sec, 2),
            "startFrame": scene_start_frame,
            "durationInFrames": scene_total_frames,
            "audioOffsetFrame": audio_offset_frame,
            "phrases": phrases,
            "words": global_words
        }
        all_scenes_alignment.append(scene_info)
        
        scene_timings.append({
            "sceneId": sc["sceneId"],
            "name": sc["name"],
            "startFrame": scene_start_frame,
            "durationInFrames": scene_total_frames,
            "durationSec": round(scene_total_frames / FPS, 2)
        })
        
        current_global_frame += scene_total_frames

    total_duration_sec = current_global_frame / FPS
    print(f"\nTotal video frames: {current_global_frame} ({total_duration_sec:.2f} seconds)")

    # Save alignment.json
    alignment_path = "production/videos/two-sum-3d/alignment.json"
    with open(alignment_path, "w", encoding="utf-8") as f:
        json.dump(all_scenes_alignment, f, ensure_ascii=False, indent=2)
    print(f"Saved {alignment_path}")
    
    # Also save to src/templates/two-sum-3d/alignment.json for direct import
    with open("src/templates/two-sum-3d/alignment.json", "w", encoding="utf-8") as f:
        json.dump(all_scenes_alignment, f, ensure_ascii=False, indent=2)

    # Save captions.srt
    srt_path = "production/videos/two-sum-3d/captions.srt"
    with open(srt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(all_srt_entries))
    print(f"Saved {srt_path}")

    # Save scene-plan.json
    scene_plan = {
        "title": "Two Sum 3D Algorithm Explainer",
        "fps": FPS,
        "width": 1080,
        "height": 1920,
        "totalFrames": current_global_frame,
        "totalDurationSeconds": round(total_duration_sec, 2),
        "voice": VOICE_ID,
        "scenes": scene_timings
    }
    with open("production/videos/two-sum-3d/scene-plan.json", "w", encoding="utf-8") as f:
        json.dump(scene_plan, f, ensure_ascii=False, indent=2)
    print(f"Saved production/videos/two-sum-3d/scene-plan.json")

if __name__ == "__main__":
    main()
