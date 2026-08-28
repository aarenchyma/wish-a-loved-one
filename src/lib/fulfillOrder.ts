import { OrderModel } from '@/models/Order';
import { verifyTransaction } from './paystack';
import { generateSlug } from './slug';
import { sendWishEmail } from './email';

export async function fulfillOrderIfPaid(reference: string) {
  const order = await OrderModel.findOne({ paystackReference: reference });
  if (!order) return null;

  if (order.paymentStatus === 'paid') return order; // already done, idempotent

  const verification = await verifyTransaction(reference);

  if (!verification.status || verification.data.status !== 'success') {
    return order; // still pending or genuinely failed — leave as is
  }

  if (verification.data.amount !== order.amount) {
    return order; // mismatch — don't fulfill, needs manual review
  }

  order.paymentStatus = 'paid';
  order.slug = generateSlug();
  order.paidAt = new Date();
  // template was already chosen at checkout — don't overwrite it here
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
      console.error('Failed to send wish email:', err);
    }
  }

  return order;
}