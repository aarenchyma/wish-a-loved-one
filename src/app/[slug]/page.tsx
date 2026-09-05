import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { getTemplateComponent } from '@/components/templates';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getOrderBySlug(slug: string) {
  await connectDB();
  const order = await OrderModel.findOne({ slug, paymentStatus: 'paid' }).lean();
  return order;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const order = await getOrderBySlug(slug);

  if (!order) return { title: 'Wish not found' };

  return {
    title: `A wish for ${order.recipientName}`,
    description: `${order.senderName} sent you something special`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function WishPage({ params }: PageProps) {
  const { slug } = await params;
  const order = await getOrderBySlug(slug);

  if (!order) {
    notFound();
  }

  const Template = getTemplateComponent(order.template);

  return (
    <Template
      senderName={order.senderName}
      recipientName={order.recipientName}
      message={order.message}
      mediaUrl={order.mediaUrl}
    />
  );
}