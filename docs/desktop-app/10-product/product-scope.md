# Product Scope (Desktop App Part 2)

## Objective
Build Part 2 as a desktop-connected growth module where users:
- Sign up and manage account on web
- Pair desktop app to verified device
- Share traffic in a two-sided exchange model
- Earn credits by visiting other users' websites through verified desktop sessions
- Spend credits to receive real visitors on their own websites

## Core Product Model
- Part 1: Scheduling, logs, video proof, verification baseline
- Part 2: Traffic exchange, credits, campaigns, referrals, wallet

Core exchange loop:
- User contributes visits to the network (desktop runner)
- Network rewards contribution with credits/points
- User spends those credits to receive visits on their own websites
- All runs are verified and visible through logs and live view

## Main User Journey
1. User signs in on web dashboard.
2. User downloads desktop app.
3. User pairs desktop app using short-lived pair code.
4. Device starts heartbeat and contribution sessions that visit other users' sites.
5. User earns credits from verified contribution sessions.
6. User creates campaign/website demand and spends credits.
7. User receives visitors and monitors results in logs and live view.

## Desktop Pairing Rules
- Pair code is one-time use and expires quickly.
- Device limit enforced by user plan.
- Every device session uses short-lived signed token.
- Device can be revoked from web dashboard.

## Plan and Slot Model
- Website slots: how many websites user can run
- Session slots: concurrent active contribution sessions
- Earning ratio: how much contribution converts to credits

## Part 2 Modules
- Traffic Exchange Overview
- Websites Management
- Wallet and Point Conversion
- Referrals Program
- Campaigns and Delivery Analytics
- Real-Time Visitor View

## Success Metrics
- Desktop pairing success rate
- Active verified devices per user
- Credits earned vs spent
- Campaign completion rate
- Visitor quality score
- Real-time stream availability (uptime %)
- Stream latency (visitor event to UI render)
