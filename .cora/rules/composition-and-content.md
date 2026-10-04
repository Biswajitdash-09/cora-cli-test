Keep `src/app/page.tsx` primarily compositional.

When changing landing-page content or structure:
- prefer extending data in `src/lib/landing-content.ts` before duplicating JSX
- reuse existing section components under `src/components/`
- keep navigation anchors, section ids, CTAs, and footer links consistent with each other
- keep repeated content data-driven

Prefer the smallest change that fits the current architecture:
- extend arrays and types before creating one-off variants
- keep copy concise and premium in tone
- avoid placeholder starter text or generic marketing filler

If a change affects user-visible headings, links, or anchors, check whether `tests/home.spec.ts` also needs an update.
