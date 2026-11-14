-- Initial database schema for Azis Muhamad Fadli Portfolio & CMS

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- 1. Site Profile (singleton id = 1)
create table if not exists public.site_profile (
  id int primary key default 1 check (id = 1),
  display_name text not null,
  wordmark text not null default 'azis',
  role_en text not null,
  role_id text not null default '',
  location text not null default 'INDONESIA',
  hero_bio_en text not null,
  hero_bio_id text not null default '',
  statement_en text not null,
  statement_id text not null default '',
  marquee_roles text[] not null default '{}',
  marquee_stack text[] not null default '{}',
  circle_quote_en text not null,
  circle_quote_id text not null default '',
  favorite_tech jsonb not null default '[]'::jsonb,
  contact_url text not null,
  social_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_site_profile_updated_at on public.site_profile;
create trigger trg_site_profile_updated_at
before update on public.site_profile
for each row execute function public.set_updated_at();

-- 2. Portfolio Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tech_stack text[] not null default '{}',
  external_url text not null,
  banner_url text not null default '',
  year text not null default '',
  featured_on_home boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_projects_sort_order
  on public.projects (sort_order asc, created_at asc);

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- 3. Blog Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content_markdown text not null,
  category text not null default 'DevOps',
  language text not null default 'id' check (language in ('id', 'en')),
  translation_group_id uuid null,
  cover_image_url text not null default '',
  reading_minutes int not null default 3 check (reading_minutes >= 1),
  published boolean not null default false,
  published_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_posts_published_date
  on public.posts (published, published_at desc);

create index if not exists idx_posts_category
  on public.posts (category);

create index if not exists idx_posts_translation_group
  on public.posts (translation_group_id);

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

-- 4. About Sections (singleton id = 1)
create table if not exists public.about_sections (
  id int primary key default 1 check (id = 1),
  headline_en text not null,
  headline_id text not null default '',
  profile_image_url text not null default '',
  journey_en text not null,
  journey_id text not null default '',
  philosophy_en text not null,
  philosophy_id text not null default '',
  interest_en text not null default '',
  interest_id text not null default '',
  interest_image_url text not null default '',
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_about_sections_updated_at on public.about_sections;
create trigger trg_about_sections_updated_at
before update on public.about_sections
for each row execute function public.set_updated_at();

-- 5. Skill Groups
create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_id text not null default '',
  items text[] not null default '{}',
  sort_order int not null default 0
);

create index if not exists idx_skill_groups_sort_order
  on public.skill_groups (sort_order asc);

-- 6. Activities & Milestones
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_id text not null default '',
  subtitle_en text not null default '',
  subtitle_id text not null default '',
  description_en text not null default '',
  description_id text not null default '',
  category text not null default 'Milestone',
  location text not null default '',
  year text not null default '',
  image_url text not null default '',
  sort_order int not null default 0
);

create index if not exists idx_activities_sort_order
  on public.activities (sort_order asc);

-- Enable Row Level Security
alter table public.site_profile enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.about_sections enable row level security;
alter table public.skill_groups enable row level security;
alter table public.activities enable row level security;

-- Public Read Policies
drop policy if exists "Public read site_profile" on public.site_profile;
create policy "Public read site_profile"
  on public.site_profile for select
  using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
  on public.projects for select
  using (true);

drop policy if exists "Public read published posts" on public.posts;
create policy "Public read published posts"
  on public.posts for select
  using (published = true or auth.role() = 'authenticated');

drop policy if exists "Public read about_sections" on public.about_sections;
create policy "Public read about_sections"
  on public.about_sections for select
  using (true);

drop policy if exists "Public read skill_groups" on public.skill_groups;
create policy "Public read skill_groups"
  on public.skill_groups for select
  using (true);

drop policy if exists "Public read activities" on public.activities;
create policy "Public read activities"
  on public.activities for select
  using (true);

-- Authenticated Single-Owner Write Policies
drop policy if exists "Owner write site_profile" on public.site_profile;
create policy "Owner write site_profile"
  on public.site_profile for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Owner write projects" on public.projects;
create policy "Owner write projects"
  on public.projects for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Owner write posts" on public.posts;
create policy "Owner write posts"
  on public.posts for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Owner write about_sections" on public.about_sections;
create policy "Owner write about_sections"
  on public.about_sections for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Owner write skill_groups" on public.skill_groups;
create policy "Owner write skill_groups"
  on public.skill_groups for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Owner write activities" on public.activities;
create policy "Owner write activities"
  on public.activities for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Supabase Storage Bucket & Policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

drop policy if exists "Public view portfolio-media" on storage.objects;
create policy "Public view portfolio-media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

drop policy if exists "Owner upload portfolio-media" on storage.objects;
create policy "Owner upload portfolio-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

drop policy if exists "Owner update portfolio-media" on storage.objects;
create policy "Owner update portfolio-media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated')
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

drop policy if exists "Owner delete portfolio-media" on storage.objects;
create policy "Owner delete portfolio-media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');
