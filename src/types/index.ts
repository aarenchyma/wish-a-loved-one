export type Tier = 'text' | 'text_video';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OutputFormat = 'link' | 'qr';

export interface Order {
  _id?: string;
  slug: string | null;          // null until payment confirms
  tier: Tier;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail?: string;      // required if deliveryMethod includes email
  message: string;
  mediaUrl?: string;   
  template: string | null;      // assigned on payment confirm
  outputFormat: OutputFormat;
  sendEmail: boolean;  
  paymentStatus: PaymentStatus;
  paystackReference: string;
  amount: number;               // kobo
  createdAt: Date;
  paidAt?: Date;
}