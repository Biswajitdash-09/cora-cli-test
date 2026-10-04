---
name: storefront-change
description: Implement focused storefront or checkout changes in this repo while preserving its compositional structure, premium UX, and deterministic demo behavior.
---

When invoked to implement a change:
- read enough surrounding code before editing
- keep `src/app/page.tsx` compositional
- prefer extending `src/lib/landing-content.ts` and existing components under `src/components/`
- keep cart and checkout behavior explicit, deterministic, and easy to test
- preserve accessibility, including correct semantics and truly disabled unavailable actions

Before calling a change done:
- verify with the strongest relevant command available
- update `tests/home.spec.ts` when interactive semantics or user-visible behavior changes
- report changed files with `file:line` citations
- say plainly what was not verified

Avoid:
- backend persistence, auth, or payment processing
- broad error handling that hides bugs
- one-off UI variants when an existing section pattern can be extended
- flashy visual additions that break the current storefront style
