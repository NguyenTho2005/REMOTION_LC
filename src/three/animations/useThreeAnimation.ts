import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { AnimationConfig } from "../core/types";

export interface AnimatedTransforms {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  opacity: number;
}

export function useThreeAnimation(
  basePosition: [number, number, number] = [0, 0, 0],
  baseRotation: [number, number, number] = [0, 0, 0],
  baseScale: [number, number, number] | number = 1,
  config?: AnimationConfig
): AnimatedTransforms {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleArray: [number, number, number] =
    typeof baseScale === "number"
      ? [baseScale, baseScale, baseScale]
      : baseScale;

  if (!config || config.type === "none") {
    return {
      position: basePosition,
      rotation: baseRotation,
      scale: scaleArray,
      opacity: 1,
    };
  }

  const startFrame = config.startFrame ?? 0;
  const endFrame = config.endFrame ?? 300;
  const speed = config.speed ?? 1;
  const activeFrame = Math.max(0, frame - startFrame);
  const duration = Math.max(1, endFrame - startFrame);
  const progress = Math.min(1, Math.max(0, activeFrame / duration));

  let pos: [number, number, number] = [...basePosition];
  const rot: [number, number, number] = [...baseRotation];
  let scl: [number, number, number] = [...scaleArray];
  let opacity = 1;

  switch (config.type) {
    case "rotate": {
      const rotAngle = (activeFrame * 0.03 * speed) * (config.reverse ? -1 : 1);
      if (config.axis === "x") rot[0] += rotAngle;
      else if (config.axis === "z") rot[2] += rotAngle;
      else if (config.axis === "all") {
        rot[0] += rotAngle * 0.6;
        rot[1] += rotAngle;
        rot[2] += rotAngle * 0.4;
      } else {
        // default y
        rot[1] += rotAngle;
      }
      break;
    }

    case "pulse": {
      const pulseFactor = 1 + Math.sin(activeFrame * 0.08 * speed) * 0.12 * (config.range ?? 1);
      scl = [scl[0] * pulseFactor, scl[1] * pulseFactor, scl[2] * pulseFactor];
      break;
    }

    case "float": {
      const floatOffset = Math.sin(activeFrame * 0.06 * speed) * 0.25 * (config.range ?? 1);
      pos[1] += floatOffset;
      rot[1] += floatOffset * 0.2;
      break;
    }

    case "scaleUp": {
      const s = spring({
        frame: activeFrame,
        fps,
        config: { damping: 14, stiffness: 120 },
      });
      scl = [scl[0] * s, scl[1] * s, scl[2] * s];
      opacity = interpolate(s, [0, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    }

    case "explode": {
      const explodeAmount = interpolate(progress, [0, 1], [0, 2.5 * (config.range ?? 1)], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const norm = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]) || 1;
      pos = [
        pos[0] + (pos[0] / norm) * explodeAmount,
        pos[1] + (pos[1] / norm) * explodeAmount,
        pos[2] + (pos[2] / norm) * explodeAmount,
      ];
      break;
    }

    case "orbit": {
      const radius = Math.sqrt(pos[0] * pos[0] + pos[2] * pos[2]) || 3;
      const angle = (activeFrame * 0.03 * speed) + Math.atan2(pos[2], pos[0]);
      pos[0] = Math.cos(angle) * radius;
      pos[2] = Math.sin(angle) * radius;
      break;
    }

    case "dataFlow": {
      const cycle = (activeFrame * 0.05 * speed) % 1;
      pos[1] += Math.sin(cycle * Math.PI * 2) * 0.3;
      const glow = 1 + Math.sin(cycle * Math.PI * 2) * 0.2;
      scl = [scl[0] * glow, scl[1] * glow, scl[2] * glow];
      break;
    }
  }

  return {
    position: pos,
    rotation: rot,
    scale: scl,
    opacity,
  };
}
