import React, { useLayoutEffect, useRef } from 'react'

/**
 * FLIP animation. Any element with a `data-flip="<id>"` attribute inside
 * `containerRef` glides from its previous box to its new one whenever the list
 * re-renders (First-Last-Invert-Play). Keeps reordering legible instead of
 * teleporting — the "change blindness" fix from the research.
 */
export function useFlip(containerRef) {
  const prev = useRef(new Map())
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const nodes = el.querySelectorAll('[data-flip]')
    const now = new Map()
    nodes.forEach((n) => now.set(n.getAttribute('data-flip'), n.getBoundingClientRect()))
    nodes.forEach((n) => {
      const id = n.getAttribute('data-flip')
      const b = prev.current.get(id)
      const a = now.get(id)
      if (!b) return
      const dx = b.left - a.left
      const dy = b.top - a.top
      if (!dx && !dy) return
      n.style.transition = 'none'
      n.style.transform = `translate(${dx}px, ${dy}px)`
      requestAnimationFrame(() => {
        n.style.transition = 'transform .2s cubic-bezier(.2, .8, .2, 1)'
        n.style.transform = ''
      })
    })
    prev.current = now
  })
}

/**
 * The insertion indicator — a thin ink line with a terminal dot that bleeds a
 * few px past the list edges, marking exactly where the item will land.
 * Zero height so it never shifts the layout (and never fights the FLIP).
 */
export function DropLine() {
  return (
    <div aria-hidden="true" style={{ position: 'relative', height: 0 }}>
      <div style={{ position: 'absolute', left: -4, right: -4, top: -4, height: 2, background: 'var(--ink)', borderRadius: 2, animation: 'fade .12s ease both' }}>
        <span style={{ position: 'absolute', left: -3, top: -2, width: 6, height: 6, borderRadius: '50%', background: 'var(--ink)' }} />
      </div>
    </div>
  )
}
