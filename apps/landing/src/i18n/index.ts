import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';
import { defaultLocale, isLocale, locales, type Locale } from './config';
import da from './dictionaries/da';
import en, { type Dictionary } from './dictionaries/en';

export * from './config';
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, da };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Replaces `{name}` placeholders: `format('© {year}', { year: 2026 })`. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Localized, root-relative URL for a route: `localizePath('da', '/about')` → `/da/about`. */
export function localizePath(locale: Locale, path = '/'): string {
  return getRelativeLocaleUrl(locale, stripSlashes(path));
}

/** Localized absolute URL (uses `site` from astro.config). For canonical/hreflang/OG. */
export function localizeUrl(locale: Locale, path = '/'): string {
  return getAbsoluteLocaleUrl(locale, stripSlashes(path));
}

/** Route path without its locale prefix: `/da/about` → `/about`, `/da.html` → `/`. */
export function getRoutePath(pathname: string): string {
  // Static builds report file paths (`/da.html`, `/index.html`), dev reports URLs.
  const segments = pathname
    .replace(/\.html$/, '')
    .split('/')
    .filter(Boolean);
  if (segments.at(-1) === 'index') segments.pop();
  if (isLocale(segments[0]) && segments[0] !== defaultLocale) segments.shift();
  return `/${segments.join('/')}`;
}

/**
 * `getStaticPaths` for pages under `src/pages/[...locale]/`. The default locale
 * gets an empty param, so it is served without a prefix (`/`, `/about`).
 */
export function getLocaleStaticPaths() {
  return locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}

function stripSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}
