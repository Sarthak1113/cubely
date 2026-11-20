import React from 'react';
import { Sparkles, X, Share2 } from 'lucide-react';
import { useCubeStore } from '../../store/cubeStore';

export const CelebrationBanner: React.FC = () => {
  const celebrationActive = useCubeStore((s) => s.celebrationActive);
  const dismissCelebration = useCubeStore((s) => s.dismissCelebration);
  const moveCount = useCubeStore((s) => s.moveCount);
  const timerElapsedTime = useCubeStore((s) => s.timerElapsedTime);
  const showToast = useCubeStore((s) => s.showToast);

  if (!celebrationActive) return null;

  const formatTime = (totalMs: number): string => {
    const totalSeconds = Math.floor(totalMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((totalMs % 1000) / 10);
    const pad = (n: number) => String(n).padStart(2, '0');
    if (minutes > 0) {
      return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
    }
    return `${pad(seconds)}.${pad(centiseconds)}s`;
  };

  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'CUBELY',
          text: `I just solved the cube in ${moveCount} moves and ${formatTime(timerElapsedTime)} on Cubely!`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(
          `I just solved the cube in ${moveCount} moves and ${formatTime(timerElapsedTime)} on Cubely! Try it: ${window.location.href}`
        );
        showToast('Result copied to clipboard!');
      }
    } catch {
      showToast('Result copied to clipboard!');
    }
  };

  return (
    <div className="celebration-floater">
      <div className="celebration-card">
        <div className="celebration-badge">
          <Sparkles size={16} className="text-amber" />
        </div>

        <div className="celebration-text">
          <h4 className="celebration-heading">Beautifully done!</h4>
          <p className="celebration-sub">
            Solved in <strong className="font-mono">{moveCount}</strong> moves
            {timerElapsedTime > 0 ? (
              <>
                {' '}
                · <strong className="font-mono">{formatTime(timerElapsedTime)}</strong>
              </>
            ) : null}
          </p>
        </div>

        <div className="celebration-actions">
          <button
            type="button"
            className="celebration-btn"
            onClick={handleShare}
            title="Share result"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>

          <button
            type="button"
            className="celebration-close"
            onClick={dismissCelebration}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
