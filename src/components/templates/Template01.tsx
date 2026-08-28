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
    // Initialize falling loves
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

    // Animation loop - moving UP only
    const animate = () => {
      setLoves(prevLoves => 
        prevLoves.map(love => {
          let newY = love.y - love.speed;
          
          // Reset to bottom when goes off top
          if (newY < -10) {
            newY = 110;
          }
          
          return {
            ...love,
            y: newY,
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Custom scrollbar - pink/red theme */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #ffcdd2;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #e53935;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #c62828;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: #e53935 #ffcdd2;
        }
      `}</style>

      {/* Background - more red/pink-red like your picture */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 50%, #e57373 100%)' }}>
        
        {/* Upward rain only */}
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

        {/* Your original content */}
        <div className="relative max-w-lg w-full text-center space-y-6 z-10">
          <p className="text-sm uppercase tracking-widest text-pink-500 font-medium">
            A wish for you
          </p>
          <h1 className="text-4xl font-bold text-gray-900">{recipientName} 🎉</h1>

          {mediaUrl && (
            <video
              src={mediaUrl}
              controls
              playsInline
              className="w-full rounded-2xl shadow-lg"
            />
          )}

          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {message}
          </p>

          <p className="text-sm text-gray-500 pt-4">— from {senderName}</p>
        </div>
      </div>
    </>
  );
}