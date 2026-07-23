import React, { useState } from 'react'
import { WIZ_TYPES, WIZ_PRIOS, CAPABILITIES, initials, firstName } from '../data.js'
import { ChevLeft, ChevRight, Warn, Check } from '../icons.jsx'
import Sheet from './Sheet.jsx'

// Title block for a sheet (close is handled by Sheet: grab handle on mobile, X on desktop)
function Header({ children }) {
  return (
    <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)', paddingRight: 44 }}>
      {children}
    </div>
  )
}
function Footer({ children }) {
  return <div style={{ padding: '16px 22px', background: 'var(--soft2)', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>
}
const fieldLbl = { fontSize: 12.5, fontWeight: 600, color: 'var(--ink2)', display: 'block' }

/* ---------------------------------------------------------------- Ask-for-Help wizard */
export function Wizard({ initial, onClose, onSubmit }) {
  const [step, setStep] = useState(initial?.step || 1)
  const [type, setType] = useState(initial?.type || null)
  const [title, setTitle] = useState(initial?.title || '')
  const [note, setNote] = useState('')
  const [prio, setPrio] = useState('Normal')

  const pick = (t) => { setType(t.name); setTitle(t.name + ' — '); setStep(2) }
  const submit = () => onSubmit({ name: title.replace(/\s*—\s*$/, '').trim() || type, pri: prio === 'Whenever' ? 'Low' : prio })

  return (
    <Sheet onClose={onClose} maxWidth={540}>
      <Header>
        {step === 1
          ? <><div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--purple)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Ask for help</div>
              <div style={{ fontSize: 17, fontWeight: 600, marginTop: 3 }}>What do you need?</div></>
          : <><button className="btn btn-ghost btn-sm" style={{ marginBottom: 8 }} onClick={() => setStep(1)}><ChevLeft /> Back</button>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{type}</div></>}
      </Header>
      {step === 1 ? (
        <div style={{ padding: '14px 22px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WIZ_TYPES.map((t) => (
            <button key={t.name} onClick={() => pick(t)} className="row-hover"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', border: `1px solid ${type === t.name ? 'var(--ink)' : 'var(--line)'}`, borderRadius: 10, background: type === t.name ? 'var(--soft)' : 'var(--surface)', cursor: 'pointer', textAlign: 'left', color: 'var(--ink)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 550 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.sub}</div>
              </div>
              <span style={{ color: 'var(--faint)' }}><ChevRight /></span>
            </button>
          ))}
          <div style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center', marginTop: 4 }}>We usually respond within the hour.</div>
        </div>
      ) : (
        <>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={fieldLbl}>Title
              <input className="input" style={{ marginTop: 6 }} value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label style={fieldLbl}>Anything we should know?
              <textarea className="input" rows={3} style={{ marginTop: 6, resize: 'vertical' }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional — the more context, the faster we move" />
            </label>
            <div>
              <div style={fieldLbl}>How soon?</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {WIZ_PRIOS.map((p) => (
                  <button key={p} onClick={() => setPrio(p)} className={prio === p ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm'}>{p}</button>
                ))}
              </div>
            </div>
          </div>
          <Footer>
            <button className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }} onClick={submit}>Submit request</button>
          </Footer>
        </>
      )}
    </Sheet>
  )
}

/* ---------------------------------------------------------------- Manage person */
export function Manage({ person, onClose, onSave, onOffboard }) {
  const [role, setRole] = useState(person.role)
  return (
    <Sheet onClose={onClose} maxWidth={440}>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--soft)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 600, color: 'var(--ink2)' }}>{initials(person.name)}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{person.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{person.email}</div>
          </div>
        </div>
      </Header>
      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={fieldLbl}>Role
          <select className="input" style={{ marginTop: 6 }} value={role} onChange={(e) => setRole(e.target.value)}>
            {['Owner', 'CFO', 'IT Manager', 'HR', 'Member'].map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <button className="btn btn-ghost" style={{ justifyContent: 'center', color: 'var(--danger)', borderColor: 'var(--line-strong)' }} onClick={onOffboard}>Offboard {firstName(person.name)}…</button>
      </div>
      <Footer>
        <button className="btn btn-dark" style={{ marginLeft: 'auto' }} onClick={() => onSave(role)}>Done</button>
      </Footer>
    </Sheet>
  )
}

/* ---------------------------------------------------------------- Offboard confirm */
export function Offboard({ name, onClose, onConfirm }) {
  const [chk, setChk] = useState(false)
  return (
    <Sheet onClose={onClose} maxWidth={480}>
      <div style={{ padding: '22px 22px 0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--danger-bg)', color: 'var(--danger)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Warn size={20} /></div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Offboard {name}?</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>High-risk action — requires confirmation</div>
        </div>
      </div>
      <div style={{ padding: '16px 22px' }}>
        <div style={{ fontSize: 13, color: 'var(--ink2)' }}>Revokes sign-in · reclaims licenses · wipes devices · archives mail.</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <input type="checkbox" checked={chk} onChange={(e) => setChk(e.target.checked)} style={{ accentColor: 'var(--ink)', width: 16, height: 16 }} />
          I understand — this cannot be undone
        </label>
      </div>
      <Footer>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn" style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', opacity: chk ? 1 : 0.4, cursor: chk ? 'pointer' : 'not-allowed' }} disabled={!chk} onClick={onConfirm}>Start offboarding</button>
      </Footer>
    </Sheet>
  )
}

/* ---------------------------------------------------------------- New client onboarding */
const PLANS = ['Resilience Core', 'Resilience Pro', 'Resilience Enterprise', 'Growth']
export function NewClient({ onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState('')
  const [admin, setAdmin] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState(PLANS[1])
  const [selfOnboard, setSelfOnboard] = useState(true)
  const [caps, setCaps] = useState(() => CAPABILITIES.filter((c) => c.on).map((c) => c.name))
  const toggleCap = (n) => setCaps((cs) => (cs.includes(n) ? cs.filter((x) => x !== n) : [...cs, n]))
  const can = company.trim() && admin.trim()

  return (
    <Sheet onClose={onClose} maxWidth={540}>
      <Header>
        {step === 2 && <button className="btn btn-ghost btn-sm" style={{ marginBottom: 8 }} onClick={() => setStep(1)}><ChevLeft /> Back</button>}
        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--purple)', letterSpacing: '.04em', textTransform: 'uppercase' }}>New client · all online</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 3 }}>{step === 1 ? 'Company & primary admin' : 'Plan & capabilities'}</div>
      </Header>
      {step === 1 ? (
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={fieldLbl}>Company name
            <input className="input" style={{ marginTop: 6 }} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Co." />
          </label>
          <label style={fieldLbl}>Primary admin
            <input className="input" style={{ marginTop: 6 }} value={admin} onChange={(e) => setAdmin(e.target.value)} placeholder="Full name" />
          </label>
          <label style={fieldLbl}>Admin email
            <input className="input" style={{ marginTop: 6 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <input type="checkbox" checked={selfOnboard} onChange={(e) => setSelfOnboard(e.target.checked)} style={{ accentColor: 'var(--ink)', width: 16, height: 16 }} />
            Let this client self-onboard their own users
          </label>
        </div>
      ) : (
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={fieldLbl}>Plan</div>
            <select className="input" style={{ marginTop: 6 }} value={plan} onChange={(e) => setPlan(e.target.value)}>
              {PLANS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <div style={fieldLbl}>Capabilities to enable</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {CAPABILITIES.map((c) => {
                const on = caps.includes(c.name)
                return (
                  <button key={c.name} onClick={() => toggleCap(c.name)} className="row-hover"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`, borderRadius: 8, background: on ? 'var(--soft)' : 'var(--surface)', cursor: 'pointer', textAlign: 'left', color: 'var(--ink)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${on ? 'var(--ink)' : 'var(--line-strong)'}`, background: on ? 'var(--ink)' : 'transparent', color: 'var(--surface)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{on && <Check size={12} sw={3} />}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--faint)' }}>{c.via}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
      <Footer>
        {step === 1 ? (
          <button className="btn btn-dark" style={{ marginLeft: 'auto', opacity: can ? 1 : 0.4, cursor: can ? 'pointer' : 'not-allowed' }} disabled={!can} onClick={() => setStep(2)}>Continue</button>
        ) : (
          <button className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onSubmit({ company: company.trim() || 'New client', admin: admin.trim(), plan, caps: caps.length })}>Start onboarding</button>
        )}
      </Footer>
    </Sheet>
  )
}

/* ---------------------------------------------------------------- Ticket action */
export function TicketAction({ ticket, onClose, onResolve }) {
  const [note, setNote] = useState('')
  const approval = ticket.act === 'approve'
  return (
    <Sheet onClose={onClose} maxWidth={480}>
      <Header>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--purple)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{approval ? 'Approval needed' : 'Your reply needed'}</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>{ticket.name}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Requested by {ticket.by} · {ticket.age} ago</div>
      </Header>
      <div style={{ padding: '18px 22px' }}>
        <div style={fieldLbl}>{approval ? 'Add a note (optional)' : 'Your answer'}</div>
        <textarea className="input" rows={3} style={{ marginTop: 6, resize: 'vertical' }} value={note} onChange={(e) => setNote(e.target.value)}
          placeholder={approval ? 'Any conditions or context for edgefi…' : 'Type your reply…'} />
      </div>
      <Footer>
        {approval ? (
          <>
            <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => onResolve('decline')}>Decline</button>
            <button className="btn btn-dark" style={{ marginLeft: 'auto' }} onClick={() => onResolve('approve')}>Approve</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-dark" style={{ marginLeft: 'auto' }} onClick={() => onResolve('answer')}>Send reply</button>
          </>
        )}
      </Footer>
    </Sheet>
  )
}
