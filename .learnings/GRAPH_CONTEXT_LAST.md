---
type: graph_context
title: Last graphify context pull
source: graph-context.mjs
budget: 1500
cmd: query
at: 2026-07-10T17:13:49.660Z
result_tokens_est: 1221
---

# Graph context (budgeted)

**Command:** `graphify query "contractor website home page layout conversion flow" --budget 1500`
**Budget:** 1500 · **Result ~tokens:** 1221
**Why:** Prefer this over dumping `GRAPH_REPORT.md` or all of `.agents/wiki`.

## Result

```text
Traversal: BFS depth=2 | Start: ['Layout()', 'HomePage()', 'Flow B — Painter works the job (homebase)', 'ConversionFooterCta.tsx', 'Flow G — Auth boundaries', 'HomeClient.tsx', 'page.tsx', 'Website Context Map'] | 194 nodes found

NODE HomeClient.tsx [src=src/app/HomeClient.tsx loc=L1 community=15]
NODE LandingPage.tsx [src=src/views/LandingPage.tsx loc=L1 community=20]
NODE MarketPage.tsx [src=src/components/MarketPage.tsx loc=L1 community=7]
NODE trackEvent() [src=src/lib/analytics.ts loc=L11 community=12]
NODE Estimate.tsx [src=src/views/Estimate.tsx loc=L1 community=12]
NODE LeadForm.tsx [src=src/components/LeadForm.tsx loc=L1 community=9]
NODE Projects.tsx [src=src/views/Projects.tsx loc=L1 community=7]
NODE Contact.tsx [src=src/views/Contact.tsx loc=L1 community=12]
NODE seo.ts [src=src/lib/seo.ts loc=L1 community=7]
NODE breadcrumbSchema() [src=src/lib/seo.ts loc=L103 community=7]
NODE analytics.ts [src=src/lib/analytics.ts loc=L1 community=12]
NODE layout.tsx [src=src/app/layout.tsx loc=L1 community=14]
NODE markets.ts [src=src/data/markets.ts loc=L1 community=19]
NODE Layout.tsx [src=src/components/Layout.tsx loc=L1 community=14]
NODE End-to-end system map [src=docs/SYSTEM_MAP_E2E.md loc=L10 community=49]
NODE ResponsiveImage.tsx [src=src/components/ResponsiveImage.tsx loc=L1 community=7]
NODE landingPages.ts [src=src/data/landingPages.ts loc=L1 community=20]
NODE ResponsiveImage() [src=src/components/ResponsiveImage.tsx loc=L10 community=7]
NODE page.tsx [src=src/app/service-areas/[slug]/page.tsx loc=L1 community=20]
NODE About.tsx [src=src/views/About.tsx loc=L1 community=7]
NODE env.ts [src=src/lib/env.ts loc=L1 community=9]
NODE NotFound.tsx [src=src/views/NotFound.tsx loc=L1 community=20]
NODE Review.tsx [src=src/views/Review.tsx loc=L1 community=12]
NODE ENV [src=src/lib/env.ts loc=L34 community=9]
NODE page.tsx [src=src/app/painting-services/[slug]/page.tsx loc=L1 community=20]
NODE HeroOverlays.tsx [src=src/components/HeroOverlays.tsx loc=L1 community=7]
NODE Capabilities.tsx [src=src/views/Capabilities.tsx loc=L1 community=7]
NODE ConversionFooterCta.tsx [src=src/components/ConversionFooterCta.tsx loc=L1 community=14]
NODE PageTransition.tsx [src=src/components/PageTransition.tsx loc=L1 community=12]
NODE card.tsx [src=src/components/ui/card.tsx loc=L1 community=15]
NODE marketBySlug [src=src/data/markets.ts loc=L152 community=19]
NODE ReviewCarousel.tsx [src=src/components/ReviewCarousel.tsx loc=L1 community=31]
NODE 5. End-to-end flows [src=docs/SYSTEM_MAP_E2E.md loc=L185 community=49]
NODE Refer.tsx [src=src/views/Refer.tsx loc=L1 community=12]
NODE BookingCta.tsx [src=src/components/BookingCta.tsx loc=L1 community=9]
NODE PageTransition() [src=src/components/PageTransition.tsx loc=L11 community=12]
NODE SocialLinks.tsx [src=src/components/SocialLinks.tsx loc=L1 community=14]
NODE ServiceAreaMap.tsx [src=src/components/ServiceAreaMap.tsx loc=L1 community=12]
NODE ServiceArea.tsx [src=src/views/ServiceArea.tsx loc=L1 community=7]
NODE sitemap.ts [src=src/app/sitemap.ts loc=L1 community=20]
NODE contact.ts [src=src/lib/contact.ts loc=L1 community=9]
NODE FadeIn.tsx [src=src/components/animations/FadeIn.tsx loc=L1 community=20]
NODE landingPagePath() [src=src/data/landingPages.ts loc=L397 community=20]
NODE IconFeatureCard.tsx [src=src/components/IconFeatureCard.tsx loc=L1 community=7]
NODE FadeIn() [src=src/components/animations/FadeIn.tsx loc=L15 community=20]
NODE IconFeatureCard() [src=src/components/IconFeatureCard.tsx loc=L16 community=7]
NODE CalBooking.tsx [src=src/components/CalBooking.tsx loc=L1 community=36]
NODE serviceSchema() [src=src/lib/seo.ts loc=L85 community=7]
NODE buildEstimateMailto() [src=src/lib/contact.ts loc=L5 community=9]
NODE createClient() [src=src/lib/supabase/client.ts loc=L3 community=31]
NODE BeforeAfterSlider.tsx [src=src/components/BeforeAfterSlider.tsx loc=L1 community=7]
NODE businessSchema [src=src/lib/seo.ts loc=L5 community=7]
NODE LandingPageRoute() [src=src/views/LandingPage.tsx loc=L42 community=20]
NODE AnimatedCounter.tsx [src=src/components/ui/AnimatedCounter.tsx loc=L1 community=15]
NODE page.tsx [src=src/app/residential/page.tsx loc=L1 community=19]
NODE page.tsx [src=src/app/public-sector/page.tsx loc=L1 community=19]
NODE Website Context Map [src=context.md loc=L1 community=152]
NODE ProjectsPage() [src=src/views/Projects.tsx loc=L90 community=7]
NODE page.tsx [src=src/app/commercial/page.tsx loc=L1 community=19]
NODE MarketPage() [src=src/components/MarketPage.tsx loc=L20 community=7]
NODE Commercial.tsx [src=src/views/Commercial.tsx loc=L1 community=19]
NODE PublicSector.tsx [src=src/views/PublicSector.tsx loc=L1 community=19]
... (truncated — 132 more nodes cut by ~1500-token budget. Narrow with context_filter=['call'] or use get_node for a specific symbol)
```
