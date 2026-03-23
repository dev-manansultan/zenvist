# Zenvist Product Requirements Document (PRD)

## 1. Product Overview

### Vision

Zenvist enables developers, founders, and growth teams to:

- Schedule automated website visits
- Simulate real user behavior
- Record sessions (video-based proof)
- Monitor and analyze visits

### Core Value Proposition

"See exactly how your website is experienced - automatically."

## 2. Target Users

### Primary

- Indie hackers
- SaaS founders
- Developers (QA / automation)

### Secondary

- Growth marketers
- Agencies

## 3. Core Features (MVP)

### 3.1 Visit Scheduler

Users can:

- Add URL
- Select date and time
- Choose repeat:
  - once
  - daily
  - weekly
- Set session duration

### 3.2 Automated Visit Engine (VisitAgent)

- Real browser execution (Playwright)
- Human-like simulation:
  - scrolling
  - delays
  - viewport variation

### 3.3 Session Recording (Option B)

- Record full session video
- Store in Supabase Storage
- Attach to logs

### 3.4 Visit Logs Dashboard

Each visit shows:

- Status (success / failed)
- Timestamp
- Duration
- Video playback

### 3.5 Authentication

Using Supabase Auth:

- Email/password
- Magic link (optional)

## 4. System Architecture

```text
Next.js (App Router)
   |
   |-- UI Dashboard
        |-- API Routes (hosted on Vercel)
        `-- Vercel Cron Trigger
   |
   v
Supabase
        |-- PostgreSQL
   |-- Auth
   `-- Storage (videos)

Vercel Serverless Runtime
        |
        v
Playwright (VisitAgent runner)
```

## 5. Database Schema (Supabase)

### Table: visit_jobs

```sql
id UUID PRIMARY KEY
user_id UUID
url TEXT
visit_time TIMESTAMP
repeat_type TEXT
duration INT
status TEXT DEFAULT 'pending'
created_at TIMESTAMP DEFAULT now()
```

### Table: visit_logs

```sql
id UUID PRIMARY KEY
job_id UUID
visited_at TIMESTAMP DEFAULT now()
status TEXT
video_url TEXT
duration INT
```

## 6. Auth Flow

Using Supabase:

```text
User -> Signup/Login
     -> Session stored
     -> Access dashboard
```

## 7. Storage Design

Supabase Storage buckets:

```text
bucket: "videos"
path: /user_id/job_id/video.mp4
```

## 8. Job Execution Flow

```text
Vercel Cron
        |
        v
Call /api/internal/run-due-jobs
        |
        v
Fetch due jobs from Supabase
        |
        v
Run Playwright visit
        |
        v
Record video
        |
        v
Upload to Supabase Storage
        |
        v
Create visit_log entry
```

## 9. Visit Execution Logic

### Playwright Flow

```ts
1. Launch browser
2. Open page
3. Wait (simulate reading)
4. Scroll randomly
5. Stay for duration
6. Record video
7. Upload
8. Save log
```

## 10. Frontend (Next.js)

### Pages

```text
/dashboard
/dashboard/jobs
/dashboard/jobs/new
/dashboard/logs
```

### Components

- JobForm
- JobList
- VideoPlayer
- LogsTable

## 11. Dashboard UX

### Jobs Page

```text
URL
Schedule
Repeat
Status
Actions (edit/delete/view)
```

### Logs Page

```text
Visit Time
Status
Video Preview
Duration
```

## 12. API Design (Next.js)

### Create Job

```http
POST /api/jobs
```

### Get Jobs

```http
GET /api/jobs
```

### Logs

```http
GET /api/logs
```

## 13. Worker Design

### MVP Approach (Vercel Only)

- Use Vercel Cron to trigger a protected internal API route once per day (Hobby plan limit).
- Internal route fetches due jobs from Supabase and executes visits.
- Results are written to `visit_logs` and videos are uploaded to Supabase Storage.

### Notes

- Keep each run short to fit Vercel execution limits.
- Process jobs in small batches per cron tick.
- If limits are hit later, move only the visit runner to a dedicated worker service.

## 14. Human Simulation Layer

Add randomness:

```ts
await page.waitForTimeout(2000 + Math.random() * 3000)
await page.mouse.wheel(0, Math.random() * 800)
```

## 15. Deployment

### Services

```text
Frontend: Vercel
Backend APIs: Vercel (Next.js Route Handlers)
Database/Auth/Storage: Supabase
Scheduler: Vercel Cron
```

## 16. Security

- Row-level security (Supabase)
- Auth-based data access
- Signed URLs for videos

## 17. Future Features

### Phase 2

- Screenshot fallback
- Multi-page navigation
- Proxy support (different IPs)

### Phase 3

- Live preview (Option C)
- Session analytics
- AI insights

### Phase 4 (Big Vision)

- Agent system:
  - VisitAgent
  - ClickAgent
  - TestAgent

## 18. Monetization

### Free Tier

- limited jobs
- limited recordings

### Paid

```text
Starter: $9/mo
Pro: $29/mo
Scale: $99/mo
```

## 19. Positioning

Zenvist is NOT:

- fake traffic tool

Zenvist IS:

- session automation platform
- browser simulation tool
- QA + monitoring tool

## 20. MVP Checklist

- [x] Create job
- [x] Schedule execution
- [x] Run Playwright
- [x] Record video
- [x] Upload to storage
- [x] Show in dashboard
