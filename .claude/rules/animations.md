---
paths:
  - 'apps/*/src/**/*.astro'
  - 'apps/*/src/scripts/**'
  - 'apps/*/src/styles/**'
---

# Animation rules

Choose the lightest tool that does the job:

1. **CSS transitions** for hover and focus states: `transition-* duration-300 ease-out-expo`.
2. **Scroll reveals** with data attributes (handled by `src/scripts/animations.ts`):
   - `data-animate="fade-up|fade-in|scale-in"` on one element
   - `data-animate-delay="0.2"` (seconds) to sequence siblings
   - `data-animate-stagger="fade-up"` on a parent reveals its **direct children** one by one
   - Add a preset to `presets` in `animations.ts` instead of writing one-off scripts.
3. **Custom Motion code** (https://motion.dev, vanilla API: `animate`, `inView`, `scroll`,
   `stagger`, `hover`, `press`) in a component `<script>` for anything bespoke.
   - `animate` from `motion/mini` (~2.5 kB, WAAPI) is the default. Import from `motion` only
     when you need springs, `x`/`y`/`scale` shorthands, or animating non-CSS values. Note the
     bundle cost in the PR.
   - Scroll-linked effects: `scroll(animate(...), { target })` or CSS `animation-timeline: view()`.
4. **Page transitions:** cross-document View Transitions are already on (`@view-transition` in
   `global.css`). Use `view-transition-name` for shared-element effects. No client router.

Hard rules:

- **Reduced motion:** everything must work with `prefers-reduced-motion: reduce`. Content is
  never hidden in that mode, and custom scripts must check
  `matchMedia('(prefers-reduced-motion: reduce)')` before animating.
- **No JS, no hidden content:** the initial hidden state is scoped to `html.js` in CSS.
  Follow the same pattern for new hidden states.
- Animate only `transform`, `opacity`, `filter`, and `clip-path`. Never animate layout properties
  (`width`, `top`, `margin`).
- Nothing above the fold waits more than ~300 ms to appear (LCP).
- No scroll-jacking and no animation loops that can't be paused.
