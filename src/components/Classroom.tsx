import React, { useState } from 'react';
import { 
  BookOpen, FileText, File, PlayCircle, Link2, Plus, 
  Check, CheckCircle2, AlertCircle, UploadCloud, Search, Save, 
  ExternalLink, UserCheck, HelpCircle, ChevronRight, CornerDownRight, X
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

  // Interactive Form States
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

  // Submit Homework State
  const [submitTugasId, setSubmitTugasId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileNotes, setUploadedFileNotes] = useState('');

  // Teacher Grading View State
  const [gradingTugasId, setGradingTugasId] = useState<string | null>(null);
  const [tempGrades, setTempGrades] = useState<{ [pengumpulanId: string]: number }>({});

  // spreadsheet / Excel state
  const [excelData, setExcelData] = useState<NilaiSiswa[]>([]);
  const [isExcelEditing, setIsExcelEditing] = useState(false);

  // Student list search
  const [studentSearch, setStudentSearch] = useState('');

  // Initialize spreadsheet when Nilai tab is opened
  const startSpreadsheetEditing = () => {
    // Deep clone the current state
    const filtered = nilaiSiswa.filter(n => siswaList.some(s => s.id === n.siswaId));
    setExcelData(JSON.parse(JSON.stringify(filtered)));
    setIsExcelEditing(true);
  };

  const handleExcelCellChange = (index: number, field: 'tugas1' | 'tugas2' | 'uts' | 'uas', valString: string) => {
    const updated = [...excelData];
    const val = parseInt(valString) || 0;
    
    // Bounds check
    const checkedVal = Math.min(100, Math.max(0, val));
    updated[index][field] = checkedVal;
    
    // Recalculate Nilai Akhir: (T1*0.2) + (T2*0.2) + (UTS*0.3) + (UAS*0.3)
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
    // Trigger notification
    alert('Semua nilai berhasil disimpan ke rapor digital!');
  };

  // Class specific materials and assignments
  const classMateri = materi.filter(m => m.kelasId === activeClass.id);
  const classTugas = tugas.filter(t => t.kelasId === activeClass.id);
  const classSiswa = siswaList.filter(s => s.kelasId === activeClass.id);

  // Filter siswa based on simple search
  const filteredSiswa = classSiswa.filter(s => s.nama.toLowerCase().includes(studentSearch.toLowerCase()));

  // Helpers for submitting homework
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
    alert('Tugas Berhasil Dikumpulkan!');
  };

  // Helper for teacher grading
  const handleGradeChange = (pId: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setTempGrades(prev => ({ ...prev, [pId]: num }));
  };

  const handleSaveGrade = (pId: string) => {
    const grade = tempGrades[pId] !== undefined ? tempGrades[pId] : 0;
    onGradeTugas(pId, grade);
    alert('Nilai latihan tersimpan!');
  };

  const isGuru = role === 'guru';
  const cTheme = {
    gradient: isGuru ? 'bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-600' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700',
    tabActive: isGuru ? 'border-teal-600 text-teal-600 bg-teal-50/20' : 'border-blue-600 text-blue-600 bg-blue-50/20',
    textAccent: isGuru ? 'text-teal-600' : 'text-blue-600',
    bgAccent: isGuru ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700',
    bgLight: isGuru ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600',
    btnSmAccent: isGuru ? 'text-teal-600 hover:text-teal-700 font-bold hover:underline transition-all flex items-center gap-0.5' : 'text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all flex items-center gap-0.5',
    borderColorHover: isGuru ? 'hover:border-teal-500' : 'hover:border-blue-400'
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Classroom Big Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className={`${cTheme.gradient} p-6 md:p-8 text-white relative`}>
          <div className="relative z-10 space-y-2">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              KBM SMAN 1 Modern
            </span>
            <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight">
              Matematika — Kelas {activeClass.nama}
            </h1>
            <p className="text-indigo-50 text-sm md:text-base opacity-90">
              Roster KBM Terintegrasi • Wali Kelas: {role === 'guru' ? 'Pak Budi Hartono (Anda)' : 'Pak Budi Hartono, S.Pd.'}
            </p>
          </div>
          
          <div className="absolute right-6 bottom-4 md:bottom-6 text-white/10 hidden sm:block">
            <BookOpen size={100} />
          </div>
        </div>

        {/* Tab System Selector */}
        <div className="flex border-t border-slate-100 overflow-x-auto scrollbar-none scroll-smooth">
          {(['beranda', 'materi', 'tugas', 'nilai', 'siswa'] as const).map(tab => {
            const label = tab.charAt(0).toUpperCase() + tab.slice(1);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-bold text-sm tracking-wide border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? cTheme.tabActive
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Classroom Content Box */}
      <div className="min-h-[400px]">

        {/* TAB 1: BERANDA (STREAM UPDATES) */}
        {activeTab === 'beranda' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left sidebar: Class code & quick info */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Kelas</h4>
                <div>
                  <label className="text-xs text-slate-500 block">Kode Google Classroom</label>
                  <span className="text-base font-bold text-indigo-600 font-mono select-all">m2x_78a</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">Status Absensi Hari Ini</label>
                  <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">
                    Hadir Lancar
                  </span>
                </div>
              </div>

              <div className="bg-indigo-50/40 rounded-2xl p-5 border border-indigo-50/50 space-y-2 text-indigo-950">
                <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-700">Tips Kegiatan</h5>
                <p className="text-xs leading-relaxed">
                  Semua materi di-update secara berkala. Pastikan Anda telah mengunduh semua materi (Bab) pdf dan melihat video pembahasan sebelum mengerjakan Tugas Mandiri.
                </p>
              </div>
            </div>

            {/* Main Stream Block */}
            <div className="lg:col-span-9 space-y-4">
              
              {/* Fake announcement input for Guru */}
              {role === 'guru' && (
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center shrink-0 text-sm">
                    PB
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Bagikan sesuatu dengan kelas Anda..." 
                      className="w-full text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" 
                    />
                  </div>
                </div>
              )}

              {/* Stream Feed */}
              <div className="space-y-4">
                {classTugas.map(t => (
                  <div key={`stream-t-${t.id}`} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs text-slate-400">Guru membagikan tugas baru</span>
                        <span className="text-[11px] text-slate-400 font-medium">Melalui LMS • 2 jam lalu</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">{t.judul}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{t.deskripsi}</p>
                      
                      <div className="pt-2">
                        <button 
                          onClick={() => setActiveTab('tugas')} 
                          className={`text-xs font-bold hover:underline transition-all flex items-center gap-0.5 ${cTheme.textAccent}`}
                        >
                          Lihat detail Tugas <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {classMateri.map(m => (
                  <div key={`stream-m-${m.id}`} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs text-slate-400">Guru merilis modul pelajaran baru</span>
                        <span className="text-[11px] text-slate-400 font-medium">Melalui LMS • Kemarin</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">{m.judul}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{m.deskripsi}</p>
                      
                      <div className="pt-2">
                        <button 
                          onClick={() => setActiveTab('materi')} 
                          className={`text-xs font-bold hover:underline transition-all flex items-center gap-0.5 ${cTheme.textAccent}`}
                        >
                          Lihat detail materi pembelajaran <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}


        {/* TAB 2: MATERI (TIMELINE VIEW) */}
        {activeTab === 'materi' && (
          <div className="space-y-6">
            
            {/* Toolbar Guru: Add new Lesson Materi */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base">Roster Materi Pembelajaran</h3>
              
              {role === 'guru' && !showAddMateri && (
                <button
                  id="btn-add-materi-open"
                  onClick={() => setShowAddMateri(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={14} /> Tambah Materi Baru
                </button>
              )}
            </div>

            {/* Add Materi Form Panel */}
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
                    url: newMateriUrl || 'Modul_Akademis_Baru.pdf',
                    deskripsi: newMateriDeskripsi,
                  });
                  setShowAddMateri(false);
                  setNewMateriJudul('');
                  setNewMateriDeskripsi('');
                  setNewMateriUrl('');
                  alert('Materi baru berhasil dipublikasikan!');
                }}
                className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm space-y-4 max-w-2xl mx-auto"
                id="form-tambah-materi"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800">Form Publikasi Materi Baru</h4>
                  <button type="button" onClick={() => setShowAddMateri(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Judul Materi (Misal: Bab 3 - Trigonometri)</label>
                    <input 
                      type="text" 
                      required 
                      value={newMateriJudul}
                      onChange={e => setNewMateriJudul(e.target.value)}
                      placeholder="Masukkan judul materi..." 
                      className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Tipe Media</label>
                      <select 
                        value={newMateriTipe}
                        onChange={e => setNewMateriTipe(e.target.value as any)}
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="pdf">File PDF Modul</option>
                        <option value="video">Video YouTube</option>
                        <option value="link">Link Tautan Web</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">URL Lampiran / Link YouTube</label>
                      <input 
                        type="text" 
                        value={newMateriUrl}
                        onChange={e => setNewMateriUrl(e.target.value)}
                        placeholder="Misal: Modul_Mandiri.pdf / URL YouTube..." 
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Deskripsi Singkat / Catatan Guru</label>
                    <textarea 
                      rows={3}
                      value={newMateriDeskripsi}
                      onChange={e => setNewMateriDeskripsi(e.target.value)}
                      placeholder="Tulis instruksi atau deskripsi ringkas isi materi di sini..."
                      className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddMateri(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    id="submit-materi-btn"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer"
                  >
                    Publikasikan
                  </button>
                </div>
              </form>
            )}

            {/* Chronological Vertical Timeline */}
            {classMateri.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                Belum ada materi pembelajaran yang dirilis untuk mapel ini.
              </div>
            ) : (
              <div className="relative border-l-2 border-blue-100 ml-4 md:ml-8 pl-6 md:pl-10 py-2 space-y-8">
                {classMateri.map((m, idx) => (
                  <div key={m.id} className="relative group" id={`materi-item-${m.id}`}>
                    
                    {/* Circle Node Icon */}
                    <span className="absolute -left-[35px] md:-left-[51px] top-1.5 flex items-center justify-center h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-600 text-white font-bold text-xs ring-4 ring-white shadow">
                      {idx + 1}
                    </span>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Dirilis pada {m.tanggalInput}
                        </span>
                        
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          m.tipe === 'pdf' ? 'bg-rose-50 text-rose-700' :
                          m.tipe === 'video' ? 'bg-amber-50 text-amber-700' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {m.tipe === 'pdf' && <File size={12} />}
                          {m.tipe === 'video' && <PlayCircle size={12} />}
                          {m.tipe === 'link' && <Link2 size={12} />}
                          {m.tipe.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-800 text-lg">{m.judul}</h4>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">{m.deskripsi}</p>
                      
                      {/* Attached media preview */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        {m.tipe === 'video' ? (
                          <div className="space-y-3">
                            <div className="aspect-video w-full max-w-md rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative group">
                              <iframe 
                                className="w-full h-full"
                                src={m.url} 
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              ></iframe>
                            </div>
                            <p className="text-xs text-slate-500 italic">▶ Video YouTube Pembahasan Terintegrasi</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-md">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="p-2 rounded-lg bg-white border border-slate-200">
                                {m.tipe === 'pdf' ? <File className="text-rose-600" size={18} /> : <Link2 className="text-blue-600" size={18} />}
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 text-xs truncate">{m.url}</p>
                                <p className="text-[10px] text-slate-400">{m.tipe === 'pdf' ? 'Dokumen PDF Modul' : 'Tautan Pendukung'}</p>
                              </div>
                            </div>

                            <a 
                              href={m.tipe === 'link' ? m.url : '#'} 
                              onClick={(e) => m.tipe !== 'link' && e.preventDefault()}
                              target="_blank" 
                              rel="noreferrer"
                              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                            >
                              Buka <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* TAB 3: TUGAS (CARDS & SUBMIT OR APPRAISE) */}
        {activeTab === 'tugas' && (
          <div className="space-y-6">
            
            {/* Header / Add buttons for Guru */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base">Penugasan Mandiri dan Evaluasi</h3>
              
              {role === 'guru' && !showAddTugas && (
                <button
                  id="btn-add-tugas-open"
                  onClick={() => setShowAddTugas(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={14} /> Buat Tugas Baru
                </button>
              )}
            </div>

            {/* Form Buat Tugas Baru bagi Guru */}
            {role === 'guru' && showAddTugas && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddTugas({
                    kelasId: activeClass.id,
                    mapelId: 'mapel_matematika',
                    mapelNama: 'Matematika',
                    judul: newTugasJudul,
                    deskripsi: newTugasDeskripsi,
                    deadline: newTugasDeadline,
                    tipeAsesmen: newTugasTipeAsesmen,
                  });
                  setShowAddTugas(false);
                  setNewTugasJudul('');
                  setNewTugasDeskripsi('');
                  alert('Tugas baru sukses diterbitkan untuk kelas ini!');
                }}
                className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm space-y-4 max-w-2xl mx-auto"
                id="form-tambah-tugas"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800">Form Pembuatan Tugas Baru</h4>
                  <button type="button" onClick={() => setShowAddTugas(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Judul / Tema Tugas</label>
                      <input 
                        type="text" 
                        required 
                        value={newTugasJudul}
                        onChange={e => setNewTugasJudul(e.target.value)}
                        placeholder="Masukkan judul tugas..." 
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Jenis Asesmen (Kurikulum Merdeka)</label>
                      <select
                        value={newTugasTipeAsesmen}
                        onChange={e => setNewTugasTipeAsesmen(e.target.value as any)}
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Formatif">Formatif (Tugas Harian)</option>
                        <option value="Sumatif">Sumatif (UH / Akhir TP)</option>
                        <option value="ASAS">ASAS (Asesmen Sumatif Akhir Semester)</option>
                        <option value="ASAT">ASAT (Asesmen Sumatif Akhir Tahun)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Batas Pengumpulan (Deadline)</label>
                    <input 
                      type="date" 
                      required 
                      value={newTugasDeadline}
                      onChange={e => setNewTugasDeadline(e.target.value)}
                      className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Instruksi Soal Lengkap</label>
                    <textarea 
                      rows={4}
                      value={newTugasDeskripsi}
                      onChange={e => setNewTugasDeskripsi(e.target.value)}
                      placeholder="Jelaskan detail soal, nomor halaman, atau rubrik penilaian..."
                      className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddTugas(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    id="submit-tugas-btn"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer"
                  >
                    Terbitkan Tugas
                  </button>
                </div>
              </form>
            )}

            {/* SIMULASI SUBMIT TUGAS OLEH SISWA */}
            {role === 'siswa' && submitTugasId && (
              <form 
                onSubmit={executeSubmitTugas}
                className="bg-white rounded-2xl p-6 border border-blue-200 shadow-md space-y-4 max-w-lg mx-auto"
                id="form-upload-tugas"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-base">Kumpulkan Tugas Mandiri</h4>
                  <button type="button" onClick={() => setSubmitTugasId(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50 group hover:border-blue-400 transition-colors">
                    <UploadCloud className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={40} />
                    <p className="font-bold text-xs text-slate-700">File pdf simulasi terdeteksi</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{uploadedFileName}</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Catatan Tambahan untuk Guru (Opsional)</label>
                    <textarea 
                      rows={2}
                      value={uploadedFileNotes}
                      onChange={e => setUploadedFileNotes(e.target.value)}
                      placeholder="Tulis pesan Anda disini..."
                      className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-xs font-bold">
                  <button type="button" onClick={() => setSubmitTugasId(null)} className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg">
                    Batal
                  </button>
                  <button type="submit" id="btn-submit-real" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                    Kirim Tugas Sekarang
                  </button>
                </div>
              </form>
            )}

            {/* List Tugas Layout */}
            {classTugas.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-400">
                Alhamdulillah! Berita baik, tidak ada tugas terjadwal untuk kelas ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classTugas.map(t => {
                  
                  // For student: check individual submission
                  const submission = pengumpulanList.find(p => p.tugasId === t.id && p.siswaId === currentUserId);
                  const isSubmitted = submission?.status === 'Sudah';
                  
                  // For teacher: check total submissions
                  const allSubmissionsForThisTugas = pengumpulanList.filter(p => p.tugasId === t.id && p.status === 'Sudah');
                  const countSubmitted = allSubmissionsForThisTugas.length;

                  return (
                    <div 
                      key={t.id}
                      id={`tugas-card-${t.id}`}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow hover:border-slate-200 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            Batas: {t.deadline}
                          </span>

                          {role === 'siswa' ? (
                            isSubmitted ? (
                              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} /> Sudah Dikumpulkan
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <AlertCircle size={12} /> Belum Dikumpulkan
                              </span>
                            )
                          ) : (
                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              {countSubmitted} dari {activeClass.jumlahSiswa} Siswa
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-slate-800 text-lg">{t.judul}</h4>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{t.deskripsi}</p>
                      </div>

                      {/* Action trigger */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        {role === 'siswa' ? (
                          isSubmitted ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-slate-400 block font-semibold">Lampiran Dikumpul:</span>
                                  <span className="font-mono text-[10px] text-slate-700 font-semibold">{submission.fileName}</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                  <Check size={12} /> Diserahkan
                                </span>
                              </div>
                              
                              {submission.nilai !== undefined && (
                                <div className="text-sm flex items-center justify-between font-bold bg-emerald-50/50 p-2.5 rounded-xl text-emerald-800 border border-emerald-50">
                                  <span>Nilai Evaluasi Guru:</span>
                                  <span className="text-lg">{submission.nilai} / 100</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              id={`upload-tugas-${t.id}`}
                              onClick={() => triggerSubmitHomework(t.id)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer text-center block"
                            >
                              Upload Tugas
                            </button>
                          )
                        ) : (
                          // For Teacher: Click to open/close detailed grading drawer
                          <div className="space-y-4">
                            <button
                              id={`btn-nilai-tugas-${t.id}`}
                              onClick={() => setGradingTugasId(gradingTugasId === t.id ? null : t.id)}
                              className={`w-full text-xs font-bold py-2 rounded-lg transition-all text-center block cursor-pointer ${
                                gradingTugasId === t.id
                                  ? 'bg-slate-800 text-white'
                                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                              }`}
                            >
                              {gradingTugasId === t.id ? 'Tutup Daftar Evaluasi ✕' : 'Lihat & Nilai Jawaban Siswa'}
                            </button>

                            {/* Floating Submissions List inside Card */}
                            {gradingTugasId === t.id && (
                              <div className="animated-fade bg-slate-50/60 p-3 rounded-xl border border-slate-100 mt-2 space-y-3">
                                <h5 className="text-xs font-bold text-slate-500">Berkas Jawaban Masuk</h5>
                                
                                {allSubmissionsForThisTugas.length === 0 ? (
                                  <p className="text-[11px] text-center text-slate-400 py-2">Belum ada siswa yang mengumpulkan berkas.</p>
                                ) : (
                                  <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
                                    {allSubmissionsForThisTugas.map(sub => {
                                      const stud = siswaList.find(s => s.id === sub.siswaId);
                                      const hasGrade = sub.nilai !== undefined;
                                      return (
                                        <div key={sub.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                                          <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-bold text-slate-800">{stud?.nama}</span>
                                            <span className="font-mono text-[10px] text-slate-400 max-w-[120px] truncate">{sub.fileName}</span>
                                          </div>
                                          {sub.textAnswer && (
                                            <p className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded border border-slate-50 mb-2">
                                              &ldquo;{sub.textAnswer}&rdquo;
                                            </p>
                                          )}

                                          {/* Simple grading form */}
                                          <div className="flex items-center gap-1.5 justify-end">
                                            <span className="text-[10px] text-slate-400">Nilai:</span>
                                            <input 
                                              type="number" 
                                              placeholder="0-100"
                                              value={tempGrades[sub.id] !== undefined ? tempGrades[sub.id] : (sub.nilai || '')}
                                              onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                                              className="w-14 text-center border bg-white border-slate-200 text-xs py-0.5 rounded focus:outline-none"
                                            />
                                            <button 
                                              onClick={() => handleSaveGrade(sub.id)}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded"
                                            >
                                              Simpan
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {/* TAB 4: SPREADSHEET NILAI (EXCEL STYLE INTERACTIVE) */}
        {activeTab === 'nilai' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            
            {/* Header Control */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Buku Nilai Digital &amp; Pengolahan Nilai Rapor</h3>
                <p className="text-xs text-slate-500">
                  {role === 'guru' 
                    ? 'Gunakan spreadsheet interaktif ini untuk input cepat nilai semester satu kelas sekaligus.' 
                    : 'Transkrip nilai Anda terhitung otomatis berdasarkan penugasan akademik.'}
                </p>
              </div>

              {role === 'guru' && (
                <div>
                  {!isExcelEditing ? (
                    <button 
                      id="btn-edit-excel"
                      onClick={startSpreadsheetEditing}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus size={14} /> Buka Mode Spreadsheet (Excel)
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsExcelEditing(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                      >
                        Batal
                      </button>
                      <button 
                        id="btn-save-excel"
                        onClick={saveSpreadsheetData}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Save size={14} /> Simpan Spreadsheet
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Excel spreadsheet Grid */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 select-none">
                    <th className="p-3 font-semibold w-12 text-center">No</th>
                    <th className="p-3 font-semibold">Nama Lengkap</th>
                    <th className="p-3 font-semibold text-center w-24">Tugas 1 (20%)</th>
                    <th className="p-3 font-semibold text-center w-24">Tugas 2 (20%)</th>
                    <th className="p-3 font-semibold text-center w-24">UTS (30%)</th>
                    <th className="p-3 font-semibold text-center w-24">UAS (30%)</th>
                    <th className="p-3 font-semibold text-center w-28 bg-blue-50 text-blue-800">Nilai Akhir (100%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* If editable */}
                  {isExcelEditing ? (
                    excelData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/40">
                        <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-800">{row.siswaNama}</td>
                        <td className="p-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={row.tugas1}
                            onChange={(e) => handleExcelCellChange(idx, 'tugas1', e.target.value)}
                            className="w-16 text-center border border-slate-200 rounded px-1.5 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={row.tugas2}
                            onChange={(e) => handleExcelCellChange(idx, 'tugas2', e.target.value)}
                            className="w-16 text-center border border-slate-200 rounded px-1.5 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={row.uts}
                            onChange={(e) => handleExcelCellChange(idx, 'uts', e.target.value)}
                            className="w-16 text-center border border-slate-200 rounded px-1.5 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={row.uas}
                            onChange={(e) => handleExcelCellChange(idx, 'uas', e.target.value)}
                            className="w-16 text-center border border-slate-200 rounded px-1.5 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                          />
                        </td>
                        <td className="p-3 text-center font-extrabold bg-blue-50/50 text-blue-700 font-mono text-base">
                          {row.nilaiAkhir}
                        </td>
                      </tr>
                    ))
                  ) : (
                    nilaiSiswa.filter(n => siswaList.some(s => s.id === n.siswaId)).map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/30">
                        <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-800">{row.siswaNama}</td>
                        <td className="p-3 text-center font-bold text-slate-700">{row.tugas1}</td>
                        <td className="p-3 text-center font-bold text-slate-700">{row.tugas2}</td>
                        <td className="p-3 text-center font-bold text-slate-700">{row.uts}</td>
                        <td className="p-3 text-center font-bold text-slate-700">{row.uas}</td>
                        <td className="p-3 text-center font-extrabold bg-blue-50/35 text-blue-600 font-mono text-sm md:text-base">
                          {row.nilaiAkhir}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total summary info */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 border-t border-slate-100 pt-4">
              <span>Metode kalkulasi otomatis: <code>Nilai Akhir = (Tugas 1 * 20%) + (Tugas 2 * 20%) + (UTS * 30%) + (UAS * 30%)</code></span>
              {role === 'guru' && !isExcelEditing && (
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-sm">Klik Tombol <strong>Mode Spreadsheet</strong> di atas untuk merubah data Excel.</span>
              )}
            </div>

          </div>
        )}


        {/* TAB 5: SISWA (CLASSROOM ROSTER) */}
        {activeTab === 'siswa' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            
            {/* Search tool */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Roster Siswa Terdaftar</h3>
                <p className="text-xs text-slate-500">Semua anggota siswa aktif di kelas {activeClass.nama}.</p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Cari siswa..." 
                  className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50" 
                />
              </div>
            </div>

            {/* Classmates roster list */}
            {filteredSiswa.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">Siswa tidak ditemukan.</p>
            ) : (
              <div className="space-y-4">
                
                {/* Teacher item first */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-50/50 bg-indigo-50/20">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" 
                      alt="Avatar Guru" 
                      className="h-10 w-10 rounded-full object-cover border border-indigo-200" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Pak Budi Hartono, S.Pd.</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wali Kelas / Guru Pengampu</p>
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">
                    Pemilik Kelas
                  </span>
                </div>

                {/* Separator */}
                <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-widest pt-2">Teman Sekelas ({filteredSiswa.length})</h5>

                {/* Students list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredSiswa.map(s => (
                    <div 
                      key={s.id} 
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all"
                    >
                      <img 
                        src={s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'} 
                        alt={s.nama} 
                        className="h-9 w-9 rounded-full object-cover border border-slate-100 shrink-0" 
                      />
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">{s.nama}</h5>
                        <p className="text-[10px] text-slate-400">NISN: {s.nisnOrNip || 'A6681023'}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
