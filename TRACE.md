# TRACE.md - Keterlacakan kebutuhan (v0.1, prototype siklus 1)

Status: selesai, sebagian, belum. Diperbarui setiap tahap.

| ID | Fitur | Berkas atau komponen | Cara menguji | Status |
|----|-------|----------------------|--------------|--------|
| R01 | Basis data dummy dan skema | schema.sql, CSV impor (Supabase); src/lib/supabase.js, src/lib/repo.js | `npm run cek` (jumlah tempat, kriteria, konfigurasi) | sebagian (kode selesai, menunggu hasil `npm run cek` dari pengguna) |
| R02 | Peringkat dan persentase SAW-TOPSIS | - | - | belum |
| R03 | Satu platform CW dan LS, pilihan modul dan tipe lokasi | - | - | belum |
| R04 | Anggaran sebagai input pencarian | - | - | belum |
| R05 | Halaman detail tempat | src/lib/repo.js (tempatById, pembacaan data saja) | `npm run cek` (detail + ulasan + foto terbaca) | sebagian (data terbaca, halaman belum) |
| R06 | Rating, 5 ulasan, foto placeholder | src/lib/repo.js (ulasan, foto, pembacaan data saja) | `npm run cek` | sebagian (data terbaca, tampilan belum) |
| R07 | Tanggal pembaruan dan sumber data | - | - | belum |
| R08 | Checklist wajib ada | src/lib/fasilitas.js (pemisah dan pencocok butir) | `npm test` (tests/fasilitas.test.js) | sebagian (pencocok butir saja) |
| R09 | Perbandingan 2-3 tempat | - | - | belum |
| R10 | Favorit di perangkat | - | - | belum |
| N01 | Responsif | - | - | belum |
| N02 | Tanpa pop-up atau iklan | - | tinjauan manual | belum |
| N03 | Data dan foto ditandai simulasi | kolom is_simulasi dibaca; tampilan belum | `npm run cek` | sebagian |
| N04 | Hasil dijelaskan | - | - | belum |
| N05 | Setiap kebutuhan punya ID | berkas ini | tinjauan manual | selesai |
| N06 | Bisa dibuka lewat tautan dari HP | - | - | belum |
| N07 | Status pencarian tiap tab dipertahankan | - | - | belum |
