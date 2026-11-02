import Lencana from './Lencana.jsx'
import TombolFavorit from './TombolFavorit.jsx'
import FotoPlaceholder from './FotoPlaceholder.jsx'
import BatangPersen from './BatangPersen.jsx'
import { WifiKartu } from './BarisSkor.jsx'
import { Ikon } from './Ikon.jsx'
import { useData } from '../data/DataProvider.jsx'
import { LABEL_LOKASI, LABEL_TIPE, persen, teksHarga } from '../lib/format.js'
import { kelasAksen } from '../lib/teksSkor.js'
import { susunAlasanTempat } from '../lib/alasan.js'

// Satu baris peringkat: foto, identitas, lalu angka kecocokan di kolom kanan.
export default function KartuTempat({
  item, adaPersen, dipilih, bisaPilih, onPilih, minKandidat, tampilBanding = false, peringkat,
}) {
  const { konfigurasi, kriteria } = useData()
  const t = item.tempat
  const alasan = susunAlasanTempat(t, kriteria?.[t.modul]) || item.alasan
  return (
    <article className={`kartu kartu-interaktif ${kelasAksen(t.modul)} grid grid-cols-[112px_1fr] gap-x-4 gap-y-3 p-3 sm:grid-cols-[168px_minmax(0,1fr)_152px] sm:gap-x-5 sm:p-4`}>
      <a href={`#/tempat/${t.id}`} tabIndex={-1} aria-hidden="true" className="block self-start">
        <FotoPlaceholder modul={t.modul} tipe={t.tipe_tempat} rasio="4/3" />
      </a>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          {peringkat != null && <span className="angka text-[14px] font-semibold text-[var(--text-muted)]">#{peringkat}</span>}
          <a href={`#/tempat/${t.id}`} className="line-clamp-3 min-w-0 text-[18px] font-semibold leading-snug text-[var(--text-main)] [overflow-wrap:anywhere]">{t.nama}</a>
        </div>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
          {LABEL_TIPE[t.tipe_tempat] ?? t.tipe_tempat} · {LABEL_LOKASI[t.tipe_lokasi]}
        </p>
        <p className="angka mt-2 text-[16px] font-medium text-[var(--text-main)]">{teksHarga(t)}</p>
        <div className="mt-2"><WifiKartu tempat={t} /></div>
        {alasan && <p className="mt-2 text-[14px] text-[var(--text-secondary)]">{alasan}</p>}
        {!adaPersen && minKandidat && (
          <p className="mt-2 text-[12px] text-[var(--text-secondary)]">
            Persentase kecocokan baru dihitung bila ada minimal {minKandidat} tempat yang bisa dibandingkan.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Lencana warna="simulasi">{konfigurasi.labelSimulasi}</Lencana>
          <a href={`#/tempat/${t.id}`} className="inline-flex min-h-9 items-center gap-1 text-[14px] font-medium" style={{ color: 'var(--aksen)' }}>
            Lihat detail <Ikon.Panah size={16} />
          </a>
        </div>
      </div>

      <div className="col-span-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--border-light)] pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:border-0 sm:pt-0">
        <div className="min-w-[120px] sm:w-full sm:text-right">
          {adaPersen ? (
            <>
              <p className="angka text-[32px] font-semibold leading-none" style={{ color: 'var(--aksen)' }}>{persen(item.persen)}</p>
              <p className="mt-1 text-[12px] font-medium text-[var(--text-secondary)]">cocok</p>
              <BatangPersen nilai={item.persen} className="mt-2" />
            </>
          ) : (
            <p className="text-[14px] font-medium text-[var(--text-secondary)]">Pembanding tidak cukup</p>
          )}
        </div>
        <div className="flex items-center gap-2 sm:mt-auto">
          {tampilBanding && (
            <label className={`flex min-h-11 cursor-pointer items-center gap-2 text-[14px] ${bisaPilih || dipilih ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
              <input
                type="checkbox"
                checked={Boolean(dipilih)}
                disabled={!bisaPilih && !dipilih}
                onChange={() => onPilih(t.id)}
                className="h-[18px] w-[18px]"
              />
              Bandingkan
            </label>
          )}
          <TombolFavorit id={t.id} nama={t.nama} />
        </div>
      </div>
    </article>
  )
}
