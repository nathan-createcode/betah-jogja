// Teks tampilan skor kriteria (bukan mesin hitung). Nilai mentah 1-5 tidak ditampilkan di UI utama.

export const LABEL_KRITERIA_TAMPIL = {
  kenyamanan_fisik: 'Kenyamanan fisik',
  kualitas_perawatan: 'Kualitas dan perawatan',
  ketenangan: 'Ketenangan',
  internet: 'Internet',
  lokasi: 'Lokasi dan aksesibilitas',
  harga: 'Harga',
  harga_sewa: 'Harga sewa',
}

export const TEKS_SKOR = {
  kenyamanan_fisik: {
    1: { label: 'Kurang layak', kalimat: 'Kursi atau meja tidak bisa dipakai bekerja, panas atau pengap. Bertahan kurang dari 1 jam.' },
    2: { label: 'Kurang nyaman', kalimat: 'Kursi atau meja kurang layak atau suhu tidak stabil. Bertahan sekitar 1 sampai 2 jam.' },
    3: { label: 'Cukup nyaman', kalimat: 'Kursi dan meja layak, suhu cukup sejuk. Bertahan sekitar 3 sampai 4 jam.' },
    4: { label: 'Nyaman', kalimat: 'Kursi dan meja nyaman, sejuk, ruang cukup luas. Bertahan setengah hari.' },
    5: { label: 'Sangat nyaman', kalimat: 'Kursi dan meja ergonomis, sejuk, ruang luas dan lega. Nyaman seharian.' },
  },
  kualitas_perawatan: {
    1: { label: 'Kurang layak', kalimat: 'Fasilitas dasar sering bermasalah, bangunan rusak atau kotor.' },
    2: { label: 'Perlu perbaikan', kalimat: 'Fasilitas dasar ada tetapi sering bermasalah atau ada bagian rusak.' },
    3: { label: 'Layak', kalimat: 'Fasilitas dasar berfungsi dan cukup bersih, masalah kadang muncul.' },
    4: { label: 'Terawat', kalimat: 'Fasilitas dasar dan tambahan cukup lengkap, masalah jarang.' },
    5: { label: 'Sangat terawat', kalimat: 'Fasilitas lengkap, bersih, dan terawat, nyaris tanpa masalah.' },
  },
  ketenangan: {
    1: { label: 'Sangat bising', kalimat: 'Bising hampir sepanjang waktu, sulit untuk fokus.' },
    2: { label: 'Bising', kalimat: 'Sering bising, sulit fokus.' },
    3: { label: 'Cukup tenang', kalimat: 'Kadang bising, masih bisa fokus dengan usaha.' },
    4: { label: 'Tenang', kalimat: 'Gangguan suara jarang.' },
    5: { label: 'Sangat tenang', kalimat: 'Nyaris tanpa gangguan suara.' },
  },
  internet: {
    0: { label: 'Tidak ada Wi-Fi', kalimat: 'Tidak tersedia sama sekali.' },
    1: { label: 'Hampir tak bisa dipakai', kalimat: 'Sangat lambat, hampir sepanjang waktu putus atau gagal.' },
    2: { label: 'Untuk hal ringan', kalimat: 'Chat, email, dan membuka dokumen bisa, sering melambat atau putus.' },
    3: { label: 'Cukup', kalimat: 'Browsing, dokumen daring, dan media sosial, kadang melambat atau putus.' },
    4: { label: 'Baik', kalimat: 'Video call dan unggah dokumen biasa lancar, jarang melambat atau putus.' },
    5: { label: 'Sangat baik', kalimat: 'Unggah atau unduh file besar dan banyak perangkat sekaligus, nyaris tanpa gangguan.' },
  },
  lokasi: {
    1: { label: 'Sulit dijangkau', kalimat: 'Akses sempit atau jauh, tanpa parkir, tempat makan jauh.' },
    2: { label: 'Kurang mudah', kalimat: 'Hanya satu dari akses jalan, parkir atau angkutan online, dan tempat makan yang memadai.' },
    3: { label: 'Cukup mudah', kalimat: 'Dua dari tiga hal itu memadai.' },
    4: { label: 'Mudah', kalimat: 'Ketiganya memadai dengan satu kekurangan kecil.' },
    5: { label: 'Sangat mudah', kalimat: 'Dekat jalan utama, parkir luas atau angkutan online mudah, tempat makan dalam jarak jalan kaki.' },
  },
}

export function kunciSkor(kodeKriteria) {
  if (kodeKriteria === 'kenyamanan_fisik' || kodeKriteria === 'kualitas_perawatan' || kodeKriteria === 'ketenangan' || kodeKriteria === 'internet' || kodeKriteria === 'lokasi') {
    return kodeKriteria
  }
  return null
}

export function teksSkor(kodeKriteria, nilai) {
  const kunci = kunciSkor(kodeKriteria)
  if (!kunci) return null
  const n = Number(nilai)
  const baris = TEKS_SKOR[kunci][n]
  if (!baris) return null
  return { nilai: n, label: baris.label, kalimat: baris.kalimat, tanpaTitik: kunci === 'internet' && n === 0 }
}

export function kelasAksen(modul) {
  return modul === 'LS' ? 'aksen-ls' : 'aksen-cw'
}
