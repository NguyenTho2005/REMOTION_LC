import os
import json
import numpy as np
import scipy.signal as signal
from pathlib import Path
import soundfile as sf
from app.services.zerotts_engine import engine

OUTPUT_DIR = Path("public/audio/truoc-va-sau-ai")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ALIGNMENT_OUTPUT = Path("src/templates/truoc-va-sau-ai/script/alignment.json")
ALIGNMENT_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

SRT_OUTPUT = Path("src/templates/truoc-va-sau-ai/script/captions.srt")

ACTS_DATA = [
    {
        "actId": "act1",
        "title": "Hồi 1 · Thói Quen Cũ",
        "voiceText": "Bạn có nhớ cảm giác phải mất cả buổi tối chỉ để tìm câu trả lời cho một câu hỏi không? Đồng hồ điểm mười một giờ đêm. Trên bàn làm việc của Minh là đống giấy tờ ngổn ngang, tách cà phê nguội ngắt và màn hình laptop mở hơn hai mươi tab trình duyệt. Chỉ một đoạn văn bản hay một công thức tính toán đơn giản, mà mất hàng giờ lục lọi, chắp vá từ diễn đàn này sang trang tin khác.",
        "startFrame": 0,
        "durationInFrames": 1350, # 45s @ 30fps
        "audioOffsetFrame": 90,   # Narration starts at frame 90 (3s hold)
    },
    {
        "actId": "act2",
        "title": "Hồi 2 · Cuộc Sống Trước Generative AI",
        "voiceText": "Ngày đó, học một khái niệm mới đồng nghĩa với việc lật từng trang sách, ghi chú dày đặc vào cuốn sổ tay. Khi gặp một lỗi lập trình bí ẩn hay một tài liệu học tập phức tạp, Minh phải tự mình suy luận, kiên nhẫn thử và sai. Mọi thứ diễn ra chậm hơn rất nhiều so với bây giờ. Nhưng chính sự chậm rãi ấy đã rèn luyện cho con người tính kiên trì, khả năng phân tích sâu và niềm vui vỡ òa khi tự mình giải quyết được một vấn đề hóc búa.",
        "startFrame": 1350,
        "durationInFrames": 1500, # 50s @ 30fps
        "audioOffsetFrame": 1410, # Narration starts at frame 1410 (2s hold)
    },
    {
        "actId": "act3",
        "title": "Hồi 3 · Sự Xuất Hiện Của AI Phổ Cập",
        "voiceText": "Thế rồi, một trợ lý thông minh bất ngờ xuất hiện ngay trên màn hình máy tính. Minh gõ thử một câu hỏi ngập ngừng. Chỉ vài giây sau, câu trả lời hoàn chỉnh hiện ra rõ ràng. Những dòng suy nghĩ rối như tơ vò bỗng được tóm tắt thành sơ đồ mạch lạc. Hàng giờ gõ máy lặp đi lặp lại bỗng chốc thu gọn trong một câu lệnh. Minh ngỡ ngàng, tim đập nhanh vì kinh ngạc và phấn khích trước cánh cửa tương lai mở toang.",
        "startFrame": 2850,
        "durationInFrames": 1200, # 40s @ 30fps
        "audioOffsetFrame": 2910, # Narration starts at frame 2910 (2s hold)
    },
    {
        "actId": "act4",
        "title": "Hồi 4 · Vạn Vật Đổi Thay",
        "voiceText": "Không chỉ riêng Minh, làn sóng công nghệ lan tỏa khắp mọi ngóc ngách cuộc sống. Một bạn sinh viên có thêm gia sư tận tụy để giải thích từng bài tập hóc búa. Người lập trình viên tìm ra lỗi dòng mã chỉ trong chớp mắt. Chị chủ cửa hàng nhỏ tự tin soạn thảo những bức thư ngỏ chuyên nghiệp gửi đối tác. Một nhà thiết kế trẻ thỏa sức phác thảo ý tưởng từ các gợi ý sơ khởi. Và ngay cả người cao tuổi trong gia đình cũng hào hứng nhờ trợ lý ảo giải thích những khái niệm công nghệ mới mẻ. Mọi rào cản dường như đang bị san phẳng.",
        "startFrame": 4050,
        "durationInFrames": 1950, # 65s @ 30fps
        "audioOffsetFrame": 4110, # Narration starts at frame 4110 (2s hold)
    },
    {
        "actId": "act5",
        "title": "Hồi 5 · Cú Vấp Bất Ngờ & Điểm Nghẽn",
        "voiceText": "Nhưng sự tiện lợi quá mức bắt đầu tạo ra một cái bẫy vô hình. Minh dần ỷ lại vào chiếc hộp thoại thông minh. Anh sao chép một câu trả lời trôi chảy nhưng chứa dữ liệu bịa đặt vào bản báo cáo quan trọng. Trong buổi họp, người đồng nghiệp tinh ý chỉ ra lỗ hổng chết người. Minh sững sờ, xấu hổ đến nghẹn lời. Màn hình ngập tràn những gợi ý tự động hoa mỹ nhưng rỗng tuếch. Cảm giác hoang mang, sợ hãi bị thay thế và mất dần năng lực tư duy ập đến. Minh dừng lại. Anh gấp máy tính. Căn phòng chìm vào tĩnh lặng.",
        "startFrame": 6000,
        "durationInFrames": 1650, # 55s @ 30fps
        "audioOffsetFrame": 6060, # Narration starts at frame 6060 (2s hold)
    },
    {
        "actId": "act6",
        "title": "Hồi 6 · Lựa Chọn Của Con Người",
        "voiceText": "Ngày hôm sau, Minh trở lại bàn làm việc với một tâm thế hoàn toàn mới. Góc bàn giờ đây cân bằng và ngăn nắp. Một bên là màn hình trợ lý AI, một bên là cuốn sổ tay thân thuộc. Anh dùng AI để gợi mở góc nhìn, nhưng tự tay kiểm chứng từng sự thật, đưa ra quyết định độc lập và gửi gắm cảm xúc chân thật của chính mình. AI có thể giúp chúng ta làm nhanh hơn. Nhưng quyết định điều gì đáng làm, điều gì đúng, và điều gì có ý nghĩa... vẫn mãi là trách nhiệm và đặc ân của con người.",
        "startFrame": 7650,
        "durationInFrames": 1350, # 45s @ 30fps
        "audioOffsetFrame": 7710, # Narration starts at frame 7710 (2s hold)
    },
]

SYLLABLE_WEIGHTS = {
    "ai": 1.6,
    "laptop": 2.0,
    "tab": 1.0,
    "zero": 1.6,
    "code": 1.2,
    "format": 1.8,
    "copy": 1.6,
    "paste": 1.0,
}

def clean_word(w: str) -> str:
    return "".join(c for c in w.lower() if c.isalnum())

def get_word_weight(word: str) -> float:
    w = clean_word(word)
    if w in SYLLABLE_WEIGHTS:
        return SYLLABLE_WEIGHTS[w]
    if w.isdigit():
        return float(len(w))
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
            "startMs": int(round(w_start * 1000)),
            "endMs": int(round(w_end * 1000)),
        })
    return word_timings

def format_srt_time(ms: int) -> str:
    hrs = ms // 3600000
    ms %= 3600000
    mins = ms // 60000
    ms %= 60000
    secs = ms // 1000
    rem_ms = ms % 1000
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{rem_ms:03d}"

def main():
    print("=== SYNTHESIZING NARRATION & ACOUSTIC ALIGNMENT (ZEROTTS) ===")
    all_alignment_data = []
    srt_entries = []
    srt_counter = 1

    for act in ACTS_DATA:
        act_id = act["actId"]
        voice_text = act["voiceText"]
        audio_offset_frame = act["audioOffsetFrame"]
        offset_ms = int(round((audio_offset_frame / 30.0) * 1000))

        print(f"\n[+] Synthesizing {act_id}: '{act['title']}'...")
        audio, sr, duration_sec = engine.synthesize(voice_text, "giahuy")
        audio_path = OUTPUT_DIR / f"{act_id}.wav"
        sf.write(str(audio_path), audio, sr)
        print(f"    Saved: {audio_path} ({duration_sec:.2f}s, {sr}Hz)")

        word_alignments = align_words_acoustically(audio, sr, voice_text)
        print(f"    Aligned: {len(word_alignments)} words")

        # Group words into readable phrases (approx 6-9 words per caption line)
        phrases = []
        words = word_alignments
        chunk_size = 7
        for i in range(0, len(words), chunk_size):
            group = words[i : i + chunk_size]
            phrase_text = " ".join(w["text"] for w in group)
            p_start_rel = group[0]["startMs"]
            p_end_rel = group[-1]["endMs"]

            p_start_abs = offset_ms + p_start_rel
            p_end_abs = offset_ms + p_end_rel

            phrases.append({
                "phraseText": phrase_text,
                "startMs": p_start_rel,
                "endMs": p_end_rel,
                "absStartMs": p_start_abs,
                "absEndMs": p_end_abs,
                "startFrame": int(round((p_start_abs / 1000.0) * 30.0)),
                "endFrame": int(round((p_end_abs / 1000.0) * 30.0)),
                "words": [
                    {
                        "text": w["text"],
                        "relStartMs": w["startMs"],
                        "relEndMs": w["endMs"],
                        "absStartMs": offset_ms + w["startMs"],
                        "absEndMs": offset_ms + w["endMs"],
                        "startFrame": int(round(((offset_ms + w["startMs"]) / 1000.0) * 30.0)),
                        "endFrame": int(round(((offset_ms + w["endMs"]) / 1000.0) * 30.0)),
                    }
                    for w in group
                ]
            })

            # Append to SRT
            srt_entries.append(
                f"{srt_counter}\n"
                f"{format_srt_time(p_start_abs)} --> {format_srt_time(p_end_abs)}\n"
                f"{phrase_text}\n"
            )
            srt_counter += 1

        all_alignment_data.append({
            "actId": act_id,
            "title": act["title"],
            "audioFile": f"audio/truoc-va-sau-ai/{act_id}.wav",
            "audioDurationSec": duration_sec,
            "audioOffsetFrame": audio_offset_frame,
            "offsetMs": offset_ms,
            "startFrame": act["startFrame"],
            "durationInFrames": act["durationInFrames"],
            "phrases": phrases,
            "words": [
                {
                    "text": w["text"],
                    "relStartMs": w["startMs"],
                    "relEndMs": w["endMs"],
                    "absStartMs": offset_ms + w["startMs"],
                    "absEndMs": offset_ms + w["endMs"],
                    "startFrame": int(round(((offset_ms + w["startMs"]) / 1000.0) * 30.0)),
                    "endFrame": int(round(((offset_ms + w["endMs"]) / 1000.0) * 30.0)),
                }
                for w in word_alignments
            ]
        })

    # Save alignment.json
    with open(ALIGNMENT_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(all_alignment_data, f, ensure_ascii=False, indent=2)
    print(f"\n[✔] Wrote alignment data to {ALIGNMENT_OUTPUT}")

    # Save captions.srt
    with open(SRT_OUTPUT, "w", encoding="utf-8") as f:
        f.write("\n".join(srt_entries))
    print(f"[✔] Wrote SRT subtitles to {SRT_OUTPUT}")

if __name__ == "__main__":
    main()
