# CHANGELOG

## v0.2 (poles tampilan dan komunikasi)

Cadangan versi sebelumnya: tag git `v0.1-berfungsi`. Mesin SAW-TOPSIS, bobot, filter, dan unit test tidak diubah (54 uji lulus).

- Nama **Betah Jogja** di judul peramban, header, dan halaman pembuka.
- Token warna, tipografi, radius, dan bayangan sesuai sistem desain; ikon garis; foto placeholder internal berlabel Foto simulasi.
- Persentase kecocokan tampil dua desimal (koma Indonesia). Skor mentah 1–5 diganti label, kalimat, dan lima titik. Skor SAW hanya di panel tertutup "Cara hitungnya".
- Beranda sebagai rute awal dengan kartu pencarian. Hasil: filter kiri di desktop, lembar bawah di HP, grid kartu. Dock bawah di HP, bilah atas di desktop.
- Favorit dan perbandingan memakai kartu tempat yang sama. Keadaan kosong, pemuatan kerangka, dan kesalahan memakai pesan ramah.

## v0.1 (prototype siklus 1)

### Tahap 1.1 - koneksi database dan pembacaan data
- Kerangka Vite + React, klien Supabase (kunci anon, baca saja), lapisan data `src/lib/repo.js`, pemisah fasilitas, skrip uji koneksi `npm run cek`.

### Tahap 1.2 - mesin SAW-TOPSIS
- `src/lib/saw-topsis.js`: modul murni; bobot pecahan eksak; kriteria seragam dibuang dan bobot dinormalkan ulang; harga 0 memakai min_positif pada SAW; urutan stabil (kode tempat sebagai pemutus seri); tanpa NaN/Infinity.
- Unit test kunci uji 1 dan 2 (selisih <= 0,0001) dan kasus tepi.

### Tahap 1.3 sampai 1.7 - pencarian, hasil, detail, responsif, status tab
- Dua tab, tipe lokasi, anggaran (siap pakai, Gratis, isian angka dengan aturan lengkap), hasil berperingkat dengan alasan singkat, detail tempat, status tiap tab dipertahankan (sessionStorage), Atur ulang per tab.

### Tahap 2 - Should
- Tanggal pembaruan dan sumber data, checklist Wajib ada dengan penghitung langsung, perbandingan 2-3 tempat.

### Tahap 3 - Could
- Favorit (localStorage) dan halaman favorit, filter jenis tempat.

### Tahap 4 - tampilan
- Palet, tipografi, ikon teks, animasi ringan. Perilaku tidak diubah.
