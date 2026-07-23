// Vercel Edge Middleware — gates the whole deployment behind a branded edgefi
// login page. No backend and no secret in the client bundle: the password lives
// only in the SITE_PASSWORD env var (server-side), and the session cookie is an
// HMAC of it (unforgeable without the password). Runs at the edge before the app.
//
// Setup (Vercel → Project → Settings → Environment Variables):
//   SITE_PASSWORD = <shared password>   (required to enable the gate)
// Redeploy after setting. Until SITE_PASSWORD is set, the site stays open.

export const config = { matcher: '/(.*)' } // runs on every path; the POST /__login submit is handled below

const COOKIE = 'ehub_session'
const enc = new TextEncoder()

async function sessionToken(pass) {
  const key = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('edgefi-hub-session-v1'))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readCookie(header, name) {
  return (header || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(name + '='))?.slice(name.length + 1)
}

export default async function middleware(request) {
  const PASS = process.env.SITE_PASSWORD
  if (!PASS) return // gate disabled until SITE_PASSWORD is set

  const expected = await sessionToken(PASS)
  if (readCookie(request.headers.get('cookie'), COOKIE) === expected) return // authenticated

  const url = new URL(request.url)

  // handle the login form submit
  if (request.method === 'POST' && url.pathname === '/__login') {
    const form = await request.formData()
    if ((form.get('password') || '') === PASS) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': `${COOKIE}=${expected}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
        },
      })
    }
    return html(loginPage(true), 401)
  }

  // everything else while unauthenticated → show the login page
  return html(loginPage(false), 200)
}

function html(body, status) {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}

function loginPage(error) {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<title>edgefi hub — private preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  :root{--bg:#F5F5F5;--surface:#FFF;--ink:#0A0A0A;--ink2:#404040;--muted:#6B6B6B;--faint:#979797;--line:#E9E9E9;--line-strong:#DDD;--lime:#C4F63A}
  @media (prefers-color-scheme:dark){:root{--bg:#1C1C1C;--surface:#121212;--ink:#F2F2F2;--ink2:#CFCFCF;--muted:#9C9C9C;--faint:#707070;--line:#2B2B2B;--line-strong:#3D3D3D}}
  *{box-sizing:border-box}
  body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;background:var(--bg);color:var(--ink);
    font-family:'Poppins','Segoe UI',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .card{width:100%;max-width:380px;background:var(--surface);border:1px solid var(--line);border-radius:16px;
    box-shadow:0 12px 48px rgba(10,10,10,.10),0 0 0 1px rgba(10,10,10,.03);padding:30px 28px}
  .brand{display:flex;align-items:center;gap:8px;font-size:19px;letter-spacing:-.2px}
  .brand b{font-weight:700}.brand span{font-weight:500}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--lime);margin-left:2px}
  .ey{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--faint);margin:18px 0 6px}
  h1{font-size:20px;font-weight:600;letter-spacing:-.3px;margin:0 0 4px}
  p.sub{font-size:13px;color:var(--muted);margin:0 0 20px;line-height:1.5}
  label{display:block;font-size:12.5px;font-weight:600;color:var(--ink2);margin-bottom:6px}
  input{width:100%;padding:12px 13px;border:1px solid var(--line-strong);border-radius:9px;font-size:14px;
    font-family:inherit;color:var(--ink);background:var(--surface);outline:none;transition:border-color .18s}
  input:focus{border-color:var(--ink)}
  button{width:100%;margin-top:16px;padding:12px;border:0;border-radius:9px;background:var(--ink);color:var(--surface);
    font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:opacity .15s}
  button:hover{opacity:.88}
  .err{margin-top:12px;font-size:12.5px;color:#B42318;font-weight:500}
  @media (prefers-color-scheme:dark){.err{color:#F26D5F}}
  .foot{margin-top:18px;font-size:11.5px;color:var(--faint);text-align:center}
</style></head><body>
  <form class="card" method="POST" action="/__login">
    <div class="brand"><span>edgefi</span><b>hub</b><span class="dot"></span></div>
    <div class="ey">Private preview</div>
    <h1>Sign in to continue</h1>
    <p class="sub">This preview is limited to the edgefi team. Enter the access password to continue.</p>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" autofocus required placeholder="••••••••"/>
    ${error ? '<div class="err">Incorrect password — try again.</div>' : ''}
    <button type="submit">Enter</button>
    <div class="foot">edgefi hub · confidential</div>
  </form>
</body></html>`
}
