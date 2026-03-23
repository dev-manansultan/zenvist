# API Contract (MVP)

## Conventions
- Base path: /api
- Auth: Supabase session for public user APIs.
- Internal endpoints: Bearer token using CRON_SECRET.
- Response envelope:
  - success: { ok: true, data: ... }
  - error: { ok: false, error: { code, message } }

## POST /api/jobs
Create a visit job.

Request body:
{
  "url": "https://example.com",
  "visitTime": "2026-03-24T10:00:00Z",
  "repeatType": "once",
  "durationSec": 45
}

Validation:
- url must be http/https.
- repeatType in [once, daily, weekly].
- durationSec in [15, 300].

Success 201:
{
  "ok": true,
  "data": {
    "id": "uuid",
    "status": "pending"
  }
}

## GET /api/jobs
List jobs for current user.

Query params:
- status: optional
- limit: optional, default 20, max 100
- cursor: optional

Success 200:
{
  "ok": true,
  "data": {
    "items": [],
    "nextCursor": null
  }
}

## PATCH /api/jobs/:id
Update job fields.

Allowed fields:
- url
- visitTime
- repeatType
- durationSec
- isActive

Success 200 with updated job.

## DELETE /api/jobs/:id
Soft delete or hard delete per policy.

Success 204 with empty body.

## GET /api/logs
List run logs for current user.

Query params:
- jobId: optional
- status: optional
- from: optional ISO timestamp
- to: optional ISO timestamp
- limit: optional, default 20, max 100

Success 200 returns logs with summary fields.

## POST /api/logs/:id/video-url
Create short-lived signed URL for playback.

Success 200:
{
  "ok": true,
  "data": {
    "url": "https://...",
    "expiresIn": 300
  }
}

## GET /api/internal/run-due-jobs
Internal cron entrypoint.

Headers:
- authorization: Bearer <CRON_SECRET>

Behavior:
1. Load due jobs where next_run_at <= now, status in pending/retry, is_active true.
2. Claim jobs atomically.
3. Process up to BATCH_SIZE.
4. Write logs + job updates.

Success 200:
{
  "ok": true,
  "data": {
    "claimed": 5,
    "processed": 5,
    "succeeded": 4,
    "failed": 1
  }
}

Error codes:
- unauthorized
- invalid_payload
- not_found
- rate_limited
- internal_error
