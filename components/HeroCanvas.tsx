'use client';

import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; radius: number };

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let covered = false;
    let onScreen = true;
    let pointerX = -1000;
    let pointerY = -1000;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25); // capped for mobile paint cost
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(90, Math.max(32, Math.round((width * height) / 16000)));
      particles.length = 0;
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: Math.random() * 1.3 + 0.7,
        });
      }

      // Only paint a static frame when the loop is paused; a running loop
      // redraws with the new particles on its next frame.
      if (!running) render();
      start();
    };

    const render = () => {
      frame = 0;
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.x += (pointerX - particle.x) * 0.00012;
          particle.y += (pointerY - particle.y) * 0.00012;
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          if (particle.y < -8) particle.y = height + 8;
          if (particle.y > height + 8) particle.y = -8;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(50, 157, 110, 0.58)';
        context.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 154) continue;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(50, 157, 110, ${0.3 * (1 - distance / 154)})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }

      if (!reducedMotion && running) frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (reducedMotion || running || covered || !onScreen || document.hidden) return;
      running = true;
      frame = window.requestAnimationFrame(render);
    };

    const stop = () => {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onScroll = () => {
      // The hero is pinned behind the About panel; stop painting once covered.
      covered = window.scrollY > window.innerHeight * 0.9;
      if (covered) stop();
      else start();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!running) return;
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    intersectionObserver.observe(canvas);

    resize();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full opacity-90" />;
}
