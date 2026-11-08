import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface StickmanSubtitleProps {
  text: string;
  keyword?: string;
  style?: React.CSSProperties;
}

export const StickmanSubtitle: React.FC<StickmanSubtitleProps> = ({
  text,
  keyword,
  style,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 8], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // If keyword is specified, highlight it in electric blue
  let renderedContent: React.ReactNode = text;
  if (keyword && text.includes(keyword)) {
    const parts = text.split(keyword);
    renderedContent = (
      <>
        {parts[0]}
        <span style={{ color: "#38bdf8", fontWeight: 800 }}>{keyword}</span>
        {parts.slice(1).join(keyword)}
      </>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 290, // safe zone for TikTok
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 50,
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(12px)",
          color: "#f8fafc",
          fontSize: 34,
          lineHeight: 1.45,
          fontWeight: 600,
          textAlign: "center",
          padding: "20px 36px",
          borderRadius: 24,
          border: "2px solid rgba(56, 189, 248, 0.3)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
          maxWidth: 960,
        }}
      >
        {renderedContent}
      </div>
    </div>
  );
};
