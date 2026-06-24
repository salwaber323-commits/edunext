import React, { useState } from 'react';
import { 
  Calendar, Megaphone, Users, Award, Plus, Trash2, 
  ExternalLink, MapPin, Clock, BookOpen, UserPlus, CheckCircle2, X 
} from 'lucide-react';
import { Kegiatan, Ekstrakurikuler, User, Announcement, PendaftaranKegiatan } from '../types';

interface DashboardOSISProps {
  kegiatan: Kegiatan[];
  ekskul: Ekstrakurikuler[];
  pendaftaran: PendaftaranKegiatan[];
  siswaList: User[];
  announcements: any[];
  onAddKegiatan: (keg: Omit<Kegiatan, 'id'>) => Promise<void>;
  onDeleteKegiatan: (id: string) => Promise<void>;
  onAddEkskul: (ekskul: Omit<Ekstrakurikuler, 'id'>) => Promise<void>;
  onAddAnnouncement: (ann: any) => Promise<void>;
}

export default function DashboardOSIS({
  kegiatan,
  ekskul,
  pendaftaran,
  siswaList,
  announcements,
  onAddKegiatan,
  onDeleteKegiatan,
  onAddEkskul,
  onAddAnnouncement
}: DashboardOSISProps) {
  const [activeTab, setActiveTab] = useState<'kegiatan' | 'ekskul' | 'pengumuman'>('kegiatan');
  
  // States for new activity
  const [showAddKegiatan, setShowAddKegiatan] = useState(false);
  const [selectedKegiatanForDetails, setSelectedKegiatanForDetails] = useState<Kegiatan | null>(null);
  const [selectedEkskulForDetails, setSelectedEkskulForDetails] = useState<Ekstrakurikuler | null>(null);
  const [kegJudul, setKegJudul] = useState('');
  const [kegDesc, setKegDesc] = useState('');
  const [kegTanggal, setKegTanggal] = useState('');
  const [kegKategori, setKegKategori] = useState<'Lomba' | 'Acara' | 'Hari Besar' | 'Ujian'>('Acara');
  const [kegLokasi, setKegLokasi] = useState('');

  // States for new announcement
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [annJudul, setAnnJudul] = useState('');
  const [annKonten, setAnnKonten] = useState('');
  const [annKategori, setAnnKategori] = useState<'Penting' | 'Akademik' | 'Kegiatan'>('Kegiatan');

  const handleAddKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddKegiatan({
      judul: kegJudul,
      deskripsi: kegDesc,
      tanggal: kegTanggal,
      kategori: kegKategori,
      lokasi: kegLokasi
    });
    setKegJudul('');
    setKegDesc('');
    setKegTanggal('');
    setKegLokasi('');
    setShowAddKegiatan(false);
  };

  const handleAddAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddAnnouncement({
      id: `ann_${Date.now()}`,
      judul: annJudul,
      konten: annKonten,
      tanggal: new Date().toISOString().split('T')[0],
      pengirim: 'OSIS SMAM Cililin',
      kategori: annKategori
    });
    setAnnJudul('');
    setAnnKonten('');
    setShowAddAnn(false);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Header OSIS */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-500/30 text-blue-100 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block border border-blue-400/20">
              Panel Pengurus OSIS
            </span>
            <h1 className="text-3xl font-black tracking-tight">Kesiswaan & Kegiatan</h1>
            <p className="text-blue-100 mt-2 text-sm max-w-xl">
              Portal manajemen kegiatan siswa. Kelola kalender sekolah, pendaftaran lomba, pengumuman kesiswaan, dan sertifikat prestasi.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="text-center">
                <div className="text-2xl font-bold">{kegiatan.length}</div>
                <div className="text-[10px] uppercase font-bold text-blue-300">Kegiatan</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-bold">{ekskul.length}</div>
                <div className="text-[10px] uppercase font-bold text-blue-300">Ekskul</div>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveTab('kegiatan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'kegiatan' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border'}`}
        >
          <Calendar size={14} /> Kalender Kegiatan
        </button>
        <button 
          onClick={() => setActiveTab('ekskul')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'ekskul' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border'}`}
        >
          <Users size={14} /> Ekstrakurikuler
        </button>
        <button 
          onClick={() => setActiveTab('pengumuman')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'pengumuman' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border'}`}
        >
          <Megaphone size={14} /> Pengumuman
        </button>
      </div>

      {/* TAB CONTENT: KEGIATAN */}
      {activeTab === 'kegiatan' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Agenda Sekolah & Lomba</h3>
            <button 
              onClick={() => setShowAddKegiatan(true)}
              className="bg-blue-600 text-white text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              <Plus size={14} /> Tambah Agenda
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kegiatan.map(k => {
              const participants = pendaftaran.filter(p => p.kegiatanId === k.id);
              return (
                <div key={k.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      k.kategori === 'Lomba' ? 'bg-rose-100 text-rose-700' : 
                      k.kategori === 'Acara' ? 'bg-blue-100 text-blue-700' :
                      k.kategori === 'Ujian' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {k.kategori}
                    </span>
                    <div className="flex gap-2">
                       <button onClick={() => onDeleteKegiatan(k.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mb-2 group-hover:text-blue-600 transition-colors">{k.judul}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{k.deskripsi}</p>
                  
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock size={12} /> {k.tanggal}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin size={12} /> {k.lokasi || 'Lingkungan Sekolah'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400">Pendaftar: {participants.length} Siswa</span>
                    <button 
                      onClick={() => setSelectedKegiatanForDetails(k)}
                      className="text-blue-600 hover:underline text-[10px] font-bold flex items-center gap-1"
                    >
                      Lihat Detail <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: KEGIATAN DETAILS / PARTICIPANTS */}
      {selectedKegiatanForDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animated-fade-up">
             <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedKegiatanForDetails.judul}</h3>
                  <p className="text-blue-100 text-xs">Daftar Siswa Terdaftar</p>
                </div>
                <button onClick={() => setSelectedKegiatanForDetails(null)} className="text-white hover:bg-blue-500 p-2 rounded-full">
                  <X size={20} />
                </button>
             </div>
             <div className="p-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {pendaftaran.filter(p => p.kegiatanId === selectedKegiatanForDetails.id).length === 0 ? (
                      <div className="text-center py-10 text-slate-400 italic">Belum ada siswa yang mendaftar.</div>
                   ) : (
                      pendaftaran.filter(p => p.kegiatanId === selectedKegiatanForDetails.id).map((p, idx) => {
                         const siswa = siswaList.find(s => s.id === p.siswaId);
                         return (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-slate-300 w-4">{idx + 1}.</span>
                                  <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                                     <img src={siswa?.avatar || 'https://i.pravatar.cc/150'} alt="" className="object-cover h-full w-full" />
                                  </div>
                                  <div>
                                     <h5 className="text-sm font-bold text-slate-800">{siswa?.nama || 'Siswa tidak ditemukan'}</h5>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase">{siswa?.nisnOrNip || 'NISN -'}</p>
                                  </div>
                               </div>
                               <button className="text-blue-600 font-bold text-[10px]">VERIFIKASI</button>
                            </div>
                         );
                      })
                   )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EKSKUL */}
      {activeTab === 'ekskul' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Manajemen Ekstrakurikuler</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ekskul.map(e => (
              <div key={e.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-4 shadow-sm">
                <div className="h-16 w-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                  {e.logoUrl ? (
                    <img src={e.logoUrl} alt={e.nama} className="h-12 w-12 object-contain" />
                  ) : (
                    <Users size={32} className="text-slate-300" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">{e.nama}</h4>
                  <p className="text-xs text-slate-400 font-bold">Pembina: {e.pembina}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{e.deskripsi}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">
                      {e.jumlahAnggota || 0} Anggota
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {e.jadwal}
                    </span>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => setSelectedEkskulForDetails(e)}
                      className="text-indigo-600 hover:underline text-[10px] font-bold"
                    >
                      Manajemen Anggota →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EKSKUL MEMBERS */}
      {selectedEkskulForDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animated-fade-up">
             <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedEkskulForDetails.nama}</h3>
                  <p className="text-indigo-100 text-xs">Semua Anggota Terdaftar</p>
                </div>
                <button onClick={() => setSelectedEkskulForDetails(null)} className="text-white hover:bg-indigo-500 p-2 rounded-full">
                  <X size={20} />
                </button>
             </div>
             <div className="p-6">
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                   {/* This is a placeholder since we don't have separate anggotaEkskul state yet in this component */}
                   <p className="text-center py-6 text-slate-400 italic">Daftar anggota untuk {selectedEkskulForDetails.nama} sedang disinkronkan...</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PENGUMUMAN */}
      {activeTab === 'pengumuman' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Broadcast Pengumuman</h3>
            <button 
              onClick={() => setShowAddAnn(true)}
              className="bg-blue-600 text-white text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-xl"
            >
              <Plus size={14} /> Buat Pengumuman
            </button>
          </div>

          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <div className="h-10 w-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl shrink-0">
                  <Megaphone size={18} />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">{ann.judul}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{ann.tanggal}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{ann.konten}</p>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-600">Oleh: {ann.pengirim}</span>
                    <button className="text-rose-500 p-1 hover:bg-rose-50 rounded"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD KEGIATAN */}
      {showAddKegiatan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animated-fade-up">
            <div className="bg-blue-600 p-6 text-white">
              <h3 className="text-xl font-bold">Buat Agenda Baru</h3>
              <p className="text-blue-100 text-xs">Tambahkan kegiatan atau lomba ke kalender sekolah.</p>
            </div>
            <form onSubmit={handleAddKegiatan} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Nama Kegiatan</label>
                <input 
                  type="text" 
                  value={kegJudul}
                  onChange={e => setKegJudul(e.target.value)}
                  className="w-full text-xs border rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Mis: Lomba Mobile Legends SMA"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 block">Kategori</label>
                  <select 
                    value={kegKategori}
                    onChange={e => setKegKategori(e.target.value as any)}
                    className="w-full text-xs border rounded-xl p-3 bg-white"
                  >
                    <option value="Acara">Acara</option>
                    <option value="Lomba">Lomba</option>
                    <option value="Hari Besar">Hari Besar</option>
                    <option value="Ujian">Ujian</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 block">Tanggal</label>
                  <input 
                    type="date" 
                    value={kegTanggal}
                    onChange={e => setKegTanggal(e.target.value)}
                    className="w-full text-xs border rounded-xl p-3"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Lokasi</label>
                <input 
                  type="text" 
                  value={kegLokasi}
                  onChange={e => setKegLokasi(e.target.value)}
                  className="w-full text-xs border rounded-xl p-3"
                  placeholder="Mis: Ruang Multimedia"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Deskripsi Kegiatan</label>
                <textarea 
                  rows={3}
                  value={kegDesc}
                  onChange={e => setKegDesc(e.target.value)}
                  className="w-full text-xs border rounded-xl p-3"
                  placeholder="Jelaskan detail kegiatan di sini..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddKegiatan(false)}
                  className="flex-1 px-4 py-3 rounded-xl border font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ANNOUNCEMENT */}
      {showAddAnn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animated-fade-up">
            <div className="bg-blue-600 p-6 text-white text-center">
              <h3 className="text-xl font-bold">Broadcast Pengumuman</h3>
              <p className="text-blue-100 text-xs">Informasi akan muncul di dashboard seluruh siswa.</p>
            </div>
            <form onSubmit={handleAddAnn} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Judul Pengumuman</label>
                <input 
                  type="text" 
                  value={annJudul}
                  onChange={e => setAnnJudul(e.target.value)}
                  className="w-full text-xs border rounded-xl p-3"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 block">Konten / Isi</label>
                <textarea 
                  rows={4}
                  value={annKonten}
                  onChange={e => setAnnKonten(e.target.value)}
                  className="w-full text-xs border rounded-xl p-3"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddAnn(false)}
                  className="flex-1 px-4 py-3 rounded-xl border font-bold text-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white font-bold text-xs rounded-xl"
                >
                  Broadcast Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
