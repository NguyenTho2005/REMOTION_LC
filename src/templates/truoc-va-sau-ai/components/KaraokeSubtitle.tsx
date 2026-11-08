import React from "react";
import { useCurrentFrame } from "remotion";
import { FILM_COLORS, FILM_SPECS } from "../design-tokens";
import rawAlignmentData from "../script/alignment.json";

export interface WordAlignment {
  text: string;
  relStartMs: number;
  relEndMs: number;
  absStartMs: number;
  absEndMs: number;
  startFrame: number;
  endFrame: number;
}

export interface PhraseAlignment {
  phraseText: string;
  startMs: number;
  endMs: number;
  absStartMs: number;
  absEndMs: number;
  startFrame: number;
  endFrame: number;
  words: WordAlignment[];
}

export interface ActAlignment {
  actId: string;
  title: string;
  audioFile: string;
  audioDurationSec: number;
  audioOffsetFrame: number;
  offsetMs: number;
  startFrame: number;
  durationInFrames: number;
  phrases: PhraseAlignment[];
  words: WordAlignment[];
}

const actsData = rawAlignmentData as ActAlignment[];

// Flatten all phrases across all acts for rapid lookup
const allPhrases: (PhraseAlignment & { actId: string })[] = [];
actsData.forEach((act) => {
  act.phrases.forEach((phrase) => {
    allPhrases.push({ ...phrase, actId: act.actId });
  });
});

export interface KaraokeSubtitleProps {
  currentFrame?: number;
  frameOffset?: number;
  style?: React.CSSProperties;
}

export const KaraokeSubtitle: React.FC<KaraokeSubtitleProps> = ({
  currentFrame: explicitFrame,
  frameOffset = 0,
  style,
}) => {
  const remotionFrame = useCurrentFrame();
  const globalFrame = (explicitFrame !== undefined ? explicitFrame : remotionFrame) + frameOffset;

  // Find the active phrase (display slightly before and after for smooth reading)
  const activePhrase = allPhrases.find(
    (p) => globalFrame >= p.startFrame - 4 && globalFrame <= p.endFrame + 12
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
        bottom: FILM_SPECS.subtitleZone.bottom,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          maxWidth: 1400,
          padding: "16px 36px",
          backgroundColor: FILM_COLORS.subtitleBg,
          border: `3px solid ${FILM_COLORS.stickerWhite}`,
          borderRadius: 28,
          boxShadow: `0 12px 32px ${FILM_COLORS.stickerShadow}`,
          backdropFilter: "blur(6px)",
        }}
      >
        {activePhrase.words.map((word, idx) => {
          const isSpoken = globalFrame >= word.endFrame;
          const isActive = globalFrame >= word.startFrame && globalFrame <= word.endFrame;

          let color = FILM_COLORS.subtitleText;
          let fontWeight: React.CSSProperties["fontWeight"] = 600;
          let scale = 1.0;
          let textShadow = "none";

          if (isActive) {
            color = FILM_COLORS.subtitleActiveWord;
            fontWeight = 900;
            scale = 1.1;
            textShadow = "0 0 16px rgba(242, 193, 78, 0.6)";
          } else if (isSpoken) {
            color = FILM_COLORS.paperDark;
            fontWeight = 700;
          } else {
            color = "rgba(255, 255, 255, 0.55)";
            fontWeight = 500;
          }

          return (
            <span
              key={`${activePhrase.phraseText}-${idx}-${word.text}`}
              style={{
                fontSize: FILM_SPECS.subtitleZone.fontSize,
                color,
                fontWeight,
                transform: `scale(${scale})`,
                textShadow,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                letterSpacing: "0.02em",
                display: "inline-block",
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
