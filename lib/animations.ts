import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const revealText = (element: string | HTMLElement) => {
  return gsap.from(element, {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.1,
  });
};

export const fadeInSlideUp = (element: string | HTMLElement, trigger: string | HTMLElement) => {
  return gsap.from(element, {
    scrollTrigger: {
      trigger: trigger,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.2,
  });
};

export const staggerCards = (elements: string | HTMLElement[], trigger: string | HTMLElement) => {
  return gsap.from(elements, {
    scrollTrigger: {
      trigger: trigger,
      start: 'top 85%',
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
  });
};
