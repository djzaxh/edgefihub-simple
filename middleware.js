// Vercel Edge Middleware — gates the whole deployment behind Basic Auth so the
// app (and its bundle) is never served to unauthenticated visitors. The password
// lives ONLY in a Vercel server-side env var (SITE_PASSWORD) — never in the client
// bundle or git. Runs at the edge before any static asset is returned.
//
// Setup (Vercel → Project → Settings → Environment Variables):
//   SITE_PASSWORD = <shared password>      (required to enable the gate)
//   SITE_USER     = edgefi                 (optional; defaults to "edgefi")
// Redeploy after setting. Until SITE_PASSWORD is set, the site stays open.

export const config = { matcher: '/(.*)' }

export default function middleware(request) {
  const PASS = process.env.SITE_PASSWORD
  if (!PASS) return // not configured yet — allow through (set SITE_PASSWORD to lock)

  const USER = process.env.SITE_USER || 'edgefi'
  const header = request.headers.get('authorization') || ''
  const [scheme, encoded] = header.split(' ')
  if (scheme === 'Basic' && encoded) {
    const decoded = atob(encoded)
    const i = decoded.indexOf(':')
    const u = decoded.slice(0, i)
    const p = decoded.slice(i + 1)
    if (u === USER && p === PASS) return // authorized — continue to the app
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="edgefi hub — private preview", charset="UTF-8"' },
  })
}
