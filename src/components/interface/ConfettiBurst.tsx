import React, { useEffect, useRef } from 'react';
import { useCubeStore } from '../../store/cubeStore';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
}

const FESTIVE_COLORS = [
  '#22C55E', // emerald
  '#10B981', // mint
  '#F59E0B', // amber
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#3B82F6', // sky
  '#06B6D4', // cyan
  '#EF4444', // coral red
  '#F97316', // orange
];

export const ConfettiBurst: React.FC = () => {
  const celebrationActive = useCubeStore((s) => s.celebrationActive);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!celebrationActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Spawn 85 confetti particles exploding from the top center
    const originX = width / 2;
    const originY = 90; // Just below celebration banner
    const particles: Particle[] = [];

    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 0.15) + Math.random() * (Math.PI * 0.7); // spread downward and outward
      const speed = 4 + Math.random() * 9;
      const color = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];

      particles.push({
        x: originX + (Math.random() - 0.5) * 120,
        y: originY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1) * (speed * 0.8),
        vy: -speed * 0.4 + Math.random() * 3, // slight upward pop then down
        width: 6 + Math.random() * 6,
        height: 10 + Math.random() * 8,
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
        opacity: 1,
      });
    }

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;

      for (const p of particles) {
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // gravity
        p.vx *= 0.985; // air drag
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Fade out as it falls or after 2.2s
        if (elapsed > 2000) {
          p.opacity = Math.max(0, p.opacity - 0.015);
        }

        if (p.opacity > 0 && p.y < height + 50) {
          aliveCount++;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(Math.cos(p.wobble), 1);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          // Draw fluttering rectangle ribbon
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.restore();
        }
      }

      if (aliveCount > 0 && elapsed < 4500) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [celebrationActive]);

  if (!celebrationActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="celebration-confetti-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 49,
      }}
    />
  );
};
