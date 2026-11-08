import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionChunk } from "../../../types/schema.ts";

interface EditorialCaptionsProps {
  captions: CaptionChunk[];
  accentColor?: string;
}

export const EditorialCaptions: React.FC<EditorialCaptionsProps> = ({
  captions,
  accentColor = "#E5A93C", // Mustard highlighter accent
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the active caption for the current frame
  const activeCaption = captions.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  );

  if (!activeCaption) return null;

  // Spring animation when caption appears
  const chunkLocalFrame = frame - activeCaption.startFrame;
  const enterProgress = spring({
    frame: chunkLocalFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Split caption text by words to identify highlight words
  const words = activeCaption.text.split(" ");
  const highlightWordsLower = activeCaption.highlightWords.map((hw) =>
    hw.toLowerCase()
  );

  // Helper to test if a word or phrase is highlighted
  const isHighlighted = (word: string): boolean => {
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").toLowerCase();
    return highlightWordsLower.some((hw) => hw.includes(cleanWord) && cleanWord.length > 2);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 300, // Safe above TikTok sound & author bar (280px safe zone)
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: Math.min(1, enterProgress * 1.5),
        transform: `translateY(${10 * (1 - enterProgress)}px)`,
      }}
    >
      {/* Background card with subtle rough paper tape effect */}
      <div
        style={{
          backgroundColor: "rgba(244, 241, 234, 0.94)",
          border: "2px solid #1E1E1C",
          borderRadius: 8,
          padding: "16px 28px",
          boxShadow: "4px 4px 0px rgba(30, 30, 28, 0.8)",
          maxWidth: 920,
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Be Vietnam Pro', 'Space Grotesk', sans-serif",
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#1E1E1C",
            letterSpacing: "-0.01em",
            wordBreak: "break-word",
          }}
        >
          {words.map((word, index) => {
            const highlighted = isHighlighted(word);
            return (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  position: "relative",
                  margin: "0 4px",
                }}
              >
                {highlighted && (
                  <span
                    style={{
                      position: "absolute",
                      left: -4,
                      right: -4,
                      bottom: 4,
                      height: "42%",
                      backgroundColor: accentColor,
                      opacity: 0.45,
                      borderRadius: 3,
                      zIndex: -1,
                      transform: "rotate(-0.8deg)",
                    }}
                  />
                )}
                <span
                  style={{
                    color: highlighted ? "#1E1E1C" : "#2C2C28",
                    fontWeight: highlighted ? 800 : 600,
                    textDecoration: highlighted ? "underline" : "none",
                    textDecorationColor: accentColor,
                    textDecorationThickness: 3,
                    textUnderlineOffset: 6,
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
