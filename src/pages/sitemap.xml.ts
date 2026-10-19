import type { APIRoute } from 'astro';
import { privacyPaths, hreflangs, type Locale as LegalLocale } from '../lib/legal';

// Custom multilingual sitemap with full hreflang annotations.
// Each <url> entry includes <xhtml:link rel="alternate"> for every locale,
// which is the format Google expects for multilingual sites.

const SITE = 'https://www.dreikoenige.ch';

type Locale = 'en' | 'de' | 'fr' | 'it';

const locales: Array<{ code: Locale; path: string; hreflang: string }> = [
  { code: 'de', path: '/',    hreflang: 'de-CH' },
  { code: 'en', path: '/en/', hreflang: 'en'    },
  { code: 'fr', path: '/fr/', hreflang: 'fr-CH' },
  { code: 'it', path: '/it/', hreflang: 'it-CH' }
];

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];

  const urlEntries = locales.map(({ path, hreflang }) => {
    const loc = `${SITE}${path}`;
    const alternates = locales
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${SITE}${alt.path}" />`
      )
      .join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/" />`;

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.9'}</priority>
${alternates}
${xDefault}
  </url>`;
  }).join('\n');

  // Privacy & Cookie Policy — one localized URL per locale, cross-linked via hreflang
  const legalLocales = Object.keys(privacyPaths) as LegalLocale[];
  const legalEntries = legalLocales.map((code) => {
    const alternates = legalLocales
      .map((alt) => `    <xhtml:link rel="alternate" hreflang="${hreflangs[alt]}" href="${SITE}${privacyPaths[alt]}" />`)
      .join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${privacyPaths.de}" />`;
    return `  <url>
    <loc>${SITE}${privacyPaths[code]}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
${alternates}
${xDefault}
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
${legalEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
