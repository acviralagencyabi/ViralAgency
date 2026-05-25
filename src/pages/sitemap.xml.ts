import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const LANDING_PAGE_FILES = import.meta.glob('../../content/landing-pages/*.json', {
  eager: true,
});

// Static pages with SEO metadata
const STATIC_PAGES = [
  { path: '/',                                      priority: '1.0', changefreq: 'weekly'  },
  { path: '/social-media-manager-modena/',          priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy-policy/',                       priority: '0.2', changefreq: 'yearly'  },
  { path: '/cookie-policy/',                        priority: '0.2', changefreq: 'yearly'  },
];

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site?.toString() ?? 'https://www.viralagency.it').replace(/\/$/, '');
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const base = `${siteUrl}${basePath === '' || basePath === '/' ? '' : basePath}`;
  const today = new Date().toISOString().split('T')[0];

  const landingPageEntries = Object.keys(LANDING_PAGE_FILES).map((filePath) => {
    const slug = filePath.split('/').pop()?.replace('.json', '') || '';
    return {
      path: `/${slug}/`,
      priority: '0.8',
      changefreq: 'monthly',
    };
  });

  // Dynamically include every published article.
  // Uses `a.id` — the filename without extension (e.g. "atelier-24-14k-follower"),
  // which is what [slug].astro passes as the route param.
  const articles = await getCollection('articles');
  const articleEntries = articles.map((a) => ({
    path: `/articoli/${a.id.replace(/\.[^.]+$/, '')}/`,
    priority: '0.7',
    changefreq: 'yearly',
  }));

  const all = [...STATIC_PAGES, ...landingPageEntries, ...articleEntries];

  const urls = all
    .map(
      ({ path, priority, changefreq }) => `  <url>
    <loc>${base}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
