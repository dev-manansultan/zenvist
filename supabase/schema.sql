-- Core extension for UUID generation
create extension if not exists pgcrypto;

-- Jobs table
create table if not exists public.visit_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  url text not null,
  repeat_type text not null check (repeat_type in ('once','daily','weekly')),
  duration_sec int not null check (duration_sec between 15 and 300),
  next_run_at timestamptz,
  last_run_at timestamptz,
  status text not null default 'pending' check (status in ('pending','running','retry','disabled','completed','failed')),
  is_active boolean not null default true,
  attempt_count int not null default 0,
  max_attempts int not null default 3,
  locked_at timestamptz,
  locked_by text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Logs table
create table if not exists public.visit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  job_id uuid not null references public.visit_jobs(id) on delete cascade,
  idempotency_key text not null unique,
  status text not null check (status in ('success','failed')),
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_sec int not null check (duration_sec >= 0),
  video_path text,
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_visit_jobs_due
  on public.visit_jobs (is_active, status, next_run_at)
  where is_active = true;

create index if not exists idx_visit_jobs_user_created
  on public.visit_jobs (user_id, created_at desc);

create index if not exists idx_visit_logs_user_created
  on public.visit_logs (user_id, created_at desc);

create index if not exists idx_visit_logs_job_created
  on public.visit_logs (job_id, created_at desc);

-- Keep updated_at consistent
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_visit_jobs_updated_at on public.visit_jobs;
create trigger trg_visit_jobs_updated_at
before update on public.visit_jobs
for each row
execute function public.set_updated_at();

-- Atomic claiming for workers/cron (prevents duplicate pickup)
create or replace function public.claim_due_jobs(p_batch_size integer, p_worker_id text default null)
returns setof public.visit_jobs
language sql
security definer
set search_path = public
as $$
  with candidates as (
    select j.id
    from public.visit_jobs j
    where j.is_active = true
      and j.status in ('pending','retry')
      and j.next_run_at is not null
      and j.next_run_at <= now()
      and j.locked_at is null
    order by j.next_run_at asc
    for update skip locked
    limit greatest(1, least(coalesce(p_batch_size, 1), 100))
  ),
  updated as (
    update public.visit_jobs j
    set status = 'running',
        locked_at = now(),
        locked_by = coalesce(p_worker_id, gen_random_uuid()::text),
        updated_at = now()
    from candidates c
    where j.id = c.id
    returning j.*
  )
  select * from updated;
$$;

revoke all on function public.claim_due_jobs(integer, text) from public;
grant execute on function public.claim_due_jobs(integer, text) to service_role;

-- RLS
alter table public.visit_jobs enable row level security;
alter table public.visit_logs enable row level security;

-- Drop/recreate policies idempotently
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'visit_jobs' AND policyname = 'visit_jobs_select_own'
  ) THEN
    DROP POLICY visit_jobs_select_own ON public.visit_jobs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'visit_jobs' AND policyname = 'visit_jobs_insert_own'
  ) THEN
    DROP POLICY visit_jobs_insert_own ON public.visit_jobs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'visit_jobs' AND policyname = 'visit_jobs_update_own'
  ) THEN
    DROP POLICY visit_jobs_update_own ON public.visit_jobs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'visit_jobs' AND policyname = 'visit_jobs_delete_own'
  ) THEN
    DROP POLICY visit_jobs_delete_own ON public.visit_jobs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'visit_logs' AND policyname = 'visit_logs_select_own'
  ) THEN
    DROP POLICY visit_logs_select_own ON public.visit_logs;
  END IF;
END $$;

create policy visit_jobs_select_own
  on public.visit_jobs for select
  using ((select auth.uid()) = user_id);

create policy visit_jobs_insert_own
  on public.visit_jobs for insert
  with check ((select auth.uid()) = user_id);

create policy visit_jobs_update_own
  on public.visit_jobs for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy visit_jobs_delete_own
  on public.visit_jobs for delete
  using ((select auth.uid()) = user_id);

create policy visit_logs_select_own
  on public.visit_logs for select
  using ((select auth.uid()) = user_id);

-- Ensure private videos bucket exists
insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do nothing;

-- Storage policy for user-prefixed object paths
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'videos_select_own'
  ) THEN
    DROP POLICY videos_select_own ON storage.objects;
  END IF;
END $$;

create policy videos_select_own
  on storage.objects for select
  using (
    bucket_id = 'videos'
    and name like (select auth.uid())::text || '/%'
  );
