/* eslint-disable @remotion/non-pure-animation */
import React from "react";
import { VoiceInfo } from "../../types/tts";

interface VoiceCardProps {
  voice: VoiceInfo;
  isSelected: boolean;
  isPlayingPreview: boolean;
  onSelect: (voiceId: string) => void;
  onTogglePreview: (voiceId: string) => void;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  isPlayingPreview,
  onSelect,
  onTogglePreview,
}) => {
  const isFemale = voice.gender.toLowerCase() === "nữ";

  return (
    <div
      onClick={() => onSelect(voice.id)}
      style={{
        padding: "12px",
        borderRadius: "10px",
        backgroundColor: isSelected ? "#27273a" : "#1a1a24",
        border: isSelected ? "2px solid #818cf8" : "1px solid #2e2e3e",
        cursor: "pointer",
        transition: "all 0.15s ease",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: isFemale ? "#ec489922" : "#3b82f622",
              color: isFemale ? "#f472b6" : "#60a5fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {isFemale ? "♀" : "♂"}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#f3f4f6" }}>
              {voice.display_name}
            </div>
            <div style={{ fontSize: "11px", color: "#9ca3af" }}>
              ID: {voice.id}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePreview(voice.id);
          }}
          title={isPlayingPreview ? "Dừng thử giọng" : "Nghe thử giọng"}
          style={{
            padding: "5px 10px",
            borderRadius: "6px",
            backgroundColor: isPlayingPreview ? "#ef4444" : "#374151",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {isPlayingPreview ? "⏹ Dừng" : "▶ Nghe"}
        </button>
      </div>

      <div style={{ fontSize: "12px", color: "#d1d5db", lineHeight: "1.4" }}>
        {voice.description}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {voice.tags.slice(0, 4).map((tag, i) => (
          <span
            key={i}
            style={{
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "#2e2e42",
              color: "#a5b4fc",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
