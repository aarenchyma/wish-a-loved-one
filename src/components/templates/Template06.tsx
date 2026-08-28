'use client';

import type { TemplateProps } from './index';
import { useEffect, useRef, useState } from 'react';

interface Burst {
  id: number;
  x: number;
  y: number;
  age: number;
  maxAge: number;
  color: string;
  sparkCount: number;
  maxDistance: number;
}

interface Ambient {
  id: number;
  x: number;
  y: number;
  phase: number;
  speed: number;
  size: number;
}

const fireworkColors = ['#facc15', '#f472b6', '#60a5fa', '#c084fc', '#fb923c', '#f8fafc', '#34d399', '#f87171'];

function spawnBurst(id: number): Burst {
  const big = Math.random() < 0.6;
  return {
    id,
    x: Math.random() * 85 + 7,
    y: Math.random() * 65 + 8,
    age: 0,
    maxAge: Math.random() * 30 + (big ? 45 : 30),
    color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
    sparkCount: big ? 22 : 12,
    maxDistance: big ? 16 : 9,
  };
}

export default function Template06({ senderName, recipientName, message, mediaUrl }: TemplateProps) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [ambient, setAmbient] = useState<Ambient[]>([]);
  const animationRef = useRef<number>(0);
  const nextId = useRef(0);
  const spawnTimer = useRef(0);

  useEffect(() => {
    const initialBursts: Burst[] = [];
    for (let i = 0; i < 4; i++) {
      const b = spawnBurst(nextId.current++);
      b.age = Math.random() * b.maxAge;
      initialBursts.push(b);
    }
    setBursts(initialBursts);

    const initialAmbient: Ambient[] = [];
    for (let i = 0; i < 30; i++) {
      initialAmbient.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.025 + 0.01,
        size: Math.random() * 2.5 + 1.5,
      });
    }
    setAmbient(initialAmbient);

    const animate = () => {
      spawnTimer.current += 1;

      setBursts((prev) => {
        let next = prev.map((b) => ({ ...b, age: b.age + 1 })).filter((b) => b.age < b.maxAge);

        // fire a new burst roughly every 18 frames, keep up to 9 live at once
        if (spawnTimer.current % 18 === 0 && next.length < 9) {
          next.push(spawnBurst(nextId.current++));
        }

        return next;
      });

      setAmbient((prev) => prev.map((a) => ({ ...a, phase: a.phase + a.speed })));

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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Nunito+Sans:wght@400;500&display=swap');

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1e1b4b; }
        ::-webkit-scrollbar-thumb { background: #facc15; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #eab308; }
        * { scrollbar-width: thin; scrollbar-color: #facc15 #1e1b4b; }
      `}</style>

      <div
        className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1e1b4b 50%, #24184f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {ambient.map((a) => {
            const opacity = (Math.sin(a.phase) + 1) / 2 * 0.5 + 0.1;
            return (
              <div
                key={`amb-${a.id}`}
                className="absolute rounded-full"
                style={{
                  left: `${a.x}%`,
                  top: `${a.y}%`,
                  width: `${a.size}px`,
                  height: `${a.size}px`,
                  background: '#fefce8',
                  opacity,
                }}
              />
            );
          })}

          {bursts.map((burst) => {
            const progress = burst.age / burst.maxAge;
            const opacity = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;

            return (
              <div key={burst.id}>
                {/* central flash on ignition */}
                {progress < 0.12 && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      left: `${burst.x}%`,
                      top: `${burst.y}%`,
                      width: '10px',
                      height: '10px',
                      background: burst.color,
                      opacity: 1 - progress / 0.12,
                      boxShadow: `0 0 16px 4px ${burst.color}`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}

                {Array.from({ length: burst.sparkCount }).map((_, i) => {
                  const angle = (i / burst.sparkCount) * Math.PI * 2;
                  const distance = progress * burst.maxDistance;
                  const sx = burst.x + Math.cos(angle) * distance;
                  const sy = burst.y + Math.sin(angle) * distance + progress * progress * 6;

                  return (
                    <div
                      key={`${burst.id}-${i}`}
                      className="absolute rounded-full"
                      style={{
                        left: `${sx}%`,
                        top: `${sy}%`,
                        width: '4px',
                        height: '4px',
                        background: burst.color,
                        opacity: Math.max(0, opacity),
                        boxShadow: `0 0 6px ${burst.color}`,
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="relative max-w-lg w-full text-center space-y-7 z-10">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ color: '#facc15', fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Cheers to a new year
          </p>

          <h1
            className="text-5xl sm:text-6xl leading-tight"
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              color: '#fefce8',
              textShadow: '0 0 20px rgba(250,204,21,0.3)',
            }}
          >
            {recipientName} 🎆
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
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 400,
              color: '#e0e7ff',
            }}
          >
            {message}
          </p>

          <p
            className="text-lg pt-4"
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              color: '#facc15',
            }}
          >
            — from {senderName}
          </p>
        </div>
      </div>
    </>
  );
}