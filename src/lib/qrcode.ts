import QRCode from 'qrcode';
import { env } from './env';

export async function generateQrSvg(slug: string): Promise<string> {
  const url = `${env.siteUrl}/${slug}`;
  return QRCode.toString(url, { type: 'svg', margin: 1, width: 400 });
}

export async function generateQrDataUrl(slug: string): Promise<string> {
  const url = `${env.siteUrl}/${slug}`;
  return QRCode.toDataURL(url, { margin: 1, width: 400 });
}