// Plain module (no `astro:*` imports) so astro.config.mjs can import it too.

/** Every locale the site is built in. The first entry is the default. */
export const locales = ['en', 'da'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Native name of each locale, shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  da: 'Dansk',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
