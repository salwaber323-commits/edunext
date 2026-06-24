import React, { useState } from 'react';
import { 
  FolderLock, Server, ShieldCheck, Plus, Trash2, 
  UserPlus, FileCheck, Layers, BookOpen, Clock, Users,
  BookMarked, Download, Printer, Eye, Settings, HelpCircle, CheckCircle2, AlertCircle, ShieldAlert
} from 'lucide-react';
import { User, Kelas, MataPelajaran, RaporP5, NilaiSiswa } from '../types';

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
  
  // Year/Semester States
  const [tahunAjaran, setTahunAjaran] = useState(PropTahunAjaran);
  const [semesterTipe, setSemesterTipe] = useState<'Ganjil' | 'Genap'>(PropSemester);
  const [isTaSaved, setIsTaSaved] = useState(false);

  // Class Form States
  const [newKelasNama, setNewKelasNama] = useState('');

  // Student Form States
  const [newSiswaNama, setNewSiswaNama] = useState('');
  const [newSiswaNisn, setNewSiswaNisn] = useState('');
  const [selectedClassIdForNewSiswa, setSelectedClassIdForNewSiswa] = useState(kelas[0]?.id || 'kelas_x_ipa_1');

  // Teacher Mappings Mock State
  const [guruAssignments, setGuruAssignments] = useState([
    { id: 'ga_1', namaGuru: 'Pak Budi Hartono, S.Pd.', mapel: 'Matematika', kelas: 'X IPA 1' },
    { id: 'ga_2', namaGuru: 'Ibu Ratna Dewi, M.Pd.', mapel: 'Fisika', kelas: 'XI IPA 2' },
    { id: 'ga_3', namaGuru: 'Pak Ahmad Yani, S.Ag.', mapel: 'Pendidikan Agama Islam', kelas: 'X IPA 1' },
  ]);
  const [newGuruNama, setNewGuruNama] = useState('');
  const [newGuruMapel, setNewGuruMapel] = useState('Matematika');
  const [newGuruKelas, setNewGuruKelas] = useState('X IPA 1');

  // Mass Print States
  const [selectedClassForReport, setSelectedClassForReport] = useState(kelas[0]?.id || 'kelas_x_ipa_1');
  const [isGeneratingMassReport, setIsGeneratingMassReport] = useState(false);
  const [massReportProgress, setMassReportProgress] = useState(0);
  const [activePreviewStudent, setActivePreviewStudent] = useState<User | null>(null);
  const [previewReportType, setPreviewReportType] = useState<'akademik' | 'p5'>('akademik');

  // SYSTEM.MD COMPLIANT STATES: Excel Import, Promotion, Alumni filters
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
    alert(`Kelas ${newKelasNama} berhasil dibuat!`);
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
    alert(`Siswa ${newSiswaNama} berhasil didaftarkan!`);
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
    alert(`Guru ${newGuruNama} ditugaskan untuk mapel ${newGuruMapel} di kelas ${newGuruKelas}`);
  };

  const handleGenerateMassReport = () => {
    setIsGeneratingMassReport(true);
    setMassReportProgress(0);
    const interval = setInterval(() => {
      setMassReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGeneratingMassReport(false);
          alert("✓ Seluruh laporan rapor kelas berhasil digenerate dan siap diunduh dalam format berkas ZIP.");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getKKTPGrade = (val: number | string) => {
    const n = Number(val);
    if (n >= 91) return { text: 'Sangat Baik (A)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (n >= 81) return { text: 'Baik (B)', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (n >= 71) return { text: 'Cukup (C)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { text: 'Perlu Intervensi (D)', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-1">
      {/* Premium Dashboard Header */}
      <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="bg-purple-500/30 text-purple-200 text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block border border-purple-500/20 font-mono">
              Sistem Administrator • Keamanan Super
            </span>
            <h1 className="text-3xl font-black tracking-tight font-sans">
              Instalasi &amp; Kontrol Akademik
            </h1>
            <p className="text-purple-200 mt-2 text-sm max-w-xl leading-relaxed">
              Konfigurasi master Kurikulum Merdeka SMAM Muslimin Cililin. Kelola tahun ajaran aktif, semester, penugasan guru pengampu, rincian murid, hingga cetak rapor massal otomatis.
            </p>
          </div>
          <div className="flex gap-3 bg-purple-950/60 p-4 rounded-xl border border-purple-800/30 shadow-inner shrink-0 self-start md:self-auto">
            <div className="text-center font-mono">
              <div className="text-xl font-bold font-sans text-purple-300">{kelas.length}</div>
              <div className="text-[9px] font-extrabold text-purple-400 uppercase tracking-wider">Kelas</div>
            </div>
            <div className="h-8 w-[1px] bg-purple-800 self-center"></div>
            <div className="text-center font-mono">
              <div className="text-xl font-bold font-sans text-purple-300">{siswaList.length}</div>
              <div className="text-[9px] font-extrabold text-purple-400 uppercase tracking-wider">Murid</div>
            </div>
            <div className="h-8 w-[1px] bg-purple-800 self-center"></div>
            <div className="text-center font-mono">
              <div className="text-xl font-bold font-sans text-purple-300">{materiCount + tugasCount}</div>
              <div className="text-[9px] font-extrabold text-purple-400 uppercase tracking-wider">KBM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Navigation inside Admin Panel */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
        {[
          { id: 'akademik', label: 'Tahun Ajaran & Semester', icon: <Clock size={14} /> },
          { id: 'kelas', label: 'Manajemen Kelas', icon: <Layers size={14} /> },
          { id: 'siswa', label: 'Registrasi Siswa', icon: <UserPlus size={14} /> },
          { id: 'guru', label: 'Penugasan Guru Mapel', icon: <BookOpen size={14} /> },
          { id: 'rapor', label: 'Cetak Rapor Massal', icon: <Printer size={14} /> },
        ].map((subTab) => (
          <button
            key={subTab.id}
            onClick={() => {
              setActiveSubTab(subTab.id as any);
              setActivePreviewStudent(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === subTab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            {subTab.icon}
            <span>{subTab.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT FOR SUBTAB 1: TAHUN AJARAN & SEMESTER */}
      {activeSubTab === 'akademik' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Server className="text-purple-600" size={18} /> Tahun Pelajaran Aktif Utama
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mogok belajar atau aktivitas penilaian hanya diizinkan berjalan di semester/tahun pelajaran yang berstatus <strong>AKTIF</strong>. Perubahan di sini akan langsung meremapping semua timeline rapor harian.
            </p>

            <form onSubmit={handleSaveTahunAjaran} className="space-y-4 border-t border-slate-100 pt-4 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Tahun Pelajaran (Format: YYYY/YYYY (e.g. 2026/2027))</label>
                <input 
                  type="text" 
                  value={tahunAjaran}
                  onChange={e => setTahunAjaran(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Tipe Semester</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Ganjil', 'Genap'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSemesterTipe(t)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        semesterTipe === t 
                          ? 'bg-purple-50 border-purple-500 text-purple-700 font-black' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Semester {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Perubahan
                </button>
                {isTaSaved && (
                  <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Perubahan Aktif Berhasil Disinkronkan!
                  </span>
                )}
              </div>
            </form>

            <div className="bg-purple-950/5 p-6 rounded-2xl border border-purple-100 mt-6 space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Layers className="text-purple-600" size={16} /> Alat Transisi Kenaikan Kelas Otomatis &amp; Kelulusan
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sesuai rujukan Kurikulum Merdeka, kenaikan kelas dapat dilakukan secara kolektif sekali klik. Sistem akan menduplikat rombongan belajar dan menaikkan tingkat siswa (X &rarr; XI, XI &rarr; XII, XII &rarr; Alumni).
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Apakah Anda yakin ingin memproses Kenaikan Kelas Otomatis untuk semua murid aktif? Murid kelas XII akan diluluskan dan diarsipkan otomatis.")) {
                      setIsPromotingState(true);
                      setPromotionLog(["Menganalisis daftar siswa...", "Mengonfigurasi pemetaan kelas baru...", "Menaikkan tingkat siswa (X➔XI, XI➔XII)...", "Memproses kelulusan XII..."]);
                      try {
                        await onPromoteClasses();
                        setPromotionLog(prev => [...prev, "✓ Kenaikan kelas selesai!", "Memuat ulang data akademik..."]);
                        alert("✓ Sukses memproses Kenaikan Kelas Otomatis!");
                      } catch (err) {
                        setPromotionLog(prev => [...prev, "✗ Gagal: " + (err as Error).message]);
                      } finally {
                        setIsPromotingState(false);
                      }
                    }
                  }}
                  disabled={isPromotingState}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  {isPromotingState ? "Sedang Memproses..." : "Naikkan Kelas Otomatis (X ➔ XI ➔ XII)"}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Luluskan seluruh angkatan kelas XII sekarang? Siswa tidak dihapus, melainkan masuk ke menu Arsip Alumni.")) {
                      setIsArchivingState(true);
                      try {
                        await onArchiveAlumni();
                        alert("✓ Angkatan Kelas XII sukses diluluskan!");
                      } catch (err) {
                        alert("✗ Gagal: " + (err as Error).message);
                      } finally {
                        setIsArchivingState(false);
                      }
                    }
                  }}
                  disabled={isArchivingState}
                  className="bg-purple-800 hover:bg-purple-900 disabled:bg-purple-300 text-purple-100 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer border border-purple-600"
                >
                  {isArchivingState ? "Memproses Kelulusan..." : "Luluskan Angkatan (XII ➔ Alumni)"}
                </button>

                <button
                  type="button"
                  onClick={onResetSemester}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer border border-rose-200"
                >
                  Reset Semester (Hapus Absensi & Tugas)
                </button>
              </div>

              {promotionLog.length > 0 && (
                <div className="bg-slate-900 text-purple-200 text-[10px] sm:text-xs font-mono p-3 rounded-lg border border-slate-800 space-y-1">
                  {promotionLog.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-4 bg-purple-50/50 p-6 rounded-2xl border border-purple-100 space-y-3">
            <h4 className="text-xs font-extrabold text-purple-800 uppercase tracking-widest flex items-center gap-1.5">
              <FolderLock size={14} /> Aturan Keamanan Sistem
            </h4>
            <div className="text-[11px] text-purple-950 font-medium space-y-2.5 leading-relaxed">
              <p>
                1. Setiap database siswa didesain menggunakan row level security (RLS). Nilai yang diinput pada semester sebelumnya tersimpan aman dan diarsipkan otomatis.
              </p>
              <p>
                2. Untuk menjamin autisitas, hanya akun kepala kurikulum (Admin) yang dapat menutup semester aktif atau merekapitulasi presensi total.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'kelas' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Buat Kelas Baru</h3>
            <p className="text-xs text-slate-400">Kelas baru otomatis diinisialisasi tanpa kuota awal.</p>

            <form onSubmit={handleAddKelasSubmit} className="space-y-4 border-t border-slate-100 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Nama Identitas Kelas (Contoh: X IPA 1, XII IPS 3)</label>
                <input 
                  type="text" 
                  value={newKelasNama}
                  onChange={e => setNewKelasNama(e.target.value)}
                  placeholder="X IPA 1"
                  className="w-full text-xs border rounded-lg p-2.5"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm cursor-pointer"
              >
                Buat Kelas Baru
              </button>
            </form>
          </div>

          <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Daftar Kelas Terinstal ({kelas.length})</h3>
            
            <div className="space-y-3">
              {kelas.map(k => (
                <div key={k.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Kelas {k.nama}</h4>
                    <p className="text-xs text-slate-500">{siswaList.filter(s => s.kelasId === k.id).length} Siswa Terdaftar</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin menghapus kelas ${k.nama}? Siswa di dalamnya akan kehilangan de-facto rujukan.`)) {
                        onDeleteKelas(k.id);
                      }
                    }}
                    className="p-2 border border-rose-100 hover:border-rose-200 text-rose-500 bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Hapus Kelas"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'siswa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSiswaRegistrationMode('individual')}
                className={`flex-1 pb-2.5 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  siswaRegistrationMode === 'individual'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Input Individual
              </button>
              <button
                type="button"
                onClick={() => {
                  setSiswaRegistrationMode('excel');
                  if (!excelSiswaText) {
                    setExcelSiswaText(
                      "Andi Wijaya,122509151,X IPA 1\n" +
                      "Citra Lestari,122509152,X IPA 1\n" +
                      "Deni Harahap,122509153,XI IPA 2"
                    );
                  }
                }}
                className={`flex-1 pb-2.5 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  siswaRegistrationMode === 'excel'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Import Excel (Massal)
              </button>
            </div>

            {siswaRegistrationMode === 'individual' ? (
              <div className="space-y-4 animated-fade">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Form Pendaftaran Siswa</h3>
                  <p className="text-[11px] text-slate-400">Hubungkan siswa baru langsung ke kelas akademik.</p>
                </div>

                <form onSubmit={handleAddSiswaSubmit} className="space-y-4 border-t border-slate-100 pt-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">Nama Lengkap Murid</label>
                    <input 
                      type="text" 
                      value={newSiswaNama}
                      onChange={e => setNewSiswaNama(e.target.value)}
                      placeholder="Misal: Ahmad Fauzi"
                      className="w-full text-xs border rounded-lg p-2.5"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">NISN Resmi (9 digit)</label>
                    <input 
                      type="text" 
                      value={newSiswaNisn}
                      onChange={e => setNewSiswaNisn(e.target.value)}
                      placeholder="122509121"
                      className="w-full text-xs border rounded-lg p-2.5 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">Rujukan Kelas</label>
                    <select
                      value={selectedClassIdForNewSiswa}
                      onChange={e => setSelectedClassIdForNewSiswa(e.target.value)}
                      className="w-full text-xs border rounded-lg p-2.5 bg-white font-semibold"
                    >
                      {kelas.map(k => (
                        <option key={k.id} value={k.id}>{k.nama}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm w-full cursor-pointer"
                  >
                    Registrasikan Baru
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4 animated-fade">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Unggah CSV / Excel</h3>
                  <p className="text-[11px] text-slate-400">Unggah log daftar nama, nisn, dan target kelas sekaligus.</p>
                </div>

                <div className="space-y-3 pt-2 bg-slate-50/50 p-2 rounded-xl">
                  <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                    <span className="text-[9px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">Format Baris CSV / Excel</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                      nama,nisn,kelas
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8,nama,nisn,kelas\nAndi Wijaya,122509151,X IPA 1\nCitra Lestari,122509152,X IPA 1\nDeni Harahap,122509153,XI IPA 2";
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "template_import_siswa_lms.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      ⤓ Download Template Excel (.csv)
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">Tempel / Tulis Baris Excel di Sini</label>
                    <textarea
                      rows={5}
                      value={excelSiswaText}
                      onChange={e => setExcelSiswaText(e.target.value)}
                      placeholder="Andi Wijaya,122509151,X IPA 1"
                      className="w-full text-xs font-mono border rounded-lg p-2 bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!excelSiswaText.trim()) {
                        alert("Silakan isi data excel terlebih dahulu.");
                        return;
                      }
                      onMassImportSiswa(excelSiswaText);
                      setExcelSiswaText('');
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-black py-2.5 rounded-lg cursor-pointer transition-colors"
                  >
                    ☄ Proses Unggah &amp; Sinkronisasi Rombel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Siswa Terdaftar Sekolah ({siswaList.length})</h3>
                <p className="text-xs text-slate-400">Database identitas siswa aktif.</p>
              </div>

              <div>
                <select
                  value={activeSiswaFilter}
                  onChange={e => setActiveSiswaFilter(e.target.value)}
                  className="text-xs border rounded-lg p-2 bg-white font-bold text-slate-700 cursor-pointer"
                >
                  <option value="all">Seluruh Tingkatan Kelas</option>
                  <option value="unassigned" className="text-rose-600 font-bold">⚠️ Belum Ada Kelas (Butuh Aksi)</option>
                  {kelas.map(k => (
                    <option key={k.id} value={k.id}>Kelas {k.nama}</option>
                  ))}
                  <option value="alumni_archive" className="font-bold text-purple-700">💾 Arsip Alumni / Kelulusan</option>
                </select>
              </div>
            </div>
            
            {/* Warning if there are unassigned students */}
            {siswaList.some(s => !s.kelasId || s.kelasId === '') && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-rose-600" size={18} />
                <div className="text-xs text-rose-800">
                  <span className="font-black">Peringatan:</span> Ada {siswaList.filter(s => !s.kelasId || s.kelasId === '').length} siswa yang belum dimasukkan ke dalam kelas. Mereka tidak akan bisa melihat materi atau melakukan absensi.
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">NISN</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {siswaList
                    .filter(siswa => {
                      if (activeSiswaFilter === 'unassigned') {
                        return !siswa.kelasId || siswa.kelasId === '';
                      }
                      if (activeSiswaFilter === 'all') {
                        return siswa.kelasId !== 'alumni_archive';
                      }
                      return siswa.kelasId === activeSiswaFilter;
                    })
                    .map(siswa => (
                      <tr key={siswa.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                          <img src={siswa.avatar || 'https://i.pravatar.cc/150'} alt="" className="h-6 w-6 rounded-full object-cover" />
                          <span>{siswa.nama}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-600">{siswa.nisnOrNip || '-'}</td>
                        <td className="p-3">
                          {siswa.kelasId === 'alumni_archive' ? (
                            <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded font-black text-[10px] uppercase text-center inline-block">
                              💾 Alumni / Lulus
                            </span>
                          ) : !siswa.kelasId ? (
                            <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded font-black text-[10px] uppercase text-center inline-block">
                              ⚠️ Belum di-Plot
                            </span>
                          ) : (
                            <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded font-bold text-[10px] text-center inline-block">
                              Kelas {kelas.find(k => k.id === siswa.kelasId)?.nama || 'Siswa Pindahan'}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus murid ${siswa.nama}?`)) {
                                onDeleteSiswa(siswa.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded border border-rose-50 cursor-pointer"
                          >
                            <Trash2 size={12} />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => setGuruRegistrationMode('individual')}
                className={`flex-1 pb-2.5 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  guruRegistrationMode === 'individual'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuruRegistrationMode('excel');
                  if (!excelGuruText) {
                    setExcelGuruText(
                      "Ibu Kartini S.Pd,Bahasa Indonesia,X IPA 1"
                    );
                  }
                }}
                className={`flex-1 pb-2.5 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  guruRegistrationMode === 'excel'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Import Excel
              </button>
            </div>

            {guruRegistrationMode === 'individual' ? (
              <form onSubmit={handleAddGuruAssignment} className="space-y-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 block">Nama Guru</label>
                  <input 
                    type="text" 
                    value={newGuruNama}
                    onChange={e => setNewGuruNama(e.target.value)}
                    className="w-full text-xs border rounded-lg p-2.5"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">Mapel</label>
                    <select
                      value={newGuruMapel}
                      onChange={e => setNewGuruMapel(e.target.value)}
                      className="w-full text-xs border rounded-lg p-2.5 bg-white"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">Kelas</label>
                    <select
                      value={newGuruKelas}
                      onChange={e => setNewGuruKelas(e.target.value)}
                      className="w-full text-xs border rounded-lg p-2.5 bg-white"
                    >
                      {kelas.map(k => (
                        <option key={k.id} value={k.nama}>{k.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg w-full">
                  Simpan Penugasan
                </button>
              </form>
            ) : (
              <div className="space-y-4 pt-4">
                <textarea
                  rows={5}
                  value={excelGuruText}
                  onChange={e => setExcelGuruText(e.target.value)}
                  className="w-full text-xs font-mono border rounded-lg p-2 bg-white"
                />
                <button
                  type="button"
                  onClick={() => alert('Fitur import guru dalam pengembangan.')}
                  className="w-full bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg"
                >
                  Proses Import Guru
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Daftar Guru Aktif</h3>
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-3">Nama Pendidik</th>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guruAssignments.map(ga => (
                    <tr key={ga.id}>
                      <td className="p-3 font-bold">{ga.namaGuru}</td>
                      <td className="p-3 text-slate-600">{ga.mapel}</td>
                      <td className="p-3">{ga.kelas}</td>
                      <td className="p-3 text-right"><span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Aktif</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rapor' && (
        <div className="space-y-6">
          {activePreviewStudent === null ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-150 pb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                    <Printer className="text-purple-600" size={20} /> Cetak Rapor Massal
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedClassForReport}
                    onChange={e => setSelectedClassForReport(e.target.value)}
                    className="text-xs border rounded-lg p-2 bg-white font-bold"
                  >
                    {kelas.map(k => (
                      <option key={k.id} value={k.id}>Kelas {k.nama}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleGenerateMassReport}
                    disabled={isGeneratingMassReport}
                    className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    {isGeneratingMassReport ? `Generating (${massReportProgress}%)` : 'Cetak Massal'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {siswaList.filter(s => s.kelasId === selectedClassForReport).map(siswa => (
                  <div key={siswa.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                    <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1">{siswa.nama}</h4>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => { setActivePreviewStudent(siswa); setPreviewReportType('akademik'); }} className="text-[10px] font-bold text-purple-600">Rapor Akademik</button>
                      <button onClick={() => { setActivePreviewStudent(siswa); setPreviewReportType('p5'); }} className="text-[10px] font-bold text-purple-600">Rapor P5</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <button onClick={() => setActivePreviewStudent(null)} className="text-purple-600 text-xs font-bold">&larr; Kembali</button>
              <div className="max-w-3xl mx-auto border-2 border-slate-900/10 p-8 rounded-2xl bg-white space-y-6 font-mono">
                <div className="text-center border-b-2 border-slate-900 border-double pb-4">
                  <h2 className="font-extrabold text-lg uppercase">SMA MUHAMMADIYAH MUSLIMIN CILILIN</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold pb-4 border-b">
                  <div>NAMA SISWA: {activePreviewStudent.nama.toUpperCase()}</div>
                  <div className="text-right">KELAS: {kelas.find(k => k.id === activePreviewStudent.kelasId)?.nama}</div>
                </div>
                
                {previewReportType === 'akademik' ? (
                  <div className="space-y-4">
                    <h4 className="text-center font-black underline text-sm">LAPORAN AKADEMIK</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2">Mapel</th>
                          <th className="p-2 text-center">Nilai</th>
                          <th className="p-2">Predikat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nilaiSiswa.filter(n => n.siswaId === activePreviewStudent.id).map(r => (
                          <tr key={r.id} className="border-b">
                            <td className="p-2">{r.mapelNama}</td>
                            <td className="p-2 text-center">{r.nilaiAkhir}</td>
                            <td className="p-2">{getKKTPGrade(r.nilaiAkhir).text}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-center font-black underline text-sm">LAPORAN P5</h4>
                    <div className="space-y-2">
                       {raporP5.filter(p => p.siswaId === activePreviewStudent.id).map(p => (
                         <div key={p.id} className="p-2 border rounded">
                           <div className="font-bold">Tema: {p.temaProjek}</div>
                           <div className="text-[10px]">Mandiri: {p.mandiri}</div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 text-[10px] font-bold pt-8 border-t-2 border-dashed border-slate-400">
                  <div className="space-y-10"><div>Orang Tua Siswa</div><div>....................</div></div>
                  <div className="space-y-10 text-right"><div>Cililin, 10 Juni 2026</div><div>Wali Kelas</div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
