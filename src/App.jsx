import { useCallback, useEffect, useRef, useState } from 'react'
import { DataProvider, useData } from './data/DataProvider.jsx'
import { StatusProvider, useStatus } from './state/StatusPencarian.jsx'
import Cari from './pages/Cari.jsx'
import Detail from './pages/Detail.jsx'
import Bandingkan from './pages/Bandingkan.jsx'
import Favorit from './pages/Favorit.jsx'
import Beranda from './pages/Beranda.jsx'
import Navigasi from './components/Navigasi.jsx'
import { KeadaanGalat, KerangkaHalaman } from './components/Keadaan.jsx'
import BatasGalat from './components/BatasGalat.jsx'

function bacaRute(hash) {
  const bagian = hash.replace(/^#\/?/, '').split('/')
  if (bagian[0] === 'tempat' && /^\d+$/.test(bagian[1] ?? '')) return { halaman: 'detail', id: Number(bagian[1]) }
  if (bagian[0] === 'bandingkan') return { halaman: 'bandingkan', modul: bagian[1] }
  if (bagian[0] === 'favorit') return { halaman: 'favorit' }
  if (bagian[0] === 'kerja') return { halaman: 'cari', modul: 'CW' }
  if (bagian[0] === 'tinggal') return { halaman: 'cari', modul: 'LS' }
  return { halaman: 'beranda' }
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

function SinkronTab({ rute }) {
  const { tab, setTab } = useStatus()
  useEffect(() => {
    if (rute.halaman === 'cari' && rute.modul && rute.modul !== tab) setTab(rute.modul)
  }, [rute.halaman, rute.modul, tab, setTab])
  return null
}

function Isi() {
  const data = useData()
  const { tab } = useStatus()
  const { rute, kembali } = useRute()

  useEffect(() => {
    if (rute.halaman === 'detail') return // Detail memasang judulnya sendiri (nama tempat)
    const judul = { beranda: 'Betah Jogja', favorit: 'Favorit · Betah Jogja', bandingkan: 'Perbandingan · Betah Jogja' }
    document.title = rute.halaman === 'cari'
      ? `${rute.modul === 'LS' ? 'Tempat tinggal' : 'Tempat kerja'} · Betah Jogja`
      : (judul[rute.halaman] ?? 'Betah Jogja')
  }, [rute.halaman, rute.modul])

  useEffect(() => {
    if (rute.halaman !== 'cari') window.scrollTo(0, 0)
  }, [rute.halaman, rute.id, rute.modul])

  let konten
  if (data.status === 'memuat') {
    konten = rute.halaman === 'beranda' ? <Beranda /> : <KerangkaHalaman />
  } else if (data.status === 'galat') {
    konten = <KeadaanGalat pesan={data.pesan} onCoba={data.muat} />
  } else if (rute.halaman === 'detail') konten = <Detail id={rute.id} kembali={kembali} />
  else if (rute.halaman === 'bandingkan') konten = <Bandingkan modul={rute.modul} kembali={kembali} />
  else if (rute.halaman === 'favorit') konten = <Favorit />
  // Bila tab di state belum sama dengan rute, tunggu sinkron dulu supaya tidak ada kilatan tab lama.
  else if (rute.halaman === 'cari') konten = rute.modul && rute.modul !== tab ? <KerangkaHalaman /> : <Cari />
  else konten = <Beranda />

  return (
    <div className="min-h-dvh bg-[var(--bg-canvas)] text-[var(--text-main)]">
      <SinkronTab rute={rute} />
      <Navigasi rute={rute} />
      <main
        className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-10"
        style={{ paddingBottom: 'calc(var(--dock-h) + env(safe-area-inset-bottom) + 32px)' }}
      >
        <BatasGalat resetKey={window.location.hash}>{konten}</BatasGalat>
      </main>
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
