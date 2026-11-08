import * as THREE from "three";
import { worldToScreen, type ScreenCoord } from "./worldToScreen";

export interface ScreenBoundingBox {
  /** Pixel bounds (0,0 = top left) */
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;

  /** Normalized bounds [0, 1] */
  normalized: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  };

  /** Area in screen pixels */
  area: number;
  /** Coverage ratio of total viewport [0, 1] */
  viewportCoverage: number;

  /** Are all 8 corners in front of camera? */
  allInFront: boolean;
  /** Is at least one corner in front of camera? */
  anyInFront: boolean;
  /** Projected corner coords */
  corners: ScreenCoord[];
}

/**
 * Projects a 3D bounding box (Box3) to 2D screen coordinates.
 */
export function projectBoundingBox(
  box: THREE.Box3,
  camera: THREE.Camera,
  viewportWidth: number,
  viewportHeight: number
): ScreenBoundingBox {
  // 8 corners of the 3D Box
  const corners3D: THREE.Vector3[] = [
    new THREE.Vector3(box.min.x, box.min.y, box.min.z),
    new THREE.Vector3(box.min.x, box.min.y, box.max.z),
    new THREE.Vector3(box.min.x, box.max.y, box.min.z),
    new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    new THREE.Vector3(box.max.x, box.min.y, box.max.z),
    new THREE.Vector3(box.max.x, box.max.y, box.min.z),
    new THREE.Vector3(box.max.x, box.max.y, box.max.z),
  ];

  const corners2D: ScreenCoord[] = corners3D.map((p) =>
    worldToScreen(p, camera, viewportWidth, viewportHeight)
  );

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let anyInFront = false;
  let allInFront = true;

  for (const c of corners2D) {
    if (c.inFront) {
      anyInFront = true;
    } else {
      allInFront = false;
    }

    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }

  // If completely behind camera or empty box
  if (!anyInFront || !Number.isFinite(minX)) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
      normalized: {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        width: 0,
        height: 0,
        centerX: 0,
        centerY: 0,
      },
      area: 0,
      viewportCoverage: 0,
      allInFront: false,
      anyInFront: false,
      corners: corners2D,
    };
  }

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  const normMinX = minX / viewportWidth;
  const normMaxX = maxX / viewportWidth;
  const normMinY = minY / viewportHeight;
  const normMaxY = maxY / viewportHeight;
  const normWidth = width / viewportWidth;
  const normHeight = height / viewportHeight;

  const area = width * height;
  const viewportArea = viewportWidth * viewportHeight;
  const viewportCoverage = viewportArea > 0 ? area / viewportArea : 0;

  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    centerX,
    centerY,
    normalized: {
      minX: normMinX,
      maxX: normMaxX,
      minY: normMinY,
      maxY: normMaxY,
      width: normWidth,
      height: normHeight,
      centerX: centerX / viewportWidth,
      centerY: centerY / viewportHeight,
    },
    area,
    viewportCoverage,
    allInFront,
    anyInFront,
    corners: corners2D,
  };
}

/**
 * Convenience helper to compute and project the world-space bounding box of any Three.js Object3D.
 */
export function projectObject3D(
  object: THREE.Object3D,
  camera: THREE.Camera,
  viewportWidth: number,
  viewportHeight: number
): ScreenBoundingBox {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  return projectBoundingBox(box, camera, viewportWidth, viewportHeight);
}
