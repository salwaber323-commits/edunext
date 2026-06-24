export type UserRole = 'siswa' | 'guru' | 'admin' | 'osis';

export interface User {
  id: string;
  nama: string;
  role: UserRole;
  nisnOrNip?: string;
  kelasId?: string; // Untuk siswa
  avatar?: string;
}

export interface Kelas {
  id: string;
  nama: string;
  jumlahSiswa: number;
}

export interface MataPelajaran {
  id: string;
  nama: string;
  jadwalHari: string;
  jadwalWaktu: string;
  kelasId: string;
}

export interface TujuanPembelajaran {
  id: string;
  mapelId: string;
  kode: string; // e.g. "TP-MAT-01"
  deskripsi: string;
}

export interface Materi {
  id: string;
  kelasId: string;
  mapelId: string;
  mapelNama: string;
  judul: string;
  deskripsi: string;
  tipe: 'pdf' | 'video' | 'link';
  url: string;
  tanggalInput: string;
}

export interface Tugas {
  id: string;
  kelasId: string;
  mapelId: string;
  mapelNama: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  tpId?: string; // ID Tujuan Pembelajaran
  tipeAsesmen: 'Formatif' | 'Sumatif' | 'ASAS' | 'ASAT';
}

export interface PengumpulanTugas {
  id: string;
  tugasId: string;
  siswaId: string;
  tanggalKumpul: string;
  fileName?: string;
  textAnswer?: string;
  nilai?: number;
  status: 'Belum' | 'Sudah';
  feedback?: string;
}

export interface AbsensiPertemuan {
  id: string;
  kelasId: string;
  mapelId: string;
  mapelNama: string;
  tanggal: string;
  isTerbuka: boolean;
  kehadiran: { [siswaId: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' };
}

export interface AbsensiIbadah {
  id: string;
  siswaId: string;
  tanggal: string;
  tadarus: boolean;
  dhuha: boolean;
  dzuhur: boolean;
}

export interface NilaiSiswa {
  id: string;
  siswaId: string;
  siswaNama: string;
  mapelId: string;
  mapelNama: string;
  tugas1: number; // Disimpan sebagai sumatif 1
  tugas2: number; // Disimpan sebagai sumatif 2
  uts: number; // Disimpan sebagai ASAS
  uas: number; // Disimpan sebagai ASAT
  nilaiAkhir: number;
}

export interface RaporP5 {
  id: string;
  siswaId: string;
  semesterId: string; // Ganjil / Genap
  temaProjek: string;
  berimanBertakwa: 'MB' | 'SB' | 'BSH' | 'SAB'; // Mulai Berkembang, Sedang Berkembang, Berkembang Sesuai Harapan, Sangat Berkembang
  berimanBertakwaDesc: string;
  berkebinekaanGlobal: 'MB' | 'SB' | 'BSH' | 'SAB';
  berkebinekaanGlobalDesc: string;
  gotongRoyong: 'MB' | 'SB' | 'BSH' | 'SAB';
  gotongRoyongDesc: string;
  mandiri: 'MB' | 'SB' | 'BSH' | 'SAB';
  mandiriDesc: string;
  bernalarKritis: 'MB' | 'SB' | 'BSH' | 'SAB';
  bernalarKritisDesc: string;
  kreatif: 'MB' | 'SB' | 'BSH' | 'SAB';
  kreatifDesc: string;
  status: 'Draft' | 'Final';
}

export interface Sertifikat {
  id: string;
  siswaId: string;
  judul: string;
  tahun: string;
  penerbit: string;
  tipe: 'Sertifikat' | 'Prestasi';
}

export interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  kategori: 'Lomba' | 'Acara' | 'Hari Besar' | 'Ujian';
  lokasi?: string;
}

export interface PendaftaranKegiatan {
  id: string;
  kegiatanId: string;
  siswaId: string;
}

export interface Ekstrakurikuler {
  id: string;
  nama: string;
  pembina: string;
  deskripsi: string;
  jadwal: string;
  logoUrl?: string;
  jumlahAnggota?: number;
}

export interface AnggotaEkskul {
  id: string;
  ekskulId: string;
  siswaId: string;
}

export interface Announcement {
  id: string;
  judul: string;
  konten: string;
  tanggal: string;
  pengirim: string;
  kategori: 'Penting' | 'Akademik' | 'Kegiatan';
}

