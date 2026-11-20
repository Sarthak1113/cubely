import { describe, it, expect, beforeAll } from 'vitest';
import { createSolvedCube } from '../engine/cubeState';
import { applyMove } from '../engine/cubeRotation';
import {
  isCubeSolved,
  isStrictlySolved,
  validateCubeIntegrity,
} from '../engine/cubeValidation';
import { generateScramble } from '../engine/cubeScrambler';
import {
  getInverseMove,
  MOVE_DEFINITIONS,
  type StandardMoveNotation,
} from '../engine/cubeMoves';
import { initializeSolver, solveCube } from '../engine/cubeSolver';

describe("Rubik's Cube Engine Core Tests", () => {
  beforeAll(async () => {
    await initializeSolver();
  }, 15000);

  // 1. Initial cube is solved
  it('1. Initial cube is solved', () => {
    const cube = createSolvedCube();
    expect(cube.cubelets.length).toBe(26);
    expect(validateCubeIntegrity(cube)).toBe(true);
    expect(isCubeSolved(cube)).toBe(true);
    expect(isStrictlySolved(cube)).toBe(true);
  });

  // 2. U followed by U' returns to solved state
  it("2. U followed by U' returns to solved state", () => {
    let cube = createSolvedCube();
    cube = applyMove(cube, 'U');
    expect(isCubeSolved(cube)).toBe(false);
    cube = applyMove(cube, "U'");
    expect(isCubeSolved(cube)).toBe(true);
    expect(isStrictlySolved(cube)).toBe(true);
  });

  // 3. R followed by R' returns to solved state
  it("3. R followed by R' returns to solved state", () => {
    let cube = createSolvedCube();
    cube = applyMove(cube, 'R');
    expect(isCubeSolved(cube)).toBe(false);
    cube = applyMove(cube, "R'");
    expect(isCubeSolved(cube)).toBe(true);
    expect(isStrictlySolved(cube)).toBe(true);
  });

  // 4. F followed by F' returns to solved state
  it("4. F followed by F' returns to solved state", () => {
    let cube = createSolvedCube();
    cube = applyMove(cube, 'F');
    expect(isCubeSolved(cube)).toBe(false);
    cube = applyMove(cube, "F'");
    expect(isCubeSolved(cube)).toBe(true);
    expect(isStrictlySolved(cube)).toBe(true);
  });

  // 5. Four identical quarter turns return to the original state
  it('5. Four identical quarter turns return to the original state for all faces', () => {
    const faces: StandardMoveNotation[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    for (const move of faces) {
      let cube = createSolvedCube();
      for (let i = 0; i < 4; i++) {
        cube = applyMove(cube, move);
      }
      expect(isCubeSolved(cube)).toBe(true);
      expect(isStrictlySolved(cube)).toBe(true);
    }
  });

  // 6. Double turns work correctly (e.g. U2 followed by U2 returns to solved)
  it('6. Double turns work correctly', () => {
    const doubleMoves: StandardMoveNotation[] = ['U2', 'D2', 'L2', 'R2', 'F2', 'B2'];
    for (const move of doubleMoves) {
      let cube = createSolvedCube();
      cube = applyMove(cube, move);
      expect(isCubeSolved(cube)).toBe(false);
      expect(validateCubeIntegrity(cube)).toBe(true);
      cube = applyMove(cube, move);
      expect(isCubeSolved(cube)).toBe(true);
      expect(isStrictlySolved(cube)).toBe(true);
    }
  });

  // 7. Scrambling changes the cube state
  it('7. Scrambling changes the cube state', () => {
    const scramble = generateScramble(20);
    expect(scramble.length).toBe(20);

    let cube = createSolvedCube();
    for (const move of scramble) {
      cube = applyMove(cube, move);
    }

    expect(isCubeSolved(cube)).toBe(false);
    expect(validateCubeIntegrity(cube)).toBe(true);
  });

  // 8. Solving restores the solved state
  it('8. Solving restores the solved state', async () => {
    let cube = createSolvedCube();
    // Test known scramble
    const moves: StandardMoveNotation[] = ['R', 'U', "R'", "U'"];
    for (const m of moves) {
      cube = applyMove(cube, m);
    }
    expect(isCubeSolved(cube)).toBe(false);

    const result = await solveCube(cube);
    expect(result.success).toBe(true);
    expect(result.moves.length).toBeGreaterThan(0);

    for (const m of result.moves) {
      cube = applyMove(cube, m);
    }
    expect(isCubeSolved(cube)).toBe(true);
  });

  // 9. Undo reverses the last move
  it('9. Undo reverses the last move', () => {
    let cube = createSolvedCube();
    const history: StandardMoveNotation[] = [];

    // Perform a move
    const move: StandardMoveNotation = 'R';
    cube = applyMove(cube, move);
    history.push(move);
    expect(isCubeSolved(cube)).toBe(false);

    // Undo by popping and applying inverse
    const last = history.pop()!;
    const inv = getInverseMove(last);
    cube = applyMove(cube, inv);
    expect(isCubeSolved(cube)).toBe(true);
  });

  // 10. Redo reapplies the move
  it('10. Redo reapplies the move', () => {
    let cube = createSolvedCube();
    const history: StandardMoveNotation[] = [];
    const redoStack: StandardMoveNotation[] = [];

    // Perform move
    const move: StandardMoveNotation = 'F';
    cube = applyMove(cube, move);
    history.push(move);

    // Undo
    const last = history.pop()!;
    redoStack.push(last);
    cube = applyMove(cube, getInverseMove(last));
    expect(isCubeSolved(cube)).toBe(true);

    // Redo
    const redoMove = redoStack.pop()!;
    cube = applyMove(cube, redoMove);
    history.push(redoMove);
    expect(isCubeSolved(cube)).toBe(false);
  });

  // 11. Reset restores the original configuration
  it('11. Reset restores the original configuration', () => {
    let cube = createSolvedCube();
    const scramble = generateScramble(15);
    for (const m of scramble) {
      cube = applyMove(cube, m);
    }
    expect(isCubeSolved(cube)).toBe(false);

    // Reset
    cube = createSolvedCube();
    expect(isCubeSolved(cube)).toBe(true);
    expect(isStrictlySolved(cube)).toBe(true);
  });

  // 12. Long random move sequences do not corrupt the cube
  it('12. Long random move sequences do not corrupt the cube', () => {
    let cube = createSolvedCube();
    const longScramble = generateScramble(100);

    for (const m of longScramble) {
      cube = applyMove(cube, m);
    }

    expect(validateCubeIntegrity(cube)).toBe(true);
    expect(cube.cubelets.length).toBe(26);

    // All positions are integers in {-1, 0, 1}
    for (const c of cube.cubelets) {
      expect([-1, 0, 1]).toContain(c.position[0]);
      expect([-1, 0, 1]).toContain(c.position[1]);
      expect([-1, 0, 1]).toContain(c.position[2]);
    }
  });

  // 13. Every face rotation preserves cube integrity
  it('13. Every face rotation preserves cube integrity', () => {
    const allMoves = Object.keys(MOVE_DEFINITIONS) as StandardMoveNotation[];
    let cube = createSolvedCube();

    for (const m of allMoves) {
      cube = applyMove(cube, m);
      expect(validateCubeIntegrity(cube)).toBe(true);
    }
  });

  // 14. Combinations of moves: Sexy move 6 times returns to solved state
  it('14. Sexy Move (R U R prime U prime) repeated 6 times returns to solved state', () => {
    let cube = createSolvedCube();
    const sexyMove: StandardMoveNotation[] = ['R', 'U', "R'", "U'"];

    for (let cycle = 0; cycle < 6; cycle++) {
      for (const m of sexyMove) {
        cube = applyMove(cube, m);
      }
    }

    expect(isCubeSolved(cube)).toBe(true);
    expect(isStrictlySolved(cube)).toBe(true);
  });

  // Slice moves and whole-cube rotations
  it('Middle slice moves (M, E, S) work and preserve integrity', () => {
    let cube = createSolvedCube();
    for (let i = 0; i < 4; i++) {
      cube = applyMove(cube, 'M');
    }
    expect(isCubeSolved(cube)).toBe(true);

    for (let i = 0; i < 4; i++) {
      cube = applyMove(cube, 'E');
    }
    expect(isCubeSolved(cube)).toBe(true);

    for (let i = 0; i < 4; i++) {
      cube = applyMove(cube, 'S');
    }
    expect(isCubeSolved(cube)).toBe(true);
  });

  it('Whole-cube rotations (x, y, z) preserve solved faces', () => {
    let cube = createSolvedCube();
    cube = applyMove(cube, 'x');
    expect(isCubeSolved(cube)).toBe(true); // Faces are still uniform
    cube = applyMove(cube, 'y');
    expect(isCubeSolved(cube)).toBe(true);
    cube = applyMove(cube, 'z');
    expect(isCubeSolved(cube)).toBe(true);
    cube = applyMove(cube, "z'");
    cube = applyMove(cube, "y'");
    cube = applyMove(cube, "x'");
    expect(isStrictlySolved(cube)).toBe(true);
  });
});
