-- Consolidated Supabase migration for Conciergeries France
-- Run in Supabase → SQL Editor (or via CLI).
-- Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Subscriptions (annuaire + PMS)
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null check (plan in ('standard', 'premium', 'pms')),
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  includes_pms boolean not null default false,
  includes_directory boolean not null default true,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions drop constraint if exists subscriptions_plan_check;
alter table public.subscriptions
  add constraint subscriptions_plan_check check (plan in ('standard', 'premium', 'pms'));

alter table public.subscriptions
  add column if not exists includes_pms boolean not null default false;
alter table public.subscriptions
  add column if not exists includes_directory boolean not null default true;
alter table public.subscriptions
  add column if not exists trial_ends_at timestamptz;

update public.subscriptions
set includes_pms = true
where lower(plan) in ('premium', 'pms') and includes_pms = false;

update public.subscriptions
set includes_directory = false
where lower(plan) = 'pms';

update public.subscriptions
set includes_directory = true
where lower(plan) in ('standard', 'premium') and includes_directory = false;

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions
for select
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Partner profiles (annuaire)
-- ---------------------------------------------------------------------------
create table if not exists public.partner_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  slug text not null unique,
  city text not null,
  description text not null,
  logo_url text,
  website text,
  phone text,
  email text,
  address text,
  services text[] not null default '{}'::text[],
  platforms text[] not null default '{}'::text[],
  plan text not null default 'standard' check (plan in ('standard', 'premium', 'pms')),
  subscription_status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Existing DBs may still have the old check (standard|premium only).
alter table public.partner_profiles drop constraint if exists partner_profiles_plan_check;
alter table public.partner_profiles
  add constraint partner_profiles_plan_check check (plan in ('standard', 'premium', 'pms'));

create index if not exists partner_profiles_slug_idx on public.partner_profiles (slug);
create index if not exists partner_profiles_user_id_idx on public.partner_profiles (user_id);

alter table public.partner_profiles enable row level security;

drop policy if exists "partner_profiles_public_select_active" on public.partner_profiles;
create policy "partner_profiles_public_select_active"
on public.partner_profiles
for select
to anon, authenticated
using (
  lower(subscription_status) in ('active', 'trialing')
  and lower(plan) in ('standard', 'premium')
);

drop policy if exists "partner_profiles_owner_select" on public.partner_profiles;
create policy "partner_profiles_owner_select"
on public.partner_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "partner_profiles_owner_insert" on public.partner_profiles;
create policy "partner_profiles_owner_insert"
on public.partner_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "partner_profiles_owner_update" on public.partner_profiles;
create policy "partner_profiles_owner_update"
on public.partner_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "partner_profiles_owner_delete" on public.partner_profiles;
create policy "partner_profiles_owner_delete"
on public.partner_profiles
for delete
to authenticated
using (auth.uid() = user_id);
