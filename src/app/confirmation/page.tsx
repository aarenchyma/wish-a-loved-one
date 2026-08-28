import { Suspense } from 'react';
import { ConfirmationContent } from '@/components/ConfirmationContent';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}