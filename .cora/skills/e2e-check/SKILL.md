---
name: e2e-check
description: Verify landing page, storefront, and checkout behavior in this repo using user-visible assertions and the existing Playwright coverage.
---

When invoked for verification:
- inspect `tests/home.spec.ts` first
- prefer user-visible assertions over implementation details
- focus on navigation anchors, responsive layout, cart behavior, coupons, disabled states, and demo checkout confirmation
- check whether recent code changes altered roles, labels, headings, or link text

Verification guidance:
- prefer the strongest relevant command, such as `npm run test:e2e`
- if the change is narrower, run the smallest relevant Playwright scope that still proves the behavior
- report failures with the user-visible symptom first, then the likely code location

Avoid:
- claiming behavior is verified if the test command was not run
- adding brittle assertions when a visible role, label, or heading can be checked instead
