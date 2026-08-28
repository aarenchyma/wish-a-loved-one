'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QrCodeCard } from './QrCodeCard';
import { Button } from './ui/Button';

interface OrderStatus {
  paymentStatus: 'pending' | 'paid' | 'failed';
  slug: string | null;
  outputFormat: 'link' | 'qr';
  recipientEmail?: string;
  sendEmail: boolean;
}

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [polling, setPolling] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) return;

    let attempts = 0;
    const maxAttempts = 10; // ~20s of polling — webhook is usually near-instant, but give it room

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

  async function handleResend() {
    if (!reference) return;
    setResending(true);
    setResendMessage(null);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();

      setResendMessage(res.ok ? 'Email sent!' : data.error || 'Failed to resend');
    } catch {
      setResendMessage('Failed to resend');
    } finally {
      setResending(false);
    }
  }

  if (!reference) {
    return <div className="min-h-screen flex items-center justify-center">No order reference found.</div>;
  }

  if (polling) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-500">Confirming your payment…</p>
      </div>
    );
  }

  if (order?.paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-red-600 font-medium">Payment could not be confirmed.</p>
          <p className="text-gray-500 mt-2">If you were charged, contact us with reference {reference}.</p>
        </div>
      </div>
    );
  }

  if (order?.paymentStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-gray-500">Still confirming — this can take a moment. Refresh in a bit.</p>
      </div>
    );
  }

  if (!order?.slug) {
    return <div className="min-h-screen flex items-center justify-center">Something went wrong generating your wish.</div>;
  }

  const wishUrl = `${window.location.origin}/${order.slug}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Your wish is ready 🎉</h1>

        {order.outputFormat === 'link' ? (
          <div className="bg-gray-50 rounded-xl p-4 break-all text-sm text-gray-700">{wishUrl}</div>
        ) : (
          <QrCodeCard slug={order.slug} />
        )}

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigator.clipboard.writeText(wishUrl)}
        >
          Copy link
        </Button>

        {order.sendEmail && (
          <div className="border-t pt-4">
            <Button variant="secondary" onClick={handleResend} loading={resending} className="w-full">
              Resend email to {order.recipientEmail}
            </Button>
            {resendMessage && <p className="text-sm text-gray-500 mt-2">{resendMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}