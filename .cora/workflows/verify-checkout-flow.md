---
description: Verify cart and checkout behavior for this demo storefront
argument-hint: <change or concern>
---

Interpret `$ARGUMENTS` as the checkout behavior to verify.

1. Read `src/app/checkout/page.tsx`, any touched cart code, and `tests/home.spec.ts` before making changes.
2. Check for the smallest root-cause fix before editing.
3. Preserve deterministic totals, visible validation, coupon behavior, and truly disabled unavailable actions.
4. Keep the flow aligned with this repo's demo-store scope: no backend, auth, or payment processing.
5. Update Playwright coverage if user-visible checkout behavior or semantics changed.
6. Verify with the strongest relevant command available, preferably the relevant Playwright coverage.
7. Report changed files with `file:line` citations and say plainly what was verified versus left unverified.
