import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCenters } from '@/lib/api';
import { getCenterSlug, getFpFamilySlug, getMunicipalitySlug } from '@/lib/slug';
import { Building, ChevronLeft, ChevronRight, GraduationCap, MapPin, ArrowRight, Globe, Phone, BookOpen } from 'lucide-react';

export const revalidate = 86400; // Revalidate every 24 hours

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://info-edu-cv.vercel.app';

export async function generateStaticParams() {
  const centers = await getCenters();
  const slugs = new Set<string>();

  for (const center of centers) {
    const slug = getMunicipalitySlug(center.municipality || '');
    if (slug) slugs.add(slug);
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
  const muniCenters = centers.filter((c) => getMunicipalitySlug(c.municipality || '') === slug);

  if (muniCenters.length === 0) {
    return {
      title: 'Municipio no encontrado | InfoEdu CV',
      robots: { index: false, follow: false },
    };
  }

  const municipalityName = muniCenters[0].municipality;
  const provinceClean = muniCenters[0].province?.split('/')[0]?.trim() || 'Comunitat Valenciana';
  const publicCount = muniCenters.filter((c) => c.type === 'Público').length;
  const concertedPrivateCount = muniCenters.length - publicCount;
  const fpCount = muniCenters.filter((c) => c.levels?.includes('FP') || (c.fpCycles && c.fpCycles.length > 0)).length;

  const title = `Colegios, Institutos y FP en ${municipalityName} (2026/2027) | InfoEdu CV`;
  const description = `Guía oficial de los ${muniCenters.length} centros educativos en ${municipalityName} (${provinceClean}): ${publicCount} públicos, ${concertedPrivateCount} concertados/privados y ${fpCount} centros con FP. Teléfono, dirección y web GVA.`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `colegios en ${municipalityName}`,
      `institutos en ${municipalityName}`,
      `colegios públicos ${municipalityName}`,
      `colegios concertados ${municipalityName}`,
      `fp en ${municipalityName}`,
      `centros educativos ${municipalityName}`,
      `admisión colegios ${municipalityName} 2026 2027`,
    ],
    alternates: {
      canonical: `/municipio/${slug}`,
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
      url: `/municipio/${slug}`,
      siteName: 'InfoEdu CV',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `Centros educativos en ${municipalityName} - InfoEdu CV`,
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

export default async function MunicipioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const centers = await getCenters();
  const muniCenters = centers.filter((c) => getMunicipalitySlug(c.municipality || '') === slug);

  if (muniCenters.length === 0) {
    notFound();
  }

  const municipalityName = muniCenters[0].municipality;
  const provinceRaw = muniCenters[0].province;
  const provinceClean = provinceRaw?.split('/')[0]?.trim() || 'Comunitat Valenciana';

  const publicCount = muniCenters.filter((c) => c.type === 'Público').length;
  const concertedCount = muniCenters.filter((c) => c.type === 'Concertado').length;
  const privateCount = muniCenters.filter((c) => c.type === 'Privado').length;
  const fpCenters = muniCenters.filter((c) => c.levels?.includes('FP') || (c.fpCycles && c.fpCycles.length > 0));

  // Extract unique FP families taught in this municipality
  const fpFamiliesSet = new Set<string>();
  for (const c of muniCenters) {
    for (const cycle of c.fpCycles || []) {
      if (cycle.family && cycle.family !== 'Otras familias') {
        fpFamiliesSet.add(cycle.family);
      }
    }
  }
  const fpFamilies = Array.from(fpFamiliesSet).sort();

  // Extract other top municipalities in the same province for internal cross-linking
  const provinceMuniCounts = new Map<string, { name: string; slug: string; count: number }>();
  for (const c of centers) {
    if (c.province === provinceRaw && c.municipality) {
      const mSlug = getMunicipalitySlug(c.municipality);
      if (mSlug && mSlug !== slug) {
        const existing = provinceMuniCounts.get(mSlug);
        if (existing) {
          existing.count += 1;
        } else {
          provinceMuniCounts.set(mSlug, { name: c.municipality, slug: mSlug, count: 1 });
        }
      }
    }
  }
  const relatedMunicipalities = Array.from(provinceMuniCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Schema.org: ItemList + BreadcrumbList + FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE_URL}/municipio/${slug}#breadcrumb`,
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
            name: provinceClean,
            item: `${BASE_URL}/?prov=${encodeURIComponent(provinceRaw)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `Centros en ${municipalityName}`,
            item: `${BASE_URL}/municipio/${slug}`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${BASE_URL}/municipio/${slug}#itemlist`,
        name: `Colegios, Institutos y Centros de FP en ${municipalityName}`,
        numberOfItems: muniCenters.length,
        itemListElement: muniCenters.slice(0, 100).map((center, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: center.name,
          url: `${BASE_URL}/centro/${getCenterSlug(center)}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/municipio/${slug}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `¿Cuántos colegios e institutos hay en ${municipalityName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `En ${municipalityName} (${provinceClean}) existen actualmente ${muniCenters.length} centros educativos inscritos en el registro oficial de la Generalitat Valenciana (GVA): ${publicCount} centros públicos, ${concertedCount} centros concertados y ${privateCount} centros privados.`,
            },
          },
          {
            '@type': 'Question',
            name: `¿Dónde estudiar Formación Profesional (FP) en ${municipalityName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                fpCenters.length > 0
                  ? `${municipalityName} cuenta con ${fpCenters.length} centros que imparten Formación Profesional o enseñanza secundaria, incluyendo: ${fpCenters
                      .slice(0, 5)
                      .map((c) => c.name)
                      .join(', ')}.`
                  : `Puedes consultar los institutos y centros de FP más cercanos a ${municipalityName} dentro de la provincia de ${provinceClean} a través del buscador interactivo de InfoEdu CV.`,
            },
          },
        ],
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
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400 font-bold transition-colors text-sm uppercase tracking-wide"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al buscador
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <Link href={`/?prov=${encodeURIComponent(provinceRaw)}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {provinceClean}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 font-bold">
              {municipalityName}
            </span>
          </nav>
        </div>

        {/* Hero Summary Box */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#114b5f] via-[#d38c28] to-[#f59e0b]" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Guía Oficial Curso 2026/2027
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-500/20">
              Provincia de {provinceClean}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
            Colegios, Institutos y Centros de FP en {municipalityName}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-4xl mb-6">
            Directorio completo y actualizado con datos oficiales de la Generalitat Valenciana (GVA) de los{' '}
            <strong>{muniCenters.length} centros docentes</strong> activos en <strong>{municipalityName}</strong> ({provinceClean}). Consulta la titularidad, oferta formativa de Infantil, Primaria, ESO, Bachillerato y Formación Profesional (FP), teléfonos directos y páginas web oficiales.
          </p>

          {/* KPI Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card p-4 rounded-xl">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 block">Total Centros</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">{muniCenters.length}</span>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <span className="text-xs font-bold uppercase text-primary-600 dark:text-primary-400 block">Públicos (GVA)</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">{publicCount}</span>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 block">Concertados / Priv.</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">{concertedCount + privateCount}</span>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <span className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 block">Con FP / Secundaria</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">{fpCenters.length}</span>
            </div>
          </div>
        </div>

        {/* FP Families Available in this Municipality */}
        {fpFamilies.length > 0 && (
          <section className="mb-8 glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Familias Profesionales de FP disponibles en {municipalityName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {fpFamilies.map((family) => (
                <Link
                  key={family}
                  href={`/fp/${getFpFamilySlug(family)}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 transition-all"
                >
                  FP {family}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Full List of Centers in the Municipality */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Listado Oficial de Centros Educativos en {municipalityName} ({muniCenters.length})
            </h2>
            <Link
              href={`/?q=${encodeURIComponent(municipalityName)}&view=map`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              Ver en mapa interactivo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {muniCenters.map((center) => {
              const centerSlug = getCenterSlug(center);
              return (
                <article
                  key={center.id}
                  className="glass-card group relative rounded-2xl overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#114b5f] via-[#d38c28] to-[#f59e0b]" />

                  <div className="p-6 flex-grow flex flex-col pt-7">
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {center.type}
                      </span>
                      <span className="text-xs font-mono text-gray-400">Cód. {center.id}</span>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-3 leading-snug">
                      <Link href={`/centro/${centerSlug}`} className="hover:underline">
                        {center.name}
                      </Link>
                    </h3>

                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          {center.address} ({center.zipCode} {center.municipality})
                        </span>
                      </p>
                      {center.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                          <span>Tel: {center.phone}</span>
                        </p>
                      )}
                      {center.fpCycles && center.fpCycles.length > 0 && (
                        <p className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span>{center.fpCycles.length} ciclos formativos de FP</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/30 dark:border-white/5">
                      {center.levels.map((lvl) => (
                        <span
                          key={lvl}
                          className="px-2 py-0.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-bold rounded-md border border-amber-500/20"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-500/5 dark:bg-white/5 border-t border-slate-200/30 dark:border-white/5 flex gap-2">
                    <Link
                      href={`/centro/${centerSlug}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-[#d38c28] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm transition-all"
                    >
                      Ver ficha completa y FP
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {center.url && (
                      <a
                        href={center.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Web oficial de ${center.name}`}
                        className="flex items-center justify-center px-3 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-all"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Other Municipalities in the Province (Internal Linking Hub) */}
        {relatedMunicipalities.length > 0 && (
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Otros municipios con centros educativos en {provinceClean}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Explora la oferta de colegios públicos, concertados, privados e institutos de FP en localidades cercanas:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedMunicipalities.map((m) => (
                <Link
                  key={m.slug}
                  href={`/municipio/${m.slug}`}
                  className="glass-card p-3 rounded-xl flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200 hover:border-amber-500/50 transition-all"
                >
                  <span className="truncate">{m.name}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-primary-500/10 text-primary-600 dark:text-primary-400 shrink-0">
                    {m.count} centros
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
