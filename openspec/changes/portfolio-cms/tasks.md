# Tasks

## 1. Project Scaffold & Configuration

- [x] 1.1 Initialize Astro project with TypeScript strict mode, Tailwind CSS, `@astrojs/vercel` SSR adapter, `@supabase/supabase-js`, `@supabase/ssr`, `marked`, `shiki`, `sanitize-html`, and `vitest`, and verify `npm run check` and `npm run build` succeed on a minimal health route.
- [x] 1.2 Add `.env.example` documenting `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, ensure `.env` is ignored in `.gitignore`, and verify no secrets exist in tracked files.

## 2. Design System, Dual-Theme & Navigation Shell (`design-system-theming`)

- [x] 2.1 Implement `src/styles/global.css` with Light default (`#ffffff`, `#fafafa`, `#000000`, `#09090b`, `#52525b` muted AA) and `[data-theme="dark"]` (`#000000`, `#0a0a0a`, `#ffffff`, `#a1a1aa` muted AA) tokens, Google Fonts (`Playfair Display`, `Plus Jakarta Sans`, `JetBrains Mono`), base `cursor: pointer`, visible `:focus-visible` outlines, and `prefers-reduced-motion` rules; verify WCAG AA contrast (4.5:1+) on all foreground/background pairs using `contrast-check.py`.
- [x] 2.2 Implement `src/lib/content/i18n.ts` with `EN` / `ID` UI dictionaries and `pickLocale` fallback helper, plus unit tests in `tests/unit/i18n.test.ts`; verify `npm test` passes.
- [x] 2.3 Implement `src/layouts/BaseLayout.astro`, `Navbar.astro`, `ThemeToggle.astro`, `LocaleToggle.astro`, and `Footer.astro` with Light-default anti-FOUC inline script, `HOME`/`ABOUT`/`WORK`/`BLOG` links, labeled accessible mobile drawer with `Escape` handling and focus return, live `GMT +7` clock, `azis` wordmark, and copyright without em dashes; verify keyboard navigation and zero horizontal overflow at 320px, 375px, 768px, and 1280px.

## 3. Supabase Schema, Auth & Data Layer (`supabase-cms-backend`)

- [x] 3.1 Author `supabase/migrations/0001_initial_schema.sql` (all 6 tables: `site_profile`, `projects`, `posts`, `about_sections`, `skill_groups`, `activities`; indexes, `updated_at` triggers, RLS policies, and `portfolio-media` Storage bucket + policies) and `supabase/migrations/0002_seed_placeholder.sql` (labeled `[SAMPLE]` rows for Azis Muhamad Fadli); verify SQL syntax and schema alignment against `design.md`.
- [x] 3.2 Implement `src/lib/content/placeholder.ts`, `src/lib/content/validation.ts` (safe external URLs, slug normalization, upload MIME/size validation), `src/lib/supabase/server.ts`, `src/lib/supabase/queries.ts`, and `src/middleware.ts` protecting `/admin/*` (except `/admin/login`), plus unit tests in `tests/unit/validation.test.ts` and fallback tests in `tests/unit/queries.test.ts`; verify `npm test` and `npm run check` pass.
- [x] 3.3 Implement `src/pages/api/auth/login.ts` and `src/pages/api/auth/logout.ts` using HTTP-only SSR cookies and verify unauthenticated requests to `/admin` redirect to `/admin/login`.

## 4. Public Portfolio Pages (`public-portfolio`)

- [ ] 4.1 Implement Home (`/`, `src/pages/index.astro`) and its components (`HeroSection.astro`, `StatementReveal.astro`, `TiltedMarquee.astro`, `QuoteTechCircle.astro`, `SelectedWorkList.astro`, `ContactBanner.astro`) adapting Azis's IT Support, DevOps & Cloud profile with scroll-reveal, reduced-motion fallbacks, grayscale-to-color logos, text-scramble + hover banner preview linking directly to external project URLs, and external `GET IN TOUCH →` CTA; verify rendering and interactive states in Light and Dark modes at desktop and mobile breakpoints.
- [ ] 4.2 Implement About (`/about`, `src/pages/about.astro`) with `SkillsAccordion.astro` (`+`/`-`, `aria-expanded`) and `ActivitiesList.astro` (expandable `/01..` milestones with photo, subtitle, description, location, year), plus `Personal Interest` and `CONTACT ME →` external CTA; verify keyboard operability (`Enter`/`Space`) and layout across breakpoints.
- [ ] 4.3 Implement Work (`/work`, `src/pages/work.astro`) displaying `/03 WORKS`, complete ordered projects list with direct external links, total project count summary, and `GET IN TOUCH →` external CTA; verify external links carry `rel="noopener noreferrer"` and zero layout shift on hover.

## 5. Cozy Blog Index & Reader (`blog-reading`)

- [ ] 5.1 Implement `src/lib/content/markdown.ts` (`marked` + `shiki` dual-theme + `sanitize-html` allowlist + heading extraction for TOC) and unit tests in `tests/unit/markdown.test.ts` covering XSS stripping, code block highlighting, and TOC heading IDs; verify `npm test` passes.
- [ ] 5.2 Implement `/blog` (`src/pages/blog/index.astro` + `BlogIndexClient.astro`) with category filter controls, labeled search input, reading time & language badges (`ID`/`EN`), and explicit empty, filtered-empty (with Reset button), loading, and error states; verify filtering, search, and all UI states work without JS errors.
- [ ] 5.3 Implement `/blog/[slug]` (`src/pages/blog/[slug].astro`, `BlogToc.astro`, `MarkdownProse.astro`) featuring a 68ch reading column, `1.75` line-height, collapsible mobile / sticky desktop TOC, responsive scrollable tables, image aspect-ratio sizing, Copy Code button with `aria-live` status, translation notice for single-language posts, and Previous/Next navigation; verify mobile overflow, code copy, and 404 handling for draft/missing slugs.

## 6. Integrated Admin CMS (`/admin`) (`admin-cms-ui`)

- [ ] 6.1 Implement `/admin/login` (`src/pages/admin/login.astro`) with explicit `<label>` elements, inline validation, loading state on submit, accessible error alert, and configuration notice if Supabase env vars are missing; verify login form validation and redirect flow.
- [ ] 6.2 Implement authenticated CMS API endpoints (`src/pages/api/cms/posts.ts`, `projects.ts`, `about.ts`, `upload.ts`) verifying Supabase session on every request and enforcing validation rules; verify unauthorized requests receive HTTP 401 and valid requests return typed JSON responses.
- [ ] 6.3 Implement `/admin` (`src/pages/admin/index.astro`, `AdminShell.astro`, `PostEditor.astro`, `ProjectManager.astro`, `AboutManager.astro`) supporting Blog Markdown live preview + cover/inline image upload, Project CRUD + reordering + `featured_on_home` toggle, About/Profile/Skills/Activities management, empty/loading/error/success states, and `Escape`-closable delete confirmation modal; verify full keyboard operability and mobile layout.
- [ ] 6.4 Document Supabase project setup, Auth user provisioning (disable public signups), migration execution, and Vercel deployment steps in `README.md`; verify documented commands match `package.json`.

## 7. Integration Verification & Antislop Delivery Gate

- [ ] 7.1 Run `npm run check`, `npm test`, and `npm run build` after all edits and confirm zero TypeScript, Astro, test, or build errors.
- [ ] 7.2 Start the built/dev server and run headless browser click-through verification across `/`, `/about`, `/work`, `/blog`, `/blog/[slug]`, `/admin/login`, and `/admin` in both Light and Dark themes, `EN` and `ID` locales, and desktop (`1280px`) + mobile (`375px`, `320px`) viewports, recording evidence for every interactive element and completing the `antislop` Delivery Gate (`antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`) with zero FAILs.

## Workflow follow-up

- Archive the change with `openspec archive portfolio-cms` once implementation and review requirements are satisfied.
- Verify the archived specs in `openspec/specs/` match the delivered behavior.

