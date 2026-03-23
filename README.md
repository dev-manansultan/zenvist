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

The cron route currently executes a lightweight HTTP visit simulation and writes logs.
Playwright session recording/upload can be plugged into app/api/internal/run-due-jobs/route.ts once you finalize runtime constraints.
