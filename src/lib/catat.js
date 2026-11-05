// Pencatatan penggunaan anonim ke tabel `aktivitas` di Supabase (lihat sql/aktivitas.sql).
// Tidak memakai login, tidak mengirim IP atau data pribadi. Hanya ID acak yang disimpan di
// perangkat (localStorage), jenis aksi, id tempat (untuk favorit), rute, dan jenis perangkat.
// Kegagalan mencatat tidak pernah boleh mengganggu pengguna.
import { supabase } from './supabase.js'

const KUNCI_ID = 'dss.visitor.v1'
const KUNCI_SESI = 'dss.kunjungan.dicatat'

function acak() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  } catch { /* lanjut ke cadangan */ }
  // Cadangan untuk peramban lama / konteks tanpa HTTPS: tetap berbentuk UUID v4.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

let idMemori = null

export function ambilVisitorId() {
  try {
    let id = localStorage.getItem(KUNCI_ID)
    if (!id) {
      id = acak()
      localStorage.setItem(KUNCI_ID, id)
    }
    return id
  } catch {
    // Penyimpanan dinonaktifkan: pakai ID di memori selama halaman terbuka.
    if (!idMemori) idMemori = acak()
    return idMemori
  }
}

// Kode pendek untuk ditampilkan di footer dan diisi tester di Google Form.
export function kodeSesi() {
  return ambilVisitorId().replace(/-/g, '').slice(0, 6).toUpperCase()
}

export function catat(jenis, tempatId = null) {
  try {
    if (!supabase) return
    const baris = {
      visitor_id: ambilVisitorId(),
      jenis,
      tempat_id: tempatId != null ? String(tempatId) : null,
      path: (window.location.hash || '#/').slice(0, 100),
      perangkat: window.innerWidth < 768 ? 'mobile' : 'desktop',
    }
    Promise.resolve(supabase.from('aktivitas').insert(baris)).catch(() => {})
  } catch { /* abaikan */ }
}

// Satu catatan kunjungan per sesi tab (muat ulang halaman tidak dihitung dua kali).
export function catatKunjunganSekali() {
  try {
    if (sessionStorage.getItem(KUNCI_SESI)) return
    sessionStorage.setItem(KUNCI_SESI, '1')
  } catch { /* sessionStorage mati: tetap catat */ }
  catat('kunjungan')
}
