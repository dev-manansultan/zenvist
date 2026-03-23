# Implementation Roadmap (MVP)

## Phase 0: Foundations
- Add Supabase project and env variables.
- Create database tables and indexes.
- Configure private storage bucket videos.
- Enable RLS policies.

Deliverables:
- SQL migration file
- env variable template
- verified DB connectivity

## Phase 1: Auth and Dashboard Shell
- Implement Supabase auth flow.
- Add protected dashboard layout.
- Add Jobs and Logs page skeletons.

Exit criteria:
- user can sign in and open protected pages.

## Phase 2: Job APIs + UI
- Implement POST/GET/PATCH/DELETE job routes.
- Build JobForm and JobList.
- Add validation and error states.

Exit criteria:
- user can create/edit/disable jobs end-to-end.

## Phase 3: Cron Runner + VisitAgent
- Add vercel.json cron schedule.
- Implement /api/internal/run-due-jobs route.
- Add DB claim/lock and idempotency.
- Implement Playwright visit simulation.

Exit criteria:
- scheduled jobs run automatically without duplicates.

## Phase 4: Video + Logs
- Save recording artifact.
- Upload to Supabase Storage.
- Insert visit_logs entries.
- Build logs table and playback signed URL flow.

Exit criteria:
- user can watch session video for completed runs.

## Phase 5: Reliability and Hardening
- Retry policy and error categorization.
- Add metrics and structured logs.
- Add retention cleanup process.
- Load test with realistic batch sizes.

Exit criteria:
- stable behavior under expected MVP load.

## Test Checklist
- URL validation rejects invalid host/scheme.
- RLS blocks cross-user access.
- Overlapping cron invocations do not duplicate logs.
- Video upload failures are surfaced in logs.
- Signed URL refresh works after expiry.

## Required Environment Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- CRON_SECRET
- BATCH_SIZE
- MAX_DURATION_SEC
