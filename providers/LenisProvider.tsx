'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { ReactNode, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const NAV_OFFSET = -72

/** Keeps GSAP ScrollTrigger and Lenis on the same frame. */
function ScrollTriggerSync() {
  const lenis = useLenis()
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!lenis) return
    const instance = lenis

    function update(time: number) {
      instance.raf(time * 1000)
    }

    const syncScrollTrigger = () => ScrollTrigger.update()
    instance.on('scroll', syncScrollTrigger)
    gsap.ticker.lagSmoothing(0)
    gsap.ticker.add(update)
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    void document.fonts.ready.then(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      gsap.ticker.remove(update)
      instance.off('scroll', syncScrollTrigger)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [lenis])

  return null
}

/** Makes every same-page anchor use Lenis instead of jumping (footer, CTAs, skip links). */
function SmoothAnchors() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      const hash = anchor?.getAttribute('href')
      if (!anchor || !hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, {
        offset: hash === '#home' ? 0 : NAV_OFFSET,
        duration: 1.1,
      })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return null
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: reducedMotion ? 1 : 0.08,
        smoothWheel: !reducedMotion,
        syncTouch: false,
      }}
    >
      <ScrollTriggerSync />
      <SmoothAnchors />
      {children}
    </ReactLenis>
  )
}
