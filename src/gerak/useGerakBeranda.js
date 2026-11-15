import { useEffect, useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, SplitText } from './gerak.js'

// Gerak beranda. Semua dibatasi `prefers-reduced-motion: no-preference` dan dibersihkan saat halaman ditutup.
// Penanda di markup: data-hero, data-hero-kartu, data-judul, data-pola, data-marquee, data-muncul,
// data-garis, data-melebar, data-wordmark.
export function useGerakBeranda(akarRef, dataSiap) {
  useLayoutEffect(() => {
    const akar = akarRef.current
    if (!akar) return undefined
    const mm = gsap.matchMedia()

    mm.add({ halus: '(prefers-reduced-motion: no-preference)', lebar: '(min-width: 768px)' }, (konteks) => {
      if (!konteks.conditions.halus) return
      const { lebar } = konteks.conditions
      const q = (selektor) => gsap.utils.toArray(selektor, akar)

      // 1. Judul: kata naik dari balik topeng. Judul hero langsung, judul bagian saat digulir.
      q('[data-judul]').forEach((el) => {
        const langsung = el.dataset.judul === 'hero'
        SplitText.create(el, {
          type: 'words',
          mask: 'words',
          autoSplit: true,
          onSplit: (s) => gsap.from(s.words, {
            yPercent: 115,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.045,
            delay: langsung ? 0.15 : 0,
            scrollTrigger: langsung ? undefined : { trigger: el, start: 'top 88%', once: true },
          }),
        })
      })

      // 2. Kartu hero masuk bergiliran.
      gsap.from(q('[data-hero-kartu]'), {
        y: 56, opacity: 0, scale: 0.96, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.1,
        clearProps: 'transform,opacity',
      })

      // 3. Pola BETAH JOGJA: tiap baris bergeser berlawanan arah mengikuti gulir, plus melayang pelan.
      q('[data-pola]').forEach((pola) => {
        const kartu = pola.parentElement
        pola.querySelectorAll('[data-pola-baris]').forEach((baris, i) => {
          const arah = i % 2 ? 1 : -1
          gsap.to(baris, {
            xPercent: arah * 14, ease: 'none',
            scrollTrigger: { trigger: kartu, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          })
          gsap.to(baris, { x: arah * -36, duration: 9 + i * 1.3, ease: 'sine.inOut', repeat: -1, yoyo: true })
        })
      })

      // 4. Tirai: hero mengecil dan tertinggal saat bagian berikutnya meluncur menimpanya.
      const hero = q('[data-hero]')[0]
      if (hero && lebar) {
        gsap.to(hero, {
          yPercent: 8, scale: 0.94, transformOrigin: '50% 100%', ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top+=72', end: 'bottom top', scrub: true },
        })
      }

      // 5. Teks berjalan: makin cepat saat gulir kencang, berbalik saat gulir ke atas.
      const jalur = q('[data-marquee]')[0]
      if (jalur) {
        const putar = gsap.to(jalur, { xPercent: -50, ease: 'none', duration: 36, repeat: -1 })
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const dorong = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 7)
            gsap.timeline({ overwrite: true })
              .to(putar, { timeScale: self.direction * dorong, duration: 0.15 })
              .to(putar, { timeScale: self.direction, duration: 1.1 })
          },
        })
      }

      // 6. Bagian muncul saat digulir.
      const muncul = q('[data-muncul]')
      gsap.set(muncul, { opacity: 0, y: 44 })
      ScrollTrigger.batch(muncul, {
        start: 'top 90%',
        once: true,
        onEnter: (els) => gsap.to(els, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true,
          clearProps: 'transform,opacity',
        }),
      })

      // 7. Garis langkah terbentang mengikuti gulir.
      q('[data-garis]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0, transformOrigin: 'left center', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 50%', scrub: true },
        })
      })

      // 8. Kartu ajakan membesar penuh saat masuk layar.
      if (lebar) {
        q('[data-melebar]').forEach((el) => {
          gsap.fromTo(el, { scale: 0.88 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: true },
          })
        })
      }

      // 9. Wordmark di kaki halaman naik pelan.
      q('[data-wordmark]').forEach((el) => {
        gsap.from(el, {
          yPercent: 45, opacity: 0.2, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true },
        })
      })
    }, akar)

    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => mm.revert()
  }, [akarRef])

  // Tinggi halaman berubah saat data tempat selesai dimuat.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [dataSiap])
}
