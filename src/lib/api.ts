import { Center, SocialMediaLinks } from '@/types';
import { cache } from 'react';
import privateWebsites from '@/data/privateWebsites.json';
import socialMedia from '@/data/socialMedia.json';
import centersFallback from '@/data/centersFallback.json';

const privateWebsitesMap = privateWebsites as Record<string, string>;
const socialMediaMap = socialMedia as Record<string, SocialMediaLinks>;

function enrichCenterWithCustomData(center: Center): Center {
  const customWebsite = privateWebsitesMap[center.id];
  const customSocial = socialMediaMap[center.id];
  return {
    ...center,
    url: customWebsite || center.url,
    hasCustomUrl: Boolean(customWebsite) || center.hasCustomUrl,
    socialMedia: customSocial || center.socialMedia,
  };
}

let cachedCenters: Center[] | null = null;

/**
 * Loads the complete GVA educational centers catalog from the local static dataset
 * enriched with official custom websites and social media profiles.
 * Using the pre-built static dataset avoids Vercel Data Cache / ISR writes and external GVA API timeouts.
 */
export const getCenters = cache(async (): Promise<Center[]> => {
  if (cachedCenters) {
    return cachedCenters;
  }

  cachedCenters = (centersFallback as Center[]).map(enrichCenterWithCustomData);
  return cachedCenters;
});
