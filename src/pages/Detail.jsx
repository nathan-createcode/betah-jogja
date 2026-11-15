import { useEffect, useMemo, useState } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { STATUS_AWAL, susunHasil } from '../lib/pencarian.js'
import {
  LABEL_LOKASI, LABEL_MODUL, LABEL_TIPE, catatanHarga, desimal4, persen, tanggal, teksHarga,
} from '../lib/format.js'
import { fasilitasUntukChip, susunInfo, teksPembaruan } from '../lib/infoTempat.js'
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

const persenBobot = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function Angka({ children }) {
  return <span className="angka font-medium text-[var(--text-main)]">{children}</span>
}

// Satu langkah penjelasan di panel "Cara hitungnya".
function Langkah({ no, judul, metode, children }) {
  return (
    <li className="flex gap-3">
      <span className="angka flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-light)] text-[12px] font-semibold text-[var(--text-main)]">{no}</span>
      <div className="min-w-0 space-y-1">
        <p className="font-semibold text-[var(--text-main)]">
          {judul}
          {metode && <span className="ml-2 rounded-md border border-[var(--border-light)] px-1.5 py-0.5 align-middle text-[12px] font-medium text-[var(--text-secondary)]">{metode}</span>}
        </p>
        {children}
      </div>
    </li>
  )
}

function Fakta({ label, anak, catatan }) {
  return (
    <div>
      <dt className="text-[14px] text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-0.5 text-[16px] font-medium text-[var(--text-main)]">{anak}</dd>
      {catatan && <dd className="mt-0.5 text-[14px] text-[var(--text-secondary)]">{catatan}</dd>}
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
  const info = susunInfo(t)
  const chip = fasilitasUntukChip(t)
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
          <div className="bento kartu p-6">
            {kecocokan && (
              <section aria-label="Kecocokan" className="border-b border-[var(--border-light)] pb-5">
                <h2 className="text-[14px] font-semibold text-[var(--text-secondary)]">Kecocokan</h2>
                <p className="angka mt-1 text-[44px] font-semibold leading-none" style={{ color: 'var(--aksen)' }}>{persen(kecocokan.persen)}</p>
                <BatangPersen nilai={kecocokan.persen} className="mt-3" />
                <p className="mt-2 text-[14px] text-[var(--text-muted)]">
                  {kecocokan.sumber === 'pencarian'
                    ? `Dibandingkan dengan ${kecocokan.jumlah - 1} tempat lain yang lolos filtermu.`
                    : `Di luar filter terakhirmu, jadi dibandingkan dengan semua ${LABEL_MODUL[t.modul].toLowerCase()} lain.`}
                </p>
                {alasan && <p className="mt-3 text-[14px] text-[var(--text-secondary)]">{alasan}</p>}
              </section>
            )}
            <div className={kecocokan ? 'pt-5' : ''}>
              <p className="text-[14px] font-semibold text-[var(--text-secondary)]">Harga</p>
              <p className="angka mt-1 text-[20px] font-semibold">{teksHarga(t)}</p>
              {catatanHarga(t) && <p className="mt-0.5 text-[14px] text-[var(--text-secondary)]">{catatanHarga(t)}</p>}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-12 lg:col-start-1">
          <section>
            <h2 className="text-[26px] font-semibold">Seperti apa <em className="sorot">tempat</em> ini</h2>
            <div className="mt-2 divide-y divide-[var(--border-light)]">
              {kriteria[t.modul].filter((k) => k.tipe !== 'cost').map((k) => (
                <div key={k.kode} className="py-4">
                  <BarisSkor kriteria={k} tempat={t} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[26px] font-semibold">Fasilitas dan <em className="sorot">informasi</em></h2>
            {t.area_deskripsi && (
              <p className="mt-3 text-[16px] text-[var(--text-secondary)]">{t.area_deskripsi}</p>
            )}
            {chip.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">Fasilitas</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {chip.map((f) => {
                    const IkonF = ikonFasilitas(f)
                    return (
                      <li key={f} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-surface)] px-3 text-[14px]">
                        <span style={{ color: 'var(--aksen)' }}><IkonF size={16} /></span>
                        {f}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {info.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">Info singkat</h3>
                <dl className="mt-3 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {info.map((i) => <Fakta key={i.id} label={i.label} anak={i.nilai} catatan={i.catatan} />)}
                </dl>
              </div>
            )}
            <p className="mt-6 text-[14px] text-[var(--text-muted)]">{teksPembaruan(t)}</p>
          </section>

          <section>
            <h2 className="text-[26px] font-semibold"><em className="sorot">Ulasan</em></h2>
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
            <div className="border-t border-[var(--border-light)] pt-4 text-[14px] text-[var(--text-secondary)]">
              {kecocokan ? (
                <>
                  <p>
                    Persentase kecocokan memakai metode TOPSIS: seberapa dekat tempat ini ke pilihan terbaik di antara tempat yang sedang dibandingkan.
                    Skor SAW dihitung juga sebagai pembanding, bukan sebagai urutan di halaman utama.
                  </p>
                  <p className="mt-2">Prosesnya 6 langkah. Angka di bawah adalah hitungan nyata untuk tempat ini.</p>
                  <ol className="mt-4 space-y-5">
                    <Langkah no={1} judul="Kumpulkan tempat pembanding" metode="Persiapan">
                      <p>
                        {kecocokan.sumber === 'pencarian'
                          ? <>Tempat yang lolos filtermu dikumpulkan sebagai pembanding. Sekarang ada <Angka>{kecocokan.jumlah}</Angka> tempat.</>
                          : <>Tempat ini di luar filter terakhirmu, jadi pembandingnya adalah semua <Angka>{kecocokan.jumlah}</Angka> {LABEL_MODUL[t.modul].toLowerCase()}.</>}
                      </p>
                    </Langkah>
                    <Langkah no={2} judul="Pilih sisi penilaian yang dipakai" metode="Persiapan">
                      <p>Sisi penilaian yang nilainya sama di semua pembanding tidak membantu membedakan, jadi dibuang.</p>
                      <p>
                        {kecocokan.kriteriaDibuang?.length > 0
                          ? `Dibuang: ${kecocokan.kriteriaDibuang.map((kode) => (LABEL_KRITERIA_TAMPIL[kode] ?? kode).toLowerCase()).join(', ')}.`
                          : 'Tidak ada yang dibuang, semua sisi dipakai.'}
                      </p>
                    </Langkah>
                    <Langkah no={3} judul="Tentukan pengaruh tiap sisi (bobot)" metode="Persiapan">
                      <p>Tiap sisi punya bobot tetap dari tabel kriteria. Bobot dihitung ulang agar totalnya 100% dari sisi yang dipakai.</p>
                      <ul className="space-y-0.5">
                        {kecocokan.kriteriaDipakai.map((k) => (
                          <li key={k.kode}>
                            {LABEL_KRITERIA_TAMPIL[k.kode] ?? k.kode} · <Angka>{persenBobot.format((k.bobotDesimal ?? k.bobot.pembilang / k.bobot.penyebut) * 100)}%</Angka> · {k.tipe === 'cost' ? 'makin murah makin baik' : 'makin tinggi makin baik'}
                          </li>
                        ))}
                      </ul>
                    </Langkah>
                    <Langkah no={4} judul="Hitung skor SAW" metode="SAW · pembanding">
                      <p>
                        Nilai tempat di tiap sisi dibandingkan dengan yang terbaik di antara pembanding (untuk harga, dengan yang termurah), dikalikan bobot, lalu dijumlahkan.
                        Skor SAW tempat ini: <Angka>{desimal4(kecocokan.saw)}</Angka> dari skala 0 sampai 1.
                      </p>
                      <p>Skor SAW tidak menentukan urutan. Urutan di halaman hasil memakai persentase TOPSIS pada langkah 6.</p>
                    </Langkah>
                    <Langkah no={5} judul="Ukur jarak ke tempat terbaik dan terburuk" metode="TOPSIS">
                      <p>
                        Nilai disamakan skalanya dan dikalikan bobot. Dari semua pembanding dibentuk dua tempat bayangan: yang terbaik di setiap sisi, dan yang terburuk di setiap sisi.
                      </p>
                      <p>
                        Jarak tempat ini ke yang terbaik (D+) = <Angka>{desimal4(kecocokan.dPlus)}</Angka>. Jarak ke yang terburuk (D−) = <Angka>{desimal4(kecocokan.dMinus)}</Angka>.
                      </p>
                    </Langkah>
                    <Langkah no={6} judul="Hitung persentase kecocokan" metode="TOPSIS · dipakai untuk urutan">
                      <p>Persentase = D− ÷ (D+ + D−) × 100. Makin dekat ke yang terbaik dan makin jauh dari yang terburuk, makin besar.</p>
                      <p>
                        Untuk tempat ini: <Angka>{desimal4(kecocokan.dMinus)} ÷ ({desimal4(kecocokan.dPlus)} + {desimal4(kecocokan.dMinus)}) × 100 = {persen(kecocokan.persen)}</Angka> (angka dibulatkan).
                      </p>
                    </Langkah>
                  </ol>
                  <p className="mt-5 border-t border-[var(--border-light)] pt-3">
                    Urutan di halaman hasil mengikuti persentase ini. Karena pembandingnya adalah tempat yang lolos filter, mengubah filter bisa mengubah persentase.
                  </p>
                </>
              ) : (
                <p>Persentase belum bisa dihitung karena filter menyisakan terlalu sedikit tempat. Dibutuhkan minimal {konfigurasi.minKandidat} tempat pembanding.</p>
              )}
            </div>
          </details>
        </div>
      </div>
    </article>
  )
}
