import React from 'react'
import { PILL } from '../data.js'

/**
 * RecordCard — the mobile list-item card (title, subtitle, status, optional
 * trailing meta + action button). Mirrors the "Record Card" Figma component
 * (Tone variants + Title/Subtitle/Status/Meta/Action label/Show action props).
 *
 * tone: 'neutral' | 'progress' | 'warning' | 'success' | 'danger'
 */
const TONE_TO_KIND = { neutral: 'mut', progress: 'prov', warning: 'warn', success: 'ok', danger: 'err' }

export default function RecordCard({
  title,
  subtitle,
  status,
  tone = 'progress',
  meta,
  actionLabel,
  onAction,
  onOpen,
  showAction = true,
}) {
  const dot = (PILL[TONE_TO_KIND[tone]] || PILL.mut).dot
  const hasAction = showAction && actionLabel
  return (
    <div className={onOpen ? 'row-hover' : undefined} onClick={onOpen}
      style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 11, cursor: onOpen ? 'pointer' : undefined }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 14, fontWeight: 600, flex: 1, minWidth: 0 }}>{title}</div>
        {hasAction && (
          <button className="btn btn-dark btn-sm" style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); onAction && onAction() }}>{actionLabel}</button>
        )}
      </div>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{subtitle}</div>}
      {(status || meta) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {status && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--ink2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              {status}
            </span>
          )}
          {meta && <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>{meta}</span>}
        </div>
      )}
    </div>
  )
}
