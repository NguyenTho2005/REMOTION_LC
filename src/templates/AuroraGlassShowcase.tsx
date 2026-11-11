import React from "react";
import { AbsoluteFill, Composition, Sequence, interpolate, useCurrentFrame } from "remotion";
import { AuroraBackground } from "../three/components/AuroraBackground";

export const AURORA_GLASS_SHOWCASE_DURATION = 300; // 10s @ 30fps

export interface AuroraGlassShowcaseProps {
  title?: string;
  subtitle?: string;
}

const OverlayText: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 20], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 72px 220px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          backgroundColor: "rgba(10, 14, 24, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(12px)",
          borderRadius: 28,
          padding: "28px 36px",
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.2,
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AuroraGlassShowcaseVideo: React.FC<AuroraGlassShowcaseProps> = ({
  title = "Aurora Glass Shader",
  subtitle = "Deterministic Remotion + Three.js WebGL background",
}) => {
  const frame = useCurrentFrame();
  const intensity = interpolate(frame, [0, 150, 299], [0.85, 1.15, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
      <AuroraBackground frame={frame} intensity={intensity} roughness={0.28} showGlassCard />

      <Sequence from={10} durationInFrames={AURORA_GLASS_SHOWCASE_DURATION - 10}>
        <OverlayText title={title} subtitle={subtitle} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const AuroraGlassShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="AuroraGlassShowcase"
      component={AuroraGlassShowcaseVideo}
      durationInFrames={AURORA_GLASS_SHOWCASE_DURATION}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: "Aurora Glass Shader",
        subtitle: "Deterministic Remotion + Three.js WebGL background",
      }}
    />
  );
};
