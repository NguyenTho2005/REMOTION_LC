import os
import time
import uuid
import threading
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numpy as np
import soundfile as sf

from app.core.config import settings
from app.schemas.tts import VoiceInfo

logger = logging.getLogger("zerotts_engine")

# Static fallback voice metadata according to PRD
STATIC_VOICE_CATALOG: Dict[str, Dict] = {
    "maichi": {
        "display_name": "Mai Chi",
        "gender": "nữ",
        "description": "Nữ, trẻ, kể chuyện, nhẹ nhàng, thân thiện",
        "tags": ["nữ", "trẻ", "kể chuyện", "nhẹ nhàng", "thân thiện"],
    },
    "baotrang": {
        "display_name": "Bảo Trang",
        "gender": "nữ",
        "description": "Nữ, trưởng thành, tin tức, rõ ràng, trung tính",
        "tags": ["nữ", "trưởng thành", "tin tức", "rõ ràng", "trung tính"],
    },
    "kimoanh": {
        "display_name": "Kim Oanh",
        "gender": "nữ",
        "description": "Nữ, trung niên, kể chuyện, ấm áp, truyền cảm",
        "tags": ["nữ", "trung niên", "kể chuyện", "ấm áp", "truyền cảm"],
    },
    "hamy": {
        "display_name": "Hà My",
        "gender": "nữ",
        "description": "Nữ, trẻ, hoạt hình, cao, biểu cảm",
        "tags": ["nữ", "trẻ", "hoạt hình", "cao", "biểu cảm"],
    },
    "giahuy": {
        "display_name": "Gia Huy",
        "gender": "nam",
        "description": "Nam, trẻ, kể chuyện, trầm ấm, tâm tình",
        "tags": ["nam", "trẻ", "kể chuyện", "trầm ấm", "tâm tình"],
    },
    "huuduc": {
        "display_name": "Hữu Đức",
        "gender": "nam",
        "description": "Nam, lớn tuổi, kể chuyện, trầm, điềm đạm",
        "tags": ["nam", "lớn tuổi", "kể chuyện", "trầm", "điềm đạm"],
    },
    "quangminh": {
        "display_name": "Quang Minh",
        "gender": "nam",
        "description": "Nam, trẻ, tin tức, rõ ràng, dứt khoát",
        "tags": ["nam", "trẻ", "tin tức", "rõ ràng", "dứt khoát"],
    },
    "tiendat": {
        "display_name": "Tiến Đạt",
        "gender": "nam",
        "description": "Nam, trẻ, bình luận, sôi nổi, năng lượng cao",
        "tags": ["nam", "trẻ", "bình luận", "sôi nổi", "năng lượng cao"],
    },
}

class ZeroTTSEngine:
    _instance = None
    _init_lock = threading.Lock()

    def __new__(cls):
        with cls._init_lock:
            if cls._instance is None:
                cls._instance = super(ZeroTTSEngine, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self._model = None
        self._load_lock = threading.Lock()
        self._inference_lock = threading.Lock()
        self._voices_cache: Dict[str, VoiceInfo] = {}
        self._is_loading = False
        self._model_ready = False

    def initialize_model(self) -> None:
        """Loads ZeroTTS model once and caches available voices."""
        if self._model_ready and self._model is not None:
            return

        with self._load_lock:
            if self._model_ready and self._model is not None:
                return
            self._is_loading = True
            try:
                from zerotts import ZeroTTS
                local_model_path = Path(__file__).resolve().parent.parent.parent / "models" / "zerotts"
                if local_model_path.exists():
                    logger.info(f"Loading ZeroTTS model from local path ({local_model_path})...")
                    self._model = ZeroTTS(str(local_model_path))
                else:
                    logger.info(f"Loading ZeroTTS model ({settings.MODEL_ID})...")
                    try:
                        self._model = ZeroTTS.from_pretrained(settings.MODEL_ID, local_files_only=True)
                    except Exception as ex:
                        logger.warning(f"Local files only failed ({ex}), downloading model...")
                        self._model = ZeroTTS.from_pretrained(settings.MODEL_ID)

                self._build_voice_catalog()
                self._model_ready = True
                logger.info("ZeroTTS model loaded and ready.")
            except Exception as e:
                logger.error(f"Failed to initialize ZeroTTS: {e}", exc_info=True)
                self._model_ready = False
                raise RuntimeError(f"ZeroTTS model initialization failed: {str(e)}")
            finally:
                self._is_loading = False

    def is_ready(self) -> bool:
        return self._model_ready and self._model is not None

    def _build_voice_catalog(self) -> None:
        """Extracts runtime voice metadata and matches with 8 standard presets."""
        self._voices_cache.clear()
        runtime_voice_ids = []
        if self._model is not None:
            try:
                runtime_voice_ids = self._model.list_voices()
            except Exception as e:
                logger.warning(f"Error calling model.list_voices: {e}")

        # Ensure all 8 voices are checked
        for vid, static_meta in STATIC_VOICE_CATALOG.items():
            is_avail = vid in runtime_voice_ids
            preview_url = f"/api/tts/preview/{vid}"
            
            # If available in runtime, inspect loaded voice object
            display_name = static_meta["display_name"]
            gender = static_meta["gender"]
            desc = static_meta["description"]
            tags = static_meta["tags"]

            if is_avail and self._model is not None:
                try:
                    loaded_v = self._model.load_voice(vid)
                    if hasattr(loaded_v, "display_name") and loaded_v.display_name:
                        display_name = loaded_v.display_name
                    if hasattr(loaded_v, "gender") and loaded_v.gender:
                        gender = loaded_v.gender
                    if hasattr(loaded_v, "description") and loaded_v.description:
                        desc = loaded_v.description
                    if hasattr(loaded_v, "tags") and loaded_v.tags:
                        tags = loaded_v.tags
                except Exception as e:
                    logger.warning(f"Could not load voice details for {vid}: {e}")

            self._voices_cache[vid] = VoiceInfo(
                id=vid,
                display_name=display_name,
                gender=gender,
                description=desc,
                tags=tags,
                preview_url=preview_url,
                is_available=is_avail,
            )

    def get_voices(self) -> List[VoiceInfo]:
        """Returns catalog of all 8 voices with current availability status."""
        if not self._voices_cache:
            if not self.is_ready():
                # Provide fallback catalog with is_available=False until initialized
                return [
                    VoiceInfo(
                        id=k,
                        display_name=v["display_name"],
                        gender=v["gender"],
                        description=v["description"],
                        tags=v["tags"],
                        preview_url=f"/api/tts/preview/{k}",
                        is_available=False,
                    )
                    for k, v in STATIC_VOICE_CATALOG.items()
                ]
            self._build_voice_catalog()
        return list(self._voices_cache.values())

    def get_voice(self, voice_id: str) -> Optional[VoiceInfo]:
        voices = self.get_voices()
        for v in voices:
            if v.id == voice_id:
                return v
        return None

    def get_official_preview_path(self, voice_id: str) -> Optional[Path]:
        """Returns the path to the official preview WAV file if available."""
        if not self.is_ready():
            return None
        try:
            v = self._model.load_voice(voice_id)
            if hasattr(v, "preview_path") and v.preview_path:
                p = Path(v.preview_path)
                if p.exists():
                    return p
        except Exception as e:
            logger.warning(f"Error loading preview path for {voice_id}: {e}")
        return None

    def synthesize(
        self,
        text: str,
        voice_id: str,
        normalize_text: bool = True,
    ) -> Tuple[np.ndarray, int, float]:
        """
        Synthesizes text using ZeroTTS with sentence-aware chunking and Vietnamese normalization.
        Returns (audio_array, sample_rate, duration_seconds).
        """
        if not self.is_ready():
            self.initialize_model()

        if voice_id not in self._voices_cache or not self._voices_cache[voice_id].is_available:
            # Recheck runtime
            self._build_voice_catalog()
            if voice_id not in self._voices_cache or not self._voices_cache[voice_id].is_available:
                raise ValueError(f"Voice ID '{voice_id}' is not available in ZeroTTS runtime.")

        clean_text = text.strip()
        if not clean_text:
            raise ValueError("Input text cannot be empty or blank.")

        from zerotts import normalize_vi_text
        from zerotts.chunking import chunk_text

        # 1. Text normalization
        processed_text = clean_text
        if normalize_text:
            try:
                processed_text = normalize_vi_text(clean_text)
            except Exception as e:
                logger.warning(f"Normalization failed ({e}), using raw text.")
                processed_text = clean_text

        # 2. Chunking
        chunks = chunk_text(processed_text, max_chunk_sec=settings.MAX_CHUNK_SEC)
        if not chunks:
            chunks = [processed_text]

        logger.info(f"Synthesizing {len(chunks)} chunks for voice '{voice_id}'...")

        audio_pieces: List[np.ndarray] = []
        sample_rate = 48000

        with self._inference_lock:
            for i, chunk in enumerate(chunks):
                chunk_str = chunk.strip()
                if not chunk_str:
                    continue
                try:
                    logger.debug(f"Synthesizing chunk {i+1}/{len(chunks)}: {chunk_str[:40]}...")
                    chunk_audio = self._model.synthesize(chunk_str, voice=voice_id)
                    
                    # Ensure 1D audio array for concatenation
                    if isinstance(chunk_audio, np.ndarray):
                        if chunk_audio.ndim > 1:
                            chunk_audio = chunk_audio.squeeze()
                        audio_pieces.append(chunk_audio)
                except Exception as e:
                    logger.error(f"Failed to synthesize chunk {i+1}: {e}", exc_info=True)
                    raise RuntimeError(f"Speech synthesis error on chunk {i+1}: {str(e)}")

        if not audio_pieces:
            raise RuntimeError("Speech synthesis produced no audio data.")

        # 3. Concatenate chunks seamlessly
        full_audio = np.concatenate(audio_pieces, axis=0) if len(audio_pieces) > 1 else audio_pieces[0]
        duration = float(len(full_audio)) / float(sample_rate)

        return full_audio, sample_rate, duration

    def save_audio(self, audio: np.ndarray, file_path: Path, sample_rate: int = 48000) -> None:
        """Saves audio array to 16-bit PCM WAV file."""
        file_path.parent.mkdir(parents=True, exist_ok=True)
        # Use zerotts save_audio if available, or soundfile
        if self._model is not None and hasattr(self._model, "save_audio"):
            try:
                self._model.save_audio(audio, str(file_path))
                return
            except Exception:
                pass
        sf.write(str(file_path), audio, sample_rate, subtype="PCM_16")

engine = ZeroTTSEngine()
