import os
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add tts-service to python path
tts_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(tts_dir))

from app.main import app
from app.core.config import settings
from app.services.zerotts_engine import engine
from app.services.asset_manager import asset_manager

@pytest.fixture(scope="session")
def client():
    # Ensure model is initialized
    engine.initialize_model()
    with TestClient(app) as test_client:
        yield test_client

def test_health_endpoint(client):
    response = client.get("/api/tts/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ready", "starting"]
    assert data["model_loaded"] is True
    assert data["available_voices_count"] == 8

def test_voices_catalog(client):
    response = client.get("/api/tts/voices")
    assert response.status_code == 200
    data = response.json()
    assert "voices" in data
    assert data["count"] == 8
    
    expected_ids = {"maichi", "baotrang", "kimoanh", "hamy", "giahuy", "huuduc", "quangminh", "tiendat"}
    voice_ids = {v["id"] for v in data["voices"]}
    assert expected_ids == voice_ids

    for v in data["voices"]:
        assert v["display_name"]
        assert v["gender"] in ["nữ", "nam"]
        assert len(v["tags"]) > 0
        assert v["is_available"] is True
        assert v["preview_url"] is not None

def test_voice_preview(client):
    response = client.get("/api/tts/preview/maichi")
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert len(response.content) > 1000  # WAV has header + samples

def test_generate_validation_empty_text(client):
    response = client.post("/api/tts/generate", json={"text": "   ", "voice_id": "maichi"})
    assert response.status_code in [400, 422]

def test_generate_validation_invalid_voice(client):
    response = client.post("/api/tts/generate", json={"text": "Xin chào", "voice_id": "unknown_voice_123"})
    assert response.status_code == 400
    assert "không tồn tại" in response.json()["detail"]

def test_generate_vietnamese_audio(client):
    # Test realistic Vietnamese text with diacritics
    text = "Xin chào các bạn, chào mừng các bạn đến với studio âm thanh tiếng Việt."
    response = client.post(
        "/api/tts/generate",
        json={"text": text, "voice_id": "baotrang", "normalize_text": True},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["voice_id"] == "baotrang"
    assert data["voice_name"] == "Bảo Trang"
    assert data["sample_rate"] == 48000
    assert data["duration"] > 1.0
    assert data["audio_url"].startswith("/audio/generated/")

    # Verify physical file was created
    file_path = settings.AUDIO_GENERATED_DIR / data["file_name"]
    assert file_path.exists()
    assert file_path.stat().st_size > 0
    asset = asset_manager.get_asset(data["asset_id"])
    assert asset is not None
    assert asset.text == text

def test_long_text_chunking(client):
    # Test text containing multiple sentences that requires chunking
    long_text = (
        "Remotion là một framework mạnh mẽ cho phép chúng ta tạo video bằng React và TypeScript. "
        "Với ZeroTTS, chúng ta có thể sinh giọng đọc tiếng Việt mượt mà với 8 preset khác nhau. "
        "Tất cả các đoạn văn đều được chia nhỏ theo câu và ghép nối hoàn hảo."
    )
    response = client.post(
        "/api/tts/generate",
        json={"text": long_text, "voice_id": "giahuy", "normalize_text": True},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["duration"] > 3.0
    assert data["status"] == "completed"

def test_assets_and_timeline_lifecycle(client):
    # 1. Generate an asset
    res_gen = client.post(
        "/api/tts/generate",
        json={"text": "Thử nghiệm đưa vào timeline.", "voice_id": "quangminh"},
    )
    assert res_gen.status_code == 200
    asset_id = res_gen.json()["asset_id"]

    # 2. Check asset listing
    res_list = client.get("/api/tts/assets")
    assert res_list.status_code == 200
    asset_ids = [a["asset_id"] for a in res_list.json()["assets"]]
    assert asset_id in asset_ids

    # 3. Add to timeline
    res_add = client.post(
        "/api/tts/timeline/add",
        json={"asset_id": asset_id, "start_frame": 15, "volume": 0.9},
    )
    assert res_add.status_code == 200
    track = res_add.json()
    assert track["asset_id"] == asset_id
    assert track["start_frame"] == 15
    assert track["volume"] == 0.9
    assert track["duration_in_frames"] > 0
    assert track["src"].startswith("audio/generated/")

    # 4. Check timeline tracks
    res_tracks = client.get("/api/tts/timeline/tracks")
    assert res_tracks.status_code == 200
    assert any(t["id"] == track["id"] for t in res_tracks.json())

    # 5. Attempt deleting active timeline asset without force should fail
    res_del_fail = client.delete(f"/api/tts/assets/{asset_id}")
    assert res_del_fail.status_code == 409

    # 6. Delete with force=true should succeed
    res_del_ok = client.delete(f"/api/tts/assets/{asset_id}?force=true")
    assert res_del_ok.status_code == 200
