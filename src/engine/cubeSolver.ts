import Cube from './vendor/cubejs';
import {
  type CubeColor,
  type Face,
  FACE_COLORS,
  type RubiksCubeState,
} from './cubeState';
import { getFaceletGrid } from './cubeRotation';
import { parseMoveString, type StandardMoveNotation } from './cubeMoves';
import { isCubeSolved } from './cubeValidation';

let solverInitialized = false;
let solverInitializing = false;
let initPromise: Promise<void> | null = null;

// Allow both default and named export depending on bundler environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CubeClass: any = (Cube as any).default || Cube;

/**
 * Initializes Kociemba solver lookup tables asynchronously so UI doesn't freeze.
 */
export async function initializeSolver(): Promise<void> {
  if (solverInitialized) return;
  if (initPromise) return initPromise;

  solverInitializing = true;
  initPromise = new Promise((resolve) => {
    setTimeout(() => {
      try {
        CubeClass.initSolver();
        solverInitialized = true;
      } catch (err) {
        console.error('Failed to initialize Cube solver:', err);
      } finally {
        solverInitializing = false;
        resolve();
      }
    }, 0);
  });

  return initPromise;
}

export function isSolverReady(): boolean {
  return solverInitialized;
}

export function isSolverLoading(): boolean {
  return solverInitializing;
}

/**
 * Converts the current 3D cube state into standard 54-char Kociemba facelet string:
 * U1..U9 R1..R9 F1..F9 D1..D9 L1..L9 B1..B9
 */
export function cubeToFaceletString(cube: RubiksCubeState): string {
  const faces: Face[] = ['U', 'R', 'F', 'D', 'L', 'B'];

  // Map each face's center color to its face letter
  const colorToFaceLetter = new Map<CubeColor, Face>();
  for (const face of faces) {
    const grid = getFaceletGrid(cube, face);
    const centerColor = grid[4]; // Center sticker
    colorToFaceLetter.set(centerColor, face);
  }

  // If for some reason centers don't map 1:1, fallback to standard FACE_COLORS
  if (colorToFaceLetter.size !== 6) {
    colorToFaceLetter.clear();
    for (const face of faces) {
      colorToFaceLetter.set(FACE_COLORS[face], face);
    }
  }

  let faceletStr = '';
  for (const face of faces) {
    const grid = getFaceletGrid(cube, face);
    for (let i = 0; i < 9; i++) {
      const color = grid[i];
      const letter = colorToFaceLetter.get(color) ?? face;
      faceletStr += letter;
    }
  }

  return faceletStr;
}

export interface SolveResult {
  success: boolean;
  moves: StandardMoveNotation[];
  notationString: string;
  error?: string;
}

/**
 * Solves the current cube state using Kociemba two-phase algorithm.
 * Never resets or fakes the solution.
 */
export async function solveCube(cube: RubiksCubeState): Promise<SolveResult> {
  if (isCubeSolved(cube)) {
    return {
      success: true,
      moves: [],
      notationString: '',
    };
  }

  if (!solverInitialized) {
    await initializeSolver();
  }

  try {
    const faceletStr = cubeToFaceletString(cube);
    const cubeInstance = CubeClass.fromString(faceletStr);
    const rawSolution: string = cubeInstance.solve();

    if (!rawSolution || typeof rawSolution !== 'string') {
      return {
        success: false,
        moves: [],
        notationString: '',
        error: 'No solution found for this state.',
      };
    }

    const moves = parseMoveString(rawSolution);
    return {
      success: true,
      moves,
      notationString: rawSolution.trim(),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Solve error:', msg);
    return {
      success: false,
      moves: [],
      notationString: '',
      error: `Solving failed: ${msg}`,
    };
  }
}
