# Zenvist

Automated visits, real sessions.

This app is implemented with:
- Next.js App Router on Vercel
- Supabase (Postgres, Auth, Storage)
- Vercel Cron for scheduled due-job execution

## Documentation

Start with docs index:
- docs/README.md

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill required variables in .env.local:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
BATCH_SIZE=5
MAX_DURATION_SEC=120
```

4. Apply SQL schema in Supabase SQL editor:
- supabase/schema.sql

5. Create private Storage bucket in Supabase:
- name: videos

6. Run dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Implemented Routes

UI routes:
- /
- /login
- /dashboard
- /dashboard/jobs
- /dashboard/jobs/new
- /dashboard/jobs/[id]/edit
- /dashboard/logs
- /dashboard/logs/[id]

API routes:
- GET, POST /api/jobs
- PATCH, DELETE /api/jobs/[id]
- GET /api/logs
- POST /api/logs/[id]/video-url
- GET /api/internal/run-due-jobs

Auth route:
- POST /api/auth/signout

## Vercel Cron

Cron is configured in:
- vercel.json

Schedule:
- every minute -> /api/internal/run-due-jobs

You must set CRON_SECRET in Vercel environment variables and send it as:
- Authorization: Bearer <CRON_SECRET>

## Current Runner Note

The cron route executes a Playwright session, records video, uploads to Supabase Storage, and writes logs.

Implementation file:
- app/api/internal/run-due-jobs/route.ts

Playwright runtime helper:
- lib/visit-agent.ts

## Runtime Notes for Vercel

- Browser automation uses `playwright-core` with `@sparticuz/chromium`.
- Keep `MAX_DURATION_SEC` conservative to fit serverless limits.
- Start with small `BATCH_SIZE` (3-5) and scale cautiously.
