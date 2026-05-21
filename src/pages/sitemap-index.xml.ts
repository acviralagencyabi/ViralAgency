import type { APIRoute } from 'astro';

// Canonical sitemap index: points to /sitemap.xml
// Kept for compatibility with crawlers that look for /sitemap-index.xml
export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? 'https://visualdigitalagencydemo.pages.dev').replace(/\/$/, '');
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
