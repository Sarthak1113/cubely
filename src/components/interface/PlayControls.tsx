import React, { useState, useEffect, useRef } from 'react';
import {
  Shuffle,
  Wand2,
  RotateCcw,
  RotateCw,
  Trash2,
  Play,
  Pause,
  XCircle,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useCubeStore } from '../../store/cubeStore';

export const PlayControls: React.FC = () => {
  const isSolved = useCubeStore((s) => s.isSolved);
  const moveCount = useCubeStore((s) => s.moveCount);
  const timerElapsedTime = useCubeStore((s) => s.timerElapsedTime);
  const timerStatus = useCubeStore((s) => s.timerStatus);
  const timerStartTime = useCubeStore((s) => s.timerStartTime);

  const moveQueue = useCubeStore((s) => s.moveQueue);
  const isAnimating = useCubeStore((s) => s.isAnimating);
  const isQueuePaused = useCubeStore((s) => s.isQueuePaused);
  const automationType = useCubeStore((s) => s.automationType);

  const moveHistory = useCubeStore((s) => s.moveHistory);
  const redoStack = useCubeStore((s) => s.redoStack);
  const solverStatus = useCubeStore((s) => s.solverStatus);

  const isFocusMode = useCubeStore((s) => s.isFocusMode);

  const scramble = useCubeStore((s) => s.scramble);
  const solve = useCubeStore((s) => s.solve);
  const undo = useCubeStore((s) => s.undo);
  const redo = useCubeStore((s) => s.redo);
  const reset = useCubeStore((s) => s.reset);
  const pauseQueue = useCubeStore((s) => s.pauseQueue);
  const resumeQueue = useCubeStore((s) => s.resumeQueue);
  const cancelQueue = useCubeStore((s) => s.cancelQueue);

  const [scrambleLength, setScrambleLength] = useState(20);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close scramble dropdown on outside click or Esc
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Live timer tick calculation
  const [runningMs, setRunningMs] = useState(0);
  useEffect(() => {
    if (timerStatus !== 'running' || timerStartTime === null) return;
    let animId: number;
    const loop = () => {
      setRunningMs(performance.now() - timerStartTime);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [timerStatus, timerStartTime]);

  const displayMs = timerStatus === 'running' ? runningMs : timerElapsedTime;
  const formatTime = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(m)}:${pad(s)}`;
  };

  if (isFocusMode) {
    return (
      <div className="focus-mode-indicator">
        <span className="dot pulse" />
        <span>Focus Mode Active</span>
      </div>
    );
  }

  return (
    <div className="cubely-controls-wrapper">
      {/* Active Queue Status Banner */}
      {moveQueue.length > 0 && (
        <div className="queue-pill-banner">
          <span className="queue-pill-text">
            {automationType === 'scrambling'
              ? 'Scrambling'
              : automationType === 'solving'
              ? 'Solving sequence'
              : 'Streaming moves'}{' '}
            ({moveQueue.length} remaining)
          </span>

          <div className="queue-pill-buttons">
            {isQueuePaused ? (
              <button
                type="button"
                className="queue-action-pill resume"
                onClick={resumeQueue}
                title="Resume playback"
              >
                <Play size={12} /> Resume
              </button>
            ) : (
              <button
                type="button"
                className="queue-action-pill pause"
                onClick={pauseQueue}
                title="Pause playback"
              >
                <Pause size={12} /> Pause
              </button>
            )}

            <button
              type="button"
              className="queue-action-pill cancel"
              onClick={cancelQueue}
              title="Cancel sequence"
            >
              <XCircle size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Pill Dock */}
      <div className="cubely-dock">
        {/* Editorial Stats Segment */}
        <div className="dock-stat-segment">
          <div className="dock-stat-item">
            <span className="dock-stat-label">MOVES</span>
            <span className="dock-stat-val font-mono">{moveCount}</span>
          </div>

          <div className="dock-stat-divider" />

          <div className="dock-stat-item">
            <span className="dock-stat-label">TIME</span>
            <span className="dock-stat-val font-mono">{formatTime(displayMs)}</span>
          </div>
        </div>

        <div className="dock-vertical-divider" />

        {/* Primary Action: Scramble */}
        {/* Primary Action: Scramble with Custom Animated Dropdown */}
        <div className="pill-action-group" ref={dropdownRef}>
          <button
            type="button"
            className="cubely-pill-btn hero-scramble-btn"
            onClick={() => scramble(scrambleLength)}
            disabled={isAnimating && automationType === 'idle'}
            title={`Scramble the cube (${scrambleLength} moves)`}
          >
            <Shuffle size={15} />
            <span>Scramble</span>
          </button>

          <button
            type="button"
            className={`dock-custom-dropdown-btn ${isDropdownOpen ? 'open' : ''}`}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            title="Choose scramble length"
          >
            <span className="scramble-len-val font-mono">{scrambleLength}</span>
            <ChevronDown size={12} className={`dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="scramble-animated-menu" role="listbox">
              {[
                { len: 15, label: '15 moves', sub: 'Warmup' },
                { len: 20, label: '20 moves', sub: 'Standard' },
                { len: 25, label: '25 moves', sub: 'Complex' },
              ].map((opt) => {
                const isSelected = scrambleLength === opt.len;
                return (
                  <button
                    key={opt.len}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`scramble-menu-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setScrambleLength(opt.len);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="menu-item-text">
                      <span className="menu-item-len font-mono">{opt.len}</span>
                      <span className="menu-item-sub">{opt.sub}</span>
                    </div>
                    {isSelected && <Check size={13} className="menu-item-check" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Secondary Action: Solve */}
        <button
          type="button"
          className="cubely-pill-btn solve-btn"
          onClick={() => solve()}
          disabled={isSolved || solverStatus === 'solving' || (isAnimating && automationType === 'idle')}
          title="Solve using Kociemba algorithm"
        >
          <Wand2 size={15} />
          <span>{solverStatus === 'solving' ? 'Solving...' : 'Solve'}</span>
        </button>

        <div className="dock-vertical-divider" />

        {/* Undo / Redo */}
        <button
          type="button"
          className="cubely-pill-btn secondary-pill"
          onClick={undo}
          disabled={moveHistory.length === 0 || isAnimating}
          title="Undo last move (Ctrl+Z)"
        >
          <RotateCcw size={15} />
          <span className="btn-label-desktop">Undo</span>
        </button>

        {redoStack.length > 0 && (
          <button
            type="button"
            className="cubely-pill-btn secondary-pill"
            onClick={redo}
            disabled={isAnimating}
            title="Redo move (Ctrl+Y)"
          >
            <RotateCw size={15} />
            <span className="btn-label-desktop">Redo</span>
          </button>
        )}

        {/* Reset */}
        <button
          type="button"
          className="cubely-pill-btn secondary-pill reset-btn"
          onClick={reset}
          title="Reset cube to solved state"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};
