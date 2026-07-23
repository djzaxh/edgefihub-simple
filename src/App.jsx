import React, { useEffect, useRef, useState } from 'react'
import {
  NAV, BADGES, CLIENT_KEYS, TECH_KEYS, GRADE_PCT, TICKETS, PEOPLE, PRIOS, TRAINING, LICENSES, initials, firstName,
} from './data.js'
import { Sun, Moon, Help as HelpIcon, Gear, Eye, Check, Dots, Warn, Home, Ticket, Users, Shield, GradCap, CreditCard, Layers, Building, Clipboard, Laptop, Plug, Toggle, Flow } from './icons.jsx'
import { Overview, Tickets, People, Devices, Security, Training, Costs } from './views/ClientViews.jsx'
import { Queue, Customers, Watchtower, Audit, Workflows, Integrations, Capabilities } from './views/TechViews.jsx'
import { KB, KBArticle, Settings } from './views/Help.jsx'
import { Wizard, Manage, Offboard, TicketAction, NewClient } from './components/Modals.jsx'
import Sheet from './components/Sheet.jsx'
import { useIsMobile } from './components/ui.jsx'

// bottom-nav icons + short labels per page
const NAV_ICONS = { overview: Home, tickets: Ticket, people: Users, devices: Laptop, security: Shield, training: GradCap, costs: CreditCard, queue: Layers, customers: Building, remediation: Warn, audit: Clipboard, workflows: Flow, integrations: Plug, capabilities: Toggle }
const NAV_SHORT = { overview: 'Home', tickets: 'Tickets', people: 'People', devices: 'Devices', security: 'Security', training: 'Training', costs: 'Costs', queue: 'Queue', customers: 'Clients', remediation: 'Watchtower', audit: 'Audit', workflows: 'Workflows', integrations: 'Integrations', capabilities: 'Capabilities' }

// Per-role page permissions for client Modes — each role only sees what's relevant.
//   Owner       — full access; general overview + security focus
//   CFO         — costs/value focus; no user management (people)
//   IT Manager  — technical ops: onboarding/offboarding, tickets, security, training, licensing (costs)
//   HR          — simplified: just onboarding/offboarding
const ROLE_PAGES = {
  Owner:        ['overview', 'tickets', 'people', 'devices', 'security', 'training', 'costs'],
  CFO:          ['overview', 'tickets', 'security', 'training', 'costs'],
  'IT Manager': ['overview', 'tickets', 'people', 'devices', 'security', 'training', 'costs'],
  HR:           ['overview', 'people'],
}

const DEFAULT_CATS = [{ id: 'c1', name: 'Workspace' }, { id: 'c2', name: 'Service' }]
const DEFAULT_ORDER = ['overview', 'tickets', 'people', 'devices', 'queue', 'customers', 'workflows', 'remediation', 'security', 'training', 'costs', 'audit', 'integrations', 'capabilities']
const DEFAULT_CFG = {
  overview: { cat: 'c1', show: true }, tickets: { cat: 'c1', show: true }, people: { cat: 'c1', show: true },
  devices: { cat: 'c1', show: true },
  queue: { cat: 'c1', show: true }, customers: { cat: 'c1', show: true }, remediation: { cat: 'c1', show: true },
  workflows: { cat: 'c1', show: true },
  security: { cat: 'c2', show: true }, training: { cat: 'c2', show: true }, costs: { cat: 'c2', show: true },
  audit: { cat: 'c2', show: true }, integrations: { cat: 'c2', show: true }, capabilities: { cat: 'c2', show: true },
}

export default function App() {
  // ---- theme
  const [dark, setDark] = useState(() => localStorage.getItem('edgehub-theme') === 'dark')
  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('dark', dark) // paint the safe-area/canvas bg too
    localStorage.setItem('edgehub-theme', dark ? 'dark' : 'light')
    // tint Safari's top/bottom chrome to the page bg so the toolbar area doesn't
    // show a default light bar under the URL (the "white space" at the bottom)
    let m = document.querySelector('meta[name="theme-color"][data-managed]')
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; m.setAttribute('data-managed', ''); document.head.appendChild(m) }
    m.setAttribute('content', dark ? '#1C1C1C' : '#F5F5F5')
  }, [dark])

  // ---- persona
  const [workspace, setWorkspace] = useState('Technician') // Technician | Client
  const [role, setRole] = useState('Owner')
  const [grade, setGrade] = useState('B+')
  const [imp, setImp] = useState(null)

  // ---- routing
  const [nav, setNav] = useState(null)
  const [navLoading, setNavLoading] = useState(false)
  const [kbArt, setKbArt] = useState(null)

  // ---- data state
  const [tickets, setTickets] = useState(() => TICKETS.map((t) => ({ ...t })))
  const [people, setPeople] = useState(() => PEOPLE.map((p) => ({ ...p })))
  const [search, setSearch] = useState('')
  const [nudged, setNudged] = useState([])
  const [reclaimed, setReclaimed] = useState([])
  const [patched, setPatched] = useState([])

  // ---- settings state
  const [prios, setPrios] = useState(() => PRIOS.map((k) => ({ k, on: true })))
  const [cats, setCats] = useState(DEFAULT_CATS)
  const [itemCfg, setItemCfg] = useState(DEFAULT_CFG)
  const [itemOrder, setItemOrder] = useState(DEFAULT_ORDER)

  // ---- modals
  const [wizard, setWizard] = useState(null)      // {step,type,title} | null
  const [manage, setManage] = useState(null)      // person | null
  const [offboard, setOffboard] = useState(null)  // name | null
  const [ticketAct, setTicketAct] = useState(null)// ticket | null
  const [newClient, setNewClient] = useState(false)

  // ---- mobile
  const isMobile = useIsMobile()
  const [moreOpen, setMoreOpen] = useState(false)

  // ---- toast — type drives a single accent glyph on the ink surface
  const [toastMsg, setToastMsg] = useState(null) // { m, type } | null
  const toastTimer = useRef(null)
  const toast = (m, type = 'success') => {
    setToastMsg({ m, type })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200)
  }

  // ---- derived persona
  const clientMode = workspace === 'Client' || !!imp
  const effRole = imp ? imp.role : role
  const costsAllowed = clientMode && (ROLE_PAGES[effRole] || CLIENT_KEYS).includes('costs')
  const gradePct = GRADE_PCT[grade] ?? 0.78
  const userName = imp ? imp.name : clientMode ? 'Jane Smith' : 'Alex Torres'
  const userFirst = firstName(userName)

  // per-role page permissions: each client role only sees what's relevant to it
  const allowedPages = clientMode ? (ROLE_PAGES[effRole] || CLIENT_KEYS) : TECH_KEYS
  const modeKeys = allowedPages
  const ALWAYS = ['kb', 'kbArticle', 'settings'] // help + settings reachable in any role
  const home = clientMode ? (effRole === 'HR' ? 'people' : 'overview') : 'queue'
  const rawNav = nav || home
  const effNav = ALWAYS.includes(rawNav) || allowedPages.includes(rawNav) ? rawNav : home

  // reset transient route bits when persona OR role changes (a hidden page falls back)
  useEffect(() => { setNav(null); setSearch('') }, [workspace, imp, role])

  const go = (k) => {
    setMoreOpen(false)
    if (k === effNav && !['kb', 'kbArticle', 'settings'].includes(k)) return
    setNavLoading(true)
    setNav(k)
    setTimeout(() => setNavLoading(false), 480)
  }

  // mobile bottom-nav split: up to 4 primary tabs + a "More" tab for the rest
  const primaryTabs = allowedPages.slice(0, 4)
  const moreItems = allowedPages.slice(4)
  const moreActive = !primaryTabs.includes(effNav)

  // ---- sidebar groups
  const visible = (k) => modeKeys.includes(k) && itemCfg[k]?.show
  const groups = cats
    .map((cat) => ({ ...cat, items: itemOrder.filter((k) => visible(k) && itemCfg[k].cat === cat.id) }))
    .filter((g) => g.items.length)

  // ---- ticket actions
  const resolveTicket = (mode) => {
    const t = ticketAct
    const map = { approve: ['Approved', 'prov'], decline: ['Declined', 'err'], answer: ['Answered', 'prov'] }
    const [status, sk] = map[mode]
    setTickets((prev) => prev.map((x) => (x.name === t.name ? { ...x, status, sk, acted: true } : x)))
    toast(mode === 'answer' ? 'Reply sent to edgefi' : `${status} — ${t.name}`, mode === 'decline' ? 'warn' : 'success')
    setTicketAct(null)
  }
  const submitWizard = ({ name, pri }) => {
    setTickets((prev) => [{ name, by: userName, pri, pk: pri === 'High' || pri === 'Urgent' ? 'warn' : 'mut', status: 'Submitted', sk: 'prov', age: 'now' }, ...prev])
    setWizard(null)
    if (clientMode) go('tickets')
    toast('Ticket created — synced to Halo')
  }

  // ---- people actions
  const onManageSave = (newRole) => {
    setPeople((prev) => prev.map((p) => (p.name === manage.name ? { ...p, role: newRole } : p)))
    setManage(null)
    toast('Changes saved — logged to audit trail')
  }
  const confirmOffboard = () => {
    setPeople((prev) => prev.map((p) => (p.name === offboard ? { ...p, status: 'Offboarding', sk: 'prov' } : p)))
    toast(`Offboarding started for ${offboard}`, 'warn')
    setOffboard(null)
  }

  // ---- costs actions
  const reclaim = (title, n) => { setReclaimed((r) => [...r, title]); toast(`Reclaiming ${n} seat(s) — ${title.split(' ')[0]}`) }
  const reclaimAll = () => {
    const idleTitles = LICENSES.filter((l) => l.total > l.used && !reclaimed.includes(l.title)).map((l) => l.title)
    if (!idleTitles.length) return toast('No idle seats to reclaim', 'info')
    setReclaimed((r) => [...new Set([...r, ...idleTitles])])
    toast('Reclaiming all idle seats')
  }

  const openWizard = (initial) => setWizard(initial || { step: 1 })

  // ---- render current view
  const renderView = () => {
    switch (effNav) {
      case 'overview': return <Overview userFirst={userFirst} grade={grade} gradePct={gradePct} prios={prios} costsAllowed={costsAllowed} tickets={tickets} onWizard={() => openWizard()} onTicketAct={setTicketAct} onCustomize={() => go('settings')} />
      case 'tickets': return <Tickets tickets={tickets} onWizard={() => openWizard()} onTicketAct={setTicketAct} />
      case 'people': return <People people={people} search={search} setSearch={setSearch} onManage={setManage} onOnboard={() => openWizard({ step: 2, type: 'Onboard a user', title: 'Onboard a user — ' })} patched={patched} onRequestPatch={(name) => { setPatched((x) => [...x, name]); toast(`Patch requested for ${name}`) }} />
      case 'devices': return <Devices onRequest={() => openWizard({ step: 2, type: 'New device', title: 'New device — ' })} />
      case 'security': return <Security grade={grade} gradePct={gradePct} onExport={() => toast("Security report export started — we'll email it to you")} />
      case 'training': return <Training training={TRAINING} nudged={nudged} onNudge={(n) => { setNudged((x) => [...x, n]); toast(`Reminder sent to ${n}`) }} />
      case 'costs': return costsAllowed ? <Costs reclaimed={reclaimed} onReclaim={reclaim} onReclaimAll={reclaimAll} /> : <Restricted />
      case 'queue': return <Queue onAction={(m) => toast(m)} />
      case 'customers': return <Customers onViewAs={(c) => { setImp({ name: c.admin, role: c.adminRole, company: c.name }); setNav('overview') }} onNewClient={() => setNewClient(true)} />
      case 'workflows': return <Workflows onAction={(m) => toast(m)} />
      case 'remediation': return <Watchtower onFlag={(cta) => toast(`${cta} — queued`)} />
      case 'audit': return <Audit onExport={() => toast('Audit log export started — CSV will download')} />
      case 'integrations': return <Integrations onAction={(m, t) => toast(m, t)} />
      case 'capabilities': return <Capabilities onAction={(m, t) => toast(m, t)} />
      case 'kb': return <KB onArticle={(a) => { setKbArt(a); go('kbArticle') }} onWizard={() => openWizard()} />
      case 'kbArticle': return <KBArticle article={kbArt} onBack={() => go('kb')} onWizard={() => openWizard()} toast={toast} />
      case 'settings': return <Settings clientMode={clientMode} prios={prios} setPrios={setPrios} cats={cats} setCats={setCats} itemCfg={itemCfg} setItemCfg={setItemCfg} itemOrder={itemOrder} setItemOrder={setItemOrder} modeKeys={modeKeys} toast={toast} />
      default: return null
    }
  }

  const logoMark = (
    <img src={dark ? '/logomark-white.png' : '/logomark-black.png'} alt="edgefi"
      width={25} height={25} style={{ objectFit: 'contain', display: 'block' }} />
  )

  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw',
      // mobile scrolls the document (so Safari's chrome collapses and the app
      // fills the viewport); desktop keeps the fixed-height inner-scroll shell
      overflow: isMobile ? 'visible' : 'hidden',
      height: isMobile ? 'auto' : undefined,
      minHeight: isMobile ? '100lvh' : undefined }}>
      {/* impersonation banner */}
      {imp && (
        <div style={{ position: 'sticky', top: 0, zIndex: 60, background: 'var(--purple-soft)', borderBottom: '1px solid var(--purple-soft)', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--purple)', display: 'grid' }}><Eye /></span>
          <span style={{ fontSize: 12.5, color: 'var(--purple-deep)', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <b>{imp.name}</b> · {imp.role} · {imp.company}
          </span>
          <div style={{ flex: 1 }} />
          <button className="btn btn-dark btn-sm" onClick={() => { setImp(null); setNav('customers') }}>Exit view</button>
        </div>
      )}

      {isMobile ? (
        <>
          {/* one bar only: content scrolls full-height; the view's own heading is the
              title (iOS large-title feel), status bar cleared via safe-area inset */}
          <main style={{ flex: 1, minWidth: 0, overflow: 'visible', position: 'relative', background: 'var(--bg)', paddingTop: 'env(safe-area-inset-top)' }}>
            {navLoading && <div style={{ height: 2, position: 'sticky', top: 0, zIndex: 5, overflow: 'hidden' }}><div style={{ position: 'absolute', top: 0, height: '100%', width: '35%', background: 'var(--purple)', animation: 'loadbar .5s ease-out infinite' }} /></div>}
            <div className="content" style={{ padding: '14px 16px calc(env(safe-area-inset-bottom) + 104px)' }}>{renderView()}</div>
          </main>

          {/* the single bar — floating glass pill */}
          <BottomNav items={primaryTabs} effNav={effNav} onGo={go} onMore={() => setMoreOpen(true)} moreActive={moreActive} />

          {/* demo persona control as a floating dot */}
          <DemoFab dark={dark} setDark={setDark} imp={imp}
            onExitImp={() => { setImp(null); setNav('customers') }}
            personaProps={{ workspace, setWorkspace, role, setRole, grade, setGrade, imp, clientMode }} />

          {moreOpen && (
            <MoreSheet moreItems={moreItems} effNav={effNav} onGo={go} onClose={() => setMoreOpen(false)} userName={userName} dark={dark} setDark={setDark} />
          )}
        </>
      ) : (
      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        {/* sidebar */}
        <aside className="sidebar" style={{ width: 232, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '30px 24px 22px', height: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {logoMark}
            <b style={{ fontSize: 17, letterSpacing: '-0.2px', fontWeight: 500 }}>edgefi <span style={{ fontWeight: 700 }}>hub</span></b>
            <div style={{ flex: 1 }} />
            <button className="iconbtn" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button>
          </div>

          <nav style={{ marginTop: 30, display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {groups.map((g) => (
              <div key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 30 }}>
                {g.items.map((k) => {
                  const sel = effNav === k
                  return (
                    <button key={k} onClick={() => go(k)}
                      className={`flex items-center gap-2 -mx-3 px-3 py-2.5 rounded-[10px] border-0 cursor-pointer text-left text-[13.5px] transition-colors ${sel ? 'bg-line-strong' : 'bg-transparent hover:bg-line-strong'}`}>
                      <span className={`flex-1 ${sel ? 'font-semibold text-ink' : 'font-normal text-ink-2'}`}>{NAV[k]}</span>
                      {BADGES[k] && <span className="text-[11px] font-medium text-faint tabular-nums">{BADGES[k]}</span>}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>

          {/* demo persona controls */}
          <PersonaControls {...{ workspace, setWorkspace, role, setRole, grade, setGrade, imp, clientMode }} />

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--line)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, color: 'var(--ink2)', flexShrink: 0 }}>{initials(userName)}</div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 550, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <button className={`iconbtn${effNav === 'kb' || effNav === 'kbArticle' ? ' active' : ''}`} onClick={() => go('kb')} aria-label="Help"><HelpIcon /></button>
            <button className={`iconbtn${effNav === 'settings' ? ' active' : ''}`} onClick={() => go('settings')} aria-label="Settings"><Gear /></button>
          </div>
        </aside>

        {/* main card */}
        <main style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, margin: '12px 12px 12px 0', overflow: 'hidden', position: 'relative' }}>
          {navLoading && (
            <div style={{ height: 2, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, height: '100%', width: '35%', background: 'var(--purple)', animation: 'loadbar .5s ease-out infinite' }} />
            </div>
          )}
          <div className="content" style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '30px 38px 44px' }}>
            {renderView()}
          </div>
        </main>
      </div>
      )}

      {/* modals */}
      {wizard && <Wizard initial={wizard} onClose={() => setWizard(null)} onSubmit={submitWizard} />}
      {manage && <Manage person={manage} onClose={() => setManage(null)} onSave={onManageSave} onOffboard={() => { setOffboard(manage.name); setManage(null) }} />}
      {offboard && <Offboard name={offboard} onClose={() => setOffboard(null)} onConfirm={confirmOffboard} />}
      {ticketAct && <TicketAction ticket={ticketAct} onClose={() => setTicketAct(null)} onResolve={resolveTicket} />}
      {newClient && <NewClient onClose={() => setNewClient(false)} onSubmit={({ company }) => { setNewClient(false); toast(`Onboarding started for ${company}`) }} />}

      {/* toast — ink surface with one semantic accent glyph (bright hues legible on black) */}
      {toastMsg && (() => {
        const TT = {
          success: { color: 'var(--lime)', icon: <Check size={14} sw={3} /> },
          warn:    { color: '#F5B544',     icon: <Warn size={15} sw={2.4} /> },
          err:     { color: '#F87A6E',     icon: <Warn size={15} sw={2.4} /> },
          info:    { color: '#B3B3B3',     icon: <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', display: 'block' }} /> },
        }[toastMsg.type] || { color: 'var(--lime)', icon: <Check size={14} sw={3} /> }
        return (
          <div style={{ position: 'fixed', bottom: isMobile ? 'calc(env(safe-area-inset-bottom) + 90px)' : 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'var(--ink)', color: 'var(--surface)', borderRadius: 10, padding: '11px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 8px 30px rgba(10,10,10,.25)', animation: 'rise .25s cubic-bezier(.2,.8,.2,1) both', maxWidth: 'calc(100vw - 32px)' }}>
            <span style={{ color: TT.color, display: 'grid' }}>{TT.icon}</span>{toastMsg.m}
          </div>
        )
      })()}
    </div>
  )
}

/* -------- Restricted (costs without permission) -------- */
function Restricted() {
  return <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>This section is available to Owner and CFO roles.</div>
}

/* -------- Mobile bottom nav — a floating glass pill with a liquid-glass
   selector you can tap OR drag between tabs -------- */
function BottomNav({ items, effNav, onGo, onMore, moreActive }) {
  const tabs = [
    ...items.map((k) => ({ k, Icon: NAV_ICONS[k] || Home, label: NAV_SHORT[k], active: effNav === k, onClick: () => onGo(k) })),
    { k: '__more', Icon: Dots, label: 'More', active: moreActive, onClick: onMore },
  ]
  const n = tabs.length
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.active))
  const pct = 100 / n
  const trackRef = useRef(null)
  const drag = useRef({ active: false })
  const [dragLeft, setDragLeft] = useState(null) // px while dragging, else null
  const suppressClick = useRef(false)

  const down = (e) => {
    const rect = trackRef.current.getBoundingClientRect()
    drag.current = { active: true, start: e.clientX, left: rect.left, width: rect.width, tw: rect.width / n, moved: false }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {}
  }
  const move = (e) => {
    const d = drag.current
    if (!d.active) return
    if (d.moved || Math.abs(e.clientX - d.start) > 6) {
      d.moved = true
      let x = e.clientX - d.left - d.tw / 2
      x = Math.max(0, Math.min(x, d.width - d.tw))
      setDragLeft(x)
    }
  }
  const up = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    if (d.moved && dragLeft != null) {
      const idx = Math.max(0, Math.min(Math.round(dragLeft / d.tw), n - 1))
      suppressClick.current = true
      setTimeout(() => { suppressClick.current = false }, 60)
      if (!tabs[idx].active) tabs[idx].onClick()
    }
    setDragLeft(null)
  }

  const selStyle = dragLeft != null
    ? { left: dragLeft, width: `${drag.current.tw}px`, transition: 'none' }
    : { left: `${activeIndex * pct}%`, width: `${pct}%`, transition: 'left .38s cubic-bezier(.34,1.35,.5,1)' }

  return (
    <nav className="tabbar-float" style={{ position: 'fixed', left: 14, right: 14, bottom: 'calc(env(safe-area-inset-bottom) + 12px)', zIndex: 90, padding: 6, borderRadius: 34 }}
      onClickCapture={(e) => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation() } }}>
      <div ref={trackRef} style={{ position: 'relative', display: 'flex', alignItems: 'stretch', touchAction: 'none' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="glass-selector" style={{ position: 'absolute', top: 0, bottom: 0, borderRadius: 26, zIndex: 0, cursor: 'grab', ...selStyle }} />
        {tabs.map(({ k, Icon, label, active, onClick }) => (
          <button key={k} onClick={onClick} aria-label={label}
            style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '9px 2px', border: 'none', background: 'none', cursor: 'pointer', color: active ? 'var(--ink)' : 'var(--faint)', transition: 'color .2s ease' }}>
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, letterSpacing: '.01em' }}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

/* -------- Demo persona control as a floating dot -------- */
function DemoFab({ dark, setDark, imp, onExitImp, personaProps }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 96 }} />}
      <div style={{ position: 'fixed', right: 16, bottom: 'calc(env(safe-area-inset-bottom) + 96px)', zIndex: 97, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        {open && (
          <div style={{ width: 232, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, boxShadow: '0 16px 44px rgba(10,10,10,.28)', padding: '14px 16px', animation: 'rise .2s cubic-bezier(.2,.8,.2,1) both' }}>
            <PersonaControls {...personaProps} />
            {imp && (
              <button onClick={() => { onExitImp(); setOpen(false) }} style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} className="btn btn-dark btn-sm">Exit “view as”</button>
            )}
          </div>
        )}
        <button onClick={() => setOpen((o) => !o)} aria-label="Demo controls"
          style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ink)', color: 'var(--surface)', border: 'none', boxShadow: '0 6px 20px rgba(10,10,10,.3)', display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative' }}>
          <Eye size={18} />
          <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)', border: '2px solid var(--ink)' }} />
        </button>
      </div>
    </>
  )
}

/* -------- Mobile "More" bottom sheet (overflow pages + settings + help + theme) -------- */
function MoreSheet({ moreItems, effNav, onGo, onClose, userName, dark, setDark }) {
  const rowStyle = (active) => ({ display: 'flex', alignItems: 'center', gap: 13, width: '100%', padding: '15px 6px', background: 'none', border: 'none', borderBottom: '1px solid var(--line2)', cursor: 'pointer', color: 'var(--ink)', fontSize: 14.5, fontWeight: 500, textAlign: 'left' })
  const item = (label, Icon, onClick, active) => (
    <button onClick={onClick} style={rowStyle(active)}>
      <span style={{ color: active ? 'var(--ink)' : 'var(--faint)', display: 'grid' }}><Icon size={20} /></span>
      <span style={{ flex: 1 }}>{label}</span>
      {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink)' }} />}
    </button>
  )
  return (
    <Sheet onClose={onClose} maxWidth={560}>
      <div style={{ padding: '4px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 6px 14px' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--soft)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>{initials(userName)}</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{userName}</div>
        </div>
        {moreItems.map((k) => item(NAV[k], NAV_ICONS[k] || Home, () => onGo(k), effNav === k))}
        {/* Settings is desktop-only — its only content is sidebar organization, which
            doesn't apply on mobile (no sidebar). */}
        {item('Help center', HelpIcon, () => onGo('kb'), effNav === 'kb' || effNav === 'kbArticle')}
        <button onClick={() => setDark((d) => !d)} style={{ ...rowStyle(false), borderBottom: 'none' }}>
          <span style={{ color: 'var(--faint)', display: 'grid' }}>{dark ? <Sun size={20} /> : <Moon size={20} />}</span>
          <span style={{ flex: 1 }}>{dark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </Sheet>
  )
}

/* -------- Demo persona switcher -------- */
const ROLE_FOCUS = {
  Owner: 'Full access · overview + security',
  CFO: 'Costs & value · no user management',
  'IT Manager': 'Technical ops · onboarding + licensing',
  HR: 'Onboarding / offboarding only',
}

function PersonaControls({ workspace, setWorkspace, role, setRole, grade, setGrade, imp, clientMode }) {
  const sel = { fontSize: 12, padding: '5px 6px', borderRadius: 7, border: '1px solid var(--line)', background: 'var(--soft2)', color: 'var(--ink2)', width: '100%' }
  return (
    <div style={{ borderTop: '1px dashed var(--line)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--faint)' }}>Demo · view as</div>
      <select style={sel} value={workspace} onChange={(e) => setWorkspace(e.target.value)} disabled={!!imp}>
        <option>Technician</option><option>Client</option>
      </select>
      {clientMode && !imp && (
        <select style={sel} value={role} onChange={(e) => setRole(e.target.value)}>
          {['Owner', 'CFO', 'IT Manager', 'HR'].map((r) => <option key={r}>{r}</option>)}
        </select>
      )}
      {clientMode && (
        <div style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.35 }}>{ROLE_FOCUS[imp ? imp.role : role]}</div>
      )}
      {clientMode && (
        <select style={sel} value={grade} onChange={(e) => setGrade(e.target.value)}>
          {['A', 'B+', 'C'].map((g) => <option key={g} value={g}>Grade {g}</option>)}
        </select>
      )}
    </div>
  )
}
