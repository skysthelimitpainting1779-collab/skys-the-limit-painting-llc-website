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

## 9. Stitch / agent usage

When generating screens in Google Stitch or image-to-code:

1. Paste **§1–§7** as system design constraints  
2. Specify surface (marketing | portal | homebase)  
3. Reference slug **skysthelimit** in file names and copy only when needed  
4. Prefer Safety Orange CTAs on Pitch Canvas  

Template copy for new products: `docs/templates/DESIGN.md`.
