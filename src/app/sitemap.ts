import { MetadataRoute } from 'next';
import { getCenters } from '@/lib/api';
import { getCenterSlug, getFpCycleSlug, getFpFamilySlug, getMunicipalitySlug } from '@/lib/slug';

export const revalidate = 86400; // Revalidate sitemap every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';
  const stableLastMod = new Date('2026-11-04');

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
    lastModified: stableLastMod,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  try {
    const centers = await getCenters();

    const municipalityCounts = new Map<string, number>();
    const fpFamilySlugs = new Set<string>();
    const fpCycleCounts = new Map<string, number>();

    const centerEntries: MetadataRoute.Sitemap = centers.map((center) => {
      const slug = getCenterSlug(center);
      const muniSlug = getMunicipalitySlug(center.municipality || '');
      if (muniSlug) {
        municipalityCounts.set(muniSlug, (municipalityCounts.get(muniSlug) || 0) + 1);
      }

      const hasFp = Boolean(center.fpCycles && center.fpCycles.length > 0);
      if (center.fpCycles) {
        const seenCyclesInCenter = new Set<string>();
        for (const cycle of center.fpCycles) {
          const fSlug = getFpFamilySlug(cycle.family || '');
          if (fSlug && fSlug !== 'otras-familias') {
            fpFamilySlugs.add(fSlug);
          }
          const cSlug = getFpCycleSlug(cycle);
          if (cSlug && !seenCyclesInCenter.has(cSlug)) {
            seenCyclesInCenter.add(cSlug);
            fpCycleCounts.set(cSlug, (fpCycleCounts.get(cSlug) || 0) + 1);
          }
        }
      }

      return {
        url: `${baseUrl}/centro/${slug}`,
        lastModified: stableLastMod,
        changeFrequency: 'monthly',
        priority: hasFp ? 0.85 : 0.8,
      };
    });

    const provinceEntries: MetadataRoute.Sitemap = ['valencia', 'alicante', 'castellon'].map(
      (pSlug) => ({
        url: `${baseUrl}/provincia/${pSlug}`,
        lastModified: stableLastMod,
        changeFrequency: 'weekly',
        priority: 0.95,
      })
    );

    // Only include indexable municipalities (>= 3 centers) in sitemap to avoid thin/noindex URLs
    const municipalityEntries: MetadataRoute.Sitemap = Array.from(municipalityCounts.entries())
      .filter(([, count]) => count >= 3)
      .map(([mSlug]) => ({
        url: `${baseUrl}/municipio/${mSlug}`,
        lastModified: stableLastMod,
        changeFrequency: 'weekly',
        priority: 0.9,
      }));

    const fpFamilyEntries: MetadataRoute.Sitemap = Array.from(fpFamilySlugs).map((fSlug) => ({
      url: `${baseUrl}/fp/${fSlug}`,
      lastModified: stableLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // Only include indexable FP cycles (>= 2 centers) in sitemap
    const fpCycleEntries: MetadataRoute.Sitemap = Array.from(fpCycleCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([cSlug]) => ({
        url: `${baseUrl}/fp/ciclo/${cSlug}`,
        lastModified: stableLastMod,
        changeFrequency: 'weekly',
        priority: 0.88,
      }));

    return [
      homeEntry,
      ...provinceEntries,
      ...municipalityEntries,
      ...fpFamilyEntries,
      ...fpCycleEntries,
      ...legalEntries,
      ...centerEntries,
    ];
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    return [homeEntry, ...legalEntries];
  }
}
