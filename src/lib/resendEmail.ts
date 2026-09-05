import { Resend } from 'resend';
import { env } from './env';
import { generateQrDataUrl } from './qrcode';
import type { OutputFormat } from '@/types';

const resend = new Resend(env.resendApiKey);

interface SendWishEmailParams {
  to: string;
  senderName: string;
  recipientName: string;
  slug: string;
  outputFormat: OutputFormat;
}

export async function sendWishEmail({ to, senderName, recipientName, slug, outputFormat }: SendWishEmailParams) {
  const wishUrl = `${env.siteUrl}/${slug}`;

  const linkButton = `
    <p><a href="${wishUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Open your wish</a></p>
  `;

  if (outputFormat === 'link') {
    return resend.emails.send({
      from: 'wish-a-loved-one',
      to,
      subject: `${senderName} sent ${recipientName} a wish 🎉`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p>Hi ${recipientName},</p>
          <p>${senderName} sent you something special.</p>
          ${linkButton}
        </div>
      `,
    });
  }

  const qrDataUrl = await generateQrDataUrl(slug);
  const qrBase64 = qrDataUrl.split(',')[1];

  return resend.emails.send({
    from: 'wishes@wish-a-loved-one.com',
    to,
    subject: `${senderName} sent ${recipientName} a wish 🎉`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; text-align: center;">
        <p>Hi ${recipientName},</p>
        <p>${senderName} sent you something special. Scan the code below to open it:</p>
        <img src="cid:wish-qr" alt="Scan to open your wish" style="width:240px;height:240px;" />
        <p style="margin-top:16px;font-size:13px;color:#666;">Can't scan? <a href="${wishUrl}">Open it here instead</a></p>
      </div>
    `,
    attachments: [
      {
        filename: 'wish-qr.png',
        content: qrBase64,
        contentId: 'wish-qr',
      },
    ],
  });
}