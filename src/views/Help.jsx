import React, { useState } from 'react'
import { KB_CATS, KB_ARTICLES, NAV } from '../data.js'
import { ViewHeader, Card } from '../components/ui.jsx'
import { Search, ChevRight, ChevLeft, Image, Trash, Grip, Plus } from '../icons.jsx'

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
        <button className={vote === 'yes' ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm'} onClick={() => setVote('yes')}>Yes</button>
        <button className={vote === 'no' ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm'} onClick={() => { setVote('no'); toast("Thanks — we'll improve this article") }}>No</button>
        <button className="btn btn-dark btn-sm" style={{ marginLeft: 'auto' }} onClick={onWizard}>Still stuck? Ask for help</button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Settings */
export function Settings({ clientMode, prios, setPrios, cats, setCats, itemCfg, setItemCfg, itemOrder, modeKeys, toast }) {
  const [drag, setDrag] = useState(null)

  const reorder = (from, to) => {
    if (from === to) return
    const next = [...prios]
    const [m] = next.splice(from, 1)
    next.splice(to, 0, m)
    setPrios(next)
  }

  const rename = (id, name) => setCats(cats.map((c) => (c.id === id ? { ...c, name } : c)))
  const addCat = () => setCats([...cats, { id: 'c' + Date.now(), name: 'New section' }])
  const delCat = (id) => {
    if (cats.length <= 1) return
    const fallback = cats.find((c) => c.id !== id).id
    const nextCfg = { ...itemCfg }
    Object.keys(nextCfg).forEach((k) => { if (nextCfg[k].cat === id) nextCfg[k] = { ...nextCfg[k], cat: fallback } })
    setItemCfg(nextCfg)
    setCats(cats.filter((c) => c.id !== id))
    toast('Section removed — pages moved')
  }
  const moveItem = (k, cat) => setItemCfg({ ...itemCfg, [k]: { ...itemCfg[k], cat } })
  const toggleShow = (k) => setItemCfg({ ...itemCfg, [k]: { ...itemCfg[k], show: !itemCfg[k].show } })

  return (
    <>
      <ViewHeader title="Settings" />
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 22 }}>

        {clientMode && (
          <div className="card" style={{ padding: 20 }}>
            <b style={{ fontSize: 14.5, fontWeight: 600 }}>What matters most</b>
            <div style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 14px' }}>Drag to reorder — the top two lead your overview.</div>
            {prios.map((p, i) => (
              <div key={p.k} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()}
                onDrop={() => { reorder(drag, i); setDrag(null) }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 8, cursor: 'grab', background: 'var(--surface)', opacity: drag === i ? 0.4 : 1, boxShadow: drag !== null && drag !== i ? 'none' : 'none' }}>
                <span style={{ color: 'var(--faint)' }}><Grip /></span>
                <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{p.k}</span>
                {i < 2 && <span className="pill" style={{ background: 'var(--purple-soft)', color: 'var(--purple)' }}>On overview</span>}
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <b style={{ fontSize: 14.5, fontWeight: 600 }}>Sidebar</b>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Organize pages into sections and toggle visibility.</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={addCat}><Plus /> Add section</button>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {cats.map((cat) => {
              const items = itemOrder.filter((k) => modeKeys.includes(k) && itemCfg[k].cat === cat.id)
              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input value={cat.name} onChange={(e) => rename(cat.id, e.target.value)}
                      style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)', border: '1px solid transparent', borderRadius: 6, padding: '4px 6px', background: 'none', outline: 'none', flex: 1 }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--line-strong)')}
                      onBlur={(e) => (e.target.style.borderColor = 'transparent')} />
                    {cats.length > 1 && <button className="iconbtn" onClick={() => delCat(cat.id)}><Trash /></button>}
                  </div>
                  {items.map((k) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 6, background: 'var(--surface)' }}>
                      <span style={{ color: 'var(--faint)' }}><Grip /></span>
                      <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1, opacity: itemCfg[k].show ? 1 : 0.4 }}>{NAV[k]}</span>
                      <select value={itemCfg[k].cat} onChange={(e) => moveItem(k, e.target.value)}
                        style={{ fontSize: 12, padding: '4px 6px', borderRadius: 6, border: '1px solid var(--line-strong)', background: 'var(--surface)', color: 'var(--ink2)' }}>
                        {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleShow(k)}>{itemCfg[k].show ? 'Hide' : 'Show'}</button>
                    </div>
                  ))}
                  {items.length === 0 && <div style={{ fontSize: 11.5, color: 'var(--faint)', fontStyle: 'italic', padding: '4px 12px' }}>No pages in this section</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
