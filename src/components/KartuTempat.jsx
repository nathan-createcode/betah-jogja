import Lencana from './Lencana.jsx'
import TombolFavorit from './TombolFavorit.jsx'
import FotoPlaceholder from './FotoPlaceholder.jsx'
import BatangPersen from './BatangPersen.jsx'
import { WifiKartu } from './BarisSkor.jsx'
import { Ikon, ikonTipe } from './Ikon.jsx'
import { useData } from '../data/DataProvider.jsx'
import { LABEL_LOKASI, LABEL_TIPE, catatanHarga, persen, teksHarga } from '../lib/format.js'
import { kelasAksen } from '../lib/teksSkor.js'
import { susunAlasanTempat } from '../lib/alasan.js'

// Alasan tampil sebagai dua baris ("Kelebihan: ..." dan "Kekurangan: ...") dengan labelnya tebal.
// Bila bentuknya lain, teks ditampilkan apa adanya.
function Alasan({ teks }) {
  const i = teks.indexOf('Kekurangan:')
  const baris = teks.startsWith('Kelebihan:') ? (i > 0 ? [teks.slice(0, i).trim(), teks.slice(i)] : [teks]) : (i === 0 ? [teks] : [teks])
  return (
    <div className="mt-3 space-y-0.5 text-[14px] text-[var(--text-secondary)]">
      {baris.map((b) => {
        const m = /^(Kelebihan|Kekurangan):\s*(.*)$/.exec(b)
        return m
          ? <p key={b}><span className="font-semibold text-[var(--text-main)]">{m[1]}:</span> {m[2]}</p>
          : <p key={b}>{b}</p>
      })}
    </div>
  )
}

// Kartu hasil. HP: satu kolom (foto lebar di atas). Layar lebar: foto, identitas, lalu panel kecocokan.
// Peringkat ada di panel kecocokan, bukan di atas foto, supaya foto tampil bersih seperti foto tempat sungguhan.
export default function KartuTempat({
  item, adaPersen, dipilih, bisaPilih, onPilih, minKandidat, tampilBanding = false, peringkat,
}) {
  const { konfigurasi, kriteria } = useData()
  const t = item.tempat
  const alasan = susunAlasanTempat(t, kriteria?.[t.modul]) || item.alasan
  const IkonTipe = ikonTipe(t.tipe_tempat)
  const catatan = catatanHarga(t)
  return (
    <article className={`kartu bento kartu-interaktif ${kelasAksen(t.modul)} grid grid-cols-1 gap-x-5 gap-y-4 p-3 sm:grid-cols-[176px_minmax(0,1fr)_200px] sm:p-4`}>
      <a href={`#/tempat/${t.id}`} tabIndex={-1} aria-hidden="true" className="block self-start">
        <FotoPlaceholder modul={t.modul} tipe={t.tipe_tempat} rasio="kartu" />
      </a>

      <div className="min-w-0 px-1 sm:px-0">
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold" style={{ background: 'var(--aksen-surface)', color: 'var(--aksen)' }}>
            <IkonTipe size={14} /> {LABEL_TIPE[t.tipe_tempat] ?? t.tipe_tempat}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-light)] px-2.5 py-1 text-[13px] font-medium text-[var(--text-secondary)]">
            <Ikon.Pin size={14} /> {LABEL_LOKASI[t.tipe_lokasi]}
          </span>
        </div>
        <a href={`#/tempat/${t.id}`} className="mt-2 line-clamp-3 block min-w-0 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-main)] [overflow-wrap:anywhere]">{t.nama}</a>
        <p className="angka mt-2 text-[17px] font-semibold text-[var(--text-main)]">
          {teksHarga(t)}
          {catatan && (
            <span className="mt-0.5 block text-[14px] font-normal text-[var(--text-secondary)] sm:ml-1.5 sm:mt-0 sm:inline">
              <span className="hidden sm:inline">· </span>{catatan.toLowerCase()}
            </span>
          )}
        </p>
        <div className="mt-2"><WifiKartu tempat={t} /></div>
        {alasan && <Alasan teks={alasan} />}
        {!adaPersen && minKandidat && (
          <p className="mt-2 text-[12px] text-[var(--text-secondary)]">
            Persentase kecocokan baru dihitung bila ada minimal {minKandidat} tempat yang bisa dibandingkan.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <Lencana warna="simulasi">{konfigurasi.labelSimulasi}</Lencana>
          <a href={`#/tempat/${t.id}`} className="tombol-halus gap-1 text-[14px] font-semibold" style={{ color: 'var(--aksen)' }}>
            Lihat detail <Ikon.Panah size={16} />
          </a>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-2xl p-3 sm:flex-col sm:items-stretch sm:justify-between sm:p-3.5"
        style={{ background: adaPersen ? 'var(--aksen-surface)' : 'var(--bg-muted)' }}
      >
        <div className="w-full min-w-[128px] sm:w-auto">
          {peringkat != null && <p className="label-mono mb-1.5 text-[var(--text-secondary)]">Peringkat {peringkat}</p>}
          {adaPersen ? (
            <>
              <p className="angka text-[32px] font-semibold leading-none" style={{ color: 'var(--aksen)' }}>{persen(item.persen)}</p>
              <p className="sorot mt-0.5 text-[20px] leading-none text-[var(--text-secondary)]">cocok</p>
              <BatangPersen nilai={item.persen} className="mt-3" />
            </>
          ) : (
            <p className="text-[14px] font-medium text-[var(--text-secondary)]">Pembanding tidak cukup</p>
          )}
        </div>
        <div className="flex basis-full items-center gap-2 sm:basis-auto sm:justify-between">
          {tampilBanding && (
            <label className="opsi !min-h-11 !px-3">
              <input
                type="checkbox"
                checked={Boolean(dipilih)}
                disabled={!bisaPilih && !dipilih}
                onChange={() => onPilih(t.id)}
              />
              {dipilih && <Ikon.Centang size={14} />}
              Bandingkan
            </label>
          )}
          <TombolFavorit id={t.id} nama={t.nama} />
        </div>
      </div>
    </article>
  )
}
