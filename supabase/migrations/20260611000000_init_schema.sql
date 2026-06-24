-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Kelas
create table public.kelas (
    id text primary key,
    nama text not null,
    tahun_ajaran text not null, -- e.g. "2026/2027"
    semester text not null, -- e.g. "Ganjil"
    created_at timestamp with time zone default now()
);

-- Table: Profiles (linked to auth.users if we use auth, but for now just a table)
create table public.profiles (
    id text primary key,
    nama text not null,
    role text not null check (role in ('admin', 'guru', 'siswa')),
    nisn_nip text unique,
    kelas_id text references public.kelas(id) on delete set null,
    avatar_url text,
    created_at timestamp with time zone default now()
);

-- Table: Mata Pelajaran
create table public.mata_pelajaran (
    id text primary key,
    nama text not null,
    jadwal_hari text,
    jadwal_waktu text,
    kelas_id text references public.kelas(id) on delete cascade,
    created_at timestamp with time zone default now()
);

-- Table: Tujuan Pembelajaran
create table public.tujuan_pembelajaran (
    id text primary key,
    mapel_id text references public.mata_pelajaran(id) on delete cascade,
    kode text not null,
    deskripsi text,
    created_at timestamp with time zone default now()
);

-- Table: Materi
create table public.materi (
    id text primary key,
    kelas_id text references public.kelas(id) on delete cascade,
    mapel_id text references public.mata_pelajaran(id) on delete cascade,
    judul text not null,
    deskripsi text,
    tipe text check (tipe in ('pdf', 'video', 'link')),
    url text,
    tanggal_input date default current_date,
    created_at timestamp with time zone default now()
);

-- Table: Tugas
create table public.tugas (
    id text primary key,
    kelas_id text references public.kelas(id) on delete cascade,
    mapel_id text references public.mata_pelajaran(id) on delete cascade,
    judul text not null,
    deskripsi text,
    deadline date,
    tp_id text references public.tujuan_pembelajaran(id) on delete set null,
    tipe_asesmen text check (tipe_asesmen in ('Formatif', 'Sumatif', 'ASAS', 'ASAT')),
    created_at timestamp with time zone default now()
);

-- Table: Pengumpulan Tugas
create table public.pengumpulan_tugas (
    id text primary key,
    tugas_id text references public.tugas(id) on delete cascade,
    siswa_id text references public.profiles(id) on delete cascade,
    tanggal_kumpul timestamp with time zone,
    file_name text,
    text_answer text,
    nilai integer,
    status text default 'Belum' check (status in ('Belum', 'Sudah')),
    feedback text,
    created_at timestamp with time zone default now()
);

-- Table: Absensi Pertemuan
create table public.absensi_pertemuan (
    id text primary key,
    kelas_id text references public.kelas(id) on delete cascade,
    mapel_id text references public.mata_pelajaran(id) on delete cascade,
    tanggal date not null,
    is_terbuka boolean default true,
    created_at timestamp with time zone default now()
);

-- Table: Absensi Kehadiran (Per Student)
create table public.absensi_kehadiran (
    id text default gen_random_uuid()::text primary key,
    pertemuan_id text references public.absensi_pertemuan(id) on delete cascade,
    siswa_id text references public.profiles(id) on delete cascade,
    status text check (status in ('Hadir', 'Izin', 'Sakit', 'Alpha')),
    created_at timestamp with time zone default now(),
    unique(pertemuan_id, siswa_id)
);

-- Table: Nilai Siswa (Persistent grades for report)
create table public.nilai_siswa (
    id text primary key,
    siswa_id text references public.profiles(id) on delete cascade,
    mapel_id text references public.mata_pelajaran(id) on delete cascade,
    tugas1 integer default 0,
    tugas2 integer default 0,
    uts integer default 0,
    uas integer default 0,
    nilai_akhir integer default 0,
    created_at timestamp with time zone default now()
);

-- Table: Sertifikat
create table public.sertifikat (
    id text primary key,
    siswa_id text references public.profiles(id) on delete cascade,
    judul text not null,
    tahun text,
    penerbit text,
    tipe text check (tipe in ('Sertifikat', 'Prestasi')),
    created_at timestamp with time zone default now()
);

-- Table: Rapor P5
create table public.rapor_p5 (
    id text primary key,
    siswa_id text references public.profiles(id) on delete cascade,
    semester_id text,
    tema_projek text,
    beriman_bertakwa text,
    beriman_bertakwa_desc text,
    berkebinekaan_global text,
    berkebinekaan_global_desc text,
    gotong_royong text,
    gotong_royong_desc text,
    mandiri text,
    mandiri_desc text,
    bernalar_kritis text,
    bernalar_kritis_desc text,
    kreatif text,
    kreatif_desc text,
    status text default 'Draft',
    created_at timestamp with time zone default now()
);

-- Table: Absensi Ibadah
create table public.absensi_ibadah (
    id text primary key,
    siswa_id text references public.profiles(id) on delete cascade,
    tanggal date not null,
    tadarus boolean default false,
    dhuha boolean default false,
    dzuhur boolean default false,
    created_at timestamp with time zone default now()
);

-- Table: Announcements (Announcements)
create table public.announcements (
    id text primary key,
    judul text not null,
    konten text,
    tanggal date default current_date,
    pengirim text,
    kategori text check (kategori in ('Penting', 'Akademik', 'Kegiatan')),
    created_at timestamp with time zone default now()
);

-- RLS (Row Level Security) - Simplified for Local Dev (Disable for now for easier setup)
-- alter table public.kelas enable row level security;
-- ... other tables ...
