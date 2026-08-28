'use client';

import type { TemplateProps } from './index';
import { useEffect, useRef, useState } from 'react';

interface Confetti {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swayOffset: number;
  swaySpeed: number;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  speed: number;
  swayOffset: number;
}

export default function Template02({ senderName, recipientName, message, mediaUrl }: TemplateProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const animationRef = useRef<number>(0);
  const frameRef = useRef(0);

  const confettiColors = ['#fbbf24', '#f472b6', '#60a5fa', '#a78bfa', '#34d399', '#fb923c'];
  const balloonEmojis = ['🎈', '🎉', '🎂', '🎁', '✨'];

  useEffect(() => {
    const initialConfetti: Confetti[] = [];
    for (let i = 0; i < 50; i++) {
      initialConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 120 - 20,
        size: Math.random() * 8 + 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        fallSpeed: Math.random() * 0.5 + 0.3,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01,
      });
    }
    setConfetti(initialConfetti);

    const initialBalloons: Balloon[] = [];
    for (let i = 0; i < 12; i++) {
      initialBalloons.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 120 + 20,
        size: Math.random() * 24 + 28,
        emoji: balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)],
        speed: Math.random() * 0.25 + 0.1,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }
    setBalloons(initialBalloons);

    const animate = () => {
      frameRef.current += 1;
      const t = frameRef.current;

      setConfetti((prev) =>
        prev.map((c) => {
          let newY = c.y + c.fallSpeed;
          if (newY > 110) newY = -10;
          return {
            ...c,
            y: newY,
            rotation: c.rotation + c.rotationSpeed,
          };
        })
      );

      setBalloons((prev) =>
        prev.map((b) => {
          let newY = b.y - b.speed;
          if (newY < -15) newY = 115;
          return { ...b, y: newY };
        })
      );

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
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600&display=swap');

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fef3c7; }
        ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #d97706; }
        * { scrollbar-width: thin; scrollbar-color: #f59e0b #fef3c7; }
      `}</style>

      <div
        className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fbcfe8 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {balloons.map((b) => (
            <div
              key={`b-${b.id}`}
              className="absolute"
              style={{
                left: `calc(${b.x}% + ${Math.sin(b.y * 0.05 + b.swayOffset) * 15}px)`,
                top: `${b.y}%`,
                fontSize: `${b.size}px`,
                opacity: 0.85,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))',
              }}
            >
              {b.emoji}
            </div>
          ))}

          {confetti.map((c) => (
            <div
              key={`c-${c.id}`}
              className="absolute"
              style={{
                left: `calc(${c.x}% + ${Math.sin(c.y * 0.08 + c.swayOffset) * 12}px)`,
                top: `${c.y}%`,
                width: `${c.size}px`,
                height: `${c.size * 0.4}px`,
                background: c.color,
                transform: `rotate(${c.rotation}deg)`,
                borderRadius: '1px',
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-lg w-full text-center space-y-7 z-10">
          <p
            className="text-xs uppercase tracking-[0.25em] font-semibold"
            style={{ color: '#c2410c', fontFamily: "'Quicksand', sans-serif" }}
          >
            A birthday wish for you
          </p>

          <h1
            className="text-5xl sm:text-6xl leading-tight"
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 800,
              color: '#9a3412',
              textShadow: '0 2px 10px rgba(255,255,255,0.6)',
            }}
          >
            {recipientName} 🎂
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
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 500,
              color: '#5c2c0c',
            }}
          >
            {message}
          </p>

          <p
            className="text-lg pt-4"
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              color: '#9a3412',
            }}
          >
            — from {senderName}
          </p>
        </div>
      </div>
    </>
  );
}