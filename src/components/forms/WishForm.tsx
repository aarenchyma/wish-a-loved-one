'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { RadioCard } from '@/components/ui/RadioCard';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { VideoUpload } from './VideoUpload';
import type { Tier, OutputFormat } from '@/types';
import { TemplateSelector, getRandomTemplateId } from './TemplateSelector';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export function WishForm() {
  const router = useRouter();

  const [tier, setTier] = useState<Tier>('text');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('link');
  const [sendEmail, setSendEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState(() => getRandomTemplateId());

  const needsVideo = tier === 'text_video';
  const canSubmit =
    senderName && senderEmail && recipientName && message &&
    (!needsVideo || mediaUrl) &&
    (!sendEmail || recipientEmail);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          senderName,
          senderEmail,
          recipientName,
          recipientEmail: sendEmail ? recipientEmail : undefined,
          message,
          mediaUrl: mediaUrl || undefined,
          outputFormat,
          sendEmail,
          template,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-8 px-6 py-12">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="space-y-3">
        <p className="font-medium text-gray-900">Choose your tier</p>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard name="tier" value="text" checked={tier === 'text'} onChange={(v) => setTier(v as Tier)} title="Text only" subtitle="₦250" />
          <RadioCard name="tier" value="text_video" checked={tier === 'text_video'} onChange={(v) => setTier(v as Tier)} title="Text + Video" subtitle="₦500" />
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp} className="space-y-3">
        <p className="font-medium text-gray-900">How should they receive it?</p>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard name="outputFormat" value="link" checked={outputFormat === 'link'} onChange={(v) => setOutputFormat(v as OutputFormat)} title="Link" />
          <RadioCard name="outputFormat" value="qr" checked={outputFormat === 'qr'} onChange={(v) => setOutputFormat(v as OutputFormat)} title="QR Code" />
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
        <TemplateSelector value={template} onChange={setTemplate} />
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="space-y-8">
        <Input label="Your name" id="senderName" value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
        <Input label="Your email (for receipt)" id="senderEmail" type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required />
        <Input label="Recipient's name" id="recipientName" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
        <TextArea label="Your message" id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
      </motion.div>

      {needsVideo && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
          <VideoUpload onUploaded={setMediaUrl} />
        </motion.div>
      )}

      <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="border-t pt-4">
        <Toggle checked={sendEmail} onChange={setSendEmail} label="Also email this to them" />
        {sendEmail && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mt-3">
            <Input label="Recipient's email" id="recipientEmail" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required={sendEmail} />
          </motion.div>
        )}
      </motion.div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button type="submit" disabled={!canSubmit} loading={submitting} className="w-full">
          Continue to payment
        </Button>
      </motion.div>
    </form>
  );
}