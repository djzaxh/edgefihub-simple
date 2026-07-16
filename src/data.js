// ===========================================================================
// EdgeHub mock data + presentation helpers.
// All figures mirror the original EdgeHub design.
// ===========================================================================

// --- pill color kinds -> {fg, bg, pulse} --------------------------------------
export const PILL = {
  ok:   { fg: 'var(--ok)',     bg: 'var(--ok-bg)',     dot: 'var(--ok)',     pulse: false },
  warn: { fg: 'var(--warn)',   bg: 'var(--warn-bg)',   dot: 'var(--warn)',   pulse: false },
  err:  { fg: 'var(--danger)', bg: 'var(--danger-bg)', dot: 'var(--danger)', pulse: false },
  mut:  { fg: 'var(--muted)',  bg: 'var(--soft)',      dot: 'var(--faint)',  pulse: false },
  prov: { fg: 'var(--purple)', bg: 'var(--purple-soft)', dot: 'var(--purple)', pulse: true },
}

export const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const firstName = (name) => name.split(/\s+/)[0]

// --- security grade -> ring fraction -----------------------------------------
export const GRADE_PCT = { A: 0.94, 'B+': 0.78, C: 0.55 }
export const RING_C = 2 * Math.PI * 52 // ~326.73

// --- navigation labels & badges ----------------------------------------------
export const NAV = {
  overview: 'Overview', tickets: 'Tickets', people: 'People',
  security: 'Security', training: 'Security Training', costs: 'Costs',
  queue: 'JML queue', customers: 'Clients', remediation: 'Watchtower', audit: 'Audit log',
}
export const BADGES = { tickets: '7', queue: '7', remediation: '4' }

export const CLIENT_KEYS = ['overview', 'tickets', 'people', 'security', 'training', 'costs']
export const TECH_KEYS = ['queue', 'customers', 'remediation', 'audit']

// --- overview: hero / stat priority values -----------------------------------
export const HERO = (grade) => ({
  'Security score':        { t: 'Security grade', n: grade,    sub: 'Hardening controls',    purple: true },
  'Compliance':            { t: 'Compliance',     n: '96%',    sub: '41 of 43 policies met', purple: false },
  'Open tickets':          { t: 'Open tickets',   n: '7',      sub: '2 waiting on you',      purple: false },
  'Training completion':   { t: 'Training',       n: '84%',    sub: '3 overdue',             purple: false },
  'IT costs / mo':         { t: 'IT costs',       n: '$4,820', sub: '$104 per person',       purple: false },
})

export const CHART = [12, 17, 10, 20, 15, 28, 18, 14]
export const CHART_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']

// --- tickets ------------------------------------------------------------------
export const TICKETS = [
  { name: 'Onboard new hire — Priya Patel', by: 'Jane Smith', pri: 'High',   pk: 'warn', status: 'In progress',    sk: 'prov', age: '1d' },
  { name: 'VPN drops on hotel wifi',         by: 'Marcus Cole', pri: 'Normal', pk: 'mut', status: 'Waiting on you',  sk: 'warn', age: '2d', act: 'answer' },
  { name: 'Access change — finance share',   by: 'Dana Okafor', pri: 'Normal', pk: 'mut', status: 'Needs approval', sk: 'warn', age: '2d', act: 'approve' },
  { name: 'New laptop for design contractor',by: 'Jane Smith',  pri: 'Normal', pk: 'mut', status: 'Ordered',        sk: 'prov', age: '3d' },
  { name: 'Adobe license request',           by: 'Leah Kim',    pri: 'Low',    pk: 'mut', status: 'In progress',    sk: 'prov', age: '4d' },
  { name: 'Printer offline — 2nd floor',     by: 'Front desk',  pri: 'Low',    pk: 'mut', status: 'Scheduled',      sk: 'mut',  age: '5d' },
  { name: 'Mailbox rule audit',              by: 'edgefi (automated)', pri: 'Normal', pk: 'mut', status: 'In progress', sk: 'prov', age: '6d' },
]

// --- people -------------------------------------------------------------------
export const PEOPLE = [
  { name: 'Rachel Kim',  email: 'rachel@acme.co', role: 'Owner',      status: 'Active',        sk: 'ok' },
  { name: 'Morgan Diaz', email: 'morgan@acme.co', role: 'CFO',        status: 'Active',        sk: 'ok' },
  { name: 'Priya Patel', email: 'priya@acme.co',  role: 'Analyst',    status: 'Onboarding',    sk: 'prov' },
  { name: 'Marcus Cole', email: 'marcus@acme.co', role: 'Sales lead', status: 'Active',        sk: 'ok' },
  { name: 'Dana Okafor', email: 'dana@acme.co',   role: 'Finance',    status: 'Active',        sk: 'ok' },
  { name: 'Leah Kim',    email: 'leah@acme.co',   role: 'Designer',   status: 'Active',        sk: 'ok' },
  { name: 'Jonah Weiss', email: 'jonah@acme.co',  role: 'Support',    status: 'Patch overdue', sk: 'warn' },
]

// --- security -----------------------------------------------------------------
export const NIST = [
  { name: 'Identify', score: 92, note: 'Asset inventory current' },
  { name: 'Protect',  score: 71, note: 'MFA gaps on 2 shared accounts' },
  { name: 'Detect',   score: 88, note: 'EDR on all endpoints' },
  { name: 'Respond',  score: 81, note: 'Runbook tested in May' },
  { name: 'Recover',  score: 77, note: 'Backup verify passed Jul 8' },
]

// --- training -----------------------------------------------------------------
export const TRAINING = [
  { name: 'Rachel Kim',  pct: 100, overdue: false },
  { name: 'Morgan Diaz', pct: 100, overdue: false },
  { name: 'Leah Kim',    pct: 92,  overdue: false },
  { name: 'Dana Okafor', pct: 75,  overdue: false },
  { name: 'Marcus Cole', pct: 58,  overdue: true },
  { name: 'Jonah Weiss', pct: 42,  overdue: true },
  { name: 'Priya Patel', pct: 25,  overdue: true },
]

// --- costs / licenses ---------------------------------------------------------
export const LICENSES = [
  { title: 'Microsoft 365 Business Premium', used: 42, total: 46, cost: '$1,012' },
  { title: 'Adobe Creative Cloud',           used: 5,  total: 6,  cost: '$330' },
  { title: 'Slack Business+',                used: 44, total: 44, cost: '$528' },
  { title: 'Zoom Workplace',                 used: 12, total: 15, cost: '$200' },
  { title: 'Figma Professional',             used: 4,  total: 5,  cost: '$60' },
]

// --- knowledge base -----------------------------------------------------------
export const KB_CATS = [
  { name: 'Getting started',  n: 8 },
  { name: 'Devices & access', n: 14 },
  { name: 'Security',         n: 11 },
]
export const KB_ARTICLES = [
  { title: 'Requesting a device for a new hire', cat: 'Devices & access' },
  { title: 'What happens during offboarding',    cat: 'Devices & access' },
  { title: 'Understanding your security grade',  cat: 'Security' },
  { title: 'Setting up MFA on your phone',        cat: 'Security' },
  { title: 'Adding or removing a license',        cat: 'Getting started' },
]

// --- tech: JML queue ----------------------------------------------------------
export const QUEUE = [
  { client: 'Acme Co.',            person: 'Toby Nguyen', type: 'Joiner', stage: 'Device imaging',        handler: 'edgefi',    status: 'In progress',            sk: 'prov', age: '2h' },
  { client: 'Acme Co.',            person: 'Wesley Park', type: 'Leaver', stage: 'Device return & wipe',  handler: 'edgefi',    status: 'Awaiting return',        sk: 'warn', age: '2d' },
  { client: 'Northbank Logistics', person: 'J. Whitcomb', type: 'Joiner', stage: 'Identity provisioned',  handler: 'Automated', status: 'In progress',            sk: 'prov', age: '26m' },
  { client: 'Meridian Law Group',  person: 'P. Ashford',  type: 'Leaver', stage: 'Mailbox delegation',    handler: 'Automated', status: 'In progress',            sk: 'prov', age: '41m' },
  { client: 'Cascade Dental Group',person: 'R. Okafor',   type: 'Joiner', stage: 'Awaiting device order', handler: 'edgefi',    status: 'Blocked · procurement',  sk: 'warn', age: '1d' },
  { client: 'Bluebird Coffee',     person: 'M. Tran',     type: 'Joiner', stage: 'Complete — verifying',  handler: 'Automated', status: 'Finishing',              sk: 'ok',   age: '12m' },
  { client: 'Northbank Logistics', person: 'D. Silva',    type: 'Mover',  stage: 'Access change review',  handler: 'edgefi',    status: 'In review',              sk: 'prov', age: '3h' },
]

// --- tech: clients ------------------------------------------------------------
export const INT_NAMES = ['HaloPSA', 'M365 / Entra', 'Intune', 'NinjaOne', 'CrowdStrike', 'Huntress', 'Phin']
export const CUSTOMERS = [
  { name: 'Acme Co.',                admin: 'Rachel Kim',  adminRole: 'Owner',      users: 48,  plan: 'Resilience Enterprise', grade: 'A-', ints: [1,1,1,1,1,1,1], status: 'Healthy',                    sk: 'ok' },
  { name: 'Cascade Dental Group',    admin: 'Devon Price', adminRole: 'IT Manager', users: 31,  plan: 'Resilience Pro',        grade: 'B+', ints: [1,1,1,1,1,2,1], status: 'Integration error',          sk: 'err' },
  { name: 'Ridgeline Builders',      admin: 'Sofia Marsh', adminRole: 'Owner',      users: 64,  plan: 'Growth',                grade: '—',  ints: [1,1,1,0,0,0,0], status: 'Onboarding · 2 on client',   sk: 'warn' },
  { name: 'Northbank Logistics',     admin: 'Nora Ellis',  adminRole: 'CFO',        users: 112, plan: 'Resilience Enterprise', grade: 'A',  ints: [1,1,1,1,1,1,1], status: 'Healthy',                    sk: 'ok' },
  { name: 'Meridian Law Group',      admin: 'Paul Ashford',adminRole: 'Owner',      users: 22,  plan: 'Resilience Pro',        grade: 'A-', ints: [1,1,1,1,1,1,1], status: 'Healthy',                    sk: 'ok' },
  { name: 'Bluebird Coffee Roasters',admin: 'May Tran',    adminRole: 'HR',         users: 17,  plan: 'Resilience Core',       grade: 'B',  ints: [1,1,1,1,1,1,1], status: 'Healthy',                    sk: 'ok' },
]

// --- tech: watchtower flags ---------------------------------------------------
export const FLAGS = [
  { title: '2 devices behind on patching',              sub: 'Acme Co. · LT-0114, LT-0126 · 40+ days', cta: 'Schedule patch' },
  { title: '3 people overdue on security training',     sub: 'Acme Co. · phishing module · due Jul 1',  cta: 'Send reminder' },
  { title: 'MFA gap on 2 shared accounts',              sub: 'Northbank Logistics · finance mailbox',   cta: 'Enforce MFA' },
  { title: 'Integration error — CrowdStrike',           sub: 'Vertex Health · token expired 6h ago',    cta: 'Reconnect' },
]

// --- tech: audit log ----------------------------------------------------------
export const AUDIT = [
  { time: 'Today · 9:41 AM',   who: 'Tony',   act: 'Connected Huntress integration for Ridgeline Builders',              why: 'New client onboarding · step 2 of 4' },
  { time: 'Today · 8:16 AM',   who: 'system', act: 'Nightly contract sync — 12 clients, 0 drift between hub and HaloPSA', why: 'Automated · hub is the record, Halo executes billing' },
  { time: 'Today · 8:15 AM',   who: 'system', act: 'Nightly RBAC policy sync completed — 12 clients, 0 drift detected',   why: 'Automated · policies match API enforcement' },
  { time: 'Yesterday · 4:02 PM', who: 'Noah', act: 'Invited Sam Osei (HR) to Acme Co. portal',                           why: 'Client request via HALO-4790' },
  { time: 'Yesterday · 1:30 PM', who: 'Tony', act: 'Reset Morgan Diaz to CFO default modules at Acme Co.',               why: 'Cleanup — override no longer needed' },
  { time: 'Mon · 10:12 AM',    who: 'Alvin',  act: 'Rotated CrowdStrike API credentials — all clients',                  why: 'Scheduled 90-day rotation' },
]

// --- wizard -------------------------------------------------------------------
export const WIZ_TYPES = [
  { name: 'Onboard a user',      sub: 'New hire setup, accounts, and devices' },
  { name: 'Offboard a user',     sub: 'Revoke access and reclaim assets' },
  { name: 'New software / license', sub: 'Request or reassign a license' },
  { name: 'New device',          sub: 'Laptop, phone, or peripheral' },
  { name: 'Access change',       sub: 'Permissions, shares, or groups' },
  { name: 'Something is broken', sub: 'Report an issue' },
]
export const WIZ_PRIOS = ['Whenever', 'Normal', 'Urgent']

// --- activity feeds (fill the overview / security pages) ----------------------
export const ACTIVITY = [
  { act: 'Provisioned M365 license for Sam Reyes', meta: 'Today, 9:41 AM · completed in 4 min', kind: 'auto' },
  { act: 'Quarantined phishing email for 6 inboxes', meta: 'Yesterday, 3:12 PM',              kind: 'auto' },
  { act: 'Replaced failing SSD on LT-0093',          meta: 'Jul 12 · ticket #4811 closed',      kind: 'edge' },
  { act: 'Offboarding for T. Nguyen completed',      meta: 'Jul 10 · 14 steps, all verified',   kind: 'edge' },
]
export const SEC_ACTIVITY = [
  { act: 'MFA enforced on 3 new accounts',            meta: 'Today, 7:20 AM',              kind: 'auto' },
  { act: 'Patched 12 endpoints — Chrome CVE',         meta: 'Yesterday · all verified',    kind: 'edge' },
  { act: 'EDR full scan completed — 0 detections',    meta: 'Jul 14 · CrowdStrike',        kind: 'auto' },
  { act: 'Backup restore test passed — 2.1 TB',       meta: 'Jul 8 · verified',            kind: 'edge' },
]

// --- settings: priorities -----------------------------------------------------
export const PRIOS = ['Security score', 'Compliance', 'Open tickets', 'Training completion', 'IT costs / mo']
