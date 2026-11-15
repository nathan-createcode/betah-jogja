import { Ikon } from './Ikon.jsx'
import Merek from './Merek.jsx'
import { useFavorit } from '../lib/favorit.js'
import { useData } from '../data/DataProvider.jsx'

const tautan = [
  { id: 'beranda', href: '#/', label: 'Beranda', pendek: 'Beranda', ikon: Ikon.Rumah },
  { id: 'kerja', href: '#/kerja', label: 'Tempat kerja', pendek: 'Kerja', ikon: Ikon.Kerja },
  { id: 'tinggal', href: '#/tinggal', label: 'Tempat tinggal', pendek: 'Tinggal', ikon: Ikon.Pintu },
  { id: 'favorit', href: '#/favorit', label: 'Favorit', pendek: 'Favorit', ikon: Ikon.Hati },
]

function idAktif(rute) {
  if (rute.halaman === 'beranda') return 'beranda'
  if (rute.halaman === 'favorit') return 'favorit'
  if (rute.halaman === 'cari') return rute.modul === 'LS' ? 'tinggal' : 'kerja'
  if (rute.halaman === 'bandingkan') return rute.modul === 'LS' ? 'tinggal' : 'kerja'
  return null
}

// Lambang: lengkung gapura di dalam kotak tinta.
function Lambang() {
  return (
    <svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="9" fill="var(--text-main)" />
      <path d="M9 21v-7.5a5 5 0 0 1 10 0V21z" fill="var(--bg-canvas)" />
    </svg>
  )
}

function Nama({ kecil = false }) {
  return (
    <span className={`font-semibold tracking-[-0.03em] ${kecil ? 'text-[18px]' : 'text-[22px]'}`}>
      <Merek />
    </span>
  )
}

export default function Navigasi({ rute }) {
  const { ids } = useFavorit()
  const data = useData()
  const aktifNav = idAktif(rute)
  // Hanya favorit yang masih ada di data yang dihitung, supaya sama dengan isi halaman Favorit.
  const jumlah = data?.status === 'siap' ? ids.filter((id) => data.tempatById(id)).length : ids.length

  // Warna modul hanya dipakai pada tautan yang menyebut tempat kerja atau tempat tinggal.
  const warnaAktif = (id) => (id === 'tinggal' ? 'var(--living-primary)' : id === 'kerja' ? 'var(--working-primary)' : 'var(--text-main)')

  const item = (t, mobile) => {
    const aktif = aktifNav === t.id
    const aksen = warnaAktif(t.id)
    const IkonItem = t.ikon
    const sebutan = t.id === 'favorit' && jumlah > 0 ? `${t.label}, ${jumlah} tempat` : t.label
    if (mobile) {
      return (
        <a
          key={t.id}
          href={t.href}
          className="relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1"
          style={{ color: aktif ? aksen : 'var(--text-secondary)', fontWeight: aktif ? 600 : 500 }}
          aria-current={aktif ? 'page' : undefined}
          aria-label={sebutan}
        >
          <span className="relative">
            <IkonItem size={22} />
            {t.id === 'favorit' && jumlah > 0 && (
              <span className="angka absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--text-main)] px-1 text-[12px] font-semibold leading-none text-white">{jumlah}</span>
            )}
          </span>
          <span className="block max-w-full overflow-clip text-ellipsis whitespace-nowrap text-[12px] [overflow-clip-margin:3px]">{t.pendek}</span>
        </a>
      )
    }
    return (
      <a
        key={t.id}
        href={t.href}
        className="tautan-nav flex min-h-11 items-center gap-2 rounded-full px-4 text-[14px]"
        style={{
          color: aktif ? '#fff' : 'var(--text-secondary)',
          background: aktif ? aksen : 'transparent',
          fontWeight: aktif ? 600 : 500,
        }}
        aria-current={aktif ? 'page' : undefined}
      >
        <IkonItem size={18} />
        <span>{t.label}{t.id === 'favorit' && jumlah > 0 ? <span className="angka"> ({jumlah})</span> : ''}</span>
      </a>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-40 hidden bg-[color-mix(in_srgb,var(--bg-canvas)_88%,transparent)] backdrop-blur-md md:block">
        <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between gap-4 px-6">
          <a href="#/" className="flex items-center gap-2.5 text-[var(--text-main)]" aria-label="Betah Jogja, ke beranda">
            <Lambang /> <Nama />
          </a>
          <nav className="flex items-center gap-1 rounded-full border border-[var(--border-light)] bg-[var(--bg-surface)] p-1" aria-label="Navigasi utama">
            {tautan.map((t) => item(t, false))}
          </nav>
        </div>
      </header>

      <div className="sticky top-0 z-40 flex h-14 items-center bg-[color-mix(in_srgb,var(--bg-canvas)_88%,transparent)] px-4 backdrop-blur-md md:hidden">
        <a href="#/" className="flex items-center gap-2 text-[var(--text-main)]" aria-label="Betah Jogja, ke beranda"><Lambang /> <Nama kecil /></a>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 rounded-t-[24px] border-t border-[var(--border-light)] bg-[var(--bg-canvas)] md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
        aria-label="Navigasi utama"
      >
        <div className="grid grid-cols-4 px-1 pt-1" style={{ minHeight: 'var(--dock-h)' }}>
          {tautan.map((t) => item(t, true))}
        </div>
      </nav>
    </>
  )
}
