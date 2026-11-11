import React from "react";
import { AbsoluteFill, Composition, Sequence, useCurrentFrame } from "remotion";
import { AuroraGlassmorphism } from "../components/AuroraGlassmorphism";
import { LiquidMotionBlob } from "../components/LiquidMotionBlob";

export const MOTION_STYLES_SHOWCASE_DURATION = 150;

const AuroraSegment: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AuroraGlassmorphism
      frame={frame}
      title="Aurora Glass"
      subtext="Mesh-gradient light · frosted glass card"
    />
  );
};

const LiquidSegment: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#090b16" }}>
      <LiquidMotionBlob frame={frame} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 220,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            padding: "18px 28px",
            borderRadius: 20,
            backgroundColor: "rgba(12, 16, 28, 0.35)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(10px)",
            color: "#f8fafc",
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Liquid Motion SDF
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MotionStylesShowcaseVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, backgroundColor: "#050816" }}>
      <Sequence durationInFrames={75} name="Aurora Glassmorphism">
        <AuroraSegment />
      </Sequence>
      <Sequence from={75} durationInFrames={75} name="Liquid Motion SDF">
        <LiquidSegment />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MotionStylesShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="MotionStylesShowcase"
      component={MotionStylesShowcaseVideo}
      durationInFrames={MOTION_STYLES_SHOWCASE_DURATION}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
