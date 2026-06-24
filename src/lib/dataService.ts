import { supabase } from './supabase';
import { 
  User, Kelas, MataPelajaran, Materi, Tugas, 
  PengumpulanTugas, AbsensiPertemuan, NilaiSiswa, 
  Sertifikat, RaporP5, AbsensiIbadah, UserRole,
  Kegiatan, PendaftaranKegiatan, Ekstrakurikuler, AnggotaEkskul
} from '../types';

export const dataService = {
  // --- USERS / PROFILES ---
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data.map(u => ({
      id: u.id,
      nama: u.nama,
      role: u.role as UserRole,
      nisnOrNip: u.nisn_nip,
      kelasId: u.kelas_id,
      avatar: u.avatar_url
    }));
  },

  async addUser(user: any) {
    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      nama: user.nama,
      role: user.role,
      nisn_nip: user.nisn_nip || user.nisnOrNip,
      kelas_id: user.kelas_id || user.kelasId,
      avatar_url: user.avatar_url || user.avatar
    });
    if (error) throw error;
  },

  async updateUserKelas(userId: string, kelasId: string) {
    const { error } = await supabase.from('profiles').update({ kelas_id: kelasId }).eq('id', userId);
    if (error) throw error;
  },

  async upsertUser(user: User) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        nama: user.nama,
        role: user.role,
        nisn_nip: user.nisnOrNip,
        kelas_id: user.kelasId,
        avatar_url: user.avatar
      });
    if (error) throw error;
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (error) throw error;
  },

  // --- KELAS ---
  async getKelas(): Promise<Kelas[]> {
    const { data, error } = await supabase
      .from('kelas')
      .select(`
        *,
        profiles(id)
      `);
    if (error) throw error;
    return data.map(k => ({
      id: k.id,
      nama: k.nama,
      jumlahSiswa: k.profiles ? k.profiles.length : 0
    }));
  },

  async upsertKelas(kelas: Kelas, tahunAjaran: string, semester: string) {
    const { error } = await supabase
      .from('kelas')
      .upsert({
        id: kelas.id,
        nama: kelas.nama,
        tahun_ajaran: tahunAjaran,
        semester: semester
      });
    if (error) throw error;
  },

  async deleteKelas(kelasId: string) {
    const { error } = await supabase
      .from('kelas')
      .delete()
      .eq('id', kelasId);
    if (error) throw error;
  },

  // --- MATERI ---
  async getMateri(): Promise<Materi[]> {
    const { data, error } = await supabase
      .from('materi')
      .select(`
        *,
        mata_pelajaran(nama)
      `);
    if (error) throw error;
    return data.map(m => ({
      id: m.id,
      kelasId: m.kelas_id,
      mapelId: m.mapel_id,
      mapelNama: m.mata_pelajaran?.nama || 'Unknown',
      judul: m.judul,
      deskripsi: m.deskripsi,
      tipe: m.tipe as any,
      url: m.url,
      tanggalInput: m.tanggal_input
    }));
  },

  async addMateri(materi: Omit<Materi, 'id' | 'tanggalInput'>) {
    const { error } = await supabase
      .from('materi')
      .insert({
        id: `materi_${Date.now()}`,
        kelas_id: materi.kelasId,
        mapel_id: materi.mapelId,
        judul: materi.judul,
        deskripsi: materi.deskripsi,
        tipe: materi.tipe,
        url: materi.url
      });
    if (error) throw error;
  },

  // --- TUGAS ---
  async getTugas(): Promise<Tugas[]> {
    const { data, error } = await supabase
      .from('tugas')
      .select(`
        *,
        mata_pelajaran(nama)
      `);
    if (error) throw error;
    return data.map(t => ({
      id: t.id,
      kelasId: t.kelas_id,
      mapelId: t.mapel_id,
      mapelNama: t.mata_pelajaran?.nama || 'Unknown',
      judul: t.judul,
      deskripsi: t.deskripsi,
      deadline: t.deadline,
      tpId: t.tp_id,
      tipeAsesmen: t.tipe_asesmen as any
    }));
  },

  async addTugas(tugas: Omit<Tugas, 'id'>) {
    const { error } = await supabase
      .from('tugas')
      .insert({
        id: `tugas_${Date.now()}`,
        kelas_id: tugas.kelasId,
        mapel_id: tugas.mapelId,
        judul: tugas.judul,
        deskripsi: tugas.deskripsi,
        deadline: tugas.deadline,
        tp_id: tugas.tpId,
        tipe_asesmen: tugas.tipeAsesmen
      });
    if (error) throw error;
  },

  // --- PENGUMPULAN TUGAS ---
  async getPengumpulan(): Promise<PengumpulanTugas[]> {
    const { data, error } = await supabase
      .from('pengumpulan_tugas')
      .select('*');
    if (error) throw error;
    return data.map(p => ({
      id: p.id,
      tugasId: p.tugas_id,
      siswaId: p.siswa_id,
      tanggalKumpul: p.tanggal_kumpul || '',
      fileName: p.file_name,
      textAnswer: p.text_answer,
      nilai: p.nilai,
      status: p.status as any,
      feedback: p.feedback
    }));
  },

  async submitTugas(tugasId: string, siswaId: string, fileName: string, textAnswer: string) {
    const { error } = await supabase
      .from('pengumpulan_tugas')
      .upsert({
        id: `peng_${siswaId}_${tugasId}`,
        tugas_id: tugasId,
        siswa_id: siswaId,
        tanggal_kumpul: new Date().toISOString(),
        file_name: fileName,
        text_answer: textAnswer,
        status: 'Sudah'
      });
    if (error) throw error;
  },

  async updateGrade(pengumpulanId: string, nilai: number) {
    const { error } = await supabase
      .from('pengumpulan_tugas')
      .update({ nilai })
      .eq('id', pengumpulanId);
    if (error) throw error;
  },

  // --- ABSENSI ---
  async getAbsensi(): Promise<AbsensiPertemuan[]> {
    const { data, error } = await supabase
      .from('absensi_pertemuan')
      .select(`
        *,
        mata_pelajaran(nama),
        absensi_kehadiran(*)
      `);
    if (error) throw error;
    return data.map(m => {
      const kehadiran: { [siswaId: string]: any } = {};
      m.absensi_kehadiran?.forEach((h: any) => {
        kehadiran[h.siswa_id] = h.status;
      });
      return {
        id: m.id,
        kelasId: m.kelas_id,
        mapelId: m.mapel_id,
        mapelNama: m.mata_pelajaran?.nama || 'Unknown',
        tanggal: m.tanggal,
        isTerbuka: m.is_terbuka,
        kehadiran
      };
    });
  },

  async openAbsensi(kelasId: string, mapelId: string, mapelNama: string, tanggal: string) {
    const { error } = await supabase
      .from('absensi_pertemuan')
      .insert({
        id: `absen_${Date.now()}`,
        kelas_id: kelasId,
        mapel_id: mapelId,
        tanggal: tanggal,
        is_terbuka: true
      });
    if (error) throw error;
  },

  async toggleAbsensi(id: string, isOpen: boolean) {
    const { error } = await supabase
      .from('absensi_pertemuan')
      .update({ is_terbuka: isOpen })
      .eq('id', id);
    if (error) throw error;
  },

  async updateKehadiran(pertemuanId: string, siswaId: string, status: string) {
    const { error } = await supabase
      .from('absensi_kehadiran')
      .upsert({
        pertemuan_id: pertemuanId,
        siswa_id: siswaId,
        status: status
      });
    if (error) throw error;
  },

  // --- NILAI RAPOR ---
  async getNilaiSiswa(): Promise<NilaiSiswa[]> {
    const { data, error } = await supabase
      .from('nilai_siswa')
      .select(`
        *,
        profiles(nama),
        mata_pelajaran(nama)
      `);
    if (error) throw error;
    return data.map(n => ({
      id: n.id,
      siswaId: n.siswa_id,
      siswaNama: n.profiles?.nama || 'Unknown',
      mapelId: n.mapel_id,
      mapelNama: n.mata_pelajaran?.nama || 'Unknown',
      tugas1: n.tugas1,
      tugas2: n.tugas2,
      uts: n.uts,
      uas: n.uas,
      nilaiAkhir: n.nilai_akhir
    }));
  },

  async upsertNilaiSiswa(nilai: NilaiSiswa) {
    const { error } = await supabase
      .from('nilai_siswa')
      .upsert({
        id: nilai.id,
        siswa_id: nilai.siswaId,
        mapel_id: nilai.mapelId,
        tugas1: nilai.tugas1,
        tugas2: nilai.tugas2,
        uts: nilai.uts,
        uas: nilai.uas,
        nilai_akhir: nilai.nilaiAkhir
      });
    if (error) throw error;
  },

  // --- SERTIFIKAT ---
  async getSertifikat(): Promise<Sertifikat[]> {
    const { data, error } = await supabase
      .from('sertifikat')
      .select('*');
    if (error) throw error;
    return data.map(s => ({
      id: s.id,
      siswaId: s.siswa_id,
      judul: s.judul,
      tahun: s.tahun,
      penerbit: s.penerbit,
      tipe: s.tipe as any
    }));
  },

  async addSertifikat(sert: Omit<Sertifikat, 'id'>) {
    const { error } = await supabase
      .from('sertifikat')
      .insert({
        id: `sert_${Date.now()}`,
        siswa_id: sert.siswaId,
        judul: sert.judul,
        tahun: sert.tahun,
        penerbit: sert.penerbit,
        tipe: sert.tipe
      });
    if (error) throw error;
  },

  async deleteSertifikat(id: string) {
    const { error } = await supabase
      .from('sertifikat')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- RAPOR P5 ---
  async getRaporP5(): Promise<RaporP5[]> {
    const { data, error } = await supabase
      .from('rapor_p5')
      .select('*');
    if (error) throw error;
    return data.map(r => ({
      id: r.id,
      siswaId: r.siswa_id,
      semesterId: r.semester_id,
      temaProjek: r.tema_projek,
      berimanBertakwa: r.beriman_bertakwa,
      berimanBertakwaDesc: r.beriman_bertakwa_desc,
      berkebinekaanGlobal: r.berkebinekaan_global,
      berkebinekaanGlobalDesc: r.berkebinekaan_global_desc,
      gotongRoyong: r.gotong_royong,
      gotongRoyongDesc: r.gotong_royong_desc,
      mandiri: r.mandiri,
      mandiriDesc: r.mandiri_desc,
      bernalarKritis: r.bernalar_kritis,
      bernalarKritisDesc: r.bernalar_kritis_desc,
      kreatif: r.kreatif,
      kreatifDesc: r.kreatif_desc,
      status: r.status as any
    }));
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<any[]> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addAnnouncement(ann: any) {
    const { error } = await supabase
      .from('announcements')
      .insert({
        id: ann.id,
        judul: ann.judul,
        konten: ann.konten,
        tanggal: ann.tanggal,
        pengirim: ann.pengirim,
        kategori: ann.kategori
      });
    if (error) throw error;
  },

  // --- SETTINGS ---
  async getSettings(): Promise<{ [key: string]: string }> {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    const settings: { [key: string]: string } = {};
    data.forEach(s => {
      settings[s.key] = s.value;
    });
    return settings;
  },

  async updateSetting(key: string, value: string) {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  },

  // --- MAINTENANCE / RESET ---
  async resetSemester() {
    // In a real app, you might archive these instead of deleting
    const { error: err1 } = await supabase.from('absensi_pertemuan').delete().neq('id', '');
    const { error: err2 } = await supabase.from('pengumpulan_tugas').delete().neq('id', '');
    if (err1 || err2) throw err1 || err2;
  },

  // --- KEGIATAN (EVENTS) ---
  async getKegiatan(): Promise<Kegiatan[]> {
    const { data, error } = await supabase.from('kegiatan').select('*').order('tanggal', { ascending: true });
    if (error) throw error;
    return data;
  },

  async addKegiatan(keg: Omit<Kegiatan, 'id'>) {
    const { error } = await supabase.from('kegiatan').insert({
      id: `keg_${Date.now()}`,
      ...keg
    });
    if (error) throw error;
  },

  async deleteKegiatan(id: string) {
    const { error } = await supabase.from('kegiatan').delete().eq('id', id);
    if (error) throw error;
  },

  async registerKegiatan(kegiatanId: string, siswaId: string) {
    const { error } = await supabase.from('pendaftaran_kegiatan').upsert({ kegiatan_id: kegiatanId, siswa_id: siswaId });
    if (error) throw error;
  },

  async getPendaftaranKegiatan(): Promise<PendaftaranKegiatan[]> {
    const { data, error } = await supabase.from('pendaftaran_kegiatan').select('*');
    if (error) throw error;
    return data.map(d => ({
      id: d.id,
      kegiatanId: d.kegiatan_id,
      siswaId: d.siswa_id
    }));
  },

  // --- EKSTRAKURIKULER ---
  async getEkstrakurikuler(): Promise<Ekstrakurikuler[]> {
    const { data, error } = await supabase.from('ekstrakurikuler').select('*, anggota_ekskul(id)');
    if (error) throw error;
    return data.map(e => ({
      id: e.id,
      nama: e.nama,
      pembina: e.pembina,
      deskripsi: e.deskripsi,
      jadwal: e.jadwal,
      logoUrl: e.logo_url,
      jumlahAnggota: e.anggota_ekskul ? e.anggota_ekskul.length : 0
    }));
  },

  async joinEkskul(ekskulId: string, siswaId: string) {
    const { error } = await supabase.from('anggota_ekskul').upsert({ ekskul_id: ekskulId, siswa_id: siswaId });
    if (error) throw error;
  },

  async leaveEkskul(ekskulId: string, siswaId: string) {
    const { error } = await supabase.from('anggota_ekskul').delete().eq('ekskul_id', ekskulId).eq('siswa_id', siswaId);
    if (error) throw error;
  },

  async getAnggotaEkskul(): Promise<AnggotaEkskul[]> {
    const { data, error } = await supabase.from('anggota_ekskul').select('*');
    if (error) throw error;
    return data.map(d => ({
      id: d.id,
      ekskulId: d.ekskul_id,
      siswaId: d.siswa_id
    }));
  }
};
