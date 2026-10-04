---
description: Refine existing hero copy while preserving section structure and navigation consistency
argument-hint: <copy request>
---

Interpret `$ARGUMENTS` as the requested hero-copy refinement.

1. Read `src/lib/landing-content.ts` and `src/app/page.tsx` before editing.
2. Change only the hero, navigation, promo, or footer copy needed for `$ARGUMENTS`.
3. Keep `src/app/page.tsx` compositional and prefer content edits in `src/lib/landing-content.ts`.
4. Preserve section ids, anchor links, CTA intent, and the current premium storefront tone.
5. If any rendered heading, link text, or anchor behavior changes, update `tests/home.spec.ts`.
6. Verify with the strongest relevant command available.
7. Report the exact file changes with `file:line` citations and say plainly if any verification was not run.
