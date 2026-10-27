import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCenters } from '@/lib/api';
import { formatLocationName, formatSchoolName, getCenterSlug, getFpCycleAcronym, getFpCycleSlug, getFpFamilySlug, getMunicipalitySlug } from '@/lib/slug';
import { Building, ChevronLeft, ChevronRight, GraduationCap, MapPin, ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 86400; // Revalidate every 24 hours

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';

export async function generateStaticParams() {
  const centers = await getCenters();
  const slugs = new Set<string>();

  for (const center of centers) {
    for (const cycle of center.fpCycles || []) {
      const slug = getFpFamilySlug(cycle.family || '');
      if (slug && slug !== 'otras-familias') {
        slugs.add(slug);
      }
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

  let familyName = '';
  const matchingCenters = centers.filter((c) =>
    c.fpCycles?.some((cycle) => {
      if (getFpFamilySlug(cycle.family) === slug) {
        if (!familyName) familyName = cycle.family;
        return true;
      }
      return false;
    })
  );

  if (matchingCenters.length === 0 || !familyName) {
    return {
      title: 'Familia de FP no encontrada | InfoEdu CV',
      robots: { index: false, follow: false },
    };
  }

  const title = `FP ${familyName} en Valencia, Alicante y Castellón (2026/2027) | InfoEdu CV`;
  const description = `Dónde estudiar Formación Profesional (FP) de ${familyName} en la Comunitat Valenciana: ${matchingCenters.length} institutos y centros oficiales de Grado Básico, Medio y Superior en Valencia, Alicante y Castellón.`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `fp ${familyName.toLowerCase()} valencia`,
      `fp ${familyName.toLowerCase()} alicante`,
      `fp ${familyName.toLowerCase()} castellón`,
      `grado superior ${familyName.toLowerCase()} comunitat valenciana`,
      `grado medio ${familyName.toLowerCase()} gva`,
      `dónde estudiar ${familyName.toLowerCase()} en valencia`,
    ],
    alternates: {
      canonical: `/fp/${slug}`,
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
      url: `/fp/${slug}`,
      siteName: 'InfoEdu CV',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `FP ${familyName} en la Comunitat Valenciana - InfoEdu CV`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
    },
  };
}

export default async function FpFamilyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const centers = await getCenters();

  let familyName = '';
  const allFamiliesMap = new Map<string, string>();
  const matchingCenters = [];

  for (const c of centers) {
    let matches = false;
    for (const cycle of c.fpCycles || []) {
      const fSlug = getFpFamilySlug(cycle.family);
      if (fSlug && fSlug !== 'otras-familias') {
        allFamiliesMap.set(fSlug, cycle.family);
      }
      if (fSlug === slug) {
        if (!familyName) familyName = cycle.family;
        matches = true;
      }
    }
    if (matches) {
      matchingCenters.push(c);
    }
  }

  if (matchingCenters.length === 0 || !familyName) {
    notFound();
  }

  // Unique cycles in this family grouped by grade
  const uniqueCyclesMap = new Map<string, { grade: string; name: string; centersCount: number }>();
  for (const c of matchingCenters) {
    for (const cycle of c.fpCycles || []) {
      if (getFpFamilySlug(cycle.family) === slug) {
        const key = `${cycle.grade}:::${cycle.name}`;
        const existing = uniqueCyclesMap.get(key);
        if (existing) {
          existing.centersCount += 1;
        } else {
          uniqueCyclesMap.set(key, {
            grade: cycle.grade,
            name: cycle.name,
            centersCount: 1,
          });
        }
      }
    }
  }
  const uniqueCycles = Array.from(uniqueCyclesMap.values()).sort((a, b) => b.centersCount - a.centersCount);

  const otherFamilies = Array.from(allFamiliesMap.entries())
    .filter(([fSlug]) => fSlug !== slug)
    .slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE_URL}/fp/${slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Formación Profesional (FP)',
            item: `${BASE_URL}/?level=FP`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `FP ${familyName}`,
            item: `${BASE_URL}/fp/${slug}`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${BASE_URL}/fp/${slug}#itemlist`,
        name: `Institutos y Centros de FP de ${familyName} en la Comunitat Valenciana`,
        numberOfItems: matchingCenters.length,
        itemListElement: matchingCenters.slice(0, 100).map((center, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `${center.name} (${center.municipality})`,
          url: `${BASE_URL}/centro/${getCenterSlug(center)}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-transparent py-8 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href="/?level=FP"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400 font-bold transition-colors text-sm uppercase tracking-wide"
          >
            <ChevronLeft className="w-4 h-4" />
            Buscador de FP
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 font-bold">
              FP {familyName}
            </span>
          </nav>
        </div>

        {/* Hero Box */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-rose-600 via-amber-500 to-primary-600" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
              Oferta Oficial FP GVA 2026/2027
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {uniqueCycles.length} Títulos Oficiales
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
            Dónde estudiar FP de {familyName} en la Comunitat Valenciana
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-4xl">
            Catálogo oficial de los <strong>{matchingCenters.length} centros educativos e institutos (IES / CIPFP)</strong> que imparten ciclos formativos de Grado Básico, Grado Medio y Grado Superior de la familia profesional <strong>{familyName}</strong> en las provincias de Valencia, Alicante y Castellón.
          </p>
        </div>

        {/* Official Cycles in this Family */}
        <section className="glass-panel rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            Ciclos Formativos Oficiales de {familyName} ({uniqueCycles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uniqueCycles.map((cycle) => {
              const cycleSlug = getFpCycleSlug(cycle);
              const acronym = getFpCycleAcronym(cycle.name);
              return (
                <Link
                  key={`${cycle.grade}-${cycle.name}`}
                  href={`/fp/ciclo/${cycleSlug}`}
                  className="glass-card p-4 rounded-xl flex items-start justify-between gap-3 group hover:border-primary-400 dark:hover:border-primary-500 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25">
                        {cycle.grade}
                      </span>
                      {acronym && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {acronym}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                      {cycle.name}{acronym ? ` (${acronym})` : ''}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-500/10 text-primary-700 dark:text-primary-300 shrink-0 inline-flex items-center gap-1">
                    {cycle.centersCount} centros
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Centers Teaching this Family */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-5">
            Institutos y Centros con FP de {familyName} ({matchingCenters.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingCenters.map((center) => {
              const centerSlug = getCenterSlug(center);
              const muniSlug = getMunicipalitySlug(center.municipality || '');
              const familyCycles = (center.fpCycles || []).filter(
                (c) => getFpFamilySlug(c.family) === slug
              );

              return (
                <article
                  key={center.id}
                  className="glass-card group relative rounded-2xl overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-rose-600 via-amber-500 to-primary-600" />

                  <div className="p-6 flex-grow flex flex-col pt-7">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {center.type}
                      </span>
                      <Link
                        href={`/municipio/${muniSlug}`}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        {formatLocationName(center.municipality)}
                      </Link>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-3 leading-snug">
                      <Link href={`/centro/${centerSlug}`} className="hover:underline">
                        {formatSchoolName(center.name)}
                      </Link>
                    </h3>

                    <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                      {familyCycles.map((fc) => (
                        <li key={`${fc.grade}-${fc.name}`} className="flex items-start gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>{fc.grade}:</strong> {fc.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-500/5 dark:bg-white/5 border-t border-slate-200/30 dark:border-white/5">
                    <Link
                      href={`/centro/${centerSlug}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-[#d38c28] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm transition-all"
                    >
                      Ver requisitos, contacto y web
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Other FP Families */}
        {otherFamilies.length > 0 && (
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Otras Familias Profesionales de FP en la Comunitat Valenciana
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherFamilies.map(([fSlug, fName]) => (
                <Link
                  key={fSlug}
                  href={`/fp/${fSlug}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold glass-card hover:border-amber-500/50 text-gray-800 dark:text-gray-200 transition-all"
                >
                  FP {fName}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
