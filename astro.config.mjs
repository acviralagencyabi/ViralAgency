// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// CF_PAGES = Cloudflare Pages (SSR con Keystatic)
// CI = GitHub Actions (static senza Keystatic)
const isCloudflare = process.env.CF_PAGES === '1';
const isGitHubActions = process.env.CI === 'true' && !isCloudflare;

// https://astro.build/config
export default defineConfig({
  site: isGitHubActions ? 'https://tommasopatriti.me': 'https://visualdigitalagencydemo.pages.dev',
  base: isGitHubActions ? '/VisualDigitalAgencyDemo/' : '/',
  output: isGitHubActions ? 'static' : 'server',
  adapter: isGitHubActions ? undefined : cloudflare(),

  integrations: [
    react(),
    markdoc(),
    ...(isGitHubActions ? [] : [keystatic()]),
    sitemap({
      // Keep keystatic admin and API routes out of the sitemap
      filter: (page) => !page.includes('/keystatic'),

      // Assign priority + changefreq per page type
      serialize(item) {
        const u = item.url;
        const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Home
        if (/https?:\/\/[^/]+\/$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 1.0, lastmod: now };
        }
        // Local SEO landing pages
        const seoSlugs = [
          'agenzia-social-media', 'agenzia-marketing', 'agenzia-comunicazione',
          'agenzia-branding', 'gestione-social-media', 'video-marketing',
          'social-media-manager',
        ];
        if (seoSlugs.some((s) => u.includes(s))) {
          return { ...item, changefreq: 'monthly', priority: 0.8, lastmod: now };
        }
        // Blog / articles
        if (u.includes('/articoli/')) {
          return { ...item, changefreq: 'yearly', priority: 0.7, lastmod: now };
        }
        // Legal / utility
        if (u.includes('privacy') || u.includes('cookie')) {
          return { ...item, changefreq: 'yearly', priority: 0.2 };
        }
        // Everything else
        return { ...item, changefreq: 'monthly', priority: 0.6, lastmod: now };
      },

      i18n: {
        defaultLocale: 'it',
        locales: {
          it: 'it-IT',
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
