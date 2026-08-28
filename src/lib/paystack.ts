import { env } from './env';
import crypto from 'crypto';

const BASE_URL = 'https://api.paystack.co';

interface InitTransactionParams {
  email: string;
  amount: number; // in kobo
  reference: string;
  metadata?: Record<string, unknown>;
  callback_url?: string;
}

interface InitTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initTransaction(params: InitTransactionParams): Promise<InitTransactionResponse> {
  const res = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Paystack init failed: ${res.status}`);
  }

  return res.json();
}

interface VerifyTransactionResponse {
  status: boolean;
  message: string;
  data: {
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    customer: { email: string };
  };
}

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
  const res = await fetch(`${BASE_URL}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${env.paystackSecretKey}` },
  });

  if (!res.ok) {
    throw new Error(`Paystack verify failed: ${res.status}`);
  }

  return res.json();
}

// Validates the webhook actually came from Paystack — never trust the payload without this
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', env.paystackSecretKey)
    .update(rawBody)
    .digest('hex');

  return hash === signature;
}