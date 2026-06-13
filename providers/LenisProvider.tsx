'use client'
import { ReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { ReactNode, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    
    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis 
      root 
      ref={lenisRef}
      autoRaf={false}
      options={{ lerp: 0.08, duration: 1.4, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  )
}
