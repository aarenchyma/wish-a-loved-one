'use client';

import { useEffect, useState } from 'react';

interface QrCodeCardProps {
  slug: string;
}

export function QrCodeCard({ slug }: QrCodeCardProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/qr/${slug}`)
      .then((res) => res.json())
      .then((data) => setDataUrl(data.dataUrl));
  }, [slug]);

  function handleDownload() {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `wish-${slug}.png`;
    a.click();
  }

  if (!dataUrl) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Generating QR code…</div>;
  }

  return (
    <div className="space-y-3">
      <img src={dataUrl} alt="Wish QR code" className="mx-auto w-56 h-56 rounded-xl border" />
      <button onClick={handleDownload} className="text-sm text-gray-500 underline">
        Download QR code
      </button>
    </div>
  );
}