export interface FavoriteTechItem {
  name: string;
  slug: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteProfile {
  id: number;
  display_name: string;
  wordmark: string;
  role_en: string;
  role_id: string;
  location: string;
  hero_bio_en: string;
  hero_bio_id: string;
  statement_en: string;
  statement_id: string;
  marquee_roles: string[];
  marquee_stack: string[];
  circle_quote_en: string;
  circle_quote_id: string;
  favorite_tech: FavoriteTechItem[];
  contact_url: string;
  social_links: SocialLink[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tech_stack: string[];
  external_url: string;
  banner_url: string;
  year: string;
  featured_on_home: boolean;
  sort_order: number;
}

export type PostLanguage = 'id' | 'en';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  category: string;
  language: PostLanguage;
  translation_group_id: string | null;
  cover_image_url: string;
  reading_minutes: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface AboutSections {
  id: number;
  headline_en: string;
  headline_id: string;
  profile_image_url: string;
  journey_en: string;
  journey_id: string;
  philosophy_en: string;
  philosophy_id: string;
  interest_en: string;
  interest_id: string;
  interest_image_url: string;
}

export interface SkillGroup {
  id: string;
  title_en: string;
  title_id: string;
  items: string[];
  sort_order: number;
}

export interface ActivityItem {
  id: string;
  title_en: string;
  title_id: string;
  subtitle_en: string;
  subtitle_id: string;
  description_en: string;
  description_id: string;
  category: string;
  location: string;
  year: string;
  image_url: string;
  sort_order: number;
}

export interface AboutBundle {
  sections: AboutSections;
  skillGroups: SkillGroup[];
  activities: ActivityItem[];
}

