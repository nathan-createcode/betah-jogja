import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { susunHasil } from '../lib/pencarian.js'
import {
  LABEL_COLOKAN, LABEL_LOKASI, LABEL_MODUL, LABEL_TIPE, persen, tanggal, teksHarga,
} from '../lib/format.js'
import { kelasAksen, LABEL_KRITERIA_TAMPIL, teksSkor } from '../lib/teksSkor.js'
import { susunAlasanTempat } from '../lib/alasan.js'
import BatangPersen from '../components/BatangPersen.jsx'
import TitikIndikator from '../components/TitikIndikator.jsx'
import FotoPlaceholder from '../components/FotoPlaceholder.jsx'
import { Ikon, ikonFasilitas } from '../components/Ikon.jsx'

function Fasilitas({ daftar }) {
  if (!daftar?.length) return <span className="text-[var(--text-muted)]">—</span>
  return (
    <ul className="flex flex-wrap gap-1.5">
      {daftar.map((f) => {
        const IkonF = ikonFasilitas(f)
        return (
          <li key={f} className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-light)] bg-[var(--bg-surface)] px-2 py-0.5 text-[12px] text-[var(--text-main)]">
            <span style={{ color: 'var(--aksen)' }}><IkonF size={14} /></span>
            {f}
          </li>
        )
      })}
    </ul>
  )
}

const kosong = <span className="text-[var(--text-muted)]">—</span>

// Susun baris perbandingan. `kunci` dipakai untuk menandai baris yang nilainya berbeda.
function susunBaris({ m, kriteriaModul, itemKartu, adaPersen }) {
  const cw = m === 'CW'
  const baris = []
  if (adaPersen) {
    baris.push({
      id: 'persen',
      label: 'Kecocokan',
      kunci: (t, i) => String(itemKartu[i].persen),
      sel: (t, i) => (itemKartu[i].persen == null ? kosong : (
        <>
          <p className="angka text-[24px] font-semibold leading-none" style={{ color: 'var(--aksen)' }}>{persen(itemKartu[i].persen)}</p>
          <BatangPersen nilai={itemKartu[i].persen} className="mt-2" />
        </>
      )),
    })
  }
  baris.push({
    id: 'ringkas',
    label: 'Ringkasan',
    kunci: (t) => susunAlasanTempat(t, kriteriaModul),
    sel: (t) => <span className="text-[14px] text-[var(--text-secondary)]">{susunAlasanTempat(t, kriteriaModul)}</span>,
  })
  baris.push({
    id: 'harga',
    label: 'Harga',
    kunci: (t) => teksHarga(t),
    sel: (t) => <span className="angka text-[16px] font-medium">{teksHarga(t)}</span>,
  })
  for (const k of kriteriaModul.filter((x) => x.tipe !== 'cost')) {
    baris.push({
      id: k.kode,
      label: LABEL_KRITERIA_TAMPIL[k.kode] ?? k.nama,
      kunci: (t) => String(t[k.kolom]),
      sel: (t) => {
        const tampil = teksSkor(k.kode, t[k.kolom])
        if (!tampil) return kosong
        return (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] font-semibold" style={{ color: 'var(--aksen)' }}>{tampil.label}</span>
            {!tampil.tanpaTitik && <TitikIndikator nilai={tampil.nilai} />}
          </div>
        )
      },
    })
  }
  baris.push({
    id: 'fasilitas',
    label: 'Fasilitas',
    kunci: (t) => [...t.fasilitasList].sort().join('|'),
    sel: (t) => <Fasilitas daftar={t.fasilitasList} />,
  })
  const teks = (id, label, ambil) => baris.push({
    id, label, kunci: (t) => String(ambil(t) ?? ''), sel: (t) => <span className="text-[14px]">{ambil(t) || kosong}</span>,
  })
  teks('area', 'Area', (t) => t.area_deskripsi)
  if (cw) {
    teks('jam', 'Jam', (t) => t.jam_operasional)
    teks('colokan', 'Colokan', (t) => (t.jumlah_colokan ? (LABEL_COLOKAN[t.jumlah_colokan] ?? t.jumlah_colokan) : null))
  } else {
    teks('kecepatan', 'Kecepatan internet', (t) => (t.internet_mbps ? `± ${t.internet_mbps} Mbps (hanya informasi)` : null))
  }
  teks('kapasitas', 'Kapasitas', (t) => (t.kapasitas != null ? `${t.kapasitas} orang` : null))
  teks('diperbarui', 'Data diperbarui', (t) => (t.tanggal_pembaruan ? tanggal(t.tanggal_pembaruan) : null))
  teks('sumber', 'Sumber data', (t) => t.sumber_data)
  return baris
}

export default function Bandingkan({ modul, kembali }) {
  const { konfigurasi, kriteria, tempat, tempatById } = useData()
  const { tabs, ubah } = useStatus()
  const m = modul === 'LS' ? 'LS' : 'CW'
  const status = tabs[m]
  const daftar = status.banding.map(tempatById).filter((t) => t && t.modul === m)

  if (daftar.length < 2) {
    return (
      <div className="space-y-3">
        <p className="kartu p-4 text-[16px] text-[var(--text-main)]">
          Pilih 2 sampai 3 tempat dari hasil pencarian ({LABEL_MODUL[m]}) untuk dibandingkan.
        </p>
        <button type="button" onClick={kembali} className="tombol-halus gap-1"><Ikon.Kiri size={18} /> Kembali ke hasil</button>
      </div>
    )
  }

  const hasil = susunHasil({ modul: m, tempatModul: tempat[m], kriteria: kriteria[m], konfigurasi, status })
  const itemKartu = daftar.map((t) => hasil.daftar.find((d) => d.tempat.id === t.id) ?? { tempat: t, persen: null, alasan: '' })
  const adaPersen = hasil.status === 'ok' && itemKartu.every((i) => i.persen != null)
  const baris = susunBaris({ m, kriteriaModul: kriteria[m], itemKartu, adaPersen })

  return (
    <div className={`${kelasAksen(m)} space-y-6`}>
      <button type="button" onClick={kembali} className="tombol-halus gap-1"><Ikon.Kiri size={18} /> Kembali ke hasil</button>
      <div>
        <h1 className="text-[28px] font-semibold">Perbandingan {LABEL_MODUL[m].toLowerCase()}</h1>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
          Baris berlatar warna menandakan nilai yang berbeda antar tempat. Data sama dengan halaman detail.
        </p>
      </div>

      <div className="kartu overflow-x-auto">
        <table className="tabel-banding w-full" style={{ minWidth: `${112 + daftar.length * 224}px` }}>
          <caption className="sr-only">Perbandingan {daftar.map((t) => t.nama).join(', ')}</caption>
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Aspek</span></th>
              {daftar.map((t) => (
                <th key={t.id} scope="col" style={{ width: `${Math.floor(100 / daftar.length)}%` }}>
                  <FotoPlaceholder modul={t.modul} tipe={t.tipe_tempat} rasio="16/9" className="mb-3 hidden md:block" />
                  <a href={`#/tempat/${t.id}`} className="block text-[16px] font-semibold leading-snug text-[var(--text-main)] [overflow-wrap:anywhere]">{t.nama}</a>
                  <p className="mt-0.5 text-[14px] font-normal text-[var(--text-secondary)]">
                    {LABEL_TIPE[t.tipe_tempat]} · {LABEL_LOKASI[t.tipe_lokasi]}
                  </p>
                  <p className="mt-0.5 text-[12px] font-normal text-[var(--text-muted)]">{konfigurasi.labelSimulasi}</p>
                  <button
                    type="button"
                    onClick={() => ubah(m, { banding: status.banding.filter((x) => x !== t.id) })}
                    className="tombol-halus mt-3 gap-1.5 text-[14px]"
                    aria-label={`Lepas ${t.nama} dari perbandingan`}
                  >
                    <Ikon.Tutup size={16} /> Lepas
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baris.map((b) => {
              const kunci = daftar.map((t, i) => b.kunci(t, i))
              const beda = new Set(kunci).size > 1
              return (
                <tr key={b.id} data-beda={beda ? 'true' : 'false'}>
                  <th scope="row">{b.label}</th>
                  {daftar.map((t, i) => <td key={t.id}>{b.sel(t, i)}</td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
