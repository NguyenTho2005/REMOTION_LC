import React, { useMemo } from "react";
import rough from "roughjs";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface RoughBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillStyle?: "hachure" | "solid" | "zigzag" | "cross-hatch" | "dots";
  roughness?: number;
  seed?: number;
  animate?: boolean;
  delayFrames?: number;
}

export const RoughBox: React.FC<RoughBoxProps> = ({
  x,
  y,
  width,
  height,
  stroke = "#1E1E1C",
  strokeWidth = 2.5,
  fill,
  fillStyle = "hachure",
  roughness = 1.6,
  seed = 42,
  animate = true,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle hand-drawn boil jitter every 6 frames
  const jitterPhase = Math.floor(frame / 6);
  const activeSeed = seed + (jitterPhase % 7) * 31;

  const paths = useMemo(() => {
    const gen = rough.generator();
    const drawable = gen.rectangle(x, y, width, height, {
      seed: activeSeed,
      roughness,
      stroke,
      strokeWidth,
      fill: fill || undefined,
      fillStyle: fill ? fillStyle : undefined,
      fillWeight: 1.5,
      hachureAngle: 60,
      hachureGap: 8,
    });
    return gen.toPaths(drawable);
  }, [x, y, width, height, activeSeed, roughness, stroke, strokeWidth, fill, fillStyle]);

  const progress = animate
    ? spring({
        frame: frame - delayFrames,
        fps,
        config: { damping: 14, stiffness: 120 },
      })
    : 1;

  if (progress <= 0) return null;

  return (
    <g
      style={{
        transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
        transform: `scale(${Math.min(1.05, 0.85 + 0.15 * progress)})`,
        opacity: Math.min(1, progress * 1.5),
      }}
    >
      {paths.map((p, idx) => (
        <path
          key={idx}
          d={p.d}
          stroke={p.stroke || stroke}
          strokeWidth={p.strokeWidth || strokeWidth}
          fill={p.fill || "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
};

export interface RoughCircleProps {
  cx: number;
  cy: number;
  diameter: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  roughness?: number;
  seed?: number;
  animate?: boolean;
  delayFrames?: number;
}

export const RoughCircle: React.FC<RoughCircleProps> = ({
  cx,
  cy,
  diameter,
  stroke = "#D94E34",
  strokeWidth = 3,
  fill,
  roughness = 1.8,
  seed = 101,
  animate = true,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const jitterPhase = Math.floor(frame / 6);
  const activeSeed = seed + (jitterPhase % 7) * 23;

  const paths = useMemo(() => {
    const gen = rough.generator();
    const drawable = gen.circle(cx, cy, diameter, {
      seed: activeSeed,
      roughness,
      stroke,
      strokeWidth,
      fill: fill || undefined,
      fillStyle: fill ? "hachure" : undefined,
      hachureAngle: -45,
      hachureGap: 10,
    });
    return gen.toPaths(drawable);
  }, [cx, cy, diameter, activeSeed, roughness, stroke, strokeWidth, fill]);

  const progress = animate
    ? spring({
        frame: frame - delayFrames,
        fps,
        config: { damping: 14, stiffness: 120 },
      })
    : 1;

  if (progress <= 0) return null;

  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        transform: `scale(${0.8 + 0.2 * progress})`,
        opacity: Math.min(1, progress * 1.4),
      }}
    >
      {paths.map((p, idx) => (
        <path
          key={idx}
          d={p.d}
          stroke={p.stroke || stroke}
          strokeWidth={p.strokeWidth || strokeWidth}
          fill={p.fill || "none"}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

export interface RoughArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  seed?: number;
  delayFrames?: number;
}

export const RoughArrow: React.FC<RoughArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  stroke = "#1E1E1C",
  strokeWidth = 2.8,
  seed = 55,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const jitterPhase = Math.floor(frame / 6);
  const activeSeed = seed + (jitterPhase % 7) * 19;

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const paths = useMemo(() => {
    const gen = rough.generator();
    // main line
    const line = gen.line(x1, y1, x2, y2, {
      seed: activeSeed,
      roughness: 1.4,
      stroke,
      strokeWidth,
    });

    // Arrowhead calculations
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 22;
    const arrowAngle = Math.PI / 6;

    const leftX = x2 - headLength * Math.cos(angle - arrowAngle);
    const leftY = y2 - headLength * Math.sin(angle - arrowAngle);
    const rightX = x2 - headLength * Math.cos(angle + arrowAngle);
    const rightY = y2 - headLength * Math.sin(angle + arrowAngle);

    const leftHead = gen.line(x2, y2, leftX, leftY, {
      seed: activeSeed + 1,
      roughness: 1.2,
      stroke,
      strokeWidth,
    });
    const rightHead = gen.line(x2, y2, rightX, rightY, {
      seed: activeSeed + 2,
      roughness: 1.2,
      stroke,
      strokeWidth,
    });

    return [
      ...gen.toPaths(line),
      ...gen.toPaths(leftHead),
      ...gen.toPaths(rightHead),
    ];
  }, [x1, y1, x2, y2, activeSeed, stroke, strokeWidth]);

  if (progress <= 0) return null;

  return (
    <g
      style={{
        opacity: Math.min(1, progress * 1.5),
        transformOrigin: `${x1}px ${y1}px`,
        transform: `scale(${0.9 + 0.1 * progress})`,
      }}
    >
      {paths.map((p, idx) => (
        <path
          key={idx}
          d={p.d}
          stroke={p.stroke || stroke}
          strokeWidth={p.strokeWidth || strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

export interface SelfDrawingSvgPathProps {
  d: string;
  pathLength: number;
  stroke?: string;
  strokeWidth?: number;
  delayFrames?: number;
  durationFrames?: number;
}

export const SelfDrawingSvgPath: React.FC<SelfDrawingSvgPathProps> = ({
  d,
  pathLength,
  stroke = "#1E1E1C",
  strokeWidth = 3,
  delayFrames = 0,
  durationFrames = 25,
}) => {
  const frame = useCurrentFrame();
  const current = Math.max(0, frame - delayFrames);
  const rawProgress = Math.min(1, current / durationFrames);
  // Ease out cubic
  const progress = 1 - Math.pow(1 - rawProgress, 3);
  const offset = pathLength * (1 - progress);

  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={pathLength}
      strokeDashoffset={offset}
    />
  );
};

export interface HighlighterStripeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  seed?: number;
  delayFrames?: number;
}

export const HighlighterStripe: React.FC<HighlighterStripeProps> = ({
  x,
  y,
  width,
  height,
  color = "#E5A93C",
  seed = 77,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const currentWidth = width * progress;

  const jitterPhase = Math.floor(frame / 6);
  const activeSeed = seed + (jitterPhase % 7) * 13;

  const paths = useMemo(() => {
    if (currentWidth <= 5) return [];
    const gen = rough.generator();
    const drawable = gen.rectangle(x, y, currentWidth, height, {
      seed: activeSeed,
      roughness: 1.8,
      stroke: "none",
      fill: color,
      fillStyle: "solid",
    });
    return gen.toPaths(drawable);
  }, [x, y, currentWidth, height, activeSeed, color]);

  if (progress <= 0) return null;

  return (
    <g opacity={0.45}>
      {paths.map((p, idx) => (
        <path key={idx} d={p.d} fill={p.fill || color} stroke="none" />
      ))}
    </g>
  );
};
