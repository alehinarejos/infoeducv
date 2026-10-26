import React from 'react';
import type { Center, FPCycle } from '@/types';
import { cleanTextForSlug, getCenterSlug } from '@/lib/slug';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';

interface CenterJsonLdProps {
  center: Center;
}

export function isValidCoordinate(lat?: number, lng?: number): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
  // Rango geográfico aproximado de la Comunitat Valenciana (37.5°N a 41.0°N, -2.0°W a 1.0°E)
  return lat >= 37.5 && lat <= 41.0 && lng >= -2.0 && lng <= 1.0;
}

function getSchemaOrgType(center: Center): 'School' | 'HighSchool' | 'EducationalOrganization' {
  const levels = center.levels || [];
  if (levels.includes('ESO') || levels.includes('Bachillerato')) {
    return 'HighSchool';
  }
  if (levels.includes('Infantil') || levels.includes('Primaria')) {
    return 'School';
  }
  return 'EducationalOrganization';
}

function buildSameAsLinks(center: Center): string[] {
  const links: string[] = [];
  if (center.url) links.push(center.url);
  if (center.gvaUrl && center.gvaUrl !== center.url) links.push(center.gvaUrl);
  if (center.socialMedia) {
    Object.values(center.socialMedia).forEach((socialUrl) => {
      if (socialUrl && typeof socialUrl === 'string' && socialUrl.startsWith('http')) {
        links.push(socialUrl);
      }
    });
  }
  return Array.from(new Set(links));
}

function buildCourseNodes(center: Center, centerUrl: string, orgId: string) {
  if (!center.fpCycles || center.fpCycles.length === 0) return [];

  return center.fpCycles
    .filter((cycle): cycle is FPCycle => Boolean(cycle.name && cycle.name !== 'Desconocido'))
    .map((cycle) => {
      const cycleSlug = cleanTextForSlug(`${cycle.grade}-${cycle.name}`);
      return {
        '@type': 'EducationalOccupationalProgram',
        '@id': `${centerUrl}#fp-${cycleSlug}`,
        name: `${cycle.grade} en ${cycle.name}`,
        description: `Ciclo formativo de ${cycle.grade} en ${cycle.name} (Familia profesional: ${cycle.family}) impartido en ${center.name}, ${center.municipality}.`,
        educationalProgramMode: 'presencial',
        educationalCredentialAwarded:
          cycle.grade === 'Grado Superior'
            ? 'Técnico Superior de Formación Profesional'
            : cycle.grade === 'Grado Medio'
              ? 'Técnico de Formación Profesional'
              : 'Título Profesional Básico',
        ...(cycle.family && cycle.family !== 'Otras familias'
          ? { occupationalCategory: cycle.family }
          : {}),
        provider: {
          '@id': orgId,
        },
        hasCourse: {
          '@type': 'Course',
          name: cycle.name,
          courseCode: `${center.id}-${cycleSlug}`,
          description: `Formación Profesional oficial de ${cycle.grade} en ${cycle.name} (${cycle.family}).`,
          provider: {
            '@id': orgId,
          },
        },
      };
    });
}

export default function CenterJsonLd({ center }: CenterJsonLdProps) {
  const canonicalSlug = getCenterSlug(center);
  const centerUrl = `${BASE_URL}/centro/${canonicalSlug}`;
  const orgId = `${centerUrl}#organization`;
  const provinceClean = center.province?.split('/')[0]?.trim() || 'Comunitat Valenciana';

  // Construcción condicional de PostalAddress evitando campos vacíos
  const hasAddressData = Boolean(center.address || center.municipality || center.zipCode);
  const addressNode = hasAddressData
    ? {
        '@type': 'PostalAddress',
        ...(center.address?.trim() ? { streetAddress: center.address.trim() } : {}),
        ...(center.municipality?.trim() ? { addressLocality: center.municipality.trim() } : {}),
        ...(center.zipCode?.trim() ? { postalCode: center.zipCode.trim() } : {}),
        addressRegion: provinceClean,
        addressCountry: 'ES',
      }
    : undefined;

  // Construcción condicional de GeoCoordinates solo si lat/lng son válidos
  const geoNode = isValidCoordinate(center.lat, center.lng)
    ? {
        '@type': 'GeoCoordinates',
        latitude: center.lat,
        longitude: center.lng,
      }
    : undefined;

  const sameAs = buildSameAsLinks(center);
  const programNodes = buildCourseNodes(center, centerUrl, orgId);

  const educationalOrgNode: Record<string, unknown> = {
    '@type': getSchemaOrgType(center),
    '@id': orgId,
    identifier: center.id,
    name: center.name,
    description: `Centro educativo ${center.type?.toLowerCase() || ''} en ${center.municipality || provinceClean} (${provinceClean}).`,
    url: centerUrl,
    image: `${BASE_URL}/logo.png`,
    logo: `${BASE_URL}/logo.png`,
    isAccessibleForFree: center.type === 'Público',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Titularidad',
        value: center.type || 'No especificada',
      },
      {
        '@type': 'PropertyValue',
        name: 'Código de Centro GVA',
        value: center.id,
      },
    ],
    ...(center.phone?.trim() ? { telephone: center.phone.trim() } : {}),
    ...(addressNode ? { address: addressNode } : {}),
    ...(geoNode ? { geo: geoNode } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(center.levels && center.levels.length > 0 ? { knowsAbout: center.levels } : {}),
  };

  // BreadcrumbList libre de elementos indefinidos
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: BASE_URL,
    },
    ...(provinceClean
      ? [
          {
            '@type': 'ListItem',
            position: 2,
            name: provinceClean,
            item: `${BASE_URL}/?prov=${encodeURIComponent(center.province)}`,
          },
        ]
      : []),
    ...(center.municipality
      ? [
          {
            '@type': 'ListItem',
            position: provinceClean ? 3 : 2,
            name: center.municipality,
            item: `${BASE_URL}/?q=${encodeURIComponent(center.municipality)}`,
          },
        ]
      : []),
    {
      '@type': 'ListItem',
      position: (provinceClean ? 1 : 0) + (center.municipality ? 1 : 0) + 2,
      name: center.name,
      item: centerUrl,
    },
  ];

  const breadcrumbNode = {
    '@type': 'BreadcrumbList',
    '@id': `${centerUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  };

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [educationalOrgNode, breadcrumbNode, ...programNodes],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdGraph).replace(/</g, '\\u003c'),
      }}
    />
  );
}
