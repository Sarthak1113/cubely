import React from 'react';
import { X, Sliders, Palette, Sun, Check } from 'lucide-react';
import { useCubeStore } from '../../store/cubeStore';
import {
  BACKGROUND_THEMES,
  CUBE_PALETTES,
  type PaletteId,
  type ThemeId,
} from '../../engine/cubePalettes';

export const SettingsModal: React.FC = () => {
  const showSettingsModal = useCubeStore((s) => s.showSettingsModal);
  const setShowSettingsModal = useCubeStore((s) => s.setShowSettingsModal);

  const activePalette = useCubeStore((s) => s.activePalette);
  const setPalette = useCubeStore((s) => s.setPalette);

  const activeTheme = useCubeStore((s) => s.activeTheme);
  const setTheme = useCubeStore((s) => s.setTheme);

  const isSoundEnabled = useCubeStore((s) => s.isSoundEnabled);
  const toggleSound = useCubeStore((s) => s.toggleSound);

  const isIdleAnimationEnabled = useCubeStore((s) => s.isIdleAnimationEnabled);
  const toggleIdleAnimation = useCubeStore((s) => s.toggleIdleAnimation);

  const cubeScale = useCubeStore((s) => s.cubeScale);
  const setCubeScale = useCubeStore((s) => s.setCubeScale);

  if (!showSettingsModal) return null;

  const palettes = Object.values(CUBE_PALETTES);
  const themes = Object.values(BACKGROUND_THEMES);

  return (
    <div
      className="cubely-backdrop"
      onClick={() => setShowSettingsModal(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="cubely-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cubely-modal-header">
          <div className="cubely-modal-title-group">
            <Sliders size={18} className="text-accent" />
            <h2 className="cubely-modal-title">Personalisation</h2>
          </div>
          <button
            type="button"
            className="cubely-icon-btn"
            onClick={() => setShowSettingsModal(false)}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="cubely-modal-content">
          {/* Cube Sticker Palettes */}
          <section className="cubely-settings-group">
            <div className="settings-group-header">
              <Palette size={15} />
              <label>Cube Colour Palette</label>
            </div>
            <p className="settings-group-desc">
              Curated sticker shades. Does not alter the underlying puzzle mechanics.
            </p>

            <div className="palette-grid">
              {palettes.map((p) => {
                const isSelected = activePalette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`palette-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setPalette(p.id as PaletteId)}
                  >
                    <div className="palette-card-top">
                      <span className="palette-name">{p.name}</span>
                      {isSelected && <Check size={14} className="palette-check" />}
                    </div>

                    <div className="palette-swatches">
                      <span style={{ backgroundColor: p.colors.white }} />
                      <span style={{ backgroundColor: p.colors.yellow }} />
                      <span style={{ backgroundColor: p.colors.green }} />
                      <span style={{ backgroundColor: p.colors.blue }} />
                      <span style={{ backgroundColor: p.colors.red }} />
                      <span style={{ backgroundColor: p.colors.orange }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Background Canvas Themes */}
          <section className="cubely-settings-group">
            <div className="settings-group-header">
              <Sun size={15} />
              <label>Canvas Environment</label>
            </div>

            <div className="theme-chips-row">
              {themes.map((th) => {
                const isSelected = activeTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    className={`theme-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setTheme(th.id as ThemeId)}
                  >
                    <span
                      className="theme-chip-dot"
                      style={{ background: th.bg, border: `1px solid ${th.border}` }}
                    />
                    <span>{th.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sound, Floating & Sizing */}
          <section className="cubely-settings-group">
            <div className="toggle-row">
              <div className="toggle-text">
                <span className="toggle-label">Tactile Sound FX</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isSoundEnabled}
                className={`cubely-toggle-switch ${isSoundEnabled ? 'checked' : ''}`}
                onClick={toggleSound}
                title={isSoundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                <span className="toggle-switch-track">
                  <span className="toggle-switch-thumb" />
                </span>
                <span className="toggle-switch-label">{isSoundEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>

            <div className="toggle-row">
              <div className="toggle-text">
                <span className="toggle-label">Idle Floating Motion</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isIdleAnimationEnabled}
                className={`cubely-toggle-switch ${isIdleAnimationEnabled ? 'checked' : ''}`}
                onClick={toggleIdleAnimation}
                title={isIdleAnimationEnabled ? 'Disable idle motion' : 'Enable idle motion'}
              >
                <span className="toggle-switch-track">
                  <span className="toggle-switch-thumb" />
                </span>
                <span className="toggle-switch-label">{isIdleAnimationEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>

            <div className="slider-row">
              <div className="slider-text">
                <span className="toggle-label">Cube Size</span>
                <span className="toggle-desc">{Math.round(cubeScale * 100)}% scale</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={cubeScale}
                onChange={(e) => setCubeScale(parseFloat(e.target.value))}
                className="cubely-range"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
