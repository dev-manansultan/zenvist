# Real-Time Visitor View

This document defines how Zenvist should provide live visibility while visitors are actively browsing websites.

## 1. Goal

Show active visitor sessions in near real-time so users can:
- Confirm traffic is currently running
- Monitor behavior events as they happen
- Detect issues quickly (disconnects, blocked pages, low quality)
- Watch the browser actively visiting websites in a live desktop preview

## 2. User Experience

Route: /dashboard/live-view

Main sections:
- Active session list/grid
- Live browser preview panel for selected session
- Event timeline
- Session metadata panel

Live states:
- connecting
- live
- degraded
- ended

Fallback behavior:
- If video preview is unavailable, show event-only mode.
- If stream disconnects, show reconnecting state and keep timeline updates.

Live browser expectation:
- During an active run, desktop app should show what the automation browser is currently rendering.
- Preview can be delivered as low-latency frame snapshots or segmented stream chunks.
- When run ends, user can open final recorded artifact in logs.

## 3. Event Types

Minimum live events:
- session_started
- page_loaded
- scroll
- click
- input
- dwell
- popup_detected
- warning
- heartbeat
- session_ended

Each event payload should include:
- session_id
- user_id
- website_id or campaign_id
- timestamp_utc
- event_type
- event_data_json

## 4. Latency and Performance Targets

Targets:
- Event ingestion to UI render: < 2 seconds (p95)
- Heartbeat interval: 5 to 10 seconds
- Session stale timeout: 30 seconds without heartbeat

Client constraints:
- Max visible concurrent live previews: 4
- Additional sessions shown as event-only cards

## 5. Data Model

Suggested tables:

### live_sessions
- id
- user_id
- website_id
- campaign_id
- device_id
- status
- started_at
- ended_at
- last_heartbeat_at
- current_url
- country_code

### live_session_events
- id
- session_id
- user_id
- event_type
- event_data_json
- created_at

### live_session_stream_chunks (optional for snapshot stream)
- id
- session_id
- seq_no
- chunk_path
- created_at

## 6. APIs

Desktop/runner ingestion:
- POST /api/part2/live/sessions/start
- POST /api/part2/live/sessions/:id/heartbeat
- POST /api/part2/live/sessions/:id/events
- POST /api/part2/live/sessions/:id/stream-chunk
- POST /api/part2/live/sessions/:id/end

Dashboard read APIs:
- GET /api/part2/live/sessions/active
- GET /api/part2/live/sessions/:id/events

Realtime transport:
- Supabase Realtime channel scoped per user
- Broadcast new events and session status updates

## 7. Security and Abuse Protection

- Every ingestion endpoint requires verified device session token.
- Validate session ownership on all reads and writes.
- Apply RLS on live tables by user_id.
- Rate-limit event and stream-chunk ingestion per device.
- Reject malformed or oversized event payloads.

## 8. Observability

Track:
- live_session_started
- live_session_event_ingested
- live_session_heartbeat_timeout
- live_session_stream_gap
- live_session_ended

Alerting suggestions:
- High timeout rate by app version
- High stream gap rate by region/device type

## 9. Acceptance Criteria

- User can see newly started session in live view within 2 seconds.
- Event timeline updates continuously while session is active.
- UI shows reconnecting/degraded state correctly on heartbeat loss.
- Ended sessions are linkable to final logs/video detail pages.
- Desktop app displays an actual live browser view while visits are running.
