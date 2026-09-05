function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const env = {
  mongoUri: required('MONGODB_URI'),
  paystackSecretKey: required('PAYSTACK_SECRET_KEY'),
  paystackPublicKey: required('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY'),
  cloudinaryCloudName: required('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: required('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: required('CLOUDINARY_API_SECRET'),
  resendApiKey: required('RESEND_API_KEY'),
  emailUser: required('EMAIL_USER'),
  emailPass: required('EMAIL_PASS'),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};