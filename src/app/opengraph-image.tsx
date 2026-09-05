import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Wish A Loved One';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #fed7aa 100%)',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #f472b6, #fb923c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            marginBottom: 32,
          }}
        >
          💌
        </div>
        <div style={{ fontSize: 64, fontWeight: 600, color: '#1f2937' }}>
          Wish A Loved One
        </div>
        <div style={{ fontSize: 28, color: '#6b7280', marginTop: 16 }}>
          Send a wish they'll actually remember
        </div>
      </div>
    ),
    { ...size }
  );
}