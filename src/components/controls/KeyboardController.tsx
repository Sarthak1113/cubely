import React, { useEffect } from 'react';
import { useCubeStore } from '../../store/cubeStore';
import type { StandardMoveNotation } from '../../engine/cubeMoves';

export const KeyboardController: React.FC = () => {
  const enqueueMove = useCubeStore((s) => s.enqueueMove);
  const undo = useCubeStore((s) => s.undo);
  const redo = useCubeStore((s) => s.redo);
  const isQueuePaused = useCubeStore((s) => s.isQueuePaused);
  const pauseQueue = useCubeStore((s) => s.pauseQueue);
  const resumeQueue = useCubeStore((s) => s.resumeQueue);
  const moveQueue = useCubeStore((s) => s.moveQueue);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is focused inside a text input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Handle Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      // Handle Redo: Ctrl+Y or Cmd+Y
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Spacebar toggles pause/resume of playback queue if items pending
      if (e.code === 'Space' && moveQueue.length > 0) {
        e.preventDefault();
        if (isQueuePaused) {
          resumeQueue();
        } else {
          pauseQueue();
        }
        return;
      }

      // If Ctrl/Alt/Meta is held, don't hijack other browser shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key.toLowerCase();
      const isShift = e.shiftKey;

      let move: StandardMoveNotation | null = null;

      switch (key) {
        // Faces
        case 'u':
          move = isShift ? "U'" : 'U';
          break;
        case 'd':
          move = isShift ? "D'" : 'D';
          break;
        case 'l':
          move = isShift ? "L'" : 'L';
          break;
        case 'r':
          move = isShift ? "R'" : 'R';
          break;
        case 'f':
          move = isShift ? "F'" : 'F';
          break;
        case 'b':
          move = isShift ? "B'" : 'B';
          break;

        // Middle Slices
        case 'm':
          move = isShift ? "M'" : 'M';
          break;
        case 'e':
          move = isShift ? "E'" : 'E';
          break;
        case 's':
          move = isShift ? "S'" : 'S';
          break;

        // Cube Rotations
        case 'x':
          move = isShift ? "x'" : 'x';
          break;
        case 'y':
          move = isShift ? "y'" : 'y';
          break;
        case 'z':
          move = isShift ? "z'" : 'z';
          break;
      }

      if (move) {
        e.preventDefault();
        enqueueMove(move);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enqueueMove,
    undo,
    redo,
    isQueuePaused,
    pauseQueue,
    resumeQueue,
    moveQueue.length,
  ]);

  return null;
};
