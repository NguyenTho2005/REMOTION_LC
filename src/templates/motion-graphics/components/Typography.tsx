import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface HeadlineProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  style?: React.CSSProperties;
}

export const Headline: React.FC<HeadlineProps> = ({
  title,
  highlight,
  subtitle,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  let renderedTitle: React.ReactNode = title;
  if (highlight && title.includes(highlight)) {
    const parts = title.split(highlight);
    renderedTitle = (
      <>
        {parts[0]}
        <span
          style={{
            color: "#38bdf8",
            textShadow: "0 0 25px rgba(56, 189, 248, 0.5)",
            fontWeight: 900,
          }}
        >
          {highlight}
        </span>
        {parts.slice(1).join(highlight)}
      </>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 260,
        left: 60,
        right: 60,
        textAlign: "center",
        transform: `translateY(${translateY}px)`,
        opacity,
        zIndex: 30,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 54,
          fontWeight: 900,
          lineHeight: 1.25,
          letterSpacing: -1,
          color: "#f8fafc",
        }}
      >
        {renderedTitle}
      </div>
      {subtitle && (
        <div
          style={{
            marginTop: 14,
            fontSize: 24,
            fontWeight: 600,
            color: "#94a3b8",
            letterSpacing: 0.5,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

export const MotionSubtitle: React.FC<{
  text: string;
  keyword?: string;
  style?: React.CSSProperties;
}> = ({ text, keyword, style }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 8], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let content: React.ReactNode = text;
  if (keyword && text.includes(keyword)) {
    const parts = text.split(keyword);
    content = (
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
        bottom: 290, // safe above TikTok bottom UI (270px)
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
          backgroundColor: "rgba(10, 15, 29, 0.92)",
          backdropFilter: "blur(16px)",
          color: "#f8fafc",
          fontSize: 34,
          lineHeight: 1.45,
          fontWeight: 600,
          textAlign: "center",
          padding: "20px 36px",
          borderRadius: 24,
          border: "2px solid rgba(56, 189, 248, 0.35)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
          maxWidth: 960,
        }}
      >
        {content}
      </div>
    </div>
  );
};
