Keep checkout behavior simple, explicit, deterministic, and easy to test.

When changing `src/app/checkout/page.tsx` or shared cart behavior:
- unavailable actions must be truly non-interactive, not just visually muted
- pricing, shipping, tax, promo discounts, and totals must stay deterministic
- confirmation behavior must preserve submitted order details before cart state is cleared
- form validation should stay user-visible and accessible

Do not introduce:
- backend persistence
- authentication
- payment processing
- hidden stateful behavior that makes tests harder to reason about

Prefer user-visible verification in `tests/home.spec.ts`, especially for cart updates, coupons, disabled states, and demo order confirmation.
