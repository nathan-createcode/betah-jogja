import { useMemo } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { useFavorit } from '../lib/favorit.js'
import { STATUS_AWAL, susunHasil } from '../lib/pencarian.js'
import KartuTempat from '../components/KartuTempat.jsx'
import { Ikon } from '../components/Ikon.jsx'

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

  return (
    <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold">Favorit</h1>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Disimpan di perangkat ini saja.</p>
      </div>
      {daftar.length === 0 ? (
        <div className="kartu p-6 md:p-8">
          <p className="text-[18px] font-semibold text-[var(--text-main)]">Belum ada favorit</p>
          <p className="mt-2 max-w-md text-[16px] text-[var(--text-secondary)]">
            Tekan ikon hati pada tempat yang kamu suka, lalu tempat itu muncul di sini supaya mudah kamu cari lagi.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href="#/kerja" className="tombol-utama gap-2"><Ikon.Kerja size={18} /> Cari tempat kerja</a>
            <a href="#/tinggal" className="tombol-halus gap-2 !text-[16px]"><Ikon.Pintu size={18} /> Cari tempat tinggal</a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {daftar.map((t) => {
            const { item, adaPersen } = itemUntuk(t)
            return <KartuTempat key={t.id} item={item} adaPersen={adaPersen} />
          })}
        </div>
      )}
    </div>
  )
}
