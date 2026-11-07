import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException, BackgroundTasks, Response
from fastapi.responses import FileResponse

from app.core.config import settings
from app.services.zerotts_engine import engine
from app.services.asset_manager import asset_manager
from app.schemas.tts import (
    HealthResponse,
    VoiceCatalogResponse,
    TTSGenerateRequest,
    TTSGenerateResponse,
    TTSAsset,
    AssetListResponse,
    AddToTimelineRequest,
    AudioTrackInfo,
)

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def get_health():
    voices = engine.get_voices()
    avail_count = sum(1 for v in voices if v.is_available)
    return HealthResponse(
        status="ready" if engine.is_ready() else "starting",
        model_id=settings.MODEL_ID,
        model_loaded=engine.is_ready(),
        available_voices_count=avail_count,
        concurrency_limit=settings.CONCURRENCY_LIMIT,
    )

@router.get("/voices", response_model=VoiceCatalogResponse)
async def get_voices():
    # If model is not initialized yet, try initializing
    if not engine.is_ready():
        try:
            engine.initialize_model()
        except Exception:
            pass
    voices = engine.get_voices()
    return VoiceCatalogResponse(voices=voices, count=len(voices))

@router.get("/preview/{voice_id}")
async def get_voice_preview(voice_id: str):
    """Streams preview audio for the requested voice."""
    if not engine.is_ready():
        engine.initialize_model()

    voice = engine.get_voice(voice_id)
    if not voice or not voice.is_available:
        raise HTTPException(status_code=404, detail=f"Voice '{voice_id}' is not available.")

    # 1. Try official upstream preview WAV
    preview_path = engine.get_official_preview_path(voice_id)
    if preview_path and preview_path.exists():
        return FileResponse(
            str(preview_path),
            media_type="audio/wav",
            filename=f"preview_{voice_id}.wav",
        )

    # 2. Otherwise generate a short preview sentence on demand
    preview_file = settings.AUDIO_GENERATED_DIR / f"preview_{voice_id}.wav"
    if not preview_file.exists():
        sample_text = f"Xin chào, đây là giọng đọc thử nghiệm của {voice.display_name}."
        try:
            audio, sr, _ = engine.synthesize(sample_text, voice_id=voice_id)
            engine.save_audio(audio, preview_file, sample_rate=sr)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate preview: {str(e)}")

    return FileResponse(
        str(preview_file),
        media_type="audio/wav",
        filename=f"preview_{voice_id}.wav",
    )

@router.post("/generate", response_model=TTSGenerateResponse)
async def generate_speech(request: TTSGenerateRequest):
    """Synthesizes speech from script using ZeroTTS and saves to asset library."""
    clean_text = request.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Văn bản không được để trống.")

    if len(clean_text) > settings.MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Văn bản quá dài ({len(clean_text)} ký tự). Tối đa {settings.MAX_TEXT_LENGTH} ký tự.",
        )

    # Validate voice
    voice = engine.get_voice(request.voice_id)
    if not voice or not voice.is_available:
        raise HTTPException(
            status_code=400,
            detail=f"Giọng '{request.voice_id}' không tồn tại hoặc chưa sẵn sàng.",
        )

    asset_id = str(uuid.uuid4())
    file_name = f"{asset_id}.wav"
    audio_path = settings.AUDIO_GENERATED_DIR / file_name

    try:
        audio, sample_rate, duration = engine.synthesize(
            clean_text,
            voice_id=request.voice_id,
            normalize_text=request.normalize_text,
        )
        engine.save_audio(audio, audio_path, sample_rate=sample_rate)
    except Exception as e:
        # Clean up temporary file if failed
        if audio_path.exists():
            audio_path.unlink()
        raise HTTPException(status_code=500, detail=f"Lỗi tạo âm thanh: {str(e)}")

    audio_url = f"/audio/generated/{file_name}"
    created_at = datetime.now(timezone.utc).isoformat()

    asset = TTSAsset(
        asset_id=asset_id,
        voice_id=request.voice_id,
        voice_name=voice.display_name,
        text=clean_text,
        file_name=file_name,
        audio_url=audio_url,
        duration=round(duration, 2),
        sample_rate=sample_rate,
        created_at=created_at,
        status="completed",
    )
    asset_manager.save_asset_metadata(asset)

    return TTSGenerateResponse(
        asset_id=asset_id,
        voice_id=request.voice_id,
        voice_name=voice.display_name,
        text=clean_text,
        file_name=file_name,
        audio_url=audio_url,
        duration=round(duration, 2),
        sample_rate=sample_rate,
        status="completed",
        created_at=created_at,
    )

@router.get("/assets", response_model=AssetListResponse)
async def list_assets():
    assets = asset_manager.list_assets()
    return AssetListResponse(assets=assets, count=len(assets))

@router.delete("/assets/{asset_id}")
async def delete_asset(asset_id: str, force: bool = False):
    try:
        deleted = asset_manager.delete_asset(asset_id, force=force)
        if not deleted:
            raise HTTPException(status_code=404, detail="Không tìm thấy audio asset.")
        return {"status": "deleted", "asset_id": asset_id}
    except ValueError as ve:
        raise HTTPException(status_code=409, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa asset: {str(e)}")

# Timeline endpoints
@router.get("/timeline/tracks", response_model=List[AudioTrackInfo])
async def get_timeline_tracks():
    return asset_manager.get_timeline_tracks()

@router.post("/timeline/add", response_model=AudioTrackInfo)
async def add_track_to_timeline(request: AddToTimelineRequest):
    try:
        track = asset_manager.add_to_timeline(
            asset_id=request.asset_id,
            start_frame=request.start_frame,
            volume=request.volume,
        )
        return track
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi thêm vào timeline: {str(e)}")

@router.delete("/timeline/tracks/{track_id}")
async def delete_timeline_track(track_id: str):
    removed = asset_manager.remove_track_from_timeline(track_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Không tìm thấy track trên timeline.")
    return {"status": "removed", "track_id": track_id}

@router.delete("/timeline/clear")
async def clear_timeline_tracks():
    asset_manager.clear_timeline()
    return {"status": "cleared"}
