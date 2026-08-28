'use client';

import type { TemplateProps } from './index';
import { useEffect, useRef, useState } from 'react';

interface OrbitParticle {
  id: number;
  centerX: number;
  centerY: number;
  radius: number;
  angle: number;
  angleSpeed: number;
  size: number;
  type: 'ring' | 'petal';
  drift: number;
}

export default function Template05({ senderName, recipientName, message, mediaUrl }: TemplateProps) {
  const [particles, setParticles] = useState<OrbitParticle[]>([]);
  const animationRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const initial: OrbitParticle[] = [];
    for (let i = 0; i < 22; i++) {
      initial.push({
        id: i,
        centerX: Math.random() * 100,
        centerY: Math.random() * 100,
        radius: Math.random() * 6 + 3,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() * 0.3 + 0.15) * (Math.random() < 0.5 ? 1 : -1),
        size: Math.random() * 14 + 10,
        type: Math.random() < 0.35 ? 'ring' : 'petal',
        drift: Math.random() * 0.015 + 0.005,
      });
    }
    setParticles(initial);

    const animate = () => {
      frameRef.current += 1;

      setParticles((prev) =>
        prev.map((p) => {
          let newCenterY = p.centerY - p.drift;
          if (newCenterY < -10) newCenterY = 110;
          return { ...p, angle: p.angle + p.angleSpeed * 0.02, centerY: newCenterY };
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;1,500&family=Marcellus&display=swap');

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f9f1ea; }
        ::-webkit-scrollbar-thumb { background: #c9a876; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #a8875a; }
        * { scrollbar-width: thin; scrollbar-color: #c9a876 #f9f1ea; }
      `}</style>

      <div
        className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fdfaf6 0%, #f7ecdf 50%, #f3e4d0 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => {
            const x = p.centerX + Math.cos(p.angle) * p.radius;
            const y = p.centerY + Math.sin(p.angle) * p.radius;

            return p.type === 'ring' ? (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  border: '2px solid #c9a876',
                  opacity: 0.55,
                }}
              />
            ) : (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 0.8}px`,
                  background: 'radial-gradient(ellipse at 30% 30%, #ffffff, #f4e4e1)',
                  borderRadius: '0 100% 0 100%',
                  transform: `rotate(${p.angle * 40}deg)`,
                  opacity: 0.7,
                }}
              />
            );
          })}
        </div>

        <div className="relative max-w-lg w-full text-center space-y-7 z-10">
          <p
            className="text-xs uppercase tracking-[0.35em] font-medium"
            style={{ color: '#a8875a', fontFamily: "'Marcellus', serif" }}
          >
            A wish for your wedding day
          </p>

          <h1
            className="text-5xl sm:text-6xl leading-tight"
            style={{
              fontFamily: "'Cormorant', serif",
              fontWeight: 500,
              fontStyle: 'italic',
              color: '#6b4c2e',
              textShadow: '0 2px 10px rgba(255,255,255,0.7)',
            }}
          >
            {recipientName} 💍
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
              fontFamily: "'Cormorant', serif",
              fontWeight: 500,
              fontStyle: 'italic',
              color: '#4a3520',
            }}
          >
            {message}
          </p>

          <p
            className="text-lg pt-4"
            style={{
              fontFamily: "'Marcellus', serif",
              letterSpacing: '0.05em',
              color: '#a8875a',
            }}
          >
            — from {senderName}
          </p>
        </div>
      </div>
    </>
  );
}