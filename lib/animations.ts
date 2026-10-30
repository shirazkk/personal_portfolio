import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Shared motion tokens — change speed/intensity here once for the whole site. */
export const MOTION = {
  ease: 'power3.out',
  revealDuration: 0.55, // section reveals (keep under ~600ms)
  distance: 24, // px slide-up
  stagger: 0.07, // ~70ms between staggered children
  start: 'top 85%',
} as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type RevealOptions = {
  targets: gsap.TweenTarget;
  trigger: Element;
  y?: number;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
};

/** Fade + slide-up once, when the trigger first enters the viewport. */
export function revealOnce({
  targets,
  trigger,
  y = MOTION.distance,
  delay = 0,
  stagger = MOTION.stagger,
  duration = MOTION.revealDuration,
  start = MOTION.start,
}: RevealOptions) {
  if (prefersReducedMotion()) return;

  return gsap.fromTo(
    targets,
    { y, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration,
      delay,
      stagger,
      ease: MOTION.ease,
      scrollTrigger: { trigger, start, once: true },
    },
  );
}
