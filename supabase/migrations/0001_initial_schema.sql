-- ====== ESPRIT TRAIL — SCHÉMA INITIAL ======
-- Migration v1 — Auth Supabase (auth.users) + profil Esprit trail + runs + gamification.
-- À jouer dans l'éditeur SQL Supabase, ou via `supabase db push`.

-- Extensions
create extension if not exists "uuid-ossp";

-- ==============================================
-- PROFILES — extension de auth.users
-- ==============================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar text default '🏃',
  xp integer not null default 0,
  weekly_target integer not null default 3 check (weekly_target between 1 and 7),
  weekly_progress integer not null default 0,
  streak integer not null default 0,
  mode text not null default 'adventure' check (mode in ('adventure', 'performance')),
  loot_style text not null default 'gamer' check (loot_style in ('gamer', 'real', 'hidden')),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Connexions externes (JSON pour souplesse MVP)
  utmb_index integer,
  utmb_category_index jsonb,
  itra_performance_index integer,
  itra_level integer,
  watches text[] not null default '{}'
);

alter table public.profiles enable row level security;

-- RLS : chaque user peut lire tous les profils (social) mais n'édite que le sien
create policy "profiles_read_all" on public.profiles
  for select using (true);

create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- ==============================================
-- RUNS — sorties trail
-- ==============================================

create table if not exists public.runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date timestamptz not null,
  title text not null,
  location text,
  distance numeric(6,2) not null,
  elevation integer not null default 0,
  duration integer not null, -- secondes
  avg_pace text,
  terrain text check (terrain in ('flat', 'hilly', 'mountain', 'alpine', 'technical')),
  source text check (source in ('strava', 'garmin', 'coros', 'suunto', 'manual')),
  external_id text, -- id de la source externe (ex: strava activity id)
  xp_earned integer not null default 0,
  polyline text, -- GeoJSON ou encodé Google Polyline
  created_at timestamptz not null default now(),
  unique(source, external_id) -- évite double import
);

create index if not exists runs_user_date_idx on public.runs(user_id, date desc);

alter table public.runs enable row level security;

create policy "runs_read_public" on public.runs
  for select using (true);

create policy "runs_modify_self" on public.runs
  for all using (auth.uid() = user_id);

-- ==============================================
-- BADGES — définitions et déblocage
-- ==============================================

create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  rarity text not null check (rarity in ('common', 'rare', 'epic', 'legendary', 'mythic')),
  category text not null,
  xp_reward integer not null default 0,
  global_unlock_rate numeric(5,2) not null default 0
);

create table if not exists public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id text references public.badges(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  run_id uuid references public.runs(id) on delete set null,
  primary key (user_id, badge_id)
);

alter table public.user_badges enable row level security;
create policy "user_badges_read_public" on public.user_badges for select using (true);
create policy "user_badges_insert_self" on public.user_badges for insert with check (auth.uid() = user_id);

-- ==============================================
-- QUESTS — quêtes personnelles et progression
-- ==============================================

create table if not exists public.quest_definitions (
  id text primary key,
  title text not null,
  description text not null,
  icon text,
  period text not null check (period in ('daily', 'weekly', 'seasonal', 'epic')),
  target numeric not null,
  unit text not null,
  xp_reward integer not null default 0,
  active boolean not null default true
);

create table if not exists public.user_quests (
  user_id uuid references public.profiles(id) on delete cascade,
  quest_id text references public.quest_definitions(id) on delete cascade,
  progress numeric not null default 0,
  completed_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (user_id, quest_id, expires_at)
);

alter table public.user_quests enable row level security;
create policy "user_quests_read_self" on public.user_quests for select using (auth.uid() = user_id);
create policy "user_quests_modify_self" on public.user_quests for all using (auth.uid() = user_id);

-- ==============================================
-- GUILDES
-- ==============================================

create table if not exists public.guildes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  emoji text not null default '⚔️',
  tagline text,
  description text,
  category text check (category in ('local', 'club', 'bande-copains', 'elite', 'theme')),
  location text,
  max_members integer not null default 20 check (max_members <= 50),
  join_rule text not null default 'open' check (join_rule in ('open', 'request', 'invite-only')),
  captain_id uuid not null references public.profiles(id) on delete set null,
  vibe text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.guilde_members (
  guilde_id uuid references public.guildes(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('captain', 'member')),
  joined_at timestamptz not null default now(),
  primary key (guilde_id, user_id)
);

alter table public.guildes enable row level security;
create policy "guildes_read_all" on public.guildes for select using (true);
create policy "guildes_create_any" on public.guildes for insert with check (auth.uid() = captain_id);
create policy "guildes_update_captain" on public.guildes for update using (auth.uid() = captain_id);

alter table public.guilde_members enable row level security;
create policy "guilde_members_read_all" on public.guilde_members for select using (true);
create policy "guilde_members_insert_self" on public.guilde_members for insert with check (auth.uid() = user_id);
create policy "guilde_members_delete_self" on public.guilde_members for delete using (auth.uid() = user_id);

-- ==============================================
-- COACH IA PLANS — plans générés
-- ==============================================

create table if not exists public.coach_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal text not null,
  target_date date,
  total_weeks integer not null,
  plan_data jsonb not null, -- structure renvoyée par /api/coach/plan
  status text not null default 'active' check (status in ('active', 'paused', 'done', 'abandoned')),
  current_week integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.coach_plans enable row level security;
create policy "coach_plans_read_self" on public.coach_plans for select using (auth.uid() = user_id);
create policy "coach_plans_modify_self" on public.coach_plans for all using (auth.uid() = user_id);

-- ==============================================
-- TRIGGERS — updated_at auto
-- ==============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_coach_plans on public.coach_plans;
create trigger set_updated_at_coach_plans
  before update on public.coach_plans
  for each row execute function public.handle_updated_at();

-- ==============================================
-- TRIGGER — auto-créer un profil à la création d'un compte auth
-- ==============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
