/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  printWidth: 100,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
  // Tailwind v4 has no JS config; point the class sorter at the CSS entry instead.
  tailwindStylesheet: './apps/landing/src/styles/global.css',
};
