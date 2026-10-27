/**
 * Utility functions for generating and parsing SEO-friendly semantic slugs
 * and formatting uppercase GVA registry names into natural Title Case.
 */

const UPPERCASE_ACRONYMS = new Set([
  'CEIP',
  'IES',
  'CIPFP',
  'CEE',
  'CRA',
  'EOI',
  'FPA',
  'CFPA',
  'EI',
  'EIM',
  'CPM',
  'CSM',
  'CPD',
  'CSD',
  'EASD',
  'ISEACV',
  'GVA',
  'FP',
  'ESO',
  'TVA',
  'PFQB',
  'II',
  'III',
  'IV',
  'VI',
  'VII',
  'VIII',
  'IX',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI',
  'XXII',
  'XXIII',
  'SL',
  'SA',
  'SLU',
  'COOP',
  'COOP.',
  'S.L.',
  'S.A.',
  'C.V.',
  'V.',
  'S/N',
]);

const LOWERCASE_CONNECTORS = new Set([
  'de',
  'del',
  'dels',
  'la',
  'las',
  'les',
  'el',
  'los',
  'els',
  'y',
  'e',
  'i',
  'o',
  'u',
  'en',
  'a',
  'al',
  'als',
  'con',
  'amb',
  'por',
  'per',
  'para',
  'sin',
]);

function capitalizeSingleWord(word: string, isFirstWord: boolean): string {
  if (!word) return word;

  const upperClean = word.toUpperCase().replace(/[(),.:;]/g, '');
  if (UPPERCASE_ACRONYMS.has(upperClean)) {
    return word.toUpperCase();
  }

  // Handle dotted acronyms like I.E.S. or C.E.I.P.
  if (/^([A-Z]\.){2,}$/i.test(word)) {
    return word.toUpperCase();
  }

  const lower = word.toLowerCase();

  // Handle Valencian/Catalan apostrophe prefixes like l'Alcora, d'Elx, s'Arenal, n'A...
  const apostropheMatch = lower.match(/^([ldsn]['’])(.+)$/i);
  if (apostropheMatch) {
    const prefix = isFirstWord
      ? apostropheMatch[1].toUpperCase()
      : apostropheMatch[1].toLowerCase();
    const rest = apostropheMatch[2];
    const capRest = rest.charAt(0).toUpperCase() + rest.slice(1);
    return `${prefix}${capRest}`;
  }

  if (!isFirstWord && LOWERCASE_CONNECTORS.has(lower)) {
    return lower;
  }

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Formats an ALL-CAPS school or institute name from the GVA CSV
 * into clean, natural Title Case while preserving official acronyms.
 * Example: "CEIP COFRENTES" -> "CEIP Cofrentes"
 * Example: "IES PARE VITÒRIA" -> "IES Pare Vitòria"
 */
export function formatSchoolName(rawName: string): string {
  if (!rawName) return '';
  const trimmed = rawName.trim();

  return trimmed
    .split(/\s+/)
    .map((token, idx) => {
      // Handle hyphenated words like VILA-REAL or SANT-VICENT
      if (token.includes('-')) {
        return token
          .split('-')
          .map((part, partIdx) => capitalizeSingleWord(part, idx === 0 && partIdx === 0))
          .join('-');
      }
      return capitalizeSingleWord(token, idx === 0);
    })
    .join(' ');
}

const FP_CYCLE_ACRONYMS: Record<string, string> = {
  'desarrollo de aplicaciones web': 'DAW',
  'desarrollo de aplicaciones multiplataforma': 'DAM',
  'administración de sistemas informáticos en red': 'ASIR',
  'sistemas microinformáticos y redes': 'SMR',
  'cuidados auxiliares de enfermería': 'TCAE',
  'enseñanza y animación sociodeportiva': 'TSEAS',
  'guía en el medio natural y de tiempo libre': 'TECO',
  'acondicionamiento físico': 'TSAF',
  'administración y finanzas': 'AF',
  'gestión administrativa': 'GA',
  'atención a personas en situación de dependencia': 'TAPSD',
  'integración social': 'TIS',
  'educación infantil': 'TEI',
  'animación sociocultural y turística': 'TASOCT',
  'laboratorio clínico y biomédico': 'LCB',
  'imagen para el diagnóstico y medicina nuclear': 'IDMN',
  'anatomía patológica y citodiagnóstico': 'APC',
  'emergencias sanitarias': 'TES',
  'automatización y robótica industrial': 'ARI',
  'instalaciones eléctricas y automáticas': 'IEA',
  'sistemas electrotécnicos y automatizados': 'SEA',
  'sistemas de telecomunicaciones e informáticos': 'STI',
  'inteligencia artificial y big data': 'IABD',
  'ciberseguridad en entornos de las tecnologías de la información': 'CETI',
};

/**
 * Formats an ALL-CAPS municipality, province, or street address into natural Title Case.
 * Example: "COFRENTES" -> "Cofrentes"
 * Example: "CASTELLÓ DE LA PLANA" -> "Castelló de la Plana"
 * Example: "CARRER ZONA ESCOLAR, S/N" -> "Carrer Zona Escolar, S/N"
 */
export function formatLocationName(rawLocation: string): string {
  if (!rawLocation) return '';
  // Only split on '/' if it's a bilingual province or municipality name (not "S/N" or "C/")
  const isBilingualLocation = /^(VALENCIA|ALICANTE|CASTELL)/i.test(rawLocation) && rawLocation.includes('/');
  const primary = isBilingualLocation ? rawLocation.split('/')[0].trim() : rawLocation.trim();
  return formatSchoolName(primary);
}

export function cleanTextForSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented letters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
    .replace(/-+/g, '-'); // Collapse multiple hyphens
}

export function getCenterSlug(center: { id: string; name: string; municipality?: string }): string {
  const cleanName = cleanTextForSlug(center.name);
  const cleanMuni = cleanTextForSlug(center.municipality || '');
  
  if (cleanMuni) {
    return `${cleanName}-${cleanMuni}-${center.id}`;
  }
  return `${cleanName}-${center.id}`;
}

export function getMunicipalitySlug(municipality: string): string {
  return cleanTextForSlug(municipality);
}

export function getProvinceSlug(province: string): string {
  if (!province) return '';
  const upper = province.toUpperCase();
  if (upper.includes('VALENCIA') || upper.includes('VALÈNCIA')) return 'valencia';
  if (upper.includes('ALICANTE') || upper.includes('ALACANT')) return 'alicante';
  if (upper.includes('CASTELL')) return 'castellon';
  return cleanTextForSlug(province.split('/')[0]);
}

export function getFpFamilySlug(family: string): string {
  return cleanTextForSlug(family);
}

export function getFpCycleAcronym(cycleName: string): string | null {
  if (!cycleName) return null;
  const key = cycleName.trim().toLowerCase();
  return FP_CYCLE_ACRONYMS[key] || null;
}

export function getFpCycleSlug(cycle: { grade: string; name: string }): string {
  const acronym = getFpCycleAcronym(cycle.name);
  const base = `${cycle.grade}-${cycle.name}${acronym ? `-${acronym}` : ''}`;
  return cleanTextForSlug(base);
}

export function extractIdFromSlug(slugOrId: string): string {
  if (!slugOrId) return '';
  
  // If it's already an 8-digit center code (standard in GVA/Spain)
  if (/^\d{8}$/.test(slugOrId)) {
    return slugOrId;
  }

  // If it's a slug like "florida-universitaria-catarroja-46017365", extract the trailing 8-digit code
  const match = slugOrId.match(/(\d{8})$/);
  if (match) {
    return match[1];
  }

  // Fallback: match any trailing number sequence if not exactly 8 digits
  const fallbackMatch = slugOrId.match(/(\d+)$/);
  if (fallbackMatch) {
    return fallbackMatch[1];
  }

  return slugOrId;
}
