import { describe, it, expect } from 'vitest'
import { buatRepo, ubahKonfigurasi, ubahKriteria, hitungRentangHarga } from '../src/lib/repo.js'

// Klien Supabase tiruan (hanya untuk uji). Mendukung select, eq, order, maybeSingle.
function klienTiruan(tabel) {
  return {
    from(nama) {
      const s = { baris: [...(tabel[nama] ?? [])], tunggal: false }
      const q = {
        select() { return q },
        eq(k, v) { s.baris = s.baris.filter((r) => r[k] === v); return q },
        order(k, { ascending = true } = {}) {
          s.baris.sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * (ascending ? 1 : -1))
          return q
        },
        maybeSingle() { s.tunggal = true; return q },
        then(ok, gagal) {
          const data = s.tunggal ? (s.baris[0] ?? null) : s.baris
          return Promise.resolve({ data, error: null }).then(ok, gagal)
        },
      }
      return q
    },
  }
}

const TEMPAT = [
  { id: 2, kode: 'CW-02', modul: 'CW', harga: 38000, skor_internet: 5, fasilitas: 'Wi-Fi, colokan banyak, AC, parkir' },
  { id: 1, kode: 'CW-01', modul: 'CW', harga: 0, skor_internet: 0, fasilitas: 'AC,mushola' },
  { id: 3, kode: 'LS-01', modul: 'LS', harga: 1200000, skor_internet: 3, fasilitas: 'Wi-Fi, dapur' },
]
const KRITERIA = [
  { id: 2, modul: 'CW', kode: 'ketenangan', nama: 'Ketenangan', tipe: 'benefit', skala: '1-5', bobot_pembilang: 13, bobot_penyebut: 54, urutan: 2 },
  { id: 1, modul: 'CW', kode: 'kenyamanan_fisik', nama: 'Kenyamanan fisik', tipe: 'benefit', skala: '1-5', bobot_pembilang: 16, bobot_penyebut: 54, urutan: 1 },
]
const KONFIG = [
  { kunci: 'mode_anggaran', nilai: 'batas_keras', keterangan: '' },
  { kunci: 'min_kandidat', nilai: '2', keterangan: '' },
  { kunci: 'tampilkan_saw_pembanding', nilai: 'true', keterangan: '' },
  { kunci: 'label_simulasi', nilai: 'Data simulasi', keterangan: '' },
]

describe('buatRepo', () => {
  const repo = buatRepo(klienTiruan({ tempat: TEMPAT, kriteria: KRITERIA, konfigurasi: KONFIG, ulasan: [], foto: [] }))

  it('tempatPerModul hanya memuat modul itu, urut kode, fasilitas terpisah', async () => {
    const cw = await repo.tempatPerModul('CW')
    expect(cw.map((t) => t.kode)).toEqual(['CW-01', 'CW-02'])
    expect(cw[0].fasilitasList).toEqual(['AC', 'mushola'])
    expect(cw[1].fasilitasList).toEqual(['Wi-Fi', 'colokan banyak', 'AC', 'parkir'])
  })
  it('menandai tempat tanpa Wi-Fi (skor internet 0)', async () => {
    const cw = await repo.tempatPerModul('CW')
    expect(cw[0].tidakAdaWifi).toBe(true)
    expect(cw[1].tidakAdaWifi).toBe(false)
  })
  it('kriteria urut dan bobot tetap pecahan eksak', async () => {
    const k = await repo.kriteria('CW')
    expect(k.map((x) => x.kode)).toEqual(['kenyamanan_fisik', 'ketenangan'])
    expect(k[0].bobot).toEqual({ pembilang: 16, penyebut: 54 })
    expect(k[0].kolom).toBe('skor_kenyamanan_kualitas')
  })
  it('konfigurasi dibaca dan dikonversi tipenya', async () => {
    expect(await repo.konfigurasi()).toEqual({
      modeAnggaran: 'batas_keras', minKandidat: 2, tampilkanSawPembanding: true, labelSimulasi: 'Data simulasi',
    })
  })
  it('tempatById mengembalikan null bila tidak ada', async () => {
    expect((await repo.tempatById(2)).kode).toBe('CW-02')
    expect(await repo.tempatById(999)).toBeNull()
  })
})

describe('validasi', () => {
  it('konfigurasi yang kuncinya hilang menghasilkan galat jelas', () => {
    expect(() => ubahKonfigurasi(KONFIG.slice(1))).toThrow(/mode_anggaran/)
  })
  it('min_kandidat tidak valid ditolak', () => {
    const rusak = KONFIG.map((k) => (k.kunci === 'min_kandidat' ? { ...k, nilai: 'dua' } : k))
    expect(() => ubahKonfigurasi(rusak)).toThrow(/min_kandidat/)
  })
  it('kriteria tanpa pemetaan kolom ditolak', () => {
    expect(() => ubahKriteria([{ ...KRITERIA[0], kode: 'warna' }], 'CW')).toThrow(/warna/)
  })
  it('rentang harga dihitung dari data, termasuk harga 0', () => {
    expect(hitungRentangHarga(TEMPAT.slice(0, 2))).toEqual({ min: 0, max: 38000 })
    expect(hitungRentangHarga([])).toBeNull()
  })
})
