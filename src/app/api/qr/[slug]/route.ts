import { NextRequest, NextResponse } from 'next/server';
import { generateQrDataUrl } from '@/lib/qrcode';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const dataUrl = await generateQrDataUrl(slug);
  return NextResponse.json({ dataUrl });
}