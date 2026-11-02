import {
  CHECKLIST, JENIS_TEMPAT, PILIHAN_ANGGARAN, TIPE_LOKASI,
} from '../lib/pencarian.js'
import { LABEL_LOKASI, LABEL_MODUL, LABEL_TIPE, rupiah } from '../lib/format.js'
import { kelasAksen } from '../lib/teksSkor.js'
import { Ikon } from './Ikon.jsx'

function Chip({ aktif, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={aktif} className="chip">
      {children}
    </button>
  )
}

function Bagian({ judul, children }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[14px] font-semibold text-[var(--text-main)]">{judul}</legend>
      {children}
    </fieldset>
  )
}

function PilihModul({ modul, onGanti }) {
  return (
    <div role="group" aria-label="Pilih jenis tempat" className="grid grid-cols-2 gap-1 rounded-[10px] bg-[var(--bg-muted)] p-1">
      {['CW', 'LS'].map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={modul === m}
          onClick={() => onGanti?.(m)}
          className="segmen"
          style={{ '--m': m === 'LS' ? 'var(--living-primary)' : 'var(--working-primary)' }}
        >
          {LABEL_MODUL[m]}
        </button>
      ))}
    </div>
  )
}

export default function FilterPanel({
  modul, status, hasil, ubah, onReset, onGantiModul,
  varian = 'penuh', onCari, tampilJenis = true, tampilModul = false,
}) {
  const { anggaran, rentang } = hasil
  const pilihan = PILIHAN_ANGGARAN[modul]
  const jenisModul = JENIS_TEMPAT[modul]
  const satuan = modul === 'CW' ? 'per kunjungan' : 'per bulan'
  const kartu = varian === 'kartu'

  const gantiCentang = (butir) =>
    ubah({
      checklist: status.checklist.includes(butir)
        ? status.checklist.filter((b) => b !== butir)
        : [...status.checklist, butir],
    })

  const checklist = (
    <Bagian judul="Wajib ada">
      <div className="grid grid-cols-2 gap-x-3">
        {CHECKLIST[modul].map(([butir, label]) => (
          <label key={butir} className="flex min-h-[var(--tinggi-kontrol)] cursor-pointer items-center gap-2 text-[14px] text-[var(--text-main)]">
            <input
              type="checkbox"
              checked={status.checklist.includes(butir)}
              onChange={() => gantiCentang(butir)}
              className="h-[18px] w-[18px] shrink-0"
            />
            {label}
          </label>
        ))}
      </div>
    </Bagian>
  )

  return (
    <section aria-label="Filter pencarian" className={`${kelasAksen(modul)} space-y-5`}>
      {(kartu || tampilModul) && <PilihModul modul={modul} onGanti={onGantiModul} />}

      <Bagian judul="Lokasi">
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
        <label className="mt-3 block text-[14px] text-[var(--text-secondary)]" htmlFor={`anggaran-${modul}`}>
          atau ketik sendiri (Rupiah {satuan})
        </label>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[14px] text-[var(--text-secondary)]">Rp</span>
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
            className="isian"
          />
        </div>
        <div id={`bantuan-anggaran-${modul}`}>
          {rentang && (
            <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
              Harga di data kami: {rupiah(rentang.min)} sampai {rupiah(rentang.max)}
            </p>
          )}
          {anggaran.galat && <p role="alert" className="mt-1 text-[14px] font-medium" style={{ color: 'var(--status-galat)' }}>{anggaran.galat}</p>}
          {!anggaran.galat && anggaran.catatan && <p className="mt-1 text-[14px]" style={{ color: 'var(--aksen)' }}>{anggaran.catatan}</p>}
        </div>
      </Bagian>

      {kartu ? (
        <details className="lipat rounded-[10px] border border-[var(--border-light)] px-3">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between text-[14px] font-semibold">
            Wajib ada
            <span className="flex items-center gap-2">
              {status.checklist.length > 0 && (
                <span className="angka text-[12px] font-medium" style={{ color: 'var(--aksen)' }}>{status.checklist.length} dipilih</span>
              )}
              <Ikon.Bawah size={18} className="chevron" />
            </span>
          </summary>
          <div className="pb-3 pt-1">{checklist}</div>
        </details>
      ) : checklist}

      {tampilJenis && !kartu && (
        <Bagian judul="Jenis tempat (opsional)">
          <div className="flex flex-wrap gap-2">
            <Chip aktif={status.jenis === 'semua'} onClick={() => ubah({ jenis: 'semua' })}>Semua</Chip>
            {jenisModul.map((j) => (
              <Chip key={j} aktif={status.jenis === j} onClick={() => ubah({ jenis: j })}>{LABEL_TIPE[j]}</Chip>
            ))}
          </div>
        </Bagian>
      )}

      {kartu ? (
        <button type="button" onClick={onCari} className="tombol-utama w-full gap-2">
          <Ikon.Cari size={18} /> Cari
        </button>
      ) : (
        <div className="flex items-center justify-end border-t border-[var(--border-light)] pt-3">
          <button type="button" onClick={onReset} className="tombol-halus">Atur ulang</button>
        </div>
      )}
    </section>
  )
}
