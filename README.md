# Azis Muhamad Fadli - Portfolio, Cozy Blog & Integrated CMS

Personal engineering portfolio, documentation blog, and single-owner CMS built with **Astro (SSR via `@astrojs/vercel`)**, **Tailwind CSS v4**, and **Supabase** (PostgreSQL, Auth, Storage).

## Features

- **Light-default Dual Theme**: Starts in Light mode (`#ffffff`, `#fafafa`, `#000000`) with a persistent, zero-FOUC Light/Dark toggle (`#000000`, `#0a0a0a`, `#ffffff`).
- **Bilingual Chrome (`EN / ID`)**: Instant UI language switch with automatic CMS translation fallback (`pickLocale`).
- **Public Portfolio (`/`, `/about`, `/work`)**: Hero profile, word scroll-reveal manifesto, tilted marquee, progress ring + interactive tech icons, Selected Work with hover preview linking to external URLs, expandable Skills & Milestones accordion, and external Contact CTA (`GET IN TOUCH →` / `CONTACT ME →`).
- **Cozy Blog (`/blog`, `/blog/[slug]`)**: Category filtering, labeled search input, reading time & language badges (`ID`/`EN`), empty/filtered-empty/error UI states, `68ch` reading column, sticky/collapsible TOC, dual-theme Shiki code highlighting with one-click Copy, and XSS sanitization.
- **Integrated CMS (`/admin`)**: Protected SSR routes for managing Blog Markdown posts (with live server preview & image uploads), Projects (CRUD, reordering, featured toggle), and About/Profile/Skills/Milestones data.
- **Offline/Empty Fallback**: Renders clearly labeled `[PLACEHOLDER]` and `[SAMPLE]` portfolio content when Supabase environment variables are not configured.

## Commands

```bash
# Install dependencies
npm install

# Run local development server (Astro SSR)
npm run dev

# Run Astro diagnostics & TypeScript check
npm run check

# Run Vitest unit tests
npm test

# Build for Vercel SSR deployment
npm run build

# Preview production build locally
npm run preview
```

## Supabase Setup

1. Create a new project at [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase Dashboard and execute the schema migration first:
   - `supabase/migrations/0001_initial_schema.sql` (creates `site_profile`, `projects`, `posts`, `about_sections`, `skill_groups`, `activities`, triggers, RLS policies, and the `portfolio-media` storage bucket).
3. *(Optional)* Execute `supabase/migrations/0002_seed_placeholder.sql` if you want pre-populated `[SAMPLE]` rows inside Supabase before adding your own entries.
4. Configure single-owner Authentication:
   - Go to **Authentication -> Providers -> Email** and ensure Email provider is enabled.
   - Go to **Authentication -> Sign In / Providers (User Signups)** and **disable "Allow new users to sign up"** so only the owner account you provision can authenticate against RLS policies.
   - Go to **Authentication -> Users -> Add user -> Create new user** to create your single owner login credentials (email + password).

## Environment Variables

Copy `.env.example` to `.env` locally (never commit `.env`):

```env
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deploying to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket and import it into [Vercel](https://vercel.com/).
2. Framework Preset is automatically detected as **Astro** (`@astrojs/vercel` SSR output).
3. Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` under **Project Settings -> Environment Variables** (Production, Preview, Development).
4. Set Node.js Version in Vercel Project Settings to **24.x** (matching the `@astrojs/vercel` adapter target).
5. Deploy and sign in at `/admin/login` using the single-owner Supabase account you created above.
