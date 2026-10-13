import { useCallback, useEffect, useRef, useState } from 'react'
import { DataProvider, useData } from './data/DataProvider.jsx'
import { StatusProvider } from './state/StatusPencarian.jsx'
import { useFavorit } from './lib/favorit.js'
import Cari from './pages/Cari.jsx'
import Detail from './pages/Detail.jsx'
import Bandingkan from './pages/Bandingkan.jsx'
import Favorit from './pages/Favorit.jsx'

// Rute memakai hash (#/...) supaya tautan bisa dibuka dari HP tanpa pengaturan server.
function bacaRute(hash) {
  const bagian = hash.replace(/^#\/?/, '').split('/')
  if (bagian[0] === 'tempat' && /^\d+$/.test(bagian[1] ?? '')) return { halaman: 'detail', id: Number(bagian[1]) }
  if (bagian[0] === 'bandingkan') return { halaman: 'bandingkan', modul: bagian[1] }
  if (bagian[0] === 'favorit') return { halaman: 'favorit' }
  return { halaman: 'cari' }
}

function useRute() {
  const [hash, setHash] = useState(window.location.hash)
  const navigasi = useRef(0)
  useEffect(() => {
    const f = () => { navigasi.current += 1; setHash(window.location.hash) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  const kembali = useCallback(() => {
    if (navigasi.current > 0) window.history.back()
    else window.location.hash = '#/'
  }, [])
  return { rute: bacaRute(hash), kembali }
}

function Isi() {
  const data = useData()
  const { rute, kembali } = useRute()
  const { ids } = useFavorit()

  useEffect(() => {
    if (rute.halaman !== 'cari') window.scrollTo(0, 0)
  }, [rute.halaman, rute.id, rute.modul])

  let konten
  if (data.status === 'memuat') {
    konten = <p className="rounded-xl bg-white p-6 text-center text-sm text-slate-600 shadow-sm">Memuat data…</p>
  } else if (data.status === 'galat') {
    konten = (
      <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        <p className="font-semibold">Data tidak bisa dimuat.</p>
        <p>{data.pesan}</p>
        <p>Periksa sambungan internet, variabel lingkungan Supabase, dan kebijakan baca (RLS).</p>
        <button type="button" onClick={data.muat} className="rounded-lg bg-rose-600 px-3 py-2 font-medium text-white">Coba lagi</button>
      </div>
    )
  } else if (rute.halaman === 'detail') konten = <Detail id={rute.id} kembali={kembali} />
  else if (rute.halaman === 'bandingkan') konten = <Bandingkan modul={rute.modul} kembali={kembali} />
  else if (rute.halaman === 'favorit') konten = <Favorit />
  else konten = <Cari />

  const aktif = (h) => (rute.halaman === h ? 'bg-white/20' : 'hover:bg-white/10')

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-3 pb-10">
      <header className="-mx-3 mb-4 bg-gradient-to-r from-teal-700 to-teal-600 px-4 py-4 text-white">
        <h1 className="text-lg font-bold leading-tight">Tempat Kerja dan Tinggal untuk Freelancer di Yogyakarta</h1>
        <nav className="mt-3 flex gap-2 text-sm" aria-label="Navigasi utama">
          <a href="#/" className={`rounded-full px-3 py-1.5 transition ${aktif('cari')}`}>Cari tempat</a>
          <a href="#/favorit" className={`rounded-full px-3 py-1.5 transition ${aktif('favorit')}`}>Favorit ({ids.length})</a>
        </nav>
      </header>
      <main>{konten}</main>
      <footer className="mt-8 text-center text-xs text-slate-500">
        Seluruh data tempat, ulasan, dan foto di aplikasi ini adalah data simulasi untuk keperluan penelitian. v0.1
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <StatusProvider>
        <Isi />
      </StatusProvider>
    </DataProvider>
  )
}
