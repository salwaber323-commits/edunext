# Rancangan Sistem LMS — SMAM Muslimin Cililin

> Versi 1.0 · Kurikulum Merdeka · Kapasitas ≤ 200 Siswa

---

## Daftar Isi

1. [Visi Sistem](#1-visi-sistem)
2. [Arsitektur Teknologi](#2-arsitektur-teknologi)
3. [Struktur Peran & Hak Akses](#3-struktur-peran--hak-akses)
4. [Modul Inti Sistem](#4-modul-inti-sistem)
   - 4.1 Manajemen Akademik
   - 4.2 Materi Pembelajaran
   - 4.3 Tugas & Pengumpulan
   - 4.4 Absensi
   - 4.5 Penilaian (Kurikulum Merdeka)
   - 4.6 Rapor
   - 4.7 P5 & Karakter Islami
   - 4.8 Sertifikat & Portofolio
   - 4.9 Pengumuman
5. [Skema Database](#5-skema-database)
6. [Alur Data End-to-End](#6-alur-data-end-to-end)
7. [Catatan Implementasi](#7-catatan-implementasi)

---

## 1. Visi Sistem

LMS ini bukan sekadar tempat upload tugas. Fungsinya adalah **pusat kegiatan akademik digital** yang mencerminkan tiga pilar SMAM Muslimin Cililin:

| Pilar | Wujud di Sistem |
|---|---|
| Akademik | Materi, tugas, nilai, rapor terintegrasi |
| Karakter Islami | Penilaian sikap, absensi ibadah, catatan akhlak |
| Kurikulum Merdeka | KKTP, Asesmen Formatif/Sumatif, Rapor P5 terpisah |

---

## 2. Arsitektur Teknologi

```
Frontend         →  Next.js (App Router)
Backend & Auth   →  Supabase (PostgreSQL + Auth + Storage)
Hosting          →  Vercel
File Storage     →  Supabase Storage
PDF Export       →  react-pdf atau Puppeteer (server-side)
```

#
---

## 3. Struktur Peran & Hak Akses

Sistem memiliki tiga peran utama dengan hierarki akses yang ketat.

### 3.1 Admin

```
✓ Kelola tahun ajaran & semester
✓ Kelola kelas, guru, siswa
✓ Kelola mata pelajaran & jadwal
✓ Melihat seluruh data akademik
✓ Generate & cetak rapor massal
✓ Kelola pengumuman sekolah
```

### 3.2 Guru

```
✓ Upload & kelola materi (per mapel yang diampu)
✓ Buat & nilai tugas
✓ Isi absensi harian
✓ Input nilai (Formatif & Sumatif)
✓ Upload sertifikat/prestasi siswa
✓ Tambah catatan wali kelas (jika merangkap walikelas)
✗ Tidak bisa ubah data siswa/kelas secara langsung
```

### 3.3 Siswa

```
✓ Lihat materi (sesuai kelas & mapelnya)
✓ Kumpulkan tugas
✓ Lihat nilai & predikat KKTP
✓ Lihat rekap absensi miliknya
✓ Lihat rapor & sertifikat
✗ Tidak bisa ubah data akademik apapun
```

---

## 4. Modul Inti Sistem

---

### 4.1 Manajemen Akademik

Ini fondasi seluruh sistem. Semua data terikat pada hierarki berikut:

```
Tahun Ajaran
  └── Semester (Ganjil / Genap)
        └── Kelas (X IPA 1, XI IPS 2, ...)
              ├── Siswa (many-to-one)
              └── Mapel × Guru (many-to-many via tabel enrollments)
```

**Alur setup awal oleh Admin:**

1. Buat Tahun Ajaran baru (misal: `2026/2027`)
2. Tetapkan semester aktif (`Ganjil`)
3. Buat/perbarui daftar kelas
4. Assign guru ke mata pelajaran
5. Masukkan siswa ke kelas
6. Setelah langkah ini selesai → semua modul lain aktif otomatis

**Catatan penting:** Siswa yang naik kelas tidak dihapus, melainkan di-*archive* dan dibuat entri baru di kelas berikutnya. Riwayat akademik semester sebelumnya tetap tersimpan dan bisa diakses.

---

### 4.2 Materi Pembelajaran

Guru mengunggah materi yang langsung terkait dengan Tujuan Pembelajaran (TP) mereka.

**Struktur materi:**

```
Mata Pelajaran
  └── Modul / Bab
        └── Konten
              ├── PDF / PPT / DOCX  (via Supabase Storage)
              ├── Link Video YouTube
              └── Catatan Teks (rich text)
```

**Fitur pembatasan akses otomatis:**

Sistem secara otomatis memfilter materi berdasarkan:
- Kelas aktif siswa
- Mata pelajaran yang diikuti
- Semester aktif

Siswa kelas X tidak pernah melihat materi kelas XI. Tidak perlu konfigurasi manual per materi.

---

### 4.3 Tugas & Pengumpulan

**Data tugas yang dibuat guru:**

| Field | Keterangan |
|---|---|
| Judul | Nama tugas |
| Deskripsi | Instruksi detail (rich text) |
| Tipe Asesmen | `Formatif` atau `Sumatif` |
| Tujuan Pembelajaran | Tag TP yang dinilai |
| Deadline | Tanggal & jam |
| Lampiran | File soal (opsional) |
| Target Kelas | Otomatis dari kelas yang diampu |

**Status tugas siswa (otomatis):**

```
BELUM MENGUMPULKAN   →  sebelum deadline
TERLAMBAT            →  melewati deadline, belum kumpul
SUDAH MENGUMPULKAN   →  file terupload, menunggu penilaian
SUDAH DINILAI        →  guru telah memberi nilai & feedback
```

**Alur lengkap:**

```
Guru buat tugas
       ↓
Siswa lihat di dashboard
       ↓
Siswa upload jawaban (file / teks)
       ↓
Guru buka halaman penilaian
       ↓
Guru input nilai + komentar
       ↓
Nilai masuk ke rekap otomatis
       ↓
Siswa lihat nilai & feedback
```

---

### 4.4 Absensi

Absensi dirancang agar bisa diisi cepat dan rekap tersedia real-time.

**Alur absensi harian:**

```
Guru buka sesi absensi
  → Pilih kelas & mata pelajaran
  → Sistem load daftar siswa kelas tersebut
  → Guru tandai status tiap siswa
  → Simpan → data masuk ke rekap
```

**Status yang tersedia:**

| Kode | Status | Keterangan |
|---|---|---|
| `H` | Hadir | Masuk normal |
| `I` | Izin | Dengan surat keterangan |
| `S` | Sakit | Dengan keterangan |
| `A` | Alpha | Tidak ada keterangan |

**Rekap otomatis yang tersedia:**

- Per siswa: total hadir, izin, sakit, alpha per semester
- Per kelas: rekapitulasi kehadiran semua siswa
- Persentase kehadiran (masuk ke data rapor otomatis)

**Fitur tambahan untuk sekolah Islam:**

Karena SMAM Muslimin Cililin memiliki program ibadah harian (tadarus, salat dhuha berjamaah), dapat ditambahkan kolom **Absensi Ibadah** terpisah yang terhubung ke penilaian sikap/karakter siswa.

---

### 4.5 Penilaian (Kurikulum Merdeka / KKTP)

Ini adalah modul yang paling berbeda dari LMS konvensional. Sistem tidak menggunakan KKM tunggal, melainkan mengikuti **Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)**.

#### 4.5.1 Jenis Asesmen

**Asesmen Formatif**
- Dilakukan selama proses pembelajaran
- Tidak menentukan nilai rapor langsung
- Digunakan sebagai bahan refleksi guru & umpan balik siswa
- Contoh: kuis harian, observasi, diskusi kelas
- Ditampilkan di dashboard siswa sebagai "Catatan Perkembangan"

**Asesmen Sumatif**
- Menentukan nilai rapor
- Dilakukan di akhir satu lingkup materi atau akhir semester
- Jenis:
  - **Sumatif Lingkup Materi** → per bab/topik
  - **ASAS** (Asesmen Sumatif Akhir Semester) → akhir semester
  - **ASAT** (Asesmen Sumatif Akhir Tahun) → akhir tahun ajaran

#### 4.5.2 Skema Predikat KKTP

Sistem secara otomatis mengkonversi nilai angka ke predikat:

```
0  – 70%  →  Perlu Bimbingan  (remedial diperlukan)
71 – 80%  →  Cukup            (tercapai, tidak remedial)
81 – 90%  →  Baik
91 – 100% →  Sangat Baik
```

Konversi ini diterapkan per Tujuan Pembelajaran, bukan per mata pelajaran secara keseluruhan.

#### 4.5.3 Logika Perhitungan Nilai

```typescript
// lib/kktp.ts

type Predikat = 'Perlu Bimbingan' | 'Cukup' | 'Baik' | 'Sangat Baik'

function hitungPredikat(nilai: number): Predikat {
  if (nilai <= 70) return 'Perlu Bimbingan'
  if (nilai <= 80) return 'Cukup'
  if (nilai <= 90) return 'Baik'
  return 'Sangat Baik'
}

function hitungNilaiAkhir(sumatifs: number[]): number {
  // Rata-rata dari semua asesmen sumatif dalam satu semester
  return sumatifs.reduce((a, b) => a + b, 0) / sumatifs.length
}
```

#### 4.5.4 Tampilan Nilai Siswa

Siswa tidak hanya melihat angka, tapi juga konteks pencapaian:

```
Matematika — Semester Ganjil 2026/2027

Tujuan Pembelajaran           Nilai    Predikat
──────────────────────────────────────────────────
TP 1: Persamaan Kuadrat       85       Baik ✓
TP 2: Fungsi Komposisi        72       Cukup ✓
TP 3: Trigonometri            68       Perlu Bimbingan ⚠

Nilai Akhir Semester: 75  →  Cukup
```

Jika ada predikat "Perlu Bimbingan", sistem otomatis menampilkan notifikasi ke guru bahwa siswa tersebut perlu program remedial.

---

### 4.6 Rapor

Rapor dihasilkan dari agregasi data yang sudah ada di sistem.

**Komponen data rapor:**

```
Nilai Akademik (dari modul Penilaian)
    +
Data Kehadiran (dari modul Absensi)
    +
Catatan Wali Kelas (diisi manual)
    +
Penilaian Sikap (dari modul Karakter)
    =
Rapor Semester
```

**Format rapor:**

Rapor mengikuti format Kurikulum Merdeka dengan komponen:

| Komponen | Isi |
|---|---|
| Identitas siswa | Nama, kelas, tahun ajaran |
| Nilai per mapel | Angka + predikat KKTP |
| Deskripsi capaian | Diisi guru, bisa dibantu template |
| Rekap kehadiran | Hadir / Izin / Sakit / Alpha |
| Catatan wali kelas | Teks bebas |
| Penilaian sikap | Beriman, Mandiri, Gotong Royong, dll |

**Alur generate rapor:**

```
Admin/Wali Kelas buka menu Rapor
  → Pilih semester & kelas
  → Sistem kompilasi data otomatis
  → Wali kelas tambah catatan (jika belum)
  → Preview rapor per siswa
  → Export PDF individual atau massal
  → Cetak
```

**Catatan teknis:** Rapor di-*generate* sisi server (Node.js + Puppeteer atau react-pdf) agar format konsisten dan tidak bergantung pada CSS browser siswa.

---

### 4.7 P5 & Penilaian Karakter Islami

Ini adalah dua sistem penilaian non-akademik yang berjalan paralel.

#### 4.7.1 Rapor P5 (Projek Penguatan Profil Pelajar Pancasila)

Rapor P5 **terpisah** dari rapor akademik, sesuai ketentuan Kurikulum Merdeka.

**Dimensi yang dinilai (sesuai P5):**

- Beriman, Bertakwa kepada Tuhan YME & Berakhlak Mulia
- Berkebinekaan Global
- Bergotong Royong
- Mandiri
- Bernalar Kritis
- Kreatif

**Format penilaian P5:** Bukan angka, melainkan deskripsi capaian:

```
Mandiri:
"Siswa menunjukkan kemampuan mengelola waktu dengan baik 
selama projek berlangsung dan mampu menyelesaikan tugas 
tanpa perlu banyak pengarahan."
```

Guru pengampu P5 mengisi deskripsi ini per siswa per dimensi. Sistem menyimpan dan menampilkannya di Rapor P5.

#### 4.7.2 Penilaian Sikap & Karakter Islami

Sebagai sekolah di bawah yayasan Islam, penilaian karakter meliputi:

| Aspek | Cara Penilaian |
|---|---|
| Kedisiplinan ibadah | Absensi salat dhuha & tadarus (terhubung ke absensi ibadah) |
| Akhlak keseharian | Catatan guru wali kelas / BK |
| Kepemimpinan | Observasi guru |

Data ini muncul di bagian **Penilaian Sikap** pada rapor akademik.

---

### 4.8 Sertifikat & Portofolio Siswa

Modul ini berfungsi sebagai **arsip digital prestasi siswa**, bukan generator sertifikat.

**Yang bisa disimpan:**

```
Profil Siswa: Ahmad Fauzi — X IPA 1

Dokumen & Prestasi
─────────────────────────────────────────
📄 Sertifikat Tahfidz Juz 30         (upload: admin/guru)
🏆 Juara 1 Lomba MTQ Kabupaten       (upload: admin/guru)
⚽ Juara 2 Futsal Antar Sekolah      (upload: admin/guru)
📜 Sertifikat Pelatihan Kepemimpinan (upload: admin/guru)
```

**Siapa yang bisa upload:** Admin dan guru.
**Siapa yang bisa lihat:** Siswa yang bersangkutan, guru, admin.

Dokumen ini ikut masuk ke rekap profil siswa dan bisa dicetak bersama portofolio saat siswa lulus.

---

### 4.9 Pengumuman

Sistem pengumuman sederhana dengan targeting berdasarkan peran.

| Target | Contoh Pengumuman |
|---|---|
| Semua warga sekolah | Libur Idul Adha |
| Semua siswa | Jadwal ASAS Semester Ganjil |
| Kelas tertentu | Class Meeting kelas X |
| Guru tertentu | Rapat koordinasi wali kelas |

Pengumuman muncul di bagian atas dashboard sesuai target penerima.

---

## 5. Skema Database

Skema PostgreSQL (via Supabase) yang mencakup seluruh kebutuhan sistem.

### Tabel Utama

```sql
-- Tahun ajaran & semester
CREATE TABLE tahun_ajaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,           -- "2026/2027"
  aktif BOOLEAN DEFAULT false
);

CREATE TABLE semester (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tahun_ajaran_id UUID REFERENCES tahun_ajaran(id),
  tipe TEXT CHECK (tipe IN ('Ganjil', 'Genap')),
  aktif BOOLEAN DEFAULT false
);

-- Pengguna & peran
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nama TEXT NOT NULL,
  peran TEXT CHECK (peran IN ('admin', 'guru', 'siswa')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Kelas
CREATE TABLE kelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,           -- "X IPA 1"
  tahun_ajaran_id UUID REFERENCES tahun_ajaran(id),
  wali_kelas_id UUID REFERENCES users(id)
);

-- Mata pelajaran
CREATE TABLE mata_pelajaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  kode TEXT UNIQUE
);

-- Penugasan guru ke mapel & kelas
CREATE TABLE guru_mapel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID REFERENCES users(id),
  mapel_id UUID REFERENCES mata_pelajaran(id),
  kelas_id UUID REFERENCES kelas(id),
  semester_id UUID REFERENCES semester(id)
);

-- Enrollment siswa ke kelas
CREATE TABLE siswa_kelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID REFERENCES users(id),
  kelas_id UUID REFERENCES kelas(id),
  semester_id UUID REFERENCES semester(id)
);
```

### Tabel Akademik

```sql
-- Tujuan Pembelajaran (TP)
CREATE TABLE tujuan_pembelajaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mapel_id UUID REFERENCES mata_pelajaran(id),
  kode TEXT,                    -- "TP-MAT-01"
  deskripsi TEXT NOT NULL
);

-- Tugas
CREATE TABLE tugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_mapel_id UUID REFERENCES guru_mapel(id),
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tipe_asesmen TEXT CHECK (tipe_asesmen IN ('Formatif', 'Sumatif', 'ASAS', 'ASAT')),
  tp_id UUID REFERENCES tujuan_pembelajaran(id),
  deadline TIMESTAMPTZ,
  file_url TEXT
);

-- Pengumpulan tugas siswa
CREATE TABLE pengumpulan_tugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tugas_id UUID REFERENCES tugas(id),
  siswa_id UUID REFERENCES users(id),
  file_url TEXT,
  teks_jawaban TEXT,
  dikumpulkan_at TIMESTAMPTZ DEFAULT now(),
  nilai NUMERIC(5,2),
  feedback TEXT,
  dinilai_at TIMESTAMPTZ
);

-- Nilai langsung (non-tugas, misal nilai observasi)
CREATE TABLE nilai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID REFERENCES users(id),
  guru_mapel_id UUID REFERENCES guru_mapel(id),
  tp_id UUID REFERENCES tujuan_pembelajaran(id),
  tipe TEXT CHECK (tipe IN ('Formatif', 'Sumatif', 'ASAS', 'ASAT')),
  nilai NUMERIC(5,2) NOT NULL,
  catatan TEXT,
  tanggal DATE DEFAULT CURRENT_DATE
);
```

### Tabel Absensi & Karakter

```sql
-- Sesi absensi
CREATE TABLE sesi_absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_mapel_id UUID REFERENCES guru_mapel(id),
  tanggal DATE NOT NULL,
  dibuat_at TIMESTAMPTZ DEFAULT now()
);

-- Detail absensi per siswa
CREATE TABLE absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sesi_id UUID REFERENCES sesi_absensi(id),
  siswa_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('H', 'I', 'S', 'A')),
  keterangan TEXT
);

-- Absensi ibadah (opsional, khusus SMAM)
CREATE TABLE absensi_ibadah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID REFERENCES users(id),
  tanggal DATE NOT NULL,
  jenis TEXT CHECK (jenis IN ('Tadarus', 'Shalat_Dhuha', 'Shalat_Dzuhur')),
  hadir BOOLEAN DEFAULT false
);

-- Catatan sikap/karakter siswa
CREATE TABLE catatan_sikap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID REFERENCES users(id),
  guru_id UUID REFERENCES users(id),
  semester_id UUID REFERENCES semester(id),
  aspek TEXT,                   -- "Akhlak", "Kepemimpinan", dll
  deskripsi TEXT NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE
);
```

### Tabel Rapor & P5

```sql
-- Rapor akademik
CREATE TABLE rapor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID REFERENCES users(id),
  semester_id UUID REFERENCES semester(id),
  catatan_wali_kelas TEXT,
  deskripsi_sikap TEXT,
  persentase_kehadiran NUMERIC(5,2),
  status TEXT CHECK (status IN ('Draft', 'Final')) DEFAULT 'Draft',
  generated_at TIMESTAMPTZ
);

-- Nilai per mapel dalam rapor
CREATE TABLE rapor_mapel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rapor_id UUID REFERENCES rapor(id),
  mapel_id UUID REFERENCES mata_pelajaran(id),
  nilai_akhir NUMERIC(5,2),
  predikat TEXT,                -- "Baik", "Cukup", dll
  deskripsi_capaian TEXT
);

-- Rapor P5
CREATE TABLE rapor_p5 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID REFERENCES users(id),
  semester_id UUID REFERENCES semester(id),
  tema_projek TEXT,
  beriman_bertakwa TEXT,
  berkebinekaan_global TEXT,
  gotong_royong TEXT,
  mandiri TEXT,
  bernalar_kritis TEXT,
  kreatif TEXT,
  status TEXT CHECK (status IN ('Draft', 'Final')) DEFAULT 'Draft'
);

-- Sertifikat & portofolio
CREATE TABLE sertifikat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID REFERENCES users(id),
  judul TEXT NOT NULL,
  deskripsi TEXT,
  file_url TEXT,
  tanggal DATE,
  diupload_oleh UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. Alur Data End-to-End

```
[ADMIN]
  Buat Tahun Ajaran & Semester
  Buat Kelas → Assign Siswa
  Buat Mapel → Assign Guru
         ↓
[GURU] — Awal Semester
  Upload Materi per Tujuan Pembelajaran
  Buat Tugas (Formatif/Sumatif)
         ↓
[SISWA]
  Lihat Materi & Unduh
  Kumpulkan Tugas
         ↓
[GURU] — Penilaian
  Nilai Tugas → Simpan ke tabel nilai
  Isi Absensi Harian
  Isi Catatan Sikap
         ↓
[SISTEM] — Otomatis
  Hitung rata-rata nilai sumatif per TP
  Konversi ke predikat KKTP
  Hitung persentase kehadiran
         ↓
[GURU/WALI KELAS] — Akhir Semester
  Review rekap nilai & absensi
  Tambah deskripsi capaian per mapel
  Tambah catatan wali kelas
  Isi Rapor P5
         ↓
[ADMIN]
  Finalisasi & Generate Rapor PDF
  Cetak / Distribusi
```

---

## 7. Catatan Implementasi

### Prioritas Pengembangan (MVP)

Urutan fitur yang disarankan untuk dibangun terlebih dahulu:

```
Fase 1 (Wajib, ±6 minggu)
  ├── Auth & manajemen peran
  ├── Setup akademik (TA, semester, kelas, mapel, guru, siswa)
  ├── Modul Materi
  ├── Modul Tugas
  └── Modul Absensi

Fase 2 (Penting, ±4 minggu)
  ├── Modul Penilaian KKTP
  ├── Dashboard nilai & predikat siswa
  └── Rekap absensi otomatis

Fase 3 (Lengkap, ±4 minggu)
  ├── Generate Rapor + Export PDF
  ├── Rapor P5
  ├── Modul Sertifikat/Portofolio
  └── Penilaian Sikap & Karakter Islami
```

### Keamanan & Privasi Data

- Gunakan **Row Level Security (RLS)** Supabase di semua tabel sensitif
- Siswa hanya bisa `SELECT` data miliknya sendiri
- Guru hanya bisa `INSERT/UPDATE` di kelas yang mereka ampu
- File di Supabase Storage menggunakan signed URL dengan expiry
- Nilai dan rapor tidak boleh bisa diakses lintas semester tanpa izin admin

### Contoh RLS Policy (Absensi)

```sql
-- Siswa hanya lihat absensi miliknya
CREATE POLICY "siswa_lihat_absensi_sendiri"
ON absensi FOR SELECT
USING (siswa_id = auth.uid());

-- Guru hanya bisa isi absensi di kelas yang diampu
CREATE POLICY "guru_isi_absensi_kelasnya"
ON sesi_absensi FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM guru_mapel
    WHERE guru_id = auth.uid()
    AND id = guru_mapel_id
  )
);
```

### Skalabilitas

Sistem dirancang untuk ≤ 200 siswa. Pada skala ini, Supabase Free/Pro tier sudah cukup. Jika di masa depan ingin diperluas ke jaringan sekolah, arsitektur ini bisa di-*scale* dengan menambahkan kolom `sekolah_id` sebagai tenant identifier tanpa perubahan besar pada struktur yang ada.

---

*Dokumen ini adalah rancangan teknis dan dapat disesuaikan dengan kebutuhan spesifik SMAM Muslimin Cililin selama proses pengembangan.*
