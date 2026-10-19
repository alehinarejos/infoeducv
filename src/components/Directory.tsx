'use client';

import Link from 'next/link';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Center } from '@/types';
import dynamic from 'next/dynamic';
import { Search, Map as MapIcon, List as ListIcon, GraduationCap, Building, MapPin, ArrowRight, Navigation, Share2, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getCenterSlug } from '@/lib/slug';

const MapWrapper = dynamic(() => import('./MapWrapper'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-900 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-400 font-bold">...</span>
    </div>
  )
});

interface DirectoryProps {
  initialCenters: Center[];
  totalCount?: number;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export default function Directory({ initialCenters, totalCount }: DirectoryProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // High Performance Optimization:
  // Starts with initial lightweight slice (24 centers) for instant paint & minimal initial DOM.
  // Seamlessly loads full directory in background via requestIdleCallback.
  const [allCenters, setAllCenters] = useState<Center[]>(initialCenters);
  const [isFullDataLoaded, setIsFullDataLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  // Background fetch full catalog
  useEffect(() => {
    let isMounted = true;
    const loadFullCatalog = async () => {
      try {
        const res = await fetch('/api/centers');
        if (res.ok) {
          const fullData = await res.json();
          if (isMounted && Array.isArray(fullData) && fullData.length > 0) {
            setAllCenters(fullData);
            setIsFullDataLoaded(true);
          }
        }
      } catch (err) {
        console.warn('Background centers fetch fallback to initial slice', err);
      }
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadFullCatalog(), { timeout: 2500 });
      } else {
        setTimeout(loadFullCatalog, 300);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync if initialCenters changes via server navigation
  useEffect(() => {
    if (!isFullDataLoaded) {
      setAllCenters(initialCenters);
    }
  }, [initialCenters, isFullDataLoaded]);

  // Location State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Primary filters
  const query = searchParams.get('q') || '';
  const zipCode = searchParams.get('zip') || '';
  const selectedProvince = searchParams.get('prov') || '';
  const selectedLevel = searchParams.get('level') || '';
  const selectedTitularidad = searchParams.get('tit') || '';
  
  // FP Sub-filters
  const cycleQuery = searchParams.get('cycleQ') || '';
  const selectedFamily = searchParams.get('family') || '';
  const selectedFpGrade = searchParams.get('fp') || '';
  
  const viewMode = (searchParams.get('view') as 'list' | 'map') || 'list';

  // Local states for text inputs (immediate binding for smooth typing)
  const [localQuery, setLocalQuery] = useState(query);
  const [localZipCode, setLocalZipCode] = useState(zipCode);
  const [localCycleQuery, setLocalCycleQuery] = useState(cycleQuery);

  // Helper to update URL params
  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Clear FP subfilters if level changes from FP
    if (key === 'level' && value !== 'FP') {
      params.delete('fp');
      params.delete('family');
      params.delete('cycleQ');
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Debounce effects to update URL without lag
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== query) {
        setParam('q', localQuery);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [localQuery, query, setParam]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localZipCode !== zipCode) {
        setParam('zip', localZipCode);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [localZipCode, zipCode, setParam]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localCycleQuery !== cycleQuery) {
        setParam('cycleQ', localCycleQuery);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [localCycleQuery, cycleQuery, setParam]);

  // Synchronize local states when URL changes externally
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    setLocalZipCode(zipCode);
  }, [zipCode]);

  useEffect(() => {
    setLocalCycleQuery(cycleQuery);
  }, [cycleQuery]);

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('zip');
    params.delete('prov');
    params.delete('level');
    params.delete('tit');
    params.delete('fp');
    params.delete('family');
    params.delete('cycleQ');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setUserLocation(null);
  }, [searchParams, pathname, router]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (query) count++;
    if (zipCode) count++;
    if (selectedProvince) count++;
    if (selectedLevel) count++;
    if (selectedTitularidad) count++;
    if (userLocation) count++;
    if (selectedLevel === 'FP') {
      if (cycleQuery) count++;
      if (selectedFamily) count++;
      if (selectedFpGrade) count++;
    }
    return count;
  }, [query, zipCode, selectedProvince, selectedLevel, selectedTitularidad, cycleQuery, selectedFamily, selectedFpGrade, userLocation]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(24);
  }, [query, zipCode, selectedProvince, selectedLevel, selectedTitularidad, cycleQuery, selectedFamily, selectedFpGrade, userLocation]);

  const allFamilies = useMemo(() => {
    if (selectedLevel !== 'FP') return [];
    const families = new Set<string>();
    allCenters.forEach(center => {
      center.fpCycles?.forEach(cycle => {
        families.add(cycle.family);
      });
    });
    return Array.from(families).sort();
  }, [allCenters, selectedLevel]);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'InfoEdu CV',
      text: t.search.shareText,
      url: url
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert(t.search.linkCopied);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  // Handle Location Click
  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert(t.search.geoNotSupported);
      return;
    }

    if (userLocation) {
      setUserLocation(null);
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);
        
        let closestCenter = allCenters[0];
        let minDistance = Infinity;
        
        for (const center of allCenters) {
          const dist = calculateDistance(lat, lng, center.lat, center.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestCenter = center;
          }
        }
        
        setParam('prov', closestCenter.province);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        alert(t.search.geoError);
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Filter centers based on criteria
  const filteredCenters = useMemo(() => {
    let results = allCenters.filter(center => {
      const matchesQuery = 
        center.name.toLowerCase().includes(query.toLowerCase()) ||
        center.municipality.toLowerCase().includes(query.toLowerCase());
      
      const matchesZip = zipCode ? center.zipCode.includes(zipCode) : true;
      const matchesProvince = selectedProvince ? center.province === selectedProvince : true;
      const matchesLevel = selectedLevel ? center.levels.includes(selectedLevel) : true;
      const matchesTitularidad = selectedTitularidad 
        ? (selectedTitularidad === 'privado_todos' 
            ? (center.type === 'Privado' || center.type === 'Concertado')
            : center.type.toLowerCase().includes(selectedTitularidad.toLowerCase()))
        : true;
      
      let matchesFp = true;
      if (selectedLevel === 'FP') {
        const hasCycles = center.fpCycles && center.fpCycles.length > 0;
        
        if (!hasCycles && (selectedFpGrade || selectedFamily || cycleQuery)) {
          matchesFp = false;
        } else if (hasCycles) {
          matchesFp = center.fpCycles!.some(cycle => {
            const mGrade = selectedFpGrade ? cycle.grade === selectedFpGrade : true;
            const mFamily = selectedFamily ? cycle.family === selectedFamily : true;
            const mName = cycleQuery ? cycle.name.toLowerCase().includes(cycleQuery.toLowerCase()) : true;
            return mGrade && mFamily && mName;
          });
        }
      }

      return matchesQuery && matchesZip && matchesProvince && matchesLevel && matchesTitularidad && matchesFp;
    });

    if (userLocation) {
      results = results.map(center => ({
        ...center,
        distance: calculateDistance(userLocation[0], userLocation[1], center.lat, center.lng)
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return results;
  }, [allCenters, query, zipCode, selectedProvince, selectedLevel, selectedTitularidad, cycleQuery, selectedFamily, selectedFpGrade, userLocation]);

  // Paginated visible slice for instant mobile rendering
  const visibleCenters = useMemo(() => {
    return filteredCenters.slice(0, visibleCount);
  }, [filteredCenters, visibleCount]);

  const customSelectStyles = {
    backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em'
  };

  const getLocalizedType = (type: string) => {
    const upper = type?.toUpperCase();
    if (upper === 'PÚBLICO') return t.filters.public;
    if (upper === 'PRIVADO') return t.filters.private;
    if (upper === 'CONCERTADO') return t.filters.concerted;
    return type;
  };

  const getLocalizedLevel = (lvl: string) => {
    if (lvl === 'FP') return t.levels.fpShort;
    if (lvl === 'Infantil') return t.levels.infantil;
    if (lvl === 'Primaria') return t.levels.primaria;
    if (lvl === 'ESO') return t.levels.eso;
    if (lvl === 'Bachillerato') return t.levels.bachillerato;
    return lvl;
  };

  return (
    <div className={`flex flex-col ${viewMode === 'map' ? 'h-[calc(100vh-80px)]' : 'min-h-[calc(100vh-80px)]'}`}>
      {viewMode === 'list' && (
        <div className="text-center pt-12 pb-8 px-4 shrink-0 max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
            {t.hero.title1} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#114b5f] via-[#d38c28] to-[#e59829] dark:from-primary-400 dark:via-amber-400 dark:to-amber-300">
              {t.hero.title2}
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            {t.hero.subtitle}
          </p>
        </div>
      )}
      
      {/* Search and Filters Bar */}
      <div data-google-ad-ignore="true" className="p-4 shrink-0 transition-colors z-10 relative bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="relative glass-panel rounded-2xl p-6 transition-all">
            {/* Decorative top border matching logo colors (Teal to Orange) */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#114b5f] via-[#d38c28] to-[#f59e0b] rounded-t-2xl"></div>
            <div className="flex flex-wrap gap-3 items-stretch">
              <div className="relative flex-grow min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search.centerPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/80 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-semibold text-gray-900 dark:text-white placeholder:text-slate-400 shadow-xs"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
              </div>
              
              <div className="relative w-full sm:w-36">
                <input
                  type="text"
                  placeholder={t.search.zipPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/80 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-semibold text-gray-900 dark:text-white placeholder:text-slate-400 shadow-xs"
                  value={localZipCode}
                  onChange={(e) => setLocalZipCode(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleLocationClick}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm font-bold whitespace-nowrap shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                  userLocation 
                    ? 'border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25' 
                    : isLocating 
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-400' 
                      : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} /> 
                {isLocating ? t.search.locating : userLocation ? t.search.locationActive : t.search.myLocation}
              </button>
              
              <button 
                onClick={handleShare}
                className="hidden sm:flex items-center justify-center w-12 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer"
                title={t.search.shareTitle}
                aria-label={t.search.shareTitle}
              >
                <Share2 className="w-4 h-4" />
              </button>

              <div className="flex bg-slate-200/60 dark:bg-white/5 p-1 rounded-xl transition-all border border-slate-200/50 dark:border-white/5 shrink-0">
                <button
                  onClick={() => setParam('view', 'list')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${viewMode === 'list' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs border border-amber-400/30' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                  aria-label={t.search.listView}
                  title={t.search.listView}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setParam('view', 'map')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${viewMode === 'map' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs border border-amber-400/30' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                  aria-label={t.search.mapView}
                  title={t.search.mapView}
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Public / Private Toggle Pills */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/40 dark:border-white/5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                {t.filters.centerType}
              </span>
              <button
                type="button"
                onClick={() => setParam('tit', '')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !selectedTitularidad
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10'
                }`}
              >
                {t.filters.all}
              </button>
              <button
                type="button"
                onClick={() => setParam('tit', 'Público')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTitularidad === 'Público'
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-primary-400 inline-block"></span>
                {t.filters.public}
              </button>
              <button
                type="button"
                onClick={() => setParam('tit', 'Privado')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTitularidad === 'Privado'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                {t.filters.private}
              </button>
              <button
                type="button"
                onClick={() => setParam('tit', 'Concertado')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTitularidad === 'Concertado'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                {t.filters.concerted}
              </button>
              <button
                type="button"
                onClick={() => setParam('tit', 'privado_todos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTitularidad === 'privado_todos'
                    ? 'bg-gradient-to-r from-amber-600 to-purple-600 text-white shadow-xs'
                    : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10'
                }`}
              >
                {t.filters.privateAndConcerted}
              </button>
            </div>

            {/* Row 2: Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1.5">
                  {t.filters.province}
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/80 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-semibold text-gray-900 dark:text-white appearance-none cursor-pointer shadow-xs"
                  style={customSelectStyles}
                  value={selectedProvince}
                  onChange={(e) => setParam('prov', e.target.value)}
                >
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="">{t.filters.allProvinces}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="ALICANTE/ALACANT">{t.provinces.alicante}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="CASTELLÓN/CASTELLÓ">{t.provinces.castellon}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="VALENCIA/VALÈNCIA">{t.provinces.valencia}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1.5">
                  {t.filters.educationLevel}
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/80 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-semibold text-gray-900 dark:text-white appearance-none cursor-pointer shadow-xs"
                  style={customSelectStyles}
                  value={selectedLevel}
                  onChange={(e) => setParam('level', e.target.value)}
                >
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="">{t.filters.allLevels}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Infantil">{t.levels.infantil}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Primaria">{t.levels.primaria}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="ESO">{t.levels.eso}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Bachillerato">{t.levels.bachillerato}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="FP">{t.levels.fp}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1.5">
                  {t.filters.schoolType}
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/80 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-semibold text-gray-900 dark:text-white appearance-none cursor-pointer shadow-xs"
                  style={customSelectStyles}
                  value={selectedTitularidad}
                  onChange={(e) => setParam('tit', e.target.value)}
                >
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="">{t.filters.allSchoolTypes}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Público">{t.filters.public}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Privado">{t.filters.private}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Concertado">{t.filters.concerted}</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="privado_todos">{t.filters.privateAndConcerted}</option>
                </select>
              </div>
            </div>

            {/* Row 3: FP Sub-menu */}
            {selectedLevel === 'FP' && (
              <div className="mt-5 pt-5 border-t border-slate-200/30 dark:border-white/5 animate-fade-in-up">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase mb-1.5">
                      {t.filters.fpCycleName}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 dark:text-amber-500" />
                      <input 
                        type="text" 
                        placeholder={t.filters.fpCyclePlaceholder}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-amber-500/30 dark:border-amber-500/10 bg-amber-500/5 dark:bg-amber-950/15 focus:bg-white dark:focus:bg-gray-950 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-semibold text-gray-900 dark:text-white placeholder:text-amber-500/70" 
                        value={localCycleQuery} 
                        onChange={(e) => setLocalCycleQuery(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase mb-1.5">
                      {t.filters.fpFamily}
                    </label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/15 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-amber-900 dark:text-amber-300 appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23f59e0b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                      value={selectedFamily}
                      onChange={(e) => setParam('family', e.target.value)}
                    >
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="">{t.filters.allFamilies}</option>
                      {allFamilies.map(family => (
                        <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" key={family} value={family}>{family}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase mb-1.5">
                      {t.filters.fpGrade}
                    </label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-amber-500/30 dark:border-amber-500/10 bg-amber-500/5 dark:bg-amber-950/15 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-semibold text-gray-900 dark:text-white appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fbbf24\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                      value={selectedFpGrade}
                      onChange={(e) => setParam('fp', e.target.value)}
                    >
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="">{t.filters.allGrades}</option>
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="FP Básica">{t.fpGrades.basica}</option>
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Grado Medio">{t.fpGrades.medio}</option>
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="Grado Superior">{t.fpGrades.superior}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Clear filters row */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-center animate-fade-in-up">
                <button 
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-200/50 dark:border-rose-900/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer hover:shadow-sm"
                >
                  {t.filters.clearFilters} {activeFiltersCount} {activeFiltersCount === 1 ? t.filters.clearFilterSingular : t.filters.clearFilterPlural} <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-grow flex bg-transparent transition-colors ${viewMode === 'map' ? 'overflow-hidden' : ''}`}>
        <div className="max-w-7xl mx-auto w-full h-full p-4 flex">
          {viewMode === 'list' ? (
            <div className="w-full pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCenters.map(center => (
                  <div key={center.id} className="glass-card group relative rounded-2xl overflow-hidden flex flex-col h-full animate-fade-in-up">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#114b5f] via-[#d38c28] to-[#f59e0b]"></div>
                    
                    <div className="p-6 flex-grow flex flex-col pt-7">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-1.5 flex-wrap">
                           <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                             <Building className="w-3 h-3" />
                             {getLocalizedType(center.type)}
                           </span>
                           {center.hasCustomUrl && (
                             <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                               <Globe className="w-2.5 h-2.5" />
                               {t.cards.ownWebsite}
                             </span>
                           )}
                         </div>
                         
                         {center.distance !== undefined && (
                           <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center gap-1 border border-emerald-500/20 dark:border-emerald-500/10">
                             <Navigation className="w-3 h-3" />
                             {center.distance < 1 ? Math.round(center.distance * 1000) + ' m' : center.distance.toFixed(1) + ' km'}
                           </span>
                         )}
                      </div>
                      
                      <div className="mb-5 flex flex-col justify-center min-h-[4rem]">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 tracking-tight leading-none">{center.name}</h3>
                      </div>
                      
                      <div className="space-y-3 mb-6 flex-grow">
                        <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400 group/item">
                          <div className="p-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shrink-0 mt-0.5 shadow-xs">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-[15px] font-medium leading-relaxed line-clamp-2">
                            <span className="font-bold text-amber-700 dark:text-amber-400 block text-xs uppercase tracking-wider mb-0.5 opacity-80">
                              {t.cards.location}
                            </span>
                            {center.municipality} <span className="text-gray-400 dark:text-gray-500 font-normal">({center.province.split('/')[0]})</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-200/30 dark:border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {center.levels.map(lvl => (
                            <span key={lvl} className="px-2.5 py-1 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-md border border-amber-500/20 dark:border-amber-500/10 shadow-xs">
                              {getLocalizedLevel(lvl)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-550/10 dark:bg-white/5 border-t border-slate-200/30 dark:border-white/5 mt-auto flex gap-2">
                      <Link href={`/centro/${getCenterSlug(center)}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 via-[#d38c28] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">
                        {t.cards.exploreCenter}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                      {center.url && (
                        <a
                          href={center.url}
                          target="_blank"
                          rel="noreferrer"
                          title={center.hasCustomUrl ? t.cards.openWebsite : t.cards.openOfficialWeb}
                          className="flex items-center justify-center px-3.5 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {filteredCenters.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400">
                    <div className="w-20 h-20 bg-slate-200/50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-300/30 dark:border-white/10">
                      <GraduationCap className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t.cards.noCentersFound}</h3>
                    <p>{t.cards.tryChangingFilters}</p>
                  </div>
                )}
              </div>

              {/* Pagination / Load More */}
              {filteredCenters.length > visibleCount && (
                <div className="mt-10 mb-4 text-center flex flex-col items-center gap-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {t.cards.showingCentersCount
                      .replace('{count}', String(visibleCenters.length))
                      .replace('{total}', String(filteredCenters.length))}
                  </p>
                  <button
                    onClick={() => setVisibleCount(prev => prev + 24)}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-gray-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{t.cards.loadMoreCenters}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full glass-panel rounded-2xl overflow-hidden animate-fade-in-up">
              <MapWrapper centers={filteredCenters} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
