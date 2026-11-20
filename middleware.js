/* Login gate (Vercel Routing Middleware). Runs on Vercel's servers before ANY page or file is sent.
   Only people signed in with Google whose email is in the Supabase `Licenses` table (capital L) for PROGRAM_CODE get through.
   Env vars: SUPABASE_URL, SUPABASE_ANON_KEY (publishable/anon key only — never service_role), PROGRAM_CODE. */
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { next } from '@vercel/functions';
import { loginPage, notSubscribedPage, messagePage } from './auth-pages.js';

const env = k => (process.env[k] || '').trim();
export const norm = s => String(s ?? '').trim().toLowerCase();

// shortcut: approved users are remembered per server instance for 5 min, so removing a customer takes up to 5 min; set to 0 for instant.
const APPROVED_TTL_MS = 5 * 60 * 1000;
const approved = new Map();
const lookups = new Map(); // one license query at a time per user, shared by the ~30 parallel file requests of a page load

// A slow or stuck Supabase should show our error page quickly instead of hanging the browser.
const SUPABASE_TIMEOUT_MS = 8000;
const fetchWithTimeout = (input, init = {}) => {
  const t = AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
  return fetch(input, { ...init, signal: init.signal && AbortSignal.any ? AbortSignal.any([init.signal, t]) : init.signal || t });
};

/** True when one of the user's license rows matches their email and this program (case and spaces ignored). */
export const matchesLicense = (rows, email, code) =>
  !!email && (rows || []).some(r => norm(r.email) === norm(email) && norm(r.program_code) === norm(code));

export default async function middleware(request) {
  const url = new URL(request.url), path = url.pathname;
  const out = new Headers();
  const KEY = env('SUPABASE_ANON_KEY'), CODE = env('PROGRAM_CODE');
  // Keep only https://xxxx.supabase.co even if a longer URL (e.g. .../rest/v1/) was pasted.
  let SUPABASE_URL = '';
  try { SUPABASE_URL = new URL(env('SUPABASE_URL')).origin; } catch { /* invalid URL: fail closed below */ }
  // Fail closed: a missing setting must never open the program.
  if (!SUPABASE_URL || !KEY || !CODE) return html(500, messagePage('الموقع غير مُعدّ بعد', 'Site is not configured yet (missing environment variables).'), out);

  const supabase = createServerClient(SUPABASE_URL, KEY, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll: () => parseCookieHeader(request.headers.get('cookie') ?? ''),
      setAll: (list, headers) => {
        list.forEach(({ name, value, options }) => out.append('Set-Cookie', serializeCookieHeader(name, value, options)));
        Object.entries(headers || {}).forEach(([k, v]) => out.set(k, v));
      },
    },
  });

  if (path === '/auth/login') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${url.origin}/auth/callback`, queryParams: { prompt: 'select_account' } },
    });
    return error || !data?.url ? fail(url, error?.message, out) : redirect(url, data.url, out);
  }
  // Supabase sends people back to /auth/callback, or to the Site URL (any page) when that address isn't allow-listed.
  if (path === '/auth/callback' || url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    if (!code) return fail(url, url.searchParams.get('error_description') || url.searchParams.get('error'), out);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error ? fail(url, error.message, out) : redirect(url, '/', out);
  }
  if (path === '/auth/logout') {
    await supabase.auth.signOut();
    return redirect(url, url.searchParams.has('switch') ? '/auth/login' : '/login', out);
  }

  // Verifies the session token's signature (and refreshes it when it is about to expire).
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const meta = claims?.app_metadata || {};
  const viaGoogle = (meta.providers || [meta.provider]).includes('google');
  const signedIn = !!claims && viaGoogle;

  if (path === '/login') return signedIn ? redirect(url, '/', out) : html(200, loginPage(url.searchParams.get('error')), out);
  if (!signedIn) return redirect(url, '/login', out);

  const email = norm(claims.email), key = `${claims.sub}|${norm(CODE)}`;
  if ((approved.get(key) || 0) < Date.now()) {
    // RLS lets a user read only their own rows, so this returns at most this user's licenses.
    if (!lookups.has(key)) lookups.set(key, Promise.resolve(supabase.from('Licenses').select('email, program_code').abortSignal(AbortSignal.timeout(SUPABASE_TIMEOUT_MS))).finally(() => lookups.delete(key)));
    const { data: rows, error } = await lookups.get(key);
    if (error) return html(503, messagePage('حدث خطأ مؤقت، حاول مرة أخرى بعد قليل.', 'Temporary error, please try again shortly.', [error.code, error.message].filter(Boolean).join(' — ')), out);
    if (!matchesLicense(rows, email, CODE)) return html(403, notSubscribedPage(email, CODE), out);
    approved.set(key, Date.now() + APPROVED_TTL_MS);
  }
  // Let the browser keep program files and re-check them cheaply (304) instead of re-downloading everything each visit.
  // `private` keeps shared caches out; when auth cookies were just set, Supabase's own no-store headers are already in `out`.
  if (!out.has('Cache-Control')) out.set('Cache-Control', 'private, no-cache');
  return next({ headers: out });
}

function redirect(url, to, headers) {
  headers.set('Cache-Control', 'private, no-store');
  headers.set('Location', new URL(to, url).toString());
  return new Response(null, { status: 302, headers });
}
const fail = (url, reason, headers) => redirect(url, '/login?error=' + encodeURIComponent(String(reason || 'unknown').slice(0, 200)), headers);
function html(status, body, headers) {
  headers.set('Cache-Control', 'private, no-store');
  headers.set('Content-Type', 'text/html; charset=utf-8');
  return new Response(body, { status, headers });
}
