import React, { useState } from 'react'
import { WIZ_TYPES, WIZ_PRIOS, initials, firstName } from '../data.js'
import { Close, ChevLeft, ChevRight, Warn } from '../icons.jsx'

function Header({ children, onClose }) {
  return (
    <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      <button className="iconbtn" onClick={onClose}><Close /></button>
    </div>
  )
}
function Footer({ children }) {
  return <div style={{ padding: '16px 22px', background: 'var(--soft2)', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>
}

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
    <div className="overlay" onClick={onClose}>
      <div className="dialog" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
        <Header onClose={onClose}>
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
      </div>
    </div>
  )
}
const fieldLbl = { fontSize: 12.5, fontWeight: 600, color: 'var(--ink2)', display: 'block' }

/* ---------------------------------------------------------------- Manage person */
export function Manage({ person, onClose, onSave, onOffboard }) {
  const [role, setRole] = useState(person.role)
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <Header onClose={onClose}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--soft)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 600, color: 'var(--ink2)' }}>{initials(person.name)}</div>
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
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Offboard confirm */
export function Offboard({ name, onClose, onConfirm }) {
  const [chk, setChk] = useState(false)
  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div className="dialog" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Ticket action */
export function TicketAction({ ticket, onClose, onResolve }) {
  const [note, setNote] = useState('')
  const approval = ticket.act === 'approve'
  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div className="dialog" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <Header onClose={onClose}>
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
      </div>
    </div>
  )
}
