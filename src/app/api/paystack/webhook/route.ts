import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/paystack';
import { fulfillOrderIfPaid } from '@/lib/fulfillOrder';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true });
  }

  await connectDB();
  await fulfillOrderIfPaid(event.data.reference);

  return NextResponse.json({ received: true });
}