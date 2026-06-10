// Elenco centralizzato delle landing page per il linking interno
// (strip nel footer + blocco "Vedi anche" sulle landing).
// Le landing gestite da Keystatic vengono raccolte automaticamente:
// ogni nuovo JSON in content/landing-pages/ entra nei link senza altri edit.

type LandingModule = { default: Record<string, unknown> };

const PROPER_WORDS: Record<string, string> = {
  emiliaromagna: 'Emilia-Romagna',
  modena: 'Modena',
  bologna: 'Bologna',
  milano: 'Milano',
  roma: 'Roma',
  tiktok: 'TikTok',
  seo: 'SEO',
};

export function landingLabel(slug: string): string {
  const phrase = slug
    .replace(/emilia-romagna/g, 'emiliaromagna')
    .split('-')
    .map((w) => PROPER_WORDS[w] ?? w)
    .join(' ');
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

const landingFiles = import.meta.glob<LandingModule>(
  '../../content/landing-pages/*.json',
  { eager: true }
);

const BASE = import.meta.env.BASE_URL;

export interface InternalLink {
  slug: string;
  href: string;
  label: string;
}

export const landingLinks: InternalLink[] = [
  ...Object.keys(landingFiles).map((filePath) => {
    const slug = filePath.split('/').pop()?.replace('.json', '') || '';
    return { slug, href: `${BASE}${slug}/`, label: landingLabel(slug) };
  }),
  // Landing statica non gestita da Keystatic
  {
    slug: 'social-media-manager-modena',
    href: `${BASE}social-media-manager-modena/`,
    label: landingLabel('social-media-manager-modena'),
  },
].sort((a, b) => a.label.localeCompare(b.label, 'it'));

// Confronto per parole intere: "romagna" contiene "roma" come sottostringa,
// quindi un includes() diretto sbaglierebbe area.
function areaOf(slug: string): string | null {
  const words = slug.split('-');
  if (words.includes('emilia') && words.includes('romagna')) return 'emilia-romagna';
  for (const c of ['modena', 'bologna', 'milano', 'roma']) {
    if (words.includes(c)) return c;
  }
  return null;
}

export function relatedLandingLinks(currentSlug: string, count = 3): InternalLink[] {
  const others = landingLinks.filter((l) => l.slug !== currentSlug);
  const area = areaOf(currentSlug);
  const sameArea = area ? others.filter((l) => areaOf(l.slug) === area) : [];
  const rest = others.filter((l) => !sameArea.includes(l));
  return [...sameArea, ...rest].slice(0, count);
}
