import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { determineFaceDragMove } from '../utils/gestureMath';

describe('gestureMath - determineFaceDragMove', () => {
  // Setup a standard camera looking at the front face (+Z) from (0, 0, 5)
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const mockDomElement = {
    getBoundingClientRect: () => ({
      width: 800,
      height: 800,
      top: 0,
      left: 0,
      right: 800,
      bottom: 800,
    }),
  } as unknown as HTMLElement;

  it('Front Face (Z=1): dragging LEFT on top layer (Y=1) turns top layer left (U)', () => {
    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 0, 1),
      cubeletPos: [0, 1, 1],
      screenDelta: { x: -40, y: 0 }, // drag left
      camera,
      hitPoint: new THREE.Vector3(0, 1, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe('U');
  });

  it('Front Face (Z=1): dragging RIGHT on top layer (Y=1) turns top layer right (U\')', () => {
    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 0, 1),
      cubeletPos: [0, 1, 1],
      screenDelta: { x: 40, y: 0 }, // drag right
      camera,
      hitPoint: new THREE.Vector3(0, 1, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe("U'");
  });

  it('Front Face (Z=1): dragging UP on right column (X=1) turns right column up (R)', () => {
    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 0, 1),
      cubeletPos: [1, 0, 1],
      screenDelta: { x: 0, y: -40 }, // drag up on screen (dy < 0)
      camera,
      hitPoint: new THREE.Vector3(1, 0, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe('R');
  });

  it('Front Face (Z=1): dragging DOWN on right column (X=1) turns right column down (R\')', () => {
    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 0, 1),
      cubeletPos: [1, 0, 1],
      screenDelta: { x: 0, y: 40 }, // drag down on screen (dy > 0)
      camera,
      hitPoint: new THREE.Vector3(1, 0, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe("R'");
  });

  it('Front Face (Z=1): dragging UP on left column (X=-1) turns left column up (L\')', () => {
    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 0, 1),
      cubeletPos: [-1, 0, 1],
      screenDelta: { x: 0, y: -40 }, // drag up
      camera,
      hitPoint: new THREE.Vector3(-1, 0, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe("L'");
  });

  it('Front Face (Z=1): dragging DOWN on left column (X=-1) turns left column down (L)', () => {
    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 0, 1),
      cubeletPos: [-1, 0, 1],
      screenDelta: { x: 0, y: 40 }, // drag down
      camera,
      hitPoint: new THREE.Vector3(-1, 0, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe('L');
  });

  it('Top Face (Y=1): camera above, dragging LEFT on front slice (Z=1) turns front face left (F\')', () => {
    const topCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    topCamera.position.set(0, 6, 2);
    topCamera.lookAt(0, 0, 0);
    topCamera.updateMatrixWorld();

    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 1, 0),
      cubeletPos: [0, 1, 1],
      screenDelta: { x: -40, y: 0 }, // drag left
      camera: topCamera,
      hitPoint: new THREE.Vector3(0, 1, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe("F'");
  });

  it('Top Face (Y=1): camera above, dragging RIGHT on front slice (Z=1) turns front face right (F)', () => {
    const topCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    topCamera.position.set(0, 6, 2);
    topCamera.lookAt(0, 0, 0);
    topCamera.updateMatrixWorld();

    const move = determineFaceDragMove({
      hitNormal: new THREE.Vector3(0, 1, 0),
      cubeletPos: [0, 1, 1],
      screenDelta: { x: 40, y: 0 }, // drag right
      camera: topCamera,
      hitPoint: new THREE.Vector3(0, 1, 1),
      domElement: mockDomElement,
    });
    expect(move).toBe('F');
  });
});
