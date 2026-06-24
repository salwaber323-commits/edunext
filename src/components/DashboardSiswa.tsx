import { BookOpen, Calendar, Clock, AlertCircle, CheckCircle, FileText, Award, Users, MapPin, Zap } from 'lucide-react';
import { MataPelajaran, Tugas, AbsensiPertemuan, PengumpulanTugas, Kegiatan, Ekstrakurikuler } from '../types';

interface DashboardSiswaProps {
  student: {
    id: string;
    nama: string;
    nisnOrNip?: string;
    kelasId?: string;
  };
  schedules: MataPelajaran[];
  upcomings: Tugas[];
  activeAbsensi: AbsensiPertemuan[];
  pengumpulan: PengumpulanTugas[];
  kegiatan: Kegiatan[];
  ekskul: Ekstrakurikuler[];
  onCheckIn: (mapelId: string) => void;
  onNavigateToTab: (target: string, classId?: string) => void;
  onRegisterKegiatan: (kegId: string) => Promise<void>;
  onJoinEkskul: (ekskulId: string) => Promise<void>;
}

export default function DashboardSiswa({
  student,
  schedules,
  upcomings,
  activeAbsensi,
  pengumpulan,
  kegiatan,
  ekskul,
  onCheckIn,
  onNavigateToTab,
  onRegisterKegiatan,
  onJoinEkskul
}: DashboardSiswaProps) {
  // Mock monthly stats
  const attendanceStats = {
    hadir: 20,
    izin: 1,
    sakit: 0,
    alpha: 0
  };

  // Check if student has checked in for each active attendance
  const hasCheckedIn = (absId: string) => {
    const abs = activeAbsensi.find(a => a.id === absId);
    return abs ? abs.kehadiran[student.id] === 'Hadir' : false;
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-1">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-blue-400 bg-opacity-30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
            Siswa Aktif
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Halo, {student.nama}
          </h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base max-w-lg">
            Selamat datang kembali di LMS Sekolah Modern. Pantau jadwal hari ini, selesaikan tugas, dan pelajari materi baru.
          </p>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 hidden md:block">
          <BookOpen size={200} />
        </div>
      </div>

      {/* Grid Utama (Hari Ini & Tugas Mendatang & Absensi) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Jadwal & Absensi Hari Ini (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Absensi Hari ini Alert */}
          {activeAbsensi.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />Pertemuan Hari Ini &amp; Absensi
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                  Absensi Dibuka
                </span>
              </div>
              
              <div className="space-y-3">
                {activeAbsensi.map(abs => {
                  const checkedIn = hasCheckedIn(abs.id);
                  return (
                    <div 
                      key={abs.id} 
                      id={`abs-card-${abs.id}`}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                        checkedIn 
                          ? 'bg-emerald-50/50 border-emerald-100' 
                          : 'bg-indigo-50/30 border-blue-50 hover:bg-indigo-50/60'
                      }`}
                    >
                      <div className="mb-3 sm:mb-0">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1 inline-block">
                          {abs.mapelNama}
                        </span>
                        <h4 className="font-bold text-slate-800 text-base">Hadir KBM - Tanggal {abs.tanggal}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Konfirmasikan kehadiran Anda sebelum kelas selesai.</p>
                      </div>
                      
                      <div className="flex items-center">
                        {checkedIn ? (
                          <div id="check-success-msg" className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-semibold">
                            <CheckCircle size={16} /> Kehadiran Berhasil Dicatat
                          </div>
                        ) : (
                          <button
                            id={`btn-absen-${abs.id}`}
                            onClick={() => onCheckIn(abs.mapelId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow cursor-pointer w-full sm:w-auto text-center"
                          >
                            Hadir
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hari Ini Schedules */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="text-blue-600" size={20} /> Jadwal Belajar Hari Ini
            </h3>
            
            {schedules.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                Tidak ada pelajaran yang dijadwalkan hari ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedules.map((sched, idx) => (
                  <div 
                    key={sched.id} 
                    id={`sched-card-${sched.id}`}
                    className="p-5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          KBM Ke-{idx + 1}
                        </span>
                        <h4 onClick={() => onNavigateToTab('kelas', sched.kelasId)} className="font-bold text-slate-800 text-lg mt-2 cursor-pointer hover:text-blue-600 transition-colors">
                          {sched.nama}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">Kelas: {sched.kelasId === 'kelas_x_ipa_1' ? 'X IPA 1' : 'XI IPA 2'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600 mt-4 pt-4 border-t border-slate-100 text-sm">
                      <Clock size={16} className="text-slate-400" />
                      <span>{sched.jadwalWaktu} WIB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Tugas & Absensi Month (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tugas Mendatang */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="text-blue-600" size={18} /> Tugas Mendatang
              </h3>
              <button 
                onClick={() => onNavigateToTab('tugas')}
                className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
              >
                Lihat Semua
              </button>
            </div>

            {upcomings.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4 border border-dashed border-slate-100 rounded-xl">
                Alhamdulillah, tidak ada tugas sekolah mendesak.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomings.map(tugas => {
                  const statusSelesai = pengumpulan.find(p => p.tugasId === tugas.id && p.status === 'Sudah');
                  return (
                    <div 
                      key={tugas.id} 
                      id={`tugas-card-${tugas.id}`}
                      className="p-4 rounded-xl border border-slate-50 hover:border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {tugas.mapelNama}
                          </span>
                          <h4 
                            onClick={() => onNavigateToTab('kelas', tugas.kelasId)}
                            className="font-semibold text-slate-800 text-sm mt-1.5 hover:text-blue-600 cursor-pointer line-clamp-1 transition-colors"
                          >
                            {tugas.judul}
                          </h4>
                        </div>
                        {statusSelesai ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded shrink-0">
                            Selesai
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded shrink-0">
                            2 hari lagi
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                        <span>Batas: {tugas.deadline}</span>
                        {!statusSelesai && (
                          <button 
                            onClick={() => onNavigateToTab('kelas')} 
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            Kumpul
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Absensi Rekap Month */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <Award className="text-blue-600" size={18} /> Absensi Bulan Ini
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                <div className="text-2xl font-bold text-emerald-600">{attendanceStats.hadir}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Hadir</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                <div className="text-2xl font-bold text-blue-600">{attendanceStats.izin}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Izin</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                <div className="text-2xl font-bold text-amber-500">{attendanceStats.sakit}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Sakit</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                <div className="text-2xl font-bold text-rose-500">{attendanceStats.alpha}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Alpha</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-50 text-xs text-blue-700 flex items-start gap-2">
              <span className="font-bold">Info:</span>
              <p>Rasio kehadiran Anda bulan ini adalah 95%. Pertahankan keaktifan belajar Anda!</p>
            </div>
          </div>

          {/* Pengumuman & Kegiatan OSIS (NEW) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <Zap className="text-amber-500" size={18} /> Kegiatan Sekolah Mendatang
            </h3>
            <div className="space-y-4">
              {kegiatan.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">Belum ada kegiatan kesiswaan terdaftar.</p>
              ) : (
                kegiatan.map(k => (
                  <div key={k.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{k.kategori}</span>
                       <span className="text-[9px] font-bold text-slate-400">{k.tanggal}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{k.judul}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 flex items-center gap-1">
                      <MapPin size={10} /> {k.lokasi || 'Sekolah'}
                    </p>
                    <button 
                      onClick={() => onRegisterKegiatan(k.id)}
                      className="mt-3 w-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white py-2 rounded-lg text-[10px] font-black uppercase transition-all"
                    >
                      Daftar Peserta
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ekstrakurikuler (NEW) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <Users className="text-indigo-600" size={18} /> Bergabung Ekstrakurikuler
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {ekskul.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">Data ekstrakurikuler belum tersedia.</p>
              ) : (
                ekskul.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 border border-slate-50 rounded-xl hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Users size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{e.nama}</h4>
                        <p className="text-[10px] text-slate-400 font-bold truncate">Jadwal: {e.jadwal}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        onJoinEkskul(e.id);
                        alert(`Terima kasih! Pendaftaran ${e.nama} sedang diproses.`);
                      }}
                      className="ml-2 text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                    >
                      GABUNG
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
