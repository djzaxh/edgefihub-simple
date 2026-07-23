import React, { useState } from 'react'
import { QUEUE, CUSTOMERS, INT_NAMES, FLAGS, AUDIT, firstName } from '../data.js'
import { Status, Stat, ViewHeader, Card, listRowStyle, mobileCardStyle, useIsMobile, Chip } from '../components/ui.jsx'
import Drawer, { DrawerField } from '../components/Drawer.jsx'
import { Warn, Check } from '../icons.jsx'

// integration status dot (shared by the Clients table + its detail drawer)
const intDot = (v) => ({ width: 9, height: 9, borderRadius: '50%', background: v === 1 ? 'var(--faint)' : v === 2 ? 'var(--danger)' : 'var(--line-strong)' })
const intLabel = (v) => (v === 1 ? 'Connected' : v === 2 ? 'Error' : 'Not connected')

const cell = (bold) => ({ padding: '17px 28px', borderBottom: '1px solid var(--line2)', fontSize: 13.5, fontWeight: bold ? 550 : 400, verticalAlign: 'middle' })
const th = (align = 'left') => ({ textAlign: align, fontSize: 12, fontWeight: 500, color: 'var(--muted)', padding: '16px 28px', borderBottom: '1px solid var(--line2)' })

const datePill = (text) => (
  <span style={{ background: 'var(--soft)', color: 'var(--muted)', fontSize: 11.5, fontWeight: 600, padding: '5px 11px', borderRadius: 7 }}>{text}</span>
)

// contextual verb per JML stage/status (T1 — the Watchtower verb-on-item pattern)
const STAGE_VERB = { 'Blocked · procurement': 'Nudge vendor', 'Awaiting return': 'Send reminder', 'In review': 'Review now' }

// a small "Queued ✓" confirmation chip after an action fires (T4 — optimistic feedback)
const QueuedChip = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: 'var(--ok)', whiteSpace: 'nowrap', animation: 'slideUp .25s ease both' }}>
    <Check size={12} sw={2.5} /> Queued
  </span>
)

/* ---------------------------------------------------------------- JML queue */
export function Queue({ onAction }) {
  const isMobile = useIsMobile()
  const [done, setDone] = useState([])
  const [detail, setDetail] = useState(null)
  const open = QUEUE.filter((q) => q.sk !== 'ok').length
  const blocked = QUEUE.filter((q) => q.sk === 'warn').length
  // T6 — surface blocked work: sort blocked rows to the top
  const rows = QUEUE.map((q, i) => ({ ...q, _i: i })).sort((a, b) => (b.sk === 'warn') - (a.sk === 'warn'))
  const act = (q) => { setDone((d) => [...d, q._i]); onAction && onAction(`${STAGE_VERB[q.status]} — ${q.person}`) }
  const rowAction = (q, mobile) => {
    const verb = STAGE_VERB[q.status]
    if (!verb) return null
    if (done.includes(q._i)) return <QueuedChip />
    return <button className="btn btn-dark btn-sm" style={{ whiteSpace: 'nowrap', ...(mobile ? { alignSelf: 'flex-start' } : {}) }} onClick={(e) => { e.stopPropagation(); act(q) }}>{verb}</button>
  }
  const stop = (fn) => (e) => { e.stopPropagation(); fn() }

  return (
    <>
      <ViewHeader title="JML queue">{datePill('Tuesday, Jul 15')}</ViewHeader>
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n={open} label="In flight" />
        <Stat n={blocked} label="Blocked" color={blocked > 0 ? 'var(--warn)' : undefined} />
        <Stat n="3" label="Fully automated" />
        <Stat n="12" label="Clients" />
      </div>
      {isMobile ? (
        <div>
          {rows.map((q) => (
            <div key={q._i} className="row-hover" style={{ ...mobileCardStyle, cursor: 'pointer' }} onClick={() => setDetail(q)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{q.type} — {q.person}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{q.client}</div>
                </div>
                <span style={{ fontSize: 12, color: q.sk === 'warn' ? 'var(--warn)' : 'var(--faint)', fontWeight: q.sk === 'warn' ? 600 : 400, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{q.age}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <Status kind={q.sk}>{q.status}</Status>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{q.handler}</span>
              </div>
              <div style={{ fontSize: 12, color: q.sk === 'warn' ? 'var(--ink2)' : 'var(--faint)', fontWeight: q.sk === 'warn' ? 600 : 400 }}>{q.stage}</div>
              {rowAction(q, true)}
            </div>
          ))}
        </div>
      ) : (
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
            <thead><tr>
              {['Client', 'Person', 'Type', 'Current stage', 'Handler', 'Log', 'Age', ''].map((h, i) => (
                <th key={i} style={th(i === 6 ? 'right' : 'left')}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rows.map((q) => {
                const isBlocked = q.sk === 'warn'
                return (
                  <tr key={q._i} className="row-hover" style={{ cursor: 'pointer' }} onClick={() => setDetail(q)}>
                    <td style={{ ...cell(), color: 'var(--ink2)' }}>{q.client}</td>
                    <td style={{ ...cell(), color: 'var(--ink2)' }}>{q.person}</td>
                    <td style={cell()}>{q.type}</td>
                    <td style={cell()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Status kind={q.sk}>{q.status}</Status>
                        <span style={{ fontSize: 12.5, color: isBlocked ? 'var(--ink2)' : 'var(--faint)', fontWeight: isBlocked ? 600 : 400 }}>· {q.stage}</span>
                      </div>
                    </td>
                    <td style={{ ...cell(), color: 'var(--ink2)' }}>{q.handler}</td>
                    <td style={cell()}>
                      <button className="btn btn-ghost btn-sm" style={{ gap: 4, padding: '5px 10px', color: 'var(--muted)' }} onClick={stop(() => setDetail(q))} aria-label="View transaction log">
                        <Check size={11} /> txn
                      </button>
                    </td>
                    <td style={{ ...cell(), textAlign: 'right', color: isBlocked ? 'var(--warn)' : 'var(--muted)', fontWeight: isBlocked ? 600 : 400, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{q.age}</td>
                    <td style={{ ...cell(), textAlign: 'right' }}>{rowAction(q, false)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      )}
      {detail && (
        <Drawer onClose={() => setDetail(null)} eyebrow={detail.type} title={detail.person}
          footer={(() => {
            const verb = STAGE_VERB[detail.status]
            return verb && !done.includes(detail._i)
              ? <button className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { act(detail); setDetail(null) }}>{verb}</button>
              : <button className="btn btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setDetail(null)}>Close</button>
          })()}>
          <DrawerField label="Client">{detail.client}</DrawerField>
          <DrawerField label="Handler">{detail.handler}</DrawerField>
          <DrawerField label="Age in queue">{detail.age}</DrawerField>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 9 }}>Current stage</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Status kind={detail.sk}>{detail.status}</Status>
              <span style={{ fontSize: 12.5, color: 'var(--ink2)' }}>· {detail.stage}</span>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--muted)' }}>
            <Check size={12} /> Transaction log recorded · read-only
          </div>
        </Drawer>
      )}
    </>
  )
}

/* ---------------------------------------------------------------- Clients */
export function Customers({ onViewAs }) {
  const isMobile = useIsMobile()
  const [detail, setDetail] = useState(null)
  return (
    <>
      <ViewHeader title="Clients" />
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n="12" label="Active clients" />
        <Stat n="438" label="Users under management" />
        <Stat n="1" label="Integration error" color="var(--danger)" />
        <Stat n="7" label="JML workflows in flight" />
      </div>
      {isMobile ? (
        <div>
          {CUSTOMERS.map((c, i) => (
            <div key={i} className="row-hover" style={{ ...mobileCardStyle, cursor: 'pointer' }} onClick={() => setDetail(c)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{c.admin} · {c.adminRole}</div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{c.grade}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <Status kind={c.sk}>{c.status}</Status>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{c.users} users</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={(e) => { e.stopPropagation(); onViewAs(c) }}>View as {firstName(c.admin)}</button>
            </div>
          ))}
        </div>
      ) : (
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead><tr>
              {['Client', 'Users', 'Posture', 'Integrations', 'Status', 'Plan', ''].map((h, i) => (
                <th key={i} style={th(i === 1 ? 'right' : 'left')}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {CUSTOMERS.map((c, i) => (
                <tr key={i} className="row-hover" style={{ cursor: 'pointer' }} onClick={() => setDetail(c)}>
                  <td style={cell()}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{c.admin} · {c.adminRole}</div>
                  </td>
                  <td style={{ ...cell(), textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--ink2)' }}>{c.users}</td>
                  <td style={cell()}><span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{c.grade}</span></td>
                  <td style={cell()}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {c.ints.map((v, j) => (
                        <span key={j} title={INT_NAMES[j] + (v === 1 ? ' — connected' : v === 2 ? ' — error' : ' — not connected')}
                          style={{ width: 9, height: 9, borderRadius: '50%', background: v === 1 ? 'var(--faint)' : v === 2 ? 'var(--danger)' : 'var(--line-strong)' }} />
                      ))}
                    </div>
                  </td>
                  <td style={cell()}><Status kind={c.sk}>{c.status}</Status></td>
                  <td style={{ ...cell(), color: 'var(--ink2)', fontSize: 12.5 }}>{c.plan}</td>
                  <td style={{ ...cell(), textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={(e) => { e.stopPropagation(); onViewAs(c) }}>View as {firstName(c.admin)}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}
      {detail && (
        <Drawer onClose={() => setDetail(null)} eyebrow={`${detail.users} users · ${detail.plan}`} title={detail.name}
          footer={<button className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { onViewAs(detail); setDetail(null) }}>View as {firstName(detail.admin)}</button>}>
          <DrawerField label="Primary admin">{detail.admin} · {detail.adminRole}</DrawerField>
          <DrawerField label="Users under management">{detail.users}</DrawerField>
          <DrawerField label="Security posture"><span style={{ fontSize: 14, fontWeight: 700 }}>{detail.grade}</span></DrawerField>
          <DrawerField label="Status"><Status kind={detail.sk}>{detail.status}</Status></DrawerField>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 10 }}>Integrations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {detail.ints.map((v, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                  <span style={intDot(v)} />
                  <span style={{ flex: 1 }}>{INT_NAMES[j]}</span>
                  <span style={{ color: v === 2 ? 'var(--danger)' : 'var(--muted)' }}>{intLabel(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      )}
    </>
  )
}

/* ---------------------------------------------------------------- Watchtower */
export function Watchtower({ onFlag }) {
  const [done, setDone] = useState([])
  const act = (f, i) => { setDone((d) => [...d, i]); onFlag(f.cta) }
  return (
    <>
      <ViewHeader title="Watchtower">{datePill('4 open across 12 clients')}</ViewHeader>
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n="2" label="Devices unpatched" color="var(--warn)" />
        <Stat n="3" label="Training overdue" />
        <Stat n="2" label="MFA gaps" />
        <Stat n="1" label="Integration error" color="var(--danger)" />
      </div>
      <Card title="Flagged items">
        {FLAGS.map((f, i) => (
          <div key={i} className="row-hover" style={listRowStyle}>
            <span style={{ color: 'var(--warn)', display: 'grid', placeItems: 'center' }}><Warn size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 13, fontWeight: 550, display: 'block' }}>{f.title}</b>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{f.sub}</span>
            </div>
            {done.includes(i)
              ? <QueuedChip />
              : <button className="btn btn-dark btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => act(f, i)}>{f.cta}</button>}
          </div>
        ))}
      </Card>
    </>
  )
}

/* ---------------------------------------------------------------- Audit log */
export function Audit({ onExport }) {
  const isMobile = useIsMobile()
  const [q, setQ] = useState('')
  const [who, setWho] = useState('All')
  const actors = ['All', ...Array.from(new Set(AUDIT.map((a) => a.who)))]
  const rows = AUDIT.filter((a) => (who === 'All' || a.who === who) && (!q || `${a.act} ${a.why}`.toLowerCase().includes(q.toLowerCase())))
  return (
    <>
      <ViewHeader title="Audit log">
        {!isMobile && <button className="btn btn-ghost" onClick={onExport}>Export</button>}
      </ViewHeader>
      {/* T5 — filtering is the primary action on a log */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" style={{ maxWidth: 260 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activity" />
        {actors.map((a) => (
          <button key={a} onClick={() => setWho(a)} className={who === a ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm'} style={{ textTransform: a === 'system' ? 'none' : 'capitalize' }}>{a}</button>
        ))}
      </div>
      <Card title="All admin activity">
        {rows.map((a, i) => (
          <div key={i} className="row-hover" style={{ ...listRowStyle, alignItems: 'flex-start' }}>
            <div style={{ width: 120, fontSize: 11.5, color: 'var(--faint)', flexShrink: 0, paddingTop: 2 }}>{a.time}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 550 }}>{a.act}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{a.why}</div>
            </div>
            <Chip>{a.who}</Chip>
          </div>
        ))}
        {rows.length === 0 && <div style={{ fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', padding: 16, fontStyle: 'italic' }}>No entries match</div>}
      </Card>
    </>
  )
}
