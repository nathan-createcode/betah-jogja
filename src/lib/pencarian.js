// Logika pencarian (murni): saring, anggaran, checklist, susun hasil, alasan singkat.
import { hitungSawTopsis } from './saw-topsis.js'
import { punyaButir } from './fasilitas.js'
import { NAMA_KRITERIA, rupiah } from './format.js'

export const TIPE_LOKASI = ['tengah_kota', 'dekat_kampus', 'pinggiran_pedesaan', 'dekat_gunung']
export const JENIS_TEMPAT = {
  CW: ['kafe', 'coworking', 'ruang_publik'],
  LS: ['kos', 'rumah_sewa', 'villa', 'guesthouse'],
}

// Butir checklist "Wajib ada": [teks pencocok di kolom fasilitas, label tampilan]
export const CHECKLIST = {
  CW: [['Wi-Fi', 'Wi-Fi'], ['colokan banyak', 'Colokan banyak'], ['AC', 'AC'], ['mushola', 'Mushola'], ['parkir', 'Parkir'], ['area outdoor', 'Area outdoor']],
  LS: [['Wi-Fi', 'Wi-Fi'], ['AC', 'AC'], ['kamar mandi dalam', 'Kamar mandi dalam'], ['dapur', 'Dapur'], ['listrik termasuk', 'Listrik termasuk'], ['parkir', 'Parkir']],
}

// Pilihan anggaran siap pakai. batas null = semua harga.
export const PILIHAN_ANGGARAN = {
  CW: [
    { id: 'gratis', label: 'Gratis', batas: 0 },
    { id: 'maks25', label: 'Maks 25 rb', batas: 25000 },
    { id: 'maks50', label: 'Maks 50 rb', batas: 50000 },
    { id: 'maks100', label: 'Maks 100 rb', batas: 100000 },
    { id: 'semua', label: 'Semua harga', batas: null },
  ],
  LS: [
    { id: 'maks15', label: 'Maks 1,5 jt', batas: 1500000 },
    { id: 'maks25', label: 'Maks 2,5 jt', batas: 2500000 },
    { id: 'maks35', label: 'Maks 3,5 jt', batas: 3500000 },
    { id: 'semua', label: 'Semua harga', batas: null },
  ],
}

export const STATUS_AWAL = () => ({
  lokasi: 'semua',
  jenis: 'semua',
  anggaran: 'semua', // id pilihan siap pakai, atau 'ketik'
  anggaranTeks: '',
  checklist: [],
  banding: [],
})

// Membaca isian angka anggaran. Menerima "40000" atau pemisah ribuan "40.000".
export function bacaAnggaranTeks(teks) {
  const t = String(teks ?? '').trim()
  if (t === '') return { status: 'kosong' }
  let angka = null
  if (/^\d{1,12}$/.test(t)) angka = Number(t)
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) angka = Number(t.replace(/\./g, ''))
  if (angka === null) {
    return { status: 'galat', pesan: 'Isi dengan bilangan bulat tanpa tanda minus atau koma, misalnya 40000.' }
  }
  return { status: 'ok', nilai: angka }
}

export function rentangHarga(daftar) {
  if (daftar.length === 0) return null
  const h = daftar.map((t) => t.harga)
  return { min: Math.min(...h), max: Math.max(...h) }
}

// Menentukan batas anggaran dari pilihan tab.
export function tentukanAnggaran(modul, status, semuaTempatModul) {
  const rentang = rentangHarga(semuaTempatModul)
  if (status.anggaran !== 'ketik') {
    const p = PILIHAN_ANGGARAN[modul].find((x) => x.id === status.anggaran) ?? PILIHAN_ANGGARAN[modul].at(-1)
    return { batas: p.batas, galat: null, catatan: null, ketik: false }
  }
  const baca = bacaAnggaranTeks(status.anggaranTeks)
  if (baca.status === 'kosong') return { batas: null, galat: null, catatan: null, ketik: true }
  if (baca.status === 'galat') return { batas: null, galat: baca.pesan, catatan: null, ketik: true }
  const catatan = rentang && baca.nilai > rentang.max ? 'Semua tempat tercakup' : null
  return { batas: baca.nilai, galat: null, catatan, ketik: true }
}

// Tempat lolos checklist bila memiliki SETIAP butir yang dicentang. Tanpa centang = semua.
export function lolosChecklist(tempat, dicentang) {
  return dicentang.every((butir) => punyaButir(tempat.fasilitasList, butir))
}

export function saring(semuaTempatModul, status, batas) {
  const lainnya = semuaTempatModul.filter(
    (t) =>
      (status.lokasi === 'semua' || t.tipe_lokasi === status.lokasi) &&
      (status.jenis === 'semua' || t.tipe_tempat === status.jenis) &&
      lolosChecklist(t, status.checklist)
  )
  const kandidat = batas === null ? lainnya : lainnya.filter((t) => t.harga <= batas)
  return { lainnya, kandidat }
}

export const nilaiTempat = (tempat, kriteria) =>
  Object.fromEntries(kriteria.map((k) => [k.kode, tempat[k.kolom]]))

const namaKriteria = (k) => NAMA_KRITERIA[k.kode] ?? k.nama.toLowerCase()

// Alasan singkat: dua kriteria dengan kontribusi terbesar dan satu dengan kontribusi terkecil.
// Hanya kriteria yang ikut dihitung yang boleh disebut.
export function susunAlasan(kontribusi, kriteriaDipakai, daftarKriteria) {
  if (!kontribusi) return ''
  const urutan = new Map(daftarKriteria.map((k, i) => [k.kode, i]))
  const nama = new Map(daftarKriteria.map((k) => [k.kode, namaKriteria(k)]))
  const diurut = kriteriaDipakai
    .map((k) => ({ kode: k.kode, nilai: kontribusi[k.kode] }))
    .sort((a, b) => b.nilai - a.nilai || urutan.get(a.kode) - urutan.get(b.kode))
  if (diurut.length >= 3) {
    const unggul = diurut.slice(0, 2).map((x) => nama.get(x.kode))
    const kurang = nama.get(diurut.at(-1).kode)
    return `Unggul di ${unggul[0]} dan ${unggul[1]}. Kurang di ${kurang}.`
  }
  if (diurut.length === 2) return `Unggul di ${nama.get(diurut[0].kode)}. Kurang di ${nama.get(diurut[1].kode)}.`
  return ''
}

// Menyusun seluruh hasil untuk satu tab.
export function susunHasil({ modul, tempatModul, kriteria, konfigurasi, status }) {
  const anggaran = tentukanAnggaran(modul, status, tempatModul)
  const rentang = rentangHarga(tempatModul)
  const catatan = []
  if (modul === 'CW' && anggaran.batas === 0 && !anggaran.galat) catatan.push('Penilaian memakai 4 kriteria, harga tidak dihitung.')
  if (anggaran.catatan) catatan.push(anggaran.catatan)

  const dasar = { anggaran, rentang, catatan, daftar: [], jumlah: 0, kriteriaDipakai: [], hargaMinTersedia: null }
  if (anggaran.galat) return { ...dasar, status: 'anggaran_tidak_valid' }

  const { lainnya, kandidat } = saring(tempatModul, status, anggaran.batas)
  const hargaMinTersedia = lainnya.length ? Math.min(...lainnya.map((t) => t.harga)) : null
  const awal = { ...dasar, jumlah: kandidat.length, hargaMinTersedia, jumlahSebelumAnggaran: lainnya.length }

  if (kandidat.length === 0) {
    return { ...awal, status: lainnya.length === 0 ? 'kosong' : 'kosong_anggaran' }
  }

  const mesin = hitungSawTopsis({
    tempat: kandidat.map((t) => ({ kode: t.kode, nilai: nilaiTempat(t, kriteria) })),
    kriteria,
    minKandidat: konfigurasi.minKandidat,
  })
  const peta = new Map(kandidat.map((t) => [t.kode, t]))
  const daftar = mesin.hasil.map((h) => ({
    tempat: peta.get(h.kode),
    ...h,
    alasan: mesin.status === 'ok' ? susunAlasan(h.kontribusi, mesin.kriteriaDipakai, kriteria) : '',
  }))
  return {
    ...awal,
    status: mesin.status === 'ok' ? 'ok' : 'pembanding_tidak_cukup',
    kriteriaDipakai: mesin.kriteriaDipakai,
    kriteriaDibuang: mesin.kriteriaDibuang,
    daftar,
  }
}

export const pesanKosongAnggaran = (hasil, ketik) => {
  if (hasil.hargaMinTersedia === null) return { pesan: 'Tidak ada tempat yang cocok dengan pilihan lain. Longgarkan tipe lokasi, jenis, atau checklist.', tombol: null }
  const pesan = `Tidak ada tempat dalam anggaran ini. Harga terendah yang tersedia: ${rupiah(hasil.hargaMinTersedia)}.`
  return { pesan, tombol: ketik ? hasil.hargaMinTersedia : null }
}
