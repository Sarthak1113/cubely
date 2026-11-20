declare class Cube {
  constructor(other?: Cube | unknown);
  static initSolver(): void;
  static fromString(str: string): Cube;
  static random(): Cube;
  static inverse(algorithm: string | number[] | number): string | number[] | number;
  static scramble(): string;

  init(other: Cube): void;
  identity(): void;
  toJSON(): unknown;
  asString(): string;
  clone(): Cube;
  randomize(): void;
  isSolved(): boolean;
  move(algorithm: string | number[] | number): void;
  solve(maxDepth?: number): string;
}

export default Cube;
export { Cube };
