import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.dreikoenige.ch',

  // Pure static build: 4 prerendered HTML pages, no SSR, no adapter needed.
  // Sveltia CMS runs as a client-side SPA from /admin/ — no build integration.
  output: 'static',

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'fr', 'it'],
    routing: { prefixDefaultLocale: false }
  },

  build: { assets: 'assets' },
  vite: { build: { assetsInlineLimit: 0 } }
});
