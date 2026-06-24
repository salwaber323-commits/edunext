-- Table: Kegiatan (Events/Calendars)
create table if not exists public.kegiatan (
    id text primary key,
    judul text not null,
    deskripsi text,
    tanggal date not null,
    kategori text check (kategori in ('Lomba', 'Acara', 'Hari Besar', 'Ujian')),
    lokasi text,
    created_at timestamp with time zone default now()
);

-- Table: Pendaftaran Kegiatan (Event Registration)
create table if not exists public.pendaftaran_kegiatan (
    id text default gen_random_uuid()::text primary key,
    kegiatan_id text references public.kegiatan(id) on delete cascade,
    siswa_id text references public.profiles(id) on delete cascade,
    tanggal_daftar timestamp with time zone default now(),
    unique(kegiatan_id, siswa_id)
);

-- Table: Ekstrakurikuler
create table if not exists public.ekstrakurikuler (
    id text primary key,
    nama text not null,
    pembina text,
    deskripsi text,
    jadwal text,
    logo_url text,
    created_at timestamp with time zone default now()
);

-- Table: Anggota Ekstrakurikuler
create table if not exists public.anggota_ekskul (
    id text default gen_random_uuid()::text primary key,
    ekskul_id text references public.ekstrakurikuler(id) on delete cascade,
    siswa_id text references public.profiles(id) on delete cascade,
    tanggal_gabung timestamp with time zone default now(),
    unique(ekskul_id, siswa_id)
);

-- Update User Role constraint to include OSIS
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin', 'guru', 'siswa', 'osis'));
