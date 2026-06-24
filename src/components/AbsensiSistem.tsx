import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, Circle, PlayCircle, ClipboardList, UserCheck } from 'lucide-react';
import { AbsensiPertemuan, User, UserRole, Kelas } from '../types';

interface AbsensiSistemProps {
  role: UserRole;
  currentUserId: string;
  kelas: Kelas[];
  siswaList: User[];
  meetings: AbsensiPertemuan[];
  
  onToggleMeetingState: (meetingId: string) => void;
  onOpenNewAbsensi: (kelasId: string, mapelId: string, mapelNama: string, tanggal: string) => void;
  onUpdatePresence: (meetingId: string, siswaId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => void;
}

export default function AbsensiSistem({
  role,
  currentUserId,
  kelas,
  siswaList,
  meetings,
  onToggleMeetingState,
  onOpenNewAbsensi,
  onUpdatePresence
}: AbsensiSistemProps) {
  
  const [newAbsKelasId, setNewAbsKelasId] = useState('kelas_x_ipa_1');
  const [newAbsMapelNama, setNewAbsMapelNama] = useState('Matematika');
  const [newAbsTanggal, setNewAbsTanggal] = useState('2026-06-10'); 

  const [recapMode, setRecapMode] = useState(false);
  const [selectedRecapClassId, setSelectedRecapClassId] = useState(kelas[0]?.id || '');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const getSiswaForClass = (clsId: string) => {
    return siswaList.filter(s => s.kelasId === clsId);
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-10">
      
      {/* Title block */}
      <div className="card-premium p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                 <Calendar size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-oxford">Attendance Management</h2>
           </div>
           <p className="text-slate-500 text-sm max-w-xl">
             Academic verification system. Students mark individual presence while Faculty maintains control over session validation and data integrity.
           </p>
        </div>

        {role === 'guru' && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setRecapMode(false)}
              className={`flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${!recapMode ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'}`}
            >
              <PlayCircle size={14} /> Session Control
            </button>
            <button
              onClick={() => {
                setRecapMode(true);
                setSelectedRecapClassId(newAbsKelasId);
              }}
              className={`flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${recapMode ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'}`}
            >
              <ClipboardList size={14} /> Recap Data
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* VIEW 1: GURU CONTROL SYSTEM */}
        {role === 'guru' && !recapMode && (
          <>
            <div className="lg:col-span-4 space-y-6">
              <div className="card-premium p-8 space-y-6">
                <h3 className="font-bold text-oxford text-sm uppercase tracking-widest border-b border-slate-100 pb-4">Initiate Session</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cohort / Class</label>
                    <select 
                      value={newAbsKelasId}
                      onChange={e => setNewAbsKelasId(e.target.value)}
                      className="w-full text-xs font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-bronze transition-colors"
                    >
                      {kelas.map(k => (
                        <option key={k.id} value={k.id}>Class {k.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Curriculum Subject</label>
                    <select
                      value={newAbsMapelNama}
                      onChange={e => setNewAbsMapelNama(e.target.value)}
                      className="w-full text-xs font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-bronze transition-colors"
                    >
                      <option value="Matematika">Mathematics</option>
                      <option value="Bahasa Indonesia">Indonesian Language</option>
                      <option value="Fisika">Physics</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Session Date</label>
                    <input 
                      type="date" 
                      value={newAbsTanggal}
                      onChange={e => setNewAbsTanggal(e.target.value)}
                      className="w-full text-xs font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      const mapelId = newAbsMapelNama === 'Matematika' ? 'mapel_matematika' :
                                      newAbsMapelNama === 'Bahasa Indonesia' ? 'mapel_indonesia' : 'mapel_fisika';
                      onOpenNewAbsensi(newAbsKelasId, mapelId, newAbsMapelNama, newAbsTanggal);
                    }}
                    className="w-full bg-oxford hover:bg-slate-800 text-white font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    Open Session
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 text-[11px] text-blue-800 leading-relaxed font-medium">
                <div className="flex gap-2 items-start">
                   <Clock size={14} className="mt-0.5 shrink-0" />
                   <p>Session access is live immediately for enrolled students upon activation. Data synchronization occurs in real-time.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="card-premium p-8 space-y-6">
                <h3 className="font-bold text-oxford text-sm uppercase tracking-widest border-b border-slate-100 pb-4">Session Archives</h3>

                {meetings.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-2xl">
                     <p className="text-slate-400 text-sm font-medium">No active sessions found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meetings.map(meet => {
                      const activeClassObj = kelas.find(k => k.id === meet.kelasId);
                      const isMeetOpened = meet.isTerbuka;
                      const hasSelectedThis = selectedMeetingId === meet.id;
                      const participants = getSiswaForClass(meet.kelasId);
                      const totalHadir = participants.filter(p => meet.kehadiran[p.id] === 'Hadir').length;
                      
                      return (
                        <div key={meet.id} className={`p-6 rounded-2xl border transition-all ${
                          hasSelectedThis ? 'border-bronze bg-slate-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded uppercase tracking-widest">
                                  {meet.mapelNama}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cohort {activeClassObj?.nama}</span>
                              </div>
                              <h4 className="font-bold text-oxford text-lg leading-tight">Session: {meet.tanggal}</h4>
                              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Enrollment: {totalHadir} / {participants.length} Present</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => onToggleMeetingState(meet.id)}
                                className={`flex items-center gap-2 text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer transition-all uppercase tracking-widest ${
                                  isMeetOpened 
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                <Circle size={10} className={isMeetOpened ? 'fill-emerald-500' : 'fill-slate-300'} />
                                {isMeetOpened ? 'Active' : 'Closed'}
                              </button>

                              <button
                                onClick={() => setSelectedMeetingId(hasSelectedThis ? null : meet.id)}
                                className="bg-oxford hover:bg-slate-800 text-white text-[10px] font-bold px-5 py-2 rounded-xl cursor-pointer uppercase tracking-widest shadow-sm"
                              >
                                {hasSelectedThis ? 'Hide' : 'Manage'}
                              </button>
                            </div>
                          </div>

                          {hasSelectedThis && (
                            <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Student Roster</h5>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => participants.forEach(s => onUpdatePresence(meet.id, s.id, 'Hadir'))}
                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-lg transition-colors border border-emerald-100"
                                  >
                                    Mark All Present
                                  </button>
                                  <button
                                    onClick={() => participants.forEach(s => onUpdatePresence(meet.id, s.id, 'Alpha'))}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[9px] font-black rounded-lg transition-colors border border-rose-100"
                                  >
                                    Reset to Alpha
                                  </button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {participants.map(s => {
                                  const currentStatus = meet.kehadiran[s.id] || 'Alpha';
                                  return (
                                    <div key={s.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-100 transition-all hover:shadow-sm">
                                      <span className="font-bold text-oxford text-xs">{s.nama}</span>
                                      
                                      <div className="flex gap-1">
                                        {(['Hadir', 'Izin', 'Sakit', 'Alpha'] as const).map(st => (
                                          <button
                                            key={st}
                                            onClick={() => onUpdatePresence(meet.id, s.id, st)}
                                            className={`text-[9px] font-black w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                                              currentStatus === st
                                                ? st === 'Hadir' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' :
                                                  st === 'Izin' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' :
                                                  st === 'Sakit' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-red-500 text-white border-red-500 shadow-sm'
                                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                            }`}
                                            title={st}
                                          >
                                            {st[0]}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* VIEW 1.B: GURU RECAP SYSTEM */}
        {role === 'guru' && recapMode && (
          <div className="lg:col-span-12 space-y-8">
            <div className="card-premium p-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3">
                   <ClipboardList className="text-bronze" size={24} />
                   <h3 className="font-serif font-bold text-xl text-oxford leading-none">Cohort Recapitulation</h3>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Filter Cohort</span>
                  <select
                    value={selectedRecapClassId}
                    onChange={e => setSelectedRecapClassId(e.target.value)}
                    className="text-xs font-bold border-0 bg-white rounded-xl px-4 py-2 outline-none shadow-sm"
                  >
                    {kelas.map(k => (
                      <option key={k.id} value={k.id}>Class {k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="p-5 font-bold uppercase tracking-widest text-[10px] text-slate-400 sticky left-0 bg-slate-50 z-10 w-64 border-r border-slate-200">Student Identity</th>
                      {meetings.filter(m => m.kelasId === selectedRecapClassId).map(m => (
                        <th key={m.id} className="p-5 font-bold border-r border-slate-200 text-center min-w-[140px]">
                          <div className="text-[10px] text-blue-600 uppercase tracking-widest mb-1">{m.mapelNama}</div>
                          <div className="text-[9px] text-slate-400 font-mono tracking-tighter">{m.tanggal}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getSiswaForClass(selectedRecapClassId).map(siswa => (
                      <tr key={siswa.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 font-bold text-oxford sticky left-0 bg-white z-10 border-r border-slate-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                          {siswa.nama}
                        </td>
                        {meetings.filter(m => m.kelasId === selectedRecapClassId).map(m => {
                          const status = m.kehadiran[siswa.id] || '-';
                          return (
                            <td key={m.id} className="p-5 text-center border-r border-slate-50">
                              <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${
                                status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                status === 'Izin' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                status === 'Sakit' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                status === 'Alpha' ? 'bg-red-50 text-red-700 border border-red-100' : 'text-slate-300'
                              }`}>
                                {status}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SISWA VIEW ATTENDANCE CARDS & HISTORICS */}
        {role === 'siswa' && (
          <div className="lg:col-span-12 space-y-8">
            <div className="card-premium p-8 space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                 <UserCheck className="text-blue-600" size={24} />
                 <h3 className="font-serif font-bold text-xl text-oxford leading-none">Active Attendance Sessions</h3>
              </div>

              {meetings.filter(m => m.isTerbuka).length === 0 ? (
                <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="h-16 w-16 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                     <Clock className="text-slate-300" size={24} />
                  </div>
                  <p className="text-slate-400 font-medium text-sm">No curriculum sessions are currently requiring check-in.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {meetings.filter(m => m.isTerbuka).map(m => {
                    const studentPresence = m.kehadiran[currentUserId];
                    const isRegistered = studentPresence === 'Hadir';
                    
                    return (
                      <div key={m.id} className="p-8 rounded-3xl border border-blue-100 bg-white shadow-sm ring-1 ring-blue-50 hover:shadow-md transition-all group">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                               Active Curriculum
                             </span>
                             <Clock size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <h4 className="font-serif font-bold text-2xl text-oxford leading-tight">{m.mapelNama}</h4>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest pb-4">
                             {m.tanggal} • Official Session
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                            {isRegistered ? (
                              <div className="flex items-center justify-center gap-2 text-sage bg-emerald-50 border border-emerald-100 py-4 rounded-2xl text-sm font-black uppercase tracking-widest">
                                <CheckCircle2 size={20} strokeWidth={3} /> Registered
                              </div>
                            ) : (
                              <button
                                onClick={() => onUpdatePresence(m.id, currentUserId, 'Hadir')}
                                className="w-full bg-oxford hover:bg-slate-800 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest cursor-pointer shadow-md transition-all active:scale-[0.98]"
                              >
                                Mark Attendance [ Present ]
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card-premium p-8 space-y-8">
              <h3 className="font-serif font-bold text-xl text-oxford leading-none border-b border-slate-100 pb-6">Individual Academic Logs</h3>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="p-5 font-bold uppercase tracking-widest text-[10px] text-slate-400">Date</th>
                      <th className="p-5 font-bold uppercase tracking-widest text-[10px] text-slate-400">Subject</th>
                      <th className="p-5 font-bold uppercase tracking-widest text-[10px] text-slate-400">Validated By</th>
                      <th className="p-5 font-bold uppercase tracking-widest text-[10px] text-slate-400 text-center w-48">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-oxford">
                    {meetings.map((meet, index) => {
                      const studentPresence = meet.kehadiran[currentUserId] || 'Alpha';
                      return (
                        <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-5 font-medium text-slate-500">{meet.tanggal}</td>
                          <td className="p-5 font-bold">{meet.mapelNama}</td>
                          <td className="p-5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">System / Faculty Validation</td>
                          <td className="p-5 text-center">
                            <span className={`text-[9px] font-black px-4 py-1.5 rounded-full inline-block uppercase tracking-widest border ${
                              studentPresence === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              studentPresence === 'Izin' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              studentPresence === 'Sakit' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {studentPresence}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
