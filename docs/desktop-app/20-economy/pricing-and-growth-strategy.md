# Pricing and Growth Strategy (Better Than Competitor Baseline)

This document upgrades the pricing model inspired by the provided competitor screens (autopilot slots, website slots, traffic points, and subscription tiers) and adapts it to drive stronger conversion and retention for Zenvist.

## 1. Goals

- Increase free-to-paid conversion without confusing users.
- Keep earning and spending economy healthy.
- Provide clear upgrade paths for users at different maturity stages.
- Reduce churn by aligning plans with outcomes (traffic quality, speed, and controls).

## 2. Competitor Pattern Observed

Observed productized offers:
- Point packs (one-time purchases)
- Extra website slots (one-time purchases)
- Autopilot exchange slots (time-based bundles)
- Subscription tiers (Starter, Premium, Platinum)

Main weakness in typical competitor pattern:
- Too many similar purchase cards without clear "best plan" guidance.
- Feature communication is broad, but ROI guidance is weak.
- Upsell path can feel fragmented across multiple purchase pages.

## 3. Zenvist Monetization Architecture

Use a 4-layer monetization system:

1. Core subscription (monthly/annual)
2. Add-on bundles (points, extra slots)
3. Autopilot boost packs (weekly/monthly)
4. Performance incentives (referral + streak + quality rewards)

### 3.1 Subscription Tiers (Primary Revenue)

| Tier | Who it is for | Monthly Price (example) | Website Slots | Session Slots | Earning Ratio | Country Targeting | Live View |
|---|---|---:|---:|---:|---:|---|---|
| Free | New users testing platform | $0 | 1 | 1 | 60% | No | Basic |
| Starter | Early growth users | $9 | 3 | 3 | 70% | Limited | Standard |
| Growth | Serious operators | $19 | 10 | 8 | 82% | Yes | Advanced |
| Scale | Agencies and teams | $49 | 30 | 20 | 90% | Advanced | Advanced + team |

Annual discount recommendation:
- 20% off annual plans with explicit monthly-equivalent display.

### 3.2 Point Packs (Fast Activation)

| Pack | Price (example) | Effective Cost per 1k points | Bonus | Best for |
|---|---:|---:|---|---|
| 1k | $2.49 | $2.49 | 0% | Trial top-up |
| 5k | $9.99 | $2.00 | 5% bonus points | Small campaigns |
| 25k | $39.99 | $1.60 | 12% bonus points | Growing users |
| 100k | $129.99 | $1.30 | 20% bonus points | Power users |

Optimization:
- Add "Most popular" badge on mid-tier pack.
- Display estimated visitor-minute output for each pack.

### 3.3 Website Slot Add-ons (One-Time)

| Add-on | Price (example) | Notes |
|---|---:|---|
| +5 website slots | $19 | Lifetime add-on |
| +15 website slots | $49 | Lifetime add-on |
| +50 website slots | $129 | Lifetime add-on |

Rule:
- Slot add-ons stack with plan limits.

### 3.4 Autopilot Boost Packs (Time-Based)

| Pack | Duration | Price (example) | Benefit |
|---|---|---:|---|
| Boost 5 | 1 week | $14.90 | +5 active boost slots |
| Boost 10 | 1 week | $24.90 | +10 active boost slots |
| Boost 20 | 1 month | $79.90 | +20 active boost slots |

Positioning:
- Not a replacement for subscription; used for temporary growth bursts.

## 4. Conversion Design (To Beat Competitor)

### 4.1 Plan Selection UX

- One recommended plan highlighted based on usage telemetry.
- Show "Current plan vs suggested plan" comparison card.
- Show payback estimate (example: "Upgrade to Growth to increase eligible inventory by 2.4x").

### 4.2 Offer Sequencing

Recommended purchase journey:
1. User hits slot/feature limit
2. Show contextual paywall with two options:
   - Upgrade tier
   - Buy add-on
3. Show one-click checkout with saved payment method
4. Confirm expected impact immediately (new slots, ratio, targeting)

### 4.3 Growth Mechanics

- New-user accelerator: first paid purchase gets +15% points bonus.
- Activity streak: sustained quality contribution adds temporary earning bonus.
- Referral ladder: higher referral count unlocks fee discounts or bonus points.

## 5. Feature Gating Matrix

| Capability | Free | Starter | Growth | Scale |
|---|---|---|---|---|
| Geo country targeting | No | Limited set | Full | Full + rules |
| Random duration | No | Yes | Yes | Yes |
| Custom referrer | No | No | Yes | Yes |
| User actions | No | Trial | Full | Full |
| Hide website URL | No | No | Yes | Yes |
| Advanced live view | No | No | Yes | Yes |
| API/webhook exports | No | No | Limited | Full |

## 6. Billing and Ledger Rules

- Keep earning rate and spending rate separate and transparent.
- Rate changes must be versioned and auditable.
- Wallet reservation required before run assignment.
- Refund policy for failed/invalid sessions must be deterministic.

## 7. KPIs for Monetization Success

- Free to paid conversion rate
- Trial purchase conversion (first point pack)
- ARPPU (average revenue per paying user)
- Upgrade rate Starter -> Growth
- 30-day retention by tier
- Revenue split: subscription vs add-ons vs autopilot

## 8. Required Purchase Screens

- /dashboard/purchase/plans
- /dashboard/purchase/points
- /dashboard/purchase/website-slots
- /dashboard/purchase/autopilot
- /dashboard/billing/history

Each purchase card should include:
- Clear value statement
- Unit economics (cost per slot or per 1k points)
- Activation speed
- Applicable bonus and expiry

## 9. API and Data Requirements

Entities:
- plan_catalog
- addon_catalog
- autopilot_catalog
- user_subscriptions
- user_addons
- billing_transactions
- checkout_sessions

Endpoints:
- GET /api/part2/purchase/catalog
- POST /api/part2/purchase/checkout
- GET /api/part2/billing/history
- POST /api/part2/subscription/change-plan
- POST /api/part2/addons/purchase

## 10. Rollout Plan

Phase 1:
- Launch simplified 3-tier subscription + point packs

Phase 2:
- Add website-slot add-ons and contextual paywalls

Phase 3:
- Add autopilot packs + recommendation engine

Phase 4:
- Add personalization and dynamic offer optimization

This structure keeps pricing understandable while creating clear and higher-converting upgrade paths than the competitor baseline.
