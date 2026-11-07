import { useState, useEffect, useCallback, useRef } from "react";
import { VoiceInfo, TTSAsset, TTSGenerateResponse } from "../types/tts";
import { ttsApi } from "../services/tts-api";

export const SAMPLE_SCRIPTS = [
  "Xin chào mọi người! Chào mừng các bạn đến với video hướng dẫn hôm nay.",
  "Remotion giúp chúng ta dựng video chất lượng cao hoàn toàn bằng React và mã nguồn mở.",
  "Với ZeroTTS, việc tạo giọng đọc tiếng Việt chân thực và truyền cảm trở nên dễ dàng hơn bao giờ hết.",
  "Hãy like và đăng ký kênh để không bỏ lỡ những bài học công nghệ thú vị tiếp theo nhé!",
];

export function useTTS() {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("maichi");
  const [script, setScript] = useState<string>(SAMPLE_SCRIPTS[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<TTSGenerateResponse | null>(null);
  const [assets, setAssets] = useState<TTSAsset[]>([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio player singleton in hook
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setPlayingUrl(null);
      audioRef.current.onerror = () => setPlayingUrl(null);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = useCallback((url: string) => {
    if (!audioRef.current) return;
    if (playingUrl === url) {
      audioRef.current.pause();
      setPlayingUrl(null);
      return;
    }
    audioRef.current.src = url;
    audioRef.current.play().then(() => {
      setPlayingUrl(url);
    }).catch((err) => {
      console.warn("Audio playback failed:", err);
      setPlayingUrl(null);
    });
  }, [playingUrl]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingUrl(null);
    }
  }, []);

  const refreshCatalog = useCallback(async () => {
    try {
      const health = await ttsApi.checkHealth();
      setIsBackendHealthy(health.status === "ready" || health.model_loaded);
      const res = await ttsApi.getVoices();
      setVoices(res.voices);
    } catch (e) {
      console.warn("Failed to connect to TTS backend:", e);
      setIsBackendHealthy(false);
    }
  }, []);

  const refreshAssets = useCallback(async () => {
    try {
      const res = await ttsApi.listAssets();
      setAssets(res.assets);
    } catch (e) {
      console.warn("Failed to load assets:", e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshCatalog();
    refreshAssets();
  }, [refreshCatalog, refreshAssets]);

  const generateAudio = useCallback(async () => {
    if (!script.trim()) {
      setGenerationError("Vui lòng nhập nội dung kịch bản trước khi tạo giọng.");
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await ttsApi.generateSpeech({
        text: script.trim(),
        voice_id: selectedVoiceId,
        normalize_text: true,
      });
      setLastGenerated(res);
      await refreshAssets();
      // Auto-preview generated result
      playAudio(res.audio_url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tạo giọng đọc thất bại. Vui lòng thử lại.";
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  }, [script, selectedVoiceId, refreshAssets, playAudio]);

  const addToTimeline = useCallback(async (assetId: string) => {
    try {
      await ttsApi.addToTimeline(assetId);
      // Dispatch custom event to notify composition / remotion
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("remotion-tracks-updated"));
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể thêm vào Timeline.";
      setGenerationError(msg);
      return false;
    }
  }, []);

  const deleteAsset = useCallback(async (assetId: string, force: boolean = false) => {
    try {
      await ttsApi.deleteAsset(assetId, force);
      if (lastGenerated?.asset_id === assetId) {
        setLastGenerated(null);
      }
      await refreshAssets();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("remotion-tracks-updated"));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể xóa audio.";
      setGenerationError(msg);
    }
  }, [lastGenerated, refreshAssets]);

  return {
    isBackendHealthy,
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    script,
    setScript,
    isGenerating,
    generationError,
    lastGenerated,
    assets,
    playingUrl,
    playAudio,
    stopAudio,
    generateAudio,
    addToTimeline,
    deleteAsset,
    refreshCatalog,
    refreshAssets,
  };
}
