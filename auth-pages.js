/* HTML for the login-gate pages (Arabic first, right-to-left, with English underneath). Used by middleware.js. */
const WHATSAPP = '201002152024'; // +20 100 215 2024, digits only for wa.me

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const shell = (title, body) => `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title}</title>
<style>
:root{--bg:#f4f2fb;--card:#fff;--ink:#1d1b3a;--muted:#6b6890;--brand:#5b3fd6;--line:#e6e2f5}
@media (prefers-color-scheme:dark){:root{--bg:#14131f;--card:#1f1d2e;--ink:#f1effa;--muted:#a7a3c4;--brand:#8f7bff;--line:#2e2b44}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:16px;background:var(--bg);color:var(--ink);
  font:16px/1.6 "Segoe UI",Tahoma,"Noto Sans Arabic",Arial,sans-serif}
.card{width:100%;max-width:420px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:32px 24px;text-align:center;box-shadow:0 10px 30px rgba(40,20,120,.08)}
.ic{font-size:44px;line-height:1}
h1{font-size:22px;margin:12px 0 4px}
p{margin:0 0 6px;color:var(--muted)}
.en{direction:ltr;font-size:14px}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:48px;margin-top:14px;padding:10px 16px;border-radius:12px;
  font-weight:600;font-size:16px;font-family:inherit;text-decoration:none;border:1px solid var(--line);color:var(--ink);background:var(--card)}
.btn:focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.btn.main{background:var(--brand);border-color:var(--brand);color:#fff}
.btn.wa{background:#1fa855;border-color:#1fa855;color:#fff}
.btn small{font-weight:400;opacity:.85}
.who{direction:ltr;display:inline-block;margin:10px 0 4px;padding:4px 12px;border-radius:999px;background:var(--bg);font-size:14px;word-break:break-all}
.err{color:#c0392b}
</style></head><body><main class="card">${body}</main></body></html>`;

const G = '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z"/></svg>';

export const loginPage = reason => shell('تسجيل الدخول | Sign in', `
  <div class="ic" aria-hidden="true">🔒</div>
  <h1>تسجيل الدخول</h1>
  <p>سجّل الدخول بحساب Gmail المُسجَّل في اشتراكك.</p>
  <p class="en">Sign in with the Gmail account on your subscription.</p>
  ${reason ? `<p class="err" role="alert">تعذّر تسجيل الدخول، حاول مرة أخرى. <span class="en">Sign-in failed, please try again.</span><br><small class="en">${esc(reason)}</small></p>` : ''}
  <a class="btn main" href="/auth/login">${G}<span>الدخول بحساب Google <small>· Sign in with Google</small></span></a>`);

export const notSubscribedPage = (email, code) => {
  const msg = `مرحبًا، أريد الاشتراك في البرنامج ${code}\nHello, I'd like to subscribe to ${code}\nEmail: ${email}`;
  return shell('غير مشترك | Not subscribed', `
  <div class="ic" aria-hidden="true">✋</div>
  <h1>أنت غير مشترك في هذا البرنامج</h1>
  <p class="en">You're not subscribed to this program.</p>
  <span class="who">${esc(email)}</span>
  <p>للاشتراك تواصل معنا على واتساب، أو سجّل الدخول بحساب آخر.</p>
  <a class="btn wa" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">💬 <span>تواصل عبر واتساب <small>· WhatsApp us</small></span></a>
  <a class="btn" href="/auth/logout?switch=1">🔄 <span>الدخول بحساب آخر <small>· Use a different account</small></span></a>`);
};

export const messagePage = (ar, en, detail) => shell('تنبيه | Notice', `
  <div class="ic" aria-hidden="true">⚠️</div><h1>${esc(ar)}</h1><p class="en">${esc(en)}</p>
  ${detail ? `<p class="en"><small>${esc(detail)}</small></p>` : ''}
  <a class="btn" href="/">إعادة المحاولة <small>· Try again</small></a>`);
