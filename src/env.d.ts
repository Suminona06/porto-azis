/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    locale: import('./lib/content/i18n').Locale;
    user: { id: string; email?: string } | null;
  }
}
