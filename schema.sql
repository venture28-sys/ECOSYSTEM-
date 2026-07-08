-- ============================================================
-- BUILD ME — Core Identity & Profile Schema v1.0
-- Run this once in Supabase SQL Editor (or via `supabase db push`)
-- Covers: registration roles, LinkedIn-style profiles, skills,
-- certificates, portfolio, completed jobs, ratings, phone verification.
-- ============================================================

-- ---------- 1. Roles ----------
-- Matches Build Me Knowledge Base §3 (User Types)
create type user_role as enum (
  'client',
  'worker',
  'contractor',
  'architect',
  'engineer',
  'quantity_surveyor',
  'supplier'
);

-- ---------- 2. Profiles ----------
-- One row per registered user. id matches auth.users.id (1:1).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  headline text,                          -- e.g. "Structural Engineer · 8 yrs experience"
  bio text,
  location text,                          -- e.g. "Accra, Ghana"
  avatar_url text,
  cover_url text,
  phone text,
  phone_verified boolean not null default false,
  is_available boolean not null default true,
  available_from date,                    -- optional: "available starting this date"
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending', 'verified', 'rejected')),
  rating_avg numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  completed_jobs_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on profiles(role);
create index profiles_location_idx on profiles(location);

-- ---------- 3. Skills ----------
create table skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index skills_profile_idx on skills(profile_id);

-- ---------- 4. Certificates ----------
create table certificates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  issuer text,
  issue_date date,
  file_url text,                          -- points to Supabase Storage (certificates bucket)
  created_at timestamptz not null default now()
);
create index certificates_profile_idx on certificates(profile_id);

-- ---------- 5. Portfolio ----------
create table portfolio_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text,                         -- points to Supabase Storage (portfolio bucket)
  project_url text,
  created_at timestamptz not null default now()
);
create index portfolio_profile_idx on portfolio_items(profile_id);

-- ---------- 6. Completed Jobs ----------
create table completed_jobs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  client_name text,
  completed_at date,
  description text,
  created_at timestamptz not null default now()
);
create index completed_jobs_profile_idx on completed_jobs(profile_id);

-- ---------- 7. Ratings ----------
create table ratings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,  -- who is being rated
  rater_id uuid not null references profiles(id) on delete cascade,     -- who left the rating
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (profile_id, rater_id)            -- one rating per rater per profile
);
create index ratings_profile_idx on ratings(profile_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create a profile row the moment someone signs up via Supabase Auth.
-- Role and full_name are passed in as auth metadata at signup time.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client'),
    coalesce(new.raw_user_meta_data->>'full_name', 'New User')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Keep rating_avg / rating_count in sync whenever a rating is added, changed, or removed.
create or replace function recalculate_rating()
returns trigger as $$
declare
  target_profile uuid := coalesce(new.profile_id, old.profile_id);
begin
  update profiles
  set rating_count = (select count(*) from ratings where profile_id = target_profile),
      rating_avg = (select coalesce(avg(rating), 0) from ratings where profile_id = target_profile)
  where id = target_profile;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_rating_change
  after insert or update or delete on ratings
  for each row execute procedure recalculate_rating();

-- Keep updated_at current on profile edits.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Public marketplace principle: profiles are readable by anyone (like LinkedIn),
-- but only the owner can write to their own data.
-- ============================================================

alter table profiles enable row level security;
alter table skills enable row level security;
alter table certificates enable row level security;
alter table portfolio_items enable row level security;
alter table completed_jobs enable row level security;
alter table ratings enable row level security;

-- Profiles: public read, owner-only write
create policy "Profiles are publicly readable" on profiles
  for select using (true);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Skills: public read, owner-only write
create policy "Skills are publicly readable" on skills
  for select using (true);
create policy "Users manage their own skills" on skills
  for insert with check (auth.uid() = profile_id);
create policy "Users update their own skills" on skills
  for update using (auth.uid() = profile_id);
create policy "Users delete their own skills" on skills
  for delete using (auth.uid() = profile_id);

-- Certificates: public read, owner-only write
create policy "Certificates are publicly readable" on certificates
  for select using (true);
create policy "Users manage their own certificates" on certificates
  for insert with check (auth.uid() = profile_id);
create policy "Users delete their own certificates" on certificates
  for delete using (auth.uid() = profile_id);

-- Portfolio: public read, owner-only write
create policy "Portfolio is publicly readable" on portfolio_items
  for select using (true);
create policy "Users manage their own portfolio" on portfolio_items
  for insert with check (auth.uid() = profile_id);
create policy "Users update their own portfolio" on portfolio_items
  for update using (auth.uid() = profile_id);
create policy "Users delete their own portfolio" on portfolio_items
  for delete using (auth.uid() = profile_id);

-- Completed jobs: public read; writes restricted (in production, these should
-- be inserted by a trusted backend function when a project actually closes,
-- not directly by the user — flagged here as an assumption to revisit).
create policy "Completed jobs are publicly readable" on completed_jobs
  for select using (true);

-- Ratings: public read; any authenticated user can rate someone else (not themselves)
create policy "Ratings are publicly readable" on ratings
  for select using (true);
create policy "Users can rate others, not themselves" on ratings
  for insert with check (auth.uid() = rater_id and rater_id <> profile_id);

-- ============================================================
-- STORAGE BUCKETS
-- Run in Supabase SQL Editor — creates buckets with public read access.
-- Folder convention: {bucket}/{user_id}/{filename} so owner-only write rules are simple.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true),
       ('covers', 'covers', true),
       ('certificates', 'certificates', true),
       ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Public read for all four buckets
create policy "Public read avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Public read covers" on storage.objects for select using (bucket_id = 'covers');
create policy "Public read certificates" on storage.objects for select using (bucket_id = 'certificates');
create policy "Public read portfolio" on storage.objects for select using (bucket_id = 'portfolio');

-- Owner-only write: file path must start with the user's own auth.uid()
create policy "Users upload their own avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users upload their own cover" on storage.objects
  for insert with check (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users upload their own certificates" on storage.objects
  for insert with check (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users upload their own portfolio files" on storage.objects
  for insert with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- End of schema. Next: Authentication > Providers > enable Phone (Twilio)
-- for phone verification, and Authentication > Email Templates for the
-- venture28.limited@gmail.com sender identity (see SETUP-GUIDE.md).
-- ============================================================
