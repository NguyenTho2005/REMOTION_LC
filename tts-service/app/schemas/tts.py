from typing import List, Optional
from pydantic import BaseModel, Field

class VoiceInfo(BaseModel):
    id: str
    display_name: str
    gender: str
    description: str
    tags: List[str]
    preview_url: Optional[str] = None
    is_available: bool = True

class VoiceCatalogResponse(BaseModel):
    voices: List[VoiceInfo]
    count: int

class TTSGenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Vietnamese script to synthesize")
    voice_id: str = Field(..., description="ID of the voice preset (e.g. maichi, baotrang)")
    normalize_text: bool = Field(default=True, description="Whether to apply Vietnamese text normalization")

class TTSGenerateResponse(BaseModel):
    asset_id: str
    voice_id: str
    voice_name: str
    text: str
    file_name: str
    audio_url: str
    duration: float
    sample_rate: int
    status: str
    created_at: str

class TTSAsset(BaseModel):
    asset_id: str
    voice_id: str
    voice_name: str
    text: str
    file_name: str
    audio_url: str
    duration: float
    sample_rate: int
    created_at: str
    status: str

class AssetListResponse(BaseModel):
    assets: List[TTSAsset]
    count: int

class AddToTimelineRequest(BaseModel):
    asset_id: str
    start_frame: Optional[int] = None
    volume: float = 1.0

class AudioTrackInfo(BaseModel):
    id: str
    asset_id: str
    name: str
    src: str
    voice_id: str
    voice_name: str
    text: Optional[str] = ""
    start_frame: int
    duration_in_frames: int
    volume: float

class HealthResponse(BaseModel):
    status: str
    model_id: str
    model_loaded: bool
    available_voices_count: int
    concurrency_limit: int

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
