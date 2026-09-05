import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/create'],
        disallow: ['/confirmation', '/api/'],
      },
    ],
    sitemap: 'https://wish-a-loved-one.com/sitemap.xml',
  };
}