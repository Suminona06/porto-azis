# Proposal: Azis Muhamad Fadli Portfolio, Cozy Blog & Supabase CMS

## Why

Azis Muhamad Fadli membutuhkan website portofolio personal yang merepresentasikan kapabilitasnya sebagai **IT Support, DevOps, dan Cloud Engineer** kepada rekruter, partner kerja, dan rekan teknis, sekaligus ruang **Blog** yang nyaman (*cozy*) untuk dokumentasi teknis dan berbagi pengalaman. Karena repositori saat ini masih kosong dan referensi desain ([DESIGN.md](../../design/DESIGN.md) dan folder `design/references/`) sebelumnya memakai identitas serta konten software engineer lain, diperlukan spesifikasi arsitektur yang menyatukan estetika editorial high-contrast tersebut dengan database **Supabase** dan **CMS `/admin` terintegrasi** untuk mengelola Blog, Project, dan konten About.

## Architecture Decision: Single OpenSpec Change with Modular Capability Specs

Perubahan ini disusun dalam **satu OpenSpec change terpadu (`portfolio-cms`)** dengan **lima kapabilitas modular (`specs/<module-id>/spec.md`)** berdasarkan Capability Map berikut:

| Module ID | Responsibility | Depends On |
|---|---|---|
| `design-system-theming` | Token visual Light (default) & Dark toggle, tipografi (`Playfair Display`, `Plus Jakarta Sans`, `JetBrains Mono`), shell navigasi (`HOME`, `ABOUT`, `WORK`, `BLOG`, `EN / ID`, theme toggle), aksesibilitas WCAG AA & keyboard | - |
| `supabase-cms-backend` | Skema Postgres Supabase (`site_profile`, `projects`, `posts`, `about_sections`, `skill_groups`, `activities`), bucket Storage `portfolio-media`, RLS, Supabase Auth admin, serta lapisan data SSR dengan fallback placeholder berlabel jelas | - |
| `public-portfolio` | Halaman publik **Home** (`/`), **About** (`/about`), dan **Work** (`/work`) beserta dukungan `EN / ID`, interaksi marquee, scroll-reveal, circle quote, grayscale-to-color logos, selected work scramble + hover preview, external links, dan accordion/milestones | `design-system-theming`, `supabase-cms-backend` |
| `blog-reading` | Halaman **Blog** (`/blog` dan `/blog/[slug]`) berdesain *cozy* dan nyaman dibaca (mode Read) selaras `DESIGN.md`: filter kategori, status empty/loading/error, kolom baca 65ch, TOC, code block + tombol copy, dan dukungan label bahasa `ID`/`EN` | `design-system-theming`, `supabase-cms-backend` |
| `admin-cms-ui` | Dashboard CMS terintegrasi di `/admin` & `/admin/login` (single-owner Supabase Auth) untuk CRUD Blog (Markdown + live preview + upload sampul), Project, serta profil/narasi/skills/activities About | `design-system-theming`, `supabase-cms-backend` |

**Build Order:** `design-system-theming`, `supabase-cms-backend` -> `public-portfolio`, `blog-reading`, `admin-cms-ui`

Alasan memilih satu OpenSpec change dengan spec modular:
- Proyek ini masih *greenfield* (belum ada `package.json`), sehingga inisialisasi **Astro.js + Tailwind CSS + Supabase + `@astrojs/vercel`** berbagi satu fondasi konfigurasi, middleware, dan deployment.
- Pemecahan ke dalam 5 file `specs/<module-id>/spec.md` tetap menjaga batas tanggung jawab yang tegas, arah dependensi satu arah tanpa siklus, dan kriteria pengujian yang independen per modul.

## What Changes

- **Inisialisasi proyek Astro.js + Tailwind CSS + Supabase**: Konfigurasi SSR/hybrid (`@astrojs/vercel`) untuk deployment ke Vercel.
- **Sistem Desain Dual-Theme (Light Default + Dark Toggle)**: Menerapkan palet `DESIGN.md` (`#ffffff`, `#fafafa`, `#000000`) sebagai default dengan switch penuh ke Dark mode (`#000000`, `#0a0a0a`, `#ffffff`), mengganti seluruh em dash (`—`) dengan koma atau tanda hubung biasa, menjaga kontras teks statis minimal WCAG AA (4.5:1), dan mempertahankan panah `→` pada CTA.
- **Navigasi & Dwibahasa (`EN / ID`)**: Menghapus tombol `API` pada referensi dan menggantinya dengan `BLOG` (desktop navbar & mobile drawer), menyediakan pengalih bahasa `EN / ID` dengan *fallback* konten otomatis jika salah satu terjemahan belum diisi di CMS.
- **Halaman Portofolio Publik (`/`, `/about`, `/work`)**: Mengadaptasi seluruh section referensi untuk profil **Azis Muhamad Fadli** (IT Support, DevOps, Cloud Engineer) dengan tautan project dan tombol kontak (`GET IN TOUCH →` / `CONTACT ME →`) yang langsung mengarah ke URL eksternal.
- **Halaman Blog Cozy (`/blog`, `/blog/[slug]`)**: Dirancang selaras dengan `DESIGN.md` dan prinsip `impeccable` mode Read untuk kenyamanan membaca dokumentasi teknis dan sharing pengalaman.
- **CMS Terintegrasi (`/admin`) + Database Supabase**: Autentikasi single-owner via Supabase Auth, CRUD Blog, Project, dan About/Profile beserta upload media ke Supabase Storage, dengan data awal dummy berlabel jelas (`[PLACEHOLDER]` / `[SAMPLE]`) sebelum diisi oleh pemilik situs.
- **Out of Scope**: Registrasi publik atau multi-user role di CMS, komentar/reaksi pengunjung pada Blog, sistem newsletter, halaman/tombol `API` lama, serta *drag-and-drop visual page builder*.

## Capabilities

### New Capabilities
- `design-system-theming`: Token warna Light/Dark, tipografi, spacing 4px, header/mobile drawer/footer, switcher `EN / ID`, aksesibilitas keyboard & WCAG AA.
- `supabase-cms-backend`: Skema database Supabase, kebijakan RLS, bucket media Storage, sesi Auth admin, query layer SSR, dan fallback seed placeholder.
- `public-portfolio`: Konten dan interaksi halaman Home (`/`), About (`/about`), dan Work (`/work`) dengan tautan eksternal langsung.
- `blog-reading`: Indeks artikel `/blog` dan pembaca dokumentasi `/blog/[slug]` yang *cozy* dan nyaman dibaca.
- `admin-cms-ui`: Antarmuka `/admin/login` dan `/admin` untuk manajemen Blog, Project, dan konten About/Profile.

### Modified Capabilities
- Tidak ada (repositori belum memiliki OpenSpec specs sebelumnya).

## Impact

- **Kode & Struktur Baru**: Membuat seluruh scaffold Astro.js (`package.json`, `astro.config.mjs`, `src/pages/`, `src/components/`, `src/lib/supabase/`, `src/styles/`, `supabase/migrations/`).
- **Dependensi Baru**: `astro`, `@astrojs/vercel`, `@astrojs/tailwind` (atau `@tailwindcss/vite`), `@supabase/supabase-js`, `marked` / `shiki` (untuk render Markdown dokumentasi yang aman dan rapi), serta sanitasi HTML.
- **Environment Variables Vercel & Lokal**: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, dan konfigurasi admin/redirect URL Supabase Auth.

