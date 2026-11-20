import type { Matrix3Int, Vector3Int } from './cubeState';

export type StandardMoveNotation =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'L' | "L'" | 'L2'
  | 'R' | "R'" | 'R2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2'
  | 'M' | "M'" | 'M2'
  | 'E' | "E'" | 'E2'
  | 'S' | "S'" | 'S2'
  | 'x' | "x'" | 'x2'
  | 'y' | "y'" | 'y2'
  | 'z' | "z'" | 'z2';

export interface MoveDefinition {
  notation: StandardMoveNotation;
  axis: 'x' | 'y' | 'z';
  angle: number; // in radians, for Three.js visual animation around axis
  matrix: Matrix3Int;
  affects: (pos: Vector3Int) => boolean;
}

// 90-degree and 180-degree rotation matrices around X, Y, Z:

// Around +X by -90 deg (Clockwise looking from +X, e.g. R, M', x)
// y' = z, z' = -y
const ROT_X_NEG_90: Matrix3Int = [
  1,  0,  0,
  0,  0,  1,
  0, -1,  0,
];

// Around +X by +90 deg (Counter-clockwise looking from +X / Clockwise from -X, e.g. R', L, M, x')
// y' = -z, z' = y
const ROT_X_POS_90: Matrix3Int = [
  1,  0,  0,
  0,  0, -1,
  0,  1,  0,
];

// Around +X by 180 deg
const ROT_X_180: Matrix3Int = [
  1,  0,  0,
  0, -1,  0,
  0,  0, -1,
];

// Around +Y by -90 deg (Clockwise looking from +Y down, e.g. U, D', E', y)
// x' = -z, z' = x
const ROT_Y_NEG_90: Matrix3Int = [
  0,  0, -1,
  0,  1,  0,
  1,  0,  0,
];

// Around +Y by +90 deg (Counter-clockwise looking from +Y / Clockwise from -Y, e.g. U', D, E, y')
// x' = z, z' = -x
const ROT_Y_POS_90: Matrix3Int = [
  0,  0,  1,
  0,  1,  0,
 -1,  0,  0,
];

// Around +Y by 180 deg
const ROT_Y_180: Matrix3Int = [
 -1,  0,  0,
  0,  1,  0,
  0,  0, -1,
];

// Around +Z by -90 deg (Clockwise looking from +Z, e.g. F, B', S, z)
// x' = y, y' = -x
const ROT_Z_NEG_90: Matrix3Int = [
  0,  1,  0,
 -1,  0,  0,
  0,  0,  1,
];

// Around +Z by +90 deg (Counter-clockwise looking from +Z / Clockwise from -Z, e.g. F', B, S', z')
// x' = -y, y' = x
const ROT_Z_POS_90: Matrix3Int = [
  0, -1,  0,
  1,  0,  0,
  0,  0,  1,
];

// Around +Z by 180 deg
const ROT_Z_180: Matrix3Int = [
 -1,  0,  0,
  0, -1,  0,
  0,  0,  1,
];

const HALF_PI = Math.PI / 2;
const PI = Math.PI;

export const MOVE_DEFINITIONS: Record<StandardMoveNotation, MoveDefinition> = {
  // U moves (y = 1)
  U: {
    notation: 'U',
    axis: 'y',
    angle: -HALF_PI,
    matrix: ROT_Y_NEG_90,
    affects: (pos) => pos[1] === 1,
  },
  "U'": {
    notation: "U'",
    axis: 'y',
    angle: HALF_PI,
    matrix: ROT_Y_POS_90,
    affects: (pos) => pos[1] === 1,
  },
  U2: {
    notation: 'U2',
    axis: 'y',
    angle: -PI,
    matrix: ROT_Y_180,
    affects: (pos) => pos[1] === 1,
  },

  // D moves (y = -1)
  D: {
    notation: 'D',
    axis: 'y',
    angle: HALF_PI,
    matrix: ROT_Y_POS_90,
    affects: (pos) => pos[1] === -1,
  },
  "D'": {
    notation: "D'",
    axis: 'y',
    angle: -HALF_PI,
    matrix: ROT_Y_NEG_90,
    affects: (pos) => pos[1] === -1,
  },
  D2: {
    notation: 'D2',
    axis: 'y',
    angle: PI,
    matrix: ROT_Y_180,
    affects: (pos) => pos[1] === -1,
  },

  // R moves (x = 1)
  R: {
    notation: 'R',
    axis: 'x',
    angle: -HALF_PI,
    matrix: ROT_X_NEG_90,
    affects: (pos) => pos[0] === 1,
  },
  "R'": {
    notation: "R'",
    axis: 'x',
    angle: HALF_PI,
    matrix: ROT_X_POS_90,
    affects: (pos) => pos[0] === 1,
  },
  R2: {
    notation: 'R2',
    axis: 'x',
    angle: -PI,
    matrix: ROT_X_180,
    affects: (pos) => pos[0] === 1,
  },

  // L moves (x = -1)
  L: {
    notation: 'L',
    axis: 'x',
    angle: HALF_PI,
    matrix: ROT_X_POS_90,
    affects: (pos) => pos[0] === -1,
  },
  "L'": {
    notation: "L'",
    axis: 'x',
    angle: -HALF_PI,
    matrix: ROT_X_NEG_90,
    affects: (pos) => pos[0] === -1,
  },
  L2: {
    notation: 'L2',
    axis: 'x',
    angle: PI,
    matrix: ROT_X_180,
    affects: (pos) => pos[0] === -1,
  },

  // F moves (z = 1)
  F: {
    notation: 'F',
    axis: 'z',
    angle: -HALF_PI,
    matrix: ROT_Z_NEG_90,
    affects: (pos) => pos[2] === 1,
  },
  "F'": {
    notation: "F'",
    axis: 'z',
    angle: HALF_PI,
    matrix: ROT_Z_POS_90,
    affects: (pos) => pos[2] === 1,
  },
  F2: {
    notation: 'F2',
    axis: 'z',
    angle: -PI,
    matrix: ROT_Z_180,
    affects: (pos) => pos[2] === 1,
  },

  // B moves (z = -1)
  B: {
    notation: 'B',
    axis: 'z',
    angle: HALF_PI,
    matrix: ROT_Z_POS_90,
    affects: (pos) => pos[2] === -1,
  },
  "B'": {
    notation: "B'",
    axis: 'z',
    angle: -HALF_PI,
    matrix: ROT_Z_NEG_90,
    affects: (pos) => pos[2] === -1,
  },
  B2: {
    notation: 'B2',
    axis: 'z',
    angle: PI,
    matrix: ROT_Z_180,
    affects: (pos) => pos[2] === -1,
  },

  // Slice moves:
  // M (middle between L and R, x = 0, follows L)
  M: {
    notation: 'M',
    axis: 'x',
    angle: HALF_PI,
    matrix: ROT_X_POS_90,
    affects: (pos) => pos[0] === 0,
  },
  "M'": {
    notation: "M'",
    axis: 'x',
    angle: -HALF_PI,
    matrix: ROT_X_NEG_90,
    affects: (pos) => pos[0] === 0,
  },
  M2: {
    notation: 'M2',
    axis: 'x',
    angle: PI,
    matrix: ROT_X_180,
    affects: (pos) => pos[0] === 0,
  },

  // E (equatorial between U and D, y = 0, follows D)
  E: {
    notation: 'E',
    axis: 'y',
    angle: HALF_PI,
    matrix: ROT_Y_POS_90,
    affects: (pos) => pos[1] === 0,
  },
  "E'": {
    notation: "E'",
    axis: 'y',
    angle: -HALF_PI,
    matrix: ROT_Y_NEG_90,
    affects: (pos) => pos[1] === 0,
  },
  E2: {
    notation: 'E2',
    axis: 'y',
    angle: PI,
    matrix: ROT_Y_180,
    affects: (pos) => pos[1] === 0,
  },

  // S (standing between F and B, z = 0, follows F)
  S: {
    notation: 'S',
    axis: 'z',
    angle: -HALF_PI,
    matrix: ROT_Z_NEG_90,
    affects: (pos) => pos[2] === 0,
  },
  "S'": {
    notation: "S'",
    axis: 'z',
    angle: HALF_PI,
    matrix: ROT_Z_POS_90,
    affects: (pos) => pos[2] === 0,
  },
  S2: {
    notation: 'S2',
    axis: 'z',
    angle: -PI,
    matrix: ROT_Z_180,
    affects: (pos) => pos[2] === 0,
  },

  // Whole-cube rotations:
  // x (entire cube around X, follows R)
  x: {
    notation: 'x',
    axis: 'x',
    angle: -HALF_PI,
    matrix: ROT_X_NEG_90,
    affects: () => true,
  },
  "x'": {
    notation: "x'",
    axis: 'x',
    angle: HALF_PI,
    matrix: ROT_X_POS_90,
    affects: () => true,
  },
  x2: {
    notation: 'x2',
    axis: 'x',
    angle: -PI,
    matrix: ROT_X_180,
    affects: () => true,
  },

  // y (entire cube around Y, follows U)
  y: {
    notation: 'y',
    axis: 'y',
    angle: -HALF_PI,
    matrix: ROT_Y_NEG_90,
    affects: () => true,
  },
  "y'": {
    notation: "y'",
    axis: 'y',
    angle: HALF_PI,
    matrix: ROT_Y_POS_90,
    affects: () => true,
  },
  y2: {
    notation: 'y2',
    axis: 'y',
    angle: -PI,
    matrix: ROT_Y_180,
    affects: () => true,
  },

  // z (entire cube around Z, follows F)
  z: {
    notation: 'z',
    axis: 'z',
    angle: -HALF_PI,
    matrix: ROT_Z_NEG_90,
    affects: () => true,
  },
  "z'": {
    notation: "z'",
    axis: 'z',
    angle: HALF_PI,
    matrix: ROT_Z_POS_90,
    affects: () => true,
  },
  z2: {
    notation: 'z2',
    axis: 'z',
    angle: -PI,
    matrix: ROT_Z_180,
    affects: () => true,
  },
};

export function getInverseMove(move: StandardMoveNotation): StandardMoveNotation {
  if (move.endsWith('2')) return move;
  if (move.endsWith("'")) return move.slice(0, -1) as StandardMoveNotation;
  return `${move}'` as StandardMoveNotation;
}

export function parseMoveString(str: string): StandardMoveNotation[] {
  if (!str.trim()) return [];
  // Support notations like "R U R' U'" or "R U Rprime Uprime" or commas/spaces
  const tokens = str.trim().replace(/prime/gi, "'").split(/[\s,]+/);
  const result: StandardMoveNotation[] = [];

  for (const token of tokens) {
    if (!token) continue;
    // Normalize token
    let clean = token.trim();
    if (clean in MOVE_DEFINITIONS) {
      result.push(clean as StandardMoveNotation);
    }
  }

  return result;
}
