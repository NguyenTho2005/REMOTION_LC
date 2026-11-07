import json
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from app.core.config import settings
from app.schemas.tts import TTSAsset, AudioTrackInfo

logger = logging.getLogger("asset_manager")

class AssetManager:
    def __init__(self):
        self.audio_dir = settings.AUDIO_GENERATED_DIR
        self.metadata_dir = settings.AUDIO_METADATA_DIR
        self.tracks_file = settings.TRACKS_FILE
        self.audio_dir.mkdir(parents=True, exist_ok=True)
        self.metadata_dir.mkdir(parents=True, exist_ok=True)

    def save_asset_metadata(self, asset: TTSAsset) -> None:
        """Saves asset metadata to json file."""
        meta_file = self.metadata_dir / f"{asset.asset_id}.json"
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(asset.model_dump(), f, ensure_ascii=False, indent=2)

    def get_asset(self, asset_id: str) -> Optional[TTSAsset]:
        """Loads single asset metadata."""
        # Sanitize asset_id
        safe_id = Path(asset_id).name
        meta_file = self.metadata_dir / f"{safe_id}.json"
        if not meta_file.exists():
            return None
        try:
            with open(meta_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return TTSAsset(**data)
        except Exception as e:
            logger.error(f"Error reading asset {asset_id}: {e}")
            return None

    def list_assets(self) -> List[TTSAsset]:
        """Lists all assets sorted newest first."""
        assets = []
        for meta_file in self.metadata_dir.glob("*.json"):
            try:
                with open(meta_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                # Verify corresponding wav file exists
                wav_file = self.audio_dir / f"{data['asset_id']}.wav"
                if wav_file.exists():
                    assets.append(TTSAsset(**data))
            except Exception as e:
                logger.warning(f"Error loading metadata from {meta_file}: {e}")

        # Sort by created_at descending
        assets.sort(key=lambda x: x.created_at, reverse=True)
        return assets

    def delete_asset(self, asset_id: str, force: bool = False) -> bool:
        """Deletes an asset and its metadata. Rejects if active in timeline unless force=True."""
        safe_id = Path(asset_id).name
        
        # Check if asset is used in timeline
        if not force and self.is_asset_in_timeline(safe_id):
            raise ValueError(f"Asset '{safe_id}' is currently active in the composition timeline.")

        deleted = False
        wav_file = self.audio_dir / f"{safe_id}.wav"
        if wav_file.exists():
            wav_file.unlink()
            deleted = True

        meta_file = self.metadata_dir / f"{safe_id}.json"
        if meta_file.exists():
            meta_file.unlink()
            deleted = True

        # Clean up any timeline tracks referencing this deleted asset
        tracks = self.get_timeline_tracks()
        remaining_tracks = [t for t in tracks if t.asset_id != safe_id]
        if len(remaining_tracks) != len(tracks):
            with open(self.tracks_file, "w", encoding="utf-8") as f:
                json.dump([t.model_dump() for t in remaining_tracks], f, ensure_ascii=False, indent=2)

        return deleted

    # Timeline Tracks Integration
    def get_timeline_tracks(self) -> List[AudioTrackInfo]:
        """Reads active timeline audio tracks from tracks.json."""
        if not self.tracks_file.exists():
            return []
        try:
            with open(self.tracks_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return [AudioTrackInfo(**item) for item in data]
        except Exception as e:
            logger.error(f"Error reading tracks.json: {e}")
            return []

    def is_asset_in_timeline(self, asset_id: str) -> bool:
        tracks = self.get_timeline_tracks()
        return any(t.asset_id == asset_id for t in tracks)

    def add_to_timeline(
        self,
        asset_id: str,
        start_frame: Optional[int] = None,
        volume: float = 1.0,
        fps: int = 30,
    ) -> AudioTrackInfo:
        """Adds an audio asset to the Remotion timeline. If start_frame is omitted, appends after the last track."""
        asset = self.get_asset(asset_id)
        if not asset:
            raise ValueError(f"Asset '{asset_id}' not found.")

        tracks = self.get_timeline_tracks()

        if start_frame is None:
            if tracks:
                last_end = max(t.start_frame + t.duration_in_frames for t in tracks)
                start_frame = last_end + 6  # 6 frames (~0.2s pause)
            else:
                start_frame = 0

        # Calculate duration in frames (default 30 fps)
        duration_frames = max(1, int(round(asset.duration * fps)))
        
        track_id = f"track-{len(tracks) + 1}-{asset.asset_id[:8]}"
        new_track = AudioTrackInfo(
            id=track_id,
            asset_id=asset.asset_id,
            name=f"Voice: {asset.voice_name}",
            src=f"audio/generated/{asset.file_name}",
            voice_id=asset.voice_id,
            voice_name=asset.voice_name,
            text=asset.text,
            start_frame=start_frame,
            duration_in_frames=duration_frames,
            volume=volume,
        )

        tracks.append(new_track)
        with open(self.tracks_file, "w", encoding="utf-8") as f:
            json.dump([t.model_dump() for t in tracks], f, ensure_ascii=False, indent=2)

        return new_track

    def clear_timeline(self) -> None:
        with open(self.tracks_file, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)

asset_manager = AssetManager()
