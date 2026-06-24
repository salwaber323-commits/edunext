import React, { useState } from 'react';
import { Calendar, Clock, CheckSquare, Plus, AlertCircle, FileText, UserCheck, Eye, Trash2, CheckCircle2 } from 'lucide-react';
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
  
  // Local form states
  const [newAbsKelasId, setNewAbsKelasId] = useState('kelas_x_ipa_1');
  const [newAbsMapelNama, setNewAbsMapelNama] = useState('Matematika');
  const [newAbsTanggal, setNewAbsTanggal] = useState('2026-06-10'); // Simulated Today

  const [recapMode, setRecapMode] = useState(false);
  const [selectedRecapClassId, setSelectedRecapClassId] = useState(kelas[0]?.id || '');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  // Filter students by class for quick register
  const getSiswaForClass = (clsId: string) => {
    return siswaList.filter(s => s.kelasId === clsId);
  };

  const getSiswaMapelName = (mapelId: string) => {
    return mapelId === 'mapel_matematika' ? 'Matematika' :
           mapelId === 'mapel_indonesia' ? 'Bahasa Indonesia' : 'Fisika';
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-1">
      
      {/* Title block */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
          <Calendar className="text-blue-600" size={24} /> Portal Absensi Kelas Mandiri
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          Sistem absensi berbasis KBM digital. Murid dapat melakukan klik absensi mandiri, sedangkan Guru memegang kendali pembukaan dan validasi data.
        </p>

        {role === 'guru' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setRecapMode(false)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${!recapMode ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
            >
              Manajemen Sesi
            </button>
            <button
              onClick={() => {
                setRecapMode(true);
                setSelectedRecapClassId(newAbsKelasId);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${recapMode ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
            >
              Rekapitulasi Absensi
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* VIEW 1: GURU CONTROL SYSTEM */}
        {role === 'guru' && !recapMode && (
          <>
            {/* Left box: Create Daily Attendance (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">Buka Absensi Baru</h3>
                
                <div className="space-y-4 text-xs font-bold text-slate-500">
                  <div>
                    <label className="block mb-1.5">Pilih Rombel / Kelas</label>
                    <select 
                      value={newAbsKelasId}
                      onChange={e => setNewAbsKelasId(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg px-3 py-2.5"
                    >
                      {kelas.map(k => (
                        <option key={k.id} value={k.id}>Kelas {k.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5">Mata Pelajaran</label>
                    <select
                      value={newAbsMapelNama}
                      onChange={e => setNewAbsMapelNama(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg px-3 py-2.5"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Fisika">Fisika</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5">Tanggal Pertemuan</label>
                    <input 
                      type="date" 
                      value={newAbsTanggal}
                      onChange={e => setNewAbsTanggal(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <button
                    id="btn-trigger-buka-absen"
                    onClick={() => {
                      const mapelId = newAbsMapelNama === 'Matematika' ? 'mapel_matematika' :
                                      newAbsMapelNama === 'Bahasa Indonesia' ? 'mapel_indonesia' : 'mapel_fisika';
                      onOpenNewAbsensi(newAbsKelasId, mapelId, newAbsMapelNama, newAbsTanggal);
                      alert(`✓ Absensi ${newAbsMapelNama} berhasil dibuka untuk kelas dan siswa`);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xs cursor-pointer shadow-sm transition-all"
                  >
                    Mulai Sesi Absen [ Buka Absensi ]
                  </button>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 text-xs text-slate-500">
                <h4 className="font-bold text-slate-700 mb-2">Petunjuk Guru:</h4>
                <p className="leading-relaxed">
                  Setelah membuka absen, siswa di kelas terkait akan mendapatkan card tombol <strong>[ Hadir ]</strong> otomatis saat login di akun siswa.
                </p>
              </div>
            </div>

            {/* Right box: Active attendance sessions and details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">Riwayat Sesi Absensi Pertemuan</h3>

                {meetings.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8 border border-dashed border-slate-100 rounded-xl">
                    Belum ada sesi absensi yang dibuat. Silakan buat sesi baru di sebelah kiri.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {meetings.map(meet => {
                      const activeClassObj = kelas.find(k => k.id === meet.kelasId);
                      const isMeetOpened = meet.isTerbuka;
                      const hasSelectedThis = selectedMeetingId === meet.id;
                      
                      // Calculate quick counts
                      const participants = getSiswaForClass(meet.kelasId);
                      const totalHadir = participants.filter(p => meet.kehadiran[p.id] === 'Hadir').length;
                      
                      return (
                        <div key={meet.id} className={`p-4 rounded-xl border transition-all ${
                          hasSelectedThis ? 'border-blue-400 bg-blue-50/10' : 'border-slate-100 bg-slate-50/10 hover:bg-slate-50/30'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                                  {meet.mapelNama}
                                </span>
                                <span className="text-xs text-slate-400 font-semibold">Rombel: Kelas {activeClassObj?.nama}</span>
                              </div>
                              <h4 className="font-bold text-slate-800 text-base">Pertemuan Tgl: {meet.tanggal}</h4>
                              <p className="text-xs text-slate-500 mt-1">Kehadiran tercatat: {totalHadir} dari {participants.length} Siswa</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Open/Close toggle */}
                              <button
                                id={`toggle-meet-state-${meet.id}`}
                                onClick={() => onToggleMeetingState(meet.id)}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isMeetOpened 
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {isMeetOpened ? '🟢 Terbuka (Tutup)' : '🔴 Ditutup (Buka)'}
                              </button>

                              {/* Toggle roster details */}
                              <button
                                id={`view-meet-details-${meet.id}`}
                                onClick={() => setSelectedMeetingId(hasSelectedThis ? null : meet.id)}
                                className="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                {hasSelectedThis ? 'Sembunyikan' : 'Kelola Siswa'}
                              </button>
                            </div>
                          </div>

                          {/* Detail Roster presence override */}
                          {hasSelectedThis && (
                            <div className="animated-fade mt-4 pt-4 border-t border-slate-200 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                <h5 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Daftar Kehadiran Siswa</h5>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      participants.forEach(s => onUpdatePresence(meet.id, s.id, 'Hadir'));
                                      alert('✓ Semua siswa ditandai sebagai HADIR');
                                    }}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg transition-colors border border-emerald-200/50 cursor-pointer"
                                  >
                                    ✓ Set Semua Hadir (Cepat)
                                  </button>
                                  <button
                                    onClick={() => {
                                      participants.forEach(s => onUpdatePresence(meet.id, s.id, 'Alpha'));
                                      alert('✓ Semua siswa ditandai sebagai TANPA KETERANGAN');
                                    }}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg transition-colors border border-rose-200/50 cursor-pointer"
                                  >
                                    ✗ Reset Semua Alpha
                                  </button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {participants.map(s => {
                                  const currentStatus = meet.kehadiran[s.id] || 'Alpha';
                                  return (
                                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 text-xs">
                                      <span className="font-bold text-slate-800">{s.nama}</span>
                                      
                                      <div className="flex gap-1">
                                        {(['Hadir', 'Izin', 'Sakit', 'Alpha'] as const).map(st => (
                                          <button
                                            key={st}
                                            onClick={() => onUpdatePresence(meet.id, s.id, st)}
                                            className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                                              currentStatus === st
                                                ? st === 'Hadir' ? 'bg-emerald-600 text-white' :
                                                  st === 'Izin' ? 'bg-blue-600 text-white' :
                                                  st === 'Sakit' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                            }`}
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
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 text-base">Rekapitulasi Kehadiran Kelas</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Pilih Kelas:</span>
                  <select
                    value={selectedRecapClassId}
                    onChange={e => setSelectedRecapClassId(e.target.value)}
                    className="text-xs font-bold border rounded-lg p-2 bg-white"
                  >
                    {kelas.map(k => (
                      <option key={k.id} value={k.id}>Kelas {k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 font-bold sticky left-0 bg-slate-50 z-10 w-48 border-r border-slate-200">Nama Siswa</th>
                      {meetings.filter(m => m.kelasId === selectedRecapClassId).map(m => (
                        <th key={m.id} className="p-3 font-bold border-r border-slate-200 text-center min-w-[100px]">
                          <div className="text-[10px] text-indigo-600">{m.mapelNama}</div>
                          <div className="text-[9px] text-slate-400 font-mono">{m.tanggal}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getSiswaForClass(selectedRecapClassId).map(siswa => (
                      <tr key={siswa.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {siswa.nama}
                        </td>
                        {meetings.filter(m => m.kelasId === selectedRecapClassId).map(m => {
                          const status = m.kehadiran[siswa.id] || '-';
                          return (
                            <td key={m.id} className="p-3 text-center border-r border-slate-50">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${
                                status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                                status === 'Izin' ? 'bg-blue-100 text-blue-800' :
                                status === 'Sakit' ? 'bg-amber-100 text-amber-800' :
                                status === 'Alpha' ? 'bg-red-100 text-red-800' : 'text-slate-300'
                              }`}>
                                {status.toUpperCase()}
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
          <div className="lg:col-span-12 space-y-6">
            
            {/* Checked-In or Open check-in panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
                Pertemuan Hari Ini yang Sedang Berjalan
              </h3>

              {meetings.filter(m => m.isTerbuka).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-100 rounded-xl text-slate-400">
                  <Clock className="mx-auto text-slate-300 mb-2" size={32} />
                  Belum ada kelas Matematika/Fisika/Indonesia yang dibuka oleh guru hari ini.
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.filter(m => m.isTerbuka).map(m => {
                    const studentPresence = m.kehadiran[currentUserId];
                    const isRegistered = studentPresence === 'Hadir';
                    
                    return (
                      <div key={m.id} className="p-5 rounded-2xl border border-blue-50 bg-blue-50/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                            Mata Pelajaran
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-lg">Pertemuan KBM - {m.mapelNama}</h4>
                          <p className="text-xs text-slate-500">Tanggal: {m.tanggal} (Batas KBM hari ini)</p>
                        </div>

                        <div>
                          {isRegistered ? (
                            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold">
                              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" /> Kehadiran Berhasil Dicatat
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                onUpdatePresence(m.id, currentUserId, 'Hadir');
                                alert('✓ Kehadiran berhasil dicatat!');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-sm w-full sm:w-auto text-center"
                            >
                              Centang Kehadiran [ Hadir ]
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Historic presence log table for Ahmad */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">Riwayat Kartu Absensi Saya</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                      <th className="p-3 font-semibold">Tanggal</th>
                      <th className="p-3 font-semibold">Mata Pelajaran</th>
                      <th className="p-3 font-semibold">Validator</th>
                      <th className="p-3 font-semibold text-center w-36">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {meetings.map((meet, index) => {
                      const studentPresence = meet.kehadiran[currentUserId] || 'Alpha';
                      return (
                        <tr key={index} className="hover:bg-slate-50/40">
                          <td className="p-3 font-medium text-slate-600">{meet.tanggal}</td>
                          <td className="p-3 font-bold text-slate-800">{meet.mapelNama}</td>
                          <td className="p-3 text-xs text-slate-400 font-semibold">Sistem / Pak Budi, S.Pd.</td>
                          <td className="p-3 text-center">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-block ${
                              studentPresence === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                              studentPresence === 'Izin' ? 'bg-blue-100 text-blue-800' :
                              studentPresence === 'Sakit' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
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
