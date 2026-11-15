// Kolom fasilitas berisi butir dipisah koma. Pisahkan, rapikan spasi tepi,
// dan cocokkan tanpa membedakan huruf besar dan kecil.

export function pecahFasilitas(teks) {
  if (typeof teks !== 'string') return []
  return teks
    .split(',')
    .map((butir) => butir.trim())
    .filter((butir) => butir.length > 0)
}

export function normalisasiButir(butir) {
  return String(butir).trim().toLowerCase()
}

// true bila daftar fasilitas memuat butir tertentu (huruf besar/kecil diabaikan)
export function punyaButir(daftarFasilitas, butir) {
  const target = normalisasiButir(butir)
  return daftarFasilitas.some((b) => normalisasiButir(b) === target)
}
