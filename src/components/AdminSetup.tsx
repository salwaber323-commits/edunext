import React, { useState } from 'react';
import { 
  FolderLock, Server, Plus, Trash2, 
  UserPlus, Layers, BookOpen, Clock,
  Printer, Settings, CheckCircle2, AlertCircle, ShieldAlert,
  Download, UploadCloud, ArrowRight
} from 'lucide-react';
import { User, Kelas, RaporP5, NilaiSiswa } from '../types';

interface AdminSetupProps {
  kelas: Kelas[];
  siswaList: User[];
  materiCount: number;
  tugasCount: number;
  nilaiSiswa: NilaiSiswa[];
  raporP5: RaporP5[];
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  onAddKelas: (newKelas: { nama: string, jumlahSiswa: number }) => void;
  onDeleteKelas: (kelasId: string) => void;
  onAddSiswa: (newSiswa: { nama: string, nisn: string, kelasId: string }) => void;
  onDeleteSiswa: (siswaId: string) => void;
  onMassImportSiswa: (data: string) => void;
  onPromoteClasses: () => Promise<void>;
  onArchiveAlumni: () => Promise<void>;
  onUpdateSettings: (tahunAjaran: string, semester: 'Ganjil' | 'Genap') => Promise<void>;
  onResetSemester: () => Promise<void>;
}

export default function AdminSetup({
  kelas,
  siswaList,
  materiCount,
  tugasCount,
  nilaiSiswa,
  raporP5,
  tahunAjaran: PropTahunAjaran,
  semester: PropSemester,
  onAddKelas,
  onDeleteKelas,
  onAddSiswa,
  onDeleteSiswa,
  onMassImportSiswa,
  onPromoteClasses,
  onArchiveAlumni,
  onUpdateSettings,
  onResetSemester
}: AdminSetupProps) {
  const [activeSubTab, setActiveSubTab] = useState<'akademik' | 'kelas' | 'siswa' | 'guru' | 'rapor'>('akademik');
  
  const [tahunAjaran, setTahunAjaran] = useState(PropTahunAjaran);
  const [semesterTipe, setSemesterTipe] = useState<'Ganjil' | 'Genap'>(PropSemester);
  const [isTaSaved, setIsTaSaved] = useState(false);

  const [newKelasNama, setNewKelasNama] = useState('');
  const [newSiswaNama, setNewSiswaNama] = useState('');
  const [newSiswaNisn, setNewSiswaNisn] = useState('');
  const [selectedClassIdForNewSiswa, setSelectedClassIdForNewSiswa] = useState(kelas[0]?.id || 'kelas_x_ipa_1');

  const [guruAssignments, setGuruAssignments] = useState([
    { id: 'ga_1', namaGuru: 'Pak Budi Hartono, S.Pd.', mapel: 'Matematika', kelas: 'X IPA 1' },
    { id: 'ga_2', namaGuru: 'Ibu Ratna Dewi, M.Pd.', mapel: 'Fisika', kelas: 'XI IPA 2' },
    { id: 'ga_3', namaGuru: 'Pak Ahmad Yani, S.Ag.', mapel: 'Pendidikan Agama Islam', kelas: 'X IPA 1' },
  ]);
  const [newGuruNama, setNewGuruNama] = useState('');
  const [newGuruMapel, setNewGuruMapel] = useState('Matematika');
  const [newGuruKelas, setNewGuruKelas] = useState('X IPA 1');

  const [selectedClassForReport, setSelectedClassForReport] = useState(kelas[0]?.id || 'kelas_x_ipa_1');
  const [isGeneratingMassReport, setIsGeneratingMassReport] = useState(false);
  const [massReportProgress, setMassReportProgress] = useState(0);
  const [activePreviewStudent, setActivePreviewStudent] = useState<User | null>(null);
  const [previewReportType, setPreviewReportType] = useState<'akademik' | 'p5'>('akademik');

  const [siswaRegistrationMode, setSiswaRegistrationMode] = useState<'individual' | 'excel'>('individual');
  const [excelSiswaText, setExcelSiswaText] = useState('');
  
  const [guruRegistrationMode, setGuruRegistrationMode] = useState<'individual' | 'excel'>('individual');
  const [excelGuruText, setExcelGuruText] = useState('');

  const [activeSiswaFilter, setActiveSiswaFilter] = useState<string>('all');
  const [isPromotingState, setIsPromotingState] = useState(false);
  const [promotionLog, setPromotionLog] = useState<string[]>([]);
  const [isArchivingState, setIsArchivingState] = useState(false);

  const handleSaveTahunAjaran = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings(tahunAjaran, semesterTipe);
    setIsTaSaved(true);
    setTimeout(() => setIsTaSaved(false), 3000);
  };

  const handleAddKelasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKelasNama.trim()) return;
    onAddKelas({
      nama: newKelasNama,
      jumlahSiswa: 0
    });
    setNewKelasNama('');
  };

  const handleAddSiswaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiswaNama.trim() || !newSiswaNisn.trim()) return;
    onAddSiswa({
      nama: newSiswaNama,
      nisn: newSiswaNisn,
      kelasId: selectedClassIdForNewSiswa
    });
    setNewSiswaNama('');
    setNewSiswaNisn('');
  };

  const handleAddGuruAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuruNama.trim()) return;
    const newAss = {
      id: `ga_${Date.now()}`,
      namaGuru: newGuruNama,
      mapel: newGuruMapel,
      kelas: newGuruKelas
    };
    setGuruAssignments([...guruAssignments, newAss]);
    setNewGuruNama('');
  };

  const handleGenerateMassReport = () => {
    setIsGeneratingMassReport(true);
    setMassReportProgress(0);
    const interval = setInterval(() => {
      setMassReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGeneratingMassReport(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getKKTPGrade = (val: number | string) => {
    const n = Number(val);
    if (n >= 91) return { text: 'Excellent (A)', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    if (n >= 81) return { text: 'Good (B)', color: 'bg-blue-50 text-blue-700 border-blue-100' };
    if (n >= 71) return { text: 'Satisfactory (C)', color: 'bg-amber-50 text-amber-700 border-amber-100' };
    return { text: 'Needs Intervention (D)', color: 'bg-rose-50 text-rose-700 border-rose-100' };
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-10">
      {/* Premium Dashboard Header */}
      <div className="bg-oxford rounded-3xl p-8 md:p-12 text-white shadow-premium relative overflow-hidden border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6 inline-block font-sans">
              System Administrator • Root Access Verified
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight">
              Curriculum Control Center
            </h1>
            <p className="text-slate-400 mt-4 text-sm md:text-lg max-w-xl leading-relaxed font-medium">
              Global configuration for academic cycles. Manage cohorts, faculty assignments, student enrollment, and automated transcript generation.
            </p>
          </div>
          <div className="flex gap-8 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-inner shrink-0">
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-white">{kelas.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cohorts</div>
            </div>
            <div className="h-10 w-[1px] bg-white/10 self-center"></div>
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-white">{siswaList.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enrollment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit overflow-x-auto">
        {[
          { id: 'akademik', label: 'Academic Cycle', icon: <Clock size={14} /> },
          { id: 'kelas', label: 'Cohort Management', icon: <Layers size={14} /> },
          { id: 'siswa', label: 'Student Directory', icon: <UserPlus size={14} /> },
          { id: 'guru', label: 'Faculty Assignment', icon: <BookOpen size={14} /> },
          { id: 'rapor', label: 'Mass Transcripts', icon: <Printer size={14} /> },
        ].map((subTab) => (
          <button
            key={subTab.id}
            onClick={() => {
              setActiveSubTab(subTab.id as any);
              setActivePreviewStudent(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === subTab.id
                ? 'bg-white text-oxford shadow-sm'
                : 'text-slate-500 hover:text-oxford'
            }`}
          >
            {subTab.icon}
            <span>{subTab.label}</span>
          </button>
        ))}
      </div>

      {activeSubTab === 'akademik' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 card-premium p-8 space-y-8">
            <div className="flex items-center gap-3">
               <Server className="text-bronze" size={20} />
               <h3 className="text-lg font-bold text-oxford uppercase tracking-widest">Active Academic Session</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Global synchronization for evaluation timelines. Changes to the primary session will re-index all academic records across the platform.
            </p>

            <form onSubmit={handleSaveTahunAjaran} className="space-y-6 border-t border-slate-100 pt-8 max-w-md">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Year</label>
                <input 
                  type="text" 
                  value={tahunAjaran}
                  onChange={e => setTahunAjaran(e.target.value)}
                  className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Semester Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Ganjil', 'Genap'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSemesterTipe(t)}
                      className={`py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all cursor-pointer ${
                        semesterTipe === t 
                          ? 'bg-oxford border-oxford text-white shadow-md' 
                          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {t} Semester
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-bronze hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
                >
                  Commit Changes
                </button>
                {isTaSaved && (
                  <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 size={16} /> Synchronized
                  </span>
                )}
              </div>
            </form>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-6">
              <div>
                <h4 className="font-serif font-bold text-xl text-oxford flex items-center gap-2">
                  <Layers className="text-bronze" size={22} /> System-Wide Lifecycle Tools
                </h4>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Automated transitions for cohort progression and graduation archival. 
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Execute global cohort promotion? Class XII students will be archived automatically.")) {
                      setIsPromotingState(true);
                      setPromotionLog(["Initializing cohort analysis...", "Mapping new roster distribution...", "Promoting tiers (X➔XI, XI➔XII)..."]);
                      try {
                        await onPromoteClasses();
                        setPromotionLog(prev => [...prev, "Sync Complete.", "Reloading academic data..."]);
                      } catch (err) {
                        setPromotionLog(prev => [...prev, "Error: " + (err as Error).message]);
                      } finally {
                        setIsPromotingState(false);
                      }
                    }
                  }}
                  disabled={isPromotingState}
                  className="bg-oxford hover:bg-slate-800 disabled:bg-slate-400 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-md cursor-pointer"
                >
                  {isPromotingState ? "Processing..." : "Cohort Promotion (X ➔ XI ➔ XII)"}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Archive Class XII as alumni?")) {
                      setIsArchivingState(true);
                      try {
                        await onArchiveAlumni();
                      } finally {
                        setIsArchivingState(false);
                      }
                    }
                  }}
                  disabled={isArchivingState}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-oxford text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-sm cursor-pointer"
                >
                  {isArchivingState ? "Archiving..." : "Archive Graduation"}
                </button>

                <button
                  type="button"
                  onClick={onResetSemester}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer border border-rose-100"
                >
                  Hard Reset Session
                </button>
              </div>

              {promotionLog.length > 0 && (
                <div className="bg-slate-900 text-purple-200 text-[10px] font-mono p-4 rounded-xl border border-slate-800 space-y-1">
                  {promotionLog.map((log, index) => (
                    <div key={index}>&gt; {log}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
             <div className="card-premium p-8 space-y-4">
                <h4 className="text-[10px] font-black text-oxford uppercase tracking-widest flex items-center gap-2">
                  <FolderLock size={16} className="text-bronze" /> System Integrity
                </h4>
                <div className="text-xs text-slate-500 font-medium space-y-4 leading-relaxed">
                  <p>
                    Student records are protected via <span className="text-oxford font-bold">Row-Level Security (RLS)</span>. Access is restricted by faculty role and department assignment.
                  </p>
                  <p>
                    Session termination is an immutable action. Ensure all transcripts are committed before closure.
                  </p>
                </div>
             </div>
             
             <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 space-y-4">
                <ShieldAlert className="text-amber-600" size={24} />
                <h5 className="font-bold text-amber-900 text-sm uppercase tracking-widest">Admin Note</h5>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Faculty performance metrics are monitored. Ensure all curriculum modules are aligned with national standards.
                </p>
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'kelas' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 card-premium p-8 space-y-8">
            <h3 className="font-serif font-bold text-xl text-oxford leading-none">New Cohort Setup</h3>
            
            <form onSubmit={handleAddKelasSubmit} className="space-y-6 border-t border-slate-100 pt-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cohort Identity</label>
                <input 
                  type="text" 
                  value={newKelasNama}
                  onChange={e => setNewKelasNama(e.target.value)}
                  placeholder="e.g. X IPA 1"
                  className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-md w-full"
              >
                Create Cohort
              </button>
            </form>
          </div>

          <div className="md:col-span-7 card-premium p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
               <h3 className="font-serif font-bold text-xl text-oxford">Installed Cohorts ({kelas.length})</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {kelas.map(k => (
                <div key={k.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white transition-all group">
                  <div>
                    <h4 className="font-bold text-oxford text-base">Class {k.nama}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{siswaList.filter(s => s.kelasId === k.id).length} Enrolled</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove cohort ${k.nama}?`)) {
                        onDeleteKelas(k.id);
                      }
                    }}
                    className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'siswa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 card-premium p-8 space-y-8">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setSiswaRegistrationMode('individual')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                  siswaRegistrationMode === 'individual' ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setSiswaRegistrationMode('excel')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                  siswaRegistrationMode === 'excel' ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'
                }`}
              >
                Mass Import
              </button>
            </div>

            {siswaRegistrationMode === 'individual' ? (
              <div className="space-y-6 pt-4">
                <form onSubmit={handleAddSiswaSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      value={newSiswaNama}
                      onChange={e => setNewSiswaNama(e.target.value)}
                      placeholder="e.g. Ahmad Fauzi"
                      className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official NISN</label>
                    <input 
                      type="text" 
                      value={newSiswaNisn}
                      onChange={e => setNewSiswaNisn(e.target.value)}
                      placeholder="122509121"
                      className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Cohort</label>
                    <select
                      value={selectedClassIdForNewSiswa}
                      onChange={e => setSelectedClassIdForNewSiswa(e.target.value)}
                      className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                    >
                      {kelas.map(k => (
                        <option key={k.id} value={k.id}>{k.nama}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-md w-full"
                  >
                    Enroll Student
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
                    <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">CSV Scheme: <span className="font-mono lowercase text-indigo-500">nama,nisn,kelas</span></p>
                    <button
                      type="button"
                      className="text-[10px] font-black text-indigo-600 hover:underline flex items-center gap-1.5 uppercase tracking-widest"
                    >
                      <Download size={14} /> Download Scheme
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paste Record Data</label>
                    <textarea
                      rows={5}
                      value={excelSiswaText}
                      onChange={e => setExcelSiswaText(e.target.value)}
                      placeholder="Name,NISN,Cohort"
                      className="w-full text-xs font-mono border border-slate-200 bg-slate-50/50 rounded-xl p-4 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!excelSiswaText.trim()) return;
                      onMassImportSiswa(excelSiswaText);
                      setExcelSiswaText('');
                    }}
                    className="w-full bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <UploadCloud size={16} /> Execute Synchronized Import
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 card-premium p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-oxford leading-none">Enrollment Database</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active Student Identities</p>
              </div>

              <div className="bg-slate-50 p-1 rounded-xl border border-slate-100">
                <select
                  value={activeSiswaFilter}
                  onChange={e => setActiveSiswaFilter(e.target.value)}
                  className="text-[10px] font-black uppercase tracking-widest border-0 bg-white rounded-lg px-4 py-2 outline-none shadow-sm"
                >
                  <option value="all">All Active Tiers</option>
                  <option value="unassigned">Pending Plotting</option>
                  {kelas.map(k => (
                    <option key={k.id} value={k.id}>Class {k.nama}</option>
                  ))}
                  <option value="alumni_archive">Archived Alumni</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="p-5">Student Identity</th>
                    <th className="p-5">Official NISN</th>
                    <th className="p-5">Cohort Assignment</th>
                    <th className="p-5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {siswaList
                    .filter(siswa => {
                      if (activeSiswaFilter === 'unassigned') return !siswa.kelasId;
                      if (activeSiswaFilter === 'all') return siswa.kelasId !== 'alumni_archive';
                      return siswa.kelasId === activeSiswaFilter;
                    })
                    .map(siswa => (
                      <tr key={siswa.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 font-bold text-oxford flex items-center gap-3">
                          <img src={siswa.avatar || 'https://pravatar.cc/150'} alt="" className="h-8 w-8 rounded-xl object-cover border border-slate-100" />
                          <span>{siswa.nama}</span>
                        </td>
                        <td className="p-5 font-mono font-bold text-slate-400 tracking-tighter">{siswa.nisnOrNip || '-'}</td>
                        <td className="p-5">
                          {siswa.kelasId === 'alumni_archive' ? (
                            <span className="bg-slate-900 text-slate-400 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">Archived</span>
                          ) : !siswa.kelasId ? (
                            <span className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">Pending</span>
                          ) : (
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">Class {kelas.find(k => k.id === siswa.kelasId)?.nama}</span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => onDeleteSiswa(siswa.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'guru' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 card-premium p-8 space-y-8">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setGuruRegistrationMode('individual')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                  guruRegistrationMode === 'individual' ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setGuruRegistrationMode('excel')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                  guruRegistrationMode === 'excel' ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'
                }`}
              >
                Mass Import
              </button>
            </div>

            {guruRegistrationMode === 'individual' ? (
              <form onSubmit={handleAddGuruAssignment} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faculty Name</label>
                  <input 
                    type="text" 
                    value={newGuruNama}
                    onChange={e => setNewGuruNama(e.target.value)}
                    className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                    <select
                      value={newGuruMapel}
                      onChange={e => setNewGuruMapel(e.target.value)}
                      className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                    >
                      <option value="Matematika">Mathematics</option>
                      <option value="Fisika">Physics</option>
                      <option value="Bahasa Indonesia">Indonesian</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cohort</label>
                    <select
                      value={newGuruKelas}
                      onChange={e => setNewGuruKelas(e.target.value)}
                      className="w-full text-sm font-bold text-oxford border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 outline-none"
                    >
                      {kelas.map(k => (
                        <option key={k.id} value={k.nama}>{k.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-md w-full">
                  Commit Assignment
                </button>
              </form>
            ) : (
              <div className="space-y-6 pt-4">
                <textarea
                  rows={5}
                  value={excelGuruText}
                  onChange={e => setExcelGuruText(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-200 bg-slate-50/50 rounded-xl p-4 outline-none"
                />
                <button
                  type="button"
                  className="w-full bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl shadow-md"
                >
                  Execute Batch Import
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 card-premium p-8 space-y-8">
            <h3 className="font-serif font-bold text-xl text-oxford">Faculty Rosters</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="p-5">Faculty Member</th>
                    <th className="p-5">Curriculum Subject</th>
                    <th className="p-5">Assigned Cohort</th>
                    <th className="p-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guruAssignments.map(ga => (
                    <tr key={ga.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold text-oxford">{ga.namaGuru}</td>
                      <td className="p-5 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{ga.mapel}</td>
                      <td className="p-5 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Class {ga.kelas}</td>
                      <td className="p-5 text-right"><span className="text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg uppercase tracking-widest">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rapor' && (
        <div className="space-y-8">
          {activePreviewStudent === null ? (
            <div className="card-premium p-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-8 gap-6">
                <div>
                   <div className="flex items-center gap-3">
                      <Printer className="text-bronze" size={24} />
                      <h3 className="font-serif font-bold text-xl text-oxford leading-none">Automated Transcript Generation</h3>
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Export academic records for complete cohorts.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <select
                    value={selectedClassForReport}
                    onChange={e => setSelectedClassForReport(e.target.value)}
                    className="text-xs font-bold border-0 bg-white rounded-xl px-4 py-2 outline-none shadow-sm"
                  >
                    {kelas.map(k => (
                      <option key={k.id} value={k.id}>Class {k.nama}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleGenerateMassReport}
                    disabled={isGeneratingMassReport}
                    className="bg-oxford hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-8 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:bg-slate-400"
                  >
                    {isGeneratingMassReport ? `Generating (${massReportProgress}%)` : 'Execute Mass Print'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siswaList.filter(s => s.kelasId === selectedClassForReport).map(siswa => (
                  <div key={siswa.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all group">
                    <h4 className="font-serif font-bold text-lg text-oxford group-hover:text-bronze transition-colors line-clamp-1">{siswa.nama}</h4>
                    <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
                      <button onClick={() => { setActivePreviewStudent(siswa); setPreviewReportType('akademik'); }} className="text-[10px] font-black uppercase tracking-widest text-oxford hover:text-bronze flex items-center gap-1">Academic <ArrowRight size={12} /></button>
                      <button onClick={() => { setActivePreviewStudent(siswa); setPreviewReportType('p5'); }} className="text-[10px] font-black uppercase tracking-widest text-oxford hover:text-bronze flex items-center gap-1">Project <ArrowRight size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card-premium p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <button onClick={() => setActivePreviewStudent(null)} className="text-bronze text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline transition-all">
                &larr; Return to Directory
              </button>
              <div className="max-w-4xl mx-auto border border-slate-200 p-12 md:p-20 rounded-3xl bg-white shadow-2xl relative font-sans text-oxford">
                <div className="absolute top-0 left-0 w-full h-2 bg-oxford"></div>
                <div className="text-center border-b-4 border-oxford border-double pb-8 mb-12">
                   <h2 className="font-serif font-extrabold text-3xl tracking-tight">SMAM CILILIN ACADEMY</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Official Digital Academic Transcript</p>
                </div>
                
                <div className="grid grid-cols-2 gap-12 text-xs font-bold uppercase tracking-widest mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                     <p className="text-slate-400 text-[9px]">Student Name</p>
                     <p>{activePreviewStudent.nama}</p>
                  </div>
                  <div className="text-right space-y-1">
                     <p className="text-slate-400 text-[9px]">Cohort Identification</p>
                     <p>Class {kelas.find(k => k.id === activePreviewStudent.kelasId)?.nama}</p>
                  </div>
                </div>
                
                {previewReportType === 'akademik' ? (
                  <div className="space-y-8">
                    <h4 className="text-center font-serif font-black text-xl border-b-2 border-slate-100 pb-4">Academic Achievement Report</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b-2 border-oxford">
                          <th className="p-4 uppercase tracking-widest font-black">Subject Area</th>
                          <th className="p-4 text-center uppercase tracking-widest font-black w-24">Grade</th>
                          <th className="p-4 uppercase tracking-widest font-black text-center">Standing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {nilaiSiswa.filter(n => n.siswaId === activePreviewStudent.id).map(r => (
                          <tr key={r.id}>
                            <td className="p-4 font-bold">{r.mapelNama}</td>
                            <td className="p-4 text-center font-mono font-bold text-lg">{r.nilaiAkhir}</td>
                            <td className="p-4 text-center">
                               <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border ${getKKTPGrade(r.nilaiAkhir).color}`}>
                                  {getKKTPGrade(r.nilaiAkhir).text}
                               </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <h4 className="text-center font-serif font-black text-xl border-b-2 border-slate-100 pb-4">Collaborative Project Report (P5)</h4>
                    <div className="grid grid-cols-1 gap-6">
                       {raporP5.filter(p => p.siswaId === activePreviewStudent.id).map(p => (
                         <div key={p.id} className="p-8 border border-slate-100 rounded-3xl bg-slate-50/30">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Active Project</span>
                              <span className="text-[10px] font-black text-bronze uppercase tracking-widest">Assessment: {p.mandiri}</span>
                           </div>
                           <h5 className="font-serif font-bold text-2xl text-oxford leading-tight">{p.temaProjek}</h5>
                           <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">Standardized competency achieved through rigorous project participation and peer collaboration within the academic year.</p>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 text-[9px] font-black uppercase tracking-widest pt-20 border-t-2 border-dashed border-slate-200 mt-20">
                  <div className="space-y-16">
                     <div>Parent / Guardian Authentication</div>
                     <div className="border-b border-oxford w-48"></div>
                  </div>
                  <div className="text-right space-y-16">
                     <div>Cililin, 10 June 2026 • Lead Faculty Authentication</div>
                     <div className="flex justify-end"><div className="border-b border-oxford w-48"></div></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
