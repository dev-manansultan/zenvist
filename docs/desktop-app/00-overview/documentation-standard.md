# Desktop App Documentation Standard

## 1. Purpose

Define a consistent standard for creating and maintaining desktop-app documentation.

## 2. Document Taxonomy

- 00-overview: standards, conventions, navigation rules
- 10-product: scope, use cases, business model
- 20-economy: queue, points, pricing, monetization
- 30-experience: screens, flows, interaction patterns
- 40-architecture: APIs, data entities, constraints
- 90-delivery: rollout plan and execution phases

## 3. Required Structure Per Document

Each functional document should include:
1. Objective
2. Scope
3. Main flows
4. Rules/constraints
5. Failure states
6. Acceptance criteria
7. Traceability links

## 4. Writing Rules

- Use short sections with clear headings.
- Use numbered flows for deterministic behavior.
- Use explicit field and API names.
- Avoid ambiguous language (for example "maybe", "etc") in requirements sections.
- Keep all timestamps in UTC unless explicitly stated.

## 5. Traceability Rules

Every major behavior must be traceable:
- Product intent -> 10-product/use-cases.md
- UX flow -> 30-experience/*.md
- Technical implementation -> 40-architecture/technical-spec.md
- Delivery timeline -> 90-delivery/delivery-plan.md

## 6. Versioning and Change Control

When requirements change:
1. Update source use case first.
2. Update related UX and technical docs.
3. Update README reading order only if structure changes.
4. Keep links valid after file moves.

## 7. Review Checklist

- Links resolve correctly.
- No duplicate source-of-truth sections.
- Country/plan/queue constraints are consistent across docs.
- Security and abuse controls are represented in technical spec.
- Acceptance criteria are testable.
