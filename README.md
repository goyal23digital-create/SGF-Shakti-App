# SGF Shakti — Shakti Club

**Shakti Club** is the SGF Shakti dealer loyalty app ("Jitna Shakti bechoge,
utni Shakti kamaoge") — points on paid invoices, tiers, missions, scratch
cards, leaderboards, a rewards store — plus the head-office **admin panel**.

| Where | What |
|---|---|
| [`shakti-club/`](shakti-club/) | The app: React + Vite + TypeScript, wrapped with Capacitor for iOS/Android. Full docs in its [README](shakti-club/README.md) |
| [`project/`](project/) | Original Claude Design prototypes and the SGF design system |
| [`chats/`](chats/) | The Shakti Club programme blueprint (points economy, tiers, anti-fraud, launch plan) |
| [`DESIGN-HANDOFF.md`](DESIGN-HANDOFF.md) | Notes from the design handoff bundle |

## Live site

Deployed on Vercel from this repo (`vercel.json` builds `shakti-club/` → `shakti-club/dist`).

- Dealer app: `/`
- Admin panel: `/#/admin`

## Run locally

```bash
cd shakti-club
npm install
npm run dev
```
