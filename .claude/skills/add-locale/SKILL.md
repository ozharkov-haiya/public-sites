---
name: add-locale
description: Add a new language to a public site (routing, dictionary, switcher, sitemap). Use when the user asks to support another language or locale.
---

# Add a locale

Use a BCP 47 code (`de`, `sv`, `pt-br`). It becomes the URL prefix, the `<html lang>`, and the
hreflang value.

1. `apps/<site>/src/i18n/config.ts`: append the code to `locales`, then add its native name to
   `localeNames` (`de: 'Deutsch'`).
2. Create `src/i18n/dictionaries/<code>.ts` by copying `en.ts` and typing it with
   `const <code>: Dictionary = {...}`. Translate every value. If translations aren't provided,
   keep the English text, add a `// TODO(i18n): translate` comment to each value, and tell the user.
3. Register it in the `dictionaries` record in `src/i18n/index.ts`.
4. Check for anything outside the dictionary that depends on the locale: `Intl` formatting and
   locale-specific images or OG images.
5. Run the `verify-site` skill. Confirm that `dist/<code>.html` exists, the switcher shows the new
   language, and every page's hreflang list includes it.

Astro i18n config and the sitemap read `locales` from `config.ts`, so they need no changes.

To change the **default** locale, edit `defaultLocale`. The old default then gets a URL prefix
and the new one moves to `/`. That changes public URLs, so warn the user about SEO and redirects.
