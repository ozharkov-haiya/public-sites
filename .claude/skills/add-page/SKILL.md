---
name: add-page
description: Add a new localized page (e.g. /about, /pricing, /privacy) to a public site so it is built for every locale with correct links, SEO, and navigation. Use when the user asks for a new page or route.
---

# Add a localized page

1. **Create `apps/<site>/src/pages/[...locale]/<slug>.astro`:**

   ```astro
   ---
   import { getDictionary, getLocaleStaticPaths, type Locale } from '@/i18n';
   import BaseLayout from '@/layouts/BaseLayout.astro';

   export function getStaticPaths() {
     return getLocaleStaticPaths();
   }

   interface Props {
     locale: Locale;
   }

   const { locale } = Astro.props;
   const t = getDictionary(locale);
   ---

   <BaseLayout locale={locale} title={t.<slug>.meta.title} description={t.<slug>.meta.description}>
     <!-- sections -->
   </BaseLayout>
   ```

   This produces `/<slug>` for the default locale and `/<locale>/<slug>` for the others.
   Nested paths work too: `[...locale]/legal/privacy.astro`.

2. **Add a dictionary group** `<slug>: { meta: { title, description }, ... }` to `en.ts`,
   then to every other locale.

3. **Link to the page** with `localizePath(locale, '/<slug>')` (header/footer nav, CTAs). Add
   the nav label under `nav` in the dictionaries.

4. **Long-form content** (legal text, articles): use a content collection with
   `src/content/<collection>/<locale>/<slug>.md` and render it in the page, instead of
   putting paragraphs in dictionaries.

5. Run the `verify-site` skill. Confirm `dist/<slug>.html` and `dist/<locale>/<slug>.html`
   exist, and that the page is in `sitemap-0.xml` with hreflang alternates.

Localized slugs (`/da/om-os` instead of `/da/about`) are not supported yet. Ask before
building them. They need a slug map in `src/i18n` and changes to `getLocaleStaticPaths`,
`getRoutePath`, and the language switcher.
