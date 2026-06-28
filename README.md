# SGF Shakti — Landing Page

A fast, responsive, conversion-focused landing page for **SGF Shakti**, a plastic
moulded furniture manufacturer (*Har Ghar Shakti*). Built as a self-contained
static site — no build step, no dependencies. Just open `index.html` or host the
folder anywhere.

## Structure

```
index.html            # markup + SEO meta + structured data
assets/css/styles.css # design system, components, responsive rules
assets/js/main.js     # scroll reveal, count-ups, mobile nav, tilt, form
```

## Features

- **B2B lead-focused layout** — hero with dual CTA, trust-stat bar, product grid,
  why-partner cards, industries, manufacturing proof, testimonials, dealer band,
  and a short ≤7-field quote form.
- **Motion** — scroll-reveal, animated stat count-ups, hero parallax tilt,
  industries marquee, sticky header state, back-to-top, pulsing WhatsApp button.
- **Responsive** — desktop, tablet, and mobile with a slide-in mobile menu.
- **Accessible** — skip link, focus styles, ARIA on interactive elements,
  `prefers-reduced-motion` support, and a `<noscript>` reveal fallback.
- **SEO** — unique title/description, Open Graph tags, Organization JSON-LD.

## Before going live — replace these placeholders

Search `index.html` for `[...]` brackets:

- `[Add factory city & state]` / `[Factory city, state]` — real address
- `[Mon–Sat, 10am–7pm]` — actual working hours
- `[GST No.]` — GST / registration number
- Stats (`data-count` values) — confirm real figures (years, product count)
- **Testimonials** — swap the representative profiles for named quotes + logos
- **Catalogue link** — point "Download Catalogue" buttons at the real PDF
- **Form** — wire `#quoteForm` submit to email / WhatsApp / CRM (see `main.js`)
- **Social links** — add real LinkedIn / Facebook / Instagram URLs
- **Product images** — the audit's top priority: add real product photos on a
  plain background (the icon cards are placeholders for the visual style)

## Notes

Decide on **one** founding figure (the brief flags a "four decades" vs "over 10
years" contradiction on the old site) and keep it consistent everywhere.
