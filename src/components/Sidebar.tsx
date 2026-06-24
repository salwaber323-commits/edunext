import React from 'react';
import { 
  LayoutDashboard, BookOpen, FileText, Calendar, 
  Award, Bell, User, Menu, X, LogOut, RefreshCw, Layers, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tab: string, classId?: string) => void;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
  onChangeRole: (newRole: UserRole) => void;
}

export default function Sidebar({
  role,
  activeTab,
  onSelectTab,
  isMobileOpen,
  onToggleMobile,
  onChangeRole
}: SidebarProps) {
  
  const isGuru = role === 'guru';
  const isAdmin = role === 'admin';
  const isSiswa = role === 'siswa';
  const isOSIS = role === 'osis';
  
  // Theme styling helpers based on role
  const theme = {
    brandBg: isAdmin ? 'bg-purple-600' : isGuru ? 'bg-teal-600' : isOSIS ? 'bg-indigo-600' : 'bg-blue-600',
    brandText: isSiswa ? 'text-slate-800' : 'text-white',
    subBrandText: isSiswa ? 'text-slate-400' : isGuru ? 'text-teal-400' : isOSIS ? 'text-indigo-400' : 'text-purple-400',
    pulseColor: isAdmin ? 'bg-purple-400' : isGuru ? 'bg-emerald-400' : isOSIS ? 'bg-indigo-400' : 'bg-blue-600',
    shadowColor: isAdmin ? 'shadow-purple-900/50' : isGuru ? 'shadow-teal-900/50' : isOSIS ? 'shadow-indigo-900/50' : 'shadow-blue-200',
    btnSwitch: isAdmin 
      ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-950/20' 
      : isGuru 
        ? 'bg-teal-700 hover:bg-teal-800 shadow-teal-950/20' 
        : isOSIS
          ? 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-950/20'
          : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100',
    roleTag: isAdmin 
      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
      : isGuru 
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
        : isOSIS
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          : 'bg-blue-100 text-blue-800',
    sidebarBg: isSiswa ? 'bg-white border-r border-slate-150' : 'bg-slate-950 border-r border-slate-900',
    cardBg: isSiswa ? 'bg-slate-50 border border-slate-100' : 'bg-slate-900/70 border border-slate-800',
    sectionHeader: isAdmin ? 'text-purple-400' : isGuru ? 'text-teal-500' : isOSIS ? 'text-indigo-400' : 'text-slate-400',
    mutedText: isSiswa ? 'text-slate-500' : 'text-slate-400',
  };

  // Renders a navigation button with active visual indicators
  const renderItem = (id: string, label: string, icon: React.ReactNode) => {
    const isActive = activeTab === id;
    let itemClass = '';
    
    if (isActive) {
      if (isAdmin) itemClass = 'bg-purple-600 text-white shadow-sm shadow-purple-500/20';
      else if (isGuru) itemClass = 'bg-teal-600 text-white shadow-sm shadow-teal-500/20';
      else if (isOSIS) itemClass = 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20';
      else itemClass = 'bg-blue-600 text-white shadow-sm shadow-blue-200';
    } else {
      if (isAdmin || isGuru || isOSIS) {
        itemClass = 'text-slate-300 hover:text-white hover:bg-slate-800/60';
      } else {
        itemClass = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
      }
    }

    return (
      <button
        key={id}
        id={`menu-${id}`}
        onClick={() => {
          onSelectTab(id);
          if (isMobileOpen) onToggleMobile();
        }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${itemClass}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const navContent = (
    <div className={`flex flex-col h-full justify-between p-5 ${theme.sidebarBg}`}>
      
      <div className="space-y-6">
        {/* LOGO SEKOLAH */}
        <div className={`flex items-center justify-between pb-4 border-b ${!isSiswa ? 'border-slate-900' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl text-white shadow ${theme.brandBg} ${theme.shadowColor}`}>
              {isAdmin ? <ShieldCheck size={20} /> : <BookOpen size={20} />}
            </span>
            <div>
              <h2 className={`font-extrabold text-xs tracking-tight ${theme.brandText} leading-none`}>SMAM MUSLIMIN</h2>
              <p className={`text-[8px] font-extrabold uppercase tracking-widest mt-0.5 leading-none ${theme.subBrandText}`}>LMS Merdeka</p>
            </div>
          </div>
          
          <button onClick={onToggleMobile} className={`lg:hidden p-1 ${!isSiswa ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
            <X size={18} />
          </button>
        </div>

        {/* User Role Indicator & Switcher */}
        <div className={`${theme.cardBg} p-4 rounded-2xl space-y-1.5`}>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full animate-pulse ${theme.pulseColor}`}></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Akses Portal
            </span>
          </div>
          <div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${theme.roleTag}`}>
              {isAdmin ? 'Admin • Ibu Siti' : isGuru ? 'Pendidik • Pak Budi' : isOSIS ? 'OSIS • Pengurus' : 'Siswa • Ahmad'}
            </span>
          </div>

          <p className="text-[9px] text-slate-400 !mt-2 select-none">Tukar Peran Simulasi:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {(['siswa', 'guru', 'admin', 'osis'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onChangeRole(r)}
                className={`py-1 rounded text-[9px] font-black uppercase transition-all cursor-pointer border ${
                  role === r
                    ? r === 'admin' ? 'bg-purple-600 text-white border-purple-500' : r === 'guru' ? 'bg-teal-600 text-white border-teal-500' : r === 'osis' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-blue-600 text-white border-blue-500'
                    : !isSiswa ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800' : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {r === 'siswa' ? 'Siswa' : r === 'guru' ? 'Guru' : r === 'admin' ? 'Admin' : 'OSIS'}
              </button>
            ))}
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="space-y-4">
          
          {/* Main Dashboard item */}
          <div className="space-y-1">
            {renderItem('dashboard', isAdmin ? 'Dasbor Admin' : isGuru ? 'Dasbor Wali Kelas' : 'Beranda Utama', <LayoutDashboard size={16} />)}
          </div>

          {/* ADMIN MENU */}
          {isAdmin && (
            <div className="space-y-1">
              <h4 className={`text-[10px] font-extrabold uppercase tracking-widest px-3 mb-1.5 ${theme.sectionHeader}`}>
                Instalasi Akademik
              </h4>
              {renderItem('setup_akademik', 'Manajemen Sekolah', <Layers size={16} />)}
              {renderItem('cetak_rapor_massal', 'Cetak Rapor Massal', <FileText size={16} />)}
            </div>
          )}

          {/* OSIS MENU */}
          {isOSIS && (
            <div className="space-y-1">
              <h4 className={`text-[10px] font-extrabold uppercase tracking-widest px-3 mb-1.5 ${theme.sectionHeader}`}>
                Kesiswaan
              </h4>
              {renderItem('dashboard', 'Agenda & Ekskul', <LayoutDashboard size={16} />)}
              {renderItem('kegiatan', 'Kalender Sekolah', <Calendar size={16} />)}
            </div>
          )}

          {/* AKADEMIK SECTION FOR SISWA & GURU */}
          {(isSiswa || isGuru) && (
            <div className="space-y-1">
              <h4 className={`text-[10px] font-extrabold uppercase tracking-widest px-3 mb-1.5 ${theme.sectionHeader}`}>
                Akademik
              </h4>
              {renderItem('materi', isGuru ? 'Materi & TP Silabus' : 'Materi Pembelajaran', <BookOpen size={16} />)}
              {renderItem('tugas', isGuru ? 'Evaluasi Tugas' : 'Tugas Kuliah/Sekolah', <FileText size={16} />)}
            </div>
          )}

          {/* ABSENSI SECTION FOR SISWA & GURU */}
          {(isSiswa || isGuru) && (
            <div className="space-y-1">
              <h4 className={`text-[10px] font-extrabold uppercase tracking-widest px-3 mb-1.5 ${theme.sectionHeader}`}>
                Absensi KBM
              </h4>
              {renderItem('kehadiran', isGuru ? 'Mulai Sesi Absen' : 'Presensi Mandiri', <Calendar size={16} />)}
              {!isGuru && renderItem('rekap', 'Rekap Kehadiran', <Award size={16} />)}
            </div>
          )}

          {/* NILAI SECTION FOR SISWA & GURU */}
          {!isAdmin && !isOSIS && (
            <div className="space-y-1">
              <h4 className={`text-[10px] font-extrabold uppercase tracking-widest px-3 mb-1.5 ${theme.sectionHeader}`}>
                Penilaian KKTP
              </h4>
              {isGuru ? (
                renderItem('nilai', 'Spreadsheet Nilai', <Award size={16} />)
              ) : (
                renderItem('rapor', 'Rapor Kurikulum Merdeka', <FileText size={16} />)
              )}
            </div>
          )}

          {/* COMMON PAGES */}
          <div className={`space-y-1 pt-2 border-t ${!isSiswa ? 'border-slate-900/60' : 'border-slate-150'}`}>
            {renderItem('pengumuman', 'Mading Sekolah', <Bell size={16} />)}
            {renderItem('profil', isAdmin ? 'Profil Admin' : isGuru ? 'Profil Pendidik' : 'Arsip Portofolio', <User size={16} />)}
          </div>

        </div>

      </div>

      <div className={`pt-4 border-t flex items-center justify-between text-[10px] font-bold ${!isSiswa ? 'border-slate-900 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
        <span>SMAM CILILIN v1.0</span>
        <span className={`h-1.5 w-1.5 rounded-full ${isAdmin ? 'bg-purple-500' : isGuru ? 'bg-emerald-500' : 'bg-blue-500'}`} title="Koneksi Enkripsi"></span>
      </div>

    </div>
  );

  return (
    <>
      <aside className="w-[260px] fixed inset-y-0 left-0 hidden lg:block z-20">
        {navContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={onToggleMobile} 
            className="fixed inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-sm"
          ></div>
          
          <aside className="fixed inset-y-0 left-0 w-[270px] max-w-[85vw] shadow-2xl z-50 transition-all animated-slide-in">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
