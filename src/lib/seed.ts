import { supabase } from './supabase';
import { 
  initialUsers, initialKelas, initialMapel, initialMateri, 
  initialTugas, initialPengumpulanTugas, initialAbsensiPertemuan, 
  initialNilaiSiswa, initialSertifikat, initialRaporP5 
} from '../initialData';

export async function seedDatabase() {
  // Check if already seeded
  const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  if (count && count > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  // 1. Kelas
  const { error: kError } = await supabase.from('kelas').insert(
    initialKelas.map(k => ({
      id: k.id,
      nama: k.nama,
      tahun_ajaran: '2026/2027',
      semester: 'Ganjil'
    }))
  );
  if (kError) console.error('Error seeding kelas:', kError);

  // 2. Profiles
  const { error: pError } = await supabase.from('profiles').insert(
    initialUsers.map(u => ({
      id: u.id,
      nama: u.nama,
      role: u.role,
      nisn_nip: u.nisnOrNip,
      kelas_id: u.kelasId,
      avatar_url: u.avatar
    }))
  );
  if (pError) console.error('Error seeding profiles:', pError);

  // 3. Mata Pelajaran
  const { error: mpError } = await supabase.from('mata_pelajaran').insert(
    initialMapel.map(m => ({
      id: m.id,
      nama: m.nama,
      jadwal_hari: m.jadwalHari,
      jadwal_waktu: m.jadwalWaktu,
      kelas_id: m.kelasId
    }))
  );
  if (mpError) console.error('Error seeding mapel:', mpError);

  // 4. Materi
  const { error: mError } = await supabase.from('materi').insert(
    initialMateri.map(m => ({
      id: m.id,
      kelas_id: m.kelasId,
      mapel_id: m.mapelId,
      judul: m.judul,
      deskripsi: m.deskripsi,
      tipe: m.tipe,
      url: m.url,
      tanggal_input: m.tanggalInput
    }))
  );
  if (mError) console.error('Error seeding materi:', mError);

  // 5. Tugas
  const { error: tError } = await supabase.from('tugas').insert(
    initialTugas.map(t => ({
      id: t.id,
      kelas_id: t.kelasId,
      mapel_id: t.mapelId,
      judul: t.judul,
      deskripsi: t.deskripsi,
      deadline: t.deadline,
      tp_id: t.tpId,
      tipe_asesmen: t.tipeAsesmen
    }))
  );
  if (tError) console.error('Error seeding tugas:', tError);

  // 6. Pengumpulan Tugas
  const { error: ptError } = await supabase.from('pengumpulan_tugas').insert(
    initialPengumpulanTugas.map(p => ({
      id: p.id,
      tugas_id: p.tugasId,
      siswa_id: p.siswaId,
      tanggal_kumpul: p.tanggalKumpul ? new Date(p.tanggalKumpul).toISOString() : null,
      file_name: p.fileName,
      text_answer: p.textAnswer,
      nilai: p.nilai,
      status: p.status
    }))
  );
  if (ptError) console.error('Error seeding pengumpulan:', ptError);

  // 7. Absensi Pertemuan
  for (const a of initialAbsensiPertemuan) {
    const { error: apError } = await supabase.from('absensi_pertemuan').insert({
      id: a.id,
      kelas_id: a.kelasId,
      mapel_id: a.mapelId,
      tanggal: a.tanggal,
      is_terbuka: a.isTerbuka
    });
    if (apError) {
      console.error('Error seeding absensi_pertemuan:', apError);
      continue;
    }

    // 8. Absensi Kehadiran
    const kehadiranRows = Object.entries(a.kehadiran).map(([siswaId, status]) => ({
      pertemuan_id: a.id,
      siswa_id: siswaId,
      status: status
    }));
    const { error: akError } = await supabase.from('absensi_kehadiran').insert(kehadiranRows);
    if (akError) console.error('Error seeding absensi_kehadiran:', akError);
  }

  // 9. Nilai Siswa
  const { error: nError } = await supabase.from('nilai_siswa').insert(
    initialNilaiSiswa.map(n => ({
      id: n.id,
      siswa_id: n.siswaId,
      mapel_id: n.mapelId,
      tugas1: n.tugas1,
      tugas2: n.tugas2,
      uts: n.uts,
      uas: n.uas,
      nilai_akhir: n.nilaiAkhir
    }))
  );
  if (nError) console.error('Error seeding nilai:', nError);

  // 10. Sertifikat
  const { error: sError } = await supabase.from('sertifikat').insert(
    initialSertifikat.map(s => ({
      id: s.id,
      siswa_id: s.siswaId,
      judul: s.judul,
      tahun: s.tahun,
      penerbit: s.penerbit,
      tipe: s.tipe
    }))
  );
  if (sError) console.error('Error seeding sertifikat:', sError);

  // 11. Rapor P5
  const { error: rError } = await supabase.from('rapor_p5').insert(
    initialRaporP5.map(r => ({
      id: r.id,
      siswa_id: r.siswaId,
      semester_id: r.semesterId,
      tema_projek: r.temaProjek,
      beriman_bertakwa: r.berimanBertakwa,
      beriman_bertakwa_desc: r.berimanBertakwaDesc,
      berkebinekaan_global: r.berkebinekaanGlobal,
      berkebinekaan_global_desc: r.berkebinekaanGlobalDesc,
      gotong_royong: r.gotongRoyong,
      gotong_royong_desc: r.gotongRoyongDesc,
      mandiri: r.mandiri,
      mandiri_desc: r.mandiriDesc,
      bernalar_kritis: r.bernalarKritis,
      bernalar_kritis_desc: r.bernalarKritisDesc,
      kreatif: r.kreatif,
      kreatif_desc: r.kreatifDesc,
      status: r.status
    }))
  );
  if (rError) console.error('Error seeding rapor p5:', rError);

  console.log('Database seeding completed successfully!');
}
