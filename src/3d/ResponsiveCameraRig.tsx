import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import * as THREE from "three";
import {
  getAspectRatioInfo,
  getAdaptiveCameraParams,
  type FramingMargins,
  type AspectRatioInfo,
} from "./utils/fitObjectToCamera";

export type CameraPreset =
  | "static"
  | "orbit"
  | "dolly"
  | "zoom"
  | "pan"
  | "focusCenter"
  | "wide"
  | "overhead"
  | "adaptiveFit";

export interface ResponsiveCameraRigProps {
  /** Camera movement preset */
  preset?: CameraPreset;
  /** Explicit position override (if static/custom) */
  customPosition?: [number, number, number];
  /** LookAt target coordinates */
  target?: [number, number, number];
  /** Base camera distance (at 16:9 standard). Will automatically adapt to 9:16 and other aspect ratios */
  baseDistance?: number;
  /** Base vertical FOV in degrees (defaults to 45) */
  fov?: number;
  /** Speed multiplier for animated presets */
  speed?: number;
  /** Estimated bounding size of foreground content to frame safely [width, height, depth] */
  contentBounds?: {
    width: number;
    height: number;
    depth?: number;
  };
  /** Custom margin ratios for safe zone */
  safeMargins?: FramingMargins;
  /** Easing / progress override */
  progressOverride?: number;
}

export const ResponsiveCameraRig: React.FC<ResponsiveCameraRigProps> = ({
  preset = "adaptiveFit",
  customPosition,
  target: userTarget = [0, 0, 0],
  baseDistance = 8.5,
  fov = 45,
  speed = 1.0,
  contentBounds = { width: 4.5, height: 3.2, depth: 1.5 },
  safeMargins,
  progressOverride,
}) => {
  const { camera } = useThree();
  const frame = useCurrentFrame();
  const { width: vpWidth, height: vpHeight, durationInFrames } = useVideoConfig();

  useLayoutEffect(() => {
    // 1. Calculate aspect ratio and adaptive framing parameters
    const aspectInfo: AspectRatioInfo = getAspectRatioInfo(vpWidth, vpHeight);
    const progress =
      progressOverride !== undefined
        ? progressOverride
        : Math.min(1, Math.max(0, frame / (durationInFrames || 1)));

    // Ensure camera aspect matches current viewport exactly
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = aspectInfo.aspect;
      camera.fov = fov;
    }

    // Derive adaptive distance and target based on content bounds and aspect ratio
    const adaptive = getAdaptiveCameraParams({
      contentWidth: contentBounds.width,
      contentHeight: contentBounds.height,
      contentDepth: contentBounds.depth ?? 1,
      viewportWidth: vpWidth,
      viewportHeight: vpHeight,
      baseDistance,
      baseFov: fov,
      targetOffset: userTarget,
      customMargins: safeMargins,
    });

    const targetVec = new THREE.Vector3(...adaptive.target);
    const fitDistance = adaptive.distance;

    // In portrait (9:16), distance increases proportionally to fit width
    const aspectDistanceMultiplier = aspectInfo.isPortrait
      ? Math.max(1.0, (16 / 9) / (aspectInfo.aspect * 2.2))
      : 1.0;

    const effectiveDistance = Math.max(fitDistance, baseDistance * aspectDistanceMultiplier);

    // 2. Execute deterministic preset motion
    switch (preset) {
      case "orbit": {
        // Smooth 360 orbit around Y axis without losing vertical framing
        const angle = frame * 0.012 * speed;
        const orbitRadius = effectiveDistance;
        camera.position.x = targetVec.x + Math.sin(angle) * orbitRadius;
        camera.position.z = targetVec.z + Math.cos(angle) * orbitRadius;
        camera.position.y =
          targetVec.y + (aspectInfo.isPortrait ? 1.5 : 1.0) + Math.sin(frame * 0.01) * 0.3;
        camera.lookAt(targetVec);
        break;
      }

      case "dolly": {
        // Safe push-in: distance moves from 1.3x down to 0.95x of safe distance (never clipping content!)
        const currentDist = interpolate(
          progress,
          [0, 1],
          [effectiveDistance * 1.35, effectiveDistance * 0.95],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        camera.position.set(
          targetVec.x,
          targetVec.y + (aspectInfo.isPortrait ? 0.8 : 0.4),
          targetVec.z + currentDist
        );
        camera.lookAt(targetVec);
        break;
      }

      case "zoom": {
        // Zoom with subtle sway
        const currentDist = interpolate(
          progress,
          [0, 1],
          [effectiveDistance * 1.25, effectiveDistance * 0.98],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const swayX = Math.sin(frame * 0.015 * speed) * 0.6;
        camera.position.set(
          targetVec.x + swayX,
          targetVec.y + (aspectInfo.isPortrait ? 0.9 : 0.5),
          targetVec.z + currentDist
        );
        camera.lookAt(targetVec);
        break;
      }

      case "pan": {
        // Horizontal pan clamped to safe bounds
        const maxPan = adaptive.usableWorldWidth * 0.25;
        const panX = interpolate(progress, [0, 1], [-maxPan, maxPan], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        camera.position.set(
          targetVec.x + panX,
          targetVec.y + (aspectInfo.isPortrait ? 1.0 : 0.5),
          targetVec.z + effectiveDistance
        );
        camera.lookAt(new THREE.Vector3(targetVec.x + panX * 0.5, targetVec.y, targetVec.z));
        break;
      }

      case "focusCenter": {
        // Tight focus centered on core target
        const zDist = interpolate(
          progress,
          [0, 0.35, 1],
          [effectiveDistance * 1.15, effectiveDistance * 0.98, effectiveDistance * 0.98],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        camera.position.set(
          targetVec.x,
          targetVec.y + (aspectInfo.isPortrait ? 0.4 : 0.2),
          targetVec.z + zDist
        );
        camera.lookAt(targetVec);
        break;
      }

      case "wide": {
        camera.position.set(
          targetVec.x,
          targetVec.y + effectiveDistance * 0.4,
          targetVec.z + effectiveDistance * 1.3
        );
        camera.lookAt(targetVec);
        break;
      }

      case "overhead": {
        camera.position.set(
          targetVec.x,
          targetVec.y + effectiveDistance * 0.9,
          targetVec.z + effectiveDistance * 0.4
        );
        camera.lookAt(targetVec);
        break;
      }

      case "static":
      case "adaptiveFit":
      default: {
        if (customPosition) {
          camera.position.set(...customPosition);
        } else {
          camera.position.set(adaptive.position[0], adaptive.position[1], effectiveDistance);
        }
        camera.lookAt(targetVec);
        break;
      }
    }

    camera.updateProjectionMatrix();
  }, [
    camera,
    frame,
    vpWidth,
    vpHeight,
    durationInFrames,
    preset,
    customPosition,
    userTarget,
    baseDistance,
    fov,
    speed,
    contentBounds.width,
    contentBounds.height,
    contentBounds.depth,
    safeMargins,
    progressOverride,
  ]);

  return null;
};
