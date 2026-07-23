import React, { useRef, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { useIsMobile } from './ui.jsx'

/**
 * Swipe-to-dismiss for a bottom sheet. Touch listeners are attached
 * NON-passively to the grab-handle zone so we can preventDefault() and stop
 * Safari's pull-to-refresh from firing while the user drags the sheet down.
 */
function useSwipeDismiss(onClose, enabled) {
  const sheetRef = useRef(null)
  const handleRef = useRef(null)
  useEffect(() => {
    if (!enabled) return
    const handle = handleRef.current
    const sheet = sheetRef.current
    if (!handle || !sheet) return
    let startY = null, cur = 0, dragging = false
    const apply = (y) => {
      sheet.style.transition = y ? 'none' : 'transform .3s cubic-bezier(.16,1,.3,1)'
      sheet.style.transform = y ? `translateY(${y}px)` : ''
    }
    const ts = (e) => { startY = e.touches[0].clientY; dragging = true; cur = 0 }
    const tm = (e) => {
      if (!dragging) return
      const d = e.touches[0].clientY - startY
      if (d > 0) { cur = d; apply(d); if (e.cancelable) e.preventDefault() } // block pull-to-refresh
      else { cur = 0; apply(0) }
    }
    const te = () => { if (!dragging) return; dragging = false; if (cur > 90) onClose(); else apply(0) }
    handle.addEventListener('touchstart', ts, { passive: false })
    handle.addEventListener('touchmove', tm, { passive: false })
    handle.addEventListener('touchend', te, { passive: true })
    handle.addEventListener('touchcancel', te, { passive: true })
    return () => {
      handle.removeEventListener('touchstart', ts)
      handle.removeEventListener('touchmove', tm)
      handle.removeEventListener('touchend', te)
      handle.removeEventListener('touchcancel', te)
    }
  }, [onClose, enabled])
  return { sheetRef, handleRef }
}

/**
 * Sheet — bottom sheet on mobile (grab handle + swipe-to-dismiss, no X),
 * centered dialog on desktop (with an X). Backdrop tap always closes.
 */
export default function Sheet({ onClose, maxWidth = 520, children }) {
  const isMobile = useIsMobile()
  const { sheetRef, handleRef } = useSwipeDismiss(onClose, isMobile)
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" ref={sheetRef} style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        {isMobile ? (
          <div ref={handleRef} className="sheet-grip-zone" aria-label="Drag down to close">
            <span className="sheet-grip" />
          </div>
        ) : (
          <button className="iconbtn sheet-x" onClick={onClose} aria-label="Close"><Close /></button>
        )}
        {children}
      </div>
    </div>
  )
}
