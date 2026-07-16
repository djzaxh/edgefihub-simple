# edgefi hub — simple

A simple but robust **React + Vite** implementation of the EdgeHub IT-management portal,
ported from the EdgeHub Claude Design source. No backend — all data is mocked in
`src/data.js`, so the whole thing runs as a static site.

## What's inside

Two personas, switchable from the **Demo · view as** control at the bottom of the sidebar:

- **Technician** (MSP staff) — JML queue, Clients, Watchtower, Audit log.
  "View as" any client to jump into their portal (impersonation banner + Exit).
- **Client** (end customer) — Overview (KPI hero cards + "actions handled" chart +
  needs-your-attention), Tickets, People, Security (grade ring + NIST), Security Training,
  Costs (role-gated to Owner/CFO).

Plus: light/dark theme (persisted), the **Ask for Help** wizard, Manage / Offboard person
flows, ticket approve/answer, nudge & reclaim actions, a Knowledge Base, and a Settings page
with a drag-to-reorder priority list and a sidebar organizer. Fully responsive with a mobile
drawer under 720px.

## Role permissions (client Modes)

Each client role only sees the pages relevant to it (defined by `ROLE_PAGES` in `src/App.jsx`).
Switch role live from the **Demo · view as** control in the sidebar.

| Page      | Owner | CFO | IT Manager | HR |
|-----------|:---:|:---:|:---:|:---:|
| Overview  | ✓ | ✓ | ✓ | ✓ |
| Tickets   | ✓ | ✓ | ✓ | — |
| People (onboarding/offboarding) | ✓ | — | ✓ | ✓ |
| Security  | ✓ | ✓ | ✓ | — |
| Security Training | ✓ | ✓ | ✓ | — |
| Costs / licensing | ✓ | ✓ | ✓ | — |

- **Owner** — full access; general overview + security focus.
- **CFO** — costs & value focus; no user management.
- **IT Manager** — technical ops (onboarding, tickets, security, training, licensing).
- **HR** — simplified: onboarding/offboarding only (lands on People).

Navigating to a page the current role can't see falls back to its home page, so permissions
hold even when switching roles mid-session.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Project layout

```
src/
  main.jsx            entry point
  App.jsx             app shell, routing, persona logic, state, modals, toast
  data.js             all mock data + presentation helpers
  icons.jsx           inline SVG icons + logomark
  styles.css          design tokens (light/dark), animations, primitives, responsive
  components/
    ui.jsx            Pill, Stat, Card, GradeRing, Bar, Avatar, Chip, ViewHeader
    Modals.jsx        Wizard, Manage, Offboard, TicketAction
  views/
    ClientViews.jsx   Overview, Tickets, People, Security, Training, Costs
    TechViews.jsx     Queue, Customers, Watchtower, Audit
    Help.jsx          Knowledge Base, KB Article, Settings
```

## Design tokens

Brand colors, spacing, and the Poppins type scale live as CSS custom properties in
`src/styles.css` (`:root`/`body` for light, `body.dark` for dark). The purple brand color is
`#6501E5` (light) / `#8D4DF5` (dark).
