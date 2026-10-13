import { describe, it, expect } from 'vitest'
import { muatFixture } from './helpers/fixtures.js'
import {
  STATUS_AWAL, susunHasil, bacaAnggaranTeks, lolosChecklist, saring, susunAlasan,
  PILIHAN_ANGGARAN, TIPE_LOKASI, JENIS_TEMPAT, CHECKLIST, pesanKosongAnggaran,
} from '../src/lib/pencarian.js'

const F = muatFixture()
const cari = (modul, patch = {}) =>
  susunHasil({ modul, tempatModul: F.tempat[modul], kriteria: F.kriteria[modul], konfigurasi: F.konfigurasi, status: { ...STATUS_AWAL(), ...patch } })
const semuaAngka = (h) =>
  h.daftar.every((d) => d.persen === null || [d.saw, d.dPlus, d.dMinus, d.c, d.persen, ...Object.values(d.kontribusi)].every(Number.isFinite))

describe('fixture', () => {
  it('terbaca: 20 CW dan 16 LS, bobot eksak', () => {
    expect(F.tempat.CW).toHaveLength(20)
    expect(F.tempat.LS).toHaveLength(16)
    expect(F.kriteria.CW.map((k) => `${k.bobot.pembilang}/${k.bobot.penyebut}`)).toEqual(['16/54', '13/54', '10/54', '10/54', '5/54'])
  })
})

describe('filter modul dan tipe lokasi', () => {
  it('hanya memunculkan tempat modul itu', () => {
    for (const m of ['CW', 'LS']) expect(cari(m).daftar.every((d) => d.tempat.modul === m)).toBe(true)
    expect(cari('CW').daftar).toHaveLength(20)
    expect(cari('LS').daftar).toHaveLength(16)
  })
  it('hanya memunculkan tipe lokasi yang dipilih', () => {
    for (const m of ['CW', 'LS']) {
      for (const lokasi of TIPE_LOKASI) {
        const h = cari(m, { lokasi })
        expect(h.daftar.length).toBeGreaterThan(0)
        expect(h.daftar.every((d) => d.tempat.tipe_lokasi === lokasi)).toBe(true)
      }
    }
  })
  it('filter jenis tempat bekerja', () => {
    const h = cari('CW', { jenis: 'kafe' })
    expect(h.daftar.length).toBe(10)
    expect(h.daftar.every((d) => d.tempat.tipe_tempat === 'kafe')).toBe(true)
  })
})

describe('anggaran', () => {
  it('membuang tempat di atas anggaran dan menghitung ulang persentase', () => {
    const semua = cari('CW')
    const maks50 = cari('CW', { anggaran: 'maks50' })
    expect(maks50.daftar.length).toBeLessThan(semua.daftar.length)
    expect(maks50.daftar.every((d) => d.tempat.harga <= 50000)).toBe(true)
    const kode = maks50.daftar[0].tempat.kode
    const sebelum = semua.daftar.find((d) => d.tempat.kode === kode).persen
    const sesudah = maks50.daftar[0].persen
    expect(sesudah).not.toBeCloseTo(sebelum, 3)
  })
  it('Gratis: hanya harga 0, harga dibuang, bobot per 49, ada catatan', () => {
    const h = cari('CW', { anggaran: 'gratis' })
    expect(h.daftar).toHaveLength(4)
    expect(h.daftar.every((d) => d.tempat.harga === 0)).toBe(true)
    expect(h.kriteriaDibuang).toContain('harga')
    expect(h.kriteriaDipakai.map((k) => `${k.bobot.pembilang}/${k.bobot.penyebut}`)).toEqual(['16/49', '13/49', '10/49', '10/49'])
    expect(h.catatan).toContain('Penilaian memakai 4 kriteria, harga tidak dihitung.')
    expect(semuaAngka(h)).toBe(true)
    expect(h.daftar.every((d) => !d.alasan.includes('harga'))).toBe(true)
  })
  it('Gratis tidak ada di modul LS', () => {
    expect(PILIHAN_ANGGARAN.LS.some((p) => p.id === 'gratis')).toBe(false)
    expect(PILIHAN_ANGGARAN.CW.some((p) => p.id === 'gratis')).toBe(true)
  })
  it('nol kandidat karena anggaran: pesan dan harga minimum', () => {
    const h = cari('LS', { lokasi: 'tengah_kota', anggaran: 'ketik', anggaranTeks: '100000' })
    expect(h.status).toBe('kosong_anggaran')
    const min = Math.min(...F.tempat.LS.filter((t) => t.tipe_lokasi === 'tengah_kota').map((t) => t.harga))
    expect(h.hargaMinTersedia).toBe(min)
    expect(pesanKosongAnggaran(h, true).tombol).toBe(min)
    expect(pesanKosongAnggaran(h, false).tombol).toBeNull()
  })
  it('tombol Naikkan memakai harga terendah di antara tempat yang memenuhi pilihan lain', () => {
    const h = cari('LS', { lokasi: 'dekat_gunung', checklist: ['dapur'], anggaran: 'ketik', anggaranTeks: '1' })
    const { lainnya } = saring(F.tempat.LS, { ...STATUS_AWAL(), lokasi: 'dekat_gunung', checklist: ['dapur'] }, null)
    if (lainnya.length) expect(h.hargaMinTersedia).toBe(Math.min(...lainnya.map((t) => t.harga)))
    else expect(pesanKosongAnggaran(h, true).tombol).toBeNull()
  })
  it('tanpa tempat yang memenuhi pilihan lain: pesan tanpa tombol', () => {
    const h = cari('CW', { checklist: CHECKLIST.CW.map(([b]) => b), lokasi: 'dekat_gunung', jenis: 'ruang_publik', anggaran: 'ketik', anggaranTeks: '1000' })
    expect(['kosong', 'kosong_anggaran']).toContain(h.status)
    if (h.status === 'kosong') expect(pesanKosongAnggaran(h, true).tombol).toBeNull()
  })
  it('isian angka: tidak valid, 0 = Gratis, di atas maksimum diterima dengan catatan', () => {
    for (const buruk of ['12.5', '-5000', 'abc', '1,5', '1e5', '25.00']) {
      expect(bacaAnggaranTeks(buruk).status).toBe('galat')
      expect(cari('CW', { anggaran: 'ketik', anggaranTeks: buruk }).status).toBe('anggaran_tidak_valid')
    }
    expect(bacaAnggaranTeks('25.000')).toEqual({ status: 'ok', nilai: 25000 })
    expect(bacaAnggaranTeks('')).toEqual({ status: 'kosong' })
    const nol = cari('CW', { anggaran: 'ketik', anggaranTeks: '0' })
    expect(nol.daftar).toHaveLength(4)
    expect(nol.catatan).toContain('Penilaian memakai 4 kriteria, harga tidak dihitung.')
    const besar = cari('CW', { anggaran: 'ketik', anggaranTeks: '999999999' })
    expect(besar.catatan).toContain('Semua tempat tercakup')
    expect(besar.daftar).toHaveLength(20)
    expect(besar.rentang).toEqual({ min: 0, max: 120000 })
  })
})

describe('kandidat kurang dari 2', () => {
  it('satu kandidat tampil tanpa persentase', () => {
    const lokasiGratis = TIPE_LOKASI.map((lokasi) => ({ lokasi, h: cari('CW', { lokasi, anggaran: 'gratis' }) }))
    const satu = lokasiGratis.find((x) => x.h.jumlah === 1)
    // data pengguna: bila tidak ada kombinasi 1 kandidat, pakai batas harga terendah LS
    const h = satu?.h ?? cari('LS', { anggaran: 'ketik', anggaranTeks: String(Math.min(...F.tempat.LS.map((t) => t.harga))) })
    if (h.jumlah === 1) {
      expect(h.status).toBe('pembanding_tidak_cukup')
      expect(h.daftar[0].persen).toBeNull()
    }
    expect(['ok', 'pembanding_tidak_cukup']).toContain(h.status)
  })
})

describe('checklist Wajib ada', () => {
  it('tanpa centang = semua tempat; butir tak dicentang diabaikan', () => {
    expect(cari('CW').daftar).toHaveLength(20)
    const hanyaAc = cari('CW', { checklist: ['AC'] })
    expect(hanyaAc.daftar.every((d) => d.tempat.fasilitasList.includes('AC'))).toBe(true)
    expect(hanyaAc.daftar.some((d) => !d.tempat.fasilitasList.includes('parkir'))).toBe(true)
  })
  it('satu, tiga, dan semua butir: tempat harus punya setiap butir', () => {
    for (const modul of ['CW', 'LS']) {
      const butir = CHECKLIST[modul].map(([b]) => b)
      for (const dicentang of [butir.slice(0, 1), butir.slice(0, 3), butir]) {
        const h = cari(modul, { checklist: dicentang })
        for (const d of h.daftar) expect(dicentang.every((b) => d.tempat.fasilitasList.some((f) => f.toLowerCase() === b.toLowerCase()))).toBe(true)
        const manual = F.tempat[modul].filter((t) => dicentang.every((b) => t.fasilitas.toLowerCase().split(',').map((x) => x.trim()).includes(b.toLowerCase())))
        expect(h.jumlah).toBe(manual.length)
      }
    }
  })
  it('pencocokan tidak membedakan huruf besar dan kecil', () => {
    expect(lolosChecklist({ fasilitasList: ['Wi-Fi'] }, ['wi-fi'])).toBe(true)
  })
  it('penghitung bertambah sedikit saat centang bertambah (tidak pernah naik)', () => {
    const butir = CHECKLIST.CW.map(([b]) => b)
    let sebelumnya = cari('CW').jumlah
    for (let i = 1; i <= butir.length; i++) {
      const n = cari('CW', { checklist: butir.slice(0, i) }).jumlah
      expect(n).toBeLessThanOrEqual(sebelumnya)
      sebelumnya = n
    }
  })
})

describe('tempat tanpa Wi-Fi dan harga 0', () => {
  it('tempat dengan internet 0 ikut dihitung tanpa NaN', () => {
    const h = cari('CW')
    const tanpa = h.daftar.filter((d) => d.tempat.skor_internet === 0)
    expect(tanpa.length).toBeGreaterThan(0)
    expect(tanpa.every((d) => d.tempat.tidakAdaWifi)).toBe(true)
    expect(semuaAngka(h)).toBe(true)
  })
  it('semua kombinasi pilihan tidak menghasilkan NaN atau galat, dan urutan stabil', () => {
    for (const modul of ['CW', 'LS']) {
      for (const lokasi of ['semua', ...TIPE_LOKASI]) {
        for (const jenis of ['semua', ...JENIS_TEMPAT[modul]]) {
          for (const p of PILIHAN_ANGGARAN[modul]) {
            const h = cari(modul, { lokasi, jenis, anggaran: p.id })
            expect(semuaAngka(h)).toBe(true)
            const lagi = cari(modul, { lokasi, jenis, anggaran: p.id })
            expect(lagi.daftar.map((d) => d.tempat.kode)).toEqual(h.daftar.map((d) => d.tempat.kode))
          }
        }
      }
    }
  })
})

describe('alasan singkat', () => {
  it('format: dua unggulan dan satu kekurangan, hanya kriteria yang dipakai', () => {
    const h = cari('CW')
    for (const d of h.daftar) expect(d.alasan).toMatch(/^Unggul di [a-z ]+ dan [a-z ]+\. Kurang di [a-z ]+\.$/)
  })
  it('memakai kontribusi terbesar dan terkecil', () => {
    const k = [{ kode: 'ketenangan', nama: 'K' }, { kode: 'internet', nama: 'I' }, { kode: 'harga', nama: 'H' }, { kode: 'lokasi', nama: 'L' }]
    const dipakai = k.map((x) => ({ kode: x.kode }))
    expect(susunAlasan({ ketenangan: 0.3, internet: 0.25, harga: 0.01, lokasi: 0.1 }, dipakai, k)).toBe('Unggul di ketenangan dan internet. Kurang di harga.')
  })
})
