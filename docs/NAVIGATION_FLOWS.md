# Dealer App Navigation & Flows

> Part of the **SGF Shakti — Dealer Growth Platform** documentation set.
> Related docs: [ARCHITECTURE.md](./ARCHITECTURE.md) · [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) · [POINTS_ENGINE.md](./POINTS_ENGINE.md) · [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md)

---

## 1. App Shell Overview

The dealer mobile app (Flutter, Android/iOS) opens at a splash screen, authenticates via **Firebase Auth phone OTP**, runs first-time **onboarding**, then lands in a **bottom-navigation shell** with five primary tabs:

```
┌─────────────────────────────────────────────────────────┐
│                     MAIN SHELL                            │
│  (persistent bottom navigation)                          │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│  Home /   │ Catalog  │ Rewards  │  Growth  │  Profile     │
│ Dashboard │          │          │          │              │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
```

Secondary destinations (**Orders, Cart/Checkout, Leaderboard, detail screens, Learning, Notifications**) are reached from within these tabs, not from the bottom bar.

```
Home ─► Order tracking, Tier detail, Leaderboard, Notifications, Announcements
Catalog ─► Product detail ─► Cart ─► Checkout ─► Order placed ─► Order tracking
Rewards ─► Reward detail ─► Redemption confirm ─► My redemptions
Growth ─► Marketing creatives, Service request, Learning modules ─► Video ─► Quiz
Profile ─► Business info, Orders, Notifications, Settings, Logout
```

---

## 2. Complete Screen / Route Map

| Route path | Screen | Purpose |
|---|---|---|
| `/splash` | Splash | Brand splash, bootstraps DI + auth state. |
| `/login` | OTP Login | Enter phone, request OTP. |
| `/login/verify` | OTP Verify | Enter 6-digit code, verify. |
| `/onboarding` | Onboarding (stepper) | Capture business name, GST, PAN, address. |
| `/onboarding/pending` | Approval Pending | Shown while `status=pending`. |
| `/home` | Home / Dashboard | Points ring, tier progress, nudges, quick reorder, announcements. |
| `/home/tier` | Tier Detail | Tier benefits, progress to next tier, scarcity nudges. |
| `/home/notifications` | Notifications | In-app notifications & nudges. |
| `/leaderboard` | Leaderboard | Percentile bands & badges only (no raw peer numbers). |
| `/catalog` | Catalog | Browse chairs & tables, filter/search. |
| `/catalog/product/:sku` | Product Detail | Specs, dealer price, pack size, points/unit, add to cart, favorite. |
| `/cart` | Cart | Review line items, qty edits, estimated points. |
| `/checkout` | Checkout | Confirm address, totals, place order. |
| `/order/placed/:orderId` | Order Placed | Confirmation + pending points estimate. |
| `/orders` | Orders List | All orders with status. |
| `/orders/:orderId` | Order Tracking | Status timeline `Placed→…→Delivered`, points credited. |
| `/rewards` | Rewards Marketplace | Catalog: smartwatch, TV, laptop, iPhone, scooter, trips, marketing credits. |
| `/rewards/:rewardId` | Reward Detail | Points required, stock, tier gate, redeem CTA. |
| `/rewards/redeem/:rewardId` | Redeem Confirm | Confirm spend, address (if physical). |
| `/rewards/redemptions` | My Redemptions | Redemption history & status. |
| `/growth` | Growth Hub | Entry to creatives, services, learning. |
| `/growth/creatives` | Marketing Creatives | Festival/WhatsApp/Instagram/poster assets. |
| `/growth/services` | Growth Services | Request Google Business / social / local ads / influencer. |
| `/growth/services/request/:type` | Service Request Form | Submit a growth-service request. |
| `/growth/services/requests` | My Service Requests | Track request status. |
| `/learning` | Learning Modules | List of training modules. |
| `/learning/:moduleId` | Module / Video | Watch training video. |
| `/learning/:moduleId/quiz` | Quiz | Take quiz; pass awards points. |
| `/learning/:moduleId/result` | Quiz Result | Score + points awarded. |
| `/profile` | Profile | Business summary, tier, points. |
| `/profile/business` | Business Info | View/edit business details. |
| `/profile/settings` | Settings | Notifications, language, logout. |

Routing uses named routes with **auth + role + status guards** (see [ARCHITECTURE.md](./ARCHITECTURE.md) §6): unauthenticated → `/login`; authenticated but `pending` → `/onboarding/pending`; approved → `/home`.

---

## 3. Flow Diagrams

### 3.1 Onboarding Flow

```
┌─────────┐
│ /splash  │  bootstrap auth state
└────┬─────┘
     │ not signed in
     ▼
┌──────────┐    request OTP    ┌────────────────┐  verify code  ┌──────────────────────┐
│ /login    │ ────────────────►│ /login/verify   │ ────────────►│ Firebase Auth session │
└──────────┘                   └────────────────┘               └──────────┬───────────┘
                                                                            │
                              new user (no dealer doc)                       │ existing approved dealer
                                          │                                  │
                                          ▼                                  ▼
                              ┌──────────────────────┐                ┌──────────┐
                              │ /onboarding (stepper)  │                │  /home    │
                              │  1 Business name        │                └──────────┘
                              │  2 GST                  │
                              │  3 PAN                  │
                              │  4 Address              │
                              └──────────┬─────────────┘
                                         │ submit (creates dealer, status=pending)
                                         ▼
                              ┌──────────────────────┐   admin/SM approves   ┌──────────┐
                              │ /onboarding/pending    │ ───────────────────►│  /home    │
                              │ (Approval Pending)      │  (starter points     └──────────┘
                              └──────────────────────┘   granted on approve)
```
On approval, **endowed starter points** are granted via a `bonus` ledger entry (see [POINTS_ENGINE.md](./POINTS_ENGINE.md) §5).

---

### 3.2 Order Placement Flow

```
┌──────────┐  tap product  ┌─────────────────────┐  add to cart  ┌────────┐
│ /catalog  │ ─────────────►│ /catalog/product/:sku│ ─────────────►│ /cart   │
└──────────┘               └─────────────────────┘               └───┬────┘
                                                                      │ proceed
                                                                      ▼
                                                              ┌────────────┐
                                                              │ /checkout   │
                                                              │ (totals +   │
                                                              │  est. points)│
                                                              └─────┬──────┘
                                                                    │ place order
                                                                    ▼
                                          creates order (status=Placed,
                                          pointsToBeEarned = estimate, PENDING)
                                                                    │
                                                                    ▼
                                                       ┌────────────────────────┐
                                                       │ /order/placed/:orderId   │
                                                       └───────────┬─────────────┘
                                                                   │ view tracking
                                                                   ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ /orders/:orderId  — status timeline                                          │
   │ Placed ─► Confirmed ─► Manufacturing ─► Dispatched ─► In Transit ─► Delivered│
   │            └─ on CONFIRMED: points CREDITED to ledger (margin-aware)         │
   └───────────────────────────────────────────────────────────────────────────┘
```
Points are only **pending** until an Admin/SM marks the order **Confirmed**, at which point `creditPointsOnConfirm` credits the immutable ledger. Cancel/return reverses them. See [POINTS_ENGINE.md](./POINTS_ENGINE.md) and [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) §24.

---

### 3.3 Reward Redemption Flow

```
┌──────────┐  tap reward   ┌────────────────────┐
│ /rewards  │ ─────────────►│ /rewards/:rewardId  │
└──────────┘               └─────────┬───────────┘
                                     │ redeem
                       balance & tier check (client preview)
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │ /rewards/redeem/:rewardId│
                         │ confirm spend + address  │
                         └───────────┬─────────────┘
                                     │ confirm → callable Function redeemReward
                                     ▼
                  validates balance + stock, writes REDEEM ledger entry,
                  creates redemption (status=requested), decrements stock
                                     │
                                     ▼
                         ┌────────────────────────┐   admin/SM      ┌──────────────┐
                         │ /rewards/redemptions     │ ─────────────► │ approved →    │
                         │ (status tracking)         │  processes     │ fulfilled    │
                         └────────────────────────┘                 └──────────────┘
```
If a redemption is cancelled before fulfillment, points are refunded by a compensating ledger entry.

---

### 3.4 Growth Service Request Flow

```
┌──────────┐        ┌────────────────────┐
│ /growth   │ ──────►│ /growth/services    │  (Google Business / social /
└──────────┘        └─────────┬───────────┘   local ads / influencer)
                              │ pick a service type
                              ▼
                  ┌──────────────────────────────────┐
                  │ /growth/services/request/:type      │
                  │ intake form (business details, goals)│
                  └─────────────────┬───────────────────┘
                                    │ submit → creates growth_service_request
                                    │          (status=requested)
                                    ▼
                  ┌──────────────────────────────────┐  SM/Admin in dashboard
                  │ /growth/services/requests           │  advances status:
                  │ (track status)                       │  requested → in_review →
                  └──────────────────────────────────┘  in_progress → completed
```
Some services are tier-gated; lower tiers see locked items prompting tier progress (status signaling — see [POINTS_ENGINE.md](./POINTS_ENGINE.md) §6). Admin/SM handling is in [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) §3.7.

---

### 3.5 Learning Module + Quiz Flow

```
┌──────────┐  pick module  ┌──────────────────┐  watch  ┌──────────────────────┐
│ /learning │ ─────────────►│ /learning/:id      │ ──────►│ video complete         │
└──────────┘               └──────────────────┘         └──────────┬────────────┘
                                                                    │ start quiz
                                                                    ▼
                                                       ┌──────────────────────┐
                                                       │ /learning/:id/quiz     │
                                                       │ answer questions       │
                                                       └──────────┬─────────────┘
                                                                  │ submit → quiz_attempt
                                                                  ▼
                                          score ≥ passThreshold ?
                                          ┌──────────────┴───────────────┐
                                          │ PASS                          │ FAIL
                                          ▼                               ▼
                          awardQuizPoints → BONUS ledger entry      retry available
                                          │
                                          ▼
                              ┌──────────────────────┐
                              │ /learning/:id/result   │  (shows score + points)
                              └──────────────────────┘
```
Passing a quiz appends a `bonus` ledger entry of `learning_modules.pointsAwarded` (see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) §14–§15).

---

## 4. Home / Dashboard Composition

The `/home` screen is the gamification hub and surfaces:

- **Points ring** — current quarter points with goal-gradient progress toward the next tier.
- **Tier card** — current tier + unlocked benefits, tappable to `/home/tier`.
- **Nudges** — goal-gradient ("You're 500 points from Gold"), loss-aversion (expiring points), scarcity ("Only 3 Diamond spots remain").
- **Quick reorder** — favorites / recent SKUs straight to `/cart`.
- **Announcements** banner and **Leaderboard** entry (percentile bands/badges only).

Mapping of each home element to the underlying gamification principle is detailed in [POINTS_ENGINE.md](./POINTS_ENGINE.md) §6.

---

## 5. Cross-Document Map

| Concern | Document |
|---|---|
| Routing guards, layers, Cloud Functions | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Data behind each screen, points lifecycle | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| Points math & gamification nudges | [POINTS_ENGINE.md](./POINTS_ENGINE.md) |
| Admin/SM side of these flows | [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) |
