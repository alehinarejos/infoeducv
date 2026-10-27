import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCenters } from '@/lib/api';
import {
  formatLocationName,
  formatSchoolName,
  getCenterSlug,
  getFpCycleAcronym,
  getFpCycleSlug,
  getFpFamilySlug,
  getMunicipalitySlug,
  getProvinceSlug,
} from '@/lib/slug';
import { ChevronLeft, ChevronRight, GraduationCap, MapPin, ArrowRight, BookOpen, Phone, Globe } from 'lucide-react';
import type { Center } from '@/types';

export const revalidate = 86400; // Revalidate every 24 hours

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';

export async function generateStaticParams() {
  const centers = await getCenters();
  const slugs = new Set<string>();

  for (const center of centers) {
    for (const fp of center.fpCycles || []) {
      const slug = getFpCycleSlug(fp);
      if (slug) slugs.add(slug);
    }
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const centers = await getCenters();

  let cycleName = '';
  let cycleGrade = '';
  let cycleFamily = '';
  const matchingCenters: Center[] = [];

  for (const c of centers) {
    const match = c.fpCycles?.find((fp) => getFpCycleSlug(fp) === slug);
    if (match) {
      if (!cycleName) {
        cycleName = match.name;
        cycleGrade = match.grade;
        cycleFamily = match.family;
      }
      matchingCenters.push(c);
    }
  }

  if (matchingCenters.length === 0) {
    return {
      title: 'Ciclo Formativo de FP no encontrado | InfoEdu CV',
      robots: { index: false, follow: false },
    };
  }

  const acronym = getFpCycleAcronym(cycleName);
  const acronymSuffix = acronym ? ` (${acronym})` : '';
  const publicCount = matchingCenters.filter((c) => c.type === 'Público').length;
  const privateConcertedCount = matchingCenters.length - publicCount;

  const title = `FP ${cycleGrade} en ${cycleName}${acronymSuffix}: ${matchingCenters.length} Institutos en CV`;
  const description = `¿Dónde estudiar ${cycleGrade} en ${cycleName}${acronymSuffix} en Valencia, Alicante y Castellón? Listado oficial de los ${matchingCenters.length} centros acreditados GVA (${publicCount} públicos y ${privateConcertedCount} concertados/privados).`;

  const keywords = [
    `FP ${cycleName}`,
    `${cycleGrade} ${cycleName}`,
    `donde estudiar ${cycleName} Valencia`,
    `donde estudiar ${cycleName} Alicante`,
    `donde estudiar ${cycleName} Castellon`,
    `institutos ${cycleName} Comunitat Valenciana`,
    cycleFamily,
  ];
  if (acronym) {
    keywords.unshift(
      `FP ${acronym} Valencia`,
      `Grado Superior ${acronym}`,
      `donde estudiar ${acronym} Valencia`,
      `institutos ${acronym} publicos Valencia`
    );
  }

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: `/fp/ciclo/${slug}`,
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
      url: `/fp/ciclo/${slug}`,
      siteName: 'InfoEdu CV',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: '/icon-512.png',
          width: 512,
          height: 512,
          alt: `FP ${cycleGrade} en ${cycleName}${acronymSuffix} - InfoEdu CV`,
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

export default async function FpCyclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const centers = await getCenters();

  let cycleName = '';
  let cycleGrade = '';
  let cycleFamily = '';
  const matchingCenters: Center[] = [];

  for (const c of centers) {
    const match = c.fpCycles?.find((fp) => getFpCycleSlug(fp) === slug);
    if (match) {
      if (!cycleName) {
        cycleName = match.name;
        cycleGrade = match.grade;
        cycleFamily = match.family;
      }
      matchingCenters.push(c);
    }
  }

  if (matchingCenters.length === 0) {
    notFound();
  }

  const acronym = getFpCycleAcronym(cycleName);
  const acronymBadge = acronym ? ` (${acronym})` : '';
  const familySlug = getFpFamilySlug(cycleFamily);

  // Sort centers: Public first, then alphabetically by municipality and name
  const sortedCenters = [...matchingCenters].sort((a, b) => {
    if (a.type === 'Público' && b.type !== 'Público') return -1;
    if (a.type !== 'Público' && b.type === 'Público') return 1;
    const muniCmp = (a.municipality || '').localeCompare(b.municipality || '', 'es');
    if (muniCmp !== 0) return muniCmp;
    return a.name.localeCompare(b.name, 'es');
  });

  const valenciaCenters = sortedCenters.filter((c) => getProvinceSlug(c.province || '') === 'valencia');
  const alicanteCenters = sortedCenters.filter((c) => getProvinceSlug(c.province || '') === 'alicante');
  const castellonCenters = sortedCenters.filter((c) => getProvinceSlug(c.province || '') === 'castellon');
  const publicCount = matchingCenters.filter((c) => c.type === 'Público').length;

  // Find related cycles in the same FP family
  const relatedCyclesMap = new Map<string, { grade: string; name: string; slug: string; count: number }>();
  for (const c of centers) {
    for (const fp of c.fpCycles || []) {
      if (fp.family === cycleFamily) {
        const cSlug = getFpCycleSlug(fp);
        if (cSlug !== slug) {
          const existing = relatedCyclesMap.get(cSlug) || {
            grade: fp.grade,
            name: fp.name,
            slug: cSlug,
            count: 0,
          };
          existing.count += 1;
          relatedCyclesMap.set(cSlug, existing);
        }
      }
    }
  }
  const relatedCycles = Array.from(relatedCyclesMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Structured Data: BreadcrumbList + Course + ItemList + FAQPage
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
            name: `FP ${cycleFamily}`,
            item: `${BASE_URL}/fp/${familySlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${cycleGrade} en ${cycleName}${acronymBadge}`,
            item: `${BASE_URL}/fp/ciclo/${slug}`,
          },
        ],
      },
      {
        '@type': 'Course',
        name: `${cycleGrade} en ${cycleName}${acronymBadge}`,
        description: `Ciclo formativo oficial de Formación Profesional (${cycleGrade}) en ${cycleName}, perteneciente a la familia profesional de ${cycleFamily} en la Comunitat Valenciana.`,
        educationalCredentialAwarded: cycleGrade,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Generalitat Valenciana - Centros Docentes FP',
          url: `${BASE_URL}/fp/ciclo/${slug}`,
        },
      },
      {
        '@type': 'ItemList',
        name: `Institutos donde estudiar ${cycleGrade} en ${cycleName}${acronymBadge} en la Comunitat Valenciana`,
        numberOfItems: sortedCenters.length,
        itemListElement: sortedCenters.slice(0, 50).map((center, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'EducationalOrganization',
            name: formatSchoolName(center.name),
            url: `${BASE_URL}/centro/${getCenterSlug(center)}`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: formatLocationName(center.address),
              postalCode: center.zipCode,
              addressLocality: formatLocationName(center.municipality),
              addressRegion: formatLocationName(center.province),
              addressCountry: 'ES',
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `¿Dónde estudiar ${cycleGrade} en ${cycleName}${acronymBadge} en la Comunitat Valenciana?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Puedes estudiar el ciclo formativo de ${cycleGrade} en ${cycleName}${acronymBadge} en ${matchingCenters.length} centros educativos acreditados de la Comunitat Valenciana: ${valenciaCenters.length} en la provincia de Valencia, ${alicanteCenters.length} en Alicante y ${castellonCenters.length} en Castellón.`,
            },
          },
          {
            '@type': 'Question',
            name: `¿Cuántos institutos públicos imparten ${cycleName}${acronymBadge}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `De los ${matchingCenters.length} centros que imparten ${cycleGrade} en ${cycleName}${acronymBadge}, ${publicCount} son institutos de titularidad pública de la Generalitat Valenciana (GVA) y ${matchingCenters.length - publicCount} son centros concertados o privados.`,
            },
          },
        ],
      },
    ],
  };

  const provinceGroups = [
    { name: 'Valencia', slug: 'valencia', items: valenciaCenters },
    { name: 'Alicante', slug: 'alicante', items: alicanteCenters },
    { name: 'Castellón', slug: 'castellon', items: castellonCenters },
  ].filter((g) => g.items.length > 0);

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
            href={`/fp/${familySlug}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver a FP {cycleFamily}
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 shrink-0 text-gray-400" />
            <Link href={`/fp/${familySlug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              FP {cycleFamily}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 shrink-0 text-gray-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[220px] sm:max-w-none">
              {cycleName}{acronymBadge}
            </span>
          </nav>
        </div>

        {/* Hero Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-8">
          <div className="bg-linear-to-r from-indigo-700 to-blue-800 px-6 py-8 sm:px-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/15 text-white border border-white/25">
                {cycleGrade}
              </span>
              {acronym && (
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-400/25 text-amber-100 border border-amber-300/40">
                  Siglas: {acronym}
                </span>
              )}
              <Link
                href={`/fp/${familySlug}`}
                className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-blue-500/30 text-blue-100 border border-blue-400/30 hover:bg-blue-500/50 transition-colors"
              >
                Familia: {cycleFamily}
              </Link>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Dónde estudiar {cycleGrade} en {cycleName}{acronymBadge}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed">
              Guía actualizada de los <strong>{matchingCenters.length} institutos y centros de FP</strong> acreditados por la Generalitat Valenciana donde se imparte el título oficial de{' '}
              <strong>{cycleGrade} en {cycleName}{acronymBadge}</strong> en Valencia, Alicante y Castellón.
            </p>
          </div>

          {/* KPI Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{matchingCenters.length}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Centros Totales ({publicCount} Públicos)</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{valenciaCenters.length}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Provincia de Valencia</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">{alicanteCenters.length}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Provincia de Alicante</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{castellonCenters.length}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Provincia de Castellón</p>
            </div>
          </div>
        </div>

        {/* Center Listings by Province */}
        {provinceGroups.map((group) => (
          <section key={group.slug} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Institutos con {cycleName}{acronymBadge} en {group.name} ({group.items.length})
              </h2>
              <Link
                href={`/provincia/${group.slug}`}
                className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline hidden sm:inline-flex items-center gap-1"
              >
                Ver provincia de {group.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((center) => {
                const centerSlug = getCenterSlug(center);
                const muniSlug = getMunicipalitySlug(center.municipality || '');
                const formattedName = formatSchoolName(center.name);
                const formattedMuni = formatLocationName(center.municipality);
                const formattedAddress = formatLocationName(center.address);

                return (
                  <article
                    key={center.id}
                    className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            center.type === 'Público'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          {center.type}
                        </span>
                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                          Cód. {center.id}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Link href={`/centro/${centerSlug}`}>
                          {formattedName}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {formattedAddress} ·{' '}
                          <Link
                            href={`/municipio/${muniSlug}`}
                            className="font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                          >
                            {formattedMuni}
                          </Link>
                        </span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {center.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {center.phone}
                          </span>
                        )}
                        {center.url && (
                          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                            <Globe className="w-3.5 h-3.5" />
                            Web oficial
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/centro/${centerSlug}`}
                        className="inline-flex items-center text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Ver centro
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {/* Related Cycles in the same Family */}
        {relatedCycles.length > 0 && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Otros ciclos de FP de la familia {cycleFamily}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Explora otras titulaciones oficiales relacionadas dentro de la rama profesional de {cycleFamily}:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relatedCycles.map((rc) => {
                const rcAcronym = getFpCycleAcronym(rc.name);
                return (
                  <Link
                    key={rc.slug}
                    href={`/fp/ciclo/${rc.slug}`}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col justify-between gap-1.5 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {rc.grade}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {rc.count} {rc.count === 1 ? 'centro' : 'centros'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {rc.name}{rcAcronym ? ` (${rcAcronym})` : ''}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
