import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { verifyWebhookSignature, verifyTransaction } from '@/lib/paystack';
import { generateSlug } from '@/lib/slug';
import { pickRandomTemplate } from '@/lib/templates';
import { sendWishEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    // don't process anything that isn't provably from Paystack
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true });
  }

  const reference = event.data.reference;

  await connectDB();
  const order = await OrderModel.findOne({ paystackReference: reference });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.paymentStatus === 'paid') {
    // webhook can fire more than once — don't regenerate slug/re-send email on a duplicate
    return NextResponse.json({ received: true });
  }

  // re-verify directly against Paystack rather than trusting the webhook payload's amount/status alone
  const verification = await verifyTransaction(reference);

  if (!verification.status || verification.data.status !== 'success') {
    order.paymentStatus = 'failed';
    await order.save();
    return NextResponse.json({ received: true });
  }

  if (verification.data.amount !== order.amount) {
    // amount mismatch — don't fulfill, flag for manual review
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
  }

  order.paymentStatus = 'paid';
  order.slug = generateSlug();
  order.paidAt = new Date();
  await order.save();

  if (order.sendEmail && order.recipientEmail) {
    try {
      await sendWishEmail({
        to: order.recipientEmail,
        senderName: order.senderName,
        recipientName: order.recipientName,
        slug: order.slug,
        outputFormat: order.outputFormat,
      });
    } catch (err) {
      // don't fail the whole webhook over email — the order is still paid and the link/QR still works on-site
      console.error('Failed to send wish email:', err);
    }
  }

  return NextResponse.json({ received: true });
}