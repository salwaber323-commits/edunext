-- Update integrity constraints for robustness

-- 1. Ensure students cannot be created without a name or role
alter table public.profiles alter column nama set not null;
alter table public.profiles alter column role set not null;

-- 2. Ensure Attendance Pertemuan is unique per Kelas, Mapel, and Tanggal
-- Prevent duplicate attendance sessions
alter table public.absensi_pertemuan add constraint unique_meeting unique (kelas_id, mapel_id, tanggal);

-- 3. Ensure Maternal/Tasks always have a title
alter table public.materi alter column judul set not null;
alter table public.tugas alter column judul set not null;

-- 4. Discussion on kelas_id:
-- For now, we allow NULL for kelas_id in profiles to support "Students in Transition" 
-- but we should add a view or alert in UI for Admin.
