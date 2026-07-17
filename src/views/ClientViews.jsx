import React, { useState } from 'react'
import {
  HERO, CHART, CHART_LABELS, NIST, LICENSES, ACTIVITY, SEC_ACTIVITY, PILL,
} from '../data.js'
import { Pill, Status, Stat, Avatar, ViewHeader, Card, GradeRing, Meter, ActivityFeed, listRowStyle, mobileCardStyle, useIsMobile } from '../components/ui.jsx'
import { Search } from '../icons.jsx'

/* ---------------------------------------------------------------- Overview */
export function Overview({ userFirst, grade, gradePct, prios, costsAllowed, tickets, onWizard, onTicketAct }) {
  const [hot, setHot] = useState(null)
  const heroMap = HERO(grade)
  const enabled = prios.filter((p) => p.on && (p.k !== 'IT costs / mo' || costsAllowed))
  const heroCards = enabled.slice(0, 2).map((p) => heroMap[p.k])
  const attention = tickets.filter((t) => t.act && !t.acted).map((t) => ({
    title: `${t.act === 'approve' ? 'Approve' : 'Answer'}: ${t.name}`,
    sub: `From ${t.by} · ${t.age} ago`,
    cta: t.act === 'approve' ? 'Review' : 'Answer',
    t,
  }))
  const max = Math.max(...CHART)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 26px', flexWrap: 'wrap', animation: 'slideUp .3s ease both' }}>
        <h1 className="h1" style={{ fontSize: 24 }}>Welcome, {userFirst}</h1>
        <button className="btn btn-dark" style={{ marginLeft: 'auto' }} onClick={onWizard}>Ask for Help</button>
      </div>

      <div className="ov-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 20, animation: 'slideUp .35s ease both' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {heroCards.map((c, i) => (
            <div key={i} className="card" style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.t}</div>
              <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-1.5px', margin: '8px 0 2px', fontVariantNumeric: 'tabular-nums', color: c.purple ? 'var(--purple)' : 'var(--ink)' }}>{c.n}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Actions handled</div>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-1.5px', margin: '8px 0 2px', color: 'var(--purple)', fontVariantNumeric: 'tabular-nums' }}>142</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>by edgefi, automatically</div>
          <div style={{ flex: 1, minHeight: 140, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            {CHART.map((v, i) => {
              const isHot = hot === i
              const isPeak = hot === null && v === max
              const color = isHot || isPeak ? 'var(--purple)' : 'var(--purple-soft)'
              const dim = hot !== null && !isHot
              return (
                <div key={i} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}
                  style={{ flex: 1, height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  {isHot && <span style={{ background: 'var(--ink)', color: 'var(--surface)', fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', animation: 'slideUp .18s ease both' }}>{v} actions</span>}
                  <div style={{ width: '100%', height: `${Math.round(v / max * 100)}%`, background: color, borderRadius: 4, opacity: dim ? 0.45 : 1, transition: 'opacity .15s ease, background .15s ease', animation: 'barIn .8s cubic-bezier(.2,.8,.2,1) both' }} />
                  <span style={{ fontSize: 10, color: 'var(--faint)' }}>{CHART_LABELS[i]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {attention.length > 0 && (
        <div className="card" style={{ marginTop: 18, animation: 'slideUp .4s ease both' }}>
          <div style={{ padding: '18px 28px 10px', fontSize: 13.5, fontWeight: 600 }}>Needs your attention</div>
          {attention.map((a, i) => (
            <div key={i} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 28px', borderTop: '1px solid var(--line2)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 13.5, fontWeight: 550, display: 'block' }}>{a.title}</b>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{a.sub}</span>
              </div>
              <button className="btn btn-dark btn-sm" onClick={() => onTicketAct(a.t)}>{a.cta}</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <ActivityFeed title="Handled by edgefi" items={ACTIVITY} />
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Tickets */
export function Tickets({ tickets, onWizard, onTicketAct }) {
  const isMobile = useIsMobile()
  return (
    <>
      <ViewHeader title="Tickets">
        <button className="btn btn-dark" onClick={onWizard}>Request service</button>
      </ViewHeader>
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n="7" label="Open" /><Stat n="2.1d" label="Avg. age" /><Stat n="31" label="Resolved" color="var(--ok)" />
      </div>

      {isMobile ? (
        <div>
          {tickets.map((t, i) => (
            <div key={i} style={mobileCardStyle}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{t.by} · {t.age}</div>
                </div>
                {t.act && !t.acted && <button className="btn btn-dark btn-sm" style={{ flexShrink: 0 }} onClick={() => onTicketAct(t)}>{t.act === 'approve' ? 'Approve' : 'Answer'}</button>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Status kind={t.sk}>{t.status}</Status>
                <span style={{ fontSize: 12, color: t.pk === 'warn' ? 'var(--ink2)' : 'var(--muted)' }}>{t.pri} priority</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead><tr>{['Ticket', 'Requested by', 'Priority', 'Status', '', 'Age'].map((h, i) => (
              <th key={i} style={{ textAlign: i === 5 ? 'right' : 'left', fontSize: 12, fontWeight: 500, color: 'var(--muted)', padding: '16px 28px', borderBottom: '1px solid var(--line2)' }}>{h}</th>
            ))}</tr></thead>
            <tbody>
              {tickets.map((t, i) => (
                <tr key={i}>
                  <td style={cell(true)}>{t.name}</td>
                  <td style={{ ...cell(), color: 'var(--ink2)' }}>{t.by}</td>
                  <td style={{ ...cell(), color: t.pk === 'warn' ? 'var(--ink2)' : 'var(--muted)' }}>{t.pri}</td>
                  <td style={cell()}><Status kind={t.sk}>{t.status}</Status></td>
                  <td style={{ ...cell(), textAlign: 'right' }}>
                    {t.act && !t.acted && (
                      <button className="btn btn-dark btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => onTicketAct(t)}>
                        {t.act === 'approve' ? 'Approve' : 'Answer'}
                      </button>
                    )}
                  </td>
                  <td style={{ ...cell(), textAlign: 'right', color: 'var(--muted)', fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{t.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}
    </>
  )
}
const cell = (bold) => ({ padding: '17px 28px', borderBottom: '1px solid var(--line2)', fontSize: 13.5, fontWeight: bold ? 550 : 400 })

/* ---------------------------------------------------------------- People */
export function People({ people, search, setSearch, onManage, onOnboard }) {
  const isMobile = useIsMobile()
  const q = search.trim().toLowerCase()
  const filtered = people.filter((p) => !q || `${p.name} ${p.role} ${p.email}`.toLowerCase().includes(q))
  return (
    <>
      <ViewHeader title="People">
        <button className="btn btn-dark" onClick={onOnboard}>Onboard a user</button>
      </ViewHeader>
      <input className="input" style={{ maxWidth: 420, marginBottom: 18 }} value={search}
        onChange={(e) => setSearch(e.target.value)} placeholder="Search people" />
      <Card>
        {filtered.map((p, i) => (
          <div key={i} className="row-hover" style={{ ...listRowStyle, padding: isMobile ? '13px 16px' : listRowStyle.padding }}>
            <Avatar name={p.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 550, display: 'flex', alignItems: 'center', gap: 7 }}>
                {isMobile && <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: (PILL[p.sk] || PILL.mut).dot }} />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isMobile ? p.role : `${p.role} · ${p.email}`}</div>
            </div>
            {!isMobile && <Status kind={p.sk}>{p.status}</Status>}
            <button className="btn btn-ghost btn-sm" onClick={() => onManage(p)}>Manage</button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', padding: 14, fontStyle: 'italic' }}>No people match that search</div>}
      </Card>
    </>
  )
}

/* ---------------------------------------------------------------- Security */
export function Security({ grade, gradePct, onExport }) {
  return (
    <>
      <ViewHeader title="Security">
        <button className="btn btn-ghost" onClick={onExport}>Export report</button>
      </ViewHeader>
      <Card style={{ marginBottom: 18 }}>
        <div style={{ padding: 22, display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          <GradeRing grade={grade} pct={gradePct} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <b style={{ fontSize: 16, fontWeight: 600 }}>Security posture grade</b>
              <Pill kind="prov">Hardening controls</Pill>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Pill kind="warn">MFA · 2 accounts</Pill>
              <Pill kind="warn">Patching · 2 devices</Pill>
            </div>
          </div>
        </div>
      </Card>
      <div className="nist-grid" style={{ display: 'grid', gap: 14 }}>
        {NIST.map((w, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--faint)' }}>{w.name}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{w.score}</div>
            <div style={{ marginTop: 10 }}><Meter pct={w.score} height={4} /></div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 9, lineHeight: 1.45 }}>{w.note}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        <ActivityFeed title="Recent security activity" items={SEC_ACTIVITY} />
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Training */
export function Training({ training, nudged, onNudge }) {
  const isMobile = useIsMobile()
  return (
    <>
      <ViewHeader title="Security Training" />
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n="84%" label="Overall completion" color="var(--ok)" />
        <Stat n="3" label="Overdue" color="var(--warn)" />
        <Stat n="12" label="Modules assigned" />
      </div>
      <Card title="People">
        {training.map((u, i) => {
          const done = u.pct === 100
          const isNudged = nudged.includes(u.name)
          const rightZone = (
            <>
              {done && <Status kind="ok">Complete</Status>}
              {!done && u.overdue && !isNudged && (
                <button className="btn btn-dark btn-sm" onClick={() => onNudge(u.name)}>Nudge</button>
              )}
              {isNudged && <Status kind="mut" muted>Nudged ✓</Status>}
            </>
          )
          if (isMobile) {
            return (
              <div key={i} className="row-hover" style={{ ...listRowStyle, flexWrap: 'wrap', padding: '13px 16px' }}>
                <Avatar name={u.name} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 550 }}>{u.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{rightZone}</div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Meter pct={u.pct} />
                  <div style={{ width: 40, fontSize: 12.5, color: 'var(--ink2)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{u.pct}%</div>
                </div>
              </div>
            )
          }
          return (
            <div key={i} className="row-hover" style={listRowStyle}>
              <Avatar name={u.name} />
              <div style={{ width: 170, fontSize: 13.5, fontWeight: 550 }}>{u.name}</div>
              <Meter pct={u.pct} />
              <div style={{ width: 44, fontSize: 12.5, color: 'var(--ink2)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{u.pct}%</div>
              <div style={{ width: 150, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                {rightZone}
              </div>
            </div>
          )
        })}
      </Card>
    </>
  )
}

/* ---------------------------------------------------------------- Costs */
export function Costs({ reclaimed, onReclaim, onReclaimAll }) {
  const isMobile = useIsMobile()
  const rows = LICENSES.map((l) => ({ ...l, unused: reclaimed.includes(l.title) ? 0 : l.total - l.used }))
  const idleTotal = rows.reduce((s, l) => s + l.unused, 0)
  const reclaimBtn = (l) => l.unused > 0
    ? <button className="btn btn-ghost" style={{ padding: '5px 11px', fontSize: 11.5, borderRadius: 7, fontWeight: 550, whiteSpace: 'nowrap' }} onClick={() => onReclaim(l.title, l.unused)}>Reclaim {l.unused} idle</button>
    : reclaimed.includes(l.title) ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', animation: 'slideUp .25s ease both' }}>✓ Reclaimed</span> : null
  return (
    <>
      <ViewHeader title="Costs" />
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n="$4,820" label="IT costs / mo" />
        <Stat n="$104" label="Per person / mo" />
        <Stat n={idleTotal} label="Idle licenses" color={idleTotal > 0 ? 'var(--warn)' : undefined} />
      </div>
      <Card title="Licenses by title" right={idleTotal > 0 ? <button className="btn btn-dark btn-sm" onClick={onReclaimAll}>Reclaim {idleTotal}</button> : null}>
        {rows.map((l, i) => {
          if (isMobile) {
            return (
              <div key={i} className="row-hover" style={{ ...listRowStyle, flexWrap: 'wrap', padding: '13px 16px' }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 550 }}>{l.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{l.cost}/mo</div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Meter pct={Math.round(l.used / l.total * 100)} />
                  <div style={{ fontSize: 12, color: 'var(--ink2)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{l.used}/{l.total}</div>
                  {reclaimBtn(l)}
                </div>
              </div>
            )
          }
          return (
            <div key={i} className="row-hover" style={listRowStyle}>
              <div style={{ width: 220, fontSize: 13.5, fontWeight: 550 }}>{l.title}</div>
              <Meter pct={Math.round(l.used / l.total * 100)} />
              <div style={{ width: 70, fontSize: 12.5, color: 'var(--ink2)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{l.used} / {l.total}</div>
              <div style={{ width: 64, fontSize: 12.5, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{l.cost}</div>
              <div style={{ width: 112, display: 'flex', justifyContent: 'flex-end' }}>{reclaimBtn(l)}</div>
            </div>
          )
        })}
      </Card>
    </>
  )
}
