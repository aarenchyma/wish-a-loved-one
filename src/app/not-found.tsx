'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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

export default function NotFound() {
  const [loves, setLoves] = useState<FallingLove[]>([]);
  const animationRef = useRef<number>(0);

  const loveEmojis = ['❤️', '💕', '💗', '💖', '💝', '💓', '💞', '✨'];

  useEffect(() => {
    const initialLoves: FallingLove[] = [];
    for (let i = 0; i < 35; i++) {
      initialLoves.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 120 - 20,
        size: Math.random() * 20 + 10,
        emoji: loveEmojis[Math.floor(Math.random() * loveEmojis.length)],
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.25 + 0.1,
      });
    }
    setLoves(initialLoves);

    const animate = () => {
      setLoves(prevLoves => 
        prevLoves.map(love => {
          let newY = love.y - love.speed;
          if (newY < -10) {
            newY = 110;
          }
          return { ...love, y: newY };
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50 overflow-hidden relative">
      
      {/* Upward rain animation */}
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

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg w-full text-center space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/50"
        >
          {/* Decorative top */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-pink-100/80 text-pink-600 text-xs sm:text-sm font-medium">
            💖 404
          </div>

          {/* 404 illustration */}
          <div className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400">
            404
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Oops! This page took a wrong turn
          </h1>

          <p className="text-gray-600 max-w-sm mx-auto">
            The wish you're looking for might have floated away or never existed. 
            Let's get you back on track.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300" />
            <span className="text-pink-300 text-sm">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-xl font-medium hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/25"
            >
              <span>🏠</span>
              Go back home
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg"
            >
              <span>💝</span>
              Send a wish
            </Link>
          </div>

          {/* Small text */}
          <p className="text-xs text-gray-400 pt-4">
            💡 Tip: Every wish gets its own unique link. Make sure it's spelled right!
          </p>
        </motion.div>
      </div>
    </div>
  );
}