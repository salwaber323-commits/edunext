import { User, Kelas, MataPelajaran, Materi, Tugas, PengumpulanTugas, AbsensiPertemuan, NilaiSiswa, Sertifikat, TujuanPembelajaran, AbsensiIbadah, RaporP5 } from './types';

export const initialUsers: User[] = [
  {
    id: 'siswa_ahmad',
    nama: 'Ahmad Rafid',
    role: 'siswa',
    nisnOrNip: '122304958',
    kelasId: 'kelas_x_ipa_1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'siswa_andi',
    nama: 'Andi Wijaya',
    role: 'siswa',
    nisnOrNip: '122304950',
    kelasId: 'kelas_x_ipa_1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'siswa_budi_s',
    nama: 'Budi Setiawan',
    role: 'siswa',
    nisnOrNip: '122304951',
    kelasId: 'kelas_x_ipa_1',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'siswa_cici',
    nama: 'Cici Amelia',
    role: 'siswa',
    nisnOrNip: '122304952',
    kelasId: 'kelas_x_ipa_1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'guru_budi',
    nama: 'Pak Budi Hartono, S.Pd.',
    role: 'guru',
    nisnOrNip: '198504122010011003',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'admin_siti',
    nama: 'Ibu Siti Khadijah, M.Pd.',
    role: 'admin',
    nisnOrNip: '197908222005022001',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  }
];

export const initialKelas: Kelas[] = [
  { id: 'kelas_x_ipa_1', nama: 'X IPA 1', jumlahSiswa: 32 },
  { id: 'kelas_xi_ipa_2', nama: 'XI IPA 2', jumlahSiswa: 29 },
];

export const initialMapel: MataPelajaran[] = [
  {
    id: 'mapel_matematika',
    nama: 'Matematika',
    jadwalHari: 'Hari Ini',
    jadwalWaktu: '07.00 - 08.30',
    kelasId: 'kelas_x_ipa_1',
  },
  {
    id: 'mapel_indonesia',
    nama: 'Bahasa Indonesia',
    jadwalHari: 'Hari Ini',
    jadwalWaktu: '08.30 - 10.00',
    kelasId: 'kelas_x_ipa_1',
  },
  {
    id: 'mapel_fisika',
    nama: 'Fisika',
    jadwalHari: 'Kamis',
    jadwalWaktu: '10.15 - 12.00',
    kelasId: 'kelas_x_ipa_1',
  },
];

export const initialMateri: Materi[] = [
  {
    id: 'materi_1',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    judul: 'Bab 1: Persamaan Linear Satu Variabel',
    deskripsi: 'Memahami dasar-dasar persamaan linear, cara menyelesaikan pertidaksamaan, serta penerapan dalam masalah kontekstual.',
    tipe: 'pdf',
    url: 'Modul_Persamaan_Linear.pdf',
    tanggalInput: '2026-06-01',
  },
  {
    id: 'materi_2',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    judul: 'Bab 2: Persamaan Kuadrat dan Fungsi Kuadrat',
    deskripsi: 'Video pembahasan tentang menentukan akar-akar persamaan kuadrat menggunakan metode pemfaktoran dan rumus ABC.',
    tipe: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tanggalInput: '2026-06-08',
  },
  {
    id: 'materi_3',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_fisika',
    mapelNama: 'Fisika',
    judul: 'Bab 1: Gerak Newton & Pembahasan Soal',
    deskripsi: 'Membahas Hukum I, II, dan III Newton mengenai gerak serta implementasi gaya gesek dan inersia.',
    tipe: 'pdf',
    url: 'Modul_Fisika_Newton.pdf',
    tanggalInput: '2026-06-03',
  },
  {
    id: 'materi_4',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_indonesia',
    mapelNama: 'Bahasa Indonesia',
    judul: 'Bab 1: Menulis Teks Laporan Hasil Observasi',
    deskripsi: 'Struktur kebahasaan teks laporan hasil observasi beserta contoh analisis objek wisata lokal.',
    tipe: 'link',
    url: 'https://direktorat-sma.kemdikbud.go.id',
    tanggalInput: '2026-06-05',
  }
];

export const initialTugas: Tugas[] = [
  {
    id: 'tugas_1',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    judul: 'Persamaan Kuadrat Mandiri',
    deskripsi: 'Kerjakan soal halaman 45 No 1-10 di buku latihan. Foto dan upload jawaban Anda dalam bentuk PDF atau gambar.',
    deadline: '2026-06-12', // 2 hari lagi dari 10 Juni 2026
    tipeAsesmen: 'Sumatif',
    tpId: 'tp_mat_01'
  },
  {
    id: 'tugas_2',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_fisika',
    mapelNama: 'Fisika',
    judul: 'Analisis Gerak Newton di Lingkungan Rumah',
    deskripsi: 'Identifikasi dan tuliskan minimal 3 contoh penerapan Hukum Newton dalam aktivitas sehari-hari di rumah Anda.',
    deadline: '2026-06-15', // 5 hari lagi dari 10 Juni 2026
    tipeAsesmen: 'Formatif',
    tpId: 'tp_fis_01'
  },
];

export const initialPengumpulanTugas: PengumpulanTugas[] = [
  {
    id: 'pengumpulan_1',
    tugasId: 'tugas_1',
    siswaId: 'siswa_ahmad',
    tanggalKumpul: '2026-06-09',
    fileName: 'Ahmad_Persamaan_Kuadrat.pdf',
    textAnswer: 'Saya telah menyelesaikan tugas halaman 45. Ada beberapa rumus ABC yang sangat membantu di bab ini.',
    nilai: 92,
    status: 'Sudah',
  },
  {
    id: 'pengumpulan_2',
    tugasId: 'tugas_2',
    siswaId: 'siswa_ahmad',
    tanggalKumpul: '',
    status: 'Belum',
  },
  // Data pengumpulan siswa lain untuk tampilan guru
  {
    id: 'pengumpulan_3',
    tugasId: 'tugas_1',
    siswaId: 'siswa_andi',
    tanggalKumpul: '2026-06-09',
    fileName: 'Andi_Kerap_MTK.pdf',
    nilai: 85,
    status: 'Sudah',
  },
  {
    id: 'pengumpulan_4',
    tugasId: 'tugas_1',
    siswaId: 'siswa_budi_s',
    tanggalKumpul: '2026-06-10',
    fileName: 'BudiSetiawan_MTK1.pdf',
    nilai: 80,
    status: 'Sudah',
  },
  {
    id: 'pengumpulan_5',
    tugasId: 'tugas_1',
    siswaId: 'siswa_cici',
    tanggalKumpul: '',
    status: 'Belum',
  },
];

export const initialAbsensiPertemuan: AbsensiPertemuan[] = [
  {
    id: 'absen_1',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    tanggal: '2026-06-10',
    isTerbuka: true,
    kehadiran: {
      'siswa_andi': 'Hadir',
      'siswa_budi_s': 'Hadir',
      'siswa_cici': 'Izin',
    },
  },
  {
    id: 'absen_2',
    kelasId: 'kelas_x_ipa_1',
    mapelId: 'mapel_indonesia',
    mapelNama: 'Bahasa Indonesia',
    tanggal: '2026-06-10',
    isTerbuka: false,
    kehadiran: {
      'siswa_ahmad': 'Hadir',
      'siswa_andi': 'Hadir',
      'siswa_budi_s': 'Hadir',
      'siswa_cici': 'Hadir',
    }
  }
];

export const initialNilaiSiswa: NilaiSiswa[] = [
  {
    id: 'nilai_ahmad_mtk',
    siswaId: 'siswa_ahmad',
    siswaNama: 'Ahmad Rafid',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    tugas1: 90,
    tugas2: 95,
    uts: 88,
    uas: 92,
    nilaiAkhir: 91,
  },
  {
    id: 'nilai_andi_mtk',
    siswaId: 'siswa_andi',
    siswaNama: 'Andi Wijaya',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    tugas1: 85,
    tugas2: 80,
    uts: 78,
    uas: 82,
    nilaiAkhir: 81,
  },
  {
    id: 'nilai_budi_mtk',
    siswaId: 'siswa_budi_s',
    siswaNama: 'Budi Setiawan',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    tugas1: 80,
    tugas2: 85,
    uts: 75,
    uas: 80,
    nilaiAkhir: 79,
  },
  {
    id: 'nilai_cici_mtk',
    siswaId: 'siswa_cici',
    siswaNama: 'Cici Amelia',
    mapelId: 'mapel_matematika',
    mapelNama: 'Matematika',
    tugas1: 95,
    tugas2: 90,
    uts: 92,
    uas: 96,
    nilaiAkhir: 94,
  }
];

export const initialSertifikat: Sertifikat[] = [
  {
    id: 'sert_1',
    siswaId: 'siswa_ahmad',
    judul: 'Juara 1 Lomba Poster Lingkungan Sekolah',
    tahun: '2025',
    penerbit: 'Dinas Pendidikan & Kebudayaan Kota',
    tipe: 'Prestasi',
  },
  {
    id: 'sert_2',
    siswaId: 'siswa_ahmad',
    judul: 'Sertifikat Tahfidz Al-Qur\'an Juz 30',
    tahun: '2026',
    penerbit: 'LTQ At-Taqwa Sekolah',
    tipe: 'Sertifikat',
  },
];

export const initialTujuanPembelajaran: TujuanPembelajaran[] = [
  {
    id: 'tp_mat_01',
    mapelId: 'mapel_matematika',
    kode: 'TP-MAT-01',
    deskripsi: 'Memecahkan masalah yang berkaitan dengan persamaan kuadrat dan akar-akarnya.'
  },
  {
    id: 'tp_mat_02',
    mapelId: 'mapel_matematika',
    kode: 'TP-MAT-02',
    deskripsi: 'Menganalisis karakteristik grafik fungsi kuadrat dan perubahannya.'
  },
  {
    id: 'tp_fis_01',
    mapelId: 'mapel_fisika',
    kode: 'TP-FIS-01',
    deskripsi: 'Menganalisis besaran-besaran fisis pada gerak lurus dengan kecepatan konstan dan percepatan konstan.'
  },
  {
    id: 'tp_ind_01',
    mapelId: 'mapel_indonesia',
    kode: 'TP-IND-01',
    deskripsi: 'Mengevaluasi informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari teks laporan hasil observasi.'
  }
];

export const initialAbsensiIbadah: AbsensiIbadah[] = [
  {
    id: 'ibadah_1',
    siswaId: 'siswa_ahmad',
    tanggal: '2026-06-10',
    tadarus: true,
    dhuha: true,
    dzuhur: true
  },
  {
    id: 'ibadah_2',
    siswaId: 'siswa_andi',
    tanggal: '2026-06-10',
    tadarus: true,
    dhuha: false,
    dzuhur: true
  },
  {
    id: 'ibadah_3',
    siswaId: 'siswa_budi_s',
    tanggal: '2026-06-10',
    tadarus: true,
    dhuha: true,
    dzuhur: true
  },
  {
    id: 'ibadah_4',
    siswaId: 'siswa_cici',
    tanggal: '2026-06-10',
    tadarus: false,
    dhuha: true,
    dzuhur: false
  }
];

export const initialRaporP5: RaporP5[] = [
  {
    id: 'p5_ahmad',
    siswaId: 'siswa_ahmad',
    semesterId: 'Ganjil',
    temaProjek: 'Kewirausahaan Hijau: Pemanfaatan Sampah Organik Cililin',
    berimanBertakwa: 'SAB',
    berimanBertakwaDesc: 'Ahmad menunjukkan akhlak yang sangat mulia terhadap alam dengan aktif mengelola kebersihan lingkungan selama projek.',
    berkebinekaanGlobal: 'BSH',
    berkebinekaanGlobalDesc: 'Menunjukkan sikap terbuka terhadap berbagai gagasan dari teman sekelompok yang berbeda latar belakang.',
    gotongRoyong: 'SAB',
    gotongRoyongDesc: 'Sangat aktif berkolaborasi dan membantu teman kelompok yang kesulitan menyelesaikan infografis projek.',
    mandiri: 'BSH',
    mandiriDesc: 'Mampu menyusun rencana kerja pribadi dan melaksanakannya dengan tenggat waktu yang ketat tanpa pengawasan ketat.',
    bernalarKritis: 'SAB',
    bernalarKritisDesc: 'Secara mandiri mampu mengidentifikasi hambatan pengomposan sampah dan memberikan solusi kreatif.',
    kreatif: 'BSH',
    kreatifDesc: 'Menghasilkan desain kemasan pupuk organik yang menarik dan informatif memanfaatkan bahan ramah lingkungan.',
    status: 'Final'
  }
];

