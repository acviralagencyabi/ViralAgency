import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = (site?.toString() ?? 'https://www.viralagency.it').replace(/\/$/, '');
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const base = `${siteUrl}${basePath === '' || basePath === '/' ? '' : basePath}`;

  const robots = `User-agent: *
Allow: /
Disallow: /keystatic/

Sitemap: ${base}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
