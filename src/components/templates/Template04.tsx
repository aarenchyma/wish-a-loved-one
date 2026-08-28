'use client';

import type { TemplateProps } from './index';
import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'cap' | 'ribbon';
  color: string;
}

const GRAVITY = 0.012;
const ribbonColors = ['#facc15', '#1e3a8a', '#eab308', '#312e81'];

function spawnParticle(id: number): Particle {
  const fromLeft = Math.random() < 0.5;
  const isCap = Math.random() < 0.3;

  return {
    id,
    x: fromLeft ? -5 : 105,
    y: 105,
    vx: (fromLeft ? 1 : -1) * (Math.random() * 0.7 + 0.5),
    vy: -(Math.random() * 1.6 + 1.4),
    size: isCap ? Math.random() * 12 + 22 : Math.random() * 6 + 8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 6,
    type: isCap ? 'cap' : 'ribbon',
    color: ribbonColors[Math.floor(Math.random() * ribbonColors.length)],
  };
}

export default function Template04({ senderName, recipientName, message, mediaUrl }: TemplateProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const nextId = useRef(0);
  const spawnTimer = useRef(0);

  useEffect(() => {
    const initial: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      const p = spawnParticle(nextId.current++);
      p.y = Math.random() * 100;
      initial.push(p);
    }
    setParticles(initial);

    const animate = () => {
      spawnTimer.current += 1;

      setParticles((prev) => {
        let next = prev.map((p) => {
          const newVy = p.vy + GRAVITY;
          const newY = p.y + newVy;
          const newX = p.x + p.vx;
          return { ...p, y: newY, x: newX, vy: newVy, rotation: p.rotation + p.rotationSpeed };
        });

        next = next.filter((p) => p.y < 130 && p.x > -15 && p.x < 115);

        if (spawnTimer.current % 8 === 0 && next.length < 35) {
          next.push(spawnParticle(nextId.current++));
        }

        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Libre+Baskerville:ital,wght@0,400;1,400&display=swap');

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #dbeafe; }
        ::-webkit-scrollbar-thumb { background: #1e3a8a; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #172554; }
        * { scrollbar-width: thin; scrollbar-color: #1e3a8a #dbeafe; }
      `}</style>

      <div
        className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 55%, #1e1b4b 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) =>
            p.type === 'cap' ? (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  fontSize: `${p.size}px`,
                  transform: `rotate(${p.rotation}deg)`,
                  opacity: 0.9,
                }}
              >
                🎓
              </div>
            ) : (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 3}px`,
                  background: p.color,
                  transform: `rotate(${p.rotation}deg)`,
                  borderRadius: '2px',
                  opacity: 0.75,
                }}
              />
            )
          )}
        </div>

        <div className="relative max-w-lg w-full text-center space-y-7 z-10">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ color: '#fde047', fontFamily: "'Poppins', sans-serif" }}
          >
            Congratulations, grad
          </p>

          <h1
            className="text-5xl sm:text-6xl leading-tight"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              color: '#fefce8',
              textShadow: '0 2px 14px rgba(0,0,0,0.35)',
            }}
          >
            {recipientName} 🎓
          </h1>

          {mediaUrl && (
            <video
              src={mediaUrl}
              controls
              playsInline
              className="w-full rounded-2xl shadow-lg"
            />
          )}

          <p
            className="text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap px-2"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#e0e7ff',
            }}
          >
            {message}
          </p>

          <p
            className="text-lg pt-4"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: '#fde047',
            }}
          >
            — from {senderName}
          </p>
        </div>
      </div>
    </>
  );
}