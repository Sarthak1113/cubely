import React from 'react';
import { X, MousePointer, Hand, Keyboard, BookOpen, Compass } from 'lucide-react';
import { useCubeStore } from '../../store/cubeStore';

export const HowToPlayModal: React.FC = () => {
  const showHowToPlay = useCubeStore((s) => s.showHowToPlay);
  const setShowHowToPlay = useCubeStore((s) => s.setShowHowToPlay);

  if (!showHowToPlay) return null;

  return (
    <div
      className="cubely-backdrop"
      onClick={() => setShowHowToPlay(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="cubely-modal how-to-play-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cubely-modal-header">
          <div className="cubely-modal-title-group">
            <Compass size={18} className="text-accent" />
            <h2 className="cubely-modal-title">How to Play & Interact</h2>
          </div>
          <button
            type="button"
            className="cubely-icon-btn"
            onClick={() => setShowHowToPlay(false)}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="cubely-modal-content">
          {/* Interaction Methods */}
          <div className="guide-grid">
            <div className="guide-card">
              <div className="guide-card-icon">
                <MousePointer size={20} />
              </div>
              <h3>Mouse</h3>
              <p>
                <strong>Orbit:</strong> Click and drag on the background to rotate your view around the cube.
              </p>
              <p>
                <strong>Layer Turn:</strong> Click directly on any sticker and swipe horizontally or vertically. Cubely calculates the face normal and screen projection to twist that exact layer.
              </p>
            </div>

            <div className="guide-card">
              <div className="guide-card-icon">
                <Hand size={20} />
              </div>
              <h3>Touch</h3>
              <p>
                <strong>Swipe on Background:</strong> Smooth 360° touch orbiting.
              </p>
              <p>
                <strong>Swipe on Cube:</strong> Swipe across any face to rotate that slice. Page scrolling is locked during cube interaction.
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <section className="cubely-settings-group">
            <div className="settings-group-header">
              <Keyboard size={16} />
              <label>Keyboard Shortcuts</label>
            </div>
            <p className="settings-group-desc">
              Standard WCA speedcube controls. Inputs are automatically suppressed when typing in forms.
            </p>

            <div className="shortcuts-grid">
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>U</kbd> <kbd>D</kbd> <kbd>L</kbd> <kbd>R</kbd> <kbd>F</kbd> <kbd>B</kbd>
                </div>
                <span>Clockwise 90° face turns</span>
              </div>

              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Shift</kbd> + <kbd>Key</kbd>
                </div>
                <span>Inverse counter-clockwise turns (U', D', etc.)</span>
              </div>

              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>M</kbd> <kbd>E</kbd> <kbd>S</kbd>
                </div>
                <span>Middle slice moves</span>
              </div>

              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>x</kbd> <kbd>y</kbd> <kbd>z</kbd>
                </div>
                <span>Whole-cube rotations</span>
              </div>

              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Y</kbd>
                </div>
                <span>Undo / Redo previous moves</span>
              </div>

              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Space</kbd>
                </div>
                <span>Pause / Resume automated move playback</span>
              </div>
            </div>
          </section>

          {/* Notation Guide */}
          <section className="cubely-settings-group">
            <div className="settings-group-header">
              <BookOpen size={16} />
              <label>Standard Cube Notation</label>
            </div>
            <div className="notation-legend">
              <div className="notation-pill"><strong>U</strong> = Up (White)</div>
              <div className="notation-pill"><strong>D</strong> = Down (Yellow)</div>
              <div className="notation-pill"><strong>L</strong> = Left (Orange)</div>
              <div className="notation-pill"><strong>R</strong> = Right (Red)</div>
              <div className="notation-pill"><strong>F</strong> = Front (Green)</div>
              <div className="notation-pill"><strong>B</strong> = Back (Blue)</div>
            </div>
            <p className="settings-group-desc" style={{ marginTop: 8 }}>
              An apostrophe (e.g. <code>R'</code>) denotes counter-clockwise. The number <code>2</code> (e.g. <code>U2</code>) denotes a 180° turn.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
