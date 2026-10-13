import { useEffect, useMemo, useRef } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { ambilGulir, simpanGulir, useStatus } from '../state/StatusPencarian.jsx'
import { pesanKosongAnggaran, susunHasil } from '../lib/pencarian.js'
import { LABEL_MODUL } from '../lib/format.js'
import FilterPanel from '../components/FilterPanel.jsx'
import KartuTempat from '../components/KartuTempat.jsx'

// Menyimpan posisi gulir tiap tab dan memulihkannya saat tab berganti atau kembali dari detail.
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
  const kosong = hasil.status === 'kosong' || hasil.status === 'kosong_anggaran'
  const kosongInfo = kosong ? pesanKosongAnggaran(hasil, hasil.anggaran.ketik) : null
  const adaPersen = hasil.status === 'ok'

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Pilih modul" className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/70 p-1">
        {['CW', 'LS'].map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={tab === m}
            onClick={() => setTab(m)}
            className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition ${
              tab === m ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {LABEL_MODUL[m]}
          </button>
        ))}
      </div>

      <FilterPanel modul={tab} status={status} hasil={hasil} ubah={(patch) => ubah(tab, patch)} onReset={() => reset(tab)} />

      {hasil.catatan.filter((c) => c !== 'Semua tempat tercakup').map((c) => (
        <p key={c} className="rounded-xl bg-teal-50 px-3 py-2 text-sm text-teal-900">{c}</p>
      ))}

      {hasil.status === 'anggaran_tidak_valid' && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Perbaiki isian anggaran di atas untuk melihat hasil.
        </p>
      )}

      {kosong && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p>{kosongInfo.pesan}</p>
          {kosongInfo.tombol !== null && (
            <button
              type="button"
              onClick={() => ubah(tab, { anggaran: 'ketik', anggaranTeks: String(kosongInfo.tombol) })}
              className="mt-3 rounded-lg bg-teal-600 px-3 py-2 font-medium text-white transition hover:bg-teal-700"
            >
              Naikkan ke Rp {new Intl.NumberFormat('id-ID').format(kosongInfo.tombol)}
            </button>
          )}
        </div>
      )}

      {hasil.status === 'pembanding_tidak_cukup' && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">Pembanding tidak cukup</p>
      )}

      <div className="space-y-3">
        {hasil.daftar.map((item) => (
          <KartuTempat
            key={item.tempat.kode}
            item={item}
            adaPersen={adaPersen}
            minKandidat={hasil.status === 'pembanding_tidak_cukup' ? konfigurasi.minKandidat : null}
            dipilih={status.banding.includes(item.tempat.id)}
            bisaPilih={status.banding.length < 3}
            onPilih={gantiPilihan}
          />
        ))}
      </div>

      {status.banding.length > 0 && (
        <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          <span>{status.banding.length} dipilih (maks 3)</span>
          <span className="flex items-center gap-3">
            <button type="button" onClick={() => ubah(tab, { banding: [] })} className="text-slate-300 underline">Kosongkan</button>
            {status.banding.length >= 2 ? (
              <a href={`#/bandingkan/${tab}`} className="rounded-lg bg-teal-500 px-3 py-1.5 font-medium text-white">Bandingkan</a>
            ) : (
              <span className="text-slate-300">Pilih 1 lagi</span>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
