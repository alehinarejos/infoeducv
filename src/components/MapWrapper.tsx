'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Center } from '@/types';

const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-label="Cargando mapa..."
      className="h-full w-full min-h-[380px] bg-gray-100 dark:bg-gray-900 animate-pulse rounded-lg flex items-center justify-center"
    >
      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Cargando mapa...</span>
    </div>
  ),
});

interface MapWrapperProps {
  centers: Center[];
  eager?: boolean;
}

export default function MapWrapper({ centers, eager = false }: MapWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldRenderMap, setShouldRenderMap] = useState<boolean>(eager);

  useEffect(() => {
    if (eager || shouldRenderMap) return;

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldRenderMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eager, shouldRenderMap]);

  return (
    <div ref={containerRef} className="relative h-full w-full min-h-[380px]">
      {shouldRenderMap ? (
        <DynamicMap centers={centers} />
      ) : (
        <div className="h-full w-full min-h-[380px] bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Cargando mapa...</span>
        </div>
      )}
    </div>
  );
}
