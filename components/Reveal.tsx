'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MOTION, prefersReducedMotion } from '@/lib/animations';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Animate matching descendants one by one instead of the wrapper itself. */
  stagger?: number;
  itemSelector?: string;
  delay?: number;
  y?: number;
  start?: string;
}

/**
 * Reusable reveal wrapper: fade + slide-up once on scroll.
 * Only animates transform/opacity and does nothing for reduced-motion users.
 */
export default function Reveal({
  children,
  className,
  stagger = 0,
  itemSelector = '[data-reveal-item]',
  delay = 0,
  y = MOTION.distance,
  start = MOTION.start,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const items = stagger > 0 ? ref.current.querySelectorAll(itemSelector) : null;
    const hasItems = Boolean(items?.length);
    const targets = hasItems && items ? items : ref.current;

    gsap.fromTo(
      targets,
      { y, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: MOTION.revealDuration,
        delay,
        stagger: hasItems ? stagger : 0,
        ease: MOTION.ease,
        scrollTrigger: { trigger: ref.current, start, once: true },
      },
    );
  }, { scope: ref });

  return <div ref={ref} className={className}>{children}</div>;
}
