-- Japanese Lang cloud sync schema
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  hard_vocabulary jsonb not null default '[]'::jsonb,
  spaced_repetition jsonb not null default '{}'::jsonb,
  practice_lessons jsonb not null default '[]'::jsonb,
  lesson_filter jsonb not null default '{"selectedLessons":["lesson1"]}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Add the column for existing installations without changing existing data.
alter table public.user_settings
  add column if not exists lesson_filter jsonb not null default '{"selectedLessons":["lesson1"]}'::jsonb;

alter table public.user_settings enable row level security;

drop policy if exists "Users can read their own settings" on public.user_settings;
create policy "Users can read their own settings"
  on public.user_settings for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own settings" on public.user_settings;
create policy "Users can insert their own settings"
  on public.user_settings for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own settings" on public.user_settings;
create policy "Users can update their own settings"
  on public.user_settings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists user_settings_updated_at_idx on public.user_settings(updated_at);
