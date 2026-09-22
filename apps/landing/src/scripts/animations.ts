/**
 * Declarative scroll-reveal animations powered by Motion (https://motion.dev).
 *
 *   <div data-animate="fade-up">…</div>              reveal one element
 *   <div data-animate="fade-up" data-animate-delay="0.2">…</div>
 *   <ul data-animate-stagger="fade-up">…</ul>        reveal direct children one by one
 *
 * Initial hidden state lives in global.css. With reduced motion on, nothing is
 * hidden and this script does nothing.
 */
// `motion/mini` is the ~2.5kb WAAPI build. Switch to `motion` if you need springs,
// independent transforms (`x`, `y`, `scale`) or `scroll()`-linked timelines.
import { animate } from 'motion/mini';
import { inView, stagger, type DOMKeyframesDefinition } from 'motion';

const presets = {
  'fade-up': { opacity: [0, 1], transform: ['translateY(24px)', 'none'] },
  'fade-in': { opacity: [0, 1] },
  'scale-in': { opacity: [0, 1], transform: ['scale(0.96)', 'none'] },
} satisfies Record<string, DOMKeyframesDefinition>;

type Preset = keyof typeof presets;

const ease = [0.16, 1, 0.3, 1] as const; // matches --ease-out-expo
const duration = 0.7;

function getPreset(name: string | undefined): DOMKeyframesDefinition {
  return presets[(name ?? '') as Preset] ?? presets['fade-up'];
}

function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-animate]').forEach((element) => {
    inView(
      element,
      () => {
        animate(element, getPreset(element.dataset.animate), {
          duration,
          ease,
          delay: Number(element.dataset.animateDelay ?? 0),
        });
      },
      { amount: 0.2 },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-animate-stagger]').forEach((group) => {
    inView(
      group,
      () => {
        animate([...group.children], getPreset(group.dataset.animateStagger), {
          duration,
          ease,
          delay: stagger(0.08),
        });
      },
      { amount: 0.2 },
    );
  });
}

init();
