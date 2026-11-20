import {
  type CubeColor,
  type Face,
  FACE_COLORS,
  FACE_NORMALS,
  multiplyMatrix3Int,
  type RubiksCubeState,
  transformVector3Int,
  type Vector3Int,
} from './cubeState';
import { MOVE_DEFINITIONS, type StandardMoveNotation } from './cubeMoves';

/**
 * Applies a logical move to the RubiksCubeState using exact integer arithmetic.
 * Guarantees zero floating-point drift.
 */
export function applyMove(
  cube: RubiksCubeState,
  notation: StandardMoveNotation
): RubiksCubeState {
  const moveDef = MOVE_DEFINITIONS[notation];
  if (!moveDef) {
    throw new Error(`Unknown move notation: ${notation}`);
  }

  const { matrix, affects } = moveDef;

  const nextCubelets = cube.cubelets.map((cubelet) => {
    if (!affects(cubelet.position)) {
      return cubelet;
    }

    const nextPosition = transformVector3Int(matrix, cubelet.position);
    const nextOrientation = multiplyMatrix3Int(matrix, cubelet.orientation);

    return {
      ...cubelet,
      position: nextPosition,
      orientation: nextOrientation,
    };
  });

  return {
    cubelets: nextCubelets,
  };
}

/**
 * Returns list of cubelet IDs affected by a given move.
 */
export function getAffectedCubeletIds(
  cube: RubiksCubeState,
  notation: StandardMoveNotation
): string[] {
  const moveDef = MOVE_DEFINITIONS[notation];
  if (!moveDef) return [];
  return cube.cubelets
    .filter((c) => moveDef.affects(c.position))
    .map((c) => c.id);
}

/**
 * Retrieves the sticker color on a specific face of a cubelet at a specific 3D coordinate.
 */
export function getStickerColorAt(
  cube: RubiksCubeState,
  pos: Vector3Int,
  faceNormal: Vector3Int
): CubeColor | null {
  const cubelet = cube.cubelets.find(
    (c) => c.position[0] === pos[0] && c.position[1] === pos[1] && c.position[2] === pos[2]
  );
  if (!cubelet) return null;

  for (const sticker of cubelet.stickers) {
    const origNormal = FACE_NORMALS[sticker.initialFace];
    const currNormal = transformVector3Int(cubelet.orientation, origNormal);
    if (
      currNormal[0] === faceNormal[0] &&
      currNormal[1] === faceNormal[1] &&
      currNormal[2] === faceNormal[2]
    ) {
      return sticker.color;
    }
  }

  return null;
}

/**
 * Extracts 9 facelet colors for each face in standard Reading order (top-left to bottom-right).
 *
 * Standard reading order when looking directly at each face:
 * U (y=+1): top=Back (z=-1), bottom=Front (z=+1), left=Left (x=-1), right=Right (x=+1)
 * R (x=+1): top=Up (y=+1), bottom=Down (y=-1), left=Front (z=+1), right=Back (z=-1)
 * F (z=+1): top=Up (y=+1), bottom=Down (y=-1), left=Left (x=-1), right=Right (x=+1)
 * D (y=-1): top=Front (z=+1), bottom=Back (z=-1), left=Left (x=-1), right=Right (x=+1)
 * L (x=-1): top=Up (y=+1), bottom=Down (y=-1), left=Back (z=-1), right=Front (z=+1)
 * B (z=-1): top=Up (y=+1), bottom=Down (y=-1), left=Right (x=+1), right=Left (x=-1)
 */
export function getFaceletGrid(
  cube: RubiksCubeState,
  face: Face
): CubeColor[] {
  const normal = FACE_NORMALS[face];
  const grid: CubeColor[] = [];

  switch (face) {
    case 'U': // y = +1; rows z from -1 to 1; cols x from -1 to 1
      for (const z of [-1, 0, 1]) {
        for (const x of [-1, 0, 1]) {
          grid.push(getStickerColorAt(cube, [x, 1, z], normal) ?? FACE_COLORS.U);
        }
      }
      break;

    case 'R': // x = +1; rows y from 1 down to -1; cols z from 1 down to -1
      for (const y of [1, 0, -1]) {
        for (const z of [1, 0, -1]) {
          grid.push(getStickerColorAt(cube, [1, y, z], normal) ?? FACE_COLORS.R);
        }
      }
      break;

    case 'F': // z = +1; rows y from 1 down to -1; cols x from -1 to 1
      for (const y of [1, 0, -1]) {
        for (const x of [-1, 0, 1]) {
          grid.push(getStickerColorAt(cube, [x, y, 1], normal) ?? FACE_COLORS.F);
        }
      }
      break;

    case 'D': // y = -1; rows z from 1 down to -1; cols x from -1 to 1
      for (const z of [1, 0, -1]) {
        for (const x of [-1, 0, 1]) {
          grid.push(getStickerColorAt(cube, [x, -1, z], normal) ?? FACE_COLORS.D);
        }
      }
      break;

    case 'L': // x = -1; rows y from 1 down to -1; cols z from -1 to 1
      for (const y of [1, 0, -1]) {
        for (const z of [-1, 0, 1]) {
          grid.push(getStickerColorAt(cube, [-1, y, z], normal) ?? FACE_COLORS.L);
        }
      }
      break;

    case 'B': // z = -1; rows y from 1 down to -1; cols x from 1 down to -1
      for (const y of [1, 0, -1]) {
        for (const x of [1, 0, -1]) {
          grid.push(getStickerColorAt(cube, [x, y, -1], normal) ?? FACE_COLORS.B);
        }
      }
      break;
  }

  return grid;
}
