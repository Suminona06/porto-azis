import { describe, expect, it } from 'vitest';
import {
  fetchAboutData,
  fetchPortfolioProjects,
  fetchPublishedPostBySlug,
  fetchPublishedPosts,
  fetchSiteProfile,
} from '../../src/lib/supabase/queries';

describe('queries fallback and error handling', () => {
  it('returns Azis placeholder data when Supabase client is unavailable', async () => {
    const profileResult = await fetchSiteProfile(null);
    expect(profileResult.isPlaceholder).toBe(true);
    expect(profileResult.data.display_name).toContain('AZIS');
    expect(profileResult.data.favorite_tech.length).toBeGreaterThanOrEqual(5);

    const projectsResult = await fetchPortfolioProjects(null);
    expect(projectsResult.isPlaceholder).toBe(true);
    expect(projectsResult.data.length).toBeGreaterThan(0);

    const aboutResult = await fetchAboutData(null);
    expect(aboutResult.isPlaceholder).toBe(true);
    expect(aboutResult.data.skillGroups.length).toBeGreaterThan(0);
    expect(aboutResult.data.activities.length).toBeGreaterThan(0);

    const blogResult = await fetchPublishedPosts(null);
    expect(blogResult.isPlaceholder).toBe(true);
    expect(blogResult.hasError).toBe(false);
    expect(blogResult.posts.length).toBeGreaterThan(0);

    const firstSlug = blogResult.posts[0].slug;
    const postResult = await fetchPublishedPostBySlug(firstSlug, null);
    expect(postResult.post?.slug).toBe(firstSlug);
  });

  it('returns empty non-error state when configured Supabase has zero published posts', async () => {
    const mockClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: async () => ({ data: [], error: null }),
          }),
        }),
      }),
    };

    const result = await fetchPublishedPosts(mockClient as never);
    expect(result.isPlaceholder).toBe(false);
    expect(result.hasError).toBe(false);
    expect(result.posts).toEqual([]);
  });

  it('returns error state when configured Supabase query fails', async () => {
    const mockClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: async () => ({ data: null, error: new Error('db connection timeout') }),
          }),
        }),
      }),
    };

    const result = await fetchPublishedPosts(mockClient as never);
    expect(result.isPlaceholder).toBe(false);
    expect(result.hasError).toBe(true);
    expect(result.posts).toEqual([]);
  });
});

