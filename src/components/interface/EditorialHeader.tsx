import React from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  Keyboard,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useCubeStore } from '../../store/cubeStore';

export const EditorialHeader: React.FC = () => {
  const isSoundEnabled = useCubeStore((s) => s.isSoundEnabled);
  const toggleSound = useCubeStore((s) => s.toggleSound);
  const isFocusMode = useCubeStore((s) => s.isFocusMode);
  const toggleFocusMode = useCubeStore((s) => s.toggleFocusMode);
  const setShowSettingsModal = useCubeStore((s) => s.setShowSettingsModal);
  const setShowHowToPlay = useCubeStore((s) => s.setShowHowToPlay);
  const scramble = useCubeStore((s) => s.scramble);
  const showToast = useCubeStore((s) => s.showToast);

  const handleRandomChallenge = () => {
    const lengths = [15, 20, 25];
    const len = lengths[Math.floor(Math.random() * lengths.length)];
    scramble(len);
    showToast(`Challenge started! ${len}-move scramble.`);
  };

  return (
    <header className={`cubely-header ${isFocusMode ? 'focus-mode-header' : ''}`}>
      {/* Left: Brand */}
      <div className="cubely-brand">
        <div className="cubely-logo-mark" aria-hidden="true">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="dot blue" />
        </div>
        <div className="cubely-brand-text">
          <span className="cubely-wordmark">CUBELY</span>
        </div>
      </div>

      {/* Right: Controls Strip */}
      <div className="cubely-header-actions">
        {/* Random challenge shortcut */}
        <button
          type="button"
          className="cubely-ghost-btn"
          onClick={handleRandomChallenge}
          title="Start a random challenge"
        >
          <Sparkles size={15} />
          <span className="btn-label-desktop">Challenge</span>
        </button>

        {/* Sound toggle */}
        <button
          type="button"
          className={`cubely-ghost-btn ${isSoundEnabled ? 'active' : ''}`}
          onClick={toggleSound}
          title={isSoundEnabled ? 'Mute sound' : 'Enable tactile sound effects'}
        >
          {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Personalisation popover trigger */}
        <button
          type="button"
          className="cubely-ghost-btn"
          onClick={() => setShowSettingsModal(true)}
          title="Customise colours, themes & preferences"
        >
          <Sliders size={16} />
          <span className="btn-label-desktop">Customise</span>
        </button>

        {/* Focus mode toggle (Visibility icon) */}
        <button
          type="button"
          className={`cubely-ghost-btn ${isFocusMode ? 'active' : ''}`}
          onClick={toggleFocusMode}
          title={isFocusMode ? 'Exit Focus Mode' : 'Focus Mode (hide controls)'}
        >
          {isFocusMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        {/* Keyboard shortcuts shortcut button on right side of visibility icon */}
        <button
          type="button"
          className="cubely-ghost-btn"
          onClick={() => setShowHowToPlay(true)}
          title="Keyboard shortcuts & controls"
        >
          <Keyboard size={16} />
          <span className="btn-label-desktop">Shortcuts</span>
        </button>
      </div>
    </header>
  );
};
