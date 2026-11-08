import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";

export interface AlignedWord {
  word: string;
  cleanWord: string;
  startMs: number;
  endMs: number;
  startSec: number;
  endSec: number;
  durationMs: number;
  globalStartMs: number;
  globalEndMs: number;
  sceneStartFrame: number;
  sceneEndFrame: number;
  globalStartFrame: number;
  globalEndFrame: number;
}

export interface KaraokeSubtitleProps {
  words: AlignedWord[];
  wordsPerChunk?: number;
  highlightColor?: string;
}

export const KaraokeSubtitle: React.FC<KaraokeSubtitleProps> = ({
  words,
  wordsPerChunk = 7,
  highlightColor = DESIGN_TOKENS.colors.karaokeHighlight,
}) => {
  const frame = useCurrentFrame();

  if (!words || words.length === 0) return null;

  // Split words into chunks of maximum wordsPerChunk
  const chunks: AlignedWord[][] = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk));
  }

  // Find which chunk is active
  let activeChunkIndex = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkStartFrame = chunk[0].sceneStartFrame;
    const chunkEndFrame = chunk[chunk.length - 1].sceneEndFrame;
    if (frame >= chunkStartFrame && frame <= chunkEndFrame + 12) {
      activeChunkIndex = i;
      break;
    } else if (frame > chunkEndFrame) {
      activeChunkIndex = i;
    }
  }

  const activeChunk = chunks[activeChunkIndex] || chunks[0];

  // Container fade in
  const opacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 8], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: DESIGN_TOKENS.layout.safeArea.bottom, // TikTok safe margin (280px)
        left: DESIGN_TOKENS.layout.safeArea.left,
        right: DESIGN_TOKENS.layout.safeArea.right,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 100,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: DESIGN_TOKENS.colors.karaokeBg,
          backdropFilter: "blur(16px)",
          borderRadius: 24,
          border: `2px solid ${DESIGN_TOKENS.colors.karaokeBorder}`,
          boxShadow: DESIGN_TOKENS.shadows.cardDark,
          padding: "18px 28px",
          maxWidth: 900,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 10,
          rowGap: 8,
          textAlign: "center",
        }}
      >
        {activeChunk.map((w, idx) => {
          const isCurrent =
            frame >= w.sceneStartFrame && frame < w.sceneEndFrame;
          const isPast = frame >= w.sceneEndFrame;

          // Gentle scale bump when current word is spoken
          let scale = 1;
          if (isCurrent) {
            const wordFrame = frame - w.sceneStartFrame;
            scale = interpolate(wordFrame, [0, 3, 8], [1, 1.12, 1.05], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          }

          let color: string = DESIGN_TOKENS.colors.karaokeTextInactive;
          let fontWeight = 600;
          let textShadow = "none";

          if (isCurrent) {
            color = highlightColor;
            fontWeight = 800;
            textShadow = `0 0 16px ${highlightColor}66`;
          } else if (isPast) {
            color = "#FFFFFF";
            fontWeight = 700;
          }

          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: DESIGN_TOKENS.typography.fontFamily,
                fontSize: 34,
                lineHeight: 1.35,
                color,
                fontWeight,
                textShadow,
                transform: `scale(${scale})`,
                display: "inline-block",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
