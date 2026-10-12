# Rekomendasi Tempat Kerja dan Tinggal Freelancer di Yogyakarta (v0.1)

Prototype siklus 1 skripsi: *A Decision Support System for Freelancer Workspace and Livingspace Recommendation in Yogyakarta Using SAW and TOPSIS*. Seluruh data tempat, ulasan, dan foto adalah **data simulasi**.

## Prasyarat
- Node.js 20.6 atau lebih baru (cek dengan `node -v`)
- Project Supabase yang sudah berisi data (lihat "Mengimpor data")

## Variabel lingkungan
Salin `.env.example` menjadi `.env.local`, lalu isi:

| Variabel | Isi |
|----------|-----|
| `VITE_SUPABASE_URL` | Project URL (Project Settings, API) |
| `VITE_SUPABASE_ANON_KEY` | kunci publishable atau anon (bukan service_role) |

`.env.local` sudah masuk `.gitignore`.

## Cara menjalankan
```
npm install
npm run dev      # buka alamat yang tampil; --host membuatnya bisa dibuka dari HP di Wi-Fi yang sama
npm test         # unit test
npm run cek      # uji koneksi dan pembacaan data ke Supabase
npm run build    # hasil build di folder dist
```

## Mengimpor data
1. Supabase, SQL Editor: tempel dan jalankan `schema.sql` (sekali, pada database kosong).
2. Table Editor, Insert, Import data from CSV, dengan urutan: tempat, ulasan, foto, kriteria, konfigurasi.
3. SQL Editor: jalankan SQL RLS (aktifkan RLS, kebijakan baca untuk `anon`, cabut INSERT/UPDATE/DELETE) agar pengguna anonim hanya bisa membaca.

## Cara deploy
(Diisi pada tahap deploy.)
