# Zenvist Use Cases

## Scope
This document defines MVP user journeys, system behavior, and acceptance criteria.

## Actors
- Visitor User: authenticated product user managing jobs and logs.
- Scheduler: Vercel Cron that triggers due-job processing.
- VisitAgent: Playwright runner executing visit simulation.

## UC-01 Create One-Time Visit Job
Goal: User schedules one website visit for a specific time.

Preconditions:
- User is authenticated.
- URL is valid.

Main flow:
1. User opens new job form.
2. User enters URL, visit time, duration, repeat type = once.
3. User submits.
4. System stores job with status = pending.

Acceptance criteria:
- Job appears in jobs list within 2 seconds.
- Invalid URL is rejected with a clear error.
- Duration outside allowed range is rejected.

## UC-02 Create Recurring Job (Daily/Weekly)
Goal: User schedules repeated visits.

Main flow:
1. User creates job with repeat type daily or weekly.
2. Scheduler executes when due.
3. After run, system computes next_run_at.
4. Job remains active for next cycle.

Acceptance criteria:
- next_run_at is always in the future.
- Failed run does not delete recurring job.

## UC-03 Edit Job
Goal: User changes URL, schedule, duration, or repeat settings.

Main flow:
1. User opens job edit page.
2. User updates fields.
3. System validates and updates record.

Acceptance criteria:
- Edits are persisted.
- In-progress runs are not interrupted.

## UC-04 Disable or Delete Job
Goal: User stops future execution.

Main flow:
1. User clicks disable or delete.
2. System marks disabled or deletes.
3. Scheduler excludes disabled/deleted jobs.

Acceptance criteria:
- Disabled job is never picked by due-job query.

## UC-05 Automated Visit Execution
Goal: System simulates a human-like session.

Main flow:
1. Cron calls internal route.
2. Internal route fetches and claims due jobs.
3. VisitAgent launches browser and visits URL.
4. VisitAgent performs wait + random scroll.
5. Session completes or fails.

Acceptance criteria:
- Each job run creates exactly one visit log.
- Claimed jobs cannot be double-processed by overlapping cron invocations.

## UC-06 Video Recording and Upload
Goal: Store proof of session.

Main flow:
1. VisitAgent records session.
2. File is uploaded to Supabase Storage bucket videos.
3. Object path is written to visit_logs.video_path.

Acceptance criteria:
- Failed upload marks run failed with error reason.
- Video path is deterministic and unique.

## UC-07 View Logs and Playback
Goal: User reviews run outcomes and video.

Main flow:
1. User opens logs page.
2. System fetches logs for current user.
3. Client requests signed URL when playback starts.

Acceptance criteria:
- Users can only view their own logs.
- Expired signed URL is refreshed on demand.

## UC-08 Authentication
Goal: Restrict all user data to owner.

Main flow:
1. User signs in with email/password or magic link.
2. Session cookie is set.
3. API routes use user session for row-level filtering.

Acceptance criteria:
- Unauthenticated access to dashboard is redirected to login.
- Cross-user data access is blocked by RLS.

## UC-09 Retry Failed Visits
Goal: Transient failures recover automatically.

Main flow:
1. Run fails due to timeout/network.
2. attempt_count increments.
3. next_run_at set by retry backoff.
4. Stops at max_attempts.

Acceptance criteria:
- No infinite retry loops.
- Last error reason is visible in logs.

## Non-Goals (MVP)
- Multi-page scripted navigation.
- Proxy rotation and geo routing.
- AI-based session insight generation.
