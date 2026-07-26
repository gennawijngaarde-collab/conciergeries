-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

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

-- If table already existed with old check constraint:
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


create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

-- RLS: users can read their own subscription. Writes are done server-side (service role).
alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions
for select
to authenticated
using (auth.uid() = user_id);

