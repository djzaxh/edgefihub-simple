import React, { useRef, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { useIsMobile } from './ui.jsx'

/**
 * Rubber-band swipe-to-dismiss. Grab the top area of the sheet (the grab-handle
 * / header) OR pull down while its content is scrolled to the top, and the whole
 * sheet follows the finger: 1:1 downward with a slight fade, resisted upward, so
 * it feels physically attached. Released past the threshold it closes; otherwise
 * it springs back. Touch listeners are NON-passive so we can own the gesture and
 * block Safari's pull-to-refresh / native scroll while dragging.
 */
function useSwipeDismiss(onClose, enabled) {
  const sheetRef = useRef(null)
  useEffect(() => {
    if (!enabled) return
    const sheet = sheetRef.current
    if (!sheet) return
    let startY = null, dy = 0, dragging = false, canDrag = false
    // downward moves 1:1; upward is resisted (feels tethered, not detached)
    const follow = (d) => (d < 0 ? -Math.pow(-d, 0.82) : d)
    const apply = (y, animate) => {
      sheet.style.transition = animate ? 'transform .36s cubic-bezier(.16,1,.3,1), opacity .36s ease' : 'none'
      sheet.style.transform = y ? `translateY(${y}px)` : ''
      sheet.style.opacity = y > 0 ? String(Math.max(0.4, 1 - y / 640)) : ''
    }
    const ts = (e) => {
      startY = e.touches[0].clientY
      const top = sheet.getBoundingClientRect().top
      // grabbing the top ~92px (handle + header) always drags; elsewhere only
      // when the content is already scrolled to the very top
      canDrag = (startY - top) < 92 || sheet.scrollTop <= 0
      dragging = false; dy = 0
    }
    const tm = (e) => {
      if (startY == null || !canDrag) return
      const d = e.touches[0].clientY - startY
      if (!dragging && Math.abs(d) < 4) return
      dragging = true
      dy = d
      apply(follow(dy), false)
      if (e.cancelable) e.preventDefault() // we own this gesture now
    }
    const te = () => {
      if (dragging) { if (dy > 120) { apply(0, true); onClose() } else apply(0, true) }
      startY = null; dragging = false; canDrag = false; dy = 0
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
