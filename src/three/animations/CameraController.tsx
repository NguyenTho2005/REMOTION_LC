import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import * as THREE from "three";
import type { CameraConfig } from "../core/types";
import { getAspectRatioInfo } from "../../3d/utils/fitObjectToCamera";

export interface CameraControllerProps {
  config?: CameraConfig;
}

export const CameraController: React.FC<CameraControllerProps> = ({ config }) => {
  const { camera } = useThree();
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const preset = config?.preset ?? "orbit";
  const baseDistance = config?.distance ?? 8;
  const speed = config?.speed ?? 1;

  useLayoutEffect(() => {
    const aspectInfo = getAspectRatioInfo(width, height);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = aspectInfo.aspect;
    }

    // Adaptive distance multiplier: widen distance in portrait (9:16) to prevent lateral clipping
    const aspectDistanceMultiplier = aspectInfo.isPortrait
      ? Math.max(1.0, 1.778 / (aspectInfo.aspect * 2.0)) // ~1.58x distance in 9:16
      : 1.0;

    const distance = baseDistance * aspectDistanceMultiplier;
    const progress = Math.min(1, Math.max(0, frame / (durationInFrames || 1)));

    // Target position with portrait Y compensation to clear bottom captions
    const baseTarget = config?.target ?? [0, 0, 0];
    const targetYOffset = aspectInfo.isPortrait ? 0.35 : 0;
    const target = new THREE.Vector3(baseTarget[0], baseTarget[1] + targetYOffset, baseTarget[2]);

    switch (preset) {
      case "orbit": {
        // Orbit around Y axis at radius = distance
        const angle = frame * 0.015 * speed;
        camera.position.x = target.x + Math.sin(angle) * distance;
        camera.position.z = target.z + Math.cos(angle) * distance;
        camera.position.y = target.y + (aspectInfo.isPortrait ? 2.0 : 1.5) + Math.sin(frame * 0.01) * 0.4;
        camera.lookAt(target);
        break;
      }

      case "dolly": {
        // Safe dolly zoom: distance moves from 1.35x down to 0.95x of safe distance without clipping
        const currentDist = interpolate(progress, [0, 1], [distance * 1.35, distance * 0.95], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        camera.position.set(target.x, target.y + (aspectInfo.isPortrait ? 1.2 : 0.8), target.z + currentDist);
        camera.lookAt(target);
        break;
      }

      case "zoom": {
        // Change FOV or zoom in with safe bounds
        const currentDist = interpolate(progress, [0, 1], [distance * 1.25, distance * 0.95], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        camera.position.set(
          target.x + Math.sin(frame * 0.005) * 1.0,
          target.y + (aspectInfo.isPortrait ? 1.4 : 1.0),
          target.z + currentDist
        );
        camera.lookAt(target);
        break;
      }

      case "flyThrough": {
        // Fly through scene along Z
        const zPos = interpolate(progress, [0, 1], [distance * 1.4, -distance * 0.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const xPos = Math.sin(progress * Math.PI) * 1.5;
        camera.position.set(xPos, target.y + (aspectInfo.isPortrait ? 1.0 : 0.8), zPos);
        camera.lookAt(new THREE.Vector3(0, target.y, zPos - 5));
        break;
      }

      case "topDown": {
        camera.position.set(target.x, distance * 1.2, target.z + 0.001);
        camera.lookAt(target);
        break;
      }

      case "isometric": {
        const iso = distance * 0.75;
        camera.position.set(target.x + iso, target.y + iso * 0.8, target.z + iso);
        camera.lookAt(target);
        break;
      }

      case "static":
      default: {
        if (config?.position) {
          camera.position.set(
            config.position[0],
            config.position[1] + targetYOffset,
            config.position[2] * aspectDistanceMultiplier
          );
        } else {
          camera.position.set(target.x, target.y + (aspectInfo.isPortrait ? 1.2 : 0.8), target.z + distance);
        }
        camera.lookAt(target);
        break;
      }
    }

    camera.updateProjectionMatrix();
  }, [camera, frame, width, height, durationInFrames, preset, baseDistance, speed, config?.position, config?.target]);

  return null;
};
