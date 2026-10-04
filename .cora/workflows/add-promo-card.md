---
description: Add or refine a promo card in the landing page's existing data-driven promo grid
argument-hint: <promo request>
---

Interpret `$ARGUMENTS` as the requested promo-card change.

1. Read `src/lib/landing-content.ts`, `src/app/page.tsx`, and the relevant promo component before editing.
2. Prefer extending the `promoCards` data in `src/lib/landing-content.ts` instead of adding one-off JSX.
3. Keep the promo grid aligned with the existing premium storefront style and section hierarchy.
4. Preserve link targets and section consistency with the rest of the landing page.
5. If the change affects rendered copy, links, or layout expectations, update `tests/home.spec.ts`.
6. Verify with the strongest relevant command available.
7. Report what changed with `file:line` citations and note any verification gaps.
