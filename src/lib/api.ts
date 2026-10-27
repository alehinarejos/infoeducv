import csv from 'csv-parser';
import { Readable } from 'stream';
import { Center, FPCycle, SocialMediaLinks } from '@/types';
import { cache } from 'react';
import privateWebsites from '@/data/privateWebsites.json';
import socialMedia from '@/data/socialMedia.json';
import centersFallback from '@/data/centersFallback.json';
import fs from 'fs';
import path from 'path';
import os from 'os';

const privateWebsitesMap = privateWebsites as Record<string, string>;
const socialMediaMap = socialMedia as Record<string, SocialMediaLinks>;

const FAMILY_FIX_MAP: Record<string, string> = {
  'Arpa': 'Actividades físicas y deportivas',
  'Bajo eléctrico': 'Servicios socioculturales y a la comunidad',
  'Canto': 'Industrias alimentarias',
  'Fagot': 'Seguridad y medio ambiente',
  'Artes y artesanias': 'Artes y artesanías',
  'Comercio y márketing': 'Comercio y marketing',
};

function cleanFpCycleName(name: string): string {
  if (!name) return '';
  return name.replace(/\s*\((lfp|loe|logse)\)\s*$/i, '').trim();
}

function enrichCenterWithCustomData(center: Center): Center {
  const customWebsite = privateWebsitesMap[center.id];
  const customSocial = socialMediaMap[center.id];
  return {
    ...center,
    url: customWebsite || center.url,
    hasCustomUrl: Boolean(customWebsite) || center.hasCustomUrl,
    socialMedia: customSocial || center.socialMedia,
  };
}

const CENTROS_URL = 'https://dadesobertes.gva.es/dataset/68eb1d94-76d3-4305-8507-e1aab7717d0e/resource/1aa53c3a-4639-41aa-ac85-d58254c428c0/download/centros-docentes-de-la-comunitat-valenciana.csv';
const FP_URL = 'https://dadesobertes.gva.es/dataset/a2183efe-f62c-48ec-bdbe-22a4b63c3832/resource/79af67de-71a2-48b1-bd6d-57a2996e2669/download/alumnos-matriculados-fp_2025.csv';

const DISK_CACHE_PATH = path.join(os.tmpdir(), 'infoedu_centers_v4.json');

// Variables globales para caché en memoria (sobrevive en la instancia del contenedor)
let cachedCenters: Center[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export const getCenters = cache(async (): Promise<Center[]> => {
  const now = Date.now();
  if (cachedCenters && (now - lastFetchTime < CACHE_TTL)) {
    console.log("⚡ [CACHE SERVIDOR] Retornando centros educativos desde memoria caché");
    return cachedCenters.map(enrichCenterWithCustomData);
  }

  // Verificar caché persistente en disco (permite compartir datos entre workers de build)
  try {
    if (fs.existsSync(DISK_CACHE_PATH)) {
      const stats = fs.statSync(DISK_CACHE_PATH);
      if (now - stats.mtimeMs < CACHE_TTL) {
        const fileData = fs.readFileSync(DISK_CACHE_PATH, 'utf-8');
        cachedCenters = JSON.parse(fileData);
        lastFetchTime = stats.mtimeMs;
        console.log("⚡ [CACHE DISCO] Retornando centros educativos desde caché en disco");
        return (cachedCenters as Center[]).map(enrichCenterWithCustomData);
      }
    }
  } catch (e) {
    console.warn("⚠️ [CACHE DISCO] Error al leer caché en disco:", e);
  }

  try {
    // Fetch FP and Centros in parallel with 6s timeout to prevent Vercel 10s Serverless timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const [fpResponse, centrosResponse] = await Promise.all([
      fetch(FP_URL, { next: { revalidate: 86400 }, signal: controller.signal }),
      fetch(CENTROS_URL, { next: { revalidate: 86400 }, signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    if (!fpResponse.ok || !centrosResponse.ok) {
      throw new Error(`Failed to fetch GVA data: FP ${fpResponse.statusText}, Centros ${centrosResponse.statusText}`);
    }

    const [fpText, centrosText] = await Promise.all([
      fpResponse.text(),
      centrosResponse.text(),
    ]);

    const fpMap = new Map<string, Map<string, FPCycle>>(); // cod_centro -> Map of unique cycles

    await new Promise<void>((resolve, reject) => {
      Readable.from(fpText)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          const codCentro = data.COD_CENTRO;
          if (!codCentro) return;

          if (!fpMap.has(codCentro)) {
            fpMap.set(codCentro, new Map());
          }

          const family = data.NOM_FAMILIA || 'OTRAS FAMILIAS';
          let grade = data.NOM_GRADO || 'Desconocido';
          const name = data.NOM_CICLO || 'Desconocido';

          // Clean up grade names
          if (grade.includes('MEDIO')) grade = 'Grado Medio';
          else if (grade.includes('SUPERIOR')) grade = 'Grado Superior';
          else if (grade.includes('BÁSICA')) grade = 'FP Básica';

          // Fix name casing and normalize GVA family/cycle names
          const formatName = (str: string) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
          };

          const rawFormattedFamily = formatName(family);
          const cleanFamily = FAMILY_FIX_MAP[rawFormattedFamily] || rawFormattedFamily;
          const cleanName = cleanFpCycleName(formatName(name));

          const key = `${grade}:::${cleanName.toLowerCase()}`;
          fpMap.get(codCentro)!.set(key, {
            family: cleanFamily,
            grade: grade,
            name: cleanName
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    const results: Center[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from(centrosText)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          // Parse coordinates
          const lat = parseFloat(data.latitud?.replace(',', '.'));
          const lng = parseFloat(data.longitud?.replace(',', '.'));

          if (isNaN(lat) || isNaN(lng)) return;

          // Determine education levels
          const niveles: string[] = [];
          const denominacionGenerica = (data.denominacion_generica_es || '').toUpperCase();

          if (denominacionGenerica.includes('INFANTIL')) niveles.push('Infantil');
          if (denominacionGenerica.includes('PRIMARIA')) niveles.push('Primaria');
          if (denominacionGenerica.includes('SECUNDARIA') || denominacionGenerica.includes('I.E.S.')) {
            niveles.push('ESO');
            niveles.push('Bachillerato');
          }

          // Check actual FP cycles
          const fpCyclesMap = fpMap.get(data.codigo);
          const fpCycles = fpCyclesMap ? Array.from(fpCyclesMap.values()) : [];

          if (fpCycles.length > 0 || denominacionGenerica.includes('FORMACIÓN PROFESIONAL') || denominacionGenerica.includes('FORMACION PROFESIONAL')) {
            if (!niveles.includes('FP')) niveles.push('FP');
          }

          let tipo = 'Desconocido';
          const regimen = data.regimen || '';
          if (regimen.includes('PÚB') || regimen.includes('PUB')) tipo = 'Público';
          else if (regimen.includes('CONC')) tipo = 'Concertado';
          else if (regimen.includes('PRIV')) tipo = 'Privado';

          const customWebsite = privateWebsitesMap[data.codigo];
          const defaultGvaUrl = tipo === 'Público' ? `https://portal.edu.gva.es/${data.codigo}/` : data.url_es;
          const finalUrl = customWebsite || defaultGvaUrl;
          const gvaUrl = data.url_es || (tipo === 'Público' ? `https://portal.edu.gva.es/${data.codigo}/` : undefined);
          const hasCustomUrl = Boolean(customWebsite);

          const street = `${data.tipo_via || ''} ${data.direccion || ''}`.trim();
          const num = (data.numero || '').trim();
          const fullAddress = num ? `${street}, ${num}` : street;

          results.push({
            id: data.codigo,
            name: data.denominacion_especifica || data.denominacion,
            type: tipo,
            address: fullAddress,
            zipCode: data.codigo_postal,
            municipality: data.localidad,
            province: data.provincia,
            phone: data.telefono,
            lat: lat,
            lng: lng,
            levels: niveles,
            url: finalUrl,
            gvaUrl: gvaUrl,
            hasCustomUrl: hasCustomUrl,
            fpCycles: fpCycles
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    cachedCenters = results;
    lastFetchTime = Date.now();
    try {
      fs.writeFileSync(DISK_CACHE_PATH, JSON.stringify(results));
      console.log(`💾 [CACHE DISCO] Guardados ${results.length} centros en caché de disco (${DISK_CACHE_PATH})`);
    } catch (e) {
      console.warn("⚠️ [CACHE DISCO] No se pudo guardar caché en disco:", e);
    }

    console.log(`✅ [CACHE SERVIDOR] Guardados ${results.length} centros en caché de memoria`);

    return results.map(enrichCenterWithCustomData);
  } catch (error) {
    console.error("❌ [API ERROR] Fallo al descargar/procesar datos de la GVA:", error);
    // Intentar fallback en disco si la descarga falló
    try {
      if (fs.existsSync(DISK_CACHE_PATH)) {
        const fileData = fs.readFileSync(DISK_CACHE_PATH, 'utf-8');
        cachedCenters = JSON.parse(fileData);
        console.log("⚠️ [FALLBACK DISCO] Retornando centros desde caché persistente en disco");
        return (cachedCenters as Center[]).map(enrichCenterWithCustomData);
      }
    } catch {
      // ignore
    }
    if (cachedCenters && cachedCenters.length > 0) {
      console.log("⚠️ [FALLBACK CACHÉ] Retornando versión anterior de centros en memoria");
      return cachedCenters.map(enrichCenterWithCustomData);
    }

    console.log("🛡️ [FALLBACK LOCAL] Retornando catálogo estático de respaldo para garantizar disponibilidad (0 errores 5xx)");
    return (centersFallback as Center[]).map(enrichCenterWithCustomData);
  }
});
