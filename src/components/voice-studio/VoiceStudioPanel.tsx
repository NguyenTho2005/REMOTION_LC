import React, { useState } from "react";
import { useTTS } from "../../hooks/useTTS";
import { VoiceSelector } from "./VoiceSelector";
import { ScriptEditor } from "./ScriptEditor";
import { AudioPreview } from "./AudioPreview";
import { GeneratedAudioList } from "./GeneratedAudioList";
import { AIVideoStudioTab } from "./AIVideoStudioTab";
import { Motion3DStudioTab } from "./Motion3DStudioTab";
import { ParticleVFXStudioTab } from "./ParticleVFXStudioTab";

interface VoiceStudioPanelProps {
  isDocked?: boolean;
  onClose?: () => void;
}

export const VoiceStudioPanel: React.FC<VoiceStudioPanelProps> = ({
  isDocked = true,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"ai-video" | "3d-motion" | "particle-vfx" | "studio" | "library">("ai-video");

  const {
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
    generateAudio,
    addToTimeline,
    deleteAsset,
    refreshCatalog,
    refreshAssets,
  } = useTTS();

  const selectedVoice = voices.find((v) => v.id === selectedVoiceId) || voices[0];
  const selectedVoiceName = selectedVoice ? selectedVoice.display_name : "Mai Chi";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: isDocked ? "360px" : "100%",
        height: "100%",
        maxHeight: "100vh",
        backgroundColor: "#121218",
        color: "#ffffff",
        borderLeft: isDocked ? "1px solid #232332" : "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #232332",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#161620",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🎙️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "0.2px" }}>
              ZeroTTS Voice Studio
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor:
                    isBackendHealthy === true
                      ? "#10b981"
                      : isBackendHealthy === false
                      ? "#ef4444"
                      : "#f59e0b",
                }}
              />
              <span style={{ color: "#9ca3af" }}>
                {isBackendHealthy === true
                  ? `Sẵn sàng (${voices.filter((v) => v.is_available).length}/8 giọng)`
                  : isBackendHealthy === false
                  ? "Chưa kết nối backend"
                  : "Đang kiểm tra..."}
              </span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title="Đóng panel"
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: "16px",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Backend connection warning if offline */}
      {isBackendHealthy === false && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#2e1818",
            borderBottom: "1px solid #5a2727",
            color: "#fca5a5",
            fontSize: "11px",
            lineHeight: "1.4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            ⚠️ ZeroTTS Backend chưa chạy trên cổng 8000.
            <br />
            <code style={{ color: "#fef08a" }}>python tts-service/app/main.py</code>
          </div>
          <button
            type="button"
            onClick={refreshCatalog}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              fontSize: "10px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #232332",
          backgroundColor: "#161620",
          padding: "0 8px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("ai-video")}
          style={{
            flex: 1,
            padding: "10px 4px",
            fontSize: "11px",
            fontWeight: 700,
            color: activeTab === "ai-video" ? "#38bdf8" : "#9ca3af",
            borderBottom: activeTab === "ai-video" ? "2px solid #38bdf8" : "2px solid transparent",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✨ AI Video
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("3d-motion")}
          style={{
            flex: 1,
            padding: "10px 4px",
            fontSize: "11px",
            fontWeight: 700,
            color: activeTab === "3d-motion" ? "#38bdf8" : "#9ca3af",
            borderBottom: activeTab === "3d-motion" ? "2px solid #38bdf8" : "2px solid transparent",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          🧊 3D
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("particle-vfx")}
          style={{
            flex: 1,
            padding: "10px 4px",
            fontSize: "11px",
            fontWeight: 700,
            color: activeTab === "particle-vfx" ? "#ec4899" : "#9ca3af",
            borderBottom: activeTab === "particle-vfx" ? "2px solid #ec4899" : "2px solid transparent",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✨ VFX Hạt
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          style={{
            flex: 1,
            padding: "10px 4px",
            fontSize: "11px",
            fontWeight: 600,
            color: activeTab === "studio" ? "#818cf8" : "#9ca3af",
            borderBottom: activeTab === "studio" ? "2px solid #818cf8" : "2px solid transparent",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          🎙️ TTS Studio
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("library")}
          style={{
            flex: 1,
            padding: "10px 4px",
            fontSize: "11px",
            fontWeight: 600,
            color: activeTab === "library" ? "#818cf8" : "#9ca3af",
            borderBottom: activeTab === "library" ? "2px solid #818cf8" : "2px solid transparent",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          📁 Thư viện ({assets.length})
        </button>
      </div>

      {/* Main scrollable body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Error Notification */}
        {generationError && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              backgroundColor: "#3a1a1a",
              border: "1px solid #7f1d1d",
              color: "#fca5a5",
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{generationError}</span>
          </div>
        )}

        {activeTab === "ai-video" ? (
          <AIVideoStudioTab onPlayAudio={playAudio} />
        ) : activeTab === "3d-motion" ? (
          <Motion3DStudioTab />
        ) : activeTab === "particle-vfx" ? (
          <ParticleVFXStudioTab />
        ) : activeTab === "studio" ? (
          <>
            {/* 1. Voice Picker */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#e5e7eb", marginBottom: "8px" }}>
                1. Chọn giọng đọc tiếng Việt ({voices.length}/8)
              </div>
              <VoiceSelector
                voices={voices}
                selectedVoiceId={selectedVoiceId}
                playingUrl={playingUrl}
                onSelectVoice={setSelectedVoiceId}
                onPlayPreview={playAudio}
              />
            </div>

            {/* 2. Script Editor */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#e5e7eb", marginBottom: "8px" }}>
                2. Soạn nội dung kịch bản
              </div>
              <ScriptEditor
                script={script}
                isGenerating={isGenerating}
                selectedVoiceName={selectedVoiceName}
                onChangeScript={setScript}
                onGenerate={generateAudio}
              />
            </div>

            {/* 3. Result Preview */}
            {lastGenerated && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#e5e7eb", marginBottom: "8px" }}>
                  3. Âm thanh vừa tạo
                </div>
                <AudioPreview
                  result={lastGenerated}
                  isPlaying={playingUrl === lastGenerated.audio_url}
                  onPlay={playAudio}
                  onAddToTimeline={addToTimeline}
                  onRegenerate={generateAudio}
                />
              </div>
            )}
          </>
        ) : (
          <GeneratedAudioList
            assets={assets}
            playingUrl={playingUrl}
            onPlay={playAudio}
            onAddToTimeline={addToTimeline}
            onDeleteAsset={deleteAsset}
            onRefresh={refreshAssets}
          />
        )}
      </div>
    </div>
  );
};
