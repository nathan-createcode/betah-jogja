import Lencana from './Lencana.jsx'
import TombolFavorit from './TombolFavorit.jsx'
import { useData } from '../data/DataProvider.jsx'
import { LABEL_LOKASI, LABEL_TIPE, persen, teksHarga } from '../lib/format.js'

export default function KartuTempat({ item, adaPersen, dipilih, bisaPilih, onPilih, minKandidat }) {
  const { konfigurasi } = useData()
  const t = item.tempat
  return (
    <article className="muncul rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        {adaPersen && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white" aria-label={`Peringkat ${item.peringkat}`}>
            {item.peringkat}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <a href={`#/tempat/${t.id}`} className="block text-base font-semibold leading-snug text-slate-900 hover:text-teal-700">
            {t.nama}
          </a>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Lencana warna="teal">{LABEL_TIPE[t.tipe_tempat] ?? t.tipe_tempat}</Lencana>
            <Lencana>{LABEL_LOKASI[t.tipe_lokasi]}</Lencana>
            {t.tidakAdaWifi && <Lencana warna="merah">Tidak ada Wi-Fi</Lencana>}
            <Lencana warna="amber">{konfigurasi.labelSimulasi}</Lencana>
          </div>
        </div>
        <TombolFavorit id={t.id} nama={t.nama} />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">{teksHarga(t)}</p>
        {adaPersen ? (
          <div className="text-right">
            <p className="text-2xl font-bold leading-none text-teal-700">{persen(item.persen)}</p>
            <p className="text-xs text-slate-500">kecocokan</p>
          </div>
        ) : (
          <p className="text-right text-sm font-medium text-amber-700">Pembanding tidak cukup</p>
        )}
      </div>

      {adaPersen && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${Math.max(2, Math.min(100, item.persen))}%` }} />
        </div>
      )}

      {item.alasan && <p className="mt-2 text-sm text-slate-600">{item.alasan}</p>}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <a href={`#/tempat/${t.id}`} className="text-sm font-medium text-teal-700 hover:underline">Lihat detail →</a>
        <label className={`flex items-center gap-2 text-sm ${bisaPilih || dipilih ? 'cursor-pointer text-slate-700' : 'text-slate-400'}`}>
          <input
            type="checkbox"
            checked={dipilih}
            disabled={!bisaPilih && !dipilih}
            onChange={() => onPilih(t.id)}
            className="h-4 w-4 accent-teal-600"
          />
          Bandingkan
        </label>
      </div>
      {!adaPersen && minKandidat && (
        <p className="mt-2 text-xs text-slate-500">Persentase kecocokan baru dihitung bila ada minimal {minKandidat} tempat yang bisa dibandingkan.</p>
      )}
    </article>
  )
}
