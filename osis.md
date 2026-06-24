
Kalau saya yang mengembangkan untuk SMAM Cililin, saya akan membuat role OSIS seperti ini:

```text
Admin
Guru
Wali Kelas
Siswa
OSIS
```

Tanpa MPK, Pembina, Surat Digital, Proposal Workflow, dan fitur birokrasi lainnya di versi awal.

---

# OSIS (Spesifikasi) — Sinkron dengan Pengembangan yang Sudah Ada

Dokumen ini menyetel deskripsi fitur OSIS agar **sinkron dengan schema/database dan komponen yang sudah terpasang** di repo.

## Peran OSIS di sistem
- OSIS adalah role di `profiles.role` dengan nilai: **`osis`**.
- Halaman OSIS yang dipakai aplikasi: `src/components/DashboardOSIS.tsx`.

## Data utama yang dipakai OSIS (tanpa konflik)
- **Kalender / Agenda OSIS**: tabel `kegiatan`
- **Pendaftaran peserta kegiatan**: tabel `pendaftaran_kegiatan`
- **Pengumuman OSIS**: tabel `announcements`
- **Ekskul**: tabel `ekstrakurikuler` dan `anggota_ekskul`
- **Sertifikat/Prestasi siswa**: tabel `sertifikat` (portofolio), *upload saat ini berada di modul profil/portofolio siswa, bukan modul OSIS yang terpisah*

---

# Yang Benar-Benar Berguna (MVP OSIS sesuai sistem berjalan)


## 1. Pengumuman (OSIS → Dashboard Siswa)

Di sistem saat ini, “pengumuman OSIS” ditulis ke tabel `announcements`.

Catatan sinkronisasi: UI siswa mengambil data dari tabel `announcements` (bukan tabel OSIS terpisah), sehingga OSIS tidak perlu workflow birokrasi lain untuk muncul di dashboard.

Saat ini biasanya:


```text
Guru
↓
Wali Kelas
↓
Grup WA
↓
Siswa
```

Informasi sering terlambat.

OSIS bisa membuat:

```text
Pengumuman

Class Meeting
Lomba Poster
Hari Guru
Bakti Sosial
```

Muncul di dashboard siswa.

---

## 2. Kalender Kegiatan

Ini menurut saya fitur paling penting untuk OSIS.

Menu:

```text
Kalender Sekolah
```

Berisi:

```text
17 Agustus
Maulid Nabi
Class Meeting
Pentas Seni
Ujian Tengah Semester
```

Semua siswa bisa melihat.

---

## 3. Pendaftaran Kegiatan (tanpa konflik)

Di sistem, pendaftaran OSIS tersimpan ke tabel `pendaftaran_kegiatan`.

Anti-konflik (penting): tabel sudah punya constraint `unique(kegiatan_id, siswa_id)`, sehingga siswa tidak bisa terdaftar dobel untuk kegiatan yang sama.

OSIS membuat:


```text
Lomba Mobile Legends
```

atau

```text
Lomba Futsal
```

Siswa cukup klik:

```text
[ Daftar ]
```

Data peserta otomatis masuk.

Tidak perlu Google Form.

---

## 4. Ekstrakurikuler (OSIS → join siswa)

Di sistem, “manajemen ekskul” memakai:
- tabel `ekstrakurikuler` (data ekskul)
- tabel `anggota_ekskul` (relasi siswa ↔ ekskul)

Catatan sinkronisasi: untuk versi awal, OSIS memakai role `osis` dan UI sudah menampilkan ekskul; aksi anggota/pendaftaran ekskul tersimpan via mekanisme join ke `anggota_ekskul`.

Karena data siswa sudah ada.


OSIS atau pembina bisa melihat:

```text
Pramuka
30 Anggota

PMR
25 Anggota

Rohis
40 Anggota
```

Siswa bisa mendaftar ekskul dari sistem.

---

## 6. Catatan fitur “VERIFIKASI” di pendaftaran kegiatan

Di UI OSIS saat ini, tombol **VERIFIKASI** ada pada modal detail pendaftar, tetapi implementasi backend proses verifikasi belum dijelaskan di sistem dokumen ini.

Agar tidak konflik pengembangan, prinsip sinkronnya:
- Data pendaftaran masuk ke `pendaftaran_kegiatan` (yang sudah punya constraint unique).
- OSIS cukup mengelola status/konten verifikasi nanti (mis. field status verifikasi) jika memang diperlukan.
- Di versi awal, verifikasi dapat dianggap “informasi tampilan” dulu, bukan mekanisme birokrasi tambahan.

---

## 5. Sertifikat / Prestasi (sinkron dengan sistem saat ini)


Di sistem, dokumen sertifikat tersimpan ke tabel `sertifikat` dan tampil sebagai bagian **portofolio/prestasi digital siswa**.

Catatan sinkronisasi penting:
- UI upload sertifikat saat ini dipakai lewat komponen `ProfilDigital` (di `activeTab === 'profil'`).
- Dashboard OSIS saat ini **belum dihubungkan** sebagai tempat upload sertifikat terpisah.

Ini yang menurut saya paling nyambung dengan LMS yang kita rancang.


Misalnya:

```text
Peserta Lomba
Panitia Acara
Anggota Ekskul
```

OSIS atau admin bisa upload:

```text
Sertifikat.pdf
```

langsung masuk ke profil siswa.

---

#
---

# Integrasi dengan LMS (konsisten dengan implementasi)


Dashboard siswa:

```text
Hari Ini
Tugas
Absensi

----------------

Kegiatan Mendatang

Class Meeting
2 Hari Lagi

Pentas Seni
7 Hari Lagi
```

Profil siswa:

```text
Nilai

Absensi

Sertifikat

Kegiatan
```

Jadi OSIS tidak terasa sebagai aplikasi terpisah.

---

# Nilai Jual yang Sebenarnya

Kalau dijual ke sekolah, saya melihat fitur yang paling berguna adalah:

### Akademik

* Materi
* Tugas
* Absensi
* Nilai
* Rapor

### Kesiswaan

* Pengumuman
* Kalender Kegiatan
* Pendaftaran Kegiatan
* Ekskul
* Sertifikat

Karena semua fitur itu menggunakan data siswa yang sama dan tidak menambah beban kerja admin maupun guru. OSIS cukup menjadi pihak yang mengelola kegiatan siswa, bukan sistem organisasi yang rumit.
