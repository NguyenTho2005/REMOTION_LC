export type AspectRatioMode = "portrait" | "landscape" | "square" | "fourFive";

export interface AspectRatioInfo {
  mode: AspectRatioMode;
  aspect: number;
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isSquare: boolean;
}

export interface FramingMargins {
  /** Top exclusion ratio [0, 0.4] */
  top?: number;
  /** Bottom exclusion ratio [0, 0.4] */
  bottom?: number;
  /** Left exclusion ratio [0, 0.3] */
  left?: number;
  /** Right exclusion ratio [0, 0.3] */
  right?: number;
}

export interface AdaptiveCameraResult {
  /** Recommended camera distance to comfortably frame the content */
  distance: number;
  /** Recommended camera position */
  position: [number, number, number];
  /** Recommended camera target */
  target: [number, number, number];
  /** Recommended object scale multiplier if distance remains fixed */
  scaleToFit: number;
  /** Information about the current aspect ratio */
  aspectInfo: AspectRatioInfo;
  /** Usable frustum dimensions in world units */
  usableWorldWidth: number;
  usableWorldHeight: number;
}

/**
 * Classifies viewport aspect ratio into standard video formats.
 */
export function getAspectRatioInfo(width: number, height: number): AspectRatioInfo {
  const aspect = width / Math.max(1, height);

  let mode: AspectRatioMode = "portrait";
  if (aspect >= 1.25) {
    mode = "landscape"; // 16:9 is 1.778
  } else if (aspect >= 0.95 && aspect <= 1.05) {
    mode = "square"; // 1:1 is 1.0
  } else if (aspect >= 0.75 && aspect < 0.95) {
    mode = "fourFive"; // 4:5 is 0.8
  } else {
    mode = "portrait"; // 9:16 is 0.5625
  }

  return {
    mode,
    aspect,
    width,
    height,
    isPortrait: aspect < 0.95,
    isLandscape: aspect >= 1.25,
    isSquare: aspect >= 0.95 && aspect <= 1.05,
  };
}

/**
 * Returns platform-aware default framing margin ratios.
 */
export function getDefaultMarginsForAspect(aspectInfo: AspectRatioInfo): Required<FramingMargins> {
  if (aspectInfo.isPortrait) {
    // 9:16 TikTok / Reels / Shorts: Top header (12%), Bottom captions & bar (18%), Sides (10%)
    return {
      top: 0.12,
      bottom: 0.18,
      left: 0.09,
      right: 0.12,
    };
  } else if (aspectInfo.isLandscape) {
    // 16:9 YouTube / Desktop: Top (8%), Bottom (12% for captions/controls), Sides (8%)
    return {
      top: 0.08,
      bottom: 0.12,
      left: 0.08,
      right: 0.08,
    };
  } else if (aspectInfo.isSquare) {
    // 1:1 Instagram Square: Balanced 10% all sides, 12% bottom
    return {
      top: 0.09,
      bottom: 0.14,
      left: 0.09,
      right: 0.09,
    };
  } else {
    // 4:5 Feed: Top 10%, Bottom 15%, Sides 9%
    return {
      top: 0.1,
      bottom: 0.15,
      left: 0.09,
      right: 0.09,
    };
  }
}

/**
 * Computes exact camera distance required to fit a 3D bounding box with specified safety margins.
 */
export function calculateCameraDistanceToFit(
  contentSize: { width: number; height: number; depth?: number },
  fovDegrees: number,
  aspect: number,
  margins?: FramingMargins
): number {
  const depth = contentSize.depth ?? 0;
  const vFovRad = (fovDegrees * Math.PI) / 180;
  const tanHalfVFov = Math.tan(vFovRad / 2);

  const mLeft = margins?.left ?? 0.08;
  const mRight = margins?.right ?? 0.08;
  const mTop = margins?.top ?? 0.1;
  const mBottom = margins?.bottom ?? 0.15;

  const usableWidthFraction = Math.max(0.1, 1 - (mLeft + mRight));
  const usableHeightFraction = Math.max(0.1, 1 - (mTop + mBottom));

  // Required distance along forward axis
  const halfContentW = contentSize.width / 2;
  const halfContentH = contentSize.height / 2;

  // W_usable = 2 * d * tan(fov/2) * aspect * usableWidthFraction
  const distForWidth = halfContentW / (tanHalfVFov * aspect * usableWidthFraction);
  // H_usable = 2 * d * tan(fov/2) * usableHeightFraction
  const distForHeight = halfContentH / (tanHalfVFov * usableHeightFraction);

  const baseDist = Math.max(distForWidth, distForHeight);
  return baseDist + depth / 2;
}

/**
 * Calculates adaptive camera parameters and scaling for any aspect ratio.
 */
export function getAdaptiveCameraParams(params: {
  contentWidth: number;
  contentHeight: number;
  contentDepth?: number;
  viewportWidth: number;
  viewportHeight: number;
  baseDistance?: number;
  baseFov?: number;
  targetOffset?: [number, number, number];
  customMargins?: FramingMargins;
}): AdaptiveCameraResult {
  const {
    contentWidth,
    contentHeight,
    contentDepth = 0,
    viewportWidth,
    viewportHeight,
    baseDistance = 9,
    baseFov = 45,
    targetOffset = [0, 0, 0],
    customMargins,
  } = params;

  const aspectInfo = getAspectRatioInfo(viewportWidth, viewportHeight);
  const margins = {
    ...getDefaultMarginsForAspect(aspectInfo),
    ...customMargins,
  };

  const vFovRad = (baseFov * Math.PI) / 180;
  const tanHalfVFov = Math.tan(vFovRad / 2);

  // Usable screen ratio
  const usableW = Math.max(0.1, 1 - (margins.left + margins.right));
  const usableH = Math.max(0.1, 1 - (margins.top + margins.bottom));

  // Required distance if scale is 1.0
  const idealDistance = calculateCameraDistanceToFit(
    { width: contentWidth, height: contentHeight, depth: contentDepth },
    baseFov,
    aspectInfo.aspect,
    margins
  );

  // If distance is kept at baseDistance, what scale fits?
  const visibleHAtBase = 2 * baseDistance * tanHalfVFov;
  const visibleWAtBase = visibleHAtBase * aspectInfo.aspect;

  const maxAllowedW = visibleWAtBase * usableW;
  const maxAllowedH = visibleHAtBase * usableH;

  const scaleForWidth = maxAllowedW / Math.max(0.001, contentWidth);
  const scaleForHeight = maxAllowedH / Math.max(0.001, contentHeight);
  const scaleToFit = Math.min(scaleForWidth, scaleForHeight, 1.2); // don't over-magnify

  // Vertical offset compensation for asymmetric top/bottom margins
  // In portrait, bottom margin is typically larger than top margin (for captions),
  // so content should be lifted upward slightly.
  const yShiftRatio = (margins.bottom - margins.top) / 2;
  const yShiftWorld = (2 * idealDistance * tanHalfVFov) * yShiftRatio;

  const target: [number, number, number] = [
    targetOffset[0],
    targetOffset[1] + (aspectInfo.isPortrait ? yShiftWorld * 0.5 : 0),
    targetOffset[2],
  ];

  const position: [number, number, number] = [
    target[0],
    target[1] + (aspectInfo.isLandscape ? 0.5 : 1.0),
    target[2] + idealDistance,
  ];

  return {
    distance: idealDistance,
    position,
    target,
    scaleToFit,
    aspectInfo,
    usableWorldWidth: (2 * idealDistance * tanHalfVFov * aspectInfo.aspect) * usableW,
    usableWorldHeight: (2 * idealDistance * tanHalfVFov) * usableH,
  };
}
