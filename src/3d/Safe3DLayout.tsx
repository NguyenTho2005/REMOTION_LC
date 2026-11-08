import React, { createContext, useContext, useMemo } from "react";
import { useVideoConfig } from "remotion";
import {
  getAspectRatioInfo,
  type AspectRatioInfo,
  type FramingMargins,
} from "./utils/fitObjectToCamera";
import { getSafeAreaForAspectRatio, type SafeScreenZone } from "./utils/validateScreenBounds";

export interface ResponsiveLayoutContextValue {
  aspectInfo: AspectRatioInfo;
  safeZone: SafeScreenZone;
  isPortrait: boolean;
  isLandscape: boolean;
  isSquare: boolean;
  /** Scale factor to safely fit content within current aspect ratio */
  contentScale: number;
  /** Suggested spacing multiplier between 3D elements */
  spacingMultiplier: number;
  /** Position offset for primary 3D subject */
  primaryOffset: [number, number, number];
  /** Position offset for secondary/comparison 3D subject */
  secondaryOffset: [number, number, number];
}

const ResponsiveLayoutContext = createContext<ResponsiveLayoutContextValue | null>(null);

export function useResponsiveLayout(): ResponsiveLayoutContextValue {
  const ctx = useContext(ResponsiveLayoutContext);
  if (!ctx) {
    throw new Error("useResponsiveLayout must be used within a Safe3DLayout provider");
  }
  return ctx;
}

export interface Safe3DLayoutProps {
  children: React.ReactNode;
  /** Custom safe margins if needed */
  customMargins?: FramingMargins;
  /** Content width baseline (at 16:9) */
  baselineWidth?: number;
  /** Content height baseline */
  baselineHeight?: number;
}

/**
 * Root Responsive 3D Layout Provider.
 * Derives aspect-ratio aware layout rules for 9:16, 16:9, 1:1, and 4:5.
 */
export const Safe3DLayout: React.FC<Safe3DLayoutProps> = ({
  children,
  customMargins,
  baselineWidth = 6.0,
  baselineHeight = 4.0,
}) => {
  const { width, height } = useVideoConfig();

  const contextValue = useMemo<ResponsiveLayoutContextValue>(() => {
    const aspectInfo = getAspectRatioInfo(width, height);
    const safeZone = getSafeAreaForAspectRatio(width, height, customMargins);

    let contentScale = 1.0;
    let spacingMultiplier = 1.0;
    let primaryOffset: [number, number, number] = [0, 0, 0];
    let secondaryOffset: [number, number, number] = [0, -2.0, 0];

    // Reference baseline scale adjustment
    const baselineRatioW = baselineWidth > 0 ? 6.0 / baselineWidth : 1.0;
    const baselineRatioH = baselineHeight > 0 ? 4.0 / baselineHeight : 1.0;
    const baselineRatio = Math.min(baselineRatioW, baselineRatioH);

    if (aspectInfo.isPortrait) {
      // 9:16 Portrait: narrow width, tall height.
      // Scale down wide horizontal boards to prevent clipping.
      contentScale = Math.min(1.0, (safeZone.width / (width * 0.75)) * 0.85 * baselineRatio);
      spacingMultiplier = 0.85; // compact spacing
      // Center and lift upward to clear bottom captions
      primaryOffset = [0, 0.4, 0];
      secondaryOffset = [0, -1.8, 0]; // stacked vertically
    } else if (aspectInfo.isLandscape) {
      // 16:9 Landscape: wide width, limited height.
      // Objects can spread out side-by-side.
      contentScale = 1.1 * baselineRatio;
      spacingMultiplier = 1.25;
      primaryOffset = [-2.2, 0, 0]; // side-by-side left
      secondaryOffset = [2.2, 0, 0]; // side-by-side right
    } else {
      // 1:1 or 4:5 Square/Feed: balanced
      contentScale = 0.95 * baselineRatio;
      spacingMultiplier = 1.0;
      primaryOffset = [0, 0.2, 0];
      secondaryOffset = [0, -1.6, 0];
    }

    return {
      aspectInfo,
      safeZone,
      isPortrait: aspectInfo.isPortrait,
      isLandscape: aspectInfo.isLandscape,
      isSquare: aspectInfo.isSquare,
      contentScale,
      spacingMultiplier,
      primaryOffset,
      secondaryOffset,
    };
  }, [width, height, customMargins, baselineWidth, baselineHeight]);

  return (
    <ResponsiveLayoutContext.Provider value={contextValue}>
      {children}
    </ResponsiveLayoutContext.Provider>
  );
};

export interface Safe3DGroupProps {
  children: React.ReactNode;
  slot?: "primary" | "secondary" | "center" | "custom";
  customOffset?: [number, number, number];
  scaleOverride?: number;
}

/**
 * 3D Group wrapper placed inside ThreeCanvas that automatically adapts
 * position and scale to the current layout context.
 */
export const Safe3DGroup: React.FC<Safe3DGroupProps> = ({
  children,
  slot = "center",
  customOffset,
  scaleOverride,
}) => {
  const layout = useContext(ResponsiveLayoutContext);

  let pos: [number, number, number] = [0, 0, 0];
  let scale = 1.0;

  if (layout) {
    scale = scaleOverride ?? layout.contentScale;
    if (customOffset) {
      pos = customOffset;
    } else if (slot === "primary") {
      pos = layout.primaryOffset;
    } else if (slot === "secondary") {
      pos = layout.secondaryOffset;
    } else {
      // Center slot
      pos = [0, layout.isPortrait ? 0.3 : 0, 0];
    }
  }

  return (
    <group position={pos} scale={[scale, scale, scale]}>
      {children}
    </group>
  );
};

export interface Safe2DOverlayProps {
  topHeader?: React.ReactNode;
  bottomFooter?: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * 2D Safe-Area Screen Overlay rendered outside ThreeCanvas.
 * Automatically aligns headlines, captions, and formulas to the platform safe zones.
 */
export const Safe2DOverlay: React.FC<Safe2DOverlayProps> = ({
  topHeader,
  bottomFooter,
  leftPanel,
  rightPanel,
  children,
  style,
}) => {
  const { width, height } = useVideoConfig();
  const safeZone = useMemo(() => getSafeAreaForAspectRatio(width, height), [width, height]);
  const aspectInfo = useMemo(() => getAspectRatioInfo(width, height), [width, height]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 50,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Top Header Region (Headlines, badges, breadcrumbs) */}
      {topHeader && (
        <div
          style={{
            position: "absolute",
            top: safeZone.minY,
            left: safeZone.minX,
            width: safeZone.width,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {topHeader}
        </div>
      )}

      {/* Landscape Left Panel (e.g. code/formulas in 16:9) */}
      {aspectInfo.isLandscape && leftPanel && (
        <div
          style={{
            position: "absolute",
            top: safeZone.minY + 80,
            left: safeZone.minX,
            width: safeZone.width * 0.35,
            bottom: safeZone.viewportHeight - safeZone.maxY + 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {leftPanel}
        </div>
      )}

      {/* Landscape Right Panel */}
      {aspectInfo.isLandscape && rightPanel && (
        <div
          style={{
            position: "absolute",
            top: safeZone.minY + 80,
            right: safeZone.viewportWidth - safeZone.maxX,
            width: safeZone.width * 0.35,
            bottom: safeZone.viewportHeight - safeZone.maxY + 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {rightPanel}
        </div>
      )}

      {/* Bottom Footer Region (Captions, subtitles, CTA) */}
      {bottomFooter && (
        <div
          style={{
            position: "absolute",
            bottom: safeZone.viewportHeight - safeZone.maxY,
            left: safeZone.minX,
            width: safeZone.width,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {bottomFooter}
        </div>
      )}

      {/* Freeform children positioned within safe bounds */}
      {children}
    </div>
  );
};
