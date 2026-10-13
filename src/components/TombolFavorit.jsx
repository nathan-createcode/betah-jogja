import { useFavorit } from '../lib/favorit.js'

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
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition ${
        aktif ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500'
      }`}
    >
      {aktif ? '♥' : '♡'}
    </button>
  )
}
