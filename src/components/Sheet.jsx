import React, { useRef, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { useIsMobile } from './ui.jsx'

/**
 * Rubber-band swipe-to-dismiss. The whole sheet follows the finger on a
 * downward drag that starts at the top of its scroll — it moves 1:1 with a
 * slight fade, snaps back if released before the threshold, and closes past it.
 * Touch listeners are NON-passive so we can block Safari's pull-to-refresh.
 */
function useSwipeDismiss(onClose, enabled) {
  const sheetRef = useRef(null)
  useEffect(() => {
    if (!enabled) return
    const sheet = sheetRef.current
    if (!sheet) return
    let startY = null, dy = 0, dragging = false, atTop = true
    const apply = (y, animate) => {
      sheet.style.transition = animate ? 'transform .34s cubic-bezier(.16,1,.3,1), opacity .34s ease' : 'none'
      sheet.style.transform = y ? `translateY(${y}px)` : ''
      sheet.style.opacity = y ? String(Math.max(0.35, 1 - y / 700)) : ''
    }
    const ts = (e) => { startY = e.touches[0].clientY; atTop = sheet.scrollTop <= 0; dragging = false; dy = 0 }
    const tm = (e) => {
      if (startY == null) return
      const d = e.touches[0].clientY - startY
      if (d > 0 && atTop) {
        dragging = true
        dy = d < 0 ? 0 : d
        apply(dy, false)
        if (e.cancelable) e.preventDefault() // block pull-to-refresh + native scroll while dragging
      }
    }
    const te = () => {
      if (dragging) { if (dy > 110) { apply(0, true); onClose() } else apply(0, true) }
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
