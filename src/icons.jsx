// Inline stroke-based SVG icons. All use currentColor so they inherit theme.
import React from 'react'

const base = (size = 16, sw = 2) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: size,
  height: size,
  style: { flexShrink: 0 },
})

export const Eye = ({ size, sw }) => (
  <svg {...base(size ?? 15, sw ?? 2)}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
export const Sun = ({ size }) => (
  <svg {...base(size ?? 14, 2)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
export const Moon = ({ size }) => (
  <svg {...base(size ?? 14, 2)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)
export const Help = ({ size }) => (
  <svg {...base(size ?? 15, 2)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
)
export const Gear = ({ size }) => (
  <svg {...base(size ?? 15, 1.75)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
export const Search = ({ size }) => (
  <svg {...base(size ?? 16, 2)}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)
export const Warn = ({ size, sw }) => (
  <svg {...base(size ?? 15, sw ?? 2.2)}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)
export const Check = ({ size, sw }) => (
  <svg {...base(size ?? 12, sw ?? 2.5)}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)
export const ChevRight = ({ size }) => (
  <svg {...base(size ?? 16, 2)}>
    <path d="M9 18l6-6-6-6" />
  </svg>
)
export const ChevLeft = ({ size }) => (
  <svg {...base(size ?? 16, 2)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
)
export const Close = ({ size }) => (
  <svg {...base(size ?? 16, 2)}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)
export const Trash = ({ size }) => (
  <svg {...base(size ?? 14, 2)}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
)
export const Grip = ({ size }) => (
  <svg {...base(size ?? 14, 2)}>
    <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
    <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
  </svg>
)
export const Image = ({ size }) => (
  <svg {...base(size ?? 28, 1.6)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)
export const Plus = ({ size }) => (
  <svg {...base(size ?? 14, 2)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
