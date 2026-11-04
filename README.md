# Betah Jogja (v0.2)

Prototype siklus 1 skripsi: *A Decision Support System for Freelancer Workspace and Livingspace Recommendation in Yogyakarta Using SAW and TOPSIS*. Seluruh data tempat, ulasan, dan foto adalah **data simulasi**. Aplikasi ini tanpa login, tanpa pop-up, dan tanpa iklan.

## Prasyarat
- Node.js 20.6 atau lebih baru (`node -v`)
- Project Supabase berisi data (lihat "Mengimpor data")

## Variabel lingkungan
Salin `.env.example` menjadi `.env.local`, lalu isi:

| Variabel | Isi |
|----------|-----|
| `VITE_SUPABASE_URL` | Project URL, mis. `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | kunci publishable (`sb_publishable_...`) atau anon, **bukan** service_role |

Aplikasi ini memakai Vite, jadi awalannya `VITE_` (bukan `NEXT_PUBLIC_`). `.env.local` sudah masuk `.gitignore`.

## Cara menjalankan
```
npm install
npm run dev       # buka alamat yang tampil; dari HP (Wi-Fi sama) pakai alamat "Network"
npm test          # unit test (mesin, logika pencarian, pembacaan data)
npm run cek       # uji koneksi dan pembacaan data ke Supabase sungguhan
npm run build     # hasil build di folder dist
```

## Mengimpor data
1. Supabase, SQL Editor: tempel dan jalankan `schema.sql` (sekali, pada database kosong).
2. Table Editor, Insert, Import data from CSV, urutan: tempat, ulasan, foto, kriteria, konfigurasi.
3. SQL Editor: jalankan SQL RLS (aktifkan RLS pada kelima tabel, kebijakan `SELECT` untuk `anon`, cabut INSERT/UPDATE/DELETE) agar pengguna anonim hanya membaca.
4. Jalankan `npm run cek`; semua baris harus `LULUS`.

## Cara deploy (gratis)
**Vercel:** impor repositori, Framework Preset *Vite*, tambahkan dua variabel lingkungan di atas (Settings, Environment Variables), lalu Deploy. **Netlify:** Build command `npm run build`, Publish directory `dist`, tambahkan dua variabel yang sama. Rute memakai hash (`#/...`), jadi tidak perlu aturan pengalihan. Setelah deploy, tautan bisa dibuka dari HP.

## Ringkasan perilaku
- Layar pertama adalah beranda. Judulnya: "Freelance di Jogja? Cari tempat kerja dan tinggal yang bikin betah."
- Peringkat memakai persentase kecocokan (tampilan dua desimal, koma Indonesia). Skor SAW hanya ada di panel tertutup "Cara hitungnya" pada halaman detail.
- Skor kriteria di tampilan utama berupa label, kalimat, dan lima titik. Angka mentah seperti `3 / 5` tidak ditampilkan.
- Filter pencarian (modul, tipe lokasi, anggaran, Wajib ada, jenis tempat) ada di halaman hasil dan bisa digulir sendiri bila lebih tinggi dari layar. Perilaku filter tidak berubah.
- Perbandingan 2–3 tempat menampilkan data yang sama dengan halaman detail, untuk tempat kerja dan tempat tinggal.
- Bobot, tipe, dan skala kriteria dibaca dari tabel `kriteria`; parameter perilaku dari tabel `konfigurasi`.
- Normalisasi dihitung dari kandidat yang tersisa setelah semua filter. Kriteria yang nilainya sama di semua kandidat dibuang dan bobot sisanya dinormalkan ulang.
- Status pencarian tiap tab disimpan di sessionStorage (hilang saat peramban ditutup). Favorit disimpan di localStorage perangkat.
- Bila variabel Supabase kosong, aplikasi tetap terbuka dan menampilkan pesan galat. Permintaan data dibatasi 15 detik. Error saat render ditangkap batas galat (muat ulang atau kembali ke beranda).

Pelacakan kebutuhan: `TRACE.md`. Riwayat versi: `CHANGELOG.md`.
