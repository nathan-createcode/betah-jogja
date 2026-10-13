# CHANGELOG

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
