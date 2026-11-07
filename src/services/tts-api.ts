import type {
  HealthResponse,
  VoiceCatalogResponse,
  TTSGenerateRequest,
  TTSGenerateResponse,
  AssetListResponse,
  AudioTrackInfo,
} from "../types/tts.ts";

const BASE_URL =
  process.env.REMOTION_TTS_API_URL || "http://127.0.0.1:8000/api/tts";

class TTSApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<HealthResponse> {
    const res = await fetch(`${this.baseUrl}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return res.json();
  }

  async getVoices(): Promise<VoiceCatalogResponse> {
    const res = await fetch(`${this.baseUrl}/voices`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to fetch voices" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
  }

  getVoicePreviewUrl(voiceId: string): string {
    return `${this.baseUrl}/preview/${encodeURIComponent(voiceId)}`;
  }

  async generateSpeech(req: TTSGenerateRequest): Promise<TTSGenerateResponse> {
    const res = await fetch(`${this.baseUrl}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Speech generation failed" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async listAssets(): Promise<AssetListResponse> {
    const res = await fetch(`${this.baseUrl}/assets`);
    if (!res.ok) {
      throw new Error(`Failed to list assets: ${res.status}`);
    }
    return res.json();
  }

  async deleteAsset(assetId: string, force: boolean = false): Promise<void> {
    const url = `${this.baseUrl}/assets/${encodeURIComponent(assetId)}${force ? "?force=true" : ""}`;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to delete asset" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
  }

  async getTimelineTracks(): Promise<AudioTrackInfo[]> {
    const res = await fetch(`${this.baseUrl}/timeline/tracks`);
    if (!res.ok) {
      throw new Error(`Failed to fetch timeline tracks: ${res.status}`);
    }
    return res.json();
  }

  async addToTimeline(
    assetId: string,
    startFrame?: number,
    volume: number = 1.0,
  ): Promise<AudioTrackInfo> {
    const res = await fetch(`${this.baseUrl}/timeline/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asset_id: assetId,
        ...(startFrame !== undefined ? { start_frame: startFrame } : {}),
        volume,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to add to timeline" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async removeTimelineTrack(trackId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/timeline/tracks/${encodeURIComponent(trackId)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to remove track" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
  }

  async clearTimeline(): Promise<void> {
    await fetch(`${this.baseUrl}/timeline/clear`, { method: "DELETE" });
  }
}

export const ttsApi = new TTSApiClient();
