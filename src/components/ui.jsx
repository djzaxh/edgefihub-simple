import React, { useState, useEffect } from 'react'
import { PILL, scoreTone, initials as toInitials, RING_C } from '../data.js'

// True when the viewport is phone-sized. Drives the dedicated mobile layout.
export function useIsMobile(bp = 720) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth <= bp)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp}px)`)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [bp])
  return m
}

// Status tag chip — used sparingly for standalone callouts (not per-row). Carries a
// semantic tint + matching colored border (green/amber/red/purple); 'mut' stays neutral.
export function Pill({ kind = 'mut', children }) {
  const p = PILL[kind] || PILL.mut
  return (
    <span className="pill" style={{ background: p.bg, color: p.fg, border: `1px solid ${p.line}` }}>
      <span className="dot" style={{ background: p.dot, animation: p.pulse ? 'pulse 1.4s infinite' : 'none' }} />
      {children}
    </span>
  )
}

// One-indicator-chip rule: a surface shows at most one chip — the highest-priority
// status. Collect candidates and pick the top; ties keep the first.
export const CHIP_PRIORITY = { err: 4, warn: 3, prov: 2, ok: 1, mut: 0 }
export const pickTopChip = (chips = []) =>
  chips.reduce((top, c) => ((CHIP_PRIORITY[c.kind] ?? 0) > (CHIP_PRIORITY[top?.kind] ?? -1) ? c : top), null)

// Lightweight inline status: a small dot + plain text, no chip background.
// This is what rows in tables/lists use — far calmer than a badge per row.
export function Status({ kind = 'mut', children, muted }) {
  const p = PILL[kind] || PILL.mut
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: muted ? 'var(--muted)' : 'var(--ink2)', whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: p.dot, animation: p.pulse ? 'pulse 1.4s infinite' : 'none' }} />
      {children}
    </span>
  )
}

export function Stat({ n, label, color }) {
  return (
    <div className="stat">
      <div className="stat-n" style={color ? { color } : undefined}>{n}</div>
      <div className="stat-l">{label}</div>
    </div>
  )
}

export function Avatar({ name, size = 34, square = true }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: square ? 8 : '50%',
      background: 'var(--soft)', border: '1px solid var(--line)',
      color: 'var(--ink2)', fontWeight: 600,
      display: 'grid', placeItems: 'center',
      fontSize: size < 30 ? 11 : 13,
    }}>{toInitials(name)}</div>
  )
}

// Section header with an optional right-hand action.
export function ViewHeader({ title, size = 22, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, animation: 'slideUp .3s ease both' }}>
      <h1 className="h1" style={{ fontSize: size }}>{title}</h1>
      {children ? <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>{children}</div> : null}
    </div>
  )
}

export function Card({ title, right, children, style }) {
  return (
    <div className="card" style={{ overflow: 'hidden', animation: 'slideUp .4s ease both', ...style }}>
      {(title || right) && (
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <b style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</b>
          {right ? <div style={{ marginLeft: 'auto' }}>{right}</div> : null}
        </div>
      )}
      {children}
    </div>
  )
}

// The animated security-grade ring.
export function GradeRing({ grade, pct, size = 132, stroke = 9, fontSize = 32 }) {
  const dash = `${(pct * RING_C).toFixed(1)} ${RING_C.toFixed(1)}`
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 120 120" style={{ width: size, height: size, display: 'block' }}>
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line2)" strokeWidth={stroke} />
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--purple)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={dash} transform="rotate(-90 60 60)"
          style={{ animation: 'ringIn 1.2s cubic-bezier(.2,.8,.2,1) both' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize, fontWeight: 700, color: 'var(--purple)' }}>{grade}</div>
    </div>
  )
}

// A thin progress/usage bar — the dumb primitive. Fill color is passed in.
export function Bar({ pct, color = 'var(--ink)', height = 6 }) {
  return (
    <div style={{ flex: 1, height, borderRadius: 3, background: 'var(--line2)', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, animation: 'barIn .9s cubic-bezier(.2,.8,.2,1) both' }} />
    </div>
  )
}

// Semantic health meter — the shared bar used everywhere (security, training, costs).
// Fill color comes from the same tone table as chips/statuses. `tone` may be an explicit
// key ('ok'|'warn'|'err'|'brand'|'neutral'); when omitted it derives from pct (higher = healthier).
const METER_FILL = { brand: 'var(--purple)', neutral: 'var(--muted)' }
export function Meter({ pct, tone, height = 6 }) {
  const key = tone || scoreTone(pct)
  const color = METER_FILL[key] || PILL[key]?.dot || 'var(--ink)'
  return <Bar pct={pct} color={color} height={height} />
}

export const listRowStyle = {
  display: 'flex', alignItems: 'center', gap: 14,
  padding: '15px 24px', borderBottom: '1px solid var(--line2)',
}

// Stacked record card used on mobile in place of a table row.
export const mobileCardStyle = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
  padding: '15px 16px', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 11,
}

// edgefi activity feed — shows automated / edgefi-handled actions.
export function ActivityFeed({ title = 'Recent activity', items, style }) {
  return (
    <Card title={title} style={style}>
      {items.map((a, i) => {
        const auto = a.kind === 'auto'
        return (
          <div key={i} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 24px', borderBottom: '1px solid var(--line2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: auto ? 'var(--purple)' : 'var(--faint)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{a.act}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{a.meta}</div>
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>{auto ? 'Automated' : 'edgefi'}</span>
          </div>
        )
      })}
    </Card>
  )
}

// A tabular chip label (audit "who", etc.)
export function Chip({ children, purple }) {
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 700, letterSpacing: '.04em',
      padding: '2.5px 7px', borderRadius: 5, textTransform: 'uppercase',
      background: purple ? 'var(--purple-soft)' : 'var(--soft)',
      color: purple ? 'var(--purple)' : 'var(--ink2)',
      border: purple ? 'none' : '1px solid var(--line-strong)',
    }}>{children}</span>
  )
}
