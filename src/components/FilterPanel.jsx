import {
  CHECKLIST, JENIS_TEMPAT, PILIHAN_ANGGARAN, TIPE_LOKASI,
} from '../lib/pencarian.js'
import { LABEL_LOKASI, LABEL_TIPE, rupiah } from '../lib/format.js'

function Chip({ aktif, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        aktif ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-teal-500'
      }`}
    >
      {children}
    </button>
  )
}

function Bagian({ judul, children }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-slate-800">{judul}</legend>
      {children}
    </fieldset>
  )
}

export default function FilterPanel({ modul, status, hasil, ubah, onReset }) {
  const { anggaran, rentang, jumlah } = hasil
  const pilihan = PILIHAN_ANGGARAN[modul]
  const jenisModul = JENIS_TEMPAT[modul]
  const satuan = modul === 'CW' ? 'per kunjungan' : 'per bulan'

  const gantiCentang = (butir) =>
    ubah({
      checklist: status.checklist.includes(butir)
        ? status.checklist.filter((b) => b !== butir)
        : [...status.checklist, butir],
    })

  return (
    <section aria-label="Filter pencarian" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Bagian judul="Tipe lokasi">
        <div className="flex flex-wrap gap-2">
          <Chip aktif={status.lokasi === 'semua'} onClick={() => ubah({ lokasi: 'semua' })}>Semua</Chip>
          {TIPE_LOKASI.map((l) => (
            <Chip key={l} aktif={status.lokasi === l} onClick={() => ubah({ lokasi: l })}>{LABEL_LOKASI[l]}</Chip>
          ))}
        </div>
      </Bagian>

      <Bagian judul={`Anggaran (${satuan})`}>
        <div className="flex flex-wrap gap-2">
          {pilihan.map((p) => (
            <Chip key={p.id} aktif={status.anggaran === p.id} onClick={() => ubah({ anggaran: p.id, anggaranTeks: '' })}>
              {p.label}
            </Chip>
          ))}
        </div>
        <label className="mt-3 block text-sm text-slate-700" htmlFor={`anggaran-${modul}`}>atau ketik sendiri (Rupiah {satuan})</label>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-slate-500">Rp</span>
          <input
            id={`anggaran-${modul}`}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={status.anggaranTeks}
            placeholder={modul === 'CW' ? 'mis. 40000' : 'mis. 2000000'}
            aria-invalid={Boolean(anggaran.galat)}
            aria-describedby={`bantuan-anggaran-${modul}`}
            onChange={(e) => {
              const v = e.target.value
              ubah(v.trim() === '' ? { anggaran: 'semua', anggaranTeks: '' } : { anggaran: 'ketik', anggaranTeks: v })
            }}
            className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 ${
              anggaran.galat ? 'border-rose-400' : 'border-slate-300'
            }`}
          />
        </div>
        <div id={`bantuan-anggaran-${modul}`}>
          {rentang && (
            <p className="mt-1 text-xs text-slate-500">
              Harga di data kami: {rupiah(rentang.min)} sampai {rupiah(rentang.max)}
            </p>
          )}
          {anggaran.galat && <p role="alert" className="mt-1 text-sm text-rose-600">{anggaran.galat}</p>}
          {!anggaran.galat && anggaran.catatan && <p className="mt-1 text-sm text-teal-700">{anggaran.catatan}</p>}
        </div>
      </Bagian>

      <Bagian judul="Wajib ada">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {CHECKLIST[modul].map(([butir, label]) => (
            <label key={butir} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={status.checklist.includes(butir)}
                onChange={() => gantiCentang(butir)}
                className="h-4 w-4 shrink-0 accent-teal-600"
              />
              {label}
            </label>
          ))}
        </div>
      </Bagian>

      <Bagian judul="Jenis tempat (opsional)">
        <div className="flex flex-wrap gap-2">
          <Chip aktif={status.jenis === 'semua'} onClick={() => ubah({ jenis: 'semua' })}>Semua</Chip>
          {jenisModul.map((j) => (
            <Chip key={j} aktif={status.jenis === j} onClick={() => ubah({ jenis: j })}>{LABEL_TIPE[j]}</Chip>
          ))}
        </div>
      </Bagian>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className="text-sm font-semibold text-teal-800" aria-live="polite">{jumlah} tempat cocok</p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          Atur ulang
        </button>
      </div>
    </section>
  )
}
