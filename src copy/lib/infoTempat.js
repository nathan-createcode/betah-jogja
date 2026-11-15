// Satu sumber teks untuk "Fasilitas dan informasi" (halaman Detail dan Bandingkan).
// Isi baris dibedakan per jenis tempat supaya tiap angka punya satuan yang jelas.
import { LABEL_COLOKAN, tanggal } from './format.js'

// ASUMSI: tabel `tempat` belum membedakan arti kolom `kapasitas`.
// Kos dibaca sebagai jumlah kamar; tipe lain sebagai total penghuni per unit sewa.
// Bila artinya ternyata lain, cukup ubah tabel ini.
const KAPASITAS_LS = {
  kos: { satuan: 'kamar', catatan: 'Jumlah kamar di kos ini.' },
  rumah_sewa: { satuan: 'orang', catatan: 'Total penghuni untuk seluruh rumah.' },
  villa: { satuan: 'orang', catatan: 'Total penghuni untuk seluruh vila.' },
  guesthouse: { satuan: 'orang', catatan: 'Total penghuni untuk seluruh penginapan.' },
}

export function infoKapasitas(t) {
  if (t.kapasitas == null) return null
  if (t.modul === 'CW') {
    return { nilai: `${t.kapasitas} orang`, catatan: 'Perkiraan jumlah pengunjung yang muat sekaligus.' }
  }
  const k = KAPASITAS_LS[t.tipe_tempat] ?? { satuan: 'orang', catatan: '' }
  return { nilai: `${t.kapasitas} ${k.satuan}`, catatan: k.catatan }
}

// Baris info singkat: label tetap per jenis tempat, urutannya juga tetap.
export function susunInfo(t) {
  const baris = []
  const tambah = (id, label, nilai, catatan) => {
    if (nilai == null || nilai === '') return
    baris.push({ id, label, nilai, catatan: catatan || '' })
  }
  const kap = infoKapasitas(t)
  if (t.modul === 'CW') {
    tambah('jam', 'Jam buka', t.jam_operasional)
    tambah('kapasitas', 'Kapasitas', kap?.nilai, kap?.catatan)
    tambah('colokan', 'Colokan', t.jumlah_colokan ? (LABEL_COLOKAN[t.jumlah_colokan] ?? t.jumlah_colokan) : null)
  } else {
    tambah('kapasitas', 'Kapasitas', kap?.nilai, kap?.catatan)
    tambah(
      'internet',
      'Perkiraan kecepatan internet',
      t.internet_mbps ? `± ${t.internet_mbps} Mbps` : null,
      'Hanya informasi tambahan, tidak memengaruhi persentase kecocokan.',
    )
  }
  return baris
}

// Fasilitas yang sudah punya baris sendiri tidak perlu muncul dua kali sebagai chip.
export function fasilitasUntukChip(t) {
  const sudahAdaBaris = t.modul === 'CW' && t.jumlah_colokan ? ['colokan banyak'] : []
  return t.fasilitasList.filter((f) => !sudahAdaBaris.includes(String(f).trim().toLowerCase()))
}

export function teksPembaruan(t) {
  const bagian = [t.sumber_data, t.tanggal_pembaruan ? `Diperbarui ${tanggal(t.tanggal_pembaruan)}` : null].filter(Boolean)
  return bagian.join(' · ')
}
