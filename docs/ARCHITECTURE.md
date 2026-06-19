# System Architecture

> Part of the **SGF Shakti — Dealer Growth Platform** documentation set.
> Related docs: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) · [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) · [NAVIGATION_FLOWS.md](./NAVIGATION_FLOWS.md) · [POINTS_ENGINE.md](./POINTS_ENGINE.md)

---

## 1. Product Overview

SGF Shakti is a premium B2B **Dealer Growth Platform** for a plastic furniture manufacturer (chairs & tables). It consists of:

- A **Flutter dealer mobile app** (Android + iOS) where dealers order products, earn margin-aware points, climb loyalty tiers (Bronze → Silver → Gold → Platinum → Diamond), redeem aspirational rewards, and access business-growth tools.
- A **Flutter web admin dashboard** where Admins and Sales Managers manage dealers, products, orders, rewards, gamification configuration, marketing requests, and analytics.
- A **Firebase backend** providing authentication, data storage, serverless business logic, push notifications, and file storage.

The three user roles are **Dealer**, **Admin**, and **Sales Manager**.

---

## 2. High-Level Component Diagram

```
                         ┌───────────────────────────────────────────────┐
                         │                  CLIENTS                        │
                         │                                                 │
   ┌─────────────────────────────────┐        ┌──────────────────────────┐
   │   Flutter Dealer Mobile App      │        │  Flutter Web Admin       │
   │   (Android / iOS)                │        │  Dashboard               │
   │                                  │        │                          │
   │  • Catalog / Cart / Checkout     │        │  • Dealers / Products    │
   │  • Orders & Tracking             │        │  • Orders / Rewards      │
   │  • Points / Tiers / Leaderboard  │        │  • Gamification Config   │
   │  • Rewards Marketplace           │        │  • Marketing / Campaigns │
   │  • Dealer Growth Hub             │        │  • Analytics / Audit Log │
   │  • Learning Center               │        │                          │
   └───────────────┬──────────────────┘        └────────────┬─────────────┘
                   │                                          │
                   │            HTTPS / Firebase SDK          │
                   └────────────────────┬─────────────────────┘
                                        │
        ┌───────────────────────────────▼────────────────────────────────┐
        │                        FIREBASE BACKEND                          │
        │                                                                  │
        │  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐ │
        │  │ Firebase Auth   │  │ Cloud Firestore │  │ Cloud Functions    │ │
        │  │ (Phone OTP)     │  │ (NoSQL, rules)  │  │ (business logic)   │ │
        │  └────────────────┘  └────────────────┘  └─────────┬──────────┘ │
        │                                                     │            │
        │  ┌────────────────┐  ┌────────────────┐            │            │
        │  │ Cloud Storage   │  │ FCM Push        │◄──────────┘            │
        │  │ (images/assets) │  │ (nudges/alerts) │                        │
        │  └────────────────┘  └────────────────┘                        │
        │                                                                  │
        │  ┌──────────────────────────────────────────────────────────┐  │
        │  │ Future hooks: Vertex AI (reorder recos), AR asset service  │  │
        │  └──────────────────────────────────────────────────────────┘  │
        └──────────────────────────────────────────────────────────────────┘
```

Both Flutter clients talk to Firebase through the official Firebase SDKs. All privileged or trust-sensitive operations (points crediting, ledger writes, tier recomputation, reward redemption settlement) are executed exclusively by **Cloud Functions** so they cannot be tampered with from a client.

---

## 3. Clean Modular Layered Architecture

The codebase follows a layered, dependency-inverted architecture. Dependencies always point **inward** (presentation depends on domain; data implements domain contracts). This keeps the UI testable and the backend swappable.

```
┌──────────────────────────────────────────────────────────────┐
│ PRESENTATION  (Widgets / Screens / Routing)                   │
│   - Flutter widgets, screens, theming, navigation             │
│   - No business logic; consumes state                         │
└───────────────────────────┬──────────────────────────────────┘
                            │ listens to
┌───────────────────────────▼──────────────────────────────────┐
│ STATE  (ChangeNotifier Providers / ViewModels)                │
│   - Holds UI state, orchestrates use cases                    │
│   - Exposes commands + observable state to widgets            │
└───────────────────────────┬──────────────────────────────────┘
                            │ calls
┌───────────────────────────▼──────────────────────────────────┐
│ DOMAIN  (Entities + Use Cases + Repository Interfaces)        │
│   - Pure Dart, no Firebase imports                            │
│   - Business rules, value objects, repository contracts       │
└───────────────────────────┬──────────────────────────────────┘
                            │ implemented by
┌───────────────────────────▼──────────────────────────────────┐
│ DATA  (Repository Implementations + DTOs + Data Sources)      │
│   - FirebaseXRepository  (Firestore/Auth/Storage)            │
│   - MockXRepository      (in-memory, for tests/dev/demos)    │
│   - DTO <-> Entity mappers                                    │
└──────────────────────────────────────────────────────────────┘
```

### Repository abstraction (mock + Firebase)

Every data domain (auth, products, orders, points, rewards, growth, learning, leaderboard) is defined by an **abstract repository interface** in the domain layer, with **two implementations**:

- `MockXRepository` — in-memory, deterministic data. Used for widget tests, golden tests, offline development, demos, and rapid UI iteration.
- `FirebaseXRepository` — backed by Firestore / Auth / Storage / Functions.

The active implementation is selected at app startup via a single **dependency-injection composition root** (driven by build flavor / environment config). Swapping `mock` ↔ `firebase` requires no changes to presentation, state, or domain code.

---

## 4. State Management — Provider / ChangeNotifier

**Choice: `provider` + `ChangeNotifier` (with `ChangeNotifierProvider`, `MultiProvider`, `Consumer`, `Selector`).**

Rationale:

- **Right-sized for the app.** The app is feature-rich but not extreme in real-time complexity; Provider gives clean, testable separation without the boilerplate of heavier solutions.
- **First-class Flutter team support** and a gentle learning curve, which matters for long-term maintainability and onboarding.
- **Granular rebuilds** via `Selector` and scoped providers keep the premium UI smooth.
- **Composition root friendly.** Repositories are injected as `Provider`s at the root; ViewModels (ChangeNotifiers) receive them via `ProxyProvider`, making the mock/Firebase swap trivial.
- **Testability.** ChangeNotifier ViewModels are plain Dart classes tested without the widget tree; repositories are mocked through the same interfaces.

Pattern: one `ChangeNotifier` ViewModel per feature/screen, exposing immutable view state plus command methods. ViewModels never import Firebase — they depend only on domain repository interfaces and use cases.

---

## 5. Flutter `lib/` Folder Structure

```
lib/
├── main.dart                       # entrypoint, runs App with chosen flavor
├── app.dart                        # MaterialApp, theme, router wiring
├── bootstrap/
│   ├── composition_root.dart       # DI: picks mock vs firebase repos
│   ├── firebase_options.dart       # generated per environment
│   └── flavor_config.dart          # dev / staging / prod config
│
├── core/
│   ├── theme/                      # premium design system (colors, type, spacing)
│   ├── routing/                    # route names, router, guards (auth/role)
│   ├── widgets/                    # shared widgets (buttons, cards, progress rings)
│   ├── utils/                      # formatters, validators, extensions
│   ├── error/                      # failures, exceptions, result types
│   └── constants/                  # enums (Tier, OrderStatus, LedgerType, Role)
│
├── domain/
│   ├── entities/                   # Dealer, Product, Order, LedgerEntry, Reward...
│   ├── value_objects/              # Points, Money, Tier, Percentile
│   ├── repositories/               # abstract repo interfaces (contracts)
│   └── usecases/                   # PlaceOrder, RedeemReward, EvaluateTier...
│
├── data/
│   ├── dto/                        # Firestore <-> entity DTOs + mappers
│   ├── datasources/                # Firestore/Auth/Storage/Functions wrappers
│   └── repositories/
│       ├── firebase/               # FirebaseAuthRepository, FirebaseOrderRepo...
│       └── mock/                   # MockAuthRepository, MockOrderRepo...
│
├── state/                          # ChangeNotifier ViewModels per feature
│   ├── auth/                       # AuthViewModel, OnboardingViewModel
│   ├── catalog/                    # CatalogViewModel, ProductDetailViewModel
│   ├── cart/                       # CartViewModel, CheckoutViewModel
│   ├── orders/                     # OrdersViewModel, OrderTrackingViewModel
│   ├── points/                     # PointsViewModel, TierViewModel
│   ├── rewards/                    # RewardsViewModel, RedemptionViewModel
│   ├── growth/                     # GrowthHubViewModel, ServiceRequestViewModel
│   ├── learning/                   # LearningViewModel, QuizViewModel
│   └── leaderboard/                # LeaderboardViewModel
│
└── features/                       # PRESENTATION (screens + feature widgets)
    ├── auth/                       # splash, otp_login, onboarding screens
    ├── home/                       # dashboard (points ring, tier, nudges)
    ├── catalog/                    # catalog, product_detail
    ├── cart/                       # cart, checkout, order_placed
    ├── orders/                     # orders_list, order_tracking
    ├── rewards/                    # marketplace, reward_detail, redemptions
    ├── growth/                     # growth_hub, creatives, service_request
    ├── learning/                   # modules_list, video_player, quiz
    ├── leaderboard/                # leaderboard (percentile bands)
    └── profile/                    # profile, business_info, notifications
```

> The web admin dashboard lives in a separate Flutter target (e.g. `admin/` package or a `web_admin` flavor) but reuses `core`, `domain`, and the Firebase `data` layer. Its structure is described in [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md).

---

## 6. Security Model

### 6.1 Authentication

- **Firebase Auth Phone OTP** is the sole sign-in method for dealers. The phone number is the canonical identity.
- After OTP verification, the dealer completes **onboarding** (business name, GST, PAN, address). Until an Admin/Sales Manager **approves** the dealer, the account is in `pending` status with restricted access.
- Admins and Sales Managers authenticate to the web dashboard (phone OTP or email, per deployment) and are assigned roles via **custom claims**.

### 6.2 Role assignment via custom claims

Roles (`dealer`, `salesManager`, `admin`) and scoping (e.g. a Sales Manager's `assignedDealers` / `region`) are stamped onto the Firebase ID token as **custom claims** by a Cloud Function. Security rules and clients read these claims; clients can never self-elevate because claims are server-controlled.

### 6.3 Firestore security rules approach (per role)

Rules enforce least privilege. Summary of intent (full field-level detail in [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)):

| Collection | Dealer | Sales Manager | Admin |
|---|---|---|---|
| `dealers/{id}` | read/update **own** profile (non-privileged fields only) | read assigned dealers; update growth-related fields | full read/write |
| `products` | read approved/active products | read | read/write |
| `orders` | create + read **own** orders; **cannot** set status or points fields | read orders of assigned dealers | read/write (status via Functions preferred) |
| `points_ledger` | read **own** entries only; **no writes** | read assigned dealers' entries | read; **no client writes** |
| `tiers`, `points_rules`, `gamification_config` | read | read | read/write |
| `rewards` | read active | read | read/write |
| `redemptions` | create + read **own** | read/approve for assigned dealers | full |
| `growth_service_requests` | create + read **own** | read/update for assigned dealers | full |
| `learning_modules` | read | read | read/write |
| `quiz_attempts` | create + read **own** | read assigned | read |
| `leaderboard_snapshots` | read **band/badge fields only** (no raw peer numbers) | read | read/write |
| `audit_logs` | none | read assigned scope (optional) | read; writes via Functions |

Core principles enforced in rules:

- **Clients never write points or money truth.** All `points_ledger` writes, `order.status` transitions, `order.pointsCredited`, and `redemption` settlement are performed only by Cloud Functions (using the Admin SDK, which bypasses rules). Rules explicitly **deny** client writes to these fields.
- **Ownership checks** on every dealer-scoped document (`request.auth.uid == resource.data.dealerId`).
- **Scope checks** for Sales Managers (dealer must be in the manager's `assignedDealers`).
- **Field-level validation** (immutable fields, allowed status transitions, type/shape validation) inside rules where feasible; deeper invariants enforced in Functions.
- **Leaderboard privacy:** rules + data modeling guarantee dealers can read only percentile bands and badges, never peers' raw sales/points.

### 6.4 Storage rules

Product images and marketing creatives are readable by authenticated users; uploads are restricted to Admins. Dealer-uploaded documents (GST/PAN proofs) are readable only by the owner and Admin/assigned Sales Manager.

---

## 7. Cloud Functions Responsibilities

Cloud Functions hold all trust-sensitive business logic. Key functions:

| Function | Trigger | Responsibility |
|---|---|---|
| `onUserCreated` / `completeOnboarding` | Auth create / callable | Create dealer doc (`pending`), grant **endowed starter points** via a `bonus` ledger entry on approval. |
| `setUserRole` | Callable (Admin only) | Set custom claims (`role`, scope) for dealers/SMs/admins. |
| `creditPointsOnConfirm` | Firestore: `orders` status → **Confirmed** | Compute margin-aware points (`Σ pointsPerUnit[sku] × qty × activeMultiplier`), write an **`earn`** entry to the append-only `points_ledger`, update `order.pointsCredited`, recompute dealer's running balance + quarterly total. See [POINTS_ENGINE.md](./POINTS_ENGINE.md). |
| `reversePointsOnCancelOrReturn` | Firestore: `orders` status → cancelled/returned | Write a **`reverse`** ledger entry that negates the prior `earn`, update balances. Idempotent. |
| `redeemReward` | Callable | Validate balance + reward stock, write **`redeem`** ledger entry, create `redemption` (`requested`), decrement reward stock atomically. |
| `settleRedemption` | Firestore: `redemptions` status changes | On `cancelled` before fulfillment, write a compensating ledger entry refunding points. |
| `recomputeTiersQuarterly` | Scheduled (quarter boundary) | Sum each dealer's quarterly points, evaluate against `tiers` thresholds, update `dealer.tier`, snapshot history, fire tier-change nudges. |
| `expirePoints` | Scheduled (daily) | Find ledger lots past `expiresAt`, write **`expiry`** entries reducing balance. See lifecycle in [POINTS_ENGINE.md](./POINTS_ENGINE.md). |
| `buildLeaderboardSnapshot` | Scheduled | Compute percentile bands (Top 10% / Top 25% / Fastest Growing / Regional Champions) and badges; store **only** band/badge data — never raw peer numbers. |
| `awardQuizPoints` | Firestore: `quiz_attempts` passed | Write a **`bonus`** ledger entry for `learning_modules.pointsAwarded`. |
| `sendNudges` | Scheduled + event-driven | Generate goal-gradient / loss-aversion / scarcity nudges and dispatch via **FCM**; record in `notifications`. |
| `writeAuditLog` | Various privileged ops | Append immutable entries to `audit_logs`. |

Idempotency keys and Firestore transactions guarantee that points are never double-credited and ledger balances stay consistent.

---

## 8. Scalability & Future-Ready Hooks

- **Stateless Functions + Firestore autoscaling** handle dealer growth horizontally. Heavy aggregations (analytics, leaderboard) are precomputed into snapshot collections to keep reads cheap and O(1).
- **Composite indexes** (see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)) back all admin queries (filter by region/tier/status/date).
- **Denormalized rollups** (`dealer.pointsBalance`, `dealer.quarterPoints`, `dealer.tier`) avoid scanning the full ledger on every read; the ledger remains the immutable source of truth.
- **AI reorder recommendations (future):** an `onOrderConfirmed` hook can stream order history to Vertex AI; recommendations land in a `recommendations` collection surfaced on the dealer Home. The domain layer already abstracts a `RecommendationRepository` slot.
- **AR product visualization (future):** products carry `images[]` plus reserved `arAssetUrl` / `modelUrl` (glTF/USDZ) fields in Cloud Storage; a `ProductArViewer` presentation hook can render them without schema changes.
- **Event-driven extensibility:** new gamification mechanics attach as additional Functions listening to existing triggers, with no client changes.

---

## 9. Environments & Configuration

| Environment | Purpose | Backend |
|---|---|---|
| `dev` | Local development, mock repositories available | Firebase dev project / emulator suite |
| `staging` | Pre-release QA, real Firebase, seeded data | Firebase staging project |
| `prod` | Live dealers | Firebase production project |

- **Build flavors** (`dev` / `staging` / `prod`) select `firebase_options.dart`, the data-source implementation (mock vs Firebase), API config, and feature flags via `flavor_config.dart`.
- **Firebase Emulator Suite** (Auth + Firestore + Functions + Storage) is used in `dev` for fast, offline, cost-free iteration and CI integration tests.
- **Secrets** (e.g. third-party keys) live in Cloud Functions runtime config / Secret Manager — never in the client bundle.
- **Feature flags** (e.g. AR viewer, AI recos) gate not-yet-GA capabilities per environment.

---

## 10. Cross-Document Map

| Concern | Document |
|---|---|
| Data model, collections, indexes, points lifecycle storage | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| Web admin IA, screens, role-based access | [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) |
| Dealer app routes & flow diagrams | [NAVIGATION_FLOWS.md](./NAVIGATION_FLOWS.md) |
| Margin-aware points formula & gamification | [POINTS_ENGINE.md](./POINTS_ENGINE.md) |
