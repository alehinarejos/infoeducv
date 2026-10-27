import { MetadataRoute } from 'next';
import { getCenters } from '@/lib/api';
import { getCenterSlug, getFpFamilySlug, getMunicipalitySlug } from '@/lib/slug';

export const revalidate = 86400; // Revalidate sitemap every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';
  const dailyLastMod = new Date(new Date().toISOString().split('T')[0]);

  const legalEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified: dailyLastMod,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  try {
    const centers = await getCenters();

    const municipalitySlugs = new Set<string>();
    const fpFamilySlugs = new Set<string>();

    const centerEntries: MetadataRoute.Sitemap = centers.map((center) => {
      const slug = getCenterSlug(center);
      const muniSlug = getMunicipalitySlug(center.municipality || '');
      if (muniSlug) municipalitySlugs.add(muniSlug);

      const hasFp = Boolean(center.fpCycles && center.fpCycles.length > 0);
      if (center.fpCycles) {
        for (const cycle of center.fpCycles) {
          const fSlug = getFpFamilySlug(cycle.family || '');
          if (fSlug && fSlug !== 'otras-familias') {
            fpFamilySlugs.add(fSlug);
          }
        }
      }

      return {
        url: `${baseUrl}/centro/${slug}`,
        lastModified: dailyLastMod,
        changeFrequency: 'monthly',
        priority: hasFp ? 0.85 : 0.8,
      };
    });

    const municipalityEntries: MetadataRoute.Sitemap = Array.from(municipalitySlugs).map(
      (mSlug) => ({
        url: `${baseUrl}/municipio/${mSlug}`,
        lastModified: dailyLastMod,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    );

    const fpFamilyEntries: MetadataRoute.Sitemap = Array.from(fpFamilySlugs).map((fSlug) => ({
      url: `${baseUrl}/fp/${fSlug}`,
      lastModified: dailyLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [
      homeEntry,
      ...municipalityEntries,
      ...fpFamilyEntries,
      ...legalEntries,
      ...centerEntries,
    ];
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    return [homeEntry, ...legalEntries];
  }
}
