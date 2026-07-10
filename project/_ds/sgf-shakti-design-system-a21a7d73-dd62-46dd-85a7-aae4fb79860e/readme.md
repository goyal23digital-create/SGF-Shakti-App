# SGF Shakti — Design System

**Brand:** SGF Shakti Moulded Furniture
**Tagline:** *Har Ghar Shakti* ("Strength in every home")
**Category:** Moulded plastic furniture — chairs, tables, stools, storage, kids & outdoor.
**Primary audience:** Dealers & distributors (B2B), with a consumer-facing storefront.

This project is the canonical design system: brand foundations (color, type, spacing, elevation, motion), a 22-component React library, four product UI kits, a slide template and brand stickers. An automated compiler bundles the components into `_ds_bundle.js` and exposes them under the global namespace **`SGFShaktiDesignSystem_a21a7d`**.

## Source material
- **Master logo:** `assets/logo/logo-full.png` (supplied by the user). Monogram crop: `assets/logo/logo-mark.png`.
- No website, app, codebase or Figma was provided — the system is derived from the brand mark, the tagline, and the moulded-furniture category. UI-kit screens are therefore **original branded recreations of typical product surfaces**, not copies of an existing product.

---

## Competitive positioning
Benchmarked against the Indian moulded-furniture field — **Italica, Nilkamal, Supreme, Cello, Varmora, Prima**. The category norms and where SGF Shakti sits:

- **Italica** is the design-forward reference point: premium-but-affordable, sustainability + certification led (ISO 9001 / CE / virgin PP), glossy finishes, an aspirational "jazz up your space" voice, and a **wide colourway range** (ivory, maroon, gold, leaf, grey, black, red…). 
- **Nilkamal / Supreme** anchor the mass-trust, ubiquity-and-distribution end; **Cello / Varmora / Prima** compete on value and range.
- **SGF Shakti's lane:** *premium-feeling, value-priced, family-trust* — "Har Ghar Shakti." We out-warm the corporate players (the Hindi signature, family framing, 10-year warranty) while matching Italica on design polish and certification cues (ISI, virgin polymer, 150 kg load). Visual system therefore pairs a **confident navy + energetic orange** (ownable vs. competitors' reds/greens) with a **premium cream** tier and a **full furniture-colourway palette** for product rendering.

---

## Content fundamentals — voice & copy
SGF Shakti speaks like a **dependable, family-minded Indian manufacturer that is also modern and value-led**. The brand sells trust and durability, not hype.

- **Tone:** confident, plain-spoken, reassuring. Short declarative sentences. "Built to last." "The chairs simply don't break."
- **Person:** addresses the reader as **you** ("Stock fast, sell faster"); refers to the company as **we / SGF Shakti**.
- **Casing:** Sentence case for body and most headings. **Condensed UPPERCASE with wide tracking** for eyebrows, labels and seals (echoes the spaced "MOULDED FURNITURE" in the logo).
- **Hindi accents:** the tagline appears in Devanagari (हर घर शक्ति) and romanised (Har Ghar Shakti) as a recurring signature — primarily in hero/opener/sticker moments. Body copy stays English.
- **Numbers & proof:** lead with concrete, earned facts — *10-year warranty, 150 kg load tested, ISI certified, virgin polymer, 500+ dealers, since 2015*. Currency is **₹ (Indian grouping: ₹1,24,500)**.
- **Vibe:** strength, family, value, made-in-India pride. No emoji. No exclamation-heavy hype. No invented jargon.
- **Examples:**
  - Hero: *"Strength in every home." / हर घर शक्ति*
  - Product: *"Single-mould · 150 kg load"*
  - CTA: *"Shop the range" · "Become a dealer" · "Add to PO"*
  - Dealer: *"Trade pricing, tap to reorder."*

---

## Visual foundations
**Colour.** Two brand colours sampled from the logo:
- **Shakti Orange** (`--orange-500 #F7941D`, gradient `#FFBA1F→#F2790A`) = energy, action, CTAs, highlights, seals.
- **Shakti Blue** (`--blue-500 #0E63D6` → deep navy `--blue-900 #0B2142`) = structure, identity, trust, links, dark surfaces.
- Neutrals are a **cool slate** ramp (`--slate-*`); strongest text is near-navy `--ink #0E1B2E`. Status colours: green/amber/red. Orange is used sparingly as the single accent per view; blue carries structure. Brand gradient (`--grad-brand`) runs orange→blue per the monogram.
- **Premium tier:** a warm **cream/sand** family (`--cream-50/100`, `--sand-200/300`) for upmarket surfaces (letterhead, with-compliments). **Support accents** `--teal-500` and `--plum-500` for campaigns/infographics. A full **product colourway** set (`--cw-ivory…--cw-charcoal`: ivory, cream, marigold, cherry, maroon, leaf, teal, sky, walnut, charcoal, graphite, white) mirrors the finishes the category actually sells — use these for product tiles/renders.

**Type.** A modern grotesque system:
- **Display:** Bricolage Grotesque (700/800), tight tracking — headlines & hero. Characterful, editorial, premium.
- **Body:** Hanken Grotesk (400/500) — running text, UI. Clean, modern, highly legible.
- **Condensed:** Saira Condensed — eyebrows, labels, table headers, seals (UPPERCASE, 0.12–0.24em tracking), echoing the logo's spaced "MOULDED FURNITURE".
- *(Loaded from Google Fonts CDN — see Caveats.)*

**Backgrounds.** The brand leans **minimal and light**: surfaces are white / slate-50 / warm cream, separated by thin 1px borders rather than dark fills. A single **orange accent** (bar, rule, or pill) carries emphasis; deep navy is used only as ink-level text, **not** as background fills or gradients. Product photography sits on a neutral light studio tile. No decorative glows or dark hero blocks.

**Shape & elevation.** Generous, tactile **rounded corners** (cards 16px, pills for buttons/badges) — fitting moulded furniture. Shadows are **navy-tinted, soft and layered** (not black); CTAs get colour-tinted shadows (`--shadow-accent`, `--shadow-brand`). Borders are 1px `--slate-200/300`.

**Buttons & cards.** Buttons are **fully pill-shaped**. Accent = orange gradient (primary CTA), primary = solid blue, secondary = white + border, plus ghost/danger. Cards are white, 1px subtle border, soft shadow; `interactive` cards **lift 3px** on hover.

**Motion.** Grounded and quick — fades + small lifts, **no bounce, no spin**. Hover lifts 1–3px and brightens slightly; press scales to ~0.97. Standard easing `cubic-bezier(.2,.6,.2,1)`, 140–340ms. Honors `prefers-reduced-motion`.

**Imagery vibe (when real photos are added).** Warm, bright, true-colour product shots on clean light backgrounds; lifestyle shots of Indian homes/businesses. Not moody, not b&w.

---

## Iconography
- **System:** [Lucide](https://lucide.dev) — clean 2px-stroke, rounded line icons — loaded from CDN (`unpkg.com/lucide`). This is a **substitution**: the brand had no icon set of its own, and Lucide's friendly rounded stroke matches the soft moulded aesthetic. Flag for the user if a bespoke set is preferred.
- **Usage:** stroke icons at 16–24px in UI, 1.4-stroke larger line-icons as furniture placeholders. Brand-blue or muted-slate by default; orange only for emphasis.
- **Emoji:** not used. The recycle glyph (♻) appears only on the "Virgin Polymer" seal.
- **Seals/stickers:** quality marks (ISI, 10-Year Warranty, 150 kg, Made in India) are built as CSS die-cut badges — see `guidelines/brand-stickers.html`.

---

## Index / manifest
**Root**
- `styles.css` — global entry (consumers link this). `@import`s the token files only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`, `motion.css`, `fonts.css`, `base.css`.
- `assets/logo/` — `logo-full.png`, `logo-mark.png`.
- `SKILL.md` — Agent-Skills entry point.

**Foundation cards** (`guidelines/`, Design System tab): colour (orange / blue / neutrals / semantic / gradients), type (display / body / eyebrow / scale), spacing / radius / elevation, brand logo lockups, **brand stickers & seals**.

**Components** (`components/`, namespace `SGFShaktiDesignSystem_a21a7d`) — 22 total:
- `forms/` — Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch
- `core/` — Card, Badge, Tag, Avatar, StatCard
- `feedback/` — Alert, Dialog, Toast, Tooltip, ProgressBar
- `navigation/` — Tabs, Breadcrumb, Pagination
- `data/` — Table
- Each has `.jsx` + `.d.ts` + `.prompt.md`; one `*.card.html` per directory.

**UI kits** (`ui_kits/`)
- `website/` — consumer storefront: home, catalog, product detail (interactive).
- `dealer-portal/` — B2B trade portal: login, dashboard, trade catalogue, orders.
- `operations/` — internal order-management dashboard with CSS charts.
- `mobile/` — Android consumer shopping app (device frame).

**Slides** (`slides/`) — `title`, `content`, `comparison`, `big-quote` (1280×720).

**Stationery** (`stationery/`) — business card front/back, A4 letterhead, DL envelope, with-compliments slip, HTML email signature (for Chetan Goyal, Managing Director). Print-ready, on-brand. *Contact details are placeholders — see Caveats.*

---

## Caveats
- **Fonts** load from Google Fonts CDN (Bricolage Grotesque, Hanken Grotesk, Saira Condensed). For offline/production use, self-host the woff2 files and update `tokens/fonts.css` — the compiler reports 0 bundled `@font-face` because they're remote.
- **Product photography:** 13 real studio photos of the SGF Shakti / National moulded range (wood-finish armchairs, dining chairs, storage stools) are in `assets/products/` and wired into the **website** and **mobile** UI kits (hero, grids, product detail). Catalog now reflects the real line — armchairs, dining chairs, storage stools — so the earlier placeholder tables/kids/cabinet categories were removed. Photos are on a light-grey studio backdrop; for a pure-white catalog look they can be background-removed on request. Other surfaces (slides, ops dashboard) still use icon placeholders.
- **Logo** is supplied as an opaque, white-background PNG, so a clean reverse/knockout (white logo on navy) isn't possible — a transparent or white version is needed for dark surfaces. (Stationery works around this by placing the monogram inside white "badge" tiles on navy.)
- **Stationery contact details are placeholders** — mobile `+91 98250 12345`, office `+91 2827 245 678`, `chetan@sgfshakti.com`, Rajkot GIDC address, GSTIN/CIN. Replace with Chetan Goyal's real details before printing. Title assumed **Managing Director** — confirm.
- **Icons** use Lucide (substitution), not a bespoke set.
- UI-kit screens are **original**, brand-derived recreations — there was no existing product to copy.
