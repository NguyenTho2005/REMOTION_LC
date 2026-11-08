import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { Scene3DConfig, QualityPreset } from "./types";
import { QUALITY_CONFIGS, LIGHTING_RIGS } from "./constants";
import { CameraController } from "../animations/CameraController";
import { getSafeAreaForAspectRatio } from "../../3d/utils/validateScreenBounds";
import { getAspectRatioInfo } from "../../3d/utils/fitObjectToCamera";

export interface ThreeCanvasContainerProps {
  config: Scene3DConfig;
  children: React.ReactNode;
  quality?: QualityPreset;
}

export const ThreeCanvasContainer: React.FC<ThreeCanvasContainerProps> = ({
  config,
  children,
  quality: overrideQuality,
}) => {
  const { width, height } = useVideoConfig();

  const qualityPreset = overrideQuality ?? config.quality ?? "standard";
  const quality = QUALITY_CONFIGS[qualityPreset];

  const lightingPreset = config.lighting?.preset ?? "studio";
  const rig = LIGHTING_RIGS[lightingPreset];

  const cameraDistance = config.camera?.distance ?? 8;
  const cameraFov = config.camera?.fov ?? 45;

  const safeZone = getSafeAreaForAspectRatio(width, height);
  const aspectInfo = getAspectRatioInfo(width, height);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: config.background ?? "#0B0F19",
        overflow: "hidden",
        width,
        height,
      }}
    >
      {/* Remotion ThreeCanvas (Frame-driven 3D rendering) */}
      <ThreeCanvas
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        dpr={quality.dpr}
        camera={{
          fov: cameraFov,
          position: config.camera?.position ?? [0, 1.5, cameraDistance],
          near: 0.1,
          far: 1000,
        }}
        shadows={quality.shadows}
      >
        {/* Frame-accurate Camera Controller */}
        <CameraController config={config.camera} />

        {/* Lighting Rig */}
        <ambientLight
          color={rig.ambient.color}
          intensity={(config.lighting?.ambientIntensity ?? 1) * rig.ambient.intensity}
        />
        <directionalLight
          position={rig.main.position}
          color={rig.main.color}
          intensity={(config.lighting?.mainLightIntensity ?? 1) * rig.main.intensity}
          castShadow={quality.shadows}
        />
        {rig.fill && (
          <directionalLight
            position={rig.fill.position}
            color={rig.fill.color}
            intensity={rig.fill.intensity}
          />
        )}
        {rig.rim && (
          <pointLight
            position={rig.rim.position}
            color={rig.rim.color}
            intensity={rig.rim.intensity}
          />
        )}

        {/* 3D Scene Contents */}
        {children}
      </ThreeCanvas>

      {/* 2D Safe-Area Screen Overlays */}
      {config.captionOverlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: safeZone.minY,
            paddingBottom: height - safeZone.maxY,
            paddingLeft: safeZone.minX,
            paddingRight: width - safeZone.maxX,
            boxSizing: "border-box",
            zIndex: 10,
          }}
        >
          {/* Top Badge */}
          {config.captionOverlay.badge && (
            <div
              style={{
                alignSelf: aspectInfo.isLandscape ? "center" : "flex-start",
                padding: "8px 20px",
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                border: "1.5px solid rgba(56, 189, 248, 0.4)",
                borderRadius: 9999,
                color: "#38BDF8",
                fontSize: aspectInfo.isLandscape ? 18 : 22,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              {config.captionOverlay.badge}
            </div>
          )}

          {/* Bottom Title & Subtitle */}
          {(config.captionOverlay.title || config.captionOverlay.subtitle) && (
            <div
              style={{
                backgroundColor: "rgba(11, 15, 25, 0.88)",
                backdropFilter: "blur(16px)",
                borderRadius: 24,
                border: "2px solid rgba(56, 189, 248, 0.3)",
                padding: aspectInfo.isLandscape ? "16px 28px" : "24px 32px",
                textAlign: "center",
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                maxWidth: aspectInfo.isLandscape ? 850 : "100%",
                width: aspectInfo.isLandscape ? "auto" : "100%",
              }}
            >
              {config.captionOverlay.title && (
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    lineHeight: 1.25,
                  }}
                >
                  {config.captionOverlay.title}
                </div>
              )}
              {config.captionOverlay.subtitle && (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#94A3B8",
                    marginTop: 8,
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  {config.captionOverlay.subtitle}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
