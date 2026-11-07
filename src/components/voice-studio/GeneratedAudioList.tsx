import React, { useState } from "react";
import { TTSAsset } from "../../types/tts";

interface GeneratedAudioListProps {
  assets: TTSAsset[];
  playingUrl: string | null;
  onPlay: (url: string) => void;
  onAddToTimeline: (assetId: string) => Promise<boolean>;
  onDeleteAsset: (assetId: string, force?: boolean) => Promise<void>;
  onRefresh: () => void;
}

export const GeneratedAudioList: React.FC<GeneratedAudioListProps> = ({
  assets,
  playingUrl,
  onPlay,
  onAddToTimeline,
  onDeleteAsset,
  onRefresh,
}) => {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [filterVoice, setFilterVoice] = useState<string>("all");

  const voicesInAssets = Array.from(new Set(assets.map((a) => a.voice_name)));

  const filtered = assets.filter((a) =>
    filterVoice === "all" ? true : a.voice_name === filterVoice,
  );

  const handleAdd = async (assetId: string) => {
    setAddingId(assetId);
    await onAddToTimeline(assetId);
    setAddingId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#e5e7eb" }}>
          Thư viện audio đã sinh ({assets.length})
        </div>
        <button
          type="button"
          onClick={onRefresh}
          style={{
            fontSize: "11px",
            backgroundColor: "transparent",
            color: "#818cf8",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔄 Làm mới
        </button>
      </div>

      {voicesInAssets.length > 1 && (
        <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "4px" }}>
          <button
            type="button"
            onClick={() => setFilterVoice("all")}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              backgroundColor: filterVoice === "all" ? "#4f46e5" : "#1f1f2e",
              color: filterVoice === "all" ? "#ffffff" : "#9ca3af",
              border: "none",
              cursor: "pointer",
            }}
          >
            Tất cả
          </button>
          {voicesInAssets.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setFilterVoice(v)}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                backgroundColor: filterVoice === v ? "#4f46e5" : "#1f1f2e",
                color: filterVoice === v ? "#ffffff" : "#9ca3af",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "12px",
            backgroundColor: "#161622",
            borderRadius: "8px",
            border: "1px dashed #2e2e42",
          }}
        >
          Chưa có file âm thanh nào. Nhập kịch bản và nhấn "Tạo âm thanh" để bắt đầu!
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {filtered.map((item) => {
            const isPlaying = playingUrl === item.audio_url;
            return (
              <div
                key={item.asset_id}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#1c1c28",
                  border: "1px solid #2e2e42",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#312e81",
                        color: "#c7d2fe",
                        fontWeight: 600,
                      }}
                    >
                      {item.voice_name}
                    </span>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      {item.duration}s
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => onPlay(item.audio_url)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: isPlaying ? "#ef4444" : "#374151",
                        color: "#ffffff",
                        fontSize: "11px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {isPlaying ? "⏹ Dừng" : "▶ Nghe"}
                    </button>
                    <button
                      type="button"
                      disabled={addingId === item.asset_id}
                      onClick={() => handleAdd(item.asset_id)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#10b981",
                        color: "#ffffff",
                        fontSize: "11px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {addingId === item.asset_id ? "..." : "+ Timeline"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Xóa file âm thanh của ${item.voice_name}?`)) {
                          onDeleteAsset(item.asset_id, true);
                        }
                      }}
                      title="Xóa audio"
                      style={{
                        padding: "3px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#371c1c",
                        color: "#f87171",
                        fontSize: "11px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#d1d5db",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.text}
                >
                  "{item.text}"
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
