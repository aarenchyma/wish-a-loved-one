'use client';

import type { TemplateProps } from './index';
import { useEffect, useRef, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
}

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swayOffset: number;
}

export default function Template03({ senderName, recipientName, message, mediaUrl }: TemplateProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [petals, setPetals] = useState<Petal[]>([]);
  const animationRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const initialSparkles: Sparkle[] = [];
    for (let i = 0; i < 35; i++) {
      initialSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.015,
      });
    }
    setSparkles(initialSparkles);

    const initialPetals: Petal[] = [];
    for (let i = 0; i < 18; i++) {
      initialPetals.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 120 - 20,
        size: Math.random() * 14 + 12,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        fallSpeed: Math.random() * 0.2 + 0.1,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }
    setPetals(initialPetals);

    const animate = () => {
      frameRef.current += 1;

      setSparkles((prev) =>
        prev.map((s) => ({ ...s, phase: s.phase + s.speed }))
      );

      setPetals((prev) =>
        prev.map((p) => {
          let newY = p.y + p.fallSpeed;
          if (newY > 110) newY = -10;
          return { ...p, y: newY, rotation: p.rotation + p.rotationSpeed };
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Josefin+Sans:wght@400;500&display=swap');

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fde8e8; }
        ::-webkit-scrollbar-thumb { background: #b45309; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #92400e; }
        * { scrollbar-width: thin; scrollbar-color: #b45309 #fde8e8; }
      `}</style>

      <div
        className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #f5e6d3 50%, #f0d9c8 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {sparkles.map((s) => {
            const opacity = (Math.sin(s.phase) + 1) / 2 * 0.7 + 0.1;
            return (
              <div
                key={`s-${s.id}`}
                className="absolute"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  opacity,
                }}
              >
                <svg viewBox="0 0 24 24" fill="#d97706">
                  <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
                </svg>
              </div>
            );
          })}

          {petals.map((p) => (
            <div
              key={`p-${p.id}`}
              className="absolute"
              style={{
                left: `calc(${p.x}% + ${Math.sin(p.y * 0.06 + p.swayOffset) * 14}px)`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size * 0.75}px`,
                background: 'radial-gradient(ellipse at 30% 30%, #f4a9a8, #e07a7a)',
                borderRadius: '0 100% 0 100%',
                transform: `rotate(${p.rotation}deg)`,
                opacity: 0.65,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-lg w-full text-center space-y-7 z-10">
          <p
            className="text-xs uppercase tracking-[0.3em] font-medium"
            style={{ color: '#92400e', fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Celebrating you two
          </p>

          <h1
            className="text-5xl sm:text-6xl leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#78350f',
              textShadow: '0 2px 10px rgba(255,255,255,0.5)',
            }}
          >
            {recipientName} ✨
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
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontStyle: 'italic',
              color: '#57310f',
            }}
          >
            {message}
          </p>

          <p
            className="text-lg pt-4"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: '#92400e',
            }}
          >
            — from {senderName}
          </p>
        </div>
      </div>
    </>
  );
}