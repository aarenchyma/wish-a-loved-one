'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateComponent } from '@/components/templates';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  template: string;
  senderName: string;
  recipientName: string;
  message: string;
  mediaUrl?: string | null;
}

export function PreviewModal({ open, onClose, template, senderName, recipientName, message, mediaUrl }: PreviewModalProps) {
  const Template = getTemplateComponent(template);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="sticky top-4 left-full -translate-x-full z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-gray-900"
              aria-label="Close preview"
            >
              ✕
            </button>

            {/* preview only — no link or QR code rendered here, order isn't paid yet */}
            <div className="-mt-9">
              <Template
                senderName={senderName || 'Your name'}
                recipientName={recipientName || 'Recipient'}
                message={message || 'Your message will appear here...'}
                mediaUrl={mediaUrl ?? undefined}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}