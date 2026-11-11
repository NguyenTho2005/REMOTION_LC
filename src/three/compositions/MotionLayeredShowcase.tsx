import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import rough from "roughjs/bin/rough";
import { AuroraBackground } from "../components/AuroraBackground";
import { FrameSyncedLottie, type LottieAnimationData } from "../../components/animation/RemotionLottie";

export const MOTION_LAYERED_SHOWCASE_DURATION = 180; // 6s @ 30fps

const useLottieData = (src: string): LottieAnimationData | null => {
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender(`Loading Lottie: ${src}`));

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => res.json() as Promise<LottieAnimationData>)
      .then((json) => {
        if (cancelled) return;
        setData(json);
        continueRender(handle);
      })
      .catch(() => {
        if (!cancelled) {
          continueRender(handle);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [src, handle]);

  return data;
};

const RoughMidground: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const progress = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const wobble = interpolate(frame, [0, 60, 120, 179], [0.8, 1.6, 1.1, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    const rc = rough.svg(svg);
    const cx = 540;
    const cy = 980;
    const radius = 180 + 20 * progress;

    svg.appendChild(
      rc.circle(cx, cy, radius * 2, {
        stroke: "#e2e8f0",
        strokeWidth: 3,
        fill: "rgba(56, 189, 248, 0.12)",
        fillStyle: "hachure",
        hachureGap: 10,
        roughness: wobble,
        bowing: 1.2,
        seed: 7,
      }),
    );
    svg.appendChild(
      rc.rectangle(cx - 220, cy + 220, 440, 140, {
        stroke: "#a78bfa",
        strokeWidth: 3,
        fill: "rgba(167, 139, 250, 0.10)",
        fillStyle: "cross-hatch",
        hachureGap: 12,
        roughness: wobble * 0.9,
        seed: 11,
      }),
    );
    svg.appendChild(
      rc.line(cx - 260, cy - 260, cx + 260, cy - 260, {
        stroke: "#22d3ee",
        strokeWidth: 4,
        roughness: wobble,
        seed: 3,
      }),
    );
  }, [progress, wobble]);

  return (
    <svg
      ref={svgRef}
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
};

export const MotionLayeredShowcaseVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lottieData = useLottieData(staticFile("lottie/pulse-orb.json"));

  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [10, 30], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitle = useMemo(() => "Background: Shader (R3F/WebGL) · Midground: RoughJS + Lottie · Foreground: Typography", []);

  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, backgroundColor: "#050816", overflow: "hidden" }}>
      {/* Background Layer: WebGL shader in ThreeCanvas */}
      <AbsoluteFill>
        <AuroraBackground frame={frame} intensity={1.0} roughness={0.22} showGlassCard={false} />
      </AbsoluteFill>

      {/* Midground Layer: RoughJS (deterministic by frame/seed) + frame-synced Lottie */}
      <AbsoluteFill>
        <RoughMidground frame={frame} fps={fps} />
        {lottieData ? (
          <div
            style={{
              position: "absolute",
              left: 540 - 140,
              top: 980 - 140,
              width: 280,
              height: 280,
              filter: "drop-shadow(0 12px 30px rgba(56,189,248,0.35))",
            }}
          >
            <FrameSyncedLottie animationData={lottieData} loop />
          </div>
        ) : null}
      </AbsoluteFill>

      {/* Foreground Layer: UI / kinetic typography / captions-safe overlay */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Sequence from={8} durationInFrames={MOTION_LAYERED_SHOWCASE_DURATION - 8}>
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              bottom: 240,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              padding: "28px 30px",
              borderRadius: 24,
              background: "rgba(8, 12, 24, 0.45)",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 54,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              Motion Architecture Đa Tầng
            </div>
            <div
              style={{
                marginTop: 12,
                color: "rgba(241,245,249,0.88)",
                fontSize: 26,
                lineHeight: 1.35,
                fontWeight: 500,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {subtitle}
            </div>
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MotionLayeredShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="MotionLayeredShowcase"
      component={MotionLayeredShowcaseVideo}
      durationInFrames={MOTION_LAYERED_SHOWCASE_DURATION}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
