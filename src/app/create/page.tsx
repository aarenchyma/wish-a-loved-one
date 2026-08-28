'use client';

import { motion } from 'framer-motion';
import { WishForm } from '@/components/forms/WishForm';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-16 px-6"
      >
        <h1 className="text-3xl font-bold text-gray-900">Send a wish</h1>
        <p className="text-gray-500 mt-2">A few details, then it's ready to share.</p>
      </motion.div>
      <WishForm />
    </div>
  );
}