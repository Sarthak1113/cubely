import * as THREE from 'three';
import type { StandardMoveNotation } from '../engine/cubeMoves';
import type { Vector3Int } from '../engine/cubeState';

export interface FaceDragInput {
  hitNormal: THREE.Vector3; // in world coords (+X, -X, +Y, -Y, +Z, -Z)
  cubeletPos: Vector3Int;   // [x, y, z] in {-1, 0, 1}
  screenDelta: { x: number; y: number }; // pointer movement (dx, dy)
  camera: THREE.Camera;
  hitPoint: THREE.Vector3;
  domElement: HTMLElement;
}

/**
 * Determines the standard Rubik's cube move resulting from dragging across a cube face.
 */
export function determineFaceDragMove(input: FaceDragInput): StandardMoveNotation | null {
  const { hitNormal, cubeletPos, screenDelta, camera, hitPoint, domElement } = input;

  // Round world normal to nearest axis vector
  const nx = Math.round(hitNormal.x);
  const ny = Math.round(hitNormal.y);
  const nz = Math.round(hitNormal.z);

  // Identify two orthogonal tangent directions on this face
  let t1: THREE.Vector3;
  let t2: THREE.Vector3;

  if (Math.abs(nx) === 1) {
    // Face X: tangents are Y and Z
    t1 = new THREE.Vector3(0, 1, 0);
    t2 = new THREE.Vector3(0, 0, 1);
  } else if (Math.abs(ny) === 1) {
    // Face Y: tangents are X and Z
    t1 = new THREE.Vector3(1, 0, 0);
    t2 = new THREE.Vector3(0, 0, 1);
  } else if (Math.abs(nz) === 1) {
    // Face Z: tangents are X and Y
    t1 = new THREE.Vector3(1, 0, 0);
    t2 = new THREE.Vector3(0, 1, 0);
  } else {
    return null;
  }

  // Helper to project a 3D point to 2D screen coordinates in pixels
  const rect = domElement.getBoundingClientRect();
  const project = (p3d: THREE.Vector3): { x: number; y: number } => {
    const clone = p3d.clone().project(camera);
    return {
      x: ((clone.x + 1) / 2) * rect.width,
      y: ((-clone.y + 1) / 2) * rect.height,
    };
  };

  const p0 = project(hitPoint);
  const pt1 = project(hitPoint.clone().add(t1));
  const pt2 = project(hitPoint.clone().add(t2));

  const screenT1 = { x: pt1.x - p0.x, y: pt1.y - p0.y };
  const screenT2 = { x: pt2.x - p0.x, y: pt2.y - p0.y };

  const len1 = Math.hypot(screenT1.x, screenT1.y) || 1;
  const len2 = Math.hypot(screenT2.x, screenT2.y) || 1;

  const normT1 = { x: screenT1.x / len1, y: screenT1.y / len1 };
  const normT2 = { x: screenT2.x / len2, y: screenT2.y / len2 };

  // Dot products with user drag delta
  const dot1 = screenDelta.x * normT1.x + screenDelta.y * normT1.y;
  const dot2 = screenDelta.x * normT2.x + screenDelta.y * normT2.y;

  let dragTangent: THREE.Vector3;
  if (Math.abs(dot1) >= Math.abs(dot2)) {
    dragTangent = t1.clone().multiplyScalar(Math.sign(dot1));
  } else {
    dragTangent = t2.clone().multiplyScalar(Math.sign(dot2));
  }

  // Cross product: rotationAxis = hitNormal x dragTangent (right-hand torque/rotation)
  const normalVec = new THREE.Vector3(nx, ny, nz);
  const rotAxis = new THREE.Vector3().crossVectors(normalVec, dragTangent);

  const ax = Math.round(rotAxis.x);
  const ay = Math.round(rotAxis.y);
  const az = Math.round(rotAxis.z);

  const [cx, cy, cz] = cubeletPos;

  // Map rotation axis and layer to standard move notation
  if (Math.abs(ax) === 1) {
    // Rotation around X axis
    // ax === -1 corresponds to R, M', x
    // ax === 1 corresponds to R', L, M, x'
    if (cx === 1) {
      return ax === -1 ? 'R' : "R'";
    } else if (cx === -1) {
      return ax === 1 ? 'L' : "L'";
    } else {
      return ax === 1 ? 'M' : "M'";
    }
  } else if (Math.abs(ay) === 1) {
    // Rotation around Y axis
    // ay === -1 corresponds to U, D', E', y
    // ay === 1 corresponds to U', D, E, y'
    if (cy === 1) {
      return ay === -1 ? 'U' : "U'";
    } else if (cy === -1) {
      return ay === 1 ? 'D' : "D'";
    } else {
      return ay === 1 ? 'E' : "E'";
    }
  } else if (Math.abs(az) === 1) {
    // Rotation around Z axis
    // az === -1 corresponds to F, B', S, z
    // az === 1 corresponds to F', B, S', z'
    if (cz === 1) {
      return az === -1 ? 'F' : "F'";
    } else if (cz === -1) {
      return az === 1 ? 'B' : "B'";
    } else {
      return az === -1 ? 'S' : "S'";
    }
  }

  return null;
}
