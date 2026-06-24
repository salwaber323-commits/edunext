import React from 'react';
import { Users, FileText, Calendar, ChevronRight, ArrowRight, PlayCircle, CheckCircle } from 'lucide-react';
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
}: DashboardGuruProps) {
  
  const getUnsubmittedCount = (tugasId: string, totalSiswa: number) => {
    const submissions = pengumpulanList.filter(p => p.tugasId === tugasId && p.status === 'Sudah');
    return totalSiswa - submissions.length;
  };

  const getAbsensiStatusForClass = (kelasId: string) => {
    const todayStr = '2026-06-10'; // Simulated today
    const found = absensi.find(a => a.kelasId === kelasId && a.tanggal === todayStr);
    if (!found) return { state: 'Offline', item: null };
    return { state: found.isTerbuka ? 'Active' : 'Closed', item: found };
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-10">
      {/* Welcome Board */}
      <div className="bg-oxford rounded-3xl p-8 md:p-12 text-white shadow-premium relative overflow-hidden ring-1 ring-white/10">
        <div className="relative z-10">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6 inline-block font-sans">
            ID Pendidik: 198504122010011003 • Faculty Member
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight">
            Welcome back, <span className="text-bronze">{teacherName}</span>
          </h1>
          <p className="text-slate-400 mt-4 text-sm md:text-lg max-w-2xl leading-relaxed">
            Integrated Curriculum Management System. Manage attendance, evaluate student submissions, and compute semester transcripts with precision.
          </p>
        </div>
        <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-5 hidden lg:block text-white">
          <Users size={240} strokeWidth={1} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Active Cohorts & Evaluation */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="card-premium p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-oxford">Active Cohorts</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select to manage</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kelas.map(kls => (
                <div 
                  key={kls.id}
                  onClick={() => onSelectClass(kls.id)}
                  className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-bronze/30 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-serif font-bold text-xl text-oxford group-hover:text-bronze transition-colors">
                        Cohort {kls.nama}
                      </h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{kls.jumlahSiswa} Enrolled Students</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-bronze group-hover:text-white transition-all shadow-sm">
                      <ChevronRight size={18} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>2 Active Modules</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-oxford">Evaluation Queue</h3>
            </div>

            {tugas.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                 <p className="text-slate-400 text-sm font-medium italic">No pending assignments for review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tugas.map(t => {
                  const totalClassSiswa = t.kelasId === 'kelas_x_ipa_1' ? 32 : 29;
                  const unsubmitted = getUnsubmittedCount(t.id, totalClassSiswa);
                  const submittedCount = totalClassSiswa - unsubmitted;
                  
                  return (
                    <div 
                      key={t.id}
                      onClick={() => onSelectClass(t.kelasId)}
                      className="p-5 rounded-2xl border border-slate-50 bg-slate-50/20 hover:bg-white transition-all hover:shadow-sm cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded uppercase tracking-widest">
                            {t.mapelNama}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cohort {t.kelasId === 'kelas_x_ipa_1' ? 'X IPA 1' : 'XI IPA 2'}</span>
                        </div>
                        <h4 className="font-bold text-oxford text-base leading-tight">{t.judul}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                           <span>Progress: {submittedCount}/{totalClassSiswa} Submitted</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {unsubmitted > 0 && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg uppercase tracking-wider border border-amber-100/50">
                            {unsubmitted} Pending
                          </span>
                        )}
                        <span className="text-bronze text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
                          Review <ArrowRight size={14} strokeWidth={2.5} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & Stats */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-6">
               <Calendar className="text-bronze" size={18} />
               <h3 className="text-sm font-bold text-oxford uppercase tracking-widest">Session Control</h3>
            </div>
            
            <div className="space-y-4">
              {kelas.map(k => {
                const absStatus = getAbsensiStatusForClass(k.id);
                const isOpened = absStatus.state.startsWith('Active');
                
                return (
                  <div key={k.id} className="p-5 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-oxford text-sm">Cohort {k.nama}</span>
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        isOpened 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${isOpened ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        {isOpened ? 'Active' : 'Offline'}
                      </div>
                    </div>
                    
                    {!isOpened ? (
                      <button
                        onClick={() => onOpenAbsensi(k.id, 'mapel_matematika', 'Matematika')}
                        className="w-full bg-oxford hover:bg-slate-800 text-white text-[10px] font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm"
                      >
                        <PlayCircle size={14} /> Start Session
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectClass(k.id);
                        }}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-oxford text-[10px] font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        <CheckCircle size={14} /> Manage Roster
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-premium p-8 bg-oxford text-white border-0">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Faculty Performance</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Load</span>
                <span className="text-2xl font-serif font-bold text-white">04 <span className="text-xs font-sans text-slate-500">Hours</span></span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Attendance</span>
                <span className="text-2xl font-serif font-bold text-emerald-400">97.8%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grading Progress</span>
                <span className="text-2xl font-serif font-bold text-bronze">82%</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-[11px] text-slate-400 leading-relaxed font-medium">
              Tip: Use the <span className="text-white font-bold italic">Roster Spreadsheet</span> for mass grade entry and curriculum alignment.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
