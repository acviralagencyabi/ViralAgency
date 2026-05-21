import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Static pages with SEO metadata
const STATIC_PAGES = [
  { path: '/',                                      priority: '1.0', changefreq: 'weekly'  },
  { path: '/agenzia-social-media-modena/',          priority: '0.8', changefreq: 'monthly' },
  { path: '/agenzia-marketing-modena/',             priority: '0.8', changefreq: 'monthly' },
  { path: '/agenzia-comunicazione-modena/',         priority: '0.8', changefreq: 'monthly' },
  { path: '/agenzia-marketing-bologna/',            priority: '0.8', changefreq: 'monthly' },
  { path: '/video-marketing-modena/',               priority: '0.8', changefreq: 'monthly' },
  { path: '/agenzia-branding-modena/',              priority: '0.8', changefreq: 'monthly' },
  { path: '/gestione-social-media-emilia-romagna/', priority: '0.8', changefreq: 'monthly' },
  { path: '/social-media-manager-modena/',          priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy-policy/',                       priority: '0.2', changefreq: 'yearly'  },
  { path: '/cookie-policy/',                        priority: '0.2', changefreq: 'yearly'  },
];

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://visualdigitalagencydemo.pages.dev').replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  // Dynamically include every published article
  const articles = await getCollection('articles');
  const articleEntries = articles.map((a) => ({
    path: `/articoli/${a.slug}/`,
    priority: '0.7',
    changefreq: 'yearly',
  }));

  const all = [...STATIC_PAGES, ...articleEntries];

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
