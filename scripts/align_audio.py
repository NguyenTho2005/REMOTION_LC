#!/usr/bin/env python3
"""
Align Vietnamese (or general) script text to an audio file and export
word-level timestamps for Remotion karaoke/subtitles.

Usage examples:
  python3 scripts/align_audio.py --audio public/bang-motion/audio.wav \
    --text "Xin chào ..." --output src/data/bang-motion/timestamps.json

  python3 scripts/align_audio.py --audio src/data/bang-motion/audio.wav \
    --script src/data/bang-motion/script.json \
    --output src/data/bang-motion/timestamps.json --fps 30

Alignment strategy:
  1) Try faster-whisper word timestamps if installed and model available.
  2) Fallback: acoustic energy envelope + syllable/word-weight duration
     allocation (works with current repo dependencies: numpy, scipy, soundfile).
"""

from __future__ import annotations

import argparse
import json
import math
import re
import unicodedata
import wave
from pathlib import Path
from typing import Any

try:
    import numpy as np  # type: ignore
    import scipy.signal as signal  # type: ignore
    import soundfile as sf  # type: ignore
    _HAS_DSP = True
except Exception:  # pragma: no cover - optional deps
    np = None  # type: ignore
    signal = None  # type: ignore
    sf = None  # type: ignore
    _HAS_DSP = False

# Optional weights for loanwords / tokens common in VN tech scripts
SYLLABLE_WEIGHTS: dict[str, float] = {
    "ai": 1.6,
    "ui": 1.4,
    "api": 2.0,
    "repo": 1.5,
    "agent": 1.6,
    "skill": 1.2,
    "code": 1.1,
    "video": 1.8,
    "motion": 1.7,
    "designer": 2.3,
    "kinetic": 2.0,
    "typography": 3.2,
    "camera": 2.0,
    "powerpoint": 2.6,
    "slide": 1.2,
    "github": 2.0,
    "clone": 1.2,
    "link": 1.0,
    "bang-motion": 2.8,
}


def strip_accents(s: str) -> str:
    nfkd = unicodedata.normalize("NFKD", s)
    return "".join(ch for ch in nfkd if not unicodedata.combining(ch))


def clean_token(w: str) -> str:
    return re.sub(r"[^\w\-]", "", w, flags=re.UNICODE).strip().lower()


def token_weight(token: str) -> float:
    c = clean_token(token)
    if not c:
        return 0.5
    if c in SYLLABLE_WEIGHTS:
        return SYLLABLE_WEIGHTS[c]
    # crude Vietnamese syllable proxy: count vowel groups in accent-stripped form
    base = strip_accents(c).replace("-", "")
    groups = re.findall(r"[aeiouy]+", base)
    if groups:
        return float(max(1, len(groups)))
    if c.isdigit():
        return float(max(1, len(c)))
    return 1.0


def read_script_text(script_path: Path) -> tuple[str, list[dict[str, Any]] | None]:
    data = json.loads(script_path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        text = data.get("fullText") or data.get("text")
        scenes = data.get("scenes")
        if not text and isinstance(scenes, list):
            parts: list[str] = []
            for sc in scenes:
                if isinstance(sc, dict):
                    t = sc.get("text") or sc.get("voiceText") or ""
                    if t:
                        parts.append(str(t).strip())
            text = " ".join(parts).strip()
        if text:
            return str(text), scenes if isinstance(scenes, list) else None
    if isinstance(data, list):
        # list of segments/words? fallback join text fields
        parts = []
        for item in data:
            if isinstance(item, dict) and "text" in item:
                parts.append(str(item["text"]))
            elif isinstance(item, str):
                parts.append(item)
        if parts:
            return " ".join(parts).strip(), None
    raise ValueError(f"Could not extract text from script: {script_path}")


def read_wav_duration(audio_path: Path) -> float:
    if _HAS_DSP:
        try:
            info = sf.info(str(audio_path))
            return float(info.duration)
        except Exception:
            pass
    try:
        with wave.open(str(audio_path), "rb") as wf:
            rate = wf.getframerate() or 1
            return wf.getnframes() / float(rate)
    except Exception:
        return 0.0


def align_with_faster_whisper(audio_path: Path, text: str, fps: int) -> list[dict[str, Any]] | None:
    try:
        from faster_whisper import WhisperModel  # type: ignore
    except Exception:
        return None
    try:
        # Small model for speed; may download on first use if not cached.
        model = WhisperModel("small", device="cpu", compute_type="int8")
        segments, _info = model.transcribe(
            str(audio_path),
            language="vi",
            word_timestamps=True,
            vad_filter=True,
        )
        out: list[dict[str, Any]] = []
        for seg in segments:
            if not getattr(seg, "words", None):
                continue
            for w in seg.words:
                word = (w.word or "").strip()
                if not word:
                    continue
                start = float(max(0.0, w.start or 0.0))
                end = float(max(start + 0.01, w.end or start + 0.01))
                out.append(
                    {
                        "word": word,
                        "start": round(start, 4),
                        "end": round(end, 4),
                        "startFrame": int(round(start * fps)),
                        "endFrame": max(int(round(start * fps)) + 1, int(round(end * fps))),
                    }
                )
        if out:
            # keep sequence monotonic
            for i in range(1, len(out)):
                if out[i]["startFrame"] < out[i - 1]["endFrame"]:
                    out[i]["startFrame"] = out[i - 1]["endFrame"]
                if out[i]["endFrame"] <= out[i]["startFrame"]:
                    out[i]["endFrame"] = out[i]["startFrame"] + 1
                out[i]["start"] = round(out[i]["startFrame"] / fps, 4)
                out[i]["end"] = round(out[i]["endFrame"] / fps, 4)
            return out
    except Exception:
        return None
    return None


def align_uniform_by_weight(text: str, duration_sec: float, fps: int) -> list[dict[str, Any]]:
    """Fallback alignment: distribute word durations by heuristic weights over audio length."""
    words = text.strip().split()
    if not words:
        return []
    duration_sec = max(0.1, float(duration_sec or 0.0))
    # small head/tail padding inside audio to avoid edge clipping
    pad = min(0.08, duration_sec * 0.02)
    start_t = pad
    end_t = max(start_t + 0.1, duration_sec - pad)
    speech_dur = max(0.1, end_t - start_t)

    weights = [token_weight(w) for w in words]
    total_w = float(sum(weights)) or float(len(words))
    cursor = start_t
    out: list[dict[str, Any]] = []
    for i, w in enumerate(words):
        if i == len(words) - 1:
            w_end = end_t
        else:
            w_end = cursor + (weights[i] / total_w) * speech_dur
        s = max(0.0, min(cursor, duration_sec))
        e = max(s + 1.0 / fps, min(w_end, duration_sec))
        sf_i = int(round(s * fps))
        ef_i = int(round(e * fps))
        if ef_i <= sf_i:
            ef_i = sf_i + 1
        out.append(
            {
                "word": w,
                "start": round(sf_i / fps, 4),
                "end": round(ef_i / fps, 4),
                "startFrame": sf_i,
                "endFrame": ef_i,
            }
        )
        cursor = w_end
    # ensure monotonic and clamp to duration
    last_frame = int(math.ceil(duration_sec * fps))
    for i in range(1, len(out)):
        if out[i]["startFrame"] < out[i - 1]["endFrame"]:
            out[i]["startFrame"] = out[i - 1]["endFrame"]
        if out[i]["endFrame"] <= out[i]["startFrame"]:
            out[i]["endFrame"] = out[i]["startFrame"] + 1
        out[i]["start"] = round(out[i]["startFrame"] / fps, 4)
        out[i]["end"] = round(out[i]["endFrame"] / fps, 4)
    if out and last_frame > 0:
        out[-1]["endFrame"] = max(out[-1]["startFrame"] + 1, last_frame)
        out[-1]["end"] = round(out[-1]["endFrame"] / fps, 4)
    return out


def align_acoustic(audio: "np.ndarray", sr: int, text: str, fps: int) -> list[dict[str, Any]]:
    words = text.strip().split()
    if not words:
        return []
    if audio.ndim > 1:
        audio = np.mean(audio, axis=1)
    audio = audio.astype(np.float32, copy=False)

    weights = [token_weight(w) for w in words]
    total_w = float(sum(weights)) or float(len(words))

    # Envelope (RMS) @ 10ms hop
    hop = max(1, int(sr * 0.01))
    win = max(hop + 1, int(sr * 0.02))
    if len(audio) <= win:
        duration = max(0.1, len(audio) / float(sr))
        start_t, end_t = 0.0, duration
        env = np.array([1.0], dtype=np.float32)
    else:
        n_frames = 1 + (len(audio) - win) // hop
        env = np.empty(n_frames, dtype=np.float32)
        for i in range(n_frames):
            seg = audio[i * hop : i * hop + win]
            env[i] = float(np.sqrt(np.mean(seg * seg) + 1e-12))
        peak = float(np.max(env)) if env.size else 1.0
        env = env / (peak + 1e-9)
        smooth = signal.convolve(env, np.ones(5, dtype=np.float32) / 5.0, mode="same")
        # Speech region
        thresh = max(0.03, float(np.percentile(smooth, 35)) * 0.6)
        idx = np.where(smooth > thresh)[0]
        if idx.size == 0:
            idx = np.arange(len(smooth))
        pad = 0.02
        start_t = max(0.0, float(idx[0]) * 0.01 - pad)
        end_t = min(len(audio) / float(sr), float(idx[-1]) * 0.01 + 0.06 + pad)
        if end_t - start_t < 0.2:
            start_t, end_t = 0.0, len(audio) / float(sr)
        env = smooth

    speech_dur = max(0.2, end_t - start_t)
    est = [(w / total_w) * speech_dur for w in weights]
    bounds = [start_t]
    for d in est:
        bounds.append(bounds[-1] + d)
    # scale to fit exactly
    scale = speech_dur / max(1e-6, (bounds[-1] - bounds[0]))
    bounds = [start_t + (b - start_t) * scale for b in bounds]
    bounds[-1] = end_t

    # Snap internal boundaries to local energy valleys when close
    try:
        valleys, _ = signal.find_peaks(-env, distance=max(1, int(0.10 / 0.01)))
        valley_times = valleys.astype(np.float32) * 0.01
    except Exception:
        valley_times = np.array([], dtype=np.float32)

    snapped = [bounds[0]]
    for b in bounds[1:-1]:
        if valley_times.size:
            diffs = np.abs(valley_times - b)
            j = int(np.argmin(diffs))
            if float(diffs[j]) < 0.18:
                snapped.append(float(valley_times[j]))
            else:
                snapped.append(float(b))
        else:
            snapped.append(float(b))
    snapped.append(bounds[-1])

    # Enforce monotonic spacing
    min_gap = 0.06
    for i in range(1, len(snapped)):
        if snapped[i] <= snapped[i - 1] + min_gap:
            snapped[i] = snapped[i - 1] + min_gap
    # final fit
    if snapped[-1] > end_t:
        extra = snapped[-1] - end_t
        span = snapped[-1] - snapped[0]
        if span > 1e-6:
            snapped = [snapped[0] + (x - snapped[0]) * (speech_dur / span) for x in snapped]
        snapped[-1] = end_t
        for i in range(1, len(snapped)):
            if snapped[i] <= snapped[i - 1] + 0.04:
                snapped[i] = snapped[i - 1] + 0.04
        snapped[-1] = end_t

    audio_end = len(audio) / float(sr)
    out: list[dict[str, Any]] = []
    for i, w in enumerate(words):
        s = max(0.0, float(snapped[i]))
        e = min(audio_end, float(snapped[i + 1]))
        if e <= s:
            e = min(audio_end, s + 0.04)
        sf_i = int(round(s * fps))
        ef_i = int(round(e * fps))
        if ef_i <= sf_i:
            ef_i = sf_i + 1
        out.append(
            {
                "word": w,
                "start": round(sf_i / fps, 4),
                "end": round(ef_i / fps, 4),
                "startFrame": sf_i,
                "endFrame": ef_i,
            }
        )
    # monotonic frames
    for i in range(1, len(out)):
        if out[i]["startFrame"] < out[i - 1]["endFrame"]:
            out[i]["startFrame"] = out[i - 1]["endFrame"]
        if out[i]["endFrame"] <= out[i]["startFrame"]:
            out[i]["endFrame"] = out[i]["startFrame"] + 1
        out[i]["start"] = round(out[i]["startFrame"] / fps, 4)
        out[i]["end"] = round(out[i]["endFrame"] / fps, 4)
    # clamp last end to audio length
    last_frame = int(math.ceil(audio_end * fps))
    if out and last_frame > 0:
        out[-1]["endFrame"] = max(out[-1]["startFrame"] + 1, last_frame)
        out[-1]["end"] = round(out[-1]["endFrame"] / fps, 4)
    return out


def attach_scene_ids(words_ts: list[dict[str, Any]], scenes: list[dict[str, Any]] | None, fps: int) -> list[dict[str, Any]]:
    if not scenes:
        return words_ts
    # assign by start time falling into scene ranges if provided
    enriched = []
    for w in words_ts:
        sid = None
        t = (w["start"] + w["end"]) * 0.5
        for sc in scenes:
            try:
                s0 = float(sc.get("start_sec", sc.get("startSec", 0)))
                s1 = float(sc.get("end_sec", sc.get("endSec", 0)))
                sc_id = sc.get("id") or sc.get("sceneId")
                if sc_id and s0 - 1e-6 <= t <= s1 + 1e-6:
                    sid = str(sc_id)
                    break
            except Exception:
                continue
        item = dict(w)
        if sid:
            item["sceneId"] = sid
        enriched.append(item)
    return enriched


def main() -> int:
    ap = argparse.ArgumentParser(description="Generate word-level timestamps JSON for Remotion.")
    ap.add_argument("--audio", required=True, help="Path to input audio.wav")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--text", help="Transcript/script text")
    g.add_argument("--script", help="Path to script JSON (uses fullText/text/scenes[].text)")
    ap.add_argument("--output", required=True, help="Output timestamps JSON path")
    ap.add_argument("--fps", type=int, default=30, help="Frames per second (default: 30)")
    ap.add_argument("--no-whisper", action="store_true", help="Disable faster-whisper attempt")
    ap.add_argument("--prefer-whisper", action="store_true", help="Try faster-whisper first (default when available)")
    args = ap.parse_args()

    audio_path = Path(args.audio)
    out_path = Path(args.output)
    if not audio_path.exists():
        raise SystemExit(f"Audio not found: {audio_path}")

    scenes = None
    if args.text:
        text = args.text.strip()
    else:
        text, scenes = read_script_text(Path(args.script))

    if not text:
        raise SystemExit("Empty transcript text")

    fps = max(1, int(args.fps))

    words_ts: list[dict[str, Any]] | None = None
    method = "acoustic-weighted"
    if not args.no_whisper:
        words_ts = align_with_faster_whisper(audio_path, text, fps)
        if words_ts:
            method = "faster-whisper"

    if not words_ts:
        if _HAS_DSP:
            audio, sr = sf.read(str(audio_path), always_2d=False)
            words_ts = align_acoustic(np.asarray(audio), int(sr), text, fps)
            method = "acoustic-weighted"
        else:
            duration = read_wav_duration(audio_path)
            words_ts = align_uniform_by_weight(text, duration, fps)
            method = "uniform-weighted-fallback"

    words_ts = attach_scene_ids(words_ts, scenes, fps)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(words_ts, ensure_ascii=False, indent=2), encoding="utf-8")

    duration = read_wav_duration(audio_path)
    print(json.dumps({
        "ok": True,
        "method": method,
        "audio": str(audio_path),
        "output": str(out_path),
        "words": len(words_ts),
        "fps": fps,
        "durationSec": round(duration, 4),
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
