import { useLayoutEffect } from 'react'
import { gsap } from './gerak.js'

// Gerak secukupnya untuk daftar hasil: kartu pertama memudar naik sekali saat halaman dibuka.
export function useGerakDaftar(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(Array.from(el.children).slice(0, 8), {
        opacity: 0, y: 14, duration: 0.4, ease: 'power2.out', stagger: 0.04, clearProps: 'transform,opacity',
      })
    }, el)
    return () => mm.revert()
  }, [ref])
}
