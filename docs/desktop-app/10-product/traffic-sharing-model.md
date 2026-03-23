# Traffic Sharing Model (Core Product Logic)

This document defines the main business loop for Zenvist Part 2.

## 1. Core Concept

Zenvist is a two-sided traffic-sharing platform:
- Users contribute visits to other users' websites via verified desktop sessions.
- Users earn credits/points for valid contribution.
- Users spend credits to receive visits on their own websites.

This creates a balanced exchange network with transparent verification.

## 2. Real User-Like Visit Principle

Contribution sessions must behave like real browsing patterns:
- Real browser engine execution
- Natural delays, scrolling, and dwell patterns
- Device type policies and variability where applicable
- Optional user actions (plan-gated)

The objective is realistic session quality, not synthetic hit inflation.

## 3. Contribution to Reward Flow

1. Desktop app runs a verified session for network demand.
2. Session emits heartbeats and behavior events.
3. Platform validates quality and policy compliance.
4. Credits are added to contributor wallet.

Credit grant conditions (example):
- Session completed required duration
- No major policy violations
- Session quality score above threshold

## 4. Spend to Receive Flow

1. User adds website/campaign and targeting config.
2. User allocates credits and caps (daily/hourly).
3. Scheduler allocates matching contributor sessions.
4. User sees incoming visits in real-time and in final logs.

## 5. Realtime Desktop Visibility Requirement

While a session is running, desktop app must display:
- Live browser view (current page rendering)
- Session status and elapsed time
- Event timeline (load, scroll, click, warnings)

If stream quality drops, UI must degrade gracefully:
- Keep event timeline live
- Show reconnect status
- Persist final run result in logs

## 6. Fairness and Abuse Controls

- Device verification and revocation support
- Per-plan slot and concurrency limits
- Duplicate fingerprint detection
- Rate limits and anomaly checks on event ingestion
- Policy enforcement for prohibited websites/content

## 7. Product Outcomes

Expected outcomes from this model:
- Predictable exchange economy (earn and spend)
- Transparent trust via live view + logs
- Better user confidence because desktop shows active browser behavior

Implementation note:
- The exact dispatch and minute-based earning/spending logic is defined in [queue-and-credit-algorithm.md](../20-economy/queue-and-credit-algorithm.md).
