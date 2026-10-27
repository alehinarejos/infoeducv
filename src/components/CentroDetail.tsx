'use client';

import { Center } from '@/types';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Phone, Globe, BookOpen, GraduationCap, ExternalLink, ShieldCheck, ArrowRight, Star, MessageSquare, Info, HelpCircle } from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';
import { useLanguage } from '@/context/LanguageContext';
import { formatLocationName, formatSchoolName, getCenterSlug, getFpFamilySlug, getMunicipalitySlug } from '@/lib/slug';
import SocialMediaSection from '@/components/SocialMediaSection';
import type { MunicipalityStats } from '@/components/seo/CenterJsonLd';

interface CentroDetailProps {
  center: Center;
  relatedCenters?: Center[];
  municipalityStats?: MunicipalityStats;
}

export default function CentroDetail({ center, relatedCenters = [], municipalityStats }: CentroDetailProps) {
  const { t } = useLanguage();
  const displayCenterName = formatSchoolName(center.name);
  const displayMunicipality = formatLocationName(center.municipality || '');
  const provinceName = formatLocationName(center.province || '');
  const municipalitySlug = getMunicipalitySlug(center.municipality || '');

  const getNaturalezaBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PÚBLICO': return 'bg-primary-50 text-primary-700 border-primary-200 ring-1 ring-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800/50';
      case 'PRIVADO': return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50';
      case 'CONCERTADO': return 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getLocalizedType = (type: string) => {
    const upper = type?.toUpperCase();
    if (upper === 'PÚBLICO') return t.filters.public;
    if (upper === 'PRIVADO') return t.filters.private;
    if (upper === 'CONCERTADO') return t.filters.concerted;
    return type || t.centerDetail.unspecified;
  };

  const getLocalizedLevel = (level: string) => {
    if (level === 'FP') return t.levels.fp;
    if (level === 'Infantil') return t.levels.infantil;
    if (level === 'Primaria') return t.levels.primaria;
    if (level === 'ESO') return t.levels.eso;
    if (level === 'Bachillerato') return t.levels.bachillerato;
    return level;
  };

  const getLevelColor = (nivel: string) => {
    const n = nivel.toUpperCase();
    if (n.includes('BACHILLERATO') || n.includes('BATXILLERAT')) return 'bg-purple-600 text-white border-purple-600 shadow-sm';
    if (n.includes('FP')) return 'bg-rose-600 text-white border-rose-600 shadow-sm';
    if (n.includes('ESO') || n.includes('SECUNDARIA')) return 'bg-blue-600 text-white border-blue-600 shadow-sm';
    if (n.includes('PRIMARIA') || n.includes('PRIMÀRIA')) return 'bg-amber-500 text-white border-amber-500 shadow-sm';
    if (n.includes('INFANTIL')) return 'bg-emerald-500 text-white border-emerald-500 shadow-sm';
    return 'bg-primary-600 text-white border-primary-600';
  };

  const getLevelBackground = (nivel: string) => {
    const n = nivel.toUpperCase();
    if (n.includes('BACHILLERATO') || n.includes('BATXILLERAT')) return 'bg-purple-50 border-purple-100 dark:bg-purple-900/10 dark:border-purple-800/30';
    if (n.includes('FP')) return 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800/30';
    if (n.includes('ESO') || n.includes('SECUNDARIA')) return 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30';
    if (n.includes('PRIMARIA') || n.includes('PRIMÀRIA')) return 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/30';
    if (n.includes('INFANTIL')) return 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30';
    return 'bg-primary-50 border-primary-100 dark:bg-primary-900/10 dark:border-primary-800/30';
  };

  const getWebsiteTitle = () => {
    if (center.hasCustomUrl) return t.centerDetail.officialWebsite;
    if (center.type === 'Público') return t.centerDetail.gvaPortal;
    return t.centerDetail.gvaCard;
  };

  return (
    <div className="min-h-screen bg-transparent py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Breadcrumbs Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400 font-bold transition-colors text-sm uppercase tracking-wide cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.centerDetail.backToSearch}
          </Link>

          {/* Visual Breadcrumbs for SEO and UX */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {t.centerDetail.breadcrumbsHome}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <Link href={`/?prov=${encodeURIComponent(center.province)}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {provinceName}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <Link href={municipalitySlug ? `/municipio/${municipalitySlug}` : `/?q=${encodeURIComponent(center.municipality)}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {displayMunicipality}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 font-bold truncate max-w-[200px] sm:max-w-xs">
              {displayCenterName}
            </span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Card */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 relative">
              {/* Decorative Top Gradient matching logo */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#114b5f] via-[#d38c28] to-[#f59e0b] rounded-t-2xl"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${getNaturalezaBadge(center.type)}`}>
                      {getLocalizedType(center.type)}
                    </span>
                    <span className="text-sm font-mono text-gray-400 dark:text-gray-500">
                      {t.centerDetail.code} {center.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      Registro Oficial GVA
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">
                    {displayCenterName}
                  </h1>
                </div>
              </div>
            </div>

            {/* Mobile Map Fallback */}
            <div className="lg:hidden">
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t.centerDetail.centerLocation}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{center.address}, {center.municipality}</p>
                  
                  <div className="flex gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${center.name}, ${center.address}, ${center.municipality}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-[#d38c28] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold transition-all shadow-md shadow-amber-500/25 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      {t.centerDetail.openInGoogleMaps}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Address */}
              <div className="glass-card p-4 sm:p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/10 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider mb-1">{t.centerDetail.address}</h4>
                    <p className="font-bold text-gray-800 dark:text-gray-200 leading-snug text-sm">{center.address}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{center.zipCode}, {center.municipality}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{center.province}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              {center.phone && (
                <a href={`tel:${center.phone}`} className="glass-card p-4 sm:p-5 rounded-xl block cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20 dark:border-amber-500/10 rounded-lg shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider mb-1">{t.centerDetail.phone}</h4>
                      <p className="font-bold text-gray-800 dark:text-gray-200">{center.phone}</p>
                    </div>
                  </div>
                </a>
              )}

              {/* Web del Centro / Portal GVA */}
              {center.url && (
                <div className="sm:col-span-2 space-y-2">
                  <a href={center.url} target="_blank" rel="noreferrer" className="glass-card p-4 sm:p-5 rounded-xl block cursor-pointer group hover:border-primary-500/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/10 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {getWebsiteTitle()}
                          </h4>
                          {center.hasCustomUrl && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                              {t.centerDetail.ownWebsiteBadge}
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-primary-600 dark:text-primary-400 truncate text-sm flex items-center gap-1.5">
                          <span>{center.url}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </p>
                      </div>
                    </div>
                  </a>

                  {center.hasCustomUrl && center.gvaUrl && center.gvaUrl !== center.url && (
                    <div className="flex justify-end pr-1">
                      <a href={center.gvaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold transition-colors cursor-pointer">
                        <span>{t.centerDetail.alsoSeeGvaCard}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Official Social Media Section */}
            <SocialMediaSection center={center} />

            {/* Educational Offer */}
            {center.levels && center.levels.length > 0 && (
              <div className="glass-panel rounded-2xl p-5 sm:p-8">
                <div className="mb-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 bg-primary-600 text-white rounded-lg shrink-0 shadow-md">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      {t.centerDetail.educationalOffer}
                    </h2>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 rounded-full shrink-0 border border-primary-500/20 dark:border-primary-500/10">
                      <GraduationCap className="w-4 h-4 text-primary-700 dark:text-primary-300" />
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-300">{center.levels.length} {t.centerDetail.levelsAvailable}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-12 mb-3">
                    {t.centerDetail.levelsAvailableSubtitle}
                  </p>
                </div>

                <div className="space-y-4">
                  {center.levels.map(level => (
                    <div key={level} className={`rounded-xl border overflow-hidden ${getLevelBackground(level)}`}>
                      <div className="w-full flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getLevelColor(level)}`}>
                            {getLocalizedLevel(level)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Render FP Cycles if available */}
                      {level === 'FP' && center.fpCycles && center.fpCycles.length > 0 && (
                        <div className="px-5 pb-5 pt-2">
                          <div className="space-y-5">
                            {Array.from(new Set(center.fpCycles.map(c => c.family))).map(family => (
                              <div key={family} className="bg-white/40 dark:bg-slate-900/20 rounded-xl p-4 shadow-sm border border-slate-200/20 dark:border-white/5">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm flex items-center justify-between gap-2 border-b border-slate-200/30 dark:border-white/5 pb-2">
                                  <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                                    {family}
                                  </span>
                                  {family !== 'Otras familias' && (
                                    <Link
                                      href={`/fp/${getFpFamilySlug(family)}`}
                                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                                    >
                                      Ver centros con FP {family} →
                                    </Link>
                                  )}
                                </h4>
                                <ul className="space-y-2">
                                  {center.fpCycles?.filter(c => c.family === family).map(cycle => (
                                    <li key={`${cycle.grade}-${cycle.name}`} className="flex items-start gap-2 text-sm">
                                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 uppercase tracking-wide border border-rose-200 dark:border-rose-800/50 mt-0.5">
                                        {cycle.grade}
                                      </span>
                                      <span className="text-gray-700 dark:text-gray-300 font-medium leading-snug">
                                        {cycle.name}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render Bachillerato info */}
                      {level === 'Bachillerato' && (
                        <div className="px-5 pb-5 pt-2">
                          <div className="bg-white/40 dark:bg-slate-900/20 rounded-xl p-4 shadow-sm border border-slate-200/20 dark:border-white/5">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm flex items-center gap-2 border-b border-slate-200/30 dark:border-white/5 pb-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div>
                              {t.centerDetail.modalities}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                              {t.centerDetail.modalitiesDesc}
                            </p>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-sm">
                                <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0"></div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{t.centerDetail.scienceTech}</span>
                              </li>
                              <li className="flex items-center gap-2 text-sm">
                                <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0"></div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{t.centerDetail.humanitiesSocial}</span>
                              </li>
                              <li className="flex items-center gap-2 text-sm">
                                <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0"></div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{t.centerDetail.artsGeneral}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Fallback if FP is listed but no details available */}
                      {level === 'FP' && (!center.fpCycles || center.fpCycles.length === 0) && (
                        <div className="px-5 pb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">{t.centerDetail.noFpDetails}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Map (Desktop only) */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-8 space-y-4">
              <div className="glass-panel rounded-2xl overflow-hidden h-[700px] relative z-0">
                <MapWrapper centers={[center]} />
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/80 dark:from-[#060814]/80 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex items-center justify-between p-3 rounded-xl glass-card">
                    <div className="flex items-center gap-2 pl-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">{t.cards.location}</p>
                    </div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${center.name}, ${center.address}, ${center.municipality}`)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-[#d38c28] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all text-xs font-bold shadow-md shadow-amber-500/20 hover:-translate-y-0.5 cursor-pointer">
                        {t.centerDetail.openInMaps}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Reviews and Community Reputation Module */}
        <div className="mt-10 glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden animate-fade-in-up">
          {/* Subtle glowing accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-t-2xl"></div>

          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {t.centerDetail.reviewsBadge}
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t.centerDetail.reviewsTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t.centerDetail.reviewsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Google Maps Reviews */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${center.name}, ${center.address}, ${center.municipality}`)}`}
              target="_blank"
              rel="noreferrer"
              className="glass-card p-5 rounded-xl group hover:border-amber-500/50 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    {t.centerDetail.reviewsSourceLabel} Google Maps
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {t.centerDetail.reviewsGoogleMaps}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  {t.centerDetail.reviewsGoogleMapsDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/30 dark:border-white/5 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>{t.centerDetail.reviewsOpenReviews}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* 2. Search Online Community Experiences */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`opiniones ${center.name} ${center.municipality}`)}`}
              target="_blank"
              rel="noreferrer"
              className="glass-card p-5 rounded-xl group hover:border-primary-500/50 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    {t.centerDetail.reviewsSourceLabel} {t.centerDetail.reviewsSourceForums}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {t.centerDetail.reviewsSearchExperiences}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  {t.centerDetail.reviewsSearchExperiencesDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/30 dark:border-white/5 flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400">
                <span>{t.centerDetail.reviewsSearchThreads}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* 3. Official GVA Conselleria Registry */}
            <a
              href={center.gvaUrl || `https://ceice.gva.es/web/centros-docentes/ficha-centro?codi=${center.id}`}
              target="_blank"
              rel="noreferrer"
              className="glass-card p-5 rounded-xl group hover:border-emerald-500/50 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {t.centerDetail.reviewsSourceLabel} Generalitat GVA
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t.centerDetail.reviewsOfficialGva}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  {t.centerDetail.reviewsOfficialGvaDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/30 dark:border-white/5 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>{t.centerDetail.reviewsViewOfficial}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </div>

          {/* Privacy & RGPD Transparency Note */}
          <div className="mt-5 p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-start gap-2.5 text-xs text-gray-500 dark:text-gray-400">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.centerDetail.reviewsDisclaimer}
            </p>
          </div>
        </div>

        {/* SEO Interlinking Section: Related Centers in the same municipality */}
        {relatedCenters.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200/40 dark:border-white/5 animate-fade-in-up">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t.centerDetail.relatedSchoolsTitle} <span className="text-primary-600 dark:text-primary-400">{displayMunicipality}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.centerDetail.officialSourceNote}
                </p>
              </div>
              <Link
                href={municipalitySlug ? `/municipio/${municipalitySlug}` : `/?q=${encodeURIComponent(center.municipality)}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 transition-colors"
              >
                <span>{t.centerDetail.viewAllInMunicipality} {displayMunicipality}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCenters.map((rel) => {
                const relSlug = getCenterSlug(rel);
                return (
                  <Link
                    key={rel.id}
                    href={`/centro/${relSlug}`}
                    className="glass-card p-4 rounded-xl group hover:border-amber-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300">
                          {getLocalizedType(rel.type)}
                        </span>
                        {rel.hasCustomUrl && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase">
                            Web
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {formatSchoolName(rel.name)}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {formatSchoolName(rel.address)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/30 dark:border-white/5 flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400">
                      <span>{t.centerDetail.viewCenter}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Center FAQ & Municipality Editorial Summary for Long-Tail SEO */}
        <section className="mt-14 pt-10 border-t border-slate-200/40 dark:border-white/5">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Preguntas frecuentes sobre {displayCenterName} (Curso 2026/2027)
              </h2>
            </div>

            {municipalityStats && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                El centro educativo <strong>{displayCenterName}</strong> (código GVA <code>{center.id}</code>) es uno de los{' '}
                <Link
                  href={`/municipio/${municipalitySlug}`}
                  className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {municipalityStats.totalCenters} centros docentes de {displayMunicipality}
                </Link>{' '}
                ({municipalityStats.publicCount} públicos y {municipalityStats.concertedPrivateCount} concertados o privados, con {municipalityStats.fpCentersCount} centros que imparten Formación Profesional o secundaria en la localidad).
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  ¿El centro {displayCenterName} es público, concertado o privado?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>{displayCenterName}</strong> es un centro de titularidad <strong>{center.type.toLowerCase()}</strong> inscrito en el Registro Oficial de Centros Docentes de la Conselleria de Educación de la Generalitat Valenciana (GVA) con el código identificativo <strong>{center.id}</strong>.
                </p>
              </div>

              <div className="glass-card p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  ¿Qué niveles educativos y ciclos de FP imparte {displayCenterName}?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  En el curso 2026/2027, el centro ofrece las etapas de{' '}
                  <strong>{center.levels?.length ? center.levels.join(', ') : 'enseñanza reglada'}</strong>.
                  {center.fpCycles && center.fpCycles.length > 0
                    ? ` Cuenta además con ${center.fpCycles.length} ciclos formativos oficiales de FP (${Array.from(
                        new Set(center.fpCycles.map((c) => c.family))
                      ).join(', ')}).`
                    : ''}
                </p>
              </div>

              <div className="glass-card p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  ¿Cuál es el teléfono, dirección y web oficial de {displayCenterName}?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Se encuentra en <strong>{formatSchoolName(center.address)}</strong> ({center.zipCode} {displayMunicipality}, {provinceName}).
                  {center.phone ? ` Su teléfono directo de secretaría/contacto es el ${center.phone}.` : ''}
                  {center.url ? ` Dispone de acceso directo a su portal web oficial en la parte superior de esta ficha.` : ''}
                </p>
              </div>

              <div className="glass-card p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  ¿Cómo comparar {displayCenterName} con otros centros de {displayMunicipality}?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Puedes consultar el listado completo de{' '}
                  <Link
                    href={`/municipio/${municipalitySlug}`}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    colegios, institutos y centros de FP en {displayMunicipality}
                  </Link>{' '}
                  para comparar titularidad, distancia desde tu código postal y oferta de ciclos formativos.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
