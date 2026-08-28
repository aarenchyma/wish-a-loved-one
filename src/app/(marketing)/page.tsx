'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export default function LandingPage() {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    const emojis = ['❤️', '💕', '💗', '💖', '✨', '💝', '🌸', '🌺', '💫', '💟', '💓', '💞'];
    const newEmojis: FloatingEmoji[] = [];
    
    for (let i = 0; i < 25; i++) {
      newEmojis.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 14,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 10,
        rotation: Math.random() * 360,
      });
    }
    
    setFloatingEmojis(newEmojis);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50 overflow-x-hidden">
      {/* Floating Emojis Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            className="absolute"
            initial={{ 
              x: `${item.x}%`, 
              y: `${item.y}%`,
              rotate: 0,
              opacity: 0.3,
              scale: 0.5
            }}
            animate={{ 
              y: [`${item.y}%`, `${(item.y + 20) % 100}%`, `${(item.y + 40) % 100}%`, `${(item.y + 20) % 100}%`, `${item.y}%`],
              rotate: [0, item.rotation, item.rotation * 2, item.rotation, 0],
              opacity: [0.2, 0.4, 0.6, 0.4, 0.2],
              scale: [0.5, 1, 1.2, 1, 0.5]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              fontSize: `${item.size}px`,
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Floating decorative blobs */}
      <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none" />
      <div className="absolute top-20 sm:top-40 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-orange-200 rounded-full blur-3xl opacity-40 translate-x-1/2 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-3xl mx-auto text-center px-4 sm:px-6 pt-12 sm:pt-24 pb-8 sm:pb-20 z-10">
        <motion.p
          initial="hidden" 
          animate="visible" 
          custom={0} 
          variants={fadeUp}
          className="text-xs sm:text-sm uppercase tracking-widest text-pink-500 font-semibold mb-3 sm:mb-4"
        >
          For birthdays, anniversaries & every occasion
        </motion.p>
        
        <motion.h1
          initial="hidden" 
          animate="visible" 
          custom={1} 
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
        >
          Send a wish they'll
          <br className="hidden sm:block" />
          <span className="block sm:inline"> actually remember</span>
        </motion.h1>
        
        <motion.p
          initial="hidden" 
          animate="visible" 
          custom={2} 
          variants={fadeUp}
          className="text-base sm:text-lg text-gray-600 mt-4 sm:mt-6 max-w-xl mx-auto"
        >
          A personalized page with your message — delivered as a link, a scannable QR code, or straight to their inbox. No app, no signup for them to open it.
        </motion.p>
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          custom={3} 
          variants={fadeUp} 
          className="mt-8 sm:mt-10"
        >
          <Link
            href="/create"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-xl font-medium text-base sm:text-lg hover:bg-gray-800 hover:scale-105 transition-all shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none relative group"
          >
            <span className="relative z-10">Send a wish →</span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur" />
          </Link>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            { step: '1', title: 'Write your message', desc: 'Add a personal note, and a video if you want to say it in person.' },
            { step: '2', title: 'Pick a design', desc: 'Every wish gets its own beautifully animated page.' },
            { step: '3', title: 'Share it', desc: 'Send as a link, QR code, or straight to their email.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              custom={i} 
              variants={fadeUp}
              className="text-center group"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            custom={0} 
            variants={fadeUp}
            className="border border-gray-200 rounded-2xl p-5 sm:p-6 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
          >
            <p className="font-semibold text-gray-900 text-sm sm:text-base">Text wish</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">₦250</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed">Message + your choice of link or QR code</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            custom={1} 
            variants={fadeUp}
            className="border-2 border-gray-900 rounded-2xl p-5 sm:p-6 bg-white shadow-md relative hover:shadow-xl transition-shadow duration-300"
          >
            <span className="absolute -top-3 right-4 sm:right-6 bg-gray-900 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
              Popular
            </span>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">Text + Video</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">₦500</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed">Everything in Text, plus a personal video</p>
          </motion.div>
        </div>
      </section>

      {/* Floating Hearts Animation at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pink-100/20 to-transparent pointer-events-none" />
    </div>
  );
}