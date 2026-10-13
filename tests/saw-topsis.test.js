import { describe, it, expect } from 'vitest'
import { hitungSawTopsis } from '../src/lib/saw-topsis.js'

const KODE = ['kenyamanan_fisik', 'ketenangan', 'internet', 'lokasi', 'harga']
const BOBOT = [16, 13, 10, 10, 5]
const KRITERIA = KODE.map((kode, i) => ({
  kode, tipe: kode === 'harga' ? 'cost' : 'benefit', bobot: { pembilang: BOBOT[i], penyebut: 54 },
}))
const tempat = (kode, nilai) => ({ kode, nilai: Object.fromEntries(KODE.map((k, i) => [k, nilai[i]])) })
const jalankan = (daftar, kriteria = KRITERIA) => hitungSawTopsis({ tempat: daftar, kriteria, minKandidat: 2 })
const ambil = (r, kode) => r.hasil.find((h) => h.kode === kode)
const dekat = (a, b) => expect(Math.abs(a - b)).toBeLessThanOrEqual(0.0001)
const urutSaw = (r) => [...r.hasil].sort((a, b) => b.saw - a.saw).map((h) => h.kode)

describe('KUNCI UJI 1', () => {
  const r = jalankan([
    tempat('A', [4, 3, 4, 5, 60000]), tempat('B', [5, 4, 3, 3, 90000]), tempat('C', [3, 5, 5, 2, 45000]),
  ])
  it('SAW', () => {
    dekat(ambil(r, 'A').saw, 0.7843); dekat(ambil(r, 'B').saw, 0.7574); dekat(ambil(r, 'C').saw, 0.7704)
    expect(urutSaw(r)).toEqual(['A', 'C', 'B'])
  })
  it('TOPSIS', () => {
    const [A, B, C] = ['A', 'B', 'C'].map((k) => ambil(r, k))
    dekat(A.dPlus, 0.0850); dekat(A.dMinus, 0.1055); dekat(A.c, 0.5539); expect(Math.round(A.persen * 10) / 10).toBe(55.4)
    dekat(B.dPlus, 0.0937); dekat(B.dMinus, 0.0953); dekat(B.c, 0.5043)
    dekat(C.dPlus, 0.1231); dekat(C.dMinus, 0.0930); dekat(C.c, 0.4304)
    expect(Math.round(B.persen * 10) / 10).toBe(50.4); expect(Math.round(C.persen * 10) / 10).toBe(43.0)
    expect(r.hasil.map((h) => h.kode)).toEqual(['A', 'B', 'C'])
    expect(r.hasil.map((h) => h.peringkat)).toEqual([1, 2, 3])
  })
  it('kontribusi kriteria berjumlah skor SAW', () => {
    for (const h of r.hasil) {
      const jumlah = Object.values(h.kontribusi).reduce((a, b) => a + b, 0)
      expect(Math.abs(jumlah - h.saw)).toBeLessThan(1e-12)
    }
  })
})

describe('KUNCI UJI 2 (internet 0)', () => {
  const r = jalankan([
    tempat('D', [5, 4, 0, 4, 70000]), tempat('E', [4, 3, 3, 5, 60000]), tempat('F', [3, 5, 5, 2, 45000]),
  ])
  it('SAW', () => {
    dekat(ambil(r, 'D').saw, 0.6966); dekat(ambil(r, 'E').saw, 0.7472); dekat(ambil(r, 'F').saw, 0.7704)
    expect(urutSaw(r)).toEqual(['F', 'E', 'D'])
  })
  it('TOPSIS', () => {
    const [D, E, F] = ['D', 'E', 'F'].map((k) => ambil(r, k))
    dekat(D.dPlus, 0.1663); dekat(D.dMinus, 0.1060); dekat(D.c, 0.3893)
    dekat(E.dPlus, 0.1030); dekat(E.dMinus, 0.1333); dekat(E.c, 0.5641)
    dekat(F.dPlus, 0.1178); dekat(F.dMinus, 0.1742); dekat(F.c, 0.5966)
    expect(r.hasil.map((h) => h.kode)).toEqual(['F', 'E', 'D'])
  })
})

describe('kriteria sama dibuang, bobot dinormalkan ulang', () => {
  // Pembanding independen (implementasi Python terpisah): harga dibuang, bobot 16/49, 13/49, 10/49, 10/49
  const r = jalankan([
    tempat('A', [4, 3, 4, 5, 0]), tempat('B', [5, 4, 3, 3, 0]), tempat('C', [3, 5, 5, 2, 0]),
  ])
  it('harga dibuang dan bobot menjadi per 49 (pecahan eksak)', () => {
    expect(r.kriteriaDibuang).toEqual(['harga'])
    expect(r.kriteriaDipakai.map((k) => `${k.bobot.pembilang}/${k.bobot.penyebut}`)).toEqual(['16/49', '13/49', '10/49', '10/49'])
    dekat(r.kriteriaDipakai.reduce((s, k) => s + k.bobotDesimal, 0), 1)
  })
  it('angka cocok dengan pembanding independen', () => {
    dekat(ambil(r, 'A').c, 0.5499); dekat(ambil(r, 'B').c, 0.5237); dekat(ambil(r, 'C').c, 0.4111)
    dekat(ambil(r, 'A').saw, 0.7878); dekat(ambil(r, 'B').saw, 0.7837); dekat(ambil(r, 'C').saw, 0.7469)
    expect(Object.keys(ambil(r, 'A').kontribusi)).not.toContain('harga')
  })
  it('tanpa pembuangan, bobot tetap per 54', () => {
    const t = jalankan([tempat('A', [4, 3, 4, 5, 60000]), tempat('B', [5, 4, 3, 3, 90000])])
    expect(t.kriteriaDibuang).toEqual([])
    expect(t.kriteriaDipakai[0].bobot).toEqual({ pembilang: 16, penyebut: 54 })
  })
  it('kriteria lain yang seragam juga dibuang', () => {
    const t = jalankan([tempat('A', [4, 3, 4, 5, 60000]), tempat('B', [4, 4, 3, 3, 90000])])
    expect(t.kriteriaDibuang).toEqual(['kenyamanan_fisik'])
    expect(t.kriteriaDipakai[0].bobot.penyebut).toBe(38)
  })
})

describe('harga 0 dan Wi-Fi 0 tidak menghasilkan NaN atau Infinity', () => {
  const semuaHingga = (r) => r.hasil.every((h) => [h.saw, h.dPlus, h.dMinus, h.c, h.persen, ...Object.values(h.kontribusi)].every(Number.isFinite))
  it('campuran harga 0 dan berbayar: min_positif dipakai pada SAW', () => {
    const r = jalankan([tempat('X', [3, 3, 3, 3, 0]), tempat('Y', [3, 3, 3, 3, 20000]), tempat('Z', [3, 3, 3, 3, 50000])])
    expect(semuaHingga(r)).toBe(true)
    // semua kriteria selain harga seragam, jadi hanya harga yang tersisa
    expect(ambil(r, 'X').kontribusi.harga).toBeCloseTo(5 / 5, 10) // bobot 1 setelah normalisasi, r = 1
    expect(ambil(r, 'Y').kontribusi.harga).toBeCloseTo(1, 10)
    expect(ambil(r, 'Z').kontribusi.harga).toBeCloseTo(20000 / 50000, 10)
  })
  it('semua tempat tanpa Wi-Fi: internet dibuang tanpa galat', () => {
    const r = jalankan([tempat('P', [4, 3, 0, 5, 60000]), tempat('Q', [5, 4, 0, 3, 90000])])
    expect(r.kriteriaDibuang).toEqual(['internet'])
    expect(semuaHingga(r)).toBe(true)
  })
  it('satu tempat tanpa Wi-Fi bersama yang ber-Wi-Fi', () => {
    const r = jalankan([tempat('P', [4, 3, 0, 5, 0]), tempat('Q', [5, 4, 3, 3, 90000]), tempat('R', [3, 3, 5, 2, 0])])
    expect(semuaHingga(r)).toBe(true)
  })
})

describe('kandidat kurang dan kasus khusus', () => {
  it('satu kandidat: tanpa persentase', () => {
    const r = jalankan([tempat('A', [4, 3, 4, 5, 60000])])
    expect(r.status).toBe('pembanding_tidak_cukup')
    expect(r.sebab).toBe('kandidat_kurang')
    expect(r.hasil[0].persen).toBeNull()
  })
  it('nol kandidat', () => {
    const r = jalankan([])
    expect(r.status).toBe('pembanding_tidak_cukup')
    expect(r.hasil).toEqual([])
  })
  it('minKandidat dari konfigurasi dihormati', () => {
    const dua = [tempat('A', [4, 3, 4, 5, 60000]), tempat('B', [5, 4, 3, 3, 90000])]
    expect(hitungSawTopsis({ tempat: dua, kriteria: KRITERIA, minKandidat: 3 }).status).toBe('pembanding_tidak_cukup')
    expect(hitungSawTopsis({ tempat: dua, kriteria: KRITERIA, minKandidat: 2 }).status).toBe('ok')
  })
  it('semua tempat identik: tanpa persentase, tanpa NaN', () => {
    const r = jalankan([tempat('A', [4, 3, 4, 5, 60000]), tempat('B', [4, 3, 4, 5, 60000])])
    expect(r.status).toBe('pembanding_tidak_cukup')
    expect(r.sebab).toBe('semua_sama')
  })
  it('dua tempat identik di antara tempat lain: urutan stabil menurut kode', () => {
    const data = [tempat('B2', [4, 4, 4, 4, 50000]), tempat('B1', [4, 4, 4, 4, 50000]), tempat('Z', [2, 2, 2, 2, 90000]), tempat('Y', [5, 5, 5, 5, 40000])]
    const urut = (d) => jalankan(d).hasil.map((h) => h.kode)
    expect(urut(data)).toEqual(['Y', 'B1', 'B2', 'Z'])
    expect(urut([...data].reverse())).toEqual(['Y', 'B1', 'B2', 'Z'])
    expect(ambil(jalankan(data), 'B1').c).toBe(ambil(jalankan(data), 'B2').c)
  })
  it('persentase berubah saat kandidat berubah', () => {
    const tiga = [tempat('A', [4, 3, 4, 5, 60000]), tempat('B', [5, 4, 3, 3, 90000]), tempat('C', [3, 5, 5, 2, 45000])]
    const sebelum = ambil(jalankan(tiga), 'A').persen
    const sesudah = ambil(jalankan(tiga.slice(0, 2)), 'A').persen
    expect(Math.abs(sebelum - sesudah)).toBeGreaterThan(0.5)
  })
  it('masukan tidak diubah', () => {
    const data = [tempat('A', [4, 3, 4, 5, 60000]), tempat('B', [5, 4, 3, 3, 90000])]
    const salinan = JSON.stringify(data)
    jalankan(data)
    expect(JSON.stringify(data)).toBe(salinan)
  })
})

describe('validasi masukan', () => {
  it('menolak nilai NaN, negatif, hilang, dan kode ganda', () => {
    expect(() => jalankan([tempat('A', [4, 3, NaN, 5, 1]), tempat('B', [1, 1, 1, 1, 1])])).toThrow(/internet/)
    expect(() => jalankan([tempat('A', [4, 3, 1, 5, -1]), tempat('B', [1, 1, 1, 1, 1])])).toThrow(/harga/)
    expect(() => jalankan([{ kode: 'A', nilai: {} }, tempat('B', [1, 1, 1, 1, 1])])).toThrow()
    expect(() => jalankan([tempat('A', [1, 1, 1, 1, 1]), tempat('A', [2, 2, 2, 2, 2])])).toThrow(/ganda/)
  })
  it('menolak bobot bukan pecahan bilangan bulat', () => {
    const rusak = KRITERIA.map((k) => ({ ...k, bobot: { pembilang: 0.3, penyebut: 1 } }))
    expect(() => jalankan([tempat('A', [1, 1, 1, 1, 1])], rusak)).toThrow(/Bobot/)
  })
})
