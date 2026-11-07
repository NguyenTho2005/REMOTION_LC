import os
from pathlib import Path
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ZeroTTS Studio Backend"
    API_V1_STR: str = "/api/tts"
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # Path to workspace public directory
    WORKSPACE_ROOT: Path = Path(__file__).resolve().parent.parent.parent.parent
    PUBLIC_DIR: Path = WORKSPACE_ROOT / "public"
    AUDIO_GENERATED_DIR: Path = PUBLIC_DIR / "audio" / "generated"
    AUDIO_METADATA_DIR: Path = PUBLIC_DIR / "audio" / "metadata"
    TRACKS_FILE: Path = PUBLIC_DIR / "audio" / "tracks.json"
    
    # ZeroTTS model configuration
    MODEL_ID: str = os.getenv("ZEROTTS_MODEL_ID", "zeroweight-ai/ZeroTTS")
    MAX_CHUNK_SEC: float = 15.0
    MAX_TEXT_LENGTH: int = 5000
    CONCURRENCY_LIMIT: int = 2

settings = Settings()

# Ensure directories exist
settings.AUDIO_GENERATED_DIR.mkdir(parents=True, exist_ok=True)
settings.AUDIO_METADATA_DIR.mkdir(parents=True, exist_ok=True)
if not settings.TRACKS_FILE.exists():
    settings.TRACKS_FILE.write_text("[]", encoding="utf-8")
