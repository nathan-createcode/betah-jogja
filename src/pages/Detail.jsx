import { useEffect, useMemo, useState } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { STATUS_AWAL, susunHasil } from '../lib/pencarian.js'
import {
  LABEL_COLOKAN, LABEL_LOKASI, LABEL_MODUL, LABEL_TIPE, desimal4, persen, tanggal, teksHarga,
} from '../lib/format.js'
import Lencana from '../components/Lencana.jsx'
import TombolFavorit from '../components/TombolFavorit.jsx'

const bintang = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

function Baris({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:gap-4">
      <dt className="text-sm text-slate-500 sm:w-44 sm:shrink-0">{label}</dt>
      <dd className="min-w-0 text-sm text-slate-900">{children}</dd>
    </div>
  )
}

export default function Detail({ id, kembali }) {
  const { konfigurasi, kriteria, tempat, tempatById, repo } = useData()
  const { tabs } = useStatus()
  const t = tempatById(id)
  const [ekstra, setEkstra] = useState({ status: 'memuat' })

  useEffect(() => {
    if (!t) return undefined
    let batal = false
    setEkstra({ status: 'memuat' })
    Promise.all([repo.ulasan(t.id), repo.foto(t.id)])
      .then(([ulasan, foto]) => { if (!batal) setEkstra({ status: 'siap', ulasan, foto }) })
      .catch((e) => { if (!batal) setEkstra({ status: 'galat', pesan: e.message }) })
    return () => { batal = true }
  }, [t, repo])

  // Persentase dan skor SAW: dari pencarian terakhir di tab modul ini bila tempat termasuk kandidat;
  // jika tidak, dihitung terhadap semua tempat pada modul itu.
  const kecocokan = useMemo(() => {
    if (!t) return null
    const hitung = (status) => susunHasil({ modul: t.modul, tempatModul: tempat[t.modul], kriteria: kriteria[t.modul], konfigurasi, status })
    const dariPencarian = hitung(tabs[t.modul])
    const temu = dariPencarian.daftar.find((d) => d.tempat.id === t.id)
    if (temu && temu.persen !== null) return { ...temu, jumlah: dariPencarian.jumlah, sumber: 'pencarian' }
    const semua = hitung(STATUS_AWAL())
    const dariSemua = semua.daftar.find((d) => d.tempat.id === t.id)
    return dariSemua && dariSemua.persen !== null ? { ...dariSemua, jumlah: semua.jumlah, sumber: 'semua' } : null
  }, [t, tabs, tempat, kriteria, konfigurasi])

  if (!t) {
    return (
      <div className="space-y-3">
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Tempat tidak ditemukan.</p>
        <button type="button" onClick={kembali} className="text-sm font-medium text-teal-700 hover:underline">← Kembali</button>
      </div>
    )
  }

  const ulasan = ekstra.status === 'siap' ? ekstra.ulasan : []
  const foto = ekstra.status === 'siap' ? ekstra.foto : []
  const rataRata = ulasan.length ? ulasan.reduce((s, u) => s + u.rating, 0) / ulasan.length : null
  const cw = t.modul === 'CW'

  return (
    <article className="muncul space-y-4">
      <button type="button" onClick={kembali} className="text-sm font-medium text-teal-700 hover:underline">← Kembali</button>

      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-snug">{t.nama}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Lencana warna="teal">{LABEL_MODUL[t.modul]}</Lencana>
              <Lencana>{LABEL_TIPE[t.tipe_tempat]}</Lencana>
              <Lencana>{LABEL_LOKASI[t.tipe_lokasi]}</Lencana>
              {t.tidakAdaWifi && <Lencana warna="merah">Tidak ada Wi-Fi</Lencana>}
              <Lencana warna="amber">{konfigurasi.labelSimulasi}</Lencana>
            </div>
          </div>
          <TombolFavorit id={t.id} nama={t.nama} />
        </div>
        <p className="mt-3 text-lg font-semibold text-slate-800">{teksHarga(t)}</p>
        <p className="mt-1 text-sm text-slate-600">
          {rataRata !== null ? (
            <>Rating rata-rata <strong>{rataRata.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong> / 5 dari {ulasan.length} ulasan simulasi</>
          ) : ekstra.status === 'memuat' ? 'Memuat ulasan…' : 'Belum ada ulasan'}
        </p>
      </header>

      {kecocokan && (
        <section className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-label="Kecocokan">
          <p className="text-sm text-teal-900">Kecocokan</p>
          <p className="text-3xl font-bold text-teal-800">{persen(kecocokan.persen)}</p>
          {kecocokan.alasan && <p className="mt-1 text-sm text-teal-900">{kecocokan.alasan}</p>}
          {konfigurasi.tampilkanSawPembanding && (
            <p className="mt-2 text-sm text-teal-900">Skor SAW (pembanding): <strong>{desimal4(kecocokan.saw)}</strong></p>
          )}
          <p className="mt-2 text-xs text-teal-800">
            {kecocokan.sumber === 'pencarian'
              ? `Dihitung dari ${kecocokan.jumlah} tempat pada pencarianmu di tab ini.`
              : `Dihitung dari semua ${kecocokan.jumlah} tempat di modul ini (tempat ini tidak masuk pencarian terakhirmu).`}
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold">Skor kriteria</h2>
        <ul className="space-y-3">
          {kriteria[t.modul].map((k) => {
            const nilai = t[k.kolom]
            const harga = k.tipe === 'cost'
            const tanpaWifi = k.kolom === 'skor_internet' && nilai === 0
            return (
              <li key={k.kode}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 text-slate-700">{k.nama}</span>
                  <span className="shrink-0 font-semibold text-slate-900">
                    {harga ? teksHarga(t) : tanpaWifi ? 'Tidak ada Wi-Fi' : `${nilai} / 5`}
                  </span>
                </div>
                {!harga && (
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${(nilai / 5) * 100}%` }} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold">Informasi tempat</h2>
        <dl>
          <Baris label="Area">{t.area_deskripsi}</Baris>
          <Baris label="Fasilitas">
            <span className="flex flex-wrap gap-1.5">
              {t.fasilitasList.map((f) => <Lencana key={f}>{f}</Lencana>)}
            </span>
          </Baris>
          {cw && t.jam_operasional && <Baris label="Jam operasional">{t.jam_operasional}</Baris>}
          {cw && t.jumlah_colokan && <Baris label="Colokan">{LABEL_COLOKAN[t.jumlah_colokan] ?? t.jumlah_colokan}</Baris>}
          {!cw && t.internet_mbps && <Baris label="Kecepatan internet">± {t.internet_mbps} Mbps (hanya informasi)</Baris>}
          <Baris label="Kapasitas">{t.kapasitas} orang</Baris>
          <Baris label="Data diperbarui">{tanggal(t.tanggal_pembaruan)}</Baris>
          <Baris label="Sumber data">{t.sumber_data}</Baris>
        </dl>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Foto</h2>
        {ekstra.status === 'galat' && <p className="text-sm text-rose-600">Gagal memuat foto dan ulasan: {ekstra.pesan}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {foto.slice(0, 2).map((f) => (
            <figure key={f.id} className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 via-slate-100 to-amber-100 p-4 text-center">
              <figcaption className="text-sm text-slate-600">{f.keterangan}</figcaption>
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-amber-800">Foto simulasi</span>
            </figure>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Ulasan</h2>
        {ulasan.slice(0, 5).map((u) => (
          <div key={u.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-amber-500" aria-label={`Rating ${u.rating} dari 5`}>{bintang(u.rating)}</span>
              <Lencana warna="amber">Ulasan simulasi</Lencana>
            </div>
            <p className="mt-2 text-sm text-slate-700">{u.komentar}</p>
            <p className="mt-1 text-xs text-slate-400">{tanggal(u.tanggal)}</p>
          </div>
        ))}
        {ekstra.status === 'siap' && ulasan.length === 0 && <p className="text-sm text-slate-500">Belum ada ulasan.</p>}
      </section>
    </article>
  )
}
