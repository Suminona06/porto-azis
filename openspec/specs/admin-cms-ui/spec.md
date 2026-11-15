# admin-cms-ui Specification

## Purpose

Defines the integrated single-owner CMS interface under /admin for authenticating via Supabase Auth and creating, editing, ordering, and publishing Blog posts, Projects, and About/Profile content without modifying source code.

## Requirements

### Requirement: Single-Owner Admin Login and Session Controls
The system SHALL provide an accessible `/admin/login` form (email and password with explicit `<label>` elements, inline validation, loading indicator, and error alert) plus a sign-out button inside `/admin`, disallowing public account registration.

#### Scenario: Owner logs in with valid credentials
- **WHEN** the owner submits valid email and password on `/admin/login`
- **THEN** the system establishes an authenticated SSR session and navigates to `/admin`

#### Scenario: Invalid credentials show accessible error feedback
- **WHEN** an invalid email or password is submitted on `/admin/login`
- **THEN** the form preserves entered email, disables double-submit during loading, and announces a clear error message without revealing internal details

### Requirement: Blog Article Management with Markdown Editor and Live Preview
The system SHALL enable the authenticated owner on `/admin` to list all draft and published posts, create new posts, edit existing posts (`title`, `slug`, `language`, `category`, `excerpt`, `content_markdown`, `cover_image_url`, `published`), toggle live Markdown preview, upload cover or inline images to `portfolio-media`, and delete posts with confirmation.

#### Scenario: Owner writes and publishes a new blog article
- **WHEN** the owner completes required post fields, previews Markdown, uploads a cover image, sets status to Published, and saves
- **THEN** the article is stored in Supabase `posts`, immediately visible at `/blog` and `/blog/[slug]`, and shows a confirmation status banner

#### Scenario: Empty or invalid post form prevents save
- **WHEN** the owner submits a post form with missing title, slug, or content
- **THEN** inline field errors identify the missing fields and focus moves to the first invalid field

### Requirement: Project Showcase Management and Ordering
The system SHALL enable the authenticated owner on `/admin` to create, edit, reorder (via accessible up/down buttons or numeric sort order), toggle `featured_on_home`, upload preview banner images to `portfolio-media`, validate external URLs, and delete items in `projects`.

#### Scenario: Owner adds and features a new project
- **WHEN** the owner saves a new project with title, tech stack tags, external URL, year, and `featured_on_home = true`
- **THEN** the project appears in the Home Selected Work list and `/work` page ordered by `sort_order`

### Requirement: About and Site Profile Management
The system SHALL enable the authenticated owner on `/admin` to update `site_profile` (display name, role, location, hero bio, circular quote, favorite tech stack, contact/social external links, footer wordmark), `about_sections` (progression narrative, engineering statement, personal interest + photos), `skill_groups` (accordion categories and items), and `activities` (milestones with photo, category, year, location).

#### Scenario: Owner updates About narrative and adds a milestone
- **WHEN** the owner edits an About narrative field or creates a new `activities` record with uploaded photo and saves
- **THEN** `/about` reflects the updated narrative and displays the new expandable milestone entry

### Requirement: Admin Dashboard Resilience and UI States
The system SHALL present explicit empty states with primary creation actions, visible loading feedback during save/upload/delete requests, confirmation dialogs (`Escape` closable) before destructive deletes, and clear error banners across every `/admin` tab on both desktop and mobile viewports.

#### Scenario: Destructive delete requires keyboard-accessible confirmation
- **WHEN** the owner clicks Delete on a blog post, project, skill group, or milestone
- **THEN** a keyboard-trapped modal dialog asks for confirmation, closes on `Escape` or Cancel without deleting, and deletes only upon confirm
