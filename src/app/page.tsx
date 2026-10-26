import type { Metadata } from 'next';
import Directory from '@/components/Directory';
import FAQ from '@/components/FAQ';
import { getCenters } from '@/lib/api';
import { Suspense } from 'react';

export const revalidate = 86400; // Revalidate every 24 hours

const FILTER_QUERY_KEYS = [
  'q',
  'prov',
  'level',
  'tit',
  'zip',
  'cycleQ',
  'family',
  'fp',
  'view',
  'page',
] as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const hasFilterParams = FILTER_QUERY_KEYS.some((key) => Boolean(params[key]));

  return {
    alternates: {
      canonical: '/',
      languages: {
        es: '/',
        'ca-ES': '/?lang=va',
        en: '/?lang=en',
        'x-default': '/',
      },
    },
    robots: hasFilterParams
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
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
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const centers = await getCenters();

  // Filter on server if search parameters are present in URL
  let filtered = centers;
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.municipality.toLowerCase().includes(q)
    );
  }
  if (params.prov) {
    filtered = filtered.filter((c) => c.province === params.prov);
  }
  if (params.level) {
    filtered = filtered.filter((c) => c.levels.includes(params.level!));
  }
  if (params.tit) {
    if (params.tit === 'privado_todos') {
      filtered = filtered.filter(
        (c) => c.type === 'Privado' || c.type === 'Concertado'
      );
    } else {
      filtered = filtered.filter((c) =>
        c.type.toLowerCase().includes(params.tit!.toLowerCase())
      );
    }
  }

  // Optimize initial slice (first 24 centers) to keep initial HTML under 40 KB
  const initialCenters = filtered.slice(0, 24).map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    address: c.address,
    zipCode: c.zipCode,
    municipality: c.municipality,
    province: c.province,
    lat: c.lat,
    lng: c.lng,
    levels: c.levels,
    url: c.url,
    hasCustomUrl: c.hasCustomUrl,
    gvaUrl: c.gvaUrl,
    socialMedia: c.socialMedia,
    fpCycles: c.fpCycles?.map((fp) => ({
      family: fp.family,
      grade: fp.grade,
      name: fp.name,
    })),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InfoEdu CV",
    "alternateName": [
      "Info Edu CV",
      "infoeducv",
      "info-edu-cv",
      "InfoEdu Comunitat Valenciana",
      "InfoEdu Valencian Community"
    ],
    "url": "https://info-edu-cv.vercel.app",
    "inLanguage": ["es", "ca", "en"],
    "description": "Buscador de colegios, institutos y centros de FP de la Comunitat Valenciana. Cercador de centres educatius. Search schools in the Valencian Community.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://info-edu-cv.vercel.app/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Buscador de Centros Educativos y FP de la Comunitat Valenciana | Cercador de Centres Educatius | InfoEdu CV</h1>
      <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-80px)] font-bold text-gray-500">Cargando directorio...</div>}>
        <Directory initialCenters={initialCenters} totalCount={centers.length} />
      </Suspense>
      <FAQ />
    </>
  );
}
