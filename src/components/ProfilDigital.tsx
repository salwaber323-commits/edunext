import React, { useState } from 'react';
import { Award, FileText, User, Plus, Trash2, Calendar, TrendingUp, Sparkles, X, Check } from 'lucide-react';
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
  role,
  student,
  certifications,
  grades,
  onAddCertification,
  onRemoveCertification
}: ProfilDigitalProps) {
  
  // Local form states
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertJudul, setNewCertJudul] = useState('');
  const [newCertTahun, setNewCertTahun] = useState('2026');
  const [newCertPenerbit, setNewCertPenerbit] = useState('');
  const [newCertTipe, setNewCertTipe] = useState<'Sertifikat' | 'Prestasi'>('Sertifikat');

  // Calculates typical GPA / average scores for metadata displaying
  const averageNilai = grades.length > 0 
    ? Math.round(grades.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / grades.length) 
    : 91;

  const letterGrade = averageNilai >= 90 ? 'A' : averageNilai >= 80 ? 'B' : 'C';

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-1">
      
      {/* Profil Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 h-32 md:h-40 relative"></div>
        
        <div className="p-6 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 sm:space-x-4 mb-4">
            <img 
              src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} 
              alt={student.nama} 
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md bg-white shrink-0" 
            />

            <div className="mt-4 sm:mt-0 flex-1">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Siswa Aktif X IPA 1
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{student.nama}</h1>
              <p className="text-xs text-slate-400 font-mono">NISN: {student.nisnOrNip || '122304958'}</p>
            </div>

            <div className="mt-4 sm:mt-0 flex gap-2">
              <div className="px-4 py-2 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-bold">RERATA NILAI</span>
                <span className="text-lg font-black text-blue-600">{averageNilai}</span>
              </div>
              <div className="px-4 py-2 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-bold">IP SEMESTER</span>
                <span className="text-lg font-black text-emerald-600">{letterGrade}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Rincian Rapor dan Sertifikat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Rapor Sejarah Nilai Semester */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <FileText className="text-blue-600" size={18} /> Nilai Rapor Semester Ini
            </h3>

            <div className="space-y-3">
              {grades.map(gr => (
                <div key={gr.id} className="p-3.5 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{gr.mapelNama}</h4>
                    <span className="text-[10px] text-slate-400">Guru: Pak Budi Hartono</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-semibold">UAS: {gr.uas}</span>
                      <span className="text-xs text-slate-400 block font-semibold">UTS: {gr.uts}</span>
                    </div>

                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm">
                      {gr.nilaiAkhir}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-50 rounded-xl text-xs text-blue-800 flex items-start gap-2">
              <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">Siswa Berprestasi</p>
                <p className="leading-relaxed">Nilai akhir semester Ahmad melampaui KKM sekolah (75) dalam semua mata pelajaran aktif.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Sertifikat & Prestasi */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Award className="text-blue-600" size={18} /> Arsip Sertifikat &amp; Prestasi Digital
              </h3>

              {!showAddCert && (
                <button
                  id="btn-add-sert-open"
                  onClick={() => setShowAddCert(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={12} /> Tambah
                </button>
              )}
            </div>

            {/* Simulating certificate uploader */}
            {showAddCert && (
              <form
                id="form-tambah-sertifikat"
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddCertification({
                    judul: newCertJudul,
                    tahun: newCertTahun,
                    penerbit: newCertPenerbit,
                    tipe: newCertTipe
                  });
                  setShowAddCert(false);
                  setNewCertJudul('');
                  setNewCertPenerbit('');
                  alert('Sertifikasi prestasi berhasil disimpan ke arsip digital!');
                }}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-700">Simpan Berkas Sertifikat Baru</h4>
                  <button type="button" onClick={() => setShowAddCert(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-500">
                  <div>
                    <label className="block mb-1">Judul Piagam / Lomba</label>
                    <input 
                      type="text" 
                      required
                      value={newCertJudul}
                      onChange={e => setNewCertJudul(e.target.value)}
                      placeholder="Misal: Juara 2 Tahfidz tingkat Kota..." 
                      className="w-full text-xs text-slate-800 border rounded p-1.5 bg-white" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1">Tahun Perolehan</label>
                      <input 
                        type="text" 
                        required
                        value={newCertTahun}
                        onChange={e => setNewCertTahun(e.target.value)}
                        placeholder="2026" 
                        className="w-full text-xs text-slate-800 border rounded p-1.5 bg-white" 
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Kategori Piagam</label>
                      <select 
                        value={newCertTipe}
                        onChange={e => setNewCertTipe(e.target.value as any)}
                        className="w-full text-xs text-slate-800 border rounded p-1.5 bg-white"
                      >
                        <option value="Sertifikat">Sertifikat Kelulusan</option>
                        <option value="Prestasi">Piagam Prestasi Lomba</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Penerbit Piagam / Instansi</label>
                    <input 
                      type="text" 
                      required
                      value={newCertPenerbit}
                      onChange={e => setNewCertPenerbit(e.target.value)}
                      placeholder="Misal: Dinas Pemuda dan Olahraga..." 
                      className="w-full text-xs text-slate-800 border rounded p-1.5 bg-white" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-2">
                  <button type="button" onClick={() => setShowAddCert(false)} className="bg-slate-200 px-3 py-1 rounded text-slate-700 text-[10px]">Batal</button>
                  <button type="submit" id="btn-submit-sert" className="bg-blue-600 text-white px-3.5 py-1 rounded text-[10px]">Simpan Berkas</button>
                </div>
              </form>
            )}

            {/* Certificate Cards List */}
            {certifications.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">Belum ada sertifikat terarsip.</p>
            ) : (
              <div className="space-y-3">
                {certifications.map(cert => (
                  <div key={cert.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50/50 transition-all flex items-start justify-between gap-2 group">
                    <div className="flex items-start gap-3">
                      <span className="p-2.5 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                        <Award size={20} />
                      </span>
                      <div>
                        <span className="bg-orange-50 text-orange-850 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          {cert.tipe}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-sm mt-1.5">{cert.judul}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Penerbit: {cert.penerbit} ({cert.tahun})</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Apakah Anda ingin menghapus sertifikat ini dari arsip digital?')) {
                          onRemoveCertification(cert.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title="Hapus arsip digital"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
