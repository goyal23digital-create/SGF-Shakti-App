# Points Engine & Gamification

> Part of the **SGF Shakti — Dealer Growth Platform** documentation set.
> Related docs: [ARCHITECTURE.md](./ARCHITECTURE.md) · [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) · [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) · [NAVIGATION_FLOWS.md](./NAVIGATION_FLOWS.md)

---

## 1. The Formula

Points for a confirmed order are computed by the `creditPointsOnConfirm` Cloud Function:

```
pointsEarned = ( Σ over lineItems [ effectivePPU(sku) × qty ] ) × activeCampaignMultiplier
```

Where:

```
effectivePPU(sku) = gamification_config.pointsPerSkuOverrides[sku]
                    ?? products[sku].pointsPerUnit          // margin-aware, admin-set

activeCampaignMultiplier =
    multiplier of the campaign whose [startsAt, endsAt] window contains the
    order's confirmedAt AND whose scope matches the order (all / region /
    category / sku-set); otherwise 1.0
```

- `effectivePPU` and `activeCampaignMultiplier` are **snapshotted onto the order** at confirm time (`lineItems[].pointsPerUnit`, `order.appliedMultiplier`) so later config changes never retroactively alter credited points.
- The result is written as a single **`earn`** entry in the append-only `points_ledger` and rolled up into `dealers.pointsBalance`, `quarterPoints`, and `lifetimePoints` in the same transaction.

---

## 2. Why Margin-Based (Not Price-Based)

Points are tied to **`pointsPerUnit`**, which the admin sets per SKU as a function of the manufacturer's **`marginPerUnit`** — never to the sale/dealer price.

**The anti-gaming rationale:** If points scaled with revenue or price, a dealer could maximize points by ordering large volumes of the **cheapest, lowest-margin** SKUs — generating points without generating profit for the manufacturer. By pegging points to margin, the program rewards **profitable** purchasing behavior:

- High-margin products carry **more** points per unit.
- Low-margin products carry **fewer** points per unit.
- A dealer cannot inflate points by farming low-margin SKUs.

`marginPerUnit` is **internal/admin-only** and not exposed to dealers; dealers see only the resulting `pointsPerUnit`. The admin UI (see [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) §3.6) shows margin alongside points and warns when a low-margin SKU is assigned disproportionate points.

---

## 3. Admin Configuration (Config-Driven Engine)

Everything the engine needs lives in editable config (`tiers`, `gamification_config`/`points_rules`; see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) §7–§8). The admin configures:

| Lever | Where | Effect |
|---|---|---|
| **Points per SKU** | Product `pointsPerUnit` default + `pointsPerSkuOverrides` | Base margin-aware earn rate per unit. |
| **Quarterly tier thresholds** | `tiers[].quarterlyThreshold` | Points needed each quarter to hold/reach a tier. |
| **Campaign multipliers** | `gamification_config.campaignMultipliers[]` | Time-bound, scope-bound earn boosts (e.g. 2.0x Diwali). |
| **Expiry window** | `gamification_config.defaultExpiryWindowDays` | Lifespan of earned/bonus points. |
| **Signup starter points** | `gamification_config.signupStarterPoints` | Endowed-progress grant on approval. |

No code deploy is required to retune the economy — the engine reads config at runtime.

---

## 4. Ledger Lifecycle & Audit Guarantees

The `points_ledger` is **immutable and append-only**. Every movement is a new row; nothing is edited or deleted.

| `type` | Sign | Trigger | Source field |
|---|---|---|---|
| `earn` | + | Order → **Confirmed** | `sourceOrderId` |
| `bonus` | + | Signup approval / quiz pass | `reason` / `quizAttemptId` |
| `redeem` | − | Reward redemption | `rewardId`, `redemptionId` |
| `reverse` | − | Order **Cancelled/Returned** | `sourceOrderId` |
| `expiry` | − | Scheduled expiry sweep | (consumes an `earn`/`bonus` lot) |

**Audit guarantees:**
- **No client writes.** Security rules deny all writes to `points_ledger`; only Cloud Functions (Admin SDK) append (see [ARCHITECTURE.md](./ARCHITECTURE.md) §6–§7).
- **Idempotency.** Each entry carries an `idempotencyKey` (e.g. `earn:ORD-...`) so retries never double-credit.
- **Running balance.** Every entry records `balanceAfter`, enabling reconstruction and reconciliation against `dealers.pointsBalance`.
- **Corrections are appends.** Mistakes are fixed by a compensating `reverse`/adjustment entry, preserving the full history; privileged ops also write to `audit_logs`.

---

## 5. Points Lifecycle (Pending → Credited → Reversed → Expiry)

```
PLACED            CONFIRMED               CANCEL/RETURN            EXPIRY (time)
─ pending ──────► credited ────────────► reversed ─────────────► expired
 estimate only    +earn entry,            −reverse entry          −expiry entry on
 (no ledger)      expiresAt set,          (negates earn),         unredeemed remainder,
 order.points     rollups updated         rollups restored        lot.expired=true
 ToBeEarned
```

1. **Pending** — at order **Placed**, `order.pointsToBeEarned` is an estimate; balance unchanged.
2. **Credited** — at **Confirmed**, an `earn` entry is appended with `expiresAt = confirmedAt + defaultExpiryWindowDays`; rollups updated; `order.pointsCredited` and `appliedMultiplier` set.
3. **Reversed** — on **Cancelled/Returned**, a `reverse` entry negates the earn; idempotent; `quarterPoints` and balance restored (may trigger tier re-evaluation).
4. **Expiry** — the daily sweep finds lots past `expiresAt`, appends an `expiry` entry for the unredeemed remainder, and marks the lot `expired=true` (FIFO redemption ordering means oldest lots are consumed first).

(Same diagram and storage fields appear in [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) §23–§24.)

---

## 6. Tier Threshold Evaluation (Quarterly)

- Tiers ascend **Bronze → Silver → Gold → Platinum → Diamond**.
- A dealer's tier is based on **`quarterPoints`** (points earned within the current quarter), compared against `tiers[].quarterlyThreshold`.
- `recomputeTiersQuarterly` (scheduled at quarter boundaries) sums each dealer's quarterly `earn`+`bonus` (minus reversals) from the ledger, assigns the highest tier whose threshold is met, updates `dealers.tier`, snapshots history, and fires tier-change nudges.
- Within a quarter the Home dashboard shows live progress toward the next threshold (goal-gradient).
- Optional **Diamond seat cap** introduces scarcity ("Only 3 Diamond spots remain").

Higher tiers progressively unlock: marketing creatives, Google Business setup, social media setup, local advertising, early product access, influencer campaigns, priority inventory, luxury rewards, exclusive events, co-branded marketing, and VIP annual recognition.

---

## 7. Gamification Principles → Features → Nudge Copy

| Principle | What it means | Concrete feature | Example nudge copy |
|---|---|---|---|
| **Goal-gradient effect** | Motivation rises as the goal nears | Points ring + "distance to next tier" on Home; progress accelerates visually near threshold | "You're 500 points from **Gold** — one more order could do it." |
| **Endowed progress** | Starting with progress already made boosts completion | `signupStarterPoints` granted on approval (a `bonus` ledger entry) so dealers begin partway up Bronze→Silver | "Welcome! We've credited **500 starter points** to kick off your journey." |
| **Loss aversion** | People fear losing what they have | Expiry warnings; tier-drop warnings near quarter end | "**2,000 points expire in 7 days** — redeem before you lose them." / "Order soon to **keep your Gold tier** this quarter." |
| **Social proof** | People follow peers' behavior | Leaderboard percentile **bands** & badges (Top 10% / Top 25% / Fastest Growing / Regional Champions) — never raw peer numbers | "You're in the **Top 25%** of dealers in NORTH-HR this quarter." |
| **Status signaling** | Visible status motivates | Tier badges, exclusive tier benefits, VIP recognition, locked higher-tier perks shown as aspirational | "Unlock **influencer campaigns** and **luxury rewards** at Platinum." |
| **Scarcity** (status + loss) | Limited supply drives action | Diamond seat cap, limited reward stock | "**Only 3 Diamond spots remain** this quarter." |

**Leaderboard privacy is non-negotiable:** peers' raw sales/points are never exposed — only percentile bands and badges from `leaderboard_snapshots` (see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) §16).

---

## 8. Worked Numeric Examples

Assume these SKUs (margin-aware points already set by admin):

| SKU | Category | dealerPrice | marginPerUnit | pointsPerUnit |
|---|---|---|---|---|
| `CHR-ECO-RED-001` | chair | ₹380 | ₹60 | 12 |
| `TBL-DIN-4S-009` | table | ₹1,200 | ₹200 | 40 |
| `CHR-CHEAP-050` | chair | ₹150 | ₹10 | 2 |

### Example A — Standard order (no campaign)

Order: 100 × `CHR-ECO-RED-001`, 20 × `TBL-DIN-4S-009`. No active multiplier (×1.0).

```
chairs:  12 × 100 = 1,200
tables:  40 ×  20 =   800
subtotal points  = 2,000
pointsEarned     = 2,000 × 1.0 = 2,000
```
On **Confirm**: ledger `earn` +2,000, `balanceAfter` increases by 2,000, `quarterPoints` += 2,000.

### Example B — Campaign multiplier (Diwali ×2.0)

Same order confirmed inside the Diwali window (scope = all):
```
pointsEarned = 2,000 × 2.0 = 4,000
```
`order.appliedMultiplier = 2.0` is snapshotted; ledger `earn` = +4,000.

### Example C — Anti-gaming demonstration

A dealer tries to farm points with the cheapest SKU:
Order: 1,000 × `CHR-CHEAP-050` (₹150 each, only 2 pts/unit).
```
revenue spent = 1,000 × 150 = ₹150,000
pointsEarned  = 2 × 1,000 × 1.0 = 2,000
```
Compare to Example A, which spent ₹62,000 for the **same 2,000 points** but on **higher-margin** goods. Because points track margin, the low-margin spree yields no advantage — exactly the intended behavior.

### Example D — Reversal on return

After Example A is confirmed (+2,000), the dealer returns the whole order:
```
reverse entry = −2,000
balanceAfter restored to pre-order value
quarterPoints −= 2,000  (may trigger tier re-evaluation)
```
Both entries (the original `earn` and the `reverse`) remain permanently in the ledger.

### Example E — Tier evaluation

Thresholds (quarterly): Bronze 0, Silver 3,000, Gold 8,000, Platinum 20,000, Diamond 45,000.
Dealer's `quarterPoints` after several confirmed orders = **9,200**.
```
9,200 ≥ 8,000 (Gold) and < 20,000 (Platinum)  ⇒  tier = Gold
distance to Platinum = 20,000 − 9,200 = 10,800
Home nudge: "You're 10,800 points from Platinum."
```

### Example F — Expiry

An `earn` lot of 2,000 (expiry window 365 days) is partially redeemed (500 spent via FIFO). At `expiresAt`, the 1,500 unredeemed remainder expires:
```
expiry entry = −1,500
lot.expired  = true
```

---

## 9. End-to-End Sequence (Order → Points)

```
Dealer places order  ──►  order.status = Placed, pointsToBeEarned (estimate, PENDING)
        │
Admin/SM confirms    ──►  order.status = Confirmed
        │                      │
        │                      ▼  (Cloud Function creditPointsOnConfirm)
        │            compute pointsEarned (margin-aware × multiplier)
        │            append points_ledger EARN (idempotent), set expiresAt
        │            update dealers.pointsBalance / quarterPoints / lifetimePoints
        │            set order.pointsCredited + appliedMultiplier
        │                      │
        ▼                      ▼
 quarterly job re-evaluates tier  ──►  tier-change nudge via FCM
 daily job expires old lots       ──►  expiry ledger entries
 cancel/return                    ──►  reverse ledger entry
```

---

## 10. Cross-Document Map

| Concern | Document |
|---|---|
| Functions, security, environments | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Ledger/config/tier/leaderboard schemas | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| Where admins set these levers | [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) |
| Dealer-facing screens & nudges | [NAVIGATION_FLOWS.md](./NAVIGATION_FLOWS.md) |
