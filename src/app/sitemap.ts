import { MetadataRoute } from 'next';
import { getCenters } from '@/lib/api';
import { getCenterSlug } from '@/lib/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';
  
  try {
    const centers = await getCenters();

    const centerEntries: MetadataRoute.Sitemap = centers.map((center) => {
      const slug = getCenterSlug(center);
      return {
        url: `${baseUrl}/centro/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            es: `${baseUrl}/centro/${slug}`,
            'ca-ES': `${baseUrl}/centro/${slug}?lang=va`,
            en: `${baseUrl}/centro/${slug}?lang=en`,
          }
        }
      };
    });

    const legalEntries: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/aviso-legal`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacidad`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/cookies`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
        alternates: {
          languages: {
            es: baseUrl,
            'ca-ES': `${baseUrl}?lang=va`,
            en: `${baseUrl}?lang=en`,
          }
        }
      },
      ...legalEntries,
      ...centerEntries,
    ];
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
        alternates: {
          languages: {
            es: baseUrl,
            'ca-ES': `${baseUrl}?lang=va`,
            en: `${baseUrl}?lang=en`,
          }
        }
      },
      {
        url: `${baseUrl}/aviso-legal`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacidad`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/cookies`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];
  }
}
