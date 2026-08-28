import { NextResponse } from 'next/server';
import { getUploadSignature } from '@/lib/cloudinary';

export async function POST() {
  const params = {
    folder: 'wish-videos',
  };

  const signature = getUploadSignature(params);

  return NextResponse.json({ ...signature, folder: params.folder });
}