import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";

export interface SubtitleSequenceProps {
  text: string;
  durationInFrames: number;
}

export const SubtitleSequence: React.FC<SubtitleSequenceProps> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const words = text.split(" ").filter(Boolean);
  if (words.length === 0) return null;

  // Compute active word index
  const wordProgress = interpolate(frame, [0, durationInFrames], [0, words.length], {
    extrapolateRight: "clamp",
  });
  const activeIndex = Math.min(words.length - 1, Math.floor(wordProgress));

  // Chunk words into small readable subtitle lines (max 6 words per view)
  const chunkSize = 6;
  const chunkIndex = Math.floor(activeIndex / chunkSize);
  const currentChunkWords = words.slice(
    chunkIndex * chunkSize,
    (chunkIndex + 1) * chunkSize
  );
  const chunkOffset = chunkIndex * chunkSize;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 270,
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px 14px",
        padding: "16px 24px",
        borderRadius: 16,
        backgroundColor: "rgba(17, 20, 30, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        zIndex: 20,
      }}
    >
      {currentChunkWords.map((word, idx) => {
        const globalIdx = chunkOffset + idx;
        const isActive = globalIdx === activeIndex;
        const isPast = globalIdx < activeIndex;

        return (
          <span
            key={`${globalIdx}-${word}`}
            style={{
              fontSize: 32,
              fontWeight: isActive ? 800 : 600,
              color: isActive
                ? DARK_TECH_THEME.accentCyan
                : isPast
                ? DARK_TECH_THEME.textPrimary
                : DARK_TECH_THEME.textMuted,
              transform: isActive ? "scale(1.08)" : "scale(1)",
              textShadow: isActive
                ? "0 0 16px rgba(56, 189, 248, 0.6)"
                : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
