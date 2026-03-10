-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null check (plan in ('standard', 'premium')),
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

-- RLS: users can read their own subscription. Writes are done server-side (service role).
alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions
for select
to authenticated
using (auth.uid() = user_id);

