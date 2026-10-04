---
name: landing-copy
description: Refine landing-page copy in this repo while preserving the current premium storefront tone, section structure, and navigation consistency.
---

When invoked for copy work:
- read `src/lib/landing-content.ts` first
- preserve the existing section structure in `src/app/page.tsx`
- keep copy concise, premium in tone, and product-forward
- maintain consistency between nav labels, section ids, CTA labels, promo cards, and footer links
- prefer editing existing copy over inventing new sections

Before calling the change done:
- verify any changed headings, links, or anchors still match user-visible behavior
- update `tests/home.spec.ts` if the rendered wording intentionally changed
- report changed files with `file:line` citations

Avoid:
- placeholder starter copy
- generic filler marketing language
- unnecessary rewrites outside the requested sections
