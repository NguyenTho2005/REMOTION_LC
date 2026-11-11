import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface WordTimestamp {
  word: string;
  start?: number;
  end?: number;
  startFrame: number;
  endFrame: number;
  sceneId?: string;
}

export interface KaraokeSubtitleProps {
  words: WordTimestamp[];
  wordsPerChunk?: number;
  bottomOffset?: number;
  maxWidth?: number;
}

const chunkWords = (words: WordTimestamp[], size: number): WordTimestamp[][] => {
  const chunks: WordTimestamp[][] = [];
  let currentChunk: WordTimestamp[] = [];

  for (let i = 0; i < words.length; i += 1) {
    const w = words[i];
    const prev = currentChunk[currentChunk.length - 1];
    // Start new chunk if size reached or if sceneId changes
    const sceneChanged = Boolean(prev?.sceneId && w.sceneId && prev.sceneId !== w.sceneId);
    if (currentChunk.length >= size || sceneChanged) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
    }
    currentChunk.push(w);
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  return chunks;
};

export const KaraokeSubtitle: React.FC<KaraokeSubtitleProps> = ({
  words,
  wordsPerChunk = 4,
  bottomOffset = 320,
  maxWidth = 940,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!words || words.length === 0) return null;

  // Group into chunks of 3-5 words as requested (default 4)
  const chunkSize = Math.min(5, Math.max(3, wordsPerChunk));
  const chunks = chunkWords(words, chunkSize);

  let activeChunkIndex = -1;
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const start = chunk[0]?.startFrame ?? 0;
    const end = chunk[chunk.length - 1]?.endFrame ?? start;
    if (frame >= start - 8 && frame < end + 10) {
      activeChunkIndex = i;
      break;
    }
  }

  if (activeChunkIndex === -1) return null;

  const activeChunk = chunks[activeChunkIndex] ?? [];

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: bottomOffset,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 14,
          rowGap: 10,
          textAlign: "center",
        }}
      >
        {activeChunk.map((w, idx) => {
          const isActive = frame >= w.startFrame && frame < w.endFrame;
          const isPast = frame >= w.endFrame;

          // Spec: active word scale pop 1.0 -> 1.25 then settle ~1.1 via spring()
          const pop = spring({
            frame: frame - w.startFrame,
            fps,
            config: { damping: 10, mass: 0.5, stiffness: 220 },
          });
          const overshoot = spring({
            frame: frame - w.startFrame,
            fps,
            config: { damping: 7, mass: 0.35, stiffness: 260 },
          });
          const activeScale = isActive ? 1 + 0.25 * overshoot - 0.15 * Math.max(0, pop - 0.85) : 1;

          let color = "#F7FAFC";
          let opacity = 0.5;
          let stroke = "2px #000000";
          let textShadow = "0px 0px 0px transparent";
          const fontWeight = 900;
          let transformScale = 1;

          if (isActive) {
            color = "#FFE600";
            opacity = 1;
            stroke = "4px #000000";
            textShadow = "4px 4px 0px #000000";
            transformScale = Math.max(1, Math.min(1.28, activeScale));
          } else if (isPast) {
            color = "#FFFFFF";
            opacity = 1;
            stroke = "2px #000000";
            textShadow = "2px 2px 0px rgba(0,0,0,0.35)";
            transformScale = 1;
          }

          return (
            <span
              key={`${w.word}-${w.startFrame}-${idx}`}
              style={{
                display: "inline-block",
                fontFamily:
                  '"Arial Black", "Baloo 2", "Comic Sans MS", "Segoe UI", system-ui, sans-serif',
                fontSize: 58,
                lineHeight: 1.05,
                fontWeight,
                color,
                opacity,
                transform: `scale(${transformScale})`,
                transformOrigin: "center bottom",
                WebkitTextStroke: stroke,
                paintOrder: "stroke fill",
                textShadow,
                letterSpacing: "0.01em",
                whiteSpace: "pre",
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
