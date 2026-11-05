-- Pencatatan penggunaan anonim (tanpa login, tanpa IP, tanpa data pribadi).
-- Jalankan sekali di Supabase: SQL Editor -> New query -> Run.
-- Tabel ini terpisah dari lima tabel data (foto, konfigurasi, kriteria, tempat, ulasan).

create table if not exists aktivitas (
  id          bigint generated always as identity primary key,
  visitor_id  uuid,                      -- acak, disimpan di localStorage peramban
  jenis       text not null
              check (jenis in ('kunjungan', 'favorit_tambah', 'favorit_hapus')),
  tempat_id   text,                      -- id tempat (hanya untuk jenis favorit)
  path        text,                      -- rute hash, misal #/tempat/12
  perangkat   text,                      -- mobile / desktop
  waktu       timestamptz not null default now()
);

create index if not exists aktivitas_jenis_waktu_idx on aktivitas (jenis, waktu);
create index if not exists aktivitas_visitor_idx on aktivitas (visitor_id);

alter table aktivitas enable row level security;

-- Pengunjung (anon) hanya boleh MENAMBAH baris. Tidak ada policy SELECT/UPDATE/DELETE,
-- jadi tidak ada yang bisa membaca atau mengubah data ini lewat situs. Baca lewat dashboard Supabase.
drop policy if exists tambah_publik on aktivitas;
create policy tambah_publik on aktivitas
  for insert to anon
  with check (
    jenis in ('kunjungan', 'favorit_tambah', 'favorit_hapus')
    and (tempat_id is null or length(tempat_id) <= 10)
    and (path is null or length(path) <= 100)
    and (perangkat is null or perangkat in ('mobile', 'desktop'))
  );

-- ---------- Kueri untuk melihat hasil (jalankan di SQL Editor) ----------
-- Pengunjung unik per hari:
--   select waktu::date as tanggal, count(distinct visitor_id) as pengunjung_unik
--   from aktivitas where jenis = 'kunjungan' group by 1 order by 1;
--
-- Total pengunjung unik:
--   select count(distinct visitor_id) from aktivitas where jenis = 'kunjungan';
--
-- Tempat paling banyak difavoritkan (bersih = tambah - hapus):
--   select a.tempat_id, t.nama,
--          count(*) filter (where a.jenis = 'favorit_tambah')
--        - count(*) filter (where a.jenis = 'favorit_hapus') as favorit_bersih
--   from aktivitas a left join tempat t on t.id::text = a.tempat_id
--   where a.jenis like 'favorit%'
--   group by a.tempat_id, t.nama order by favorit_bersih desc;
--
-- Mencocokkan jawaban Google Form dengan aktivitas (kode = 6 huruf pertama visitor_id):
--   select upper(left(visitor_id::text, 6)) as kode, count(*) as aksi
--   from aktivitas group by 1 order by aksi desc;
