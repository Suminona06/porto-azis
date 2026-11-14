import { defineMiddleware } from 'astro:middleware';
import { resolveLocale } from './lib/content/i18n';
import { createSupabaseServerClient, getAuthenticatedUser } from './lib/supabase/server';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const queryLang = url.searchParams.get('lang');
  const cookieLocale = context.cookies.get('locale')?.value;

  const activeLocale = queryLang
    ? resolveLocale(queryLang)
    : resolveLocale(cookieLocale);

  context.locals.locale = activeLocale;

  if (queryLang === 'en' || queryLang === 'id') {
    context.cookies.set('locale', activeLocale, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const pathname = url.pathname;
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  if (isAdminPage && !isLoginPage) {
    const supabase = createSupabaseServerClient(context.request, context.cookies);
    const user = await getAuthenticatedUser(supabase);
    context.locals.user = user;

    if (!user) {
      return context.redirect('/admin/login', 302);
    }
  } else if (isLoginPage) {
    const supabase = createSupabaseServerClient(context.request, context.cookies);
    context.locals.user = await getAuthenticatedUser(supabase);
  } else {
    context.locals.user = null;
  }

  const response = await next();
  if (isAdminPage) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
});

