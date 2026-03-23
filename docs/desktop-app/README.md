# Zenvist Desktop App Docs (Part 2)

This folder contains the standardized documentation set for the desktop-enabled Part 2 module.

## Documentation Standard
- Audience-first sections (Product, Economy, Experience, Architecture, Delivery)
- Single source of truth per topic
- Every behavior should trace to use case -> UX -> technical/API
- Keep links relative and scoped to this folder

## Folder Structure
```text
desktop-app/
	00-overview/
		documentation-standard.md
	10-product/
		product-scope.md
		use-cases.md
		traffic-sharing-model.md
	20-economy/
		queue-and-credit-algorithm.md
		pricing-and-growth-strategy.md
	30-experience/
		ui-spec.md
		website-adding-flow.md
		realtime-visitor-view.md
	40-architecture/
		technical-spec.md
	90-delivery/
		delivery-plan.md
	README.md
```

## Documents
- [Documentation Standard](./00-overview/documentation-standard.md)
- [Glossary](./00-overview/glossary.md)
- [Product Scope and Flows](./10-product/product-scope.md)
- [Desktop App Use Cases](./10-product/use-cases.md)
- [Traffic Sharing Model](./10-product/traffic-sharing-model.md)
- [Queue and Credit Algorithm](./20-economy/queue-and-credit-algorithm.md)
- [Pricing and Growth Strategy](./20-economy/pricing-and-growth-strategy.md)
- [UI Specification from Reference Screens](./30-experience/ui-spec.md)
- [Website Adding Flow (4-Step Wizard)](./30-experience/website-adding-flow.md)
- [Real-Time Visitor View](./30-experience/realtime-visitor-view.md)
- [Technical Architecture and APIs](./40-architecture/technical-spec.md)
- [Delivery Plan](./90-delivery/delivery-plan.md)

## What This Covers
- Web-first auth + desktop pairing
- Desktop verification and heartbeat model
- Traffic Exchange dashboard structure
- Websites, Wallet, and Referrals modules
- Credits and campaign lifecycle

## Recommended Reading Order
1. 00-overview/documentation-standard.md
2. 00-overview/glossary.md
3. 10-product/product-scope.md
4. 10-product/use-cases.md
5. 10-product/traffic-sharing-model.md
6. 20-economy/queue-and-credit-algorithm.md
7. 20-economy/pricing-and-growth-strategy.md
8. 30-experience/ui-spec.md
9. 30-experience/website-adding-flow.md
10. 30-experience/realtime-visitor-view.md
11. 40-architecture/technical-spec.md
12. 90-delivery/delivery-plan.md
