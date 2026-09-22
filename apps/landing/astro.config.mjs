// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defaultLocale, locales } from './src/i18n/config.ts';

// Absolute site URL, used for canonical/hreflang links and the sitemap.
// Set SITE_URL once the production domain is known; until then Vercel's
// production URL is used, and localhost for local builds.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  output: 'static',
  // `/da/about.html` is served as `/da/about` by Vercel's cleanUrls (see vercel.json).
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((locale) => [locale, locale])),
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
