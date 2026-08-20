-- Computer Academy 云同步表
-- 在 Supabase SQL Editor 中执行一次即可

create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

create policy "users can select own data"
  on public.user_data for select
  using (auth.uid() = user_id);

create policy "users can insert own data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

create policy "users can update own data"
  on public.user_data for update
  using (auth.uid() = user_id);
