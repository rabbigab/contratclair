-- TrustHub — Initial schema
-- Version: 1.0 · 2026-04-06

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  -- Opt-in data monetization
  data_consent boolean not null default false,
  data_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- FOLDERS (dossiers clients)
-- ============================================================
create table public.folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  supplier_name text,
  sector text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index folders_user_id_idx on public.folders(user_id);

-- ============================================================
-- DOCUMENTS
-- ============================================================
create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  folder_id uuid not null references public.folders(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('contract', 'proposal', 'invoice', 'unknown')),
  storage_path text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

create index documents_folder_id_idx on public.documents(folder_id);

-- ============================================================
-- AUDITS
-- ============================================================
create table public.audits (
  id uuid primary key default uuid_generate_v4(),
  folder_id uuid not null references public.folders(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  -- Résultats
  confidence_score numeric(5,2),
  total_savings_eur numeric(12,2),
  findings_count integer default 0,
  report jsonb,
  error_message text,
  -- Tokens IA consommés
  tokens_input integer,
  tokens_output integer,
  cost_eur numeric(8,4),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index audits_folder_id_idx on public.audits(folder_id);
create index audits_user_id_idx on public.audits(user_id);

-- ============================================================
-- AUDIT FINDINGS
-- ============================================================
create table public.audit_findings (
  id uuid primary key default uuid_generate_v4(),
  audit_id uuid not null references public.audits(id) on delete cascade,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  category text not null,
  title text not null,
  promised_value text,
  actual_value text,
  recommendation text,
  confidence numeric(5,2),
  savings_eur numeric(10,2),
  created_at timestamptz not null default now()
);

create index audit_findings_audit_id_idx on public.audit_findings(audit_id);

-- ============================================================
-- BENCHMARK DATASET (anonymized, for data monetization)
-- ============================================================
create table public.benchmark_entries (
  id uuid primary key default uuid_generate_v4(),
  supplier_name text,
  sector text,
  contract_type text,
  monthly_price_eur numeric(10,2),
  duration_months integer,
  notice_period_days integer,
  indexation_rate_pct numeric(5,2),
  hidden_fees_pct numeric(5,2),
  region_code text,
  -- Pas de user_id ni folder_id → anonymisé
  source_audit_hash text, -- hash opaque pour dédup sans ré-identification
  created_at timestamptz not null default now()
);

create index benchmark_sector_idx on public.benchmark_entries(sector);
create index benchmark_supplier_idx on public.benchmark_entries(supplier_name);

-- ============================================================
-- SHARE LINKS
-- ============================================================
create table public.share_links (
  id uuid primary key default uuid_generate_v4(),
  audit_id uuid not null references public.audits(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

create index share_links_token_idx on public.share_links(token);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.folders enable row level security;
alter table public.documents enable row level security;
alter table public.audits enable row level security;
alter table public.audit_findings enable row level security;
alter table public.share_links enable row level security;

-- Profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Folders
create policy "Users can view own folders" on public.folders
  for select using (auth.uid() = user_id);
create policy "Users can insert own folders" on public.folders
  for insert with check (auth.uid() = user_id);
create policy "Users can update own folders" on public.folders
  for update using (auth.uid() = user_id);
create policy "Users can delete own folders" on public.folders
  for delete using (auth.uid() = user_id);

-- Documents
create policy "Users can view own documents" on public.documents
  for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on public.documents
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own documents" on public.documents
  for delete using (auth.uid() = user_id);

-- Audits
create policy "Users can view own audits" on public.audits
  for select using (auth.uid() = user_id);
create policy "Users can insert own audits" on public.audits
  for insert with check (auth.uid() = user_id);

-- Audit findings (via audit)
create policy "Users can view own audit findings" on public.audit_findings
  for select using (
    exists (select 1 from public.audits where audits.id = audit_findings.audit_id and audits.user_id = auth.uid())
  );

-- Share links (public read via token handled at app level)
create policy "Users can manage own share links" on public.share_links
  for all using (
    exists (select 1 from public.audits where audits.id = share_links.audit_id and audits.user_id = auth.uid())
  );

-- benchmark_entries : pas de RLS utilisateur (accès service role uniquement côté serveur)
alter table public.benchmark_entries enable row level security;
create policy "No public access to benchmark" on public.benchmark_entries
  for select using (false);
