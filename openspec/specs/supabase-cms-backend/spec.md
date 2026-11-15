# supabase-cms-backend Specification

## Purpose

Defines the Supabase relational data model, Storage media bucket, Row-Level Security access control, single-owner admin authentication, and SSR data-fetching contract with labeled placeholder fallback data.

## Requirements

### Requirement: Relational Portfolio and Blog Schema
The system SHALL persist site content in Supabase PostgreSQL tables covering `site_profile` (singleton identity, hero/contact/footer links), `projects` (ordered showcase items with external links), `posts` (Markdown blog articles with publish state and language), `about_sections` (narrative and personal interest), `skill_groups` (expandable skill categories), and `activities` (timeline milestones).

#### Scenario: Schema supports all public and admin entities
- **WHEN** database migrations are applied to a Supabase PostgreSQL project
- **THEN** all six tables, indexes, unique slug constraint on `posts`, and `updated_at` triggers are created without conflicts

### Requirement: Row-Level Security and Single-Owner Admin Access
The system SHALL enforce Row-Level Security on all tables and Storage objects so anonymous visitors can read only published posts and public portfolio/about rows, while create, update, and delete operations require an authenticated single-owner Supabase Auth session.

#### Scenario: Unauthenticated write request is rejected
- **WHEN** an unauthenticated request attempts to insert, update, or delete rows in `posts`, `projects`, `site_profile`, `about_sections`, `skill_groups`, or `activities`
- **THEN** Supabase RLS rejects the mutation with an authorization error

#### Scenario: Draft blog posts are hidden from public queries
- **WHEN** an unauthenticated visitor requests `/blog` or `/blog/[slug]` for an unpublished draft post
- **THEN** the query excludes the draft post and `/blog/[slug]` returns HTTP 404

### Requirement: Supabase Auth Session Guard for Admin Routes
The system SHALL authenticate the site owner via Supabase Auth email/password login, store session tokens in HTTP-only cookies via SSR endpoints, disable public user signup, and redirect unauthenticated requests to `/admin` or `/admin/*` to `/admin/login`.

#### Scenario: Unauthenticated visitor accesses admin route
- **WHEN** a visitor without a valid Supabase session requests `/admin`
- **THEN** the server responds with a redirect to `/admin/login` without rendering CMS forms or private draft data

#### Scenario: Owner signs in and signs out via SSR session cookies
- **WHEN** the owner submits valid credentials on `/admin/login` and later triggers sign-out
- **THEN** login sets valid session cookies and redirects to `/admin`, and sign-out clears cookies and redirects to `/admin/login`

### Requirement: Supabase Storage Bucket for Portfolio and Blog Media
The system SHALL configure a public-read `portfolio-media` Supabase Storage bucket allowing authenticated image uploads (JPEG, PNG, WebP, SVG) for project banners, blog covers/inline images, and About profile/activity photos with file size and MIME validation.

#### Scenario: Authenticated owner uploads a project or blog image
- **WHEN** an authenticated admin uploads a valid image under the size limit through the CMS upload endpoint
- **THEN** the file is stored in `portfolio-media` and its public URL is returned for persistence in the database

#### Scenario: Invalid file type or oversized upload is rejected
- **WHEN** an upload attempts to send an unsupported MIME type or oversized file
- **THEN** the server rejects the upload with a descriptive validation error

### Requirement: Labeled Placeholder Fallback Data When Unconfigured or Empty
The system SHALL serve an explicit `[PLACEHOLDER]` starter dataset tailored for Azis Muhamad Fadli (IT Support, DevOps, and Cloud Engineer) whenever Supabase environment variables are absent or tables return no rows, clearly flagging sample status without fabricating real achievements.

#### Scenario: Site runs locally before Supabase credentials or content exist
- **WHEN** a user runs the application without configured Supabase environment variables or before inserting rows
- **THEN** public pages render complete layout previews using clearly marked `[SAMPLE]` / `[PLACEHOLDER]` entries and zero runtime crashes

### Requirement: Bilingual Optional Translation Fallback Resolution
The system SHALL resolve localized fields (`EN` and `ID`) by returning the requested locale value when populated and falling back automatically to the available non-empty locale value when a translation has not been entered in the CMS.

#### Scenario: Content item exists only in Indonesian while visitor views English
- **WHEN** a visitor selects `EN` and a project or about field only has `ID` text stored
- **THEN** the resolver returns the `ID` text rather than rendering blank content
