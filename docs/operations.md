# Operations and Reliability

## Scheduler Model
- Scheduler: Vercel Cron every minute.
- Entrypoint: /api/internal/run-due-jobs.
- Protection: CRON_SECRET bearer token.

## Runtime Limits Strategy
Because browser sessions are heavy:
- Keep BATCH_SIZE low (start with 3-5).
- Keep MAX_DURATION_SEC <= 120 for MVP.
- Stop processing when remaining execution budget is low.

## Retry Policy
- Retry on transient failures: timeout, DNS, 5xx.
- Backoff example: 1m, 5m, 15m.
- Do not retry on permanent failures: invalid URL, blocked domain policy.

## Observability
Track per run:
- claimed count
- success/fail count
- average runtime
- upload latency
- signed URL generation failures

Suggested logs:
- request_id
- job_id
- log_id
- attempt_count
- error_code

## Failure Scenarios
1. Browser launch fails
- Mark log failed.
- Update job status retry/failed based on attempts.

2. Upload fails after successful visit
- Mark failed with error_code storage_upload_failed.
- Keep temp artifact cleanup logic.

3. Cron overlap
- Prevent via DB locking and idempotency_key.

4. Supabase outage
- Return 503 from internal route.
- Preserve job state; retry next tick.

## Data Retention
- Free: 7 days video retention.
- Paid Starter: 30 days.
- Paid Pro: 90 days.

Cleanup job:
- Daily cron to delete expired storage objects and mark logs as expired.

## Security Controls
- Service role key never exposed to browser.
- Internal cron route blocked without CRON_SECRET.
- Signed URLs short TTL (300s) and generated on demand.

## Migration Trigger (When to move runner off Vercel)
Move VisitAgent to dedicated worker if any threshold is exceeded for 3 days:
- p95 run duration > 20s
- failed runs due to timeout > 3%
- queue delay > 5 minutes
