import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export interface ParticleTimelineConfig {
  startFrame?: number;
  durationInFrames?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
}

export interface ParticleTimelineResult {
  frame: number;
  fps: number;
  time: number;
  progress: number;
  easedProgress: number;
  opacityMultiplier: number;
  isActive: boolean;
}

export function useParticleTimeline(
  config?: ParticleTimelineConfig
): ParticleTimelineResult {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames: totalCompFrames } = useVideoConfig();

  const start = config?.startFrame ?? 0;
  const duration = config?.durationInFrames ?? totalCompFrames;
  const fadeIn = config?.fadeInFrames ?? Math.min(15, Math.floor(duration * 0.2));
  const fadeOut = config?.fadeOutFrames ?? Math.min(20, Math.floor(duration * 0.25));

  // Frame relative to effect start
  const relativeFrame = currentFrame - start;
  const isActive = relativeFrame >= 0 && relativeFrame <= duration;

  // Linear normalized progress [0, 1]
  const progress = Math.max(0, Math.min(1, relativeFrame / Math.max(1, duration)));

  // Easing curve selection
  let easingFn = Easing.inOut(Easing.cubic);
  if (config?.easing === "linear") easingFn = Easing.linear;
  if (config?.easing === "easeIn") easingFn = Easing.in(Easing.cubic);
  if (config?.easing === "easeOut") easingFn = Easing.out(Easing.cubic);

  const easedProgress = interpolate(progress, [0, 1], [0, 1], {
    easing: easingFn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate smooth fade-in and fade-out opacity
  let opacityMultiplier = 1.0;
  if (relativeFrame < fadeIn) {
    opacityMultiplier = interpolate(relativeFrame, [0, fadeIn], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (relativeFrame > duration - fadeOut) {
    opacityMultiplier = interpolate(
      relativeFrame,
      [duration - fadeOut, duration],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  }

  if (relativeFrame < 0 || relativeFrame > duration) {
    opacityMultiplier = 0.0;
  }

  const time = currentFrame / fps;

  return {
    frame: currentFrame,
    fps,
    time,
    progress,
    easedProgress,
    opacityMultiplier,
    isActive,
  };
}
