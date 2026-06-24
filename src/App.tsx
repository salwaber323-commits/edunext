import React, { useState, useEffect } from 'react';
import { 
  Menu, Bell, CheckSquare, Plus, RefreshCw, Calendar, 
  Award, FileText, BookOpen, User as UserIcon, Info, ArrowLeft, Send, Sparkles, AlertCircle, X, Check, ChevronRight, CheckCircle, TrendingUp, Megaphone
} from 'lucide-react';

import { 
  initialUsers, initialKelas, initialMapel, initialMateri, 
  initialTugas, initialPengumpulanTugas, initialAbsensiPertemuan, 
  initialNilaiSiswa, initialSertifikat, initialRaporP5
} from './initialData';

import { dataService } from './lib/dataService';
import { seedDatabase } from './lib/seed';

import { 
  UserRole, User, Kelas, MataPelajaran, Materi, Tugas, 
  PengumpulanTugas, AbsensiPertemuan, NilaiSiswa, Sertifikat, RaporP5,
  Kegiatan, Ekstrakurikuler, PendaftaranKegiatan, AnggotaEkskul
} from './types';

// Component imports
import Sidebar from './components/Sidebar';
import DashboardSiswa from './components/DashboardSiswa';
import DashboardGuru from './components/DashboardGuru';
import Classroom from './components/Classroom';
import AbsensiSistem from './components/AbsensiSistem';
import ProfilDigital from './components/ProfilDigital';
import AdminSetup from './components/AdminSetup';
import DashboardOSIS from './components/DashboardOSIS';

// Simulated announcement structure
interface Post {
  id: string;
  judul: string;
  konten: string;
  tanggal: string;
  pengirim: string;
  kategori: 'Penting' | 'Akademik' | 'Kegiatan';
}

const initialAnnouncements: Post[] = [
  {
    id: 'p1',
    judul: 'Pelaksanaan Ujian Akhir Semester (UAS) Genap',
    konten: 'Diumumkan seluruh siswa kelas X dan XI bahwa UAS Genap akan diselenggarakan secara langsung mulai tanggal 15 Juni sampai 22 Juni 2026. Persiapkan diri, pastikan absensi bulanan minimal mencapai 85%, dan kartu ujian telah diverifikasi oleh Wali Kelas.',
    tanggal: '2026-06-08',
    pengirim: 'Wakasek Bidang Akademik',
    kategori: 'Akademik',
  },
  {
    id: 'p2',
    judul: 'Pendaftaran Beasiswa Berprestasi Portofolio Digital',
    konten: 'Kesempatan emas! Sekolah resmi membuka program Beasiswa Prestasi khusus siswa aktif dengan portofolio digital terlengkap (minimal memiliki 2 sertifikat terdaftar di akun profil digital masing-masing). Pendaftaran ditutup lusa tanggal 12 Juni 2026.',
    tanggal: '2026-06-10',
    pengirim: 'Humas SMAN 1',
    kategori: 'Penting',
  }
];

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'update' | 'info';
  timestamp: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  // --- CORE STATE ---
  const [role, setRole] = useState<UserRole>('siswa');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // --- DATA STATES ---
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [tugasList, setTugasList] = useState<Tugas[]>([]);
  const [pengumpulanList, setPengumpulanList] = useState<PengumpulanTugas[]>([]);
  const [absensiMeetings, setAbsensiMeetings] = useState<AbsensiPertemuan[]>([]);
  const [nilaiSiswaList, setNilaiSiswaList] = useState<NilaiSiswa[]>([]);
  const [sertifikatList, setSertifikatList] = useState<Sertifikat[]>([]);
  const [announcements, setAnnouncements] = useState<Post[]>(initialAnnouncements);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [siswaList, setSiswaList] = useState<User[]>([]);
  const [raporP5List, setRaporP5List] = useState<RaporP5[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  
  // OSIS / KESISWAAN STATES
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [ekskulList, setEkskulList] = useState<Ekstrakurikuler[]>([]);
  const [pendaftaranKegiatan, setPendaftaranKegiatan] = useState<PendaftaranKegiatan[]>([]);
  const [anggotaEkskul, setAnggotaEkskul] = useState<AnggotaEkskul[]>([]);

  // UI STATES
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // REAL-TIME NOTIFICATIONS
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      message: "Tugas Baru: Limit Fungsi Aljabar (Matematika) dipublish!",
      type: 'success',
      timestamp: 'Baru Saja'
    },
    {
      id: 'n2',
      message: "Nilai Baru: Evaluasi KBM Fisika mendapat predikat Sangat Baik (A).",
      type: 'update',
      timestamp: '2 jam yang lalu'
    },
    {
      id: 'n3',
      message: "Pengumuman Baru: Pendaftaran Beasiswa Berprestasi Portofolio Digital resmi dibuka.",
      type: 'info',
      timestamp: 'Hari Ini'
    }
  ]);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  // --- NEW ANNOUNCEMENT FORM ---
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [siswaRaporTab, setSiswaRaporTab] = useState<'akademik' | 'p5'>('akademik');
  const [annJudul, setAnnJudul] = useState('');
  const [annKategori, setAnnKategori] = useState<'Penting' | 'Akademik' | 'Kegiatan'>('Akademik');
  const [annKonten, setAnnKonten] = useState('');

  // Loaded user mocks
  const studentUserObj = initialUsers.find(u => u.id === 'siswa_ahmad')!;
  const teacherUserObj = initialUsers.find(u => u.id === 'guru_budi')!;
  const adminUserObj = initialUsers.find(u => u.id === 'admin_siti') || {
    id: 'admin_siti',
    nama: 'Ibu Siti Khadijah, M.Pd.',
    role: 'admin' as const,
    nisnOrNip: '197908222005022001',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  };

  // Current simulation login identity
  const currentUserId = role === 'admin' ? adminUserObj.id : role === 'siswa' ? studentUserObj.id : teacherUserObj.id;
  const currentUserName = role === 'admin' ? adminUserObj.nama : role === 'siswa' ? studentUserObj.nama : teacherUserObj.nama;

  // --- INITIALIZE FROM SUPABASE ---
  useEffect(() => {
    const init = async () => {
      try {
        await seedDatabase();
        
        const [
          users, 
          kelas, 
          materi, 
          tugas, 
          pengumpulan, 
          absensi, 
          nilai, 
          sertifikat,
          raporP5,
          announcementsData
        ] = await Promise.all([
          dataService.getUsers(),
          dataService.getKelas(),
          dataService.getMateri(),
          dataService.getTugas(),
          dataService.getPengumpulan(),
          dataService.getAbsensi(),
          dataService.getNilaiSiswa(),
          dataService.getSertifikat(),
          dataService.getRaporP5(),
          dataService.getAnnouncements()
        ]);

        setSiswaList(users.filter(u => u.role === 'siswa'));
        setKelasList(kelas);
        setMateriList(materi);
        setTugasList(tugas);
        setPengumpulanList(pengumpulan);
        setAbsensiMeetings(absensi);
        setNilaiSiswaList(nilai);
        setSertifikatList(sertifikat);
        setRaporP5List(raporP5);
        setAnnouncements(announcementsData);

        const settings = await dataService.getSettings();
        if (settings.tahun_ajaran) setTahunAjaran(settings.tahun_ajaran);
        if (settings.semester) setSemester(settings.semester as any);

        const kegiatan = await dataService.getKegiatan();
        const ekskul = await dataService.getEkstrakurikuler();
        const pendaftaran = await dataService.getPendaftaranKegiatan();
        const anggota = await dataService.getAnggotaEkskul();

        setKegiatanList(kegiatan);
        setEkskulList(ekskul);
        setPendaftaranKegiatan(pendaftaran);
        setAnggotaEkskul(anggota);

        const storedRole = localStorage.getItem('lms_role') as UserRole;
        if (storedRole) setRole(storedRole);
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    init();
  }, []);

  const refreshData = async () => {
    try {
      const [
        users, 
        kelas, 
        materi, 
        tugas, 
        pengumpulan, 
        absensi, 
        nilai, 
        sertifikat,
        raporP5,
        announcementsData
      ] = await Promise.all([
        dataService.getUsers(),
        dataService.getKelas(),
        dataService.getMateri(),
        dataService.getTugas(),
        dataService.getPengumpulan(),
        dataService.getAbsensi(),
        dataService.getNilaiSiswa(),
        dataService.getSertifikat(),
        dataService.getRaporP5(),
        dataService.getAnnouncements()
      ]);

      setSiswaList(users.filter(u => u.role === 'siswa'));
      setKelasList(kelas);
      setMateriList(materi);
      setTugasList(tugas);
      setPengumpulanList(pengumpulan);
      setAbsensiMeetings(absensi);
      setNilaiSiswaList(nilai);
      setSertifikatList(sertifikat);
      setRaporP5List(raporP5);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  // --- PERSIST SAVERS ON STATE CHANGE ---
  const saveRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('lms_role', newRole);
  };

  // --- INTERACTION LOGICS ---

  // Swap Role Dashboard Simulation
  const handleToggleAndSwitchRole = (newRole?: UserRole) => {
    let target = newRole;
    if (!target) {
      target = role === 'siswa' ? 'guru' : role === 'guru' ? 'admin' : 'siswa';
    }
    saveRole(target);
    setSelectedClassId(null);
    setActiveTab('dashboard'); // reset to dashboard
    console.log(`Peran beralih ke: ${target}`);
  };

  // Student manual check-in attendance
  const checkInStudent = async (mapelId: string) => {
    const todayStr = '2026-06-10';
    const activeMeeting = absensiMeetings.find(abs => abs.mapelId === mapelId && abs.tanggal === todayStr && abs.isTerbuka);
    
    if (activeMeeting) {
      await dataService.updateKehadiran(activeMeeting.id, studentUserObj.id, 'Hadir');
      await refreshData();
    }
  };

  // Teacher manual open/close check-in meetings session
  const toggleMeetingState = async (mId: string) => {
    const meeting = absensiMeetings.find(m => m.id === mId);
    if (meeting) {
      await dataService.toggleAbsensi(mId, !meeting.isTerbuka);
      await refreshData();
    }
  };

  const openNewAttendanceSession = async (kelasId: string, mapelId: string, mapelNama: string, tanggalStr: string) => {
    await dataService.openAbsensi(kelasId, mapelId, mapelNama, tanggalStr);
    await refreshData();
  };

  const updateTeacherPresenceOverrider = async (mId: string, sId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
    await dataService.updateKehadiran(mId, sId, status);
    await refreshData();
  };

  // Class selection routing
  const selectActiveMockClass = (cId: string) => {
    setSelectedClassId(cId);
    setActiveTab('kelas');
  };

  // Academic adds: Materi & Homework
  const addNewMateriObj = async (newMat: Omit<Materi, 'id' | 'tanggalInput'>) => {
    await dataService.addMateri(newMat);
    await refreshData();
  };

  const addNewTugasObj = async (newTug: Omit<Tugas, 'id'>) => {
    await dataService.addTugas(newTug);
    
    // Real-time notification trigger
    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        message: `Tugas Baru: ${newTug.judul} (${newTug.mapelNama}) untuk Kelas ${kelasList.find(k => k.id === newTug.kelasId)?.nama || ''} telah dipublikasikan!`,
        type: 'success',
        timestamp: 'Baru Saja'
      },
      ...prev
    ]);

    await refreshData();
  };

  const submitStudentTugasFile = async (tId: string, fName: string, textAns: string) => {
    await dataService.submitTugas(tId, currentUserId, fName, textAns);

    // Real-time notification trigger
    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        message: `Tugas Dikumpulkan: Siswa mengumpulkan jawaban untuk tugas "${tugasList.find(t => t.id === tId)?.judul || ''}".`,
        type: 'info',
        timestamp: 'Baru Saja'
      },
      ...prev
    ]);

    await refreshData();
  };

  const updateStudentRaporGrades = async (updatedList: NilaiSiswa[]) => {
    await Promise.all(updatedList.map(n => dataService.upsertNilaiSiswa(n)));

    // Real-time notification trigger
    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        message: `Nilai Rapor diperbarui: Nilai S1/S2 Kurikulum Merdeka telah dikomputasi ulang secara massal.`,
        type: 'update',
        timestamp: 'Baru Saja'
      },
      ...prev
    ]);

    await refreshData();
  };

  const updateTeacherTaskAppraise = async (pengId: string, score: number) => {
    await dataService.updateGrade(pengId, score);

    // Real-time notification trigger
    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        message: `Pengumuman Nilai: Guru memberikan penilaian dan input nilai ${score} untuk pengumpulan tugas.`,
        type: 'success',
        timestamp: 'Baru Saja'
      },
      ...prev
    ]);

    await refreshData();
  };

  const addNewKelas = async (newK: { nama: string }) => {
    const fullK: Kelas = {
      id: `kelas_new_${Date.now()}`,
      nama: newK.nama,
      jumlahSiswa: 0
    };
    await dataService.upsertKelas(fullK, '2026/2027', 'Ganjil');
    await refreshData();
  };

  const deleteKelas = async (kId: string) => {
    await dataService.deleteKelas(kId);
    await refreshData();
  };

  const addNewSiswa = async (newS: { nama: string, nisn: string, kelasId: string }) => {
    const fullS: User = {
      id: `siswa_new_${Date.now()}`,
      nama: newS.nama,
      role: 'siswa',
      nisnOrNip: newS.nisn,
      kelasId: newS.kelasId,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
    };
    await dataService.upsertUser(fullS);

    // Also initialize default grade profile
    const newNilaiProfile: NilaiSiswa = {
      id: `nilai_new_${Date.now()}`,
      siswaId: fullS.id,
      siswaNama: fullS.nama,
      mapelId: 'mapel_matematika',
      mapelNama: 'Matematika',
      tugas1: 100,
      tugas2: 95,
      uts: 85,
      uas: 90,
      nilaiAkhir: 92
    };
    await dataService.upsertNilaiSiswa(newNilaiProfile);
    await refreshData();
  };

  const deleteSiswa = async (sId: string) => {
    await dataService.deleteUser(sId);
    await refreshData();
  };

  const massImportSiswa = async (csvData: string) => {
    const lines = csvData.split("\n").filter(l => l.trim() !== "");
    let count = 0;
    for (const line of lines) {
      const cols = line.split(",");
      if (cols.length >= 3) {
        const nama = cols[0].trim();
        const nisn = cols[1].trim();
        const className = cols[2].trim();
        const matchingKelas = kelasList.find(k => k.nama.toLowerCase() === className.toLowerCase());
        const kId = matchingKelas ? matchingKelas.id : (kelasList[0]?.id || 'kelas_x_ipa_1');
        await dataService.addUser({
          id: `siswa_${Date.now()}_${count}`,
          nama,
          role: 'siswa',
          nisn_nip: nisn,
          kelas_id: kId,
          avatar_url: `https://i.pravatar.cc/150?u=${nisn}`
        });
        count++;
      }
    }
    await refreshData();
    addToast(`Successfully imported ${count} students!`, 'success');
  };

  const promoteClasses = async () => {
    for (const s of siswaList) {
      const currentCls = kelasList.find(k => k.id === s.kelasId);
      if (!currentCls) continue;

      let targetClassName = '';
      if (currentCls.nama.startsWith('X ')) targetClassName = currentCls.nama.replace('X ', 'XI ');
      else if (currentCls.nama.startsWith('XI ')) targetClassName = currentCls.nama.replace('XI ', 'XII ');
      else if (currentCls.nama.startsWith('XII ')) {
        await dataService.updateUserKelas(s.id, 'alumni_archive');
        continue;
      } else continue;

      const matchedTargetCls = kelasList.find(k => k.nama === targetClassName);
      if (matchedTargetCls) {
        await dataService.updateUserKelas(s.id, matchedTargetCls.id);
      }
    }
    await refreshData();
  };

  const archiveAlumni = async () => {
    const studentsXII = siswaList.filter(s => {
      const cls = kelasList.find(k => k.id === s.kelasId);
      return cls && cls.nama.startsWith('XII ');
    });
    for (const s of studentsXII) {
      await dataService.updateUserKelas(s.id, 'alumni_archive');
    }
    await refreshData();
  };

  const updateAcademicSettings = async (ta: string, sem: 'Ganjil' | 'Genap') => {
    await dataService.updateSetting('tahun_ajaran', ta);
    await dataService.updateSetting('semester', sem);
    setTahunAjaran(ta);
    setSemester(sem);
    await refreshData();
  };

  const handleResetSemester = async () => {
    if (confirm("Serius? Ini akan menghapus data absensi dan pengumpulan tugas untuk semester saat ini. Pastikan rapor sudah dicetak!")) {
      await dataService.resetSemester();
      await refreshData();
      addToast("Semester has been reset. Legacy data archived.", 'info');
    }
  };

  // OSIS ACTIONS
  const addNewKegiatan = async (keg: Omit<Kegiatan, 'id'>) => {
    await dataService.addKegiatan(keg);
    await refreshData();
  };

  const deleteKegiatanObj = async (id: string) => {
    if (confirm("Hapus kegiatan ini secara permanen?")) {
      await dataService.deleteKegiatan(id);
      await refreshData();
    }
  };

  const registerForKegiatan = async (kegId: string) => {
    if (!currentUserId) return;
    await dataService.registerKegiatan(kegId, currentUserId);
    await refreshData();
    addToast("Successfully registered for the event.", 'success');
  };

  const joinEkskul = async (ekskulId: string) => {
    if (!currentUserId) return;
    await dataService.joinEkskul(ekskulId, currentUserId);
    await refreshData();
    addToast("Organization membership confirmed.", 'success');
  };

  const leaveEkskul = async (ekskulId: string) => {
    if (!currentUserId) return;
    await dataService.leaveEkskul(ekskulId, currentUserId);
    await refreshData();
  };

  const addAnnouncement = async (ann: any) => {
    await dataService.addAnnouncement(ann);
    await refreshData();
    addToast('Bulletin successfully published to the platform.', 'success');
  };

  // Portfolio achievements actions
  const addDigitalSertifikat = async (newC: Omit<Sertifikat, 'id' | 'siswaId'>) => {
    await dataService.addSertifikat(newC as any);
    await refreshData();
  };

  const removeDigitalSertifikat = async (cId: string) => {
    await dataService.deleteSertifikat(cId);
    await refreshData();
  };

  // Navigation callbacks
  const handleSidebarTabSelection = (tab: string, forceClassId?: string) => {
    if (tab === 'kelas') {
      setSelectedClassId(forceClassId || 'kelas_x_ipa_1');
    } else {
      setSelectedClassId(null);
    }
    setActiveTab(tab);
  };

  // Filter schedules and assignments for specific screens
  const activeSchedules = initialMapel.filter(m => m.kelasId === studentUserObj.kelasId);
  const studentUpcomingTugas = tugasList.filter(t => t.kelasId === studentUserObj.kelasId);
  const activeMeetings = absensiMeetings.filter(m => m.kelasId === studentUserObj.kelasId);

  return (
    <div className={`min-h-screen flex transition-colors duration-550 ${role === 'guru' ? 'bg-[#f4f7f6]' : 'bg-slate-50'}`}>
      
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar 
        role={role} 
        activeTab={activeTab} 
        onSelectTab={handleSidebarTabSelection} 
        isMobileOpen={isMobileSidebarOpen}
        onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onChangeRole={handleToggleAndSwitchRole}
      />

      {/* 2. CHIEF CONTENT BODY PANEL (Shifted left margin for desktop sticky sidebar) */}
      <div className="flex-1 flex flex-col lg:pl-[260px] min-w-0">
        
        {/* TOP STATUS HEADER BAR */}
        <header className="glass-header py-4 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${role === 'admin' ? 'bg-purple-600' : role === 'guru' ? 'bg-emerald-500' : 'bg-blue-600'}`}></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {role === 'admin' ? 'Administrator' : role === 'guru' ? 'Faculty Member' : role === 'osis' ? 'Student Organization' : 'Student Portal'}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-oxford tracking-tight">
                {selectedClassId 
                  ? `Class: ${kelasList.find(k => k.id === selectedClassId)?.nama || 'X IPA 1'}` 
                  : activeTab === 'dashboard' ? (role === 'admin' ? 'Control Center' : role === 'guru' ? 'Teacher Overview' : role === 'osis' ? 'Kesiswaan Dashboard' : 'Dashboard') : activeTab.replace('_', ' ').toUpperCase()}
              </h2>
            </div>
          </div>

          {/* Quick Cross-Roles Interaction Panel */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* REAL-TIME NOTIFICATION BELL POPOVER */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all relative shadow-sm"
                title="Sistem Notifikasi Sekolah"
              >
                <Bell size={18} strokeWidth={2.5} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bronze text-white font-black text-[8px] h-4.5 w-4.5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 mt-3 w-72 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-premium p-0 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                    <span className="font-bold text-xs text-slate-500 uppercase tracking-widest">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => {
                          setNotifications([]);
                          addToast("Notifications cleared.", 'info');
                        }}
                        className="text-[10px] text-bronze hover:underline font-bold cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bell className="mx-auto text-slate-200 mb-2" size={32} />
                        <p className="text-xs text-slate-400 font-medium">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50/50 transition-colors flex gap-3 border-b last:border-0 border-slate-50">
                          <div className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            notif.type === 'update' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {notif.type === 'success' && <Check size={16} strokeWidth={3} />}
                            {notif.type === 'update' && <Sparkles size={16} strokeWidth={3} />}
                            {notif.type === 'info' && <Info size={16} strokeWidth={3} />}
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold text-oxford leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{notif.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-oxford leading-none mb-1">{currentUserName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {role === 'admin' ? 'Super Admin' : role === 'guru' ? 'Faculty' : role === 'osis' ? 'OSIS Board' : 'X IPA 1'}
                </p>
              </div>
              <img 
                src={role === 'admin' ? adminUserObj.avatar : role === 'siswa' ? studentUserObj.avatar : teacherUserObj.avatar} 
                alt="Profile" 
                className="h-10 w-10 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-100" 
              />
            </div>
          </div>
        </header>

        {/* CONTAINER VIEWPORTS */}
        <main className="p-4 md:p-6 flex-1 select-none">
          
          {/* VIEW: DASHBOARD ADMIN */}
          {role === 'admin' && (activeTab === 'dashboard' || activeTab === 'setup_akademik' || activeTab === 'cetak_rapor_massal') && (
            <AdminSetup 
              kelas={kelasList}
              siswaList={siswaList}
              materiCount={materiList.length}
              tugasCount={tugasList.length}
              nilaiSiswa={nilaiSiswaList}
              raporP5={raporP5List}
              tahunAjaran={tahunAjaran}
              semester={semester}
              onAddKelas={addNewKelas}
              onDeleteKelas={deleteKelas}
              onAddSiswa={addNewSiswa}
              onDeleteSiswa={deleteSiswa}
              onMassImportSiswa={massImportSiswa}
              onPromoteClasses={promoteClasses}
              onArchiveAlumni={archiveAlumni}
              onUpdateSettings={updateAcademicSettings}
              onResetSemester={handleResetSemester}
            />
          )}

          {/* VIEW: DASHBOARD SISWA */}
          {activeTab === 'dashboard' && role === 'siswa' && (
            <DashboardSiswa 
              student={studentUserObj}
              schedules={activeSchedules}
              upcomings={studentUpcomingTugas}
              activeAbsensi={activeMeetings}
              pengumpulan={pengumpulanList}
              kegiatan={kegiatanList}
              ekskul={ekskulList}
              onCheckIn={checkInStudent}
              onNavigateToTab={handleSidebarTabSelection}
              onRegisterKegiatan={registerForKegiatan}
              onJoinEkskul={joinEkskul}
            />
          )}

          {/* VIEW: DASHBOARD GURU */}
          {activeTab === 'dashboard' && role === 'guru' && (
            <DashboardGuru 
              teacherName={teacherUserObj.nama}
              kelas={kelasList}
              tugas={tugasList}
              absensi={absensiMeetings}
              pengumpulanList={pengumpulanList}
              onOpenAbsensi={(kId, mId, mNama) => {
                openNewAttendanceSession(kId, mId, mNama, '2026-06-10');
              }}
              onSelectClass={selectActiveMockClass}
              onNavigateToTab={handleSidebarTabSelection}
            />
          )}

          {/* VIEW: DASHBOARD OSIS */}
          {activeTab === 'dashboard' && role === 'osis' && (
            <DashboardOSIS
              kegiatan={kegiatanList}
              ekskul={ekskulList}
              pendaftaran={pendaftaranKegiatan}
              siswaList={siswaList}
              announcements={announcements}
              onAddKegiatan={addNewKegiatan}
              onDeleteKegiatan={deleteKegiatanObj}
              onAddEkskul={async (e) => {}} 
              onAddAnnouncement={addAnnouncement}
            />
          )}

          {/* VIEW: CLASSROOM SPACE (Beranda, Materi, Tugas, Nilai, Siswa) */}
          {activeTab === 'kelas' && selectedClassId && role !== 'admin' && (
            <Classroom 
              activeClass={kelasList.find(k => k.id === selectedClassId) || kelasList[0] || initialKelas[0]}
              role={role}
              currentUserId={currentUserId}
              materi={materiList}
              tugas={tugasList}
              pengumpulanList={pengumpulanList}
              nilaiSiswa={nilaiSiswaList}
              siswaList={siswaList}
              onAddMateri={addNewMateriObj}
              onAddTugas={addNewTugasObj}
              onSubmitTugas={submitStudentTugasFile}
              onUpdateNilai={updateStudentRaporGrades}
              onGradeTugas={updateTeacherTaskAppraise}
            />
          )}

          {/* VIEW: MATERI ACCORDIONS WINDOW (Global Mapel index mapping) */}
          {activeTab === 'materi' && !selectedClassId && role !== 'admin' && (
            <Classroom 
              activeClass={kelasList[0] || initialKelas[0]}
              role={role}
              currentUserId={currentUserId}
              materi={materiList}
              tugas={tugasList}
              pengumpulanList={pengumpulanList}
              nilaiSiswa={nilaiSiswaList}
              siswaList={siswaList}
              onAddMateri={addNewMateriObj}
              onAddTugas={addNewTugasObj}
              onSubmitTugas={submitStudentTugasFile}
              onUpdateNilai={updateStudentRaporGrades}
              onGradeTugas={updateTeacherTaskAppraise}
            />
          )}

          {/* VIEW: TUGAS MANDIRI WINDOW */}
          {activeTab === 'tugas' && !selectedClassId && role !== 'admin' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800">Daftar Penugasan Aktif</h3>
                <p className="text-xs text-slate-400 mt-1">Pilih kelas di bawah ini untuk melihat detail instruksi soal dan mengumpulkan berkas.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {initialKelas.map(k => (
                    <div 
                      key={k.id}
                      onClick={() => selectActiveMockClass(k.id)}
                      className="p-4 rounded-xl border border-slate-100 hover:border-blue-400 hover:shadow bg-slate-50/50 hover:bg-white cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-700 text-sm">Kelas {k.nama}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{tugasList.filter(t => t.kelasId === k.id).length} Tugas Terbuka</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ABSENSI PORTAL */}
          {activeTab === 'kehadiran' && (
            <AbsensiSistem 
              role={role}
              currentUserId={currentUserId}
              kelas={initialKelas}
              siswaList={initialUsers.filter(u => u.role === 'siswa')}
              meetings={absensiMeetings}
              onToggleMeetingState={toggleMeetingState}
              onOpenNewAbsensi={openNewAttendanceSession}
              onUpdatePresence={updateTeacherPresenceOverrider}
            />
          )}

          {/* VIEW: REKAP ABSENSI CARDS */}
          {activeTab === 'rekap' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 text-lg">Rekapitulasi Kehadiran Akademik</h3>
                <p className="text-xs text-slate-400">Total persentase presensi Kehadiran KBM terintegrasi sekolah.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded uppercase">Semester Ganjil</span>
                  <div className="mt-4">
                    <span className="text-3.5xl font-black text-blue-950 font-serif">98.5%</span>
                    <span className="text-xs text-blue-700 block mt-1 font-bold">186 Hari Efektif</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">Semester Genap</span>
                  <div className="mt-4">
                    <span className="text-3.5xl font-black text-emerald-950 font-serif">96.0%</span>
                    <span className="text-xs text-emerald-700 block mt-1 font-bold">Hadir Teratur</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">Peringatan KBM</span>
                  <div className="mt-4 text-xs text-slate-500 leading-relaxed font-semibold">
                    Persentase kehadiran di bawah 85% dapat membatalkan keikut-sertaan UTS/UAS sekolah secara otomatis.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SPREADSHEET GRADINGS */}
          {activeTab === 'nilai' && (
            <Classroom 
              activeClass={initialKelas[0]}
              role={role}
              currentUserId={currentUserId}
              materi={materiList}
              tugas={tugasList}
              pengumpulanList={pengumpulanList}
              nilaiSiswa={nilaiSiswaList}
              siswaList={initialUsers.filter(u => u.role === 'siswa')}
              onAddMateri={addNewMateriObj}
              onAddTugas={addNewTugasObj}
              onSubmitTugas={submitStudentTugasFile}
              onUpdateNilai={updateStudentRaporGrades}
              onGradeTugas={updateTeacherTaskAppraise}
            />
          )}

          {/* VIEW: RAPOR AKADEMIK & P5 TRANSCRIPTS */}
          {activeTab === 'rapor' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Kartu Hasil Studi &amp; Rapor Elektronik</h3>
                    <p className="text-xs text-slate-400">Rapor resmi Kurikulum Merdeka Tahun Pelajaran 2025/2026.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {role === 'siswa' && (
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(['akademik', 'p5'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setSiswaRaporTab(t)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              siswaRaporTab === t
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Rapor {t === 'akademik' ? 'Akademik' : 'P5'}
                          </button>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        alert('Lembar cetak digital Rapor PDF berhasil di-download!');
                      }}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Unduh Rapor (PDF)
                    </button>
                  </div>
                </div>

                {role === 'siswa' ? (
                  <div className="mt-6">
                    {siswaRaporTab === 'akademik' ? (
                      /* Rapor Capaian Akademik */
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-1">
                          <div className="md:col-span-8 border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left font-mono text-xs">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-[10px] uppercase font-black text-slate-500">
                                  <th className="p-3">Mata Pelajaran KBM</th>
                                  <th className="p-3 text-center">KKTP</th>
                                  <th className="p-3 text-center">Nilai</th>
                                  <th className="p-3">Indikator Deskripsi Merdeka</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {nilaiSiswaList.filter(n => n.siswaId === studentUserObj.id).map(r => {
                                  let predikat = 'Cukup';
                                  if (r.nilaiAkhir >= 91) predikat = 'Sangat Baik';
                                  else if (r.nilaiAkhir >= 81) predikat = 'Baik';
                                  else if (r.nilaiAkhir >= 71) predikat = 'Cukup';
                                  else predikat = 'Perlu Bimbingan';

                                  return (
                                    <tr key={r.id} className="hover:bg-slate-50/20">
                                      <td className="p-3 font-semibold text-slate-800">{r.mapelNama}</td>
                                      <td className="p-3 text-center text-slate-400 font-bold">71</td>
                                      <td className="p-3 text-center font-bold text-sm text-blue-600 font-mono">{r.nilaiAkhir}</td>
                                      <td className="p-3 text-[10px] text-slate-500 font-sans leading-relaxed">
                                        Selesai menyelesaikan semua materi Tujuan Pembelajaran (TP) dengan predikat <strong>{predikat}</strong>. {r.nilaiAkhir < 71 ? 'Dianjurkan mendapat intervensi remedial harian.' : 'Pertahankan prestasi belajar dhuha terpuji.'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="md:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-150 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Aspek Kehadiran &amp; Catatan</h4>
                            
                            <div className="space-y-2 border-b border-slate-200 pb-3 text-xs font-mono">
                              <div className="flex justify-between">
                                <span>Hadir Efektif:</span>
                                <span className="font-bold text-slate-800">20 Hari</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Izin:</span>
                                <span className="font-bold text-slate-800">1 Hari</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Sakit:</span>
                                <span className="font-bold text-slate-800">0 Hari</span>
                              </div>
                              <div className="flex justify-between text-rose-600">
                                <span>Tanpa Keterangan:</span>
                                <span className="font-bold">0 Hari</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 block">CATATAN KHUSUS WALI KELAS:</span>
                              <p className="text-xs font-sans text-slate-600 leading-relaxed font-semibold">
                                Ahmad menunjukkan dedikasi shalat dhuha serta tadarus yang mengagumkan. Konsistensi dalam memahami materi Persamaan Kuadrat sangat membanggakan sekolah.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Rapor Projek Merdeka P5 Dimensions */
                      <div className="space-y-6">
                        <div className="bg-purple-950/5 text-purple-900 border border-purple-200 p-4 rounded-xl">
                          <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-900 px-3 py-1 rounded-full border border-purple-300/50">Projek Merdeka P5 Aktif</span>
                          <h4 className="font-bold text-sm mt-2 text-purple-950">Tema: Kewirausahaan Hijau: Pupuk Organik Merdeka Cililin</h4>
                          <p className="text-xs mt-1 text-purple-800 font-sans">
                            Siswa mempraktekkan sintesis pupuk alami menggunakan sampah kantin sekolah SMA Muhammadiyah Cililin untuk melatih sikap gotong royong dan kemandirian ekologis.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              dimensi: 'Dimensi 1: Beriman & Bertakwa',
                              predikat: 'Sangat Berkembang (SAB)',
                              deskripsi: 'Aktif merawat ekologi sekitar dan mensyukuri kelimpahan tanah subur di Cililin dengan bertanggung jawab penuh.'
                            },
                            {
                              dimensi: 'Dimensi 2: Bernalar Kritis',
                              predikat: 'Berkembang Sesuai Harapan (BSH)',
                              deskripsi: 'Mampu menganalisis kuantitas zat nitrogen alami dari ampas kopi sekolah secara sistematis.'
                            },
                            {
                              dimensi: 'Dimensi 3: Gotong Royong',
                              predikat: 'Sangat Berkembang (SAB)',
                              deskripsi: 'Sangat kooperatif dalam kelompok pembuatan pupuk tanpa memilah kasta pertemanan.'
                            },
                            {
                              dimensi: 'Dimensi 4: Mandiri',
                              predikat: 'Berkembang Sesuai Harapan (BSH)',
                              deskripsi: 'Tangguh dan teliti dalam mengarsipkan draf riset harian projek.'
                            }
                          ].map((item, id) => (
                            <div key={id} className="p-4 border rounded-xl bg-slate-50/50 border-slate-200">
                              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">{item.predikat}</span>
                              <h4 className="font-extrabold text-slate-800 text-sm mt-2">{item.dimensi}</h4>
                              <p className="text-xs text-slate-500 font-sans mt-1 leading-relaxed font-semibold">{item.deskripsi}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 text-center py-8 text-slate-450 text-xs border border-dashed border-slate-150 rounded-xl select-none">
                    Silakan gunakan panel <strong>Cetak Rapor Massal</strong> di atas untuk melihat transkrip seluruh kelas.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: PENGUMUMAN BULLETINS */}
          {activeTab === 'pengumuman' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Papan Mading Pengumuman Sekolah</h3>
                  <p className="text-xs text-slate-400">Informasi resmi langsung dari tata usaha dan wali kelas.</p>
                </div>

                {role === 'guru' && !showAddAnn && (
                  <button 
                    onClick={() => setShowAddAnn(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Plus size={14} /> Buat Pengumuman
                  </button>
                )}
              </div>

              {/* Form add announcement for Guru */}
              {role === 'guru' && showAddAnn && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const newP: Post = {
                      id: `ann_${Date.now()}`,
                      judul: annJudul,
                      konten: annKonten,
                      tanggal: '2026-06-10',
                      pengirim: 'Pak Budi Hartono',
                      kategori: annKategori
                    };
                    await dataService.addAnnouncement(newP);
                    await refreshData();
                    setShowAddAnn(false);
                    setAnnJudul('');
                    setAnnKonten('');
                    alert('Pengumuman sukses diterbitkan ke mading sekolah!');
                  }}
                  className="bg-white rounded-2xl p-6 border border-blue-150 shadow-sm space-y-4 max-w-2xl mx-auto"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-bold text-slate-800 text-sm">Tulis Berita / Pengumuman Baru</h4>
                    <button type="button" onClick={() => setShowAddAnn(false)} className="text-slate-400">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Kategori Utama</label>
                        <select 
                          value={annKategori}
                          onChange={e => setAnnKategori(e.target.value as any)}
                          className="w-full text-xs border rounded p-2 bg-white"
                        >
                          <option value="Akademik">Akademik</option>
                          <option value="Penting">Penting / Urgent</option>
                          <option value="Kegiatan">Kegiatan Siswa</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Judul Utama Berita</label>
                        <input 
                          type="text" 
                          required
                          value={annJudul}
                          onChange={e => setAnnJudul(e.target.value)}
                          placeholder="Ketik judul pengumuman..." 
                          className="w-full text-xs border rounded p-2 focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Isi Berita Lengkap</label>
                      <textarea 
                        rows={4}
                        required
                        value={annKonten}
                        onChange={e => setAnnKonten(e.target.value)}
                        placeholder="Tulis pesan pengumuman mading secara detail..."
                        className="w-full text-xs border rounded p-2 focus:outline-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 text-xs font-bold">
                    <button type="button" onClick={() => setShowAddAnn(false)} className="bg-slate-100 px-4 py-2 rounded-lg">Batal</button>
                    <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg">Tayangkan Sekarang</button>
                  </div>
                </form>
              )}

              {/* Announcement cards */}
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          ann.kategori === 'Penting' ? 'bg-red-50 text-red-700' :
                          ann.kategori === 'Akademik' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {ann.kategori}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">Tgl: {ann.tanggal}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-bold">Oleh: {ann.pengirim}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{ann.judul}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{ann.konten}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* VIEW: DIGITAL STUDENT PROFILE & CERTIFICATE ARCHIVE */}
          {activeTab === 'profil' && (
            <ProfilDigital 
              role={role}
              student={role === 'siswa' ? studentUserObj : {
                id: 'guru_budi',
                nama: teacherUserObj.nama,
                nisnOrNip: teacherUserObj.nisnOrNip,
                avatar: teacherUserObj.avatar
              }}
              certifications={sertifikatList}
              grades={nilaiSiswaList.filter(n => n.siswaId === studentUserObj.id)}
              onAddCertification={addDigitalSertifikat}
              onRemoveCertification={removeDigitalSertifikat}
            />
          )}

        </main>
      </div>

      {/* TOAST SYSTEM */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="flex items-center gap-3 bg-oxford text-white px-6 py-4 rounded-2xl shadow-premium animate-in fade-in slide-in-from-right-4 duration-300 border border-white/10"
          >
            {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-amber-400" />}
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
