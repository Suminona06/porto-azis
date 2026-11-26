import type { SupabaseClient } from '@supabase/supabase-js';
import {
  PLACEHOLDER_ABOUT,
  PLACEHOLDER_POSTS,
  PLACEHOLDER_PROJECTS,
  PLACEHOLDER_SITE_PROFILE,
} from '../content/placeholder';
import type {
  AboutBundle,
  AboutSections,
  ActivityItem,
  BlogPost,
  FavoriteTechItem,
  ProjectItem,
  SiteProfile,
  SkillGroup,
  SocialLink,
} from '../content/types';
import {
  sanitizeExternalUrlOrFallback,
  sanitizeMediaUrlOrFallback,
} from '../content/validation';

export interface QueryResult<T> {
  data: T;
  isPlaceholder: boolean;
}

export interface PostsQueryResult {
  posts: BlogPost[];
  isPlaceholder: boolean;
  hasError: boolean;
}

export interface SinglePostResult {
  post: BlogPost | null;
  counterpartSlug: string | null;
  isPlaceholder: boolean;
  hasError: boolean;
}

function normalizeSiteProfile(row: Partial<SiteProfile> | null | undefined): SiteProfile {
  if (!row) return PLACEHOLDER_SITE_PROFILE;

  const favoriteTech: FavoriteTechItem[] = Array.isArray(row.favorite_tech) && row.favorite_tech.length > 0
    ? row.favorite_tech.filter(
        (item): item is FavoriteTechItem =>
          Boolean(item && typeof item.name === 'string' && typeof item.slug === 'string'),
      )
    : PLACEHOLDER_SITE_PROFILE.favorite_tech;

  const socialLinks: SocialLink[] = Array.isArray(row.social_links) && row.social_links.length > 0
    ? row.social_links
        .filter((item): item is SocialLink => Boolean(item && typeof item.label === 'string'))
        .map((item) => ({
          label: item.label,
          url: sanitizeExternalUrlOrFallback(item.url, PLACEHOLDER_SITE_PROFILE.contact_url),
        }))
    : PLACEHOLDER_SITE_PROFILE.social_links;

  return {
    id: row.id ?? 1,
    display_name: row.display_name || PLACEHOLDER_SITE_PROFILE.display_name,
    wordmark: row.wordmark || PLACEHOLDER_SITE_PROFILE.wordmark,
    role_en: row.role_en || PLACEHOLDER_SITE_PROFILE.role_en,
    role_id: row.role_id || '',
    location: row.location || PLACEHOLDER_SITE_PROFILE.location,
    hero_bio_en: row.hero_bio_en || PLACEHOLDER_SITE_PROFILE.hero_bio_en,
    hero_bio_id: row.hero_bio_id || '',
    statement_en: row.statement_en || PLACEHOLDER_SITE_PROFILE.statement_en,
    statement_id: row.statement_id || '',
    marquee_roles:
      Array.isArray(row.marquee_roles) && row.marquee_roles.length > 0
        ? row.marquee_roles
        : PLACEHOLDER_SITE_PROFILE.marquee_roles,
    marquee_stack:
      Array.isArray(row.marquee_stack) && row.marquee_stack.length > 0
        ? row.marquee_stack
        : PLACEHOLDER_SITE_PROFILE.marquee_stack,
    circle_quote_en: row.circle_quote_en || PLACEHOLDER_SITE_PROFILE.circle_quote_en,
    circle_quote_id: row.circle_quote_id || '',
    favorite_tech: favoriteTech,
    contact_url: sanitizeExternalUrlOrFallback(row.contact_url, PLACEHOLDER_SITE_PROFILE.contact_url),
    social_links: socialLinks,
  };
}

function normalizeProject(row: ProjectItem): ProjectItem {
  return {
    ...row,
    tech_stack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    external_url: sanitizeExternalUrlOrFallback(row.external_url, 'https://github.com/'),
    banner_url: sanitizeMediaUrlOrFallback(row.banner_url, '/placeholders/work-placeholder.svg'),
  };
}

function normalizePost(row: BlogPost): BlogPost {
  return {
    ...row,
    language: row.language === 'en' ? 'en' : 'id',
    cover_image_url: row.cover_image_url
      ? sanitizeMediaUrlOrFallback(row.cover_image_url, '')
      : '',
    reading_minutes: Math.max(1, Number(row.reading_minutes) || 1),
  };
}

export async function fetchSiteProfile(
  client: SupabaseClient | null,
): Promise<QueryResult<SiteProfile>> {
  if (!client) {
    return { data: PLACEHOLDER_SITE_PROFILE, isPlaceholder: true };
  }
  try {
    const { data, error } = await client
      .from('site_profile')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return { data: PLACEHOLDER_SITE_PROFILE, isPlaceholder: true };
    }
    return { data: normalizeSiteProfile(data as SiteProfile), isPlaceholder: false };
  } catch {
    return { data: PLACEHOLDER_SITE_PROFILE, isPlaceholder: true };
  }
}

export async function fetchPortfolioProjects(
  client: SupabaseClient | null,
): Promise<QueryResult<ProjectItem[]>> {
  if (!client) {
    return { data: PLACEHOLDER_PROJECTS, isPlaceholder: true };
  }
  try {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return { data: PLACEHOLDER_PROJECTS, isPlaceholder: true };
    }
    return {
      data: (data as ProjectItem[]).map(normalizeProject),
      isPlaceholder: false,
    };
  } catch {
    return { data: PLACEHOLDER_PROJECTS, isPlaceholder: true };
  }
}

export async function fetchAboutData(
  client: SupabaseClient | null,
): Promise<QueryResult<AboutBundle>> {
  if (!client) {
    return { data: PLACEHOLDER_ABOUT, isPlaceholder: true };
  }
  try {
    const [sectionRes, skillsRes, activitiesRes] = await Promise.all([
      client.from('about_sections').select('*').eq('id', 1).maybeSingle(),
      client.from('skill_groups').select('*').order('sort_order', { ascending: true }),
      client.from('activities').select('*').order('sort_order', { ascending: true }),
    ]);

    if (sectionRes.error || !sectionRes.data) {
      return { data: PLACEHOLDER_ABOUT, isPlaceholder: true };
    }

    const rawSections = sectionRes.data as AboutSections;
    const sections: AboutSections = {
      ...rawSections,
      profile_image_url: sanitizeMediaUrlOrFallback(
        rawSections.profile_image_url,
        PLACEHOLDER_ABOUT.sections.profile_image_url,
      ),
      interest_image_url: sanitizeMediaUrlOrFallback(
        rawSections.interest_image_url,
        PLACEHOLDER_ABOUT.sections.interest_image_url,
      ),
    };

    const skillGroups: SkillGroup[] =
      !skillsRes.error && Array.isArray(skillsRes.data) && skillsRes.data.length > 0
        ? (skillsRes.data as SkillGroup[])
        : PLACEHOLDER_ABOUT.skillGroups;

    const activities: ActivityItem[] =
      !activitiesRes.error && Array.isArray(activitiesRes.data) && activitiesRes.data.length > 0
        ? (activitiesRes.data as ActivityItem[]).map((item) => ({
            ...item,
            image_url: sanitizeMediaUrlOrFallback(item.image_url, ''),
          }))
        : PLACEHOLDER_ABOUT.activities;

    return {
      data: { sections, skillGroups, activities },
      isPlaceholder: false,
    };
  } catch {
    return { data: PLACEHOLDER_ABOUT, isPlaceholder: true };
  }
}

export async function fetchPublishedPosts(
  client: SupabaseClient | null,
): Promise<PostsQueryResult> {
  if (!client) {
    return {
      posts: PLACEHOLDER_POSTS,
      isPlaceholder: true,
      hasError: false,
    };
  }
  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      return { posts: [], isPlaceholder: false, hasError: true };
    }
    const posts = Array.isArray(data) ? (data as BlogPost[]).map(normalizePost) : [];
    return { posts, isPlaceholder: false, hasError: false };
  } catch {
    return { posts: [], isPlaceholder: false, hasError: true };
  }
}

export async function fetchPublishedPostBySlug(
  slug: string,
  client: SupabaseClient | null,
): Promise<SinglePostResult> {
  if (!client) {
    const found = PLACEHOLDER_POSTS.find((p) => p.slug === slug && p.published) || null;
    const counterpart =
      found?.translation_group_id
        ? PLACEHOLDER_POSTS.find(
            (p) =>
              p.translation_group_id === found.translation_group_id &&
              p.slug !== found.slug &&
              p.published,
          )?.slug ?? null
        : null;
    return {
      post: found,
      counterpartSlug: counterpart,
      isPlaceholder: true,
      hasError: false,
    };
  }

  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      return { post: null, counterpartSlug: null, isPlaceholder: false, hasError: true };
    }
    if (!data) {
      return { post: null, counterpartSlug: null, isPlaceholder: false, hasError: false };
    }

    const post = normalizePost(data as BlogPost);
    let counterpartSlug: string | null = null;
    if (post.translation_group_id) {
      const { data: sibling } = await client
        .from('posts')
        .select('slug')
        .eq('translation_group_id', post.translation_group_id)
        .eq('published', true)
        .neq('slug', post.slug)
        .limit(1)
        .maybeSingle();
      counterpartSlug = (sibling as { slug?: string } | null)?.slug ?? null;
    }

    return {
      post,
      counterpartSlug,
      isPlaceholder: false,
      hasError: false,
    };
  } catch {
    return { post: null, counterpartSlug: null, isPlaceholder: false, hasError: true };
  }
}

export async function fetchAllPostsForAdmin(
  client: SupabaseClient | null,
): Promise<{ posts: BlogPost[]; hasError: boolean }> {
  if (!client) {
    return { posts: [], hasError: false };
  }
  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) return { posts: [], hasError: true };
    return {
      posts: Array.isArray(data) ? (data as BlogPost[]).map(normalizePost) : [],
      hasError: false,
    };
  } catch {
    return { posts: [], hasError: true };
  }
}

