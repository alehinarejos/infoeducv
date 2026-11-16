import { MetadataRoute } from 'next';
import { getCenters } from '@/lib/api';
import { getCenterSlug } from '@/lib/slug';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';
  const lastMod = new Date('2026-11-17');

  const legalEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const centers = await getCenters();

    const centerEntries: MetadataRoute.Sitemap = centers.map((center) => {
      const slug = getCenterSlug(center);
      return {
        url: `${baseUrl}/centro/${slug}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    });

    return [
      {
        url: baseUrl,
        lastModified: lastMod,
        changeFrequency: 'daily',
        priority: 1,
      },
      ...legalEntries,
      ...centerEntries,
    ];
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: lastMod,
        changeFrequency: 'daily',
        priority: 1,
      },
      ...legalEntries,
    ];
  }
}
