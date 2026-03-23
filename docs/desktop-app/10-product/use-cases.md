# Desktop App Use Cases

This document defines functional use cases from the desktop-app perspective for Zenvist Part 2.

## Actors
- End User: runs desktop app and manages campaigns on web.
- Desktop Agent: local runtime that executes assigned sessions.
- Control Plane: Next.js APIs and scheduling services.
- Platform Admin: manages policy, abuse controls, and support operations.

## UC-DA-01: Pair Desktop App with Web Account

Primary actor: End User

Preconditions:
- User has a valid web account session.
- Desktop app is installed.

Main flow:
1. User logs in on web and requests pair code.
2. User enters pair code in desktop app.
3. Desktop app verifies code with control plane.
4. Device is registered and session token is issued.
5. Desktop app shows connected status.

Postconditions:
- Device is linked to user account and can receive assignments.

Failure cases:
- Invalid/expired pair code.
- Device limit reached.
- Account restricted.

## UC-DA-02: Start Contribution Session (Earn Credits)

Primary actor: Desktop Agent

Preconditions:
- Device is verified and online.
- User opted into contribution mode.

Main flow:
1. Agent heartbeats as available supply.
2. Queue engine assigns one target website.
3. Agent opens real browser and executes visit.
4. Agent streams live events and status.
5. On completion, platform settles earned credits.

Postconditions:
- User wallet is credited based on valid minutes and quality.

Failure cases:
- Assignment canceled due to low balance on receiver side.
- Session fails quality checks.
- Network timeout during run.

## UC-DA-03: Receive Visitors on User Website (Spend Credits)

Primary actor: End User

Preconditions:
- User added website/campaign.
- Wallet has enough credits.
- User selected one or more target countries for traffic source.

Main flow:
1. User activates campaign.
2. Queue places campaign in demand queue.
3. System filters active contributor sessions to verified signed-up users whose country matches campaign targeting.
4. System automatically assigns this campaign to filtered active contributor sessions that are currently in earn mode.
5. Assignment is one-by-one: each active earning session gets one target at a time.
5. After a session finishes, the next queued target is assigned to the next available earning session.
6. Visits are delivered and tracked.
7. Credits are debited according to minute-based spend rate.

Postconditions:
- User receives visits and sees delivery progress.

Failure cases:
- Insufficient credits for reservation.
- Slot/cap reached.
- Campaign paused or policy blocked.
- No active signed-up contributors available in selected countries.

## UC-DA-11: Country-Targeted Traffic Delivery

Primary actor: End User

Preconditions:
- User has an active campaign.
- User selected target countries in campaign settings.

Main flow:
1. User sets country list (for example US, PK, IN).
2. Queue engine stores target countries with campaign demand.
3. Dispatch engine matches only verified signed-up contributors from those countries.
4. If contributor country is not in target list, session is skipped.
5. Delivered visits are labeled with source country in logs and live view.

Postconditions:
- Traffic is delivered from selected countries only, subject to availability.

Failure cases:
- Country inventory too low causing slower delivery.
- Device country confidence too low (fallback to strict reject or review policy).

## UC-DA-04: Watch Real-Time Visitor View in Desktop

Primary actor: End User

Preconditions:
- At least one active assigned run exists.

Main flow:
1. User opens live view screen.
2. App displays active sessions list.
3. User selects a session.
4. App shows live browser preview and timeline events.
5. User monitors session until completion.

Postconditions:
- Session history is linkable to final logs/video artifacts.

Failure cases:
- Stream interruption (fallback to event-only mode).
- Heartbeat lost (show degraded/reconnecting state).

## UC-DA-05: Add Website via 4-Step Wizard

Primary actor: End User

Preconditions:
- User is authenticated and has available slot/plan entitlement.

Main flow:
1. User completes Guidelines and Rules.
2. User enters Website Details and limits.
3. User configures Visiting Details.
4. User configures optional User Actions.
5. User saves website configuration.

Postconditions:
- Website/campaign is created and eligible for queueing.

Failure cases:
- Policy acknowledgement missing.
- Invalid URL or unsupported target.
- Upgrade-required controls selected on unsupported plan.

## UC-DA-06: Wallet Reservation and Settlement

Primary actor: Control Plane

Preconditions:
- Assignment candidate is selected.

Main flow:
1. Platform reserves receiver credits before run starts.
2. Run executes and reports actual duration.
3. Platform settles spend and earn ledger entries.
4. Unused reserved credits are released.

Postconditions:
- Ledger remains auditable and balanced.

Failure cases:
- Reservation fails due to insufficient funds.
- Settlement retry required due to transient DB error.

## UC-DA-07: Queue Dispatch One-by-One

Primary actor: Control Plane

Preconditions:
- Active supply and queued demand exist.

Main flow:
1. Scheduler locks available supply sessions.
2. Scheduler computes priority for queued targets.
3. One target (end-user website/campaign) is automatically assigned per active earning supply session.
4. Target/session states move to in_progress.
5. On completion, target is requeued if needed.

Postconditions:
- Fair deterministic assignment without duplicate claims.

Failure cases:
- Concurrency race (handled by transactional locking).
- Target becomes ineligible after claim.

## UC-DA-08: Pause, Resume, or Revoke Device

Primary actor: End User

Preconditions:
- Device is linked to account.

Main flow:
1. User opens device management page on web.
2. User pauses or revokes a device.
3. Control plane invalidates device session token.
4. Desktop app receives revoked state and stops assignments.

Postconditions:
- Device no longer contributes or consumes assignments until re-authorized.

Failure cases:
- Device offline at revoke time (enforced on next heartbeat).

## UC-DA-09: Referral Earnings Attribution

Primary actor: End User

Preconditions:
- User has referral link and referred users are active.

Main flow:
1. Referred user signs up with referral code/link.
2. Referred user performs eligible earning/spending activity.
3. Platform computes referral bonus.
4. Bonus is posted to referral ledger and dashboard metrics.

Postconditions:
- Referral earnings are visible in wallet/referral screens.

Failure cases:
- Referral outside eligibility window.
- Fraud/abuse flags block payout.

## UC-DA-10: Abuse Detection and Quality Penalty

Primary actor: Control Plane / Platform Admin

Preconditions:
- Session telemetry is being received.

Main flow:
1. Platform evaluates quality signals (duration, bounce, anomalies).
2. Low-quality sessions receive penalty multiplier.
3. Severe violations trigger device/campaign restrictions.
4. Admin can review and override with audit trail.

Postconditions:
- Credit economy remains fair and resistant to manipulation.

Failure cases:
- False positive flags (handled via review workflow).

## Traceability Notes
- Queue behavior: see ../20-economy/queue-and-credit-algorithm.md
- Live session behavior: see ../30-experience/realtime-visitor-view.md
- Website onboarding: see ../30-experience/website-adding-flow.md
