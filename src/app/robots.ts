import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Cambia esta URL por tu dominio real cuando lances la web
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/centro/'],
        disallow: [
          '/api/',
          '/_next/data/',
          '/*?q=*',
          '/*?zip=*',
          '/*?cycleQ=*',
          '/*?view=map*',
          '/*&*',
        ],
      },
    ],
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
