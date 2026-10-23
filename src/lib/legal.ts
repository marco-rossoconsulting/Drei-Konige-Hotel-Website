// Shared routing for the legal pages (Privacy & Cookie Policy, Impressum).
// Used by the page files, the footer links' hreflang alternates and the sitemap.

export type Locale = 'de' | 'en' | 'fr' | 'it';

export const privacyPaths: Record<Locale, string> = {
  de: '/datenschutz/',
  en: '/en/privacy/',
  fr: '/fr/confidentialite/',
  it: '/it/privacy/'
};

export const imprintPaths: Record<Locale, string> = {
  de: '/impressum/',
  en: '/en/imprint/',
  fr: '/fr/mentions-legales/',
  it: '/it/impressum/'
};

export const homePaths: Record<Locale, string> = {
  de: '/',
  en: '/en/',
  fr: '/fr/',
  it: '/it/'
};

export const hreflangs: Record<Locale, string> = {
  de: 'de-CH',
  en: 'en',
  fr: 'fr-CH',
  it: 'it-CH'
};
