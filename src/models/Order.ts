import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  slug: { type: String, unique: true, sparse: true },
  tier: { type: String, enum: ['text', 'text_video'], required: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String },
  message: { type: String, required: true },
  mediaUrl: { type: String },
  template: { type: String, default: null },
  outputFormat: { type: String, enum: ['link', 'qr'] },
  sendEmail: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paystackReference: { type: String, required: true, unique: true },
  lastEmailSentAt: { type: Date },
  amount: { type: Number, required: true },
  paidAt: { type: Date },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

export const OrderModel = models.Order || model('Order', OrderSchema);