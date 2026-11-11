import React from "react";
import { Lottie, getLottieMetadata } from "@remotion/lottie";
import type { LottieAnimationData, LottieProps } from "@remotion/lottie";

export { Lottie, getLottieMetadata };
export type { LottieAnimationData, LottieProps };

export interface FrameSyncedLottieProps
  extends Omit<LottieProps, "animationData"> {
  /** Parsed Lottie JSON animation data (deterministic asset). */
  animationData: LottieAnimationData;
  /** Optional wrapper className for layout control in layered scenes. */
  containerClassName?: string;
}

/**
 * Frame-synced Lottie wrapper for Remotion (no autoplay/realtime clock).
 * Uses @remotion/lottie internally so playback is driven by the Remotion timeline.
 * Suitable for Midground character/VFX layers in the motion architecture.
 */
export const FrameSyncedLottie: React.FC<FrameSyncedLottieProps> = ({
  animationData,
  containerClassName,
  style,
  loop = true,
  ...props
}) => {
  return (
    <div className={containerClassName} style={{ width: "100%", height: "100%", ...style }}>
      <Lottie animationData={animationData} loop={loop} style={{ width: "100%", height: "100%" }} {...props} />
    </div>
  );
};
