import React, { useState } from 'react';
import { 
  Calendar, Megaphone, Users, Plus, Trash2, 
  ExternalLink, MapPin, Clock, X, UserCheck 
} from 'lucide-react';
import { Kegiatan, Ekstrakurikuler, User, PendaftaranKegiatan } from '../types';

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
  onAddAnnouncement
}: DashboardOSISProps) {
  const [activeTab, setActiveTab] = useState<'kegiatan' | 'ekskul' | 'pengumuman'>('kegiatan');
  
  const [showAddKegiatan, setShowAddKegiatan] = useState(false);
  const [selectedKegiatanForDetails, setSelectedKegiatanForDetails] = useState<Kegiatan | null>(null);
  const [selectedEkskulForDetails, setSelectedEkskulForDetails] = useState<Ekstrakurikuler | null>(null);
  const [kegJudul, setKegJudul] = useState('');
  const [kegDesc, setKegDesc] = useState('');
  const [kegTanggal, setKegTanggal] = useState('');
  const [kegKategori, setKegKategori] = useState<'Lomba' | 'Acara' | 'Hari Besar' | 'Ujian'>('Acara');
  const [kegLokasi, setKegLokasi] = useState('');

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
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-10">
      {/* Header OSIS */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-950 rounded-3xl p-8 md:p-12 text-white shadow-premium relative overflow-hidden border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6 inline-block border border-indigo-500/20">
              Student Organization Board
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight">Student Engagement</h1>
            <p className="text-indigo-200/80 mt-4 text-sm md:text-lg max-w-xl leading-relaxed">
              Campus life management. Coordinate school calendars, student competitions, and digital achievement verification.
            </p>
          </div>
          <div className="flex gap-8 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-inner">
             <div className="text-center">
                <div className="text-3xl font-serif font-bold text-white">{kegiatan.length}</div>
                <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest mt-1">Events</div>
             </div>
             <div className="h-10 w-[1px] bg-white/10 self-center"></div>
             <div className="text-center">
                <div className="text-3xl font-serif font-bold text-white">{ekskul.length}</div>
                <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest mt-1">Clubs</div>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('kegiatan')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'kegiatan' ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'}`}
        >
          <Calendar size={14} /> Activities
        </button>
        <button 
          onClick={() => setActiveTab('ekskul')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'ekskul' ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'}`}
        >
          <Users size={14} /> Organizations
        </button>
        <button 
          onClick={() => setActiveTab('pengumuman')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'pengumuman' ? 'bg-white text-oxford shadow-sm' : 'text-slate-500 hover:text-oxford'}`}
        >
          <Megaphone size={14} /> Bulletins
        </button>
      </div>

      {activeTab === 'kegiatan' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-serif font-bold text-2xl text-oxford">Campus Calendar</h3>
            <button 
              onClick={() => setShowAddKegiatan(true)}
              className="bg-oxford text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-slate-800 shadow-md transition-all active:scale-[0.98]"
            >
              <Plus size={14} strokeWidth={2.5} /> Add Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kegiatan.map(k => {
              const participants = pendaftaran.filter(p => p.kegiatanId === k.id);
              return (
                <div key={k.id} className="card-premium p-6 group hover:border-bronze/30">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      k.kategori === 'Lomba' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                      k.kategori === 'Acara' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      k.kategori === 'Ujian' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {k.kategori}
                    </span>
                    <button onClick={() => onDeleteKegiatan(k.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 className="font-serif font-bold text-xl text-oxford mb-3 group-hover:text-bronze transition-colors leading-tight">{k.judul}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-6 leading-relaxed font-medium">{k.deskripsi}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      <Clock size={14} className="text-slate-300" /> {k.tanggal}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      <MapPin size={14} className="text-slate-300" /> {k.lokasi || 'Grand Hall'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{participants.length} Registered</span>
                    <button 
                      onClick={() => setSelectedKegiatanForDetails(k)}
                      className="text-bronze hover:underline text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                    >
                      Management <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedKegiatanForDetails && (
        <div className="fixed inset-0 bg-oxford/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="bg-oxford p-8 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-serif font-bold leading-none">{selectedKegiatanForDetails.judul}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Verified Registrants</p>
                </div>
                <button onClick={() => setSelectedKegiatanForDetails(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
             </div>
             <div className="p-8">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {pendaftaran.filter(p => p.kegiatanId === selectedKegiatanForDetails.id).length === 0 ? (
                      <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">No registrations recorded.</div>
                   ) : (
                      pendaftaran.filter(p => p.kegiatanId === selectedKegiatanForDetails.id).map((p, idx) => {
                         const siswa = siswaList.find(s => s.id === p.siswaId);
                         return (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all">
                               <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-bold text-slate-300 w-4">{idx + 1}.</span>
                                  <img src={siswa?.avatar || 'https://pravatar.cc/150'} alt="" className="h-10 w-10 rounded-xl object-cover border border-slate-100 shadow-sm" />
                                  <div>
                                     <h5 className="text-sm font-bold text-oxford">{siswa?.nama || 'Unidentified Student'}</h5>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{siswa?.nisnOrNip || 'NISN -'}</p>
                                  </div>
                               </div>
                               <button className="text-bronze font-bold text-[10px] uppercase tracking-widest hover:underline">Verify Account</button>
                            </div>
                         );
                      })
                   )}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'ekskul' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ekskul.map(e => (
            <div key={e.id} className="card-premium p-8 flex gap-6 group hover:border-bronze/30">
              <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                {e.logoUrl ? (
                  <img src={e.logoUrl} alt={e.nama} className="h-14 w-14 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Users size={36} className="text-slate-200" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="font-serif font-bold text-xl text-oxford group-hover:text-bronze transition-colors">{e.nama}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Faculty Advisor: {e.pembina}</p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{e.deskripsi}</p>
                <div className="flex items-center gap-4 pt-4">
                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">
                    {e.jumlahAnggota || 0} Members
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                    <Clock size={12} /> {e.jadwal}
                  </span>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => setSelectedEkskulForDetails(e)}
                    className="text-bronze hover:underline text-[10px] font-bold uppercase tracking-widest"
                  >
                    Club Management →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pengumuman' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-serif font-bold text-2xl text-oxford">Broadcast Bulletins</h3>
            <button 
              onClick={() => setShowAddAnn(true)}
              className="bg-oxford text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              <Plus size={14} strokeWidth={2.5} /> New Announcement
            </button>
          </div>

          <div className="space-y-6">
            {announcements.map(ann => (
              <div key={ann.id} className="card-premium p-8 flex gap-6 group">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl shrink-0 shadow-sm border border-blue-100/50">
                  <Megaphone size={22} strokeWidth={2.5} />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif font-bold text-lg text-oxford group-hover:text-bronze transition-colors">{ann.judul}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ann.tanggal}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{ann.konten}</p>
                  <div className="pt-6 flex justify-between items-center border-t border-slate-50">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Verified By: {ann.pengirim}</span>
                    <button className="text-rose-400 p-2 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
