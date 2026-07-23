import React, { useRef, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { useIsMobile } from './ui.jsx'

/**
 * Follow-finger swipe-to-dismiss. Pull down while the content is at the top and
 * the whole sheet tracks your finger 1:1 with a fade. Release past a third of the
 * sheet's height (or with a fast downward flick) and it animates closed; short of
 * that it springs back open. If the content is scrollable it scrolls first, then
 * takes over the drag once you're at the top — standard iOS bottom-sheet feel.
 * Touch listeners are NON-passive so we own the gesture (no pull-to-refresh).
 */
function useSwipeDismiss(onClose, enabled) {
  const sheetRef = useRef(null)
  useEffect(() => {
    if (!enabled) return
    const sheet = sheetRef.current
    if (!sheet) return
    let startY = null, dy = 0, dragging = false, atTop = true, lastY = 0, lastT = 0, vel = 0
    const set = (y, transition) => {
      sheet.style.transition = transition || 'none'
      sheet.style.transform = y ? `translateY(${y}px)` : ''
      sheet.style.opacity = y > 0 ? String(Math.max(0.35, 1 - y / 620)) : ''
    }
    const springOpen = () => set(0, 'transform .34s cubic-bezier(.22,1,.3,1), opacity .34s ease')
    const animateClose = () => {
      const h = sheet.getBoundingClientRect().height || 600
      sheet.style.transition = 'transform .26s cubic-bezier(.4,0,1,1), opacity .26s ease'
      sheet.style.transform = `translateY(${h}px)`
      sheet.style.opacity = '0'
      setTimeout(onClose, 190)
    }
    const ts = (e) => {
      startY = lastY = e.touches[0].clientY
      lastT = e.timeStamp; vel = 0
      atTop = sheet.scrollTop <= 0
      dragging = false; dy = 0
    }
    const tm = (e) => {
      if (startY == null) return
      const y = e.touches[0].clientY
      const d = y - startY
      // only take over on a downward pull that begins at the top of the content;
      // otherwise let the body scroll natively
      if (!dragging) {
        if (d <= 3 || !atTop) return
        dragging = true
      }
      const now = e.timeStamp
      if (now > lastT) vel = (y - lastY) / (now - lastT) // px/ms, +down
      lastY = y; lastT = now
      dy = d
      set(dy)
      if (e.cancelable) e.preventDefault()
    }
    const te = () => {
      if (dragging) {
        const h = sheet.getBoundingClientRect().height || 600
        const past = dy > h / 3            // released past a third of the way
        const flick = vel > 0.55 && dy > 40 // or a quick downward flick
        if (past || flick) animateClose(); else springOpen()
      }
      startY = null; dragging = false; dy = 0
    }
    sheet.addEventListener('touchstart', ts, { passive: false })
    sheet.addEventListener('touchmove', tm, { passive: false })
    sheet.addEventListener('touchend', te, { passive: true })
    sheet.addEventListener('touchcancel', te, { passive: true })
    return () => {
      sheet.removeEventListener('touchstart', ts)
      sheet.removeEventListener('touchmove', tm)
      sheet.removeEventListener('touchend', te)
      sheet.removeEventListener('touchcancel', te)
    }
  }, [onClose, enabled])
  return sheetRef
}

/**
 * Sheet — bottom sheet on mobile (grab handle + rubber-band swipe, no X),
 * centered dialog on desktop (with an X). Backdrop tap always closes.
 */
export default function Sheet({ onClose, maxWidth = 520, children }) {
  const isMobile = useIsMobile()
  const sheetRef = useSwipeDismiss(onClose, isMobile)
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" ref={sheetRef} style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        {isMobile ? (
          <div className="sheet-grip-zone" aria-hidden="true"><span className="sheet-grip" /></div>
        ) : (
          <button className="iconbtn sheet-x" onClick={onClose} aria-label="Close"><Close /></button>
        )}
        {children}
      </div>
    </div>
  )
}
