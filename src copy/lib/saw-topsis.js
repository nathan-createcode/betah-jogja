// Mesin SAW-TOPSIS: modul murni (tanpa UI, tanpa database).
//
// Masukan:
//   tempat:      [{ kode, nilai: { <kodeKriteria>: angka } }]
//   kriteria:    [{ kode, tipe: 'benefit'|'cost', bobot: { pembilang, penyebut } }]
//   minKandidat: bilangan bulat >= 1 (dari tabel konfigurasi)
// Keluaran: lihat bagian akhir fungsi hitungSawTopsis.

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
const kpk = (a, b) => (a / gcd(a, b)) * b

function periksaMasukan(tempat, kriteria, minKandidat) {
  if (!Array.isArray(tempat) || !Array.isArray(kriteria)) throw new Error('tempat dan kriteria harus berupa daftar.')
  if (!Number.isInteger(minKandidat) || minKandidat < 1) throw new Error('minKandidat harus bilangan bulat >= 1.')

  const kodeKriteria = new Set()
  for (const k of kriteria) {
    if (kodeKriteria.has(k.kode)) throw new Error(`Kode kriteria ganda: ${k.kode}`)
    kodeKriteria.add(k.kode)
    if (k.tipe !== 'benefit' && k.tipe !== 'cost') throw new Error(`Tipe kriteria '${k.kode}' tidak valid: ${k.tipe}`)
    const { pembilang, penyebut } = k.bobot ?? {}
    if (!Number.isInteger(pembilang) || !Number.isInteger(penyebut) || pembilang <= 0 || penyebut <= 0) {
      throw new Error(`Bobot kriteria '${k.kode}' harus pecahan bilangan bulat positif.`)
    }
  }

  const kodeTempat = new Set()
  for (const t of tempat) {
    if (typeof t.kode !== 'string' || t.kode === '') throw new Error('Setiap tempat harus punya kode.')
    if (kodeTempat.has(t.kode)) throw new Error(`Kode tempat ganda: ${t.kode}`)
    kodeTempat.add(t.kode)
    for (const k of kriteria) {
      const x = t.nilai?.[k.kode]
      if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) {
        throw new Error(`Nilai '${k.kode}' untuk tempat ${t.kode} tidak valid: ${x}`)
      }
    }
  }
}

function hasilKosong(tempat, status, sebab, kriteriaDibuang = []) {
  return {
    status, // 'ok' | 'pembanding_tidak_cukup'
    sebab, // null | 'kandidat_kurang' | 'semua_sama'
    kriteriaDipakai: [],
    kriteriaDibuang,
    hasil: [...tempat]
      .sort((a, b) => (a.kode < b.kode ? -1 : a.kode > b.kode ? 1 : 0))
      .map((t) => ({
        kode: t.kode, saw: null, dPlus: null, dMinus: null, c: null, persen: null, kontribusi: null, peringkat: null,
      })),
  }
}

export function hitungSawTopsis({ tempat, kriteria, minKandidat }) {
  periksaMasukan(tempat, kriteria, minKandidat)

  const n = tempat.length
  if (n < 2 || n < minKandidat) return hasilKosong(tempat, 'pembanding_tidak_cukup', 'kandidat_kurang')

  // 1. Buang kriteria yang nilainya sama di semua kandidat.
  const aktif = []
  const dibuang = []
  for (const k of kriteria) {
    const kolom = tempat.map((t) => t.nilai[k.kode])
    ;(kolom.every((x) => x === kolom[0]) ? dibuang : aktif).push(k)
  }
  if (aktif.length === 0) return hasilKosong(tempat, 'pembanding_tidak_cukup', 'semua_sama', dibuang.map((k) => k.kode))

  // 2. Normalkan ulang bobot sebagai pecahan eksak: penyebut bersama, lalu bagi dengan jumlah pembilang.
  const L = aktif.reduce((m, k) => kpk(m, k.bobot.penyebut), 1)
  const pembilangSama = aktif.map((k) => k.bobot.pembilang * (L / k.bobot.penyebut))
  const S = pembilangSama.reduce((a, b) => a + b, 0)
  const bobot = pembilangSama.map((p) => ({ pembilang: p, penyebut: S }))
  const w = pembilangSama.map((p) => p / S)

  const x = tempat.map((t) => aktif.map((k) => t.nilai[k.kode]))
  const m = aktif.length

  // 3. SAW. Kriteria cost memakai min_positif (harga terkecil > 0); r = 1 bila x <= min_positif.
  const r = x.map(() => new Array(m).fill(0))
  for (let j = 0; j < m; j++) {
    const kolom = x.map((baris) => baris[j])
    if (aktif[j].tipe === 'benefit') {
      const maks = Math.max(...kolom)
      for (let i = 0; i < n; i++) r[i][j] = kolom[i] / maks
    } else {
      const minPositif = Math.min(...kolom.filter((v) => v > 0))
      for (let i = 0; i < n; i++) r[i][j] = kolom[i] <= minPositif ? 1 : minPositif / kolom[i]
    }
  }
  const kontribusi = r.map((baris) => baris.map((v, j) => w[j] * v))
  const saw = kontribusi.map((baris) => baris.reduce((a, b) => a + b, 0))

  // 4. TOPSIS (nilai 0 dipakai apa adanya).
  const norma = aktif.map((_, j) => Math.sqrt(x.reduce((s, baris) => s + baris[j] ** 2, 0)))
  const v = x.map((baris) => baris.map((val, j) => (w[j] * val) / norma[j]))
  const ideal = (pilih) => aktif.map((k, j) => {
    const kolom = v.map((baris) => baris[j])
    return (k.tipe === 'benefit') === pilih ? Math.max(...kolom) : Math.min(...kolom)
  })
  const vPlus = ideal(true)
  const vMinus = ideal(false)
  const jarak = (baris, acuan) => Math.sqrt(baris.reduce((s, val, j) => s + (val - acuan[j]) ** 2, 0))

  const hasil = tempat.map((t, i) => {
    const dPlus = jarak(v[i], vPlus)
    const dMinus = jarak(v[i], vMinus)
    const c = dMinus / (dPlus + dMinus) // penyebut > 0: kriteria sisa pasti bervariasi
    return {
      kode: t.kode,
      saw: saw[i],
      dPlus,
      dMinus,
      c,
      persen: 100 * c,
      kontribusi: Object.fromEntries(aktif.map((k, j) => [k.kode, kontribusi[i][j]])),
      peringkat: 0,
    }
  })

  // 5. Urut menurun menurut C; seri dipecah dengan kode tempat supaya urutan stabil.
  hasil.sort((a, b) => (Math.abs(a.c - b.c) > 1e-12 ? b.c - a.c : a.kode < b.kode ? -1 : a.kode > b.kode ? 1 : 0))
  hasil.forEach((h, i) => { h.peringkat = i + 1 })

  return {
    status: 'ok',
    sebab: null,
    kriteriaDipakai: aktif.map((k, j) => ({
      kode: k.kode, tipe: k.tipe, bobot: bobot[j], bobotDesimal: w[j],
    })),
    kriteriaDibuang: dibuang.map((k) => k.kode),
    hasil,
  }
}
