import React, { useState, useMemo } from "react";
import { VoiceInfo } from "../../types/tts";
import { VoiceCard } from "./VoiceCard";

interface VoiceSelectorProps {
  voices: VoiceInfo[];
  selectedVoiceId: string;
  playingUrl: string | null;
  onSelectVoice: (voiceId: string) => void;
  onPlayPreview: (previewUrl: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoiceId,
  playingUrl,
  onSelectVoice,
  onPlayPreview,
}) => {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "nữ" | "nam">("all");

  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      const matchSearch =
        v.display_name.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchGender =
        genderFilter === "all" || v.gender.toLowerCase() === genderFilter;

      return matchSearch && matchGender;
    });
  }, [voices, search, genderFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="🔍 Tìm giọng (Mai Chi, tin tức, ấm áp...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#181822",
            border: "1px solid #2e2e42",
            color: "#ffffff",
            fontSize: "12px",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", backgroundColor: "#181822", borderRadius: "6px", padding: "2px" }}>
          {(["all", "nữ", "nam"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenderFilter(g)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "none",
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
                backgroundColor: genderFilter === g ? "#4f46e5" : "transparent",
                color: genderFilter === g ? "#ffffff" : "#9ca3af",
              }}
            >
              {g === "all" ? "Tất cả" : g === "nữ" ? "Nữ" : "Nam"}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: "8px",
          maxHeight: "260px",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        {filteredVoices.map((voice) => {
          const isPlaying = playingUrl === voice.preview_url;
          return (
            <VoiceCard
              key={voice.id}
              voice={voice}
              isSelected={selectedVoiceId === voice.id}
              isPlayingPreview={isPlaying}
              onSelect={onSelectVoice}
              onTogglePreview={() => onPlayPreview(voice.preview_url)}
            />
          );
        })}
      </div>
    </div>
  );
};
