import type { APIRoute } from 'astro';

// Canonical sitemap index: points to /sitemap.xml
// Kept for compatibility with crawlers that look for /sitemap-index.xml
export const GET: APIRoute = ({ site }) => {
  const siteUrl = (site?.toString() ?? 'https://www.viralagency.it').replace(/\/$/, '');
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const base = `${siteUrl}${basePath === '' || basePath === '/' ? '' : basePath}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
