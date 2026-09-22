---
paths:
  - 'apps/*/src/**/*.astro'
  - 'apps/*/src/styles/**'
---

# Styling rules (Tailwind CSS v4)

- There is **no `tailwind.config.js`**. Configuration is CSS-first in `src/styles/global.css`:
  - `@theme { --color-brand: ...; }` creates both a utility (`bg-brand`) and a CSS variable
    (`var(--color-brand)`).
  - Namespaces: `--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--radius-*`, `--shadow-*`,
    `--ease-*`, `--animate-*`, `--breakpoint-*`.
  - Custom utilities: `@utility name { ... }`. Variants: `@custom-variant`.
- **Design tokens come from the design.** When a design arrives, update `@theme` first
  (colors, fonts, type scale, radii, shadows), then build sections with those tokens. Don't use
  arbitrary values (`text-[#1a1a1a]`, `mt-[37px]`) unless the value really is one-off.
- **Mobile-first.** Base classes target mobile, then `sm:` / `md:` / `lg:` / `xl:` upward.
  Check at 375px, 768px, and 1440px.
- **Layout width** comes from `<Container>`. Vertical rhythm comes from section padding
  (`py-24 sm:py-32` style). Keep it consistent between sections.
- **Class order** is fixed by `prettier-plugin-tailwindcss`. Don't sort by hand.
- **Conditional classes:** use Astro's `class:list={[...]}`, not string concatenation.
- **Reusable look = component, not `@apply`.** Use `@apply` only in `global.css` base styles.
- **Fonts:** self-host (put `.woff2` in `public/fonts/` with `@font-face` in `global.css`, or use
  Astro's fonts API). Use `font-display: swap` and preload the main weight. No Google Fonts
  `<link>` (privacy and performance).
- **Dark mode** is not in scope until a design asks for it. If it does, use a `@custom-variant dark`
  and token overrides, not duplicated classes.
