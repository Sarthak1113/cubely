import type { StandardMoveNotation } from './cubeMoves';

const FACES = ['U', 'D', 'L', 'R', 'F', 'B'] as const;
type BaseFace = (typeof FACES)[number];

const OPPOSITE_FACE: Record<BaseFace, BaseFace> = {
  U: 'D',
  D: 'U',
  L: 'R',
  R: 'L',
  F: 'B',
  B: 'F',
};

const SUFFIXES = ['', "'", '2'] as const;

/**
 * Generates a valid random Rubik's cube scramble adhering to WCA principles:
 * - No consecutive moves on the same face (e.g. no R followed by R')
 * - No redundant alternating moves on the same axis (e.g. no R L R)
 */
export function generateScramble(length: number = 20): StandardMoveNotation[] {
  if (length <= 0) return [];

  const moves: StandardMoveNotation[] = [];
  let prevFace: BaseFace | null = null;
  let secondPrevFace: BaseFace | null = null;

  for (let i = 0; i < length; i++) {
    const validFaces = FACES.filter((face) => {
      // Cannot repeat same face
      if (face === prevFace) return false;
      // If previous two moves were on opposite faces (e.g. R then L), don't pick either again
      if (
        prevFace !== null &&
        secondPrevFace !== null &&
        OPPOSITE_FACE[prevFace] === secondPrevFace &&
        (face === prevFace || face === secondPrevFace)
      ) {
        return false;
      }
      return true;
    });

    const chosenFace = validFaces[Math.floor(Math.random() * validFaces.length)];
    const chosenSuffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const moveNotation = `${chosenFace}${chosenSuffix}` as StandardMoveNotation;

    moves.push(moveNotation);
    secondPrevFace = prevFace;
    prevFace = chosenFace;
  }

  return moves;
}

export function scrambleToString(moves: StandardMoveNotation[]): string {
  return moves.join(' ');
}
