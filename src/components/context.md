# Code Directory Context: Reusable UI Components

**Directory Path:** `src/components/`  
**Purpose:** Defines the modular elements that drive user engagement, visual aesthetics, and micro-interactions.

> [!NOTE]
>
> ### 🧬 LLM CHEAT SHEET: REUSABLE UI COMPONENTS QUICK REFERENCE
>
> - **Primary Elements:**
>   - `LeadForm.tsx` — Multi-step qualifying form. Connects client inputs to Notion/Zapier pipelines.
>   - `BeforeAfterSlider.tsx` — Interactive comparison slider demonstrating prepping precision.
>   - `ServiceAreaMap.tsx` — Lightweight accessible Twin Cities coverage map with no third-party iframe payload.
>   - `SpotlightCard.tsx` — Premium cards with dynamic mouse spotlight gradient effects.
>   - `TrustAnchors.tsx` — Floating badges for contractor registration, CGL bounds, and warranties.
>   - `ConversionFooterCta.tsx` — Universal pre-footer conversion band with price-range, call/text, proof, and scope-intake CTAs.
>   - `PageMeta.tsx` — Custom SEO meta wrapper handling JSON-LD schema injections and Google site verifications.
>   - `Layout.tsx` — Frame containing `ConversionHeader.tsx`, responsive footers, and Motion for React transitions.

---

## 1. Functional Directory Roles

This folder houses the building block components of the web application. These items are designed to be focus-oriented, responsive, and reusable across multiple page views:

- **BeforeAfterSlider.tsx** — Interactive comparison slider showing meticulous prep vs flawless finished coat, backed by a native range input for keyboard, mouse, and touch accessibility.
- **BookingCta.tsx** — Prominent call-to-action button prompting leads to schedule estimates.
- **ConversionFooterCta.tsx** — Site-wide conversion section rendered before the footer, promoting the room price-range calculator, call/text action, and verified contractor proof points on every route.
- **ConversionHeader.tsx** — Premium navigation header featuring phone links, service menus, service-area map navigation, primary CTAs, passive scroll handling, and reduced-motion-safe mobile menu animation.
- **CustomCursor.tsx** — Subtle interactive cursor overlay to provide a premium, modern feel.
- **HeroLeadMagnet.tsx** — Hero visual banner with high-impact value proposition.
- **Layout.tsx** — Master frame containing the responsive header, mobile sticky price-range/call CTAs, universal conversion footer band, footer, custom cursor, and transition layouts.
- **LeadForm.tsx** — High-conversion lead capture form with qualification questions, photo-link intake, live endpoint fallback, offline lead queueing, and customer-friendly trust microcopy.
- **MarketPage.tsx** — Dynamically rendered city/market-specific page displaying targeted trust anchors, local portfolios, contact CTAs, and price-range calculator entry.
- **PageMeta.tsx** — Custom dynamic SEO metadata injecter handling tags, descriptions, structural JSON-LD data, and Google Search Console site verification integration.
- **PageTransition.tsx** — Motion for React wrapper for restrained route opacity/position transitions with reduced-motion bypass.
- **ResponsiveImage.tsx** — Fluid image wrapper handling sizes and aspect ratios.
- **ScrollToTop.tsx** — Utility component to reset page scroll position on route shifts.
- **ServiceAreaMap.tsx** — Fast local coverage map component for `/service-area` and homepage conversion proof; uses Motion for React with reduced-motion handling, visible-by-default content, accessible map labeling, keyboard-focusable city pins, and no heavy embedded map iframe.
- **SocialLinks.tsx** — Clean social media footer/sidebar link layout.
- **SpotlightCard.tsx** — Interactive card component with dynamic mouse spotlight hover effects.
- **TrustAnchors.tsx** — High-impact badge display showcasing MN specialty contractor status, insurance, and warranty.
