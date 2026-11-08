import * as THREE from "three";

/**
 * Bounds of visible frustum cross-section at a specific distance from camera
 */
export interface VisibleFrustumBounds {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  distance: number;
  aspect: number;
}

/**
 * World-space bounding box with corners
 */
export interface WorldFrustumBox {
  center: THREE.Vector3;
  width: number;
  height: number;
  depth: number;
  topLeft: THREE.Vector3;
  topRight: THREE.Vector3;
  bottomLeft: THREE.Vector3;
  bottomRight: THREE.Vector3;
}

/**
 * Calculate visible world-space dimensions at a given distance in front of the camera.
 * Works seamlessly for both PerspectiveCamera and OrthographicCamera.
 *
 * @param camera - Three.js Camera instance
 * @param distance - Distance from camera along forward axis (defaults to 10 for perspective)
 * @param overrideAspect - Optional viewport aspect ratio override (width / height)
 */
export function getVisibleWorldBounds(
  camera: THREE.Camera,
  distance = 10,
  overrideAspect?: number
): VisibleFrustumBounds {
  let width = 0;
  let height = 0;
  let aspect = 1;

  if (camera instanceof THREE.PerspectiveCamera) {
    aspect = overrideAspect ?? camera.aspect;
    // vertical fov in radians
    const vFovRad = (camera.fov * Math.PI) / 180;
    // visible height at distance d = 2 * d * tan(fov / 2)
    height = 2 * Math.tan(vFovRad / 2) * Math.max(0.001, distance);
    width = height * aspect;
  } else if (camera instanceof THREE.OrthographicCamera) {
    const zoom = Math.max(0.0001, camera.zoom);
    width = (camera.right - camera.left) / zoom;
    height = (camera.top - camera.bottom) / zoom;
    aspect = overrideAspect ?? (height > 0 ? width / height : 1);
  } else {
    // Fallback generic calculation using projection matrix
    const elements = camera.projectionMatrix.elements;
    // elements[0] = 2 * near / (right - left), elements[5] = 2 * near / (top - bottom)
    const tanHalfH = elements[0] !== 0 ? 1 / elements[0] : 0.5;
    const tanHalfV = elements[5] !== 0 ? 1 / elements[5] : 0.5;
    width = 2 * distance * tanHalfH;
    height = 2 * distance * tanHalfV;
    aspect = overrideAspect ?? (height > 0 ? width / height : 1);
  }

  const halfW = width / 2;
  const halfH = height / 2;

  return {
    width,
    height,
    left: -halfW,
    right: halfW,
    top: halfH,
    bottom: -halfH,
    distance,
    aspect,
  };
}

/**
 * Get 3D world-space corner coordinates of the visible camera frame at distance D.
 */
export function getVisibleWorldCorners(
  camera: THREE.Camera,
  distance = 10,
  overrideAspect?: number
): WorldFrustumBox {
  const bounds = getVisibleWorldBounds(camera, distance, overrideAspect);
  camera.updateMatrixWorld();

  // Forward direction of camera in world coordinates
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

  const center = camera.position.clone().add(forward.clone().multiplyScalar(distance));

  const halfW = bounds.width / 2;
  const halfH = bounds.height / 2;

  const topLeft = center
    .clone()
    .sub(right.clone().multiplyScalar(halfW))
    .add(up.clone().multiplyScalar(halfH));

  const topRight = center
    .clone()
    .add(right.clone().multiplyScalar(halfW))
    .add(up.clone().multiplyScalar(halfH));

  const bottomLeft = center
    .clone()
    .sub(right.clone().multiplyScalar(halfW))
    .sub(up.clone().multiplyScalar(halfH));

  const bottomRight = center
    .clone()
    .add(right.clone().multiplyScalar(halfW))
    .sub(up.clone().multiplyScalar(halfH));

  return {
    center,
    width: bounds.width,
    height: bounds.height,
    depth: 0,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  };
}
