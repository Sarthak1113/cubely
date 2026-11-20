import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { RubiksCube } from './components/cube/RubiksCube';
import { useCubeGestures } from './hooks/useCubeGestures';
import { KeyboardController } from './components/controls/KeyboardController';
import { EditorialHeader } from './components/interface/EditorialHeader';
import { HeroSection } from './components/interface/HeroSection';
import { PlayControls } from './components/interface/PlayControls';
import { SettingsModal } from './components/interface/SettingsModal';
import { HowToPlayModal } from './components/interface/HowToPlayModal';
import { CelebrationBanner } from './components/interface/CelebrationBanner';
import { ConfettiBurst } from './components/interface/ConfettiBurst';
import { ToastNotification } from './components/interface/ToastNotification';
import { MobileDesktopNotice } from './components/interface/MobileDesktopNotice';
import { useCubeStore } from './store/cubeStore';
import { BACKGROUND_THEMES } from './engine/cubePalettes';

function CubeScene() {
  const { gl } = useThree();
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const gestureControls = useCubeGestures(setOrbitEnabled);
  const activeTheme = useCubeStore((s) => s.activeTheme);
  const theme = BACKGROUND_THEMES[activeTheme] ?? BACKGROUND_THEMES['warm-light'];

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return (
    <>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={theme.isDark ? 0.75 : 0.95} />
      <directionalLight
        position={[7, 12, 9]}
        intensity={theme.isDark ? 1.6 : 1.45}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-8, -5, -6]} intensity={0.45} />
      <directionalLight position={[-4, 8, -8]} intensity={0.55} />

      {/* 3D Rubiks Cube with tactile gestures & gentle idle floating */}
      <RubiksCube gestureControls={gestureControls} />

      {/* Soft Ground Contact Shadow */}
      <ContactShadows
        position={[0, -2.15, 0]}
        opacity={theme.isDark ? 0.65 : theme.isGradient ? 0.3 : 0.22}
        scale={8.5}
        blur={2.8}
        far={5}
        color={theme.isDark ? '#000000' : '#1e1c18'}
      />

      <OrbitControls
        enabled={orbitEnabled}
        enablePan={false}
        minDistance={3.5}
        maxDistance={14}
        dampingFactor={0.08}
      />
    </>
  );
}

export const App: React.FC = () => {
  const activeTheme = useCubeStore((s) => s.activeTheme);
  const theme = BACKGROUND_THEMES[activeTheme] ?? BACKGROUND_THEMES['warm-light'];

  return (
    <main
      className={`app-container ${theme.isGradient ? 'live-gradient-theme' : ''}`}
      data-theme={activeTheme}
      style={{
        '--theme-bg': theme.isGradient ? 'transparent' : theme.bg,
        '--theme-text': theme.text,
        '--theme-text-secondary': theme.textSecondary,
        '--theme-border': theme.border,
        '--theme-card-bg': theme.cardBg,
        '--theme-pill-bg': theme.pillBg,
        backgroundColor: theme.isGradient ? 'transparent' : theme.bg,
        color: theme.text,
      } as React.CSSProperties}
    >
      <KeyboardController />
      <ToastNotification />
      <CelebrationBanner />
      <ConfettiBurst />
      <SettingsModal />
      <HowToPlayModal />

      {/* 3D WebGL Canvas Layer */}
      <div className="canvas-wrapper">
        <Canvas
          camera={{ position: [5.0, 4.2, 6.2], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <CubeScene />
        </Canvas>
      </div>

      {/* Modern Editorial UI Overlay */}
      <div className="cubely-ui-overlay">
        <EditorialHeader />
        <HeroSection />
        <PlayControls />
        <MobileDesktopNotice />
      </div>
    </main>
  );
};

export default App;
