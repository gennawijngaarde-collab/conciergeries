-- International directory schema (run in Supabase SQL Editor).
-- This is additive: it does NOT touch existing tables or URLs.

create extension if not exists "pgcrypto";

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Countries
create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  code text not null,
  language text not null,
  currency text not null,
  active boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_countries_updated_at on public.countries;
create trigger trg_countries_updated_at
before update on public.countries
for each row execute procedure public.set_updated_at();

-- Regions / states / provinces
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id) on delete cascade,
  name text not null,
  slug text not null,
  code text,
  active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_id, slug)
);

drop trigger if exists trg_regions_updated_at on public.regions;
create trigger trg_regions_updated_at
before update on public.regions
for each row execute procedure public.set_updated_at();

-- Cities
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id) on delete cascade,
  region_id uuid references public.regions(id) on delete set null,
  name text not null,
  slug text not null,
  postal_code text,
  latitude double precision,
  longitude double precision,
  active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_id, slug)
);

drop trigger if exists trg_cities_updated_at on public.cities;
create trigger trg_cities_updated_at
before update on public.cities
for each row execute procedure public.set_updated_at();

-- Languages (site supported languages + optional per business)
create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_languages_updated_at on public.languages;
create trigger trg_languages_updated_at
before update on public.languages
for each row execute procedure public.set_updated_at();

-- Business categories
create table if not exists public.business_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_business_categories_updated_at on public.business_categories;
create trigger trg_business_categories_updated_at
before update on public.business_categories
for each row execute procedure public.set_updated_at();

-- Businesses
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id) on delete restrict,
  region_id uuid references public.regions(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  category_id uuid references public.business_categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text not null,
  website text,
  phone text,
  email text,
  address text,
  postal_code text,
  latitude double precision,
  longitude double precision,
  logo text,
  cover_image text,
  services text[] not null default '{}'::text[],
  languages text[] not null default '{}'::text[],
  verified boolean not null default false,
  premium boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_id, slug)
);

create index if not exists businesses_country_idx on public.businesses(country_id);
create index if not exists businesses_region_idx on public.businesses(region_id);
create index if not exists businesses_city_idx on public.businesses(city_id);
create index if not exists businesses_category_idx on public.businesses(category_id);

drop trigger if exists trg_businesses_updated_at on public.businesses;
create trigger trg_businesses_updated_at
before update on public.businesses
for each row execute procedure public.set_updated_at();

-- RLS (read-only public for active entities; admin UI will come later)
alter table public.countries enable row level security;
alter table public.regions enable row level security;
alter table public.cities enable row level security;
alter table public.languages enable row level security;
alter table public.business_categories enable row level security;
alter table public.businesses enable row level security;

-- Public select (only active)
drop policy if exists "countries_public_select_active" on public.countries;
create policy "countries_public_select_active" on public.countries
for select to anon, authenticated using (active = true);

drop policy if exists "regions_public_select_active" on public.regions;
create policy "regions_public_select_active" on public.regions
for select to anon, authenticated using (active = true);

drop policy if exists "cities_public_select_active" on public.cities;
create policy "cities_public_select_active" on public.cities
for select to anon, authenticated using (active = true);

drop policy if exists "languages_public_select_active" on public.languages;
create policy "languages_public_select_active" on public.languages
for select to anon, authenticated using (active = true);

drop policy if exists "business_categories_public_select_active" on public.business_categories;
create policy "business_categories_public_select_active" on public.business_categories
for select to anon, authenticated using (active = true);

-- Businesses: only active + verified (premium will still be verified, but rank later)
drop policy if exists "businesses_public_select_verified" on public.businesses;
create policy "businesses_public_select_verified" on public.businesses
for select to anon, authenticated using (active = true and verified = true);

