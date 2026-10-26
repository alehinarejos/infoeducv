import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCenters } from '@/lib/api';
import CentroDetail from '@/components/CentroDetail';
import CenterJsonLd, { type MunicipalityStats } from '@/components/seo/CenterJsonLd';
import { extractIdFromSlug, getCenterSlug } from '@/lib/slug';
import type { Center } from '@/types';

export const revalidate = 86400; // Revalidate every 24 hours

function buildOptimizedCenterTitle(center: Center): string {
  const name = center.name.trim();
  const muni = center.municipality?.trim() || 'Comunitat Valenciana';
  const hasFp = center.levels?.includes('FP') || Boolean(center.fpCycles?.length);
  const hasBach = center.levels?.includes('Bachillerato');

  let keyOffer = center.type && center.type !== 'Desconocido' ? `Centro ${center.type}` : 'Centro Educativo';
  if (hasFp && hasBach) {
    keyOffer = 'FP y Bachillerato';
  } else if (hasFp) {
    const cycleCount = center.fpCycles?.length || 0;
    keyOffer = cycleCount > 0 ? `${cycleCount} Ciclos FP` : 'Formación Profesional';
  } else if (hasBach) {
    keyOffer = 'Bachillerato y ESO';
  } else if (center.levels && center.levels.length > 0) {
    keyOffer = center.levels.slice(0, 2).join(' y ');
  }

  // Formula de alto CTR: [Nombre] ([Municipio]): [Oferta] 2026/2027 | InfoEdu CV
  const candidateWithYear = `${name} (${muni}): ${keyOffer} 2026/27 | InfoEdu CV`;
  if (candidateWithYear.length <= 65) return candidateWithYear;

  const fullCandidate = `${name} - ${keyOffer} en ${muni} | InfoEdu CV`;
  if (fullCandidate.length <= 65) return fullCandidate;

  const mediumCandidate = `${name} (${muni}) - ${keyOffer} | InfoEdu CV`;
  if (mediumCandidate.length <= 65) return mediumCandidate;

  const shortCandidate = `${name} en ${muni} | InfoEdu CV`;
  return shortCandidate.length <= 65 ? shortCandidate : `${name.slice(0, 42).trim()}… | InfoEdu CV`;
}

function buildOptimizedCenterDescription(center: Center, provinceClean: string): string {
  const muni = center.municipality?.trim() || provinceClean;
  const typeLabel =
    center.type && center.type !== 'Desconocido' ? `Centro ${center.type.toLowerCase()}` : 'Centro educativo';
  const levelsStr =
    center.levels && center.levels.length > 0 ? ` Imparte ${center.levels.join(', ')}.` : '';
  const fpCountStr =
    center.fpCycles && center.fpCycles.length > 0
      ? ` ${center.fpCycles.length} ciclos de FP (2026/2027).`
      : '';
  const phoneStr = center.phone ? ` Tel: ${center.phone}.` : '';

  const rawDesc = `${typeLabel} ${center.name} en ${muni} (${provinceClean}, Cód. ${center.id}).${levelsStr}${fpCountStr}${phoneStr} Dirección, mapa y web oficial GVA.`;

  if (rawDesc.length <= 158) return rawDesc;
  return `${rawDesc.slice(0, 155).trim()}...`;
}

export async function generateStaticParams() {
  const centers = await getCenters();
  return centers.map((center) => ({
    id: getCenterSlug(center),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: slugOrId } = await params;
  const rawId = extractIdFromSlug(slugOrId);
  const centers = await getCenters();
  const center = centers.find((c) => c.id === rawId);

  if (!center) {
    return {
      title: 'Centro no encontrado | InfoEdu CV',
      robots: { index: false, follow: false },
    };
  }

  const canonicalSlug = getCenterSlug(center);
  const provinceClean = center.province?.split('/')[0]?.trim() || 'Comunitat Valenciana';
  const title = buildOptimizedCenterTitle(center);
  const description = buildOptimizedCenterDescription(center, provinceClean);

  return {
    title: {
      absolute: title
    },
    description: description,
    keywords: [
      center.name,
      `colegio ${center.name}`,
      `instituto ${center.name}`,
      `fp ${center.name}`,
      `${center.name} ${center.municipality}`,
      `teléfono ${center.name}`,
      `código centro ${center.id}`,
      `colegios en ${center.municipality}`,
      `institutos en ${center.municipality}`,
      `fp en ${center.municipality}`,
      center.type,
      "educación GVA",
      provinceClean,
      ...(center.levels || [])
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${center.name} (${center.municipality}) - Oferta Educativa 2026/2027`,
      description: description,
      url: `/centro/${canonicalSlug}`,
      siteName: 'InfoEdu CV',
      type: "website",
      locale: "es_ES",
      alternateLocale: ["ca_ES", "en_US"],
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${center.name} en ${center.municipality} - InfoEdu CV`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ['/logo.png'],
    },
    alternates: {
      canonical: `/centro/${canonicalSlug}`,
      languages: {
        'es': `/centro/${canonicalSlug}`,
        'ca-ES': `/centro/${canonicalSlug}?lang=va`,
        'en': `/centro/${canonicalSlug}?lang=en`,
        'x-default': `/centro/${canonicalSlug}`,
      },
    }
  };
}

export default async function CentroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slugOrId } = await params;
  const rawId = extractIdFromSlug(slugOrId);
  const centers = await getCenters();
  const center = centers.find((c) => c.id === rawId);

  if (!center) {
    notFound();
  }

  const canonicalSlug = getCenterSlug(center);

  // If accessed by old numeric ID or outdated slug, permanent redirect (308) to canonical semantic slug
  if (slugOrId !== canonicalSlug) {
    permanentRedirect(`/centro/${canonicalSlug}`);
  }

  // Compute municipality context statistics on the server to enrich programmatic content
  const sameMuniCenters = centers.filter((c) => c.municipality === center.municipality);
  const publicInMuni = sameMuniCenters.filter((c) => c.type === 'Público').length;
  const fpInMuni = sameMuniCenters.filter(
    (c) => c.levels?.includes('FP') || (c.fpCycles && c.fpCycles.length > 0)
  ).length;

  const municipalityStats: MunicipalityStats = {
    totalCenters: sameMuniCenters.length,
    publicCount: publicInMuni,
    concertedPrivateCount: sameMuniCenters.length - publicInMuni,
    fpCentersCount: fpInMuni,
  };

  // Find related centers in the same municipality (excluding current center) for internal linking
  let relatedCenters = sameMuniCenters
    .filter((c) => c.id !== center.id)
    .slice(0, 8);

  // If fewer than 8 in the municipality, supplement with centers from the same province
  if (relatedCenters.length < 8) {
    const moreFromProvince = centers
      .filter((c) => c.province === center.province && c.id !== center.id && !relatedCenters.some(rc => rc.id === c.id))
      .slice(0, 8 - relatedCenters.length);
    relatedCenters = [...relatedCenters, ...moreFromProvince];
  }

  return (
    <>
      <CenterJsonLd center={center} municipalityStats={municipalityStats} />
      <CentroDetail
        center={center}
        relatedCenters={relatedCenters}
        municipalityStats={municipalityStats}
      />
    </>
  );
}
