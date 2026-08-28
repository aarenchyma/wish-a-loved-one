import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { sendWishEmail } from '@/lib/email';

interface SendEmailBody {
  reference: string;
}

export async function POST(req: NextRequest) {
  const body: SendEmailBody = await req.json();

  if (!body.reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
  }

  await connectDB();

  const order = await OrderModel.findOne({ paystackReference: body.reference });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.paymentStatus !== 'paid') {
    // never send a wish email for an unpaid order, even if someone hits this route directly
    return NextResponse.json({ error: 'Order not paid' }, { status: 403 });
  }

  if (!order.slug) {
    return NextResponse.json({ error: 'Order has no slug yet' }, { status: 409 });
  }

  if (!order.recipientEmail) {
    return NextResponse.json({ error: 'No recipient email on this order' }, { status: 400 });
  }

  // basic resend throttling — don't let this become a spam vector against the recipient
  const lastSent = order.lastEmailSentAt;
  if (lastSent && Date.now() - new Date(lastSent).getTime() < 60_000) {
    return NextResponse.json({ error: 'Please wait before resending' }, { status: 429 });
  }

  try {
    await sendWishEmail({
      to: order.recipientEmail,
      senderName: order.senderName,
      recipientName: order.recipientName,
      slug: order.slug,
      outputFormat: order.outputFormat,
    });

    order.lastEmailSentAt = new Date();
    order.sendEmail = true; // in case they're opting in now, post-purchase
    await order.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to send wish email:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
  }
}