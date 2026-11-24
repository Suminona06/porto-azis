export type Locale = 'en' | 'id';

export interface UiCopy {
  skipToContent: string;
  navHome: string;
  navAbout: string;
  navWork: string;
  navBlog: string;
  navMenuOpen: string;
  navMenuClose: string;
  navTitle: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  basedIn: string;
  mostFavoriteTech: string;
  selectedWorkHeading: string;
  viewAllWork: string;
  homeCtaTitle: string;
  homeCtaSubtitle: string;
  homeCtaButton: string;
  aboutTagEngineer: string;
  aboutProgressionHeading: string;
  aboutActivitiesHeading: string;
  aboutPersonalInterestHeading: string;
  aboutCtaButton: string;
  worksIndexLabel: string;
  worksPageTitle: string;
  worksTotalCompleted: string;
  worksEngineeringNote: string;
  worksCtaTitle: string;
  blogIndexLabel: string;
  blogPageTitle: string;
  blogPageSubtitle: string;
  blogSearchLabel: string;
  blogSearchPlaceholder: string;
  blogCategoryAll: string;
  blogReadingTimeSuffix: string;
  blogEmptyTitle: string;
  blogEmptyBody: string;
  blogNoMatchTitle: string;
  blogNoMatchBody: string;
  blogResetFilters: string;
  blogErrorTitle: string;
  blogErrorBody: string;
  blogRetry: string;
  blogBackToIndex: string;
  blogTocLabel: string;
  blogCopyCode: string;
  blogCopiedCode: string;
  blogWrittenInIndonesian: string;
  blogWrittenInEnglish: string;
  blogReadTranslation: string;
  blogPrevArticle: string;
  blogNextArticle: string;
  placeholderNotice: string;
  adminLinkLabel: string;
}

const EN_COPY: UiCopy = {
  skipToContent: 'Skip to main content',
  navHome: 'HOME',
  navAbout: 'ABOUT',
  navWork: 'WORK',
  navBlog: 'BLOG',
  navMenuOpen: 'Menu',
  navMenuClose: 'Close menu',
  navTitle: 'NAVIGATION',
  themeLabel: 'Theme',
  themeLight: 'LIGHT',
  themeDark: 'DARK',
  basedIn: 'BASED IN INDONESIA',
  mostFavoriteTech: 'MOST FAVORITE TECH',
  selectedWorkHeading: 'SELECTED WORK',
  viewAllWork: 'VIEW ALL PROJECTS',
  homeCtaTitle: "LET'S HAVE A CHAT",
  homeCtaSubtitle: 'WHETHER IT IS AN INFRASTRUCTURE QUESTION OR A COLLABORATION, MY INBOX IS OPEN.',
  homeCtaButton: 'GET IN TOUCH →',
  aboutTagEngineer: 'ENGINEER',
  aboutProgressionHeading: 'A JOURNEY OF PROGRESSION',
  aboutActivitiesHeading: 'ACTIVITIES & MILESTONES',
  aboutPersonalInterestHeading: 'PERSONAL INTEREST',
  aboutCtaButton: 'CONTACT ME →',
  worksIndexLabel: '/03 WORKS',
  worksPageTitle: 'SELECTED PROJECTS',
  worksTotalCompleted: 'TOTAL PROJECTS LISTED',
  worksEngineeringNote: 'BUILT WITH RELIABLE INFRASTRUCTURE, CLEAN AUTOMATION, AND PRACTICAL OBSERVABILITY.',
  worksCtaTitle: 'HAVE A PROJECT IN MIND?',
  blogIndexLabel: '/04 BLOG',
  blogPageTitle: 'DOCUMENTATION & NOTES',
  blogPageSubtitle: 'Field notes, troubleshooting playbooks, and infrastructure experience.',
  blogSearchLabel: 'Search articles',
  blogSearchPlaceholder: 'Search by topic, service, or error...',
  blogCategoryAll: 'ALL',
  blogReadingTimeSuffix: 'min read',
  blogEmptyTitle: 'No published articles yet',
  blogEmptyBody: 'Documentation and field notes published through the CMS will appear here.',
  blogNoMatchTitle: 'No matching articles',
  blogNoMatchBody: 'Try another keyword or clear the selected category filter.',
  blogResetFilters: 'Reset filters',
  blogErrorTitle: 'Unable to load articles',
  blogErrorBody: 'Check your connection or database status and try loading again.',
  blogRetry: 'Try again',
  blogBackToIndex: 'Back to all notes',
  blogTocLabel: 'On this page',
  blogCopyCode: 'Copy',
  blogCopiedCode: 'Copied',
  blogWrittenInIndonesian: 'This article is written in Indonesian.',
  blogWrittenInEnglish: 'This article is written in English.',
  blogReadTranslation: 'Read English version',
  blogPrevArticle: 'Previous note',
  blogNextArticle: 'Next note',
  placeholderNotice: '[PLACEHOLDER] Sample structure awaiting your real content in /admin.',
  adminLinkLabel: 'CMS',
};

const ID_COPY: UiCopy = {
  skipToContent: 'Lompat ke konten utama',
  navHome: 'BERANDA',
  navAbout: 'TENTANG',
  navWork: 'KARYA',
  navBlog: 'BLOG',
  navMenuOpen: 'Menu',
  navMenuClose: 'Tutup menu',
  navTitle: 'NAVIGASI',
  themeLabel: 'Tema',
  themeLight: 'TERANG',
  themeDark: 'GELAP',
  basedIn: 'BERBASIS DI INDONESIA',
  mostFavoriteTech: 'TEKNOLOGI FAVORIT',
  selectedWorkHeading: 'PROYEK PILIHAN',
  viewAllWork: 'LIHAT SEMUA PROYEK',
  homeCtaTitle: 'MARI BERDISKUSI',
  homeCtaSubtitle: 'BAIK UNTUK DISKUSI INFRASTRUKTUR MAUPUN KOLABORASI KERJA, KOTAK MASUK SAYA TERBUKA.',
  homeCtaButton: 'HUBUNGI SAYA →',
  aboutTagEngineer: 'ENGINEER',
  aboutProgressionHeading: 'PERJALANAN PROGRESI',
  aboutActivitiesHeading: 'AKTIVITAS & PENCAPAIAN',
  aboutPersonalInterestHeading: 'MINAT PRIBADI',
  aboutCtaButton: 'KONTAK SAYA →',
  worksIndexLabel: '/03 KARYA',
  worksPageTitle: 'PROYEK PILIHAN',
  worksTotalCompleted: 'TOTAL PROYEK TERCATAT',
  worksEngineeringNote: 'DIRANCANG DENGAN INFRASTRUKTUR ANDAL, OTOMASI BERSIH, DAN OBSERVABILITAS PRAKTIS.',
  worksCtaTitle: 'PUNYA KEBUTUHAN PROYEK?',
  blogIndexLabel: '/04 BLOG',
  blogPageTitle: 'DOKUMENTASI & CATATAN',
  blogPageSubtitle: 'Catatan lapangan, panduan troubleshooting, dan pengalaman infrastruktur.',
  blogSearchLabel: 'Cari artikel',
  blogSearchPlaceholder: 'Cari topik, layanan, atau catatan...',
  blogCategoryAll: 'SEMUA',
  blogReadingTimeSuffix: 'menit baca',
  blogEmptyTitle: 'Belum ada artikel terbit',
  blogEmptyBody: 'Dokumentasi dan catatan pengalaman yang diterbitkan lewat CMS akan tampil di sini.',
  blogNoMatchTitle: 'Tidak ada artikel yang cocok',
  blogNoMatchBody: 'Coba kata kunci lain atau hapus filter kategori yang aktif.',
  blogResetFilters: 'Reset filter',
  blogErrorTitle: 'Gagal memuat artikel',
  blogErrorBody: 'Periksa koneksi atau status database lalu coba muat ulang.',
  blogRetry: 'Muat ulang',
  blogBackToIndex: 'Kembali ke daftar catatan',
  blogTocLabel: 'Daftar isi',
  blogCopyCode: 'Salin',
  blogCopiedCode: 'Tersalin',
  blogWrittenInIndonesian: 'Artikel ini ditulis dalam Bahasa Indonesia.',
  blogWrittenInEnglish: 'Artikel ini ditulis dalam Bahasa Inggris.',
  blogReadTranslation: 'Baca versi Indonesia',
  blogPrevArticle: 'Catatan sebelumnya',
  blogNextArticle: 'Catatan berikutnya',
  placeholderNotice: '[PLACEHOLDER] Contoh struktur awal menunggu pengisian konten asli Anda di /admin.',
  adminLinkLabel: 'CMS',
};

/** Normalizes query/cookie input into a supported UI locale. */
export function resolveLocale(raw: string | null | undefined): Locale {
  if (!raw) return 'en';
  const normalized = raw.trim().toLowerCase();
  return normalized === 'id' ? 'id' : 'en';
}

/** Resolves localized text and falls back to whichever translation exists. */
export function pickLocale(
  enValue: string | null | undefined,
  idValue: string | null | undefined,
  locale: Locale,
): string {
  const primary = locale === 'id' ? idValue : enValue;
  const fallback = locale === 'id' ? enValue : idValue;
  if (primary && primary.trim().length > 0) return primary.trim();
  if (fallback && fallback.trim().length > 0) return fallback.trim();
  return '';
}

export function getUiCopy(locale: Locale): UiCopy {
  return locale === 'id' ? ID_COPY : EN_COPY;
}

/**
 * Splits a CMS About headline into a 2-line staggered display lockup (`\n`, literal `\n`, or `|`),
 * falling back to `fallbackLine1` / `fallbackLine2` when a legacy single-line bio sentence is stored.
 */
export function splitHeadlineLockup(
  headline: string | null | undefined,
  fallbackLine1: string,
  fallbackLine2: string,
): [string, string] {
  const cleanFallback1 = fallbackLine1.trim().toUpperCase();
  const cleanFallback2 = fallbackLine2.trim().toUpperCase();
  const raw = (headline ?? '').replace(/\\r\\n|\\n/g, '\n').trim();
  if (!raw) {
    return [cleanFallback1, cleanFallback2];
  }

  const explicitParts = raw
    .split(/\r?\n|\|/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (explicitParts.length >= 2) {
    return [explicitParts[0]!.toUpperCase(), explicitParts[1]!.toUpperCase()];
  }

  // Legacy single-line long bio sentences fall back to the concise 2-line display lockup
  // so the About Hero never overlaps the bottom-right monochrome portrait.
  if (raw.length > 48 || raw.includes('[PLACEHOLDER]') || raw.includes('[SAMPLE]')) {
    return [cleanFallback1, cleanFallback2];
  }

  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const splitIdx = Math.ceil(words.length / 2);
    return [
      words.slice(0, splitIdx).join(' ').toUpperCase(),
      words.slice(splitIdx).join(' ').toUpperCase(),
    ];
  }

  return [raw.toUpperCase(), cleanFallback2];
}

/** Splits localized Journey copy into trimmed non-empty paragraphs (normalizing escaped `\n`). */
export function splitJourneyParagraphs(journey: string | null | undefined): string[] {
  return (journey ?? '')
    .replace(/\\r\\n|\\n/g, '\n')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

