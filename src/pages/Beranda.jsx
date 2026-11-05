import { useMemo } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { susunHasil } from '../lib/pencarian.js'
import FilterPanel from '../components/FilterPanel.jsx'
import KartuTempat from '../components/KartuTempat.jsx'
import { KerangkaHalaman } from '../components/Keadaan.jsx'
import { Ikon } from '../components/Ikon.jsx'
import { LABEL_MODUL } from '../lib/format.js'
import { kodeSesi } from '../lib/catat.js'
import { kelasAksen } from '../lib/teksSkor.js'

const LANGKAH = [
  'Pilih mau cari tempat kerja atau tempat tinggal, lalu atur kebutuhanmu: lokasi, anggaran, dan fasilitas yang wajib ada.',
  'Lihat persentase kecocokan tiap tempat beserta alasan singkatnya.',
  'Bandingkan sampai tiga tempat, lalu simpan yang kamu suka.',
]

export default function Beranda() {
  const data = useData()
  const { tab, tabs, setTab, ubah } = useStatus()
  const status = tabs[tab]

  const hasil = useMemo(() => {
    if (data.status !== 'siap') return { anggaran: { galat: null, catatan: null }, rentang: null, daftar: [] }
    return susunHasil({ modul: tab, tempatModul: data.tempat[tab], kriteria: data.kriteria[tab], konfigurasi: data.konfigurasi, status })
  }, [data, tab, status])

  const contoh = (hasil.daftar ?? []).slice(0, 3)
  const adaPersen = hasil.status === 'ok'
  const tujuan = tab === 'LS' ? '#/tinggal' : '#/kerja'

  const cari = () => {
    window.location.hash = tujuan
  }

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="grid gap-10 pt-2 md:pt-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-16">
        <div>
          <h1 className="max-w-[16ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--text-main)] md:text-[56px]">
            Freelance di Jogja?
            <span className="block">Cari tempat kerja dan tinggal yang bikin betah.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[18px] text-[var(--text-secondary)]">
            Bandingkan kafe, coworking, kos, dan rumah sewa dari hal yang paling terasa saat kerja mandiri: internet, ketenangan, kenyamanan, lokasi, dan harga.
          </p>
          <ol className="mt-8 max-w-lg divide-y divide-[var(--border-light)] border-y border-[var(--border-light)]">
            {LANGKAH.map((teks, i) => (
              <li key={teks} className="flex gap-4 py-3 text-[16px] text-[var(--text-main)]">
                <span className="angka w-4 shrink-0 font-semibold text-[var(--text-muted)]">{i + 1}</span>
                {teks}
              </li>
            ))}
          </ol>
        </div>

        <div className="kartu p-5 md:p-6">
          {data.status === 'siap' ? (
            <FilterPanel
              modul={tab}
              status={status}
              hasil={hasil}
              ubah={(patch) => ubah(tab, patch)}
              onGantiModul={setTab}
              varian="kartu"
              onCari={cari}
            />
          ) : (
            <p className="text-[14px] text-[var(--text-secondary)]">Menyiapkan pencarian…</p>
          )}
        </div>
      </section>

      <section className={`${kelasAksen(tab)} max-w-3xl`}>
        <h2 className="text-[28px] font-semibold">Seperti inilah hasilnya</h2>
        <p className="mt-3 max-w-2xl text-[16px] text-[var(--text-secondary)]">
          Persentase menunjukkan seberapa dekat sebuah tempat dengan pilihan terbaik di antara tempat yang sedang kamu lihat.
          Angkanya dihitung dari kenyamanan, ketenangan, internet, lokasi, dan harga, dan berubah mengikuti pilihanmu.
        </p>
        <div className="mt-6">
          {data.status !== 'siap' ? (
            <KerangkaHalaman kartu={3} />
          ) : (
            <div className="space-y-3">
              {contoh.map((item, i) => (
                <KartuTempat key={item.tempat.kode} item={item} adaPersen={adaPersen} peringkat={adaPersen ? i + 1 : undefined} />
              ))}
            </div>
          )}
        </div>
        {data.status === 'siap' && (
          <a href={tujuan} className="mt-4 inline-flex min-h-11 items-center gap-1 text-[16px] font-semibold" style={{ color: 'var(--aksen)' }}>
            Lihat semua {LABEL_MODUL[tab].toLowerCase()} <Ikon.Panah size={18} />
          </a>
        )}
      </section>

      <section className="max-w-2xl">
        <h2 className="text-[20px] font-semibold">Tentang data</h2>
        <p className="mt-3 text-[16px] text-[var(--text-secondary)]">
          Semua tempat, ulasan, dan foto adalah data simulasi untuk keperluan penelitian. Label Data simulasi tampil di setiap tempat, ulasan, dan foto.
        </p>
      </section>

      <footer className="border-t border-[var(--border-light)] py-8 text-[14px] text-[var(--text-secondary)]">
        Betah Jogja, prototype penelitian skripsi untuk membantu freelancer memilih tempat kerja dan tempat tinggal di Yogyakarta.
        <span className="mt-2 block">
          Situs ini mencatat statistik penggunaan secara anonim, tanpa nama, email, atau lokasi. Kode sesimu: <span className="angka font-semibold text-[var(--text-main)]">{kodeSesi()}</span>
        </span>
      </footer>
    </div>
  )
}
