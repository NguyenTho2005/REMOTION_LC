export interface VoiceInfo {
  id: string;
  display_name: string;
  gender: string;
  description: string;
  tags: string[];
  preview_url: string;
  is_available: boolean;
}

export interface VoiceCatalogResponse {
  voices: VoiceInfo[];
  count: number;
}

export interface TTSGenerateRequest {
  text: string;
  voice_id: string;
  normalize_text?: boolean;
}

export interface TTSGenerateResponse {
  asset_id: string;
  voice_id: string;
  voice_name: string;
  text: string;
  file_name: string;
  audio_url: string;
  duration: number;
  sample_rate: number;
  status: string;
  created_at: string;
}

export interface TTSAsset {
  asset_id: string;
  voice_id: string;
  voice_name: string;
  text: string;
  file_name: string;
  audio_url: string;
  duration: number;
  sample_rate: number;
  created_at: string;
  status: string;
}

export interface AssetListResponse {
  assets: TTSAsset[];
  count: number;
}

export interface AudioTrackInfo {
  id: string;
  asset_id: string;
  name: string;
  src: string;
  voice_id: string;
  voice_name: string;
  text?: string;
  start_frame: number;
  duration_in_frames: number;
  volume: number;
}

export interface HealthResponse {
  status: string;
  model_id: string;
  model_loaded: boolean;
  available_voices_count: number;
  concurrency_limit: number;
}
