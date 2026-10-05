-- Gohhul Raja Portfolio CMS
-- Run this entire file in Supabase SQL Editor.
-- IMPORTANT: Create the Auth user separately in Supabase Dashboard:
-- Authentication -> Users -> Add user
-- Email: gohhulraja@gmail.com
-- Use the password you chose for the private admin account.
-- Never put that password in source code.

create table if not exists public.site_content (
  id bigint primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  status text not null default 'In progress',
  category text not null default 'Software',
  stack text[] not null default '{}',
  link text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  caption text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;

-- Public portfolio content is readable by everyone.
create policy "public can read site"
on public.site_content for select
to anon, authenticated
using (true);

create policy "public can read projects"
on public.projects for select
to anon, authenticated
using (true);

create policy "public can read posts"
on public.posts for select
to anon, authenticated
using (true);

-- ONLY the specific authenticated admin email can write.
create policy "owner can insert site"
on public.site_content for insert
to authenticated
with check (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

create policy "owner can update site"
on public.site_content for update
to authenticated
using (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com')
with check (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

create policy "owner can insert projects"
on public.projects for insert
to authenticated
with check (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

create policy "owner can update projects"
on public.projects for update
to authenticated
using (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com')
with check (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

create policy "owner can delete projects"
on public.projects for delete
to authenticated
using (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

create policy "owner can insert posts"
on public.posts for insert
to authenticated
with check (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

create policy "owner can update posts"
on public.posts for update
to authenticated
using (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com')
with check (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

create policy "owner can delete posts"
on public.posts for delete
to authenticated
using (lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com');

grant select on public.site_content, public.projects, public.posts to anon, authenticated;
grant insert, update, delete on public.site_content, public.projects, public.posts to authenticated;

insert into public.site_content (id, content)
values (1, '{
  "name":"Gohhul Raja R B",
  "title":"Software Developer | AI & Emerging Technologies | Student",
  "tagline":"Building ideas. Learning by doing.",
  "bio":"I am a B.Tech Information Technology student who loves working with computers, building software, experimenting with AI and learning through real projects.",
  "about":"As a child, if someone wanted to be my friend, they could show me a computer. That curiosity never really left. I am learning by building websites, applications, technical prototypes and small experiments.",
  "current_idea":"Exploring AI, software engineering, emerging technologies and international opportunities.",
  "location":"Tamil Nadu, India",
  "education":"B.Tech Information Technology",
  "graduation":"2028",
  "github":"https://github.com/gohhulraja",
  "linkedin":"https://in.linkedin.com/in/gohhul-raja-r-b-3ba3a6357",
  "whatsapp":"https://wa.me/918072829987",
  "email":"gohhulraja@gmail.com",
  "avatar_url":"",
  "resume_url":""
}'::jsonb)
on conflict (id) do nothing;

insert into public.projects (name,description,status,category,stack,sort_order)
select 'Oasys Mart','Campus-focused marketplace for students and staff, built as a practical web development project.','Active development','Web Application',array['React','JavaScript','Node.js','MongoDB'],1
where not exists (select 1 from public.projects where name='Oasys Mart');

insert into public.projects (name,description,status,category,stack,sort_order)
select 'ZELQORA','AI-powered criminal network intelligence concept for analyzing fragmented crime-related information. SIH 2026 project.','Early stage','AI / Cybersecurity',array['AI','Cybersecurity','Blockchain'],2
where not exists (select 1 from public.projects where name='ZELQORA');

insert into public.projects (name,description,status,category,stack,sort_order)
select 'Green Software Engineering','Sustainability-focused software engineering concept exploring software efficiency, energy use and carbon-aware computing.','Concept / Presentation','Sustainability',array['Software Engineering','AI','Sustainability'],3
where not exists (select 1 from public.projects where name='Green Software Engineering');

insert into public.projects (name,description,status,category,stack,sort_order)
select 'AI-Based ECG Signal Analysis','AI-assisted ECG signal screening and research prototype presented as a technical symposium topic, not a clinical diagnostic device.','Research prototype','Biomedical AI',array['AI','Signal Processing','Python'],4
where not exists (select 1 from public.projects where name='AI-Based ECG Signal Analysis');

-- Storage bucket for portfolio images.
insert into storage.buckets (id, name, public)
values ('portfolio','portfolio',true)
on conflict (id) do update set public=true;

create policy "portfolio images are public"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio');

create policy "owner can upload portfolio images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio'
  and lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com'
);

create policy "owner can update portfolio images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio'
  and lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com'
)
with check (
  bucket_id = 'portfolio'
  and lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com'
);

create policy "owner can delete portfolio images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio'
  and lower((select auth.jwt()->>'email')) = 'gohhulraja@gmail.com'
);
