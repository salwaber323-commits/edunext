import React from 'react';
import { Users, FileText, Calendar, Plus, ChevronRight, Play, AlertCircle, ArrowRight, PlayCircle, CheckCircle } from 'lucide-react';
import { Kelas, Tugas, AbsensiPertemuan, PengumpulanTugas } from '../types';

interface DashboardGuruProps {
  teacherName: string;
  kelas: Kelas[];
  tugas: Tugas[];
  absensi: AbsensiPertemuan[];
  pengumpulanList: PengumpulanTugas[];
  onOpenAbsensi: (kelasId: string, mapelId: string, mapelNama: string) => void;
  onSelectClass: (kelasId: string) => void;
  onNavigateToTab: (target: string) => void;
}

export default function DashboardGuru({
  teacherName,
  kelas,
  tugas,
  absensi,
  pengumpulanList,
  onOpenAbsensi,
  onSelectClass,
  onNavigateToTab
}: DashboardGuruProps) {
  
  // Calculate unsubmitted tareas for the active tasks item
  // Let's assume total students are 32 in X IPA 1.
  // There are tasks which have submission record, counts status == 'Belum'
  // Let's calculate for "Matematika"
  const getUnsubmittedCount = (tugasId: string, totalSiswa: number) => {
    const submissions = pengumpulanList.filter(p => p.tugasId === tugasId && p.status === 'Sudah');
    return totalSiswa - submissions.length;
  };

  // Check if attendance is open for a classroom
  const getAbsensiStatusForClass = (kelasId: string) => {
    const todayStr = '2026-06-10'; // Simulated today
    const found = absensi.find(a => a.kelasId === kelasId && a.tanggal === todayStr);
    if (!found) return { state: 'Belum Dibuka', item: null };
    return { state: found.isTerbuka ? 'Aktif - Terbuka' : 'Selesai/Ditutup', item: found };
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-1">
      {/* Welcome Board */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-700 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden ring-1 ring-white/10">
        <div className="relative z-10">
          <span className="bg-emerald-500/30 text-emerald-150 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3.5 inline-block border border-emerald-500/20 font-mono">
            ID Pendidik: 198504122010011003 • Wali Kelas X IPA 1
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Selamat Datang, {teacherName}
          </h1>
          <p className="text-teal-100 mt-2 text-sm md:text-base max-w-xl">
            Sistem otomatisasi KBM terintegrasi. Buat absensi, evaluasi tugas siswa, dan input rekap nilai rapor dengan cepat langsung dari panel kontrol ini.
          </p>
        </div>
        <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-10 hidden md:block">
          <Users size={180} />
        </div>
      </div>

      {/* Grid Menu Ringkas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kelas Aktif & Tugas Terbuka */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Kelas Aktif Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-teal-600" size={20} /> Kelas Aktif Yang Diajar
              </h3>
              <span className="text-xs text-slate-400">Pilih kelas untuk mengelola</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kelas.map(kls => (
                <div 
                  key={kls.id}
                  id={`kelas-card-${kls.id}`}
                  onClick={() => onSelectClass(kls.id)}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg group-hover:text-teal-600 transition-colors">
                        Kelas {kls.nama}
                      </h4>
                      <p className="text-slate-500 text-sm mt-1">{kls.jumlahSiswa} Siswa Terdaftar</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Modul Pembelajaran Aktif: 2</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tugas Aktif List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-teal-600" size={20} /> Antrian Evaluasi Tugas
            </h3>

            {tugas.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">Belum ada tugas yang dipublikasikan.</p>
            ) : (
              <div className="space-y-3">
                {tugas.map(t => {
                  const totalClassSiswa = t.kelasId === 'kelas_x_ipa_1' ? 32 : 29;
                  const unsubmitted = getUnsubmittedCount(t.id, totalClassSiswa);
                  const submittedCount = totalClassSiswa - unsubmitted;
                  
                  return (
                    <div 
                      key={t.id}
                      id={`tugas-eval-card-${t.id}`}
                      onClick={() => onSelectClass(t.kelasId)}
                      className="p-4 rounded-xl border border-slate-50 hover:border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
                            {t.mapelNama}
                          </span>
                          <span className="text-xs text-slate-400">Kelas: {t.kelasId === 'kelas_x_ipa_1' ? 'X IPA 1' : 'XI IPA 2'}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">{t.judul}</h4>
                        <p className="text-xs text-slate-500 mt-1">Selesai Dikumpulkan: {submittedCount} Siswa</p>
                      </div>

                      <div className="flex items-center gap-3 self-start md:self-auto">
                        <div className="text-right">
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                            {unsubmitted} Belum Mengumpulkan
                          </span>
                        </div>
                        <span className="text-teal-600 hover:text-teal-700 shrink-0 text-sm font-bold flex items-center gap-0.5">
                          Evaluasi <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Kolom Kanan: Actions Ringkas (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Absensi Hari ini Shortcuts */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="text-teal-600" size={18} /> Kontrol Absensi Hari Ini
            </h3>
            
            <div className="space-y-4">
              {kelas.map(k => {
                const absStatus = getAbsensiStatusForClass(k.id);
                const isOpened = absStatus.state.startsWith('Aktif');
                
                return (
                  <div key={k.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 text-sm">Kelas {k.nama}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isOpened 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {absStatus.state}
                      </span>
                    </div>
                    
                    {!isOpened ? (
                      <button
                        id={`btn-buka-absen-${k.id}`}
                        onClick={() => onOpenAbsensi(k.id, 'mapel_matematika', 'Matematika')}
                        className="mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <PlayCircle size={14} /> Buka Absensi Matematika
                      </button>
                    ) : (
                      <button
                        id={`btn-kelola-absen-${k.id}`}
                        onClick={() => {
                          onSelectClass(k.id);
                        }}
                        className="mt-2 w-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={14} /> Kelola Daftar Hadir
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Status Mengajar Mingguan</h4>
            <div className="my-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Total Pertemuan:</span>
                <span className="text-white font-semibold">4 / Minggu</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>Rata-Rata Kehadiran Kelas:</span>
                <span className="text-emerald-400 font-semibold">97.8%</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Koreksi Selesai:</span>
                <span className="text-teal-400 font-semibold">82%</span>
              </div>
            </div>
            
            <div className="border-t border-slate-700/60 pt-4 mt-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Tip: Gunakan halaman <strong>Nilai Spreadsheet</strong> untuk mengisi banyak nilai sekaligus seperti menggunakan Microsoft Excel secara cepat.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
