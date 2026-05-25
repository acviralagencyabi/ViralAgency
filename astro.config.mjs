// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// CF_PAGES = Cloudflare Pages (SSR con Keystatic)
// CI = GitHub Actions (static senza Keystatic)
const isCloudflare = process.env.CF_PAGES === '1';
const isGitHubActions = process.env.CI === 'true' && !isCloudflare;

const siteUrl =
  process.env.SITE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://www.viralagency.it';

const rawBasePath = process.env.BASE_PATH || process.env.PUBLIC_BASE_PATH || '/';
const basePath =
  rawBasePath === ''
    ? '/'
    : rawBasePath.startsWith('/')
      ? rawBasePath
      : `/${rawBasePath}`;
const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: normalizedBasePath,
  output: isGitHubActions ? 'static' : 'server',
  adapter: isGitHubActions ? undefined : cloudflare(),

  integrations: [
    react(),
    markdoc(),
    ...(isGitHubActions ? [] : [keystatic()]),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
