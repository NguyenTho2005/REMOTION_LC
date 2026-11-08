import * as THREE from "three";

export interface ScreenCoord {
  /** Screen pixel X coordinate (0 = left, viewportWidth = right) */
  x: number;
  /** Screen pixel Y coordinate (0 = top, viewportHeight = bottom) */
  y: number;
  /** Normalized coordinate U (0 = left, 1 = right) */
  u: number;
  /** Normalized coordinate V (0 = top, 1 = bottom) */
  v: number;
  /** Normalized Device Coordinate X (-1 to 1) */
  ndcX: number;
  /** Normalized Device Coordinate Y (-1 to 1) */
  ndcY: number;
  /** Normalized Device Coordinate Z (-1 to 1) */
  ndcZ: number;
  /** Whether the point is located in front of the camera near plane */
  inFront: boolean;
  /** Whether the projected pixel is inside the visible screen [0, w] x [0, h] */
  isInsideViewport: boolean;
}

/**
 * Projects a 3D world coordinate to 2D screen pixel and normalized coordinates.
 *
 * @param worldPoint - Vector3 or [x, y, z] coordinate
 * @param camera - Active Three.js camera
 * @param viewportWidth - Render width in pixels (e.g. 1080)
 * @param viewportHeight - Render height in pixels (e.g. 1920)
 */
export function worldToScreen(
  worldPoint: THREE.Vector3 | [number, number, number],
  camera: THREE.Camera,
  viewportWidth: number,
  viewportHeight: number
): ScreenCoord {
  const v =
    worldPoint instanceof THREE.Vector3
      ? worldPoint.clone()
      : new THREE.Vector3(worldPoint[0], worldPoint[1], worldPoint[2]);

  // Ensure camera matrices are fully synchronized
  camera.updateMatrixWorld();
  if ("updateProjectionMatrix" in camera && typeof (camera as THREE.PerspectiveCamera).updateProjectionMatrix === "function") {
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }

  // Project from world space to NDC coordinates
  v.project(camera);

  // In Three.js, z < 1 means in front of far plane. If camera is perspective,
  // we check if the point was behind the camera plane before projection.
  const inFront = v.z < 1.0 && v.z >= -1.0;

  // Screen pixel coordinates (0, 0 is top-left)
  const u = (v.x + 1) / 2;
  const vNorm = (1 - v.y) / 2;
  const x = u * viewportWidth;
  const y = vNorm * viewportHeight;

  const isInsideViewport = inFront && u >= 0 && u <= 1 && vNorm >= 0 && vNorm <= 1;

  return {
    x,
    y,
    u,
    v: vNorm,
    ndcX: v.x,
    ndcY: v.y,
    ndcZ: v.z,
    inFront,
    isInsideViewport,
  };
}
