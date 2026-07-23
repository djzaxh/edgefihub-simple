import React, { useState } from 'react'
import { NAV, CUSTOMERS, TICKETS, INT_NAMES, firstName } from '../data.js'
import { Status } from '../components/ui.jsx'

// small sliders glyph for the Filter control
const Sliders = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
    <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="14" cy="18" r="2" />
  </svg>
)

const badgePill = (label, tone) => (
  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 7, color: tone.fg, background: tone.bg }}>{label}</span>
)
const TONES = {
  ink: { fg: 'var(--surface)', bg: 'var(--ink)' },
  warn: { fg: 'var(--warn)', bg: 'var(--warn-bg)' },
  err: { fg: 'var(--danger)', bg: 'var(--danger-bg)' },
  mut: { fg: 'var(--muted)', bg: 'var(--soft)' },
}

export default function DashboardHome({ groups, go, clientMode, userFirst, onWizard, onNewClient }) {
  const [scope, setScope] = useState('all')
  const [sort, setSort] = useState('recent')

  // cards: clients for the team view, tickets for the client view
  const cards = clientMode
    ? TICKETS.slice(0, 6).map((t, i) => ({
        key: t.name,
        badge: t.act && !t.acted ? ['Needs you', TONES.warn] : i < 2 ? ['New', TONES.ink] : null,
        metric: t.pri, title: t.name, sub: `${t.by} · ${t.age} ago`, status: t.status, sk: t.sk,
        preview: { kind: 'ticket', pri: t.pri, pk: t.pk },
      }))
    : CUSTOMERS.map((c) => ({
        key: c.name,
        badge: c.sk === 'err' ? ['Attention', TONES.err] : c.sk === 'warn' ? ['Onboarding', TONES.warn] : ['Healthy', TONES.mut],
        metric: c.grade, title: c.name, sub: `${c.admin} · ${c.adminRole}`, status: c.status, sk: c.sk,
        preview: { kind: 'client', ints: c.ints, users: c.users },
      }))

  const scopeCards = scope === 'attention' ? cards.filter((c) => c.sk === 'err' || c.sk === 'warn') : cards

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', padding: '30px 40px 56px', animation: 'slideUp .3s ease both' }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 30, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 27, fontWeight: 600, letterSpacing: '-.6px', margin: 0 }}>Welcome{userFirst ? `, ${userFirst}` : ''}</h1>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '5px 0 0' }}>Everything edgefi is handling for you, in one place.</p>
        </div>
        {clientMode
          ? <button className="btn btn-dark" onClick={onWizard}>Ask for Help</button>
          : <button className="btn btn-dark" onClick={onNewClient}>New client</button>}
      </div>

      {/* category-menu columns */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(groups.length, 1)}, minmax(0,1fr))`, gap: '10px 40px', marginBottom: 46 }}>
        {groups.map((g) => (
          <div key={g.id}>
            <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 15 }}>{g.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {g.items.map((k) => (
                <button key={k} className="megalink" onClick={() => go(k)}>{NAV[k]}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* filter / segment row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 22, flexWrap: 'wrap' }}>
        <div className="glass-soft" style={{ display: 'inline-flex', padding: 4, borderRadius: 999, border: '1px solid var(--line)' }}>
          {[['all', 'All'], ['attention', 'Needs attention']].map(([v, l]) => (
            <button key={v} onClick={() => setScope(v)} style={{ padding: '6px 14px', fontSize: 13, borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: scope === v ? 600 : 500, color: scope === v ? 'var(--ink)' : 'var(--muted)', background: scope === v ? 'var(--surface)' : 'transparent', boxShadow: scope === v ? '0 1px 4px rgba(10,10,10,.10)' : 'none', transition: 'all .15s ease' }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {[['recent', 'Latest'], ['active', 'Most active'], ['flagged', 'Flagged']].map(([v, l]) => (
            <button key={v} onClick={() => setSort(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, padding: '2px 0 4px', color: sort === v ? 'var(--ink)' : 'var(--muted)', fontWeight: sort === v ? 600 : 400, borderBottom: sort === v ? '1.5px solid var(--ink)' : '1.5px solid transparent' }}>{l}</button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', gap: 7 }}><Sliders /> Filter</button>
      </div>

      {/* card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {scopeCards.map((c) => (
          <div key={c.key} className="glass glass-hover" style={{ border: '1px solid var(--line)', borderRadius: 18, padding: 20, cursor: 'pointer' }}
            onClick={() => go(clientMode ? 'tickets' : 'customers')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, minHeight: 24 }}>
              {c.badge ? badgePill(c.badge[0], c.badge[1]) : <span />}
              <span style={{ fontSize: c.preview.kind === 'client' ? 22 : 13, fontWeight: c.preview.kind === 'client' ? 700 : 600, letterSpacing: c.preview.kind === 'client' ? '-.5px' : 0, color: c.preview.kind === 'client' ? 'var(--ink)' : 'var(--muted)' }}>{c.metric}{c.preview.kind === 'ticket' ? ' priority' : ''}</span>
            </div>
            {/* preview panel */}
            <div className="glass-soft" style={{ border: '1px solid var(--line2)', borderRadius: 12, height: 96, marginBottom: 15, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
              {c.preview.kind === 'client' ? (
                <>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {c.preview.ints.map((v, j) => (
                      <span key={j} title={INT_NAMES[j]} style={{ width: 9, height: 9, borderRadius: '50%', background: v === 1 ? 'var(--faint)' : v === 2 ? 'var(--danger)' : 'var(--line-strong)' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.preview.users} users under management</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)' }}>Priority</div>
                  <div style={{ height: 5, borderRadius: 3, background: 'var(--soft)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: c.preview.pri === 'High' || c.preview.pri === 'Urgent' ? '90%' : c.preview.pri === 'Normal' ? '55%' : '25%', background: c.preview.pk === 'warn' ? 'var(--warn)' : 'var(--purple)' }} />
                  </div>
                </>
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.sub}</div>
            <div style={{ marginTop: 12 }}><Status kind={c.sk}>{c.status}</Status></div>
          </div>
        ))}
      </div>
    </div>
  )
}
