import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../constants";

interface DoodleSubtitleProps {
  text: string;
  durationFrames?: number;
  highlightWords?: string[];
}

export const DoodleSubtitle: React.FC<DoodleSubtitleProps> = ({
  text,
  durationFrames = 300,
  highlightWords = [],
}) => {
  const frame = useCurrentFrame();

  // Entrance and exit fade
  const opacity = interpolate(
    frame,
    [0, 10, durationFrames - 15, durationFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(frame, [0, 10], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boil = Math.sin(frame * 0.25) * 0.5;

  if (opacity <= 0.01) return null;

  const words = text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        bottom: 180,
        left: 70,
        right: 110,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 40,
        opacity,
        transform: `translateY(${translateY}px) rotate(${boil * 0.4}deg)`,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "14px 28px",
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          borderRadius: "16px",
          border: `2.5px solid ${PALETTE.charcoal}`,
          boxShadow: "3px 4px 0px rgba(0, 0, 0, 0.12)",
          maxWidth: 860,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Patrick Hand', 'Caveat', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: PALETTE.charcoal,
            lineHeight: 1.35,
            letterSpacing: 0.5,
          }}
        >
          {words.map((word, i) => {
            const clean = word
              .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, "")
              .toLowerCase();
            const isHighlighted = highlightWords.some(
              (hw) => hw.toLowerCase() === clean
            );

            return (
              <span
                key={`${word}-${i}`}
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: "0 3px",
                  fontWeight: isHighlighted ? 900 : 700,
                  color: isHighlighted ? PALETTE.charcoal : PALETTE.charcoal,
                }}
              >
                {isHighlighted && (
                  <span
                    style={{
                      position: "absolute",
                      left: -2,
                      right: -2,
                      bottom: 2,
                      height: "55%",
                      backgroundColor: PALETTE.mustardYellow,
                      opacity: 0.7,
                      zIndex: -1,
                      borderRadius: 4,
                    }}
                  />
                )}
                {word}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
};
