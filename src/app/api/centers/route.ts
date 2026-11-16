import { NextResponse } from 'next/server';
import { getCenters } from '@/lib/api';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const centers = await getCenters();

    // Compact payload for client-side search and filtering
    const optimized = centers.map(c => ({
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
      fpCycles: c.fpCycles?.map(fp => ({
        family: fp.family,
        grade: fp.grade,
        name: fp.name
      }))
    }));

    return NextResponse.json(optimized, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error("Error in /api/centers:", error);
    return NextResponse.json({ error: "Failed to load centers" }, { status: 500 });
  }
}
