import React, { useState } from 'react'
import { KB_CATS, KB_ARTICLES, NAV } from '../data.js'
import { ViewHeader, Card } from '../components/ui.jsx'
import { Search, ChevRight, ChevLeft, Image } from '../icons.jsx'

// small on/off switch — ink track when on
function Switch({ on, onClick }) {
  return (
    <button onClick={onClick} role="switch" aria-checked={on} style={{ width: 40, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', padding: 0, position: 'relative', background: on ? 'var(--ink)' : 'var(--line-strong)', transition: 'background .2s ease', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 18, height: 18, borderRadius: '50%', background: 'var(--surface)', transition: 'left .2s cubic-bezier(.2,.8,.2,1)' }} />
    </button>
  )
}

/* ---------------------------------------------------------------- Knowledge base */
export function KB({ onArticle, onWizard }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const articles = KB_ARTICLES.filter((a) => !query || a.title.toLowerCase().includes(query))
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', animation: 'slideUp .3s ease both' }}>
      <h1 className="h1" style={{ fontSize: 24, margin: '20px 0 6px', textAlign: 'center' }}>How can we help?</h1>
      <div style={{ position: 'relative', margin: '22px 0 30px' }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)', display: 'grid' }}><Search /></span>
        <input className="input" style={{ padding: '14px 16px 14px 44px', borderRadius: 10, fontSize: 14 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, animation: 'slideUp .35s ease both' }}>
        {KB_CATS.map((c, i) => (
          <button key={i} className="card" style={{ padding: '16px 18px', textAlign: 'left', cursor: 'pointer', background: 'var(--surface)' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{c.n} articles</div>
          </button>
        ))}
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 13.5, fontWeight: 600 }}>Popular</div>
        {articles.map((a, i) => (
          <button key={i} onClick={() => onArticle(a)} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', width: '100%', background: 'none', border: 'none', borderBottom: '1px solid var(--line2)', cursor: 'pointer', textAlign: 'left', color: 'var(--ink)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--faint)' }}>{a.cat}</div>
            </div>
            <span style={{ color: 'var(--faint)' }}><ChevRight /></span>
          </button>
        ))}
        {articles.length === 0 && <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', padding: 14, fontStyle: 'italic' }}>No articles match that search</div>}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- KB article */
export function KBArticle({ article, onBack, onWizard, toast }) {
  const [vote, setVote] = useState(null)
  const a = article || KB_ARTICLES[0]
  const lines = [100, 94, 64, 97, 88, 45, 96, 72]
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', animation: 'slideUp .3s ease both' }}>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 18 }} onClick={onBack}><ChevLeft /> Help Center</button>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--purple)' }}>{a.cat}</div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.5px', margin: '6px 0 4px' }}>{a.title}</h1>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>Updated Jul 2026 · 3 min read</div>
      {lines.slice(0, 4).map((w, i) => <div key={i} style={{ height: 11, borderRadius: 4, background: 'var(--soft)', width: `${w}%`, marginBottom: 12 }} />)}
      <div style={{ height: 13, borderRadius: 4, background: 'var(--line)', width: '38%', margin: '24px 0 14px' }} />
      {lines.slice(4).map((w, i) => <div key={i} style={{ height: 11, borderRadius: 4, background: 'var(--soft)', width: `${w}%`, marginBottom: 12 }} />)}
      <div style={{ height: 180, borderRadius: 12, background: 'var(--soft)', display: 'grid', placeItems: 'center', color: 'var(--faint)', margin: '20px 0' }}><Image /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 18, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--ink2)' }}>Was this helpful?</span>
        <button className={vote === 'yes' ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm'} onClick={() => { setVote('yes'); toast('Thanks for the feedback') }}>Yes</button>
        <button className={vote === 'no' ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm'} onClick={() => { setVote('no'); toast("Thanks — we'll improve this article", 'info') }}>No</button>
        <button className="btn btn-dark btn-sm" style={{ marginLeft: 'auto' }} onClick={onWizard}>Still stuck? Ask for help</button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Settings */
export function Settings({ modeKeys, itemCfg, setItemCfg, toast }) {
  const toggle = (k) => {
    const on = itemCfg[k]?.show !== false
    setItemCfg({ ...itemCfg, [k]: { ...(itemCfg[k] || {}), show: !on } })
    toast(`${NAV[k]} ${on ? 'hidden' : 'shown'}`, on ? 'warn' : 'success')
  }
  return (
    <>
      <ViewHeader title="Settings" />
      <div style={{ maxWidth: 620 }}>
        <Card title="Navigation">
          {modeKeys.map((k, i) => {
            const on = itemCfg[k]?.show !== false
            return (
              <div key={k} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px', borderTop: i ? '1px solid var(--line2)' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 500, color: on ? 'var(--ink)' : 'var(--muted)' }}>{NAV[k]}</div>
                <span style={{ fontSize: 12, color: 'var(--faint)', width: 52, textAlign: 'right' }}>{on ? 'Shown' : 'Hidden'}</span>
                <Switch on={on} onClick={() => toggle(k)} />
              </div>
            )
          })}
        </Card>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '14px 2px 0', lineHeight: 1.5 }}>Choose which pages appear in your navigation. Hidden pages are removed from the top bar.</p>
      </div>
    </>
  )
}
