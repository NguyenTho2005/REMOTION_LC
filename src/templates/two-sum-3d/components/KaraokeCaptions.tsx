import React from "react";
import { useCurrentFrame } from "remotion";
import { TWO_SUM_COLORS, TWO_SUM_SPECS } from "../design-tokens";
import rawAlignmentData from "../alignment.json";
import type { SceneAlignment, PhraseAlignment } from "../types";

const scenesData = rawAlignmentData as SceneAlignment[];

// Flatten all phrases across all scenes
const allPhrases: (PhraseAlignment & { sceneId: string })[] = [];
scenesData.forEach((scene) => {
  scene.phrases.forEach((phrase) => {
    allPhrases.push({ ...phrase, sceneId: scene.sceneId });
  });
});

export interface KaraokeCaptionsProps {
  currentFrame?: number;
  frameOffset?: number;
  style?: React.CSSProperties;
}

export const KaraokeCaptions: React.FC<KaraokeCaptionsProps> = ({
  currentFrame: explicitFrame,
  frameOffset = 0,
  style,
}) => {
  const remotionFrame = useCurrentFrame();
  const globalFrame = (explicitFrame !== undefined ? explicitFrame : remotionFrame) + frameOffset;

  // Find active phrase
  const activePhrase = allPhrases.find(
    (p) => globalFrame >= p.startFrame - 4 && globalFrame <= p.endFrame + 10
  );

  if (!activePhrase) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: TWO_SUM_SPECS.safeArea.bottom,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 40px",
        pointerEvents: "none",
        zIndex: 100,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 12px",
          maxWidth: 960,
          padding: "16px 28px",
          backgroundColor: TWO_SUM_COLORS.subtitleBg,
          border: `2px solid ${TWO_SUM_COLORS.subtitleBorder}`,
          borderRadius: 24,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        {activePhrase.words.map((word, idx) => {
          const isSpoken = globalFrame >= word.endFrame;
          const isActive = globalFrame >= word.startFrame && globalFrame <= word.endFrame;

          let color = TWO_SUM_COLORS.subtitleUpcomingWord;
          let fontWeight: React.CSSProperties["fontWeight"] = 600;
          let scale = 1.0;
          let textShadow = "none";

          if (isActive) {
            color = TWO_SUM_COLORS.subtitleActiveWord;
            fontWeight = 900;
            scale = 1.12;
            textShadow = "0 0 18px rgba(245, 158, 11, 0.7)";
          } else if (isSpoken) {
            color = TWO_SUM_COLORS.subtitleSpokenWord;
            fontWeight = 700;
          }

          return (
            <span
              key={`${activePhrase.phraseText}-${idx}-${word.text}`}
              style={{
                fontSize: 32,
                color,
                fontWeight,
                transform: `scale(${scale})`,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'SF Pro Display', sans-serif",
                letterSpacing: "0.02em",
                display: "inline-block",
                textShadow,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
