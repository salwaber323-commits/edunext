import React, { useState } from 'react';
import { Award, FileText, Plus, Trash2, TrendingUp, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Sertifikat, NilaiSiswa, UserRole } from '../types';

interface ProfilDigitalProps {
  role: UserRole;
  student: {
    id: string;
    nama: string;
    nisnOrNip?: string;
    kelasId?: string;
    avatar?: string;
  };
  certifications: Sertifikat[];
  grades: NilaiSiswa[];
  onAddCertification: (cert: Omit<Sertifikat, 'id' | 'siswaId'>) => void;
  onRemoveCertification: (certId: string) => void;
}

export default function ProfilDigital({
  student,
  certifications,
  grades,
  onAddCertification,
  onRemoveCertification
}: ProfilDigitalProps) {
  
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertJudul, setNewCertJudul] = useState('');
  const [newCertTahun, setNewCertTahun] = useState('2026');
  const [newCertPenerbit, setNewCertPenerbit] = useState('');
  const [newCertTipe, setNewCertTipe] = useState<'Sertifikat' | 'Prestasi'>('Sertifikat');

  const averageNilai = grades.length > 0 
    ? Math.round(grades.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / grades.length) 
    : 91;

  const letterGrade = averageNilai >= 90 ? 'A' : averageNilai >= 80 ? 'B' : 'C';

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-10">
      
      {/* Profil Header Card */}
      <div className="card-premium overflow-hidden border-0">
        <div className="bg-oxford h-48 md:h-64 relative">
           <img src="https://images.unsplash.com/photo-1635776062360-af423602aff3?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-10 mix-blend-overlay" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-oxford to-transparent"></div>
        </div>
        
        <div className="px-8 md:px-12 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-24 md:-mt-32 gap-8 mb-8">
            <div className="relative group">
              <img 
                src={student.avatar || "https://pravatar.cc/150?u=student"} 
                alt={student.nama} 
                className="h-40 w-40 md:h-48 md:w-48 rounded-3xl object-cover border-8 border-white shadow-2xl bg-white shrink-0 group-hover:scale-[1.02] transition-transform duration-500" 
              />
              <div className="absolute -bottom-4 -right-4 bg-bronze text-white p-3 rounded-2xl shadow-xl border-4 border-white">
                 <Sparkles size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex-1 md:pb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                  Academic Member
                </span>
                <span className="bg-oxford/10 text-oxford text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-oxford/10">
                  Cohort X IPA 1
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-oxford leading-tight">{student.nama}</h1>
              <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">NISN Verification: {student.nisnOrNip || '122304958'}</p>
            </div>

            <div className="flex gap-4 md:pb-4">
              <div className="card-premium p-6 min-w-[140px] text-center bg-slate-50/50">
                <span className="text-[10px] text-slate-400 block font-black uppercase tracking-widest mb-2">Aggregate</span>
                <span className="text-4xl font-serif font-bold text-oxford">{averageNilai}</span>
              </div>
              <div className="card-premium p-6 min-w-[140px] text-center border-bronze/20 bg-bronze/5">
                <span className="text-[10px] text-bronze block font-black uppercase tracking-widest mb-2">Standing</span>
                <span className="text-4xl font-serif font-bold text-bronze">{letterGrade}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Academic Records */}
        <div className="lg:col-span-6 space-y-8">
          <div className="card-premium p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
               <h3 className="font-serif font-bold text-2xl text-oxford flex items-center gap-3">
                 <FileText className="text-bronze" size={24} /> Semester Transcript
               </h3>
            </div>

            <div className="space-y-4">
              {grades.map(gr => (
                <div key={gr.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-bronze/30 hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-xl text-oxford group-hover:text-bronze transition-colors">{gr.mapelNama}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Validated by Lead Faculty</p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block space-y-1">
                      <div className="flex justify-between gap-4">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 w-12 text-left">Final:</span>
                         <span className="text-[10px] font-bold text-oxford">{gr.uas}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 w-12 text-left">Mid:</span>
                         <span className="text-[10px] font-bold text-oxford">{gr.uts}</span>
                      </div>
                    </div>

                    <div className="h-14 w-14 rounded-2xl bg-oxford text-white flex items-center justify-center font-serif font-bold text-xl shadow-xl ring-4 ring-slate-50 transition-transform group-hover:scale-110">
                      {gr.nilaiAkhir}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-oxford rounded-3xl text-white border border-white/10 relative overflow-hidden group">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                   <TrendingUp className="text-bronze" size={18} />
                   <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Merit Status</p>
                </div>
                <h4 className="font-serif font-bold text-2xl leading-none">Distinction Level Achievement</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium pt-2">Current academic records indicate high proficiency across standardized modules. Academic standing is within the top percentile.</p>
              </div>
              <Sparkles className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-bronze/10 transition-colors duration-700" size={160} />
            </div>
          </div>
        </div>

        {/* Digital Portfolio */}
        <div className="lg:col-span-6 space-y-8">
          <div className="card-premium p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <h3 className="font-serif font-bold text-2xl text-oxford flex items-center gap-3">
                <Award className="text-bronze" size={24} /> Achievement Portfolio
              </h3>

              {!showAddCert && (
                <button
                  onClick={() => setShowAddCert(true)}
                  className="bg-oxford text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <Plus size={14} strokeWidth={2.5} /> Index Asset
                </button>
              )}
            </div>

            {showAddCert && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddCertification({
                    judul: newCertJudul,
                    tahun: newCertTahun,
                    penerbit: newCertPenerbit,
                    tipe: newCertTipe
                  });
                  setShowAddCert(false);
                }}
                className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h4 className="font-serif font-bold text-lg text-oxford">Register New Achievement</h4>
                  <button type="button" onClick={() => setShowAddCert(false)} className="text-slate-400 hover:text-oxford">
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Award / Title</label>
                    <input type="text" required value={newCertJudul} onChange={e => setNewCertJudul(e.target.value)} className="w-full text-sm font-bold text-oxford border border-slate-200 bg-white rounded-xl px-4 py-3 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</label>
                      <input type="text" required value={newCertTahun} onChange={e => setNewCertTahun(e.target.value)} className="w-full text-sm font-bold text-oxford border border-slate-200 bg-white rounded-xl px-4 py-3 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</label>
                      <select value={newCertTipe} onChange={e => setNewCertTipe(e.target.value as any)} className="w-full text-sm font-bold text-oxford border border-slate-200 bg-white rounded-xl px-4 py-3 outline-none">
                        <option value="Sertifikat">Academic Certificate</option>
                        <option value="Prestasi">Competitive Achievement</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issuing Institution</label>
                    <input type="text" required value={newCertPenerbit} onChange={e => setNewCertPenerbit(e.target.value)} className="w-full text-sm font-bold text-oxford border border-slate-200 bg-white rounded-xl px-4 py-3 outline-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddCert(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6">Cancel</button>
                  <button type="submit" className="bg-bronze text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-md">Authenticate Asset</button>
                </div>
              </form>
            )}

            {certifications.length === 0 ? (
              <div className="p-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium italic">Achievement archives are empty.</div>
            ) : (
              <div className="space-y-4">
                {certifications.map(cert => (
                  <div key={cert.id} className="card-premium p-6 hover:border-bronze/30 group relative">
                    <div className="flex items-start gap-6">
                      <div className="p-4 rounded-2xl bg-bronze/10 text-bronze shadow-inner group-hover:bg-bronze group-hover:text-white transition-colors duration-500 shrink-0">
                        <Award size={28} />
                      </div>
                      <div className="flex-1 min-w-0 pr-10">
                        <span className="bg-slate-100 text-slate-500 text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full group-hover:bg-bronze/20 group-hover:text-bronze transition-colors">
                          {cert.tipe} Verified
                        </span>
                        <h4 className="font-serif font-bold text-xl text-oxford mt-3 leading-tight truncate">{cert.judul}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{cert.penerbit} • {cert.tahun}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveCertification(cert.id)}
                      className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-6">
               <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <CheckCircle2 className="text-emerald-600" size={18} />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Identity and achievement data synchronized with National Academic Database.</p>
               </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
