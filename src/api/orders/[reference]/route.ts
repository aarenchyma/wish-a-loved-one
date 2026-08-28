import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/models/Order';

interface RouteParams {
  params: Promise<{ reference: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { reference } = await params;

  await connectDB();
  const order = await OrderModel.findOne({ paystackReference: reference }).lean();

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    paymentStatus: order.paymentStatus,
    slug: order.slug,
    outputFormat: order.outputFormat,
    recipientEmail: order.recipientEmail,
    sendEmail: order.sendEmail,
  });
}