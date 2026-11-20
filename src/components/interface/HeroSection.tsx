import React from 'react';
import { useCubeStore } from '../../store/cubeStore';

export const HeroSection: React.FC = () => {
  const isFocusMode = useCubeStore((s) => s.isFocusMode);

  return (
    <div className={`cubely-hero ${isFocusMode ? 'hero-hidden' : ''}`}>
      <h1 className="cubely-headline">
        A little cube. <br />
        <em>A lot of fun.</em>
      </h1>
      <p className="cubely-subcopy">
        Twist it. Turn it. Scramble it. Make it yours.
      </p>
    </div>
  );
};
