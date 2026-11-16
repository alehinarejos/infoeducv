import Directory from '@/components/Directory';
import FAQ from '@/components/FAQ';
import { getCenters } from '@/lib/api';
import { Suspense } from 'react';

export default async function Home() {
  const centers = await getCenters();

  // Optimize initial slice (first 24 centers) to keep initial HTML under 40 KB
  const initialCenters = centers.slice(0, 24).map((c) => ({
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

  return (
    <>
      <h1 className="sr-only">Buscador de Centros Educativos y FP de la Comunitat Valenciana | Cercador de Centres Educatius | InfoEdu CV</h1>
      <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-80px)] font-bold text-gray-500">Cargando directorio...</div>}>
        <Directory initialCenters={initialCenters} totalCount={centers.length} />
      </Suspense>
      <FAQ />
    </>
  );
}
