import { create } from 'zustand';
import { createSolvedCube, type RubiksCubeState } from '../engine/cubeState';
import { applyMove } from '../engine/cubeRotation';
import {
  getInverseMove,
  type StandardMoveNotation,
} from '../engine/cubeMoves';
import { isCubeSolved } from '../engine/cubeValidation';
import { generateScramble, scrambleToString } from '../engine/cubeScrambler';
import { solveCube } from '../engine/cubeSolver';
import { soundEngine } from '../utils/soundEngine';
import type { PaletteId, ThemeId } from '../engine/cubePalettes';

export type AutomationType = 'idle' | 'scrambling' | 'solving';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'solved';

export interface QueueItem {
  move: StandardMoveNotation;
  isUndo?: boolean;
  isRedo?: boolean;
  skipHistory?: boolean;
  isTimerMove?: boolean;
}

// LocalStorage Persistence
const PREFS_KEY = 'cubely_preferences_v2';
interface SavedPrefs {
  palette: PaletteId;
  theme: ThemeId;
  sound: boolean;
  idle: boolean;
  scale: number;
}

function loadSavedPrefs(): SavedPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const validPalette = (parsed.palette === 'neon' || parsed.palette === 'sunset' || parsed.palette === 'candy' || parsed.palette === 'monochrome')
        ? parsed.palette
        : 'candy';
      return {
        palette: validPalette,
        theme: parsed.theme ?? 'warm-light',
        sound: parsed.sound ?? false,
        idle: parsed.idle ?? true,
        scale: parsed.scale ?? 1.0,
      };
    }
  } catch {
    // Ignore error
  }
  return {
    palette: 'candy',
    theme: 'warm-light',
    sound: false,
    idle: true,
    scale: 1.0,
  };
}

function savePrefs(prefs: SavedPrefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore error
  }
}

const initialPrefs = loadSavedPrefs();
// Sync initial sound engine state
soundEngine.setEnabled(initialPrefs.sound);

export interface CubeStoreState {
  // Logical Cube State
  cubeState: RubiksCubeState;
  isSolved: boolean;
  moveCount: number;
  lastMove: StandardMoveNotation | null;

  // History for Undo / Redo
  moveHistory: StandardMoveNotation[];
  redoStack: StandardMoveNotation[];

  // Active Scramble / Solution
  currentScramble: string;
  currentSolution: string;
  solutionMoves: StandardMoveNotation[];
  solverStatus: 'idle' | 'solving' | 'ready' | 'error';
  solverError: string | null;

  // Animation and Queue
  moveQueue: QueueItem[];
  currentMove: QueueItem | null;
  isAnimating: boolean;
  isQueuePaused: boolean;
  automationType: AutomationType;
  animationDuration: number; // in milliseconds

  // Timer
  timerStatus: TimerStatus;
  timerStartTime: number | null;
  timerElapsedTime: number; // in ms
  isTimedSession: boolean;

  // Creative & Personalization Settings
  activePalette: PaletteId;
  activeTheme: ThemeId;
  isSoundEnabled: boolean;
  isIdleAnimationEnabled: boolean;
  cubeScale: number;
  isFocusMode: boolean;
  showSettingsModal: boolean;
  showHowToPlay: boolean;
  toastMessage: string | null;
  celebrationActive: boolean;

  // Actions
  enqueueMove: (
    move: StandardMoveNotation,
    options?: { isUndo?: boolean; isRedo?: boolean; skipHistory?: boolean; isTimerMove?: boolean }
  ) => void;
  enqueueMoves: (
    moves: StandardMoveNotation[],
    automationType?: AutomationType,
    skipHistory?: boolean
  ) => void;
  startNextMove: () => void;
  completeCurrentMove: () => void;
  pauseQueue: () => void;
  resumeQueue: () => void;
  cancelQueue: () => void;

  undo: () => void;
  redo: () => void;
  reset: () => void;

  scramble: (length?: number) => void;
  solve: () => Promise<void>;

  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateTimerElapsed: (ms: number) => void;

  setAnimationSpeed: (ms: number) => void;

  // Personalization Actions
  setPalette: (id: PaletteId) => void;
  setTheme: (id: ThemeId) => void;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleIdleAnimation: () => void;
  setCubeScale: (scale: number) => void;
  toggleFocusMode: () => void;
  setShowSettingsModal: (show: boolean) => void;
  setShowHowToPlay: (show: boolean) => void;
  showToast: (msg: string) => void;
  dismissCelebration: () => void;
}

export const useCubeStore = create<CubeStoreState>((set, get) => ({
  cubeState: createSolvedCube(),
  isSolved: true,
  moveCount: 0,
  lastMove: null,

  moveHistory: [],
  redoStack: [],

  currentScramble: '',
  currentSolution: '',
  solutionMoves: [],
  solverStatus: 'idle',
  solverError: null,

  moveQueue: [],
  currentMove: null,
  isAnimating: false,
  isQueuePaused: false,
  automationType: 'idle',
  animationDuration: 350, // Default to gentle turn speed

  timerStatus: 'idle',
  timerStartTime: null,
  timerElapsedTime: 0,
  isTimedSession: false,

  // Creative Initial Values
  activePalette: initialPrefs.palette,
  activeTheme: initialPrefs.theme,
  isSoundEnabled: initialPrefs.sound,
  isIdleAnimationEnabled: initialPrefs.idle,
  cubeScale: initialPrefs.scale,
  isFocusMode: false,
  showSettingsModal: false,
  showHowToPlay: false,
  toastMessage: null,
  celebrationActive: false,

  enqueueMove: (move, options = {}) => {
    const item: QueueItem = {
      move,
      ...options,
    };

    set((state) => {
      const nextQueue = [...state.moveQueue, item];
      let nextTimerStatus = state.timerStatus;
      let nextStartTime = state.timerStartTime;
      if (
        state.isTimedSession &&
        state.timerStatus === 'idle' &&
        !options.skipHistory &&
        !['x', "x'", 'x2', 'y', "y'", 'y2', 'z', "z'", 'z2'].includes(move)
      ) {
        nextTimerStatus = 'running';
        nextStartTime = performance.now();
      }

      return {
        moveQueue: nextQueue,
        timerStatus: nextTimerStatus,
        timerStartTime: nextStartTime,
        celebrationActive: false, // Hide celebration banner on new move
      };
    });

    const state = get();
    if (!state.isAnimating && !state.isQueuePaused && state.currentMove === null) {
      get().startNextMove();
    }
  },

  enqueueMoves: (moves, automationType = 'idle', skipHistory = false) => {
    const items: QueueItem[] = moves.map((move) => ({
      move,
      skipHistory,
    }));

    set((state) => ({
      moveQueue: [...state.moveQueue, ...items],
      automationType,
      isQueuePaused: false,
      celebrationActive: false,
    }));

    const state = get();
    if (!state.isAnimating && state.currentMove === null) {
      get().startNextMove();
    }
  },

  startNextMove: () => {
    const { moveQueue, isQueuePaused } = get();
    if (isQueuePaused || moveQueue.length === 0) {
      set({ isAnimating: false, currentMove: null, automationType: 'idle' });
      return;
    }

    const [nextItem, ...remainingQueue] = moveQueue;
    set({
      currentMove: nextItem,
      moveQueue: remainingQueue,
      isAnimating: true,
      lastMove: nextItem.move,
    });
  },

  completeCurrentMove: () => {
    const {
      currentMove,
      cubeState,
      moveHistory,
      redoStack,
      moveCount,
      timerStatus,
      isTimedSession,
    } = get();

    if (!currentMove) {
      get().startNextMove();
      return;
    }

    // Play tactile mechanical turn click
    soundEngine.playTurnClick();

    const { move, isUndo, isRedo, skipHistory } = currentMove;
    const nextCubeState = applyMove(cubeState, move);
    const solved = isCubeSolved(nextCubeState);

    let nextHistory = [...moveHistory];
    let nextRedo = [...redoStack];
    let nextMoveCount = moveCount;

    const isCameraRotation = ['x', "x'", 'x2', 'y', "y'", 'y2', 'z', "z'", 'z2'].includes(move);

    if (isUndo) {
      // Undoing
    } else if (isRedo) {
      nextHistory.push(move);
      if (!isCameraRotation) nextMoveCount++;
    } else if (!skipHistory) {
      nextHistory.push(move);
      nextRedo = [];
      if (!isCameraRotation) nextMoveCount++;
    }

    let nextTimerStatus = timerStatus;
    let shouldCelebrate = false;

    // Check timer auto-stop and celebration
    if (solved && (isTimedSession || moveCount > 0)) {
      if (timerStatus === 'running') {
        nextTimerStatus = 'solved';
      }
      shouldCelebrate = true;
      soundEngine.playSolvedChime();
    }

    set({
      cubeState: nextCubeState,
      isSolved: solved,
      moveHistory: nextHistory,
      redoStack: nextRedo,
      moveCount: nextMoveCount,
      timerStatus: nextTimerStatus,
      currentMove: null,
      celebrationActive: shouldCelebrate,
    });

    get().startNextMove();
  },

  pauseQueue: () => {
    set({ isQueuePaused: true });
  },

  resumeQueue: () => {
    set({ isQueuePaused: false });
    if (!get().isAnimating && get().currentMove === null) {
      get().startNextMove();
    }
  },

  cancelQueue: () => {
    set({
      moveQueue: [],
      isQueuePaused: false,
      automationType: 'idle',
    });
  },

  undo: () => {
    const { moveHistory, isAnimating, currentMove } = get();
    if (moveHistory.length === 0 || isAnimating || currentMove !== null) {
      return;
    }

    soundEngine.playButtonPop();

    const last = moveHistory[moveHistory.length - 1];
    const newHistory = moveHistory.slice(0, -1);
    const inverse = getInverseMove(last);

    set((state) => ({
      moveHistory: newHistory,
      redoStack: [...state.redoStack, last],
      moveCount: Math.max(0, state.moveCount - 1),
    }));

    get().enqueueMove(inverse, { isUndo: true, skipHistory: true });
  },

  redo: () => {
    const { redoStack, isAnimating, currentMove } = get();
    if (redoStack.length === 0 || isAnimating || currentMove !== null) {
      return;
    }

    soundEngine.playButtonPop();

    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);

    set({ redoStack: newRedo });
    get().enqueueMove(next, { isRedo: true });
  },

  reset: () => {
    soundEngine.playButtonPop();
    set({
      cubeState: createSolvedCube(),
      isSolved: true,
      moveCount: 0,
      lastMove: null,
      moveHistory: [],
      redoStack: [],
      currentScramble: '',
      currentSolution: '',
      solutionMoves: [],
      moveQueue: [],
      currentMove: null,
      isAnimating: false,
      isQueuePaused: false,
      automationType: 'idle',
      timerStatus: 'idle',
      timerStartTime: null,
      timerElapsedTime: 0,
      isTimedSession: false,
      solverError: null,
      celebrationActive: false,
    });
  },

  scramble: (length = 20) => {
    const { isAnimating, currentMove } = get();
    if (isAnimating || currentMove !== null) return;

    soundEngine.playButtonPop();

    const moves = generateScramble(length);
    const str = scrambleToString(moves);

    set({
      currentScramble: str,
      currentSolution: '',
      solutionMoves: [],
      moveCount: 0,
      moveHistory: [],
      redoStack: [],
      isTimedSession: true,
      timerStatus: 'idle',
      timerStartTime: null,
      timerElapsedTime: 0,
      solverError: null,
      celebrationActive: false,
    });

    get().showToast('Mixing things up...');
    get().enqueueMoves(moves, 'scrambling', true);
  },

  solve: async () => {
    const { cubeState, isAnimating, currentMove } = get();
    if (isAnimating || currentMove !== null) return;

    soundEngine.playButtonPop();

    if (isCubeSolved(cubeState)) {
      set({ solverStatus: 'ready', currentSolution: 'Already solved!' });
      get().showToast('Already solved!');
      return;
    }

    set({ solverStatus: 'solving', solverError: null });

    const result = await solveCube(cubeState);
    if (!result.success) {
      set({
        solverStatus: 'error',
        solverError: result.error ?? 'Solving failed',
      });
      get().showToast('Solving failed: ' + (result.error ?? ''));
      return;
    }

    set({
      solverStatus: 'ready',
      currentSolution: result.notationString,
      solutionMoves: result.moves,
    });

    if (result.moves.length > 0) {
      get().enqueueMoves(result.moves, 'solving', false);
    }
  },

  startTimer: () => {
    set({
      timerStatus: 'running',
      timerStartTime: performance.now() - get().timerElapsedTime,
      isTimedSession: true,
    });
  },

  stopTimer: () => {
    set({ timerStatus: 'paused' });
  },

  resetTimer: () => {
    set({
      timerStatus: 'idle',
      timerStartTime: null,
      timerElapsedTime: 0,
      isTimedSession: false,
    });
  },

  updateTimerElapsed: (ms: number) => {
    set({ timerElapsedTime: ms });
  },

  setAnimationSpeed: (ms: number) => {
    set({ animationDuration: Math.max(30, ms) });
  },

  // Personalization Setters & LocalStorage sync
  setPalette: (id) => {
    soundEngine.playButtonPop();
    set({ activePalette: id });
    const s = get();
    savePrefs({
      palette: id,
      theme: s.activeTheme,
      sound: s.isSoundEnabled,
      idle: s.isIdleAnimationEnabled,
      scale: s.cubeScale,
    });
  },

  setTheme: (id) => {
    soundEngine.playButtonPop();
    set({ activeTheme: id });
    const s = get();
    savePrefs({
      palette: s.activePalette,
      theme: id,
      sound: s.isSoundEnabled,
      idle: s.isIdleAnimationEnabled,
      scale: s.cubeScale,
    });
  },

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    soundEngine.setEnabled(next);
    if (next) soundEngine.playButtonPop();
    set({ isSoundEnabled: next });
    const s = get();
    savePrefs({
      palette: s.activePalette,
      theme: s.activeTheme,
      sound: next,
      idle: s.isIdleAnimationEnabled,
      scale: s.cubeScale,
    });
    get().showToast(next ? 'Sound enabled' : 'Sound muted');
  },

  setSoundEnabled: (enabled) => {
    soundEngine.setEnabled(enabled);
    set({ isSoundEnabled: enabled });
    const s = get();
    savePrefs({
      palette: s.activePalette,
      theme: s.activeTheme,
      sound: enabled,
      idle: s.isIdleAnimationEnabled,
      scale: s.cubeScale,
    });
  },

  toggleIdleAnimation: () => {
    soundEngine.playButtonPop();
    const next = !get().isIdleAnimationEnabled;
    set({ isIdleAnimationEnabled: next });
    const s = get();
    savePrefs({
      palette: s.activePalette,
      theme: s.activeTheme,
      sound: s.isSoundEnabled,
      idle: next,
      scale: s.cubeScale,
    });
  },

  setCubeScale: (scale) => {
    set({ cubeScale: Math.max(0.7, Math.min(1.3, scale)) });
    const s = get();
    savePrefs({
      palette: s.activePalette,
      theme: s.activeTheme,
      sound: s.isSoundEnabled,
      idle: s.isIdleAnimationEnabled,
      scale: scale,
    });
  },

  toggleFocusMode: () => {
    soundEngine.playButtonPop();
    set((state) => ({ isFocusMode: !state.isFocusMode }));
  },

  setShowSettingsModal: (show) => {
    soundEngine.playButtonPop();
    set({ showSettingsModal: show });
  },

  setShowHowToPlay: (show) => {
    soundEngine.playButtonPop();
    set({ showHowToPlay: show });
  },

  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 2800);
  },

  dismissCelebration: () => {
    set({ celebrationActive: false });
  },
}));
