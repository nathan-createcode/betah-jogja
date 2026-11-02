import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { ambilGulir, simpanGulir, useStatus } from '../state/StatusPencarian.jsx'
import { pesanKosongAnggaran, susunHasil } from '../lib/pencarian.js'
import { LABEL_MODUL } from '../lib/format.js'
import { ringkasanFilter } from '../lib/ringkasan.js'
import { kelasAksen } from '../lib/teksSkor.js'
import FilterPanel from '../components/FilterPanel.jsx'
import KartuTempat from '../components/KartuTempat.jsx'
import { KeadaanKosong, KeadaanPembanding } from '../components/Keadaan.jsx'
import { Ikon } from '../components/Ikon.jsx'

// Selaras dengan breakpoint `lg` Tailwind (64rem = 1024px).
function useLayarLebar() {
  const q = '(min-width: 1024px)'
  const [lebar, setLebar] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setLebar(m.matches)
    m.addEventListener('change', f)
    f()
    return () => m.removeEventListener('change', f)
  }, [])
  return lebar
}

function useGulirTersimpan(tab) {
  const tabRef = useRef(tab)
  tabRef.current = tab
  const abaikan = useRef(false)

  useEffect(() => {
    abaikan.current = true
    const y = ambilGulir(tab)
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, y)
      setTimeout(() => { abaikan.current = false }, 200)
    })
    return () => cancelAnimationFrame(id)
  }, [tab])

  useEffect(() => {
    const catat = () => { if (!abaikan.current) simpanGulir(tabRef.current, window.scrollY) }
    window.addEventListener('scroll', catat, { passive: true })
    return () => window.removeEventListener('scroll', catat)
  }, [])
}

export default function Cari() {
  const { konfigurasi, kriteria, tempat } = useData()
  const { tab, tabs, setTab, ubah, reset } = useStatus()
  const status = tabs[tab]
  useGulirTersimpan(tab)

  const hasil = useMemo(
    () => susunHasil({ modul: tab, tempatModul: tempat[tab], kriteria: kriteria[tab], konfigurasi, status }),
    [tab, tempat, kriteria, konfigurasi, status]
  )

  const gantiPilihan = (id) => {
    const sudah = status.banding.includes(id)
    ubah(tab, { banding: sudah ? status.banding.filter((x) => x !== id) : [...status.banding, id] })
  }
  const gantiModul = (m) => {
    setTab(m)
    window.location.hash = m === 'LS' ? '#/tinggal' : '#/kerja'
  }
  const kosong = hasil.status === 'kosong' || hasil.status === 'kosong_anggaran'
  const kosongInfo = kosong ? pesanKosongAnggaran(hasil, hasil.anggaran.ketik) : null
  const adaPersen = hasil.status === 'ok'

  const filter = (
    <FilterPanel
      modul={tab}
      status={status}
      hasil={hasil}
      ubah={(patch) => ubah(tab, patch)}
      onReset={() => reset(tab)}
      onGantiModul={gantiModul}
      tampilModul
    />
  )

  const aktif = ringkasanFilter(tab, status)

  // Filter di HP: bisa dilipat (tanpa pop-up, tanpa scroll sendiri). Di desktop selalu terbuka.
  const lebar = useLayarLebar()
  const [bukaFilter, setBukaFilter] = useState(false)

  // Bilah "N dipilih": selalu dirender; saat tertutup diberi inert + aria-hidden.
  // inert diatur lewat ref (bukan props) supaya sama di React 18 maupun 19.
  const bukaBilah = status.banding.length > 0
  const bilahRef = useRef(null)
  const jumlahTerakhir = useRef(0)
  if (status.banding.length > 0) jumlahTerakhir.current = status.banding.length
  const jumlahBilah = status.banding.length > 0 ? status.banding.length : jumlahTerakhir.current
  useLayoutEffect(() => {
    const el = bilahRef.current
    if (!el) return
    if (bukaBilah) {
      el.removeAttribute('aria-hidden')
      el.removeAttribute('inert')
    } else {
      el.setAttribute('inert', '') // dulu inert: fokus keluar sebelum aria-hidden dipasang
      el.setAttribute('aria-hidden', 'true')
    }
  }, [bukaBilah])

  return (
    <div className={`${kelasAksen(tab)} space-y-6 md:space-y-8`}>
      <div className="lg:grid lg:grid-cols-[304px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <aside className="panel-filter mb-6 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:mb-0">
          <details
            className="kartu lipat lipat-halus"
            open={lebar || bukaFilter}
            onToggle={(e) => { if (!lebar) setBukaFilter(e.currentTarget.open) }}
          >
            <summary className="flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 lg:hidden">
              <span style={{ color: 'var(--aksen)' }}><Ikon.Filter size={20} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[16px] font-semibold">
                  Filter
                  {aktif.length > 0 && <span className="angka text-[12px] font-medium" style={{ color: 'var(--aksen)' }}>{aktif.length} aktif</span>}
                </span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {aktif.length === 0 && <span className="text-[14px] text-[var(--text-secondary)]">Semua lokasi dan harga</span>}
                  {aktif.slice(0, 4).map((a) => (
                    <span key={a} className="rounded-md px-2 py-0.5 text-[12px] font-medium" style={{ background: 'var(--aksen-surface)', color: 'var(--aksen)' }}>{a}</span>
                  ))}
                  {aktif.length > 4 && <span className="px-1 py-0.5 text-[12px] font-medium text-[var(--text-secondary)]">+{aktif.length - 4} lainnya</span>}
                </span>
              </span>
              <Ikon.Bawah size={20} className="chevron shrink-0" />
            </summary>
            <div className="p-5 pt-3 lg:pt-5">{filter}</div>
          </details>
        </aside>

        <div className="min-w-0 space-y-4">
          <div>
            <h1 className="text-[28px] font-semibold">{LABEL_MODUL[tab]}</h1>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
              {hasil.status !== 'anggaran_tidak_valid' && (
                <><span className="angka" aria-live="polite">{hasil.jumlah} tempat cocok</span> · </>
              )}
              diurutkan dari yang paling cocok
            </p>
            {aktif.length > 0 && (
              <p className="mt-1 hidden text-[14px] text-[var(--text-secondary)] lg:block">
                <span className="font-medium text-[var(--text-main)]">Filter aktif:</span> {aktif.join(' · ')}
              </p>
            )}
          </div>

          {hasil.catatan.filter((c) => c !== 'Semua tempat tercakup').map((c) => (
            <p key={c} className="flex items-start gap-2 rounded-[10px] border border-[var(--border-light)] bg-[var(--bg-surface)] px-3 py-2 text-[14px] text-[var(--text-secondary)]">
              <span className="mt-0.5 shrink-0" style={{ color: 'var(--aksen)' }}><Ikon.Info size={16} /></span>
              {c}
            </p>
          ))}

          {hasil.status === 'anggaran_tidak_valid' && (
            <p className="kartu p-4 text-[14px] text-[var(--text-main)]">Perbaiki isian anggaran di filter untuk melihat hasil.</p>
          )}

          {kosong && (
            <KeadaanKosong
              pesan={kosongInfo.pesan}
              tombolRp={kosongInfo.tombol}
              onNaikkan={() => ubah(tab, { anggaran: 'ketik', anggaranTeks: String(kosongInfo.tombol) })}
            />
          )}

          {hasil.status === 'pembanding_tidak_cukup' && <KeadaanPembanding />}

          <div className={`space-y-3 ${status.banding.length > 0 ? 'pb-24' : ''}`}>
            {hasil.daftar.map((item, i) => (
              <KartuTempat
                key={item.tempat.kode}
                item={item}
                adaPersen={adaPersen}
                peringkat={adaPersen ? i + 1 : undefined}
                minKandidat={hasil.status === 'pembanding_tidak_cukup' ? konfigurasi.minKandidat : null}
                dipilih={status.banding.includes(item.tempat.id)}
                bisaPilih={status.banding.length < 3}
                onPilih={gantiPilihan}
                tampilBanding
              />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={bilahRef}
        data-buka={bukaBilah ? 'true' : 'false'}
        className="bilah-banding fixed z-30 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--text-main)] px-4 py-2 text-[14px] text-white"
        style={{ bottom: 'calc(var(--dock-h) + env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <span className="angka">{jumlahBilah} dipilih (maks 3)</span>
        <span className="flex items-center gap-3">
          <button type="button" onClick={() => ubah(tab, { banding: [] })} className="min-h-11 text-white/80 underline">Kosongkan</button>
          {jumlahBilah >= 2 ? (
            <a href={`#/bandingkan/${tab}`} className="tombol-utama tombol-terang">Bandingkan</a>
          ) : (
            <span className="text-white/80">Pilih 1 lagi</span>
          )}
        </span>
      </div>
    </div>
  )
}
