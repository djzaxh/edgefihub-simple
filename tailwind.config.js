/** @type {import('tailwindcss').Config} */
// Tailwind maps onto edgefi's existing CSS-variable tokens so utilities are
// theme-aware (they follow light/dark automatically). Preflight is OFF so the
// current custom styles/look are left exactly as they are.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        soft: { DEFAULT: 'var(--soft)', 2: 'var(--soft2)' },
        line: { DEFAULT: 'var(--line)', 2: 'var(--line2)', strong: 'var(--line-strong)' },
        ink: { DEFAULT: 'var(--ink)', 2: 'var(--ink2)' },
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        purple: { DEFAULT: 'var(--purple)', deep: 'var(--purple-deep)', soft: 'var(--purple-soft)', line: 'var(--purple-line)' },
        ok: { DEFAULT: 'var(--ok)', bg: 'var(--ok-bg)', line: 'var(--ok-line)' },
        warn: { DEFAULT: 'var(--warn)', bg: 'var(--warn-bg)', line: 'var(--warn-line)' },
        danger: { DEFAULT: 'var(--danger)', bg: 'var(--danger-bg)', line: 'var(--danger-line)' },
        edge: { DEFAULT: 'var(--edge)', bg: 'var(--edge-bg)' },
        lime: { DEFAULT: 'var(--lime)', ink: 'var(--lime-ink)' },
      },
      borderRadius: { chip: '7px', sm: '8px', DEFAULT: '10px', card: '12px', lg: '14px', sheet: '22px' },
      fontFamily: { sans: ['Poppins', 'Segoe UI', 'system-ui', 'sans-serif'] },
      boxShadow: { modal: '0 12px 48px rgba(10,10,10,.12), 0 0 0 1px rgba(10,10,10,.05)' },
    },
  },
  plugins: [],
}
