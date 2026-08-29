import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { initTransaction } from '@/lib/paystack';
import { calculateAmount } from '@/config/pricing';
import { nanoid } from 'nanoid';
import type { Tier, OutputFormat } from '@/types';

interface CreateOrderBody {
  tier: Tier;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail?: string;
  message: string;
  mediaUrl?: string;
  outputFormat: OutputFormat;
  sendEmail: boolean;
  template: string;
}

export async function POST(req: NextRequest) {
  const body: CreateOrderBody = await req.json();

  // basic validation — reject early, don't let bad data reach Paystack
  if (!body.tier || !body.senderName || !body.senderEmail || !body.recipientName || !body.message || !body.outputFormat) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (body.tier === 'text_video' && !body.mediaUrl) {
    return NextResponse.json({ error: 'Video URL required for text_video tier' }, { status: 400 });
  }

  if (body.sendEmail && !body.recipientEmail) {
    return NextResponse.json({ error: 'Recipient email required when sendEmail is true' }, { status: 400 });
  }

  await connectDB();

  const amount = calculateAmount(body.tier, body.sendEmail);
  const reference = `wish_${nanoid(16)}`;

  const order = await OrderModel.create({
    tier: body.tier,
    senderName: body.senderName,
    senderEmail: body.senderEmail,
    recipientName: body.recipientName,
    recipientEmail: body.recipientEmail,
    message: body.message,
    mediaUrl: body.mediaUrl,
    outputFormat: body.outputFormat,
    template: body.template,
    sendEmail: body.sendEmail,
    paystackReference: reference,
    amount,
    paymentStatus: 'pending',
  });

  try {
    const paystackRes = await initTransaction({
      email: body.senderEmail,
      amount,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?reference=${reference}`,
      metadata: { orderId: order._id.toString() },
    });

    if (!paystackRes.status) {
      throw new Error(paystackRes.message);
    }

    return NextResponse.json({
      authorizationUrl: paystackRes.data.authorization_url,
      accessCode: paystackRes.data.access_code,
      reference,
    });
  } catch (err) {
    // don't leave a dead pending order sitting around if Paystack init failed
    await OrderModel.findByIdAndDelete(order._id);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 502 });
  }
}