import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, SPRING_BOUNCE } from "../constants";

interface WordHighlight {
  word: string;
  color?: string;
  underline?: boolean;
}

interface DoodleTextProps {
  children: string;
  fontSize?: number;
  color?: string;
  delayFrames?: number;
  staggerFrames?: number;
  highlights?: (string | WordHighlight)[];
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
  fontWeight?: number | string;
}

export const DoodleText: React.FC<DoodleTextProps> = ({
  children,
  fontSize = 44,
  color = PALETTE.charcoal,
  delayFrames = 0,
  staggerFrames = 4,
  highlights = [],
  style,
  align = "center",
  fontWeight = 700,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = children.split(" ");

  // Normalization for matching highlights
  const isHighlighted = (word: string) => {
    const clean = word.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, "").toLowerCase();
    for (const h of highlights) {
      if (typeof h === "string") {
        if (h.toLowerCase() === clean) return { isMatch: true, color: PALETTE.mustardYellow, underline: false };
      } else if (h.word.toLowerCase() === clean) {
        return { isMatch: true, color: h.color || PALETTE.mustardYellow, underline: h.underline ?? false };
      }
    }
    return { isMatch: false, color: undefined, underline: false };
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
        alignItems: "center",
        columnGap: fontSize * 0.28,
        rowGap: fontSize * 0.22,
        fontFamily: "'Patrick Hand', 'Caveat', 'Comic Sans MS', cursive, sans-serif",
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.25,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delayFrames + i * staggerFrames;
        const pop = spring({
          frame: frame - wordDelay,
          fps,
          config: SPRING_BOUNCE,
        });

        // Pseudo-random deterministic rotation between -2.5 and +2.5 degrees
        const seedRotation = (((i * 7 + 13) % 11) - 5) * 0.5;
        // Subtle hand-drawn vibration
        const boil = Math.sin((frame + i * 5) * 0.3) * 0.4;
        const currentRotation = seedRotation + boil;

        const highlightInfo = isHighlighted(word);

        if (pop <= 0.01) {
          return null;
        }

        return (
          <span
            key={`${word}-${i}`}
            style={{
              position: "relative",
              display: "inline-block",
              transform: `scale(${pop}) rotate(${currentRotation}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            {/* Marker stroke underlay if highlighted */}
            {highlightInfo.isMatch && (
              <span
                style={{
                  position: "absolute",
                  left: "-4px",
                  right: "-4px",
                  bottom: highlightInfo.underline ? "2px" : "15%",
                  height: highlightInfo.underline ? "6px" : "70%",
                  backgroundColor: highlightInfo.color,
                  opacity: 0.75,
                  zIndex: -1,
                  borderRadius: "4px",
                  transform: `skewX(${seedRotation * 2}deg)`,
                  filter: "url(#doodle-wobble)",
                }}
              />
            )}
            {word}
          </span>
        );
      })}
    </div>
  );
};
