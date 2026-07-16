import React, { useState, useRef } from 'react'
import { KB_CATS, KB_ARTICLES, NAV } from '../data.js'
import { ViewHeader, Card } from '../components/ui.jsx'
import { Search, ChevRight, ChevLeft, Image, Trash, Grip, Plus } from '../icons.jsx'
import { useFlip, DropLine } from '../components/dnd.jsx'

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
export function Settings({ clientMode, prios, setPrios, cats, setCats, itemCfg, setItemCfg, itemOrder, setItemOrder, modeKeys, toast }) {
  const nextId = useRef(0)
  const priosRef = useRef(null)
  const sideRef = useRef(null)
  useFlip(priosRef)
  useFlip(sideRef)

  // --- priorities drag (single list) ---
  const pDrag = useRef(null)                 // dragged index (synchronous)
  const [pGhost, setPGhost] = useState(null) // faded source (deferred so the drag preview is crisp)
  const [pOver, setPOver] = useState(null)   // insertion gap index
  const startPrio = (i) => { pDrag.current = i; setTimeout(() => setPGhost(i), 0) }
  const overPrio = (e, i) => {
    e.preventDefault()
    const r = e.currentTarget.getBoundingClientRect()
    setPOver(e.clientY > r.top + r.height / 2 ? i + 1 : i)
  }
  const dropPrio = () => {
    const from = pDrag.current
    if (from != null && pOver != null) {
      const to = from < pOver ? pOver - 1 : pOver
      if (to !== from) {
        const next = [...prios]
        const [m] = next.splice(from, 1)
        next.splice(to, 0, m)
        setPrios(next)
      }
    }
    endPrio()
  }
  const endPrio = () => { pDrag.current = null; setPGhost(null); setPOver(null) }

  // --- sections ---
  const rename = (id, name) => setCats(cats.map((c) => (c.id === id ? { ...c, name } : c)))
  const addCat = () => { nextId.current += 1; setCats([...cats, { id: 'sec' + nextId.current, name: 'New section' }]) }
  const delCat = (id) => {
    if (cats.length <= 1) return
    const fallback = cats.find((c) => c.id !== id).id
    const nextCfg = { ...itemCfg }
    Object.keys(nextCfg).forEach((k) => { if (nextCfg[k].cat === id) nextCfg[k] = { ...nextCfg[k], cat: fallback } })
    setItemCfg(nextCfg)
    setCats(cats.filter((c) => c.id !== id))
    toast('Section removed — pages moved')
  }
  const toggleShow = (k) => setItemCfg({ ...itemCfg, [k]: { ...itemCfg[k], show: !itemCfg[k].show } })

  // move a page: adopt targetCat, land before `beforeKey` (or at section end when null)
  const placeKey = (key, targetCat, beforeKey) => {
    if (beforeKey === key) return
    const nextCfg = { ...itemCfg, [key]: { ...itemCfg[key], cat: targetCat } }
    setItemCfg(nextCfg)
    setItemOrder((prev) => {
      const arr = prev.filter((k) => k !== key)
      let idx
      if (beforeKey != null) {
        idx = arr.indexOf(beforeKey)
      } else {
        let last = -1
        arr.forEach((k, i) => { if (nextCfg[k].cat === targetCat) last = i })
        idx = last + 1
      }
      if (idx < 0) idx = arr.length
      arr.splice(idx, 0, key)
      return arr
    })
  }

  // up/down: swap with the adjacent visible page in the same section (keyboard-friendly fallback)
  const bump = (k, dir) => {
    const cat = itemCfg[k].cat
    const sameCat = itemOrder.filter((x) => itemCfg[x].cat === cat && modeKeys.includes(x))
    const swap = sameCat[sameCat.indexOf(k) + dir]
    if (!swap) return
    setItemOrder((prev) => {
      const arr = [...prev]
      const ia = arr.indexOf(k), ib = arr.indexOf(swap)
      ;[arr[ia], arr[ib]] = [arr[ib], arr[ia]]
      return arr
    })
  }

  // --- sidebar drag (multiple sections, cross-section) ---
  const sDrag = useRef(null)
  const [sGhost, setSGhost] = useState(null)
  const [drop, setDrop] = useState(null)     // { cat, index } insertion point
  const startPage = (k) => { sDrag.current = k; setTimeout(() => setSGhost(k), 0) }
  const overPage = (e, catId, i) => {
    e.preventDefault(); e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    setDrop({ cat: catId, index: e.clientY > r.top + r.height / 2 ? i + 1 : i })
  }
  const dropPage = () => {
    const key = sDrag.current
    if (key && drop) {
      const sec = itemOrder.filter((k) => modeKeys.includes(k) && itemCfg[k].cat === drop.cat)
      placeKey(key, drop.cat, sec[drop.index] ?? null)
    }
    endPage()
  }
  const endPage = () => { sDrag.current = null; setSGhost(null); setDrop(null) }

  const arrowBtn = { width: 24, height: 22, borderRadius: 6, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--line-strong)', color: 'var(--ink2)', cursor: 'pointer', fontSize: 11, lineHeight: 1 }
  const rowBase = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface)', cursor: 'grab', userSelect: 'none' }

  return (
    <>
      <ViewHeader title="Settings" />
      <div className={clientMode ? 'settings-grid' : 'settings-grid one'} style={{ display: 'grid', gap: 22, alignItems: 'start' }}>

        {clientMode && (
          <div className="card" style={{ padding: 20 }}>
            <b style={{ fontSize: 14.5, fontWeight: 600 }}>What matters most</b>
            <div style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 14px' }}>Drag to reorder — the top two lead your overview.</div>
            <div ref={priosRef} onDrop={dropPrio} onDragOver={(e) => e.preventDefault()}>
              {prios.map((p, i) => (
                <React.Fragment key={p.k}>
                  {pOver === i && <DropLine />}
                  <div data-flip={'p-' + p.k} draggable onDragStart={() => startPrio(i)} onDragEnd={endPrio}
                    onDragOver={(e) => overPrio(e, i)} onDrop={dropPrio}
                    style={{ ...rowBase, marginBottom: 8, opacity: pGhost === i ? 0.4 : 1 }}>
                    <span style={{ color: 'var(--faint)' }}><Grip /></span>
                    <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{p.k}</span>
                    {i < 2 && <span className="pill" style={{ background: 'var(--soft)', color: 'var(--muted)' }}>On overview</span>}
                  </div>
                </React.Fragment>
              ))}
              {pOver === prios.length && <DropLine />}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <b style={{ fontSize: 14.5, fontWeight: 600 }}>Sidebar</b>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Drag pages to reorder or move between sections — or use the arrows.</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={addCat}><Plus /> Add section</button>
          </div>
          <div ref={sideRef} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {cats.map((cat) => {
              const items = itemOrder.filter((k) => modeKeys.includes(k) && itemCfg[k].cat === cat.id)
              return (
                <div key={cat.id} onDragOver={(e) => e.preventDefault()} onDrop={dropPage}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input value={cat.name} onChange={(e) => rename(cat.id, e.target.value)}
                      style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)', border: '1px solid transparent', borderRadius: 6, padding: '4px 6px', background: 'none', outline: 'none', flex: 1 }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--line-strong)')}
                      onBlur={(e) => (e.target.style.borderColor = 'transparent')} />
                    {cats.length > 1 && <button className="iconbtn" onClick={() => delCat(cat.id)}><Trash /></button>}
                  </div>
                  {items.map((k, i) => (
                    <React.Fragment key={k}>
                      {drop && drop.cat === cat.id && drop.index === i && <DropLine />}
                      <div data-flip={k} draggable onDragStart={() => startPage(k)} onDragEnd={endPage}
                        onDragOver={(e) => overPage(e, cat.id, i)} onDrop={dropPage}
                        style={{ ...rowBase, marginBottom: 6, opacity: sGhost === k ? 0.4 : 1 }}>
                        <span style={{ color: 'var(--faint)' }}><Grip /></span>
                        <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1, opacity: itemCfg[k].show ? 1 : 0.4 }}>{NAV[k]}</span>
                        <button aria-label="Move up" style={{ ...arrowBtn, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => bump(k, -1)}>↑</button>
                        <button aria-label="Move down" style={{ ...arrowBtn, opacity: i === items.length - 1 ? 0.35 : 1 }} disabled={i === items.length - 1} onClick={() => bump(k, 1)}>↓</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleShow(k)}>{itemCfg[k].show ? 'Hide' : 'Show'}</button>
                      </div>
                    </React.Fragment>
                  ))}
                  {drop && drop.cat === cat.id && drop.index === items.length && <DropLine />}
                  {items.length === 0 && (
                    <div onDragOver={(e) => { e.preventDefault(); setDrop({ cat: cat.id, index: 0 }) }}
                      style={{ fontSize: 11.5, color: 'var(--faint)', fontStyle: 'italic', padding: '12px', border: '1px dashed var(--line-strong)', borderRadius: 8 }}>Drop a page here</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
