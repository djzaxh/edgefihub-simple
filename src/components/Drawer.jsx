import React, { useEffect } from 'react'
import { Close } from '../icons.jsx'
import { useIsMobile } from './ui.jsx'
import Sheet from './Sheet.jsx'

/**
 * Detail drawer — a right-side panel on desktop, a swipeable bottom sheet on
 * mobile (reuses Sheet, so it inherits the rubber-band swipe-to-dismiss).
 * Rows open this instead of being inert; primary actions live in the footer.
 */
export default function Drawer({ onClose, title, eyebrow, children, footer, maxWidth = 440 }) {
  const isMobile = useIsMobile()
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const head = (
    <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)', paddingRight: 48 }}>
      {eyebrow && <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--purple)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{eyebrow}</div>}
      <div style={{ fontSize: 17, fontWeight: 600, marginTop: eyebrow ? 3 : 0 }}>{title}</div>
    </div>
  )
  const foot = footer && (
    <div style={{ padding: '14px 22px', borderTop: '1px solid var(--line)', background: 'var(--soft2)', display: 'flex', gap: 10, alignItems: 'center' }}>{footer}</div>
  )

  if (isMobile) {
    return (
      <Sheet onClose={onClose} maxWidth={520}>
        {head}
        <div style={{ padding: '18px 22px' }}>{children}</div>
        {foot}
      </Sheet>
    )
  }
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <button className="iconbtn drawer-x" onClick={onClose} aria-label="Close"><Close /></button>
        {head}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 22px' }}>{children}</div>
        {foot}
      </div>
    </div>
  )
}

// a labeled detail row for drawer bodies
export function DrawerField({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--line2)' }}>
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', minWidth: 0 }}>{children}</span>
    </div>
  )
}
