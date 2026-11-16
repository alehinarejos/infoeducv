import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCenters } from '@/lib/api';
import CentroDetail from '@/components/CentroDetail';
import { extractIdFromSlug, getCenterSlug } from '@/lib/slug';

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
  const provinceClean = center.province.split('/')[0];

  // High-CTR search intent keywords
  const hasFp = center.levels?.includes('FP') || (center.fpCycles && center.fpCycles.length > 0);
  const hasBach = center.levels?.includes('Bachillerato');
  
  let keyOffer = '';
  if (hasFp && hasBach) {
    keyOffer = 'FP y Bachillerato';
  } else if (hasFp) {
    const cycleCount = center.fpCycles?.length || 0;
    keyOffer = cycleCount > 0 ? `Ciclos FP (${cycleCount})` : 'Formación Profesional';
  } else if (hasBach) {
    keyOffer = 'Bachillerato y ESO';
  } else if (center.levels && center.levels.length > 0) {
    keyOffer = center.levels.join(', ');
  } else {
    keyOffer = center.type;
  }

  const title = `${center.name} (${center.municipality}) | ${keyOffer} y Web Oficial | InfoEdu CV`;
  
  const fpCountStr = center.fpCycles && center.fpCycles.length > 0 ? ` con ${center.fpCycles.length} ciclos formativos oficiales` : '';
  const description = `Toda la información oficial de ${center.name} en ${center.municipality} (${provinceClean}): oferta formativa (${center.levels?.join(', ')})${fpCountStr}, dirección, teléfono y enlace directo a su web oficial sin intermediarios.`;

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
      `colegios en ${center.municipality}`,
      `institutos en ${center.municipality}`,
      `fp en ${center.municipality}`,
      `info edu cv ${center.name}`,
      center.type,
      "educación GVA",
      provinceClean,
      ...(center.levels || [])
    ],
    openGraph: {
      title: `${center.name} (${center.municipality}) - Información y Oferta Educativa`,
      description: description,
      type: "website",
      locale: "es_ES",
      images: [
        {
          url: '/icon-512.png',
          width: 512,
          height: 512,
          alt: `${center.name} - InfoEdu CV`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ['/icon-512.png'],
    },
    alternates: {
      canonical: `/centro/${canonicalSlug}`,
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

  // Find related centers in the same municipality (excluding current center) for internal linking
  let relatedCenters = centers
    .filter((c) => c.municipality === center.municipality && c.id !== center.id)
    .slice(0, 4);

  // If fewer than 4 in the municipality, supplement with centers from the same province
  if (relatedCenters.length < 4) {
    const moreFromProvince = centers
      .filter((c) => c.province === center.province && c.id !== center.id && !relatedCenters.some(rc => rc.id === c.id))
      .slice(0, 4 - relatedCenters.length);
    relatedCenters = [...relatedCenters, ...moreFromProvince];
  }

  return <CentroDetail center={center} relatedCenters={relatedCenters} />;
}
