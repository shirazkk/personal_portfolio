'use client';

import { useEffect, type RefObject } from 'react';

/**
 * CSS `position: sticky` handles the actual card stacking. This hook only
 * adds the depth effect: the previous card shrinks slightly (max 5%) as the
 * next card scrolls up to cover it. It writes `transform` only and reads
 * offsets once per resize, so scrolling stays free of layout reads.
 */
export function useStickyStack(
  containerRef: RefObject<HTMLElement | null>,
  cardSelector: string,
) {
  useEffect(() => {
    // Respect reduced motion: keep the sticky layout, drop the scale effect.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>(cardSelector));
    if (cards.length < 2) return;

    let frame = 0;
    let tops: number[] = []; // sticky `top` per card
    let offsets: number[] = []; // natural document offset per card

    // `offsetTop` ignores sticky positioning and transforms, so measuring is safe
    // even when the page is restored mid-scroll.
    const documentTop = (element: HTMLElement) => {
      let top = 0;
      let node: HTMLElement | null = element;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return top;
    };

    const measure = () => {
      tops = cards.map((card) => parseFloat(getComputedStyle(card).top) || 0);
      offsets = cards.map(documentTop);
    };

    const update = () => {
      frame = 0;
      const scroll = window.scrollY;
      const viewport = window.innerHeight;

      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (!next) {
          card.style.transform = '';
          return;
        }

        const nextTop = offsets[index + 1] - scroll;
        const end = tops[index + 1] ?? 0;
        const progress = Math.min(
          1,
          Math.max(0, (viewport - nextTop) / Math.max(1, viewport - end)),
        );

        card.style.transform = `scale(${(1 - progress * 0.05).toFixed(4)})`;
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      requestUpdate();
    };

    measure();
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
      if (frame) window.cancelAnimationFrame(frame);
      cards.forEach((card) => {
        card.style.transform = '';
      });
    };
  }, [containerRef, cardSelector]);
}
