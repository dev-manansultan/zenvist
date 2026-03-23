# UI Specification (Based on Attached Reference)

## Design Direction
Use the attached OrganicHits-style structure as interaction reference while preserving Zenvist branding and colors.

Zenvist palette:
- Primary Green: #4CAF50
- Secondary Olive: #8BC34A
- Accent Sand: #D7CCC8
- Neutral Dark: #3E3E3E
- Neutral Light: #FAFAFA
- Error: #E53935
- Success: #43A047

## A. Traffic Exchange Overview Screen
Route: /dashboard/exchange

Layout order:
1. Top navigation
2. Announcement bars
3. Membership plan card
4. Traffic statistics row
5. Earning statistics row
6. 2x2 chart grid
7. Referrals row
8. Live traffic map

### Membership Plan Card
Widgets:
- Plan type
- Remaining time
- Website slots used/total
- Session slots used/total
- Earning ratio

Behavior:
- Progress bars show usage
- Full slot shows warning with upgrade CTA

### Traffic Stats Row
- Visits last 6 months
- Visits this month
- Visits last 7 days
- Visits last 24 hours

### Earning Stats Row
- Points last 6 months
- Points this month
- Points last 7 days
- Points last 24 hours

### Chart Grid
- Visits 24 hours (line)
- Points 24 hours (line)
- Visits 6 months (bar or line)
- Points 6 months (bar or line)

### Live Map
- Real-time visitor locations
- Auto-refresh every 15 to 30 seconds
- Marker tooltip with country, status, campaign id

## B. Websites Screen
Route: /dashboard/websites

From attached reference, include:
- Top summary cards: total slots, used slots, total hits, last 24h hits
- Slot warning banner when user is full
- Website cards with quick stats and sparkline
- Per-website action menu: edit, copy, delete
- Action icons row for run, warning, edit, clone, link, delete

States:
- Empty websites
- Full slot warning
- Loading skeleton cards
- Permission and plan error states

Website onboarding flow:
- Use a dedicated 4-step wizard specification in [website-adding-flow.md](./website-adding-flow.md)
- Steps: Guidelines and Rules -> Website Details -> Visiting Details -> User Actions

## C. Wallet Screen
Route: /dashboard/wallet

From attached reference, include:
- Cash balance card with top-up action
- Converted balance card with points-to-money action
- Purchase history summary strip
- Point conversion history strip
- Conversion rules panel with clear warning text

Validation and business rules:
- Minimum convertible points threshold
- Converted balance may be restricted for plan upgrades and slots
- Show non-withdrawable notice clearly

## D. Referrals Screen
Route: /dashboard/referrals

From attached reference, include:
- Referral explainer panel
- Invite friend form
- Share referral link section with social buttons
- Referral KPI strip
- Tabbed area:
  - Referral users
  - Referral earnings
  - Links and banners

Table columns for referral users:
- Username
- Register date
- Source
- First reward date
- Total referral bonus

## D.1 Purchase and Upgrade Screens
Routes:
- /dashboard/purchase/plans
- /dashboard/purchase/points
- /dashboard/purchase/website-slots
- /dashboard/purchase/autopilot

Based on provided competitor references, implement cleaner conversion-focused cards:
- One recommended plan badge (not multiple equal emphasis cards)
- Clear unit economics (cost per 1k points, cost per slot)
- Explicit activation statement (instant or scheduled)
- "Best value" anchor package in each grid

Required sections:
- Plan comparison with gated feature checklist
- Points packages with bonus labels
- Website slot add-ons with resulting slot total preview
- Autopilot packs with duration and boost impact

CTA behavior:
- Primary CTA: Upgrade/Buy Now
- Secondary CTA: Compare plans or Contact sales (Scale tier)
- Post-purchase confirmation panel must show immediate entitlement changes

## E. Shared UX Requirements
- All KPI cards keep zero-value visibility (never blank)
- UTC timestamp note visible for all charts
- Independent section loading and retry (partial failures allowed)
- Mobile behavior:
  - KPI rows collapse to stacked cards
  - Chart grid becomes one column
  - Tables become scrollable
- Pricing cards must keep consistent height and CTA placement for easy comparison
- Show annual savings badge and monthly-equivalent price on plan cards

## F. Real-Time Visitor View Screen
Route: /dashboard/live-view

Purpose:
- Let users watch ongoing visits in near real-time, not only after run completion.

Layout:
- Live sessions grid (cards for active sessions)
- Selected session panel with live preview stream
- Event timeline (page loaded, scroll, click, dwell, warning)
- Session metadata (website, device type, country, started_at, elapsed)

Per-session card fields:
- Session id
- Website/campaign name
- Status (connecting, live, degraded, ended)
- Current URL
- Last heartbeat seconds ago

Controls:
- Filter by website/campaign/status/country
- Pause auto-follow
- Mute/unmute stream panel
- Open full log when session ends

UX rules:
- If stream drops, keep timeline updates and show reconnect state.
- If no stream exists, show textual event stream fallback.
- Max concurrent live previews in UI should be capped (for example 4) to keep performance stable.
