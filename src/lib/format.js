const angka = new Intl.NumberFormat('id-ID')

export const rupiah = (n) => `Rp ${angka.format(n)}`

export const persen = (n) =>
  `${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}%`

export const desimal4 = (n) =>
  new Intl.NumberFormat('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n)

export const SATUAN = { per_kunjungan: 'kunjungan', per_bulan: 'bulan' }

// Harga 0 pada modul CW tampil "Gratis"; selain itu "Rp X / satuan".
export function teksHarga(tempat) {
  if (tempat.harga === 0) return 'Gratis'
  return `${rupiah(tempat.harga)} / ${SATUAN[tempat.satuan_harga] ?? ''}`.trim()
}

export const tanggal = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

export const LABEL_LOKASI = {
  tengah_kota: 'Tengah kota',
  dekat_kampus: 'Dekat kampus',
  pinggiran_pedesaan: 'Pinggiran atau pedesaan',
  dekat_gunung: 'Dekat gunung',
}

export const LABEL_TIPE = {
  kafe: 'Kafe', coworking: 'Coworking', ruang_publik: 'Ruang publik',
  kos: 'Kos', rumah_sewa: 'Rumah sewa', villa: 'Villa', guesthouse: 'Guesthouse',
}

export const LABEL_MODUL = { CW: 'Tempat kerja', LS: 'Tempat tinggal' }

export const LABEL_COLOKAN = { sedikit: 'Sedikit', cukup: 'Cukup', banyak: 'Banyak' }

// Nama kriteria untuk tampilan (antarmuka berbahasa Indonesia) dan untuk kalimat alasan.
export const NAMA_KRITERIA = {
  kenyamanan_fisik: 'kenyamanan fisik',
  ketenangan: 'ketenangan',
  internet: 'internet',
  lokasi: 'lokasi dan akses',
  harga: 'harga',
  harga_sewa: 'harga sewa',
  kualitas_perawatan: 'kualitas dan perawatan',
}
