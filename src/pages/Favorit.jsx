import { useEffect, useMemo, useState } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { useFavorit } from '../lib/favorit.js'
import { STATUS_AWAL, susunHasil } from '../lib/pencarian.js'
import { LABEL_MODUL, LABEL_TIPE } from '../lib/format.js'
import { kelasAksen } from '../lib/teksSkor.js'
import KartuTempat from '../components/KartuTempat.jsx'
import { Ikon } from '../components/Ikon.jsx'
import PolaBetah from '../components/PolaBetah.jsx'

// Pengaturan tampilan favorit (hanya tampilan; isi dan hitungan tidak diubah).
const URUTAN = [
  { id: 'terbaru', label: 'Terakhir disimpan' },
  { id: 'cocok', label: 'Kecocokan tertinggi' },
  { id: 'murah', label: 'Harga termurah' },
  { id: 'nama', label: 'Nama A sampai Z' },
]
const TAB = [
  { id: 'semua', label: 'Semua', pendek: 'Semua', warna: 'var(--text-main)' },
  { id: 'CW', label: 'Tempat kerja', pendek: 'Kerja', warna: 'var(--working-primary)' },
  { id: 'LS', label: 'Tempat tinggal', pendek: 'Tinggal', warna: 'var(--living-primary)' },
]
const IKON_MODUL = { CW: Ikon.Kerja, LS: Ikon.Pintu }
const KUNCI_TAMPILAN = 'dss.favorit.tampilan.v1'
const AWAL = { tab: 'semua', urut: 'terbaru', jenis: 'semua', terbuka: { CW: true, LS: true } }

function bacaTampilan() {
  try {
    const o = JSON.parse(sessionStorage.getItem(KUNCI_TAMPILAN))
    if (!o) return AWAL
    return {
      tab: TAB.some((t) => t.id === o.tab) ? o.tab : AWAL.tab,
      urut: URUTAN.some((u) => u.id === o.urut) ? o.urut : AWAL.urut,
      jenis: typeof o.jenis === 'string' ? o.jenis : AWAL.jenis,
      terbuka: { CW: o.terbuka?.CW !== false, LS: o.terbuka?.LS !== false },
    }
  } catch {
    return AWAL
  }
}

function urutkan(daftar, cara, ids) {
  const nama = (x, y) => x.t.nama.localeCompare(y.t.nama, 'id')
  const a = [...daftar]
  if (cara === 'terbaru') return a.sort((x, y) => ids.indexOf(y.t.id) - ids.indexOf(x.t.id))
  if (cara === 'cocok') return a.sort((x, y) => (y.item.persen ?? -1) - (x.item.persen ?? -1) || nama(x, y))
  if (cara === 'murah') return a.sort((x, y) => x.t.harga - y.t.harga || nama(x, y))
  return a.sort(nama)
}

export default function Favorit() {
  const { konfigurasi, kriteria, tempat, tempatById } = useData()
  const { tabs } = useStatus()
  const { ids } = useFavorit()
  const daftar = ids.map(tempatById).filter(Boolean)

  const peta = useMemo(() => {
    const hasil = {}
    for (const m of ['CW', 'LS']) {
      const dariTab = susunHasil({ modul: m, tempatModul: tempat[m], kriteria: kriteria[m], konfigurasi, status: tabs[m] })
      const semua = susunHasil({ modul: m, tempatModul: tempat[m], kriteria: kriteria[m], konfigurasi, status: STATUS_AWAL() })
      hasil[m] = { dariTab, semua }
    }
    return hasil
  }, [tempat, kriteria, konfigurasi, tabs])

  const itemUntuk = (t) => {
    const { dariTab, semua } = peta[t.modul]
    const a = dariTab.daftar.find((d) => d.tempat.id === t.id)
    if (a) return { item: a, adaPersen: a.persen !== null }
    const b = semua.daftar.find((d) => d.tempat.id === t.id)
    if (b) return { item: b, adaPersen: b.persen !== null }
    return { item: { tempat: t, persen: null, alasan: '' }, adaPersen: false }
  }

  const [tampilan, setTampilan] = useState(bacaTampilan)
  useEffect(() => {
    try { sessionStorage.setItem(KUNCI_TAMPILAN, JSON.stringify(tampilan)) } catch { /* penyimpanan mati: tetap jalan */ }
  }, [tampilan])
  const ubahTampilan = (patch) => setTampilan((s) => ({ ...s, ...patch }))

  const entri = daftar.map((t) => ({ t, ...itemUntuk(t) }))
  const jumlah = { CW: entri.filter((e) => e.t.modul === 'CW').length, LS: entri.filter((e) => e.t.modul === 'LS').length }
  const jumlahTab = { semua: entri.length, ...jumlah }

  const { tab, urut, terbuka } = tampilan
  // Pilihan jenis hanya muncul saat satu kelompok dipilih dan berisi lebih dari satu jenis.
  const opsiJenis = useMemo(() => {
    if (tab === 'semua') return []
    const hitung = {}
    for (const e of entri) if (e.t.modul === tab) hitung[e.t.tipe_tempat] = (hitung[e.t.tipe_tempat] ?? 0) + 1
    const jenisAda = Object.keys(hitung)
    return jenisAda.length > 1 ? jenisAda.map((j) => ({ id: j, jumlah: hitung[j] })) : []
  }, [tab, entri])
  const jenis = opsiJenis.some((o) => o.id === tampilan.jenis) ? tampilan.jenis : 'semua'

  const kelompok = (m) => urutkan(entri.filter((e) => e.t.modul === m && (jenis === 'semua' || e.t.tipe_tempat === jenis)), urut, ids)
  const modulTampil = tab === 'semua' ? ['CW', 'LS'].filter((m) => jumlah[m] > 0) : [tab]

  const kartu = (e) => <KartuTempat key={e.t.id} item={e.item} adaPersen={e.adaPersen} />

  return (
    <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-[32px] font-semibold md:text-[44px]"><em className="sorot">Favorit</em></h1>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
          {daftar.length > 0 && <><span className="angka font-semibold text-[var(--text-main)]">{daftar.length} tempat</span> tersimpan. </>}
          Disimpan di perangkat ini saja.
        </p>
      </div>

      {daftar.length === 0 ? (
        <div className="bento kartu isolasi p-6 md:p-10">
          <PolaBetah opasitas={0.05} baris={5} />
          <p className="lapis text-[24px] font-semibold text-[var(--text-main)]">Belum ada favorit</p>
          <p className="lapis mt-2 max-w-md text-[16px] text-[var(--text-secondary)]">
            Tekan ikon hati pada tempat yang kamu suka, lalu tempat itu muncul di sini supaya mudah kamu cari lagi.
          </p>
          <div className="lapis mt-5 flex flex-wrap gap-2">
            <a href="#/kerja" className="tombol-modul" style={{ '--m': 'var(--working-primary)' }}><Ikon.Kerja size={18} /> Cari tempat kerja</a>
            <a href="#/tinggal" className="tombol-modul" style={{ '--m': 'var(--living-primary)' }}><Ikon.Pintu size={18} /> Cari tempat tinggal</a>
          </div>
        </div>
      ) : (
        <>
          <section className="bento kartu space-y-4 p-4 md:p-5" aria-label="Atur tampilan favorit">
            <div role="group" aria-label="Tampilkan favorit" className="flex gap-1 rounded-full bg-[var(--bg-muted)] p-1">
              {TAB.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  className="segmen min-w-0 flex-1 px-2 sm:px-4"
                  style={{ '--m': x.warna }}
                  aria-pressed={tab === x.id}
                  aria-label={`${x.label}, ${jumlahTab[x.id]} tempat`}
                  onClick={() => ubahTampilan({ tab: x.id, jenis: 'semua' })}
                >
                  <span className="sm:hidden">{x.pendek}</span>
                  <span className="hidden sm:inline">{x.label}</span>
                  <span className="angka ml-1.5 opacity-80">{jumlahTab[x.id]}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <label htmlFor="urut-favorit" className="text-[14px] font-medium text-[var(--text-secondary)]">Urutkan</label>
              <select
                id="urut-favorit"
                className="isian"
                style={{ width: 'auto', minWidth: '13rem', flex: 'none' }}
                value={urut}
                onChange={(e) => ubahTampilan({ urut: e.target.value })}
              >
                {URUTAN.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>

            {opsiJenis.length > 0 && (
              <div className={`${kelasAksen(tab)} flex flex-wrap gap-2`} role="group" aria-label="Jenis tempat">
                <button type="button" className="chip" aria-pressed={jenis === 'semua'} onClick={() => ubahTampilan({ jenis: 'semua' })}>
                  Semua jenis
                </button>
                {opsiJenis.map((o) => (
                  <button key={o.id} type="button" className="chip" aria-pressed={jenis === o.id} onClick={() => ubahTampilan({ jenis: o.id })}>
                    {LABEL_TIPE[o.id] ?? o.id} <span className="angka ml-1 opacity-80">{o.jumlah}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {modulTampil.map((m) => {
            const isi = kelompok(m)
            const IkonModul = IKON_MODUL[m]
            const bisaLipat = tab === 'semua'
            const buka = !bisaLipat || terbuka[m]
            return (
              <section key={m} className={`${kelasAksen(m)} space-y-3`}>
                {bisaLipat && (
                  <h2 className="text-[20px]">
                    <button
                      type="button"
                      id={`judul-${m}`}
                      aria-expanded={buka}
                      aria-controls={`isi-${m}`}
                      onClick={() => ubahTampilan({ terbuka: { ...terbuka, [m]: !terbuka[m] } })}
                      className="kartu-sentuh flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-2 text-left"
                      style={{ background: 'var(--aksen-surface)', borderColor: 'var(--aksen-border)' }}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white" style={{ background: 'var(--aksen)' }}><IkonModul size={18} /></span>
                        <span className="font-semibold tracking-[-0.02em]" style={{ color: 'var(--aksen)' }}>{LABEL_MODUL[m]}</span>
                        <span className="angka rounded-full bg-white/70 px-2.5 py-0.5 text-[13px] font-semibold" style={{ color: 'var(--aksen)' }}>{isi.length}</span>
                      </span>
                      <Ikon.Bawah size={22} className="putar-buka shrink-0" style={{ color: 'var(--aksen)', transform: buka ? 'rotate(180deg)' : 'none' }} />
                    </button>
                  </h2>
                )}
                {buka && (
                  <div id={`isi-${m}`} role={bisaLipat ? 'region' : undefined} aria-labelledby={bisaLipat ? `judul-${m}` : undefined} className="space-y-3">
                    {isi.length > 0 ? isi.map(kartu) : (
                      <div className="bento kartu isolasi p-6 md:p-8">
                        <PolaBetah warna="var(--aksen)" opasitas={0.06} baris={4} />
                        <p className="lapis text-[20px] font-semibold">Belum ada favorit {LABEL_MODUL[m].toLowerCase()}</p>
                        <a href={m === 'LS' ? '#/tinggal' : '#/kerja'} className="tombol-modul lapis mt-4" style={{ '--m': 'var(--aksen)' }}>Cari {LABEL_MODUL[m].toLowerCase()}</a>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}
