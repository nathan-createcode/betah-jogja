import { useEffect, useMemo, useState } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { STATUS_AWAL, susunHasil } from '../lib/pencarian.js'
import {
  LABEL_COLOKAN, LABEL_LOKASI, LABEL_MODUL, LABEL_TIPE, desimal4, persen, tanggal, teksHarga,
} from '../lib/format.js'
import { kelasAksen, LABEL_KRITERIA_TAMPIL } from '../lib/teksSkor.js'
import Lencana from '../components/Lencana.jsx'
import BatangPersen from '../components/BatangPersen.jsx'
import { susunAlasanTempat } from '../lib/alasan.js'
import TombolFavorit from '../components/TombolFavorit.jsx'
import FotoPlaceholder from '../components/FotoPlaceholder.jsx'
import BarisSkor from '../components/BarisSkor.jsx'
import { Ikon, ikonFasilitas } from '../components/Ikon.jsx'

function bintangUlasan(n) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`Rating ${n} dari 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < n ? 'var(--status-warning)' : 'var(--border-strong)' }}>
          {i < n ? <Ikon.BintangIsi size={16} /> : <Ikon.Bintang size={16} />}
        </span>
      ))}
    </span>
  )
}

function Fakta({ label, anak, lebar = false }) {
  if (anak == null || anak === '') return null
  return (
    <div className={lebar ? 'sm:col-span-2' : ''}>
      <dt className="text-[14px] text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-0.5 text-[16px] text-[var(--text-main)]">{anak}</dd>
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
    repo.ulasan(t.id)
      .then((ulasan) => { if (!batal) setEkstra({ status: 'siap', ulasan }) })
      .catch((e) => { if (!batal) setEkstra({ status: 'galat', pesan: e.message }) })
    return () => { batal = true }
  }, [t, repo])

  useEffect(() => {
    if (t) document.title = `${t.nama} · Betah Jogja`
  }, [t])

  const kecocokan = useMemo(() => {
    if (!t) return null
    const hitung = (status) => susunHasil({ modul: t.modul, tempatModul: tempat[t.modul], kriteria: kriteria[t.modul], konfigurasi, status })
    const dariPencarian = hitung(tabs[t.modul])
    const temu = dariPencarian.daftar.find((d) => d.tempat.id === t.id)
    if (temu && temu.persen !== null) {
      return { ...temu, jumlah: dariPencarian.jumlah, sumber: 'pencarian', kriteriaDipakai: dariPencarian.kriteriaDipakai, kriteriaDibuang: dariPencarian.kriteriaDibuang }
    }
    const semua = hitung(STATUS_AWAL())
    const dariSemua = semua.daftar.find((d) => d.tempat.id === t.id)
    return dariSemua && dariSemua.persen !== null
      ? { ...dariSemua, jumlah: semua.jumlah, sumber: 'semua', kriteriaDipakai: semua.kriteriaDipakai, kriteriaDibuang: semua.kriteriaDibuang }
      : null
  }, [t, tabs, tempat, kriteria, konfigurasi])

  if (!t) {
    return (
      <div className="space-y-4">
        <p className="kartu p-4 text-[16px] text-[var(--text-main)]">Tempat tidak ditemukan.</p>
        <button type="button" onClick={kembali} className="tombol-halus gap-1"><Ikon.Kiri size={18} /> Kembali</button>
      </div>
    )
  }

  const ulasan = ekstra.status === 'siap' ? ekstra.ulasan : []
  const rataRata = ulasan.length ? ulasan.reduce((s, u) => s + u.rating, 0) / ulasan.length : null
  const cw = t.modul === 'CW'
  const alasan = susunAlasanTempat(t, kriteria[t.modul]) || kecocokan?.alasan

  return (
    <article className={`${kelasAksen(t.modul)} space-y-6`}>
      <button type="button" onClick={kembali} className="tombol-halus gap-1 text-[14px]"><Ikon.Kiri size={18} /> Kembali</button>

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6 lg:col-start-1">
          <FotoPlaceholder modul={t.modul} tipe={t.tipe_tempat} rasio="21/9" />
          <header className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-[32px] font-semibold md:text-[36px]">{t.nama}</h1>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Lencana warna="aksen">{LABEL_TIPE[t.tipe_tempat]}</Lencana>
                <Lencana>{LABEL_LOKASI[t.tipe_lokasi]}</Lencana>
                <Lencana warna="simulasi">{konfigurasi.labelSimulasi}</Lencana>
              </div>
            </div>
            <TombolFavorit id={t.id} nama={t.nama} />
          </header>
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div className="kartu p-5">
            {kecocokan && (
              <section aria-label="Kecocokan" className="border-b border-[var(--border-light)] pb-5">
                <h2 className="text-[14px] font-semibold text-[var(--text-secondary)]">Kecocokan</h2>
                <p className="angka mt-1 text-[44px] font-semibold leading-none" style={{ color: 'var(--aksen)' }}>{persen(kecocokan.persen)}</p>
                <BatangPersen nilai={kecocokan.persen} className="mt-3" />
                {alasan && <p className="mt-3 text-[14px] text-[var(--text-secondary)]">{alasan}</p>}
              </section>
            )}
            <div className={kecocokan ? 'pt-5' : ''}>
              <p className="text-[14px] font-semibold text-[var(--text-secondary)]">Harga</p>
              <p className="angka mt-1 text-[20px] font-semibold">{teksHarga(t)}</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-12 lg:col-start-1">
          <section>
            <h2 className="text-[20px] font-semibold">Seperti apa tempat ini</h2>
            <div className="mt-2 divide-y divide-[var(--border-light)]">
              {kriteria[t.modul].filter((k) => k.tipe !== 'cost').map((k) => (
                <div key={k.kode} className="py-4">
                  <BarisSkor kriteria={k} tempat={t} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold">Fasilitas dan informasi</h2>
            {t.fasilitasList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {t.fasilitasList.map((f) => {
                  const IkonF = ikonFasilitas(f)
                  return (
                    <span key={f} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-surface)] px-3 text-[14px]">
                      <span style={{ color: 'var(--aksen)' }}><IkonF size={16} /></span>
                      {f}
                    </span>
                  )
                })}
              </div>
            )}
            <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <Fakta label="Area" anak={t.area_deskripsi} lebar />
              {cw && <Fakta label="Jam" anak={t.jam_operasional} />}
              {cw && <Fakta label="Colokan" anak={t.jumlah_colokan ? (LABEL_COLOKAN[t.jumlah_colokan] ?? t.jumlah_colokan) : null} />}
              {!cw && <Fakta label="Kecepatan internet" anak={t.internet_mbps ? `± ${t.internet_mbps} Mbps (hanya informasi)` : null} />}
              <Fakta label="Kapasitas" anak={t.kapasitas != null ? `${t.kapasitas} orang` : null} />
              <Fakta label="Data diperbarui" anak={t.tanggal_pembaruan ? tanggal(t.tanggal_pembaruan) : null} />
              <Fakta label="Sumber data" anak={t.sumber_data} />
            </dl>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold">Ulasan</h2>
            {rataRata !== null && (
              <p className="angka mt-1 text-[14px] text-[var(--text-secondary)]">
                Rata-rata {rataRata.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} dari 5, berdasarkan {ulasan.length} ulasan simulasi
              </p>
            )}
            {ekstra.status === 'galat' && <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Ulasan belum bisa dimuat. {ekstra.pesan}</p>}
            <div className="mt-2 divide-y divide-[var(--border-light)]">
              {ulasan.slice(0, 5).map((u) => (
                <div key={u.id} className="py-4">
                  {bintangUlasan(u.rating)}
                  <p className="mt-2 text-[16px] text-[var(--text-main)]">{u.komentar}</p>
                  <p className="mt-1 text-[14px] text-[var(--text-muted)]">{tanggal(u.tanggal)} · Ulasan simulasi</p>
                </div>
              ))}
            </div>
            {ekstra.status === 'siap' && ulasan.length === 0 && <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Belum ada ulasan.</p>}
          </section>

          <details className="kartu lipat lipat-halus p-4">
            <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-[16px] font-semibold">
              Cara hitungnya
              <span className="flex items-center gap-1 text-[14px] font-medium text-[var(--text-secondary)]">Lihat <Ikon.Bawah size={18} className="chevron" /></span>
            </summary>
            <div className="space-y-3 border-t border-[var(--border-light)] pt-3 text-[14px] text-[var(--text-secondary)]">
              <p>
                Persentase kecocokan memakai metode TOPSIS: seberapa dekat tempat ini ke pilihan terbaik di antara tempat yang sedang dibandingkan.
                Skor SAW dipakai sebagai pembanding, bukan sebagai urutan di halaman utama.
              </p>
              {kecocokan ? (
                <>
                  <p>Skor SAW: <span className="angka font-medium text-[var(--text-main)]">{desimal4(kecocokan.saw)}</span></p>
                  <p>Jumlah tempat pembanding: <span className="angka font-medium text-[var(--text-main)]">{kecocokan.jumlah}</span></p>
                  <p>
                    {kecocokan.sumber === 'pencarian'
                      ? `Angka ini mengikuti pencarianmu di ${LABEL_MODUL[t.modul].toLowerCase()}.`
                      : `Tempat ini tidak masuk pencarian terakhirmu, jadi dihitung dari semua ${LABEL_MODUL[t.modul].toLowerCase()}.`}
                  </p>
                  {kecocokan.kriteriaDipakai?.length > 0 && (
                    <div>
                      <p className="mb-1 font-medium text-[var(--text-main)]">Bobot tiap kriteria</p>
                      <ul className="space-y-1">
                        {kecocokan.kriteriaDipakai.map((k) => (
                          <li key={k.kode}>
                            {LABEL_KRITERIA_TAMPIL[k.kode] ?? k.nama} · {k.tipe} · bobot {k.bobot.pembilang}/{k.bobot.penyebut}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {kecocokan.kriteriaDibuang?.length > 0 && (
                    <p>Kriteria dengan nilai sama di semua pembanding tidak dipakai: {kecocokan.kriteriaDibuang.join(', ')}.</p>
                  )}
                </>
              ) : (
                <p>Persentase belum dihitung karena pembanding tidak cukup.</p>
              )}
            </div>
          </details>
        </div>
      </div>
    </article>
  )
}
