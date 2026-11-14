import type { APIRoute } from 'astro';
import { isSafeExternalUrl, isSafeMediaUrl } from '../../../lib/content/validation';
import { jsonResponse, requireCmsAuth } from '../../../lib/supabase/cmsAuth';

export const prerender = false;

function toStringArray(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const [profileRes, aboutRes, skillsRes, activitiesRes] = await Promise.all([
    auth.supabase.from('site_profile').select('*').eq('id', 1).maybeSingle(),
    auth.supabase.from('about_sections').select('*').eq('id', 1).maybeSingle(),
    auth.supabase.from('skill_groups').select('*').order('sort_order', { ascending: true }),
    auth.supabase.from('activities').select('*').order('sort_order', { ascending: true }),
  ]);

  return jsonResponse({
    profile: profileRes.data,
    about: aboutRes.data,
    skillGroups: skillsRes.data ?? [],
    activities: activitiesRes.data ?? [],
  });
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.action !== 'string') {
    return jsonResponse({ error: 'Invalid payload action.' }, 400);
  }

  if (body.action === 'update_profile') {
    const contact_url = typeof body.contact_url === 'string' ? body.contact_url.trim() : '';
    if (!isSafeExternalUrl(contact_url)) {
      return jsonResponse({ error: 'Contact URL must use https, http, or mailto:.' }, 400);
    }

    const socialLinksRaw = Array.isArray(body.social_links) ? body.social_links : [];
    const social_links = [];
    for (const item of socialLinksRaw) {
      if (item && typeof item.label === 'string' && typeof item.url === 'string') {
        if (!isSafeExternalUrl(item.url)) {
          return jsonResponse({ error: `Unsafe social link URL for ${item.label}.` }, 400);
        }
        social_links.push({ label: item.label.trim(), url: item.url.trim() });
      }
    }

    const row = {
      id: 1,
      display_name: String(body.display_name || 'AZIS MUHAMAD FADLI').trim(),
      wordmark: String(body.wordmark || 'azis').trim(),
      role_en: String(body.role_en || '').trim(),
      role_id: String(body.role_id || '').trim(),
      location: String(body.location || 'INDONESIA').trim(),
      hero_bio_en: String(body.hero_bio_en || '').trim(),
      hero_bio_id: String(body.hero_bio_id || '').trim(),
      statement_en: String(body.statement_en || '').trim(),
      statement_id: String(body.statement_id || '').trim(),
      marquee_roles: toStringArray(body.marquee_roles),
      marquee_stack: toStringArray(body.marquee_stack),
      circle_quote_en: String(body.circle_quote_en || '').trim(),
      circle_quote_id: String(body.circle_quote_id || '').trim(),
      favorite_tech: Array.isArray(body.favorite_tech) ? body.favorite_tech : [],
      contact_url,
      social_links,
    };

    const { data, error } = await auth.supabase
      .from('site_profile')
      .upsert(row)
      .select('*')
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ profile: data });
  }

  if (body.action === 'update_about') {
    const profile_image_url = String(body.profile_image_url || '').trim();
    const interest_image_url = String(body.interest_image_url || '').trim();
    if (profile_image_url && !isSafeMediaUrl(profile_image_url)) {
      return jsonResponse({ error: 'Invalid profile image URL.' }, 400);
    }
    if (interest_image_url && !isSafeMediaUrl(interest_image_url)) {
      return jsonResponse({ error: 'Invalid interest image URL.' }, 400);
    }

    const row = {
      id: 1,
      headline_en: String(body.headline_en || '').trim(),
      headline_id: String(body.headline_id || '').trim(),
      profile_image_url,
      journey_en: String(body.journey_en || '').trim(),
      journey_id: String(body.journey_id || '').trim(),
      philosophy_en: String(body.philosophy_en || '').trim(),
      philosophy_id: String(body.philosophy_id || '').trim(),
      interest_en: String(body.interest_en || '').trim(),
      interest_id: String(body.interest_id || '').trim(),
      interest_image_url,
    };

    const { data, error } = await auth.supabase
      .from('about_sections')
      .upsert(row)
      .select('*')
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ about: data });
  }

  if (body.action === 'upsert_skill_group') {
    const title_en = String(body.title_en || '').trim();
    if (!title_en) return jsonResponse({ error: 'Skill group title is required.' }, 400);
    const id = typeof body.id === 'string' && body.id.trim() ? body.id.trim() : undefined;
    const payload = {
      ...(id ? { id } : {}),
      title_en,
      title_id: String(body.title_id || '').trim(),
      items: toStringArray(body.items),
      sort_order: Number(body.sort_order) || 0,
    };

    const { data, error } = await auth.supabase
      .from('skill_groups')
      .upsert(payload)
      .select('*')
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ skillGroup: data });
  }

  if (body.action === 'upsert_activity') {
    const title_en = String(body.title_en || '').trim();
    const image_url = String(body.image_url || '').trim();
    if (!title_en) return jsonResponse({ error: 'Activity title is required.' }, 400);
    if (image_url && !isSafeMediaUrl(image_url)) {
      return jsonResponse({ error: 'Invalid activity image URL.' }, 400);
    }
    const id = typeof body.id === 'string' && body.id.trim() ? body.id.trim() : undefined;
    const payload = {
      ...(id ? { id } : {}),
      title_en,
      title_id: String(body.title_id || '').trim(),
      subtitle_en: String(body.subtitle_en || '').trim(),
      subtitle_id: String(body.subtitle_id || '').trim(),
      description_en: String(body.description_en || '').trim(),
      description_id: String(body.description_id || '').trim(),
      category: String(body.category || 'Milestone').trim(),
      location: String(body.location || '').trim(),
      year: String(body.year || '').trim(),
      image_url,
      sort_order: Number(body.sort_order) || 0,
    };

    const { data, error } = await auth.supabase
      .from('activities')
      .upsert(payload)
      .select('*')
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ activity: data });
  }

  return jsonResponse({ error: 'Unsupported CMS action.' }, 400);
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const entity = body.entity;
  if (!id || (entity !== 'skill_group' && entity !== 'activity')) {
    return jsonResponse({ error: 'Entity type and id are required.' }, 400);
  }

  const table = entity === 'skill_group' ? 'skill_groups' : 'activities';
  const { error } = await auth.supabase.from(table).delete().eq('id', id);
  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ ok: true });
};

