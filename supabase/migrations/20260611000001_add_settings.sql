-- Table: Settings (Global academic configuration)
create table if not exists public.settings (
    key text primary key,
    value text not null,
    updated_at timestamp with time zone default now()
);

-- Insert default settings
insert into public.settings (key, value) values 
('tahun_ajaran', '2026/2027')
on conflict (key) do nothing;

insert into public.settings (key, value) values 
('semester', 'Ganjil')
on conflict (key) do nothing;
