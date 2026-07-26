-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

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

-- Migrate older constraint (standard|premium only) → include pms
alter table public.partner_profiles drop constraint if exists partner_profiles_plan_check;
alter table public.partner_profiles
  add constraint partner_profiles_plan_check check (plan in ('standard', 'premium', 'pms'));

create index if not exists partner_profiles_slug_idx on public.partner_profiles (slug);
create index if not exists partner_profiles_user_id_idx on public.partner_profiles (user_id);

alter table public.partner_profiles enable row level security;

-- Public: list only active/trialing directory profiles (standard & premium).
drop policy if exists "partner_profiles_public_select_active" on public.partner_profiles;
create policy "partner_profiles_public_select_active"
on public.partner_profiles
for select
to anon, authenticated
using (
  lower(subscription_status) in ('active', 'trialing')
  and lower(plan) in ('standard', 'premium')
);

-- Owners: can always read their own profile (even inactive).
drop policy if exists "partner_profiles_owner_select" on public.partner_profiles;
create policy "partner_profiles_owner_select"
on public.partner_profiles
for select
to authenticated
using (auth.uid() = user_id);

-- Owners: can create/update their own profile.
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

-- Owners: can delete their own profile.
drop policy if exists "partner_profiles_owner_delete" on public.partner_profiles;
create policy "partner_profiles_owner_delete"
on public.partner_profiles
for delete
to authenticated
using (auth.uid() = user_id);
