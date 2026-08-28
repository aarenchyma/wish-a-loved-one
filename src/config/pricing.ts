import type { Tier } from '@/types';

export const PRICING: Record<Tier, number> = {
  text: 25000,        // ₦250 in kobo
  text_video: 50000,  // ₦500 in kobo
};

export const EMAIL_DELIVERY_FEE = 0; 

export function calculateAmount(tier: Tier, sendEmail: boolean): number {
  return PRICING[tier] + (sendEmail ? EMAIL_DELIVERY_FEE : 0);
}