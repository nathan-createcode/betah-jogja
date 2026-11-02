import { Ikon } from './Ikon.jsx'
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
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="var(--text-main)" />
      <path d="M9 21v-7.5a5 5 0 0 1 10 0V21z" fill="var(--bg-canvas)" />
    </svg>
  )
}

export default function Navigasi({ rute }) {
  const { ids } = useFavorit()
  const data = useData()
  const aktifNav = idAktif(rute)
  // Hanya favorit yang masih ada di data yang dihitung, supaya sama dengan isi halaman Favorit.
  const jumlah = data?.status === 'siap' ? ids.filter((id) => data.tempatById(id)).length : ids.length

  const item = (t, mobile) => {
    const aktif = aktifNav === t.id
    const aksen = t.id === 'tinggal' ? 'var(--living-primary)' : t.id === 'kerja' ? 'var(--working-primary)' : 'var(--text-main)'
    const IkonItem = t.ikon
    const sebutan = t.id === 'favorit' && jumlah > 0 ? `${t.label}, ${jumlah} tempat` : t.label
    if (mobile) {
      return (
        <a
          key={t.id}
          href={t.href}
          className="relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1"
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
        className="tautan-nav flex min-h-11 items-center gap-2 px-3 text-[14px]"
        style={{
          color: aktif ? 'var(--text-main)' : 'var(--text-secondary)',
          fontWeight: aktif ? 600 : 500,
          boxShadow: aktif ? 'inset 0 -2px 0 var(--text-main)' : 'none',
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
      <header className="sticky top-0 z-40 hidden border-b border-[var(--border-light)] bg-[var(--bg-canvas)] md:block">
        <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-stretch justify-between gap-4 px-6">
          <a href="#/" className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.02em] text-[var(--text-main)]">
            <Lambang /> Betah Jogja
          </a>
          <nav className="flex items-stretch gap-1" aria-label="Navigasi utama">
            {tautan.map((t) => item(t, false))}
          </nav>
        </div>
      </header>

      <div className="sticky top-0 z-40 flex h-14 items-center border-b border-[var(--border-light)] bg-[var(--bg-canvas)] px-4 md:hidden">
        <a href="#/" className="flex items-center gap-2 text-[16px] font-semibold text-[var(--text-main)]"><Lambang /> Betah Jogja</a>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-light)] bg-[var(--bg-canvas)] md:hidden"
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
