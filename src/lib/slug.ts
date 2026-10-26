/**
 * Utility functions for generating and parsing SEO-friendly semantic slugs.
 */

export function cleanTextForSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented letters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
    .replace(/-+/g, '-'); // Collapse multiple hyphens
}

export function getCenterSlug(center: { id: string; name: string; municipality?: string }): string {
  const cleanName = cleanTextForSlug(center.name);
  const cleanMuni = cleanTextForSlug(center.municipality || '');
  
  if (cleanMuni) {
    return `${cleanName}-${cleanMuni}-${center.id}`;
  }
  return `${cleanName}-${center.id}`;
}

export function getMunicipalitySlug(municipality: string): string {
  return cleanTextForSlug(municipality);
}

export function getFpFamilySlug(family: string): string {
  return cleanTextForSlug(family);
}

export function extractIdFromSlug(slugOrId: string): string {
  if (!slugOrId) return '';
  
  // If it's already an 8-digit center code (standard in GVA/Spain)
  if (/^\d{8}$/.test(slugOrId)) {
    return slugOrId;
  }

  // If it's a slug like "florida-universitaria-catarroja-46017365", extract the trailing 8-digit code
  const match = slugOrId.match(/(\d{8})$/);
  if (match) {
    return match[1];
  }

  // Fallback: match any trailing number sequence if not exactly 8 digits
  const fallbackMatch = slugOrId.match(/(\d+)$/);
  if (fallbackMatch) {
    return fallbackMatch[1];
  }

  return slugOrId;
}
