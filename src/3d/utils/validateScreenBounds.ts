import type { ScreenBoundingBox } from "./projectBoundingBox";
import { getAspectRatioInfo, getDefaultMarginsForAspect, type FramingMargins } from "./fitObjectToCamera";

export interface SafeScreenZone {
  /** Screen pixel coordinates of safe region */
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;

  /** Normalized coordinates [0, 1] */
  minU: number;
  maxU: number;
  minV: number;
  maxV: number;

  viewportWidth: number;
  viewportHeight: number;
}

export interface FramingValidationResult {
  isValid: boolean;
  isInsideSafeZone: boolean;
  status:
    | "ok"
    | "overflow_left"
    | "overflow_right"
    | "overflow_top"
    | "overflow_bottom"
    | "behind_camera"
    | "empty";
  overflowPx: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    total: number;
  };
  coverageRatio: number;
  fillRatio: number; // area of object divided by safe area
  isEmpty: boolean;
  isCrowded: boolean;
  diagnosis: string;
}

/**
 * Calculates platform-aware safe bounding box in screen pixels for any resolution and aspect ratio.
 */
export function getSafeAreaForAspectRatio(
  viewportWidth: number,
  viewportHeight: number,
  customMargins?: FramingMargins
): SafeScreenZone {
  const aspectInfo = getAspectRatioInfo(viewportWidth, viewportHeight);
  const defaultMargins = getDefaultMarginsForAspect(aspectInfo);

  const mTop = customMargins?.top ?? defaultMargins.top;
  const mBottom = customMargins?.bottom ?? defaultMargins.bottom;
  const mLeft = customMargins?.left ?? defaultMargins.left;
  const mRight = customMargins?.right ?? defaultMargins.right;

  const minX = Math.round(viewportWidth * mLeft);
  const maxX = Math.round(viewportWidth * (1 - mRight));
  const minY = Math.round(viewportHeight * mTop);
  const maxY = Math.round(viewportHeight * (1 - mBottom));

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
    minU: mLeft,
    maxU: 1 - mRight,
    minV: mTop,
    maxV: 1 - mBottom,
    viewportWidth,
    viewportHeight,
  };
}

/**
 * Validates whether a projected 2D screen bounding box fits within the safe area.
 * Detects overflows, clipped edges, and empty space.
 */
export function validateScreenBounds(
  screenBox: ScreenBoundingBox,
  safeZone: SafeScreenZone,
  options?: {
    minCoverage?: number;
    maxCoverage?: number;
    tolerancePx?: number;
  }
): FramingValidationResult {
  const tolerance = options?.tolerancePx ?? 2; // 2px margin of error for subpixel rasterization
  const minCoverage = options?.minCoverage ?? 0.015; // At least 1.5% of screen covered
  const maxCoverage = options?.maxCoverage ?? 0.85;

  if (!screenBox.anyInFront) {
    return {
      isValid: false,
      isInsideSafeZone: false,
      status: "behind_camera",
      overflowPx: { left: 0, right: 0, top: 0, bottom: 0, total: 0 },
      coverageRatio: 0,
      fillRatio: 0,
      isEmpty: true,
      isCrowded: false,
      diagnosis: "Critical: Object is completely behind the camera or offscreen.",
    };
  }

  const overflowLeft = Math.max(0, safeZone.minX - screenBox.minX - tolerance);
  const overflowRight = Math.max(0, screenBox.maxX - safeZone.maxX - tolerance);
  const overflowTop = Math.max(0, safeZone.minY - screenBox.minY - tolerance);
  const overflowBottom = Math.max(0, screenBox.maxY - safeZone.maxY - tolerance);
  const totalOverflow = overflowLeft + overflowRight + overflowTop + overflowBottom;

  const isInsideSafeZone = totalOverflow === 0;

  const safeAreaPixels = safeZone.width * safeZone.height;
  const fillRatio = safeAreaPixels > 0 ? screenBox.area / safeAreaPixels : 0;
  const isEmpty = screenBox.viewportCoverage < minCoverage;
  const isCrowded = screenBox.viewportCoverage > maxCoverage;

  let status: FramingValidationResult["status"] = "ok";
  let diagnosis = "Framing optimal: Object safely contained within bounds.";

  if (overflowLeft > 0) {
    status = "overflow_left";
    diagnosis = `Overflow error: Object clipped on the LEFT edge by ${Math.round(overflowLeft)}px.`;
  } else if (overflowRight > 0) {
    status = "overflow_right";
    diagnosis = `Overflow error: Object clipped on the RIGHT edge by ${Math.round(overflowRight)}px.`;
  } else if (overflowTop > 0) {
    status = "overflow_top";
    diagnosis = `Overflow error: Object clipped on the TOP edge by ${Math.round(overflowTop)}px.`;
  } else if (overflowBottom > 0) {
    status = "overflow_bottom";
    diagnosis = `Overflow error: Object clipped on the BOTTOM edge by ${Math.round(overflowBottom)}px.`;
  } else if (isEmpty) {
    status = "empty";
    diagnosis = `Empty scene warning: Content covers only ${(screenBox.viewportCoverage * 100).toFixed(1)}% of viewport.`;
  }

  const isValid = isInsideSafeZone && !isEmpty;

  return {
    isValid,
    isInsideSafeZone,
    status,
    overflowPx: {
      left: overflowLeft,
      right: overflowRight,
      top: overflowTop,
      bottom: overflowBottom,
      total: totalOverflow,
    },
    coverageRatio: screenBox.viewportCoverage,
    fillRatio,
    isEmpty,
    isCrowded,
    diagnosis,
  };
}
