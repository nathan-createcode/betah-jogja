import TitikIndikator from './TitikIndikator.jsx'
import { LABEL_KRITERIA_TAMPIL, teksSkor } from '../lib/teksSkor.js'
import { teksHarga } from '../lib/format.js'

export default function BarisSkor({ kriteria, tempat, ringkas = false }) {
  const harga = kriteria.tipe === 'cost'
  if (harga) {
    return (
      <div>
        <p className="text-[14px] font-medium text-[var(--text-secondary)]">{LABEL_KRITERIA_TAMPIL[kriteria.kode] ?? kriteria.nama}</p>
        <p className="angka mt-0.5 text-[16px] font-medium text-[var(--text-main)]">{teksHarga(tempat)}</p>
      </div>
    )
  }
  const tampil = teksSkor(kriteria.kode, tempat[kriteria.kolom])
  if (!tampil) return null
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-[var(--text-secondary)]">{LABEL_KRITERIA_TAMPIL[kriteria.kode] ?? kriteria.nama}</p>
          <p className="mt-0.5 text-[16px] font-semibold" style={{ color: 'var(--aksen)' }}>{tampil.label}</p>
        </div>
        {!tampil.tanpaTitik && <span className="pt-1"><TitikIndikator nilai={tampil.nilai} /></span>}
      </div>
      {!ringkas && <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{tampil.kalimat}</p>}
    </div>
  )
}

export function WifiKartu({ tempat }) {
  const tampil = teksSkor('internet', tempat.skor_internet)
  if (!tampil) return null
  return (
    <div className="flex items-center gap-2 text-[14px] max-[340px]:flex-wrap max-[340px]:gap-y-0.5">
      <span className="text-[var(--text-secondary)]">Internet</span>
      <span className="font-medium text-[var(--text-main)]">{tampil.label}</span>
      {!tampil.tanpaTitik && <TitikIndikator nilai={tampil.nilai} />}
    </div>
  )
}
