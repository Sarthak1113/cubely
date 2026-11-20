import React, { useMemo } from 'react';
import * as THREE from 'three';
import { type ThreeEvent } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import {
  type CubeColor,
  type CubeletState,
  type Face,
  INNER_COLOR,
} from '../../engine/cubeState';
import { useCubeStore } from '../../store/cubeStore';
import { CUBE_PALETTES } from '../../engine/cubePalettes';

export const CUBELET_SIZE = 0.96;
export const STICKER_SIZE = 0.84;
export const STICKER_OFFSET = CUBELET_SIZE / 2 + 0.01;
export const CUBELET_SPACING = 1.01;

interface CubeletViewProps {
  cubelet: CubeletState;
  onStickerPointerDown?: (
    event: ThreeEvent<PointerEvent>,
    cubelet: CubeletState,
    worldNormal: THREE.Vector3
  ) => void;
}

export const CubeletView: React.FC<CubeletViewProps> = React.memo(
  ({ cubelet, onStickerPointerDown }) => {
    const activePalette = useCubeStore((s) => s.activePalette);
    const paletteColors = useMemo(() => CUBE_PALETTES[activePalette]?.colors ?? CUBE_PALETTES.candy.colors, [activePalette]);

    // Convert 3x3 integer matrix to Three.js Quaternion
    const quaternion = useMemo(() => {
      const m = cubelet.orientation;
      const mat4 = new THREE.Matrix4().set(
        m[0], m[1], m[2], 0,
        m[3], m[4], m[5], 0,
        m[6], m[7], m[8], 0,
        0,    0,    0,    1
      );
      return new THREE.Quaternion().setFromRotationMatrix(mat4);
    }, [cubelet.orientation]);

    const position: [number, number, number] = useMemo(
      () => [
        cubelet.position[0] * CUBELET_SPACING,
        cubelet.position[1] * CUBELET_SPACING,
        cubelet.position[2] * CUBELET_SPACING,
      ],
      [cubelet.position]
    );

    // Initial stickers attached to this cubelet
    const stickerMap = useMemo(() => {
      const map = new Map<Face, CubeColor>();
      for (const s of cubelet.stickers) {
        map.set(s.initialFace, s.color);
      }
      return map;
    }, [cubelet.stickers]);

    const handlePointerDown = (
      e: ThreeEvent<PointerEvent>,
      faceNormalLocal: [number, number, number]
    ) => {
      if (!onStickerPointerDown) return;
      e.stopPropagation();

      const localVec = new THREE.Vector3(...faceNormalLocal);
      const worldVec = localVec.clone().applyQuaternion(quaternion).round();
      onStickerPointerDown(e, cubelet, worldVec);
    };

    return (
      <group position={position} quaternion={quaternion}>
        {/* Core cubelet dark matte plastic body with smooth rounded edges */}
        <RoundedBox
          args={[CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE]}
          radius={0.05}
          smoothness={3}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={INNER_COLOR}
            roughness={0.65}
            metalness={0.12}
          />
        </RoundedBox>

        {/* Tactile beveled sticker planes with subtle clearcoat lacquer */}
        {/* Right (+X) */}
        {stickerMap.has('R') && (
          <group
            position={[STICKER_OFFSET, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            onPointerDown={(e) => handlePointerDown(e, [1, 0, 0])}
          >
            <RoundedBox
              args={[STICKER_SIZE, STICKER_SIZE, 0.015]}
              radius={0.04}
              smoothness={2}
            >
              <meshPhysicalMaterial
                color={paletteColors[stickerMap.get('R')!]}
                roughness={0.18}
                metalness={0.04}
                clearcoat={0.3}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>
          </group>
        )}

        {/* Left (-X) */}
        {stickerMap.has('L') && (
          <group
            position={[-STICKER_OFFSET, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            onPointerDown={(e) => handlePointerDown(e, [-1, 0, 0])}
          >
            <RoundedBox
              args={[STICKER_SIZE, STICKER_SIZE, 0.015]}
              radius={0.04}
              smoothness={2}
            >
              <meshPhysicalMaterial
                color={paletteColors[stickerMap.get('L')!]}
                roughness={0.18}
                metalness={0.04}
                clearcoat={0.3}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>
          </group>
        )}

        {/* Up (+Y) */}
        {stickerMap.has('U') && (
          <group
            position={[0, STICKER_OFFSET, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerDown={(e) => handlePointerDown(e, [0, 1, 0])}
          >
            <RoundedBox
              args={[STICKER_SIZE, STICKER_SIZE, 0.015]}
              radius={0.04}
              smoothness={2}
            >
              <meshPhysicalMaterial
                color={paletteColors[stickerMap.get('U')!]}
                roughness={0.18}
                metalness={0.04}
                clearcoat={0.3}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>
          </group>
        )}

        {/* Down (-Y) */}
        {stickerMap.has('D') && (
          <group
            position={[0, -STICKER_OFFSET, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            onPointerDown={(e) => handlePointerDown(e, [0, -1, 0])}
          >
            <RoundedBox
              args={[STICKER_SIZE, STICKER_SIZE, 0.015]}
              radius={0.04}
              smoothness={2}
            >
              <meshPhysicalMaterial
                color={paletteColors[stickerMap.get('D')!]}
                roughness={0.18}
                metalness={0.04}
                clearcoat={0.3}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>
          </group>
        )}

        {/* Front (+Z) */}
        {stickerMap.has('F') && (
          <group
            position={[0, 0, STICKER_OFFSET]}
            onPointerDown={(e) => handlePointerDown(e, [0, 0, 1])}
          >
            <RoundedBox
              args={[STICKER_SIZE, STICKER_SIZE, 0.015]}
              radius={0.04}
              smoothness={2}
            >
              <meshPhysicalMaterial
                color={paletteColors[stickerMap.get('F')!]}
                roughness={0.18}
                metalness={0.04}
                clearcoat={0.3}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>
          </group>
        )}

        {/* Back (-Z) */}
        {stickerMap.has('B') && (
          <group
            position={[0, 0, -STICKER_OFFSET]}
            rotation={[0, Math.PI, 0]}
            onPointerDown={(e) => handlePointerDown(e, [0, 0, -1])}
          >
            <RoundedBox
              args={[STICKER_SIZE, STICKER_SIZE, 0.015]}
              radius={0.04}
              smoothness={2}
            >
              <meshPhysicalMaterial
                color={paletteColors[stickerMap.get('B')!]}
                roughness={0.18}
                metalness={0.04}
                clearcoat={0.3}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>
          </group>
        )}
      </group>
    );
  }
);
