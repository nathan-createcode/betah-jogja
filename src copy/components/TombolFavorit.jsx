import { useFavorit } from '../lib/favorit.js'
import { Ikon } from './Ikon.jsx'

export default function TombolFavorit({ id, nama }) {
  const { ada, ubah } = useFavorit()
  const aktif = ada(id)
  return (
    <button
      type="button"
      onClick={() => ubah(id)}
      aria-pressed={aktif}
      aria-label={aktif ? `Hapus ${nama} dari favorit` : `Simpan ${nama} ke favorit`}
      title={aktif ? 'Hapus dari favorit' : 'Simpan ke favorit'}
      className="tombol-hati flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-light)] bg-[var(--bg-surface)]"
      style={{ color: aktif ? '#C8102E' : 'var(--text-secondary)' }}
    >
      {aktif ? <Ikon.HatiIsi size={20} /> : <Ikon.Hati size={20} />}
    </button>
  )
}
