# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro.js (SSR with `@astrojs/vercel` targeting Vercel), Tailwind CSS, and Supabase (PostgreSQL, Auth, Storage).

## Users

- Primary visitors: Recruiters, hiring managers, business partners, and technical peers evaluating Azis Muhamad Fadli's capabilities in IT Support, DevOps, and Cloud Engineering.
- Secondary user (owner): Azis Muhamad Fadli authoring technical documentation, sharing experience notes, and maintaining projects and About details via the integrated `/admin` CMS.

## Product Purpose

Present Azis Muhamad Fadli's engineering profile, projects, and milestones clearly while providing a comfortable, readable Blog for technical documentation and experience sharing that the owner can update directly through a Supabase-backed CMS without editing source code.

## Positioning

Combines a high-contrast editorial portfolio (`DESIGN.md` tokens, Light default with full Dark toggle, bilingual `EN / ID`) with a calm, documentation-oriented reading sanctuary for IT Support, DevOps, and Cloud guides backed by an integrated single-owner CMS.

## Operating Context

- Visitors browse from desktop and mobile devices to evaluate capabilities quickly, jump to live external project links (`target="_blank"`), or contact the owner directly via external links (`GET IN TOUCH →` / `CONTACT ME →`).
- Readers open `/blog` and `/blog/[slug]` for technical documentation and experience posts that require clear code blocks (with copy actions), structured headings/TOC, and relaxed reading measure.
- The owner logs into `/admin` with single-owner Supabase Auth credentials to draft/publish Markdown posts, upload media, manage ordered projects, and edit About content.

## Capabilities and Constraints

- Default Light theme (`#ffffff` / `#fafafa` / `#000000`) with persistent, fully styled Dark theme toggle (`#000000` / `#0a0a0a` / `#ffffff`).
- Navigation replaces the reference `API` button with `BLOG`: `HOME`, `ABOUT`, `WORK`, `BLOG`, `EN / ID`, and Light/Dark toggle.
- Bilingual `EN / ID` UI switching; CMS fields fall back gracefully when a translation is omitted, and blog articles may be published in a single language (`ID` or `EN`) with clear language labels.
- No em dashes (`—`) in UI copy (replaced with commas or regular hyphens), WCAG AA contrast on all static text, and `→` preserved on primary contact CTAs.
- Explicitly out of scope: public user signup, multi-author CMS roles, blog comments or reactions, newsletter forms, old API endpoint showcase, and drag-and-drop page building.

## Brand Commitments

- Identity: **Azis Muhamad Fadli** (wordmark `azis`).
- Visual baseline: `design/DESIGN.md` tokens (`Playfair Display`, `Plus Jakarta Sans`, `JetBrains Mono`, 4px spacing scale, pill CTAs with `33554400px` radius, flat no-shadow hierarchy) and `design/references/` compositions adapted from Dark-only reference captures to Light default + Dark toggle.

## Evidence on Hand

- Currently greenfield: no verified personal bio, real project list, profile/activity photos, or real technical blog articles are supplied in the repository yet.
- Initial launch ships with clearly labeled `[PLACEHOLDER]` / `[SAMPLE]` data for Azis Muhamad Fadli (IT Support, DevOps, Cloud Engineer) to be replaced via `/admin`; future work must never fabricate real achievements, metrics, or testimonials.

## Product Principles

- Authenticity over filler: placeholder content stays explicitly labeled until replaced by the owner in `/admin`.
- Reading comfort earns attention: blog articles prioritize calm legibility, code usability, and clear wayfinding over decorative effects.
- Low-friction ownership: publishing a technical note or adding a project works in one language without mandatory duplicate translation entry.
- Equal craft in both themes and viewports: Light default, Dark toggle, desktop, and 320px+ mobile hold up identically.

## Accessibility & Inclusion

- Target WCAG 2.2 AA contrast (minimum 4.5:1 normal text, 3:1 large text and interactive edges) in both Light and Dark modes, full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`), visible focus indicators, and `prefers-reduced-motion` support.

