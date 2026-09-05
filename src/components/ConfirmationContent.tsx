'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { QrCodeCard } from './QrCodeCard';
import { Button } from './ui/Button';
import { Toast } from './ui/Toast';

interface OrderStatus {
  paymentStatus: 'pending' | 'paid' | 'failed';
  slug: string | null;
  outputFormat: 'link' | 'qr';
  recipientEmail?: string;
  sendEmail: boolean;
}

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

function AmbientHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const initial: Heart[] = [];
    for (let i = 0; i < 24; i++) {
      initial.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 18 + 14,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.008,
      });
    }
    setHearts(initial);

    const animate = () => {
      setHearts((prev) => prev.map((h) => ({ ...h, phase: h.phase + h.speed })));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h) => {
        const opacity = (Math.sin(h.phase) + 1) / 2 * 0.25 + 0.05;
        return (
          <div
            key={h.id}
            className="absolute"
            style={{ left: `${h.x}%`, top: `${h.y}%`, fontSize: `${h.size}px`, opacity }}
          >
            ❤️
          </div>
        );
      })}
    </div>
  );
}

// small helper — both copy and resend need "flip a toast for 2s" behavior
function useToast() {
  const [state, setState] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  function fire(message: string, variant: 'success' | 'error' = 'success') {
    setState({ message, variant });
    setTimeout(() => setState(null), 2500);
  }

  return { toast: state, fire };
}

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [polling, setPolling] = useState(true);
  const [resending, setResending] = useState(false);
  const { toast: copyToast, fire: fireCopyToast } = useToast();
  const { toast: resendToast, fire: fireResendToast } = useToast();

  useEffect(() => {
    if (!reference) return;

    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      attempts++;
      const res = await fetch(`/api/orders/${reference}`);
      const data: OrderStatus = await res.json();

      if (data.paymentStatus === 'paid' || data.paymentStatus === 'failed' || attempts >= maxAttempts) {
        setOrder(data);
        setPolling(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [reference]);

  async function handleCopy(wishUrl: string) {
    try {
      await navigator.clipboard.writeText(wishUrl);
      fireCopyToast('Link copied to clipboard');
    } catch {
      fireCopyToast("Couldn't copy — copy it manually", 'error');
    }
  }

  async function handleResend() {
    if (!reference) return;
    setResending(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();

      if (res.ok) {
        fireResendToast('Email sent');
      } else {
        fireResendToast(data.error || 'Failed to resend email', 'error');
      }
    } catch {
      fireResendToast('Failed to resend email — check your connection', 'error');
    } finally {
      setResending(false);
    }
  }

  if (!reference) {
    return <div className="min-h-screen flex items-center justify-center">No order reference found.</div>;
  }

  if (polling) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-pink-50 via-white to-orange-50 overflow-hidden">
        <AmbientHearts />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative text-gray-500"
        >
          Confirming your payment…
        </motion.p>
      </div>
    );
  }

  if (order?.paymentStatus === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-6 text-center"
      >
        <div>
          <p className="text-red-600 font-medium">Payment could not be confirmed.</p>
          <p className="text-gray-500 mt-2">If you were charged, contact us with reference {reference}.</p>
        </div>
      </motion.div>
    );
  }

  if (order?.paymentStatus === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-6 text-center"
      >
        <p className="text-gray-500">Still confirming — this can take a moment. Refresh in a bit.</p>
      </motion.div>
    );
  }

  if (!order?.slug) {
    return <div className="min-h-screen flex items-center justify-center">Something went wrong generating your wish.</div>;
  }

  const wishUrl = `${window.location.origin}/${order.slug}`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-pink-50 via-white to-orange-50 overflow-hidden">
      <AmbientHearts />

      <div className="relative max-w-md w-full text-center space-y-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-5xl"
        >
          💌
        </motion.div>

        <motion.h1
          initial="hidden" animate="visible" custom={0} variants={fadeUp}
          className="text-2xl font-bold text-gray-900"
        >
          Your message is ready
        </motion.h1>

        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
          {order.outputFormat === 'link' ? (
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 break-all text-sm text-gray-700 shadow-sm">{wishUrl}</div>
          ) : (
            <QrCodeCard slug={order.slug} />
          )}
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="relative">
          <Button variant="secondary" className="w-full" onClick={() => handleCopy(wishUrl)}>
            Copy link
          </Button>
          <Toast show={!!copyToast} message={copyToast?.message ?? ''} variant={copyToast?.variant} />
        </motion.div>

        {order.sendEmail && (
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="relative border-t pt-4">
            <Button variant="secondary" onClick={handleResend} loading={resending} className="w-full">
              Resend email to {order.recipientEmail}
            </Button>
            <Toast show={!!resendToast} message={resendToast?.message ?? ''} variant={resendToast?.variant} />
          </motion.div>
        )}
      </div>
    </div>
  );
}