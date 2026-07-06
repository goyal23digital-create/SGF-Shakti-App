# SHAKTI CLUB — Dealer App & Gamification Blueprint
**SGF Shakti · Version 1.0 · July 2026**

> **The one-line idea:** turn every dealer's phone into an SGF Shakti branch — where ordering is easy, loyalty pays visibly, and stocking SGF Shakti feels like being on a winning team, not just buying chairs.

---

## 1. Why Gamification Works on Dealers (and where it fails)

Dealers in your discovery form are frustrated by five things: thin margins, unreliable supply, no customer pull, warranty burden, and price wars. A gamified app doesn't replace fixing those — it **makes your fixes visible, measurable, and emotionally rewarding.** The psychology, mapped honestly:

| Psychological lever | Dealer translation | App mechanic |
|---|---|---|
| **Status** (most powerful in trade) | "Main is company ka Gold partner hoon" — said proudly in the market | Tiers, badges, leaderboard, physical tier certificate on the shop wall |
| **Visible progress** | Margin schemes today are opaque; dealers never know where they stand | Live points balance + tier progress bar ("₹42,000 more this quarter for Gold") |
| **Loss aversion** | Fear of losing a status/streak is stronger than desire to gain | Tier maintenance, monthly order streaks, expiring points |
| **Variable reward** | Fixed schemes get boring; surprise doesn't | Scratch cards on orders, lucky draws |
| **Reciprocity** | "Company ne mujhe Thailand bheja" = decades of loyalty stories | Experiential rewards: trips, founder dinner, factory visit |
| **Competition + belonging** | Trade is a small world; everyone knows everyone | District leaderboards, Shakti Club identity, WhatsApp community |

**Where it fails (design against these from day 1):** points that feel like paisa-counting (keep values meaningful), unreachable tiers for small dealers (use size-based leagues), fraud (QR verification), and complexity (a dealer must understand the whole program in one 60-second explanation).

---

## 2. Program Identity

- **Name:** **Shakti Club** — the SGF Shakti Partner App. (Alternatives considered: Shakti Star, SGF Partner; "Club" wins because it signals belonging + exclusivity and works verbally in Hindi/Punjabi: *"Shakti Club mein ho?"*)
- **Currency:** **Shakti Points (SP)** — icon: the orange S-monogram coin.
- **Motto inside the app:** *"Jitna Shakti bechoge, utni Shakti kamaoge."* (The more Shakti you sell, the more Shakti you earn.)
- **Visual language:** exactly per the Style Guide — white canvas, navy text, blue-gradient tier cards, orange reserved for points, rewards and CTAs. The app should look like the Apple/IKEA of dealer apps; every competitor's dealer scheme is a photocopied WhatsApp flyer, and that contrast IS the positioning.

---

## 3. The Core Loop

```
ORDER (in-app or via salesperson)
   → invoice paid → SP credited automatically (+ scratch card)
   → SP + volume push TIER progress
   → tier unlocks BENEFITS (margin, credit days, priority dispatch)
   → SP redeem in REWARDS STORE (credit notes, gold, trips)
   → LEADERBOARD + badges give status in the market
   → status + benefits make the NEXT order the obvious choice
```

Secondary loops: **scan carton QR** (verifies stock movement, earns bonus SP, gives you sell-through data you've never had), **upload display photo** (free in-shop branding audit), **refer a dealer** (network growth), **complete a launch mission** (new SKU adoption).

---

## 4. Points Economy (the engine room — numbers matter)

### 4.1 Golden rule
**Total program cost ≤ 1.25% of dealer billing.** At your ₹30–40/chair margin structure, this is affordable only if points are earned on **paid invoices** (never on booking) and the burn is budgeted like a scheme, not a gift. Every rupee of points is a *planned* trade-scheme rupee, redirected into a far more motivating format.

### 4.2 Earning table

| Action | Shakti Points | Cost as % of billing | Notes |
|---|---|---|---|
| **Base purchase** | 1 SP per ₹100 of paid invoice value (ex-GST) | 0.25% | The backbone; automatic on payment reconciliation |
| **On-time / early payment** | +25% bonus SP on that invoice | ~0.06% avg | Quietly fixes your receivables — often the highest-ROI rule in the whole program |
| **Carton QR scan (goods received)** | +5 SP per carton scanned, capped at invoice quantity | ~0.03% | Verifies delivery, arms your data engine |
| **Monthly order streak** | Month 2: +100 · M3: +200 · M4+: +300 SP/month | ~0.05% | One "streak freeze" allowed per quarter (monsoon mercy) |
| **New SKU mission** | 2× SP on the launched model for 60 days | budgeted per launch | Solves the "Radha Gold has more designs" gap by making *your* new designs move |
| **Full-truck order** | +500 SP flat | small | Nudges order consolidation → your freight economics improve |
| **Display photo of the month** | +100 SP (approved photo of SGF display in shop) | tiny | Free merchandising network |
| **Dealer referral** | +1,000 SP when referred dealer's first order is paid | tiny | Cheapest acquisition channel, formalised |
| **Warranty QR activated by end-customer** (Phase 3) | +2 SP per chair registered | tiny | Proof of pull-through; builds your consumer database |
| **Festival multipliers** | Diwali/summer-season 2× windows (14 days) | plan ~0.15% | Announce loudly; these create the "event" feeling |

### 4.3 Redemption value
**1 SP = ₹0.25** of reward value. Minimum redemption 2,000 SP (₹500). **Points expire 12 months after earning** (creates urgency; expiry reminders at 60/30/7 days convert beautifully).

### 4.4 Worked example (show this exact table to dealers — transparency sells the program)
A dealer billing **₹2,00,000/month**, paying on time, scanning cartons, holding a streak:

| Source | SP/month |
|---|---|
| Base (₹2L) | 2,000 |
| On-time bonus | 500 |
| QR scans (~130 cartons) | 650 |
| Streak (steady) | 300 |
| **Total ≈ 3,450 SP ≈ ₹860/month ≈ ₹10,350/year** | |

…plus tier benefits, scratch cards, and draw entries on top. For you: ~0.55% of billing in points + ~0.4% in tier benefits — inside the 1.25% cap, and largely replacing unstructured discounts you'd have given anyway.

---

## 5. Tiers — the Status Ladder

Qualification on **rolling 12-month paid billing** (so one bad month never demotes instantly; recalculated quarterly). Numbers below are placeholders to calibrate against your real dealer distribution — set thresholds so roughly 50/30/15/5% of dealers land in the four tiers.

| | 🤍 **Shakti Sathi** | 🩶 **Shakti Silver** | 🥇 **Shakti Gold** | 🔷 **Maha Shakti** |
|---|---|---|---|---|
| 12-mo billing | Entry (first order) | ₹6L+ | ₹15L+ | ₹35L+ |
| SP earn multiplier | 1.0× | 1.1× | 1.2× | 1.3× |
| Dispatch priority | Standard | Standard | **Priority queue** | **First-out guarantee** |
| Credit days | Standard | +7 days | +15 days | Custom terms |
| Exclusive designs | — | — | Early access | **Territory-exclusive SKUs** |
| Annual reward | Diwali gift | Diwali gift+ | **Factory visit + dinner with founder** | **Family trip (Thailand/Dubai class)** |
| Support | App + helpline | App + helpline | Named account manager | Founder's direct line |
| Physical kit | Certificate | Silver shop plaque | **Gold plaque + premium glow sign** | Maha Shakti trophy + shop makeover |

Design notes: *Shakti Gold* deliberately echoes **SGF = Shakti Gold Furniture** — the tier every dealer names first. Tier-up moments are celebrated: in-app confetti, WhatsApp congratulation video, mention in the monthly Shakti Bulletin, plaque couriered within 7 days. **Demotion is soft:** one grace quarter with a "defend your tier" mission before dropping.

---

## 6. Mechanics in Detail

### 6.1 Scratch cards (the dopamine layer)
Every paid invoice above ₹25,000 generates one in-app scratch card: 60% chance 20–50 SP, 30% chance 100–250 SP, 9% chance 500 SP, 1% chance 2,000 SP + "Jackpot" badge. Costs ~0.05% of billing; feels like magic. Cards expire in 72 hours (come back to the app!).

### 6.2 Leaderboards (status, engineered fairly)
- **Monthly District Leaderboard** and **Annual State Leaderboard**.
- Ranked by SP earned (not raw billing) so bonus behaviours count.
- **Leagues by dealer size** (Sathi/Silver compete separately from Gold/Maha) — a small-town dealer must be able to win something, or he ignores the whole app.
- Show **Top 10 + "your rank"** only; never show the bottom.
- Monthly district winner: 500 SP + "District Champion" badge + Bulletin feature. Annual state winner: on stage at the dealer meet.

### 6.3 Badges (collect-them-all trophy case)
First Order · Truck Master (first full truck) · **8855 Champion** (100+ units of the hero model) · Streak Veteran (12-month streak) · Referral Star (3 referrals) · Festival Hero · Jackpot Winner · Pehla Scan · District Champion ×N. Badges display on the dealer's profile — and on a printable "Shakti Club Partner" certificate for the shop wall, which is where status actually lives in the trade.

### 6.4 Missions (monthly, max 3 live at once)
Format: clear goal + deadline + reward. Examples: *"Order 200 Jordan units this month → 2× SP"* · *"Stock the new colour range → +750 SP"* · *"Clear payment before the 10th → +30% bonus"* · *"Diwali display contest — best decorated SGF corner wins 5,000 SP."* Missions are your remote-control on dealer behaviour: whatever the business needs this month becomes a mission.

### 6.5 Quarterly Mega Lucky Draw
Every 1,000 SP earned in the quarter = 1 entry (earned, not spent — so redemption isn't punished). Prizes: 1× family trip, 2× 10g silver coin, 10× 2,000 SP. Draw done **live on video** with dealers watching — a quarterly community event that costs less than one newspaper ad and generates a month of WhatsApp buzz.

### 6.6 Festival calendar
Pre-summer (Feb–Mar, peak chair season): "Shakti Summer Dhamaka" 2× window · Diwali: double points fortnight + display contest · Holi: colour-range mission · New Year: annual awards + tier certificates. The app becomes the place where the trade year *happens*.

---

## 7. Rewards Store (what SP buys)

Ordered by what dealers actually value (from your form: margin, credit, supply, support):

| Category | Examples | SP price logic |
|---|---|---|
| **Credit notes** ⭐ most popular | ₹500 / ₹1,000 / ₹5,000 off next invoice | 2,000 / 4,000 / 20,000 SP |
| **Gold & silver coins** | 1g/5g/10g — ties to "Shakti *Gold*" | market-linked; the aspirational shelf |
| **Business boosters** | Extra 7 credit days (one invoice) · Priority dispatch token · 50-sticker branding pack · Festival flex printing for shop | 1,500–6,000 SP |
| **Shop assets** | Glow sign board · display rack · branded counter mat | 8,000–15,000 SP |
| **Electronics & lifestyle** | Mixer, smartwatch, phone — via a rewards fulfilment API (Xoxoday/Qwikcilver class) | catalogue-priced |
| **Experiences** | Factory VIP visit · dealer meet front-row · **founder dinner** | invite + SP hybrid |

Rules: redemption in-app, fulfilled within 14 days, credit notes auto-apply to the ledger, every fulfilled reward gets a photo → next Bulletin (social proof loop).

---

## 8. Anti-Fraud & Governance (boring but existential)

1. **Points only on PAID invoices** — reconciliation with Tally/Busy/your ERP is the trigger, never the order.
2. **Unique QR per carton** (serialised at packing, ~₹0.20/label): one scan ever, geo-tagged, must match an invoiced quantity. Kills fake-scan farming and gives you a live map of where stock actually flows.
3. **Returns claw back points** automatically.
4. **Caps:** scan bonus capped at invoiced cartons; referral capped at 5/quarter; scratch cards 1/invoice.
5. **Program T&C in-app** (points are a discretionary scheme, non-transferable, company may amend — vet with your CA for GST treatment of credit notes vs. gifts; gifts above thresholds have tax implications for dealers, credit notes are cleanest).
6. **Liability dashboard for you:** outstanding SP value, monthly burn %, cost-of-program vs billing — reviewed monthly; auto-alert if program cost crosses 1.25%.

---

## 9. App Specification — Screen by Screen

**Languages: English / हिन्दी / ਪੰਜਾਬੀ toggle. Design tokens: exactly the Style Guide (white canvas, navy text, orange = points & CTAs, blue-gradient tier cards).**

1. **Login/KYC** — mobile OTP; dealer code issued by sales team; GST + shop photo upload; approval by admin.
2. **Home (the dashboard)** — greeting with tier ring around avatar · SP balance (orange coin, animated count-up) · tier progress bar *"₹42,000 to Shakti Gold"* · live missions (max 3 cards) · scratch-card shelf · quick actions: Order / Scan / Rewards / Ledger.
3. **Catalogue** — every model with white-bg photos, colours, carton size, MOQ; dealer-specific pricing; "Add to order." Filter: chairs/tables/stools/kids. New-launch section with a **"Vote on next colour"** poll (co-creation = ownership).
4. **Order & Tracking** — cart → order request → sales confirmation → dispatch status → truck/LR details → "Delivered? Scan cartons now" prompt. (MVP can route the confirmed cart to WhatsApp/your sales team; full order management comes in Phase 2.)
5. **Scan QR** — camera scan, instant "+5 SP" toast, running scan count vs invoice.
6. **My Ledger** — outstanding, credit limit, credit days (tier-linked), invoice list with paid/unpaid status, *"Pay before 10th → +25% SP"* nudge. Transparency here directly attacks the trade's biggest trust gap.
7. **Rewards Store** — the catalogue above; redemption history; points expiry ticker.
8. **Leaderboard & Badges** — district/state tabs, league labels, trophy case, shareable "champion card" image (dealers WILL forward these on WhatsApp — free marketing).
9. **Shakti Media Kit** — downloadable product images, festival posts auto-stamped with the dealer's shop name & number, strength-demo reels to forward.
10. **Support** — replacement/complaint ticket with photo upload + status tracking (turns your warranty promise into a visible process), helpline, WhatsApp deep link.
11. **Notifications** — SP credits, dispatch updates, mission deadlines, expiry warnings; mirrored on WhatsApp via API for the dealers who never open apps.
12. **Admin web panel (for your office)** — dealer approvals, invoice/points reconciliation, mission builder, reward fulfilment queue, liability dashboard, broadcast composer, sell-through map from QR scans.

---

## 10. How to Build It — Three Routes

| | Route A: Loyalty SaaS | Route B: Low-code MVP | Route C: Custom build ⭐ recommended path |
|---|---|---|---|
| What | White-label channel-loyalty platforms (Almonds AI, LoyaltyXpert, Channelplay class — common in Indian building-materials/paint trade) | FlutterFlow/Glide + Airtable/Sheets | Flutter app + Node/Firebase backend + admin panel |
| Speed | 3–6 weeks | 4–8 weeks | 10–16 weeks for MVP |
| Cost | ₹15–40k/month + setup | ₹1–2L one-time + dev time | ₹4–8L MVP + ₹15–30k/mo maintenance |
| Pros | Proven fraud controls, QR infra, rewards catalogue ready | Cheap validation | Fully yours: your UX, your data, ledger/ERP integration, no per-dealer fees, becomes a real moat |
| Cons | Generic look (your premium-minimal edge dilutes), per-user pricing hurts at scale, data lives elsewhere | Fragile at scale, weak offline support | Slowest to first version |

**Recommended play:** pilot the *program* (not the app) in month 1 via WhatsApp + a Google Sheet with your top 15 dealers — prove the points economy moves behaviour. Simultaneously commission the **custom Flutter build (Route C)** for the MVP scope below. If budget is tight, Route A for year 1 while custom is built is a legitimate bridge.

### Phased scope
- **MVP (launch):** login/KYC · home dashboard · points ledger (auto from paid invoices) · tiers · catalogue with dealer pricing · order-to-WhatsApp · rewards store (credit notes + 10 items) · notifications · admin panel.
- **Phase 2 (month 4–6):** carton QR scan-to-earn · scratch cards · leaderboards & badges · missions builder · media kit · complaint ticketing · Punjabi/Hindi.
- **Phase 3 (month 7–12):** full in-app ordering with live dispatch tracking · warranty-QR consumer registration (pull data!) · sub-dealer/retailer layer · design-vote co-creation · lucky-draw module.

---

## 11. Launch Plan

**Weeks 1–2 — Pilot:** hand-pick 15 dealers across all sizes; personal call from the founder ("aap founding members ho"); founding-member badge + 2,000 SP signing bonus; run points on the manual bridge; collect friction notes weekly.

**Weeks 3–8 — Refine:** fix the top 5 frictions; finalise tier thresholds against real billing data; print tier plaques; shoot a 90-second explainer video in Hindi (founder on camera: *"Shakti Club kya hai"*).

**Week 9 — Grand launch:** a physical/hybrid **Shakti Club Dealer Meet** — app demo on the big screen, first tier plaques awarded on stage, every attending dealer onboarded on the spot with 1,000 SP welcome bonus, group photo → press-style post. Trade launches are theatre; give them theatre.

**Ongoing:** sales team KPI includes "app-active dealers"; every new dealer's onboarding = welcome kit + app install in the first meeting; monthly mission calendar planned one quarter ahead.

---

## 12. KPIs & the ROI Case

| Metric | Target (month 6) |
|---|---|
| Dealer adoption (installed & KYC'd) | 85% of active dealers |
| Monthly active usage | 70% |
| 45-day repeat-order rate | +15 pts vs pre-app baseline |
| Average order value | +10% (missions + truck bonus) |
| On-time payment rate | +20 pts (the sleeper win) |
| Referral-sourced new dealers | 2–4/month |
| Program cost | ≤1.25% of program-dealer billing |
| Points liability | reviewed monthly, expiry working |

**Simple ROI math:** if 40 dealers billing ₹2L/month lift purchases just 10% because of the program, that's ₹9.6L/year of incremental billing *per… every single dealer cohort* — against a program cost of ~₹1.2L/year in points for that cohort plus app amortisation. The receivables improvement from the on-time-payment bonus is usually worth the entire program by itself.

---

## 13. Why This Beats Radha Gold & Anmol

They compete on old relationships and design count. **Shakti Club changes the question.** A dealer choosing between brands now weighs: transparent points on every rupee, a status the whole market can see, priority dispatch he can feel, credit-day rewards for good behaviour, marketing content served to his phone, and a founder who puts his best partners on a stage. None of that can be photocopied by a competitor's WhatsApp flyer — and every month a dealer stays in the Club, his switching cost grows.

*"Shakti Club mein ho?" — make that a question dealers ask each other in the market. That is the day SGF Shakti stops being a factory and becomes a brand.*

**हर घर शक्ति.**

*End of Blueprint v1.0*
