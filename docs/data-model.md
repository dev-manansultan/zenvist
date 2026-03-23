# Data Model and SQL Notes

## Table: visit_jobs
Purpose: Source of truth for scheduled work.

Columns:
- id uuid primary key default gen_random_uuid()
- user_id uuid not null
- url text not null
- repeat_type text not null check (repeat_type in ('once','daily','weekly'))
- duration_sec int not null check (duration_sec between 15 and 300)
- next_run_at timestamptz not null
- last_run_at timestamptz null
- status text not null default 'pending' check (status in ('pending','running','retry','disabled','completed','failed'))
- is_active boolean not null default true
- attempt_count int not null default 0
- max_attempts int not null default 3
- locked_at timestamptz null
- locked_by text null
- last_error text null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Indexes:
- idx_visit_jobs_due on (is_active, status, next_run_at)
- idx_visit_jobs_user_created on (user_id, created_at desc)

## Table: visit_logs
Purpose: Immutable execution history.

Columns:
- id uuid primary key default gen_random_uuid()
- user_id uuid not null
- job_id uuid not null references visit_jobs(id) on delete cascade
- idempotency_key text not null unique
- status text not null check (status in ('success','failed'))
- started_at timestamptz not null
- ended_at timestamptz not null
- duration_sec int not null
- video_path text null
- error_code text null
- error_message text null
- created_at timestamptz not null default now()

Indexes:
- idx_visit_logs_user_created on (user_id, created_at desc)
- idx_visit_logs_job_created on (job_id, created_at desc)

## Storage
Bucket: videos (private)

Object path pattern:
- user_id/job_id/yyyy/mm/dd/<log_id>.webm

## RLS Policies

visit_jobs:
- select: auth.uid() = user_id
- insert: auth.uid() = user_id
- update: auth.uid() = user_id
- delete: auth.uid() = user_id

visit_logs:
- select: auth.uid() = user_id
- insert/update/delete: service role only from server routes

## Claiming Strategy
Use atomic update to avoid duplicate run pickup.

Example logic:
1. Select candidate ids ordered by next_run_at asc limit BATCH_SIZE.
2. Update rows where status in pending/retry and locked_at is null.
3. Set status=running, locked_at=now, locked_by=<request_id>.
4. Return updated rows.
