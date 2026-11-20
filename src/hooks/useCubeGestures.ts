import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { type ThreeEvent, useThree } from '@react-three/fiber';
import type { CubeletState } from '../engine/cubeState';
import { determineFaceDragMove } from '../utils/gestureMath';
import { useCubeStore } from '../store/cubeStore';

export interface GestureControls {
  onStickerPointerDown: (
    e: ThreeEvent<PointerEvent>,
    cubelet: CubeletState,
    worldNormal: THREE.Vector3
  ) => void;
  onPointerMove: (e: ThreeEvent<PointerEvent>) => void;
  onPointerUp: () => void;
  isDraggingFace: () => boolean;
}

export function useCubeGestures(
  setOrbitEnabled: (enabled: boolean) => void
): GestureControls {
  const { camera, gl } = useThree();
  const enqueueMove = useCubeStore((s) => s.enqueueMove);
  const isAnimating = useCubeStore((s) => s.isAnimating);

  const dragStartRef = useRef<{
    screenX: number;
    screenY: number;
    cubelet: CubeletState;
    worldNormal: THREE.Vector3;
    hitPoint: THREE.Vector3;
    active: boolean;
  } | null>(null);

  const onStickerPointerDown = useCallback(
    (
      e: ThreeEvent<PointerEvent>,
      cubelet: CubeletState,
      worldNormal: THREE.Vector3
    ) => {
      // Don't start a gesture if already animating
      if (isAnimating) return;

      e.stopPropagation();
      setOrbitEnabled(false);

      dragStartRef.current = {
        screenX: e.clientX,
        screenY: e.clientY,
        cubelet,
        worldNormal,
        hitPoint: e.point.clone(),
        active: true,
      };
    },
    [isAnimating, setOrbitEnabled]
  );

  const onPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const start = dragStartRef.current;
      if (!start || !start.active) return;

      const dx = e.clientX - start.screenX;
      const dy = e.clientY - start.screenY;
      const dist = Math.hypot(dx, dy);

      // Threshold in screen pixels to trigger face turn
      if (dist >= 14) {
        const move = determineFaceDragMove({
          hitNormal: start.worldNormal,
          cubeletPos: start.cubelet.position,
          screenDelta: { x: dx, y: dy },
          camera,
          hitPoint: start.hitPoint,
          domElement: gl.domElement,
        });

        if (move) {
          enqueueMove(move);
        }

        // Deactivate drag so only 1 turn occurs per drag gesture
        start.active = false;
        dragStartRef.current = null;
        setOrbitEnabled(true);
      }
    },
    [camera, gl.domElement, enqueueMove, setOrbitEnabled]
  );

  const onPointerUp = useCallback(() => {
    if (dragStartRef.current) {
      dragStartRef.current.active = false;
      dragStartRef.current = null;
    }
    setOrbitEnabled(true);
  }, [setOrbitEnabled]);

  const isDraggingFace = useCallback(() => {
    return dragStartRef.current !== null && dragStartRef.current.active;
  }, []);

  return {
    onStickerPointerDown,
    onPointerMove,
    onPointerUp,
    isDraggingFace,
  };
}
