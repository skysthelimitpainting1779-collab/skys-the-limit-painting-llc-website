# Design System: skysthelimit (Sky's the Limit Painting)

> **SSOT for visual product + marketing.** Used by agents, shadcn product UI, and [Google Stitch](https://labs.google.com/stitch).  
> Package / project slug: **`skysthelimit`**. Templates: `docs/templates/DESIGN.md`.

---

## 1. Visual Theme & Atmosphere

A **premium industrial craftsman** interface: dark workshop meets blueprint precision. Density is **balanced-cockpit** for homebase/admin (6–7) and **gallery-confident** for marketing (4–5). Variance is **asymmetric-editorial** on public pages; product UI is more predictable grids. Motion is **fluid CSS + spring-like easing**, never noisy.

Mood words: raw mechanical tension · high contrast · safety-orange signal · trust green sparingly · no neon SaaS purple.

---

## 2. Color Palette & Roles

| Name | Hex | Role |
|------|-----|------|
| **Pitch Canvas** | `#050505` | Primary page background (`--color-page-bg`) |
| **Off-White Ink** | `#F7F7F7` | Primary text (`--color-page-text`) |
| **Muted Steel** | `#9CA3AF` | Secondary text, captions (`--color-gray-muted`) |
| **Safety Orange** | `#FF5A00` | **Single primary accent** — CTAs, focus, active (`--color-orange-safety`) |
| **Deep Industrial Orange** | `#E94F00` | Hover / pressed accent (`--color-orange-deep`) |
| **Forest Trust** | `#2E7D32` | Success / trust badges only (`--color-green-trust`) |
| **Golden Outline** | `#f0c067` | Links, hairline highlights (secondary signal, not button fill) |
| **Whisper Border** | `rgba(255,255,255,0.10)` | Structural borders on dark surfaces |

**Rules:** Max **one** primary accent (Safety Orange). No purple/neon glows. No pure black `#000000` for text blocks (use Pitch Canvas). Prefer theme tokens in product UI (`bg-background`, `text-muted-foreground` via shadcn) mapped to this palette.

---

## 3. Typography Rules

| Role | Font | Notes |
|------|------|--------|
| **Display** | Satoshi | Bold, modern; marketing headings; controlled uppercase where brand already uses it |
| **Body** | Geist | Readable longform and UI |
| **Mono** | Fira Code / Geist Mono | IDs, metrics, timestamps, code |

- Hierarchy via **weight + color**, not only size  
- Body max ~65ch on long marketing copy  
- **Banned:** Inter as brand face · generic Georgia/Times for UI · serif in dashboards  
- Homebase density ≥7: numbers in mono  

---

## 4. Component Stylings

### Marketing
- **Radius:** strict **0px** (raw mechanical tension)  
- **Cards / blocks:** sharp borders `border-white/10` or gold-tinted left rules  
- **CTAs:** Safety Orange fill; tactile active press; optional shimmer overlay (existing `.shimmer-cta`)  
- **Hero:** asymmetric preferred; no “scroll to explore” chevrons  

### Product (homebase / portal / shadcn)
- Style: existing `components.json` (**base-nova**); compose with Card, Table, Badge, Tabs, Sheet  
- Density: comfortable (`p-4`/`p-6`, `text-sm`)  
- Destructive: **AlertDialog**, not Dialog  
- Empty / loading: Skeleton + designed empty Card — no bare “No data”  

---

## 5. Layout Principles

- Marketing: spacious vertical rhythm (`py-20`–`py-24`)  
- Product: sidebar + main; sticky page headers  
- Max content width containment on marketing (~1400px)  
- Mobile: single column under 768px; 44px touch targets  
- No equal 3-card feature rows on marketing; prefer zig-zag or bento  

---

## 6. Motion & Interaction

- Easing: `cubic-bezier(0.32, 0.72, 0, 1)` (`--ease-premium`)  
- Entries: fade-up (`.reveal-up`)  
- Marquee OK for proof/trust strips  
- Animate **transform/opacity only**  
- Prefer reduced-motion respect for a11y  

---

## 7. Anti-Patterns (Banned)

- Emojis in product chrome  
- Inter as primary UI font  
- Pure black text on pure black  
- Neon outer glow / purple AI gradients  
- Glassmorphism on every card  
- Generic “Elevate / Seamless / Unleash” copy  
- Fake stats (`99.9%`) without source  
- Centered hero + three equal cards default layout  
- Mounting `/cms` over `/admin`  
- Ignoring `docs/NAMING.md` slug  

---

## 8. Surfaces map

| Surface | Path | Design mode |
|---------|------|-------------|
| Marketing | `/`, markets, estimate | Industrial craftsman dark |
| Client portal | `/portal` | Product dark, shadcn, calm |
| Painter homebase | `/admin` | Product dark, dense tables/board |
| CMS | `/cms` | Payload admin (minimal brand chrome) |

---

## 9. Target look — homepage hero (LOCKED)

**Reference:** `references/frontend-target-hero.png` (source of truth for marketing chrome).

### Layout

| Zone | Spec |
|------|------|
| **Utility bar** | Full-width black strip: phone · email left; trust line right (desktop) |
| **Primary nav** | Logo mark + wordmark left; nav center/right (Residential · Commercial · Public Sector · Projects · About · Resources) · **Price Range** orange pill · **Call / phone** orange outline |
| **Hero** | Full-bleed real-work photo (painter on exterior, warm daylight); **left-weighted dark gradient** so type stays legible |
| **Trust chips** | Row of dark rounded-rect badges under subhead (Twin Cities Metro · MN ID · Fully Insured · Public-sector ready) |
| **H1** | Large white display; **one orange accent word** (e.g. **Preps**) — not orange whole line |
| **Subcopy** | Warm off-white (~`#e7dfd2`), max ~65ch, metro + markets + prep discipline |
| **CTA row** | (1) **Filled orange** primary · (2) dark secondary · (3) outline/call tertiary |
| **Proof line** | Small checks under CTAs (Fully Insured · Owner-Led · MN ID · COI) |
| **Path strip** | 01–04 steps in dark cards **over** the hero bottom (Tell us · Scope/price · Reserve · Transparency) |
| **Trust footer of hero** | Google rating · “Trusted by…” · MN specialty mark |

### Color roles (marketing)

| Role | Hex / style |
|------|-------------|
| Canvas / bars | Near-black `#050505` / `#0a0a0a` |
| Primary CTA / nav accents | **Safety Orange `#FF5A00`** |
| Body on photo | Warm cream `#e7dfd2` |
| Chips / secondary | `bg-black/60`–`70` + `border-white/10` |
| **Radius** | **0** on industrial edges; chips/CTAs may use **slight** radius only if matching reference pills — default still **0** for cards/blocks |

### Do / don't

- **Do** use real job photography, orange as *signal*, claim-safe MN ID, three clear CTAs  
- **Don't** soft-skip orange to white-primary CTAs; don't fake 5-star if unearned; don't light-mode hero; don't emoji  

### Gap vs current code (as of lock)

| Area | Current | Target |
|------|---------|--------|
| Primary CTA | White fill | **Orange fill** |
| Nav CTAs | White / muted | **Orange pill + orange outline call** |
| Trust chips | Text-only row | **Badge chips** under subhead |
| H1 accent | All white | **Single orange word** |
| Process steps | Below hero border strip | **Overlapping dark cards on hero** |
| Social proof | Later on page | **Google + MN mark under path** |

Implement against this section + the reference PNG. Prefer one pass on `ConversionHeader` + `HomeClient` hero before deeper page restyles.

---

## 10. Stitch / agent usage

When generating screens in Google Stitch or image-to-code:

1. Paste **§1–§7** and **§9** as system design constraints  
2. Attach `references/frontend-target-hero.png` when available  
3. Specify surface (marketing | portal | homebase)  
4. Prefer Safety Orange CTAs on Pitch Canvas; one orange accent in headlines  

Template copy for new products: `docs/templates/DESIGN.md`.
