import { useMemo, useRef } from 'react'
import { useData } from '../data/DataProvider.jsx'
import { useStatus } from '../state/StatusPencarian.jsx'
import { JENIS_TEMPAT, susunHasil } from '../lib/pencarian.js'
import FilterPanel from '../components/FilterPanel.jsx'
import KartuTempat from '../components/KartuTempat.jsx'
import PolaBetah from '../components/PolaBetah.jsx'
import { KerangkaHalaman } from '../components/Keadaan.jsx'
import { Ikon, ikonTipe } from '../components/Ikon.jsx'
import Merek, { Jogja } from '../components/Merek.jsx'
import { LABEL_MODUL, LABEL_TIPE } from '../lib/format.js'
import { kodeSesi } from '../lib/catat.js'
import { kelasAksen } from '../lib/teksSkor.js'
import { useGerakBeranda } from '../gerak/useGerakBeranda.js'

const LANGKAH = [
  'Pilih mau cari tempat kerja atau tempat tinggal, lalu atur kebutuhanmu: lokasi, anggaran, dan fasilitas yang wajib ada.',
  'Lihat persentase kecocokan tiap tempat beserta alasan singkatnya.',
  'Bandingkan sampai tiga tempat, lalu simpan yang kamu suka.',
]

const KRITERIA = ['Internet', 'Ketenangan', 'Kenyamanan', 'Lokasi', 'Harga']

// Pintasan ke daftar hasil per jenis tempat. Daftar jenis mengikuti JENIS_TEMPAT (kerja: 3 jenis, tinggal: 4 jenis).
const TEKS_JENIS = {
  kafe: 'Kafe untuk bekerja sambil ngopi.',
  coworking: 'Ruang kerja bersama dengan fasilitas yang lebih lengkap.',
  ruang_publik: 'Ruang publik yang bisa dipakai untuk bekerja.',
  kos: 'Kamar sewa bulanan untuk menetap lebih lama.',
  rumah_sewa: 'Rumah utuh untuk kamu tinggali sendiri atau bersama.',
  villa: 'Villa untuk tinggal dengan suasana lebih lapang.',
  guesthouse: 'Penginapan bergaya rumah tamu untuk tinggal singkat.',
}

function Rangkaian() {
  const bintik = <span className="mx-8 shrink-0 text-[var(--text-muted)] md:mx-12"><Ikon.Bintik size={44} strokeWidth={2.2} /></span>
  return (
    <div className="flex shrink-0 items-center">
      <span className="teks-jalan" style={{ color: 'var(--working-primary)' }}>Tempat kerja</span>{bintik}
      <span className="teks-jalan" style={{ color: 'var(--living-primary)' }}>Tempat tinggal</span>{bintik}
      <span className="teks-jalan">Satu pencarian</span>{bintik}
      <span className="teks-jalan"><Merek /></span>{bintik}
    </div>
  )
}

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

  const buka = (modul, patch) => {
    setTab(modul)
    ubah(modul, patch)
    window.location.hash = modul === 'LS' ? '#/tinggal' : '#/kerja'
  }

  const akar = useRef(null)
  useGerakBeranda(akar, data.status === 'siap')

  const keCaraKerja = () => {
    const reduksi = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('cara-kerja')?.scrollIntoView({ behavior: reduksi ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div ref={akar} className="space-y-20 md:space-y-28">
      {/* Hero: kartu besar bergaya bento. Kartu kanan adalah filter pencarian yang berfungsi. */}
      <section data-hero className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-stretch">
        <div className="flex min-w-0 flex-col gap-4">
          <div data-hero-kartu className="bento kartu-ink isolasi flex min-h-[440px] flex-1 flex-col justify-between gap-12 p-7 md:p-12">
            <PolaBetah warna="var(--on-ink)" opasitas={0.07} />
            <div className="lapis">
              <p className="label-mono text-[var(--on-ink-muted)]">(Untuk freelancer)</p>
              <h1 data-judul="hero" className="mt-6 max-w-[15ch] text-[clamp(42px,6.2vw,80px)] font-semibold leading-[1.02] tracking-[-0.035em]">
                Freelance di <Jogja />?
                <span className="mt-3 block text-[clamp(22px,2.7vw,34px)] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--on-ink-muted)]">
                  Cari tempat kerja dan tinggal yang bikin <em className="sorot text-[var(--on-ink)]">betah</em>.
                </span>
              </h1>
            </div>
            <div className="lapis flex flex-wrap items-end justify-between gap-6">
              <p className="max-w-md text-[17px] text-[var(--on-ink-muted)]">
                Bandingkan kafe, coworking, kos, dan rumah sewa dari hal yang paling terasa saat kerja mandiri: internet, ketenangan, kenyamanan, lokasi, dan harga.
              </p>
              <button type="button" onClick={keCaraKerja} className="tombol-utama tombol-terang gap-2 !border-transparent">
                Lihat cara kerjanya <Ikon.Bawah size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div data-hero-kartu className="bento kartu isolasi flex min-h-[220px] flex-col justify-between gap-6 p-6 md:p-7">
              <PolaBetah opasitas={0.05} baris={5} />
              <p className="label-mono lapis text-[var(--text-muted)]">(Lima kriteria)</p>
              <div className="lapis">
                <p className="text-[22px] font-semibold leading-tight tracking-[-0.02em]">Dinilai dari yang <em className="sorot">paling terasa</em> saat bekerja.</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {KRITERIA.map((k) => (
                    <li key={k} className="rounded-full border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-3 py-1 text-[13px] font-medium">{k}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div data-hero-kartu className="bento isolasi flex min-h-[220px] flex-col justify-between gap-6 bg-[var(--bg-muted)] p-6 md:p-7">
              <PolaBetah opasitas={0.06} baris={5} />
              <p className="label-mono lapis text-[var(--text-secondary)]">(Metode)</p>
              <div className="lapis">
                <p className="text-[22px] font-semibold leading-tight tracking-[-0.02em]">Dihitung, <em className="sorot">bukan</em> ditebak.</p>
                <p className="mt-3 text-[14px] text-[var(--text-secondary)]">Persentase kecocokan ada di tiap kartu. Rinciannya ada di panel Cara hitungnya pada halaman detail.</p>
              </div>
            </div>
          </div>
        </div>

        <div data-hero-kartu className={`${kelasAksen(tab)} bento kartu isolasi p-5 md:p-6`}>
          <PolaBetah warna="var(--aksen)" opasitas={0.05} baris={6} />
          <div className="lapis">
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
        </div>
      </section>

      {/* Teks berjalan selebar layar. Kerja berwarna biru, tinggal berwarna hijau. */}
      <div className="relative left-1/2 z-10 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-[var(--bg-canvas)] py-8" aria-hidden="true">
        <div data-marquee className="flex w-max items-center">
          <Rangkaian />
          <Rangkaian />
        </div>
      </div>

      <section className={`${kelasAksen(tab)} grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16`}>
        <div>
          <p className="label-mono text-[var(--text-muted)]">(Contoh hasil)</p>
          <h2 data-judul="gulir" className="mt-4 text-[clamp(32px,4vw,48px)] font-semibold">Seperti inilah <em className="sorot">hasilnya</em></h2>
          <p className="mt-4 text-[16px] text-[var(--text-secondary)]">
            Persentase menunjukkan seberapa dekat sebuah tempat dengan pilihan terbaik di antara tempat yang sedang kamu lihat.
            Angkanya dihitung dari kenyamanan, ketenangan, internet, lokasi, dan harga, dan berubah mengikuti pilihanmu.
          </p>
          {data.status === 'siap' && (
            <a href={tujuan} className="mt-5 inline-flex min-h-11 items-center gap-1 text-[16px] font-semibold" style={{ color: 'var(--aksen)' }}>
              Lihat semua {LABEL_MODUL[tab].toLowerCase()} <Ikon.Panah size={18} />
            </a>
          )}
        </div>
        <div data-muncul className="min-w-0">
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
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-mono text-[var(--text-muted)]">(Cari sesuai gaya)</p>
            <h2 data-judul="gulir" className="mt-4 text-[clamp(36px,5vw,64px)] font-semibold">Temukan <em className="sorot">ruangmu</em></h2>
          </div>
          <p className="max-w-xs text-[16px] text-[var(--text-secondary)]">Mulai dari jenis tempat yang kamu butuhkan, kami tampilkan yang paling cocok.</p>
        </div>
        {['CW', 'LS'].map((m) => (
          <div key={m} className={`${kelasAksen(m)} mt-12`}>
            <div className="flex items-center gap-4">
              <span className="label-mono shrink-0" style={{ color: 'var(--aksen)' }}>({LABEL_MODUL[m]})</span>
              <span className="h-px flex-1" style={{ background: 'var(--aksen-border)' }} aria-hidden="true" />
            </div>
            <div className={`mt-5 grid gap-4 sm:grid-cols-2 ${m === 'CW' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {JENIS_TEMPAT[m].map((j) => {
                const IkonJ = ikonTipe(j)
                return (
                  <button
                    key={j}
                    type="button"
                    data-muncul
                    onClick={() => buka(m, { jenis: j })}
                    className="bento kartu-sentuh isolasi flex min-h-[280px] flex-col justify-between gap-6 border p-7 text-left"
                    style={{ background: 'var(--aksen-surface)', borderColor: 'var(--aksen-border)' }}
                  >
                    <PolaBetah warna="var(--aksen)" opasitas={0.08} baris={5} />
                    <span className="lapis flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ background: 'var(--aksen)' }}><IkonJ size={22} /></span>
                    <span className="lapis block">
                      <span className="block text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[var(--text-main)]">{LABEL_TIPE[j]}</span>
                      <span className="mt-2 block text-[15px] text-[var(--text-secondary)]">{TEKS_JENIS[j]}</span>
                      <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold" style={{ color: 'var(--aksen)' }}>Lihat tempat <Ikon.Panah size={16} /></span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section id="cara-kerja" className="scroll-mt-24">
        <p className="label-mono text-[var(--text-muted)]">(Cara kerja)</p>
        <h2 data-judul="gulir" className="mt-4 max-w-2xl text-[clamp(36px,5vw,64px)] font-semibold">Tiga langkah, <em className="sorot">tanpa</em> pusing.</h2>
        <ol className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {LANGKAH.map((teks, i) => (
            <li key={teks} data-muncul>
              <div data-garis className="h-[1.5px] bg-[var(--text-main)]" />
              <span className="label-mono mt-5 block text-[var(--text-muted)]">0{i + 1}</span>
              <p className="mt-6 text-[18px] leading-snug text-[var(--text-main)]">{teks}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-melebar className="grid gap-4 lg:grid-cols-2">
        <div className="bento isolasi flex min-h-[360px] flex-col justify-between gap-10 bg-[var(--bg-muted)] p-8 md:p-12">
          <PolaBetah opasitas={0.06} />
          <p className="label-mono lapis text-[var(--text-secondary)]">(Siap pindah meja?)</p>
          <div className="lapis">
            <h2 className="text-[clamp(34px,4.4vw,56px)] font-semibold">Cari ruangmu <em className="sorot">sekarang</em>.</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#/kerja" className="tombol-modul" style={{ '--m': 'var(--working-primary)' }}><Ikon.Kerja size={18} /> Tempat kerja</a>
              <a href="#/tinggal" className="tombol-modul" style={{ '--m': 'var(--living-primary)' }}><Ikon.Pintu size={18} /> Tempat tinggal</a>
            </div>
          </div>
        </div>
        <div className="bento kartu-ink isolasi flex min-h-[360px] flex-col justify-between gap-10 p-8 md:p-12">
          <PolaBetah warna="var(--on-ink)" opasitas={0.07} />
          <p className="label-mono lapis text-[var(--on-ink-muted)]">(Favorit)</p>
          <div className="lapis">
            <h2 className="text-[clamp(32px,4vw,48px)] font-semibold">Simpan yang kamu suka, <em className="sorot">bandingkan</em> kapan saja.</h2>
            <p className="mt-4 max-w-sm text-[15px] text-[var(--on-ink-muted)]">Favorit disimpan di perangkat ini saja, tanpa akun.</p>
            <a href="#/favorit" className="tombol-utama tombol-terang mt-6 gap-2 !border-transparent"><Ikon.Hati size={18} /> Buka favorit</a>
          </div>
        </div>
      </section>

      <section className="bento kartu flex max-w-3xl items-start gap-4 p-6 md:p-8">
        <span className="mt-1 shrink-0 text-[var(--text-secondary)]"><Ikon.Info size={22} /></span>
        <div>
          <h2 className="text-[20px] font-semibold">Tentang data</h2>
          <p className="mt-3 text-[16px] text-[var(--text-secondary)]">
            Semua tempat, ulasan, dan foto adalah data simulasi untuk keperluan penelitian. Label Data simulasi tampil di setiap tempat, ulasan, dan foto.
          </p>
        </div>
      </section>

      <footer className="pb-4 text-[14px] text-[var(--text-secondary)]">
        <p data-wordmark aria-hidden="true" className="select-none whitespace-nowrap text-[clamp(52px,13.5vw,190px)] font-bold leading-[0.9] tracking-[-0.06em] text-[var(--text-main)]">
          <Merek />
        </p>
        <div className="mt-8 border-t border-[var(--border-light)] pt-8">
          <Merek />, prototype penelitian skripsi untuk membantu freelancer memilih tempat kerja dan tempat tinggal di Yogyakarta.
          <span className="mt-2 block">
          Situs ini mencatat statistik penggunaan secara anonim, tanpa nama, email, atau lokasi.{' '}
              <strong className="font-semibold text-[var(--text-main)]">
                Kode sesimu: <span className="angka">{kodeSesi()}</span>
              </strong>
          </span>
        </div>
      </footer>
    </div>
  )
}
