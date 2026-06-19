# Database Schema (Cloud Firestore)

> Part of the **SGF Shakti — Dealer Growth Platform** documentation set.
> Related docs: [ARCHITECTURE.md](./ARCHITECTURE.md) · [POINTS_ENGINE.md](./POINTS_ENGINE.md) · [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) · [NAVIGATION_FLOWS.md](./NAVIGATION_FLOWS.md)

---

## 0. Conventions

- Store is **Cloud Firestore** (NoSQL, document/collection).
- Field types use Firestore primitives: `string`, `number` (int/double), `boolean`, `timestamp`, `map`, `array`, `reference`, `geopoint`.
- All money values are stored as **integer paise/cents-free rupees** unless noted (`number`, INR). All points are integers.
- Every mutable document carries `createdAt` and `updatedAt` (`timestamp`).
- **Truth vs rollup:** `points_ledger` is the immutable source of truth for points. Fields like `dealer.pointsBalance` / `dealer.quarterPoints` are denormalized rollups maintained by Cloud Functions for fast reads (see [ARCHITECTURE.md](./ARCHITECTURE.md) §8).
- Doc-ID strategy is noted per collection. "Auto-ID" = Firestore-generated 20-char ID.

---

## 1. `dealers`

**Purpose:** Dealer business + loyalty profile. One per onboarded dealer.
**Document ID:** Firebase Auth `uid` (phone-based identity).

| Field | Type | Notes |
|---|---|---|
| `uid` | string | == doc id |
| `phone` | string | E.164, from Auth |
| `businessName` | string | |
| `ownerName` | string | |
| `gst` | string | GSTIN |
| `pan` | string | PAN |
| `address` | map | `{line1, line2, city, state, pincode}` |
| `geo` | geopoint | optional, for regional analytics |
| `region` | string | sales region code |
| `status` | string | `pending` \| `approved` \| `suspended` |
| `tier` | string | `Bronze`\|`Silver`\|`Gold`\|`Platinum`\|`Diamond` |
| `pointsBalance` | number | rollup: current redeemable balance |
| `quarterPoints` | number | rollup: points earned in current quarter (tier basis) |
| `lifetimePoints` | number | rollup: all-time earned |
| `assignedSalesManagerId` | string | ref to `sales_managers` |
| `approvedBy` | string | admin/SM uid |
| `approvedAt` | timestamp | |
| `fcmTokens` | array<string> | push targets |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "uid": "dlr_8sKp...",
  "phone": "+919812345678",
  "businessName": "Sharma Furniture House",
  "ownerName": "Rohit Sharma",
  "gst": "06ABCDE1234F1Z5",
  "pan": "ABCDE1234F",
  "address": { "line1": "12 Mall Road", "city": "Ambala", "state": "Haryana", "pincode": "134003" },
  "region": "NORTH-HR",
  "status": "approved",
  "tier": "Gold",
  "pointsBalance": 18450,
  "quarterPoints": 9200,
  "lifetimePoints": 64100,
  "assignedSalesManagerId": "sm_2x9...",
  "approvedBy": "adm_001",
  "approvedAt": "2026-01-12T06:30:00Z",
  "fcmTokens": ["fcm_abc..."],
  "createdAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-06-15T08:00:00Z"
}
```

---

## 2. `sales_managers`

**Purpose:** Sales Manager profile + dealer assignment scope.
**Document ID:** Auth `uid`.

| Field | Type | Notes |
|---|---|---|
| `uid` | string | == doc id |
| `name` | string | |
| `phone` / `email` | string | |
| `region` | string | primary region |
| `assignedDealers` | array<string> | dealer uids in scope (drives security rules) |
| `active` | boolean | |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "uid": "sm_2x9...",
  "name": "Anita Verma",
  "email": "anita@sgf.example",
  "region": "NORTH-HR",
  "assignedDealers": ["dlr_8sKp...", "dlr_91aQ..."],
  "active": true,
  "createdAt": "2025-12-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

---

## 3. `admins`

**Purpose:** Platform administrators.
**Document ID:** Auth `uid`.

| Field | Type | Notes |
|---|---|---|
| `uid` | string | == doc id |
| `name` | string | |
| `email` | string | |
| `permissions` | array<string> | fine-grained capability flags (optional) |
| `active` | boolean | |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "uid": "adm_001",
  "name": "Platform Admin",
  "email": "admin@sgf.example",
  "permissions": ["gamification.write", "dealers.approve", "rewards.write"],
  "active": true,
  "createdAt": "2025-11-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

---

## 4. `products`

**Purpose:** Catalog of chairs & tables.
**Document ID:** `sku` (human-readable, stable).

| Field | Type | Notes |
|---|---|---|
| `sku` | string | == doc id |
| `name` | string | |
| `category` | string | `chair` \| `table` |
| `subCategory` | string | e.g. `armchair`, `dining-table` |
| `description` | string | |
| `dealerPrice` | number | INR, price to dealer |
| `mrp` | number | INR, optional reference |
| `packSize` | number | units per pack |
| `marginPerUnit` | number | INR margin to manufacturer (admin-only) |
| `pointsPerUnit` | number | **margin-aware** points per unit (admin-set, see [POINTS_ENGINE.md](./POINTS_ENGINE.md)) |
| `stockStatus` | string | `in_stock` \| `low_stock` \| `out_of_stock` |
| `images` | array<string> | Cloud Storage URLs |
| `arAssetUrl` | string | reserved (glTF/USDZ) for future AR |
| `earlyAccessTier` | string | min tier for early product access (nullable) |
| `active` | boolean | visible in catalog |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "sku": "CHR-ECO-RED-001",
  "name": "EcoComfort Stackable Chair",
  "category": "chair",
  "subCategory": "stackable",
  "description": "Heavy-duty stackable plastic chair.",
  "dealerPrice": 380,
  "mrp": 549,
  "packSize": 10,
  "marginPerUnit": 60,
  "pointsPerUnit": 12,
  "stockStatus": "in_stock",
  "images": ["https://.../chr-eco-red-1.jpg"],
  "earlyAccessTier": null,
  "active": true,
  "createdAt": "2026-01-05T00:00:00Z",
  "updatedAt": "2026-06-10T00:00:00Z"
}
```

> **Why `pointsPerUnit` and not price?** Points are **margin-aware**: the admin sets points per SKU based on the manufacturer's margin per unit, so dealers cannot inflate points by ordering large volumes of low-margin SKUs. See [POINTS_ENGINE.md](./POINTS_ENGINE.md) §2.

---

## 5. `orders`

**Purpose:** Dealer purchase orders. Line items embedded for atomic reads.
**Document ID:** Auto-ID (e.g. `ORD-2026-000123` if using a counter, else auto).

| Field | Type | Notes |
|---|---|---|
| `orderId` | string | == doc id |
| `dealerId` | string | ref `dealers` |
| `region` | string | snapshot for analytics |
| `lineItems` | array<map> | see **Order line item** below |
| `subtotal` | number | INR |
| `tax` | number | INR |
| `total` | number | INR |
| `status` | string | `Placed`\|`Confirmed`\|`Manufacturing`\|`Dispatched`\|`In Transit`\|`Delivered` (+ terminal `Cancelled`/`Returned`) |
| `statusHistory` | array<map> | `[{status, at, byUid, note}]` |
| `pointsToBeEarned` | number | estimate at placement (pending) |
| `pointsCredited` | number | actual credited on **Confirmed** (0 until then) |
| `pointsLedgerEntryId` | string | the `earn` entry id (nullable) |
| `appliedMultiplier` | number | campaign multiplier captured at confirm |
| `placedAt` | timestamp | |
| `confirmedAt` | timestamp | nullable |
| `deliveredAt` | timestamp | nullable |
| `createdAt` / `updatedAt` | timestamp | |

### Order line item (embedded map)

| Field | Type | Notes |
|---|---|---|
| `sku` | string | |
| `name` | string | snapshot |
| `category` | string | |
| `qty` | number | units |
| `dealerPrice` | number | snapshot at order time |
| `pointsPerUnit` | number | snapshot at order time |
| `lineTotal` | number | `qty × dealerPrice` |
| `linePoints` | number | `qty × pointsPerUnit` (pre-multiplier) |

```json
{
  "orderId": "ORD-2026-000123",
  "dealerId": "dlr_8sKp...",
  "region": "NORTH-HR",
  "lineItems": [
    { "sku": "CHR-ECO-RED-001", "name": "EcoComfort Stackable Chair", "category": "chair",
      "qty": 100, "dealerPrice": 380, "pointsPerUnit": 12, "lineTotal": 38000, "linePoints": 1200 },
    { "sku": "TBL-DIN-4S-009", "name": "Family 4-Seater Table", "category": "table",
      "qty": 20, "dealerPrice": 1200, "pointsPerUnit": 40, "lineTotal": 24000, "linePoints": 800 }
  ],
  "subtotal": 62000, "tax": 11160, "total": 73160,
  "status": "Confirmed",
  "statusHistory": [
    { "status": "Placed", "at": "2026-06-18T05:00:00Z", "byUid": "dlr_8sKp..." },
    { "status": "Confirmed", "at": "2026-06-18T09:00:00Z", "byUid": "adm_001" }
  ],
  "pointsToBeEarned": 2000,
  "pointsCredited": 2000,
  "pointsLedgerEntryId": "led_ab12...",
  "appliedMultiplier": 1.0,
  "placedAt": "2026-06-18T05:00:00Z",
  "confirmedAt": "2026-06-18T09:00:00Z",
  "deliveredAt": null,
  "createdAt": "2026-06-18T05:00:00Z",
  "updatedAt": "2026-06-18T09:00:00Z"
}
```

---

## 6. `points_ledger`

**Purpose:** **Immutable, append-only** record of every points movement. Single source of truth for balances. Written **only** by Cloud Functions.
**Document ID:** Auto-ID.

| Field | Type | Notes |
|---|---|---|
| `entryId` | string | == doc id |
| `dealerId` | string | ref `dealers` |
| `type` | string | `earn`\|`redeem`\|`reverse`\|`bonus`\|`expiry` |
| `points` | number | signed delta (+earn/bonus, −redeem/reverse/expiry) |
| `balanceAfter` | number | running balance after this entry |
| `sourceOrderId` | string | for `earn`/`reverse` (nullable) |
| `rewardId` | string | for `redeem` (nullable) |
| `redemptionId` | string | for `redeem` (nullable) |
| `quizAttemptId` | string | for `bonus` from learning (nullable) |
| `multiplierApplied` | number | for `earn` (nullable) |
| `reason` | string | human note (e.g. "Signup starter points") |
| `idempotencyKey` | string | guards double-writes |
| `quarter` | string | e.g. `2026-Q2` (for tier sums) |
| `createdAt` | timestamp | |
| `expiresAt` | timestamp | for `earn`/`bonus` lots; nullable |
| `expired` | boolean | set true when an `expiry` entry consumes this lot |

> **Append-only guarantee:** documents are never updated or deleted. Corrections are made by appending a `reverse`/compensating entry. Security rules deny all client writes; even Admin edits go through Functions which only append.

```json
{
  "entryId": "led_ab12...",
  "dealerId": "dlr_8sKp...",
  "type": "earn",
  "points": 2000,
  "balanceAfter": 18450,
  "sourceOrderId": "ORD-2026-000123",
  "multiplierApplied": 1.0,
  "reason": "Order confirmed",
  "idempotencyKey": "earn:ORD-2026-000123",
  "quarter": "2026-Q2",
  "createdAt": "2026-06-18T09:00:00Z",
  "expiresAt": "2027-06-18T09:00:00Z",
  "expired": false
}
```

---

## 7. `tiers`

**Purpose:** Tier configuration: quarterly thresholds + unlocked benefits.
**Document ID:** tier name (`bronze`, `silver`, `gold`, `platinum`, `diamond`).

| Field | Type | Notes |
|---|---|---|
| `name` | string | display name |
| `level` | number | 1..5 ordering |
| `quarterlyThreshold` | number | min `quarterPoints` to hold tier |
| `benefits` | array<string> | unlocked capabilities |
| `color` / `iconUrl` | string | UI styling |
| `diamondSeatsTotal` | number | optional scarcity cap (Diamond) |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "name": "Gold",
  "level": 3,
  "quarterlyThreshold": 8000,
  "benefits": ["marketing_creatives", "google_business_setup", "social_media_setup", "local_advertising", "early_product_access"],
  "color": "#D4AF37",
  "createdAt": "2025-11-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

**Reference benefit taxonomy (ascending unlocks):** `marketing_creatives`, `google_business_setup`, `social_media_setup`, `local_advertising`, `early_product_access`, `influencer_campaigns`, `priority_inventory`, `luxury_rewards`, `exclusive_events`, `co_branded_marketing`, `vip_annual_recognition`.

---

## 8. `points_rules` / `gamification_config`

**Purpose:** Config-driven engine parameters. Drives points crediting and gamification. Admin-writable only.
**Document ID:** `gamification_config` is typically a **singleton** doc id `current`; `points_rules` may use one doc per SKU override or one config doc with maps.

| Field | Type | Notes |
|---|---|---|
| `signupStarterPoints` | number | endowed-progress starter grant |
| `defaultExpiryWindowDays` | number | lifespan of earned points |
| `pointsPerSkuOverrides` | map<string,number> | `{sku: pointsPerUnit}` overrides product default |
| `campaignMultipliers` | array<map> | `[{id, name, multiplier, startsAt, endsAt, scope}]` |
| `tierEvaluationBasis` | string | `quarterly` |
| `currentQuarter` | string | e.g. `2026-Q2` |
| `updatedBy` | string | admin uid |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "id": "current",
  "signupStarterPoints": 500,
  "defaultExpiryWindowDays": 365,
  "pointsPerSkuOverrides": { "CHR-ECO-RED-001": 14 },
  "campaignMultipliers": [
    { "id": "diwali2026", "name": "Diwali Double Points", "multiplier": 2.0,
      "startsAt": "2026-10-20T00:00:00Z", "endsAt": "2026-11-05T23:59:59Z", "scope": "all" }
  ],
  "tierEvaluationBasis": "quarterly",
  "currentQuarter": "2026-Q2",
  "updatedBy": "adm_001",
  "updatedAt": "2026-06-15T00:00:00Z"
}
```

> The effective `pointsPerUnit` for a SKU = `pointsPerSkuOverrides[sku] ?? products[sku].pointsPerUnit`. The active multiplier is the campaign whose window contains the order's confirm time (scope-matched). See [POINTS_ENGINE.md](./POINTS_ENGINE.md).

---

## 9. `rewards`

**Purpose:** Aspirational rewards marketplace catalog.
**Document ID:** Auto-ID or stable `rwd_*`.

| Field | Type | Notes |
|---|---|---|
| `rewardId` | string | == doc id |
| `title` | string | e.g. "Apple iPhone 16" |
| `description` | string | |
| `category` | string | `electronics`\|`vehicle`\|`travel`\|`marketing_credits` |
| `pointsRequired` | number | cost in points |
| `stock` | number | available units |
| `images` | array<string> | |
| `minTier` | string | gate luxury rewards by tier (nullable) |
| `active` | boolean | |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "rewardId": "rwd_iphone16",
  "title": "Apple iPhone 16",
  "description": "Redeem your points for the latest iPhone.",
  "category": "electronics",
  "pointsRequired": 95000,
  "stock": 5,
  "images": ["https://.../iphone16.jpg"],
  "minTier": "Platinum",
  "active": true,
  "createdAt": "2026-02-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

**Catalog examples:** smartwatch, TV, laptop, iPhone, scooter, trips, marketing credits.

---

## 10. `redemptions`

**Purpose:** Lifecycle of a dealer redeeming a reward.
**Document ID:** Auto-ID.

| Field | Type | Notes |
|---|---|---|
| `redemptionId` | string | == doc id |
| `dealerId` | string | ref |
| `rewardId` | string | ref |
| `rewardTitle` | string | snapshot |
| `pointsSpent` | number | snapshot of `pointsRequired` |
| `status` | string | `requested`\|`approved`\|`fulfilled`\|`cancelled` |
| `statusHistory` | array<map> | `[{status, at, byUid, note}]` |
| `ledgerEntryId` | string | the `redeem` entry (nullable) |
| `shippingAddress` | map | for physical rewards |
| `fulfilmentRef` | string | courier/voucher ref |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "redemptionId": "rdm_77...",
  "dealerId": "dlr_8sKp...",
  "rewardId": "rwd_iphone16",
  "rewardTitle": "Apple iPhone 16",
  "pointsSpent": 95000,
  "status": "approved",
  "statusHistory": [
    { "status": "requested", "at": "2026-06-19T04:00:00Z", "byUid": "dlr_8sKp..." },
    { "status": "approved", "at": "2026-06-19T06:00:00Z", "byUid": "adm_001" }
  ],
  "ledgerEntryId": "led_redeem_91...",
  "createdAt": "2026-06-19T04:00:00Z",
  "updatedAt": "2026-06-19T06:00:00Z"
}
```

---

## 11. `announcements`

**Purpose:** Broadcast messages to dealers (offers, news).
**Document ID:** Auto-ID.

| Field | Type | Notes |
|---|---|---|
| `announcementId` | string | == doc id |
| `title` / `body` | string | |
| `imageUrl` | string | nullable |
| `audience` | map | `{tiers:[], regions:[], all:bool}` |
| `publishedAt` | timestamp | |
| `expiresAt` | timestamp | nullable |
| `createdBy` | string | admin uid |

```json
{
  "announcementId": "ann_05",
  "title": "Monsoon Mega Offer",
  "body": "Double points on all tables this week.",
  "audience": { "all": true },
  "publishedAt": "2026-06-18T00:00:00Z",
  "createdBy": "adm_001"
}
```

---

## 12. `marketing_creatives`

**Purpose:** Branded creative assets in the Dealer Growth Hub.
**Document ID:** Auto-ID.

| Field | Type | Notes |
|---|---|---|
| `creativeId` | string | == doc id |
| `title` | string | |
| `type` | string | `festival`\|`whatsapp`\|`instagram`\|`poster` |
| `assetUrl` | string | Cloud Storage |
| `thumbnailUrl` | string | |
| `minTier` | string | tier gate (nullable) |
| `tags` | array<string> | |
| `active` | boolean | |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "creativeId": "crv_diwali_01",
  "title": "Diwali WhatsApp Banner",
  "type": "whatsapp",
  "assetUrl": "https://.../diwali_wa.png",
  "thumbnailUrl": "https://.../diwali_wa_thumb.png",
  "minTier": "Silver",
  "tags": ["festival", "diwali"],
  "active": true,
  "createdAt": "2026-06-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

---

## 13. `growth_service_requests`

**Purpose:** Dealer requests for digital-presence services (Google Business, social setup, local ads, influencer campaigns).
**Document ID:** Auto-ID.

| Field | Type | Notes |
|---|---|---|
| `requestId` | string | == doc id |
| `dealerId` | string | ref |
| `type` | string | `google_business`\|`social_setup`\|`local_ads`\|`influencer_campaign` |
| `details` | map | free-form intake fields |
| `status` | string | `requested`\|`in_review`\|`in_progress`\|`completed`\|`rejected` |
| `assignedSalesManager` | string | SM uid |
| `statusHistory` | array<map> | |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "requestId": "gsr_31",
  "dealerId": "dlr_8sKp...",
  "type": "google_business",
  "details": { "businessName": "Sharma Furniture House", "city": "Ambala" },
  "status": "in_progress",
  "assignedSalesManager": "sm_2x9...",
  "statusHistory": [
    { "status": "requested", "at": "2026-06-10T00:00:00Z", "byUid": "dlr_8sKp..." },
    { "status": "in_progress", "at": "2026-06-12T00:00:00Z", "byUid": "sm_2x9..." }
  ],
  "createdAt": "2026-06-10T00:00:00Z",
  "updatedAt": "2026-06-12T00:00:00Z"
}
```

---

## 14. `learning_modules`

**Purpose:** Learning Center training modules (videos + quizzes) that award points.
**Document ID:** Auto-ID or `lm_*`.

| Field | Type | Notes |
|---|---|---|
| `moduleId` | string | == doc id |
| `title` / `description` | string | |
| `videoUrl` | string | Cloud Storage / CDN |
| `durationSec` | number | |
| `quiz` | array<map> | `[{q, options:[], correctIndex}]` |
| `passThreshold` | number | min correct to pass |
| `pointsAwarded` | number | bonus on pass |
| `minTier` | string | optional gate |
| `active` | boolean | |
| `createdAt` / `updatedAt` | timestamp | |

```json
{
  "moduleId": "lm_upsell101",
  "title": "Upselling Tables 101",
  "description": "How to bundle chairs and tables.",
  "videoUrl": "https://.../upsell101.mp4",
  "durationSec": 360,
  "quiz": [
    { "q": "Best bundle for families?", "options": ["1 chair", "4 chairs + 1 table", "table only"], "correctIndex": 1 }
  ],
  "passThreshold": 1,
  "pointsAwarded": 150,
  "active": true,
  "createdAt": "2026-03-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

---

## 15. `quiz_attempts`

**Purpose:** Records quiz submissions; passing attempts trigger a `bonus` ledger entry.
**Document ID:** Auto-ID.

| Field | Type | Notes |
|---|---|---|
| `attemptId` | string | == doc id |
| `dealerId` | string | ref |
| `moduleId` | string | ref |
| `answers` | array<number> | chosen option indices |
| `score` | number | correct count |
| `passed` | boolean | |
| `pointsAwarded` | number | 0 unless passed |
| `ledgerEntryId` | string | bonus entry (nullable) |
| `createdAt` | timestamp | |

```json
{
  "attemptId": "qa_5521",
  "dealerId": "dlr_8sKp...",
  "moduleId": "lm_upsell101",
  "answers": [1],
  "score": 1,
  "passed": true,
  "pointsAwarded": 150,
  "ledgerEntryId": "led_bonus_lm...",
  "createdAt": "2026-06-15T07:00:00Z"
}
```

---

## 16. `leaderboard_snapshots`

**Purpose:** Privacy-preserving leaderboard. Exposes **only** percentile bands + badges to peers — **never raw sales/points** of other dealers.
**Document ID:** `{period}` (e.g. `2026-Q2`) or Auto-ID per period/region.

| Field | Type | Notes |
|---|---|---|
| `snapshotId` | string | == doc id |
| `period` | string | e.g. `2026-Q2` |
| `region` | string | nullable (national if absent) |
| `bands` | map | `{top10:[dealerId], top25:[...], fastestGrowing:[...], regionalChampions:[...]}` |
| `dealerBadges` | map<string,array<string>> | `{dealerId: ["top10","fastest_growing"]}` |
| `generatedAt` | timestamp | |

> Self-view: a dealer reads only their own bands/badges + their own absolute numbers (from their ledger). Peer raw numbers are never stored here, so they cannot leak via rules.

```json
{
  "snapshotId": "2026-Q2",
  "period": "2026-Q2",
  "region": "NORTH-HR",
  "bands": {
    "top10": ["dlr_8sKp..."],
    "top25": ["dlr_8sKp...", "dlr_91aQ..."],
    "fastestGrowing": ["dlr_91aQ..."],
    "regionalChampions": ["dlr_8sKp..."]
  },
  "dealerBadges": { "dlr_8sKp...": ["top10", "regional_champion"] },
  "generatedAt": "2026-06-19T00:00:00Z"
}
```

---

## 17. `achievements` / `badges`

**Purpose:** Catalog of badges and per-dealer earned achievements.
**Document ID:** badge key (catalog); per-dealer earned stored under `dealers/{id}/achievements/{badgeKey}` subcollection or in this collection keyed `{dealerId}_{badgeKey}`.

| Field | Type | Notes |
|---|---|---|
| `key` | string | e.g. `first_order`, `tier_gold`, `quiz_master` |
| `title` / `description` | string | |
| `iconUrl` | string | |
| `criteria` | map | machine rule (optional) |
| `dealerId` | string | (earned record) |
| `earnedAt` | timestamp | (earned record) |

```json
{
  "key": "tier_gold",
  "title": "Gold Member",
  "description": "Reached Gold tier.",
  "iconUrl": "https://.../badge_gold.png",
  "dealerId": "dlr_8sKp...",
  "earnedAt": "2026-04-01T00:00:00Z"
}
```

---

## 18. `favorites`

**Purpose:** Dealer's saved products for quick reorder.
**Document ID:** stored as subcollection `dealers/{id}/favorites/{sku}`.

| Field | Type | Notes |
|---|---|---|
| `sku` | string | == doc id |
| `addedAt` | timestamp | |

```json
{ "sku": "CHR-ECO-RED-001", "addedAt": "2026-06-01T00:00:00Z" }
```

---

## 19. `notifications` / `nudges`

**Purpose:** Persisted in-app notifications and gamification nudges (also delivered via FCM).
**Document ID:** Auto-ID; stored under `dealers/{id}/notifications/{auto}`.

| Field | Type | Notes |
|---|---|---|
| `notificationId` | string | == doc id |
| `dealerId` | string | ref |
| `type` | string | `nudge_goal_gradient`\|`nudge_loss_aversion`\|`nudge_scarcity`\|`order_status`\|`reward`\|`announcement` |
| `title` / `body` | string | rendered copy |
| `data` | map | deep-link payload |
| `read` | boolean | |
| `createdAt` | timestamp | |

```json
{
  "notificationId": "ntf_900",
  "dealerId": "dlr_8sKp...",
  "type": "nudge_goal_gradient",
  "title": "Almost there!",
  "body": "You're 500 points from Gold.",
  "data": { "route": "/home/tier" },
  "read": false,
  "createdAt": "2026-06-18T10:00:00Z"
}
```

> Nudge copy examples: "You're 500 points from Gold", "Only 3 Diamond spots remain". See gamification mapping in [POINTS_ENGINE.md](./POINTS_ENGINE.md).

---

## 20. `audit_logs`

**Purpose:** Immutable trail of privileged actions (approvals, config changes, status overrides, manual ledger ops). Written only by Cloud Functions.
**Document ID:** Auto-ID.

| Field | Type | Notes |
|---|---|---|
| `logId` | string | == doc id |
| `actorUid` | string | who |
| `actorRole` | string | `admin`\|`salesManager`\|`system` |
| `action` | string | e.g. `dealer.approved`, `points_rules.updated`, `order.status.override` |
| `target` | map | `{collection, docId}` |
| `before` / `after` | map | diff snapshot (nullable) |
| `region` | string | scope (optional) |
| `createdAt` | timestamp | |

```json
{
  "logId": "aud_4410",
  "actorUid": "adm_001",
  "actorRole": "admin",
  "action": "points_rules.updated",
  "target": { "collection": "gamification_config", "docId": "current" },
  "before": { "defaultExpiryWindowDays": 365 },
  "after": { "defaultExpiryWindowDays": 540 },
  "createdAt": "2026-06-15T00:00:00Z"
}
```

---

## 21. Relationships

```
admins ─┐
sales_managers ──< assignedDealers >── dealers ──┬──< orders >── (embedded line items)
                                                 │        └──> points_ledger (earn/reverse)
                                                 ├──< redemptions >── rewards
                                                 │        └──> points_ledger (redeem)
                                                 ├──< quiz_attempts >── learning_modules
                                                 │        └──> points_ledger (bonus)
                                                 ├──< growth_service_requests >── sales_managers
                                                 ├──< favorites (subcollection)
                                                 ├──< notifications (subcollection)
                                                 └──< achievements (earned)
tiers ──(thresholds/benefits)── dealers.tier
gamification_config / points_rules ──(drives)── points_ledger earn computation
leaderboard_snapshots ──(bands/badges only)── dealers
audit_logs ── all privileged mutations
```

- `dealers` is the hub entity; almost everything dealer-scoped references `dealerId`.
- `orders`, `redemptions`, `quiz_attempts` each produce exactly the corresponding `points_ledger` entries via Cloud Functions.
- `sales_managers.assignedDealers` is the authority for Sales Manager scoping in security rules.

---

## 22. Indexes

Recommended Firestore composite indexes (admin/analytics & dealer queries):

| Collection | Fields (in order) | Backs |
|---|---|---|
| `orders` | `dealerId ASC`, `placedAt DESC` | dealer order history |
| `orders` | `status ASC`, `placedAt DESC` | admin order queue |
| `orders` | `region ASC`, `status ASC`, `placedAt DESC` | SM/region order views |
| `points_ledger` | `dealerId ASC`, `createdAt DESC` | dealer points history |
| `points_ledger` | `dealerId ASC`, `quarter ASC` | quarterly tier sums |
| `points_ledger` | `type ASC`, `expiresAt ASC`, `expired ASC` | expiry sweep |
| `dealers` | `region ASC`, `tier ASC` | tier distribution / regional analytics |
| `dealers` | `status ASC`, `createdAt DESC` | approval queue |
| `redemptions` | `status ASC`, `createdAt DESC` | redemption queue |
| `redemptions` | `dealerId ASC`, `createdAt DESC` | dealer redemption history |
| `growth_service_requests` | `assignedSalesManager ASC`, `status ASC` | SM work queue |
| `growth_service_requests` | `dealerId ASC`, `createdAt DESC` | dealer requests |
| `quiz_attempts` | `dealerId ASC`, `createdAt DESC` | dealer learning history |
| `rewards` | `active ASC`, `category ASC`, `pointsRequired ASC` | marketplace browse |

Single-field indexes are auto-created by Firestore; the above declare the multi-field ones in `firestore.indexes.json`.

---

## 23. Margin-Aware Points: Computation & Storage

**Why margin-aware:** Points reward profitable behavior. If points scaled with sale price, dealers could farm points by stockpiling cheap, low-margin SKUs. Instead, the admin assigns `pointsPerUnit` per SKU as a function of the manufacturer's `marginPerUnit`. (`marginPerUnit` is admin-only and not exposed to dealers.)

**Effective per-unit points:**
```
effectivePPU(sku) = gamification_config.pointsPerSkuOverrides[sku]
                    ?? products[sku].pointsPerUnit
```

**Order points (computed by `creditPointsOnConfirm` at Confirmed):**
```
pointsEarned = Σ over lineItems ( effectivePPU(sku) × qty ) × activeCampaignMultiplier
```
Full formula, scope rules, and worked examples are in [POINTS_ENGINE.md](./POINTS_ENGINE.md) §1–§3.

**Storage of computed points:**
- `order.pointsToBeEarned` — estimate written at placement (pending).
- `order.pointsCredited` + `order.appliedMultiplier` — written when status hits **Confirmed**.
- A single `points_ledger` `earn` entry (`points`, `balanceAfter`, `expiresAt`, `quarter`, `idempotencyKey`) — the immutable truth.
- `dealers.pointsBalance` / `quarterPoints` / `lifetimePoints` — rollups updated in the same transaction.

---

## 24. Points Lifecycle (pending → credited → reversed → expiry)

```
   PLACED                 CONFIRMED                 CANCEL / RETURN            TIME PASSES
 ┌─────────┐  status →  ┌───────────┐  status →  ┌──────────────┐         ┌──────────────┐
 │ pending  │──────────►│ credited   │──────────►│ reversed      │   ...   │ expired       │
 │ estimate │           │ ledger:earn│           │ ledger:reverse│         │ ledger:expiry │
 └─────────┘           └───────────┘           └──────────────┘         └──────────────┘
  order.points          +points, balanceAfter      −points (negates       −remaining lot,
  ToBeEarned            updates rollups,            original earn),         sets earn lot
  (no ledger yet)       sets expiresAt              restores prior          expired=true
```

1. **Pending** — at **Placed**, `pointsToBeEarned` is an estimate; **no ledger entry** exists, balance unchanged.
2. **Credited** — at **Confirmed**, `creditPointsOnConfirm` appends an `earn` entry (with `expiresAt = confirmedAt + expiryWindowDays`), updates rollups, sets `order.pointsCredited`.
3. **Reversed** — on **Cancelled/Returned**, `reversePointsOnCancelOrReturn` appends a `reverse` entry negating the earn; idempotent, restores rollups and `quarterPoints`.
4. **Expiry** — the daily `expirePoints` sweep finds `earn`/`bonus` lots past `expiresAt`, appends an `expiry` entry for the unredeemed remainder, sets the lot `expired=true`.

Redemptions append `redeem` entries; quiz passes append `bonus` entries. Every state change is a **new append-only row** — nothing is mutated or deleted, preserving the audit guarantee. Details and numeric walkthroughs: [POINTS_ENGINE.md](./POINTS_ENGINE.md).
