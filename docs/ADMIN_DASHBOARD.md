# Web Admin Dashboard

> Part of the **SGF Shakti — Dealer Growth Platform** documentation set.
> Related docs: [ARCHITECTURE.md](./ARCHITECTURE.md) · [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) · [POINTS_ENGINE.md](./POINTS_ENGINE.md) · [NAVIGATION_FLOWS.md](./NAVIGATION_FLOWS.md)

---

## 1. Overview

The web admin dashboard is a **Flutter web** application used by two roles:

- **Admin** — full platform control: dealers, products, orders, rewards, gamification config, campaigns, marketing, learning, sales managers, audit, settings.
- **Sales Manager (SM)** — scoped to **assigned dealers** only; monitors growth, approves dealer/marketing/growth requests within scope, but **cannot** edit global gamification config, products, or other regions.

It reuses the shared `core`, `domain`, and Firebase `data` layers from the mobile app (see [ARCHITECTURE.md](./ARCHITECTURE.md) §3, §5). All trust-sensitive mutations (points, order status, redemption settlement) flow through Cloud Functions, not direct writes.

---

## 2. Information Architecture (Sidebar Navigation)

```
┌──────────────────────────┐
│  SGF SHAKTI · ADMIN       │
├──────────────────────────┤
│ ▸ Dashboard / Analytics   │   (A, SM-scoped)
│ ▸ Dealers                 │   (A full, SM scoped)
│ ▸ Products                │   (A only)
│ ▸ Orders                  │   (A full, SM scoped)
│ ▸ Rewards & Redemptions   │   (A full; SM approve scoped)
│ ▸ Gamification Config     │   (A only)
│     • Tiers               │
│     • Points & SKU points │
│     • Campaign Multipliers│
│ ▸ Marketing Requests      │   (A full; SM scoped)
│ ▸ Campaigns               │   (A only)
│ ▸ Announcements           │   (A only)
│ ▸ Learning Center         │   (A only)
│ ▸ Sales Managers          │   (A only)
│ ▸ Audit Log               │   (A; SM scoped optional)
│ ▸ Settings                │   (A only)
└──────────────────────────┘
```

Legend: **A** = Admin, **SM** = Sales Manager (scoped to assigned dealers/region).

---

## 3. Section Specifications

### 3.1 Dashboard / Analytics

**Screens:** Analytics Home.

**Widgets:**
| Widget | Description |
|---|---|
| Sales by Region | Bar/map of order totals per region (SM sees own region). |
| Sales by Dealer | Top dealers by confirmed order value. |
| Growth Trends | Time-series of orders, points issued, new dealers. |
| Tier Distribution | Donut of dealers per tier (Bronze→Diamond). |
| Redemption Rate | % of issued points redeemed; redemptions over time. |
| Marketing ROI | Growth-service requests vs. dealer order uplift post-service. |
| **Points Liability** | Outstanding unredeemed points balance (a financial liability) with projected expiry releases. |
| KPI cards | Active dealers, pending approvals, orders awaiting confirm, low-stock rewards. |

**Key actions:** filter by date range / region / tier; drill-through to dealer or order; export CSV.

Data sources: precomputed analytics/rollup reads (see [ARCHITECTURE.md](./ARCHITECTURE.md) §8) and `leaderboard_snapshots`, never raw peer exposure.

---

### 3.2 Dealers

**Screens:** Dealers List · Dealer Detail · Approval Queue.

**Table columns:** Business Name · Owner · Phone · Region · Tier · Quarter Points · Points Balance · Status · Assigned SM · Created.

**Dealer Detail tabs:** Profile (GST/PAN/address), Orders, Points Ledger (read-only audit view), Redemptions, Growth Requests, Achievements, Activity timeline.

**Key actions:**
- Approve / reject / suspend dealer.
- Assign / reassign Sales Manager.
- View immutable points ledger (no edits; corrections only via Functions).
- Trigger manual recompute (Admin only) where permitted.

**Dealer approval flow:**
```
New signup (status=pending)  ──►  Approval Queue
        │
        ▼
 Reviewer (Admin or assigned SM) opens Dealer Detail
        │
        ├─ Verify GST / PAN / business info
        │
        ├─ APPROVE ──► Cloud Function: set status=approved,
        │               set custom claims (role=dealer),
        │               grant signup starter points (bonus ledger entry),
        │               write audit_log(dealer.approved)
        │
        └─ REJECT  ──► status stays restricted, reason recorded, audit logged
```
SMs may approve only dealers within their region/scope; Admins approve any.

---

### 3.3 Products (Admin only)

**Screens:** Products List · Product Editor.

**Table columns:** SKU · Name · Category (chair/table) · Dealer Price · Pack Size · Margin/Unit · Points/Unit · Stock Status · Early-Access Tier · Active.

**Product Editor form fields:** name, category, subCategory, description, dealerPrice, mrp, packSize, **marginPerUnit** (internal), **pointsPerUnit** (margin-aware), stockStatus, images upload (Cloud Storage), `earlyAccessTier`, `arAssetUrl` (reserved), active toggle.

**Key actions:** create/edit/deactivate product; bulk update stock; bulk import via CSV. Saving `pointsPerUnit` here sets the per-SKU default; overrides live in Gamification Config (§3.6).

---

### 3.4 Orders

**Screens:** Orders List · Order Detail.

**Table columns:** Order ID · Dealer · Region · Total · Status · Points To Earn · Points Credited · Placed At.

**Order Detail:** line items, totals, full `statusHistory`, points panel (estimate vs credited, applied multiplier, linked ledger entry).

**Key actions:**
- Advance status through `Placed → Confirmed → Manufacturing → Dispatched → In Transit → Delivered`.
- **Confirm** triggers `creditPointsOnConfirm` (margin-aware points credited to ledger — see [POINTS_ENGINE.md](./POINTS_ENGINE.md)).
- **Cancel / mark returned** triggers `reversePointsOnCancelOrReturn`.
- Add status notes; every transition is audit-logged.

SMs see only orders of assigned dealers.

---

### 3.5 Rewards & Redemptions

**Screens:** Rewards Catalog · Reward Editor · Redemptions Queue · Redemption Detail.

**Rewards table:** Title · Category (electronics/vehicle/travel/marketing_credits) · Points Required · Stock · Min Tier · Active.
**Reward Editor:** title, description, category, pointsRequired, stock, images, minTier (gate luxury rewards), active.

**Redemptions table:** Dealer · Reward · Points Spent · Status (requested/approved/fulfilled/cancelled) · Requested At.

**Key actions:**
- Approve → fulfill redemptions; attach `fulfilmentRef`.
- Cancel before fulfillment → Function refunds points (compensating ledger entry).
- Manage reward stock; catalog examples: smartwatch, TV, laptop, iPhone, scooter, trips, marketing credits.

SMs may approve redemptions for assigned dealers; Admin manages the global catalog.

---

### 3.6 Gamification Config (Admin only)

The configuration UI that drives the [POINTS_ENGINE.md](./POINTS_ENGINE.md). Backed by `tiers` and `gamification_config`/`points_rules` (see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) §7–§8).

**3.6.1 Tiers screen**
- Table: Tier · Level · Quarterly Threshold · Benefits · Color.
- Form: edit quarterly point thresholds and the benefit list per tier (marketing creatives, Google Business, social setup, local ads, early access, influencer campaigns, priority inventory, luxury rewards, exclusive events, co-branded marketing, VIP recognition). Optional Diamond seat cap for scarcity.

**3.6.2 Points & SKU Points screen (points-rules configuration UI)**
- **Signup starter points** (endowed progress) input.
- **Default expiry window (days)** input.
- **Points-per-SKU table:** searchable list of products showing default `pointsPerUnit` and an **override** column. Editing an override writes to `pointsPerSkuOverrides`. A helper column shows `marginPerUnit` and a suggested points value to keep points **margin-aware** (admin sees the margin-to-points relationship explicitly).
- Validation: warns if a low-margin SKU is assigned disproportionately high points (anti-gaming guardrail).

**3.6.3 Campaign Multipliers screen**
- Table: Campaign · Multiplier · Window (start/end) · Scope (all / region / category / SKU set).
- Form: create time-bound multipliers (e.g. "Diwali Double Points", 2.0x). Overlap validation prevents ambiguous active multipliers.

All saves are audit-logged (`points_rules.updated`, `tiers.updated`) and never retroactively alter already-credited ledger entries.

---

### 3.7 Marketing Requests

**Screens:** Requests Queue · Request Detail.
Backed by `growth_service_requests` (Google Business setup, social setup, local ads, influencer campaigns).

**Table columns:** Dealer · Type · Status · Assigned SM · Created.
**Key actions:** assign SM, advance status (`requested → in_review → in_progress → completed/rejected`), add notes, attach deliverables. SMs work their assigned queue and can approve/progress requests for their dealers.

---

### 3.8 Campaigns (Admin only)

**Screens:** Campaigns List · Campaign Editor.
Marketing/promotional campaigns (distinct from points multipliers, though a campaign may reference a multiplier). Fields: name, objective, audience (tiers/regions), linked multiplier, schedule, creatives. Used to coordinate pushes, announcements, and points boosts.

---

### 3.9 Announcements (Admin only)

**Screens:** Announcements List · Announcement Editor.
Backed by `announcements`. Fields: title, body, image, audience (all/tiers/regions), publish & expiry. Publishing fans out FCM notifications via `sendNudges`/broadcast Function.

---

### 3.10 Learning Center (Admin only)

**Screens:** Modules List · Module Editor · Quiz Builder.
Backed by `learning_modules`. Fields: title, description, video upload, duration, quiz questions (options + correct index), pass threshold, `pointsAwarded`, optional min tier. Analytics: completion rate, pass rate, points issued via learning.

---

### 3.11 Sales Managers (Admin only)

**Screens:** SM List · SM Detail.
**Table columns:** Name · Region · # Assigned Dealers · Active.
**Key actions:** create SM, set role claim, assign/unassign dealers (updates `assignedDealers`, which drives security-rule scoping — see [ARCHITECTURE.md](./ARCHITECTURE.md) §6).

---

### 3.12 Audit Log

**Screens:** Audit Log viewer.
Backed by `audit_logs`. **Table columns:** Timestamp · Actor · Role · Action · Target · Before→After.
Read-only, filterable by actor/action/date. Captures approvals, status overrides, gamification config changes, manual ledger operations. SMs (optionally) see only entries within their scope.

---

### 3.13 Settings (Admin only)

**Screens:** Platform Settings.
Environment/config-level toggles: feature flags (AR viewer, AI reorder recos — see [ARCHITECTURE.md](./ARCHITECTURE.md) §8), default region list, notification templates, current quarter label, branding/theme.

---

## 4. Role-Based Access (Admin vs Sales Manager)

| Capability | Admin | Sales Manager |
|---|---|---|
| View analytics | Global | **Scoped** to assigned dealers / region |
| Dealers: view | All | Assigned only |
| Dealers: approve / suspend | Yes | Assigned scope only |
| Assign Sales Managers | Yes | No |
| Products: create/edit | Yes | No (read-only) |
| Orders: view | All | Assigned dealers only |
| Orders: advance status | Yes | Assigned dealers (per policy) |
| Rewards catalog | Manage | Read |
| Redemptions: approve/fulfill | All | Assigned dealers only |
| Gamification config (tiers/points/multipliers) | **Yes** | **No** |
| Marketing/growth requests | All | Assigned queue |
| Campaigns / Announcements / Learning | Yes | No |
| Sales Managers admin | Yes | No |
| Audit Log | Full | Scoped (optional) |
| Settings | Yes | No |

Scoping is enforced both in the UI (route guards / hidden nav) and authoritatively by **Firestore security rules + custom claims** (`role`, `assignedDealers`). SMs are intentionally limited to monitoring growth and approving in-scope requests; global economy levers stay with Admin.

---

## 5. Cross-Document Map

| Concern | Document |
|---|---|
| Layers, roles, Cloud Functions, security model | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Collections/fields behind every screen | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| How points/tiers/multipliers configured here behave | [POINTS_ENGINE.md](./POINTS_ENGINE.md) |
| Dealer-app counterpart flows | [NAVIGATION_FLOWS.md](./NAVIGATION_FLOWS.md) |
