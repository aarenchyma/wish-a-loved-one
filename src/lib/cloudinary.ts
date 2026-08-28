import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

// Generates a signature so the client can upload directly to Cloudinary
// without your video ever touching your own server/API route.
export function getUploadSignature(paramsToSign: Record<string, string | number>) {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { ...paramsToSign, timestamp },
    env.cloudinaryApiSecret
  );

  return { timestamp, signature, apiKey: env.cloudinaryApiKey, cloudName: env.cloudinaryCloudName };
}

export { cloudinary };