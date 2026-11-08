import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import * as THREE from "three";
import { getAspectRatioInfo } from "../../../3d/utils/fitObjectToCamera";

export interface CameraRigProps {
  preset?: "default" | "orbit" | "dollyIn" | "panSlow" | "focusCenter" | "wide" | "overhead";
  customPos?: [number, number, number];
  customTarget?: [number, number, number];
  speed?: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  preset = "default",
  customPos,
  customTarget,
  speed = 1.0,
}) => {
  const { camera } = useThree();
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  useLayoutEffect(() => {
    const aspectInfo = getAspectRatioInfo(width, height);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = aspectInfo.aspect;
    }

    // Adaptive distance multiplier: in portrait (9:16), distance scales up so content never overflows
    const distScale = aspectInfo.isPortrait ? 1.15 : 1.0;
    const progress = Math.min(1, Math.max(0, frame / (durationInFrames || 1)));
    const targetYOffset = aspectInfo.isPortrait ? 0.2 : 0;
    const target = new THREE.Vector3(
      customTarget ? customTarget[0] : 0,
      (customTarget ? customTarget[1] : 0) + targetYOffset,
      customTarget ? customTarget[2] : 0
    );

    if (customPos) {
      camera.position.set(customPos[0], customPos[1] + targetYOffset, customPos[2] * distScale);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      return;
    }

    switch (preset) {
      case "orbit": {
        // Orbit slightly around Y axis
        const angle = -0.3 + frame * 0.008 * speed;
        const distance = 11.2 * distScale;
        camera.position.x = Math.sin(angle) * distance;
        camera.position.z = Math.cos(angle) * distance;
        camera.position.y = 1.8 + Math.sin(frame * 0.01) * 0.3;
        camera.lookAt(target);
        break;
      }

      case "dollyIn": {
        // Smooth push-in with safe clamp (never pushes inside clipping zone)
        const dist = interpolate(progress, [0, 1], [13.2 * distScale, 11.2 * distScale], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        camera.position.set(0, 0.8, dist);
        camera.lookAt(target);
        break;
      }

      case "panSlow": {
        // Slow horizontal pan within safe bounds
        const maxPan = aspectInfo.isPortrait ? 1.0 : 2.0;
        const xPos = interpolate(progress, [0, 1], [-maxPan, maxPan], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        camera.position.set(xPos, 1.0, 11.5 * distScale);
        camera.lookAt(target);
        break;
      }

      case "focusCenter": {
        // Tight focus centered on target with safe distance
        const zDist = interpolate(
          progress,
          [0, 0.3, 1],
          [11.8 * distScale, 10.6 * distScale, 10.5 * distScale],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        camera.position.set(0, 0.4, zDist);
        camera.lookAt(target);
        break;
      }

      case "wide": {
        // Wide overview
        camera.position.set(0, 4.0, 14.8 * distScale);
        camera.lookAt(0, -0.5, 0);
        break;
      }

      case "overhead": {
        // Top-down angled matrix view
        camera.position.set(0, 9.2 * distScale, 9.2 * distScale);
        camera.lookAt(0, 0, 0);
        break;
      }

      case "default":
      default: {
        // Very subtle cinematic drift
        const subtleY = 0.8 + Math.sin(frame * 0.02) * 0.08;
        const subtleZ = (11.5 - Math.cos(frame * 0.015) * 0.15) * distScale;
        camera.position.set(0, subtleY, subtleZ);
        camera.lookAt(target);
        break;
      }
    }

    camera.updateProjectionMatrix();
  }, [camera, frame, width, height, durationInFrames, preset, customPos, customTarget, speed]);

  return null;
};
