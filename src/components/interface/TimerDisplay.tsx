import React, { useEffect, useState } from 'react';
import { useCubeStore } from '../../store/cubeStore';

export const TimerDisplay: React.FC = () => {
  const timerStatus = useCubeStore((s) => s.timerStatus);
  const timerStartTime = useCubeStore((s) => s.timerStartTime);
  const timerElapsedTime = useCubeStore((s) => s.timerElapsedTime);
  const updateTimerElapsed = useCubeStore((s) => s.updateTimerElapsed);
  const startTimer = useCubeStore((s) => s.startTimer);
  const stopTimer = useCubeStore((s) => s.stopTimer);
  const resetTimer = useCubeStore((s) => s.resetTimer);

  const [runningElapsed, setRunningElapsed] = useState(0);

  useEffect(() => {
    if (timerStatus !== 'running' || timerStartTime === null) {
      return;
    }

    let animId: number;
    const loop = () => {
      const now = performance.now();
      const elapsed = now - timerStartTime;
      setRunningElapsed(elapsed);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [timerStatus, timerStartTime]);

  // When paused or solved, sync back final elapsed time
  useEffect(() => {
    if ((timerStatus === 'paused' || timerStatus === 'solved') && runningElapsed > 0) {
      updateTimerElapsed(runningElapsed);
    }
  }, [timerStatus, runningElapsed, updateTimerElapsed]);

  const displayMs = timerStatus === 'running' ? runningElapsed : timerElapsedTime;

  const formatTime = (totalMs: number): string => {
    const totalSeconds = Math.floor(totalMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((totalMs % 1000) / 10);

    const pad = (n: number, z = 2) => String(n).padStart(z, '0');
    if (minutes > 0) {
      return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
    }
    return `${pad(seconds)}.${pad(centiseconds)}`;
  };

  return (
    <div className="timer-badge">
      <div className="timer-info">
        <span className="stat-label">Timer</span>
        <span
          className={`stat-value font-mono ${
            timerStatus === 'solved'
              ? 'text-solved'
              : timerStatus === 'running'
              ? 'text-running'
              : ''
          }`}
        >
          {formatTime(displayMs)}
        </span>
      </div>

      <div className="timer-actions">
        {timerStatus === 'running' ? (
          <button
            type="button"
            onClick={stopTimer}
            className="timer-mini-btn"
            title="Pause timer"
          >
            Pause
          </button>
        ) : timerStatus === 'paused' ? (
          <button
            type="button"
            onClick={startTimer}
            className="timer-mini-btn"
            title="Resume timer"
          >
            Resume
          </button>
        ) : null}

        {displayMs > 0 && timerStatus !== 'running' && (
          <button
            type="button"
            onClick={() => {
              setRunningElapsed(0);
              resetTimer();
            }}
            className="timer-mini-btn text-muted"
            title="Reset timer"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
