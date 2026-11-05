// Favorit disimpan di perangkat pengguna (localStorage), hanya berisi id tempat.
import { useSyncExternalStore } from 'react'
import { catat } from './catat.js'

const KUNCI = 'dss.favorit.v1'
const pendengar = new Set()

function baca() {
  try {
    const a = JSON.parse(localStorage.getItem(KUNCI))
    return Array.isArray(a) ? a.filter(Number.isInteger) : []
  } catch {
    return []
  }
}

let daftar = baca()

function simpan(baru) {
  daftar = baru
  try { localStorage.setItem(KUNCI, JSON.stringify(baru)) } catch { /* penyimpanan dinonaktifkan: tetap berjalan di memori */ }
  pendengar.forEach((f) => f())
}

export function ubahFavorit(id) {
  const sudah = daftar.includes(id)
  simpan(sudah ? daftar.filter((x) => x !== id) : [...daftar, id])
  catat(sudah ? 'favorit_hapus' : 'favorit_tambah', id) // statistik anonim, lihat sql/aktivitas.sql
}

export function useFavorit() {
  const ids = useSyncExternalStore(
    (f) => { pendengar.add(f); return () => pendengar.delete(f) },
    () => daftar
  )
  return { ids, ada: (id) => ids.includes(id), ubah: ubahFavorit }
}
