import { BookOpen, Calendar, Clock, CheckCircle, FileText, Award, MapPin, Zap } from 'lucide-react';
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
  // Check if student has checked in for each active attendance
  const hasCheckedIn = (absId: string) => {
    const abs = activeAbsensi.find(a => a.id === absId);
    return abs ? abs.kehadiran[student.id] === 'Hadir' : false;
  };

  const pendingAssignments = upcomings.filter(t => !pengumpulan.find(p => p.tugasId === t.id && p.status === 'Sudah')).length;

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-premium group">
        <div className="absolute inset-0 bg-oxford">
           <img 
             src="https://images.unsplash.com/photo-1635776062360-af423602aff3?auto=format&fit=crop&q=80&w=1600" 
             className="w-full h-full object-cover opacity-20 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
             alt="Academic Background" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-oxford via-oxford/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-bronze/20 text-bronze border border-bronze/30 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              Student Academic Portal
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-3">
            Welcome back, <span className="text-bronze">{student.nama.split(' ')[0]}</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-xl leading-relaxed">
            Your academic progress is on track. You have <span className="text-white font-bold">{pendingAssignments} pending assignments</span> to review today.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[140px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance Rate</p>
              <p className="text-2xl font-serif font-bold text-white">98.5%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[140px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">GPA Equivalent</p>
              <p className="text-2xl font-serif font-bold text-white">3.92</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Utama (Hari Ini & Tugas Mendatang & Absensi) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Jadwal & Absensi Hari Ini (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Absensi Hari ini Alert */}
          {activeAbsensi.length > 0 && (
            <div className="card-premium p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-oxford">Mandatory Check-in</h3>
                    <p className="text-xs text-slate-400 font-medium">Please confirm your attendance for current sessions.</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                  Active Session
                </span>
              </div>
              
              <div className="space-y-4">
                {activeAbsensi.map(abs => {
                  const checkedIn = hasCheckedIn(abs.id);
                  return (
                    <div 
                      key={abs.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all ${
                        checkedIn 
                          ? 'bg-slate-50/50 border-slate-100' 
                          : 'bg-white border-blue-100 shadow-sm ring-1 ring-blue-50'
                      }`}
                    >
                      <div className="mb-4 sm:mb-0">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 inline-block">
                          {abs.mapelNama}
                        </span>
                        <h4 className="font-bold text-oxford text-lg">{abs.tanggal} • Academic Session</h4>
                      </div>
                      
                      <div className="flex items-center">
                        {checkedIn ? (
                          <div className="flex items-center gap-2 text-sage font-bold text-sm">
                            <CheckCircle size={18} strokeWidth={3} /> Registered
                          </div>
                        ) : (
                          <button
                            onClick={() => onCheckIn(abs.mapelId)}
                            className="bg-oxford hover:bg-slate-800 text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer w-full sm:w-auto text-center tracking-widest uppercase"
                          >
                            Mark Attendance
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
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-oxford">Academic Schedule</h3>
                <p className="text-xs text-slate-400 font-medium">Your synchronized daily curriculum.</p>
              </div>
            </div>
            
            {schedules.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-medium text-sm">
                No compulsory sessions scheduled for today.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schedules.map((sched, idx) => (
                  <div 
                    key={sched.id} 
                    className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 transition-all hover:shadow-md relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Session {idx + 1}
                        </span>
                        <h4 
                          onClick={() => onNavigateToTab('kelas', sched.kelasId)} 
                          className="font-serif font-bold text-xl text-oxford cursor-pointer hover:text-bronze transition-colors"
                        >
                          {sched.nama}
                        </h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                           <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-slate-400" />
                              {sched.jadwalWaktu} WIB
                           </div>
                           <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-slate-400" />
                              Hall B
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Tugas & Absensi Month (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Tugas Mendatang */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-oxford uppercase tracking-widest flex items-center gap-2">
                <FileText className="text-bronze" size={16} /> Compulsory Tasks
              </h3>
              <button 
                onClick={() => onNavigateToTab('tugas')}
                className="text-bronze hover:text-amber-700 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                View All
              </button>
            </div>

            {upcomings.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-100 rounded-xl">
                 <p className="text-xs text-slate-400 font-medium italic">No pending assignments.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomings.map(tugas => {
                  const statusSelesai = pengumpulan.find(p => p.tugasId === tugas.id && p.status === 'Sudah');
                  return (
                    <div 
                      key={tugas.id} 
                      className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white transition-all hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 block">
                            {tugas.mapelNama}
                          </span>
                          <h4 
                            onClick={() => onNavigateToTab('kelas', tugas.kelasId)}
                            className="font-bold text-oxford text-sm hover:text-bronze cursor-pointer transition-colors"
                          >
                            {tugas.judul}
                          </h4>
                        </div>
                        {statusSelesai ? (
                          <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle size={14} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                            <Clock size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Due: {tugas.deadline}</span>
                        {!statusSelesai && (
                          <button 
                            onClick={() => onNavigateToTab('kelas')} 
                            className="text-[10px] font-black text-oxford hover:text-bronze uppercase tracking-widest"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Academic Records Metric */}
          <div className="card-premium p-6 bg-oxford text-white border-0">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="text-bronze" size={14} /> Academic Standing
            </h3>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-2xl font-serif font-bold text-white leading-none">Excellent</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Ranking: Top 5%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-2 border-bronze flex items-center justify-center text-bronze font-black text-sm">
                     A+
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>Semester Progress</span>
                     <span>82%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-bronze rounded-full" style={{ width: '82%' }}></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Activity Bulletin */}
          <div className="card-premium p-6">
            <h3 className="text-[10px] font-bold text-oxford uppercase tracking-widest mb-4">Upcoming Engagements</h3>
            <div className="space-y-4">
              {kegiatan.slice(0, 2).map(k => (
                <div key={k.id} className="group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-[9px] font-bold text-bronze uppercase tracking-widest">{k.kategori}</span>
                     <span className="text-[9px] text-slate-400 font-medium">{k.tanggal}</span>
                  </div>
                  <h4 className="text-sm font-bold text-oxford group-hover:text-bronze transition-colors line-clamp-1">{k.judul}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                    Location: {k.lokasi || 'Grand Hall'}
                  </p>
                  <button 
                    onClick={() => onRegisterKegiatan(k.id)}
                    className="mt-3 w-full bg-slate-50 text-oxford hover:bg-oxford hover:text-white py-2 rounded-lg text-[9px] font-black uppercase transition-all border border-slate-100"
                  >
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ekstrakurikuler */}
          <div className="card-premium p-6">
            <h3 className="text-[10px] font-bold text-oxford uppercase tracking-widest mb-4">Organizations</h3>
            <div className="space-y-4">
              {ekskul.slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-all">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-oxford truncate">{e.nama}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{e.jadwal}</p>
                  </div>
                  <button 
                    onClick={() => onJoinEkskul(e.id)}
                    className="text-[9px] font-black text-white bg-oxford px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                  >
                    JOIN
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
