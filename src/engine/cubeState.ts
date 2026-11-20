export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

export type CubeColor = 'white' | 'yellow' | 'orange' | 'red' | 'green' | 'blue';

export const FACE_COLORS: Record<Face, CubeColor> = {
  U: 'white',
  D: 'yellow',
  L: 'orange',
  R: 'red',
  F: 'green',
  B: 'blue',
};

export const COLOR_HEX: Record<CubeColor, string> = {
  white: '#FFFFFF',
  yellow: '#FFD500',
  orange: '#FF5800',
  red: '#C41E3A',
  green: '#009E60',
  blue: '#0051BA',
};

export const INNER_COLOR = '#111111';

export type Vector3Int = readonly [number, number, number];

// Row-major 3x3 integer matrix:
// [m00, m01, m02,
//  m10, m11, m12,
//  m20, m21, m22]
export type Matrix3Int = readonly [
  number, number, number,
  number, number, number,
  number, number, number
];

export const IDENTITY_MATRIX: Matrix3Int = [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
];

export function multiplyMatrix3Int(a: Matrix3Int, b: Matrix3Int): Matrix3Int {
  return [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
  ];
}

export function transformVector3Int(m: Matrix3Int, v: Vector3Int): Vector3Int {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

// Map face standard normal vectors
export const FACE_NORMALS: Record<Face, Vector3Int> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  L: [-1, 0, 0],
  R: [1, 0, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
};

export function normalToFace(n: Vector3Int): Face | null {
  if (n[0] === 1 && n[1] === 0 && n[2] === 0) return 'R';
  if (n[0] === -1 && n[1] === 0 && n[2] === 0) return 'L';
  if (n[0] === 0 && n[1] === 1 && n[2] === 0) return 'U';
  if (n[0] === 0 && n[1] === -1 && n[2] === 0) return 'D';
  if (n[0] === 0 && n[1] === 0 && n[2] === 1) return 'F';
  if (n[0] === 0 && n[1] === 0 && n[2] === -1) return 'B';
  return null;
}

export interface CubeletSticker {
  initialFace: Face;
  color: CubeColor;
}

export interface CubeletState {
  id: string;
  initialPosition: Vector3Int;
  position: Vector3Int;
  orientation: Matrix3Int;
  stickers: CubeletSticker[]; // Stickers attached to this cubelet
}

export interface RubiksCubeState {
  cubelets: CubeletState[];
}

export function createSolvedCube(): RubiksCubeState {
  const cubelets: CubeletState[] = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip interior core (0,0,0) - total 26 visible physical cubelets
        if (x === 0 && y === 0 && z === 0) continue;

        const pos: Vector3Int = [x, y, z];
        const stickers: CubeletSticker[] = [];

        if (x === 1) stickers.push({ initialFace: 'R', color: FACE_COLORS.R });
        if (x === -1) stickers.push({ initialFace: 'L', color: FACE_COLORS.L });
        if (y === 1) stickers.push({ initialFace: 'U', color: FACE_COLORS.U });
        if (y === -1) stickers.push({ initialFace: 'D', color: FACE_COLORS.D });
        if (z === 1) stickers.push({ initialFace: 'F', color: FACE_COLORS.F });
        if (z === -1) stickers.push({ initialFace: 'B', color: FACE_COLORS.B });

        cubelets.push({
          id: `cubelet_${x}_${y}_${z}`,
          initialPosition: pos,
          position: pos,
          orientation: IDENTITY_MATRIX,
          stickers,
        });
      }
    }
  }

  return { cubelets };
}
