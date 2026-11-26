# Technical Design: Azis Muhamad Fadli Portfolio, Cozy Blog & Supabase CMS

## Context

Repositori ini saat ini masih *greenfield* (belum memiliki `package.json`, `src/`, maupun dependensi runtime) dan hanya menyimpan dokumen arah visual ([DESIGN.md](../../../design/DESIGN.md)), 32 tangkapan layar referensi di `design/references/`, serta konfigurasi OpenSpec ([config.yaml](../../config.yaml)). Lihat [proposal.md](./proposal.md) untuk motivasi bisnis, Capability Map 5 modul, dan batasan *out of scope*.

## Goals / Non-Goals

**Goals:**
- Membangun aplikasi web **Astro.js (SSR) + Tailwind CSS + Supabase** siap deploy ke **Vercel** via `@astrojs/vercel`.
- Menerapkan sistem dual-theme dengan **Light mode sebagai default** (`#ffffff`, `#fafafa`, `#000000`) dan toggle **Dark mode** (`#000000`, `#0a0a0a`, `#ffffff`) tanpa flash saat load (*zero-FOUC*) serta memenuhi kontras minimal WCAG AA (4.5:1) di kedua mode.
- Menyediakan 5 kapabilitas terpisah dengan batas kontrak jelas: `design-system-theming`, `supabase-cms-backend`, `public-portfolio`, `blog-reading`, dan `admin-cms-ui`.
- Menyediakan fallback data `[PLACEHOLDER]` khusus profil **Azis Muhamad Fadli** (IT Support, DevOps, & Cloud Engineer) saat Supabase belum dikonfigurasi atau tabel masih kosong.
- Menghadirkan halaman **Blog** yang *cozy* dan nyaman dibaca (mode Read: kolom 68ch, line-height 1.75, TOC, syntax highlight + tombol Copy).

**Non-Goals:**
- Registrasi pengguna publik, multi-author role, atau komentar pengunjung.
- Analitik kustom, newsletter, atau *drag-and-drop visual builder*.
- Menyimpan aset gambar permanen milik orang lain dari `design/references/`; tahap awal memakai SVG placeholder geometris / berlabel `[SAMPLE]` atau foto yang diunggah lewat `/admin`.

---

## Tech Stack & Dependencies

- **Framework**: Astro (`astro` v5+) dengan SSR (`output: 'server'`) dan adapter `@astrojs/vercel`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` + `@tailwindcss/typography` opsional atau prose styles terkustomisasi token `DESIGN.md`)
- **Database, Auth & Storage**: `@supabase/supabase-js` + helper SSR cookie `@supabase/ssr`
- **Markdown & Syntax Highlighting**: `marked` + `shiki` (server-side highlighting adaptif Light/Dark) + `sanitize-html` (proteksi XSS untuk HTML hasil render Markdown)
- **Font Loading**: Google Fonts (`Playfair Display` 600, `Plus Jakarta Sans` 400 & 600, `JetBrains Mono` 400) dengan `<link rel="preconnect">` dan `font-display: swap`
- **Testing & Quality**: `vitest` (unit tests untuk resolver, sanitizer, validator) + `astro check` + TypeScript (`tsc --noEmit`) + Playwright/Chromium headless verifikasi UI & breakpoints

## Commands

```bash
# Development server (Astro SSR lokal)
npm run dev

# Type-check & Astro diagnostics
npm run check

# Unit tests
npm test

# Production build (Vercel adapter)
npm run build

# Preview production build
npm run preview
```

## Project Structure

```text
src/
  layouts/
    BaseLayout.astro          # Shell HTML, inline anti-FOUC theme script, Navbar, Footer, skip-link
  components/
    layout/
      Navbar.astro            # Header fixed (HOME, ABOUT, WORK, BLOG, EN/ID, Theme toggle) + Mobile drawer
      Footer.astro            # Copyright Azis Muhamad Fadli, jam GMT+7, wordmark "azis", social links
      ThemeToggle.astro       # Toggle Light/Dark + persistensi localStorage & cookie
      LocaleToggle.astro      # Switcher EN / ID
    portfolio/
      HeroSection.astro       # Nama, role, deskripsi singkat, lokasi & jam lokal
      StatementReveal.astro   # Teks scroll-reveal kata per kata (reduced-motion safe)
      TiltedMarquee.astro     # Dual marquee miring (domains serif + stack mono)
      QuoteTechCircle.astro   # Lingkaran motto + grid Most Favorite Tech (grayscale -> color)
      SelectedWorkList.astro  # Daftar proyek bernomor + text scramble + hover banner preview -> external URL
      ContactBanner.astro     # Section penutup CTA (GET IN TOUCH -> / CONTACT ME ->) ke link eksternal
      SkillsAccordion.astro   # Accordion + / - kategori keahlian di /about
      ActivitiesList.astro    # Daftar /01.. Activities & Milestones expandable dengan foto
    blog/
      BlogIndexClient.astro   # Filter kategori, search input berlabel, empty/loading/error states
      BlogToc.astro           # Table of Contents (collapsible di mobile, sticky rail di desktop)
      MarkdownProse.astro     # Renderer kolom baca 68ch + tombol Copy untuk blok kode
    admin/
      AdminShell.astro        # Layout dashboard /admin + tombol Logout + navigasi tab
      PostEditor.astro        # Form CRUD Blog + Markdown live preview + upload cover/inline image
      ProjectManager.astro    # Form CRUD & reorder Project + upload banner
      AboutManager.astro      # Editor Profile, Narrative, Skill Groups, dan Activities
  lib/
    supabase/
      client.ts               # Browser client (jika dibutuhkan upload/interaksi ringan)
      server.ts               # Server SSR client per request menggunakan cookie HTTP-only
      queries.ts              # Query typed dengan fallback otomatis ke placeholder data
    content/
      i18n.ts                 # Kamus UI EN/ID + resolver pickLocale(en, id, activeLocale)
      markdown.ts             # Pipeline marked -> shiki -> sanitize-html + ekstraksi heading untuk TOC
      placeholder.ts          # Data awal berlabel [PLACEHOLDER] untuk Azis (IT Support, DevOps, Cloud)
      validation.ts           # Validasi slug, URL eksternal aman (http/https/mailto), tipe & ukuran upload
  middleware.ts               # Proteksi SSR rute /admin (kecuali /admin/login) & resolve locale/theme
  pages/
    index.astro               # Home (/)
    about.astro               # About (/about)
    work.astro                # Work (/work)
    blog/
      index.astro             # Blog index (/blog)
      [slug].astro            # Blog reader (/blog/[slug])
    admin/
      login.astro             # Single-owner login (/admin/login)
      index.astro             # Redirect atau ringkasan CMS (/admin -> tab Blog/Projects/About)
    api/
      auth/login.ts           # POST login -> set HTTP-only session cookies
      auth/logout.ts          # POST logout -> clear session cookies
      cms/posts.ts            # POST/PUT/DELETE blog posts (auth required)
      cms/projects.ts         # POST/PUT/DELETE/reorder projects (auth required)
      cms/about.ts            # PUT profile/about & CRUD skill_groups/activities (auth required)
      cms/upload.ts           # POST multipart upload ke bucket portfolio-media (auth required)
  styles/
    global.css                # Token CSS Light/Dark, base pointer cursor, focus-visible, utilitas animasi
supabase/
  migrations/
    0001_initial_schema.sql   # DDL 6 tabel, RLS policies, bucket portfolio-media & storage policies
    0002_seed_placeholder.sql # Seed opsional bertanda [SAMPLE] untuk testing awal di Supabase
tests/
  unit/                       # Unit tests vitest (i18n fallback, markdown sanitizer, validation)
```

---

## Visual Direction & Antislop Rationale

### Design Read & Liveliness Dials (`antislop` Part 3)
- **Portfolio Showcase Surfaces (`/`, `/about`, `/work`):**
  > Reading this as: personal engineering showcase for technical recruiters and partners, in a high-contrast Swiss editorial style with Light default and Dark toggle, dial `ENERGY 3 / RHYTHM 3 / MOTION 2`.
- **Blog Reading Surface (`/blog`, `/blog/[slug]`):**
  > Reading this as: technical documentation and experience journal for engineers and hiring managers, in a calm editorial sanctuary aligned with `DESIGN.md`, dial `ENERGY 1 / RHYTHM 2 / MOTION 1`.

### Purpose-Gate Reasons (`antislop` R-31, R-01..R-22)
- **Color Palette (R-01, R-29):** Hanya memakai skala netral high-contrast (`#ffffff`, `#fafafa`, `#000000`, `#09090b`, plus abu-abu terukur WCAG AA untuk teks sekunder) tanpa gradasi dekoratif atau neon, agar tipografi editorial dan konten teknis menjadi fokus utama.
- **Typography (R-06):** `Playfair Display` dipakai pada judul display untuk memberi karakter editorial yang berwibawa; `Plus Jakarta Sans` dipakai untuk keterbacaan UI & artikel panjang; `JetBrains Mono` dibatasi pada metadata teknis, label kategori, dan blok kode agar struktur teknis langsung terbaca.
- **Button Arrows `→` (R-08):** Panah `→` dipertahankan hanya pada CTA aksi eksternal (`GET IN TOUCH →`, `CONTACT ME →`) dan indikator navigasi tujuan untuk memberi petunjuk arah keluar/navigasi, bukan ditempel di semua tombol.
- **Border Radius & Elevation (R-11, R-12):** Elemen struktural memakai sudut tajam (`0px`) dan pemisah hairline (`rgba(0,0,0,0.1)` / `rgba(255,255,255,0.14)`), sedangkan radius penuh (`33554400px`) dikhususkan pada tombol CTA pill dan motif lingkaran motto tanpa `box-shadow` (kedalaman diatur lewat z-index dan kontras permukaan `#ffffff` vs `#fafafa`).
- **Motion (R-19):** Animasi dibatasi pada scroll-reveal manifesto, tilted marquee, grayscale-to-color tech logos, text scramble saat hover project, dan transisi accordion; seluruh animasi non-esensial berhenti di bawah `prefers-reduced-motion: reduce`.
- **Contrast (R-25):** Teks sekunder/metadata menggunakan nilai warna terhitung agar rasio kontras minimal 4.5:1 di Light (`#52525b` pada `#ffffff`/`#fafafa` = 7.0:1+) maupun Dark (`#a1a1aa` pada `#000000`/`#0a0a0a` = 7.5:1+), sedangkan teks redup sementara hanya muncul sebelum terungkap oleh scroll-reveal.

---

## Decisions & Architecture

### 1. Astro SSR (`output: 'server'`) + `@astrojs/vercel`
- **Decision**: Mengaktifkan SSR penuh dengan adapter `@astrojs/vercel` alih-alih static site generation murni.
- **Rationale**: Perubahan konten Blog, Project, dan About dari CMS `/admin` harus langsung tampil tanpa menunggu *rebuild* manual Vercel, sekaligus membutuhkan middleware server-side untuk memeriksa sesi HTTP-only Supabase Auth pada `/admin/*`.
- **Alternatives Considered**: Static Astro + GitHub webhook rebuild saat publish. Ditolak karena latensi 1-2 menit setiap edit konten dan kompleksitas autentikasi client-only.

### 2. Dual-Theme Light Default + Dark Mode Tanpa FOUC
- **Decision**: Mengatur tema lewat atribut `data-theme="light" | "dark"` pada `<html>` yang di-set melalui skrip sinkron kecil di `<head>` (membaca `localStorage.getItem('theme')`, default `'light'`), dengan variabel CSS di `:root` dan `[data-theme="dark"]`.
- **Rationale**: Menjamin default selalu **Light** sesuai instruksi pengguna dan `DESIGN.md`, sekaligus mencegah kedipan gelap/terang saat navigasi atau reload.
- **Alternatives Considered**: `prefers-color-scheme` sebagai default. Ditolak karena pengguna meminta default eksplisit adalah **Light**.

### 3. Blog Cozy Design (`impeccable` Mode Read + `DESIGN.md`)
- **Decision**: Halaman `/blog` memakai struktur indeks editorial yang serasi dengan `/work`, ditambah filter kategori & pencarian berlabel; halaman `/blog/[slug]` memisahkan **frame identitas** (masthead mono, breadcrumb, sticky TOC, prev/next card) dari **kolom baca tenang** (`max-w-[68ch]`, body `17px`–`18px` `Plus Jakarta Sans`, `line-height: 1.75`, code block `JetBrains Mono` dengan tombol Copy + `aria-live`).
- **Rationale**: Menjaga identitas visual yang konsisten dengan `DESIGN.md` namun tetap nyaman (*cozy*) untuk membaca panduan DevOps/Cloud yang panjang dengan skimming cepat via TOC dan salin perintah CLI sekali klik.

### 4. Supabase Data Model & RLS
- **Decision**: Menggunakan 6 tabel relasional dengan RLS aktif di semua tabel:
  1. `site_profile` (`id int primary key default 1`, `display_name`, `wordmark`, `role_en`, `role_id`, `location`, `hero_bio_en`, `hero_bio_id`, `statement_en`, `statement_id`, `marquee_roles`, `marquee_stack`, `circle_quote_en`, `circle_quote_id`, `favorite_tech jsonb`, `contact_url`, `social_links jsonb`, `updated_at`)
  2. `projects` (`id uuid primary key`, `title`, `tech_stack text[]`, `external_url`, `banner_url`, `year`, `featured_on_home boolean`, `sort_order int`, `created_at`, `updated_at`)
  3. `posts` (`id uuid primary key`, `slug text unique`, `title`, `excerpt`, `content_markdown`, `category`, `language text check (language in ('id','en'))`, `translation_group_id uuid null`, `cover_image_url`, `reading_minutes int`, `published boolean`, `published_at`, `created_at`, `updated_at`)
  4. `about_sections` (`id int primary key default 1`, `headline_en`, `headline_id`, `profile_image_url`, `journey_en`, `journey_id`, `philosophy_en`, `philosophy_id`, `interest_en`, `interest_id`, `interest_image_url`, `updated_at`)
  5. `skill_groups` (`id uuid primary key`, `title_en`, `title_id`, `items text[]`, `sort_order int`)
  6. `activities` (`id uuid primary key`, `title_en`, `title_id`, `subtitle_en`, `subtitle_id`, `description_en`, `description_id`, `category`, `location`, `year`, `image_url`, `sort_order int`)
- **Rationale**: Memisahkan `site_profile` & `about_sections` (singleton `id = 1`) dari entitas daftar (`projects`, `posts`, `skill_groups`, `activities`) membuat form `/admin` terstruktur rapi tanpa *over-engineering* EAV.
- **Security**: RLS `SELECT` publik hanya mengizinkan `published = true` pada `posts` dan `SELECT` terbuka pada tabel publik lainnya; seluruh `INSERT`/`UPDATE`/`DELETE` mensyaratkan `auth.role() = 'authenticated'` dan dikonfigurasi agar registrasi user baru dinonaktifkan di Supabase Auth (single owner).

### 5. Bilingual (`EN / ID`) Tanpa Kewajiban Input Ganda di CMS
- **Decision**: UI chrome menggunakan kamus `src/lib/content/i18n.ts` yang dikontrol via query/cookie `locale=en|id` (default `en` atau sesuai pilihan terakhir). Konten CMS bertipe dwibahasa memakai `pickLocale(enVal, idVal, locale)` yang otomatis fallback ke teks non-kosong jika salah satu bahasa belum diisi. Artikel blog memakai satu bahasa utama (`id` atau `en`) dengan lencana bahasa eksplisit dan `translation_group_id` opsional jika pemilik ingin menautkan versi terjemahannya.

---

## Code Style

Contoh pola helper & Astro component yang diikuti seluruh kode:

```ts
// src/lib/content/i18n.ts
export type Locale = 'en' | 'id';

/** Resolves localized text and falls back to whichever translation exists. */
export function pickLocale(
  enValue: string | null | undefined,
  idValue: string | null | undefined,
  locale: Locale,
): string {
  const primary = locale === 'id' ? idValue : enValue;
  const fallback = locale === 'id' ? enValue : idValue;
  return (primary && primary.trim()) || (fallback && fallback.trim()) || '';
}
```

Konvensi:
- TypeScript strict mode (`strict: true`), hindari `any`.
- Tidak ada inline script/event handler yang bergantung pada patch CSS atau string-replace script (`antislop` R-33).
- Gunakan elemen HTML semantik (`<button type="button">` untuk aksi, `<a href>` untuk navigasi, `<label for>` untuk semua input).
- Komentar kode singkat dan menjelaskan alasan non-obvious saja (`antislop-code`).

## Testing Strategy

- **Unit Tests (`vitest`, `tests/unit/`)**:
  - `pickLocale` fallback `EN`/`ID`
  - Pipeline Markdown (`marked` + `shiki` + `sanitize-html`): memastikan `<script>`/event handler berbahaya dibersihkan sambil mempertahankan heading IDs untuk TOC dan blok kode
  - Validasi URL eksternal (`http:`/`https:`/`mailto:` only, menolak `javascript:`), slug generator, dan validasi file upload
- **Static & Build Checks**:
  - `npm run check` (`astro check` + `tsc`)
  - `npm run build` memastikan adapter Vercel dan seluruh halaman SSR terkompilasi tanpa error
- **Browser / Runtime Verification (`antislop` R-35)**:
  - Menjalankan `npm run dev` atau `npm run preview` dan memeriksa dengan headless Chromium pada desktop (`1280px`) & mobile (`375px` & `320px`) dalam mode **Light** dan **Dark**:
    - 0 console errors, 0 horizontal overflow
    - Click-through setiap kontrol: nav links, mobile drawer + `Escape`, theme toggle, `EN / ID` toggle, skill accordion, milestone accordion, blog filter/search + copy code button, dan alur login/validasi `/admin/login`.

## Boundaries

- **Always do:**
  - Jalankan `npm run check`, `npm test`, dan `npm run build` sebelum menyatakan tugas selesai.
  - Gunakan label `[PLACEHOLDER]` / `[SAMPLE]` pada data awal non-aktual milik Azis sebelum diisi melalui CMS.
  - Validasi semua input API CMS di server (`src/pages/api/cms/*`) selain di client, dan verifikasi sesi Supabase SSR pada setiap mutasi.
- **Ask first:**
  - Mengubah skema tabel atau kebijakan RLS setelah migrasi awal diterapkan ke database produksi.
  - Menambah dependensi besar di luar daftar Tech Stack di atas.
- **Never do:**
  - Menyimpan `SUPABASE_SERVICE_ROLE_KEY` atau kredensial rahasia di kode client (`PUBLIC_*`) atau meng-commit file `.env`.
  - Menggunakan karakter em dash (`—`) pada teks antarmuka atau menyematkan statistik/testimoni fiktif tanpa sumber (`antislop` R-02, R-17, R-18).
  - Menjalankan patch script eksternal untuk memodifikasi CSS/komponen (`antislop` R-33).

## Risks / Trade-offs

- **Supabase belum dikonfigurasi saat preview awal** -> Mitigasi: Layer `queries.ts` mendeteksi env yang belum diset atau tabel kosong lalu mengembalikan `placeholder.ts` bertanda `[SAMPLE]`, dan `/admin/login` menampilkan petunjuk konfigurasi env yang jelas alih-alih crash 500.
- **XSS dari input Markdown di CMS atau konten lama** -> Mitigasi: Seluruh HTML hasil `marked` disanitasi di server dengan allowlist ketat sebelum dirender di `/blog/[slug]` dan preview CMS.
- **Perbedaan tema Light default vs screenshot referensi Dark** -> Mitigasi: Memastikan kedua palet (`#ffffff`/`#fafafa` dan `#000000`/`#0a0a0a`) diuji rasio kontrasnya (WCAG AA) dan seluruh elemen (termasuk `tech-logo` invert/brightness dan header border) beradaptasi mulus di kedua tema.
- **Rate limit / cold start SSR di Vercel** -> Mitigasi: Query halaman publik menggunakan header cache ringan (`Cache-Control: public, s-maxage=30, stale-while-revalidate=60` untuk halaman non-admin atau revalidasi saat mutasi) sementara rute `/admin` selalu `no-store`.

