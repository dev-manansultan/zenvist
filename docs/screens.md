# Zenvist Screens and App Flow (MVP)

## 1. Purpose
This document defines the full screen-level flow for Zenvist based on MVP use cases in docs/use-cases.md.

## 2. Navigation Map

```text
/                       -> Marketing or landing
/login                  -> Email/password + magic link
/dashboard              -> Overview
/dashboard/jobs         -> Jobs list
/dashboard/jobs/new     -> Create job
/dashboard/jobs/:id/edit-> Edit job
/dashboard/logs         -> Logs list
/dashboard/logs/:id     -> Log detail + video playback
```

## 3. Primary User Flows

### Flow A: Authentication (UC-08)
1. User lands on /login.
2. User enters email/password or requests magic link.
3. On success, user is redirected to /dashboard.
4. If session expires, protected routes redirect to /login.

### Flow B: Create One-Time Job (UC-01)
1. User opens /dashboard/jobs.
2. User clicks Create Job.
3. User fills form on /dashboard/jobs/new.
4. On submit success, redirect back to /dashboard/jobs.
5. New row appears with status pending.

### Flow C: Create Recurring Job (UC-02)
1. User opens /dashboard/jobs/new.
2. User selects repeat type daily or weekly.
3. System validates fields and saves job.
4. Jobs list shows next run time and active badge.

### Flow D: Edit Existing Job (UC-03)
1. User opens /dashboard/jobs.
2. User clicks Edit on a row.
3. User updates URL, schedule, repeat, or duration.
4. On save, user returns to jobs list with updated values.

### Flow E: Disable/Delete Job (UC-04)
1. User opens actions menu for a job row.
2. User selects Disable or Delete.
3. Confirmation modal appears.
4. On confirm, row updates status or is removed.

### Flow F: View Logs and Video (UC-07)
1. User opens /dashboard/logs.
2. User filters by job/status/date.
3. User selects a log row.
4. System opens /dashboard/logs/:id.
5. On Play click, app requests signed URL and starts playback.

### Flow G: Retry Visibility (UC-09)
1. Failed run appears in logs with error details.
2. Related job shows retry state and next run time.
3. User sees final terminal failure after max attempts.

## 4. Screen Definitions

## 4.1 Login Screen
Route: /login

Goals:
- Authenticate user quickly.
- Provide both email/password and magic link.

UI Sections:
- Brand/title panel.
- Email/password form.
- Magic link form (email only).
- Success/error message area.

Primary Actions:
- Sign in
- Send magic link

States:
- Default
- Submitting
- Invalid credentials
- Magic link sent

Success Transition:
- Redirect to /dashboard.

## 4.2 Dashboard Overview Screen
Route: /dashboard

Goals:
- Show high-level status.
- Provide quick navigation to Jobs and Logs.

UI Sections:
- Top nav (Jobs, Logs, Account).
- KPI cards:
  - Active jobs
  - Visits in last 24h
  - Success rate
  - Failed runs
- Recent logs preview table.

Primary Actions:
- Go to create job
- Open full logs

States:
- Empty (no jobs yet)
- Normal
- Loading

## 4.3 Jobs List Screen
Route: /dashboard/jobs

Goals:
- Manage all jobs in one table.

UI Sections:
- Header with Create Job button.
- Filters (status, repeat type, search URL).
- Jobs table columns:
  - URL
  - Repeat
  - Next Run
  - Duration
  - Status
  - Actions

Row Actions:
- Edit
- Disable/Enable
- Delete
- View related logs

States:
- Empty list
- Loading skeleton
- Error with retry button

## 4.4 Create Job Screen
Route: /dashboard/jobs/new

Goals:
- Create valid scheduled job with minimal friction.

Form Fields:
- URL (required)
- Visit time (required)
- Repeat type (once/daily/weekly)
- Duration in seconds (15-300)

Validation Rules:
- URL must be absolute http/https.
- Duration must be numeric and in range.
- Visit time must be valid timestamp.

UI Sections:
- Form card
- Inline validation
- Submit/cancel footer

Primary Actions:
- Save job
- Cancel

Success Transition:
- Redirect to /dashboard/jobs with success toast.

## 4.5 Edit Job Screen
Route: /dashboard/jobs/:id/edit

Goals:
- Modify an existing job safely.

Form Behavior:
- Prefill current values.
- Same validation as create form.
- Show read-only metadata:
  - job id
  - created at
  - last run at

Primary Actions:
- Update job
- Cancel

Edge Behavior:
- If job disabled, allow editing then re-enable.
- If job currently running, show non-blocking notice.

## 4.6 Logs List Screen
Route: /dashboard/logs

Goals:
- Browse execution history and debug failures.

UI Sections:
- Filters:
  - Job
  - Status
  - Date range
- Logs table columns:
  - Visit Time
  - Job URL
  - Status
  - Duration
  - Error summary
  - Video action

Primary Actions:
- Open log detail
- Play video

States:
- Empty logs
- Loading
- Filter no-results

## 4.7 Log Detail + Video Screen
Route: /dashboard/logs/:id

Goals:
- Show complete run details and playback.

UI Sections:
- Run summary card:
  - Job id
  - Started/ended at
  - Final status
  - Duration
  - Attempt number
- Error details panel (if failed).
- Video player panel.
- Metadata panel (storage path, idempotency key).

Playback Flow:
1. User clicks Play.
2. Client requests signed URL.
3. If URL expired, client requests refresh.
4. Player starts stream.

States:
- Video ready
- Video not available
- Signed URL expired and refreshed

## 5. Cross-Screen Components

## 5.1 Top Navigation
- Brand logo
- Jobs
- Logs
- Account menu
- Sign out

## 5.2 Global Toasts
- Job created
- Job updated
- Job disabled/deleted
- Retry scheduled
- Playback URL refreshed

## 5.3 Confirmation Modal
Used for destructive actions:
- Delete job
- Disable recurring job

## 6. System/Internal Flow (No Direct User Screen)

## 6.1 Cron Trigger Flow (UC-05/UC-06/UC-09)
1. Vercel cron calls /api/internal/run-due-jobs.
2. Endpoint validates CRON_SECRET.
3. Endpoint claims due jobs in batch.
4. VisitAgent runs browser simulation per job.
5. Video uploads to Supabase Storage.
6. visit_logs inserted and job status updated.

Operational Outputs surfaced in UI:
- New log rows on logs list.
- Job status transitions on jobs list.
- Error messages shown in log detail.

## 7. State Matrix by Use Case

- UC-01: Create form default -> validating -> success toast -> jobs list row pending.
- UC-02: Create form recurring -> jobs list active recurring badge -> next_run_at updated after each run.
- UC-03: Edit form prefilled -> saving -> success.
- UC-04: Confirmation modal -> disabled/deleted state reflected in jobs list.
- UC-05: Internal run updates status running -> success/failed.
- UC-06: Log detail shows video available when upload succeeds.
- UC-07: Logs list and log detail playback with signed URL refresh.
- UC-08: Auth gate redirects unauthenticated user to login.
- UC-09: Failed runs show retry metadata and final terminal failure.

## 8. Mobile and Responsive Notes
- Jobs and logs tables collapse into stacked cards under 768px.
- Primary actions remain sticky at bottom on forms.
- Video player uses full-width ratio container on mobile.
- Filter panels use drawer pattern on small screens.

## 9. MVP Screen Completion Checklist
- Login implemented and protected routing works.
- Dashboard overview with KPI cards and recent logs.
- Jobs list with filters and row actions.
- Create and edit job forms with validation.
- Logs list with filters and drill-down.
- Log detail with signed-URL playback.
- Error and empty states for all major screens.
