// Lapisan pembacaan data. Menerima klien Supabase sebagai parameter supaya
// bisa dipakai oleh aplikasi (Vite) maupun skrip uji (Node). Hanya membaca.
import { pecahFasilitas } from './fasilitas.js'

// Pemetaan kode kriteria ke kolom tabel tempat (sesuai komentar di schema.sql).
// Bobot, tipe, dan skala TIDAK ada di sini; semuanya dibaca dari tabel kriteria.
export const KOLOM_KRITERIA = {
  CW: {
    kenyamanan_fisik: 'skor_kenyamanan_kualitas',
    ketenangan: 'skor_ketenangan',
    internet: 'skor_internet',
    lokasi: 'skor_lokasi',
    harga: 'harga',
  },
  LS: {
    harga_sewa: 'harga',
    internet: 'skor_internet',
    ketenangan: 'skor_ketenangan',
    kualitas_perawatan: 'skor_kenyamanan_kualitas',
    lokasi: 'skor_lokasi',
  },
}

async function jalankan(permintaan, label) {
  const { data, error } = await permintaan
  if (error) throw new Error(`Gagal membaca ${label}: ${error.message}`)
  return data
}

export function ubahKonfigurasi(baris) {
  const peta = Object.fromEntries(baris.map((b) => [b.kunci, b.nilai]))
  for (const kunci of ['mode_anggaran', 'min_kandidat', 'tampilkan_saw_pembanding', 'label_simulasi']) {
    if (!(kunci in peta)) throw new Error(`Konfigurasi '${kunci}' tidak ada di tabel konfigurasi.`)
  }
  const minKandidat = Number(peta.min_kandidat)
  if (!Number.isInteger(minKandidat) || minKandidat < 1) {
    throw new Error(`Konfigurasi 'min_kandidat' tidak valid: '${peta.min_kandidat}'.`)
  }
  return {
    modeAnggaran: peta.mode_anggaran,
    minKandidat,
    tampilkanSawPembanding: peta.tampilkan_saw_pembanding.trim().toLowerCase() === 'true',
    labelSimulasi: peta.label_simulasi,
  }
}

export function ubahKriteria(baris, modul) {
  const kolom = KOLOM_KRITERIA[modul] ?? {}
  return baris.map((k) => {
    if (!kolom[k.kode]) throw new Error(`Kriteria '${k.kode}' (${modul}) tidak punya pemetaan kolom.`)
    return {
      kode: k.kode,
      nama: k.nama,
      tipe: k.tipe,
      skala: k.skala,
      // pecahan eksak: jangan diubah menjadi desimal di sini
      bobot: { pembilang: k.bobot_pembilang, penyebut: k.bobot_penyebut },
      urutan: k.urutan,
      kolom: kolom[k.kode],
    }
  })
}

export function ubahTempat(baris) {
  return {
    ...baris,
    fasilitasList: pecahFasilitas(baris.fasilitas),
    tidakAdaWifi: baris.skor_internet === 0,
  }
}

export function hitungRentangHarga(daftarTempat) {
  if (daftarTempat.length === 0) return null
  const harga = daftarTempat.map((t) => t.harga)
  return { min: Math.min(...harga), max: Math.max(...harga) }
}

export function buatRepo(client) {
  return {
    async konfigurasi() {
      return ubahKonfigurasi(await jalankan(client.from('konfigurasi').select('*'), 'konfigurasi'))
    },
    async kriteria(modul) {
      const baris = await jalankan(
        client.from('kriteria').select('*').eq('modul', modul).order('urutan', { ascending: true }),
        'kriteria'
      )
      return ubahKriteria(baris, modul)
    },
    async tempatPerModul(modul) {
      const baris = await jalankan(
        client.from('tempat').select('*').eq('modul', modul).order('kode', { ascending: true }),
        'tempat'
      )
      return baris.map(ubahTempat)
    },
    async tempatById(id) {
      const baris = await jalankan(client.from('tempat').select('*').eq('id', id).maybeSingle(), 'detail tempat')
      return baris ? ubahTempat(baris) : null
    },
    async ulasan(tempatId) {
      return jalankan(
        client.from('ulasan').select('*').eq('tempat_id', tempatId).order('tanggal', { ascending: false }),
        'ulasan'
      )
    },
    async foto(tempatId) {
      return jalankan(
        client.from('foto').select('*').eq('tempat_id', tempatId).order('urutan', { ascending: true }),
        'foto'
      )
    },
  }
}
