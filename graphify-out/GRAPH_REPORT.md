# Graph Report - skysthelimit-collab  (2026-06-12)

## Corpus Check
- 103 files · ~2,699,212 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 529 nodes · 712 edges · 64 communities (54 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]

## God Nodes (most connected - your core abstractions)
1. `trackEvent()` - 18 edges
2. `PageMeta()` - 17 edges
3. `PageTransition()` - 17 edges
4. `compilerOptions` - 15 edges
5. `FadeIn()` - 14 edges
6. `breadcrumbSchema()` - 13 edges
7. `scripts` - 11 edges
8. `ResponsiveImage()` - 11 edges
9. `Sky's the Limit Painting LLC - Website` - 11 edges
10. `handler()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AnalyticsBridge()` --calls--> `trackEvent()`  [EXTRACTED]
  src/App.tsx → src/lib/analytics.ts
- `MarketPage()` --calls--> `serviceSchema()`  [EXTRACTED]
  src/components/MarketPage.tsx → src/lib/seo.ts
- `AboutPage()` --calls--> `breadcrumbSchema()`  [EXTRACTED]
  src/pages/About.tsx → src/lib/seo.ts
- `CapabilitiesPage()` --calls--> `breadcrumbSchema()`  [EXTRACTED]
  src/pages/Capabilities.tsx → src/lib/seo.ts
- `ContactPage()` --calls--> `breadcrumbSchema()`  [EXTRACTED]
  src/pages/Contact.tsx → src/lib/seo.ts

## Import Cycles
- None detected.

## Communities (64 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (18): FadeIn(), FadeInProps, BeforeAfterSliderProps, LeadForm(), MarketPage(), MarketPageProps, PageMeta(), PageMetaProps (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (43): dependencies, dotenv, express, @google/genai, lucide-react, motion, @phosphor-icons/react, react (+35 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (10): marketBySlug, MarketCapability, markets, MarketSlug, supportingImages, trustPillars, businessSchema, conversionSteps (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (12): RemotionRoot(), assets, BrandHeroLoop(), clamp, ease, FrameAsset, heroFrames, Market (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (13): ScrollToTop(), AboutPage, CapabilitiesPage, CommercialPage, ContactPage, EstimatePage, LandingPageRoute, NotFoundPage (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (12): BookingCtaProps, bookingLabels, buildEstimateMailto(), openEstimateEmail(), CabinetKey, Cabinets, Dimensions, NumericDimensionKey (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.20
Nodes (15): areaLandingPages, LandingPage, landingPageByKindAndSlug(), landingPageBySlug(), LandingPageKind, landingPagePath(), landingPages, serviceLandingPages (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (15): 1. Residential Painting Landing Page 🧬, 2. Commercial & Facility Painting Landing Page 🧬, 3. Parking Lot Striping & Pavement Markings Landing Page 🧬, 4. Public-Sector & Municipal Painting Landing Page 🧬, Bid Prerequisites, Core Benefits & Value Propositions, Core Capabilities, Credentials Banner (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (13): asText(), buildAutoReplyHtml(), buildLeadHtml(), buildLeadId(), escapeHtml(), handler(), isPayload(), requiredFields (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.19
Nodes (8): ConversionFooterCta(), proofItems, CustomCursor(), Layout(), LayoutProps, SocialLinks, trackEvent(), AnalyticsBridge()

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (11): budgetOptions, LeadFormProps, projectOptions, propertyOptions, Status, timelineOptions, Testimonial, testimonials (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (11): Asset Usage Notes, Claim Guardrail Checklist, Delivered Pages, Deployment Instructions, 🧬 Elite Branching & CI/CD Posture, Image Usage Directory, Missing Asset List, Setup Instructions (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (8): businessSchema, canonicalFor(), distDir, escapeHtml(), injectHead(), landingRoutes, routes, siteUrl

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (9): 1. Brand Identity & Value Proposition 🧬, 2. Marketing Hooks by Segment 🧬, 3. High-Conversion Headlines 🧬, 4. Compliance & Verification Log 🧬, A. Residential Painting (Exterior & Interior), B. Commercial Painting & Facility Coatings, C. Parking Lot Striping & Layout, D. Public-Sector & Municipal Bids (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.44
Nodes (7): asText(), buildLeadHtml(), buildLeadId(), handler(), sendLeadWebhook(), sendToHubspot(), sendWithResend()

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (8): Context, [ERR-20260521-001] replace_file_content, Error, Errors Log, Metadata, Resolution, Suggested Fix, Summary

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (7): 1. HubSpot Welcome List Configuration 🧬, 2. Automated Responder Email Template 🧬, 3. Google Sheets Integration Map 🧬, A. Dynamic List: "New Twin Cities Prospects", Column Mapping:, HubSpot and Google Sheets Integration Guide 🧬, Subject Line: Your Twin Cities Painting Project — Sky's the Limit Painting LLC

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (6): Agent Source Notes, Contributions, Ignored Instructions, Improvements to the Website, Inspected Skills, Usefulness

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (6): Deployment, Environment, Pre-Deploy Checklist, Production Platform, Release Tags, Rollback

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): Build Fails, Lead Form Issues, `npm ci` Fails, Troubleshooting, Type Check Fails, Video or Image Missing

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (6): Actual Result, Environment, Expected Result, Screenshots or Notes, Steps to Reproduce, What Happened

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (6): buildCommand, framework, headers, installCommand, outputDirectory, redirects

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (6): Commercial Painting, Generated Support Images, Interior Painting, Pavement Marking / Striping, Removed / Not For Public Use, Visual Asset Map

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (5): Documentation Routing, Exact Edit Targets, Primary Routes, Verification Hooks, Website Context Map

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (5): Application Shape, Architecture, Build Path, Key Directories, Operational Priorities

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (5): Code Standards, Git Standards, Repository Rules, Security Rules, Validation Before Merge

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (5): Guardrails, Human Review Still Matters, Self-Healing Automation, What Exists, What "Self-Healing" Means Here

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (5): Agent Operating Rules, Agent Skill Location, Recommended, Required, Team Skills

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (5): Configured Systems, Core Commands, Notes, Repository, Repository Configuration

### Community 30 - "Community 30"
Cohesion: 0.73
Nodes (5): add_overlays(), composite(), open_cover(), square_composite(), tint()

### Community 31 - "Community 31"
Cohesion: 0.47
Nodes (5): brandColors, calculateContrast(), checks, getLuminance(), getRGB()

### Community 33 - "Community 33"
Cohesion: 0.40
Nodes (3): proofItems, ServiceAreaMapProps, serviceAreaPins

### Community 34 - "Community 34"
Cohesion: 0.40
Nodes (4): Branches, Labels, Repository Organization, Review Expectations

### Community 35 - "Community 35"
Cohesion: 0.40
Nodes (4): Description, Notes, Type of Change, Validation

### Community 36 - "Community 36"
Cohesion: 0.40
Nodes (4): Language Composition, Repository Index, Repository Information, Summary

### Community 37 - "Community 37"
Cohesion: 0.40
Nodes (4): Acceptance Criteria, Goal, Notes, Proposed Change

### Community 38 - "Community 38"
Cohesion: 0.40
Nodes (4): 1. Directory Tree & URL Hierarchy 🧬, 2. XML Sitemap Specifications 🧬, 3. SEO Metadata Guidelines 🧬, XML Sitemap and Service-Area Mapping 🧬

### Community 39 - "Community 39"
Cohesion: 0.40
Nodes (3): paintingServicesSlugs, serviceAreasSlugs, staticRoutes

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (3): API Directory Context, Functional Roles, Reality Notes

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (3): Active Docs, Brain Routing, Website Documentation Context

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (3): ai, analyze(), main()

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (3): 1. Functional Directory Roles, 2. Compliance Constraints, Code Directory Context: Page Views

### Community 44 - "Community 44"
Cohesion: 0.83
Nodes (3): resolveAny, resolveCname, verifyDNS()

### Community 45 - "Community 45"
Cohesion: 0.50
Nodes (3): 1. Functional Directory Roles, 2. Codebase Directories Layout, Code Directory Context: Source Root

## Knowledge Gaps
- **252 isolated node(s):** `requiredFields`, `ai`, `name`, `private`, `version` (+247 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `trackEvent()` connect `Community 10` to `Community 0`, `Community 33`, `Community 2`, `Community 4`, `Community 6`, `Community 7`, `Community 11`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `PageMeta()` connect `Community 0` to `Community 2`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `PageTransition()` connect `Community 0` to `Community 2`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `requiredFields`, `ai`, `name` to the rest of the system?**
  _252 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._