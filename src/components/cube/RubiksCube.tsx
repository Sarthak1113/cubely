import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCubeStore } from '../../store/cubeStore';
import { MOVE_DEFINITIONS } from '../../engine/cubeMoves';
import { CubeletView } from './CubeletView';
import type { GestureControls } from '../../hooks/useCubeGestures';

interface RubiksCubeProps {
  gestureControls: GestureControls;
}

export const RubiksCube: React.FC<RubiksCubeProps> = ({ gestureControls }) => {
  const { size } = useThree();
  const cubeState = useCubeStore((s) => s.cubeState);
  const currentMove = useCubeStore((s) => s.currentMove);
  const animationDuration = useCubeStore((s) => s.animationDuration);
  const completeCurrentMove = useCubeStore((s) => s.completeCurrentMove);
  const isIdleAnimationEnabled = useCubeStore((s) => s.isIdleAnimationEnabled);
  const cubeScale = useCubeStore((s) => s.cubeScale);

  const idleGroupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef(0);
  const idleTimeRef = useRef(0);
  const idleBlendRef = useRef(0);
  const lastActiveRef = useRef(0);

  useFrame((_, delta) => {
    const now = performance.now();
    const isDragging = gestureControls.isDraggingFace();

    if (currentMove || isDragging) {
      lastActiveRef.current = now;
    }

    // 1. Idle Floating Animation (gentle breathing & subtle tilt)
    if (idleGroupRef.current) {
      const timeSinceActive = now - lastActiveRef.current;
      const shouldIdle = isIdleAnimationEnabled && timeSinceActive > 2000 && !currentMove && !isDragging;

      // Smoothly ramp blend factor up or down
      const targetBlend = shouldIdle ? 1 : 0;
      idleBlendRef.current += (targetBlend - idleBlendRef.current) * Math.min(1, delta * 3.5);

      if (idleBlendRef.current > 0.001) {
        idleTimeRef.current += delta;
        const t = idleTimeRef.current;

        // Subtle vertical floating bob (±0.06 units)
        idleGroupRef.current.position.y = Math.sin(t * 1.4) * 0.06 * idleBlendRef.current;

        // Subtle organic tilt
        idleGroupRef.current.rotation.x = Math.sin(t * 0.9) * 0.025 * idleBlendRef.current;
        idleGroupRef.current.rotation.z = Math.cos(t * 0.7) * 0.02 * idleBlendRef.current;
      } else {
        idleGroupRef.current.position.y = 0;
        idleGroupRef.current.rotation.x = 0;
        idleGroupRef.current.rotation.z = 0;
      }

      // Responsive scale: on portrait mobile (size.width < size.height), scale to 0.72 so it fits comfortably
      const isPortrait = size.width < size.height;
      const targetScale = cubeScale * (isPortrait ? 0.72 : 1.0);
      const currentScale = idleGroupRef.current.scale.x;
      const nextScale = currentScale + (targetScale - currentScale) * Math.min(1, delta * 8);
      idleGroupRef.current.scale.set(nextScale, nextScale, nextScale);
    }

    // 2. Active Layer Turn Animation
    if (!currentMove || !pivotRef.current) {
      if (pivotRef.current) {
        pivotRef.current.rotation.set(0, 0, 0);
      }
      animTimeRef.current = 0;
      return;
    }

    const moveDef = MOVE_DEFINITIONS[currentMove.move];
    if (!moveDef) {
      completeCurrentMove();
      return;
    }

    animTimeRef.current += delta * 1000;
    const progress = animationDuration > 0
      ? Math.min(1, animTimeRef.current / animationDuration)
      : 1;

    // Gentle spring-like ease-in-out curve
    const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);

    pivotRef.current.rotation.set(0, 0, 0);
    pivotRef.current.rotation[moveDef.axis] = moveDef.angle * eased;

    if (progress >= 1) {
      pivotRef.current.rotation.set(0, 0, 0);
      animTimeRef.current = 0;
      completeCurrentMove();
    }
  });

  const moveDef = currentMove ? MOVE_DEFINITIONS[currentMove.move] : null;

  const affectedCubelets = moveDef
    ? cubeState.cubelets.filter((c) => moveDef.affects(c.position))
    : [];

  const staticCubelets = moveDef
    ? cubeState.cubelets.filter((c) => !moveDef.affects(c.position))
    : cubeState.cubelets;

  return (
    <group ref={idleGroupRef}>
      <group
        onPointerMove={gestureControls.onPointerMove}
        onPointerUp={gestureControls.onPointerUp}
        onPointerLeave={gestureControls.onPointerUp}
      >
        {/* Static cubelets */}
        {staticCubelets.map((cubelet) => (
          <CubeletView
            key={cubelet.id}
            cubelet={cubelet}
            onStickerPointerDown={gestureControls.onStickerPointerDown}
          />
        ))}

        {/* Dynamic rotation pivot for affected layer cubelets */}
        <group ref={pivotRef}>
          {affectedCubelets.map((cubelet) => (
            <CubeletView
              key={cubelet.id}
              cubelet={cubelet}
              onStickerPointerDown={gestureControls.onStickerPointerDown}
            />
          ))}
        </group>
      </group>
    </group>
  );
};
