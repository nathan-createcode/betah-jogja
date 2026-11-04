# TRACE.md - Keterlacakan kebutuhan (v0.2, prototype siklus 1)

Status: selesai, sebagian, belum.
Catatan jujur: "selesai" berarti kode ada dan lulus uji unit. Tampilan v0.2 sudah diuji di peramban (lebar sekitar 390 px dan 1440 px) untuk beranda, hasil, detail, dan perbandingan. Koneksi ke Supabase sungguhan tetap mengikuti R01. Cadangan tampilan sebelum poles: tag git `v0.1-berfungsi`.

| ID | Fitur | Berkas atau komponen | Cara menguji | Status |
|----|-------|----------------------|--------------|--------|
| R01 | Basis data dummy dan skema | schema.sql dan CSV (Supabase); src/lib/supabase.js, src/lib/repo.js, src/data/DataProvider.jsx | `npm run cek` terhadap Supabase sungguhan | sebagian (klien tidak melempar error bila variabel kosong; pesan galat tampil di aplikasi. Hasil `npm run cek` ke project sungguhan belum dicatat di sini) |
| R02 | Peringkat dan persentase SAW-TOPSIS | src/lib/saw-topsis.js, src/lib/pencarian.js | `npm test` (tests/saw-topsis.test.js: kunci uji 1 dan 2; tests/pencarian.test.js) | selesai |
| R03 | Satu platform CW dan LS, pilihan modul dan tipe lokasi | src/pages/Cari.jsx, src/components/FilterPanel.jsx | tests/pencarian.test.js (filter modul dan lokasi); uji peramban | selesai |
| R04 | Anggaran sebagai input pencarian | src/lib/pencarian.js (tentukanAnggaran, bacaAnggaranTeks), FilterPanel.jsx | tests/pencarian.test.js (blok anggaran); uji peramban | selesai |
| R05 | Halaman detail tempat | src/pages/Detail.jsx | uji peramban (atribut, label skor, panel Cara hitungnya) | selesai |
| R06 | Rating rata-rata, 5 ulasan simulasi, foto placeholder | src/pages/Detail.jsx, FotoPlaceholder.jsx | uji peramban | selesai (foto digambar di aplikasi, kolom url tidak dimuat) |
| R07 | Tanggal pembaruan dan sumber data | src/pages/Detail.jsx, src/pages/Bandingkan.jsx | uji peramban | selesai |
| R08 | Checklist Wajib ada + penghitung langsung | src/lib/pencarian.js (lolosChecklist), src/lib/fasilitas.js, FilterPanel.jsx | tests/pencarian.test.js (blok checklist); uji peramban | selesai |
| R09 | Perbandingan 2-3 tempat, data setara halaman detail | src/pages/Bandingkan.jsx | uji peramban (batas 3, CW dan LS, tanpa guliran horizontal) | selesai |
| R10 | Favorit di perangkat (localStorage) dan halaman favorit | src/lib/favorit.js, src/pages/Favorit.jsx | uji peramban (bertahan setelah muat ulang) | selesai |
| (Could) | Filter jenis tempat | src/lib/pencarian.js (JENIS_TEMPAT), FilterPanel.jsx | tests/pencarian.test.js | selesai |
| N01 | Responsif HP dan desktop | seluruh src/ (Tailwind) | uji peramban lebar 360 px: tanpa guliran horizontal di hasil, detail, perbandingan, favorit | selesai (belum dicoba di HP fisik) |
| N02 | Tanpa pop-up atau iklan | seluruh src/ | uji peramban (tidak ada dialog) | selesai |
| N03 | Data dan foto ditandai simulasi | KartuTempat.jsx, Detail.jsx, Bandingkan.jsx | uji peramban | selesai |
| N04 | Hasil dijelaskan (persentase dan alasan) | src/lib/pencarian.js, src/lib/alasan.js, KartuTempat.jsx | tests/pencarian.test.js (alasan); uji peramban | selesai |
| N05 | Setiap kebutuhan punya ID | berkas ini | tinjauan manual | selesai |
| N06 | Bisa dibuka lewat tautan dari HP | rute hash (src/App.jsx) | perlu deploy (README) | sebagian (belum dideploy) |
| N07 | Status pencarian tiap tab dipertahankan | src/state/StatusPencarian.jsx | uji peramban (pindah tab, kembali dari detail, gulir, Atur ulang) | selesai |
| R16 | Token desain, ikon garis, foto placeholder | src/index.css, src/components/Ikon.jsx, FotoPlaceholder.jsx | uji peramban (kartu dan detail berlabel Foto simulasi, tanpa unduh gambar) | selesai |
| R17 | Skor tampil sebagai label, kalimat, dan titik; SAW hanya di panel tertutup | src/lib/teksSkor.js, BarisSkor.jsx, pages/Detail.jsx | uji peramban: tidak ada "3 / 5" di UI utama; SAW/TOPSIS hanya di "Cara hitungnya" | selesai |
| R18 | Persentase dua desimal koma Indonesia | src/lib/format.js (hanya tampilan) | uji peramban; urutan tetap nilai penuh (unit test kunci uji 1-2) | selesai |
| R19 | Halaman pembuka Betah Jogja sebagai rute awal | src/pages/Beranda.jsx, src/App.jsx, index.html | buka `#/`; logo kembali ke beranda tanpa menghapus status tab | selesai |
| R20 | Hasil grid dan panel filter yang bisa digulir sendiri | Cari.jsx, FilterPanel.jsx, KartuTempat.jsx | uji peramban: checklist Wajib ada dan Atur ulang tercapai di CW dan LS | selesai |
| N08 | Kontras teks informatif, target sentuh 44 px, tanpa gulir horizontal 360 px | CSS dan komponen kontrol | uji peramban 360–390 px | selesai (perlu dicek lagi di HP fisik) |
| N09 | Dock bawah HP tidak menutupi konten, hormati safe area | App.jsx, Navigasi.jsx, index.css `--dock-h` | uji peramban HP: daftar dan bilah bandingkan di atas dock | selesai (perlu dicek lagi di HP fisik) |
| N10 | Bahasa Indonesia hangat di UI utama, tanpa istilah teknis | halaman, KartuTempat, Beranda | tinjauan salinan | selesai |
| N11 | Navbar/dock kaca; halaman bersama netral, aksen per modul | Navigasi.jsx, kelas `.aksen-cw` / `.aksen-ls` | uji peramban | selesai |
| R21 | Layar tidak kosong bila render gagal | src/components/BatasGalat.jsx, src/main.jsx, src/App.jsx | sengaja lempar error di satu halaman: pesan, Muat ulang, dan Ke beranda; pindah rute membersihkan galat area konten | selesai |
| R22 | Data tidak menggantung; variabel kosong tidak menjatuhkan impor | src/lib/supabase.js, src/data/DataProvider.jsx | tanpa env: pesan konfigurasi. Jaringan lambat: galat setelah 15 detik plus Coba lagi | selesai |
| N12 | Judul tab mengikuti halaman; ringkasan filter hanya tampilan | src/App.jsx, src/lib/ringkasan.js | pindah beranda, kerja, tinggal, favorit, perbandingan, detail | selesai |
