'use client';

import type { TemplateProps } from './index';
import { useEffect, useRef, useState } from 'react';

interface FallingLove {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  speed: number;
  opacity: number;
}

export default function Template01({ senderName, recipientName, message, mediaUrl }: TemplateProps) {
  const [loves, setLoves] = useState<FallingLove[]>([]);
  const animationRef = useRef<number>(0);

  const loveEmojis = ['❤️', '💕', '💗', '💖', '💝', '💓', '💞'];

  useEffect(() => {
    const initialLoves: FallingLove[] = [];
    for (let i = 0; i < 40; i++) {
      initialLoves.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 120 - 20,
        size: Math.random() * 20 + 10,
        emoji: loveEmojis[Math.floor(Math.random() * loveEmojis.length)],
        speed: Math.random() * 0.6 + 0.3,
        opacity: Math.random() * 0.3 + 0.15,
      });
    }
    setLoves(initialLoves);

    const animate = () => {
      setLoves(prevLoves =>
        prevLoves.map(love => {
          let newY = love.y - love.speed;
          if (newY < -10) newY = 110;
          return { ...love, y: newY };
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
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap');

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #ffcdd2; }
        ::-webkit-scrollbar-thumb { background: #e53935; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #c62828; }
        * { scrollbar-width: thin; scrollbar-color: #e53935 #ffcdd2; }
      `}</style>

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 50%, #e57373 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {loves.map((love) => (
            <div
              key={love.id}
              className="absolute"
              style={{
                left: `${love.x}%`,
                top: `${love.y}%`,
                fontSize: `${love.size}px`,
                opacity: love.opacity,
                transition: 'none',
              }}
            >
              {love.emoji}
            </div>
          ))}
        </div>

        <div className="relative max-w-lg w-full text-center space-y-7 z-10">
          <p
            className="text-xs uppercase tracking-[0.25em] font-semibold"
            style={{ color: '#b71c1c', fontFamily: "'Cormorant Garamond', serif" }}
          >
            A wish for you
          </p>

          <h1
            className="text-6xl sm:text-7xl leading-tight"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: '#7f1d1d',
              textShadow: '0 2px 12px rgba(255,255,255,0.5)',
            }}
          >
            {recipientName} 💕
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
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#3f0d0d',
            }}
          >
            {message}
          </p>

          <p
            className="text-lg pt-4"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 600,
              color: '#7f1d1d',
            }}
          >
            — from {senderName}
          </p>
        </div>
      </div>
    </>
  );
}