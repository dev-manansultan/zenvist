# Website Adding Flow (Wizard Specification)

This document captures the exact multi-step website onboarding flow based on the attached screenshots.

## 1. Route and Layout

Route: /dashboard/websites/new

Layout:
- Left vertical stepper with 4 steps
- Main content panel for active step
- Bottom navigation with Previous and Next/Save
- Context banners for warnings, limits, and upgrade-gated features

Steps:
1. Guidelines and Rules
2. Website Details
3. Visiting Details
4. User Actions

## 2. Step 1: Guidelines and Rules

Purpose:
- Ensure user understands platform compliance and traffic constraints before proceeding.

Required elements:
- High-priority warning panel with acceptable usage rules
- Prohibited content list and policy consequences
- Credit/points availability warning banner
- Next button enabled only after acknowledgement checkbox

Validation:
- User must accept rules (boolean required) to continue.

## 3. Step 2: Website Details

Purpose:
- Collect core website configuration and baseline traffic controls.

Fields:
- Website URL (required)
- Visit Duration mode:
  - Fixed Visit Duration (default)
  - Random Visit Duration (upgrade-gated)
- Visit Duration slider (seconds)
- Maximum Visits Per Hour slider
- Device Type selector:
  - Mixed Devices (default)
  - Desktop (upgrade-gated)
  - Tablet (upgrade-gated)
  - Smartphone (upgrade-gated)
- Total Visits Limit toggle and value (optional)
- Hide Website URL toggle (upgrade-gated)

Validation:
- URL must be absolute HTTP/HTTPS URL.
- Reject localhost/private network targets.
- Duration and max visits must remain within plan limits.
- Upgrade-gated options cannot be saved on unsupported plans.

System behavior:
- Show estimate helper text for points-to-visit-duration mapping.
- Show inline plan upgrade chips on gated controls.

## 4. Step 3: Visiting Details

Purpose:
- Configure optional quality and behavior settings.

Fields and toggles:
- Geo Targeting (upgrade-gated)
- Target Countries (multi-select ISO country codes, required when Geo Targeting is enabled)
- Custom Referrer (upgrade-gated)
- Schedule For Future (upgrade-gated)
- Auto Scroll (enabled by default)
- Automatic Cookie Warning/Popup Removal (enabled by default)
- Unique IP Visitors:
  - Enable toggle
  - Interval options: 3h, 6h, 12h, 24h (may be plan-gated)
- Quality Traffic Only (coming soon / disabled)
- Initially Pause Website toggle
- Notes (max 1024 chars)

Validation:
- Notes length <= 1024.
- If Geo Targeting is enabled, require at least one target country.
- If future scheduling is enabled, require a valid schedule payload.
- If custom referrer enabled, require valid referrer URL/domain list.

## 5. Step 4: User Actions

Purpose:
- Configure optional interaction actions and clarify limitations.

Fields:
- Enable User Actions toggle (plan-gated)
- Action set editor link or embedded builder (if enabled)

Required panels:
- "Try before upgrading" informational panel
- "Please read" technical limitations panel
- Final credit warning banner when user lacks points

Validation:
- If actions enabled, require at least one valid action rule.
- Validate action selectors/events schema before Save.

## 6. Save Behavior

On final save:
1. Validate entire wizard payload server-side.
2. Create website record.
3. Persist nested settings (visiting details, actions, limits).
4. Return website id and initial status.

Suggested statuses:
- active
- paused
- blocked_plan_limit
- blocked_policy_review

## 7. Suggested API Contract

- POST /api/part2/websites/wizard/validate-step
- POST /api/part2/websites
- PATCH /api/part2/websites/:id
- POST /api/part2/websites/:id/actions/validate

Optional draft flow:
- POST /api/part2/websites/wizard/draft
- GET /api/part2/websites/wizard/draft/:id

## 8. Data Model Additions

Suggested fields on websites:
- url
- duration_mode (fixed|random)
- duration_sec
- max_visits_per_hour
- device_type (mixed|desktop|tablet|smartphone)
- total_visits_limit_enabled
- total_visits_limit
- hide_url
- auto_scroll
- popup_removal
- unique_ip_enabled
- unique_ip_interval
- geo_targeting
- target_countries
- country_match_mode (strict|best_effort)
- custom_referrer
- schedule_payload
- initially_paused
- notes

Suggested table for actions:
- website_actions
  - id, website_id, action_schema_json, is_enabled, created_at, updated_at

## 9. UX States

Global states:
- Loading wizard draft
- Step validation error
- Upgrade required
- Insufficient points warning
- Save success toast
- Save blocked with actionable message

## 10. Acceptance Checklist

- Four-step wizard is fully navigable with persisted step state.
- Step-level and final server-side validation both active.
- Plan-gated controls are visibly gated and safely blocked on submit.
- Policy acknowledgment is mandatory before step 2.
- Insufficient points state is shown without breaking save flow.
- Website is created with complete nested settings payload.
