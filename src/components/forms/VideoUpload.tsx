'use client';

import { useState } from 'react';

interface VideoUploadProps {
  onUploaded: (url: string) => void;
}

export function VideoUpload({ onUploaded }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('Video must be under 50MB');
      return;
    }

    setError(null);
    setUploading(true);
    setFileName(file.name);

    try {
      const sigRes = await fetch('/api/upload', { method: 'POST' });
      const { timestamp, signature, apiKey, cloudName, folder } = await sigRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const data = await uploadRes.json();
      onUploaded(data.secure_url);
    } catch (err) {
      setError('Video upload failed. Please try again.');
      setFileName(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Video (max 50MB)</label>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-900 file:font-medium"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading {fileName}…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}