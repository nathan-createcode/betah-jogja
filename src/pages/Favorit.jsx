import { useData } from '../data/DataProvider.jsx'
import { useFavorit } from '../lib/favorit.js'
import { LABEL_LOKASI, LABEL_MODUL, LABEL_TIPE, teksHarga } from '../lib/format.js'
import Lencana from '../components/Lencana.jsx'
import TombolFavorit from '../components/TombolFavorit.jsx'

export default function Favorit() {
  const { konfigurasi, tempatById } = useData()
  const { ids } = useFavorit()
  const daftar = ids.map(tempatById).filter(Boolean)

  return (
    <div className="muncul space-y-4">
      <h1 className="text-xl font-bold">Tempat favorit</h1>
      <p className="text-sm text-slate-600">Favorit disimpan di perangkat ini saja.</p>
      {daftar.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          Belum ada favorit. Tekan ikon hati pada tempat yang kamu suka.
        </p>
      ) : (
        <div className="space-y-3">
          {daftar.map((t) => (
            <article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <a href={`#/tempat/${t.id}`} className="block font-semibold leading-snug hover:text-teal-700">{t.nama}</a>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Lencana warna="teal">{LABEL_MODUL[t.modul]}</Lencana>
                    <Lencana>{LABEL_TIPE[t.tipe_tempat]}</Lencana>
                    <Lencana>{LABEL_LOKASI[t.tipe_lokasi]}</Lencana>
                    <Lencana warna="amber">{konfigurasi.labelSimulasi}</Lencana>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{teksHarga(t)}</p>
                </div>
                <TombolFavorit id={t.id} nama={t.nama} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
