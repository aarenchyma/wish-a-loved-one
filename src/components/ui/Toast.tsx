'use client';

import { motion } from 'framer-motion';

interface ToastProps {
  show: boolean;
  message: string;
  variant?: 'success' | 'error';
}

export function Toast({ show, message, variant = 'success' }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className={`absolute left-1/2 -translate-x-1/2 -top-10 text-xs px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap ${
        variant === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
      }`}
    >
      {message}
    </motion.div>
  );
}