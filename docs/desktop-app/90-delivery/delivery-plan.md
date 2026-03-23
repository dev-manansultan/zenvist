# Delivery Plan (Desktop App Part 2)

## Phase 1: Foundation
- Add dedicated Part 2 routes and navigation entries
- Add desktop pairing endpoints and schema
- Build dashboard shell for Exchange, Websites, Wallet, Referrals

Exit criteria:
- User can sign in on web and see Part 2 pages with placeholder data.

## Phase 2: Device and Earning Pipeline
- Implement pairing and heartbeat flows
- Implement contribution-to-credit pipeline
- Show earning and traffic KPIs in overview

Exit criteria:
- Verified desktop device earns credits and updates wallet.

## Phase 3: Websites + Wallet
- Implement websites CRUD and slot limits
- Implement top-up, conversion logic, and histories
- Add warnings and policy messages

Exit criteria:
- User can manage websites and wallet actions with full validations.

## Phase 4: Referrals + Optimization
- Implement referral invites, link sharing, and earnings reports
- Add chart optimizations and map streaming updates
- Finalize anti-abuse and rate limits

Exit criteria:
- Referrals are measurable and the Part 2 dashboard is production-ready.

## Implementation Notes
- Use section-by-section API loading to avoid whole-page failure.
- Keep UTC note visible on metrics and charts.
- Ensure plan and slot restrictions are enforced server-side.
