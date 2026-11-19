# CHANGELOG

## v0.2 (redesain tampilan, 16–19 November 2026)

Versi paket tetap `0.2.0`. Mesin SAW-TOPSIS, bobot, aturan filter, dan isi favorit di perangkat (`dss.favorit.v1`) tidak diubah. Rincian tampilan ada di `CATATAN-PERUBAHAN.md`.

- Sistem desain netral hangat. Biru hanya untuk tempat kerja, hijau hanya untuk tempat tinggal. Font: Plus Jakarta Sans, Instrument Serif (kata sorot dan kata "Jogja" lewat `src/components/Merek.jsx`), JetBrains Mono untuk label kecil. Ikon lewat `lucide-react`. Pola pengisi kartu: `src/components/PolaBetah.jsx`.
- Animasi GSAP di `src/gerak/` untuk beranda dan kartu hasil pertama. Mati bila `prefers-reduced-motion: reduce`. Detail, Bandingkan, dan Favorit tanpa animasi masuk halaman.
- Beranda: bagian "Area di Jogja" dihapus. Kartu newsletter diganti "Simpan yang kamu suka". Kartu "Atur bobot" diganti "Lima kriteria" (bobot tetap dari database). Pintasan jenis tempat memasang filter lewat `ubah()` yang sudah ada. Catatan "Tentang data" dipertahankan.
- Halaman hasil: banner modul, kartu dengan peringkat "Peringkat N" di panel kecocokan, dan tata letak satu kolom di HP. Dasar sentuh: sorotan ketuk transparan, input 16px, `100dvh`, dan tabel Bandingkan yang berhenti per kolom. Diperiksa tanpa overflow horizontal di lebar 393, 360, dan 320 px.
- Favorit: tab Semua / Tempat kerja / Tempat tinggal, urutan (terakhir disimpan, kecocokan, harga, nama), chip jenis, dan kelompok yang bisa dilipat. Pilihan tampilan di sessionStorage `dss.favorit.tampilan.v1`. Hitungan persen tidak diubah.
- Kode sesi di footer beranda adalah 8 karakter (sejak 9 November 2026, `src/lib/catat.js`). Pada 19 November 2026 kalimat "Kode sesimu" ditebalkan. Uji `tests/catat.test.js` ("kode sesi 6 karakter") masih mengharapkan 6 karakter, jadi uji itu gagal; bukan akibat redesain.

## v0.2 (pencatatan penggunaan, 5 November 2026)

Versi paket tetap `0.2.0`. Mesin SAW-TOPSIS, bobot, filter, dan penyimpanan favorit di perangkat tidak diubah.

- Tabel baru `aktivitas` (`sql/aktivitas.sql`), terpisah dari lima tabel data simulasi. Pengunjung anonim hanya boleh menambah baris. Tidak ada kebijakan baca lewat situs.
- `src/lib/catat.js` mencatat kunjungan sekali per sesi tab, plus tambah atau hapus favorit. Isi catatan: ID acak di perangkat, jenis aksi, id tempat (khusus favorit), rute hash, dan jenis perangkat (lebar di bawah 768 px dihitung mobile). Tidak ada nama, email, IP, atau lokasi.
- Kegagalan mencatat (jaringan, penyimpanan, atau tabel belum ada) tidak mengganggu pencarian, favorit, atau tampilan.
- Footer beranda menampilkan kode sesi enam karakter, potongan ID pengunjung, supaya jawaban kuesioner bisa dicocokkan lewat SQL Editor. Uji unit: `tests/catat.test.js`.

## v0.2 (lanjutan, November 2026)

Versi paket tetap `0.2.0`. Mesin SAW-TOPSIS, bobot, dan aturan filter tidak diubah.

- Klien Supabase tidak melempar error saat diimpor bila `VITE_SUPABASE_URL` atau `VITE_SUPABASE_ANON_KEY` kosong. `DataProvider` menampilkan pesan konfigurasi.
- Pembacaan data dibatasi 15 detik. Bila lewat atau gagal, pengguna melihat pesan ramah dan tombol coba lagi.
- Batas galat di akar aplikasi dan di area konten: layar tidak kosong, ada muat ulang dan kembali ke beranda. Pindah rute membersihkan galat di area konten.
- Panel filter di halaman hasil selalu tampil dan bisa digulir sendiri sampai checklist Wajib ada, jenis tempat, dan Atur ulang, di tempat kerja maupun tempat tinggal. Tombol Filter terpisah di judul hasil dihapus.
- Tabel perbandingan menampilkan data yang sama dengan halaman detail (kecocokan dan alasan, semua kriteria, fasilitas, area, jam atau kecepatan, colokan bila ada, kapasitas, tanggal, sumber). Berlaku untuk tempat kerja dan tempat tinggal. Tata letak kolom tetap.
- Salinan beranda: judul "Freelance di Jogja?", kalimat pendukung, dan tiga langkah. Judul tab peramban mengikuti halaman. Deskripsi meta dan ikon ditambahkan.
- Font tampilan memakai Plus Jakarta Sans. Ringkasan filter (`src/lib/ringkasan.js`) dan alasan tampilan (`src/lib/alasan.js`) hanya memengaruhi teks, bukan perhitungan.

## v0.2 (poles tampilan dan komunikasi)

Cadangan versi sebelumnya: tag git `v0.1-berfungsi`. Mesin SAW-TOPSIS, bobot, filter, dan unit test tidak diubah (54 uji lulus).

- Nama **Betah Jogja** di judul peramban, header, dan halaman pembuka.
- Token warna, tipografi, radius, dan bayangan sesuai sistem desain; ikon garis; foto placeholder internal berlabel Foto simulasi.
- Persentase kecocokan tampil dua desimal (koma Indonesia). Skor mentah 1–5 diganti label, kalimat, dan lima titik. Skor SAW hanya di panel tertutup "Cara hitungnya".
- Beranda sebagai rute awal dengan kartu pencarian. Hasil berupa grid kartu. Dock bawah di HP, bilah atas di desktop.
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
