# SGF Shakti — Dealer Growth Platform

A premium, mobile-first **B2B Dealer Growth Platform** for a plastic furniture
manufacturer (chairs & tables). It is not a basic ordering app — it is a loyalty
and business-growth engine that drives **order frequency**, **average order
value**, and **dealer retention** through points, tiers, aspirational rewards,
and in-app growth services.

Built with **Flutter** (dealer mobile app + web admin) and designed for a
**Firebase** backend (Auth phone OTP · Cloud Firestore · Cloud Functions · FCM ·
Storage). The app ships with an offline **mock data layer** so the entire
experience is explorable today without any backend.

---

## ✨ Experience highlights

| Area | What's built |
|------|--------------|
| **OTP onboarding** | Phone → OTP → business KYC (name, GST, PAN, address) with an *endowed-progress* welcome bonus. |
| **Dashboard** | Gradient hero, **animated tier progress ring**, points balance, behavioural nudges ("X pts to Platinum"), active orders, announcements, quick-reorder. |
| **Catalog** | Chairs/tables grid with SKU, dealer price, pack size, **stock status**, **margin-based points per pack**, search, category filters, favorites. |
| **Cart & checkout** | Live **points-to-be-earned preview** (campaign-multiplier aware), delivery ETA, order summary, place-order flow. |
| **Orders** | List + detail with a 6-stage tracking timeline (Placed → … → Delivered), invoices, points status. |
| **Rewards** | Aspirational marketplace (marketing credits, smartwatch, TV, laptop, iPhone, scooter, trips) with **progress indicators**, tier gating, and redemption history. |
| **Growth Hub** | Branded marketing **creatives**, requestable **digital-presence services** (Google Business, social, local ads, influencer), and a **Learn & Earn** center (videos + quizzes that award points). |
| **Recognition** | Privacy-safe leaderboard — only **Top 10% / Top 25% / Fastest Growing / Regional Champions** bands + achievement badges. Never exposes peers' raw numbers. |
| **Profile** | Tier benefits, lifetime stats, KYC, and an auditable **points ledger**. |

### Gamification, by design
Goal-gradient (always near a milestone), endowed progress (starter points),
loss aversion ("3 Diamond spots remain"), social proof, and status signaling are
woven through the UI — progress rings, tier badges, achievement badges, and
nudge copy. See [`docs/POINTS_ENGINE.md`](docs/POINTS_ENGINE.md).

### Margin-aware points
Points are earned from the manufacturer's **margin per unit** (admin-set
`pointsPerUnit` per SKU), never the sale price — so dealers can't game the system
with high-volume, low-margin orders. Points credit only after an order is
**Confirmed**, are written to an **append-only ledger**, and reverse on
cancellation/return.

---

## 🏗 Architecture

Clean, layered, and modular — every screen depends on **repository
interfaces**, never a concrete data source. Swapping the `Mock*Repository`
implementations for `Firebase*` ones makes it live with **zero UI changes**.

```
lib/
├── core/            theme · router · points engine · utils
├── data/
│   ├── models/      domain models (tier, dealer, product, order, reward, …)
│   ├── mock/        offline seed data
│   └── repositories/ repository interfaces + mock implementations
├── state/           ChangeNotifier controllers (session, cart)
├── widgets/         reusable UI (progress ring, tier badge, cards, …)
└── features/        one folder per screen/flow
    ├── auth/ dashboard/ catalog/ cart/ orders/
    └── rewards/ growth/ leaderboard/ profile/ shell/
```

State management: **Provider / ChangeNotifier** (simple, dependable, no
code-gen). Routing: **go_router** with a persistent bottom-nav shell.

Full details: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 📚 Documentation

| Doc | Contents |
|-----|----------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System diagram, layers, Firestore rules, Cloud Functions, future hooks (AI reorder, AR). |
| [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | 20+ Firestore collections with fields, example docs, indexes, points lifecycle. |
| [`docs/ADMIN_DASHBOARD.md`](docs/ADMIN_DASHBOARD.md) | Web admin IA, screens, analytics widgets, role-based access. |
| [`docs/NAVIGATION_FLOWS.md`](docs/NAVIGATION_FLOWS.md) | Route map + ASCII flow diagrams for every dealer journey. |
| [`docs/POINTS_ENGINE.md`](docs/POINTS_ENGINE.md) | Margin-aware formula, ledger guarantees, gamification mapping, worked examples. |

---

## 🚀 Running the app

> Requires the Flutter SDK (3.19+). The app runs fully offline on mock data.

```bash
flutter pub get
flutter run            # mobile (Android/iOS)
flutter run -d chrome  # web
```

**Demo login:** enter any 10-digit number, request OTP, then enter any 6 digits.

### Going live with Firebase
1. `flutterfire configure` (generates `firebase_options.dart`).
2. Uncomment the Firebase dependencies in `pubspec.yaml`.
3. Add `Firebase*Repository` implementations of the interfaces in
   `lib/data/repositories/` and register them in `lib/main.dart`.

No screens or widgets change — only the wiring in `main.dart`.

---

## 🗺 Roadmap (future-ready)
- AI-powered reorder recommendations (engagement data already modelled).
- AR product visualization in the catalog.
- Web admin dashboard build-out (structure specified in `docs/ADMIN_DASHBOARD.md`).
- Sales Manager mobile companion.
