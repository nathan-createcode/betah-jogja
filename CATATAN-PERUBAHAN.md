# Catatan perubahan: redesain tampilan Betah Jogja

Hanya tampilan yang diubah. Mesin hitung dan lapisan data tidak disentuh dan dicek identik dengan ZIP asli:
`lib/saw-topsis.js`, `lib/pencarian.js`, `lib/repo.js`, `lib/supabase.js`, `lib/catat.js`, `lib/favorit.js`,
`lib/fasilitas.js`, `lib/format.js`, `lib/teksSkor.js`, `lib/alasan.js`, `lib/ringkasan.js`,
`data/DataProvider.jsx`, `state/StatusPencarian.jsx`, `App.jsx`, `tests/`, `sql/`, `scripts/`.

## Pasang
1. Ekstrak ZIP, salin `.env.local` milikmu ke folder project (tidak ikut di ZIP).
2. `npm install` (ada dependensi baru: `gsap`, `lucide-react`, `@fontsource/instrument-serif`, `@fontsource-variable/jetbrains-mono`).
3. `npm run dev`

## Sistem desain
- Warna netral hangat (krem, tinta) untuk semua yang bukan modul. Biru = tempat kerja, hijau = tempat tinggal,
  dipakai hanya saat keduanya disebut atau ditampilkan secara spesifik. Token modul tidak diubah.
- Font: Plus Jakarta Sans (utama), Instrument Serif italic (kata sorot, kelas `.sorot`), JetBrains Mono (label kecil, kelas `.label-mono`).
- Pola pengisi kartu besar: `components/PolaBetah.jsx` (tulisan BETAH JOGJA miring, warna mengikuti kartu, opasitas 5 sampai 8 persen).
- Ikon: semua lewat `lucide-react`, nama `Ikon.*` tetap sama. Ikon dekat kampus sekarang `GraduationCap`.

## Animasi (GSAP, folder `src/gerak/`)
- Beranda: judul naik per kata, kartu hero masuk bergiliran, pola bergeser mengikuti gulir, hero mengecil seperti tirai saat
  bagian berikutnya menimpanya, teks berjalan yang makin cepat saat gulir kencang, bagian muncul saat digulir,
  garis langkah terbentang, kartu ajakan membesar, wordmark naik.
- Halaman Cari: kartu hasil pertama memudar naik sekali. Detail, Bandingkan, dan Favorit tanpa animasi masuk halaman.
- Semua animasi mati bila perangkat memakai `prefers-reduced-motion: reduce`. Efek tirai dan pelebaran hanya di layar lebar.

## Perubahan isi yang perlu kamu tahu
- Bagian "Area di Jogja" dihapus (nama tempat belum asli).
- Kartu newsletter diganti kartu "Simpan yang kamu suka" (ke Favorit), karena aplikasi tanpa akun dan tanpa pengumpulan email.
- Kartu "Atur bobot" diganti "Lima kriteria", karena bobot dibaca dari database dan tidak bisa diatur pengguna.
- Kartu "Temukan ruangmu" kini per jenis tempat (kerja: Kafe, Coworking, Ruang publik; tinggal: Kos, Rumah sewa, Villa, Guesthouse). Tiap kartu memasang filter jenis lewat `ubah()` yang sudah ada, lalu membuka daftar hasil. Kartu "Dekat kampus" dihapus karena itu lokasi, bukan jenis.
- Catatan "Tentang data" dipertahankan di beranda dengan teks persis seperti sebelumnya.

## Putaran kedua
- Kata "Jogja" selalu serif italic oranye lewat satu komponen (`components/Merek.jsx`). Tersedia dua nada: `--merek` (#B8481A) di latar terang
  dan `--merek-di-gelap` (#E2703A) di kartu gelap, supaya kontras tetap cukup. Penulisan seragam "Betah Jogja" di navigasi, hero, teks berjalan, dan kaki halaman (titik di footer dihapus).
- Halaman hasil: ada banner modul (warna biru atau hijau, pola BETAH JOGJA, jumlah tempat, filter aktif).
- Filter: bagian bernomor 01 sampai 04, chip dan tombol modul aktif memakai warna modul, "Wajib ada" menjadi kotak sentuh berikon (input asli tetap ada untuk keyboard dan pembaca layar).
- Kartu hasil: lencana peringkat di foto, chip jenis dan lokasi, harga lebih menonjol, alasan bergaris samping, panel kecocokan berwarna modul di kanan berisi persentase, batang, Bandingkan, dan favorit. Semua informasi lama tetap ada.

## Putaran ketiga: HP dan penggabungan perbaikanmu
- Perbaikan tipografi dan copywriting dari `perubahan-saja (1).zip` sudah digabung (Detail, Bandingkan, Cari, kartu hasil, `format.js`, `alasan.js`,
  `teksSkor.js`, `pencarian.js`, `infoTempat.js`, dan kedua berkas tes). Isi dan teksmu tidak diubah. Hanya penataannya mengikuti desain baru.
- Kartu hasil di HP: satu kolom, foto lebar di atas, nama, harga beserta catatan harga di baris sendiri, "Kelebihan" dan "Kekurangan" dua baris,
  lalu panel kecocokan. Di layar lebar tetap tiga kolom.
- Nomor peringkat tidak lagi menempel di foto. Peringkat sekarang menjadi label "Peringkat N" di panel kecocokan, tepat di atas persentase.
- Alasan tidak lagi memakai garis samping berwarna.
- Nomor 01 sampai 04 di filter dihapus (urutannya tidak membawa informasi).
- Dasar mobile: `-webkit-tap-highlight-color` transparan, teks kontrol tidak ikut terpilih saat ditekan lama, umpan balik `:active` saat disentuh,
  `interactive-widget=resizes-content` supaya papan ketik tidak menutupi isian, tabel Bandingkan berhenti rapi per kolom saat digeser.
  Yang sudah ada dan dipertahankan: `viewport-fit=cover`, area aman, input 16px, `touch-action: manipulation`, `100dvh`, hover hanya di perangkat berkursor.
- Diperiksa tanpa overflow horizontal di lebar 393 (Samsung A55), 360, dan 320 px.

## Putaran keempat: Favorit terorganisir
- Halaman Favorit sekarang punya: tab Semua / Tempat kerja / Tempat tinggal (dengan jumlah, memakai warna modul), dropdown Urutkan
  (Terakhir disimpan, Kecocokan tertinggi, Harga termurah, Nama A sampai Z), chip jenis (muncul saat satu kelompok dipilih dan berisi lebih dari satu jenis),
  dan di tab Semua tiap kelompok bisa dilipat.
- Pilihan tampilan disimpan di sessionStorage (`dss.favorit.tampilan.v1`) supaya tidak hilang saat kembali dari halaman Detail. Isi favorit tetap di `dss.favorit.v1`, tidak berubah.
- Hanya `src/pages/Favorit.jsx` dan `src/index.css` yang berubah. Hitungan persen di Favorit memakai kode yang sama persis seperti sebelumnya.

## Catatan teknis
- `tests/catat.test.js` ("kode sesi 6 karakter") gagal juga di ZIP asli: kode sesi menghasilkan 8 karakter. Bukan akibat redesain, tidak diubah.
