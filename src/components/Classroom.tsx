import React, { useState } from 'react';
import { 
  BookOpen, FileText, File, PlayCircle, Link2, Plus, 
  Check, CheckCircle2, AlertCircle, UploadCloud, Search, Save, 
  ExternalLink, ChevronRight, X, Clock, MapPin
} from 'lucide-react';
import { 
  Materi, Tugas, PengumpulanTugas, NilaiSiswa, User, Kelas, UserRole 
} from '../types';

interface ClassroomProps {
  activeClass: Kelas;
  role: UserRole;
  currentUserId: string;
  materi: Materi[];
  tugas: Tugas[];
  pengumpulanList: PengumpulanTugas[];
  nilaiSiswa: NilaiSiswa[];
  siswaList: User[];
  
  onAddMateri: (materi: Omit<Materi, 'id' | 'tanggalInput'>) => void;
  onAddTugas: (tugas: Omit<Tugas, 'id'>) => void;
  onSubmitTugas: (tugasId: string, fileName: string, textAnswer: string) => void;
  onUpdateNilai: (updatedNilaiSiswa: NilaiSiswa[]) => void;
  onGradeTugas: (pengumpulanId: string, nilai: number) => void;
}

export default function Classroom({
  activeClass,
  role,
  currentUserId,
  materi,
  tugas,
  pengumpulanList,
  nilaiSiswa,
  siswaList,
  onAddMateri,
  onAddTugas,
  onSubmitTugas,
  onUpdateNilai,
  onGradeTugas
}: ClassroomProps) {
  
  const [activeTab, setActiveTab] = useState<'beranda' | 'materi' | 'tugas' | 'nilai' | 'siswa'>('beranda');

  const [showAddMateri, setShowAddMateri] = useState(false);
  const [newMateriJudul, setNewMateriJudul] = useState('');
  const [newMateriTipe, setNewMateriTipe] = useState<'pdf' | 'video' | 'link'>('pdf');
  const [newMateriUrl, setNewMateriUrl] = useState('');
  const [newMateriDeskripsi, setNewMateriDeskripsi] = useState('');

  const [showAddTugas, setShowAddTugas] = useState(false);
  const [newTugasJudul, setNewTugasJudul] = useState('');
  const [newTugasDeskripsi, setNewTugasDeskripsi] = useState('');
  const [newTugasDeadline, setNewTugasDeadline] = useState('2026-06-20');
  const [newTugasTipeAsesmen, setNewTugasTipeAsesmen] = useState<'Formatif' | 'Sumatif' | 'ASAS' | 'ASAT'>('Formatif');

  const [submitTugasId, setSubmitTugasId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileNotes, setUploadedFileNotes] = useState('');

  const [gradingTugasId, setGradingTugasId] = useState<string | null>(null);
  const [tempGrades, setTempGrades] = useState<{ [pengumpulanId: string]: number }>({});

  const [excelData, setExcelData] = useState<NilaiSiswa[]>([]);
  const [isExcelEditing, setIsExcelEditing] = useState(false);

  const [studentSearch, setStudentSearch] = useState('');

  const startSpreadsheetEditing = () => {
    const filtered = nilaiSiswa.filter(n => siswaList.some(s => s.id === n.siswaId));
    setExcelData(JSON.parse(JSON.stringify(filtered)));
    setIsExcelEditing(true);
  };

  const handleExcelCellChange = (index: number, field: 'tugas1' | 'tugas2' | 'uts' | 'uas', valString: string) => {
    const updated = [...excelData];
    const val = parseInt(valString) || 0;
    const checkedVal = Math.min(100, Math.max(0, val));
    updated[index][field] = checkedVal;
    
    const t1 = updated[index].tugas1;
    const t2 = updated[index].tugas2;
    const uts = updated[index].uts;
    const uas = updated[index].uas;
    
    updated[index].nilaiAkhir = Math.round((t1 * 0.2) + (t2 * 0.2) + (uts * 0.3) + (uas * 0.3));
    setExcelData(updated);
  };

  const saveSpreadsheetData = () => {
    onUpdateNilai(excelData);
    setIsExcelEditing(false);
  };

  const classMateri = materi.filter(m => m.kelasId === activeClass.id);
  const classTugas = tugas.filter(t => t.kelasId === activeClass.id);
  const classSiswa = siswaList.filter(s => s.kelasId === activeClass.id);
  const filteredSiswa = classSiswa.filter(s => s.nama.toLowerCase().includes(studentSearch.toLowerCase()));

  const triggerSubmitHomework = (tugasId: string) => {
    setSubmitTugasId(tugasId);
    setUploadedFileName('TUGAS_' + activeClass.nama.replace(/\s+/g, '') + '_' + Date.now().toString().slice(-4) + '.pdf');
  };

  const executeSubmitTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTugasId) return;
    onSubmitTugas(submitTugasId, uploadedFileName || 'Lampiran.pdf', uploadedFileNotes);
    setSubmitTugasId(null);
    setUploadedFileNotes('');
  };

  const handleGradeChange = (pId: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setTempGrades(prev => ({ ...prev, [pId]: num }));
  };

  const handleSaveGrade = (pId: string) => {
    const grade = tempGrades[pId] !== undefined ? tempGrades[pId] : 0;
    onGradeTugas(pId, grade);
  };

  const isGuru = role === 'guru';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Classroom Big Banner Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
        <div className="bg-oxford p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="bg-bronze/20 text-bronze border border-bronze/30 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block">
               Curriculum Module
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
              Mathematics — Cohort {activeClass.nama}
            </h1>
            <p className="text-slate-400 text-sm md:text-lg font-medium opacity-90 max-w-xl">
              Integrated Synchronous Learning Portal • Faculty Advisor: {role === 'guru' ? 'Pak Budi Hartono (System Verified)' : 'Pak Budi Hartono, S.Pd.'}
            </p>
          </div>
          
          <div className="absolute right-12 bottom-1/2 translate-y-1/2 text-white/5 hidden lg:block">
            <BookOpen size={240} strokeWidth={1} />
          </div>
        </div>

        {/* Tab System Selector */}
        <div className="flex bg-white px-4 border-t border-slate-100 overflow-x-auto scrollbar-none">
          {(['beranda', 'materi', 'tugas', 'nilai', 'siswa'] as const).map(tab => {
            const label = tab.charAt(0).toUpperCase() + tab.slice(1);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'border-bronze text-oxford'
                    : 'border-transparent text-slate-400 hover:text-oxford'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[400px]">

        {/* TAB 1: BERANDA */}
        {activeTab === 'beranda' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="card-premium p-8 space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cohort Credentials</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Access Token</label>
                    <span className="text-xl font-serif font-bold text-oxford select-all">M2X_78A</span>
                  </div>
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                       <label className="text-[9px] font-bold text-emerald-700/50 uppercase tracking-widest block">Session Integrity</label>
                       <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">Active & Valid</span>
                    </div>
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-oxford rounded-3xl p-8 text-white space-y-4">
                <h5 className="font-serif font-bold text-xl text-bronze">Faculty Note</h5>
                <p className="text-xs leading-relaxed text-slate-400 font-medium">
                  Synchronous modules are updated daily. Ensure all digital assets are reviewed before submitting compulsory assignments.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {role === 'guru' && (
                <div className="card-premium p-6 flex items-start gap-4 hover:border-bronze/30 transition-all">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 text-oxford font-serif font-black flex items-center justify-center shrink-0 text-lg shadow-inner">
                    PB
                  </div>
                  <div className="flex-1 pt-1">
                    <input 
                      type="text" 
                      placeholder="Post academic update to cohort stream..." 
                      className="w-full text-oxford placeholder-slate-400 bg-transparent border-0 text-sm font-medium focus:outline-none" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {classTugas.map(t => (
                  <div key={t.id} className="card-premium p-8 flex items-start gap-6 group hover:border-bronze/30">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 shadow-sm">
                      <FileText size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Assignment Published</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">LMS Network • 2h ago</span>
                      </div>
                      <h4 className="font-serif font-bold text-xl text-oxford mb-2 group-hover:text-bronze transition-colors leading-tight">{t.judul}</h4>
                      <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">{t.deskripsi}</p>
                      
                      <div className="pt-6 mt-6 border-t border-slate-50">
                        <button 
                          onClick={() => setActiveTab('tugas')} 
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-bronze hover:underline flex items-center gap-2"
                        >
                          View Parameters <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATERI */}
        {activeTab === 'materi' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif font-bold text-2xl text-oxford tracking-tight">Academic Modules</h3>
              {role === 'guru' && !showAddMateri && (
                <button
                  onClick={() => setShowAddMateri(true)}
                  className="bg-oxford text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-md hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <Plus size={14} strokeWidth={2.5} /> Add Module
                </button>
              )}
            </div>

            {role === 'guru' && showAddMateri && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddMateri({
                    kelasId: activeClass.id,
                    mapelId: 'mapel_matematika',
                    mapelNama: 'Matematika',
                    judul: newMateriJudul,
                    tipe: newMateriTipe,
                    url: newMateriUrl || 'Module_Academic_01.pdf',
                    deskripsi: newMateriDeskripsi,
                  });
                  setShowAddMateri(false);
                }}
                className="card-premium p-8 space-y-6 max-w-3xl mx-auto border-bronze/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h4 className="font-serif font-bold text-xl text-oxford">Publish New Module</h4>
                  <button type="button" onClick={() => setShowAddMateri(false)} className="text-slate-400 hover:text-oxford transition-colors">
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Module Title</label>
                    <input 
                      type="text" 
                      required 
                      value={newMateriJudul}
                      onChange={e => setNewMateriJudul(e.target.value)}
                      className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-bronze" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Media Classification</label>
                      <select 
                        value={newMateriTipe}
                        onChange={e => setNewMateriTipe(e.target.value as any)}
                        className="w-full text-sm font-bold text-oxford border border-slate-200 bg-white rounded-xl px-4 py-3 outline-none"
                      >
                        <option value="pdf">Academic Document (PDF)</option>
                        <option value="video">Lecturer Stream (Video)</option>
                        <option value="link">Reference Token (Link)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Source URL / Identifier</label>
                      <input 
                        type="text" 
                        value={newMateriUrl}
                        onChange={e => setNewMateriUrl(e.target.value)}
                        className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Instructional Overview</label>
                    <textarea 
                      rows={3}
                      value={newMateriDeskripsi}
                      onChange={e => setNewMateriDeskripsi(e.target.value)}
                      className="w-full text-sm font-medium text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddMateri(false)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-oxford px-6"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    Commit Publication
                  </button>
                </div>
              </form>
            )}

            <div className="relative border-l-2 border-slate-100 ml-8 pl-12 py-4 space-y-12">
              {classMateri.length === 0 ? (
                <div className="p-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">No synchronous modules indexed.</div>
              ) : (
                classMateri.map((m, idx) => (
                  <div key={m.id} className="relative">
                    <span className="absolute -left-[61px] top-2 flex items-center justify-center h-10 w-10 rounded-2xl bg-oxford text-white font-serif font-bold text-sm ring-8 ring-white shadow-premium">
                      {idx + 1}
                    </span>

                    <div className="card-premium p-8 group hover:border-bronze/30 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Released: {m.tanggalInput}</span>
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full inline-flex items-center gap-2 uppercase tracking-widest border ${
                          m.tipe === 'pdf' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          m.tipe === 'video' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {m.tipe === 'pdf' && <File size={12} strokeWidth={3} />}
                          {m.tipe === 'video' && <PlayCircle size={12} strokeWidth={3} />}
                          {m.tipe === 'link' && <Link2 size={12} strokeWidth={3} />}
                          {m.tipe} Asset
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-2xl text-oxford mb-4 group-hover:text-bronze transition-colors leading-tight">{m.judul}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{m.deskripsi}</p>
                      
                      <div className="pt-6 border-t border-slate-50">
                        {m.tipe === 'video' ? (
                          <div className="aspect-video w-full max-w-2xl rounded-3xl overflow-hidden bg-oxford border border-white/10 shadow-2xl">
                            <iframe className="w-full h-full" src={m.url} title="SyncStream" allowFullScreen></iframe>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-xl group-hover:bg-white transition-colors">
                            <div className="flex items-center gap-4 min-w-0">
                               <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
                                  {m.tipe === 'pdf' ? <File className="text-rose-600" size={24} /> : <Link2 className="text-blue-600" size={24} />}
                               </div>
                               <div className="min-w-0">
                                 <p className="font-bold text-oxford text-sm truncate">{m.url}</p>
                                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{m.tipe} Document Verified</p>
                               </div>
                            </div>
                            <button className="bg-oxford hover:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all shadow-md shrink-0">Open Source</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TUGAS */}
        {activeTab === 'tugas' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif font-bold text-2xl text-oxford">Assignment Queue</h3>
              {role === 'guru' && !showAddTugas && (
                <button
                  onClick={() => setShowAddTugas(true)}
                  className="bg-oxford text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-md"
                >
                  <Plus size={14} strokeWidth={2.5} /> New Assignment
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {classTugas.map(t => {
                const submission = pengumpulanList.find(p => p.tugasId === t.id && p.siswaId === currentUserId);
                const isSubmitted = submission?.status === 'Sudah';
                const countSubmitted = pengumpulanList.filter(p => p.tugasId === t.id && p.status === 'Sudah').length;

                return (
                  <div key={t.id} className="card-premium p-8 group flex flex-col justify-between hover:border-bronze/30">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Clock size={14} className="text-slate-300" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline: {t.deadline}</span>
                        </div>
                        {role === 'siswa' ? (
                          isSubmitted ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Synchronized</span>
                          ) : (
                            <span className="bg-amber-50 text-amber-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100">Outstanding</span>
                          )
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
                            {countSubmitted} / {activeClass.jumlahSiswa} Resolved
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-2xl text-oxford leading-tight group-hover:text-bronze transition-colors">{t.judul}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">{t.deskripsi}</p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50">
                      {role === 'siswa' ? (
                        isSubmitted ? (
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                             <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Authenticated</p>
                                   <p className="font-mono text-[10px] text-oxford font-bold">{submission.fileName}</p>
                                </div>
                                <Check size={18} className="text-emerald-600" strokeWidth={3} />
                             </div>
                             {submission.nilai !== undefined && (
                               <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
                                  <p className="text-[10px] font-black text-oxford uppercase tracking-widest">Faculty Grade</p>
                                  <p className="text-3xl font-serif font-bold text-bronze">{submission.nilai}</p>
                               </div>
                             )}
                          </div>
                        ) : (
                          <button
                            onClick={() => triggerSubmitHomework(t.id)}
                            className="w-full bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                          >
                            Mark as Complete
                          </button>
                        )
                      ) : (
                        <div className="space-y-4">
                           <button
                             onClick={() => setGradingTugasId(gradingTugasId === t.id ? null : t.id)}
                             className={`w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                               gradingTugasId === t.id ? 'bg-oxford text-white shadow-xl' : 'bg-slate-100 text-oxford hover:bg-slate-200'
                             }`}
                           >
                             {gradingTugasId === t.id ? 'Close Evaluation' : 'Evaluate Records'}
                           </button>
                           {gradingTugasId === t.id && (
                             <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6">
                               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Submissions</h5>
                               <div className="divide-y divide-slate-200 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                 {pengumpulanList.filter(p => p.tugasId === t.id && p.status === 'Sudah').map(sub => {
                                   const stud = siswaList.find(s => s.id === sub.siswaId);
                                   return (
                                     <div key={sub.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                                       <div className="flex items-center justify-between">
                                          <p className="font-bold text-oxford text-sm">{stud?.nama}</p>
                                          <div className="flex items-center gap-3">
                                            <input type="number" value={tempGrades[sub.id] || sub.nilai || ''} onChange={e => handleGradeChange(sub.id, e.target.value)} className="w-16 text-center border-b-2 border-slate-200 bg-transparent text-lg font-serif font-bold text-oxford focus:border-bronze outline-none" />
                                            <button onClick={() => handleSaveGrade(sub.id)} className="bg-bronze text-white p-2 rounded-lg shadow-sm"><Check size={14} strokeWidth={3} /></button>
                                          </div>
                                       </div>
                                     </div>
                                   );
                                 })}
                               </div>
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: NILAI */}
        {activeTab === 'nilai' && (
          <div className="card-premium p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div>
                <h3 className="font-serif font-bold text-2xl text-oxford">Digital Ledger</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Curriculum aligned achievement matrix.</p>
              </div>

              {role === 'guru' && (
                <div className="flex items-center gap-4">
                  {!isExcelEditing ? (
                    <button 
                      onClick={startSpreadsheetEditing}
                      className="bg-oxford text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-md"
                    >
                      <Plus size={14} className="inline mr-2" /> Spreadsheet Integration
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsExcelEditing(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Abort</button>
                      <button onClick={saveSpreadsheetData} className="bg-bronze text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-md">Sync Data</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 select-none">
                    <th className="p-6 font-black uppercase tracking-widest w-12 text-center">ID</th>
                    <th className="p-6 font-black uppercase tracking-widest">Identity</th>
                    <th className="p-6 font-black uppercase tracking-widest text-center w-32">Task 1 (20%)</th>
                    <th className="p-6 font-black uppercase tracking-widest text-center w-32">Task 2 (20%)</th>
                    <th className="p-6 font-black uppercase tracking-widest text-center w-32">Mid-Term (30%)</th>
                    <th className="p-6 font-black uppercase tracking-widest text-center w-32">Final (30%)</th>
                    <th className="p-6 font-black uppercase tracking-widest text-center w-40 bg-blue-50/30 text-oxford">Compute (100%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(isExcelEditing ? excelData : nilaiSiswa.filter(n => siswaList.some(s => s.id === n.siswaId))).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-6 text-center text-slate-300 font-mono font-bold tracking-tighter">0{idx + 1}</td>
                      <td className="p-6 font-bold text-oxford">{row.siswaNama}</td>
                      {['tugas1', 'tugas2', 'uts', 'uas'].map(field => (
                        <td key={field} className="p-4 text-center">
                          {isExcelEditing ? (
                            <input type="number" value={row[field as keyof NilaiSiswa] as number} onChange={(e) => handleExcelCellChange(idx, field as any, e.target.value)} className="w-20 text-center border-b border-slate-200 bg-white rounded-lg p-2 text-sm font-bold text-oxford focus:border-bronze outline-none" />
                          ) : (
                            <span className="font-bold text-slate-500">{row[field as keyof NilaiSiswa] as number}</span>
                          )}
                        </td>
                      ))}
                      <td className="p-6 text-center font-serif font-black bg-blue-50/20 text-oxford text-xl">
                        {row.nilaiAkhir}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SISWA */}
        {activeTab === 'siswa' && (
          <div className="card-premium p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div>
                <h3 className="font-serif font-bold text-2xl text-oxford">Cohort Directory</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active student membership for Class {activeClass.nama}.</p>
              </div>

              <div className="relative max-w-sm w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Filter student directory..." 
                  className="w-full text-xs font-bold text-oxford border border-slate-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-bronze bg-slate-50/50 shadow-inner" 
                />
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center justify-between p-6 rounded-3xl border border-indigo-100 bg-indigo-50/20 shadow-sm">
                <div className="flex items-center gap-6">
                  <img src="https://pravatar.cc/150?u=guru" className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-md" alt="Lead Faculty" />
                  <div>
                    <h4 className="font-serif font-bold text-xl text-oxford leading-none">Pak Budi Hartono, S.Pd.</h4>
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-2">Lead Faculty • Module Architect</p>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-700 shadow-sm">Verified Faculty</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSiswa.map(s => (
                  <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-bronze/30 hover:shadow-md transition-all cursor-pointer group">
                    <img src={s.avatar || 'https://pravatar.cc/150'} className="h-12 w-12 rounded-xl object-cover border border-slate-100 shrink-0 group-hover:scale-105 transition-transform" alt={s.nama} />
                    <div className="min-w-0">
                      <h5 className="font-bold text-oxford text-sm truncate">{s.nama}</h5>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">NISN: {s.nisnOrNip || '12230495'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SUBMIT MODAL (Overlay) */}
      {submitTugasId && (
        <div className="fixed inset-0 bg-oxford/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <form onSubmit={executeSubmitTugas} className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-oxford p-8 text-white flex justify-between items-center">
                 <h4 className="font-serif font-bold text-2xl">Asset Submission</h4>
                 <button type="button" onClick={() => setSubmitTugasId(null)} className="text-slate-400 hover:text-white"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-8">
                 <div className="border-4 border-dashed border-slate-100 rounded-3xl p-10 text-center bg-slate-50 group hover:border-bronze/30 transition-all cursor-pointer">
                    <UploadCloud className="mx-auto text-bronze mb-4 group-hover:scale-110 transition-transform" size={56} strokeWidth={1.5} />
                    <p className="font-bold text-oxford text-base">Academic Asset Detected</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{uploadedFileName}</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Instructional Notes (Optional)</label>
                    <textarea value={uploadedFileNotes} onChange={e => setUploadedFileNotes(e.target.value)} rows={3} className="w-full text-sm font-medium text-oxford border border-slate-200 rounded-2xl p-4 outline-none focus:border-bronze" placeholder="Enter academic justification or context..."></textarea>
                 </div>
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setSubmitTugasId(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Abort</button>
                    <button type="submit" className="flex-1 bg-oxford text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl shadow-xl transition-all active:scale-[0.98]">Authenticate & Submit</button>
                 </div>
              </div>
           </form>
        </div>
      )}

    </div>
  );
}
