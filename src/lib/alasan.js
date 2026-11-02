// Kalimat alasan singkat untuk tampilan (bukan mesin hitung).
// Disusun hanya dari skor tempat itu sendiri; harga tidak pernah disebut.
// Skor 4-5 = "Unggul di", skor 0-2 = "Kurang di", maksimal dua nama, digabung " dan ".
// Urutan seri: skor, lalu bobot (pecahan eksak), lalu kolom urutan pada tabel kriteria.

const NAMA = {
  kenyamanan_fisik: 'kenyamanan fisik',
  ketenangan: 'ketenangan',
  internet: 'internet',
  lokasi: 'lokasi',
  kualitas_perawatan: 'perawatan',
}

// positif bila bobot a lebih besar dari b (perkalian silang, tanpa desimal)
const selisihBobot = (a, b) => a.pembilang * b.penyebut - b.pembilang * a.penyebut

export function susunAlasanTempat(tempat, daftarKriteria) {
  if (!tempat || !Array.isArray(daftarKriteria)) return ''
  const baris = daftarKriteria
    .filter((k) => k.tipe === 'benefit' && NAMA[k.kode] && tempat[k.kolom] != null && Number.isFinite(Number(tempat[k.kolom])))
    .map((k) => ({ k, skor: Number(tempat[k.kolom]) }))

  const urut = (arah) => (a, b) =>
    arah * (a.skor - b.skor) || -selisihBobot(a.k.bobot, b.k.bobot) || a.k.urutan - b.k.urutan

  const unggul = baris.filter((x) => x.skor >= 4).sort(urut(-1)).slice(0, 2)
  const kurang = baris.filter((x) => x.skor <= 2).sort(urut(1)).slice(0, 2)
  const gabung = (xs) => xs.map((x) => NAMA[x.k.kode]).join(' dan ')

  const bagian = []
  if (unggul.length) bagian.push(`Unggul di ${gabung(unggul)}.`)
  if (kurang.length) bagian.push(`Kurang di ${gabung(kurang)}.`)
  return bagian.length ? bagian.join(' ') : 'Nilainya cukup di semua sisi.'
}
