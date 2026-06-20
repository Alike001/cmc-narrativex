# CMC NarrativeX

AI narrative-intelligence dashboard for crypto markets. Built with Next.js 15 (App Router),
React 19, and Tailwind CSS, in plain JavaScript (no TypeScript).

## What's inside

- **Landing page** (`/`) — product pitch, a live "current narrative" preview, how-it-works,
  a preview of all six dashboard widgets, FAQ, and a closing CTA.
- **Dashboard** (`/dashboard`) — the six core widgets:
  - **Current Narrative** — the dominant story moving the market right now
  - **Previous Narrative** — what faded, and how long it lasted
  - **Confidence Score** — how strongly the data sources agree on the current read
  - **Market Regime** — risk-on / risk-off / chopping sideways
  - **Risk Score** — leverage, liquidity, and correlation rolled into one number
  - **Generated Strategy** — a thesis, conviction level, and allocation tilt

The marketing landing page uses a local development content layer in `lib/mockData.js`.
The dashboard now pulls from the CoinMarketCap service layer in `lib/cmc.ts` through the
`/api/*` routes, with fallback-market-model data only when live access is unavailable.

## Project structure

```
app/
  layout.js          → root layout, font loading, global metadata
  globals.css         → Tailwind directives + base theme styles
  page.js              → landing page
  dashboard/
    page.js            → dashboard page (grid of widgets)
components/
  landing/             → navbar, hero, ticker, how-it-works, features, FAQ, CTA, footer
  dashboard/           → header + the six widget components
  ui/                  → shared primitives (RadialGauge, PulseLine, Badge)
lib/
  mockData.js          → landing-page development content
```

## Getting started

Requires Node.js 18.18+ (Node 20 LTS recommended).

```bash
npm install
npm run dev
```

Then open http://localhost:3000 for the landing page, or http://localhost:3000/dashboard
for the dashboard directly.

## Build for production

```bash
npm run build
npm run start
```

## Design notes

- Dark theme built around a deep ink background (`ink-*`), an electric-blue "signal" accent
  for primary actions and data, and a teal "pulse" accent representing narrative momentum.
- `PulseLine` (in `components/ui`) is the recurring signature motif — a small seismograph-style
  line used in the hero, widget cards, and the CTA to visually tie the whole product to the
  idea of a narrative's "pulse" through the market.
- Type: Space Grotesk for display/headlines, Inter for body copy, JetBrains Mono for all
  data/numbers so figures stay tabular and legible.
