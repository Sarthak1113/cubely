import React, { useState } from 'react';
import {
  RotateCcw,
  RotateCw,
  Shuffle,
  Wand2,
  Trash2,
  Play,
  Pause,
  XCircle,
  HelpCircle,
  CheckCircle,
  Gauge,
} from 'lucide-react';
import { useCubeStore } from '../../store/cubeStore';
import { TimerDisplay } from './TimerDisplay';
import type { StandardMoveNotation } from '../../engine/cubeMoves';

export const DevInterface: React.FC = () => {
  const isSolved = useCubeStore((s) => s.isSolved);
  const moveCount = useCubeStore((s) => s.moveCount);
  const lastMove = useCubeStore((s) => s.lastMove);
  const moveHistory = useCubeStore((s) => s.moveHistory);
  const redoStack = useCubeStore((s) => s.redoStack);
  const currentScramble = useCubeStore((s) => s.currentScramble);
  const currentSolution = useCubeStore((s) => s.currentSolution);
  const solverStatus = useCubeStore((s) => s.solverStatus);
  const solverError = useCubeStore((s) => s.solverError);

  const moveQueue = useCubeStore((s) => s.moveQueue);
  const isAnimating = useCubeStore((s) => s.isAnimating);
  const isQueuePaused = useCubeStore((s) => s.isQueuePaused);
  const automationType = useCubeStore((s) => s.automationType);
  const animationDuration = useCubeStore((s) => s.animationDuration);

  const enqueueMove = useCubeStore((s) => s.enqueueMove);
  const undo = useCubeStore((s) => s.undo);
  const redo = useCubeStore((s) => s.redo);
  const reset = useCubeStore((s) => s.reset);
  const scramble = useCubeStore((s) => s.scramble);
  const solve = useCubeStore((s) => s.solve);
  const pauseQueue = useCubeStore((s) => s.pauseQueue);
  const resumeQueue = useCubeStore((s) => s.resumeQueue);
  const cancelQueue = useCubeStore((s) => s.cancelQueue);
  const setAnimationSpeed = useCubeStore((s) => s.setAnimationSpeed);

  const [scrambleLength, setScrambleLength] = useState(20);
  const [showHelp, setShowHelp] = useState(false);

  const manualMoves: StandardMoveNotation[] = [
    'U', "U'", 'D', "D'",
    'L', "L'", 'R', "R'",
    'F', "F'", 'B', "B'",
    'M', "M'", 'E', "E'", 'S', "S'",
    'x', "x'", 'y', "y'", 'z', "z'"
  ];

  const speedOptions = [
    { label: 'Fast (100ms)', value: 100 },
    { label: 'Normal (200ms)', value: 200 },
    { label: 'Smooth (350ms)', value: 350 },
  ];

  return (
    <div className="cube-ui-container">
      {/* Top Header Bar */}
      <header className="cube-header">
        <div className="cube-brand">
          <span className="cube-logo-badge">3×3×3</span>
          <h1 className="cube-title">Rubik's Cube Engine</h1>
          <span className="cube-phase-pill">Phase 1 Dev</span>
        </div>

        <div className="cube-header-center">
          <TimerDisplay />

          <div className="cube-stat-badge">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moveCount}</span>
          </div>

          <div className={`cube-status-pill ${isSolved ? 'status-solved' : 'status-unsolved'}`}>
            {isSolved ? (
              <>
                <CheckCircle size={14} className="status-icon" />
                <span>Solved</span>
              </>
            ) : (
              <span>In Progress</span>
            )}
          </div>
        </div>

        <div className="cube-header-right">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setShowHelp((prev) => !prev)}
            title="Keyboard Controls & Gestures Guide"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* Bottom Panel containing Controls Card and Manual Moves Strip */}
      <div className="cube-bottom-panel">
        {/* Main Actions Panel */}
        <div className="cube-controls-card">
        <div className="action-row">
          {/* Primary Gameplay Actions */}
          <div className="btn-group">
            <button
              type="button"
              className="action-btn primary-btn"
              onClick={() => scramble(scrambleLength)}
              disabled={isAnimating && automationType === 'idle'}
              title="Scramble the cube"
            >
              <Shuffle size={16} />
              <span>Scramble</span>
            </button>

            <select
              className="mini-select"
              value={scrambleLength}
              onChange={(e) => setScrambleLength(Number(e.target.value))}
              title="Scramble length (number of moves)"
            >
              <option value={15}>15 moves</option>
              <option value={20}>20 moves</option>
              <option value={25}>25 moves</option>
            </select>
          </div>

          <button
            type="button"
            className="action-btn accent-btn"
            onClick={() => solve()}
            disabled={isSolved || solverStatus === 'solving' || (isAnimating && automationType === 'idle')}
            title="Solve cube using Kociemba algorithm"
          >
            <Wand2 size={16} />
            <span>{solverStatus === 'solving' ? 'Solving...' : 'Solve'}</span>
          </button>

          <div className="btn-divider" />

          {/* History Controls */}
          <button
            type="button"
            className="action-btn secondary-btn"
            onClick={undo}
            disabled={moveHistory.length === 0 || isAnimating}
            title="Undo last move (Ctrl+Z)"
          >
            <RotateCcw size={16} />
            <span>Undo</span>
          </button>

          <button
            type="button"
            className="action-btn secondary-btn"
            onClick={redo}
            disabled={redoStack.length === 0 || isAnimating}
            title="Redo move (Ctrl+Y)"
          >
            <RotateCw size={16} />
            <span>Redo</span>
          </button>

          <button
            type="button"
            className="action-btn danger-btn"
            onClick={reset}
            title="Reset cube to solved state"
          >
            <Trash2 size={16} />
            <span>Reset</span>
          </button>

          <div className="btn-divider" />

          {/* Speed Selector */}
          <div className="speed-control">
            <Gauge size={16} className="text-muted" />
            <select
              className="mini-select"
              value={animationDuration}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              title="Animation turn speed"
            >
              {speedOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Queue Playback Controls (visible when moves are queued) */}
        {moveQueue.length > 0 && (
          <div className="queue-banner">
            <span className="queue-status">
              {automationType === 'scrambling'
                ? 'Scrambling in progress'
                : automationType === 'solving'
                ? 'Playback solution in progress'
                : 'Queued moves'}{' '}
              ({moveQueue.length} remaining)
            </span>

            <div className="queue-actions">
              {isQueuePaused ? (
                <button
                  type="button"
                  className="queue-btn play"
                  onClick={resumeQueue}
                  title="Resume move playback"
                >
                  <Play size={14} /> Resume
                </button>
              ) : (
                <button
                  type="button"
                  className="queue-btn pause"
                  onClick={pauseQueue}
                  title="Pause move playback"
                >
                  <Pause size={14} /> Pause
                </button>
              )}

              <button
                type="button"
                className="queue-btn cancel"
                onClick={cancelQueue}
                title="Cancel pending moves"
              >
                <XCircle size={14} /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Solver error alert if any */}
        {solverError && (
          <div className="solver-alert error">
            <span>{solverError}</span>
          </div>
        )}

        {/* Current move & notation info row */}
        <div className="info-bar">
          <div className="info-item">
            <span className="info-label">Last Move:</span>
            <span className="info-value font-mono">
              {lastMove ?? 'None'}
            </span>
          </div>

          {currentScramble && (
            <div className="info-item flex-grow">
              <span className="info-label">Scramble:</span>
              <span className="info-value font-mono truncate" title={currentScramble}>
                {currentScramble}
              </span>
            </div>
          )}

          {currentSolution && (
            <div className="info-item flex-grow">
              <span className="info-label">Solution:</span>
              <span className="info-value font-mono truncate text-accent" title={currentSolution}>
                {currentSolution}
              </span>
            </div>
          )}
        </div>
      </div>

        {/* Manual Face Turn Buttons Strip */}
        <div className="manual-moves-strip">
          <span className="strip-label">Manual Turns:</span>
          <div className="move-buttons-grid">
            {manualMoves.map((m) => (
              <button
                key={m}
                type="button"
                className="move-key-btn"
                onClick={() => enqueueMove(m)}
                title={`Turn ${m}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Help Modal / Overlay */}
      {showHelp && (
        <div className="help-modal-backdrop" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-header">
              <h2>Controls & Interaction Guide</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowHelp(false)}
              >
                ✕
              </button>
            </div>

            <div className="help-body">
              <section className="help-section">
                <h3>🖱️ Mouse & Touch Gestures</h3>
                <ul>
                  <li>
                    <strong>Rotate View / Camera:</strong> Click and drag anywhere on the background.
                  </li>
                  <li>
                    <strong>Turn a Face Layer:</strong> Click or touch a sticker on any face and swipe in the direction you want to turn that layer. The engine automatically detects the face normal, tangent direction, and corresponding layer.
                  </li>
                  <li>
                    <strong>Zoom:</strong> Scroll wheel or pinch gesture.
                  </li>
                </ul>
              </section>

              <section className="help-section">
                <h3>⌨️ Keyboard Shortcuts</h3>
                <div className="shortcuts-table">
                  <div className="shortcut-row">
                    <span className="kbd-badge">U / D / L / R / F / B</span>
                    <span>Clockwise 90° face turns</span>
                  </div>
                  <div className="shortcut-row">
                    <span className="kbd-badge">Shift + [Face]</span>
                    <span>Counter-clockwise (inverse) turns (U', D', etc.)</span>
                  </div>
                  <div className="shortcut-row">
                    <span className="kbd-badge">M / E / S</span>
                    <span>Middle slice turns (M=L direction, E=D direction, S=F direction)</span>
                  </div>
                  <div className="shortcut-row">
                    <span className="kbd-badge">x / y / z</span>
                    <span>Whole-cube rotations</span>
                  </div>
                  <div className="shortcut-row">
                    <span className="kbd-badge">Ctrl + Z / Ctrl + Y</span>
                    <span>Undo / Redo</span>
                  </div>
                  <div className="shortcut-row">
                    <span className="kbd-badge">Spacebar</span>
                    <span>Pause / Resume automated move playback</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
