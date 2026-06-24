# Analisis Pengembangan EduNexus LMS

Dokumen ini berisi analisis mendalam mengenai kesiapan sistem untuk tahap penyebaran (deploy) dan fungsionalitas fitur saat ini.

## Ringkasan Eksekutif
Sistem saat ini sudah memiliki **fondasi fungsional yang kuat** dengan integrasi data Supabase yang cukup komprehensif. Namun, sistem **BELUM SIAP untuk tahap deploy produksi** karena beberapa alasan keamanan dan fungsional yang kritis.

---

## 1. Kesiapan Deploy
> [!CAUTION]
> **Status: TIDAK SIAP (Not Production Ready)**
> Alasan utama adalah ketiadaan sistem Autentikasi (Login) yang sesungguhnya.

### Masalah Kritis:
- **Ketiadaan Autentikasi Riil**: Saat ini sistem menggunakan pemilih peran (Role Switcher) yang memungkinkan siapa pun beralih peran antara Siswa, Guru, dan Admin. Di lingkungan sekolah asli, ini akan menyebabkan kebocoran data nilai dan soal ujian.
- **Keamanan Data (RLS)**: Row Level Security di Supabase masih dinonaktifkan. Tanpa RLS dan Autentikasi, database dapat diakses oleh pihak luar secara langsung jika mereka mendapatkan URL dan Anon Key.
- **Infrastruktur Unggah File**: Fitur pengumpulan tugas belum memiliki sistem unggah berkas (Storage) yang nyata. Kebutuhan sekolah biasanya melibatkan pengumpulan dokumen PDF atau foto tugas.

---

## 2. Analisis Fungsionalitas (CRUD & Fitur)

### Fitur yang Sudah Baik (Siap Guna):
- **Dasbor Multi-Peran**: Tampilan sudah disesuaikan untuk Siswa, Guru, dan Admin.
- **Sistem Absensi (KBM & Ibadah)**: Sudah terintegrasi dengan database dan bisa dibuka/tutup oleh guru.
- **Manajemen Nilai**: Perhitungan nilai rapor akademik dan P5 sudah terdokumentasi dengan baik dalam tipe data dan schema.
- **Manajemen Admin**: Fitur impor massal siswa via CSV dan promosi kelas otomatis sangat membantu operasional sekolah.

### Kekurangan Fitur Penting (Functional Gaps):
1. **CRUD Mata Pelajaran & Kurikulum**: Admin belum memiliki UI untuk menambah/mengedit Mata Pelajaran atau Tujuan Pembelajaran (TP) secara dinamis. Saat ini masih banyak mengandalkan data awal (seed).
2. **Sistem Notifikasi Riil**: Notifikasi saat ini hanya bersifat lokal pada sesi browser tersebut. Perlu integrasi *Real-time Subscription* dari Supabase agar Guru mendapat notifikasi saat Siswa mengumpulkan tugas secara instan.
3. **Validasi Formulir**: Masih minim validasi pada input data (misal: NISN harus unik, tanggal deadline tidak boleh di masa lalu).
4. **Pengumuman**: Belum ada UI untuk Admin mengelola (Edit/Hapus) pengumuman yang sudah dipublish.

---

## 3. Hal yang Mengganggu Operasional Belajar
- **Sinkronisasi Data**: Karena sistem sangat mengandalkan state lokal yang di-refresh secara manual, ada risiko *race condition* jika dua guru mengedit nilai siswa yang sama secara bersamaan.
- **Role Switching UI**: Tombol "Ganti Peran" yang sangat mencolok di header sangat mengganggu pengalaman pengguna asli dan berisiko salah klik oleh pengguna awam.
- **Pesan Error**: Jika koneksi Supabase terputus, aplikasi hanya menampilkan pesan error di konsol. Perlu UI khusus (Error Boundary) agar user tidak bingung dengan layar putih/stuck.

---

## Rekomendasi Langkah Selanjutnya

1. **Implementasi Supabase Auth**: Ganti role switcher dengan sistem login (Email/NISN).
2. **Setup Supabase Storage**: Implementasi fitur unggah file asli untuk Materi dan pengumpulan Tugas.
3. **Aktifkan RLS**: Batasi akses data berdasarkan `user_id` di setiap tabel.
4. **UI CRUD Mapel**: Tambahkan menu bagi Admin untuk mengelola daftar Mata Pelajaran per kelas.
5. **Real-time State Update**: Gunakan `supabase.channel()` untuk memantau perubahan data tanpa perlu refresh manual.
