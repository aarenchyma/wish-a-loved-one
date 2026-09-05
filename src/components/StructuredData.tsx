export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Wish A Loved One',
    description:
      'Send a personalized birthday, valentine, or anniversary wish as an animated page, delivered as a link, QR code, or email.',
    provider: {
      '@type': 'Organization',
      name: 'Wish A Loved One',
      url: 'https://wish-a-loved-one.com',
    },
    offers: [
      { '@type': 'Offer', name: 'Text wish', price: '250', priceCurrency: 'NGN' },
      { '@type': 'Offer', name: 'Text + Video wish', price: '500', priceCurrency: 'NGN' },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}