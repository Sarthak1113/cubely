import { type Face, type RubiksCubeState } from './cubeState';
import { getFaceletGrid } from './cubeRotation';

/**
 * Checks if all 9 stickers on every face have identical uniform color matching that face's center.
 * This works even if the cube has undergone whole-cube rotations (x, y, z).
 */
export function isFacesUniformSolved(cube: RubiksCubeState): boolean {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

  for (const face of faces) {
    const grid = getFaceletGrid(cube, face);
    if (grid.length !== 9) return false;
    const centerColor = grid[4]; // Center sticker is index 4 (0-indexed)
    for (let i = 0; i < 9; i++) {
      if (grid[i] !== centerColor) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Checks if every cubelet is at its exact initial position and identity orientation.
 */
export function isStrictlySolved(cube: RubiksCubeState): boolean {
  for (const c of cube.cubelets) {
    if (
      c.position[0] !== c.initialPosition[0] ||
      c.position[1] !== c.initialPosition[1] ||
      c.position[2] !== c.initialPosition[2]
    ) {
      return false;
    }
    // Check orientation identity
    const o = c.orientation;
    if (
      o[0] !== 1 || o[1] !== 0 || o[2] !== 0 ||
      o[3] !== 0 || o[4] !== 1 || o[5] !== 0 ||
      o[6] !== 0 || o[7] !== 0 || o[8] !== 1
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Standard solved check:
 * Returns true if faces are uniform.
 */
export function isCubeSolved(cube: RubiksCubeState): boolean {
  return isFacesUniformSolved(cube);
}

/**
 * Verifies structural integrity of the cube (26 cubelets, all unique integer positions in range).
 */
export function validateCubeIntegrity(cube: RubiksCubeState): boolean {
  if (cube.cubelets.length !== 26) return false;

  const positions = new Set<string>();
  for (const c of cube.cubelets) {
    const [x, y, z] = c.position;
    if (![-1, 0, 1].includes(x) || ![-1, 0, 1].includes(y) || ![-1, 0, 1].includes(z)) {
      return false;
    }
    if (x === 0 && y === 0 && z === 0) {
      return false; // Center core should not be in visible cubelets
    }
    const key = `${x},${y},${z}`;
    if (positions.has(key)) return false;
    positions.add(key);
  }

  return positions.size === 26;
}
