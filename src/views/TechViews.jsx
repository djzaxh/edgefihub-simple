import React from 'react'
import { QUEUE, CUSTOMERS, INT_NAMES, FLAGS, AUDIT, firstName } from '../data.js'
import { Status, Stat, ViewHeader, Card, listRowStyle, mobileCardStyle, useIsMobile, Chip } from '../components/ui.jsx'
import { Warn, Check } from '../icons.jsx'

const cell = (bold) => ({ padding: '17px 28px', borderBottom: '1px solid var(--line2)', fontSize: 13.5, fontWeight: bold ? 550 : 400, verticalAlign: 'middle' })
const th = (align = 'left') => ({ textAlign: align, fontSize: 12, fontWeight: 500, color: 'var(--muted)', padding: '16px 28px', borderBottom: '1px solid var(--line2)' })

const datePill = (text) => (
  <span style={{ background: 'var(--soft)', color: 'var(--muted)', fontSize: 11.5, fontWeight: 600, padding: '5px 11px', borderRadius: 7 }}>{text}</span>
)

/* ---------------------------------------------------------------- JML queue */
export function Queue() {
  const isMobile = useIsMobile()
  const open = QUEUE.filter((q) => q.sk !== 'ok').length
  const blocked = QUEUE.filter((q) => q.sk === 'warn').length
  return (
    <>
      <ViewHeader title="JML queue">{datePill('Tuesday, Jul 15')}</ViewHeader>
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n={open} label="In flight" />
        <Stat n={blocked} label="Blocked" />
        <Stat n="3" label="Fully automated" />
        <Stat n="12" label="Clients" />
      </div>
      {isMobile ? (
        <div>
          {QUEUE.map((q, i) => (
            <div key={i} style={mobileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{q.type} — {q.person}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{q.client}</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--faint)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{q.age}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <Status kind={q.sk}>{q.status}</Status>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{q.handler}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--faint)' }}>{q.stage}</div>
            </div>
          ))}
        </div>
      ) : (
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead><tr>
              {['Client', 'Person', 'Type', 'Current stage', 'Handler', 'Log', 'Age'].map((h, i) => (
                <th key={i} style={th(i === 6 ? 'right' : 'left')}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {QUEUE.map((q, i) => (
                <tr key={i}>
                  <td style={cell(true)}>{q.client}</td>
                  <td style={{ ...cell(), color: 'var(--ink2)' }}>{q.person}</td>
                  <td style={cell()}>{q.type}</td>
                  <td style={cell()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Status kind={q.sk}>{q.status}</Status>
                      <span style={{ fontSize: 12.5, color: 'var(--faint)' }}>· {q.stage}</span>
                    </div>
                  </td>
                  <td style={{ ...cell(), color: 'var(--ink2)' }}>{q.handler}</td>
                  <td style={cell()}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: 'var(--muted)' }}>
                      <Check size={11} /> txn
                    </span>
                  </td>
                  <td style={{ ...cell(), textAlign: 'right', color: 'var(--muted)', fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{q.age}</td>
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

/* ---------------------------------------------------------------- Clients */
export function Customers({ onViewAs }) {
  const isMobile = useIsMobile()
  return (
    <>
      <ViewHeader title="Clients" />
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n="12" label="Active clients" />
        <Stat n="438" label="Users under management" />
        <Stat n="1" label="Integration error" />
        <Stat n="7" label="JML workflows in flight" />
      </div>
      {isMobile ? (
        <div>
          {CUSTOMERS.map((c, i) => (
            <div key={i} style={mobileCardStyle}>
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
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => onViewAs(c)}>View as {firstName(c.admin)}</button>
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
                <tr key={i}>
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
                    <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => onViewAs(c)}>View as {firstName(c.admin)}</button>
                  </td>
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

/* ---------------------------------------------------------------- Watchtower */
export function Watchtower({ onFlag }) {
  return (
    <>
      <ViewHeader title="Watchtower">{datePill('4 open across 12 clients')}</ViewHeader>
      <div className="kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <Stat n="2" label="Devices unpatched" />
        <Stat n="3" label="Training overdue" />
        <Stat n="2" label="MFA gaps" />
        <Stat n="1" label="Integration error" />
      </div>
      <Card title="Flagged items">
        {FLAGS.map((f, i) => (
          <div key={i} className="row-hover" style={listRowStyle}>
            <span style={{ color: 'var(--muted)', display: 'grid', placeItems: 'center' }}><Warn size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 13, fontWeight: 550, display: 'block' }}>{f.title}</b>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{f.sub}</span>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => onFlag(f.cta)}>{f.cta}</button>
          </div>
        ))}
      </Card>
    </>
  )
}

/* ---------------------------------------------------------------- Audit log */
export function Audit({ onExport }) {
  return (
    <>
      <ViewHeader title="Audit log">
        <button className="btn btn-ghost" onClick={onExport}>Export</button>
      </ViewHeader>
      <Card title="All admin activity">
        {AUDIT.map((a, i) => (
          <div key={i} className="row-hover" style={{ ...listRowStyle, alignItems: 'flex-start' }}>
            <div style={{ width: 120, fontSize: 11.5, color: 'var(--faint)', flexShrink: 0, paddingTop: 2 }}>{a.time}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 550 }}>{a.act}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{a.why}</div>
            </div>
            <Chip>{a.who}</Chip>
          </div>
        ))}
      </Card>
    </>
  )
}
