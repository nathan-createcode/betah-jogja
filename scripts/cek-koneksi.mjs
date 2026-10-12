// Uji Tahap 1.1: koneksi database dan pembacaan data (R01, R05, R06).
// Jalankan: npm run cek   (membaca .env.local)
import { createClient } from '@supabase/supabase-js'
import { buatRepo, hitungRentangHarga } from '../src/lib/repo.js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
let gagal = 0
const lapor = (ok, teks, rinci = '') => {
  if (!ok) gagal++
  console.log(`${ok ? 'LULUS' : 'GAGAL'}  ${teks}${rinci ? '  -> ' + rinci : ''}`)
}
const coba = async (teks, fn) => {
  try { await fn() } catch (e) { lapor(false, teks, e.message) }
}

if (!url || !key) {
  console.log('GAGAL  .env.local belum berisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (lihat README.md)')
  process.exit(1)
}
const client = createClient(url, key)
const repo = buatRepo(client)
console.log(`Menguji ${url}\n`)

let cw = [], ls = []

await coba('konfigurasi terbaca', async () => {
  const k = await repo.konfigurasi()
  lapor(true, 'konfigurasi terbaca', JSON.stringify(k))
})

for (const [modul, penyebutDiharap] of [['CW', 54], ['LS', 19]]) {
  await coba(`kriteria ${modul}`, async () => {
    const k = await repo.kriteria(modul)
    const jumlah = k.reduce((s, x) => s + x.bobot.pembilang, 0)
    const penyebutSama = k.every((x) => x.bobot.penyebut === penyebutDiharap)
    lapor(k.length === 5, `kriteria ${modul}: 5 baris`, `${k.length} baris`)
    lapor(penyebutSama && jumlah === penyebutDiharap, `kriteria ${modul}: bobot berjumlah ${penyebutDiharap}/${penyebutDiharap}`,
      k.map((x) => `${x.kode} ${x.bobot.pembilang}/${x.bobot.penyebut}`).join(', '))
  })
}

await coba('tempat', async () => {
  cw = await repo.tempatPerModul('CW')
  ls = await repo.tempatPerModul('LS')
  lapor(cw.length === 20 && ls.length === 16, 'tempat: 20 CW dan 16 LS', `CW=${cw.length}, LS=${ls.length}`)
  const semua = [...cw, ...ls]
  lapor(new Set(semua.map((t) => t.kode)).size === semua.length, 'kode tempat unik')
  lapor(semua.every((t) => t.is_simulasi === true && t.sumber_data), 'semua tempat bertanda simulasi')
  lapor(cw.every((t) => t.modul === 'CW') && ls.every((t) => t.modul === 'LS'), 'filter modul hanya memuat modul itu')
  lapor(cw[0].fasilitasList.length > 1 && cw[0].fasilitasList.every((b) => b === b.trim()),
    'fasilitas terpisah dan rapi', `${cw[0].kode}: ${JSON.stringify(cw[0].fasilitasList)}`)
  const tanpaWifi = semua.filter((t) => t.tidakAdaWifi)
  lapor(tanpaWifi.every((t) => !t.fasilitasList.some((b) => b.toLowerCase() === 'wi-fi')),
    'skor internet 0 selaras dengan tanpa butir Wi-Fi', tanpaWifi.map((t) => t.kode).join(', '))
  for (const [nama, daftar] of [['CW', cw], ['LS', ls]]) {
    const r = hitungRentangHarga(daftar)
    lapor(Boolean(r), `rentang harga ${nama}`, `Rp ${r.min} sampai Rp ${r.max}`)
  }
})

await coba('ulasan dan foto', async () => {
  const ids = [...cw, ...ls].map((t) => t.id)
  const hitung = (baris) => baris.reduce((m, b) => m.set(b.tempat_id, (m.get(b.tempat_id) ?? 0) + 1), new Map())
  const u = await client.from('ulasan').select('tempat_id,is_simulasi')
  const f = await client.from('foto').select('tempat_id,is_simulasi')
  if (u.error) throw new Error('ulasan: ' + u.error.message)
  if (f.error) throw new Error('foto: ' + f.error.message)
  const hu = hitung(u.data), hf = hitung(f.data)
  lapor(ids.every((i) => hu.get(i) === 5), 'setiap tempat punya 5 ulasan', `total ${u.data.length}`)
  lapor(ids.every((i) => hf.get(i) === 2), 'setiap tempat punya 2 foto', `total ${f.data.length}`)
  lapor([...u.data, ...f.data].every((b) => b.is_simulasi === true), 'ulasan dan foto bertanda simulasi')
  const detail = await repo.tempatById(cw[0].id)
  const ul = await repo.ulasan(cw[0].id)
  const fo = await repo.foto(cw[0].id)
  lapor(detail?.kode === cw[0].kode && ul.length === 5 && fo.length === 2, 'detail tempat + ulasan + foto terbaca (R05, R06)', detail?.kode)
})

await coba('anon hanya baca', async () => {
  // Hapus baris yang tidak ada: tidak berbahaya walau RLS belum aktif.
  const { error } = await client.from('konfigurasi').delete().eq('kunci', '__tidak_ada__')
  lapor(Boolean(error), 'pengguna anonim tidak boleh menulis (RLS)', error ? error.message : 'penulisan TIDAK ditolak, jalankan SQL RLS')
})

console.log(`\n${gagal === 0 ? 'SEMUA LULUS' : gagal + ' PEMERIKSAAN GAGAL'}`)
process.exit(gagal === 0 ? 0 : 1)
