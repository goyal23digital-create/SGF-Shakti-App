# Shakti Club — SGF Shakti Partner App

React + Vite + TypeScript implementation of the **Shakti Club dealer app** and the
**Shakti Admin Panel**, built from the Claude Design handoff bundle in `../project/`
(see `../chats/chat1.md` for the full blueprint and design intent).

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

Production build:

```bash
npm run build        # typecheck + bundle → dist/
npm run preview      # serve the built app
```

## Routes

| URL | What |
|---|---|
| `/` | Dealer app (mobile-first; centred phone-width column on desktop) |
| `/#/admin` | Admin web panel (desktop layout) |

Hash routing is used so the built `dist/` works from any static file server with
no rewrite rules.

## Demo options (query params)

These map to the design prototype's "tweaks" panel:

| Param | Effect |
|---|---|
| `/?login` | Dealer app starts at the login/OTP screen instead of Home |
| `/?festival` | Shows the "Shakti Summer Dhamaka 2×" festival banner on Home |
| `/?scenario=steady\|pilot\|cap-breach#/admin` | Admin data scenario (default `steady`) |
| `/?density=compact#/admin` | Compact admin layout |
| `/?ink#/admin` | Navy-gradient admin sidebar |

## What's implemented

**Dealer app** — all 12 blueprint surfaces: Login/OTP · Home (animated SP count-up,
tier progress bar, live missions, scratch shelf, quick actions, leaderboard teaser) ·
Catalogue with trade pricing, category filter, add-to-PO stepper and colour-vote poll ·
Cart sheet → order request flow · Rewards store with working redemption + history ·
Ledger · Leaderboard (district/state tabs) + trophy case · QR scan simulator (+5 SP) ·
Orders & tracking · Media kit · Support & warranty · Notifications · More (tier
compare, language, menu, logout).

Interactions from the design: rub-to-reveal **scratch card** (canvas) with confetti,
SP count-up on load/login and on every earn/redeem, animated tier/mission progress
bars, toasts, and the **EN / हिन्दी / ਪੰਜਾਬੀ** language toggle (header chip cycles;
full pills on Login and More).

**Admin panel** — Dashboard (stat cards, cost-vs-1.25%-cap bar chart, points
liability, sell-through placeholder, live activity) · Dealers & KYC (approve/hold) ·
Mission builder (type presets) · Reward fulfilment queue · Tally reconciliation
("Release SP") · Broadcast composer. All three data scenarios from the design.

## Structure

```
src/
  lib/            icons (lucide-react wrapper), number formatting
  styles/         design-system tokens (ported verbatim) + global CSS
  app/            dealer app: store (state/actions), i18n, mock data,
                  shared components, screens
  admin/          admin panel + its mock data
public/assets/    logos + product photos from the handoff bundle
scripts/smoke.mjs Playwright smoke test (screenshots every major flow)
```

## Notes / assumptions (from the design's notes card)

- Persona: Rajesh Gupta, Gupta Furniture House, Ludhiana — Shakti Silver,
  ₹1.3L short of Gold. All data is the blueprint's worked example (mock).
- Order = request routed to sales (MVP model), not e-commerce checkout.
- Tier maths uses blueprint placeholders (₹15L Gold threshold).
- Fonts load from Google Fonts; swap in self-hosted woff2 for offline use.
