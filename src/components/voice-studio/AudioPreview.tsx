import React, { useState } from "react";
import { TTSGenerateResponse } from "../../types/tts";

interface AudioPreviewProps {
  result: TTSGenerateResponse;
  isPlaying: boolean;
  onPlay: (url: string) => void;
  onAddToTimeline: (assetId: string) => Promise<boolean>;
  onRegenerate: () => void;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  result,
  isPlaying,
  onPlay,
  onAddToTimeline,
  onRegenerate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    const success = await onAddToTimeline(result.asset_id);
    setIsAdding(false);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
  };

  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "#1f1f2e",
        border: "1px solid #3b3b52",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>🎵</span>
          <span style={{ fontWeight: 600, fontSize: "13px", color: "#f3f4f6" }}>
            Kết quả: {result.voice_name}
          </span>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "#065f46",
              color: "#34d399",
            }}
          >
            {result.duration}s
          </span>
        </div>

        <button
          type="button"
          onClick={() => onPlay(result.audio_url)}
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            backgroundColor: isPlaying ? "#ef4444" : "#4f46e5",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {isPlaying ? "⏹ Dừng" : "▶ Nghe"}
        </button>
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#9ca3af",
          backgroundColor: "#161622",
          padding: "8px",
          borderRadius: "6px",
          fontStyle: "italic",
          maxHeight: "60px",
          overflowY: "auto",
        }}
      >
        "{result.text}"
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          disabled={isAdding}
          onClick={handleAdd}
          style={{
            flex: 2,
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: addedSuccess ? "#059669" : "#10b981",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "12px",
            border: "none",
            cursor: isAdding ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {addedSuccess ? "✓ Đã thêm vào Timeline!" : "➕ Thêm vào Timeline"}
        </button>

        <button
          type="button"
          onClick={onRegenerate}
          title="Tạo lại âm thanh"
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#2e2e42",
            color: "#d1d5db",
            fontSize: "12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔄 Tạo lại
        </button>
      </div>
    </div>
  );
};
