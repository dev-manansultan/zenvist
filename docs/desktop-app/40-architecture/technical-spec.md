# Technical Architecture and APIs (Desktop Part 2)

## 1. Architecture
- Web app: Next.js on Vercel
- Data/Auth/Storage: Supabase
- Desktop runtime: Python agent or Electron host (pair-code model)
- Control plane: Next.js API routes for pairing, wallet, campaigns, referrals

### 1.1 Real-Time Visitor View Architecture
- Desktop runtime publishes session heartbeats and event frames.
- Next.js ingestion endpoint validates device token and writes events.
- Supabase Realtime broadcasts user-scoped live events to dashboard clients.
- UI renders live timeline instantly and optional live preview snapshot stream.
- Completed runs are persisted as final logs/video artifacts.

## 2. Core Entities
- desktop_devices
- desktop_device_sessions
- desktop_download_events
- desktop_entitlements
- credit_wallets
- credit_ledger
- websites
- campaigns
- campaign_runs
- referrals
- referral_earnings
- live_sessions
- live_session_events
- live_session_stream_chunks
- assignment_queue
- assignment_runs
- rate_cards
- country_inventory
- plan_catalog
- addon_catalog
- autopilot_catalog
- user_subscriptions
- user_addons
- billing_transactions
- checkout_sessions

## 3. Required API Surface

### Pairing and Devices
- POST /api/desktop/create-pair-code
- POST /api/desktop/verify-pair-code
- POST /api/desktop/heartbeat
- POST /api/desktop/revoke-device
- GET /api/desktop/devices

### Real-Time Visitor View
- POST /api/part2/live/sessions/start
- POST /api/part2/live/sessions/:id/heartbeat
- POST /api/part2/live/sessions/:id/events
- POST /api/part2/live/sessions/:id/stream-chunk
- POST /api/part2/live/sessions/:id/end
- GET /api/part2/live/sessions/active
- GET /api/part2/live/sessions/:id/events

### Exchange Overview
- GET /api/part2/overview/plan
- GET /api/part2/overview/traffic-stats
- GET /api/part2/overview/earning-stats
- GET /api/part2/overview/charts
- GET /api/part2/overview/referrals
- GET /api/part2/overview/live-map

### Websites
- GET /api/part2/websites
- POST /api/part2/websites
- PATCH /api/part2/websites/:id
- DELETE /api/part2/websites/:id
- GET /api/part2/websites/country-options

### Wallet
- GET /api/part2/wallet
- POST /api/part2/wallet/top-up
- POST /api/part2/wallet/convert-points
- GET /api/part2/wallet/purchase-history
- GET /api/part2/wallet/conversion-history

### Referrals
- GET /api/part2/referrals/overview
- POST /api/part2/referrals/invite
- GET /api/part2/referrals/link
- GET /api/part2/referrals/users
- GET /api/part2/referrals/earnings

### Monetization and Purchase
- GET /api/part2/purchase/catalog
- POST /api/part2/purchase/checkout
- GET /api/part2/billing/history
- POST /api/part2/subscription/change-plan
- POST /api/part2/addons/purchase

### Queue and Credit Engine
- POST /api/part2/queue/enqueue-target
- POST /api/part2/queue/claim-next
- POST /api/part2/queue/run-started
- POST /api/part2/queue/run-ended
- GET /api/part2/queue/targets
- GET /api/part2/rates/current
- POST /api/part2/ledger/reserve
- POST /api/part2/ledger/settle
- GET /api/part2/queue/country-inventory

## 4. Security
- Web-first authentication only
- Pair code with short TTL and one-time usage
- Device session tokens rotated and revocable
- Server-side anti-abuse checks for duplicate devices and unusual heartbeat patterns
- Strict RLS for all user-owned records
- Real-time events must enforce tenant isolation by user_id and campaign ownership.
- Stream payloads require signature or authenticated session-scoped token.
- Rate-limit high-frequency event posting per device.

## 5. Observability
- Track events:
  - pair_code_created
  - pair_success
  - pair_failed
  - device_heartbeat
  - credits_earned
  - credits_spent
  - campaign_started
  - campaign_completed
  - live_session_started
  - live_session_heartbeat_timeout
  - live_session_stream_gap
  - live_session_ended
  - queue_target_enqueued
  - queue_target_assigned
  - queue_target_requeued
  - ledger_reserve_failed
  - ledger_settlement_completed
- Dashboard should tolerate stale or delayed metrics without breaking page render

## 6. Queue and Economy Constraints
- One supply session can execute only one assigned target at a time.
- Wallet reserve must succeed before assignment is finalized.
- Earning and spending rates are separate and minute-based.
- Rate changes are versioned in rate_cards and never overwritten in place.
- Assignment operations should use transactional row locking to avoid duplicate claims.
- Country targeting must match contributor verified country against campaign target_countries.
- Supply for delivery must come from signed-up, verified, non-revoked platform users only.
