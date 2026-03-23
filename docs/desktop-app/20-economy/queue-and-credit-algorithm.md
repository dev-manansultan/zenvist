# Queue and Credit Algorithm

This document defines how sessions are assigned and how credits are earned/spent.

## 1. Objective

Implement a fair queue where queued websites receive visits one by one, while contributors earn points by minute and spend at a different minute rate.

## 2. Key Concepts

- Demand queue: websites/campaigns waiting to receive a visit.
- Supply pool: active desktop sessions available to visit websites.
- One-by-one dispatch: each supply session receives one target at a time.
- Automatic assignment rule: end-user demand targets are auto-routed by queue engine to active supply sessions that are earning credits.
- Country targeting rule: assignment candidates must be verified signed-up users from countries selected by end user campaign.
- Minute-based economy:
  - Earning rate (contribution): points gained per minute visited.
  - Spending rate (delivery): points charged per minute received.

## 3. Rate Model

Define rates per plan tier and quality bucket:

- earn_rate_ppm: points per minute earned by contributor.
- spend_rate_ppm: points per minute charged to receiver.

Example:
- Contributor earns 1.00 point/minute.
- Receiver spends 1.30 points/minute.

Platform spread formula:

spread_ppm = spend_rate_ppm - earn_rate_ppm

Session economy for duration m minutes:

earned_points = m * earn_rate_ppm * quality_multiplier
spent_points = m * spend_rate_ppm

Where quality_multiplier is bounded, for example 0.5 to 1.2.

## 4. Queue Priority Rule

Each queued target has a dynamic priority score:

priority = wait_weight * wait_minutes + deficit_weight * delivery_deficit + boost_weight * plan_boost

Definitions:
- wait_minutes: how long target has waited since last assignment.
- delivery_deficit: expected visits minus delivered visits in current window.
- plan_boost: optional premium bias.

Dispatch order:
1. Highest priority target first.
2. Tie-break by oldest enqueued_at.
3. Apply eligibility filters (country, device, plan, policy).
4. Skip targets with insufficient wallet/credits.

## 5. One-by-One Dispatch Algorithm

At each scheduler tick:

1. Lock a small batch of active supply sessions (contributors).
2. For each active earning session, fetch best eligible end-user target from demand queue.
3. Country check: contributor_country must be in target_countries (strict mode) unless campaign uses best_effort mode.
4. Reserve estimated spend for target wallet.
5. Assign exactly one target to session.
6. Mark target as in_progress and session as busy.
7. On completion, settle final earn/spend from actual duration.
8. Requeue target if still under daily/hourly cap and budget remains.

Important behavior:
- No session receives multiple targets at the same instant.
- No target receives assignments beyond configured concurrency cap.
- Supply source must be platform signed-up and verified contributors only.

## 6. Wallet Reservation and Settlement

Reservation before run:
- reserve_points = planned_minutes * spend_rate_ppm

Completion settlement:
- debit receiver by settled_spent_points
- credit contributor by settled_earned_points
- release unused reserved points

Failure behavior:
- If session fails before minimum valid duration, partial or zero settlement per policy.
- Failed assignments return target to queue with retry backoff.

## 7. Minute-Based Rules

Contribution side:
- Earn points linearly with valid minutes completed.
- Apply quality multiplier from anti-abuse scoring.

Receiving side:
- Spend points linearly with delivered minutes.
- Minimum billable duration can be configured (for example 20 seconds).

Rate difference:
- earn_rate_ppm and spend_rate_ppm are intentionally different.
- Both rates are versioned and auditable.

## 8. Anti-Abuse Constraints

- Reject repeated low-quality sessions from same device fingerprint.
- Cap max earnings per device per hour/day.
- Cap max spend burn rate per website/campaign.
- Penalize abnormal short bounces in quality_multiplier.

## 9. Data and Ledger Requirements

Required records:
- assignment_queue rows (status: queued, in_progress, done, failed)
- assignment_runs rows with actual duration and quality score
- credit_ledger rows for reserve, release, debit, credit
- rate_cards rows storing earn_rate_ppm and spend_rate_ppm by plan/time

Ledger event types:
- reserve_spend
- release_spend
- settle_spend
- settle_earn
- adjust_manual

## 10. Scheduler Pseudocode

1. claim_supply_sessions(limit_n)
2. for each supply_session:
3.   target = claim_best_target_for_session(supply_session)
4.   if no target: continue
5.   if !reserve_wallet(target.user_id, reserve_points): continue
6.   start_run(supply_session, target)
7.   upon run_end:
8.     settle_spend_and_earn(run_id)
9.     emit_realtime_events(run_id)
10.    requeue_if_needed(target)

## 11. Acceptance Criteria

- Queue dispatch is deterministic and fair under tie conditions.
- One session maps to one target at a time.
- Wallet reservation prevents overspending.
- Earning and spending are calculated by minute with separate rates.
- Ledger is fully auditable for each run.
- Realtime view updates during assigned runs.
