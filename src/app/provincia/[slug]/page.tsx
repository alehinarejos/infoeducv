import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCenters } from '@/lib/api';
import {
  formatLocationName,
  getFpFamilySlug,
  getMunicipalitySlug,
  getProvinceSlug,
} from '@/lib/slug';
import { Building, ChevronLeft, ChevronRight, GraduationCap, MapPin, ArrowRight } from 'lucide-react';

export const revalidate = 86400; // Revalidate every 24 hours

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';

export async function generateStaticParams() {
  return [
    { slug: 'valencia' },
    { slug: 'alicante' },
    { slug: 'castellon' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const centers = await getCenters();
  const provCenters = centers.filter((c) => getProvinceSlug(c.province || '') === slug);

  if (provCenters.length === 0) {
    return {
      title: 'Provincia no encontrada | InfoEdu CV',
      robots: { index: false, follow: false },
    };
  }

  const provinceName = formatLocationName(provCenters[0].province || '');
  const publicCount = provCenters.filter((c) => c.type === 'Público').length;
  const concertedPrivateCount = provCenters.length - publicCount;
  const fpCount = provCenters.filter((c) => c.levels?.includes('FP') || (c.fpCycles && c.fpCycles.length > 0)).length;

  const muniSet = new Set(provCenters.map((c) => c.municipality).filter(Boolean));

  const title = `Colegios, Institutos y FP en la Provincia de ${provinceName} (2026/27) - InfoEdu CV`;
  const description = `Directorio oficial de los ${provCenters.length} centros educativos en los ${muniSet.size} municipios de la provincia de ${provinceName}: ${publicCount} públicos, ${concertedPrivateCount} concertados/privados y ${fpCount} centros con FP.`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `colegios provincia de ${provinceName}`,
      `institutos provincia de ${provinceName}`,
      `fp en ${provinceName}`,
      `centros educativos ${provinceName} municipios`,
      `colegios públicos ${provinceName}`,
      `colegios concertados ${provinceName}`,
    ],
    alternates: {
      canonical: `/provincia/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: `/provincia/${slug}`,
      siteName: 'InfoEdu CV',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: '/icon-512.png',
          width: 512,
          height: 512,
          alt: `Centros educativos en la provincia de ${provinceName} - InfoEdu CV`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icon-512.png'],
    },
  };
}

export default async function ProvinciaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const centers = await getCenters();
  const provCenters = centers.filter((c) => getProvinceSlug(c.province || '') === slug);

  if (provCenters.length === 0) {
    notFound();
  }

  const rawProvince = provCenters[0].province;
  const provinceName = formatLocationName(rawProvince || '');

  const publicCount = provCenters.filter((c) => c.type === 'Público').length;
  const concertedCount = provCenters.filter((c) => c.type === 'Concertado').length;
  const privateCount = provCenters.filter((c) => c.type === 'Privado').length;
  const fpCount = provCenters.filter((c) => c.levels?.includes('FP') || (c.fpCycles && c.fpCycles.length > 0)).length;

  // Group municipalities in this province
  const muniMap = new Map<string, { rawName: string; displayName: string; slug: string; total: number; fp: number; public: number }>();
  const fpFamilyCounts = new Map<string, number>();

  for (const c of provCenters) {
    if (c.municipality) {
      const mSlug = getMunicipalitySlug(c.municipality);
      const existing = muniMap.get(mSlug) || {
        rawName: c.municipality,
        displayName: formatLocationName(c.municipality),
        slug: mSlug,
        total: 0,
        fp: 0,
        public: 0,
      };
      existing.total += 1;
      if (c.type === 'Público') existing.public += 1;
      if (c.levels?.includes('FP') || (c.fpCycles && c.fpCycles.length > 0)) existing.fp += 1;
      muniMap.set(mSlug, existing);
    }

    if (c.fpCycles) {
      const seenFamilies = new Set<string>();
      for (const fp of c.fpCycles) {
        if (fp.family && !seenFamilies.has(fp.family)) {
          seenFamilies.add(fp.family);
          fpFamilyCounts.set(fp.family, (fpFamilyCounts.get(fp.family) || 0) + 1);
        }
      }
    }
  }

  const allMunicipalities = Array.from(muniMap.values());
  const topMunicipalities = [...allMunicipalities].sort((a, b) => b.total - a.total).slice(0, 16);
  const alphabeticalMunicipalities = [...allMunicipalities].sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'es')
  );
  const topFpFamilies = Array.from(fpFamilyCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const otherProvinces = [
    { slug: 'valencia', name: 'Valencia' },
    { slug: 'alicante', name: 'Alicante' },
    { slug: 'castellon', name: 'Castellón' },
  ].filter((p) => p.slug !== slug);

  // Structured Data: ItemList of top municipalities + BreadcrumbList + FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: `${BASE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Provincia de ${provinceName}`,
            item: `${BASE_URL}/provincia/${slug}`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Municipios con centros educativos en la provincia de ${provinceName}`,
        numberOfItems: allMunicipalities.length,
        itemListElement: topMunicipalities.map((m, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `Colegios e Institutos en ${m.displayName} (${m.total} centros)`,
          url: `${BASE_URL}/municipio/${m.slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `¿Cuántos colegios e institutos hay en la provincia de ${provinceName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `La provincia de ${provinceName} cuenta con ${provCenters.length} centros educativos oficiales registrados en la GVA repartidos en ${allMunicipalities.length} municipios: ${publicCount} centros públicos, ${concertedCount} concertados y ${privateCount} privados.`,
            },
          },
          {
            '@type': 'Question',
            name: `¿Cuántos institutos imparten Formación Profesional (FP) en la provincia de ${provinceName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `En la provincia de ${provinceName} existen ${fpCount} centros e institutos acreditados que imparten ciclos formativos de Formación Profesional (Grado Básico, Grado Medio y Grado Superior).`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver al buscador
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 shrink-0 text-gray-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Provincia de {provinceName}
            </span>
          </nav>
        </div>

        {/* Hero Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-8">
          <div className="bg-linear-to-r from-blue-800 to-indigo-900 px-6 py-8 sm:px-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/15 text-white border border-white/25">
                Comunitat Valenciana
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/30 text-blue-100 border border-blue-400/30">
                Curso 2026/2027
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Colegios, Institutos y FP en la Provincia de {provinceName}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed">
              Consulta los <strong>{provCenters.length} centros educativos oficiales</strong> distribuidos en los{' '}
              <strong>{allMunicipalities.length} municipios</strong> de la provincia de {provinceName}: colegios de Infantil y Primaria, institutos de ESO y Bachillerato y centros de Formación Profesional (FP).
            </p>
          </div>

          {/* KPI Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{provCenters.length}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Centros Totales</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{allMunicipalities.length}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Municipios</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">{publicCount}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Centros Públicos</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{fpCount}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Centros con FP</p>
            </div>
          </div>
        </div>

        {/* Top Municipalities Grid */}
        <section className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Principales municipios en {provinceName}
            </h2>
            <Link
              href={`/?prov=${encodeURIComponent(rawProvince)}`}
              className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver mapa interactivo de {provinceName}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {topMunicipalities.map((m) => (
              <Link
                key={m.slug}
                href={`/municipio/${m.slug}`}
                className="group bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {m.displayName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {m.total} centros · {m.public} públicos{m.fp > 0 ? ` · ${m.fp} FP` : ''}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        {/* Top FP Families in this Province */}
        {topFpFamilies.length > 0 && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6 sm:p-8 mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Familias de Formación Profesional (FP) en {provinceName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Explora las familias profesionales con más oferta de ciclos formativos en los institutos de la provincia de {provinceName}:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {topFpFamilies.map(([family, count]) => (
                <Link
                  key={family}
                  href={`/fp/${getFpFamilySlug(family)}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <span>{family}</span>
                  <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-blue-600 text-white font-bold">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Complete Alphabetical Directory of All Municipalities in the Province */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6 sm:p-8 mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Todos los municipios de la provincia de {provinceName} ({allMunicipalities.length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Selecciona cualquier localidad de {provinceName} para consultar el listado completo de sus colegios, institutos, teléfonos y oferta de FP:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {alphabeticalMunicipalities.map((m) => (
              <Link
                key={m.slug}
                href={`/municipio/${m.slug}`}
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 border border-gray-100 dark:border-gray-800 transition-colors flex items-center justify-between gap-2"
              >
                <span className="truncate">{m.displayName}</span>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 shrink-0">
                  ({m.total})
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Provinces Navigation */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Otras provincias de la Comunitat Valenciana
          </h2>
          <div className="flex flex-wrap gap-3">
            {otherProvinces.map((p) => (
              <Link
                key={p.slug}
                href={`/provincia/${p.slug}`}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
              >
                <span>Colegios e Institutos en la provincia de {p.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
