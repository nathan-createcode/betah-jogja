import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { susunHasil } from '../lib/pencarian.js'
import { LABEL_COLOKAN, LABEL_LOKASI, LABEL_MODUL, LABEL_TIPE, persen, teksHarga } from '../lib/format.js'
import Lencana from '../components/Lencana.jsx'

function Baris({ label, kolom, sorot = [] }) {
  return (
    <div className="border-b border-slate-100 py-2.5 last:border-0">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${kolom.length}, minmax(0, 1fr))` }}>
        {kolom.map((isi, i) => (
          <div key={i} className={`min-w-0 text-sm ${sorot.includes(i) ? 'font-bold text-teal-700' : 'text-slate-900'}`}>{isi}</div>
        ))}
      </div>
    </div>
  )
}

const terbaik = (nilai, tipe) => {
  const target = tipe === 'cost' ? Math.min(...nilai) : Math.max(...nilai)
  return nilai.map((v, i) => (v === target ? i : -1)).filter((i) => i >= 0)
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
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Pilih 2 sampai 3 tempat dari hasil pencarian ({LABEL_MODUL[m]}) untuk dibandingkan.
        </p>
        <button type="button" onClick={kembali} className="text-sm font-medium text-teal-700 hover:underline">← Kembali ke hasil</button>
      </div>
    )
  }

  const hasil = susunHasil({ modul: m, tempatModul: tempat[m], kriteria: kriteria[m], konfigurasi, status })
  const persenTempat = daftar.map((t) => hasil.daftar.find((d) => d.tempat.id === t.id)?.persen ?? null)

  return (
    <div className="muncul space-y-4">
      <button type="button" onClick={kembali} className="text-sm font-medium text-teal-700 hover:underline">← Kembali ke hasil</button>
      <h1 className="text-xl font-bold">Perbandingan {LABEL_MODUL[m].toLowerCase()}</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-2 border-b border-slate-200 pb-3" style={{ gridTemplateColumns: `repeat(${daftar.length}, minmax(0, 1fr))` }}>
          {daftar.map((t) => (
            <div key={t.id} className="min-w-0">
              <a href={`#/tempat/${t.id}`} className="text-sm font-semibold leading-snug text-slate-900 hover:text-teal-700">{t.nama}</a>
              <div className="mt-1"><Lencana warna="amber">{konfigurasi.labelSimulasi}</Lencana></div>
              <button
                type="button"
                onClick={() => ubah(m, { banding: status.banding.filter((x) => x !== t.id) })}
                className="mt-1 block text-xs text-slate-500 underline"
              >
                Keluarkan
              </button>
            </div>
          ))}
        </div>

        <Baris label="Kecocokan" kolom={persenTempat.map((p) => (p === null ? '-' : persen(p)))} sorot={terbaik(persenTempat.map((p) => p ?? -1), 'benefit')} />
        <Baris label="Jenis tempat" kolom={daftar.map((t) => LABEL_TIPE[t.tipe_tempat])} />
        <Baris label="Tipe lokasi" kolom={daftar.map((t) => LABEL_LOKASI[t.tipe_lokasi])} />
        <Baris label="Harga" kolom={daftar.map(teksHarga)} sorot={terbaik(daftar.map((t) => t.harga), 'cost')} />
        {kriteria[m].filter((k) => k.tipe === 'benefit').map((k) => (
          <Baris
            key={k.kode}
            label={k.nama}
            kolom={daftar.map((t) => (t[k.kolom] === 0 && k.kolom === 'skor_internet' ? 'Tidak ada Wi-Fi' : `${t[k.kolom]} / 5`))}
            sorot={terbaik(daftar.map((t) => t[k.kolom]), 'benefit')}
          />
        ))}
        {m === 'CW' && <Baris label="Jam operasional" kolom={daftar.map((t) => t.jam_operasional ?? '-')} />}
        {m === 'CW' && <Baris label="Colokan" kolom={daftar.map((t) => LABEL_COLOKAN[t.jumlah_colokan] ?? '-')} />}
        <Baris label="Kapasitas" kolom={daftar.map((t) => `${t.kapasitas} orang`)} />
        <Baris label="Fasilitas" kolom={daftar.map((t) => t.fasilitasList.join(', '))} />
      </section>
      <p className="text-xs text-slate-500">Nilai terbaik pada tiap baris ditandai tebal berwarna. Persentase kecocokan dihitung dari hasil pencarian terakhir di tab ini.</p>
    </div>
  )
}
